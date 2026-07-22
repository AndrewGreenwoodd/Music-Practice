import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { categories, items, itemProgress, phases } from "@/db/schema";

export async function listPhases(planId: number) {
  return db.query.phases.findMany({
    where: and(eq(phases.planId, planId), eq(phases.isOngoing, false)),
    orderBy: asc(phases.orderIndex),
    with: { milestone: true },
  });
}

export async function getOngoingPhase(planId: number) {
  return db.query.phases.findFirst({
    where: and(eq(phases.planId, planId), eq(phases.isOngoing, true)),
  });
}

export async function getPhaseWithItems(phaseId: number, userId: string) {
  const phase = await db.query.phases.findFirst({
    where: eq(phases.id, phaseId),
    with: { milestone: true },
  });
  if (!phase) return null;

  const phaseCategories = await db.query.categories.findMany({
    where: eq(categories.phaseId, phaseId),
    orderBy: asc(categories.orderIndex),
    with: {
      items: { orderBy: asc(items.orderIndex) },
    },
  });

  const itemIds = phaseCategories.flatMap((c) => c.items.map((i) => i.id));
  const progressRows = itemIds.length
    ? await db.query.itemProgress.findMany({
        where: and(eq(itemProgress.userId, userId), inArray(itemProgress.itemId, itemIds)),
      })
    : [];
  const progressByItemId = new Map(progressRows.map((p) => [p.itemId, p.status]));

  const categoriesWithStatus = phaseCategories.map((category) => ({
    ...category,
    items: category.items.map((item) => ({
      ...item,
      status: progressByItemId.get(item.id) ?? ("not_started" as const),
    })),
  }));

  const totalItems = itemIds.length;
  const doneItems = progressRows.filter((p) => p.status === "done").length;

  return {
    phase,
    categories: categoriesWithStatus,
    progress: { total: totalItems, done: doneItems },
  };
}

export async function listPhaseSummaries(planId: number, userId: string) {
  const phaseList = await listPhases(planId);

  const summaries = await Promise.all(
    phaseList.map(async (phase) => {
      const phaseCategories = await db.query.categories.findMany({
        where: eq(categories.phaseId, phase.id),
        with: { items: true },
      });
      const itemIds = phaseCategories.flatMap((c) => c.items.map((i) => i.id));
      const progressRows = itemIds.length
        ? await db.query.itemProgress.findMany({
            where: and(
              eq(itemProgress.userId, userId),
              inArray(itemProgress.itemId, itemIds),
            ),
          })
        : [];
      const done = progressRows.filter((p) => p.status === "done").length;

      return { phase, total: itemIds.length, done };
    }),
  );

  return summaries;
}
