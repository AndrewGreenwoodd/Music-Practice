import { config } from "dotenv";

config({ path: ".env.local" });
import { and, eq } from "drizzle-orm";
import { db } from "./index";
import {
  categories,
  instruments,
  items,
  milestones,
  phases,
  plans,
} from "./schema";

type SeedItem = {
  title: string;
  titleUk: string;
  description: string;
  descriptionUk: string;
  longDescription?: string;
  longDescriptionUk?: string;
};
type SeedCategory = {
  slug: string;
  name: string;
  nameUk: string;
  orderIndex: number;
  dailyMinMinutes?: number;
  dailyMaxMinutes?: number;
  items: SeedItem[];
};
type SeedPhase = {
  orderIndex: number;
  isOngoing?: boolean;
  title: string;
  titleUk: string;
  goal: string;
  goalUk: string;
  durationLabel?: string;
  milestone?: string;
  categories: SeedCategory[];
};

const guitarPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "guitar", name: "Guitar", nameUk: "Гітара" },
  plan: {
    title: "Long-Term Guitar Practice Plan",
    titleUk: "Довгостроковий план практики гри на гітарі",
    description:
      "Intermediate-level, 12-month plan combining technique and theory, ~30-45 min/day.",
    descriptionUk:
      "12-місячний план середнього рівня, що поєднує техніку та теорію, ~30-45 хв/день.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Foundations of the Fretboard",
      titleUk: "Основи грифа",
      goal: "Know the neck cold and connect scale shapes to real theory.",
      goalUk: "Знати гриф напам'ять і пов'язати форми гам із реальною теорією.",
      durationLabel: "Months 1-3",
      milestone:
        "Naming any note on the fretboard in under 2 seconds means drilling the natural notes (E,F,G,A,B,C,D) on each string individually until it's reflexive, then adding sharps/flats. Playing the major scale in 3 positions from memory means no glancing at a chart or backtracking mid-scale — full run, start to finish, twice in a row clean.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Chromatic warm-ups",
              titleUk: "Хроматична розминка",
              description:
                "Play 1-2-3-4 (one finger per fret) across all six strings, ascending and descending, then shift up a fret and repeat. Builds finger independence and left-hand synchronization with almost no musical decision-making required, so you can focus entirely on cleanliness.",
              descriptionUk:
                "Грайте 1-2-3-4 (один палець на лад) на всіх шести струнах, вгору і вниз, потім зсуньтесь на лад вище і повторіть. Розвиває незалежність пальців і синхронізацію лівої руки, майже не вимагаючи музичних рішень, тож можна повністю зосередитися на чистоті звучання.",
            },
            {
              title: "3-note-per-string scale patterns",
              titleUk: "Гамові патерни по 3 ноти на струну",
              description:
                "Instead of the '3 frets = 1 position' box shapes, 3-note-per-string patterns run scales in straight lines up each string. They cover more fretboard real estate per shape and are the standard vocabulary for fast, fluid scale runs later on.",
              descriptionUk:
                "Замість «блокових» форм за принципом «3 лади = 1 позиція», патерни по 3 ноти на струну ведуть гаму прямими лініями вздовж кожної струни. Вони охоплюють більшу частину грифа в одній формі й стають стандартною основою для швидких, плавних пробіжок гамою в подальшому.",
            },
            {
              title: "Alternate picking, accuracy over speed",
              titleUk: "Перемінний медіатор: точність важливіша за швидкість",
              description:
                "Strict down-up-down-up picking, practiced against a metronome starting absurdly slow (50-60 BPM). If you have to slow down to keep the pick pattern perfectly alternating, slow down — speed built on inconsistent picking hits a ceiling fast and is hard to unlearn.",
              descriptionUk:
                "Суворий рух медіатора вниз-вгору-вниз-вгору, під метроном, починаючи з навмисно повільного темпу (50-60 уд/хв). Якщо доводиться сповільнюватися, щоб зберегти ідеальне чергування удару — сповільнюйтесь: швидкість, побудована на нерівномірному ударі, швидко впирається у стелю, і від цієї звички важко позбутися.",
            },
            {
              title: "CAGED system, all 5 shapes",
              titleUk: "Система CAGED, усі 5 форм",
              description:
                "CAGED maps the 5 open chord shapes (C, A, G, E, D) onto the neck as movable position markers. Learn all 5 shapes for a single major scale/key first, in order, so you can see how shape 1 hands off to shape 2 further up the neck.",
              descriptionUk:
                "CAGED накладає 5 форм відкритих акордів (C, A, G, E, D) на гриф як рухомі орієнтири позицій. Спочатку вивчіть усі 5 форм для однієї мажорної гами/тональності, по порядку, щоб побачити, як форма 1 переходить у форму 2 далі вгору по грифу.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Major scale construction (W-W-H-W-W-W-H)",
              titleUk: "Побудова мажорної гами (Т-Т-П-Т-Т-Т-П)",
              description:
                "This interval formula is what defines 'major' in any key. Build it from different starting notes on one string only, so the sound of the pattern (not a memorized fingering) becomes what you recognize.",
              descriptionUk:
                "Ця формула інтервалів визначає «мажор» у будь-якій тональності. Будуйте її від різних нот на одній струні, щоб впізнавати саме звучання патерну, а не завчену аплікатуру.",
              longDescription:
                "W-W-H-W-W-W-H is a recipe, not a fixed set of notes: W means move up 2 frets (a whole step), H means move up 1 fret (a half step). Start on any note and apply the recipe and you get that note's major scale. From C: C(W)D(W)E(H)F(W)G(W)A(W)B(H)C — the two half-steps land between degrees 3-4 and 7-8, which is exactly what gives the major scale its recognizable 'resolved' sound, since those are the two spots where the ear feels the least room to relax before the next note pulls it forward.\n\nBecause it's a formula, it transfers to every key without new memorization — from E: E(W)F#(W)G#(H)A(W)B(W)C#(W)D#(H)E. The fastest way to internalize this is to play it on a single string, one note per formula step, in a few different keys. Doing it on one string strips away any shape or fingering pattern, so what you're left with is the interval pattern itself, and that's the thing that should eventually 'sound' major to you before you even check the notes.\n\nEvery other scale and mode later in this plan (Phase 3's modes, the pentatonic and blues scales) is a variation or subset of this same formula, so getting this one truly under your fingers and ear first is what makes everything after it faster to learn.",
              longDescriptionUk:
                "Т-Т-П-Т-Т-Т-П — це рецепт, а не фіксований набір нот: Т означає піднятися на 2 лади (цілий тон), П — піднятися на 1 лад (півтон). Візьміть будь-яку ноту, застосуйте рецепт — і отримаєте мажорну гаму від цієї ноти. Від C: C(Т)D(Т)E(П)F(Т)G(Т)A(Т)B(П)C — два півтони припадають на проміжки між ступенями 3-4 та 7-8, і саме це надає мажорній гамі її впізнаваного «розв'язаного» звучання, адже це ті два місця, де слух відчуває найменше простору для «відпочинку», перш ніж наступна нота потягне його далі.\n\nОскільки це формула, вона переноситься на будь-яку тональність без нового завчання — від E: E(Т)F#(Т)G#(П)A(Т)B(Т)C#(Т)D#(П)E. Найшвидший спосіб засвоїти це — грати на одній струні, по одній ноті на крок формули, у кількох різних тональностях. Гра на одній струні прибирає будь-яку форму чи аплікатуру, залишаючи лише сам інтервальний патерн — і саме це з часом має «звучати» по-мажорному ще до того, як ви перевірите ноти.\n\nКожна інша гама й лад, які трапляться далі в цьому плані (лади з Етапу 3, пентатоніка та блюзова гама), є варіацією або підмножиною цієї ж формули, тож справжнє засвоєння саме цієї гами — пальцями і слухом — і робить усе подальше навчання швидшим.",
            },
            {
              title: "Relative minor",
              titleUk: "Паралельний мінор",
              description:
                "Every major key has a minor key sharing the same notes, starting from its 6th scale degree (e.g., C major and A minor). Explains why so many 'different' songs use identical note sets, and sets up modal thinking in Phase 3.",
              descriptionUk:
                "Кожна мажорна тональність має мінорну тональність із тим самим набором нот, що починається з 6-го ступеня гами (наприклад, до мажор і ля мінор). Пояснює, чому так багато «різних» пісень використовують однаковий набір нот, і закладає основу для ладового мислення в Етапі 3.",
              longDescription:
                "Take any major scale and start counting from its 6th degree instead of its 1st, and you get that key's relative minor — same seven notes, different note treated as 'home.' In C major (C D E F G A B), the 6th degree is A, so A minor is C major's relative minor, built from the exact same white keys/notes. A quick shortcut: the relative minor's root is always 3 semitones (a minor third) below the major root — from G major, count down 3 semitones and you land on E, so E minor is G major's relative minor.\n\nThis matters practically because a huge number of chord progressions borrow freely between a major key and its relative minor without ever leaving the key's note set — a song can sit on a G major chord for a verse and an Em chord for the chorus and still be using nothing but G major's seven notes throughout, just shifting which chord feels like 'home' at a given moment. That shift in gravity, without any new notes, is often what makes a section feel like it 'turns minor' even though nothing technically changed key.\n\nThis is also the seed of modal thinking: the relative minor scale is identical to a mode called Aeolian (natural minor), which you'll formally meet in Phase 3 alongside six other ways of re-centering the same seven notes.",
              longDescriptionUk:
                "Візьміть будь-яку мажорну гаму і почніть рахувати не з 1-го, а з 6-го ступеня — і отримаєте паралельний мінор цієї тональності: ті самі сім нот, але «домом» вважається інша нота. У до мажорі (C D E F G A B) 6-й ступінь — це A, тож ля мінор є паралельним мінором до мажору, побудованим на абсолютно тих самих нотах. Швидкий спосіб знайти його: основний тон паралельного мінору завжди на 3 півтони (малу терцію) нижче за основний тон мажору — від соль мажору відрахуйте 3 півтони вниз і потрапите на E, тож мі мінор є паралельним мінором до соль мажору.\n\nЦе має практичне значення, бо величезна кількість акордових послідовностей вільно переходить між мажорною тональністю та її паралельним мінором, жодного разу не виходячи за межі набору нот тональності — пісня може триматися на акорді G major у куплеті та Em у приспіві, використовуючи весь час лише сім нот соль мажору, просто змінюючи, який акорд відчувається як «дім» у певний момент. Саме ця зміна тяжіння, без жодної нової ноти, часто й створює відчуття, що частина пісні «стає мінорною», хоча тональність технічно не змінилася.\n\nЦе також зерно ладового мислення: гама паралельного мінору ідентична ладу під назвою еолійський (натуральний мінор), з яким ви формально познайомитесь в Етапі 3 разом із шістьма іншими способами «перецентрувати» ті самі сім нот.",
            },
            {
              title: "Key signatures for all 12 keys",
              titleUk: "Ключові знаки для всіх 12 тональностей",
              description:
                "Memorize which sharps or flats belong to each key, in the order they're added. Lets you read a chart, name a key immediately, and predict which notes will sound 'in.'",
              descriptionUk:
                "Запам'ятайте, які дієзи чи бемолі належать кожній тональності, у порядку їх додавання. Це дозволяє читати чарт, миттєво називати тональність і передбачати, які ноти звучатимуть «у тональності».",
              longDescription:
                "Every major key except C has a fixed set of sharps or flats that stay in effect for the whole piece, and both the sharps and flats are always added in a specific, predictable order — never randomly. Sharps accumulate in this order: F#, C#, G#, D#, A#, E#, B#. Flats accumulate in this order (the exact reverse): Bb, Eb, Ab, Db, Gb, Cb, Fb. So G major has 1 sharp (F#), D major has 2 (F#, C#), A major has 3 (F#, C#, G#), and so on — each new key in the sharp direction just adds the next sharp in that fixed sequence, and the same logic runs in reverse for flat keys (F major has 1 flat, Bb major has 2, and so on).\n\nThis pattern is usually visualized as the circle of fifths: starting at C and moving clockwise by a perfect fifth each step (C-G-D-A-E-B-F#) adds one sharp per step in exactly the order above; moving counter-clockwise by a fourth each step (C-F-Bb-Eb-Ab-Db-Gb) adds one flat per step.\n\nKnowing a key's signature cold means you can look at a chart, immediately know which notes are 'in' the key without deriving the scale note-by-note, and predict on sight that (for example) a C natural in a D major piece is very likely an accidental or a deliberate 'outside' note rather than a key-signature note — that instant recognition is what key signatures are for.",
              longDescriptionUk:
                "Кожна мажорна тональність, крім до мажору, має фіксований набір дієзів або бемолів, що діють протягом усього твору, і дієзи та бемолі завжди додаються у чіткому, передбачуваному порядку — ніколи випадково. Дієзи накопичуються в такому порядку: F#, C#, G#, D#, A#, E#, B#. Бемолі накопичуються у зворотному порядку: Bb, Eb, Ab, Db, Gb, Cb, Fb. Тож у соль мажорі 1 дієз (F#), у ре мажорі — 2 (F#, C#), у ля мажорі — 3 (F#, C#, G#) і так далі — кожна нова тональність у «дієзному» напрямку просто додає наступний дієз у цій фіксованій послідовності, і та сама логіка діє у зворотному напрямку для бемольних тональностей (у фа мажорі 1 бемоль, у сі-бемоль мажорі — 2, і так далі).\n\nЦей патерн зазвичай візуалізують як коло квінт: рухаючись від C за годинниковою стрілкою на чисту квінту щокроку (C-G-D-A-E-B-F#), додаємо по одному дієзу за раз саме в порядку вище; рухаючись проти годинникової стрілки на кварту щокроку (C-F-Bb-Eb-Ab-Db-Gb), додаємо по одному бемолю за раз.\n\nЗнання ключових знаків напам'ять означає, що ви можете поглянути на чарт і одразу зрозуміти, які ноти «в тональності», не вираховуючи гаму нота за нотою, і передбачити з першого погляду, що, наприклад, C-бекар у творі в ре мажорі — це, найімовірніше, випадковий знак або свідомо «чужа» нота, а не нота ключового знаку — саме для такого миттєвого розпізнавання й потрібні ключові знаки.",
            },
            {
              title: "Mapping CAGED shapes to the major scale",
              titleUk: "Прив'язка форм CAGED до мажорної гами",
              description:
                "Explicitly label the scale degree (1, 2, 3...7) under each finger in each CAGED shape. Turns CAGED from 'shapes' into 'theory you can see.'",
              descriptionUk:
                "Явно позначте ступінь гами (1, 2, 3...7) під кожним пальцем у кожній формі CAGED. Це перетворює CAGED із набору «форм» на «теорію, яку видно».",
              longDescription:
                "The CAGED system takes the 5 open chord shapes you already know — C, A, G, E, D — and uses each one's fingering pattern as a moveable 'window' onto the fretboard, so any one of the 5 shapes can be slid up or down to play the same chord (or scale) in a different position. The shapes overlap and hand off to each other in a fixed order (C→A→G→E→D→back to C an octave up), which is what lets you connect positions instead of treating them as 5 unrelated boxes.\n\nThe step that makes CAGED actually useful for improvising and soloing, rather than just chord-shape memorization, is labeling which scale degree (1 through 7) falls under each finger within each shape. Once you know that, say, the root and the 5th sit under your 1st and 3rd fingers in the 'E shape' window, that relationship holds true in every key, at every fret — you're not memorizing 5 shapes per key, you're memorizing 5 degree-maps that work in all 12 keys.\n\nPractically: pick one CAGED position, play the scale slowly, and say the degree number out loud on every note instead of just the note name. That's what turns 'I know this shape' into 'I know exactly where the 3rd or the 7th is anywhere on the neck,' which is the actual payoff of learning CAGED in the first place.",
              longDescriptionUk:
                "Система CAGED бере 5 уже знайомих вам форм відкритих акордів — C, A, G, E, D — і використовує аплікатуру кожної з них як рухоме «вікно» на грифі, тож будь-яку з 5 форм можна пересунути вгору чи вниз, щоб зіграти той самий акорд (чи гаму) в іншій позиції. Форми перекриваються й передають естафету одна одній у фіксованому порядку (C→A→G→E→D→знову C на октаву вище), і саме це дозволяє поєднувати позиції, а не сприймати їх як 5 не пов'язаних між собою «коробок».\n\nКрок, який робить CAGED дійсно корисною для імпровізації та соло, а не просто завчання форм акордів — це позначення того, який ступінь гами (від 1 до 7) припадає на кожен палець у кожній формі. Щойно ви знаєте, що, скажімо, основний тон і квінта лежать під 1-м і 3-м пальцями у «вікні форми E», це співвідношення зберігається у будь-якій тональності, на будь-якому ладі — ви завчаєте не 5 форм на кожну тональність, а 5 карт ступенів, які працюють у всіх 12 тональностях.\n\nПрактично: оберіть одну позицію CAGED, повільно зіграйте гаму й вголос називайте номер ступеня на кожній ноті замість назви ноти. Саме це перетворює «я знаю цю форму» на «я точно знаю, де на грифі знаходиться 3-й чи 7-й ступінь» — а це і є справжня користь від вивчення CAGED.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Play the major scale in one key across all 5 CAGED positions",
              titleUk: "Зіграйте мажорну гаму в одній тональності у всіх 5 позиціях CAGED",
              description:
                "Pick one key (e.g., G major) and play the scale ascending/descending in each of the 5 positions before moving to a new key. Depth in one key beats shallow exposure to all 12 at this stage.",
              descriptionUk:
                "Оберіть одну тональність (наприклад, соль мажор) і зіграйте гаму вгору/вниз у кожній з 5 позицій, перш ніж переходити до нової тональності. На цьому етапі глибина в одній тональності важливіша за поверхневе знайомство з усіма 12.",
            },
            {
              title: "Identify scale degrees by ear",
              titleUk: "Розпізнавайте ступені гами на слух",
              description:
                "While playing the scale, say the scale degree number out loud (or in your head) as you play each note. Wires the sound of 'the 3rd' or 'the 6th' to your ear, not just your finger position.",
              descriptionUk:
                "Граючи гаму, вголос (або подумки) називайте номер ступеня для кожної ноти. Це «прошиває» звучання «терції» чи «сексти» безпосередньо у ваш слух, а не лише в позицію пальців.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Interval recognition (2nds through 5ths)",
              titleUk: "Розпізнавання інтервалів (від секунди до квінти)",
              description:
                "Use a simple ear-training app or reference recordings, and drill identifying these intervals played both ascending and descending, in isolation (not inside a melody yet).",
              descriptionUk:
                "Використовуйте простий застосунок для тренування слуху або еталонні записи й тренуйтеся розпізнавати ці інтервали, зіграні як висхідно, так і низхідно, окремо (ще не в межах мелодії).",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "Harmony and Chord Construction",
      titleUk: "Гармонія та побудова акордів",
      goal: "Understand why chords work, not just where to put your fingers.",
      goalUk: "Зрозуміти, чому акорди «працюють», а не лише куди ставити пальці.",
      durationLabel: "Months 4-6",
      milestone:
        "Given any key, building all 7 diatonic chords without looking anything up means you can state the key signature, name the 7 scale degrees, and know each chord's quality (major-minor-minor-major-major-minor-diminished) purely from memory — the shapes come from what you already drilled in the Applied section.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Barre chord cleanliness",
              titleUk: "Чистота баре",
              description:
                "Isolate the F barre chord and practice fretting it, releasing, and re-fretting with correct thumb position and minimal grip tension. Muted strings are almost always excess pressure or a misaligned index finger, not lack of strength.",
              descriptionUk:
                "Виокремте акорд F баре й тренуйте затискання, відпускання та повторне затискання з правильним положенням великого пальця та мінімальним напруженням хвата. Приглушені струни майже завжди пов'язані із зайвим тиском або неправильним положенням вказівного пальця, а не з браком сили.",
            },
            {
              title: "Economy of motion in chord changes",
              titleUk: "Економія руху при зміні акордів",
              description:
                "When changing between two chords, identify which fingers can stay in place (a pivot/guide finger) and which have to move. Practicing the transition in isolation trains the efficient path instead of a slow full reset every change.",
              descriptionUk:
                "Переходячи між двома акордами, визначте, які пальці можуть залишитись на місці (опорний палець), а які мають рухатись. Відпрацювання переходу окремо тренує ефективний шлях замість повільного повного «скидання» при кожній зміні.",
            },
            {
              title: "Basic fingerstyle patterns",
              titleUk: "Базові патерни гри пальцями (fingerstyle)",
              description:
                "Start with a simple thumb-plus-3-finger pattern (P-i-m-a) on a single chord, focusing on consistent volume between fingers before adding any complexity or chord changes.",
              descriptionUk:
                "Почніть із простого патерну «великий палець + 3 пальці» (P-i-m-a) на одному акорді, зосереджуючись на рівній гучності між пальцями, перш ніж додавати складність чи зміну акордів.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Triad construction (major/minor/dim/aug)",
              titleUk: "Побудова тризвуків (мажорний/мінорний/зменшений/збільшений)",
              description:
                "All 4 triad types come from stacking two intervals of 3rds, just with different quality combinations. Build all 4 from the same root note back-to-back so the ear hears exactly what changes between them.",
              descriptionUk:
                "Усі 4 типи тризвуків утворюються накладанням двох терцій, лише з різними комбінаціями якості. Побудуйте всі 4 від однієї й тієї ж основної ноти підряд, щоб слух точно вловив, що між ними змінюється.",
              longDescription:
                "A triad is a root note plus two more notes stacked a 3rd apart on top of it — nothing more exotic than that. There are only two sizes of 3rd: a major 3rd (4 semitones) and a minor 3rd (3 semitones), and which one goes on the bottom versus the top is the entire difference between the four triad types. Major = major 3rd then minor 3rd on top (C-E-G). Minor = minor 3rd then major 3rd (C-Eb-G). Diminished = minor 3rd then another minor 3rd (C-Eb-Gb) — both intervals shrink, which is why it sounds tense/unstable. Augmented = major 3rd then another major 3rd (C-E-G#) — both intervals stretch, giving it that unresolved, 'floating' quality.\n\nThe fastest way to actually hear this rather than just know it on paper is to play all four from the same root back to back — C major, C minor, C diminished, C augmented — so the only thing changing between them is that middle note (E vs Eb) and the top note (G vs Gb vs G#). Once your ear locks onto exactly what moves, you'll be able to tell triad quality apart by ear alone, which is the actual goal — the note-stacking math is just how you get there.",
              longDescriptionUk:
                "Тризвук — це основний тон плюс ще дві ноти, накладені одна на одну терціями — нічого екзотичнішого. Існує лише два розміри терції: велика терція (4 півтони) і мала терція (3 півтони), і саме те, яка з них знизу, а яка зверху, і є всією різницею між чотирма типами тризвуків. Мажорний = велика терція, потім мала терція зверху (C-E-G). Мінорний = мала терція, потім велика терція (C-Eb-G). Зменшений = мала терція, потім ще одна мала терція (C-Eb-Gb) — обидва інтервали стискаються, тому й звучить напружено/нестабільно. Збільшений = велика терція, потім ще одна велика терція (C-E-G#) — обидва інтервали розтягуються, надаючи того нерозв'язаного, «підвішеного» відчуття.\n\nНайшвидший спосіб дійсно почути це, а не просто знати «на папері» — зіграти всі чотири підряд від одного основного тону: C мажор, C мінор, C зменшений, C збільшений — тоді єдине, що змінюється між ними, це середня нота (E чи Eb) та верхня нота (G, Gb чи G#). Щойно слух точно вловить, що саме рухається, ви зможете розрізняти якість тризвуку виключно на слух — а це і є справжня мета; математика накладання нот — лише шлях до неї.",
            },
            {
              title: "Diatonic chords in a key (I-ii-iii-IV-V-vi-vii°)",
              titleUk: "Діатонічні акорди в тональності (I-ii-iii-IV-V-vi-vii°)",
              description:
                "The 7 chords that naturally occur when you harmonize a major scale. Memorizing the quality pattern (major-minor-minor-major-major-minor-diminished) lets you predict the chords of any key without looking them up.",
              descriptionUk:
                "7 акордів, які природно виникають при гармонізації мажорної гами. Запам'ятавши патерн якості (мажор-мінор-мінор-мажор-мажор-мінор-зменшений), ви можете передбачити акорди будь-якої тональності, не звіряючись з довідником.",
              longDescription:
                "'Harmonizing the scale' means building a triad on top of every single degree of the major scale, using only notes that are already in that key — no borrowed or chromatic notes. Do this in C major and you get: C major (I), D minor (ii), E minor (iii), F major (IV), G major (V), A minor (vi), B diminished (vii°). Notice the quality pattern — major, minor, minor, major, major, minor, diminished — because it falls directly out of where the scale's two half-steps land (the same H's from the major-scale formula), and that pattern is identical in every major key, not just C.\n\nThat's what makes this genuinely useful rather than just a chart to memorize: once you know the key signature (which sharps/flats) and this fixed major-minor-minor-major-major-minor-diminished pattern, you can spell out all 7 chords of any major key from memory, with no lookup. Try it in G major (G-Am-Bm-C-D-Em-F#dim) or E major and you'll find the same shape of pattern, just transposed. This is also the direct foundation for the Nashville Number System right after it — those Roman numerals are literally labeling this same 7-chord pattern.",
              longDescriptionUk:
                "«Гармонізувати гаму» означає побудувати тризвук на кожному без винятку ступені мажорної гами, використовуючи лише ноти, що вже є в цій тональності — без запозичених чи хроматичних нот. Зробіть це в до мажорі — і отримаєте: C мажор (I), D мінор (ii), E мінор (iii), F мажор (IV), G мажор (V), A мінор (vi), B зменшений (vii°). Зверніть увагу на патерн якості — мажор, мінор, мінор, мажор, мажор, мінор, зменшений — він напряму випливає з того, де в гамі розташовані два півтони (ті самі «П» з формули мажорної гами), і цей патерн однаковий у кожній мажорній тональності, не лише в до мажорі.\n\nСаме це робить цю тему по-справжньому корисною, а не просто таблицею для завчання: знаючи ключові знаки (які дієзи/бемолі) та цей фіксований патерн мажор-мінор-мінор-мажор-мажор-мінор-зменшений, ви можете вивести всі 7 акордів будь-якої мажорної тональності з пам'яті, без довідника. Спробуйте в соль мажорі (G-Am-Bm-C-D-Em-F#dim) чи мі мажорі — і побачите той самий за формою патерн, лише транспонований. Це також безпосередня основа для Нашвільської числової системи одразу після цієї теми — ті римські цифри буквально позначають той самий патерн із 7 акордів.",
            },
            {
              title: "Nashville Number System",
              titleUk: "Нашвільська числова система",
              description:
                "Chords labeled by scale-degree number instead of letter name, so a I-IV-V progression is the same numbers in any key. The single most useful shortcut for transposing on the fly.",
              descriptionUk:
                "Акорди позначаються номером ступеня гами замість літерної назви, тож послідовність I-IV-V виглядає однаково в будь-якій тональності. Найкорисніший спосіб швидкого транспонування на льоту.",
              longDescription:
                "Instead of naming chords by letter (C, F, G), the Nashville Number System names them by their scale-degree position in the key (I, IV, V) — literally just numbering the diatonic chords from the previous topic. Because the quality pattern (major-minor-minor-major-major-minor-diminished) is fixed for every major key, 'I-IV-V' means exactly the same relationship in every key: in C it's C-F-G, in G it's G-C-D, in D it's D-G-A. The numbers describe the relationship between chords, not any specific pitch.\n\nThis is what makes the system so practical: a session musician handed a Nashville-numbered chart can play the same song in any key instantly, without re-learning a single 'new' progression — I-IV-V is I-IV-V whether the singer wants it in E or Bb. For you, the everyday use is recognizing that two songs which look totally different on paper (say, one in A and one in D) might be playing the identical progression, just transposed — spotting that is exactly the skill the Phase 2 'write out progressions in Roman numerals' applied exercise is meant to build.",
              longDescriptionUk:
                "Замість позначення акордів літерами (C, F, G), Нашвільська числова система позначає їх номером позиції ступеня в тональності (I, IV, V) — фактично просто нумеруючи діатонічні акорди з попередньої теми. Оскільки патерн якості (мажор-мінор-мінор-мажор-мажор-мінор-зменшений) фіксований для кожної мажорної тональності, «I-IV-V» означає точно те саме співвідношення в будь-якій тональності: у C це C-F-G, у G це G-C-D, у D це D-G-A. Цифри описують співвідношення між акордами, а не конкретну висоту звуку.\n\nСаме це робить систему настільки практичною: сесійний музикант, отримавши чарт із нашвільськими цифрами, може миттєво зіграти ту саму пісню в будь-якій тональності, не вивчаючи наново жодної «нової» послідовності — I-IV-V залишається I-IV-V, хоче співак заспівати це в мі чи сі-бемолі. Для вас щоденна користь — це вміння розпізнати, що дві пісні, які на папері виглядають абсолютно по-різному (скажімо, одна в ля, інша в ре), можуть насправді грати ідентичну послідовність, лише транспоновану — саме цю навичку й розвиває практична вправа Етапу 2 «запишіть послідовності римськими цифрами».",
            },
            {
              title: "7th chords (maj7, min7, dom7, m7b5)",
              titleUk: "Септакорди (maj7, min7, dom7, m7b5)",
              description:
                "Adding a 4th note (the 7th) on top of a triad. Dom7 defines the V chord's 'pull' back to the I chord — foundational to functional harmony.",
              descriptionUk:
                "Додавання 4-ї ноти (септими) поверх тризвуку. Домінантсептакорд визначає «тяжіння» акорду V назад до акорду I — основа функціональної гармонії.",
              longDescription:
                "A 7th chord is a triad with one more 3rd stacked on top, adding the scale's 7th-degree-equivalent note above the root. Depending on which triad you start from and how far that added note sits from the root, you get four common flavors: maj7 (major triad + a note a major 7th above the root — spacious, dreamy), min7 (minor triad + a minor 7th — smooth, mellow), dom7 (major triad + a minor 7th — the odd one out, and the important one below), and m7b5/half-diminished (diminished triad + a minor 7th — used almost exclusively on the vii° chord).\n\nHarmonizing a full major scale in 7th chords instead of triads gives I=maj7, ii=min7, iii=min7, IV=maj7, V=dom7, vi=min7, vii°=m7b5 — so the dominant 7th only ever occurs naturally on the V chord in a given key. That's significant because a dom7 chord contains a tritone (the interval between its 3rd and its b7), and a tritone is intrinsically unstable — your ear wants it to resolve. Resolving a V7 chord to the I chord (G7 to C, for example) satisfies that tension, and that specific pull is the engine behind an enormous amount of functional harmony, including the secondary dominants you'll meet in Phase 4.",
              longDescriptionUk:
                "Септакорд — це тризвук із ще однією терцією зверху, що додає ноту, еквівалентну 7-му ступеню гами, над основним тоном. Залежно від того, з якого тризвуку ви починаєте і як далеко додана нота лежить від основного тону, отримуєте чотири поширені варіанти: maj7 (мажорний тризвук + нота на велику септиму вище основного тону — просторе, мрійливе звучання), min7 (мінорний тризвук + мала септима — м'яке, оксамитове звучання), dom7 (мажорний тризвук + мала септима — «біла ворона» серед них, і найважливіша, про яку далі), та m7b5/напівзменшений (зменшений тризвук + мала септима — використовується майже виключно на акорді vii°).\n\nГармонізація повної мажорної гами септакордами замість тризвуків дає I=maj7, ii=min7, iii=min7, IV=maj7, V=dom7, vi=min7, vii°=m7b5 — тож домінантсептакорд природно виникає лише на акорді V у певній тональності. Це важливо, бо акорд dom7 містить тритон (інтервал між його терцією та малою септимою), а тритон за своєю природою нестабільний — слух хоче, щоб він розв'язався. Розв'язання акорду V7 в акорд I (наприклад, G7 у C) знімає цю напругу, і саме це тяжіння є двигуном величезної частини функціональної гармонії, включно з побічними домінантами, з якими ви зустрінетесь в Етапі 4.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Harmonize the major scale up the neck",
              titleUk: "Гармонізуйте мажорну гаму вздовж грифа",
              description:
                "In one key, play every diatonic chord (I through vii°) using the same CAGED-based movable shapes from Phase 1, so harmony and the fretboard map you already built connect directly.",
              descriptionUk:
                "В одній тональності зіграйте кожен діатонічний акорд (від I до vii°), використовуючи ті самі рухомі форми на основі CAGED з Етапу 1, щоб гармонія та карта грифа, яку ви вже побудували, напряму поєдналися.",
            },
            {
              title:
                "Write out chord progressions in Roman numerals from songs you already play",
              titleUk: "Запишіть акордові послідовності римськими цифрами з пісень, які ви вже граєте",
              description:
                "Take 3-5 songs you know, figure out the chords, and convert them to numbers relative to their key. You'll quickly see the same 4-5 progressions repeating across unrelated songs.",
              descriptionUk:
                "Візьміть 3-5 знайомих пісень, визначте акорди й переведіть їх у цифри відносно тональності. Ви швидко побачите, що ті самі 4-5 послідовностей повторюються в геть різних піснях.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Major vs. minor vs. dominant 7th by ear",
              titleUk: "Мажор проти мінору проти домінантсептакорду на слух",
              description:
                "Play each quality on the same root, back to back, and name them without looking. The dominant 7th's tension against a resolving I chord is usually the easiest to latch onto first.",
              descriptionUk:
                "Зіграйте кожну якість від одного основного тону підряд і називайте їх, не дивлячись. Напругу домінантсептакорду відносно акорду I, у який він розв'язується, зазвичай найлегше вловити першою.",
            },
            {
              title: "Chord progression dictation (I-IV-V-based)",
              titleUk: "Диктант акордових послідовностей (на основі I-IV-V)",
              description:
                "Listen to simple progressions and try to identify the sequence by number before checking. Start with well-known song progressions you can verify against.",
              descriptionUk:
                "Слухайте прості послідовності й намагайтеся визначити їх цифрами, перш ніж перевірити. Починайте з відомих послідовностей із пісень, які можна звірити.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 3,
      title: "Improvisation and Modes",
      titleUk: "Імпровізація та лади",
      goal: 'Move from "knowing scales" to using them expressively.',
      goalUk: "Перейти від «знання гам» до виразного їх використання.",
      durationLabel: "Months 7-9",
      milestone:
        'Soloing over a 12-bar blues with 2 scale/mode choices "with intention" means you can explain, in the moment or afterward, why you switched scales where you did — the goal is deliberate choice, not just having more options memorized.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Legato (hammer-ons/pull-offs)",
              titleUk: "Легато (hammer-on/pull-off)",
              description:
                "Focus on volume consistency — a hammered or pulled note should sound as loud as a picked one, which requires real finger force, not just contact. Practice on a single string first before adding position shifts.",
              descriptionUk:
                "Зосередьтеся на рівності гучності — нота, зіграна hammer-on чи pull-off, має звучати так само голосно, як і взята медіатором, а це вимагає реальної сили пальця, а не просто дотику. Спочатку тренуйтесь на одній струні, перш ніж додавати зміни позиції.",
            },
            {
              title: "Bending intonation",
              titleUk: "Інтонація бендів",
              description:
                "Bend to a target pitch and check it against that same pitch played normally (e.g., bend the 7th fret up to match the 9th fret's pitch). Most bending problems are pitch accuracy problems, not technique problems.",
              descriptionUk:
                "Тягніть бенд до цільової висоти звуку й звіряйте її зі звучанням цієї ж висоти, зіграної звичайно (наприклад, підтягніть 7-й лад до висоти 9-го лада). Більшість проблем із бендами — це проблеми точності висоти звуку, а не техніки.",
            },
            {
              title: "String skipping",
              titleUk: "Пропуск струн",
              description:
                "Practice picking patterns that skip over adjacent strings deliberately, since this is what most pentatonic/blues lead lines actually require.",
              descriptionUk:
                "Тренуйте патерни удару, що свідомо пропускають сусідні струни, адже саме це насправді потрібно для більшості соло-ліній у пентатоніці/блюзі.",
            },
            {
              title: "Sweep picking (optional)",
              titleUk: "Sweep picking (опційно)",
              description:
                "Only pick this up if you're aiming toward faster arpeggiated lead lines — a specialized technique, not a core requirement for the theory goals of this plan.",
              descriptionUk:
                "Беріться за це лише якщо прагнете швидших арпеджованих соло-ліній — це спеціалізована техніка, не обов'язкова для теоретичних цілей цього плану.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "The 7 modes as reharmonizations of the major scale",
              titleUk: "7 ладів як переосмислення мажорної гами",
              description:
                "Each mode uses the exact same notes as a major scale, just starting from a different degree — Dorian is 'the major scale starting on its 2nd note,' etc. Far faster than memorizing 7 new interval formulas from scratch.",
              descriptionUk:
                "Кожен лад використовує точно ті самі ноти, що й мажорна гама, лише починаючи з іншого ступеня — дорійський лад це «мажорна гама, що починається з її 2-ї ноти» і так далі. Це набагато швидше, ніж завчати 7 нових формул інтервалів з нуля.",
              longDescription:
                "You already met this idea informally with relative minor: the same 7 notes can be re-centered around a different root and the pattern of whole/half steps relative to that new root changes, which changes the character of the scale. Modes formalize this into all 7 possible re-centerings of a major scale, each with its own name and personality:\n\nIonian (start on degree 1) is just the major scale itself — bright, resolved. Dorian (degree 2) is minor-flavored but with a raised 6th, giving it a slightly lifted, jazzy/folky quality compared to plain minor. Phrygian (degree 3) is minor with a lowered 2nd, giving it a dark, Spanish/flamenco flavor. Lydian (degree 4) is major with a raised 4th, giving it a bright, dreamy, almost floating quality. Mixolydian (degree 5) is major with a lowered 7th, giving it a bluesy, rock-and-roll pull instead of a strong resolution. Aeolian (degree 6) is natural minor — this is the relative minor you already know. Locrian (degree 7) has a lowered 2nd and 5th, making it feel unstable and is rarely used as a true tonal center.\n\nThe practical shortcut: take a major scale you already know (say C major) and think of D Dorian as 'the same 7 notes, just treating D as home' — no new fingerings or interval formulas to learn from scratch, only a new note to resolve toward.",
              longDescriptionUk:
                "Ви вже неформально стикалися з цією ідеєю через паралельний мінор: ті самі 7 нот можна «перецентрувати» навколо іншого основного тону, і патерн тонів/півтонів відносно цього нового тону змінюється, а разом з ним змінюється й характер гами. Лади формалізують усі 7 можливих «перецентрувань» мажорної гами, кожне зі своєю назвою та характером:\n\nІонійський (починається з 1-го ступеня) — це просто сама мажорна гама: яскрава, розв'язана. Дорійський (2-й ступінь) має мінорний присмак, але з підвищеною 6-ю ступінню, що надає йому трохи піднесеного, джазово-фолкового характеру порівняно зі звичайним мінором. Фригійський (3-й ступінь) — мінорний зі зниженою 2-ю ступінню, що надає темного, іспансько-фламенкового відтінку. Лідійський (4-й ступінь) — мажорний із підвищеною 4-ю ступінню, що надає яскравого, мрійливого, майже «підвішеного» характеру. Міксолідійський (5-й ступінь) — мажорний зі зниженою 7-ю ступінню, що надає блюзового, рок-н-рольного тяжіння замість сильного розв'язання. Еолійський (6-й ступінь) — натуральний мінор, це той самий паралельний мінор, який ви вже знаєте. Локрійський (7-й ступінь) має знижені 2-гу та 5-ту ступені, через що звучить нестабільно і рідко використовується як справжній тональний центр.\n\nПрактичний спосіб: візьміть уже знайому мажорну гаму (скажімо, до мажор) і сприймайте ре дорійський як «ті самі 7 нот, просто D тепер є домом» — жодних нових аплікатур чи формул інтервалів учити з нуля, лише нова нота, до якої тепер тяжіє розв'язання.",
            },
            {
              title: "Pentatonic and blues scale relationships to modes",
              titleUk: "Зв'язок пентатоніки та блюзової гами з ладами",
              description:
                "The minor pentatonic scale is a stripped-down 5-note version of Aeolian/Dorian; the blues scale adds one chromatic 'blue note' on top of that.",
              descriptionUk:
                "Мінорна пентатоніка — це спрощена 5-нотна версія еолійського/дорійського ладів; блюзова гама додає до неї ще одну хроматичну «блюзову ноту».",
              longDescription:
                "The minor pentatonic scale is Aeolian (natural minor) with its 2nd and 6th degrees removed, leaving just 5 notes — in A minor pentatonic: A, C, D, E, G (compare to full A Aeolian: A, B, C, D, E, F, G). Those two removed notes are the ones most likely to sit a half-step away from a chord tone and create a clash against a simple minor-key backing, so pulling them out leaves a scale that's very hard to make sound 'wrong' — which is exactly why it's the first improvising scale most guitarists reach for.\n\nThe blues scale takes that same 5-note minor pentatonic and adds one more note back in: a b5 (a flatted 5th) sitting right between the 4th and 5th degrees — in A blues: A, C, D, Eb, E, G. That single chromatic addition is the 'blue note,' and it's deliberately the most dissonant note available against the underlying chord, used as a passing tone or a bent target rather than something you land on and hold.\n\nOnce you can hear how thin the minor pentatonic sounds compared to the fuller Dorian or Aeolian it's drawn from, adding scale tones back in (the 2nd, the 6th, or the blues b5) is how you get from 'safe pentatonic licks' to lines that sound genuinely modal — which is the whole bridge this topic is building toward.",
              longDescriptionUk:
                "Мінорна пентатоніка — це еолійський лад (натуральний мінор) без 2-ї та 6-ї ступенів, тобто лишається лише 5 нот — у ля мінорній пентатоніці: A, C, D, E, G (порівняйте з повним ля еолійським: A, B, C, D, E, F, G). Саме ці дві вилучені ноти найімовірніше опиняться за півтон від тону акорду й створять дисонанс проти простого мінорного акомпанементу, тож їх вилучення залишає гаму, яку дуже важко змусити звучати «неправильно» — саме тому це перша імпровізаційна гама, до якої тягнеться більшість гітаристів.\n\nБлюзова гама бере ту саму 5-нотну мінорну пентатоніку й додає до неї ще одну ноту: пониженою квінтою (b5), що лежить точно між 4-ю та 5-ю ступенями — у ля блюзовій: A, C, D, Eb, E, G. Ця єдина хроматична добавка і є «блюзовою нотою», і вона свідомо є найдисонантнішою нотою відносно акорду, що звучить, — використовується як прохідний тон або ціль для бенду, а не нота, на якій зупиняються й тримають.\n\nЩойно ви зможете почути, наскільки «тонше» звучить мінорна пентатоніка порівняно з повнішими дорійським чи еолійським ладами, з яких вона походить, повернення нот гами назад (2-ї, 6-ї ступені чи блюзової b5) і є способом перейти від «безпечних пентатонічних ліків» до фраз, що звучать по-справжньому ладово — саме до цього містка й веде ця тема.",
            },
            {
              title: "Chord-scale relationships",
              titleUk: "Відповідність гами й акорду",
              description:
                "For a given chord, certain scales/modes 'fit' because they share the chord's essential notes. Over a major chord, Ionian or Lydian fit; over a minor chord, Aeolian or Dorian fit.",
              descriptionUk:
                "Для певного акорду деякі гами/лади «підходять», бо мають спільні з акордом ключові ноти. Над мажорним акордом підходять іонійський чи лідійський; над мінорним — еолійський чи дорійський.",
              longDescription:
                "A scale 'fits' a chord when it contains that chord's essential notes — root, 3rd, and 5th at minimum, ideally the 7th too if the chord has one — since those are the tones that actually define the chord's identity underneath a solo line. Over a plain major or maj7 chord, both Ionian and Lydian fit, because both contain a major 3rd and a major/perfect combination that outlines the chord; Lydian just adds a brighter, raised-4th color on top. Over a minor or min7 chord, Aeolian and Dorian both fit for the mirror reason, with Dorian's raised 6th giving a slightly more open sound than Aeolian's straight natural minor.\n\nA practical worked example is a ii-V-I in C major (Dm7 - G7 - Cmaj7): over the Dm7 you'd reach for D Dorian, over the G7 you'd reach for G Mixolydian (major-family with a lowered 7th, matching the dominant chord's own b7), and over the Cmaj7 you'd land back on C Ionian or C Lydian. Notice all three of those scale choices are actually built from the exact same 7 notes (C major) — the 'chord-scale' choice here isn't about switching note pools, it's about which note within that shared pool you're treating as home and emphasizing as you pass over each chord, which is precisely the 'targeting chord tones' skill the Applied section below is built to drill.",
              longDescriptionUk:
                "Гама «підходить» акорду, коли містить його ключові ноти — щонайменше основний тон, терцію й квінту, а в ідеалі й септиму, якщо вона є в акорді — адже саме ці тони визначають «обличчя» акорду під соло-лінією. Над простим мажорним чи maj7 акордом підходять і іонійський, і лідійський, бо обидва містять велику терцію та мажорну/чисту комбінацію, що окреслює акорд; лідійський просто додає яскравіший відтінок за рахунок підвищеної 4-ї ступені. Над мінорним чи min7 акордом з тієї ж причини підходять і еолійський, і дорійський, причому підвищена 6-та ступінь дорійського дає трохи відкритіше звучання, ніж прямий натуральний мінор еолійського.\n\nПрактичний приклад — послідовність ii-V-I в до мажорі (Dm7 - G7 - Cmaj7): над Dm7 ви берете D дорійський, над G7 — G міксолідійський (з «мажорної родини» зі зниженою 7-ю ступінню, що відповідає власній b7 домінантового акорду), а над Cmaj7 повертаєтесь до C іонійського чи C лідійського. Зверніть увагу: усі три обрані гами насправді побудовані на тих самих 7 нотах (до мажор) — вибір «гами під акорд» тут не про зміну набору нот, а про те, яку ноту в межах цього спільного набору ви вважаєте «домом» і підкреслюєте, проходячи над кожним акордом — а це точно та сама навичка «прицілювання на тони акорду», яку й тренує розділ «Застосування» нижче.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Improvise over a static I chord using the matching mode",
              titleUk: "Імпровізуйте над статичним акордом I, використовуючи відповідний лад",
              description:
                "Loop a single chord (backing track or looper pedal) and improvise using only the matching mode, focusing on landing on the chord tones (1, 3, 5) on strong beats.",
              descriptionUk:
                "Зациклюйте один акорд (бек-трек чи луп-педаль) та імпровізуйте, використовуючи лише відповідний лад, зосереджуючись на потраплянні в тони акорду (1, 3, 5) на сильні долі.",
            },
            {
              title: "Improvise over a ii-V-I progression, targeting chord tones",
              titleUk: "Імпровізуйте над послідовністю ii-V-I, прицілюючись на тони акордів",
              description:
                "Deliberately aim for a chord tone of whichever chord is currently sounding, right as the chord changes, rather than running a scale on autopilot through the whole progression.",
              descriptionUk:
                "Свідомо цільтесь у тон акорду, що звучить у певний момент, саме в момент зміни акорду, замість того щоб «на автопілоті» пробігати гамою через усю послідовність.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Distinguish major-family vs. minor-family modes by ear",
              titleUk: "Розрізняйте на слух лади «мажорної» та «мінорної» родини",
              description:
                "Train the broader 'does this sound major-ish or minor-ish' distinction reliably and quickly first, before identifying exact modes.",
              descriptionUk:
                "Спершу тренуйте ширшу здатність швидко й надійно відчувати, «це звучить більш по-мажорному чи по-мінорному», перш ніж визначати конкретний лад.",
            },
            {
              title: "Weekly short melodic transcription",
              titleUk: "Щотижнева коротка мелодична транскрипція",
              description:
                "Pick a short phrase (4-8 notes) from a song, figure it out by ear on the guitar, and check yourself against the recording. Keep phrases short and frequent rather than occasional long transcriptions.",
              descriptionUk:
                "Оберіть коротку фразу (4-8 нот) з пісні, підберіть її на слух на гітарі й звірте себе із записом. Обирайте короткі й часті фрази замість рідкісних довгих транскрипцій.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 4,
      title: "Advanced Harmony and Personal Style",
      titleUk: "Просунута гармонія та особистий стиль",
      goal: "Consolidate everything into your own musical vocabulary.",
      goalUk: "Об'єднати все у власний музичний словник.",
      durationLabel: "Months 10-12",
      milestone:
        'An original composition or arrangement "deliberately applying at least 3 concepts" means you should be able to point to specific measures and name the concept in use — the point is conscious application, proving the theory has become usable rather than just understood abstractly.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Advanced fingerstyle or hybrid picking",
              titleUk: "Просунутий fingerstyle або гібридна техніка гри",
              description:
                "Pick a direction based on genuine interest rather than defaulting — fingerstyle suits solo arranging, hybrid picking (pick + fingers) suits country/lead-heavy playing. Depth in one beats a shallow pass at both.",
              descriptionUk:
                "Обирайте напрям на основі щирого інтересу, а не за замовчуванням — fingerstyle пасує для сольних аранжувань, гібридна техніка (медіатор + пальці) пасує для кантрі та соло-орієнтованої гри. Глибина в одному напрямку краща за поверхневе знайомство з обома.",
            },
            {
              title: "Dynamics and touch control",
              titleUk: "Динаміка та контроль дотику",
              description:
                "Practice playing the identical phrase at 3 distinct volume levels without changing the notes or tempo, isolating touch as its own controllable variable.",
              descriptionUk:
                "Тренуйтесь грати одну й ту саму фразу на 3 різних рівнях гучності, не змінюючи ноти чи темп, виокремлюючи дотик як самостійну керовану змінну.",
            },
            {
              title: "Efficient position shifting",
              titleUk: "Ефективна зміна позицій",
              description:
                "When a lead line requires moving up the neck, practice shifting during a sustained or held note rather than during a rhythmically active moment, so the shift becomes inaudible.",
              descriptionUk:
                "Коли соло-лінія вимагає переміщення вгору по грифу, тренуйтесь робити зсув під час витриманої чи задержаної ноти, а не в ритмічно активний момент, щоб зсув став нечутним.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Secondary dominants",
              titleUk: "Побічні домінанти",
              description:
                "A dominant 7th chord borrowed to resolve into a chord other than the I (e.g., a 'V of V'), used to add a temporary pull toward a chord that isn't the main key center.",
              descriptionUk:
                "Домінантсептакорд, запозичений для розв'язання в акорд, відмінний від I (наприклад, «V від V»), що використовується для додавання тимчасового тяжіння до акорду, який не є головним тональним центром.",
              longDescription:
                "You already know that a dom7 chord's tritone creates a strong pull toward whatever chord sits a 5th below it — normally that's V7 resolving to I. A secondary dominant borrows that exact same trick to resolve into a chord other than the I. The notation 'V/V' (read 'five of five') means: build a dominant 7th on the 5th degree of whatever chord you're about to briefly treat as a temporary key center — in this case, the V chord itself.\n\nConcretely, in C major the V chord is G. The V of G (i.e. V/V relative to the home key of C) is D7 — a chord that isn't naturally diatonic to C major at all, since diatonic C major would give you a plain D minor there, not D7. Raising that F to F# to make it D7 borrows a leading tone that pulls hard into G, giving you a much stronger push toward the V chord than the plain diatonic Dm-to-G motion would.\n\nThe reason this works is the same tritone-resolution logic from 7th chords, just retargeted: any major or minor chord in your progression can be temporarily treated as a mini 'I,' and building a dominant 7th a 5th above it borrows a leading tone that doesn't belong to your main key, creating exactly the kind of 'surprise but still makes sense' chord that shows up constantly in otherwise simple progressions.",
              longDescriptionUk:
                "Ви вже знаєте, що тритон акорду dom7 створює сильне тяжіння до акорду, розташованого на квінту нижче — зазвичай це V7, що розв'язується в I. Побічна домінанта запозичує той самий трюк, щоб розв'язатися в акорд, відмінний від I. Позначення «V/V» (читається «п'ять від п'яти») означає: побудуйте домінантсептакорд на 5-му ступені того акорду, який ви на мить трактуєте як тимчасовий тональний центр — у цьому випадку самого акорду V.\n\nКонкретно: у до мажорі акорд V — це G. V від G (тобто V/V відносно домашньої тональності C) — це D7, акорд, який зовсім не є природно діатонічним для до мажору, адже діатонічно там мав би бути звичайний D мінор, а не D7. Підвищення тієї F до F#, щоб отримати D7, запозичує вступний тон, який сильно тягне до G, надаючи значно потужнішого поштовху до акорду V, ніж звичайний діатонічний рух Dm-до-G.\n\nПричина, чому це працює — та сама логіка розв'язання тритону з септакордів, лише перенацілена: будь-який мажорний чи мінорний акорд у вашій послідовності можна тимчасово трактувати як міні-«I», і побудова домінантсептакорду на квінту вище нього запозичує вступний тон, що не належить вашій головній тональності, створюючи саме той тип акорду «несподівано, але логічно», який постійно трапляється в інакше простих послідовностях.",
            },
            {
              title: "Borrowed chords",
              titleUk: "Запозичені акорди",
              description:
                "Chords pulled from the parallel minor or major key (e.g., a minor iv chord in an otherwise major-key song) for color, without fully changing key.",
              descriptionUk:
                "Акорди, взяті з однойменної мінорної чи мажорної тональності (наприклад, мінорний акорд iv у пісні, що загалом у мажорі) заради колориту, без повної зміни тональності.",
              longDescription:
                "'Parallel' keys share the same root but differ in mode — C major and C minor are parallel keys (different note sets, same starting note), as opposed to relative keys like C major and A minor (same note set, different starting note). A borrowed chord takes a chord from the parallel key and drops it into an otherwise diatonic progression for color, without actually changing the song's key center.\n\nThe most common example: in a major-key song, borrowing the iv chord from the parallel minor. In C major the diatonic iv-equivalent would be F major (IV), but C minor's iv chord is F minor — borrowing that Fm into a C major song (often right before resolving back to C) gives a moment of unexpected darkness that resolves warmly once the major I returns. Other frequently borrowed chords include bVII (Bb in the key of C, borrowed from C minor) and bVI (Ab in the key of C), both common in rock and pop for a similar 'lifted from somewhere else, but it works' effect.\n\nThe ear test for whether something is a borrowed chord versus a full key change is whether the music snaps back to the original key's diatonic chords right after — a borrowed chord is a brief visit, not a relocation.",
              longDescriptionUk:
                "«Однойменні» тональності мають спільний основний тон, але різний лад — до мажор і до мінор є однойменними тональностями (різні набори нот, той самий основний тон), на відміну від паралельних тональностей на кшталт до мажору й ля мінору (той самий набір нот, різний основний тон). Запозичений акорд бере акорд з однойменної тональності й додає його до інакше діатонічної послідовності заради колориту, фактично не змінюючи тональний центр пісні.\n\nНайпоширеніший приклад: у пісні в мажорі запозичити акорд iv з однойменного мінору. У до мажорі діатонічним еквівалентом iv був би F мажор (IV), але акорд iv до мінору — це F мінор — запозичення цього Fm у пісню в до мажорі (часто прямо перед поверненням до C) дає момент несподіваної темряви, що тепло розв'язується з поверненням мажорного I. Інші часто запозичені акорди — bVII (Bb у тональності C, запозичений з до мінору) та bVI (Ab у тональності C), обидва поширені в року й попі заради подібного ефекту «взято звідкись іще, але це працює».\n\nПеревірка на слух, чи є щось запозиченим акордом, а не повною зміною тональності — це чи повертається музика одразу після цього до діатонічних акордів початкової тональності: запозичений акорд — це короткий візит, а не переїзд.",
            },
            {
              title: "Extended chords (9ths, 11ths, 13ths)",
              titleUk: "Розширені акорди (9, 11, 13)",
              description:
                "These stack additional 3rds beyond the 7th chord. Learn practical, playable guitar voicings rather than full theoretical stacks — knowing which notes are safe to drop matters as much as the theory.",
              descriptionUk:
                "Ці акорди накладають додаткові терції поверх септакорду. Вчіть практичні, придатні для гри на гітарі аплікатури, а не повні теоретичні «вежі» з нот — знання, які ноти можна безпечно прибрати, важливе так само, як і сама теорія.",
              longDescription:
                "Keep stacking 3rds past the 7th chord and you get extensions: one more 3rd above the 7th gives you a 9th, another gives an 11th, another gives a 13th — in C: C-E-G-Bb-D(9)-F(11)-A(13). In full theoretical form a 13th chord contains 7 different notes, which is already more notes than a standard 6-string guitar chord voicing can realistically hold while still sounding clear.\n\nIn practice, guitarists drop notes that are least essential to the chord's identity and keep the ones that are — usually keeping the root, the 3rd (defines major/minor), the 7th (defines the chord's basic color/function), and the specific extension being named, while dropping the 5th (rarely essential) and any extension degrees not explicitly named. A practical 9th chord voicing, for instance, is often just root-3rd-7th-9th with the 5th and any theoretical-but-unplayed lower extensions omitted entirely — it still reads clearly as '9th chord' to the ear because the notes that matter are all present.\n\nThe skill worth building here isn't memorizing every possible extended-chord shape; it's learning to look at any extended chord and immediately identify which 3-4 notes are load-bearing for its sound, since that judgment is what lets you build a usable voicing for a chord you've never specifically learned a shape for.",
              longDescriptionUk:
                "Продовжуйте накладати терції понад септакорд — і отримаєте розширення: ще одна терція над септимою дає нону (9), ще одна — ундециму (11), ще одна — терцдециму (13) — у C: C-E-G-Bb-D(9)-F(11)-A(13). У повній теоретичній формі акорд 13 містить 7 різних нот, а це вже більше нот, ніж стандартна аплікатура акорду на 6-струнній гітарі реально може вмістити, зберігаючи чітке звучання.\n\nНа практиці гітаристи прибирають ноти, найменш важливі для «обличчя» акорду, і залишають найважливіші — зазвичай зберігають основний тон, терцію (визначає мажор/мінор), септиму (визначає базовий колорит/функцію акорду) та саме ту вказану ступінь розширення, прибираючи квінту (рідко важлива) та будь-які теоретичні, але незіграні нижчі розширення. Практична аплікатура акорду 9, наприклад, часто складається лише з основного тону-терції-септими-нони, з повністю пропущеною квінтою та теоретичними нижчими розширеннями — слух все одно чітко зчитує це як «акорд 9», бо всі важливі ноти присутні.\n\nНавичка, яку варто розвивати тут — не завчання кожної можливої форми розширеного акорду, а вміння, глянувши на будь-який розширений акорд, одразу визначити, які 3-4 ноти є «несучими» для його звучання, адже саме це судження дозволяє побудувати придатну аплікатуру для акорду, форму якого ви ніколи спеціально не вчили.",
            },
            {
              title: "Basic voice leading",
              titleUk: "Основи голосоведення",
              description:
                "Choosing chord voicings so that individual notes move the shortest possible distance between chords, rather than jumping between disconnected shapes.",
              descriptionUk:
                "Вибір аплікатур акордів так, щоб окремі ноти рухалися найкоротшою можливою відстанню між акордами, замість стрибків між непов'язаними формами.",
              longDescription:
                "Most guitarists learn chords as whole shapes and move between them by picking up the entire shape and setting it down somewhere else — which works, but often means every note jumps a large, audible distance even when the underlying harmony is only changing a little. Voice leading is the practice of choosing (or altering) a chord voicing so that its individual notes move as little as possible into the next chord, rather than moving the whole shape uniformly.\n\nA simple example: moving from C major (C-E-G) to A minor (A-C-E) shares two notes outright (C and E) — a voice-led transition keeps those shared notes in the same physical spot and only moves the note that actually needs to change (G to A), rather than re-fretting the whole chord as a fresh shape. Extend that thinking across a full progression and the individual notes trace short, smooth paths from chord to chord instead of a series of unrelated jumps.\n\nThis is the difference between a progression that's technically correct on paper but sounds a bit clunky, versus one that sounds connected and intentional — and it's also the practical foundation for reharmonization right after this, since smoothly voice-leading a substitute chord into a progression is what keeps a bold harmonic substitution from sounding jarring.",
              longDescriptionUk:
                "Більшість гітаристів вивчають акорди як цілісні форми й переходять між ними, «піднімаючи» всю форму й опускаючи її десь-інде — це працює, але часто означає, що кожна нота стрибає на велику, чутну відстань, навіть коли гармонія під нею змінюється зовсім трохи. Голосоведення — це практика вибору (чи зміни) аплікатури акорду так, щоб окремі ноти рухались до наступного акорду якомога менше, замість рівномірного переміщення всієї форми.\n\nПростий приклад: перехід від C мажор (C-E-G) до A мінор (A-C-E) має дві спільні ноти (C та E) — перехід із голосоведенням залишає ці спільні ноти на тому самому фізичному місці й рухає лише ту ноту, яка дійсно має змінитись (G на A), замість перебудови всього акорду як нової форми. Поширіть це мислення на цілу послідовність — і окремі ноти прокладають короткі, плавні шляхи від акорду до акорду замість серії непов'язаних стрибків.\n\nЦе і є різниця між послідовністю, яка технічно правильна на папері, але звучить трохи незграбно, і тією, що звучить зв'язно й свідомо — а також практична основа для реармонізації одразу після цього, адже саме плавне «вплетення» замінного акорду через голосоведення не дає сміливій гармонічній заміні звучати різко.",
            },
            {
              title: "Intro to reharmonization",
              titleUk: "Вступ до реармонізації",
              description:
                "Taking an existing melody and supporting it with a different (but still compatible) set of chords underneath, using secondary dominants/borrowed chords/extensions as your toolkit.",
              descriptionUk:
                "Взяти наявну мелодію й підтримати її іншим (але все ще сумісним) набором акордів знизу, використовуючи побічні домінанти/запозичені акорди/розширення як інструментарій.",
              longDescription:
                "Reharmonization means keeping an existing melody exactly as it is, but changing the chords supporting it underneath to something that still fits the melody notes but creates a different mood or color. It's the point where secondary dominants, borrowed chords, extended chords, and voice leading — everything else in this phase — stop being separate topics and become one combined toolkit.\n\nA simple worked example: take a plain I-IV-V-I progression in C (C-F-G-C). A first reharmonization might replace the plain V with a secondary-dominant-preceded version, inserting a V/V (D7) before the G to sharpen the pull into it: C-F-D7-G-C. A second pass might borrow the minor iv (Fm) right before the final C for a darker color on the way home: C-Fm-G-C. In both cases the melody notes over each chord haven't necessarily changed — what changed is the harmonic support underneath, and specifically how much tension and color that support adds before resolving.\n\nThe practical exercise worth doing is exactly this: take a progression you already know cold from Phase 2's Roman-numeral work, and try substituting one chord at a time, listening for what shifts emotionally with each substitution rather than trying to overhaul the whole thing at once.",
              longDescriptionUk:
                "Реармонізація означає залишити наявну мелодію абсолютно незмінною, але змінити акорди, що її підтримують знизу, на такі, що все ще пасують до нот мелодії, але створюють інший настрій чи колорит. Це той момент, коли побічні домінанти, запозичені акорди, розширені акорди та голосоведення — все інше з цього етапу — перестають бути окремими темами й стають єдиним об'єднаним інструментарієм.\n\nПростий приклад: візьміть звичайну послідовність I-IV-V-I в C (C-F-G-C). Перша реармонізація може замінити простий V версією з побічною домінантою попереду, вставивши V/V (D7) перед G, щоб загострити тяжіння до нього: C-F-D7-G-C. Другий прохід може запозичити мінорний iv (Fm) прямо перед фінальним C заради темнішого колориту на шляху додому: C-Fm-G-C. В обох випадках ноти мелодії над кожним акордом не обов'язково змінилися — змінилася гармонічна підтримка знизу, а саме те, скільки напруги й колориту вона додає перед розв'язанням.\n\nПрактична вправа, яку варто зробити — саме це: візьміть послідовність, яку ви вже добре знаєте з роботи над римськими цифрами з Етапу 2, і спробуйте замінювати по одному акорду за раз, прислухаючись, що емоційно змінюється з кожною заміною, замість спроби переробити все одразу.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Reharmonize a familiar progression",
              titleUk: "Реармонізуйте знайому послідовність",
              description:
                "Take a simple progression you already know and substitute at least one borrowed chord or secondary dominant, then listen for what changed emotionally.",
              descriptionUk:
                "Візьміть просту, вже знайому послідовність і замініть принаймні один акорд на запозичений або побічну домінанту, потім прислухайтеся, що змінилося емоційно.",
            },
            {
              title: "Compose an 8-16 bar original piece",
              titleUk: "Створіть оригінальний твір на 8-16 тактів",
              description:
                "Deliberately require yourself to use at least one concept from each of the previous 3 phases so the composition functions as a real synthesis exercise, not just a free-write.",
              descriptionUk:
                "Свідомо вимагайте від себе використати принаймні одне поняття з кожного з попередніх 3 етапів, щоб твір слугував справжньою вправою на синтез, а не просто вільним написанням.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Full chord quality ID including extensions",
              titleUk: "Повне визначення якості акорду, включно з розширеннями",
              description:
                "Extend the Phase 2 ear-training drill to include 9ths and other extensions, since the 'flavor' they add is often more recognizable by ear than by looking at the notes on paper.",
              descriptionUk:
                "Розширте вправу з тренування слуху з Етапу 2, додавши нони та інші розширення, адже «присмак», який вони додають, часто легше впізнати на слух, ніж дивлячись на ноти на папері.",
            },
            {
              title: "Transcribe a full short passage (melody + chords)",
              titleUk: "Транскрибуйте повний короткий уривок (мелодія + акорди)",
              description:
                "A step up from Phase 3's melody-only transcription — now work out both the tune and what's harmonizing it underneath for a short section of a song.",
              descriptionUk:
                "Крок далі порівняно з транскрипцією лише мелодії з Етапу 3 — тепер розберіть і мелодію, і те, що її гармонізує знизу, для короткого фрагмента пісні.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Metronome always on",
              titleUk: "Метроном завжди увімкнений",
              description:
                "Track a specific tempo number per exercise over time (e.g., 'chromatic warm-up: 72 BPM → 96 BPM over 6 weeks') so progress is measurable instead of a vague feeling of 'getting better.'",
              descriptionUk:
                "Відстежуйте конкретний темп для кожної вправи з часом (наприклад, «хроматична розминка: 72 → 96 уд/хв за 6 тижнів»), щоб прогрес був вимірюваним, а не розмитим відчуттям «стає краще».",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Read back through a month of entries occasionally; patterns in what keeps showing up as 'struggle' tell you where to spend more deliberate time.",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Час від часу перечитуйте записи за місяць; патерни в тому, що постійно повторюється як «труднощі», підказують, де варто приділити більше свідомої уваги.",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay something from an earlier phase without warming up on it first. If it's shaky, that's useful information — it means the skill needs occasional maintenance reps, not that you failed to learn it.",
              descriptionUk:
                "Раз на кілька тижнів переграйте щось із попереднього етапу без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень, а не свідчення того, що ви її не вивчили.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Pair every theory concept with a real song",
              titleUk: "Пов'язуйте кожне теоретичне поняття з реальною піснею",
              description:
                "For every phase's theory concept, find or pick 1-2 actual songs/pieces that use it, so the abstract concept always has a concrete, motivating home rather than living only in exercises.",
              descriptionUk:
                "Для кожного теоретичного поняття з кожного етапу знайдіть чи оберіть 1-2 реальні пісні/твори, що його використовують, щоб абстрактне поняття завжди мало конкретний, мотивуючий дім, а не існувало лише у вправах.",
            },
          ],
        },
      ],
    },
  ],
};

const pianoPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "piano", name: "Piano", nameUk: "Фортепіано" },
  plan: {
    title: "Long-Term Piano Practice Plan",
    titleUk: "Довгостроковий план практики гри на фортепіано",
    description:
      "Intermediate-level, 12-month plan combining technique and theory, ~30-45 min/day.",
    descriptionUk:
      "12-місячний план середнього рівня, що поєднує техніку та теорію, ~30-45 хв/день.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Foundations of the Keyboard",
      titleUk: "Основи клавіатури",
      goal: "Build reliable hand independence and connect scale/chord shapes to the theory underneath them.",
      goalUk: "Розвинути надійну незалежність рук і пов'язати форми гам/акордів із теорією, що лежить в їх основі.",
      durationLabel: "Months 1-3",
      milestone:
        "Playing all 12 major scales hands together, 2 octaves, at a steady 60 BPM from memory means no glancing at the keys or hesitating at the thumb-crossings. Building any major, minor, diminished, or augmented triad instantly from any root means you can name and play it without counting semitones each time.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Finger independence exercises (Hanon-style)",
              titleUk: "Вправи на незалежність пальців (у стилі Ганона)",
              description:
                "Daily repetitive patterns that isolate each finger's strength and evenness, hands separately at first. Builds the raw finger control that every scale, chord, and passage later depends on.",
              descriptionUk:
                "Щоденні повторювані патерни, що виокремлюють силу й рівність кожного пальця, спочатку руки окремо. Розвиває базовий контроль пальців, від якого пізніше залежить кожна гама, акорд і пасаж.",
            },
            {
              title: "Scale fingering patterns",
              titleUk: "Аплікатура гам",
              description:
                "The standard thumb-crossing fingering (1-2-3, 1-2-3-4-5) that lets a scale run smoothly across the full keyboard instead of stopping to reposition the hand. Learn it hands separately before combining.",
              descriptionUk:
                "Стандартна аплікатура з підкладанням великого пальця (1-2-3, 1-2-3-4-5), яка дозволяє гамі плавно бігти по всій клавіатурі, не зупиняючись для перестановки руки. Вивчайте окремо для кожної руки, перш ніж поєднувати.",
            },
            {
              title: "Hands-together coordination at slow tempo",
              titleUk: "Координація рук разом у повільному темпі",
              description:
                "Once each hand is solid separately, bring them together at a tempo slow enough that nothing falls apart. Speed comes later — the goal here is that both hands land exactly together, every time.",
              descriptionUk:
                "Щойно кожна рука окремо звучить впевнено, зведіть їх разом у темпі, достатньо повільному, щоб нічого не «розсипалось». Швидкість прийде пізніше — мета тут у тому, щоб обидві руки потрапляли точно разом, щоразу.",
            },
            {
              title: "Hand position and wrist alignment",
              titleUk: "Положення рук і вирівнювання зап'ясть",
              description:
                "Relaxed, curved fingers and a level wrist (neither collapsed nor raised) let the fingers do the work instead of the forearm compensating for tension. Check this in a mirror or on video periodically.",
              descriptionUk:
                "Розслаблені, округлені пальці та рівне зап'ястя (не провалене й не підняте) дозволяють працювати саме пальцям, а не передпліччю, що компенсує напруження. Періодично перевіряйте це в дзеркалі чи на відео.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Major scale construction (W-W-H-W-W-W-H)",
              titleUk: "Побудова мажорної гами (Т-Т-П-Т-Т-Т-П)",
              description:
                "This interval formula is what defines 'major' in any key. On piano the black keys make the half-steps visible: build the scale from different starting notes and watch where a black key is skipped versus used.",
              descriptionUk:
                "Ця формула інтервалів визначає «мажор» у будь-якій тональності. На фортепіано чорні клавіші роблять півтони наочними: будуйте гаму від різних нот і спостерігайте, де чорна клавіша пропускається, а де використовується.",
              longDescription:
                "W-W-H-W-W-W-H is a recipe, not a fixed set of notes: W means move up 2 keys counting all black and white keys (a whole step), H means move up 1 key (a half step). Start on any note and apply the recipe and you get that note's major scale. From C — an all-white-key scale — the pattern lands you on D, E, F, G, A, B, C, with the two half-steps naturally falling at E-F and B-C, which is exactly why the piano has no black key between those pairs.\n\nFrom any other starting note, the same formula forces certain black keys into the picture: from D major, the formula requires F# and C# to preserve the same W-W-H-W-W-W-H spacing. This is the single most useful reason to learn scale construction on piano specifically — the keyboard makes the whole-step/half-step pattern visually obvious in a way that's harder to see on a fretboard, since you can literally watch which keys the formula skips.\n\nPractice this by building a few scales one hand at a time, saying 'whole' or 'half' out loud as you move between notes, before you ever look at written fingering. That's what turns 'I memorized this scale's notes' into 'I understand why these particular notes are the major scale from this root,' which is what lets you construct any of the 12 without a reference chart.",
              longDescriptionUk:
                "Т-Т-П-Т-Т-Т-П — це рецепт, а не фіксований набір нот: Т означає піднятися на 2 клавіші, рахуючи всі білі й чорні (цілий тон), П — піднятися на 1 клавішу (півтон). Візьміть будь-яку ноту, застосуйте рецепт — і отримаєте мажорну гаму від цієї ноти. Від C — гами лише на білих клавішах — патерн приводить до D, E, F, G, A, B, C, причому два півтони природно припадають на E-F та B-C, і саме тому між цими парами на фортепіано немає чорної клавіші.\n\nВід будь-якої іншої початкової ноти та сама формула вимагає залучення певних чорних клавіш: від ре мажору формула вимагає F# і C#, щоб зберегти той самий інтервал Т-Т-П-Т-Т-Т-П. Це найкорисніша причина вчити побудову гам саме на фортепіано — клавіатура робить патерн цілих і півтонів наочним так, як його важче побачити на грифі гітари, адже ви буквально бачите, які клавіші формула пропускає.\n\nТренуйте це, будуючи кілька гам однією рукою за раз, вголос називаючи «цілий» чи «половинний», рухаючись між нотами, перш ніж взагалі дивитись на записану аплікатуру. Саме це перетворює «я запам'ятав ноти цієї гами» на «я розумію, чому саме ці ноти складають мажорну гаму від цього основного тону» — а це і дозволяє побудувати будь-яку з 12 гам без довідкової таблиці.",
            },
            {
              title: "Key signatures for all 12 keys",
              titleUk: "Ключові знаки для всіх 12 тональностей",
              description:
                "Memorize which sharps or flats belong to each key, in the order they're added. Lets you sight-read a piece, name its key immediately, and predict which keys on the keyboard will sound 'in.'",
              descriptionUk:
                "Запам'ятайте, які дієзи чи бемолі належать кожній тональності, у порядку їх додавання. Це дозволяє читати твір з листа, миттєво називати тональність і передбачати, які клавіші звучатимуть «у тональності».",
              longDescription:
                "Every major key except C has a fixed set of sharps or flats that stay in effect for the whole piece, added in a specific, predictable order — never randomly. Sharps accumulate in this order: F#, C#, G#, D#, A#, E#, B#. Flats accumulate in the exact reverse order: Bb, Eb, Ab, Db, Gb, Cb, Fb. So G major has 1 sharp (F#), D major has 2 (F#, C#), and so on; F major has 1 flat (Bb), Bb major has 2 (Bb, Eb), and so on.\n\nOn piano this maps directly onto which black keys you'll be reaching for: a key signature with 3 sharps means you'll be playing F#, C#, and G# every time those letter-names come up in the piece, without a written accidental each time. Sight-reading fluently depends on internalizing this instantly, rather than checking the key signature note-by-note against each note you play.\n\nThe circle of fifths (its own topic, coming up in Phase 2) is the visual map of this same pattern. For now, the practical drill is: given a key name, write out (or play) its scale from memory and check it against the correct sharp/flat count — repeat across a few keys per week rather than trying to memorize all 12 signatures as a flat list.",
              longDescriptionUk:
                "Кожна мажорна тональність, крім до мажору, має фіксований набір дієзів або бемолів, що діють протягом усього твору, і додаються у чіткому, передбачуваному порядку — ніколи випадково. Дієзи накопичуються в такому порядку: F#, C#, G#, D#, A#, E#, B#. Бемолі накопичуються у зворотному порядку: Bb, Eb, Ab, Db, Gb, Cb, Fb. Тож у соль мажорі 1 дієз (F#), у ре мажорі — 2 (F#, C#) і так далі; у фа мажорі 1 бемоль (Bb), у сі-бемоль мажорі — 2 (Bb, Eb) і так далі.\n\nНа фортепіано це напряму відповідає тому, до яких чорних клавіш ви тягнутиметесь: ключовий знак із 3 дієзами означає, що ви гратимете F#, C# та G# щоразу, коли ці букви-назви трапляються у творі, без окремого випадкового знаку щоразу. Швидке читання з листа залежить від миттєвого засвоєння цього, а не перевірки ключового знаку окремо для кожної ноти.\n\nКоло квінт (окрема тема, що трапиться в Етапі 2) — це візуальна карта того самого патерну. Наразі практична вправа: маючи назву тональності, запишіть (або зіграйте) її гаму з пам'яті й звірте з правильною кількістю дієзів/бемолів — повторюйте для кількох тональностей на тиждень, а не намагайтесь одразу завчити всі 12 знаків як плаский список.",
            },
            {
              title: "Triad construction (major/minor/dim/aug)",
              titleUk: "Побудова тризвуків (мажорний/мінорний/зменшений/збільшений)",
              description:
                "All 4 triad types come from stacking two intervals of 3rds. On piano these sit directly under the hand in root position, so build all 4 from the same root back-to-back to hear exactly what changes.",
              descriptionUk:
                "Усі 4 типи тризвуків утворюються накладанням двох терцій. На фортепіано вони лягають прямо під руку в основному положенні, тож побудуйте всі 4 від одного основного тону підряд, щоб точно почути, що змінюється.",
              longDescription:
                "A triad is a root note plus two more notes stacked a 3rd apart on top of it. There are only two sizes of 3rd: a major 3rd (4 semitones) and a minor 3rd (3 semitones), and which one goes on the bottom versus the top is the entire difference between the four triad types. Major = major 3rd then minor 3rd (C-E-G). Minor = minor 3rd then major 3rd (C-Eb-G). Diminished = minor 3rd then another minor 3rd (C-Eb-Gb). Augmented = major 3rd then another major 3rd (C-E-G#).\n\nOn piano, root-position triads naturally sit under fingers 1-3-5 of either hand, which makes them the fastest chord shape to physically compare: play C major, then C minor, then C diminished, then C augmented, keeping the 5th finger as still as possible and only moving what has to move (the 3rd and/or the 5th). That physical stillness makes the sound difference — not the finger movement — the thing your ear locks onto.\n\nOnce triad quality is reliable by ear and by feel in root position, the next natural step (later this phase, in Applied) is playing them in a full scale — building a triad on every degree of a major scale is what leads directly into diatonic harmony in Phase 2.",
              longDescriptionUk:
                "Тризвук — це основний тон плюс ще дві ноти, накладені терціями. Існує лише два розміри терції: велика (4 півтони) і мала (3 півтони), і саме те, яка з них знизу, а яка зверху, і є всією різницею між чотирма типами тризвуків. Мажорний = велика терція, потім мала (C-E-G). Мінорний = мала терція, потім велика (C-Eb-G). Зменшений = мала терція, потім ще одна мала (C-Eb-Gb). Збільшений = велика терція, потім ще одна велика (C-E-G#).\n\nНа фортепіано тризвуки в основному положенні природно лягають під пальці 1-3-5 будь-якої руки, що робить їх найшвидшою формою акорду для фізичного порівняння: зіграйте C мажор, потім C мінор, потім C зменшений, потім C збільшений, тримаючи 5-й палець якомога нерухомішим і рухаючи лише те, що дійсно має рухатись (терцію та/або квінту). Саме ця фізична нерухомість робить різницю у звучанні — а не рух пальців — тим, на чому фокусується слух.\n\nЩойно якість тризвуку стає надійною на слух і на дотик в основному положенні, наступний природний крок (пізніше в цьому етапі, у розділі «Застосування») — грати їх на кожному ступені гами, що напряму веде до діатонічної гармонії в Етапі 2.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Play the major scale hands together across 2 octaves",
              titleUk: "Зіграйте мажорну гаму руками разом на 2 октави",
              description:
                "Pick one key (e.g., C major) and play it ascending/descending, hands together, across a full 2 octaves before moving to a new key. Depth in one key beats shallow exposure to all 12 at this stage.",
              descriptionUk:
                "Оберіть одну тональність (наприклад, до мажор) і зіграйте її вгору/вниз руками разом на повні 2 октави, перш ніж переходити до нової тональності. На цьому етапі глибина в одній тональності важливіша за поверхневе знайомство з усіма 12.",
            },
            {
              title: "Harmonize a simple melody using root-position triads",
              titleUk: "Гармонізуйте просту мелодію тризвуками в основному положенні",
              description:
                "Take a simple known melody and add a single root-position triad in the left hand under each melody note, choosing whichever triad from the key contains that melody note.",
              descriptionUk:
                "Візьміть просту знайому мелодію й додайте лівою рукою один тризвук в основному положенні під кожну ноту мелодії, обираючи той тризвук з тональності, що містить цю ноту мелодії.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Interval recognition (2nds through 5ths)",
              titleUk: "Розпізнавання інтервалів (від секунди до квінти)",
              description:
                "Use a simple ear-training app or reference recordings, and drill identifying these intervals played both ascending and descending, in isolation (not inside a melody yet).",
              descriptionUk:
                "Використовуйте простий застосунок для тренування слуху або еталонні записи й тренуйтеся розпізнавати ці інтервали, зіграні як висхідно, так і низхідно, окремо (ще не в межах мелодії).",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "Harmony and Chord Vocabulary",
      titleUk: "Гармонія та акордовий словник",
      goal: "Understand how chords are built and start using both hands to voice full harmony.",
      goalUk: "Зрозуміти, як будуються акорди, і почати використовувати обидві руки для повноцінного озвучення гармонії.",
      durationLabel: "Months 4-6",
      milestone:
        "Playing all 7 diatonic triads in a key hands-together, using inversions to keep the right hand in one general area of the keyboard, means the Nashville numbers and chord qualities are automatic — not something you're deriving chord by chord.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Chord inversions drilling",
              titleUk: "Тренування обернень акордів",
              description:
                "Root position → 1st inversion → 2nd inversion → back to root an octave up, hands separately then together. Builds the physical map of where each inversion sits under the hand.",
              descriptionUk:
                "Основне положення → перше обернення → друге обернення → назад до основного на октаву вище, спочатку руки окремо, потім разом. Формує фізичну карту того, де кожне обернення лягає під руку.",
            },
            {
              title: "Left-hand accompaniment patterns",
              titleUk: "Патерни акомпанементу лівою рукою",
              description:
                "Alberti bass, block chords, and broken chords — start with a simple thumb-plus-chord pattern on a single chord, focusing on evenness before adding chord changes.",
              descriptionUk:
                "Альбертієвий бас, блокові акорди та розкладені акорди — почніть із простого патерну «великий палець + акорд» на одному акорді, зосереджуючись на рівномірності, перш ніж додавати зміну акордів.",
            },
            {
              title: "Basic sustain pedal technique",
              titleUk: "Базова техніка педалі сустейну",
              description:
                "Practice 'legato pedaling' — releasing and re-depressing the pedal right at the moment a new chord is played, not before, so chords don't blur into each other.",
              descriptionUk:
                "Тренуйте «легатну педалізацію» — відпускання та повторне натискання педалі точно в момент взяття нового акорду, не раніше, щоб акорди не змішувались один з одним.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Diatonic chords in a key (I-ii-iii-IV-V-vi-vii°)",
              titleUk: "Діатонічні акорди в тональності (I-ii-iii-IV-V-vi-vii°)",
              description:
                "The 7 chords that naturally occur when you harmonize a major scale. Memorizing the quality pattern (major-minor-minor-major-major-minor-diminished) lets you predict the chords of any key without looking them up.",
              descriptionUk:
                "7 акордів, які природно виникають при гармонізації мажорної гами. Запам'ятавши патерн якості (мажор-мінор-мінор-мажор-мажор-мінор-зменшений), ви можете передбачити акорди будь-якої тональності, не звіряючись з довідником.",
              longDescription:
                "'Harmonizing the scale' means building a triad on top of every single degree of the major scale, using only notes already in that key. Do this in C major and you get: C major (I), D minor (ii), E minor (iii), F major (IV), G major (V), A minor (vi), B diminished (vii°). The quality pattern — major, minor, minor, major, major, minor, diminished — is identical in every major key, since it falls directly out of where the scale's two half-steps land.\n\nOn piano this is worth playing hands-together directly on the keyboard rather than only writing it down: play each triad in root position ascending up the scale (C-Dm-Em-F-G-Am-Bdim), left hand mirroring or holding a simple bass note. Hearing all 7 in sequence, back to back, is what makes the major-minor-minor-major-major-minor-diminished pattern stick as a sound, not just a memorized label.\n\nOnce you know the key signature and this fixed pattern, you can spell out all 7 chords of any major key from memory. This is also the direct foundation for the Nashville Number System right after it — those Roman numerals are literally labeling this same 7-chord pattern.",
              longDescriptionUk:
                "«Гармонізувати гаму» означає побудувати тризвук на кожному без винятку ступені мажорної гами, використовуючи лише ноти, що вже є в цій тональності. Зробіть це в до мажорі — і отримаєте: C мажор (I), D мінор (ii), E мінор (iii), F мажор (IV), G мажор (V), A мінор (vi), B зменшений (vii°). Патерн якості — мажор, мінор, мінор, мажор, мажор, мінор, зменшений — однаковий у кожній мажорній тональності, бо напряму випливає з того, де в гамі розташовані два півтони.\n\nНа фортепіано варто зіграти це руками разом прямо на клавіатурі, а не лише записати: зіграйте кожен тризвук в основному положенні, піднімаючись гамою (C-Dm-Em-F-G-Am-Bdim), ліва рука дублює або тримає простий бас. Почути всі 7 підряд — це те, що закріплює патерн мажор-мінор-мінор-мажор-мажор-мінор-зменшений як звучання, а не лише завчену етикетку.\n\nЗнаючи ключові знаки та цей фіксований патерн, ви можете вивести всі 7 акордів будь-якої мажорної тональності з пам'яті. Це також безпосередня основа для Нашвільської числової системи одразу після цієї теми — ті римські цифри буквально позначають той самий патерн із 7 акордів.",
            },
            {
              title: "Chord inversions and figured bass basics",
              titleUk: "Обернення акордів та основи цифрованого басу",
              description:
                "The same triad reordered so a note other than the root sits at the bottom. Inversions are what let the right hand stay in one comfortable area instead of jumping across the keyboard for every chord.",
              descriptionUk:
                "Той самий тризвук, переставлений так, щоб знизу опинилася нота, відмінна від основного тону. Обернення дозволяють правій руці залишатись в одній зручній зоні замість стрибків по клавіатурі при кожному акорді.",
              longDescription:
                "A triad in root position has its root at the bottom (C-E-G). First inversion moves the root up an octave so the 3rd sits at the bottom (E-G-C). Second inversion moves the 3rd up too, so the 5th sits at the bottom (G-C-E). The notes are identical in all three cases — only their vertical order changes.\n\nOn piano, inversions solve a very concrete problem: if you played every chord in a progression in strict root position, your hand would jump long distances up and down the keyboard for every single chord change. Using inversions lets you pick whichever version of the next chord has the least distance to travel from where your hand already is — which is the physical version of the 'basic voice leading' idea you'll formally meet in Phase 4.\n\nFigured bass is the old shorthand notation for this: a plain root-position chord gets no symbol, first inversion is marked '6' (a 6th above the bass note), second inversion is marked '6/4.' You don't need to master reading figured bass fluently at this stage — just recognize that when you see those numbers under a bass line, they're telling you which inversion to voice.",
              longDescriptionUk:
                "Тризвук в основному положенні має основний тон знизу (C-E-G). Перше обернення переносить основний тон на октаву вище, тож знизу опиняється терція (E-G-C). Друге обернення переносить і терцію теж, тож знизу опиняється квінта (G-C-E). Ноти в усіх трьох випадках однакові — змінюється лише їхній вертикальний порядок.\n\nНа фортепіано обернення розв'язують дуже конкретну проблему: якби ви грали кожен акорд послідовності в суворо основному положенні, рука стрибала б на великі відстані вгору-вниз по клавіатурі при кожній зміні акорду. Використання обернень дозволяє обирати ту версію наступного акорду, яка вимагає найменшого переміщення від поточного положення руки — це і є фізична версія ідеї «основ голосоведення», з якою ви формально познайомитесь в Етапі 4.\n\nЦифрований бас — це старе скорочене позначення для цього: звичайний акорд в основному положенні не має символу, перше обернення позначається «6» (секста над басовою нотою), друге обернення — «6/4». На цьому етапі не обов'язково вільно читати цифрований бас — достатньо розпізнавати, що коли під баса написані ці цифри, вони вказують, яке обернення озвучити.",
            },
            {
              title: "Nashville Number System / Roman numeral analysis",
              titleUk: "Нашвільська числова система / аналіз римськими цифрами",
              description:
                "Chords labeled by scale-degree number instead of letter name, so a I-IV-V progression is the same numbers in any key. The single most useful shortcut for transposing on the fly.",
              descriptionUk:
                "Акорди позначаються номером ступеня гами замість літерної назви, тож послідовність I-IV-V виглядає однаково в будь-якій тональності. Найкорисніший спосіб швидкого транспонування на льоту.",
              longDescription:
                "Instead of naming chords by letter (C, F, G), Roman numeral analysis names them by their scale-degree position in the key (I, IV, V) — literally just numbering the diatonic chords from the previous topic. Because the quality pattern is fixed for every major key, 'I-IV-V' means exactly the same relationship in every key: in C it's C-F-G, in G it's G-C-D, in D it's D-G-A.\n\nFor a pianist this is what makes transposing a lead-sheet chart on sight practical: a chart marked with numbers (or one you've mentally converted to numbers) can be played in any key instantly, without re-learning a single 'new' progression — I-IV-V is I-IV-V whether the singer wants it in E or Bb, only which actual keys you play changes.\n\nThe everyday use is recognizing that two pieces which look totally different on paper (say, one in A and one in D) might be playing the identical progression, just transposed — spotting that is exactly the skill the Applied 'write out progressions in Roman numerals' exercise below is meant to build.",
              longDescriptionUk:
                "Замість позначення акордів літерами (C, F, G), аналіз римськими цифрами позначає їх номером позиції ступеня в тональності (I, IV, V) — фактично просто нумеруючи діатонічні акорди з попередньої теми. Оскільки патерн якості фіксований для кожної мажорної тональності, «I-IV-V» означає точно те саме співвідношення в будь-якій тональності: у C це C-F-G, у G це G-C-D, у D це D-G-A.\n\nДля піаніста саме це робить практичним транспонування чарту з листа: чарт, позначений цифрами (або той, який ви подумки перевели в цифри), можна зіграти в будь-якій тональності миттєво, не вивчаючи наново жодної «нової» послідовності — I-IV-V залишається I-IV-V, хоче співак заспівати це в мі чи сі-бемолі, змінюються лише конкретні клавіші, які ви граєте.\n\nЩоденна користь — це вміння розпізнати, що два твори, які на папері виглядають абсолютно по-різному (скажімо, один у ля, інший у ре), можуть насправді грати ідентичну послідовність, лише транспоновану — саме цю навичку й розвиває практична вправа «запишіть послідовності римськими цифрами» нижче.",
            },
            {
              title: "7th chords (maj7, min7, dom7, m7b5)",
              titleUk: "Септакорди (maj7, min7, dom7, m7b5)",
              description:
                "Adding a 4th note (the 7th) on top of a triad. Dom7 defines the V chord's 'pull' back to the I chord — foundational to functional harmony and instantly recognizable under the hand as a 4-note block.",
              descriptionUk:
                "Додавання 4-ї ноти (септими) поверх тризвуку. Домінантсептакорд визначає «тяжіння» акорду V назад до акорду I — основа функціональної гармонії, миттєво впізнавана під рукою як 4-нотний блок.",
              longDescription:
                "A 7th chord is a triad with one more 3rd stacked on top. Depending on which triad you start from, you get four common flavors: maj7 (major triad + a note a major 7th above the root — spacious, dreamy), min7 (minor triad + a minor 7th — smooth, mellow), dom7 (major triad + a minor 7th — the important one below), and m7b5 (diminished triad + a minor 7th — used almost exclusively on the vii° chord).\n\nHarmonizing a full major scale in 7th chords instead of triads gives I=maj7, ii=min7, iii=min7, IV=maj7, V=dom7, vi=min7, vii°=m7b5 — so the dominant 7th only ever occurs naturally on the V chord in a given key. A dom7 chord contains a tritone (between its 3rd and its b7), which is intrinsically unstable — your ear wants it to resolve, and resolving V7 to I (G7 to C, for example) is the engine behind an enormous amount of functional harmony.\n\nOn piano, a 4-note 7th chord fits comfortably under one hand in root position or any inversion, which makes it easy to drill: play a dom7 chord and resolve it to its I chord, in a few different keys, listening specifically for that tritone wanting to 'fall inward' as it resolves.",
              longDescriptionUk:
                "Септакорд — це тризвук із ще однією терцією зверху. Залежно від того, з якого тризвуку ви починаєте, отримуєте чотири поширені варіанти: maj7 (мажорний тризвук + нота на велику септиму вище основного тону — просторе, мрійливе звучання), min7 (мінорний тризвук + мала септима — м'яке, оксамитове звучання), dom7 (мажорний тризвук + мала септима — найважливіший, про нього далі), та m7b5 (зменшений тризвук + мала септима — використовується майже виключно на акорді vii°).\n\nГармонізація повної мажорної гами септакордами замість тризвуків дає I=maj7, ii=min7, iii=min7, IV=maj7, V=dom7, vi=min7, vii°=m7b5 — тож домінантсептакорд природно виникає лише на акорді V у певній тональності. Акорд dom7 містить тритон (між терцією та малою септимою), який за своєю природою нестабільний — слух хоче, щоб він розв'язався, і розв'язання V7 в I (наприклад, G7 у C) є двигуном величезної частини функціональної гармонії.\n\nНа фортепіано 4-нотний септакорд зручно лягає під одну руку в основному положенні чи будь-якому оберненні, що робить його зручним для тренування: зіграйте акорд dom7 і розв'яжіть його в акорд I, у кількох різних тональностях, прислухаючись саме до того, як тритон хоче «впасти всередину» під час розв'язання.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Harmonize the major scale using inversions",
              titleUk: "Гармонізуйте мажорну гаму, використовуючи обернення",
              description:
                "In one key, play every diatonic chord (I through vii°) using inversions to keep the right hand centered in one area, so harmony and the keyboard map you already built connect directly.",
              descriptionUk:
                "В одній тональності зіграйте кожен діатонічний акорд (від I до vii°), використовуючи обернення, щоб права рука залишалась в одній зоні, поєднуючи гармонію та вже побудовану карту клавіатури.",
            },
            {
              title:
                "Write out chord progressions in Roman numerals from songs you already play",
              titleUk: "Запишіть акордові послідовності римськими цифрами з пісень, які ви вже граєте",
              description:
                "Take 3-5 songs you know, figure out the chords, and convert them to numbers relative to their key. You'll quickly see the same 4-5 progressions repeating across unrelated songs.",
              descriptionUk:
                "Візьміть 3-5 знайомих пісень, визначте акорди й переведіть їх у цифри відносно тональності. Ви швидко побачите, що ті самі 4-5 послідовностей повторюються в геть різних піснях.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Major vs. minor vs. dominant 7th by ear",
              titleUk: "Мажор проти мінору проти домінантсептакорду на слух",
              description:
                "Play each quality on the same root, back to back, and name them without looking. The dominant 7th's tension against a resolving I chord is usually the easiest to latch onto first.",
              descriptionUk:
                "Зіграйте кожну якість від одного основного тону підряд і називайте їх, не дивлячись. Напругу домінантсептакорду відносно акорду I, у який він розв'язується, зазвичай найлегше вловити першою.",
            },
            {
              title: "Chord progression dictation (I-IV-V-based)",
              titleUk: "Диктант акордових послідовностей (на основі I-IV-V)",
              description:
                "Listen to simple progressions and try to identify the sequence by number before checking. Start with well-known song progressions you can verify against.",
              descriptionUk:
                "Слухайте прості послідовності й намагайтеся визначити їх цифрами, перш ніж перевірити. Починайте з відомих послідовностей із пісень, які можна звірити.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 3,
      title: "Improvisation and Modal Playing",
      titleUk: "Імпровізація та ладова гра",
      goal: 'Move from "knowing scales" to using them expressively over changing harmony.',
      goalUk: "Перейти від «знання гам» до виразного їх використання над гармонією, що змінюється.",
      durationLabel: "Months 7-9",
      milestone:
        'Improvising a coherent 8-bar phrase over a I-IV-V progression "with intention" means you can explain, in the moment or afterward, why you switched scales/modes where you did — the goal is deliberate choice, not just having more options memorized.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Arpeggios hands together",
              titleUk: "Арпеджіо руками разом",
              description:
                "Broken triads and 7th chords played as a single flowing line across both hands, gradually increasing tempo. Builds the finger-crossing fluency that fast melodic lines depend on.",
              descriptionUk:
                "Розкладені тризвуки й септакорди, зіграні як єдина плинна лінія через обидві руки, з поступовим збільшенням темпу. Розвиває плавність перехрещення пальців, від якої залежать швидкі мелодичні лінії.",
            },
            {
              title: "Scale speed building with metronome",
              titleUk: "Розбудова швидкості гам під метроном",
              description:
                "Take a scale that's clean at a slow tempo and increase the metronome by small increments only once it's completely even at the current speed — never trade cleanliness for raw speed.",
              descriptionUk:
                "Візьміть гаму, чисту в повільному темпі, і збільшуйте метроном невеликими кроками, лише коли вона повністю рівна на поточній швидкості — ніколи не жертвуйте чистотою заради голої швидкості.",
            },
            {
              title: "Syncopated rhythm and off-beat coordination",
              titleUk: "Синкопований ритм та координація на слабку долю",
              description:
                "Practice with the metronome clicking only on the off-beats, forcing you to internally feel where the downbeat is rather than relying on hearing it. This is what most improvised comping rhythm actually requires.",
              descriptionUk:
                "Тренуйтесь під метроном, що клацає лише на слабкі долі, змушуючи внутрішньо відчувати сильну долю, а не покладатись на її звучання. Саме це насправді потрібно для більшості імпровізованого ритму акомпанементу.",
            },
            {
              title: "Right-hand voicing over left-hand bass",
              titleUk: "Озвучення правою рукою над басом лівої",
              description:
                "Practice a simple walking or root-note bass line in the left hand while voicing chords in the right, keeping the two hands rhythmically independent rather than always landing together.",
              descriptionUk:
                "Тренуйте просту крокуючу або основну басову лінію лівою рукою, озвучуючи акорди правою, зберігаючи ритмічну незалежність рук замість постійного одночасного удару.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "The 7 modes as reharmonizations of the major scale",
              titleUk: "7 ладів як переосмислення мажорної гами",
              description:
                "Each mode uses the exact same notes as a major scale, just starting from a different degree — Dorian is 'the major scale starting on its 2nd note,' etc. Far faster than memorizing 7 new interval formulas from scratch.",
              descriptionUk:
                "Кожен лад використовує точно ті самі ноти, що й мажорна гама, лише починаючи з іншого ступеня — дорійський лад це «мажорна гама, що починається з її 2-ї ноти» і так далі. Це набагато швидше, ніж завчати 7 нових формул інтервалів з нуля.",
              longDescription:
                "The same 7 notes can be re-centered around a different root, changing the pattern of whole/half steps relative to that new root and, with it, the character of the scale. Modes formalize all 7 possible re-centerings of a major scale: Ionian (degree 1) is the major scale itself — bright, resolved. Dorian (degree 2) is minor-flavored with a raised 6th — lifted, jazzy. Phrygian (degree 3) is minor with a lowered 2nd — dark, Spanish-flavored. Lydian (degree 4) is major with a raised 4th — bright, floating. Mixolydian (degree 5) is major with a lowered 7th — bluesy pull instead of a strong resolution. Aeolian (degree 6) is natural minor. Locrian (degree 7) has a lowered 2nd and 5th — unstable, rarely a true tonal center.\n\nOn piano this is unusually visual: play a C major scale from C to C, then play the exact same white keys but starting and ending on D instead — that's D Dorian, no new notes required, just a different note treated as 'home.' Do the same starting from E (Phrygian), F (Lydian), G (Mixolydian), A (Aeolian), and B (Locrian) — all seven modes are sitting on the white keys already, just waiting for you to shift where you resolve.\n\nThe practical shortcut: take a scale you already know and think of a mode as 'the same notes, just a different home note' — no new fingerings to learn from scratch, only a new note to resolve toward.",
              longDescriptionUk:
                "Ті самі 7 нот можна «перецентрувати» навколо іншого основного тону, змінюючи патерн тонів/півтонів відносно цього нового тону, а разом з ним і характер гами. Лади формалізують усі 7 можливих «перецентрувань» мажорної гами: іонійський (1-й ступінь) — це сама мажорна гама: яскрава, розв'язана. Дорійський (2-й ступінь) має мінорний присмак із підвищеною 6-ю ступінню — піднесений, джазовий. Фригійський (3-й ступінь) — мінорний зі зниженою 2-ю ступінню — темний, іспанський за відтінком. Лідійський (4-й ступінь) — мажорний із підвищеною 4-ю ступінню — яскравий, «підвішений». Міксолідійський (5-й ступінь) — мажорний зі зниженою 7-ю ступінню — блюзове тяжіння замість сильного розв'язання. Еолійський (6-й ступінь) — натуральний мінор. Локрійський (7-й ступінь) має знижені 2-гу та 5-ту ступені — нестабільний, рідко буває справжнім тональним центром.\n\nНа фортепіано це надзвичайно наочно: зіграйте гаму до мажор від C до C, потім зіграйте ті самі білі клавіші, але починаючи й закінчуючи на D — це і є ре дорійський, жодних нових нот не потрібно, просто інша нота вважається «домом». Зробіть те саме від E (фригійський), F (лідійський), G (міксолідійський), A (еолійський) та B (локрійський) — усі сім ладів уже лежать на білих клавішах, чекаючи, поки ви зміните точку розв'язання.\n\nПрактичний спосіб: візьміть уже знайому гаму й сприймайте лад як «ті самі ноти, просто інша нота-дім» — жодних нових аплікатур учити з нуля, лише нова нота, до якої тепер тяжіє розв'язання.",
            },
            {
              title: "Pentatonic and blues scale relationships to modes",
              titleUk: "Зв'язок пентатоніки та блюзової гами з ладами",
              description:
                "The minor pentatonic scale is a stripped-down 5-note version of Aeolian/Dorian; the blues scale adds one chromatic 'blue note' on top of that.",
              descriptionUk:
                "Мінорна пентатоніка — це спрощена 5-нотна версія еолійського/дорійського ладів; блюзова гама додає до неї ще одну хроматичну «блюзову ноту».",
              longDescription:
                "The minor pentatonic scale is Aeolian (natural minor) with its 2nd and 6th degrees removed, leaving just 5 notes — in A minor pentatonic: A, C, D, E, G (compare to full A Aeolian: A, B, C, D, E, F, G). Those two removed notes are the ones most likely to clash against a simple minor-key backing, so pulling them out leaves a scale that's very hard to make sound 'wrong.'\n\nThe blues scale takes that same 5-note minor pentatonic and adds one more note: a b5 sitting between the 4th and 5th degrees — in A blues: A, C, D, Eb, E, G. That chromatic addition is the 'blue note,' deliberately the most dissonant note available against the underlying chord, used as a passing tone rather than something you land on and hold.\n\nOn piano, both scales are easiest to internalize in a single hand-position box first — five fingers roughly covering the five (or six) notes — before spreading them across a wider range. Once you can hear how thin the minor pentatonic sounds compared to the fuller Dorian or Aeolian it's drawn from, adding notes back in is how you get from 'safe pentatonic licks' to lines that sound genuinely modal.",
              longDescriptionUk:
                "Мінорна пентатоніка — це еолійський лад (натуральний мінор) без 2-ї та 6-ї ступенів, тобто лишається лише 5 нот — у ля мінорній пентатоніці: A, C, D, E, G (порівняйте з повним ля еолійським: A, B, C, D, E, F, G). Саме ці дві вилучені ноти найімовірніше створюють дисонанс проти простого мінорного акомпанементу, тож їх вилучення залишає гаму, яку дуже важко змусити звучати «неправильно».\n\nБлюзова гама бере ту саму 5-нотну мінорну пентатоніку й додає ще одну ноту: понижену квінту (b5), що лежить між 4-ю та 5-ю ступенями — у ля блюзовій: A, C, D, Eb, E, G. Ця хроматична добавка і є «блюзовою нотою» — свідомо найдисонантнішою нотою відносно акорду, що звучить, використовується як прохідний тон, а не нота, на якій зупиняються.\n\nНа фортепіано обидві гами найлегше засвоїти спочатку в одній позиції руки — п'ять пальців приблизно покривають п'ять (чи шість) нот — перш ніж поширювати їх на ширший діапазон. Щойно ви зможете почути, наскільки «тонше» звучить мінорна пентатоніка порівняно з повнішими дорійським чи еолійським ладами, повернення нот назад і є способом перейти від «безпечних пентатонічних ліків» до фраз, що звучать по-справжньому ладово.",
            },
            {
              title: "Chord-scale relationships",
              titleUk: "Відповідність гами й акорду",
              description:
                "For a given chord, certain scales/modes 'fit' because they share the chord's essential notes. Over a major chord, Ionian or Lydian fit; over a minor chord, Aeolian or Dorian fit.",
              descriptionUk:
                "Для певного акорду деякі гами/лади «підходять», бо мають спільні з акордом ключові ноти. Над мажорним акордом підходять іонійський чи лідійський; над мінорним — еолійський чи дорійський.",
              longDescription:
                "A scale 'fits' a chord when it contains that chord's essential notes — root, 3rd, and 5th at minimum, ideally the 7th too. Over a plain major or maj7 chord, both Ionian and Lydian fit; Lydian just adds a brighter, raised-4th color on top. Over a minor or min7 chord, Aeolian and Dorian both fit, with Dorian's raised 6th giving a slightly more open sound.\n\nA practical worked example on piano is a ii-V-I in C major (Dm7 - G7 - Cmaj7), played as left-hand chord voicings while the right hand improvises: over the Dm7 you'd reach for D Dorian, over the G7 you'd reach for G Mixolydian (matching the dominant chord's own b7), and over the Cmaj7 you'd land back on C Ionian or C Lydian.\n\nNotice all three of those scale choices are actually built from the exact same 7 notes (C major) — the 'chord-scale' choice isn't about switching note pools, it's about which note within that shared pool you're treating as home as you pass over each chord, which is exactly the 'targeting chord tones' skill the Applied section below is built to drill.",
              longDescriptionUk:
                "Гама «підходить» акорду, коли містить його ключові ноти — щонайменше основний тон, терцію й квінту, а в ідеалі й септиму. Над простим мажорним чи maj7 акордом підходять і іонійський, і лідійський; лідійський просто додає яскравіший відтінок за рахунок підвищеної 4-ї ступені. Над мінорним чи min7 акордом підходять і еолійський, і дорійський, причому підвищена 6-та ступінь дорійського дає трохи відкритіше звучання.\n\nПрактичний приклад на фортепіано — послідовність ii-V-I в до мажорі (Dm7 - G7 - Cmaj7), зіграна як озвучення акордів лівою рукою, поки права імпровізує: над Dm7 ви берете D дорійський, над G7 — G міксолідійський (що відповідає власній b7 домінантового акорду), а над Cmaj7 повертаєтесь до C іонійського чи C лідійського.\n\nЗверніть увагу: усі три обрані гами насправді побудовані на тих самих 7 нотах (до мажор) — вибір «гами під акорд» тут не про зміну набору нот, а про те, яку ноту в межах цього спільного набору ви вважаєте «домом», проходячи над кожним акордом — а це точно та сама навичка «прицілювання на тони акорду», яку й тренує розділ «Застосування» нижче.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Improvise over a static I chord using the matching mode",
              titleUk: "Імпровізуйте над статичним акордом I, використовуючи відповідний лад",
              description:
                "Hold a simple left-hand chord (or loop a backing track) and improvise with the right hand using only the matching mode, focusing on landing on the chord tones (1, 3, 5) on strong beats.",
              descriptionUk:
                "Тримайте простий акорд лівою рукою (або зациклюйте бек-трек) та імпровізуйте правою, використовуючи лише відповідний лад, зосереджуючись на потраплянні в тони акорду (1, 3, 5) на сильні долі.",
            },
            {
              title: "Improvise over a ii-V-I progression, targeting chord tones",
              titleUk: "Імпровізуйте над послідовністю ii-V-I, прицілюючись на тони акордів",
              description:
                "Deliberately aim for a chord tone of whichever chord is currently sounding, right as the left hand changes chord, rather than running a scale on autopilot through the whole progression.",
              descriptionUk:
                "Свідомо цільтесь у тон акорду, що звучить у певний момент, саме в момент зміни акорду лівою рукою, замість того щоб «на автопілоті» пробігати гамою через усю послідовність.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Distinguish major-family vs. minor-family modes by ear",
              titleUk: "Розрізняйте на слух лади «мажорної» та «мінорної» родини",
              description:
                "Train the broader 'does this sound major-ish or minor-ish' distinction reliably and quickly first, before identifying exact modes.",
              descriptionUk:
                "Спершу тренуйте ширшу здатність швидко й надійно відчувати, «це звучить більш по-мажорному чи по-мінорному», перш ніж визначати конкретний лад.",
            },
            {
              title: "Weekly short melodic transcription",
              titleUk: "Щотижнева коротка мелодична транскрипція",
              description:
                "Pick a short phrase (4-8 notes) from a song, figure it out by ear on the piano, and check yourself against the recording. Keep phrases short and frequent rather than occasional long transcriptions.",
              descriptionUk:
                "Оберіть коротку фразу (4-8 нот) з пісні, підберіть її на слух на фортепіано й звірте себе із записом. Обирайте короткі й часті фрази замість рідкісних довгих транскрипцій.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 4,
      title: "Advanced Harmony and Personal Style",
      titleUk: "Просунута гармонія та особистий стиль",
      goal: "Consolidate everything into your own musical vocabulary.",
      goalUk: "Об'єднати все у власний музичний словник.",
      durationLabel: "Months 10-12",
      milestone:
        'An original composition or arrangement "deliberately applying at least 3 concepts" means you should be able to point to specific measures and name the concept in use — the point is conscious application, proving the theory has become usable rather than just understood abstractly.',
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Advanced voicing techniques",
              titleUk: "Просунуті техніки озвучення",
              description:
                "Pick a direction based on genuine interest rather than defaulting — open/spread voicings for solo arranging depth, or tighter jazz/pop comping voicings for accompaniment-focused playing.",
              descriptionUk:
                "Обирайте напрям на основі щирого інтересу, а не за замовчуванням — розсипчасті/розкриті озвучення для глибини сольних аранжувань або компактніші джаз/поп-озвучення для акомпанементу.",
            },
            {
              title: "Dynamics and touch control",
              titleUk: "Динаміка та контроль дотику",
              description:
                "Practice playing the identical phrase at 3 distinct volume levels without changing the notes or tempo, isolating touch as its own controllable variable.",
              descriptionUk:
                "Тренуйтесь грати одну й ту саму фразу на 3 різних рівнях гучності, не змінюючи ноти чи темп, виокремлюючи дотик як самостійну керовану змінну.",
            },
            {
              title: "Efficient hand shifts and pedal refinement",
              titleUk: "Ефективні переміщення рук та вдосконалення педалізації",
              description:
                "When a passage requires moving across the keyboard, practice shifting during a sustained or held note rather than a rhythmically active moment. Combine with precise pedal timing so shifts stay inaudible.",
              descriptionUk:
                "Коли пасаж вимагає переміщення по клавіатурі, тренуйтесь робити зсув під час витриманої чи задержаної ноти, а не в ритмічно активний момент. Поєднуйте з точним таймінгом педалі, щоб зсуви залишались нечутними.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Secondary dominants",
              titleUk: "Побічні домінанти",
              description:
                "A dominant 7th chord borrowed to resolve into a chord other than the I (e.g., a 'V of V'), used to add a temporary pull toward a chord that isn't the main key center.",
              descriptionUk:
                "Домінантсептакорд, запозичений для розв'язання в акорд, відмінний від I (наприклад, «V від V»), що використовується для додавання тимчасового тяжіння до акорду, який не є головним тональним центром.",
              longDescription:
                "You already know that a dom7 chord's tritone creates a strong pull toward whatever chord sits a 5th below it — normally V7 resolving to I. A secondary dominant borrows that exact same trick to resolve into a chord other than the I. The notation 'V/V' (read 'five of five') means: build a dominant 7th on the 5th degree of whatever chord you're about to briefly treat as a temporary key center.\n\nConcretely, in C major the V chord is G. The V of G (V/V relative to the home key of C) is D7 — a chord that isn't naturally diatonic to C major at all, since diatonic C major gives you a plain D minor there, not D7. Raising that F to F# to make it D7 borrows a leading tone that pulls hard into G, a much stronger push toward the V chord than the plain diatonic Dm-to-G motion.\n\nOn piano, this is a satisfying thing to practice as a left-hand voicing exercise: play a simple ii-V-I, then insert a V/V (D7) right before the V chord and listen to how much harder the progression 'wants' to move forward. Any major or minor chord in a progression can be temporarily treated as a mini 'I' this way.",
              longDescriptionUk:
                "Ви вже знаєте, що тритон акорду dom7 створює сильне тяжіння до акорду, розташованого на квінту нижче — зазвичай це V7, що розв'язується в I. Побічна домінанта запозичує той самий трюк, щоб розв'язатися в акорд, відмінний від I. Позначення «V/V» (читається «п'ять від п'яти») означає: побудуйте домінантсептакорд на 5-му ступені того акорду, який ви на мить трактуєте як тимчасовий тональний центр.\n\nКонкретно: у до мажорі акорд V — це G. V від G (V/V відносно домашньої тональності C) — це D7, акорд, який зовсім не є природно діатонічним для до мажору, адже діатонічно там мав би бути звичайний D мінор, а не D7. Підвищення тієї F до F#, щоб отримати D7, запозичує вступний тон, який сильно тягне до G — значно потужніший поштовх до акорду V, ніж звичайний діатонічний рух Dm-до-G.\n\nНа фортепіано це приємно тренувати як вправу на озвучення лівою рукою: зіграйте простий ii-V-I, потім вставте V/V (D7) прямо перед акордом V і прислухайтесь, наскільки сильніше послідовність «хоче» рухатись вперед. Будь-який мажорний чи мінорний акорд у послідовності можна тимчасово трактувати як міні-«I» таким чином.",
            },
            {
              title: "Borrowed chords",
              titleUk: "Запозичені акорди",
              description:
                "Chords pulled from the parallel minor or major key (e.g., a minor iv chord in an otherwise major-key song) for color, without fully changing key.",
              descriptionUk:
                "Акорди, взяті з однойменної мінорної чи мажорної тональності (наприклад, мінорний акорд iv у пісні, що загалом у мажорі) заради колориту, без повної зміни тональності.",
              longDescription:
                "'Parallel' keys share the same root but differ in mode — C major and C minor are parallel keys, as opposed to relative keys like C major and A minor (same note set, different starting note). A borrowed chord takes a chord from the parallel key and drops it into an otherwise diatonic progression for color, without actually changing the song's key center.\n\nThe most common example: in a major-key piece, borrowing the iv chord from the parallel minor. In C major the diatonic IV is F major, but C minor's iv chord is F minor — borrowing that Fm into a C major piece (often right before resolving back to C) gives a moment of unexpected darkness that resolves warmly once the major I returns. Other frequently borrowed chords include bVII (Bb in the key of C) and bVI (Ab in the key of C).\n\nOn piano this is easy to test by ear directly: play a C-F-G-C progression, then try C-Fm-G-C and listen to exactly where the color shifts. The ear test for whether something is a borrowed chord versus a full key change is whether the music snaps back to the original key's diatonic chords right after — a borrowed chord is a brief visit, not a relocation.",
              longDescriptionUk:
                "«Однойменні» тональності мають спільний основний тон, але різний лад — до мажор і до мінор є однойменними тональностями, на відміну від паралельних тональностей на кшталт до мажору й ля мінору (той самий набір нот, різний основний тон). Запозичений акорд бере акорд з однойменної тональності й додає його до інакше діатонічної послідовності заради колориту, фактично не змінюючи тональний центр твору.\n\nНайпоширеніший приклад: у творі в мажорі запозичити акорд iv з однойменного мінору. У до мажорі діатонічним IV був би F мажор, але акорд iv до мінору — це F мінор — запозичення цього Fm у твір в до мажорі (часто прямо перед поверненням до C) дає момент несподіваної темряви, що тепло розв'язується з поверненням мажорного I. Інші часто запозичені акорди — bVII (Bb у тональності C) та bVI (Ab у тональності C).\n\nНа фортепіано це легко перевірити безпосередньо на слух: зіграйте послідовність C-F-G-C, потім спробуйте C-Fm-G-C і прислухайтесь, де саме змінюється колорит. Перевірка на слух, чи є щось запозиченим акордом, а не повною зміною тональності — це чи повертається музика одразу після цього до діатонічних акордів початкової тональності: запозичений акорд — це короткий візит, а не переїзд.",
            },
            {
              title: "Extended chords (9ths, 11ths, 13ths)",
              titleUk: "Розширені акорди (9, 11, 13)",
              description:
                "These stack additional 3rds beyond the 7th chord. On piano these are unusually practical, since 10 fingers across two hands can comfortably hold notes a guitarist would have to selectively drop.",
              descriptionUk:
                "Ці акорди накладають додаткові терції поверх септакорду. На фортепіано вони незвично практичні, адже 10 пальців на двох руках можуть зручно тримати ноти, які гітаристу довелося б вибірково прибирати.",
              longDescription:
                "Keep stacking 3rds past the 7th chord and you get extensions: one more 3rd above the 7th gives a 9th, another gives an 11th, another gives a 13th — in C: C-E-G-Bb-D(9)-F(11)-A(13). In full theoretical form a 13th chord contains 7 different notes.\n\nOn piano, splitting a chord like this across both hands is genuinely practical: left hand plays root and 7th (the two notes that most define the chord's basic identity), right hand plays the 3rd plus whichever extension is named (9th, 11th, or 13th) — no need to drop notes the way a single-hand or single-instrument voicing might require. A common practical 9th-chord voicing, for instance, is root+7th in the left hand and 3rd+9th in the right, which reads clearly as '9th chord' to the ear while staying comfortable to play.\n\nThe skill worth building here isn't memorizing every possible extended-chord shape; it's learning to identify which notes are load-bearing for a chord's sound (root, 3rd, 7th, and the named extension) versus which can be thinned out (the 5th is rarely essential), which is what lets you build a usable two-hand voicing for a chord you've never specifically learned a shape for.",
              longDescriptionUk:
                "Продовжуйте накладати терції понад септакорд — і отримаєте розширення: ще одна терція над септимою дає нону (9), ще одна — ундециму (11), ще одна — терцдециму (13) — у C: C-E-G-Bb-D(9)-F(11)-A(13). У повній теоретичній формі акорд 13 містить 7 різних нот.\n\nНа фортепіано розділення такого акорду між двома руками справді практичне: ліва рука грає основний тон і септиму (дві ноти, що найбільше визначають базове «обличчя» акорду), права рука грає терцію та назване розширення (9, 11 чи 13) — не потрібно прибирати ноти так, як це могло б знадобитись при озвученні однією рукою чи одним інструментом. Практична аплікатура акорду 9, наприклад — основний тон+септима лівою рукою, терція+нона правою — чітко зчитується слухом як «акорд 9», залишаючись зручною для гри.\n\nНавичка, яку варто розвивати тут — не завчання кожної можливої форми розширеного акорду, а вміння визначати, які ноти є «несучими» для звучання акорду (основний тон, терція, септима та назване розширення), а які можна прибрати (квінта рідко важлива) — саме це дозволяє побудувати придатну дворучну аплікатуру для акорду, форму якого ви ніколи спеціально не вчили.",
            },
            {
              title: "Basic voice leading",
              titleUk: "Основи голосоведення",
              description:
                "Choosing chord voicings so that individual notes move the shortest possible distance between chords, rather than jumping between disconnected shapes.",
              descriptionUk:
                "Вибір аплікатур акордів так, щоб окремі ноти рухалися найкоротшою можливою відстанню між акордами, замість стрибків між непов'язаними формами.",
              longDescription:
                "Many pianists learn chords as whole shapes and move between them by picking up the entire hand shape and setting it down somewhere else — which works, but often means every note jumps a large, audible distance even when the underlying harmony is only changing a little. Voice leading is the practice of choosing (or inverting) a chord voicing so that its individual notes move as little as possible into the next chord.\n\nA simple example: moving from C major (C-E-G) to A minor (A-C-E) shares two notes outright (C and E) — a voice-led transition keeps those shared notes physically in the same spot (or barely moves them) and only moves the note that actually needs to change (G to A), rather than re-fingering the whole chord as a fresh shape. Extend that thinking across a full progression and individual notes trace short, smooth paths from chord to chord instead of a series of unrelated jumps.\n\nThis is the direct extension of the 'inversions' idea from Phase 2, now applied deliberately across an entire progression — and it's also the practical foundation for reharmonization right after this, since smoothly voice-leading a substitute chord into a progression is what keeps a bold harmonic substitution from sounding jarring.",
              longDescriptionUk:
                "Багато піаністів вивчають акорди як цілісні форми й переходять між ними, «піднімаючи» всю форму руки й опускаючи її десь-інде — це працює, але часто означає, що кожна нота стрибає на велику, чутну відстань, навіть коли гармонія під нею змінюється зовсім трохи. Голосоведення — це практика вибору (чи обернення) аплікатури акорду так, щоб окремі ноти рухались до наступного акорду якомога менше.\n\nПростий приклад: перехід від C мажор (C-E-G) до A мінор (A-C-E) має дві спільні ноти (C та E) — перехід із голосоведенням залишає ці спільні ноти фізично на тому самому місці (або майже не рухає їх) і рухає лише ту ноту, яка дійсно має змінитись (G на A), замість перебудови всього акорду як нової форми. Поширіть це мислення на цілу послідовність — і окремі ноти прокладають короткі, плавні шляхи від акорду до акорду замість серії непов'язаних стрибків.\n\nЦе безпосереднє продовження ідеї «обернень» з Етапу 2, тепер свідомо застосоване до цілої послідовності — а також практична основа для реармонізації одразу після цього, адже саме плавне «вплетення» замінного акорду через голосоведення не дає сміливій гармонічній заміні звучати різко.",
            },
            {
              title: "Intro to reharmonization",
              titleUk: "Вступ до реармонізації",
              description:
                "Taking an existing melody and supporting it with a different (but still compatible) set of chords underneath, using secondary dominants/borrowed chords/extensions as your toolkit.",
              descriptionUk:
                "Взяти наявну мелодію й підтримати її іншим (але все ще сумісним) набором акордів знизу, використовуючи побічні домінанти/запозичені акорди/розширення як інструментарій.",
              longDescription:
                "Reharmonization means keeping an existing melody exactly as it is, but changing the chords supporting it underneath to something that still fits the melody notes but creates a different mood or color. It's the point where secondary dominants, borrowed chords, extended chords, and voice leading — everything else in this phase — stop being separate topics and become one combined toolkit.\n\nA simple worked example: take a plain I-IV-V-I progression in C (C-F-G-C). A first reharmonization might insert a V/V (D7) before the G to sharpen the pull into it: C-F-D7-G-C. A second pass might borrow the minor iv (Fm) right before the final C for a darker color on the way home: C-Fm-G-C. In both cases the melody notes over each chord haven't necessarily changed — what changed is the harmonic support underneath.\n\nOn piano, this is a comfortable exercise precisely because both hands are available: keep the right hand playing the original melody exactly as written while experimenting with the left-hand chords underneath, substituting one chord at a time and listening for what shifts emotionally with each substitution rather than trying to overhaul the whole thing at once.",
              longDescriptionUk:
                "Реармонізація означає залишити наявну мелодію абсолютно незмінною, але змінити акорди, що її підтримують знизу, на такі, що все ще пасують до нот мелодії, але створюють інший настрій чи колорит. Це той момент, коли побічні домінанти, запозичені акорди, розширені акорди та голосоведення — все інше з цього етапу — перестають бути окремими темами й стають єдиним об'єднаним інструментарієм.\n\nПростий приклад: візьміть звичайну послідовність I-IV-V-I в C (C-F-G-C). Перша реармонізація може вставити V/V (D7) перед G, щоб загострити тяжіння до нього: C-F-D7-G-C. Другий прохід може запозичити мінорний iv (Fm) прямо перед фінальним C заради темнішого колориту на шляху додому: C-Fm-G-C. В обох випадках ноти мелодії над кожним акордом не обов'язково змінилися — змінилася гармонічна підтримка знизу.\n\nНа фортепіано це зручна вправа саме тому, що доступні обидві руки: тримайте праву руку такою, що грає оригінальну мелодію точно як записано, експериментуючи з акордами лівої руки знизу, замінюючи по одному акорду за раз і прислухаючись, що емоційно змінюється з кожною заміною, замість спроби переробити все одразу.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Reharmonize a familiar progression",
              titleUk: "Реармонізуйте знайому послідовність",
              description:
                "Take a simple progression you already know and substitute at least one borrowed chord or secondary dominant, then listen for what changed emotionally.",
              descriptionUk:
                "Візьміть просту, вже знайому послідовність і замініть принаймні один акорд на запозичений або побічну домінанту, потім прислухайтеся, що змінилося емоційно.",
            },
            {
              title: "Compose an 8-16 bar original piece",
              titleUk: "Створіть оригінальний твір на 8-16 тактів",
              description:
                "Deliberately require yourself to use at least one concept from each of the previous 3 phases so the composition functions as a real synthesis exercise, not just a free-write.",
              descriptionUk:
                "Свідомо вимагайте від себе використати принаймні одне поняття з кожного з попередніх 3 етапів, щоб твір слугував справжньою вправою на синтез, а не просто вільним написанням.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Full chord quality ID including extensions",
              titleUk: "Повне визначення якості акорду, включно з розширеннями",
              description:
                "Extend the Phase 2 ear-training drill to include 9ths and other extensions, since the 'flavor' they add is often more recognizable by ear than by looking at the notes on paper.",
              descriptionUk:
                "Розширте вправу з тренування слуху з Етапу 2, додавши нони та інші розширення, адже «присмак», який вони додають, часто легше впізнати на слух, ніж дивлячись на ноти на папері.",
            },
            {
              title: "Transcribe a full short passage (melody + chords)",
              titleUk: "Транскрибуйте повний короткий уривок (мелодія + акорди)",
              description:
                "A step up from Phase 3's melody-only transcription — now work out both the tune and what's harmonizing it underneath for a short section of a piece.",
              descriptionUk:
                "Крок далі порівняно з транскрипцією лише мелодії з Етапу 3 — тепер розберіть і мелодію, і те, що її гармонізує знизу, для короткого фрагмента твору.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Metronome always on",
              titleUk: "Метроном завжди увімкнений",
              description:
                "Track a specific tempo number per exercise over time (e.g., 'C major scale: 60 BPM → 96 BPM over 6 weeks') so progress is measurable instead of a vague feeling of 'getting better.'",
              descriptionUk:
                "Відстежуйте конкретний темп для кожної вправи з часом (наприклад, «гама до мажор: 60 → 96 уд/хв за 6 тижнів»), щоб прогрес був вимірюваним, а не розмитим відчуттям «стає краще».",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Read back through a month of entries occasionally; patterns in what keeps showing up as 'struggle' tell you where to spend more deliberate time.",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Час від часу перечитуйте записи за місяць; патерни в тому, що постійно повторюється як «труднощі», підказують, де варто приділити більше свідомої уваги.",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay something from an earlier phase without warming up on it first. If it's shaky, that's useful information — it means the skill needs occasional maintenance reps, not that you failed to learn it.",
              descriptionUk:
                "Раз на кілька тижнів переграйте щось із попереднього етапу без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень, а не свідчення того, що ви її не вивчили.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Pair every theory concept with a real song",
              titleUk: "Пов'язуйте кожне теоретичне поняття з реальною піснею",
              description:
                "For every phase's theory concept, find or pick 1-2 actual songs/pieces that use it, so the abstract concept always has a concrete, motivating home rather than living only in exercises.",
              descriptionUk:
                "Для кожного теоретичного поняття з кожного етапу знайдіть чи оберіть 1-2 реальні пісні/твори, що його використовують, щоб абстрактне поняття завжди мало конкретний, мотивуючий дім, а не існувало лише у вправах.",
            },
          ],
        },
      ],
    },
  ],
};

const beginnerGuitarPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "guitar", name: "Guitar", nameUk: "Гітара" },
  plan: {
    title: "Beginner Guitar Practice Plan",
    titleUk: "План практики гри на гітарі для початківців",
    description:
      "For complete beginners, 6-month plan building hand position, first chords, and reading fundamentals from zero, ~20-30 min/day. Graduate into the Long-Term Guitar Practice Plan afterward.",
    descriptionUk:
      "Для абсолютних початківців, 6-місячний план, що з нуля розвиває положення рук, перші акорди та основи читання, ~20-30 хв/день. Після завершення переходьте до Довгострокового плану практики гри на гітарі.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Absolute Basics",
      titleUk: "Абсолютні основи",
      goal: "Build comfortable hand position and play your first open chords cleanly.",
      goalUk: "Розвинути зручне положення рук і чисто грати перші відкриті акорди.",
      durationLabel: "Months 1-3",
      milestone:
        "Switching cleanly between the 4 easiest open chords (Em, Am, G, C) without buzzing or muted strings, while keeping steady time, means your fretting hand can find each shape without looking and without a pause to 'reset.'",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Holding the guitar and posture",
              titleUk: "Тримання гітари та постава",
              description:
                "Find a sitting or standing position where the guitar stays stable without your arms holding it in place, so both hands are free to move without fighting to keep the instrument steady.",
              descriptionUk:
                "Знайдіть сидяче чи стояче положення, у якому гітара залишається стабільною без того, щоб руки утримували її на місці — тоді обидві руки вільні рухатися, не борючись за стабільність інструмента.",
            },
            {
              title: "Fretting hand basics",
              titleUk: "Основи притискання лівою рукою",
              description:
                "Press just behind the fret (not on top of it) with the tip of your finger, using only as much thumb pressure behind the neck as needed for the note to ring clean — more pressure than that just causes fatigue.",
              descriptionUk:
                "Притискайте струну кінчиком пальця одразу за ладом (не на самому ладі), використовуючи великим пальцем на грифі рівно стільки тиску, скільки потрібно для чистого звучання ноти — більший тиск лише викликає втому.",
            },
            {
              title: "Basic pick grip and downstrokes",
              titleUk: "Базовий хват медіатора та удари вниз",
              description:
                "Hold the pick loosely between thumb and index finger, with only a small triangle of the tip exposed. Practice slow, even downstrokes on open strings before adding any fretting.",
              descriptionUk:
                "Тримайте медіатор вільно між великим і вказівним пальцями, залишаючи назовні лише невеликий трикутник кінчика. Тренуйте повільні, рівномірні удари вниз на відкритих струнах, перш ніж додавати притискання.",
            },
            {
              title: "First open chords (Em, Am, G, C)",
              titleUk: "Перші відкриті акорди (Em, Am, G, C)",
              description:
                "The four easiest beginner shapes. Learn one at a time: place the fingers, strum slowly one string at a time, and identify exactly which string (if any) is buzzing or muted before moving to the next chord.",
              descriptionUk:
                "Чотири найлегші форми для початківців. Вчіть по одній: розставте пальці, повільно програйте кожну струну окремо й визначте, яка саме струна (якщо є) деренчить чи приглушена, перш ніж переходити до наступного акорду.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "String names (E A D G B E)",
              titleUk: "Назви струн (E A D G B E)",
              description:
                "Memorize the 6 string names from lowest/thickest to highest/thinnest. This is the foundation everything else — chord diagrams, tuning, note names — is built on top of.",
              descriptionUk:
                "Запам'ятайте назви 6 струн від найнижчої/найтовщої до найвищої/найтоншої. Це основа, на якій будується все інше — акордові діаграми, налаштування, назви нот.",
              longDescription:
                "From the thickest string (closest to your chin/ceiling when playing) to the thinnest, the six strings are E-A-D-G-B-E. A common memory trick is a sentence where each word starts with the string name in order, e.g. 'Eddie Ate Dynamite, Good Bye Eddie' — silly on purpose, because silly sentences stick better than a plain list.\n\nNotice the first and last string are both named E, two octaves apart — that's not a coincidence or error, standard guitar tuning is specifically built so the lowest and highest strings share a note name, which becomes useful later when you start finding the same note in multiple places on the neck.\n\nEvery chord diagram you'll read from here on assumes you already know which string is which without thinking about it, so this is worth drilling as pure memorization before anything else — point to a string, say its name, check yourself against a tuner or a reference chart.",
              longDescriptionUk:
                "Від найтовщої струни (найближчої до підборіддя/стелі під час гри) до найтоншої: шість струн — E-A-D-G-B-E. Поширений спосіб запам'ятати — речення, де кожне слово починається з назви струни по порядку, наприклад «Eddie Ate Dynamite, Good Bye Eddie» — навмисно кумедне, бо кумедні речення запам'ятовуються краще за звичайний список.\n\nЗверніть увагу, що перша й остання струни обидві мають назву E, на дві октави одна від одної — це не збіг чи помилка: стандартне налаштування гітари спеціально влаштоване так, щоб найнижча й найвища струни мали спільну назву ноти, що стане корисним пізніше, коли ви почнете знаходити ту саму ноту в кількох місцях на грифі.\n\nКожна акордова діаграма, яку ви читатимете надалі, передбачає, що ви вже знаєте, яка струна є якою, не замислюючись. Тому варто відпрацювати це як чисте запам'ятовування перед усім іншим — вкажіть на струну, назвіть її, перевірте себе за тюнером чи довідковою таблицею.",
            },
            {
              title: "Reading a chord diagram",
              titleUk: "Читання акордової діаграми",
              description:
                "Vertical lines are strings, horizontal lines are frets, dots show where fingers go, an 'X' means don't play that string, and an 'O' means play it open (no finger). This is the map for every chord you'll ever learn.",
              descriptionUk:
                "Вертикальні лінії — це струни, горизонтальні — лади, крапки показують, де розташувати пальці, «X» означає не грати цю струну, а «O» означає грати її відкритою (без пальця). Це карта для кожного акорду, який ви колись вивчите.",
              longDescription:
                "A chord diagram is drawn as if the guitar is standing upright in front of you, neck pointing up: the vertical lines represent the 6 strings (thickest on the left, thinnest on the right), and the horizontal lines represent frets, with the thick top line representing the nut (the very top of the neck, before fret 1).\n\nA filled-in dot on the grid tells you exactly which string and which fret to press with a finger — dots are often numbered 1-4 to indicate which finger (index=1, middle=2, ring=3, pinky=4) to use, though beginner diagrams sometimes leave that to you. An 'X' above a string means don't strum that string at all; an 'O' means strum it without pressing anything down (it rings 'open').\n\nOnce you can look at a new chord diagram you've never seen before and correctly place your fingers without needing it explained in words, you have the one skill that lets you learn any chord from any source — a book, a website, a friend's sketch on a napkin — for the rest of your playing.",
              longDescriptionUk:
                "Акордова діаграма малюється так, ніби гітара стоїть вертикально перед вами, грифом вгору: вертикальні лінії — це 6 струн (найтовща зліва, найтонша справа), а горизонтальні лінії — це лади, причому товста верхня лінія позначає поріжок (самий верх грифа, перед 1-м ладом).\n\nЗафарбована крапка на сітці точно вказує, яку струну й на якому ладу притиснути пальцем — крапки часто пронумеровані 1-4, щоб позначити, який палець (вказівний=1, середній=2, безіменний=3, мізинець=4) використати, хоча діаграми для початківців інколи залишають це на ваш розсуд. «X» над струною означає взагалі не грати цю струну; «O» означає грати її, нічого не притискаючи (звучить «відкрито»).\n\nЩойно ви зможете подивитись на нову, ще не бачену акордову діаграму й правильно розставити пальці без словесних пояснень, ви матимете ту єдину навичку, яка дозволяє вивчити будь-який акорд з будь-якого джерела — книги, сайту, начерку друга на серветці — до кінця вашої гри.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 10,
          items: [
            {
              title: "Switch between two chords slowly with a metronome",
              titleUk: "Повільно переходьте між двома акордами під метроном",
              description:
                "Pick two chords (e.g., Em to Am) and, at a very slow tempo, change between them on every click, checking each time that every string still rings clean before speeding up even slightly.",
              descriptionUk:
                "Оберіть два акорди (наприклад, Em на Am) і в дуже повільному темпі змінюйте їх на кожен клік метронома, щоразу перевіряючи, що кожна струна досі звучить чисто, перш ніж хоч трохи прискорюватись.",
            },
            {
              title: "Strum a single chord in steady quarter notes",
              titleUk: "Грайте один акорд рівними чвертними тривалостями",
              description:
                "Pick one chord you know and strum it in steady, even downstrokes for a full minute without stopping. The goal is rhythmic consistency, not the chord itself.",
              descriptionUk:
                "Оберіть один знайомий акорд і грайте його рівними, стабільними ударами вниз протягом цілої хвилини без зупинки. Мета — ритмічна стабільність, а не сам акорд.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Matching pitch",
              titleUk: "Відтворення висоти звуку голосом",
              description:
                "Play a single note and try to sing it back. The goal at this stage is just noticing whether your voice is matching the pitch at all — accuracy improves naturally with repetition.",
              descriptionUk:
                "Зіграйте одну ноту й спробуйте проспівати її. Мета на цьому етапі — просто помічати, чи голос взагалі потрапляє в потрібну висоту звуку — точність природно покращується з повторенням.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "First Songs and Rhythm",
      titleUk: "Перші пісні та ритм",
      goal: "Play through a full simple song with steady rhythm and confident chord changes.",
      goalUk: "Зіграти повну просту пісню зі стабільним ритмом та впевненими змінами акордів.",
      durationLabel: "Months 4-6",
      milestone:
        "Playing a complete simple 3-4 chord song start to finish without stopping, with steady strumming throughout, means the chord changes have become automatic enough that you can focus on rhythm and the song as a whole instead of individual finger placements.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Basic strumming pattern (down-down-up-up-down-up)",
              titleUk: "Базовий патерн бою (вниз-вниз-вгору-вгору-вниз-вгору)",
              description:
                "The classic beginner strum pattern. Practice the arm motion alone first, without even touching the strings, so the up-down rhythm becomes physical habit before you add chords on top.",
              descriptionUk:
                "Класичний бій для початківців. Спочатку тренуйте сам рух руки, навіть не торкаючись струн, щоб ритм вниз-вгору став фізичною звичкою, перш ніж додавати акорди.",
            },
            {
              title: "Adding G7, D, and Am7 chords",
              titleUk: "Додавання акордів G7, D та Am7",
              description:
                "Three more common beginner chords that unlock a much wider range of songs when combined with the four from Phase 1.",
              descriptionUk:
                "Ще три поширені акорди для початківців, які відкривають значно ширший вибір пісень у поєднанні з чотирма акордами з Етапу 1.",
            },
            {
              title: "Alternating bass-note strumming",
              titleUk: "Бій з чергуванням басової ноти",
              description:
                "Pick out the chord's root note (its lowest note) before each strum instead of hitting all the strings every time. A common folk/country pattern that adds movement to a simple chord progression.",
              descriptionUk:
                "Виокремлюйте основну ноту акорду (найнижчу ноту) перед кожним боєм замість того, щоб щоразу зачіпати всі струни. Поширений фолк/кантрі-патерн, що додає руху простій акордовій послідовності.",
            },
            {
              title: "Basic string muting for clean strums",
              titleUk: "Базове приглушення струн для чистого бою",
              description:
                "Lightly rest an unused finger against strings you're not supposed to be playing, so a slightly-off strum doesn't ring out an unwanted note.",
              descriptionUk:
                "Легко покладіть незадіяний палець на струни, які не мають звучати, щоб трохи неточний удар не викликав небажаної ноти.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Note names on the low E and A strings",
              titleUk: "Назви нот на струнах E та A",
              description:
                "Naming the natural notes (no sharps/flats yet) up to the 5th fret on the two lowest strings. The first step toward eventually knowing the whole fretboard.",
              descriptionUk:
                "Назви натуральних нот (поки без дієзів/бемолів) до 5-го лада на двох найнижчих струнах. Перший крок до знання всього грифа в майбутньому.",
              longDescription:
                "Starting from the open low E string, moving up one fret at a time gives you F (1st fret), F# (2nd), G (3rd), G# (4th), A (5th) — but for now, focus only on the natural (non-sharp) notes: E-open, F, G (3rd fret), A (5th fret), skipping the sharps for the moment. Do the same on the A string: A-open, B (2nd fret), C (3rd fret), D (5th fret).\n\nThe fastest way to learn this isn't staring at a chart — it's picking a random natural note name, physically finding it on the low E string, saying it out loud, and checking yourself, repeating until you stop hesitating. Then repeat the whole process on the A string.\n\nThis matters beyond trivia: once you know where the natural notes sit on these two strings, you can name the root of any chord shape you're playing there, which is the beginning of understanding what a chord actually is rather than just memorizing shapes.",
              longDescriptionUk:
                "Починаючи з відкритої нижньої струни E, рухаючись на один лад за раз, отримуємо F (1-й лад), F# (2-й), G (3-й), G# (4-й), A (5-й) — але наразі зосередьтесь лише на натуральних (без дієзів) нотах: E-відкрита, F, G (3-й лад), A (5-й лад), поки пропускаючи дієзи. Зробіть те саме на струні A: A-відкрита, B (2-й лад), C (3-й лад), D (5-й лад).\n\nНайшвидший спосіб вивчити це — не витріщатись на таблицю, а вибрати випадкову назву натуральної ноти, фізично знайти її на струні E, назвати вголос і перевірити себе, повторюючи, поки не зникнуть вагання. Потім повторіть весь процес на струні A.\n\nЦе важливо не лише як факт: щойно ви знатимете, де на цих двох струнах лежать натуральні ноти, ви зможете назвати основний тон будь-якої форми акорду, яку граєте там — це початок розуміння того, що таке акорд насправді, а не лише завчання форм.",
            },
            {
              title: "What a capo does",
              titleUk: "Що робить капо",
              description:
                "A capo clamps across the neck and shortens the strings, raising the pitch of every open string by a fixed amount while letting you keep using the same familiar chord shapes.",
              descriptionUk:
                "Капо затискає гриф і вкорочує струни, підвищуючи висоту звуку кожної відкритої струни на фіксовану величину, дозволяючи продовжувати використовувати ті самі знайомі форми акордів.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 10,
          items: [
            {
              title: "Play a complete simple song start to finish",
              titleUk: "Зіграйте повну просту пісню від початку до кінця",
              description:
                "Pick a well-known 3-4 chord song and play all the way through without stopping to fix a mistake, even if a chord change is a little late — finishing matters more than perfection here.",
              descriptionUk:
                "Оберіть відому пісню на 3-4 акорди і зіграйте її повністю, не зупиняючись, щоб виправити помилку, навіть якщо зміна акорду трохи запізнилась — тут важливіше дограти до кінця, ніж ідеальність.",
            },
            {
              title: "Practice changing chords exactly on the beat",
              titleUk: "Тренуйте зміну акордів точно на долю",
              description:
                "Using a metronome, deliberately land the new chord shape exactly on beat 1 of the next measure, rather than changing a little early or late and adjusting afterward.",
              descriptionUk:
                "Під метроном свідомо потрапляйте новою формою акорду точно на першу долю наступного такту, замість того щоб змінювати трохи раніше чи пізніше й підлаштовуватись потім.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "High vs low",
              titleUk: "Вище чи нижче",
              description:
                "Play two notes and identify whether the second one is higher or lower than the first, without looking at the fretboard.",
              descriptionUk:
                "Зіграйте дві ноти й визначте, чи друга вища, чи нижча за першу, не дивлячись на гриф.",
            },
            {
              title: "Same vs different",
              titleUk: "Однакова чи різна",
              description:
                "Play two notes, one right after the other, and identify whether they're the exact same pitch or two different pitches — the most basic building block of all later interval training.",
              descriptionUk:
                "Зіграйте дві ноти одну за одною й визначте, чи це та сама висота звуку, чи дві різні — найбазовіша складова всього подальшого тренування інтервалів.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Track chord-change speed, not just BPM",
              titleUk: "Відстежуйте швидкість зміни акордів, а не лише уд/хв",
              description:
                "At this stage, 'progress' often means how many seconds a chord change takes, not raw tempo. Note it down (e.g., 'Em to Am: 2 seconds → 1 second over 4 weeks') so improvement is visible.",
              descriptionUk:
                "На цьому етапі «прогрес» часто означає, скільки секунд займає зміна акорду, а не сам темп. Записуйте це (наприклад, «Em на Am: 2 секунди → 1 секунда за 4 тижні»), щоб покращення було видимим.",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Especially early on, this log is what shows you real progress on days that otherwise feel like 'nothing changed.'",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Особливо на початку саме цей щоденник показує реальний прогрес у дні, які інакше здаються «нічого не змінилося».",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay a chord or exercise from an earlier week without warming up on it first. If it's shaky, that's useful information — the skill needs occasional maintenance reps.",
              descriptionUk:
                "Раз на кілька тижнів переграйте акорд чи вправу з попереднього тижня без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Learn at least one real song per month",
              titleUk: "Вивчайте щонайменше одну реальну пісню на місяць",
              description:
                "Pick a song using chords you already know, even a partial or simplified version. Real songs are what keep motivation alive between the more repetitive technical drills.",
              descriptionUk:
                "Оберіть пісню на знайомі вам акорди, навіть часткову чи спрощену версію. Реальні пісні підтримують мотивацію між більш повторюваними технічними вправами.",
            },
          ],
        },
      ],
    },
  ],
};

const beginnerPianoPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "piano", name: "Piano", nameUk: "Фортепіано" },
  plan: {
    title: "Beginner Piano Practice Plan",
    titleUk: "План практики гри на фортепіано для початківців",
    description:
      "For complete beginners, 6-month plan building hand position, five-finger reading, and first chords from zero, ~20-30 min/day. Graduate into the Long-Term Piano Practice Plan afterward.",
    descriptionUk:
      "Для абсолютних початківців, 6-місячний план, що з нуля розвиває положення рук, читання в п'ятипальцевій позиції та перші акорди, ~20-30 хв/день. Після завершення переходьте до Довгострокового плану практики гри на фортепіано.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Absolute Basics",
      titleUk: "Абсолютні основи",
      goal: "Build comfortable hand position and play simple 5-finger patterns with both hands.",
      goalUk: "Розвинути зручне положення рук і грати прості п'ятипальцеві патерни обома руками.",
      durationLabel: "Months 1-3",
      milestone:
        "Playing a simple 5-note melody with the right hand while the left hand holds a steady single note underneath, without stopping, means both hands can act independently instead of one dragging the other off tempo.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Sitting posture and hand shape",
              titleUk: "Постава під час гри та форма руки",
              description:
                "Sit so your forearms are roughly level with the keys, and shape each hand as if gently holding a small ball — curved fingers, relaxed wrist, no flat or collapsed fingers pressing the keys.",
              descriptionUk:
                "Сідайте так, щоб передпліччя були приблизно на рівні клавіш, і формуйте кожну руку так, ніби ніжно тримаєте маленький м'ячик — округлені пальці, розслаблене зап'ястя, без пласких чи провалених пальців на клавішах.",
            },
            {
              title: "Five-finger position (C position)",
              titleUk: "П'ятипальцева позиція (позиція До)",
              description:
                "Place the right hand's fingers 1-5 on C-D-E-F-G (thumb on C) and play each finger individually, one note at a time, listening for even volume between fingers.",
              descriptionUk:
                "Розташуйте пальці 1-5 правої руки на C-D-E-F-G (великий палець на C) і грайте кожним пальцем окремо, по одній ноті, прислухаючись до рівної гучності між пальцями.",
            },
            {
              title: "Basic finger independence drills",
              titleUk: "Базові вправи на незалежність пальців",
              description:
                "Simple repeated 5-finger patterns (a very simplified Hanon-style drill) at a slow, steady tempo, hands separately. The goal is evenness, not speed.",
              descriptionUk:
                "Прості повторювані п'ятипальцеві патерни (дуже спрощена вправа у стилі Ганона) у повільному, стабільному темпі, руки окремо. Мета — рівність, а не швидкість.",
            },
            {
              title: "Reading basic rhythm (quarter/half/whole notes)",
              titleUk: "Читання базового ритму (чвертні/половинні/цілі ноти)",
              description:
                "Clap and count simple rhythms out loud before playing them on the keys, so the timing is understood separately from the added challenge of finding the right notes.",
              descriptionUk:
                "Проплескуйте і рахуйте вголос прості ритми, перш ніж грати їх на клавішах, щоб ритміка засвоювалась окремо від додаткового виклику пошуку правильних нот.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Note names on the staff (C position)",
              titleUk: "Назви нот на нотному стані (позиція До)",
              description:
                "Learn to name the 5 notes of C position (C-D-E-F-G) as they appear on the treble staff, connecting what you see on the page to what you play under your right hand.",
              descriptionUk:
                "Навчіться називати 5 нот позиції До (C-D-E-F-G), як вони виглядають на нотному стані в скрипковому ключі, пов'язуючи те, що бачите на сторінці, з тим, що граєте правою рукою.",
              longDescription:
                "The treble staff has 5 lines and 4 spaces, and in C position, middle C sits just below the staff on a short 'ledger line.' From there, D-E-F-G climb line-space-line-space up into the staff. A common way to internalize this quickly is landmark reading rather than counting every line from scratch each time: recognize G as 'the note sitting on the 2nd line from the bottom' at a glance, rather than counting up from middle C every single time you see it.\n\nPractice this away from the piano at first — look at a note on the page, name it out loud, then check yourself against a reference chart — before combining it with actually finding the note under your fingers. Separating 'can I read it' from 'can I play it' early on makes both skills easier to build cleanly, rather than tangling reading mistakes with finger mistakes.\n\nOnce these 5 notes are automatic, expanding beyond C position later (in Phase 2 and into the intermediate plan) is just adding more landmarks to a system you already trust, rather than learning to read from scratch again.",
              longDescriptionUk:
                "Нотний стан у скрипковому ключі має 5 ліній і 4 проміжки, і в позиції До нота До першої октави лежить трохи нижче стану на короткій «додатковій лінійці». Звідти D-E-F-G піднімаються лінія-проміжок-лінія-проміжок у сам нотний стан. Поширений спосіб швидко засвоїти це — читання за орієнтирами замість підрахунку кожної лінії щоразу заново: розпізнавайте G як «ноту на 2-й лінії знизу» з першого погляду, а не рахуйте вгору від До щоразу, коли її бачите.\n\nСпочатку тренуйте це без фортепіано — погляньте на ноту на сторінці, назвіть її вголос, потім перевірте себе за довідковою таблицею — перш ніж поєднувати це з реальним пошуком ноти під пальцями. Розділення «чи можу я це прочитати» і «чи можу я це зіграти» на початку робить обидві навички простішими для чистого засвоєння, замість плутанини помилок читання з помилками пальців.\n\nЩойно ці 5 нот стануть автоматичними, розширення за межі позиції До пізніше (в Етапі 2 та в проміжному плані) — це просто додавання нових орієнтирів до вже надійної системи, а не навчання читання з нуля знову.",
            },
            {
              title: "Finding C on the keyboard",
              titleUk: "Знаходження ноти До на клавіатурі",
              description:
                "Every C on the keyboard sits directly to the left of a group of 2 black keys (not 3). This landmark is how you'll find your starting position without counting white keys one by one.",
              descriptionUk:
                "Кожна нота До на клавіатурі лежить одразу зліва від групи з 2 чорних клавіш (не 3). Цей орієнтир допоможе знаходити стартову позицію, не рахуючи білі клавіші одну за одною.",
              longDescription:
                "The black keys on a piano are grouped in alternating sets of 2 and 3 across the whole keyboard. C is always the white key immediately to the left of a group of 2 black keys — this pattern repeats identically in every octave, so once you can spot it once, you can spot it anywhere on the keyboard.\n\nMiddle C specifically is the C nearest the center of the keyboard, roughly aligned with the manufacturer's logo on most instruments — a useful secondary landmark when you're first getting oriented. From middle C, C position simply continues up the next 4 white keys: D, E, F, G.\n\nThis 'group of 2 vs group of 3 black keys' landmark is also what you'll eventually use to find every other note letter (D sits between the two black keys in a group of 2, F sits immediately left of the group of 3, and so on) — so it's worth over-practicing now rather than treating it as a one-time fact.",
              longDescriptionUk:
                "Чорні клавіші на фортепіано згруповані у клавіатурі, що чергуються групами по 2 та 3. До завжди є білою клавішею одразу зліва від групи з 2 чорних клавіш — цей патерн однаково повторюється в кожній октаві, тож щойно ви зможете розпізнати його один раз, зможете розпізнати його будь-де на клавіатурі.\n\nСаме нота До першої октави — це До, найближча до центру клавіатури, приблизно на рівні логотипу виробника на більшості інструментів — корисний додатковий орієнтир, коли ви щойно орієнтуєтесь. Від До першої октави позиція До просто продовжується наступними 4 білими клавішами: D, E, F, G.\n\nЦей орієнтир «група з 2 чи 3 чорних клавіш» ви також зрештою використовуватимете для знаходження кожної іншої літери ноти (D лежить між двома чорними клавішами групи з 2, F лежить одразу зліва від групи з 3, і так далі) — тож варто відпрацювати це зараз ретельніше, а не сприймати як одноразовий факт.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 10,
          items: [
            {
              title: "Play a simple 5-note melody hands separately",
              titleUk: "Зіграйте просту 5-нотну мелодію руками окремо",
              description:
                "Using only the 5 notes of C position, play a simple melody with the right hand, then the same or a simpler version with the left hand, focusing on even timing between notes.",
              descriptionUk:
                "Використовуючи лише 5 нот позиції До, зіграйте просту мелодію правою рукою, потім ту саму чи спрощену версію лівою, зосереджуючись на рівномірному ритмі між нотами.",
            },
            {
              title: "Hold a steady left-hand note under a right-hand melody",
              titleUk: "Тримайте стабільну ноту лівою рукою під мелодію правої",
              description:
                "Play a simple right-hand melody while the left hand holds a single low note (the root) steady underneath — the simplest possible form of two-hand independence.",
              descriptionUk:
                "Грайте просту мелодію правою рукою, поки ліва тримає одну стабільну низьку ноту (основний тон) знизу — найпростіша можлива форма незалежності обох рук.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Matching pitch",
              titleUk: "Відтворення висоти звуку голосом",
              description:
                "Play a single note and try to sing it back. The goal at this stage is just noticing whether your voice is matching the pitch at all — accuracy improves naturally with repetition.",
              descriptionUk:
                "Зіграйте одну ноту й спробуйте проспівати її. Мета на цьому етапі — просто помічати, чи голос взагалі потрапляє в потрібну висоту звуку — точність природно покращується з повторенням.",
            },
            {
              title: "High vs low",
              titleUk: "Вище чи нижче",
              description:
                "Play two notes and identify whether the second one is higher or lower than the first, without looking at the keyboard.",
              descriptionUk:
                "Зіграйте дві ноти й визначте, чи друга вища, чи нижча за першу, не дивлячись на клавіатуру.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "First Pieces and Basic Chords",
      titleUk: "Перші твори та базові акорди",
      goal: "Play a simple piece hands together and recognize/play basic major triads.",
      goalUk: "Зіграти простий твір руками разом та розпізнавати/грати базові мажорні тризвуки.",
      durationLabel: "Months 4-6",
      milestone:
        "Playing a simple hands-together piece start to finish at a steady tempo without stopping, and building C, F, and G major triads from memory, means both the coordination and the basic chord vocabulary have become reliable enough to build on in the intermediate plan.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Hands-together coordination at slow tempo",
              titleUk: "Координація рук разом у повільному темпі",
              description:
                "Take a simple beginner piece, learn each hand separately until it's solid, then combine them at a tempo slow enough that nothing falls apart.",
              descriptionUk:
                "Візьміть простий твір для початківців, вивчіть кожну руку окремо, доки вона не звучить впевнено, потім поєднайте їх у темпі, достатньо повільному, щоб нічого не «розсипалось».",
            },
            {
              title: "Basic major triad shapes (C, F, G)",
              titleUk: "Базові форми мажорних тризвуків (C, F, G)",
              description:
                "Playing simple root-position block chords under the hand. These three chords alone are enough to accompany a huge number of simple songs.",
              descriptionUk:
                "Грайте прості блокові акорди в основному положенні під рукою. Уже цих трьох акордів достатньо, щоб супроводжувати величезну кількість простих пісень.",
            },
            {
              title: "Simple sustain pedal introduction (optional)",
              titleUk: "Просте знайомство з педаллю сустейну (опційно)",
              description:
                "Practice pressing the pedal down right after a note is played (not before) and releasing it cleanly between phrases, so notes connect smoothly without blurring together.",
              descriptionUk:
                "Тренуйтесь натискати педаль одразу після взяття ноти (не раніше) і чисто відпускати її між фразами, щоб ноти плавно з'єднувались, не змішуючись.",
            },
            {
              title: "Crossing the thumb under (basic scale prep)",
              titleUk: "Підкладання великого пальця (підготовка до гами)",
              description:
                "The first step toward playing a full scale later: practice smoothly tucking the thumb under the hand to continue past the 5-finger position without a break in sound.",
              descriptionUk:
                "Перший крок до гри повної гами пізніше: тренуйте плавне підкладання великого пальця під руку, щоб продовжити рух за межі п'ятипальцевої позиції без розриву звучання.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Whole steps and half steps on the keyboard",
              titleUk: "Цілі та півтони на клавіатурі",
              description:
                "A half step is the very next key (black or white), a whole step skips one key. This single idea is the building block for every scale and interval you'll learn from here on.",
              descriptionUk:
                "Півтон — це наступна клавіша поспіль (чорна чи біла), цілий тон пропускає одну клавішу. Ця єдина ідея є будівельним блоком для кожної гами та інтервалу, які ви вивчатимете надалі.",
              longDescription:
                "A half step is the distance from any key to the very next key, counting both black and white — E to F is a half step (no black key between them), and so is B to C. A whole step skips exactly one key — C to D is a whole step, because there's a black key (C#) in between that gets skipped over.\n\nThe easiest way to feel this rather than just know it: play any two adjacent keys (black or white, doesn't matter) and that's always a half step, no exceptions. Then practice picking a starting note and moving 'up a whole step' or 'up a half step' on command, checking yourself against the keyboard each time.\n\nThis is deliberately introduced before formal scale-building, because the major scale you'll learn in the intermediate plan is nothing more than a specific pattern of these two step sizes (whole-whole-half-whole-whole-whole-half) applied in order — understanding whole/half steps solidly now means that formula will make immediate sense later instead of being one more thing to memorize blind.",
              longDescriptionUk:
                "Півтон — це відстань від будь-якої клавіші до наступної поспіль, рахуючи і чорні, і білі — E до F є півтоном (між ними немає чорної клавіші), так само як B до C. Цілий тон пропускає рівно одну клавішу — C до D є цілим тоном, бо між ними є чорна клавіша (C#), яка пропускається.\n\nНайлегший спосіб відчути це, а не просто знати: зіграйте будь-які дві сусідні клавіші (чорну чи білу, байдуже) — це завжди півтон, без винятків. Потім тренуйтесь обирати початкову ноту й рухатись «на цілий тон вгору» чи «на півтон вгору» за командою, щоразу перевіряючи себе на клавіатурі.\n\nЦе свідомо вводиться до формального вивчення побудови гам, бо мажорна гама, яку ви вивчите в проміжному плані — це не що інше, як конкретний патерн цих двох розмірів кроку (тон-тон-півтон-тон-тон-тон-півтон), застосований по порядку — міцне розуміння цілих/півтонів зараз означає, що ця формула одразу матиме сенс пізніше, замість того щоб бути ще однією річчю для сліпого завчання.",
            },
            {
              title: "Major vs minor by feel (bright vs dark)",
              titleUk: "Мажор проти мінору на відчуття (яскраво проти темно)",
              description:
                "Before any formal chord-construction theory, just notice that some chords sound 'bright/happy' (major) and others sound 'dark/sad' (minor). This intuitive ear-first framing makes the formal theory click faster later.",
              descriptionUk:
                "Перш ніж перейти до формальної теорії побудови акордів, просто помітьте, що одні акорди звучать «яскраво/весело» (мажор), а інші — «темно/сумно» (мінор). Це інтуїтивне, орієнтоване на слух сприйняття робить формальну теорію зрозумілішою пізніше.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 10,
          items: [
            {
              title: "Play a simple piece hands together",
              titleUk: "Зіграйте простий твір руками разом",
              description:
                "Pick a simple beginner piece and play it start to finish at a steady tempo without stopping, even if a note is occasionally slightly late.",
              descriptionUk:
                "Оберіть простий твір для початківців і зіграйте його від початку до кінця у стабільному темпі, не зупиняючись, навіть якщо якась нота часом трохи запізнюється.",
            },
            {
              title: "Play I-IV-V (C-F-G) block chords in steady rhythm",
              titleUk: "Грайте блокові акорди I-IV-V (C-F-G) у стабільному ритмі",
              description:
                "Play the three chords in steady quarter notes, either alone or underneath a simple right-hand melody, to start connecting chord shapes to actual rhythm and time.",
              descriptionUk:
                "Грайте три акорди рівними чвертними тривалостями, або окремо, або під простою мелодією правої руки, щоб почати пов'язувати форми акордів із реальним ритмом і часом.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Major vs minor by ear (bright vs dark)",
              titleUk: "Мажор проти мінору на слух (яскраво проти темно)",
              description:
                "Play a major and a minor chord back to back on the same root and try to name which is which using only the bright/dark feeling, before formal triad-construction theory in the intermediate plan.",
              descriptionUk:
                "Зіграйте мажорний і мінорний акорд підряд від одного основного тону й спробуйте назвати, який є яким, лише за відчуттям яскравого/темного, перш ніж формальна теорія побудови тризвуків у проміжному плані.",
            },
            {
              title: "Same vs different",
              titleUk: "Однакова чи різна",
              description:
                "Play two notes, one right after the other, and identify whether they're the exact same pitch or two different pitches — the most basic building block of all later interval training.",
              descriptionUk:
                "Зіграйте дві ноти одну за одною й визначте, чи це та сама висота звуку, чи дві різні — найбазовіша складова всього подальшого тренування інтервалів.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Track tempo per piece, not just overall speed",
              titleUk: "Відстежуйте темп для кожного твору окремо, а не лише загальну швидкість",
              description:
                "Note the metronome tempo you can play a specific piece or exercise cleanly at, and revisit it every couple of weeks (e.g., '5-finger pattern: 60 BPM → 80 BPM over 4 weeks') so progress is measurable.",
              descriptionUk:
                "Записуйте темп метронома, за якого ви чисто граєте конкретний твір чи вправу, і переглядайте його раз на кілька тижнів (наприклад, «п'ятипальцевий патерн: 60 → 80 уд/хв за 4 тижні»), щоб прогрес був вимірюваним.",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Especially early on, this log is what shows you real progress on days that otherwise feel like 'nothing changed.'",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Особливо на початку саме цей щоденник показує реальний прогрес у дні, які інакше здаються «нічого не змінилося».",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay a piece or exercise from an earlier week without warming up on it first. If it's shaky, that's useful information — the skill needs occasional maintenance reps.",
              descriptionUk:
                "Раз на кілька тижнів переграйте твір чи вправу з попереднього тижня без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Learn at least one real piece per month",
              titleUk: "Вивчайте щонайменше один реальний твір на місяць",
              description:
                "Pick a simple, well-known piece within reach of your current skill, even a partial or simplified version. Real music is what keeps motivation alive between the more repetitive technical drills.",
              descriptionUk:
                "Оберіть простий, відомий твір, доступний вашому поточному рівню, навіть часткову чи спрощену версію. Реальна музика підтримує мотивацію між більш повторюваними технічними вправами.",
            },
          ],
        },
      ],
    },
  ],
};

const bassPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "bass", name: "Bass Guitar", nameUk: "Бас-гітара" },
  plan: {
    title: "Long-Term Bass Guitar Practice Plan",
    titleUk: "Довгостроковий план практики гри на бас-гітарі",
    description:
      "Intermediate-level, 12-month plan focused on groove, walking bass, and harmony, ~30-45 min/day.",
    descriptionUk:
      "12-місячний план середнього рівня, зосереджений на грувах, walking-бас лінії та гармонії, ~30-45 хв/день.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Foundations of the Fretboard and Groove",
      titleUk: "Основи грифа та грува",
      goal: "Know the neck cold and lock in with a metronome before adding any musical decisions.",
      goalUk: "Знати гриф напам'ять і чітко триматися метроному, перш ніж додавати музичні рішення.",
      durationLabel: "Months 1-3",
      milestone:
        "Naming any note on the E, A, D, and G strings in under 2 seconds means drilling the natural notes on each string individually until it's reflexive. Playing a steady root-note groove along with a drum-machine backing track for a full 4 minutes without drifting off tempo means your time-feel no longer depends on watching the metronome.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "One-finger-per-fret chromatic warm-ups",
              titleUk: "Хроматична розминка «один палець на лад»",
              description:
                "Play 1-2-3-4 (one finger per fret) across all four strings, ascending and descending, then shift up a fret and repeat. Builds fretting-hand independence and synchronization between the hands with almost no musical decision-making required.",
              descriptionUk:
                "Грайте 1-2-3-4 (один палець на лад) на всіх чотирьох струнах, вгору і вниз, потім зсуньтесь на лад вище і повторіть. Розвиває незалежність пальців лівої руки та синхронізацію обох рук, майже не вимагаючи музичних рішень.",
            },
            {
              title: "Alternating index-middle plucking",
              titleUk: "Почергове щипання вказівним і середнім пальцями",
              description:
                "Pluck strictly alternating between the index and middle fingers of the plucking hand, even across string changes. This is the right-hand equivalent of alternate picking on guitar and is what makes fast, even groove lines possible later on.",
              descriptionUk:
                "Щипайте струни строго почергово вказівним і середнім пальцями правої руки, навіть при переходах між струнами. Це аналог перемінного медіатора на гітарі для правої руки, і саме це в подальшому уможливлює швидкі, рівні грувові лінії.",
            },
            {
              title: "Muting technique, both hands",
              titleUk: "Техніка приглушення обома руками",
              description:
                "Bass tone lives and dies on the silence between notes: use unused fretting fingers to lightly touch adjacent strings, and let the plucking hand's palm rest lightly against the strings near the bridge. A clean bass line is defined as much by what doesn't ring as by what does.",
              descriptionUk:
                "Тон бас-гітари значною мірою визначається тишею між нотами: використовуйте незадіяні пальці лівої руки, щоб злегка торкатися сусідніх струн, і злегка притуляйте долоню правої руки до струн біля бриджа. Чиста баслінія визначається настільки ж тим, що не звучить, як і тим, що звучить.",
            },
            {
              title: "Movable scale box patterns across the neck",
              titleUk: "Рухомі «блокові» патерни гами по грифу",
              description:
                "Learn one movable major-scale box shape and slide it to different frets to play the same scale in every key. Covers the fretboard efficiently and is the standard shape vocabulary that later groove and walking-bass lines draw from.",
              descriptionUk:
                "Вивчіть одну рухому «блокову» форму мажорної гами та пересувайте її на різні лади, щоб грати ту саму гаму в будь-якій тональності. Це ефективно охоплює гриф і стає стандартною основою форм, з якої пізніше формуються грувові та walking-бас лінії.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Reading the fretboard: natural notes on all 4 strings",
              titleUk: "Читання грифа: натуральні ноти на всіх 4 струнах",
              description:
                "Drill the natural notes (no sharps/flats yet) on the E, A, D, and G strings individually, up to the 12th fret, until you can name any one instantly. This is the single most load-bearing skill for reading a chart at sight.",
              descriptionUk:
                "Відпрацюйте натуральні ноти (поки без дієзів/бемолів) на струнах E, A, D і G окремо, до 12-го ладу, доки не зможете миттєво назвати будь-яку з них. Це найважливіша навичка для читання чарта з листа.",
              longDescription:
                "A bass guitar's four strings (E-A-D-G, low to high) are tuned in perfect fourths, which means the exact same fingering shape you learn on one string works identically on the next string up, just shifted. That's a huge shortcut compared to a piano keyboard's fixed layout — once you know where the natural notes fall on the low E string (E-open, F-1st fret, G-3rd fret, A-5th fret, B-7th fret, C-8th fret, D-10th fret), the identical fret-pattern repeats on the A, D, and G strings.\n\nThe fastest way to actually own this, rather than just intellectually knowing it, is to pick a random natural note name, physically find it on one string, say it out loud, and check yourself — repeating until there's no hesitation, then moving to the next string. Do this before trying to memorize the whole fretboard as one giant grid; the grid falls into place quickly once each string is solid on its own.\n\nThis matters beyond trivia because nearly everything else in this plan assumes it: naming the root of a chord chart, building a scale from any starting note, and walking a bassline through changing harmony all require knowing, without pausing to calculate, exactly where a given note lives on the string you're already on.",
              longDescriptionUk:
                "Чотири струни бас-гітари (E-A-D-G, від нижчої до вищої) налаштовані на чисту кварту одна від одної, а це означає, що та сама аплікатура, яку ви вивчили на одній струні, працює ідентично і на сусідній струні вище, лише зі зсувом. Це величезна перевага порівняно з фіксованою розкладкою фортепіанної клавіатури — щойно ви знаєте, де лежать натуральні ноти на нижній струні E (E-відкрита, F-1-й лад, G-3-й лад, A-5-й лад, B-7-й лад, C-8-й лад, D-10-й лад), той самий ладовий патерн повторюється на струнах A, D і G.\n\nНайшвидший спосіб дійсно засвоїти це, а не просто знати теоретично — обрати випадкову назву натуральної ноти, фізично знайти її на одній струні, назвати вголос і перевірити себе, повторюючи, доки не зникне вагання, а тоді переходити до наступної струни. Робіть це перед тим, як намагатися запам'ятати весь гриф як одну велику сітку — сітка складається значно швидше, коли кожна струна вже впевнено засвоєна окремо.\n\nЦе важливо не як цікавий факт, а тому, що майже все інше в цьому плані спирається саме на це: називання основного тону з чарта, побудова гами від будь-якої ноти та ведення баслінії крізь змінну гармонію — все це вимагає миттєвого, без підрахунків, знання того, де саме на струні, на якій ви вже граєте, лежить потрібна нота.",
            },
            {
              title: "Major scale construction (W-W-H-W-W-W-H)",
              titleUk: "Побудова мажорної гами (Т-Т-П-Т-Т-Т-П)",
              description:
                "This interval formula is what defines 'major' in any key. Build it from different starting notes on one string only, so the sound of the pattern — not a memorized fingering — becomes what you recognize.",
              descriptionUk:
                "Ця формула інтервалів визначає «мажор» у будь-якій тональності. Будуйте її від різних нот на одній струні, щоб впізнавати саме звучання патерну, а не завчену аплікатуру.",
            },
            {
              title: "Key signatures for all 12 keys",
              titleUk: "Ключові знаки для всіх 12 тональностей",
              description:
                "Memorize which sharps or flats belong to each key, in the order they're added. Lets you look at a chart, name the key immediately, and predict which notes will fit under a bassline without checking each one.",
              descriptionUk:
                "Запам'ятайте, які дієзи чи бемолі належать кожній тональності, у порядку їх додавання. Це дозволяє одразу назвати тональність за чартом і передбачити, які ноти підійдуть до баслінії, не перевіряючи кожну окремо.",
            },
            {
              title: "Root-fifth-octave shapes",
              titleUk: "Форми основний тон-квінта-октава",
              description:
                "The three-note skeleton (root, 5th, octave) underlies the vast majority of bass lines across every genre. Learn its shape starting from each of the 4 strings so it's available no matter where a root falls.",
              descriptionUk:
                "Тризвучний скелет (основний тон, квінта, октава) лежить в основі переважної більшості басліній у будь-якому жанрі. Вивчіть його форму, починаючи від кожної з 4 струн, щоб вона була доступна незалежно від того, де лежить основний тон.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Play the major scale in one key across the neck",
              titleUk: "Зіграйте мажорну гаму в одній тональності по всьому грифу",
              description:
                "Pick one key (e.g., G major) and play the scale ascending/descending starting from each string before moving to a new key. Depth in one key beats shallow exposure to all 12 at this stage.",
              descriptionUk:
                "Оберіть одну тональність (наприклад, соль мажор) і зіграйте гаму вгору/вниз, починаючи з кожної струни, перш ніж переходити до нової тональності. На цьому етапі глибина в одній тональності важливіша за поверхневе знайомство з усіма 12.",
            },
            {
              title: "Play steady roots along with a metronome",
              titleUk: "Грайте стабільні основні тони під метроном",
              description:
                "Pick a simple chord progression and play only the root note of each chord in steady quarter notes against a metronome, starting slow. This is the direct foundation every groove in Phase 2 builds on.",
              descriptionUk:
                "Оберіть просту акордову послідовність і грайте лише основний тон кожного акорду рівними чвертками під метроном, починаючи повільно. Це пряма основа, на якій будується кожен грув в Етапі 2.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Identify root movement by ear",
              titleUk: "Розпізнавайте рух основного тону на слух",
              description:
                "Listen to a simple chord progression and try to sing or name the root note under each chord as it changes, before checking against the chart. This is the single most useful bass-specific ear-training skill there is.",
              descriptionUk:
                "Слухайте просту акордову послідовність і намагайтеся проспівати чи назвати основний тон під кожним акордом при його зміні, перш ніж звірятися з чартом. Це найкорисніша навичка тренування слуху саме для бас-гітариста.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "Groove and Chord Tones",
      titleUk: "Грув та акордові тони",
      goal: "Build basslines from chord tones and lock reliably with the drummer's kick and snare.",
      goalUk: "Будувати баслінії з акордових тонів і надійно триматися разом із бас-барабаном і малим барабаном ударника.",
      durationLabel: "Months 4-6",
      milestone:
        "Given any I-IV-V progression, constructing a root-fifth-octave bassline on the spot, in time, with nothing written out, means you can hear a chord chart and immediately know where your hands go.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Fingerstyle groove patterns",
              titleUk: "Грувові патерни fingerstyle",
              description:
                "Combine root-fifth-octave shapes into steady eighth-note groove patterns, keeping the index-middle alternation consistent through string changes and rests alike.",
              descriptionUk:
                "Поєднуйте форми основний тон-квінта-октава у стабільні грувові патерни вісімками, зберігаючи послідовне чергування вказівного й середнього пальців як при переходах між струнами, так і на паузах.",
            },
            {
              title: "String muting cleanliness during string crossings",
              titleUk: "Чистота приглушення при переходах між струнами",
              description:
                "As a groove moves across strings, the previous string keeps ringing unless actively muted. Practice slowly, listening specifically for unwanted ring from the string you just left.",
              descriptionUk:
                "Коли грув переходить між струнами, попередня струна продовжує звучати, якщо її активно не приглушити. Тренуйтеся повільно, спеціально прислухаючись до небажаного звучання струни, яку щойно залишили.",
            },
            {
              title: "Economy of motion in position shifts",
              titleUk: "Економія руху при зміні позиції",
              description:
                "When a bassline moves to a new position on the neck, identify the shortest path and the finger that leads the shift, instead of resetting your whole hand. Practicing the shift in isolation trains an efficient path.",
              descriptionUk:
                "Коли баслінія переходить у нову позицію на грифі, визначте найкоротший шлях і палець, що веде перехід, замість повного «скидання» всієї руки. Відпрацювання переходу окремо тренує ефективний шлях.",
            },
            {
              title: "Intro to slap technique (thumb strike)",
              titleUk: "Вступ до техніки slap (удар великим пальцем)",
              description:
                "Strike the low E or A string with the side of the thumb, letting it bounce off immediately, on a steady quarter-note pulse. Keep it slow and isolated before combining it with any popping or groove pattern.",
              descriptionUk:
                "Вдаряйте по струні E або A боком великого пальця, одразу відскакуючи, на стабільному пульсі чвертками. Тримайте темп повільним і відпрацьовуйте окремо, перш ніж поєднувати з поппінгом чи грувовим патерном.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Triad construction (major/minor/dim/aug)",
              titleUk: "Побудова тризвуків (мажор/мінор/зменшений/збільшений)",
              description:
                "Every triad is two stacked thirds. Learn to build and name all four qualities from any root by ear and by interval count, since bass lines are built almost entirely from these tones.",
              descriptionUk:
                "Кожен тризвук — це дві накладені терції. Навчіться будувати й називати всі чотири типи тризвуків від будь-якого основного тону на слух і за кількістю півтонів, адже баслінії будуються майже виключно з цих тонів.",
              longDescription:
                "A triad is built by stacking two thirds on top of a root: root, 3rd, 5th. What changes between major, minor, diminished, and augmented is only the size of those two thirds. A major triad stacks a major third (4 semitones) then a minor third (3 semitones) — root-3-5 spelled from C is C-E-G. A minor triad flips the order: minor third then major third — C-Eb-G. A diminished triad stacks two minor thirds (C-Eb-Gb), which is why it sounds unstable — the 5th is flattened, so there's no strong perfect-fifth anchor. An augmented triad stacks two major thirds (C-E-G#), raising the 5th instead.\n\nFor a bass player specifically, the triad is the skeleton that root-fifth-octave lines get 'filled in' with once you're ready to add the 3rd: playing root-3rd-5th-octave over a chord instantly outlines that chord's quality to a listener, even with nothing else playing. That's why hearing the difference between a major and minor third by ear (4 semitones vs. 3) is worth drilling directly — it's the one interval that decides whether a whole chord, and the bassline under it, sounds bright or dark.\n\nPractically: build all four triad qualities starting from the same root (say, C) back to back, on one string where possible, and say the quality out loud as you play each one. That trains the sound of 'major' vs. 'minor' vs. 'diminished' as a category you recognize, not a fingering you've memorized.",
              longDescriptionUk:
                "Тризвук будується накладанням двох терцій на основний тон: основний тон, терція, квінта. Те, що відрізняє мажор, мінор, зменшений і збільшений тризвуки — лише розмір цих двох терцій. Мажорний тризвук накладає велику терцію (4 півтони), потім малу терцію (3 півтони) — основний тон-3-5 від C дає C-E-G. Мінорний тризвук міняє порядок місцями: мала терція, потім велика — C-Eb-G. Зменшений тризвук накладає дві малі терції (C-Eb-Gb), тому й звучить нестабільно — квінта понижена, тож немає міцної опори чистої квінти. Збільшений тризвук накладає дві великі терції (C-E-G#), натомість підвищуючи квінту.\n\nСаме для бас-гітариста тризвук є тим скелетом, який лінії основний тон-квінта-октава «доповнюють», коли ви готові додати терцію: гра основний тон-терція-квінта-октава над акордом миттєво окреслює його якість для слухача, навіть якщо більше нічого не грає. Тому вміння розрізняти на слух велику й малу терцію (4 півтони проти 3) варте окремого відпрацювання — це той самий інтервал, що визначає, чи звучить увесь акорд, а разом із ним і баслінія під ним, світло чи темно.\n\nПрактично: побудуйте всі чотири типи тризвуків від одного й того ж основного тону (наприклад, C) підряд, по можливості на одній струні, і вголос називайте тип, граючи кожен із них. Це тренує саме звучання «мажору», «мінору» чи «зменшеного» як категорії, яку ви впізнаєте, а не аплікатуру, яку завчили.",
            },
            {
              title: "Diatonic chords in a key (I-ii-iii-IV-V-vi-vii°)",
              titleUk: "Діатонічні акорди в тональності (I-ii-iii-IV-V-vi-vii°)",
              description:
                "Every major key produces a fixed sequence of 7 chord qualities built from its own notes: major-minor-minor-major-major-minor-diminished. Knowing this lets you predict a chord chart's harmony before you even see it.",
              descriptionUk:
                "Кожна мажорна тональність утворює фіксовану послідовність із 7 типів акордів, побудованих на власних нотах: мажор-мінор-мінор-мажор-мажор-мінор-зменшений. Знання цього дозволяє передбачити гармонію чарта ще до того, як ви його побачите.",
              longDescription:
                "'Harmonizing the scale' means building a triad on top of every degree of the major scale using only notes already in that key. In C major you get: C major (I), D minor (ii), E minor (iii), F major (IV), G major (V), A minor (vi), B diminished (vii°). That major-minor-minor-major-major-minor-diminished quality pattern is identical in every major key, because it falls directly out of where the scale's two half-steps land.\n\nFor bass, this is the fastest route to predicting a chord chart without deriving each chord's notes from scratch: once you know a song is in G major, you already know ii is A minor, IV is C major, and vi is E minor, before you've even looked at the chart. That lets you spot the root of an upcoming chord early and plan the transition into it, rather than reacting late.\n\nPractice this by picking one key, naming all 7 diatonic chords from memory, then playing just the root of each one in order (I through vii°) as a simple ascending bassline — that single exercise ties the theory directly to what your hands are already doing.",
              longDescriptionUk:
                "«Гармонізація гами» означає побудову тризвука на кожному ступені мажорної гами, використовуючи лише ноти, що вже є в цій тональності. У до мажорі отримуємо: C major (I), D minor (ii), E minor (iii), F major (IV), G major (V), A minor (vi), B diminished (vii°). Цей патерн якостей — мажор-мінор-мінор-мажор-мажор-мінор-зменшений — однаковий у кожній мажорній тональності, оскільки прямо випливає з того, де в гамі лежать два півтони.\n\nДля бас-гітариста це найшвидший спосіб передбачити гармонію чарта, не виводячи ноти кожного акорду з нуля: щойно ви знаєте, що пісня в соль мажорі, ви вже знаєте, що ii — це A minor, IV — C major, а vi — E minor, ще до того, як поглянули на чарт. Це дозволяє заздалегідь помітити основний тон наступного акорду й спланувати перехід до нього, а не реагувати із запізненням.\n\nВідпрацьовуйте це так: оберіть одну тональність, назвіть усі 7 діатонічних акордів напам'ять, а потім зіграйте лише основний тон кожного по порядку (від I до vii°) як просту висхідну баслінію — ця одна вправа напряму пов'язує теорію з тим, що вже роблять ваші руки.",
            },
            {
              title: "Arpeggios: root-3rd-5th-octave patterns",
              titleUk: "Арпеджіо: патерни основний тон-терція-квінта-октава",
              description:
                "The natural next layer on top of root-fifth-octave. Adding the 3rd spells out major or minor quality explicitly, giving a bassline more melodic interest while staying fully inside the chord.",
              descriptionUk:
                "Природний наступний шар поверх основний тон-квінта-октава. Додавання терції явно окреслює мажорну чи мінорну якість, надаючи баслінії більше мелодійного інтересу, залишаючись повністю в межах акорду.",
            },
            {
              title: "Approach notes: chromatic and scale-tone leading",
              titleUk: "Підвідні ноти: хроматичне та гамове підведення",
              description:
                "A single note, one half-step or one scale-step below (or above) the next chord's root, played right before the chord change. Creates forward pull and is the seed of walking bass in Phase 4.",
              descriptionUk:
                "Одна нота, на півтон чи на ступінь гами нижче (або вище) основного тону наступного акорду, зіграна прямо перед зміною акорду. Створює відчуття руху вперед і є зерном walking-баса в Етапі 4.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Build a root-fifth-octave bassline over a I-IV-V progression",
              titleUk: "Побудуйте баслінію основний тон-квінта-октава над послідовністю I-IV-V",
              description:
                "Take a simple I-IV-V progression and construct a groove using only root, 5th, and octave for each chord, keeping a steady rhythmic pattern throughout the changes.",
              descriptionUk:
                "Візьміть просту послідовність I-IV-V і побудуйте грув, використовуючи лише основний тон, квінту й октаву для кожного акорду, зберігаючи стабільний ритмічний патерн протягом усіх змін.",
            },
            {
              title: "Lock to a simple drum groove",
              titleUk: "Тримайтеся разом із простим барабанним грувом",
              description:
                "Play along with a drum-machine or looped drum track, deliberately placing notes with the kick drum. Locking with the kick, not just the click, is what actually makes a bassline feel good in a band.",
              descriptionUk:
                "Грайте разом із драм-машиною чи зацикленим барабанним треком, свідомо розміщуючи ноти разом із бас-барабаном. Саме тримання разом із бас-барабаном, а не лише з метрономом, і робить баслінію по-справжньому «грувовою» в гурті.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Major vs. minor chord quality by ear",
              titleUk: "Мажорна чи мінорна якість акорду на слух",
              description:
                "Listen to isolated triads and identify major vs. minor before checking. This is the single interval-recognition skill (major vs. minor 3rd) that pays off the most across every future harmony topic.",
              descriptionUk:
                "Слухайте окремі тризвуки й визначайте мажор чи мінор, перш ніж перевіряти себе. Це та єдина навичка розпізнавання інтервалу (велика чи мала терція), яка найбільше окупається в усіх подальших темах гармонії.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 3,
      title: "Groove Vocabulary and Modes",
      titleUk: "Грувовий словник та лади",
      goal: "Expand rhythmic vocabulary across styles and connect modal color to specific chord types.",
      goalUk: "Розширити ритмічний словник у різних стилях і пов'язати ладове забарвлення з конкретними типами акордів.",
      durationLabel: "Months 7-9",
      milestone:
        "Playing a convincing 8-bar groove each in straight rock, funk (with ghost notes), and reggae (one-drop feel) styles, back to back, without the feel bleeding between them, means you've internalized rhythmic feel as a deliberate choice, not a default.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Syncopation and ghost notes",
              titleUk: "Синкопа та ghost-ноти",
              description:
                "Ghost notes are muted, rhythmic-only plucks with no clear pitch, used to fill space and push a groove's feel without adding melodic clutter. Isolate them slowly before mixing them into a full pattern.",
              descriptionUk:
                "Ghost-ноти — це приглушені щипки, суто ритмічні, без чіткої висоти звуку, що заповнюють простір і підсилюють відчуття грува, не додаючи мелодійного «шуму». Відпрацьовуйте їх окремо й повільно, перш ніж вплітати у повний патерн.",
            },
            {
              title: "Slap and pop technique",
              titleUk: "Техніка slap і pop",
              description:
                "Combine the thumb-slap from Phase 2 with a popping motion (hooking a higher string with the index or middle finger and snapping it away from the fretboard) to build the classic funk slap-pop groove.",
              descriptionUk:
                "Поєднайте slap великим пальцем з Етапу 2 з рухом pop (зачепіть вищу струну вказівним чи середнім пальцем і різко відпустіть її від грифа), щоб побудувати класичний фанковий груув slap-pop.",
            },
            {
              title: "String skipping and position shifts for fills",
              titleUk: "Пропуск струн та зміна позиції для філів",
              description:
                "Practice short fills that skip a string rather than moving through it, and shift smoothly to a new fretboard position mid-phrase. Fills should interrupt a groove and land back in it, not derail the time.",
              descriptionUk:
                "Тренуйте короткі філи, що пропускають струну, а не проходять через неї, і плавно зміщуйтесь у нову позицію на грифі посеред фрази. Філ має перервати грув і повернутися в нього, а не збити темп.",
            },
            {
              title: "Genre-specific right-hand patterns (funk, reggae, latin)",
              titleUk: "Жанрові патерни правої руки (фанк, реггі, латина)",
              description:
                "Learn one signature pattern per genre: sixteenth-note funk syncopation, reggae's laid-back 'one drop' emphasis, and a basic latin tumbao pattern. Each has a distinct feel worth isolating on its own.",
              descriptionUk:
                "Вивчіть один характерний патерн для кожного жанру: шістнадцяткову синкопу фанку, розслаблений акцент «one drop» реггі та базовий латинський патерн тумбао. Кожен має власне, чітко відмінне відчуття, варте окремого відпрацювання.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "The 7 modes as reharmonizations of the major scale",
              titleUk: "7 ладів як переосмислення мажорної гами",
              description:
                "Every mode is the same major scale's notes, just started from a different degree. Each starting point creates a different color relative to its own root, which is what a bass line can lean into over a given chord.",
              descriptionUk:
                "Кожен лад — це ті самі ноти мажорної гами, просто розпочаті з іншого ступеня. Кожна початкова точка створює інше забарвлення відносно власного основного тону, і саме на це може спиратися баслінія над конкретним акордом.",
              longDescription:
                "Take any major scale and start it from a different one of its 7 notes, and you get a mode — the same 7 pitches, but a new note treated as 'home,' which changes where the two half-steps land relative to that new root and gives each mode a distinct color. Starting from degree 1 gives Ionian (the major scale itself); from degree 2, Dorian; 3, Phrygian; 4, Lydian; 5, Mixolydian; 6, Aeolian (the natural minor / relative minor from Phase 1); 7, Locrian.\n\nFor a bass player, modes matter less as scales to run and more as a way to choose which non-chord tones color a line well over a given chord. Mixolydian (major scale with a flatted 7th) is the natural choice under a dominant 7th chord because it matches that chord's own flatted 7th. Dorian (minor scale with a raised 6th) is the standard choice under a minor 7th chord in a jazz or funk context, giving a slightly brighter color than plain natural minor.\n\nThe practical entry point: take a C major scale you already know cold, and just relabel it starting from D (D-E-F-G-A-B-C) — that's D Dorian, with zero new notes to learn, only a new root to hear it against. Play it over a D minor chord and listen for how it differs in color from D Aeolian (D-E-F-G-A-Bb-C, the relative-minor version) — that side-by-side comparison is what actually trains the ear to hear modal color, more than memorizing the mode names in order.",
              longDescriptionUk:
                "Візьміть будь-яку мажорну гаму та почніть її з іншої з її 7 нот — і отримаєте лад: ті самі 7 звуків, але «домом» вважається інша нота, що змінює, де відносно нового основного тону лежать два півтони, і надає кожному ладу власного забарвлення. Початок з 1-го ступеня дає іонійський лад (сама мажорна гама); з 2-го — дорійський; з 3-го — фригійський; з 4-го — лідійський; з 5-го — міксолідійський; з 6-го — еолійський (натуральний мінор / паралельний мінор з Етапу 1); з 7-го — локрійський.\n\nДля бас-гітариста лади важливі не так як гами для «пробіжок», а як спосіб обрати, які позаакордові тони добре забарвлюють лінію над конкретним акордом. Міксолідійський лад (мажорна гама з пониженим 7-м ступенем) — природний вибір над домінантсептакордом, бо збігається з власною пониженою септимою цього акорду. Дорійський лад (мінорна гама з підвищеним 6-м ступенем) — стандартний вибір над мінорним септакордом у джазовому чи фанковому контексті, надаючи трохи світлішого забарвлення, ніж звичайний натуральний мінор.\n\nПрактична відправна точка: візьміть гаму до мажор, яку ви вже добре знаєте, і просто перепозначте її, починаючи з D (D-E-F-G-A-B-C) — це і є ре дорійський, без жодної нової ноти для вивчення, лише новий основний тон, відносно якого варто її чути. Зіграйте її над акордом D minor і прислухайтеся, чим вона відрізняється за забарвленням від D Aeolian (D-E-F-G-A-Bb-C, версії паралельного мінору) — саме таке пряме порівняння тренує слух чути ладове забарвлення значно краще, ніж завчання назв ладів по порядку.",
            },
            {
              title: "Pentatonic and blues scale relationships to modes",
              titleUk: "Зв'язок пентатоніки та блюзової гами з ладами",
              description:
                "The minor pentatonic is a 5-note subset of Aeolian, and the blues scale adds one chromatic 'blue note' to it. Both are dependable, low-risk choices for fills and passing tones over almost any minor-family chord.",
              descriptionUk:
                "Мінорна пентатоніка — це 5-нотна підмножина еолійського ладу, а блюзова гама додає до неї один хроматичний «блюзовий тон». Обидві є надійним, безпечним вибором для філів і прохідних тонів практично над будь-яким акордом мінорної групи.",
            },
            {
              title: "Chord-scale relationships for bass lines",
              titleUk: "Зв'язок акорд-гама для басліній",
              description:
                "For each chord quality (major, minor, dominant 7th), there's a default scale that outlines it cleanly. Matching the right scale to the right chord in real time is what lets a bassline stay 'inside' the harmony while moving freely.",
              descriptionUk:
                "Для кожного типу акорду (мажор, мінор, домінантсептакорд) існує гама за замовчуванням, що чітко його окреслює. Підбір правильної гами до правильного акорду в реальному часі дозволяє баслінії залишатися «всередині» гармонії, вільно рухаючись.",
            },
            {
              title: "7th chords (maj7, min7, dom7, m7b5) and their key bass tones",
              titleUk: "Септакорди (maj7, min7, dom7, m7b5) та їхні ключові басові тони",
              description:
                "Adding a 4th note (the 7th) to a triad sharpens its identity — a dominant 7th and a major 7th share the same root/3rd/5th but sound completely different. Know which chord tone to lean on for each quality.",
              descriptionUk:
                "Додавання четвертої ноти (септими) до тризвуку загострює його ідентичність — домінантсептакорд і мажорний септакорд мають однакові основний тон/терцію/квінту, але звучать зовсім по-різному. Знайте, на який акордовий тон спиратися для кожного типу.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Improvise a groove over a static vamp",
              titleUk: "Імпровізуйте грув над статичним вампом",
              description:
                "Loop a single chord and build a groove using chord tones plus one carefully chosen passing tone. Constraining yourself to one extra note at a time keeps the improvisation focused instead of random.",
              descriptionUk:
                "Зацикліть один акорд і побудуйте грув, використовуючи акордові тони плюс один ретельно обраний прохідний тон. Обмеження себе одним додатковим тоном за раз тримає імпровізацію цілеспрямованою, а не хаотичною.",
            },
            {
              title: "Learn one real bassline per week, by ear",
              titleUk: "Вивчайте одну реальну баслінію на тиждень, на слух",
              description:
                "Pick a song with a recognizable bass part and work it out from the recording rather than a tab, slowing playback if needed. Transcribing by ear directly trains the same skill as the ear-training section below.",
              descriptionUk:
                "Оберіть пісню з упізнаваною басовою партією та підберіть її із запису, а не з табулатури, за потреби сповільнюючи відтворення. Підбір на слух безпосередньо тренує ту саму навичку, що й розділ тренування слуху нижче.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Distinguish major-family vs. minor-family modes by ear",
              titleUk: "Розрізняйте лади мажорної та мінорної груп на слух",
              description:
                "Listen to short modal vamps and identify whether the overall color leans major-bright (Ionian, Lydian, Mixolydian) or minor-dark (Dorian, Phrygian, Aeolian), before naming the exact mode.",
              descriptionUk:
                "Слухайте короткі ладові вампи й визначайте, чи загальне забарвлення тяжіє до мажорно-світлого (іонійський, лідійський, міксолідійський) чи мінорно-темного (дорійський, фригійський, еолійський), перш ніж називати конкретний лад.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 4,
      title: "Walking Bass and Advanced Harmony",
      titleUk: "Walking-бас та поглиблена гармонія",
      goal: "Construct moving basslines over changing harmony and develop a personal voice.",
      goalUk: "Будувати рухливі баслінії над змінною гармонією та розвивати власний музичний голос.",
      durationLabel: "Months 10-12",
      milestone:
        "Walking a convincing quarter-note bassline through a 12-bar blues or a simple jazz standard's changes, using a chromatic approach note into each new chord, means you can outline harmony in real time instead of only playing pre-planned patterns.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 25,
          items: [
            {
              title: "Walking bass technique",
              titleUk: "Техніка walking-баса",
              description:
                "Steady, unbroken quarter notes with consistent tone and volume across every string and position change, so the line's momentum never dips even as the notes chosen underneath it get more complex.",
              descriptionUk:
                "Стабільні, безперервні чвертки з рівним тоном і гучністю на будь-якій струні та при будь-якій зміні позиції, щоб рух лінії ніколи не «провисав», навіть коли ноти під ним стають складнішими.",
            },
            {
              title: "Dynamics and touch control",
              titleUk: "Динаміка та контроль дотику",
              description:
                "Practice the same groove at three deliberately different volumes (soft, medium, hard) with even tone at each, so dynamics become a controlled choice you make rather than an accident of how hard you happened to pluck.",
              descriptionUk:
                "Тренуйте той самий грув на трьох свідомо різних рівнях гучності (тихо, середньо, гучно) з рівним тоном на кожному, щоб динаміка стала контрольованим вибором, а не випадковістю сили щипка.",
            },
            {
              title: "Extended range awareness (5-string low B)",
              titleUk: "Обізнаність з розширеним діапазоном (5-струнний, нижній B)",
              description:
                "Optional if you own a 5-string bass: learn the natural notes on the low B string and how it extends the same box shapes and root-fifth patterns you already know a fourth lower.",
              descriptionUk:
                "Необов'язково, якщо у вас 5-струнний бас: вивчіть натуральні ноти на нижній струні B і те, як вона розширює ті самі «блокові» форми та патерни основний тон-квінта, які ви вже знаєте, на кварту нижче.",
            },
            {
              title: "Efficient position shifting across the full neck",
              titleUk: "Ефективна зміна позиції по всьому грифу",
              description:
                "Walking bass lines often need a wider range than a groove confined to one position. Practice shifting cleanly across 2-3 positions within a single 4-bar phrase without a rhythmic hiccup.",
              descriptionUk:
                "Walking-баслінії часто потребують ширшого діапазону, ніж грув, обмежений однією позицією. Тренуйте чисту зміну між 2-3 позиціями в межах однієї 4-тактової фрази без ритмічного «збою».",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Secondary dominants",
              titleUk: "Побічні домінанти",
              description:
                "A dominant 7th chord borrowed from outside the key to briefly point toward a chord other than the tonic, sharpening the pull into it. A common and highly effective color to add to an otherwise diatonic progression.",
              descriptionUk:
                "Домінантсептакорд, запозичений поза межами тональності, щоб на мить указати на акорд, відмінний від тоніки, посилюючи тяжіння до нього. Поширений і дуже ефективний спосіб додати барви до інакше суто діатонічної послідовності.",
            },
            {
              title: "Borrowed chords",
              titleUk: "Запозичені акорди",
              description:
                "A chord pulled from the parallel minor (or major) key and inserted into an otherwise diatonic progression for a moment of unexpected color, most often the minor iv borrowed into a major-key progression.",
              descriptionUk:
                "Акорд, узятий з однойменної мінорної (чи мажорної) тональності й вставлений в інакше суто діатонічну послідовність для миті несподіваного забарвлення, найчастіше мінорний iv, запозичений у мажорну послідовність.",
            },
            {
              title: "Extended chords (9ths, 11ths, 13ths) and their key bass tones",
              titleUk: "Розширені акорди (9, 11, 13) та їхні ключові басові тони",
              description:
                "Extensions stack further thirds past the 7th. As a bass player you rarely need to play every extension — usually the root plus one characteristic upper tone is enough to imply the full chord.",
              descriptionUk:
                "Розширення накладають додаткові терції понад септиму. Як бас-гітаристу вам рідко потрібно грати кожне розширення — зазвичай достатньо основного тону плюс одного характерного верхнього тону, щоб натякнути на весь акорд.",
            },
            {
              title: "Constructing walking basslines: approach notes",
              titleUk: "Побудова walking-басліній: підвідні ноти",
              description:
                "A walking line is chord tones on the strong beats and a chromatic or scale-tone approach note leading into the next chord's root. That one recurring device is what makes a walking line sound intentional rather than random.",
              descriptionUk:
                "Walking-лінія — це акордові тони на сильних долях і хроматична чи гамова підвідна нота, що веде до основного тону наступного акорду. Саме цей один повторюваний прийом і робить walking-лінію свідомою, а не хаотичною.",
              longDescription:
                "A walking bassline's job is to state the current chord clearly on the strong beats while still creating forward motion toward the next chord. The standard formula over 4 beats is: root on beat 1, another chord tone (3rd or 5th) on beat 2 or 3, and an approach note on the last beat that leads directly into the next chord's root — either a half-step above or below it (chromatic approach) or a scale-tone a whole step away (diatonic approach).\n\nOver a 12-bar blues in C, for example, a simple walking line into the F7 chord in bar 5 might play C-E-G-Gb on beats 1-2-3-4 of bar 4: root, 3rd, 5th, then a chromatic approach note a half-step below F. That last note isn't 'in' the C7 chord at all — its whole purpose is to create tension that resolves the instant the F7 chord arrives, which is exactly what makes the line feel like it's walking somewhere rather than just outlining static harmony.\n\nThe practical drill: take a progression you already know the diatonic chords for (from Phase 2's harmonization work), and for every chord change, ask only one question — 'what note, one step away from the next root, can I play right before it?' Do that consistently and the rest of the walking line (root-3rd-5th on the earlier beats) is already familiar territory from everything drilled so far.",
              longDescriptionUk:
                "Завдання walking-баслінії — чітко окреслити поточний акорд на сильних долях, водночас створюючи рух уперед до наступного акорду. Стандартна формула на 4 долі: основний тон на 1-й долі, інший акордовий тон (терція чи квінта) на 2-й чи 3-й, і підвідна нота на останній долі, що веде прямо до основного тону наступного акорду — або на півтон вище чи нижче нього (хроматичне підведення), або на цілий тон гами (діатонічне підведення).\n\nНаприклад, у 12-тактовому блюзі в C проста walking-лінія до акорду F7 у 5-му такті могла б зіграти C-E-G-Gb на долях 1-2-3-4 4-го такту: основний тон, терція, квінта, а потім хроматична підвідна нота на півтон нижче F. Ця остання нота взагалі не входить до акорду C7 — її ціла мета в тому, щоб створити напругу, яка розв'язується миттєво з приходом акорду F7, і саме це створює відчуття, що лінія кудись «йде», а не просто окреслює статичну гармонію.\n\nПрактична вправа: візьміть послідовність, для якої ви вже знаєте діатонічні акорди (з роботи над гармонізацією в Етапі 2), і при кожній зміні акорду ставте лише одне питання — «яку ноту, на крок від наступного основного тону, я можу зіграти прямо перед ним?». Робіть це послідовно, і решта walking-лінії (основний тон-терція-квінта на попередніх долях) уже буде знайомою територією з усього відпрацьованого раніше.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Walk a bassline through a 12-bar blues progression",
              titleUk: "Проведіть walking-баслінію крізь 12-тактовий блюз",
              description:
                "Apply the approach-note formula across all 12 bars of a blues progression, at a slow, steady tempo first. Getting through all 12 bars without a rhythmic gap is the win, not speed.",
              descriptionUk:
                "Застосуйте формулу підвідних нот у всіх 12 тактах блюзової послідовності, спершу в повільному, стабільному темпі. Мета — пройти всі 12 тактів без ритмічного «розриву», а не швидкість.",
            },
            {
              title: "Compose an 8-16 bar original bassline",
              titleUk: "Складіть оригінальну баслінію на 8-16 тактів",
              description:
                "Write (or record) an original bassline over a chord progression of your choice, combining groove, chord tones, and approach notes from everything covered so far. Write it down or record it so you can play it back consistently.",
              descriptionUk:
                "Напишіть (чи запишіть) оригінальну баслінію над обраною вами акордовою послідовністю, поєднуючи грув, акордові тони й підвідні ноти з усього вивченого досі. Запишіть її на папері чи в аудіо, щоб стабільно відтворювати надалі.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Full chord quality ID including extensions",
              titleUk: "Повне визначення якості акорду, включно з розширеннями",
              description:
                "Listen to chords ranging from simple triads to 7ths and basic extensions, identifying the full quality (e.g., 'minor 7th' not just 'minor') before checking against the source.",
              descriptionUk:
                "Слухайте акорди — від простих тризвуків до септакордів і базових розширень, визначаючи повну якість (наприклад, «мінорний септакорд», а не просто «мінор»), перш ніж перевіряти себе за джерелом.",
            },
            {
              title: "Transcribe a short bassline from a real song",
              titleUk: "Підберіть на слух коротку баслінію з реальної пісні",
              description:
                "Weekly: pick an 8-16 bar section of a bassline you don't already know, work it out entirely by ear, and write down the notes (or record yourself playing it back) as proof of the transcription.",
              descriptionUk:
                "Щотижня: оберіть 8-16-тактовий фрагмент незнайомої вам баслінії, повністю підберіть його на слух і запишіть ноти (чи запишіть себе на аудіо, граючи його) як підтвердження підбору.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Metronome always on",
              titleUk: "Метроном завжди увімкнений",
              description:
                "Track a specific tempo number per exercise over time (e.g., 'root-note groove: 80 BPM → 108 BPM over 6 weeks') so progress is measurable instead of a vague feeling of 'getting tighter.'",
              descriptionUk:
                "Відстежуйте конкретний темп для кожної вправи з часом (наприклад, «грув на основних тонах: 80 → 108 уд/хв за 6 тижнів»), щоб прогрес був вимірюваним, а не розмитим відчуттям «стає щільніше».",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Read back through a month of entries occasionally; patterns in what keeps showing up as 'struggle' tell you where to spend more deliberate time.",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Час від часу перечитуйте записи за місяць; патерни в тому, що постійно повторюється як «труднощі», підказують, де варто приділити більше свідомої уваги.",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay a groove or bassline from an earlier phase without warming up on it first. If it's shaky, that's useful information — it means the skill needs occasional maintenance reps, not that you failed to learn it.",
              descriptionUk:
                "Раз на кілька тижнів переграйте грув чи баслінію з попереднього етапу без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень, а не свідчення того, що ви її не вивчили.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Learn one real bassline per week",
              titleUk: "Вивчайте одну реальну баслінію на тиждень",
              description:
                "For every phase's technique or theory concept, find or pick a real song whose bassline uses it, so the abstract concept always has a concrete, motivating home rather than living only in exercises.",
              descriptionUk:
                "Для кожного технічного чи теоретичного поняття з кожного етапу знайдіть чи оберіть реальну пісню, баслінія якої його використовує, щоб абстрактне поняття завжди мало конкретний, мотивуючий дім, а не існувало лише у вправах.",
            },
          ],
        },
      ],
    },
  ],
};

