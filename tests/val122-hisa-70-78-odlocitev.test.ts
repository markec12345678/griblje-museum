/**
 * val 122 — hiša 70–78: ločena odločitev (protokol 144 §6.1 → protokol 145) — testi
 *
 * Odločitev (deterministično, 0 VLM, add-only — §4/§22):
 *  - H-074, H-076: NOVA vnosa v house-register (dokaz izključno PS p56–143,
 *    reading_pass v86-colonial-tiles = PROVISIONAL plast, F-PV-04/NR-14).
 *  - H-072: owners.ps vgrajen (2 vrstici p65, Wolfsloch Wolfgey) z
 *    layer=PROVISIONAL; imenska napetost PUA (Strauß Khonrad) NE razrešena.
 *  - H-070, H-071: ps_absence NEGATIVE-DECISIVE (celotna pokritost 143/143).
 *  - NR-05: val122_decision (negativ odločilen za 6, dokumentirani 3).
 *  - KG v2.5: HOUSE 167→169, HAS_PARCEL 2773→2775 (PS-p065-j1, PS-p069-j1);
 *    osebna plast NESPREMENJENA (F-SYNC-04) — PERSON 981, OWNER_OF 246.
 */
import { describe, expect, it } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const RG = "research-griblje";
const ATLAS = join(RG, "atlas-1825");

const readJSON = (p: string): any => JSON.parse(readFileSync(p, "utf8"));
const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

const HOUSES = readJSON(join(ATLAS, "house-register-1825.json"));
const NEG = readJSON(join(ATLAS, "negative-result-register-1825.json"));
const PS_REG = readJSON(join(RG, "ps-n83", "register.json")) as any[];
const KG = readJSON(join(ATLAS, "knowledge-graph-1825.json"));
const STORY = readJSON(join(ATLAS, "story-graph-1825.json"));
const TIMELINE = readJSON(join(ATLAS, "timeline-1825-1830.json"));
const COV = readJSON(join(ATLAS, "coverage-report-1825.json"));

const byNo = (hn: string) => HOUSES.houses.find((h: any) => h.house_no_1825 === hn);
const byId = (hid: string) => HOUSES.houses.find((h: any) => h.house_id === hid);
const QUALITY_PASSES = new Set([
  "v119-names", "v112-ps-reread", "v114", "v115", "v82-native-pass1",
]);

