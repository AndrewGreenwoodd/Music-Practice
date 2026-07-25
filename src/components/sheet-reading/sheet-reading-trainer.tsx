"use client";

import { useState } from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { StaffDisplay } from "./staff-display";
import {
  NATURAL_LETTERS,
  randomStaffNote,
  staffPosition,
  type Clef,
  type NaturalLetter,
  type StaffNote,
} from "@/lib/staff";
import type { Dictionary } from "@/i18n/dictionaries/en";

type Round = { note: StaffNote; position: number };

export function SheetReadingTrainer({ dict }: { dict: Dictionary["sheetReading"] }) {
  const [clef, setClef] = useState<Clef>("treble");
  const [round, setRound] = useState<Round | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<NaturalLetter | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startRound = (currentClef: Clef) => {
    const note = randomStaffNote(currentClef);
    setRound({ note, position: staffPosition(note, currentClef) });
    setSelectedLetter(null);
  };

  const answer = (letter: NaturalLetter) => {
    if (!round || selectedLetter) return;
    setSelectedLetter(letter);
    const isCorrect = letter === round.note.letter;
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
        <div className="space-y-1.5">
          <p className="text-sm font-medium">{dict.clef}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={clef === "treble" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setClef("treble");
                startRound("treble");
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
                startRound("bass");
              }}
            >
              {dict.bass}
            </Button>
          </div>
        </div>

        {!round && (
          <Button type="button" onClick={() => startRound(clef)}>
            <Music className="mr-1.5 size-4" />
            {dict.showNote}
          </Button>
        )}

        {round && (
          <div className="space-y-4">
            <StaffDisplay clef={clef} position={round.position} />

            <div className="flex flex-wrap justify-center gap-2">
              {NATURAL_LETTERS.map((letter) => {
                const isSelected = selectedLetter === letter;
                const isCorrectOption = !!selectedLetter && letter === round.note.letter;
                return (
                  <Button
                    key={letter}
                    type="button"
                    variant="outline"
                    disabled={!!selectedLetter}
                    onClick={() => answer(letter)}
                    className={cn(
                      isCorrectOption && "border-green-600 bg-green-600/10 text-green-700",
                      isSelected &&
                        !isCorrectOption &&
                        "border-destructive bg-destructive/10 text-destructive",
                    )}
                  >
                    {letter}
                  </Button>
                );
              })}
            </div>

            {selectedLetter && (
              <p className="text-center text-sm text-muted-foreground">
                {selectedLetter === round.note.letter
                  ? dict.correct
                  : dict.incorrect.replace("{answer}", round.note.letter)}{" "}
                <button type="button" onClick={() => startRound(clef)} className="underline">
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
