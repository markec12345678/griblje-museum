/**
 * ENTITETNA PLAST ZBIRKE — mehke reference oseb, krajev, dogodkov in časov.
 * (37. sklop / TASK 39 — SOFT ENTITY LAYER)
 *
 * Načelo: DOKAZ NAJPREJ (evidence first). Vsaka entiteta je ročno kurirana
 * VEZ na obstoječe muzejske podatke:
 *
 *     entiteta  →  zapis (muzejska trditev)  →  vir
 *
 * Registr NI izpeljan samodejno iz besedil: vsak vnos je bil v reviziji
 * (TASK 39, FAZA 0) preverjen proti semenu zbirke — zapis po zapis, stavek
 * po stavek. Kar v podatkih ni, tukaj ni; kar je negotovo, gre v kuratorsko
 * vrsto (ENTITY_QUEUE), ne v entiteto.
 *
 * KAJ TA PLAST JE
 *  - minimalni model: PersonRef | PlaceRef | EventRef | TimeRef;
 *  - stabilni, deterministični ID-ji (person:…, place:…, event:…, time:…),
 *    izpeljani iz POTRDJENE identitete — ne zaporedne številke (oseba-001),
 *    ki bi se ob vsaki vstavitvi premaknile;
 *  - evidence vez: slug zapisa + opcijsko sourceIndex vira v zapisu
 *    (ista veza, ki jo uporabljajo biografije predmetov);
 *  - mehki čas (SoftTime): letnice IN obdobja, kot so ZAPISANA
 *    (»okoli leta 1900« ne postane 1900-01-01);
 *  - kuratorska vrsta P0–P4 za nerešene identitete.
 *
 * KAJ TA PLAST NI
 *  - ni grafska baza: obseg zbirke in entitetne plasti zadošča običajnim
 *    podatkovnim strukturam (množice, zemljevidi) — kot doslej;
 *  - ni nov vir resnice: seme (museum-content.ts) ostaja edini vir;
 *  - ni samodejno sklepanje: 372 biografskih faz NI pretvorjenih v
 *    dogodke; vsak EVENT je naslovna ali stavčna trditev zapisa;
 *  - ni sprememba obstoječega kuratorskega grafa: relatedExhibits() in
 *    walkStopOf() (OBJECT ↔ OBJECT) ostajata dotaknjena — ta plast je
 *    DODATNA smer (OBJECT → PERSON/PLACE/EVENT/TIME);
 *  - ni sprememba registra virov: vir ni oseba (Source ≠ PersonRef);
 *    identiteta vira živi v source-registry.ts.
 *
 * PRAVILA IDENTITETE OSEB (kritično)
 *  - osebe z enakim priimkom NISO isto oseba: Ivan (1841–1930), Janko
 *    (1869–1941) in Konrad Barle (1875–1951) so trije bratje — trije vnosi;
 *  - dve osebi z istim imenom ostajata dve osebi (Peter Madronič stari,
 *    r. 1901 ≠ Peter Madronič pravnuk — glej ENTITY_QUEUE P0-E1);
 *  - vzdevki/psevdonimi so ALIAS ista oseba SAMO, kadar to samo besedilo
 *    dokazuje (»Matija Totter — po domače Jandreč Matiček«, MVG-057);
 *  - avtorji virov ostajajo v virih (Grabrijan, Rus, Novak, Balkovec …)
 *    — razen kadar so hkrati akterji zbirke (Fran Vesel: fotografije ~1920
 *    so nosilna dokumentacija zbirke; Franjo Veselko: zapis MVG-055).
 *
 * Vključitvena pravila (dokumentirana, da plast ostane majhna):
 *  OSEBA  — subjekt zapisa (naslov nosi osebo); ali zgodovinski akter,
 *          poimensko izpričan v ≥2 zapisih; ali eno-zapisna oseba z
 *          LASTNIM virom o njej (Karlinova, Vidmar, Janša, Žnideršič);
 *          sodobni akterji → kuratorska vrsta (P4-E1).
 *  KRAJ   — subjekt zapisa; ali čez-zapisni akter muzejskih trditev
 *          (Podzemelj, Črnomelj, Krasinec …); sosednje vasi iz
 *          ilustrativnih fotografij → P4-E6.
 *  DOGODEK — naslovna ali stavčna trditev zapisa o KONKRETNEM dogodku
 *          z letnico in kontekstom; šege (ponavljajoče prakse) niso
 *          dogodki (P4-E8); biografske faze niso dogodki.
 *  ČAS    — čez-zapisni časovni sidri (1468, 1526, 1669, vojni obdobji,
 *          muzejsko leto); eno-zapisna obdobja ostajajo na zapisu
 *          (Ilirske province → MVG-092, P4-E10).
 *
 * Delovna lista za kustodija: scripts/audit-entities.ts
 * (veljavnost registr + inventura + kuratorska vrsta).
 */

// ---------------------------------------------------------------------------
// MODEL — namenoma majhen
// ---------------------------------------------------------------------------

export type EntityKind = "person" | "place" | "event" | "time";

/** Vez entitete na obstoječo muzejsko trditev. */
export type EntityEvidence = {
  /** Slug zapisa, v katerem je entiteta izpričana. */
  slug: string;
  /** Indeks vira v exhibit.sources, kadar vir entiteto NEPOSREDNO
   *  dokumentira (ista veza kot sourceIndex v biografijah predmetov). */
  sourceIndex?: number;
};

/** Mehka časovna navedba — približnost se ohrani, ne pretvarja v datum. */
export type SoftTime = {
  /** Kot je zapisano v muzejskih podatkih (npr. »1876–1961«, »konec marca
   *  1945 (48 ur)«, »november 1889«). */
  labelSi: string;
  labelEn: string;
  /** Urejenostni ključ za prihodnjo časovnico (ni prikaz). */
  sortKey?: number;
};

/** Vloga osebe v muzejskem svetu (opisno, iz podatkov). */
export type PersonRole =
  | "subjekt-zapisa" // oseba, ki je sama predmet zbirke
  | "druzinski-clan" // družinski član subjekta (izpričan v ≥2 zapisih)
  | "zgodovinska-oseba" // zgodovinski akter, poimensko izpričan v virih
  | "fotograf"; // avtor nosilne vizualne dokumentacije zbirke

/** Vrsta kraja (opisno, iz podatkov). */
export type PlaceKind =
  | "vas"
  | "zasel"
  | "mesto"
  | "pokrajina"
  | "cerkev"
  | "reka"
  | "hrib"
  | "vodni-objekt"
  | "cerkvisce"
  | "arheolosko-najdigsce"
  | "rudnik"
  | "mlin"
  | "letaliste"
  | "stavba"
  | "etnografski-dvor";

/** Skupna polja vseh entitet. */
type BaseEntity = {
  /** Deterministični ID iz potrjene identitete (brez šumnikov). */
  id: string;
  labelSi: string;
  labelEn: string;
  /** Druga izpričana imena iste identitete (vzdevki, psevdonimi,
   *  slovnične oblike) — samo, kadar jih besedilo samo dokazuje. */
  aliases?: string[];
  /** Kuratorska opomba o izvoru identitete (dokumentirana odločitev). */
  note?: string;
  /** Vez na obstoječe zapise zbirke — obvezna za vsako entiteto. */
  evidence: EntityEvidence[];
};

export type PersonRef = BaseEntity & {
  type: "person";
  role: PersonRole;
  /** Življenjske letnice / delovno obdobje, KOT SO ZAPISANE. */
  time?: SoftTime;
};

export type PlaceRef = BaseEntity & {
  type: "place";
  placeKind: PlaceKind;
};

export type EventRef = BaseEntity & {
  type: "event";
  /** Datum/obdobje dogodka, kot je zapisano. */
  time?: SoftTime;
};

export type TimeRef = BaseEntity & {
  type: "time";
  /** Časovna vrednost (obvezna pri časovnih entitetah). */
  time: SoftTime;
};

export type EntityRef = PersonRef | PlaceRef | EventRef | TimeRef;

// ---------------------------------------------------------------------------
// REGISTR — ročno kuriran, vsak vnos vezan na dokaz
// ---------------------------------------------------------------------------

