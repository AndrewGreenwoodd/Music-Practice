import { ledgerLinePositions, type Accidental, type Clef } from "@/lib/staff";

const STAFF_LINE_POSITIONS = [0, 2, 4, 6, 8];
const UNIT = 6;
const BOTTOM_LINE_Y = 104;
const STAFF_LEFT = 28;
const STAFF_RIGHT = 192;
const NOTE_X = 148;
const LEDGER_HALF_WIDTH = 14;

function yForPosition(position: number): number {
  return BOTTOM_LINE_Y - position * UNIT;
}

export function StaffDisplay({
  clef,
  position,
  accidental = "natural",
}: {
  clef: Clef;
  position: number;
  accidental?: Accidental;
}) {
  const ledgers = ledgerLinePositions(position);
  const noteY = yForPosition(position);
  const noteX = NOTE_X;

  return (
    <svg
      viewBox="0 0 220 160"
      className="mx-auto h-40 w-full max-w-xs text-foreground"
      role="img"
      aria-label={`${clef} clef staff`}
    >
      {STAFF_LINE_POSITIONS.map((p) => (
        <line
          key={p}
          x1={STAFF_LEFT}
          y1={yForPosition(p)}
          x2={STAFF_RIGHT}
          y2={yForPosition(p)}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}

      <text
        x={STAFF_LEFT - 2}
        y={clef === "treble" ? yForPosition(6) + 6 : yForPosition(8) + 8}
        fontSize={clef === "treble" ? 56 : 30}
        className="fill-current"
      >
        {clef === "treble" ? "\u{1D11E}" : "\u{1D122}"}
      </text>

      {ledgers.map((p) => (
        <line
          key={p}
          x1={noteX - LEDGER_HALF_WIDTH}
          y1={yForPosition(p)}
          x2={noteX + LEDGER_HALF_WIDTH}
          y2={yForPosition(p)}
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}

      {accidental === "sharp" && (
        <text x={noteX - 26} y={noteY + 6} fontSize={20} className="fill-current">
          {"♯"}
        </text>
      )}

      <ellipse
        cx={noteX}
        cy={noteY}
        rx={9}
        ry={6.5}
        className="fill-current"
        transform={`rotate(-18 ${noteX} ${noteY})`}
      />
    </svg>
  );
}
