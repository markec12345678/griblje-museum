/**
 * Val 97 — ISSUE #72 (komentarji 27. 9. 2026): trije uradni preseki in tisk,
 * ki jih raziskava prinesla nad issue:
 *
 *  1. ODLok (Uradni list RS 63/2018; akt št. 622-2/2017, 13. 9. 2018) —
 *     zap. št. 28: Griblje – Cerkev sv. Vida, EŠD 2122; k. o. Griblje,
 *     parcela *1; vplivno območje 37 parcel; varovane sestavine.
 *  2. Občinski register spominskih obeležij (poročilo Knjižnice Črnomelj,
 *     gradivo za sejo OS nov. 2015) — Županičeva plošča: Griblje 35,
 *     k. o. 1544 Griblje, parcela *98/1; odkritje 1973; postavitelj
 *     Belokranjsko muzejsko društvo; avtor ni podatka; stanje dobro.
 *  3. Dular 1972 — »Dr. Niko Županič: ob odkritju njegove spominske
 *     plošče v Gribljah v Beli krajini« (ur. Jože Dular; Metlika: BMD,
 *     1972, 54 str.) — bibliografija VERIFIED (Google Books + NUK + SEM);
 *     CONFLICT / UNRESOLVED: odkritje 1972 (bibliografsko leto) vs 1973
 *     (občinski register).
 *  4. Gasparijev akvarel cerkve sv. Vida — natisnjen napis tabele
 *     »Griblje: Cerkev sv. Vida (Akvarel M. Gasparija)« (Etnolog 10/11,
 *     1937–1939, str. 119 = PDF str. 6); original TO_COLLECT, upodobitev
 *     NI vnesena kot digitalni predmet.
 *  5. Priložnik (do 1904 grajščina Pobrežje barona Apfaltrerna) in
 *     Plešivica (zidanice Gribeljcev) — prvi poimenovani vinogradniški
 *     legi vezane na Griblje (isti članek, str. 119).
 *
 * Poštenost: akvarel = natisnjena omemba upodobitve, ne lokacija originala;
 * datum odkritja plošče = CONFLICT, ne rešen; odlok uvede zaščito lokalnega
 * pomena — ne nove zgodovine stavbe.
 *
 * Varovalke:
 *  1. Vir odlok-2018 izključno na MVG-002; obcina-spomeniki-2015 in
 *     dular-1972 izključno na MVG-010 (eno-zapisni, brez podvajanja).
 *  2. Identiteta odloka + vplivno območje + varovane sestavine.
 *  3. Identiteta občinskega vnosa + CONFLICT 1972/1973.
 *  4. Zgodbe sl+en (MVG-002, MVG-010, MVG-018).
 *  5. Deljeni vir sopek: 4 zapisi (sveti-vid, uskoki, vino-in-crnina,
 *     katarina-zupanic) — ena identiteta.
 *  6. Izrecen prehod števcev: 114 / 622 / 499 / 68.
 *  7. Pošten negativ: nobene trditve o lokaciji originala akvarela in
 *     nobenega rešenega datuma odkritja plošče.
 */
import { describe, expect, test } from "bun:test";
import { seedExhibits, type SeedExhibit } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf } from "../src/lib/source-registry";

function byMuseumNo(no: string): SeedExhibit {
  const ex = seedExhibits.find((e) => e.museumNo === no);
  if (!ex) throw new Error(`zapis ${no} ne obstaja`);
  return ex;
}

