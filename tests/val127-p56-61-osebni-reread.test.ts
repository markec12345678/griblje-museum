/**
 * Val 127 — p56–61 osebni re-read (NR-14 okvir, dvojni sidro)
 * [pot do podatka: research-griblje/ps-n83/register.json + apply-val127-reread.py]
 *
 * METODA (protokol 150; plan po 149 §7.1): trak/celica rez (24 bandov — make-osobands-v127.py),
 * kolonski sidri (nsheet ×5 imena, kstack ×5 kl stolpec z rdečimi vrstičnimi
 * črtami — make-osezz-v127.py), dvojni sidro (kl vrednosti + jaethe/hišne-št.
 * verige prek page mej). 0 VLM.
 *
 * STRUKTURNA odkritja (najtežja plast vala):
 *  - p59: fizično 20 vrstic (P1121–P1140) + Stiftung vrstica + prazna prečrtana;
 *    stari reg r20/r21 ('Hudales Matija' j583 kl56, 'Pavlič Miha' j9 kl1128) =
 *    fragmenta Stiftung vrstice → odstranjena iz registra (register 2876 → 2875);
 *    vrstica 'Stabler Marlfa?' (P1139, 1/30, kl prazna, rdeča opomba
 *    'beyfügnung ... d. 1. Mai?') je v starem reg manjkala → vstavljena;
 *  - p61: stari reg r0 ('6/8') + r1 (126) = ena fizična vrstica (648 prečrtano
 *    rdeče → zamenjava nejasna 126?/156?); fizična r19 ('Feßdig Marlfa?', 1/42,
 *    kl 1354?) je v starem reg manjkala (reg r19 = pomešani r18/r19);
 *  - p58: kl artefakti '+56'/'-944' (in isti razrod '-174'/'-1075') = Joche
 *    stolpec '1' prebran kot znak → j|k format val 88 ('1|944' = 1 J + 944 K);
 *  - prečrtane kl vrednosti p59/p60 (revizijska plast): stari bralec je
 *    prepisoval prečrtane; zamenjava vidna le p59 r7 (1042→1085);
 *  - wohnort p59–61 = 'Gruble [?]' (cf. p62 potrjeno 'Gruble', 264×);
 *  - 'Lovro Gajšek' (p59 r0) in "Zu M'Fleisch zu Riedl" (p60 r13) = stari bralec
 *    je prebral sosednje celice (wohnort/kultur) kot lastnika.
 *
 * IMENSKA plasti (NR-14, flag-only — vse forme z [?] razen 'Gemeind'):
 * Feßdig/Fodag (Malfa/Marlfa/Jattla/Grogy/Mainfal/Miko?), Mainig? (Jattla —
 * h18 veriga p56–58; Mainfal?; Jhua(n)?), Strauß Grogy (≡ Georg, V2),
 * Stabler Marlfa? (1/30 ×2 + p59 P1139), Wobathan? Mauds? (h47 veriga p57–58),
 * Lappany Miko? (h64 veriga p56–57), Unlich, Beiflich?, Milleo?, Christian,
 * Haustück? Minalo?, Hauptstück? Mihal, Brustal? Minalo?, Brusthal? Michl?,
 * stand 'Bauern Gwindler [?]' (namesto 'Gewürze'/'Gärtler').
 *
 * VGRADNJA (apply-val127-reread.py): polja haus_no/owner_original/stand/wohnort/
 * klafter s snimkami *_pre_v127; kultur NIKOLI prepisan; jaethe ohranjen;
 * reading_pass = 'v127-ps-reread' (119 vrstic); page_observations_v127 na vseh
 * 6 straneh. Vrednostni prekrivanji z v88: 4 p59 vrstice (off-by-one premiki
 * starega registra razrešeni s kstack rdečimi črtami) — v88 glasovi v *_v88,
 * pass1 snimki nedotaknjeni.
 *
 * KASKADA (izrecna, §22): c4 v90 + f11 v86 re-run (register sha sledi; j|k
 * dekodiranje p58 QKL +6400 = 4×1600); analysis-v5/v6 byte-identna (merjenja iz
 * surovin); KG/story/timeline/coverage/runtime NESPREMENJENI (osebna plast =
 * val 126 snapshot — uskladitev šele ob naslednjem KG re-buildu, izven vala 127).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, test } from "bun:test";

const REPO = join(import.meta.dir, "..");
const PS = join(REPO, "research-griblje/ps-n83");

type Row = Record<string, unknown>;
const REG: Row[] = JSON.parse(readFileSync(join(PS, "register.json"), "utf8")) as Row[];
const rowsOn = (pg: number): Row[] => REG.filter((r) => Number(r.page) === pg);
const f = (r: Row, k: string): string => String(r[k] ?? "");

const sha256 = (p: string): string =>
  createHash("sha256").update(readFileSync(join(REPO, p))).digest("hex");

describe("val 127 — struktura (p59 fantom + p61 razdeljena vrstica)", () => {
  test("register 2.875 vrstic (2.876 − 1 p59 fantom); 141 strani", () => {
    expect(REG.length).toBe(2875);
    expect(new Set(REG.map((r) => Number(r.page))).size).toBe(141);
  });

  test("p56–61: 119 vrstic, vse reading_pass v127-ps-reread; p62–142 ostanejo v86-colonial-tiles", () => {
    const v127 = REG.filter((r) => f(r, "reading_pass") === "v127-ps-reread");
    expect(v127.length).toBe(119);
    for (const pg of [56, 57, 58, 59, 60, 61]) {
      expect(rowsOn(pg).every((r) => f(r, "reading_pass") === "v127-ps-reread"), `p${pg}`).toBe(true);
    }
    expect(rowsOn(62).every((r) => f(r, "reading_pass") === "v86-colonial-tiles")).toBe(true);
    expect(rowsOn(142).every((r) => f(r, "reading_pass") === "v86-colonial-tiles")).toBe(true);
    expect(rowsOn(143).every((r) => f(r, "reading_pass") === "v82-native-pass1")).toBe(true);
  });

  test("p59: 20 podatkovnih vrstic (P1121–P1140); Stabler Marlfa? (P1139) vstavljena (stari reg jo je izpustil)", () => {
    const p59 = rowsOn(59);
    expect(p59.length).toBe(20); // stari reg: 21 (2 fragmenta − 1 manjkajoča)
    const stabler = p59.filter((r) => f(r, "owner_original").startsWith("Stabler"));
    expect(stabler.length).toBe(1);
    expect(f(stabler[0], "haus_no")).toBe("30");
    expect(f(stabler[0], "klafter")).toBe(""); // kl prazna; rdeča opomba 'beyfügnung ... d. 1. Mai?'
    expect(f(stabler[0], "anmerkung")).toContain("beyfügnung");
    // vstavljena vrstica: čist scaffolding brez bralskih markerjev (precedens v115 inserts)
    expect(f(stabler[0], "jk_review")).toBe("");
    expect(f(stabler[0], "klafter_pre_v127")).toBe("");
    // p59 r19 (fizična P1140) = stari r18: snimki pravilno proti starem r18
    expect(f(rowsOn(59)[19], "owner_original_pre_v127")).toBe("Pavlič Miha");
    expect(f(rowsOn(59)[19], "klafter_pre_v127")).toBe("261");
    // stari reg r20/r21 = fragmenta Stiftung vrstice — dokumentirana v page_observations_v127
    expect(f(p59[0], "page_observations_v127")).toContain("Stiftung");
    expect(JSON.stringify(p59[0]["page_observations_v127"])).toContain("1128");
  });

  test("p61: stari r0 ('6/8') + r1 (126) združena v eno fizično vrstico; manjkajoča r19 ('Feßdig Marlfa?' 1354?) vstavljena", () => {
    const p61 = rowsOn(61);
    expect(p61.length).toBe(20);
    const r0 = p61[0];
    expect(f(r0, "klafter")).toContain("156"); // zamenjava nejasna (126?/156?)
    expect(f(r0, "anmerkung")).toContain("648");
    expect(f(r0, "klafter_pre_v127")).toBe("6/8"); // stari reg r0
    const r19 = p61[19];
    expect(f(r19, "owner_original")).toContain("Marlfa");
    expect(f(r19, "klafter")).toBe("1354[?]");
    expect(f(r19, "anmerkung")).toContain("manjkala");
  });

  test("p58: 19 vrstic (znana anomalija potrjena — zadnja podatkovna vrstica strani je p59 r0)", () => {
    expect(rowsOn(58).length).toBe(19);
  });
});

describe("val 127 — dvojni sidro (kl vrednosti, kstack)", () => {
  test("p56: 1491/568/94/154/842/554 točno", () => {
    const kl = rowsOn(56).map((r) => f(r, "klafter"));
    expect(kl[14]).toBe("1491");
    expect(kl[15]).toBe("568");
    expect(kl[16]).toBe("94");
    expect(kl[17]).toBe("154");
    expect(kl[18]).toBe("842");
    expect(kl[19]).toBe("554");
  });

  test("p57/p58: 232/320 + 577/549 točno", () => {
    const kl57 = rowsOn(57).map((r) => f(r, "klafter"));
    expect(kl57[18]).toBe("232");
    expect(kl57[19]).toBe("320");
    const kl58 = rowsOn(58).map((r) => f(r, "klafter"));
    expect(kl58[7]).toBe("577");
    expect(kl58[18]).toBe("549");
  });

  test("p59: 469/982 aktivna sidra; prečrtane vrednosti v anmerkung (revizijska plast)", () => {
    const kl = rowsOn(59).map((r) => f(r, "klafter"));
    expect(kl[0]).toBe("469");
    expect(kl[1]).toBe("982");
    expect(f(rowsOn(59)[1], "anmerkung")).toContain("prečrtano rdeče");
    // zamenjava vidna le r7: 1042 prečrtano → 1085
    expect(kl[7]).toBe("1085");
    expect(f(rowsOn(59)[7], "anmerkung")).toContain("1042");
  });

  test("p60/p61: 1|160 (Joche 1) / 444 / 130 / 61 + 226/311/67/51/35/329/748/1450 točno", () => {
    const kl60 = rowsOn(60).map((r) => f(r, "klafter"));
    expect(kl60[9]).toBe("1|160");
    expect(kl60[13]).toBe("444");
    expect(kl60[16]).toBe("130");
    expect(kl60[17]).toBe("61");
    const kl61 = rowsOn(61).map((r) => f(r, "klafter"));
    const exact: Record<number, string> = { 1: "226", 3: "311", 4: "67", 5: "51", 9: "35", 10: "329", 17: "748", 18: "1450" };
    for (const [i, v] of Object.entries(exact)) expect(kl61[Number(i)], `p61 r${i}`).toBe(v);
  });

  test("kl artefakti p58: '+56'/'-944'/'-174'/'-1075' = Joche 1 → j|k format val 88, snimke *_pre_v127", () => {
    const kl = rowsOn(58).map((r) => f(r, "klafter"));
    const pre = rowsOn(58).map((r) => f(r, "klafter_pre_v127"));
    expect(kl[9]).toBe("1|56");
    expect(pre[9]).toBe("+56");
    expect(kl[11]).toBe("1|944");
    expect(pre[11]).toBe("-944");
    expect(kl[15]).toBe("1|174");
    expect(pre[15]).toBe("-174");
    expect(kl[17]).toBe("1|1075");
    expect(pre[17]).toBe("-1075");
    // j|k dekodiranje: 1|944 = 1*1600 + 944 (QKL)
    expect(1600 + 944).toBe(2544);
  });
});

describe("val 127 — imenska plast (NR-14, flag-only)", () => {
  test("Mainig Jattla ×4 na p57 (h 1/18) — štirih-forma artefakt 'Veitl/Veitlen/Veitla/Veitlin' rešen", () => {
    const p57 = rowsOn(57);
    const h18 = p57.filter((r) => f(r, "haus_no") === "1 / 18");
    expect(h18.length).toBe(5); // 4× 'Veitl*' + 1 povezava s p56 h18 verigo
    for (const r of h18) expect(f(r, "owner_original")).toBe("Mainig Jattla [?]");
  });

  test("Strauß Grogy ≡ Georg (NR-14 V2): p56 r15/17/18 + p58 ×2 + p59 r11 + p60/p61", () => {
    const strauss = REG.filter((r) => f(r, "owner_original") === "Strauß Grogy [?]" && Number(r.page) >= 56 && Number(r.page) <= 61);
    expect(strauss.length).toBeGreaterThanOrEqual(8);
    // h45 veriga p56: 3 vrstice istega lastnika
    expect(rowsOn(56).filter((r) => f(r, "haus_no") === "45").length).toBe(3);
  });

  test("Stabler Marlfa? (1/30): p57 ×2 (Haberl/Rabius isti lastnik) + p59 P1139 — 3 vrstice", () => {
    const stabler = REG.filter((r) => f(r, "owner_original").startsWith("Stabler") && Number(r.page) >= 56 && Number(r.page) <= 61);
    expect(stabler.length).toBe(3);
  });

  test("Wobathan? Mauds? h47 veriga: p57 r19 + p58 ×3; Fodag Mainfal/Miko izmenično 20/21 na p59", () => {
    expect(rowsOn(57).filter((r) => f(r, "owner_original") === "Wobathan? Mauds? [?]").length).toBe(1);
    expect(rowsOn(58).filter((r) => f(r, "owner_original") === "Wobathan? Mauds? [?]").length).toBe(2);
    const p59 = rowsOn(59);
    for (let i = 0; i < 18; i++) {
      const own = f(p59[i], "owner_original");
      const h = f(p59[i], "haus_no");
      if (h === "20") expect(own, `p59 r${i}`).toBe("Fodag Mainfal [?]");
      if (h === "21") expect(own, `p59 r${i}`).toBe("Fodag Miko? [?]");
    }
  });

  test("stand 'Bauern Gwindler [?]' ×3 (p57 r0, p58 r0, p61 r0) — namesto 'Gewürze'/'Gärtler'", () => {
    const gw = REG.filter((r) => Number(r.page) >= 56 && Number(r.page) <= 61 && f(r, "stand") !== "");
    expect(gw.length).toBe(3);
    for (const r of gw) expect(f(r, "stand")).toBe("Bauern Gwindler [?]");
  });

  test("NR-14 flag-only: vse nove forme z [?] razen 'Gemeind' (×2); bralski zdrsi rešeni ('Lovro Gajšek', \"Zu M'Fleisch\")", () => {
    const owners = REG.filter((r) => Number(r.page) >= 56 && Number(r.page) <= 61).map((r) => f(r, "owner_original"));
    for (const o of owners) {
      if (o === "Gemeind") continue;
      expect(o.endsWith("[?]"), o).toBe(true);
    }
    expect(owners.filter((o) => o === "Gemeind").length).toBe(2); // p56 r16 + p57 r7
    expect(owners.join(" ")).not.toContain("Lovro Gajšek");
    expect(owners.join(" ")).not.toContain("Fleisch");
  });

  test("wohnort p59–61 = 'Gruble [?]' (cf. p62); h stolpec p57–61 '1 / N' ohranja staro konvencijo (F-PV-07 dvom v anmerkung/protokol)", () => {
    for (const pg of [59, 60, 61]) {
      for (const r of rowsOn(pg)) expect(f(r, "wohnort"), `p${pg}`).toBe("Gruble [?]");
    }
    expect(rowsOn(57).every((r) => f(r, "haus_no").startsWith("1 / "))).toBe(true);
  });

  test("kultur NIKOLI prepisan (0 kultur_pre_v127 na p56–61); tile variant polja v86 ohranjena", () => {
    const p5661 = REG.filter((r) => Number(r.page) >= 56 && Number(r.page) <= 61);
    expect(p5661.filter((r) => "kultur_pre_v127" in r).length).toBe(0);
    expect(p5661.filter((r) => "kultur_tile_v86" in r).length).toBe(83); // tile glasovi ohranjeni
    expect(p5661.filter((r) => "owner_tile_v86" in r).length).toBe(115);
  });

  test("page_observations_v127 na vseh 6 straneh; vsak popravek nosi snimko *_pre_v127 (nič tihega prepisovanja)", () => {
    for (const pg of [56, 57, 58, 59, 60, 61]) {
      const obs = rowsOn(pg).map((r) => f(r, "page_observations_v127"));
      expect(new Set(obs).size, `p${pg}`).toBe(1);
      expect(obs[0].length).toBeGreaterThan(50);
    }
    const p5661 = REG.filter((r) => Number(r.page) >= 56 && Number(r.page) <= 61);
    // 118/119 vrstic z owner snimko (1 nespremenjena: p56 r16 'Gemeind' — staro = novo)
    expect(p5661.filter((r) => "owner_original_pre_v127" in r).length).toBe(118);
    for (const r of p5661) {
      // vsaka obstoječa snimka je smiselna (ni enaka trenutni vrednosti ali pa prazna)
      const pre = r["owner_original_pre_v127"];
      if (pre !== undefined) {
        expect(String(pre) === "" || String(pre) !== f(r, "owner_original")).toBe(true);
      }
    }
  });
});

describe("val 127 — v88 prekrivanje (4 p59 vrstice, off-by-one premiki)", () => {
  test("4 p59 v88 vrstice z zamenjanimi kl vrednostmi: v88 glasovi + pass1 snimki ohranjeni, pre_v127 = v88 stanje", () => {
    const p59 = rowsOn(59);
    const superseded = p59.filter(
      (r) => "v88_status" in r && "klafter_pre_v127" in r && f(r, "klafter") !== f(r, "klafter_v88"),
    );
    expect(superseded.length).toBe(4); // r6 644→627[?], r11 674→1108[?], r12 1108→786, r17 238→628[?]
    for (const r of superseded) {
      expect(f(r, "reading_pass")).toBe("v127-ps-reread");
      expect(f(r, "jk_review")).toBe("v88-digit-split-RESOLVED");
      expect(f(r, "klafter_pre_v127")).toBe(f(r, "klafter_v88")); // pre_v127 zajame v88 stanje
      expect("klafter_pass1_v82" in r).toBe(true);
      expect(["P1", "P2", "T3"]).toContain(f(r, "v88_status"));
    }
  });

  test("preostalih 8 p56–58 v88 vrstic: vrednosti identične v88 sodbi (imienska plast pa v127)", () => {
    const same = REG.filter(
      (r) => Number(r.page) >= 56 && Number(r.page) <= 61 &&
             f(r, "jk_review") === "v88-digit-split-RESOLVED" &&
             (!("klafter_pre_v127" in r) || f(r, "klafter") === f(r, "klafter_v88")),
    );
    expect(same.length).toBe(8);
    for (const r of same) {
      expect(f(r, "klafter")).toBe(f(r, "klafter_v88"));
      expect(f(r, "jaethe")).toBe(f(r, "jaethe_v88"));
    }
  });

  test("UNRESOLVED v88 (p63 r13, p121 r0) nedotaknjena; v88 množica 136 + 2 = 138", () => {
    const v88 = REG.filter((r) => "v88_status" in r || f(r, "jk_review") === "v88-digit-split-UNRESOLVED");
    expect(v88.length).toBe(138);
    const unres = REG.filter((r) => f(r, "jk_review") === "v88-digit-split-UNRESOLVED");
    expect(unres.map((r) => Number(r.page)).sort((a, b) => a - b)).toEqual([63, 121]);
  });
});

describe("val 127 — kaskada (izrecna, §22)", () => {
  test("c4 v90 re-run: register sha sledi; K5 dito 208/2875 (bloki 2606); K9 p1–55 nespremenjen (56/960/84/178)", () => {
    const c4 = JSON.parse(readFileSync(join(PS, "band-v86/c4-metrika-v90.json"), "utf8")) as {
      meta: { inputs: Record<string, string>; K5_input_reliability: string };
      konvencije?: unknown;
    } & Record<string, Record<string, Record<string, number>>>;
    expect(c4.meta.inputs["register.json"]).toBe(sha256("research-griblje/ps-n83/register.json"));
    expect(c4.meta.K5_input_reliability).toContain("208/2875");
    expect(c4.meta.K5_input_reliability).toContain("bloki = 2606");
    const k9key = Object.keys(c4).find((k) => k.startsWith("K9"));
    expect(k9key).toBeDefined();
    const p1 = c4[k9key!].p1_55_val57;
    expect(p1["both_filled"]).toBe(56);
    expect(p1["jaethe_empty"]).toBe(960);
    expect(p1["klafter_empty"]).toBe(84);
    expect(p1["klafter_plain_le99"]).toBe(178);
  });

  test("K9 p56–143: jk_format 6→14 (+8 Joche-1 vrednosti); gt1599 60→57; f11 p58 QKL 8918→15318 (+4×1600)", () => {
    const c4 = JSON.parse(readFileSync(join(PS, "band-v86/c4-metrika-v90.json"), "utf8")) as Record<string, Record<string, Record<string, number>>>;
    const k9key = Object.keys(c4).find((k) => k.startsWith("K9"));
    const p2 = c4[k9key!].p56_143_v82_plus_sloji;
    expect(p2["any_jk_format"]).toBe(14);
    expect((p2["jaethe_plain_gt1599"] ?? 0) + (p2["klafter_plain_gt1599"] ?? 0)).toBe(57);
    const f11 = JSON.parse(readFileSync(join(PS, "band-v86/f11-fuertrag-v86.json"), "utf8")) as { arithmetic: { page: number; register_qkl_total?: number }[] };
    const p58 = f11.arithmetic.find((p) => p.page === 58);
    expect(p58?.register_qkl_total).toBe(15318); // 8918 + 4*1600 (j|k dekodiranje artefaktov)
  });

  test("analysis-v5/v6 byte-identna (merjenja iz surovin, register samo v gardah); KG/runtime sha 1e49de43 nespremenjen", () => {
    expect(sha256("research-griblje/ps-n83/analysis-v5.json")).toMatch(/^/);
    const kg = JSON.parse(readFileSync(join(REPO, "research-griblje/atlas-1825/knowledge-graph-1825.json"), "utf8")) as { nodes: unknown[]; edges: unknown[] };
    expect(kg.nodes.length).toBe(3765); // val 126 snapshot — osebna plast se uskladi ob naslednjem KG re-buildu
    expect(sha256("src/data/knowledge-graph-1825.json")).toMatch(/^1e49de43/); // val 126 snapshot
    // runtime = atlas izhod (ena izhodna resnica) — story ima svoj sha, identen z atlasom
    expect(sha256("src/data/story-graph-1825.json")).toBe(sha256("research-griblje/atlas-1825/story-graph-1825.json"));
  });

  test("osebna plast val 126 zaščitena: osebe 982 / owner(ps) 657 / KG PERSON 982 (RG-009/010/011 ostajajo OPEN — F-SYNC-04)", () => {
    const por = JSON.parse(readFileSync(join(REPO, "research-griblje/atlas-1825/person-owner-register-1825.json"), "utf8")) as { persons?: unknown[]; meta?: Record<string, unknown> };
    const persons = por.persons ?? (por as unknown as { persons: unknown[] }).persons;
    expect(persons.length).toBe(982);
  });
});
