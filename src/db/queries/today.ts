import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { phases, userPlanProgress } from "@/db/schema";
import { getPhaseWithItems } from "./phases";

export async function getCurrentPhaseId(userId: string, planId: number) {
  const progress = await db.query.userPlanProgress.findFirst({
    where: and(
      eq(userPlanProgress.userId, userId),
      eq(userPlanProgress.planId, planId),
    ),
  });
  if (progress?.currentPhaseId) return progress.currentPhaseId;

  const firstPhase = await db.query.phases.findFirst({
    where: and(eq(phases.planId, planId), eq(phases.orderIndex, 1)),
  });
  return firstPhase?.id ?? null;
}

export async function getTodayData(userId: string, planId: number) {
  const currentPhaseId = await getCurrentPhaseId(userId, planId);
  if (!currentPhaseId) return null;
  return getPhaseWithItems(currentPhaseId, userId);
}
