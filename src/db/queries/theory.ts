import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, items, phases } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localized } from "./localize";

export async function getTheoryConcepts(planId: number, locale: Locale) {
  const phaseList = await db.query.phases.findMany({
    where: eq(phases.planId, planId),
    orderBy: asc(phases.orderIndex),
    with: {
      categories: {
        where: eq(categories.slug, "theory"),
        with: {
          items: { orderBy: asc(items.orderIndex) },
        },
      },
    },
  });

  return phaseList
    .map((phase) => ({
      phase: { ...phase, title: localized(phase.title, phase.titleUk, locale) },
      items: (phase.categories[0]?.items ?? []).map((item) => ({
        ...item,
        title: localized(item.title, item.titleUk, locale),
      })),
    }))
    .filter((entry) => entry.items.length > 0);
}
