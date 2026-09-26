/**
 * EXPLORE 1825 — čista logika načina zgodbe (issue #42 §19, val 71).
 *
 * §19: uporabnik klikne hišo/parcelo/osebo/toponim/vir, filtrira lastnike,
 * BP, dokazno stanje, prikaže samo dokazano / konflikte / neznano — nato
 * »Povej mi zgodbo tega kraja.« Zgodba se sestavi iz strukturiranih
 * claims + sources (story engine, §17/§19) — ne iz prostega spomina modela.
 *
 * Ta modul vsebuje SAMO deterministične funkcije (brez React, brez fetcha):
 * preslikava status → dokazni tir, filtri vidnosti markerjev in sestava
 * referenc entitet za Story Engine API. Vse je testirljivo brez DOM.
 */

export type ExploreTier = "DOKAZANO" | "VERJETNO" | "KONFLIKTNO" | "NEZNANO";

export type ExploreMode = "all" | "evidenced" | "conflicts" | "unknown";

export type ExploreFilters = {
  /** vse | samo dokazano | konflikti | neznano (§19: trije posebni prikazi) */
  mode: ExploreMode;
  /** prosto besedilo: BP, hišna številka, lastnik, ime objekta/toponima */
  query: string;
};

/** Vrstica statičnega registra stavb (cadastre-a01.json). */
export type ExploreBuildingRow = {
  bp: string;
  house_no?: number;
  owner?: string;
  owner_status?: string;
  conf?: string;
};

/** Vrstica sloja hiš iz /api/atlas/map. */
export type ExploreKgHouse = {
  node_id: string;
  house_no_1825: string;
  evidence_status: string;
  located: boolean;
};

/** Vrstica sloja kartografskih objektov iz /api/atlas/map. */
export type ExploreKgObject = {
  node_id: string;
  label: string;
  bp_glyph: string | null;
  evidence_status: string;
  sheet: string | null;
};

/**
 * Preslikava statusa dokaza v dokazni tir (§17). Statični sloj (cadastre
 * register) ima redkejše statuse — eksplicitno pravilo, dokumentirano:
 *  - owner_status "VERIFIED-2x" → DOKAZANO (dvojno branje PT p7),
 *  - vezan lastnik brez verifikacije → VERJETNO,
 *  - brez lastnika → NEZNANO.
 * KG sloji uporabljajo bogatejše statuse → evidenceTier iz story engine.
 */
export function exploreTierOfStaticRow(row: ExploreBuildingRow): ExploreTier {
  if (row.owner_status === "VERIFIED-2x") return "DOKAZANO";
  if (row.owner) return "VERJETNO";
  return "NEZNANO";
}

/**
 * TIER_EXACT — natančna zrcalna tabela atlas-story-engine.evidenceTier (§17).
 * Zakaj duplikat: engine uvaža celoten KG JSON (2,4 MB) na nivoju modula —
 * client komponenta NE sme vleči tega v bundle. Testi (atlas-explore.test.ts)
 * vzpostavljajo pariteto teh dveh preslikav čez celoten alfabet statusov KG,
 * da se ne razideta.
 */
const TIER_EXACT: Record<string, ExploreTier> = {
  "CONFIRMED-2x": "DOKAZANO",
  CONFIRMED: "DOKAZANO",
  "VERIFIED-2x": "DOKAZANO",
  VERIFIED: "DOKAZANO",
  VERIFIED_FORM: "DOKAZANO",
  STABLE: "DOKAZANO",
  FOUND: "DOKAZANO",
  TRANSCRIBED: "DOKAZANO",
  PROBABLE: "VERJETNO",
  REVIEW: "VERJETNO",
  SINGLE_SOURCE: "VERJETNO",
  PROVISIONAL: "VERJETNO",
  PARTIAL: "VERJETNO",
  TRANSCRIBED_PARTIAL: "VERJETNO",
  UNKNOWN_SEMANTICS: "VERJETNO",
  CONFLICT: "KONFLIKTNO",
  "REVIEW-CONFLICT": "KONFLIKTNO",
  UNCERTAIN: "NEZNANO",
  UNKNOWN: "NEZNANO",
  NOT_FOUND: "NEZNANO",
  UNRESOLVED: "NEZNANO",
};

/**
 * §17: evidence status → dokazni tir (zrcalna preslikava story engine-a).
 * Natančna tabela → varovalni vzorci; neznani status je NIKOLI tiho DOKAZANO.
 */
export function exploreTierOfStatus(status: string | null | undefined): ExploreTier {
  if (!status) return "NEZNANO";
  const exact = TIER_EXACT[status.trim()];
  if (exact) return exact;
  if (status.includes("CONFLICT")) return "KONFLIKTNO";
  if (
    status.includes("NOT_FOUND") ||
    status.includes("UNRESOLVED") ||
    status.includes("UNKNOWN") ||
    status.includes("UNCERTAIN")
  )
    return "NEZNANO";
  if (status.includes("VERIFIED") || status.includes("CONFIRMED") || status.includes("STABLE"))
    return "DOKAZANO";
  return "VERJETNO";
}