export const ENTITIES: EntityRef[] = [
  // =========================================================================
  // OSEBE — subjekti zapisov (18)
  // =========================================================================

  {
    id: "person:niko-zupanic",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Niko Županič",
    labelEn: "Niko Županič",
    aliases: ["dr. Niko Županič", "Niko Županič-Švarski", "Dr. Nikša Gribljanovič"],
    time: {
      labelSi: "1. december 1876 – 11. september 1961",
      labelEn: "1 December 1876 – 11 September 1961",
      sortKey: 1876,
    },
    note: "Ustanovitelj Slovenskega etnografskega muzeja (1921); rojen v hiši Švarskih — vzdevek izpričan v MVG-057/085; starši Miha (Miko), kmet in trgovec, ter Katarina r. Pezdirc; gimnazija Novo mesto 1888–97 (sošolec Ketteja in O. Župančiča); psevdonim dr. Nikša Gribljanovič (SBZ, vir sbl-zupanic).",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "petstoletnica-2026" },
      { slug: "niko-zupanic" },
      { slug: "izseljenstvo" },
      { slug: "vaska-sola" },
      { slug: "audrey-totter" },
      { slug: "nikolaj-dragos" },
      { slug: "matice-podzemelj" },
      { slug: "franc-brinc" },
      { slug: "katarina-zupanic" },
      { slug: "tamburasi-danica" },
      { slug: "matija-totter" },
      { slug: "kucar-podzemelj" },
      { slug: "joze-dular" },
      { slug: "kresovanje" },
      { slug: "mate-zupanic-svarski" },
      { slug: "krizevo-pastirski-dan" },
    ],
  },
  {
    id: "person:anton-filak",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Anton Filak",
    labelEn: "Anton Filak",
    note: "Osmkratni udeleženec svetovnih prvenstev v oranju; zaobljuba ob rojstvu sina je sprožila vrnitev glavnega zvona (1998). Rojstno leto ni zapisano (P3-E4).",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "sveti-vid" },
      { slug: "petstoletnica-2026" },
      { slug: "anton-filak" },
      { slug: "vaska-sola" },
      { slug: "audrey-totter" },
      { slug: "zvon-2008" },
      { slug: "strucelj-kmetija" },
    ],
  },
  {
    id: "person:audrey-totter",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Audrey Totter",
    labelEn: "Audrey Totter",
    aliases: ["Audrey Mary Totter"],
    time: {
      labelSi: "20. december 1917 – 2013",
      labelEn: "20 December 1917 – 2013",
      sortKey: 1917,
    },
    note: "Hollywoodska igralka filma noir; hčerka Janeza Totterja (Jandreča), rojena v Jolietu (Illinois).",
    evidence: [
      { slug: "audrey-totter" },
      { slug: "zaselki-griblje" },
      { slug: "matija-totter" },
      { slug: "ciril-totter" },
      { slug: "ljudje-ob-kolpi" },
      { slug: "john-randolph-totter" },
    ],
  },
  {
    id: "person:nikolaj-dragos",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Nikolaj Dragoš",
    labelEn: "Nikolaj Dragoš",
    aliases: ["Hajdeč Miko", "Nicolaus Dragosch (vojno ujetništvo)"],
    time: {
      labelSi: "27. avgust 1907 – 2018",
      labelEn: "27 August 1907 – 2018",
      sortKey: 1907,
    },
    note: "Najstarejši Slovenec svojega časa; rojen na Hajdeč gruntu, pri porodu je pomagala vaška babica Marjeta Totter.",
    evidence: [
      { slug: "vaska-sola" },
      { slug: "audrey-totter" },
      { slug: "nikolaj-dragos" },
      { slug: "franc-brinc" },
      { slug: "tamburasi-danica" },
      { slug: "matija-totter" },
      { slug: "ljudje-ob-kolpi" },
      { slug: "tone-kralj-98" },
    ],
  },
  {
    id: "person:peter-kambic",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Peter Kambič",
    labelEn: "Peter Kambič",
    aliases: ["Pirc Krasinski (psevdonim)"],
    time: {
      labelSi: "24. maj 1869 – 25. januar 1890",
      labelEn: "24 May 1869 – 25 January 1890",
      sortKey: 1869,
    },
    note: "Prvi učitelj v novi gribeljski šoli (november 1889); zapisal »Božič pri Belokranjcih« (1889) pod psevdonimom Pirc Krasinski.",
    evidence: [
      { slug: "vaska-sola" },
      { slug: "peter-kambic" },
      { slug: "katarina-zupanic" },
      { slug: "muzejska-ucilnica" },
      { slug: "gribeljci-po-svetu-2019" },
      { slug: "ljudje-ob-kolpi" },
      { slug: "valvasor-1689" },
    ],
  },
  {
    id: "person:franc-brinc",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "dr. Franc Brinc",
    labelEn: "dr. Franc Brinc",
    aliases: ["Franci Brinc"],
    time: {
      labelSi: "90. rojstni dan 2025 (rojstni datum ni zapisan)",
      labelEn: "90th birthday 2025 (birth date not recorded)",
      sortKey: 1935,
    },
    note: "Pravnik in dobrotnik vasi; obiskoval gribeljsko šolo 1941–1945. »Franci Brinc« (Radio Odeon) je ista oseba — 90. rojstni dan v obeh virih (P1-E3, P2-E2); Dolenjski list (maj 2026) potrdi 91. rojstni dan s spominsko ploščo na šoli — tretji neodvisni vir. Ni sorodnik Katarine Brinc (pogreb 1918, P1-E6).",
    evidence: [
      { slug: "petstoletnica-2026" },
      { slug: "pgd-griblje-1927" },
      { slug: "franc-brinc" },
      { slug: "praznik-ks-2024" },
    ],
  },
  {
    id: "person:katarina-zupanic",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Katarina Zupanič",
    labelEn: "Katarina Zupanič",
    aliases: ["Katarina Pezdirc (rojena)"],
    time: {
      labelSi: "1855 – 23. julij 1923",
      labelEn: "1855 – 23 July 1923",
      sortKey: 1855,
    },
    note: "Kmetica z Grizina, mati etnologa Nika Županiča; zapisala ljudsko izročilo Gribelj (objavljeno 1937 v Etnologu).",
    evidence: [
      { slug: "peter-kambic" },
      { slug: "katarina-zupanic" },
      { slug: "kucar-podzemelj" },
      { slug: "ljudje-ob-kolpi" },
    ],
  },
  {
    id: "person:toni-gasperic",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Toni Gašperič",
    labelEn: "Toni Gašperič",
    note: "Humorist z bregov Kolpe; letnic ni v podatkih (P3-E2).",
    evidence: [{ slug: "toni-gasperic" }, { slug: "ljudje-ob-kolpi" }],
  },
  {
    id: "person:franjo-veselko",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Franjo Veselko",
    labelEn: "Franjo Veselko",
    time: {
      labelSi: "1905 – 1977",
      labelEn: "1905 – 1977",
      sortKey: 1905,
    },
    note: "Profesor zgodovine in geografije, partizanski fotograf; njegovi posnetki marca 1945 pri Gribljah so glavni sliki zapisov MVG-014 in MVG-056.",
    evidence: [
      { slug: "evakuacija-1945" },
      { slug: "veselko-fotograf", sourceIndex: 0 },
      { slug: "zracni-most-krasinec", sourceIndex: 1 },
    ],
  },
  {
    id: "person:matija-totter",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Matija Totter",
    labelEn: "Matija Totter",
    aliases: ["Jandreč Matiček", "Matiček"],
    time: {
      labelSi: "7. februar 1873 – 17. marec 1950",
      labelEn: "7 February 1873 – 17 March 1950",
      sortKey: 1873,
    },
    note: "Ista oseba dveh imen, dokazano v samem zapisu: »Matija Totter — po domače Jandreč Matiček« (MVG-057); umrl v Balmorhee (Teksas).",
    evidence: [
      { slug: "audrey-totter" },
      { slug: "matija-totter" },
      { slug: "kresovanje" },
      { slug: "ljudje-ob-kolpi" },
      { slug: "krizevo-pastirski-dan" },
    ],
  },
  {
    id: "person:janko-barle",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Janko Barle",
    labelEn: "Janko Barle",
    time: {
      labelSi: "1869 – 1941",
      labelEn: "1869 – 1941",
      sortKey: 1869,
    },
    note: "Zapisovalec Bele krajine (šege, pesmi, pripovedke); učitelj Jandreča Matička pri zbiranju; brat Konrada in sin Ivana.",
    evidence: [
      { slug: "matija-totter" },
      { slug: "janko-barle" },
      { slug: "pisanice" },
      { slug: "kresovanje" },
      { slug: "ljudje-ob-kolpi" },
    ],
  },
  {
    id: "person:konrad-barle",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Konrad Barle",
    labelEn: "Konrad Barle",
    time: {
      labelSi: "19. februar 1875 – 15. julij 1951",
      labelEn: "19 February 1875 – 15 July 1951",
      sortKey: 1875,
    },
    note: "Učitelj v Metliki (1899–1934), čebelar, ki je Beli krajini prinesel AŽ-panj; med ustanovitelji Belokranjskega muzeja. Brat Janka — ne Ivan (1841–1930, oče, lasten vnos).",
    evidence: [
      { slug: "janko-barle" },
      { slug: "konrad-barle", sourceIndex: 0 },
      { slug: "kucar-podzemelj" },
      { slug: "kranjska-sivka" },
      { slug: "panjska-koncnica" },
    ],
  },
  {
    id: "person:joze-dular",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Jože Dular",
    labelEn: "Jože Dular",
    time: {
      labelSi: "1915 – 2000",
      labelEn: "1915 – 2000",
      sortKey: 1915,
    },
    note: "Muzealec, pesnik in varuh belokranjskega spomina; trideset let Belokranjskega muzeja. NI Janez Dular, arheolog (avtor monografije Kučar) — dve osebi (P1-E4).",
    evidence: [
      { slug: "janko-barle" },
      { slug: "konrad-barle" },
      { slug: "joze-dular" },
      { slug: "ljudje-ob-kolpi" },
      { slug: "valvasor-1689" },
    ],
  },
  {
    id: "person:ciril-totter",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Ciril Totter",
    labelEn: "Ciril Totter",
    note: "Ekološki kmet na Jandrečetovi domačiji in maratonc; rojstno leto in časi maratonov niso zapisani (P3-E1).",
    evidence: [
      { slug: "audrey-totter" },
      { slug: "matija-totter" },
      { slug: "ciril-totter" },
      { slug: "sd-griblje-sport" },
      { slug: "anton-brodaric" },
    ],
  },
  {
    id: "person:mate-zupanic-svarski",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Mate Zupanič-Švarski",
    labelEn: "Mate Zupanič-Švarski",
    time: {
      labelSi: "17. november 1885 – 1917",
      labelEn: "17 November 1885 – 1917",
      sortKey: 1885,
    },
    note: "Prostovoljec solunske fronte, brat etnologa Nika; iz hiše Švarskih pod Gribljami.",
    evidence: [{ slug: "mate-zupanic-svarski" }],
  },
  {
    id: "person:anton-brodaric",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Anton Brodarič",
    labelEn: "Anton Brodarič",
    aliases: ["Tone Brodarič"],
    time: {
      labelSi: "ekspedicija 2024 → 2025 (vrh Mera Peaka, 6.467 m)",
      labelEn: "expedition 2024 → 2025 (Mera Peak summit, 6,467 m)",
      sortKey: 2024,
    },
    note: "Alpinista; najvišja točka, kar jih je dosegel človek iz te vasi.",
    evidence: [{ slug: "anton-brodaric" }],
  },
  {
    id: "person:tone-kralj",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Tone Kralj",
    labelEn: "Tone Kralj",
    time: {
      labelSi: "osemindevetdeset let (januar 2026); rojstno leto ni zapisano",
      labelEn: "ninety-eight years old (January 2026); birth year not recorded",
      sortKey: 1928,
    },
    note: "Gribeljski stoletnik v nastajanju — NE grafik Tone Kralj (1900–1970), ki v zbirki ni izpričan. Letnico NE izračunavamo iz starosti (P3-E3).",
    evidence: [{ slug: "tone-kralj-98" }],
  },
  {
    id: "person:janez-vajkard-valvasor",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Janez Vajkard Valvasor",
    labelEn: "Janez Vajkard Valvasor",
    note: "Plemič z Bogenšperka, avtor Slave vojvodine Kranjske (1689); po besedilu zapisa »umrl je revno, komaj petdesetleten« — rojstne letnice ne izračunavamo.",
    evidence: [
      { slug: "uskoki-in-vojna-krajina" },
      { slug: "janko-barle" },
      { slug: "kucar-podzemelj" },
      { slug: "valvasor-1689" },
      { slug: "stari-zemljevidi" },
      { slug: "ilirska-carina-1809" },
    ],
  },

  // =========================================================================
  // OSEBE — zgodovinski akterji čez zapise / z lastnim virom (15)
  // =========================================================================

  {
    id: "person:ivan-barle",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Ivan Barle",
    labelEn: "Ivan Barle",
    time: {
      labelSi: "1841 – 1930",
      labelEn: "1841 – 1930",
      sortKey: 1841,
    },
    note: "Učitelj, organist in sadjar v Podzemlju (1872–1893); gribeljski otroci so pred 1889 hodili k njegovemu pouku. Kot ravnatelj je 1888 podzemeljsko enorazrednico spremenil v dvorazrednico in na lastno željo sprejel učiteljico Dragojilo Milek (DL 22. 7. 2022). Oče Janka in Konrada — TRIJE Barleti, trije vnosi (ne združuj).",
    evidence: [
      { slug: "konrad-barle", sourceIndex: 1 },
      { slug: "kucar-podzemelj" },
      { slug: "kranjska-sivka" },
      { slug: "dragojila-milek" },
    ],
  },
  {
    id: "person:janez-totter",
    type: "person",
    role: "druzinski-clan",
    labelSi: "Janez Totter",
    labelEn: "Janez Totter",
    aliases: ["Janez Jandreč"],
    note: "Brat Matije Totterja (Jandreča); oče Audrey Totter; ustalil se v Jolietu (Illinois), trgovino odprl v Saragosi (Teksas).",
    evidence: [
      { slug: "audrey-totter" },
      { slug: "matija-totter" },
      { slug: "ciril-totter" },
    ],
  },
  {
    id: "person:john-randolph-totter",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "John Randolph Totter",
    labelEn: "John Randolph Totter",
    aliases: ["prof. dr. John Randolph Totter"],
    time: {
      labelSi: "7. januar 1914 – 1. februar 2001",
      labelEn: "7 January 1914 – 1 February 2001",
      sortKey: 1914,
    },
    note: "Najmlajši sin Matije Totterja in Angležinje Agnes Smith iz Manchestra; rojen v Saragosi (Reeves County, Teksas), doktorat kemije v Iowi 1938, biokemik v Nacionalnem laboratoriju Oak Ridge; življenjepis po ustnem zgodovinskem zapisu DOE (23. 1. 1995) na ETHW; bratranec Audrey.",
    evidence: [
      { slug: "john-randolph-totter" },
      { slug: "audrey-totter" },
      { slug: "matija-totter" },
    ],
  },
  {
    id: "person:dragojila-milek",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Dragojila Milek",
    labelEn: "Dragojila Milek",
    aliases: ["Karolina Milek", "Petrovna", "Črnogorka", "Gregorčičeva planinska roža"],
    time: {
      labelSi: "11. november 1850 – 22. julij 1890",
      labelEn: "11 November 1850 – 22 July 1890",
      sortKey: 1850,
    },
    note: "Učiteljica in pesnica, velika ljubezen Simona Gregorčiča; hči očeta, doma iz sosednjih Gribelj; zadnja služba v Podzemlju 1888–1889 pri ravnatelju Ivanu Barletu (DL 22. 7. 2022). Leto smrti: SB/OSP 1890, DL 2022 navaja 1889 — datum 22. julij se ujema.",
    evidence: [{ slug: "dragojila-milek" }],
  },
  {
    id: "person:valentina-strucelj",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Valentina Štrucelj",
    labelEn: "Valentina Štrucelj",
    time: {
      labelSi: "od leta 2010 javno dokumentirana",
      labelEn: "publicly documented since 2010",
      sortKey: 2010,
    },
    note: "Klarinetistka iz Gribelj: odlika v Gradcu, magisterij bas klarineta v Bernu (mentor Ernesto Molinari), učiteljica na Glasbeni šoli konservatorij Bern, album Current Density s Sebastianom Rotzlerjem; sestrična pevke Kristine Oberžan.",
    evidence: [{ slug: "valentina-strucelj" }],
  },
  {
    id: "person:marko-snoj",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Marko Snoj",
    labelEn: "Marko Snoj",
    note: "Jezikoslovec; v obeh zapisih citiran iz Etimološkega slovarja slovenskih zemljepisnih imen (Modrijan, Ljubljana 2009, str. 153).",
    evidence: [
      { slug: "griblje-vas", sourceIndex: 5 },
      { slug: "griblje-v-stevilkah", sourceIndex: 4 },
    ],
  },
  {
    id: "person:joze-simec",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Jože Šimec",
    labelEn: "Jože Šimec",
    note: "Avtor članka »Izvor imena vasi Griblje« (Dolenjski list, 11. 1. 2001, str. 17) — vir z znano kuratorsko odločitvijo identitete vira (B-skupina, TASK 38).",
    evidence: [
      { slug: "griblje-vas", sourceIndex: 3 },
      { slug: "etimologija-gribljati", sourceIndex: 1 },
    ],
  },
  {
    id: "person:fran-vesel",
    type: "person",
    role: "fotograf",
    labelSi: "Fran Vesel",
    labelEn: "Fran Vesel",
    time: {
      labelSi: "fotografije ~1920 (leta življenja niso v podatkih)",
      labelEn: "photographs ~1920 (life dates not in the data)",
      sortKey: 1920,
    },
    note: "Fotograf belokranjskega kmečkega vsakdana; njegovi posnetki (~1920) so glavna slika več kot desetih zapisov zbirke (P3-E6).",
    evidence: [
      { slug: "tkalstvo" },
      { slug: "anton-filak" },
      { slug: "bele-breze" },
      { slug: "pecnica-susenje-sadja" },
    ],
  },
  {
    id: "person:henrik-freyer",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Henrik Freyer",
    labelEn: "Henrik Freyer",
    time: {
      labelSi: "Special-Karta 1843",
      labelEn: "Special-Karte 1843",
      sortKey: 1843,
    },
    note: "Kartograf Special-Karte vojvodine Kranjske (1843), na kateri je vsaka vas dežele dobila ime in prostor.",
    evidence: [
      { slug: "griblje-v-stevilkah", sourceIndex: 5 },
      { slug: "stari-zemljevidi", sourceIndex: 2 },
    ],
  },
  {
    id: "person:bozo-racic",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Božo Račić",
    labelEn: "Božo Račić",
    note: "Soustanovitelj Belokranjskega muzeja (1949) z Barletom in Dularjem.",
    evidence: [{ slug: "janko-barle" }, { slug: "konrad-barle" }],
  },
  {
    id: "person:marjeta-totter",
    type: "person",
    role: "druzinski-clan",
    labelSi: "Marjeta Totter",
    labelEn: "Marjeta Totter",
    aliases: ["Marjeta Štrucelj (rojena)"],
    note: "Vaška babica in mati Matije Totterja; pri njeni pomoči je leta 1907 prišel na svet tudi Niko Dragoš.",
    evidence: [{ slug: "nikolaj-dragos" }, { slug: "matija-totter" }],
  },
  {
    id: "person:amalija-ursic",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Amalija Uršič",
    labelEn: "Amalija Uršič",
    note: "Begunka s Kobaridskega, učiteljica, ki je vasi med prvo svetovno vojno prinesla tamburo; vodila tamburaše društva Danica. Letnic ni v podatkih (P3-E7).",
    evidence: [{ slug: "vaska-sola" }, { slug: "tamburasi-danica" }],
  },
  {
    id: "person:alojzij-sustar",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Alojzij Šuštar",
    labelEn: "Alojzij Šuštar",
    aliases: ["nadškof dr. Alojzij Šuštar"],
    note: "Nadškof, ki je leta 1998 blagoslovil vrnjeni glavni zvon.",
    evidence: [
      { slug: "sveti-vid" },
      { slug: "anton-filak" },
      { slug: "zvon-2008" },
    ],
  },
  {
    id: "person:alma-karlin",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Alma Karlin",
    labelEn: "Alma Karlin",
    note: "Popotnica in pisateljica; med evakuiranci zračnega mosta marca 1945 (MVG-056, lasten vir). Natančnejša vez na Griblje ni zapisana (P3-E9).",
    evidence: [{ slug: "zracni-most-krasinec", sourceIndex: 2 }],
  },
  {
    id: "person:josip-vidmar",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Josip Vidmar",
    labelEn: "Josip Vidmar",
    note: "Literarni zgodovinar; predsedoval SNOS na zasedanju v Črnomlju (1944).",
    evidence: [{ slug: "snos-crnomelj-1944", sourceIndex: 5 }],
  },
  {
    id: "person:anton-jansa",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Anton Janša",
    labelEn: "Anton Janša",
    time: {
      labelSi: "1734 – 1773",
      labelEn: "1734 – 1773",
      sortKey: 1734,
    },
    note: "Prvi učitelj čebelarstva na cesarski dunajski šoli (ustanovila jo je 1769 Marija Terezija); po njegovi poti je kranjska sivka odprla vrata sveta.",
    evidence: [{ slug: "kranjska-sivka", sourceIndex: 1 }],
  },
  {
    id: "person:anton-znidersic",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Anton Žnideršič",
    labelEn: "Anton Žnideršič",
    time: {
      labelSi: "1874 – 1947",
      labelEn: "1874 – 1947",
      sortKey: 1874,
    },
    note: "Oblikovalec AŽ-panja (Alberti-Žnideršičev panj), ki ga je Konrad Barle razširil po Beli krajini.",
    evidence: [{ slug: "kranjska-sivka", sourceIndex: 3 }],
  },
  {
    id: "person:anton-vadnal",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Anton Vadnal",
    labelEn: "Anton Vadnal",
    aliases: ["Pivčan", "A. Komar", "Anton Komar", "Fronetov Fran", "Anton Vadnjal"],
    time: {
      labelSi: "4. april 1876 – 10. februar 1935",
      labelEn: "4 April 1876 – 10 February 1935",
      sortKey: 1876,
    },
    note: "Avtor povesti »Bridke izkušnje« (Domoljub 1898, MVG-109) pod psevdonimom Pivčan; duhovnik in pisatelj — SBL sbi753104: ★ 4. 4. 1876 Borovnica (oče železniški sprevodnik), † 10. 2. 1935 Šentožbolt; psevdonimi A. Komar, Pivčan, Fronetov Fran (SBL iskanje: izključno ta vnos); gimnazija Ljubljana 1888–96 (sošolec O. Župančiča), dunajski študij zemljepisa in zgodovine 1896–1900, kaplan Višnja Gora/Cerklje na Dolenjskem/Krka, župnik Šentožbolt od 1928; po 1929 zaprt zaradi nastopa proti centralni diktaturi (23. val: identiteta psevdonima razrešena).",
    evidence: [{ slug: "bridke-izkusnje-1898", sourceIndex: 3 }],
  },

  // =========================================================================
  // KRAJEVI (26)
  // =========================================================================

  {
    id: "place:griblje",
    type: "place",
    placeKind: "vas",
    labelSi: "Griblje",
    labelEn: "Griblje",
    aliases: ["Griblach (1468)", "Briglach (1490)", "Griblah (1593)", "Grüble (urbarji, najstarejši zemljevid)"],
    note: "Veriga zaselkov v občini Črnomelj; prvič izpričana 1468. Zunanja meja slova vseh zapisov zbirke — tu vezani le zapisi, ki so neposredno O vasi.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "griblje-v-stevilkah" },
      { slug: "zaselki-griblje" },
      { slug: "etimologija-gribljati" },
    ],
  },
  {
    id: "place:dolnje-griblje",
    type: "place",
    placeKind: "zasel",
    labelSi: "Dolnje Griblje",
    labelEn: "Dolnje Griblje",
    note: "Spodnji zasek proti reki — stoletja mlinarji, čolnarji in kopališčarji.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "griblje-v-stevilkah" },
      { slug: "zaselki-griblje" },
    ],
  },
  {
    id: "place:srednje-griblje",
    type: "place",
    placeKind: "zasel",
    labelSi: "Srednje Griblje",
    labelEn: "Srednje Griblje",
    note: "Srednji zasek ob cesti Črnomelj–Podzemelj, po kateri je tekla vsa trgovina.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "griblje-v-stevilkah" },
      { slug: "zaselki-griblje" },
    ],
  },
  {
    id: "place:gornje-griblje",
    type: "place",
    placeKind: "zasel",
    labelSi: "Gornje Griblje",
    labelEn: "Gornje Griblje",
    note: "Zgornji zasek proti hribom — od koder so Jandreči/Totterji odnesli imena čez ocean.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "griblje-v-stevilkah" },
      { slug: "audrey-totter" },
      { slug: "zaselki-griblje" },
    ],
  },
  {
    id: "place:brinsko-selo",
    type: "place",
    placeKind: "zasel",
    labelSi: "Brinsko selo",
    labelEn: "Brinsko selo",
    note: "Četrti zasek; kdaj se prvič zapiše njegovo ime — odprto vprašanje zapisa MVG-049.",
    evidence: [{ slug: "zaselki-griblje" }],
  },
  {
    id: "place:cerkev-svetega-vida",
    type: "place",
    placeKind: "cerkev",
    labelSi: "Cerkev sv. Vida",
    labelEn: "Church of St. Vitus",
    note: "Versko središče in najizrazitejša silhueta vasi; prvič v listinah 1526, sedanja stavba iz 18. stoletja; župnija Podzemelj. Sveti Vid (mučenik) ni oseba te plasti — glej P4-E9.",
    evidence: [{ slug: "sveti-vid" }, { slug: "petstoletnica-2026" }, { slug: "zvon-2008" }],
  },
  {
    id: "place:kolpa",
    type: "place",
    placeKind: "reka",
    labelSi: "Kolpa",
    labelEn: "the Kolpa",
    note: "Življenjska žila vasi: ribolovna, mlinarska in mejna reka; najtoplejša slovenska reka; od 1991 državna meja.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "kolpa-reka" },
      { slug: "malenca" },
      { slug: "loke-in-studenci" },
    ],
  },
  {
    id: "place:bela-krajina",
    type: "place",
    placeKind: "pokrajina",
    labelSi: "Bela krajina",
    labelEn: "Bela krajina",
    note: "Pokrajina med Gorjanci in Kolpo; stoletja obrambni rob Evrope; okvir, v katerem stoji vsa zbirka.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "uskoki-in-vojna-krajina" },
      { slug: "snos-crnomelj-1944" },
    ],
  },
  {
    id: "place:sokcev-dvor",
    type: "place",
    placeKind: "etnografski-dvor",
    labelSi: "Šokčev dvor",
    labelEn: "the Šokac homestead (Šokčev dvor)",
    note: "Etnografski spomenik v Žuničih ob Kolpi — tehnična in stavbna dediščina obkolpskega kmečkega sveta.",
    evidence: [{ slug: "sokcev-dvor" }],
  },
  {
    id: "place:zunici",
    type: "place",
    placeKind: "vas",
    labelSi: "Žuniči",
    labelEn: "Žuniči",
    note: "Vas ob Kolpi, v kateri stoji Šokčev dvor.",
    evidence: [{ slug: "sokcev-dvor" }],
  },
  {
    id: "place:malenca",
    type: "place",
    placeKind: "vas",
    labelSi: "Malenca",
    labelEn: "Malenca",
    note: "Kraj ob Kolpi pri Gribljah s slapom in malenco — toča v apnencu, po kateri se voda vrača na dan.",
    evidence: [{ slug: "malenca" }],
  },
  {
    id: "place:dragosi",
    type: "place",
    placeKind: "vas",
    labelSi: "Dragoši",
    labelEn: "Dragoši",
    note: "Kraj ob Kolpi ob Gribljah (merilno mesto »Dragoši – Griblje«); 1936 skupaj z Gribljami priključen občini Gradac. NI priimek Dragoš — ločeno od person:nikolaj-dragos.",
    evidence: [
      { slug: "kolpa-reka" },
      { slug: "obcina-griblje" },
      { slug: "kopalisce-griblje" },
    ],
  },
  {
    id: "place:vaski-ribnik",
    type: "place",
    placeKind: "vodni-objekt",
    labelSi: "Vaški ribnik",
    labelEn: "the village pond",
    note: "Voda za hišami; leta 2008 je hišica ob ribniku postala muzejska učilnica (zapis MVG-069 hišico nosi v ilustraciji).",
    evidence: [{ slug: "griblje-vas" }, { slug: "ribnik" }],
  },
  {
    id: "place:cerkvisce",
    type: "place",
    placeKind: "cerkvisce",
    labelSi: "Cerkvišče",
    labelEn: "Cerkvišče",
    note: "Kraj treh cerkvic, ki jih ni več (prva omemba 1408).",
    evidence: [{ slug: "cerkvisce" }],
  },
  {
    id: "place:goranja-lokva",
    type: "place",
    placeKind: "vodni-objekt",
    labelSi: "Goranja lokva",
    labelEn: "Goranja lokva",
    note: "Lokva nad vasjo, pri kateri so kmetje kopali glino za opeko.",
    evidence: [{ slug: "griblje-vas" }, { slug: "goranja-lokva" }],
  },
  {
    id: "place:rudna-pec",
    type: "place",
    placeKind: "vodni-objekt",
    labelSi: "Rudna peč",
    labelEn: "Rudna peč",
    note: "Kraj nad vasjo, kjer so naleteli na železovo prst.",
    evidence: [{ slug: "griblje-vas" }, { slug: "goranja-lokva" }],
  },
  {
    id: "place:arheolosko-najdigsce-ob-kolpi",
    type: "place",
    placeKind: "arheolosko-najdigsce",
    labelSi: "Arheološko najdišče ob Kolpi",
    labelEn: "the archaeological site by the Kolpa",
    note: "Pet tisočletij naselbin in grobišč pod obkolpskimi njivami (od neolitika do rimske dobe); registrirana dediščina.",
    evidence: [{ slug: "arheolosko-najdigsce-ob-kolpi" }],
  },
  {
    id: "place:kucar",
    type: "place",
    placeKind: "hrib",
    labelSi: "Kučar",
    labelEn: "Kučar",
    note: "Hrib (222 m) nad Podzemljem: železnodobno naselje in zgodnjekrščanski stavbni kompleks; pod njim so se pisale Griblje.",
    evidence: [{ slug: "kucar-podzemelj" }],
  },
  {
    id: "place:kanizarica",
    type: "place",
    placeKind: "rudnik",
    labelSi: "Rudnik Kanižarica",
    labelEn: "the Kanižarica mine",
    note: "Rudnik rjavega premoga (1857–1997), sedem kilometrov od vasi — industrijsko srce, ki je gribeljske roke hranilo z dnem.",
    evidence: [{ slug: "kanizarica" }],
  },
  {
    id: "place:madronicev-mlin",
    type: "place",
    placeKind: "mlin",
    labelSi: "Madroničev mlin",
    labelEn: "the Madronič mill",
    note: "Mlin in žaga v Prelesju ob Kolpi (2,5 km po ravnini od Gribelj), kupljena 1937; mlin v nadstropju, kakor zahtevajo kolpške poplave. Natančna lega ni v zapisu (P3-E8).",
    evidence: [{ slug: "kolpa-extremi" }, { slug: "madronicev-mlin" }],
  },
  {
    id: "place:podzemelj",
    type: "place",
    placeKind: "vas",
    labelSi: "Podzemelj",
    labelEn: "Podzemelj",
    note: "Sedež podzemeljske fare, h kateri Griblje spadajo stoletja: matične knjige 1669–1947, šola (Ivan Barle 1872–1893), Kučar.",
    evidence: [
      { slug: "vaska-sola" },
      { slug: "matice-podzemelj" },
      { slug: "porocna-1669" },
      { slug: "spanska-gripa-1918" },
      { slug: "konrad-barle" },
      { slug: "kucar-podzemelj" },
    ],
  },
  {
    id: "place:crnomelj",
    type: "place",
    placeKind: "mesto",
    labelSi: "Črnomelj",
    labelEn: "Črnomelj",
    note: "Središče občine in okraja: SNOS 1944, cesta Črnomelj–Griblje, šola in uprava, kamor je vas gledala stoletja.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "snos-crnomelj-1944" },
      { slug: "zaseda-1941" },
      { slug: "obcina-griblje" },
    ],
  },
  {
    id: "place:partizansko-letalisce-otok",
    type: "place",
    placeKind: "letaliste",
    labelSi: "Partizansko letališče Otok",
    labelEn: "the Otok partisan airfield",
    note: "Travnik ob vasi Otok pri Metliki (pomlad 1944 – konec vojne): 1473 prepeljanih ranjencev; danes ga varuje spominski Dakota C-47.",
    evidence: [{ slug: "letalisce-otok-1944" }, { slug: "dakota-otok" }],
  },
  {
    id: "place:krasinec",
    type: "place",
    placeKind: "vas",
    labelSi: "Krasinec",
    labelEn: "Krasinec",
    note: "Zaselk ob Kolpi nedaleč od Gribelj (rojstni kraj Petra Kambiča); z improviziranega letališča tu je marca 1945 vzletal zračni most.",
    evidence: [
      { slug: "letalisce-otok-1944" },
      { slug: "peter-kambic" },
      { slug: "zracni-most-krasinec" },
    ],
  },
  {
    id: "place:vaska-sola",
    type: "place",
    placeKind: "stavba",
    labelSi: "Vaška šola Griblje",
    labelEn: "the Griblje village school",
    note: "Šolsko poslopje, blagoslovljeno novembra 1889; prvi učitelj Peter Kambič; 1941–1945 zasedeno (pouk v gasilskem domu); od 2022 dom Muzejske učilnice.",
    evidence: [
      { slug: "vaska-sola" },
      { slug: "peter-kambic" },
      { slug: "franc-brinc" },
      { slug: "muzejska-ucilnica" },
      { slug: "gribeljci-po-svetu-2019" },
    ],
  },
  {
    id: "place:metlika",
    type: "place",
    placeKind: "mesto",
    labelSi: "Metlika",
    labelEn: "Metlika",
    note: "Metliška postojanka Konrada Barleta (1899–1934); carinarnica Ilirskih provinc; razglednica iz leta 1903.",
    evidence: [
      { slug: "konrad-barle" },
      { slug: "razglednica-1903" },
      { slug: "ilirska-carina-1809" },
    ],
  },

  // =========================================================================
  // DOGODKI (27) — naslovne ali stavčne trditve zapisov, ne biografske faze
  // =========================================================================

  {
    id: "event:snos-zasedanje-1944",
    type: "event",
    labelSi: "Zasedanje SNOS v Črnomlju",
    labelEn: "the SNOS session in Črnomelj",
    time: {
      labelSi: "19.–20. februar 1944",
      labelEn: "19–20 February 1944",
      sortKey: 1944,
    },
    note: "Prvi slovenski parlament: SNOS se je preimenoval v svet in ustanovil zakonodajni odbor; predsedoval Josip Vidmar.",
    evidence: [{ slug: "snos-crnomelj-1944" }],
  },
  {
    id: "event:zaseda-na-cesti-1941",
    type: "event",
    labelSi: "Zaseda na cesti Črnomelj–Griblje",
    labelEn: "the ambush on the Črnomelj–Griblje road",
    time: {
      labelSi: "6. september 1941",
      labelEn: "6 September 1941",
      sortKey: 1941,
    },
    note: "Med najzgodnejšim odporom v Sloveniji: štirje borci napadli patruljo italijanskih mejnih policistov; spomenik stoji ob cesti.",
    evidence: [{ slug: "zaseda-1941", sourceIndex: 0 }, { slug: "praznik-ks-2024" }],
  },
  {
    id: "event:zracni-most-krasinec-1945",
    type: "event",
    labelSi: "Zračni most Krasinec",
    labelEn: "the Krasinec airlift",
    time: {
      labelSi: "konec marca 1945 (48 ur)",
      labelEn: "late March 1945 (48 hours)",
      sortKey: 1945,
    },
    note: "2041 ljudi v 48 urah v zavezniško bazo v Bari; obe fotografiji Veselka posneti pri Gribljah. Povezuje MVG-014 in MVG-056, ki opisujeta isto operacijo — kuratorska potrditev identitete dogodka v vrsti (P1-E1).",
    evidence: [
      { slug: "letalisce-otok-1944" },
      { slug: "evakuacija-1945" },
      { slug: "zracni-most-krasinec" },
    ],
  },
  {
    id: "event:spanska-gripa-1918",
    type: "event",
    labelSi: "Španska gripa v podzemeljski matici",
    labelEn: "the Spanish flu in the Podzemelj register",
    time: {
      labelSi: "oktober – december 1918",
      labelEn: "October – December 1918",
      sortKey: 1918,
    },
    note: "Pisar je vzrok smrti zapisal kot »pljučnica (španka)«; petinpetdeset pogrebov župnije v petih tednih in pol.",
    evidence: [{ slug: "spanska-gripa-1918" }],
  },
  {
    id: "event:vrnitev-glavnega-zvona-1998",
    type: "event",
    labelSi: "Vrnitev glavnega zvona",
    labelEn: "the return of the main bell",
    time: {
      labelSi: "1998",
      labelEn: "1998",
      sortKey: 1998,
    },
    note: "Z akcijo, ki jo je sprožil Anton Filak z zaobljubo ob rojstvu sina, je vas vrnila glavni zvon, odvzet v prvi svetovni vojni; blagoslov nadškof Alojzij Šuštar.",
    evidence: [{ slug: "sveti-vid" }, { slug: "anton-filak" }, { slug: "zvon-2008" }],
  },
  {
    id: "event:blagoslov-zvona-2008",
    type: "event",
    labelSi: "Blagoslov in posvetitev novega zvona",
    labelEn: "the blessing of the new bell",
    time: {
      labelSi: "2008",
      labelEn: "2008",
      sortKey: 2008,
    },
    note: "O dogodku je nastala spominska knjiga »SV. VID GRIBLJE … Griblje 2008« — eden redkih tiskanih virov, nastalih v vasi.",
    evidence: [{ slug: "zvon-2008" }],
  },
  {
    id: "event:petstoletnica-cerkve-2026",
    type: "event",
    labelSi: "Petsto let cerkve sv. Vida",
    labelEn: "five hundred years of the Church of St. Vitus",
    time: {
      labelSi: "junij 2026",
      labelEn: "June 2026",
      sortKey: 2026,
    },
    note: "Slovesnost ob 500-letnici prve omembe (1526): somaševal upokojeni novomeški škof; nastala knjižica o cerkvi in vasi.",
    evidence: [
      { slug: "petstoletnica-2026" },
      { slug: "franc-brinc" },
      { slug: "zvon-2008" },
    ],
  },
  {
    id: "event:ustanovitev-pgd-griblje-1927",
    type: "event",
    labelSi: "Ustanovitev Prostovoljnega gasilskega društva Griblje",
    labelEn: "the founding of the Volunteer Fire Brigade of Griblje",
    time: {
      labelSi: "1927",
      labelEn: "1927",
      sortKey: 1927,
    },
    note: "Društvo, ob katerem je vas stoletje reševala samo sebe; stoletnica pred vrati.",
    evidence: [{ slug: "pgd-griblje-1927" }],
  },
  {
    id: "event:ustanovitev-obcine-griblje-1854",
    type: "event",
    labelSi: "Ustanovitev občine Griblje",
    labelEn: "the founding of the Municipality of Griblje",
    time: {
      labelSi: "1854",
      labelEn: "1854",
      sortKey: 1854,
    },
    note: "Osemdeset let, ko je vas upravljala sama sebe.",
    evidence: [{ slug: "obcina-griblje" }],
  },
  {
    id: "event:ukinitev-obcine-griblje-1933",
    type: "event",
    labelSi: "Ukinitev občine Griblje",
    labelEn: "the dissolution of the Municipality of Griblje",
    time: {
      labelSi: "1933 (komasacija; 1936 priključitev občini Gradac)",
      labelEn: "1933 (land consolidation; 1936 annexation to the Municipality of Gradac)",
      sortKey: 1933,
    },
    note: "Komasacija je občino razpustila; Griblje (in Dragoši) so 1936 prešle h občini Gradac ob Lahinji — samostojnost je ostala v krajevni skupnosti.",
    evidence: [{ slug: "obcina-griblje" }],
  },
  {
    id: "event:meja-ob-kolpi-1991",
    type: "event",
    labelSi: "Meja ob Kolpi",
    labelEn: "the border on the Kolpa",
    time: {
      labelSi: "1991",
      labelEn: "1991",
      sortKey: 1991,
    },
    note: "Tok reke je postal zunanja meja samostojne Slovenije — od novih mejnih kamnov do skupne schengenske Kolpe.",
    evidence: [{ slug: "griblje-vas" }, { slug: "meja-1991" }],
  },
  {
    id: "event:objava-slave-vojvodine-kranjske-1689",
    type: "event",
    labelSi: "Objava Slave vojvodine Kranjske",
    labelEn: "the publication of The Glory of the Duchy of Carniola",
    time: {
      labelSi: "1689",
      labelEn: "1689",
      sortKey: 1689,
    },
    note: "Valvasorjeva knjiga je ta konec dežele prvič zapisala po imenu — standard, po katerem ta muzej dela še danes.",
    evidence: [{ slug: "valvasor-1689" }, { slug: "ilirska-carina-1809" }],
  },
  {
    id: "event:objava-einzelhof-1891",
    type: "event",
    labelSi: "Objava bakroreza Ein Einzelhof in Grible",
    labelEn: "the publication of the Ein Einzelhof in Grible engraving",
    time: {
      labelSi: "1891 (Dunaj, zv. 8, str. 401)",
      labelEn: "1891 (Vienna, vol. 8, p. 401)",
      sortKey: 1891,
    },
    note: "Najstarejša znana slika vasi, natisnjena v enciklopediji avstro-ogrske monarhije po sliki Josepha Sturma.",
    evidence: [{ slug: "sturm-1891" }],
  },
  {
    id: "event:objava-novo-zivljenje-1914",
    type: "event",
    labelSi: "Objava povesti Novo življenje",
    labelEn: "the publication of the tale Novo življenje",
    time: {
      labelSi: "1914 (Celovec: Družba sv. Mohorja)",
      labelEn: "1914 (Celovec: Družba sv. Mohorja)",
      sortKey: 1914,
    },
    note: "Edina doslej znana književna dogodivščina, postavljena v Griblje: »Na malem griču je čepela vas Griblje.«",
    evidence: [{ slug: "novo-zivljenje-1914" }],
  },
  {
    id: "event:izseljenski-val-1880-1914",
    type: "event",
    labelSi: "Val izseljenstva v Združene države",
    labelEn: "the emigration wave to the United States",
    time: {
      labelSi: "1880 → 1914",
      labelEn: "1880 → 1914",
      sortKey: 1880,
    },
    note: "Gospodarski val: pot čez Trst in Antwerpen (Red Star Line) v Združene države — začetek zgodovine, iz katere so zrasli tudi Totterji.",
    evidence: [{ slug: "izseljenstvo" }],
  },
  {
    id: "event:blagoslov-solskega-poslopja-1889",
    type: "event",
    labelSi: "Blagoslov šolskega poslopja",
    labelEn: "the blessing of the school building",
    time: {
      labelSi: "november 1889",
      labelEn: "November 1889",
      sortKey: 1889,
    },
    note: "Nova vaška šola: ena učilnica in stanovanje učitelja pripravnika Petra Kambiča; 130-letnico je obeležilo srečanje Gribeljci po svetu.",
    evidence: [
      { slug: "vaska-sola" },
      { slug: "peter-kambic" },
      { slug: "gribeljci-po-svetu-2019" },
    ],
  },
  {
    id: "event:ustanovitev-sem-1921",
    type: "event",
    labelSi: "Ustanovitev Etnografskega inštituta v Ljubljani",
    labelEn: "the founding of the Ethnographic Institute in Ljubljana",
    time: {
      labelSi: "1921",
      labelEn: "1921",
      sortKey: 1921,
    },
    note: "Ustanovil ga je Niko Županič iz Gribelj — današnji Slovenski etnografski muzej; 1927 je pričel izdajati Etnolog.",
    evidence: [{ slug: "griblje-vas" }, { slug: "niko-zupanic" }],
  },
  {
    id: "event:ustanovitev-belokranjskega-muzejskega-drustva-1949",
    type: "event",
    labelSi: "Ustanovitev Belokranjskega muzejskega društva",
    labelEn: "the founding of the Bela krajina Museum Society",
    time: {
      labelSi: "1949",
      labelEn: "1949",
      sortKey: 1949,
    },
    note: "Sprožilo je ustanovitev Belokranjskega muzeja; med ustanovnimi člani Konrad Barle, Božo Račić in Jože Dular — ta digitalni muzej je vnuk njihovega dela.",
    evidence: [{ slug: "janko-barle" }, { slug: "konrad-barle" }],
  },
  {
    id: "event:ustanovitev-sd-griblje-1985",
    type: "event",
    labelSi: "Ustanovitev ŠD Griblje",
    labelEn: "the founding of the ŠD Griblje sports society",
    time: {
      labelSi: "1985",
      labelEn: "1985",
      sortKey: 1985,
    },
    note: "Tekaški korak vasi.",
    evidence: [{ slug: "sd-griblje-sport" }],
  },
  {
    id: "event:ustanovitev-dkz-griblje-1996",
    type: "event",
    labelSi: "Ustanovitev Društva kmečkih žena Griblje",
    labelEn: "the founding of the Griblje Farm Women's Society",
    time: {
      labelSi: "1996",
      labelEn: "1996",
      sortKey: 1996,
    },
    note: "V zapisih prvič zagrabljivo 1996, ko je društvo z ZIK Črnomelj izdalo knjižico o gribeljskem žbulu.",
    evidence: [{ slug: "dkz-griblje" }],
  },
  {
    id: "event:ustanovitev-td-griblje-2000",
    type: "event",
    labelSi: "Ustanovitev Turističnega društva Griblje",
    labelEn: "the founding of the Griblje Tourist Society",
    time: {
      labelSi: "2000",
      labelEn: "2000",
      sortKey: 2000,
    },
    note: "Društvo, ob katerem se vas sama spominja (Pasuljada, koledarji); muzej išče ustanovni zapis in pobudnike.",
    evidence: [{ slug: "td-griblje" }],
  },
  {
    id: "event:ustanovitev-kolesarske-sekcije-2011",
    type: "event",
    labelSi: "Ustanovitev kolesarske sekcije Torpedo",
    labelEn: "the founding of the Torpedo cycling section",
    time: {
      labelSi: "2011",
      labelEn: "2011",
      sortKey: 2011,
    },
    note: "Starodobna kolesa Gribelj zbirka vozi od 2011.",
    evidence: [{ slug: "kolesa-torpedo" }],
  },
  {
    id: "event:ustanovitev-muzejske-ucilnice-2022",
    type: "event",
    labelSi: "Otvoritev Muzejske učilnice",
    labelEn: "the opening of the museum classroom",
    time: {
      labelSi: "junij 2022",
      labelEn: "June 2022",
      sortKey: 2022,
    },
    note: "Fizična sestra digitalnega muzeja v več kot 130 let stari šoli; otvoritve se je udeležil Slovenski šolski muzej.",
    evidence: [{ slug: "muzejska-ucilnica" }],
  },
  {
    id: "event:gribeljci-po-svetu-2019",
    type: "event",
    labelSi: "Gribeljci po svetu — vrnitev ob 130-letnici šole",
    labelEn: "Griblje people around the world — the return at the school's 130th anniversary",
    time: {
      labelSi: "16. junij 2019",
      labelEn: "16 June 2019",
      sortKey: 2019,
    },
    note: "Srečanje vseh vej razpršene družine: KS in TD Griblje; šola — ustanova, ki jo je vsak Gribljec delil. Datum dogodka 16. 6. (poročilo OŠ Loka je objavljeno 19. 6.).",
    evidence: [{ slug: "gribeljci-po-svetu-2019" }],
  },
  {
    id: "event:praznik-krajevne-skupnosti-2024",
    type: "event",
    labelSi: "Praznik krajevne skupnosti Griblje",
    labelEn: "the Griblje local community festival",
    time: {
      labelSi: "15. september 2024",
      labelEn: "15 September 2024",
      sortKey: 2024,
    },
    note: "Prvi praznik KS po desetletjih; istega večera odprta spominska soba dr. Franca Brinca.",
    evidence: [{ slug: "franc-brinc" }, { slug: "praznik-ks-2024" }],
  },
  {
    id: "event:prvi-kavbojski-zur-2024",
    type: "event",
    labelSi: "Prvi kavbojski žur",
    labelEn: "the first Cowboy Party",
    time: {
      labelSi: "2024",
      labelEn: "2024",
      sortKey: 2024,
    },
    note: "»Bilo je kot na Divjem zahodu«: prvič 2024, drugič 2025 — pobudnici Katja Lavrič in Romana Husič.",
    evidence: [{ slug: "kavbojski-zur" }],
  },
  {
    id: "event:gregorjevo-2026",
    type: "event",
    labelSi: "Gregorjevo, ki se je vrnilo",
    labelEn: "the Gregorjevo that came back",
    time: {
      labelSi: "2026",
      labelEn: "2026",
      sortKey: 2026,
    },
    note: "Obujeni ljudski običaj podružnične šole in krajevne skupnosti: dan žena, mater, učiteljic.",
    evidence: [{ slug: "ko-se-pticki-zenijo" }],
  },

  // =========================================================================
  // ČASI (6) — čez-zapisni sidri; približnost ostane približnost
  // =========================================================================

  {
    id: "time:1468",
    type: "time",
    labelSi: "1468 — prva pisna omemba vasi",
    labelEn: "1468 — the first written mention of the village",
    time: {
      labelSi: "1468 (Griblach)",
      labelEn: "1468 (Griblach)",
      sortKey: 1468,
    },
    note: "Sledita Briglach (1490) in Griblah (1593); urbarji in najstarejši zemljevid pišejo Grüble. Ime je starejše od skoraj vsega, kar danes stoji v vasi.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "griblje-v-stevilkah" },
      { slug: "etimologija-gribljati" },
      { slug: "stari-zemljevidi" },
    ],
  },
  {
    id: "time:1526",
    type: "time",
    labelSi: "1526 — cerkev sv. Vida prvič v listinah",
    labelEn: "1526 — the church of St. Vitus first enters the documents",
    time: {
      labelSi: "1526",
      labelEn: "1526",
      sortKey: 1526,
    },
    note: "Omenjena tudi kot prva omemba kraja Marka (MVG-003); petstoletnica 2026 ima svoj dogodek.",
    evidence: [
      { slug: "griblje-vas" },
      { slug: "sveti-vid" },
      { slug: "petstoletnica-2026" },
      { slug: "zvon-2008" },
      { slug: "arheolosko-najdigsce-ob-kolpi" },
    ],
  },
  {
    id: "time:1669",
    type: "time",
    labelSi: "1669 — začetek podzemeljskih matičnih knjig",
    labelEn: "1669 — the beginning of the Podzemelj parish registers",
    time: {
      labelSi: "1669",
      labelEn: "1669",
      sortKey: 1669,
    },
    note: "Poročna knjiga 1669–1679 je prva stran arhiva rodbin z Gribelj (do 1947).",
    evidence: [{ slug: "matice-podzemelj" }, { slug: "porocna-1669" }],
  },
  {
    id: "time:1914-1918",
    type: "time",
    labelSi: "prva svetovna vojna",
    labelEn: "the First World War",
    time: {
      labelSi: "1914 – 1918",
      labelEn: "1914 – 1918",
      sortKey: 1914,
    },
    note: "Vas je vojni odnesla zvon; begunka Uršičeva je prinesla tamburo; Mate Zupanič-Švarski je umrl na solunski fronti 1917.",
    evidence: [
      { slug: "niko-zupanic" },
      { slug: "spanska-gripa-1918" },
      { slug: "zvon-2008" },
      { slug: "tamburasi-danica" },
      { slug: "mate-zupanic-svarski" },
    ],
  },
  {
    id: "time:1941-1945",
    type: "time",
    labelSi: "druga svetovna vojna — okupacija in svobodna Bela krajina",
    labelEn: "the Second World War — occupation and free Bela krajina",
    time: {
      labelSi: "1941 – 1945",
      labelEn: "1941 – 1945",
      sortKey: 1941,
    },
    note: "Zaseda 1941, šola v gasilskem domu, Dragoš v ujetništvu, svobodno ozemlje s šolami in bolnišnicami, zračni most 1945.",
    evidence: [
      { slug: "snos-crnomelj-1944" },
      { slug: "letalisce-otok-1944" },
      { slug: "evakuacija-1945" },
      { slug: "zaseda-1941" },
      { slug: "nikolaj-dragos" },
      { slug: "franc-brinc" },
      { slug: "madronicev-mlin" },
      { slug: "veselko-fotograf" },
      { slug: "zracni-most-krasinec" },
    ],
  },
  {
    id: "time:2026",
    type: "time",
    labelSi: "2026 — muzej danes",
    labelEn: "2026 — the museum today",
    time: {
      labelSi: "2026",
      labelEn: "2026",
      sortKey: 2026,
    },
    note: "Leto, v katerem zbirka piše sedanjost: petstoletnica, gregorjevo, devetindevetdeseta pomlad. Sidro »danes« v biografijah predmetov.",
    evidence: [
      { slug: "petstoletnica-2026" },
      { slug: "ko-se-pticki-zenijo" },
      { slug: "tone-kralj-98" },
    ],
  },
  /* --- 47. val (issue #30): lastniki iz abecednega seznama franciscejskega
   * katastra (PUA, 1825) — prebereni fol. 3–6. Identiteta: priimek + ime +
   * hišna številka iz primarnega rokopisa; priimki so skladni z zaselkom
   * Brinsko selo. Vez: MVG-001 (vir franciscejski-kataster-n83-pua).
   * Življenjskih letnic register ne nosi — SoftTime = leto vpisa. */
  {
    id: "person:brinc-matija-1825",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Brinc Matija (k.o. Griblje, 1825)",
    labelEn: "Brinc Matija (c.m. Griblje, 1825)",
    aliases: ["Brincz Matija (Kurrent: Princz/Brincz)"],
    time: { labelSi: "lastnik hiše št. 23, 1825", labelEn: "owner of house no. 23, 1825", sortKey: 1825 },
    note: "Vpisan v abecednem seznamu lastnikov zemljišč franciscejskega katastra (PUA fol. 3): Bauer, hiša št. 23, »haus Grüble«. Preliminarno branje Kurrenta; specializiran prepis čaka.",
    evidence: [{ slug: "griblje-vas" }],
  },
  {
    id: "person:brinc-mihael-1825",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Brinc Mihael (k.o. Griblje, 1825)",
    labelEn: "Brinc Mihael (c.m. Griblje, 1825)",
    aliases: ["Brincz Michael (Kurrent)"],
    time: { labelSi: "lastnik hiše št. 24, 1825", labelEn: "owner of house no. 24, 1825", sortKey: 1825 },
    note: "PUA fol. 4: Bauer, hiša št. 24. Preliminarno branje Kurrenta.",
    evidence: [{ slug: "griblje-vas" }],
  },
  {
    id: "person:brinc-janez-1825",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Brinc Janez (k.o. Griblje, 1825)",
    labelEn: "Brinc Janez (c.m. Griblje, 1825)",
    aliases: ["Brincz Johann/Jhuan (Kurrent)"],
    time: { labelSi: "lastnik hiše št. 26, 1825", labelEn: "owner of house no. 26, 1825", sortKey: 1825 },
    note: "PUA fol. 5: hiša št. 26. Branje imena »Jhuan/Johann« = Janez. Preliminarno branje Kurrenta.",
    evidence: [{ slug: "griblje-vas" }],
  },
  {
    id: "person:brinc-miha-1825",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Brinc Miha (k.o. Griblje, 1825)",
    labelEn: "Brinc Miha (c.m. Griblje, 1825)",
    aliases: ["Brincz Michl (Kurrent)"],
    time: { labelSi: "lastnik hiše št. 28, 1825", labelEn: "owner of house no. 28, 1825", sortKey: 1825 },
    note: "PUA fol. 5: Bauer, hiša št. 28. Ločen vnos od Brinc Mihael (h. 24) — različni hiši. Preliminarno branje Kurrenta.",
    evidence: [{ slug: "griblje-vas" }],
  },
  {
    id: "person:brinc-marko-1825",
    type: "person",
    role: "zgodovinska-oseba",
    labelSi: "Brinc Marko (k.o. Griblje, 1825)",
    labelEn: "Brinc Marko (c.m. Griblje, 1825)",
    aliases: ["Brincz Marko/Marika (Kurrent)"],
    time: { labelSi: "lastnik hiše št. 65, 1825", labelEn: "owner of house no. 65, 1825", sortKey: 1825 },
    note: "PUA fol. 6: Bauer, hiša št. 65 (ali 66 — zadnja cifra branja negotova). Preliminarno branje Kurrenta.",
    evidence: [{ slug: "griblje-vas" }],
  },
];

