/**
 * ATLAS 1825 — MAP DATA MODEL (issue #42 §15, PASS 5).
 *
 * Zemljevid kot PODATKOVNI zemljevid: vsak objekt nosi node_id in
 * sledljivost do vira (evidence_url → /api/atlas/evidence?node=...).
 *
 * Čista, deterministična plast nad knowledge-graph-1825.json (piše
 * research-griblje/atlas-1825/build-knowledge-graph.py — ročno urejanje
 * prepovedano). Nič ne ugiba:
 *   - lat/lng STOJI samo tam, kjer ga graf že ima (A01 GEOREF v2, val 72:
 *     similariteta po reki Kolpi, ±38 m — glej georef-1825.json / F-GEO-01);
 *   - A02–A05 objekti imajo georef UNKNOWN → brez koordinat (izračun bi bil
 *     izmišljotina, KG-F05/§12);
 *   - parcele imajo BREZ geometrije (§9: meje niso dokazane) — nikoli se
 *     ne riše "lepih" parcel;
 *   - hiša brez dokazane BP↔MO veze ostaje NOT_LOCATED (ni dokaz neobstoja).
 *
 * Sloji (#42 §15 + §19 val 73): map_objects · houses · toponyms · parcels ·
 * sheets. Parcele so REGISTER (brez geometrije, §9) — nosijo rabo zemljišč
 * (PS: samo EXACT leksikalno, UNKNOWN z ohranjenim originalom; PUA: rabe ne
 * zapisuje → null), povezave na hiše (HAS_PARCEL) in sledljivost do vira.
 * Persons/Events/SoThey ostajajo prek evidence API-ja.
 */
import kgRaw from "@/data/knowledge-graph-1825.json";

export type AtlasNode = {
  node_id: string;
  node_type: string;
  [key: string]: unknown;
};

export type AtlasEdge = {
  relation_id: string;
  from_entity: string;
  relation_type: string;
  to_entity: string;
  date_period: string;
  source_ids: string[];
  evidence_status: string;
  confidence: string;
  notes?: string;
};

const kg = kgRaw as unknown as {
  val: number;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  coverage: Record<string, unknown>;
};

/** O(1) indeksi (zgrajeni enkrat na proces). */
const nodeIndex = new Map<string, AtlasNode>(kg.nodes.map((n) => [n.node_id, n]));

export function evidenceUrl(nodeId: string): string {
  return `/api/atlas/evidence?node=${encodeURIComponent(nodeId)}`;
}

/* ------------------------------------------------------------------ *
 * LISTI (§11 coverage matrix) — A01–A05 iz SOURCE vozlišč SRC-A0x
 * ------------------------------------------------------------------ */

export type MapSheet = {
  sheet: string;
  source_id: string;
  label: string;
  vac_details_url: string | null;
  map_objects: number;
  georef_status: string;
  evidence_url: string;
};

const SHEET_ORDER = ["A01", "A02", "A03", "A04", "A05"];

function sheetOfMo(mo: AtlasNode): string {
  // A01 vozlišča (val 65) še nimajo polja sheet; A02–A05 (val 66) ga nosijo.
  return typeof mo.sheet === "string" && mo.sheet ? mo.sheet : "A01";
}

/** GEOREF v2 status A01 (val 72) — enotni niz za sloje (F-GEO-01/02). */
export const GEOREF_V2_A01 = "GEOREF v2 (reka Kolpa, trim-RMS 38.2 m)";

