/**
 * Val 126 — NR-14 črkovalna sodba + pass2 re-run (F-V125-01 zaprt).
 * Varovalke: nr14-variant-map-1825.json (6 parov + 4 zavrnjene, flag-only),
 * build-sync-v126.py (normalized_nr14 ključi, 0 variantnih grup v register),
 * osebna plast 982 (98 PUA + 657 PS v125 + 227 PT), H-035 pages brez p7 po stari
 * hiši 35, PROVISIONAL h72/74/76 zaščitene, analysis-v8 (metoda B nespremenjena),
 * KG vsebinsko SPREMENJEN (PERSON 981→982, v125 p7 osebe vstopajo; sha 1e49de43).
 */
import { describe, it, expect, test } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

const ROOT = join(import.meta.dir, "..");
const ATLAS = "research-griblje/atlas-1825";

function sha256(rel: string): string {
  return createHash("sha256").update(readFileSync(join(ROOT, rel))).digest("hex");
}
function readJSON(rel: string): any {
  return JSON.parse(readFileSync(join(ROOT, rel), "utf8")) as any;
}

const map = readJSON(`${ATLAS}/nr14-variant-map-1825.json`);
const persons = readJSON(`${ATLAS}/person-owner-register-1825.json`);
const house = readJSON(`${ATLAS}/house-register-1825.json`);
const conf = readJSON(`${ATLAS}/conflict-register-1825.json`);
const analysis = readJSON("research-griblje/ps-n83/analysis-v8.json");
const kg = readJSON(`${ATLAS}/knowledge-graph-1825.json`);
const story = readJSON(`${ATLAS}/story-graph-1825.json`);
const timeline = readJSON(`${ATLAS}/timeline-1825-1830.json`);
const coverage = readJSON(`${ATLAS}/coverage-report-1825.json`);

