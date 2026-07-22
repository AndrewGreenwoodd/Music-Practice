import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { earTrainingRounds } from "@/db/schema";

export async function getEarTrainingStats(userId: string) {
  const rounds = await db.query.earTrainingRounds.findMany({
    where: eq(earTrainingRounds.userId, userId),
    orderBy: desc(earTrainingRounds.createdAt),
    limit: 200,
  });

  const summarize = (mode: "note" | "scale_degree") => {
    const modeRounds = rounds.filter((r) => r.mode === mode);
    return {
      total: modeRounds.length,
      correct: modeRounds.filter((r) => r.isCorrect).length,
    };
  };

  return {
    note: summarize("note"),
    scaleDegree: summarize("scale_degree"),
    recent: rounds.slice(0, 20),
  };
}
