/**
 * ČASOVNICA + ZEMLJEVID SPOMINA — vezna plast nad entitetnim registrom.
 * (39. sklop / TASK 40 — TIMELINE + MAP OF MEMORY)
 *
 * NAČELO: TA PLAST NE USTVARJA NOVIH ZGODOVINSKIH TRDITEV. Vsebuje samo
 * PREZENTACIJSKE klasifikacije obstoječih entitet (TASK 39) in obstoječih
 * koordinat zapisov (seme):
 *
 *     Timeline item → EventRef/TimeRef → evidence[] → zapis → vir
 *     Map item      → PlaceRef/zapis   → evidence[] → zapis → vir
 *
 * Kaj je tu ROČNO klasificirano (in zakaj je to varno):
 *  - NATANČNOST ČASA dogodka (EventPrecision): samo ODLOČA, ali UI nariše
 *    »≈«, in kako se kartica naslovi. PRIKAZANO besedilo je VEDNO
 *    SoftTime.labelSi/labelEn, KOT JE ZAPISANO — »konec marca 1945« se
 *    ne pretvori v 25. 3. 1945, intervali se ohranijo.
 *  - VRSTA dogodka (EventKind): muzejska skupina za filter (vojna, cerkev,
 *    ustanove …) — klasifikacija obstoječih dogodkov, ne nova trditev.
 *  - VEZ KRAJA NA KOORDINATO (PLACE_BINDINGS): kraj dobi točko SAMO, če
 *    njegov dokazni zapis nosi koordinato, ki JE lega tega kraja (zapis je
 *    subjekt o kraju, ali kraj izrecno imenuje — npr. SNOS v Črnomlju).
 *    Koordinata zapisov o drugih subjektih (npr. Kolpa pri zapisu o
 *    Dragoših) se NE uporabi. Kraj brez dokazane lege = UNRESOLVED.
 *
 * Posebno pravilo P1-E1 (MVG-014 ↔ MVG-056, isti dogodek?): dokler kustos
 * ne potrdi, se dogodek na časovnici prikaže LOČENO po zapisih — dve
 * kartici, vsaka nosi lastni naslov in obdobje zapisa — z vidno oznako
 * možne istovetnosti. Ne združujemo samodejno.
 *
 * Nič tukaj ne spreminja relatedExhibits()/walkStopOf() (OBJECT ↔ OBJECT)
 * in nič ne dodaja novih virov ali licenc.
 */

import {
  ENTITIES,
  entitiesForExhibit,
  type EntityRef,
  type EventRef,
  type PersonRef,
  type PlaceRef,
  type TimeRef,
} from "./entities";
import type { ExhibitDTO } from "./types";

// ---------------------------------------------------------------------------
// NATANČNOST ČASA — ročna klasifikacija 27 dogodkov (revizija FAZA 0)
// ---------------------------------------------------------------------------

/**
 * Natankočnost časa dogodka. Poganja SAMO oznako »≈« in polja filtra;
 * prikazano besedilo ostaja SoftTime.label, kot je zapisano v virih.
 */
export type EventPrecision =
  | "exact-date" // zapis s toplim dnem (npr. 6. september 1941)
  | "month" // leto + mesec (npr. junij 2026)
  | "interval" // razpon (npr. oktober – december 1918, 1880 → 1945)
  | "approximate" // izrecna približnost v samem zapisu (»konec marca«)
  | "year"; // samo leto (npr. 1854)

