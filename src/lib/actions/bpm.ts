"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { bpmLogs } from "@/db/schema";
import { auth } from "@/lib/auth";

const bpmSchema = z.object({
  itemId: z.number().int().positive(),
  bpm: z.number().int().positive().max(400),
  note: z.string().trim().max(500).optional(),
});

export async function addBpmLog(input: z.infer<typeof bpmSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const { itemId, bpm, note } = bpmSchema.parse(input);

  await db.insert(bpmLogs).values({
    userId: session.user.id,
    itemId,
    bpm,
    note: note || null,
  });

  revalidatePath(`/items/${itemId}`);
}
