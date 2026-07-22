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
import { getLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/get-dictionary";
import { getDateFnsLocale } from "@/i18n/date-locale";
import type { Dictionary } from "@/i18n/dictionaries/en";

function accuracyLabel(correct: number, total: number, dict: Dictionary["earTraining"]) {
  if (total === 0) return dict.noRoundsYet;
  return `${correct} / ${total} (${Math.round((correct / total) * 100)}%)`;
}

export default async function EarTrainingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const dateFnsLocale = getDateFnsLocale(locale);

  const stats = await getEarTrainingStats(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{dict.earTraining.title}</h1>
        <p className="text-sm text-muted-foreground">{dict.earTraining.subtitle}</p>
      </div>

      <NoteGuessTrainer dict={dict.earTraining} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{dict.earTraining.lifetimeAccuracy}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <p>
              <span className="text-muted-foreground">{dict.earTraining.noteGuessing} </span>
              {accuracyLabel(stats.note.correct, stats.note.total, dict.earTraining)}
            </p>
            <p>
              <span className="text-muted-foreground">{dict.earTraining.scaleDegree} </span>
              {accuracyLabel(stats.scaleDegree.correct, stats.scaleDegree.total, dict.earTraining)}
            </p>
          </div>

          {stats.recent.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{dict.earTraining.tableDate}</TableHead>
                  <TableHead>{dict.earTraining.tableMode}</TableHead>
                  <TableHead>{dict.earTraining.tableYourAnswer}</TableHead>
                  <TableHead>{dict.earTraining.tableCorrectAnswer}</TableHead>
                  <TableHead>{dict.earTraining.tableResult}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recent.map((round) => (
                  <TableRow key={round.id}>
                    <TableCell>
                      {format(round.createdAt, "MMM d, HH:mm", { locale: dateFnsLocale })}
                    </TableCell>
                    <TableCell>
                      {round.mode === "note"
                        ? dict.earTraining.modeNote
                        : dict.earTraining.modeScaleDegree.replace(
                            "{root}",
                            round.scaleRoot ?? "",
                          )}
                    </TableCell>
                    <TableCell>{round.userAnswer}</TableCell>
                    <TableCell>{round.correctAnswer}</TableCell>
                    <TableCell>
                      {round.isCorrect ? (
                        <Badge variant="secondary">{dict.earTraining.resultCorrect}</Badge>
                      ) : (
                        <Badge variant="destructive">{dict.earTraining.resultMissed}</Badge>
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
