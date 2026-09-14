import type { Lang } from "@/lib/i18n";
import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";

/**
 * Počasno gledanje (vzorec: MoMA Slow Looking, Tate, Smithsonian NMAA,
 * Harvard Art Museums — Slow Art Day). Obiskovalec en sam zapis gleda
 * počasi, v štirih časovno omejenih fazah z vodenimi vprašanji.
 * Vsa besedila so dvojezična in deterministična (izpeljana iz zapisa).
 */

export type SlowPresetId = "hitri" | "mirni" | "globoki";

export const SLOW_PRESETS: {
  id: SlowPresetId;
  factor: number;
  labelSi: string;
  labelEn: string;
  hintSi: string;
  hintEn: string;
}[] = [
  {
    id: "hitri",
    factor: 0.5,
    labelSi: "Hitri vdih",
    labelEn: "Quick breath",
    hintSi: "približno 2 minuti",
    hintEn: "about 2 minutes",
  },
  {
    id: "mirni",
    factor: 1,
    labelSi: "Mirni pogled",
    labelEn: "Calm gaze",
    hintSi: "približno 4 minute",
    hintEn: "about 4 minutes",
  },
  {
    id: "globoki",
    factor: 2,
    labelSi: "Globoki um",
    labelEn: "Deep mind",
    hintSi: "približno 8 minut",
    hintEn: "about 8 minutes",
  },
];

export function getSlowPreset(id: SlowPresetId) {
  return SLOW_PRESETS.find((p) => p.id === id) ?? SLOW_PRESETS[1];
}

