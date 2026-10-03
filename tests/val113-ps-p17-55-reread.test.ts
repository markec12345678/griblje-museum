/**
 * Val 113 — vrednostni re-read PS p17–p24 (+ kultur pass p11 r0–r8) — ISSUE #42 §4/§14.
 *
 * Metoda: agentov direktni vid (0 VLM klicev) — z3 skladovni izrezki z IZMERJENIMI
 * horizontalnimi pravili (make-z3-v113.py; protikoval kalibracijskemu odmiku, ki je
 * pri nizko pisanih vrednostih povzročal off-by-one atribucijo) + ×10 diag zoomi.
 *
 * NOVO F-PV-07-SPLIT (val 113): pisar piše "N Joch | Q Klafter" notacijo — val 57 je
 * pare ZLIL (p17 r15 '1|400' → jae '1400'; p18 r4 '1|243' → jae '1912'; p18 r16/r17
 * '1|122'/'1|130' → jae '622'/'620'). Vgradnja: jae=Joch, kla=Klafter + marker
 * '[F-PV-07-SPLIT val 113' v anmerkung; pass3 novo izključitveno pravilo (analog
 * v88/F-PV-05): Joch števec NI parcelna številka.
 *
 * POMIK VRSTIC (F2-analog) na p19 (+ delno p20): 7 sidrnih ujemanj z +1 zamikom —
 * vgradnja teh strani izrecno ODLOŽENA (val 114 strukturni re-read).
 *
 * KASKADA (izrecna, testno vodena): PS parcele 676 → 577 (−99: p17/p18/p21/p22/p23
 * jaethe izpadi + 11 SPLIT marker izključitev); KG PARCEL 2711 → 2612, HAS_PARCEL
 * 3013 → 2914, vozlišča 3553 → 3454, vezi 3717 → 3618 (sha 5ae52bd8); timeline I6
 * PUA 2035 / PS 577 / raba 292+209; coverage PARTIAL 1351 → 1252; c4 K9 275 → 192.
 *
 * Iskrenost (§4): TRANSCRIBED = 0 (0 VLM); vsa dvomna branja so izrecno ODPRTA
 * (anmerkung 'razhajanje … — odprto'), nič se ne vsiljuje.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const REG = JSON.parse(readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8")) as Record<
  string,
  unknown
>[];
const CHANGES = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/ps-n83/band-v113/register-v113-changes.json"), "utf8"),
) as { val: number; stats: Record<string, unknown>; changes: unknown[] };

const byPage = (pg: number) => REG.filter((r) => r["page"] === pg);
const rowsOf = (pg: number) => byPage(pg);
const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");

describe("val 113 — gardele in infrastruktura", () => {
  test("register: 2875 vrstic (val 115: +4 vstavljene p34/p40/p48/p49), 139 v88, 1795 v86-colonial-tiles — nedotaknjeno (val 116: p142 +40)", () => {
    expect(REG.length).toBe(2875);
    const v88 = REG.filter((r) => "v88_status" in r || r["jk_review"] === "v88-digit-split-UNRESOLVED");
    expect(v88.length).toBe(139);
    const v86 = REG.filter((r) => r["reading_pass"] === "v86-colonial-tiles");
    expect(v86.length).toBe(1795); // val 116: 1755 + 40 (p142)
  });

  test("changes audit: val 113, 194 sprememb, stats ujemajo (89 moves + 9 splits + 16 popravkov + 63 opomb)", () => {
    expect(CHANGES.val).toBe(113);
    expect(CHANGES.changes.length).toBe(194);
    expect(CHANGES.stats.fpv07_moves).toBe(89);
    expect(CHANGES.stats.split_fixes).toBe(9);
    expect(CHANGES.stats.value_fixes).toBe(16);
    expect(CHANGES.stats.anmerkung_adds).toBe(63);
  });

  test("vseh 8 reading JSONov comittanih (p11-kultur, p17–p24) z meta val 113 + 0 VLM", () => {
    for (const n of ["p11-kultur", "p17", "p18", "p19", "p20", "p21", "p22", "p23", "p24"]) {
      const raw = readFileSync(
        join(ROOT, `research-griblje/ps-n83/band-v113/reading-v113/${n}.json`),
        "utf8",
      );
      expect(raw).toContain('"val": 113');
      expect(raw).toContain("0 VLM");
    }
  });

  test("reading_pass: 0 vrstic v113-ps-reread (p20–p24 prevzeti v119-names, val 119 del 1; p17/p18 = 40 v118-names, val 118)", () => {
    const n = REG.filter((r) => r["reading_pass"] === "v113-ps-reread").length;
    expect(n).toBe(0);
    for (const pg of [19, 20]) {
      for (const r of byPage(pg)) expect(r["reading_pass"]).not.toBe("v113-ps-reread");
    }
  });

  test("make-z3-v113.py obstaja (izmerjena pravila — protikoval off-by-one atribuciji)", () => {
    const s = readFileSync(join(ROOT, "research-griblje/raw-web-val111-2026-10/make-z3-v113.py"), "utf8");
    expect(s).toContain("detect_rules");
    expect(s).toContain("FALLBACK_Y0");
  });
});

describe("val 113 — F-PV-07-SPLIT (zlita notacija Joch|Klafter)", () => {
  test("p17 r15: jae '1400' → '1', kla → '400' (1|400) + marker", () => {
    const r = rowsOf(17)[15];
    expect(f(r, "jaethe")).toBe("1");
    expect(f(r, "klafter")).toBe("400");
    expect(f(r, "jaethe_pre_v113")).toBe("1400");
    expect(f(r, "anmerkung")).toContain("F-PV-07-SPLIT val 113");
  });

  test("p18: 5 splitov (r4 1|243, r11 1|50, r15 1|28, r16 1|122, r17 1|130) — v57 jih je zlil (1912/30/28/622/620)", () => {
    const exp: [number, string, string, string][] = [
      [4, "", "1243", "1912"], // val 121: vodilna 1 je V kl celici → all-klafter 1243
      [11, "1", "50", "30"],
      [15, "1", "28", "28"],
      [16, "1", "122", "622"],
      [17, "1", "130", "620"],
    ];
    for (const [i, jae, kla, pre] of exp) {
      const r = rowsOf(18)[i];
      expect(f(r, "jaethe")).toBe(jae);
      expect(f(r, "klafter")).toBe(kla);
      expect(f(r, "jaethe_pre_v113")).toBe(pre);
    }
  });

  test("11 SPLIT marker vrstic (p17×2, p18×5, p21×2, p23×1, p24×2)", () => {
    const n = REG.filter((r) => f(r, "anmerkung").includes("F-PV-07-SPLIT val 113")).length;
    expect(n).toBe(11);
  });
});

describe("val 113 — F-PV-07 premestitve + popravki p17–p24", () => {
  test("p17: 18 premestitev + popravki 650→690, 189→129, 526→556, 833→553", () => {
    const rows = rowsOf(17);
    expect(f(rows[0], "jaethe")).toBe("");
    expect(f(rows[0], "klafter")).toBe("87");
    expect(f(rows[2], "klafter")).toBe("690");
    expect(f(rows[8], "klafter")).toBe("129");
    expect(f(rows[18], "klafter")).toBe("556");
    expect(f(rows[19], "klafter")).toBe("553");
    expect(f(rows[2], "jaethe_pre_v113")).toBe("650");
  });

  test("p21: premestitve + popravki 273→573, 464→484, 839→859, 948→448; split r9 3|1248", () => {
    const rows = rowsOf(21);
    expect(f(rows[0], "klafter")).toBe("573");
    expect(f(rows[2], "klafter")).toBe("484");
    expect(f(rows[5], "klafter")).toBe("859");
    expect(f(rows[19], "klafter")).toBe("448");
    expect(f(rows[9], "jaethe")).toBe("3");
    expect(f(rows[9], "klafter")).toBe("1248");
  });

  test("p22: premestitve + popravki 208→308, 668→665, 524→824, 589→889, 852→352", () => {
    const rows = rowsOf(22);
    expect(f(rows[4], "klafter")).toBe("308");
    expect(f(rows[10], "klafter")).toBe("665");
    expect(f(rows[14], "klafter")).toBe("824");
    expect(f(rows[17], "klafter")).toBe("889");
    expect(f(rows[18], "klafter")).toBe("352");
  });

  test("p23: premestitve + popravki 217→317 (val 121 OBRNILO: ×16 glif = 2 z zanko → 217), 1087→1081, 1162→1163, 470→770, 705→715; split r14 jae=1", () => {
    const rows = rowsOf(23);
    expect(f(rows[3], "klafter")).toBe("217"); // val 121: v113 317 zavržena (×16 celicni zoom)
    expect(f(rows[4], "klafter")).toBe("1081");
    expect(f(rows[5], "klafter")).toBe("1163");
    expect(f(rows[10], "klafter")).toBe("770");
    expect(f(rows[15], "klafter")).toBe("715");
    expect(f(rows[14], "jaethe")).toBe("1");
    expect(f(rows[14], "klafter")).toBe("1048"); // val 121: razhajanje 1168 vs 1|1048 zaprto (rdeče prečrtana)')
  });

  test("p24: brez premestitev (v57 že pravilen stolpec) + popravki 756→736, 677→577, 908→905, 680→630, 546→544, 488→428, 243→343 + ocistka '.'", () => {
    const rows = rowsOf(24);
    expect(f(rows[0], "jaethe")).toBe("");
    expect(f(rows[0], "klafter")).toBe("736");
    expect(f(rows[7], "klafter")).toBe("577");
    expect(f(rows[8], "klafter")).toBe("905");
    expect(f(rows[9], "klafter")).toBe("630");
    expect(f(rows[11], "klafter")).toBe("544");
    expect(f(rows[18], "klafter")).toBe("428");
    expect(f(rows[19], "klafter")).toBe("343");
  });

  test("razhajanja val 113/114 ZAPRTA v val 121 (pasovni re-read) — §4 sledljivost ohranjena", () => {
    const closed = REG.filter((r) => f(r, "anmerkung").includes("— ZAPRTO val 121"));
    expect(closed.length).toBeGreaterThanOrEqual(60);
    for (const r of closed.slice(0, 20)) {
      const a = f(r, "anmerkung");
      expect(a.includes("razhajanje") || a.includes("neujemljivo")).toBe(true);
    }
  });

  test("p24: 8 prečrtano-rdečih opomb (revizije)", () => {
    const n = rowsOf(24).filter((r) => f(r, "anmerkung").includes("precrzano rdece") || f(r, "anmerkung").includes("precrzana rdece")).length;
    expect(n).toBeGreaterThanOrEqual(8);
  });
});

describe("val 113 — kultur pass p11 (halucinacija val 57)", () => {
  test("p11 r0–r8: anmerkung 'kultur re-read val 113' — ponovljeni zapisi vs 4 generični terme v57", () => {
    const rows = rowsOf(11).slice(0, 9);
    for (const r of rows) {
      expect(f(r, "anmerkung")).toContain("kultur re-read val 113");
    }
    expect(f(rows[0], "page_observations_v113")).toContain("halucinacija val 57 dokazana");
  });
});

describe("val 113 — pomik vrstic p19/p20 (F2-analog; vgradnja odložena val 114)", () => {
  test("p19 page_observations: 7 sidrnih ujemanj z +1 zamikom; brez v113 vgradnje", () => {
    const obs = f(rowsOf(19)[0], "page_observations_v113");
    expect(obs).toContain("POMIK VRSTIC");
    expect(obs).toContain("7 sidrnih ujemanj");
    const touched = rowsOf(19).filter((r) => f(r, "jaethe_pre_v113") !== "" || f(r, "klafter_pre_v113") !== "");
    expect(touched.length).toBe(0);
  });

  test("p20 page_observations: delni pomik v spodnji polovici; brez v113 vgradnje", () => {
    const obs = f(rowsOf(20)[0], "page_observations_v113");
    expect(obs).toContain("delni pomik");
    expect(obs).toContain("FUR 6|1183");
  });
});

describe("val 113 — kaskada (izrecna)", () => {
  const ATLAS = join(ROOT, "research-griblje/atlas-1825");
  const pr = JSON.parse(readFileSync(join(ATLAS, "parcel-register-1825.json"), "utf8")) as {
    ps_parcels_total: number;
    ps_land_use_coverage: Record<string, number>;
  };
  const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
    node_stats: Record<string, number>;
    edge_stats: Record<string, number>;
    nodes: unknown[];
    edges: unknown[];
  };

  test("pass3: PS parcele 577 → 393 (val 114: F-PV-07 premestitve p25–p55 + p28–p37 + SPLIT markerji ze-obstojecih parov)", () => {
    const s = readFileSync(join(ATLAS, "build-pass3.py"), "utf8");
    expect(s).toContain("F-PV-07-SPLIT val 113");
    expect(pr.ps_parcels_total).toBe(392); // val 115: 391 → 392 (vstavljena vrstica p48 "12")
    expect(pr.ps_land_use_coverage["njiva"]).toBe(105);
    expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(142);
    expect(pr.ps_land_use_coverage["null"]).toBe(77); // val 115: 76 → 77
  });

  test("KG: PARCEL 2436, HAS_PARCEL 2775, vozlišča 3278, vezi 3479 (val 114 kaskada)", () => {
    expect(kg.node_stats.PARCEL).toBe(2427);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2775);
    expect(kg.nodes.length).toBe(3764); // val 115: 3268 → 3269; val 122: 3762 → 3764 (HOUSE +2, hiša 70–78)
    expect(kg.edges.length).toBe(3473); // val 122: 3471 → 3473 (HAS_PARCEL +2 za H-074) // val 115: nespremenjeno
  });

  test("timeline I6 zatiči: PUA 2035 / PS 392 / raba 173+142 (val 115)", () => {
    const tl = JSON.parse(readFileSync(join(ROOT, "src/data/timeline-1825-1830.json"), "utf8")) as {
      points: { year: number; metrics: { metric_id: string; value: number }[] }[];
    };
    const m = (id: string, y: number) =>
      tl.points.find((p) => p.year === y)?.metrics.find((x) => x.metric_id === id)?.value;
    expect(m("parcels_ps", 1825)).toBe(392); // val 115: 391 → 392
    expect(m("parcels_with_land_use", 1825)).toBe(173);
  });

  test("coverage: PARTIAL 1067 (PUA 675 + PS 392, val 115)", () => {
    const c = JSON.parse(readFileSync(join(ROOT, "src/data/atlas-coverage-report-1825.json"), "utf8")) as {
      quality_gate: { PARTIAL: number }[];
    };
    expect((c.quality_gate ?? []).some((g) => g.PARTIAL === 1067)).toBe(true);
  });
});