export function mapSheets(): MapSheet[] {
  const counts = new Map<string, { objects: number; georef: string }>();
  for (const n of kg.nodes) {
    if (n.node_type !== "MAP_OBJECT") continue;
    const sheet = sheetOfMo(n);
    const cur = counts.get(sheet) ?? { objects: 0, georef: "" };
    cur.objects += 1;
    counts.set(sheet, cur);
  }
  const out: MapSheet[] = [];
  for (const sheet of SHEET_ORDER) {
    const src = nodeIndex.get(`SRC-${sheet}`);
    if (!src) continue;
    const c = counts.get(sheet) ?? { objects: 0, georef: "UNKNOWN" };
    out.push({
      sheet,
      source_id: src.node_id,
      label: (src.label as string) ?? src.node_id,
      vac_details_url: (src.vac_details_url as string) ?? null,
      map_objects: c.objects,
      georef_status: sheet === "A01" ? GEOREF_V2_A01 : "UNKNOWN (ni sidra)",
      evidence_url: evidenceUrl(src.node_id),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * MAP_OBJECT sloj — kartografski objekti (val 65 + 66)
 * ------------------------------------------------------------------ */

export type MapObjectFeature = {
  node_id: string;
  sheet: string;
  label: string;
  building_type: string;
  bp_glyph: string | null;
  glyph_tier: string;
  px: [number, number] | null;
  /** Samo A01 (GEOREF v2, val 72). A02–A05 = vedno null (§12/KG-F05). */
  lat: number | null;
  lng: number | null;
  georef_status: string;
  evidence_status: string;
  evidence_url: string;
};

export function mapObjectFeatures(sheet?: string): MapObjectFeature[] {
  const out: MapObjectFeature[] = [];
  for (const n of kg.nodes) {
    if (n.node_type !== "MAP_OBJECT") continue;
    const s = sheetOfMo(n);
    if (sheet && s !== sheet) continue;
    const px = Array.isArray(n.px) && n.px.length === 2 ? ([n.px[0], n.px[1]] as [number, number]) : null;
    const bpGlyph = (n.bp as string | undefined) ?? (n.bp_glyph as string | undefined) ?? null;
    out.push({
      node_id: n.node_id,
      sheet: s,
      label: (n.label as string) ?? n.node_id,
      building_type: (n.building_type as string) ?? "unclassified",
      bp_glyph: bpGlyph !== null && bpGlyph !== undefined ? String(bpGlyph) : null,
      glyph_tier: (n.glyph_tier as string) ?? "UNKNOWN",
      px,
      lat: typeof n.lat === "number" ? n.lat : null,
      lng: typeof n.lng === "number" ? n.lng : null,
      georef_status: (n.georef_status as string) ?? "UNKNOWN",
      evidence_status: (n.evidence_status as string) ?? "UNKNOWN",
      evidence_url: evidenceUrl(n.node_id),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * HOUSE sloj — hiša locirana SAMO prek dokazane verige
 * HOUSE ← BP_BOUND_TO_HOUSE ← BP ← CORRESPONDS_TO_BP ← MAP_OBJECT (A01)
 * ------------------------------------------------------------------ */

export type HouseBpRef = { bp: number; final_status: string; map_object: string | null };

export type HouseFeature = {
  node_id: string;
  house_no_1825: string;
  evidence_status: string;
  bp_refs: HouseBpRef[];
  /** true = obstaja A01 MAP_OBJECT za vsaj en BP hiše. */
  located: boolean;
  /** Ničelno, razen če je located — nikoli ne ugibamo položaja. */
  position: {
    lat: number;
    lng: number;
    px: [number, number];
    via_bp: number;
    map_object: string;
    georef_status: string;
  } | null;
  evidence_url: string;
};

/** BP → A01 MAP_OBJECT (samo DEPICTED_ON SRC-A01 objekti dajo koordinato). */
const bpToA01Mo = (() => {
  const m = new Map<number, AtlasNode>();
  for (const e of kg.edges) {
    if (e.relation_type !== "CORRESPONDS_TO_BP") continue;
    const bpNum = Number(e.to_entity.replace("BP:", ""));
    const mo = nodeIndex.get(e.from_entity);
    if (!mo || Number.isNaN(bpNum)) continue;
    if (sheetOfMo(mo) !== "A01") continue; // A02–A05: brez sidra → ne locira
    m.set(bpNum, mo);
  }
  return m;
})();

export function houseFeatures(): HouseFeature[] {
  const out: HouseFeature[] = [];
  for (const n of kg.nodes) {
    if (n.node_type !== "HOUSE") continue;
    const refsRaw = Array.isArray(n.bp_refs) ? n.bp_refs : [];
    const bpRefs: HouseBpRef[] = refsRaw
      .map((r) => {
        const bp = Number((r as { bp?: unknown }).bp);
        if (Number.isNaN(bp)) return null;
        const mo = bpToA01Mo.get(bp);
        return {
          bp,
          final_status: String((r as { final_status?: unknown }).final_status ?? "UNKNOWN"),
          map_object: mo ? mo.node_id : null,
        };
      })
      .filter((r): r is HouseBpRef => r !== null);

    /* Položaj: najmočnejši BP z A01 objektom (deterministično: rang statusa
     * veze val 57, izenačene → nižji bp). Pozicija = lokacija glife BP-ja,
     * vse bp_refs (tudi konfliktne) ostanejo izpostavljene — nič skritega. */
    const STATUS_RANK: Record<string, number> = {
      CONFIRMED: 6,
      "CONFIRMED-2x": 6,
      VERIFIED: 5,
      "VERIFIED-2x": 5,
      PROBABLE: 4,
      REVIEW: 3,
      SINGLE_SOURCE: 2,
      UNCERTAIN: 1,
      CONFLICT: 0,
    };
    const withMo = [...bpRefs]
      .filter((r) => r.map_object !== null)
      .sort(
        (a, b) =>
          (STATUS_RANK[a.final_status] ?? 0) - (STATUS_RANK[b.final_status] ?? 0) || a.bp - b.bp
      )
      .at(-1); // najvišji rang (sort naraščajoče → zadnji je najmočnejši)
    let position: HouseFeature["position"] = null;
    if (withMo) {
      const mo = nodeIndex.get(withMo.map_object!)!;
      const lat = typeof mo.lat === "number" ? mo.lat : null;
      const lng = typeof mo.lng === "number" ? mo.lng : null;
      if (lat !== null && lng !== null && Array.isArray(mo.px)) {
        position = {
          lat,
          lng,
          px: [mo.px[0], mo.px[1]],
          via_bp: withMo.bp,
          map_object: mo.node_id,
          georef_status: GEOREF_V2_A01,
        };
      }
    }

    out.push({
      node_id: n.node_id,
      house_no_1825: String(n.house_no_1825 ?? n.node_id),
      evidence_status: (n.evidence_status as string) ?? "UNKNOWN",
      bp_refs: bpRefs,
      located: position !== null,
      position,
      evidence_url: evidenceUrl(n.node_id),
    });
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * TOPONYM sloj — register (§12): brez koordinat (modern_mapping UNKNOWN)
 * ------------------------------------------------------------------ */

export type ToponymFeature = {
  node_id: string;
  label: string;
  type: string;
  historical_only: boolean;
  modern_mapping: string;
  evidence_status: string;
  evidence_url: string;
};

export function toponymFeatures(): ToponymFeature[] {
  return kg.nodes
    .filter((n) => n.node_type === "TOPONYM")
    .map((n) => ({
      node_id: n.node_id,
      label: (n.label as string) ?? n.node_id,
      type: (n.type as string) ?? "UNKNOWN",
      historical_only: Boolean(n.historical_only),
      modern_mapping: String(n.modern_mapping ?? "UNKNOWN"),
      evidence_status: (n.evidence_status as string) ?? "UNKNOWN",
      evidence_url: evidenceUrl(n.node_id),
    }));
}

/* ------------------------------------------------------------------ *
 * PARCEL sloj — register parcel z rabo (§19, val 73) — BREZ geometrije
 * (§9: meje niso dokazane, 0/2467). Raba: samo dokazana leksikalno.
 * ------------------------------------------------------------------ */

export type ParcelFeature = {
  node_id: string;
  /** PUA (operat urbarialnih akcij, raba ne zapisana) | PS (prost, raba leksikalno). */
  origin: string;
  section: string | null;
  parcel_number: number | null;
  /** Dokazana raba. null = vir rabe ne zapisuje (PUA); "UNKNOWN" = PS termin
   *  ni nedvoumen (Ried, Lehngut …) — original ohranjen (nikoli ne ugibaj). */
  land_use_category: string | null;
  land_use_original: string | null;
  co_referenced: boolean;
  /** Hiše povezane prek HAS_PARCEL (so-vlasništvo = značilnost katastra). */
  house_refs: string[];
  evidence_status: string;
  source_ids: string[];
  evidence_url: string;
};

/** Obratni indeks HAS_PARCEL: parcela → hiše (2865 vezav, zgrajen enkrat). */
const parcelToHouses = (() => {
  const m = new Map<string, string[]>();
  for (const e of kg.edges) {
    if (e.relation_type !== "HAS_PARCEL") continue;
    const list = m.get(e.to_entity);
    if (list) list.push(e.from_entity);
    else m.set(e.to_entity, [e.from_entity]);
  }
  for (const list of m.values()) list.sort(); // deterministično
  return m;
})();

export function parcelFeatures(): ParcelFeature[] {
  return kg.nodes
    .filter((n) => n.node_type === "PARCEL")
    .map((n) => ({
      node_id: n.node_id,
      origin: String(n.origin ?? "UNKNOWN"),
      section: (n.section_original as string | null) ?? null,
      parcel_number:
        typeof n.parcel_number === "number" ? n.parcel_number : null,
      land_use_category: (n.land_use_category as string | null) ?? null,
      land_use_original: (n.land_use_original as string | null) ?? null,
      co_referenced: Boolean(n.co_referenced),
      house_refs: parcelToHouses.get(n.node_id) ?? [],
      evidence_status: (n.evidence_status as string) ?? "UNKNOWN",
      source_ids: Array.isArray(n.source_ids)
        ? (n.source_ids as string[]).slice()
        : [],
      evidence_url: evidenceUrl(n.node_id),
    }));
}

/* ------------------------------------------------------------------ *
 * Skupni odgovor (meta + disclaimers, #42 §10)
 * ------------------------------------------------------------------ */

export function mapData() {
  const mapObjects = mapObjectFeatures();
  const houses = houseFeatures();
  const toponyms = toponymFeatures();
  const parcels = parcelFeatures();
  return {
    ok: true,
    val: kg.val,
    model: "atlas-1825 map data model v1 (issue #42 §15, PASS 5)",
    disclaimer:
      "Georeferenca A01 = GEOREF v2 (val 72): robustna similariteta po reki Kolpi (351 točk, trim-RMS ±38 m; validacija na stavbah mediana 17 m) — zgodovinska geometrija je transformirana, sodobna OSM podlaga ni zgodovinski dokaz (§10). A02–A05: brez sidra — brez koordinat. Parcele: brez geometrije (§9).",
    counts: {
      map_objects: mapObjects.length,
      map_objects_a01: mapObjects.filter((m) => m.sheet === "A01").length,
      map_objects_other_sheets: mapObjects.filter((m) => m.sheet !== "A01").length,
      houses_total: houses.length,
      houses_located: houses.filter((h) => h.located).length,
      houses_not_located: houses.filter((h) => !h.located).length,
      toponyms: toponyms.length,
      parcels: parcels.length,
      parcels_with_land_use: parcels.filter(
        (p) => p.land_use_category !== null && p.land_use_category !== "UNKNOWN"
      ).length,
      parcels_land_use_unknown: parcels.filter(
        (p) => p.land_use_category === "UNKNOWN"
      ).length,
      parcels_no_land_use_record: parcels.filter(
        (p) => p.land_use_category === null
      ).length,
      sheets: SHEET_ORDER.length,
    },
    sheets: mapSheets(),
    layers: {
      map_objects: mapObjects,
      houses,
      toponyms,
      parcels,
    },
  };
}
