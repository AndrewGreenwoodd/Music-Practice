import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { categories, items, itemProgress, phases } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

export async function listPhases(planId: number, locale: Locale) {
  const rows = await db.query.phases.findMany({
    where: and(eq(phases.planId, planId), eq(phases.isOngoing, false)),
    orderBy: asc(phases.orderIndex),
    with: { milestone: true },
  });

  return rows.map((phase) => ({
    ...phase,
    title: localized(phase.title, phase.titleUk, locale),
    goal: localized(phase.goal, phase.goalUk, locale),
  }));
}

export async function getPhaseWithItems(phaseId: number, userId: string, locale: Locale) {
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
    name: localized(category.name, category.nameUk, locale),
    items: category.items.map((item) => ({
      ...item,
      title: localized(item.title, item.titleUk, locale),
      description: item.description
        ? localized(item.description, item.descriptionUk, locale)
        : item.description,
      status: progressByItemId.get(item.id) ?? ("not_started" as const),
    })),
  }));

  const totalItems = itemIds.length;
  const doneItems = progressRows.filter((p) => p.status === "done").length;

  return {
    phase: {
      ...phase,
      title: localized(phase.title, phase.titleUk, locale),
      goal: localized(phase.goal, phase.goalUk, locale),
    },
    categories: categoriesWithStatus,
    progress: { total: totalItems, done: doneItems },
  };
}
