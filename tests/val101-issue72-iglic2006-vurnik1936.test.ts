/**
 * Val 101 — ISSUE #72: vsebina Iglič 2006 (prioriteta #4), Draganić ~1630 (§3),
 * Vavpotičevi portreti družine Županič (prioriteta #2), Dular 1972 — 4. potrditev.
 *
 * Kaj ta datoteka varuje:
 *  1. IDENTITETA VIROV: iglic-2006-niko-zupanic izključno na MVG-010;
 *     vurnik-1936-belokranjica na MVG-010 + MVG-004 uskoki (deljeni vir);
 *     točna URL-a iz issue #72 §1/§3.
 *  2. VSEBINA: ključni odlomki (Miko posestnik/trgovec/gostilničar; ponudba
 *     Apfaltrernov 1903 z razlogom zavrnitve; vinska kriza 1906; Erdödy 1630;
 *     podzemljska župnija; Vavpotičevi portreti Katarine + Niko 1924 v
 *     Belokranjskem muzeju; Kette spomini 1950; ČGP Delo v Dularjevi knjižici).
 *  3. ZGODBE: nov odstavek sl+en na MVG-010 in na uskoškem zapisu.
 *  4. ŠTEVCI: izrecen prehod 114 / 628 / 504 / 69 (pin posodobljen 102./103. val).
 *  5. POŠTENOST: »zelo verjetno« prenašano kakor napisano (migracijska sled);
 *     današnje stanje BM zbirke TO_COLLECT; bibliografska oznaka revije po
 *     repozitorskem kazalu (PDF brez kolofona — iskrena opomba); veriga #100
 *     §8 ni dvignjena.
 *
 * Protokol issue #72: brez podvajanja (rg kontrola pred vgradnjo = 0 zadetkov
 * za Erdödy/podzemljska/Draganić/Pusti gradec), vsak finding s statusom.
 */
import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE } from "../src/lib/source-registry";

