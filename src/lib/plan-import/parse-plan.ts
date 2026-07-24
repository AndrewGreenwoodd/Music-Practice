export class PlanParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanParseError";
  }
}

export type ParsedItem = {
  title: string;
  description: string | null;
  orderIndex: number;
};

export type ParsedCategory = {
  slug: string;
  name: string;
  dailyMinMinutes: number | null;
  dailyMaxMinutes: number | null;
  orderIndex: number;
  items: ParsedItem[];
};

export type ParsedPhase = {
  title: string;
  durationLabel: string | null;
  goal: string;
  milestone: string | null;
  orderIndex: number;
  categories: ParsedCategory[];
};

export type ParsedPlan = {
  title: string;
  description: string | null;
  phases: ParsedPhase[];
};

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function stripTrailingParenthetical(heading: string): { text: string; parenthetical: string | null } {
  const match = heading.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!match) return { text: heading.trim(), parenthetical: null };
  return { text: match[1].trim(), parenthetical: match[2].trim() };
}

function parseMinutesRange(label: string): { min: number | null; max: number | null } {
  const match = label.match(/(\d+)\s*(?:-|–|to)\s*(\d+)\s*min/i) ?? label.match(/(\d+)\s*min/i);
  if (!match) return { min: null, max: null };
  if (match.length === 3) {
    return { min: Number(match[1]), max: Number(match[2]) };
  }
  return { min: Number(match[1]), max: null };
}

function stripBoldMarkers(text: string): string {
  const trimmed = text.trim();
  const boldMatch = trimmed.match(/^(?:\*\*|__)(.+?)(?:\*\*|__)(.*)$/);
  if (boldMatch) return `${boldMatch[1]}${boldMatch[2]}`.trim();
  return trimmed;
}

function matchLabeledLine(line: string, label: string): string | null {
  const unbolded = line.trim().replace(/\*\*|__/g, "");
  const pattern = new RegExp(`^${label}\\s*:\\s*(.+)$`, "i");
  const match = unbolded.match(pattern);
  return match ? match[1].trim() : null;
}

export function parsePlanMarkdown(markdown: string): ParsedPlan {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let title: string | null = null;
  const descriptionLines: string[] = [];
  const phases: ParsedPhase[] = [];

  let currentPhase: ParsedPhase | null = null;
  let currentCategory: ParsedCategory | null = null;
  const categorySlugsInPhase = new Set<string>();

  const finishCategory = () => {
    if (!currentCategory || !currentPhase) return;
    if (currentCategory.items.length === 0) {
      throw new PlanParseError(`Category "${currentCategory.name}" has no items.`);
    }
    currentPhase.categories.push(currentCategory);
    currentCategory = null;
  };

  const finishPhase = () => {
    finishCategory();
    if (!currentPhase) return;
    if (!currentPhase.goal) {
      throw new PlanParseError(`Phase "${currentPhase.title}" is missing a **Goal:** line.`);
    }
    if (currentPhase.categories.length === 0) {
      throw new PlanParseError(`Phase "${currentPhase.title}" has no categories.`);
    }
    phases.push(currentPhase);
    currentPhase = null;
    categorySlugsInPhase.clear();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();
    const lineNumber = i + 1;

    if (line === "" || /^-{3,}$/.test(line)) continue;

    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match) {
      if (title !== null) {
        throw new PlanParseError(`Line ${lineNumber}: a plan can only have one top-level "# Title" heading.`);
      }
      title = h1Match[1].trim();
      continue;
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (title === null) {
        throw new PlanParseError(`Line ${lineNumber}: plan must start with a top-level "# Title" heading before any phases.`);
      }
      finishPhase();
      const { text, parenthetical } = stripTrailingParenthetical(h2Match[1]);
      currentPhase = {
        title: text,
        durationLabel: parenthetical,
        goal: "",
        milestone: null,
        orderIndex: phases.length,
        categories: [],
      };
      continue;
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match) {
      if (!currentPhase) {
        throw new PlanParseError(`Line ${lineNumber}: category heading found before any "## Phase" heading.`);
      }
      finishCategory();
      const { text, parenthetical } = stripTrailingParenthetical(h3Match[1]);
      const { min, max } = parenthetical ? parseMinutesRange(parenthetical) : { min: null, max: null };
      let slug = slugify(text);
      if (categorySlugsInPhase.has(slug)) {
        let suffix = 2;
        while (categorySlugsInPhase.has(`${slug}-${suffix}`)) suffix++;
        slug = `${slug}-${suffix}`;
      }
      categorySlugsInPhase.add(slug);
      currentCategory = {
        slug,
        name: text,
        dailyMinMinutes: min,
        dailyMaxMinutes: max,
        orderIndex: currentPhase.categories.length,
        items: [],
      };
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (!currentCategory) {
        throw new PlanParseError(`Line ${lineNumber}: item found before any "### Category" heading.`);
      }
      const content = stripBoldMarkers(bulletMatch[1]);
      const colonIndex = content.indexOf(":");
      const itemTitle = colonIndex === -1 ? content.trim() : content.slice(0, colonIndex).trim();
      const itemDescription = colonIndex === -1 ? null : content.slice(colonIndex + 1).trim() || null;
      if (!itemTitle) {
        throw new PlanParseError(`Line ${lineNumber}: item is missing a title.`);
      }
      currentCategory.items.push({
        title: itemTitle,
        description: itemDescription,
        orderIndex: currentCategory.items.length,
      });
      continue;
    }

    const goalMatch = matchLabeledLine(line, "goal");
    if (goalMatch !== null) {
      if (!currentPhase) {
        throw new PlanParseError(`Line ${lineNumber}: "Goal:" found before any "## Phase" heading.`);
      }
      currentPhase.goal = goalMatch;
      continue;
    }

    const milestoneMatch = matchLabeledLine(line, "milestone");
    if (milestoneMatch !== null) {
      if (!currentPhase) {
        throw new PlanParseError(`Line ${lineNumber}: "Milestone:" found before any "## Phase" heading.`);
      }
      currentPhase.milestone = milestoneMatch;
      continue;
    }

    if (title !== null && !currentPhase) {
      descriptionLines.push(line);
      continue;
    }
    // Any other unrecognized line (e.g. stray text inside a phase, before a category)
    // is silently ignored rather than treated as an error.
  }

  finishPhase();

  if (title === null) {
    throw new PlanParseError('Plan must start with a top-level "# Title" heading.');
  }
  if (phases.length === 0) {
    throw new PlanParseError("Plan must have at least one phase (a \"## Phase Name\" heading).");
  }

  return {
    title,
    description: descriptionLines.length > 0 ? descriptionLines.join(" ") : null,
    phases,
  };
}

export function slugifyInstrumentName(name: string): string {
  return slugify(name);
}
