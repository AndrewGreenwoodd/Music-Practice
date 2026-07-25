import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, items, phases, plans, users } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { serializePlanToMarkdown } from "@/lib/plan-import/serialize-plan";
import { localized } from "./localize";

export async function listPlansForUser(userId: string, locale: Locale) {
  const [user, allPlans] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, userId) }),
    db.query.plans.findMany({ with: { instrument: true } }),
  ]);

  return allPlans
    .map((plan) => ({
      id: plan.id,
      title: localized(plan.title, plan.titleUk, locale),
      description: plan.description
        ? localized(plan.description, plan.descriptionUk, locale)
        : plan.description,
      instrumentSlug: plan.instrument.slug,
      instrumentName: localized(plan.instrument.name, plan.instrument.nameUk, locale),
      isOwnedByUser: plan.ownerId === userId,
      isActive: plan.id === user?.activePlanId,
      createdAt: plan.createdAt,
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function getPlanForEdit(planId: number) {
  const plan = await db.query.plans.findFirst({
    where: eq(plans.id, planId),
    with: { instrument: true },
  });
  if (!plan) return null;

  // Base (seeded) plans have no sourceMarkdown since they were never uploaded as
  // markdown — reconstruct an equivalent markdown source from their DB content
  // so the edit form has something real to start from instead of a blank textarea.
  let sourceMarkdown = plan.sourceMarkdown;
  if (!sourceMarkdown) {
    const planPhases = await db.query.phases.findMany({
      where: eq(phases.planId, planId),
      orderBy: asc(phases.orderIndex),
      with: { milestone: true },
    });

    const phasesWithCategories = await Promise.all(
      planPhases.map(async (phase) => {
        const phaseCategories = await db.query.categories.findMany({
          where: eq(categories.phaseId, phase.id),
          orderBy: asc(categories.orderIndex),
          with: { items: { orderBy: asc(items.orderIndex) } },
        });

        return {
          title: phase.title,
          durationLabel: phase.durationLabel,
          goal: phase.goal,
          milestone: phase.milestone?.description ?? null,
          categories: phaseCategories.map((category) => ({
            name: category.name,
            dailyMinMinutes: category.dailyMinMinutes,
            dailyMaxMinutes: category.dailyMaxMinutes,
            items: category.items.map((item) => ({
              title: item.title,
              description: item.description,
            })),
          })),
        };
      }),
    );

    sourceMarkdown = serializePlanToMarkdown({
      title: plan.title,
      description: plan.description,
      phases: phasesWithCategories,
    });
  }

  return {
    id: plan.id,
    title: plan.title,
    instrumentName: plan.instrument.name,
    sourceMarkdown,
    ownerId: plan.ownerId,
  };
}
