/**
 * Val 120 — 2. oči kontrola vzorca PS imenskega passa (NR-14).
 * Varovalke: slepe branja 42 segmentov / 283 vrstic / 14 strani,
 * F-OCI-01..06, strukturna potrjitvena številka (parzelle 213/259),
 * remap bralskih zdrsov 24 vrstic, register NESPREMENJEN (§22).
 */
import { describe, it, expect } from "bun:test";
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

const analysis = readJSON("research-griblje/val120-oci2/analysis-v1.json");
const comparison = readJSON("research-griblje/val120-oci2/comparison.json");
const register = readJSON("research-griblje/ps-n83/register.json");

describe("val 120 — 2. oči kontrola vzorca (NR-14)", () => {
  it("vzorec: 283 vrstic, 14 strani (prva+zadnja vsakega batcha)", () => {
    expect(analysis.title).toContain("14 strani / 283 vrstic");
    expect(comparison.rows_total).toBe(283);
    expect(comparison.sample_pages).toEqual([17, 19, 20, 25, 26, 31, 32, 37, 38, 43, 44, 49, 50, 55]);
    expect(comparison.entries.length).toBe(283);
  });

  it("F-OCI-01..06 prisotne z izrecnimi statusi", () => {
    const ids = analysis.findings.map((f: { id: string }) => f.id);
    expect(ids).toEqual(["F-OCI-01", "F-OCI-02", "F-OCI-03", "F-OCI-04", "F-OCI-05", "F-OCI-06"]);
    expect(analysis.findings[0].status).toBe("DOCUMENTED"); // sub-agenti pixel-slepi
    expect(analysis.findings[1].status).toBe("CONFIRMED");  // struktura
    expect(analysis.findings[3].statement).toContain("24");
    expect(analysis.findings[4].status).toBe("OPEN");       // vrednostna atribucija
    expect(analysis.findings[4].statement).toContain("NR-14");
    expect(analysis.findings[5].status).toBe("CONFIRMED");  // marginalije
  });

  it("F-OCI-02: strukturna plast 100 % — parzelle 213/259 eksaktno, p49 specialke", () => {
    expect(analysis.stats_remapped.parz.EXACT).toBe(213);
    expect(analysis.findings[1].statement).toContain("923");
    expect(analysis.findings[1].statement).toContain("929½");
    expect(analysis.findings[1].statement).toContain("Ploner Franzigen");
  });

  it("F-OCI-03: transkripcijske variante — pari Kurrent loparjev dokumentirani", () => {
    const st = analysis.findings[2].statement;
    for (const pair of ["Christan<->Vereichan", "Bruckler<->Stubler", "Stallpschibek<->Schapschitik", "Pessing<->Pavingz"]) {
      expect(st).toContain(pair);
    }
    expect(analysis.name_variant_pairs_sample.length).toBeGreaterThan(5);
  });

  it("F-OCI-04: 24 bralskih zdrsov remapiranih; register ostane 1:1 s tiskanimi parzellami", () => {
    expect(analysis.boundary_rows_repaired).toBe(24);
    // p55: register r7 (Heide Marko 857) — blind r8 je bil +1; register NI spremenjen
    const p55 = register.filter((r: any) => r.page === 55);
    expect(p55[7].owner_original).toBe("Heide Marko");
    expect(p55[7].klafter).toBe("857");
    const p37 = register.filter((r: any) => r.page === 37);
    expect(p37[8].klafter).toBe("31"); // blind r7 je bral 31 — register r8
  });

  it("F-OCI-05: vrednostna atribucija ostaja OPEN (NR-14) — kandidata p31 r0 + p43 r19", () => {
    const st = analysis.findings[4].statement;
    expect(st).toContain("1785");
    expect(st).toContain("4731");
    expect(st).toContain("nič ne spreminjano");
    // register vrednosti NESPREMENJENE (raziskovalni val §22)
    const p31 = register.filter((r: any) => r.page === 31);
    expect(p31[0].klafter).toBe("1785");
    const p43 = register.filter((r: any) => r.page === 43);
    expect(p43[19].klafter).toBe("4731");
  });

  it("F-OCI-06: marginalije re-opazane (1-385, 1263, 3-364, 1-1367)", () => {
    const st = analysis.findings[5].statement;
    for (const m of ["1-385", "1263", "3-364", "1-1367", "1-853"]) {
      expect(st).toContain(m);
    }
  });

  it("slepota: 42 blind segmentov; brez register vrednosti v slepih JSONih", () => {
    const fs = require("fs");
    const dir = join(RG, "val120-oci2/blind");
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
    expect(files.length).toBe(42);
    // blind JSONi ne smejo vsebovati register-only plasti (reading_pass, anmerkung)
    for (const f of files) {
      const raw = readFileSync(join(dir, f), "utf8");
      expect(raw).not.toContain("reading_pass");
      expect(raw).not.toContain("owner_original");
      expect(raw).not.toContain("anmerkung");
    }
  });

  it("§22: register.json + KG + c4 metrika NESPREMENJENI (raziskovalni val)", () => {
    // register sha nespremenjen od val 119 del 3 (54a6e52)
    expect(sha256("research-griblje/ps-n83/register.json")).toBe(
      "fb439f80ce1591abea330d6d74e30a6dc814bc81bb5799aa38f0c9ee6786c699");
    // strukturne varovalke registra (2875 vrstic; plasti nespremenjene)
    expect(register.length).toBe(2875);
    const passes = new Set(register.map((r: any) => r.reading_pass));
    expect(passes.has("v119-names")).toBe(true);
    // val 115 vstavljene vrstice nosijo zgodovino v anmerkung (plast absorbirana v v119)
    const p49r2anm = register.filter((r: any) => r.page === 49)[2].anmerkung || "";
    expect(p49r2anm).toContain("v115");
    expect(register.filter((r: any) => r.reading_pass === "v119-names").length).toBe(731);
    expect(register.filter((r: any) => r.reading_pass === "v118-names").length).toBe(60);
    // p49 specialke nespremenjene (protokol 140)
    const p49 = register.filter((r: any) => r.page === 49);
    expect(p49.length).toBe(22);
    expect(p49[2].owner_original).toBe("Heide Marko.");
    expect(p49[9].owner_original).toBe("");
    expect(p49[21].owner_original).toBe("");
  });

  it("verdict: imenska plast + struktura STOJITA", () => {
    expect(analysis.verdict).toContain("STOJITA");
    expect(analysis.verdict).toContain("nič ne spreminjano");
  });
});
