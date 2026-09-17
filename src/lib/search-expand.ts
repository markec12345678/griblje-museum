import { normalize } from "@/lib/normalize";

/**
 * Večjezična razširitev poizvedbe (query expansion) — vzorec Europeana:
 * vsebina zbirke je dokumentirana v slovenščini in angleščini, nemški in
 * italijanski obiskovalec pa išče v svojem jeziku. Preslikava pred iskanjem
 * doda angleški ekvivalent pogostih muzejskih pojmov — izvirna beseda
 * ostane v poizvedbi vedno (posojenke lahko zadenejo tudi same).
 *
 * Preslikava je namenoma skromna: pokriva pogost besednjak obiskovalca
 * vaškega muzeja (graje, šege, vojna, vsakdan), ne pa splošnega slovarja.
 */
const DE_IT_TO_EN: Record<string, string> = {
  // italijanščina → angleščina
  chiesa: "church",
  chiese: "church",
  scuola: "school",
  scuole: "school",
  guerra: "war",
  tabacco: "tobacco",
  cartolina: "postcard",
  cartoline: "postcard",
  fiume: "river",
  ponte: "bridge",
  campana: "bell",
  campane: "bell",
  matrimonio: "wedding",
  nascita: "birth",
  morte: "death",
  battesimo: "baptism",
  battesimi: "baptism",
  bambini: "children",
  bambino: "child",
  confine: "border",
  villaggio: "village",
  paese: "village",
  acqua: "water",
  neve: "snow",
  notte: "night",
  terra: "land",
  vino: "wine",
  pane: "bread",
  mulino: "mill",
  treno: "train",
  ferrovia: "railway",
  aeroporto: "airport",
  soldati: "soldiers",
  soldato: "soldier",
  partigiani: "partisans",
  partigiano: "partisan",
  monumento: "monument",
  cimitero: "cemetery",
  documento: "document",
  documenti: "document",
  fotografia: "photograph",
  fotografie: "photograph",
  donna: "woman",
  donne: "women",
  uomo: "man",
  uomini: "men",
  famiglia: "family",
  famiglie: "family",
  memoria: "memory",
  ricordo: "memory",
  ricordi: "memory",
  nave: "ship",
  emigranti: "emigrants",
  emigrato: "emigrant",
  fabbrica: "factory",
  officina: "workshop",
  lavoro: "work",
  maestro: "teacher",
  maestra: "teacher",
  insegnante: "teacher",
  usanza: "custom",
  usanze: "custom",
  tradizione: "tradition",
  costume: "costume",
  costumi: "costume",
  parrocchia: "parish",
  prete: "priest",
  sacerdote: "priest",
  liberazione: "liberation",
  occupazione: "occupation",

  // nemščina → angleščina
  kirche: "church",
  schule: "school",
  krieg: "war",
  tabak: "tobacco",
  postkarte: "postcard",
  fluss: "river",
  brucke: "bridge",
  glocke: "bell",
  glocken: "bell",
  hochzeit: "wedding",
  geburt: "birth",
  tod: "death",
  taufe: "baptism",
  kinder: "children",
  kind: "child",
  grenze: "border",
  dorf: "village",
  wasser: "water",
  schnee: "snow",
  nacht: "night",
  erde: "land",
  wein: "wine",
  brot: "bread",
  muhle: "mill",
  zug: "train",
  bahn: "railway",
  flugplatz: "airport",
  flugzeug: "aircraft",
  soldaten: "soldiers",
  soldat: "soldier",
  partisanen: "partisans",
  partisan: "partisan",
  denkmal: "monument",
  friedhof: "cemetery",
  dokument: "document",
  dokumente: "document",
  foto: "photograph",
  fotographie: "photograph",
  frau: "woman",
  frauen: "women",
  mann: "man",
  manner: "men",
  familie: "family",
  familien: "family",
  gedachtnis: "memory",
  erinnerung: "memory",
  erinnerungen: "memory",
  schiff: "ship",
  auswanderer: "emigrants",
  fabrik: "factory",
  werkstatt: "workshop",
  arbeit: "work",
  lehrer: "teacher",
  lehrerin: "teacher",
  brauch: "custom",
  brauche: "custom",
  tracht: "costume",
  pfarrer: "priest",
  gemeinde: "parish",
  besatzung: "occupation",
  befreiung: "liberation",
};

// Normalizirane ključe pripravimo enkrat ob zagonu (diakritike → osnovne črke).
const MAP = new Map(
  Object.entries(DE_IT_TO_EN).map(([k, v]) => [normalize(k), normalize(v)]),
);

/**
 * Vrne vse igle za iskanje: izvirna poizvedba + morebitni angleški
 * ekvivalenti (celotna poizvedba in posamezne besede). Izvirnik je
 * VEDRO prvi — zadetki izvirne besede imajo prednost pri urejanju.
 */
export function expandQuery(needle: string): string[] {
  const needles = new Set<string>([needle]);
  const direct = MAP.get(needle);
  if (direct) needles.add(direct);
  for (const word of needle.split(/\s+/)) {
    if (word.length < 3) continue;
    const mapped = MAP.get(word);
    if (mapped) needles.add(mapped);
  }
  return [...needles];
}