export const EVENT_PRECISION: Readonly<Record<string, EventPrecision>> = {
  // — z dnem —
  "event:zaseda-na-cesti-1941": "exact-date", // 6. september 1941
  "event:snos-zasedanje-1944": "exact-date", // 19.–20. februar 1944
  "event:gribeljci-po-svetu-2019": "exact-date", // 19. junij 2019
  "event:praznik-krajevne-skupnosti-2024": "exact-date", // 15. september 2024
  // — z mesecem —
  "event:blagoslov-solskega-poslopja-1889": "month", // november 1889
  "event:ustanovitev-muzejske-ucilnice-2022": "month", // junij 2022
  "event:petstoletnica-cerkve-2026": "month", // junij 2026
  // — intervali —
  "event:spanska-gripa-1918": "interval", // oktober – december 1918
  "event:izseljenski-val-1880-1914": "interval", // 1880 → 1914
  // — približnost, ZAPISANA v samem viru —
  "event:zracni-most-krasinec-1945": "approximate", // konec marca 1945 (48 ur)
  // — samo leto —
  "event:objava-slave-vojvodine-kranjske-1689": "year",
  "event:ustanovitev-obcine-griblje-1854": "year",
  "event:objava-einzelhof-1891": "year",
  "event:objava-novo-zivljenje-1914": "year",
  "event:ustanovitev-sem-1921": "year",
  "event:ustanovitev-pgd-griblje-1927": "year",
  "event:ukinitev-obcine-griblje-1933": "year",
  "event:ustanovitev-belokranjskega-muzejskega-drustva-1949": "year",
  "event:ustanovitev-sd-griblje-1985": "year",
  "event:meja-ob-kolpi-1991": "year",
  "event:ustanovitev-dkz-griblje-1996": "year",
  "event:vrnitev-glavnega-zvona-1998": "year",
  "event:ustanovitev-td-griblje-2000": "year",
  "event:blagoslov-zvona-2008": "year",
  "event:ustanovitev-kolesarske-sekcije-2011": "year",
  "event:prvi-kavbojski-zur-2024": "year",
  "event:gregorjevo-2026": "year",
};

// ---------------------------------------------------------------------------
// VRSTA DOGODKA — muzejske skupine za filter (klasifikacija, ne trditve)
// ---------------------------------------------------------------------------

export type EventKind =
  | "vojna-in-meja" // odpor, okupacija, meja — nosilna nit zbirke
  | "cerkev-in-zvonovi" // verski utrip vasi in usoda zvonov
  | "ustanove-in-drustva" // občina, gasilci, društva, muzejska učilnica
  | "knjige-in-objave" // tisk, ki je vas prvič zapisal
  | "vas-in-ljudje"; // srečanja, prazniki, odhodi

const EVENT_KIND: Readonly<Record<string, EventKind>> = {
  // — vojna in meja —
  "event:zaseda-na-cesti-1941": "vojna-in-meja",
  "event:snos-zasedanje-1944": "vojna-in-meja",
  "event:zracni-most-krasinec-1945": "vojna-in-meja",
  "event:spanska-gripa-1918": "vojna-in-meja",
  "event:meja-ob-kolpi-1991": "vojna-in-meja",
  // — cerkev in zvonovi —
  "event:vrnitev-glavnega-zvona-1998": "cerkev-in-zvonovi",
  "event:blagoslov-zvona-2008": "cerkev-in-zvonovi",
  "event:petstoletnica-cerkve-2026": "cerkev-in-zvonovi",
  // — ustanove in društva —
  "event:ustanovitev-obcine-griblje-1854": "ustanove-in-drustva",
  "event:ukinitev-obcine-griblje-1933": "ustanove-in-drustva",
  "event:ustanovitev-sem-1921": "ustanove-in-drustva",
  "event:ustanovitev-pgd-griblje-1927": "ustanove-in-drustva",
  "event:ustanovitev-belokranjskega-muzejskega-drustva-1949": "ustanove-in-drustva",
  "event:ustanovitev-sd-griblje-1985": "ustanove-in-drustva",
  "event:ustanovitev-dkz-griblje-1996": "ustanove-in-drustva",
  "event:ustanovitev-td-griblje-2000": "ustanove-in-drustva",
  "event:ustanovitev-kolesarske-sekcije-2011": "ustanove-in-drustva",
  "event:ustanovitev-muzejske-ucilnice-2022": "ustanove-in-drustva",
  // — knjige in objave —
  "event:objava-slave-vojvodine-kranjske-1689": "knjige-in-objave",
  "event:objava-einzelhof-1891": "knjige-in-objave",
  "event:objava-novo-zivljenje-1914": "knjige-in-objave",
  // — vas in ljudje —
  "event:izseljenski-val-1880-1914": "vas-in-ljudje",
  "event:blagoslov-solskega-poslopja-1889": "vas-in-ljudje",
  "event:gribeljci-po-svetu-2019": "vas-in-ljudje",
  "event:praznik-krajevne-skupnosti-2024": "vas-in-ljudje",
  "event:prvi-kavbojski-zur-2024": "vas-in-ljudje",
  "event:gregorjevo-2026": "vas-in-ljudje",
};

// ---------------------------------------------------------------------------
// P1-E1 — dogodki z odprtim vprašanjem istovetnosti: prikaz PO ZAPISIH
// ---------------------------------------------------------------------------