describe("val97 — vir odlok-2018-kulturni-spomeniki (izključno MVG-002)", () => {
  const cerkev = byMuseumNo("MVG-002");
  const s = cerkev.sources.find((x) => x.key === "odlok-2018-kulturni-spomeniki");

  test("vir obstaja na MVG-002 s polno identiteto odloka", () => {
    expect(s).toBeDefined();
    expect(s!.nameSi).toContain("Odlok o razglasitvi nepremičnih kulturnih spomenikov lokalnega pomena na območju občine Črnomelj");
    expect(s!.nameSi).toContain("Uradni list RS, št. 63/2018");
    expect(s!.nameSi).toContain("622-2/2017");
    expect(s!.nameSi).toContain("zap. št. 28");
    expect(s!.nameSi).toContain("EŠD 2122");
    expect(s!.url).toBe(
      "https://www.lex-localis.info/KatalogInformacij/VsebinaDokumenta.aspx?SectionID=3a89a238-b4a7-4aa0-a42f-42d58640371c"
    );
    expect(s!.sourceType).toBe("objava");
    expect(s!.license).toContain("javni pravni vir");
  });

  test("lega: k. o. Griblje, parcela *1; vplivno območje 37 parcel z robnicami", () => {
    expect(s!.noteSi).toContain("k. o. Griblje, parcela *1");
    expect(s!.noteSi).toContain("37 parcel");
    expect(s!.noteSi).toContain("*2, *4/4");
    expect(s!.noteSi).toContain("1022/1");
    expect(s!.noteSi).toContain("5299, 5301");
    expect(s!.noteEn).toContain("parcel *1");
    expect(s!.noteEn).toContain("37 parcels");
  });

  test("varovane sestavine: zasnova, oltarna oprema, tlakovanje, zidec pokopališča", () => {
    expect(s!.noteSi).toContain("profiliran zidni zidec, sosvodnice, pilastri");
    expect(s!.noteSi).toContain("vsa oltarna oprema");
    expect(s!.noteSi).toContain("originalno kamnito tlakovanje");
    expect(s!.noteSi).toContain("kamnit zidec okoli pokopališča in vhodni portal");
    expect(s!.noteEn).toContain("altar equipment");
    expect(s!.noteEn).toContain("entrance portal");
  });

  test("sprejem in objava: OS, županja, 13. 9. 2018; VERIFIED javni pravni vir", () => {
    expect(s!.noteSi).toContain("Mojca Čemas Stjepanovič");
    expect(s!.noteSi).toContain("13. septembra 2018");
    expect(s!.noteSi).toContain("63/2018");
    expect(s!.noteSi).toContain("VERIFIED");
    expect(s!.noteEn).toContain("13 September 2018");
  });

  test("eno-zapisnost: vir citiran izključno na MVG-002 (brez podvajanja)", () => {
    const key = sourceKeyOf(s!.nameSi, s!.url ?? null);
    const u = SOURCE_USAGE.get(key)!;
    expect(u.exhibits.length).toBe(1);
    expect(u.exhibits.every((e) => e.slug === "sveti-vid")).toBe(true);
  });
});

describe("val97 — deljeni vir sopek: akvarel na MVG-002, Priložnik na MVG-018", () => {
  const cerkev = byMuseumNo("MVG-002");
  const vino = byMuseumNo("MVG-018");

  test("MVG-002: napis tabele akvarela na str. 119; original TO_COLLECT; ni digitalni predmet", () => {
    const s = cerkev.sources.find((x) => x.key === "etnolog-1937-1939-sopek-pdf")!;
    expect(s).toBeDefined();
    expect(s!.noteSi).toContain("Griblje: Cerkev sv. Vida (Akvarel M. Gasparija)");
    expect(s!.noteSi).toContain("str. 119 = PDF str. 6");
    expect(s!.noteSi).toContain("ni znano (TO_COLLECT)");
    expect(s!.noteSi).toContain("NE vnaša kot digitalni predmet");
    expect(s!.noteEn).toContain("Akvarel M. Gasparija");
    expect(s!.noteEn).toContain("NOT entered as a digital object");
  });

  test("MVG-018: Priložnik (Apfaltrer, do 1904, cvanciga 33 krajcarjev) + Plešivica", () => {
    const s = vino.sources.find((x) => x.key === "etnolog-1937-1939-sopek-pdf")!;
    expect(s).toBeDefined();
    expect(s!.noteSi).toContain("Priložnik");
    expect(s!.noteSi).toContain("do leta 1904 pripadal grajščini Pobrežju barona Apfaltrerna");
    expect(s!.noteSi).toContain("33 krajcarjev");
    expect(s!.noteSi).toContain("Plešivica");
    expect(s!.noteEn).toContain("Priložnik");
    expect(s!.noteEn).toContain("Baron Apfaltrer");
  });

  test("sopek = ENA identiteta na ŠTIRIH zapisih (sveti-vid, uskoki, vino-in-crnina, katarina-zupanic)", () => {
    const s4 = cerkev.sources.find((x) => x.key === "etnolog-1937-1939-sopek-pdf")!;
    const key = sourceKeyOf(s4.nameSi, s4.url ?? null);
    const u = SOURCE_USAGE.get(key)!;
    expect(u.exhibits.length).toBe(4);
    const slugs = u.exhibits.map((e) => e.slug).sort();
    expect(slugs).toEqual(["katarina-zupanic", "sveti-vid", "uskoki-in-vojna-krajina", "vino-in-crnina"]);
    // imeSi je bajtno-isto na vseh citatih (pravilo deljenega vira)
    const citati = seedExhibits.flatMap((e) => e.sources.filter((x) => x.key === "etnolog-1937-1939-sopek-pdf"));
    expect(new Set(citati.map((c) => c.nameSi)).size).toBe(1);
  });
});

