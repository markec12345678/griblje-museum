/**
 * Val 103 — ISSUE #72: vseh 8 preostalih poročil z javnimi prenosi prebranih
 * v celoti (2014–2026) — skupaj 14/26 raziskav eArheologije; register vpiše
 * 24/26 z javnimi prenosi, 10 ostaja za val 104.
 *
 * Kaj ta datoteka varuje:
 *  1. PREBRANA POROČILA: 14-0456 (drvarnica 750/3, negativen, izravnava
 *     1998), 15-0081 (agromelioracija, 3 × negativen), 16-0021 (G7/G8,
 *     rimski material + žlindra v koluviju — sekundarna lega; domneva
 *     metalurške delavnice kot domneva), 16-0141 (G7.1/G7.2, negativen),
 *     19-0007 (TK kabelska; prvi poznosrednjeveški ustji; apnenica),
 *     22-0169 (67/3 faza 1, 440 najdb, neolitski premazi, brez struktur,
 *     neskladje pet/šest), 25-0350 (15/4, pozitiven, 213 najdb, brez
 *     vkopov, roženec), 25-0556 (Krasinec 668/1, negativen).
 *  2. ODKRITJE VALA: 24/26 raziskav registra ima javni prenos; brez le
 *     26-0326 + 26-0379; 10 neodprtih za val 104.
 *  3. POPRAVEK vala 102: 13-0078 IMA prenos (ID 26367).
 *  4. POŠTENOST: negativni z enako težo; sekundarne lege izrecno;
 *     domneve kot domneve; k. o. Krasinec pošteno zapisano; BM Metlika =
 *     trajna hramba (2 nova poročili).
 *  5. ŠTEVCI: izrecen prehod 114 / 641 / 517 / 69.
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
const V103 = join(RG, "val103");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  task: string;
  datum: string;
  odkritje_vala: {
    raziskave_z_javnim_prenosom: number;
    raziskave_skupaj: number;
    prebranih_do_vala_103: number;
    ostalo_za_val_104: string[];
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

const SUMMARY = JSON.parse(readFileSync(join(V103, "summary.json"), "utf8")) as Sum;

const mvg083 = seedExhibits.find((e) => e.museumNo === "MVG-083")!;
const src = (key: string) => mvg083.sources?.find((s) => s.key === key)!;

const NOVI_VIRI = [
  "tiran-2015-klepec-750-3",
  "lavrinc-2015-agromelioracija-cerkvisce",
  "brecic-2016-kanalizacija-g7-g8",
  "tiran-2016-kanalizacija-g7-1-g7-2",
  "mulh-2019-tk-kabelska-kanalizacija",
  "gruden-2025-novogradnja-15-4",
  "fras-masaryk-2026-nno-krasinec-668-1",
];

const KODE = ["14-0456", "15-0081", "16-0021", "16-0141", "19-0007", "22-0169", "25-0350", "25-0556"];

/** Normalizacija presledkov za dobesedne odlomke iz TXT. */
const norm = (s: string) => s.replace(/\s+/g, " ");

