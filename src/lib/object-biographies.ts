/**
 * Življenje predmeta — časovnica poti vsakega zapisa zbirke.
 *
 * Vzorec: Carnegie Museum of Art »Art Tracks« (provenance kot živa
 * zgodovinska pripoved) in vodniki St. Louis Art Museuma / Penn
 * Museuma o objektni biografiji: vrzeli in negotovost se pokažejo,
 * ne skrijejo; vsaka točka nosi vir in stopnjo zanesljivosti.
 *
 * Faze so ročno napisane iz istih javnih virov kot zapisi sami
 * (sourceIndex se nanaša na vrstni red virov v zapisu). Kjer arhiv
 * še ne pozna odgovora, to pomeni faza TO_COLLECT — muzejska
 * iskrenost namesto izmišljotine.
 */

import type { EvidenceStatus } from "@/lib/types";

export type BiographyStage =
  | "nastanek" // nastanek / izdelava / dogodek
  | "zivljenje" // delovanje, uporaba, vsakdan
  | "prica" // pričevanje, dokumentirani trenutek
  | "raziskava" // raziskava, arhiv, registracija
  | "digitalizacija" // fotografija, digitalizacija
  | "danes"; // muzej danes

export type BiographyPhase = {
  stage: BiographyStage;
  yearLabelSi: string;
  yearLabelEn: string;
  /** Urejenostni ključ (ni prikaz); vrzeli ostanejo vrzeli. */
  sortYear?: number;
  textSi: string;
  textEn: string;
  evidenceStatus: EvidenceStatus;
  /** Indeks vira znotraj exhibit.sources (– brez vira). */
  sourceIndex?: number;
};

export type ObjectBiography = {
  slug: string;
  phases: BiographyPhase[];
};

