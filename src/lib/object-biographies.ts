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
        sourceIndex: 3,
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
        sourceIndex: 3,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1843",
        yearLabelEn: "1843",
        sortYear: 1843,
        textSi:
          "Henrik Freyer: Special-Karta vojvodine Kranjske — ime vasi prvič na kakovostni karti dežele, in to z obema imenoma: kurzivno, slovensko Griblje, pod njim v oklepaju nemško (Grüble), nad njim pa Vnt. — Unter, Dolnje Griblje.",
        textEn:
          "Henrik Freyer: the Special-Karte of the Duchy of Carniola — the village's name on a quality map of the land for the first time, and with both its names: the italic Slovene Griblje, the German (Grüble) in parentheses beneath, and Vnt. — Unter, Lower Griblje — above.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 6,
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
        sourceIndex: 4,
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
        sourceIndex: 1,
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
        sourceIndex: 2,
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
  {
    slug: "audrey-totter",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "konec 1890-ih",
        yearLabelEn: "late 1890s",
        sortYear: 1895,
        textSi:
          "Izselitev: trije bratje Jandreč (Tottrovi) zapustijo Gornje Griblje — dva odideta v Teksas, Janez se ustali v Jolietu v Illinoisu, mestu močne slovenske skupnosti.",
        textEn:
          "The emigration: three Jandreč (Totter) brothers leave Gornje Griblje — two continue to Texas, Janez settles in Joliet, Illinois, a city of a strong Slovene community.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "nastanek",
        yearLabelSi: "20. december 1917",
        yearLabelEn: "20 December 1917",
        sortYear: 1917,
        textSi:
          "V Jolietu se Janezu in Idi Mae rodi hčerka Audrey Mary Totter — dekle z gribeljsko kri po očetovi strani.",
        textEn:
          "In Joliet a daughter, Audrey Mary Totter, is born to Janez and Ida Mae — a girl with Griblje blood on her father's side.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1940-ta",
        yearLabelEn: "1940s",
        sortYear: 1944,
        textSi:
          "Radijske igre v Chicagu in New Yorku, nato pogodba s studiem Metro-Goldwyn-Mayer — sedem let, ki določijo njen zaščitni znak: dekleta filma noir.",
        textEn:
          "Radio dramas in Chicago and New York, then a contract with Metro-Goldwyn-Mayer — seven years that define her trademark: the girls of film noir.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1946–1947",
        yearLabelEn: "1946–1947",
        sortYear: 1947,
        textSi:
          "Vrh kariere: The Postman Always Rings Twice ob Lani Turner, uspešnica z Clarkom Gableom (po njegovi prošnji) in zrcalni prizor Lady in the Lake — njen najbolj znan filmski noir.",
        textEn:
          "The peak: The Postman Always Rings Twice beside Lana Turner, a hit with Clark Gable (at his request) and the mirror scene of Lady in the Lake — her best-known film noir.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1950-ta → 1987",
        yearLabelEn: "1950s → 1987",
        sortYear: 1960,
        textSi:
          "Columbia, 20th Century Fox, Warner Bros; epizoda Alfred Hitchcock Presents; zadnja vloga v seriji Murder, She Wrote (1987), nato upokojitev.",
        textEn:
          "Columbia, 20th Century Fox, Warner Bros; an episode of Alfred Hitchcock Presents; the last role in Murder, She Wrote (1987), then retirement.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "12. december 2013 → danes",
        yearLabelEn: "12 December 2013 → today",
        sortYear: 2013,
        textSi:
          "Umre v Woodland Hillsu v Kaliforniji. Zapuščina živi: stric Matiček je v vasi popisoval izročilo, bratranec dr. John R. Totter je sodeloval z IJS, pravnukinja Lorene je rodovnik raziskala do genotipizacije — v Gribljah danes gospodari Ciril Totter.",
        textEn:
          "She dies in Woodland Hills, California. The legacy lives: uncle Matiček recorded heritage in the village, cousin Dr. John R. Totter worked with the Jožef Stefan Institute, great-granddaughter Lorene traced the line as far as genotyping — in Griblje, Ciril Totter farms today.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "nikolaj-dragos",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "27. avgust 1907",
        yearLabelEn: "27 August 1907",
        sortYear: 1907,
        textSi:
          "Rojstvo na domačiji Hajdeč grunt (ime po ajdi), deveti od dvanajstih otrok; botrujeta Matija Štrucelj in Ana Požek, oče Ivan je župan in cerkveni ključar.",
        textEn:
          "Born at the Hajdeč farm (named after buckwheat), ninth of twelve children; godparents Matija Štrucelj and Ana Požek, father Ivan the village mayor and keeper of the church keys.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1920-ta → 1941",
        yearLabelEn: "1920s → 1941",
        sortYear: 1928,
        textSi:
          "V uk pri ključavničarju, pobeg v Ljubljano (bugarija pri tamburaših Danice), gorski topničar v Mostarju, profesionalni graničar na srbsko-bolgarski meji — prvi, ki se nauči smučati (smuči iz Logatca).",
        textEn:
          "Apprenticed to a locksmith, escape to Ljubljana (bugarija with the Danica tamburitza band), mountain gunner at Mostar, professional border guard on the Serbo-Bulgarian frontier — the first of them to learn to ski (skis from Logatec).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1941–1945",
        yearLabelEn: "1941–1945",
        sortYear: 1943,
        textSi:
          "Vojni ujetnik: kmetijska dela v Sudetih in Zgornji Avstriji; po vojni služba v Ljudski milici.",
        textEn:
          "A prisoner of war: farm labour in the Sudetenland and Upper Austria; after the war, service in the People's Militia.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "2007",
        yearLabelEn: "2007",
        sortYear: 2007,
        textSi:
          "Ob stotem rojstnem dnevu napiše knjigo spominov Mojih sto let; ob 108. in 110. rojstnem dnevu ga obišče predsednik republike Borut Pahor.",
        textEn:
          "For his hundredth birthday he writes his book of memories, My Hundred Years; on his 108th and 110th birthdays the President of the Republic, Borut Pahor, visits him.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "31. marec 2018",
        yearLabelEn: "31 March 2018",
        sortYear: 2018,
        textSi:
          "Umre v Ljubljani, star 110 let in 216 dni (v naslovih medijev zaokroženo 111) — najdalj živeči moški, ki ga je Slovenija kdaj zapisala; med nekdanje učence podružnične šole Griblje ga zapisuje tudi šolska kronika.",
        textEn:
          "He dies in Ljubljana, aged 110 years and 216 days (rounded to 111 in media headlines) — the longest-lived man Slovenia has ever recorded; the school chronicle lists him among the former pupils of the Griblje branch school.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "peter-kambic",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "24. maj 1869",
        yearLabelEn: "24 May 1869",
        sortYear: 1869,
        textSi: "Rojstvo v Krasincu, zaselku ob Kolpi nedaleč od Gribelj.",
        textEn: "Born at Krasinec, a hamlet by the Kolpa not far from Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1. januar 1889",
        yearLabelEn: "1 January 1889",
        sortYear: 1889,
        textSi:
          "V Dolenjskih novicah pod psevdonimom Pirc Krasinski objavi zapis »Božič pri Belokranjcih« — med najstarejše objavljene vpoglede v praznični vsakdan Bele krajine.",
        textEn:
          "In the Dolenjske novice, under the pen name Pirc Krasinski, he publishes »Christmas among the Bela krajina people« — among the oldest published glimpses of Bela krajina's festive life.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "november 1889",
        yearLabelEn: "November 1889",
        sortYear: 1889,
        textSi:
          "Blagoslov novega šolskega poslopja v Gribljah: učitelj pripravnik Kambič postane prvi učitelj — in prvi stanovalec — gribeljske šole.",
        textEn:
          "The blessing of the new school building in Griblje: the trainee teacher Kambič becomes the school's first teacher — and its first resident.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "25. januar 1890",
        yearLabelEn: "25 January 1890",
        sortYear: 1890,
        textSi:
          "Umre v Gribljah, komaj dvajsetleten — v kraju, kjer je komaj začel.",
        textEn:
          "He dies in Griblje, barely twenty — in the place he had only just begun.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Šola, ki jo je zagnal, danes uči kot podružnica OŠ Loka Črnomelj; njegov božični zapis ostaja citiran vir o šegah Bele krajine.",
        textEn:
          "The school he set going today teaches as a branch of the OŠ Loka Črnomelj school; his Christmas account remains a cited source on the customs of Bela krajina.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
    ],
  },
  {
    slug: "alburnus-sava",
    phases: [
      {
        stage: "raziskava",
        yearLabelSi: "zbiranje materiala",
        yearLabelEn: "collecting the material",
        sortYear: 2010,
        textSi:
          "Ihtiologi zbirajo primerke plevk v reki Kolpi v okviru raziskav savskega sistema — med njimi tudi živali, ki se ne pustijo prištevati k znanim vrstam.",
        textEn:
          "Ichthyologists collect bleak specimens in the Kolpa river within the surveys of the Sava system — among them animals that refuse to fit the known species.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "nastanek",
        yearLabelSi: "8. avgust 2017",
        yearLabelEn: "8 August 2017",
        sortYear: 2017,
        textSi:
          "Bogutskaya, Zupančič, Jelić, Diripasko in Naseka v ZooKeys 688: 81–110 formalno opišejo vrsto Alburnus sava — novo za znanost, poimenovano po Savi.",
        textEn:
          "Bogutskaya, Zupančič, Jelić, Diripasko and Naseka in ZooKeys 688: 81–110 formally describe Alburnus sava — new to science, named after the Sava.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "holotip",
        yearLabelEn: "the holotype",
        sortYear: 2017,
        textSi:
          "Tipični primerek — samec, 173,6 mm SL — je deponiran v Narodnem prirodoslovnem muzeju v Madridu (MNCN 291345); njegova fotografija pred konzerviranjem je glavna slika zapisa.",
        textEn:
          "The type specimen — a male, 173.6 mm SL — is deposited in the National Museum of Natural Sciences in Madrid (MNCN 291345); its pre-preservation photograph is this record's main image.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Vrsta živi v Kolpi — reki, ki se nad Gribljami razširi v ravnino in se poleti pregreje čez dvajset pet stopinj; skupaj s črnim močerilom (1986) sodi med življenja, ki jih je znanost ob vasi spoznala šele na našo stran tisočletja.",
        textEn:
          "The species lives in the Kolpa — the river that widens into a plain above Griblje and warms past twenty-five degrees in summer; together with the black olm (1986) it counts among the lives science met by the village only on our side of the millennium.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
    ],
  },
  {
    slug: "matice-podzemelj",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1669",
        yearLabelEn: "1669",
        sortYear: 1669,
        textSi:
          "Prvi vpisi v matične knjige župnije Podzemelj — nedaleč od konca tridesetletne vojne se v Beli krajini uredi župnijska uprava.",
        textEn:
          "The first entries in the Podzemelj parish registers — not long after the Thirty Years' War, parish administration settles in Bela krajina.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1669 → 1947",
        yearLabelEn: "1669 → 1947",
        sortYear: 1800,
        textSi:
          "Krstne, poročne in mrliške knjige neprekinjeno beležijo rojstva, poroke in smrti Gribeljcev (sv. Vid je podružnica) in Cerkviščanov; botri rišejo družbeno mrežo vasi.",
        textEn:
          "The books of baptisms, marriages and burials uninterruptedly record the births, weddings and deaths of Griblje people (St. Vitus is a filial) and of Cerkvišče; the godparents draw the village's social web.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1728",
        yearLabelEn: "1728",
        sortYear: 1728,
        textSi:
          "Župnija začne voditi vzporedni mrliški zvezek z oznako Nemškega viteškega reda (1728–1803) — red, ki je leta 1268 prejel župnijo Črnomelj z podružnicami, piše svoje ime še globoko v 18. stoletje.",
        textEn:
          "The parish begins a parallel burial volume labelled with the Teutonic Order (1728–1803) — the order that received the parish of Črnomelj with its filials in 1268 writes its name deep into the eighteenth century.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1947",
        yearLabelEn: "1947",
        sortYear: 1947,
        textSi:
          "Zadnji vpisi: državni registri prevzamejo vodenje matičnih knjig — župnijske knjige se zaprejo kot zgodovinski vir.",
        textEn:
          "The last entries: state registries take over the keeping of vital records — the parish books close as a historical source.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "digitalizacija",
        yearLabelEn: "digitisation",
        sortYear: 2015,
        textSi:
          "Nadškofijski arhiv Ljubljana digitalizira 22 zvezkov in jih objavi v prostem dostopu na Matricula Online.",
        textEn:
          "The Archdiocesan Archives of Ljubljana digitise 22 volumes and publish them in free access on Matricula Online.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Rodoslovna vrata za Gribeljce po svetu — muzej zapis postavlja kot vabilo k raziskovanju korenin (Totter, Županič, Štrucelj, Piškurič …), ne kot kopijo arhiva.",
        textEn:
          "A genealogical gate for Griblje families across the world — the museum keeps this record as an invitation to trace roots (Totter, Županič, Štrucelj, Piškurič …), not as a copy of the archive.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "porocna-1669",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1669",
        yearLabelEn: "1669",
        sortYear: 1669,
        textSi:
          "Župnija Podzemelj odpre svojo najstarejšo knjigo — poročno: po stoletju osmanskih vpadov se beleženje prične s svatbami.",
        textEn:
          "The Podzemelj parish opens its oldest book — a marriage register: after a century of Ottoman incursions, record-keeping begins with weddings.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1669 → 1679",
        yearLabelEn: "1669 → 1679",
        sortYear: 1670,
        textSi:
          "Desetletje svatbenih zapisov: ob imenih ženinov in nevest priče rišejo sorodstvene vezi med hišami — tudi gribeljskimi.",
        textEn:
          "A decade of wedding entries: beside the grooms' and brides' names, the witnesses draw the kinship between houses — Griblje ones among them.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1679",
        yearLabelEn: "1679",
        sortYear: 1679,
        textSi:
          "Zvezek se zaključi; župnija nadaljuje s krstnimi, poročnimi in mrliškimi knjigami vse do leta 1947 — skupaj dvaindvajset zvezkov.",
        textEn:
          "The volume closes; the parish continues with baptismal, marriage and burial books all the way to 1947 — twenty-two volumes in all.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Nadškofijski arhiv Ljubljana hrani knjigo pod signaturo 04795 in jo objavlja v prostem dostopu — začetna stran je slika tega zapisa.",
        textEn:
          "The Archdiocesan Archives of Ljubljana keep the book under the shelfmark 04795 and publish it in free access — its opening page is this record's image.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "spanska-gripa-1918",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1886 → 1917",
        yearLabelEn: "1886 → 1917",
        sortYear: 1886,
        textSi:
          "Mrliška knjiga Podzemelj 04894 nemirno piše trideset let: stran v treh tednih, vpis za vpisom, župnija v svojem letu po navadi pokopa svojih štirideset do šestdeset ljudi.",
        textEn:
          "The Podzemelj death register 04894 writes its thirty restless years: a page every three weeks, entry after entry, the parish burying its usual forty to sixty people a year.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "oktober–december 1918",
        yearLabelEn: "October–December 1918",
        sortYear: 1918,
        textSi:
          "Drugi val španske gripe: pisar ob pljučnici piše »(španka)« — španaska, španoka, španoška. Stran zadošča za štiri dni; vpisi 44–97 v petih tednih in pol; med gribeljskimi mrliči Ana Vegina (25) in Alojzij Orehek (27).",
        textEn:
          "The flu's second wave: the writer adds »(Spanish)« beside pneumonia — spelled three ways as the weeks went on. A page lasts four days; entries 44–97 in five and a half weeks; among the dead of Griblje Ana Vegina (25) and Alojzij Orehek (27).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Digitalizirana knjiga je v prostem dostopu na Matricula Online — stran z vpisi 1.–4. novembra 1918, z Aninim vpisom, je slika tega zapisa. Kdor želi, prešteje znova.",
        textEn:
          "The digitised book is in free access on Matricula Online — the page of 1–4 November 1918, Ana's entry among them, is this record's image. Whoever wishes may count again.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kolpa-extremi",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1952 → 1978",
        yearLabelEn: "1952 → 1978",
        sortYear: 1952,
        textSi:
          "Vodomerna postaja Metlika začne meriti Kolpo — reka, ki teče dvanajst kilometrov dolvodno od Gribelj, dobi svojo neprekinjeno kroniko: vsak dan, vsak vodostaj, vsak pretok.",
        textEn:
          "The Metlika gauging station begins measuring the Kolpa — the river that runs twelve kilometres downstream of Griblje receives its unbroken chronicle: every day, every level, every discharge.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "prica",
        yearLabelSi: "1979 in 1983 — oba ekstrema",
        yearLabelEn: "1979 and 1983 — both extremes",
        sortYear: 1979,
        textSi:
          "Konec septembra 1979 postaja zabeleži največji pretok vseh časov — 1.116 kubičnih metrov na sekundo, izračunan iz vodostaja. Štiri leta pozneje, 1. avgusta 1983, pa neposredno izmeri najmanjšega: 4,6. Med dnem in viškom istega korita je razmerje 242 proti ena.",
        textEn:
          "At the end of September 1979 the station records the greatest discharge of all — 1,116 cubic metres per second, computed from the water level. Four years later, on 1 August 1983, it directly gauges the least: 4.6. Between the bed's low and its high lies a ratio of 242 to one.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "prica",
        yearLabelSi: "2022 — leto obeh",
        yearLabelEn: "2022 — the year of both",
        sortYear: 2022,
        textSi:
          "Julija 7,8 kubičnega metra na sekundo (najsušeši julij od 1961); 17. septembra ob 13.30 pa 1.009 — največja kdaj hidrometrično izmerjena vrednost. Slika zapisa je posneta tisti dan s postaje Metlika.",
        textEn:
          "In July 7.8 cubic metres a second (the driest July since 1961); on 17 September at 13:30, 1,009 — the greatest hydrometrically measured value ever. The record's image was taken that day at the Metlika station.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2025 → merjenje gre naprej",
        yearLabelEn: "2025 → the measuring goes on",
        sortYear: 2025,
        textSi:
          "Septembra 2025 vodostaj na Petrini v treh urah poskoči za tri metre; hitrost naraslanja na Madroničevem dvorišču — 1,90 metra na uro — preseže dosedanji zapis. Projekt Striver pa Kolpo razglaša za povezan rečni sistem pred podnebnimi spremembami: merjenje gre naprej.",
        textEn:
          "In September 2025 the level at Petrina jumps three metres in three hours; the rate of rise at the Madronič yard — 1.90 metres an hour — beats the standing record. And the Striver project proclaims the Kolpa a connected river system before climate change: the measuring goes on.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 6,
      },
    ],
  },
  {
    slug: "cerkvisce",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "pred ~1408",
        yearLabelEn: "before ~1408",
        sortYear: 1380,
        textSi:
          "V naselju ob Kolpi stojijo tri cerkvice — naselbina kasneje po njih dobi ime Cerkvišče.",
        textEn:
          "Three churches stand in the settlement by the Kolpa — the place later takes its name, Cerkvišče, from them.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "~1408 → 15. stoletje",
        yearLabelEn: "~1408 → 15th century",
        sortYear: 1408,
        textSi:
          "Turški vpadi: vse tri cerkvice so porušene in požgane; lega dveh ostane v domnevah vaščanov, lega tretje izgubi vsak sled.",
        textEn:
          "The Ottoman incursions: all three churches are pulled down and burned; the site of two survives as villagers' conjecture, the site of the third loses every trace.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1500-ta → 1989",
        yearLabelEn: "1500s → 1989",
        sortYear: 1700,
        textSi:
          "Vas živi kot del župnije Podzemelj: v gozdu se skrivata Jelenja in Vodena jama, deluje zbiralnica mleka; Cerkvišče postane drugi naseljni del krajevne skupnosti Griblje.",
        textEn:
          "The village lives within the Podzemelj parish: the Deer and Water caves hide in its woods, a milk collection point works; Cerkvišče becomes the second settlement of the Griblje local community.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1994",
        yearLabelEn: "1994",
        sortYear: 1994,
        textSi:
          "Postavitev kapelice v spomin treh porušenih cerkvic — pričevanje, da je spomin živel naprej tudi brez kamna.",
        textEn:
          "The raising of a chapel in memory of the three ruined churches — a testimony that memory lived on even without stone.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Vas leži 2 km od Kolpe pri Gribljah in 2 km od kopališča Krasinec — nedaleč od polja partizanskega letališča iz marca 1945; svet KS (izvoljen 2025) sodeluje v razvoju obeh naselij.",
        textEn:
          "The village lies 2 km from the Kolpa at Griblje and 2 km from the Krasinec bathing place — not far from the field of the partisan airfield of March 1945; the local community's 2025 council serves both settlements.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "pasuljada",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "~2004",
        yearLabelEn: "~2004",
        sortYear: 2004,
        textSi:
          "Turistično društvo Griblje z Društvom kmečkih žena in kopališčem priredi prvo tekmovanje v kuhanju pasulja — iz vaške šale rodi koledarska šega.",
        textEn:
          "The Griblje Tourist Society with the Farm Women's Society and the bathing place holds the first bean-stew cooking contest — a village joke grows into a calendar custom.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "6. avgust 2019",
        yearLabelEn: "6 August 2019",
        sortYear: 2019,
        textSi:
          "Šestnajsta izvedba: 14 ekip po dva člana, komisija (Cotič, Fornezzi Tof, Drakulič Veselič); zmagata Dragica Piškurič in Toni Kapušin.",
        textEn:
          "The sixteenth edition: 14 teams of two, the jury (Cotič, Fornezzi Tof, Drakulič Veselič); Dragica Piškurič and Toni Kapušin take the honours.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "2020-ta",
        yearLabelEn: "2020s",
        sortYear: 2024,
        textSi:
          "Pasuljada se v spleti s praznikom krajevne skupnosti, Kavbojskim žurom in rallyjem starodobnih koles v letni praznični koledar TD Griblje.",
        textEn:
          "The Pasuljada weaves itself, with the local community's feast, the Cowboy Party and the vintage-bicycle rally, into the Tourist Society's yearly festive calendar.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Dogodek pričakujejo z obeh bregov Kolpe; muzej ga hrani kot primer procesa, v katerem nastaja nova tradicija — nekoč bo o njej pisal kakor danes o božiču pri Belokranjcih.",
        textEn:
          "The event is awaited from both banks of the Kolpa; the museum keeps it as an example of the process in which a new tradition is born — one day it will be written about the way we today write about Christmas among the Bela krajina people.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "franc-brinc",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1941–1945",
        yearLabelEn: "1941–1945",
        sortYear: 1941,
        textSi:
          "Otroštvo v vojni: gribeljsko šolo obiskoval med italijansko zasedbo poslopja — pouk takrat beži v gasilski dom.",
        textEn:
          "A wartime childhood: he attends the Griblje school under the Italian occupation of the building — lessons then flee to the fire station.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1970,
        textSi:
          "Iz vasi v pravo: izredni profesor, penolog in kriminolog — znanosti o kazni in o tem, zakaj ljudje padajo.",
        textEn:
          "From the village into law: associate professor, penologist and criminologist — the sciences of punishment and of why people fall.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "15. september 2024",
        yearLabelEn: "15 September 2024",
        sortYear: 2024,
        textSi:
          "Na prazniku krajevne skupnosti 89-letni Brinc nagovori domačine z življenjskimi spomini; istega večera v gasilskem domu odprejo spominsko sobo dr. Franca Brinca.",
        textEn:
          "At the local community's feast the 89-year-old Brinc addresses his neighbours with the memories of a lifetime; the same evening the memorial room of dr. Franc Brinc opens in the fire station.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "2021–2026",
        yearLabelEn: "2021–2026",
        sortYear: 2025,
        textSi:
          "Darovanja: 30.000 € PGD v štirih letih (operativna soba, streha, izolacija), 30.000 € šoli (digitalna oprema, igrala, ekovrt, Planica); skupaj z občino in cerkvijo okoli 200.000 €.",
        textEn:
          "The gifts: 30,000 € to the fire brigade over four years (operational room, roof, insulation), 30,000 € to the school (digital equipment, play equipment, school garden, Planica); with the municipality and the church around 200,000 € in all.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "10. april → junij 2026",
        yearLabelEn: "10 April → June 2026",
        sortYear: 2026,
        textSi:
          "Na pročelju šole odkrijejo spominsko ploščo dr. Brincu; ob 500-letnici cerkve njegova podpora z občino omogoči ureditev parkirišča in poslovilne vežice.",
        textEn:
          "A memorial plaque to dr. Brinc is unveiled on the school facade; at the church's 500th anniversary his support with the municipality makes possible the parking place and the funeral vestibule.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
    ],
  },
  {
    slug: "katarina-zupanic",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1855",
        yearLabelEn: "1855",
        sortYear: 1855,
        textSi:
          "Rojena Katarina Pezdirc na gribeljski domačiji pri Grizinu — ženska, ki bo znala brati in pisati, kar je za vaško kmetico tega časa redkost.",
        textEn:
          "Born Katarina Pezdirc at the pri Grizinu homestead in Griblje — a woman who will be able to read and write, a rarity for a village farm wife of her time.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1894–1895",
        yearLabelEn: "1894–1895",
        sortYear: 1894,
        textSi:
          "Na željo sina Nika — prihodnjega ustanovitelja slovenske etnologije — zbere in zapiše ljudsko izročilo Gribelj: leto, šege, pesmi in vere, kakor jih živi.",
        textEn:
          "At the wish of her son Niko — the future founder of Slovene ethnology — she gathers and writes down the folk tradition of Griblje: the year, the customs, the songs and the beliefs as she lives them.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "23. julij 1923",
        yearLabelEn: "23 July 1923",
        sortYear: 1923,
        textSi:
          "Umre; njen zapis čaka na objavo v predalu — usoda večine vaških rokopisov.",
        textEn:
          "She dies; her record waits in a drawer for print — the fate of most village manuscripts.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "1937",
        yearLabelEn: "1937",
        sortYear: 1937,
        textSi:
          "Šopek poljskih cvetlic iz Gribelj v Beli Krajini izide v devetem zvezku Etnologa — v reviji, ki jo je leta 1927 ustanovil njen sin.",
        textEn:
          "A Bouquet of Meadow Flowers from Griblje in Bela krajina appears in the ninth volume of Etnolog — the journal her son founded in 1927.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Med najstarejšimi obsežnejšimi zapisi izročila, zapisanimi v Gribljah samih; prva ženska med zapisovalci te zbirke in most med vaškim izročilom in znanostjo.",
        textEn:
          "Among the oldest more extensive records of tradition written down in Griblje itself; the first woman among this collection's recorders, and a bridge between village tradition and science.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "toni-gasperic",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "20.–21. stoletje",
        yearLabelEn: "20th–21st century",
        sortYear: 1980,
        textSi:
          "V Gribljah ob Kolpi živi z ženo Jano — hiša odprta za prijatelje in neznance; humor postane njegova obrt.",
        textEn:
          "He lives in Griblje on the Kolpa with his wife Jana — a house open to friends and strangers; humour becomes his trade.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "2007–2009",
        yearLabelEn: "2007–2009",
        sortYear: 2007,
        textSi:
          "Izidejo spominski knjigi Povej jim in Življenje je eno samo porivanje — ob zbirkah humoresk Ljudje z zaščitenimi hrbti, Vsi smo na ražnju, Moja teta Mara.",
        textEn:
          "The memoirs Povej jim and Življenje je eno samo porivanje appear — beside the humoresque collections Ljudje z zaščitenimi hrbti, Vsi smo na ražnju, Moja teta Mara.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "oddaje in odri",
        yearLabelEn: "shows and stages",
        sortYear: 2010,
        textSi:
          "Voditelj oddaj Veseli tobogan, Prizma optimizma, Vi izbirate – jaz izberem; ustanovitelj metliške igralske skupine Osip Šest in pobudnik Noči na Kolpi.",
        textEn:
          "Presenter of the shows Veseli tobogan, Prizma optimizma, Vi izbirate – jaz izberem; founder of the Metlika acting group Osip Šest and initiator of the Night on the Kolpa.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "5. maj 2026 → danes",
        yearLabelEn: "5 May 2026 → today",
        sortYear: 2026,
        textSi:
          "Portret v rubriki Ljudje ob Kolpi; muzej med nesnovno dediščino vasi zapisuje tudi smeh in išče plakate Noči na Kolpi.",
        textEn:
          "His portrait in the People by the Kolpa series; among the village's intangible heritage the museum records laughter too, and seeks posters of the Night on the Kolpa.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "madronicev-mlin",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1937",
        yearLabelEn: "1937",
        sortYear: 1937,
        textSi:
          "Tesarska družina Madronič kupi požgano domačijo z mlinom in žago v Prelesju ob Kolpi — mlin v nadstropju, kakor zahtevajo kolpške poplave.",
        textEn:
          "The Madronič carpentry family buys a burnt-down homestead with a mill and a sawmill at Prelesje on the Kolpa — the mill in an upper storey, as the Kolpa's floods demand.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1.–4. oktober 1943",
        yearLabelEn: "1–4 October 1943",
        sortYear: 1943,
        textSi:
          "Stari Peter Madronič med odposlanci na Zboru odposlancev v Kočevju; hčerka Katica zunaj čuva konja — »partizanskega taksista«.",
        textEn:
          "Old Peter Madronič among the delegates at the Assembly of Delegates at Kočevje; daughter Katica guards the horse outside — the »Partisan taxi«.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1945–1978",
        yearLabelEn: "1945–1978",
        sortYear: 1960,
        textSi:
          "Mlin in žaga delujeta za okolico; leta 1978 domačija gosti likovno kolonijo študentov.",
        textEn:
          "The mill and the saw work for the neighbourhood; in 1978 the homestead hosts an art colony of students.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Mlin ne deluje več; obnovljen je sto metrov dolg poševni jez. Družina je izdelala tri makete mlina in žage (ena z vodnim pogonom) in pripravlja knjigo z arhivskim gradivom.",
        textEn:
          "The mill works no more; the hundred-metre diagonal weir has been restored. The family has built three models of the mill and the saw (one with water power) and is preparing a book of archival material.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "muzejska-ucilnica",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "november 1889",
        yearLabelEn: "November 1889",
        sortYear: 1889,
        textSi:
          "Blagoslov šolskega poslopja: ena učilnica in stanovanje učitelja pripravnika Petra Kambiča.",
        textEn:
          "The school building is blessed: one classroom and the flat of the trainee teacher Peter Kambič.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1941–2004",
        yearLabelEn: "1941–2004",
        sortYear: 1950,
        textSi:
          "Vojna zasede poslopje (pouk v gasilskem domu), povojne množice razširijo (učilo se je tudi v Brinčevi hiši); 2002–2004 kdaj le 4–6 učencev — vas in občina šolo obdržita.",
        textEn:
          "The war occupies the building (lessons in the fire station), the postwar crowds widen it (teaching also in the Brinc house); 2002–2004 at times only 4–6 pupils — the village and the municipality keep the school.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "26. junij 2022",
        yearLabelEn: "26 June 2022",
        sortYear: 2022,
        textSi:
          "Odprtje muzejske učilnice v več kot 130 let stari šoli — prisotna predstavnica Slovenskega šolskega muzeja; brani se zapisi šolskega leta 1949/50 (pečke, zelišča, Gumb za AFŽ).",
        textEn:
          "The museum classroom opens in the more than 130-year-old school — a representative of the Slovene School Museum present; records of the school year 1949/50 are read (apple seeds, herbs, Gumb za AFŽ).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2026 → 2029",
        yearLabelEn: "2026 → 2029",
        sortYear: 2026,
        textSi:
          "17 učencev v petih kombiniranih oddelkih, vodja Marjetka Žunič (od 1992) — edina slovenska vas s svojo podružnico; leta 2029 140-letnica.",
        textEn:
          "17 pupils in five combined departments, head Marjetka Žunič (since 1992) — the only Slovene village with its own branch school; the 140th anniversary in 2029.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "kavbojski-zur",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "2024",
        yearLabelEn: "2024",
        sortYear: 2024,
        textSi:
          "Prvi Kavbojski žur: »Bilo je kot na Divjem zahodu« — vas se za en dan preoblikuje v divji zahod.",
        textEn:
          "The first Cowboy Party: »It was like in the Wild West« — the village turns into the Wild West for a day.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "junij 2025",
        yearLabelEn: "June 2025",
        sortYear: 2025,
        textSi:
          "Druga izvedba »znova navduši«: plesalke Country Roses (domačinke), učenci OŠ, Country Vrtičkarji iz Semiča in Wild West iz Ljubljane.",
        textEn:
          "The second edition »delights again«: the Country Roses dancers (local women), primary-school pupils, the Country Vrtičkarji of Semič and Wild West of Ljubljana.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "julij 2026",
        yearLabelEn: "July 2026",
        sortYear: 2026,
        textSi:
          "Country Roses nastopijo tudi na rallyju starodobnih koles — šega se prepleta s poletnim koledarjem vasi.",
        textEn:
          "The Country Roses also perform at the vintage-bicycle rally — the custom interweaves with the village's summer calendar.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2027,
        textSi:
          "Najmlajša šega v zbirki (CORROBORATED, ne TRADITION): zapisana ob rojstvu, da nekoč ne bo manjkal dokument o prvem dnevu — kakor danes manjka večini starih šeg.",
        textEn:
          "The collection's youngest custom (CORROBORATED, not TRADITION): recorded at its birth, so that one day the document of the first day will not be missing — as it is missing for most old customs.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "zvon-2008",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1526 → 2008",
        yearLabelEn: "1526 → 2008",
        sortYear: 1526,
        textSi:
          "Cerkev sv. Vida prvič zapisana v listinah; usoda njenih predhodnih zvonov (rekvizicije, razpoke, menjava) je danes izgubljena — vrzel, ki jo muzej odkrito išče.",
        textEn:
          "The church of St. Vitus first enters the documents; the fate of its earlier bells (requisitions, cracks, replacement) is lost today — a gap the museum openly seeks to fill.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "2008",
        yearLabelEn: "2008",
        sortYear: 2008,
        textSi:
          "Blagoslov in posvetitev novega zvona; o dogodku nastane spominska knjiga »SV. VID GRIBLJE« — med redkimi tiskanimi viri, nastalimi v sami vasi.",
        textEn:
          "The blessing and consecration of the new bell; a memorial book »SV. VID GRIBLJE« arises from the event — among the rare printed sources created in the village itself.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "21. junij 2026",
        yearLabelEn: "21 June 2026",
        sortYear: 2026,
        textSi:
          "Zvon pozvoni ob 500-letnici prve omembe cerkve — slovesno mašo daruje škof Glavan; ob cerkvi blagoslovijo novo parkirišče in poslovilno vežico.",
        textEn:
          "The bell rings at the 500th anniversary of the church's first mention — the solemn mass celebrated by Bishop Glavan; by the church the new parking place and funeral vestibule are blessed.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "→ danes",
        yearLabelEn: "→ today",
        sortYear: 2027,
        textSi:
          "Muzej išče fotografije blagoslova 2008, imena botrov zvona in ime livarne — vsak zvon nosi žig, vsak žig zgodbo. Ko se najdejo, se vrzel zapre.",
        textEn:
          "The museum seeks photographs of the 2008 blessing, the names of the bell's godparents and the foundry's name — every bell carries a mark, every mark a story. When they are found, the gap closes.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "zaselki-griblje",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "srednji vek",
        yearLabelEn: "Middle Ages",
        sortYear: 1500,
        textSi: "Vas se oblikuje kot razložena naselbina: hiše tam, kjer je zemlja — loka ob Kolpi, njive na terasah.",
        textEn: "The village forms as a scattered settlement: houses where the land is — meadows by the Kolpa, fields on the terraces.",
        evidenceStatus: "TRADITION",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1526",
        yearLabelEn: "1526",
        sortYear: 1526,
        textSi: "Prva pisna omemba Gribelj (ob cerkvi sv. Vida) že nosi podobo večdelne vasi ob reki.",
        textEn: "The first written mention of Griblje (with the church of St. Vitus) already carries the shape of a multi-part village by the river.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi: "Wikipedija in uradna stran KS Griblje navajata štiri zaselke: Dolnje, Srednje, Gornje Griblje in Brinsko selo.",
        textEn: "Wikipedia and the official KS Griblje page list four hamlets: Dolnje, Srednje, Gornje Griblje and Brinsko selo.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "v zbiranju",
        yearLabelEn: "to collect",
        sortYear: 2027,
        textSi: "Muzej išče prvi zapis imena Brinsko selo in natančne meje med zaselki — domačini kot kartografi.",
        textEn: "The museum seeks the first written use of the name Brinsko selo and the exact boundaries between hamlets — villagers as cartographers.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "goranja-lokva",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "po 1848",
        yearLabelEn: "after 1848",
        sortYear: 1848,
        textSi: "Kmetje izkrčijo brezov gozd in v njem napravijo kal — Goranjo lokvo — kjer kopajo glino za opeko.",
        textEn: "The farmers clear the birch forest and make a pond in it — Goranja lokva — where they dig clay for brick.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "19.–20. stoletje",
        yearLabelEn: "19th–20th century",
        sortYear: 1900,
        textSi: "Opeka iz lokalne gline gradi vaške hiše; pri Rudni peči prsti z železovo vsebino ne potrebujejo geologov.",
        textEn: "Brick from local clay builds the village houses; at Rudna peč the iron-bearing soils need no geologists.",
        evidenceStatus: "TRADITION",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "v zbiranju",
        yearLabelEn: "to collect",
        sortYear: 2027,
        textSi: "Kdaj so nazadnje kopali glino, katera peč je žgala opeko, kdo je bil zadnji opekar — odprta vprašanja.",
        textEn: "When clay was last dug, which kiln fired the brick, who was the last brickmaker — open questions.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "strucelj-kmetija",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1950,
        textSi: "Ročna košnja in molža: »S pesmijo je delo lažje steklo, včasih do mraka, a vedno skupaj.«",
        textEn: "Hand mowing and milking: »With a song the work flowed easier, sometimes until dusk, but always together.«",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi: "Radio Odeon zapiše portret: družinska kmetija z okoli 90 hektari in prirejo mleka.",
        textEn: "Radio Odeon records the portrait: a family farm of around 90 hectares with milk production.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "tamburasi-danica",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1920-ta",
        yearLabelEn: "1920s",
        sortYear: 1925,
        textSi: "Mladi Niko Dragoš po pobegu iz uka v Ljubljani igra bugarijo v tamburaški skupini društva Danica.",
        textEn: "Young Niko Dragoš, after running away from his apprenticeship, plays the bugarija in the Danica society's tambura group in Ljubljana.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "v zbiranju",
        yearLabelEn: "to collect",
        sortYear: 2027,
        textSi: "Ni ohranjene fotografije tamburašev z gribeljskimi obrazi, ne seznama skladb, ne datuma prvega nastopa.",
        textEn: "No photograph of the tambura players with Griblje faces survives, nor a list of songs, nor the date of a first performance.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kopalisce-griblje",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1950,
        textSi: "Ob topli Kolpi se ob vasi uredi kopališče: trava, senca, kabine — institucija poletja.",
        textEn: "By the warm Kolpa a bathing place takes shape by the village: grass, shade, cabins — the institution of summer.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2024–2026",
        yearLabelEn: "2024–2026",
        sortYear: 2025,
        textSi: "Kopališče kot soorganizator: julija rally starodobnih koles, avgusta Pasuljada — poletni trikotnik vasi.",
        textEn: "The bathing place as co-organiser: the vintage-bicycle rally in July, the Pasuljada in August — the village's summer triangle.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "v zbiranju",
        yearLabelEn: "to collect",
        sortYear: 2027,
        textSi: "Ustanovna letnica, imena urednikov brega in fotografije kopalnih desetletij še čakajo.",
        textEn: "The founding year, the names of those who put the bank in order, and photographs of the swimming decades still await.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "dakota-otok",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1943",
        yearLabelEn: "1943",
        sortYear: 1943,
        textSi: "USAAF serijsko proizvaja C-47 Skytrain — transportno letalo, ki bo nosilo zavezniške reševalne polete.",
        textEn: "The USAAF mass-produces the C-47 Skytrain — the transport aircraft that will carry the Allied rescue flights.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1944–1945",
        yearLabelEn: "1944–1945",
        sortYear: 1944,
        textSi: "Dakote letajo z belokranjskih partizanskih letališč: ranjenci v Italijo, vojni ujetniki proti domu.",
        textEn: "Dakotas fly from Bela krajina's partisan airfields: the wounded to Italy, prisoners of war towards home.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "po vojni",
        yearLabelEn: "after the war",
        sortYear: 2020,
        textSi: "Edini ohranjeni primerek v Sloveniji stoji pri Otoku; vsako pomlad ga obiskuje spominska slovesnost Vranov let.",
        textEn: "The only preserved example in Slovenia stands at Otok; every spring the Vranov let memorial ceremony visits it.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "veselko-fotograf",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1943–1945",
        yearLabelEn: "1943–1945",
        sortYear: 1943,
        textSi: "Profesor zgodovine in geografije vodi fotosekcijo propagandne komisije Predsedstva SNOS; ~2000 posnetkov.",
        textEn: "A teacher of history and geography leads the SNOS Presidency propaganda commission's photo section; ~2000 photographs.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "marec 1945",
        yearLabelEn: "March 1945",
        sortYear: 1945,
        textSi: "Ob polju pri Gribljah posname ranjence in angleškega pilota — dve fotografiji, ki ju nosi ta zbirka.",
        textEn: "By the field at Griblje he photographs the wounded and an English pilot — two photographs this collection carries.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "digitalizacija",
        yearLabelSi: "2010 →",
        yearLabelEn: "2010 →",
        sortYear: 2010,
        textSi: "Vončinov članek v Prispevkih za novejšo zgodovino (50/3) in javna domena na Wikimedia Commons.",
        textEn: "Vončina's article in Contributions to Contemporary History (50/3) and the public domain on Wikimedia Commons.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "v zbiranju",
        yearLabelEn: "to collect",
        sortYear: 2027,
        textSi: "Veselkova pot po letu 1945 — epilog očeta, ki je videl reševanje.",
        textEn: "Veselko's path after 1945 — the epilogue of the eye that saw the rescue.",
        evidenceStatus: "TO_COLLECT",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "zracni-most-krasinec",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1944",
        yearLabelEn: "1944",
        sortYear: 1944,
        textSi: "Partizani uredijo travnik ob Kolpi pri Krasincu za zavezniška letala — drugo belokranjsko letališče.",
        textEn: "The partisans ready a meadow by the Kolpa at Krasinec for Allied aircraft — Bela krajina's second airfield.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "25.–26. marec 1945",
        yearLabelEn: "25–26 March 1945",
        sortYear: 1945,
        textSi: "Dakote in spitfiri v 48 urah prepeljejo 2041 ljudi — med njimi pisateljico Almo Karlin.",
        textEn: "Dakotas and Spitfires fly out 2041 people in 48 hours — among them the writer Alma Karlin.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2025",
        yearLabelEn: "2025",
        sortYear: 2025,
        textSi: "Ob 80. obletnici izide knjiga Zračni most (Ilinka Todorovski); RTV Slovenija zgodbo pripoveduje naprej.",
        textEn: "For the 80th anniversary the book Zračni most (Ilinka Todorovski) appears; RTV Slovenija tells the story onward.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kolesa-torpedo",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1930,
        textSi: "Kolesa znamke Torpedo nosijo generacijo — od opravkov do prvih dirk po obkolpski ravnini.",
        textEn: "Torpedo-brand bicycles carry a generation — from errands to the first races on the Kolpa plain.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2020-ta",
        yearLabelEn: "2020s",
        sortYear: 2024,
        textSi: "Kolesarska sekcija Torpedo vsako julijo organizira rally starodobnih koles — poletni praznik vasi.",
        textEn: "The Torpedo cycling section organises the vintage-bicycle rally every July — the village's summer feast.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "matija-totter",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1873",
        yearLabelEn: "1873",
        sortYear: 1873,
        textSi:
          "Rojen kot peti od osmih otrok pri Jandrečih v Gribljah; mama Marjeta Štrucelj, oče Andrej Totter.",
        textEn:
          "Born the fifth of eight children at the Jandreči in Griblje; mother Marjeta Štrucelj, father Andrej Totter.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1880-ta → 1890-ta",
        yearLabelEn: "1880s → 1890s",
        sortYear: 1890,
        textSi:
          "Fant pod tepko: namesto gostilne in plesov bere in zapisuje pregovore, šege in običaje; za Barleta in Zupaniča popiše ženitovanjske običaje, pastirski križevo in kresovanje s pesmijo.",
        textEn:
          "The boy under the bench: instead of inn and dances he reads and writes down proverbs and customs; for Barle and Županič he records the wedding customs, the shepherds' križevo and the bonfire rite with its song.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1889",
        yearLabelEn: "1889",
        sortYear: 1889,
        textSi:
          "Star šestnajst let gre peš v Novo mesto k vpisu v nižjo gimnazijo; opat Florentin Hrovat ga zavrne kot prestarega in svetuje hlapčevanje.",
        textEn:
          "At sixteen he walks to Novo mesto to enrol in the lower gymnasium; abbot Florentin Hrovat refuses him as too old and advises farm service.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1890-ta → 1950",
        yearLabelEn: "1890s → 1950",
        sortYear: 1900,
        textSi:
          "Emigracija: brat Jakob v St. Paulu (Minnesota), nato Teksas — bombažna farma in trgovina v Saragosi; žena Agnes, osem otrok; najmlajši sin dr. John Randolph Totter svetovno znani biokemik. V Slovenijo se ne vrne nikoli več.",
        textEn:
          "Emigration: brother Jakob in St. Paul (Minnesota), then Texas — a cotton farm and a store in Saragosa; wife Agnes, eight children; the youngest son dr. John Randolph Totter a world-famous biochemist. He never returns to Slovenia.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "1950 → danes",
        yearLabelEn: "1950 → present",
        sortYear: 2024,
        textSi:
          "Umre 17. marca 1950 v Balmorhei; dopisovanje z Zupaničem in Barletom traja do konca. Na Jandrečetovi domačiji danes ekološko kmetuje maratonc Ciril Totter. Muzej išče Matičkove zapiske in pisma.",
        textEn:
          "He dies on 17 March 1950 in Balmorhea; the correspondence with Županič and Barle lasts to the end. Today the marathon runner Ciril Totter farms ecologically at the Jandreči homestead. The museum seeks Matiček's notebooks and letters.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "janko-barle",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1869",
        yearLabelEn: "1869",
        sortYear: 1869,
        textSi:
          "Rojen v Budanjah na Vipavskem; oče Ivan, učitelj in organist, ki bo dvakrat služboval v Podzemlju.",
        textEn:
          "Born in Budanje in the Vipava valley; father Ivan, a teacher and organist who would serve twice at Podzemelj.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1872 → 1887",
        yearLabelEn: "1872 → 1887",
        sortYear: 1872,
        textSi:
          "Otroštvo v Podzemlju ob Kolpi (»Srečna, lepa leta«); gimnazija v Novem mestu, Karlovcu in Zagrebu.",
        textEn:
          "Childhood at Podzemelj by the Kolpa ('Happy, beautiful years'); gymnasium in Novo mesto, Karlovac and Zagreb.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1892 → 1921",
        yearLabelEn: "1892 → 1921",
        sortYear: 1892,
        textSi:
          "Posvečen 1892; v Zagrebu nadškofov tajnik, vodja pisarne in kanonik; 1921 dopisni član JAZU; reformator hrvaške cerkvene glasbe.",
        textEn:
          "Ordained 1892; in Zagreb the archbishop's secretary, head of office and canon; 1921 corresponding member of the Yugoslav Academy; reformer of Croatian church music.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1889 → 1937",
        yearLabelEn: "1889 → 1937",
        sortYear: 1889,
        textSi:
          "Etnologija Bele krajine: Ženitovanjski običaji (1889), Pisanice iz Bele Krajine (1893), pesmi za Štrekeljevo zbirko; vrhunec Prinosi slovenskim nazivom bilja I–II (1936–37) s 3.000 rastlinskimi imeni.",
        textEn:
          "The ethnology of Bela krajina: Wedding Customs (1889), Pisanice of Bela krajina (1893), songs for Štrekelj's collection; the peak in Contributions to Slovene Plant Names I–II (1936–37) with 3,000 plant names.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "1941 → danes",
        yearLabelEn: "1941 → present",
        sortYear: 2026,
        textSi:
          "Umre 18. februarja 1941 v Zagrebu. Njegove študije so še danes temelj belokranjske etnologije; muzej išče pisma Matičku iz Gribelj.",
        textEn:
          "He dies on 18 February 1941 in Zagreb. His studies remain the foundation of Bela krajina ethnology; the museum seeks his letters to Griblje's Matiček.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "konrad-barle",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1875",
        yearLabelEn: "1875",
        sortYear: 1875,
        textSi:
          "Rojen 19. februarja v Podzemlju, med očetovim drugim učiteljevanjem; brat Janko je takrat star šest let.",
        textEn:
          "Born on 19 February at Podzemelj, during his father's second teaching term there; brother Janko was then six.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1880 → 1899",
        yearLabelEn: "1880 → 1899",
        sortYear: 1880,
        textSi:
          "Očetova šola kot vzor: vrt (1880) in čebelnjak (1882) ob podzemeljski šoli; učiteljišče v Ljubljani (1891–95), prva služba na Robu pri Velikih Laščah.",
        textEn:
          "The father's school as a model: the garden (1880) and apiary (1882) beside the Podzemelj school; the teachers' college in Ljubljana (1891–95), first post at Rob pri Velikih Laščah.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1899 → 1934",
        yearLabelEn: "1899 → 1934",
        sortYear: 1899,
        textSi:
          "Metlika: petintrideset let pouka; od 1920 upravitelj, od 1931 šolski nadzornik; štirirazrednica postane osemrazrednica (1919–21), oder na šoli 1925.",
        textEn:
          "Metlika: thirty-five years of teaching; head from 1920, school supervisor from 1931; the four-grade school becomes an eight-grade one (1919–21), the school stage of 1925.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1898 → 1940-ta",
        yearLabelEn: "1898 → 1940s",
        sortYear: 1898,
        textSi:
          "Čebele: prvi belokranjski čebelar z AŽ-panjem; opazovalna postaja Metlika (1908, ena od šestih na Kranjskem), podružnica 1912, Črnomelj 1919, poročila v Slovenskem čebelarju.",
        textEn:
          "The bees: the first AŽ-hive beekeeper of Bela krajina; the Metlika observation station (1908, one of six in Carniola), the branch of 1912, Črnomelj 1919, reports in the Slovenski čebelar.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1933 → 2012",
        yearLabelEn: "1933 → 2012",
        sortYear: 1933,
        textSi:
          "Muzej: Muzejski odsek pri Tujsko prometnem društvu (1933), ustanovni član Belokranjskega muzejskega društva (1949); metliška podružnica praznuje stoletnico (1912–2012, spominski članek Zvonka Rusa).",
        textEn:
          "The museum: the Museum Section at the Touring Club (1933), founding member of the Bela krajina Museum Society (1949); the Metlika branch keeps its centenary (1912–2012, Zvonko Rus's memorial article).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "danes",
        yearLabelSi: "1951 → danes",
        yearLabelEn: "1951 → present",
        sortYear: 2026,
        textSi:
          "Umre 15. julija 1951, v letu odprtja Belokranjskega muzeja; pokopan v Rosalnicah pri Treh farah. Etnografska fotografija SEM (1952) dokumentira čebelnjake njegove dobe — glavna slika zapisa.",
        textEn:
          "He dies on 15 July 1951, in the year the Bela krajina museum opened; buried at Rosalnice by the Three Churches. The SEM ethnographic photograph (1952) documents the apiaries of his age — the record's main image.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
    ],
  },
  {
    slug: "kucar-podzemelj",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "halštatska doba",
        yearLabelEn: "Hallstatt age",
        sortYear: -800,
        textSi:
          "Na Kučarju zraste eno največjih železnodobnih selišč širšega južnoalpskega prostora: topilnica rude, kovačnica, hiše; mrtvi v gomile pri Grmu, Zemljah in Škriljah.",
        textEn:
          "On Kučar one of the largest Iron Age settlements of the wider south-Alpine world grows: an ore smeltery, a forge, houses; the dead in barrows near Grm, Zemelj and Škrilje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "3. st. pr. n. št.",
        yearLabelEn: "3rd c. BC",
        sortYear: -270,
        textSi:
          "Na Pezdirčevi njivi je zakopan bronast pas z zlatnikom: keltska imitacija staterja Aleksandra Velikega z Niko in Ateno — skovana v prvi polovici 3. stoletja pr. n. št.",
        textEn:
          "At Pezdirčeva njiva a bronze belt with a gold coin lies buried: a Celtic imitation of a stater of Alexander the Great with Nike and Athena — struck in the first half of the 3rd century BC.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "5.–6. stoletje",
        yearLabelEn: "5th–6th centuries",
        sortYear: 500,
        textSi:
          "Na vrhu poznoantični stavbni kompleks: dve cerkvi, krstilnica in stanovanjske zgradbe znotraj obzidja — zgodnjekrščanski svet nad faro, ki še ni obstajala.",
        textEn:
          "On the top a late-antique building complex: two churches, a baptistery and dwelling houses within a wall — an early Christian world above a parish that did not yet exist.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "nastanek",
        yearLabelSi: "1228 → 1279",
        yearLabelEn: "1228 → 1279",
        sortYear: 1279,
        textSi:
          "Cerkev sv. Martina stoji pred letom 1228, kraj se imenuje Sv. Martin; Podzemelj prvič na papirju 1279 — sto devetinosemdeset let pred Gribljami (1468).",
        textEn:
          "The church of St. Martin stands before 1228, the place is called Sv. Martin; Podzemelj first on paper in 1279 — a hundred and eighty-nine years before Griblje (1468).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1669 → 1947",
        yearLabelEn: "1669 → 1947",
        sortYear: 1669,
        textSi:
          "Fara sv. Martina zapisuje Griblje: matične knjige 1669–1947; v letih 1872–1893 tam učiteljuje Ivan Barle, pred gribeljsko šolo (1889).",
        textEn:
          "The parish of St. Martin writes Griblje down: the registers 1669–1947; between 1872 and 1893 Ivan Barle teaches there, before the Griblje school (1889).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "pred 1914 → 1995",
        yearLabelEn: "before 1914 → 1995",
        sortYear: 1914,
        textSi:
          "Gomile izkopane pred prvo svetovno vojno (Dunaj, Ljubljana); Dularjev katalog Podzemelj 1978; monografija Kučar (Dular, Ciglenečki, Dular) 1995.",
        textEn:
          "The barrows excavated before the First World War (Vienna, Ljubljana); Dular's catalogue Podzemelj 1978; the monograph Kučar (Dular, Ciglenečki, Dular) 1995.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "present",
        sortYear: 2026,
        textSi:
          "Hrib je spomeniško zaščiten, pobočja nosijo vinograde z zidanicami; Podzemelj ima 169 prebivalcev. Glavna slika zapisa: Uroš Novina, september 2024.",
        textEn:
          "The hill is a protected monument, its slopes carry vineyards with cellar houses; Podzemelj counts 169 inhabitants. The record's main image: Uroš Novina, September 2024.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
    ],
  },
  {
    slug: "kranjska-sivka",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1879",
        yearLabelEn: "1879",
        sortYear: 1879,
        textSi:
          "Znanost opiše Apis mellifera carnica in pasmo imenuje po Kranjski; vitko telo, temno rjavi obročki in srebrnosive zadkove dlačice ji dajo ljudsko ime sivka.",
        textEn:
          "Science describes Apis mellifera carnica and names the breed after Carniola; the slender body, dark brown rings and silvery-grey abdominal hairs give her the folk name sivka, the grey one.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "svet",
        yearLabelEn: "the world",
        sortYear: 1900,
        textSi:
          "Druga najbolj razširjena medonosna pasma na svetu (za italijansko): Koroška in Štajerska, Madžarska, Romunija, Hrvaška, Bosna in Hercegovina, Srbija — umetno naseljena tudi v Nemčiji in drugod.",
        textEn:
          "The second most widespread honey bee breed in the world (after the Italian): Carinthia and Styria, Hungary, Romania, Croatia, Bosnia and Herzegovina, Serbia — settled by man in Germany and beyond.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1882 → 1912",
        yearLabelEn: "1882 → 1912",
        sortYear: 1882,
        textSi:
          "Vas in čebela: Ivan Barle postavi šolski čebelnjak v Podzemlju (1882); Anton Žnideršič oblikuje AŽ-panj, Konrad Barle pa ga prinese v Belo krajino — metliška podružnica 1912.",
        textEn:
          "Village and bee: Ivan Barle sets a school apiary at Podzemelj (1882); Anton Žnideršič shapes the AŽ hive, and Konrad Barle carries it into Bela krajina — the Metlika branch of 1912.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "prica",
        yearLabelSi: "1734 → 1773",
        yearLabelEn: "1734 → 1773",
        sortYear: 1734,
        textSi:
          "Anton Janša, rojen 20. maja 1734 v Breznici na Gorenjskem, postane prvi učitelj čebelarstva na dunajski cesarski šoli (odredba Marije Terezije 1769); umre na Dunaju 1773.",
        textEn:
          "Anton Janša, born on 20 May 1734 at Breznica in Gorenjska, becomes the first teacher of beekeeping at the imperial school in Vienna (Maria Theresa's order of 1769); he dies in Vienna in 1773.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "20. 12. 2017",
        yearLabelEn: "20 December 2017",
        sortYear: 2017,
        textSi:
          "Generalna skupščina OZN soglasno potrdi slovenski predlog (pobuda Čebelarske zveze Slovenije): svetovni dan čebel vsako leto 20. maja — na Janšev rojstni dan.",
        textEn:
          "The UN General Assembly unanimously confirms Slovenia's proposal (the initiative of the Beekeeping Association of Slovenia): World Bee Day every 20 May — on Janša's birthday.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "present",
        sortYear: 2026,
        textSi:
          "Vsako pomlad znova leta nad istimi gribeljskimi vrtovi — edini živeči prebivalec zbirke. Glavna slika zapisa: delavka na begu pred panjem (Richard Bartz).",
        textEn:
          "Every spring she flies above the same Griblje gardens again — the collection's only living inhabitant. The record's main image: a worker at the hive entrance (Richard Bartz).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 4,
      },
    ],
  },
  {
    slug: "panjska-koncnica",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "sredina 18. st.",
        yearLabelEn: "mid-18th century",
        sortYear: 1750,
        textSi:
          "Najstarejše končnice na Gorenjskem in slovenskem Koroškem: deščica, ki zapira kranjič, postane platno — čebelar loči svoje panje od sosedovih, svetniki varujejo čebele.",
        textEn:
          "The oldest panels in Gorenjska and Slovene Carinthia: the board that closes the kranjič becomes a canvas — the beekeeper tells his hives from his neighbour's, the saints guard the bees.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1820 → 1880",
        yearLabelEn: "1820 → 1880",
        sortYear: 1820,
        textSi:
          "Zlata doba: k nabožnim prizorom se pridružijo posvetni — zgodovina, vojna, kmečki vsakdan, humor (mož iz gostilne, lisica brije lovca, kmečka tožba). Več kot 50.000 končnic.",
        textEn:
          "The golden age: religious scenes are joined by secular ones — history, war, farm life, humour (the man from the inn, the fox shaving the hunter, the farm lawsuit). More than 50,000 panels.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1821 → 1891",
        yearLabelEn: "1821 → 1891",
        sortYear: 1821,
        textSi:
          "Micka Pavlič iz Selc: delavnica, šablone s prašastimi barvami, katalog vsaj 141 motivov (71 nabožnih, 70 posvetnih); uči Petra Žmitka, umre 12. 9. 1891.",
        textEn:
          "Micka Pavlič of Selca: a workshop, stencils with powdered colour, a catalogue of at least 141 motifs (71 religious, 70 secular); she teaches Peter Žmitek and dies on 12 September 1891.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1891",
        yearLabelEn: "1891",
        sortYear: 1891,
        textSi:
          "Lovčev pogreb, naslikan na les v Mickinem smrtnem letu — glavna slika tega zapisa; hrani jo Slovenski etnografski muzej (inv. panjske-koncnice/630lju0017086).",
        textEn:
          "The Hunter's Funeral, painted on wood in the year of Micka's death — this record's main image; kept by the Slovene Ethnographic Museum (acc. panjske-koncnice/630lju0017086).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "po 1918",
        yearLabelEn: "after 1918",
        sortYear: 1918,
        textSi:
          "Slikanje starih končnic se v veliki meri konča po prvi svetovni vojni; kranjič umika lažjim panjem, končnice postanejo muzejski in zbirateljski predmet.",
        textEn:
          "The painting of the old panels largely ends after the First World War; the kranjič gives way to lighter hives, and the panels become museum and collectors' objects.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2018 → danes",
        yearLabelEn: "2018 → present",
        sortYear: 2018,
        textSi:
          "Poslikavanje panjskih končnic vpisano v Register nesnovne kulturne dediščine; reprodukcije med najbolj prepoznavnimi slovenskimi darili, poslikana čela pa še danes krasijo čebelnjake ob Kolpi.",
        textEn:
          "The painting of hive panels entered in the Register of Intangible Cultural Heritage; reproductions are among the most recognisable Slovene gifts, and painted fronts still adorn the apiaries by the Kolpa.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "joze-dular",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1915",
        yearLabelEn: "1915",
        sortYear: 1915,
        textSi: "Rojen v Vavti vasi; študij slavistike, romanistike in primerjalne književnosti, diploma 1941.",
        textEn: "Born in Vavta vas; studies of Slavistics, Romance studies and comparative literature, degree 1941.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1951 → 1981",
        yearLabelEn: "1951 → 1981",
        sortYear: 1951,
        textSi:
          "Trideset let direktor Belokranjskega muzeja v Metliki; pesnik nove romantike in pripovednik (Ljudje ob Krki, Jandre).",
        textEn:
          "Thirty years director of the Bela krajina museum in Metlika; poet of the new romanticism and storyteller (People by the Krka, Jandre).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1973",
        yearLabelEn: "1973",
        sortYear: 1973,
        textSi:
          "Belokranjsko muzejsko društvo — Dular kot ustanovni član in predsednik — postavi Županičevi spominsko ploščo v Gribljah; Dular o njej napiše knjižico.",
        textEn:
          "The Bela krajina museum society — Dular its founding member and president — raises Županič's memorial plaque in Griblje; Dular writes a booklet about it.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "2000 → danes",
        yearLabelEn: "2000 → present",
        sortYear: 2001,
        textSi:
          "Umre 31. januarja 2000; 2001 mu Belokranjsko muzejsko društvo postavi ploščo na hiši v Metliki, kjer je živel 53 let. Muzej išče njegovo knjižico o Županičevi plošči.",
        textEn:
          "He dies on 31 January 2000; in 2001 the museum society raises a plaque on his Metlika house, where he lived 53 years. The museum seeks his booklet on Županič's plaque.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "pisanice",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "od nekdaj",
        yearLabelEn: "time immemorial",
        sortYear: 1800,
        textSi:
          "Vsako pomlad risba z voskom in barvilom na lupini jajca — vzorci, ki se niso pisali, ampak pokazali.",
        textEn:
          "Every spring, drawing with wax and dye on the eggshell — patterns that were shown, not written.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "1893",
        yearLabelEn: "1893",
        sortYear: 1893,
        textSi:
          "Janko Barle objavi študijo Pisanice iz Bele Krajine v Izvestjih Muzejskega društva za Kranjsko — prva znanstvena obdelava šege.",
        textEn:
          "Janko Barle publishes the study Pisanice of Bela krajina in the Proceedings of the Museum Society for Carniola — the first scholarly treatment of the custom.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2012",
        yearLabelEn: "2012",
        sortYear: 2012,
        textSi:
          "Belokranjske pisanice so vpisane v Register nesnovne kulturne dediščine Slovenije — od države priznano znanje, ki se prenaša iz roda v rod.",
        textEn:
          "The pisanice of Bela krajina are entered in the Register of the Intangible Cultural Heritage of Slovenia — knowledge recognised by the state as passed down through generations.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Nosilke, med njimi Vesna Veselič iz Adlešičev, veščino ohranjajo živo; muzej vasi Griblje išče lastne vaze ornamentov in vaške pisarje pisanic.",
        textEn:
          "Bearers, among them Vesna Veselič of Adlešiči, keep the craft alive; the museum of Griblje seeks its own ornamental vases and the village painters of pisanice.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kresovanje",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "do 19. stoletja",
        yearLabelEn: "before the 19th century",
        sortYear: 1800,
        textSi:
          "Na večer pred sv. Janezom Krstnikom goreli kresi po gričih; ob ognju so se pele kresne pesmi — vsaka vas svojo.",
        textEn:
          "On St. John's eve bonfires burned on the hills; bonfire songs were sung at the flames — each village its own.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "konec 19. stoletja",
        yearLabelEn: "late 19th century",
        sortYear: 1895,
        textSi:
          "Matija Totter — Jandreč Matiček — za Janka Barleta popiše običaj kresovanja in besedilo kresne pesmi pozemeljske fare.",
        textEn:
          "Matija Totter — Jandreč Matiček — records for Janko Barle the bonfire custom and the text of the Podzemelj parish's bonfire song.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "20. stoletje",
        yearLabelEn: "20th century",
        sortYear: 1950,
        textSi:
          "V pozemeljski fari običaji ugasnejo; kot živa šega se kresovanje s pesmijo ohrani le še v Adlešiški fari.",
        textEn:
          "In the Podzemelj parish the customs go out; as a living rite the bonfire with its song survives only in the Adlešiči parish.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Adlešiški kres gori naprej; muzej vasi Griblje išče spomin na gribeljski kres — grič, kopico in kitico, če je bila.",
        textEn:
          "The Adlešiči fire burns on; the museum of Griblje seeks the memory of a Griblje bonfire — the hill, the pile and the verse, if there was one.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kuhanje-zganja",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "konec poletja",
        yearLabelEn: "late summer",
        sortYear: 1900,
        textSi:
          "Ko sadje dozori, kuharija — štil s kotlom, čelado in cevjo — hodi od domačije do domačije; kuhar vlada ognju in toku.",
        textEn:
          "When the fruit ripens, the still — the štil with kettle, helm and pipe — goes from farm to farm; the distiller rules the fire and the flow.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1949",
        yearLabelEn: "1949",
        sortYear: 1949,
        textSi:
          "Milko Matičetov fotografira kuhanje žganja v Ospu — etnografski posnetek, ki je danes javna last in dokument šege.",
        textEn:
          "Milko Matičetov photographs brandy distilling at Osp — an ethnographic image now public domain and a document of the custom.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Kuhanje poteka z dovoljenji po merilih; vonj po kuhani hruški ostaja. Muzej išče zadnjo gribeljsko kuharijo in njene merice.",
        textEn:
          "Distilling runs under licences and standards; the smell of cooked pear remains. The museum seeks the last Griblje still and its measures.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "loke-in-studenci",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "tisočletja",
        yearLabelEn: "millennia",
        sortYear: -8000,
        textSi:
          "Kolpa s poplavljanjem odlaga rodovitno ilovico in oblikuje loke; del vode ponika v apnenec in se vrača kot studenci.",
        textEn:
          "The Kolpa's floods lay down fertile clay and shape the loke; part of the water sinks into the limestone and returns as springs.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "kmečka leta",
        yearLabelEn: "the farming centuries",
        sortYear: 1800,
        textSi:
          "Loke so senožeti — zimska hrana živine; studenci napajališča in pralnice, kjer se vas srečuje z vodo, ki ne zmanjka.",
        textEn:
          "The loke are hayfields — winter feed; the springs watering places and wash-houses, where the village meets water that never fails.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "zadnja stoletja",
        yearLabelEn: "the last centuries",
        sortYear: 1900,
        textSi:
          "Jezovi na Kolpi spremenijo erozijo bregov, selitve rib in rastlinstvo — reka in njeni jezovi si preoblikujeta zgodbo.",
        textEn:
          "Weirs on the Kolpa change the erosion of banks, the migration of fish and plants — the river and its weirs reshape each other's story.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Loke so zatočišče biotske pestrosti in pašnik ekološkega kmetijstva; muzej zbira imena gribeljskih studencev.",
        textEn:
          "The loke are a refuge of biodiversity and the pasture of ecological farming; the museum collects the names of Griblje's springs.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "etimologija-gribljati",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1468",
        yearLabelEn: "1468",
        sortYear: 1468,
        textSi:
          "Prva pisana omemba vasi; ime iz staroslovanskega gribljati — brazdati, orati: spomin na prvi plug skozi gozd.",
        textEn:
          "The first written mention of the village; the name from the Old Slavic gribljati — to furrow, to plough: the memory of the first plough through the forest.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "urbarji",
        yearLabelEn: "the urbaria",
        sortYear: 1500,
        textSi:
          "V urbarjih in na najstarejšem zemljevidu Grüble — mala brazda; razlaga iz »groblje« (prod) se ne potrdi.",
        textEn:
          "In the urbaria and on the oldest map Grüble — the little furrow; the 'groblja' (gravel) explanation fails.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2001",
        yearLabelEn: "2001",
        sortYear: 2001,
        textSi:
          "Jože Šimec v Dolenjskem listu znanstveno obdela izvor imena vasi Griblje; članek navaja tudi Wikipedijina literatura.",
        textEn:
          "Jože Šimec treats scholarly the origin of the name of Griblje in Dolenjski list; the article is cited in Wikipedia's literature.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "vsako pomlad",
        yearLabelEn: "every spring",
        sortYear: 2026,
        textSi:
          "Vsak njivski brazdotični čas ime znova napiše; muzej išče posnetke urbarjev, kjer Grüble stoji.",
        textEn:
          "Every ploughing season writes the name anew; the museum seeks photographs of the urbaria where Grüble stands.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "td-griblje",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "21. stoletje",
        yearLabelEn: "21st century",
        sortYear: 2004,
        textSi:
          "Turistično društvo Griblje zrase ob koledarju vasi — Pasuljada sega vsaj v leto 2004 (16. izvedba 2019).",
        textEn:
          "The Griblje Tourist Society grows with the village calendar — the Pasuljada reaches back at least to 2004 (16th edition in 2019).",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "19. junij 2019",
        yearLabelEn: "19 June 2019",
        sortYear: 2019,
        textSi:
          "TD skupaj s krajevno skupnostjo pripravi srečanje vseh Gribeljcev po svetu ob 130-letnici šole.",
        textEn:
          "The TD, with the local community, prepares the reunion of Griblje people worldwide at the school's 130th anniversary.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Društvo drži poletni koledar (Pasuljada, Kavbojski žur, rally starodobnih koles z ustavljanjem v cerkvi in stari šoli) in nosi digitalni muzej vasi.",
        textEn:
          "The society holds the summer calendar (Pasuljada, Cowboy Party, vintage-bicycle rally with stops at the church and the old school) and carries the village's digital museum.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "gribeljci-po-svetu-2019",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1889 → 2019",
        yearLabelEn: "1889 → 2019",
        sortYear: 1889,
        textSi:
          "Šolo blagoslovijo novembra 1889; skozi njene klopi gre vse, kar ima vas — tudi tisti, ki bodo odšli po svet.",
        textEn:
          "The school is blessed in November 1889; through its benches passes everything the village has — including those who will go out into the world.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "19. junij 2019",
        yearLabelEn: "19 June 2019",
        sortYear: 2019,
        textSi:
          "Ob 130-letnici se vrneta vsi Gribeljci po svetu; sedanji in nekdanji učenci pokažejo, kako je bilo v klopeh nekoč in kako danes.",
        textEn:
          "At the 130th anniversary all the world's Griblje people return; present and former pupils show how the benches once were and how they are today.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Šola šteje 17 učencev in je edina slovenska vas s lastno podružnico; muzej išče seznam udeležencev srečanja 2019.",
        textEn:
          "The school counts 17 pupils and is the only Slovene village with its own branch school; the museum seeks the 2019 reunion's attendance list.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "ko-se-pticki-zenijo",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "od nekdaj",
        yearLabelEn: "time immemorial",
        sortYear: 1900,
        textSi:
          "Gregorjevo 12. marca: po vodi spustijo čolne in mline — gregorječek odplavi na jug in odpre pomladi pot.",
        textEn:
          "Gregorjevo on 12 March: boats and little mills are launched on the water — little Gregory sails south and opens the road for spring.",
        evidenceStatus: "TRADITION",
      },
      {
        stage: "prica",
        yearLabelSi: "15. marec 2026",
        yearLabelEn: "15 March 2026",
        sortYear: 2026,
        textSi:
          "PŠ Griblje in KS obudita običaj v gasilskem domu: učenci, skeč KTŠD Stari trg, Country Roses — in priznanja za najboljši kruh vaških pekaric.",
        textEn:
          "The Griblje school and local community revive the custom in the fire station hall: pupils, a sketch by the Stari trg drama group, Country Roses — and awards for the village bakers' best bread.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "naslednja leta",
        yearLabelEn: "the years ahead",
        sortYear: 2027,
        textSi:
          "Koledar, ki se je enkrat oglasil, upajo, da bo štel naprej; muzej išče recept zmagovalnega kruha 2026.",
        textEn:
          "A calendar that has spoken once, they hope, will keep counting; the museum seeks the recipe of the winning loaf of 2026.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "ciril-totter",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "19. stoletje → danes",
        yearLabelEn: "19th century → today",
        sortYear: 1873,
        textSi:
          "Domačija Jandrečih v Gribljah: osmih otrok, ki jih je plug spravil v svet — Matija v Teksas, Jakob v Minnesoto.",
        textEn:
          "The Jandreči homestead in Griblje: eight children whom the plough sent into the world — Matija to Texas, Jakob to Minnesota.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Ciril Totter z družino ekološko kmetuje na stari domačiji, predeluje na domu, opravlja storitve — in teče maratone.",
        textEn:
          "Ciril Totter and his family farm ecologically on the old homestead, process at home, run services — and run marathons.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "praznik-ks-2024",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "1941 → 2024",
        yearLabelEn: "1941 → 2024",
        sortYear: 1941,
        textSi:
          "September 1941: napad na italijanske mejne policiste shrani vas v vihar okupacije; spomin se prenaša tiho, desetletja.",
        textEn:
          "September 1941: the attack on the Italian border police plunges the village into the storm of occupation; the memory is carried quietly, for decades.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "15. september 2024",
        yearLabelEn: "15 September 2024",
        sortYear: 2024,
        textSi:
          "Prvi praznik KS po desetletjih: spomin na 1941, nagovor 89-letnega dr. Brinca z življenjskimi spomini, odprtje spominske sobe.",
        textEn:
          "The local community's first festival in decades: the memory of 1941, an address by the 89-year-old dr. Brinc with his life memories, the opening of the memorial room.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Spominska soba dr. Brinca v gasilskem domu hrani zgodbo dobrote (~200.000 € darov); muzej išče njen popis.",
        textEn:
          "The dr. Brinc memorial room in the fire station hall keeps the story of generosity (~€200,000 in gifts); the museum seeks its inventory.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "ljudje-ob-kolpi",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "2020-ta",
        yearLabelEn: "2020s",
        sortYear: 2020,
        textSi:
          "Radio Odeon iz Črnomlja prične objavljati rubriko Ljudje ob Kolpi — življenjepisi obkolpskih osebnosti ob obletnicah.",
        textEn:
          "Radio Odeon of Črnomelj begins publishing the column People by the Kolpa — biographies of Kolpa-world figures on anniversaries.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Rubrika postane primarni vir te zbirke: Dragoš, Totterji, Barle, Dular, Gašperič, Kambič — vsak zapis citira svojo objavo.",
        textEn:
          "The column becomes this collection's primary source: Dragoš, the Totters, Barle, Dular, Gašperič, Kambič — each record cites its publication.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Muzej zbira arhiv rubrike: naslove, datume, predvajanja — radijski val ne pusti lista, zato je shranjevanje muzejsko dejanje.",
        textEn:
          "The museum collects the column's archive: titles, dates, airings — a radio wave leaves no leaf, so keeping it is a museum act.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "valvasor-1689",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1689",
        yearLabelEn: "1689",
        sortYear: 1689,
        textSi:
          "V Nürnbergu izide Die Ehre des Herzogthums Crain — štirje zvezki, 3532 strani, 528 bakrorezov; med njimi Črnomelj z okolico.",
        textEn:
          "Die Ehre des Herzogthums Crain appears in Nuremberg — four volumes, 3,532 pages, 528 copperplates; among them Črnomelj and surroundings.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "po 1689",
        yearLabelEn: "after 1689",
        sortYear: 1690,
        textSi:
          "Valvasor za knjigo zapravi premoženje — Bogenšperk proda, umre revno; dežela ostane zapisana, mož plačan.",
        textEn:
          "Valvasor spends his fortune on the book — sells Bogenšperk, dies poor; the land remains written down, the man paid for it.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Digitalizirani izvodi so prosti; muzej išče natančen citat o Črnomlju z okolico in ga bo dodal tej zbirki.",
        textEn:
          "Digitised copies are free; the museum seeks the exact passage on Črnomelj and surroundings and will add it to this collection.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "pecnica-susenje-sadja",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "19. stoletje → 1950ta",
        yearLabelEn: "19th century → 1950s",
        sortYear: 1850,
        textSi:
          "Pečnica za sušenje sadja stoji na skoraj vsaki domačiji Bele krajine: jeseni suši slive in jabolka v zimske pečene slive.",
        textEn:
          "A fruit-drying oven stands at nearly every Bela krajina farmstead: in autumn it dries plums and apples into the winter's baked plums.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 1,
      },
      {
        stage: "prica",
        yearLabelSi: "1928",
        yearLabelEn: "1928",
        sortYear: 1928,
        textSi:
          "Fran Vesel fotografira pečnico v Adlešičih: cela družina pri delu — ženske, moški, otroci ob lestvah.",
        textEn:
          "Fran Vesel photographs the oven at Adlešiči: a whole family at work — women, men, children by the ladders.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Muzej išče gribeljski primer: zadnjo pečnico v vasi, ime zadnje sušilke sliv in recept, pisan z dimom.",
        textEn:
          "The museum seeks the Griblje case: the village's last oven, the name of its last plum-drier, and a recipe written in smoke.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "stari-zemljevidi",
    phases: [
      {
        stage: "prica",
        yearLabelSi: "1468",
        yearLabelEn: "1468",
        sortYear: 1468,
        textSi:
          "Prvi zapis imena: Griblach na listini v arhivu; sledita Briglach (1490) in Griblah (1593).",
        textEn:
          "The name first written: Griblach on a document in the archive; Briglach (1490) and Griblah (1593) follow.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "nastanek",
        yearLabelSi: "1714",
        yearLabelEn: "1714",
        sortYear: 1714,
        textSi:
          "Nugiški kartograf Johann Baptist Homann po Valvasorjevem gradivu izdela Tabula Ducatus Carnioliae — vojvodina z Belo krajino na enem listu.",
        textEn:
          "The Nuremberg cartographer Johann Baptist Homann, from Valvasor's material, prepares the Tabula Ducatus Carnioliae — the duchy with Bela krajina on one sheet.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1843",
        yearLabelEn: "1843",
        sortYear: 1843,
        textSi:
          "Henrik Freyer izda Special-Karto vojvodine Kranjske — kartografski podvig, na katerem vsaka vas nosi svoje ime.",
        textEn:
          "Henrik Freyer publishes the Special-Karte of the Duchy of Carniola — a cartographic feat on which every village carries its name.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Izrez Freyerjeve Special-Karte z berljivim imenom vasi je našel pot v zbirko — kot glavna slika zapisa Griblje v številkah. Isti pogled se nadaljuje z orbite: posnetek ISS ostaja v virih tega zapisa.",
        textEn:
          "An excerpt of Freyer's Special-Karte with the village name legible has found its way into the collection — as the main image of the record Griblje in numbers. The same gaze continues from orbit: the ISS photograph remains among that record's sources.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "sd-griblje-sport",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "od 1980ih",
        yearLabelEn: "from the 1980s",
        sortYear: 1985,
        textSi:
          "Športno društvo Griblje nosi šport skozi vas: julijsko športno srečanje, mali nogomet, teki — več kot štiridesetletna tradicija.",
        textEn:
          "The Sports Society Griblje carries sport through the village: the July sports meeting, five-a-side football, runs — a tradition of more than forty years.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "2022",
        yearLabelEn: "2022",
        sortYear: 2022,
        textSi:
          "Na 26. ljubljanskem maratonu teče sedem tekačev ŠD Griblje; maratonsko razdaljo preteče Ciril Totter.",
        textEn:
          "At the 26th Ljubljana marathon seven ŠD Griblje runners race; Ciril Totter runs the full marathon distance.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2024",
        yearLabelEn: "2024",
        sortYear: 2024,
        textSi:
          "Peter Križan nastopi na svetovnem prvenstvu v triatlonu v Torremolinosu (27. mesto); na 28. maratonu spet sedmerica iz Gribelj.",
        textEn:
          "Peter Križan races at the triathlon world championship finals in Torremolinos (27th place); a seven from Griblje runs the 28th marathon again.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "belokranjska-nosa",
    phases: [
      {
        stage: "zivljenje",
        yearLabelSi: "19. stoletje",
        yearLabelEn: "19th century",
        sortYear: 1850,
        textSi:
          "Belokranjska noša je vsakdan in praznik v enem: dvodelna ženska obleka, moška platnena preprostost — oblačila, ki jih je šila domača roka.",
        textEn:
          "The Bela krajina costume is workday and feast in one: the two-part women's dress, the men's linen simplicity — clothes sewn by hands at home.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1928",
        yearLabelEn: "1928",
        sortYear: 1928,
        textSi:
          "Etnograf Stanko Vurnik izda študijo Peča — prvo znanstveno delo o belokranjski pokrivali; risbe kažejo vezavo.",
        textEn:
          "The ethnographer Stanko Vurnik publishes the study Peča — the first scholarly work on the Bela krajina head covering; its drawings show the binding.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Noša živi na Jurjevanju in dnevih narodnih noš; leta 2025 je Bela krajina osrednja gostja v Kamniku. Muzej išče gribeljsko družino v noši.",
        textEn:
          "The costume lives at Jurjevanje and the days of national costume; in 2025 Bela krajina was the central guest in Kamnik. The museum seeks a Griblje family in the dress.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "kanizarica",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1857",
        yearLabelEn: "1857",
        sortYear: 1857,
        textSi:
          "V Kanižarici pri Črnomlju odprejo rudnik rjavega premoga — industrijsko srce, ki bo utripalo sto štirideset let.",
        textEn:
          "At Kanižarica near Črnomelj a brown-coal mine opens — the industrial heart that will beat for one hundred and forty years.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1857–1997",
        yearLabelEn: "1857–1997",
        sortYear: 1900,
        textSi:
          "Moški z vse Bele krajine se vsak dan spustijo pod zemljo; ob jami zraste kolonija rudarskih hiš, Perkmandeljc pa straži rov.",
        textEn:
          "Men from all over Bela krajina go underground every day; a colony of miners' houses grows by the pit, and the Perkmandelc guards the tunnel.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "2022",
        yearLabelEn: "2022",
        sortYear: 2022,
        textSi:
          "Občina Črnomelj muzejsko zbirko prenese na RIC Bela krajina: prenovljeni stolp, umetni rov — in iskanje gribeljskih rudarjev se nadaljuje.",
        textEn:
          "The municipality of Črnomelj hands the museum collection to RIC Bela krajina: the renewed tower, the artificial tunnel — and the search for Griblje miners goes on.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "sturm-1891",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1890",
        yearLabelEn: "1890",
        sortYear: 1890,
        textSi:
          "Dunajski Slovenec Josef Sturm naslika gribeljsko kmetijo in jo razstavi v Künstlerhausu — med desetimi spomeniki Kranjske za cesarsko enciklopedijo.",
        textEn:
          "The Viennese Slovene Josef Sturm paints the Griblje farmstead and exhibits it at the Künstlerhaus — among ten monuments of Carniola for the imperial encyclopedia.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1891",
        yearLabelEn: "1891",
        sortYear: 1891,
        textSi:
          "Bakrorez z napisom »Ein Einzelhof in Grible« izide v osmem zvezku Kronprinzenwerka z opisom: zid z obokanim vhodom, kamnito tlakovan dvorišče, nizko ognjišče v veži.",
        textEn:
          "The engraving 'Ein Einzelhof in Grible' appears in the eighth volume of the Crown Prince's work, with the description: the wall with its arched gateway, the stone-paved yard, the low hearth in the hall.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Digitalni muzej najde ploščo v ONB digitalizatu in jo postavi za najstarejši predmet zbirke — ter išče hišo s slike, če še stoji.",
        textEn:
          "The digital museum finds the plate in the ONB digitisation and sets it as the collection's oldest object — and seeks the house in the picture, if it still stands.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "gribeljski-zbul",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "19. stoletje",
        yearLabelEn: "the 19th century",
        sortYear: 1850,
        textSi:
          "Obkolpska polja postanejo znana po čebuli: žbul postane glavni denarni pridelek vasi, Gribljčanom pa se prilepi vzdevek žbularji.",
        textEn:
          "The fields by the Kolpa become known for the onion: the žbul becomes the village's main cash crop, and the nickname žbularji sticks to its people.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "2012",
        yearLabelEn: "2012",
        sortYear: 2012,
        textSi:
          "Pet Gribeljčank izda knjižico Gribeljski žbul — pridelovanje, spomini, recepti; študijski krožek nosi Društvo kmečkih žena Griblje.",
        textEn:
          "Five women of Griblje publish the booklet Gribeljski žbul — cultivation, memories, recipes; the study circle is carried by the Society of Farm Women of Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 3,
      },
      {
        stage: "danes",
        yearLabelSi: "vsako pomlad",
        yearLabelEn: "every spring",
        sortYear: 2026,
        textSi:
          "Učenci podružnične šole posadijo avtohtono čebulo na šolski gredici in jo avgusta poberejo — semenarna žbula je sredina vasi.",
        textEn:
          "The pupils of the branch school plant the autochthonous onion on the school bed and lift it in August — the seedbed of the žbul is the middle of the village.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "arheolosko-najdigsce-ob-kolpi",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "pribl. 4500 pr. n. št.",
        yearLabelEn: "c. 4500 BC",
        sortYear: -4500,
        textSi:
          "Prvi kmetje se naselijo na obkolpski ravnini: neolitske naselbine so začetek pet tisočletij življenja na istem tleh.",
        textEn:
          "The first farmers settle on the Kolpa floodplain: the Neolithic settlements begin five millennia of life on the same ground.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "od 2010",
        yearLabelEn: "from 2010",
        sortYear: 2010,
        textSi:
          "Izkopavanja v Varstvu spomenikov 46 in raziskave ARHAT (2011, 2021) ravnino potrdijo kot registrirano najdišče EŠD 10094.",
        textEn:
          "The excavations in Varstvo spomenikov 46 and the ARHAT research (2011, 2021) confirm the plain as the registered site EŠD 10094.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Njive obdelujejo plug, pod njimi pa ležijo naselbine, grobišče Požekov vrt, gomila in rimske naselbine — muzej išče črepinje in zgodbe o najdbah.",
        textEn:
          "The plough works the fields, and beneath them lie the settlements, the cemetery of Požekov vrt, the burial mound and the Roman settlements — the museum seeks sherds and stories of finds.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "jurjevo-v-gribljah",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1908",
        yearLabelEn: "1908",
        sortYear: 1908,
        textSi:
          "Objavljena fotografija sprevoda Zelenega Jurija — dokument, da je šega v pokrajini živela v vsej svoji podobi.",
        textEn:
          "A photograph of a Green George procession is published — a document that the custom lived in the region in its full figure.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "od nekdaj",
        yearLabelEn: "from old",
        sortYear: 1900,
        textSi:
          "Sprevod ob 24. aprili hodi od hiše do hiše: pesem v narečju, brezova vejica na vratih, jajca in sladkarije za sprevod.",
        textEn:
          "The procession of 24 April walks house to house: the song in dialect, the birch twig on the doors, eggs and sweets for the walkers.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        sortYear: 2026,
        textSi:
          "Podružnična šola splete koš iz brezja, posadi žbul in pošlje Zelenega Jurija po vasi — pesem se je ohranila z vsemi besedami.",
        textEn:
          "The branch school weaves the birch basket, plants the žbul and sends Green George through the village — the song has survived with all its words.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "mate-zupanic-svarski",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1885",
        yearLabelEn: "1885",
        sortYear: 1885,
        textSi:
          "Rojen v Gribljah v hiši vinskega trgovca Mikota Zupaniča-Švarskega; brat Niko je kasneje zapisal, da je hiša propadla z vinogradi.",
        textEn:
          "Born in Griblje in the house of the wine merchant Miko Zupanič-Švarski; his brother Niko later recorded that the house fell with the vineyards.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1903–1913",
        yearLabelEn: "1903–1913",
        sortYear: 1908,
        textSi:
          "Davčna uprava, beograjska Jugoslovanska korespondenca, trgovska akademija v Pragi in ravnateljstvo srbskih železnic — pot, ki jo je vodila jugoslovanska ideja.",
        textEn:
          "The tax administration, the Yugoslav Correspondence of Belgrade, the trade academy of Prague and the directorate of the Serbian railways — a road led by the Yugoslav idea.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1914–1917",
        yearLabelEn: "1914–1917",
        sortYear: 1914,
        textSi:
          "Prostovoljec pri Tankosiću, umik skozi Albanijo, Valona in Vido, Krf, Solunska fronta — in smrt v Nîmesu 27. aprila 1917.",
        textEn:
          "A volunteer with Tankosić, the retreat through Albania, Vlorë and Vido, Corfu, the Salonika front — and death at Nîmes on 27 April 1917.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "raziskava",
        yearLabelSi: "1917/1928",
        yearLabelEn: "1917/1928",
        sortYear: 1917,
        textSi:
          "Lavrinovi Balkanski soneti s ciklom Čas izidejo v Clevelandu; 1928 prenesijo ostanke na jugoslovansko pokopališče pri Parizu.",
        textEn:
          "Lavrin's Balkan Sonnets with the cycle Čas appear in Cleveland; in 1928 the remains are transferred to the Yugoslav cemetery near Paris.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2025",
        yearLabelEn: "2025",
        sortYear: 2025,
        textSi:
          "Radio Odeon v rubriki Ljudje ob Kolpi znova objavi celoten življenjepis — in zapis vstopi v zbirko.",
        textEn:
          "Radio Odeon's People by the Kolpa column republishes the full biography — and the record enters the collection.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "tobacka-leta",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "po 1945",
        yearLabelEn: "after 1945",
        sortYear: 1945,
        textSi:
          "Povojni strokovnjaki ugotovijo, da podnebje Bele krajine ustreza tobaku; sadike prinese ljubljanska Tobačna tovarna.",
        textEn:
          "Post-war experts find Bela krajina's climate suited to tobacco; the seedlings arrive from Ljubljana's Tobacco Factory.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1950–1980",
        yearLabelEn: "1950–1980",
        sortYear: 1960,
        textSi:
          "Burley zraste v vodilno poljščino v vaseh, kot so Griblje: rastline čez dva metra, trgatve z roko, sušenje na palicah.",
        textEn:
          "Burley grows into a leading crop in villages such as Griblje: plants past two metres, hand-picking, curing on sticks.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1980-ta",
        yearLabelEn: "the 1980s",
        sortYear: 1980,
        textSi:
          "Vrh proizvodnje: 70 belokranjskih kmetov goji tobak; v avtoričinem poročilu RTV je Bela krajina središče slovenske pridelave.",
        textEn:
          "The peak: seventy Bela krajina farmers grow tobacco; in RTV's reporter's account Bela krajina is the centre of Slovene production.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "po 1990",
        yearLabelEn: "after 1990",
        sortYear: 1990,
        textSi:
          "Cenejši tobak, upad kadilcev in zaprta tovarna umaknejo poljščino z njiv; fotografija gribeljskega polja še čaka.",
        textEn:
          "Cheaper tobacco, the decline of smokers and the closed factory withdraw the crop from the fields; a photograph of a Griblje field still waits.",
        evidenceStatus: "TO_COLLECT",
      },
    ],
  },
  {
    slug: "krizevo-pastirski-dan",
    phases: [
      {
        stage: "prica",
        yearLabelSi: "1890-ta",
        yearLabelEn: "the 1890s",
        sortYear: 1895,
        textSi:
          "Matija Totter-Jandreč zapiše pastirske navade ob križevem za Barleta in Županiča — običaj, ki je v fari kmalu zatem ugasnil.",
        textEn:
          "Matija Totter-Jandreč records the shepherds' ways of križevo for Barle and Županič — a custom that soon died out in the parish.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "raziskava",
        yearLabelSi: "~2020",
        yearLabelEn: "~2020",
        sortYear: 2020,
        textSi:
          "TD Griblje in kmečke žene obudijo pastirske igre na vaškem kopališču ob vnebohodu — posnel jih je Vaš Kanal.",
        textEn:
          "TD Griblje and the farm women revive the shepherds' games at the village pool at the Ascension — filmed by Vaš Kanal.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Pastirski dan ob Kolpi priredita sekcia Torpedo in Dragica Piškurič: pečena jajca, igre, vse generacije — Radio Odeon zapiše nov poglavje.",
        textEn:
          "A shepherds' day by the Kolpa is held by the Torpedo section and Dragica Piškurič: painted eggs, games, every generation — Radio Odeon writes the new chapter.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "razglednica-1903",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "22. 4. 1903",
        yearLabelEn: "22 Apr 1903",
        sortYear: 1903,
        textSi:
          "Fani Mežnaršič v Metliki napiše razglednico in jo pošlje gribeljski učiteljici — z zavrtkom o železnici, ki je vasi obšla.",
        textEn:
          "Fani Mežnaršič in Metlika writes a postcard and sends it to the Griblje schoolmistress — with a twist about the railway that bypassed the village.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "1914",
        yearLabelEn: "1914",
        sortYear: 1914,
        textSi:
          "Železnica doseže Gradac, šest kilometrov od vasi — Griblje ostanejo cestna vas, njihovi vlaki hodijo peš.",
        textEn:
          "The railway reaches Gradac, six kilometres from the village — Griblje remains a road village, its trains going on foot.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "raziskava",
        yearLabelSi: "2014/2023",
        yearLabelEn: "2014/2023",
        sortYear: 2014,
        textSi:
          "Zbiratelj Božidar Flajšman kartico objavi v knjigi o belokranjski progi (2014) in v rubriki Stara Metlika (2023).",
        textEn:
          "The collector Božidar Flajšman publishes the card in his book on the Bela krajina line (2014) and in the Old Metlika column (2023).",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Muzej razglednico vzame za najstarejši naslovljeni predmet, ki je vas dosegel po pošti; gribeljska razglednica še čaka v predalu.",
        textEn:
          "The museum takes the card as the oldest addressed item to reach the village by post; a Griblje postcard still waits in a drawer.",
        evidenceStatus: "DOCUMENTED",
      },
    ],
  },
  {
    slug: "dkz-griblje",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1996",
        yearLabelEn: "1996",
        sortYear: 1996,
        textSi:
          "Društvo kmečkih žena Griblje soizda knjižico o gribeljskem žbulu — pet avtoric zapiše zgodovino čebule, po kateri je vas slovela.",
        textEn:
          "The Griblje Farm Women's Society co-publishes the booklet on the Griblje žbul — five authors write the history of the onion that made the village famous.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "raziskava",
        yearLabelSi: "2012",
        yearLabelEn: "2012",
        sortYear: 2012,
        textSi:
          "Študijski krožek o žbulu izroči novo knjižico; znanje se preseli na gredico pred podružnično šolo.",
        textEn:
          "A study circle on the žbul hands over a new booklet; the knowledge moves to the bed before the branch school.",
        evidenceStatus: "DOCUMENTED",
      },
      {
        stage: "danes",
        yearLabelSi: "2020–2026",
        yearLabelEn: "2020–2026",
        sortYear: 2025,
        textSi:
          "Obudilke pastirskih iger na kopališču, Pozdrav pomladi s tekmovalno peko kruha in Viniškimi cür — drugi koledar vasi deluje.",
        textEn:
          "The revivers of the shepherds' games at the pool, the Spring Greeting with its competitive bread baking and the Viniške cür — the village's second calendar works.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "anton-brodaric",
    phases: [
      {
        stage: "prica",
        yearLabelSi: "2024",
        yearLabelEn: "2024",
        sortYear: 2024,
        textSi:
          "Anton Brodarič stopi na vrh Mera Peaka, 6.467 metrov — najvišja točka, ki jo je dosegel človek iz Gribelj.",
        textEn:
          "Anton Brodarič stands on the summit of Mera Peak, 6,467 metres — the highest point reached by a man of Griblje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2025",
        yearLabelEn: "2025",
        sortYear: 2025,
        textSi:
          "Sprejem v Domu krajanov s sedemdesetimi obiskovalci, občinsko priznanje in čajanka v Kovačnici sreče — vas povedala svojo Himalajo.",
        textEn:
          "A reception at the Dom krajanov with seventy visitors, the municipal recognition and a tea evening at the Kovačnica sreče — the village told its Himalaya.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
    ],
  },
  {
    slug: "novo-zivljenje-1914",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1914",
        yearLabelEn: "1914",
        sortYear: 1914,
        textSi:
          "Družba sv. Mohorja v Celovcu izda 68. zvezek Slovenskih večernic: povest Novo življenje, spisal Josip Kostanjevec — z dnem, ki se začne na malem griču, kjer čepi vas Griblje.",
        textEn:
          "The St. Hermagoras Society in Celovec issues the 68th volume of the Slovene Večernice: the tale Novo življenje, written by Josip Kostanjevec — with a day that begins on the small hill where the village of Griblje sits.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1914 → bralci",
        yearLabelEn: "1914 → its readers",
        sortYear: 1915,
        textSi:
          "Večernice, »za pouk in kratek čas«, nosijo gribeljsko zgodbo o šoli, oderuhu in posojilnici v slovenske hiše od Trsta do Prekmurja.",
        textEn:
          "The Večernice, \"for instruction and a short while\", carry the Griblje story of the school, the usurer and the savings-and-loan into Slovene houses from Trieste to Prekmurje.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Povest je v javni lasti: celotno besedilo stoji na Wikiviru, izvirni sken na Wikimedii — muzej pa je dobil svojo edino knjižno dogodivščino.",
        textEn:
          "The tale is in the public domain: the full text stands on Wikisource, the original scan on Wikimedia — and the museum has gained its only bookish adventure.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 2,
      },
    ],
  },
  {
    slug: "ilirska-carina-1809",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1809",
        yearLabelEn: "1809",
        sortYear: 1809,
        textSi:
          "Po Dunajskem miru dežele od Kranjske do Dalmacije sestavijo francoske Ilirske province; ob Kolpi zariše carinsko verigo inšpektorata Sisek — z Gribljami med postajami.",
        textEn:
          "After the Peace of Schönbrunn the lands from Carniola to Dalmatia form the French Illyrian Provinces; along the Kolpa it draws a customs chain of the Sisak inspectorate — with Griblje among the stations.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1812",
        yearLabelEn: "1812",
        sortYear: 1812,
        textSi:
          "Francoski geometri zarišejo meje provinc na zemljevid; Griblje na njem seveda ni — prevelike črte za tako majhno vas.",
        textEn:
          "French surveyors draw the provinces' borders on a map; Griblje, of course, is not on it — lines too large for so small a village.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 2,
      },
      {
        stage: "danes",
        yearLabelSi: "1813 → danes",
        yearLabelEn: "1813 → today",
        sortYear: 1813,
        textSi:
          "Province razpadejo, carinarnica izgine — a prehod ob Kolpi ostane: danes zunanja meja in hkrati schengenska odprtost. Imperiji so zunanja plast; reka je notranja.",
        textEn:
          "The provinces collapse, the customs post vanishes — yet the crossing on the Kolpa remains: today an external border and at the same time a Schengen openness. Empires are the outer layer; the river is the inner one.",
        evidenceStatus: "CORROBORATED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "tone-kralj-98",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "~1928",
        yearLabelEn: "c. 1928",
        sortYear: 1928,
        textSi:
          "V Gribljah se rodi Tone Kralj — generacija, ki je kot otrok še gledala prvo polovico 20. stoletja z vasi.",
        textEn:
          "Tone Kralj is born in Griblje — a generation that, as children, still watched the first half of the 20th century from the village.",
        evidenceStatus: "TESTIMONY",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "2026",
        yearLabelEn: "2026",
        sortYear: 2026,
        textSi:
          "Za 98. rojstni dan ga obiščejo Rdeči križ, borci za vrednote NOB in upokojenci Črnomlja; slavljenec še lušči lešnike, suši peteršilj in karta s pravnuki.",
        textEn:
          "For his 98th birthday he is visited by the Red Cross, the fighters for NOB values and the Črnomelj pensioners; the celebrant still shells hazelnuts, dries parsley and plays cards with his great-grandchildren.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "2028?",
        yearLabelEn: "2028?",
        sortYear: 2028,
        textSi:
          "Pred vrati je stoletnica — v vasi, ki je dala najstarejšega Slovenca. Muzej čaka januar 2028, da bi zapis dopolnil s praznovanjem.",
        textEn:
          "At the door stands the century — in a village that gave Slovenia its oldest man. The museum awaits January 2028 to enlarge the record with a celebration.",
        evidenceStatus: "TRADITION",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "obcina-griblje",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "1854",
        yearLabelEn: "1854",
        sortYear: 1854,
        textSi:
          "Po reformi iz leta 1848 dežela Kranjska šteje 501 občin; v okraju Črnomelj jih je 24 — med njimi Griblje, z županom, odborom in pečatom.",
        textEn:
          "After the reform of 1848 the land of Carniola counts 501 municipalities; the Črnomelj district holds 24 — among them Griblje, with a mayor, a board and a seal.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "1921",
        yearLabelEn: "1921",
        sortYear: 1921,
        textSi:
          "Ob popisu prebivalstva občina Griblje dobi svojo številko: 435 prebivalcev. Ureditev zdrži vse do prve svetovne vojne in še čez njo.",
        textEn:
          "At the census the Municipality of Griblje receives its number: 435 inhabitants. The arrangement endures until the First World War — and beyond it.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "prica",
        yearLabelSi: "11. 9. 1933",
        yearLabelEn: "11 Sept. 1933",
        sortYear: 1933,
        textSi:
          "Komasacija: iz 1069 dravskih občin nastane 377. Občina Griblje je razpuščena in priključena novi občini Adlešiči — skupaj s Tribuči in Zuniči.",
        textEn:
          "The amalgamation: from 1,069 Drava Banovina municipalities, 377 emerge. The Municipality of Griblje is dissolved and joined to the new Municipality of Adlešiči — together with Tribuče and Zuniči.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "21. 9. 1936",
        yearLabelEn: "21 Sept. 1936",
        sortYear: 1936,
        textSi:
          "Kraljevi ukaz (Sl. l. 78/36) iz občine Adlešiči izloči kraja Dragoši in Griblje ter ju priključi občini Gradac ob Lahinji — pod čigro streho vas ostane do vojne.",
        textEn:
          "A royal decree (Official Gazette 78/36) separates Dragoši and Griblje from the Adlešiči municipality and joins them to the Gradac municipality on the Lahinja — under whose roof the village stays until the war.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "1955 → danes",
        yearLabelEn: "1955 → today",
        sortYear: 1955,
        textSi:
          "Zrasla občina Črnomelj prevzame vas; ustava 1974 ji vrne del samostojnosti kot krajevno skupnost — danes sanira ceste in praznuje svoj praznik.",
        textEn:
          "The grown Municipality of Črnomelj takes over the village; the 1974 constitution returns part of its selfhood as a local community — today it repairs roads and celebrates its festival.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
    ],
  },
  {
    slug: "srednje-njive",
    phases: [
      {
        stage: "nastanek",
        yearLabelSi: "pozna bronasta doba",
        yearLabelEn: "Late Bronze Age",
        sortYear: -1000,
        textSi:
          "Na ravnini pri Gribljih stoji nižinska naselbina; nad njo se po vzorcu, ki ga zapiše Arheološki vestnik 71 (2020), dvigne gradišče Kučar.",
        textEn:
          "A lowland settlement stands on the plain at Griblje; above it, in the pattern recorded by Arheološki vestnik 71 (2020), rises the hillfort of Kučar.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "zivljenje",
        yearLabelSi: "2001",
        yearLabelEn: "2001",
        sortYear: 2001,
        textSi:
          "Philip Mason v Varstvu spomenikov 39 (str. 10) popisuje nižinske komplekse Bele krajine — naselbina pri Gribljih dobi ime po njivah: Srednje njive.",
        textEn:
          "Philip Mason, in Varstvo spomenikov 39 (p. 10), surveys the lowland complexes of Bela krajina — the settlement at Griblje takes its name from the fields: Srednje njive.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 1,
      },
      {
        stage: "danes",
        yearLabelSi: "2020",
        yearLabelEn: "2020",
        sortYear: 2020,
        textSi:
          "Recenzirani članek v Arheološkem vestniku 71 (str. 421–434) navedbo prevzame po imenu — vaška ravnina ima v strokovni literaturi imenovano poznobronastodobno naselbino.",
        textEn:
          "The peer-reviewed article in Arheološki vestnik 71 (pp. 421–434) takes over the note by name — the village plain has a named Late Bronze Age settlement in the scholarly literature.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
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
