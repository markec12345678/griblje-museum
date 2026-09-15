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
    periodSi: "1468 → danes",
    periodEn: "1468 → present",
    summarySi:
      "Razpotegnjena vas v občini Črnomelj na jugu Bele krajine, prvič izpričana leta 1468 kot Griblach. Reka, vinogradi in meja že stoletja oblikujejo njen vsakdan.",
    summaryEn:
      "A linear village in the Municipality of Črnomelj in southern Bela krajina, first recorded in 1468 as Griblach. The river, the vineyards and the border have shaped its everyday life for centuries.",
    storySi:
      "Griblje ležijo na območju krajevne skupnosti Griblje v občini Črnomelj, na severnem robu doline Kolpe, ki je danes državna meja s Hrvaško. Naselje je v pisnih virih prvič izpričano leta 1468 — kot Griblach; sledita obliki Briglach (1490) in Griblah (1593), v urbarjih in na najstarejšem zemljevidu pa Grüble. Ime je torej starejše od skoraj vsega, kar danes v vasi stoji. Ko se je leta 1526 cerkev sv. Vida prvič zapisala v listine, je bila vas ob Kolpi že zrasla zgodovina — Bela krajina pa stoletje že stičišče dveh svetov: habsburške dežele in nevarne osmanske vojne krajine.\n\nGospodarstvo vasi so stoletja nosili poljedelstvo, živinoreja in vinogradništvo ob bližnjih legah; Kolpa pa je bila hkrati ribolovna, mlinarska in mejna reka. Kmečki letni krog je narekoval tudi prostor: njive v dolini ob reki, vinogradi na apnenčastih pobočjih nad vasjo, gozd na hribih, voda pa v ribniku za hišami — in v studencih ob Kolpi, kjer se podzemeljska voda vrača na dan. Reka je s poplavljanjem ustvarila tudi loki, rodovitne poplavne travnike; nad vasjo pa so kmetje po letu 1848 z vprežno živino izkrčili brezov gozd, v Goranji lokvi kopali glino za opeko, pri Rudni peči pa naleteli na železovo prst. Po letu 1991 je postal tok ob reki zunanja meja samostojne Slovenije — vas pa je ostala na robu, ki je vedno znova postal tudi priložnost: danes so Griblje mirno izhodišče za kolesarjenje ob Kolpi in sprehode med belimi brezami, simbolom Bele krajine.\n\nVas ni enoten skupek hiš, ampak veriga zaselkov — Dolnje Griblje, Brinsko selo, Srednje Griblje in Gornje Griblje. Izvor imena je med jezikoslovci odprto vprašanje: Marko Snoj navaja možnosti grib (goba), griba (gruda), besedo sorodno hrvaškemu griblja (brazda) in griva (travnata strmina); domača razlaga — gribljati, brazdati, orati — je ena od teh poti, ne edina. V urbarjih in na najstarejšem zemljevidu se vas zapiše kot Grüble, ne Groble. Griblje z okolico so celo najbolj suh kot Bele krajine, z najmanj padavin na kvadratni meter na leto — in demografsko živa: na popisu 2020 je štela 334 prebivalcev, leta 2026 jih statistični urad beleži 329 (zapis Griblje v številkah).\n\nDruga svetovna vojna je vas uvrstila v svobodno Belo krajino: marca 1945 so nad poljem pri Gribljah pristajala zavezniška letala in odnašala ranjence v Italijo — ta dogodek ima v zbirki svoj zapis. Iz vasi izhajata tudi etnolog Niko Županič (1876–1961), ustanovitelj Slovenskega etnografskega muzeja, ki ima prav tako svoj zapis, in Anton Filak, osmkratni udeleženec svetovnih prvenstev v oranju. Današnja vas je dom vinogradnikom, obiskovalcem reke in vsem, ki se vračajo k rodbinskim hišam — muzej pa z njimi zapisuje nadaljevanje.",
    storyEn:
      "Griblje lies in the Griblje local community of the Municipality of Črnomelj, on the northern edge of the Kolpa valley, which is today the national border with Croatia. The settlement is first recorded in written sources in 1526 — at a time when Bela krajina had for a century already been a meeting point of two worlds: the Habsburg lands and the dangerous Ottoman frontier.\n\nThe village economy was carried for centuries by farming, livestock and viticulture on nearby slopes, while the Kolpa was at once a fishing, milling and border river. The farming year dictated the geography too: fields in the valley by the river, vineyards on the limestone slopes above the village, woods on the hills, and water in the pond behind the houses — and in the springs along the Kolpa, where the underground water returns to daylight. The river's flooding also created the loki, the fertile flood meadows; above the village, after 1848, farmers cleared the birch woods with draft animals, dug clay for bricks at Goranja lokva, and struck iron-rich earth at Rudna peč. After 1991 the course of the river became the external border of independent Slovenia — yet the village stayed on an edge that kept turning into opportunity: today Griblje is a quiet starting point for cycling along the Kolpa and walks among the white birches, the symbol of Bela krajina.\n\nThe village is not a single cluster of houses but a chain of hamlets — Dolnje Griblje, Brinsko selo, Srednje Griblje and Gornje Griblje. The origin of the name remains an open question among linguists: Marko Snoj lists grib (a mushroom, a Boletus), griba (a clod of soil), a word related to Croatian griblja (a furrow), and griva (a grassy slope); the local explanation — gribljati, to furrow, to plough — is one of those paths, not the only one. In the urbars and on the oldest map the village is written Grüble, not Groble. Griblje and its surroundings are in fact the driest corner of Bela krajina, with the least precipitation per square metre a year — and demographically alive: the 2020 census counted 334 inhabitants, and in 2026 the statistical office records 329 (see the record Griblje in numbers).\n\nThe Second World War placed the village inside free Bela krajina: in March 1945 Allied aircraft landed on the field by Griblje and carried the wounded to Italy — an event with its own record in this collection. The village also produced the ethnologist Niko Županič (1876–1961), founder of the Slovene Ethnographic Museum, who likewise has his own record here, and Anton Filak, an eight-time participant in the world ploughing championships. Today's village is home to winegrowers, visitors of the river and everyone returning to their family houses — with them, the museum writes the continuation.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-vas.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    yearFrom: 1468,
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
      {
        key: "wiki-griblje-en-vas",
        nameSi: "Wikipedia (EN): Griblje (zgodovinska imena 1468–1593, etimologija po Snoju, župnija)",
        nameEn: "Wikipedia (EN): Griblje (historical names 1468–1593, etymology per Snoj, parish)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Griblje",
        noteSi: "Prvi pisni omembi vasi (Griblach 1468) in navedba Snojevega etimološkega slovarja.",
        noteEn: "The settlement's first written mentions (Griblach 1468) and the citation of Snoj's etymological dictionary.",
      },
      {
        key: "snoj-esim-vas",
        nameSi: "Marko Snoj: Etimološki slovar slovenskih zemljepisnih imen, Modrijan, Ljubljana 2009, str. 153",
        nameEn: "Marko Snoj: Etymological Dictionary of Slovene Place Names, Modrijan, Ljubljana 2009, p. 153",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Izvor imena Griblje kot jezikoslovno odprto vprašanje (grib, griba, griblja, griva).",
        noteEn: "The origin of the name Griblje as an open linguistic question (grib, griba, griblja, griva).",
      },
      {
        key: "crnomelj-ks-griblje",
        nameSi: "Občina Črnomelj — krajevna skupnost Griblje",
        nameEn: "Municipality of Črnomelj — the Griblje local community",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.crnomelj.si/",
        noteSi: "Uradna stran občine — prostor krajevne skupnosti Griblje.",
        noteEn: "The municipality's official site — the space of the Griblje local community.",
      },
      {
        key: "commons-griblje-kategorija",
        nameSi: "Wikimedia Commons: kategorija Griblje (razgledi vasi, cerkev, ribnik)",
        nameEn: "Wikimedia Commons: the Griblje category (village views, church, pond)",
        sourceType: "fotografija",
        license: "različne licence / various licenses (navedene pri posameznih datotekah)",
        url: "https://commons.wikimedia.org/wiki/Category:Griblje",
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
      "V središču naselja stoji cerkev sv. Vida, posvečena zavetniku, ki ga ljudski koledar pomni s pregovorom »od sv. Vida naprej sonce više vzhaja«. Stavba je versko središče krajevne skupnosti in najizrazitejša silhueta vasi — njena podoba je dokumentirana na fotografijah Wikimedia Commons.\n\nSveti Vid je zgodnjekrščanski mučenik iz časa Dioklecijanovih preganov; cerkev ga šteje med štirinajst svetih pomočnikov, ki naj bi pomagali v telesni stiski — posebej pri epilepsiji, ki so jo nekdaj imenovali »svetovidov ples«. Njegov praznik pada na 15. junij, takrat, ko je sonce visoko in ko se je v teh krajih začenjala žetev žit. Zavetnika sonca in poletja na hribu nad njivami kmečka vas ni izbrala naključno.\n\nVaška cerkev je bila stoletja tudi ura vasi: zvonjenje je klicalo k maši, opozarjalo na nevihto, slavilo praznike in pospremljalo pogrebe. Vsak zvon je imel svoj glas in svoj pomen; vaščani so jih znali razlikovati že po prvem udarcu. Kdor je znal poslušati, je vedel, kaj se vasi dogaja.\n\nCerkev sv. Vida v Gribljah je tudi zemljevid rodbin: okoli nje je pokopališče, kjer so generacije zapisale svoja imena v kamen. Za krajevni muzej so nagrobniki arhiv brez police — datumi, priimki, velike družine in prezgodaj odšli: cela demografija vasi na tisočih korakov.\n\nZdaj pa lahko ta zapis hodi naprej: cerkev je prvič zapisana v listinah leta 1526, sedanja stavba je iz osemnajstega stoletja, pripada pa župniji Podzemelj — tam hranijo tudi matične knjige Gribelj, rojstev, porok in smrti. Register nepremične kulturne dediščine cerkev vodi pod številko EŠD 2122. Notranja oprema in vizitacijski zapisi še čakajo na arhiv — ta vrzel ostaja odkrito priznana. Leta 2008 je vaška spominska knjiga zabeležila blagoslovitev in posvetitev novega zvona: zvonjenje, ki je bilo stoletja ura vasi, ima zapisan tudi svoj najnovejši dnev.\n\nTaka iskrenost je znamenje tega muzeja: raje priznamo vrzel, kot da bi jo zapolnili z domnevo.",
    storyEn:
      "In the centre of the settlement stands the church of St. Vitus, dedicated to the patron whom the folk calendar remembers with the saying \"from St. Vitus onward the sun rises higher.\" The building is the religious heart of the local community and the village's most striking silhouette — its appearance is documented in Wikimedia Commons photographs.\n\nSaint Vitus is an early Christian martyr of the Diocletian persecution; the Church counts him among the Fourteen Holy Helpers invoked in bodily distress — above all against epilepsy, once called \"St. Vitus' dance.\" His feast falls on 15 June, when the sun stands high and the grain harvest began in these parts. A patron of sun and summer, on a hill above the fields — a farming village did not choose him by accident.\n\nFor centuries the village church was also the village's clock: its bells called to mass, warned of storms, celebrated feasts and accompanied funerals. Every bell had its own voice and its own meaning; villagers could tell them apart by the first stroke. Whoever knew how to listen knew what was happening to the village.\n\nThe church of St. Vitus at Griblje is also a map of the families: around it lies the churchyard where generations wrote their names into stone. For a local museum the gravestones are an archive without shelving — dates, surnames, large families and those taken too soon: the whole demography of the village within a thousand steps.\n\nThis record can now step forward: the church first appears in documents in 1526, the present building is of the eighteenth century, and it belongs to the Parish of Podzemelj — where the parish registers of Griblje, of births, marriages and deaths, are kept. The heritage register lists the church under EŠD 2122. The interior furnishings and the visitation records still await the archive — that gap remains openly acknowledged. In 2008 the village memorial book recorded the blessing and consecration of a new bell: the ringing that was the village's clock for centuries has its newest chapter written down.\n\nSuch honesty is the mark of this museum: we would rather admit a gap than fill it with a guess.",
    evidenceStatus: "DOCUMENTED",
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
      {
        key: "wiki-sveti-vid",
        nameSi: "Wikipedija: sveti Vid (mučenik, štirinajst svetih pomočnikov, zavetništvo)",
        nameEn: "Wikipedia: Saint Vitus (martyr, Fourteen Holy Helpers, patronage)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Sveti_Vid",
        noteSi: "Življenje in zavetništvo sv. Vida — podlaga za razlago izbire zavetnika.",
        noteEn: "The life and patronage of St. Vitus — the basis for explaining the choice of patron.",
      },
      {
        key: "wiki-griblje-en-vid",
        nameSi: "Wikipedia (EN): Griblje (cerkev sv. Vida: prva omemba 1526, sedanja stavba 18. stoletja, župnija Podzemelj, EŠD 2122)",
        nameEn: "Wikipedia (EN): Griblje (St. Vitus's Church: first mention 1526, present building 18th century, Parish of Podzemelj, EŠD 2122)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Griblje",
        noteSi: "Datacija in župnijska pripadnost cerkve, navedeni po registru dediščine.",
        noteEn: "The church's dating and parish affiliation, cited from the heritage register.",
      },
      {
        key: "zvon-2008",
        nameSi: "Sv. Vid Griblje — blagoslovitev in posvetitev zvona, spominska knjiga, Griblje 2008",
        nameEn: "St. Vitus Griblje — the blessing and consecration of the bell, memorial book, Griblje 2008",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Vaška spominska knjiga ob blagoslovitvi novega zvona — najnovejše poglavje zvonjenja.",
        noteEn: "The village memorial book on the blessing of the new bell — the newest chapter of the ringing.",
      },
      {
        key: "commons-griblje",
        nameSi: "Wikimedia Commons: kategorija Griblje (razgledi vasi, cerkev, ribnik)",
        nameEn: "Wikimedia Commons: the Griblje category (village views, church, pond)",
        sourceType: "fotografija",
        license: "različne licence / various licenses (navedene pri posameznih datotekah)",
        url: "https://commons.wikimedia.org/wiki/Category:Griblje",
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
      "Vojna krajina (1460–1881) je bila obrambni pas ob najbolj izpostavljenem odseku avstrijsko-osmanske meje — zemlja, ki ni pripadala fevdalnim gospodom, ampak vojski. V 16. stoletju so jo poselili Uskoki — begunci srbskega, hrvaškega in vlaškega porekla, ki so bežali pred turškimi vpadi; ob Kolpi jim je vladal senjski knez Nikola Frankopan. Vpadi so Belo krajino večkrat opustošili: obramba tu ni bila abstrakcija, ampak vsakdan ob isti reki.\n\nPogodba z vojaško upravo je bila jasna: prosta zemlja in oprostitev fevdalnih dajatev v zameno za večno orožje. Gospodarska hrbtenica uskoških vasi je bila zadruga — več hišnih družin, ki je obdelovala skupno zemljo in skupaj nosila vojaško dolžnost; pozimi so orali in sejali, spomladi pa hodili na straže ob reki. Njihovo ime — po razlagi »tisti, ki je skočil prek« — je spomin na begunce, ki so preskočili mejo in našli novo domovino.\n\nUskoški potomci so se naselili v vaseh ob reki — Bojanci, Marindol, Paunoviči — in ohranili pravoslavno vero ter svoje običaje do danes; pravoslavna cerkev in pokopališče v Bojancih skupnost še danes držita skupaj. Iz tega srečanja svetov je zrasel del belokranjske identitete: belokranjsko pogačo radi imenujejo »darilo Uskokov slovenskemu narodu«, spomin na vojnokrajiške čase pa nosi utrjena domačija Šokčev dvor v Žuničih — v tej zbirki ima svoj zapis.\n\nLeta 1881 je Vojna krajina prešla pod civilno upravo — tri stoletja oboroženega vsakdana so se končala, meja ob Kolpi pa je ostala. Dediščina teh stoletij je dvojna: pripoved o sožitju dveh ver in jezikov ob isti reki ter vasi, ki so se naučile živeti z mejno negotovostjo — v času, ko je bila vsaka domačija ob Kolpi tudi zatočišče. Muzej bo uskoške zgodbe dopolnjeval s pričevanji potomcev: zlasti z drobci vsakdana, ki se v urbarjih ne zapišejo.",
    storyEn:
      "The Military Frontier (1460–1881) was a defensive belt along the most exposed section of the Austro-Ottoman border — land that belonged not to feudal lords but to the army. In the 16th century it was settled by the Uskoks — refugees of Serbian, Croatian and Vlach origin fleeing the Turkish incursions; along the Kolpa they were ruled by the prince of Senj, Nikola Frankopan. The incursions ravaged Bela krajina more than once: defence here was not an abstraction but an everyday life on the same river.\n\nThe bargain with the military administration was clear: free land and exemption from feudal dues in exchange for perpetual arms. The backbone of the Uskok villages was the zadruga — several house communities working common land and bearing the military duty together; in winter they ploughed and sowed, in spring they walked the river guard. Their very name — explained as \"the one who jumped across\" — remembers refugees who leapt the border and found a new homeland.\n\nThe Uskok descendants settled in villages along the river — Bojanci, Marindol, Paunoviči — and have kept their Orthodox faith and customs to this day; the Orthodox church and churchyard at Bojanci still hold the community together. From this meeting of worlds grew part of the Bela krajina identity: the Bela krajina pogača is gladly called a \"gift of the Uskoks to the Slovene nation\", and the fortified Šokčev dvor homestead in Žuniči — which has its own record in this collection — carries the memory of the frontier era.\n\nIn 1881 the Military Frontier passed to civil administration — three centuries of armed everyday life ended, but the border along the Kolpa remained. The legacy of those centuries is twofold: a story of two faiths and two languages living on the same river, and villages that learned to live with border uncertainty — at a time when every farmstead on the Kolpa was also a refuge. The museum will enrich the Uskok stories with the descendants' testimonies: above all with the fragments of everyday life that urbars never record.",
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
      {
        key: "wiki-uskoki",
        nameSi: "Wikipedija: Uskoki (senjski in žumberaški Uskoki, begunci v Vojno krajino)",
        nameEn: "Wikipedia: the Uskoks (of Senj and Žumberak, refugees into the Military Frontier)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Uskoki",
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
      "Šokčev dvor v Žuničih je eden najznačilnejših in najbolje ohranjenih primerov ljudske stavbne dediščine ob Kolpi: štiristranična, zaprta kmečka domačija s kamnitim podom in leseno galerijo, kjer še danes visi koruza in ležijo drva ob steni.\n\nZaprt tloris je bil hkrati tloris preživetja: hiša, hlev, senik in kamre stojijo okoli dvorišča, ki se skozi obokani pod odpre svetu, vse drugo pa ostane znotraj. Po ljudski razlagi sta domačijo varovala tudi kamnita stolpa na vogalih — oblika, ki jo je meja naredila iz kmetije: v času Vojne krajine je bila vsaka domačija ob mejni reki tudi zatočišče. Vhodni pod je bil edina odprtina do sveta: skozenj je šel voz, skozenj pa tudi vsaka novica, ki je prišla ob reki.\n\nDvor je nosil življenje Šokcev — kmečke skupnosti ob Kolpi, sorodne Uskokom: krušna peč v črni kuhinji, živina pod isto streho, seno na galeriji, koruza v klobukih nad podom. Letni krog je šel skozi dvorišče: spomladi setev na njive v dolini, jesen trgatva na pobočju, zima pa v podu — popravila orodja in pogovori, ki so držali domačijo skupaj.\n\nDanes je Šokčev dvor muzej na prostem v okviru Krajinskega parka Kolpa — obiskovalci si ga ogledajo ob predhodni najavi, sprejmejo pa jih v tradicionalnih belokranjskih nošah. Domačija je razglašena za kulturni spomenik lokalnega pomena in se obnavlja kot priča o vojnokrajiškem vsakdanu: o hiši, ki ni le stanovala, ampak varovala. Vas Žuniči pri Adlešičih je od Gribelj oddaljena približno 12 kilometrov — daleč za današnji avto, blizu za svet, ki je živel ob isti reki.",
    storyEn:
      "The Šokčev dvor in Žuniči is one of the most characteristic and best-preserved examples of the folk architecture along the Kolpa: a four-sided, enclosed farmstead with a stone ground floor and a wooden gallery, where maize still hangs and firewood rests against the wall.\n\nThe closed plan was at once a plan for survival: house, byre, hay loft and chambers stand around a courtyard that opens to the world only through the vaulted gate; everything else stays within. By popular account the homestead was guarded by two stone towers at its corners — a shape the border made out of a farm: in the days of the Military Frontier, every farmstead on the border river was also a refuge. The entrance pod was the only opening to the world: through it went the cart, and through it every piece of news that arrived along the river.\n\nThe dvor carried the life of the Šokci — the farming community on the Kolpa akin to the Uskoks: the bread oven in the black kitchen, livestock under the same roof, hay on the gallery, maize in braided crowns above the gate. The farming year passed through the courtyard: in spring the sowing in the valley fields, in autumn the grape harvest on the slope, in winter the pod — mended tools and the conversations that held the homestead together.\n\nToday the Šokčev dvor is an open-air museum within the Kolpa Landscape Park — visitors view it by prior appointment and are received in traditional Bela krajina dress. The homestead is declared a cultural monument of local significance and is being restored as a witness of the frontier everyday: of a house that did not merely shelter a household, but protected it. The village of Žuniči near Adlešiči lies some 12 kilometres from Griblje — far for today's car, close for a world that lived on the same river.",
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
      {
        key: "zvkds-sokcev-dvor",
        nameSi: "Register nepremične kulturne dediščine Slovenije — Šokčev dvor v Žuničih (Zavod za varstvo kulturne dediščine Slovenije)",
        nameEn: "Register of immovable cultural heritage of Slovenia — the Šokčev dvor in Žuniči (Institute for the Protection of Cultural Heritage of Slovenia)",
        sourceType: "objava",
        license: "javna informacija / public information",
        url: "https://www.zvkds.si/",
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
      "Kolpa (hrvaško Kupa) izvira v Gorskem kotarju — kraško jezero modre vode, zavarovano v okviru narodnega parka Risnjak — in po 297 kilometrih doseže Savo pri Sisku; večji del toka je slovensko-hrvaška meja. Rimljani so jo imenovali Colapis: ime, ki ga reka nosi že tri tisočletja.\n\nOb Gribljah je reka mirna, plitva in poleti topla — voda se pogosto segreje nad 25 °C, zato jo imajo za najtoplejšo slovensko reko in eno najbolj priljubljenih kopalnih rek v državi; kakovost vode na odseku Dragoši–Griblje redno spremlja državni monitoring kopalnih voda (merilno mesto K05010). Med kajakaši in kanuisti velja za eno najlepših slovenskih rek za počasno plovbo; dolina s čisto vodo, mrtvicami in travniki je zavarovano območje Natura 2000 — del evropske mreže najdragocenejše narave. Za plavalce, ribiče in veslače je reka danes tisto, kar je bila nekoč za mlinarje: življenjska žila pokrajine.\n\nV tisočletjih poplavljanja je reka ob bregovih ustvarila rodovitne travnike, ki se jim v Beli krajini reče loka; njena voda tu ponekod ponika v kraško podzemlje in se vrača v studencih ob obeh bregovih.\n\nReka je vasi dajala ribe, mlin in žago — mlinarska dediščina ima v tej zbirki svoja zapisa — s cerkvami na obeh bregovih pa tudi zgodbo o stiku in ločitvi. Nad njo so marca 1945 pristajala zavezniška letala z ranjenci, ob njej je leta 2015 za kratek čas stala žičnata ograja: Kolpa je priča vsem plasti meje, o katerih govori zapis o meji. Danes ob njej vodi kolesarska pot, poleti pa se ob bregovih znova slišita skupni jezik in smeh — ista voda, ki je bila stoletja črta, spet združuje obale.",
    storyEn:
      "The Kolpa (Croatian: Kupa) rises in Gorski Kotar — a karst lake of blue water protected within Risnjak National Park — and after 297 kilometres reaches the Sava at Sisak; most of its course is the Slovenian–Croatian border. The Romans called it Colapis: a name the river has carried for three thousand years.\n\nAt Griblje the river is calm, shallow and warm in summer — the water often climbs above 25 °C, which makes it Slovenia's warmest river and one of the country's favourite bathing rivers; water quality on the Dragoši–Griblje section is regularly monitored by the state bathing-water programme (measurement point K05010). Among kayakers and canoeists it counts among the loveliest Slovenian rivers for slow paddling, and the valley — with its clean water, backwaters and meadows — is a protected Natura 2000 site, part of the European network of most precious nature. For swimmers, anglers and paddlers the river is today what it once was for the millers: the lifeline of the landscape.\n\nOver millennia of flooding the river created fertile meadows along its banks, called loka in Bela krajina; its water here in places sinks into the karst underground and returns in the springs along both banks.\n\nThe river gave the village fish, a mill and a sawmill — the milling heritage has two records of its own in this collection — and, with churches on both banks, also a story of contact and separation. Above it Allied aircraft landed with the wounded in March 1945; along it a wire fence stood briefly in 2015: the Kolpa witnessed every layer of the border described in the record on the border. A cycling route runs along it today, and in summer both banks again carry a shared language and laughter — the same water that was a line for centuries is joining the banks again.",
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
      {
        key: "natura2000-kolpa",
        nameSi: "Natura 2000 v Sloveniji — območje Kolpa (ARSO, mreža evropsko zavarovanih območij)",
        nameEn: "Natura 2000 in Slovenia — the Kolpa site (ARSO, the European network of protected areas)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.natura2000.si/",
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
      "Beseda malenca označuje mali jez oziroma zaporo z brusom, ki so jo mlinarji zgradili čez reko, da bi zajeli vodno silo. Na Kolpi pri Gribljah je ohranjen tak primer — slap in malenca — ki ga je fotografiral avtor švabo in je javno dokumentiran v Wikimedia Commons.\n\nMalenca je bila premišljena vodna gradnja: jez je dvignil vodostaj toliko, da je vodo lahko odvedel v mlinski rokav, brus — prag, po katerem se voda spusti — pa je silo usmeril tja, kjer jo je bilo treba. Gradili so jo iz kamna in lesa; obnavljali pa po vsaki zimi, saj Kolpa zna priti čez bregove in vsako leto znova preizkusiti mlinarsko delo. Jez je bil zato živ spomenik: nikoli končan, vedno znova popravljen z rokami, ki so od reke živele.\n\nVodna sila ob Kolpi je poganjala mline in žage v Dolu, Radencih, Pobrežju in Krasincu — o njih govori sosednji zapis o mlinih. Malenca pri Gribljah je zadnji kos te zapuščine na našem odseku reke: majhna, a razumljiva stavba, ki pove, kako se iz toka vode naredi kruh.\n\nZa vas je imela malenca še en dar: mirna voda za zajezitvijo je postala kopališče. Kolpa velja za najtoplejšo slovensko reko, poletja ob njej pa za eno od belokranjskih ugodnosti; globoka voda za malenco, kjer se tok umiri, je za otroke pomenila prvo plavanje, za odrasle pa senco ob kosilu na travi. Ena in ista stavba je bila zjutraj gospodarska, opoldne pa brezskrbna.\n\nMuzej objavlja to, kar ima: preverjeno fotografijo in splošno tipologijo. Natančna lega konkretne malence zaenkrat ni potrjena z zanesljivim virom, zato zemljevid zavestno ne riše te točke — koordinata, ki bi bila zgolj približek, ne bi bila resnična. Ko bo lega zapisana, bo tudi pika na karti; do takrat ostajata le slika in beseda.",
    storyEn:
      "The word malenca denotes a small weir or dam with a drop that millers built across the river to capture the force of the water. On the Kolpa at Griblje such an example survives — a waterfall and weir — photographed by the author švabo and publicly documented in Wikimedia Commons.\n\nThe malenca was a considered piece of water engineering: the weir raised the water level just enough to divert it into the millrace, while the drop — the sill over which the water spills — directed the force where it was needed. It was built of stone and timber, and repaired after every winter, for the Kolpa knows how to rise over its banks and test the miller's work anew each year. The weir was therefore a living monument: never finished, always mended again by the hands that lived from the river.\n\nThe water power of the Kolpa drove the mills and saws at Dol, Radenci, Pobrežje and Krasinec — the subject of the neighbouring record on the mills. The malenca at Griblje is the last piece of that heritage on our stretch of the river: a small but legible structure that tells how bread is made out of a current.\n\nFor the village the malenca had one more gift: the still water behind the weir became a bathing place. The Kolpa counts among Slovenia's warmest rivers, and summers along it among Bela krajina's kindnesses; the deep water below the malenca, where the current settles, meant a first swim for the children and lunchtime shade for the grown-ups. One and the same structure was economic in the morning and carefree by noon.\n\nThe museum publishes what it has: a verified photograph and the general typology. The precise position of this particular malenca is not confirmed by a reliable source, so the map deliberately does not draw this point — a coordinate that would be a mere approximation would be a museum untruth. When the position is recorded, the dot will appear on the map; until then, the picture and the word remain.",
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
      {
        key: "radio-odeon-mlini-malenca",
        nameSi: "Radio Odeon (2022): mlini in jezi na Kolpi po ohranjenih urbarjih",
        nameEn: "Radio Odeon (2022): mills and weirs on the Kolpa in the surviving urbars",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/",
        noteSi: "Mlinarska dediščina Bele krajine — kontekst malenc in mlinskih rokavov.",
        noteEn: "The milling heritage of Bela krajina — the context of weirs and millraces.",
      },
      {
        key: "wiki-kolpa",
        nameSi: "Wikipedija: Kolpa (reka — hidrologija, poplave, ribiščina)",
        nameEn: "Wikipedia: Kolpa (river — hydrology, floods, fisheries)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kolpa",
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
      "Ob Kolpi in njenih pritokih so stoletja stale mline: ohranjeni urbarji jih navajajo v Dolu, Radencih, Pobrežju in Krasincu. Mlinar je bil vaški mojster — njegov jez, toča in kamnita korita so žito spremenila v moko, po kateri je vsaka hiša spekla svoj kruh.\n\nSlovenski vodni mlin je večinoma gnala žimaln — vodoravno kolo, ki je pretvarjalo tok reke v vrteči se kamen. Mlin je nosil dva kamna: spodnjega mirovnika in zgornjega tekača; med njiju je padalo zrno, iz njiju pa moka. Nastavitev kamnov je bila mlinarjeva skrivnost: preveč prostora — moka groba, premalo — kamen se žge. Mlinarjev poklic je bil brati vodo: kdaj dvigniti zapornice, kdaj mleti, kdaj čakati na dež.\n\nPlačevalo se je z mlinščino — odmerkom moke, ki si jo je mlinar pridržal za svoje delo. Ob žetvi je pri mlinu stala vrsta vozov: tu se je slišalo vse, od cen žita do zarok — mlin je bil vaška borza in vaški telefon ob enem; vrsta pred njim je bila najbolj poštena kronika leta.\n\nSledi mlinarstva segajo globoko v srednji vek: arheološke raziskave v strugi Lahinje pri Flekovem mlinu v Črnomlju so odkrile ostanke mlina iz 14. stoletja. Mlin s kamnito zajezitvijo v Bregu pri Sinjem vrhu so večkrat obnavljali prav zaradi njegovega pomena za mletje žita okolišnjih vasi. Ob Kolpi pri Gribljah mlinarsko dediščino zapira malenca — mali jez, ki ima v tej zbirki svoj zapis.\n\nMuzej išče mlinarska pričevanja: kdaj je utihnil zadnji mlin v okolici Gribelj, kdo je hodil z žitom do Pobrežja in kaj je mlinar povedal, ko se je kamen ustavil. Vsak spomin bo nov vir — mlinski kamni so molčali dovolj dolgo.",
    storyEn:
      "Along the Kolpa and its tributaries mills stood for centuries: the surviving urbars list them at Dol, Radenci, Pobrežje and Krasinec. The miller was the village's craftsman — his weir, the drop and the stone troughs turned grain into the flour from which every household baked its bread.\n\nThe Slovene water mill was mostly driven by a žimaln — a horizontal wheel that turned the river's current into a turning stone. The mill carried two stones: the fixed bedstone below and the running stone above; between them the grain fell, and out of them came flour. Setting the stones was the miller's secret: too much gap — coarse flour, too little — the stone scorches. The miller's trade was to read the water: when to raise the sluices, when to grind, when to wait for rain.\n\nPayment was the mlinščina — the measure of flour the miller kept back for his work. At harvest a queue of carts stood by the mill: everything was heard here, from grain prices to engagements — the mill was the village's exchange and the village's telephone in one; the queue before it was the most honest chronicle of the year.\n\nThe traces of milling reach deep into the Middle Ages: archaeological research in the bed of the Lahinja at Flekov mlin in Črnomelj uncovered the remains of a 14th-century mill. The mill with its stone weir at Breg pri Sinjem Vrhu was repeatedly restored precisely because of its importance for grinding the grain of the surrounding villages. On the Kolpa at Griblje the milling heritage is closed by the malenca — the small weir that has its own record in this collection.\n\nThe museum is looking for the millers' testimonies: when the last mill around Griblje fell silent, who carried the grain to Pobrežje, and what the miller said when the stone stopped. Every memory will be a new source — the millstones have been silent long enough.",
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
      {
        key: "literatura-mlinarstvo",
        nameSi: "Strokovna literatura o vodnih mlinih na Slovenskem (mlini na žimaln, mlinščina, letni krog)",
        nameEn: "Scholarly literature on water mills in Slovenia (horizontal-wheel mills, the miller's toll, the yearly cycle)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
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
      "Iz kmečke hiše v Gribljah na svetovna odra: ljudsko šolo je Niko Županič obiskoval v Podzemlju (1884–1887), gimnazijo v Novem mestu, leta 1903 pa doktoriral na dunajski univerzi iz zgodovine, prazgodovinske arheologije, etnologije in antropologije.\n\nZ Dunaja ga je pot odpeljala na Balkan: v prvih desetletjih 20. stoletja je opravil antropološke raziskave med Srbijo, Bolgarijo, Makedonijo in Albanijo — meril je in poslušal, opazoval ljudi in pokrajine — ter se ustavil v Beogradu, kjer je deloval med muzeji in univerzami. V slovensko vedo je vnesel primerjalni balkanski zorni kot, ki mu je ostal zvest vse življenje.\n\nMed prvo svetovno vojno je deloval v jugoslovanskem odboru, v Združenih državah navduševal izseljence za združitev Slovanov, na mirovni konferenci v Parizu leta 1919 pa skupaj z izumiteljem Mihajlom Pupinom dosegel, da Bled z okolico ni pripadal Italiji.\n\nLeta 1921 je v Ljubljani ustanovil Etnografski inštitut — današnji Slovenski etnografski muzej — in postal njegov prvi upravnik; leta 1927 je pričel izdajati Etnolog, prvo slovensko etnološko glasilo, leta 1940 pa zasedel novo ustanovljeno stolico za etnologijo na ljubljanski univerzi. Pred nemško zasedbo Ljubljane se je leta 1943 umaknil v rodno Belo krajino — v pokrajino, od koder je izhajala vsa njegova pot.\n\nObjavil je čez 200 razprav, knjig in člankov; umrl je leta 1961 v Ljubljani. Njegov portret je naslikal Ivan Vavpotič, spominsko ploščo pa ima v rojstni vasi — Slovenski etnografski muzej ga je ob 140. obletnici rojstva poimenoval »kozmopolit iz Gribelj«. Za ta muzej je Županič dokaz, da iz vaške hiše zraste znanost svetovnega dometa: pot se lahko odpravi po vseh glavnih mestih Evrope, vendar se začne in konča pod isto gribeljsko streho.",
    storyEn:
      "From a farmhouse in Griblje onto the world's stages: Niko Županič attended primary school in Podzemelj (1884–1887) and grammar school in Novo mesto, and in 1903 took his doctorate at the University of Vienna in history, prehistoric archaeology, ethnology and anthropology.\n\nFrom Vienna the road led him to the Balkans: in the early decades of the 20th century he carried out anthropological research in Serbia, Bulgaria, Macedonia and Albania — measuring and listening, observing people and landscapes — and settled for a time in Belgrade, working among its museums and universities. Into Slovene scholarship he brought a comparative Balkan perspective that remained his for life.\n\nDuring the First World War he served the Yugoslav Committee, kindled the emigrants in the United States for the union of the South Slavs, and at the 1919 Paris Peace Conference, together with the inventor Mihajlo Pupin, helped secure that Bled and its surroundings did not pass to Italy.\n\nIn 1921 he founded the Ethnographic Institute in Ljubljana — today's Slovene Ethnographic Museum — and became its first director; in 1927 he launched Etnolog, the first Slovene ethnological journal, and in 1940 took the newly established chair of ethnology at the University of Ljubljana. Before the German occupation of Ljubljana he withdrew in 1943 to his native Bela krajina — the land from which his whole road had set out.\n\nHe published more than 200 studies, books and articles; he died in Ljubljana in 1961. His portrait was painted by Ivan Vavpotič, and a memorial plaque stands in his birth village — on his 140th birthday the Slovene Ethnographic Museum called him a \"cosmopolitan from Griblje\". For this museum Županič is proof that world-class scholarship can grow out of a village farmhouse: the road may run through every capital of Europe, but it begins and ends under the same Griblje roof.",
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
    slug: "izseljenstvo",
    category: "kraj",
    titleSi: "Izseljenstvo — vas čez ocean",
    titleEn: "Emigration — the village across the ocean",
    periodSi: "1880 → danes",
    periodEn: "1880 → present",
    summarySi:
      "Vali odhoda v Ameriko, Argentino in Avstralijo so v 20. stoletju raznesli Griblje po svetu; mandati iz Amerike so gradili hiše, rodovniki pa se iščejo še danes.",
    summaryEn:
      "The waves of departure for America, Argentina and Australia scattered Griblje around the world in the 20th century; money orders from America built houses, and the family trees are still being traced today.",
    storySi:
      "Vsak zapis te zbirke ima svojo čezoceansko različico: ljudje, ki so vas zapustili. Slovensko izseljenstvo je ena največjih premikajočih sil 19. in 20. stoletja — odhodi so doleteli vsako vas, Griblje ne izjema.\n\nPrvi in največji val je bil gospodarski: od osemdesetih let 19. stoletja do prve svetovne vojne se je na pot v Združene države podalo na stotine tisočev Slovencev; potovali so prek Trsta in Antwerpna, kjer je čez Atlantik peljala linija Red Star Line. Pastel Eugeena Van Mieghema iz leta 1899 kaže izseljence na antwerpenski ulici pred pisarnami te družbe — ne Gribljcev samih, a natanko ceste, po kateri so hodili. Med vojnami se je pot stekla v Argentino in Kanado, po letu 1945 pa v Argentino, Avstralijo in Kanado znova — tokrat politično. Šestdeseta in sedemdeseta leta so prinesla zimske delavce: moški so odhajali na gradbišča Nemčije, Švice in Avstrije, poleti pa se vračali k žetvi. Po letu 1991 se je kolo obrnilo še enkrat.\n\nIzseljenstvo ni samo odhod — je tudi denar in pisma. Mandati, denarni nakazi iz Amerike, so v domačih vaseh gradili hiše in odkupovali zemljo; na stenah so stale fotografije iz Clevelanda in Pittsburga, v omarah pa obleke, ki so jih nosili »tam«. V Gribljah je v isti hiši odraščal tudi Niko Županič, ki je med prvo svetovno vojno v Združenih državah navduševal izseljence za združitev Slovanov — njegov zapis stoji v tej zbirki.\n\nMuzej iskreno priznava: imena gribeljskih izseljenskih rodov še niso zapisana. Rodovi v Združenih državah, Avstraliji, Argentini in Nemčiji — vsak dopis, fotografija ali mandat bo nov vir. Vas, ki jo je zgodovina raztresla po svetu, se lahko v muzeju spet zbere: hiše na obeh straneh oceana namreč pripadajo istim rodbinam.",
    storyEn:
      "Every record in this collection has its trans-oceanic counterpart: the people who left the village. Slovene emigration is one of the greatest moving forces of the 19th and 20th centuries — the departures reached every village, Griblje no exception.\n\nThe first and largest wave was economic: from the 1880s to the First World War hundreds of thousands of Slovenes set out for the United States; they travelled via Trieste and Antwerp, where the Red Star Line carried them across the Atlantic. Eugeen Van Mieghem's pastel of 1899 shows emigrants on an Antwerp street before the company's offices — not Griblje people themselves, but precisely the road they walked. Between the wars the road ran to Argentina and Canada; after 1945 to Argentina, Australia and Canada again — this time political. The 1960s and 1970s brought the winter workers: men left for the building sites of Germany, Switzerland and Austria and returned for the harvest. After 1991 the wheel turned once more.\n\nEmigration is not only departure — it is money and letters. The money orders from America built houses and bought land in the home villages; photographs of Cleveland and Pittsburgh stood on walls, and wardrobes held the clothes worn \"over there\". In Griblje the same house also reared Niko Županič, who during the First World War kindled the emigrants of the United States for the union of the South Slavs — his record stands in this collection.\n\nThe museum honestly admits: the names of Griblje's emigrant families are not yet written down. The families in the United States, Australia, Argentina and Germany — every letter, photograph or money order will be a new source. A village scattered across the world by history can gather again in a museum: the houses on both sides of the ocean belong to the same families.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/izseljenci.jpg",
    imageCredit: "Eugeen Van Mieghem, 1899 · Wikimedia Commons · javna last",
    yearFrom: 1880,
    featured: false,
    sources: [
      {
        key: "wiki-ameriski-slovenci",
        nameSi: "Wikipedija: Ameriški Slovenci (izseljenski valovi v Združene države)",
        nameEn: "Wikipedia: American Slovenes (the emigration waves to the United States)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Ameri%C5%A1ki_Slovenci",
      },
      {
        key: "wiki-slovene-diaspora",
        nameSi: "Wikipedia (EN): Slovene diaspora (razseljenost po svetu)",
        nameEn: "Wikipedia (EN): Slovene diaspora (the dispersal around the world)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Slovene_diaspora",
      },
      {
        key: "wiki-red-star-line",
        nameSi: "Wikipedia (EN): Red Star Line (antwerpenska čezatlantska linija, 1873–1934)",
        nameEn: "Wikipedia (EN): Red Star Line (the Antwerp transatlantic line, 1873–1934)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Red_Star_Line",
        noteSi: "Pot velikega dela slovenskega izseljstva v ZDA je vodila prek Antwerpna in te družbe.",
        noteEn: "The road of much of the Slovene emigration to the USA ran through Antwerp and this company.",
      },
      {
        key: "commons-emigranti",
        nameSi: "Wikimedia Commons: Emigranten in de Montevideostraat (Eugeen Van Mieghem, 1899)",
        nameEn: "Wikimedia Commons: Emigrants in Montevideo Street (Eugeen Van Mieghem, 1899)",
        sourceType: "fotografija",
        license: "Public domain (Eugeen Van Mieghem, 1899)",
        url: "https://commons.wikimedia.org/wiki/File:Emigranten_in_de_Montevideostraat,_Eugeen_Van_Mieghem,_1899.jpg",
        noteSi: "Avtentična upodobitev izseljencev pred pisarnami Red Star Line v Antwerpnu — glavna slika zapisa; ne prikazuje Gribljcev, ampak njihovo pot.",
        noteEn: "An authentic depiction of emigrants before the Red Star Line offices in Antwerp — the record's main image; it does not show Griblje people, but their road.",
      },
      {
        key: "wiki-zupanic-emigracija",
        nameSi: "Wikipedija: Niko Županič (delo med izseljenci v ZDA med prvo svetovno vojno)",
        nameEn: "Wikipedia: Niko Županič (work among the emigrants in the USA during the First World War)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Niko_%C5%BDupani%C4%8D",
        noteSi: "Gribeljski rodoven, ki je delal med izseljenci — most med vasjo in izseljenstvom.",
        noteEn: "A son of Griblje who worked among the emigrants — a bridge between the village and the diaspora.",
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
      "Po kapitulaciji Italije septembra 1943 je Bela krajina postala svobodno partizansko ozemlje — s šolami, tiskarnami in bolnišnicami. V tem prostoru je 19. in 20. februarja 1944 v Črnomlju zasedal Slovenski narodnoosvobodilni odbor, ki se je preimenoval v Slovenski narodnoosvobodilni svet (SNOS) in ustanovil svoj zakonodajni odbor.\n\nSvetu je predsedoval literarni zgodovinar Josip Vidmar; svetniki so v Črnomelj prišli peš skozi zimo — zbor brez države, ki si je državnost najprej zamislil. Zasedanje je potrdilo, da je SNOS najvišji predstavniški organ slovenskega narodnoosvobodilnega gibanja — ne stranka, ampak parlament v nastajanju. Prav iz te kontinuitete je zrasla povojna slovenska državnost; zasedanje zato imenujejo za »prvi slovenski parlament«.\n\nStavba sokolskega doma, v kateri je zasedal, je danes Kulturni dom Črnomelj; ob osemdesetletnici leta 2024 je mesto dogodek obeležilo z razstavo in spominsko slovesnostjo. Iz svobodne Bele krajine so spomladi istega leta vzletala tudi zavezniška letala s partizanskega letališča Otok — ta zgodba ima v zbirki svoj zapis.\n\nZa Belo krajino je bilo zasedanje tudi priznanje: pokrajina ob Kolpi, stoletja obrambni rob Evrope, je v najtemnejšem letu okupacije postala prostor, kjer se je odločalo o slovenski prihodnosti. Da je ravno Črnomelj postal parlamentarno mesto, ni bila naključnost: bila je svoboda, ki so jo držali reka, hribi in ljudje nad njo. Kdor danes stoji pred Kulturnim domom, stoji pred stavbo, v kateri je zvenela slovenščina kot jezik odločanja — v letu, ko je bila po drugi strani Evrope tišina. Muzej bo zasedanju dodajal dokument za dokumentom — dnevne rede, sezname, fotografije — kjerkoli se najdejo v arhivih.",
    storyEn:
      "After the Italian capitulation in September 1943, Bela krajina became free Partisan territory — with schools, print shops and hospitals. Within this free space, on 19 and 20 February 1944, the Slovene National Liberation Committee met in Črnomelj, renaming itself the Slovene National Liberation Council (SNOS) and establishing its legislative committee.\n\nThe council was presided over by the literary historian Josip Vidmar; its members reached Črnomelj on foot, through the winter — an assembly without a state, dreaming statehood before having it. The session confirmed the SNOS as the highest representative body of the Slovene liberation movement — not a party, but a parliament in the making. Out of that continuity grew Slovenia's post-war statehood; the session is therefore called the \"first Slovene parliament\".\n\nThe Sokol hall in which it met is today the Črnomelj Culture House; on the eightieth anniversary in 2024 the town marked the event with an exhibition and a memorial ceremony. In the spring of the same year Allied aircraft also took off from the Otok partisan airfield in free Bela krajina — that story has its own record in this collection.\n\nFor Bela krajina the session was also a recognition: the province on the Kolpa, for centuries Europe's defensive edge, became in the darkest year of the occupation the space where Slovenia's future was being decided. That it was Črnomelj that became a parliamentary town was no accident: it was the freedom held up by the river, the hills and the people above it. Whoever stands before the Culture House today stands before a building in which Slovene sounded as a language of decision — in a year when across occupied Europe it was silence. The museum will add document after document to the session — agendas, lists, photographs — wherever they are found in the archives.",
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
      {
        key: "wiki-josip-vidmar",
        nameSi: "Wikipedija: Josip Vidmar (predsednik SNOS)",
        nameEn: "Wikipedia: Josip Vidmar (president of the SNOS)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Josip_Vidmar",
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
      "Na travniku ob vasi Otok pri Metliki so partizani spomladi 1944 uredili letališče za zavezniška letala. Zavezniki so tam prvič pristali 17. septembra 1944 — s petimi letali. Do konca vojne so s prostora ob Kolpi v zavezniške bolnišnice v južni Italiji prepeljali 1473 ranjencev; odpeljali so tudi zavezniške vojne ujetnike, med katerimi je bilo 87 britanskih letalcev, večinoma sestreljenih pilotov.\n\nLetala so pristajala ob zatemnitvi: travnik so označili z lučmi, ki so jih ugasnili, takoj ko je pristalo zadnje. Na tla je padel prah in napetost, pomešana z olajšanjem — ranjenci, meseci skriti po gozdnih bolnišnicah, so se prvič peljali proti miru. Posadke so jih prevzemale na nosilih; drugi večer se je ponovila enaka noč, tretji tretja. Zračni most je deloval, dokler je zdržal travnik — in dokler je zdržala vojna.\n\nDanes dogodek varuje spominski letalski Douglas C-47 Dakota, ki stoji pri Otoku na čast belokranjskima partizanskima letališčema; spomin na leta ohranja tudi spominska slovesnost Vranov let, ki se ob Kolpi vrača vsako pomlad. Konec marca 1945 so z bližnjega letališča Krasinec vzletala zadnja evakuacijska letala z ranjenci, posneti tudi pri Gribljah — ohranjena fotografija vkrcavanja ranjencev na letališču Otok je v javni domeni in je glavna slika tega zapisa.\n\nImena pilotov, ranjencev in nosačev so še večinoma v arhivih: muzej bo vsakega, ki pozna družinsko zgodbo o letališču, zapisal kot pričevanje. Zračni most ob Kolpi je bil ena največjih reševalnih operacij slovenskega prostora — in ena najmanj vidnih: odvil se je v noči, nad travniki, ki so jih zjutraj spet košili.",
    storyEn:
      "On a meadow by the village of Otok near Metlika the Partisans laid out an airfield for Allied aircraft in the spring of 1944. The Allies first landed there on 17 September 1944 — with five aircraft. By the end of the war 1,473 wounded were flown from the ground by the Kolpa to Allied hospitals in southern Italy; Allied prisoners of war were also taken out, among them 87 British airmen, mostly downed pilots.\n\nThe aircraft landed at dusk: the meadow was marked with lights, put out as soon as the last machine was down. Dust and tension fell to the ground, mixed with relief — the wounded, hidden for months in the forest hospitals, were for the first time riding towards peace. The crews took them over on stretchers; the next evening the same night repeated, the third a third. The air bridge worked for as long as the meadow held — and for as long as the war held.\n\nToday the event is guarded by the memorial Douglas C-47 Dakota, which stands at Otok in honour of the Bela krajina partisan airfields; the memory of the flights is kept alive by the Vranov let memorial ceremony, which returns to the Kolpa every spring. At the end of March 1945 the last evacuation aircraft with the wounded took off from the nearby Krasinec airfield, photographed also at Griblje — the surviving photograph of the wounded boarding at the Otok airfield is in the public domain and is this record's main image.\n\nThe names of the pilots, the wounded and the stretcher-bearers are still mostly in the archives: the museum will record as a testimony everyone who knows a family story about the airfield. The air bridge on the Kolpa was one of the largest rescue operations of the Slovene lands — and one of the least visible: it took place at night, over meadows that were mown again the next morning.",
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
      "Bela krajina je bila med drugo svetovno vojno eno najbolj svobodnih ozemelj okupirane Evrope — tu so delovale partizanske bolnišnice, šole in tiskarne. Konec marca 1945 se je nad njo zgodilo nekaj izjemnega: z improviziranega letališča Krasinec so zavezniška letala v dveh dneh evakuirala ranjence in težje bolne ter jih prepeljala v zavezniško bazo v Bari; RTV Slovenija je ob osemdesetletnici dogodka zapisala, da gre za eno največjih medvojnih evakuacij v tem delu Evrope.\n\nRanjenci so prihajali iz gozdnih in jamskih bolnišnic, skritih po rovtih in kraških globelah — nosili so jih na nosilih, vodili pod roko; nekateri so bili meseci prvič podnevi na prostem. Hrup motorjev nad polji je marca 1945 naznanjal nekaj, česar vaščani niso poznali: bližajoči se konec vojne, ki se je z vsakim vzletom bližal dan za dnem. Za ranjence je bila pot dolga in tiha: iz bolnišnice na zbirno točko, od tam na travnik, z travnika v letalo — nekateri so na poti čakali cele dneve.\n\nDve fotografiji iz tega časa sta posneti prav pri Gribljah: ranjeni partizani, ki opazujejo pristajanje letal, ter pogovor angleškega pilota s partizani. Posnetka sta med redkimi dokumenti operacije sploh — in edinima, katerih kraj je točno znan: Griblje. Snemalec prve je Franjo Veselko (1905–1977); oba sta v javni domeni. Muzej objavlja fotografiji kot dokument — vsak dodatni podatek (imenovane osebe, točen dan vzleta) bo dodan šele z arhivskim virom.\n\nObrazi na posnetkih so mladi — in večinoma brez imen. Kdor prepozna rojaka, brata ali soseda, naj se oglasi: ta muzej je zgrajen iz imen, ki jih še išče. Vsako ime, ki ga zbirka dobi, je eno okno več v en dan marca 1945.",
    storyEn:
      "During the Second World War Bela krajina was one of the freest territories of occupied Europe — Partisan hospitals, schools and print shops operated here. At the end of March 1945 something extraordinary happened above it: from the improvised Krasinec airfield Allied aircraft evacuated the wounded and gravely ill over two days, flying them to the Allied base at Bari; on the operation's eightieth anniversary RTV Slovenija described it as one of the largest wartime evacuations in this part of Europe.\n\nThe wounded came from the forest and cave hospitals, hidden in the high meadows and karst hollows — carried on stretchers, led by the arm; some had not been out in daylight for months. The roar of engines above the fields in March 1945 announced something the villagers had not known: a war drawing to its end, closer with every take-off. For the wounded the road was long and quiet: from the hospital to the assembly point, from there to the meadow, from the meadow into the aircraft — some waited whole days on the way.\n\nTwo photographs from that time were taken precisely at Griblje: wounded Partisans watching the aircraft land, and an English pilot in conversation with Partisans. They are among the rare documents of the operation at all — and the only two whose place is known exactly: Griblje. The author of the first is Franjo Veselko (1905–1977); both are in the public domain. The museum publishes the photographs as documents — any additional detail (named persons, the exact day of take-off) will be added only with an archival source.\n\nThe faces in the photographs are young — and mostly without names. Whoever recognises a neighbour, a brother or a kinsman is invited to come forward: this museum is built out of the names it is still searching for. Every name the collection gains is one more window onto a single day in March 1945.",
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
      "Ko je Slovenija junija 1991 postala samostojna država, je Kolpa iz reke med dvema republikama postala zunanja meja nove države — in čez noč tudi meja Evropi. Ob begunski (migrantski) krizi leta 2015 je bila ob reki pri Gribljah postavljena začasna varnostna ograja — njen videz je dokumentiral fotograf Hythlodot (Wikimedia Commons, CC BY-SA 4.0).\n\nA meja ob Kolpi ni rojena leta 1991. Stoletja je reka ločevala deželo Kranjsko od hrvaških dežel; po propadu Avstro-Ogrske leta 1918 je postala notranja upravna meja v Kraljevini SHS, po letu 1945 pa republiška meja med Slovenijo in Hrvaško. Kar se je leta 1991 spremenilo, ni bila črta na zemljevidu — bila je njena teža: mejni kamni so dobili državni pomen, ob reki so zrasli mejni prehodi, vsakdan pa je prepredla carina in dokumenti.\n\nNovo poglavje sta zapisali leti 2015 in 2016, ko je begunski tok po balkanski poti prinesel žičnato ograjo — da bi pretok ljudi usmerila v urejene prehode. Za vas ob reki je bila ograja tuja novost: Kolpa je bila vse življenje skupna — skupni mlini in malence, skupna kopališča, poroke čez reko in sorodstvo na obeh bregovih.\n\nZ vstopom Hrvaške v schengenski prostor 1. januarja 2023 je fizični pomen meje znova oslabel: prehodi so se zaprli, luči nad njimi ugasnile. Reka, ki je bila stoletja črta, se je vrnila k starejši vlogi: skupna kopališča, skupni ribolov, skupna zgodba.\n\nMeja ob Kolpi je zato muzej v muzeju: isti tok vode je bil deželna, upravna, republiška in državna meja — in je vseeno ostajal kraj, kjer so se na obeh bregovih srečevali isti ljudje. Obiskovalca vabimo, da zgodovino te črte prebere naravnost iz reke: najstarejša meja tu ni kamen, ampak voda.",
    storyEn:
      "When Slovenia became an independent state in June 1991, the Kolpa turned from a river between two republics into the external border of a new state — and overnight, a border of Europe. During the refugee crisis of 2015 a temporary security fence was erected along the river at Griblje — its appearance documented by the photographer Hythlodot (Wikimedia Commons, CC BY-SA 4.0).\n\nBut the border on the Kolpa was not born in 1991. For centuries the river separated the land of Carniola from the Croatian lands; after the collapse of Austria-Hungary in 1918 it became an internal administrative line in the Kingdom of Serbs, Croats and Slovenes, and after 1945 the republican border between Slovenia and Croatia. What changed in 1991 was not the line on the map — it was its weight: the boundary stones took on the meaning of statehood, border crossings grew along the river, and everyday life was threaded through with customs and documents.\n\nA new chapter came in 2015 and 2016, when the refugee flow along the Balkan route brought the wire fence — built to steer the movement of people into orderly crossings. For the village on the river the fence was an alien novelty: the Kolpa had always been shared — shared mills and weirs, shared beaches, marriages across the river and kin on both banks.\n\nWith Croatia's entry into the Schengen area on 1 January 2023 the physical meaning of the border weakened again: the crossings closed, the lights above them went dark. The river that had spent centuries as a line returned to an older role: shared beaches, shared fishing, a shared story.\n\nThe border on the Kolpa is thus a museum within the museum: the same current of water has been a provincial, an administrative, a republican and a national border — and remained, throughout, a place where the same people met on both banks. We invite the visitor to read the history of this line straight from the river: the oldest border here is not a stone, but water.",
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
      {
        key: "wiki-meja-sl-hr",
        nameSi: "Wikipedija (EN): Slovenia–Croatia border (potek in zgodovina meje)",
        nameEn: "Wikipedia (EN): Slovenia–Croatia border (course and history of the border)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Slovenia%E2%80%93Croatia_border",
        noteSi: "Zgodovinske plasti meje ob Kolpi — od deželne meje do schengenske.",
        noteEn: "The historical layers of the Kolpa border — from a provincial line to Schengen.",
      },
      {
        key: "ec-schengen",
        nameSi: "Evropska komisija: območje Schengen (vstop Hrvaške 1. 1. 2023)",
        nameEn: "European Commission: the Schengen area (Croatia's entry on 1 January 2023)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/schengen-area_en",
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
      "Vaški ribnik je bil v tradicionalni vasi vodni rezervoar za živino, zatočišče ptic in rib ter krajevno »ogledalo«, v katerem se je vas videla sama. V Gribljah ribnik stoji še danes in je dokumentiran na posnetkih Wikimedia Commons; poleti ga obiskujejo kačji pastirji in race, pozimi pa se nanj naselita tišina in spomin.\n\nV Beli krajini voda ni samoumevna: pokrajina je kraška, padavin je v Gribljah in okolici celo najmanj v Sloveniji, potoki pa izginjajo v apnenčasto podlogo. Vsak kos stoječe vode je bil zato dragocen. Ribnike so kopali z več nameni naenkrat: napajališče za živino, vodna rezerva ob požaru — gasilska brizgalna je v stari vasi težila do vode — in gojenje rib za mizo.\n\nKrap, ki je v ribniku odraščal, je pogosto čakal na božič: živ krap, shranjen do konca v kopeli, je bil del slovenskega božičnega vsakdana vse do srede dvajsetega stoletja. Ribnik je bil zato tudi shramba — hladilnik vasi, preden je elektrika prinesla pravega.\n\nV njem je živelo tudi življenje, ki ga je bilo v kmečkem svetu sicer malo: pomladanski koncert žab, kačji pastirji nad gladino, race z mladiči v trsti ob bregu. Za otroke je bil ribnik prvi ocean: drsanje pozimi, lovljenje kruhakov poleti, spomladansko opazovanje zaroda v plitvini.\n\nPozimi, ko se je voda spremenila v led, je ribnik postal drsališče celega zaselka: sneg so očistili, debelino ledu preverili, prvi koraki pa so bili vedno slovesno previdni. Drsanje je bilo med redkimi zimskimi razvedrili, ki jih kmečka vas ni mogla kupiti — čakati ga je bilo treba.\n\nMuzej vabi domačine: vsak spomin na ribnik — drsanje, napajanje živine, ribolov krapov, močenje lana ob bregu — bo zapisan kot pričevanje z imenom priče. Vsako pričevanje je nov vir; viri pa so v tem muzeju edina valuta.",
    storyEn:
      "In the traditional village the pond was a water reservoir for livestock, a refuge for birds and fish, and the local \"mirror\" in which the village saw itself. The pond at Griblje still stands today and is documented in Wikimedia Commons photographs; in summer it is visited by dragonflies and ducks, in winter by silence and memory.\n\nIn Bela krajina water is never taken for granted: the landscape is karstic, the area around Griblje has the lowest precipitation in Slovenia, and streams vanish into the limestone bedrock. Every patch of standing water was therefore precious. Ponds were dug with several purposes at once: a watering place for livestock, a water reserve against fire — the old village fire engine reached for water — and the raising of fish for the table.\n\nThe carp that grew up in the pond often waited for Christmas: a live carp, kept in the bathtub until the end, was part of the Slovene Christmas everyday until the mid-twentieth century. The pond was thus also a larder — the village's refrigerator, before electricity brought a real one.\n\nIt also held life that the farming world had little of: the springtime concert of frogs, dragonflies above the surface, ducks with ducklings in the reeds by the bank. For children the pond was a first ocean: skating in winter, catching tadpoles in summer, watching the spawn in the shallows in spring.\n\nIn winter, when the water turned to ice, the pond became the skating rink of an entire hamlet: the snow was cleared, the thickness of the ice tested, and the first steps were always ceremonially careful. Skating was among the few winter diversions a farming village could not buy — it had to be waited for.\n\nThe museum invites the locals: every memory of the pond — the skating, the watering of livestock, the carp fishing, the retting of flax by the bank — will be recorded as a testimony carrying the witness's name. Every testimony is a new source; and sources are this museum's only currency.",
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
      {
        key: "wiki-bela-krajina-geografija",
        nameSi: "Wikipedija: Bela krajina (kraška pokrajina, podnebje, padavine)",
        nameEn: "Wikipedia: Bela krajina (karst landscape, climate, precipitation)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Bela_krajina",
        noteSi: "Razlaga kraške sušnosti Bele krajine — zakaj je bila vsaka stoječa voda dragocena.",
        noteEn: "Explains the karstic dryness of Bela krajina — why every patch of standing water was precious.",
      },
      {
        key: "kpkolpa-voda",
        nameSi: "Krajinski park Kolpa: vodna in mokriščna dediščina doline",
        nameEn: "Kolpa Landscape Park: the water and wetland heritage of the valley",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.kp-kolpa.si/",
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
      "Tipična belokranjska hiša 19. stoletja je bila nizka, eno- ali dvoprostorčna stavba z apneno beljenimi stenami in streho iz ržene slame. Za najrevnejše je bila znana tudi polkoplje — delno vkopana, delno lesena bivalna enota, ki jo je zemlja varovala pred zimo in vročino. Zidali so iz najbližjega: kamen s polja, glina z dvorišča, les iz gozda — prevoz je bil dražji od materiala.\n\nVhod v hišo je vodil skozi pod — obokan hodnik z orodjem in vozom. Jedro doma je bila črna kuhinja: odprto ognjišče, krušna peč in dim, ki je v dimniku konzerviral vse, kar je bilo lesa in slame — tudi šunke in pečice, obešene do pomladi. Za kuhinjo je spala kamra; hlev pod isto streho je živini dal zaklon, hiši pa toploto, ki je šla skozi skupno steno. V zimah na robu preživetja so ljudje in živina dihali isti zrak — takšna bližina je danes težko predstavljiva, takrat pa je pomenila življenje.\n\nVsako pomlad, pred veliko nočjo, so hišo pobelili z apneno belino — obred čistoče, ki je v enem dnevu prenovil celo vas; slamnato streho so po vsaki zimi popravili z novimi snopi rži. Apnena in slama sta bili dve barvi, po katerih se pokrajina še danes prepozna: hiša, ki jo je postavila revščina, je postala njen najtrši znak.\n\nTa tip gradnje je v slovenski etnografiji izpričan za vso Belo krajino — primeri v samih Gribljah pa še čakajo na vaške fotografije in pričevanja, zato je zapis označen kot tradicija, ne kot dokumentiran vaški primer. Muzej išče: fotografijo zadnje slamne strehe v vasi, ime zadnje gazdarice, ki je apnila ob veliki noči, in zapis o hiši, ki si jo še kdo zapomni. Vsak odgovor bo zapis približal Gribljam.",
    storyEn:
      "The typical Bela krajina house of the 19th century was a low one- or two-room building with lime-whitewashed walls and a roof of rye straw. For the poorest there was also the polkoplje — a dwelling half dug into the ground, part timber, whose earth protected against winter and heat alike. It was built from what lay nearest: stone from the field, clay from the yard, timber from the wood — transport cost more than material.\n\nThe entrance led through the pod — a vaulted passage with tools and the cart. The heart of the home was the black kitchen: an open hearth, the bread oven, and smoke that preserved in the chimney everything made of wood and straw — the hams and bacons hanging there until spring. Behind the kitchen slept the kamra; the byre under the same roof gave the livestock shelter and the house a warmth that passed through the shared wall. In winters on the edge of survival people and livestock breathed the same air — a closeness hard to imagine today, but one that meant life then.\n\nEvery spring, before Easter, the house was whitewashed with lime — a rite of cleanliness that renewed the whole village in a day; after every winter the thatched roof was mended with new sheaves of rye. Lime-white and straw-gold were the two colours by which the landscape still knows itself: the house built by poverty became its most lasting sign.\n\nThis building type is attested for all of Bela krajina in Slovene ethnography — but examples in Griblje itself still await village photographs and testimonies, which is why the record is marked as tradition rather than a documented village case. The museum is looking for: a photograph of the last thatched roof in the village, the name of the last mistress who limed the walls at Easter, and a memory of a house someone still remembers. Every answer will bring the record closer to Griblje.",
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
      {
        key: "sem-stavbarstvo",
        nameSi: "Slovenski etnografski muzej — zbirke kmečkega stavbarstva in vsakdanje opreme",
        nameEn: "Slovene Ethnographic Museum — collections of vernacular architecture and household equipment",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.etno-muzej.si/",
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
      "Vinska ruta Bele krajine vodi od Metlike proti Semiču, Vinici in Dragatušu; Griblje stoji ob njenem južnem robu. Vino je v Beli krajini gospodarilo na apnencu in soncu: hribi ob Kolpi so mu dali toplo nogo, reka pa hladno glavo. Belina in modra frankinja, laški rizling in gamay — sorte, ki dajejo cviček, lahkotno belokranjsko namizno vino — tukaj uspevajo na rdeči prsti preko apnenca, ki ji v pokrajini pravijo jerina. Za mizo je vsak dan stal cviček — lahkotno vino, ki so ga pili kot vodo; črnina je prihajala ob praznike. Ta razred med vsakdanom in praznikom je bil razred cele kmečke kuhinje: vsakdan je bil reven, praznik pa je znal slaviti.\n\nNad vinogradi so stale zidnice — kamnite kleti, v katerih je imel vsak svoj hladen kotiček: mošt je v njih tiho vrel, vino pa zorelo v bukelah, dokler ni prišlo na mizo. Ob trgatvi so se v zidnicah zbirale cele družine: otroci so nosili grozdje, ženske bele sorte, možje rdeče. Jesen je bila vinska soba vasi: trgatveni vozovi, smeh in vonj mošta, ki se je dvigal iz kletnih vrat od jutra do noči — in prvi teden novembra, ko je bila vsaka hiša malo vinarska.\n\nKrona regije je metliška črnina PTP, zajamčena tradicionalna oznaka: temnejše, polnejše vino iz rdečih sort Bele krajine, katerega sloves sega v 19. stoletje. Prva ustekleničena metliška črnina je leta 1968 prišla iz metliške kleti — od takrat slovi kot vino, ki Belo krajino predstavlja po vsej državi.\n\nMuzej bo to zgodbo dopolnil z imeni gribeljskih domačij-vinogradov, ko jih bodo domačini sami vpisali — do takrat ima zapis vino regije, ne še vasi. Vsak prijavljen vinograd bo narisal nov trikotnik med hišo, hribom in kletjo: vinska karta Gribelj, ki je še nihče ni narisal.",
    storyEn:
      "The wine route of Bela krajina runs from Metlika towards Semič, Vinica and Dragatuš; Griblje stands at its southern edge. Wine in Bela krajina has ruled on limestone and sun: the hills by the Kolpa gave it a warm foot, the river a cool head. Belina and modra frankinja, Welschriesling and gamay — the varieties that yield cviček, the light Bela krajina table wine — thrive here on the red soil over limestone, known in the region as jerina. On the table cviček stood every day — a light wine drunk like water; črnina came for the holidays. That gradation between weekday and feast belonged to the whole farming kitchen: the everyday was poor, but the feast knew how to celebrate.\n\nAbove the vineyards stood the zidnice — stone cellars in which everyone kept a cool corner: the must fermented quietly in them, and the wine matured in casks until it reached the table. At harvest whole families gathered in the zidnice: the children carried the grapes, the women the white varieties, the men the red. Autumn was the village's wine room: harvest carts, laughter and the smell of must rising from the cellar doors from morning to night — and the first week of November, when every house was a little winemaker's.\n\nThe crown of the region is metliška črnina PTP, a protected traditional denomination: a darker, fuller wine from the red varieties of Bela krajina, whose renown reaches into the 19th century. The first bottled metliška črnina left the Metlika cellar in 1968 — since then it has been famed as the wine that represents Bela krajina across the country.\n\nThe museum will add the names of Griblje's wine farms as the locals enter them — until then the record holds the region's wine, not yet the village's. Every registered vineyard will draw a new triangle between house, hill and cellar: a wine map of Griblje that no one has drawn yet.",
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
      {
        key: "wiki-metliska-crnina",
        nameSi: "Wikipedija: metliška črnina (zajamčena tradicionalna oznaka)",
        nameEn: "Wikipedia: metliška črnina (protected traditional denomination)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Metli%C5%A1ka_%C4%8Drnina",
      },
      {
        key: "wiki-cvicek",
        nameSi: "Wikipedija: cviček (vrsta vina, slovenska tradicija)",
        nameEn: "Wikipedia: cviček (wine type, Slovene tradition)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Cvi%C4%8Dek",
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
      "Na jurjevo, 24. aprila, ko se »zemlja odpre«, po Beli krajini hodijo jurji — odrasli v zelenju brez in drugih dreves, z rdeče-belimi rutami in zvončki, ki z bučenjem pregnajo zimo. Ob njih pustujejo tudi lame in race, kožuhaste maske z rogovi, ki so v razlagah etnografov ostanki predkrščanske koledarske simbolike. Za kmečki koledar je bil jurij tudi dan, ko je živina prvič šla na pašnik — meja med zimskim in spomladanskim delom leta.\n\nJurji so hodili od hiše do hiše: z zelenjem v roki so stopili pod pod, zaželeli hiši zdravja, sreče in rodovitnosti ter prejeli jajca — jurjevski dar, ki ga je košara nosila naprej. Belokranjski jurji so znani po beli brezi: zeleni možje, pri katerih se ni videlo ne obraza ne obleke — le listje, zvonec in bučka. Več ko je bilo jurijev, tem globje je zima stekla iz vasi: buča je bila obljuba, da se bo pomlad držala. Ob jurjevu so po slovenskih vaseh postavljali tudi gugalnice — pomlad se je gnala skozi mladost, šega pa je znana po vsej deželi.\n\nJurjevanje je danes živ primer nematerialne dediščine: v Črnomlju poteka festival Jurjevanje v Beli krajini, najstarejši folklorni festival v Sloveniji in največji prikaz slovenskega ljudskega ustvarjanja — njegove korenine segajo v šestdeseta leta prejšnjega stoletja, današnje ime pa nosi od devetdesetih.\n\nV Gribljah so jurji hodili iz hiše v hišo — kdaj točno in kdo je bil zadnji gribeljski jurij, muzej še ne ve: zapišite nam ga. Pomlad v tej zbirki nosijo trije zapisi: jurji, štorklje in bele breze — vsak se oglasi po svojem času. Vsak nov zapis o gribeljskem jurjevanju bo pomladno stran zbirke naredil popolno.",
    storyEn:
      "On St. George's Day, 24 April, when the earth \"opens\", the jurji walk through Bela krajina — figures dressed in the greenery of birch and other trees, with red-and-white scarves and bells, drumming winter away. Alongside them carnival figures like the lame and race — horned fur masks that ethnographers read as remnants of pre-Christian calendar symbolism. For the farming calendar jurij was also the day the livestock first went to pasture — the line between the winter and the spring half of the year.\n\nThe jurji walked from house to house: with greenery in hand they stepped under the gate, wished the household health, luck and fertility, and received eggs — the jurji's gift, carried on in the basket. The Bela krajina jurji are known by the white birch: green men in whom neither face nor clothing could be seen — only leaves, a bell and a rattle. The more jurji there were, the deeper winter drained out of the village: the noise was a promise that spring would hold. Around St. George's Day the villages of Slovenia also put up swings — spring raced through the young, and the custom is known across the land.\n\nToday jurjevanje is a living example of intangible heritage: the town of Črnomelj hosts the Jurjevanje v Bela krajini festival, the oldest folklore festival in Slovenia and the largest showcase of Slovene folk creativity — its roots reach back to the 1960s, and it has carried its present name since the 1990s.\n\nIn Griblje the jurji walked from house to house — when exactly, and who was the last Griblje jurij, the museum does not yet know: write it down for us. Spring in this collection is carried by three records: the jurji, the storks and the white birches — each speaks in its own time. Every new record of Griblje's jurjevanje will complete the collection's spring side.",
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
      {
        key: "wiki-zeleni-jurij",
        nameSi: "Wikipedija: Zeleni Jurij (jurjevska šega, koledarsko leto, gugalnice)",
        nameEn: "Wikipedia: Zeleni Jurij (the St. George's custom, the folk calendar, the swings)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Zeleni_Jurij",
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
      "Belokranjska kuhinja je kuhinja kruha in žit — prav tistega, kar je dala zemlja: fižol, zelje, krompir, koruzo. Iz tega je znala narediti jedi, ki danes strežejo z imenom regije: revščina, ki se je naučila okusa. Belokranjska pogača — okrogel kruh s kuminovim posipom — je postala zaščitni znak regije: kot jed dobrodošlice, ki se lomi z rokami in ne reže, je bila leta 2011 vpisana med evropske zajamčene tradicionalne posebnosti. Ponedeljkov matevž iz rjavega fižola pa je nosil delovni teden.\n\nMatevž — rjavi fižol, kuhan mehko in pretlačen, z žlico masti in česna — je jed delovnega dne: poceni in hranilna, skuhana iz tistega, kar je doma. Ponedeljek je bil njegov dan: nedeljsko meso je bilo pojedeno, teden pa se je moral nositi naprej na fižolu in zelju.\n\nOb pustu so doma pekli salenjake — listnate, na listju ali v ponvi; njihovo ime po ljudski razlagi spominja na sal, mast, njihova plastovitost pa na listje, ki se odpira ob pomladi. Pijača praznikov je bila medlica — hladilna pijača iz medu in vode —, velikonočna jajca pa barvali z naravnimi barvami suhih rastlin, kakor jih pozna pokrajina. Potica, nadevana z orehni z lastnega vrta, je zapirala praznično mizo.\n\nKoledar jedi je sledil koledarju leta: pust so prinesli salenjaki, veliko noč pirhi in potica, jesen prvi mošt, božič pa krap iz ribnika — jedi, ki jih ta zbirka nosi vsako na svojem mestu. Muzejska zbirka kuhinje se bo gradila iz receptov vaških gospodinj: prvi je že vpisan v zgodbah, ostale čakajo. Revščina, iz katere je ta kuhinja zrasla, je postala gastronomska identiteta: jedi, ki so jih nekdaj jedli iz nuje, danes strežejo z dostojanstvom.",
    storyEn:
      "Bela krajina cuisine is a cuisine of bread and grain — precisely what the land gave: beans, cabbage, potatoes, maize. Out of it the region learned to make dishes that are today served under its name: a poverty that taught itself taste. The Bela krajina pogača — a round flatbread with a caraway crust — has become the region's trademark: as a welcome dish that is broken by hand and never cut, it was entered among the European guaranteed traditional specialities in 2011. Monday's matevž of brown beans carried the working week.\n\nMatevž — brown beans boiled soft and mashed, with a spoonful of fat and garlic — is the dish of the working day: cheap and nourishing, cooked from what was at home. Monday was its day: the Sunday meat had been eaten, and the week had to be carried on beans and cabbage.\n\nAt carnival the households baked salenjaki — layered, on leaves or in the pan; their name, by popular account, remembers sal, the fat, and their layering the leaves that open in spring. The drink of the holidays was medlica — a cooling drink of honey and water — and the Easter eggs were dyed with the natural colours of dried plants, as the region knows them. Potica, layered with walnuts from one's own garden, closed the festive table.\n\nThe calendar of dishes followed the calendar of the year: carnival brought salenjaki, Easter the painted eggs and potica, autumn the first must, Christmas the carp from the pond — dishes this collection carries each in its own place. The museum's kitchen collection will be built from village recipes: the first is already entered among the stories, the rest are awaited. The poverty from which this cuisine grew became a gastronomic identity: dishes once eaten out of need are today served with dignity.",
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
      {
        key: "wiki-pogaca",
        nameSi: "Wikipedija: belokranjska pogača (zajamčena tradicionalna posebnost, 2011)",
        nameEn: "Wikipedia: Bela krajina pogača (guaranteed traditional speciality, 2011)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Belokranjska_poga%C4%8Da",
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
      "Vsako pomlad so vasi Bele krajine sejale lan in konopljo, sredi poletja stebla potegnile z roko iz zemlje, nato pa se je začel pravi almanah: iz rastline narediti platno. Stebla so namočili v stoječi vodi — v ribniku, mlinščici ali lokvi — da je lubje zmehčalo; po suši so jih lomili, tlkli in česali, dokler ni ostal le sijoč vlaknati jed. To delo je bilo moško; zima pa je takoj zatem gospodovala ženskam.\n\nOb večerni luči, s preslico v roki, so ženske predle vso zimo — predenje je bilo hkrati delo in druženje; ob njem so se spletali pogovori, pesmi in zaroke. Spomladi je nastopila statva: lesen tkalski stroj v hiši ali v kamri. Tkalja je predivo vpletala v platno s slehernim gibom roke, čolniček pa je prehajal med nitmi kot ritem. Iz platna so nastale rjuhe, srajce in nedrčki; iz konoplje vreče in vrvi. Oblečena in opremljena je bila cela vas.\n\nVsak dom je bil hkrati delavnica. Koliko platna je imela hiša v skrinjah, je bilo merilo gospodarnosti njene gazdarice; platno je bilo tudi denar — šlo je v doto, v dar in v plačilo dolgov. Prav zato sta predenje in tkalstvo del ženske zgodovine Bele krajine: gospodarstvo, ki ga je nosila roka, ne zemlja.\n\nKo se je domače platno umaknilo tovarniškemu, so roke tkalj našle delo v belokranjskih šiviljah — zgodba o platnu se je nadaljevala v zgodbo o konfekciji. V dvajsetem stoletju je bilo šiviljstvo ena od opor krašnega gospodarstva: majhne delavnice so šile za oddaljene trge, ženske plače pa so nosile cele hiše.\n\nMuzej išče statve, ki so stale v Gribljah: fotografija vaške statve bo prvi predmet te zbirke. Predenje — predstopnja tkalstva — je na fotografiji Frana Vesela iz leta 1920: pravi dokument časa, ne predstava.",
    storyEn:
      "Every spring the villages of Bela krajina sowed flax and hemp; in midsummer they pulled the stalks from the ground by hand, and then the true almanac began: making cloth out of a plant. The stalks were retted in standing water — in a pond, a millrace or a karst pool — until the bark softened; after drying they were broken, scutched and hackled until only the silky fibrous core remained. That work was men's; the winter that followed belonged to the women.\n\nBy the evening lamp, distaff in hand, the women spun all winter — spinning was work and company at once; around it wove conversations, songs and engagements. In spring the loom took its turn: a wooden loom in the house or the chamber. With each movement of her hand the weaver interlaced the yarn into linen, and the shuttle passed between the threads like a rhythm. From the linen came sheets, shirts and chemises; from the hemp, sacks and ropes. The whole village was clothed and equipped by it.\n\nEvery household was at once a workshop. How much linen a house kept in its chests was the measure of its mistress's thrift; linen was also money — it went into dowries, into gifts and against debts. Precisely for that reason, spinning and weaving are part of the women's history of Bela krajina: an economy carried by the hand, not the land.\n\nWhen homespun gave way to factory cloth, the weavers' hands found work in the sewing shops of Bela krajina — the story of linen continued as a story of ready-made clothing. In the twentieth century the garment trade was one of the props of the karst economy: small workshops sewed for distant markets, and women's wages carried entire households.\n\nThe museum is looking for the looms that stood in Griblje: a photograph of a village loom will be the first object of this collection. Spinning — the step before weaving — survives on Fran Vesel's photograph from 1920: a true document of its time, not a reconstruction.",
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
      {
        key: "sem-tekstil",
        nameSi: "Slovenski etnografski muzej: zbirke tekstila, predenja in tkanja",
        nameEn: "Slovene Ethnographic Museum: collections of textiles, spinning and weaving",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.etno-muzej.si/",
        noteSi: "Muzej, ki hrani statve in predilne pripomočke — primerjalni kontekst vaškega tkalstva.",
        noteEn: "The museum holding looms and spinning implements — the comparative context of village weaving.",
      },
      {
        key: "wiki-lan",
        nameSi: "Wikipedija: lan (pridelava, namakanje, predenje)",
        nameEn: "Wikipedia: flax (cultivation, retting, spinning)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Lan",
        noteSi: "Letni krog lana od setve do platna — časovni okvir tkalskega koledarja.",
        noteEn: "The annual cycle of flax from sowing to cloth — the timetable of the weaver's calendar.",
      },
    ],
  },
  {
    slug: "anton-filak",
    category: "gospodarstvo",
    titleSi: "Anton Filak — prvak v oranju",
    titleEn: "Anton Filak — a ploughing champion",
    periodSi: "kmečko znanje na svetovnem odru",
    periodEn: "farming skill on the world stage",
    summarySi:
      "Kmet iz Gribelj, ki je osmkrat nastopil na svetovnih prvenstvih v oranju: brazda, ki je v vasi vsakdan, je na svetu postala šport.",
    summaryEn:
      "A farmer from Griblje who eight times took part in the world ploughing championships: the furrow that is a village everyday became a sport on the world stage.",
    storySi:
      "Griblje so kmetijstvu dale tudi poslanca: Anton Filak, osmkratni udeleženec svetovnih prvenstev v oranju. Njegova disciplina je najstarejša veščina človeka ob zemlji — vrtanje brazde —, dvignjena v merilni šport.\n\nOranje je vrhunec kmečkega znanja. Pravična brazda zahteva vse: branje prsti (jerina čez apnenec se obnaša drugače kot mokra ilovica v dolini), pravčasnost (prezgodaj — brazda se razsuje; prepozno — izgubi vlago), mirno žival in roko, ki zna plugu zaupati. V vasi se je kmet poznal po brazdi: kdo orje plitvo in poševno, kdo prav in do tal. Kdor je oral lepo, je sijal pred sosedovi očmi kot gospodar, ki zna voditi hišo.\n\nSvetovna prvenstva v oranju potekajo od leta 1953: državne ekipe tekmujejo v klasičnem in reverzibilnem oranju, sodniki pa točkujejo globino, ravnost brazde, pokritost žetvenih ostankov in čistost preloma. Oranje s konjsko vprego — korenik tega športa — je dokumentirano na fotografijah Franca Vesela iz začetka 20. stoletja; ena od njih je glavna slika tega zapisa. Tekmovanje je iz kmečke nuje naredilo disciplino: enaka roka, enak plug, le merilni trak namesto sosedovega pogleda.\n\nNajlepše pa je, da ta šport ni nikoli zapustil kmečke hiše: prvaki so ostali kmetje, ki orjejo prav tako po obmrzlih aprilskih zorjah kakor po gladki tekmovalni njivi. Oranje je bilo v Gribljah družinska znanost — oče je plug predal sinu, sin živali svojemu sinu — in prav ta veriga je nesla znanje vse do svetovnega odra.\n\nMuzej objavlja, kar ima: Filakova udeležba na osmih svetovnih prvenstvih je zapisana po javnem viru; leta nastopov, uvrstitve in sestava reprezentance še čakajo na arhiv. Ko se najdejo, se bodo dodala z virom — do takrat zapis stoji na svoji najtanejši, a trdni plasti: gribeljska brazda je šla na svet. Vsak domačin, ki si zapomni Filakovo vprego, plug ali njivo, je vabljen kot priča: ta zapis je šele začetek zgodbe.",
    storyEn:
      "Griblje gave farming an ambassador too: Anton Filak, an eight-time participant in the world ploughing championships. His discipline is the oldest skill of the human hand at the soil — cutting the furrow — raised into a measured sport.\n\nPloughing is the summit of farming knowledge. A just furrow asks everything: reading the soil (jerina over limestone behaves differently from the wet clay of the valley), timing (too early — the furrow crumbles; too late — it loses its moisture), a calm animal and a hand that knows how to trust the plough. In the village a farmer was known by his furrow: who ploughs shallow and slanting, who straight and to the depth. Whoever ploughed well shone in the neighbours' eyes as a master fit to run a house.\n\nThe world ploughing championships have been held since 1953: national teams compete in conventional and reversible ploughing, and judges score depth, straightness of the furrow, coverage of stubble and cleanliness of the split. Ploughing with a horse team — the root of this sport — is documented in Fran Vesel's photographs from the early 20th century; one of them is this record's main image. The championship turned a farming necessity into a discipline: the same hand, the same plough, only a measuring tape instead of the neighbour's eye.\n\nMost beautifully of all, the sport never left the farmhouse: the champions remained farmers, ploughing the frozen April mornings of home exactly as they ploughed the smooth competitive field. In Griblje ploughing was a family science — a father handed the plough to his son, the son the team to his own — and it was precisely that chain that carried the skill all the way to the world stage.\n\nThe museum publishes what it holds: Filak's participation in eight world championships is recorded from a public source; the years, placings and the make-up of the team still await the archive. When they are found they will be added with their source — until then the record stands on its thinnest but firmest layer: a Griblje furrow went out into the world. Every local who remembers Filak's team, plough or field is invited as a witness: this record is only the beginning of the story.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/oranje.jpg",
    imageCredit: "Foto: Fran Vesel · Wikimedia Commons · javna last",
    yearFrom: 1953,
    featured: false,
    sources: [
      {
        key: "wiki-griblje-filak",
        nameSi: "Wikipedija: Griblje (navedba Antona Filaka, osmkratnega udeleženca svetovnih prvenstev v oranju)",
        nameEn: "Wikipedia: Griblje (the mention of Anton Filak, an eight-time participant in the world ploughing championships)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Edini za zdaj javni vir o Filakovi udeležbi; leta in uvrstitve še čakajo na arhiv.",
        noteEn: "The sole public source of Filak's participation so far; the years and placings still await the archive.",
      },
      {
        key: "world-ploughing",
        nameSi: "World Ploughing Organization — svetovna prvenstva v oranju (od 1953, discipline in točkovanje)",
        nameEn: "World Ploughing Organization — the world ploughing championships (since 1953, disciplines and scoring)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://worldploughing.org/",
      },
      {
        key: "commons-oranje",
        nameSi: "Wikimedia Commons: Oranje s konjsko vprego (fotograf: Fran Vesel)",
        nameEn: "Wikimedia Commons: Ploughing with a horse team (photographer: Fran Vesel)",
        sourceType: "fotografija",
        license: "Public domain (Fran Vesel)",
        url: "https://commons.wikimedia.org/wiki/File:Oranje_s_konjsko_vprego.jpg",
        noteSi: "Avtentična etnografska fotografija oranja s konjsko vprego — glavna slika zapisa; korenina športa je kmečki vsakdan.",
        noteEn: "Authentic ethnographic photograph of ploughing with a horse team — the record's main image; the sport's root is the farming everyday.",
      },
      {
        key: "etnografija-oranje",
        nameSi: "Slovenska etnografska literatura o oranju, plugu in vpregah (tipologija)",
        nameEn: "Slovene ethnographic literature on ploughing, the plough and teams (typology)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Tipologija oranja na Slovenskem je dokumentirana; gribeljski primeri in Filakova biografija še čakajo na vire.",
        noteEn: "The typology of ploughing in Slovenia is documented; Griblje cases and Filak's biography still await sources.",
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
      "Bela štorklja se vrne iz Afrike konec marca in aprila — prav v čas, ko jurji naznanjajo pomlad. V Beli krajini gnezdi na dimnikih in drogovih, ob reki in mokriščih Kolpe išče hrano, avgusta in septembra pa se z mladiči odpravi na pot čez Balkan proti Afriki.\n\nPot je daljša, kot se zdi. Štorklje iz Slovenije letijo prek Balkana do Bosporske ožine ob Črnem morju, naprej čez Bližnji vzhod in dol po Nilu do podsaharske Afrike; ne letijo ponoči in ne čez odprta morja, ampak se dvigajo v toplotnih stolpih nad kopnim. Dnevno preletijo stotine kilometrov, na leto pa več kot deset tisoč v vsako smer. Vrnitev v isto gnezdo je zato majhen čudež navigacije brez kompasa.\n\nGnezdo je naselje, ne samo stavba: pari se vračajo k istemu dimniku, gnezdo vsako leto dograjujejo, tehta lahko več sto kilogramov, v njem pa se izmenjujejo generacije. Domačini gnezda varujejo in popravljajo — tudi s prihrano hrano, če pomladi zmanjka. Dolina Kolpe je zavarovano območje Natura 2000 prav tudi zaradi ptic ob reki: mrtvice, travniki in plitvine so štorklji jedilnik.\n\nSlovenija šteje nekaj sto parov bele štorklje; popise vodi Društvo za opazovanje in preučevanje ptic Slovenije (DOPPS), najgosteje pa vrsta gnezdi v pomurski ravnini. Bela krajina je zahodni krak te zgodbe: tu gnezda niso gosta, a je zato vsako posebej znano.\n\nVaška identiteta štorklje je izrecna: gnezdo na dimniku je čast, zato gnezda domačini varujejo in popravljajo. Muzej bo spremljal gnezda v Gribljah z vaškimi fotografi: vsako leto en posnetek, vsak posnetek en vir. Tako zbirka raste kot sam življenjski krog ptice.",
    storyEn:
      "The white stork returns from Africa at the end of March and in April — precisely when the jurji announce spring. In Bela krajina it nests on chimneys and poles, feeds by the river and wetlands of the Kolpa, and in August and September departs with its young across the Balkans towards Africa.\n\nThe journey is longer than it seems. Storks from Slovenia fly across the Balkans to the Bosphorus at the Black Sea, on over the Middle East and down the Nile to Sub-Saharan Africa; they do not fly at night, nor over open seas, but climb the thermal towers above the land. They cover hundreds of kilometres a day, and more than ten thousand in each direction every year. The return to the same nest is a small miracle of navigation without a compass.\n\nThe nest is a settlement, not merely a structure: pairs return to the same chimney, rebuild the nest each year, until it can weigh several hundred kilograms, and generations succeed one another within it. The households protect and mend the nests — even with spare food when a spring runs hungry. The Kolpa valley is a protected Natura 2000 site precisely because of its riverside birds: backwaters, meadows and shallows are the stork's menu.\n\nSlovenia counts a few hundred pairs of white storks; the censuses are led by the Bird Watching and Study Association of Slovenia (DOPPS), and the densest colonies stand in the Pomurje plain. Bela krajina is the western arm of the story: the nests here are not many, and each one is therefore known by name.\n\nThe village identity of the stork is explicit: a nest on one's chimney is an honour, so the households protect and repair the nests. The museum will follow the nests of Griblje with village photographers: one photograph a year, every photograph a source. Thus the collection grows like the bird's own life cycle.",
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
      {
        key: "dopps-storklja",
        nameSi: "DOPPS — Ptice Slovenije: bela štorklja (popisi, varstvo, selitve)",
        nameEn: "DOPPS — Birds of Slovenia: the white stork (censuses, protection, migration)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.ptice.si/",
        noteSi: "Društvo, ki v Sloveniji šteje gnezda bele štorklje — podlaga za podatke o gnezdih.",
        noteEn: "The association that counts Slovenia's white stork nests — the basis for the nesting data.",
      },
      {
        key: "wiki-storklja",
        nameSi: "Wikipedija: bela štorklja (biologija, selitvene poti, gnezdenje)",
        nameEn: "Wikipedia: white stork (biology, migration routes, nesting)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Bela_%C5%A1torklja",
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
      "Belina breza (Betula pendula) je pionirska drevesna vrsta, ki osvaja svetle gozdne robe in opuščene travnike — po zadnji ledeni dobi je bila med prvimi drevesi, ki so se vrnila v odprto Evropo. V Beli krajini je postala identiteta: »bela« pokrajine se razkriva ne le po apneno beljenih stenah hiš in belem kruhu, ampak tudi po beli skorji brez.\n\nPo beli skorji so črne črtice — ljudje so v njih videli pisanje, ki ga ni nihče naučil brati. Iz lesa so nastajali rogovi in korita, iz lubja obroči in zdravilni obkladki, iz vej metle, ki so pometale dvorišča, iz brstov pa čaj; spomladi so iz ranjenega debla natačili sok — hladno, bistro pijačo, ki so jo imeli za prvo pomladansko zdravilo. V slovenski pripovedi je breza drevo začetkov: prva se zaseli opuščeno zemljo, prva ozeleni rob gozda, kjer je prej pihal samo veter.\n\nJurji so se oblekli v njeno zelenje — v zapisu o jurjevanju ta šega stoji skupaj z razlagami o pomladi. Breza je pokrajini dala tudi obraz: kdor hodi ob Kolpi, jo vidi na vsakem koraku — ob bregovih, na robu vinogradov, za vaškimi hlevi. Bela krajina brez breze ne bi bila bela; ime dežele se zdi njen osebni dar.\n\nMuzej ima brezo za enega od osrednjih motivov: obiskovalca vabimo, da fotografira eno samo brezo v Gribljah ob vsakem obisku — iz tisočih posnetkov bo nekoč nastala letna galerija vasi. Breza je letni čas v drevesu: spomladi svetla, jeseni zlata, pozimi samo še bela črta na hribu — enaka vasi, ki jo piše.",
    storyEn:
      "The silver birch (Betula pendula) is a pioneer tree that colonises bright forest edges and abandoned meadows — after the last ice age it was among the first trees to return to open Europe. In Bela krajina it became an identity: the region's \"white\" reveals itself not only in the lime-whitewashed house walls and the white bread, but in the birch's white bark.\n\nAcross the white bark run black marks — people saw in them a writing no one had taught them to read. Its wood gave horns and troughs, its bark hoops and healing poultices, its twigs the besoms that swept the yards, its buds a tea; in spring the sap was tapped from the wounded trunk — a cold, clear drink held to be the first medicine of spring. In Slovene tale the birch is the tree of beginnings: the first to settle abandoned ground, the first to green the edge of a wood where only wind blew before.\n\nThe jurji dressed in its greenery — in the record on jurjevanje that custom stands together with the readings of spring. The birch gave the landscape its face as well: whoever walks along the Kolpa sees it at every step — by the banks, on the edge of the vineyards, behind the village byres. Bela krajina would not be white without the birch; the region's name seems its personal gift.\n\nThe museum takes the birch as one of its central motifs: visitors are invited to photograph a single birch in Griblje on every visit — one day, an annual gallery of the village will grow out of a thousand frames. The birch is a season in a tree: bright in spring, golden in autumn, in winter only a white line on the hill — like the village it writes.",
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
      {
        key: "wiki-breza",
        nameSi: "Wikipedija: navadna breza (Betula pendula — biologija, razširjenost)",
        nameEn: "Wikipedia: silver birch (Betula pendula — biology, distribution)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Navadna_breza",
      },
    ],
  },
  {
    slug: "vaska-sola",
    category: "kraj",
    titleSi: "Vaška šola — iz tablic v svet",
    titleEn: "The village school — from slates into the world",
    periodSi: "1869 → danes",
    periodEn: "1869 → present",
    summarySi:
      "Cesarjev šolski zakon je vsaki vasi podaril branje in računanje; v Beli krajini je šola delovala celo pod okupacijo — v Črnomlju kot partizanska gimnazija.",
    summaryEn:
      "The Emperor's school law gave every village reading and arithmetic; in Bela krajina the school worked even under occupation — in Črnomelj as a Partisan gymnasium.",
    storySi:
      "Leta 1869 je Dunaj izdal Reichsvolksschulgesetz — državni zakon, ki je šolanje naredil za dolžnost vsakega otroka od šestega do štirinajstega leta. Po deželah cesarstva so zrasle vaške šole: ena učilnica, en učitelj, vsi razredi hkrati. Kdaj je takšna šola prišla v Griblje, v kateri hiši je stala in kdo je v njej učil — te podatke zbirka še išče; zapis gradi na dokumentiranem svetu, ki je obdajal vsako vaško šolo tistega časa.\n\nVaška šola je imela svoj vrstni red: tablica namesto zvezka, kreda namesto peresa, ustno štetje do sto in abecednik pod blazino. Vrstni red je prestavljal tudi kmetijsko leto — ob žetvi in senašbi so klopi stale prazne, saj so otroške roke na kmetiji štele toliko kot odrasle. Vsak izpeljan šolski dan je bila zato majhna zmaga.\n\nKdor je znal brati, je v vas zanesel svet: časopis, ki so si ga podajali od hiše do hiše, in pisma iz Amerike, ki so jih družine poslušale pri petrolijevi luči. Branje je bilo oblika vaške pošte, šola pa njen urad. Iz nje so zrasle poti, ki jih ta zbirka že pozna: Niko Županič, deček iz Gribelj, je postal univerzitetni profesor; Anton Filak, roka od pluga, svetovni prvak v oranju.\n\nBela krajina je šoli dodala še eno poglavje: med drugo svetovno vojno je bila eno najbolj svobodnih ozemelj okupirane Evrope — s šolami, tiskarnami in bolnišnicami. Po italijanski kapitulaciji septembra 1943 je v Črnomlju delovala partizanska gimnazija; stavba na fotografiji tega zapisa je ravno ona — danes glasbena šola. V letu, ko je bil pouk po Evropi prepovedan ali razseljen, je dežela ob Kolpi zmogla celo gimnazijo.\n\nPred podružnično šolo OŠ Loka v Gribljah danes stoji spomenik trinajstim padlim vaščanom — šola in spomin na istem pragu (zapis spomenik-padlim). Muzej išče razredne fotografije, imena učiteljev in učne knjige z imeni gribeljskih otrok. Vaška šola je zapustila največ arhiva in najmanj spomina: kdo pa si danes še zapomni, kaj je bilo napisano na tablici?",
    storyEn:
      "In 1869 Vienna issued the Reichsvolksschulgesetz — an imperial law that made schooling the duty of every child from six to fourteen. Across the lands of the Empire village schools grew up: one classroom, one teacher, all the grades at once. When such a school came to Griblje, in which house it stood and who taught in it — these details the collection is still seeking; this record builds on the documented world that surrounded every village school of that time.\n\nThe village school kept its own order: a slate instead of an exercise book, chalk instead of a pen, counting aloud to a hundred and a primer under the pillow. The order shifted with the farming year as well — at harvest and haying the benches stood empty, for on a farm children's hands counted as much as grown ones. Every completed school day was therefore a small victory.\n\nWhoever could read carried the world into the village: the newspaper passed from house to house, and the letters from America that families listened to by the petroleum lamp. Reading was a form of the village post, and the school was its office. Out of it grew the roads this collection already knows: Niko Županič, the boy from Griblje, became a university professor; Anton Filak, a hand from the plough, a world champion of ploughing.\n\nBela krajina added another chapter to the school: during the Second World War it was one of the freest territories of occupied Europe — with schools, print shops and hospitals. After the Italian capitulation in September 1943 a Partisan gymnasium operated in Črnomelj; the building in this record's photograph is precisely that one — today a music school. In a year when lessons across Europe were forbidden or scattered, the land by the Kolpa sustained even a grammar school.\n\nBefore the branch school of OŠ Loka at Griblje stands the memorial to the thirteen fallen villagers — school and memory on the same threshold (see the record of the memorial). The museum is looking for class photographs, teachers' names and schoolbooks bearing the names of Griblje's children. The village school left behind the greatest archive and the least memory: who today still remembers what was written on the slate?",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/sola-crnomelj.jpg",
    imageCredit: "Foto: Bb63lj · Wikimedia Commons · CC BY 4.0",
    yearFrom: 1869,
    featured: false,
    sources: [
      {
        key: "wiki-rvsg",
        nameSi: "Wikipedija (DE): Reichsvolksschulgesetz 1869 (obvezno šolstvo 6–14 v cesarstvu)",
        nameEn: "Wikipedia (DE): Reichsvolksschulgesetz 1869 (compulsory schooling 6–14 in the Empire)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://de.wikipedia.org/wiki/Reichsvolksschulgesetz",
        noteSi:
          "Cesarjev zakon, iz katerega so zrasle vaške šole slovenskih dežel.",
        noteEn:
          "The imperial law out of which the village schools of the Slovene lands grew.",
      },
      {
        key: "commons-sola-crnomelj",
        nameSi:
          "Wikimedia Commons: stavba partizanske gimnazije v Črnomlju, danes glasbena šola (avtor: Bb63lj)",
        nameEn:
          "Wikimedia Commons: the building of the Partisan gymnasium in Črnomelj, today a music school (author: Bb63lj)",
        sourceType: "fotografija",
        license: "CC BY 4.0 (avtor: Bb63lj)",
        url: "https://commons.wikimedia.org/wiki/File:Glasbena_%C5%A1ol_%C4%8Crnomelj,_med_drugo_svetovno_vojno_partizanska_gimnazija.jpg",
        noteSi:
          "Glavna slika zapisa: stavba v Črnomlju, ne v Gribljah — priča partizanske gimnazije in edini fotografirani kos te zgodbe.",
        noteEn:
          "The record's main image: a building in Črnomelj, not in Griblje — a witness of the Partisan gymnasium and the only photographed piece of that story.",
      },
      {
        key: "commons-vaska-sola",
        nameSi:
          "Wikimedia Commons: Vaška šola (19. st.) — žanrska slika neznanega slikarja, Narodni muzej Slovenije",
        nameEn:
          "Wikimedia Commons: Village School (19th c.) — a genre painting by an unknown painter, National Museum of Slovenia",
        sourceType: "fotografija",
        license: "Public domain",
        url: "https://commons.wikimedia.org/wiki/File:Va%C5%A1ka_%C5%A1ola_(19._st.).jpg",
        noteSi:
          "Časovna upodobitev vaške učilnice 19. stoletja iz muzejske zbirke — primerjalni kontekst šole, kakršna je delovala po slovenskih vaseh.",
        noteEn:
          "A period depiction of a 19th-century village classroom from a museum collection — the comparative context of a school as it worked across Slovene villages.",
      },
      {
        key: "nms-slike",
        nameSi: "Narodni muzej Slovenije: zbirka slik (žanrske upodobitve vsakdanjega življenja)",
        nameEn: "National Museum of Slovenia: the painting collection (genre depictions of everyday life)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.nms.si/",
      },
      {
        key: "wiki-crnomelj",
        nameSi: "Wikipedija: Črnomelj (mesto, v katerem je delovala partizanska gimnazija)",
        nameEn: "Wikipedia: Črnomelj (the town in which the Partisan gymnasium operated)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/%C4%8Crnomelj",
      },
      {
        key: "kamra-spomenik-ola",
        nameSi: "Kamra (Knjižnica Črnomelj): spomenik padlim partizanom in žrtvam vasi Griblje stoji pred podružnično šolo OŠ Loka (EŠD 19326)",
        nameEn: "Kamra (Črnomelj Library): the memorial to Griblje's fallen Partisans and victims stands before the branch school of OŠ Loka (EŠD 19326)",
        sourceType: "spletni-vir",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/mm-elementi/spomenik-padlim-partizanom-in-zrtvam-v-narodnoosvobodilnem-boju/",
      },
    ],
  },
  {
    slug: "zaseda-1941",
    category: "vojna",
    titleSi: "Zaseda na cesti Črnomelj–Griblje — 6. september 1941",
    titleEn: "The ambush on the Črnomelj–Griblje road — 6 September 1941",
    periodSi: "1941 (italijanska okupacija)",
    periodEn: "1941 (the Italian occupation)",
    summarySi:
      "Prva oborožena akcija belokranjskih partizanov na vaškem pragu: 6. septembra 1941 so iz zasede napadli patruljo italijanske mejne policije, ki je peljala strelivo za postojanko v Gribljah.",
    summaryEn:
      "The first armed action of Bela krajina's Partisans at the village's doorstep: on 6 September 1941 they ambushed a patrol of the Italian border police carrying ammunition for the post at Griblje.",
    storySi:
      "April 1941 je vojna prispela na Kolpo: jugoslovanska država se je razpadla, Bela krajina pa padla pod italijansko oblast in bila priključena Ljubljanski pokrajini — ozemlju, ki si ga je fašistična Italija izmerila zase. Ob reki in cestah so zrasle postojanke; ena od njih je stala v Gribljah, kjer je italijanska mejna policija nadzirala prehode, promet in mejo. Okupacija ni bila tiha: racije, prepovedi, oddaja žita in živine — in strah, ki se ni zapisal v arhive.\n\n6. septembra 1941, poleti in sredi dneva, se je na cesti med Črnomljem in Gribljami zgodilo nekaj, kar Belo krajino uvršča med najzgodnejši odpor v Sloveniji. Štirje borci belokranjske partizanske skupine, zbrane v taborišču na Židovcu, so iz zasede napadli patruljo italijanskih mejnih policistov, ki je iz Črnomlja peljala hrano in strelivo za postojanko v Gribljah. Dva pripadnika patrulje sta na mestu umrla, trije so bili ranjeni; eden od ranjenih je umrl pozneje. Za vas ob Kolpi se je druga svetovna vojna začela tistega dne — ne z fronto od daleč, ampak s streljanjem na lastni cesti.\n\nTa zapis pomika vojno zgodovino Gribelj tri leta nazaj: dosedanja zbirka se je začenjala z letom 1944, z zavezniškimi letali nad poljem. Imena štirih borcev zasede, usoda postojanke in podrobnosti dneva še čakajo na arhiv in spomin domačinov — muzej te vrzeli izrecno priznava, namesto da bi jih zapolnil z domnevo.\n\nKraj spopada ni pozabljen. 24. julija 1960 so na cesti Črnomelj–Griblje postavili spominski kamen po načrtu kiparja Jakoba Savinška; Zavod za varstvo kulturne dediščine Slovenije ga vodi v registru nepremične kulturne dediščine pod številko EŠD 19324. Skupaj s spomenikom trinajstim padlim vaščanom pred šolo (EŠD 19326) zida isti spomin: vojna v Gribljah ni trajala od 1944 — trajala je od prvega septembrskega dne 1941.",
    storyEn:
      "April 1941 brought the war to the Kolpa: the Yugoslav state collapsed, and Bela krajina fell under Italian authority, annexed to the Province of Ljubljana — territory Fascist Italy had measured out for itself. Posts grew up along the river and the roads; one of them stood at Griblje, where the Italian border police controlled crossings, traffic and the border. The occupation was not silent: raids, prohibitions, the requisition of grain and livestock — and a fear that never wrote itself into the archives.\n\nOn 6 September 1941, in summer and in broad daylight, something happened on the road between Črnomelj and Griblje that places Bela krajina among the earliest resistance in Slovenia. Four fighters of the Bela krajina Partisan group, gathered in the camp at Židovec, ambushed a patrol of Italian border police carrying food and ammunition from Črnomelj to the post at Griblje. Two of the patrol died on the spot, three were wounded; one of the wounded died later. For the village on the Kolpa, the Second World War began that day — not with a distant front, but with shooting on its own road.\n\nThis record moves Griblje's war history three years back: until now the collection began with 1944 and the Allied aircraft over the field. The names of the four fighters, the fate of the post and the details of the day still await the archive and the villagers' memory — the museum openly admits these gaps rather than filling them with conjecture.\n\nThe site of the fighting is not forgotten. On 24 July 1960 a memorial stone, designed by the sculptor Jakob Savinšek, was raised on the Črnomelj–Griblje road; the Institute for the Protection of Cultural Heritage of Slovenia keeps it in the register of immovable cultural heritage under EŠD 19324. Together with the memorial to the thirteen fallen villagers before the school (EŠD 19326) it builds the same memory: the war at Griblje did not last from 1944 — it lasted from that first September day of 1941.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/zaseda-1941.jpg",
    imageCredit:
      "Foto: neznani avtor, 1941 · Wikimedia Commons · javna last — parada karabinjerjev v Ljubljani (ilustrativna fotografija okupacijske sile)",
    yearFrom: 1941,
    lat: 45.5706,
    lng: 15.2848,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "kamra-napad",
        nameSi: "Kamra (Knjižnica Črnomelj): Spomenik napadu na italijanske mejne policiste — zaseda 6. 9. 1941, spominski kamen Jakoba Savinška 24. 7. 1960, EŠD 19324",
        nameEn: "Kamra (Črnomelj Library): The memorial to the attack on the Italian border police — the ambush of 6 September 1941, the memorial stone by Jakob Savinšek of 24 July 1960, EŠD 19324",
        sourceType: "spletni-vir",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/mm-elementi/spomenik-napadu-na-italijanske-mejne-policiste/",
        noteSi: "Popis spominskih obeležij občine Črnomelj: datum, potek in žrtve zasede; postojanka v Gribljah.",
        noteEn: "The survey of the municipality's memorials: the date, course and victims of the ambush; the post at Griblje.",
      },
      {
        key: "kamra-spominska-zbirka",
        nameSi: "Kamra: digitalna zbirka Spominska obeležja v občini Črnomelj (Knjižnica Črnomelj, 2018)",
        nameEn: "Kamra: the digital collection Memorials of the Municipality of Črnomelj (Črnomelj Library, 2018)",
        sourceType: "spletni-vir",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/digitalne-zbirke/spominska-obelezja-v-obcini-crnomelj/",
        noteSi: "Celoten popis spominskih obeležij po krajevnih skupnostih, vključno s KS Griblje.",
        noteEn: "The complete survey of memorials by local community, including the Griblje local community.",
      },
      {
        key: "wiki-ljubljanska-pokrajina",
        nameSi: "Wikipedija: Ljubljanska pokrajina (1941–1943)",
        nameEn: "Wikipedia: the Province of Ljubljana (1941–1943)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Ljubljanska_pokrajina",
        noteSi: "Okupacijski okvir: priključitev Bele krajine Ljubljanski pokrajini.",
        noteEn: "The occupation framework: the annexation of Bela krajina to the Province of Ljubljana.",
      },
      {
        key: "commons-karabinjerji",
        nameSi: "Wikimedia Commons: Parada karabinjerov v Ljubljani (1941, neznani avtor)",
        nameEn: "Wikimedia Commons: Parade of carabinieri in Ljubljana (1941, unknown author)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Parada_karabinjerov_v_Ljubljani.jpg"),
        noteSi: "Glavna slika zapisa: parada v Ljubljani, ne dogodek v Gribljah — ilustrativna fotografija okupacijske sile, katere postojanka je stala v vasi.",
        noteEn: "The record's main image: a parade in Ljubljana, not the event at Griblje — an illustrative photograph of the occupying force whose post stood in the village.",
      },
    ],
  },
  {
    slug: "spomenik-padlim",
    category: "vojna",
    titleSi: "Spomenik padlim vaščanom — trinajst imen",
    titleEn: "The memorial to the fallen villagers — thirteen names",
    periodSi: "1961 → danes",
    periodEn: "1961 → present",
    summarySi:
      "Pred podružnično šolo v Gribljah stoji kamniti spomenik trinajstim vaščanom, ki jih je vzela druga svetovna vojna; odkrili so ga 10. septembra 1961.",
    summaryEn:
      "Before the branch school at Griblje stands the stone memorial to the thirteen villagers taken by the Second World War; it was unveiled on 10 September 1961.",
    storySi:
      "Druga svetovna vojna je iz Gribelj vzela trinajst imen. Enajst vaščanov je padlo v boju kot partizani, dva pa sta umrla kot žrtvi fašističnega nasilja. Za vsako od teh številk je stal nekdo, ki je nosil ime, hišo in sosedstvo: sin, brat, sosed. Zgodovina, ki jo nosi en sam kamen.\n\nSpomenik sta postavila in odkrila vaščana sama — Krajevni odbor Zveze borcev Griblje — 10. septembra 1961, šestnajst let po koncu vojne, ko so bili spomini še živi in imena še niso bila vprašanje. Stoji pred podružnično šolo Osnovne šole Loka v Gribljah: na pragu, kjer se vsak dan zbira otroški vrstni red, ki se ga je vojna dotaknila najbolj nepravično. Zavod za varstvo kulturne dediščine Slovenije vodi spomenik v registru nepremične kulturne dediščine pod številko EŠD 19326.\n\nKamen ima v tej zbirki soseda: kmalu proti Črnomlju, na isti cesti, stoji spominski kamen zasede iz septembra 1941 (zapis zaseda-1941) — prve oborožene akcije partizanov v okolici. Skupaj pričata, da vojna ni prišla v Griblje z zavezniškimi letali leta 1944, ampak tri leta prej: z okupacijo, postojanko in prvim strelom. Trinajst imen na spomeniku je najkrajši in najtežji seznam, ki ga ta muzej lahko objavi.\n\nTa zapis je odkrito nepopoln: fotografija gribljanskega spomenika še ni v zbirki — slika tega zapisa je partizansko spominsko obeležje v Trebenčah, podobnega kamna in istega spomina, da zgodba ne stoji brez obraza. Pravi posnetek kamna z imeni bo muzej najraje prejel od domačina. Enako velja za prepis trinajstih imen s spomenika: ta seznam bo dopolnil spominsko knjigo muzeja — in rodovine, ki jih nosijo.",
    storyEn:
      "The Second World War took thirteen names from Griblje. Eleven villagers fell in battle as Partisans; two died as victims of Fascist violence. Behind each of those numbers stood someone who carried a name, a house and a neighbourhood: a son, a brother, a neighbour. A history carried by a single stone.\n\nThe memorial was raised and unveiled by the villagers themselves — the Griblje local board of the Veterans' Association — on 10 September 1961, sixteen years after the war's end, when memories were still living and names were not yet a question. It stands before the branch school of Osnovna šola Loka at Griblje: on the threshold where the children's daily order gathers — the order the war touched most unjustly. The Institute for the Protection of Cultural Heritage of Slovenia keeps the memorial in the register of immovable cultural heritage under EŠD 19326.\n\nThe stone has a neighbour in this collection: a little way towards Črnomelj, on the same road, stands the memorial stone of the September 1941 ambush (see the record of the ambush) — the first armed action of the Partisans in the area. Together they testify that the war did not come to Griblje with the Allied aircraft of 1944, but three years earlier: with the occupation, a garrison post and the first shot. The thirteen names on the memorial are the shortest and heaviest list this museum can ever publish.\n\nThis record is openly incomplete: a photograph of the Griblje memorial is not yet in the collection — the image of this record is a Partisan memorial at Trebenče, of similar stone and the same remembrance, so that the story does not stand without a face. A true photograph of the stone with its names the museum would most gladly receive from a villager. The same holds for the transcription of the thirteen names: that list will complete the museum's memorial book — and the families that carry them.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/spomenik-padlim.jpg",
    imageCredit:
      "Foto: Doremo · Wikimedia Commons · CC BY-SA 3.0 — partizansko obeležje v Trebenčah (ilustrativna fotografija podobnega spomenika)",
    yearFrom: 1961,
    lat: 45.5754,
    lng: 15.2928,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "kamra-spomenik",
        nameSi: "Kamra (Knjižnica Črnomelj): Spomenik padlim partizanom in žrtvam v narodnoosvobodilnem boju vasi Griblje — 13 žrtev, odkritje 10. 9. 1961, EŠD 19326",
        nameEn: "Kamra (Črnomelj Library): The memorial to Griblje's fallen Partisans and victims — 13 victims, unveiled 10 September 1961, EŠD 19326",
        sourceType: "spletni-vir",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/mm-elementi/spomenik-padlim-partizanom-in-zrtvam-v-narodnoosvobodilnem-boju/",
        noteSi: "Število žrtev (11 padlih + 2 žrtvi fašističnega nasilja), odkritelj in lega pred podružnično šolo OŠ Loka.",
        noteEn: "The number of victims (11 fallen + 2 victims of Fascist violence), the unveilers and the position before the branch school of OŠ Loka.",
      },
      {
        key: "kamra-spominska-zbirka-19326",
        nameSi: "Kamra: digitalna zbirka Spominska obeležja v občini Črnomelj (Knjižnica Črnomelj, 2018)",
        nameEn: "Kamra: the digital collection Memorials of the Municipality of Črnomelj (Črnomelj Library, 2018)",
        sourceType: "spletni-vir",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/digitalne-zbirke/spominska-obelezja-v-obcini-crnomelj/",
        noteSi: "Celoten popis spominskih obeležij po krajevnih skupnostih, vključno s KS Griblje.",
        noteEn: "The complete survey of memorials by local community, including the Griblje local community.",
      },
      {
        key: "zvkds-register-19326",
        nameSi: "Zavod za varstvo kulturne dediščine Slovenije — register nepremične kulturne dediščine (EŠD)",
        nameEn: "Institute for the Protection of Cultural Heritage of Slovenia — the register of immovable cultural heritage (EŠD)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.zvkds.si/",
        noteSi: "Vodilni vir številk EŠD za spomenik (19326) in obe obeležji ob cesti Črnomelj–Griblje.",
        noteEn: "The leading source of the EŠD numbers for the memorial (19326) and both monuments on the Črnomelj–Griblje road.",
      },
      {
        key: "commons-trebence",
        nameSi: "Wikimedia Commons: Trebenče, Slovenija — partizansko spominsko obeležje (avtor: Doremo)",
        nameEn: "Wikimedia Commons: Trebenče, Slovenia — a Partisan memorial (author: Doremo)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Doremo)",
        url: WM("Treben%C4%8De_Slovenia_-_Partisan_memorial.JPG"),
        noteSi: "Glavna slika zapisa: obeležje v Trebenčah — ilustrativna fotografija podobnega spomenika; fotografija gribljanskega kamna je še neobdelana (TO_COLLECT).",
        noteEn: "The record's main image: the memorial at Trebenče — an illustrative photograph of a similar monument; a photograph of the Griblje stone is still to be collected (TO_COLLECT).",
      },
    ],
  },
  {
    slug: "griblje-v-stevilkah",
    category: "kraj",
    titleSi: "Griblje v številkah",
    titleEn: "Griblje in numbers",
    periodSi: "1468 → danes",
    periodEn: "1468 → present",
    summarySi:
      "Griblach 1468, Briglach 1490, Grüble — in 329 prebivalcev danes: zapis, ki vas prešteje od prve omembe do zadnjega popisa.",
    summaryEn:
      "Griblach 1468, Briglach 1490, Grüble — and 329 inhabitants today: the record that counts the village from its first mention to the latest census.",
    storySi:
      "Najstarejši pisni obris vasi je črka iz leta 1468: listina, v kateri se vas zapiše kot Griblach. Sledita Briglach (1490) in Griblah (1593); v urbarjih in na najstarejšem zemljevidu je oblika Grüble. Petsto petdeset let pozneje isto ime stoji na cestnih tabelah in v podatkovnih bazah — ime, starejše od skoraj vsega, kar danes v vasi stoji.\n\nKaj ime pomeni, je med jezikoslovci še danes odprto vprašanje. Marko Snoj v Etimološkem slovarju slovenskih zemljepisnih imen navaja štiri poti: narečni grib (goba, jurček), griba (gruda, kep zemlje), besedo sorodno hrvaškemu griblja (brazda) in griva (travnata strmina). Domača razlaga — gribljati, brazdati, orati — je ena od teh poti, ne edina: tudi etimologija je iskrenost, ne izročilo.\n\nIn potem so tu številke, ki jih znajo samo uradi: Griblje merijo 3,45 kvadratnega kilometra na 153,4 metra nad morjem; poštna številka je 8332 Gradac. Na popisu leta 2020 je vas štela 334 prebivalcev — 172 moških in 162 žensk; leta 2026 jih letna statistika beleži 329. Številke se premikajo kot reka: počasi, a stalno. Njihovi odtisi so večji: val izseljenstva, ki ima v tej zbirki svoj zapis, je nekoč odnesel več ljudi, kot jih danes živi v vasi.\n\nV zaselkih — Dolnje Griblje, Brinsko selo, Srednje Griblje in Gornje Griblje — se številke razraščajo v hiše: rodovinske hiše ob cesti, ki jih obiskovalec šteje s prsti, muzej pa po imenih. Aerofotografija tega zapisa drži celotno vas v enem kadru — veriga zaselkov, ribnik za hišami, dolina Kolpe na robu — in številkam doda še eno, ki je ni v nobenem popisu: razsežnost, ki jo vidi samo ptič.\n\nStatistika je za muzej čudovito orodje: ne pripoveduje, ampak preračunava zgodbo. Koliko let ima vas, koliko ljudi jo danes nosi, koliko jih je nosila nekoč — vse to se da zložiti v eno samo jutro ob ribniku. Ta zapis bo muzej osveževal z vsakim novim popisom: zgodovina, ki znova šteje sebe.",
    storyEn:
      "The oldest written outline of the village is a letter from 1468: a document in which the village is written Griblach. Briglach (1490) and Griblah (1593) follow; in the urbars and on the oldest map the form is Grüble. Five hundred and fifty years later the same name stands on the road signs and in the databases — a name older than almost everything that stands in the village today.\n\nWhat the name means remains, among linguists, an open question to this day. In his Etymological Dictionary of Slovene Place Names Marko Snoj lists four paths: the dialect grib (a mushroom, a Boletus), griba (a clod of soil), a word related to Croatian griblja (a furrow), and griva (a grassy slope). The local explanation — gribljati, to furrow, to plough — is one of those paths, not the only one: etymology too is honesty, not folklore.\n\nAnd then there are the numbers only offices know: Griblje measure 3.45 square kilometres at 153.4 metres above the sea; the postal code is 8332 Gradac. At the 2020 census the village counted 334 inhabitants — 172 men and 162 women; in 2026 the annual statistics record 329. Numbers move like the river: slowly, but constantly. Their impressions are larger: the wave of emigration, which has its own record in this collection, once carried away more people than live in the village today.\n\nIn the hamlets — Dolnje Griblje, Brinsko selo, Srednje Griblje and Gornje Griblje — the numbers branch into houses: family houses along the road that a visitor counts on fingers, and the museum by names. The aerial photograph of this record holds the whole village in a single frame — the chain of hamlets, the pond behind the houses, the Kolpa valley at the edge — and adds one more number that appears in no census: a dimension only a bird can see.\n\nStatistics are a wonderful tool for a museum: it does not narrate, it recalculates the story. How old the village is, how many people carry it today, how many carried it once — all of it can be folded into a single morning by the pond. This record the museum will refresh with every new census: a history that counts itself anew.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-aerofoto.jpg",
    imageCredit:
      "Foto: Alanorlic · Wikimedia Commons · CC BY-SA 4.0 — aerofotografija Gribelj (2018)",
    yearFrom: 1468,
    lat: 45.5754,
    lng: 15.2928,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "wikidata-griblje",
        nameSi: "Wikidata: Griblje (Q2531566) — popis 2020: 334 prebivalcev (172 M, 162 Ž), površina, nadmorska višina",
        nameEn: "Wikidata: Griblje (Q2531566) — the 2020 census: 334 inhabitants (172 M, 162 F), area, elevation",
        sourceType: "spletni-vir",
        license: "CC0 1.0",
        url: "https://www.wikidata.org/wiki/Q2531566",
        noteSi: "Odprti strukturirani podatki z navedbo Statističnega urada RS.",
        noteEn: "Open structured data citing the Statistical Office of the Republic of Slovenia.",
      },
      {
        key: "surs-prebivalstvo",
        nameSi: "Statistični urad RS: Prebivalstvo po spolu in po starosti, občine in naselja (podatkovna zbirka 05C5003S)",
        nameEn: "Statistical Office of the Republic of Slovenia: Population by sex and age, municipalities and settlements (dataset 05C5003S)",
        sourceType: "objava",
        license: "javna informacija / public information",
        url: "https://pxweb.stat.si/SiStatData/pxweb/sl/Data/-/05C5003S.px",
        noteSi: "Letni podatki o prebivalstvu naselij — 329 prebivalcev (2026).",
        noteEn: "Annual settlement population data — 329 inhabitants (2026).",
      },
      {
        key: "wiki-griblje-en-stevilke",
        nameSi: "Wikipedia (EN): Griblje (zgodovinska imena 1468–1593 in etimologija po Snojevem slovarju)",
        nameEn: "Wikipedia (EN): Griblje (historical names 1468–1593 and etymology per Snoj's dictionary)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Griblje",
        noteSi: "Najstarejše zapise vasi in jezikoslovno razlago imena navaja po primarnih virih.",
        noteEn: "Cites the village's oldest records and the linguistic explanation of the name from primary sources.",
      },
      {
        key: "snoj-esim-stevilke",
        nameSi: "Marko Snoj: Etimološki slovar slovenskih zemljepisnih imen, Modrijan, Ljubljana 2009, str. 153",
        nameEn: "Marko Snoj: Etymological Dictionary of Slovene Place Names, Modrijan, Ljubljana 2009, p. 153",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi: "Izvor imena Griblje kot jezikoslovno odprto vprašanje (grib, griba, griblja, griva).",
        noteEn: "The origin of the name Griblje as an open linguistic question (grib, griba, griblja, griva).",
      },
      {
        key: "commons-aerofoto",
        nameSi: "Wikimedia Commons: Pond Griblje — aerofotografija vasi in ribnika (avtor: Alanorlic, 2018)",
        nameEn: "Wikimedia Commons: Pond Griblje — an aerial photograph of the village and pond (author: Alanorlic, 2018)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (avtor: Alanorlic)",
        url: WM("Pond_Griblje.jpg"),
        noteSi: "Glavna slika zapisa: celotna vas v enem kadru — zaselki, ribnik in dolina Kolpe.",
        noteEn: "The record's main image: the whole village in a single frame — the hamlets, the pond and the Kolpa valley.",
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
      "Konec marca 1945 so se nad Kolpo prvič zaslišali težki motorji. Vas, vajena zvoka zvonov in vode, je dvignila glavo.\n\nNa poljani pri Gribljah so se zbirali ranjenci iz gozdnih in jamskih bolnišnic Bele krajine — moški, ki so meseci ležali na skritih operacijskih mizah pod smrekami. Nekateri so prišli na nosilih, nekateri pod roko tovarišev; nekateri so bili meseci prvič podnevi na prostem. Ko je prvo letalo pristalo, se je v mraku dvignil prah; ko se je dvignilo znova, je bilo v njem že ducat rešenih. Pot je bila dolga in tiha: iz bolnišnice na zbirno točko, z zbirne točke na travnik, z travnika v letalo — nekateri so na poti čakali cele dneve.\n\nZračni most ob Kolpi je deloval že od septembra 1944, ko so zavezniki prvič pristali na partizanskem letališču pri Otoku. Do konca vojne je v južno Italijo odpotovalo 1.473 ranjencev in 87 zavezniških letalcev, večinoma sestreljenih pilotov. Zadnji vzleti so se zgodili s Krasinca konec marca 1945 — v dveh dneh so letala ranjence in težje bolne prepeljala v zavezniško bazo v Bari. RTV Slovenija je ob osemdesetletnici dogodka zapisala, da je bila to ena največjih medvojnih evakuacij v tem delu Evrope. Zgodila se je v noči, nad travniki, ki so jih zjutraj spet košili.\n\nDva posnetka iz teh dni sta narejena prav pri Gribljah: ranjeni partizani, ki opazujejo pristajanje, in pogovor angleškega pilota s partizani. Snemalec prvega je Franjo Veselko (1905–1977); oba sta v javni domeni in med najdragocenejšimi predmeti te zbirke. Obrazi na njih so mladi — in večinoma brez imen. Kdor prepozna rojaka, brata ali soseda, naj se oglasi: ta muzej je zgrajen iz imen, ki jih še išče.\n\nDanes dogodek varuje spominski Douglas C-47 Dakota pri Otoku, spomin pa vsako pomlad obuja slovesnost Vranov let. Kdor stoji ob Kolpi, sliši samo reko. Kdor pa ve, kaj se je marca 1945 dvignilo z njenega brega, ve tudi, zakaj mir ni samoumeven.",
    textEn:
      "At the end of March 1945 heavy engines were heard above the Kolpa for the first time. A village used to the sound of bells and water raised its head.\n\nIn the field by Griblje the wounded of Bela krajina's forest and cave hospitals gathered — men who had spent months on hidden operating tables under the spruces. Some came on stretchers, some led by the arm of a comrade; some had not been out in daylight for months. When the first aircraft landed, dust rose in the dusk; when it rose again, a dozen of the saved were already aboard. The road was long and quiet: from the hospital to the assembly point, from the assembly point to the meadow, from the meadow into the aircraft — some waited whole days on the way.\n\nThe air bridge on the Kolpa had been running since September 1944, when the Allies first landed at the Partisan airfield by Otok. By the end of the war 1,473 wounded and 87 Allied airmen — mostly downed pilots — had flown to southern Italy. The last take-offs came from Krasinec at the end of March 1945: over two days the aircraft carried the wounded and the gravely ill to the Allied base at Bari. On the operation's eightieth anniversary RTV Slovenia described it as one of the largest wartime evacuations in this part of Europe. It happened at night, over meadows that were mown again the next morning.\n\nTwo photographs from those days were taken precisely at Griblje: wounded Partisans watching the aircraft come in, and an English pilot in conversation with Partisans. The author of the first is Franjo Veselko (1905–1977); both are in the public domain and among the most precious objects of this collection. The faces in them are young — and mostly without names. Whoever recognises a kinsman, a brother or a neighbour is invited to come forward: this museum is built out of the names it is still searching for.\n\nToday the event is guarded by the memorial Douglas C-47 Dakota at Otok, and the Vranov let ceremony returns every spring. Whoever stands by the Kolpa hears only the river. But whoever knows what rose from its bank in March 1945 also knows why peace is never to be taken for granted.",
    attributionSi: "Obnovljeno po javnih virih: Wikimedia Commons (Franjo Veselko, marec 1945), RTV Slovenija, spominski park Otok",
    attributionEn: "Rebuilt from public sources: Wikimedia Commons (Franjo Veselko, March 1945), RTV Slovenia, the Otok memorial park",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 1,
  },
  {
    kind: "ZGODBA",
    titleSi: "Reka, ki ločuje in spaja",
    titleEn: "The river that divides and joins",
    textSi:
      "Kolpa ni nikoli bila samo črta na zemljevidu. Stoletja je ločevala deželo Kranjsko od hrvaških dežel — a isti mlin je mlel žito z obeh bregov, ob malenci so si vaščani delili jez, poroke so bile sklenjene čez reko in sorodstvo je raslo na obeh straneh. Ribiči z obeh bregov se poznajo po imenu; otroci obeh vasi se učijo plavati v isti vodi.\n\nJunija 1991 se je spremenila teža črte, ne pa tudi črta sama. Iz meje med dvema republikama je Kolpa preskočila v zunanjo mejo samostojne Slovenije — in čez noč v mejo Evropi. Mejni kamni so dobili državni pomen, ob reki so zrasli prehodi, vsakdan pa je prepredla carina in dokumenti. Vas ob reki se je novi črti navadila, a je nikoli ni spustila v vodo.\n\nLeta 2015 je na bregu pri Gribljah za nekaj mesecev stala žičnata ograja — bledo žico nad zeleno reko je objektiv dokumentiral, kmalu zatem so jo odstranili. Za ljudi ob reki je bila tuja novost: Kolpa v svoji zgodovini ni bila pregrada, ampak srečanje.\n\nPrvega januarja 2023, ko je Hrvaška stopila v schengenski prostor, so se prehodi zaprli in luči nad njimi ugasnile. Kar je ostalo, je najstarejša oblika meje na tem svetu: voda, ki teče čez črto in je ne nosi s seboj.\n\nObiskovalcu, ki danes sede na breg, reka pripoveduje svojo zgodbo brez besed. Isti tok je bil deželna, upravna, republiška in državna meja — in je vseeno ostajal kraj, kjer so se na obeh bregovih srečevali isti ljudje. Najstarejša meja tu ni kamen. Je voda.",
    textEn:
      "The Kolpa was never only a line on a map. For centuries it separated the land of Carniola from the Croatian lands — yet the same mill ground the grain of both banks, villagers shared the weir at the malenca, marriages were concluded across the river, and kin grew on both sides. Anglers on the two banks know each other by name; children of the two villages learn to swim in the same water.\n\nIn June 1991 the weight of the line changed — the line itself did not. From a border between two republics the Kolpa jumped to the external border of independent Slovenia — and overnight, a border of Europe. The boundary stones took on the meaning of statehood, crossings grew along the river, and everyday life was threaded through with customs and documents. The village on the river grew accustomed to the new line, but never let it into the water.\n\nIn 2015, for a few months, a wire fence stood on the bank at Griblje — pale wire above a green river, documented by a camera and soon removed. For the people of the river it was an alien novelty: through all its history the Kolpa had not been a barrier but a meeting.\n\nOn 1 January 2023, when Croatia stepped into the Schengen area, the crossings closed and the lights above them went dark. What remained is the oldest form of border in this world: water, flowing over the line and carrying it away.\n\nTo the visitor who sits on the bank today, the river tells its story without words. The same current has been a provincial, an administrative, a republican and a national border — and remained, throughout, a place where the same people met on both banks. The oldest border here is not a stone. It is water.",
    attributionSi: "Obnovljeno po javnih virih: Wikimedia Commons (Hythlodot), Evropska komisija — schengensko območje",
    attributionEn: "Rebuilt from public sources: Wikimedia Commons (Hythlodot), European Commission — the Schengen area",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 2,
  },
  {
    kind: "ZGODBA",
    titleSi: "Mlinščina — vaška borza in telefon",
    titleEn: "Mlinščina — the village exchange and telephone",
    textSi:
      "Ob žetvi je pred mlinom stala vrsta vozov. Žito je čakalo, ljudje pa z njim — in počakali so tudi vse novice leta: od cen pšenice do zarok, od vremena do svatov. Mlin je bil vaška borza in vaški telefon v enem; vrsta pred njim je bila najbolj poštena kronika leta.\n\nMlinar je bil vaški mojster, njegova obrt pa branje vode. Njegov jez, toča in kamnita korita so žito spremenila v moko, po kateri je vsaka hiša spekla svoj kruh; slovenski vodni mlin je gnala žimaln — vodoravno kolo, ki je pretvarjalo tok reke v vrteči se kamen. Mlin je nosil dva kamna: spodnjega mirovnika in zgornjega tekača; med njiju je padalo zrno, iz njiju pa moka. Nastavitev kamnov je bila mlinarjeva skrivnost: preveč prostora in moka je groba, premalo in kamen se žge. Kdaj dvigniti zapornice, kdaj mleti, kdaj čakati na dež — to je vedel samo on.\n\nPlačevalo se je z mlinščino: odmerkom moke, ki si ga je mlinar pridržal za svoje delo. Tako se je v vsaki vreči žita meril tudi delež zaupane besede — mlinar je vedel, kdo ima dober klas in kdo slabo leto, in nič od tega ni povedal naprej. Zaupanje je bilo del mlinščine.\n\nOb Kolpi so mlini stali v Dolu, Radencih, Pobrežju in Krasincu — ohranjeni urbarji jih naštevajo med vaškimi prihodki. Sledi mlinarstva segajo globoko v srednji vek: v strugi Lahinje pri Flekovem mlinu v Črnomlju so arheologi odkrili ostanke mlina iz štirinajstega stoletja. Ob Kolpi pri Gribljah mlinarsko dediščino zapira malenca — mali jez, ki ima v tej zbirki svoj zapis.\n\nMuzej išče mlinarska pričevanja: kdaj je utihnil zadnji mlin v okolici Gribelj, kdo je hodil z žitom do Pobrežja in kaj je povedal mlinar, ko se je kamen ustavil. Mlinski kamni so molčali dovolj dolgo.",
    textEn:
      "At harvest a queue of carts stood before the mill. The grain waited, and the people with it — and they waited out all the year's news as well: from the price of wheat to engagements, from the weather to weddings. The mill was the village's exchange and the village's telephone in one; the queue before it was the most honest chronicle of the year.\n\nThe miller was the village's craftsman, and his trade was reading water. His weir, the drop and the stone troughs turned grain into the flour from which every household baked its bread; the Slovene water mill was driven by a žimaln — a horizontal wheel that turned the river's current into a turning stone. The mill carried two stones: the fixed bedstone below and the running stone above; between them the grain fell, and out of them came flour. Setting the stones was the miller's secret: too much gap and the flour is coarse, too little and the stone scorches. When to raise the sluices, when to grind, when to wait for rain — only he knew.\n\nPayment was the mlinščina: the measure of flour the miller kept back for his work. So every sack of grain also measured a share of entrusted words — the miller knew who had a good ear of wheat and who a bad year, and said none of it onward. Trust was part of the mlinščina.\n\nAlong the Kolpa the mills stood at Dol, Radenci, Pobrežje and Krasinec — the surviving urbars list them among the village's revenues. The traces of milling reach deep into the Middle Ages: in the bed of the Lahinja at Flekov mlin in Črnomelj, archaeologists uncovered the remains of a fourteenth-century mill. On the Kolpa at Griblje the milling heritage is closed by the malenca — the small weir that has its own record in this collection.\n\nThe museum is looking for the millers' testimonies: when the last mill around Griblje fell silent, who carried the grain to Pobrežje, and what the miller said when the stone stopped. The millstones have been silent long enough.",
    attributionSi: "Obnovljeno po javnih virih: ohranjeni urbarji, Radio Odeon (2022), arheološke raziskave Lahinje",
    attributionEn: "Rebuilt from public sources: surviving urbars, Radio Odeon (2022), archaeological research on the Lahinja",
    evidenceStatus: "DOCUMENTED",
    sortOrder: 5,
  },
  {
    kind: "ZGODBA",
    titleSi: "Žensko leto — od lana do platna",
    titleEn: "The women's year — from flax to linen",
    textSi:
      "Leto vasi Bele krajine je imelo dva koledarja: enega so pisala polja, drugega ženske roke.\n\nSpomladi so vasi sejale lan in konopljo; sredi poletja so stebla potegnili z roko iz zemlje — počasi in potrpežljivo, da se vlakna niso pretrgala. Potem se je začel pravi almanah: stebla so namočili v stoječi vodi, v ribniku, mlinščici ali lokvi, da je lubje zmehčalo; po suši so jih lomili, tlkli in česali, dokler ni ostal le sijoč vlaknati jed. To delo je bilo moško. Zima pa je takoj zatem gospodovala ženskam.\n\nOb večerni luči, s preslico v roki, so ženske predle vso zimo. Predenje je bilo delo in druženje ob enem: ob njem so se spletali pogovori, pesmi in zaroke. Spomladi je nastopila statva — lesen tkalski stroj v hiši ali v kamri; s slehernim gibom roke je tkalja predivo vpletala v platno, čolniček pa je prehajal med nitmi kot ritem. Iz platna so nastale rjuhe, srajce in nedrčki; iz konoplje vreče in vrvi. Oblečena in opremljena je bila cela vas.\n\nVsak dom je bil hkrati delavnica. Koliko platna je imela hiša v skrinjah, je bilo merilo gospodarnosti njene gazdarice; platno je bilo tudi denar — šlo je v doto, v dar in v plačilo dolgov. Prav zato sta predenje in tkalstvo del ženske zgodovine Bele krajine: gospodarstvo, ki ga je nosila roka, ne zemlja.\n\nKo se je domače platno umaknilo tovarniškemu, se zgodba ni končala: roke tkalj so našle delo v belokranjskih šiviljah, ženske plače pa so nosile cele hiše. Zgodba o platnu se je nadaljevala kot zgodba o konfekciji.\n\nPredenje — predstopnja tkalstva — je ohranjeno na fotografiji Frana Vesela iz leta 1920: pravi dokument časa, ne predstava. Muzej išče statve, ki so stale v Gribljah, in imena gazdaric, ki so jih imele. Vsaka fotografija vaške statve bo nov predmet zbirke.",
    textEn:
      "The year of a Bela krajina village kept two calendars: one was written by the fields, the other by women's hands.\n\nIn spring the villages sowed flax and hemp; in midsummer the stalks were pulled from the ground by hand — slowly and patiently, so the fibres would not tear. Then the true almanac began: the stalks were retted in standing water, in a pond, a millrace or a karst pool, until the bark softened; after drying they were broken, scutched and hackled until only the silky fibrous core remained. That work was men's. The winter that followed belonged to the women.\n\nBy the evening lamp, distaff in hand, the women spun all winter. Spinning was work and company at once: around it wove conversations, songs and engagements. In spring the loom took its turn — a wooden loom in the house or the chamber; with each movement of her hand the weaver interlaced the yarn into linen, and the shuttle passed between the threads like a rhythm. From the linen came sheets, shirts and chemises; from the hemp, sacks and ropes. The whole village was clothed and equipped by it.\n\nEvery household was at once a workshop. How much linen a house kept in its chests was the measure of its mistress's thrift; linen was also money — it went into dowries, into gifts and against debts. Precisely for that reason, spinning and weaving are part of the women's history of Bela krajina: an economy carried by the hand, not the land.\n\nWhen homespun gave way to factory cloth, the story did not end: the weavers' hands found work in the sewing shops of Bela krajina, and women's wages carried entire households. The story of linen continued as the story of ready-made clothing.\n\nSpinning — the step before weaving — survives on Fran Vesel's photograph from 1920: a true document of its time, not a reconstruction. The museum is looking for the looms that stood in Griblje, and for the names of the mistresses who kept them. A photograph of a village loom will be a new object of the collection.",
    attributionSi: "Obnovljeno po etnografski literaturi in fotografiji Frana Vesela (1920, javna last)",
    attributionEn: "Rebuilt from ethnographic literature and Fran Vesel's photograph (1920, public domain)",
    evidenceStatus: "TRADITION",
    sortOrder: 6,
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
