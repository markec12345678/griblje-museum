/**
 * Val 115 — VSTAVLJANJE IZPUŠČENIH VRSTIC (strukturni val; napovedan v v113/v114) — ISSUE #42 §4/§14.
 *
 * Vhodi: page_observations_v114 strukturna forenzika (p34/p40/p48/p49) — v57 je na 4 straneh
 * izpustil po eno fizično vrstico (dokazano s sidri v v114); vgradnja je bila izrecno odložena
 * ("VSTAVLJANJE = odprta strukturna odločitev") — ta val jo izvede.
 *
 * 4 VSTAVITVE (2871 → 2875), po PADajočem globalnem indeksu (indeksi stabilni med vstavitvami):
 *   1. p49 — gi 932: fizična p2, "2|973" (cela vrednost preklicana, kultur Acker);
 *      dokaz v114: 14 natanko ujemanj pod mapiranjem +1
 *   2. p48 — gi 912: fizična p2, "12" (Joch kolona, ni prečrtana, ime ~Schmipa[?]);
 *      dokaz v114: 10 natanko ujemanj; EDINA vstavljena vrstica z numerično jaethe → pass3 391→392
 *   3. p40 — gi 761: fizična p13 (tekač 734, Nro 21, Pechley Mich°, 1|65 — celotna vrstica
 *      rdeče prečrtana); v57 jo je izpustil in zlil v r12 ("4 - 65")
 *   4. p34 — gi 647: 21. vrstica pred Fürtragom (~70 QK, ime ~Hurich/Lohingr Mich.[?], aproksimacija)
 *
 * PRAVILA (1:1 hišni stil v112/v113/v114):
 *   - reading_pass 'v115-insert' = NOVA plast; stare plasti (v57/v82/v83/v86/v88/v111–v114) nedotaknjene
 *   - vrnjene (premaknjene) vrstice VSEBINSKO NESPREMENJENE — v114 je vrednosti že poravnal
 *   - page_observations_v115 = nov sloj na prvi vrstici vsake prizadete strani
 *   - F-PV-07-SPLIT val 115 marker na vstavljenih vrsticah z jae vrednostjo (p40, p49) → izpad iz
 *     pass3 projekcije (jae = Joch stavec / preklicano, ni parcelna številka)
 *
 * KASKADA (izrecna, testno vodena): PS parcele 391 → 392 (+1 p048-j12 brez haus_no); land use
 * None 76 → 77; KG PARCEL 2426 → 2427, vozlišča 3268 → 3269, vezi/HAS_PARCEL NESPREMENJENI
 * 3477/2773 (nova parcela brez haus_no = brez vezi; sha 0b478847); timeline I6 PUA 2035 / PS 392 /
 * raba 173+142; coverage PARTIAL 1066 → 1067; c4 K9 jaethe_plain_100_1599 69 NESPREMENJENO
 * (12/1/2 ≤ 99), druge oblike izrecno pincirane.
 *
 * Iskrenost (§4): TRANSCRIBED = 0; vstavljene vrednosti z aproksimacijami nosijo [?]/~ markerje;
 * p34 vrednost ~70 je eksplicitno aproksimacija (nizko pisanje pri robu celice).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const ROOT = join(import.meta.dir, "..");
const REG = JSON.parse(readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8")) as Record<
  string,
  unknown
>[];
const CHANGES = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/ps-n83/band-v113/register-v115-changes.json"), "utf8"),
) as {
  val: number;
  stats: { inserts: number; page_obs_adds: number; pages: string[] };
  changes: {
    type: string;
    index?: number;
    page?: number;
    reading_pass?: string;
    row?: Record<string, unknown>;
    text?: string;
  }[];
};

const byPage = (pg: number) => REG.filter((r) => r["page"] === pg);
const f = (r: Record<string, unknown>, k: string) => String(r[k] ?? "");
const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
const ATLAS = join(ROOT, "research-griblje", "atlas-1825");

describe("val 115 — gardele in infrastruktura", () => {
  test("register: 2875 vrstic (2871 + 4 vstavljene); stare plasti nedotaknjene (139 v88, 1795 v86 po val 116: 1755 + 40 p142, 265 v112, 80 v113 + 647 v114 po val 118 (p17/p18/p19 -> v118-names))", () => {
    expect(REG.length).toBe(2875);
    expect(REG.filter((r) => f(r, "reading_pass") === "v115-insert").length).toBe(4);
    const v88 = REG.filter((r) => "v88_status" in r || r["jk_review"] === "v88-digit-split-UNRESOLVED");
    expect(v88.length).toBe(139);
    expect(REG.filter((r) => f(r, "reading_pass") === "v86-colonial-tiles").length).toBe(1795); // val 116: 1755 + 40 (p142)
    expect(REG.filter((r) => f(r, "reading_pass") === "v112-ps-reread").length).toBe(265);
    expect(REG.filter((r) => f(r, "reading_pass") === "v113-ps-reread").length).toBe(0);
    expect(REG.filter((r) => f(r, "reading_pass") === "v114-ps-reread").length).toBe(607);
  });

  test("changes audit: val 115, 4 vstavitve + 4 page_obs (p49, p48, p40, p34 + obs)", () => {
    expect(CHANGES.val).toBe(115);
    expect(CHANGES.stats.inserts).toBe(4);
    expect(CHANGES.stats.page_obs_adds).toBe(4);
    expect(CHANGES.stats.pages).toEqual(["p49", "p48", "p40", "p34", "p34-obs", "p40-obs", "p48-obs", "p49-obs"]);
    expect(CHANGES.changes.length).toBe(8);
    const inserts = CHANGES.changes.filter((c) => c.type === "insert");
    expect(inserts.map((c) => c.index)).toEqual([932, 912, 761, 647]); // padajoče — indeksi stabilni
    expect(inserts.map((c) => c.page)).toEqual([49, 48, 40, 34]);
    for (const c of inserts) {
      expect(c.reading_pass).toBe("v115-insert");
      expect(c.row?.reading_pass).toBe("v115-insert");
      expect(String(c.row?.anmerkung)).toContain("VSTAVLJENA");
    }
  });

  test("vstavljene vrstice po straneh: p34 21, p40 21, p48 21, p49 22 (fizicna realnost)", () => {
    expect(byPage(34).length).toBe(21);
    expect(byPage(40).length).toBe(21);
    expect(byPage(48).length).toBe(21);
    expect(byPage(49).length).toBe(22);
  });

  test("page_observations_v115 na prvi vrstici vsake strani — izvedba odločitve iz v114", () => {
    for (const [pg, must] of [
      [34, "VSTAVLJENA 21. vrstica pred Fürtragom"],
      [40, "VSTAVLJENA fizična p13 (tekač 734, Nro 21, Pechley Mich°, 1|65 rdeče prečrtana)"],
      [48, 'VSTAVLJENA fizična p2 (vrednost "12" v Joch koloni, ime ~Schmipa[?])'],
      [49, 'VSTAVLJENA fizična p2 (preklicana "2|973", kultur Acker)'],
    ] as [number, string][]) {
      const obs = f(byPage(pg)[0], "page_observations_v115");
      expect(obs).toContain("v115:");
      expect(obs).toContain(must);
      expect(obs).toContain("2871→2875");
    }
  });
});

describe("val 115 — vsebine vstavljenih vrstic (sidra v114)", () => {
  test("p34 r20 (pred Fürtragom): ~70 QK, ime ~Hurich/Lohingr Mich.[?], aproksimacija izrecno", () => {
    const rows = byPage(34);
    const r = rows[20];
    expect(f(r, "reading_pass")).toBe("v115-insert");
    expect(f(r, "owner_original")).toBe("Hurich/Lohingr Mich.[?]");
    expect(f(r, "jaethe")).toBe("");
    expect(f(r, "klafter")).toBe("70");
    expect(f(r, "anmerkung")).toContain("aproksimacija");
    expect(f(r, "anmerkung")).toContain("F-PV-07 page-level p34");
    // sidro v114: zadnja v57 vrstica p34 nedotaknjena na r19
    expect(f(rows[19], "owner_original")).toBe("Eberl, Michl");
    expect(f(rows[19], "klafter")).toBe("273");
  });

  test("p40 r13: tekač 734, Nro 21, Pechley Mich°, 1|65 — celotna vrstica rdeče prečrtana + F-PV-07-SPLIT val 115", () => {
    const r = byPage(40)[13];
    expect(f(r, "reading_pass")).toBe("v115-insert");
    expect(f(r, "sheet_visible")).toBe("11. N.");
    expect(f(r, "no_blatt")).toBe("");
    expect(f(r, "haus_no")).toBe("1 / 21");
    expect(f(r, "owner_original")).toBe("Pechley Mich°");
    expect(f(r, "jaethe")).toBe("1");
    expect(f(r, "klafter")).toBe("65");
    expect(f(r, "anmerkung")).toContain("rdeče prečrtana");
    expect(f(r, "anmerkung")).toContain("F-PV-07-SPLIT val 115");
    // sidri: r12 = Wunderling (prazna celica v57), r14 = Pechley Michael p14 (Nro 20)
    expect(f(byPage(40)[12], "owner_original")).toBe("Wunderling");
    expect(f(byPage(40)[14], "owner_original")).toBe("Pechley Michael");
    expect(f(byPage(40)[14], "klafter")).toBe("860");
  });

  test("p48 r2: '12' v Joch koloni (ni prečrtana), ~Schmipa[?] — edina vstavljena z numerično jaethe", () => {
    const r = byPage(48)[2];
    expect(f(r, "reading_pass")).toBe("v115-insert");
    expect(f(r, "sheet_visible")).toBe("III. N.");
    expect(f(r, "no_blatt")).toBe("1");
    expect(f(r, "owner_original")).toBe("Schmipa[?]");
    expect(f(r, "jaethe")).toBe("12");
    expect(f(r, "klafter")).toBe("");
    expect(f(r, "anmerkung")).toContain("ni prečrtana");
    // BREZ F-PV-07-SPLIT markerja (jaethe = parcelna številka po F-PV-07)
    expect(f(r, "anmerkung")).not.toContain("F-PV-07-SPLIT");
    // sidri: r1 = Weidner p1 (279), r3 = Weidner p3 (733 — v114 mapirano)
    expect(f(byPage(48)[1], "owner_original")).toBe("Weidner Mathä.");
    expect(f(byPage(48)[1], "jaethe")).toBe("279");
    expect(f(byPage(48)[3], "jaethe")).toBe("733");
  });

  test("p49 r2: preklicana '2|973' (Joch|Klafter notacija), kultur Acker + F-PV-07-SPLIT val 115", () => {
    const r = byPage(49)[2];
    expect(f(r, "reading_pass")).toBe("v115-insert");
    expect(f(r, "sheet_visible")).toBe("II. N.");
    expect(f(r, "kultur")).toBe("Acker");
    expect(f(r, "jaethe")).toBe("2");
    expect(f(r, "klafter")).toBe("973");
    expect(f(r, "anmerkung")).toContain("cela vrednost prečrtana");
    expect(f(r, "anmerkung")).toContain("F-PV-07-SPLIT val 115");
    // sidri: r1 = Raguzl p1 (277), r3 = Hößle p3 (1|11 — v114 mapirano)
    expect(f(byPage(49)[1], "owner_original")).toBe("Raguzl Janez");
    expect(f(byPage(49)[1], "klafter")).toBe("277");
    expect(f(byPage(49)[3], "owner_original")).toBe("Hößle Marie");
    expect(f(byPage(49)[3], "jaethe")).toBe("1");
  });

  test("iskrenost §4: vstavljene vrstice so TRANSCRIBED-nevtralne (0 VLM), dvomna branja z [?]/~ markerji", () => {
    for (const pg of [34, 40, 48, 49]) {
      for (const r of byPage(pg).filter((x) => f(x, "reading_pass") === "v115-insert")) {
        expect(f(r, "anmerkung")).toContain("[v115:");
        // vse vrednosti imajo izrecno uncertaintye kjer je branje dvomljivo
        if (pg === 34) expect(f(r, "owner_original")).toContain("[?]");
        if (pg === 48) expect(f(r, "owner_original")).toContain("[?]");
      }
    }
  });
});

describe("val 115 — kaskada (izrecna, testno vodena)", () => {
  test("pass3: PS parcele 391 → 392 (+1 p048-j12); vstavljena p40 1|65 + p49 2|973 izpadla kot F-PV-07-SPLIT val 115", () => {
    const pr = JSON.parse(readFileSync(join(ATLAS, "parcel-register-1825.json"), "utf8")) as {
      ps_parcels_total: number;
      ps_land_use_coverage: Record<string, number>;
      ps_parcels: { parcel_id: string; page: number; parcel_number: number }[];
    };
    expect(pr.ps_parcels_total).toBe(392); // val 114: 391 → val 115: 392
    expect(pr.ps_land_use_coverage["null"]).toBe(77); // val 114: 76 → val 115: 77
    // edina nova parcela
    const novi = pr.ps_parcels.filter((p) => p.parcel_id === "PS-p048-j12");
    expect(novi.length).toBe(1);
    expect(novi[0].page).toBe(48);
    // izpadli (marker val 115) NE smejo biti projicirani
    expect(pr.ps_parcels.some((p) => p.page === 40 && p.parcel_number === 1)).toBe(false);
    expect(pr.ps_parcels.some((p) => p.page === 49 && p.parcel_number === 2)).toBe(false);
  });

  test("KG: PARCEL 2426 → 2427, vozlišča 3268 → 3269, vezi 3477 + HAS_PARCEL 2773 NESPREMENJENA (nova parcela brez haus_no); sha 0b478847", () => {
    const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
      node_stats: Record<string, number>;
      edge_stats: Record<string, number>;
      nodes: { node_id: string }[];
      edges: { relation_id: string }[];
      invariant_violations: unknown[];
    };
    expect(kg.node_stats.PARCEL).toBe(2427);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2773);
    expect(kg.nodes.length).toBe(3269);
    expect(kg.edges.length).toBe(3477);
    expect(kg.invariant_violations).toEqual([]);
    // edina sprememba = nov PARCEL node; ni novih vezi
    expect(kg.nodes.some((n) => n.node_id === "PARCEL:PS-p048-j12")).toBe(true);
    expect(sha(join(ATLAS, "knowledge-graph-1825.json"))).toMatch(/^0b478847/);
  });

  test("kaskadni artefakti držijo isti KG sha 0b478847… (pogodba §22)", () => {
    const kgSha = sha(join(ATLAS, "knowledge-graph-1825.json"));
    for (const p of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
      "research-griblje/atlas-1825/coverage-report-1825.json",
    ]) {
      const j = JSON.parse(readFileSync(join(ROOT, p), "utf8")) as { provenance?: { kg_sha256?: string } };
      if (j.provenance?.kg_sha256 !== undefined) expect(j.provenance.kg_sha256, p).toBe(kgSha);
      else expect(sha(join(ROOT, p)), p).toBe(kgSha);
    }
  });

  test("timeline I6 zatiči: PUA 2035 / PS 392 / raba 173+142 (val 115)", () => {
    const tl = JSON.parse(readFileSync(join(ROOT, "src/data/timeline-1825-1830.json"), "utf8")) as {
      points: { year: number; metrics: { metric_id: string; value: number }[] }[];
    };
    const m = (id: string, y: number) =>
      tl.points.find((p) => p.year === y)?.metrics.find((x) => x.metric_id === id)?.value;
    expect(m("parcels_pua", 1825)).toBe(2035);
    expect(m("parcels_ps", 1825)).toBe(392);
    expect(m("parcels_with_land_use", 1825)).toBe(173);
  });

  test("coverage: PARTIAL 1067 (PUA 675 + PS 392); story-graph 3269/3477", () => {
    const c = JSON.parse(readFileSync(join(ROOT, "src/data/atlas-coverage-report-1825.json"), "utf8")) as {
      quality_gate: { PARTIAL: number }[];
    };
    expect((c.quality_gate ?? []).some((g) => g.PARTIAL === 1067)).toBe(true);
    const sg = JSON.parse(readFileSync(join(ROOT, "src/data/story-graph-1825.json"), "utf8")) as {
      stats?: { entities?: number; relations?: number };
    };
    expect(sg.stats?.entities).toBe(3269);
    expect(sg.stats?.relations).toBe(3477);
  });

  test("c4 K9: jaethe_plain_100_1599 69 NESPREMENJENO (12/1/2 ≤ 99); nove oblike izrecno pincirane", () => {
    const c4 = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/ps-n83/band-v86/c4-metrika-v90.json"), "utf8"),
    ) as { K9_konfunda_F_PV_05?: unknown; K9_konfunda_F_PV_05b?: unknown; K9_konfunda_F_PV_05c?: unknown } & Record<
      string,
      { p1_55_val57: Record<string, number> } & Record<string, unknown>
    >;
    const k9 = (Object.keys(c4) as string[]).find((k) => k.startsWith("K9"));
    expect(k9).toBeDefined();
    const p1 = c4[k9!].p1_55_val57;
    expect(p1["jaethe_plain_100_1599"]).toBe(69); // val 114: 69 → val 115: 69 (nespremenjeno)
    expect(p1["jaethe_plain_le99"]).toBe(62); // val 114: 59 → val 115: 62 (+1 p40, +1 p48, +1 p49)
    expect(p1["klafter_plain_le99"]).toBe(174); // val 114: 172 → val 115: 174 (+1 p34 ~70, +1 p40 65)
    expect(p1["klafter_plain_100_1599"]).toBe(784); // val 114: 783 → val 115: 784 (+1 p49 973)
    expect(p1["both_filled"]).toBe(48); // val 114: 46 → val 115: 48 (+1 p40, +1 p49)
  });
});