describe("val103 · identitete virov (7 novih, izključno MVG-083)", () => {
  test("vseh 7 novih virov obstaja z javnim eSDE prenosom", () => {
    for (const key of NOVI_VIRI) {
      const s = src(key)!;
      expect(s).toBeTruthy();
      expect(s.license).toBe("javni prenos prvega poročila (eSDE/eDEDIŠČINA)");
      expect(s.url).toContain("ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/");
      expect(s.noteSi).toContain("103. val");
      expect(s.noteEn).toContain("Wave 103");
    }
  });

  test("opomba 14-0456: drvarnica, izravnava 1998, negativen", () => {
    const s = src("tiran-2015-klepec-750-3")!;
    expect(s.noteSi).toContain("drvarnice 6 × 4 m");
    expect(s.noteSi).toContain("19.12.2014");
    expect(s.noteSi).toContain("zgrajeno 1998");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("SI AS 176N83/g/A02");
  });

  test("opomba 15-0081: trije posegi, vse negativne, Dragoši", () => {
    const s = src("lavrinc-2015-agromelioracija-cerkvisce")!;
    expect(s.noteSi).toContain("PNG 3");
    expect(s.noteSi).toContain("ROP 12");
    expect(s.noteSi).toContain("PNZ 2");
    expect(s.noteSi).toContain("19861");
    expect(s.noteSi).toContain("NEGATIVEN na vseh treh");
  });

  test("opomba 16-0021: žlindra, metalurška delavnica kot domneva, sekundarna lega", () => {
    const s = src("brecic-2016-kanalizacija-g7-g8")!;
    expect(s.noteSi).toContain("19 strojnih testnih jam");
    expect(s.noteSi).toContain("železove žlindre");
    expect(s.noteSi).toContain("metalurška delavnica");
    expect(s.noteSi).toContain("domneva, prenašana kot domneva");
    expect(s.noteSi).toContain("sekundarni legi");
    expect(s.noteSi).toContain("namembnost neznana");
  });

  test("opomba 16-0141: follow-up zaradi 16-0021, negativen", () => {
    const s = src("tiran-2016-kanalizacija-g7-1-g7-2")!;
    expect(s.noteSi).toContain("2891/1–2");
    expect(s.noteSi).toContain("16-0021");
    expect(s.noteSi).toContain("NEGATIVEN za starejša obdobja");
    expect(s.noteSi).toContain("Katarina Udovč");
  });

  test("opomba 19-0007: poznosrednjeveška ustja (Klokočovnik, Štular), apnenica, reference Mason", () => {
    const s = src("mulh-2019-tk-kabelska-kanalizacija")!;
    expect(s.nameSi).toContain("koda raziskave 19-0007");
    expect(s.noteSi).toContain("prvi konkretno datirani srednjeveški odlomki ustij");
    expect(s.noteSi).toContain("Klokočovnik 2010");
    expect(s.noteSi).toContain("Štular");
    expect(s.noteSi).toContain("apnenica");
    expect(s.noteSi).toContain("Sakara Sučević, Mason 2008");
    expect(s.noteSi).toContain("Mason, Udovč 2009");
  });

  test("opomba 25-0350: 213 najdb, 82 %, brez vkopov, roženec, BM Metlika, tretja raziskava", () => {
    const s = src("gruden-2025-novogradnja-15-4")!;
    expect(s.noteSi).toContain("213 najdb / 2.271 g");
    expect(s.noteSi).toContain("82 %");
    expect(s.noteSi).toContain("vkopov za kole, odpadnih ali shrambnih jam");
    expect(s.noteSi).toContain("roženčev odbitek");
    expect(s.noteSi).toContain("TRETJA raziskava na isti parceli");
    expect(s.noteSi).toContain("TRAJNA Belokranjski muzej Metlika");
    expect(s.noteSi).toContain("Žorž, Leghissa 2011, 80–81");
    expect(s.noteSi).toContain("Udovč et al. 2023, 26");
  });

  test("opomba 25-0556: poštenost k. o. Krasinec, negativen, BM Metlika", () => {
    const s = src("fras-masaryk-2026-nno-krasinec-668-1")!;
    expect(s.noteSi).toContain("1543 Krasinec");
    expect(s.noteSi).toContain("ne Griblje");
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("Belokranjski muzej Metlika");
    expect(s.noteEn).toContain("not Griblje");
  });

  test("doplnjena opomba zvkds-cerne-2022-brodaric: 22-0169 vsebina VERIFIED", () => {
    const s = src("zvkds-cerne-2022-brodaric")!;
    expect(s.noteSi).toContain("Doplnilo 103. vala");
    expect(s.noteSi).toContain("05-0033/2022-MiČ-2022-27");
    expect(s.noteSi).toContain("440 najdb");
    expect(s.noteSi).toContain("neolitik (analogije Drulovka I, Čatež–Sredno Polje)");
    expect(s.noteSi).toContain("v vseh šestih testnih sondah");
    expect(s.noteSi).toContain("VERIFIED vsebina (103. val)");
    expect(s.noteEn).toContain("Wave 103 supplement");
    expect(s.noteEn).toContain("VERIFIED content (Wave 103)");
  });
});

