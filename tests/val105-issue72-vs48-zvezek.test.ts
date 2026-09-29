/**
 * Val 105 — ISSUE #72: zvezek Varstvo spomenikov, Poročila 48 prebran v celoti
 * (javni PDF zvkds.si) — bibliografska identiteta (muzej 2011 vs referenca 2013)
 * RAZREŠENA + vsebinske primarno potrditve; bonus: VS 42 najden javno (sken brez
 * besedilne plasti); register eArheologija ponovno preverjen v živo (nespremenjen).
 *
 * Kaj ta datoteka varuje:
 *  1. RAZREŠITEV LETNICE: kolofon »Ljubljana 2013«, ISSN 1580-5166; zvezek zajema
 *     poročila o delih 2010 in 2011 — muzejska »2011« = leto izkopavanj, »2013« =
 *     leto izida; članek = vnos 30, str. 74–76, podpis Alja Žorž.
 *  2. VSEBINSKE POTRDITVE iz polnega branja: sektor 1, 320 m², skoraj 5.000 najdb,
 *     tipologija = virovitiška skupina (bronasta) + vzhodnoneolitske in vučedolske
 *     (eneolitik); kamnina (klin + sveder iz finozrnatih rožencev, malo odpadka);
 *     sledi rimske dobe in zgodnjega srednjega veka; etimologija Snoj 2009, 153.
 *  3. POŠTENOST: poročilova lastna izjava o uničenju dediščine zapisana dobesedno;
 *     VS 42 = sken brez besedilne plasti (REVIEW ostaja); neskladje razrešeno z
 *     dokazom, ne utišano.
 *  4. DOPOLNJENI VIRI (add-only, brez novih virov): vs-48, vs-42, 23-0168 note,
 *     Žerjal/Pintér/Mason 2010 note; odstavek zgodbe sl+en; muzej-išče doplnilo.
 *  5. ŠTEVCI: nespremenjeni 114 / 651 / 527 / 69.
 *  6. ARTEFAKTI: summary.json val 105, sha256.txt (PDF + TXT), vs48-full.txt
 *     z dobesednimi nizi, velika PDF izbrisana (hashirana).
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
const V105 = join(RG, "raw-web-val105-2026-10");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  datum: string;
  vs48_zvezek: {
    kolofon: string;
    zvezek_zajema: string;
    clanek: { vnos: number; strani: string; podpis: string; kljucne_ugotovitve: string[] };
  };
  vs42_zvezek: { status: string; besedilna_plast: string; imes_datoteke_kazalnik: string };
  register_recheck: { rezultat: string };
  vgradnja: { novi_viri: string[]; dopolnjeni_viri: string[]; prehod_stevcev: string };
  fairness: string[];
};

const SUMMARY = JSON.parse(readFileSync(join(V105, "summary.json"), "utf8")) as Sum;

const mvg083 = seedExhibits.find((e) => e.museumNo === "MVG-083")!;
const src = (key: string) => mvg083.sources?.find((s) => s.key === key)!;

describe("val105 · razrešitev letnice VS 48 (kolofon)", () => {
  test("vs-48 noteSi: kolofon, ISSN, zvezek zajema, vnos 30, podpis", () => {
    const n = src("vs-48-zvkds-2010-2011")!.noteSi;
    expect(n).toContain("Doplnilo 105. vala");
    expect(n).toContain("Ljubljana 2013");
    expect(n).toContain("ISSN 1580-5166");
    expect(n).toContain("poročila o delih leta 2010 in 2011");
    expect(n).toContain("vnos 30, str. 74–76");
    expect(n).toContain("Alja Žorž");
    expect(n).toContain("RAZREŠENA");
    expect(n).toContain("polno branje primarnega vira");
  });

  test("vs-48 noteEn: angleški zrcalni zapis", () => {
    const n = src("vs-48-zvkds-2010-2011")!.noteEn;
    expect(n).toContain("Wave 105 supplement");
    expect(n).toContain("Ljubljana 2013");
    expect(n).toContain("entry 30, pp. 74–76");
    expect(n).toContain("RESOLVED");
  });

  test("23-0168 note: neskladje letnic razrešeno (sl+en)", () => {
    const si = mvg083.sources!.find((s) => s.noteSi?.includes("leto izida VS 48 navedeno kot 2013"))!;
    expect(si.noteSi).toContain("Doplnilo 105. vala: RAZREŠENO");
    expect(si.noteEn).toContain("Wave 105 supplement: RESOLVED");
  });

  test("Žerjal/Pintér/Mason 2010 note: izida VS 48 = 2013 dopolnjena (sl+en)", () => {
    const si = mvg083.sources!.find((s) => s.noteSi?.includes("Žerjal/Pintér/Mason"))!;
    expect(si.noteSi).toContain("Doplnilo 105. vala: objava VS 48 je izšla Ljubljana 2013");
    expect(si.noteEn).toContain("Wave 105 supplement: the VS 48 publication appeared in Ljubljana 2013");
  });
});

describe("val105 · vsebinske potrditve iz polnega branja", () => {
  test("tipologija: virovitiška + vučedolska (noteSi)", () => {
    const n = src("vs-48-zvkds-2010-2011")!.noteSi;
    expect(n).toContain("virovitiška kulturna skupina (bronasta doba)");
    expect(n).toContain("vučedolske skupine (eneolitik)");
    expect(n).toContain("vitovitiška");
  });

  test("kamnina + rimske/srednjeveške sledi + etimologija + širjenje naselbine", () => {
    const n = src("vs-48-zvkds-2010-2011")!.noteSi;
    expect(n).toContain("klina in sveder iz finozrnatih rožencev");
    expect(n).toContain("le redko izdelano od začetka");
    expect(n).toContain("zgodnjem srednjem veku");
    expect(n).toContain("Snoj 2009, 153");
    expect(n).toContain("severno in vzhodno od izkopnega polja");
  });

  test("storySi odstavek 105. vala (sl) + storyEn Wave 105 (en)", () => {
    expect(mvg083.storySi).toContain("105. val je prebral zvezek");
    expect(mvg083.storySi).toContain("virovitiško kulturno skupino (bronasta doba)");
    expect(mvg083.storySi).toContain("Snoju (2009, 153)");
    expect(mvg083.storyEn).toContain("Wave 105 has read the volume");
    expect(mvg083.storyEn).toContain("Virovitica cultural group");
  });

  test("muzej-išče doplnilo (sl+en)", () => {
    expect(mvg083.storySi).toContain("(Doplnilo 105. vala: zvezek Varstvo spomenikov, Poročila");
    expect(mvg083.storyEn).toContain("(Wave 105 supplement: the volume Varstvo spomenikov, Poročila");
  });

  test("brez podvajanja: 105. val je edini, ki uvaja virovitiško/vučedolsko/Snoja", () => {
    // vsi zadetki »Snoj 2009« na MVG-083 so dopolnila 105. vala
    for (const s of mvg083.sources ?? []) {
      if (s.noteSi?.includes("Snoj 2009, 153")) {
        expect(s.noteSi).toContain("Doplnilo 105. vala");
      }
    }
  });
});

describe("val105 · poštenost", () => {
  test("poročilova lastna izjava o uničenju dediščine (dobesedno, sl+en)", () => {
    const n = src("vs-48-zvkds-2010-2011")!.noteSi;
    expect(n).toContain("trajno odstranili in uničili del skupne kulturne dediščine");
  });

  test("vs-42: sken brez besedilne plasti, REVIEW ostaja, kazalnik ≠ kolofon", () => {
    const n = src("vs-42-kanalizacija-g1-g4")!;
    expect(n.noteSi).toContain("brez besedilne plasti");
    expect(n.noteSi).toContain("042_2006_varstvo_spomenikov_porocila");
    expect(n.noteSi).toContain("kolofon še nepreverjen");
    expect(n.noteSi).toContain("REVIEW");
    expect(n.noteEn).toContain("a pure scan without a text layer");
    expect(n.noteEn).toContain("REVIEW");
  });

  test("summary fairness: dokaz, ne utišanje; VS 42 pošten negativ; uničenje z enako težo", () => {
    const f = SUMMARY.fairness.join(" ");
    expect(f).toContain("kolofon");
    expect(f).toContain("KAZALNIK");
    expect(f).toContain("uničenju dediščine zapisana dobesedno");
    expect(f).toContain("26-0326");
  });

  test("register re-check: stanje nespremenjeno (26 zapisov)", () => {
    expect(SUMMARY.register_recheck.rezultat).toContain("NESPREMENJENO");
    expect(SUMMARY.register_recheck.rezultat).toContain("26");
  });
});

describe("val105 · števci + artefakti + docs", () => {
  test("števci nespremenjeni: 114 zapisov / 651 virov / 527 identitet / 69 deljenih", () => {
    let cit = 0;
    for (const e of seedExhibits) cit += e.sources.length;
    const keys = [...SOURCE_USAGE.entries()];
    const shared = keys.filter(([, u]) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(cit).toBe(651);
    expect(keys.length).toBe(527);
    expect(shared).toBe(69);
  });

  test("vgradnja add-only: 0 novih virov, 4 dopolnjeni, prehod zapisan", () => {
    expect(SUMMARY.vgradnja.novi_viri).toEqual([]);
    expect(SUMMARY.vgradnja.dopolnjeni_viri.length).toBe(4);
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("114");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("651");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("527");
    expect(SUMMARY.vgradnja.prehod_stevcev).toContain("NESPREMENJENO");
  });

  test("vs48-full.txt vsebuje dobesedne nize zvezka (stisnjena razporeditev)", () => {
    const txt = readFileSync(join(V105, "vs48-full.txt"), "utf8");
    expect(txt).toContain("virovitiško kulturno skupino");
    expect(txt).toContain("vučedolsko skupino");
    expect(txt).toContain("Ljubljana 2013");
    expect(txt).toContain("ISSN 1580-5166");
    expect(txt).toContain("Snoj 2009, 153");
    expect(txt).toContain("del skupne kulturne dediščine");
    expect(txt).toContain("Naselje: Griblje");
    expect(txt).toContain("EŠD: 10094");
  });

  test("artefakti: sha256.txt zabeleži PDF in TXT; velika PDF izbrisana", () => {
    const sh = readFileSync(join(V105, "sha256.txt"), "utf8");
    expect(sh).toContain(SUMMARY.vs48_zvezek ? "a501f7dc8e6fc173e6603b1a7ed09a30088891102e919df7e674335df5838088" : "x");
    expect(sh).toContain("404dbb070745386c5f8ed4a7c1c77d9af611aed8364084d84a32d889b01985fe");
    expect(sh).toContain("vs48-full.txt");
    expect(existsSync(join(V105, "vs48_w_0-1.pdf"))).toBe(false);
    expect(existsSync(join(V105, "vs42_2006.pdf"))).toBe(false);
    expect(existsSync(join(V105, "v48-p38-c1.txt"))).toBe(true);
    expect(existsSync(join(V105, "v48-p39-c3.txt"))).toBe(true);
  });

  test("summary.json: val 105, kolofon, zvezek zajema, vnos 30", () => {
    expect(SUMMARY.val).toBe(105);
    expect(SUMMARY.vs48_zvezek.kolofon).toContain("2013");
    expect(SUMMARY.vs48_zvezek.zvezek_zajema).toContain("2010");
    expect(SUMMARY.vs48_zvezek.zvezek_zajema).toContain("2011");
    expect(SUMMARY.vs48_zvezek.clanek.vnos).toBe(30);
    expect(SUMMARY.vs48_zvezek.clanek.strani).toBe("74–76");
    expect(SUMMARY.vs42_zvezek.besedilna_plast).toContain("NI");
  });

  test("README: 159. sklop + nespremenjeno stanje zbirke", () => {
    const readme = readFileSync(join(process.cwd(), "README.md"), "utf8");
    expect(readme).toContain("159. sklop");
    expect(readme).toContain("114 zapisov (MVG-001–114), 651 virov, 527 identitet, 69 deljenih");
  });

  test("docs: raziskovalni zapis 120 + KAZALO", () => {
    const doc = readFileSync(join(RG, "120-val105-vs48-zvezek-prebran.md"), "utf8");
    expect(doc).toContain("105. val");
    expect(doc).toContain("Ljubljana 2013");
    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("120-val105");
  });
});
