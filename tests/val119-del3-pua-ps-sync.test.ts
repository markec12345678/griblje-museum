/**
 * Val 119 del 3 — PUA↔PS osebna sinhronizacija (F-PV-03/04 okvir) + register eArheologija živa preverba.
 * Varovalke: analysis-v7 (metoda B), person-owner 981, house-register AGREE 16,
 * conflict-register CH statusi, KG vsebinska sprememba (prvič od val 117),
 * eArheologija 26-0379 "v teku".
 */
import { describe, it, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const ROOT = join(import.meta.dir, "..");
const RG = join(ROOT, "research-griblje");

function sha256(rel: string): string {
  return createHash("sha256").update(readFileSync(join(ROOT, rel))).digest("hex");
}
function readJSON(rel: string): any {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8")) as any;
}

const analysis = readJSON("research-griblje/ps-n83/analysis-v7.json");
const persons = readJSON("research-griblje/atlas-1825/person-owner-register-1825.json");
const house = readJSON("research-griblje/atlas-1825/house-register-1825.json");
const conf = readJSON("research-griblje/atlas-1825/conflict-register-1825.json");
const kg = readJSON("research-griblje/atlas-1825/knowledge-graph-1825.json");
const arheo = readJSON("research-griblje/val119-del3/arheo-3692-10094-live-2026-10-04.json");

describe("val 119 del 3 — PUA↔PS sinhronizacija (F-SYNC)", () => {
  test("analysis-v7: 51 hiš, razredi v58 (0 soglasij) → v119 (16 AGREE + 2 PARTIAL + 33 MISMATCH)", () => {
    expect(analysis.val).toBe("119-del3");
    const A = analysis.A_pua_vs_ps_v119;
    expect(A.houses).toBe(51);
    expect(A.class_v58).toEqual({ MISMATCH: 49, FUZZY: 2 });
    expect(A.class_v119).toEqual({ MISMATCH: 33, AGREE: 16, PARTIAL: 2 });
    expect(A.agree_houses).toEqual([5, 18, 26, 27, 29, 30, 36, 37, 41, 42, 44, 51, 61, 62, 64, 69]);
    expect(A.partial_houses).toEqual([43, 66]);
    expect(A.improved_vs_v58).toBe(16);
  });

  test("najdbe F-SYNC-01..05 prisotne (metoda F-SYNC-01 popavek + lažna soglasja + stale hiše)", () => {
    const ids = analysis.findings.map((f: { id: string }) => f.id);
    expect(ids).toEqual(["F-SYNC-01", "F-SYNC-02", "F-SYNC-03", "F-SYNC-04", "F-SYNC-05"]);
    // F-SYNC-01: val 58 token_sim je dejansko LCS nad zlepljenima imenoma (docstring napaka)
    expect(analysis.findings[0].statement).toContain("zlepljenima imenoma");
    // F-SYNC-03: lažno soglasje h48 Höchsthaler↔Habschider prek "Georg" dokumentirano
    expect(analysis.findings[2].statement).toContain("Höchsthaler");
    // F-SYNC-05: 8 zastarelih owners.ps hiš
    expect(analysis.findings[4].statement).toContain("8 hiš");
  });

  test("h44 Husitsch Maria = AGREE sim_surname 1.0; h3 Dragasch ostaja CONFLICT (druga pisava, brez exact tokena)", () => {
    const r44 = analysis.A_pua_vs_ps_v119.rows.find((r: any) => r.house === 44);
    expect(r44.class_v119).toBe("AGREE");
    expect(r44.sim_surname).toBe(1.0);
    expect(r44.best_ps_name).toBe("Husitsch Maria");
    const r3 = analysis.A_pua_vs_ps_v119.rows.find((r: any) => r.house === 3);
    expect(r3.class_v119).toBe("MISMATCH");
    expect(r3.sim_surname).toBeCloseTo(0.667, 3);
    expect(r3.best_exact_token).toBe(false);
  });

  test("person-owner register: 981 oseb = 98 PUA (nedotaknjeno) + 656 PS v119 + 227 PT (nedotaknjeno); 418 NOT_MERGED", () => {
    expect(persons.persons_total).toBe(981);
    const types: Record<string, number> = {};
    for (const p of persons.persons) {
      types[p.person_type] = (types[p.person_type] ?? 0) + 1;
    }
    expect(types).toEqual({ "owner(pua)": 98, "owner(ps)": 656, "owner_variant(pt)": 227 });
    expect(persons.possible_duplicates).toBe(418);
    // owner(ps) = per (hiša, ime) s stranmi — h1 Barbara Muster prva pojavnost
    const barbara = persons.persons.find(
      (p: any) => p.name_original === "Barbara Muster" && p.person_type === "owner(ps)",
    );
    expect(barbara).toBeDefined();
    expect(barbara.house_no).toBe("1");
    expect(Array.isArray(barbara.page)).toBe(true);
    // PUA oseba nedotaknjena (val 51/57 review statusi ostajajo)
    const sautter = persons.persons.find((p: any) => (p.name_original ?? "").includes("Rupert Sautter"));
    expect(sautter.person_type).toBe("owner(pua)");
  });

  test("house-register: coverage 16 AGREE / 33 CONFLICT / 45 PARTIAL / 73 UNKNOWN_SEMANTICS; h40 CONFLICT + sim 0.432", () => {
    expect(house.houses_total).toBe(169);
    expect(house.coverage).toEqual({
      CONFLICT: 33,
      SINGLE_SOURCE: 32,
      AGREE: 16,
      PARTIAL: 13,
      UNKNOWN_SEMANTICS: 73,
    });
    const h40 = house.houses.find((h: any) => h.house_no_1825 === "40");
    expect(h40.evidence_status).toBe("CONFLICT");
    expect(h40.pua_ps_name_sim).toBeCloseTo(0.432, 3); // kontinuiteta val 58 (concat-first)
    expect(h40.pua_ps_name_sim_v119.class).toBe("MISMATCH");
    expect(h40.owners.ps.owner_original).toBe("Peter Muster"); // SA-002 nedotaknjena
    expect(h40.owners.ps_distinct.length).toBe(20);
  });

  test("8 zastarelih owners.ps hiš → ps_stale (dokaz ohranjen, owners.ps = null)", () => {
    const stale = house.houses.filter((h: any) => h.owners?.ps_stale);
    expect(stale.length).toBe(8);
    expect(stale.map((h: any) => h.house_no_1825).sort()).toEqual([
      "00", "1 / 52", "1 / 6", "1 / 69", "1/59", "214", "79", "85",
    ]);
    const h59 = house.houses.find((h: any) => h.house_no_1825 === "1/59");
    expect(h59.owners.ps).toBeNull();
    expect(h59.owners.ps_stale.owner_original).toBe("Schimek Michael"); // del 2c: '1 / 59'→49
    expect(h59.owners.ps_stale.stale_reason).toContain("val 119 del 3");
  });

  test("conflict-register: 113 konfliktov; CH = 4 RESOLVED + 12 PARTIALLY_RESOLVED + 35 OPEN; note_pass2 ohranjena", () => {
    expect(conf.conflicts_total).toBe(113);
    const ch = conf.conflicts.filter((c: any) => c.conflict_type === "owner_state_pua_vs_ps");
    expect(ch.length).toBe(51);
    const st: Record<string, number> = {};
    for (const c of ch) {
      st[c.status] = (st[c.status] ?? 0) + 1;
    }
    expect(st).toEqual({ OPEN: 35, PARTIALLY_RESOLVED: 12, RESOLVED: 4 });
    // RESOLVED = h18/26/29/30 (best_ps_name = first-owner, AGREE)
    const resolved = ch.filter((c: any) => c.status === "RESOLVED").map((c: any) => c.entity).sort();
    expect(resolved).toEqual(["hiša 18", "hiša 26", "hiša 29", "hiša 30"]);
    // vsak posodobljen CH ima note_pass2 (staro opombo nič tihega brisanja)
    expect(ch.every((c: any) => c.note_pass2 || c.status === "OPEN")).toBe(true);
  });

  test("KG vsebinsko SPREMENJEN (prvič od val 117, zadnja vsebina val 122): 3764 vozlišč / 3473 vezi / 614 trditev, PERSON 981, invariante čiste", () => {
    expect(kg.node_stats.PERSON).toBe(981);
    expect(kg.nodes.length).toBe(3764);
    expect(kg.edges.length).toBe(3473);
    expect(kg.claims.length).toBe(614);
    expect(kg.edge_stats.OWNER_OF).toBe(246);
    expect(kg.edge_stats.RESIDENCE_DOCUMENTED_AT).toBe(12);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2775); // nedotaknjeno
    expect(kg.invariant_violations).toEqual([]);
    // osebni sloj: PER-0586 = Peter Muster (owner(ps) v119), PER-0059 = PUA Sautter
    const per586 = kg.nodes.find((n: any) => n.node_id === "PER-0586");
    expect(per586.name_original).toBe("Peter Muster");
    expect(per586.person_type).toBe("owner(ps)");
    const per59 = kg.nodes.find((n: any) => n.node_id === "PER-0059");
    expect(per59.person_type).toBe("owner(pua)");
  });

  test("runtime kopija KG v src/data = atlas izhod (ena izhodna resnica)", () => {
    expect(sha256("src/data/knowledge-graph-1825.json")).toBe(
      sha256("research-griblje/atlas-1825/knowledge-graph-1825.json"),
    );
  });

  test("kaskada: story-graph 3764/3473; timeline kg_sha256 = KG sha (ena izhodna resnica); coverage houses VER 16", () => {
    const sg = readJSON("research-griblje/atlas-1825/story-graph-1825.json");
    expect(sg.stats.entities).toBe(3764);
    expect(sg.stats.relations).toBe(3473);
    expect(sg.stats.entities_by_type.PERSON).toBe(981);
    const kgSha = sha256("src/data/knowledge-graph-1825.json");
    const tl = readJSON("research-griblje/atlas-1825/timeline-1825-1830.json") as {
      provenance?: { kg_sha256?: string };
    };
    expect(tl.provenance?.kg_sha256).toBe(kgSha);
    const cov = readJSON("research-griblje/atlas-1825/coverage-report-1825.json");
    const houses = cov.quality_gate.find((c: any) => c.category_id === "houses");
    expect(houses.VERIFIED).toBe(16);
    const personsCat = cov.quality_gate.find((c: any) => c.category_id === "persons");
    expect(personsCat.total).toBe(981);
  });
});