/** KONFLIKT prepoznamo po konvenciji registra konfliktov (val 59): substring CONFLICT. */
export function isConflictStatus(status: string | null | undefined): boolean {
  return (status ?? "").toUpperCase().includes("CONFLICT");
}

/** NOT_FOUND varovalo: NOT_FOUND ujemanje PRED substring FOUND (vzorec val 69). */
export function isNotFoundStatus(status: string | null | undefined): boolean {
  return (status ?? "").toUpperCase().includes("NOT_FOUND");
}

/** Ali vrsta statične vrste pade v izbrani način prikaza (§19). */
export function staticRowVisible(row: ExploreBuildingRow, mode: ExploreMode): boolean {
  const tier = exploreTierOfStaticRow(row);
  switch (mode) {
    case "evidenced":
      return tier === "DOKAZANO";
    case "conflicts":
      return isConflictStatus(row.owner_status);
    case "unknown":
      return tier === "NEZNANO";
    default:
      return true;
  }
}

/** Besedilni filter (BP / hišna številka / lastnik / labela). */
export function matchesExploreQuery(
  query: string,
  fields: (string | number | null | undefined)[]
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((f) => String(f ?? "").toLowerCase().includes(q));
}

/** Reference entitete za Story Engine: BP → node BP (podano na 3 mesta, vzorec BP:0xx). */
export function bpNodeRef(bp: string | number): string {
  const n = typeof bp === "number" ? bp : Number.parseInt(bp, 10);
  if (!Number.isFinite(n)) return `BP:${bp}`;
  return `BP:${String(n).padStart(3, "0")}`;
}

/** Pogodba §22: NOT_PUBLISHED zgodba ni objavljena — UI pokaže pošten blok. */
export function storyIsPublished(story: { contract?: { story_status?: string } } | null): boolean {
  return story?.contract?.story_status === "EVIDENCED" || story?.contract?.story_status === "PARTIAL_EVIDENCE";
}

/** Povzetek vidnosti za panel (šteje vidne statične vrste + KG sloje). */
export function exploreCounts(
  buildings: ExploreBuildingRow[],
  kgHouses: ExploreKgHouse[],
  kgObjects: ExploreKgObject[],
  filters: ExploreFilters,
  tierOf: (status: string) => ExploreTier
): { visibleBuildings: number; visibleHouses: number; visibleObjects: number } {
  let visibleBuildings = 0;
  for (const b of buildings) {
    if (!staticRowVisible(b, filters.mode)) continue;
    if (!matchesExploreQuery(filters.query, [b.bp, b.house_no, b.owner])) continue;
    visibleBuildings += 1;
  }
  let visibleHouses = 0;
  for (const h of kgHouses) {
    if (!h.located) continue;
    if (!modeAllowsTier(tierOf(h.evidence_status), filters.mode)) continue;
    if (!matchesExploreQuery(filters.query, [h.house_no_1825, h.node_id])) continue;
    visibleHouses += 1;
  }
  let visibleObjects = 0;
  for (const m of kgObjects) {
    if (!modeAllowsTier(tierOf(m.evidence_status), filters.mode)) continue;
    if (!matchesExploreQuery(filters.query, [m.label, m.bp_glyph, m.node_id])) continue;
    visibleObjects += 1;
  }
  return { visibleBuildings, visibleHouses, visibleObjects };
}

/** Ali tir pade v način prikaza (§19: samo dokazano / konflikti / neznano). */
export function modeAllowsTier(tier: ExploreTier, mode: ExploreMode): boolean {
  switch (mode) {
    case "evidenced":
      return tier === "DOKAZANO";
    case "conflicts":
      return tier === "KONFLIKTNO";
    case "unknown":
      return tier === "NEZNANO";
    default:
      return true;
  }
}

/* ==================================================================== *
 * PARCELNI SLOJ RABE (§19, val 73) — parcele kot REGISTER (§9: brez
 * geometrije). Raba: samo dokazana leksikalno; dve ločeni »nezanki«:
 *  - UNKNOWN = PS termin ni nedvoumen (Ried, Lehngut …) — original ohranjen,
 *  - NONE    = vir rabe ne zapisuje (PUA).
 * Nikoli ne ugibaj rabe zemljišča (§4 železno pravilo).
 * ==================================================================== */

/** Raba iz /api/atlas/map layers.parcels (atlas-map.ParcelFeature). */
export type ExploreParcel = {
  node_id: string;
  origin: string;
  section: string | null;
  parcel_number: number | null;
  land_use_category: string | null;
  land_use_original: string | null;
  co_referenced: boolean;
  house_refs: string[];
  evidence_status: string;
};

/** Vedro rabe: kategorije + UNKNOWN (PS TERM-UNCLEAR) + NONE (PUA brez zapisa). */
export type LandUseBucket =
  | "njiva"
  | "travnik"
  | "gozd"
  | "vrt"
  | "pašnik"
  | "drugo"
  | "UNKNOWN"
  | "NONE";

