"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  NOTE_NAMES,
  noteFrequency,
  randomChromaticNote,
  randomScaleDegree,
  type NoteName,
} from "@/lib/music";
import { playTone } from "@/lib/audio";
import { recordEarTrainingRound } from "@/lib/actions/ear-training";

type Mode = "note" | "scale_degree";
type Round = { noteIndex: number; correctAnswer: string };

const DEGREES = ["1", "2", "3", "4", "5", "6", "7"];
const OCTAVE = 4;

export function NoteGuessTrainer() {
  const [mode, setMode] = useState<Mode>("note");
  const [scaleRoot, setScaleRoot] = useState<NoteName>("C");
  const [round, setRound] = useState<Round | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateRound = (currentMode: Mode, currentRoot: string): Round => {
    if (currentMode === "note") {
      const { noteIndex, noteName } = randomChromaticNote();
      return { noteIndex, correctAnswer: noteName };
    }
    const rootIndex = NOTE_NAMES.indexOf(currentRoot as NoteName);
    const { degree, noteIndex } = randomScaleDegree(rootIndex);
    return { noteIndex, correctAnswer: String(degree) };
  };

  const playRound = (r: Round) => {
    playTone(noteFrequency(r.noteIndex, OCTAVE));
  };

  const startRound = () => {
    const r = generateRound(mode, scaleRoot);
    setRound(r);
    setSelectedAnswer(null);
    playRound(r);
  };

  const replay = () => {
    if (round) playRound(round);
  };

  const resetRound = () => {
    setRound(null);
    setSelectedAnswer(null);
  };

  const answer = async (value: string) => {
    if (!round || selectedAnswer) return;
    setSelectedAnswer(value);
    const isCorrect = value === round.correctAnswer;
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));

    await recordEarTrainingRound({
      mode,
      scaleRoot: mode === "scale_degree" ? scaleRoot : undefined,
      promptNote: `${NOTE_NAMES[round.noteIndex]}${OCTAVE}`,
      correctAnswer: round.correctAnswer,
      userAnswer: value,
      isCorrect,
    });
  };

  const options: string[] = mode === "note" ? [...NOTE_NAMES] : DEGREES;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Note Guess</CardTitle>
          <Badge variant="secondary">
            {score.correct} / {score.total} this session
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Mode</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={mode === "note" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode("note");
                  resetRound();
                }}
              >
                Guess the note
              </Button>
              <Button
                type="button"
                variant={mode === "scale_degree" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode("scale_degree");
                  resetRound();
                }}
              >
                Guess the scale degree
              </Button>
            </div>
          </div>

          {mode === "scale_degree" && (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Key</p>
              <Select
                value={scaleRoot}
                onValueChange={(value) => {
                  if (value) {
                    setScaleRoot(value as NoteName);
                    resetRound();
                  }
                }}
              >
                <SelectTrigger className="w-28">
                  <SelectValue>{(value: string) => `${value} major`}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {NOTE_NAMES.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n} major
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" onClick={startRound}>
            <Volume2 className="mr-1.5 size-4" />
            {round ? "New note" : "Play a note"}
          </Button>
          {round && (
            <Button type="button" variant="outline" onClick={replay}>
              Replay
            </Button>
          )}
        </div>

        {round && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectOption = !!selectedAnswer && opt === round.correctAnswer;
                return (
                  <Button
                    key={opt}
                    type="button"
                    variant="outline"
                    disabled={!!selectedAnswer}
                    onClick={() => answer(opt)}
                    className={cn(
                      isCorrectOption && "border-green-600 bg-green-600/10 text-green-700",
                      isSelected &&
                        !isCorrectOption &&
                        "border-destructive bg-destructive/10 text-destructive",
                    )}
                  >
                    {opt}
                  </Button>
                );
              })}
            </div>
            {selectedAnswer && (
              <p className="text-sm text-muted-foreground">
                {selectedAnswer === round.correctAnswer
                  ? "Correct!"
                  : `Not quite — that was ${round.correctAnswer}.`}{" "}
                <button type="button" onClick={startRound} className="underline">
                  Next note
                </button>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