describe("val97 — zgodba MVG-002: odlok + akvarel (sl+en)", () => {
  const cerkev = byMuseumNo("MVG-002");

  test("sl: odlok 63/2018, zap. št. 28, parcela *1, 37 parcel, varovane sestavine", () => {
    expect(cerkev.storySi).toContain("Odlok o razglasitvi nepremičnih kulturnih spomenikov lokalnega pomena na območju občine Črnomelj");
    expect(cerkev.storySi).toContain("Uradni list RS, št. 63/2018");
    expect(cerkev.storySi).toContain("zaporedno številko 28 med sakralnimi stavbami");
    expect(cerkev.storySi).toContain("parcela *1");
    expect(cerkev.storySi).toContain("sedemintrideset parcel");
    expect(cerkev.storySi).toContain("kamnit zidec okoli pokopališča z vhodnim portalom");
    expect(cerkev.storySi).toContain("Register je povedal, da je cerkev dediščina; odlok pa pove, kateri njeni deli so zakon ščiti.");
  });

  test("sl: akvarel — napis, Gaspari, TO_COLLECT, brez vnašanja slike", () => {
    expect(cerkev.storySi).toContain("Griblje: Cerkev sv. Vida (Akvarel M. Gasparija)");
    expect(cerkev.storySi).toContain("str. 119");
    expect(cerkev.storySi).toContain("Maksima Gasparija");
    expect(cerkev.storySi).toContain("ni znano (TO_COLLECT)");
    expect(cerkev.storySi).toContain("ne vnaša kot digitalni predmet");
  });

  test("en: mirror z istimi jamstvi", () => {
    expect(cerkev.storyEn).toContain("Official Gazette of the RS, no. 63/2018");
    expect(cerkev.storyEn).toContain("serial number 28 among the sacred buildings");
    expect(cerkev.storyEn).toContain("thirty-seven parcels");
    expect(cerkev.storyEn).toContain("Akvarel M. Gasparija");
    expect(cerkev.storyEn).toContain("is unknown (TO_COLLECT)");
    expect(cerkev.storyEn).toContain("not entered into this museum as a digital object");
  });
});

