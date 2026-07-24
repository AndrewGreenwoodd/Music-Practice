"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { StaffDisplay } from "./staff-display";
import {
  NATURAL_LETTERS,
  noteLabel,
  randomStaffNote,
  staffPosition,
  type Accidental,
  type Clef,
  type NaturalLetter,
  type StaffNote,
} from "@/lib/staff";
import type { Dictionary } from "@/i18n/dictionaries/en";

type Round = { note: StaffNote; position: number };
type Answer = { letter: NaturalLetter; accidental: Accidental };

function answersMatch(a: Answer, b: Answer): boolean {
  return a.letter === b.letter && a.accidental === b.accidental;
}

export function SheetReadingTrainer({ dict }: { dict: Dictionary["sheetReading"] }) {
  const [clef, setClef] = useState<Clef>("treble");
  const [includeSharps, setIncludeSharps] = useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startRound = (currentClef: Clef, sharps: boolean) => {
    const note = randomStaffNote(currentClef, sharps);
    setRound({ note, position: staffPosition(note, currentClef) });
    setSelectedAnswer(null);
  };

  const answer = (candidate: Answer) => {
    if (!round || selectedAnswer) return;
    setSelectedAnswer(candidate);
    const isCorrect = answersMatch(candidate, round.note);
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">{dict.trainerTitle}</CardTitle>
          <Badge variant="secondary">
            {score.correct} / {score.total} {dict.sessionScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">{dict.clef}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={clef === "treble" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setClef("treble");
                  startRound("treble", includeSharps);
                }}
              >
                {dict.treble}
              </Button>
              <Button
                type="button"
                variant={clef === "bass" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setClef("bass");
                  startRound("bass", includeSharps);
                }}
              >
                {dict.bass}
              </Button>
            </div>
          </div>

          <label className="flex items-center gap-2 pb-1 text-sm">
            <Checkbox
              checked={includeSharps}
              onCheckedChange={(checked) => {
                const sharps = checked === true;
                setIncludeSharps(sharps);
                if (round) startRound(clef, sharps);
              }}
            />
            {dict.includeSharps}
          </label>
        </div>

        {!round && (
          <Button type="button" onClick={() => startRound(clef, includeSharps)}>
            <Music className="mr-1.5 size-4" />
            {dict.showNote}
          </Button>
        )}

        {round && (
          <div className="space-y-4">
            <StaffDisplay clef={clef} position={round.position} accidental={round.note.accidental} />

            <div className="flex flex-wrap justify-center gap-2">
              {NATURAL_LETTERS.map((letter) => {
                const accidentalOptions: Accidental[] = includeSharps
                  ? ["natural", "sharp"]
                  : ["natural"];
                return accidentalOptions.map((accidental) => {
                  const candidate: Answer = { letter, accidental };
                  const isSelected = !!selectedAnswer && answersMatch(selectedAnswer, candidate);
                  const isCorrectOption =
                    !!selectedAnswer && answersMatch(candidate, round.note);
                  return (
                    <Button
                      key={`${letter}-${accidental}`}
                      type="button"
                      variant="outline"
                      disabled={!!selectedAnswer}
                      onClick={() => answer(candidate)}
                      className={cn(
                        isCorrectOption && "border-green-600 bg-green-600/10 text-green-700",
                        isSelected &&
                          !isCorrectOption &&
                          "border-destructive bg-destructive/10 text-destructive",
                      )}
                    >
                      {noteLabel(candidate)}
                    </Button>
                  );
                });
              })}
            </div>

            {selectedAnswer && (
              <p className="text-center text-sm text-muted-foreground">
                {answersMatch(selectedAnswer, round.note)
                  ? dict.correct
                  : dict.incorrect.replace("{answer}", noteLabel(round.note))}{" "}
                <button
                  type="button"
                  onClick={() => startRound(clef, includeSharps)}
                  className="underline"
                >
                  {dict.nextNote}
                </button>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
