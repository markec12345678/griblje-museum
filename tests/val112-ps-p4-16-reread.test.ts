/**
 * Val 112 — poln re-read PS: p3 imenski pass + p4–p16 vrednostni audit + F-PV-07
 * premestitve p5/p7/p12 (ISSUE #42 §4/§14)
 * [pot do podatka: 127-val112]
 *
 * Trije sloji vgradnje (agentov vid, 0 VLM — instrument val 61/88/108/111):
 *  1. p3 imenski pass: 19 lastnikov + 19 haus_no (vsi dvomi z [?]), r19 capital_kr
 *     27→22, r1 wohnort 'Gruble', r16 fantomski pas (anmerkung).
 *  2. F-PV-07 premestitve p5/p7/p12: 20+20+19 = 59 vrednosti jaethe→klafter
 *     (vrednost ostane, polje se zamenja; dokazano val 111/112 na p5/p6 izrezkih).
 *  3. Vrednostni audit p4 + p6 + p8–p16: 92 popravkov števk/halucinacij val 57
 *     (npr. p14 r17 1000→290, p16 r14 1852→482), 8 kultur, 10 ertrag/capital
 *     premestitev p6, 29 anmerkung add-only, p11 r22 FANTOMSKA vrstica.
 *
 * KASKADA (izrecna, testno vodena): PS parcele 735 → 676 (p5/p7/p12 izpadejo iz
 * numerične jaethe projekcije — vrednosti so območja, ne parcelne številke);
 * KG PARCEL 2770 → 2711, HAS_PARCEL 3072 → 3013; raba 438+221 → 391+209.
 * reading_pass := 'v112-ps-reread' na vseh pokritih vrsticah (p3 obdrži v111).
 *
 * ISKRENOST: 0 VLM klicev; vse imena/dvomi z [?]; prečrtanja dokumentirana, ne
 * dvignjena; odprte dileme (p5 r9/r15, haus 35/41 p4, kapitalni nizi p3) ostajajo
 * odprte — nič se ne vsiljuje (§4).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
type Row = {
  page: number;
  jaethe: string;
  klafter: string;
  reading_pass?: string;
  anmerkung: string;
  owner_original?: string;
  haus_no?: string;
  kultur?: string;
  capital_kr?: string;
  ertrag_fl?: string;
  ertrag_kr?: string;
  capital_fl?: string;
  wohnort?: string;
  page_observations?: string;
  page_observations_v112?: string;
};
const reg = JSON.parse(
  readFileSync(join(root, "research-griblje/ps-n83/register.json"), "utf8"),
) as Row[];
const changes = JSON.parse(
  readFileSync(join(root, "research-griblje/ps-n83/band-v112/register-v112-changes.json"), "utf8"),
) as {
  val: number;
  stats: {
    fpv07_moves: number; value_fixes: number; owner_fills: number; haus_fills: number;
    kultur_fills: number; ertrag_capital: number; anmerkung_adds: number; pages_covered: string[];
  };
  changes: { index: number; page?: number; type: string; field?: string; old?: unknown; new?: unknown }[];
};

const byPage = (p: number) => reg.filter((r) => r.page === p);

describe("val 112 — gardele in infrastruktura", () => {
  test("register: 2875 vrstic (val 115: +4 vstavljene), 139 v88, 1795 v86-colonial-tiles — nedotaknjeno (val 116: p142 +40)", () => {
    expect(reg.length).toBe(2875);
    expect(reg.filter((r) => (r as { v88_status?: string }).v88_status !== undefined || (r as { jk_review?: string }).jk_review === "v88-digit-split-UNRESOLVED").length).toBe(139);
    expect(reg.filter((r) => r.reading_pass === "v86-colonial-tiles").length).toBe(1795); // val 116: 1755 + 40 (p142)
  });

  test("changes audit: val 112, 270 sprememb, tally ujemajo", () => {
    expect(changes.val).toBe(112);
    expect(changes.changes.length).toBe(270);
    expect(changes.stats.fpv07_moves).toBe(59);
    expect(changes.stats.value_fixes).toBe(93);
    expect(changes.stats.owner_fills).toBe(33);
    expect(changes.stats.haus_fills).toBe(25);
    expect(changes.stats.kultur_fills).toBe(8);
    expect(changes.stats.ertrag_capital).toBe(10);
    expect(changes.stats.anmerkung_adds).toBe(29);
    expect(changes.stats.pages_covered).toEqual([
      "p3-names", "p5", "p7", "p12", "p4", "p6", "p8", "p9", "p10", "p11", "p13", "p14", "p15", "p16",
    ]);
  });

  test("vseh 14 reading JSON comittanih (p03–p16) z meta val 112 + 0 VLM", () => {
    for (let p = 3; p <= 16; p++) {
      const f = join(root, `research-griblje/ps-n83/band-v112/reading-v112/p${String(p).padStart(2, "0")}.json`);
      expect(existsSync(f), `p${p}`).toBe(true);
      const j = JSON.parse(readFileSync(f, "utf8")) as { meta?: { val?: number; method?: string } };
      expect(j.meta?.val, `p${p}`).toBe(112);
      expect(j.meta?.method ?? "", `p${p}`).toContain("0 VLM");
    }
  });

  test("reading_pass: 265 vrstic v112-ps-reread + p3 obdrži v111 (21)", () => {
    expect(reg.filter((r) => r.reading_pass === "v112-ps-reread").length).toBe(265);
    expect(reg.filter((r) => r.reading_pass === "v111-ps-reread").length).toBe(21);
    // pokrite strani = p3(v111) + p4–p16 brez p3-duplikatov
    const covered = new Set(reg.filter((r) => r.reading_pass === "v112-ps-reread").map((r) => r.page));
    for (let p = 4; p <= 16; p++) expect(covered.has(p), `p${p}`).toBe(true);
    expect(covered.has(3)).toBe(false); // p3 ostaja v111
  });
});

describe("val 112 — p3 imenski pass", () => {
  const p3 = byPage(3);

  test("19 lastnikov z [?] dvomi + r19 Gemeinde; r0/r16 brez imena", () => {
    const filled = p3.filter((r) => (r.owner_original ?? "").length > 0);
    expect(filled.length).toBe(19);
    expect(p3[19].owner_original).toBe("Gemeinde");
    for (const r of filled) {
      if (r.owner_original !== "Gemeinde") expect(r.owner_original).toMatch(/\[\?\]/);
    }
    expect(p3[0].owner_original ?? "").toBe("");
    expect(p3[16].owner_original ?? "").toBe("");
  });

  test("19 haus_no fills (r0 in r16 brez)", () => {
    const filled = p3.filter((r) => (r.haus_no ?? "").length > 0);
    expect(filled.length).toBe(19);
    expect(p3[0].haus_no ?? "").toBe("");
    expect(p3[16].haus_no ?? "").toBe("");
  });

  test("r1 wohnort 'Gruble' + stand anmerkung; r16 fantomski pas; r19 capital_kr 27→22", () => {
    expect(p3[1].wohnort).toBe("Gruble");
    expect(p3[1].anmerkung).toContain("stand močno prečrtan/neberljiv");
    expect(p3[16].anmerkung).toContain("fantomski pas");
    expect(p3[19].capital_kr).toBe("22");
    expect((p3[19] as unknown as { capital_kr_pre_v112?: string }).capital_kr_pre_v112).toBe("27");
  });

  test("F-PV-07 na p3 nespremenjen: vrednosti ostajajo v klafter (v111 vgradnja)", () => {
    for (const r of p3) {
      expect(r.jaethe ?? "").toBe("");
    }
  });
});

describe("val 112 — F-PV-07 premestitve p5/p7/p12 (59)", () => {
  test("p5: 20 premestitev — jaethe prazen, klafter vrednost; 8 vrednostnih popravkov (683/242/222/458/171/110/565/464)", () => {
    const p5 = byPage(5);
    expect(p5.length).toBe(20);
    for (const r of p5) {
      expect(r.jaethe ?? "").toBe("");
      expect((r.klafter ?? "").length).toBeGreaterThan(0);
    }
    expect(p5[2].klafter).toBe("683"); // 682 → 683
    expect(p5[7].klafter).toBe("242"); // 642 → 242
    expect(p5[8].klafter).toBe("222"); // 272 → 222
    expect(p5[10].klafter).toBe("458"); // 858 → 458
    expect(p5[12].klafter).toBe("171"); // 771 → 171
    expect(p5[13].klafter).toBe("110"); // 170 → 110
    expect(p5[17].klafter).toBe("565"); // 563 → 565
    expect(p5[18].klafter).toBe("464"); // 461 → 464
    expect(p5[0].anmerkung).toContain("dvojna vrednost 913 + 543[?]");
  });

  test("p7: 20 premestitev + r20 fantom-Fürtrag počiščen (owner brisan)", () => {
    const p7 = byPage(7);
    expect(p7.length).toBe(21);
    for (const r of p7) {
      expect(r.jaethe ?? "").toBe("");
    }
    expect(p7[20].owner_original ?? "").toBe("");
    expect(p7[20].anmerkung).toContain("fantomski rep");
    expect(p7[20].anmerkung).toContain("Furtrag 2|687 prečrtan -> rdeče 1140");
  });

  test("p12: 19 premestitev (r16 klafter '-' nadomeščen)", () => {
    const p12 = byPage(12);
    expect(p12.length).toBe(20);
    for (const r of p12) {
      expect(r.jaethe ?? "").toBe("");
    }
    expect(p12[16].klafter).not.toBe("-");
    expect(p12[16].klafter.length).toBeGreaterThan(0);
  });

  test("snimke jaethe_pre_v112 na premestitvah (sledljivost)", () => {
    const moved = reg.filter(
      (r) => r.reading_pass === "v112-ps-reread" && (r as unknown as { jaethe_pre_v112?: string }).jaethe_pre_v112 !== undefined,
    );
    expect(moved.length).toBe(59);
    for (const r of moved.slice(0, 5)) {
      const snap = (r as unknown as { jaethe_pre_v112: string }).jaethe_pre_v112;
      expect(snap.length).toBeGreaterThan(0);
      expect(r.jaethe).toBe("");
    }
  });
});

describe("val 112 — vrednostni audit p4 + p6 + p8–p16 (92 popravkov)", () => {
  test("p4: 6 popravkov (1204/825/16/194/468/412) + 10 haus + 13 imen + 8 kultur", () => {
    const p4 = byPage(4);
    expect(p4[2].klafter).toBe("1204"); // 1224 → 1204
    expect(p4[6].klafter).toBe("825"); // 525 → 825
    expect(p4[12].klafter).toBe("16"); // 76 → 16
    expect(p4[17].klafter).toBe("194"); // 190 → 194
    expect(p4[18].klafter).toBe("468"); // 483 → 468
    expect(p4[19].klafter).toBe("412"); // 410 → 412
    expect(p4[8].anmerkung).toContain("944 brez vidnega vira");
    expect(p4[17].anmerkung).toContain("napačen par");
  });

  test("p6: marginalni zapisi Ertrag/Capital premesteni r19→r20 (1109→1106, 1477→477)", () => {
    const p6 = byPage(6);
    expect(p6[19].ertrag_fl ?? "").toBe("");
    expect(p6[19].ertrag_kr ?? "").toBe("");
    expect(p6[19].capital_fl ?? "").toBe("");
    expect(p6[20].ertrag_fl).toBe("1");
    expect(p6[20].ertrag_kr).toBe("1106");
    expect(p6[20].capital_fl).toBe("477");
    expect(p6[20].anmerkung).toContain("svincnik?/crnilo");
    expect(p6[20].anmerkung).toContain("1106");
    expect(p6[11].capital_fl).toBe("104"); // 104 pisano v Cap.fl
    expect(p6[15].capital_fl).toBe("934"); // 934 pisano v Cap.fl
  });

  test("p8: r14 prazna celica (val57 397 brez vira) + r19 strukturna opamba (364 + Fürtrag revizije)", () => {
    const p8 = byPage(8);
    expect(p8[14].anmerkung).toContain("PRAZNA na strani");
    expect(p8[19].anmerkung).toContain("vrstica r19 = normalni vnos");
    expect(p8[19].anmerkung).toContain("Furtrag 3|1941 (R) -> 1|454 (R) -> 682");
  });

  test("p10: r0 normalizacija '10.92'→'1092' + r19 svinčnik '3|49[?]'", () => {
    const p10 = byPage(10);
    expect(p10[0].klafter).toBe("1092");
    expect((p10[0] as unknown as { klafter_pre_v112?: string }).klafter_pre_v112).toBe("10.92");
    expect(p10[19].anmerkung).toContain("3|49[?]");
  });

  test("p11: r22 FANTOMSKA vrstica (na strani ne obstaja) + svinčniki r18/r21", () => {
    const p11 = byPage(11);
    expect(p11.length).toBe(23);
    expect(p11[22].anmerkung).toContain("FANTOMSKA vrstica");
    expect(p11[22].anmerkung).toContain("9 Furtrag 2|798");
    expect(p11[18].anmerkung).toContain("zadnja stevka 1/4");
    expect(p11[21].anmerkung).toContain("2|777[?]");
  });

  test("p14: r17 1000→290 (največji posamezen popravek); p16: r14 1852→482", () => {
    expect(byPage(14)[17].klafter).toBe("290");
    expect((byPage(14)[17] as unknown as { klafter_pre_v112?: string }).klafter_pre_v112).toBe("1000");
    expect(byPage(16)[14].klafter).toBe("482");
    expect((byPage(16)[14] as unknown as { klafter_pre_v112?: string }).klafter_pre_v112).toBe("1852");
  });

  test("vsak vrednostni popravek ima snimko <field>_pre_v112 (sledljivost §4)", () => {
    const fixes = changes.changes.filter((c) => c.type === "v112_value_fix");
    expect(fixes.length).toBeGreaterThan(90);
    for (const f of fixes.slice(0, 30)) {
      const r = reg[f.index] as unknown as Record<string, unknown>;
      const snapKey = `${f.field}_pre_v112`;
      expect(r[snapKey], `r${f.index} ${f.field}`).toBeDefined();
    }
  });

  test("page_observations_v112 na vseh 14 straneh", () => {
    for (let p = 4; p <= 16; p++) {
      const rows = byPage(p);
      expect(
        rows.some((r) => (r.page_observations_v112 ?? "").length > 0),
        `p${p}`,
      ).toBe(true);
    }
  });
});

describe("val 112 — kaskada (izrecna)", () => {
  test("PS parcele 735 → 676 (p5/p7/p12 izpadajo — vrednosti so območja, ne parcelne številke)", () => {
    const pr = JSON.parse(
      readFileSync(join(root, "research-griblje/atlas-1825/parcel-register-1825.json"), "utf8"),
    ) as { ps_parcels_total: number; ps_land_use_coverage: Record<string, number> };
    expect(pr.ps_parcels_total).toBe(392); // val 114: 577 -> 391 → val 115: 392 (vstavljena p48)
    expect(pr.ps_land_use_coverage["njiva"]).toBe(105); // val 114: 198 -> 105
    expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(142); // val 114: 209 -> 146
    expect(pr.ps_land_use_coverage["null"]).toBe(77); // val 115: 76 → 77
    // p5/p7/p12 nimajo več nobene numerične jaethe
    for (const p of [5, 7, 12]) {
      for (const r of byPage(p)) expect(r.jaethe ?? "").toBe("");
    }
  });

  test("KG: PARCEL 2436, HAS_PARCEL 2775, vozlišča 3278, vezi 3479, claims 622 (val 114)", () => {
    const kg = JSON.parse(
      readFileSync(join(root, "research-griblje/atlas-1825/knowledge-graph-1825.json"), "utf8"),
    ) as {
      node_stats: Record<string, number>;
      edge_stats: Record<string, number>;
      nodes: unknown[];
      edges: unknown[];
      claims: unknown[];
      invariant_violations: unknown[];
    };
    expect(kg.node_stats.PARCEL).toBe(2427); // val 115: 2426 → 2427
    expect(kg.edge_stats.HAS_PARCEL).toBe(2773); // val 115: nespremenjeno
    expect(kg.nodes.length).toBe(3269); // val 115: 3268 → 3269
    expect(kg.edges.length).toBe(3477); // val 115: nespremenjeno
    expect(kg.claims.length).toBe(622);
    expect(kg.invariant_violations).toEqual([]);
  });

  test("kaskadni artefakti držijo isti KG sha b660c0d1… (pogodba §22, val 116)", () => {
    const { createHash } = require("node:crypto") as typeof import("node:crypto");
    const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
    const kgSha = sha(join(root, "research-griblje/atlas-1825/knowledge-graph-1825.json"));
    expect(kgSha).toMatch(/^b660c0d1/);
    for (const p of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
      "research-griblje/atlas-1825/coverage-report-1825.json",
    ]) {
      const j = JSON.parse(readFileSync(join(root, p), "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) expect(j.provenance.kg_sha256, p).toBe(kgSha);
      else expect(sha(join(root, p)), p).toBe(kgSha);
    }
  });

  test("timeline I6 zatiči: PUA 2035 / PS 392 / raba 173+142 (val 115)", () => {
    const tl = JSON.parse(
      readFileSync(join(root, "research-griblje/atlas-1825/timeline-1825-1830.json"), "utf8"),
    ) as { points: { year: number; metrics: { metric_id: string; value: number }[] }[] };
    const m = (id: string, y: number) => tl.points.find((p) => p.year === y)?.metrics.find((x) => x.metric_id === id);
    expect(m("parcels_pua", 1825)?.value).toBe(2035);
    expect(m("parcels_ps", 1825)?.value).toBe(392); // val 115: 391 → 392
    expect(m("parcels_with_land_use", 1825)?.value).toBe(173);
  });
});

describe("val 112 — iskrenost §4", () => {
  test("0 VLM klicev: method meta nosi 'agentov direktni vid'", () => {
    const j = JSON.parse(
      readFileSync(join(root, "research-griblje/ps-n83/band-v112/reading-v112/p05.json"), "utf8"),
    ) as { meta: { method: string } };
    expect(j.meta.method).toContain("agentov");
  });

  test("odprte dileme ostajajo odprte (p5 r9 248[?] vs 2245, p5 r15 625[?] vs 1350, p4 haus 35/41)", () => {
    expect(byPage(5)[9].anmerkung).toContain("razhajanje 248[?] vs 2245 — odprto");
    expect(byPage(5)[15].anmerkung).toContain("neujemljivo 625[?] vs 1350 — odprto");
    expect(byPage(4)[12].anmerkung).toContain("negotovo, potreben obisk");
    expect(byPage(4)[13].anmerkung).toContain("negotovo, potreben obisk");
  });

  test("prečrtanja dokumentirana kot anmerkung, NE kot dvig statusa", () => {
    const reds = [
      [5, 3], [5, 4], [5, 5], [5, 6], [5, 11], [5, 16], [5, 19], [6, 0],
    ] as const;
    for (const [p, i] of reds) {
      expect(byPage(p)[i].anmerkung, `p${p} r${i}`).toContain("val 112");
    }
    // evidence_status PS parcel ostaja TRANSCRIBED_PROVISIONAL (nič ne dvignjeno)
    const kg = JSON.parse(
      readFileSync(join(root, "research-griblje/atlas-1825/knowledge-graph-1825.json"), "utf8"),
    ) as { nodes: { node_type: string; origin?: string; evidence_status?: string }[] };
    const ps = kg.nodes.filter((n) => n.node_type === "PARCEL" && n.origin === "PS");
    for (const n of ps) expect(n.evidence_status).toBe("TRANSCRIBED_PROVISIONAL");
  });

  test("v111 spremembe na p3 NISO prepisane (register-v111-changes nedotaknjen + p3 klafter ostane)", () => {
    const v111 = JSON.parse(
      readFileSync(join(root, "research-griblje/ps-n83/band-v111/register-v111-changes.json"), "utf8"),
    ) as { meta: { val: string } };
    expect(v111.meta.val).toBe("111");
    const p3 = byPage(3);
    const withK = p3.filter((r) => (r.klafter ?? "").length > 0);
    expect(withK.length).toBe(19); // v111 vgradnja ostaja
  });
});