// ---------------------------------------------------------------------------
// KURATORSKA VRSTA — nerešene identitete (P0–P4); brez AI ugibanja
// ---------------------------------------------------------------------------

export type QueuePriority = "P0" | "P1" | "P2" | "P3" | "P4";

export type EntityQueueItem = {
  id: string;
  priority: QueuePriority;
  questionSi: string;
  questionEn: string;
  /** Zapisi, ki jih vprašanje zadeva. */
  slugs: string[];
};

export const ENTITY_QUEUE: EntityQueueItem[] = [
  {
    id: "P0-E1",
    priority: "P0",
    questionSi:
      "Peter Madronič — DVE osebi z istim imenom: »stari Peter« (rojen 1901 v Dalnjih Njivah, mlinar, odposlanec zbora v Kočevju 1943; MVG-045) in pravnuk (pričevalec poplav 2022/2025; MVG-008). Nobena ni entiteta; ju NIKOLI ne združuj.",
    questionEn:
      "Peter Madronič — TWO persons of the same name: 'old Peter' (b. 1901, miller, Kočevje assembly delegate 1943; MVG-045) and the great-grandson (witness of the 2022/2025 floods; MVG-008). Neither is an entity; never merge them.",
    slugs: ["kolpa-extremi", "madronicev-mlin"],
  },
  {
    id: "P1-E1",
    priority: "P1",
    questionSi:
      "Sta MVG-014 (Marec 1945: zavezniška letala nad Gribljami) in MVG-056 (Zračni most Krasinec) ISTI dogodek? Oba zapisa opisujeta evakuacijo z letališča Krasinec konec marca 1945 — povezava v entiteti event:zracni-most-krasinec-1945. Potrdi kustos.",
    questionEn:
      "Are MVG-014 and MVG-056 the SAME event? Both describe the evacuation from the Krasinec airfield in late March 1945 — bound in event:zracni-most-krasinec-1945. Curator to confirm.",
    slugs: ["evakuacija-1945", "zracni-most-krasinec"],
  },
  {
    id: "P1-E2",
    priority: "P1",
    questionSi:
      "Matija Totter = »Jandreč Matiček« — ista oseba, zapisano v samem besedilu (»po domače«). Vpisano kot alias; potrditev kustosa.",
    questionEn:
      "Matija Totter = 'Jandreč Matiček' — the same person, stated in the record itself. Entered as an alias; curator to confirm.",
    slugs: ["matija-totter"],
  },
  {
    id: "P1-E3",
    priority: "P1",
    questionSi:
      "Franc Brinc = »Franci Brinc« (Radio Odeon) — ista oseba: 90. rojstni dan 2025 v obeh virih, oba vezana na PGD. Vpisano kot alias; potrditev kustosa.",
    questionEn:
      "Franc Brinc = 'Franci Brinc' (Radio Odeon) — the same person: 90th birthday in 2025 in both sources, both tied to the fire brigade. Entered as an alias; curator to confirm.",
    slugs: ["franc-brinc"],
  },
  {
    id: "P1-E4",
    priority: "P1",
    questionSi:
      "Jože Dular (muzealec, MVG-063) ≠ Janez Dular (arheolog, avtor monografije Kučar v MVG-060) — dve osebi s podobnim imenom; ne združuj.",
    questionEn:
      "Jože Dular (museum director, MVG-063) ≠ Janez Dular (archaeologist, author of the Kučar monograph in MVG-060) — two persons of similar name; do not merge.",
    slugs: ["joze-dular", "kucar-podzemelj"],
  },
  {
    id: "P1-E5",
    priority: "P1",
    questionSi:
      "Niko Županič = »Niko Županič-Švarski« — ista oseba (hiša Švarskih; MVG-043/085/057). Vpisano kot alias; potrditev kustosa.",
    questionEn:
      "Niko Županič = 'Niko Županič-Švarski' — the same person (the Švarski house; MVG-043/085/057). Entered as an alias; curator to confirm.",
    slugs: ["niko-zupanic", "mate-zupanic-svarski"],
  },
  {
    id: "P1-E6",
    priority: "P1",
    questionSi:
      "Katarina Brinc (pogreb v španski gripi 1918, MVG-039) — sorodstvo z dr. Francem Brincem (MVG-042) ni znano; ne sklepaj, ne združuj.",
    questionEn:
      "Katarina Brinc (funeral in the 1918 Spanish flu, MVG-039) — kinship with dr. Franc Brinc (MVG-042) unknown; do not infer, do not merge.",
    slugs: ["spanska-gripa-1918", "franc-brinc"],
  },
  {
    id: "P2-E1",
    priority: "P2",
    questionSi:
      "Boris Grabrijan — avtor serije življenjepisov Ljudje ob Kolpi (Radio Odeon), ki nosi polovico zbirke; biografski podatki manjkajo. Morebitna entiteta v prihodnje.",
    questionEn:
      "Boris Grabrijan — author of the People by the Kolpa biography series (Radio Odeon) that carries half the collection; biographical data missing. A possible future entity.",
    slugs: ["ljudje-ob-kolpi"],
  },
  {
    id: "P2-E2",
    priority: "P2",
    questionSi:
      "Franc Brinc, 90. rojstni dan: 8. 4. 2025 (Radio Odeon, po Slovenskih novicah) ali 12. 4. 2025 (MVG-042)? Isti praznovanje z dvema datumoma — kateri je pravi?",
    questionEn:
      "Franc Brinc's 90th birthday: 8 April 2025 (Radio Odeon, per Slovenske novice) or 12 April 2025 (MVG-042)? One celebration, two dates — which is correct?",
    slugs: ["franc-brinc"],
  },
  {
    id: "P3-E1",
    priority: "P3",
    questionSi:
      "person:ciril-totter — rojstno leto in časi maratonov niso zapisani (zapis MVG-072 ju izrecno išče).",
    questionEn:
      "person:ciril-totter — birth year and marathon times not recorded (MVG-072 explicitly seeks them).",
    slugs: ["ciril-totter"],
  },
  {
    id: "P3-E2",
    priority: "P3",
    questionSi: "person:toni-gasperic — letnice niso v podatkih.",
    questionEn: "person:toni-gasperic — dates not in the data.",
    slugs: ["toni-gasperic"],
  },
  {
    id: "P3-E3",
    priority: "P3",
    questionSi:
      "person:tone-kralj — rojstno leto ni zapisano (starost 98 let januarja 2026); NE izračunavaj iz starosti.",
    questionEn:
      "person:tone-kralj — birth year not recorded (aged 98 in January 2026); do NOT compute from age.",
    slugs: ["tone-kralj-98"],
  },
  {
    id: "P3-E4",
    priority: "P3",
    questionSi:
      "person:anton-filak — rojstno leto ni zapisano (yearFrom 1953 = začetek svetovnih prvenstev v oranju, ne rojstvo).",
    questionEn:
      "person:anton-filak — birth year not recorded (yearFrom 1953 = the start of the world ploughing championships, not his birth).",
    slugs: ["anton-filak"],
  },
  {
    id: "P3-E5",
    priority: "P3",
    questionSi: "person:franc-brinc — rojstni datum ni zapisan (90. rojstni dan 2025).",
    questionEn: "person:franc-brinc — birth date not recorded (90th birthday in 2025).",
    slugs: ["franc-brinc"],
  },
  {
    id: "P3-E6",
    priority: "P3",
    questionSi:
      "person:fran-vesel — letnice življenja niso v podatkih; delovno obdobje ~1920 je iz navedb na fotografijah.",
    questionEn:
      "person:fran-vesel — life dates not in the data; working period ~1920 from the photograph captions.",
    slugs: ["tkalstvo", "anton-filak", "bele-breze", "pecnica-susenje-sadja"],
  },
  {
    id: "P3-E7",
    priority: "P3",
    questionSi: "person:amalija-ursic — letnice niso v podatkih.",
    questionEn: "person:amalija-ursic — dates not in the data.",
    slugs: ["vaska-sola", "tamburasi-danica"],
  },
  {
    id: "P3-E8",
    priority: "P3",
    questionSi:
      "place:madronicev-mlin — natančna lega (Prelesje ob Kolpi, dva in pol kilometra po ravnini od Gribelj); koordinat ni v zapisu.",
    questionEn:
      "place:madronicev-mlin — exact location (Prelesje on the Kolpa, two and a half kilometres from Griblje); no coordinates in the record.",
    slugs: ["madronicev-mlin"],
  },
  {
    id: "P3-E9",
    priority: "P3",
    questionSi:
      "person:alma-karlin — evakuirana marca 1945 (zapis MVG-056 in lasten vir); natančnejša vez na Griblje ni zapisana.",
    questionEn:
      "person:alma-karlin — evacuated in March 1945 (record MVG-056 and her own source); a closer tie to Griblje is not recorded.",
    slugs: ["zracni-most-krasinec"],
  },
  {
    id: "P4-E1",
    priority: "P4",
    questionSi:
      "Sodobni vaški akterji (Romana Husič, Darjo Piškurič, Branka Weiss, Marjetka Žunič, Alojzij Štrucelj, Ana Križan, župnik Peter Miroslavič, Mojca Črnič, Andrej Glavan, Katja Lavrič …) — prag pomembnosti za entiteto določi kustos.",
    questionEn:
      "Contemporary village actors (Romana Husič, Darjo Piškurič, Branka Weiss, Marjetka Žunič, Alojzij Štrucelj, Ana Križan, Fr Peter Miroslavič, Mojca Črnič, Andrej Glavan, Katja Lavrič …) — the curator sets the prominence threshold.",
    slugs: ["petstoletnica-2026", "kavbojski-zur", "vaska-sola", "gribeljski-zbul"],
  },
  {
    id: "P4-E2",
    priority: "P4",
    questionSi:
      "Fotografi Wikimedia (uporabniška imena: Eleassar, Andrejj, Uroš Novina, švabo, Savinjc …) — ostajajo v atribucijski plasti virov; niso muzejske osebe.",
    questionEn:
      "Wikimedia photographers (usernames: Eleassar, Andrejj, Uroš Novina, švabo, Savinjc …) — they stay in the attribution layer of sources; they are not museum persons.",
    slugs: [],
  },
  {
    id: "P4-E3",
    priority: "P4",
    questionSi:
      "Zgodovinski avtorji in upodobitelji virov (Ivan Vavpotič, Jurij Šubic, Johann Baptist Homann, Josef Sturm, Josip Kostanjevec, Micka Pavlič, Stanko Vurnik, Janez Krstnik Flysser, Milko Matičetov, Boris Orel, Miran Vesel, Marion Post Wolcott …) — viri že nosijo imena; entitete po kuratorski presoji.",
    questionEn:
      "Historical authors and makers of sources (Ivan Vavpotič, Jurij Šubic, Johann Baptist Homann, Josef Sturm, Josip Kostanjevec, Micka Pavlič, Stanko Vurnik, Janez Krstnik Flysser, Milko Matičetov, Boris Orel, Miran Vesel, Marion Post Wolcott …) — sources already carry their names; entities at curatorial discretion.",
    slugs: [],
  },
  {
    id: "P4-E4",
    priority: "P4",
    questionSi:
      "Organizacije kot novi kind (PGD, KS, TD, DKŽ, ŠD, OŠ Loka, Radio Odeon, Belokranjski muzej …) — njihove ustanovitve so že DOGODKI; same organizacije bi bile nova vrsta entitete.",
    questionEn:
      "Organisations as a new kind (fire brigade, local community, tourist society, farm women's society, sports society, school, Radio Odeon, the Bela krajina Museum …) — their foundings are already EVENTs; the organisations themselves would be a new entity kind.",
    slugs: [],
  },
  {
    id: "P4-E5",
    priority: "P4",
    questionSi:
      "Izseljenska geografija (Joliet, St. Paul, Balmorhee, Saragosa, Trst, Antwerpen, Buenos Aires …) — prihodnja plast zemljevida spomina.",
    questionEn:
      "Emigration geography (Joliet, St. Paul, Balmorhee, Saragosa, Trieste, Antwerp, Buenos Aires …) — a future layer of the map of memory.",
    slugs: ["matija-totter", "izseljenstvo"],
  },
  {
    id: "P4-E6",
    priority: "P4",
    questionSi:
      "Sosednje vasi iz ilustrativnih fotografij in seznamov (Adlešiči, Pobrežje, Preloka, Damelj, Vinica, Brod ob Kolpi, Osilnica, Gradac …) — prihodnji gazeteer.",
    questionEn:
      "Neighbouring villages from illustrative photographs and lists (Adlešiči, Pobrežje, Preloka, Damelj, Vinica, Brod na Kolpi, Osilnica, Gradac …) — a future gazetteer.",
    slugs: [],
  },
  {
    id: "P4-E7",
    priority: "P4",
    questionSi:
      "Naravne vrste in sorte (kranjska sivka, črni močeril, plevka Alburnus sava, gribeljski žbul, bele breze, štorklje …) — lastna plast naravne dediščine.",
    questionEn:
      "Natural species and cultivars (the Carniolan grey bee, the black olm, the Alburnus sava bleak, the Griblje onion, white birches, storks …) — their own natural-heritage layer.",
    slugs: [],
  },
  {
    id: "P4-E8",
    priority: "P4",
    questionSi:
      "Šege kot ponavljajoče prakse (jurjevanje, kresovanje, križevo, pasuljada, pust, gregorjevo …) — niso dogodki tega sloja; specifične izvedbe 2024/2026 so že EVENT.",
    questionEn:
      "Customs as recurring practices (Jurjevanje, midsummer bonfires, Križevo, the Pasuljada, carnival, Gregorjevo …) — not events of this layer; the specific 2024/2026 instances are already EVENTs.",
    slugs: [],
  },
  {
    id: "P4-E9",
    priority: "P4",
    questionSi:
      "Svetniki in šegove figure (sv. Vid, Zeleni Jurij) — NISO zgodovinske osebe; ostajajo v prozi o šegah in cerkvi.",
    questionEn:
      "Saints and folk figures (St. Vitus, Green George) — NOT historical persons; they remain in the prose on customs and the church.",
    slugs: ["sveti-vid", "jurjevo-v-gribljah"],
  },
  {
    id: "P4-E10",
    priority: "P4",
    questionSi:
      "Eno-zapisna zgodovinska obdobja (Ilirske province 1809–1813; uskoška Vojna krajina 16. stoletja; komasacija 1933) — TimeRef uvajamo samo za čez-zapisne sidre; ta obdobja nosijo njihovi zapisi.",
    questionEn:
      "Single-record historical periods (the Illyrian Provinces 1809–1813; the Uskok Military Frontier of the 16th century; the 1933 land consolidation) — TimeRefs are introduced only for cross-record anchors; these periods are carried by their records.",
    slugs: ["ilirska-carina-1809", "uskoki-in-vojna-krajina"],
  },
  {
    id: "P2-E8",
    priority: "P2",
    questionSi:
      "PUA h. 25 (1825): 51. val (issue #35) je branje »Brincz Michl Bauerin« (48. val) opustilo — vsi trije prehodi na p04/p05 berejo moškega kmeta: no. 4 = »Brincz Mathias[?]/Wendel[?]« Bauer (h. 25), no. 6 = »Brincz Michl« Bauer (h. 28). Vdovski vzorec registra ostaja resničen drugje (no. 7/8 Maria Wittib, no. 39 Lahodathar Wittib h. 46, no. 43 Ritschka Wittwe). Ostaja: identifikacija lastnika h. 25 (Mathias ali Wendel — branja se razhajajo) po matrikah Podzemelj.",
    questionEn:
      "PUA no. 25 (1825): val 51 (issue #35) abandoned the 'Brincz Michl Bauerin' reading (val 48) — all three passes at p04/p05 read a male farmer: no. 4 = 'Brincz Mathias[?]/Wendel[?]' Bauer (no. 25), no. 6 = 'Brincz Michl' Bauer (no. 28). The register's widow pattern remains real elsewhere (no. 7/8 Maria Wittib, no. 39 Lahodathar Wittib no. 46, no. 43 Ritschka Wittwe). Remaining: identification of the owner of no. 25 (Mathias or Wendel — readings differ) via the Podzemelj registers.",
    slugs: ["griblje-vas"],
  },
  {
    id: "P2-E9",
    priority: "P2",
    questionSi:
      "PUA (1825): institucionalni lastnik (Nro. 9, brez hišne št., obsežen sklop parcel Section V, p06) — baza imena »Commenda Tahern-« je potrjena 2× (48. val »Tahern unde.«, 51. val pass3 »Tahernwirth.[?]«); konec zapisa ostaja nerazčlenjen (pass1 »Fischerwies« opuščeno kot solo branje). Malteška komenda? Religionsfonds? Identiteta ustanove čaka zgodovinsko kontrolo (Malteški red v Beli krajini do 1797/1807).",
    questionEn:
      "PUA (1825): the institutional owner (entry no. 9, no house number, a large block of parcels in Section V, p06) — the name stem 'Commenda Tahern-' is confirmed twice (val 48 'Tahern unde.', val 51 pass3 'Tahernwirth.[?]'); the ending remains unresolved (pass1 'Fischerwies' abandoned as a lone reading). The Hospitaller commandery? The Religionsfonds? The identity of the institution awaits historical control (the Order of Malta in Bela krajina until 1797/1807).",
    slugs: ["griblje-vas"],
  },
  {
    id: "P3-E10",
    priority: "P3",
    questionSi:
      "PUA (1825): plemiška lastvina v k.o. Griblje — 51. val (issue #35) potrjuje: »Baron Apfalterer[?]« znotraj parcelnega seznama vpisa no. 2 na p03 (Section G/O; val 48 pripis »ob hiši 23« popravljen) ter »Kusitsch[?] Baron von Gradatz[?]« z III 748/777 pri Nro. 20 (p11; potrjeno 2× — 48. val + 51. val zoom; pass1/2 na isti številki berejo »Barbara des Grädlers Ehefrau«, morda žena barona v sosednji vrstici). Ostaja: identiteta nosilcev naslovov po referenčni literaturi (Apfaltrerji, gospostvo Gradac; je Barbara njegova žena?) in vez na isto osebo.",
    questionEn:
      "PUA (1825): noble land in c.m. Griblje — val 51 (issue #35) confirms: 'Baron Apfalterer[?]' within the parcel list of entry no. 2 on p03 (Section G/O; the val 48 attribution 'by house 23' corrected) and 'Kusitsch[?] Baron von Gradatz[?]' with III 748/777 at no. 20 (p11; confirmed twice — val 48 + val 51 zoom; passes 1/2 read 'Barbara des Grädlers Ehefrau' at the same number, possibly the baron's wife in the adjacent row). Remaining: identification of the title holders via reference literature (the Apfaltrer family, the lordship of Gradac; is Barbara his wife?) and whether they are the same person.",
    slugs: ["griblje-vas"],
  },
  {
    id: "P3-E11",
    priority: "P3",
    questionSi:
      "PUA h. 46 (1825): 51. val (issue #35) s tremi neodvisnimi branjemi rešuje vpis: »Lahodathar / Wittib Lahodatharin« (p20; Nro. 39, parcele I 162, II 1022/1104/1107/1110) — branji »K…an Jožef« (47. val) in »Ribetitsch? Jožefa? Söllner« (48. val) sta opuščeni kot nestabilni; status kežarja (Söllner) ni potrjen, namesto njega vdova (Wittib). Ostaja: identifikacija Lahodatharjeve vdove po matrikah Podzemelj in povezava s poznejšimi registri hiše 46.",
    questionEn:
      "PUA no. 46 (1825): val 51 (issue #35) resolves the entry with three independent readings: 'Lahodathar / Wittib Lahodatharin' (p20; no. 39, parcels I 162, II 1022/1104/1107/1110) — the readings 'K…an Jožef' (val 47) and 'Ribetitsch? Jožefa? Söllner' (val 48) are abandoned as unstable; the cottager (Söllner) status is not confirmed, replaced by a widow (Wittib). Remaining: identification of the Lahodathar widow via the Podzemelj registers and a link with later registers of house 46.",
    slugs: ["griblje-vas"],
  },
  {
    id: "P3-E12",
    priority: "P3",
    questionSi:
      "PUA p48/p49 (1825): 51. val (issue #35) je zaključek prebral: Nro. 96 = »Wiese[?]/Hiesige in der Gemeinde Grübln« (dolgi seznami parcel po sekcijah — skupna/nerazdeljena zemlja?), Nro. 97 = »Philipp De Giammo Zucchelli« (2×; branje »F. Kirch« opuščeno), parcela 2700, zaključna formula »Ich Amtl[ich] am 10. Jänner 1825« (MESEC PREBRAN) s tremi podpisi (Mumppen[?], Hollmayr[?], 1 nečitljiv). Ostaja: identiteta Zucchellija (italijanska oblika? Hutmayer[?]?), natančna transkripcija zaključnih seznamov in ponovni prenos okrnjenih strani p26/p42 (aritmetika nakazuje, da telo p42 vsebuje vpisa 85/86); reševalno branje (PIL+VLM, 48/49. val) na obeh pokaže naslovna bloka »Alphabetisches Verzeichniß« brez vidnih vpisov.",
    questionEn:
      "PUA p48/p49 (1825): val 51 (issue #35) read the closing: no. 96 = 'Wiese[?]/Hiesige in der Gemeinde Grübln' (long section-by-section parcel lists — common/undivided land?), no. 97 = 'Philipp De Giammo Zucchelli' (2×; the 'F. Kirch' reading abandoned), parcel 2700, the closing formula 'Ich Amtl[ich] am 10. Jänner 1825' (THE MONTH READ) with three signatures (Mumppen[?], Hollmayr[?], 1 illegible). Remaining: the identity of Zucchelli (an Italian form? Hutmayer[?]?), an exact transcription of the closing lists, and the re-download of the truncated pages p26/p42 (the arithmetic suggests the body of p42 holds entries 85/86); salvage reading (PIL+VLM, val 48/49) shows title blocks 'Alphabetisches Verzeichniß' with no visible entries on both.",
    slugs: ["griblje-vas"],
  },
  {
    id: "P2-E13",
    priority: "P2",
    questionSi:
      "Toponim »Rim« (KL 1937: dve samotni Grabrijanovi hiši, »bolj v steljnikih e blizu Fukovcev«): sistematično VLM iskanje po vseh 5 grafičnih listih A01–A05 (50. val) = NEGATIVEN zadetek pri bazični ločljivosti — negativni zadetek NI dokaz odsotnosti; korooboracija okolice: toponimi Steln-/Stelz- na 3 listih (A03 vzhod, A04 jug med Bresnikom in ADLESCHITZ, A05 vzhodni rob; vse preliminarno). Ostaja: seja-vezani IIIF rastri v polni ločljivosti (kvadranti A04-jug, A03-vzhod, A05-vzhod) + kontrola PUA indeksa (hiše brez priimka / skupna lastvina); Grabrijan v prepisu PUA 1825 ni — vez 1825→1937 nepovezana.",
    questionEn:
      "Toponym 'Rim' (KL 1937: two solitary Grabrijan houses, 'more in the hay-meadows near Fučkovci'): systematic VLM search across all 5 graphical sheets A01–A05 (val 50) = NEGATIVE result at base resolution — a negative result is NOT proof of absence; area corroboration: Steln-/Stelz- toponyms on 3 sheets (A03 east, A04 south between Bresnik and ADLESCHITZ, A05 east edge; all preliminary). Remaining: session-bound IIIF rasters at full resolution (quadrants A04-south, A03-east, A05-east) + PUA index control (houses without a surname / common property); Grabrijan is absent from the 1825 PUA transcription — the 1825→1937 link remains unconnected.",
    slugs: ["griblje-vas"],
  },
  {
    id: "P3-E13",
    priority: "P3",
    questionSi:
      "PUA (1825): številčna struktura registra (51. val, issue #35) — knjiga ima naslovne bloke na p01/p26/p42 (notranje ločnice); številčenje teče 1–50 (p03–p25), rep pa 80/81→97 (p40-recovered … p49) kontinuiteto. Nestabilno: p16 bere »70/71« (2×), a kontinuiteta knjige (29 na p15 → 32/33 na p17) zahteva 30/31 (Kurrent 3↔7); vrzeli 53–58 (blok p27–p31: p27-recovered »393/394« očitno napačno, p28 »35/36«, p29-recovered »37/38«, p30 »59/60« — aritmetična hipoteza 51–58 za 6 vpisov, NI uveljavljena); 85/86 verjetno pod rezom p42; konflikt 70/71 (p16 proti p35/36). Ostaja: kontrola strani p16 in p27–p31 v polni ločljivosti in re-download p26/p42.",
    questionEn:
      "PUA (1825): the numbering structure of the register (val 51, issue #35) — the book has title blocks at p01/p26/p42 (internal dividers); numbering runs 1–50 (p03–p25) and the tail shows 80/81→97 continuity (p40-recovered … p49). Unstable: p16 reads '70/71' (twice), yet the book's continuity (29 at p15 → 32/33 at p17) demands 30/31 (Kurrent 3↔7); gaps 53–58 (block p27–p31: p27-recovered '393/394' clearly wrong, p28 '35/36', p29-recovered '37/38', p30 '59/60' — an arithmetic hypothesis of 51–58 for 6 entries, NOT applied); 85/86 likely under the p42 cut; the 70/71 conflict (p16 vs p35/36). Remaining: control of pages p16 and p27–p31 at full resolution and the re-download of p26/p42.",
    slugs: ["griblje-vas"],
  },
];