/**
 * Dogodki, ki jih kuratorska vrsta še ni potrdila kot eno istovetnost,
 * se na časovnici NE smejo pokazati kot en dogodek. Vsak DOKAZNI ZAPIS,
 * ki ga vprašanje (ENTITY_QUEUE) imenuje, dobi svojo kartico; kartice
 * nosijo skupno, vidno oznako možne istovetnosti.
 *
 * Trenutno velja samo P1-E1 (MVG-014 ↔ MVG-056 — isti dogodek?).
 * Ko kustos potrdi/zavrne, se vnos odstrani in dogodek se prikaže normalno.
 */
export const SPLIT_EVENTS: ReadonlyArray<{
  eventId: string;
  queueId: string;
  slugs: string[];
}> = [
  {
    eventId: "event:zracni-most-krasinec-1945",
    queueId: "P1-E1",
    slugs: ["evakuacija-1945", "zracni-most-krasinec"],
  },
];

// ---------------------------------------------------------------------------
// OBDOBJA — košarke po sortKey (deterministično)
// ---------------------------------------------------------------------------

export type EraKey = "zacetki" | "s19" | "vojni" | "povojni" | "danes";

export const ERA_ORDER: EraKey[] = ["zacetki", "s19", "vojni", "povojni", "danes"];

export function eraOfSortKey(sortKey: number): EraKey {
  if (sortKey < 1800) return "zacetki";
  if (sortKey < 1914) return "s19";
  if (sortKey <= 1945) return "vojni";
  if (sortKey < 1991) return "povojni";
  return "danes";
}

// ---------------------------------------------------------------------------
// ČASOVNICA — gradniki
// ---------------------------------------------------------------------------

/** Kartica časovnice: en dogodek (ali en zapis razcepljenega dogodka). */
export type TimelineItem = {
  /** Stabilen ključ (entitetni ID ali id + zapis). */
  key: string;
  /** Izvorna entiteta — vedno obstoječ EventRef/TimeRef iz registra. */
  entity: EventRef | TimeRef;
  /** Časovno sidro (TimeRef) — pas obdobja, ne dogodek. */
  isAnchor: boolean;
  precision: EventPrecision;
  kind: EventKind | null;
  sortKey: number;
  era: EraKey;
  /** Pri razcepu P1-E1: zapis, ki ga kartica predstavlja. */
  splitRecord: ExhibitDTO | null;
  /** Skupina razcepa (P1-E1): zapisi vprašanja, kartica je eden od njih. */
  splitGroup: { queueId: string; slugs: string[] } | null;
  /** Razcepljenost (P1-E1): possibleIdentity = queueId, sicer null. */
  possibleIdentity: string | null;
  /** Vsi dokazni zapisi entitete, razrešeni na DTO. */
  exhibits: ExhibitDTO[];
  /** Osebe in kraji, ki jih ti zapisi izpričajo (EXISTING vezi). */
  persons: PersonRef[];
  places: PlaceRef[];
};

/** Osebe/kraje, ki jih DANI zapis izpriča (obstoječa veza registra). */
function linksOfSlug(slug: string, kind: "person" | "place"): EntityRef[] {
  return entitiesForExhibit(slug).filter((e) => e.type === kind);
}

/** Entiteta → razrešeni dokazni zapisi (po vrstnem redu evidence). */
function exhibitsOfEntity(entity: EntityRef, bySlug: Map<string, ExhibitDTO>): ExhibitDTO[] {
  const out: ExhibitDTO[] = [];
  for (const ev of entity.evidence) {
    const ex = bySlug.get(ev.slug);
    if (ex && !out.some((o) => o.slug === ex.slug)) out.push(ex);
  }
  return out;
}

/**
 * Vse kartice časovnice iz obstoječega registra: 27 dogodkov + 6 časovnih
 * sider. Dogodki z odprtim P1-E1 se razcepijo po zapisih (glej SPLIT_EVENTS).
 * Funkcija je čista — enak vhod, enak izhod; nič ne prefetcha.
 */
