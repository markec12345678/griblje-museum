/**
 * Val 104 — ISSUE #72: vseh 10 preostalih poročil z javnimi prenosi prebranih
 * v celoti (13-0078, 17-0374, 17-0481, 17-0497, 19-0552, 20-0261, 20-0297,
 * 21-0130, 21-0406, 23-0261) — pokritost prvih poročil registra ZAKLJUČENA
 * (24/24 raziskav eArheologije z javnimi prenosi).
 *
 * Kaj ta datoteka varuje:
 *  1. PREBRANA POROČILA: 13-0078 (vodovod 2013, najstarejše z javnim
 *     prenosom; 7 przg. odlomkov pozne bronaste dobe v koluviju —
 *     sekundarna lega; popravek vala 102 razrešen v praksi), 17-0374
 *     (silosa *43/653, negativen; 3 verjetno zgodnjesrednjeveški odlomki),
 *     17-0481 (Brodarič *79/94/106/1, negativen; neskladje *79/*76),
 *     17-0497 (Šterk 657/3, negativen; neskladji Gradac + terensko pred
 *     soglasjem), 19-0552 (Krajnc 162/160/4, negativen), 20-0261
 *     (Pezdirc 810, negativen), 20-0297 (Griblje 30, 6 przg. odlomkov v
 *     koluviju — izpiranje kot domneva), 21-0130 (Griblje 30 gradbena
 *     jama, eneolit + sigilata 7.1.1 + 3 vkopi za kole), 21-0406
 *     (razsvetljava Brinsko selo, negativen), 23-0261 (razsvetljava
 *     Dolnje Griblje, POZITIVNO; 67 najdb; dve novoveški cesti).
 *  2. ODKRITJE VALA: 24/24 prebranih — pokritost ZAKLJUČENA; brez prenosa
 *     le 26-0326 + 26-0379.
 *  3. POŠTENOST: negativni z enako težo (7 od 10); sekundarne lege
 *     izrecno; domneve kot domneve; 6 neskorij zapisanih, ne rešeni;
 *     BM Metlika = trajna hramba (23-0261).
 *  4. ŠTEVCI: izrecen prehod 114 / 651 / 527 / 69.
 *
 * Protokol issue #72: brez podvajanja (rg kontrola pred vgradnjo),
 * vsak finding s statusom, add-only izključno na MVG-083.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

const RG = join(process.cwd(), "research-griblje");
const V104 = join(RG, "val104");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  task: string;
  datum: string;
  odkritje_vala: {
    raziskave_z_javnim_prenosom: number;
    raziskave_skupaj: number;
    prebranih_do_vala_103: number;
    prebranih_do_vala_104: number;
    pokritost_porocil_zakljucena: boolean;
    brez_prenosa: string[];
  };
  porocila_prebrana: {
    koda: string;
    datoteka: string;
    strani: number;
    sha256_pdf: string;
    txt_sha256: string;
    esde_id: number;
    kljucne_ugotovitve: string[];
  }[];
  vgradnja: {
    novi_viri: string[];
    dopolnjeni_viri: string[];
    prehod_stevcev: string;
  };
  brez_podvajanja: string[];
  fairness: string[];
};

const SUMMARY = JSON.parse(readFileSync(join(V104, "summary.json"), "utf8")) as Sum;

const mvg083 = seedExhibits.find((e) => e.museumNo === "MVG-083")!;
const src = (key: string) => mvg083.sources?.find((s) => s.key === key)!;

const NOVI_VIRI = [
  "kovac-2013-vodovod-667-2979",
  "filipidis-2017-silosa-43-653",
  "olic-2017-brodaric-79-94-106-1",
  "tiran-2017-sterk-657-3",
  "tiran-2019-krajnc-162-160-4",
  "gruden-2020-hisa-griblje-30",
  "gruden-omahen-2021-griblje-30",
  "tiran-2020-pezdirc-810",
  "hvalec-2021-razsvetljava-brinsko-selo",
  "draksler-klasinc-2023-razsvetljava-dolnje-griblje",
];

const KODE = ["13-0078", "17-0374", "17-0481", "17-0497", "19-0552", "20-0261", "20-0297", "21-0130", "21-0406", "23-0261"];

/** Normalizacija presledkov za dobesedne odlomke iz TXT (21-0406 ima razmaknjene črke → odstranimo vse presledke). */
const norm = (s: string) => s.replace(/\s+/g, " ");
const dense = (s: string) => s.replace(/\s+/g, "");