describe("val97 — vir obcina-spomeniki-2015 + dular-1972 (izključno MVG-010)", () => {
  const zupanic = byMuseumNo("MVG-010");
  const obc = zupanic.sources.find((x) => x.key === "obcina-spomeniki-2015");
  const dular = zupanic.sources.find((x) => x.key === "dular-1972-zupanic");

  test("občinski register: polna identiteta vnosa (Griblje 35, 98/1, k. o. 1544, 1973, BMD)", () => {
    expect(obc).toBeDefined();
    expect(obc!.nameSi).toContain("Seznam spominskih obeležij in spomenikov na območju Občine Črnomelj");
    expect(obc!.nameSi).toContain("novembru 2015");
    expect(obc!.url).toBe("https://slov.si/doc/spomeniki_nob_crnomelj.pdf");
    expect(obc!.noteSi).toContain("Griblje 35");
    expect(obc!.noteSi).toContain("1544 — GRIBLJE");
    expect(obc!.noteSi).toContain("parcela *98/1");
    expect(obc!.noteSi).toContain("datum odkritja: 1973");
    expect(obc!.noteSi).toContain("Belokranjsko muzejsko društvo");
    expect(obc!.noteSi).toContain("avtor: ni podatka");
    expect(obc!.noteSi).toContain("stanje: dobro");
    expect(obc!.noteEn).toContain("Griblje 35");
    expect(obc!.noteEn).toContain("1973");
  });

  test("usklajenost s Kamra virom; register doda katastrski presek", () => {
    expect(obc!.noteSi).toContain("usklajeni s Kamra virom");
    expect(obc!.noteSi).toContain("VERIFIED");
    expect(obc!.noteEn).toContain("agree with the Kamra source");
  });

  test("dular 1972: bibliografija po treh katalogih (Google Books + NUK + SEM)", () => {
    expect(dular).toBeDefined();
    expect(dular!.nameSi).toContain("ob odkritju njegove spominske plošče v Gribljah v Beli krajini");
    expect(dular!.nameSi).toContain("ur. Jože Dular");
    expect(dular!.nameSi).toContain("1972, 54 str.");
    expect(dular!.noteSi).toContain("Google Books");
    expect(dular!.noteSi).toContain("sb.nuk.uni-lj.si");
    expect(dular!.noteSi).toContain("Slovenskega etnografskega muzeja");
    expect(dular!.noteSi).toContain("Bogo Komelj");
  });

  test("CONFLICT / UNRESOLVED: 1972 (bibliografsko leto) vs 1973 (občinski register) — datum slovesnosti odprt", () => {
    expect(dular!.noteSi).toContain("CONFLICT / UNRESOLVED");
    expect(dular!.noteSi).toContain("razrešitev čaka vsebino knjižice");
    expect(dular!.noteSi).toContain("sodoben časopisni zapis 1972–1973");
    expect(dular!.noteSi).toContain("VERIFIED bibliografija / REVIEW-CONFLICT datum odkritja");
    expect(dular!.noteEn).toContain("CONFLICT / UNRESOLVED");
  });

  test("pošten negativ: sistory dostop blokiran — potrjeno po treh drugih katalogih", () => {
    expect(dular!.noteSi).toContain("Sistory");
    expect(dular!.noteSi).toContain("Cloudflare");
  });

  test("eno-zapisnost: oba vira izključno na MVG-010 (brez podvajanja)", () => {
    for (const s of [obc!, dular!]) {
      const key = sourceKeyOf(s.nameSi, s.url ?? null);
      const u = SOURCE_USAGE.get(key)!;
      expect(u.exhibits.length).toBe(1);
      expect(u.exhibits.every((e) => e.slug === "niko-zupanic")).toBe(true);
    }
  });
});

describe("val97 — zgodba MVG-010: katastrska identiteta plošče + konflikt (sl+en)", () => {
  const zupanic = byMuseumNo("MVG-010");

  test("sl: Griblje 35, 98/1, k. o. 1544, 1973, BMD; Dular 1972; datum ostaja odprt", () => {
    expect(zupanic.storySi).toContain("Občinski register je plošči zdaj dodal katastrsko identiteto");
    expect(zupanic.storySi).toContain("Griblje 35, katastrska občina 1544 Griblje, parcela *98/1");
    expect(zupanic.storySi).toContain("datum odkritja 1973, postavitelj Belokranjsko muzejsko društvo");
    expect(zupanic.storySi).toContain("uredil Jože Dular; Metlika: Belokranjsko muzejsko društvo, 1972, 54 str.");
    expect(zupanic.storySi).toContain("Datum slovesnosti zato ostaja odprt");
    expect(zupanic.storySi).toContain("ista roka, ki je z Barletoma in Račičem uredila prvo zbirko Belokranjskega muzeja");
  });

  test("en: mirror z istimi jamstvi", () => {
    expect(zupanic.storyEn).toContain("The municipal register has now given the plaque its cadastral identity");
    expect(zupanic.storyEn).toContain("Griblje 35, cadastral municipality 1544 Griblje, parcel *98/1");
    expect(zupanic.storyEn).toContain("The date of the ceremony therefore remains open");
    expect(zupanic.storyEn).toContain("arranged the first collection of the Bela krajina Museum");
  });
});

