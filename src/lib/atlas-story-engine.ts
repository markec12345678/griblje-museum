/**
 * ATLAS 1825 — STORY ENGINE (issue #42 §16–§18 + §22, PASS 7, val 69).
 *
 * »Zemljevid → zgodba«: deterministični sestavljevalnik zgodb IZ
 * strukturiranih claims + sources (§19: »AI mora zgodbo sestaviti iz
 * strukturiranih claims + sources, ne iz prostega modelskega spomina«;
 * §17: »AI ne sme zapolnjevati praznin z domišljijo«).
 *
 * V1 je 100 % determinističen — BREZ LLM klica. Vsak generiran zgodbi
 * objekt ustreza story_engine_contract (val 68 / §22 / §43 §7):
 *   story_id · input_entity_ids · used_claim_ids · used_source_ids ·
 *   generation_timestamp · prompt_version · story_status
 * Pravilo pogodbe: »Zgodba brez povezav = NE-OBJAVLJENA« → story_status.
 *
 * §17 ločevanje: 🟢 DOKAZANO · 🟡 VERJETNO/NEPOPOLNO · 🔴 KONFLIKTNO ·
 * ⚪ NEZNANO — tier je čista funkcija evidence statusa (nikoli ugibanja).
 * §14: konflikti ostanejo vidni (nikoli skriti z mergeom).
 * §22: story_id + content_hash sta deterministična izvod podatkovne
 * verzije (kg_sha256) — če se podatki spremenijo, se spremeni ID/hash.
 *
 * Čista plast nad knowledge-graph-1825.json + story-graph-1825.json
 * (pišeta ju deterministična builderja — ročno urejanje prepovedano).
 * Nič ne ugiba: vrne samo to, kar je v grafu.
 */
import { createHash } from "node:crypto";
import kgRaw from "@/data/knowledge-graph-1825.json";
import sgRaw from "@/data/story-graph-1825.json";
import { evidenceUrl } from "@/lib/atlas-map";

/* ------------------------- vrste ------------------------- */

/** §17 — štiri ravni dokazanosti, obvezno ločene v vsaki zgodbi. */
export type EvidenceTier = "DOKAZANO" | "VERJETNO" | "KONFLIKTNO" | "NEZNANO";

export const EVIDENCE_TIER_ICONS: Record<EvidenceTier, string> = {
  DOKAZANO: "🟢",
  VERJETNO: "🟡",
  KONFLIKTNO: "🔴",
  NEZNANO: "⚪",
};

export type StoryItem = {
  text: string;
  tier: EvidenceTier;
  /** izvorni evidence status iz grafa (sledljivost tier → status) */
  status: string;
  source_ids: string[];
  claim_ids: string[];
  entity_ids?: string[];
};

export type StorySection = {
  title: string;
  items: StoryItem[];
};

export type StoryStatus = "EVIDENCED" | "PARTIAL_EVIDENCE" | "NOT_PUBLISHED";

/** story_engine_contract (val 68) + §22 reproducibilnost. */
export type StoryContract = {
  story_id: string;
  input_entity_ids: string[];
  used_claim_ids: string[];
  used_source_ids: string[];
  generation_timestamp: string;
  prompt_version: string;
  story_status: StoryStatus;
  /** determinističen hash vsebine zgodbe — §22: sprememba podatkov ⇒ sprememba hash-a */
  content_hash: string;
  /** podatkovna verzija, iz katere je zgodba sestavljena */
  kg_sha256: string;
  data_val: number;
};

export type EntityStory = {
  ok: true;
  scope: "entity";
  focus: {
    node_id: string;
    node_type: string;
    label: string;
    evidence_status: string;
  };
  headline: string;
  contract: StoryContract;
  sections: StorySection[];
  tier_breakdown: Record<EvidenceTier, number>;
  evidence_url: string;
  engine: { name: string; version: string; deterministic: true };
};

export type VillageStory = {
  ok: true;
  scope: "village";
  headline: string;
  contract: StoryContract;
  sections: StorySection[];
  tier_breakdown: Record<EvidenceTier, number>;
  engine: { name: string; version: string; deterministic: true };
};

/* ----------------------- podatkovne baze ----------------------- */

const kg = kgRaw as unknown as {
  val: number;
  title: string;
  coverage: Record<string, unknown>;
  node_stats: Record<string, number>;
  edge_stats: Record<string, number>;
  claim_stats: Record<string, number>;
  nodes: {
    node_id: string;
    node_type: string;
    label?: string;
    name_original?: string;
    house_no_1825?: string;
    evidence_status?: string;
    [key: string]: unknown;
  }[];
  edges: {
    relation_id: string;
    from_entity: string;
    relation_type: string;
    to_entity: string;
    date_period?: string;
    source_ids?: string[];
    evidence_status?: string;
    confidence?: string;
    notes?: string;
    conflict_refs?: string[];
    claim_ids?: string[];
  }[];
  claims: {
    claim_id: string;
    subject: string;
    predicate: string;
    object: string;
    source_ref?: { source: string; page?: number | null; pages?: number[] };
    status: string;
    period?: string;
    confidence?: string;
    notes?: string;
  }[];
  story_atoms: { story_id: string; generated_at?: string; [key: string]: unknown }[];
  research_gaps: {
    gap_id: string;
    missing_relation: string;
    current_result: string;
    next_source: string;
    status: string;
    tied_to?: string;
  }[];
};

const sg = sgRaw as unknown as {
  provenance: { kg_sha256?: string };
  relations: { relation_type: string; narrative_label: string }[];
};

