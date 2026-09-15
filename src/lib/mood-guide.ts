import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";
import { normalize } from "@/lib/normalize";

/**
 * Vodnik po razpoloženju — deterministični »inspiration tool« po vzoru
 * Art Explorerja iz nove zbirke Rijksmuseuma (Q42/Fabrique, 2024).
 *
 * Kot pri Rijksmuseumu je namenoma ločen od iskanja: ne išče po
 * ključnih besedah, ampak vodi skozi tri vprašanja s ponujenimi
 * odgovori in iz zbire sestavi osebni izbor. Za razliko od CLIP
 * modela pri velikih muzejih je naš slovar popolnoma razločljiv:
 * vsak zadetek lahko poimenujemo (»ker govori o Kolpi«).
 */

export type MoodChip = {
  id: string;
  labelSi: string;
  labelEn: string;
  /** Tematski sklopi, ki jih odgovor izrazito vabi. */
  categories?: ExhibitCategory[];
  /** Ključne besede (neobčutljive na diakritike/velike črke). */
  keywords?: string[];
};

export type MoodQuestion = {
  id: string;
  titleSi: string;
  titleEn: string;
  subtitleSi: string;
  subtitleEn: string;
  chips: MoodChip[];
};

export const MOOD_QUESTIONS: MoodQuestion[] = [
  {
    id: "razpolozenje",
    titleSi: "Kaj vas danes vabi?",
    titleEn: "What draws you in today?",
    subtitleSi: "Izberite enega od štirih značajev obiska.",
    subtitleEn: "Pick one of four visit temperaments.",
    chips: [
      {
        id: "mir",
        labelSi: "Mir ob vodi",
        labelEn: "Quiet by the water",
        categories: ["kolpa", "narava"],
        keywords: ["reka", "kolpa", "ribnik", "voda", "mir", "topl", "breza", "storklja"],
      },
      {
        id: "zgodovina",
        labelSi: "Zgodovina na dotik",
        labelEn: "History within reach",
        categories: ["vojna", "kraj"],
        keywords: ["vojna", "meja", "letališče", "parlament", "uskoki", "1944", "1945", "1991", "1468", "1526", "zgodov"],
      },
      {
        id: "delo",
        labelSi: "Dela in roke",
        labelEn: "Work and hands",
        categories: ["gospodarstvo"],
        keywords: ["mlin", "vino", "črnina", "platno", "statva", "hiša", "tkalstvo", "lan", "žito"],
      },
      {
        id: "praznik",
        labelSi: "Praznik in okus",
        labelEn: "Feast and flavour",
        categories: ["sege"],
        keywords: ["pust", "jurje", "pogača", "salenjak", "matevž", "kuhinja", "šega", "maska", "pomlad"],
      },
    ],
  },
  {
    id: "cas",
    titleSi: "Koliko časa imate?",
    titleEn: "How much time do you have?",
    subtitleSi: "Muzej se prilagodi vašemu urniku.",
    subtitleEn: "The museum fits your schedule.",
    chips: [
      { id: "min2", labelSi: "Dve minuti", labelEn: "Two minutes" },
      { id: "min10", labelSi: "Deset minut", labelEn: "Ten minutes" },
      { id: "min30", labelSi: "Pol ure ali več", labelEn: "Half an hour or more" },
    ],
  },
  {
    id: "jakost",
    titleSi: "Slika ali beseda?",
    titleEn: "Picture or word?",
    subtitleSi: "Kaj naj vodi vaš sprehod?",
    subtitleEn: "What should lead your walk?",
    chips: [
      { id: "slika", labelSi: "Naj govorijo slike", labelEn: "Let pictures speak" },
      { id: "beseda", labelSi: "Naj pripovedujejo zgodbe", labelEn: "Let stories tell" },
    ],
  },
];

export function getChip(questionId: string, chipId: string): MoodChip | undefined {
  const question = MOOD_QUESTIONS.find((q) => q.id === questionId);
  return question?.chips.find((c) => c.id === chipId);
}

/** Prireditve ključnih besed za prikaz v angleščini (zadetki so iz slovenskih besedil). */
const KEYWORD_EN: Record<string, string> = {
  reka: "the river", kolpa: "the Kolpa", ribnik: "the pond", voda: "water",
  mir: "quiet", topl: "warmth", breza: "the birch", storklja: "the stork",
  vojna: "war", meja: "the border", letališče: "the airfield",
  parlament: "parliament", uskoki: "the Uskoks", zgodov: "history",
  mlin: "the mill", vino: "wine", črnina: "črnina", platno: "linen",
  statva: "the loom", hiša: "the house", tkalstvo: "weaving", lan: "flax",
  žito: "grain", pust: "carnival", jurje: "St. George", pogača: "pogača",
  salenjak: "salenjaki", matevž: "matevž", kuhinja: "the kitchen",
  šega: "customs", maska: "masks", pomlad: "spring",
};

