import type {
  EvidenceStatus,
  ExhibitCategory,
  MuseumEventDTO,
  StoryDTO,
  SourceType,
} from "@/lib/types";

/**
 * SEME ZBIRKE — Muzej vasi Griblje.
 *
 * Vsa vsebina je dvojezična (SLO/EN). Vsak zapis nosi evidence status in
 * register virov. Vse fotografije so avtentični posnetki ali upodobitve z
 * Wikimedia Commons z navedbo avtorja in licence.
 */

type SeedSource = {
  key: string;
  nameSi: string;
  nameEn: string;
  sourceType: SourceType;
  license: string;
  url?: string;
  noteSi?: string;
  noteEn?: string;
};

type SeedExhibit = {
  slug: string;
  category: ExhibitCategory;
  titleSi: string;
  titleEn: string;
  periodSi: string;
  periodEn: string;
  summarySi: string;
  summaryEn: string;
  storySi: string;
  storyEn: string;
  evidenceStatus: EvidenceStatus;
  image?: string;
  imageCredit?: string;
  yearFrom?: number;
  yearTo?: number;
  lat?: number;
  lng?: number;
  coordsApprox?: boolean;
  featured?: boolean;
  sources: SeedSource[];
};

const WM = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const seedExhibits: SeedExhibit[] = [
  {
    slug: "griblje-vas",
    category: "kraj",
    titleSi: "Griblje — vas ob Kolpi",
    titleEn: "Griblje — a village on the Kolpa",
    periodSi: "1526 → danes",
    periodEn: "1526 → present",
    summarySi:
      "Razpotegnjena vas v občini Črnomelj na jugu Bele krajine, prvič izpričana leta 1526. Reka, vinogradi in meja že stoletja oblikujejo njen vsakdan.",
    summaryEn:
      "A linear village in the Municipality of Črnomelj in southern Bela krajina, first recorded in 1526. The river, the vineyards and the border have shaped its everyday life for centuries.",
    storySi:
      "Griblje ležijo na območju krajevne skupnosti Griblje v občini Črnomelj, na severnem robu doline Kolpe, ki je danes državna meja s Hrvaško. Naselje je v pisnih virih prvič izpričano leta 1526 — v času, ko je bila Bela krajina stoletje že stičišče dveh svetov: habsburške dežele in nevarne osmanske vojne krajine.\n\nGospodarstvo vasi so stoletja nosili poljedelstvo, živinoreja in vinogradništvo ob bližnjih legah; Kolpa pa je bila hkrati ribolovna, mlinarska in mejna reka. Po letu 1991 je postal tok ob reki zunanja meja samostojne Slovenije — vas pa je ostala na robu, ki je vedno znova postal tudi priložnost: danes so Griblje mirno izhodišče za kolesarjenje ob Kolpi in sprehode med belimi brezami, simbolom Bele krajine.\n\nVas ni enoten skupek hiš, ampak veriga zaselkov — Dolnje Griblje, Brinsko selo, Srednje Griblje in Gornje Griblje. Ime izhaja iz staroslovanske besede gribljati (brazdati, orati); v urbarjih in na najstarejšem zemljevidu se vas zapiše kot Grüble, ne Groble. Griblje z okolico so celo najbolj suh kot Bele krajine, z najmanj padavin na kvadratni meter na leto. Iz vasi izhajata tudi etnolog Niko Županič (1876–1961), ustanovitelj Slovenskega etnografskega muzeja, ki ima v zbirki svoj zapis, in Anton Filak, osmkratni udeleženec svetovnih prvenstev v oranju.",
    storyEn:
      "Griblje lies in the Griblje local community of the Municipality of Črnomelj, on the northern edge of the Kolpa valley, which is today the national border with Croatia. The settlement is first recorded in written sources in 1526 — at a time when Bela krajina had for centuries been a meeting point of two worlds: the Habsburg lands and the dangerous Ottoman frontier.\n\nThe village economy was carried for centuries by farming, livestock and viticulture on nearby slopes, while the Kolpa was at once a fishing, milling and border river. After 1991 the course of the river became the outer border of independent Slovenia — yet the village stayed on an edge that kept turning into opportunity: today Griblje is a quiet starting point for cycling along the Kolpa and walks among the white birches, the symbol of Bela krajina.\n\nThe village is not a single cluster of houses but a chain of hamlets — Dolnje Griblje, Brinsko selo, Srednje Griblje and Gornje Griblje. The name descends from the Old Slavic word gribljati (to furrow, to plough); in the urbars and on the oldest map the village is written Grüble, not Groble. Griblje and its surroundings are in fact the driest corner of Bela krajina, with the least precipitation per square metre a year. The village also produced the ethnologist Niko Županič (1876–1961), founder of the Slovene Ethnographic Museum, who has his own record in this collection, and Anton Filak, an eight-time participant in the world ploughing championships.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-vas.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    yearFrom: 1526,
    lat: 45.57246,
    lng: 15.29257,
    featured: true,
    sources: [
      {
        key: "wikipedija-griblje",
        nameSi: "Wikipedija: Griblje (prva omemba 1526, občina Črnomelj)",
        nameEn: "Wikipedia: Griblje (first mention 1526, Municipality of Črnomelj)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
      },
      {
        key: "commons-panorama",
        nameSi: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        nameEn: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Eleassar)",
        url: WM("Griblje,_%C4%8Crnomelj.jpg"),
        noteSi: "Avtentična fotografija vasi — glavna slika zapisa in naslovna fotografija muzeja.",
        noteEn: "Authentic photograph of the village — the record's main image and the museum's banner photograph.",
      },
      {
        key: "simec-ime",
        nameSi: "Jože Šimec: Izvor imena vasi Griblje, Dolenjski list, 11. januarja 2001",
        nameEn: "Jože Šimec: The origin of the name of Griblje, Dolenjski list, 11 January 2001",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Razlaga imena iz staroslovanske besede gribljati in oblika Grüble v urbarjih.",
        noteEn: "The explanation of the name from the Old Slavic gribljati and the form Grüble in the urbars.",
      },
    ],
  },
  {
    slug: "sveti-vid",
    category: "kraj",
    titleSi: "Cerkev sv. Vida",
    titleEn: "Church of St. Vitus",
    periodSi: "verska dediščina",
    periodEn: "religious heritage",
    summarySi:
      "Najbolj prepoznavna stavba v središču Gribelj: cerkev sv. Vida, verska in krajevna točka vasi.",
    summaryEn:
      "The most recognisable building in the centre of Griblje: the church of St. Vitus, the village's religious and local anchor.",
    storySi:
      "V središču naselja stoji cerkev sv. Vida, posvečena zavetniku, ki ga ljudski koledar pomni s pregovorom »od sv. Vida naprej sonce više vzhaja«. Stavba je versko središče krajevne skupnosti in najizrazitejša silhueta vasi — njena podoba je dokumentirana na fotografijah Wikimedia Commons.\n\nMuzej izrecno ločuje dokumentirano od nedokumentiranega: gradbena zgodovina cerkve (datacija, starejše faz) zaenkrat še čaka na arhivski vir. Ko bo najden, bo zapis dopolnjen in označen kot dokumentiran; do takrat je zapis oznake »preverjeno« vezan izključno na obstoj in lego stavbe.",
    storyEn:
      "In the centre of the settlement stands the church of St. Vitus, dedicated to the patron whom the folk calendar remembers with the saying \"from St. Vitus onward the sun rises higher.\" The building is the religious heart of the local community and the village's most striking silhouette — its appearance is documented in Wikimedia Commons photographs.\n\nThe museum explicitly separates the documented from the undocumented: the construction history of the church (its dating, earlier phases) still awaits an archival source. When one is found, the record will be amended and marked as documented; until then, the \"corroborated\" mark refers strictly to the building's existence and position.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/sveti-vid.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    lat: 45.5728,
    lng: 15.2922,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "commons-sv-vid",
        nameSi: "Wikimedia Commons: Griblje, Črnomelj — cerkev sv. Vida (avtor: Eleassar)",
        nameEn: "Wikimedia Commons: Griblje, Črnomelj — church of St. Vitus (author: Eleassar)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0",
        url: WM("Griblje%2C_%C4%8Crnomelj_-_cerkev_sv._Vida.jpg"),
      },
    ],
  },
  {
    slug: "uskoki-in-vojna-krajina",
    category: "kraj",
    titleSi: "Uskoki in Vojna krajina",
    titleEn: "The Uskoks and the Military Frontier",
    periodSi: "16. stoletje → 1881",
    periodEn: "16th century → 1881",
    summarySi:
      "Sredi 16. stoletja je meja ob Kolpi postala Vojna krajina — zatočišče Uskokov, beguncev pred Osmani, katerih potomci v Bojancih in Marindolu živijo še danes.",
    summaryEn:
      "In the mid-16th century the border along the Kolpa became the Military Frontier — a refuge of the Uskoks, refugees from the Ottomans, whose descendants still live in Bojanci and Marindol today.",
    storySi:
      "Vojna krajina (1460–1881) je bila obrambni pas ob najbolj izpostavljenem odseku avstrijsko-osmanske meje. V 16. stoletju so jo poselili Uskoki — begunci srbskega, hrvaškega in vlaškega porekla, ki so bežali pred turškimi vpadi; ob Kolpi jim je vladal senjski knez Nikola Frankopan.\n\nUskoški potomci so se naselili v vaseh ob reki — Bojanci, Marindol, Paunoviči — in ohranili pravoslavno vero ter svoje običaje do danes. Iz tega srečanja svetov je zrasel del belokranjske identitete: belokranjsko pogačo radi imenujejo »darilo Uskokov slovenskemu narodu«, spomin na vojnokrajiške čase pa nosi utrjena domačija Šokčev dvor v Žuničih. Leta 1881 je Vojna krajina prešla pod civilno upravo — meja ob Kolpi pa je ostala.",
    storyEn:
      "The Military Frontier (1460–1881) was a defensive belt along the most exposed section of the Austro-Ottoman border. In the 16th century it was settled by the Uskoks — refugees of Serbian, Croatian and Vlach origin fleeing the Turkish incursions; along the Kolpa they were ruled by the prince of Senj, Nikola Frankopan.\n\nThe Uskok descendants settled in villages along the river — Bojanci, Marindol, Paunoviči — and have kept their Orthodox faith and customs to this day. From this meeting of worlds grew part of the Bela krajina identity: the Bela krajina pogača is gladly called a \"gift of the Uskoks to the Slovene nation\", and the fortified Šokac homestead in Žuniči carries the memory of the frontier era. In 1881 the Military Frontier passed to civil administration — but the border along the Kolpa remained.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/bojanci-1908.jpg",
    imageCredit: "Foto: neznani avtor, 1908 · Wikimedia Commons · javna last",
    lat: 45.5018,
    lng: 15.2439,
    featured: false,
    sources: [
      {
        key: "wiki-vojna-krajina",
        nameSi: "Wikipedija: Vojna krajina (1460–1881)",
        nameEn: "Wikipedia: Vojna krajina (Military Frontier, 1460–1881)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Vojna_krajina",
      },
      {
        key: "wiki-bela-krajina",
        nameSi: "Wikipedija: Bela krajina (Uskoki, Vojna krajina, Šokčev dvor)",
        nameEn: "Wikipedia: Bela krajina (Uskoks, Military Frontier, Šokac homestead)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Bela_krajina",
      },
      {
        key: "delo-uskoki",
        nameSi: "Delo (2017): Potomci Uskokov ohranjajo vero in običaje",
        nameEn: "Delo (2017): The Uskok descendants keep their faith and customs",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.delo.si/",
      },
      {
        key: "commons-bojanci-1908",
        nameSi: "Wikimedia Commons: Bojanci in Bojanke, 1908",
        nameEn: "Wikimedia Commons: The people of Bojanci, 1908",
        sourceType: "fotografija",
        license: "Public domain (1908)",
        url: WM("Bojanci_in_Bojanke_1908.jpg"),
        noteSi: "Avtentični dokumentarni posnetek prebivalcev Bojancev v tradicionalni noši — glavna slika zapisa; Bojanci so približno 9 km jugozahodno od Gribelj.",
        noteEn: "Authentic documentary photograph of the people of Bojanci in traditional dress — the record's main image; Bojanci lies some 9 km south-west of Griblje.",
      },
      {
        key: "superhrana-pogaca",
        nameSi: "Naša superhrana: Belokranjska pogača — darilo Uskokov slovenskemu narodu",
        nameEn: "Naša superhrana: Bela krajina pogača — the Uskoks' gift to the Slovene nation",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.nasasuperhrana.si/",
      },
    ],
  },
  {
    slug: "sokcev-dvor",
    category: "kraj",
    titleSi: "Šokčev dvor v Žuničih",
    titleEn: "The Šokac homestead in Žuniči",
    periodSi: "stavbna dediščina ob Kolpi",
    periodEn: "built heritage along the Kolpa",
    summarySi:
      "Štiristranična zaprta kmečka domačija pri Adlešičih — danes muzej na prostem in kulturni spomenik lokalnega pomena ob reki Kolpi.",
    summaryEn:
      "A four-sided enclosed farmstead near Adlešiči — today an open-air museum and a cultural monument of local importance on the river Kolpa.",
    storySi:
      "Šokčev dvor v Žuničih je eden najznačilnejših in najbolje ohranjenih primerov ljudske stavbne dediščine ob Kolpi: štiristranična, zaprta kmečka domačija s kamnitim podom in leseno galerijo, kjer še danes visi koruza in ležijo drva ob steni.\n\nNjena zaprta, skoraj utrjena oblika je spomin na čase Vojne krajine, ko je bila vsaka domačija ob mejni reki tudi zatočišče. Danes je Šokčev dvor muzej na prostem v okviru Krajinskega parka Kolpa — obiskovalci si ga ogledajo ob predhodni najavi, sprejmejo pa jih v tradicionalnih belokranjskih nošah. Vas Žuniči pri Adlešičih je od Gribelj oddaljena približno 12 kilometrov.",
    storyEn:
      "The Šokac homestead in Žuniči is one of the most characteristic and best-preserved examples of the folk architecture along the Kolpa: a four-sided, enclosed farmstead with a stone ground floor and a wooden gallery, where maize still hangs and firewood rests against the wall.\n\nIts closed, almost fortified form is a memory of the Military Frontier era, when every farmstead on the border river was also a refuge. Today the Šokac homestead is an open-air museum within the Kolpa Landscape Park — visitors view it by prior appointment and are received in traditional Bela krajina dress. The village of Žuniči near Adlešiči lies roughly 12 kilometres from Griblje.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/sokcev-dvor.jpg",
    imageCredit: "Foto: Sl-Ziga · Wikimedia Commons · javna last",
    lat: 45.482,
    lng: 15.3607,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "kp-kolpa-sokcev",
        nameSi: "Krajinski park Kolpa — Šokčev dvor, Žuniči",
        nameEn: "Kolpa Landscape Park — the Šokac homestead, Žuniči",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.kp-kolpa.si/",
      },
      {
        key: "belokranjski-izdelki-sokcev",
        nameSi: "Belokranjski-izdelki.si — Šokčev dvor Žuniči, muzej na prostem",
        nameEn: "Belokranjski-izdelki.si — the Šokac homestead Žuniči, open-air museum",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://belokranjski-izdelki.si/",
      },
      {
        key: "commons-sokcev-dvor",
        nameSi: "Wikimedia Commons: Šokčev dvor, Žuniči",
        nameEn: "Wikimedia Commons: The Šokac homestead, Žuniči",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("SokcevDvor-Zunici.JPG"),
        noteSi: "Avtentična fotografija domačije — glavna slika zapisa.",
        noteEn: "Authentic photograph of the homestead — the record's main image.",
      },
    ],
  },
  {
    slug: "kolpa-reka",
    category: "kolpa",
    titleSi: "Kolpa — življenje ob reki",
    titleEn: "The Kolpa — life on the river",
    periodSi: "naravna dediščina",
    periodEn: "natural heritage",
    summarySi:
      "Reka, ob kateri ležijo Griblje: državna meja, kopališče, mlinarica in spomin. Kolpa velja za eno najtoplejših rek Slovenije.",
    summaryEn:
      "The river Griblje lies on: a national border, a bathing place, a millstream and a memory. The Kolpa is held to be one of the warmest rivers in Slovenia.",
    storySi:
      "Kolpa (hrvaško Kupa) izvira v Gorskem kotarju in po 297 kilometrih doseže Savo pri Sisku; večji del toka je slovensko-hrvaška meja. Ob Gribljah je reka mirna, plitva in poleti topla — poleti se voda pogosto segreje nad 25 °C, zato jo imajo za najtoplejšo slovensko reko in eno najbolj priljubljenih kopalnih rek v državi; kakovost vode na odseku Dragoši–Griblje redno spremlja državni monitoring kopalnih voda (merilno mesto K05010).\n\nV tisočletjih poplavljanja je reka ob bregovih ustvarila rodovitne travnike, ki se jim v Beli krajini reče loka; njena voda tu ponekod ponika v kraško podzemlje in se vrača v studencih ob obeh bregovih.\n\nReka je vasi dajala ribe, mlin in žago, s cerkvami na obeh bregovih pa tudi zgodbo o stiku in ločitvi. Danes ob njej vodi kolesarska pot, poleti pa se ob bregovih znova slišita skupni jezik in smeh.",
    storyEn:
      "The Kolpa (Croatian: Kupa) rises in Gorski Kotar and, after 297 kilometres, mostly as the Slovenian–Croatian border, reaches the Sava at Sisak. At Griblje the river is calm, shallow and warm in summer — in summer the water often climbs above 25 °C, which makes it Slovenia's warmest river and one of the country's favourite bathing rivers; water quality on the Dragoši–Griblje section is regularly monitored by the state bathing-water programme (measurement point K05010).\n\nOver millennia of flooding the river created fertile meadows along its banks, called loka in Bela krajina; its water here in places sinks into the karst underground and returns in the springs along both banks.\n\nThe river gave the village fish, a mill and a sawmill and, with churches on both banks, also a story of contact and separation. A cycling route runs along it today, and in summer both banks again carry the sounds of a shared language and laughter.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/kolpa.jpg",
    imageCredit: "Foto: Savinjc · Wikimedia Commons · CC BY-SA 3.0",
    lat: 45.5688,
    lng: 15.2988,
    featured: true,
    sources: [
      {
        key: "govsi-kolpa",
        nameSi: "GOV.SI — Profil kopalne vode Kolpa, Dragoši–Griblje (merilno mesto K05010)",
        nameEn: "GOV.SI — Kolpa bathing-water profile, Dragoši–Griblje (point K05010)",
        sourceType: "objava",
        license: "javna informacija / public information",
        url: "https://www.gov.si/",
      },
      {
        key: "commons-kolpa",
        nameSi: "Wikimedia Commons: Kolpa griblje (fotografija, avtor: Savinjc)",
        nameEn: "Wikimedia Commons: Kolpa griblje (photograph, author: Savinjc)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Savinjc)",
        url: WM("Kolpa_griblje.jpg"),
        noteSi: "Avtentična fotografija reke pri Gribljah — glavna slika zapisa.",
        noteEn: "Authentic photograph of the river at Griblje — the record's main image.",
      },
      {
        key: "belakrajina-kopanje",
        nameSi: "Bela krajina — kopanje na Kolpi (temperature vode po mesecih)",
        nameEn: "Bela krajina — swimming in the Kolpa (water temperatures by month)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.belakrajina.eu/",
        noteSi: "Podatki o temperaturi kopalne vode: junij 18–22 °C, julij 22–26 °C, avgust 21–25 °C.",
        noteEn: "Bathing-water temperature data: June 18–22 °C, July 22–26 °C, August 21–25 °C.",
      },
    ],
  },
  {
    slug: "malenca",
    category: "kolpa",
    titleSi: "Malenca na Kolpi",
    titleEn: "The malenca on the Kolpa",
    periodSi: "gospodarska dediščina",
    periodEn: "economic heritage",
    summarySi:
      "Mlinski jez z brušenjem na Kolpi pri Gribljah: priča o vodni tehniki, ki je nekoč poganjala mline in žage ob reki.",
    summaryEn:
      "A mill weir with a drop on the Kolpa at Griblje: a witness to the water engineering that once powered mills and saws along the river.",
    storySi:
      "Beseda malenca označuje mali jez oziroma zaporo z brusom, ki so jo mlinarji zgradili čez reko, da bi zajeli vodno silo. Na Kolpi pri Gribljah je ohranjen tak primer — slap in malenca — ki ga je fotografiral avtor švabo in je javno dokumentiran v Wikimedia Commons.\n\nMuzej objavlja to, kar ima: preverjeno fotografijo in splošno tipologijo. Natančna lega konkretne malence zaenkrat ni potrjena z zanesljivim virom, zato zemljevid zavestno ne riše te točke — koordinata, ki bi bila zgolj približek, ne bi bila resnična.",
    storyEn:
      "The word malenca denotes a small weir or dam with a drop that millers built across the river to capture the force of the water. On the Kolpa at Griblje such a example survives — a waterfall and weir — photographed by the author švabo and publicly documented in Wikimedia Commons.\n\nThe museum publishes what it has: a verified photograph and the general typology. The precise position of this particular malenca is not confirmed by a reliable source, so the map deliberately does not draw this point — a coordinate that would be a mere approximation would be a museum untruth.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/malenca.jpg",
    imageCredit: "Foto: švabo · Wikimedia Commons · CC BY 3.0",
    featured: false,
    sources: [
      {
        key: "commons-malenca",
        nameSi: "Wikimedia Commons: Slap in malenca na Kolpi pri Gribljah (avtor: švabo)",
        nameEn: "Wikimedia Commons: Waterfall and malenca on the Kolpa at Griblje (author: švabo)",
        sourceType: "fotografija",
        license: "CC BY 3.0 / GFDL",
        url: WM("Slap_in_malenca_na_Kolpi_pri_Gribljah.jpg"),
        noteSi: "Avtor in licenca preverjena na strani datoteke.",
        noteEn: "Author and licence verified on the file page.",
      },
    ],
  },
  {
    slug: "mlini-na-kolpi",
    category: "kolpa",
    titleSi: "Mlini ob Kolpi",
    titleEn: "Mills along the Kolpa",
    periodSi: "mlinarska dediščina ob reki",
    periodEn: "milling heritage on the river",
    summarySi:
      "Vodni mlini ob Kolpi — v Dolu, Radencih, Pobrežju in Krasincu — so stoletja mleli žito bližnjih vasi; danes so med zadnjimi pričami mlinarskega vsakdana.",
    summaryEn:
      "Water mills along the Kolpa — at Dol, Radenci, Pobrežje and Krasinec — ground the grain of nearby villages for centuries; today they are among the last witnesses of the millers' everyday life.",
    storySi:
      "Ob Kolpi in njenih pritokih so stoletja stale mline: ohranjeni urbarji jih navajajo v Dolu, Radencih, Pobrežju in Krasincu. Mlinar je bil vaški mojster — njegov jez, toča in kamnita korita so žito spremenila v moko, po kateri je vsaka hiša spekla svoj kruh.\n\nSledi mlinarstva segajo globoko v srednji vek: arheološke raziskave v strugi Lahinje pri Flekovem mlinu v Črnomlju so odkrile ostanke mlina iz 14. stoletja. Mlin s kamnito zajezitvijo v Bregu pri Sinjem vrhu so večkrat obnavljali prav zaradi njegovega pomena za mletje žita okolišnjih vasi. Ob Kolpi pri Gribljah mlinarsko dediščino zapira malenca — mali jez, ki ima v tej zbirki svoj zapis.",
    storyEn:
      "Along the Kolpa and its tributaries mills stood for centuries: the surviving urbars list them at Dol, Radenci, Pobrežje and Krasinec. The miller was the village craftsman — his weir, the drop and the stone troughs turned grain into the flour from which every household baked its bread.\n\nThe traces of milling reach deep into the Middle Ages: archaeological research in the bed of the Lahinja at Flekov mlin in Črnomelj uncovered the remains of a 14th-century mill. The mill with its stone weir at Breg pri Sinjem Vrhu was repeatedly restored precisely because of its importance for grinding the grain of the surrounding villages. On the Kolpa at Griblje the milling heritage is closed by the malenca — the small weir that has its own record in this collection.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/mlin-pobrezje.jpg",
    imageCredit: "Foto: švabo · Wikimedia Commons · CC BY-SA 3.0",
    lat: 45.5315,
    lng: 15.3119,
    featured: false,
    sources: [
      {
        key: "radio-odeon-mlini",
        nameSi: "Radio Odeon (2022): Mlini v Beli krajini po ohranjenih urbarjih",
        nameEn: "Radio Odeon (2022): Mills in Bela krajina according to the surviving urbars",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/",
      },
      {
        key: "researchgate-flekov-mlin",
        nameSi: "Arheološke raziskave v strugi Lahinje pri Flekovem mlinu (pozni srednji vek, 14. stoletje)",
        nameEn: "Archaeological research in the Lahinja riverbed at Flekov mlin (Late Middle Ages, 14th century)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.researchgate.net/",
      },
      {
        key: "kp-kolpa-breg",
        nameSi: "Krajinski park Kolpa — Mlin v Bregu pri Sinjem vrhu (kamnita pregrada)",
        nameEn: "Kolpa Landscape Park — the mill at Breg pri Sinjem Vrhu (stone weir)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.kp-kolpa.si/",
      },
      {
        key: "commons-mlin-pobrezje",
        nameSi: "Wikimedia Commons: Mlin Pobrežje — vodni mlin ob Kolpi (avtor: švabo)",
        nameEn: "Wikimedia Commons: Mlin Pobrežje — a water mill on the Kolpa (author: švabo)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: švabo)",
        url: WM("Mlin_Pobre%C5%BEje.jpg"),
        noteSi: "Avtentična fotografija mlina v Pobrežju ob Kolpi — glavna slika zapisa; Pobrežje je približno 5 km vzhodno od Gribelj.",
        noteEn: "Authentic photograph of the mill at Pobrežje on the Kolpa — the record's main image; Pobrežje lies some 5 km east of Griblje.",
      },
    ],
  },
  {
    slug: "niko-zupanic",
    category: "kraj",
    titleSi: "Niko Županič — kozmopolit iz Gribelj",
    titleEn: "Niko Županič — a cosmopolitan from Griblje",
    periodSi: "1876–1961",
    periodEn: "1876–1961",
    summarySi:
      "V Gribljah se je 1. decembra 1876 rodil Niko Županič — etnolog, antropolog, zgodovinar in politik, ustanovitelj današnjega Slovenskega etnografskega muzeja.",
    summaryEn:
      "Niko Županič — ethnologist, anthropologist, historian and politician, founder of today's Slovene Ethnographic Museum — was born in Griblje on 1 December 1876.",
    storySi:
      "Iz kmečke hiše v Gribljah na svetovna odra: ljudsko šolo je Niko Županič obiskoval v Podzemlju (1884–1887), gimnazijo v Novem mestu, leta 1903 pa doktoriral na dunajski univerzi iz zgodovine, prazgodovinske arheologije, etnologije in antropologije. Služboval je v Beogradu, med prvo svetovno vojno deloval v jugoslovanskem odboru, v Združenih državah navduševal izseljence za združitev Slovanov, na mirovni konferenci v Parizu leta 1919 pa skupaj z izumiteljem Mihajlom Pupinom dosegel, da Bled z okolico ni pripadel Italiji.\n\nLeta 1921 je v Ljubljani ustanovil Etnografski inštitut — današnji Slovenski etnografski muzej — in postal njegov prvi upravnik; leta 1927 je pričel izdajati Etnolog, prvo slovensko etnološko glasilo, leta 1940 pa zasedel novo ustanovljeno stolico za etnologijo na ljubljanski univerzi. Pred nemško zasedbo Ljubljane se je leta 1943 umaknil v rodno Belo krajino. Objavil je čez 200 razprav, knjig in člankov; umrl je leta 1961 v Ljubljani. Njegov portret je naslikal Ivan Vavpotič, spominsko ploščo pa ima v rojstni vasi — Slovenski etnografski muzej ga je ob 140. obletnici rojstva poimenoval »kozmopolit iz Gribelj«.",
    storyEn:
      "From a farmhouse in Griblje onto the world's stages: Niko Županič attended primary school in Podzemelj (1884–1887) and grammar school in Novo mesto, and in 1903 took his doctorate at the University of Vienna in history, prehistoric archaeology, ethnology and anthropology. He worked in Belgrade, served the Yugoslav Committee during the First World War, kindled the emigrants in the United States for the union of the South Slavs, and at the 1919 Paris Peace Conference, together with the inventor Mihajlo Pupin, helped secure that Bled and its surroundings did not pass to Italy.\n\nIn 1921 he founded the Ethnographic Institute in Ljubljana — today's Slovene Ethnographic Museum — and became its first director; in 1927 he launched Etnolog, the first Slovene ethnological journal, and in 1940 took the newly established chair of ethnology at the University of Ljubljana. Before the German occupation of Ljubljana he withdrew to his native Bela krajina in 1943. He published more than 200 studies, books and articles; he died in Ljubljana in 1961. His portrait was painted by Ivan Vavpotič, and a memorial plaque stands in his birth village — on his 140th birthday the Slovene Ethnographic Museum called him a \"cosmopolitan from Griblje\".",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/niko-zupanic.jpg",
    imageCredit: "Portret: Ivan Vavpotič, 1924 · Wikimedia Commons · javna last",
    yearFrom: 1876,
    yearTo: 1961,
    lat: 45.57246,
    lng: 15.29257,
    coordsApprox: true,
    featured: true,
    sources: [
      {
        key: "wiki-zupanic",
        nameSi: "Wikipedija: Niko Županič (1876–1961)",
        nameEn: "Wikipedia: Niko Županič (1876–1961)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Niko_%C5%BDupani%C4%8D",
      },
      {
        key: "sem-kozmopolit",
        nameSi: "Slovenski etnografski muzej: Niko Županič — kozmopolit iz Gribelj (razstava ob 140. obletnici rojstva)",
        nameEn: "Slovene Ethnographic Museum: Niko Županič — a cosmopolitan from Griblje (exhibition on his 140th birthday)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.etno-muzej.si/",
      },
      {
        key: "sbl-zupanic",
        nameSi: "Novak, Vilko: Županič Niko — Slovenski biografski leksikon (ZRC SAZU)",
        nameEn: "Novak, Vilko: Županič Niko — Slovene Biographical Lexicon (ZRC SAZU)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/",
      },
      {
        key: "kamra-plosca",
        nameSi: "Kamra: Spominska plošča univ. profesorju dr. Niku Županiču v Gribljah (2018)",
        nameEn: "Kamra: The memorial plaque to Prof. Niko Županič in Griblje (2018)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.kamra.si/",
      },
      {
        key: "commons-vavpotic-portret",
        nameSi: "Wikimedia Commons: Ivan Vavpotič — Niko Županič (oljni portret, 1924)",
        nameEn: "Wikimedia Commons: Ivan Vavpotič — Niko Županič (oil portrait, 1924)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Ivan_Vavpoti%C4%8D_-_Niko_%C5%BDupani%C4%8D.jpg"),
        noteSi: "Avtentična upodobitev — oljni portret, ki ga je leta 1924 naslikal Ivan Vavpotič; glavna slika zapisa.",
        noteEn: "An authentic likeness — the oil portrait painted by Ivan Vavpotič in 1924; the record's main image.",
      },
    ],
  },
  {
    slug: "snos-crnomelj-1944",
    category: "vojna",
    titleSi: "SNOS v Črnomlju — prvi slovenski parlament",
    titleEn: "SNOS in Črnomelj — the first Slovene parliament",
    periodSi: "19.–20. februar 1944",
    periodEn: "19–20 February 1944",
    summarySi:
      "V sokolskem domu v Črnomlju je februarja 1944 zasedal Slovenski narodnoosvobodilni svet — zasedanje, ki ga štejejo za temelj slovenske državnosti.",
    summaryEn:
      "In February 1944 the Slovene National Liberation Council met in the Sokol hall in Črnomelj — a session counted among the foundations of Slovene statehood.",
    storySi:
      "Po kapitulaciji Italije septembra 1943 je Bela krajina postala svobodno partizansko ozemlje — s šolami, tiskarnami in bolnišnicami. V tem prostoru je 19. in 20. februarja 1944 v Črnomlju zasedal Slovenski narodnoosvobodilni odbor, ki se je preimenoval v Slovenski narodnoosvobodilni svet (SNOS) in ustanovil svoj zakonodajni odbor.\n\nZasedanje imenujejo za »prvi slovenski parlament«: med vojno je SNOS deloval kot najvišji predstavniški organ slovenskega narodnoosvobodilnega gibanja in temelj kasnejše državnosti. Stavba sokolskega doma, v kateri je zasedal, je danes Kulturni dom Črnomelj; ob osemdesetletnici leta 2024 je mesto dogodek obeležilo z razstavo in spominsko slovesnostjo. Iz svobodne Bele krajine so spomladi istega leta vzletala tudi zavezniška letala s partizanskega letališča Otok — ta zgodba ima v zbirki svoj zapis.",
    storyEn:
      "After the Italian capitulation in September 1943, Bela krajina became free Partisan territory — with schools, print shops and hospitals. Within this free space, on 19 and 20 February 1944, the Slovene National Liberation Committee met in Črnomelj, renaming itself the Slovene National Liberation Council (SNOS) and establishing its legislative committee.\n\nThe session is called the \"first Slovene parliament\": during the war the SNOS acted as the highest representative body of the Slovene liberation movement and a foundation of later statehood. The Sokol hall in which it met is today the Črnomelj Culture House; on the eightieth anniversary in 2024 the town marked the event with an exhibition and a memorial ceremony. In the spring of the same year Allied aircraft also took off from the Otok partisan airfield in free Bela krajina — that story has its own record in this collection.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/snos-crnomelj.jpg",
    imageCredit: "Foto: Bb63lj · Wikimedia Commons · CC BY 4.0",
    yearFrom: 1944,
    yearTo: 1944,
    lat: 45.5738,
    lng: 15.1942,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "wiki-snos",
        nameSi: "Wikipedija: Slovenski narodnoosvobodilni svet (zasedanje v Črnomlju 1944)",
        nameEn: "Wikipedia: Slovene National Liberation Council (the 1944 Črnomelj session)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Slovenski_narodnoosvobodilni_svet",
      },
      {
        key: "rtvslo-snos",
        nameSi: "RTV Slovenija (2024): 80 let pozneje — kako je bil tedaj videti Črnomelj",
        nameEn: "RTV Slovenia (2024): 80 years on — what Črnomelj looked like then",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/",
      },
      {
        key: "delo-snos",
        nameSi: "Delo: Prvi slovenski parlament je zasedal v Črnomlju",
        nameEn: "Delo: The first Slovene parliament met in Črnomelj",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.delo.si/",
      },
      {
        key: "zgodovina-si",
        nameSi: "Zgodovinski portal zgodovina.si: V Črnomlju so gradili državnost (2024)",
        nameEn: "History portal zgodovina.si: Building statehood in Črnomelj (2024)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://zgodovina.si/",
      },
      {
        key: "commons-kulturni-dom",
        nameSi: "Wikimedia Commons: Kulturni dom Črnomelj (avtor: Bb63lj)",
        nameEn: "Wikimedia Commons: Črnomelj Culture House (author: Bb63lj)",
        sourceType: "fotografija",
        license: "CC BY 4.0 (avtor: Bb63lj)",
        url: WM("Kulturni_dom_%C4%8Crnomelj.jpg"),
        noteSi: "Avtentična fotografija stavbe, v kateri je zasedal SNOS — glavna slika zapisa.",
        noteEn: "Authentic photograph of the building in which the SNOS met — the record's main image.",
      },
    ],
  },
  {
    slug: "letalisce-otok-1944",
    category: "vojna",
    titleSi: "Partizansko letališče Otok",
    titleEn: "The Otok partisan airfield",
    periodSi: "1944 → 1945",
    periodEn: "1944 → 1945",
    summarySi:
      "Spomladi 1944 so partizani pri Otoku uredili letališče, s katerega so zavezniki v južno Italijo prepeljali 1473 ranjencev.",
    summaryEn:
      "In the spring of 1944 the Partisans laid out an airfield near Otok, from which the Allies flew 1,473 wounded to southern Italy.",
    storySi:
      "Na travniku ob vasi Otok pri Metliki so partizani spomladi 1944 uredili letališče za zavezniška letala. Zavezniki so tam prvič pristali 17. septembra 1944 — s petimi letali. Do konca vojne so s prostora ob Kolpi v zavezniške bolnišnice v južni Italiji prepeljali 1473 ranjencev; odpeljali so tudi zavezniške vojne ujetnike, med katerimi je bilo 87 britanskih letalcev, večinoma sestreljenih pilotov.\n\nDanes dogodek varuje spominski letalski Douglas C-47 Dakota, ki stoji pri Otoku na čast belokranjskima partizanskima letališčema. Konec marca 1945 so z bližnjega letališča Krasinec vzletala zadnja evakuacijska letala z ranjenci, posneti tudi pri Gribljah — ohranjena fotografija vkrcavanja ranjencev na letališču Otok je v javni domeni in je glavna slika tega zapisa.",
    storyEn:
      "On a meadow by the village of Otok near Metlika the Partisans laid out an airfield for Allied aircraft in the spring of 1944. The Allies first landed there on 17 September 1944 — with five aircraft. By the end of the war 1,473 wounded were flown from the ground by the Kolpa to Allied hospitals in southern Italy; Allied prisoners of war were also taken out, among them 87 British airmen, mostly downed pilots.\n\nToday the event is guarded by the memorial Douglas C-47 Dakota, which stands at Otok in honour of the Bela krajina partisan airfields. At the end of March 1945 the last evacuation aircraft with the wounded took off from the nearby Krasinec airfield, photographed also at Griblje — the surviving photograph of the wounded boarding at the Otok airfield is in the public domain and is this record's main image.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/otok-letalisce.jpg",
    imageCredit: "Foto: neznani avtor, 1944 · Wikimedia Commons · javna last",
    yearFrom: 1944,
    yearTo: 1945,
    lat: 45.665,
    lng: 15.323,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "rtvslo-otok",
        nameSi: "RTV Slovenija: V Otoku pri Metliki slovesnost v spomin medvojnega letališča",
        nameEn: "RTV Slovenia: A ceremony at Otok near Metlika in memory of the wartime airfield",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/",
      },
      {
        key: "wiki-otok-metlika",
        nameSi: "Wikipedija: Otok, Metlika (partizansko letališče 1944)",
        nameEn: "Wikipedia: Otok, Metlika (the 1944 partisan airfield)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Otok,_Metlika",
      },
      {
        key: "obk-dakota",
        nameSi: "Odkrijte Belo krajino: Douglas C-47 Dakota — spomenik partizanskima letališčema (1473 ranjencev)",
        nameEn: "Discover Bela krajina: Douglas C-47 Dakota — a monument to the partisan airfields (1,473 wounded)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.odkrijtebelokrajino.com/",
      },
      {
        key: "odeon-vranov-let",
        nameSi: "Radio Odeon: Spominska slovesnost Vranov let — partizansko letališče pri vasi Otok",
        nameEn: "Radio Odeon: The Vranov let memorial ceremony — the partisan airfield by the village of Otok",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/",
      },
      {
        key: "commons-otok-letalo",
        nameSi: "Wikimedia Commons: Zavezniško letalo med vkrcavanjem ranjencev na letališču Otok (1944)",
        nameEn: "Wikimedia Commons: An Allied aircraft loading the wounded at the Otok airfield (1944)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Zavezni%C5%A1ko_letalo_na_letali%C5%A1%C4%8Du_Otok.jpg"),
        noteSi: "Avtentična dokumentarna fotografija iz vojnega časa — glavna slika zapisa.",
        noteEn: "An authentic documentary photograph from the war years — the record's main image.",
      },
    ],
  },
  {
    slug: "evakuacija-1945",
    category: "vojna",
    titleSi: "Marec 1945: zavezniška letala nad Gribljami",
    titleEn: "March 1945: Allied aircraft over Griblje",
    periodSi: "Marec 1945",
    periodEn: "March 1945",
    summarySi:
      "Konec marca 1945 so zavezniška letala iz Bele krajine evakuirala ranjene partizane v Bari. Dve fotografiji, posneti pri Gribljah, sta med redkimi dokumenti te operacije.",
    summaryEn:
      "At the end of March 1945 Allied aircraft evacuated wounded Partisans from Bela krajina to Bari. Two photographs taken at Griblje are among the rare documents of that operation.",
    storySi:
      "Bela krajina je bila med drugo svetovno vojno eno najbolj svobodnih ozemelj okupirane Evrope — tu so delovale partizanske bolnišnice, šole in tiskarne. Konec marca 1945 se je nad njo zgodilo nekaj izjemnega: z improviziranega letališča Krasinec so zavezniška letala v dveh dneh evakuirala ranjence in težje bolne ter jih prepeljala v zavezniško bazo v Bari; RTV Slovenija je ob osemdesetletnici dogodka zapisala, da gre za eno največjih medvojnih evakuacij v tem delu Evrope.\n\nDve fotografiji iz tega časa sta posneti prav pri Gribljah: ranjeni partizani, ki opazujejo pristajanje letal, ter pogovor angleškega pilota s partizani. Snemalec prve je Franjo Veselko (1905–1977); posnetka sta v javni domeni. Muzej objavlja fotografiji kot dokument — vsak dodatni podatek (imenovane osebe, točen dan vzleta) bo dodan šele z arhivskim virom.",
    storyEn:
      "During the Second World War Bela krajina was one of the freest territories of occupied Europe — Partisan hospitals, schools and print shops operated here. At the end of March 1945 something extraordinary happened above it: from the improvised Krasinec airfield Allied aircraft evacuated the wounded and gravely ill over two days, flying them to the Allied base at Bari; on the operation's eightieth anniversary RTV Slovenija described it as one of the largest wartime evacuations in this part of Europe.\n\nTwo photographs from that time were taken precisely at Griblje: wounded Partisans watching the aircraft land, and an English pilot in conversation with Partisans. The author of the first is Franjo Veselko (1905–1977); both images are in the public domain. The museum publishes the photographs as documents — any additional detail (named persons, the exact day of take-off) will be added only with an archival source.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/evakuacija.jpg",
    imageCredit: "Foto: Franjo Veselko, marec 1945 · Wikimedia Commons · javna last",
    yearFrom: 1945,
    yearTo: 1945,
    featured: true,
    sources: [
      {
        key: "commons-1945-ranjenci",
        nameSi:
          "Wikimedia Commons: Ranjeni partizani opazujejo pristajanje zavezniških letal, Griblje pri Črnomlju, marec 1945 (avtor: Franjo Veselko)",
        nameEn:
          "Wikimedia Commons: Wounded Partisans watching Allied aircraft land, Griblje near Črnomelj, March 1945 (author: Franjo Veselko)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM(
          "Ranjeni_partizani_opazujejo_pristajanje_zavezni%C5%A1kih_letal%2C_Griblje_pri_%C4%8Crnomlju%2C_marec_1945.jpg"
        ),
      },
      {
        key: "commons-1945-pilot",
        nameSi:
          "Wikimedia Commons: Pogovor angleškega pilota s partizani, Griblje pri Črnomlju, marec 1945",
        nameEn:
          "Wikimedia Commons: An English pilot in conversation with Partisans, Griblje near Črnomelj, March 1945",
        sourceType: "fotografija",
        license: "Public domain (domnevno isti avtor)",
        url: WM(
          "Pogovor_angle%C5%A1kega_pilota_s_partizani%2C_Griblje_pri_%C4%8Crnomlju%2C_marec_1945.jpg"
        ),
      },
      {
        key: "rtvslo-2025",
        nameSi:
          "RTV Slovenija (2025): Nenavadna zgodba evakuiranih iz Bele krajine pred koncem vojne z zavezniškimi letali",
        nameEn:
          "RTV Slovenia (2025): The unusual story of those evacuated from Bela krajina before the end of the war by Allied aircraft",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/80-let-od-konca-2-svetovne-vojne/odmevi-preteklosti/nenavadna-zgodba-evakuiranih-iz-bele-krajine-pred-koncem-vojne-z-zavezniskimi-letali-v-dalmacijo/743207",
      },
    ],
  },
  {
    slug: "meja-1991",
    category: "vojna",
    titleSi: "Meja ob Kolpi",
    titleEn: "The border on the Kolpa",
    periodSi: "1991 → danes",
    periodEn: "1991 → present",
    summarySi:
      "Reka kot državna meja: od novih mejnih kamnov leta 1991, čez žičnato ograjo begunške krize, do skupne schengenske Kolpe.",
    summaryEn:
      "A river as a national border: from the new border stones of 1991, past the wire fence of the refugee crisis, to a shared Schengen Kolpa.",
    storySi:
      "Ko je Slovenija leta 1991 postala samostojna država, je Kolpa iz reke med dvema republikama postala zunanja meja Evropi. Ob begunski (migrantski) krizi leta 2015 je bila ob reki pri Gribljah postavljena začasna varnostna ograja — njen videz je dokumentiral fotograf Hythlodot (Wikimedia Commons, CC BY-SA 4.0).\n\nZ vstopom Hrvaške v schengenski prostor (2023) je fizični pomen meje znova oslabel. Reka, ki je bila stoletje in pol meja, se je vrnila k starejši vlogi: skupna kopališča, skupni ribolov, skupna zgodba.",
    storyEn:
      "When Slovenia became an independent state in 1991, the Kolpa turned from a river between two republics into an external border of Europe. During the refugee crisis of 2015 a temporary security fence was erected along the river at Griblje — its appearance documented by the photographer Hythlodot (Wikimedia Commons, CC BY-SA 4.0).\n\nWith Croatia's entry into the Schengen area (2023) the physical meaning of the border weakened again. The river that spent a century and a half as a delimiter returned to an older role: shared beaches, shared fishing, a shared story.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/meja.jpg",
    imageCredit: "Foto: Hythlodot · Wikimedia Commons · CC BY-SA 4.0",
    yearFrom: 1991,
    lat: 45.5675,
    lng: 15.2995,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "commons-meja",
        nameSi: "Wikimedia Commons: Slovenian border fence in Griblje (avtor: Hythlodot)",
        nameEn: "Wikimedia Commons: Slovenian border fence in Griblje (author: Hythlodot)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0",
        url: WM("Slovenian_border_fence_in_Griblje.JPG"),
      },
    ],
  },
  {
    slug: "ribnik",
    category: "narava",
    titleSi: "Vaški ribnik",
    titleEn: "The village pond",
    periodSi: "narava in spomin",
    periodEn: "nature and memory",
    summarySi:
      "Miren vodni ekosistem v vasi: ribnik s travniki, kjer se zrcali tako nebo kot spomin domačinov.",
    summaryEn:
      "A calm aquatic ecosystem in the village: a pond with meadows, mirroring both the sky and the memories of the locals.",
    storySi:
      "Vaški ribnik je bil v tradicionalni vasi vodni rezervoar za živino, zatočišče ptic in rib ter krajevno »ogledalo«, v katerem se je vas videla sama. V Gribljah ribnik stoji še danes in je dokumentiran na posnetkih Wikimedia Commons; poleti ga obiskujejo kačji pastirji in race, pozimi pa se nanj naselita tišina in spomin.\n\nMuzej vabi domačine: vsak spomin na ribnik — drsanje, napajanje živine, ribolov krapov — bo zapisan kot pričevanje z imenom priče.",
    storyEn:
      "In the traditional village the pond was a water reservoir for livestock, a refuge for birds and fish, and the local \"mirror\" in which the village saw itself. The pond at Griblje still stands today and is documented in Wikimedia Commons photographs; in summer it is visited by dragonflies and ducks, in winter by the sleigh-run of memory.\n\nThe museum invites the locals: every memory of the pond — ice skating, watering livestock, carp fishing — will be recorded as a testimony carrying the witness's name.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/ribnik.jpg",
    imageCredit: "Foto: Uroš Novina · Wikimedia Commons · CC BY 2.0",
    lat: 45.5735,
    lng: 15.294,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "commons-ribnik",
        nameSi:
          "Wikimedia Commons: Pond at Griblje — ribnik za vasjo (fotografija, avtor: Uroš Novina)",
        nameEn:
          "Wikimedia Commons: Pond at Griblje — the pond behind the village (photograph, author: Uroš Novina)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (avtor: Uroš Novina)",
        url: WM("Pond_at_Griblje_(44612474114).jpg"),
        noteSi: "Avtentična fotografija gribeljskega ribnika — glavna slika zapisa.",
        noteEn: "Authentic photograph of the Griblje pond — the record's main image.",
      },
    ],
  },
  {
    slug: "belokranjska-hisa",
    category: "gospodarstvo",
    titleSi: "Belokranjska hiša",
    titleEn: "The Bela krajina house",
    periodSi: "19. stoletje",
    periodEn: "19th century",
    summarySi:
      "Skromna kmečka hiša Bele krajine: bela apnena podlaga, slamnata streha in črna kuhinja — dom, ki ga je »postavila revščina«.",
    summaryEn:
      "The modest farmhouse of Bela krajina: whitewashed clay walls, thatched roof and a black kitchen — a home \"built by poverty\".",
    storySi:
      "Tipična belokranjska hiša 19. stoletja je bila nizka, eno- ali dvoprostorčna stavba z apneno beljenimi stenami in streho iz ržene slame. Za najrevnejše je bila znana tudi polkoplje — delno vkopana, delno lesena bivalna enota, ki jo je zemlja varovala pred zimo in vročino.\n\nV hiši je gospodoval kruh: odprto ognjišče s črno kuhinjo, dim, ki je konzerviral slamo in les, ter hlev, kjer je v slabem vremenu stala živina. Ta tip gradnje je v slovenski etnografiji izpričan za vso Belo krajino — primeri v samih Gribljah čakajo na vaške fotografije in pričevanja, zato je zapis označen kot tradicija, ne kot dokumentiran vaški primer.",
    storyEn:
      "The typical Bela krajina house of the 19th century was a low one- or two-room building with lime-whitewashed walls and a roof of rye straw. For the poorest there was also the polkoplje — a dwelling half dug into the ground, part timber, whose earth protected against winter and heat alike.\n\nThe house was governed by bread: an open hearth with a black kitchen, smoke that preserved the straw and timber, and a shed where livestock stood in bad weather. This building type is attested for all of Bela krajina in Slovene ethnography — examples in Griblje itself await village photographs and testimonies, which is why the record is marked as tradition rather than a documented village case.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/stara-hisa.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    yearFrom: 1800,
    yearTo: 1899,
    featured: false,
    sources: [
      
      {
        key: "commons-stara-hisa",
        nameSi:
          "Wikimedia Commons: Črnomelj — stara hiša (fotografija, avtor: Eleassar)",
        nameEn:
          "Wikimedia Commons: Črnomelj — an old house (photograph, author: Eleassar)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Eleassar)",
        url: WM("%C4%8Crnomelj_-_stara_hi%C5%A1a.jpg"),
        noteSi:
          "Avtentična fotografija stavbe v Črnomlju (občina Gribelj) — glavna slika zapisa; prikazuje tipično lokalno arhitekturo, ne gribeljske domačije.",
        noteEn:
          "Authentic photograph of a building in Črnomelj (Griblje's municipality) — the record's main image; it shows typical local architecture, not a specific Griblje farmstead.",
      },
      {
        key: "etnografija",
        nameSi: "Slovenska etnografska literatura o kmečki hiši Bele krajine (tipologija)",
        nameEn: "Slovene ethnographic literature on the Bela krajina farmhouse (typology)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Tipologija je dokumentirana; vaški primeri v Gribljah še čakajo na vire.",
        noteEn: "The typology is documented; village examples in Griblje still await sources.",
      },
    ],
  },
  {
    slug: "vino-in-crnina",
    category: "gospodarstvo",
    titleSi: "Vinogradništvo in metliška črnina",
    titleEn: "Viticulture and metliška črnina",
    periodSi: "19. stoletje → danes",
    periodEn: "19th century → present",
    summarySi:
      "Vinogradi na apnenčastih legah Bele krajine dajejo cviček in metliško črnino — vino z zajamčeno tradicionalno oznako.",
    summaryEn:
      "Vineyards on the limestone slopes of Bela krajina yield cviček and metliška črnina — a wine with a protected traditional denomination.",
    storySi:
      "Vinska ruta Bele krajine vodi od Metlike proti Semiču, Vinici in Dragatušu; Griblje stoji ob njenem južnem robu. Beline in modra frankinja, laški rizling in gamay — sorte, ki dajejo cviček — lahkotno belokranjsko namizno vino — tukaj uspevajo na rdeči prsti preko apnenca.\n\nKrona regije je metliška črnina PTP, zajamčena tradicionalna oznaka: temnejše vino iz rdečih sort z belimi, katerih zgodovina sega v 19. stoletje. Prva ustekleničena metliška črnina je leta 1968 prišla iz metliške kleti — od takrat slovi kot vino, ki Belo krajino predstavlja po vsej državi. Kadar so vinogradniki jeseni nosili grozdje v zidnice — kamnite vaške kleti — se je v vasi zvrstelo delo, smeh in vonj mošta. Muzej bo to zgodbo dopolnil z imeni gribeljskih domačij-vinogradov, ko jih bodo domačini sami vpisali.",
    storyEn:
      "The wine route of Bela krajina runs from Metlika towards Semič, Vinica and Dragatuš; Griblje stands at its southern edge. Blaufränkisch and Blaufränkisch crossings, Welschriesling, gamay and the varieties that yield cviček — the light Bela krajina table wine — thrive here on red soil over limestone.\n\nThe crown of the region is metliška črnina PTP, a protected traditional denomination: a darker wine made from the metliška pomace blend and white varieties, with a history reaching into the 19th century. When the winegrowers carried their grapes into the zidnice — the stone village cellars — in autumn, the village filled with work, laughter and the smell of must. The museum will add the names of Griblje's wine farms when the locals themselves enter them.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/ravnace.jpg",
    imageCredit: "Foto: Andrejj · Wikimedia Commons · CC BY-SA 4.0 · Ravnace pri Metliki",
    yearFrom: 1800,
    featured: false,
    sources: [
      
      {
        key: "commons-ravnace",
        nameSi:
          "Wikimedia Commons: Ravnace pri Metliki — vas in vinogradi (fotografija, avtor: Andrejj)",
        nameEn:
          "Wikimedia Commons: Ravnace near Metlika — village and vineyards (photograph, author: Andrejj)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (avtor: Andrejj)",
        url: WM("Ravnace.jpg"),
        noteSi:
          "Avtentična fotografija vinske pokrajine Bele krajine — glavna slika zapisa; vinogradi Ravnac so 10 km zahodno od Gribelj.",
        noteEn:
          "Authentic photograph of the wine landscape of Bela krajina — the record's main image; the Ravnace vineyards lie 10 km west of Griblje.",
      },
      {
        key: "mkgp",
        nameSi:
          "Register zajamčenih tradicionalnih oznak vin (metliška črnina PTP) — Ministrstvo za kmetijstvo, gozdarstvo in prehrano",
        nameEn:
          "Register of protected traditional wine denominations (metliška črnina PTP) — Ministry of Agriculture, Forestry and Food",
        sourceType: "objava",
        license: "javna informacija / public information",
        url: "https://www.gov.si/",
      },
      {
        key: "ovinu-crnina",
        nameSi: "Vinska klet Metlika — metliška črnina PTP (prva ustekleničena leta 1968)",
        nameEn: "Metlika Wine Cellar — metliška črnina PTP (first bottled in 1968)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.ovinu.si/",
        noteSi: "Izredni pomen za razvoj belokranjskega vinogradništva ima leta 1968 ustekleničena prva metliška črnina.",
        noteEn: "The first bottled metliška črnina of 1968 was of extraordinary importance for the development of Bela krajina viticulture.",
      },
    ],
  },
  {
    slug: "jurjevanje",
    category: "sege",
    titleSi: "Jurjevanje in pustovanje",
    titleEn: "Jurjevanje and carnival customs",
    periodSi: "spomladansko koledarsko leto",
    periodEn: "spring calendar year",
    summarySi:
      "Zeleno mladino »jurjev« nosijo po vaseh Bele krajine; pomlad najavijo maske, zvoncek in vejice brez.",
    summaryEn:
      "The green youth of the \"jurji\" is carried through the villages of Bela krajina; masks, bells and birch twigs announce the spring.",
    storySi:
      "Na jurjevo, 24. aprila, ko se »zemlja odpre«, po Beli krajini hodijo jurji — odrasli v zelenju brez in drugih dreves, z rdeče-belimi rutami in zvončki, ki z bučenjem pregnajo zimo. Ob njih pustujejo tudi lame in race, kožuhaste maske z rogovi, ki so v razlagah etnografov ostanki predkrščanske koledarske simbolike.\n\nJurjevanje je danes živ primer nematerialne dediščine: od 1990-ih v Črnomlju poteka festival Jurjevanje v Beli krajini, najstarejši folklorni festival v Sloveniji in največji prikaz slovenskega ljudskega ustvarjanja. V Gribljah so jurji hodili iz hiše v hišo — kdaj točno in kdo je bil zadnji jurij, muzej še ne ve: zapišite nam ga.",
    storyEn:
      "On St. George's Day, 24 April, when the earth \"opens\", the jurji walk through Bela krajina — figures dressed in the greenery of birch and other trees, with red-and-white scarves and bells, drumming winter away. Alongside them carnival figures like the lame and race — horned fur masks that ethnographers read as remnants of pre-Christian calendar symbolism.\n\nToday jurjevanje is a living example of intangible heritage: since the 1990s the town of Črnomelj has hosted the Jurjevanje v Beli krajini festival, the oldest folklore festival in Slovenia and the largest showcase of Slovene folk creativity. In Griblje the jurji walked from house to house — when exactly, and who was the last jurij, the museum does not yet know: write it down for us.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/jurjevanje.jpg",
    imageCredit: "Foto: Wikimedia Commons (1908) · javna last",
    featured: false,
    sources: [
      
      {
        key: "commons-jurij-1908",
        nameSi:
          "Wikimedia Commons: Iz jubilejskega sprevoda 1908 — zeleni Jurij in belokranjska svatba",
        nameEn:
          "Wikimedia Commons: From the 1908 jubilee procession — Zeleni Jurij and the Bela krajina wedding group",
        sourceType: "fotografija",
        license: "Public domain (1908)",
        url: WM(
          "Iz_jubilejskega_sprevoda_-_Kranjska_skupina_-_fanfaristi%2C_banderij%2C_zeleni_Jurij%2C_belokranjska_svatba_1908.jpg"
        ),
        noteSi:
          "Avtentični dokumentarni posnetek iz leta 1908 — glavna slika zapisa; ne prikazuje Gribelj samih.",
        noteEn:
          "Authentic documentary photograph from 1908 — the record's main image; it does not depict Griblje itself.",
      },
      {
        key: "crnomelj-jurjevanje",
        nameSi: "Občina Črnomelj — festival Jurjevanje v Beli krajini",
        nameEn: "Municipality of Črnomelj — the Jurjevanje v Beli krajini festival",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.crnomelj.si/",
      },
    ],
  },
  {
    slug: "belokranjska-kuhinja",
    category: "sege",
    titleSi: "Belokranjska kuhinja",
    titleEn: "Bela krajina cuisine",
    periodSi: "dediščina okusa",
    periodEn: "a heritage of taste",
    summarySi:
      "Pogača sčedno posipana s kumarji, matevž iz fižola, pustni salenjaki in medlica: revščina, ki je postala kultura okusa.",
    summaryEn:
      "Caraway-sprinkled flatbread, bean matevž, carnival salenjaki and honey medlica: a poverty that became a culture of taste.",
    storySi:
      "Belokranjska kuhinja je kuhinja kruha in žit: belokranjska pogača — okrogel kruh s kuminovim posipom — je postala zaščitni znak regije: kot jed dobrodošlice, ki se lomi z rokami in ne reže, je bila leta 2011 vpisana med evropske zajamčene tradicionalne posebnosti. Ponedeljkov matevž iz rjavega fižola pa je nosil delovni teden. Ob pustu so doma kuhali salenjake — v listju ali v ponvi —, velikonočna jajca pa barvali z naravnimi barvami suhih rastlin, kot jih pozna pokrajina.\n\nPijača praznikov je bila medlica — hladilna pijača iz medu in vode — ter potica, nadevana z orehmi z lastnega vrta. Muzejska zbirka kuhinje se bo gradila iz receptov vaških gospodinj: prvi je že vpisan v zgodbah, ostale čakajo.",
    storyEn:
      "Bela krajina cuisine is a cuisine of bread and grain: the Bela krajina pogača — a round flatbread with a caraway crust — has become the region's trademark: as a welcome dish that is broken by hand and never cut, it was entered among the European guaranteed traditional specialities in 2011. Monday's matevž of brown beans carried the working week. At carnival the households baked salenjaki — on leaves or in the oven — and Easter eggs were dyed with the natural colours of dried plants, as the region knows them.\n\nThe sweet of the holidays was medlica — a cooling drink of honey and water — and potica, layered with walnuts from one's own garden. The museum's kitchen collection will be built from village recipes: the first is already entered among the stories, the rest are awaited.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/pogaca.jpg",
    imageCredit: "Foto: Rude · Wikimedia Commons · CC BY-SA 3.0",
    featured: false,
    sources: [
      
      {
        key: "commons-pogaca",
        nameSi:
          "Wikimedia Commons: Belokranjska pogača (fotografija, avtor: Rude)",
        nameEn:
          "Wikimedia Commons: Belokranjska pogača (photograph, author: Rude)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Rude)",
        url: WM("Belokranjska_pogaca.jpg"),
        noteSi: "Avtentična fotografija jedi — glavna slika zapisa.",
        noteEn: "Authentic photograph of the dish — the record's main image.",
      },
      {
        key: "eu-ztp-pogaca",
        nameSi: "Registracija belokranjske pogače kot zajamčene tradicionalne posebnosti v EU (2011)",
        nameEn: "The registration of the Bela krajina pogača as a European guaranteed traditional speciality (2011)",
        sourceType: "objava",
        license: "javna informacija / public information",
        url: "https://www.nasasuperhrana.si/",
        noteSi: "Evropska komisija je konec leta 2011 v Uradnem listu EU objavila uredbo o registraciji — skupaj z idrijskimi žlikrofi in prekmursko gibanico.",
        noteEn: "At the end of 2011 the European Commission published the registration regulation in the Official Journal of the EU — alongside the Idrija žlikrofi and the Prekmurje gibanica.",
      },
      {
        key: "kuhinja-etno",
        nameSi: "Slovenska etnografska in kulinarična literatura o jedeh Bele krajine",
        nameEn: "Slovene ethnographic and culinary literature on the dishes of Bela krajina",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Jedi so del žive regija; vaški recepti bodo zapisani kot pričevanja.",
        noteEn: "The dishes are part of the living region; village recipes will be recorded as testimonies.",
      },
    ],
  },
  {
    slug: "tkalstvo",
    category: "gospodarstvo",
    titleSi: "Tkalstvo — platno na vaških statvah",
    titleEn: "Weaving — linen on village looms",
    periodSi: "19. stoletje → sredina 20.",
    periodEn: "19th century → mid-20th",
    summarySi:
      "Lan, konoplja in lesena statva: kako je nastajalo platno, ki je obleklo vas in postalo šiviljska industrija.",
    summaryEn:
      "Flax, hemp and the wooden loom: how the linen that clothed a village came into being and grew into a sewing industry.",
    storySi:
      "Vsako jesen so vasi Bele krajine potegnile lan in konopljo, pozimi predle, spomladi tkale. Lesena statva je stala v hiši — tkalja je predivo vpletala v platno s slehernim gibom roke, čolniček pa je prehajal med nitmi kot ritem. Iz platna so nastale rjuhe, srajce in nedrčke; oblečena je bila cela vas.\n\nKo se je domače platno umaknilo tovarniškemu, so roke tkalj našle delo v belokranjskih šiviljah — zgodba o platnu se je nadaljevala v zgodbo o konfekciji. Muzej išče statve, ki so stale v Gribljah: fotografija vaške statve bo prvi predmet te zbirke.",
    storyEn:
      "Every autumn the villages of Bela krajina pulled flax and hemp; they spun through the winter and wove in spring. The wooden loom stood in the \"house\" — the weaver wove the yarn into linen with each movement of her hand, and the shuttle passed between the threads like a rhythm. From the linen came sheets, shirts and chemises; the whole village was clothed in it.\n\nWhen homespun gave way to factory cloth, the weavers' hands found work in the sewing shops of Bela krajina — the story of linen continued as a story of ready-made clothing. The museum is looking for the looms that stood in Griblje: a photograph of a village loom will be the first object of this collection.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/predenje.jpg",
    imageCredit: "Foto: Fran Vesel, 1920 · Wikimedia Commons · javna last",
    yearFrom: 1800,
    yearTo: 1950,
    featured: false,
    sources: [
      
      {
        key: "commons-predenje",
        nameSi:
          "Wikimedia Commons: Predenje v Beli krajini, 1920 (fotograf: Fran Vesel)",
        nameEn:
          "Wikimedia Commons: Spinning in Bela krajina, 1920 (photographer: Fran Vesel)",
        sourceType: "fotografija",
        license: "Public domain (Fran Vesel, 1920)",
        url: WM("Predenje_v_Beli_krajini.jpg"),
        noteSi:
          "Avtentična etnografska fotografija predenja v Beli krajini — glavna slika zapisa; predenje je predstopnja tkalstva.",
        noteEn:
          "Authentic ethnographic photograph of spinning in Bela krajina — the record's main image; spinning precedes weaving.",
      },
      {
        key: "tkalstvo-etno",
        nameSi: "Slovenska etnografska literatura o predenju in tkalstvu na Dolenjskem in v Beli krajini",
        nameEn: "Slovene ethnographic literature on spinning and weaving in Lower Carniola and Bela krajina",
        sourceType: "objava",
        license: "navedi vir / cite the source",
      },
    ],
  },
  {
    slug: "storklje",
    category: "narava",
    titleSi: "Štorklje nad vasmi",
    titleEn: "Storks above the villages",
    periodSi: "pomlad → zgodnja jesen",
    periodEn: "spring → early autumn",
    summarySi:
      "Bela krajina je ena od slovenskih dežel bele štorklje: gnezda na dimnikih so znak vasi, ki je naravi pustila prostor.",
    summaryEn:
      "Bela krajina is one of the Slovene lands of the white stork: nests on chimneys mark a village that left room for nature.",
    storySi:
      "Bela štorklja se vrne iz Afrike konec marca in aprila — prav v čas, ko jurji naznanjajo pomlad. V Beli krajini gnezdi na dimnikih in drogovih, ob reki in mokriščih Kolpe išče hrano, avgusta in septembra pa se z mladiči odpravi na pot čez Balkan proti Afriki.\n\nVaška identiteta štorklje je izrecna: gnezdo na dimniku je čast, zato gnezda domačini varujejo in popravljajo. Muzej bo spremljal gnezda v Gribljah z vaškimi fotografi: vsako leto en posnetek, vsak posnetek en vir. Tako zbirka raste kot sam življenjski krog ptice.",
    storyEn:
      "The white stork returns from Africa at the end of March and in April — precisely when the jurji announce spring. In Bela krajina it nests on chimneys and poles, feeds by the river and wetlands of the Kolpa, and in August and September departs with its young across the Balkans towards Africa.\n\nThe village identity of the stork is explicit: a nest on one's chimney is an honour, so the households protect and repair the nests. The museum will follow the nests of Griblje with village photographers: one photograph a year, every photograph a source. Thus the collection grows like the bird's own life cycle.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/storklja.jpg",
    imageCredit: "Foto: fveronesi1 · Wikimedia Commons · CC BY-SA 4.0",
    featured: false,
    sources: [
      
      {
        key: "commons-storklja",
        nameSi:
          "Wikimedia Commons: White Stork — Slovenia (fotograf: fveronesi1)",
        nameEn:
          "Wikimedia Commons: White Stork — Slovenia (photographer: fveronesi1)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: fveronesi1)",
        url: WM("White_Stork_-_Slovenia_5P5A9266.jpg"),
        noteSi:
          "Avtentična fotografija štorklje v Sloveniji — glavna slika zapisa; gnezdo ni nujno v Gribljah.",
        noteEn:
          "Authentic photograph of a stork in Slovenia — the record's main image; the nest is not necessarily in Griblje.",
      },
      {
        key: "kp-kolpa",
        nameSi: "Krajinski park Kolpa — naravne vrednote in ptice selivke",
        nameEn: "Kolpa Landscape Park — natural values and migratory birds",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.kp-kolpa.si/",
      },
    ],
  },
  {
    slug: "bele-breze",
    category: "narava",
    titleSi: "Bele breze — drevo, ki je dalo ime pokrajini",
    titleEn: "White birches — the tree that named a region",
    periodSi: "dediščina pokrajine",
    periodEn: "a heritage of the landscape",
    summarySi:
      "Belina breza raste po celotni Beli krajini; po njej se imenujeta pokrajina in njen beli dan, po njej pa se tudi ločijo grice od roda.",
    summaryEn:
      "The white birch grows across all of Bela krajina; the region and its bright identity are named after it, and by it the meadows are told from the woods.",
    storySi:
      "Belina breza (Betula pendula) je pionirska drevesna vrsta, ki osvaja svetle gozdne robe in opuščene travnike — v Beli krajini je postala identiteta: »bela« pokrajine se razkriva ne le po apneno beljenih stenah hiš in belem kruhu, ampak tudi po beli skorji brez.\n\nJurji so se oblekli v njeno zelenje, iz njenega lesa so nastajali rogovi in korita, iz lubja pa obroči in zdravilni obkladki. Muzej ima brezo za enega od osrednjih motivov: obiskovalca vabimo, da fotografira eno samo brezo v Gribljah ob vsakem obisku — iz tisočih posnetkov bo nekoč nastala letna galerija vasi.",
    storyEn:
      "The silver birch (Betula pendula) is a pioneer tree that colonises bright forest edges and abandoned meadows — in Bela krajina it became an identity: the region's \"white\" reveals itself not only in the lime-whitened house walls and the white bread, but in the birch's white bark.\n\nThe jurji dressed in its greenery, its wood gave horns and troughs, and its bark yielded work and remedies. The museum takes the birch as one of its central motifs: visitors are invited to photograph a single birch in Griblje on every visit — one day, an annual gallery of the village will grow out of a thousand frames.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/breze.jpg",
    imageCredit: "Foto: Fran Vesel · Slovenski etnografski muzej · javna last",
    featured: false,
    sources: [
      
      {
        key: "commons-breze",
        nameSi:
          "Wikimedia Commons: Hiša med brezami (fotograf: Fran Vesel, Slovenski etnografski muzej)",
        nameEn:
          "Wikimedia Commons: A house among birches (photographer: Fran Vesel, Slovenian Ethnographic Museum)",
        sourceType: "fotografija",
        license: "Public domain (Fran Vesel)",
        url: WM("Hi%C5%A1a_med_brezami.jpg"),
        noteSi:
          "Avtentična etnografska fotografija bele breze v Sloveniji — glavna slika zapisa.",
        noteEn:
          "Authentic ethnographic photograph of white birches in Slovenia — the record's main image.",
      },
      {
        key: "kp-kolpa-2",
        nameSi: "Krajinski park Kolpa — bele breze kot simbol Bele krajine",
        nameEn: "Kolpa Landscape Park — white birches as the symbol of Bela krajina",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.kp-kolpa.si/",
      },
    ],
  },
];

