import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { phases, userPlanProgress } from "@/db/schema";
import type { Locale } from "@/i18n/config";
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
    where: and(eq(phases.planId, planId), eq(phases.isOngoing, false)),
    orderBy: asc(phases.orderIndex),
  });
  return firstPhase?.id ?? null;
}

export async function getPracticeData(userId: string, planId: number, locale: Locale) {
  const currentPhaseId = await getCurrentPhaseId(userId, planId);
  if (!currentPhaseId) return null;
  return getPhaseWithItems(currentPhaseId, userId, locale);
}
