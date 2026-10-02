/**
 * Val 85 — ISSUE #42 §4/§14 + #43: PS N83 pasovni/zoom re-read s kolonskimi sidri — PILOT
 *
 * Invarianti (issue #43 §11/§12 + §4 poštenost + §22 pogodba):
 *  - verdikt pilota je merjen in comittan: horizontalni pasovi NESTABILNO (172 vs 144),
 *    kolonski trakovi STABILNO (±1–2) + J↔K rešeno → kolonski tile-i (val 86);
 *  - F-PV-05: enotna vrednost v JAETHE polju pass1/pass2 vs trak (0/140) — dokaz, da sta
 *    soglasji val 83 na skupno napačni dodelitvi; register p56–143 ostaja PROVISIONAL;
 *  - per-parcelne trditve ostajajo NIČ; register.json (reading_pass v82-native-pass1)
 *    NESPREMENJEN; KG v1.9 (sha 526482d2) NESPREMENJEN — nič ne beži v runtime (§22);
 *  - vzorec je determinističen iz reread-v83/comparison.json (kvantili + p98 + p121 + p59);
 *  - surovine comittane: 3 skripte, 2 manifesti, author-notes, vlm 46 JSON + 46 RAW;
 *    crops-v85/ + dnevniki regenerabilni (gitignored — precedens val 56/61).
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const REPO = resolve(import.meta.dir, "..");
const RG = resolve(REPO, "research-griblje");
const V85 = resolve(RG, "raw-web-val85-2026-10");
const PS = resolve(RG, "ps-n83");
const ATLAS = resolve(RG, "atlas-1825");

const analysis = JSON.parse(readFileSync(join(PS, "analysis-v5.json"), "utf8")) as {
  title: string;
  val: number;
  issue: string;
  method: { vlm_calls: number; errors: number; rate_429: number; vzorec: number[]; vzorec_pravilo: string };
  method_result: {
    pasovi: { rows_pass1: number; rows_pass2: number; rows_band_merged: number; verdikt: string };
    kolonski_trakovi: { verdikt: string };
    naslednja_iteracija: string;
  };
  findings: Record<string, { status: string; statement?: string; implikacija?: string; qklft_anomalija?: string }>;
  next_reads: string[];
};

const compare = JSON.parse(readFileSync(join(PS, "band-v85", "compare-v85.json"), "utf8")) as {
  meta: { val: number };
  summary: {
    sample: number[];
    rows: { pass1: number; pass2: number; band: number; p1_eq_band_pages: number; p2_eq_band_pages: number };
    no_blatt_alignment: { rows_total: number; band_nb_match: number };
  };
};

const strips = JSON.parse(readFileSync(join(PS, "band-v85", "compare-strips-v85.json"), "utf8")) as {
  meta: { val: number };
  summary: {
    sample: number[];
    tiebreak_3rd_voice: { total: number; track_third: number; track_empty: number; track_p1: number; track_p2: number };
  };
};

const manifest = JSON.parse(readFileSync(join(V85, "crops-manifest-v85.json"), "utf8")) as {
  meta: { schema: string; h_band: number; step: number; overlap: number; sample: number[] };
  pages: { page: number; width: number; height: number; bands: { cell: string; y0: number; y1: number; clamped: boolean }[]; rules: { x: number }[]; fold_x: number }[];
};
const zoomManifest = JSON.parse(readFileSync(join(V85, "zoom-manifest-v85.json"), "utf8")) as {
  zooms: { cell: string; page: number; strip: string; x0: number; x1: number; fields: string; rule_measured: boolean[] }[];
};

const authorNotes = JSON.parse(readFileSync(join(V85, "author-notes.json"), "utf8")) as {
  meta: { who: string; honesty: string };
};

const register = JSON.parse(readFileSync(join(PS, "register.json"), "utf8")) as {
  reading_pass?: string;
}[];

const kgSha = createHash("sha256").update(readFileSync(join(ATLAS, "knowledge-graph-1825.json"))).digest("hex");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

const vlmCount = (ext: string) => Number(execFileSync("bash", ["-c", `ls "${V85}/vlm/"*.${ext} | wc -l`]).toString().trim());

describe("val 85 — pilot: metoda in vzorec", () => {
  test("naslov, val, issue, 46 VLM klicev brez napak in brez 429", () => {
    expect(analysis.title).toContain("pasovni/zoom re-read s kolonskimi sidri");
    expect(analysis.val).toBe(85);
    expect(analysis.issue).toContain("#42");
    expect(analysis.issue).toContain("#43");
    expect(analysis.method.vlm_calls).toBe(46);
    expect(analysis.method.errors).toBe(0);
    expect(analysis.method.rate_429).toBe(0);
  });

  test("vzorec determinističen: kvantili + p98 + p121 + p59 = 8 strani (manifest enak analysis)", () => {
    expect(analysis.method.vzorec).toEqual([58, 59, 84, 98, 109, 121, 133, 143]);
    expect(analysis.method.vzorec_pravilo).toContain("kvantili");
    expect(analysis.method.vzorec_pravilo).toContain("98");
    expect(analysis.method.vzorec_pravilo).toContain("121");
    expect(analysis.method.vzorec_pravilo).toContain("59");
    expect(manifest.meta.sample).toEqual(analysis.method.vzorec);
    expect(manifest.meta.schema).toBe("val85-band-pilot");
    expect(manifest.meta.h_band).toBe(328);
    expect(manifest.meta.step).toBe(298);
    expect(manifest.meta.overlap).toBe(30);
    expect(compare.summary.sample).toEqual(analysis.method.vzorec);
  });

  test("surovine comittane: 3 skripte + 2 manifesti + author-notes + vlm 46 JSON + 46 RAW", () => {
    for (const f of ["make-bands-v85.mts", "make-zooms-v85.mts", "bandread-v85.mts", "crops-manifest-v85.json", "zoom-manifest-v85.json", "author-notes.json"]) {
      expect(existsSync(join(V85, f)), f).toBe(true);
    }
    expect(vlmCount("json")).toBe(46);
    expect(vlmCount("raw")).toBe(46);
    expect(existsSync(join(PS, "band-v85", "compare-v85.json"))).toBe(true);
    expect(existsSync(join(PS, "band-v85", "compare-strips-v85.json"))).toBe(true);
    for (const f of ["build-analysis-v5.py", "build-compare-v85.py", "build-compare-strips-v85.py"]) {
      expect(existsSync(join(PS, f)), f).toBe(true);
    }
  });

  test("crops-v85/ + dnevniki so gitignored (regenerabilno — precedens val 56/61)", () => {
    const out = execFileSync("git", ["check-ignore", "-v", `${V85}/crops-v85/x.png`, `${V85}/phaseA.out`, `${V85}/bandread-v85.log`], { cwd: REPO }).toString();
    expect(out).toContain("crops-v85/x.png");
    expect(out).toContain("phaseA.out");
    expect(out).toContain("bandread-v85.log");
  });

  test("avtorski odtis = neodvisen 1. bralec PRED VLM (poštenost §4)", () => {
    expect(authorNotes.meta.who).toContain("neodvisen 1. bralec");
    expect(authorNotes.meta.who).toContain("PRED VLM");
    expect(authorNotes.meta.honesty).toContain("[?]");
  });

  test("manifesti: 8 strani × 4 pasovi + izmerjena sidra; 14 zoom trakov (p143 izpuščen)", () => {
    expect(manifest.pages.map((p) => p.page)).toEqual([58, 59, 84, 98, 109, 121, 133, 143]);
    for (const p of manifest.pages) {
      expect(p.bands).toHaveLength(4);
      expect(p.bands[0].y0).toBe(0);
      expect(p.bands.every((b) => b.y1 > b.y0)).toBe(true);
      // p143 = rdeči povzetek (polovična širina, brez tabele → 0 pravil, brez preklopa)
      if (p.page === 143) {
        expect(p.width).toBeLessThan(700);
        expect(p.rules).toHaveLength(0);
        expect(p.fold_x).toBeNull();
        continue;
      }
      expect(p.rules.length).toBeGreaterThanOrEqual(5); // izmerjena vertikalna pravila (sidra)
      for (const r of p.rules) {
        expect(Number.isFinite(r.x)).toBe(true);
        expect(r.x).toBeGreaterThanOrEqual(0); // pravilo je lahko na levem robu
        expect(r.x).toBeLessThan(p.width);
      }
      if (p.fold_x !== null) expect(Number.isFinite(p.fold_x)).toBe(true);
    }
    expect(zoomManifest.zooms).toHaveLength(14);
    for (const z of zoomManifest.zooms) {
      expect([58, 59, 84, 98, 109, 121, 133]).toContain(z.page);
      expect(["name", "kultur"]).toContain(z.strip);
      expect(z.x1).toBeGreaterThan(z.x0);
      expect(z.rule_measured.every((m) => typeof m === "boolean")).toBe(true);
    }
    // VLM izhodi (faza R) ustrezajo zoom celicam
    for (const z of zoomManifest.zooms) {
      expect(existsSync(join(V85, "vlm", `${z.cell}-R.json`)), z.cell).toBe(true);
    }
  });
});

describe("val 85 — verdikt pilota (merjeno)", () => {
  test("horizontalni pasovi NESTABILNO: 172 zlito vs 144 vrstic, 0/8 strani poravnanih", () => {
    const p = analysis.method_result.pasovi;
    expect(p.rows_pass1).toBe(144);
    expect(p.rows_pass2).toBe(144);
    expect(p.rows_band_merged).toBe(172);
    expect(p.verdikt).toContain("NESTABILNO");
    expect(compare.meta.val).toBe(85);
    expect(compare.summary.rows).toEqual({ pass1: 144, pass2: 144, band: 172, p1_eq_band_pages: 0, p2_eq_band_pages: 0 });
    expect(compare.summary.no_blatt_alignment).toEqual({ rows_total: 143, band_nb_match: 6 });
  });

  test("kolonski trakovi STABILNO (±1–2) + J↔K rešeno → naslednja iteracija kolonski tile-i", () => {
    const t = analysis.method_result.kolonski_trakovi;
    expect(t.verdikt).toContain("STABILNO");
    expect(t.verdikt).toContain("REŠENA");
    expect(analysis.method_result.naslednja_iteracija).toContain("KOLONSKI TILE-i");
    expect(strips.meta.val).toBe(85);
    expect(strips.summary.sample).toEqual([58, 59, 84, 98, 109, 121, 133]);
    expect(strips.summary.sample).not.toContain(143);
  });

  test("tretji glas (trak) — porazdelitev 475/212/12/24 čez 723 poravnav", () => {
    const tv = strips.summary.tiebreak_3rd_voice;
    expect(tv.total).toBe(723);
    expect(tv.track_third).toBe(475);
    expect(tv.track_empty).toBe(212);
    expect(tv.track_p1).toBe(12);
    expect(tv.track_p2).toBe(24);
    expect(tv.track_third + tv.track_empty + tv.track_p1 + tv.track_p2).toBe(tv.total);
  });
});

describe("val 85 — najdbe", () => {
  test("F-PV-05: enotna vrednost v JAETHE polju — pass1/pass2 vs trak 0/140 (sistemski pomik J→K)", () => {
    const f = analysis.findings["F-PV-05"];
    expect(f).toBeDefined();
    expect(f.status).toContain("DOKUMENTIRANA");
    expect(f.statement).toContain("Quad. Kläfter");
    expect(f.statement).toContain("skupno napačni dodelitvi");
    expect(f.implikacija).toContain("PROVISIONAL");
    expect(f.implikacija).toContain("NESPREMENJEN");
  });

  test("F-PV-04: rešitvena pot VALIDIRANA-V85 — kolonski tile-i, ne horizontalni pasovi", () => {
    expect(analysis.findings["F-PV-04"].status).toContain("VALIDIRANA-V85");
    expect(analysis.findings["F-PV-04"].status).toContain("kolonski tile-i");
  });

  test("F-PV-03 ostaja OPEN — pilot NI dvignil (p98 tretjič skrajšanje kultur)", () => {
    const f = analysis.findings["F-PV-03"];
    expect(f.status).toContain("OPEN");
    expect(f.status).toContain("tretjič");
  });

  test("F11: Fürtrag veriga na vzorcu (7 točk) + qklft anomalija p121 razrešena na ravni branja", () => {
    const f = analysis.findings["F11"];
    expect(f.status).toContain("DELNO POTRJENO-V85");
    expect(f.status).toContain("p58 = 56. Fürtrag 6 J 1009");
    expect(f.status).toContain("p133 = 137. F. 7 J 934");
    expect(f.qklft_anomalija).toContain("17 J 266");
    expect(f.qklft_anomalija).toContain("12 1046");
    expect(f.qklft_anomalija).toContain("sane pravilo potrjeno");
  });

  test("F15: REPRODUCIRANO-V85 (p133 posebna sekcija, rimske IV/V, Uebersetzung 2661+)", () => {
    const f = analysis.findings["F15"];
    expect(f.status).toContain("REPRODUCIRANO-V85");
    expect(f.status).toContain("p133");
    expect(f.status).toContain("2661");
  });
});

describe("val 85 — poštenost §4 + §22 (nič ne beži v runtime)", () => {
  test("register.json 2.875 vrstic (val 115: 2871 + 4 vstavljene p34/p40/p48/p49); val 86 + 98 + 107 vgradnja: 1.795 v86-colonial-tiles (val 116: +40 p142) + 3 v82-native-pass1 (p143)", () => {
    expect(register).toHaveLength(2875);
    expect(register.filter((r) => r.reading_pass === "v82-native-pass1")).toHaveLength(3); // val 98: 689 → val 107: 43 → val 116: 3 (p142 prešla v v86)
    expect(register.filter((r) => r.reading_pass === "v86-colonial-tiles")).toHaveLength(1795); // val 98: 1109 → val 107: 1755 → val 116: 1795 (+40 p142)
  });

  test("KG v2.4 (val 115 kaskada): sha 62d8cfea… + metapodatki", () => {
    expect(kgSha.startsWith("62d8cfea")).toBe(true); // val 116 KG (p142 2. prehod — vsebina identična, samo generated_at) — val 114 je bil 376e2b27, val 112 5ae52bd8, val 108 v2.4 (9f856d28), val 89 v2.1 (b4f5011c), val 86 v2.0 (6fb6fae8), val 98 v2.2 (2b16acad)
    const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as { val: number; title: string };
    expect(kg.val).toBe(108); // val 107: 86b del 3 — tile 3. glas p110–141
    expect(kg.title).toBe("knowledge-graph-1825 v2.4");
  });

  test("kaskada §22 nespremenjena: story-graph/timeline/coverage (arhiv + runtime) držijo isti KG sha", () => {
    for (const [rel, path] of [
      ["story", join(ATLAS, "story-graph-1825.json")],
      ["story-runtime", join(REPO, "src/data/story-graph-1825.json")],
      ["timeline", join(ATLAS, "timeline-1825-1830.json")],
      ["timeline-runtime", join(REPO, "src/data/timeline-1825-1830.json")],
      ["coverage", join(ATLAS, "coverage-report-1825.json")],
      ["coverage-runtime", join(REPO, "src/data/atlas-coverage-report-1825.json")],
    ] as const) {
      const j = JSON.parse(readFileSync(path, "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) {
        expect(j.provenance.kg_sha256, rel).toBe(kgSha);
      } else {
        throw new Error(`${rel}: manjka provenance.kg_sha256 (pogodba §22)`);
      }
    }
  });

  test("analysis-v5.json determinističen (re-run builderja byte-identno)", () => {
    const before = sha256(join(PS, "analysis-v5.json"));
    execFileSync("python3", [join(PS, "build-analysis-v5.py")], { cwd: REPO, stdio: "ignore" });
    expect(sha256(join(PS, "analysis-v5.json"))).toBe(before);
  });

  test("next_reads: val 86 kolonski tile-i na 1. mestu", () => {
    expect(analysis.next_reads[0]).toContain("val 86");
    expect(analysis.next_reads[0]).toContain("KOLONSKI TILE-i");
  });
});
