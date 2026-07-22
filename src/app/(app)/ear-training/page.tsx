import { redirect } from "next/navigation";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { getEarTrainingStats } from "@/db/queries/ear-training";
import { NoteGuessTrainer } from "@/components/ear-training/note-guess-trainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function accuracyLabel(correct: number, total: number) {
  if (total === 0) return "No rounds yet";
  return `${correct} / ${total} (${Math.round((correct / total) * 100)}%)`;
}

export default async function EarTrainingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const stats = await getEarTrainingStats(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ear Training</h1>
        <p className="text-sm text-muted-foreground">
          A random note plays — guess the note name or the scale degree.
        </p>
      </div>

      <NoteGuessTrainer />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lifetime accuracy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <p>
              <span className="text-muted-foreground">Note guessing: </span>
              {accuracyLabel(stats.note.correct, stats.note.total)}
            </p>
            <p>
              <span className="text-muted-foreground">Scale degree: </span>
              {accuracyLabel(stats.scaleDegree.correct, stats.scaleDegree.total)}
            </p>
          </div>

          {stats.recent.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Your answer</TableHead>
                  <TableHead>Correct answer</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recent.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell>{format(round.createdAt, "MMM d, HH:mm")}</TableCell>
                    <TableCell>
                      {round.mode === "note"
                        ? "Note"
                        : `Scale degree (${round.scaleRoot} major)`}
                    </TableCell>
                    <TableCell>{round.userAnswer}</TableCell>
                    <TableCell>{round.correctAnswer}</TableCell>
                    <TableCell>
                      {round.isCorrect ? (
                        <Badge variant="secondary">Correct</Badge>
                      ) : (
                        <Badge variant="destructive">Missed</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