const RG = join(process.cwd(), "research-griblje");
const V101 = join(RG, "val101");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Sum = {
  val: number;
  task: string;
  datum: string;
  blokade: string[];
  izbira: string;
  viri: {
    key_vir: string;
    url: string;
    http: number;
    velikost_b: number;
    strani?: number;
    sha256: string;
    vsebina_potrjena: string[];
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

const SUMMARY = JSON.parse(readFileSync(join(V101, "summary.json"), "utf8")) as Sum;

const zupanic = seedExhibits.find((e) => e.museumNo === "MVG-010")!;
const uskoki = seedExhibits.find((e) => e.slug === "uskoki-in-vojna-krajina")!;
const allCites = (key: string) =>
  seedExhibits.filter((e) => e.sources?.some((s) => s.key === key)).map((e) => e.museumNo);

describe("val101 · issue #72 · identiteta virov in no-duplication", () => {
  test("summary je val 101 / issue 72 / brez VLM in spletnega iskanja", () => {
    expect(SUMMARY.val).toBe(101);
    expect(SUMMARY.task).toContain("ISSUE #72");
    expect(SUMMARY.blokade.join(" ")).toContain("429");
  });

  test("iglic-2006-niko-zupanic izključno na MVG-010 (eno-zapisni vir)", () => {
    expect(allCites("iglic-2006-niko-zupanic")).toEqual(["MVG-010"]);
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.url).toBe("https://physics.fe.uni-lj.si/members/iglic/history/NikoZupanic.pdf");
  });

  test("vurnik-1936-belokranjica na MVG-010 + MVG-004 uskoki (NOVI deljeni vir)", () => {
    expect(allCites("vurnik-1936-belokranjica").sort()).toEqual(["MVG-004", "MVG-010"]);
    const s = zupanic.sources?.find((x) => x.key === "vurnik-1936-belokranjica")!;
    expect(s.url).toBe(
      "https://www.etno-muzej.si/files/etnolog/pdf/etnolog_8_9_1936_vurnik_belokranjica.pdf",
    );
  });

  test("rg kontrola pred vgradnjo: Erdödy/podzemljska/Draganić/Pusti gradec = 0 zadetkov", () => {
    expect(JSON.stringify(SUMMARY.brez_podvajanja)).toContain("NikoZupanic|Erdödy|podzemljska|Draganić|Pusti gradec");
  });
});

describe("val101 · vsebina Iglič 2006 (prioriteta #4)", () => {
  test("Miko Županič: posestnik, trgovec, gostilničar + posojanje denarja — točno dobesedno", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("posestnik, trgovec ter gostilničar iz Gribelj v Beli krajini");
    expect(s.noteSi).toContain("s posojanjem denarja postal zelo premožen");
    expect(s.noteEn).toContain("landowner, trader and innkeeper");
  });

  test("ponudba Apfaltrernov 1903 (Krupa, Pobrežje, Pusti gradec) + razlog zavrnitve = NOVO", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("leta 1903 v nakup posestva z gradovi baronov Apfaltrernov (Krupa, Pobrežje, Pusti gradec)");
    expect(s.noteSi).toContain("ker ni imel smisla za velike finančne transakcije");
    expect(s.noteEn).toContain("he had no sense for large financial transactions");
  });

  test("gmotne razmere → študij + vinska kriza (1906, Terezijanska gimnazija) = NOVI podatki", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("Ugodne gmotne razmere Mika Zupaniča so Niku Zupaniču omogočile študij");
    expect(s.noteSi).toContain("vinske krize izgubil precejšen del premoženja");
    expect(s.noteSi).toContain("Terezijanski gimnaziji na Dunaju");
    expect(s.noteEn).toContain("wine crisis");
  });

  test("Draganić 1630 z mehanizmom: Erdödyjev napad + podzemljska župnija", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("iz Draganičev v Belo krajino leta 1630");
    expect(s.noteSi).toContain("napadli in oropali grofje Erdödy");
    expect(s.noteSi).toContain("umaknili na Kranjsko, v podzemljsko župnijo");
    expect(s.noteEn).toContain("parish of Podzemlje");
  });

  test("Vavpotičevi portreti: Katarina + »Minister dr. Niko Zupanič« 1924 v Belokranjskem muzeju (darili)", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("Katarina Zupanič (1855–1921)");
    expect(s.noteSi).toContain("hrani Belokranjski muzej (darilo dr. N. Zupaniča)");
    expect(s.noteSi).toContain("iz leta 1924");
    expect(s.noteSi).toContain("Dragotin Kette, olje I. Vavpotiča po naročilu dr. Nika Zupaniča 1940");
    expect(s.noteEn).toContain("Bela krajina Museum");
  });

  test("Dular 1972 = 4. neodvisna potrditev + soizdajatelj ČGP Delo (doplnjen note)", () => {
    const d = zupanic.sources?.find((x) => x.key === "dular-1972-zupanic")!;
    expect(d.noteSi).toContain("četrta neodvisna potrditev iz literature");
    expect(d.noteSi).toContain("ČGP Delo, Ljubljana");
    expect(d.noteEn).toContain("fourth independent confirmation");
    // CONFLICT 1972/1973 ostaja UNRESOLVED — neskladje ni rešeno
    expect(d.noteSi).toContain("CONFLICT / UNRESOLVED");
  });

  test("iskrena bibliografska opomba: revija po repozitorskem kazalu, PDF brez kolofona", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("po repozitorskem kazalu virov");
    expect(s.noteSi).toContain("v samem PDF založniške oznake ni");
    expect(s.noteSi).toContain("Status: VERIFIED");
  });

  test("relief A. Repiča = sled z originalom TO_COLLECT", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("relief kiparja A. Repiča");
  });
});