export const seedStories: Omit<StoryDTO, "id">[] = [
  {
    kind: "ZGODBA",
    titleSi: "Zadnji poleti marca 1945",
    titleEn: "The last flights of March 1945",
    textSi:
      "Konec marca 1945 so se nad mogočno Kolpo prvič zaslišali težki motorji. Ranjenci, ki so meseci ležali v gozdnih bolnišnicah Belaje krajine, so se zbirali na poljani pri Gribljah: nekateri na nosilih, nekateri na rokah tovarišev. Ko je prvo letalo pristalo, se je dvignil prah; ko se je znova dvignilo, je bilo v njem že ducat rešenih.\n\nV dveh dneh so zavezniška letala s partizanskega letališča Krasinec odpeljala ranjence v Bari — operacija, ki jo RTV Slovenija pomni kot eno največjih evakuacij v tem delu Evrope. Fotografije, posnete pri Gribljah, so danes v javni domeni; na njih so obrazi, ki čakajo na imena.",
    textEn:
      "At the end of March 1945 heavy engines were heard above the Kolpa for the first time. The wounded who had spent months in the forest hospitals of Bela krajina gathered in the field by Griblje: some on stretchers, some in the arms of comrades. When the first aircraft landed, dust rose; when it rose again, a dozen of the saved were already aboard.\n\nOver two days Allied aircraft flew the wounded from the Partisan airfield at Krasinec to Bari — an operation RTV Slovenia remembers as one of the largest evacuations in this part of Europe. The photographs taken at Griblje are today in the public domain; in them are faces waiting for names.",
    attributionSi: "Obnovljeno po javnih virih: Wikimedia Commons, RTV Slovenija (2025)",
    attributionEn: "Rebuilt from public sources: Wikimedia Commons, RTV Slovenia (2025)",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 1,
  },
  {
    kind: "ZGODBA",
    titleSi: "Reka, ki ločuje in spaja",
    titleEn: "The river that divides and joins",
    textSi:
      "Kolpa je bila vedno meja — najprej med deželami, potem med republikama, nazadnje med Evropo in svetom. Leta 2015 se je na njenem bregu pri Gribljah prikazala ograja: bleda žica nad zeleno reko, fotografirana in kmalu zatem odstranjena.\n\nLeta 2023, ko je Hrvaška stopila v schengenski prostor, je reka spet postala tisto, kar je bila vselej: skupna. Otroci se v njej kopajojo, kolesarji se ob njej ustavljajo, ribiči z obeh bregov se poznajo po imenu. Meja se je umaknila; reka je ostala.",
    textEn:
      "The Kolpa was always a border — first between lands, then between republics, finally between Europe and the world. In 2015 a fence appeared on its bank at Griblje: pale wire above a green river, photographed and soon removed.\n\nIn 2023, when Croatia stepped into the Schengen area, the river became again what it had always been: shared. Children swim in it, cyclists stop beside it, anglers on both banks know each other by name. The border withdrew; the river remained.",
    attributionSi: "Obnovljeno po javnih virih: Wikimedia Commons, evropska poročila o schengenski razširitvi",
    attributionEn: "Rebuilt from public sources: Wikimedia Commons, European reports on the Schengen enlargement",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 2,
  },
  {
    kind: "NACELO",
    titleSi: "Šest kuratorskih načel",
    titleEn: "Six curatorial principles",
    textSi:
      "1. Vsak zapis ima izvor.\n2. Dokumentirano dejstvo ločujemo od pričevanja in spomina.\n3. Fotografija je predmet zbirke, ne samodejno dokaz vseh trditev o njej.\n4. Zbirka se gradi skupaj z ljudmi, ki poznajo vas.\n5. Osebne podatke objavljamo samo, kadar obstaja ustrezna podlaga in namen.\n6. Vsak zapis lahko kasneje dopolnimo, popravimo ali povežemo z novim virom.",
    textEn:
      "1. Every record has a source.\n2. We separate documented fact from testimony and memory.\n3. A photograph is an object of the collection, not automatic proof of every claim made about it.\n4. The collection is built together with the people who know the village.\n5. Personal data is published only where a proper basis and purpose exist.\n6. Every record can later be amended, corrected or linked to a new source.",
    attributionSi: "Kuratorska načela Muzeja vasi Griblje (2026)",
    attributionEn: "Curatorial principles of the Griblje Village Museum (2026)",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 3,
  },
  {
    kind: "RAZPIS",
    titleSi: "Prazna zbirka pričevanj — namenoma",
    titleEn: "The empty testimony collection — on purpose",
    textSi:
      "V tem muzeju ne boste našli izmišljenih izjav domačinov. Zbirka ustne zgodovine je prazna, ker jo nismo hoteli napolniti s prirejenimi spomini.\n\nČe vaši starši, stari starši ali vi poznate Griblje pred letom 1960 — kaj je bilo v hiši, kdo je hodil k mlinu, kdaj so hodili jurji — nam pišite. Zapisali bomo vaše besede, vaše ime in vaš datum; objavili jih bomo z vašim soglasjem. Tako pride pričevanje v muzej: po spoštljivi poti, ne po poti izmišljotin.",
    textEn:
      "You will not find invented statements by villagers in this museum. The oral-history collection is empty because we refused to fill it with fabricated memories.\n\nIf your parents, grandparents or you knew Griblje before 1960 — what stood in the house, who went to the mill, when the jurji walked — write to us. We will record your words, your name and your date; we will publish them with your consent. That is how testimony enters a museum: by the respectful path, not the path of invention.",
    attributionSi: "Odprti razpis Muzeja vasi Griblje — pričevanja zbiramo od 2026",
    attributionEn: "Open call of the Griblje Village Museum — collecting testimonies since 2026",
    evidenceStatus: "TO_COLLECT",
    sortOrder: 4,
  },
];