describe("val 119 del 3 — register eArheologija (živa preverba 2026-10-04, sloj 3692 MK_ARHEO)", () => {
  test("26 zapisov EID ~10094; ena sprememba vs. val 102 artefakt: 26-0379 'napovedana' → 'v teku'", () => {
    expect(arheo.features.length).toBe(26);
    const attrs = arheo.features.map((f: any) => f.attributes);
    const k379 = attrs.find((a: any) => a.KODA_RAZ === "26-0379");
    expect(k379.STATUS).toBe("terenska raziskava v teku");
    expect(k379.URL_POROCILO1 ?? null).toBeNull(); // poročilo še ni javno
    // 26-0326 nespremenjen (poročilo oddano v pregled, brez javnega prenosa)
    const k326 = attrs.find((a: any) => a.KODA_RAZ === "26-0326");
    expect(k326.STATUS).toBe("prvo poročilo (oddano v pregled)");
    expect(k326.URL_POROCILO1 ?? null).toBeNull();
    // vseh 24 ostalih raziskav ima javni prenos 1. poročila (stanje val 104)
    const withUrl = attrs.filter((a: any) => a.URL_POROCILO1);
    expect(withUrl.length).toBe(24);
  });

  test("živi posnetek deterministično shranjen (sha artefakta)", () => {
    expect(sha256("research-griblje/val119-del3/arheo-3692-10094-live-2026-10-04.json")).toMatch(/^aa4695cd/);
  });
});
