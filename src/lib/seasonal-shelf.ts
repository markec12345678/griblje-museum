/**
 * Sezonska polica — kuriranski izbor zbirke po letnem času.
 *
 * Vzorec: muzejske rubrike »object of the month« (Saffron Walden Museum,
 * Kelsey Museum) in sezonska kurirstva Anchorage Museuma — majhen muzej
 * brez fizičnih vitrin lahko vseeno rotira zbirko: glede na datum
 * obiskovalca se na domači strani pojaviDrugacen, tematsko utemeljen
 * izbor. Rotacija je vidna odločitev, ne napaka (praksa Harvard Art
 * Museums): oznaka »menjava vsako leto«.
 *
 * Decembra se polica razširi v adventni koledar (vzorec: Glencairn
 * Museum, Ashmolean #AshmoleanAdvent) — 24 vrat, odklenjena so samo
 * današnja in pretekla, vrstni red je determinističen (vsako leto
 * drugačen, enak za vse obiskovalce).
 *
 * Datum je vir resnice: nič se ne shranjuje, odklepanje poteka po
 * lokalnem (ne UTC) koledarskem dne obiskovalca.
 */

/** Deterministična razpršitev (Fibonacci hashing) — ista oblika kot object-of-day. */
function hash32(n: number): number {
  let h = (n ^ 0x9e3779b9) | 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h = (h ^ (h >>> 16)) >>> 0;
  return h;
}

export type SeasonKey = "pomlad" | "poletje" | "jesen" | "zima";

export type Season = {
  key: SeasonKey;
  /** Meje po meteorološkem koledarju (mesec 1–12, dan). */
  fromMonth: number;
  fromDay: number;
  toMonth: number;
  toDay: number;
  titleSi: string;
  titleEn: string;
  /** Kuratorski razlog »zakaj zdaj« — en stavek, glas kustosa. */
  whySi: string;
  whyEn: string;
  /** Kurirani nabor slugov sezone (lahko se prekriva z drugimi sezonami). */
  slugs: string[];
};

export const SEASONS: Season[] = [
  {
    key: "pomlad",
    fromMonth: 3,
    fromDay: 1,
    toMonth: 5,
    toDay: 31,
    titleSi: "Pomlad na polici",
    titleEn: "Spring on the shelf",
    whySi:
      "Zeleni jurij ob 29. aprilu, štorklje, ki se vračajo iz Afrike, in reka po snegu — pomlad v Beli krajini je koledarski dogodek.",
    whyEn:
      "The green George at 29 April, storks returning from Africa, and the river after the snow — spring in Bela krajina is a calendar event.",
    slugs: [
      "jurjevanje",
      "storklje",
      "kolpa-reka",
      "bele-breze",
      "ribnik",
      "griblje-vas",
    ],
  },
  {
    key: "poletje",
    fromMonth: 6,
    fromDay: 1,
    toMonth: 8,
    toDay: 31,
    titleSi: "Poletje na polici",
    titleEn: "Summer on the shelf",
    whySi:
      "Kolpa doseže dvaindvajset stopinj in postane najtoplejša reka Slovenije — poletje tukaj živi ob vodi, od ribnika do pohoda ob bregovih.",
    whyEn:
      "The Kolpa reaches twenty-two degrees and becomes Slovenia's warmest river — summer here lives by the water, from the pond to the walk along the banks.",
    slugs: [
      "kolpa-reka",
      "ribnik",
      "vino-in-crnina",
      "sokcev-dvor",
      "storklje",
      "griblje-vas",
    ],
  },
  {
    key: "jesen",
    fromMonth: 9,
    fromDay: 1,
    toMonth: 11,
    toDay: 30,
    titleSi: "Jesen na polici",
    titleEn: "Autumn on the shelf",
    whySi:
      "Trgatev na apnenčastih legah, mlini, ki meljejo novo žito, in kuhinja, ki znova zadiši po fižolu in matevžu — jesen je čas pridelka.",
    whyEn:
      "The harvest on the limestone slopes, the mills grinding new grain, and a kitchen that smells again of beans and matevž — autumn is the season of the yield.",
    slugs: [
      "vino-in-crnina",
      "belokranjska-kuhinja",
      "mlini-na-kolpi",
      "tkalstvo",
      "belokranjska-hisa",
      "kolpa-reka",
    ],
  },
  {
    key: "zima",
    fromMonth: 12,
    fromDay: 1,
    toMonth: 2,
    toDay: 29,
    titleSi: "Zima na polici",
    titleEn: "Winter on the shelf",
    whySi:
      "Zimski večeri so bili večeri predenja, črna kuhinja pa srce hiše. Decembra se nad polico odpre še adventni koledar muzeja.",
    whyEn:
      "Winter evenings were spinning evenings, and the black kitchen was the heart of the house. In December the museum's advent calendar opens above the shelf.",
    slugs: [
      "tkalstvo",
      "belokranjska-hisa",
      "belokranjska-kuhinja",
      "niko-zupanic",
      "sveti-vid",
      "jurjevanje",
    ],
  },
];

/** Trenutna sezona za podani (lokalni) datum; vrnjeni indeks sezona + sama sezona. */
export function getSeason(now: Date): Season {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const asNumber = (month: number, day: number) => month * 100 + day;
  const today = asNumber(m, d);
  const season =
    SEASONS.find(
      (s) =>
        today >= asNumber(s.fromMonth, s.fromDay) &&
        today <= asNumber(s.toMonth, s.toDay)
    ) ?? SEASONS[0]; // 1.–29. 2. pokriva zima; nujno najde
  return season;
}

/**
 * Izbor sezone: 4 zapisi iz sezonskega nabora, deterministično razpršeni
 * po (leto, sezona) — vsako leto drugačen izbor, ves sezon enak za vse.
 */
export function getSeasonalPicks(
  season: Season,
  now: Date,
  count = 4
): number[] {
  const n = season.slugs.length;
  if (n === 0) return [];
  const year = now.getFullYear();
  const seed = hash32(year * 100 + season.key.length * 7 + season.fromMonth);
  const start = seed % n;
  return Array.from({ length: Math.min(count, n) }, (_, i) => (start + i) % n);
}

/* ------------------------------------------------------------------ */
/* Adventni koledar (1.–24. december)                                  */
/* ------------------------------------------------------------------ */

export const ADVENT_DAYS = 24;

/** Je danes adventni čas (1.–24. december, lokalni datum)? */
export function isAdventTime(now: Date): boolean {
  return now.getMonth() === 11 && now.getDate() >= 1 && now.getDate() <= ADVENT_DAYS;
}

/**
 * Zapis za določena vrata: deterministična izbira iz CELE zbirke
 * (0 … total-1) glede na (leto, dan) — vsako leto drugačen vrstni red,
 * isti za vse obiskovalce istega dne. Pri 24 vratih in manjši zbirki
 * se nekaj zapisov v enem decembru ponovi — pošteno priznano v opombi.
 */
export function getAdventIndex(day: number, now: Date, total: number): number {
  if (total <= 0) return -1;
  const seed = hash32(now.getFullYear() * 1000 + day * 37);
  return seed % total;
}

/** So vrata odklenjena? (današnji in pretekli dnevi decembra). */
export function isDoorUnlocked(day: number, now: Date): boolean {
  if (day < 1 || day > ADVENT_DAYS) return false;
  if (now.getMonth() !== 11) return false; // zunaj decembra ni odklenjeno nič
  return day <= now.getDate();
}
