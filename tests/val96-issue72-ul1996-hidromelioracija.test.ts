/**
 * Val 96 — ISSUE #72, točka 21: Uradni list RS 39/1996, št. 2565 —
 * Odredba o uvedbi hidromelioracijskega postopka na območju Občine Črnomelj
 * (namakanje kmetijskih zemljišč) — 19 gribeljskih domačij s hišnimi
 * številkami in parcelami (str. 3500–3501).
 *
 * Ozadje: issue #72 (točka 21) navaja, da UL 39/1996 v postopku
 * hidromelioracije nosi seznam lastnikov/uporabnikov zemljišč iz Gribelj
 * (Filak 11a, Šimec 66, Štrucelj 85, Križan 81 …) — VERIFIED uradni javni
 * pravni vir, »pozno časovno sidro« (oseba → hišna številka → parcela →
 * raba zemljišča okoli 1996; brez prenosa lastništva nazaj).
 *
 * Izvedba (96. val): PDF UL 39/1996 prenešen z uradnega portala
 * (uradni-list.si), str. 3500–3501 prebrani, vsi pari ime–parcela
 * VIZUALNO POTRJENI na 300 dpi (dvostolpčna postavitev je besedilni
 * plasti vezala napačno — vizualna kontrola obvezna). Ugotovitve nad
 * issue:
 *   - polna identiteta: št. 2565, minister dr. Jože Osterc,
 *     Št. 355-03/28/96, Ljubljana 22. 7. 1996 (101. člen ZKZ);
 *   - program (5. člen): črpališče ob Kolpi, akumulacija, primarni
 *     cevovod s hidrantsko mrežo, sekundarno omrežje; dokumentacija
 *     v skladu s programom agrarnih operacij Občine Črnomelj 1995–2000;
 *   - seznam ima 19 gribeljskih domačij (issue je navajal 4) +
 *     4 lastnike izven vasi na parcelah k. o. Griblje;
 *   - natisnjena anomalija »9424/4« (Alojz Totter) zabeležena kakor
 *     natisnjeno (najverjetneje 942/4).
 *
 * Poštenost: odredba UVEDE postopek — ali je bilo omrežje zgrajeno,
 * iz listine ni razvidno (TO_COLLECT); hišne številke niso
 * identifikatorji arheoloških izkopavanj (Brodarič 72 ≠ parcela 67/3).
 *
 * Varovalke:
 *  1. Vir ul-1996-hidromelioracija izključno na MVG-008 (suša → namakanje).
 *  2. Identiteta dokumenta + program + seznam + protokol.
 *  3. Zgodbe sl+en z izrecno poštenostjo.
 *  4. Izrecen prehod števcev: 114 / 617 / 496 / 68.
 *  5. Pošten negativ: nobene trditve o zgrajenosti omrežja.
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

function byMuseumNo(no: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === no);
  if (!ex) throw new Error(`zapis ${no} ne obstaja`);
  return ex;
}

describe("val96 — vir ul-1996-hidromelioracija (izključno MVG-008)", () => {
  const reka = byMuseumNo("MVG-008");
  const s = reka.sources.find((x) => x.key === "ul-1996-hidromelioracija");

  test("vir obstaja na MVG-008 z identiteto uradnega lista", () => {
    expect(s).toBeDefined();
    expect(s!.nameSi).toContain("Uradni list RS, št. 39/1996");
    expect(s!.nameSi).toContain("2565");
    expect(s!.nameSi).toContain("hidromelioracijskega postopka");
    expect(s!.nameSi).toContain("19 gribeljskih domačij");
    expect(s!.url).toBe("https://www.uradni-list.si/_pdf/1996/Ur/u1996039.pdf");
    expect(s!.sourceType).toBe("objava");
    expect(s!.license).toContain("javni pravni vir");
  });

  test("identiteta dokumenta: minister Osterc, številka, datum, pravna podlaga", () => {
    expect(s!.noteSi).toContain("dr. Jože Osterc");
    expect(s!.noteSi).toContain("355-03/28/96");
    expect(s!.noteSi).toContain("22. julija 1996");
    expect(s!.noteSi).toContain("101. člena zakona o kmetijskih zemljiščih");
    expect(s!.noteSi).toContain("str. 3500–3501");
    expect(s!.noteSi).toContain("300 dpi");
    expect(s!.noteEn).toContain("dr. Jože Osterc");
    expect(s!.noteEn).toContain("22 July 1996");
  });

  test("program (5. člen): črpališče ob Kolpi, akumulacija, hidranti; agrarne operacije 1995–2000", () => {
    expect(s!.noteSi).toContain("črpališča ob reki Kolpi");
    expect(s!.noteSi).toContain("akumulacija");
    expect(s!.noteSi).toContain("hidrantsko mrežo");
    expect(s!.noteSi).toContain("1995–2000");
    expect(s!.noteEn).toContain("pumping station by the Kolpa");
  });

  test("štiri imena iz issue-ja #72 z parcelami (Filak 11a, Šimec 66, Štrucelj 85, Križan 81)", () => {
    expect(s!.noteSi).toContain("Anton Filak, Griblje 11a — parc. 1574, 1573, 1575, 913/1, 913/2, 917, 925, 926/2");
    expect(s!.noteSi).toContain("Jože Šimec, Griblje 66 — parc. 2818");
    expect(s!.noteSi).toContain("Jožef Štrucelj, Griblje 85 — parc. 2799");
    expect(s!.noteSi).toContain("Jože Križan, Griblje 81 — parc. 2815, 2820, 2821, 2901");
    expect(s!.noteEn).toContain("Anton Filak, Griblje 11a");
  });

  test("celoten seznam: 19 domačij (prva Črnič 53, zadnja Ivana Totter 926/1) + natisnjena anomalija 9424/4", () => {
    expect(s!.noteSi).toContain("devetnajst gribeljskih domačij");
    expect(s!.noteSi).toContain("Jožef Črnič, Griblje 53 — parc. 3030, 3031, 3032");
    expect(s!.noteSi).toContain("Ivana Totter, Griblje 13 — parc. 926/1");
    expect(s!.noteSi).toContain("Alojz Totter, Griblje 13 — parc. 942/1, 942/2, 9424/4 (kakor natisnjeno; najverjetneje 942/4)");
    expect(s!.noteSi).toContain("Dragica in Jože Brinc, Griblje 48 — parc. 2827");
    expect(s!.noteEn).toContain("as printed; most likely 942/4");
  });

  test("štiri lastnike izven vasi na parcelah k. o. Griblje", () => {
    expect(s!.noteSi).toContain("štiri lastnike izven vasi");
    expect(s!.noteSi).toContain("Moravec, Paka — parc. 2829");
    expect(s!.noteSi).toContain("Lukač, Pravutina — parc. 2805");
    expect(s!.noteEn).toContain("four owners from outside the village");
  });

  test("protokol issue #72: VERIFIED sidro ~1996, brez prenosa nazaj; hišne št. ≠ izkopavanja (Brodarič 72 ≠ 67/3)", () => {
    expect(s!.noteSi).toContain("VERIFIED");
    expect(s!.noteSi).toContain("pozno časovno sidro okoli leta 1996");
    expect(s!.noteSi).toContain("ne širi nazaj v 1825 ali starejšo preteklost");
    expect(s!.noteSi).toContain("Brodarič, Griblje 72 ≠ parcela 67/3 izkopavanj 2022/2023");
    expect(s!.noteEn).toContain("must not automatically prove the same ownership links for older periods");
    expect(s!.noteEn).toContain("Brodarič, Griblje 72 ≠ parcel 67/3");
  });

  test("poštenost: odredba uvede postopek; zgrajenost omrežja = TO_COLLECT", () => {
    expect(s!.noteSi).toContain("Odredba uvede postopek");
    expect(s!.noteSi).toContain("ali in kdaj je bilo namakalno omrežje zgrajeno, iz uradnega lista ni razvidno (TO_COLLECT)");
    expect(s!.noteEn).toContain("whether and when the irrigation network was built is not evident from the Gazette (TO_COLLECT)");
  });
});

describe("val96 — zgodba MVG-008: 1996 kot uradni odgovor na sušo (sl+en)", () => {
  const reka = byMuseumNo("MVG-008");

  test("sl: odredba 2565, Osterc, program, devetnajst domačij, Filak, sidro, iskanje", () => {
    expect(reka.storySi).toContain("Suša pa je imela leta 1996 tudi svoj uradni odgovor");
    expect(reka.storySi).toContain("št. 2565");
    expect(reka.storySi).toContain("dr. Jože Osterc");
    expect(reka.storySi).toContain("črpališča ob reki Kolpi");
    expect(reka.storySi).toContain("devetnajst gribeljskih domačij");
    expect(reka.storySi).toContain("Anton Filak (Griblje 11a)");
    expect(reka.storySi).toContain("pozno časovno sidro");
    expect(reka.storySi).toContain("ne sme pomikati nazaj v starejša obdobja");
    expect(reka.storySi).toContain("Odredba uvede postopek, ne zgrajenega omrežja");
  });

  test("en: mirror z istimi jamstvi", () => {
    expect(reka.storyEn).toContain("received its official answer in 1996");
    expect(reka.storyEn).toContain("No. 2565");
    expect(reka.storyEn).toContain("nineteen Griblje homesteads");
    expect(reka.storyEn).toContain("Anton Filak (Griblje 11a)");
    expect(reka.storyEn).toContain("late chronological anchor");
    expect(reka.storyEn).toContain("a procedure, not a built network");
  });

  test("umestitev: odstavek med vodostajem 1952–2022 in ekstremi 2022 (kronološko)", () => {
    // 1996 mora biti med zgodovinskim delom (1952) in prelomnim 2022
    const si = reka.storySi;
    const pos1952 = si.indexOf("Vodomerna postaja Metlika meri Kolpo od leta 1952");
    const pos1996 = si.indexOf("Suša pa je imela leta 1996");
    const pos2022 = si.indexOf("Nato je prišlo leto 2022");
    expect(pos1952).toBeGreaterThan(-1);
    expect(pos1996).toBeGreaterThan(pos1952);
    expect(pos2022).toBeGreaterThan(pos1996);
  });
});

describe("val96 — izrecen prehod števcev (ne tih)", () => {
  test("+0 zapisov: 114; +1 vir: 617; +1 identiteta: 496; deljenih ostaja 68", () => {
    expect(seedExhibits.length).toBe(114);
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    expect(virov).toBe(617);
    expect(SOURCE_USAGE.size).toBe(496);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    expect(deljenih).toBe(68);
  });

  test("nov vir citiran izključno na MVG-008 (eno-zapisni, brez podvajanja)", () => {
    const reka = byMuseumNo("MVG-008");
    const s = reka.sources.find((x) => x.key === "ul-1996-hidromelioracija")!;
    const key = sourceKeyOf(s.nameSi, s.url ?? null);
    const u = SOURCE_USAGE.get(key)!;
    expect(u.exhibits.length).toBe(1);
    expect(u.exhibits.every((e) => e.slug === "kolpa-extremi")).toBe(true);
  });
});
