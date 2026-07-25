"use server";

import { and, asc, eq, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories, instruments, items, milestones, phases, plans, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  parsePlanMarkdown,
  slugifyInstrumentName,
  PlanParseError,
  type ParsedPlan,
} from "@/lib/plan-import/parse-plan";

const inputSchema = z.object({
  markdown: z.string().trim().min(1, "Markdown content is required."),
  instrumentName: z.string().trim().min(1, "Instrument name is required.").max(100),
});

async function findOrCreateInstrument(name: string) {
  const slug = slugifyInstrumentName(name);
  const existing = await db.query.instruments.findFirst({
    where: eq(instruments.slug, slug),
  });
  if (existing) return existing;

  const [created] = await db.insert(instruments).values({ slug, name }).returning();
  return created;
}

type PlanTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

function insertPlanContent(tx: PlanTx, planId: number, parsed: ParsedPlan) {
  for (const phase of parsed.phases) {
    const [insertedPhase] = tx
      .insert(phases)
      .values({
        planId,
        orderIndex: phase.orderIndex,
        title: phase.title,
        goal: phase.goal,
        durationLabel: phase.durationLabel,
      })
      .returning()
      .all();

    if (phase.milestone) {
      tx.insert(milestones).values({ phaseId: insertedPhase.id, description: phase.milestone }).run();
    }

    for (const category of phase.categories) {
      const [insertedCategory] = tx
        .insert(categories)
        .values({
          phaseId: insertedPhase.id,
          slug: category.slug,
          name: category.name,
          orderIndex: category.orderIndex,
          dailyMinMinutes: category.dailyMinMinutes,
          dailyMaxMinutes: category.dailyMaxMinutes,
        })
        .returning()
        .all();

      tx.insert(items)
        .values(
          category.items.map((item) => ({
            categoryId: insertedCategory.id,
            title: item.title,
            description: item.description,
            orderIndex: item.orderIndex,
          })),
        )
        .run();
    }
  }
}

export async function createPlan(
  input: z.infer<typeof inputSchema>,
): Promise<{ error: string } | undefined> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const { markdown, instrumentName } = inputSchema.parse(input);

  let parsed: ParsedPlan;
  try {
    parsed = parsePlanMarkdown(markdown);
  } catch (err) {
    if (err instanceof PlanParseError) return { error: err.message };
    throw err;
  }

  const instrument = await findOrCreateInstrument(instrumentName);

  db.transaction((tx) => {
    const [createdPlan] = tx
      .insert(plans)
      .values({
        instrumentId: instrument.id,
        ownerId: session.user.id,
        title: parsed.title,
        description: parsed.description,
        sourceMarkdown: markdown,
      })
      .returning()
      .all();

    insertPlanContent(tx, createdPlan.id, parsed);
  });

  revalidatePath("/plans");
}

export async function updatePlan(
  planId: number,
  input: z.infer<typeof inputSchema>,
): Promise<{ error: string } | undefined> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const existing = await db.query.plans.findFirst({ where: eq(plans.id, planId) });
  if (!existing) {
    throw new Error("Plan not found");
  }

  const { markdown, instrumentName } = inputSchema.parse(input);

  let parsed: ParsedPlan;
  try {
    parsed = parsePlanMarkdown(markdown);
  } catch (err) {
    if (err instanceof PlanParseError) return { error: err.message };
    throw err;
  }

  const instrument = await findOrCreateInstrument(instrumentName);

  db.transaction((tx) => {
    tx.delete(phases).where(eq(phases.planId, planId)).run();
    tx.update(plans)
      .set({
        instrumentId: instrument.id,
        title: parsed.title,
        description: parsed.description,
        sourceMarkdown: markdown,
      })
      .where(eq(plans.id, planId))
      .run();

    insertPlanContent(tx, planId, parsed);
  });

  revalidatePath("/plans");
  revalidatePath("/practice");
  revalidatePath("/theory");
}

const DEFAULT_FALLBACK_PLAN_TITLE = "Long-Term Guitar Practice Plan";

export async function deletePlan(planId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const existing = await db.query.plans.findFirst({ where: eq(plans.id, planId) });
  if (!existing || existing.ownerId !== session.user.id) {
    throw new Error("Plan not found or not owned by the current user");
  }

  // Anyone with this plan set active would otherwise be left with no active
  // plan at all (the FK just nulls it out on delete) -- fall back to the
  // default guitar plan, or any other remaining plan, instead of leaving them
  // stranded on an empty Practice/Theory page.
  const affectedUsers = await db.query.users.findMany({
    where: eq(users.activePlanId, planId),
  });

  let fallbackPlanId: number | null = null;
  if (affectedUsers.length > 0) {
    const fallback =
      (await db.query.plans.findFirst({
        where: and(eq(plans.title, DEFAULT_FALLBACK_PLAN_TITLE), ne(plans.id, planId)),
      })) ??
      (await db.query.plans.findFirst({
        where: ne(plans.id, planId),
        orderBy: asc(plans.createdAt),
      }));
    fallbackPlanId = fallback?.id ?? null;
  }

  await db.delete(plans).where(eq(plans.id, planId));

  if (affectedUsers.length > 0) {
    await db
      .update(users)
      .set({ activePlanId: fallbackPlanId })
      .where(
        inArray(
          users.id,
          affectedUsers.map((u) => u.id),
        ),
      );
  }

  revalidatePath("/plans");
  revalidatePath("/practice");
  revalidatePath("/theory");
  revalidatePath("/", "layout");
}

export async function setActivePlan(planId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const plan = await db.query.plans.findFirst({ where: eq(plans.id, planId) });
  if (!plan) throw new Error("Plan not found");

  await db.update(users).set({ activePlanId: planId }).where(eq(users.id, session.user.id));

  revalidatePath("/", "layout");
}