describe("val104 · identitete virov (10 novih, izključno MVG-083)", () => {
  test("vseh 10 novih virov obstaja z javnim eSDE prenosom", () => {
    for (const key of NOVI_VIRI) {
      const s = src(key)!;
      expect(s).toBeTruthy();
      expect(s.license).toBe("javni prenos prvega poročila (eSDE/eDEDIŠČINA)");
      expect(s.url).toContain("ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/");
      expect(s.noteSi).toContain("104. val");
      expect(s.noteEn).toContain("Wave 104");
    }
  });

  test("opomba 13-0078: najstarejše prebrano, vodovod, 11 ročnih jarkov, pozna bronasta doba, sekundarna lega", () => {
    const s = src("kovac-2013-vodovod-667-2979")!;
    expect(s.noteSi).toContain("NAJSTAREJŠE poročilo z javnim prenosom");
    expect(s.noteSi).toContain("62240-105/2013/2");
    expect(s.noteSi).toContain("7.–8.6.2013");
    expect(s.noteSi).toContain("Otmar Kovač");
    expect(s.noteSi).toContain("11 ročnih testnih jarkov 1 × 2 m");
    expect(s.noteSi).toContain("POZNA BRONASTA DOBA");
    expect(s.noteSi).toContain("Sekundarna lega");
    expect(s.noteSi).toContain("prenos OBSTAJA");
  });

  test("opomba 17-0374: silosa, negativen, 3 zgodnjesrednjeveški odlomki, sekundarna lega", () => {
    const s = src("filipidis-2017-silosa-43-653")!;
    expect(s.noteSi).toContain("8.7.2017");
    expect(s.noteSi).toContain("0,87 % pokritost");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("zgodnjesrednjeveških odlomkov");
    expect(s.noteSi).toContain("sekundarna, premeščena lega");
    expect(s.noteSi).toContain("Griblje 59");
  });

  test("opomba 17-0481: Brodarič, negativen, neskladje *79 vs *76", () => {
    const s = src("olic-2017-brodaric-79-94-106-1")!;
    expect(s.noteSi).toContain("13.11.2017");
    expect(s.noteSi).toContain("mag. Alenka Jovanović");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("parcelo *79, sklep pa *76");
    expect(s.noteSi).toContain("zapisano, ne rešeno");
  });

  test("opomba 17-0497: Šterk, negativen, neskladji (Gradac + terensko pred soglasjem)", () => {
    const s = src("tiran-2017-sterk-657-3")!;
    expect(s.noteSi).toContain("657/3");
    expect(s.noteSi).toContain("Matevž Lavrinc");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("pet dni PRED datumom soglasja");
    expect(s.noteSi).toContain("občino Gradac");
    expect(s.noteSi).toContain("geološka osnova (SE 006");
  });

  test("opomba 19-0552: Krajnc, negativen, nasutje, podtalnica", () => {
    const s = src("tiran-2019-krajnc-162-160-4")!;
    expect(s.noteSi).toContain("162 in 160/4");
    expect(s.noteSi).toContain("20.12.2019");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("podtalnica od cca. 70 cm");
  });

  test("opomba 20-0261: Pezdirc, negativen, recentne najdbe", () => {
    const s = src("tiran-2020-pezdirc-810")!;
    expect(s.noteSi).toContain("parcela št. 810");
    expect(s.noteSi).toContain("13.7.2020");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("pločevinke, steklenice");
  });

  test("opomba 20-0297: Griblje 30, 6 przg. odlomkov, izpiranje kot domneva, nadaljevanje 21-0130", () => {
    const s = src("gruden-2020-hisa-griblje-30")!;
    expect(s.noteSi).toContain("791/4, 792/4 in 790/3");
    expect(s.noteSi).toContain("13.8.2020");
    expect(s.noteSi).toContain("6 odlomkov prazgodovinske lončenine (20 g");
    expect(s.noteSi).toContain("sekundarno z izpiranjem materiala z bližnjega višjeležečega najdišča");
    expect(s.noteSi).toContain("domneva, prenašana kot domneva");
    expect(s.noteSi).toContain("21-0130 (2021)");
  });

  test("opomba 21-0130: eneolit z rdečim premazom, sigilata 7.1.1, trije vkopi za kole kot domneva", () => {
    const s = src("gruden-omahen-2021-griblje-30")!;
    expect(s.noteSi).toContain("22 × 10 m (230,3 m²)");
    expect(s.noteSi).toContain("9.4.2021");
    expect(s.noteSi).toContain("86 odlomkov prazgodovinske lončenine (568 g)");
    expect(s.noteSi).toContain("rdečim premazom");
    expect(s.noteSi).toContain("savske skupine, mlajše lasinjske skupine");
    expect(s.noteSi).toContain("Veliki Nerajec grobovi 1, 5, 7");
    expect(s.noteSi).toContain("oblika 7.1.1");
    expect(s.noteSi).toContain("TRI VKOPI ZA KOLE");
    expect(s.noteSi).toContain("morda bi šlo lahko za ostanke lesene stavbe");
    expect(s.noteSi).toContain("vkopi brez najdb, datacije ne omogočajo");
  });

  test("opomba 21-0406: razsvetljava Brinsko selo, negativen, dva KVP-ja zapisana", () => {
    const s = src("hvalec-2021-razsvetljava-brinsko-selo")!;
    expect(s.noteSi).toContain("cca. 940 m");
    expect(s.noteSi).toContain("11.8.–7.9.2021");
    expect(s.noteSi).toContain("NEGATIVEN za starejša obdobja");
    expect(s.noteSi).toContain("KVP 35105-0300/2014/4 — neskladje zapisano");
    expect(s.noteSi).toContain("Samo Hvalec");
  });

  test("opomba 23-0261: POZITIVNO, 67 najdb, dve novoveški cesti, popravek SE 1005, BM Metlika", () => {
    const s = src("draksler-klasinc-2023-razsvetljava-dolnje-griblje")!;
    expect(s.noteSi).toContain("ARHEOLOŠKO POZITIVNO");
    expect(s.noteSi).toContain("67 najdb / 1.248 g");
    expect(s.noteSi).toContain("DVE NOVOVEŠKI CESTI IZ PRODNIKOV");
    expect(s.noteSi).toContain("SE 1016");
    expect(s.noteSi).toContain("novoveški kolovoz");
    expect(s.noteSi).toContain("izrecno popravljena v koluvij");
    expect(s.noteSi).toContain("naslov navede 19 parcel, podatkovni blok pa 2698/2, 2699/1 in 2702");
    expect(s.noteSi).toContain("Belokranjski muzej Metlika");
    expect(s.noteSi).toContain("TRETJI projekt 2023");
    expect(s.noteEn).toContain("the first road remains documented");
  });
});

