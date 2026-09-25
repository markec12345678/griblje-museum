/**
 * Val 59 — ATLAS 1825 PASS 2 (issue #42 §2/§3/§5/§14)
 * Varovalke: house register + BP reconciliacija + conflict register + person register.
 * Pravila: house_no ≠ BP ≠ parcela; nič ugibanja; imena ne-združena; vse s provenanco.
 */
import { describe, it, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

const RG = join(import.meta.dir, "..", "research-griblje", "atlas-1825");

const house = JSON.parse(readFileSync(join(RG, "house-register-1825.json"), "utf8")) as {
  val: string; pass: number; houses_total: number;
  coverage: Record<string, number>;
  houses: {
    house_id: string; house_no_1825: string; house_no_type: string; evidence_status: string;
    pua_ps_name_sim: number | null; conflict_ids: string[];
    owners: Record<string, unknown>; bp_refs: { bp: number }[]; notes: string | null;
  }[];
};
const bp = JSON.parse(readFileSync(join(RG, "bp-house-reconciliation-1825.json"), "utf8")) as {
  bp_total: number; coverage: Record<string, number>;
  bp_rows: { bp: number; atlas_status: string; val57_status: string; conflict_ids: string[] }[];
};
const conf = JSON.parse(readFileSync(join(RG, "conflict-register-1825.json"), "utf8")) as {
  conflicts_total: number; coverage: Record<string, number>;
  conflicts: { conflict_id: string; conflict_type: string; status: string; note?: string;
               claim_a: unknown; source_a: string; what_would_resolve: string }[];
};
const persons = JSON.parse(readFileSync(join(RG, "person-owner-register-1825.json"), "utf8")) as {
  persons_total: number; possible_duplicates: number;
  persons: { name_original: string; normalized: string; person_type: string;
             possible_duplicate?: boolean; merge_decision?: string; reason?: string }[];
};

describe("val 59 — ATLAS 1825 PASS 2", () => {
  it("val/pass označena (#42)", () => {
    expect(house.val).toBe("59");
    expect(house.pass).toBe(2);
  });

  describe("§2 house register", () => {
    it("94 gruble hiš + sestavljeni sklici, vsi z house_id", () => {
      expect(house.houses_total).toBe(167);
      expect(house.houses.every((h) => h.house_id && h.house_no_1825)).toBe(true);
      const types = new Set(house.houses.map((h) => h.house_no_type));
      expect(types.has("gruble_house")).toBe(true);
      expect(types.has("external_ref")).toBe(true);
    });

    it("evidence statusi pokrivajo vse hiše (ni praznega statusa)", () => {
      const allowed = ["AGREE", "PARTIAL", "CONFLICT", "SINGLE_SOURCE", "UNKNOWN", "UNKNOWN_SEMANTICS"];
      expect(house.houses.every((h) => allowed.includes(h.evidence_status))).toBe(true);
      expect(house.coverage["CONFLICT"]).toBe(49);
      expect(house.coverage["SINGLE_SOURCE"]).toBe(32);
      expect(house.coverage["PARTIAL"]).toBe(13);
    });

    it("AGREE = 0 (dosledno z val 58 F9: PUA in PS sta različni stanji)", () => {
      expect(house.coverage["AGREE"] ?? 0).toBe(0);
    });

    it("h.40 = CONFLICT (PUA Pfarrer Sautter vs PS Peter Muster) z CH konfliktom", () => {
      const h40 = house.houses.find((h) => h.house_no_1825 === "40");
      expect(h40).toBeDefined();
      expect(h40!.evidence_status).toBe("CONFLICT");
      expect(h40!.pua_ps_name_sim).toBeLessThan(0.5);
      expect(h40!.conflict_ids.length).toBeGreaterThan(0);
      expect(h40!.conflict_ids[0]).toMatch(/^CH-/);
    });

    it("h.45 = PARTIAL (PS Strauß Georg + PT Krauß variant; PUA brez vpisa)", () => {
      const h45 = house.houses.find((h) => h.house_no_1825 === "45");
      expect(h45).toBeDefined();
      expect(h45!.evidence_status).toBe("PARTIAL");
      expect(h45!.owners.pua).toBeNull();
      expect(h45!.bp_refs.map((r) => r.bp)).toContain(81);
    });

    it("h.70 Zollamt = SINGLE_SOURCE z opombo o PS vrzeli 70-78", () => {
      const h70 = house.houses.find((h) => h.house_no_1825 === "70");
      expect(h70).toBeDefined();
      expect(h70!.evidence_status).toBe("SINGLE_SOURCE");
      expect(h70!.notes).toContain("70");
    });

    it("hiše 71-72 (PUA Zollamt okolica) imajo opombo o čakanju p56-143; 73-78 NE obstajajo v virih", () => {
      for (const hn of ["71", "72"]) {
        const h = house.houses.find((x) => x.house_no_1825 === hn);
        expect(h).toBeDefined();
        expect(h!.notes).toContain("p56–p143");
      }
      // 73-78: noben vir (PUA brez vpisa, PS vrzel 70-78, PT brez veze) → NI v registru
      for (const hn of ["73", "74", "75", "76", "77", "78"]) {
        expect(house.houses.find((x) => x.house_no_1825 === hn)).toBeUndefined();
      }
    });
  });

  describe("§3 BP↔house reconciliacija", () => {
    it("100 BP vrstic s popolno pokritostjo statusov", () => {
      expect(bp.bp_total).toBe(100);
      expect(bp.bp_rows.length).toBe(100);
      expect(bp.coverage).toEqual({ UNCERTAIN: 39, CONFLICT: 54, NOT_FOUND: 5, FOUND: 2 });
    });

    it("status mapa ohranja val 57 sodbe (nič prepisano)", () => {
      const bp94 = bp.bp_rows.find((r) => r.bp === 94);
      expect(bp94!.atlas_status).toBe("FOUND");
      expect(bp94!.val57_status).toBe("CONFIRMED");
      const bp98 = bp.bp_rows.find((r) => r.bp === 98);
      expect(bp98!.atlas_status).toBe("CONFLICT");
      expect(bp98!.val57_status).toBe("CONFLICT");
    });

    it("vsak CONFLICT BP ima CB konflikt ID", () => {
      for (const r of bp.bp_rows.filter((x) => x.atlas_status === "CONFLICT")) {
        expect(r.conflict_ids.some((c) => c.startsWith("CB-"))).toBe(true);
      }
    });
  });

  describe("§14 conflict register", () => {
    it("113 konfliktov: 54 CB + 51 CH + 8 CF", () => {
      expect(conf.conflicts_total).toBe(113);
      expect(conf.coverage["bp_house_binding"]).toBe(54);
      expect(conf.coverage["owner_state_pua_vs_ps"]).toBe(51);
      expect(conf.coverage["named_finding"]).toBe(8);
    });

    it("vsak konflikt ima what_would_resolve (nič brez poti rešitve)", () => {
      expect(conf.conflicts.every((c) => c.what_would_resolve && c.what_would_resolve.length > 5)).toBe(true);
    });

    it("CH-040 opisuje različna stanja (F9), ne bralne napake", () => {
      const ch = conf.conflicts.find((c) => c.conflict_id === "CH-040-01");
      expect(ch).toBeDefined();
      expect(ch!.note ?? "").toContain("različni lastniški stanji");
    });

    it("CF-F8 = RESOLVED (bp 94 najmočnejša vez), CF-F3 = PARTIALLY_RESOLVED (val 56)", () => {
      expect(conf.conflicts.find((c) => c.conflict_id === "CF-F8")!.status).toBe("RESOLVED");
      expect(conf.conflicts.find((c) => c.conflict_id === "CF-F3")!.status).toBe("PARTIALLY_RESOLVED");
    });
  });

  describe("§5 person/owner register", () => {
    it("488 oseb, 161 possible_duplicate, vsi NOT_MERGED", () => {
      expect(persons.persons_total).toBe(488);
      expect(persons.possible_duplicates).toBe(161);
      const flagged = persons.persons.filter((p) => p.possible_duplicate);
      expect(flagged.every((p) => p.merge_decision === "NOT_MERGED" && p.reason)).toBe(true);
    });

    it("tipi oseb iz vseh treh virov", () => {
      const types = new Set(persons.persons.map((p) => p.person_type));
      expect(types.has("owner(pua)")).toBe(true);
      expect(types.has("owner(ps)")).toBe(true);
      expect(types.has("owner_variant(pt)")).toBe(true);
    });

    it("normalizacija je samo pomožna (brez ne-črk, lowercase)", () => {
      expect(persons.persons.every((p) => /^[a-z]*$/.test(p.normalized))).toBe(true);
    });
  });
});
