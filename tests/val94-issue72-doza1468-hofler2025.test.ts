/**
 * Val 94 — ISSUE #72, točki 17/22: DOZA/1468 — razrešitev prve podnaloge
 * (»ugotoviti, kaj natančno pomeni oznaka DOZA v tem zapisu«).
 *
 * Ozadje: kuratorski zapis v issue #72 (točki 17 in 22) navaja Höflerjevo
 * historično topografijo predjožefinskih župnij: pri podružnični cerkvi
 * sv. Vida v Gribljah zapis »Griblach, 1468 21/9; DOZA«, z nalogo:
 * (a) ugotoviti, kaj pomeni oznaka DOZA;
 * (b) najti arhivsko signaturo/listino za 21. 9. 1468;
 * (c) ločiti omembo cerkve, omembo kraja in morebitno mejno referenco.
 *
 * Izvedba (94. val): peer-reviewirana znanstvena monografija SAZU
 * (Höfler, Razprave I. razreda SAZU 44, Ljubljana 2025, recenzenta
 * R. Bratož in P. Štih, DOI 10.3986/9789612681135, open access DiRROS)
 * prenešena in prebrana (PDF 394 str.):
 *   - str. 21: DOZA = Deutschordenszentralarchiv, Dunaj/Wien — centralni
 *     arhiv nemškega viteškega reda; »posnetki listin dosegljivi na
 *     internetni bazi MOM«;
 *   - str. 381: podružnica (4) sv. Vida v Gribljah — »(Griblach, 1468 21/9;
 *     DOZA). Baročna (18. stol.).« + cerkvene omembe (1526, 1689, 1753,
 *     1771) → 1468 je prva omemba KRAJA, cerkev izpričana od 1526;
 *   - str. 367: listina 1468 21/9 = ustanovitev beneficij pri oltarjih
 *     sv. Jakoba in sv. Jurija »kot tudi pri olt. sv. Andreja« pri
 *     sv. Nikolaju v Metliki (DOZA; IMK 1896, 228) — isti darovalci
 *     (Katter) kot Arnoldov regest št. 3971 (val 24); istovetnost = REVIEW;
 *   - str. 380: župnija sv. Martina v Podzemlju 1268 16/1 posredno prek
 *     Črnomlja inkorporirana nemškemu viteškemu redu v Ljubljani — razlog,
 *     zakaj listine tega dela Bele krajine hranijo redovni arhiv na Dunaju.
 *
 * Arhivska signatura dunajskega izvornika ostaja TO_COLLECT
 * (MOM/monasterium.net v peskovniku Cloudflare-blokirana; agent-browser
 * ne preide izziva; iskalni indeksi brez zadetkov po natančnem nizu).
 *
 * Varovalke:
 *  1. Nov vir sazu-histtop-2025 izključno na MVG-002 (DOI, str. 21/367/380/
 *     381, IMK 1896, statusi REVIEW + TO_COLLECT).
 *  2. Zgodba MVG-002 (sl+en): DOZA razložena, separacija omemba-kraja (1468)
 *     / omemba-cerkve (1526), MOM/Monasterium, REVIEW identifikacija,
 *     TO_COLLECT signatura, kontekst tevtonske inkorporacije 1268.
 *  3. Poštenost: cerkev ostaja prvič zapisana 1526 (zapis petstoletnice
 *     ostaja zvest); 1468 = prva omemba kraja (ta ostaja na MVG-001).
 *  4. MVG-001 (weiss-2018-castite-vas): dopolnilo 94. val (točen datum
 *     21. 9. 1468 + DOZA) — podroben vir samo na MVG-002 (brez podvajanja).
 *  5. +1 vir (608 → 609), +1 identiteta (487 → 488), +0 zapisov (114),
 *     +0 deljenih (68), +0 KG / +0 ATLAS (§22) — izrecen prehod.
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

function byMuseumNo(no: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === no);
  if (!ex) throw new Error(`zapis ${no} ne obstaja`);
  return ex;
}

describe("val94 — nov vir sazu-histtop-2025 (izključno MVG-002)", () => {
  const cerkev = byMuseumNo("MVG-002");
  const src = cerkev.sources.find((s) => s.key === "sazu-histtop-2025");

  test("vir obstaja na MVG-002 z bibliografijo SAZU 2025 + DOI + open access", () => {
    expect(src).toBeDefined();
    expect(src!.nameSi).toContain("Höfler");
    expect(src!.nameSi).toContain("Historična topografija predjožefinskih župnij");
    expect(src!.nameSi).toContain("Razprave I. razreda SAZU 44");
    expect(src!.nameSi).toContain("2025");
    expect(src!.nameSi).toContain("Bratož");
    expect(src!.nameSi).toContain("10.3986/9789612681135");
    expect(src!.url).toBe("https://doi.org/10.3986/9789612681135");
    expect(src!.license).toContain("open access");
    expect(src!.sourceType).toBe("objava");
  });

  test("opomba nosi razlago DOZA (Deutschordenszentralarchiv) + str. 21/367/380/381", () => {
    expect(src!.noteSi).toContain("Deutschordenszentralarchiv");
    expect(src!.noteSi).toContain("nemškega viteškega reda");
    expect(src!.noteSi).toContain("str. 21");
    expect(src!.noteSi).toContain("str. 367");
    expect(src!.noteSi).toContain("str. 380");
    expect(src!.noteSi).toContain("str. 381");
    expect(src!.noteSi).toContain("(Griblach, 1468 21/9; DOZA)");
    expect(src!.noteSi).toContain("IMK 1896, 228");
    expect(src!.noteSi).toContain("1268 16/1");
    expect(src!.noteEn).toContain("Deutschordenszentralarchiv");
    expect(src!.noteEn).toContain("p. 381");
  });

  test("poštenost v opombi: istovetnost z Arnoldovim regestom = REVIEW; signatura = TO_COLLECT", () => {
    expect(src!.noteSi).toContain("REVIEW");
    expect(src!.noteSi).toContain("3971");
    expect(src!.noteSi).toContain("TO_COLLECT");
    expect(src!.noteSi).toContain("monasterium.net");
    expect(src!.noteEn).toContain("REVIEW");
    expect(src!.noteEn).toContain("TO_COLLECT");
  });
});

describe("val94 — zgodba MVG-002: DOZA/1468 ločuje, kar je treba ločiti", () => {
  const cerkev = byMuseumNo("MVG-002");

  test("sl zgodba: DOZA razložena, MOM/Monasterium, točen datum 21. 9. 1468", () => {
    expect(cerkev.storySi).toContain("Deutschordenszentralarchiv");
    expect(cerkev.storySi).toContain("MOM/Monasterium");
    expect(cerkev.storySi).toContain("»Griblach, 1468 21/9«");
    expect(cerkev.storySi).toContain("21. 9. 1468");
    expect(cerkev.storySi).toContain("sv. Nikolaju v Metliki");
    expect(cerkev.storySi).toContain("Bernard Katter");
  });

  test("separacija: 1468 = prva omemba kraja; cerkev izpričana od 1526 (sl+en)", () => {
    expect(cerkev.storySi).toContain("letnica 1468 v oklepaju je prva omemba kraja");
    expect(cerkev.storySi).toContain("prva dokumentirana omemba cerkve torej ostaja 1526");
    expect(cerkev.storyEn).toContain("the year 1468 in parentheses is the first mention of the place");
    expect(cerkev.storyEn).toContain("the church's first documented mention therefore remains 1526");
  });

  test("kontekst tevtonske inkorporacije 1268 (razlog za dunajski arhiv), sl+en", () => {
    expect(cerkev.storySi).toContain("nemškemu viteškemu redu v Ljubljani posredno prek Črnomlja inkorporirana");
    expect(cerkev.storyEn).toContain("incorporated to the Teutonic Order in Ljubljana");
  });

  test("REVIEW identifikacija + TO_COLLECT signatura v zgodbi (sl+en)", () => {
    expect(cerkev.storySi).toContain("ostaja REVIEW");
    expect(cerkev.storySi).toContain("Arhivska signatura dunajskega izvornika zaenkrat ni poznana (TO_COLLECT)");
    expect(cerkev.storyEn).toContain("remains REVIEW");
    expect(cerkev.storyEn).toContain("not yet known (TO_COLLECT)");
  });

  test("petstoletnica ostaja zvesta: cerkev 1526 na MVG-002 in MVG-013 (petstoletnica-2026)", () => {
    expect(cerkev.storySi).toContain("cerkev je prvič zapisana v listinah leta 1526");
    const pet = seedExhibits.find((e) => e.slug === "petstoletnica-2026");
    expect(pet).toBeDefined();
    expect(pet!.storySi).toContain("Leta 1526 se je cerkev sv. Vida prvič zapisala v listine");
    expect(pet!.storyEn).toContain("In 1526 the church of St. Vitus entered the written record for the first time");
  });
});

describe("val94 — MVG-001: dopolnilo opombe weiss-2018-castite-vas (brez podvajanja)", () => {
  const vas = byMuseumNo("MVG-001");
  const src = vas.sources.find((s) => s.key === "weiss-2018-castite-vas");

  test("opomba sl: 94. val — datum 21. 9. 1468 + DOZA; podroben vir samo na MVG-002", () => {
    expect(src).toBeDefined();
    expect(src!.noteSi).toContain("94. val");
    expect(src!.noteSi).toContain("listina 21. 9. 1468");
    expect(src!.noteSi).toContain("Deutschordenszentralarchivu (DOZA)");
    expect(src!.noteSi).toContain("SAZU 2025");
    expect(src!.noteSi).toContain("(MVG-002)");
    expect(src!.noteEn).toContain("Wave 94");
    expect(src!.noteEn).toContain("21 September 1468");
    expect(src!.noteEn).toContain("Deutschordenszentralarchiv (DOZA)");
  });
});

describe("val94 — izrecen prehod števcev (ne tih)", () => {
  test("številke vala 94 (+1 vir 608→609, +1 identiteta 487→488): nato val 95 zakonito dodal +7 virov (COBISS poročila + Memento)", () => {
    // varovalka vala 94 je zahtevala točno 609/488; val 95 je po protokolu
    // issue-ja #72 (vsebinska poročila raziskovalnih kod) zakonito dodal
    // 6 primarnih poročil na MVG-083 in Memento 2026 na MVG-003 (+7/+7).
    expect(seedExhibits.length).toBe(114);
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    expect(virov).toBeGreaterThanOrEqual(609);
    expect(SOURCE_USAGE.size).toBeGreaterThanOrEqual(488);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    expect(deljenih).toBeGreaterThanOrEqual(68);
  });

  test("+0 KG / +0 ATLAS (§22): novi vir citiran izključno na MVG-002", () => {
    const cerkev = byMuseumNo("MVG-002");
    const src = cerkev.sources.find((s) => s.key === "sazu-histtop-2025")!;
    const key = sourceKeyOf(src.nameSi, src.url ?? null);
    const u = SOURCE_USAGE.get(key);
    expect(u).toBeDefined();
    expect(u!.exhibits.length).toBe(1);
    expect(u!.exhibits.every((e) => e.slug === "sveti-vid")).toBe(true);
  });
});
