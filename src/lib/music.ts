export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

const MAJOR_SCALE_STEPS = [0, 2, 4, 5, 7, 9, 11];

export function noteFrequency(noteIndex: number, octave: number): number {
  const midi = (octave + 1) * 12 + noteIndex;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function randomChromaticNote(): { noteIndex: number; noteName: NoteName } {
  const noteIndex = Math.floor(Math.random() * 12);
  return { noteIndex, noteName: NOTE_NAMES[noteIndex] };
}

export function randomScaleDegree(rootNoteIndex: number): {
  degree: number;
  noteIndex: number;
} {
  const degree = Math.floor(Math.random() * 7) + 1;
  const noteIndex = (rootNoteIndex + MAJOR_SCALE_STEPS[degree - 1]) % 12;
  return { degree, noteIndex };
}
