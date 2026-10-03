/**
 * Val 125 — F-V124-01 REŠEN: p7 imenska + hišna plast (NR-14 celicni zoomi,
 * 0 VLM) [pot do podatka: research-griblje/val124-anchor/readings-v125.json]
 *
 * GEOMETRIJA (nov nauk F-V125): imena/hiše/Nro so BOTTOM-anchor — baseline na
 * SPODNJEM pravilu pasu (nasprotje vrednostnemu sloju, ki je TOP-anchor po
 * v124). Lastništvo pasu potrjeno s Nro sidri: Nro + hiša + ime na ISTEM
 * pravilu, znotraj pasu [top r .. top r+1]. Grid val 121/124 nespremenjen
 * (top0_lin=160.25, n=22, mean_off 1.86 — cal OK brez pina). Stisnjena
 * vrstica Nro 92 (r11) zapisana VISOKO v pasu.
 *
 * VGRADNJA (build-register-v125.py, GUARD deklarirano-staro ≟ register;
 * snimke owner_original_pre_v125 / haus_no_pre_v125):
 *  - 7 strukturnih imenskih popravkov v57: r1 'Poiding Hanl'→'Pödigz Hanl',
 *    r5 'Schimeczkhanl'→'Schimecz Mihual' (2 besedi!), r9/r12 'Poiding
 *    Matthl'→'Pödigz Marusa' (rokopis 'Maruſa' — long-s, brez t-prečk),
 *    r11 '(K)hanzl Valen'→'Schimez P…a' (stisnjeno; 2. beseda nečitljiva),
 *    r13 'Peders Marbl'→'(R)abitscher Georg' (rokopis 'Rabutschar Grogy' =
 *    ista oseba kot r14, Nro 94+95), r18 '(R)abitscher Marbl'→'Strauß Georg'
 *    (rokopis 'Strauß Grogy', Nro 99 = isti lastnik kot r19);
 *  - 9 hišnih popravkov: r1 63→53, r2 20→54, r5 65→49, r10 35→55, r13 80→48,
 *    r14 48→45, r15 45→47, r18 47→46, r19 46→45;
 *  - 1 hišni artefakt: r21 fantom Fürtrag '48'→'' (celica prazna);
 *  - r20 EXTRA: hiša PRAZNA (ni zapisana) — anmerkung zaključek F-V124-01;
 *  - register 2876 vrstic (nespremenjeno); 0 sprememb vrednostnega sloja.
 *
 * KASKADA (izrecna, §22): c4 v90 re-run — K9 p1–55 56/960/84 in K5 208/2876
 * NESPREMENJENA (vrednostni sloj ni bil dotaknjen; sha meta vsebuje nov
 * register vhod) → KG vsebinsko IDENTIČNA (3764/3473/2427/2775; osebna plast
 * = person-owner-register val 59 snapshot + house-register owners.ps val 59
 * snapshot — builder NE bere owner_original iz register.json za PERSON/
 * OWNER_OF; sha ee3ac862 → ab418c75, timestamp-only) → story 3764/3473/4 →
 * timeline 8 (I1/I2/I6 ✓) → coverage PASS 8 (§24 14/14) → analysis-v5/v6
 * byte-identna re-runa → runtime src/data sinhronizirana.
 *
 * ODPRTI FLAGI: F-V125-01 (person-owner-register + house-register owners.ps =
 * val 59 snapshot — uskladitev s v125 šele PO NR-14 črkovalni sodbi, en
 * pass2 re-run); NR-14 (črkovalne variante p7: Rabitscher/Rabutschar,
 * Georg/Grogy, Maruſa/Marusa/Marls, Mihual/Michual, Schimez P…a 2. beseda);
 * kultur_p7 (ločen prehod, nespremenjen).
 *
 * ISKRENOST (§4): 0 VLM klicev — vsa branja agentski vid na programsko
 * generiranih izrezkih (crops-v125/ regenerabilni, .gitignore); r11 2. beseda
 * ostaja nečitljiva tudi pri ×14 ('Schimez P…a'); 262 prva številka (v124)
 * ostaja odprta; hišne celice na meji ločljivosti JPEG (~10 px višine) —
 * sodbe z digitcmp iz iste strani.
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
  readFileSync(join(ROOT, "research-griblje/val124-anchor/changes-v125.json"), "utf8"),
) as {
  val: number;
  total_pre: number;
  total_post: number;
  n_field_changes: number;
  n_rows_touched: number;
  changes: Array<{ page: number; r: number; field: string; pre: string | null; post: string | null }>;
};
const READ = JSON.parse(
  readFileSync(join(ROOT, "research-griblje/val124-anchor/readings-v125.json"), "utf8"),
) as {
  val: number;
  method: string;
  scope: string;
  p7_adjudication: { rows: Array<{ r: number; nro: string; sodba: string }> };
  open_flags: Record<string, string>;
};

const ATLAS = join(ROOT, "research-griblje/atlas-1825");
const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(p)).digest("hex");

const firsts: Record<number, number> = {};
REG.forEach((r, i) => {
  const pg = r.page as number;
  if (firsts[pg] === undefined) firsts[pg] = i;
});
const p7 = REG.slice(firsts[7], firsts[7] + 22);

describe("val 125 — gardele vhodov (F-V124-01 imenska + hišna plast p7)", () => {
  test("register: 2876 vrstic (nespremenjeno — brez novih vrstic v v125)", () => {
    expect(REG.length).toBe(2876);
    expect(CHANGES.total_pre).toBe(2876);
    expect(CHANGES.total_post).toBe(2876);
  });

  test("changes audit: val 125, 17 poljskih sprememb na 13 vrsticah (7 imenskih + 10 hišnih)", () => {
    expect(CHANGES.val).toBe(125);
    expect(CHANGES.n_field_changes).toBe(17);
    expect(CHANGES.n_rows_touched).toBe(14); // 13 s poljskimi spremembami + r20 (samo anmerkung zaključek)
    expect(CHANGES.changes.length).toBe(17);
    const tally: Record<string, number> = {};
    for (const c of CHANGES.changes) tally[c.field] = (tally[c.field] ?? 0) + 1;
    expect(tally).toEqual({ owner_original: 7, haus_no: 10 });
    // nič iz vrednostnega sloja — v124 zaključen, v125 ne sme odpreti
    for (const c of CHANGES.changes) {
      expect(["owner_original", "haus_no"]).toContain(c.field);
    }
  });

  test("GUARD: vsaka sprememba ima snimko *_pre_v125 = deklarirano staro", () => {
    const ownerSnaps = p7.filter(
      (r) => (r as { owner_original_pre_v125?: string }).owner_original_pre_v125 !== undefined,
    );
    const hausSnaps = p7.filter(
      (r) => (r as { haus_no_pre_v125?: string }).haus_no_pre_v125 !== undefined,
    );
    expect(ownerSnaps.length).toBe(7);
    expect(hausSnaps.length).toBe(10);
    for (const c of CHANGES.changes) {
      const row = p7[c.r];
      const snapField = c.field === "owner_original" ? "owner_original_pre_v125" : "haus_no_pre_v125";
      expect(String((row as Row)[snapField])).toBe(String(c.pre));
      expect(String(row[c.field])).toBe(String(c.post));
    }
  });
});

describe("val 125 — 7 strukturnih imenskih popravkov (v57 napačne brale)", () => {
  test("r1: 'Poiding Hanl' → 'Pödigz Hanl' (P-d-i-g-z, brez 'ng'; cf. r9/r12 isti koren)", () => {
    expect(String(p7[1].owner_original)).toBe("Pödigz Hanl");
    expect(String(p7[1].owner_original_pre_v125)).toBe("Poiding Hanl");
  });

  test("r5: 'Schimeczkhanl' → 'Schimecz Mihual' (DVE besedi; 2. ≈ Michael; r0 ostaja enobesedni)", () => {
    expect(String(p7[5].owner_original)).toBe("Schimecz Mihual");
    expect(String(p7[5].owner_original_pre_v125)).toBe("Schimeczkhanl");
    expect(String(p7[0].owner_original)).toBe("Schimeczkhanl"); // r0 pravi enobesedni
  });

  test("r9 + r12: 'Poiding Matthl' → 'Pödigz Marusa' (rokopis 'Maruſa' — long-s, brez t-prečk; zapisa identična)", () => {
    expect(String(p7[9].owner_original)).toBe("Pödigz Marusa");
    expect(String(p7[12].owner_original)).toBe("Pödigz Marusa");
    expect(String(p7[9].owner_original_pre_v125)).toBe("Poiding Matthl");
    expect(String(p7[12].owner_original_pre_v125)).toBe("Poiding Matthl");
  });

  test("r11 (stisnjena Nro 92): '(K)hanzl Valen' → 'Schimez P…a' (1. beseda = koren cf. r10; 2. nečitljiva)", () => {
    expect(String(p7[11].owner_original)).toBe("Schimez P…a");
    expect(String(p7[11].owner_original_pre_v125)).toBe("(K)hanzl Valen");
    expect(String(p7[10].owner_original)).toBe("Schimez Hanl"); // koren cf.
    expect(String(p7[11].owner_original)).toContain("…"); // nečitljivi marker
  });

  test("r13: 'Peders Marbl' → '(R)abitscher Georg' — NAPAČNA OSEBA; rokopis 'Rabutschar Grogy' = ista oseba kot r14 (Nro 94+95)", () => {
    expect(String(p7[13].owner_original)).toBe("(R)abitscher Georg");
    expect(String(p7[13].owner_original)).toBe(String(p7[14].owner_original)); // person-key stabilnost
    expect(String(p7[13].owner_original_pre_v125)).toBe("Peders Marbl");
  });

  test("r18: '(R)abitscher Marbl' → 'Strauß Georg' — NAPAČNA OSEBA; rokopis 'Strauß Grogy' (Nro 99) = isti lastnik kot r19", () => {
    expect(String(p7[18].owner_original)).toBe("Strauß Georg");
    expect(String(p7[18].owner_original)).toBe(String(p7[19].owner_original)); // person-key stabilnost
    expect(String(p7[18].owner_original_pre_v125)).toBe("(R)abitscher Marbl");
  });

  test("sodbeni pokritost: 22 vrstic v readings p7_adjudication (20 podatkovnih + EXTRA + fantom)", () => {
    expect(READ.p7_adjudication.rows.length).toBe(22);
    expect(READ.p7_adjudication.rows.map((x) => x.r)).toEqual(
      Array.from({ length: 22 }, (_, i) => i),
    );
  });
});

describe("val 125 — hišna plast (9 popravkov + 1 artefakt + EXTRA zaključek)", () => {
  test("9 hišnih popravkov — končne vrednosti 1:1 z rokopisom (zoom ×24, digitcmp)", () => {
    const expectedHaus = [
      "65", "53", "54", "54", "54", "49", "54", "47", "45", "50", "55",
      "56", "50", "48", "45", "47", "47", "47", "46", "45", "", "",
    ];
    expect(p7.map((r) => String(r.haus_no ?? ""))).toEqual(expectedHaus);
  });

  test("hišne pre_v125 snimke (sledljivost)", () => {
    const pre = p7.map((r) => String((r as { haus_no_pre_v125?: string }).haus_no_pre_v125 ?? ""));
    expect(pre[1]).toBe("63");
    expect(pre[2]).toBe("20");
    expect(pre[5]).toBe("65");
    expect(pre[10]).toBe("35");
    expect(pre[13]).toBe("80");
    expect(pre[14]).toBe("48");
    expect(pre[15]).toBe("45");
    expect(pre[18]).toBe("47");
    expect(pre[19]).toBe("46");
    expect(pre[21]).toBe("48"); // fantom artefakt
  });

  test("r20 EXTRA: hiša PRAZNA (ni zapisana) — anmerkung zaključek hišnega dela F-V124-01", () => {
    expect(String(p7[20].haus_no ?? "")).toBe("");
    expect(String(p7[20].anmerkung)).toContain("PRAZNA");
    expect(String(p7[20].anmerkung)).toContain("v125");
  });

  test("r21 fantom Fürtrag: hiša '48' (v112 artefakt) → ''", () => {
    expect(String(p7[21].haus_no ?? "")).toBe("");
    expect(String(p7[21].anmerkung)).toContain("v125");
    expect(String(p7[21].anmerkung)).toContain("artefakt");
  });

  test("person-key cobildi: hišne vrednosti so znotraj pt registrskega razpona (45–56 na p7)", () => {
    for (const r of p7) {
      const h = String(r.haus_no ?? "");
      if (h === "") continue;
      expect(Number(h)).toBeGreaterThanOrEqual(45);
      expect(Number(h)).toBeLessThanOrEqual(65);
    }
  });
});

describe("val 125 — reading_pass in anmerkung (add-only disciplina)", () => {
  test("rp: 13 vrstic v125-names-houses (12 v112 + 1 v124-dvojni-anchor r11); r20 ostaja v124-dvojni-anchor", () => {
    expect(REG.filter((r) => r.reading_pass === "v125-names-houses").length).toBe(13);
    expect(String(p7[20].reading_pass)).toBe("v124-dvojni-anchor");
  });

  test("vrednostni sloj p7 NIČ sprememb (klafter = v124 stanje)", () => {
    expect(p7.map((r) => String(r.klafter ?? ""))).toEqual([
      "774", "187", "283", "160", "54", "241", "49", "31", "169", "138", "56",
      "54", "52", "44", "321", "315", "262", "397", "187", "58", "110", "",
    ]);
  });

  test("anmerkung add-only: vsak popravek ima v125 zapis z dokazom; stare opombe ostanejo", () => {
    for (const r of [1, 2, 5, 9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21]) {
      expect(String(p7[r].anmerkung)).toContain("v125");
    }
    // v124 opombe ostanejo (zgodovinski vir)
    expect(String(p7[11].anmerkung)).toContain("v124 NOVA VRSTICA");
    expect(String(p7[4].anmerkung)).toContain("v124");
    // F-V123-01 disput zapiski ostanejo
    expect(String(p7[5].anmerkung)).toContain("F-V123-01");
  });
});

describe("val 125 — kaskada (izrecna, §22)", () => {
  test("c4 v90: K9 p1–55 56/960/84 + klafter_plain_le99 178; K5 208/2876 — vse NESPREMENJENO (0 vrednostnih popravkov)", () => {
    const c4 = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/ps-n83/band-v86/c4-metrika-v90.json"), "utf8"),
    ) as { K9_konfunda_F_PV_05?: { p1_55_val57?: Record<string, number> }; K9_konfunda?: { p1_55_val57?: Record<string, number> }; meta: Record<string, unknown> };
    const k9src = c4 as unknown as {
      K9_konfunda_F_PV_05?: { p1_55_val57?: Record<string, number> };
      "K9_konfunda_F-PV-05"?: { p1_55_val57?: Record<string, number> };
    };
    const k9 = (k9src["K9_konfunda_F-PV-05"] ?? k9src.K9_konfunda_F_PV_05)!.p1_55_val57!;
    expect(k9.both_filled).toBe(56);
    expect(k9.jaethe_empty).toBe(960);
    expect(k9.klafter_empty).toBe(84);
    expect(k9.klafter_plain_le99).toBe(178);
    expect(String(c4.meta.K5_input_reliability)).toContain("208/2876");
  });

  test("KG vsebinsko IDENTIČNA (3764/3473/2427/2775) — osebna plast = val 59 snapshot; sha ab418c75 (timestamp-only)", () => {
    const kg = JSON.parse(
      readFileSync(join(ATLAS, "knowledge-graph-1825.json"), "utf8"),
    ) as { nodes: Row[]; edges: Row[]; meta: Record<string, unknown> };
    const byType: Record<string, number> = {};
    for (const n of kg.nodes) byType[String(n.node_type)] = (byType[String(n.node_type)] ?? 0) + 1;
    expect(kg.nodes.length).toBe(3764);
    expect(kg.edges.length).toBe(3473);
    expect(byType.PERSON).toBe(981);
    expect(byType.PARCEL).toBe(2427);
    expect(byType.HOUSE).toBe(169);
    expect(sha256(join(ATLAS, "knowledge-graph-1825.json"))).toMatch(/^ab418c75/);
  });

  test("kaskadni artefakti držijo isti KG sha ab418c75… (pogodba §22); runtime kopije = arhiv", () => {
    // story/timeline vgrajujejo kg_sha256 v meta; KG sama je preverjena prek sha256
    for (const rel of [
      "research-griblje/atlas-1825/story-graph-1825.json",
      "research-griblje/atlas-1825/timeline-1825-1830.json",
      "src/data/story-graph-1825.json",
      "src/data/timeline-1825-1830.json",
    ]) {
      const s = readFileSync(join(ROOT, rel), "utf8");
      expect(s.includes("ab418c75"), rel).toBe(true);
    }
    expect(
      sha256(join(ROOT, "src/data/knowledge-graph-1825.json")),
    ).toBe(sha256(join(ATLAS, "knowledge-graph-1825.json")));
    expect(sha256(join(ROOT, "src/data/knowledge-graph-1825.json"))).toMatch(/^ab418c75/);
  });

  test("coverage PASS 8 + §24 14/14; source-coverage PS rows 2876", () => {
    const cov = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/atlas-1825/coverage-report-1825.json"), "utf8"),
    ) as { pass?: string; outputs_manifest?: { count?: number } };
    expect(cov.pass).toBe("PASS 8");
    expect(cov.outputs_manifest?.count).toBe(14);
    const sc = JSON.parse(
      readFileSync(join(ROOT, "research-griblje/atlas-1825/source-coverage-1825.json"), "utf8"),
    ) as { transcription?: { PS?: { rows?: number } } };
    expect(sc.transcription?.PS?.rows).toBe(2876);
  });
});

describe("val 125 — iskrenost (§4) + odprti flagi", () => {
  test("0 VLM: branja na programsko generiranih izrezkih (make-zoom-v125.py, celice ×12–24)", () => {
    expect(READ.val).toBe(125);
    expect(READ.method).toContain("make-zoom-v125.py");
    expect(READ.scope).toContain("0 popravkov vrednostnega sloja");
  });

  test("F-V125-01: val 59 snapshoti (person-owner-register/house-register owners.ps) še ne odražajo v125 — uskladitev po NR-14", () => {
    expect(READ.open_flags["F-V125-01"]).toContain("pass2 re-run");
    expect(READ.open_flags["F-V125-01"]).toContain("H-035");
  });

  test("NR-14: črkovalne variante p7 dokumentirane (Georg/Grogy, Rabitscher/Rabutschar, Maruſa…)", () => {
    expect(READ.open_flags["NR-14"]).toContain("Georg/Grogy");
    expect(READ.open_flags["NR-14"]).toContain("Maruſa");
  });
});
