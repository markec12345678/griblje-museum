/**
 * Val 98 — 86b DEL 2: PS N83 kolonski tile-i p95–109 + vgradnja po pravilih val 86.
 *
 * Kaj ta datoteka varuje (prejšnje teste ne pokrijejo):
 *  1. vgradnja dela 2: register-v86b-changes.json — fail-fast marker, pravila 1:1 val 86,
 *     page-level F-PV-05, snimke samo na novih korekcijah, v88 nedotaknjeno,
 *  2. owner variante na part-1 straneh (p63–94: NOVI name tile-i; p56–62: idempotentno),
 *  3. resumable stanje: 446/696 tile-ov, p110–142 čaka ob kvoti (vzorec val 86),
 *  4. PS parcele 930 → 898 z izrecnim, testno vodenim prehodom števcev,
 *  5. KG v2.2 / KG-F11 + kaskada (sha 2b16acad) + timeline I6 (PS 898),
 *  6. §4 poštenost: per-parcelne trditve ostajajo PROVISIONAL — noben v86b popravek
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
const chg2 = JSON.parse(readFileSync(join(PS, "band-v86", "register-v86b-changes.json"), "utf8")) as {
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

describe("val 98 — 86b del 2: vgradnja po pravilih val 86 na novih straneh", () => {
  test("fail-fast marker: changes datoteka obstaja, nosi val + pravila 1:1 val 86", () => {
    expect(existsSync(join(PS, "band-v86", "register-v86b-changes.json"))).toBe(true);
    expect(chg2.val).toContain("98");
    expect(chg2.rules).toContain("page-level F-PV-05");
    expect(chg2.rules).toContain("v88 nedotaknjeno");
  });

  test("pokritost dela 2: strani p95–109 (15 novih) + vse part-1 strani; p110–142 resumable", () => {
    const covPages = Object.keys(chg2.page_jk).map(Number).sort((a, b) => a - b);
    expect(covPages).toEqual([95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109]);
    // del 2 je vgradil TOČNO te strani; p110–142 ni v page_jk (manjkajo tile-i)
    // vsota vrstic na teh straneh = 301 (1109 − 808)
    const rowsNewPages = register.filter((r) => covPages.includes(r.page as number)).length;
    expect(rowsNewPages).toBe(301);
  });

  test("page-level F-PV-05: vseh 15 novih strani kvalificiranih (only_j < 10 %)", () => {
    for (const [pg, jk] of Object.entries(chg2.page_jk)) {
      expect(jk.qualifies, `p${pg}`).toBe(true);
      expect(jk.only_j_pct).toBeLessThan(10);
    }
  });

  test("vsak popravek dela 2 nosi snimke + glasove (nič tihega prepisovanja)", () => {
    const jk2 = chg2.changes.filter((c) => c.type === "jk_correction");
    for (const c of jk2) {
      expect(c.rule).toBeDefined();
    }
    // register: vsaka popravljena vrstica dela 2 ima snimki *_pass1_v82 + jk_review
    const newPages = Object.keys(chg2.page_jk).map(Number);
    const corrected = register.filter(
      (r) => newPages.includes(r.page as number) && "jaethe_pass1_v82" in r,
    );
    expect(corrected.length).toBe(14 + 87); // v86-tiles-jk + v86-tiles-arbitrated
    for (const r of corrected) {
      expect(typeof r.jaethe_pass1_v82).toBe("string");
      expect(typeof r.klafter_pass1_v82).toBe("string");
      expect(["v86-tiles-jk", "v86-tiles-arbitrated"]).toContain(String(r.jk_review));
    }
  });

  test("v88 = vir resnice: vseh 139 vrstic vrednostno NESPREMENJENIH z delom 2", () => {
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

  test("owner variante: 910 novih (p63–109); p56–62 idempotentno (iste vrednosti kot val 86)", () => {
    expect(chg2.owner_variant_new).toBe(910);
    const withVariant = register.filter((r) => "owner_tile_v86" in r);
    expect(withVariant.length).toBe(153 + 910); // del 1 + del 2
    // vse variante na straneh z name tile pokritostjo (56–109 + 121), nikoli na p1–55/p143
    for (const r of withVariant) {
      expect(r.page as number).toBeGreaterThanOrEqual(56);
      expect(r.page as number).toBeLessThanOrEqual(142);
    }
  });

  test("p1–55 + p143 nedotaknjeni (guard dela 2)", () => {
    const old = register.filter((r) => (r.page as number) <= 55 || (r.page as number) === 143);
    for (const r of old) {
      expect("owner_tile_v86" in r).toBe(false);
      expect("jk_review" in r).toBe(false);
      expect("jaethe_pass1_v82" in r).toBe(false);
      expect(r.reading_pass ?? "").not.toBe("v86-colonial-tiles");
    }
  });

  test("resumable: 446/696 tile-ov prebranih, 0 trajnih napak; preostanek p110–142", () => {
    const read = manifest.tiles.filter((t) => existsSync(join(V86, "vlm-v86", `${t.cell}-T.json`)));
    expect(read.length).toBe(446);
    expect(manifest.tiles.length).toBe(696);
    for (const t of read) {
      const j = JSON.parse(readFileSync(join(V86, "vlm-v86", `${t.cell}-T.json`), "utf8"));
      expect("ERROR" in j, t.cell).toBe(false);
    }
    const missing = manifest.tiles.filter((t) => !existsSync(join(V86, "vlm-v86", `${t.cell}-T.json`)));
    expect(missing.every((t) => t.page >= 110)).toBe(true);
  });
});

describe("val 98 — prehod števcev (izrecen, testno voden)", () => {
  test("PS parcele 930 → 898; land use None 136 → 104; kategorije nespremenjene", () => {
    expect(pr.val).toBe("98");
    expect(pr.ps_parcels_total).toBe(898);
    expect(pr.ps_land_use_coverage["null"]).toBe(104);
    expect(pr.ps_land_use_coverage["njiva"]).toBe(297);
    expect(pr.ps_land_use_coverage["travnik"]).toBe(97);
    expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(333);
    expect(pr.ps_land_use_coverage["pašnik"]).toBe(22);
    expect(pr.ps_land_use_coverage["vrt"]).toBe(16);
    expect(pr.ps_land_use_coverage["gozd"]).toBe(16);
    expect(pr.ps_land_use_coverage["drugo"]).toBe(11);
    expect(pr.ps_land_use_coverage["dvorišče"]).toBe(1);
    expect(pr.ps_land_use_coverage["vinograd"]).toBe(1);
  });

  test("KG v2.2: PARCEL 2.933, HAS_PARCEL 3.155, vozlišča 3.775, vezi 3.859, invariante čiste", () => {
    expect(kg.title).toBe("knowledge-graph-1825 v2.2");
    expect(kg.val).toBe(98);
    expect(kg.node_stats.PARCEL).toBe(2933);
    expect(kg.edge_stats.HAS_PARCEL).toBe(3155);
    const nodes = Object.values(kg.node_stats).reduce((a, b) => a + b, 0);
    expect(nodes).toBe(3775);
    const edges = Object.values(kg.edge_stats).reduce((a, b) => a + b, 0);
    expect(edges).toBe(3859);
    expect(kg.invariant_violations).toEqual([]);
  });

  test("KG-F11: val 98 najdba nosi meritve dela 2 + pošteno omejitev (p110–142 čaka)", () => {
    const f11 = kg.findings.find((f) => f.finding_id === "KG-F11");
    expect(f11).toBeDefined();
    expect(f11!.val).toBe(98);
    expect(f11!.statement).toContain("p95–109");
    expect(f11!.statement).toContain("1.109");
    expect(f11!.statement).toContain("930 → 898");
    expect(f11!.statement).toContain("v88");
    expect(f11!.status).toContain("RESOLVED-V98");
    expect(f11!.status).toContain("p110–142 tile-i ob kvoti");
  });

  test("kaskada: runtime kopije držijo isti KG sha 2b16acad…", () => {
    expect(kgSha).toMatch(/^2b16acad/);
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

  test("§4 poštenost: v86b popravki NE dvignejo evidence statusov (PROVISIONAL ostaja)", () => {
    // nobena v86b vrstica ne sme nositi dvignjenega statusa; KG PS parcelni status ostaja
    // TRANSCRIBED_PROVISIONAL (val 89) — del 2 ga NE spreminja
    const nodes = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
      nodes: { node_id: string; node_type: string; origin?: string; evidence_status?: string }[];
    };
    const psParcels = nodes.nodes.filter((n) => n.node_type === "PARCEL" && n.origin === "PS");
    expect(psParcels.length).toBe(898);
    for (const p of psParcels) {
      expect(p.evidence_status).toBe("TRANSCRIBED_PROVISIONAL");
    }
  });
});