describe("val104 · odkritje + zgodba (sl+en)", () => {
  test("nov odstavek sl: 24/24 zaključeno, 26-0326/26-0379, eneolit, sigilata, cesti, neskorij", () => {
    expect(mvg083.storySi).toContain("104. val je vsebinsko pokritost prvih poročil registra ZAKLJUČIL");
    expect(mvg083.storySi).toContain("prebranih 24");
    expect(mvg083.storySi).toContain("26-0326 (poročilo oddano v pregled) in 26-0379 (šele napredita raziskava)");
    expect(mvg083.storySi).toContain("2013 vodovod Dobliče–Žilje");
    expect(mvg083.storySi).toContain("Otmar Kovač");
    expect(mvg083.storySi).toContain("preliminarno pozna bronasta doba");
    expect(mvg083.storySi).toContain("parcelo *79, sklep pa *76");
    expect(mvg083.storySi).toContain("občino Gradac");
    expect(mvg083.storySi).toContain("sekundarno z izpiranjem z bližnjega višjeležečega najdišča");
    expect(mvg083.storySi).toContain("fragment z rdečim premazom");
    expect(mvg083.storySi).toContain("oblika 7.1.1, avgustejsko obdobje");
    expect(mvg083.storySi).toContain("TRI VKOPI ZA KOLE");
    expect(mvg083.storySi).toContain("PRVI DOKUMENTIRANI CESTNI OSTANKI");
    expect(mvg083.storySi).toContain("dve novoveški cesti iz prodnikov pod današnjim asfaltom z obcestnim jarkom");
    expect(mvg083.storySi).toContain("Belokranjski muzej v Metliki");
  });

  test("nov odstavek en (paralelen)", () => {
    expect(mvg083.storyEn).toContain("Wave 104 has COMPLETED the coverage of the register's first reports");
    expect(mvg083.storyEn).toContain("24 are now read");
    expect(mvg083.storyEn).toContain("the 2013 water supply Dobliče–Žilje");
    expect(mvg083.storyEn).toContain("form 7.1.1, the Augustan period");
    expect(mvg083.storyEn).toContain("THREE POSTHOLES");
    expect(mvg083.storyEn).toContain("two modern-period gravel roads beneath today's asphalt with a roadside ditch");
    expect(mvg083.storyEn).toContain("the Bela krajina Museum in Metlika");
  });

  test("označevalec dopolnila pri »Muzej išče« (zaključek pokritosti 24/24)", () => {
    expect(mvg083.storySi).toContain("(Doplnilo 104. vala: tudi teh deset je prebranih v celoti — pokritost prvih poročil registra z javnimi prenosi je ZAKLJUČENA, 24/24");
    expect(mvg083.storySi).toContain("brez prenosa ostajata le 26-0326, oddano v pregled, in 26-0379, napredita raziskava)");
    expect(mvg083.storyEn).toContain("(Wave 104 supplement: those ten have also been read in full — the coverage of the register's first reports with public downloads is COMPLETE, 24/24");
  });
});

