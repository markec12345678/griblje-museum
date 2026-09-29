/**
 * Val 106 — ISSUE #72: zvezek Varstvo spomenikov, Poročila 42 prebran v celoti
 * z OCR skena (tesseract slv, 0 VLM / 0 spletnega iskanja) — kolofon razrešen
 * (Ljubljana, december 2006) + dva članka o Gribljih: vnos 59 (izkopavanja
 * 2005, str. 49–50 — NOV PRIMARNI VIR, doslej znan le posredno prek Žorž 2011)
 * + vnos 60 (vrednotenje kanalov G1/G4, str. 51 — kuratorski zapis potrjen +
 * popravek strani: ne 60–61, temveč 51).
 *
 * Kaj ta datoteka varuje:
 *  1. RAZREŠITEV LETNICE VS 42: kolofon »Ljubljana, december 2006«, ISSN 1580-5166,
 *     urednica Biserka Ribnikar; zvezek zajema poročila o posegih 2005; ime datoteke
 *     042_2006 potrjeno s kolofonom — REVIEW razrešen z dokazom, ne utišan.
 *  2. NOV PRIMARNI VIR (vnos 59, str. 49–50): izkopavanja 21. 3.–7. 4. 2005,
 *     parcele 2852/2, 2863, 2864, 2865, 2886; tri sonde; stratigrafija 9 faz
 *     (neolitska hodna površina SE 106; eneolitske jame za stojke; močna erozija);
 *     TO_COLLECT prek Žorž 2011 razrešen; add-only.
 *  3. POPRAVEK STRANI (vnos 60): ne 60–61, temveč 51 — foliji PDF 49/50/51 =
 *     natisnjene 49/50/51 (mapping 1:1, vizualno potrjen na 300 dpi).
 *  4. POŠTENOST: OCR napake ostanejo v surovinah (surovina = dokaz); nejasnost
 *     kazala (vnosa uvrščena v »rimsko obdobje«) zapisana, ni rešena z
 *     interpretacijo; koluvij G4 »težko ločljiv od intaktnih plasti« z enako težo.
 *  5. ŠTEVCI: 114 / 652 / 528 / 69 (+1 vir, +1 identiteta).
 *  6. ARTEFAKTI: summary.json val 106, sha256.txt, 10 OCR TXT; veliki PDF izbrisan
 *     (hash zabeležen); tessdata izbrisana (javno preneisljiva).
 *
 * Protokol issue #72: brez podvajanja, vsak finding s statusom, add-only.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE } from "../src/lib/source-registry";

const RG = join(process.cwd(), "research-griblje");
const V106 = join(RG, "raw-web-val106-2026-10");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  datum: string;
  tema: string;
  metoda: { vlm_klicev: number; spletno_iskanje: number; ocr: string; folio_preverba: string; vnos_resevanje: string };
  zvezek: { kolofon: string; uvodnik: string; letnica_status: string; strani_pdf: number; besedilna_plast: string };
  vnos_59_izkopavanja: {
    strani: string; glava: string; podpis: string; izkopavanja: string; parcele: string; sonde: string;
    faze_S1_S2: string; faze_S3: string; sklep: string; vrednotenje_fekalne_trase: string; pomen: string;
  };
  vnos_60_vrednotenje_G1_G4: {
    strani: string; glava: string; podpis: string; vodja: string; parcele: string; tj: string;
    porazdelitev: string; lego: string; ugotovitve: string; sklep: string; popravek_strani: string;
  };
  kazalo: { strani: string; griblje_vnosi: number[]; opomba: string };
  vgradnja: { novi_viri: string[]; dopolnjeni_viri: string[]; zgodba: string; prehod_stevcev: string };
  artefakti: { sha256_txt: string; pdf_bajtov: number; pdf_sha256: string; veliki_pdf_po_valu: string; teksti: string[] };
};

const SUMMARY = JSON.parse(readFileSync(join(V106, "summary.json"), "utf8")) as Sum;

const mvg083 = seedExhibits.find((e) => e.museumNo === "MVG-083")!;
const src = (key: string) => mvg083.sources?.find((s) => s.key === key)!;

describe("val106 · razrešitev letnice VS 42 (kolofon)", () => {
  test("vs-42 noteSi: kolofon december 2006, ISSN, REVIEW razrešen, ime datoteke potrjeno", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!.noteSi;
    expect(n).toContain("Doplnilo 106. vala");
    expect(n).toContain("Ljubljana, december 2006");
    expect(n).toContain("ISSN 1580-5166");
    expect(n).toContain("urednica Biserka Ribnikar");
    expect(n).toContain("poročila o posegih, opravljenih v veliki meri v letu 2005");
    expect(n).toContain("ime datoteke 042_2006 potrjeno s kolofonom");
    expect(n).toContain("REVIEW letnice razrešen");
    expect(n).toContain("tesseract slv");
  });

  test("vs-42 noteEn: angleški zrcalni zapis (RESOLVED, December 2006)", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!.noteEn;
    expect(n).toContain("Wave 106 supplement");
    expect(n).toContain("Ljubljana, December 2006");
    expect(n).toContain("the REVIEW year resolved");
  });

  test("summary: letnica_status = REVIEW RAZREŠEN s kolofonom", () => {
    expect(SUMMARY.zvezek.letnica_status).toContain("REVIEW RAZREŠEN");
    expect(SUMMARY.zvezek.letnica_status).toContain("december 2006");
    expect(SUMMARY.zvezek.kolofon).toContain("december 2006");
    expect(SUMMARY.zvezek.kolofon).toContain("ISSN 1580-5166");
    expect(SUMMARY.zvezek.strani_pdf).toBe(212);
  });
});

describe("val106 · nov primarni vir — vnos 59 (izkopavanja 2005)", () => {
  test("nov vir mason-varesko-pinter-2006-izkopavanja obstaja na MVG-083", () => {
    const s = src("mason-varesko-pinter-2006-izkopavanja");
    expect(s).toBeDefined();
    expect(s!.nameSi).toContain("Varstvo spomenikov 42, poročila, str. 49–50, vnos 59 (EŠD 10094)");
    expect(s!.nameSi).toContain("21. 3.–7. 4. 2005");
    expect(s!.nameEn).toContain("excavations on the faecal sewer route of Griblje");
  });

  test("noteSi: glava, parcele, tri sonde, status VERIFIED (polno branje — OCR)", () => {
    const n = src("mason-varesko-pinter-2006-izkopavanja")!.noteSi;
    expect(n).toContain("polnem branju zvezka z OCR skena (106. val");
    expect(n).toContain("Ljubljana, december 2006, ISSN 1580-5166");
    expect(n).toContain("2852/2, 2863, 2864, 2865, 2886");
    expect(n).toContain("S:3 (profil dolžine 20 m");
    expect(n).toContain("paleostruge Kolpe");
    expect(n).toContain("Status: VERIFIED (polno branje primarnega vira — OCR skena)");
  });

  test("noteSi: stratigrafija 9 faz — neolitska hodna površina, eneolitske jame za stojke, erozija", () => {
    const n = src("mason-varesko-pinter-2006-izkopavanja")!.noteSi;
    expect(n).toContain("neolitska hodna površina (SE 106)");
    expect(n).toContain("izdelovanje orodja in orožja iz kremena");
    expect(n).toContain("vkopi jam za stojke");
    expect(n).toContain("močno erozijo naselbinskih plasti");
    expect(n).toContain("parcelacija in komasacija 1985");
    expect(n).toContain("arheološko vrednotenje 2004");
  });

  test("TO_COLLECT razrešen: zorz-2011 note povezuje vnos 59 z novim virom (sl+en)", () => {
    const si = src("zorz-2011-av-griblje")!.noteSi;
    expect(si).toContain("Doplnilo 106. vala");
    expect(si).toContain("poročilo o izkopavanjih 2005 je identificirano in prebrano v celoti");
    expect(si).toContain("mason-varesko-pinter-2006-izkopavanja");
  });

  test("summary vnos 59: datumi, ekipa, sklep, pomen", () => {
    const v = SUMMARY.vnos_59_izkopavanja;
    expect(v.strani).toBe("49–50");
    expect(v.izkopavanja).toContain("21. 3.–7. 4. 2005");
    expect(v.izkopavanja).toContain("Philipa Masona");
    expect(v.podpis).toContain("Ildiko Pinter");
    expect(v.faze_S1_S2).toContain("SE 106");
    expect(v.faze_S1_S2).toContain("jam za stojke");
    expect(v.sklep).toContain("neolitik");
    expect(v.pomen).toContain("PRIMARNO POROČILO O IZKOPAVANJIH 2005");
    expect(v.pomen).toContain("Žorž 2011");
  });
});

describe("val106 · popravek strani — vnos 60 (G1/G4 na str. 51)", () => {
  test("vs-42 noteSi: popravek str. 60–61 → 51 z dokazom (rdeča vnosna številka, foliji 1:1)", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!.noteSi;
    expect(n).toContain("članek je na str. 51");
    expect(n).toContain("rdeča vnosna številka 60 nad glavo");
    expect(n).toContain("kuratorski zapis je navajal str. 60–61");
    expect(n).toContain("mapping 1:1 vizualno potrjen");
  });

  test("vs-42 noteEn: page correction zrcaljena", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!.noteEn;
    expect(n).toContain("the article is on p. 51");
    expect(n).toContain("the entry number confused with the page");
  });

  test("vs-42 noteSi: polno branje potrjuje kuratorski zapis (11 TJ, porazdelitev, intaktna plast G4)", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!.noteSi;
    expect(n).toContain("6 TJ kanala G1 v povprečni velikosti 2 × 2 × 1,5 m in 5 TJ kanala G4");
    expect(n).toContain("preostanek trase G4 zaradi strnjenega naselja ni bil izvedljiv");
    expect(n).toContain("intaktni kulturni plasti");
  });

  test("summary vnos 60: str. 51, 11 TJ, popravek_strani", () => {
    const v = SUMMARY.vnos_60_vrednotenje_G1_G4;
    expect(v.strani).toBe("51");
    expect(v.tj).toContain("11 TJ");
    expect(v.porazdelitev).toContain("NI BIL IZVEDLJIV");
    expect(v.popravek_strani).toContain("je navajal str. 60–61");
    expect(v.popravek_strani).toContain("str. 51 (vnos 60)");
  });

  test("kazalo: Griblje pod vnos 59 + 60; nejasnost zapisana, ni kritična", () => {
    expect(SUMMARY.kazalo.griblje_vnosi).toEqual([59, 60]);
    expect(SUMMARY.kazalo.opomba).toContain("vnos");
    expect(SUMMARY.kazalo.opomba).toContain("nejasnost kazala zapisana");
  });
});

describe("val106 · zgodba + muzej išče + poštenost", () => {
  test("storySi odstavek 106. vala (sl)", () => {
    expect(mvg083.storySi).toContain("106. val je prebral zvezek, ki ga je 105. val le našel");
    expect(mvg083.storySi).toContain("dva gribeljska članka, ne enega");
    expect(mvg083.storySi).toContain("izdelovanje orodja in orožja iz kremena");
    expect(mvg083.storySi).toContain("paleostrugi Kolpe");
  });

  test("storyEn Wave 106 (en)", () => {
    expect(mvg083.storyEn).toContain("Wave 106 has read the volume that wave 105 had only found");
    expect(mvg083.storyEn).toContain("two Griblje articles");
  });

  test("zgodba: popravek str. 60–61 → 51 zapisan v zgodbi sl+en", () => {
    expect(mvg083.storySi).toContain("str. 51");
    expect(mvg083.storyEn).toContain("p. 51");
  });

  test("muzej-išče doplnilo 106. vala (sl+en)", () => {
    expect(mvg083.storySi).toContain("(Doplnilo 106. vala: zvezek Varstvo spomenikov, Poročila 42 je prebran v celoti");
    expect(mvg083.storySi).toContain("vrednotenje kanalov G1/G4 pa potrjeno na str. 51");
  });

  test("poštenost: 0 VLM / 0 spletnega iskanja; OCR dvomi rešeni iz konteksta, ne tiho", () => {
    expect(SUMMARY.metoda.vlm_klicev).toBe(0);
    expect(SUMMARY.metoda.spletno_iskanje).toBe(0);
    expect(SUMMARY.metoda.ocr).toContain("tesseract 5");
    expect(SUMMARY.metoda.ocr).toContain("slv+deu");
    expect(SUMMARY.metoda.folio_preverba).toContain("1:1");
    expect(SUMMARY.metoda.vnos_resevanje).toContain("rdeča številka");
  });

  test("brez podvajanja: nov vir ne podvojuje vs-42 citata (dva ločena članka = dva zapisa)", () => {
    const vs42 = src("vs-42-kanalizacija-g1-g4")!;
    const nov = src("mason-varesko-pinter-2006-izkopavanja")!;
    expect(vs42.key).not.toBe(nov.key);
    expect(nov.nameSi).toContain("str. 49–50, vnos 59");
    expect(vs42.noteSi).toContain("rdeča vnosna številka 60");
    // vs-42 zapis citira vnos 60 (vrednotenje); vnos 59 živi izključno v novem viru
    expect(vs42.noteSi.includes("vnos 59 (EŠD 10094")).toBe(false);
  });
});

describe("val106 · števci + artefakti + docs", () => {
  test("števci: 114 zapisov / 652 virov / 528 identitet / 69 deljenih [+1 vir: mason-varesko-pinter-2006-izkopavanja]", () => {
    let cit = 0;
    for (const e of seedExhibits) cit += e.sources.length;
    const keys = [...SOURCE_USAGE.entries()];
    const shared = keys.filter(([, u]) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(cit).toBe(652);
    expect(keys.length).toBe(528);
    expect(shared).toBe(69);
  });

  test("vgradnja add-only: 1 nov vir, 2 dopolnjena, prehod 651→652 / 527→528", () => {
    expect(SUMMARY.vgradnja.novi_viri).toEqual(["mason-varesko-pinter-2006-izkopavanja"]);
    expect(SUMMARY.vgradnja.dopolnjeni_viri.join(" ")).toContain("vs-42-kanalizacija-g1-g4");
    expect(SUMMARY.vgradnja.dopolnjeni_viri.join(" ")).toContain("zorz-2011-av-griblje");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("114");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("651 → 652");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("527 → 528");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("69");
  });

  test("artefakti: 10 OCR TXT prisotnih z dobesednimi nizi; veliki PDF izbrisan (hash zabeležen)", () => {
    expect(SUMMARY.artefakti.teksti.length).toBe(10);
    expect(SUMMARY.artefakti.pdf_bajtov).toBe(45826752);
    expect(SUMMARY.artefakti.pdf_sha256).toBe("404dbb070745386c5f8ed4a7c1c77d9af611aed8364084d84a32d889b01985fe");
    expect(SUMMARY.artefakti.veliki_pdf_po_valu).toContain("izbrisan");
    for (const t of ["vs42-p002-kolofon.txt", "vs42-p049-griblje-izkopavanja.txt", "vs42-p050-griblje-izkopavanja.txt", "vs42-p051-griblje-vrednotenje.txt", "vs42-p204-kazalo.txt"]) {
      expect(existsSync(join(V106, t))).toBe(true);
    }
    expect(existsSync(join(V106, "vs42_2006.pdf"))).toBe(false);
  });

  test("OCR TXT: dobesedni oporniki (kolofon, glava, sonde, faze, sklep)", () => {
    const p49 = readFileSync(join(V106, "vs42-p049-griblje-izkopavanja.txt"), "utf8");
    expect(p49).toContain("EŠD: 10094");
    expect(p49).toContain("Naselje: Griblje");
    expect(p49).toContain("Arheološka izkopavanja na trasi fekalne kanali");
    expect(p49).toContain("2852/2");
    expect(p49).toContain("21. 3. do");
    expect(p49).toContain("7. 4. 2005");
    const p50 = readFileSync(join(V106, "vs42-p050-griblje-izkopavanja.txt"), "utf8");
    expect(p50).toContain("hodna");
    expect(p50).toContain("SE 106");
    expect(p50).toContain("jam za stojke");
    expect(p50).toContain("izdelovanje");
    expect(p50).toContain("kremena");
    const p51 = readFileSync(join(V106, "vs42-p051-griblje-vrednotenje.txt"), "utf8").replace(/\s+/g, " ");
    expect(p51).toContain("skupno 11 TJ");
    expect(p51).toContain("113/1");
    expect(p51).toContain("intaktne kulturne plasti");
    expect(p51).toContain("Philip Mason, Niko Vareško, Ildiko Pinter");
    const kolofon = readFileSync(join(V106, "vs42-p002-kolofon.txt"), "utf8");
    expect(kolofon).toContain("Ljubljana, december 2006");
    expect(kolofon).toContain("ISSN 1580-5166");
    expect(kolofon).toContain("Biserka Ribnikar");
  });

  test("sha256.txt: PDF + TXT hashirani", () => {
    const sh = readFileSync(join(V106, "sha256.txt"), "utf8");
    expect(sh).toContain("404dbb070745386c5f8ed4a7c1c77d9af611aed8364084d84a32d889b01985fe");
    expect(sh).toContain("vs42-p049-griblje-izkopavanja.txt");
    expect(sh).toContain("vs42-p051-griblje-vrednotenje.txt");
  });

  test("README: 160. sklop + stanje zbirke 114/652/528/69", () => {
    const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
    expect(readme).toContain("160. sklop");
    expect(readme).toContain("114 zapisov (MVG-001–114), 652 virov, 528 identitet, 69 deljenih");
    expect(readme).toContain("114/652 živo");
  });

  test("docs: raziskovalni zapis 121 + KAZALO 121", () => {
    const doc = readFileSync(join(RG, "121-val106-vs42-ocr-prebran.md"), "utf8");
    expect(doc).toContain("106. val");
    expect(doc).toContain("Ljubljana, december 2006");
    expect(doc).toContain("vnos 59");
    expect(doc).toContain("str. 51");
    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("121-val106");
  });
});