// ---------- norm replika (1:1 z build-sync-v126) ----------
function normConcat(s: string): string {
  return (s || "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase();
}
const SUBS: Record<string, string> = {
  rabutschar: "rabitscher",
  grogy: "georg",
  poiding: "podigz",
  michual: "mihual",
  schimez: "schimecz",
};
function applyVariants(name: string): string {
  const toks = (name || "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
  return normConcat(toks.map((t) => SUBS[t] ?? t).join(""));
}

describe("val 126 — NR-14 črkovalna sodba (karta)", () => {
  test("karta: 6 parov V1–V6 + 4 zavrnjene forme; odločitev flag-only (KEEP register forme)", () => {
    expect(map.map_id).toBe("NR-14");
    expect(map.decision).toContain("FLAG-ONLY");
    expect(map.variant_pairs.length).toBe(6);
    expect(map.variant_pairs.map((p: any) => p.pair_id)).toEqual([
      "V1",
      "V2",
      "V3",
      "V4",
      "V5",
      "V6",
    ]);
    expect(map.rejected_forms.map((r: any) => r.form)).toEqual([
      "Marls",
      "Rabatschar",
      "Schimz",
      "Schimez P…a (2. beseda)",
    ]);
  });

  test("izenačitvena logika: Rabutschar→Rabitscher, Grogy→Georg, Poiding→Pödigz(norm), Michual→Mihual, Schimez→Schimecz", () => {
    expect(applyVariants("Rabutschar Grogy")).toBe(applyVariants("(R)abitscher Georg"));
    expect(applyVariants("Strauß Grogy")).toBe(applyVariants("Strauß Georg"));
    expect(applyVariants("Rabutschar Marbl")).toBe(applyVariants("(R)abitscher Marbl"));
    expect(applyVariants("Poiding Hanß")).toBe("podigzhan"); // ß izpade (norm), Poiding→podigz
    expect(applyVariants("Michual")).toBe(applyVariants("Mihual"));
    expect(applyVariants("Schimez Hanl")).toBe(applyVariants("Schimecz Hanl"));
  });

  test("V6 avtomatika: NFKD razgradi long-s — 'Maruſa' ≡ 'Marusa' že na nivoju norm", () => {
    expect(normConcat("Maruſa")).toBe("marusa");
    expect(normConcat("Pödigz Maruſa")).toBe(applyVariants("Pödigz Marusa"));
  });

  test("Marls NI varianta (v124 napaka branja) — 'Marls' se ne izenači z 'Marusa'", () => {
    expect(applyVariants("Pödigz Marls")).not.toBe(applyVariants("Pödigz Marusa"));
  });
});

describe("val 126 — pass2 re-run: person-owner register (F-V125-01)", () => {
  test("val 126 oznaka; 982 oseb = 98 PUA + 657 PS v125 + 227 PT; 419 possible_duplicates NOT_MERGED", () => {
    expect(persons.val).toBe("126");
    expect(persons.persons_total).toBe(982);
    const types: Record<string, number> = {};
    for (const p of persons.persons) types[p.person_type] = (types[p.person_type] ?? 0) + 1;
    expect(types).toEqual({ "owner(pua)": 98, "owner(ps)": 657, "owner_variant(pt)": 227 });
    expect(persons.possible_duplicates).toBe(419);
    expect(persons.nr14_variant_groups).toBe(0); // merjeno: forme že kanonizirane
  });

  test("vse osebe nosijo normalized_nr14; owner(ps) vnos je per (hiša, ime) — v125 p7 strukturne osebe vstopajo", () => {
    for (const p of persons.persons) {
      expect(typeof p.normalized_nr14).toBe("string");
      expect(p.merge_decision === undefined || p.merge_decision === "NOT_MERGED").toBe(true);
    }
    const want = [
      { hn: "53", nm: "Pödigz Hanl" },
      { hn: "49", nm: "Schimecz Mihual" },
      { hn: "50", nm: "Pödigz Marusa" },
      { hn: "55", nm: "Schimez Hanl" },
      { hn: "56", nm: "Schimez P…a" },
      { hn: "48", nm: "(R)abitscher Georg" },
      { hn: "45", nm: "(R)abitscher Georg" },
      { hn: "46", nm: "Strauß Georg" },
    ];
    for (const w of want) {
      const hit = persons.persons.find(
        (p: any) => p.person_type === "owner(ps)" && p.house_no === w.hn && p.name_original === w.nm,
      );
      expect(hit, `${w.hn}/${w.nm}`).toBeDefined();
      expect(hit.page).toContain(7);
    }
    // stare (ovržene) v57 osebe iz p7 izpada
    const gone = ["Poiding Hanl", "(K)hanzl Valen", "Poiding Matthl", "Peders Marbl"];
    for (const nm of gone) {
      expect(
        persons.persons.find(
          (p: any) => p.person_type === "owner(ps)" && p.name_original === nm && String(p.page).includes("7"),
        ),
        nm,
      ).toBeUndefined();
    }
  });

  test("F-SYNC-04: PS p56–143 PROVISIONAL NI vstopila v osebno plast (vsi owner(ps) page ≤ 55)", () => {
    for (const p of persons.persons) {
      if (p.person_type !== "owner(ps)") continue;
      for (const pg of p.page as number[]) expect(pg).toBeLessThanOrEqual(55);
    }
  });
});

describe("val 126 — house register", () => {
  test("val 126; 169 hiš; coverage preštet (SINGLE_SOURCE 34 = per-house realnost; stale 32 od val 122 popravljen)", () => {
    expect(house.val).toBe("126");
    expect(house.houses_total).toBe(169);
    expect(house.coverage).toEqual({
      AGREE: 16,
      CONFLICT: 33,
      PARTIAL: 13,
      SINGLE_SOURCE: 34,
      UNKNOWN_SEMANTICS: 73,
    });
  });

  test("F-V125-01 dokaz: H-035 pages BREZ p7 (v125 hiša 35→55); H-049/H-055 nosita p7", () => {
    const h35 = house.houses.find((h: any) => h.house_id === "H-035");
    expect(h35.owners.ps.pages).not.toContain(7);
    expect(h35.owners.ps.pages).toEqual([9, 10, 16, 17, 18, 20, 23, 35, 36]);
    const h49 = house.houses.find((h: any) => h.house_id === "H-049");
    expect(h49.owners.ps.owner_original).toBe("Schimecz Mihual");
    expect(h49.owners.ps.pages).toContain(7);
    const h55 = house.houses.find((h: any) => h.house_id === "H-055");
    expect(h55.owners.ps.owner_original).toBe("Schimez Hanl");
    expect(h55.owners.ps.pages).toContain(7);
  });

  test("PROVISIONAL plasti h72/74/76 (val 122) zaščitene pred sync — layer ostaja, sync_note dodan", () => {
    for (const hid of ["H-072", "H-074", "H-076"]) {
      const h = house.houses.find((x: any) => x.house_id === hid);
      expect(h.owners.ps.layer).toBe("PROVISIONAL");
      expect(h.owners.ps.sync_note).toContain("val 126");
    }
  });

  test("metoda B kontinuiteta: pua_ps_name_sim_v126 = v119 razredi (16 AGREE / 2 PARTIAL / 33 MISMATCH)", () => {
    // distinct INT hiše (v126_by_house = 51 int ključev; '0' in '00' oba → int 0,
    // F-H122-01 podvojeni H-1-* vnosi so ločena zadeva — string sklici)
    const byNo = new Map<number, string>();
    for (const h of house.houses) {
      const hn = String(h.house_no_1825);
      if (h.pua_ps_name_sim_v126 && /^\d+$/.test(hn)) {
        byNo.set(parseInt(hn, 10), h.pua_ps_name_sim_v126.class);
      }
    }
    expect(byNo.size).toBe(51);
    const classes: Record<string, number> = {};
    for (const cls of byNo.values()) classes[cls] = (classes[cls] ?? 0) + 1;
    expect(classes).toEqual({ AGREE: 16, PARTIAL: 2, MISMATCH: 33 });
  });
});

describe("val 126 — conflict register + analysis-v8", () => {
  test("CH statusi nespremenjeni (4 RESOLVED + 12 PARTIALLY_RESOLVED + 35 OPEN); note_v119 ohranjena kot dokaz", () => {
    expect(conf.val).toBe("126");
    expect(conf.conflicts_total).toBe(113);
    const ch = conf.conflicts.filter((c: any) => c.conflict_type === "owner_state_pua_vs_ps");
    expect(ch.length).toBe(51);
    const st: Record<string, number> = {};
    for (const c of ch) st[c.status] = (st[c.status] ?? 0) + 1;
    expect(st).toEqual({ RESOLVED: 4, PARTIALLY_RESOLVED: 12, OPEN: 35 });
    expect(ch.filter((c: any) => c.note_v119).length).toBeGreaterThan(0);
  });

  test("analysis-v8: 51 hiš, razredi v126 = v119 (brez razrednih sprememb); F-SYNC-06 + nr14_adjudication", () => {
    expect(analysis.val).toBe("126");
    expect(analysis.A_pua_vs_ps_v126.houses).toBe(51);
    expect(analysis.A_pua_vs_ps_v126.class_v126).toEqual({ AGREE: 16, PARTIAL: 2, MISMATCH: 33 });
    expect(analysis.A_pua_vs_ps_v126.changed_vs_v119_houses).toEqual([]);
    expect(analysis.nr14_adjudication.in_register_variant_groups).toBe(0);
    const f6 = analysis.findings.find((f: any) => f.id === "F-SYNC-06");
    expect(f6.statement).toContain("F-V125-01");
    expect(analysis.method.nr14).toContain("flag-only");
  });
});

describe("val 126 — KG kaskada (vsebinsko SPREMENJEN — prvič od val 122)", () => {
  test("3765 vozlišč / 3473 vezi / 614 trditev, PERSON 982, OWNER_OF 246, invariante čiste", () => {
    expect(kg.nodes.length).toBe(3765);
    expect(kg.edges.length).toBe(3473);
    expect(kg.claims.length).toBe(614);
    expect(kg.node_stats.PERSON).toBe(982);
    expect(kg.edge_stats.OWNER_OF).toBe(246);
    expect(kg.edge_stats.HAS_PARCEL).toBe(2775);
    expect(kg.invariant_violations).toEqual([]);
    // vsa PERSON vozlišča NOT_MERGED (NR-14 flag-only ne mergea)
    const merged = kg.nodes.filter(
      (n: any) => n.node_type === "PERSON" && n.merge_decision && n.merge_decision !== "NOT_MERGED",
    );
    expect(merged.length).toBe(0);
  });

  test("kaskada: story 3765/3473/4; timeline 8 točk z KG sha 1e49de43; coverage PASS 8", () => {
    expect(story.stats.entities).toBe(3765);
    expect(story.stats.relations).toBe(3473);
    expect(story.stats.story_atoms).toBe(4);
    expect(timeline.points.length).toBe(8);
    expect(String(timeline.provenance?.kg_sha256 ?? timeline.kg_sha256 ?? "")).toMatch(/^1e49de43/);
    expect(coverage.pass).toBe("PASS 8");
  });

  test("runtime kopije = atlas izhod (ena izhodna resnica)", () => {
    for (const rel of ["knowledge-graph-1825.json", "story-graph-1825.json"]) {
      expect(sha256(`src/data/${rel}`)).toBe(sha256(`${ATLAS}/${rel}`));
    }
  });
});