describe("val104 · poštenost", () => {
  test("negativni rezultati z enako težo (7 poročil)", () => {
    const neg = [
      "kovac-2013-vodovod-667-2979",
      "filipidis-2017-silosa-43-653",
      "olic-2017-brodaric-79-94-106-1",
      "tiran-2017-sterk-657-3",
      "tiran-2019-krajnc-162-160-4",
      "tiran-2020-pezdirc-810",
      "hvalec-2021-razsvetljava-brinsko-selo",
    ];
    for (const key of neg) {
      expect(src(key)!.noteSi).toContain("NEGATIVEN");
    }
  });

  test("sekundarne lege izrecno (13-0078, 17-0374, 20-0297, 23-0261)", () => {
    expect(src("kovac-2013-vodovod-667-2979")!.noteSi).toContain("Sekundarna lega");
    expect(src("filipidis-2017-silosa-43-653")!.noteSi).toContain("premeščena lega");
    expect(src("gruden-2020-hisa-griblje-30")!.noteSi).toContain("izpiranjem materiala");
    expect(src("draksler-klasinc-2023-razsvetljava-dolnje-griblje")!.noteSi).toContain("v koluvijih");
  });

  test("domneve kot domneve (20-0297, 21-0130, 23-0261)", () => {
    expect(src("gruden-2020-hisa-griblje-30")!.noteSi).toContain("domneva, prenašana kot domneva");
    expect(src("gruden-omahen-2021-griblje-30")!.noteSi).toContain("domneva, prenašana kot domneva");
    expect(src("draksler-klasinc-2023-razsvetljava-dolnje-griblje")!.noteSi).toContain("verjetneje novoveški kolovoz");
  });

  test("summary fairness: negativi + domneve + neskorij + BM Metlika", () => {
    const f = SUMMARY.fairness.join(" ");
    expect(f).toContain("z enako težo");
    expect(f).toContain("domneve");
    expect(f).toContain("parcela *79 vs *76");
    expect(f).toContain("občina Gradac");
    expect(f).toContain("Belokranjski muzej Metlika");
  });
});