/** Preprost zgoščevalnik za deterministične izbire iz zapisa. */
function hashSlug(slug: string): number {
  let hash = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    hash ^= slug.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function pickDeterministic<T>(list: T[], slug: string, salt: number): T {
  return list[(hashSlug(slug) + salt) % list.length];
}

/** Naloge za drugo fazo — iskanje podrobnosti (deterministična izbira). */
const DETAIL_HUNTS: { si: string; en: string }[] = [
  {
    si: "Poiščite najtemnejšo točko na sliki in ostanite z njo.",
    en: "Find the darkest point in the picture and stay with it.",
  },
  {
    si: "Poiščite najsvetlejši odsev in pomislite, odkod svetloba prihaja.",
    en: "Find the brightest reflection and think about where the light comes from.",
  },
  {
    si: "Poiščite najmanjšo podrobnost, ki ste jo skoraj spregledali.",
    en: "Find the smallest detail you almost missed.",
  },
  {
    si: "Poiščite obliko, ki se na sliki ponovi večkrat.",
    en: "Find a shape that repeats itself in the picture.",
  },
  {
    si: "Izberite eno črto in sledite pogledu po njej do konca.",
    en: "Pick one line and let your eyes follow it to the end.",
  },
  {
    si: "Poiščite nekaj, kar bi skoraj lahko dotaknili — in predstavljajte si občutek pod prsti.",
    en: "Find something you could almost touch — and imagine how it would feel.",
  },
];

/** Čutni zamisli za tretjo fazo — po kategoriji zapisa. */
const SENSORY: Record<ExhibitCategory, { si: string; en: string }> = {
  kraj: {
    si: "Slišite cerkveni zvon? Pod nogami škripi gramoz, nedeljsko jutro pa diha počasi.",
    en: "Can you hear the church bell? Gravel crunches underfoot and a Sunday morning breathes slowly.",
  },
  kolpa: {
    si: "Poslušnite: Kolpa liže breg. Zrak diši po reki in po toplih kamnih.",
    en: "Listen: the Kolpa licks the bank. The air smells of river and warm stones.",
  },
  vojna: {
    si: "Zrak je hladen. Železo diši po dežju, oddaljeni odmevi pa se počasi umirjajo.",
    en: "The air is cold. Iron smells of rain, and distant echoes slowly fade.",
  },
  narava: {
    si: "Šumi listje brez, oglašajo se ptiči — kateri zvok vam je najbližji?",
    en: "Birch leaves rustle, birds call — which sound is closest to you?",
  },
  gospodarstvo: {
    si: "Mlinski kamni brusijo, zrak je poln moke in svežega kruha.",
    en: "Millstones grind, the air is full of flour and fresh bread.",
  },
  sege: {
    si: "Nekdo tiho šepeta urok. V zraku je vonj zelišč in dimu z ognjišča.",
    en: "Someone whispers a charm. The air holds the scent of herbs and hearth smoke.",
  },
};

/** Zaključna razmišljanja za četrto fazo. */
const REFLECTIONS: { si: string; en: string }[] = [
  {
    si: "Kaj vas je pri tem zapisu najbolj presenetilo?",
    en: "What surprised you most about this record?",
  },
  {
    si: "Če bi ta predmet lahko govoril — kaj bi vas vprašal?",
    en: "If this object could speak — what would it ask you?",
  },
  {
    si: "Komu bi pokazali ta zapis in zakaj?",
    en: "Whom would you show this record to, and why?",
  },
  {
    si: "Kaj od tega spomina bi vzeli s seboj?",
    en: "What would you take away from this memory?",
  },
];

export type SlowPhase = {
  id: string;
  baseSeconds: number;
  titleSi: string;
  titleEn: string;
  promptSi: (ex: ExhibitDTO) => string;
  promptEn: (ex: ExhibitDTO) => string;
};

/** Štiri faze počasnega gledanja (vsako raztegljivo — WCAG 2.2.1). */
export const SLOW_PHASES: SlowPhase[] = [
  {
    id: "dih",
    baseSeconds: 40,
    titleSi: "Prihod",
    titleEn: "Arrival",
    promptSi: (ex) =>
      `Trije počasni vdihi. Pustite, da se ramena spustijo. Poglejte »${ex.titleSi}« takšnega, kot je — brez branja, brez iskanja. Kaj zagledate najprej?`,
    promptEn: (ex) =>
      `Three slow breaths. Let your shoulders drop. Look at “${ex.titleEn}” just as it is — without reading, without searching. What do you see first?`,
  },
  {
    id: "podrobnosti",
    baseSeconds: 60,
    titleSi: "Barve, oblike, teksture",
    titleEn: "Colours, shapes, textures",
    promptSi: (ex) =>
      `${pickDeterministic(DETAIL_HUNTS, ex.slug, 1).si} Katere barve so skupaj najbolj tihe?`,
    promptEn: (ex) =>
      `${pickDeterministic(DETAIL_HUNTS, ex.slug, 1).en} Which colours are quietest together?`,
  },
  {
    id: "vnotraj",
    baseSeconds: 90,
    titleSi: "Stopite v notri",
    titleEn: "Step inside",
    promptSi: (ex) =>
      `Za trenutek zaprite oči, nato jih znova odprite. Predstavljajte si, da stojite na tem kraju. ${SENSORY[ex.category].si}`,
    promptEn: (ex) =>
      `Close your eyes for a moment, then open them again. Imagine standing in that place. ${SENSORY[ex.category].en}`,
  },
  {
    id: "vez",
    baseSeconds: 60,
    titleSi: "Osebna vez",
    titleEn: "Personal connection",
    promptSi: (ex) =>
      `${pickDeterministic(REFLECTIONS, ex.slug, 3).si} Ni pravega odgovora — samo vaš.`,
    promptEn: (ex) =>
      `${pickDeterministic(REFLECTIONS, ex.slug, 3).en} There is no right answer — only yours.`,
  },
];

export function phaseDuration(phase: SlowPhase, preset: SlowPresetId): number {
  return Math.round(phase.baseSeconds * getSlowPreset(preset).factor * 1000);
}

export function totalDuration(preset: SlowPresetId): number {
  return SLOW_PHASES.reduce((sum, p) => sum + phaseDuration(p, preset), 0);
}

export function slowPhaseTitle(phase: SlowPhase, lang: Lang): string {
  return lang === "sl" ? phase.titleSi : phase.titleEn;
}

export function slowPhasePrompt(phase: SlowPhase, ex: ExhibitDTO, lang: Lang): string {
  return lang === "sl" ? phase.promptSi(ex) : phase.promptEn(ex);
}

/** Deljiva globoka povezava ?slow=<slug>. */
export function slowShareUrl(slug: string): string {
  return `${window.location.origin}/?slow=${slug}`;
}

// --- Zasebni zapiski počasnega gledanja (lokalno, brez računa) ---------

const NOTES_KEY = "mvg-slow-notes";

export function getSlowNote(slug: string): string {
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return "";
    const notes = JSON.parse(raw) as Record<string, string>;
    return typeof notes[slug] === "string" ? notes[slug] : "";
  } catch {
    return "";
  }
}

export function saveSlowNote(slug: string, note: string): void {
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    const notes = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    const trimmed = note.slice(0, 280);
    if (trimmed.trim()) notes[slug] = trimmed;
    else delete notes[slug];
    window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {
    // localStorage je poln ali onemogočen — mirno nadaljujemo.
  }
}

export function countSlowSessions(): number {
  try {
    const raw = window.localStorage.getItem(NOTES_KEY);
    if (!raw) return 0;
    const notes = JSON.parse(raw) as Record<string, string>;
    return Object.keys(notes).length;
  } catch {
    return 0;
  }
}
