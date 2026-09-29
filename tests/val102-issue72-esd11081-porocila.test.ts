/**
 * Val 102 — ISSUE #72: izvorna registrska enota EŠD 11081/10094 (GISKD API),
 * register raziskav eArheologija (26 zapisov, 2013–2026) + javni eSDE prenosi
 * prvih poročil — 6 poročil prebranih v celoti.
 *
 * Kaj ta datoteka varuje:
 *  1. REGISTRSKI VPISI: EID 1-11081 (vpis 30. 10. 2001, 11,3 ha, meja NI
 *     določena, 0 raziskav) in EID 1-10094 (vpis 20. 8. 2002, 316,57 ha,
 *     meja na DKN, 26 raziskav) — prostorska primerjava iz issue #72.
 *  2. E-ARHEOLOGIJA: nove kode raziskav (14-0456 … 26-0379) + javni prenos
 *     poročil ised.gov.si (razrešitev vala 95).
 *  3. VSEBINE POROČIL: Kisapostag (21-0432), lengyel sekundarno (23-0070,
 *     26-0036), hodna površina + Ha A (21-0141), koluvij brez struktur
 *     (23-0047), NEGATIVEN rezultat (23-0168) — negativno z enako težo.
 *  4. POPRAVEK vala 95 z audit trailom: Udovč/Černe/Kramberger 2023 =
 *     poročilo koda 23-0070 (NI četrtih raziskav 2023).
 *  5. POŠTENOST: ne ustvarjati poligonov/koordinat iz točkovnelege;
 *     neskladje datumov 23-0070 (junij vs »julij«); neskladje letnice
 *     VS 48 (2011 vs 2013) = REVIEW; BM Metlika = hramba arhivov po
 *     navedbah poročil; Dular 1972 + BM zbirka ostajata TO_COLLECT.
 *  6. ŠTEVCI: izrecen prehod 114 / 634 / 510 / 69.
 *
 * Protokol issue #72: brez podvajanja (rg kontrola = 0 zadetkov za nove
 * kode/kulture pred vgradnjo), vsak finding s statusom.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

const RG = join(process.cwd(), "research-griblje");
const V102 = join(RG, "val102");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  task: string;
  datum: string;
  register_enote: Record<string, Record<string, unknown>>;
  porocila_prebrana: {
    koda: string;
    datoteka: string;
    strani: number;
    sha256_pdf: string;
    esde_id: number;
    kljucne_ugotovitve: string[];
  }[];
  brez_podvajanja: Record<string, unknown>;
  vgradnja: {
    novi_viri: string[];
    posodobitve: string[];
    zgodbe: string[];
    prehod_stevcev: string;
  };
  fairness: string[];
};

const SUMMARY = JSON.parse(readFileSync(join(V102, "summary.json"), "utf8")) as Sum;

const mvg083 = seedExhibits.find((e) => e.museumNo === "MVG-083")!;
const src = (key: string) => mvg083.sources?.find((s) => s.key === key)!;

const NOVI_VIRI = [
  "rnkd-giskd-units-10094-11081",
  "earheologija-raziskave-10094",
  "avgusta-2021-krasinec-668",
  "lavrinc-2023-krasinec-2957-201-1",
  "lorber-tiran-2023-piskuric-798-14",
  "udovc-orehek-2026-mahmoutovic-15-4",
];

describe("val102 · registrska enota po GISKD API", () => {
  test("nov vir rnkd-giskd-units-10094-11081 nosi oba vpisa z datumi", () => {
    const s = src("rnkd-giskd-units-10094-11081");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("EID 1-11081");
    expect(s.noteSi).toContain("30. 10. 2001");
    expect(s.noteSi).toContain("11,3 ha");
    expect(s.noteSi).toContain("območje ni določeno");
    expect(s.noteSi).toContain("EID 1-10094");
    expect(s.noteSi).toContain("20. 8. 2002");
    expect(s.noteSi).toContain("316,57 ha");
    expect(s.noteSi).toContain("meja je določena na DKN");
    expect(s.noteSi).toContain("0 lastnih raziskovalnih zapisov");
  });

  test("esd-11081-pozekov-vrt: izvorna registrska enota prebrana (REVIEW → VERIFIED)", () => {
    const s = src("esd-11081-pozekov-vrt");
    expect(s.noteSi).toContain("izvorna registrska enota PREBRANA po uradnem GISKD API-ju");
    expect(s.noteSi).toContain("30. 10. 2001");
    expect(s.noteEn).toContain("30 Oct 2001");
    expect(s.noteSi).toContain("GISKD API, 102. val");
  });

  test("poštenost: točkovna lega ≠ poligon — muzej ne ustvarja koordinat", () => {
    const s = src("rnkd-giskd-units-10094-11081");
    expect(s.noteSi).toContain("NE ustvarja poligonov ali koordinat najdišča");
    expect(s.noteEn).toContain("creates NO polygons or site coordinates");
    // točkovni atributi so registrski, ne muzejska zemljevidna trditev
    expect(s.noteSi).toContain("registrski atributi, ne kot muzejska zemljevidna trditev");
  });

  test("prostorska primerjava issue #72: 11081 brez poligona/raziskav, 10094 z DKN mejo in 26 raziskavami", () => {
    const s = src("esd-11081-pozekov-vrt");
    expect(s.noteSi).toContain("ločena enota je raven evidentiranja zgodnjih 2000-ih, ne ločenega najdišča");
    const r = src("rnkd-giskd-units-10094-11081");
    expect(r.noteSi).toContain("0 lastnih raziskovalnih zapisov");
  });
});

describe("val102 · register raziskav eArheologija", () => {
  test("nov vir earheologija-raziskave-10094: 26 zapisov 2013–2026 + javni prenos", () => {
    const s = src("earheologija-raziskave-10094");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("26 zapisov prebranih po uradnem API-ju");
    expect(s.noteSi).toContain("https://ised.gov.si/api/javna/neavtoriziran/arheo/prvo_porocilo/files/{ID}/download");
    expect(s.noteSi).toContain("vrzel razrešena brez prijave");
    expect(s.noteEn).toContain("resolved without a login");
  });

  test("nove kode raziskav navedene (14-0456 … 26-0379)", () => {
    const s = src("earheologija-raziskave-10094");
    for (const koda of ["14-0456", "15-0081", "16-0021", "16-0141", "19-0007", "22-0169", "23-0047", "25-0350", "25-0556", "26-0036", "26-0326", "26-0379"]) {
      expect(s.noteSi).toContain(koda);
    }
    expect(s.noteSi).toContain("26-0379");
    expect(s.noteSi).toContain("NAPREDITA");
  });

  test("starejše raziskave 1999–2012 NISU v eArheologiji (pošteno zapisano)", () => {
    const s = src("earheologija-raziskave-10094");
    expect(s.noteSi).toContain("1999–2012 v eArheologiji NISU");
  });

  test("cerne-2022: koda 22-0169 + datumi + neskladje Veršnik", () => {
    const s = src("zvkds-cerne-2022-brodaric");
    expect(s.noteSi).toContain("22-0169");
    expect(s.noteSi).toContain("25. 5.–7. 6. 2022");
    expect(s.noteSi).toContain("NENAVAJA soavtorja Veršnika");
    expect(s.noteEn).toContain("does NOT list the co-author Veršnik");
  });
});

describe("val102 · vsebina prebranih poročil", () => {
  test("21-0141 Klepec: hodna površina, začetek pozne bronaste dobe, Ha A, brez Oloris", () => {
    const s = src("tiran-2021-klepec-krasinec");
    expect(s.noteSi).toContain("PREBRANO v celoti");
    expect(s.noteSi).toContain("hodna površina SE 003");
    expect(s.noteSi).toContain("9,6 m²");
    expect(s.noteSi).toContain("Ha A");
    expect(s.noteSi).toContain("Oloris–Podsmreka v tem jarku NI");
    expect(s.noteSi).toContain("29033");
  });

  test("21-0432 Jakofčič: Kisapostag, zgodnja bronasta doba, 265 najdb, žrmlji", () => {
    const s = src("avgusta-2021-krasinec-668");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("KISAPOSTAG");
    expect(s.noteSi).toContain("zgodnje bronaste dobe");
    expect(s.noteSi).toContain("265 najdb");
    expect(s.url).toContain("40880");
    expect(s.noteSi).toContain("obe oznaki zapisani"); // register vs poročilo
  });

  test("23-0047: koluvij brez struktur — sekundarna lega zapisana kot sekundarna", () => {
    const s = src("lavrinc-2023-krasinec-2957-201-1");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("BREZ struktur");
    expect(s.noteSi).toContain("sekundarna lega");
    expect(s.noteSi).toContain("Dular 1985, str. 75–76");
    expect(s.url).toContain("33076");
  });

  test("23-0168 Piškurič: NEGATIVEN rezultat z enako težo + hramba BM Metlika", () => {
    const s = src("lorber-tiran-2023-piskuric-798-14");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("NEGATIVEN");
    expect(s.noteSi).toContain("z enako težo kot pozitivne");
    expect(s.noteSi).toContain("Belokranjski muzej Metlika");
    // neskladje letnice VS 48 ostaja REVIEW, ne utišano
    expect(s.noteSi).toContain("REVIEW");
    expect(s.noteSi).toContain("2013");
  });

  test("26-0036 Mahmoutović: lengyel + MBA/LBA + pitos; najnovejše poročilo 2026", () => {
    const s = src("udovc-orehek-2026-mahmoutovic-15-4");
    expect(s).toBeTruthy();
    expect(s.noteSi).toContain("NAJNOVEJŠE prebrano poročilo");
    expect(s.noteSi).toContain("LENGYELSKE KULTURE");
    expect(s.noteSi).toContain("pitos");
    expect(s.url).toContain("89129");
    expect(s.noteSi).toContain("proti ZAHODU");
  });

  test("23-0070 Brodarič (popravek vala 95): Udovč 2023 = koda 23-0070, vitovitiška + lengyel", () => {
    const s = src("zvkds-udovc-2023-brodaric");
    expect(s.noteSi).toContain("IZRECEN POPRAVEK 102. vala");
    expect(s.noteSi).toContain("NAPAČNA in se umika");
    expect(s.noteSi).toContain("22-0033 Brodarič, ARG");
    expect(s.noteSi).toContain("vitovitiška skupina (Bd C–Bd D)");
    expect(s.noteSi).toContain("lengyelske kulture");
    expect(s.noteSi).toContain("4800/4700–4350");
    // neskladje datumov junij vs julij izrecno
    expect(s.noteSi).toContain("julija 2023");
  });
});

describe("val102 · zgodba MVG-083 (sl+en)", () => {
  test("nov odstavek sl: kronometer 2013–2026, predmeti po parcelah, negativ, datumi vpisov, BM", () => {
    expect(mvg083.storySi).toContain("26 raziskovalnih zapisov od leta 2013 do 2026");
    expect(mvg083.storySi).toContain("vitovitiška skupina, Bd C–D");
    expect(mvg083.storySi).toContain("lengyelske kulture");
    expect(mvg083.storySi).toContain("Kisapostag");
    expect(mvg083.storySi).toContain("Ha A");
    expect(mvg083.storySi).toContain("zapisan z enako težo");
    expect(mvg083.storySi).toContain("vpisana 20. 8. 2002");
    expect(mvg083.storySi).toContain("vpisana 30. 10. 2001");
    expect(mvg083.storySi).toContain("Belokranjski muzej v Metliki");
  });

  test("nov odstavek en (paralelen)", () => {
    expect(mvg083.storyEn).toContain("26 research records for the unit from 2013 to 2026");
    expect(mvg083.storyEn).toContain("Vitovice group, Bd C–D");
    expect(mvg083.storyEn).toContain("Lengyel culture");
    expect(mvg083.storyEn).toContain("Kisapostag");
    expect(mvg083.storyEn).toContain("the Bela krajina Museum in Metlika");
  });

  test("označevalec dopolnila pri TO_COLLECT stavku (stara trditev ne zastareva tiho)", () => {
    expect(mvg083.storySi).toContain("(Doplnilo 102. vala: šest prvih poročil je zdaj prebranih v celoti");
    expect(mvg083.storyEn).toContain("(Wave 102 supplement: six first reports have now been read in full");
  });
});

describe("val102 · števci + artefakti + docs", () => {
  test("številni prehod: 114 zapisov / 634 citati / 510 identitet / 69 deljenih", () => {
    let cit = 0;
    for (const e of seedExhibits) cit += e.sources.length;
    const keys = [...SOURCE_USAGE.entries()];
    const shared = keys.filter(([, u]) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(cit).toBe(634);
    expect(keys.length).toBe(510);
    expect(shared).toBe(69);
  });

  test("novi viri samo na MVG-083 (ni deljenih v val 102)", () => {
    for (const key of NOVI_VIRI) {
      const s = src(key)!;
      const k = sourceKeyOf(s.nameSi, s.url ?? null);
      const u = SOURCE_USAGE.get(k)!;
      expect(u).toBeTruthy();
      expect(u.exhibits.length).toBe(1);
      expect(u.exhibits[0].slug).toBe(mvg083.slug);
    }
  });

  test("summary.json: 6 poročil, konzistentni ključi", () => {
    expect(SUMMARY.val).toBe(102);
    expect(SUMMARY.porocila_prebrana.length).toBe(6);
    expect(SUMMARY.vgradnja.novi_viri).toEqual(NOVI_VIRI);
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("634");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("510");
  });

  test("artefakti na disku z ujemajočimi sha256 (komittani PDF + TXT)", () => {
    const p1 = SUMMARY.porocila_prebrana.find((p) => p.koda === "21-0141")!;
    const p2 = SUMMARY.porocila_prebrana.find((p) => p.koda === "23-0168")!;
    expect(sha256(join(V102, "porocila", "21-0141-klepec-krasinec-2957.pdf"))).toBe(p1.sha256_pdf);
    expect(sha256(join(V102, "porocila", "23-0168-arhat-2023.pdf"))).toBe(p2.sha256_pdf);
    // TXT vsi šest
    for (const t of [
      "porocila/21-0141-klepec-krasinec-2957.txt",
      "porocila/21-0432-avgusta-668.txt",
      "porocila/23-0047-lavrinc-2023.txt",
      "porocila/23-0070-brodaric-67-3.txt",
      "porocila/23-0168-arhat-2023.txt",
      "porocila/26-0036-mahmoutovic-15-4.txt",
    ]) {
      expect(() => readFileSync(join(V102, t))).not.toThrow();
    }
    // registri JSON
    for (const j of ["rnpd-11081-query.json", "rnpd-10094-query.json", "arheo-3692-10094.json", "arheo-3692-11081.json"]) {
      expect(() => readFileSync(join(V102, j))).not.toThrow();
    }
    expect(() => readFileSync(join(V102, "sha256.txt"))).not.toThrow();
  });

  test("TXT poročil vsebujejo ključne nize (verifikacija vsebin; presledki normalizirani)", () => {
    const norm = (s: string) => s.replace(/\s+/g, " ");
    const k21_0141 = norm(readFileSync(join(V102, "porocila/21-0141-klepec-krasinec-2957.txt"), "utf8"));
    expect(k21_0141).toContain("hodno površino");
    expect(k21_0141).toContain("nažlebljene keramike");
    expect(k21_0141).toContain("Oloris – Podsmreka");
    const k21_0432 = norm(readFileSync(join(V102, "porocila/21-0432-avgusta-668.txt"), "utf8"));
    expect(k21_0432).toContain("Kisapostag");
    expect(k21_0432).toContain("265 najdb");
    const k23_047 = norm(readFileSync(join(V102, "porocila/23-0047-lavrinc-2023.txt"), "utf8"));
    expect(k23_047).toContain("koluvijalni");
    expect(k23_047).toContain("Belokranjski muzej Metlika");
    const k23_070 = norm(readFileSync(join(V102, "porocila/23-0070-brodaric-67-3.txt"), "utf8"));
    expect(k23_070).toContain("lengyelske kulture");
    expect(k23_070).toContain("vitovitiške skupine");
    expect(k23_070).toContain("6. 6. 2023 - 15. 6. 2023");
    const k23_168 = norm(readFileSync(join(V102, "porocila/23-0168-arhat-2023.txt"), "utf8"));
    expect(k23_168).toContain("nismo prepoznali arheološko relevantnih");
    expect(k23_168).toContain("Varstvo spomenikov 48");
    const k26_036 = norm(readFileSync(join(V102, "porocila/26-0036-mahmoutovic-15-4.txt"), "utf8"));
    expect(k26_036).toContain("lengyelske kulture");
    expect(k26_036).toContain("pitos");
  });

  test("docs: summary + report 117 + KAZALO vnos", () => {
    const doc = readFileSync(join(RG, "117-val102-issue72-esd11081-porocila.md"), "utf8");
    expect(doc).toContain("**Val:** 102");
    expect(doc).toContain("ISSUE #72");
    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("117-val102-issue72-esd11081-porocila.md");
  });

  test("fairness iz summary: negativ z enako težo; ne poligonov; popravki izrecni; TO_COLLECT ostaja", () => {
    const f = SUMMARY.fairness.join(" ");
    expect(f).toContain("negativni rezultat 23-0168");
    expect(f).toContain("ne ustvarja poligonov ali koordinat");
    expect(f).toContain("popravek vala 95");
    expect(f).toContain("TO_COLLECT");
  });
});