const beginnerBassPlan: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
} = {
  instrument: { slug: "bass", name: "Bass Guitar", nameUk: "Бас-гітара" },
  plan: {
    title: "Beginner Bass Guitar Practice Plan",
    titleUk: "План практики гри на бас-гітарі для початківців",
    description:
      "For complete beginners, 6-month plan building hand position, first grooves, and reading fundamentals from zero, ~20-30 min/day. Graduate into the Long-Term Bass Guitar Practice Plan afterward.",
    descriptionUk:
      "Для абсолютних початківців, 6-місячний план, що з нуля розвиває положення рук, перші груви та основи читання, ~20-30 хв/день. Після завершення переходьте до Довгострокового плану практики гри на бас-гітарі.",
  },
  phases: [
    {
      orderIndex: 1,
      title: "Absolute Basics",
      titleUk: "Абсолютні основи",
      goal: "Build comfortable hand position and play steady root notes in time.",
      goalUk: "Розвинути зручне положення рук і грати стабільні основні тони в темпі.",
      durationLabel: "Months 1-3",
      milestone:
        "Playing a steady stream of quarter-note root notes along with a metronome at 80 BPM for 2 minutes without speeding up, slowing down, or losing the beat means your fretting and plucking hands are finally moving independently of each other.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Sitting or standing posture and hand position",
              titleUk: "Постава сидячи чи стоячи та положення рук",
              description:
                "Hold the bass so the neck angles slightly upward and your fretting hand can reach any fret without hunching. A comfortable, repeatable position now prevents tension habits that are hard to undo later.",
              descriptionUk:
                "Тримайте бас так, щоб гриф був злегка нахилений вгору, а ліва рука могла дістати будь-який лад без згинання спини. Зручне, повторюване положення зараз запобігає звичкам напруження, які важко виправити пізніше.",
            },
            {
              title: "Fretting hand basics: one finger per fret",
              titleUk: "Основи лівої руки: один палець на лад",
              description:
                "Assign fingers 1-2-3-4 to four consecutive frets and press just behind the fret with light, consistent pressure — enough for a clean note, no more. Excess grip is the most common source of early fatigue.",
              descriptionUk:
                "Призначте пальці 1-2-3-4 на чотири послідовні лади й натискайте одразу за ладом з легким, стабільним тиском — рівно стільки, щоб отримати чистий звук, не більше. Надмірний хват — найпоширеніша причина ранньої втоми.",
            },
            {
              title: "Alternating index-middle plucking, right hand",
              titleUk: "Почергове щипання вказівним і середнім пальцями, права рука",
              description:
                "Rest the plucking hand's thumb on a lower string for an anchor, and pluck strictly alternating between the index and middle fingers. Consistency between the two fingers matters more than speed at this stage.",
              descriptionUk:
                "Покладіть великий палець правої руки на нижчу струну як опору й щипайте суворо почергово вказівним і середнім пальцями. На цьому етапі узгодженість між двома пальцями важливіша за швидкість.",
            },
            {
              title: "Basic muting: keeping unplayed strings quiet",
              titleUk: "Базове приглушення: тиша на незадіяних струнах",
              description:
                "Let the fretting hand's unused fingers rest lightly against neighboring strings, and let the plucking hand's palm settle near the bridge. A muted, silent string is just as important as a clean note.",
              descriptionUk:
                "Дозвольте незадіяним пальцям лівої руки злегка торкатися сусідніх струн, а долоні правої руки — спокійно лежати біля бриджа. Приглушена, тиха струна настільки ж важлива, як і чиста нота.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Parts of the bass and the four open strings (E-A-D-G)",
              titleUk: "Частини бас-гітари та чотири відкриті струни (E-A-D-G)",
              description:
                "Learn the names of the strings from lowest to highest (E-A-D-G) and how to tune each one, either by ear against a reference or with a tuner. Everything else in this plan assumes you can find these four notes instantly.",
              descriptionUk:
                "Вивчіть назви струн від найнижчої до найвищої (E-A-D-G) і те, як налаштувати кожну — на слух за еталоном або за допомогою тюнера. Усе інше в цьому плані передбачає, що ви можете миттєво знайти ці чотири ноти.",
            },
            {
              title: "Natural notes on the E and A strings, up to the 5th fret",
              titleUk: "Натуральні ноти на струнах E і A, до 5-го ладу",
              description:
                "Starting from the open low E string, the natural (non-sharp) notes up to the 5th fret are: E-open, F (1st fret), G (3rd fret), A (5th fret). Do the same on the A string: A-open, B (2nd fret), C (3rd fret), D (5th fret).",
              descriptionUk:
                "Починаючи з відкритої нижньої струни E, натуральні (без дієзів) ноти до 5-го ладу: E-відкрита, F (1-й лад), G (3-й лад), A (5-й лад). Те саме на струні A: A-відкрита, B (2-й лад), C (3-й лад), D (5-й лад).",
              longDescription:
                "The fastest way to learn this isn't staring at a chart — it's picking a random natural note name, physically finding it on the low E string, saying it out loud, and checking yourself, repeating until you stop hesitating. Then repeat the whole process on the A string.\n\nThis matters beyond trivia: once you know where these notes sit on the two lowest strings, you can name the root of any bassline you're playing there, which is the beginning of understanding what a bassline is actually built from rather than just memorizing finger positions.\n\nA useful shortcut once both strings feel solid: the note at any fret on the A string is exactly a perfect fourth (5 frets) above the same-fret note on the E string, so B on the A string (2nd fret) is a fourth above F# on the E string (2nd fret) — noticing that relationship is what eventually lets the whole fretboard click into place as one connected system rather than four separate strings to memorize.",
              longDescriptionUk:
                "Найшвидший спосіб вивчити це — не вдивлятися в схему, а обирати випадкову назву натуральної ноти, фізично знаходити її на нижній струні E, називати вголос і перевіряти себе, повторюючи, доки не зникне вагання. Потім повторіть весь процес на струні A.\n\nЦе важливо не як цікавий факт: щойно ви знаєте, де лежать ці ноти на двох нижніх струнах, ви можете назвати основний тон будь-якої баслінії, яку граєте на них — це початок розуміння того, з чого насправді складається баслінія, а не просто завчання положень пальців.\n\nКорисна підказка, коли обидві струни вже добре засвоєні: нота на будь-якому ладу струни A завжди на чисту кварту (5 ладів) вища за ноту на тому самому ладу струни E, тож B на струні A (2-й лад) — це кварта вище за F# на струні E (2-й лад). Помітивши цей зв'язок, з часом весь гриф складається в одну цілісну систему, а не в чотири окремі струни для завчання.",
            },
            {
              title: "Reading a simple chord chart (root notes only)",
              titleUk: "Читання простого акордового чарта (лише основні тони)",
              description:
                "A chord chart's letter names (C, G, Am, etc.) tell you exactly which root note to play under each chord — nothing more is needed yet. Practice reading a simple chart and playing only the root of each chord in time.",
              descriptionUk:
                "Літерні позначення акордового чарта (C, G, Am тощо) прямо вказують, який основний тон грати під кожним акордом — наразі більше нічого не потрібно. Тренуйтеся читати простий чарт і грати лише основний тон кожного акорду в темпі.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Play steady root notes along with a metronome",
              titleUk: "Грайте стабільні основні тони під метроном",
              description:
                "Pick one note, play it in steady quarter notes at a slow, comfortable tempo, and gradually increase the tempo only once it feels effortless. Rock-solid timing on one note beats shaky timing across many.",
              descriptionUk:
                "Оберіть одну ноту, грайте її рівними чвертками в повільному, комфортному темпі й поступово підвищуйте темп лише тоді, коли це стає легко. Абсолютно стабільний ритм на одній ноті кращий за нестабільний на багатьох.",
            },
            {
              title: "Play root notes of a simple I-IV-V progression",
              titleUk: "Грайте основні тони простої послідовності I-IV-V",
              description:
                "Along with a backing track or metronome, play only the root note of a simple three-chord progression, changing notes exactly when the chord changes. This is your first real 'bassline.'",
              descriptionUk:
                "Разом із бекінг-треком чи метрономом грайте лише основний тон простої трьохакордової послідовності, змінюючи ноту саме тоді, коли змінюється акорд. Це ваша перша справжня «баслінія».",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Recognize when the root note changes, by ear",
              titleUk: "Розпізнавайте на слух зміну основного тону",
              description:
                "Listen to a simple recorded progression and try to notice, just by ear, the exact moment the bass note changes — before looking at any chart. You don't need to name the note yet, just catch the change.",
              descriptionUk:
                "Слухайте просту записану послідовність і намагайтеся на слух вловити точний момент зміни басової ноти — перш ніж дивитися на будь-який чарт. Наразі не обов'язково називати ноту, достатньо вловити саму зміну.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 2,
      title: "First Grooves and Simple Songs",
      titleUk: "Перші груви та прості пісні",
      goal: "Play simple steady basslines along with real songs and keep time reliably.",
      goalUk: "Грати прості стабільні баслінії разом із реальними піснями та надійно тримати темп.",
      durationLabel: "Months 4-6",
      milestone:
        "Playing along with a simple recorded song's verse and chorus using just root notes, in time, without falling behind or rushing, means you're ready to start adding the 5th and octave in the Long-Term plan next.",
      categories: [
        {
          slug: "technique",
          name: "Technique",
          nameUk: "Техніка",
          orderIndex: 1,
          dailyMinMinutes: 15,
          dailyMaxMinutes: 20,
          items: [
            {
              title: "Groove exercises with a metronome, alternating fingers",
              titleUk: "Грувові вправи під метроном, чергування пальців",
              description:
                "Combine steady eighth notes with the index-middle alternation from Phase 1, keeping every note the same volume and length. This is the direct building block of every groove pattern going forward.",
              descriptionUk:
                "Поєднуйте рівні вісімки з чергуванням вказівного й середнього пальців з Етапу 1, зберігаючи однакову гучність і тривалість кожної ноти. Це прямий будівельний блок для кожного грувового патерну надалі.",
            },
            {
              title: "Clean string changes without extra noise",
              titleUk: "Чисті переходи між струнами без зайвих шумів",
              description:
                "When moving from one string to the next, deliberately mute the string you just left with a fretting-hand finger. Small extra noises here are the most common thing that makes a beginner bassline sound messy.",
              descriptionUk:
                "Переходячи з однієї струни на іншу, свідомо приглушуйте струну, яку щойно залишили, пальцем лівої руки. Дрібні зайві шуми — найпоширеніша причина, чому баслінія початківця звучить неохайно.",
            },
            {
              title: "Simple root-fifth fingerstyle pattern",
              titleUk: "Простий патерн fingerstyle основний тон-квінта",
              description:
                "Alternate between a chord's root and its 5th in a steady rhythm — the simplest groove pattern that still sounds musical rather than static, and the direct entry point into Phase 2 of the Long-Term plan.",
              descriptionUk:
                "Чергуйте основний тон акорду з його квінтою в стабільному ритмі — найпростіший грувовий патерн, який все ще звучить музично, а не статично, і пряма відправна точка для Етапу 2 Довгострокового плану.",
            },
            {
              title: "Basic rhythm reading (quarter and eighth notes)",
              titleUk: "Базове читання ритму (чвертки та вісімки)",
              description:
                "Learn to read and count simple quarter- and eighth-note rhythms on a written chart, clapping or tapping them before playing them on the bass. Reading rhythm accurately matters more than reading pitch at this stage.",
              descriptionUk:
                "Навчіться читати й рахувати прості ритми з чверток і вісімок за нотним записом, проплескуючи чи простукуючи їх, перш ніж грати на басу. Точне читання ритму на цьому етапі важливіше за читання висоти звуку.",
            },
          ],
        },
        {
          slug: "theory",
          name: "Theory",
          nameUk: "Теорія",
          orderIndex: 2,
          items: [
            {
              title: "Movable major scale shape, one position",
              titleUk: "Рухома форма мажорної гами, одна позиція",
              description:
                "Learn a single movable major-scale fingering and how sliding it to a new fret changes the key, without needing to learn a brand-new shape per key.",
              descriptionUk:
                "Вивчіть одну рухому аплікатуру мажорної гами і те, як її зсув на новий лад змінює тональність, без потреби вивчати нову форму для кожної тональності.",
            },
            {
              title: "The root-fifth relationship",
              titleUk: "Зв'язок основний тон-квінта",
              description:
                "The 5th is the most stable, consonant note relative to any root, which is why root-fifth patterns are the backbone of beginner and advanced basslines alike. Learn its shape from each string.",
              descriptionUk:
                "Квінта — найстабільніший, найбільш консонантний тон відносно будь-якого основного тону, тому патерни основний тон-квінта є основою як басліній початківця, так і досвідченого гравця. Вивчіть її форму від кожної струни.",
              longDescription:
                "The interval of a perfect fifth (7 semitones, or 3.5 whole steps) is the most consonant interval after the octave — it's the same relationship a guitar or bass's open strings are tuned close to, and the same one that makes power chords sound 'strong' rather than colored major or minor. That's exactly why it works so reliably under almost any chord: playing the root and 5th together (or one after the other in a bassline) never clashes with a chord's quality, whether it's major, minor, or something more complex, because the 5th itself doesn't state major or minor — only the 3rd does that.\n\nOn bass, the root-fifth shape has one consistent fingering regardless of which string the root sits on: from the root, the 5th is always two frets up and one string over (toward the higher-pitched strings), except when crossing from the G to a hypothetical higher string, which most 4-string basses don't have — so in practice, this one shape is reliable across the E, A, and D strings.\n\nPractice it by picking any root note, finding its 5th using that shape, and alternating between them in steady quarter notes — then try it from a different starting string and confirm the same finger-shape distance holds. That consistency is what makes root-fifth the fastest reliable groove a beginner can build under any chord progression.",
              longDescriptionUk:
                "Інтервал чистої квінти (7 півтонів, або 3,5 цілих тони) — найбільш консонантний інтервал після октави: саме на такому співвідношенні (близькому до нього) налаштовані відкриті струни гітари чи баса, і саме він робить павер-акорди «сильними», а не забарвленими в мажор чи мінор. Саме тому квінта настільки надійно працює майже під будь-яким акордом: гра основного тону й квінти разом (чи по черзі в баслінії) ніколи не конфліктує з якістю акорду, будь то мажор, мінор чи щось складніше, адже сама квінта не визначає мажор чи мінор — це робить лише терція.\n\nНа басу форма основний тон-квінта має стабільну аплікатуру незалежно від того, на якій струні лежить основний тон: від основного тону квінта завжди на два лади вище й на одну струну далі (у бік вищих за звучанням струн), за винятком переходу зі струни G на гіпотетичну вищу струну, якої більшість 4-струнних басів не мають — тож на практиці ця одна форма надійно працює на струнах E, A і D.\n\nВідпрацюйте це так: оберіть будь-який основний тон, знайдіть його квінту за цією формою й чергуйте їх рівними чвертками — потім спробуйте від іншої початкової струни й переконайтеся, що та сама відстань форми зберігається. Саме ця стабільність робить основний тон-квінту найшвидшим надійним грувом, який початківець може побудувати під будь-яку акордову послідовність.",
            },
            {
              title: "Recognizing a simple I-IV-V progression from a chord chart",
              titleUk: "Розпізнавання простої послідовності I-IV-V за акордовим чартом",
              description:
                "The vast majority of simple songs use just three chords built on the 1st, 4th, and 5th degrees of a key. Spotting this pattern on a chart tells you which three root notes you'll need before you even start playing.",
              descriptionUk:
                "Переважна більшість простих пісень використовують лише три акорди, побудовані на 1-му, 4-му та 5-му ступенях тональності. Розпізнавання цього патерну в чарті одразу підказує, які три основні тони знадобляться, ще до початку гри.",
            },
          ],
        },
        {
          slug: "applied",
          name: "Applied",
          nameUk: "Застосування",
          orderIndex: 3,
          dailyMinMinutes: 10,
          dailyMaxMinutes: 15,
          items: [
            {
              title: "Play a root-fifth bassline along with a simple song",
              titleUk: "Грайте баслінію основний тон-квінта разом із простою піснею",
              description:
                "Find a slow, simple song, work out its chord progression, and play a root-fifth pattern along with the recording from start to finish. Completing a full song, even a short one, is a real milestone.",
              descriptionUk:
                "Знайдіть повільну просту пісню, визначте її акордову послідовність і грайте патерн основний тон-квінта разом із записом від початку до кінця. Завершення цілої пісні, навіть короткої, — це справжня віха.",
            },
            {
              title: "Play along with 2-3 real songs using just roots",
              titleUk: "Грайте разом із 2-3 реальними піснями, використовуючи лише основні тони",
              description:
                "Repeat the root-note-only approach across a small handful of real songs in different keys, focused on staying exactly in time from start to finish without needing to stop and restart.",
              descriptionUk:
                "Повторіть підхід «лише основні тони» на кількох реальних піснях у різних тональностях, зосереджуючись на тому, щоб точно тримати темп від початку до кінця без потреби зупинятися й починати заново.",
            },
          ],
        },
        {
          slug: "ear_training",
          name: "Ear training",
          nameUk: "Тренування слуху",
          orderIndex: 4,
          dailyMinMinutes: 5,
          dailyMaxMinutes: 5,
          items: [
            {
              title: "Recognize root movement in a simple recorded song",
              titleUk: "Розпізнавайте рух основного тону в простій записаній пісні",
              description:
                "Listen to a real song's verse and try to hum or tap along with just the bass note under each chord, checking your answer against a chart or tab afterward.",
              descriptionUk:
                "Слухайте куплет реальної пісні й намагайтеся наспівувати чи простукувати лише басову ноту під кожним акордом, звіряючи відповідь із чартом чи табулатурою після цього.",
            },
          ],
        },
      ],
    },
    {
      orderIndex: 0,
      isOngoing: true,
      title: "Ongoing Habits",
      titleUk: "Постійні звички",
      goal: "Habits that run across every phase, all year, independent of where you are in the plan.",
      goalUk:
        "Звички, що діють протягом усіх етапів, увесь рік, незалежно від того, на якому етапі плану ви перебуваєте.",
      categories: [
        {
          slug: "metronome",
          name: "Metronome Tracking",
          nameUk: "Відстеження темпу метрономом",
          orderIndex: 1,
          items: [
            {
              title: "Track tempo, not just repetitions",
              titleUk: "Відстежуйте темп, а не лише кількість повторень",
              description:
                "Note the exact BPM you can play a groove cleanly at, and revisit it every couple of weeks to see it climb. A small, steady BPM increase over time is concrete proof of progress.",
              descriptionUk:
                "Записуйте точний темп (уд/хв), на якому ви можете чисто зіграти грув, і переглядайте його раз на кілька тижнів, спостерігаючи за зростанням. Невелике, стабільне підвищення темпу з часом — конкретне підтвердження прогресу.",
            },
          ],
        },
        {
          slug: "practice_log",
          name: "Practice Log",
          nameUk: "Щоденник практики",
          orderIndex: 2,
          items: [
            {
              title: "One line per session",
              titleUk: "Один рядок за заняття",
              description:
                "What you worked on, one small win, one specific struggle is enough. Read back through a month of entries occasionally; patterns in what keeps showing up as 'struggle' tell you where to spend more deliberate time.",
              descriptionUk:
                "Достатньо того, над чим працювали, одного маленького успіху й однієї конкретної труднощі. Час від часу перечитуйте записи за місяць; патерни в тому, що постійно повторюється як «труднощі», підказують, де варто приділити більше свідомої уваги.",
            },
          ],
        },
        {
          slug: "review",
          name: "Revisit Old Material",
          nameUk: "Повернення до старого матеріалу",
          orderIndex: 3,
          items: [
            {
              title: "Periodic review without warm-up",
              titleUk: "Періодичний перегляд без розминки",
              description:
                "Every couple of weeks, replay something from an earlier phase without warming up on it first. If it's shaky, that's useful information — it means the skill needs occasional maintenance reps, not that you failed to learn it.",
              descriptionUk:
                "Раз на кілька тижнів переграйте щось із попереднього етапу без попередньої розминки. Якщо виходить нестабільно — це корисна інформація: навичка потребує періодичних підтримуючих повторень, а не свідчення того, що ви її не вивчили.",
            },
          ],
        },
        {
          slug: "repertoire",
          name: "Real Music Alongside Drills",
          nameUk: "Реальна музика поряд із вправами",
          orderIndex: 4,
          items: [
            {
              title: "Learn at least one real bassline per month",
              titleUk: "Вивчайте щонайменше одну реальну баслінію на місяць",
              description:
                "Pick a simple, well-known song's bassline within reach of your current skill, even a partial or simplified version. Real music is what keeps motivation alive between the more repetitive technical drills.",
              descriptionUk:
                "Оберіть просту, відому баслінію в межах вашого поточного рівня, навіть часткову чи спрощену версію. Реальна музика підтримує мотивацію між більш повторюваними технічними вправами.",
            },
          ],
        },
      ],
    },
  ],
};

