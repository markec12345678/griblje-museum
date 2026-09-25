/**
 * Val 60 — ATLAS 1825 PASS 3 v1 (issue #42 §4 + §13)
 * Varovalke: parcelni register (PUA + PS ločeno), land-use mapiranje, negative-result register.
 */
import { describe, it, expect } from "bun:test";
import { readFileSync } from "fs";
import { join } from "path";

const A = join(import.meta.dir, "..", "research-griblje", "atlas-1825");

const pr = JSON.parse(readFileSync(join(A, "parcel-register-1825.json"), "utf8")) as {
  val: string; pass: number;
  pua_parcels_total: number; pua_co_referenced: number;
  ps_parcels_total: number;
  ps_land_use_coverage: Record<string, number>;
  ps_land_use_mapping_confidence: Record<string, number>;
  pua_parcels: {
    parcel_id: string; section_original: string | null; parcel_number: number | null;
    parcel_number_original: string; section_ambiguous: boolean; house_refs: string[];
    co_referenced: boolean; land_use_category: string | null; page: number;
  }[];
  ps_parcels: {
    parcel_id: string; parcel_number: number; land_use_category: string | null;
    land_use_original: string | null; land_use_mapping: string; house_ref: string | null;
    cross_ref_to_pua: string; evidence_status: string; flag: string | null; page: number;
  }[];
};
const nr = JSON.parse(readFileSync(join(A, "negative-result-register-1825.json"), "utf8")) as {
  negatives_total: number;
  negatives: { neg_id: string; searched: string; source: string; result: string; next_source: string }[];
};

describe("val 60 — ATLAS 1825 PASS 3 v1", () => {
  it("val/pass označena", () => {
    expect(pr.val).toBe("60");
    expect(pr.pass).toBe(3);
  });

  describe("§4 PUA parcele", () => {
    it("2.035 distinct referenc; 417 so-referenciranih", () => {
      expect(pr.pua_parcels_total).toBe(2035);
      expect(pr.pua_co_referenced).toBe(417);
    });

    it("so-referencirana parcela ima več house_refs (so-vlasništvo, ne konflikt)", () => {
      const shared = pr.pua_parcels.filter((p) => p.co_referenced);
      expect(shared.length).toBe(417);
      expect(shared.every((p) => p.house_refs.length > 1)).toBe(true);
      // znani primer: I/22 v 6 hišah
      const i22 = pr.pua_parcels.find((p) => p.section_original === "I" && p.parcel_number === 22);
      expect(i22).toBeDefined();
      expect(i22!.house_refs).toEqual(["22", "24", "34", "47", "64", "66"]);
    });

    it("nejasne sekcije označene (III/IV, II.N, H.IV …)", () => {
      const amb = pr.pua_parcels.filter((p) => p.section_ambiguous);
      expect(amb.length).toBeGreaterThan(50);
      expect(amb.every((p) => p.section_original !== null)).toBe(true);
    });

    it("PUA parcele brez rabe (vir je ne vsebuje) — UNKNOWN nikoli ugibanje", () => {
      expect(pr.pua_parcels.every((p) => p.land_use_category === null)).toBe(true);
    });
  });

  describe("§4 PS parcele (partial)", () => {
    it("432 kandidatov; land use pokritost brez ugibanja", () => {
      expect(pr.ps_parcels_total).toBe(432);
      expect(pr.ps_land_use_coverage["njiva"]).toBe(230);
      expect(pr.ps_land_use_coverage["UNKNOWN"]).toBe(106);
      expect(pr.ps_land_use_mapping_confidence["EXACT"]).toBe(322);
      expect(pr.ps_land_use_mapping_confidence["TERM-UNCLEAR"]).toBe(106);
    });

    it("vsak UNKNOWN ohranja originalni termin", () => {
      for (const p of pr.ps_parcels.filter((x) => x.land_use_category === "UNKNOWN")) {
        expect(p.land_use_original).toBeTruthy();
        expect(p.land_use_mapping).toBe("TERM-UNCLEAR");
      }
    });

    it("jaethe >3000 flagirana (zmes stolpcev, val 58), ne izključena", () => {
      const big = pr.ps_parcels.filter((p) => p.parcel_number > 3000);
      expect(big.length).toBeGreaterThan(0);
      expect(big.every((p) => p.flag !== null && p.evidence_status.includes("flag"))).toBe(true);
    });

    it("PUA in PS ostajata ločena (cross_ref UNKNOWN, F14)", () => {
      expect(pr.ps_parcels.every((p) => p.cross_ref_to_pua.includes("UNKNOWN"))).toBe(true);
    });
  });

  describe("§13 negative-result register", () => {
    it("13 dokumentiranih negativnih rezultatov (11 val 60 + NR-12/NR-13 val 62), vsi z next_source", () => {
      expect(nr.negatives_total).toBe(13);
      expect(nr.negatives.every((n) => n.next_source && n.searched && n.result)).toBe(true);
    });

    it("ključne negativne sodbe prisotne", () => {
      const ids = nr.negatives.map((n) => n.neg_id);
      expect(ids).toContain("NR-01"); // B.P./Zoll v PS Anmerkung = 0
      expect(ids).toContain("NR-05"); // hiše 73-78 ne obstajajo v virih
      expect(ids).toContain("NR-11"); // 0 AGREE (F9 strukturno)
      expect(ids).toContain("NR-12"); // brez imenskih Flurbezirkov (val 62)
      expect(ids).toContain("NR-13"); // PT wohnort samo self-forme (val 62)
    });
  });
});
