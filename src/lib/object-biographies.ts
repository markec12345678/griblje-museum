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
        yearLabelSi: "neznano",
        yearLabelEn: "unknown",
        textSi:
          "Kdaj in kako je cerkev sv. Vida zrasla na hribu nad vasjo, arhiv za zdaj ne pokaže — gradbeno zgodovino še iščemo.",
        textEn:
          "When and how the church of St. Vitus grew on the hill above the village, the archive does not yet show — its construction history is still being sought.",
        evidenceStatus: "TO_COLLECT",
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
        stage: "digitalizacija",
        yearLabelSi: "2010-ta",
        yearLabelEn: "2010s",
        sortYear: 2010,
        textSi:
          "Fotografija cerkve (avtor: Eleassar) na Wikimedia Commons izpriča obstoj in lego stavbe.",
        textEn:
          "A photograph of the church (author: Eleassar) on Wikimedia Commons attests the building's existence and position.",
        evidenceStatus: "DOCUMENTED",
        sourceIndex: 0,
      },
      {
        stage: "danes",
        yearLabelSi: "danes",
        yearLabelEn: "today",
        textSi:
          "Zapis nosi oznako »preverjeno« izključno za obstoj in lego; ko bo arhivski vir najden, se bo časovnica dopolnila.",
        textEn:
          "The record carries the »corroborated« mark strictly for existence and position; when an archival source is found, this timeline will be amended.",
        evidenceStatus: "CORROBORATED",
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
];

export function getBiography(slug: string): ObjectBiography | undefined {
  return OBJECT_BIOGRAPHIES.find((bio) => bio.slug === slug);
}

/** Ali ima zapis pripravljeno časovnico življenja? */
export function hasBiography(slug: string): boolean {
  return OBJECT_BIOGRAPHIES.some((bio) => bio.slug === slug);
}
