import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, items, phases } from "@/db/schema";

export async function getTheoryConcepts(planId: number) {
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
    .map((phase) => ({ phase, items: phase.categories[0]?.items ?? [] }))
    .filter((entry) => entry.items.length > 0);
}
