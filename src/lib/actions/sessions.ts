"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { practiceSessionItems, practiceSessions } from "@/db/schema";
import { auth } from "@/lib/auth";

const sessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  durationMinutes: z.number().int().positive().max(600),
  itemIds: z.array(z.number().int().positive()).default([]),
  win: z.string().trim().max(1000).optional(),
  struggle: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function createSession(input: z.infer<typeof sessionSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const values = sessionSchema.parse(input);

  const [created] = await db
    .insert(practiceSessions)
    .values({
      userId: session.user.id,
      date: values.date,
      durationMinutes: values.durationMinutes,
      win: values.win || null,
      struggle: values.struggle || null,
      notes: values.notes || null,
    })
    .returning();

  if (values.itemIds.length > 0) {
    await db.insert(practiceSessionItems).values(
      values.itemIds.map((itemId) => ({ sessionId: created.id, itemId })),
    );
  }

  revalidatePath("/sessions");
  revalidatePath("/practice");
  redirect("/sessions");
}
