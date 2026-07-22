import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { phases, practiceSessions } from "@/db/schema";

export async function listSessions(userId: string) {
  return db.query.practiceSessions.findMany({
    where: eq(practiceSessions.userId, userId),
    orderBy: [desc(practiceSessions.date), desc(practiceSessions.createdAt)],
    with: {
      items: { with: { item: true } },
    },
  });
}

export async function getSessionFormItems(planId: number) {
  const rows = await db.query.phases.findMany({
    where: eq(phases.planId, planId),
    with: {
      categories: {
        orderBy: (c, { asc }) => asc(c.orderIndex),
        with: { items: { orderBy: (i, { asc }) => asc(i.orderIndex) } },
      },
    },
    orderBy: (p, { asc }) => asc(p.orderIndex),
  });
  return rows;
}
