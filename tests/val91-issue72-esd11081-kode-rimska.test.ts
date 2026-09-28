/**
 * Val 91 — ISSUE #72: vgradnja raziskovalnih sledi po evidence-first logiki
 * (EŠD 11081 Požekov vrt + uradne raziskovalne kode 2012–2023 + rimska
 * sinteza Masonovega programa 1997–2001) — muzejska vsebinska plast MVG-083.
 *
 * Ozadje: issue #72 nosi 48 kuratorskih zapisov; worklogova »naslednja«
 * določila tri sklope, ki čakajo vgradnjo:
 *   1. EŠD 11081 — Požekov vrt kot samostojna registrska enota (+ Dular 1985
 *      kat. 490/490A, Dular & Tecco Hvala 2007 skupina Uk, AV 62 Ha B1),
 *   2. raziskovalne kode uradnih zbornikov Arheologija v letu
 *      (2013 ARHAT+ARHEOTERRA, 2014 KVS, 2017 ×4, 2019, 2020 ×2, 2021 ×4,
 *      2023 ×3 + poročilo Klepec–Krasinec parc. 2957),
 *   3. rimska sinteza — Masonov program 1997–2001 (Pezdirc 1997, 75 testnih
 *      jarkov, 39,6 ha, Dom krajanov), kanalizacija G1/G4 (VS 42),
 *      izkopavanja 2010/2011 na parceli 15/3 (VS 48) + obseg 316,57 ha.
 *
 * Varovalke:
 *  1. MVG-083 obstaja in nosi novih 16 virov (ključi + URL-ji)
 *  2. storySi/storyEn nosijo vse tri sklope z natančnimi številkami
 *  3. poštenost: opomba zvkds-2023-cpa NI VEČ »prva po 2012« (umaknjena
 *     napačna trditev); zborniški vpisi ≠ vsebinska poročila (TO_COLLECT)
 *  4. +0 zapisov / +0 KG / +0 UI — števec 113 se ne premakne
 *  5. konflikt ohranjen: Dular 1979 = Borštek (ne samostojna objava
 *     Požekovega vrta) — tabla 14:5–11 ostaja REVIEW
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE } from "../src/lib/source-registry";

const NOVI_KLJUCI = [
  "vs-39-41-kohane-pregled",
  "vs-42-kanalizacija-g1-g4",
  "vs-48-zvkds-2010-2011",
  "zorz-2011-av-griblje",
  "dular-1985-topografija",
  "dular-tecco-2007-katalog",
  "av-62-2011-ha-b1",
  "esd-11081-pozekov-vrt",
  "zvkds-sto-let-10094",
  "tiran-2021-klepec-krasinec",
  "arheologija-2013-zbornik",
  "arheologija-2014-zbornik",
  "arheologija-2017-zbornik",
  "arheologija-2019-zbornik",
  "arheologija-2020-zbornik",
  "arheologija-2021-zbornik",
] as const;

function mvg083(): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === "MVG-083");
  if (!ex) throw new Error("MVG-083 arheolosko-najdigsce-ob-kolpi ne obstaja");
  return ex;
}

describe("val91 — novi viri MVG-083 (16, evidence-first)", () => {
  const ex = mvg083();
  const keys = new Set(ex.sources.map((s) => s.key));

  test("vseh 16 novih virov je citiranih na MVG-083", () => {
    for (const k of NOVI_KLJUCI) expect(keys.has(k)).toBe(true);
  });

  test("novi viri so unikatni ključi (brez podvajanja znotraj zapisa)", () => {
    expect(ex.sources.length).toBe(new Set(ex.sources.map((s) => s.key)).size);
  });

  test("vsak nov vir ima ime in opombo v obeh jezikih", () => {
    for (const s of ex.sources.filter((x) => (NOVI_KLJUCI as readonly string[]).includes(x.key))) {
      expect(s.nameSi.trim()).not.toBe("");
      expect(s.nameEn.trim()).not.toBe("");
      expect((s.noteSi ?? "").trim()).not.toBe("");
      expect((s.noteEn ?? "").trim()).not.toBe("");
      // evidence-first: vsak kuratorski zapis nosi izrecno atribucijo + status
      expect(s.noteSi).toContain("issue #72");
      expect(s.noteSi).toContain("VERIFIED");
    }
  });

  test("pričakovani URL-ji (uradni zborniki, ZVKDS, ZRC SAZU, register)", () => {
    const byKey = new Map(ex.sources.map((s) => [s.key, s]));
    expect(byKey.get("vs-48-zvkds-2010-2011")?.url).toContain("zvkds.si/wp-content/uploads/2024/03/vs48_w_0-1.pdf");
    expect(byKey.get("dular-1985-topografija")?.url).toContain("iza2.zrc-sazu.si/sites/default/files/9789612540005.pdf");
    expect(byKey.get("tiran-2021-klepec-krasinec")?.url).toContain("iza2.zrc-sazu.si/sites/default/files/2021%20IZA.pdf");
    expect(byKey.get("arheologija-2021-zbornik")?.url).toContain("POPRAVLJENA-Arheologija-v-letu-2021-WEB.pdf");
    expect(byKey.get("arheologija-2017-zbornik")?.url).toContain("Arheologija-v-letu-2017.pdf");
    expect(byKey.get("esd-11081-pozekov-vrt")?.url).toContain("javnipodatki.si/kulturna-dediscina/arheoloska-najdisca/crnomelj");
  });
});

describe("val91 — storySi: trije sklopi vgradnje", () => {
  const ex = mvg083();

  test("sklop 1 — EŠD 11081 + strokovni katalog", () => {
    expect(ex.storySi).toContain("EŠD 11081");
    expect(ex.storySi).toContain("Griblje – Arheološko najdišče Požekov vrt");
    expect(ex.storySi).toContain("severno od cerkve sv. Vida");
    expect(ex.storySi).toContain("kat. št. 490");
    expect(ex.storySi).toContain("TTN5 Ozalj 21");
    expect(ex.storySi).toContain("kat. 490A");
    expect(ex.storySi).toContain("Ha B1");
    expect(ex.storySi).toContain("žarnogrobiščne lokacije pozne bronaste dobe (Uk)");
  });

  test("sklop 2 — raziskovalne kode 2012–2023 (uradni zborniki)", () => {
    expect(ex.storySi).toContain("ARHEOTERRA");
    expect(ex.storySi).toContain("62240-403/2014/2");
    expect(ex.storySi).toContain("17-0053 Tica Sistem");
    expect(ex.storySi).toContain("17-0497 ARHAT");
    expect(ex.storySi).toContain("17-0374 Filipidis");
    expect(ex.storySi).toContain("17-0481 Arhos");
    expect(ex.storySi).toContain("19-0552 ARHAT");
    expect(ex.storySi).toContain("20-0261 ARHAT");
    expect(ex.storySi).toContain("20-0297 AVGUSTA");
    expect(ex.storySi).toContain("21-0130 AVGUSTA");
    expect(ex.storySi).toContain("21-0406 Skupina Stik");
    expect(ex.storySi).toContain("21-0141 ARHAT");
    expect(ex.storySi).toContain("21-0432 AVGUSTA");
    expect(ex.storySi).toContain("23-0168");
    expect(ex.storySi).toContain("23-0261");
    expect(ex.storySi).toContain("COBISS.SI-ID 66817539");
    expect(ex.storySi).toContain("parc. št. 2957 k. o. Krasinec");
  });

  test("sklop 3 — rimska sinteza: 1997–2001 + kanalizacija G1/G4 + izkopi 2010/2011", () => {
    expect(ex.storySi).toContain("Ivan Pezdirc");
    expect(ex.storySi).toContain("ledini Kamenice");
    expect(ex.storySi).toContain("75 testnimi jarki");
    expect(ex.storySi).toContain("gasilskem domu");
    expect(ex.storySi).toContain("Domu krajanov");
    expect(ex.storySi).toContain("39,6 ha");
    expect(ex.storySi).toContain("Varstvo spomenikov 42");
    expect(ex.storySi).toContain("parcelah 113/1 in 2866–2872");
    expect(ex.storySi).toContain("parceli 15/3");
    expect(ex.storySi).toContain("Barbara Nadbath in Alja Žorž");
    expect(ex.storySi).toContain("4.900 najdb");
    expect(ex.storySi).toContain("316,57 ha");
    expect(ex.storySi).toContain("2005");
  });

  test("poštenost — vsebinska poročila ostajajo TO_COLLECT (zborniški vpis ≠ najdbe)", () => {
    expect(ex.storySi).toContain("TO_COLLECT");
    expect(ex.storySi).toContain("ne trdi nobenih najdb ali datacij");
  });

  test("konflikt ohranjen — Dular 1979 = Borštek, tabla 14 REVIEW", () => {
    expect(ex.storySi).toContain("Žarno grobišče na Borštku v Metliki");
    expect(ex.storySi).toContain("REVIEW");
  });
});

describe("val91 — storyEn: ogledala ključnih dejstev", () => {
  const ex = mvg083();

  test("EŠD 11081 + Pezdirc + številke v angleščini", () => {
    expect(ex.storyEn).toContain("EŠD 11081");
    expect(ex.storyEn).toContain("Ivan Pezdirc");
    expect(ex.storyEn).toContain("75 test trenches");
    expect(ex.storyEn).toContain("39.6 ha");
    expect(ex.storyEn).toContain("316.57 ha");
    expect(ex.storyEn).toContain("parcel 15/3");
    expect(ex.storyEn).toContain("Nadbath and Alja Žorž");
    expect(ex.storyEn).toContain("4,900 finds");
    expect(ex.storyEn).toContain("62240-403/2014/2");
    expect(ex.storyEn).toContain("21-0141");
    expect(ex.storyEn).toContain("Ha B1");
    expect(ex.storyEn).toContain("cat. 490A");
  });
});

describe("val91 — poštenost in pogodbe (+0 / umaknjena trditev)", () => {
  test("opomba zvkds-2023-cpa ne trdi več »prva dokumentirana raziskava po 2012«", () => {
    const ex = mvg083();
    const s = ex.sources.find((x) => x.key === "zvkds-2023-cpa");
    expect(s).toBeDefined();
    // izvirna (napačna) trditev je bila pritrjena kot del opombe z vezavo
    // »— prva ... (podrobno poročilo TO_COLLECT)«; popravek jo izrecno
    // označi kot umaknjeno, ne pa tiho izbriše (audit trail)
    expect(s!.noteSi).not.toContain("— prva dokumentirana raziskava pri Gribljih po 2012 (podrobno poročilo TO_COLLECT)");
    expect(s!.noteSi).toContain("Popravek (91. val, issue #72)");
    expect(s!.noteSi).toContain("trditev umaknjena");
    expect(s!.noteSi).toContain("23-0168");
    expect(s!.noteSi).toContain("23-0261");
    expect(s!.noteEn).toContain("the claim is withdrawn");
  });

  test("števec zapisov: val 91 je nosil +0 (113); zrasel na 114 šele v 93. valu (lasten zapis MVG-114, Kresna pesem 1888)", () => {
    // varovalka vala 91 je zahtevala 113; val 93 je po protokolu issue-ja #72
    // (točka 26 — ljudsko izročilo, lasten zapis) zbirko zakonito povečal na 114.
    expect(seedExhibits.length).toBeGreaterThanOrEqual(113);
  });

  test("+0 KG: ATLAS artefakti ne citirajo novih virov (muzejska plast)", () => {
    // novi viri se ne smejo pojaviti v atlas story grafu (§22 pogodba neizmenjana)
    const novi = new Set<string>(NOVI_KLJUCI);
    for (const [k, u] of SOURCE_USAGE) {
      if (novi.has(k)) {
        // nov vir je lahko citiran samo na MVG-083
        expect(u.exhibits.every((e) => e.slug === "arheolosko-najdigsce-ob-kolpi")).toBe(true);
        expect(u.exhibits.length).toBe(1);
      }
    }
  });
});