describe("val103 · odkritje + popravek vala 102 (zgodba)", () => {
  test("nov odstavek sl: 14/26 prebranih, 24/26 s prenosom, popravek 13-0078, mikroskop 2014–2026", () => {
    expect(mvg083.storySi).toContain("103. val je register raziskav izčrpno prebral");
    expect(mvg083.storySi).toContain("prebranih 14");
    expect(mvg083.storySi).toContain("24 od 26 zapisov");
    expect(mvg083.storySi).toContain("26-0326");
    expect(mvg083.storySi).toContain("26-0379");
    expect(mvg083.storySi).toContain("13-0078 prenos OBSTAJA (ID 26367)");
    expect(mvg083.storySi).toContain("arheološkim mikroskopom");
    expect(mvg083.storySi).toContain("Tri raziskave na isti parceli 15/4 (2019, 2025, 2026)");
    expect(mvg083.storySi).toContain("metalurške delavnice");
    expect(mvg083.storySi).toContain("konkretno datiranimi poznosrednjeveškimi ustji");
    expect(mvg083.storySi).toContain("roženčev odbitek");
    expect(mvg083.storySi).toContain("apnenico na parceli 752");
  });

  test("nov odstavek en (paralelen)", () => {
    expect(mvg083.storyEn).toContain("Wave 103 has read the research register exhaustively");
    expect(mvg083.storyEn).toContain("24 of 26 records");
    expect(mvg083.storyEn).toContain("13-0078 DOES hold a download (ID 26367)");
    expect(mvg083.storyEn).toContain("a lime kiln at parcel 752");
    expect(mvg083.storyEn).toContain("the first concretely dated Late Medieval rims");
    expect(mvg083.storyEn).toContain("the Bela krajina Museum in Metlika");
  });

  test("označevalec dopolnila pri »Muzej išče« (stara trditev ne zastareva tiho)", () => {
    expect(mvg083.storySi).toContain("(Doplnilo 103. vala: poročila kod 2014–2026 z javnimi prenosi so prebrana v celoti");
    expect(mvg083.storySi).toContain("23-0261 — glej spodnji odstavek");
    expect(mvg083.storyEn).toContain("(Wave 103 supplement: the reports of the codes 2014–2026 with public downloads have been read in full");
  });
});

describe("val103 · poštenost", () => {
  test("negativni rezultati z enako težo (4 poročila)", () => {
    const neg = ["tiran-2015-klepec-750-3", "lavrinc-2015-agromelioracija-cerkvisce", "tiran-2016-kanalizacija-g7-1-g7-2", "fras-masaryk-2026-nno-krasinec-668-1"];
    for (const key of neg) {
      expect(src(key)!.noteSi).toContain("NEGATIVEN");
    }
  });

  test("sekundarne lege izrecno (16-0021, 25-0350, 22-0169)", () => {
    expect(src("brecic-2016-kanalizacija-g7-g8")!.noteSi).toContain("transportiran");
    expect(src("gruden-2025-novogradnja-15-4")!.noteSi).toContain("koluvialnih plasteh");
    expect(src("zvkds-cerne-2022-brodaric")!.noteSi).toContain("premešano gradivo");
  });

  test("summary fairness: negativ z enako težo + domneve + popravek 13-0078", () => {
    const f = SUMMARY.fairness.join(" ");
    expect(f).toContain("z enako težo");
    expect(f).toContain("domneve");
    expect(f).toContain("13-0078 IMA javni prenos");
  });
});

