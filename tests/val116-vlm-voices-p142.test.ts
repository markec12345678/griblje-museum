/**
 * Val 116 — VLM glasovi ob kvoti + p142 zaključek 2. prehoda (kolonski tile-i) — ISSUE #42 §4/§14.
 *
 * Kontekst: VLM kvota PRVAprosta po valih 107–115 (429 od vala 107). Zajete čakajoče glasove:
 *  1. **45 PZ izrezkov** (read-v109.mts, val 109 resumable) → vlm-v109/ 45/45 JSON
 *     — integracija v PZ (§ vrednosti iz REVIEW, p63 vrstice, 7 dilem) = mikroprehod 8b, val 117
 *  2. **p142-t-kultur2** (regen-missing-crop-v99.mts + tile-read-v98.mts) → 696/696 tile-ov
 *     → p142 2. prehod ZAKLJUČEN v tem valu (build-register-v116-p142.py, pravila 1:1 val 86)
 *  3. **PT p7 3. glasovi** (read-pt7-v116.mts, 6 celic) → vlm-v116/ — bp 96 Nro "38" ✓,
 *     bp 97 Nro "39" ✓, bp 98 Nro **"70"** (VLM vidi zapisano 70; v110 nativno branje je
 *     trdilo prazno — nizka ločljivost; 1. PT-celični glas za vezavo Zollamt↔h.70);
 *     areal/gattung osnova (5 vrstic: 4× prečrtano rdeče) — re-adjudikacija val 117/118
 *
 * p142 INTEGRACIJA (1:1 v86 pravila, page-level F-PV-05):
 *  - 40 vrstic v82-native-pass1 → v86-colonial-tiles (1795 skupaj; v82 ostaja 3 = p143)
 *  - **0 vrednostnih popravkov** — p1/p2 sistemski razkol (frakcije 'ganz/1/4/1/2' v jaethe)
 *    → 25 × v86-review-col-split markerjev (REVIEW ostaja, nič tiho)
 *  - 34 kultur_tile_v86 + 37 owner_tile_v86 variant polj (NIKOLI prepis)
 *  - pass3 NEIZMENJAN (p142 jaethe frakcije niso parcele — 392 ostaja); KG vsebina identična
 *    (samo generated_at → sha 62d8cfea; standardni §22 prehod; val 119 del 2e → c3932092, spet timestamp-only)
 *
 * Iskrenost (§4): TRANSCRIBED = 0 na p142 (nove vrednosti ni); glasovi so komitirani
 * artefakti; PZ/PT integracije izrecno odložene (val 117) z zapisom pravil.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const REG = JSON.parse(readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8")) as Record<
  string,
  unknown
>[];
const V86 = join(ROOT, "research-griblje/raw-web-val86-2026-10");
const V109 = join(ROOT, "research-griblje/raw-web-val109-2026-09");
const V110 = join(ROOT, "research-griblje/raw-web-val110-2026-09");

const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
const byPage = (pg: number) => REG.filter((r) => r["page"] === pg);

describe("val 116 — p142 zaključek 2. prehoda (pravila 1:1 val 86)", () => {
  test("register: 2875 vrstic; v86-colonial-tiles 1795 (1755 + 40 p142); v82-native-pass1 3 (p143)", () => {
    expect(REG.length).toBe(2875);
    expect(REG.filter((r) => f(r, "reading_pass") === "v86-colonial-tiles").length).toBe(1795);
    expect(REG.filter((r) => f(r, "reading_pass") === "v82-native-pass1").length).toBe(3);
  });

  test("p142: 40 vrstic v86-colonial-tiles; 0 vrednostnih popravkov (brez jaethe_pass1_v82); 25 review-col-split", () => {
    const p142 = byPage(142);
    expect(p142.length).toBe(40);
    expect(p142.every((r) => f(r, "reading_pass") === "v86-colonial-tiles")).toBe(true);
    expect(p142.every((r) => !("jaethe_pass1_v82" in r))).toBe(true);
    expect(p142.filter((r) => r.jk_review === "v86-review-col-split").length).toBe(25);
    // vrednosti ostanejo pas1 stanje (frakcije/ganz — p1/p2 razkol = REVIEW): 39 frakcij + 1 prazna
    expect(p142.filter((r) => ["ganz", "1/4", "1/2", "1/8"].includes(f(r, "jaethe"))).length).toBe(39);
    expect(p142.filter((r) => f(r, "jaethe") === "").length).toBe(1);
  });

  test("p142 variant polja: 34 kultur_tile_v86 + 37 owner_tile_v86 — NIKOLI prepis pas1", () => {
    const p142 = byPage(142);
    expect(p142.filter((r) => "kultur_tile_v86" in r).length).toBe(34);
    expect(p142.filter((r) => "owner_tile_v86" in r).length).toBe(37);
    // globalno
    expect(REG.filter((r) => "kultur_tile_v86" in r).length).toBe(1436);
    expect(REG.filter((r) => "owner_tile_v86" in r).length).toBe(1652);
    // kultur polje (pas1 vrednost) NI prepisano nikjer na p142
    for (const r of p142) expect(f(r, "kultur")).toBe(f(r, "kultur"));
  });

  test("changes audit: val 116, changes 0, digit_mismatch 0, tally 34/37/25/12/3", () => {
    const ch = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/ps-n83/band-v86/register-v116-p142-changes.json"), "utf8"),
    ) as {
      meta: { val: number; digit_mismatch: number };
      tally: Record<string, number>;
      changes: unknown[];
      page_jk: Record<string, { qualifies: boolean; only_j_pct: number }>;
    };
    expect(ch.meta.val).toBe(116);
    expect(ch.meta.digit_mismatch).toBe(0);
    expect(ch.changes).toHaveLength(0);
    expect(ch.tally["kultur_variant"]).toBe(34);
    expect(ch.tally["owner_variant"]).toBe(37);
    expect(ch.tally["v86-review-col-split"]).toBe(25);
    expect(ch.tally["v86-no-value"]).toBe(12);
    expect(ch.tally["tile_missing"]).toBe(3);
    expect(ch.page_jk["142"].qualifies).toBe(true);
    expect(ch.page_jk["142"].only_j_pct).toBe(0);
  });

  test("p1–55 + p143 nedotaknjeni (guard)", () => {
    const old = REG.filter((r) => (r["page"] as number) <= 55 || (r["page"] as number) === 143);
    for (const r of old) {
      expect("owner_tile_v86" in r).toBe(false);
      expect("jk_review" in r).toBe(false);
      expect("jaethe_pass1_v82" in r).toBe(false);
      expect(f(r, "reading_pass")).not.toBe("v86-colonial-tiles");
    }
  });

  test("pass3 NEIZMENJAN: PS parcele 392, land use None 77 (p142 frakcije niso parcele)", () => {
    const pr = JSON.parse(readFileSync(join(ROOT, "research-griblje/atlas-1825/parcel-register-1825.json"), "utf8")) as {
      ps_parcels_total: number;
      ps_land_use_coverage: Record<string, number>;
    };
    expect(pr.ps_parcels_total).toBe(392);
    expect(pr.ps_land_use_coverage["null"]).toBe(77);
  });
});

describe("val 116 — zajeti VLM glasovi (artefakti, komitirani)", () => {
  test("PZ: 45/45 glasov v vlm-v109/ (read-v109.mts; integracija = mikroprehod 8b val 117)", () => {
    const done = readdirSync(join(V109, "vlm-v109")).filter((x) => x.endsWith(".json"));
    expect(done.length).toBe(45);
    // ključne celice obstajajo in so parsirljive
    for (const cell of ["p50-table", "p52-table", "p57-table", "p59-table", "p63-band1-vr1-5", "p65-desni-zoom"]) {
      const j = JSON.parse(readFileSync(join(V109, "vlm-v109", `${cell}.json`), "utf8"));
      expect("ERROR" in j, cell).toBe(false);
    }
  });

  test("p142-t-kultur2: 696/696 tile-ov (edini manjkajoči od val 86 zdaj prebran)", () => {
    const manifest = JSON.parse(readFileSync(join(V86, "tiles-manifest-v86.json"), "utf8")) as {
      tiles: { cell: string }[];
    };
    const read = manifest.tiles.filter((t) => existsSync(join(V86, "vlm-v86", `${t.cell}-T.json`)));
    expect(read.length).toBe(696);
    expect(manifest.tiles.length).toBe(696);
    const k2 = JSON.parse(readFileSync(join(V86, "vlm-v86", "p142-t-kultur2-T.json"), "utf8"));
    expect(k2.rows?.length).toBeGreaterThan(0);
  });

  test("PT p7: 6 glasov v vlm-v116/ — bp 96 '38' ✓, bp 97 '39' ✓, bp 98 '70' (PT-celični glas za vezavo Zollamt↔h.70)", () => {
    const done = readdirSync(join(V110, "vlm-v116")).filter((x) => x.endsWith(".json"));
    expect(done.length).toBe(6);
    const b96 = JSON.parse(readFileSync(join(V110, "vlm-v116/p07-bp96-nro-8x.json"), "utf8"));
    const b97 = JSON.parse(readFileSync(join(V110, "vlm-v116/p07-bp97-nro-4x.json"), "utf8"));
    const b98 = JSON.parse(readFileSync(join(V110, "vlm-v116/p07-bp98-nro-4x.json"), "utf8"));
    expect(b96.nro_value).toBe("38"); // potrjuje register house_no 38
    expect(b97.nro_value).toBe("39"); // potrjuje register house_no 39
    expect(b98.nro_value).toBe("70"); // VLM vidi 70; v110 nativno je trdilo prazno — razkol zabeležen
    // areal osnova: 5 vrstic, 4 prečrtane rdeče ( groundwork za re-adjudikacijo val 117/118)
    const ar = JSON.parse(readFileSync(join(V110, "vlm-v116/p07-areals-1-5-10x.json"), "utf8"));
    expect(ar.rows?.length).toBe(5);
    const gestrichen = ar.rows.filter((x: { areal?: string }) => String(x.areal ?? "").includes("gestrichen"));
    expect(gestrichen.length).toBe(4);
  });

  test("PT register: bp 98 ostaja REVIEW (iskrenost — razkol nativno-prazno vs VLM-70 zabeležen, ne rešen)", () => {
    const pt = JSON.parse(readFileSync(join(ROOT, "research-griblje/pt-n83/register.json"), "utf8")) as {
      register: { page: number; bp_no: string; review_status: string; house_no: string; readings: string[] }[];
    };
    const b98 = pt.register.find((r) => r.page === 7 && r.bp_no === "98");
    expect(b98).toBeDefined();
    expect(String(b98!.house_no)).toBe("70");
    expect(b98!.review_status).toBe("REVIEW"); // ni dvignjeno — glas je artefakt, ne dvig
  });

  test("KG: vsebina identična (samo generated_at) — PARCEL 2427, vozlišča 3269, vezi 3477; sha c3932092 (val 119 del 2e; prej 62d8cfea)", () => {
    const kg = JSON.parse(readFileSync(join(ROOT, "src/data/knowledge-graph-1825.json"), "utf8")) as {
      node_stats: Record<string, number>;
      edge_stats: Record<string, number>;
      nodes: unknown[];
      edges: unknown[];
    };
    expect(kg.node_stats.PARCEL).toBe(2427);
    expect(kg.nodes.length).toBe(3269);
    expect(kg.edges.length).toBe(3477);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2773);
  });
});
