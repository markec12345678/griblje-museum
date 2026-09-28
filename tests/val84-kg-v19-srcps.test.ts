/**
 * Val 84 — ISSUE #43 §1/§12 + #42 §22: KG v1.9 rebuild — SRC-PS vozlišče po val 82/83
 * + kaskada story_id (story-graph / timeline / coverage report pinajo kg_sha256).
 *
 * Invarianti (issue #43 §11/§12 + §22 pogodba):
 *  - SRC-PS vozlišče nosi dejansko stanje po val 82/83 (TRANSCRIBED 143/143, per-parcelno
 *    PROVISIONAL → pasovni re-read NR-14) — brez tihe zamenjave statusnih kategorij;
 *  - nodes/edges/claims/research_gaps/story_atoms števci in ID-ji NESPREMENJENI;
 *  - story_id kaskada: story-graph/timeline/coverage kg_sha256 == sha256 izhodnega KG;
 *  - NR-14 ima status PARTIAL (I3 v coverage builderju: brez procentov v ključih);
 *  - konflikt h.40 (PUA Sautter / PS Muster) ostane VIDEN — nič ne skrito.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, join } from "node:path";

const REPO = resolve(import.meta.dir, "..");
const ATLAS = resolve(REPO, "research-griblje", "atlas-1825");

const kg = JSON.parse(readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8")) as {
  val: number;
  title: string;
  findings: { finding_id: string; val: number; status: string; statement: string }[];
  nodes: Record<string, unknown>[];
  edges: { relation_id: string; from_entity: string; relation_type: string; to_entity: string }[];
  claims: { claim_id: string; subject: string; predicate: string; object: string }[];
  story_atoms: { story_id: string; source_ids: string[]; claim_ids: string[] }[];
  research_gaps: unknown[];
  node_stats: Record<string, number>;
};

const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
const kgSha = sha256(join(ATLAS, "knowledge-graph-1825.json"));

describe("val 84/86 — KG: SRC-PS vozlišče po val 82/83 + v2.0 (val 86 vgradnja)", () => {
  test("naslov + val + KG-F10 (RESOLVED-V84)", () => {
    expect(kg.title).toBe("knowledge-graph-1825 v2.0"); // val 86: naslov povišan, SRC-PS vozlišče vsebine ohranjene
    expect(kg.val).toBe(86); // val 86 rebuild (vsebina vozlišč val 84 ohranjena)
    const f10 = kg.findings.find((f) => f.finding_id === "KG-F10")!;
    expect(f10).toBeDefined();
    expect(f10.val).toBe(84);
    expect(f10.status).toContain("RESOLVED-V84");
    expect(f10.statement).toContain("PROVISIONAL");
    expect(f10.statement).toContain("NR-14");
  });

  test("SRC-PS vozlišče: TRANSCRIBED 143/143 + 2. prehod val 83 + PROVISIONAL (brez umetnega procenta)", () => {
    const ps = kg.nodes.find((n) => n.node_id === "SRC-PS") as {
      coverage?: string; uodid?: number; pages?: number; vac_details_url?: string;
    } | undefined;
    expect(ps).toBeDefined();
    expect(ps!.uodid).toBe(373415);
    expect(ps!.pages).toBe(143);
    expect(ps!.vac_details_url).toContain("id=373415");
    const cov = ps!.coverage ?? "";
    expect(cov).toContain("TRANSCRIBED 143/143");
    expect(cov).toContain("2.871 vrstic");
    expect(cov).toContain("val 82");
    expect(cov).toContain("val 83");
    expect(cov).toContain("PROVISIONAL");
    expect(cov).toContain("NR-14");
    // stara oznaka ne sme več živeti nikjer v KG
    expect(JSON.stringify(kg.nodes)).not.toContain("PARTIAL 55/143");
  });

  test("števci in ID-ji stabilni (3309/3569/622/8/4) — nič se ne premakne (§12)", () => {
    expect(kg.node_stats).toEqual({
      SOURCE: 13, HOUSE: 167, PERSON: 488, PARCEL: 2467, BP: 100, TOPONYM: 37, EVENT: 3, MAP_OBJECT: 34,
    });
    expect(kg.nodes.length).toBe(3309);
    expect(kg.edges.length).toBe(3569);
    expect(kg.claims.length).toBe(622);
    expect(kg.research_gaps.length).toBe(8);
    expect(kg.story_atoms.map((a) => a.story_id)).toEqual(["SA-001", "SA-002", "SA-003", "SA-004"]);
    // ID stabilnost: prvi/zadnji relation + claim
    expect(kg.edges[0].relation_id).toBe("R-00001");
    expect(kg.edges.at(-1)!.relation_id).toBe("R-03569");
    expect(kg.claims[0].claim_id).toBe("C-00001");
    expect(kg.claims.at(-1)!.claim_id).toBe("C-00622");
  });

  test("konflikt h.40 ostane viden: OBA lastniška claima (PUA Sautter / PS Muster)", () => {
    const h40 = kg.claims.filter(
      (c) => c.subject === "HOUSE:H-040" && c.predicate === "OWNER_DOCUMENTED",
    );
    const sources = h40.map((c) => (c as unknown as { source_ref?: { source?: string } }).source_ref?.source).sort();
    expect(sources).toContain("SRC-PS");
    expect(sources).toContain("SRC-PUA");
    expect(h40.length).toBe(2);
  });

  test("§11: story atomi ostanejo z claim + source povezavami", () => {
    for (const a of kg.story_atoms) {
      expect(a.source_ids.length).toBeGreaterThan(0);
      expect(a.claim_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("val 84 — kaskada story_id (§22): pinned kg_sha256 = sha256 izhodnega KG", () => {
  test("story-graph-1825.json (arhiv + runtime)", () => {
    const archive = JSON.parse(readFileSync(join(ATLAS, "story-graph-1825.json"), "utf8")) as {
      provenance: { kg_val: number; kg_sha256: string };
    };
    const runtime = JSON.parse(readFileSync(resolve(REPO, "src/data/story-graph-1825.json"), "utf8")) as {
      provenance: { kg_val: number; kg_sha256: string };
    };
    expect(archive.provenance.kg_val).toBe(86);
    expect(archive.provenance.kg_sha256).toBe(kgSha);
    expect(runtime.provenance).toEqual(archive.provenance);
  });

  test("timeline-1825-1830.json (arhiv + runtime)", () => {
    const archive = JSON.parse(readFileSync(join(ATLAS, "timeline-1825-1830.json"), "utf8")) as {
      provenance: { kg_sha256: string };
    };
    const runtime = JSON.parse(readFileSync(resolve(REPO, "src/data/timeline-1825-1830.json"), "utf8")) as {
      provenance: { kg_sha256: string };
    };
    expect(archive.provenance.kg_sha256).toBe(kgSha);
    expect(runtime.provenance.kg_sha256).toBe(kgSha);
  });

  test("coverage-report-1825.json (arhiv + runtime) + KG metapodatki nespremenjeni v reportu", () => {
    const archive = JSON.parse(readFileSync(join(ATLAS, "coverage-report-1825.json"), "utf8")) as {
      val: number;
      provenance: { kg_sha256: string };
      quality_gate: { category_id?: string; total?: number }[];
    };
    const runtime = JSON.parse(readFileSync(resolve(REPO, "src/data/atlas-coverage-report-1825.json"), "utf8")) as {
      provenance: { kg_sha256: string };
    };
    expect(archive.val).toBe(86);
    expect(archive.provenance.kg_sha256).toBe(kgSha);
    expect(runtime.provenance.kg_sha256).toBe(kgSha);
    const neg = archive.quality_gate.find((c) => c.category_id === "negative_results");
    expect(neg?.total).toBe(14);
  });
});

describe("val 84 — register negativnih rezultatov + source-coverage", () => {
  test("NR-14 ima status PARTIAL (I3: ključ brez procentov), negatives_total 14", () => {
    const nr = JSON.parse(readFileSync(join(ATLAS, "negative-result-register-1825.json"), "utf8")) as {
      negatives_total: number;
      negatives: { neg_id: string; status?: string; result: string }[];
    };
    expect(nr.negatives_total).toBe(14);
    expect(nr.negatives.length).toBe(14);
    const nr14 = nr.negatives.find((n) => n.neg_id === "NR-14")!;
    expect(nr14).toBeDefined();
    expect(nr14.status).toBe("PARTIAL");
    // rezultat (s procenti) ostane NEOKRNJEN kot vrednost — sprememba je samo dodan status
    expect(nr14.result).toContain("1798≈1797");
    expect(nr14.result).toContain("NE DOSEŽENO");
  });

  test("source-coverage val 84 + SRC-PS opomba ohrani val-83 dejstva", () => {
    const sc = JSON.parse(readFileSync(join(ATLAS, "source-coverage-1825.json"), "utf8")) as {
      val: number;
      sources: { source_id: string; note: string; status?: string }[];
      transcription: { PS: { pages: number; rows: number; passes: number } };
    };
    expect(sc.val).toBe(86);
    expect(sc.transcription.PS.pages).toBe(143);
    expect(sc.transcription.PS.rows).toBe(2871);
    expect(sc.transcription.PS.passes).toBe(3); // val 86 2. prehod (kolonski tile-i)
    const ps = sc.sources.find((s) => s.source_id === "SRC-PS")!;
    expect(ps.status).toBe("VERIFIED");
    expect(ps.note).toContain("nič tiho popravljeno");
    expect(ps.note).toContain("PROVISIONAL");
    // next_reads: KG v1.9 vnos ODSTRANJEN (izveden v tem valu), pasovni re-read na 1. mestu
    const scFull = sc as unknown as { next_reads: string[] };
    expect(scFull.next_reads[0]).toContain("val 86b");
    expect(scFull.next_reads.join(" ")).not.toContain("KG v1.9 rebuild");
  });
});