// ---------------------------------------------------------------------------
// POIZVEDBE — običajne strukture, brez baze
// ---------------------------------------------------------------------------

/** Registr po ID (determinističen, stabilen). */
export const ENTITY_BY_ID: ReadonlyMap<string, EntityRef> = new Map(
  ENTITIES.map((e) => [e.id, e])
);

/** Vse entitete dane vrste, v vrstnem redu registra. */
export function entitiesOfKind(kind: EntityKind): EntityRef[] {
  return ENTITIES.filter((e) => e.type === kind);
}

/** Objekt → entiteta: katere entitete je dani zapis izpričal.
 *  (Dodatna smer na obstoječi kuratorski graf — ni nadomestilo za
 *  relatedExhibits()/walkStopOf().) */
export function entitiesForExhibit(slug: string): EntityRef[] {
  return ENTITIES.filter((e) =>
    e.evidence.some((ev) => ev.slug === slug)
  );
}

/** Entiteta → zapisi: evidence vez dane entitete. */
export function exhibitsForEntity(id: string): EntityEvidence[] {
  return ENTITY_BY_ID.get(id)?.evidence ?? [];
}

/** Številke registra po vrstah (hitri pregled za API-je in teste). */
export const ENTITY_COUNTS: Readonly<Record<EntityKind, number>> = {
  person: entitiesOfKind("person").length,
  place: entitiesOfKind("place").length,
  event: entitiesOfKind("event").length,
  time: entitiesOfKind("time").length,
};
