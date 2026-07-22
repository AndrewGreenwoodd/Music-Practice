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

async function seed() {
  const [instrument] = await db
    .insert(instruments)
    .values(guitarPlan.instrument)
    .onConflictDoUpdate({
      target: instruments.slug,
      set: { name: guitarPlan.instrument.name, nameUk: guitarPlan.instrument.nameUk },
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
          titleUk: guitarPlan.plan.titleUk,
          description: guitarPlan.plan.description,
          descriptionUk: guitarPlan.plan.descriptionUk,
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