describe("val103 · števci + artefakti + docs", () => {
  test("številni prehod: 114 zapisov / 641 citati / 517 identitet / 69 deljenih", () => {
    let cit = 0;
    for (const e of seedExhibits) cit += e.sources.length;
    const keys = [...SOURCE_USAGE.entries()];
    const shared = keys.filter(([, u]) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(cit).toBe(641);
    expect(keys.length).toBe(517);
    expect(shared).toBe(69);
  });

  test("novi viri samo na MVG-083 (ni deljenih v val 103)", () => {
    for (const key of NOVI_VIRI) {
      const s = src(key)!;
      const k = sourceKeyOf(s.nameSi, s.url ?? null);
      const u = SOURCE_USAGE.get(k)!;
      expect(u).toBeTruthy();
      expect(u.exhibits.length).toBe(1);
      expect(u.exhibits[0].slug).toBe(mvg083.slug);
    }
  });

  test("summary.json: 8 poročil, odkritje 24/26, konzistentni ključi", () => {
    expect(SUMMARY.val).toBe(103);
    expect(SUMMARY.porocila_prebrana.length).toBe(8);
    expect(SUMMARY.porocila_prebrana.map((p) => p.koda)).toEqual(KODE);
    expect(SUMMARY.odkritje_vala.raziskave_z_javnim_prenosom).toBe(24);
    expect(SUMMARY.odkritje_vala.raziskave_skupaj).toBe(26);
    expect(SUMMARY.odkritje_vala.prebranih_do_vala_103).toBe(14);
    expect(SUMMARY.odkritje_vala.ostalo_za_val_104.length).toBe(10);
    expect(SUMMARY.vgradnja.novi_viri).toEqual(NOVI_VIRI);
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("641");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("517");
  });

  test("TXT poročil vsebujejo ključne nize (verifikacija vsebin; presledki normalizirani)", () => {
    const txt = (f: string) => norm(readFileSync(join(V103, "porocila", f), "utf8"));
    const t14456 = txt("14-0456.txt");
    expect(t14456).toContain("14-0456");
    expect(t14456).toContain("Klepec - Griblje");
    expect(t14456).toContain("zgrajeno leta 1998");
    expect(t14456).toContain("V strojnem testnem jarku nismo odkrili materialnih ostankov");

    const t150081 = txt("15-0081.txt");
    expect(t150081).toContain("15-0081");
    expect(t150081).toContain("Agromelioracija Griblje - Cerkvišče");
    expect(t150081).toContain("nismo odkrili nobenih najdb ali struktur");

    const t160021 = txt("16-0021.txt");
    expect(t160021).toContain("16-0021");
    expect(t160021).toContain("Kanalizacija Griblje");
    expect(t160021).toContain("železove žlindre");
    expect(t160021).toContain("metalurška delavnica");
    expect(t160021).toContain("nedvomno naselbinskega izvora");

    const t160141 = txt("16-0141.txt");
    expect(t160141).toContain("16-0141");
    expect(t160141).toContain("G7.1 in G7.2");
    expect(t160141).toContain("nismo ugotovili nobenih starejših materialih ostankov");

    const t190007 = txt("19-0007.txt");
    expect(t190007).toContain("19-0007");
    expect(t190007).toContain("TK KABELSKE KANALIZACIJE GRIBLJE, FUČKOVCI");
    expect(t190007).toContain("niso bile odkrite intaktne kulturne plasti");
    expect(t190007).toContain("apnenica");
    expect(t190007).toContain("Klokočovnik 2010");
    expect(t190007).toContain("Štular 2007");

    const t220169 = txt("22-0169.txt");
    expect(t220169).toContain("22-0169");
    expect(t220169).toContain("BRODARIČ, GRIBLJE");
    expect(t220169).toContain("440 najdb");
    expect(t220169).toContain("Drulovka I");
    expect(t220169).toContain("vseh petih testnih sondah");
    expect(t220169).toContain("Mason 2009");

    const t250350 = txt("25-0350.txt");
    expect(t250350).toContain("25-0350");
    expect(t250350).toContain("213 najdb v skupni masi 2271 g");
    expect(t250350).toContain("82 %");
    expect(t250350).toContain("Belokranjski muzej Metlika");

    const t250556 = txt("25-0556.txt");
    expect(t250556).toContain("25-0556");
    expect(t250556).toContain("arheoloških ostalin nismo prepoznali");
    expect(t250556).toContain("Belokranjski muzej Metlika");
  });

  test("artefakti: sha256 TXT + PDF ujemajo s porocila/sha256.txt", () => {
    const shaTxt = readFileSync(join(V103, "porocila", "sha256.txt"), "utf8");
    const shaPdf = readFileSync(join(V103, "porocila", "sha256-pdf.txt"), "utf8");
    for (const p of SUMMARY.porocila_prebrana) {
      expect(sha256(join(V103, "porocila", `${p.koda}.txt`))).toBe(p.txt_sha256);
      expect(shaTxt).toContain(p.txt_sha256);
      // sha256-pdf.txt nosi hashe vseh 8 PDF — tudi izbrisanih velikih (19-0007, 22-0169, 25-0350)
      expect(shaPdf).toContain(p.sha256_pdf);
    }
  });

  test("docs: summary + report 118 + KAZALO vnos + README 157. sklop", () => {
    const report = readFileSync(join(RG, "118-val103-issue72-porocila-preostanek.md"), "utf8");
    expect(report).toContain("103. val");
    expect(report).toContain("25-0350");
    expect(report).toContain("24 od 26");
    expect(report).toContain("val 104");

    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("118-val103-issue72-porocila-preostanek.md");

    const readme = readFileSync("README.md", "utf8");
    expect(readme).toContain("157. sklop");
    expect(readme).toContain("14/26 RAZISKAV E-ARHEOLOGIJE PREBRANIH");
    expect(readme).toContain("114 zapisov (MVG-001–114), 641 virov, 517 identitet, 69 deljenih");
    // zgodovinski posnetek starejšega sklopa ostaja (namerno nespremenjen)
    expect(readme).toContain("113 zapisov · 588 virov");
  });
});
