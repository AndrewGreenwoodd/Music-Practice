"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { earTrainingRounds } from "@/db/schema";
import { auth } from "@/lib/auth";

const roundSchema = z.object({
  mode: z.enum(["note", "scale_degree"]),
  scaleRoot: z.string().optional(),
  promptNote: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string(),
  isCorrect: z.boolean(),
});

export async function recordEarTrainingRound(input: z.infer<typeof roundSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const values = roundSchema.parse(input);

  await db.insert(earTrainingRounds).values({
    userId: session.user.id,
    mode: values.mode,
    scaleRoot: values.scaleRoot || null,
    promptNote: values.promptNote,
    correctAnswer: values.correctAnswer,
    userAnswer: values.userAnswer,
    isCorrect: values.isCorrect,
  });

  revalidatePath("/ear-training");
}