/** Število zapisov v izboru glede na odgovor o času. */
export function moodResultCount(timeChipId: string | undefined): number {
  if (timeChipId === "min2") return 3;
  if (timeChipId === "min10") return 5;
  return 8;
}

export type MoodReason = { labelSi: string; labelEn: string };

export type MoodResult = {
  exhibit: ExhibitDTO;
  score: number;
  reasons: MoodReason[];
};

/**
 * Ocenjevanje zapisov za dane odgovore — čisto in deterministično:
 * iste odgovore vedno seštejeta v isti izbor (isti dan, isti vrstni red).
 *Žrebanja ni; vrstni red potrdita skupna točka in kuratorski vrstni red.
 */
export function scoreMood(
  exhibits: ExhibitDTO[],
  answers: Record<string, string>
): MoodResult[] {
  const moodChip = answers["razpolozenje"]
    ? getChip("razpolozenje", answers["razpolozenje"])
    : undefined;
  const timeChip = answers["cas"] ? getChip("cas", answers["cas"]) : undefined;
  const styleChip = answers["jakost"] ? getChip("jakost", answers["jakost"]) : undefined;

  const results = exhibits.map((exhibit) => {
    let score = 0;
    const reasons: MoodReason[] = [];

    const haystack = normalize(
      [
        exhibit.titleSi,
        exhibit.titleEn,
        exhibit.summarySi,
        exhibit.summaryEn,
        exhibit.storySi,
        exhibit.storyEn,
      ].join(" ")
    );

    if (moodChip) {
      if (moodChip.categories?.includes(exhibit.category)) {
        score += 3;
        reasons.push({
          labelSi: `spada v temo, ki jo vabi »${moodChip.labelSi.toLowerCase()}«`,
          labelEn: `belongs to the theme invited by “${moodChip.labelEn.toLowerCase()}”`,
        });
      }
      const hits = (moodChip.keywords ?? []).filter((kw) =>
        haystack.includes(normalize(kw))
      );
      if (hits.length > 0) {
        score += Math.min(hits.length, 3) * 1.5;
        // Utemeljitve iz prvih dveh zadetih ključnih besed
        // (v EN prikazu pretvorimo slovensko besedo v angleško prireditev).
        for (const hit of hits.slice(0, 2)) {
          reasons.push({
            labelSi: `govori o »${hit}«`,
            labelEn: `speaks of “${KEYWORD_EN[hit] ?? hit}”`,
          });
        }
      }
    }

    if (styleChip?.id === "slika" && exhibit.image) {
      score += 1.5;
      reasons.push({
        labelSi: "ima fotografijo predmeta",
        labelEn: "has a photograph of the subject",
      });
    }
    if (styleChip?.id === "beseda") {
      const storyLength = (exhibit.storySi.length + exhibit.storyEn.length) / 2;
      if (storyLength > 700) {
        score += 1.5;
        reasons.push({
          labelSi: "pripoveduje daljšo zgodbo",
          labelEn: "tells a longer story",
        });
      }
    }

    if (timeChip?.id === "min30" && exhibit.sources.length >= 3) {
      // Dolg obisk prenese tudi zapise z globljim izvorom virov.
      score += 0.5;
    }

    return { exhibit, score, reasons };
  });

  // Samo zapisi z vsaj enim zadetkom; nato točke + kuratorski red.
  const scored = results
    .filter((r) => r.score > 0)
    .sort(
      (a, b) => b.score - a.score || a.exhibit.sortOrder - b.exhibit.sortOrder
    );

  return scored;
}

/** Sestavi izbor: najboljše zadetke, ob pomanjkanju dopolni z dnevnim zaporom. */
export function buildMoodSelection(
  exhibits: ExhibitDTO[],
  answers: Record<string, string>
): MoodResult[] {
  const count = moodResultCount(answers["cas"]);
  const scored = scoreMood(exhibits, answers);
  if (scored.length >= count) return scored.slice(0, count);

  // Če odgovori ne pokrijejo izbora (redko), dopolni po kuratorskem redu.
  const chosen = new Set(scored.map((r) => r.exhibit.slug));
  const fill = exhibits
    .filter((ex) => !chosen.has(ex.slug))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const filled = [...scored];
  for (const ex of fill) {
    if (filled.length >= count) break;
    filled.push({ exhibit: ex, score: 0, reasons: [] });
  }
  return filled.slice(0, count);
}
