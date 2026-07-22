import { config } from "dotenv";
import bcrypt from "bcryptjs";

config({ path: ".env.local" });
import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  categories,
  instruments,
  items,
  milestones,
  phases,
  plans,
  userPlanProgress,
  users,
} from "./schema";

type SeedItem = { title: string; description: string; longDescription?: string };
type SeedCategory = {
  slug: string;
  name: string;
  orderIndex: number;
  dailyMinMinutes?: number;
  dailyMaxMinutes?: number;
  items: SeedItem[];
};
type SeedPhase = {
  orderIndex: number;
  isOngoing?: boolean;
  title: string;
  goal: string;
  durationLabel?: string;
  milestone?: string;
  categories: SeedCategory[];
};

const guitarPlan: {
  instrument: { slug: string; name: string };
  plan: { title: string; description: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "guitar", name: "Guitar" },
  plan: {
    title: "Long-Term Guitar Practice Plan",
    description:
      "Intermediate-level, 12-month plan combining technique and theory, ~30-45 min/day.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Foundations of the Fretboard",
      goal: "Know the neck cold and connect scale shapes to real theory.",
      durationLabel: "Months 1-3",
      milestone:
        "Naming any note on the fretboard in under 2 seconds means drilling the natural notes (E,F,G,A,B,C,D) on each string individually until it's reflexive, then adding sharps/flats. Playing the major scale in 3 positions from memory means no glancing at a chart or backtracking mid-scale — full run, start to finish, twice in a row clean.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Chromatic warm-ups",
              description:
                "Play 1-2-3-4 (one finger per fret) across all six strings, ascending and descending, then shift up a fret and repeat. Builds finger independence and left-hand synchronization with almost no musical decision-making required, so you can focus entirely on cleanliness.",
            },
            {
              title: "3-note-per-string scale patterns",
              description:
                "Instead of the '3 frets = 1 position' box shapes, 3-note-per-string patterns run scales in straight lines up each string. They cover more fretboard real estate per shape and are the standard vocabulary for fast, fluid scale runs later on.",
            },
            {
              title: "Alternate picking, accuracy over speed",
              description:
                "Strict down-up-down-up picking, practiced against a metronome starting absurdly slow (50-60 BPM). If you have to slow down to keep the pick pattern perfectly alternating, slow down — speed built on inconsistent picking hits a ceiling fast and is hard to unlearn.",
            },
            {
              title: "CAGED system, all 5 shapes",
              description:
                "CAGED maps the 5 open chord shapes (C, A, G, E, D) onto the neck as movable position markers. Learn all 5 shapes for a single major scale/key first, in order, so you can see how shape 1 hands off to shape 2 further up the neck.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          orderIndex: 2,
          items: [
            {
              title: "Major scale construction (W-W-H-W-W-W-H)",
              description:
                "This interval formula is what defines 'major' in any key. Build it from different starting notes on one string only, so the sound of the pattern (not a memorized fingering) becomes what you recognize.",
              longDescription:
                "W-W-H-W-W-W-H is a recipe, not a fixed set of notes: W means move up 2 frets (a whole step), H means move up 1 fret (a half step). Start on any note and apply the recipe and you get that note's major scale. From C: C(W)D(W)E(H)F(W)G(W)A(W)B(H)C — the two half-steps land between degrees 3-4 and 7-8, which is exactly what gives the major scale its recognizable 'resolved' sound, since those are the two spots where the ear feels the least room to relax before the next note pulls it forward.\n\nBecause it's a formula, it transfers to every key without new memorization — from E: E(W)F#(W)G#(H)A(W)B(W)C#(W)D#(H)E. The fastest way to internalize this is to play it on a single string, one note per formula step, in a few different keys. Doing it on one string strips away any shape or fingering pattern, so what you're left with is the interval pattern itself, and that's the thing that should eventually 'sound' major to you before you even check the notes.\n\nEvery other scale and mode later in this plan (Phase 3's modes, the pentatonic and blues scales) is a variation or subset of this same formula, so getting this one truly under your fingers and ear first is what makes everything after it faster to learn.",
            },
            {
              title: "Relative minor",
              description:
                "Every major key has a minor key sharing the same notes, starting from its 6th scale degree (e.g., C major and A minor). Explains why so many 'different' songs use identical note sets, and sets up modal thinking in Phase 3.",
              longDescription:
                "Take any major scale and start counting from its 6th degree instead of its 1st, and you get that key's relative minor — same seven notes, different note treated as 'home.' In C major (C D E F G A B), the 6th degree is A, so A minor is C major's relative minor, built from the exact same white keys/notes. A quick shortcut: the relative minor's root is always 3 semitones (a minor third) below the major root — from G major, count down 3 semitones and you land on E, so E minor is G major's relative minor.\n\nThis matters practically because a huge number of chord progressions borrow freely between a major key and its relative minor without ever leaving the key's note set — a song can sit on a G major chord for a verse and an Em chord for the chorus and still be using nothing but G major's seven notes throughout, just shifting which chord feels like 'home' at a given moment. That shift in gravity, without any new notes, is often what makes a section feel like it 'turns minor' even though nothing technically changed key.\n\nThis is also the seed of modal thinking: the relative minor scale is identical to a mode called Aeolian (natural minor), which you'll formally meet in Phase 3 alongside six other ways of re-centering the same seven notes.",
            },
            {
              title: "Key signatures for all 12 keys",
              description:
                "Memorize which sharps or flats belong to each key, in the order they're added. Lets you read a chart, name a key immediately, and predict which notes will sound 'in.'",
              longDescription:
                "Every major key except C has a fixed set of sharps or flats that stay in effect for the whole piece, and both the sharps and flats are always added in a specific, predictable order — never randomly. Sharps accumulate in this order: F#, C#, G#, D#, A#, E#, B#. Flats accumulate in this order (the exact reverse): Bb, Eb, Ab, Db, Gb, Cb, Fb. So G major has 1 sharp (F#), D major has 2 (F#, C#), A major has 3 (F#, C#, G#), and so on — each new key in the sharp direction just adds the next sharp in that fixed sequence, and the same logic runs in reverse for flat keys (F major has 1 flat, Bb major has 2, and so on).\n\nThis pattern is usually visualized as the circle of fifths: starting at C and moving clockwise by a perfect fifth each step (C-G-D-A-E-B-F#) adds one sharp per step in exactly the order above; moving counter-clockwise by a fourth each step (C-F-Bb-Eb-Ab-Db-Gb) adds one flat per step.\n\nKnowing a key's signature cold means you can look at a chart, immediately know which notes are 'in' the key without deriving the scale note-by-note, and predict on sight that (for example) a C natural in a D major piece is very likely an accidental or a deliberate 'outside' note rather than a key-signature note — that instant recognition is what key signatures are for.",
            },
            {
              title: "Mapping CAGED shapes to the major scale",
              description:
                "Explicitly label the scale degree (1, 2, 3...7) under each finger in each CAGED shape. Turns CAGED from 'shapes' into 'theory you can see.'",
              longDescription:
                "The CAGED system takes the 5 open chord shapes you already know — C, A, G, E, D — and uses each one's fingering pattern as a moveable 'window' onto the fretboard, so any one of the 5 shapes can be slid up or down to play the same chord (or scale) in a different position. The shapes overlap and hand off to each other in a fixed order (C→A→G→E→D→back to C an octave up), which is what lets you connect positions instead of treating them as 5 unrelated boxes.\n\nThe step that makes CAGED actually useful for improvising and soloing, rather than just chord-shape memorization, is labeling which scale degree (1 through 7) falls under each finger within each shape. Once you know that, say, the root and the 5th sit under your 1st and 3rd fingers in the 'E shape' window, that relationship holds true in every key, at every fret — you're not memorizing 5 shapes per key, you're memorizing 5 degree-maps that work in all 12 keys.\n\nPractically: pick one CAGED position, play the scale slowly, and say the degree number out loud on every note instead of just the note name. That's what turns 'I know this shape' into 'I know exactly where the 3rd or the 7th is anywhere on the neck,' which is the actual payoff of learning CAGED in the first place.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title:
                "Play the major scale in one key across all 5 CAGED positions",
              description:
                "Pick one key (e.g., G major) and play the scale ascending/descending in each of the 5 positions before moving to a new key. Depth in one key beats shallow exposure to all 12 at this stage.",
            },
            {
              title: "Identify scale degrees by ear",
              description:
                "While playing the scale, say the scale degree number out loud (or in your head) as you play each note. Wires the sound of 'the 3rd' or 'the 6th' to your ear, not just your finger position.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Interval recognition (2nds through 5ths)",
              description:
                "Use a simple ear-training app or reference recordings, and drill identifying these intervals played both ascending and descending, in isolation (not inside a melody yet).",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "Harmony and Chord Construction",
      goal: "Understand why chords work, not just where to put your fingers.",
      durationLabel: "Months 4-6",
      milestone:
        "Given any key, building all 7 diatonic chords without looking anything up means you can state the key signature, name the 7 scale degrees, and know each chord's quality (major-minor-minor-major-major-minor-diminished) purely from memory — the shapes come from what you already drilled in the Applied section.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Barre chord cleanliness",
              description:
                "Isolate the F barre chord and practice fretting it, releasing, and re-fretting with correct thumb position and minimal grip tension. Muted strings are almost always excess pressure or a misaligned index finger, not lack of strength.",
            },
            {
              title: "Economy of motion in chord changes",
              description:
                "When changing between two chords, identify which fingers can stay in place (a pivot/guide finger) and which have to move. Practicing the transition in isolation trains the efficient path instead of a slow full reset every change.",
            },
            {
              title: "Basic fingerstyle patterns",
              description:
                "Start with a simple thumb-plus-3-finger pattern (P-i-m-a) on a single chord, focusing on consistent volume between fingers before adding any complexity or chord changes.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          orderIndex: 2,
          items: [
            {
              title: "Triad construction (major/minor/dim/aug)",
              description:
                "All 4 triad types come from stacking two intervals of 3rds, just with different quality combinations. Build all 4 from the same root note back-to-back so the ear hears exactly what changes between them.",
              longDescription:
                "A triad is a root note plus two more notes stacked a 3rd apart on top of it — nothing more exotic than that. There are only two sizes of 3rd: a major 3rd (4 semitones) and a minor 3rd (3 semitones), and which one goes on the bottom versus the top is the entire difference between the four triad types. Major = major 3rd then minor 3rd on top (C-E-G). Minor = minor 3rd then major 3rd (C-Eb-G). Diminished = minor 3rd then another minor 3rd (C-Eb-Gb) — both intervals shrink, which is why it sounds tense/unstable. Augmented = major 3rd then another major 3rd (C-E-G#) — both intervals stretch, giving it that unresolved, 'floating' quality.\n\nThe fastest way to actually hear this rather than just know it on paper is to play all four from the same root back to back — C major, C minor, C diminished, C augmented — so the only thing changing between them is that middle note (E vs Eb) and the top note (G vs Gb vs G#). Once your ear locks onto exactly what moves, you'll be able to tell triad quality apart by ear alone, which is the actual goal — the note-stacking math is just how you get there.",
            },
            {
              title: "Diatonic chords in a key (I-ii-iii-IV-V-vi-vii°)",
              description:
                "The 7 chords that naturally occur when you harmonize a major scale. Memorizing the quality pattern (major-minor-minor-major-major-minor-diminished) lets you predict the chords of any key without looking them up.",
              longDescription:
                "'Harmonizing the scale' means building a triad on top of every single degree of the major scale, using only notes that are already in that key — no borrowed or chromatic notes. Do this in C major and you get: C major (I), D minor (ii), E minor (iii), F major (IV), G major (V), A minor (vi), B diminished (vii°). Notice the quality pattern — major, minor, minor, major, major, minor, diminished — because it falls directly out of where the scale's two half-steps land (the same H's from the major-scale formula), and that pattern is identical in every major key, not just C.\n\nThat's what makes this genuinely useful rather than just a chart to memorize: once you know the key signature (which sharps/flats) and this fixed major-minor-minor-major-major-minor-diminished pattern, you can spell out all 7 chords of any major key from memory, with no lookup. Try it in G major (G-Am-Bm-C-D-Em-F#dim) or E major and you'll find the same shape of pattern, just transposed. This is also the direct foundation for the Nashville Number System right after it — those Roman numerals are literally labeling this same 7-chord pattern.",
            },
            {
              title: "Nashville Number System",
              description:
                "Chords labeled by scale-degree number instead of letter name, so a I-IV-V progression is the same numbers in any key. The single most useful shortcut for transposing on the fly.",
              longDescription:
                "Instead of naming chords by letter (C, F, G), the Nashville Number System names them by their scale-degree position in the key (I, IV, V) — literally just numbering the diatonic chords from the previous topic. Because the quality pattern (major-minor-minor-major-major-minor-diminished) is fixed for every major key, 'I-IV-V' means exactly the same relationship in every key: in C it's C-F-G, in G it's G-C-D, in D it's D-G-A. The numbers describe the relationship between chords, not any specific pitch.\n\nThis is what makes the system so practical: a session musician handed a Nashville-numbered chart can play the same song in any key instantly, without re-learning a single 'new' progression — I-IV-V is I-IV-V whether the singer wants it in E or Bb. For you, the everyday use is recognizing that two songs which look totally different on paper (say, one in A and one in D) might be playing the identical progression, just transposed — spotting that is exactly the skill the Phase 2 'write out progressions in Roman numerals' applied exercise is meant to build.",
            },
            {
              title: "7th chords (maj7, min7, dom7, m7b5)",
              description:
                "Adding a 4th note (the 7th) on top of a triad. Dom7 defines the V chord's 'pull' back to the I chord — foundational to functional harmony.",
              longDescription:
                "A 7th chord is a triad with one more 3rd stacked on top, adding the scale's 7th-degree-equivalent note above the root. Depending on which triad you start from and how far that added note sits from the root, you get four common flavors: maj7 (major triad + a note a major 7th above the root — spacious, dreamy), min7 (minor triad + a minor 7th — smooth, mellow), dom7 (major triad + a minor 7th — the odd one out, and the important one below), and m7b5/half-diminished (diminished triad + a minor 7th — used almost exclusively on the vii° chord).\n\nHarmonizing a full major scale in 7th chords instead of triads gives I=maj7, ii=min7, iii=min7, IV=maj7, V=dom7, vi=min7, vii°=m7b5 — so the dominant 7th only ever occurs naturally on the V chord in a given key. That's significant because a dom7 chord contains a tritone (the interval between its 3rd and its b7), and a tritone is intrinsically unstable — your ear wants it to resolve. Resolving a V7 chord to the I chord (G7 to C, for example) satisfies that tension, and that specific pull is the engine behind an enormous amount of functional harmony, including the secondary dominants you'll meet in Phase 4.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Harmonize the major scale up the neck",
              description:
                "In one key, play every diatonic chord (I through vii°) using the same CAGED-based movable shapes from Phase 1, so harmony and the fretboard map you already built connect directly.",
            },
            {
              title:
                "Write out chord progressions in Roman numerals from songs you already play",
              description:
                "Take 3-5 songs you know, figure out the chords, and convert them to numbers relative to their key. You'll quickly see the same 4-5 progressions repeating across unrelated songs.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Major vs. minor vs. dominant 7th by ear",
              description:
                "Play each quality on the same root, back to back, and name them without looking. The dominant 7th's tension against a resolving I chord is usually the easiest to latch onto first.",
            },
            {
              title: "Chord progression dictation (I-IV-V-based)",
              description:
                "Listen to simple progressions and try to identify the sequence by number before checking. Start with well-known song progressions you can verify against.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 3,
      title: "Improvisation and Modes",
      goal: 'Move from "knowing scales" to using them expressively.',
      durationLabel: "Months 7-9",
      milestone:
        'Soloing over a 12-bar blues with 2 scale/mode choices "with intention" means you can explain, in the moment or afterward, why you switched scales where you did — the goal is deliberate choice, not just having more options memorized.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Legato (hammer-ons/pull-offs)",
              description:
                "Focus on volume consistency — a hammered or pulled note should sound as loud as a picked one, which requires real finger force, not just contact. Practice on a single string first before adding position shifts.",
            },
            {
              title: "Bending intonation",
              description:
                "Bend to a target pitch and check it against that same pitch played normally (e.g., bend the 7th fret up to match the 9th fret's pitch). Most bending problems are pitch accuracy problems, not technique problems.",
            },
            {
              title: "String skipping",
              description:
                "Practice picking patterns that skip over adjacent strings deliberately, since this is what most pentatonic/blues lead lines actually require.",
            },
            {
              title: "Sweep picking (optional)",
              description:
                "Only pick this up if you're aiming toward faster arpeggiated lead lines — a specialized technique, not a core requirement for the theory goals of this plan.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          orderIndex: 2,
          items: [
            {
              title: "The 7 modes as reharmonizations of the major scale",
              description:
                "Each mode uses the exact same notes as a major scale, just starting from a different degree — Dorian is 'the major scale starting on its 2nd note,' etc. Far faster than memorizing 7 new interval formulas from scratch.",
              longDescription:
                "You already met this idea informally with relative minor: the same 7 notes can be re-centered around a different root and the pattern of whole/half steps relative to that new root changes, which changes the character of the scale. Modes formalize this into all 7 possible re-centerings of a major scale, each with its own name and personality:\n\nIonian (start on degree 1) is just the major scale itself — bright, resolved. Dorian (degree 2) is minor-flavored but with a raised 6th, giving it a slightly lifted, jazzy/folky quality compared to plain minor. Phrygian (degree 3) is minor with a lowered 2nd, giving it a dark, Spanish/flamenco flavor. Lydian (degree 4) is major with a raised 4th, giving it a bright, dreamy, almost floating quality. Mixolydian (degree 5) is major with a lowered 7th, giving it a bluesy, rock-and-roll pull instead of a strong resolution. Aeolian (degree 6) is natural minor — this is the relative minor you already know. Locrian (degree 7) has a lowered 2nd and 5th, making it feel unstable and is rarely used as a true tonal center.\n\nThe practical shortcut: take a major scale you already know (say C major) and think of D Dorian as 'the same 7 notes, just treating D as home' — no new fingerings or interval formulas to learn from scratch, only a new note to resolve toward.",
            },
            {
              title: "Pentatonic and blues scale relationships to modes",
              description:
                "The minor pentatonic scale is a stripped-down 5-note version of Aeolian/Dorian; the blues scale adds one chromatic 'blue note' on top of that.",
              longDescription:
                "The minor pentatonic scale is Aeolian (natural minor) with its 2nd and 6th degrees removed, leaving just 5 notes — in A minor pentatonic: A, C, D, E, G (compare to full A Aeolian: A, B, C, D, E, F, G). Those two removed notes are the ones most likely to sit a half-step away from a chord tone and create a clash against a simple minor-key backing, so pulling them out leaves a scale that's very hard to make sound 'wrong' — which is exactly why it's the first improvising scale most guitarists reach for.\n\nThe blues scale takes that same 5-note minor pentatonic and adds one more note back in: a b5 (a flatted 5th) sitting right between the 4th and 5th degrees — in A blues: A, C, D, Eb, E, G. That single chromatic addition is the 'blue note,' and it's deliberately the most dissonant note available against the underlying chord, used as a passing tone or a bent target rather than something you land on and hold.\n\nOnce you can hear how thin the minor pentatonic sounds compared to the fuller Dorian or Aeolian it's drawn from, adding scale tones back in (the 2nd, the 6th, or the blues b5) is how you get from 'safe pentatonic licks' to lines that sound genuinely modal — which is the whole bridge this topic is building toward.",
            },
            {
              title: "Chord-scale relationships",
              description:
                "For a given chord, certain scales/modes 'fit' because they share the chord's essential notes. Over a major chord, Ionian or Lydian fit; over a minor chord, Aeolian or Dorian fit.",
              longDescription:
                "A scale 'fits' a chord when it contains that chord's essential notes — root, 3rd, and 5th at minimum, ideally the 7th too if the chord has one — since those are the tones that actually define the chord's identity underneath a solo line. Over a plain major or maj7 chord, both Ionian and Lydian fit, because both contain a major 3rd and a major/perfect combination that outlines the chord; Lydian just adds a brighter, raised-4th color on top. Over a minor or min7 chord, Aeolian and Dorian both fit for the mirror reason, with Dorian's raised 6th giving a slightly more open sound than Aeolian's straight natural minor.\n\nA practical worked example is a ii-V-I in C major (Dm7 - G7 - Cmaj7): over the Dm7 you'd reach for D Dorian, over the G7 you'd reach for G Mixolydian (major-family with a lowered 7th, matching the dominant chord's own b7), and over the Cmaj7 you'd land back on C Ionian or C Lydian. Notice all three of those scale choices are actually built from the exact same 7 notes (C major) — the 'chord-scale' choice here isn't about switching note pools, it's about which note within that shared pool you're treating as home and emphasizing as you pass over each chord, which is precisely the 'targeting chord tones' skill the Applied section below is built to drill.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title:
                "Improvise over a static I chord using the matching mode",
              description:
                "Loop a single chord (backing track or looper pedal) and improvise using only the matching mode, focusing on landing on the chord tones (1, 3, 5) on strong beats.",
            },
            {
              title:
                "Improvise over a ii-V-I progression, targeting chord tones",
              description:
                "Deliberately aim for a chord tone of whichever chord is currently sounding, right as the chord changes, rather than running a scale on autopilot through the whole progression.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title:
                "Distinguish major-family vs. minor-family modes by ear",
              description:
                "Train the broader 'does this sound major-ish or minor-ish' distinction reliably and quickly first, before identifying exact modes.",
            },
            {
              title: "Weekly short melodic transcription",
              description:
                "Pick a short phrase (4-8 notes) from a song, figure it out by ear on the guitar, and check yourself against the recording. Keep phrases short and frequent rather than occasional long transcriptions.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 4,
      title: "Advanced Harmony and Personal Style",
      goal: "Consolidate everything into your own musical vocabulary.",
      durationLabel: "Months 10-12",
      milestone:
        'An original composition or arrangement "deliberately applying at least 3 concepts" means you should be able to point to specific measures and name the concept in use — the point is conscious application, proving the theory has become usable rather than just understood abstractly.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Advanced fingerstyle or hybrid picking",
              description:
                "Pick a direction based on genuine interest rather than defaulting — fingerstyle suits solo arranging, hybrid picking (pick + fingers) suits country/lead-heavy playing. Depth in one beats a shallow pass at both.",
            },
            {
              title: "Dynamics and touch control",
              description:
                "Practice playing the identical phrase at 3 distinct volume levels without changing the notes or tempo, isolating touch as its own controllable variable.",
            },
            {
              title: "Efficient position shifting",
              description:
                "When a lead line requires moving up the neck, practice shifting during a sustained or held note rather than during a rhythmically active moment, so the shift becomes inaudible.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          orderIndex: 2,
          items: [
            {
              title: "Secondary dominants",
              description:
                "A dominant 7th chord borrowed to resolve into a chord other than the I (e.g., a 'V of V'), used to add a temporary pull toward a chord that isn't the main key center.",
              longDescription:
                "You already know that a dom7 chord's tritone creates a strong pull toward whatever chord sits a 5th below it — normally that's V7 resolving to I. A secondary dominant borrows that exact same trick to resolve into a chord other than the I. The notation 'V/V' (read 'five of five') means: build a dominant 7th on the 5th degree of whatever chord you're about to briefly treat as a temporary key center — in this case, the V chord itself.\n\nConcretely, in C major the V chord is G. The V of G (i.e. V/V relative to the home key of C) is D7 — a chord that isn't naturally diatonic to C major at all, since diatonic C major would give you a plain D minor there, not D7. Raising that F to F# to make it D7 borrows a leading tone that pulls hard into G, giving you a much stronger push toward the V chord than the plain diatonic Dm-to-G motion would.\n\nThe reason this works is the same tritone-resolution logic from 7th chords, just retargeted: any major or minor chord in your progression can be temporarily treated as a mini 'I,' and building a dominant 7th a 5th above it borrows a leading tone that doesn't belong to your main key, creating exactly the kind of 'surprise but still makes sense' chord that shows up constantly in otherwise simple progressions.",
            },
            {
              title: "Borrowed chords",
              description:
                "Chords pulled from the parallel minor or major key (e.g., a minor iv chord in an otherwise major-key song) for color, without fully changing key.",
              longDescription:
                "'Parallel' keys share the same root but differ in mode — C major and C minor are parallel keys (different note sets, same starting note), as opposed to relative keys like C major and A minor (same note set, different starting note). A borrowed chord takes a chord from the parallel key and drops it into an otherwise diatonic progression for color, without actually changing the song's key center.\n\nThe most common example: in a major-key song, borrowing the iv chord from the parallel minor. In C major the diatonic iv-equivalent would be F major (IV), but C minor's iv chord is F minor — borrowing that Fm into a C major song (often right before resolving back to C) gives a moment of unexpected darkness that resolves warmly once the major I returns. Other frequently borrowed chords include bVII (Bb in the key of C, borrowed from C minor) and bVI (Ab in the key of C), both common in rock and pop for a similar 'lifted from somewhere else, but it works' effect.\n\nThe ear test for whether something is a borrowed chord versus a full key change is whether the music snaps back to the original key's diatonic chords right after — a borrowed chord is a brief visit, not a relocation.",
            },
            {
              title: "Extended chords (9ths, 11ths, 13ths)",
              description:
                "These stack additional 3rds beyond the 7th chord. Learn practical, playable guitar voicings rather than full theoretical stacks — knowing which notes are safe to drop matters as much as the theory.",
              longDescription:
                "Keep stacking 3rds past the 7th chord and you get extensions: one more 3rd above the 7th gives you a 9th, another gives an 11th, another gives a 13th — in C: C-E-G-Bb-D(9)-F(11)-A(13). In full theoretical form a 13th chord contains 7 different notes, which is already more notes than a standard 6-string guitar chord voicing can realistically hold while still sounding clear.\n\nIn practice, guitarists drop notes that are least essential to the chord's identity and keep the ones that are — usually keeping the root, the 3rd (defines major/minor), the 7th (defines the chord's basic color/function), and the specific extension being named, while dropping the 5th (rarely essential) and any extension degrees not explicitly named. A practical 9th chord voicing, for instance, is often just root-3rd-7th-9th with the 5th and any theoretical-but-unplayed lower extensions omitted entirely — it still reads clearly as '9th chord' to the ear because the notes that matter are all present.\n\nThe skill worth building here isn't memorizing every possible extended-chord shape; it's learning to look at any extended chord and immediately identify which 3-4 notes are load-bearing for its sound, since that judgment is what lets you build a usable voicing for a chord you've never specifically learned a shape for.",
            },
            {
              title: "Basic voice leading",
              description:
                "Choosing chord voicings so that individual notes move the shortest possible distance between chords, rather than jumping between disconnected shapes.",
              longDescription:
                "Most guitarists learn chords as whole shapes and move between them by picking up the entire shape and setting it down somewhere else — which works, but often means every note jumps a large, audible distance even when the underlying harmony is only changing a little. Voice leading is the practice of choosing (or altering) a chord voicing so that its individual notes move as little as possible into the next chord, rather than moving the whole shape uniformly.\n\nA simple example: moving from C major (C-E-G) to A minor (A-C-E) shares two notes outright (C and E) — a voice-led transition keeps those shared notes in the same physical spot and only moves the note that actually needs to change (G to A), rather than re-fretting the whole chord as a fresh shape. Extend that thinking across a full progression and the individual notes trace short, smooth paths from chord to chord instead of a series of unrelated jumps.\n\nThis is the difference between a progression that's technically correct on paper but sounds a bit clunky, versus one that sounds connected and intentional — and it's also the practical foundation for reharmonization right after this, since smoothly voice-leading a substitute chord into a progression is what keeps a bold harmonic substitution from sounding jarring.",
            },
            {
              title: "Intro to reharmonization",
              description:
                "Taking an existing melody and supporting it with a different (but still compatible) set of chords underneath, using secondary dominants/borrowed chords/extensions as your toolkit.",
              longDescription:
                "Reharmonization means keeping an existing melody exactly as it is, but changing the chords supporting it underneath to something that still fits the melody notes but creates a different mood or color. It's the point where secondary dominants, borrowed chords, extended chords, and voice leading — everything else in this phase — stop being separate topics and become one combined toolkit.\n\nA simple worked example: take a plain I-IV-V-I progression in C (C-F-G-C). A first reharmonization might replace the plain V with a secondary-dominant-preceded version, inserting a V/V (D7) before the G to sharpen the pull into it: C-F-D7-G-C. A second pass might borrow the minor iv (Fm) right before the final C for a darker color on the way home: C-Fm-G-C. In both cases the melody notes over each chord haven't necessarily changed — what changed is the harmonic support underneath, and specifically how much tension and color that support adds before resolving.\n\nThe practical exercise worth doing is exactly this: take a progression you already know cold from Phase 2's Roman-numeral work, and try substituting one chord at a time, listening for what shifts emotionally with each substitution rather than trying to overhaul the whole thing at once.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Reharmonize a familiar progression",
              description:
                "Take a simple progression you already know and substitute at least one borrowed chord or secondary dominant, then listen for what changed emotionally.",
            },
            {
              title: "Compose an 8-16 bar original piece",
              description:
                "Deliberately require yourself to use at least one concept from each of the previous 3 phases so the composition functions as a real synthesis exercise, not just a free-write.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Full chord quality ID including extensions",
              description:
                "Extend the Phase 2 ear-training drill to include 9ths and other extensions, since the 'flavor' they add is often more recognizable by ear than by looking at the notes on paper.",
            },
            {
              title: "Transcribe a full short passage (melody + chords)",
              description:
                "A step up from Phase 3's melody-only transcription — now work out both the tune and what's harmonizing it underneath for a short section of a song.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          orderIndex: 1,
          items: [
            {
              title: "Metronome always on",
              description:
                "Track a specific tempo number per exercise over time (e.g., 'chromatic warm-up: 72 BPM → 96 BPM over 6 weeks') so progress is measurable instead of a vague feeling of 'getting better.'",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              description:
                "What you worked on, one small win, one specific struggle is enough. Read back through a month of entries occasionally; patterns in what keeps showing up as 'struggle' tell you where to spend more deliberate time.",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              description:
                "Every couple of weeks, replay something from an earlier phase without warming up on it first. If it's shaky, that's useful information — it means the skill needs occasional maintenance reps, not that you failed to learn it.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          orderIndex: 4,
          items: [
            {
              title: "Pair every theory concept with a real song",
              description:
                "For every phase's theory concept, find or pick 1-2 actual songs/pieces that use it, so the abstract concept always has a concrete, motivating home rather than living only in exercises.",
            },
          ],
        },
      ],
    },
  ],
};

async function seed() {
  const [instrument] = await db
    .insert(instruments)
    .values(guitarPlan.instrument)
    .onConflictDoUpdate({
      target: instruments.slug,
      set: { name: guitarPlan.instrument.name },
    })
    .returning();

  const existingPlan = await db.query.plans.findFirst({
    where: eq(plans.instrumentId, instrument.id),
  });
  const [plan] = existingPlan
    ? await db
        .update(plans)
        .set({
          title: guitarPlan.plan.title,
          description: guitarPlan.plan.description,
        })
        .where(eq(plans.id, existingPlan.id))
        .returning()
    : await db
        .insert(plans)
        .values({ ...guitarPlan.plan, instrumentId: instrument.id })
        .returning();

  let firstRealPhaseId: number | null = null;

  for (const seedPhase of guitarPlan.phases) {
    const [phase] = await db
      .insert(phases)
      .values({
        planId: plan.id,
        orderIndex: seedPhase.orderIndex,
        isOngoing: seedPhase.isOngoing ?? false,
        title: seedPhase.title,
        goal: seedPhase.goal,
        durationLabel: seedPhase.durationLabel,
      })
      .onConflictDoUpdate({
        target: [phases.planId, phases.orderIndex],
        set: {
          title: seedPhase.title,
          goal: seedPhase.goal,
          durationLabel: seedPhase.durationLabel,
          isOngoing: seedPhase.isOngoing ?? false,
        },
      })
      .returning();

    if (!seedPhase.isOngoing && firstRealPhaseId === null) {
      firstRealPhaseId = phase.id;
    }

    if (seedPhase.milestone) {
      await db
        .insert(milestones)
        .values({ phaseId: phase.id, description: seedPhase.milestone })
        .onConflictDoUpdate({
          target: milestones.phaseId,
          set: { description: seedPhase.milestone },
        });
    }

    for (const seedCategory of seedPhase.categories) {
      const [category] = await db
        .insert(categories)
        .values({
          phaseId: phase.id,
          slug: seedCategory.slug,
          name: seedCategory.name,
          orderIndex: seedCategory.orderIndex,
          dailyMinMinutes: seedCategory.dailyMinMinutes,
          dailyMaxMinutes: seedCategory.dailyMaxMinutes,
        })
        .onConflictDoUpdate({
          target: [categories.phaseId, categories.slug],
          set: {
            name: seedCategory.name,
            orderIndex: seedCategory.orderIndex,
            dailyMinMinutes: seedCategory.dailyMinMinutes,
            dailyMaxMinutes: seedCategory.dailyMaxMinutes,
          },
        })
        .returning();

      for (let i = 0; i < seedCategory.items.length; i++) {
        const seedItem = seedCategory.items[i];
        await db
          .insert(items)
          .values({
            categoryId: category.id,
            title: seedItem.title,
            description: seedItem.description,
            longDescription: seedItem.longDescription,
            orderIndex: i,
          })
          .onConflictDoUpdate({
            target: [items.categoryId, items.title],
            set: {
              description: seedItem.description,
              longDescription: seedItem.longDescription,
              orderIndex: i,
            },
          });
      }
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation.",
    );
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const [user] = await db
      .insert(users)
      .values({ email: adminEmail.toLowerCase(), passwordHash })
      .onConflictDoUpdate({
        target: users.email,
        set: { passwordHash },
      })
      .returning();

    if (firstRealPhaseId !== null) {
      await db
        .insert(userPlanProgress)
        .values({ userId: user.id, planId: plan.id, currentPhaseId: firstRealPhaseId })
        .onConflictDoNothing({
          target: [userPlanProgress.userId, userPlanProgress.planId],
        });
    }

    console.log(`Seeded admin user: ${user.email}`);
  }

  console.log("Seed complete.");
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => {
    process.exit();
  });
