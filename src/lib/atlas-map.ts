/**
 * ATLAS 1825 — MAP DATA MODEL (issue #42 §15, PASS 5).
 *
 * Zemljevid kot PODATKOVNI zemljevid: vsak objekt nosi node_id in
 * sledljivost do vira (evidence_url → /api/atlas/evidence?node=...).
 *
 * Čista, deterministična plast nad knowledge-graph-1825.json (piše
 * research-griblje/atlas-1825/build-knowledge-graph.py — ročno urejanje
 * prepovedano). Nič ne ugiba:
 *   - lat/lng STOJI samo tam, kjer ga graf že ima (A01 PROVIZORIČNO, 1 sidro);
 *   - A02–A05 objekti imajo georef UNKNOWN → brez koordinat (izračun bi bil
 *     izmišljotina, KG-F05/§12);
 *   - parcele imajo BREZ geometrije (§9: meje niso dokazane) — nikoli se
 *     ne riše "lepih" parcel;
 *   - hiša brez dokazane BP↔MO veze ostaje NOT_LOCATED (ni dokaz neobstoja).
 *
 * Sloji (#42 §15): map_objects · houses · toponyms · sheets.
 * Parcels/Persons/Events/SoThey so dosegljivi prek evidence API-ja
 * (klikljivi do vira), koordinat pa še nimajo — zato jih ta plast ne izmišlja.
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
      georef_status: sheet === "A01" ? "PROVIZORIČNO (1 sidro)" : "UNKNOWN (ni sidra)",
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
  /** Samo A01 (PROVIZORIČNO, 1 sidro). A02–A05 = vedno null (§12/KG-F05). */
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
          georef_status: "PROVIZORIČNO (1 sidro, sever-navzgor)",
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
 * Skupni odgovor (meta + disclaimers, #42 §10)
 * ------------------------------------------------------------------ */

export function mapData() {
  const mapObjects = mapObjectFeatures();
  const houses = houseFeatures();
  const toponyms = toponymFeatures();
  return {
    ok: true,
    val: kg.val,
    model: "atlas-1825 map data model v1 (issue #42 §15, PASS 5)",
    disclaimer:
      "Georeferenca je PROVIZORIČNA (A01: 1 sidro, sever-navzgor). A02–A05: brez sidra — brez koordinat. Sodobni OSM/satelitski zemljevid NI zgodovinski dokaz (§10).",
    counts: {
      map_objects: mapObjects.length,
      map_objects_a01: mapObjects.filter((m) => m.sheet === "A01").length,
      map_objects_other_sheets: mapObjects.filter((m) => m.sheet !== "A01").length,
      houses_total: houses.length,
      houses_located: houses.filter((h) => h.located).length,
      houses_not_located: houses.filter((h) => !h.located).length,
      toponyms: toponyms.length,
      sheets: SHEET_ORDER.length,
    },
    sheets: mapSheets(),
    layers: {
      map_objects: mapObjects,
      houses,
      toponyms,
    },
  };
}
