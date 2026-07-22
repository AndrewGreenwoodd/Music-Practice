import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bpmLogs, itemProgress, items, practiceSessionItems } from "@/db/schema";

export async function getItemDetail(itemId: number, userId: string) {
  const item = await db.query.items.findFirst({
    where: eq(items.id, itemId),
    with: {
      category: { with: { phase: true } },
    },
  });
  if (!item) return null;

  const progress = await db.query.itemProgress.findFirst({
    where: and(eq(itemProgress.userId, userId), eq(itemProgress.itemId, itemId)),
  });

  const bpmHistory = await db.query.bpmLogs.findMany({
    where: and(eq(bpmLogs.userId, userId), eq(bpmLogs.itemId, itemId)),
    orderBy: desc(bpmLogs.recordedAt),
  });

  const recentSessionLinks = await db.query.practiceSessionItems.findMany({
    where: eq(practiceSessionItems.itemId, itemId),
    with: { session: true },
    orderBy: desc(practiceSessionItems.id),
    limit: 10,
  });
  const recentSessions = recentSessionLinks
    .map((link) => link.session)
    .filter((session) => session.userId === userId);

  return {
    item,
    status: progress?.status ?? ("not_started" as const),
    bpmHistory,
    recentSessions,
  };
}