const eventDate = (iso: string) => new Date(`${iso}:12:00:00`).toISOString();

export const seedEvents: Omit<MuseumEventDTO, "id">[] = [
  {
    titleSi: "Dan odprtih vrat digitalnega muzeja",
    titleEn: "Open day of the digital museum",
    descriptionSi:
      "Prvi javni ogled nove digitalne zbirke: kako beremo evidence oznake, kako brskamo po zemljevidu in kako vsak domačin doda svoj vir.",
    descriptionEn:
      "The first public viewing of the new digital collection: how to read evidence marks, browse the map, and how every local adds their own source.",
    startsAt: eventDate("2026-10-04"),
    locationSi: "Griblje — pri cerkvi sv. Vida",
    locationEn: "Griblje — by the church of St. Vitus",
    eventType: "PRIREDITEV",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "Delavnica ustne zgodovine: zbiramo spomine Gribelj",
    titleEn: "Oral-history workshop: collecting the memories of Griblje",
    descriptionSi:
      "Učna delavnica za domačine: kako se posname pričevanje, kaj je soglasje in kako iz spomina nastane muzejski zapis.",
    descriptionEn:
      "A learning workshop for locals: how a testimony is recorded, what consent means, and how a memory becomes a museum record.",
    startsAt: eventDate("2026-10-18"),
    locationSi: "Griblje — vaška skupnost",
    locationEn: "Griblje — village community hall",
    eventType: "DELAVNICA",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "Vinogradniški sprehod: od grozdja do črnine",
    titleEn: "Vineyard walk: from grape to črnina",
    descriptionSi:
      "Vodeni sprehod po vinogradih ob robu vasi z degustacijo belokranjskih vin; zberemo fotografije zidnic za zbirko.",
    descriptionEn:
      "A guided walk through the vineyards at the village edge with a tasting of Bela krajina wines; we collect photographs of zidnice for the collection.",
    startsAt: eventDate("2026-10-25"),
    locationSi: "Griblje — vinogradi nad vasjo",
    locationEn: "Griblje — vineyards above the village",
    eventType: "VODENJE",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "82. obletnica zavezniške evakuacije — spominska pot",
    titleEn: "82nd anniversary of the Allied evacuation — memory walk",
    descriptionSi:
      "Spominski pohod po poteh ranjencev marca 1945: od gozda do poljane pri Gribljah, z branjem dokumentov zbirke.",
    descriptionEn:
      "A memorial walk along the paths of the wounded of March 1945: from the forest to the field at Griblje, with readings from the collection's documents.",
    startsAt: eventDate("2027-03-28"),
    locationSi: "Griblje — prihod bo natančen z viri",
    locationEn: "Griblje — details to be confirmed with sources",
    eventType: "VODENJE",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "Jurjevanje v Beli krajini",
    titleEn: "Jurjevanje in Bela krajina",
    descriptionSi:
      "Največji festival slovenskega ljudskega ustvarjanja v Črnomlju: jurji, maske, pesem in ples celotne regije.",
    descriptionEn:
      "The largest festival of Slovene folk creativity in Črnomelj: jurji, masks, song and dance of the whole region.",
    startsAt: eventDate("2027-04-25"),
    locationSi: "Črnomelj",
    locationEn: "Črnomelj",
    eventType: "PRIREDITEV",
    isExternal: true,
    externalUrl: "https://www.crnomelj.si/",
  },
];