export function timelineItems(exhibits: ExhibitDTO[]): TimelineItem[] {
  const bySlug = new Map(exhibits.map((e) => [e.slug, e]));
  const items: TimelineItem[] = [];

  for (const entity of ENTITIES) {
    if (entity.type === "event") {
      const ev = entity as EventRef;
      const sortKey = ev.time?.sortKey ?? 0;
      const base = {
        entity: ev,
        isAnchor: false,
        precision: EVENT_PRECISION[ev.id] ?? "year",
        kind: EVENT_KIND[ev.id] ?? null,
        sortKey,
        era: eraOfSortKey(sortKey),
      };
      const exhibitsAll = exhibitsOfEntity(ev, bySlug);
      const persons = collectLinked(exhibitsAll, "person");
      const places = collectLinked(exhibitsAll, "place");
      const split = SPLIT_EVENTS.find((s) => s.eventId === ev.id);

      if (!split) {
        items.push({
          ...base,
          key: ev.id,
          splitRecord: null,
          splitGroup: null,
          possibleIdentity: null,
          exhibits: exhibitsAll,
          persons,
          places,
        });
      } else {
        // P1-E1: vsak zapis iz vprašanja dobi LASTNO kartico z lastnim
        // naslovom in obdobjem zapisa — nikoli spojene predstaviteve.
        for (const slug of split.slugs) {
          const record = bySlug.get(slug);
          if (!record) continue;
          items.push({
            ...base,
            key: `${ev.id}::${slug}`,
            splitRecord: record,
            splitGroup: { queueId: split.queueId, slugs: split.slugs },
            possibleIdentity: split.queueId,
            exhibits: exhibitsAll,
            persons,
            places,
          });
        }
      }
    } else if (entity.type === "time") {
      const tm = entity as TimeRef;
      const sortKey = tm.time?.sortKey ?? 0;
      items.push({
        key: tm.id,
        entity: tm,
        isAnchor: true,
        precision: tm.time.labelSi.includes("–") ? "interval" : "year",
        kind: null,
        sortKey,
        era: eraOfSortKey(sortKey),
        splitRecord: null,
        splitGroup: null,
        possibleIdentity: null,
        exhibits: exhibitsOfEntity(tm, bySlug),
        persons: collectLinked(exhibitsOfEntity(tm, bySlug), "person"),
        places: collectLinked(exhibitsOfEntity(tm, bySlug), "place"),
      });
    }
  }

  return items.sort((a, b) => a.sortKey - b.sortKey || a.key.localeCompare(b.key));
}