/** Zaporedje vedier za filtre in sortiranje (dokazana raba najprej). */
export const LAND_USE_ORDER: LandUseBucket[] = [
  "njiva",
  "travnik",
  "gozd",
  "vrt",
  "pašnik",
  "drugo",
  "UNKNOWN",
  "NONE",
];

/** Filter rabe: "all" ali določeno vedro. */
export type LandUseFilter = "all" | LandUseBucket;

/** Kategorija/ null → vedro. Neznana kategorija → NONE? Ne — varovalka: */
export function landUseBucketOf(category: string | null | undefined): LandUseBucket {
  if (category === null || category === undefined || category === "") return "NONE";
  const c = String(category).trim().toLowerCase();
  if ((LAND_USE_ORDER as string[]).includes(c)) return c as LandUseBucket;
  if (c === "unknown") return "UNKNOWN";
  // Neznana kategorija NI vedro "drugo" (drugo = dokazana mešanica iz registra) —
  // varovalka: obravnavaj kot UNKNOWN, nikoli tiho kot dokazano.
  return "UNKNOWN";
}

/** Dokazni tir parcele = tir njenega evidence_statusa (zrcalno TIER_EXACT). */
export function parcelTier(parcel: ExploreParcel): ExploreTier {
  return exploreTierOfStatus(parcel.evidence_status);
}

/** Kratek prikaz parcele: PUA "II/201", PS "PS 913", varovalka = node_id. */
export function parcelLabel(
  p: Pick<ExploreParcel, "node_id" | "origin" | "section" | "parcel_number">
): string {
  if (p.origin === "PS") return `PS ${p.parcel_number ?? "?"}`;
  if (p.section && p.parcel_number !== null) return `${p.section}/${p.parcel_number}`;
  return p.node_id.replace("PARCEL:", "");
}

/** Besedilni filter za parcele: št. parcele, sekcija, raba (original + kategorija), hiše, node_id. */
export function parcelMatchesQuery(query: string, parcel: ExploreParcel): boolean {
  return matchesExploreQuery(query, [
    parcel.node_id,
    parcel.section,
    parcel.parcel_number,
    parcel.land_use_category,
    parcel.land_use_original,
    ...parcel.house_refs,
  ]);
}

/** Ali parcela pade v izbrani način prikaza + filter rabe (§19). */
export function parcelVisible(
  parcel: ExploreParcel,
  mode: ExploreMode,
  landUse: LandUseFilter
): boolean {
  if (!modeAllowsTier(parcelTier(parcel), mode)) return false;
  if (landUse !== "all" && landUseBucketOf(parcel.land_use_category) !== landUse) return false;
  return true;
}

/** Števec vedier rabe (za čipe filtra) — determinističen zapis. */
export function parcelLandUseCounts(
  parcels: ExploreParcel[]
): Record<LandUseBucket, number> {
  const counts = {
    njiva: 0,
    travnik: 0,
    gozd: 0,
    vrt: 0,
    "pašnik": 0,
    drugo: 0,
    UNKNOWN: 0,
    NONE: 0,
  } as Record<LandUseBucket, number>;
  for (const p of parcels) counts[landUseBucketOf(p.land_use_category)] += 1;
  return counts;
}

/** Romanske sekcije I–V v naravnem redu; nejasne variante na konec (po nizu). */
const ROMAN_RANK: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5 };

/** Determinističen vrstni red brskanja: dokazana raba najprej (LAND_USE_ORDER),
 *  nato sekcija I–V, številka parcele, node_id. */
export function sortParcelsForBrowse(parcels: ExploreParcel[]): ExploreParcel[] {
  return [...parcels].sort((a, b) => {
    const bucketDiff =
      LAND_USE_ORDER.indexOf(landUseBucketOf(a.land_use_category)) -
      LAND_USE_ORDER.indexOf(landUseBucketOf(b.land_use_category));
    if (bucketDiff !== 0) return bucketDiff;
    const secA = a.section ?? "";
    const secB = b.section ?? "";
    const rankA = ROMAN_RANK[secA] ?? 99;
    const rankB = ROMAN_RANK[secB] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    if (secA !== secB) return secA.localeCompare(secB, "en");
    const numA = a.parcel_number ?? Number.MAX_SAFE_INTEGER;
    const numB = b.parcel_number ?? Number.MAX_SAFE_INTEGER;
    if (numA !== numB) return numA - numB;
    return a.node_id.localeCompare(b.node_id, "en");
  });
}

/** Povzetek parcelnega sloja za panel (vidne / vse + števec vedier). */
export function parcelExploreCounts(
  parcels: ExploreParcel[],
  mode: ExploreMode,
  landUse: LandUseFilter,
  query: string
): { visible: number; total: number; buckets: Record<LandUseBucket, number> } {
  let visible = 0;
  for (const p of parcels) {
    if (
      parcelVisible(p, mode, landUse) &&
      parcelMatchesQuery(query, p)
    ) {
      visible += 1;
    }
  }
  return { visible, total: parcels.length, buckets: parcelLandUseCounts(parcels) };
}