describe("val97 — zgodba MVG-018: Priložnik in Plešivica (sl+en)", () => {
  const vino = byMuseumNo("MVG-018");

  test("sl: Priložnik, Apfaltrer, 1904, cvanciga 33 krajcarjev, Plešivica z zidanicami", () => {
    expect(vino.storySi).toContain("Prvo poimenovano vaško lego pa je vinogradništvu vrnil tisk");
    expect(vino.storySi).toContain("vinorodni holm Priložnik");
    expect(vino.storySi).toContain("do leta 1904 pripadal grajščini Pobrežje barona Apfaltrerna");
    expect(vino.storySi).toContain("33 krajcarjev");
    expect(vino.storySi).toContain("vinograd na Plešivici, kjer imajo Gribeljci svoje zidanice");
    expect(vino.storySi).toContain("Muzej išče, kje holm stoji danes in ali ime še živi");
  });

  test("sl: zaključek posodobljen pošteno — prva poimenovana lega je, domačij še ni", () => {
    expect(vino.storySi).toContain("ima zapis vino regije in prvo poimenovano vaško lego, ne še domačij");
  });

  test("en: mirror z istimi jamstvi", () => {
    expect(vino.storyEn).toContain("The first named village location, however, print has already returned to viticulture");
    expect(vino.storyEn).toContain("wine-bearing hill of Priložnik");
    expect(vino.storyEn).toContain("until 1904 belonged to the Pobrežje manor of Baron Apfaltrer");
    expect(vino.storyEn).toContain("33 krajcarji");
    expect(vino.storyEn).toContain("vineyard on Plešivica");
    expect(vino.storyEn).toContain("the record holds the region's wine and the first named village location, but not yet the farms");
  });
});

describe("val97 — izrecen prehod števcev (ne tih)", () => {
  test("+0 zapisov: 114; od vala 97 dalje zakoniti prehodi virov (622 → ≥)", () => {
    // varovalka vala 97 je zahtevala točno 622/499; poznejši vali so po
    // protokolu issue-jev zakonito dodajali eno-zapisne vire (val 100:
    // +3 vira na MVG-010 — SEM F0003143, Muršič–Hudelja 2009,
    // Iglič–Kralj-Iglič 2006): citati 622→625, identitete 499→502.
    expect(seedExhibits.length).toBe(114);
    const virov = seedExhibits.reduce((a, e) => a + (e.sources?.length ?? 0), 0);
    expect(virov).toBeGreaterThanOrEqual(622);
    expect(SOURCE_USAGE.size).toBeGreaterThanOrEqual(499);
    const deljenih = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1).length;
    // deljenih 68 (val 97) → 69 po val 101 (vurnik-1936-belokranjica = NOVI
    // deljeni vir: MVG-010 + MVG-004 uskoki) — zakonit prehod, vzorec val 100.
    expect(deljenih).toBeGreaterThanOrEqual(68);
  });

  test("trajna zadržka poštenosti: nobene lokacije originala akvarela in nobenega rešenega datuma odkritja", () => {
    const cerkev = byMuseumNo("MVG-002");
    const zupanic = byMuseumNo("MVG-010");
    // akvarel: zgodba mora izrecno trditi, da lokacija originala ni znana (poštenost)
    expect(cerkev.storySi).toContain("ni znano (TO_COLLECT)");
    // in ne sme trditi, da katera ustanova hrani original — dovoljena je samo
    // vprašalna oblika »ali ga hrani SEM …« z odgovorom »ni znano«
    const trditve = cerkev.storySi
      .split(/[.!?]\s/)
      .filter((p) => /akvarel/i.test(p) && /hrani/i.test(p) && !/ali ga hrani/i.test(p));
    expect(trditve).toEqual([]);
    // plošča: zgodba ne trdi niti 1972 niti 1973 kot rešen datum slovesnosti
    expect(zupanic.storySi).toContain("Datum slovesnosti zato ostaja odprt");
  });
});