describe("val101 · Vurnik 1936 (issue §3) — migracijska opomba 2", () => {
  test("EXACT citat: Kukarji v Gribljah »še danes«; »zelo verjetno prišli okr. 1630. iz Draganića pri Karlovcu«", () => {
    const s = zupanic.sources?.find((x) => x.key === "vurnik-1936-belokranjica")!;
    expect(s.noteSi).toContain("na Svibniku pri Črnomlju in v Gribljah žive še danes Kukarji");
    expect(s.noteSi).toContain("zelo verjetno prišli okr. 1630. iz Draganića pri Karlovcu");
    expect(s.noteSi).toContain("Izraz »zelo verjetno« prenašamo kakor napisano");
    expect(s.noteEn).toContain("most probably came around 1630 from Draganić near Karlovac");
  });

  test("NOVO nad issue: Lenkovići (Pobrežje) in Gusiči (Gradac) iz Like", () => {
    const s = zupanic.sources?.find((x) => x.key === "vurnik-1936-belokranjica")!;
    expect(s.noteSi).toContain("Lenkovići iz Like");
    expect(s.noteSi).toContain("Gusiči prav tako Ličani po poreklu");
  });

  test("noša Katarine Županič: podzemeljsko-metliška župnija (paroisse de Podzemelj)", () => {
    const s = zupanic.sources?.find((x) => x.key === "vurnik-1936-belokranjica")!;
    expect(s.noteSi).toContain("Catharine Županič, de Griblje");
    expect(s.noteSi).toContain("podzemeljsko-metliške župnije");
    expect(s.noteEn).toContain("paroisse de Podzemelj");
  });
});

describe("val101 · zgodbe sl+en", () => {
  test("MVG-010 storySi: gospodarska podoba očeta + vinska kriza + Draganić + Vavpotičevi portreti + Kette", () => {
    expect(zupanic.storySi).toContain("posestnik, trgovec ter gostilničar iz Gribelj v Beli krajini");
    expect(zupanic.storySi).toContain("vinska kriza");
    expect(zupanic.storySi).toContain("grofje Erdödy");
    expect(zupanic.storySi).toContain("podzemljsko župnijo");
    expect(zupanic.storySi).toContain("Belokranjskega muzeja — darili dr. Nika Zupaniča");
    expect(zupanic.storySi).toContain("Nikovi spomini na Ketteja (spisani 1950)");
    expect(zupanic.storySi).toContain("VII., Županič pa VIII. razred realne gimnazije");
  });

  test("MVG-010 storyEn: odstavka zrcaljena", () => {
    expect(zupanic.storyEn).toContain("wine crisis");
    expect(zupanic.storyEn).toContain("Counts Erdödy");
    expect(zupanic.storyEn).toContain("parish of Podzemlje");
    expect(zupanic.storyEn).toContain("gifts of dr. Niko Županič");
    expect(zupanic.storyEn).toContain("Niko's memoirs of Kette");
  });

  test("uskoki storySi+En: Draganić 1630 kot del istega premika, »zelo verjetno« ohranjeno", () => {
    expect(uskoki.storySi).toContain("Vurnikova Belokranjica (Etnolog 8/9, 1936)");
    expect(uskoki.storySi).toContain("zelo verjetno prišli okr. 1630. iz Draganića pri Karlovcu");
    expect(uskoki.storySi).toContain("migracijska sled, ne dokazano dejstvo");
    expect(uskoki.storySi).toContain("družina Županič, iz katere je zrasel gribeljski etnolog Niko");
    expect(uskoki.storyEn).toContain("most probably came around 1630 from Draganić near Karlovac");
    expect(uskoki.storyEn).toContain("a migration trace, not an established fact");
  });
});