/** O(1) indeksi (enak vzorec kot atlas-evidence.ts). */
const nodeIndex = new Map<string, (typeof kg.nodes)[number]>(
  kg.nodes.map((n) => [n.node_id, n])
);
const edgesByEntity = new Map<string, { out: typeof kg.edges; in: typeof kg.edges }>();
for (const e of kg.edges) {
  const a = edgesByEntity.get(e.from_entity) ?? { out: [], in: [] };
  a.out.push(e);
  edgesByEntity.set(e.from_entity, a);
  const b = edgesByEntity.get(e.to_entity) ?? { out: [], in: [] };
  b.in.push(e);
  edgesByEntity.set(e.to_entity, b);
}
const claimsByEntity = new Map<string, typeof kg.claims>();
for (const c of kg.claims) {
  for (const id of [c.subject, c.object]) {
    const arr = claimsByEntity.get(id) ?? [];
    arr.push(c);
    claimsByEntity.set(id, arr);
  }
}
const gapsByEntity = new Map<string, typeof kg.research_gaps>();
for (const g of kg.research_gaps) {
  const bp = g.missing_relation.match(/^BP (\d+)/);
  if (bp) {
    const id = `BP:${bp[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) {
      const arr = gapsByEntity.get(id) ?? [];
      arr.push(g);
      gapsByEntity.set(id, arr);
    }
    continue;
  }
  const house = g.missing_relation.match(/^HOUSE (\d+)/);
  if (house) {
    const id = `HOUSE:H-${house[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) {
      const arr = gapsByEntity.get(id) ?? [];
      arr.push(g);
      gapsByEntity.set(id, arr);
    }
  }
}

/** SLO narrativni znaki relacij iz story grafa (PASS 6 — ena resnica). */
const relationLabels = new Map<string, string>();
for (const r of sg.relations) {
  if (!relationLabels.has(r.relation_type)) relationLabels.set(r.relation_type, r.narrative_label);
}

const KG_SHA256 = sg.provenance.kg_sha256 ?? "UNKNOWN";
const ENGINE_VERSION = "atlas-story-engine-v1 (val 69, PASS 7)";
const PROMPT_VERSION =
  "deterministic-atlas-story-engine-v1 — brez LLM; zgodba sestavljena iz strukturiranih claims + sources (§19)";

/** §22: čas generiranja = čas gradnje podatkov (max generated_at story atomov) — determinističen. */
const GENERATION_TIMESTAMP = (() => {
  const stamps = kg.story_atoms
    .map((a) => a.generated_at)
    .filter((t): t is string => typeof t === "string" && t.length > 0)
    .sort();
  return stamps[stamps.length - 1] ?? "";
})();

/* -------------------- §17 tier preslikava -------------------- */

const TIER_EXACT: Record<string, EvidenceTier> = {
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
 * §17: evidence status → dokazostveni tier. Čista funkcija, popolna
 * preslikava (natančna tabela → varovalni vzorci; neznani status je
 * NIKOLI tiho DOKAZANO).
 */
export function evidenceTier(status: string | null | undefined): EvidenceTier {
  if (!status) return "NEZNANO";
  const exact = TIER_EXACT[status.trim()];
  if (exact) return exact;
  if (status.includes("CONFLICT")) return "KONFLIKTNO";
  if (status.includes("NOT_FOUND") || status.includes("UNRESOLVED") || status.includes("UNKNOWN") || status.includes("UNCERTAIN"))
    return "NEZNANO";
  if (status.includes("VERIFIED") || status.includes("CONFIRMED") || status.includes("STABLE"))
    return "DOKAZANO";
  return "VERJETNO";
}

/* ------------------------- pomožniki ------------------------- */

function nodeLabel(id: string): string {
  const n = nodeIndex.get(id);
  if (!n) return id;
  if (n.label) return n.label;
  if (n.name_original) return n.name_original;
  if (n.house_no_1825 !== undefined) return `Hiša št. ${n.house_no_1825}`;
  /* Parcela (val 73): berljiva oznaka — PUA "parcela II/201", PS "parcela PS 913
   * (str. 9)"; brez številke → node_id (varovalka). */
  if (n.node_type === "PARCEL") {
    const num = typeof n.parcel_number === "number" ? n.parcel_number : null;
    if (n.origin === "PS" && num !== null)
      return `parcela PS ${num}${typeof n.page === "number" ? ` (str. ${n.page})` : ""}`;
    if (n.section_original && num !== null) return `parcela ${n.section_original}/${num}`;
    if (num !== null) return `parcela ${num}`;
    return n.node_id;
  }
  return n.node_id;
}

function itemType(nodeId: string): string {
  return nodeIndex.get(nodeId)?.node_type ?? "UNKNOWN";
}

/** Kratka oznaka vira: "SRC-PUA p12" / "SRC-PT". */
function sourceTag(sourceId: string, page?: number | null): string {
  return page != null ? `${sourceId} p${page}` : sourceId;
}

function claimPageLabel(c: (typeof kg.claims)[number]): string {
  const ref = c.source_ref;
  if (!ref) return "";
  if (ref.page != null) return ` p${ref.page}`;
  if (ref.pages && ref.pages.length > 0) return ` p${ref.pages.join(",")}`;
  return "";
}

function item(
  text: string,
  status: string | null | undefined,
  sourceIds: string[],
  claimIds: string[] = [],
  entityIds: string[] = []
): StoryItem {
  return {
    text,
    tier: evidenceTier(status),
    status: status ?? "UNKNOWN",
    source_ids: [...new Set(sourceIds)].sort(),
    claim_ids: claimIds,
    entity_ids: entityIds.length > 0 ? entityIds : undefined,
  };
}

function tierBreakdown(sections: StorySection[]): Record<EvidenceTier, number> {
  const out: Record<EvidenceTier, number> = { DOKAZANO: 0, VERJETNO: 0, KONFLIKTNO: 0, NEZNANO: 0 };
  for (const s of sections) for (const i of s.items) out[i.tier] += 1;
  return out;
}

/** §22: content_hash — determinističen hash kanonične vsebine zgodbe. */
function contentHash(storyId: string, inputs: string[], sections: StorySection[]): string {
  const canonical = [
    storyId,
    ...[...inputs].sort(),
    ...sections.flatMap((s) => [
      s.title,
      ...s.items.map(
        (i) => `${i.tier}|${i.status}|${i.text}|${[...i.source_ids].sort().join(",")}|${[...i.claim_ids].sort().join(",")}`
      ),
    ]),
  ].join("||");
  return createHash("sha256").update(canonical).digest("hex");
}

function contract(
  storyId: string,
  inputEntityIds: string[],
  sections: StorySection[]
): StoryContract {
  const usedClaimIds = [
    ...new Set(sections.flatMap((s) => s.items.flatMap((i) => i.claim_ids))),
  ].sort();
  const usedSourceIds = [
    ...new Set(sections.flatMap((s) => s.items.flatMap((i) => i.source_ids))),
  ].sort();
  let story_status: StoryStatus;
  if (usedClaimIds.length > 0 && usedSourceIds.length > 0) story_status = "EVIDENCED";
  else if (usedClaimIds.length === 0 && usedSourceIds.length === 0) story_status = "NOT_PUBLISHED";
  else story_status = "PARTIAL_EVIDENCE";
  return {
    story_id: storyId,
    input_entity_ids: inputEntityIds,
    used_claim_ids: usedClaimIds,
    used_source_ids: usedSourceIds,
    generation_timestamp: GENERATION_TIMESTAMP,
    prompt_version: PROMPT_VERSION,
    story_status,
    content_hash: contentHash(storyId, inputEntityIds, sections),
    kg_sha256: KG_SHA256,
    data_val: kg.val,
  };
}

function storyId(scope: string, key: string): string {
  const h = createHash("sha256").update(`${scope}:${key}|${KG_SHA256}|story-engine-v1`).digest("hex");
  return `SE-${h.slice(0, 10).toUpperCase()}`;
}

const EMPTY_BREAKDOWN: Record<EvidenceTier, number> = { DOKAZANO: 0, VERJETNO: 0, KONFLIKTNO: 0, NEZNANO: 0 };

function engineMeta() {
  return { name: "ATLAS 1825 Story Engine", version: ENGINE_VERSION, deterministic: true as const };
}

/* --------------- §16: zgodba entitete (»ZGODBA TE HIŠE«) --------------- */

/** Meja prikaza dolgih seznamov (H-040 ima 121 parcel). */
const MAX_LIST_ITEMS = 12;

export function generateEntityStory(rawRef: string): EntityStory | null {
  const nodeId = resolveEntityRef(rawRef);
  if (!nodeId) return null;
  const node = nodeIndex.get(nodeId)!;
  const sections: StorySection[] = [];

  if (node.node_type === "HOUSE") {
    sections.push(...houseSections(nodeId, node));
  } else {
    sections.push(...genericSections(nodeId, node));
  }

  const breakdown = tierBreakdown(sections);
  return {
    ok: true,
    scope: "entity",
    focus: {
      node_id: node.node_id,
      node_type: node.node_type,
      label: nodeLabel(nodeId),
      evidence_status: node.evidence_status ?? "UNKNOWN",
    },
    headline: `Zgodba entitete: ${nodeLabel(nodeId)}`,
    contract: contract(storyId("entity", nodeId), [nodeId], sections),
    sections,
    tier_breakdown: breakdown,
    evidence_url: evidenceUrl(nodeId),
    engine: engineMeta(),
  };
}

/** Priročne oblike referenc (enaka pogodba kot /api/atlas/story-graph). */
export function resolveEntityRef(raw: string): string | null {
  const q = raw.trim();
  if (!q) return null;
  if (nodeIndex.has(q)) return q;
  const up = q.toUpperCase();
  const house =
    up.match(/^(?:HOUSE:?)?\s*H-(\d+)$/) ?? up.match(/^HOUSE\s+(\d+)$/);
  if (house) {
    const id = `HOUSE:H-${house[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) return id;
  }
  const bp = up.match(/^(?:BP:?)?\s*(\d{1,3})$/);
  if (bp) {
    const id = `BP:${bp[1].padStart(3, "0")}`;
    if (nodeIndex.has(id)) return id;
  }
  const candidates = [up.replace(/\s+/g, ""), up.startsWith("MO:") ? up.slice(3) : `MO:${up}`];
  for (const c of candidates) {
    if (nodeIndex.has(c)) return c;
  }
  return null;
}

/* ------------------------- HOUSE sekcije ------------------------- */

function houseSections(nodeId: string, node: (typeof kg.nodes)[number]): StorySection[] {
  const houseNo = String(node.house_no_1825 ?? nodeId);
  const sections: StorySection[] = [];

  /* 1. Osnovni dokumentirani podatki (§17: 1825) */
  const bpRefs = Array.isArray(node.bp_refs)
    ? (node.bp_refs as { bp: number; final_status: string }[])
    : [];
  const osnovni: StoryItem[] = [
    item(
      `Hišna številka 1825: ${houseNo} (${String(node.house_no_type ?? "gruble_house")}) — vir: register hiš (PUA + PS)`,
      "VERIFIED_FORM",
      ["SRC-PUA", "SRC-PS"],
      []
    ),
  ];
  if (bpRefs.length > 0) {
    for (const ref of bpRefs) {
      const bpId = `BP:${String(ref.bp).padStart(3, "0")}`;
      const bind = claimsByEntity
        .get(bpId)
        ?.find((c) => c.predicate === "BP_BOUND_TO_HOUSE" && c.object === nodeId);
      osnovni.push(
        item(
          `BP ${ref.bp} — vezava na hišo ${houseNo} (končni status reconciliacije: ${ref.final_status})`,
          ref.final_status,
          edgesByEntity
            .get(nodeId)
            ?.out.filter((e) => e.relation_type === "BP_BOUND_TO_HOUSE")
            .find((e) => e.from_entity === bpId)?.source_ids ?? [],
          bind ? [bind.claim_id] : [],
          [bpId]
        )
      );
    }
  } else {
    osnovni.push(
      item(`BP vezava za hišo ${houseNo} ni dokumentirana`, "NOT_FOUND", [], [])
    );
  }
  sections.push({ title: "Hiša 1825 — dokumentirani osnovni podatki", items: osnovni });

  /* 2. Lastništvo (§17: »kdo je dokumentiran kot lastnik«) */
  const ownership = (claimsByEntity.get(nodeId) ?? []).filter(
    (c) => c.predicate === "OWNER_DOCUMENTED" || c.predicate === "OWNER_VARIANT_DOCUMENTED"
  );
  const lastnistvo: StoryItem[] = ownership.map((c) => {
    const personLabel = nodeLabel(c.object);
    const variant = c.predicate === "OWNER_VARIANT_DOCUMENTED";
    return item(
      `${variant ? "Branje imena lastnika" : "Lastnik dokumentiran"}: ${personLabel} (${sourceTag(
        c.source_ref?.source ?? "UNKNOWN",
        c.source_ref?.page ?? null
      )})${c.period ? ` — ${c.period}` : ""}`,
      c.status,
      c.source_ref ? [c.source_ref.source] : [],
      [c.claim_id],
      [c.object]
    );
  });
  if (lastnistvo.length === 0) {
    lastnistvo.push(
      item(`Lastnik hiše ${houseNo} ni dokumentiran v prepisanih virih`, "NOT_FOUND", [], [])
    );
  }
  sections.push({ title: "Lastništvo 1825", items: lastnistvo });

  /* 3. Parcele (§17: »katere parcele so povezane, kakšna raba«) */
  const parcelEdges = (edgesByEntity.get(nodeId)?.out ?? []).filter(
    (e) => e.relation_type === "HAS_PARCEL"
  );
  /* Dokazani podatki najprej: parcele z dokumentirano rabo gredo na vrh
   * prikaza (stabilen sort ohranja prvotni vrstni red znotraj skupin). */
  const parcelEdgesShown = [...parcelEdges].sort((a, b) => {
    const au = nodeIndex.get(a.to_entity)?.land_use_category != null ? 0 : 1;
    const bu = nodeIndex.get(b.to_entity)?.land_use_category != null ? 0 : 1;
    return au - bu;
  });
  const parcele: StoryItem[] = [];
  if (parcelEdges.length > 0) {
    for (const e of parcelEdgesShown.slice(0, MAX_LIST_ITEMS)) {
      const parcel = nodeIndex.get(e.to_entity);
      const landUse = parcel?.land_use_category ?? null;
      parcele.push(
        item(
          `Parcela ${nodeLabel(e.to_entity)}${landUse ? ` — raba: ${String(landUse)}` : ""} (${sourceTag(
            e.source_ids?.[0] ?? "UNKNOWN"
          )})`,
          e.evidence_status,
          e.source_ids ?? [],
          e.claim_ids ?? [],
          [e.to_entity]
        )
      );
    }
    if (parcelEdges.length > MAX_LIST_ITEMS) {
      parcele.push(
        item(
          `…in še ${parcelEdges.length - MAX_LIST_ITEMS} parcel (celoten seznam: /api/atlas/evidence?node=${nodeId})`,
          "PARTIAL",
          [],
          []
        )
      );
    }
    const withLandUse = parcelEdges.filter(
      (e) => nodeIndex.get(e.to_entity)?.land_use_category != null
    ).length;
    if (withLandUse === 0) {
      parcele.push(
        item(
          `Raba zemljišča za ${parcelEdges.length} povezanih parcel NI dokumentirana po parceli — PV [373418] je prepisan (val 74): uradne AGREGATNE površine po kulturah (njive 413 J 870 K, pašniki 636 J 263 K, travniki 76 J 1480 K; skupaj 1221 J 1573 K), ne pa raba posamezne parcele (§4: ne ugibamo)`,
          "UNKNOWN",
          ["SRC-PV"],
          []
        )
      );
    } else if (withLandUse < parcelEdges.length) {
      parcele.push(
        item(
          `Raba zemljišča dokumentirana za ${withLandUse} od ${parcelEdges.length} povezanih parcel — preostalih ${
            parcelEdges.length - withLandUse
          } brez zapisa po parceli (PV [373418] prepisan val 74: samo agregatne površine po kulturah; per-parcelna raba čaka PS p56–143)`,
          "UNKNOWN",
          ["SRC-PV"],
          []
        )
      );
    }
  } else {
    parcele.push(item(`Povezane parcele niso dokumentirane`, "NOT_FOUND", [], []));
  }
  sections.push({ title: "Parcele in raba zemljišča", items: parcele });

  /* 4. Na katastrskem listu (§16: »kje je hiša na katastru«) */
  const naKatastru: StoryItem[] = [];
  for (const ref of bpRefs) {
    const bpId = `BP:${String(ref.bp).padStart(3, "0")}`;
    const moEdges = (edgesByEntity.get(bpId)?.in ?? []).filter(
      (e) => e.relation_type === "CORRESPONDS_TO_BP"
    );
    for (const e of moEdges) {
      const mo = nodeIndex.get(e.from_entity);
      const px = mo?.px as number[] | undefined;
      const sheet = String(mo?.sheet ?? "A01");
      naKatastru.push(
        item(
          `${nodeLabel(e.from_entity)} na listu ${sheet}${
            px ? ` (raster px ${px[0]}, ${px[1]})` : ""
          } — glifa ${String(mo?.glyph_tier ?? "UNKNOWN")}`,
          e.evidence_status,
          e.source_ids ?? [],
          e.claim_ids ?? [],
          [e.from_entity, bpId]
        )
      );
    }
  }
  if (naKatastru.length === 0) {
    naKatastru.push(
      item(`Lokacija na katastrskem listu ni dokumentirana (noben BP vezan na hišo ${houseNo} nima MAP_OBJECT glife)`, "NOT_FOUND", [], [])
    );
  }
  sections.push({ title: "Na katastrskem listu (A01–A05)", items: naKatastru });

  /* 5. Povezane osebe (§16: »povezane osebe«) */
  const osebe = new Map<string, string[]>();
  for (const c of claimsByEntity.get(nodeId) ?? []) {
    if (c.object.startsWith("PER-") || c.subject.startsWith("PER-")) {
      const personId = c.object.startsWith("PER-") ? c.object : c.subject;
      const arr = osebe.get(personId) ?? [];
      arr.push(c.claim_id);
      osebe.set(personId, arr);
    }
  }
  const osebeItems: StoryItem[] = [...osebe.entries()].slice(0, MAX_LIST_ITEMS).map(([pid, cids]) =>
    item(
      `Oseba: ${nodeLabel(pid)} (${cids.length} trditv${cids.length === 1 ? "" : "i"})`,
      nodeIndex.get(pid)?.evidence_status ?? "REVIEW",
      [],
      cids,
      [pid]
    )
  );
  if (osebeItems.length > 0) sections.push({ title: "Povezane osebe", items: osebeItems });

  /* 6. Dogodki (§17: »kasnejša zgodovina — samo če obstaja vir«) */
  const eventEdges = [
    ...(edgesByEntity.get(nodeId)?.out ?? []),
    ...(edgesByEntity.get(nodeId)?.in ?? []),
  ].filter((e) => e.relation_type === "AFFECTS_HOUSE");
  if (eventEdges.length > 0) {
    const dogodki = eventEdges.map((e) => {
      const other = e.from_entity === nodeId ? e.to_entity : e.from_entity;
      return item(
        `${nodeLabel(other)}${e.date_period ? ` (${e.date_period})` : ""}`,
        e.evidence_status,
        e.source_ids ?? [],
        e.claim_ids ?? [],
        [other]
      );
    });
    sections.push({ title: "Dokumentirani dogodki", items: dogodki });
  }

  /* 7. Konflikti (§14: nikoli skriti) */
  const konflikti: StoryItem[] = [];
  for (const c of claimsByEntity.get(nodeId) ?? []) {
    if (evidenceTier(c.status) === "KONFLIKTNO") {
      konflikti.push(
        item(
          `Konfliktna trditev: ${c.predicate} → ${nodeLabel(c.object)} (${sourceTag(
            c.source_ref?.source ?? "UNKNOWN",
            c.source_ref?.page ?? null
          )})`,
          c.status,
          c.source_ref ? [c.source_ref.source] : [],
          [c.claim_id],
          [c.object]
        )
      );
    }
  }
  for (const e of [...(edgesByEntity.get(nodeId)?.out ?? []), ...(edgesByEntity.get(nodeId)?.in ?? [])]) {
    if (e.conflict_refs && e.conflict_refs.length > 0) {
      konflikti.push(
        item(
          `Konflikt ${e.conflict_refs.join(", ")} na relaciji ${relationLabels.get(e.relation_type) ?? e.relation_type} → ${
            nodeLabel(e.from_entity === nodeId ? e.to_entity : e.from_entity)
          }`,
          e.evidence_status,
          e.source_ids ?? [],
          e.claim_ids ?? []
        )
      );
    }
  }
  if (konflikti.length > 0) sections.push({ title: "Konflikti (ostajajo vidni — §14)", items: konflikti });

  /* 8. Kaj še ne vemo (§17: jasno navedi manjkajoče podatke) */
  const neznano: StoryItem[] = [];
  for (const g of gapsByEntity.get(nodeId) ?? []) {
    neznano.push(
      item(
        `${g.gap_id}: ${g.missing_relation} — naslednji vir: ${g.next_source} (status: ${g.status})`,
        g.status.includes("OPEN") ? "UNKNOWN" : "PARTIAL",
        [],
        []
      )
    );
  }
  if (!eventEdges.length) {
    neznano.push(
      item(
        `Kasnejša zgodovina hiše ${houseNo} ni dokumentirana v trenutno prepisanih virih`,
        "UNKNOWN",
        [],
        []
      )
    );
  }
  const nodeTier = evidenceTier(node.evidence_status);
  if (nodeTier === "KONFLIKTNO" || nodeTier === "NEZNANO") {
    neznano.push(
      item(
        `Skupno dokazno stanje hiše je ${node.evidence_status} — pripravljenost zgodbe je omejena`,
        node.evidence_status,
        [],
        []
      )
    );
  }
  if (neznano.length > 0) sections.push({ title: "Kaj še ne vemo (§17)", items: neznano });

  return sections;
}

/* --------------------- splošne sekcije (BP/PERSON/PARCEL/TOPONYM/EVENT/MO/SOURCE) --------------------- */

function genericSections(nodeId: string, node: (typeof kg.nodes)[number]): StorySection[] {
  const sections: StorySection[] = [];

  /* Trditve — glavna dokazna vsebina (claim-first arhitektura §43 §3). */
  const claims = claimsByEntity.get(nodeId) ?? [];
  const trditve: StoryItem[] = claims.map((c) => {
    const other = c.subject === nodeId ? c.object : c.subject;
    const dir = c.subject === nodeId ? "→" : "←";
    return item(
      `${c.predicate} ${dir} ${nodeLabel(other)} (${sourceTag(
        c.source_ref?.source ?? "UNKNOWN",
        c.source_ref?.page ?? null
      )})${c.period ? ` — ${c.period}` : ""}`,
      c.status,
      c.source_ref ? [c.source_ref.source] : [],
      [c.claim_id],
      [other]
    );
  });
  if (trditve.length > 0) {
    sections.push({ title: "Dokumentirane trditve (claim-first)", items: trditve });
  }

  /* Relacije — SLO narrativni znaki iz story grafa (PASS 6). */
  const edges = [...(edgesByEntity.get(nodeId)?.out ?? []), ...(edgesByEntity.get(nodeId)?.in ?? [])];
  const byType = new Map<string, typeof edges>();
  for (const e of edges) {
    const arr = byType.get(e.relation_type) ?? [];
    arr.push(e);
    byType.set(e.relation_type, arr);
  }
  const relacije: StoryItem[] = [];
  for (const [type, arr] of [...byType.entries()].sort()) {
    const label = relationLabels.get(type) ?? type;
    /* Smera branja (§17): pripovedna oznaka opisuje relacijo IZ stališča
     * izvorne entitete. Če je fokus na ciljni entiteti (e.to_entity ===
     * nodeId), je oznaka zavajajoča (parcela »ima parcelo«: hiša) — zato
     * ekspliciten obrat za znane relacije; neznane ostanejo tehnične. */
    const REVERSE_LABELS: Record<string, string> = {
      HAS_PARCEL: "pripada hiši",
    };
    const shown = arr.slice(0, MAX_LIST_ITEMS);
    for (const e of shown) {
      const other = e.from_entity === nodeId ? e.to_entity : e.from_entity;
      const readLabel = e.to_entity === nodeId ? (REVERSE_LABELS[type] ?? label) : label;
      relacije.push(
        item(
          `${readLabel}: ${nodeLabel(other)}${e.date_period ? ` (${e.date_period})` : ""}`,
          e.evidence_status,
          e.source_ids ?? [],
          e.claim_ids ?? [],
          [other]
        )
      );
    }
    if (arr.length > shown.length) {
      relacije.push(
        item(
          `…in še ${arr.length - shown.length} relacij tipa ${type} (celoten seznam: /api/atlas/evidence?node=${nodeId})`,
          "PARTIAL",
          [],
          []
        )
      );
    }
  }
  if (relacije.length > 0) sections.push({ title: "Relacije v pripovednem grafu (§21)", items: relacije });

  /* Konflikti (§14). */
  const konflikti: StoryItem[] = claims
    .filter((c) => evidenceTier(c.status) === "KONFLIKTNO")
    .map((c) =>
      item(
        `Konfliktna trditev: ${c.predicate} → ${nodeLabel(c.object)}`,
        c.status,
        c.source_ref ? [c.source_ref.source] : [],
        [c.claim_id]
      )
    );
  if (konflikti.length > 0) sections.push({ title: "Konflikti (ostajajo vidni — §14)", items: konflikti });

  /* Kaj še ne vemo (§17). */
  const neznano: StoryItem[] = (gapsByEntity.get(nodeId) ?? []).map((g) =>
    item(
      `${g.gap_id}: ${g.missing_relation} — naslednji vir: ${g.next_source} (status: ${g.status})`,
      g.status.includes("OPEN") ? "UNKNOWN" : "PARTIAL",
      [],
      []
    )
  );
  if (claims.length === 0) {
    neznano.push(
      item(
        `Za to entiteto ni dokumentiranih trditev v grafu — zgodba NI-OBJAVLJENA dokler dokazna veriga ni zgrajena (story_engine_contract)`,
        "UNKNOWN",
        [],
        []
      )
    );
  }
  if (neznano.length > 0) sections.push({ title: "Kaj še ne vemo (§17)", items: neznano });

  return sections;
}

/* --------------- §18: zgodba celotne vasi (»ZGODBA GRIBELJ 1825«) --------------- */

/** List MAP_OBJECT-a: polje `sheet` nosijo samo A02/A05 — A01 iz node_id predpone. */
function moSheet(m: { node_id: string; sheet?: unknown }): string {
  if (typeof m.sheet === "string" && m.sheet.length > 0) return m.sheet;
  const match = m.node_id.match(/^MO:(MO-A0\d)-/);
  return match ? match[1].replace("MO-", "") : "UNKNOWN";
}

function countBy<T>(arr: T[], key: (x: T) => string): { key: string; count: number }[] {
  const m = new Map<string, number>();
  for (const x of arr) {
    const k = key(x);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].map(([k, count]) => ({ key: k, count })).sort((a, b) => b.count - a.count);
}

function breakdownItem(what: string, counts: { key: string; count: number }[], claimIds: string[] = [], sourceIds: string[] = []): StoryItem {
  const text = `${what}: ${counts.map((c) => `${c.count} ${c.key}`).join(", ")}`;
  return item(text, "VERIFIED", sourceIds, claimIds);
}

export function generateVillageStory(): VillageStory {
  const nodes = kg.nodes;
  const houses = nodes.filter((n) => n.node_type === "HOUSE");
  const persons = nodes.filter((n) => n.node_type === "PERSON");
  const parcels = nodes.filter((n) => n.node_type === "PARCEL");
  const bps = nodes.filter((n) => n.node_type === "BP");
  const toponyms = nodes.filter((n) => n.node_type === "TOPONYM");
  const events = nodes.filter((n) => n.node_type === "EVENT");
  const sources = nodes.filter((n) => n.node_type === "SOURCE");
  const mapObjects = nodes.filter((n) => n.node_type === "MAP_OBJECT");
  const sheets = sources.filter((n) => /^SRC-A0\d$/.test(n.node_id));
  const sections: StorySection[] = [];

  /* 1. Pokrajina in kraj (§18.1) */
  const gemeinde = toponyms.find((t) => t.node_id === "TP-001");
  sections.push({
    title: "1. Pokrajina in kraj",
    items: [
      item(
        `Gemeinde GRÜBLE (Griblje) v Beli krajini, Illyrien — ${toponyms.length} registriranih toponimov 1825; meja občine dokumentirana v PR (Grenz-Beschreibung, točke No.1–21)`,
        gemeinde?.evidence_status ?? "VERIFIED_FORM",
        ["SRC-PR", "SRC-A01"],
        ["C-00622"],
        ["TP-001", "TP-003"]
      ),
      item(
        `Prebivalstvo 1830 (PZ §3, p2 — Conscriptioins-Revisions-Resultate): 441 duš = 222 moških + 219 žensk (aritmetična vrata EXACT), v 70 hišah, 102 družin (Hofesgesessene) — prvi časovni korak za prihodnjo §20 časovno plast (val 75)`,
        "TRANSCRIBED",
        ["SRC-PZ"],
        []
      ),
    ],
  });

  /* 2. Katastrski listi (§18.2) */
  sections.push({
    title: "2. Katastrski listi (vsi 5 inventarizirani — §11)",
    items: sheets.map((s) => {
      const sheetCode = s.node_id.replace("SRC-", "");
      const count = mapObjects.filter((m) => moSheet(m) === sheetCode).length;
      return item(
        `${String(s.label)} — ${count} inventariziranih objektov (uodid ${String(s.uodid)})`,
        "VERIFIED_FORM",
        [s.node_id],
        [],
        [s.node_id]
      );
    }),
  });

  /* 3. Hiše (§18.3) */
  const houseBreakdown = countBy(houses, (h) => String(h.evidence_status ?? "UNKNOWN"));
  sections.push({
    title: "3. Hiše 1825",
    items: [
      breakdownItem(`${houses.length} hiš v registru po dokaznem stanju`, houseBreakdown, [], ["SRC-PUA", "SRC-PS"]),
    ],
  });

  /* 4. Lastniki in osebe (§18.4) */
  const personBreakdown = countBy(persons, (p) => String(p.person_type ?? "UNKNOWN"));
  sections.push({
    title: "4. Lastniki in osebe",
    items: [
      breakdownItem(`${persons.length} oseb v registru po vrsti`, personBreakdown, [], ["SRC-PUA", "SRC-PS", "SRC-PT"]),
      item(
        "Združevanje podobnih imen NI izvedeno samodejno (§5) — možni duplikati ostajajo označeni (possible_duplicate)",
        "VERIFIED_FORM",
        [],
        []
      ),
    ],
  });

  /* 5. Parcele (§18.5) */
  const parcelOrigins = countBy(parcels, (p) => String(p.origin ?? "UNKNOWN"));
  sections.push({
    title: "5. Parcele",
    items: [
      item(
        `${parcels.length} parcel prepisanih za k.o. N83 (sekcije I–V): ${parcelOrigins
          .map((o) => `${o.count} iz ${o.key === "PUA" ? "PUA (pripravljalni izpis)" : o.key}`)
          .join(", ")} (TRANSCRIBED)`,
        "TRANSCRIBED",
        ["SRC-PUA", "SRC-PS"],
        []
      ),
    ],
  });

  /* 6. Raba zemljišča (§18.6) — iskreno ločevanje dokumentiranega od neznanega (§9: nikoli ne ugibaj) */
  const landUseParcels = parcels.filter((p) => p.land_use_category != null);
  const documentedUse = landUseParcels.filter(
    (p) => String(p.land_use_category) !== "UNKNOWN"
  );
  sections.push({
    title: "6. Raba zemljišča",
    items: [
      ...(documentedUse.length > 0
        ? [
            item(
              `Raba zemljišča dokumentirana za ${documentedUse.length} parcel (vir: PS prepis): ${countBy(
                documentedUse,
                (p) => String(p.land_use_category)
              )
                .map((c) => `${c.key} ${c.count}`)
                .join(", ")}`,
              "TRANSCRIBED",
              ["SRC-PS"],
              []
            ),
          ]
        : []),
      item(
        `Raba zemljišča za preostalih ${
          parcels.length - documentedUse.length
        } parcel NI še dokumentirana po parceli${
          landUseParcels.length > documentedUse.length
            ? ` (od tega ${landUseParcels.length - documentedUse.length} z neznano kategorijo iz PS)`
            : ""
        } — PV [373418] prepisan (val 74): uradne agregatne površine po kulturah (skupaj 1221 J 1573 K = 7,032 km²), ne pa per-parcelna raba; NIČ ne ugibamo (§9)`,
        "UNKNOWN",
        ["SRC-PV"],
        []
      ),
      item(
        `PZ [373419] prepisan delno (val 75): Endresultat — 'Weiden mit Holznutzen' 558 J 846 K ≈ 3,224 km² kot lastna kategorija; ločenih 'Waldungen' v Endresultatu NI → napetost PV Wälder 0 vs PS 13 Wald parcel dobila razlago kategorij (gozdno-pašniška/silvopastoralna raba, F-PV-02); per-parcelni PS izrazi ostajajo nespremenjeni (§5)`,
        "TRANSCRIBED",
        ["SRC-PZ", "SRC-PV"],
        []
      ),
    ],
  });

  /* 7. Poti, voda, toponimi (§18.7) */
  const toponymTypes = countBy(toponyms, (t) => String(t.type ?? "UNKNOWN"));
  sections.push({
    title: "7. Toponimi, poti in voda",
    items: [
      breakdownItem(`${toponyms.length} toponimov po vrsti`, toponymTypes, [], ["SRC-A01", "SRC-PR"]),
      item(
        "Ločene poti in vodne objekte trenutni viri ne označujejo kot samostojne entitete — negativna ugotovitev (§13)",
        "NOT_FOUND",
        [],
        []
      ),
    ],
  });

  /* 8. Povezave (§18.8) */
  const claimPredicates = countBy(kg.claims, (c) => c.predicate);
  sections.push({
    title: "8. Povezave med entitetami",
    items: [
      breakdownItem(
        `${kg.claims.length} trditev in ${kg.edges.length} relacij v pripovednem grafu (§21: vsaka z virom + zaupanjem + obdobjem)`,
        claimPredicates,
        ["C-00622"],
        []
      ),
    ],
  });

  /* 9. Pomembni dokumentirani objekti (§18.9) */
  const church = mapObjects.find((m) => m.node_id === "MO:MO-A02-001");
  const moBySheet = countBy(mapObjects, (m) => moSheet(m));
  sections.push({
    title: "9. Pomembni dokumentirani objekti",
    items: [
      breakdownItem(`${mapObjects.length} MAP_OBJECT na listih`, moBySheet, [], ["SRC-A01", "SRC-A02", "SRC-A05"]),
      item(
        `Cerkev sv. Vid (St. Veith) s temnim križem na A02 — prva kartografska lokacija cerkve (F-A02-02)`,
        church ? String(church.evidence_status ?? "VERIFIED_FORM") : "UNKNOWN",
        ["SRC-A02"],
        [],
        church ? [church.node_id] : []
      ),
      item(
        `BP glife na A01: pokritost 18 (val 65) + 43 prior-only od 100 BP — ${bps.length} BP v reconciliaciji`,
        "VERIFIED",
        ["SRC-A01"],
        []
      ),
    ],
  });

  /* 10. Neznanke in raziskovalne vrzeli (§18.10 + §13) */
  const gapsOpen = kg.research_gaps.filter((g) => String(g.status).includes("OPEN")).length;
  const bpNotFound = bps.filter((b) => evidenceTier(String(b.evidence_status ?? "")) === "NEZNANO").length;
  const conflictClaims = kg.claims.filter((c) => evidenceTier(c.status) === "KONFLIKTNO").length;
  sections.push({
    title: "10. Neznanke in raziskovalne vrzeli (§13)",
    items: [
      item(
        `${kg.research_gaps.length} raziskovalnih vrzel (${gapsOpen} OPEN, ${kg.research_gaps.length - gapsOpen} razrešenih) — naslednji viri: PS p56–143 vrstični prepis (F-PV-03), PZ celotni vrstični prepis (F-PZ-04 Summa), PT p7 re-read @300dpi, PR re-read`,
        "UNKNOWN",
        [],
        []
      ),
      item(
        `${bpNotFound} BP brez dokazane lokacije — »NOT FOUND« NE pomeni, da objekt ni obstajal (§3)`,
        "NOT_FOUND",
        [],
        []
      ),
      item(
        `${conflictClaims} konfliktnih trditev ostaja vidnih v konfliktnem registru (§14: nikoli skrite z mergeom)`,
        "CONFLICT",
        [],
        []
      ),
    ],
  });

  return {
    ok: true,
    scope: "village",
    headline: "Zgodba Gribelj 1825 — rekonstrukcija na osnovi podatkov, ne literarna fikcija (§18)",
    contract: contract(storyId("village", "GRIBLJE-1825"), [], sections),
    sections,
    tier_breakdown: tierBreakdown(sections),
    engine: engineMeta(),
  };
}

/* ------------------------- izvoz surovih podatkov ------------------------- */

export const STORY_ENGINE_INVENTORY = {
  nodes: kg.nodes.length,
  edges: kg.edges.length,
  claims: kg.claims.length,
  research_gaps: kg.research_gaps.length,
  kg_sha256: KG_SHA256,
  data_val: kg.val,
  generation_timestamp: GENERATION_TIMESTAMP,
} as const;
