/**
 * Val 124 — F-V123-01 REŠEN: p7 dvojni-anchor re-read (ime+vrednost) + 7 DISPUTE
 * razrešitev iz val 123 (ISSUE #42 §4/§14; metoda val 119 del 2d-x3)
 * [pot do podatka: research-griblje/val124-anchor/readings-v124.json]
 *
 * KLJUČNA NAJDBA (F-V123-01): v57/v82 bralec je PRESKOKIL udarjeno 54 (vrstica 5,
 * Nro 85, Lappary Marbl) in nato vrednosti bral ENO VRSTICO NIZKO do konca strani.
 * Geometrija: desna stran 21 tiskanih pravil (158..932) = 20 pasov + 1 VSTAVLJENA
 * ozka vrstica 585–603; leva stran 20 pravil (202..935) + stisnjena vrstica 587–603
 * brez lastnega pravila. Vrednosti pišejo ČEZ pasovo zgornje pravilo (top-anchor,
 * dodelitev po večini črnila / ink centroid).
 *
 * VGRADNJA (build-register-v124.py, GUARD deklarirano-staro ≟ register):
 *  - 7 vrednostnih popravkov p7 r4–r10 (obrnjeno zaporedje 54, 241, 49, 31, 169, 138, 56),
 *  - vstavljena vrstica Nro 92 (r11: stisnjena med 91 in 93; leva stran brez pravila,
 *    desna pravilo 585–603; kl 54 ud.; hiša 56; ime v57 "(K)hanzl Valen" ohranjeno
 *    z oklepaji — nečitljiva stisnjena pisava → F-V124-01),
 *  - EXTRA vrstica (r20: ditto-Strauß brez Nro, kl 110 ud., hiša neberljiva → F-V124-01),
 *  - 3 vrednostna re-sidranja repa (r14 224→321, r16 945→262, r17 297→397),
 *  - fantom-Fürtrag premaknjen r20→r21 (anmerkung),
 *  - ertrag_kr "1 -381" re-sidrano r3→r4 (rdeča kapitalna opomba stoji ob vrstici 5/Nro 85),
 *  - 22 vrstic p7 (20 podatkovnih + EXTRA + fantom); register 2875 → 2876.
 *
 * DISPUTE val 123 RAZREŠENI (celicni zoomi ×12–24, digitcmp): 4 FIX
 * (p11 r3 79→99, p12 r17 82→53, p13 r17 112→182, p14 r0 687→187) + 3 POTRJENE
 * (p10 r18 1038, p11 r20 211, p11 r21 185). BONUS: p11 r15 382→582 (nova najdba
 * zunaj disput), p11 r17 78 potrjena (7 brez zanke, zoom ×18 — "98" ovržen).
 *
 * ODPRTI FLAGI: F-V124-01 (p7 imenska/hišna plast — v57 imenske napačne brale;
 * ločen val, NIČ popravkov v v124) + kultur_p7 (dvovrstični "Lehngut Hfl." niso
 * re-sidrani — ločen prehod).
 *
 * KASKADA (izrecna): c4 v90 regenerirana (K9 p1–55 jaethe_empty 959→960,
 * klafter_plain_le99 177→178, both_filled 56 nespremenjen; K5 dito 208/2876 —
 * EXTRA vrstica je ditto) → KG vsebinsko IDENTIČNA (3765/3473; builder ne bere
 * vrednostnega sloja; sha fc23ab10 → 1e49de43, timestamp-only) → story → timeline
 * → coverage PASS 8 (§24 14/14) → source-coverage rows 2876 → runtime src/data
 * sinhronizirana; analysis-v5/v6 regenerirana (varovalki 2875→2876).
 *
 * ISKRENOST (§4): 0 VLM klicev — vsa branja agentski vid na programsko
 * generiranih izrezkih (crops/ regenerabilni, .gitignore); dvoumno ostaja odprto
 * (262 prva številka 2/3 — sprejeto po soglasju z v123 oljnim zaporedjem; EXTRA
 * hiša neberljiva); imenska/hišna plast NESPREMENJENA (F-V124-01).
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "..");
type Row = Record<string, unknown>;

const REG = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/ps-n83/register.json"), "utf8"),
) as Row[];
const CHANGES = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/val124-anchor/changes-v124.json"), "utf8"),
) as {
  val: number;
  total_pre: number;
  total_post: number;
  changes: Array<{ page: number; r: number; field: string; pre: string | null; post: string | null }>;
};
const READ = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/val124-anchor/readings-v124.json"), "utf8"),
) as {
  val: number;
  p7_structural: {
    line_table: Array<{ line: number | string; nro: string; value_book: string; struck?: boolean }>;
    value_fixes: Array<{ r: number; pre: string; post: string }>;
    value_reanchors: Array<{ r: number; pre: string; post: string }>;
  };
  disputes_resolved: Array<{ page: number; r: number; reg: string; seen: string; decision: string }>;
  bonus_finds: Array<{ page: number; r: number; reg: string; seen: string; decision: string }>;
  open_flags: Record<string, string>;
};

const ATLAS = join(ROOT, "research-griblje/atlas-1825");
const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

const firsts: Record<number, number> = {};
REG.forEach((r, i) => {
  const pg = Number(r.page);
  if (!(pg in firsts)) firsts[pg] = i;
});
const p7 = REG.slice(firsts[7], firsts[7] + 22);

describe("val 124 — gardele vhodov (p7 dvojni anchor, F-V123-01)", () => {
  test("register: 2876 vrstic (val 124: 2875 + 1 vstavljena p7 Nro 92; prej val 115: 2871 + 4); v125: 1 vrstica v124-dvojni-anchor (r20; r11 → v125-names-houses)", () => {
    expect(REG.length).toBe(2876);
    expect(REG.filter((r) => r.reading_pass === "v124-dvojni-anchor").length).toBe(1); // EXTRA r20 (val 125: r11 → v125-names-houses)
  });

  test("changes audit: val 124, 16 sprememb, tally 2875 → 2876", () => {
    expect(CHANGES.val).toBe(124);
    expect(CHANGES.total_pre).toBe(2875);
    expect(CHANGES.total_post).toBe(2876);
    expect(CHANGES.changes.length).toBe(16);
    const tally: Record<string, number> = {};
    for (const c of CHANGES.changes) tally[c.field] = (tally[c.field] ?? 0) + 1;
    expect(tally).toEqual({
      klafter: 12, // 7 p7 fixes + 3 re-anchors repa + 4 dispute FIX (p11/p12/p13/p14)
      ertrag_kr: 1, // 1 -381 re-sidro r3→r4
      NEW_ROW: 2, // Nro 92 + EXTRA
      anmerkung: 1, // p10 r18 razrešitev (ostale disput anmerkung = add-only v tej isti enoti)
    });
  });

  test("GUARD: vsak vrednostni popravek ima snimko klafter_pre_v124 = deklarirano staro (15 vrstic)", () => {
    const snap = REG.map((r, i) => ({ r, i })).filter(
      ({ r }) => (r as { klafter_pre_v124?: string }).klafter_pre_v124 !== undefined,
    );
    expect(snap.length).toBe(15); // 10 na p7 (r4–r10 + 3 re-anchors) + p11 ×2 + p12 + p13 + p14
    for (const { r } of snap) {
      expect(String((r as { klafter_pre_v124: string }).klafter_pre_v124).length).toBeGreaterThan(0);
      expect(String(r.klafter)).not.toBe(String((r as { klafter_pre_v124: string }).klafter_pre_v124));
    }
    // trije rep re-anchors iz readings (r14 224→321, r16 945→262, r17 297→397)
    expect(String((p7[14] as { klafter_pre_v124?: string }).klafter_pre_v124)).toBe("224");
    expect(p7[14].klafter).toBe("321");
    expect(String((p7[16] as { klafter_pre_v124?: string }).klafter_pre_v124)).toBe("945");
    expect(p7[16].klafter).toBe("262");
    expect(String((p7[17] as { klafter_pre_v124?: string }).klafter_pre_v124)).toBe("297");
    expect(p7[17].klafter).toBe("397");
  });

  test("p7: 22 vrstic — polno vrednostno zaporedje 1:1 z oljnim zaporedjem strani", () => {
    expect(p7.length).toBe(22);
    expect(p7.map((r) => String(r.klafter ?? ""))).toEqual([
      "774", "187", "283", "160", "54", "241", "49", "31", "169", "138", "56",
      "54", "52", "44", "321", "315", "262", "397", "187", "58", "110", "",
    ]);
    // line_table soglasje: 21 podatkovnih vrednosti iz knjige = register r0–r20
    const book = READ.p7_structural.line_table
      .filter((l) => typeof l.line === "number" && (l.line as number) <= 21)
      .map((l) => l.value_book.split("|")[0]);
    expect(book.slice(0, 21)).toEqual(p7.slice(0, 21).map((r) => String(r.klafter)));
  });

  test("vstavljena vrstica Nro 92 (r11): kl 54 ud., hiša 56, ime v125 'Schimez P…a' (v57 '(K)hanzl Valen' ovržena — F-V124-01), rp v125-names-houses", () => {
    const r = p7[11];
    expect(r.klafter).toBe("54");
    expect(String(r.haus_no)).toBe("56");
    expect(String(r.owner_original)).toBe("Schimez P…a"); // val 125 F-V124-01: stisnjeno ime — 1. beseda Schimez-koren, 2. nečitljiva
    expect(String(r.reading_pass)).toBe("v125-names-houses");
    expect(String(r.anmerkung)).toContain("v124 NOVA VRSTICA");
    expect(String(r.anmerkung)).toContain("585–603");
    expect(String(r.anmerkung)).toContain("v125"); // ime popravek
  });

  test("EXTRA vrstica (r20): ditto-Strauß brez Nro, kl 110 ud., hiša neberljiva, owner_was_ditto", () => {
    const r = p7[20];
    expect(r.klafter).toBe("110");
    expect(String(r.owner_original ?? "")).toBe("");
    expect(String(r.haus_no ?? "")).toBe("");
    expect(r.owner_was_ditto).toBe(true);
    expect(String(r.reading_pass)).toBe("v124-dvojni-anchor");
    expect(String(r.anmerkung)).toContain("EXTRA vrstica IZVEN Nro sekvence");
  });

  test("fantom-Fürtrag premaknjen r20→r21 (anmerkung sledi); vrednosti fantoma ostanejo prazne", () => {
    const r21 = p7[21];
    expect(String(r21.klafter ?? "")).toBe("");
    expect(String(r21.anmerkung)).toContain("fantomski rep");
    expect(String(r21.anmerkung)).toContain("v124"); // premestitveni zapisek
  });

  test("ertrag_kr '1 -381' re-sidran r3→r4 (rdeča kapitalna opomba ob vrstici 5 / Nro 85)", () => {
    expect(String(p7[3].ertrag_kr ?? "")).toBe("");
    expect(String(p7[4].ertrag_kr)).toBe("1 -381");
    expect(String(p7[4].anmerkung)).toContain("1 -381");
  });

  test("identiteta: v124 je imensko ostala nespremenjena (CHANGES owner=0); val 125 F-V124-01 je popravil 7 imen — glej tests/val125", () => {
    // val 125 je rešil F-V124-01 (r1/r5/r9/r11/r12/r13/r18) — ta test drži v124 revizijo
    // audit datoteke; register stanje od v125 testira tests/val125-fv124-01-imenska-hisna-plast-p7.test.ts
    const nameChanges = CHANGES.changes.filter((c) => c.field === "owner_original" || c.field === "owner");
    expect(nameChanges.length).toBe(0);
    expect(READ.open_flags["F-V124-01"]).toContain("NIČ popravkov v v124");
  });
});

describe("val 124 — 7 DISPUTE razrešitev (val 123) + bonus", () => {
  test("4 FIX: p11 r3 79→99, p12 r17 82→53, p13 r17 112→182, p14 r0 687→187", () => {
    const fixed = READ.disputes_resolved.filter((d) => d.decision.startsWith("FIX"));
    expect(fixed.map((d) => `${d.page}-${d.r}:${d.reg}→${d.seen}`)).toEqual([
      "11-3:79→99", "12-17:82→53", "13-17:112→182", "14-0:687→187",
    ]);
    const checks: Array<[number, number, string]> = [
      [11, 3, "99"], [12, 17, "53"], [13, 17, "182"], [14, 0, "187"],
    ];
    for (const [pg, r, val] of checks) {
      const row = REG[firsts[pg] + r];
      expect(String(row.klafter), `p${pg} r${r}`).toBe(val);
      expect(String(row.anmerkung)).toContain("v124");
      expect((row as { klafter_pre_v124?: string }).klafter_pre_v124, `p${pg} r${r} snimka`).toBeDefined();
    }
  });

  test("3 POTRJENE: p10 r18 1038, p11 r20 211, p11 r21 185 (brez popravka, razrešitvena anmerkung)", () => {
    const confirmed = READ.disputes_resolved.filter((d) => d.decision.startsWith("POTRJENA"));
    expect(confirmed.length).toBe(3);
    const checks: Array<[number, number, string]> = [[10, 18, "1038"], [11, 20, "211"], [11, 21, "185"]];
    for (const [pg, r, val] of checks) {
      const row = REG[firsts[pg] + r];
      expect(String(row.klafter), `p${pg} r${r}`).toBe(val);
      expect(String(row.anmerkung)).toContain("v124: disputa val 123 razrešena");
    }
  });

  test("bonus: p11 r15 382→582 (nova najdba zunaj disput) + p11 r17 78 potrjena", () => {
    expect(READ.bonus_finds.length).toBe(2);
    expect(String(REG[firsts[11] + 15].klafter)).toBe("582");
    expect(String(REG[firsts[11] + 17].klafter)).toBe("78");
    expect(String(REG[firsts[11] + 15].anmerkung)).toContain("v124");
  });
});

describe("val 124 — kaskada (izrecna, §22)", () => {
  test("c4 v90: K9 p1–55 jaethe_empty 959→960, klafter_plain_le99 177→178, both_filled 56; K5 208/2876", () => {
    const c4 = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/ps-n83/band-v86/c4-metrika-v90.json"), "utf8"),
    ) as { meta: Record<string, unknown>; K9_konfunda_F_PV_05?: { p1_55_val57: Record<string, number> } } & Record<
      string,
      { p1_55_val57?: Record<string, number> }
    >;
    const k9 = c4[Object.keys(c4).find((k) => k.startsWith("K9"))!].p1_55_val57!;
    expect(k9["both_filled"]).toBe(56);
    expect(k9["jaethe_empty"]).toBe(960); // +1 vstavljena (jae prazno, kl 54)
    expect(k9["klafter_empty"]).toBe(84);
    expect(k9["klafter_plain_le99"]).toBe(178); // +1 (54 ud.)
    expect(String(c4.meta.K5_input_reliability)).toContain("208/2876"); // EXTRA = ditto
  });

  test("KG vsebinsko IDENTIČNA (3765/3473) — builder ne bere vrednostnega sloja; sha fc23ab10 → 1e49de43 (timestamp-only)", () => {
    const kg = JSON.parse(
      readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8"),
    ) as { nodes: unknown[]; edges: unknown[]; node_stats: Record<string, number> };
    expect(kg.nodes.length).toBe(3765);
    expect(kg.edges.length).toBe(3473);
    expect(kg.node_stats["PARCEL"]).toBe(2427);
    expect(kg.node_stats["HOUSE"]).toBe(169);
    expect(sha256(join(ATLAS, "knowledge-graph-1825.json"))).toMatch(/^1e49de43/);
  });

  test("kaskadni artefakti + runtime kopije držijo isti KG sha 1e49de43…", () => {
    for (const p of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
      "research-griblje/atlas-1825/coverage-report-1825.json",
      "src/data/story-graph-1825.json",
      "src/data/timeline-1825-1830.json",
    ]) {
      const raw = readFileSync(join(ROOT, p), "utf8");
      expect(raw.includes("1e49de43"), p).toBe(true);
    }
    // runtime KG kopija = atlas izhod (ena izhodna resnica — byte identična)
    expect(sha256(join(ROOT, "src/data/knowledge-graph-1825.json"))).toMatch(/^1e49de43/);
  });

  test("source-coverage: PS rows 2876 (val 124 prehod tudi v builderju build-coverage-report.py)", () => {
    const sc = JSON.parse(
      readFileSync(join(ATLAS, "source-coverage-1825.json"), "utf8"),
    ) as { transcription: { PS: { rows: number } } };
    expect(sc.transcription.PS.rows).toBe(2876);
  });

  test("timeline I6 zatiči nespremenjeni: PUA 2035 / PS 392 / raba 173+142", () => {
    const tl = JSON.parse(
      readFileSync(join(ATLAS, "timeline-1825-1830.json"), "utf8"),
    ) as unknown;
    const s = JSON.stringify(tl);
    expect(s).toContain("2035");
    expect(s).toContain("392");
    expect(s).toContain("173");
    expect(s).toContain("142");
  });
});
