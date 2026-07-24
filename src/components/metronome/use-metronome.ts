import { useEffect, useRef } from "react";
import { getAudioContext, scheduleClick } from "@/lib/audio";

const SCHEDULER_INTERVAL_MS = 25;
const SCHEDULE_AHEAD_SEC = 0.1;
const BEATS_PER_BAR = 4;

export function useMetronome(bpm: number, isPlaying: boolean) {
  const bpmRef = useRef(bpm);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    if (!isPlaying) return;

    const ctx = getAudioContext();
    let nextNoteTime = ctx.currentTime + 0.05;
    let beatCount = 0;

    const scheduler = () => {
      while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
        scheduleClick(nextNoteTime, beatCount % BEATS_PER_BAR === 0);
        beatCount += 1;
        nextNoteTime += 60 / bpmRef.current;
      }
    };

    scheduler();
    const intervalId = window.setInterval(scheduler, SCHEDULER_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [isPlaying]);
}
