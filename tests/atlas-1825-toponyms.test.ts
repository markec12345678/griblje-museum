/**
 * Val 62 — ATLAS 1825 §12: toponym register v1 (output #7)
 * Guard-rails: counts, provenance discipline, no-modern-mapping rule,
 * possible_matches NOT_MERGED, negative results NR-12/NR-13 idempotent.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE = resolve(import.meta.dir, "..", "research-griblje", "atlas-1825");
const reg = JSON.parse(readFileSync(resolve(BASE, "toponym-register-1825.json"), "utf8"));
const negPath = resolve(BASE, "negative-result-register-1825.json");
const neg = JSON.parse(readFileSync(negPath, "utf8"));

describe("toponym-register-1825 v1 [val 62]", () => {
  test("register structure and total guard", () => {
    expect(reg.register === undefined).toBe(true);
    expect(reg.title).toBe("toponym-register-1825 v1");
    expect(Array.isArray(reg.toponyms)).toBe(true);
    expect(reg.toponyms.length).toBe(37);
    expect(reg.coverage.total).toBe(37);
  });

  test("coverage breakdown stable", () => {
    expect(reg.coverage.by_type).toEqual({
      self_gemeinde: 1,
      administrative: 2,
      neighbor_gemeinde: 10,
      watercourse: 7,
      hill: 4,
      mill_point: 4,
      external_settlement: 8,
      map_label_uncertain: 1,
    });
    expect(reg.coverage.possible_matches_open).toBe(5);
    expect(reg.coverage.excluded_non_toponyms).toBe(7);
  });

  test("TP-001 self Gemeinde: merged by DOCUMENT IDENTITY, 6 forms, 48 occurrences", () => {
    const self = reg.toponyms[0];
    expect(self.toponym_id).toBe("TP-001");
    expect(self.type).toBe("self_gemeinde");
    expect(self.merge_decision).toContain("MERGED");
    expect(self.merge_decision).toContain("document identity");
    const forms = self.original_forms.map((f: { form: string }) => f.form);
    expect(forms).toContain("GRÜBLE");
    expect(forms).toContain("Grübln");
    expect(forms).toContain("Gruble");
    expect(forms).toContain("Grable");
    const total = self.original_forms.reduce(
      (a: number, f: { occurrences: unknown[] }) => a + f.occurrences.length,
      0
    );
    expect(total).toBe(48);
    // printed title occurrences intact
    const printed = self.original_forms.find((f: { form: string }) => f.form === "GRÜBLE");
    expect(printed.occurrences.length).toBe(7);
  });

  test("Grublh. compound occurrence preserved (PUA p23 h.2)", () => {
    const self = reg.toponyms[0];
    const grublh = self.original_forms.find(
      (f: { form: string; occurrences: { as_written: string }[] }) => f.form === "Grublh."
    );
    const writes = grublh.occurrences.map((o: { as_written: string }) => o.as_written);
    expect(writes).toContain("zu Grublh.");
    expect(writes).toContain("zu Grublh. in Höchsthal.");
  });

  test("NO modern mapping invented anywhere (rule: UNKNOWN until documented)", () => {
    for (const t of reg.toponyms) {
      expect(t.modern_mapping).toBe("UNKNOWN");
      expect(t.historical_only).toBe(true);
      expect(typeof t.toponym_id).toBe("string");
      expect(typeof t.what_would_resolve).toBe("string");
      expect(t.what_would_resolve.length).toBeGreaterThan(0);
    }
  });

  test("narrative entries are PROVISIONAL with provenance pointers", () => {
    const narrative = reg.toponyms.filter((t: { provenance_level: string }) =>
      t.provenance_level === "vlm_single_pass"
    );
    expect(narrative.length).toBe(25);
    for (const t of narrative) {
      expect(t.review_status).toBe("PROVISIONAL");
      expect(t.confidence === "low" || t.confidence === "medium").toBe(true);
      for (const f of t.original_forms) {
        expect(f.source === "PR" || f.source === "PG").toBe(true);
        expect(typeof f.context).toBe("string");
      }
    }
  });

  test("key neighbors present from PR + PG", () => {
    const names = reg.toponyms.map((t: { original_forms: { form: string }[] }) =>
      t.original_forms[0].form
    );
    for (const n of ["Weichselberg", "Hochsteg", "Schönbach", "Stadelbach", "Dolga vas", "Črnomelj", "Thiasing", "Dullach", "Waischenberg", "Drulach"]) {
      expect(names).toContain(n);
    }
    for (const n of ["Lahinja", "Dolina", "Radešica", "Bistrica", "Sušica", "Mlinščica", "Dampfbach"]) {
      expect(names).toContain(n);
    }
  });

  test("external settlements: exact pages from field registers", () => {
    const ext = Object.fromEntries(
      reg.toponyms
        .filter((t: { type: string }) => t.type === "external_settlement")
        .map((t: { original_forms: { form: string; occurrences: { page: number }[] }[] }) => [
          t.original_forms[0].form,
          t.original_forms[0].occurrences.map((o: { page: number }) => o.page).sort((a: number, b: number) => a - b),
        ])
    );
    expect(ext["Zagorje"]).toEqual([48, 48]);
    expect(ext["Gradiše"]).toEqual([14]);
    expect(ext["Dragole"]).toEqual([49]);
    expect(ext["Zogwitsche"]).toEqual([14, 14]);
    expect(ext["Schönboden"]).toEqual([15]);
    expect(ext["Waidhofen"]).toEqual([36]);
    expect(ext["Gräving"]).toEqual([34]);
    expect(ext["Höchsthal"]).toEqual([23]);
  });

  test("possible matches: 5 open, all NOT_MERGED, all with resolution path", () => {
    expect(reg.possible_matches_uncertain.length).toBe(5);
    for (const pm of reg.possible_matches_uncertain) {
      expect(pm.decision).toBe("NOT_MERGED");
      expect(pm.reason.length).toBeGreaterThan(0);
      expect(pm.what_would_resolve.length).toBeGreaterThan(0);
    }
    const ids = reg.possible_matches_uncertain.map((p: { pm_id: string }) => p.pm_id);
    expect(ids).toEqual(["PM-01", "PM-02", "PM-03", "PM-04", "PM-05"]);
    // PM-03 = Zagorje ↔ Zogwitsche cross-family flag
    const pm3 = reg.possible_matches_uncertain.find((p: { pm_id: string }) => p.pm_id === "PM-03");
    expect(pm3.a).toContain("Zagorje");
    expect(pm3.b).toContain("Zogwitsche");
  });

  test("A05 Traverne: multi-pass, first word UNRESOLVED, 3 variant readings kept", () => {
    const t = reg.toponyms.find((x: { type: string }) => x.type === "map_label_uncertain");
    expect(t.review_status).toContain("PROVISIONAL_MULTI");
    expect(t.review_status).toContain("UNRESOLVED");
    expect(t.original_forms.map((f: { form: string }) => f.form)).toEqual([
      "Schumsthl", "Schamsho", "Schimstl", "Traverne",
    ]);
    expect(t.location).toContain("A05");
  });

  test("excluded non-toponyms recorded for QA (Häusler, 2700, hiesig...)", () => {
    const vals = reg.excluded_non_toponyms.map((e: { value: string }) => e.value);
    expect(vals).toContain("hiesig / hiesiger");
    expect(vals).toContain("Häusler");
    expect(vals).toContain("2700");
    expect(vals).toContain("Weinberge");
  });

  test("NR-12 (no named Flurbezirke) + NR-13 (PT wohnort self-only) in central register, idempotent", () => {
    const ids = neg.negatives.map((n: { neg_id: string }) => n.neg_id);
    expect(ids).toContain("NR-12");
    expect(ids).toContain("NR-13");
    expect(ids.filter((i: string) => i === "NR-12").length).toBe(1);
    expect(ids.filter((i: string) => i === "NR-13").length).toBe(1);
    expect(neg.negatives_total).toBe(13);
    const nr12 = neg.negatives.find((n: { neg_id: string }) => n.neg_id === "NR-12");
    expect(nr12.result).toContain("NOT FOUND");
    expect(nr12.next_source).toContain("p56");
  });
});