async function seedInstrumentPlan(planData: {
  instrument: { slug: string; name: string; nameUk: string };
  plan: { title: string; titleUk: string; description: string; descriptionUk: string };
  phases: SeedPhase[];
}) {
  const [instrument] = await db
    .insert(instruments)
    .values(planData.instrument)
    .onConflictDoUpdate({
      target: instruments.slug,
      set: { name: planData.instrument.name, nameUk: planData.instrument.nameUk },
    })
    .returning();

  const existingPlan = await db.query.plans.findFirst({
    where: and(eq(plans.instrumentId, instrument.id), eq(plans.title, planData.plan.title)),
  });
  const [plan] = existingPlan
    ? await db
        .update(plans)
        .set({
          title: planData.plan.title,
          titleUk: planData.plan.titleUk,
          description: planData.plan.description,
          descriptionUk: planData.plan.descriptionUk,
        })
        .where(eq(plans.id, existingPlan.id))
        .returning()
    : await db
        .insert(plans)
        .values({ ...planData.plan, instrumentId: instrument.id })
        .returning();

  for (const seedPhase of planData.phases) {
    const [phase] = await db
      .insert(phases)
      .values({
        planId: plan.id,
        orderIndex: seedPhase.orderIndex,
        isOngoing: seedPhase.isOngoing ?? false,
        title: seedPhase.title,
        titleUk: seedPhase.titleUk,
        goal: seedPhase.goal,
        goalUk: seedPhase.goalUk,
        durationLabel: seedPhase.durationLabel,
      })
      .onConflictDoUpdate({
        target: [phases.planId, phases.orderIndex],
        set: {
          title: seedPhase.title,
          titleUk: seedPhase.titleUk,
          goal: seedPhase.goal,
          goalUk: seedPhase.goalUk,
          durationLabel: seedPhase.durationLabel,
          isOngoing: seedPhase.isOngoing ?? false,
        },
      })
      .returning();

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
          nameUk: seedCategory.nameUk,
          orderIndex: seedCategory.orderIndex,
          dailyMinMinutes: seedCategory.dailyMinMinutes,
          dailyMaxMinutes: seedCategory.dailyMaxMinutes,
        })
        .onConflictDoUpdate({
          target: [categories.phaseId, categories.slug],
          set: {
            name: seedCategory.name,
            nameUk: seedCategory.nameUk,
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
            titleUk: seedItem.titleUk,
            description: seedItem.description,
            descriptionUk: seedItem.descriptionUk,
            longDescription: seedItem.longDescription,
            longDescriptionUk: seedItem.longDescriptionUk,
            orderIndex: i,
          })
          .onConflictDoUpdate({
            target: [items.categoryId, items.title],
            set: {
              titleUk: seedItem.titleUk,
              description: seedItem.description,
              descriptionUk: seedItem.descriptionUk,
              longDescription: seedItem.longDescription,
              longDescriptionUk: seedItem.longDescriptionUk,
              orderIndex: i,
            },
          });
      }
    }
  }
}

async function seed() {
  await seedInstrumentPlan(guitarPlan);
  await seedInstrumentPlan(pianoPlan);
  await seedInstrumentPlan(beginnerGuitarPlan);
  await seedInstrumentPlan(beginnerPianoPlan);
  await seedInstrumentPlan(bassPlan);
  await seedInstrumentPlan(beginnerBassPlan);
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
