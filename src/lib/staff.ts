export type Clef = "treble" | "bass";

export const NATURAL_LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
export type NaturalLetter = (typeof NATURAL_LETTERS)[number];

export type StaffNote = { letter: NaturalLetter; octave: number };

type StaffPitch = StaffNote;

const CLEF_REFERENCE: Record<Clef, StaffPitch> = {
  treble: { letter: "E", octave: 4 },
  bass: { letter: "G", octave: 2 },
};

const MIN_POSITION = -4;
const MAX_POSITION = 12;

function absoluteIndex(note: StaffPitch): number {
  return note.octave * 7 + NATURAL_LETTERS.indexOf(note.letter);
}

// Position 0 = staff bottom line, +1 per diatonic step (alternating space/line) going up.
export function staffPosition(note: StaffPitch, clef: Clef): number {
  return absoluteIndex(note) - absoluteIndex(CLEF_REFERENCE[clef]);
}

// Ledger lines are only needed at "line" positions (even numbers) beyond the staff.
export function ledgerLinePositions(position: number): number[] {
  const lines: number[] = [];
  if (position < 0) {
    for (let line = -2; line >= position; line -= 2) lines.push(line);
  } else if (position > 8) {
    for (let line = 10; line <= position; line += 2) lines.push(line);
  }
  return lines;
}

export function randomStaffNote(clef: Clef): StaffNote {
  const position =
    Math.floor(Math.random() * (MAX_POSITION - MIN_POSITION + 1)) + MIN_POSITION;
  const refIndex = absoluteIndex(CLEF_REFERENCE[clef]);
  const abs = refIndex + position;
  const octave = Math.floor(abs / 7);
  const letter = NATURAL_LETTERS[((abs % 7) + 7) % 7];
  return { letter, octave };
}