export const OBJECT_BIOGRAPHIES: ObjectBiography[] = [
  {
    slug: "izseljenstvo",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "do 1880",
        yearLabelEn: "before 1880",
        sortYear: 1880,
        textSi:
          "Vas živi od zemlje ob Kolpi; odhodi so redki in bližnji — v mesto, v Črnomelj, na železnico.",
        textEn:
          "The village lives from the land by the Kolpa; departures are rare and near — to the town, to Črnomelj, to the railway.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "nastanek",
        yearLabelSi: "1880 → 1914",
        yearLabelEn: "1880 → 1914",
        sortYear: 1880,
        textSi:
          "Gospodarski val izseljenstva: pot v Združene države vodi prek Trsta in Antwerpna, kjer čez Atlantik pelje Red Star Line. Van Mieghemov pastel iz leta 1899 dokumentira izseljence pred njenimi pisarnami.",
        textEn:
          "The economic wave of emigration: the road to the United States runs via Trieste and Antwerp, where the Red Star Line crosses the Atlantic. Van Mieghem's pastel of 1899 documents emigrants before its offices.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "prica",
        yearLabelSi: "1917 → 1919",
        yearLabelEn: "1917 → 1919",
        sortYear: 1917,
        textSi:
          "Gribeljski Niko Županič med izseljenci v Združenih državah navdušuje za združitev Slovanov — most med vasjo in diasporo.",
        textEn:
          "Niko Županič of Griblje kindles the emigrants in the United States for the union of the South Slavs — a bridge between the village and the diaspora.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1945 → 1991",
        yearLabelEn: "1945 → 1991",
        sortYear: 1945,
        textSi:
          "Povojni valovi: Argentina, Avstralija in Kanada sprejmejo politične emigrante; šestdeseta in sedemdeseta prinesejo zimske delavce na gradbišča Nemčije, Švice in Avstrije.",
        textEn:
          "The post-war waves: Argentina, Australia and Canada take in political emigrants; the 1960s and 1970s bring winter workers to the building sites of Germany, Switzerland and Austria.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Muzej išče imena gribeljskih izseljenskih rodov: vsak dopis, fotografija ali mandat iz Amerike, Avstralije, Argentine ali Nemčije bo nov vir.",
        textEn:
          "The museum is looking for the names of Griblje's emigrant families: every letter, photograph or money order from America, Australia, Argentina or Germany will be a new source.",
        evidenceStatus: "TO_COLLECT",
      },
    ],
  },
  {
    slug: "anton-filak",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "kmečki vsakdan",
        yearLabelEn: "the farming everyday",
        sortYear: 1900,
        textSi:
          "Oranje s konjsko vprego je vrhunec kmečkega znanja v vasi: branje prsti, pravčasnost, mirna žival in roka, ki zna plugu zaupati.",
        textEn:
          "Ploughing with a horse team is the summit of the village's farming knowledge: reading the soil, timing, a calm animal and a hand that knows how to trust the plough.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1953,
        textSi:
          "Anton Filak iz Gribelj osemkrat nastopi na svetovnih prvenstvih v oranju — gribeljska brazda gre na svetovni oder.",
        textEn:
          "Anton Filak of Griblje takes part eight times in the world ploughing championships — a Griblje furrow reaches the world stage.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "začetek 20. stoletja → Commons",
        yearLabelEn: "early 20th century → Commons",
        sortYear: 1920,
        textSi:
          "Fran Vesel dokumentira oranje s konjsko vprego; fotografija danes stoji v Wikimedijini zbirki in je glavna slika zapisa.",
        textEn:
          "Fran Vesel documents ploughing with a horse team; the photograph now stands in the Wikimedia collection and is the record's main image.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Muzej odpira zapis in išče arhiv: leta Filakovih nastopov, uvrstitve in sestava reprezentance še čakajo na vire.",
        textEn:
          "The museum opens the record and searches the archive: the years of Filak's appearances, the placings and the make-up of the team still await sources.",
        evidenceStatus: "TO_COLLECT",
      },
    ],
  },

  {
    slug: "griblje-vas",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1526",
        yearLabelEn: "1526",
        sortYear: 1526,
        textSi:
          "V deželnoknežjem urbarju se ime Griblje (»Grüble«) zapiše prvič — vas obstaja vsaj od tega leta.",
        textEn:
          "In the provincial urbar the name Griblje (»Grüble«) is written down for the first time — the village exists at least since that year.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1526 → 1991",
        yearLabelEn: "1526 → 1991",
        textSi:
          "Štiri stoletja kmetovanja, vinogradništva in življenja ob meji: Dolnje in Gornje Griblje, Brinsko selo, Srednje Griblje.",
        textEn:
          "Four centuries of farming, viticulture and life on the border: Dolnje and Gornje Griblje, Brinsko selo, Srednje Griblje.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "raziskava",
        yearLabelSi: "2001",
        yearLabelEn: "2001",
        sortYear: 2001,
        textSi:
          "Jože Šimec v Dolenjskem listu razloži ime vasi iz staroslovanske besede gribljati — brazdati, orati.",
        textEn:
          "Jože Šimec explains the village name in Dolenjski list from the Old Slavic word gribljati — to furrow, to plough.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Panoramska fotografija vasi na Wikimedia Commons postane nosilna slika zapisa.",
        textEn:
          "A panoramic photograph of the village on Wikimedia Commons becomes the record's main image.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Muzej vasi Griblje hrani zapis o vasi kot prvi dokument svoje zbirke.",
        textEn:
          "The Griblje Village Museum keeps the record of the village as the first document of its collection.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "sveti-vid",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1526",
        yearLabelEn: "1526",
        sortYear: 1526,
        textSi:
          "Predhodnica cerkve se prvič zapiše v pisne vire — leto, ki ga danes nosi vaški jubilej.",
        textEn:
          "The church's predecessor enters the written record for the first time — the year the village jubilee now carries.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "18. stoletje",
        yearLabelEn: "18th century",
        sortYear: 1750,
        textSi:
          "Sedanja stavba dobi baročno podobo — silhueta, ki jo pozna vsaka generacija Gribeljčanov.",
        textEn:
          "The present building takes its Baroque shape — the silhouette every generation of Griblje has known.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "stoletja",
        yearLabelEn: "centuries",
        textSi:
          "Kot versko in krajevno središče: procesije, pokopališče, klicanje vaščanov — »od sv. Vida naprej sonce više vzhaja«.",
        textEn:
          "As religious and local heart: processions, the graveyard, calling the villagers — »from St. Vitus onward the sun rises higher«.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "1914 → 1918",
        yearLabelEn: "1914 → 1918",
        sortYear: 1914,
        textSi:
          "Glavni zvon izgine v prvi svetovni vojni — vojna si prisvoji tudi glas vasi.",
        textEn:
          "The main bell disappears into the First World War — the war takes even the village's voice.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 5,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1998",
        yearLabelEn: "1998",
        sortYear: 1998,
        textSi:
          "Zaobljuba Antona Filaka ob rojstvu sina sproži akcijo: 700-kilogramski zvon livarne Feralit, obnova fasade, strehe in stopnišča, blagoslov nadškofa Šuštarja.",
        textEn:
          "Anton Filak's vow at the birth of his son launches the action: a 700-kilogram bell from the Feralit foundry, the renewal of facade, roof and staircase, the blessing of Archbishop Šuštar.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 5,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2008",
        yearLabelEn: "2008",
        sortYear: 2008,
        textSi:
          "Vaška spominska knjiga zabeleži blagoslovitev in posvetitev zvona; isto desetletje cerkev izpriča še fotografija na Wikimedia Commons (avtor: Eleassar).",
        textEn:
          "The village memorial book records the blessing and consecration of the bell; the same decade a photograph on Wikimedia Commons (author: Eleassar) attests the church anew.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "prica",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Petsto let prve omembe: maša msgr. Glavana ob Vidovskem žegnjanju, obnova stavbe, knjižica Memento in novo parkirišče ob mrliški vežici.",
        textEn:
          "Five hundred years of the first mention: msgr. Glavan's mass at the Vidovo žegnjanje, the building's renovation, the Memento booklet and the new parking place by the funeral chapel.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 5,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Cerkev je registrirana dediščina (EŠD 2122); notranja oprema in vizitacijski zapisi še čakajo na arhiv — časovnica se bo dopolnila.",
        textEn:
          "The church is registered heritage (EŠD 2122); the interior furnishings and visitation records still await the archive — this timeline will be amended.",
        evidenceStatus: "CORROBORATED",
      },
    ],
  },
  {
    slug: "petstoletnica-2026",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1526",
        yearLabelEn: "1526",
        sortYear: 1526,
        textSi:
          "Izvor jubileja: cerkev sv. Vida se prvič zapiše v listine.",
        textEn:
          "The origin of the jubilee: the church of St. Vitus enters the documents for the first time.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "prica",
        yearLabelSi: "21. junij 2026",
        yearLabelEn: "21 June 2026",
        sortYear: 2026.5,
        textSi:
          "Vidovsko žegnjanje: maša msgr. Andreja Glavana in župnika Petra Miroslaviča, zbor Podzemelj, učenci šole, predaja novega parkirišča.",
        textEn:
          "The Vidovo žegnjanje: mass by msgr. Andrej Glavan and parish priest Peter Miroslavič, the Podzemelj choir, the schoolchildren, the handing-over of the new parking place.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Knjižica Memento: pobuda Romane Husič, zgodovinsko delo dr. Janeza Weissa, oblikovanje Mojce Črnič mlajše, čtivo Alojzija Štruclja.",
        textEn:
          "The Memento booklet: initiated by Romana Husič, historical work by dr. Janez Weiss, design by Mojca Črnič mlajša, a companion text by Alojzij Štrucelj.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "avgust 2026",
        yearLabelEn: "August 2026",
        sortYear: 2026.7,
        textSi:
          "Blagoslov obnovljene cerkve: zaključek del, ki ga je vodil gradbeni odbor pod predsedstvom Antona Filaka; isto poletje praznuje tudi Butoraj svojo cerkev sv. Marka.",
        textEn:
          "The blessing of the renovated church: the completion of works led by the construction committee under Anton Filak; the same summer Butoraj celebrates its church of St. Mark too.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "1. december 2026",
        yearLabelEn: "1 December 2026",
        sortYear: 2026.92,
        textSi:
          "Pred vrati: 150 let od rojstva Nika Županiča — drugi gribeljski jubilej istega leta; leto pozneje še stoletnica PGD Griblje.",
        textEn:
          "At the door: 150 years since the birth of Niko Županič — the second Griblje jubilee of the same year; a year later, the centenary of the Griblje fire brigade.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "pgd-griblje-1927",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1927",
        yearLabelEn: "1927",
        sortYear: 1927,
        textSi:
          "Ustanovitev prostovoljnega gasilskega društva — po samoizjavi društva; ustanovni zapis še čaka na arhiv.",
        textEn:
          "The founding of the volunteer fire brigade — by the society's own account; the founding record still awaits an archive.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1950,
        textSi:
          "Gasilski dom kot druga dvorana vasi: vaje, dražbe, veselice in humanitarni zagon ob vsaki sili.",
        textEn:
          "The fire station as the village's second hall: drills, auctions, festivities and a humanitarian surge at every emergency.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Predsednik Darjot Piškurič pomaga organizirati petstoletnico cerkve; ob izdaji knjižice Memento se zapiše ime PGD Griblje 1927.",
        textEn:
          "President Darjot Piškurič helps organise the church's 500th anniversary; with the publication of the Memento booklet the name PGD Griblje 1927 is written in.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "2027",
        yearLabelEn: "2027",
        sortYear: 2027,
        textSi:
          "Pred stoletnico: muzej išče fotografije doma, imena načelnikov in ustanovitvene zapise.",
        textEn:
          "Before the centenary: the museum is looking for photographs of the hall, the commanders' names and the founding records.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "uskoki-in-vojna-krajina",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "16. stoletje",
        yearLabelEn: "16th century",
        sortYear: 1550,
        textSi:
          "Begunci pred osmanskimi vpadi — Uskoki srbskega, hrvaškega in vlaškega porekla — se naselijo ob Kolpi.",
        textEn:
          "Refugees from the Ottoman incursions — Uskoks of Serbian, Croatian and Vlach origin — settle along the Kolpa.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1460 → 1881",
        yearLabelEn: "1460 → 1881",
        textSi:
          "Vojna krajina: obrambni pas ob avstrijsko-osmanski meji, kjer Uskoki služijo kot mejna straža.",
        textEn:
          "The Military Frontier: a defensive belt on the Austro-Ottoman border, where the Uskoks serve as border guards.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1908",
        yearLabelEn: "1908",
        sortYear: 1908,
        textSi:
          "Fotografija Bojancev in Bojank v tradicionalni noši dokumentira skupnost tri desetletja po ukinitvi krajine.",
        textEn:
          "A photograph of the people of Bojanci in traditional dress documents the community three decades after the Frontier's abolition.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2017",
        yearLabelEn: "2017",
        sortYear: 2017,
        textSi:
          "Delo poroča, da potomci Uskokov v Bojancih in Marindolu še vedno ohranjajo pravoslavno vero in običaje.",
        textEn:
          "Delo reports that the Uskok descendants in Bojanci and Marindol still keep their Orthodox faith and customs.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Iz srečanja svetov je zrasel del belokranjske identitete — od pogače do spomina na Šokčev dvor.",
        textEn:
          "From that meeting of worlds grew part of the Bela krajina identity — from the pogača to the memory of the Šokac homestead.",
        evidenceStatus: "CORROBORATED",
      },
    ],
  },
  {
    slug: "sokcev-dvor",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "uskoški časi",
        yearLabelEn: "Uskok era",
        textSi:
          "Zaprta štiristranična domačija zraste ob Kolpi kot dom in trdnjava vsakdana — gradbenih let arhiv za zdaj ne hrani.",
        textEn:
          "An enclosed four-sided farmstead grows on the Kolpa as home and fortress of everyday life — the archive keeps no construction dates for now.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "raziskava",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1950,
        textSi:
          "Domačija je razglašena za kulturni spomenik in urejen je muzej na prostem.",
        textEn:
          "The homestead is declared a cultural monument and an open-air museum is set up there.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi: "Fotografija Šokčevega dvora prispe na Wikimedia Commons.",
        textEn: "A photograph of the Šokac homestead arrives on Wikimedia Commons.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Krajinski park Kolpa dvor vodi kot izhodišče za spoznavanje vojnokrajiškega vsakdana.",
        textEn:
          "The Kolpa Landscape Park presents the homestead as a starting point for learning about the frontier's everyday life.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kolpa-reka",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "davnina",
        yearLabelEn: "time immemorial",
        textSi:
          "Reka si utre pot skoz apnenčasto pokrajino Beli krajini — naravna dediščina brez letnice rojstva.",
        textEn:
          "The river carves its way through the limestone landscape of Bela krajina — natural heritage with no birth year.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "stoletja",
        yearLabelEn: "centuries",
        textSi:
          "Meja, ribolov, mlinarica in kopališče hkrati: na Kolpi so se učili plavati in čeznjo bežali.",
        textEn:
          "Border, fishery, miller's power and bathing place at once: on the Kolpa people learned to swim and across it they fled.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "danes",
        yearLabelEn: "present day",
        textSi:
          "Državni monitoring kopalne vode (merilno mesto K05010, Dragoši–Griblje) redno preverja kakovost reke.",
        textEn:
          "The national bathing-water monitoring (measuring point K05010, Dragoši–Griblje) regularly checks the river's quality.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "poletje",
        yearLabelEn: "summer",
        textSi:
          "22–23 °C poleti: najtoplejša reka Slovenije in skupna, schengenska notranjost.",
        textEn:
          "22–23 °C in summer: Slovenia's warmest river and a shared, borderless interior.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "malenca",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "mlinarski časi",
        yearLabelEn: "millers' era",
        textSi:
          "Mlinarji s colnskim znanjem postavijo jez — malenco: les, kamen in občutek, kje ima reka padec.",
        textEn:
          "Millers with river knowledge build the weir — the malenca: wood, stone and a feel for where the river drops.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "→ 20. stoletje",
        yearLabelEn: "→ 20th century",
        textSi:
          "Zajeta voda vrti mlinska kola — od tod moka, od moke kruh.",
        textEn:
          "The captured water turns the millwheels — from it flour, from flour bread.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Fotografija slapu in malence (avtor: švabo) hrani spomin na napravo, ki jo je po imenu poznal samo ta konec dežele.",
        textEn:
          "A photograph of the waterfall and malenca (author: švabo) keeps the memory of a device only this corner of the country knew by name.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "mlini-na-kolpi",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "srednji vek",
        yearLabelEn: "Middle Ages",
        sortYear: 1300,
        textSi:
          "Urbarji prvič omenijo vodne mline ob Kolpi — moko prideluje voda, ne roka.",
        textEn:
          "The urbars first mention water mills on the Kolpa — it is water, not hand, that makes the flour.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "14. stoletje",
        yearLabelEn: "14th century",
        sortYear: 1350,
        textSi:
          "Arheološke raziskave struge Lahinje pri Flekovem mlinu dokumentirajo mlinsko delo za pozni srednji vek.",
        textEn:
          "Archaeological research in the Lahinja riverbed by Flekov mlin documents milling for the late Middle Ages.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "→ 20. stoletje",
        yearLabelEn: "→ 20th century",
        textSi:
          "Mlini v Dolu, Radencih, Pobrežju in Krasincu obratujejo, dokler jih ne dohiti elektrika.",
        textEn:
          "The mills at Dol, Radenci, Pobrežje and Krasinec keep turning until electricity catches up with them.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografije ohranjenih mlinov (avtor: švabo) dokumentirajo kamnite pregrade in kolesa.",
        textEn:
          "Photographs of the surviving mills (author: švabo) document the stone weirs and wheels.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Med zadnjimi pričami mlinarskega vsakdana — kamnita pregrada mlina v Bregu je še vidna.",
        textEn:
          "Among the last witnesses of the millers' working day — the stone weir of the mill at Breg is still visible.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "niko-zupanic",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1. december 1876",
        yearLabelEn: "1 December 1876",
        sortYear: 1876,
        textSi:
          "V Gribljah se rodi Niko Županič, sin učitelja — prihodnji etnolog, antropolog in politik.",
        textEn:
          "In Griblje a teacher's son is born: Niko Županič — future ethnologist, anthropologist and politician.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1876 → 1961",
        yearLabelEn: "1876 → 1961",
        textSi:
          "Raziskuje človeka od Kitajske do Balkana, soustanovi Slovenski etnografski muzej, se vrne v slovensko politiko.",
        textEn:
          "He studies humankind from China to the Balkans, co-founds the Slovene Ethnographic Museum, returns to Slovene politics.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1924",
        yearLabelEn: "1924",
        sortYear: 1924,
        textSi:
          "Ivan Vavpotič naslika oljni portret Županiča — slika, ki jo danes hrani javna zbirka na Wikimedii.",
        textEn:
          "Ivan Vavpotič paints the oil portrait of Županič — the painting now held in a public collection on Wikimedia.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2016",
        yearLabelEn: "2016",
        sortYear: 2016,
        textSi:
          "Slovenski etnografski muzej ob 140. obletnici rojstva priredi razstavo »Niko Županič — kozmopolit iz Gribelj«.",
        textEn:
          "On his 140th birthday the Slovene Ethnographic Museum stages the exhibition »Niko Županič — a cosmopolitan from Griblje«.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "2018",
        yearLabelEn: "2018",
        sortYear: 2018,
        textSi:
          "V Gribljah odkrijejo spominsko ploščo univerzitetnemu profesorju dr. Niku Županiču.",
        textEn:
          "A memorial plaque to Professor Dr. Niko Županič is unveiled in Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Zbirka hrani njegov portret, rojstno vas in usodo: kozmopolit z vaškim naglasom.",
        textEn:
          "The collection keeps his portrait, his birth village and his fate: a cosmopolitan with a village accent.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "snos-crnomelj-1944",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "19.–20. februar 1944",
        yearLabelEn: "19–20 February 1944",
        sortYear: 1944,
        textSi:
          "V sokolskem domu v Črnomlju zaseda Slovenski narodnoosvobodilni svet — kasneje štet za prvi slovenski parlament.",
        textEn:
          "In the Sokol Hall in Črnomelj the Slovene National Liberation Council convenes — later counted as the first Slovene parliament.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1944",
        yearLabelEn: "1944",
        sortYear: 1944,
        textSi:
          "Zbor na ozemlju partizanske oblasti sprejme odločitev, da se slovenski narod odloča sam o sebi.",
        textEn:
          "The assembly on partisan-held ground resolves that the Slovene nation decides for itself.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2024",
        yearLabelEn: "2024",
        sortYear: 2024,
        textSi:
          "Ob 80. obletnici RTV Slovenija in zgodovinski portali ponovno sestavijo podobo tedanjega Črnomlja.",
        textEn:
          "On the 80th anniversary RTV Slovenia and history portals piece together the picture of Črnomelj at the time.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          " Februar 1944 velja za enega od temeljev slovenske državnosti — devet kilometrov od Gribelj.",
        textEn:
          "February 1944 counts among the foundations of Slovene statehood — nine kilometres from Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
    ],
  },
  {
    slug: "letalisce-otok-1944",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "pomlad 1944",
        yearLabelEn: "spring 1944",
        sortYear: 1944,
        textSi:
          "Partizani pri vasi Otok uredijo letališče — na travniku, z rokami, pod nebesi, ki jih še držijo nemška letala.",
        textEn:
          "By the village of Otok the partisans lay out an airfield — on meadowland, by hand, under skies still commanded by German aircraft.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1944 → 1945",
        yearLabelEn: "1944 → 1945",
        textSi:
          "Z njega zavezniki prepeljejo 1473 ranjencev in bolnikov v južno Italijo — brez izgube enega samega letala.",
        textEn:
          "From it the Allies ferry 1,473 wounded and sick to southern Italy — without losing a single aircraft.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografija zavezniškega letala med vkrcavanjem ranjencev dokumentira operacijo.",
        textEn:
          "A photograph of an Allied aircraft boarding the wounded documents the operation.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Travniki okrog Otoka so spet travniki; spomin hrata spomenik Douglas C-47 Dakota.",
        textEn:
          "The meadows around Otok are meadows again; the memory is kept by the Douglas C-47 Dakota monument.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "evakuacija-1945",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "marec 1945",
        yearLabelEn: "March 1945",
        sortYear: 1945,
        textSi:
          "Dnevno se nad Belo krajino prikažejo zavezniška letala in odnašajo ranjene partizane v Bari.",
        textEn:
          "Day after day Allied aircraft appear over Bela krajina and carry the wounded partisans away to Bari.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "prica",
        yearLabelSi: "marec 1945",
        yearLabelEn: "March 1945",
        sortYear: 1945,
        textSi:
          "Franjo Veselko posname dve fotografiji pri Gribljah — ranjeni opazujejo pristajanje, pilot se pogovarja s partizani.",
        textEn:
          "Franjo Veselko takes two photographs by Griblje — the wounded watch a landing, a pilot talks with the partisans.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2025",
        yearLabelEn: "2025",
        sortYear: 2025,
        textSi:
          "RTV Slovenija ob 80-letnici konca vojne izda oddajo o nenavadni zgodbi evakuiranih iz Bele krajine.",
        textEn:
          "On the 80th anniversary of the war's end RTV Slovenia broadcasts the story of the unusual evacuation from Bela krajina.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Mesec dni je bilo nebo nad vasjo bolnišnični hodnik; ta zapis hrani njegove priče.",
        textEn:
          "For a month the sky above the village was a hospital corridor; this record keeps its witnesses.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "meja-1991",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "junij 1991",
        yearLabelEn: "June 1991",
        sortYear: 1991,
        textSi:
          "Kolpa postane zunanja meja samostojne Slovenije — vaščani sami, z rokami, postavijo mejne kamne.",
        textEn:
          "The Kolpa becomes the outer border of independent Slovenia — the villagers themselves, by hand, set the boundary stones.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1991 → danes",
        yearLabelEn: "1991 → present",
        textSi:
          "Leta begunec krize prinesejo žico; reka je spet oster rob Evrope, preden se vrne v notranjost.",
        textEn:
          "The refugee-crisis years bring the wire; the river is again Europe's sharp edge before returning to its interior.",
        evidenceStatus: "CORROBORATED",
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Schengenska notranjost: brez ovir, s skupnimi poletji na obeh bregovih — fotografija mejane ograje pri Gribljah je zadnji list te mape.",
        textEn:
          "A Schengen interior: no obstacles, with shared summers on both banks — the photograph of the border fence at Griblje is this map's last leaf.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "ribnik",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "nekdaj",
        yearLabelEn: "long ago",
        textSi:
          "Vaščani izkopljejo ribnik za vasjo — kdaj natančno, listina ne pove; voda pa ostaja.",
        textEn:
          "The villagers dig the pond behind the village — exactly when, no document tells; but the water stays.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "stoletja",
        yearLabelEn: "centuries",
        textSi:
          "Napajališče živine, ogledal neba, prva plavalna šola vaških otrok — preden so drznili na Kolpo.",
        textEn:
          "Cattle watering, sky mirror, the village children's first swimming school — before they dared the Kolpa.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografija ribnika za Gribljami (avtor: Uroš Novina) prispe v javno zbirko Wikimedi Commons.",
        textEn:
          "A photograph of the pond behind Griblje (author: Uroš Novina) arrives in the Wikimedia Commons public collection.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Miren vodni ekosistem ob travnikih — ribe, žabe, plovnice: sezonski gledališki oder vasi.",
        textEn:
          "A calm water ecosystem by the meadows — fish, frogs, water-striders: the village's seasonal theatre stage.",
        evidenceStatus: "CORROBORATED",
      },
    ],
  },
  {
    slug: "belokranjska-hisa",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "19. stoletje",
        yearLabelEn: "19th century",
        sortYear: 1800,
        textSi:
          "Hiša zraste iz apnene beline, slame in kamna — zidovi iz tistega, kar je bilo pri roki.",
        textEn:
          "The house grows out of limewash, thatch and stone — walls made of whatever was at hand.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "19. → 20. stoletje",
        yearLabelEn: "19th → 20th century",
        textSi:
          "V črni kuhinji se kuha, kadí in suši; malo oken, kamnita tlaka, vsakdan cele domačije v enem prostoru.",
        textEn:
          "In the black kitchen they cook, smoke and dry; few windows, stone floors, a whole farmstead's everyday life in one room.",
        evidenceStatus: "TRADITION",
        sourceIndex: 1,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografija ohranjene stare hiše v Črnomlju (avtor: Eleassar) dokumentira tip.",
        textEn:
          "A photograph of a preserved old house in Črnomelj (author: Eleassar) documents the type.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Slovenska etnografska literatura hrani tipologijo kmečke hiše Bele krajine — spomenik pametne skromnosti.",
        textEn:
          "Slovene ethnographic literature keeps the typology of the Bela krajina farmhouse — a monument to intelligent modesty.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "vino-in-crnina",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1800-ta",
        yearLabelEn: "1800s",
        sortYear: 1800,
        textSi:
          "Vinogradi se razprejo po apnenčastih legah — vsaka hiša svoj vinograd, vsak vinograd svoj kozolec.",
        textEn:
          "Vineyards spread over the limestone slopes — every household its vineyard, every vineyard its drying rack.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "19. → 20. stoletje",
        yearLabelEn: "19th → 20th century",
        textSi:
          "Vino je hrana in denar hkrati: prodaja se po deželi, kamor je šel voz.",
        textEn:
          "Wine is food and money at once: it sells across the region, wherever a cart would go.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "raziskava",
        yearLabelSi: "1968",
        yearLabelEn: "1968",
        sortYear: 1968,
        textSi:
          "Vinska klet Metlika prvič ustekleniči metliško črnino — mešanico nerazvrščenih starih sort.",
        textEn:
          "The Metlika wine cellar bottles metliška črnina for the first time — a blend of unclassified old varieties.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "register PTP",
        yearLabelEn: "PTP register",
        textSi:
          "Ministrstvo za kmetijstvo vpiše metliško črnino med zajamčene tradicionalne oznake.",
        textEn:
          "The Ministry of Agriculture enters metliška črnina among the protected traditional designations.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Iz istih vinogradov pride cviček, po katerem Bela krajinci pojejo — in črnina, ki se pije počasi.",
        textEn:
          "From the same vineyards comes the cviček that Bela krajina sings about — and the črnina best drunk slowly.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "jurjevanje",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "spomladanski kult",
        yearLabelEn: "spring cult",
        textSi:
          "Zeleno mladino nosijo po vaseh na svetega Jurija — prosijo za srečo in gnoj po poljih.",
        textEn:
          "Green boughs are carried through the villages on Saint George's day — asking for luck and good fields.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "1908",
        yearLabelEn: "1908",
        sortYear: 1908,
        textSi:
          "Jubilejni sprevod v Ljubljani fotografira zelenega Jurija in belokranjsko svatbo — običaj je takrat že znamenje dežele.",
        textEn:
          "The jubilee procession in Ljubljana is photographed with the green George and the Bela krajina wedding — the custom is already an emblem of the land.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "po 1945",
        yearLabelEn: "after 1945",
        sortYear: 1945,
        textSi:
          "Oblasti običaj zatirajo; ljudje ga nosijo naprej — s preoblečenimi imeni, če je bilo treba.",
        textEn:
          "The authorities suppress the custom; people carry it on anyway — under disguised names if needed.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Jurjevanje v Beli krajini (Prelože) velja za najstarejše prirejeno jurjevanje v Evropi.",
        textEn:
          "The Jurjevanje festival in Bela krajina (Prelože) counts as the oldest staged jurjevanje in Europe.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "belokranjska-kuhinja",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "kmečko gospodarstvo",
        yearLabelEn: "farm economy",
        textSi:
          "Jedi zrastejo iz tistega, kar je dalo gospodarstvo: fižol, svinja, kruh — nič odveč.",
        textEn:
          "The dishes grow out of what the farm gave: beans, the pig, bread — nothing wasted.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "generacije",
        yearLabelEn: "generations",
        textSi:
          "Pogača, matevž, salenjaki, žganci, krvavica — iz roda v rod, brez kuharske knjige.",
        textEn:
          "Pogača, matevž, salenjaki, žganci, blood sausage — from generation to generation, without a cookbook.",
        evidenceStatus: "TRADITION",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2011",
        yearLabelEn: "2011",
        sortYear: 2011,
        textSi:
          "Belokranjska pogača je vpisana med zajamčene tradicionalne posebnosti v Evropski uniji.",
        textEn:
          "The Bela krajina pogača is registered as a protected traditional speciality in the European Union.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Gostilne jedi ponudijo kot specialiteto — meni, ki ga je sestavila stvarnost.",
        textEn:
          "The inns serve the dishes as a speciality — a menu composed by reality itself.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "tkalstvo",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "pomlad",
        yearLabelEn: "spring",
        textSi:
          "Lan in konoplja se sejeta; poleti se namakata v Kolpi ali na roso — rastlini, ki bosta oblekli vas.",
        textEn:
          "Flax and hemp are sown; in summer they are retted in the Kolpa or on the dew — the two plants that will dress the village.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "jesen in zima",
        yearLabelEn: "autumn and winter",
        textSi:
          "Jeseni lomijo, paklajo in česajo; zimi se ob vsaki hiši predeno — v zimskih večerih.",
        textEn:
          "In autumn they break, scutch and comb; through the winter evenings every house spins.",
        evidenceStatus: "TRADITION",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1920",
        yearLabelEn: "1920",
        sortYear: 1920,
        textSi:
          "Fran Vesel fotografira predenje v Beli krajini — list etnografske evidence v javni zbirki.",
        textEn:
          "Fran Vesel photographs spinning in Bela krajina — a leaf of ethnographic evidence in a public collection.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "po 1950",
        yearLabelEn: "after 1950",
        sortYear: 1950,
        textSi:
          "Statve utihnejo pred šiviljsko industrijo; platno ostane v omarah, statve v muzejih.",
        textEn:
          "The looms fall silent before the garment industry; the linen stays in wardrobes, the looms in museums.",
        evidenceStatus: "TRADITION",
      },
    ],
  },
  {
    slug: "storklje",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "pomlad → jesen",
        yearLabelEn: "spring → autumn",
        textSi:
          "Bele štorklje gnezdijo na dimnikih in drogovih Bojancev, Marindola in Miličev — sreča na strehi.",
        textEn:
          "White storks nest on the chimneys and poles of Bojanci, Marindol and Miliči — luck on the roof.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "vsako pomlad",
        yearLabelEn: "every spring",
        textSi:
          "Vračajo se iz Afrike — in če se vrnejo, se vrnejo k istemu gnezdu.",
        textEn:
          "They return from Africa — and if they return, they return to the same nest.",
        evidenceStatus: "CORROBORATED",
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografija bele štorklje v Sloveniji prispe v javno zbirko Wikimedi Commons.",
        textEn:
          "A photograph of the white stork in Slovenia arrives in the Wikimedia Commons public collection.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Ptice se šteje s sateliti in obročki; gnezda so postala vaški grbi.",
        textEn:
          "The birds are counted with satellites and rings; the nests have become village emblems.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "bele-breze",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "praprostor",
        yearLabelEn: "primeval",
        textSi:
          "Belina na skorji se sveti tudi v mraku — bela breza da ime Bele krajini.",
        textEn:
          "The whiteness of the bark shines even at dusk — the white birch gives Bela krajina its name.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "zivljenje",
        yearLabelSi: "vedno",
        yearLabelEn: "always",
        textSi:
          "Brezove goščave ostanejo svetle; po njej se imenujeta beli dan v ljudskem koledarju in regratov vinograd.",
        textEn:
          "Birch groves stay light; it also names the white day in the folk calendar and the dandelion vineyard.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "1920-ta",
        yearLabelEn: "1920s",
        sortYear: 1920,
        textSi:
          "Fran Vesel fotografira hišo med brezami — posnetek, ki ga danes hrani Slovenski etnografski muzej.",
        textEn:
          "Fran Vesel photographs a house among the birches — a print now kept by the Slovene Ethnographic Museum.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Krajinski park Kolpa bele breze vodi kot simbol pokrajine; ob cestah in potokih Gribelj.",
        textEn:
          "The Kolpa Landscape Park presents the white birch as the symbol of the region; by the roads and streams of Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "vaska-sola",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "do 1869",
        yearLabelEn: "before 1869",
        sortYear: 1869,
        textSi:
          "Vas živi iz ustnega izročila: brati znata tu in tam župnik ali učitelj; otroci se črk in števk naučijo ob opravilih.",
        textEn:
          "The village lives from oral tradition: reading is known here and there to a priest or a teacher; children learn letters and figures alongside their chores.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "nastanek",
        yearLabelSi: "1869",
        yearLabelEn: "1869",
        sortYear: 1869,
        textSi:
          "Reichsvolksschulgesetz naredi šolanje za dolžnost od šestega do štirinajstega leta; po deželah cesarstva zrasle vaške šole z enim učiteljem in vsemi razredi v eni učilnici.",
        textEn:
          "The Reichsvolksschulgesetz makes schooling compulsory from six to fourteen; village schools with a single teacher and all grades in one classroom grow up across the Empire's lands.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1870 → 1914",
        yearLabelEn: "1870 → 1914",
        sortYear: 1870,
        textSi:
          "Vsakdan vaške šole: tablica, kreda, abecednik; klopi prazne ob žetvi in senaši. Žanrska slika Vaška šola (19. st.) iz zbirke Narodnega muzeja Slovenije prikazuje učilnico tistega časa.",
        textEn:
          "The village school's everyday: slate, chalk, primer; benches empty at harvest and haying. The genre painting Village School (19th c.) from the National Museum of Slovenia's collection shows a classroom of that time.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "prica",
        yearLabelSi: "1943 → 1945",
        yearLabelEn: "1943 → 1945",
        sortYear: 1943,
        textSi:
          "Po italijanski kapitulaciji v svobodni Beli krajini delujejo šole, tiskarne in bolnišnice; v Črnomlju tudi partizanska gimnazija — stavba na fotografiji zapisa.",
        textEn:
          "After the Italian capitulation, schools, print shops and hospitals operate in free Bela krajina; in Črnomelj also a Partisan gymnasium — the building in this record's photograph.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "po 1945 → danes",
        yearLabelEn: "after 1945 → today",
        sortYear: 1945,
        textSi:
          "Otroci ob Kolpi hodijo v krajske šole; kdaj je utihnila vaška šola v Gribljah sama — razredne fotografije, imena učiteljev in učne knjige še čakajo, da jih kdo prinese v muzej.",
        textEn:
          "The children by the Kolpa attend the district schools; when the village school of Griblje itself fell silent — class photographs, teachers' names and schoolbooks still wait for someone to bring them to the museum.",
        evidenceStatus: "TO_COLLECT",
      },
    ],
  },
  {
    slug: "zaseda-1941",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "6. 9. 1941",
        yearLabelEn: "6 September 1941",
        sortYear: 1941,
        textSi:
          "Na cesti Črnomelj–Griblje štirje borci belokranjske partizanske skupine z Židovca iz zasede napadejo patruljo italijanske mejne policije na poti za postojanko v Gribljah.",
        textEn:
          "On the Črnomelj–Griblje road four fighters of the Bela krajina Partisan group from Židovec ambush a patrol of the Italian border police on its way to the post at Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1941–1943",
        yearLabelEn: "1941–1943",
        sortYear: 1942,
        textSi:
          "V vasi deluje italijanska postojanka mejne policije; Bela krajina je del priključene Ljubljanske pokrajine. Imena štirih borcev in podrobnosti dneva čakajo na arhiv in spomin domačinov.",
        textEn:
          "An Italian border-police post operates in the village; Bela krajina belongs to the annexed Province of Ljubljana. The names of the four fighters and the day's details await the archive and the villagers' memory.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "24. 7. 1960",
        yearLabelEn: "24 July 1960",
        sortYear: 1960,
        textSi:
          "Na kraju spopada postavijo spominski kamen po načrtu kiparja Jakoba Savinška.",
        textEn:
          "A memorial stone, designed by the sculptor Jakob Savinšek, is raised on the site of the fighting.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes (EŠD 19324)",
        yearLabelEn: "today (EŠD 19324)",
        sortYear: 2026,
        textSi:
          "Zavod za varstvo kulturne dediščine Slovenije vodi obeležje v registru nepremične kulturne dediščine; muzej išče imena borcev in pričevanja o postojanki.",
        textEn:
          "The Institute for the Protection of Cultural Heritage keeps the monument in the register of immovable heritage; the museum seeks the fighters' names and testimonies about the post.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "spomenik-padlim",
    phases: [
      {
        stage: "prica",
        yearLabelSi: "1941–1945",
        yearLabelEn: "1941–1945",
        sortYear: 1945,
        textSi:
          "Vojna iz vasi vzame trinajst ljudi: enajst padlih borcev in dve žrtvi fašističnega nasilja.",
        textEn:
          "The war takes thirteen people from the village: eleven fallen fighters and two victims of Fascist violence.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "nastanek",
        yearLabelSi: "10. 9. 1961",
        yearLabelEn: "10 September 1961",
        sortYear: 1961,
        textSi:
          "Krajevni odbor Zveze borcev Griblje odkrije spomenik pred podružnično šolo OŠ Loka v Gribljah.",
        textEn:
          "The Griblje local board of the Veterans' Association unveils the memorial before the branch school of OŠ Loka at Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "EŠD 19326",
        yearLabelEn: "EŠD 19326",
        sortYear: 2018,
        textSi:
          "Popis Knjižnice Črnomelj in register ZVKDS zabeležita spomenik kot nepremično kulturno dediščino.",
        textEn:
          "The Črnomelj Library survey and the ZVKDS register record the memorial as immovable cultural heritage.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Muzej čaka domačinsko fotografijo kamna in prepis trinajstih imen — najtežji seznam, ki ga bo kdaj objavil.",
        textEn:
          "The museum awaits a home photograph of the stone and the transcription of the thirteen names — the heaviest list it will ever publish.",
        evidenceStatus: "TO_COLLECT",
      },
    ],
  },
  {
    slug: "griblje-v-stevilkah",
    phases: [
      {
        stage: "prica",
        yearLabelSi: "1468",
        yearLabelEn: "1468",
        sortYear: 1468,
        textSi:
          "Prva pisna omemba: listina zapiše vas kot Griblach.",
        textEn:
          "The first written mention: a deed writes the village as Griblach.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "prica",
        yearLabelSi: "1490 / 1593",
        yearLabelEn: "1490 / 1593",
        sortYear: 1490,
        textSi:
          "Kasnejše oblike Briglach in Griblah; v urbarjih in na najstarejšem zemljevidu Grüble.",
        textEn:
          "The later forms Briglach and Griblah; Grüble in the urbars and on the oldest map.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2009",
        yearLabelEn: "2009",
        sortYear: 2009,
        textSi:
          "Snojev etimološki slovar zapiše izvor imena kot odprto vprašanje s štirimi možnostmi (grib, griba, griblja, griva).",
        textEn:
          "Snoj's etymological dictionary records the origin of the name as an open question with four possibilities (grib, griba, griblja, griva).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "prica",
        yearLabelSi: "2020",
        yearLabelEn: "2020",
        sortYear: 2020,
        textSi:
          "Popis: 334 prebivalcev — 172 moških in 162 žensk.",
        textEn:
          "Census: 334 inhabitants — 172 men and 162 women.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Letna statistika: 329 prebivalcev; vas meri 3,45 km² na 153,4 m nad morjem. Zapis se bo osvežil z vsakim novim popisom.",
        textEn:
          "Annual statistics: 329 inhabitants; the village measures 3.45 km² at 153.4 m above the sea. The record will be refreshed with every new census.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "crni-moceril",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "do 1986",
        yearLabelEn: "before 1986",
        sortYear: 1986,
        textSi:
          "V kraškem podzemlju okolice Črnomlja že živi temna žival — znanost je še ne pozna, izviri pa občasno presenetijo z »ribico, ki ni bela«.",
        textEn:
          "In the karst underground around Črnomelj a dark animal already lives — science does not yet know it, and the springs now and then surprise with \"a fish that is not white\".",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "nastanek",
        yearLabelSi: "18. oktober 1986",
        yearLabelEn: "18 October 1986",
        sortYear: 1986.8,
        textSi:
          "Odkritje: raziskovalci Inštituta za raziskovanje krasa ob črpalnem preizkusu izvira Dobličice izvlečejo do takrat neznano temno človeško ribico.",
        textEn:
          "The discovery: researchers of the Karst Research Institute, at a pumping test on the Dobličica spring, draw out a dark olm unknown until then.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1986 → 1990",
        yearLabelEn: "1986 → 1990",
        sortYear: 1990,
        textSi:
          "Zoolog Boris Sket znanstveno opiše podvrsto Proteus anguinus parkelj: črnosiva koža, krajša in širša glava, normalno razvite oči.",
        textEn:
          "The zoologist Boris Sket scientifically describes the subspecies Proteus anguinus parkelj: black-grey skin, a shorter and broader head, normally developed eyes.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Izvir Jelševniščice v Jelševniku je edino najdišče na svetu z možnostjo opazovanja v naravi; podvrsta spada med najbolj ogrožene pri nas — njena usoda je čistost kraških vod.",
        textEn:
          "The Jelševniščica spring at Jelševnik is the only site in the world where it can be watched in nature; the subspecies ranks among our most endangered — its fate is the purity of the karst waters.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
];

export function getBiography(slug: string): ObjectBiography | undefined {
  return OBJECT_BIOGRAPHIES.find((bio) => bio.slug === slug);
}

/** Ali ima zapis pripravljeno časovnico življenja? */
export function hasBiography(slug: string): boolean {
  return OBJECT_BIOGRAPHIES.some((bio) => bio.slug === slug);
}
