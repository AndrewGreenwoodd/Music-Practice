type SerializableItem = {
  title: string;
  description: string | null;
};

type SerializableCategory = {
  name: string;
  dailyMinMinutes: number | null;
  dailyMaxMinutes: number | null;
  items: SerializableItem[];
};

type SerializablePhase = {
  title: string;
  durationLabel: string | null;
  goal: string;
  milestone: string | null;
  categories: SerializableCategory[];
};

type SerializablePlan = {
  title: string;
  description: string | null;
  phases: SerializablePhase[];
};

function formatMinutesLabel(min: number | null, max: number | null): string | null {
  if (min == null) return null;
  if (max != null && max !== min) return `${min}-${max} min`;
  return `${min} min`;
}

/** Reverses parsePlanMarkdown: turns a plan's structured content back into the
 * markdown format the plan importer accepts, so it can be loaded into the edit form. */
export function serializePlanToMarkdown(plan: SerializablePlan): string {
  const lines: string[] = [`# ${plan.title}`];
  if (plan.description) lines.push(plan.description);

  for (const phase of plan.phases) {
    lines.push("");
    lines.push(`## ${phase.title}${phase.durationLabel ? ` (${phase.durationLabel})` : ""}`);
    lines.push(`**Goal:** ${phase.goal}`);
    if (phase.milestone) lines.push(`**Milestone:** ${phase.milestone}`);

    for (const category of phase.categories) {
      lines.push("");
      const minutesLabel = formatMinutesLabel(category.dailyMinMinutes, category.dailyMaxMinutes);
      lines.push(`### ${category.name}${minutesLabel ? ` (${minutesLabel})` : ""}`);
      for (const item of category.items) {
        lines.push(item.description ? `- ${item.title}: ${item.description}` : `- ${item.title}`);
      }
    }
  }

  return lines.join("\n");
}