describe("val 122 — hiša 70–78: ločena odločitev (uveljavitev)", () => {
  it("register: 169 hiš (167→169); H-074/H-076 nova vnosa na pravem mestu; brez novih podvojenih ID-jev (13 pre-obstoječih H-1-* parov NE spremenjenih)", () => {
    expect(HOUSES.houses_total).toBe(169);
    expect(HOUSES.houses.length).toBe(169);
    const ids = HOUSES.houses.map((h: any) => h.house_id);
    expect(new Set(ids).size).toBe(ids.length - 13); // 13 pre-obstoječih podvojenih H-1-* parov (val 119 del 3) — izven dosega vala 122
    const nos = HOUSES.houses.map((h: any) => String(h.house_no_1825));
    expect(nos.slice(nos.indexOf("72"), nos.indexOf("79"))).toEqual([
      "72", "74", "76",
    ]);
  });

  it("varovala kakovostne plasti: hiše 70–78 imajo 0 vrstic v p3–p55 (v119/v112/v114/v115 NEDOTAKNJENE)", () => {
    const hits = PS_REG.filter(
      (r) =>
        String(r.haus_no ?? "").trim() >= "70" &&
        String(r.haus_no ?? "").trim() <= "78" &&
        !isNaN(Number(r.haus_no)) &&
        r.reading_pass in Object.fromEntries([...QUALITY_PASSES].map((p) => [p, 1])),
    );
    expect(hits.length).toBe(0);
    expect(PS_REG.length).toBe(2876); // val 121 stanje — register NI bil dotaknjen
  });

  it("H-070/H-071: ps_absence NEGATIVE-DECISIVE (0 vrstic čez 2.875); ps ostaja null", () => {
    for (const hid of ["H-070", "H-071"]) {
      const h = byId(hid);
      expect(h).toBeDefined();
      expect(h.owners.ps).toBeNull();
      expect(h.ps_absence.rows).toBe(0);
      expect(h.ps_absence.verdict).toBe("NEGATIVE-DECISIVE");
      expect(h.ps_absence.val).toBe(122);
      expect(h.notes).toContain("ODLOČILEN");
    }
  });

  it("H-072: owners.ps PROVISIONAL (2 vrstici p65, Wolfsloch Wolfgey, Acker); PUA↔PS imenska napetost dokumentirana, NE razrešena; sim polja null (kontinuiteta)", () => {
    const h = byId("H-072");
    expect(h.owners.ps.layer).toBe("PROVISIONAL");
    expect(h.owners.ps.owner_original).toBe("Wolfsloch Wolfgey");
    expect(h.owners.ps.pages).toEqual([65]);
    expect(h.owners.ps.rows).toBe(2);
    expect(h.owners.ps_distinct).toEqual([
      { name: "Wolfsloch Wolfgey", pages: [65], rows: 2 },
    ]);
    expect(h.parcel_refs.ps_rows).toBe(2);
    expect(h.parcel_refs.ps_kultur).toEqual({ Acker: 2 });
    // PUA nespremenjen + napetost eksplicitna
    expect(h.owners.pua[0].owner_original).toBe("Strauß Khonrad bauer zu Grübln");
    expect(h.notes).toContain("NI razrešena");
    expect(h.pua_ps_name_sim).toBeNull();
    expect(h.pua_ps_name_sim_v119).toBeUndefined();
  });

  it("H-074: NOV vnos, PS-only PROVISIONAL (4 vrstice: p65 ×2 Tillek Wolfgey, p69 Heidrich Peter, p122 Kauc Miheljz); NR-05/protokol sklici", () => {
    const h = byId("H-074");
    expect(h.house_no_type).toBe("gruble_house");
    expect(h.evidence_status).toBe("SINGLE_SOURCE");
    expect(h.owners.pua).toBeNull();
    expect(h.owners.ps.layer).toBe("PROVISIONAL");
    expect(h.owners.ps.rows).toBe(4);
    expect(h.owners.ps.pages).toEqual([65, 69, 122]);
    expect(h.owners.ps_distinct.map((d: any) => d.name)).toEqual([
      "Tillek Wolfgey", "Heidrich Peter", "Kauc Miheljz",
    ]);
    expect(h.parcel_refs.ps_rows).toBe(4);
    expect(h.notes).toContain("NR-05 negativ za 74");
    expect(h.notes).toContain("F-SYNC-04");
  });

  it("H-076: NOV vnos, PS-only PROVISIONAL (1 vrstica p115, Gritsch Mihlo, brez vrednosti — vrstica hišne oznake)", () => {
    const h = byId("H-076");
    expect(h.evidence_status).toBe("SINGLE_SOURCE");
    expect(h.owners.ps.layer).toBe("PROVISIONAL");
    expect(h.owners.ps.rows).toBe(1);
    expect(h.owners.ps.pages).toEqual([115]);
    expect(h.owners.ps.owner_original).toBe("Gritsch Mihlo");
    expect(h.parcel_refs.ps_rows).toBe(1);
    expect(h.parcel_refs.ps_kultur).toEqual({});
    expect(h.notes).toContain("0 PS parcel (F-PV-05)");
  });

  it("NR-05: val122_decision — negativ ODLOČILEN za [70,71,73,75,77,78], dokumentirani [72,74,76]; negatives_total 14 nespremenjen", () => {
    expect(NEG.negatives_total).toBe(14);
    const nr05 = NEG.negatives.find((n: any) => n.neg_id === "NR-05");
    expect(nr05.val89_recheck).toBeDefined(); // zgodovina ohranjena (add-only)
    const d = nr05.val122_decision;
    expect(d.negative_final).toEqual(["70", "71", "73", "75", "77", "78"]);
    expect(d.negative_basis).toContain("ODLOČILEN");
    expect(d.documented_provisional["72"]).toContain("H-072");
    expect(d.documented_provisional["74"]).toContain("H-074");
    expect(d.documented_provisional["76"]).toContain("H-076");
    expect(d.osebna_plast).toContain("NESPREMENJENA");
    expect(d.sospored).toContain("hiša 73");
  });

  it("KG v2.5 (val 122): HOUSE 169, HAS_PARCEL 2775, vozlišča 3764, vezi 3473, vrzeli 11 (+3 iskrene OWNER join miss), KG-F14; osebna plast stabilna (PERSON 981, OWNER_OF 246)", () => {
    expect(KG.title).toBe("knowledge-graph-1825 v2.5");
    expect(KG.val).toBe(122);
    expect(KG.node_stats.HOUSE).toBe(169);
    expect(KG.node_stats.PERSON).toBe(981);
    expect(KG.node_stats.PARCEL).toBe(2427);
    expect(KG.nodes.length).toBe(3764);
    expect(KG.edges.length).toBe(3473);
    expect(KG.edge_stats.HAS_PARCEL).toBe(2775);
    expect(KG.edge_stats.OWNER_OF).toBe(246);
    expect(KG.research_gaps.length).toBe(11);
    expect(KG.findings.at(-1).finding_id).toBe("KG-F14");
    expect(KG.findings.at(-1).status).toContain("RESOLVED-V122");
    // tiha vrzel odpravljena: H-074 ima zdaj 2 HAS_PARCEL vezi
    const h74 = KG.edges.filter(
      (e: any) => e.from_entity === "HOUSE:H-074" && e.relation_type === "HAS_PARCEL",
    );
    expect(h74.map((e: any) => e.to_entity).sort()).toEqual([
      "PARCEL:PS-p065-j1", "PARCEL:PS-p069-j1",
    ]);
    // H-072/H-076 brez parcel (F-PV-05)
    const h72p = KG.edges.filter(
      (e: any) => e.from_entity === "HOUSE:H-072" && e.relation_type === "HAS_PARCEL",
    );
    const h76p = KG.edges.filter(
      (e: any) => e.from_entity === "HOUSE:H-076" && e.relation_type === "HAS_PARCEL",
    );
    expect(h72p.length).toBe(0);
    expect(h76p.length).toBe(0);
    // vrzeli nosijo F-SYNC-04 razlago
    const gap7476 = KG.research_gaps.filter(
      (g: any) => g.missing_relation?.startsWith("HOUSE 74") || g.missing_relation?.startsWith("HOUSE 76"),
    );
    expect(gap7476.length).toBe(2);
    for (const g of gap7476) {
      expect(g.current_result).toContain("F-SYNC-04");
    }
  });

  it("kaskada (§22): story/timeline/coverage držijo KG ee3ac862; runtime kopije = arhiv", () => {
    const kgSha = sha256(join(ATLAS, "knowledge-graph-1825.json"));
    expect(kgSha.startsWith("ee3ac862")).toBe(true);
    expect(STORY.provenance.kg_sha256).toBe(kgSha);
    expect(STORY.provenance.kg_val).toBe(122);
    expect(TIMELINE.provenance.kg_sha256).toBe(kgSha);
    expect(COV.provenance.kg_sha256).toBe(kgSha);
    expect(sha256("src/data/knowledge-graph-1825.json")).toBe(kgSha);
    expect(sha256("src/data/story-graph-1825.json")).toBe(
      sha256(join(ATLAS, "story-graph-1825.json")),
    );
    expect(sha256("src/data/timeline-1825-1830.json")).toBe(
      sha256(join(ATLAS, "timeline-1825-1830.json")),
    );
    expect(sha256("src/data/atlas-coverage-report-1825.json")).toBe(
      sha256(join(ATLAS, "coverage-report-1825.json")),
    );
  });

  it("coverage: hiše 169 (VER 16 / PART 47 / CONF 33 / UNK 73); negative_results 14; §24 manifest 14/14", () => {
    const c = COV.quality_gate.find((x: any) => x.category_id === "houses");
    expect(c.total).toBe(169);
    expect(c.VERIFIED).toBe(16);
    expect(c.PARTIAL).toBe(47); // 13 PARTIAL + 34 SINGLE_SOURCE
    expect(c.CONFLICT).toBe(33);
    expect(c.UNKNOWN).toBe(73);
    const neg = COV.quality_gate.find((x: any) => x.category_id === "negative_results");
    expect(neg.total).toBe(14);
    expect(COV.outputs_manifest.count).toBe(14);
  });

  it("evidence_status razredi: SINGLE_SOURCE 32→34, ostali nespremenjeni (CONFLICT 33 / AGREE 16 / PARTIAL 13 / UNKNOWN_SEMANTICS 73)", () => {
    const st: Record<string, number> = {};
    for (const h of HOUSES.houses) st[h.evidence_status] = (st[h.evidence_status] ?? 0) + 1;
    expect(st).toEqual({
      CONFLICT: 33,
      SINGLE_SOURCE: 34,
      AGREE: 16,
      PARTIAL: 13,
      UNKNOWN_SEMANTICS: 73,
    });
  });

  it("dokument: protokol 145 obstaja in nosi ključne najdbe; KAZALO + README posodobljena", () => {
    const doc = readFileSync(join(RG, "145-val122-hisa-70-78-odlocitev.md"), "utf8");
    expect(doc).toContain("val 122");
    expect(doc).toContain("H-074");
    expect(doc).toContain("H-076");
    expect(doc).toContain("F-H122-01"); // opomba o pre-obstoječih podvojenih H-1-* ID-jih
    expect(doc).toContain("F-SYNC-04");
    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("145-val122-hisa-70-78-odlocitev.md");
    const readme = readFileSync("README.md", "utf8");
    expect(readme).toContain("145-val122-hisa-70-78-odlocitev");
  });
});
