/**
 * val 123 — p3–p16 vrednostni sweep (jae+kl), pasovna metoda val 121.
 *
 * Kontekst: prva točka protokola 145 §6 — p3–p16 (razen p5, val 121) brez
 * flagov, v82-era vrednosti. Branja: pasovni trakovi x6 + celicni zoomi
 * x10–15 (bottom-rule anchoring + snap_grid iz make-valbands-v121.py),
 * 0 VLM klicev.
 *
 * Rezultat: 27 FIX (vse eno-dvoumne Kurrent zamenjave, GUARD preverjen),
 * 7 DISPUTE (odprta razhajanja, brez popravkov), p7 STRUKTURNI DISPUT
 * F-V123-01 (dodatno olje 54 + sredinski zdrs — zahteva dvojni anchor,
 * lasten val), 13 strani opazb (kapitalni nizi + Fürtrag + podstolpec).
 *
 * Varovalke (§22 pogodba): add-only anmerkung, pre_v123 polja, K9 p1–55
 * nespremenjen (56/960/84 — samo vrednost→vrednost popravki), KG vsebinsko
 * identična (3765/3473, timestamp-only sha prehod 8345868a→1e49de43).
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
const REG = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8"),
) as Array<Record<string, unknown>>;
const READ = JSON.parse(
  readFileSync(
    join(ROOT, "research-griblje/val123-sweep/readings-v123.json"),
    "utf8",
  ),
) as {
  fixes: Array<{ page: number; r: number; old: string; new: string; verdict: string }>;
  disputes: Array<{ page: number; r: number; reg: string; seen: string; verdict: string }>;
  p7_structural: { page: number; finding: string; disputed_rows: Array<{ r: number; reg: string; seen: string }> };
  observations: Record<string, string[]>;
};

const ATLAS = join(ROOT, "research-griblje/atlas-1825");
const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

const firsts: Record<number, number> = {};
REG.forEach((r, i) => {
  const pg = Number(r.page);
  if (!(pg in firsts)) firsts[pg] = i;
});

describe("val 123 — p3–p16 vrednostni sweep (vgradnja)", () => {
  test("register nespremenjen po številu vrstic (2875) in straneh 141 (p3–p143)", () => {
    expect(REG.length).toBe(2875); // val 127: p59 fantom −1
    expect(new Set(REG.map((r) => Number(r.page))).size).toBe(141);
  });

  test("27 FIX vgrajenih: GUARD deklarirano staro = register klafter_pre_v123", () => {
    expect(READ.fixes.length).toBe(27);
    for (const f of READ.fixes) {
      const row = REG[firsts[f.page] + f.r];
      expect(Number(row.page)).toBe(f.page);
      expect(String(row.klafter)).toBe(f.new);
      expect(String(row.klafter_pre_v123)).toBe(f.old);
      expect(f.verdict).toContain(`FIX ${f.old}->${f.new}`);
      expect(String(row.anmerkung)).toContain(`[v123: ∅|${f.old} -> ∅|${f.new}`);
    }
  });

  test("vsak FIX ima razlago sodbe (oglati oklepaji s primerjavo oblik / virom)", () => {
    for (const f of READ.fixes) {
      expect(f.verdict.length).toBeGreaterThan(30);
      expect(f.verdict).toContain("[");
      expect(f.verdict).toContain("]");
    }
  });

  test("FIX pokriva 8 strani: p3(2) p4(4) p6(6) p8(4) p9(2) p12(5) p13(3) p15(1)", () => {
    const byPage: Record<number, number> = {};
    for (const f of READ.fixes) byPage[f.page] = (byPage[f.page] ?? 0) + 1;
    expect(byPage).toEqual({ 3: 2, 4: 4, 6: 6, 8: 4, 9: 2, 12: 5, 13: 3, 15: 1 });
  });

  test("7 DISPUTE vrstic: val 124 RAZREŠENE — 4 FIX (p11 r3, p12 r17, p13 r17, p14 r0) + 3 POTRJENE brez popravka (p10 r18, p11 r20, p11 r21)", () => {
    expect(READ.disputes.length).toBe(7);
    // val 124 sodbe (readings-v124.json disputes_resolved): nove vrednosti za popravljene, izvirne za potrjene
    const FIXED_V124: Record<string, string> = { "11-3": "99", "12-17": "53", "13-17": "182", "14-0": "187" };
    for (const d of READ.disputes) {
      const row = REG[firsts[d.page] + d.r];
      const key = `${d.page}-${d.r}`;
      const expected = FIXED_V124[key] ?? d.reg; // FIX v v124 ali POTRJENA (vrednost ostane)
      expect(String(row.klafter), `p${d.page} r${d.r}`).toBe(expected);
      expect(String(row.anmerkung)).toContain("odprto"); // v123 zapisek ostaja (zgodovinski vir)
      expect(String(row.anmerkung)).toContain("v124"); // + v124 sodba razrešitve/FIX
    }
  });

  test("F-V123-01: p7 strukturni disput — val 124 REŠEN (dvojni anchor ime+vrednost): 7 popravkov + 2 novi vrstici", () => {
    const p7 = REG.slice(firsts[7], firsts[7] + 23);
    // v57 bralec je PRESKOKIL udarjeno 54 (r4, Nro 85) — vrednosti od r4 naprej eno vrstico nizko;
    // val 124: vrednosti ponovno sidrane (obrnjeno zaporedje 54, 241, 49, 31, 169, 138, 56)
    expect(p7[4].klafter).toBe("54"); // udarjena 54 (Nro 85) — v123 "dodatno olje"
    expect(p7[5].klafter).toBe("241"); // prej 19 (v82 4→1 varianta)
    expect(p7[6].klafter).toBe("49");
    expect(p7[7].klafter).toBe("31");
    expect(p7[8].klafter).toBe("169"); // prej 103
    expect(p7[9].klafter).toBe("138"); // prej 36 (v82 5→3 varianta)
    expect(p7[10].klafter).toBe("56"); // prej 54 — 54 je vstavljene vrstice (r11)
    // VSTAVLJENA vrstica Nro 92 (stisnjena med 91 in 93; leva stran brez pravila, desna 585–603)
    expect(p7[11].klafter).toBe("54");
    expect(String(p7[11].anmerkung)).toContain("v124 NOVA VRSTICA");
    expect(String(p7[11].reading_pass)).toBe("v125-names-houses"); // val 125 F-V124-01: ime "(K)hanzl Valen" -> "Schimez P…a"
    // EXTRA vrstica (ditto-Strauß brez Nro) izven sekvence; fantom premaknjen na r21
    expect(p7[20].klafter).toBe("110");
    expect(String(p7[20].reading_pass)).toBe("v124-dvojni-anchor");
    expect(p7[21].klafter ?? "").toBe(""); // fantom
    const po = String(REG[firsts[7]].page_observations);
    expect(po).toContain("F-V123-01");
    expect(po).toContain("54 DODATNO");
    expect(po).toContain("v124 F-V123-01 REŠEN"); // razrešitveni zapisek val 124
    // stranski disputi v anmerkung (v123 zapiski ostajajo). val 124: disputa sledi VREDNOSTI, ne vrstici —
    // zapiski za stare r13/r15/r16 (224/945/297) so ob ponovnem sidranju premaknjeni na pravilne vrstice
    // r14/r16/r17 (prave fizikalne linije Nro 95/97/98); r5/r8/r9 ostanejo na mestu
    const disputeRowV124 = (r: number): number => (r >= 13 ? r + 1 : r);
    for (const dr of READ.p7_structural.disputed_rows) {
      expect(String(REG[firsts[7] + disputeRowV124(dr.r)].anmerkung)).toContain("F-V123-01");
    }
  });

  test("opazbe: 12 strani kapitalnih nizov / Fürtrag / podstolpec v page_obs (add-only; +p7 F-V123-01 = 13 PAGE_OBS)", () => {
    const pages = Object.keys(READ.observations);
    expect(pages.length).toBe(12);
    expect(String(REG[firsts[4]].page_observations)).toContain("845");
    expect(String(REG[firsts[4]].page_observations)).toContain("234");
    expect(String(REG[firsts[10]].page_observations)).toContain("3|49½");
    expect(String(REG[firsts[15]].page_observations)).toContain('podstolpec "1"');
    expect(String(REG[firsts[16]].page_observations)).toContain('podstolpec "1"');
    expect(String(REG[firsts[6]].page_observations)).toContain("1-104");
  });

  test("K9 p1–55 konfunda nespremenjen (56/960/84 — samo vrednost→vrednost popravki)", () => {
    const rows = REG.filter((r) => Number(r.page) >= 1 && Number(r.page) <= 55);
    let both = 0, jaeEmpty = 0, klEmpty = 0;
    for (const r of rows) {
      const j = String(r.jaethe ?? "").trim();
      const k = String(r.klafter ?? "").trim();
      if (j && k) both += 1;
      if (!j) jaeEmpty += 1;
      if (!k) klEmpty += 1;
    }
    expect(both).toBe(56);
    expect(jaeEmpty).toBe(960);
    expect(klEmpty).toBe(84);
  });

  test("p3 vsota r1–r20 = 6906 QK (6916 val 111 − 10 v123)", () => {
    const p3 = REG.slice(firsts[3], firsts[3] + 21);
    const sum = p3.slice(1).reduce((a, r) => a + Number(r.klafter || 0), 0);
    expect(sum).toBe(6906);
  });

  test("pre_v123 polja obstajajo točno za 27 FIX vrstic (nostalgični vir)", () => {
    const withPre = REG.filter((r) => r.klafter_pre_v123 !== undefined);
    expect(withPre.length).toBe(27);
  });

  test("kaskada: KG vsebinsko identična (3765/3473), timestamp-only sha prehod 8345868a→1e49de43", () => {
    const kg = JSON.parse(
      readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8"),
    ) as { nodes: unknown[]; edges: unknown[] };
    expect(kg.nodes.length).toBe(3765);
    expect(kg.edges.length).toBe(3473);
    const sha = sha256(join(ATLAS, "knowledge-graph-1825.json"));
    expect(sha.startsWith("1e49de43")).toBe(true);
  });

  test("kaskada §22: story/timeline/coverage/runtime držijo isti KG sha", () => {
    const kgSha = sha256(join(ATLAS, "knowledge-graph-1825.json"));
    const story = JSON.parse(readFileSync(join(ATLAS, "story-graph-1825.json"), "utf8")) as { provenance: { kg_sha256: string } };
    const timeline = JSON.parse(readFileSync(join(ATLAS, "timeline-1825-1830.json"), "utf8")) as { provenance: { kg_sha256: string } };
    const cov = JSON.parse(readFileSync(join(ATLAS, "coverage-report-1825.json"), "utf8")) as { provenance: { kg_sha256: string } };
    expect(story.provenance.kg_sha256).toBe(kgSha);
    expect(timeline.provenance.kg_sha256).toBe(kgSha);
    expect(cov.provenance.kg_sha256).toBe(kgSha);
    expect(sha256(join(ROOT, "src/data/knowledge-graph-1825.json"))).toBe(kgSha);
    expect(sha256(join(ROOT, "src/data/story-graph-1825.json"))).toBe(
      sha256(join(ATLAS, "story-graph-1825.json")),
    );
  });
});
