/**
 * Val 107 — 86b DEL 3: PS N83 kolonski tile-i p110–120 + p122–141 (31 novih strani)
 + vgradnja po pravilih val 86/98 + kaskada KG v2.3.
 *
 * Kaj ta datoteka varuje (prejšnje teste ne pokrijejo):
 *  1. vgradnja dela 3: register-v107-changes.json — fail-fast marker, pravila 1:1 v86b,
 *     page-level F-PV-05, snimke samo na novih korekcijah, v88 nedotaknjeno,
 *  2. fail-fast page pravilo: p142 (1 manjkajoči tile — p142-t-kultur2, trdo 429) ostaja
 *     v82-native-pass1 — delna pokritost nikoli ne pride do arbitraže,
 *  3. p141 = NE kvalificirana stran (only_j ≥ 10 %) — reading_pass vgrajen, jk vrednosti
 *     nedotaknjene (v86-page-not-qualified), owner/kultur variante vrednostno neodvisne,
 *  4. PS parcele 779 → 735 z izrecnim, testno vodenim prehodom števcev,
 *  5. KG v2.3 / KG-F12 + kaskada (sha 9f856d28) + timeline I6 (PS 779, raba 438+249),
 *  6. §4 poštenost: per-parcelne trditve ostajajo PROVISIONAL — noben v107 popravek
 *     ne dviguje evidence statusov.
 *
 * Protokol: vsak popravek nosi snimko; konflikti ostanejo konflikti; brez ugibanja.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RG = join(process.cwd(), "research-griblje");
const PS = join(RG, "ps-n83");
const V86 = join(RG, "raw-web-val86-2026-10");
const ATLAS = join(RG, "atlas-1825");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

const register = JSON.parse(readFileSync(join(PS, "register.json"), "utf8")) as Record<string, unknown>[];
const chg3 = JSON.parse(readFileSync(join(PS, "band-v86", "register-v107-changes.json"), "utf8")) as {
  val: string;
  rules: string;
  tally: Record<string, number>;
  digit_mismatch_total: number;
  owner_variant_new: number;
  page_jk: Record<string, { only_j: number; klafter_vkljeno_both: number; both: number; only_j_pct: number; qualifies: boolean }>;
  changes: { page: number; row: number; type: string; rule?: string }[];
};
const pr = JSON.parse(readFileSync(join(ATLAS, "parcel-register-1825.json"), "utf8")) as {
  val: string; ps_parcels_total: number; ps_land_use_coverage: Record<string, number>;
};
const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
  title: string; val: number; findings: { finding_id: string; val: number; statement: string; status: string }[];
  node_stats: Record<string, number>; edge_stats: Record<string, number>; invariant_violations: unknown[];
};
const kgSha = sha256(join(ATLAS, "knowledge-graph-1825.json"));
const manifest = JSON.parse(readFileSync(join(V86, "tiles-manifest-v86.json"), "utf8")) as {
  tiles: { cell: string; page: number; group: string }[];
};

const DEL3_PAGES = [110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141];

describe("val 107 — 86b del 3: vgradnja po pravilih val 86/98 na novih straneh", () => {
  test("fail-fast marker: changes datoteka obstaja, nosi val + pravila 1:1 v86b", () => {
    expect(existsSync(join(PS, "band-v86", "register-v107-changes.json"))).toBe(true);
    expect(chg3.val).toContain("107");
    expect(chg3.rules).toContain("page-level F-PV-05");
    expect(chg3.rules).toContain("v88 nedotaknjeno");
  });

  test("pokritost dela 3: 31 novih strani p110–120 + p122–141; p142 ni v page_jk", () => {
    const covPages = Object.keys(chg3.page_jk).map(Number).sort((a, b) => a - b);
    expect(covPages).toEqual(DEL3_PAGES);
    expect(covPages).not.toContain(142); // 1 tile manjka → fail-fast page pravilo
    // vsota vrstic na teh straneh = 646 (1755 − 1109)
    const rowsNewPages = register.filter((r) => covPages.includes(r.page as number)).length;
    expect(rowsNewPages).toBe(646);
  });

  test("page-level F-PV-05: 30 od 31 strani kvalificiranih; p141 = page-not-qualified (honest)", () => {
    const qualified = DEL3_PAGES.filter((pg) => chg3.page_jk[String(pg)]?.qualifies);
    expect(qualified.length).toBe(30);
    expect(chg3.page_jk["141"].qualifies).toBe(false);
    expect(chg3.page_jk["141"].only_j_pct).toBeGreaterThanOrEqual(10);
    // p141 vrstice nosijo reading_pass (nov 3. glas) ampak BREZ jk popravkov
    // (v86-page-not-qualified ne piše jk_review — pravilo samo šteje; nič ugibanja)
    const p141 = register.filter((r) => r.page === 141);
    expect(p141.every((r) => r.reading_pass === "v86-colonial-tiles")).toBe(true);
    expect(p141.every((r) => !("jk_review" in r))).toBe(true);
    expect(p141.every((r) => !("jaethe_pass1_v82" in r))).toBe(true);
  });

  test("tally dela 3: 117 jk + 36 arbitraž + 1 pass2-split s snimkami; 56+14 REVIEW; 98 digit_mismatch", () => {
    expect(chg3.tally["v86-tiles-jk"]).toBe(117);
    expect(chg3.tally["v86-tiles-arbitrated"]).toBe(36);
    expect(chg3.tally["v86-pass2-split"]).toBe(1);
    expect(chg3.tally["v86-review-pass-digit-split"]).toBe(56);
    expect(chg3.tally["v86-review-col-split"]).toBe(14);
    expect(chg3.tally["v86-explicit-jk-kept"]).toBe(116);
    expect(chg3.tally["v86-kept-k-k"]).toBe(201);
    expect(chg3.tally["v86-no-value"]).toBe(59);
    expect(chg3.tally["v86-page-not-qualified"]).toBe(30);
    expect(chg3.digit_mismatch_total).toBe(98);
    // vsak jk popravek nosi rule
    const jk3 = chg3.changes.filter((c) => c.type === "jk_correction");
    expect(jk3.length).toBe(117 + 36 + 1);
    for (const c of jk3) {
      expect(c.rule).toBeDefined();
      expect(["v86-tiles-jk", "v86-tiles-arbitrated", "v86-pass2-split"]).toContain(String(c.rule));
    }
  });

  test("vsak popravek dela 3 nosi snimke *_pass1_v82 (nič tihega prepisovanja)", () => {
    const corrected = register.filter(
      (r) => DEL3_PAGES.includes(r.page as number) && "jaethe_pass1_v82" in r,
    );
    expect(corrected.length).toBe(117 + 36 + 1); // jk + arbitraže + pass2-split
    for (const r of corrected) {
      expect(typeof r.jaethe_pass1_v82).toBe("string");
      expect(typeof r.klafter_pass1_v82).toBe("string");
      const isV108 = String(r.jk_review) === "v108-re-read";
      if (isV108) {
        expect(typeof r.jaethe_pre_v108).toBe("string");
      } else {
        expect(["v86-tiles-jk", "v86-tiles-arbitrated", "v86-pass2-split"]).toContain(String(r.jk_review));
      }
    }
  });

  test("v88 = vir resnice: 137 RESOLVED + 2 UNRESOLVED vrednostno NESPREMENJENIH z delom 3", () => {
    const resolved = register.filter((r) => r.jk_review === "v88-digit-split-RESOLVED");
    const unresolved = register.filter((r) => r.jk_review === "v88-digit-split-UNRESOLVED");
    expect(resolved.length).toBe(137);
    expect(unresolved.length).toBe(2);
    for (const r of resolved) {
      expect(String(r.jaethe)).toBe(String(r.jaethe_v88));
      expect(String(r.klafter)).toBe(String(r.klafter_v88));
    }
    for (const r of unresolved) {
      expect(String(r.jaethe)).toBe(String(r.jaethe_pass1_v82));
      expect(String(r.klafter)).toBe(String(r.klafter_pass1_v82));
    }
  });

  test("owner/kultur variante: +552/+506 (del 3) → skupaj 1.615/1.402; vse na p56–142", () => {
    expect(chg3.owner_variant_new).toBe(552);
    expect(chg3.tally["kultur_variant"]).toBe(506);
    expect(register.filter((r) => "owner_tile_v86" in r)).toHaveLength(1615);
    expect(register.filter((r) => "kultur_tile_v86" in r)).toHaveLength(1402);
    const variantPages = register
      .filter((r) => "owner_tile_v86" in r)
      .map((r) => r.page as number);
    expect(Math.min(...variantPages)).toBeGreaterThanOrEqual(56);
    expect(Math.max(...variantPages)).toBeLessThanOrEqual(142);
  });

  test("fail-fast page pravilo: p142 (1 tile manjka) OSTAJA v82-native-pass1; p1–55 + p143 nedotaknjeni", () => {
    const p142 = register.filter((r) => r.page === 142);
    expect(p142.length).toBe(40);
    expect(p142.every((r) => r.reading_pass === "v82-native-pass1")).toBe(true);
    expect(p142.every((r) => !("owner_tile_v86" in r))).toBe(true);
    expect(p142.every((r) => !("jk_review" in r))).toBe(true);
    const old = register.filter((r) => (r.page as number) <= 55 || (r.page as number) === 143);
    for (const r of old) {
      expect("owner_tile_v86" in r).toBe(false);
      expect("jk_review" in r).toBe(false);
      expect("jaethe_pass1_v82" in r).toBe(false);
      expect(r.reading_pass ?? "").not.toBe("v86-colonial-tiles");
    }
  });

  test("resumable: 695/696 tile-ov prebranih, 0 trajnih napak; edini manjkajoči = p142-t-kultur2", () => {
    const read = manifest.tiles.filter((t) => existsSync(join(V86, "vlm-v86", `${t.cell}-T.json`)));
    expect(read.length).toBe(695);
    expect(manifest.tiles.length).toBe(696);
    for (const t of read) {
      const j = JSON.parse(readFileSync(join(V86, "vlm-v86", `${t.cell}-T.json`), "utf8"));
      expect("ERROR" in j, t.cell).toBe(false);
    }
    const missing = manifest.tiles.filter((t) => !existsSync(join(V86, "vlm-v86", `${t.cell}-T.json`)));
    expect(missing.map((t) => t.cell)).toEqual(["p142-t-kultur2"]);
  });
});

describe("val 107 — prehod števcev (izrecen, testno voden)", () => {
  test("PS parcele 779 → 735 → 676; land use None 104 → 76 → 76; kategorije (val 112: F-PV-07 premestitve p5/p7/p12 — 59 vrednosti jaethe→klafter izpadijo iz projekcije)", () => {
    expect(pr.val).toBe("108");
    expect(pr.ps_parcels_total).toBe(676); // val 108: 735 → val 112: 676
    expect(pr.ps_land_use_coverage["null"]).toBe(76);
    expect(pr.ps_land_use_coverage["njiva"]).toBe(258); // val 108: 295 → val 112: 258
    expect(pr.ps_land_use_coverage["travnik"]).toBe(77); // val 108: 84 → val 112: 77
    expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(209); // val 108: 221 → val 112: 209
    expect(pr.ps_land_use_coverage["pašnik"]).toBe(15); // val 108: 16 → val 112: 15
    expect(pr.ps_land_use_coverage["vrt"]).toBe(14); // val 108: 16 → val 112: 14
    expect(pr.ps_land_use_coverage["gozd"]).toBe(14);
    expect(pr.ps_land_use_coverage["drugo"]).toBe(11);
    expect(pr.ps_land_use_coverage["dvorišče"]).toBe(1);
    expect(pr.ps_land_use_coverage["vinograd"]).toBe(1);
  });

  test("KG v2.3: PARCEL 2.711, HAS_PARCEL 3.013, vozlišča 3.553, vezi 3.717, invariante čiste (val 112: F-PV-07; val 108 je bil 2.770/3.072/3.612/3.776)", () => {
    expect(kg.title).toBe("knowledge-graph-1825 v2.4");
    expect(kg.val).toBe(108);
    expect(kg.node_stats.PARCEL).toBe(2711); // val 108: 2770 → val 112: 2711
    expect(kg.edge_stats.HAS_PARCEL).toBe(3013); // val 108: 3072 → val 112: 3013
    const nodes = Object.values(kg.node_stats).reduce((a, b) => a + b, 0);
    expect(nodes).toBe(3553); // val 108: 3612 → val 112: 3553
    const edges = Object.values(kg.edge_stats).reduce((a, b) => a + b, 0);
    expect(edges).toBe(3717); // val 108: 3776 → val 112: 3717
    expect(kg.invariant_violations).toEqual([]);
  });

  test("KG-F12: val 107 najdba nosi meritve dela 3 + pošteno omejitev (p142-t-kultur2 čaka)", () => {
    const f12 = kg.findings.find((f) => f.finding_id === "KG-F12");
    expect(f12).toBeDefined();
    expect(f12!.val).toBe(107);
    expect(f12!.statement).toContain("p110–120 + p122–141");
    expect(f12!.statement).toContain("1.755");
    expect(f12!.statement).toContain("p142-t-kultur2");
    expect(f12!.statement).toContain("v88");
    expect(f12!.statement).toContain("p142-t-kultur2");
    expect(f12!.status).toContain("RESOLVED-V107");
  });

  test("kaskada: runtime kopije držijo isti KG sha e574df03… (val 112; val 108 je bil 9f856d28)", () => {
    expect(kgSha).toMatch(/^e574df03/);
    for (const p of [
      join(process.cwd(), "src", "data", "knowledge-graph-1825.json"),
      join(process.cwd(), "src", "data", "story-graph-1825.json"),
      join(process.cwd(), "src", "data", "timeline-1825-1830.json"),
      join(process.cwd(), "src", "data", "atlas-coverage-report-1825.json"),
    ]) {
      const j = JSON.parse(readFileSync(p, "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) expect(j.provenance.kg_sha256, p).toBe(kgSha);
      else expect(sha256(p), p).toBe(kgSha);
    }
  });

  test("§4 poštenost: v107/v112 popravki NE dvignejo evidence statusov (PROVISIONAL ostaja)", () => {
    const nodes = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
      nodes: { node_id: string; node_type: string; origin?: string; evidence_status?: string }[];
    };
    const psParcels = nodes.nodes.filter((n) => n.node_type === "PARCEL" && n.origin === "PS");
    expect(psParcels.length).toBe(676); // val 108: 735 → val 112: 676
    for (const p of psParcels) {
      expect(p.evidence_status).toBe("TRANSCRIBED_PROVISIONAL");
    }
  });
});
