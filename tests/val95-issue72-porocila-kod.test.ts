/**
 * Val 95 — ISSUE #72: vsebinska poročila raziskovalnih kod (2012–2014 + 21-0141)
 * — odkritje šestih doslej nezapisanih primarnih poročil prek COBISS.SI
 *   (legacy zapisi, prenešeni in prebrani) + bibliografska identiteta
 *   Memento 2026 (ISBN + izdajatelj PGD Griblje + knjižnična lokacija).
 *
 * Ozadje (worklog 94. vala, »naslednje« #3): »vsebinska poročila raziskovalnih
 * kod (2012–2014 + 21-0141) → REVIEW dvigi«. 95. val: sistematični pregled
 * kataloga COBISS.SI (iskanje po predmetni oznaki »Griblje«) je odkril in
 * bibliografsko potrdil:
 *   - Čaval & Mason 2004 — kanalizacija G 6 (Novo mesto: ZVNKD; SAZU zaloga),
 *   - Žerjal, Pintér & Mason 2010 — primarno poročilo parcele 15/3 (Štrucelj),
 *     ki VS 48 (2011, Nadbath/Žorž) samo povzame — avtorska nabora se razlikujeta,
 *   - Gutman 2012 — poročilo naravoslovnih preiskav EŠD 10094 (Restavratorski
 *     center) = prvo konkretno vsebinsko poročilo o EŠD 10094 v muzeju,
 *   - Udovč 2012 — Starašinič, parcela 251 k. o. Krasinec,
 *   - Černe 2022 — Brodarič, parcela 67/3, predhodna raziskava,
 *   - Udovč, Černe & Kramberger 2023 — Brodarič 67/3, izvedene raziskave
 *     = četrta raziskava 2023 poleg kod 23-0070/23-0168/23-0261, v zborniku NE.
 * Plus dopolnilo vira 21-0141 (Klepec–Krasinec, COBISS 66817539): uradna
 * predmetna označitev (gomile, naselja, plana grobišča), zaloga »nobena
 * knjižnica nima izvoda«, pot do vsebine = eDEDIŠČINA/ised.gov.si (javni API
 * deluje, ID zahteva eSDE prijavo) + ZVKDS CPA.
 * Memento 2026 (issue #72, točka 8): COBISS 281712899 — PGD Griblje,
 * ISBN 978-961-07-3422-2, izvod v čitalnici Slovenskega šolskega muzeja.
 *
 * Poštenost: vse vsebine ostajajo nepregledane (REVIEW/TO_COLLECT) — katalog
 * opisuje teme, ne najdb; muzej ne trdi nobene najdbe iz teh poročil.
 *
 * Varovalke:
 *  1. Šest novih virov na MVG-083 (bibliografija, zaloga, statusi).
 *  2. Predmetne označitve = teme, ne najdbe (REVIEW framing).
 *  3. Brodarič par 2022/2023 + četrta raziskava 2023 + ne-združevanje.
 *  4. Štrucelj 2010 primarno poročilo ≠ VS 48 (avtorja, vrste dokumentov).
 *  5. Doplnilo vira tiran-2021-klepec-krasinec (COBISS + ised pot + zaloga).
 *  6. Memento 2026 na MVG-003 (ISBN, PGD, SSMULJ čitalnica).
 *  7. Zgodbe sl+en: nov odstavek MVG-083 + dopolnilo MVG-003.
 *  8. Pošten negativ: nobena najdba ni tržena; ised ID-ji niso izumljeni.
 *  9. Izrecen prehod števcev: 114 zapisov / 616 virov / 495 identitet / 68 deljenih.
 * 10. Novi viri izključno eno-zapisni (6 × MVG-083, 1 × MVG-003).
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

function byMuseumNo(no: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === no);
  if (!ex) throw new Error(`zapis ${no} ne obstaja`);
  return ex;
}

const NOVI_KLJUCI_M83 = [
  "zvkds-caval-mason-2004-kanal-g6",
  "zvkds-zerjal-2010-strucelj",
  "zvkds-gutman-2012-naravoslovne",
  "zvkds-udovc-2012-starasinic",
  "zvkds-cerne-2022-brodaric",
  "zvkds-udovc-2023-brodaric",
] as const;

describe("val95 — šest novih primarnih poročil na MVG-083 (COBISS.SI)", () => {
  const naj = byMuseumNo("MVG-083");

  test("vseh šest novih virov obstaja na MVG-083", () => {
    for (const k of NOVI_KLJUCI_M83) {
      expect(naj.sources.find((s) => s.key === k)).toBeDefined();
    }
    // + tiran-2021 obstaja (dopljen)
    expect(naj.sources.find((s) => s.key === "tiran-2021-klepec-krasinec")).toBeDefined();
  });

  test("kanal G 6 (Čaval & Mason 2004): ZVNKD Novo mesto, SAZU zaloga, antika = oznaka teme", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-caval-mason-2004-kanal-g6")!;
    expect(s.nameSi).toContain("2004");
    expect(s.nameSi).toContain("kanal G 6");
    expect(s.nameSi).toContain("26805805");
    expect(s.nameSi).toContain("Zavod za varstvo naravne in kulturne dediščine");
    expect(s.noteSi).toContain("Saša Čaval in Phil Mason");
    expect(s.noteSi).toContain("SAZU");
    expect(s.noteSi).toContain("ni za izposojo");
    expect(s.noteSi).toContain("ne dokazuje rimskih najdb");
    expect(s.noteEn).toContain("does not prove Roman finds");
    expect(s.noteSi).toContain("VERIFIED bibliografska identiteta / REVIEW vsebina");
  });

  test("Štrucelj 15/3 (Žerjal, Pintér, Mason 2010): primarno poročilo predhaja VS 48, avtorja se razlikujeta", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-zerjal-2010-strucelj")!;
    expect(s.nameSi).toContain("2010");
    expect(s.nameSi).toContain("15/3");
    expect(s.nameSi).toContain("512475179");
    expect(s.noteSi).toContain("elaborat, študija");
    expect(s.noteSi).toContain("Tina Žerjal, Ildikó Pintér in Phil Mason");
    expect(s.noteSi).toContain("4.900 najdb");
    expect(s.noteSi).toContain("predhaja objavi VS 48 (2011)");
    expect(s.noteSi).toContain("(VS 48: Nadbath/Žorž; primarno poročilo: Žerjal/Pintér/Mason)");
    expect(s.noteSi).toContain("ZVKDS Ljubljana (RESCLJ)");
    expect(s.noteEn).toContain("the two author lists differ");
  });

  test("Gutman 2012: prvo konkretno vsebinsko poročilo o EŠD 10094 — okno 2012, kovinski predmeti = tema", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-gutman-2012-naravoslovne")!;
    expect(s.nameSi).toContain("2012");
    expect(s.nameSi).toContain("EŠD 10094");
    expect(s.nameSi).toContain("512737835");
    expect(s.nameSi).toContain("Restavratorski center");
    expect(s.noteSi).toContain("Maja Gutman");
    expect(s.noteSi).toContain("kovinski predmeti");
    expect(s.noteSi).toContain("prvo konkretno vsebinsko poročilo o EŠD 10094, ki ga muzej zabeleži");
    expect(s.noteSi).toContain("opisuje temo, ne najdb");
    expect(s.noteSi).toContain("v čitalnico 2 izvoda");
    expect(s.noteEn).toContain("the start of the 2012–2014 span");
  });

  test("Starašinič (Udovč 2012): parcela v k. o. Krasinec, brez interpretacije lokacije", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-udovc-2012-starasinic")!;
    expect(s.nameSi).toContain("2012");
    expect(s.nameSi).toContain("251");
    expect(s.nameSi).toContain("512698923");
    expect(s.noteSi).toContain("Katarina Udovč");
    expect(s.noteSi).toContain("k. o. Krasinec");
    expect(s.noteSi).toContain("muzej ne interpretira naprej brez vsebine");
    expect(s.noteEn).toContain("does not interpret the parcel's location further");
  });

  test("Brodarič 2022 (Černe): plano grobišče = katalogizacijska označitev teme, ne najdbe", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-cerne-2022-brodaric")!;
    expect(s.nameSi).toContain("2022");
    expect(s.nameSi).toContain("67/3");
    expect(s.nameSi).toContain("121330947");
    expect(s.noteSi).toContain("Mija Černe");
    expect(s.noteSi).toContain("plano grobišče");
    expect(s.noteSi).toContain("NE potrjenih najdb");
    expect(s.noteEn).toContain("NOT confirmed finds");
  });

  test("Brodarič 2023 (Udovč, Černe, Kramberger): izvedene raziskave — četrta raziskava 2023, v zborniku NE", () => {
    const s = naj.sources.find((x) => x.key === "zvkds-udovc-2023-brodaric")!;
    expect(s.nameSi).toContain("2023");
    expect(s.nameSi).toContain("161615619");
    expect(s.noteSi).toContain("Bine Kramberger");
    expect(s.noteSi).toContain("četrta raziskava leta 2023");
    expect(s.noteSi).toContain("23-0070");
    expect(s.noteSi).toContain("v zborniku NE navajena");
    expect(s.noteSi).toContain("TO_COLLECT");
    expect(s.noteEn).toContain("a fourth research project of 2023");
  });
});

describe("val95 — dopolnilo vira 21-0141 (Klepec–Krasinec): COBISS + ised pot + zaloga", () => {
  const naj = byMuseumNo("MVG-083");
  const s = naj.sources.find((x) => x.key === "tiran-2021-klepec-krasinec")!;

  test("doplnilo 95. vala: uradna predmetna označitev = teme, ne najdbe", () => {
    expect(s.noteSi).toContain("Doplnilo 95. vala");
    expect(s.noteSi).toContain("66817539");
    expect(s.noteSi).toContain("elaborat, študija");
    expect(s.noteSi).toContain("gomile, naselja, prazgodovinske arheološke ostaline, plana grobišča");
    expect(s.noteSi).toContain("teme poročila po katalogizaciji, NE najdbe");
    expect(s.noteEn).toContain("Supplement of Wave 95");
    expect(s.noteEn).toContain("NOT finds");
  });

  test("poštenost: nobena knjižnica nima izvoda; poti = ised.gov.si + ZVKDS CPA; eSDE prijava", () => {
    expect(s.noteSi).toContain("nobena knjižnica v sistemu COBISS.SI nima izvoda tega gradiva");
    expect(s.noteSi).toContain("eDEDIŠČINA (ised.gov.si)");
    expect(s.noteSi).toContain("zahteva prijavo na poklicni portal eSDE");
    expect(s.noteSi).toContain("Center za preventivno arheologijo");
    expect(s.noteEn).toContain("no library in the COBISS.SI system holds a copy");
    expect(s.noteEn).toContain("requires a login to the professional eSDE portal");
  });

  test("102. val: vsebina PREBRANA (REVIEW razrešen); URL vira ostaja ZRC IZA (bibliografski izvor) [pin posodobljen 102. val]", () => {
    // 102. val: poročilo 21-0141 prebrano v celoti (javni eSDE prenos 29033) — status REVIEW vsebina → VERIFIED vsebina
    expect(s.noteSi).toContain("Doplnilo 102. vala");
    expect(s.noteSi).toContain("PREBRANO v celoti");
    expect(s.noteSi).not.toContain("CONTENT NOT FOUND");
    expect(s.url).toBe("https://iza2.zrc-sazu.si/sites/default/files/2021%20IZA.pdf");
  });
});

describe("val95 — Memento 2026 (issue #72, točka 8): bibliografska identiteta + lokacija izvoda", () => {
  const jub = byMuseumNo("MVG-003");
  const s = jub.sources.find((x) => x.key === "cobiss-memento-2026")!;

  test("vir na MVG-003: ISBN + PGD Griblje + COBISS.SI-ID", () => {
    expect(s).toBeDefined();
    expect(s.nameSi).toContain("978-961-07-3422-2");
    expect(s.nameSi).toContain("Prostovoljno gasilsko društvo");
    expect(s.nameSi).toContain("281712899");
    expect(s.url).toBe("https://plus-legacy.cobiss.net/cobiss/si/sl/bib/281712899");
  });

  test("opomba: zaloga SSMULJ čitalnica = prva javno dostopna lokacija; vsebina TO_COLLECT", () => {
    expect(s.noteSi).toContain("Slovenski šolski muzej, Ljubljana (SSMULJ)");
    expect(s.noteSi).toContain("v čitalnico 1 izvod");
    expect(s.noteSi).toContain("prva znana javno dostopna knjižnična lokacija izvoda");
    expect(s.noteSi).toContain("TO_COLLECT");
    expect(s.noteSi).toContain("VERIFIED");
    expect(s.noteEn).toContain("Slovenian School Museum");
    expect(s.noteEn).toContain("TO_COLLECT");
  });

  test("zgodba MVG-003 (sl+en): knjižnična identiteta + čitalnica muzeja", () => {
    expect(jub.storySi).toContain("dal še uradno bibliografsko identiteto");
    expect(jub.storySi).toContain("978-961-07-3422-2");
    expect(jub.storySi).toContain("Slovenskega šolskega muzeja v Ljubljani");
    expect(jub.storyEn).toContain("official bibliographic identity");
    expect(jub.storyEn).toContain("reading room of the Slovenian School Museum");
  });
});

describe("val95 — zgodba MVG-083: nov odstavek o primarnih poročilih (sl+en)", () => {
  const naj = byMuseumNo("MVG-083");

  test("sl: šest identitet, 2004 → 2010 → 2012 → 2022/2023, statusi posamično", () => {
    expect(naj.storySi).toContain("Zapis po zapisu v COBISS.SI je odkril šest doslej nezapisanih bibliografskih identitet");
    expect(naj.storySi).toContain("kanalizacije G 6");
    expect(naj.storySi).toContain("Tina Žerjal, Ildikó Pintér in Phil Mason");
    expect(naj.storySi).toContain("Maja Gutman");
    expect(naj.storySi).toContain("Starašinič na parceli 251");
    expect(naj.storySi).toContain("hiša Brodarič");
    expect(naj.storySi).toContain("četrta raziskava leta 2023");
    expect(naj.storySi).toContain("nobena knjižnica v sistemu COBISS.SI nima izvoda");
    expect(naj.storySi).toContain("eDEDIŠČINA (ised.gov.si)");
  });

  test("poštenost v zgodbi: bibliografske identitete VERIFIED, vsebine REVIEW — nobena najdba", () => {
    expect(naj.storySi).toContain("bibliografske identitete VERIFIED, vsebine REVIEW");
    expect(naj.storySi).toContain("muzej ne trdi nobene najdbe iz teh poročil, dokler jih ne prebere");
    expect(naj.storyEn).toContain("bibliographic identities VERIFIED, contents REVIEW");
    expect(naj.storyEn).toContain("claims no finds from these reports until it reads them");
  });

  test("en: odkritje prek COBISS + vsa imena + ised pot", () => {
    expect(naj.storyEn).toContain("Record by record, COBISS.SI revealed six bibliographic identities");
    expect(naj.storyEn).toContain("channel G 6");
    expect(naj.storyEn).toContain("Maja Gutman");
    expect(naj.storyEn).toContain("eDEDIŠČINA evidence system (ised.gov.si)");
  });
});

describe("val95 — izrecen prehod števcev (ne tih)", () => {
  test("številke vala 95 (+7 virov 609→616, +7 identitet 488→495): nato val 96 zakonito dodal +1 vir (UL 1996)", () => {
    // varovalka vala 95 je zahtevala točno 616/495; val 96 je po protokolu
    // issue-ja #72 (točka 21 — UL RS 39/1996 kot pozno časovno sidro)
    // zakonito dodal +1 vir na MVG-008 (+1/+1).
    expect(seedExhibits.length).toBe(114);
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    expect(virov).toBeGreaterThanOrEqual(616);
    expect(SOURCE_USAGE.size).toBeGreaterThanOrEqual(495);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    expect(deljenih).toBeGreaterThanOrEqual(68);
  });

  test("novi viri izključno eno-zapisni: 6 × MVG-083 + 1 × MVG-003 (brez podvajanja)", () => {
    const najdi = byMuseumNo("MVG-083");
    const jub = byMuseumNo("MVG-003");
    for (const k of [...NOVI_KLJUCI_M83]) {
      const s = najdi.sources.find((x) => x.key === k)!;
      const key = sourceKeyOf(s.nameSi, s.url ?? null);
      const u = SOURCE_USAGE.get(key)!;
      expect(u.exhibits.length).toBe(1);
      expect(u.exhibits.every((e) => e.slug === "arheolosko-najdigsce-ob-kolpi")).toBe(true);
    }
    const memento = jub.sources.find((x) => x.key === "cobiss-memento-2026")!;
    const keyM = sourceKeyOf(memento.nameSi, memento.url ?? null);
    const uM = SOURCE_USAGE.get(keyM)!;
    expect(uM.exhibits.length).toBe(1);
    expect(uM.exhibits.every((e) => e.slug === "petstoletnica-2026")).toBe(true);
  });

  test("102. val: vsebina 21-0141 prebrana — najdbe zapisane po poročilu, ne ugibane [pin posodobljen 102. val]", () => {
    const naj = byMuseumNo("MVG-083");
    const s = naj.sources.find((x) => x.key === "tiran-2021-klepec-krasinec")!;
    // 102. val: vsebina prebrana — najdbe prihajajo iz poročila, ne ugibanja
    expect(s.noteSi).toContain("PREBRANO v celoti");
    expect(s.noteSi).toContain("hodna površina SE 003");
    expect(s.noteSi).toContain("Ha A");
    // ised ID je zdaj dokumentiran: javni prenos brez prijave (vrzel vala 95 razrešena)
    expect(s.noteSi).toMatch(/29033\/download/);
  });
});
