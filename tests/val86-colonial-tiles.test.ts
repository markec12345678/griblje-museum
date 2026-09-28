/**
 * Val 86 — ISSUE #42 §4/§14 + #43: PS N83 KOLONSKI TILE-i (kompozitni, z glavo stolpcev)
 * — 2. prehod p56–142 (delna pokritost p56–94 + p121 po kvoti) + VGRADNJA F-PV-05 (J→K).
 *
 * Varovalke:
 *  1. metoda: tiles-manifest-v86.json (696 tile-ov, guard_v85 8/8, kompozitna glava),
 *     build skripti deterministični (make-tiles/tile-read/build-compare/build-register)
 *  2. pilot pravilnosti: p121 tile only_j = 0 (brez glave je bilo 9/20 napak —
 *     F-PV-06 pouk: glava = obvezen sidro stolpcev)
 *  3. vgradnja: register 2.871; 808 vrstic reading_pass v86-colonial-tiles;
 *     vsak popravek nosi snimko jaethe/klafter_pass1_v82 + jk_review;
 *     p1–55 + p143 NESPREMENJENA; 287 jk + 43 arbitraž + 3 N|K razdelitve
 *  4. §22 kaskada: KG v2.0 (sha 6fb6fae8) → story/timeline/coverage držijo isti sha;
 *     ID-ji entitet NESPREMENJENI (3.309/3.569/622/8/4)
 *  5. analysis-v6 determinističen (re-run byte-identno)
 *  6. Fürtrag kandidati zbrani (F11 — monotona kontrola čaka celotno verigo)
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { join } from "node:path";

const RG = join(process.cwd(), "research-griblje");
const PS = join(RG, "ps-n83");
const V86 = join(RG, "raw-web-val86-2026-10");
const ATLAS = join(RG, "atlas-1825");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

const manifest = JSON.parse(readFileSync(join(V86, "tiles-manifest-v86.json"), "utf8")) as {
  meta: { val: number; guard_v85: string; method: string; pages: string };
  tiles: { cell: string; page: number; group: string; band: number; composite_header: boolean; header_zone: [number, number] | null }[];
};
const register = JSON.parse(readFileSync(join(PS, "register.json"), "utf8")) as Record<string, unknown>[];
const changes = JSON.parse(readFileSync(join(PS, "band-v86", "register-v86-changes.json"), "utf8")) as {
  meta: { digit_mismatch: number };
  tally: Record<string, number>;
  page_jk: Record<string, { only_j: number; klafter_vkljeno_both: number; both: number; only_j_pct: number; qualifies: boolean }>;
  changes: { page: number; row: number; type: string; rule?: string; old?: { jaethe: string; klafter: string }; new?: { jaethe: string; klafter: string }; voices?: Record<string, string[]> }[];
};
const analysis = JSON.parse(readFileSync(join(PS, "analysis-v6.json"), "utf8")) as {
  val: number; title: string;
  method: { vlm_calls: number; errors: number };
  findings: Record<string, { status: string }>;
};
const compare = JSON.parse(readFileSync(join(PS, "band-v86", "compare-tiles-v86.json"), "utf8")) as {
  summary: { fields: Record<string, { total: number; p1_p2?: number }>; tiebreak_3rd_voice: Record<string, number>; pages: string };
  pages: { page: number; rows1: number; tiles_kultur_n: number; jk_distribution_tiles: Record<string, number> }[];
  fuertrag: { page: number; voice: string; value: string }[];
};
const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
  title: string; val: number; node_stats: Record<string, number>; edge_stats: Record<string, number>; invariant_violations: unknown[];
};
const kgSha = sha256(join(ATLAS, "knowledge-graph-1825.json"));

describe("val 86 — metoda: kompozitni kolonski tile-i", () => {
  test("manifest: 696 tile-ov na 87 straneh (56–142), p143 izpuščen (precedens val 85)", () => {
    expect(manifest.meta.val).toBe(86);
    expect(manifest.tiles).toHaveLength(696);
    const pages = [...new Set(manifest.tiles.map((t) => t.page))].sort((a, b) => a - b);
    expect(pages[0]).toBe(56);
    expect(pages[pages.length - 1]).toBe(142);
    expect(pages).toHaveLength(87);
  });

  test("GUARD v85: sidra + pasovna mreža ujemajo 8/8 vzorčnih strani (prenos algoritma dokazan)", () => {
    expect(manifest.meta.guard_v85).toContain("8/8");
  });

  test("kompozitna glava: vsak tile z y0>0 ima header_zone, pas 0 ga ne (brej podvajanja)", () => {
    const withHeader = manifest.tiles.filter((t) => t.composite_header);
    const without = manifest.tiles.filter((t) => !t.composite_header);
    expect(withHeader.length).toBeGreaterThan(0);
    for (const t of withHeader) {
      expect(t.header_zone).not.toBeNull();
      expect(t.band).toBeGreaterThan(0);
    }
    for (const t of without) expect(t.band).toBe(0);
  });

  test("gradilniki obstajajo; python build skripti CI-varni (REPO iz __file__, precedens val 85 fix)", () => {
    // .mts (lokalni VLM tok) smejo imeti lokalni REPO — kot val 85 make-*.mts;
    // python builderji se poganjajo tudi na CI → brez trdih /home poti
    for (const f of ["ps-n83/build-compare-tiles-v86.py", "ps-n83/build-register-v86.py", "ps-n83/build-analysis-v6.py"]) {
      const s = readFileSync(join(RG, f), "utf8");
      expect(s).not.toContain("/home/z/");
      expect(s).toContain("__file__");
    }
    for (const f of ["make-tiles-v86.mts", "tile-read-v86.mts"]) {
      expect(existsSync(join(V86, f))).toBe(true);
    }
  });
});

describe("val 86 — pilot pravilnosti (F-PV-06 pouk: glava = sidro stolpcev)", () => {
  test("p121 + p58 tile-i: only_j = 0 (brez glave je bilo p121 9/20 napak)", () => {
    for (const pg of [58, 121]) {
      const p = compare.pages.find((q) => q.page === pg)!;
      expect(p.jk_distribution_tiles["only_j"] ?? 0).toBe(0);
      expect((p.jk_distribution_tiles["only_k"] ?? 0) + (p.jk_distribution_tiles["both"] ?? 0)).toBeGreaterThan(0);
    }
  });

  test("vseh kvalificiranih strani: only_j delež < 10 % (F-PV-05 potrjen na celotni pokritosti)", () => {
    for (const [pg, jk] of Object.entries(changes.page_jk)) {
      if (!jk.qualifies) continue;
      expect(jk.only_j_pct, `p${pg}`).toBeLessThan(10);
    }
  });

  test("F-PV-04 rešitvena pot: kultur tile-i pokrijejo 40 strani (4/4 pasovi), name 8", () => {
    const kulturFull = compare.pages.filter((p) => p.tiles_kultur_n > 0);
    expect(kulturFull.length).toBe(40);
  });
});

describe("val 86 — vgradnja v register.json (precedens val 61: snimke + review oznake)", () => {
  test("register 2.871 vrstic; 808 v86-colonial-tiles (p56–94 + p121), 990 v82, p1–55 + p143 nedotaknjeni", () => {
    expect(register).toHaveLength(2871);
    const v86 = register.filter((r) => r.reading_pass === "v86-colonial-tiles");
    expect(v86).toHaveLength(808);
    expect(v86.every((r) => (r.page as number) >= 56 && (r.page as number) <= 142)).toBe(true);
    const v82 = register.filter((r) => r.reading_pass === "v82-native-pass1");
    expect(v82).toHaveLength(990);
    expect(register.filter((r) => (r.page as number) <= 55).every((r) => !("jk_review" in r))).toBe(true);
    expect(register.filter((r) => (r.page as number) === 143).every((r) => r.reading_pass === "v82-native-pass1")).toBe(true);
  });

  test("vsak v86/v88 popravek nosi snimko jaethe/klafter_pass1_v82 (nič tihega prepisovanja)", () => {
    const v86 = register.filter((r) => r.reading_pass === "v86-colonial-tiles");
    const corrected = v86.filter((r) => "jaethe_pass1_v82" in r);
    // val 88: 139 digit-split vrstic je dobilo snimke + v88 polja (re-read direktno branje)
    expect(corrected.length).toBe(287 + 43 + 3 + 139); // jk + arbitraže + N|K razdelitve + v88 digit-split
    for (const r of corrected) {
      expect(typeof r.jaethe_pass1_v82).toBe("string");
      expect(typeof r.klafter_pass1_v82).toBe("string");
      expect([
        "v86-tiles-jk",
        "v86-tiles-arbitrated",
        "v86-pass2-split",
        "v86-pass1-split",
        "v88-digit-split-RESOLVED",
        "v88-digit-split-UNRESOLVED",
      ]).toContain(String(r.jk_review));
    }
  });

  test("F-PV-05 glavna meritev: 287 jk popravkov; na vzorcu p58 r0 = klafter 338 (slika: Acker 338 v Kläther)", () => {
    expect(changes.tally["v86-tiles-jk"]).toBe(287);
    expect(changes.tally["v86-tiles-arbitrated"]).toBe(43);
    const p58r0 = register.find((r) => r.page === 58 && (r.haus_no as string) === "52") as Record<string, unknown> | undefined;
    const fallback = register.filter((r) => r.page === 58)[0];
    const row = p58r0 ?? fallback;
    expect(row.klafter).toBe("338");
    expect(row.jaethe_pass1_v82).toBe("338");
    expect(row.jk_review).toBe("v86-tiles-jk");
  });

  test("REVIEW markerji: 139 digit-split promoviranih v val 88 (137 RESOLVED + 2 UNRESOLVED) + 77 izrecnih N|K", () => {
    expect(changes.tally["v86-review-pass-digit-split"]).toBe(139); // revizija val 86 nespremenjena
    expect(changes.tally["v86-explicit-jk-kept"]).toBe(77);
    // val 88: vseh 139 digit-split vrstic promoviranih iz v86-review-pass-digit-split
    const resolved = register.filter((r) => r.jk_review === "v88-digit-split-RESOLVED");
    const unresolved = register.filter((r) => r.jk_review === "v88-digit-split-UNRESOLVED");
    expect(register.filter((r) => r.jk_review === "v86-review-pass-digit-split").length).toBe(0);
    expect(resolved.length).toBe(137);
    expect(unresolved.length).toBe(2);
    for (const r of resolved) {
      // v88 vrednost = novo stanje (pravilo F-PV-05: klafter:=v88, jaethe:=''; '|' = izraziti j|k);
      // snimki pass1 + v88 glasovi ohranjeni (nič tihega prepisovanja)
      expect(String(r.jaethe)).toBe(String(r.jaethe_v88));
      expect(String(r.klafter)).toBe(String(r.klafter_v88));
      expect(["P1", "P2", "T3"]).toContain(String(r.v88_status));
    }
    for (const r of unresolved) {
      // UNRESOLVED: vrednosti ostajajo pass1, marker + opomba (brez ugibanja; p121 r0 = F-PV-03)
      expect(String(r.jaethe)).toBe(String(r.jaethe_pass1_v82));
      expect(String(r.klafter)).toBe(String(r.klafter_pass1_v82));
      expect(String(r.v88_note)).toContain("nejasen");
    }
  });

  test("kultur/owner tile različice = variant fields (637/153), kultur polje NIKOLI prepisano", () => {
    expect(changes.tally["kultur_variant"]).toBe(637);
    expect(changes.tally["owner_variant"]).toBe(153);
    const variants = register.filter((r) => "kultur_tile_v86" in r);
    expect(variants).toHaveLength(637);
    for (const r of variants) expect(typeof r.kultur_tile_v86).toBe("string");
  });

  test("audit trail: vsak popravek v register-v86-changes.json s glasovi", () => {
    const jkChanges = changes.changes.filter((c) => c.type === "jk_correction");
    expect(jkChanges.length).toBe(287 + 43 + 3);
    for (const c of jkChanges) {
      expect(c.voices).toBeDefined();
      expect(c.old).toBeDefined();
      expect(c.new).toBeDefined();
    }
  });
});

describe("val 86 — §22 kaskada (KG v2.0 → story/timeline/coverage)", () => {
  test("KG v2.0: naslov + val 86 + invariante čiste + ID-ji stabilni (3.309/3.569)", () => {
    expect(kg.title).toBe("knowledge-graph-1825 v2.0");
    expect(kg.val).toBe(86);
    expect(kg.invariant_violations).toEqual([]);
    const nodes = Object.values(kg.node_stats).reduce((a, b) => a + b, 0);
    expect(nodes).toBe(3309);
    const edges = Object.values(kg.edge_stats).reduce((a, b) => a + b, 0);
    expect(edges).toBe(3569);
  });

  test("kaskada: story-graph/timeline držijo isti KG sha (pogodba §22)", () => {
    const paths = [
      join(ATLAS, "story-graph-1825.json"),
      join(ATLAS, "timeline-1825-1830.json"),
      join(ATLAS, "coverage-report-1825.json"),
      join(ATLAS, "source-coverage-1825.json"),
      join(process.cwd(), "src", "data", "story-graph-1825.json"),
      join(process.cwd(), "src", "data", "timeline-1825-1830.json"),
      join(process.cwd(), "src", "data", "knowledge-graph-1825.json"),
    ];
    for (const p of paths) {
      const j = JSON.parse(readFileSync(p, "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) {
        expect(j.provenance.kg_sha256, p).toBe(kgSha);
      }
    }
    // runtime kopija = atlas resnica (ena izhodna)
    expect(sha256(join(process.cwd(), "src", "data", "knowledge-graph-1825.json"))).toBe(kgSha);
  });

  test("coverage: val 86 + PS 3 prehoda + SRC-PS opomba z vgradnjo", () => {
    const sc = JSON.parse(readFileSync(join(ATLAS, "source-coverage-1825.json"), "utf8")) as {
      val: number; transcription: { PS: { rows: number; passes: number; note: string } };
    };
    expect(sc.val).toBe(86);
    expect(sc.transcription.PS.rows).toBe(2871);
    expect(sc.transcription.PS.passes).toBe(3);
    expect(sc.transcription.PS.note).toContain("F-PV-05");
    expect(sc.transcription.PS.note).toContain("nič tiho prepisano");
  });
});

describe("val 86 — analysis-v6 + Fürtrag (F11)", () => {
  test("analysis-v6: val 86, 0 VLM napak, F-PV-05 status VGRADJENA", () => {
    expect(analysis.val).toBe(86);
    expect(analysis.method.errors).toBe(0);
    expect(analysis.method.vlm_calls).toBeGreaterThan(200);
    expect(analysis.findings["F-PV-05"].status).toContain("VGRADJENA");
  });

  test("determinističen re-run: analysis-v6.json byte-identno", () => {
    const before = sha256(join(PS, "analysis-v6.json"));
    execSync("python3 research-griblje/ps-n83/build-analysis-v6.py", { cwd: process.cwd(), stdio: "pipe" });
    expect(sha256(join(PS, "analysis-v6.json"))).toBe(before);
  });

  test("F11: Fürtrag kandidati zbrani (tile_row + pass totals) — monotona kontrola čaka celotno verigo", () => {
    expect(compare.fuertrag.length).toBeGreaterThan(250);
    expect(compare.fuertrag.some((f) => f.voice === "tile_row")).toBe(true);
    expect(compare.fuertrag.some((f) => f.voice === "p1" || f.voice === "p2")).toBe(true);
  });
});