describe("val104 · števci + artefakti + docs", () => {
  test("številni prehod: 114 zapisov / 652 citati / 528 identitet / 69 deljenih [pin posodobljen 106. val: +1 vir (mason-varesko-pinter-2006-izkopavanja) na MVG-083]", () => {
    let cit = 0;
    for (const e of seedExhibits) cit += e.sources.length;
    const keys = [...SOURCE_USAGE.entries()];
    const shared = keys.filter(([, u]) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(cit).toBe(652);
    expect(keys.length).toBe(528);
    expect(shared).toBe(69);
  });

  test("novi viri samo na MVG-083 (ni deljenih v val 104)", () => {
    for (const key of NOVI_VIRI) {
      const s = src(key)!;
      const k = sourceKeyOf(s.nameSi, s.url ?? null);
      const u = SOURCE_USAGE.get(k)!;
      expect(u).toBeTruthy();
      expect(u.exhibits.length).toBe(1);
      expect(u.exhibits[0].slug).toBe(mvg083.slug);
    }
  });

  test("summary.json: 10 poročil, odkritje 24/24 zaključeno, konzistentni ključi", () => {
    expect(SUMMARY.val).toBe(104);
    expect(SUMMARY.porocila_prebrana.length).toBe(10);
    expect(SUMMARY.porocila_prebrana.map((p) => p.koda)).toEqual(KODE);
    expect(SUMMARY.odkritje_vala.raziskave_z_javnim_prenosom).toBe(24);
    expect(SUMMARY.odkritje_vala.raziskave_skupaj).toBe(26);
    expect(SUMMARY.odkritje_vala.prebranih_do_vala_104).toBe(24);
    expect(SUMMARY.odkritje_vala.pokritost_porocil_zakljucena).toBe(true);
    expect(SUMMARY.odkritje_vala.brez_prenosa.length).toBe(2);
    expect(SUMMARY.vgradnja.novi_viri).toEqual(NOVI_VIRI);
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("651");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("527");
  });

  test("TXT poročil vsebujejo ključne nize (verifikacija vsebin; presledki normalizirani)", () => {
    const txt = (f: string) => norm(readFileSync(join(V104, "porocila", f), "utf8"));
    const denseTxt = (f: string) => dense(readFileSync(join(V104, "porocila", f), "utf8"));

    const t130078 = txt("13-0078.txt");
    expect(t130078).toContain("13-0078");
    expect(t130078).toContain("VODOVOD");
    expect(t130078).toContain("11 ročnih testnih jarkov");
    expect(t130078).toContain("pozno bronasto dobo");
    expect(t130078).toContain("prisotnost arheoloških ostalin na širšem območju");

    const t170374 = txt("17-0374.txt");
    expect(t170374).toContain("17-0374");
    expect(t170374).toContain("montažnih silosov");
    expect(t170374).toContain("zgodnje srednjeveških odlomkov");
    expect(t170374).toContain("sekundarni, predhodno premeščeni legi");

    const t170481 = txt("17-0481.txt");
    expect(t170481).toContain("17-0481");
    expect(t170481).toContain("hleva in zbiralnika gnojnice");
    expect(t170481).toContain("ki bi nakazovali na obstoj arheološkega najdišča");

    const t170497 = txt("17-0497.txt");
    expect(t170497).toContain("17-0497");
    expect(t170497).toContain("kmečke lope");
    expect(t170497).toContain("materialnih ostankov ali struktur");

    const t190552 = txt("19-0552.txt");
    expect(t190552).toContain("19-0552");
    expect(t190552).toContain("nadstrešnice in drvarnice");
    expect(t190552).toContain("sodobni materijal");

    const t200261 = txt("20-0261.txt");
    expect(t200261).toContain("20-0261");
    expect(t200261).toContain("Griblje-Pezdirc");
    expect(t200261).toContain("Kulturnih sledi na tem območju nismo zaznali");

    const t200297 = txt("20-0297.txt");
    expect(t200297).toContain("20-0297");
    expect(t200297).toContain("hiši Griblje 30");
    expect(t200297).toContain("23 najdb s skupno težo 289 g");
    expect(t200297).toContain("sekundarno z izpiranjem");

    const t210130 = txt("21-0130.txt");
    expect(t210130).toContain("21-0130");
    expect(t210130).toContain("95 najdb s skupno težo 665 g");
    expect(t210130).toContain("86 odlomkov lončenine (568 g)");
    expect(t210130).toContain("rdečim premazom");
    expect(t210130).toContain("ostanke lesene stavbe");
    expect(t210130).toContain("tri jame za kole");

    // 21-0406 ima v pdftotext izvodu razmaknjene črke — verifikacija na odstranjenih presledkih
    const t210406 = denseTxt("21-0406.txt");
    expect(t210406).toContain("21-0406");
    expect(t210406).toContain("Brinsko");
    expect(t210406).toContain("raziskavonismoodkrili");

    const t230261 = txt("23-0261.txt");
    expect(t230261).toContain("23-0261");
    expect(t230261).toContain("67 najdb s skupno maso 1.248 g");
    expect(t230261).toContain("novoveška cesta");
    expect(t230261).toContain("Belokranjski muzej Metlika");
  });

  test("artefakti: sha256 TXT + PDF ujemajo s porocila/sha256.txt", () => {
    const shaTxt = readFileSync(join(V104, "porocila", "sha256.txt"), "utf8");
    const shaPdf = readFileSync(join(V104, "porocila", "sha256-pdf.txt"), "utf8");
    for (const p of SUMMARY.porocila_prebrana) {
      expect(sha256(join(V104, "porocila", `${p.koda}.txt`))).toBe(p.txt_sha256);
      expect(shaTxt).toContain(p.txt_sha256);
      // sha256-pdf.txt nosi hashe vseh 10 PDF — tudi izbrisanih velikih (13-0078, 20-0261, 20-0297, 21-0406, 23-0261)
      expect(shaPdf).toContain(p.sha256_pdf);
    }
  });

  test("komittani PDF na mestu (5), izbrisani veliki ne (5, le hashi)", () => {
    const commitani = ["17-0374", "17-0481", "17-0497", "19-0552", "21-0130"];
    const izbrisani = ["13-0078", "20-0261", "20-0297", "21-0406", "23-0261"];
    for (const k of commitani) {
      expect(() => readFileSync(join(V104, "porocila", `${k}.pdf`))).not.toThrow();
    }
    for (const k of izbrisani) {
      expect(() => readFileSync(join(V104, "porocila", `${k}.pdf`))).toThrow();
      expect(() => readFileSync(join(V104, "porocila", `${k}.txt`))).not.toThrow();
    }
  });

  test("docs: summary + report 119 + KAZALO vnos + README 158. sklop", () => {
    const report = readFileSync(join(RG, "119-val104-issue72-porocila-zakljucek.md"), "utf8");
    expect(report).toContain("104. val");
    expect(report).toContain("21-0130");
    expect(report).toContain("24/24");
    expect(report).toContain("ZAKLJUČENA");

    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("119-val104-issue72-porocila-zakljucek.md");

    const readme = readFileSync("README.md", "utf8");
    expect(readme).toContain("158. sklop");
    expect(readme).toContain("24/24 POROČIL Z JAVNIMI PRENOSI PREBRANIH — POKRITOST ZAKLJUČENA");
    expect(readme).toContain("114 zapisov (MVG-001–114), 652 virov, 528 identitet, 69 deljenih");
    // zgodovinski posnetek starejšega sklopa ostaja (namerno nespremenjen)
    expect(readme).toContain("113 zapisov · 588 virov");
  });
});
