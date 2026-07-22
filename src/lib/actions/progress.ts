"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { itemProgress, userPlanProgress } from "@/db/schema";
import { auth } from "@/lib/auth";

const statusSchema = z.enum(["not_started", "in_progress", "done"]);

export async function setItemStatus(itemId: number, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const parsedStatus = statusSchema.parse(status);
  const userId = session.user.id;

  const existing = await db.query.itemProgress.findFirst({
    where: and(eq(itemProgress.userId, userId), eq(itemProgress.itemId, itemId)),
  });

  if (existing) {
    await db
      .update(itemProgress)
      .set({ status: parsedStatus, updatedAt: new Date() })
      .where(eq(itemProgress.id, existing.id));
  } else {
    await db.insert(itemProgress).values({ userId, itemId, status: parsedStatus });
  }

  revalidatePath("/practice");
  revalidatePath(`/items/${itemId}`);
}

export async function setCurrentPhase(planId: number, phaseId: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const userId = session.user.id;

  const existing = await db.query.userPlanProgress.findFirst({
    where: and(eq(userPlanProgress.userId, userId), eq(userPlanProgress.planId, planId)),
  });

  if (existing) {
    await db
      .update(userPlanProgress)
      .set({ currentPhaseId: phaseId, updatedAt: new Date() })
      .where(eq(userPlanProgress.id, existing.id));
  } else {
    await db.insert(userPlanProgress).values({ userId, planId, currentPhaseId: phaseId });
  }

  revalidatePath("/practice");
}
