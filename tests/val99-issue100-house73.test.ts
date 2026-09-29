/**
 * Val 99 — ISSUE #100: identitetna veriga F0000212 (rojstna hiša dr. Nika Županiča).
 *
 * Kaj ta datoteka varuje:
 *  1. NEGATIV (poštenost): hiša št. 73 NE obstaja v nobenem in-repo 1825 viru —
 *     PS N83 (polna pokritost 3–143), PUA, house-register-1825, A01 inventar.
 *     To je testno vodena potrditev NR-05 (negative register, val 89) — brez podvajanja:
 *     ta test ne spreminja negative register, samo varuje val99 summary izhod.
 *  2. SOSESKA 1825: hiši 72 (Wolfsloch Wolfgey, p65) in 74 (Tillek Wolfgey p65 /
 *     Heidrich Peter p69 / Kauc Miheljz p122) sta dokumentirana kot triangulacijsko sidro;
 *     73 med njima ni.
 *  3. ZUNANJI DOKAZI (artefakti + sha256): Šopek (Etnolog 10–11, 1937–39) — točen citat
 *     »kupil hišo št. 73 in posestvo«; SEM F0000212 (rojstna hiša); SEM razstava
 *     (Griblje, 1. 12. 1876) — vsi quote_present + status VERIFIED.
 *  4. VERIGA #100 §8: F0000212 = št. 73 → INFERRED (nič ne dvignjeno na VERIFIED brez
 *     enotnega vira); hiša 73 v 1825 → NOT_FOUND; preostali členi TO_COLLECT.
 *  5. DETERMINISTIČNOST: check.py je brez omrežja in brez VLM — summary je regenerabilen.
 *
 * Protokol issue #100: prazna polja = odprta raziskovalna naloga, ne dovoljenje za sklepanje.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const RG = join(process.cwd(), "research-griblje");
const V99 = join(RG, "val99");
const ATLAS = join(RG, "atlas-1825");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

const SUMMARY = JSON.parse(
  readFileSync(join(V99, "issue100-house73-summary.json"), "utf8"),
) as {
  val: string;
  issue: string;
  deterministic: boolean;
  method: { vlm_calls: number };
  in_repo_1825: {
    ps_rows_total: number;
    ps_pages: string;
    house_73: { ps_rows: number; pua_rows: number; house_register: number; a01_bp_73: number };
    neighborhood_65_80: {
      house_no: number;
      ps_rows: number;
      ps_pages: number[];
      ps_owners: string[];
      pua_rows: number;
      in_house_register: boolean;
    }[];
  };
  external_evidence: Record<
    string,
    { claim: string; quote: string; quote_present: boolean; sha256: string; status: string }
  >;
  chain_100: { link: string; status: string; evidence: string; source: string }[];
  nr05_reference: string;
};

describe("val99 · issue #100 · hiša 73 v 1825 virih ne obstaja", () => {
  test("summary je val 99 / issue 100 / determinističen / 0 VLM", () => {
    expect(SUMMARY.val).toBe("99");
    expect(SUMMARY.issue).toBe("100");
    expect(SUMMARY.deterministic).toBe(true);
    expect(SUMMARY.method.vlm_calls).toBe(0);
  });

  test("PS register ima polno pokritost (2.871 vrstic, str. 3–143)", () => {
    expect(SUMMARY.in_repo_1825.ps_rows_total).toBe(2871);
    expect(SUMMARY.in_repo_1825.ps_pages).toContain("3–143");
  });

  test("hiša 73 = 0 v vseh štirih 1825 virih (PS/PUA/house-register/A01)", () => {
    const h = SUMMARY.in_repo_1825.house_73;
    expect(h.ps_rows).toBe(0);
    expect(h.pua_rows).toBe(0);
    expect(h.house_register).toBe(0);
    expect(h.a01_bp_73).toBe(0);
  });

  test("soseska 1825: 72 = Wolfsloch Wolfgey (p65), 74 = Tillek/Heidrich/Kauc — 73 NI član", () => {
    const n = SUMMARY.in_repo_1825.neighborhood_65_80;
    const h72 = n.find((x) => x.house_no === 72);
    const h74 = n.find((x) => x.house_no === 74);
    expect(h72).toBeDefined();
    expect(h72!.ps_owners).toContain("Wolfsloch Wolfgey");
    expect(h72!.ps_pages).toContain(65);
    expect(h74).toBeDefined();
    expect(h74!.ps_owners).toContain("Tillek Wolfgey");
    expect(h74!.ps_owners).toContain("Heidrich Peter");
    expect(h74!.ps_owners).toContain("Kauc Miheljz");
    expect(n.some((x) => x.house_no === 73)).toBe(false);
    // varovalka proti prihodnjemu podvajanju: 73 sme biti v soseski ŠELE, ko nov vir omeni
    expect(n.map((x) => x.house_no)).not.toContain(73);
  });

  test("NR-05 referenca je prisotna (brez podvajanja negative register)", () => {
    expect(SUMMARY.nr05_reference).toContain("NR-05");
    expect(SUMMARY.nr05_reference).toContain("negative-result-register-1825.json");
  });
});

describe("val99 · issue #100 · zunanji dokazi (artefakti + sha256)", () => {
  test("Šopek 1937–39: citat »kupil hišo št. 73 in posestvo« je prisoten — VERIFIED", () => {
    const e = SUMMARY.external_evidence.sopek_1937_39;
    expect(e.quote_present).toBe(true);
    expect(e.status).toBe("VERIFIED");
    expect(e.quote).toContain("kupil hišo št. 73 in posestvo");
    expect(e.quote).toContain("Krasincu h. št. 18");
  });

  test("SEM F0000212: rojstna hiša Nika Županiča — VERIFIED", () => {
    const e = SUMMARY.external_evidence.sem_f0000212;
    expect(e.quote_present).toBe(true);
    expect(e.status).toBe("VERIFIED");
    expect(e.claim).toContain("F0000212");
    expect(e.claim).toContain("rojstna hiša dr. Nika Županiča");
  });

  test("SEM razstava: Niko Županič rojen Griblje 1. 12. 1876 — VERIFIED", () => {
    const e = SUMMARY.external_evidence.sem_rojstvo;
    expect(e.quote_present).toBe(true);
    expect(e.status).toBe("VERIFIED");
    expect(e.claim).toContain("1. 12. 1876");
  });

  test("artefakti obstajajo in sha256 v summary se ujemajo z datotekami", () => {
    const artefacts: Record<string, string> = {
      sopek_1937_39: "sopek-1937-1939.pdf",
      sem_f0000212: "sem-griblje-lokacije.html",
      sem_rojstvo: "sem-svetovljan.html",
    };
    for (const [key, file] of Object.entries(artefacts)) {
      const p = join(V99, file);
      expect(existsSync(p)).toBe(true);
      expect(SUMMARY.external_evidence[key].sha256).toBe(sha256(p));
    }
  });
});

describe("val99 · issue #100 · veriga §8 (statusi po pravilih #100)", () => {
  const chain = () => {
    const m = new Map<string, string>();
    for (const c of SUMMARY.chain_100) m.set(c.link, c.status);
    return m;
  };

  test("F0000212 = št. 73 → INFERRED (ne VERIFIED — enoten vir manjka)", () => {
    expect(chain().get("F0000212 = hiša št. 73")).toBe("INFERRED");
    const c = SUMMARY.chain_100.find((x) => x.link === "F0000212 = hiša št. 73");
    expect(c!.evidence).toContain("konvergenca 2 neodvisnih virov");
  });

  test("hiša 73 v 1825 virih → NOT_FOUND z dokazom NR-05 + sosesko", () => {
    expect(chain().get("Hišna št. 73 v 1825 virih")).toBe("NOT_FOUND");
    const c = SUMMARY.chain_100.find((x) => x.link === "Hišna št. 73 v 1825 virih");
    expect(c!.evidence).toContain("NR-05");
    expect(c!.evidence).toContain("Wolfsloch");
  });

  test("poznejši členi ostajajo TO_COLLECT (ni ugibanja)", () => {
    const m = chain();
    expect(m.get("Zgodovinska parcela (1825 kataster)")).toBe("TO_COLLECT");
    expect(m.get("Današnja parcela / koordinata")).toBe("TO_COLLECT");
    expect(m.get("3D model")).toBe("TO_COLLECT");
    expect(m.get("AR anchor / mobilni AR prikaz")).toBe("TO_COLLECT");
  });

  test("VERIFIED samo na trih re-verified členih", () => {
    const m = chain();
    const verified = [...m.entries()].filter(([, s]) => s === "VERIFIED").map(([l]) => l);
    expect(verified.length).toBe(3);
    expect(verified).toContain("Originalna fotografija — F0000212");
    expect(verified).toContain("Identiteta hiše (rojstna hiša Nika Županiča)");
    expect(verified).toContain("Hišna številka 73 (Miko Županič kupil ~1873)");
  });
});

describe("val99 · issue #100 · determinističnost in ne-podvajanje", () => {
  test("check.py obstaja, je brez omrežja in brez VLM", () => {
    const src = readFileSync(join(V99, "issue100-house73-check.py"), "utf8");
    expect(src).toContain("Determinističen");
    expect(src).not.toMatch(/requests\.|urllib|import http|curl\s/);
    expect(src).toContain('"vlm_calls": 0');
  });

  test("negative register ni bil spreminjan (NR-05 ostaja vir resnice, števec 14)", () => {
    const nr = JSON.parse(
      readFileSync(join(ATLAS, "negative-result-register-1825.json"), "utf8"),
    ) as { negatives_total: number };
    expect(nr.negatives_total).toBe(14);
  });

  test("raziskovalni dokument 114 obstaja in omenja ključne najdbe", () => {
    const doc = readFileSync(
      join(RG, "114-val99-issue100-f0000212-identity.md"),
      "utf8",
    );
    expect(doc).toContain("hiša št. 73 v 1825 virih NE obstaja");
    expect(doc).toContain("INFERRED");
    expect(doc).toContain("Wolfsloch Wolfgey");
    expect(doc).toContain("kupil hišo št. 73 in posestvo");
  });
});