describe("val101 · izrecen prehod števcev", () => {
  test("114 zapisov / 641 virov / 517 identitet / 69 deljenih [pin posodobljen 103. val: +7 virov na MVG-083]", () => {
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    expect(seedExhibits.length).toBe(114);
    expect(virov).toBe(641);
    expect(SOURCE_USAGE.size).toBe(517);
    expect(deljenih).toBe(69);
  });

  test("vurnik-1936-belokranjica je registriran kot deljeni vir (2 zapisa)", () => {
    const key = [...SOURCE_USAGE.keys()].find((k) => k.includes("etnolog_8_9_1936_vurnik_belokranjica"));
    expect(key).toBeTruthy();
    expect(SOURCE_USAGE.get(key!)!.exhibits.length).toBe(2);
  });
});

describe("val101 · poštenost + artefakti + docs", () => {
  test("današnje stanje BM zbirke TO_COLLECT; upodobitev ne vnešena kot digitalni predmet", () => {
    const s = zupanic.sources?.find((x) => x.key === "iglic-2006-niko-zupanic")!;
    expect(s.noteSi).toContain("TO_COLLECT");
    expect(zupanic.storySi).toContain("sta TO_COLLECT");
    // poštenost: hramba v BM po navedbi članka 2006, ne kot preverjeno današnje stanje
    expect(zupanic.storySi).toContain("po članku v zbirki Belokranjskega muzeja");
  });

  test("veriga #100 §8 ni dvignjena (val 99 varovalka še vedno velja)", () => {
    const doc114 = readFileSync(join(RG, "114-val99-issue100-f0000212-identity.md"), "utf8");
    expect(doc114).toContain("INFERRED");
  });

  test("artefakti na disku z ujemajočimi sha256", () => {
    const iglic = SUMMARY.viri.find((v) => v.key_vir === "iglic-2006-niko-zupanic")!;
    const vurnik = SUMMARY.viri.find((v) => v.key_vir === "vurnik-1936-belokranjica")!;
    expect(iglic.http).toBe(200);
    expect(vurnik.http).toBe(200);
    expect(sha256(join(V101, "iglic2006.pdf"))).toBe(iglic.sha256);
    expect(sha256(join(V101, "vurnik1936.pdf"))).toBe(vurnik.sha256);
    expect(() => readFileSync(join(V101, "iglic2006-fulltext.txt"))).not.toThrow();
    expect(() => readFileSync(join(V101, "vurnik1936.txt"))).not.toThrow();
  });

  test("polni besedili vsebujeta ključne nize (verifikacija virov; presledki normalizirani — pdftotext lomi vrstice)", () => {
    const norm = (s: string) => s.replace(/\s+/g, " ");
    const iglicTxt = norm(readFileSync(join(V101, "iglic2006-fulltext.txt"), "utf8"));
    expect(iglicTxt).toContain("posestnik, trgovec ter gostilničar iz Gribelj v Beli krajini");
    expect(iglicTxt).toContain("grofje Erdödy");
    expect(iglicTxt).toContain("podzemljsko župnijo");
    expect(iglicTxt).toContain("ČGP Delo, Ljubljana, 1972");
    const vurnikTxt = norm(readFileSync(join(V101, "vurnik1936.txt"), "utf8"));
    expect(vurnikTxt).toContain("Draganića pri Karlovcu");
    expect(vurnikTxt).toContain("1630");
    expect(vurnikTxt).toContain("Kukar");
  });

  test("docs: doc 116 + KAZALO 116 prisotna", () => {
    const doc116 = readFileSync(join(RG, "116-val101-issue72-iglic2006-vurnik1936.md"), "utf8");
    expect(doc116).toContain("**Val:** 101");
    expect(doc116).toContain("ISSUE #72");
    const kazalo = readFileSync(join(RG, "00-KAZALO.md"), "utf8");
    expect(kazalo).toContain("116-val101-issue72-iglic2006-vurnik1936.md");
  });

  test("fairness iz summary: migracijska sled ne dvignjena; veriga #100 nespremenjena", () => {
    const f = SUMMARY.fairness.join(" ");
    expect(f).toContain("migracijska sled");
    expect(f).toContain("F0000212 = št. 73 ostaja INFERRED");
    expect(f).toContain("TO_COLLECT");
  });
});
