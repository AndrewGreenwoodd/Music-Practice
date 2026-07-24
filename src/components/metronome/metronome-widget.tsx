"use client";

import { useState } from "react";
import { Gauge, Pause, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAudioContext } from "@/lib/audio";
import { useMetronome } from "./use-metronome";
import type { Dictionary } from "@/i18n/dictionaries/en";

const MIN_BPM = 30;
const MAX_BPM = 300;
const DEFAULT_BPM = 120;

function clampBpm(value: number): number {
  if (Number.isNaN(value)) return MIN_BPM;
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

export function MetronomeWidget({ dict }: { dict: Dictionary["metronome"] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [isPlaying, setIsPlaying] = useState(false);

  useMetronome(bpm, isPlaying);

  const togglePlaying = () => {
    // Resume/create the AudioContext synchronously inside this click handler
    // so browsers count it as triggered by a user gesture (autoplay policy).
    getAudioContext();
    setIsPlaying((prev) => !prev);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={dict.open}
        className="fixed right-4 bottom-4 z-40 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-lg hover:bg-muted"
      >
        <Gauge className="size-4" />
        {isPlaying && <span className="size-1.5 animate-pulse rounded-full bg-primary" />}
        {bpm}
      </button>
    );
  }

  return (
    <Card className="fixed right-4 bottom-4 z-40 w-56 shadow-lg">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-medium">
            <Gauge className="size-4" />
            {dict.title}
          </p>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsOpen(false)}
            aria-label={dict.close}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Input
            type="number"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => setBpm(clampBpm(Number(e.target.value)))}
            className="w-20 text-center"
          />
          <span className="text-sm text-muted-foreground">{dict.bpm}</span>
        </div>

        <input
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={bpm}
          onChange={(e) => setBpm(clampBpm(Number(e.target.value)))}
          className="w-full accent-primary"
          aria-label={dict.bpm}
        />

        <Button className="w-full" onClick={togglePlaying}>
          {isPlaying ? (
            <Pause className="mr-1.5 size-4" />
          ) : (
            <Play className="mr-1.5 size-4" />
          )}
          {isPlaying ? dict.stop : dict.start}
        </Button>
      </CardContent>
    </Card>
  );
}