/** Osebe/kraji, ki jih dani zapisi izpričajo — brez podvajanj, v redu registra. */
function collectLinked(exhibits: ExhibitDTO[], kind: "person"): PersonRef[];
function collectLinked(exhibits: ExhibitDTO[], kind: "place"): PlaceRef[];
function collectLinked(
  exhibits: ExhibitDTO[],
  kind: "person" | "place"
): (PersonRef | PlaceRef)[] {
  const out: (PersonRef | PlaceRef)[] = [];
  for (const ex of exhibits) {
    for (const e of linksOfSlug(ex.slug, kind)) {
      if (!out.some((o) => o.id === e.id)) out.push(e as PersonRef | PlaceRef);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// ZEMLJEVID SPOMINA — dokazane lege krajev (PLACE_BINDINGS)
// ---------------------------------------------------------------------------

/**
 * Stanje lege kraja:
 *  - "resolved"       — dokazana točkovna lega (prek dokaznega zapisa);
 *  - "within-village" — zaselki znotraj vasi: lastna točka NI zapisana
 *                       (skupni zapis o zaselkih nosi eno približno točko,
 *                       ki ne razloči zaselkov — riše se v plasti zapisov);
 *  - "region"         — pokrajina: točkovna lega po naravi ni smiselna;
 *  - "unresolved"     — kraj še nima preverjene lokacije.
 */
export type PlaceLocationStatus =
  | "resolved"
  | "within-village"
  | "region"
  | "unresolved";

/**
 * VEZE KRAJEV NA KOORDINATE — vsaka dokazana v muzejskih podatkih:
 * koordinata zapisa JE lega tega kraja (zapis je o kraju oz. kraj izrecno
 * nosi). Kraji, kjer koordinata zapisa pripada DRUGEMU subjektu (npr.
 * Kolpa pri Dragoših, Otok za Krasinec), so namenoma IZPUŠČENI.
 *
 * 26 krajev = 11 dokazanih + 4 zaselki + 1 pokrajina + 10 brez lege.
 */
const PLACE_BINDINGS: Readonly<Record<string, { viaSlug: string }>> = {
  "place:griblje": { viaSlug: "griblje-vas" }, // MVG-001 — središče vasi (natančno)
  "place:cerkev-svetega-vida": { viaSlug: "sveti-vid" }, // MVG-002 — zapis je o cerkvi
  "place:kolpa": { viaSlug: "kolpa-reka" }, // MVG-006 — zapis je o reki
  "place:sokcev-dvor": { viaSlug: "sokcev-dvor" }, // MVG-005 — zapis je o dvoru
  "place:zunici": { viaSlug: "sokcev-dvor" }, // MVG-005 — dvor stoji v Žuničih (zapis to izpriča)
  "place:vaski-ribnik": { viaSlug: "ribnik" }, // MVG-016 — zapis je o ribniku
  "place:cerkvisce": { viaSlug: "cerkvisce" }, // MVG-040 — zapis je o Cerkvišču
  "place:kucar": { viaSlug: "kucar-podzemelj" }, // MVG-060 — zapis je o hribu
  "place:partizansko-letalisce-otok": { viaSlug: "letalisce-otok-1944" }, // MVG-013 — zapis je o letališču
  "place:crnomelj": { viaSlug: "snos-crnomelj-1944" }, // MVG-012 — SNOS je zasedal V Črnomlju
  "place:metlika": { viaSlug: "konrad-barle" }, // MVG-059 — Barle je v Metliki poučeval 35 let
};

/** Zaselki Gribelj — veriga znotraj vasi, lastne točke niso zapisane. */
const WITHIN_VILLAGE: ReadonlySet<string> = new Set([
  "place:dolnje-griblje",
  "place:srednje-griblje",
  "place:gornje-griblje",
  "place:brinsko-selo",
]);

/** Pokrajina — brez točkovne lege po naravi. */
const REGION_PLACES: ReadonlySet<string> = new Set(["place:bela-krajina"]);

/** Stanje lege danega kraja (deterministično iz vezanih tabel). */
export function placeStatus(place: PlaceRef): PlaceLocationStatus {
  if (PLACE_BINDINGS[place.id]) return "resolved";
  if (WITHIN_VILLAGE.has(place.id)) return "within-village";
  if (REGION_PLACES.has(place.id)) return "region";
  return "unresolved";
}

/** Kraj na zemljevidu spomina: lega (če je dokazana) + spomin. */
export type PlaceMemoryItem = {
  place: PlaceRef;
  status: PlaceLocationStatus;
  /** Dokazana točkovna lega — samo za status "resolved". */
  location: { lat: number; lng: number; approx: boolean; viaSlug: string } | null;
  /** Zapis, ki nosi lego (za prikaz dokaza vezi). */
  locationVia: ExhibitDTO | null;
  /** Vsi dokazni zapisi kraja. */
  exhibits: ExhibitDTO[];
  /** Osebe, ki jih ti zapisi izpričajo (registrske vezi). */
  persons: PersonRef[];
  /** Dogodki, ki jih ti zapisi izpričajo (registrske vezi). */
  events: EventRef[];
};

/**
 * Vsi kraji spomina iz registra (26) z dokazanimi legami in vezmi.
 * NIČ tu ne geokodira in nič ne izmišljuje — kraji brez dokazane
 * lege ostanejo unresolved in vidno razloženi.
 */
export function placeMemory(exhibits: ExhibitDTO[]): PlaceMemoryItem[] {
  const bySlug = new Map(exhibits.map((e) => [e.slug, e]));

  return ENTITIES.filter((e): e is PlaceRef => e.type === "place").map((place) => {
    const binding = PLACE_BINDINGS[place.id];
    const via = binding ? bySlug.get(binding.viaSlug) : undefined;
    const status = placeStatus(place);
    const exhibitsAll = exhibitsOfEntity(place, bySlug);
    const events = exhibitsAll.flatMap((ex) =>
      entitiesForExhibit(ex.slug).filter((e): e is EventRef => e.type === "event")
    );
    const dedupEvents = events.filter(
      (e, i) => events.findIndex((o) => o.id === e.id) === i
    );

    return {
      place,
      status,
      location:
        status === "resolved" && via && via.lat != null && via.lng != null
          ? {
              lat: via.lat,
              lng: via.lng,
              // Normalizacija: seme ima coordsApprox opcijsko, DTO boolean.
              approx: Boolean(via.coordsApprox),
              viaSlug: binding!.viaSlug,
            }
          : null,
      locationVia:
        status === "resolved" && via
          ? via
          : null,
      exhibits: exhibitsAll,
      persons: collectLinked(exhibitsAll, "person"),
      events: dedupEvents,
    };
  });
}

/** Zapisi s preverjeno lokacijo — PLAST 1 zemljevida spomina (obstoječe). */
export function objectLayer(exhibits: ExhibitDTO[]): ExhibitDTO[] {
  return exhibits.filter((ex) => ex.lat != null && ex.lng != null);
}
