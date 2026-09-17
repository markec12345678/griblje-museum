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
  model3dUrl?: string;
  model3dCredit?: string;
  yearFrom?: number;
  yearTo?: number;
  lat?: number;
  lng?: number;
  coordsApprox?: boolean;
  featured?: boolean;
  /** Kurirani datum, kdaj je zapis vključen v zbirko (ISO) — poganja znak »novo«. */
  addedAt?: string;
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
      "Griblje lies in the Griblje local community of the Municipality of Črnomelj, on the northern edge of the Kolpa valley, which is today the national border with Croatia. The settlement is first recorded in written sources in 1468, as Griblach; Briglach (1490) and Griblah (1593) follow, while the urbars and the oldest map write Grüble. The name is thus older than almost everything that stands in the village today. When the church of St. Vitus first entered the documents in 1526, the village by the Kolpa had already grown its history — and Bela krajina had for a century already been a meeting point of two worlds: the Habsburg lands and the dangerous Ottoman frontier.\n\nThe village economy was carried for centuries by farming, livestock and viticulture on nearby slopes, while the Kolpa was at once a fishing, milling and border river. The farming year dictated the geography too: fields in the valley by the river, vineyards on the limestone slopes above the village, woods on the hills, and water in the pond behind the houses — and in the springs along the Kolpa, where the underground water returns to daylight. The river's flooding also created the loki, the fertile flood meadows; above the village, after 1848, farmers cleared the birch woods with draft animals, dug clay for bricks at Goranja lokva, and struck iron-rich earth at Rudna peč. After 1991 the course of the river became the external border of independent Slovenia — yet the village stayed on an edge that kept turning into opportunity: today Griblje is a quiet starting point for cycling along the Kolpa and walks among the white birches, the symbol of Bela krajina.\n\nThe village is not a single cluster of houses but a chain of hamlets — Dolnje Griblje, Brinsko selo, Srednje Griblje and Gornje Griblje. The origin of the name remains an open question among linguists: Marko Snoj lists grib (a mushroom, a Boletus), griba (a clod of soil), a word related to Croatian griblja (a furrow), and griva (a grassy slope); the local explanation — gribljati, to furrow, to plough — is one of those paths, not the only one. In the urbars and on the oldest map the village is written Grüble, not Groble. Griblje and its surroundings are in fact the driest corner of Bela krajina, with the least precipitation per square metre a year — and demographically alive: the 2020 census counted 334 inhabitants, and in 2026 the statistical office records 329 (see the record Griblje in numbers).\n\nThe Second World War placed the village inside free Bela krajina: in March 1945 Allied aircraft landed on the field by Griblje and carried the wounded to Italy — an event with its own record in this collection. The village also produced the ethnologist Niko Županič (1876–1961), founder of the Slovene Ethnographic Museum, who likewise has his own record here, and Anton Filak, an eight-time participant in the world ploughing championships. Today's village is home to winegrowers, visitors of the river and everyone returning to their family houses — with them, the museum writes the continuation.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-vas.jpg",
    imageCredit:
      "Foto: Andrejj · Wikimedia Commons · CC BY-SA 3.0 — vas Griblje ob Kolpi, zadaj Gorjanci",
    yearFrom: 1468,
    lat: 45.57246,
    lng: 15.29257,
    featured: true,
    sources: [
      {
        key: "wikipedija-griblje",
        nameSi: "Wikipedija: Griblje (zaselki, lega ob Kolpi, cerkev sv. Vida)",
        nameEn: "Wikipedia: Griblje (hamlets, position on the Kolpa, church of St. Vitus)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
      },
      {
        key: "commons-vas-kolpa",
        nameSi:
          "Wikimedia Commons: Bela krajina Kolpa — vas Griblje ob Kolpi, zadaj Gorjanci (fotograf: Andrejj)",
        nameEn:
          "Wikimedia Commons: Bela krajina Kolpa — the village of Griblje by the Kolpa, the Gorjanci hills behind (photographer: Andrejj)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Andrejj)",
        url: WM("Bela_krajina_Kolpa.jpg"),
        noteSi:
          "Glavna slika zapisa: vas Griblje ob Kolpi z Gorjanci v ozadju — fotografija, s katero se vas predstavlja tudi na Wikipediji.",
        noteEn:
          "The record's main image: Griblje by the Kolpa with the Gorjanci behind — the photograph by which the village also introduces itself on Wikipedia.",
      },
      {
        key: "commons-panorama",
        nameSi: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        nameEn: "Wikimedia Commons: Griblje, Črnomelj (panorama)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (avtor: Eleassar)",
        url: WM("Griblje,_%C4%8Crnomelj.jpg"),
        noteSi:
          "Panorama vasi z verigo domačij — naslovna fotografija muzeja (izrez na pas zaselkov) in glavna slika zapisa o zaselkih.",
        noteEn:
          "The village panorama with its chain of homesteads — the museum's banner photograph (cropped to the hamlet line) and the main image of the record on the hamlets.",
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
      "V središču naselja stoji cerkev sv. Vida, posvečena zavetniku, ki ga ljudski koledar pomni s pregovorom »od sv. Vida naprej sonce više vzhaja«. Stavba je versko središče krajevne skupnosti in najizrazitejša silhueta vasi — njena podoba je dokumentirana na fotografijah Wikimedia Commons.\n\nSveti Vid je zgodnjekrščanski mučenik iz časa Dioklecijanovih preganov; cerkev ga šteje med štirinajst svetih pomočnikov, ki naj bi pomagali v telesni stiski — posebej pri epilepsiji, ki so jo nekdaj imenovali »svetovidov ples«. Njegov praznik pada na 15. junij, takrat, ko je sonce visoko in ko se je v teh krajih začenjala žetev žit. Zavetnika sonca in poletja na hribu nad njivami kmečka vas ni izbrala naključno.\n\nVaška cerkev je bila stoletja tudi ura vasi: zvonjenje je klicalo k maši, opozarjalo na nevihto, slavilo praznike in pospremljalo pogrebe. Vsak zvon je imel svoj glas in svoj pomen; vaščani so jih znali razlikovati že po prvem udarcu. Kdor je znal poslušati, je vedel, kaj se vasi dogaja.\n\nCerkev sv. Vida v Gribljah je tudi zemljevid rodbin: okoli nje je pokopališče, kjer so generacije zapisale svoja imena v kamen. Za krajevni muzej so nagrobniki arhiv brez police — datumi, priimki, velike družine in prezgodaj odšli: cela demografija vasi na tisočih korakov.\n\nZdaj pa lahko ta zapis hodi naprej: cerkev je prvič zapisana v listinah leta 1526, sedanja stavba je iz osemnajstega stoletja, pripada pa župniji Podzemelj — tam hranijo tudi matične knjige Gribelj, rojstev, porok in smrti. Register nepremične kulturne dediščine cerkev vodi pod številko EŠD 2122. Notranja oprema in vizitacijski zapisi še čakajo na arhiv — ta vrzel ostaja odkrito priznana.\n\nZvoni imajo svojo, natančneje zapisano zgodovino. Glavni zvon je cerkvi manjkal od prve svetovne vojne; leta 1998 ga je vas vrnila z akcijo, ki jo je sprožil Anton Filak z zaobljubo ob rojstvu sina — donacije domačinov in izseljencev iz Avstralije ter Amerike so zadostile za 700-kilogramski zvon livarne Feralit in za obnovo fasade, strehe, stopnišča ter elektrifikacijo, vrhunec praznovanja pa je blagoslovil nadškof dr. Alojzij Šuštar. O blagoslovitvi in posvetitvi zvona je leta 2008 izšla vaška spominska knjiga: zvonjenje, ki je bilo stoletja ura vasi, ima zapisan tudi svoj najnovejši dnev. Leta 2026 je cerkev praznovala petsto let prve omembe, dočakala obnovo in svoj jubilej — ta dogodek ima v zbirki svoj zapis.\n\nTaka iskrenost je znamenje tega muzeja: raje priznamo vrzel, kot da bi jo zapolnili z domnevo.",
    storyEn:
      "In the centre of the settlement stands the church of St. Vitus, dedicated to the patron whom the folk calendar remembers with the saying \"from St. Vitus onward the sun rises higher.\" The building is the religious heart of the local community and the village's most striking silhouette — its appearance is documented in Wikimedia Commons photographs.\n\nSaint Vitus is an early Christian martyr of the Diocletian persecution; the Church counts him among the Fourteen Holy Helpers invoked in bodily distress — above all against epilepsy, once called \"St. Vitus' dance.\" His feast falls on 15 June, when the sun stands high and the grain harvest began in these parts. A patron of sun and summer, on a hill above the fields — a farming village did not choose him by accident.\n\nFor centuries the village church was also the village's clock: its bells called to mass, warned of storms, celebrated feasts and accompanied funerals. Every bell had its own voice and its own meaning; villagers could tell them apart by the first stroke. Whoever knew how to listen knew what was happening to the village.\n\nThe church of St. Vitus at Griblje is also a map of the families: around it lies the churchyard where generations wrote their names into stone. For a local museum the gravestones are an archive without shelving — dates, surnames, large families and those taken too soon: the whole demography of the village within a thousand steps.\n\nThis record can now step forward: the church first appears in documents in 1526, the present building is of the eighteenth century, and it belongs to the Parish of Podzemelj — where the parish registers of Griblje, of births, marriages and deaths, are kept. The heritage register lists the church under EŠD 2122. The interior furnishings and the visitation records still await the archive — that gap remains openly acknowledged.\n\nThe bells have a story of their own, more precisely written. The main bell had been missing since the First World War; in 1998 the village brought it back with an action launched by Anton Filak out of a vow at the birth of his son — the donations of locals and of emigrants from Australia and America sufficed for a 700-kilogram bell from the Feralit foundry and for the renewal of the facade, roof, staircase and electrification, and the culmination of the celebration was blessed by Archbishop dr. Alojzij Šuštar. On the blessing and consecration of the bell a village memorial book appeared in 2008: the ringing that was the village's clock for centuries has its newest chapter written down. In 2026 the church marked five hundred years of its first mention, lived to see its renovation and its jubilee — an event with its own record in this collection.\n\nSuch honesty is the mark of this museum: we would rather admit a gap than fill it with a guess.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/sveti-vid.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    // Interpretativni 3D-model muzeja (low-poly maketa, barvna gradnja iz
    // opisa stavbe: baročna podoba 18. st., zvonik nad pročeljem). Fotogrametrija
    // ostaja cilj prihodnje digitalizacije po razpisih (MGTŠ 3.2).
    model3dUrl: "/models/cerkev-sv-vida.glb",
    model3dCredit: "Interpretativni model: Muzej vasi Griblje (postavitev 2026) · CC BY-SA 4.0",
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
        key: "wiki-cerkev-vida",
        nameSi: "Wikipedija: Cerkev sv. Vida, Griblje (Q18515927) — prva omemba 1526, baročna stavba, župnija Podzemelj",
        nameEn: "Wikipedia: Church of St. Vitus, Griblje (Q18515927) — first mention 1526, Baroque building, Parish of Podzemelj",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Cerkev_sv._Vida,_Griblje",
        noteSi: "Lastni članek o cerkvi s povezavo na Wikipodatke.",
        noteEn: "A dedicated article on the church, linked to Wikidata.",
      },
      {
        key: "sn-cerkev-2026",
        nameSi: "Slovenske novice (13. 8. 2026): Cerkev je vedno ogledalo vasi — blagoslov obnovljenih cerkva v Butoraju in Gribljah",
        nameEn: "Slovenske novice (13 Aug 2026): The church is always a mirror of the village — the blessing of the renovated churches at Butoraj and Griblje",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://slovenskenovice.delo.si/novice/slovenija/v-butoraju-in-gribljah-s-slovesno-maso-proslavili-500-letnici-cerkev-je-vedno-ogledalo-vasi-foto",
        noteSi: "Zgodba zvona iz leta 1998 po pripovedi Antona Filaka ter mežnarska družina Šimec.",
        noteEn: "The 1998 bell story as told by Anton Filak, and the Šimec sexton family.",
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
    slug: "petstoletnica-2026",
    addedAt: "2026-09-15",
    category: "kraj",
    titleSi: "Petsto let cerkve sv. Vida (2026)",
    titleEn: "Five hundred years of the Church of St. Vitus (2026)",
    periodSi: "jubilejno leto 2026",
    periodEn: "jubilee year 2026",
    summarySi:
      "Jubilejno leto, v katerem je vas ob Vidovskem žegnjanju praznovala pol tisočletja prve pisne omembe cerkve — z obnovo stavbe, dvema publikacijama in novo ureditvijo ob mrliški vežici.",
    summaryEn:
      "The jubilee year in which the village, at the Vidovo žegnjanje, celebrated half a millennium of the church's first written mention — with a renovated building, two publications and a new arrangement by the funeral chapel.",
    storySi:
      "Leta 1526 se je cerkev sv. Vida prvič zapisala v listine; leta 2026 je vas to listino vrnila s praznikom. V nedeljo, 21. junija — ob tradicionalnem Vidovskem žegnjanju, ki pada na praznik zavetnika — je slovesno sveto mašo daroval msgr. Andrej Glavan, upokojeni novomeški škof, somaševal pa je domači župnik Peter Miroslavič. Pel je Cerkveni zbor Podzemelj, nastopili so učenci gribeljske podružnične šole, ob isti slovesnosti pa je krajevna skupnost namenu predala novo urejeno parkirišče ob cerkvi in mrliški vežici.\n\nJubilej je izdal tudi svoj arhiv: knjižico Cerkev sv. Vida v Gribljah — Memento ob 500 letnici prve omembe v pisnih virih. Pobudo zanjo je dala predsednica Krajevne skupnosti Griblje Romana Husič, strokovno zgodovinsko delo o cerkvi je pripravil zgodovinar dr. Janez Weiss, za oblikovanje pa je poskrbela Mojca Črnič mlajša; svoje zapise so prispevali še drugi domači avtorji, priročno čtivo o cerkvi in vasi pa je napisal Alojzij Štrucelj, ključar cerkve. Avgusta je nato blagoslov dočakala tudi obnovljena stavba — pet stoletij stara silhueta na najvišji točki vasi, obdani z obdelanimi polji.\n\nZidovi te cerkve nosijo tudi zgodbo o tem, kako vas skrbi zase. Pri ureditvi parkirišča in vežice je občina Črnomelj prispeala asfaltiranje 600 kvadratnih metrov, veliko donacijo rojaka dr. Franca Brinca pa je investicijo šele omogočila. Organizacijo je vodila predsednica KS Romana Husič; ob slovesnosti se je zahvalila župniku Miroslaviču, mežnarici Ani Križan, ključarju Štruclju, predsedniku PGD Griblje Darjotu Piškuriču, pevcem, učencem in županu Andreju Kavšku — imena, s katerimi zgodovina praznuje sama sebe.\n\nPraznovali pa niso le Griblje: sosednji Butoraj je isto poletje ob blagoslovu obnovil svojo cerkev sv. Marka, čigar prva omemba prav tako nosi leto 1526. Isti mrk leta je v pisne vire zapisal obe cerkvi — in obe vasi stoletje pozneje isto zgodovino bereta skupaj.\n\nLeto 2026 v Gribljah nosi še en jubilej: 1. decembra mineva 150 let od rojstva Nika Županiča, najbolj znanega rojaka (zapis o njem ima svoje mesto v zbirki). Gribeljski petstoletnica ni bil samo spomin — bil je dokaz, da ta vas svojo zgodovino zna tudi pisati naprej: z raziskavo, obnovo, knjigo in mašo, ki je prvič po petsto letih zazvonila za praznik, ko se je vse začelo.",
    storyEn:
      "In 1526 the church of St. Vitus entered the written record for the first time; in 2026 the village repaid that record with a feast. On Sunday, 21 June — at the traditional Vidovo žegnjanje, which falls on the patron's feast — the solemn mass was celebrated by msgr. Andrej Glavan, retired Bishop of Novo mesto, co-celebrated by the local parish priest Peter Miroslavič. The Podzemelj church choir sang, the pupils of the Griblje branch school performed, and at the same ceremony the local community handed over a newly arranged parking place by the church and the funeral chapel.\n\nThe jubilee also produced its own archive: the booklet The Church of St. Vitus at Griblje — a Memento on the 500th Anniversary of the First Mention in Written Sources. The initiative came from Romana Husič, president of the Griblje local community; the historical study of the church was prepared by the historian dr. Janez Weiss, the design by Mojca Črnič mlajša, with further contributions by local authors — and a handy companion on the church and the village was written by Alojzij Štrucelj, the church's key-keeper. In August the renovated building itself received its blessing — a silhouette five centuries old, on the highest point of the village, surrounded by tilled fields.\n\nThe walls of this church also carry a story of how a village takes care of itself. In the arrangement of the parking place and the chapel the Municipality of Črnomelj contributed the asphalting of six hundred square metres, and a major donation by their fellow villager dr. Franc Brinc made the investment possible at all. The organisation was led by the community president Romana Husič, who at the ceremony thanked parish priest Miroslavič, the sexton Ana Križan, key-keeper Štrucelj, the president of the Griblje fire brigade Darjot Piškurič, the singers, the schoolchildren and mayor Andrej Kavšek — the names with which history celebrates itself.\n\nNor was it Griblje alone that celebrated: neighbouring Butoraj blessed the renovation of its church of St. Mark the same summer, whose first mention likewise carries the year 1526. The same year of record wrote both churches into history — and five centuries on, both villages read that history together.\n\nThe year 2026 carries one more Griblje jubilee: on 1 December, 150 years will have passed since the birth of Niko Županič, the village's most famous son (whose record has its own place in this collection). The five-hundredth anniversary was not only a memory — it was proof that this village knows how to keep writing its history: with research, renovation, a book, and a mass that rang out, five hundred years on, for the feast at which it all began.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/sveti-vid.jpg",
    imageCredit: "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0",
    yearFrom: 2026,
    lat: 45.5728,
    lng: 15.2922,
    coordsApprox: true,
    featured: true,
    sources: [
      {
        key: "crnomelj-petstoletnica",
        nameSi: "Občina Črnomelj — novice (23. 6. 2026): V Gribljah slovesno obeležili 500-letnico cerkve sv. Vida in namenu predali novo pridobitev",
        nameEn: "Municipality of Črnomelj — news (23 Jun 2026): Griblje solemnly marked the 500th anniversary of the church of St. Vitus and handed over a new gain",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.crnomelj.si/sl/za-obcane/novice/2026062314453884/v-gribljah-slovesno-obelezili-500-letnico-cerkve-sv-vida-in-namenu-predali-novo-pridobitev",
        noteSi: "Datum slovesnosti, publikacija dr. Weissa, asfaltiranje 600 m² pri mrliški vežici (~18.000 EUR).",
        noteEn: "The date of the ceremony, the Weiss publication, the asphalting of 600 m² by the funeral chapel (~€18,000).",
      },
      {
        key: "moja-dolenjska-petstoletnica",
        nameSi: "Moja Dolenjska (26. 6. 2026): Griblje — slovesno obeležili 500-letnico prve pisne omembe cerkve sv. Vida",
        nameEn: "Moja Dolenjska (26 Jun 2026): Griblje — the 500th anniversary of the church's first written mention solemnly marked",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://moja-dolenjska.si/griblje-slovesno-obelezili-500-letnico-prve-pisne-omembe/",
        noteSi: "Celoten prerez slovesnosti: maša (Glavan, Miroslavič), Memento (Husič, Weiss, Črnič), donacija dr. Franca Brinca, zahvale KS.",
        noteEn: "The full cast of the ceremony: the mass (Glavan, Miroslavič), the Memento (Husič, Weiss, Črnič), the donation of dr. Franc Brinc, the community's thanks.",
      },
      {
        key: "sn-petstoletnica",
        nameSi: "Slovenske novice (13. 8. 2026): V Butoraju in Gribljah s slovesno mašo proslavili 500-letnici — Cerkev je vedno ogledalo vasi",
        nameEn: "Slovenske novice (13 Aug 2026): Butoraj and Griblje celebrated the 500th anniversary with a solemn mass — the church is always a mirror of the village",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://slovenskenovice.delo.si/novice/slovenija/v-butoraju-in-gribljah-s-slovesno-maso-proslavili-500-letnici-cerkev-je-vedno-ogledalo-vasi-foto",
        noteSi: "Zaključek obnovitvenih del, blagoslov dr. Glavana, navedek Štruclja, sodelovanje z Butorajem.",
        noteEn: "The completion of the renovation, the blessing by dr. Glavan, Štrucelj's remark, the cooperation with Butoraj.",
      },
      {
        key: "wiki-cerkev-vida-jubilej",
        nameSi: "Wikipedija: Cerkev sv. Vida, Griblje (Q18515927) — prva omemba 1526, baročna podoba 18. stoletja",
        nameEn: "Wikipedia: Church of St. Vitus, Griblje (Q18515927) — first mention 1526, Baroque appearance of the 18th century",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Cerkev_sv._Vida,_Griblje",
        noteSi: "Podlaga jubileja: prva pisna omemba leta 1526.",
        noteEn: "The basis of the jubilee: the first written mention in 1526.",
      },
      {
        key: "obcina-instagram-jubilej",
        nameSi: "Občina Črnomelj — objava ob slovesnosti (23. 6. 2026): Memento ob 500-letnici, PGD Griblje 1927, Mestna muzejska zbirka Črnomelj",
        nameEn: "Municipality of Črnomelj — post on the ceremony (23 Jun 2026): the Memento on the 500th anniversary, PGD Griblje 1927, the Črnomelj town museum collection",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.instagram.com/p/DZ7pevXDEU1",
        noteSi: "Uradna objava občine o praznovanju in knjižici.",
        noteEn: "The municipality's official post on the celebration and the booklet.",
      },
      {
        key: "odeon-petstoletnica-slovesnost",
        nameSi:
          "Radio Odeon (23. 6. 2026): V Gribljah slovesno obeležili 500-letnico prve omembe cerkve sv. Vida",
        nameEn:
          "Radio Odeon (23 Jun 2026): Griblje solemnly marked the 500th anniversary of the first mention of the church of St Vitus",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/v-gribljah-slovesno-obelezili-500-letnico-prve-omembe-cerkve-sv-vida/",
        noteSi:
          "Svečana sveta maša ob praznovanju 500-letnice prve pisne omembe cerkve — regionalni zapis o slovesnosti.",
        noteEn:
          "The solemn holy mass at the celebration of the 500th anniversary of the church's first written mention — the regional account of the ceremony.",
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
      "Prvi turški vpad na ozemlje današnje Slovenije se je zgodil prav v Beli krajini: 9. oktobra 1408 so roparske čete iz Bosne oplazile belokranjska tla in izropale okolico Metlike — o njem je po starem izročilu poročal šele Valvasor (1689). Vojna krajina (1460–1881) je bila obrambni pas ob najbolj izpostavljenem odseku avstrijsko-osmanske meje — zemlja, ki ni pripadala fevdalnim gospodom, ampak vojski. V 16. stoletju so jo poselili Uskoki — begunci srbskega, hrvaškega in vlaškega porekla, ki so bežali pred turškimi vpadi; ob Kolpi jim je vladal senjski knez Nikola Frankopan. Vpadi so Belo krajino večkrat opustošili: obramba tu ni bila abstrakcija, ampak vsakdan ob isti reki.\n\nPogodba z vojaško upravo je bila jasna: prosta zemlja in oprostitev fevdalnih dajatev v zameno za večno orožje. Gospodarska hrbtenica uskoških vasi je bila zadruga — več hišnih družin, ki je obdelovala skupno zemljo in skupaj nosila vojaško dolžnost; pozimi so orali in sejali, spomladi pa hodili na straže ob reki. Njihovo ime — po razlagi »tisti, ki je skočil prek« — je spomin na begunce, ki so preskočili mejo in našli novo domovino.\n\nUskoški potomci so se naselili v vaseh ob reki — Bojanci, Marindol, Paunoviči — in ohranili pravoslavno vero ter svoje običaje do danes; pravoslavna cerkev in pokopališče v Bojancih skupnost še danes držita skupaj. Iz tega srečanja svetov je zrasel del belokranjske identitete: belokranjsko pogačo radi imenujejo »darilo Uskokov slovenskemu narodu«, spomin na vojnokrajiške čase pa nosi utrjena domačija Šokčev dvor v Žuničih — v tej zbirki ima svoj zapis.\n\nLeta 1881 je Vojna krajina prešla pod civilno upravo — tri stoletja oboroženega vsakdana so se končala, meja ob Kolpi pa je ostala. Dediščina teh stoletij je dvojna: pripoved o sožitju dveh ver in jezikov ob isti reki ter vasi, ki so se naučile živeti z mejno negotovostjo — v času, ko je bila vsaka domačija ob Kolpi tudi zatočišče. Muzej bo uskoške zgodbe dopolnjeval s pričevanji potomcev: zlasti z drobci vsakdana, ki se v urbarjih ne zapišejo.",
    storyEn:
      "The first Ottoman incursion into the territory of present-day Slovenia happened precisely in Bela krajina: on 9 October 1408 raiding parties from Bosnia swept across the Bela krajina soil and plundered the surroundings of Metlika — of it, only Valvasor reported, following old tradition (1689). The Military Frontier (1460–1881) was a defensive belt along the most exposed section of the Austro-Ottoman border — land that belonged not to feudal lords but to the army. In the 16th century it was settled by the Uskoks — refugees of Serbian, Croatian and Vlach origin fleeing the Turkish incursions; along the Kolpa they were ruled by the prince of Senj, Nikola Frankopan. The incursions ravaged Bela krajina more than once: defence here was not an abstraction but an everyday life on the same river.\n\nThe bargain with the military administration was clear: free land and exemption from feudal dues in exchange for perpetual arms. The backbone of the Uskok villages was the zadruga — several house communities working common land and bearing the military duty together; in winter they ploughed and sowed, in spring they walked the river guard. Their very name — explained as \"the one who jumped across\" — remembers refugees who leapt the border and found a new homeland.\n\nThe Uskok descendants settled in villages along the river — Bojanci, Marindol, Paunoviči — and have kept their Orthodox faith and customs to this day; the Orthodox church and churchyard at Bojanci still hold the community together. From this meeting of worlds grew part of the Bela krajina identity: the Bela krajina pogača is gladly called a \"gift of the Uskoks to the Slovene nation\", and the fortified Šokčev dvor homestead in Žuniči — which has its own record in this collection — carries the memory of the frontier era.\n\nIn 1881 the Military Frontier passed to civil administration — three centuries of armed everyday life ended, but the border along the Kolpa remained. The legacy of those centuries is twofold: a story of two faiths and two languages living on the same river, and villages that learned to live with border uncertainty — at a time when every farmstead on the Kolpa was also a refuge. The museum will enrich the Uskok stories with the descendants' testimonies: above all with the fragments of everyday life that urbars never record.",
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
        key: "wiki-turski-vpadi",
        nameSi: "Wikipedija: turški vpadi (prvi vpad na slovensko ozemlje — 9. oktober 1408, Bela krajina)",
        nameEn: "Wikipedia: Ottoman incursions (the first incursion into Slovene territory — 9 October 1408, Bela krajina)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Tur%C5%A1ki_vpadi",
        noteSi:
          "Prvi vpad na ozemlje današnje Slovenije 9. 10. 1408: iz Bosne skozi Belo krajino, ropanje okolice Metlike; poroča Janez Vajkard Valvasor (1689).",
        noteEn:
          "The first incursion into the territory of present-day Slovenia on 9 October 1408: from Bosnia through Bela krajina, plundering the surroundings of Metlika; reported by Janez Vajkard Valvasor (1689).",
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
      "Kolpa (hrvaško Kupa) izvira v Gorskem kotarju — kraško jezero modre vode, zavarovano v okviru narodnega parka Risnjak — in po 297 kilometrih doseže Savo pri Sisku; večji del toka je slovensko-hrvaška meja. Rimljani so jo imenovali Colapis: ime, ki ga reka nosi že tri tisočletja.\n\nOb Gribljah je reka mirna, plitva in poleti topla — voda se pogosto segreje nad 25 °C, zato jo imajo za najtoplejšo slovensko reko in eno najbolj priljubljenih kopalnih rek v državi; kakovost vode na odseku Dragoši–Griblje redno spremlja državni monitoring kopalnih voda (merilno mesto K05010). Ob vasi samo poletje živi na kopališču Griblje: vodno stanje tam danes dnevno izmeri in objavi spletna postaja reka-kolpa.si. Med kajakaši in kanuisti velja za eno najlepših slovenskih rek za počasno plovbo; dolina s čisto vodo, mrtvicami in travniki je zavarovano območje Natura 2000 — del evropske mreže najdragocenejše narave. Za plavalce, ribiče in veslače je reka danes tisto, kar je bila nekoč za mlinarje: življenjska žila pokrajine.\n\nV tisočletjih poplavljanja je reka ob bregovih ustvarila rodovitne travnike, ki se jim v Beli krajini reče loka; njena voda tu ponekod ponika v kraško podzemlje in se vrača v studencih ob obeh bregovih.\n\nReka hrani tudi vojno. Julija 2021 je občan pri Gribljah v vodi zagledal neznana ubojna sredstva; enote za neeksplodirana ubojna sredstva so iz Kolpe in brežine odstranile in na kraju uničile 32 letalskih vadbenih bomb iz obdobja do leta 1991 — kakršne so odvračala vojaška letala Galeb — ter prednji del topovske granate kalibra 150 mm, minometno mino kalibra 81 mm in dva naboja kalibra 12,7 mm iz druge svetovne vojne. Dve vojni v enem rečnem koritu: Kolpa jih je desetletja nosila pod gladino, dokler jih ni vrnila.\n\nReka je vasi dajala ribe, mlin in žago — mlinarska dediščina ima v tej zbirki svoja zapisa — s cerkvami na obeh bregovih pa tudi zgodbo o stiku in ločitvi. Nad njo so marca 1945 pristajala zavezniška letala z ranjenci, ob njej je leta 2015 za kratek čas stala žičnata ograja: Kolpa je priča vsem plasti meje, o katerih govori zapis o meji. Danes ob njej vodi kolesarska pot, poleti pa se ob bregovih znova slišita skupni jezik in smeh — ista voda, ki je bila stoletja črta, spet združuje obale.",
    storyEn:
      "The Kolpa (Croatian: Kupa) rises in Gorski Kotar — a karst lake of blue water protected within Risnjak National Park — and after 297 kilometres reaches the Sava at Sisak; most of its course is the Slovenian–Croatian border. The Romans called it Colapis: a name the river has carried for three thousand years.\n\nAt Griblje the river is calm, shallow and warm in summer — the water often climbs above 25 °C, which makes it Slovenia's warmest river and one of the country's favourite bathing rivers; water quality on the Dragoši–Griblje section is regularly monitored by the state bathing-water programme (measurement point K05010). At the village itself summer lives at the Griblje bathing spot: its water is now measured and published daily by the web station reka-kolpa.si. Among kayakers and canoeists it counts among the loveliest Slovenian rivers for slow paddling, and the valley — with its clean water, backwaters and meadows — is a protected Natura 2000 site, part of the European network of most precious nature. For swimmers, anglers and paddlers the river is today what it once was for the millers: the lifeline of the landscape.\n\nOver millennia of flooding the river created fertile meadows along its banks, called loka in Bela krajina; its water here in places sinks into the karst underground and returns in the springs along both banks.\n\nThe river keeps the wars too. In July 2021 a citizen sighted unknown munitions in the water by Griblje; the bomb-disposal units lifted from the Kolpa and its bank and destroyed on the spot thirty-two practice aerial bombs from the period up to 1991 — of the kind dropped by Galeb military jets — together with the head of a 150 mm artillery shell, an 81 mm mortar round and two 12.7 mm cartridges from the Second World War. Two wars in one riverbed: the Kolpa had carried them for decades under its surface, until it gave them back.\n\nThe river gave the village fish, a mill and a sawmill — the milling heritage has two records of its own in this collection — and, with churches on both banks, also a story of contact and separation. Above it Allied aircraft landed with the wounded in March 1945; along it a wire fence stood briefly in 2015: the Kolpa witnessed every layer of the border described in the record on the border. A cycling route runs along it today, and in summer both banks again carry a shared language and laughter — the same water that was a line for centuries is joining the banks again.",
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
        key: "reka-kolpa-postaja",
        nameSi: "Reka-Kolpa.si: kopališče Griblje — dnevne meritve temperature vode",
        nameEn: "Reka-Kolpa.si: the Griblje bathing spot — daily water-temperature measurements",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.reka-kolpa.si/en/kolpa-griblje",
        noteSi: "Spletna postaja, ki kopališče Griblje opisuje in dnevno objavlja temperaturo vode.",
        noteEn: "The web station describing the Griblje bathing spot and publishing its water temperature daily.",
      },
      {
        key: "natura2000-kolpa",
        nameSi: "Natura 2000 v Sloveniji — območje Kolpa (ARSO, mreža evropsko zavarovanih območij)",
        nameEn: "Natura 2000 in Slovenia — the Kolpa site (ARSO, the European network of protected areas)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.natura2000.si/",
      },
      {
        key: "odeon-bombe-kolpa-2021",
        nameSi: "Radio Odeon — V Kolpi našli 32 letalskih vadbenih bomb (12. 7. 2021, vir ReCO Novo mesto)",
        nameEn: "Radio Odeon — 32 practice aerial bombs found in the Kolpa (12 Jul 2021, source ReCO Novo mesto)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/v-kolpi-nasli-32-letalskih-vadbenih-bomb/",
        noteSi: "NUS Dolenjske, Gorenjske in Ljubljanske: 32 vadbenih bomb (do 1991, Galeb) + granata 150 mm + mina 81 mm + 2 naboja 12,7 mm (2. sv. v.), uničeno na kraju.",
        noteEn: "The EOD units: 32 practice bombs (pre-1991, Galeb) + a 150 mm shell + an 81 mm mortar round + two 12.7 mm cartridges (WWII), destroyed on site.",
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
        nameSi:
          "Radio Odeon (19. 3. 2022): Mlini v Beli krajini po ohranjenih urbarjih",
        nameEn:
          "Radio Odeon (19 Mar 2022): Mills in Bela krajina according to the surviving urbars",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/mlini-v-beli-krajini/",
        noteSi: "Mlinarska dediščina Bele krajine — kontekst malenc in mlinskih rokavov; Madroničev mlin okoli leta 1990 (arhiv Petre in Petra Madroniča).",
        noteEn: "The milling heritage of Bela krajina — the context of weirs and millraces; the Madronič mill around 1990 (from the archive of Petra and Peter Madronič).",
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
        nameSi:
          "Radio Odeon (19. 3. 2022): Mlini v Beli krajini po ohranjenih urbarjih",
        nameEn:
          "Radio Odeon (19 Mar 2022): Mills in Bela krajina according to the surviving urbars",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/mlini-v-beli-krajini/",
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
      "Iz kmečke hiše v Gribljah na svetovna odra: ljudsko šolo je Niko Županič obiskoval v Podzemlju (1884–1887), gimnazijo v Novem mestu, leta 1903 pa doktoriral na dunajski univerzi iz zgodovine, prazgodovinske arheologije, etnologije in antropologije.\n\nZ Dunaja ga je pot odpeljala na Balkan: v prvih desetletjih 20. stoletja je opravil antropološke raziskave med Srbijo, Bolgarijo, Makedonijo in Albanijo — meril je in poslušal, opazoval ljudi in pokrajine — ter se ustavil v Beogradu, kjer je deloval med muzeji in univerzami. V slovensko vedo je vnesel primerjalni balkanski zorni kot, ki mu je ostal zvest vse življenje.\n\nMed prvo svetovno vojno je deloval v jugoslovanskem odboru, v Združenih državah navduševal izseljence za združitev Slovanov, na mirovni konferenci v Parizu leta 1919 pa skupaj z izumiteljem Mihajlom Pupinom dosegel, da Bled z okolico ni pripadal Italiji.\n\nLeta 1921 je v Ljubljani ustanovil Etnografski inštitut — današnji Slovenski etnografski muzej — in postal njegov prvi upravnik; leta 1927 je pričel izdajati Etnolog, prvo slovensko etnološko glasilo, leta 1940 pa zasedel novo ustanovljeno stolico za etnologijo na ljubljanski univerzi. Pred nemško zasedbo Ljubljane se je leta 1943 umaknil v rodno Belo krajino — v pokrajino, od koder je izhajala vsa njegova pot.\n\nPolitična lestvica ga je peljala še višje, kot ga je domovina sploh znala: leta 1922 je postal minister v Pašičevi vladi Kraljevine SHS, po neizvoljenju za poslanca 1923 pa je do 1925 ostal minister brez listnice. Njegova pot je znala biti tudi mečeva: z albanskim profesorjem Pekmezijem se je izzval na dvoboj s pištolami — odpovedan v zadnjem hipu — leta 1914 pa je z meči izzval avstrijskega častnika, ki je žalil Slovane, in Dunaj moral zapustiti v naglici. Ob koncu druge svetovne vojne so ga z Belokranjskega evakuirali na svobodno ozemlje v Dalmaciji. Leta 1931 so ga v Adlešičih imenovali za častnega občana; slovesnost ga je pospremila muzejska kolega, slikar Maksim Gaspari in Stane Vurnik. Danes zbirka vrača njegovo ime v vas skupaj z obema bratoma: Matejem, ki je padel na solunski poti, in Juretom, ki je v Gribljah držal trgovino in gostilno.\n\nObjavil je čez 200 razprav, knjig in člankov; umrl je leta 1961 v Ljubljani. Njegov portret je naslikal Ivan Vavpotič, spominsko ploščo pa ima v rojstni vasi — ohranil naj bi tudi najstarejše upodobitve vasi in njenih ljudi, ki sta jih naslikala Ivan Vavpotič in Maksim Gaspari. Slovenski etnografski muzej ga je ob 140. obletnici rojstva poimenoval »kozmopolit iz Gribelj«. 1. decembra 2026 mineva 150 let od njegovega rojstva — jubilej, ki pada v leto, ko je vas praznovala še petstoletnico cerkve. Za ta muzej je Županič dokaz, da iz vaške hiše zraste znanost svetovnega dometa: pot se lahko odpravi po vseh glavnih mestih Evrope, vendar se začne in konča pod isto gribeljsko streho.",
    storyEn:
      "From a farmhouse in Griblje onto the world's stages: Niko Županič attended primary school in Podzemelj (1884–1887) and grammar school in Novo mesto, and in 1903 took his doctorate at the University of Vienna in history, prehistoric archaeology, ethnology and anthropology.\n\nFrom Vienna the road led him to the Balkans: in the early decades of the 20th century he carried out anthropological research in Serbia, Bulgaria, Macedonia and Albania — measuring and listening, observing people and landscapes — and settled for a time in Belgrade, working among its museums and universities. Into Slovene scholarship he brought a comparative Balkan perspective that remained his for life.\n\nDuring the First World War he served the Yugoslav Committee, kindled the emigrants in the United States for the union of the South Slavs, and at the 1919 Paris Peace Conference, together with the inventor Mihajlo Pupin, helped secure that Bled and its surroundings did not pass to Italy.\n\nIn 1921 he founded the Ethnographic Institute in Ljubljana — today's Slovene Ethnographic Museum — and became its first director; in 1927 he launched Etnolog, the first Slovene ethnological journal, and in 1940 took the newly established chair of ethnology at the University of Ljubljana. Before the German occupation of Ljubljana he withdrew in 1943 to his native Bela krajina — the land from which his whole road had set out.\n\nThe political ladder carried him higher still than his homeland knew how to: in 1922 he became a minister in Pašić's government of the Kingdom of the Serbs, Croats and Slovenes, and after failing to win a deputy's seat in 1923 he remained a minister without portfolio until 1925. His road could be a sword's road too: with the Albanian professor Pekmezi he fought a pistol duel — called off at the last moment — and in 1914 he challenged an Austrian officer who had insulted the Slavs, leaving Vienna in haste. At the end of the Second World War he was evacuated from Bela krajina to the free territory of Dalmatia. In 1931 the municipality of Adlešiči named him an honorary citizen; the ceremony saw him accompanied by his museum colleagues, the painter Maksim Gaspari and Stane Vurnik. Today the collection returns his name to the village together with his two brothers: Mate, who fell on the Salonika road, and Jure, who kept a shop and an inn in Griblje.\n\nHe published more than 200 studies, books and articles; he died in Ljubljana in 1961. His portrait was painted by Ivan Vavpotič, and a memorial plaque stands in his birth village — he is also credited with preserving the oldest depictions of the village and its people, painted by Ivan Vavpotič and Maksim Gaspari. On his 140th birthday the Slovene Ethnographic Museum called him a \"cosmopolitan from Griblje\". On 1 December 2026, 150 years will have passed since his birth — a jubilee falling in the very year the village also celebrated the five-hundredth anniversary of its church. For this museum Županič is proof that world-class scholarship can grow out of a village farmhouse: the road may run through every capital of Europe, but it begins and ends under the same Griblje roof.",
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
      {
        key: "wiki-griblje-gaspari",
        nameSi: "Wikipedija: Griblje (Županič je ohranil najstarejše slike vasi — Vavpotič, Gaspari)",
        nameEn: "Wikipedia: Griblje (Županič preserved the oldest pictures of the village — Vavpotič, Gaspari)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Najstarejše upodobitve vasi in ljudi; leto 2026 = 150 let od rojstva.",
        noteEn: "The oldest depictions of the village and its people; 2026 marks 150 years since his birth.",
      },
      {
        key: "odeon-zupanic-150",
        nameSi:
          "Radio Odeon (11. 6. 2026): V Gribljah ob jubilejnem letu z novo pridobitvijo — 500 let cerkve sv. Vida in 150 letnica rojstva dr. Nika Županiča",
        nameEn:
          "Radio Odeon (11 Jun 2026): Griblje in its jubilee year with a new acquisition — 500 years of the church of St Vitus and the 150th anniversary of dr. Niko Županič's birth",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/v-gribljah-ob-jubilejnem-letu-z-novo-pridobitvijo/",
        noteSi:
          "Novo parkirišče pri cerkvi, obnovljena tutenkamra in poslovilna vežica (donator dr. Franc Brinc in Občina Črnomelj) v letu dveh jubilejev.",
        noteEn:
          "The new church car park and the renovated tutenkamra and funeral vestry (donor dr. Franc Brinc and the Municipality of Črnomelj) in the year of two jubilees.",
      },
      {
        key: "zupanic-sopek",
        nameSi: "Katarina Zupanič: Šopek poljskih cvetlic iz Gribelj v Beli Krajini, Županičev zbornik, Ljubljana 1939",
        nameEn: "Katarina Zupanič: A Bouquet of Field Flowers from Griblje in Bela Krajina, the Županič Memorial Volume, Ljubljana 1939",
        sourceType: "objava",
        license: "pisni vir / print source",
        noteSi:
          "Prispevek o poljskem cvetju Gribelj v Županičevem zborniku (1939) — pisna priča o botaničnem pogledu na vas; navedba po seznamu virov članka Griblje na Wikipediji.",
        noteEn:
          "A contribution on the field flowers of Griblje in the Županič memorial volume (1939) — a written witness of the botanical gaze on the village; cited after the source list of the Wikipedia article on Griblje.",
      },
      {
        key: "odeon-zupanic-minister",
        nameSi: "Radio Odeon — Gribeljčan, srbski minister, slovenski znanstvenik dr. Niko Zupanič (vir KP Kolpa)",
        nameEn: "Radio Odeon — A Griblje man, Serbian minister, Slovene scholar: dr. Niko Zupanič (source KP Kolpa)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/gribeljcan-srbski-minister-slovenski-znanstvenik-dr-niko-zupanic/",
        noteSi: "Minister v Pašičevi vladi 1922–25; dvoboja s Pekmezijem in z avstrijskim častnikom; častni občan Adlešič 1931 (spremljala Gaspari in Vurnik); evakuacija v Dalmacijo; oče Miko vinski trgovec.",
        noteEn: "Minister in Pašić's government 1922–25; the duels with Pekmezi and the Austrian officer; honorary citizen of Adlešiči 1931 (accompanied by Gaspari and Vurnik); evacuation to Dalmatia; the father Miko a wine merchant.",
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
      "Vsak zapis te zbirke ima svojo čezoceansko različico: ljudje, ki so vas zapustili. Slovensko izseljenstvo je ena največjih premikajočih sil 19. in 20. stoletja — odhodi so doleteli vsako vas, Griblje ne izjema.\n\nPrvi in največji val je bil gospodarski: od osemdesetih let 19. stoletja do prve svetovne vojne se je na pot v Združene države podalo na stotine tisočev Slovencev; potovali so prek Trsta in Antwerpna, kjer je čez Atlantik peljala linija Red Star Line. Fotografija z začetka 20. stoletja kaže izseljence na palubi čezoceanske ladje — ne Gribljcev samih, a natanko pot čez ocean, ki so jo pluli. Med vojnami se je pot stekla v Argentino in Kanado, po letu 1945 pa v Argentino, Avstralijo in Kanado znova — tokrat politično. Šestdeseta in sedemdeseta leta so prinesla zimske delavce: moški so odhajali na gradbišča Nemčije, Švice in Avstrije, poleti pa se vračali k žetvi. Po letu 1991 se je kolo obrnilo še enkrat.\n\nIzseljenstvo ni samo odhod — je tudi denar in pisma. Mandati, denarni nakazi iz Amerike, so v domačih vaseh gradili hiše in odkupovali zemljo; na stenah so stale fotografije iz Clevelanda in Pittsburga, v omarah pa obleke, ki so jih nosili »tam«. V Gribljah je v isti hiši odraščal tudi Niko Županič, ki je med prvo svetovno vojno v Združenih državah navduševal izseljence za združitev Slovanov — njegov zapis stoji v tej zbirki.\n\nMuzej iskreno priznava: imena gribeljskih izseljenskih rodov še niso zapisana. Rodovi v Združenih državah, Avstraliji, Argentini in Nemčiji — vsak dopis, fotografija ali mandat bo nov vir. Vas, ki jo je zgodovina raztresla po svetu, se lahko v muzeju spet zbere: hiše na obeh straneh oceana namreč pripadajo istim rodbinam.",
    storyEn:
      "Every record in this collection has its trans-oceanic counterpart: the people who left the village. Slovene emigration is one of the greatest moving forces of the 19th and 20th centuries — the departures reached every village, Griblje no exception.\n\nThe first and largest wave was economic: from the 1880s to the First World War hundreds of thousands of Slovenes set out for the United States; they travelled via Trieste and Antwerp, where the Red Star Line carried them across the Atlantic. A photograph from the early 20th century shows emigrants on the deck of a transatlantic liner — not Griblje people themselves, but precisely the ocean road they sailed. Between the wars the road ran to Argentina and Canada; after 1945 to Argentina, Australia and Canada again — this time political. The 1960s and 1970s brought the winter workers: men left for the building sites of Germany, Switzerland and Austria and returned for the harvest. After 1991 the wheel turned once more.\n\nEmigration is not only departure — it is money and letters. The money orders from America built houses and bought land in the home villages; photographs of Cleveland and Pittsburgh stood on walls, and wardrobes held the clothes worn \"over there\". In Griblje the same house also reared Niko Županič, who during the First World War kindled the emigrants of the United States for the union of the South Slavs — his record stands in this collection.\n\nThe museum honestly admits: the names of Griblje's emigrant families are not yet written down. The families in the United States, Australia, Argentina and Germany — every letter, photograph or money order will be a new source. A village scattered across the world by history can gather again in a museum: the houses on both sides of the ocean belong to the same families.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/izseljenci-ladja.jpg",
    imageCredit:
      "Foto: zbirka George Grantham Bain (~1907) · Wikimedia Commons · javna last — izseljenci na palubi čezoceanske ladje",
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
        key: "commons-izseljenci-ladja",
        nameSi: "Wikimedia Commons: Izseljenci na palubi ladje SS Friedrich der Grosse (~1907, zbirka George Grantham Bain)",
        nameEn: "Wikimedia Commons: Emigrants on the deck of SS Friedrich der Grosse (~1907, George Grantham Bain Collection)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Steerage_passengers_on_SS_Friedrich_der_Grosse.jpg"),
        noteSi: "Glavna slika zapisa: izseljenci na palubi med prečkanjem Atlantika — ne Gribljcev, a natanko njihova čezoceanska pot.",
        noteEn: "The record's main image: emigrants on deck crossing the Atlantic — not Griblje people, but precisely their trans-ocean road.",
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
        nameSi:
          "RTV Slovenija (21. 2. 2024): Slovenski narodnoosvobodilni svet — 80 let pozneje in kako je bil tedaj videti Črnomelj",
        nameEn:
          "RTV Slovenia (21 Feb 2024): The Slovenian National Liberation Council — 80 years on and what Črnomelj looked like then",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/kultura/drugo/slovenski-narodnoosvobodilni-svet-80-let-pozneje-in-kako-je-bil-tedaj-videti-crnomelj/699117",
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
        nameSi:
          "RTV Slovenija (24. 9. 2022): V Otoku pri Metliki slovesnost v spomin medvojnega reševanja zavezniških letalcev",
        nameEn:
          "RTV Slovenia (24 Sep 2022): A ceremony at Otok near Metlika in memory of the wartime rescue of Allied airmen",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/slovenija/v-otoku-pri-metliki-slovesnost-v-spomin-medvojnega-resevanja-zavezniskih-letalcev/641511",
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
        key: "odeon-vranov-let-pot",
        nameSi:
          "Radio Odeon (1. 9. 2024): Vojaki po poti Vranovega leta od Ožbolta do Otoka — Mednarodna spominska pot zavezništva",
        nameEn:
          "Radio Odeon (1 Sep 2024): Soldiers on the Vranov let route from Ožbalt to Otok — the International Memorial Trail of the Alliance",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/vojaki-po-poti-vranovega-leta-od-ozbolta-do-otoka-pri-metliki/",
        noteSi:
          "Pripadniki Slovenske vojske vsako leto prehodijo pot osvobojenih ujetnikov: Ožbalt → Geoss → Otok (spominska pot zavezništva Vranov let).",
        noteEn:
          "Slovenian Armed Forces members walk the freed prisoners' route each year: Ožbalt → Geoss → Otok (the Vranov let Alliance memorial trail).",
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
    image: "/images/authentic/hisa-adlesici.jpg",
    imageCredit:
      "Foto: Fran Vesel, 24. 8. 1920 · Wikimedia Commons · javna last — hiša v Adlešičih (pogorela med 2. svetovno vojno)",
    yearFrom: 1800,
    yearTo: 1899,
    featured: false,
    sources: [
      
      {
        key: "commons-hisa-adlesici",
        nameSi: "Wikimedia Commons: Hiša v Adlešičih (Fran Vesel, 1920) — belokranjska domačija, pogorela med drugo svetovno vojno",
        nameEn: "Wikimedia Commons: A house in Adlešiči (Fran Vesel, 1920) — a Bela krajina farmstead that burned in the Second World War",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Hi%C5%A1a_v_Adle%C5%A1i%C4%8Dih.jpg"),
        noteSi: "Glavna slika zapisa: avtentična belokranjska domačija iz leta 1920 — Adlešiči so sosednja vas ob Kolpi; gribeljski primeri še čakajo na vaške fotografije.",
        noteEn: "The record's main image: an authentic Bela krajina farmstead of 1920 — Adlešiči is a neighbouring village on the Kolpa; Griblje examples still await village photographs.",
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
      {
        key: "odeon-stavbna-dediscina",
        nameSi: "Radio Odeon: Stavbna dediščina podeželja (16. 1. 2021)",
        nameEn: "Radio Odeon: The building heritage of the countryside (16 January 2021)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/stavbna-dediscina-podezelja/",
        noteSi: "Domačije Bele krajine, Pokolpja in Žumberka: hiša, hlev s podom, kašča in vodnjak iz krajevnih materialov — “skladno sobivanje človeka z naravo”.",
        noteEn: "The farmsteads of Bela krajina, Pokolpje and Žumberak: house, byre with a hallway, granary and well from local materials — “the harmonious coexistence of man and nature”.",
      }
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
    image: "/images/authentic/vino-presa.jpg",
    imageCredit:
      "Foto: Fran Vesel, 23. 8. 1920 · Wikimedia Commons · javna last — belokranjski vinogradnik pri preši v kleti",
    yearFrom: 1800,
    featured: false,
    sources: [
      {
        key: "commons-vino-presa",
        nameSi: "Wikimedia Commons: Belokranjski vinogradnik pri preši v kleti (Fran Vesel, 1920)",
        nameEn: "Wikimedia Commons: A Bela krajina winemaker at the press in his cellar (Fran Vesel, 1920)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Belokranjski_vinogradnik_pri_pre%C5%A1i_v_kleti.jpg"),
        noteSi: "Glavna slika zapisa: belokranjski vinogradnik pri preši v kleti — avtentična etnografska fotografija vinskega vsakdana te dežele.",
        noteEn: "The record's main image: a Bela krajina winemaker at his press — an authentic ethnographic photograph of the region's wine everyday.",
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
      {
        key: "odeon-kruh-spomin",
        nameSi: "Radio Odeon: Kruha nikoli ne peče slabe volje (27. 5. 2026)",
        nameEn: "Radio Odeon: Bread is never baked in a bad mood (27 May 2026)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/kruha-nikoli-ne-pece-slabe-volje/",
        noteSi: "Belokranjska kulinarična dediščina kot živo izročilo: Bernarda Kump iz Črnomlja obuja peko in zgodbe — hrana, ki je spomin, občutek in stik z domačostjo.",
        noteEn: "Bela krajina's culinary heritage as a living tradition: Bernarda Kump of Črnomelj revives baking and stories — food as memory, feeling and the touch of home.",
      }
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
      "Griblje so kmetijstvu dale tudi poslanca: Anton Filak, osmkratni udeleženec svetovnih prvenstev v oranju. Njegova disciplina je najstarejša veščina človeka ob zemlji — vrtanje brazde —, dvignjena v merilni šport.\n\nOranje je vrhunec kmečkega znanja. Pravična brazda zahteva vse: branje prsti (jerina čez apnenec se obnaša drugače kot mokra ilovica v dolini), pravčasnost (prezgodaj — brazda se razsuje; prepozno — izgubi vlago), mirno žival in roko, ki zna plugu zaupati. V vasi se je kmet poznal po brazdi: kdo orje plitvo in poševno, kdo prav in do tal. Kdor je oral lepo, je sijal pred sosedovi očmi kot gospodar, ki zna voditi hišo.\n\nSvetovna prvenstva v oranju potekajo od leta 1953: državne ekipe tekmujejo v klasičnem in reverzibilnem oranju, sodniki pa točkujejo globino, ravnost brazde, pokritost žetvenih ostankov in čistost preloma. Oranje s konjsko vprego — korenik tega športa — je dokumentirano na fotografijah Franca Vesela iz začetka 20. stoletja; ena od njih je glavna slika tega zapisa. Tekmovanje je iz kmečke nuje naredilo disciplino: enaka roka, enak plug, le merilni trak namesto sosedovega pogleda.\n\nNajlepše pa je, da ta šport ni nikoli zapustil kmečke hiše: prvaki so ostali kmetje, ki orjejo prav tako po obmrzlih aprilskih zorjah kakor po gladki tekmovalni njivi. Oranje je bilo v Gribljah družinska znanost — oče je plug predal sinu, sin živali svojemu sinu — in prav ta veriga je nesla znanje vse do svetovnega odra.\n\nRoka, ki zna rezati brazdo, pa znala več. Leta 1998 je Filak ob rojstvu sina izrekel zaobljubo in na zboru krajanov predlagal nakup glavnega zvona za cerkev sv. Vida, odvzetega v prvi svetovni vojni; z donacijami domačinov in izseljencev iz Avstralije ter Amerike so zbrali sredstva za 700-kilogramski zvon livarne Feralit in celovito obnovo fasade, strehe, stopnišča ter elektrifikacijo, vrhunec praznovanja pa je blagoslovil nadškof dr. Alojzij Šuštar. »Celotna vas je takrat dihala kot ena duša,« je o akciji povedal Filak, ki je ob jubileju 2026 kot predsednik gradbenega odbora vodil še obnovo cerkvene stavbe.\n\nLeta 2019 se je tekmovanje vrnilo domov: na Tomažinovi kmetiji v Gribljah je Klub oračev pripravil regijsko prvenstvo Bele krajine — devet oračev, osem s plugi krajiki. Zmaga je ostala v vasi: prvi je bil Anton Filak, drugi Gašper Filak, tretji Janez Ivanič; ob cesti se je tekmovalje gledalo vseh generacij, najmlajši pa so popoldne srečali še kopanje v Kolpi.\n\nMuzej objavlja, kar ima: Filakova udeležba na osmih svetovnih prvenstvih je zapisana po javnem viru; leta nastopov, uvrstitve in sestava reprezentance še čakajo na arhiv. Ko se najdejo, se bodo dodala z virom — do takrat zapis stoji na svoji najtanejši, a trdni plasti: gribeljska brazda je šla na svet. Vsak domačin, ki si zapomni Filakovo vprego, plug ali njivo, je vabljen kot priča: ta zapis je šele začetek zgodbe.",
    storyEn:
      "Griblje gave farming an ambassador too: Anton Filak, an eight-time participant in the world ploughing championships. His discipline is the oldest skill of the human hand at the soil — cutting the furrow — raised into a measured sport.\n\nPloughing is the summit of farming knowledge. A just furrow asks everything: reading the soil (jerina over limestone behaves differently from the wet clay of the valley), timing (too early — the furrow crumbles; too late — it loses its moisture), a calm animal and a hand that knows how to trust the plough. In the village a farmer was known by his furrow: who ploughs shallow and slanting, who straight and to the depth. Whoever ploughed well shone in the neighbours' eyes as a master fit to run a house.\n\nThe world ploughing championships have been held since 1953: national teams compete in conventional and reversible ploughing, and judges score depth, straightness of the furrow, coverage of stubble and cleanliness of the split. Ploughing with a horse team — the root of this sport — is documented in Fran Vesel's photographs from the early 20th century; one of them is this record's main image. The championship turned a farming necessity into a discipline: the same hand, the same plough, only a measuring tape instead of the neighbour's eye.\n\nMost beautifully of all, the sport never left the farmhouse: the champions remained farmers, ploughing the frozen April mornings of home exactly as they ploughed the smooth competitive field. In Griblje ploughing was a family science — a father handed the plough to his son, the son the team to his own — and it was precisely that chain that carried the skill all the way to the world stage.\n\nYet the hand that can cut a furrow could do more. In 1998 Filak, upon the birth of his son, made a vow and at the villagers' assembly proposed the purchase of the main bell for the church of St. Vitus, taken away in the First World War; with the donations of locals and of emigrants from Australia and America they raised enough for a 700-kilogram bell from the Feralit foundry and a complete renewal of the facade, roof, staircase and electrification, and the culmination of the celebration was blessed by Archbishop dr. Alojzij Šuštar. \"The whole village then breathed as one soul,\" Filak said of the action — the same man who, at the 2026 jubilee, as president of the construction committee, led the renovation of the church building as well.\n\nIn 2019 the competition came home: at the Tomažin farm in Griblje the Ploughmen's Club staged the regional championship of Bela krajina — nine ploughmen, eight of them with krajiki ploughs. The victory stayed in the village: first was Anton Filak, second Gašper Filak, third Janez Ivanič; the roadside held watchers of every generation, and the youngest met the afternoon with a swim in the Kolpa.\n\nThe museum publishes what it holds: Filak's participation in eight world championships is recorded from a public source; the years, placings and the make-up of the team still await the archive. When they are found they will be added with their source — until then the record stands on its thinnest but firmest layer: a Griblje furrow went out into the world. Every local who remembers Filak's team, plough or field is invited as a witness: this record is only the beginning of the story.",
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
      {
        key: "sn-filak-1998",
        nameSi: "Slovenske novice (13. 8. 2026): Anton Filak — pobudnik akcije za zvon (1998) in predsednik gradbenega odbora ob obnovi cerkve",
        nameEn: "Slovenske novice (13 Aug 2026): Anton Filak — the initiator of the bell action (1998) and president of the construction committee at the church renovation",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://slovenskenovice.delo.si/novice/slovenija/v-butoraju-in-gribljah-s-slovesno-maso-proslavili-500-letnici-cerkev-je-vedno-ogledalo-vasi-foto",
        noteSi: "Zaobljuba ob rojstvu sina, donacije iz Avstralije in Amerike, zvon livarne Feralit, blagoslov nadškofa Šuštarja.",
        noteEn: "The vow at his son's birth, the donations from Australia and America, the Feralit foundry bell, the blessing of Archbishop Šuštar.",
      },
      {
        key: "odeon-tekmovalci-oranja-2019",
        nameSi: "Radio Odeon — Plug kot simbol kmetijstva in preživetja človeka na zemlji (23. 8. 2019)",
        nameEn: "Radio Odeon — The plough as the symbol of farming and of man surviving on the land (23 Aug 2019)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/plug-kot-simbol-kmetijstva-in-prezivetja-cloveka-na-zemlji/",
        noteSi: "Regijsko tekmovanje na Tomažinovi kmetiji v Gribljah: 1. Anton Filak, 2. Gašper Filak, 3. Janez Ivanič; devet oračev.",
        noteEn: "The regional contest at the Tomažin farm in Griblje: 1st Anton Filak, 2nd Gašper Filak, 3rd Janez Ivanič; nine ploughmen.",
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
      "Bela štorklja se vrne iz Afrike konec marca in aprila — prav v čas, ko jurji naznanjajo pomlad. V Beli krajini gnezdi na dimnikih in drogovih, ob reki in mokriščih Kolpe išče hrano, avgusta in septembra pa se z mladiči odpravi na pot čez Balkan proti Afriki.\n\nPot je daljša, kot se zdi. Štorklje iz Slovenije letijo prek Balkana do Bosporske ožine ob Črnem morju, naprej čez Bližnji vzhod in dol po Nilu do podsaharske Afrike; ne letijo ponoči in ne čez odprta morja, ampak se dvigajo v toplotnih stolpih nad kopnim. Dnevno preletijo stotine kilometrov, na leto pa več kot deset tisoč v vsako smer. Vrnitev v isto gnezdo je zato majhen čudež navigacije brez kompasa.\n\nGnezdo je naselje, ne samo stavba: pari se vračajo k istemu dimniku, gnezdo vsako leto dograjujejo, tehta lahko več sto kilogramov, v njem pa se izmenjujejo generacije. Domačini gnezda varujejo in popravljajo — tudi s prihrano hrano, če pomladi zmanjka. Dolina Kolpe je zavarovano območje Natura 2000 prav tudi zaradi ptic ob reki: mrtvice, travniki in plitvine so štorklji jedilnik.\n\nSlovenija šteje nekaj sto parov bele štorklje; popise vodi Društvo za opazovanje in preučevanje ptic Slovenije (DOPPS), najgosteje pa vrsta gnezdi v pomurski ravnini. Bela krajina je zahodni krak te zgodbe — in presenetljivo mlad: prve bele štorklje so se tu naselile šele leta 1993, verjetno kot posledica vojne na Hrvaškem, ki je ptice pregnala z gnezd na drugem bregu Kolpe. Danes tu gnezdi okoli enajst parov, ob reki pri Zemeljah, Krasincu, Otku, Borštu, Cerkvišču in Proložju ter ob Lahinji v okolici Dragatuša — gnezda niso gosta, a je zato vsako posebej znano.\n\nVaška identiteta štorklje je izrecna: gnezdo na dimniku je čast, zato gnezda domačini varujejo in popravljajo. Muzej bo spremljal gnezda v Gribljah z vaškimi fotografi: vsako leto en posnetek, vsak posnetek en vir. Tako zbirka raste kot sam življenjski krog ptice.",
    storyEn:
      "The white stork returns from Africa at the end of March and in April — precisely when the jurji announce spring. In Bela krajina it nests on chimneys and poles, feeds by the river and wetlands of the Kolpa, and in August and September departs with its young across the Balkans towards Africa.\n\nThe journey is longer than it seems. Storks from Slovenia fly across the Balkans to the Bosphorus at the Black Sea, on over the Middle East and down the Nile to Sub-Saharan Africa; they do not fly at night, nor over open seas, but climb the thermal towers above the land. They cover hundreds of kilometres a day, and more than ten thousand in each direction every year. The return to the same nest is a small miracle of navigation without a compass.\n\nThe nest is a settlement, not merely a structure: pairs return to the same chimney, rebuild the nest each year, until it can weigh several hundred kilograms, and generations succeed one another within it. The households protect and mend the nests — even with spare food when a spring runs hungry. The Kolpa valley is a protected Natura 2000 site precisely because of its riverside birds: backwaters, meadows and shallows are the stork's menu.\n\nSlovenia counts a few hundred pairs of white storks; the censuses are led by the Bird Watching and Study Association of Slovenia (DOPPS), and the densest colonies stand in the Pomurje plain. Bela krajina is the western arm of the story — and a surprisingly young one: the first white storks settled here only in 1993, probably as a consequence of the war in Croatia, which drove the birds from their nests on the far bank of the Kolpa. Today around eleven pairs breed here, along the river at Zemelj, Krasinec, Otok, Boršt, Cerkvišče and Prolozje and along the Lahinja near Dragatuš — the nests are not many, and each one is therefore known by name.\n\nThe village identity of the stork is explicit: a nest on one's chimney is an honour, so the households protect and repair the nests. The museum will follow the nests of Griblje with village photographers: one photograph a year, every photograph a source. Thus the collection grows like the bird's own life cycle.",
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
      {
        key: "wiki-bk-storklje",
        nameSi: "Wikipedija: Bela krajina (odstavek o belih štorkljah — naselitev 1993)",
        nameEn: "Wikipedia: Bela krajina (the passage on the white storks — the 1993 settlement)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Bela_krajina",
        noteSi:
          "Naselitev prvih belih štorkelj leta 1993, verjetno kot posledica vojne na Hrvaškem; okoli 11 gnezdečih parov ob Kolpi in Lahinji s seznamom vasi.",
        noteEn:
          "The settlement of the first white storks in 1993, probably as a consequence of the war in Croatia; around 11 breeding pairs along the Kolpa and the Lahinja with the list of villages.",
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
      "Belina breza (Betula pendula) je pionirska drevesna vrsta, ki osvaja svetle gozdne robe in opuščene travnike — po zadnji ledeni dobi je bila med prvimi drevesi, ki so se vrnila v odprto Evropo. V Beli krajini je postala identiteta: »bela« pokrajine se razkriva ne le po apneno beljenih stenah hiš in belem kruhu, ampak tudi po beli skorji brez.\n\nPo beli skorji so črne črtice — ljudje so v njih videli pisanje, ki ga ni nihče naučil brati. Iz lesa so nastajali rogovi in korita, iz lubja obroči in zdravilni obkladki, iz vej metle, ki so pometale dvorišča, iz brstov pa čaj; spomladi so iz ranjenega debla natačili sok — hladno, bistro pijačo, ki so jo imeli za prvo pomladansko zdravilo. V slovenski pripovedi je breza drevo začetkov: prva se zaseli opuščeno zemljo, prva ozeleni rob gozda, kjer je prej pihal samo veter.\n\nJurji so se oblekli v njeno zelenje — v zapisu o jurjevanju ta šega stoji skupaj z razlagami o pomladi. Breza je pokrajini dala tudi obraz: kdor hodi ob Kolpi, jo vidi na vsakem koraku — ob bregovih, na robu vinogradov, za vaškimi hlevi. Bela krajina brez breze ne bi bila bela; ime dežele se zdi njen osebni dar. Tudi varstvo ji je sledilo: Krajinski park Kolpa, ki varuje obrežni svet ob reki — dolino, ki se odpira tudi pod Gribljami —, ureja Uredba o Krajinskem parku Kolpa (Uradni list RS, št. 85/06, s poznejšimi spremembami): breza je zavarovana skupaj z deželo, ki jo je poimenovala.\n\nMuzej ima brezo za enega od osrednjih motivov: obiskovalca vabimo, da fotografira eno samo brezo v Gribljah ob vsakem obisku — iz tisočih posnetkov bo nekoč nastala letna galerija vasi. Breza je letni čas v drevesu: spomladi svetla, jeseni zlata, pozimi samo še bela črta na hribu — enaka vasi, ki jo piše.",
    storyEn:
      "The silver birch (Betula pendula) is a pioneer tree that colonises bright forest edges and abandoned meadows — after the last ice age it was among the first trees to return to open Europe. In Bela krajina it became an identity: the region's \"white\" reveals itself not only in the lime-whitewashed house walls and the white bread, but in the birch's white bark.\n\nAcross the white bark run black marks — people saw in them a writing no one had taught them to read. Its wood gave horns and troughs, its bark hoops and healing poultices, its twigs the besoms that swept the yards, its buds a tea; in spring the sap was tapped from the wounded trunk — a cold, clear drink held to be the first medicine of spring. In Slovene tale the birch is the tree of beginnings: the first to settle abandoned ground, the first to green the edge of a wood where only wind blew before.\n\nThe jurji dressed in its greenery — in the record on jurjevanje that custom stands together with the readings of spring. The birch gave the landscape its face as well: whoever walks along the Kolpa sees it at every step — by the banks, on the edge of the vineyards, behind the village byres. Bela krajina would not be white without the birch; the region's name seems its personal gift. Protection has followed it too: the Kolpa Landscape Park, which guards the riverside world along the river — the valley that opens below Griblje as well — is governed by the Decree on the Kolpa Landscape Park (Official Gazette of the Republic of Slovenia, no. 85/06, with later amendments): the birch is protected together with the land it named.\n\nThe museum takes the birch as one of its central motifs: visitors are invited to photograph a single birch in Griblje on every visit — one day, an annual gallery of the village will grow out of a thousand frames. The birch is a season in a tree: bright in spring, golden in autumn, in winter only a white line on the hill — like the village it writes.",
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
        key: "kp-kolpa-uredba",
        nameSi: "Krajinski park Kolpa — osebna izkaznica: Uredba o Krajinskem parku Kolpa (Uradni list RS, št. 85/06)",
        nameEn: "Kolpa Landscape Park — identity card: the Decree on the Kolpa Landscape Park (Official Gazette of the RS, no. 85/06)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://kp-kolpa.si/o-nas/osebna-izkaznica/",
        noteSi:
          "Pravna podlaga parka, ki varuje obrežni svet ob Kolpi: steljnike, brezove gozdove in kraške pojave.",
        noteEn:
          "The legal basis of the park that guards the riverside world of the Kolpa: the steljniki, birch woods and karst features.",
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
    slug: "crni-moceril",
    category: "narava",
    titleSi: "Črni močeril — črna človeška ribica Bele krajine",
    titleEn: "The black olm — Bela krajina's dark proteus",
    periodSi: "odkrit 18. oktobra 1986",
    periodEn: "discovered on 18 October 1986",
    summarySi:
      "Podzemna dvoživka, ki živi le v kraških vodah okolice Črnomlja: temna sestrica znane bele človeške ribice — in za razliko od nje vidi.",
    summaryEn:
      "An underground amphibian living only in the karst waters around Črnomelj: the dark sister of the famous white olm — and unlike her, it can see.",
    storySi:
      "Griblje so najbolj suh kot Bele krajine — nad vasjo je svetlo in vode je malo. Toda pod istim kraškim svetom teče druga dežela: voda, ki ponika in se vrača v studencih ob Kolpi. V njej živi žival, ki je znanost srečala šele leta 1986: črni močeril, podvrsta človeške ribice — temno pigmentirana in z normalno razvitimi očmi, medtem ko je njena slavna bela sorodnica iz Postojnske jame brez pigmenta in slepa.\n\nOdkritje se je zgodilo 18. oktobra 1986, ko so raziskovalci Inštituta za raziskovanje krasa ob črpalnem preizkusu vode na izviru Dobličice pri Črnomlju izvlekli do takrat neznano temno žival. Podvrsto je znanstveno opisal slovenski zoolog Boris Sket in ji dal ime parkelj — »hudiček«: skoraj črno telo z živo rdečimi škrgami je namreč spominjalo na miklavževske parklje, črne vragove z rdečim jezikom. Po do sedaj znanih podatkih črni močeril živi le v ožji okolici Črnomlja, na površini manjši od sto kvadratnih kilometrov. Izvir Jelševniščice v Jelševniku je edino najdišče na svetu, kjer ga je mogoče videti v naravnem okolju.\n\nBelokranjska črna človeška ribica — tako jo radi imenujejo — spada med najbolj ogrožene živalske podvrste pri nas: njena usoda je napisana v čistosti ponikalnic in izvirov, ki jih napaja isti kraški sistem, pod katerim stojijo tudi Griblje. Suhi svet nad vasjo in črna žival pod njim sta dve plasti iste zgodbe, ki ju drži voda — kar ponikne na enem koncu dežele, se izvira na drugem.\n\nMuzej zapis dolgo ni imel fotografije: svobodnega posnetka živali ni bilo v arhivu, in zapis je stal brez nje, po poštenosti, ki prepoveduje izmišljevanje. Danes nosi Hodaličevo fotografijo glave črnega močerila iz odprtega arhiva Wikimedia Commons — obraz živali, ki jo je v živo videlo le peščica ljudi na svetu. Njen dom pa ostaja izvir Jelševniščice: kdor tja pride s potrpljenjem, je še vedno vabljen kot priča.",
    storyEn:
      "Griblje is the driest corner of Bela krajina — above the village the world is bright and water is scarce. Yet beneath the same karst world runs another land: water that sinks away and returns in the springs along the Kolpa. In it lives an animal science met only in 1986: the black olm, a subspecies of the olm — darkly pigmented and with normally developed eyes, while its famous white relative of Postojna Cave is pigmentless and blind.\n\nThe discovery came on 18 October 1986, when researchers of the Karst Research Institute, during a pumping test at the Dobličica spring near Črnomelj, drew out a dark animal unknown until then. The subspecies was scientifically described by the Slovene zoologist Boris Sket, who gave it the name parkelj — the \"little devil\": its almost black body with vividly red gills recalled the St. Nicholas devils, black imps with red tongues. According to present knowledge the black olm lives only in the narrow surroundings of Črnomelj, over an area smaller than a hundred square kilometres. The Jelševniščica spring at Jelševnik is the only site in the world where it can be seen in its natural environment.\n\nBela krajina's black olm — as it is gladly called — ranks among the most endangered animal subspecies of our land: its fate is written in the purity of the sinking streams and springs fed by the same karst system beneath which Griblje stands. The dry world above the village and the black animal below it are two layers of one story held together by water — what sinks at one end of the land rises at the other.\n\nThe museum kept this record without a photograph for a long time: no free image of the animal existed in the archive, and the record stood without one, under the honesty that forbids invention. Today it carries Hodalič's photograph of the black olm's head from the open Wikimedia Commons archive — the face of an animal that only a handful of people on earth have seen alive. Its home remains the Jelševniščica spring: whoever comes there with patience is still invited as a witness.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/crni-moceril.jpg",
    imageCredit: "Foto: Arne Hodalič · Wikimedia Commons · CC BY-SA 3.0",
    yearFrom: 1986,
    featured: false,
    addedAt: "2026-09-16",
    sources: [
      {
        key: "wiki-moceril",
        nameSi: "Wikipedija: črni močeril (Proteus anguinus parkelj)",
        nameEn: "Wikipedia: the black olm (Proteus anguinus parkelj)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/%C4%8Crni_mo%C4%8Deril",
        noteSi:
          "Temeljni zapis: odkritje 1986 ob preučevanju vode iz izvira Dobličice, znanstveni opis Borisa Sketa, življenje v ožji okolici Črnomlja.",
        noteEn:
          "The base record: the 1986 discovery while studying the water of the Dobličica spring, Boris Sket's description, life in the narrow surroundings of Črnomelj.",
      },
      {
        key: "wiki-bk-moceril",
        nameSi: "Wikipedija: Bela krajina (odstavek o črnem močerilu — odkritje ob izviru Jelševniščice)",
        nameEn: "Wikipedia: Bela krajina (the passage on the black olm — the discovery by the Jelševniščica spring)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Bela_krajina",
        noteSi:
          "Krajevna umestitev odkritja: izvir Jelševniščice v naselju Jelševnik.",
        noteEn:
          "The local setting of the discovery: the Jelševniščica spring in the village of Jelševnik.",
      },
      {
        key: "zrsvn-moceril",
        nameSi: "Zavod RS za varstvo narave: črna človeška ribica",
        nameEn: "Institute of the Republic of Slovenia for Nature Conservation: the black olm",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.zrsvn-varstvonarave.si/",
        noteSi:
          "Državna naravovarstvena ustanova o ogroženi podvrsti; poziv k zaščiti izvirov Bele krajine.",
        noteEn:
          "The state nature-conservation institution on the endangered subspecies; the call to protect Bela krajina's springs.",
      },
      {
        key: "rtv-moceril",
        nameSi:
          "RTV Slovenija (17. 6. 2020): Za ogroženo belokranjsko črno človeško ribico je največja nevarnost človek",
        nameEn:
          "RTV Slovenija (17 Jun 2020): For the endangered black olm of Bela krajina, the greatest danger is man",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/okolje/za-ogrozeno-belokranjsko-crno-clovesko-ribico-je-najvecja-nevarnost-clovek/527397",
        noteSi:
          "Primerjava z belo podvrsto: temno obarvana koža in dokaj normalno razvite oči; ogroženost.",
        noteEn:
          "The comparison with the white subspecies: darkly coloured skin and fairly normally developed eyes; the endangerment.",
      },
      {
        key: "odeon-moceril",
        nameSi:
          "Radio Odeon (18. 10. 2022): 36 let od odkritja črne človeške ribice — Jamski laboratorij Tular",
        nameEn:
          "Radio Odeon (18 Oct 2022): 36 years since the black olm's discovery — the Tular Cave Laboratory",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/36-let-od-odkritja-crne-cloveske-ribice/",
        noteSi:
          "Natančen datum odkritja: 18. oktober 1986, črpalni preizkus izvira Dobličice.",
        noteEn:
          "The exact date of the discovery: 18 October 1986, a pumping test at the Dobličica spring.",
      },
      {
        key: "ckff-moceril",
        nameSi: "CKFF: človeška ribica (Proteus anguinus Laurenti, 1768)",
        nameEn: "CKFF: the olm (Proteus anguinus Laurenti, 1768)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.ckff.si/",
        noteSi:
          "Morfološka primerjava podvrst: črnosiva barva, krajša in širša glava, normalno razvite oči.",
        noteEn:
          "The morphological comparison of the subspecies: black-grey colour, a shorter and broader head, normally developed eyes.",
      },
      {
        key: "commons-moceril-foto",
        nameSi: "Wikimedia Commons: fotografija glave črnega močerila (Arne Hodalič)",
        nameEn: "Wikimedia Commons: photograph of the black olm's head (Arne Hodalič)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 3.0",
        url: "https://commons.wikimedia.org/wiki/File:P_anguinus_parkelj-head.jpg",
        noteSi:
          "Slika zapisa: avtentična fotografija glave podvrste iz odprtega arhiva; dolgo je bila edina prosto dostopna.",
        noteEn:
          "The record's image: an authentic photograph of the subspecies' head from the open archive; for long the only freely available one.",
      },
      {
        key: "odeon-moceril-40-let",
        nameSi:
          "Radio Odeon (5. 2. 2026): Črni močeril v Beli krajini po 40 letih od odkritja k čistejšemu habitatu",
        nameEn:
          "Radio Odeon (5 Feb 2026): The black olm of Bela krajina, 40 years after its discovery, towards a cleaner habitat",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/crni-moceril-v-beli-krajini-po-40-letih-od-odkritja-k-cistejsemu-habitatu/",
        noteSi:
          "Predstavitev Grehi preteklosti v Dobličah: na območju treh belokranjskih občin več kot 200 onesnaženih jam z več kot 1200 m³ odpadkov; habitat podvrste ≈ 3 km² na stiku Črnomaljskega ravnika in Poljanske gore.",
        noteEn:
          "The Sins of the Past presentation in Dobliče: more than 200 polluted caves with over 1,200 m³ of waste across the three Bela krajina municipalities; the subspecies' habitat ≈ 3 km² at the meeting of the Črnomelj karst plain and Poljanska gora.",
      },
      {
        key: "odeon-protectus",
        nameSi:
          "Radio Odeon (29. 10. 2025): Podpora za zaščito črnega močerila in najpomembnejšega vira pitne vode Bele krajine",
        nameEn:
          "Radio Odeon (29 Oct 2025): Support for protecting the black olm and Bela krajina's most important drinking-water source",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/podpora-za-zascito-crnega-mocerila-in-najpomembnejsega-vira-pitne-vode-bele-krajine/",
        noteSi:
          "Projekt PROTEctUS Jamarskega kluba Novo mesto je na razpisu Obet za planeta (Gen-I) prejel 40.000 € za čiščenje in varovanje jamskih habitatov črnega močerila.",
        noteEn:
          "The PROTEctUS project of the Novo mesto Caving Club received €40,000 from the Obet za planet call (Gen-I) for cleaning and protecting the black olm's cave habitats.",
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
      "Leta 1869 je Dunaj izdal Reichsvolksschulgesetz — državni zakon, ki je šolanje naredil za dolžnost vsakega otroka od šestega do štirinajstega leta. Po deželah cesarstva so zrasle vaške šole: ena učilnica, en učitelj, vsi razredi hkrati. Za Griblje to vprašanje ima odgovor, ki ga je obnovila televizija: za novo šolsko poslopje je leta 1885 daroval sam cesar Franc Jožef, gradnja se je začela tri leta pozneje — zgrajeni zid se je kmalu podrl, zidarju so odvzeli delo — 5. novembra 1889 pa je bilo poslopje slovesno blagoslovljeno. Prvi učitelj, pripravnik Peter Kambič iz Krasinca, je nastopil 29. oktobra 1889 in že januarja umrl za jetiko: zidovje še ni bilo osušeno. Za isto boleznijo je leta 1913 umrl tudi učitelj Frančišek Kalan; njega je nasledil Ernest Šušteršič — mladi Niko Dragoš, ki se je prvega šolskega dne 1913 skril za svinjakom, je odšel prav k njemu. Med vojno je pouk na pol prevzela Amalija Uršič, begunka s Kobaridskega: dobro izobražena Primorka, ki je vasi poleg abecede prinesla še tamburo. Šola je bila enorazrednica z dvema prostoroma — učilnico in učiteljevim stanovanjem — in pouk je tekal po dveh težavnostih hkrati: medtem ko je ena skupina pisala, je druga poslušala.\n\nVaška šola je imela svoj vrstni red: tablica namesto zvezka, kreda namesto peresa, ustno štetje do sto in abecednik pod blazino. Vrstni red je prestavljal tudi kmetijsko leto — ob žetvi in senašbi so klopi stale prazne, saj so otroške roke na kmetiji štele toliko kot odrasle. Vsak izpeljan šolski dan je bila zato majhna zmaga.\n\nBralne navade vasi pozna tudi Mohorjeva družba: med naročniki Društva sv. Mohorja v župniji Podzemelj so bili leta 1916 tudi vaščani iz Gribelj — knjige so v vas prihajale po pošti iz Celja, šolska kronika pa je danes v Slovenskem šolskem muzeju.\n\nKdor je znal brati, je v vas zanesel svet: časopis, ki so si ga podajali od hiše do hiše, in pisma iz Amerike, ki so jih družine poslušale pri petrolijevi luči. Branje je bilo oblika vaške pošte, šola pa njen urad. Iz nje so zrasle poti, ki jih ta zbirka že pozna: Niko Županič, deček iz Gribelj, je postal univerzitetni profesor; Anton Filak, roka od pluga, svetovni prvak v oranju.\n\nBela krajina je šoli dodala še eno poglavje: med drugo svetovno vojno je bila eno najbolj svobodnih ozemelj okupirane Evrope — s šolami, tiskarnami in bolnišnicami. Po italijanski kapitulaciji septembra 1943 je v Črnomlju delovala partizanska gimnazija; stavba na fotografiji tega zapisa je ravno ona — danes glasbena šola. V letu, ko je bil pouk po Evropi prepovedan ali razseljen, je dežela ob Kolpi zmogla celo gimnazijo.\n\nPred podružnično šolo OŠ Loka v Gribljah danes stoji spomenik trinajstim padlim vaščanom — šola in spomin na istem pragu (zapis spomenik-padlim).\n\nZapis se je dolgo vprašal, kdaj je šola prišla v Griblje; o njeni sedanjosti pa ve natanko. Podružnična šola Griblje, del OŠ Loka Črnomelj, je v šolskem letu 2023/2024 štela enaindvajset učencev v dveh kombiniranih oddelkih: prvo- in drugošolce sta poučevala Branka Weiss in Ana Kočevar, tretje-, četrt- in petošolce Jana Štajdohar, angleščino pa David Štefanič; za malico in urejenost šole skrbi Nežka Filak. Septembra 2026 so prag prestopili štirje prvošolci — starejši učenci so jih pozdravili s pesmijo, besedo in torto. Iz tablic v svet, in spet nazaj.\n\nMuzej išče razredne fotografije, imena učiteljev in učne knjige z imeni gribeljskih otrok. Vaška šola je zapustila največ arhiva in najmanj spomina: kdo pa si danes še zapomni, kaj je bilo napisano na tablici?",
    storyEn:
      "In 1869 Vienna issued the Reichsvolksschulgesetz — an imperial law that made schooling the duty of every child from six to fourteen. Across the lands of the Empire village schools grew up: one classroom, one teacher, all the grades at once. For Griblje that question now has an answer television has brought back to light: for the new school building Emperor Franz Joseph himself donated in 1885; building began three years later — the freshly built wall soon collapsed, and the mason lost the job — and on 5 November 1889 the building was solemnly blessed. The first teacher, the trainee Peter Kambič of Krasinec, took up his post on 29 October 1889 and died of tuberculosis as early as January: the walls were not yet dry. Of the same illness died, in 1913, the teacher Frančišek Kalan; he was followed by Ernest Šušteršič — the young Niko Dragoš, who hid behind the pigsty on his first school morning in 1913, walked straight to him. During the war the teaching was half taken over by Amalija Uršič, a refugee from the Kobarid country: a well-schooled woman of the Littoral who brought the village the tambura beside the alphabet. The school was a one-room one with two spaces — the classroom and the teacher's flat — and lessons ran at two levels at once: while one group wrote, the other listened.\n\nThe village school kept its own order: a slate instead of an exercise book, chalk instead of a pen, counting aloud to a hundred and a primer under the pillow. The order shifted with the farming year as well — at harvest and haying the benches stood empty, for on a farm children's hands counted as much as grown ones. Every completed school day was therefore a small victory.\n\nThe village's reading habits are known to the Mohor society as well: among the subscribers of the Society of St. Mohor in the Podzemelj parish in 1916 were villagers of Griblje — books reached the village by post from Celje, and the school chronicle is kept today in the Slovene School Museum.\n\nWhoever could read carried the world into the village: the newspaper passed from house to house, and the letters from America that families listened to by the petroleum lamp. Reading was a form of the village post, and the school was its office. Out of it grew the roads this collection already knows: Niko Županič, the boy from Griblje, became a university professor; Anton Filak, a hand from the plough, a world champion of ploughing.\n\nBela krajina added another chapter to the school: during the Second World War it was one of the freest territories of occupied Europe — with schools, print shops and hospitals. After the Italian capitulation in September 1943 a Partisan gymnasium operated in Črnomelj; the building in this record's photograph is precisely that one — today a music school. In a year when lessons across Europe were forbidden or scattered, the land by the Kolpa sustained even a grammar school.\n\nBefore the branch school of OŠ Loka at Griblje stands the memorial to the thirteen fallen villagers — school and memory on the same threshold (see the record of the memorial).\n\nThe record long asked when the school came to Griblje; about its present it knows precisely. The branch school of Griblje, part of OŠ Loka Črnomelj, counted twenty-one pupils in two combined departments in the school year 2023/2024: the first and second grades were taught by Branka Weiss and Ana Kočevar, the third, fourth and fifth by Jana Štajdohar, English by David Štefanič; Nežka Filak cares for the morning snack and the school's order. In September 2026 four first-graders crossed the threshold — the older pupils welcomed them with a song, a word and a cake. From slates into the world, and back again.\n\nThe museum is looking for class photographs, teachers' names and schoolbooks bearing the names of Griblje's children. The village school left behind the greatest archive and the least memory: who today still remembers what was written on the slate?",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/sola-abecednik.jpg",
    imageCredit:
      "Primož Trubar: Abecedarium (1550) · Wikimedia Commons · javna last — prvi slovenski abecednik, začetek poti »iz tablic v svet«",
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
        key: "rtv-dragos-2013-sola",
        nameSi: "RTV Slovenija — Razglednice preteklosti: 106-letni Niko (1. 12. 2013) — gradnja šole, učitelji Kambič, Kalan, Šušteršič in Uršičeva",
        nameEn: "RTV Slovenija — Postcards of the Past: Niko at 106 (1 Dec 2013) — the building of the school, the teachers Kambič, Kalan, Šušteršič and Uršičeva",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.rtvslo.si/kultura/razglednice-preteklosti/106-letni-niko-in-mladostna-leta-ob-tamburicah/323956",
        noteSi: "Šolska kronika v Slovenskem šolskem muzeju; cesarjev dar 1885; blagoslov 5. 11. 1889; učitelji do Amalije Uršič; naročniki Mohorjeve družbe 1916.",
        noteEn: "The school chronicle at the Slovene School Museum; the Emperor's gift of 1885; the blessing of 5 Nov 1889; the teachers down to Amalija Uršič; the Mohor society subscribers of 1916.",
      },
      {
        key: "os-loka-griblje-danes",
        nameSi: "OŠ Loka Črnomelj — Podružnica Griblje: 21 učencev v dveh kombiniranih oddelkih (šolsko leto 2023/2024)",
        nameEn: "OŠ Loka Črnomelj — the Griblje branch school: 21 pupils in two combined departments (school year 2023/2024)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "http://osloka.splet.arnes.si/podruznica-griblje-naslovna/",
        noteSi:
          "Sedanjost šole: imena učiteljev (Weissova, Kočevarjeva, Štajdoharjeva, Štefanič, Filakova) in kombinirani oddelki — šola z 1. po 5. razred.",
        noteEn:
          "The school's present: the teachers' names (Weiss, Kočevar, Štajdohar, Štefanič, Filak) and the combined departments — a school of grades 1 to 5.",
      },
      {
        key: "os-loka-prvi-dan-2026",
        nameSi: "OŠ Loka Črnomelj (3. september 2026): Prvi šolski dan na Podružnični šoli Griblje — štirje prvošolci",
        nameEn: "OŠ Loka Črnomelj (3 September 2026): The first school day at the Griblje branch school — four first-graders",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.os-loka-crnomelj.si/2026/09/03/prvi-solski-dan-na-podruznicni-soli-griblje/",
        noteSi:
          "Doživetje septembra 2026: dobrodošlica starejših učencev s pesmijo in besedo, zaključek s torto.",
        noteEn:
          "The September 2026 moment: the older pupils' welcome with a song and a word, closed with a cake.",
      },
      {
        key: "commons-abecednik",
        nameSi: "Wikimedia Commons: Primož Trubar — Abecednik (1550), prvi slovenski tiskani priročnik za branje",
        nameEn: "Wikimedia Commons: Primož Trubar — Abecedarium (1550), the first Slovene printed reading book",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Primo%C5%BE_Trubar_-_Abecednik.jpg"),
        noteSi: "Glavna slika zapisa: Trubarjev abecednik iz leta 1550 — simbol poti »iz tablic v svet«, ki se je v Gribljah začela z blagoslovom šolskega poslopja leta 1889.",
        noteEn: "The record's main image: Trubar's primer of 1550 — the symbol of the road \"from slates into the world\" that began at Griblje with the blessing of the school building in 1889.",
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
      {
        key: "odeon-vaja-evakuacija",
        nameSi: "Radio Odeon: Vaja evakuacije na podružnici Griblje (22. 11. 2024)",
        nameEn: "Radio Odeon: An evacuation drill at the Griblje school branch (22 November 2024)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/vaja-evakuacije-na-podruznici-griblje/",
        noteSi: "Podružnica v praksi: vodja Marjetka Žunič, zvonec, zbirno mesto, gasilci PGD Griblje in PGD Adlešiči — šola, ki se varnosti uči z vajo.",
        noteEn: "The branch school in practice: head Marjetka Žunič, the bell, the assembly point, the firefighters of PGD Griblje and PGD Adlešiči — a school that teaches safety by rehearsing it.",
      }
    ],
  },
  {
    slug: "pgd-griblje-1927",
    addedAt: "2026-09-15",
    category: "kraj",
    titleSi: "PGD Griblje (od 1927)",
    titleEn: "The Volunteer Fire Brigade of Griblje (since 1927)",
    periodSi: "1927 → danes",
    periodEn: "1927 → present",
    summarySi:
      "Prostovoljno gasilsko društvo, ustanovljeno leta 1927: najstarejša še delujoča organizacija v vasi — bramba pred ognjem in druga dvorana Gribelj.",
    summaryEn:
      "The volunteer fire brigade, founded in 1927: the oldest still-active organisation in the village — a defence against fire and Griblje's second hall.",
    storySi:
      "Vsaka slovenska vas ima tri strehe, pod katerimi se živi skupaj: cerkev, šolo in gasilski dom. V Gribljah stojijo vse tri — gasilski dom z naslovom Griblje 35B pa je najmlajša in hkrati najbolj vsakdanja med njimi: dvorana, v kateri se vrstijo vaje, srečanja in praznovanja, in streha, pod katero je minilo vse gribeljsko 20. stoletje.\n\nProstovoljno gasilsko društvo Griblje je bilo ustanovljeno leta 1927 — v desetletju, ko je gasilstvo po slovenskih vaseh postalo novi vrstni red sosedstva: kdor je imel roke, je imel dolžnost. Kdo je bil prvi načelnik, katera je bila prva ročna brizgalna in kje točno je ustanovni zbor leta 1927 zapisal svoja imena — ti zapisi še čakajo na arhiv; kar je zapisano v javnosti, je leto v imenu in živo društvo z lastnim domom.\n\nGasilci so v vasi nosili dve vlogi hkrati. Prva je bramba: požar v slami, v žitnici, v krušni peči je bil stoletja najhujša nesreča vasi — velik del slovenskega gasilstva je zrasel prav iz tega strahu. Druga je telo vasi: dom, v katerem so se dražile žetve in košnje, odigrale igre in veselice, sklenile zaroke in presedeli neštete večeri — in prostor, iz katerega je ob vsaki sili stekal tudi humanitarni zagon, ki ga gasilci poznajo bolje kot katera koli druga organizacija.\n\nV jubilejnem letu 2026 je bilo društvo znova v središču: predsednik Darjot Piškurič je pomagal organizirati petstoletnico cerkve sv. Vida, ob izdaji spominske knjižice Memento pa se je ob njem zapisalo tudi ime PGD Griblje 1927 — skupaj z Mestno muzejsko zbirko Črnomelj. Leto pozneje, 2027, bo društvo praznovalo stoletnico — priprave že tečejo. Društvo šteje 140 članov, od tega 18 operativnih gasilcev; pod poveljnikom Matijo Štruceljem so z Gasilsko zvezo Črnomelj posodobili opremo (vozilo s 700 litri vode, 16 dihalnih aparatov), uredili operativno sobo in po toči, ki je poškodovala streho, prenovili dom — z denarjem rojaka Franca Brinca, ki je društvu v zadnjih letih daroval 30.000 evrov. »Dal nam je zagon in s tem prebudil društvo, ki je bilo v rahlem zatonu,« pravi poveljnik. Sto let roko ob roki je starost, ki jo doseže le peščica vaških organizacij.\n\nMuzej išče, kar dom še hrani: fotografije doma in vaj iz 20. stoletja, imena načelnikov, ustanovitvene zapise in stare brizgalne. Gasilski dom hrani najdaljši živi spomin vasi — ta zapis naj mu postavi polic.",
    storyEn:
      "Every Slovene village lives under three roofs together: the church, the school and the fire station. Griblje has all three — and the fire station at Griblje 35B is the youngest and at the same time the most everyday of them: the hall in which drills, meetings and celebrations take their turns, and the roof beneath which the whole Griblje 20th century has passed.\n\nThe Volunteer Fire Brigade of Griblje was founded in 1927 — in the decade when firefighting became the new order of the Slovene village: whoever had hands, had a duty. Who the first commander was, which was the first hand-operated pump, and where exactly the founding assembly of 1927 wrote down its names — those records still await an archive; what is written in public is the year in the name, and a living society with a hall of its own.\n\nThe firemen carried two roles at once. The first is defence: fire in the straw, in the granary, in the bread oven was for centuries the village's worst misfortune — much of Slovene firefighting grew precisely out of that fear. The second is the body of the village: the hall where harvests and haymaking were auctioned, plays were staged, engagements concluded and countless evenings spent — and the place from which, at every emergency, the humanitarian impulse grew that fire brigades know better than any other organisation.\n\nIn the jubilee year 2026 the brigade stood at the centre again: its president Darjot Piškurič helped organise the five-hundredth anniversary of the church of St. Vitus, and with the publication of the memorial booklet Memento the name PGD Griblje 1927 was written beside it — together with the Črnomelj town museum collection. A year later, in 2027, the brigade will mark its centenary — and the preparations are already running. The brigade counts 140 members, 18 of them operational firefighters; under commander Matija Štrucelj they have renewed their equipment with the Fire Association of Črnomelj (a vehicle with 700 litres of water, 16 breathing apparatus), fitted out an operations room, and after hail damaged the roof renovated the whole hall — with money from their fellow villager Franc Brinc, who has donated 30,000 euros to the brigade in recent years. 'He gave us our momentum and with it woke a brigade that was in a gentle decline,' says the commander. A hundred years hand in hand is an age that only a handful of village organisations ever reach.\n\nThe museum is looking for what the hall still holds: photographs of the station and the drills of the 20th century, the names of the commanders, the founding records and the old hand pumps. The fire station keeps the village's longest living memory — this record should give it a shelf.",
    evidenceStatus: "CORROBORATED",
    yearFrom: 1927,    image: "/images/authentic/pgd-crpalka-1924.jpg",
    imageCredit:
      "Foto: Janez Novak, Gasilski muzej Slovenije (Metlika) · Wikimedia Commons · CC BY 2.5 — gasilska ročna črpalka iz leta 1924",

    lat: 45.5754,
    lng: 15.2928,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "commons-pgd-crpalka",
        nameSi: "Wikimedia Commons: Gasilska črpalka iz leta 1924 (fotograf: Janez Novak, Gasilski muzej Slovenije, Metlika)",
        nameEn: "Wikimedia Commons: A fire hand pump from 1924 (photographer: Janez Novak, Fire Museum of Slovenia, Metlika)",
        sourceType: "fotografija",
        license: "CC BY 2.5 (fotograf: Janez Novak)",
        url: WM("Gasilska_crpalka_1924.JPG"),
        noteSi: "Glavna slika zapisa: ročna brizgalna iz leta 1924 — takšna oprema je bila vsakdan gasilskih društev v času ustanovitve PGD Griblje (1927); posneto v Gasilskem muzeju Slovenije v Metliki.",
        noteEn: "The record's main image: a hand pump from 1924 — the everyday equipment of village fire brigades when PGD Griblje was founded (1927); photographed at the Fire Museum of Slovenia in Metlika.",
      },
      {
        key: "pgd-facebook",
        nameSi: "PGD Griblje — uradna stran na Facebooku (»ustanovljeno leta 1927«)",
        nameEn: "PGD Griblje — the official Facebook page (\"founded in 1927\")",
        sourceType: "spletni-vir",
        license: "stran društva / the society's page",
        url: "https://www.facebook.com/profile.php?id=61560623422110",
        noteSi: "Samoizjava društva o letu ustanovitve.",
        noteEn: "The society's own statement of its founding year.",
      },
      {
        key: "bizi-pgd",
        nameSi: "Bizi.si — poslovni imenik: PROSTOVOLJNO GASILSKO DRUŠTVO GRIBLJE, Griblje 35B, 8332 Gradac",
        nameEn: "Bizi.si — business directory: VOLUNTEER FIRE BRIGADE GRIBLJE, Griblje 35B, 8332 Gradac",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.bizi.si/",
        noteSi: "Evidence obstoječega društva z naslovom gasilskega doma.",
        noteEn: "The registry of the existing society with the fire station's address.",
      },
      {
        key: "moja-dolenjska-pgd",
        nameSi: "Moja Dolenjska (26. 6. 2026): zahvala KS Griblje predsedniku PGD Darjotu Piškuriču za pomoč pri organizaciji petstoletnice",
        nameEn: "Moja Dolenjska (26 Jun 2026): the KS Griblje thanks brigade president Darjot Piškurič for help in organising the 500th anniversary",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://moja-dolenjska.si/griblje-slovesno-obelezili-500-letnico-prve-pisne-omembe/",
        noteSi: "Društvo v organizaciji jubileja 2026.",
        noteEn: "The brigade's role in organising the 2026 jubilee.",
      },
      {
        key: "obcina-instagram-pgd",
        nameSi: "Občina Črnomelj — objava (23. 6. 2026): Memento ob 500-letnici — PGD Griblje 1927 in Mestna muzejska zbirka Črnomelj",
        nameEn: "Municipality of Črnomelj — post (23 Jun 2026): the Memento on the 500th anniversary — PGD Griblje 1927 and the Črnomelj town museum collection",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.instagram.com/p/DZ7pevXDEU1",
        noteSi: "Društvo kot izdajatelj/soizdajatelj jubilejne knjižice.",
        noteEn: "The brigade as publisher/co-publisher of the jubilee booklet.",
      },
      {
        key: "odeon-pgd-vaja-2024",
        nameSi: "Radio Odeon: Vaja evakuacije na podružnici Griblje (22. 11. 2024)",
        nameEn: "Radio Odeon: An evacuation drill at the Griblje school branch (22 November 2024)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/vaja-evakuacije-na-podruznici-griblje/",
        noteSi: "Današnja praksa prostovoljnih gasilcev: PGD Griblje in PGD Adlešiči skupaj z Vinčevo vajo evakuacije šole (20. 11. 2024) — reševanje, gašenje, oskrba poškodovanca.",
        noteEn: "Today's practice of the volunteer firefighters: PGD Griblje and PGD Adlešiči together in a school evacuation drill (20 November 2024) — rescue, firefighting, first aid.",
      },
      {
        key: "dolenjskilist-pgd-stoletnica-2026",
        nameSi: "Dolenjski list / Svet24 (13. 5. 2026): Po toči in krizi nov zagon: PGD Griblje pred stoletnico (Milan Glavonjić)",
        nameEn: "Dolenjski list / Svet24 (13 May 2026): 'After hail and crisis, a new momentum: PGD Griblje before its centenary' (Milan Glavonjić)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/lokalno/dolenjska/novice/pgd-griblje-stoletnica-rojak-franc-brinc-1898805",
        noteSi: "Stoletnica 2027: 140 članov (18 operativnih), poveljnik Matija Štrucelj; tekmovanja in kviz gasilske mladine; ob pomoči Gasilske zveze Črnomelj GVC z 700 l vode in 16 dihalnih aparatov; po toči prenovljena streha, izolacija in dom; želja: kombi ob stoletnici.",
        noteEn: "The 2027 centenary: 140 members (18 operational), commander Matija Štrucelj; competitions and the youth fire brigade quiz; with the Fire Association of Črnomelj a rapid-intervention vehicle with 700 l of water and 16 breathing apparatus; roof, insulation and hall renewed after hail; a wish: a van for the centenary.",
      }
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
    image: "/images/authentic/zaseda-spomenik.jpg",
    imageCredit:
      "Foto: digitalna zbirka Spominska obeležja (Knjižnica Črnomelj) · Kamra · CC BY-NC — spominski kamen zasede na cesti Črnomelj–Griblje",
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
        key: "kamra-foto-zaseda",
        nameSi: "Kamra (Knjižnica Črnomelj): fotografija spominskega kamna zasede na cesti Črnomelj–Griblje",
        nameEn: "Kamra (Črnomelj Library): a photograph of the ambush memorial stone on the Črnomelj–Griblje road",
        sourceType: "fotografija",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/mm-elementi/spomenik-napadu-na-italijanske-mejne-policiste/",
        noteSi: "Glavna slika zapisa: pravi spominski kamen zasede iz leta 1960 (EŠD 19324), iz digitalne zbirke Spominska obeležja v občini Črnomelj.",
        noteEn: "The record's main image: the actual memorial stone of the ambush raised in 1960 (EŠD 19324), from the digital collection Memorials of the Municipality of Črnomelj.",
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
      "Druga svetovna vojna je iz Gribelj vzela trinajst imen. Enajst vaščanov je padlo v boju kot partizani, dva pa sta umrla kot žrtvi fašističnega nasilja. Za vsako od teh številk je stal nekdo, ki je nosil ime, hišo in sosedstvo: sin, brat, sosed. Zgodovina, ki jo nosi en sam kamen.\n\nSpomenik sta postavila in odkrila vaščana sama — Krajevni odbor Zveze borcev Griblje — 10. septembra 1961, šestnajst let po koncu vojne, ko so bili spomini še živi in imena še niso bila vprašanje. Stoji pred podružnično šolo Osnovne šole Loka v Gribljah: na pragu, kjer se vsak dan zbira otroški vrstni red, ki se ga je vojna dotaknila najbolj nepravično. Zavod za varstvo kulturne dediščine Slovenije vodi spomenik v registru nepremične kulturne dediščine pod številko EŠD 19326.\n\nKamen ima v tej zbirki soseda: kmalu proti Črnomlju, na isti cesti, stoji spominski kamen zasede iz septembra 1941 (zapis zaseda-1941) — prve oborožene akcije partizanov v okolici. Skupaj pričata, da vojna ni prišla v Griblje z zavezniškimi letali leta 1944, ampak tri leta prej: z okupacijo, postojanko in prvim strelom. Trinajst imen na spomeniku je najkrajši in najtežji seznam, ki ga ta muzej lahko objavi.\n\nFotografija tega zapisa je prava: spomenik pred gribeljsko šolo, posnet iz digitalne zbirke Spominska obeležja v občini Črnomelj (Knjižnica Črnomelj). Prepis trinajstih imen s kamna še čaka na obisk pred spomenikom: ta seznam bo dopolnil spominsko knjigo muzeja — in rodovine, ki jih nosijo.",
    storyEn:
      "The Second World War took thirteen names from Griblje. Eleven villagers fell in battle as Partisans; two died as victims of Fascist violence. Behind each of those numbers stood someone who carried a name, a house and a neighbourhood: a son, a brother, a neighbour. A history carried by a single stone.\n\nThe memorial was raised and unveiled by the villagers themselves — the Griblje local board of the Veterans' Association — on 10 September 1961, sixteen years after the war's end, when memories were still living and names were not yet a question. It stands before the branch school of Osnovna šola Loka at Griblje: on the threshold where the children's daily order gathers — the order the war touched most unjustly. The Institute for the Protection of Cultural Heritage of Slovenia keeps the memorial in the register of immovable cultural heritage under EŠD 19326.\n\nThe stone has a neighbour in this collection: a little way towards Črnomelj, on the same road, stands the memorial stone of the September 1941 ambush (see the record of the ambush) — the first armed action of the Partisans in the area. Together they testify that the war did not come to Griblje with the Allied aircraft of 1944, but three years earlier: with the occupation, a garrison post and the first shot. The thirteen names on the memorial are the shortest and heaviest list this museum can ever publish.\n\nThe record's photograph is the real one: the memorial before the Griblje school, taken from the digital collection Memorials of the Municipality of Črnomelj (Črnomelj Library). The transcription of the thirteen names from the stone still awaits a visit to the memorial: that list will complete the museum's memorial book — and the families that carry them.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/spomenik-griblje.jpg",
    imageCredit:
      "Foto: digitalna zbirka Spominska obeležja (Knjižnica Črnomelj) · Kamra · CC BY-NC — spomenik padlim vaščanom v Gribljah",
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
        key: "kamra-foto-spomenik",
        nameSi: "Kamra (Knjižnica Črnomelj): fotografija spomenika padlim partizanom in žrtvam v Gribljah",
        nameEn: "Kamra (Črnomelj Library): a photograph of the memorial to Griblje's fallen Partisans and victims",
        sourceType: "fotografija",
        license: "CC BY-NC (Kamra)",
        url: "https://www.kamra.si/mm-elementi/spomenik-padlim-partizanom-in-zrtvam-v-narodnoosvobodilnem-boju/",
        noteSi: "Glavna slika zapisa: pravi gribeljski spomenik s trinajstimi imeni, iz digitalne zbirke Spominska obeležja v občini Črnomelj.",
        noteEn: "The record's main image: the actual Griblje memorial with its thirteen names, from the digital collection Memorials of the Municipality of Črnomelj.",
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
      "Najstarejši pisni obris vasi je črka iz leta 1468: listina, v kateri se vas zapiše kot Griblach. Sledita Briglach (1490) in Griblah (1593); v urbarjih in na najstarejšem zemljevidu je oblika Grüble. Petsto petdeset let pozneje isto ime stoji na cestnih tabelah in v podatkovnih bazah — ime, starejše od skoraj vsega, kar danes v vasi stoji.\n\nKaj ime pomeni, je med jezikoslovci še danes odprto vprašanje. Marko Snoj v Etimološkem slovarju slovenskih zemljepisnih imen navaja štiri poti: narečni grib (goba, jurček), griba (gruda, kep zemlje), besedo sorodno hrvaškemu griblja (brazda) in griva (travnata strmina). Domača razlaga — gribljati, brazdati, orati — je ena od teh poti, ne edina: tudi etimologija je iskrenost, ne izročilo.\n\nIn potem so tu številke, ki jih znajo samo uradi: Griblje merijo 3,45 kvadratnega kilometra na 153,4 metra nad morjem; poštna številka je 8332 Gradac. Na popisu leta 2020 je vas štela 334 prebivalcev — 172 moških in 162 žensk; leta 2026 jih letna statistika beleži 329. Številke se premikajo kot reka: počasi, a stalno. Njihovi odtisi so večji: val izseljenstva, ki ima v tej zbirki svoj zapis, je nekoč odnesel več ljudi, kot jih danes živi v vasi.\n\nV zaselkih — Dolnje Griblje, Brinsko selo, Srednje Griblje in Gornje Griblje — se številke razraščajo v hiše: rodovinske hiše ob cesti, ki jih obiskovalec šteje s prsti, muzej pa po imenih. Slika tega zapisa prihaja z Mednarodne vesoljske postaje: Zemlja nad Belo krajino, središče posnetka nad vaškim okoljem. Od štiristo kilometrov je vas pika — in številkam doda še eno, ki je ni v nobenem popisu: razsežnost, ki jo vidi samo astronaut.\n\nStatistika je za muzej čudovito orodje: ne pripoveduje, ampak preračunava zgodbo. Koliko let ima vas, koliko ljudi jo danes nosi, koliko jih je nosila nekoč — vse to se da zložiti v eno samo jutro ob ribniku. Ta zapis bo muzej osveževal z vsakim novim popisom: zgodovina, ki znova šteje sebe.",
    storyEn:
      "The oldest written outline of the village is a letter from 1468: a document in which the village is written Griblach. Briglach (1490) and Griblah (1593) follow; in the urbars and on the oldest map the form is Grüble. Five hundred and fifty years later the same name stands on the road signs and in the databases — a name older than almost everything that stands in the village today.\n\nWhat the name means remains, among linguists, an open question to this day. In his Etymological Dictionary of Slovene Place Names Marko Snoj lists four paths: the dialect grib (a mushroom, a Boletus), griba (a clod of soil), a word related to Croatian griblja (a furrow), and griva (a grassy slope). The local explanation — gribljati, to furrow, to plough — is one of those paths, not the only one: etymology too is honesty, not folklore.\n\nAnd then there are the numbers only offices know: Griblje measure 3.45 square kilometres at 153.4 metres above the sea; the postal code is 8332 Gradac. At the 2020 census the village counted 334 inhabitants — 172 men and 162 women; in 2026 the annual statistics record 329. Numbers move like the river: slowly, but constantly. Their impressions are larger: the wave of emigration, which has its own record in this collection, once carried away more people than live in the village today.\n\nIn the hamlets — Dolnje Griblje, Brinsko selo, Srednje Griblje and Gornje Griblje — the numbers branch into houses: family houses along the road that a visitor counts on fingers, and the museum by names. The image of this record comes from the International Space Station: Earth above Bela krajina, the frame centred on the village's own countryside. From four hundred kilometres the village is a point — and the numbers gain one more that appears in no census: a dimension only an astronaut can see.\n\nStatistics are a wonderful tool for a museum: it does not narrate, it recalculates the story. How old the village is, how many people carry it today, how many carried it once — all of it can be folded into a single morning by the pond. This record the museum will refresh with every new census: a history that counts itself anew.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-iz-orbite.jpg",
    imageCredit:
      "Foto: NASA/JSC, ISS Expedition 67 (2022) · Wikimedia Commons · javna last — Zemlja nad Belo krajino",
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
        key: "commons-iz-orbite",
        nameSi:
          "Wikimedia Commons: ISS067-E-80408 — posnetek Zemlje nad Belo krajino z Mednarodne vesoljske postaje (NASA/JSC)",
        nameEn:
          "Wikimedia Commons: ISS067-E-80408 — a view of Earth above Bela krajina from the International Space Station (NASA/JSC)",
        sourceType: "fotografija",
        license: "javna last / public domain (NASA/JSC)",
        url: WM("ISS067-E-80408_-_View_of_Earth.jpg"),
        noteSi:
          "Glavna slika zapisa: Zemlja nad Belo krajino z odprave 67 — od 400 kilometrov je vas pika; te zbirke številke ji dajejo težo.",
        noteEn:
          "The record's main image: Earth above Bela krajina from Expedition 67 — from 400 kilometres the village is a point; this record's numbers give it weight.",
      },
    ],
  },
  {
    slug: "kolesa-torpedo",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Kolesarska sekcija Torpedo — starodobna kolesa Gribelj",
    titleEn: "The Torpedo cycling section — Griblje's vintage bicycles",
    periodSi: "≈ 2011 → danes",
    periodEn: "≈ 2011 → present",
    summarySi:
      "V turističnem društvu Griblje že petnajst let deluje sekcija starodobnih koles: trideset kolesarjev, kolesa brez prestav in rally, ki vas vsako leto spravi v prejšnje stoletje.",
    summaryEn:
      "For fifteen years the Tourist Society of Griblje has run a vintage-bicycle section: thirty riders, gearless bicycles and a rally that turns the village back a century every year.",
    storySi:
      "V Gribljah obstaja časovni stroj, ki ne potrebuje goriva — le pedal. Kolesarska sekcija Torpedo, ki deluje v okviru turističnega društva Griblje, že petnajst let združuje lastnike starodobnih koles: stroje, stare sedemdeset in osemdeset let, brez prestav, z okvirji, ki so preživeli vsako vreme. Ime nosijo po znamki Torpedo — kolesu, ki je oglase nosilo že leta 1908 in ga je nekoč imela vsaka delovna hiša; v Gribljah ta znamka ni v muzejski vitrini, ampak še vedno vozi.\n\nVsako leto julija se v vasi zavrti Rally Griblje. Letos se je zbralo okoli šestdeset kolesarjev iz osmih društev iz Slovenije in Hrvaške, mnogi v starinskih oblačilih; vročina je nagnila pot skozi vse gribeljske poti in stranpoti. Nato se kolesa naložijo na prikolice in povorka odpotuje v svet: Beltinci — kjer so sekciji celo podarili kolo —, Juršinci, Šentjur pri Celju, Maribor, Škofja Loka, Stara Gora na Gorenjskem, na hrvaški strani pa Varaždin in Koprivnica. Enega povabila pa ne zamudijo nikoli: vsako leto prikolesarijo na Semiško ohcet, na blagoslov motoristov in kolesarjev.\n\nEkipa šteje trideset članov. Najstarejši med njimi, 94-letni Janez Totar, se še vedno rad usede na svoje starodobno kolo in sotrpine žene, da mu sledijo. Predsednik kluba je Jože Pezdirc - Makc, turistično društvo pa vodi Mateja Pezdirc. Rally se zaključi na gribeljskem kopališču ob Kolpi — z družabnimi igrami in »norim« plesom domačih kavbojk, plesne zasedbe Country Roses. »Tradicija, sodelovanje in dobra volja povezujejo ljudi ter ohranjajo bogato kulturno dediščino za prihodnje rodove,« je zatrdila predsednica.\n\nEno od srečanj je Radio Odeon zabeležil v številkah: 54 kolesarjev na starodobnih kolesih se je odpravilo na približno dvajset kilometrov dolgo pot do Metlike in po hrvaški strani Kolpe nazaj v Griblje — z zaključnim povabilom na vaško kopališče, kjer si vsak kolesar privošči tudi plavanje.\n\nMuzej zapis dodaja zbirki kot dokaz, da dediščina v Gribljah ni le v arhivu: tu jo vsako leto znova usedejo in vozijo. Vas, ki je danes mirno izhodišče kolesarjenja ob Kolpi, ima svojo lastno kolesarsko zgodovino — in nekaj, česar nima vsaka vas: štiriindevetdesetletnega kolesarja, ki še vedno vzame svoje starodobno kolo in pelje ekipo, kot da bi bilo vreme ustavljivo. Fotografija zapisa prikazuje kolo znamke Torpedo iz odprtega arhiva Wikimedia Commons — takega, kakršna vozijo tudi gribeljski kolesarji; fotografija sekcije same še čaka v prosti arhiv, kdor jo bo posnel, je vabljen kot priča.",
    storyEn:
      "Griblje keeps a time machine that needs no fuel — only pedals. The Torpedo cycling section, running within the Tourist Society of Griblje, has for fifteen years united the owners of vintage bicycles: machines seventy and eighty years old, without gears, on frames that have survived every weather. They take their name from the Torpedo brand — a bicycle advertised as early as 1908, once owned by every working household; in Griblje the brand is not behind museum glass but still on the road.\n\nEvery July the village hosts the Rally Griblje. This year about sixty cyclists gathered from eight societies of Slovenia and Croatia, many in period clothing; the heat bent the route through every road and byroad of Griblje. Then the bicycles are loaded on trailers and the column travels the world: Beltinci — where they were once even donated a bicycle —, Juršinci, Šentjur pri Celju, Maribor, Škofja Loka, Stara Gora in Gorenjska, and on the Croatian side Varaždin and Koprivnica. One invitation they never miss: every year they ride to the Semiška ohcet, to the blessing of motorcyclists and cyclists.\n\nThe team counts thirty members. The oldest among them, 94-year-old Janez Totar, still gladly sits on his vintage bicycle and drives his teammates to follow. The club's president is Jože Pezdirc - Makc, and the Tourist Society is led by Mateja Pezdirc. The rally ends at the Griblje bathing ground on the Kolpa — with games and the \"crazy\" dance of the local cowgirls, the Country Roses ensemble. \"Tradition, cooperation and good will unite people and preserve a rich cultural heritage for the generations to come,\" the president stated.\n\nOne of the meetings Radio Odeon recorded in numbers: fifty-four riders on vintage bicycles set out on a twenty-kilometre road to Metlika and back along the Croatian bank of the Kolpa — with a closing invitation to the village bathing place, where every rider treats himself to a swim as well.\n\nThe museum adds this record as proof that in Griblje heritage is not kept only in the archive: every year it is sat upon and ridden. A village that today serves as a quiet starting point for cycling along the Kolpa has a cycling history of its own — and something not every village has: a ninety-four-year-old rider who still takes his vintage bicycle and leads the team as if weather itself could be stopped. The record's photograph shows a Torpedo-brand bicycle from the open Wikimedia Commons archive — of the kind Griblje's riders also use; a photograph of the section itself still awaits a free archive, and whoever takes it is invited as a witness.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/kolesa-torpedo.jpg",
    imageCredit: "Foto: Brbbl · Wikimedia Commons · CC BY-SA 4.0",
    yearFrom: 2011,
    lat: 45.57246,
    lng: 15.29257,
    featured: false,
    sources: [
      {
        key: "svet24-rally",
        nameSi: "Svet24 (9. julij 2026): Rally Griblje — Pedala vrteli po starem, ne na elektriko, na žgance",
        nameEn: "Svet24 (9 July 2026): Rally Griblje — pedalling the old way, not on electricity but on žgance",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://svet24.si/lokalno/dolenjska/novice/kolesarski-rally-griblje-pedala-vrteli-po-starem-1911575",
        noteSi:
          "Temeljni vir: 15 let sekcije v TD Griblje, okoli 60 kolesarjev iz osmih društev Slovenije in Hrvaške, predsednik Jože Pezdirc - Makc, 94-letni Janez Totar, kolesa brez prestav, potovanja, kopališče ob Kolpi, Country Roses, izjava predsednice Mateje Pezdirc.",
        noteEn:
          "The base source: 15 years of the section within TD Griblje, about 60 cyclists from eight societies of Slovenia and Croatia, president Jože Pezdirc - Makc, 94-year-old Janez Totar, gearless bicycles, the journeys, the Kolpa bathing ground, Country Roses, and president Mateja Pezdirc's statement.",
      },
      {
        key: "odeon-rally-2025",
        nameSi: "Radio Odeon (8. 7. 2025): V Gribljah kolesarili kot nekoč",
        nameEn: "Radio Odeon (8 Jul 2025): Cycling the old way in Griblje",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/novice/v-gribljah-kolesarili-kot-nekoc/",
        noteSi:
          "Tradicionalni rally starodobnih kolesarjev: TD Griblje v sodelovanju s Sekcijo Torpedo; kolesarjenje »kot nekoč« po vaških cestah.",
        noteEn:
          "The traditional rally of vintage cyclists: TD Griblje together with the Torpedo Section; cycling »the old way« along the village roads.",
      },
      {
        key: "vaskanal-kolesa-2017",
        nameSi: "Arhiv Vaš kanal (11. julij 2017): srečanje ljubiteljev starodobnih koles na kopališču v Gribljah",
        nameEn: "The Vaš kanal archive (11 July 2017): a gathering of vintage-bicycle lovers at the Griblje bathing ground",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.arhiv.vaskanal.com/",
        noteSi:
          "Najzgodnejša najdena omemba prireditve: rally na gribeljskem kopališču je dokumentiran vsaj od leta 2017.",
        noteEn:
          "The earliest found mention of the event: the rally at the Griblje bathing ground is documented at least since 2017.",
      },
      {
        key: "zgodovinska-mesta-ohcet",
        nameSi: "Zgodovinska mesta Slovenije: program Semiške ohceti 2026 (blagoslov motoristov in kolesarjev ob sodelovanju Torpeda Griblje)",
        nameEn: "Historic Towns of Slovenia: the 2026 Semiška ohcet programme (the blessing of motorcyclists and cyclists with the participation of Torpedo Griblje)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.zgodovinska-mesta.si/en/booking-event-directory/semiska-ohcet",
        noteSi:
          "Letna udeležba sekcije na Semiški ohceti — potrditev stavka predsednika, da povabilo iz Semiča nikoli ne zamudijo.",
        noteEn:
          "The section's yearly presence at the Semiška ohcet — confirming the president's words that the invitation from Semič is never missed.",
      },
      {
        key: "facebook-torpedo",
        nameSi: "Facebook: Sekcija Torpedo Griblje — javna stran ljubiteljev starodobnih koles",
        nameEn: "Facebook: Sekcija Torpedo Griblje — the public page of the vintage-bicycle lovers",
        sourceType: "spletni-vir",
        license: "stran društva / the society's page",
        url: "https://www.facebook.com/",
        noteSi:
          "Samoizjava sekcije: srečanja z drugimi zbiralci (npr. v Škofji Loki); globja povezava strani ni zajeta, navedba po imenu.",
        noteEn:
          "The section's own voice: meetings with fellow collectors (e.g. in Škofja Loka); the page's deep link not captured, cited by name.",
      },
      {
        key: "commons-torpedo-foto",
        nameSi: "Wikimedia Commons: Torpedo bicycle (fotografija kolesa znamke Torpedo, avtor: Brbbl)",
        nameEn: "Wikimedia Commons: Torpedo bicycle (a photograph of a Torpedo-brand bicycle, author: Brbbl)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (avtor: Brbbl)",
        url: WM("Torpedo_bicycle.JPG"),
        noteSi:
          "Slika zapisa: kolo znamke Torpedo iz odprtega arhiva — enake znamke, kakršna vozijo gribeljski kolesarji.",
        noteEn:
          "The record's image: a Torpedo-brand bicycle from the open archive — the same brand Griblje's riders use.",
      },
      {
        key: "commons-torpedo-1908",
        nameSi: "Wikimedia Commons: Torpedo-Fahrraeder — oglas za kolesa Torpedo (Weil & Co, Frankfurt ob Majni, 1908)",
        nameEn: "Wikimedia Commons: Torpedo-Fahrraeder — an advertisement for Torpedo bicycles (Weil & Co, Frankfurt am Main, 1908)",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("Torpedo-Fahrraeder.jpg"),
        noteSi:
          "Znamka Torpedo je bila v tisku oglaševana že leta 1908 — stoletje in pol pred gribeljskim rallyjem.",
        noteEn:
          "The Torpedo brand was already being advertised in print in 1908 — a century and a half before the Griblje rally.",
      },
      {
        key: "odeon-starodobna-kolesa",
        nameSi: "Radio Odeon — Srečanje starodobnih koles v Gribljah",
        nameEn: "Radio Odeon — A meeting of vintage bicycles in Griblje",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/srecanje-starodobnih-koles-v-gribljah/",
        noteSi: "54 kolesarjev, ~20 km: Griblje — Metlika — hrvaška stran — Griblje; povabilo na kopališče.",
        noteEn: "54 riders, ~20 km: Griblje — Metlika — the Croatian bank — Griblje; an invitation to the pool.",
      },
    ],
  },
  {
    slug: "audrey-totter",
    category: "kraj",
    titleSi: "Audrey Totter — zvezda filma noir iz Gornjih Gribelj",
    titleEn: "Audrey Totter — a film noir star from Gornje Griblje",
    periodSi: "1890-ta → 2013 · hollywoodska veja vasi",
    periodEn: "1890s → 2013 · the village's Hollywood branch",
    summarySi:
      "Trije bratje Jandreč (Tottrovi) so se konec 19. stoletja iz Gornjih Gribelj izselili v Joliet v Illinoisu. Vnučinja veje, ki je ostala v slovenski skupnosti, je postala hollywoodska igralka Audrey Totter — zvezdnica filma noir studia MGM.",
    summaryEn:
      "At the end of the nineteenth century three Jandreč (Totter) brothers left Gornje Griblje for Joliet, Illinois. The granddaughter of the branch that stayed within the Slovene community became the Hollywood actress Audrey Totter — a film noir star of the MGM studio.",
    storySi:
      "Konec devetnajstega stoletja so se iz Gornjih Gribelj v Ameriko izselili trije bratje Jandreč, ki jih je v vasi poznali pod imenom Totter. Dva sta odšla v Teksas, Janez pa je ostal v Jolietu v Illinoisu — mestu z eno najmočnejših slovenskih skupnosti v Združenih državah. Tam se je poročil z Ido Mae, žensko švedskih korenin, in 20. decembra 1917 se jima je rodila hčerka Audrey Mary Totter. Nihče v tej hiši ni mogel vedeti, da bo dekle z gribeljsko kri vstopilo v hollywoodski panteon.\n\nPot v Hollywood je vodila skozi radio: Audrey je v Chicagu in New Yorku igrala v radijskih igrah, vključno z naslovi, ki so tedaj držale Ameriko ob sprejemnikih. Nato so jo opazili v studiu Metro-Goldwyn-Mayer, kjer je ostala sedem let — in kjer je oblikovala svoj zaščitni znak: ostra, samozavestna, nevarno privlačna dekleta filmskega noira. Videl jo je svet v zrcalnem prizoru filma Lady in the Lake (1947), ob Lana Turner v uspešnici The Postman Always Rings Twice (1946); posnela je tudi uspešnico z Clarkom Gableom — za njegovo izrecno prošnjo. Režiserji so jo zaposlovali tudi pri Columbii, 20th Century Fox in Warner Bros, igrala je v oddaji Alfred Hitchcock Presents, njena zadnja vloga pa je bila leta 1987 v seriji Murder, She Wrote.\n\nZgodba se vrača v Belo krajino. Njen stric Matija Totter, v vasi znan kot Matiček, je bil laični popisovalec kulturne dediščine — čeprav je obiskal le ljudsko šolo v Gribljah. O njem je dr. Niko Županič, ki ga je osebno poznal, zapisal stavek, ki danes zveni kot napovedba: »Jandrečim ne dišita plug in motika, pač pa imajo raje knjigo in gosli.« Bratranec Audrey, dr. John Randolph Totter, je bil profesor biokemije in je sodeloval z Institutom »Jožef Stefan«; pravnukinja Lorene Totter Barfuss pa je rodovnik svoje veje raziskala vse do genotipizacije — naj bi izvirali od Tottrov v Spodnji Avstriji, od koder so pred stoletji prispeli na obkolpska polja.\n\nV Gribljah danes na domačiji gospodari Ciril Totter z ekološko kmetijo — in maratonom. Muzej zapis postavlja ob Županiča, Dragoša in Filaka: dokaz, da je ta vas ob Kolpi vedno znova pošiljala svetu ljudi, ki so ga zaznamovali — ne glede na to, ali so odšli z vlakom v Ljubljano ali z ladjo iz Trsta.",
    storyEn:
      "At the end of the nineteenth century three Jandreč brothers, known in the village as the Totters, left Gornje Griblje for America. Two went on to Texas; Janez stayed in Joliet, Illinois — a city with one of the strongest Slovene communities in the United States. There he married Ida Mae, a woman of Swedish descent, and on 20 December 1917 their daughter Audrey Mary Totter was born. Nobody in that house could have known that the girl with Griblje blood would enter the Hollywood pantheon.\n\nThe road to Hollywood led through radio: Audrey played in radio dramas in Chicago and New York, in the shows that kept America by its receivers. Then Metro-Goldwyn-Mayer noticed her — she stayed seven years, and there she shaped her trademark: the sharp, self-possessed, dangerously attractive girls of film noir. The world saw her in the mirror scene of Lady in the Lake (1947), beside Lana Turner in the hit The Postman Always Rings Twice (1946); she also made a picture with Clark Gable — at his explicit request. Columbia, 20th Century Fox and Warner Bros hired her in turn, she played in Alfred Hitchcock Presents, and her last role came in 1987 in Murder, She Wrote.\n\nThe story returns to Bela krajina. Her uncle Matija Totter, known in the village as Matiček, was an untrained recorder of folk heritage — though he had attended only the village school in Griblje. Dr. Niko Županič, who knew him personally, wrote of him the sentence that today reads like a prophecy: »Jandrečim ne dišita plug in motika, pač pa imajo raje knjigo in gosli« — the Jandrečs have no taste for plough and hoe; they prefer the book and the fiddle. Audrey's cousin Dr. John Randolph Totter was a professor of biochemistry who worked with the Jožef Stefan Institute; Lorene Totter Barfuss, a great-granddaughter of the line, traced the family tree as far as genotyping — the branch appears to descend from the Totters of Lower Austria, who centuries ago reached the fields by the Kolpa.\n\nIn Griblje today Ciril Totter runs the family farm organically — and runs marathons. The museum sets this record beside Županič, Dragoš and Filak: proof that this village on the Kolpa has kept sending out people who left their mark on the world — whether they left by train to Ljubljana or by ship from Trieste.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/audrey-totter.jpg",
    imageCredit: "Foto: studijska publiciteta · Wikimedia Commons · javna last / public domain",
    yearFrom: 1890,
    yearTo: 2013,
    addedAt: "2026-09-16",
    sources: [
      {
        key: "odeon-audrey",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Audrey Mary Totter (20. december 2025)",
        nameEn: "Radio Odeon — People by the Kolpa: Audrey Mary Totter (20 December 2025)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-audrey-mary-totter/",
        noteSi:
          "Izvirni življenjepis: bratje Jandreč iz Gornjih Gribelj, Joliet, MGM, Clark Gable, stric Matiček in Županičev citat.",
        noteEn:
          "The source biography: the Jandreč brothers of Gornje Griblje, Joliet, MGM, Clark Gable, uncle Matiček and Županič's line.",
      },
      {
        key: "commons-audrey-foto",
        nameSi: "Wikimedia Commons: AUDREYTotter.jpg — studijska publiciteta (javna last)",
        nameEn: "Wikimedia Commons: AUDREYTotter.jpg — studio publicity (public domain)",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("AUDREYTotter.jpg"),
        noteSi: "Glavna slika zapisa: portret iz obdobja MGM.",
        noteEn: "The record's main image: a portrait from the MGM years.",
      },
      {
        key: "commons-lady-lake",
        nameSi: "Wikimedia Commons: Lady-in-the-Lake-trailer-mirror.jpg — prizor iz filma Lady in the Lake (MGM, 1947, javna last)",
        nameEn: "Wikimedia Commons: Lady-in-the-Lake-trailer-mirror.jpg — a scene from Lady in the Lake (MGM, 1947, public domain)",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("Lady-in-the-Lake-trailer-mirror.jpg"),
        noteSi:
          "Dokument filmske kariere: naslovni zrcalni prizor njenega najbolj znanega filma noir.",
        noteEn:
          "Evidence of the film career: the title mirror scene of her best-known film noir.",
      },
      {
        key: "odeon-ljudje-serija",
        nameSi: "Radio Odeon — arhiv rubrike Ljudje ob Kolpi (iskalni arhiv serije)",
        nameEn: "Radio Odeon — the archive of the People by the Kolpa series (the series' search archive)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/iskanje/?q=Ljudje%20ob%20Kolpi",
        noteSi:
          "Redna rubrika z življenjepisi ljudi z obeh bregov Kolpe — vir, ki mu muzej dolguje serijo portretov.",
        noteEn:
          "The regular column with life stories of people from both banks of the Kolpa — the source the museum owes its portrait series to.",
      },
    ],
  },
  {
    slug: "nikolaj-dragos",
    category: "kraj",
    titleSi: "Nikolaj Dragoš — sto deset let od Hajdeč grunta",
    titleEn: "Nikolaj Dragoš — a hundred and ten years from the Hajdeč farm",
    periodSi: "1907–2018 · najstarejši Slovenec",
    periodEn: "1907–2018 · Slovenia's longest-lived man",
    summarySi:
      "Rojen na domačiji Hajdeč grunt v Gribljah, deveti od dvanajstih otrok. Topničar, profesionalni mejni graničar, ujetnik, milicist — in po upokojitvi stoletnik, ki je ob 108. in 110. rojstnem dnevu prejel obisk predsednika republike.",
    summaryEn:
      "Born at the Hajdeč farm in Griblje, ninth of twelve children. An artilleryman, a professional border guard, a prisoner of war, a militiaman — and, in retirement, a centenarian who received the President of the Republic on his 108th and 110th birthdays.",
    storySi:
      "27. avgusta 1907 so na gribeljski domačiji Hajdeč grunt — ime je dobila po ajdi, ki so jo tu pridelovali v velikih količinah — priredili devetega od dvanajstih otrok; pri porodi je pomagala vaška babica Marjeta Totter, ki je na svet pomagala že neštetim dojenčkom okolice. Botrovala sta Matija Štrucelj in Ana Požek, oče Ivan pa je bil župan in cerkveni ključar: družina z globoko ukoreninjenostjo v vas. Nikogar ni moglo biti milosti, da bo ravno ta fant dočakal temno starost, ki jo Slovenija še ni videla.\n\nŽivljenje ga je vrglo po svetu, kakor je takrat metalo podeželske fante. Dali so ga v uk k ključavničarju — a mojster ga je raje posljal na kmečka dela, zato se je vrnil domov. V Ljubljani je nato poskusil še pri peku: posredovalnica na železniški postaji ga je poslala za raznašalca, a za delo je bilo treba znati voziti kolo — in pogum mu je upadel. S tem se je njegova učna doba končala; doma si je zaslužil pri tesarjih in gozdarjih, pri sedemnajstih pa se pridružil tamburašem vaškega društva Danica in igral bugarijo. Vojska ga je poslala k gorskemu topništvu v Mostar, kjer je postal celo topniški učitelj; nato je devet let služil kot graničar na srbsko-bolgarski meji — šolal se je še dopisno na Vidovičevi gimnaziji v Sarajevu, smuči pa si je naročil iz Logatca in postal vaditelj smučanja.\n\nAprila 1941 so ga pri Pirotu zajeli Nemci: postal je vojni ujetnik številka 72403 — Kriegsgefangener Nicolaus Dragosch. Po Stalingradu so ga dodelili na kmetijo, kjer sta gospodarju padla sin in zet; vojno je preživel med tujim žitom in tujim hlevom. Domov se je vozil čez Dunaj, Budimpešto, Subotico in Zagreb; pred Gribljami je prespal na slami pri kmetu v Rosalnicah, zadnje kilometre pa je šel peš ob Kolpi — čez Otok, Primostek in Krasinec, mimo njiv z zrelo koruzo. »Oh kako je dolga pot iz tujine pa do doma,« je zapisal.\n\nKo se je življenje umirilo, se je iztekalo počasi in razgledno. Poročil se je pri štiridesetih z Belokranjko iz Krasinca; v zakonu sta mu bila rojena sin in hči. Hišo si je uredil v Vižmarjah pri Šentvidu, zadnja leta pa je preživel v domu upokojencev Poljane v Ljubljani. Ob 108. in ob 110. rojstnem dnevu ga je obiskal predsednik republike Borut Pahor.\n\nOb stotem je naredil nekaj, kar stoletniki redko naredijo — napisal knjigo z naslovom Mojih sto let. Igral je kitaro in bisernico; med njegovimi šolskimi spomini je tista iz podružnične šole v Gribljah, kjer je sedel med klopmi, iz katerih so odraščali tudi Županič in kasnejši rodniki. Umrl je 31. marca 2018 v Ljubljani, star 110 let in 216 dni — v naslovih medijev je njegova starost zaokroženo navedena kot 111 let — najdalj živeči moški, ki ga je Slovenija kdaj zapisala.\n\nNjegova zgodba ni le številka, ampak stoletje v malem: od vprežne živine na Hajdeč gruntovi njivi do digitalnega vpisnika muzeja, ki jo hrani. Vsaka vas ima svojega dolgoživeča; Griblje imajo takšnega, ki ga ima cela država.",
    storyEn:
      "On 27 August 1907, at the Hajdeč farm in Griblje — named after the buckwheat, hajda, once grown here in quantity — a ninth of twelve children was born. The birth was attended by the village midwife Marjeta Totter, who had helped countless babies of the neighbourhood into the world. His godparents were Matija Štrucelj and Ana Požek; his father Ivan was the village mayor and keeper of the church keys: a family rooted deep in the village. Nobody could have guessed that this boy would live to an old age Slovenia had not yet seen.\n\nLife threw him out into the world as it then threw country boys. He was apprenticed to a locksmith — but the master preferred to send him on farm chores, so he came home. In Ljubljana he tried once more, with a baker: the employment office at the railway station sent him out as a delivery boy, but the work required riding a bicycle — and his courage failed. With that his apprenticeship ended; at home he earned with carpenters and foresters, and at seventeen joined the tambura players of the village Danica society, playing the bugarija. The army sent him to the mountain artillery at Mostar, where he became an artillery instructor; then he served nine years as a border guard on the Serbo-Bulgarian frontier — studying by correspondence at the Vidović grammar school in Sarajevo, ordering his skis from Logatec and becoming a ski instructor himself.\n\nIn April 1941 the Germans took him near Pirot: he became prisoner of war number 72403 — Kriegsgefangener Nicolaus Dragosch. After Stalingrad he was assigned to a farm whose farmer had lost a son and a son-in-law; he survived the war among other people's grain and other people's byres. He travelled home through Vienna, Budapest, Subotica and Zagreb; before Griblje he slept on straw at a farmer's at Rosalnice, and walked the last kilometres along the Kolpa — through Otok, Primostek and Krasinec, past fields of ripe maize. 'Oh how long is the road from a foreign land back home,' he wrote.\n\nWhen life quieted, it flowed slowly and deliberately. He married at forty a Bela krajina woman from Krasinec; a son and a daughter were born to them. He made his home in Vižmarje by Šentvid, and his last years he spent at the Poljane retirement home in Ljubljana.\n\nOn his 108th and 110th birthdays he was visited by Borut Pahor, President of the Republic. At one hundred he did what few centenarians do — wrote a book, My Hundred Years. He played the guitar and the zither; among his school memories are the benches of the branch school in Griblje, the same benches from which Županič had grown up before him. He died on 31 March 2018 in Ljubljana, aged 110 years and 216 days — the longest-lived man Slovenia has ever recorded.\n\nHis story is not just a number but a century in miniature: from draft animals on the Hajdeč fields to the digital register of the museum that keeps it. Every village has its long-lived elder; Griblje has one the whole country had.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1907,
    yearTo: 2018,    image: "/images/authentic/dragos-kolpa-1920.jpg",
    imageCredit:
      "Foto: Fran Vesel, 27. 8. 1920 · Wikimedia Commons · javna last — pogled na Kolpo in Adlešiče: svet Dragoševega otroštva",

    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-dragos-kolpa",
        nameSi: "Wikimedia Commons: Pogled na Kolpo in Adlešiče (Fran Vesel, 1920)",
        nameEn: "Wikimedia Commons: A view of the Kolpa and Adlešiči (Fran Vesel, 1920)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Pogled_na_Kolpo_in_Adle%C5%A1i%C4%8De_1920.jpg"),
        noteSi: "Glavna slika zapisa: Kolpa in obkolpska pokrajina leta 1920 — svet, v katerega se je stoletnik rodil in ob katerem je živel tri stoletja.",
        noteEn: "The record's main image: the Kolpa and its landscape in 1920 — the world into which the centenarian was born and beside which he lived for three centuries.",
      },
      {
        key: "odeon-dragos",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Nikolaj »Hajdeč Miko« Dragoš (27. avgust 2026)",
        nameEn: "Radio Odeon — People by the Kolpa: Nikolaj »Hajdeč Miko« Dragoš (27 August 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-nikolaj-dragos/",
        noteSi:
          "Izvirni življenjepis: Hajdeč grunt, tamburaši Danica, graničar-smučar, Pahorjevi obiski, 110 let in 216 dni.",
        noteEn:
          "The source biography: the Hajdeč farm, the Danica tamburitza band, the skiing border guard, Pahor's visits, 110 years and 216 days.",
      },
      {
        key: "s24-skola-dragos",
        nameSi: "Svet24: Podružnična šola Griblje — vas, ki ima svojo šolo (4. januar 2026)",
        nameEn: "Svet24: The Griblje branch school — a village that has its own school (4 January 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/lokalno/dolenjska/novice/podruznicna-sola-griblje-1870858",
        noteSi: "Uvršča Nikolaja Dragoša med nekdanje učence podružnične šole Griblje.",
        noteEn: "Lists Nikolaj Dragoš among the former pupils of the Griblje branch school.",
      },
      {
        key: "dragos-knjiga",
        nameSi: "Nikolaj Dragoš: Mojih sto let (knjiga, napisana ob stotem rojstnem dnevu)",
        nameEn: "Nikolaj Dragoš: My Hundred Years (a book, written for his hundredth birthday)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi:
          "Avtorjeva lastna knjiga spominov — primarni vir, ki ga muzej še išče v fizičnem izvod za spominsko sobo.",
        noteEn:
          "The author's own book of memories — a primary source of which the museum still seeks a physical copy for its memorial room.",
      },
      {
        key: "rtv-dragos-2013",
        nameSi: "RTV Slovenija — Razglednice preteklosti: 106-letni Niko in mladostna leta ob tamburicah (1. 12. 2013, Andrej Mrak)",
        nameEn: "RTV Slovenija — Postcards of the Past: Niko at 106 and his tambura years (1 Dec 2013, Andrej Mrak)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.rtvslo.si/kultura/razglednice-preteklosti/106-letni-niko-in-mladostna-leta-ob-tamburicah/323956",
        noteSi: "Celotni življenjepis po knjigi Mojih sto let: starša Ivan (1864) in Bara roj. Cvitkovič, rojstvo z vaško babico Marjeto Totter, K.G. 72403, vrnitev čez Rosalnice, Otok, Primostek in Krasinec, kitara in bisernica.",
        noteEn: "The full biography after the book My Hundred Years: the parents Ivan (1864) and Bara née Cvitkovič, the birth attended by the village midwife Marjeta Totter, K.G. 72403, the return through Rosalnice, Otok, Primostek and Krasinec, the guitar and the bisernica.",
      },
      {
        key: "odeon-ljudje-serija-dragos",
        nameSi: "Radio Odeon — arhiv rubrike Ljudje ob Kolpi (iskalni arhiv serije)",
        nameEn: "Radio Odeon — the archive of the People by the Kolpa series (the series' search archive)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/iskanje/?q=Ljudje%20ob%20Kolpi",
        noteSi: "Rubrika, v kateri je Dragošev portret nastal — serija portretov obkolpskih ljudi.",
        noteEn: "The column in which Dragoš's portrait appeared — the series of portraits of people by the Kolpa.",
      },
    ],
  },
  {
    slug: "peter-kambic",
    category: "kraj",
    titleSi: "Peter Kambič — učitelj, ki je zapisal božič Belokranjcev",
    titleEn: "Peter Kambič — the teacher who wrote down the Bela krajina Christmas",
    periodSi: "1869–1890 · prvi učitelj gribeljske šole",
    periodEn: "1869–1890 · the first teacher of the Griblje school",
    summarySi:
      "Prvi učitelj novoustanovljene šole v Gribljah (1889), rojen v Krasincu. V prostem času je popisoval belokranjsko ljudsko bogastvo — njegov zapis »Božič pri Belokranjcih« je danes med najstarejšimi objavljenimi vpogledi v praznični vsakdan te dežele. Umrl je star dvajset let.",
    summaryEn:
      "The first teacher of the newly founded school in Griblje (1889), born at Krasinec. In his spare time he recorded the folk wealth of Bela krajina — his account »Christmas among the Bela krajina people« is today among the oldest published glimpses of the region's festive life. He died at twenty.",
    storySi:
      "24. maja 1869 se je v Krasincu, zaselku ob Kolpi nedaleč od Gribelj, rodil fant po imenu Peter Kambič. Usoda mu je namenila kratko, a goste pot: ko so novembra 1889 v Gribljah blagoslovili novo šolsko poslopje, je mladi učitelj pripravnik Kambič dobil mesto v njegovi prvi učilnici — s stanovanjem v istem poslopju, kakor je takrat veljalo za vaške učitelje.\n\nBil je dvoje hkrati: učitelj in etnograf. V prostih urah, ki jih vaški učitelj ni imel veliko, je zbiral in popisoval belokranjsko ljudsko bogastvo — šege, pesmi, opravila, praznike. Pod psevdonimom Pirc Krasinski je 1. januarja 1889 v Dolenjskih novicah objavil zapis »Božič pri Belokranjcih«: podroben vpogled v božični čas te dežele, napisan z učiteljevo natančnostjo in domačinovo ljubeznijo. Danes je med najstarejšimi objavljenimi pričami o tem, kako je ta kotiček Slovenije praznoval zimski praznik, ko še elektrika ni bila zaslišana.\n\nNjegova smrt je ena od tistih, ki jih zgodovina ne utolaži: 25. januarja 1890, komaj dvajsetleten, je umrl v Gribljah — v kraju, kjer je komaj začel. Šola, ki jo je pomagal zagnati, je zrasla v eno najbolj živih vaških učilnic v Sloveniji (danes podružnica OŠ Loka Črnomelj); njegov poklic pa je postal tudi njegov spomenik: kar je zapisal o božiču, živi dlje od njega.\n\nMuzej postavlja Kambiča ob Šopek poljskih cvetlic iz Gribelj, ki ga je zapisala Katarina Zupanič: dve roki istega desetletja, ki sta isto deželo zapisali iz ljubezni do nje. Njegova zgodba opominja, da starost ni merilo pomena — dvajset let je za to deželo zadostovalo.",
    storyEn:
      "On 24 May 1869, at Krasinec, a hamlet by the Kolpa not far from Griblje, a boy named Peter Kambič was born. Fate allotted him a short but dense road: when the new school building in Griblje was blessed in November 1889, the young trainee teacher Kambič took his place in its first classroom — with lodgings in the same building, as village teachers then customarily had.\n\nHe was two things at once: a teacher and an ethnographer. In the spare hours a village teacher does not have many of, he collected and recorded the folk wealth of Bela krajina — customs, songs, work, feasts. Under the pen name Pirc Krasinski, on 1 January 1889, the Dolenjske novice published his account »Christmas among the Bela krajina people«: a detailed look at the festive season of this land, written with a teacher's precision and a native's love. Today it stands among the oldest published testimonies of how this corner of Slovenia kept the winter feast, before electricity was ever heard of.\n\nHis death is one history does not console: on 25 January 1890, barely twenty, he died in Griblje — in the place he had only just begun. The school he helped set going grew into one of the liveliest village classrooms in Slovenia (today a branch of the OŠ Loka Črnomelj school); and his side-work became his monument: what he wrote about Christmas outlives him.\n\nThe museum sets Kambič beside the »Bouquet of meadow flowers from Griblje« recorded by Katarina Zupanič: two hands of the same decade, that wrote down the same land out of love for it. His story is a reminder that age is no measure of weight — twenty years sufficed for this land.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1869,
    yearTo: 1890,    image: "/images/authentic/kambic-bozic.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — božično drevo (obdobje med obema vojnama)",

    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-kambic-bozic",
        nameSi: "Wikimedia Commons: Božično drevo (Fran Vesel, med obema vojnama)",
        nameEn: "Wikimedia Commons: A Christmas tree (Fran Vesel, interwar period)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Bo%C5%BEi%C4%8Dno_drevo.jpg"),
        noteSi: "Glavna slika zapisa: božično drevo iz obdobja Kambičevega zapisa »Božič pri Belokranjcih« (1889) — ilustracija praznika, ki ga je prvi popisal.",
        noteEn: "The record's main image: a Christmas tree from the era of Kambič's record \"Christmas among the people of Bela krajina\" (1889) — an illustration of the feast he was the first to describe.",
      },
      {
        key: "odeon-kambic",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Peter Kambič (24. maj 2026)",
        nameEn: "Radio Odeon — People by the Kolpa: Peter Kambič (24 May 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-peter-kambic/",
        noteSi:
          "Izvirni življenjepis: rojstvo v Krasincu, služba v Gribljah 1889, »Božič pri Belokranjcih«, smrt star 20 let.",
        noteEn:
          "The source biography: born at Krasinec, post in Griblje 1889, »Christmas among the Bela krajina people«, death at twenty.",
      },
      {
        key: "odeon-jubilej-kambic",
        nameSi: "Radio Odeon — Jubilej gribeljske šole (junij 2019)",
        nameEn: "Radio Odeon — The jubilee of the Griblje school (June 2019)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/jubilej-gribeljske-sole/",
        noteSi: "Blagoslov poslopja novembra 1889 in učitelj pripravnik Kambič kot prvi stanovalec šole.",
        noteEn: "The blessing of the building in November 1889 and trainee teacher Kambič as the school's first resident.",
      },
      {
        key: "dn-bozic-kambic",
        nameSi: "Pirc Krasinski (Peter Kambič): Božič pri Belokranjcih, Dolenjske novice, 1. januar 1889",
        nameEn: "Pirc Krasinski (Peter Kambič): Christmas among the Bela krajina people, Dolenjske novice, 1 January 1889",
        sourceType: "objava",
        license: "javna last (časopis 1889) / public domain (an 1889 newspaper)",
        noteSi:
          "Primarni objavljeni vir — etnografski zapis božičnih šeg, naveden po Radio Odeonovi predstavitvi.",
        noteEn:
          "The primary published source — an ethnographic account of Christmas customs, cited after Radio Odeon's presentation.",
      },
      {
        key: "s24-skola-kambic",
        nameSi: "Svet24: Podružnična šola Griblje — vas, ki ima svojo šolo (2026)",
        nameEn: "Svet24: The Griblje branch school — a village that has its own school (2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/lokalno/dolenjska/novice/podruznicna-sola-griblje-1870858",
        noteSi: "Sodobno nadaljevanje šole, ki jo je Kambič zagnal — 17 učencev danes.",
        noteEn: "The present-day continuation of the school Kambič set going — 17 pupils today.",
      },
    ],
  },
  {
    slug: "alburnus-sava",
    category: "narava",
    titleSi: "Alburnus sava — plevka, ki jo je znanost spoznala v Kolpi",
    titleEn: "Alburnus sava — the bleak that science met in the Kolpa",
    periodSi: "2017 · nova vrsta iz reke pri Gribljah",
    periodEn: "2017 · a new species from the river by Griblje",
    summarySi:
      "Leta 2017 so ihtiologi v reviji ZooKeys iz materiala, zbranega v Kolpi, opisali novo vrsto za znanost: Alburnus sava, veliko potamodromno plevko savskega sistema. Reka, na kateri stojijo Griblje, je ostala tudi v 21. stoletju kraj odkritja.",
    summaryEn:
      "In 2017, ichthyologists writing in ZooKeys described a species new to science from material collected in the Kolpa: Alburnus sava, a large potamodromous bleak of the Sava system. The river Griblje stands on remained a place of discovery even in the twenty-first century.",
    storySi:
      "Reke imajo svoje biografe: pesnike, mlinarje, mehanike mostov. Kolpa pri Gribljah pa ima tudi znanstveno biografijo — in eno od njenih poglavij je pisana leta 2017. Takrat je skupina ihtiologov — Nina Bogutskaya, Primož Zupančič, Dušan Jelić, Oleg Diripasko in Alexandr Naseka — v odprto dostopni reviji ZooKeys (Zvezek 688, strani 81–110) objavila opis nove vrste za znanost: Alburnus sava, plevka, poimenovana po reki Savi, v katere sistem Kolpa spada.\n\nVrsta ni bila odkrita v nedotaknjeni tihotišni globini, ampak ravno v taki reki, kakršna teče mimo Gribelj: v Kolpi, ki se nad vasjo razširi v manjšo ravnino, se poleti pregreje čez petindvajset stopinj — kopalno toplo — in v tisočletjih s poplavljanjem ustvarja loki, rodovitne travnike. Tipični primerek (holotip) — samec, dolg 173,6 milimetra — je shranjen v Narodnem prirodoslovnem muzeju v Madridu; njegova fotografija pred konzerviranjem je danes glavna slika tega zapisa.\n\nZnanstvena imena so stavki v svetovnem jeziku: Alburnus sava pomeni, da so bregovi te reke vstopili v taksonomijo. Za vas ob reki pa vrsta pomeni nekaj bolj vsakdanjega: Kolpa ni le kulisa preteklosti — mlinov, mej, kopališč — ampak živ sistem, ki še vedno rojeva novo. V istem stoletju, v katerem se je nad Gribljami pomladila evakuacija 1945 in utihnili mlini, je znanost ob bregovih srečala dve življenji, ki jih prej ni poznala: črnega močerila pod kraškim svetom (1986) in plevko v sami reki (2017) — obe na manj kot uri hoda od vaških vrat.\n\nMuzej hrani ta zapis ob zapisu o Kolpi in o črnem močerilu: skupaj opisujejo deželo, ki je po vsem izkoriščanju ostala nedokončana. Kdor se danes kopa pri Gribljah, plava v vodi, ki nosi ime v znanstveni literaturi.",
    storyEn:
      "Rivers have their biographers: poets, millers, bridge engineers. The Kolpa at Griblje has a scientific biography too — and one of its chapters was written in 2017. That year a group of ichthyologists — Nina Bogutskaya, Primož Zupančič, Dušan Jelić, Oleg Diripasko and Alexandr Naseka — published in the open-access journal ZooKeys (Volume 688, pages 81–110) the description of a species new to science: Alburnus sava, a bleak named after the Sava river, the system to which the Kolpa belongs.\n\nThe species was not discovered in some untouched abyss but precisely in a river like the one flowing past Griblje: a Kolpa that widens into a small plain above the village, warms past bathing-temperature twenty-five degrees in summer, and over the millennia of flooding has laid down the loki, the fertile meadows. The type specimen (the holotype) — a male, 173.6 millimetres long — is kept in the National Museum of Natural Sciences in Madrid; its photograph before preservation is now the main image of this record.\n\nScientific names are sentences in a world language: Alburnus sava means these riverbanks entered taxonomy. For the village on the river the species means something more everyday: the Kolpa is not only the backdrop of the past — mills, borders, bathing places — but a living system still delivering novelty. In the same century in which the evacuation of 1945 passed above Griblje and the mills fell silent, science met two lives by these banks it had not known before: the black olm beneath the karst world (1986) and the bleak in the river itself (2017) — both within an hour's walk of the village gates.\n\nThe museum keeps this record beside the records of the Kolpa and of the black olm: together they describe a land that, for all its working, remained unfinished. Whoever swims at Griblje today is swimming in water that carries a name in the scientific literature.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/alburnus-sava.jpg",
    imageCredit: "Bogutskaya, Zupančič, Jelić, Diripasko & Naseka 2017, ZooKeys · CC BY 4.0 — slika 1: holotip",
    yearFrom: 2017,
    lat: 45.5694,
    lng: 15.2906,
    coordsApprox: true,
    addedAt: "2026-09-16",
    sources: [
      {
        key: "zookeys-clanek",
        nameSi: "Bogutskaya NG, Zupančič P, Jelić D, Diripasko OA, Naseka AM (2017): Description of a new species of Alburnus from the Kolpa River in the Sava River system. ZooKeys 688: 81–110 (DOI 10.3897/zookeys.688.11261)",
        nameEn: "Bogutskaya NG, Zupančič P, Jelić D, Diripasko OA, Naseka AM (2017): Description of a new species of Alburnus from the Kolpa River in the Sava River system. ZooKeys 688: 81–110 (DOI 10.3897/zookeys.688.11261)",
        sourceType: "objava",
        license: "CC BY 4.0",
        url: "https://doi.org/10.3897/zookeys.688.11261",
        noteSi: "Znanstveni opis vrste — holotip, morfometrija, razširjenost.",
        noteEn: "The scientific description of the species — holotype, morphometrics, distribution.",
      },
      {
        key: "zookeys-pensoft",
        nameSi: "ZooKeys — odprto dostopna objava članka (Pensoft Publishers)",
        nameEn: "ZooKeys — the article's open-access publication (Pensoft Publishers)",
        sourceType: "spletni-vir",
        license: "CC BY 4.0",
        url: "https://zookeys.pensoft.net/article/11261/",
        noteSi: "Spletna izdaja članka s slikami — vir glavne fotografije zapisa (slika 1: holotip).",
        noteEn: "The article's online edition with figures — the source of this record's main photograph (figure 1: the holotype).",
      },
      {
        key: "commons-zookeys-pdf",
        nameSi: "Wikimedia Commons: PDF članka (Bogutskaya idr. 2017, CC BY 4.0)",
        nameEn: "Wikimedia Commons: the article's PDF (Bogutskaya et al. 2017, CC BY 4.0)",
        sourceType: "spletni-vir",
        license: "CC BY 4.0",
        url: WM("Description_of_a_new_species_of_Alburnus_Rafinesque_from_the_Kolpa_River_in_the_Sava_River_system_(upper_Danube_drainage).pdf"),
        noteSi: "Celoten znanstveni članek prost dostopen tudi prek Wikimedije.",
        noteEn: "The complete scientific paper freely available through Wikimedia as well.",
      },
      {
        key: "wiki-kolpa-alburnus",
        nameSi: "Wikipedija: Kolpa (razširitev doline pri Gribljah, kopalne temperature, mlini v nadstropju)",
        nameEn: "Wikipedia: Kolpa (the widening of the valley at Griblje, bathing temperatures, the upper-floor mills)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kolpa",
        noteSi: "Kontekst reke: »šele pri Gribljah se dolina spet razširi v manjšo ravnino«.",
        noteEn: "The river's context: »only at Griblje does the valley widen again into a small plain«.",
      },
    ],
  },
  {
    slug: "matice-podzemelj",
    category: "kraj",
    titleSi: "Matične knjige 1669–1947 — arhiv rodbin z Gribelj",
    titleEn: "The parish registers 1669–1947 — the archive of Griblje families",
    periodSi: "1669–1947 · župnija Podzemelj",
    periodEn: "1669–1947 · the Podzemelj parish",
    summarySi:
      "Cerkev sv. Vida v Gribljah je podružnica župnije Podzemelj — in v njenih matičnih knjigah, ki segajo v leto 1669, so zapisani rojstvi, poroke in smrti Gribeljcev. Dvaindvajset digitaliziranih knjig je danes prosto dostopnih na Matricula Online: vrata v rodoslovje za vse Gribeljce po svetu.",
    summaryEn:
      "The church of St. Vitus in Griblje is a filial of the Podzemelj parish — and its registers, reaching back to 1669, hold the births, marriages and deaths of Griblje people. Twenty-two digitised books are freely available today on Matricula Online: a gate into genealogy for Griblje families across the world.",
    storySi:
      "Vsaka vas ima dvoje spomina: živega, ki ga nosijo ljudje, in papirnatega, ki ga nosi župnija. Za Griblje papirnati spomin hranita hrib sv. Vida in župnijski urad v Podzemlju: cerkev v Gribljah je od nekdaj podružnica (Filialkirche) župnije Podzemelj, zavetnika sv. Martina — in kar se je v vasi rodilo, poročilo ali umrlo, se je zapisalo v podzemeljske matične knjige.\n\nTe knjige so med najstarejšim neprekinjenim zapisom te dežele: segajo v leto 1669, ko se je po tridesetletni vojni svet komaj uredil, in se končajo leta 1947, ko so državni registri prevzeli nalogo. Dvaindvajset knjig — krstnih, poročnih in mrliških — je digitaliziranih in jih Nadškofijski arhiv Ljubljana objavlja prosto dostopno na portalu Matricula Online. Za Gribeljce v Clevelandu, Buenos Airesu ali Združenih državah to pomeni nekaj, česar stoletja ni bilo: rodovnik domače hiše lahko listajo brez potovanja.\n\nMatične knjige niso samo imena in datumi. Botri, ki se zapisujejo ob vsakem krstu, so karta vaške družbene mreže: kdo je komu stal ob krstu, pri poroki, ob postelji. Iz vpisov se izlušči, kdaj se je katera družina priselila ali izselila, kdaj je morila nesreča, kdaj so bila leta obilja. Zgodovinarji v takih knjigah berejo demografijo cele pokrajine; za domačine pa so kraj, kjer babica še enkrat postane dekle.\n\nMuzej hrani ta zapis kot vabilo: kdor raziskuje gribeljske korenine — Totterje, Županiče, Štrucelje, Piškuriče — začne tu. In kot opombo iskrenosti: strani samih matric so v arhivu in jih muzej ni prenesel; ta zapis je vrata, ne kopija.",
    storyEn:
      "Every village keeps two memories: the living one carried by people, and the paper one carried by the parish. For Griblje the paper memory is held by the hill of St. Vitus and the parish office at Podzemelj: the church in Griblje has always been a filial (Filialkirche) of the Podzemelj parish, whose patron is St. Martin — and whatever was born, married or died in the village was written into the Podzemelj registers.\n\nThese books are among the oldest continuous records of this land: they reach to the year 1669, when the world was only just settling after the Thirty Years' War, and they close in 1947, when state registries took over the task. Twenty-two books — of baptisms, marriages and burials — have been digitised, and the Archdiocesan Archives of Ljubljana publish them in free access on the Matricula Online portal. For Griblje people in Cleveland, Buenos Aires or the United States this means something no century could offer: the family tree of the home house can be leafed through without a journey.\n\nParish registers are more than names and dates. The godparents entered at every baptism are a map of the village's social web: who stood by whom at the font, at the wedding, at the bedside. From the entries one can glean when a family moved in or emigrated, when misfortune mowed, when the years were plentiful. Historians read in such books the demography of a whole region; for local people they are the place where a grandmother becomes a girl once more.\n\nThe museum keeps this record as an invitation: whoever traces Griblje roots — the Totters, the Županičes, the Štruceljs, the Piškuričes — begins here. And as a note of honesty: the pages of the registers themselves are in the archives and the museum has not copied them; this record is a gate, not a copy.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1669,
    yearTo: 1947,    image: "/images/authentic/matice-knjiga.jpg",
    imageCredit:
      "Krstna knjiga župnije Mošnje (1610–1730) · Wikimedia Commons · javna last — stran krstne knjige iz istega stoletja kot podzemeljske matice",

    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-matice-knjiga",
        nameSi: "Wikimedia Commons: Krstna knjiga župnije Mošnje 1610–1730 — stran z zapisom iz leta 1689",
        nameEn: "Wikimedia Commons: The baptismal register of the parish of Mošnje 1610–1730 — a page with an entry of 1689",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Krstna_knjiga_%C5%BEupnije_Mo%C5%A1nje_1610-1730.jpg"),
        noteSi: "Glavna slika zapisa: stran slovenske krstne knjige iz istega stoletja, v katerem začenjajo tudi podzemeljske matice (1669) — ilustrativni primer rokopisne matične knjige.",
        noteEn: "The record's main image: a page of a Slovene baptismal register from the same century in which the Podzemelj registers also begin (1669) — an illustrative example of a manuscript parish book.",
      },
      {
        key: "matricula-podzemelj",
        nameSi: "Matricula Online — Nadškofijski arhiv Ljubljana: župnija Podzemelj (matične knjige 1669–1947)",
        nameEn: "Matricula Online — Archdiocesan Archives of Ljubljana: the Podzemelj parish (registers 1669–1947)",
        sourceType: "spletni-vir",
        license: "prosti dostop za raziskavo / free access for research",
        url: "https://matricula-online.eu/",
        noteSi:
          "Digitalizirane krstne, poročne in mrliške knjige (22 zvezkov); sv. Vid Griblje je navedena kot podružnica župnije.",
        noteEn:
          "Digitised books of baptisms, marriages and burials (22 volumes); St. Vitus Griblje is listed as a filial of the parish.",
      },
      {
        key: "wiki-griblje-matice",
        nameSi: "Wikipedija: Griblje (župnija Podzemelj, cerkev in pokopališče)",
        nameEn: "Wikipedia: Griblje (the Podzemelj parish, the church and the graveyard)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Potrjuje župnijsko pripadnost vasi in lego cerkvenih prostorov.",
        noteEn: "Confirms the village's parish affiliation and the position of its church grounds.",
      },
      {
        key: "odeon-500let-matice",
        nameSi: "Radio Odeon — 500-letnica prve omembe cerkve sv. Vida (junij 2026)",
        nameEn: "Radio Odeon — the 500th anniversary of the church of St. Vitus's first mention (June 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-slovesno-obelezili-500-letnico-prve-omembe-cerkve-sv-vida/",
        noteSi: "Knjižica Memento (dr. Janez Weiss) ob jubileju — sodobni zapis cerkvene zgodovine vasi.",
        noteEn: "The Memento booklet (Dr. Janez Weiss) issued for the jubilee — the present-day record of the village's church history.",
      },
      {
        key: "wiki-en-griblje-matice",
        nameSi: "Wikipedia (EN): Griblje (župnija Podzemelj — Parish of Podzemelj)",
        nameEn: "Wikipedia (EN): Griblje (the parish — Parish of Podzemelj)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://en.wikipedia.org/wiki/Griblje",
        noteSi: "Mednarodno berljiva potrditev župnijske pripadnosti.",
        noteEn: "The internationally readable confirmation of the parish affiliation.",
      },
    ],
  },
  {
    slug: "cerkvisce",
    category: "kraj",
    titleSi: "Cerkvišče — tri cerkvice, ki jih ni več",
    titleEn: "Cerkvišče — the three churches that are no more",
    periodSi: "~1408 → danes · sosednja vas KS Griblje",
    periodEn: "~1408 → present · the sister village of the Griblje local community",
    summarySi:
      "Pred turškimi vpadi so v Cerkvišču stale tri cerkvice; Turki so jih porušili in zažgali. Za dve domnevno vaščani vejo, kje sta stali, za tretjo pa ne — leta 1994 so v spomin postavili kapelico. Zaselk z dvema jamama je danes drugi naseljni del krajevne skupnosti Griblje.",
    summaryEn:
      "Before the Ottoman incursions three churches stood at Cerkvišče; the Turks pulled them down and burned them. The villagers believe they know where two of them stood — of the third, no one knows. A memorial chapel was raised in 1994. The hamlet with its two caves is today the second settlement of the Griblje local community.",
    storySi:
      "Ime te vasi je arheologija sama: Cerkvišče je kraj, kjer so bile cerkve — in kjer jih ni več. Pred turškimi vpadi, torej že v času okoli leta 1408, ko so osmanske čete prvič prestopile Savo, so tu stale tri cerkvice. Ko so Turki vdrli v Belo krajino, so vse tri porušili in zažgali. Tristo let vojne krajine je naredilo svoje: za dve od njiju domnevno vaščani še vejo, kje sta stali; za tretjo ne ve nihče. Takšna je dinamika spomina — najprej zgori streha, stoletje pozneje pa še kraj sam.\n\nLeta 1994 so kraj spomnil na sebe: postavili so kapelico v spomin treh porušenih cerkvic. Ni rekonstrukcija — kaj bi rekonstruirali, če lega tretje ni znana — ampak pričevanje, da je spomin tu živel naprej tudi brez kamna. Vas pripada isti župniji kot Griblje (Podzemelj) in isti krajevni skupnosti; njena šolska pot vodi v Črnomelj, poštna številka pa je Gradac.\n\nCerkvišče hrani še dvoje skritega: Jelenjo jamo in Vodeno jamo, skriti v gozdu — imeni, ki sprožita vprašanja, na katera zemlja odgovarja le z odkritjem. Nekoč je v vasi delovala zbiralnica mleka, tihi vozel kmečke ekonomije, ki je zdaj utihnil. Vas leži dva kilometra od Kolpe pri Gribljah in dva kilometra od kopališča na Krasincu — nedaleč od polja, s katerega so marca 1945 vzletala zavezniška letala.\n\nMuzej postavlja ta zapis ob zapis o uskoški Vojni krajini: skupaj opisujeta isto stoletje, v katerem se je ta dežela naučila graditi v kamnu — in ga spet izgubljati. Kapelica iz leta 1994 stoji za vse tri, ki jih ni več; njihova imena so v tleh.",
    storyEn:
      "This village's name is an archaeology in itself: Cerkvišče is a place where churches stood — and stand no more. Before the Ottoman incursions, already in the years around 1408, when Ottoman troops first crossed the Sava, three churches stood here. When the Turks broke into Bela krajina, they pulled all three down and burned them. Three hundred years of the Military Frontier did the rest: for two of them the villagers still believe they know the sites; of the third, no one knows. Such is the dynamics of memory — first the roof burns, a century later the place itself.\n\nIn 1994 the place recalled itself: a chapel was raised in memory of the three ruined churches. It is not a reconstruction — what could be reconstructed, when even the third site is unknown — but a testimony that memory lived on here even without stone. The village belongs to the same parish as Griblje (Podzemelj) and to the same local community; its school path leads to Črnomelj, its post number is Gradac.\n\nCerkvišče keeps two hidden things more: the Jelenja jama (Deer Cave) and the Vodena jama (Water Cave), hidden in the woods — names that raise questions the ground answers only by discovery. A milk collection point once worked in the village, a quiet knot of the farm economy, now silent. The village lies two kilometres from the Kolpa at Griblje and two kilometres from the bathing place at Krasinec — not far from the field from which the Allied aircraft took off in March 1945.\n\nThe museum sets this record beside the record of the Uskok Military Frontier: together they describe the same century, in which this land learned to build in stone — and to lose it again. The chapel of 1994 stands for all three that are no more; their names are in the ground.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1408,    image: "/images/authentic/cerkvisce-kapelica.jpg",
    imageCredit:
      "Foto: Scary Boots · Wikimedia Commons · CC BY-SA 2.0 — kamnita kapelica na slovenskem podeželju (ilustrativno)",

    lat: 45.5759667,
    lng: 15.2643167,
    coordsApprox: true,
    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-cerkvisce-kapelica",
        nameSi: "Wikimedia Commons: Kamnita kapelica na slovenskem podeželju (fotograf: Scary Boots)",
        nameEn: "Wikimedia Commons: A stone roadside shrine in the Slovene countryside (photographer: Scary Boots)",
        sourceType: "fotografija",
        license: "CC BY-SA 2.0 (fotograf: Scary Boots)",
        url: WM("Roadside_shrine_in_Slovenia_(20066631714).jpg"),
        noteSi: "Glavna slika zapisa: kapelica, kakršna so po slovenskih vaseh stavili v spomin izgubljenih cerkva — ilustrativa spominske kapelice, ki so jo v Cerkvišču postavili leta 1994.",
        noteEn: "The record's main image: a roadside shrine of the kind Slovene villages raised in memory of lost churches — an illustration of the memorial chapel built at Cerkvišče in 1994.",
      },
      {
        key: "wiki-cerkvisce",
        nameSi: "Wikipedija: Cerkvišče (tri porušene cerkvice, kapelica 1994, jame)",
        nameEn: "Wikipedia: Cerkvišče (the three ruined churches, the 1994 chapel, the caves)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Cerkvi%C5%A1%C4%8De",
        noteSi: "Glavni vir zapisa: turški vpadi, lega, Jelenja in Vodena jama, zbiralnica mleka.",
        noteEn: "The record's main source: the Ottoman incursions, the position, the Deer and Water caves, the milk collection point.",
      },
      {
        key: "wiki-griblje-cerkvisce",
        nameSi: "Wikipedija: Griblje (krajevna skupnost, prvi turški vpad 1408)",
        nameEn: "Wikipedia: Griblje (the local community, the first Ottoman incursion of 1408)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Kontekst vasi in datiranje turških vpadov v Belo krajino.",
        noteEn: "The village context and the dating of the Ottoman incursions into Bela krajina.",
      },
      {
        key: "crnomelj-ks-cerkvisce",
        nameSi: "Občina Črnomelj — krajevna skupnost Griblje (naselji Griblje in Cerkvišče)",
        nameEn: "Municipality of Črnomelj — the Griblje local community (the settlements of Griblje and Cerkvišče)",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://www.crnomelj.si/sl/o-obcini/krajevne-skupnosti/2021122908394017/griblje/",
        noteSi: "Uradna potrditev, da KS Griblje obsega obe naselji.",
        noteEn: "The official confirmation that the Griblje local community comprises both settlements.",
      },
      {
        key: "rtv-krasinec-cerkvisce",
        nameSi: "RTV SLO — evakuacija z letališča Krasinec, marec 1945 (april 2025)",
        nameEn: "RTV SLO — the evacuation from the Krasinec airfield, March 1945 (April 2025)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/odmevi-preteklosti/nenavadna-zgodba-evakuiranih-iz-bele-krajine-pred-koncem-vojne/",
        noteSi: "Krasinec leži 1,5 km od Cerkvišča — letališče v neposredni soseščini vasi.",
        noteEn: "Krasinec lies 1.5 km from Cerkvišče — the airfield in the village's immediate neighbourhood.",
      },
    ],
  },
  {
    slug: "pasuljada",
    category: "sege",
    titleSi: "Pasuljada — dan, ko ob Kolpi zadiši po pasulju",
    titleEn: "The Pasuljada — the day the Kolpa smells of bean stew",
    periodSi: "~2004 → danes · vaška šega 21. stoletja",
    periodEn: "~2004 → present · a village custom of the 21st century",
    summarySi:
      "Tekmovanje v kuhanju pasulja, ki ga Turistično društvo Griblje prireja z Društvom kmečkih žena in kopališčem že dvajset let: leta 2019 je stekla že šestnajsta izvedba. Štirinajst dvočlanskih ekip, komisija in zmagovalni lonec — nova šega, ki se je iz šale skuhala v tradicijo.",
    summaryEn:
      "A bean-stew cooking competition that the Griblje Tourist Society has run with the Farm Women's Society and the bathing place for two decades: by 2019 the sixteenth edition had simmered. Fourteen two-member teams, a jury and the winning pot — a new custom that cooked itself out of a joke and into a tradition.",
    storySi:
      "Vsa ljudska kultura se ne nosi po muzejih — nekaj se kuha v loncih. Pasuljada v Gribljah je dokaz: tekmovanje v kuhanju pasulja, ki ga Turistično društvo Griblje prireja skupaj z Društvom kmečkih žena Griblje in kopališčem Griblje. Leta 2019 je dogodek že šestnajstič zapored dišal po obkolpski ravnini — kar pomeni, da se je zgodovina začela okrog leta 2004, ko se v vasi ni nihče mogel domisliti, da bo vaška šala postala koledarska šega.\n\nFormula je preprosta in zagotovo stara kot kuhinja sama: štirinajst ekip po dva člana, vsaka s svojim loncem, svojim receptom in svojo teorijo o tem, kaj pasulj naredi dobrim. Komisija — v letu 2019 Matjaž Cotič, Tone Fornezzi Tof in Andreja Drakulič Veselič — je ocenjevala, kakor se pri takšnih stvareh ocenjuje: z žlico, z nosom in z diplomaticnim obrazem. Zmagala sta Dragica Piškurič iz Gribelj in Toni Kapušin, pevec skupine Obvezna smer — zmagovalni recept se hrani v izročilu, lonec pa v ponosu.\n\nEtnologi bi rekli: šega mlajša od sto let še ni šega. A ta trditev drži le v muzeju. V živem kraju se tradicija ne deduje samo — nastaja. Pasuljada se je v Gribljah pridružila pasuljadam starejših krajev in županij kot čisto lokalna izvedba, ob Kolpi pa je postala poletni konec avgusta, ki ga radi pričakujejo tudi s hrvaške strani reke. Ob njej je vas zadela isto noto, ki jo zadenejo jurjevanje, pust ali koline: skupaj, do mraka, z dobrim razlogom za srečanje.\n\nMuzej hrani ta zapis kot sporočilo o tem, kaj sploh zbira: ne le preteklost, ampak proces, v katerem preteklost nastaja. Nekoč bo nekdo pisal o Pasuljadi, kakor danes pišemo o Božiču pri Belokranjcih — in ta zapis bo takrat že stoletje star.",
    storyEn:
      "Not all folk culture is carried in museums — some of it simmers in pots. The Pasuljada in Griblje is the proof: a bean-stew cooking competition run by the Griblje Tourist Society together with the Griblje Farm Women's Society and the Griblje bathing place. By 2019 the event had scented the plain by the Kolpa for the sixteenth time running — which means the story began around 2004, when nobody in the village could have guessed that a village joke would become a calendar custom.\n\nThe formula is simple and surely as old as cooking itself: fourteen teams of two, each with its own pot, its own recipe and its own theory of what makes a bean stew good. The jury — in 2019 Matjaž Cotič, Tone Fornezzi Tof and Andreja Drakulič Veselič — judged as such things are judged: with a spoon, with the nose, and with a diplomatic face. Dragica Piškurič of Griblje and Toni Kapušin, singer of the band Obvezna smer, took the honours — the winning recipe is kept in the lore, the pot in the pride.\n\nEthnologists would say: a custom younger than a hundred years is not yet a custom. But that claim holds only inside a museum. In a living place tradition is not only inherited — it is created. The Pasuljada joined the bean-stew contests of older towns as a purely local edition, and by the Kolpa it became the summer's end of August, gladly awaited from the Croatian bank of the river as well. With it the village struck the same note struck by the Jurjevanje festival, carnival or the pig-slaughter feast: together, until dusk, with a good reason to meet.\n\nThe museum keeps this record as a message about what it collects at all: not only the past, but the process in which the past comes into being. One day someone will write about the Pasuljada the way we today write about Christmas among the Bela krajina people — and this record will already be a century old.",
    evidenceStatus: "CORROBORATED",
    yearFrom: 2004,
    addedAt: "2026-09-16",
    image: "/images/authentic/pasuljada.jpg",
    imageCredit:
      "Foto: Ivana Sokolović · Wikimedia Commons · CC BY 2.0 — lonec pasulja",
    sources: [
      {
        key: "commons-pasulj",
        nameSi: "Wikimedia Commons: Pasulj (fotografija: Ivana Sokolović)",
        nameEn: "Wikimedia Commons: Pasulj — bean stew (photograph: Ivana Sokolović)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: Ivana Sokolović)",
        url: WM("Pasulj_(10291319804).jpg"),
        noteSi: "Glavna slika zapisa: lonec pasulja — jed, ob kateri tekmovanje stoji; gribeljski zmagovalni lonec še čaka na fotografijo.",
        noteEn: "The record's main image: a pot of pasulj — the dish the competition stands on; a photograph of Griblje's winning pot still awaits.",
      },
      {
        key: "odeon-pasuljada",
        nameSi: "Radio Odeon — V Gribljah že 16. Pasuljada (6. avgust 2019)",
        nameEn: "Radio Odeon — The 16th Pasuljada already in Griblje (6 August 2019)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-ze-16-pasuljada/",
        noteSi:
          "Glavni vir: 16. izvedba 2019, 14 ekip po 2, komisija, zmagovalca, organizatorji (TD + kmečke žene + kopališče).",
        noteEn:
          "The main source: the 16th edition in 2019, 14 teams of 2, the jury, the winners, the organisers (the tourist society + the farm women + the bathing place).",
      },
      {
        key: "odeon-ks-pasuljada",
        nameSi: "Radio Odeon — Krajevna skupnost Griblje je praznovala svoj praznik (september 2024)",
        nameEn: "Radio Odeon — The Griblje local community celebrated its feast (September 2024)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/krajevna-skupnost-griblje-je-praznovala/",
        noteSi: "Potrjuje TD Griblje kot sooborganizatorja vaških prireditev — vključno s srečanji in prazniki KS.",
        noteEn: "Confirms the Tourist Society as co-organiser of village events — including the local community's feasts.",
      },
      {
        key: "odeon-rally-pasuljada",
        nameSi: "Radio Odeon — Po Gribljah s starodobnimi kolesi (6. julij 2026)",
        nameEn: "Radio Odeon — Through Griblje on vintage bicycles (6 July 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/po-gribljah-s-starodobnimi-kolesi/",
        noteSi: "Društveni kontekst: TD Griblje danes poganja tudi rally starodobnih koles s sekcijo Torpedo.",
        noteEn: "The society's context: the Tourist Society today also runs the vintage-bicycle rally with the Torpedo section.",
      },
      {
        key: "odeon-kavbojski-pasuljada",
        nameSi: "Radio Odeon — Kavbojski žur v Gribljah znova navdušil (junij 2025)",
        nameEn: "Radio Odeon — The Cowboy Party in Griblje delighted again (June 2025)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/kavbojski-zur-v-gribljah-znova-navdusil/",
        noteSi: "Tretja izmed prireditev, ki jih vodi TD — Pasuljada, žur in rally skupaj sestavljajo sodobni praznični koledar vasi.",
        noteEn: "The third of the society's events — the Pasuljada, the party and the rally together make up the village's present festive calendar.",
      },
    ],
  },
  {
    slug: "franc-brinc",
    category: "kraj",
    titleSi: "dr. Franc Brinc — pravnik, ki vrača domov",
    titleEn: "dr. Franc Brinc — the lawyer who gives back to home",
    periodSi: "1941 → danes · učenec in dobrotnik vasi",
    periodEn: "1941 → present · the village's pupil and benefactor",
    summarySi:
      "Izredni profesor prava, penolog in kriminolog, ki je gribeljsko šolo obiskoval 1941–1945. V zadnjih letih je vasi namenil okoli 200.000 evrov darov — in z njimi prebudil gasilski dom, šolo in okolico cerkve.",
    summaryEn:
      "An associate professor of law, penologist and criminologist who attended the Griblje school in 1941–1945. In recent years he has given the village around 200,000 euros — and with it reawakened the fire station, the school and the churchyard.",
    storySi:
      "Dr. Franc Brinc je gribeljsko šolo obiskoval med letoma 1941 in 1945 — vojna mu je otroštvo postavila v tuj prostor, saj so italijanski vojaki zasedli šolsko poslopje in je pouk bežal v gasilski dom. Iz vasi ga je pot odnesla v pravo: postal je izredni profesor, njegovi področji pa penologija in kriminologija — znanosti o kazni in o tem, zakaj ljudje padajo. Vrnil se je z nenavadnim orodjem pravnika: z darilom.\n\nZadnja leta so njegova darovanja postala gospodarska zgodba vasi. Prostovoljnemu gasilskemu društvu je v štirih letih namenil 30.000 evrov: uredili so operativno sobo, v celoti zamenjali streho in izolacijo gasilskega doma, ki ga je pred leti poškodovala toča. Poveljnik Matija Štrucelj je zapisal: »Brez tega ne bi zmogli. Dal nam je zagon in s tem prebudil društvo, ki je bilo v nekem trenutku v rahlem zatonu.« Podružnični šoli je namenil prav toliko — digitalna oprema, igrala, ekovrt in izleti, na katerih so gribeljski otroci prvič videli smučarske skoke v Planici. Skupaj z darovi občini in cerkvi se vsota ustavi pri okoli 200.000 evrih.\n\nVas mu je vrnila s spominom, ne z denarjem. Ob prazniku krajevne skupnosti 15. septembra 2024 je 89-letni Brinc domačine nagovoril z življenjskimi spomini — in isti večer so v gasilskem domu odprli spominsko sobo dr. Franca Brinca. Desetega aprila 2026 so na pročelju šole odkrili spominsko ploščo z njegovim imenom. Ob 500-letnici cerkve sv. Vida junija 2026 pa je njegova podpora skupaj z občino Črnomelj omogočila ureditev novega parkirišča ob cerkvi in poslovilne vežice.\n\nZgodba ima zabeležen začetek: leta 1988 je Brinc za električne zvonove v gribeljski cerkvi daroval 18.900 evrov — prvi znani dar, s katerega se ceh začne šteti. Že kot gimnazijec v Črnomlju je hlastal domov: namesto z avtobusom je tekel od Črnomlja do Gribelj, samo da je bil prej doma. Občina bi mu za dobra dela rada podelila priznanja — a jih odklanja; zadnja zahvala vasi je bila 12. aprila 2025, ko so mu v družbi prebivalcev priredili 90. rojstni dan.\n\nMuzej zapis postavlja v vrsto z Županičem, Dragošem in Totterjevo: vsi so odnesli gribeljsko kri v svet — Brinc pa je prinesel svet nazaj v Griblje, v evrih, ki so postali streha, učilnica in spomin. Dobra duša vasi ni tista, ki največ ima, ampak tista, ki največ vrne. Ta zapis je muzejev način, da se tudi sam zahvali.",
    storyEn:
      "Dr. Franc Brinc attended the Griblje school between 1941 and 1945 — a wartime childhood in borrowed rooms, for Italian soldiers occupied the schoolhouse and lessons fled to the fire station. From the village the road carried him into law: he became an associate professor, his fields penology and criminology — the sciences of punishment and of why people fall. He returned with a lawyer's unusual instrument: a gift.\n\nIn recent years his donations have become the village's economic story. To the volunteer fire brigade he gave 30,000 euros over four years: the operational room was fitted out, the roof and insulation of the fire station — hail-damaged years before — wholly replaced. Commander Matija Štrucelj wrote: »Without this we could not have managed. He gave us momentum, and with it woke a society that was at one moment in a slight decline.« To the branch school he gave just as much — digital equipment, play equipment, a school garden and the excursions on which the Griblje children first saw the ski jumps at Planica. Together with the gifts to the municipality and the church, the sum stops at around 200,000 euros.\n\nThe village repaid him with memory, not money. At the local community's celebration on 15 September 2024 the 89-year-old Brinc addressed his neighbours with the memories of a lifetime — and the same evening the memorial room of dr. Franc Brinc opened in the fire station. On 10 April 2026 a plaque bearing his name was unveiled on the school's facade. At the 500th anniversary of the church of St. Vitus in June 2026, his support together with the Municipality of Črnomelj made possible the new parking place by the church and the funeral vestibule.\n\nThe story has a recorded beginning: in 1988 Brinc gave 18,900 euros for the electric bells of the Griblje church — the first known gift from which the ledger starts counting. As a grammar-school boy in Črnomelj he raced home: instead of the bus he ran from Črnomelj to Griblje, only to be home sooner. The municipality would gladly have awarded him honours for his good deeds — he declines them; the village's last thank-you came on 12 April 2025, when his neighbours threw him his ninetieth birthday.\n\nThe museum sets this record beside Županič, Dragoš and Totter: all carried Griblje blood out into the world — Brinc brought the world back to Griblje, in euros that became a roof, a classroom and a memory. A village's good soul is not the one who has the most, but the one who returns the most. This record is the museum's own way of saying thank you.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1941,
    addedAt: "2026-09-16",
    image: "/images/authentic/brinc-krovska.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — krovska obrt v Preloki (Bela krajina, ~1920)",
    sources: [
      {
        key: "commons-brinc-krovska",
        nameSi: "Wikimedia Commons: Krovska obrt v Preloki, Bela krajina (Fran Vesel)",
        nameEn: "Wikimedia Commons: Roofing craft at Preloka, Bela krajina (Fran Vesel)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Krovska_obrt_v_Beli_krajini.jpg"),
        noteSi: "Glavna slika zapisa: krovska obrt v Beli krajini — nad streho gasilskega doma, ki jo je prebudilo Brinčevo darilo, je ves čas obrt s te fotografije; prava fotografija dobrotnika še čaka družino.",
        noteEn: "The record's main image: roofing craft in Bela krajina — above the fire-station roof awakened by Brinc's gift worked the craft of this photograph; a true photograph of the benefactor still awaits the family.",
      },
      {
        key: "odeon-brinc-plosca",
        nameSi: "Radio Odeon — V Gribljah odkrili spominsko ploščo Francu Brincu (15. april 2026)",
        nameEn: "Radio Odeon — A memorial plaque to Franc Brinc unveiled in Griblje (15 April 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-odkrili-spominsko-plosco-francu-brincu/",
        noteSi:
          "Plošča na pročelju šole, darovi šoli (30.000 €), šolska leta 1941–1945, evakuacijska vaja gasilcev z učenci.",
        noteEn:
          "The plaque on the school facade, the gifts to the school (30,000 €), the school years 1941–1945, the fire brigade's evacuation drill with the pupils.",
      },
      {
        key: "odeon-brinc-ks",
        nameSi: "Radio Odeon — Krajevna skupnost Griblje je praznovala (17. september 2024)",
        nameEn: "Radio Odeon — The Griblje local community celebrated (17 September 2024)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/krajevna-skupnost-griblje-je-praznovala/",
        noteSi:
          "89-letni dr. Brinc z nagovorom o življenjskih spominih; otvoritev spominske sobe v gasilskem domu.",
        noteEn:
          "The 89-year-old dr. Brinc addressing the gathering; the opening of the memorial room in the fire station.",
      },
      {
        key: "s24-brinc-pgd",
        nameSi: "Svet24 — PGD Griblje pred stoletnico, rojak Franc Brinc (13. maj 2026)",
        nameEn: "Svet24 — The Griblje fire brigade before its centenary, their countryman Franc Brinc (13 May 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/lokalno/dolenjska/novice/pgd-griblje-stoletnica-rojak-franc-brinc-1898805",
        noteSi:
          "30.000 € PGD v štirih letih (operativna soba, streha, izolacija); Štrucljev citat o zagonu društva.",
        noteEn:
          "30,000 € to the fire brigade over four years (operational room, roof, insulation); Štrucelj's words on the society's new momentum.",
      },
      {
        key: "odeon-brinc-cerkev",
        nameSi: "Radio Odeon — V Gribljah slovesno obeležili 500-letnico prve omembe cerkve sv. Vida (junij 2026)",
        nameEn: "Radio Odeon — Griblje solemnly marked the 500th anniversary of the church of St. Vitus's first mention (June 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-slovesno-obelezili-500-letnico-prve-omembe-cerkve-sv-vida/",
        noteSi:
          "Novo urejeno parkirišče ob cerkvi in poslovilni vežici — občina Črnomelj in donator dr. Franc Brinc.",
        noteEn:
          "The newly arranged parking place by the church and the funeral vestibule — the Municipality of Črnomelj and the donor dr. Franc Brinc.",
      },
      {
        key: "odeon-brinc-90",
        nameSi: "Radio Odeon: V Gribljah praznovali visok jubilej cenjenega rojaka — 90. rojstni dan dr. Franca Brinca (17. 4. 2025)",
        nameEn: "Radio Odeon: A high jubilee of a respected fellow celebrated in Griblje — dr. Franc Brinc's 90th birthday (17 April 2025)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/v-gribljah-praznovali-visok-jubilej-cenjenega-rojaka/",
        noteSi: "Praznovanje 12. aprila 2025: svet KS Griblje, upravni odbor PGD Griblje in ŠD Griblje, župan Andrej Kavšek — zahvala za donacije, ki so nosile razvoj vasi.",
        noteEn: "The celebration of 12 April 2025: the KS Griblje council, the boards of PGD Griblje and ŠD Griblje, mayor Andrej Kavšek — thanks for the donations that carried the village's development.",
      },
      {
        key: "odeon-brinc-snovice",
        nameSi: "Radio Odeon — Franci Brinc praznuje 90 let (8. 4. 2025, po Slovenskih novicah)",
        nameEn: "Radio Odeon — Franci Brinc turns 90 (8 Apr 2025, after Slovenske novice)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/franci-brinc-praznuje-90-let/",
        noteSi: "Prvi dar 1988 (18.900 € za električne zvonove); tekel od Črnomlja do Gribelj; odklanja občinska priznanja; 90. rojstni dan v vasi 12. 4. 2025.",
        noteEn: "The first gift of 1988 (18,900 euros for the electric bells); he ran from Črnomelj to Griblje; he declines municipal honours; his 90th birthday kept in the village on 12 Apr 2025.",
      },
    ],
  },
  {
    slug: "katarina-zupanic",
    category: "sege",
    titleSi: "Katarina Zupanič — Šopek poljskih cvetlic iz Gribelj",
    titleEn: "Katarina Zupanič — A bouquet of meadow flowers from Griblje",
    periodSi: "1894–1895 · zapis, objavljen 1937",
    periodEn: "1894–1895 · a record published in 1937",
    summarySi:
      "Leta 1894/95 je vaščanka Katarina Zupanič (r. Pezdirc, 1855–1923) na željo svojega sina — etnologa Nika Županiča — zbrala in zapisala ljudsko izročilo Gribelj. Zapis je leta 1937 izšel v Etnologu kot Šopek poljskih cvetlic iz Gribelj.",
    summaryEn:
      "In 1894/95 the village woman Katarina Zupanič (née Pezdirc, 1855–1923), at her son's wish — the ethnologist Niko Županič — gathered and wrote down the folk tradition of Griblje. The record appeared in Etnolog in 1937 as A Bouquet of Meadow Flowers from Griblje.",
    storySi:
      "V drugi polovici devetnajstega stoletja je znala gribeljska kmetica brati in pisati redko dovolj, da bi bilo to vredno omembe. Katarina, rojena Pezdirc leta 1855 na domačiji pri Grizinu, je znala. Poročila se je s kmetom in trgovcem Nikolajem (Mikom) Zupaničem; 1. decembra 1876 sta na svet dobila sina Nika, ki je iz Gribelj odšel v Novo mesto, na Dunaj in v Beograd — in postal ustanovitelj slovenske etnologije.\n\nSin je vedel, kaj ima doma. Leta 1894/95 je prosil mater, naj zbere in zapiše ljudsko izročilo Gribelj — in Katarina je naredila nekaj, kar pred nijo ni naredila nobena roka te vasi: s peresom je zajela leto, šege, pesmi in vere, kakor jih je živela. Njen zapis nosi naslov, ki bi ga lepšega ni mogla izbrati niti poezija: Šopek poljskih cvetlic iz Gribelj v Beli Krajini.\n\nZapis je čakal na objavo dlje, kot je Katarina čakala na vnuke. Umrla je 23. julija 1923; leta 1937 — v devetem zvezku Etnologa, revije, ki jo je njen sin ustanovil leta 1927 — je Šopek končno izšel. Danes je med najstarejšimi obsežnejšimi zapisi ljudskega izročila, zapisanimi v Gribljah samih; starejši je le Kambičev Božič pri Belokranjcih (1889) — dve roki istega desetletja, obe iz ljubezni do iste dežele.\n\nV zbirki, polni zapisovalcev s starejšimi ali novejšimi diplomi, je Katarina prva ženska. Njen zapis je most med dvema muzejema: med vaškim izročilom, ki ga je nosila v glavi, in znanostjo, ki jo je njen sin postavil na noge. Vsak zapis v tej zbirki, ki citira ljudsko izročilo Gribelj, hodi po njeni stezi — od grizinske domačije do tiskane strani.",
    storyEn:
      "In the second half of the nineteenth century a Griblje farm wife who could read and write was rare enough to be worth mentioning. Katarina, born Pezdirc in 1855 at the homestead called pri Grizinu, could. She married the farmer and trader Nikolaj (Miko) Zupanič; on 1 December 1876 they brought a son, Niko, into the world — a boy who left Griblje for Novo mesto, Vienna and Belgrade, and became the founder of Slovene ethnology.\n\nThe son knew what he had at home. In 1894/95 he asked his mother to gather and write down the folk tradition of Griblje — and Katarina did what no hand of this village had done before her: with a pen she captured the year, the customs, the songs and the beliefs as she lived them. Her record bears a title poetry itself could not have chosen better: A Bouquet of Meadow Flowers from Griblje in Bela krajina.\n\nThe record waited longer for print than Katarina waited for grandchildren. She died on 23 July 1923; in 1937 — in the ninth volume of Etnolog, the journal her son had founded in 1927 — the Bouquet finally appeared. Today it stands among the oldest more extensive records of folk tradition written down in Griblje itself; only Kambič's Christmas among the Bela krajina people (1889) is older — two hands of the same decade, both out of love for the same land.\n\nIn a collection full of recorders with older and newer diplomas, Katarina is the first woman. Her record is a bridge between two museums: between the village tradition she carried in her head and the science her son set on its feet. Every record in this collection that quotes the folk tradition of Griblje walks her path — from the Grizin homestead to the printed page.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1894,
    yearTo: 1937,    image: "/images/authentic/katarina-herbarij.jpg",
    imageCredit:
      "Foto: Eleassar, Prirodoslovni muzej Slovenije · Wikimedia Commons · CC BY-SA 4.0 — herbarij Janeza Krstnika Flysserja (1696), najstarejši s slovenskega tal",

    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-katarina-herbarij",
        nameSi: "Wikimedia Commons: Herbarij Janeza Krstnika Flysserja (1696) — najstarejši herbarij s slovenskega tal (fotograf: Eleassar)",
        nameEn: "Wikimedia Commons: The herbarium of Janez Krstnik Flysser (1696) — the oldest herbarium from Slovene soil (photographer: Eleassar)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Eleassar)",
        url: WM("Herbarij_-_Flysser_1696_-_PMS.jpg"),
        noteSi: "Glavna slika zapisa: herbarij — umetnost zbiranja in zapisovanja cvetja, ki ji je Katarina Zupanič leta 1894/95 dodala gribeljski Šopek poljskih cvetlic.",
        noteEn: "The record's main image: a herbarium — the art of collecting and recording flowers to which Katarina Zupanič added Griblje's \"bouquet of field flowers\" in 1894/95.",
      },
      {
        key: "sbl-zupanic-katarina",
        nameSi: "Slovenska biografija — Zupanič Niko (SBL, avtor Vilko Novak)",
        nameEn: "Slovenska biografija — Zupanič Niko (SBL, by Vilko Novak)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/oseba/sbi915246/",
        noteSi:
          "Mati Katarina r. Pezdirc (1855 Griblje – 1923), domačija pri Grizinu; njen zapis izročila 1894/95, objavljen v Etnologu 1937/9.",
        noteEn:
          "Mother Katarina née Pezdirc (1855 Griblje – 1923), the pri Grizinu homestead; her record of tradition 1894/95, published in Etnolog 1937/9.",
      },
      {
        key: "etnolog-sopek",
        nameSi: "Etnolog — Šopek poljskih cvetlic iz Gribelj v Beli Krajini (zapis Katarine Zupanič, 1937/9)",
        nameEn: "Etnolog — A Bouquet of Meadow Flowers from Griblje in Bela krajina (recorded by Katarina Zupanič, 1937/9)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi:
          "Primarni objavljeni vir; muzej išče izvod zvezka za natančne navedbe strani.",
        noteEn:
          "The primary published source; the museum seeks a copy of the volume for exact page references.",
      },
      {
        key: "wiki-zupanic-katarina",
        nameSi: "Wikipedija — Niko Županič",
        nameEn: "Wikipedia — Niko Županič",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Niko_%C5%BDupani%C4%8D",
        noteSi: "Družina: mati Katarina, njena smrt 23. 7. 1923; sinovo delo in ustanovitev Etnologa.",
        noteEn: "The family: mother Katarina, her death on 23 July 1923; the son's work and the founding of Etnolog.",
      },
      {
        key: "iglic-zupanic-clanek",
        nameSi: "Zupanič-Kralj idr. — Niko Županič in njegov boj za identiteto Slovencev (Rast, 2007)",
        nameEn: "Zupanič-Kralj et al. — Niko Županič and his fight for the identity of the Slovenes (Rast, 2007)",
        sourceType: "objava",
        license: "prosti dostop / open access",
        url: "http://physics.fe.uni-lj.si/members/iglic/history/Niko_Zupanic_indent_Slov.pdf",
        noteSi: "Družinska zgodba in kontekst Županičevega dela; brezplačni PDF.",
        noteEn: "The family story and the context of Županič's work; a free PDF.",
      },
    ],
  },
  {
    slug: "toni-gasperic",
    category: "kraj",
    titleSi: "Toni Gašperič — humor z bregov Kolpe",
    titleEn: "Toni Gašperič — humour from the banks of the Kolpa",
    periodSi: "20.–21. stoletje · humorist, pisatelj, voditelj",
    periodEn: "20th–21st century · humorist, writer, presenter",
    summarySi:
      "Humorist, pisatelj, pesnik ter radijski in televizijski voditelj, ki je z ženo Jano živel v Gribljah ob Kolpi — s hišo, odprto za prijatelje in neznance. Tisoče humoresk, vrsta knjig in ena iznajdba: Noč na Kolpi.",
    summaryEn:
      "A humorist, writer, poet and radio and television presenter who lived with his wife Jana in Griblje on the Kolpa — in a house open to friends and strangers alike. Thousands of humoresques, a shelf of books, and one invention: the Night on the Kolpa.",
    storySi:
      "V Gribljah ob reki je stala hiša, ki ni poznala zaklenjenih vrat: Toni Gašperič in žena Jana sta jo držala odprto za prijatelje in neznance. Gašperičeva obrt je bila najredkejša med obrtmi — smeh. Humorist, pisatelj, pesnik in voditelj: oddaje Veseli tobogan, Prizma optimizma in Vi izbirate – jaz izberem so njegov glas nosile po radijskih in televizijskih etereh.\n\nNjegov pisni opus je katalog belokranjske vedrine: zbirke humoresk Ljudje z zaščitenimi hrbti, Vsi smo na ražnju in Moja teta Mara ter spominski knjigi Povej jim (2007) in Življenje je eno samo porivanje (2009). Že naslovi sami so mala šola humorja te dežele: samironija, ki ni predala, ampak oklep.\n\nPripadal je tudi odrom: ustanovil je metliško igralsko skupino Osip Šest in pobudil Noč na Kolpi — poletno kulturno noč na bregu reke, kjer se je vas zbrala ob besedi in pesmi. Njegova hiša v Gribljah je bila pravzaprav muzej prijaznosti: vstop je bil prost, izhod nasičen.\n\nBelokranjski humor, ki ga je nosil, ni bil beg pred stvarnostjo, ampak njen opis: dežela na meji treh svetov — habsburške, osmanske in nato jugoslovanske — se je stoletja učila preživeti z obredom in z šalo. Kdor se smeji, ni premagan; kdor smeji druge, jim je dal orožje. Gašperič je to vedel s seboj: njegove humoreske gledajo majhnemu človeku v žep in v srce hkrati — in ne najdejo tam sovražnika, ampak soseda.\n\nMed nesnovno dediščino, ki jo ta muzej zapisuje, šteje tudi smeh. Vas, ki zna sama sebe spraviti v smeh, preživi vse — tudi tisto, česar ni sme povedati na glas. Gašperičev portret v rubriki Ljudje ob Kolpi (maj 2026) je glavni vir tega zapisa; muzej pa išče plakate Noči na Kolpi in naslovnice njegovih knjig za razstavno polico.",
    storyEn:
      "In Griblje by the river stood a house that knew no locked door: Toni Gašperič and his wife Jana kept it open to friends and strangers alike. Gašperič's trade was the rarest of trades — laughter. Humorist, writer, poet and presenter: the shows Veseli tobogan, Prizma optimizma and Vi izbirate – jaz izberem carried his voice through the radio and television air.\n\nHis written work is a catalogue of Bela krajina cheer: the humoresque collections Ljudje z zaščitenimi hrbti, Vsi smo na ražnju and Moja teta Mara, and the memoirs Povej jim (2007) and Življenje je eno samo porivanje (2009). The titles alone are a small school of this land's humour: self-irony that is not surrender but armour.\n\nHe belonged to the stages as well: he founded the Metlika acting group Osip Šest and initiated the Night on the Kolpa — a summer cultural night on the riverbank where the village gathered around words and song. His house in Griblje was in truth a museum of kindness: entry free, exit full.\n\nThe Bela krajina humour he carried was no escape from reality but its description: a land at the meeting of three worlds — Habsburg, Ottoman and later Yugoslav — learned for centuries to survive by rite and by joke. Whoever laughs is not defeated; whoever makes others laugh has armed them. Gašperič knew this in his bones: his humoresques look into the little man's pocket and heart at once — and find there not an enemy but a neighbour.\n\nAmong the intangible heritage this museum records, laughter counts too. A village that can laugh at itself survives everything — including what it may not say aloud. Gašperič's portrait in the People by the Kolpa series (May 2026) is this record's main source; the museum is looking for posters of the Night on the Kolpa and the covers of his books for its display shelf.",
    evidenceStatus: "DOCUMENTED",
    addedAt: "2026-09-16",
    image: "/images/authentic/gasperic-kolpa.jpg",
    imageCredit:
      "Foto: Hrvoje Bađinec · Wikimedia Commons · CC BY-SA 4.0 — zahod sonca nad Kolpo",
    sources: [
      {
        key: "commons-gasperic-kolpa",
        nameSi: "Wikimedia Commons: Zahod sonca nad Kolpo (fotograf: Hrvoje Bađinec)",
        nameEn: "Wikimedia Commons: Sunset over the Kolpa river (photographer: Hrvoje Bađinec)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Hrvoje Bađinec)",
        url: WM("Sunset_over_Kupa_River.jpg"),
        noteSi: "Glavna slika zapisa: zahod sonca nad Kolpo — reka Gašperičevega življenja in naslov njegove iznajdbe, Noč na Kolpi.",
        noteEn: "The record's main image: sunset over the Kolpa — the river of Gašperič's life and the title of his invention, A Night on the Kolpa.",
      },
      {
        key: "odeon-gasperic",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Toni Gašperič (5. maj 2026)",
        nameEn: "Radio Odeon — People by the Kolpa: Toni Gašperič (5 May 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-toni-gasperic/",
        noteSi:
          "Življenjepis: hiša ob Kolpi odprta za prijatelje in neznance, oddaje, knjige, Osip Šest, Noč na Kolpi.",
        noteEn:
          "The biography: the house on the Kolpa open to friends and strangers, the shows, the books, Osip Šest, the Night on the Kolpa.",
      },
      {
        key: "gasperic-knjige",
        nameSi: "Bibliografija Tonija Gašperiča — zbirke humoresk in spomini (2007–2009)",
        nameEn: "The bibliography of Toni Gašperič — humoresque collections and memoirs (2007–2009)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        noteSi:
          "Knjižni opus naveden po predstavitvi v rubriki Ljudje ob Kolpi; izvodi so preverljivi v knjižničnem katalogu.",
        noteEn:
          "The written works as listed in the People by the Kolpa presentation; copies verifiable in the library catalogue.",
      },
      {
        key: "odeon-ljudje-serija-gasperic",
        nameSi: "Radio Odeon — arhiv rubrike Ljudje ob Kolpi (iskalni arhiv serije)",
        nameEn: "Radio Odeon — the archive of the People by the Kolpa series (the series' search archive)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://radio-odeon.com/iskanje/?q=Ljudje%20ob%20Kolpi",
        noteSi: "Serija portretov, iz katere izhaja tudi ta zapis.",
        noteEn: "The series of portraits from which this record also derives.",
      },
    ],
  },
  {
    slug: "madronicev-mlin",
    category: "kolpa",
    titleSi: "Madroničev mlin — mlin in žaga ob Kolpi",
    titleEn: "The Madronič mill — a mill and sawmill on the Kolpa",
    periodSi: "1937 → danes · Prelesje ob Kolpi",
    periodEn: "1937 → present · Prelesje on the Kolpa",
    summarySi:
      "Dva in pol kilometra po kolpški ravnini od Gribelj: leta 1937 je tesarska družina Madronič kupila požgano domačijo z mlinom in žago. Mlin ne melje več — živi v maketah, arhivu in knjigi, ki jo družina pripravlja.",
    summaryEn:
      "Two and a half kilometres across the Kolpa plain from Griblje: in 1937 the Madronič carpentry family bought a burnt-down homestead with a mill and a sawmill. The mill no longer grinds — it lives on in models, an archive and a book the family is preparing.",
    storySi:
      "Kolpa je mlinom postavljala pogoj, ki ga ni nobena druga slovenska reka: mlini so morali stati v nadstropju, ker se vodostaj ob poplavah dvigne za več metrov. V Prelesju, dva in pol kilometra po ravnini od Gribelj, je leta 1937 tesarska družina Madronič kupila požgano domačijo z mlinom in žago, jo postavila na noge in z njo menjavala kruh za celotno okolico.\n\nVojna je tudi tu pisala svoj koledar. Stari Peter Madronič, rojen 1901 v Dalnjih Njivah, je bil med odposlanci na Zboru odposlancev slovenskega naroda v Kočevju oktobra 1943 — s hčerko Katico, ki je zunaj čuvala konja, v okolici znanega kot »partizanski taksist«. Svobodna Bela krajina je bila tedaj edini košček slovenske zemlje, kjer se je narod mogel javno zbrati; mlin ob Kolpi pa je v tistem času še vedno mlel.\n\nPo vojni sta mlin in žaga delovala še desetletja za zaselke po ravnini — Prelesje, Dalnje Njive, obkolpske domačije do Gribelj samih; pred mlinom je veljalo isto pravilo kakor povsod ob Kolpi: vrsta vozov je bila borza novic, mlinar pa je bral vodo, kakor zdravnik utrip. Leta 1978 je domačija gostila likovno kolonijo študentov — mlin je postal atelje. Danes ne deluje več, obnovljen pa je sto metrov dolg poševni jez — znanje, ki je v njem, pa ni izgubljeno: družina je izdelala tri makete mlina in žage, ena celo z vodnim pogonom.\n\nZadnje poglavje te zgodbe nastaja prav zdaj: pravnukinja in vnuk Petra Madroniča pripravljata knjigo z bogatim arhivskim in slikovnim gradivom. Muzej ta zapis razume kot vabilo — ko knjiga izide, se bo dopolnil. Kolpa pri Gribljah je namreč le najbolj znana točka mlinarske dežele; njena mlinarska zgodba je širša od enega vaškega katastra.",
    storyEn:
      "The Kolpa set its mills a condition no other Slovene river did: the mills had to stand in an upper storey, for at flood the water rises by several metres. At Prelesje, two and a half kilometres across the plain from Griblje, the Madronič carpentry family bought a burnt-down homestead with a mill and a sawmill in 1937, set it on its feet, and traded with it the bread of the whole neighbourhood.\n\nThe war kept its calendar here too. Old Peter Madronič, born 1901 at Dalnje Njive, was among the delegates at the Assembly of Delegates of the Slovene Nation at Kočevje in October 1943 — with his daughter Katica, who guarded the horse outside, known in the parts as the »Partisan taxi«. Free Bela krajina was then the only corner of Slovene soil where the nation could gather openly; and the mill on the Kolpa went on grinding through it all.\n\nAfter the war the mill and the saw worked for further decades for the hamlets across the plain — Prelesje, Dalnje Njive, the homesteads by the Kolpa up to Griblje itself; before the mill the same rule held as everywhere on the river: the queue of carts was an exchange of news, and the miller read the water the way a doctor reads a pulse. In 1978 the homestead hosted an art colony of students — the mill became a studio. Today it works no more, but the hundred-metre diagonal weir has been restored — and the knowledge in it is not lost: the family has built three models of the mill and the saw, one even with water power.\n\nThe last chapter of this story is being written right now: a granddaughter and a grandson of Peter Madronič are preparing a book with rich archival and pictorial material. The museum reads this record as an invitation — when the book appears, the record will grow. The Kolpa at Griblje is, after all, only the best-known point of a milling country; its milling story is wider than one village's cadastral map.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 1937,
    addedAt: "2026-09-16",
    image: "/images/authentic/madronicev-mlin.jpg",
    imageCredit:
      "Foto: Fran Vesel, 24. 8. 1920 · Wikimedia Commons · javna last — Kuzmin mlin z žago v Pobrežju (Bela krajina)",
    sources: [
      {
        key: "commons-madronicev-mlin",
        nameSi: "Wikimedia Commons: Kuzmin mlin z žago v Pobrežju, Bela krajina (Fran Vesel, 1920)",
        nameEn: "Wikimedia Commons: The Kuzmin mill with its saw at Pobrežje, Bela krajina (Fran Vesel, 1920)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Mlin%2C_Bela_krajina.jpg"),
        noteSi: "Glavna slika zapisa: mlin z žago v Pobrežju iz leta 1920 — usoda sodobnika Madroničevega mlina v Prelesju (1937); fotografija pravega gribeljskega mlina še čaka na družino.",
        noteEn: "The record's main image: a mill with a saw at Pobrežje in 1920 — the fate of a contemporary of the Madronič mill at Prelesje (1937); a photograph of the actual Griblje-area mill still awaits the family.",
      },
      {
        key: "odeon-madronicev-mlin",
        nameSi: "Radio Odeon — Madroničev mlin v Prelesju ob Kolpi (Božidar Flajšman, 23. avgust 2019)",
        nameEn: "Radio Odeon — The Madronič mill at Prelesje on the Kolpa (Božidar Flajšman, 23 August 2019)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/madronicev-mlin-v-prelesju-ob-kolpi-v-beli-krajini/",
        noteSi:
          "Celotna zgodba: nakup 1937, Zbor odposlancev 1943 s hčerko Katico, kolonija 1978, tri makete, knjiga v pripravi.",
        noteEn:
          "The whole story: the 1937 purchase, the 1943 Assembly of Delegates with daughter Katica, the 1978 colony, the three models, the book in preparation.",
      },
      {
        key: "wiki-kolpa-mlini-nadstropje",
        nameSi: "Wikipedija — Kolpa (mlini v nadstropju zaradi poplav; razširitev doline pri Gribljah)",
        nameEn: "Wikipedia — Kolpa (mills built in upper storeys against floods; the valley's widening at Griblje)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kolpa",
        noteSi: "Hidrološki kontekst mlinarske stroke ob reki.",
        noteEn: "The hydrological context of the milling trade on the river.",
      },
      {
        key: "commons-malenca-madronic",
        nameSi: "Wikimedia Commons — Slap in malenca na Kolpi pri Gribljah (švabo, 2008, CC BY 3.0)",
        nameEn: "Wikimedia Commons — Waterfall and malenca on the Kolpa at Griblje (švabo, 2008, CC BY 3.0)",
        sourceType: "fotografija",
        license: "CC BY 3.0 / GFDL",
        url: WM("Slap_in_malenca_na_Kolpi_pri_Gribljah.jpg"),
        noteSi:
          "Sorodna mlinarska dediščina istega rečnega odseka — fotografija malence pri Gribljah, sestrskega zapisa v tej zbirki.",
        noteEn:
          "Kindred milling heritage of the same stretch of the river — the photograph of the malenca at Griblje, a sister record in this collection.",
      },
    ],
  },
  {
    slug: "muzejska-ucilnica",
    category: "kraj",
    titleSi: "Muzejska učilnica — fizična sestra digitalnega muzeja",
    titleEn: "The museum classroom — the digital museum's physical sister",
    periodSi: "1889 → 2022 → danes",
    periodEn: "1889 → 2022 → today",
    summarySi:
      "26. junija 2022 so v več kot 130 let stari gribeljski šoli odprli muzejsko učilnico; otvoritve se je udeležil Slovenski šolski muzej. Ta digitalni muzej ima v vasi svojo fizično sestro: dve učilnici, ena naloga.",
    summaryEn:
      "On 26 June 2022 a museum classroom opened in the more than 130-year-old Griblje school; the Slovene School Museum attended the opening. This digital museum has its physical sister in the village: two classrooms, one task.",
    storySi:
      "Šolsko poslopje v Gribljah so blagoslovili novembra 1889: ena učilnica in stanovanje učitelja pripravnika. Vojna ga je zasedla — pouk je bežal v gasilski dom —, povojne množice razširile — učilo se je tudi v Brinčevi hiši —, šestdeseta prinesla podružnični status: od 1963/64 podružnica OŠ Mirana Jarca, od 1989 OŠ Loka Črnomelj. Leta 2002 so v šoli šteli kdaj le štiri do šest učencev; vas in občina sta jo kljub vsemu obdržali. Stavbi s takšno biografijo je bilo treba narediti muzej.\n\nTo so naredili 26. junija 2022: v šoli so odprli muzejsko učilnico. Otvoritve se je udeležila predstavnica Slovenskega šolskega muzeja, sledila pa je literarna prireditev z zapisi šolskega leta 1949/50: pionirji so takrat zbrali četrt kilograma jabolčnih pečk in 215 kilogramov zdravilnih zelišč, igrali igro Gumb za AFŽ in peli Prišla je miška iz mišnice. Šolski arhiv, ki zna dišati po jabolkih.\n\n»Podružnice niso drage, so pa dragocene,« je ob otvoritvi povedala dolgoletna vodja podružnice Branka Weiss — stavek, ki bi moral stati nad vsako slovensko podružnico. Danes šolo obiskuje 17 učencev v petih kombiniranih oddelkih z razširjenim programom; vodja podružnice Marjetka Žunič v Gribljah poučuje od leta 1992 — in to je edina slovenska vas, ki ima svojo podružnico.\n\nTa digitalni muzej in tista fizična učilnica sta sestri: ena hrani spomin v bitih, druga v zraku. Ko bo šola leta 2029 praznovala 140 let, bosta praznovali obe — in ta zapis se bo dopolnil s fotografijami. Vsak učenec, ki danes sedi med klopmi, piše prihodnjo različico tega zapisa.",
    storyEn:
      "The school building in Griblje was blessed in November 1889: one classroom and a trainee teacher's flat. The war occupied it — lessons fled to the fire station —; the postwar crowds widened it — teaching went on in the Brinc house too —; the sixties brought it branch status: from 1963/64 a branch of the OŠ Miran Jarca school, from 1989 of OŠ Loka Črnomelj. In 2002 the school at times counted only four to six pupils; the village and the municipality kept it all the same. A building with such a biography had to be made a museum.\n\nThat was done on 26 June 2022: a museum classroom opened in the school. A representative of the Slovene School Museum attended the opening, followed by a literary event with records of the school year 1949/50: the pioneers then collected a quarter of a kilogram of apple seeds and 215 kilograms of medicinal herbs, played the play Gumb za AFŽ and sang Prišla je miška iz mišnice. A school archive that can smell of apples.\n\n" +
      "»Branch schools are not expensive; they are precious,« the longtime head of the branch school Branka Weiss said at the opening — a sentence that should stand above every Slovene branch school. Today 17 pupils attend the school in five combined departments with an extended programme; the head Marjetka Žunič has taught in Griblje since 1992 — and this is the only Slovene village that has its own branch school.\n\nThis digital museum and that physical classroom are sisters: one keeps memory in bits, the other in the air. When the school celebrates 140 years in 2029, both will celebrate — and this record will grow with photographs. Every pupil sitting at the desks today is writing a future version of it.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 2022,
    addedAt: "2026-09-16",
    image: "/images/authentic/ucilnica-muzej.jpg",
    imageCredit:
      "Foto: TravelingOtter · Wikimedia Commons · CC BY 2.0 — Slovenski šolski muzej v Ljubljani",
    sources: [
      {
        key: "commons-solski-muzej",
        nameSi: "Wikimedia Commons: Slovenski šolski muzej v Ljubljani (fotograf: TravelingOtter)",
        nameEn: "Wikimedia Commons: The Slovenian School Museum in Ljubljana (photographer: TravelingOtter)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: TravelingOtter)",
        url: WM("Slovenian_School_Museum_-_Ljubljana,_Slovenia_(7451262652).jpg"),
        noteSi: "Glavna slika zapisa: Slovenski šolski muzej v Ljubljani — ustanova, katere predstavnica je bila na otvoritvi gribeljske muzejske učilnice; fotografija učilnice v Gribljah še čaka.",
        noteEn: "The record's main image: the Slovenian School Museum in Ljubljana — the institution whose representative attended the opening of the Griblje museum classroom; a photograph of the classroom itself still awaits.",
      },
      {
        key: "s24-muzejska-ucilnica",
        nameSi: "Svet24 — V šoli so spravljene mnoge skrivnosti: odprtje muzejske učilnice na PŠ Griblje (26. junij 2022)",
        nameEn: "Svet24 — Many secrets are kept in the school: the opening of the museum classroom at the Griblje branch school (26 June 2022)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/novice/kultura/v-soli-so-spravljene-mnoge-skrivnosti-odprtje-muzejske-ucilnice-na-ps-griblje-263268-1783688",
        noteSi:
          "Otvoritev 26. 6. 2022, Slovenski šolski muzej (mag. Marjetka Balkovec Debevc), zapisi šolskega leta 1949/50, citat Branke Weiss.",
        noteEn:
          "The opening on 26 June 2022, the Slovene School Museum (mag. Marjetka Balkovec Debevc), the records of the school year 1949/50, Branka Weiss's sentence.",
      },
      {
        key: "odeon-jubilej-ucilnica",
        nameSi: "Radio Odeon — Jubilej gribeljske šole (junij 2019)",
        nameEn: "Radio Odeon — The jubilee of the Griblje school (June 2019)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/jubilej-gribeljske-sole/",
        noteSi: "Zgodovina poslopja: 1889, italijanska zasedba, pouk v Brinčevi hiši, leta 2002–2004.",
        noteEn: "The building's history: 1889, the Italian occupation, lessons in the Brinc house, the years 2002–2004.",
      },
      {
        key: "s24-sola-danes-ucilnica",
        nameSi: "Svet24 — Podružnična šola Griblje: vas, ki ima svojo šolo (4. januar 2026)",
        nameEn: "Svet24 — The Griblje branch school: a village that has its own school (4 January 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://svet24.si/lokalno/dolenjska/novice/podruznicna-sola-griblje-1870858",
        noteSi:
          "17 učencev, pet oddelkov, Marjetka Žunič (od 1992), edina vas s podružnico, 140-letnica 2029.",
        noteEn:
          "17 pupils, five departments, Marjetka Žunič (since 1992), the only village with a branch school, the 140th anniversary in 2029.",
      },
    ],
  },
  {
    slug: "kavbojski-zur",
    category: "sege",
    titleSi: "Kavbojski žur — divji zahod ob Kolpi",
    titleEn: "The Cowboy Party — the Wild West on the Kolpa",
    periodSi: "2024 → danes · najmlajša šega v zbirki",
    periodEn: "2024 → present · the collection's youngest custom",
    summarySi:
      "Poletni dan, ko se Griblje za eno popoldne preobrazijo v divji zahod: country glasba, plesalke Country Roses — domačinke — in klobuki na vaških glavah. Druga izvedba leta 2025 je »znova navdušila«.",
    summaryEn:
      "A summer day when Griblje turns into the Wild West for an afternoon: country music, the Country Roses dancers — local women — and hats on village heads. The second edition, in 2025, »delighted again«.",
    storySi:
      "»Griblje so se v začetku poletja ponovno za en dan preobrazile v divji zahod,« je zapisal Radio Odeon junija 2025. Kavbojski žur je najmlajši praznik v koledarju vasi: country glasba, ples in zahodnjaška oprava ob Kolpi, na prizorišču, ki ga vasi nikoli ne zmanjka — med hišami in ob vodi, kjer poleti živi njeno družabno življenje. Prvič se je zgodil leta 2024 (»Bilo je kot na Divjem zahodu«), drugič leta 2025 — in drugič je znova navdušil.\n\nKdor pomisli, da je divji zahod tu slučajnost, se moti: ljudje so tisti, ki šego naredijo. Plesalke Country Roses so domačinke — v country opravi, ki se v tej vasi ni nosila nikoli prej; nastopili so učenci osnovne šole, Country Vrtičkarji — semiški upokojenci — in skupina Wild West iz Ljubljane. Vse generacije vasi na enem odru, ob glasbi, ki je prišla čez ocean in se ustavila ob reki.\n\nEtnološka iskrenost zahteva povedati: šega, mlajša od sto let, še ni šega — tudi Pasuljada (od ~2004) je v tej zbirki zapisana kot potrjena, ne kot tradicija. Kavbojski žur je torej zapisan takoj ob rojstvu, kar je redkost: večini šeg ni zapisan prvi dan. Nekoč bo ta zapis med najstarejšimi dokumenti o njem.\n\nZa ritmično plat skrbi DJ Sheriff, za plesno pa tri generacije: domače Country Roses, semiški seniorji Country Vrtičkarji in plesalci Wild West iz Ljubljane, ki drugo leto zapored prenašajo znanje na domačinke. Pobudnici country plesa v Gribljah sta Katja Lavrič in Romana Husič — predsednica krajevne skupnosti; organizatorji že zrejo proti tretji izvedbi.\n\nTuristično društvo Griblje ga postavlja ob Pasuljado (avgust) in rally starodobnih koles (julij): poletni trikotnik vasi, ki ga nosi isti prostovoljni strojek. Muzej odkrito navaja vrzeli: kje se je ideja rodila, kdo je prvi speljal glasbo — to so vprašanja, na katera bodo nekoč želeli odgovor prav ti zapisi. Šege namreč ne nastanejo iz tradicije; tradicija nastane iz šeg.",
    storyEn:
      "»At the start of summer Griblje once again turned into the Wild West for a day,« Radio Odeon wrote in June 2025. The Cowboy Party is the youngest feast on the village calendar: country music, dance and western dress by the Kolpa, on the stage the village never lacks — among the houses and by the water where its social life spends the summer. It first happened in 2024 (»It was like in the Wild West«), again in 2025 — and the second time it delighted again.\n\nWhoever thinks the Wild West here is an accident is mistaken: people are what make a custom. The Country Roses dancers are local women — in country dress never before worn in this village; the pupils of the primary school performed, as did the Country Vrtičkarji — retirees from Semič — and the Wild West group from Ljubljana. Every generation of the village on one stage, to music that crossed an ocean and stopped at the river.\n\nEthnological honesty requires saying it plainly: a custom younger than a hundred years is not yet a custom — the Pasuljada too (since ~2004) is recorded in this collection as corroborated, not as tradition. The Cowboy Party is therefore written down at its birth, which is a rarity: most customs never get their first day recorded. One day this will be among the oldest documents about it.\n\nThe rhythm rests with DJ Sheriff, the dancing with three generations: the home-grown Country Roses, the Semič seniors Country Vrtičkarji, and the Wild West dancers of Ljubljana, who for a second year have been passing their craft to the local women. The initiators of country dance in Griblje are Katja Lavrič and Romana Husič — the president of the local community; the organisers already eye a third edition.\n\nThe Griblje Tourist Society sets it beside the Pasuljada (August) and the vintage-bicycle rally (July): the village's summer triangle, carried by the same volunteer crew. The museum states its gaps openly: where the idea was born, who first brought the music — questions these records will one day be asked to answer. Customs do not grow out of tradition; tradition grows out of customs.",
    evidenceStatus: "CORROBORATED",
    yearFrom: 2024,
    addedAt: "2026-09-16",
    image: "/images/authentic/kavboji-oprava.jpg",
    imageCredit:
      "Foto: MaurieF · Wikimedia Commons · CC BY-SA 3.0 — kavbojski škornji in klobuk",
    sources: [
      {
        key: "commons-kavboji",
        nameSi: "Wikimedia Commons: Kavbojski škornji in klobuk (fotograf: MaurieF)",
        nameEn: "Wikimedia Commons: Cowboy boots and hat (photographer: MaurieF)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: MaurieF)",
        url: WM("Cowboy-Boots-And-Hat.png"),
        noteSi: "Glavna slika zapisa: kavbojska oprava — klobuki in škornji, ki se eno poletno popoldne vsako leto znova obledejo v Gribljah.",
        noteEn: "The record's main image: the western outfit — the hats and boots that every summer afternoon dress Griblje anew.",
      },
      {
        key: "odeon-kavbojski-zur",
        nameSi: "Radio Odeon — Kavbojski žur v Gribljah znova navdušil (junij 2025)",
        nameEn: "Radio Odeon — The Cowboy Party in Griblje delighted again (June 2025)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/kavbojski-zur-v-gribljah-znova-navdusil/",
        noteSi:
          "Druga izvedba (2025): Country Roses, učenci OŠ, Country Vrtičkarji, Wild West iz Ljubljane; omemba prve izvedbe 2024.",
        noteEn:
          "The second edition (2025): Country Roses, primary-school pupils, the Country Vrtičkarji, Wild West of Ljubljana; mention of the first edition of 2024.",
      },
      {
        key: "odeon-rally-kavbojski",
        nameSi: "Radio Odeon — Po Gribljah s starodobnimi kolesi (julij 2026)",
        nameEn: "Radio Odeon — Through Griblje on vintage bicycles (July 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/po-gribljah-s-starodobnimi-kolesi/",
        noteSi:
          "Country Roses nastopijo tudi na rallyju — šega se prepleta z vaškim poletnim koledarjem; TD kot skupni organizator.",
        noteEn:
          "The Country Roses also perform at the rally — the custom interweaves with the village's summer calendar; the Tourist Society as the common organiser.",
      },
      {
        key: "odeon-pasuljada-kontekst",
        nameSi: "Radio Odeon — V Gribljah že 16. Pasuljada (avgust 2019)",
        nameEn: "Radio Odeon — The 16th Pasuljada already in Griblje (August 2019)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-ze-16-pasuljada/",
        noteSi:
          "Kontekst prazničnega koledarja TD Griblje: Pasuljada od ~2004, žur od 2024 — vzorec nastajanja novih šeg.",
        noteEn:
          "The context of the Tourist Society's festive calendar: the Pasuljada since ~2004, the party since 2024 — the pattern of new customs being born.",
      },
      {
        key: "odeon-kavbojski-2025",
        nameSi: "Radio Odeon — Kavbojski žur v Gribljah znova navdušil (24. 6. 2025)",
        nameEn: "Radio Odeon — The Griblje cowboy party delighted again (24 Jun 2025)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/kavbojski-zur-v-gribljah-znova-navdusil/",
        noteSi: "Druga izvedba: Country Roses, Country Vrtičkarji (Semič), Wild West (Ljubljana), DJ Sheriff; pobudnici Katja Lavrič in Romana Husič; tretja izvedba v pripravi.",
        noteEn: "The second edition: Country Roses, Country Vrtičkarji (Semič), Wild West (Ljubljana), DJ Sheriff; initiated by Katja Lavrič and Romana Husič; a third edition in preparation.",
      },
    ],
  },
  {
    slug: "zvon-2008",
    category: "kraj",
    titleSi: "Zvon 2008 — glas, ki se je vrnil v cerkev",
    titleEn: "The bell of 2008 — the voice that returned to the church",
    periodSi: "2008 · blagoslov in posvetitev",
    periodEn: "2008 · blessing and consecration",
    summarySi:
      "Leta 2008 so v Gribljah blagoslovili in posvetili nov zvon cerkve sv. Vida. O dogodku priča spominska knjiga SV. VID GRIBLJE — med redkimi tiskanimi viri, ki so nastali v sami vasi.",
    summaryEn:
      "In 2008 a new bell of the church of St. Vitus was blessed and consecrated in Griblje. A memorial book, SV. VID GRIBLJE, bears witness to the event — among the rare printed sources created in the village itself.",
    storySi:
      "Cerkev živi z glasom: zvon je bil desetletja edini radio vaščanov — k maši, k pogrebu, ob nevihti, ob vojni. Njegova beseda je bila dogovorjena pred pismenostjo: trije udarci, zamah, slavje; preden je vas znala brati, je znala poslušati. Cerkev sv. Vida, prvič zapisana leta 1526, je stoletja menjavala zvonove, kakor jih menjujejo vse cerkve: zvon je bil vojski vedno le baker. Usoda gribeljskih predhodnikov — rekvizicije, razpoke, menjava — pa je danes izgubljena; to vrzel muzej odkrito razglasi in išče.\n\nKar je dokumentirano, je tole: leta 2008 so v Gribljah blagoslovili in posvetili nov zvon. O dogodku je nastala spominska knjiga »SV. VID GRIBLJE, Blagoslovitev in posvetitev zvona, Griblje 2008« — skromna brošura, ki jo Wikipedijin članek o vasi navaja med literaturo, in eden redkih tiskanih virov, ki so nastali v sami vasi. Zvonovi imajo vedno botre; njihova imena so v takšnih knjigah navadno zapisana.\n\nJunija 2026 je ta glas pozvonil ob 500-letnici prve omembe cerkve: slovesno mašo je daroval upokojeni novomeški škof msgr. Andrej Glavan, ob cerkvi pa so blagoslovili novo urejeno parkirišče in poslovilno vežico. Cerkev ima danes svojo mežnarico (Ana Križan) in ključarja (Alojzij Štruclj) — in svoj glas, ki še vedno meri vaški dan: od jutranjega pozvona do večernega miru.\n\nTa zapis je vabilo k dopolnitvi: muzej išče fotografije blagoslova 2008, imena botrov zvona in ime livarne, ki ga je ulila — vsak zvon nosi žig, vsak žig pa zgodbo. Ko se bodo našli, se bo vrzel v tem zapisu zaprla. Tako deluje muzej: ne z domnevami, z viri.",
    storyEn:
      "A church lives by its voice: for decades the bell was the villagers' only radio — to mass, to a funeral, at a storm, at war. Its word was agreed upon before literacy: three strokes, a peal, a celebration; before the village could read, it could listen. The church of St. Vitus, first written down in 1526, changed its bells across the centuries as all churches do: to an army a bell was always only bronze. The fate of the Griblje predecessors — requisitions, cracks, replacement — is today lost; the museum declares this gap openly and searches.\n\nWhat is documented is this: in 2008 a new bell was blessed and consecrated in Griblje. A memorial book arose from the event — »SV. VID GRIBLJE, the Blessing and Consecration of the Bell, Griblje 2008« — a modest booklet that the Wikipedia article on the village lists among its literature, and one of the rare printed sources created in the village itself. Bells always have godparents; their names are customarily written in such books.\n\nIn June 2026 this voice rang out at the 500th anniversary of the church's first mention: the solemn mass was celebrated by the retired Bishop of Novo mesto, msgr. Andrej Glavan, and by the church the newly arranged parking place and funeral vestibule were blessed. The church has today its sexton (Ana Križan) and its keykeeper (Alojzij Štruclj) — and its voice, which still measures out the village day: from the morning ring to the evening quiet.\n\nThis record is an invitation to completion: the museum is looking for photographs of the 2008 blessing, the names of the bell's godparents and the foundry that cast it — every bell carries a mark, and every mark a story. When they are found, the gap in this record will close. That is how a museum works: not with conjectures, with sources.",
    evidenceStatus: "CORROBORATED",
    yearFrom: 2008,
    yearTo: 2008,    image: "/images/authentic/zvon.jpg",
    imageCredit:
      "Foto: George Chernilevsky · Wikimedia Commons · CC BY 4.0 — bronasti cerkveni zvon (ilustrativno)",

    addedAt: "2026-09-16",
    sources: [
      {
        key: "commons-zvon",
        nameSi: "Wikimedia Commons: Bronasti cerkveni zvon (fotograf: George Chernilevsky)",
        nameEn: "Wikimedia Commons: A bronze church bell (photographer: George Chernilevsky)",
        sourceType: "fotografija",
        license: "CC BY 4.0 (fotograf: George Chernilevsky)",
        url: WM("Church_bell_2017_G1.jpg"),
        noteSi: "Glavna slika zapisa: bronasti cerkveni zvon — kakršen je bil blagoslovljen v Gribljah leta 2008; fotografija pravega gribeljskega zvona še čaka na domačina.",
        noteEn: "The record's main image: a bronze church bell — of the kind blessed at Griblje in 2008; a photograph of the actual Griblje bell still awaits a villager.",
      },
      {
        key: "spominska-knjiga-zvon",
        nameSi: "SV. VID GRIBLJE — Blagoslovitev in posvetitev zvona, Griblje 2008 (spominska knjiga)",
        nameEn: "SV. VID GRIBLJE — the Blessing and Consecration of the Bell, Griblje 2008 (a memorial book)",
        sourceType: "arhiv",
        license: "navedi vir / cite the source",
        noteSi:
          "Primarni tiskani vir o blagoslovu in posvetitvi zvona; naveden v literaturi Wikipedijinega članka o Gribljah. Muzej išče izvod.",
        noteEn:
          "The primary printed source on the blessing and consecration of the bell; listed in the literature of the Wikipedia article on Griblje. The museum seeks a copy.",
      },
      {
        key: "wiki-griblje-zvon",
        nameSi: "Wikipedija — Griblje (literatura: spominska knjiga 2008)",
        nameEn: "Wikipedia — Griblje (literature: the 2008 memorial book)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi:
          "Navedba spominske knjige o zvonu med literaturo; cerkev in pokopališče sta bili nekoč tik ob gozdu.",
        noteEn:
          "The memorial book on the bell listed among the literature; the church and graveyard once stood right by the wood.",
      },
      {
        key: "odeon-500-zvon",
        nameSi: "Radio Odeon — V Gribljah slovesno obeležili 500-letnico prve omembe cerkve sv. Vida (junij 2026)",
        nameEn: "Radio Odeon — Griblje solemnly marked the 500th anniversary of the church of St. Vitus's first mention (June 2026)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.radio-odeon.com/novice/v-gribljah-slovesno-obelezili-500-letnico-prve-omembe-cerkve-sv-vida/",
        noteSi:
          "Jubilejna maša škofa Glavana; mežnarica Ana Križan in ključar Alojzij Štruclj; novo parkirišče in poslovilna vežica.",
        noteEn:
          "The jubilee mass of Bishop Glavan; the sexton Ana Križan and keykeeper Alojzij Štruclj; the new parking place and funeral vestibule.",
      },
      {
        key: "commons-cerkev-zvon",
        nameSi: "Wikimedia Commons — Griblje, Črnomelj: cerkev sv. Vida (Eleassar, 2012, CC BY-SA 3.0)",
        nameEn: "Wikimedia Commons — Griblje, Črnomelj: the church of St. Vitus (Eleassar, 2012, CC BY-SA 3.0)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0",
        url: WM("Griblje%2C_%C4%8Crnomelj_-_cerkev_sv._Vida.jpg"),
        noteSi:
          "Zvonik cerkve na fotografiji iz leta 2012 — stanje štiri leta po blagoslovu zvona.",
        noteEn:
          "The church's bell tower in a 2012 photograph — its state four years after the bell's blessing.",
      },
    ],
  },
  {
    slug: "zaselki-griblje",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Zaselki: Dolnje, Srednje in Gornje Griblje ter Brinsko selo",
    titleEn: "The hamlets: Dolnje, Srednje and Gornje Griblje and Brinsko selo",
    periodSi: "od srednjega veka → danes",
    periodEn: "from the Middle Ages → present",
    summarySi:
      "Griblje niso ena ulica, ampak štiri zavesti: Dolnje ob Kolpi, Srednje ob cesti, Gornje pod hribi in Brinsko selo — razložena vas, kakršne znajo narediti samo reke.",
    summaryEn:
      "Griblje is not one street but four awarenesses: Dolnje by the Kolpa, Srednje by the road, Gornje beneath the hills and Brinsko selo — a scattered village only rivers know how to build.",
    storySi:
      "Kdor v Griblje pride z Bizeljske ceste, najprej misli, da je vas. Potem pa se mu razplete: Dolnje Griblje se spustijo proti reki, kjer so stoletja živeli mlinarji, čolnarji in kopališčarji; Srednje Griblje se držijo ceste, po kateri je tekla vsa trgovina med Črnomljem in Podzemljem; Gornje Griblje se vzpenjajo proti hribom, od koder so Jandreči in Totterji v devetnajstem stoletju odnesli svoja imena čez ocean — in iz koder je v Hollywood odšla Audrey Totter. Četrto ime, Brinsko selo, nosi svoje pokrajino samo zase.\n\nTakšna zbita razloženost ni naključje: ob Kolpi so hiše stale tam, kjer je bila zemlja — loka ob reki, njive na terasah, gozd nad njimi. Vsak zasek je imel svoj odnos do vode, svojo pot do cerkve in svoj glas v vaški stvari. Vas, ki jo sestavljajo zaselki, se vedno odloča počasneje in trdneje: mora uskladiti štiri kraje, ne enega.\n\nZa ta zapis je topo-nografska resnica tudi merilna: ko muzej piše o »vasi Griblje«, piše o vseh štirih zaselkih skupaj — pošta in šola so bile skupne, gasilski dom je skupen, Pasuljada je skupna. Razlike so ostale v ležah: kjer reka, tam druga gospodinjstva; kjer hrib, druga imena.\n\nMuzej bo zaselke dopolnjeval po vrstnem redu dokazov: kdaj se prvič zapiše ime Brinsko selo, kdo ga je nosil, kje natančno je potekala meja med Gornjimi in Srednjimi Gribljami. Vsak domačin, ki razmejuje zna, je vabljen kot kartograf.",
    storyEn:
      "Whoever comes to Griblje from the Črnomelj road first thinks it is a single village. Then it comes apart: Dolnje Griblje slope towards the river, where millers, boatmen and bathers lived for centuries; Srednje Griblje hold to the road along which all trade between Črnomelj and Podzemelj once ran; Gornje Griblje climb towards the hills, from which the Jandreč and Totter families carried their names across the ocean in the nineteenth century — and from which Audrey Totter set out for Hollywood. The fourth name, Brinsko selo, keeps its landscape to itself.\n\nSuch compact scattering is no accident: by the Kolpa houses stood where the land was — meadows by the river, fields on the terraces, forest above them. Each hamlet had its own relation to water, its own path to church and its own voice in village affairs. A village made of hamlets always decides more slowly and more firmly: it must reconcile four places, not one.\n\nFor this record the topographic truth is also its measure: when the museum writes of »the village of Griblje«, it writes of all four hamlets together — the school and the fire station were shared, the Pasuljada is shared. The differences remained in the lie of the land: where the river, different households; where the hill, different names.\n\nThe museum will add to the hamlets in the order of evidence: when the name Brinsko selo is first written down, who bore it, where exactly the boundary between Gornje and Srednje Griblje ran. Every villager who can draw the lines is invited as a cartographer.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/zaselki-griblje.jpg",
    imageCredit:
      "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0 — vas Griblje: veriga zaselkov v dolini",
    yearFrom: 1526,
    lat: 45.5754,
    lng: 15.2928,
    coordsApprox: true,
    featured: false,
    sources: [
      {
        key: "commons-zaselki",
        nameSi: "Wikimedia Commons: Griblje, Črnomelj — panorama vasi (fotograf: Eleassar)",
        nameEn: "Wikimedia Commons: Griblje, Črnomelj — a panorama of the village (photographer: Eleassar)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Eleassar)",
        url: WM("Griblje,_%C4%8Crnomelj.jpg"),
        noteSi:
          "Glavna slika zapisa: vas v svoji dolini — loka ob reki, njive na terasah, gozd nad njimi: pokrajina, v katero je razpeta veriga štirih zaselkov.",
        noteEn:
          "The record's main image: the village in its valley — meadows by the river, fields on the terraces, forest above: the landscape into which the chain of four hamlets is stretched.",
      },
      {
        key: "wiki-griblje-zaselki",
        nameSi: "Wikipedija: Griblje (sestavni zaselki Dolnje, Srednje in Gornje Griblje ter Brinsko selo)",
        nameEn: "Wikipedia: Griblje (the constituent hamlets of Dolnje, Srednje and Gornje Griblje and Brinsko selo)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Topografska sestava vasi po štirih zaselkih.",
        noteEn: "The topographic composition of the village into four hamlets.",
      },
      {
        key: "odeon-audrey",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Audrey Mary Totter (Gornje Griblje)",
        nameEn: "Radio Odeon — People by the Kolpa: Audrey Mary Totter (Gornje Griblje)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-audrey-mary-totter/",
        noteSi: "Zveza Gornjih Gribelj z rodovino Jandreč/Totter in Hollywoodom.",
        noteEn: "The link between Gornje Griblje and the Jandreč/Totter family and Hollywood.",
      },
    ],
  },
  {
    slug: "goranja-lokva",
    addedAt: "2026-09-16",
    category: "narava",
    titleSi: "Goranja lokva in Rudna peč — zemlja, ki je dala opeko",
    titleEn: "Goranja lokva and Rudna peč — the earth that gave the brick",
    periodSi: "po letu 1848 → danes",
    periodEn: "after 1848 → present",
    summarySi:
      "Ko so kmetje po letu 1848 izkrčili brezov gozd, so v njem napravili kal — Goranjo lokvo — kjer so kopali glino za opeko. V bližini Rudna peč skriva železovo prst v plasteh.",
    summaryEn:
      "When the farmers cleared the birch forest after 1848, they made a pond in it — Goranja lokva — where clay was dug for brick. Nearby, Rudna peč hides iron earth in layers.",
    storySi:
      "Leto 1848 je za kmečki svet pomenilo eno: odprte roke. Odpravljena tlaka je kmetom dala razlog, da izkrčijo brezov gozd — s pomočjo vprežne živine, z rokami in z leti. V brezju so nato napravili kal oziroma lokev, ki se je pripletla v ime pokrajine: Goranja lokva, kjer so kopali glino za opeko. Vsaka stara hiša v vasi nosi v zidu kraj, kjer je ta glina gorela.\n\nPokrajina je arhiv dela: kjer je danes lug ali travnik, je bil gozd; kjer je jama, je bil kozolec; kjer je lokva, je bila peč. Goranja lokva je oboje hkrati — voda, ki je nastala iz kopanja, in kopanje, ki je nastalo iz potrebe po hiši. Ime Rudna peč pa je sporočilo, da je ta zemlja nosila tudi kovino: železova prst v plasteh, ki so jo obdelovalci prsti stoletja poznali bolje od geologov.\n\nZa vas take stvari niso geologija, ampak gospodinjstvo: glina je bila gradivo, ki si ga lahko privoščiš, če imaš zdrave volje in vprežne živali; opeka pa je bila razlika med hišo, ki zdrži stoletje, in hišo, ki zdrži generacijo. V devetnajstem stoletju se je Bela krajina gradila iz svoje zemlje — dobesedno.\n\nMuzej išče: kdaj so v Goranji lokvi nazadnje kopali, katera peč je žgala gribeljsko opeko, kdo se spomni imena zadnjega opekarja. Vsak odgovor bo dodal plast tej zgodbi — kakor jih je prst dodajala Rudni peči.",
    storyEn:
      "For the farming world, 1848 meant one thing above all: open hands. The abolition of the robot gave the farmers reason to clear the birch forest — with draft animals, with hands, with years. In the birch grove they then made a pond that wove itself into the name of the landscape: Goranja lokva, where clay was dug for brick. Every old house in the village carries in its wall a place where this clay was fired.\n\nThe landscape is an archive of labour: where there is meadow today there was forest; where there is a pit, a hayrack; where a pond, a kiln. Goranja lokva is both at once — water born of digging, and digging born of the need for a house. The name Rudna peč carries the message that this earth also held metal: iron soil in layers, known to its tillers better than to geologists for centuries.\n\nFor a village such things are not geology but housekeeping: clay was a material you could afford if you had sound will and draft animals; brick was the difference between a house that stands a century and one that stands a generation. In the nineteenth century Bela krajina was built from its own earth — literally.\n\nThe museum is looking for: when clay was last dug at Goranja lokva, which kiln fired Griblje's brick, who remembers the name of the last brickmaker. Every answer will add a layer to this story — as the earth added them to Rudna peč.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/goranja-lokva.jpg",
    imageCredit:
      "Foto: Alan Orlič Belšak (Alanorlic) · Wikimedia Commons · CC BY-SA 4.0 — aerofotografija ribnika na zgornjem koncu Gribelj",
    yearFrom: 1848,
    featured: false,
    sources: [
      {
        key: "commons-lokva",
        nameSi: "Wikimedia Commons: Pond Griblje — aerofotografija ribnika zahodno od Gribelj (fotograf: Alanorlic)",
        nameEn: "Wikimedia Commons: Pond Griblje — an aerial photograph of the pond west of Griblje (photographer: Alanorlic)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Alanorlic)",
        url: WM("Pond_Griblje.jpg"),
        noteSi:
          "Glavna slika zapisa: ribnik na zgornjem koncu vasi, posnet od zgoraj — voda, kakršna za sabo pusti kopanje gline. Ali je na posnetku prava Goranja lokva, bodo prepoznali domačini.",
        noteEn:
          "The record's main image: the pond at the upper end of the village, seen from above — water of the kind clay-digging leaves behind. Whether the frame shows the old Goranja lokva itself, the villagers will recognise.",
      },
      {
        key: "wiki-griblje-lokva",
        nameSi: "Wikipedija: Griblje (Goranja lokva, Rudna peč, izkoriščanje brezja po 1848)",
        nameEn: "Wikipedia: Griblje (Goranja lokva, Rudna peč, the clearing of the birch grove after 1848)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Izkrčevanje brezja po letu 1848, kopanje gline za opeko v lokvi, železova prst pri Rudni peči.",
        noteEn: "The clearing of the birch grove after 1848, the digging of brick clay at the pond, the iron earth at Rudna peč.",
      },
    ],
  },
  {
    slug: "strucelj-kmetija",
    addedAt: "2026-09-16",
    category: "gospodarstvo",
    titleSi: "Kmetija Štrucelj — s pesmijo do mraka",
    titleEn: "The Štrucelj farm — with song until dusk",
    periodSi: "20. stoletje → danes",
    periodEn: "20th century → present",
    summarySi:
      "Alojz Štrucelj, gribeljski kmet in prirejevalec mleka na družinski kmetiji obsega ~90 hektarov: spomin na čas, ko se je kosilo ročno in molzlo ob pesmi.",
    summaryEn:
      "Alojz Štrucelj, a Griblje farmer and milk producer on a family farm of ~90 hectares: a memory of the time when mowing was done by hand and milking to a song.",
    storySi:
      "Radio Odeon ga je v rubriki Ljudje ob Kolpi zapisal med redkimi, ki so dočakali obseg, ki ga ima danes: družinska kmetija z okoli devetdesetimi hektari in prirejo mleka — kmetija, ki je zrasla iz istih rok, ki so nekoč kosile s kosirjem. Alojz Štrucelj je o tistem času povedal stavek, ki bi moral stati nad vsakim muzejem kmetijstva: »S pesmijo je delo lažje steklo, včasih do mraka, a vedno skupaj.«\n\nTa en stavek nosi cel ekonomski sistem: ročna košnja in molža nista prenašali posameznikovih ur, ampak sosedske vrste — kdor je imel več rok, je imel več kruha; kdor je imel pesem, je imel tudi čas. Pesem pri delu ni bila zabava, ampak tehnologija: ritem, ki je držal koso v enakomerjem loku in vrsto ljudi v enakomerjem koraku.\n\nSodobna mlekarska kmetija je iz tega sveta podedovala obseg, ne pa več ritma: molžo danes merijo litri na kravo in obroki na dan, košnjo hektarji na uro. A korenina je ista — kmetija, ki družini drži hrbet, in vasi identiteto: Griblje so bile in ostajajo kmečka vas, kjer je bila zemlja edina banka, ki nikoli ni propadla.\n\nZapis povezuje dve plasti gribeljskega gospodarstva: oranje (zapis o Antonu Filaku, prvaku v oranju) in mleko (ta zapis). Skupaj sta spomin, da je ta dežela hranila svoje ljudi z rokami — in da so roke znale tudi peti.",
    storyEn:
      "In its People by the Kolpa series Radio Odeon wrote him among the few who lived to see the scale of today: a family farm of around ninety hectares with milk production — a farm grown from the same hands that once mowed with a scythe. Of that time Alojz Štrucelj said the sentence that should stand above every museum of farming: »With a song the work flowed easier, sometimes until dusk, but always together.«\n\nThat single sentence carries a whole economic system: hand mowing and milking did not carry an individual's hours but neighbours' ranks — whoever had more hands had more bread; whoever had a song also had time. Song at work was not entertainment but technology: a rhythm that kept the scythe in an even sweep and the line of people in an even step.\n\nThe modern dairy farm inherited the scale from that world, but no longer the rhythm: milking is now measured in litres per cow and feeds per day, mowing in hectares per hour. But the root is the same — a farm that holds up a family, and a village's identity: Griblje was and remains a farming village, where land was the only bank that never failed.\n\nThe record joins two layers of Griblje's economy: ploughing (the record of Anton Filak, the ploughing champion) and milk (this record). Together they are a reminder that this land fed its people by hand — and that the hands also knew how to sing.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/strucelj-kosec.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — kosec pri ročni košnji (ilustrativna fotografija dela iz Štrucljevega spomina; kmetija Štrucelj čaka na svojo)",
    yearFrom: 1950,
    featured: false,
    sources: [
      {
        key: "odeon-strucelj",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Alojz Štrucelj (30. avgust 2026)",
        nameEn: "Radio Odeon — People by the Kolpa: Alojz Štrucelj (30 August 2026)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/s-pesmijo-je-delo-lazje-steklo-vcasih-do-mraka-a-vedno-skupaj/",
        noteSi: "Družinska kmetija ~90 ha s prirejo mleka; citat o ročni košnji in molži.",
        noteEn: "The family farm of ~90 ha with milk production; the quotation on hand mowing and milking.",
      },
      {
        key: "commons-kosec",
        nameSi: "Wikimedia Commons: Kosec pri delu (Fran Vesel)",
        nameEn: "Wikimedia Commons: A mower at work (Fran Vesel)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Kosec_pri_delu.jpg"),
        noteSi: "Glavna slika zapisa: kosec pri ročni košnji — delo, o katerem govori Štrucljev spomin.",
        noteEn: "The record's main image: a mower at hand mowing — the work of Štrucelj's memory.",
      },
    ],
  },
  {
    slug: "tamburasi-danica",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Tamburaši društva Danica — bugarija mladega Dragoša",
    titleEn: "The tambura players of the Danica society — young Dragoš's bugarija",
    periodSi: "1920-ta leta",
    periodEn: "the 1920s",
    summarySi:
      "V dvajsetih letih so gribeljski fantje igrali v tamburaškem zboru vaškega kulturno-prosvetnega društva Danica; med njimi mladi Niko Dragoš na bugariji, vodila pa jih je učiteljica Amalija Uršič — begunka s Kobaridskega, ki je tamburo prinesla s celovškega učiteljišča.",
    summaryEn:
      "In the 1920s Griblje's young men played in the tambura band of the village's own Danica cultural society; among them young Niko Dragoš on the bugarija — led by the schoolmistress Amalija Uršič, a refugee from the Kobarid country who had carried the tambura with her from the teachers' college in Klagenfurt.",
    storySi:
      "Konec devetnajstega in v začetku dvajsetega stoletja so po slovenskih vaseh in mestih zrasla kulturno-prosvetna društva — in tudi Griblje so dobila svoje. Imenovalo se je Danica in imelo je tamburaški zbor, kakor so takšna društva navadno gojila pevski, gledališki in bralni odsek hkrati. V tamburaški vrsti so stali gribeljski fantje in možje — večinoma obrtniki, ki so glasbo gojili ob delu. Niko Dragoš se jim je pridružil leta 1924 kot sedemnajstletnik in igral bugarijo: ritmično glasbilo tamburaške družine, po zunanjosti in vlogi podobno kitari, ki v zasedbi drži takto, kakor kamra drži hišo.\n\nZa zbor je bil usoden prihod učiteljice. Amalija Uršič je bila mlada Primorka, begunka s kobariškega kraja, ki je morala pred fronto prve svetovne vojne zapustiti rodne vasi; dobro izobražena, šolana tudi v Celovcu, kjer se je navdušila nad tamburo. V Gribljah je našla može, ki so znali igrati po sluhu — note niso poznali in jih niso potrebovali. Glasbil ni imelo kje stanovati, zato jih je hranil gostilničar Štraus; pri njem so igrali nedeljske nastope, čez poletje na vrtu, igrali pa so tudi v gostilni Jureta Županiča — brata etnologa Nika Županiča. Največ so jih poklicala gasilska veselja; nastopali so v glavnem brezplačno, občinstvo pa jim je naklanilo drobiž za obnovo glasbil in za kako tekočino za suha grla. Ko je leta 1929 pritisnila kriza in so gostilne osiromele, so tamburaši igrali naprej — če ne zaradi drugega, pa zaradi lastnega veselja.\n\nZa muzej je ta zapis dvojni: pripoved o glasbeni kulturi, ki jo je v vas prinesla učiteljica na begu pred veliko zgodovino, in prvo poglavje življenjepisa Nikolaja Dragoša — stoletnika, ki bo dočakal 110 let. Bugarija je bila njegova prva javna vloga; zadnja bo najstarejši Slovenec. Med njimi: Mostar, meja, ujetništvo, milica, upokojitev in sto zim.\n\nFotografije tamburašev obstajajo: v arhivu Nika Dragoša se je ohranil zbor z voditeljico Uršičevo na bisernici — Niko zadaj, drugi z leve — učiteljico v stari gribeljski narodni noši pa hrani Narodna in univerzitetna knjižnica. Leta 1981 je v Gribljah potekalo srečanje pevskih zborov: isto drevo, druga krošnja. Muzej išče: izvode teh fotografij, seznam skladb in imena vseh tamburašev — godba, ki je igrala po sluhu, si zasluži zapis po imenih.",
    storyEn:
      "At the turn of the nineteenth century cultural societies grew up across the Slovene villages and towns — and Griblje got one of its own. It was called Danica, and it kept a tambura band, as such societies usually held a singing, a theatrical and a reading section side by side. In the tambura line stood Griblje's young men and husbands — artisans mostly, who kept music alongside their trade. Niko Dragoš joined them in 1924, seventeen years old, playing the bugarija: the rhythm instrument of the tambura family, in look and role close to a guitar, which holds the beat in a band as the kamra holds the house.\n\nDecisive for the band was a teacher's arrival — a schoolmistress's. Amalija Uršič was a young woman of the Littoral, a refugee from the Kobarid country who had had to leave her home villages before the front of the First World War; well educated, schooled also in Klagenfurt, where she had fallen for the tambura. In Griblje she found men who could play by ear — they did not know notes, and did not need them. The instruments had nowhere to live, so the innkeeper Štraus kept them; at his inn the band played its Sunday performances, in summer in the garden, and it played too at the inn of Jure Županič — brother of the ethnologist Niko Županič. The firemen's dances called them most; they played mostly for free, and the audience tossed them small coin for the repair of instruments and for a liquid for dry throats. When the crisis of 1929 pressed and the inns grew poor, the tambura players played on — if for nothing else, then for their own joy.\n\nFor the museum this record is double: a story of a musical culture brought into the village by a schoolmistress fleeing great history, and the first chapter of the biography of Nikolaj Dragoš — the centenarian who would live to 110. The bugarija was his first public role; the last will be the oldest Slovene. Between them: Mostar, the border, captivity, the militia, retirement and a hundred winters.\n\nPhotographs of the tambura players survive: in Niko Dragoš's archive the band remains with its leader Uršičeva on the bisernica — Niko at the back, second from the left — and the National and University Library holds the schoolmistress portrayed in the old Griblje folk costume. In 1981 a meeting of choirs was held in Griblje: the same tree, another crown. The museum seeks: copies of these photographs, the list of songs and the names of all the players — a band that played by ear deserves to be written down by name.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/tambura.jpg",
    imageCredit:
      "Foto: Jo Dusepo · Wikimedia Commons · CC BY-SA 4.0 — dangubica, tamburaški inštrument",
    yearFrom: 1920,
    yearTo: 1929,
    featured: false,
    sources: [
      {
        key: "odeon-dragos-danica",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Nikolaj Dragoš (tamburaški zbor društva Danica, bugarija)",
        nameEn: "Radio Odeon — People by the Kolpa: Nikolaj Dragoš (the Danica society tambura group, bugarija)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-nikolaj-dragos/",
        noteSi: "Dragošev pobeg v Ljubljano in igranje bugarije v tamburaški skupini društva Danica.",
        noteEn: "Dragoš's flight to Ljubljana and his bugarija in the Danica society's tambura group.",
      },
      {
        key: "rtv-dragos-2013",
        nameSi: "RTV Slovenija — Razglednice preteklosti: 106-letni Niko in mladostna leta ob tamburicah (1. 12. 2013)",
        nameEn: "RTV Slovenija — Postcards of the Past: Niko at 106 and his tambura years (1 Dec 2013)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.rtvslo.si/kultura/razglednice-preteklosti/106-letni-niko-in-mladostna-leta-ob-tamburicah/323956",
        noteSi: "Temeljni vir za tamburaško poglavje: gribeljsko društvo Danica, učiteljica Amalija Uršič (begunka s Kobaridskega, Celovec), gostilni Štraus in Jure Županič, fotografije v arhivu Nika Dragoša in NUK.",
        noteEn: "The foundational source for the tambura chapter: the Griblje Danica society, the schoolmistress Amalija Uršič (a refugee from Kobarid, schooled in Klagenfurt), the inns of Štraus and Jure Županič, photographs in the archives of Niko Dragoš and the NUK.",
      },
      {
        key: "commons-tambura",
        nameSi: "Wikimedia Commons: Dangubica — strunski inštrament tamburaške družine (fotograf: Jo Dusepo)",
        nameEn: "Wikimedia Commons: Dangubica — a string instrument of the tambura family (photographer: Jo Dusepo)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Jo Dusepo)",
        url: WM("Dangubica.jpg"),
        noteSi: "Glavna slika zapisa: tamburaški inštrument — družina, ki ji pripada tudi bugarija.",
        noteEn: "The record's main image: a tambura-family instrument — the family to which the bugarija belongs.",
      },
    ],
  },
  {
    slug: "kopalisce-griblje",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Kopališče Griblje — poletje, ki ima svoj naslov",
    titleEn: "The Griblje bathing place — summer with an address of its own",
    periodSi: "20. stoletje → danes",
    periodEn: "20th century → present",
    summarySi:
      "Kolpa se poleti segreje čez petindvajset stopinj — ob vasi ima poletje svoj naslov: kopališče, trava, senca in Pasuljada. Kopalna reka, ki drži koledar.",
    summaryEn:
      "In summer the Kolpa warms past twenty-five degrees — and summer by the village has an address of its own: the bathing place, grass, shade and the Pasuljada. A swimming river that keeps the calendar.",
    storySi:
      "Slovenija ima eno kopalno reko in ta teče mimo Gribelj. Kolpa se poleti segreje čez petindvajset stopinj — počasi, kot se grejeta vode, ki imajo čas — in ko je enkrat topla, drži toploto do septembra. Ob vasi je ta toplota dobila institucijo: kopališče, torej urejen kos brega, kjer se poletje zbira — trava za brisače, senca za malčke, voda za vse.\n\nKoledar poletja se tu meri v dogodkih: julija rally starodobnih koles (kolesarska sekcija Torpedo), avgusta Pasuljada — tekmovanje v kuhanju pasulja, ki ga Turistično društvo Griblje prireja z Društvom kmečkih žena in prav s kopališčem. Trio nosi isti prostovoljni strojek, ki drži poletno poloblo vasi: kjer se čez dan kopa, se zvečer kuha in pleše.\n\nZa etnologijo je kopališče zanimiv dvojni objekt: naravni (reka) in družbeni (ureditev). Reka je stara koliko jih je; ureditev — kdo je postavil prve slačilne kabine, kdaj je prvič stekel bar, kdo je kosil travo — je sodobna šega, ki se je v dvajsetem stoletju razrasla po vseh obkolpskih vaseh. Griblje so med njimi nosilec enega najdaljših poletij.\n\nMuzej išče ustanovno letnico kopališča, imena tistih, ki so uredili breg, in fotografije kopalnih desetletij — vsaka bo dopolnila poštno sliko poletja, ki jo ta zapis hrani: voda, trava in ljudje, ki znajo počakati toploto.",
    storyEn:
      "Slovenia has one bathing river, and it flows past Griblje. In summer the Kolpa warms past twenty-five degrees — slowly, the way waters that have time get warm — and once warm, it holds its heat into September. By the village this warmth acquired an institution: the bathing place, that is, an ordered stretch of bank where summer gathers — grass for towels, shade for little ones, water for everyone.\n\nThe summer calendar here is measured in events: the vintage-bicycle rally in July (the Torpedo cycling section), the Pasuljada in August — the bean-stew contest the Griblje Tourist Society runs with the Farm Women's Society and the bathing place itself. The trio is carried by the same volunteer crew that holds the village's summer estate: where people swim by day, bean stew cooks and dances by night.\n\nFor ethnology the bathing place is an interesting double object: natural (the river) and social (the ordering). The river is as old as rivers are; the ordering — who set up the first changing cabins, when the bar first ran, who mowed the grass — is a modern custom that spread through all the Kolpa villages in the twentieth century. Among them Griblje carries one of the longest summers.\n\nThe museum seeks the bathing place's founding year, the names of those who put the bank in order, and photographs of the swimming decades — each will complete the postcard of summer this record keeps: water, grass, and people who know how to wait for warmth.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/kopalisce-kolpa.jpg",
    imageCredit:
      "Foto: Uroš Novina · Wikimedia Commons · CC BY 2.0 — kopalna voda Kolpe (Damelj, 4 km dolvodno)",
    yearFrom: 1900,
    featured: false,
    sources: [
      {
        key: "wiki-kolpa-kopalisce",
        nameSi: "Wikipedija: Kolpa (kopalna reka; »Šele pri Gribljah se dolina spet razširi«)",
        nameEn: "Wikipedia: Kolpa (a bathing river; »Only at Griblje does the valley widen again«)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kolpa",
        noteSi: "Kopalna narava reke in razprtje doline pri Gribljah.",
        noteEn: "The river's bathing nature and the widening of the valley at Griblje.",
      },
      {
        key: "odeon-pasuljada-kopalisce",
        nameSi:
          "Radio Odeon (26. 8. 2024): Tradicionalna Pasuljada v Gribljah — 11 ekip, tekmovanje TD Griblje v kuhanju pasulja",
        nameEn: "Radio Odeon (26. 8. 2024): The traditional Pasuljada at Griblje — 11 teams, the Tourist Society Griblje's bean-cooking contest",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/tradicionalna-pasuljada-v-gribljah/",
        noteSi: "Kopališče kot soorganizator poletnih prireditev vasi.",
        noteEn: "The bathing place as co-organiser of the village's summer events.",
      },
      {
        key: "commons-kopalisce",
        nameSi: "Wikimedia Commons: Damelj ob Kolpi — poleti priljubljeno kopališče in kamping (fotograf: Uroš Novina)",
        nameEn: "Wikimedia Commons: Damelj on the Kolpa — a popular swimming and camping place in summer (photographer: Uroš Novina)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: Uroš Novina)",
        url: WM("Damelj_(50053531627).jpg"),
        noteSi: "Glavna slika zapisa: kopalna voda Kolpe pri Damljah, 4 km dolvodno od Gribelj — ista reka, isto poletje.",
        noteEn: "The record's main image: the bathing water of the Kolpa at Damelj, 4 km downstream of Griblje — the same river, the same summer.",
      },
    ],
  },
  {
    slug: "dakota-otok",
    addedAt: "2026-09-16",
    category: "vojna",
    titleSi: "Dakota pri Otoku — letalo, ki je ostalo",
    titleEn: "The Dakota at Otok — the aircraft that stayed",
    periodSi: "1944–1945 → danes",
    periodEn: "1944–1945 → present",
    summarySi:
      "Pri vasi Otok ob Kolpi stoji ohranjeni transportni letalnik Douglas C-47 Dakota — edini primerek v Sloveniji, varuh spomina na belokranjski partizanski letališči.",
    summaryEn:
      "By the village of Otok on the Kolpa stands a preserved Douglas C-47 Dakota transport aircraft — the only example in Slovenia, keeper of the memory of Bela krajina's partisan airfields.",
    storySi:
      "Vojna je ob Kolpi letela ponoči: ranjenci na nosilih, angleški piloti v pogovoru, travniki, označeni z lučmi. Ko se je vojna končala, so luči ugasnile — letala pa niso vsa odletela. Pri Otoku je ostalo eno: Douglas C-47 Dakota, transportno letalo, ki je na belokranjskih partizanskih letališčih nosilo ranjence v italijanske bolnišnice in zavezniške vojne ujetnike proti domu.\n\nDa letalo stoji tam, ni muzejska naključnost: Otok je bil eno od dveh letališč svobodne Bele krajine (drugemu, Krasincu, je posvečen zapis o zračnem mostu). Dakota pri Otoku je edini ohranjeni primerek tega tipa v Sloveniji — kos kovine, ki je dosegel to, česar spomeniki redko: da lahko ob njem stojiš in se z roko dotakneš leta, ki ga ni bilo treba preživeti.\n\nSpomin se ob njem obnavlja vsako pomlad: spominska slovesnost Vranov let se po vojni vojnih zgodovinskih poti vrača k letališčem, kjer so začeli. Za vas ob Kolpi ima slovesnost osebno težo: med ranjenci, ki so od tam odleteli, so bili tudi njihovi — in med tistimi, ki so luči prižigali in gasili, njihovi predniki.\n\nTa zapis je muzejski ključ do triptiha vojnega neba: letališče Otok (spomladi 1944), zavezniška letala nad Gribljami (marec 1945) in zračni most Krasinec (48 ur, 2041 ljudi). Dakota, ki stoji, jih drži skupaj — kakor je držala skupaj neba, po katerih je letela.",
    storyEn:
      "By the Kolpa the war flew at night: the wounded on stretchers, English pilots in conversation, meadows marked with lights. When the war ended, the lights went out — but not all the aircraft flew away. At Otok one remained: a Douglas C-47 Dakota, the transport plane that carried the wounded from Bela krajina's partisan airfields to the hospitals of Italy and Allied prisoners of war towards home.\n\nThat the aircraft stands there is no museum accident: Otok was one of the two airfields of free Bela krajina (the other, Krasinec, has its record in the airlift). The Dakota at Otok is the only preserved example of its type in Slovenia — a piece of metal that achieved what monuments rarely do: beside it you can stand and touch, with a hand, a year you did not have to survive.\n\nThe memory renews itself beside it every spring: the Vranov let memorial ceremony returns along the wartime route to the airfields where it all began. For the village on the Kolpa the ceremony has a personal weight: among the wounded who flew from there were their own — and among those who lit and doused the lights, their ancestors.\n\nThis record is the museum's key to the triptych of the wartime sky: the Otok airfield (spring 1944), the Allied aircraft over Griblje (March 1945) and the Krasinec airlift (48 hours, 2041 people). The Dakota that stands holds them together — as it held together the skies it flew.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/dakota.jpg",
    imageCredit:
      "Foto: Ajznponar · Wikimedia Commons · CC0 — Douglas C-47 Dakota, razstavljen pri Otoku",
    yearFrom: 1944,
    featured: false,
    sources: [
      {
        key: "rtv-dakota",
        nameSi: "RTV SLO — ohranjena dakota C-47 razstavljena pri vasi Otok v Beli krajini (edini primerek v Sloveniji)",
        nameEn: "RTV SLO — the preserved C-47 Dakota displayed by the village of Otok in Bela krajina (the only example in Slovenia)",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/80-let-od-konca-2-svetovne-vojne/odmevi-preteklosti/nenavadna-zgodba-evakuiranih-iz-bele-krajine-pred-koncem-vojne-z-zavezniskimi-letali-v-dalmacijo/743207",
        noteSi: "Dakota pri Otoku kot edini ohranjeni primerek v Sloveniji in varuh spomina na partizanski letališči.",
        noteEn: "The Dakota at Otok as the only preserved example in Slovenia and keeper of the memory of the partisan airfields.",
      },
      {
        key: "commons-dakota",
        nameSi:
          "Wikimedia Commons: Otok, Douglas DC-3 Dakota C-47 Skytrain — letalo, razstavljeno pri Otoku (fotograf: Ajznponar)",
        nameEn:
          "Wikimedia Commons: Otok, Douglas DC-3 Dakota C-47 Skytrain — the aircraft displayed by Otok (photographer: Ajznponar)",
        sourceType: "fotografija",
        license: "CC0 (fotograf: Ajznponar)",
        url: WM("Otok,_Douglas_DC-3_Dakota_C-47_Skytrain_airplane_01.jpg"),
        noteSi:
          "Glavna slika zapisa: edini ohranjeni C-47 v Sloveniji, fotografiran na kraju samem — letalo, ki je ostalo.",
        noteEn:
          "The record's main image: the only preserved C-47 in Slovenia, photographed on the spot — the aircraft that stayed.",
      },
      {
        key: "odeon-vranov-let",
        nameSi:
          "Radio Odeon (27. 9. 2025): Premier Golob na spominski slovesnosti Vranov let — 81. obletnica osvoboditve 87 zavezniških vojnih ujetnikov",
        nameEn:
          "Radio Odeon (27 Sep 2025): PM Golob at the Vranov let memorial ceremony — the 81st anniversary of the liberation of 87 Allied POWs",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/premier-golob-na-spominski-slovesnosti-vranov-let/",
        noteSi:
          "Letna slovesnost na letališču Otok; Golob: majhen narod v Evropi napiše veliko zgodbo.",
        noteEn:
          "The annual ceremony at the Otok airfield; Golob: a small nation can write a great story in Europe.",
      },
      {
        key: "odeon-letalo-sredi-polj",
        nameSi:
          "Radio Odeon (14. 6. 2026): Letalo sredi polj — Dakota stoji v čast partizanskima letališčema Picadilly Hope in Picadilly Hope A",
        nameEn:
          "Radio Odeon (14 Jun 2026): An aircraft amid the fields — the Dakota stands in honour of the Picadilly Hope and Picadilly Hope A partisan airfields",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/letalo-sredi-polj/",
        noteSi:
          "Prek 800 zavezniških pilotov, več kot 2000 žensk, otrok in starejših, 1473 ranjenih partizanov; osvobojeni ujetniki iz Ožbolta so 273 km peš hodili do letališča Otok (odlet 17. 9. 1944).",
        noteEn:
          "Over 800 Allied pilots, more than 2,000 women, children and elderly, 1,473 wounded partisans; the freed Ožbalt prisoners walked 273 km on foot to the Otok airfield (flown out 17 Sep 1944).",
      },
    ],
  },
  {
    slug: "veselko-fotograf",
    addedAt: "2026-09-16",
    category: "vojna",
    titleSi: "Franjo Veselko — oko, ki je videlo reševanje",
    titleEn: "Franjo Veselko — the eye that saw the rescue",
    periodSi: "1943–1945",
    periodEn: "1943–1945",
    summarySi:
      "Profesor zgodovine in geografije, partizanski fotograf vodje fotosekcije propagandne komisije Predsedstva SNOS: ~2000 vojnih posnetkov, med njimi dve fotografiji zavezniških letal nad Gribljami.",
    summaryEn:
      "A teacher of history and geography, the partisan photographer who led the photo section of the SNOS Presidency's propaganda commission: ~2000 wartime photographs, among them two of the Allied aircraft over Griblje.",
    storySi:
      "Nekatere zgodbe tega muzeja so lahko pripovedovane samo zato, ker jih je nekdo posnel. Dve najpomembnejši fotografiji gribeljske vojne zgodovine — ranjeni partizani, ki opazujejo pristajanje zavezniških letal, in pogovor angleškega pilota s partizani, marec 1945 — sta del zapuščine Franja Veselka: profesorja zgodovine in geografije, ki je vojno dočakal kot fotograf.\n\nVeselko je poučeval na partizanski gimnaziji v Črnomlju — šoli, ki je delovala na svobodnem ozemlju sred okupirane Evrope — in vodil fotosekcijo propagandne komisije Predsedstva SNOS: torej enoto, ki je dokumentirala prvi slovenski parlament, zasedanja, zasede in zračne mostove. Njegovih približno dva tisoč posnetkov je danes med temeljnimi viri za zgodovino svobodne Bele krajine; dva od njiju sta v tej zbirki glavni sliki dveh zapisov.\n\nFotografov poklic v vojni ni bil vojaški, ampak pričevalski: kamero je nosil tja, kjer se je odločalo o tem, kaj bo ostalo vidno. Da je marca 1945 obstal ob polju pri Gribljah, ko so ranjenci čakali na letalo, pomeni, da je muzej dobil svojo najredkejšo vrsto vira: trenutek, ki ga ni nihče režiral.\n\nTa zapis je muzejev dolg do roke, ki je pritisnila na sprožilec. Profesor Veselko je po vojni poučeval zgodovino — predmet, ki ga je sam delal. Vsak, ki pozna njegovo pot po letu 1945, je vabljen kot priča: oko, ki je videlo reševanje, si zasluži tudi epilog.",
    storyEn:
      "Some of this museum's stories can be told only because someone photographed them. The two most important photographs of Griblje's war history — the wounded partisans watching the Allied aircraft land, and the conversation between an English pilot and the partisans, March 1945 — are part of the legacy of Franjo Veselko: a teacher of history and geography who ended the war as a photographer.\n\nVeselko taught at the Partisan gymnasium in Črnomelj — a school that worked on free territory in the middle of occupied Europe — and led the photo section of the SNOS Presidency's propaganda commission: in effect the unit that documented the first Slovene parliament, its sessions, the ambushes and the airlifts. His roughly two thousand photographs are today among the foundational sources for the history of free Bela krajina; two of them are the main images of two records in this collection.\n\nThe photographer's calling in war was not military but testimonial: he carried the camera where it was being decided what would remain visible. That he stood still by the field at Griblje in March 1945, as the wounded waited for an aircraft, means the museum received its rarest kind of source: a moment nobody staged.\n\nThis record is the museum's debt to the hand behind the shutter. Professor Veselko taught history after the war — the subject he had himself been making. Anyone who knows his path after 1945 is invited as a witness: the eye that saw the rescue deserves an epilogue too.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/veselko-fotoaparat.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — fotograf s fotoaparatom (ilustracija obrti)",
    yearFrom: 1943,
    yearTo: 1945,
    featured: false,
    sources: [
      {
        key: "voncina-veselko",
        nameSi: "A. Vončina: Franjo Veselko — profesor, partizanski fotograf (Prispevki za novejšo zgodovino, letnik 50, št. 3, 2010)",
        nameEn: "A. Vončina: Franjo Veselko — teacher, partisan photographer (Contributions to Contemporary History, vol. 50, no. 3, 2010)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.sistory.si/publikacije/",
        noteSi: "Življenjepis: profesor zgodovine in geografije, fotosekcija propagandne komisije Predsedstva SNOS, ~2000 posnetkov, partizanska gimnazija v Črnomlju.",
        noteEn: "The biography: teacher of history and geography, the SNOS Presidency's propaganda commission photo section, ~2000 photographs, the Partisan gymnasium in Črnomelj.",
      },
      {
        key: "commons-veselko-foto",
        nameSi: "Wikimedia Commons: Ranjeni partizani opazujejo pristajanje zavezniških letal, Griblje, marec 1945 (Franjo Veselko)",
        nameEn: "Wikimedia Commons: Wounded partisans watching Allied aircraft land, Griblje, March 1945 (Franjo Veselko)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Ranjeni_partizani_opazujejo_pristajanje_zavezni%C5%A1kih_letal,_Griblje_pri_%C4%8Crnomlju,_marec_1945.jpg"),
        noteSi: "Veselkov posnetek kot glavna slika zapisa o evakuaciji 1945 — dokument in umetnina hkrati.",
        noteEn: "Veselko's shot as the main image of the record of the 1945 evacuation — document and work at once.",
      },
      {
        key: "commons-veselko-pilot",
        nameSi: "Wikimedia Commons: Pogovor angleškega pilota s partizani, Griblje, marec 1945 (Franjo Veselko)",
        nameEn: "Wikimedia Commons: An English pilot in conversation with partisans, Griblje, March 1945 (Franjo Veselko)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Pogovor_angle%C5%A1kega_pilota_s_partizani,_Griblje_pri_%C4%8Crnomlju,_marec_1945.jpg"),
        noteSi: "Drugi Veselkov posnetek pri Gribljah — glavna slika zapisa o zračnem mostu.",
        noteEn: "Veselko's second shot at Griblje — the main image of the airlift record.",
      },
      {
        key: "commons-fotoaparat",
        nameSi: "Wikimedia Commons: Moški s fotoaparatom, v ozadju gospodarska poslopja (Fran Vesel)",
        nameEn: "Wikimedia Commons: A man with a camera, farm buildings behind (Fran Vesel)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Mo%C5%A1ki_s_fotoaparatom,_v_ozadju_gospodarska_poslopja.jpg"),
        noteSi: "Glavna slika zapisa: fotograf s fotoaparatom — ilustracija obrti, ki jo je v vojni nosil Franjo Veselko.",
        noteEn: "The record's main image: a photographer with a camera — an illustration of the craft Franjo Veselko carried through the war.",
      },
    ],
  },
  {
    slug: "zracni-most-krasinec",
    addedAt: "2026-09-16",
    category: "vojna",
    titleSi: "Zračni most Krasinec — 2041 ljudi v 48 urah",
    titleEn: "The Krasinec airlift — 2041 people in 48 hours",
    periodSi: "25.–26. marec 1945",
    periodEn: "25–26 March 1945",
    summarySi:
      "V dveh nočeh so zavezniške dakote in spitfiri s partizanskega letališča Krasinec prepeljale 2041 ljudi — ranjence, otroke in zavezniške letalce; med njimi pisateljico Almo Karlin.",
    summaryEn:
      "In two nights Allied Dakotas and Spitfires flew 2041 people from the partisan airfield of Krasinec — the wounded, children and Allied airmen; among them the writer Alma Karlin.",
    storySi:
      "Največje reševanje zrakom na slovenskih tleh se je odvilo v dveh nočeh. 25. in 26. marca 1945 so z letališča Krasinec — travnika ob Kolpi, ki so ga partizani uredili za zavezniška letala — vzletala transportna letala Douglas C-47 Dakota, spremljana od lovcev Spitfire, in v 48 urah prepeljala 2041 ljudi: težje ranjence, otroke iz begunskih taborišč, zavezniške vojne ujetnike in posameznike, ki jih je okupator iskal po imenu.\n\nMed evacuiranci je bila tudi Alma Karlin — popotovalka in pisateljica iz Celja, ki je med vojno živela skrita pod tujo identiteto. Ženska, ki je pred prvo svetovno vojno obkrožila svet, je drugo preživela v prikritosti na Slovenskem; zadnje velike poti ni opravila po lastni izbiri — a opravila jo je z letališča, ki ga je zidala ista svoboda, ki jo je opisovala v knjigah. Umrla je kmalu po vojni, izčrpana od poti, ki jih svet ni nikoli povsem priznal.\n\nZgodbo nosi knjiga Zračni most (Ilinka Todorovski, 2025), natisnjena ob osemdesetletnici; RTV Slovenija jo je ob obletnici spomladi 2025 pripovedovala naprej. Za Griblje je zračni most soseda usode: letališče Krasinec je bilo drugo od belokranjskih letališč, zavezniška letala pa so pristajala tudi nad gribeljskimi polji — ohranjene fotografije iz marca 1945 so v tej zbirki.\n\nZapis drži spomin na logistiko reševanja: koliko letal, koliko poletov, koliko litrov goriva na travniku. A njegovo težo nosijo številke, ki jih ni mogoče sešteti: 2041 ljudi, ki so v dveh nočeh zamenjali vojno za mir — in eno reko, ki je bila vse to časa najtišja meja svobode.",
    storyEn:
      "The greatest airborne rescue on Slovene soil took place in two nights. On 25 and 26 March 1945, from the airfield of Krasinec — a meadow by the Kolpa the partisans had readied for Allied aircraft — Douglas C-47 Dakota transports took off, escorted by Spitfire fighters, and in 48 hours carried away 2041 people: the gravely wounded, children from refugee camps, Allied prisoners of war, and individuals the occupier was hunting by name.\n\nAmong the evacuated was Alma Karlin — the traveller and writer from Celje who had lived the war hidden under a false identity. The woman who had circled the world before the First World War survived the second in concealment in Slovenia; the last of her great journeys she did not make by her own choice — but she made it from an airfield built by the same freedom she had described in her books. She died soon after the war, worn out by journeys the world never fully acknowledged.\n\nThe story is carried by the book Zračni most (Ilinka Todorovski, 2025), printed for the eightieth anniversary; RTV Slovenija told it onward in spring 2025. For Griblje the airlift is a neighbour of fate: the Krasinec airfield was the second of Bela krajina's airfields, and the Allied aircraft also landed above the fields of Griblje — the surviving photographs of March 1945 are in this collection.\n\nThe record keeps the memory of the rescue's logistics: how many aircraft, how many flights, how many litres of fuel on a meadow. But its weight is carried by numbers that cannot be added: 2041 people who in two nights exchanged war for peace — and one river that was, all that time, the quietest border of freedom.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/zracni-most.jpg",
    imageCredit:
      "Foto: Franjo Veselko, marec 1945 · Wikimedia Commons · javna last — pogovor angleškega pilota s partizani pri Gribljah",
    yearFrom: 1945,
    yearTo: 1945,
    featured: false,
    sources: [
      {
        key: "rtv-zracni-most",
        nameSi:
          "RTV SLO (27. 4. 2025): Nenavadna zgodba evakuiranih iz Bele krajine pred koncem vojne — z zavezniškimi letali v Dalmacijo; 2041 ljudi iz Krasinca v 48 urah; knjiga Ilinke Todorovski Zračni most (2025); Alma Karlin med evakuiranci",
        nameEn:
          "RTV SLO (27 Apr 2025): The unusual story of those evacuated from Bela krajina before the war's end — by Allied aircraft to Dalmatia; 2041 people from Krasinec in 48 hours; Ilinka Todorovski's book Zračni most (2025); Alma Karlin among the evacuees",
        sourceType: "spletni-vir",
        license: "navedi vir / cite the source",
        url: "https://www.rtvslo.si/80-let-od-konca-2-svetovne-vojne/odmevi-preteklosti/nenavadna-zgodba-evakuiranih-iz-bele-krajine-pred-koncem-vojne-z-zavezniskimi-letali-v-dalmacijo/743207",
        noteSi: "Število evakuirancev, časovni okvir, tipi letal in usoda Alme Karlin.",
        noteEn: "The number of evacuees, the time frame, the aircraft types and Alma Karlin's fate.",
      },
      {
        key: "commons-zracni-most",
        nameSi: "Wikimedia Commons: Pogovor angleškega pilota s partizani, Griblje pri Črnomlju, marec 1945 (Franjo Veselko)",
        nameEn: "Wikimedia Commons: An English pilot in conversation with partisans, Griblje near Črnomelj, March 1945 (Franjo Veselko)",
        sourceType: "fotografija",
        license: "Public domain",
        url: WM("Pogovor_angle%C5%A1kega_pilota_s_partizani,_Griblje_pri_%C4%8Crnomlju,_marec_1945.jpg"),
        noteSi: "Glavna slika zapisa: marec 1945 pri Gribljah — trenutek istega zračnega mostu, ki je vrh doživel v Krasincu.",
        noteEn: "The record's main image: March 1945 at Griblje — a moment of the same airlift that reached its peak at Krasinec.",
      },
      {
        key: "wiki-alma-karlin",
        nameSi: "Wikipedija: Alma Karlin (pisateljica in popotnica, evakuirana marca 1945)",
        nameEn: "Wikipedia: Alma Karlin (writer and traveller, evacuated in March 1945)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Alma_Karlin",
        noteSi: "Življenjepis: pot okoli sveta, vojna v prikritosti, izčrpanost po vojni.",
        noteEn: "The biography: the journey around the world, the war in concealment, the exhaustion after the war.",
      },
    ],
  },
  {
    slug: "matija-totter",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Jandreč Matiček — kmet, ki je zapisoval vas",
    titleEn: "Jandreč Matiček — the farmer who wrote the village down",
    periodSi: "1873–1950 · Griblje — Teksas",
    periodEn: "1873–1950 · Griblje — Texas",
    summarySi:
      "Peti od osmih otrok pri Jandrečih je namesto v gostilno sedel pod tepko in zapisoval šege. Kar je zapisal, je rešilo belokranjske običaje; kam je odšel, je Teksas.",
    summaryEn:
      "The fifth of eight children at the Jandreči farm sat under the house bench writing down customs instead of going to the inn. What he wrote rescued Bela krajina's customs; where he went was Texas.",
    storySi:
      "Matija Totter — po domače Jandreč Matiček — se je rodil 7. februarja 1873 v Gribljah kot peti od osmih otrok Marjete (rojene Štrucelj) in Andreja Totterja. Vaščani so ga kmalu imeli za čudaka: medtem ko so drugi fantje v nedeljo zahajali v gostilno in na plese, je on najraje sedel pod domačo tepko, prebiral knjige in zapisoval pregovore, šege in običaje.\n\nNjegov učitelj zbiranja je bil otroški prijatelj Janko Barle, takrat semeniščnik v Zagrebu; dopisovala sta si leta. Po njegovem navodilu je Matiček pridno popisoval zanimivosti narodnih običajev: za Barleta je zapisal pirovske — ženitovanjske — običaje v Beli krajini, navade pastirjev ob praznovanju »križevega« in običaj kresovanja z besedilom kresne pesmi. Zapisal jih je tudi sovaščanu, etnologu dr. Niku Zupaniču — Švarskemu, ki se mu je zahvalil v Slovenskem etnografu. Nekateri od teh običajev so v pozemeljski fari kmalu zatem ugasnili — ostali so le njegovi zapisi.\n\nStar šestnajst let se je odločil za šolanje in se peš odpravil v Novo mesto, da bi se vpisal v nižjo gimnazijo. Ker ni imel sredstev, je zaprosil frančiškane za hrano in stanovanje; dobrodušni opat Florentin Hrovat ga je zavregel — prestar naj bi bil za začetek šolanja — in mu svetoval hlapčevanje. Matiček se je odločil za Ameriko: pridružil se je starejšemu bratu Jakobu, cerkovniku v slovenski cerkvi v St. Paulu v Minnesoti, kasneje pa si uredil dom v toplejšem Teksasu. Z mlajšim bratom Janezom je najela farmo bombaža in odprla trgovino v mestecu Saragosa; z ženo Angležinjo Agnes je imel osem otrok. Najmlajši sin, prof. dr. John Randolph Totter, je postal svetovno znani biokemik, ki je za Atomic Energy Commission vodil raziskavo posledic atomskih bomb nad Hirošimo in Nagasakijem.\n\nDomači koren tega zapisa je ženski: Matijeva mati Marjeta, rojena Štrucelj, je bila vaška babica — pri njeni pomoči je leta 1907 prišel na svet tudi Niko Dragoš, najstarejši Slovenec. Hiša, ki je dala popisovalca šeg, je z rokami iste ženske sprejemala tudi rojstva.\n\nV Slovenijo se Matija nikoli več ni vrnil — do smrti 17. marca 1950 v Balmorhei je ohranjal stike z Zupaničem in Barletom. O družini je Županič zapisal: »Jandrečim ne dišita plug in motika, pač pa imajo raje knjigo in gosli.« Danes na Jandrečetovi domačiji ekološko kmetuje Ciril Totter — uspešen maratonc. Muzej išče Matičkove zapiske in pisma: vsak list bi vrnil glas fantu pod tepko.",
    storyEn:
      "Matija Totter — Jandreč Matiček at home — was born on 7 February 1873 in Griblje, the fifth of eight children of Marjeta (née Štrucelj) and Andrej Totter. The villagers soon took him for an oddity: while the other boys went to the inn and to dances on Sundays, he preferred to sit under the house bench, read books, and write down proverbs, customs and habits.\n\nHis teacher in collecting was his childhood friend Janko Barle, then a seminarian in Zagreb; they corresponded for years. On Barle's instruction Matiček diligently recorded the curiosities of folk custom: for Barle he wrote down the wedding customs of Bela krajina, the shepherds' ways of celebrating the 'križevo' festival, and the bonfire custom of kresovanje with the text of the bonfire song. He sent records also to his fellow villager, the ethnologist dr. Niko Županič, who thanked him in the Slovene Ethnographer. Some of these customs soon died out in the Podzemelj parish — only his notes remained.\n\nAt sixteen he decided on schooling and set out on foot for Novo mesto to enrol in the lower gymnasium. Having no money, he asked the Franciscans for food and lodging; the kindly abbot Florentin Hrovat turned him away — too old, he said, to begin schooling — and advised him to hire out as a farmhand. Matiček chose America: he joined his elder brother Jakob, caretaker of a Slovene church in St. Paul, Minnesota, and later made his home in warmer Texas. With his younger brother Janez he rented a cotton farm and opened a store in the little town of Saragosa; with his English wife Agnes he raised eight children. The youngest son, prof. dr. John Randolph Totter, became a world-famous biochemist who led the Atomic Energy Commission's research into the consequences of the atomic bombs over Hiroshima and Nagasaki.\n\nThe domestic root of this record is a woman's: Matija's mother Marjeta, née Štrucelj, was the village midwife — with her help Niko Dragoš, the oldest Slovene, came into the world in 1907. The house that gave the recorder of customs received, by the same woman's hands, the births as well.\n\nMatija never returned to Slovenia — until his death on 17 March 1950 in Balmorhea he kept in touch with Županič and Barle. Of the family Županič wrote: 'Plough and hoe hold no charm for the Jandreči — they prefer the book and the fiddle.' Today Ciril Totter — a successful marathon runner — farms ecologically at the Jandreči homestead. The museum seeks Matiček's notebooks and letters: every page would give back a voice to the boy under the bench.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/balmorhea.jpg",
    imageCredit:
      "Foto: Larry D. Moore · Wikimedia Commons · CC BY 4.0 — izviri San Solomon Springs v Balmorhei (Teksas), kjer je Matija Totter preživel drugo polovico življenja",
    yearFrom: 1873,
    yearTo: 1950,
    featured: false,
    sources: [
      {
        key: "odeon-totter",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Matija Totter (življenjepis Jandreč Matička)",
        nameEn: "Radio Odeon — People by the Kolpa: Matija Totter (the biography of Jandreč Matiček)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-matija-totter/",
        noteSi: "Rojstvo pri Jandrečih, zbiranje za Barleta in Zupaniča, zavrnitev v Novem mestu, odhod v Ameriko, družina v Teksasu.",
        noteEn: "Birth at the Jandreči, collecting for Barle and Županič, the refusal in Novo mesto, emigration, the Texas family.",
      },
      {
        key: "wiki-griblje-tottrovi",
        nameSi: "Wikipedija: Griblje (družina Totter / Jandreči)",
        nameEn: "Wikipedia: Griblje (the Totter / Jandreči family)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Zaselka Dolnje in Gornje Griblje ter izseljenska veja Jandrečev v Združenih državah.",
        noteEn: "The hamlets of Dolnje and Gornje Griblje and the emigrant Jandreči branch in the United States.",
      },
      {
        key: "commons-balmorhea",
        nameSi: "Wikimedia Commons: izviri San Solomon Springs v Balmorhei (fotograf: Larry D. Moore)",
        nameEn: "Wikimedia Commons: the San Solomon Springs at Balmorhea (photographer: Larry D. Moore)",
        sourceType: "fotografija",
        license: "CC BY 4.0 (fotograf: Larry D. Moore)",
        url: WM("Balmorhea_cienaga_2009.jpg"),
        noteSi: "Glavna slika zapisa: puščavski izviri kraja, kjer je kmet-zapisovalec umrl — zrcalo gribeljskih studencev.",
        noteEn: "The record's main image: desert springs of the town where the farmer-recorder died — a mirror of Griblje's springs.",
      },
      {
        key: "rtv-dragos-2013-maticna",
        nameSi: "RTV Slovenija — Razglednice preteklosti: 106-letni Niko (1. 12. 2013) — vaška babica Marjeta Totter",
        nameEn: "RTV Slovenija — Postcards of the Past: Niko at 106 (1 Dec 2013) — the village midwife Marjeta Totter",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.rtvslo.si/kultura/razglednice-preteklosti/106-letni-niko-in-mladostna-leta-ob-tamburicah/323956",
        noteSi: "Vaška babica Marjeta Totter je pomagala na svet številnim dojenčkom v okolici — med njimi Niku Dragošu.",
        noteEn: "The village midwife Marjeta Totter helped numerous babies of the neighbourhood into the world — among them Niko Dragoš.",
      },
    ],
  },
  {
    slug: "janko-barle",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Janko Barle — zapisovalec Bele krajine",
    titleEn: "Janko Barle — the chronicler of Bela krajina",
    periodSi: "1869–1941 · Budanje — Podzemelj — Zagreb",
    periodEn: "1869–1941 · Budanje — Podzemelj — Zagreb",
    summarySi:
      "Duhovnik, etnolog, botanik in glasbenik, ki je otroštvo preživel ob Kolpi v Podzemlju. Zbral 3.000 slovenskih imen rastlin — in s pomočjo gribeljskega Matička zapisal belokranjske šege.",
    summaryEn:
      "A priest, ethnologist, botanist and musician who spent his childhood by the Kolpa at Podzemelj. He gathered 3,000 Slovene plant names — and, helped by Griblje's Matiček, wrote down the customs of Bela krajina.",
    storySi:
      "Janko Barle — duhovnik, zgodovinar, etnolog, botanik, glasbenik, pesnik, pisatelj in akademik — se je rodil 12. marca 1869 v Budanjah v Vipavski dolini, umrl pa 18. februarja 1941 v Zagrebu. Njegov oče Ivan, učitelj in organist, je dvakrat služboval v Podzemlju, kamor se je družina preselila leta 1872. Tukaj je Janko končal štiri razrede ljudske šole — in tu je Bela krajina vtisnila v njega spomin, ki ga ni izpustil do konca življenja: »Svojo mladost preživel sem ob reki Kolpi. Srečna, lepa leta.«\n\nPo gimnaziji v Novem mestu, Karlovcu in Zagrebu (1879–1887) je študiral bogoslovje in bil leta 1892 posvečen. V Zagrebu je postal nadškofov tajnik, vodja nadškofijske pisarne in kanonik; leta 1921 je bil izvoljen za dopisnega člana Jugoslovanske akademije znanosti in umetnosti. Kot glasbeni zgodovinar in urednik revije Sv. Cecilija je veljal za reformatorja hrvaške cerkvene glasbe — orgle v njegovem zapisu pa niso sama glasba: so delo vsega njegovega dvojnega življenja med Zagrebom in slovenstvom.\n\nZa Belo krajino in Griblje je pomembnejše njegovo etnološko delo. Že kot mlad je objavil Ženitovanjske običaje Belih Kranjcev (1889) in Pisanice iz Bele Krajine (1893); pesmice in pripovedke, ki jih je zbral po vaseh — med drugim s pomočjo prijatelja iz otroštva, gribeljskega Matije Totterja — je Karel Štrekelj vključil v zbirko Slovenske narodne pesmi. Njegovo življenjsko delo na slovenski strani pa so Prinosi slovenskim nazivom bilja I–II (1936–1937): iz rokopisnih zdravilskih in lekarniških knjig je zbral in uredil 3.000 slovenskih poimenovanj rastlin, natančno lokaliziranih, z zapisano rabo, vražami in recepti. Tam, kjer sta pred njim končala Valvasor in Žiga Zois, je Barle nadaljeval — pionirsko delo slovenskega imenoslovja, etnobotanike in etnomedicine.\n\nBarle ni bil edini v družini, ki je zapisoval belokranjski svet. Brat Konrad (1875–1951), rojen v Podzemlju med očetovim učiteljevanjem, je postal učitelj, čebelar in upravitelj šole v Metliki; pisal je v Slovenski čebelar in bil med soustanovitelji Belokranjskega muzeja, kateremu je skupaj z Božom Račičem in Jožetom Dularjem uredil prvo zbirko. Dva brata iz obkolpske učiteljske hiše: eden je zapisoval rastline in pesmi, drugi čebele in muzeje.\n\nMuzej hrani Barleta kot zgled: raziskovalec, ki je zapustil dom, pa domače navade zapisal, preden so ugasnile. Iščemo njegova pisma Matičku iz Gribelj — korespondenco, iz katere je zrasla polovica tega, kar o belokranjskih šegah vemo.",
    storyEn:
      "Janko Barle — priest, historian, ethnologist, botanist, musician, poet, writer and academic — was born on 12 March 1869 in Budanje in the Vipava valley and died on 18 February 1941 in Zagreb. His father Ivan, a teacher and organist, served twice at Podzemelj, to which the family moved in 1872. There Janko finished four grades of primary school — and there Bela krajina pressed into him a memory it never released: 'My youth I spent by the river Kolpa. Happy, beautiful years.'\n\nAfter gymnasium in Novo mesto, Karlovac and Zagreb (1879–1887) he studied theology and was ordained in 1892. In Zagreb he became the archbishop's secretary, head of the archiepiscopal office and a canon; in 1921 he was elected a corresponding member of the Yugoslav Academy of Sciences and Arts. As a music historian and editor of the review Sv. Cecilija he was counted the reformer of Croatian church music — the organ in this record is not music alone: it is the work of his whole double life between Zagreb and Slovenehood.\n\nFor Bela krajina and Griblje his ethnological work matters more. Already as a young man he published the Wedding Customs of the White Carniolans (1889) and The Pisanice of Bela krajina (1893); the songs and tales he gathered in the villages — helped among others by his childhood friend, Griblje's Matija Totter — Karel Štrekelj included in the collection Slovene Folk Songs. His life's work on the Slovene side, however, is the Contributions to Slovene Plant Names I–II (1936–1937): from manuscript healing and apothecary books he collected and edited 3,000 Slovene names of plants, precisely localised, with their uses, superstitions and recipes. Where Valvasor and Žiga Zois before him had stopped, Barle continued — pioneering work of Slovene onomastics, ethnobotany and ethnomedicine.\n\nBarle was not the only one in his family to write down the world of Bela krajina. His brother Konrad (1875–1951), born at Podzemelj during their father's teaching years, became a teacher, a beekeeper and the head of the Metlika school; he wrote for the Slovenski čebelar and was among the founders of the Bela krajina Museum, for which he arranged the first collection together with Božo Račič and Jože Dular. Two brothers from a teaching house by the Kolpa: one wrote down plants and songs, the other bees and museums.\n\nThe museum keeps Barle as an example: a scholar who left home yet wrote down its customs before they went out. We seek his letters to Griblje's Matiček — the correspondence from which half of what we know about Bela krajina's customs grew.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/orgle.jpg",
    imageCredit:
      "Foto: Hans-Jörg Gemeinholzer · Wikimedia Commons · CC BY-SA 4.0 — orgle v stolni cerkvi v Splitu (ilustrativna slika: svet cerkvene glasbe, ki jo je Barle prenavljal)",
    yearFrom: 1869,
    yearTo: 1941,
    featured: false,
    sources: [
      {
        key: "odeon-barle",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Janko Barle (življenjepis in dela)",
        nameEn: "Radio Odeon — People by the Kolpa: Janko Barle (life and works)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-janko-barle/",
        noteSi: "Otroštvo v Podzemlju, šolanje, Zagreb, cerkvena glasba, etnološke študije in Prinosi slovenskim nazivom bilja.",
        noteEn: "Childhood at Podzemelj, schooling, Zagreb, church music, ethnological studies and the Contributions to Slovene plant names.",
      },
      {
        key: "ro-konrad-barle-2026",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Konrad Barle, učitelj in čebelar (19. 2. 2026)",
        nameEn: "Radio Odeon — People by the Kolpa: Konrad Barle, teacher and beekeeper (19 February 2026)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/novice/ljudje-ob-kolpi-konrad-barle-1/",
        noteSi: "Jankov brat Konrad (1875–1951): rojen v Podzemlju, učitelj in upravitelj šole v Metliki, poročevalec Slovenskega čebelarja, soustanovitelj Belokranjskega muzeja.",
        noteEn: "Janko's brother Konrad (1875–1951): born at Podzemelj, teacher and head of the Metlika school, correspondent of the Slovenski čebelar, co-founder of the Bela krajina Museum.",
      },
      {
        key: "barle-pisanice-1893",
        nameSi: "Bibliografija: Janko Barle, »Pisanice iz Bele Krajine«, Izvestja Muzejskega društva za Kranjsko 3 (1893), str. 233–240",
        nameEn: "Bibliography: Janko Barle, 'Pisanice iz Bele Krajine', Izvestja Muzejskega društva za Kranjsko 3 (1893), pp. 233–240",
        sourceType: "objava",
        license: "bibliografski citat",
        noteSi: "Prva znanstvena obdelava belokranjskih pisanic; gradivo je zbral tudi po vaseh ob Kolpi.",
        noteEn: "The first scholarly treatment of the Bela krajina Easter eggs; material gathered in the Kolpa villages.",
      },
      {
        key: "commons-orgle",
        nameSi: "Wikimedia Commons: orgle stolne cerkve v Splitu (fotograf: Hans-Jörg Gemeinholzer)",
        nameEn: "Wikimedia Commons: the organ of Split Cathedral (photographer: Hans-Jörg Gemeinholzer)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Hans-Jörg Gemeinholzer)",
        url: WM("Split_Cathedral_Organ_(3).jpg"),
        noteSi: "Glavna slika zapisa: orgle — svet glasbe, v kateri je Barle delal in pisal.",
        noteEn: "The record's main image: the organ — the world of music in which Barle worked and wrote.",
      },
    ],
  },
  {
    slug: "joze-dular",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Jože Dular — trideset let Belokranjskega muzeja",
    titleEn: "Jože Dular — thirty years of the Bela krajina museum",
    periodSi: "1915–2000 · Vavta vas — Metlika",
    periodEn: "1915–2000 · Vavta vas — Metlika",
    summarySi:
      "Muzealec, pesnik in pisatelj, ki je trideset let vodil Belokranjski muzej v Metliki — in napisal knjižico o Županičevi spominski plošči v Gribljah.",
    summaryEn:
      "Museum man, poet and writer who led the Bela krajina museum in Metlika for thirty years — and wrote the booklet about Županič's memorial plaque in Griblje.",
    storySi:
      "Jože Dular — muzealec, pesnik in pisatelj — se je rodil 24. februarja 1915 v Vavti vasi, umrl pa 31. januarja 2000 v Metliki. Po maturi na novomeški gimnaziji je študiral slavistiko, romanistiko in primerjalno književnost na ljubljanski Filozofski fakulteti, kjer je diplomiral leta 1941. Delal je kot urednik in profesor; leta 1951 je bil imenovan za direktorja Belokranjskega muzeja v Metliki — in na tem mestu ostal nadaljnjih trideset let.\n\nDular je bil pesnik nove romantike (zbirke Zveste menjave, Trepetajoča luč, Dobra je ta zemlja) in pripovednik (Ljudje ob Krki, Krka umira, Jandre, Udari na gudalo), a njegov najgloblji pečat je krajevna zgodovina: Metlika skozi stoletja, Semič v Beli krajini, Adlešiči v Beli krajini, zgodovina metliškega gasilstva in mestne godbe, Pomembni Belokranjci, Svetila v Beli krajini. Za Kolpo in njene mline je pisal v knjigi Mlini ob Kolpi umirajo; za Griblje pa je najpomembnejša knjižica dr. Niko Županič. Ob odkritju njegove spominske plošče v Gribljah v Beli krajini — dokument o plošči, ki jo je leta 1973 postavilo Belokranjsko muzejsko društvo.\n\nTo društvo namreč ni bila tuja ustanova: Dular je bil njegov ustanovni član in dolgoletni predsednik. Ista roka, ki je postavila Županičevo ploščo v Gribljah, je leta 2001 — leto po Dularjevi smrti — postavila spominsko ploščo njemu samemu, na hiši v Metliki, kjer je živel triinpetdeset let. Častni občan Metlike in Novega mesta, častni član Slavističnega društva — in poklicni varuh vsega, kar ima Bela krajina za povedati.\n\nZakaj je v muzeju vasi Griblje? Ker je ta muzej lahko le zato, ker so pred njim sto let drugi zapisovali, hranili in razstavljali. Dular je zgradil hišo, v kateri belokranjski spomin preživlja; naša zbirka je ena od njenih sob. Iščemo Dularjevo knjižico o Županičevi plošči — morda z avtorsko posvetilom.",
    storyEn:
      "Jože Dular — museum man, poet and writer — was born on 24 February 1915 in Vavta vas and died on 31 January 2000 in Metlika. After matriculating at the Novo mesto gymnasium he studied Slavistics, Romance studies and comparative literature at the Ljubljana Faculty of Arts, graduating in 1941. He worked as editor and teacher; in 1951 he was appointed director of the Bela krajina museum in Metlika — and stayed in the post for the next thirty years.\n\nDular was a poet of the new romanticism (the collections Faithful Changes, Trembling Light, This Earth Is Good) and a storyteller (People by the Krka, The Krka Is Dying, Jandre, Stroke of the Bow), but his deepest mark is local history: Metlika through the Centuries, Semič in Bela krajina, Adlešiči in Bela krajina, the history of Metlika's fire brigade and town band, Important People of Bela krajina, Lights of Bela krajina. Of the Kolpa and its mills he wrote in the book The Mills by the Kolpa Are Dying; for Griblje the most important booklet is dr. Niko Županič. On the Unveiling of His Memorial Plaque in Griblje in Bela krajina — the document of the plaque that the Bela krajina museum society set up in 1973.\n\nThat society, indeed, was no distant institution: Dular was its founding member and long-time president. The same hand that raised Županič's plaque in Griblje raised one in 2001 — a year after Dular's death — for Dular himself, on the Metlika house where he had lived for fifty-three years. Honorary citizen of Metlika and Novo mesto, honorary member of the Slavistic Society — and professional keeper of everything Bela krajina has to tell.\n\nWhy is he in the museum of the village of Griblje? Because this museum can exist only because others wrote, kept and exhibited for a hundred years before it. Dular built the house in which the Bela krajina memory survives; our collection is one of its rooms. We seek Dular's booklet on Županič's plaque — perhaps with an author's dedication.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/dular-muzej.jpg",
    imageCredit:
      "Foto: neznani avtor · Wikimedia Commons · javna last — lapidarij Belokranjskega muzeja v cerkvi sv. Martina v Metliki, hiša, ki jo je Dular vodil trideset let",
    yearFrom: 1915,
    yearTo: 2000,
    featured: false,
    sources: [
      {
        key: "odeon-dular",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Jože Dular (življenjepis in bibliografija)",
        nameEn: "Radio Odeon — People by the Kolpa: Jože Dular (life and bibliography)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-joze-dular/",
        noteSi: "Trideset let Belokranjskega muzeja, pesniške zbirke, krajevna zgodovina, spominska plošča 2001.",
        noteEn: "Thirty years of the Bela krajina museum, poetry collections, local history, the 2001 memorial plaque.",
      },
      {
        key: "dular-zupanic-knjizica",
        nameSi: "Bibliografija: Jože Dular, »Dr. Niko Županič. Ob odkritju njegove spominske plošče v Gribljah v Beli krajini«",
        nameEn: "Bibliography: Jože Dular, 'Dr. Niko Županič. On the Unveiling of His Memorial Plaque in Griblje in Bela krajina'",
        sourceType: "objava",
        license: "bibliografski citat",
        noteSi: "Dularjeva knjižica o Županičevi plošči v Gribljah — vez med poklicnim muzejem in vasjo.",
        noteEn: "Dular's booklet on Županič's plaque in Griblje — the bond between the professional museum and the village.",
      },
      {
        key: "commons-muzej-metlika",
        nameSi: "Wikimedia Commons: lapidarij Belokranjskega muzeja v cerkvi sv. Martina v Metliki",
        nameEn: "Wikimedia Commons: the lapidarium of the Bela krajina museum in the church of St. Martin, Metlika",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("Metlika,_Belokranjski_muzej;_lapidarij_v_cerkvi_sv_._Martina;_nagrobnik_1626_umrlega_Andreja_Butgstahla_iz_gradu_Krupa.jpg"),
        noteSi: "Glavna slika zapisa: muzej, ki ga je Dular vodil od 1951 — prostor, kjer belokranjski spomin živi.",
        noteEn: "The record's main image: the museum Dular led from 1951 — the room where the Bela krajina memory lives.",
      },
    ],
  },
  {
    slug: "pisanice",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Belokranjske pisanice — pomlad, ki jo narišemo",
    titleEn: "The pisanice of Bela krajina — a spring we paint",
    periodSi: "velikonočna šega, dokumentirana od 1893",
    periodEn: "an Easter custom, documented since 1893",
    summarySi:
      "Velikonočna jajca, okrašena v tehniki batika z značilno belokranjsko ornamentiko. Od leta 2012 so vpisane v register žive nesnovne kulturne dediščine Slovenije.",
    summaryEn:
      "Easter eggs decorated in the batik technique with the characteristic ornament of Bela krajina. Since 2012 they have been entered in Slovenia's register of living intangible heritage.",
    storySi:
      "Vsako pomlad so belokranjske roke vzele jajce, vošček in paličico — in narisale pomlad na lupino. Belokranjske pisanice so pobarvana in v batik tehniki okrašena velikonočna jajca z značilno ornamentiko: vosek, ki se nanese na lupino, prepreči barvi, da bi se spraskala v risbo, in ko se jajce poišče v barvilu, ostane pod voskom svetel vzorec — rastlinje, krogi, zvezde, križi in venci, kakor si jih je vsaka krajina izmislila sama.\n\nŠega je stara in globoko ukoreninjena: v Beli krajini pisanice izdelujejo že več kot stoletje, danes pa jih nosijo ime nosilk, ki veščino živo ohranjajo — med njimi Vesna Veselič, nekdanja šivilja iz Adlešičev, ki pisanice ustvarja vse življenje. Leta 2012 so bile belokranjske pisanice vpisane v Register nesnovne kulturne dediščine Slovenije: država je priznala, kar je vas vedela vedno — da je ta risba na lupini znanje, ki se prenaša iz roda v rod.\n\nZnanost je to vedela prej. Že leta 1893 je Janko Barle — otrok Podzemlja in prijatelj gribeljskega Matije Totterja — v Izvestjih Muzejskega društva za Kranjsko objavil študijo Pisanice iz Bele Krajine: prvo znanstveno obdelavo te šege, njene tehnike, vzorcev in pomenov. Gradivo je zbral po vaseh ob Kolpi; kampanjo je nosil isti zbirateljski zagon, ki je shranil ženitovanjske običaje in kresne pesmi.\n\nMuzej vasi Griblje išče svoje vzorce: ali so Griblje risale lastne ornamente, kakšne barve so uporabljale, kdo je bil vaški pisar pisanic? Vsako ohranjeno jajce — ali spomin nanj — bo dobrodošlo: pomlad, ki jo narišemo, je namreč najkrhkejša stvar v zbirki.",
    storyEn:
      "Every spring Bela krajina hands took an egg, a bit of wax and a stylus — and drew spring onto the shell. The pisanice of Bela krajina are Easter eggs painted and decorated in the batik technique with a characteristic ornament: the wax laid on the shell keeps the dye out of the drawing, and when the egg comes up from the colour bath, a bright pattern stays beneath the wax — plants, circles, stars, crosses and wreaths, each landscape inventing its own.\n\nThe custom is old and deep-rooted: Bela krajina has made pisanice for more than a century, and today they carry the names of the women who keep the craft alive — among them Vesna Veselič, a former seamstress from Adlešiči who has made pisanice all her life. In 2012 the pisanice of Bela krajina were entered in the Register of the Intangible Cultural Heritage of Slovenia: the state acknowledged what the village had always known — that this drawing on a shell is knowledge passed down through generations.\n\nScholarship knew it earlier. Already in 1893 Janko Barle — a child of Podzemelj and friend of Griblje's Matija Totter — published in the Proceedings of the Museum Society for Carniola the study Pisanice of Bela krajina: the first scholarly treatment of the custom, its technique, patterns and meanings. He gathered the material in the villages along the Kolpa; the collecting drive was the same one that saved the wedding customs and the bonfire songs.\n\nThe museum of Griblje seeks its own patterns: did Griblje draw its own ornaments, what colours did it use, who was the village's painter of pisanice? Every surviving egg — or a memory of one — will be welcome: the spring we paint is the most fragile thing in the collection.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/pisanice.jpg",
    imageCredit:
      "Foto: Andrejj · Wikimedia Commons · CC BY-SA 3.0 — belokranjske pisanice",
    yearFrom: 1893,
    featured: false,
    sources: [
      {
        key: "odeon-pisanice",
        nameSi: "Radio Odeon — Belokranjske pisanice: živa nesnovna kulturna dediščina (16. 4. 2022)",
        nameEn: "Radio Odeon — The pisanice of Bela krajina: living intangible heritage (16 April 2022)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/belokranjske-pisanice-ziva-nesnovna-kulturna-dediscina/",
        noteSi: "Batik tehnika, ornamentika, nosilke veščine in vpis v register nesnovne dediščine.",
        noteEn: "The batik technique, the ornament, the bearers of the craft and the entry in the intangible heritage register.",
      },
      {
        key: "register-znkd-pisanice",
        nameSi: "Register nesnovne kulturne dediščine Slovenije — Ministrstvo za kulturo (vpis: pisanice, 2012)",
        nameEn: "Register of the Intangible Cultural Heritage of Slovenia — Ministry of Culture (entry: pisanice, 2012)",
        sourceType: "spletni-vir",
        license: "javni informacijski vir",
        url: "https://www.nesnovnadediscina.si",
        noteSi: "Uraden vpis enote žive nesnovne dediščine »Belokranjske pisanice« (2012).",
        noteEn: "The official entry of the living intangible heritage unit 'Belokranjske pisanice' (2012).",
      },
      {
        key: "barle-pisanice-1893-b",
        nameSi: "Bibliografija: Janko Barle, »Pisanice iz Bele Krajine«, Izvestja Muzejskega društva za Kranjsko 3 (1893), str. 233–240",
        nameEn: "Bibliography: Janko Barle, 'Pisanice iz Bele Krajine', Izvestja Muzejskega društva za Kranjsko 3 (1893), pp. 233–240",
        sourceType: "objava",
        license: "bibliografski citat",
        noteSi: "Prva znanstvena študija te šege — most med 19. stočetjem in današnjim registrom.",
        noteEn: "The first scholarly study of the custom — a bridge between the 19th century and today's register.",
      },
      {
        key: "commons-pisanice",
        nameSi: "Wikimedia Commons: Belokranjske pisanke (fotograf: Andrejj)",
        nameEn: "Wikimedia Commons: Belokranjske pisanke (photographer: Andrejj)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Andrejj)",
        url: WM("Belokranjske_pisanke.JPG"),
        noteSi: "Glavna slika zapisa: pisanice Bele krajine — risba na lupini, ki jo nosi ta zapis.",
        noteEn: "The record's main image: the Easter eggs of Bela krajina — the shell-drawing this record carries.",
      },
    ],
  },
  {
    slug: "kresovanje",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Kresovanje — ogenj in pesem pred sv. Janezom",
    titleEn: "Kresovanje — fire and song before St. John's night",
    periodSi: "večer pred dnem sv. Janeza Krstnika",
    periodEn: "the eve of St. John the Baptist's day",
    summarySi:
      "Na večer pred sv. Janezom Krstnikom so po gričih goreli kresi in pele kresne pesmi. Za pozemeljsko faro jih je zapisal gribeljski Matiček; živi so ostali le v Adlešiški fari.",
    summaryEn:
      "On the eve of St. John the Baptist fires burned on the hills and bonfire songs were sung. For the Podzemelj parish Griblje's Matiček wrote them down; alive they remained only in the Adlešiči parish.",
    storySi:
      "Kresovanje je šega ene noči: na večer pred dnem sv. Janeza Krstnika so vaščani nanesli les na griče, zvečer prižgali kres — in okrog ognja peli kresne pesmi. Pesem je bila del šege, ne okras: besedila so se po vaseh razlikovala, vsaka fara in pogosto vsaka vas je imela svojo kitico, svoj zaklep in svoj obred ob plamenih.\n\nZa pozemeljsko faro — obsegala je tudi Griblje — je to izročilo popisal prav gribeljski zapisovalec: Matija Totter, Jandreč Matiček. Po navodilu prijatelja Janka Barleta je popisal običaj kresovanja in zapisal tudi besedilo kresne pesmi, kakor so jo peli ob Kolpi. Barle je gradivo objavil; Županič se je podobnemu zbiranju zahvalil v Slovenskem etnografu. Usoda teh običajev je bridka: v pozemeljski fari so nekateri kmalu po zapisu ugasnili. Kot živ običaj — z ognjem in pesmijo — se je kresovanje v Beli krajini ohranilo le v Adlešiški fari, kjer gori še danes.\n\nZato je vsak zapis iz 19. stoletja zlato: rešil je obliko šege, ki bi sicer izginila brez sledu. Kres je namreč šega, ki ne pusti predmeta — ostanejo le pepel, pesem in spomin. Muzejska plovila so tu samo besedila; ogenj je vedno znova treba prižgati.\n\nMuzej vasi Griblje postavlja vprašanje, ki ga znajo odgovoriti le domačini: ali so imele Griblje svoj kres — svoj grič, svojo kopico, svojo kitico kresne pesmi? Kje je gorel, kdaj je ugasnil, kdo je pel zadnjo pesem? Vsak stavek spomina bo zapisan; to je šega, ki se hrani samo, če se pove.",
    storyEn:
      "Kresovanje is a custom of a single night: on the eve of St. John the Baptist's day villagers carried wood up the hills, lit the bonfire at nightfall — and sang the bonfire songs around the flames. The song was part of the rite, not decoration: the texts differed from village to village; each parish, often each village, had its own verse, its own charm, its own ceremony at the fire.\n\nFor the Podzemelj parish — which included Griblje — this tradition was written down by Griblje's own recorder: Matija Totter, Jandreč Matiček. On the instruction of his friend Janko Barle he described the bonfire custom and set down the text of the bonfire song as it was sung along the Kolpa. Barle published the material; Županič thanked him for similar collecting in the Slovene Ethnographer. The fate of these customs is bitter: in the Podzemelj parish some went out soon after they were written down. As a living custom — with fire and song — kresovanje survived in Bela krajina only in the Adlešiči parish, where it still burns today.\n\nThat is why every record from the 19th century is gold: it saved the shape of a custom that would otherwise have vanished without trace. A bonfire leaves no object behind — only ash, a song and a memory remain. The museum's vessel here is text alone; the fire must be lit anew each time.\n\nThe museum of Griblje asks the question only the locals can answer: did Griblje have its own bonfire — its own hill, its own pile, its own verse of the bonfire song? Where did it burn, when did it go out, who sang the last song? Every sentence of memory will be written down; this is a custom that survives only by being told.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/kres.jpg",
    imageCredit:
      "Foto: RatiMan5001 · Wikimedia Commons · CC BY-SA 4.0 — kres (ilustrativna slika slovenske šege; posnetek ni z Gribelj)",
    yearFrom: 1890,
    featured: false,
    sources: [
      {
        key: "odeon-totter-kres",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Matija Totter (kresovanje, kresna pesem, Adlešiška fara)",
        nameEn: "Radio Odeon — People by the Kolpa: Matija Totter (the bonfire custom, the bonfire song, the Adlešiči parish)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-matija-totter/",
        noteSi: "Matičkov zapis običaja kresovanja in besedila kresne pesmi; ohranitev le v Adlešiški fari.",
        noteEn: "Matiček's record of the bonfire custom and the bonfire song's text; survival only in the Adlešiči parish.",
      },
      {
        key: "odeon-barle-zbiranje",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Janko Barle (zbiranje pesmi in pripovedk Bele krajine)",
        nameEn: "Radio Odeon — People by the Kolpi: Janko Barle (gathering the songs and tales of Bela krajina)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-janko-barle/",
        noteSi: "Barle kot zbiratelj izročila ob Kolpi; zahvala Matičku v Domu in svetu.",
        noteEn: "Barle as collector of tradition along the Kolpa; his thanks to Matiček in Dom in svet.",
      },
      {
        key: "commons-kres",
        nameSi: "Wikimedia Commons: kres — pogled na gorenje (fotograf: RatiMan5001)",
        nameEn: "Wikimedia Commons: a bonfire burning (photographer: RatiMan5001)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: RatiMan5001)",
        url: WM("Gorenje-izzajčjegore.jpg"),
        noteSi: "Glavna slika zapisa: kres — ogenj šege, ki ga ta zapis opisuje (posnetek ni z Gribelj).",
        noteEn: "The record's main image: a bonfire — the fire of the custom this record describes (not photographed at Griblje).",
      },
    ],
  },
  {
    slug: "kuhanje-zganja",
    addedAt: "2026-09-16",
    category: "gospodarstvo",
    titleSi: "Kuhanje žganja — jesenska kapljica vasi",
    titleEn: "Brandy distilling — the village's autumn drop",
    periodSi: "jesenski kmečki koledar",
    periodEn: "the farming calendar's autumn",
    summarySi:
      "Jeseni je kuharija hodila od domačije do domačije: hruškovec, jabolkovec, tropinovec. Žganje je bilo zdravilo, darilo in denar — in zgovorna ura vasi.",
    summaryEn:
      "In autumn the still went from farm to farm: pear, apple and pomace brandy. Brandy was medicine, gift and money — and the village's most talkative hour.",
    storySi:
      "Ko so sadje odnesle prve jesenske noči, je po vasi stala kuharija — štil, kotel s čelado in cevjo, ki jo je kuhar vozil od domačije do domačije. Kuhanje žganja je bilo kmečka kemija in kmečka gospodarstvina hkrati: iz hrušk je nastal hruškovec, iz jabolk jabolkovec, iz ostankov po stiskanju tropinovec; iz viljamovk, tistih malih poznozimnih hrušk, pa kapljica, ki se je hranila za največje priložnosti.\n\nVeščina je bila v rokah kuhanja — moževe ali ženine, ki je poznal ogenj in tok. Prvi tok, predkap, je bil odvzeti: preveč ostrine. Zadnji, podkap, prav tako. Ostalo je srce — kapljica, po kateri so sodili domačijo. Kuhanje je bilo tudi družabni dogodek: ob kuhariji se je zbrala ulica, zgodbe so tekle kakor žganje po cevi, otroci so dobili sladko prenape, psi kosti. Žganje je potem živelo v kleti kot zdravilo (gripa, zob, strah), kot darilo (svatba, žegnanje, župnik) in kot majhna valuta, s katero se je plačevalo pomoč pri žetvi in senačenju.\n\nV Beli krajini je bilo sadjarstvo del vsake dobre domačije — tudi učiteljski Barleti v Podzemlju so bili znani sadjarji in čebelarji, iz istega debla kot vinogradništvo in čebelarstvo ob Kolpi. Sadje je bilo denarnica, žganje pa njen drobiž.\n\nDanes se žganja kuhajo z dovoljenji in po merilih, a jesenski vonj po kuhani hruški ostaja vosk za spomin. Muzej išče gribeljsko kuharijo: kdaj je zadnjič kuhala, pri kom je stala, koliko meric je odkuhala? Vsaka steklenica z ročno etiketo je muzejski predmet, ki še diha.",
    storyEn:
      "When the first autumn nights had taken the fruit, the still stood in the village — the štil, a kettle with helm and pipe, which the distiller drove from farm to farm. Brandy distilling was peasant chemistry and peasant economics at once: from pears came pear brandy, from apples apple, from the press remnants pomace; from the little winter viljamovka pears, the drop kept for the greatest occasions.\n\nThe craft lay in the distiller's hands — a husband's or a wife's — who knew the fire and the flow. The first run, the fore-shot, was poured away: too fierce. The last, the tail, likewise. What remained was the heart — the drop by which a farm was judged. Distilling was a social event as well: the lane gathered round the still, stories ran like brandy down the pipe, children got the sweet slops, dogs the bones. The brandy then lived in the cellar as medicine (flu, toothache, fright), as a gift (weddings, blessings, the priest) and as small coin with which help at harvest and haying was paid.\n\nIn Bela krajina fruit-growing belonged to every good farm — even the teacher Barles of Podzemelj were known orchardists and beekeepers, of the same trunk as the viticulture and beekeeping along the Kolpa. Fruit was the purse; brandy its small change.\n\nToday brandies are distilled under licence and to standard, but the autumn smell of cooked pear remains wax for memory. The museum seeks the Griblje still: when did it fire last, at whose farm did it stand, how many measures did it run? Every bottle with a hand-written label is a museum object that still breathes.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/zganje.jpg",
    imageCredit:
      "Foto: Milko Matičetov, 1949 · Wikimedia Commons · javna last — kuhanje žganja (Osp; ilustrativni etnografski posnetek)",
    yearFrom: 1900,
    featured: false,
    sources: [
      {
        key: "commons-zganje-maticetov",
        nameSi: "Wikimedia Commons: Prebeneščan kuha žganje, Osp 1949 (fotograf: Milko Matičetov)",
        nameEn: "Wikimedia Commons: A man of Prebenec distilling brandy, Osp 1949 (photographer: Milko Matičetov)",
        sourceType: "fotografija",
        license: "javna last / public domain (fotograf: Milko Matičetov)",
        url: WM("Prebeneščan_kuha_žganje,_Osp_1949.jpg"),
        noteSi: "Glavna slika zapisa: kuhanje žganja, klasični Matičetov etnografski posnetek.",
        noteEn: "The record's main image: brandy distilling, a classic ethnographic photograph by Matičetov.",
      },
      {
        key: "wiki-zganje",
        nameSi: "Wikipedija: Žganje (vrste, postopek, kultura)",
        nameEn: "Wikipedia: Žganje (kinds, process, culture)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Žganje",
        noteSi: "Splošni okvir šege in tehnologije destilacije v slovenskem prostoru.",
        noteEn: "The general frame of the custom and of distilling technology in the Slovene lands.",
      },
      {
        key: "odeon-barle-sadjarstvo",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Janko Barle (sadjarstvo in čebelarstvo belokranjskih domačij)",
        nameEn: "Radio Odeon — People by the Kolpa: Janko Barle (the fruit-growing and beekeeping of Bela krajina farms)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-janko-barle/",
        noteSi: "Sadje kot denarnica belokranjskih domačij — osnova vsake kuharije.",
        noteEn: "Fruit as the purse of Bela krajina farms — the foundation of every still.",
      },
    ],
  },
  {
    slug: "loke-in-studenci",
    addedAt: "2026-09-16",
    category: "narava",
    titleSi: "Loke in studenci — reka, ki diha pod tlemi",
    titleEn: "Loke and studenci — the river that breathes underground",
    periodSi: "dolina Kolpe pri Gribljah",
    periodEn: "the Kolpa valley at Griblje",
    summarySi:
      "Kolpa je s poplavljanjem ustvarila rodovitne travnike — loke. Velik del vode ponika pod tlemi in se vrne kot studenci; zato je vas ob najbolj darežljivi reki med najbolj suhimi kraji Bele krajine.",
    summaryEn:
      "The Kolpa's flooding created fertile meadows — the loke. Much of the water sinks underground and returns as springs; that is why a village beside the most generous river is among the driest places in Bela krajina.",
    storySi:
      "Reka, ki teče skozi apnenec, ne dela zemlje pošteno na površju. Kolpa je v tisočletjih s poplavljanjem ustvarila rodovitne travnike — loke, po katerih se pa spomladi zgodita dve reki: ena vidna, ki teče po koritu, in ena nevidna, ki ponika. Velik del vode v obkolpski ravnini namreč uide v podzemlje in se ob reki spet pojavi kot studenci — izviri, ki bruhajo iz tal kakor dih iz prsi. Krajina diha: ob visoki vodi izdiha, ob nizki vdihava.\n\nTa dvojni ritem je oblikoval gospodarstvo vasi. Loke so bile senožeti — zimsko hrano živine v mesecu, ko sneg pokrije vse drugo; njihova rodovitnost je bila letina, ki jo je reka prinesla brezplužno. Studenci so bili napajališča in pralnice, kraji, kjer se je vas sestajala ob vodi, ki nikoli ni zmanjkala — tudi ne v letih, ko je bilo dežja malo.\n\nIn tu je znamenitost Gribelj: vas ob najbolj vodnati reki spada med najbolj suhe kraje Bele krajine. Ni protislovje, ampak lekcija o krški pokrajini: voda, ki jo vidiš, ni vsa voda; tista, ki je ne vidiš, odloča. Jezovi na Kolpi so v zadnjih stoletjih spremenili tudi to zgodbo — spremenili so erozijo bregov, selitve rib in rastlinstvo, kakor je reka spremenila njih.\n\nDanes so loke zatočišče biotske pestrosti: ptice gnezdilke, metulji, orhideje in vlažne travnike, ki jih je Evropa začela ceniti šele, ko so redki. Na njih kmetuje tudi gribeljsko ekološko kmetijstvo. Muzej zbira imena: vsak studenec pri Gribljah je ime nosil — muzej išče imena, ki so ostala samo v ustih najstarejših.",
    storyEn:
      "A river that flows through limestone does not deal its water fairly on the surface. Over millennia the Kolpa's flooding created fertile meadows — the loke — over which two rivers move in spring: one visible, running in its bed, and one unseen, sinking. Much of the water of the Kolpa plain escapes underground and reappears along the river as studenci — springs that break from the ground like breath from a chest. The landscape breathes: it exhales in high water, inhales in low.\n\nThis double rhythm shaped the village's economy. The loke were hayfields — the winter feed of livestock in the month when snow covers everything else; their fertility was a harvest the river brought without a plough. The springs were watering places and wash-houses, places where the village gathered by water that never failed — not even in years of little rain.\n\nAnd here lies Griblje's distinction: a village beside the most water-rich river belongs among the driest places in Bela krajina. It is no contradiction but a lesson in karst country: the water you see is not all the water; the water you do not see decides. The weirs on the Kolpa changed this story too in the last centuries — they altered the erosion of banks, the migration of fish and the plants, as the river altered them.\n\nToday the loke are a refuge of biodiversity: nesting birds, butterflies, orchids and the wet meadows Europe began to value only when they grew scarce. On them Griblje's ecological farming works as well. The museum collects names: every spring at Griblje bore a name — the museum seeks the names that survive only in the mouths of the oldest.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/kolpa-dolina.jpg",
    imageCredit:
      "Foto: Uroš Novina · Wikimedia Commons · CC BY 2.0 — dolina Kolpe z lokami v Beli krajini (razgled s Sodevske stene)",
    featured: false,
    sources: [
      {
        key: "wiki-griblje-loke",
        nameSi: "Wikipedija: Griblje (loke, studenci, najbolj suh kraj Bele krajine)",
        nameEn: "Wikipedia: Griblje (loke meadows, springs, the driest place in Bela krajina)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Poplavni travniki, ponikanje vode in studenci ob reki; suhost vasi.",
        noteEn: "Flood meadows, sinking water and springs by the river; the village's dryness.",
      },
      {
        key: "wiki-kolpa-jezovi",
        nameSi: "Wikipedija: Kolpa (poplavljanje, jezovi, spremembe erozije in rastlinstva)",
        nameEn: "Wikipedia: Kolpa (flooding, weirs, changes in erosion and vegetation)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kolpa",
        noteSi: "Kako je reka naredila loke in kako so jezovi spremenili reko.",
        noteEn: "How the river made the meadows and how the weirs changed the river.",
      },
      {
        key: "commons-kolpa-dolina",
        nameSi: "Wikimedia Commons: dolina reke Kolpe v Beli krajini (fotograf: Uroš Novina)",
        nameEn: "Wikimedia Commons: the valley of the Kolpa in Bela krajina (photographer: Uroš Novina)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: Uroš Novina)",
        url: WM("Valley_of_Kolpa_river_(49511580216).jpg"),
        noteSi: "Glavna slika zapisa: dolina Kolpe z ravnino — pokrajina, ki jo ta zapis razlaga.",
        noteEn: "The record's main image: the Kolpa valley and its plain — the landscape this record explains.",
      },
    ],
  },
  {
    slug: "etimologija-gribljati",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Gribljati — ime vasi je brazda",
    titleEn: "Gribljati — the village's name is a furrow",
    periodSi: "od prve omembe 1468",
    periodEn: "since the first mention in 1468",
    summarySi:
      "Ime Griblje izhaja iz staroslovanske besede gribljati — brazdati, orati. V urbarjih in na najstarejšem zemljevidu piše Grüble, ne Groble: ime vasi je spomin na prvi plug.",
    summaryEn:
      "The name Griblje comes from the Old Slavic verb gribljati — to furrow, to plough. In the urbaria and on the oldest map it is written Grüble, not Groble: the village's name is a memory of the first plough.",
    storySi:
      "Vsaka vas ima svojo najstarejšo rečenico — Griblje jo imajo v imenu. Izhaja iz staroslovanske besede gribljati, ki pomeni brazdati, orati: ime vasi je izpeljanka besede za dejanje, s katerim je človek odpiral zemljo, da bi vrgel seme vanjo. Ne po ljudeh, ne po svetniku, ne po gospodu — po delu. Vas, ki se imenuje po brazdi.\n\nPotrdilo je v papirjih: v urbarjih in na najstarejšem zemljevidu, na katerem vas stoji, je zapisano Grüble — mala brazda. Starejša razlaga, ki je ime povezovala z »grobljo«, prodnatim nasipom, ni pravilna: urbarji ne lažejo, na prvem mestu so vedno pisali z i. Znanstveno je vprašanje obdelal Jože Šimec v članku Izvor imena vasi Griblje (Dolenjski list, 11. januarja 2001), ki ga navaja tudi Wikipedijina literatura.\n\nZa muzej je etimologija najstarejši zapis v zbirki — starejša od vsakega dokumenta, ker je zapisana v samem imenu. Vsakokrat, kdor reče »Griblje«, ponovi dejanje, ki ga je ime izbralo: plug, ki je šel prvič skozi gozd. Njivski čas, ko se polja brazdajo in zasanjajo, je letni spomin na to ime.\n\nIme nosi tudi vabilo: pri Gribljah se je pričelo izkrčevanje brezovega gozda, nastala je Goranja lokva, kjer so kopali glino za opeko — vse to je zraslo iz iste besede in istega dela. Muzej išče najstarejši list, na katerem je ime zapisano (1468), in posnetke urbarjev, kjer Grüble stoji — vsak pomik črke v imenu je dogodek v zgodovini vasi.",
    storyEn:
      "Every village has its oldest sentence — Griblje carries it in the name. It derives from the Old Slavic verb gribljati, meaning to furrow, to plough: the village's name is a derivative of the act by which a man opened the earth to cast seed into it. Not after people, not after a saint, not after a lord — after work. A village named after the furrow.\n\nThe proof lies in the papers: in the urbaria and on the oldest map on which the village stands, it is written Grüble — the little furrow. The older explanation, which linked the name to 'groblja', a gravel bank, is not correct: the urbaria do not lie, and the i came first in every record. The question was treated scholarly by Jože Šimec in the article The Origin of the Name of the Village Griblje (Dolenjski list, 11 January 2001), cited also in Wikipedia's literature.\n\nFor a museum, etymology is the oldest record in the collection — older than any document, because it is written into the name itself. Whoever says 'Griblje' repeats the act the name chose: the plough that first went through the forest. The field season, when the land is furrowed and sown, is the annual memory of that name.\n\nThe name carries an invitation too: at Griblje the clearing of the birch forest began, Goranja lokva arose where clay was dug for brick — all of it grew from the same word and the same work. The museum seeks the oldest leaf on which the name is written (1468) and photographs of the urbaria where Grüble stands — every shift of a letter in the name is an event in the village's history.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/oranje-voli.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — oranje z volovsko vprego: dejanje, ki ga ime vasi nosi",
    yearFrom: 1468,
    featured: false,
    sources: [
      {
        key: "wiki-griblje-ime",
        nameSi: "Wikipedija: Griblje (etimologija: gribljati = brazdati, orati; Grüble)",
        nameEn: "Wikipedia: Griblje (etymology: gribljati = to furrow, to plough; Grüble)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Staroslovanski izvor, urbarji in najstarejši zemljevid; napačna razlaga »groblja«.",
        noteEn: "The Old Slavic origin, the urbaria and the oldest map; the incorrect 'groblja' explanation.",
      },
      {
        key: "simec-2001",
        nameSi: "Bibliografija: Jože Šimec, »Izvor imena vasi Griblje«, Dolenjski list, 11. 1. 2001, str. 17",
        nameEn: "Bibliography: Jože Šimec, 'The Origin of the Name of the Village Griblje', Dolenjski list, 11 Jan 2001, p. 17",
        sourceType: "objava",
        license: "bibliografski citat",
        noteSi: "Znanstvena obdelava izvora imena, ki jo navaja Wikipedijina literatura.",
        noteEn: "The scholarly treatment of the name's origin, cited in Wikipedia's literature.",
      },
      {
        key: "commons-oranje-voli",
        nameSi: "Wikimedia Commons: oranje z volovsko vprego (fotograf: Fran Vesel)",
        nameEn: "Wikimedia Commons: ploughing with an ox team (photographer: Fran Vesel)",
        sourceType: "fotografija",
        license: "javna last / public domain (fotograf: Fran Vesel)",
        url: WM("Oranje_z_volovsko_vprego.jpg"),
        noteSi: "Glavna slika zapisa: oranje — dejanje, iz katerega je zraslo ime vasi.",
        noteEn: "The record's main image: ploughing — the act from which the village's name grew.",
      },
    ],
  },
  {
    slug: "td-griblje",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Turistično društvo Griblje — vasi, ki se sama spominja",
    titleEn: "The Griblje Tourist Society — a village that remembers itself",
    periodSi: "ustanovljeno v 21. stoletju · danes",
    periodEn: "founded in the 21st century · today",
    summarySi:
      "Društvo, ki drži koledar vasi: Pasuljado, Kavbojski žur, rally starodobnih koles, srečanja Gribeljcev po svetu — in ta digitalni muzej.",
    summaryEn:
      "The society that holds the village calendar: the Pasuljada, the Cowboy Party, the vintage-bicycle rally, the reunions of Griblje people worldwide — and this digital museum.",
    storySi:
      "Vsaka vas ima svoj koledar, a ne vsaka ima tistega, ki ga drži. V Gribljah to vlogo nosi Turistično društvo Griblje: društvo, ki ni postavilo informativne table, ampak prireditve, na katerih se vas sestane s sabo.\n\nPoletje drži Pasuljada — tekmovanje v kuhanju pasulja, ki ga TD prireja z Društvom kmečkih žena in gribeljskim kopališčem: štirinajst ekip, komisija, zmagovalke in zmagovalci, vonj, ki se razleže po obkolpski ravnini. Junija Kavbojski žur — vaški Divji zahod s plesalkami Country Roses, semiškimi Vrtičkarji in skupino Wild West iz Ljubljane. Julija rally starodobnih koles s Sekcijo Torpedo: kolesarji iz slovenskih in hrvaških društev se peljejo po Gribljah, obiščejo cerkev sv. Vida in staro šolo — z učno uro iz stare čitanke, kjer »Bistre buče« dobijo drugo življenje.\n\nTD je tudi sooborganizator trenutkov, ko se vas spomni same sebe: srečanja vseh Gribeljcev, ki so svoj drugi dom našli izven rojstne vasi (2019, ob 130-letnici šole), in praznika krajevne skupnosti po desetletjih (2024). In ko je zasvetila zamisel o digitalnem muzeju vasi, je bilo naravno, da ga nosi prav TD: muzej, ki bi ga lahko imela vsaka vas, a ima le tista, ki ima koga, koledar in voljo.\n\nTa zapis je hkrati poštena samoopomba muzeja: hišnik se predstavi na vratih. Muzej vasi Griblje je projekt Turističnega društva Griblje — nastal iz istega nagona, iz katerega rastejo Pasuljada in rally: iz prepričanja, da je vas vredna zapisa. Muzej išče ustanovni zapis društva, imena pobudnikov in fotografije prvih let — vsak koledar ima svoj prvi list.",
    storyEn:
      "Every village has a calendar, but not every village has the one who holds it. In Griblje that role belongs to the Griblje Tourist Society: an association that put up no signpost but raised the events at which the village meets itself.\n\nSummer is held by the Pasuljada — the bean-stew contest the TD runs with the Farm Women's Society and the Griblje bathing place: fourteen teams, a jury, winners, and a smell that spreads over the Kolpa plain. In June the Cowboy Party — the village's Wild West with the Country Roses dancers, the Vrtičkarji of Semič and the Wild West band from Ljubljana. In July the vintage-bicycle rally with the Torpedo section: cyclists from Slovene and Croatian societies ride through Griblje, visit the church of St. Vitus and the old school — with a lesson from an old reader, where 'Bistre buče' (Clever Squashes) get a second life.\n\nThe TD is co-organiser too of the moments when the village remembers itself: the reunion of all Griblje people who found a second home away from the birth village (2019, at the school's 130th anniversary), and the local community's festival after decades (2024). And when the idea of a digital village museum lit up, it was natural that the TD should carry it: a museum any village could have, but only the one with people, a calendar and the will actually does.\n\nThis record is also the museum's honest self-note: the caretaker introduces himself at the door. The Griblje Village Museum is a project of the Griblje Tourist Society — born of the same instinct from which the Pasuljada and the rally grow: the conviction that the village is worth writing down. The museum seeks the society's founding record, the names of its initiators and photographs of its first years — every calendar has its first leaf.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/td-kopališka-hisica.jpg",
    imageCredit:
      "Foto: Uroš Novina · Wikimedia Commons · CC BY 2.0 — hišica ob ribniku v Gribljah (zimski posnetek)",
    yearFrom: 2000,
    featured: false,
    sources: [
      {
        key: "odeon-pasuljada-td",
        nameSi: "Radio Odeon — V Gribljah že 16. Pasuljada (6. 8. 2019; organizacija TD Griblje + Društvo kmečkih žena + kopališče)",
        nameEn: "Radio Odeon — The 16th Pasuljada in Griblje (6 Aug 2019; organised by TD Griblje + Farm Women's Society + the bathing place)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/v-gribljah-ze-16-pasuljada/",
        noteSi: "TD kot organizator Pasuljade; 14 ekip, komisija, zmagovalca 2019.",
        noteEn: "The TD as organiser of the Pasuljada; 14 teams, jury, the 2019 winners.",
      },
      {
        key: "odeon-rally-2026",
        nameSi: "Radio Odeon — Po Gribljah s starodobnimi kolesi (6. 7. 2026; TD + Sekcija Torpedo, obisk cerkve in šole z učno uro)",
        nameEn: "Radio Odeon — Through Griblje on vintage bicycles (6 Jul 2026; TD + Torpedo section, church and school visit with a lesson)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/po-gribljah-s-starodobnimi-kolesi/",
        noteSi: "Rally 2026: približno 50 kolesarjev iz 8 slovenskih in hrvaških društev; učna ura Bistre buče.",
        noteEn: "The 2026 rally: some 50 cyclists from 8 Slovene and Croatian societies; the 'Clever Squashes' lesson.",
      },
      {
        key: "odeon-jubilej-td",
        nameSi: "Radio Odeon — Jubilej gribeljske šole (19. 6. 2019; srečanje Gribeljcev po svetu pripravila KS in TD Griblje)",
        nameEn: "Radio Odeon — The Griblje school jubilee (19 Jun 2019; the reunion of Griblje people prepared by the local community and TD Griblje)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/jubilej-gribeljske-sole/",
        noteSi: "TD kot sooborganizator srečanja izseljenske vasi ob 130-letnici šole.",
        noteEn: "The TD as co-organiser of the emigrant village's reunion at the school's 130th anniversary.",
      },
      {
        key: "commons-hisica",
        nameSi: "Wikimedia Commons: Cabin under the Sun — hišica ob ribniku v Gribljah (fotograf: Uroš Novina)",
        nameEn: "Wikimedia Commons: Cabin under the Sun — a cabin by the pond at Griblje (photographer: Uroš Novina)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: Uroš Novina)",
        url: WM("Cabin_under_the_Sun_(46105681335).jpg"),
        noteSi:
          "Glavna slika zapisa: hišica ob ribniku v zimskem miru — vas, ki jo društveni koledar vsako leto znova oživi.",
        noteEn:
          "The record's main image: a cabin by the pond in the winter quiet — the village that the society's calendar wakes again every year.",
      },
    ],
  },
  {
    slug: "gribeljci-po-svetu-2019",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Gribeljci po svetu — vrnitev ob 130-letnici šole",
    titleEn: "Griblje people around the world — the return at the school's 130th anniversary",
    periodSi: "19. junij 2019",
    periodEn: "19 June 2019",
    summarySi:
      "Ob 130 letih šole so se v vas vrnili Gribeljci, ki so svoj drugi dom našli izven rojstne vasi. Krajevna skupnost in Turistično društvo sta pripravila srečanje.",
    summaryEn:
      "At the school's 130 years, the Griblje people who found a second home away from the birth village came back. The local community and the Tourist Society prepared the reunion.",
    storySi:
      "Devetnajstega junija 2019 se je v Gribljah zgodilo nekaj, kar vasi ni dano vsako leto: vrnile so se vse veje razpršene družine. Ob 130-letnici šole sta krajevna skupnost Griblje in Turistično društvo Griblje pripravila srečanje vseh Gribeljcev, ki so svoj drugi dom našli izven rojstne vasi — tistih čez Kolpo, čez mejo, čez ocean.\n\nJubilej je bil pravi okvir za tak sestanek, saj je šola tista ustanova, ki jo je vsak Gribljec delil — tisti, ki je ostal, in tisti, ki je odšel. Šolsko poslopje so blagoslovili novembra 1889; sprva eno učilnico in stanovanje učitelja pripravnika Petra Kambiča. Med drugo svetovno vojno so poslopje zasedli italijanski vojaki in pouk je stekel v gasilskem domu; povojno se je število učencev zvečalo, da je pouk tekel tudi v Brinčevi hiši. Leta 1963/64 je šola postala podružnica črnomaljske OŠ Mirana Jarca, od 1989 pa podružnica OŠ Loka. Leta 2004 je stavbi grozilo dokončno zaprtje vrat — a je bila želja krajanov, da svojo učilnico ohranijo za vsako ceno, močnejša. Ob 130-letnici jo je obiskovalo štirinajst učencev, danes sedemnajst.\n\nSedanji in nekdanji gribeljski učenci so pripravili pester program: pokazali so, kako je bilo v šolskih klopeh nekoč in kako je danes. Za izseljensko vas je tak dan nekaj več kot slavje: je preverjanje, ali se še znajo skupaj — ali jezik, ki se je razšel po svetu, še najde sklanjatev.\n\nMuzej išče seznam udeležencev srečanja 2019 in fotografije: kdo se je vrnil, od kod, katere rodbine. Vsak Gribljec po svetu, ki prebere ta zapis, je vabljen, da pripoveduje — muzej ima za vsako vejo zbirke prazen list.",
    storyEn:
      "On the nineteenth of June 2019 something happened in Griblje that a village is not granted every year: all the branches of the scattered family came home. At the school's 130th anniversary the Griblje local community and the Griblje Tourist Society prepared a reunion of all the Griblje people who had found a second home away from the birth village — those across the Kolpa, across the border, across the ocean.\n\nThe jubilee was the right frame for such a meeting, for the school is the one institution every Griblje person shared — the one who stayed and the one who left. The school building was blessed in November 1889; at first one classroom and the apartment of the trainee teacher Peter Kambič. In the Second World War Italian soldiers occupied the building and lessons moved to the fire station; after the war the number of pupils grew so that lessons ran in the Brinc house too. In 1963/64 the school became a branch of the Miran Jarc school in Črnomelj, and from 1989 a branch of the Loka school. In 2004 the building faced final closure — but the villagers' wish to keep their classroom at any cost proved stronger. At the 130th anniversary fourteen pupils attended; today, seventeen.\n\nPresent and former Griblje pupils prepared a varied programme: they showed how it once was in the school benches and how it is today. For an emigrant village such a day is more than a feast: it is a test of whether they still know how to be together — whether a tongue scattered across the world still finds its declension.\n\nThe museum seeks the list of those who attended the 2019 reunion and photographs: who returned, from where, which families. Every Griblje person in the world who reads this record is invited to speak — the museum keeps an empty page for every branch.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/gribeljci-2019.jpg",
    imageCredit:
      "Foto: Fran Vesel · Wikimedia Commons · javna last — kongres narodnih noš v Ljubljani, skupina Bele krajine (ilustrativna slika: Belokranjci zbrani zunaj domače vasi)",
    yearFrom: 2019,
    yearTo: 2019,
    featured: false,
    sources: [
      {
        key: "odeon-jubilej-2019",
        nameSi: "Radio Odeon — Jubilej gribeljske šole (19. 6. 2019; 130 let, srečanje Gribeljcev po svetu)",
        nameEn: "Radio Odeon — The Griblje school jubilee (19 Jun 2019; 130 years, the reunion of Griblje people worldwide)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/jubilej-gribeljske-sole/",
        noteSi: "Celoten potek jubileja in srečanja; kronologija šole 1889–2019.",
        noteEn: "The full course of the jubilee and reunion; the school's chronology 1889–2019.",
      },
      {
        key: "svet24-sola-2026",
        nameSi: "Svet24 — Podružnična šola Griblje (4. 1. 2026; 17 učencev, Marjetka Žunič, edina vas s podružnico)",
        nameEn: "Svet24 — The Griblje branch school (4 Jan 2026; 17 pupils, Marjetka Žunič, the only village with a branch school)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://svet24.si/lokalno/dolenjska/novice/podruznicna-sola-griblje-1870858",
        noteSi: "Sedanje stanje šole in njena edinstvenost med slovenskimi vasmi.",
        noteEn: "The school's present state and its uniqueness among Slovene villages.",
      },
      {
        key: "commons-kongres",
        nameSi: "Wikimedia Commons: kongres narodnih noš v Ljubljani, skupina Bela krajina (fotograf: Fran Vesel)",
        nameEn: "Wikimedia Commons: congress of folk costumes in Ljubljana, the Bela krajina group (photographer: Fran Vesel)",
        sourceType: "fotografija",
        license: "javna last / public domain (fotograf: Fran Vesel)",
        url: WM("Kongres_narodnih_noš_v_Ljubljani,_skupina_Bela_krajina.jpg"),
        noteSi: "Glavna slika zapisa: Belokranjci zbrani izven domače vasi — obraz srečanja, ki ga ta zapis opisuje (ilustrativno).",
        noteEn: "The record's main image: Bela krajina people gathered outside their home villages — the face of the reunion this record describes (illustrative).",
      },
    ],
  },
  {
    slug: "ko-se-pticki-zenijo",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Ko se ptički ženijo — gregorjevo, ki se je vrnilo",
    titleEn: "When the birds marry — the Gregorjevo that came back",
    periodSi: "15. marec 2026 · gasilski dom",
    periodEn: "15 March 2026 · the fire station hall",
    summarySi:
      "Pomladna prireditev podružnične šole in krajevne skupnosti: obujen ljudski običaj gregorjevo, dan žena, materinski dan — in priznanja za najboljši kruh vaških pekaric.",
    summaryEn:
      "The spring festival of the branch school and the local community: the revived folk custom of Gregorjevo, Women's Day, Mother's Day — and awards for the village bakers' best bread.",
    storySi:
      "Ko se ptički ženijo, je pomlad na pragu priletela — pravijo v Beli krajini za dvanajstega marca, gregorjevo. Tega dne so nekdaj vabili pomlad: čolni in mline so spustili po vodi, kajti »gregorječek« je odplavl na jug in odprl pot toploti. V Gribljah so ta običaj leta 2026 obudili v soboto, 15. marca, v gasilskem domu — prireditev Ko se ptički ženijo, v sodelovanju podružnične šole in krajevne skupnosti.\n\nNa odru so se predstavili učenci Podružnične šole Griblje: petje, recitacije in folklorni splet, ki je pokazal veliko ustvarjalnosti in poguma — otroški glasovi, ki se naučijo nositi pred vaščani, se tega ne pozabijo več. Glasbeno spremljavo na klavirju in harmoniki je prispeval učitelj Andraž Banovec. Prireditev so popestrili gostje: dramska skupina KTŠD Stari trg ob Kolpi s skečem Avto, ki je nasmejala občinstvo, in plesna skupina domačink Country Roses s poskočnim zaključkom.\n\nIn potem je prišlo tisto, kar dela to prireditev muzejsko: podelitev priznanj za najboljši kruh, ki so ga spekle in v oceno prinesle vse dobre vaške pekarice. Kruh, ki ga ocenjujeta šola in vas skupaj — šega, stara kakor kruh sam, zapisana v koledar, ki se bo, upajmo, štel naprej v letih.\n\nZa muzej je ta zapis dokument živosti: običaj, ki se je lahko izgubil v preklopu koledarjev, je bil zavestno obujen — in to ne v etnografski postavitvi, ampak v gasilskem domu, z otroki, kruhom in plesom. Muzej išče recept zmagovalnega kruha 2026 — in imena vseh pekaric, ki so sodelovale.",
    storyEn:
      "When the birds marry, spring has flown to the doorstep — they say in Bela krajina of the twelfth of March, Gregorjevo. On that day spring used to be invited in: little boats and mills were launched on the water, for 'little Gregory' sails south and opens the road for the warmth. In Griblje the custom was revived in 2026, on Saturday 15 March, in the fire station hall — the festival When the Birds Marry, run by the branch school together with the local community.\n\nOn the stage the pupils of the Griblje branch school performed: singing, recitation and a folklore medley that showed much creativity and courage — children's voices that learn to carry themselves before the villagers do not forget it again. Piano and accordion accompaniment came from the teacher Andraž Banovec. Guests spiced the evening: the drama group of the Stari trg cultural society with the sketch 'The Car', which made the audience laugh, and the women's dance group Country Roses with a lively finale.\n\nAnd then came what makes this festival a museum piece: the awarding of prizes for the best bread, baked and brought for judging by all the village's good bakers. Bread judged by school and village together — a custom as old as bread itself, written into a calendar that will, we hope, keep counting in years to come.\n\nFor the museum this record is a document of liveliness: a custom that could have been lost in the switching of calendars was consciously revived — and not in an ethnographic display but in the fire station hall, with children, bread and dancing. The museum seeks the recipe of the winning loaf of 2026 — and the names of all the bakers who took part.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/lastovka.jpg",
    imageCredit:
      "Foto: Partonez · Wikimedia Commons · CC BY-SA 4.0 — kmečka lastovka na žici: ptič, po katerem se pomlad »ženi« v vas",
    yearFrom: 2026,
    featured: false,
    sources: [
      {
        key: "odeon-pticki",
        nameSi: "Radio Odeon — Ko se ptički ženijo (19. 3. 2026; prireditev PŠ Griblje in KS v gasilskem domu)",
        nameEn: "Radio Odeon — When the Birds Marry (19 Mar 2026; the festival of the Griblje branch school and the local community in the fire station hall)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ko-se-pticki-zenijo/",
        noteSi: "Celoten program prireditve: učenci, Banovec, KTŠD Stari trg, Country Roses, priznanja za kruh.",
        noteEn: "The festival's full programme: the pupils, Banovec, the Stari trg drama group, Country Roses, the bread awards.",
      },
      {
        key: "commons-lastovka",
        nameSi: "Wikimedia Commons: kmečka lastovka na električni žici (fotograf: Partonez)",
        nameEn: "Wikimedia Commons: a barn swallow perched on a power line (photographer: Partonez)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Partonez)",
        url: WM("Barn_Swallow_perched_on_a_Power_Line.jpg"),
        noteSi: "Glavna slika zapisa: lastovka — ptič pomladi, po katerem nosi ime obujeni običaj.",
        noteEn: "The record's main image: the swallow — the bird of spring after which the revived custom is named.",
      },
    ],
  },
  {
    slug: "ciril-totter",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Ciril Totter — maratonc na Jandrečetovi zemlji",
    titleEn: "Ciril Totter — a marathon runner on the Jandreči land",
    periodSi: "danes · Griblje",
    periodEn: "today · Griblje",
    summarySi:
      "Današnji gospodar Jandrečetove domačije ekološko kmetuje, predeluje na domu in opravlja storitve — med tem pa teče maratone. Veja, ki se je vrnila k plugu.",
    summaryEn:
      "Today's master of the Jandreči homestead farms ecologically, processes at home and runs services — and between them all, runs marathons. The branch that came back to the plough.",
    storySi:
      "Zgodba Jandrečev ima tri dejanja. V prvem se fantje rodijo v kmečki družini in ker »plug in motika« ne dišita, gredo v svet — Matija je zapisoval šege in končal v Teksasu, Jakob cerkovnil v Minnesoti, Janez odprl trgovino v Saragosi. V drugem dejanju vas pošlje v Ameriko tudi Audrey Totter, njihova daljna sorodnica, ki bo zvezdnica Hollywooda. V tretjem dejanju — ki ga ta zapis hrani — se veja vrne: na Jandrečetovi domačiji danes gospodari Ciril Totter z družino.\n\nCiril kmetuje ekološko — brez kemije, po merilih, ki bi jih stari Jandreči prepoznali kot svoja: zemlja, ki se vrača. Predelava poteka na domu, poleg kmetijstva in opravljanja storitev pa se Totter ukvarja še s čim, kar njegovemu rodu nikoli ni ležalo: s športom. Ciril je izjemen tekač — maratonc, mož, ki je pretekel dvainštirideset kilometrov po cestah, po katerih so njegovi predniki pekli kruh.\n\nZato je ta zapis v zbirki: ker je muzej vasi dolžan zapisati tudi sedanji čas, ne le tisti, ki ga je arhiv že potrdil. Ekološka kmetija na stari domačiji ni muzejska postavitev — je odgovor na vprašanje, ali se kmečka linija obkolpske vasi prekine ali preoblikuje. Pri Jandrečih se je preoblikovala: iz pluga v ekološki certifikat, iz hoje v Maribor — v maraton.\n\nMuzej išče Cirilove čase maratonov in fotografijo teka z gribeljske zemlje: vsak štart, ki ga je nosila ta domačija, je zapis vreden.",
    storyEn:
      "The story of the Jandreči has three acts. In the first, sons are born to a farming family and, since 'plough and hoe' hold no charm for them, they go into the world — Matija wrote down customs and died in Texas, Jakob kept a church in Minnesota, Janez opened a store in Saragosa. In the second act the village sends to America also Audrey Totter, their distant kinswoman, who will be a star of Hollywood. In the third act — which this record keeps — a branch returns: today the Jandreči homestead is run by Ciril Totter and his family.\n\nCiril farms ecologically — without chemistry, by standards the old Jandreči would recognise as their own: land that gives back. Processing happens at home, and beside farming and services Totter does one more thing his line never shrank from: sport. Ciril is an exceptional runner — a marathon man, one who has run forty-two kilometres over roads on which his ancestors baked their bread.\n\nThat is why this record belongs in the collection: because a village museum owes a record of the present too, not only the past the archive has already confirmed. An ecological farm on the old homestead is no museum display — it is an answer to the question whether the farming line of a Kolpa village breaks or reshapes itself. At the Jandreči it reshaped: from the plough into the organic certificate, from the walk to Novo mesto — into the marathon.\n\nThe museum seeks Ciril's marathon times and a photograph of a run on Griblje ground: every start this homestead has carried is worth a record.",
    evidenceStatus: "CORROBORATED",
    image: "/images/authentic/maraton.jpg",
    imageCredit:
      "Foto: Jeremy Segrott · Wikimedia Commons · CC BY 2.0 — tekači na maratonu v Ljubljani (ilustrativna slika teka, ki ga nosi gribeljska veja)",
    yearFrom: 2020,
    featured: false,
    sources: [
      {
        key: "odeon-totter-ciril",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Matija Totter (»Na kmetiji Jandrečih danes ekološko kmetuje Ciril z družino … izjemen tekač — maratonec«)",
        nameEn: "Radio Odeon — People by the Kolpa: Matija Totter ('Today the Jandreči farm is run ecologically by Ciril and his family … an exceptional runner — a marathon man')",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-matija-totter/",
        noteSi: "Sedanja raba Jandrečetove domačije: ekološko kmetovanje, predelava, storitve, maratoni.",
        noteEn: "The present use of the Jandreči homestead: ecological farming, processing, services, marathons.",
      },
      {
        key: "commons-maraton",
        nameSi: "Wikimedia Commons: tekači na maratonu v Ljubljani (fotograf: Jeremy Segrott)",
        nameEn: "Wikimedia Commons: runners at the Ljubljana marathon (photographer: Jeremy Segrott)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (fotograf: Jeremy Segrott)",
        url: WM("Ljubljana_Marathon,_Slovenia_(25904370335).jpg"),
        noteSi: "Glavna slika zapisa: maraton — disciplina, ki jo je domačija vzgojila (ilustrativno).",
        noteEn: "The record's main image: the marathon — the discipline this homestead raised (illustrative).",
      },
    ],
  },
  {
    slug: "praznik-ks-2024",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Praznik krajevne skupnosti 2024 — prvi po desetletjih",
    titleEn: "The 2024 local community festival — the first in decades",
    periodSi: "15. september 2024 · gasilski dom",
    periodEn: "15 September 2024 · the fire station hall",
    summarySi:
      "Po desetletjih je imela Griblje spet svoj praznik: spomin na napad na italijanske mejne policiste septembra 1941, nagovor 89-letnega dr. Brinca in odprtje spominske sobe.",
    summaryEn:
      "After decades Griblje had its festival again: the memory of the attack on the Italian border police of September 1941, an address by the 89-year-old dr. Brinc, and the opening of the memorial room.",
    storySi:
      "Petnajstega septembra 2024 se je v gasilskem domu zbrala vas — na praznik krajevne skupnosti Griblje, prvem po desetletjih. Prisotni so bili predstavniki občine Črnomelj in Gasilske zveze Črnomelj, predsednik KS Darjo Piškurič pa je v nagovoru spomnil na dogodke, ki so tem datumu dali težo: na napad na italijanske mejne policiste septembra 1941, ko se je vas znašla v vrtincu okupacije in odporništva.\n\nNajbolj ganljiv trenutek večera je bil nagovor dr. Franca Brinca — 89-letnega nekdanjega šolarja gribeljske šole, pravnika, penologa in dobrotnika vasi, ki je občinstvu pripovedoval življenjske spomine. Kdor je poslušal moža, ki se je kot otrok igral po dvoriščih te vasi in kot znanstvenik razmišljal o kaznovanju po svetu, je slišal stoletje v enem glasu.\n\nOb prazniku je bila tudi slovesno odprta spominska soba dr. Franca Brinca v gasilskem domu — prostor, ki hrani zgodbo moža, ki je vasi namenil okoli 200.000 evrov darov: operativno sobo in streho gasilcev, digitalno opremo in igrala šoli, parkirišče ob cerkvi sv. Vida ob 500-letnici. Praznik, ki se je rodil iz spomina na vojno, je tako zaživel tudi kot praznik dobrote.\n\nZa muzej je ta zapis pomemben dvojno: kot dokaz, da si vas svojega praznika zna znova izmisliti, in kot zapis trenutka, ko se je rodila tradicija, ki se bo — upajmo — štela naprej. Muzej išče fotografije s praznika 2024 in popis vsebine spominske sobe: vsak predmet v njej je zapis, ki čaka.",
    storyEn:
      "On the fifteenth of September 2024 the village gathered in the fire station hall — for the festival of the Griblje local community, the first in decades. Present were representatives of the Črnomelj municipality and the Črnomelj fire brigade association, and the chairman of the local community Darjo Piškurič recalled in his address the events that give the date its weight: the attack on the Italian border police of September 1941, when the village found itself in the whirl of occupation and resistance.\n\nThe most disarming moment of the evening was the address of dr. Franc Brinc — the 89-year-old former pupil of the Griblje school, lawyer, penologist and benefactor of the village, who told the audience his life memories. Whoever listened to a man who had played as a child in this village's yards and pondered punishment as a scholar across the world, heard a century in one voice.\n\nThe festival also saw the ceremonial opening of the dr. Franc Brinc memorial room in the fire station hall — a space that keeps the story of the man who gave the village some 200,000 euros in gifts: the fire brigade's operations room and roof, the school's digital equipment and playground, the car park by the church of St. Vitus at the 500th anniversary. A festival born of the memory of war thus came alive as a festival of generosity too.\n\nFor the museum this record matters doubly: as proof that a village knows how to invent its festival again, and as a record of the moment a tradition was born that will — we hope — keep counting. The museum seeks photographs of the 2024 festival and an inventory of the memorial room: every object in it is a record waiting.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/noša-1942.jpg",
    imageCredit:
      "Foto: Tujskoprometna zveza, 1942 · Wikimedia Commons · javna last — belokranjska narodna noša: praznična obleka vasi (ilustrativna slika)",
    yearFrom: 2024,
    featured: false,
    sources: [
      {
        key: "odeon-ks-praznik",
        nameSi: "Radio Odeon — Krajevna skupnost Griblje je praznovala (17. 9. 2024; prvi praznik po desetletjih)",
        nameEn: "Radio Odeon — The Griblje local community celebrated (17 Sep 2024; the first festival in decades)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/krajevna-skupnost-griblje-je-praznovala/",
        noteSi: "Praznik KS 15. 9. 2024: spomin na napad 1941, nagovor dr. Brinca, odprtje spominske sobe.",
        noteEn: "The local community festival of 15 Sep 2024: the memory of the 1941 attack, dr. Brinc's address, the opening of the memorial room.",
      },
      {
        key: "commons-nosa-1942",
        nameSi: "Wikimedia Commons: belokranjska narodna noša 1942 (Tujskoprometna zveza)",
        nameEn: "Wikimedia Commons: the Bela krajina folk costume 1942 (Foreign Trade Association)",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("Belokranjska_narodna_noša_1942.jpg"),
        noteSi: "Glavna slika zapisa: praznična noša vasi — obraz slovesnosti, ki jo ta zapis opisuje (ilustrativno).",
        noteEn: "The record's main image: the village's festive costume — the face of the ceremony this record describes (illustrative).",
      },
    ],
  },
  {
    slug: "ljudje-ob-kolpi",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Ljudje ob Kolpi — rubrika, ki piše zgodovino vasi",
    titleEn: "People by the Kolpa — the column that writes the village's history",
    periodSi: "Radio Odeon, 2020-ta leta",
    periodEn: "Radio Odeon, the 2020s",
    summarySi:
      "Radijska rubrika, v kateri so nastali življenjepisi Dragoša, Totterjev, Barleta, Dularja, Gašperiča, Kambiča — današnji zapisovalec vasi, kakor sta bila nekoč Barle in Matiček.",
    summaryEn:
      "The radio column in which the biographies of Dragoš, the Totters, Barle, Dular, Gašperič, Kambič took shape — today's recorder of the village, as Barle and Matiček once were.",
    storySi:
      "Vsak čas ima svoj način, kako vas zapiše. Devetnajsto stoletje je imelo semeniščnike in učitelje, ki so po vaseh zbirali pesmi (Barle, Kambič, Zupaničeva Katarina); dvajseto stoletje muzeje in muzejska društva (Dular, Belokranjsko muzejsko društvo). Enaindvajseto stoletje je dobilo svoj glas v lokalnem radiu: rubrika Ljudje ob Kolpi na Radiu Odeon iz Črnomlja, ki jo piše Boris Grabrijan.\n\nRubrika je preprosta in nenadomestljiva: ob obletnicah rojstev in smrti objavlja življenjepise ljudi obkolpskega sveta. Brez nje bi bila polovica te zbirke prazna: življenjepisi Nikolaja Dragoša (najstarejšega Slovenca), Audrey Totter (holivoodska igralka z gribeljskimi koreninami), Matije Totterja (kmet-zapisovalec, ki je končal v Teksasu), Janka Barleta (zapisovalec Bele krajine), Jožeta Dularja (muzealec), Tonija Gašperiča (humorist) in Petra Kambiča (prvi učitelj) so nastali prav v tej rubriki — ob vsakem je vir naveden pri zapisu.\n\nZa muzej je to zapis o metodi: kje zgodovina male vasi danes sploh nastane. Ne v akademiji, ampak v redakciji lokalnega radia, v arhivu, ki se predvaja zjutraj ob šestih in štirideset pet. Radijski val ne pusti lista, ki bi se ga dalo dati v mapo — zato je prepisovanje in shranjevanje teh objav muzejsko dejanje po definiciji.\n\nMuzej zbira arhiv rubrike: naslove, datume, predvajanja. Vsak vrnjen zapis je dan, ko se zgodovina vasi shranila dvakrat — na valovih in na papirju.",
    storyEn:
      "Every age has its way of writing a village down. The nineteenth century had seminarians and teachers gathering songs in the villages (Barle, Kambič, Katarina Županič); the twentieth had museums and museum societies (Dular, the Bela krajina museum society). The twenty-first found its voice in local radio: the column People by the Kolpa on Radio Odeon of Črnomelj, written by Boris Grabrijan.\n\nThe column is simple and irreplaceable: on birth and death anniversaries it publishes the biographies of the Kolpa world's people. Without it half of this collection would be empty: the lives of Nikolaj Dragoš (the oldest Slovene), Audrey Totter (the Hollywood actress with Griblje roots), Matija Totter (the farmer-recorder who ended in Texas), Janko Barle (the chronicler of Bela krajina), Jože Dular (the museum man), Toni Gašperič (the humorist) and Peter Kambič (the first teacher) all took shape in this very column — each record here cites it.\n\nFor the museum this is a record about method: where the history of a small village is actually made today. Not in an academy but in a local radio newsroom, in an archive broadcast at six forty-five in the morning. A radio wave leaves no leaf to put in a folder — which is why transcribing and keeping these broadcasts is a museum act by definition.\n\nThe museum collects the column's archive: titles, dates, airings. Every recovered record is a day the village's history got saved twice — on the airwaves and on paper.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/radio-kosmaj.jpg",
    imageCredit:
      "Foto: Rasevic · Wikimedia Commons · CC BY-SA 3.0 — radijski sprejemnik Kosmaj 49 (Radio industrija Nikola Tesla): aparat, ob katerem je vas poslušala svoje",
    yearFrom: 2020,
    featured: false,
    sources: [
      {
        key: "odeon-rubrika",
        nameSi: "Radio Odeon — rubrika Ljudje ob Kolpi (serija življenjepisov, avtor Boris Grabrijan; iskalni arhiv)",
        nameEn: "Radio Odeon — the column People by the Kolpa (a series of biographies, author Boris Grabrijan; search archive)",
        sourceType: "spletni-vir",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://radio-odeon.com/iskanje/?q=Ljudje%20ob%20Kolpi",
        noteSi: "Redna rubrika z življenjepisi osebnosti obkolpskega sveta; primarni vir številnih zapisov te zbirke.",
        noteEn: "A regular column of biographies of Kolpa-world figures; the primary source of many records in this collection.",
      },
      {
        key: "commons-kosmaj",
        nameSi: "Wikimedia Commons: radijski sprejemnik Kosmaj 49 (fotograf: Rasevic)",
        nameEn: "Wikimedia Commons: the Kosmaj 49 radio receiver (photographer: Rasevic)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Rasevic)",
        url: WM("Kosmaj_49.jpg"),
        noteSi: "Glavna slika zapisa: radijski aparat jugoslovanske tovarne Nikola Tesla — medij, po katerem je vas poslušala svoje.",
        noteEn: "The record's main image: a radio set of the Yugoslav Nikola Tesla factory — the medium through which the village listened to itself.",
      },
    ],
  },
  {
    slug: "valvasor-1689",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Valvasor 1689 — prva tiskana knjiga, ki pozna ta konec",
    titleEn: "Valvasor 1689 — the first printed book that knows this corner",
    periodSi: "Die Ehre des Herzogthums Crain, 1689",
    periodEn: "Die Ehre des Herzogthums Crain, 1689",
    summarySi:
      "Slava vojvodine Kranjske — 3532 strani, v katerih je Janez Vajkard Valvasor prvi zapisal Črnomelj z okolico. Najstarejša knjiga, ki drži ta kraj med platnicami.",
    summaryEn:
      "The Glory of the Duchy of Carniola — 3,532 pages in which Janez Vajkard Valvasor first recorded Črnomelj and its surroundings. The oldest book that holds this place between its covers.",
    storySi:
      "Pred tem zapisom so bili listine — urbarji, računi, sporočila. Leta 1689 pa je izšla knjiga: Die Ehre des Herzogthums Crain, Slava vojvodine Kranjske, delo Janeza Vajkarda Valvasorja, plemiča z Bogenšperka, ki je opisal deželo, kakor je nihče pred njim — po lastnem hojenju, risanju in merjenju. Štiri zvezki, 3532 strani, 528 bakrorezov: največje delo o deželi, ki jo poznamo za Kranjsko, in prvi tiskani vir, ki pozna tudi Črnomelj z okolico.\n\nZa obkolpski konec je Valvasor mejnik, ker je postavil standard: kraj je zapisan, ko je zapisan po imenu — njegove vode, gradovi, cerkve, ljudje, šege. Vse, kar ta muzej počne — zapisovati vas z viri — je po Valvasorjevi metodi, samo z drugimi orodji: namesto bakroreza digitalna fotografija, namesto tiskarne v Nürnbergu strežnik v oblaku.\n\nZanimiva je tudi cena takšnega dejanja: Valvasor je za knjigo zapravil premoženje — Bogenšperk je moral prodati, umrl je revno, komaj petdesetleten. Zapisovati deželo v celoti je dejanje, ki zahteva vse, kar ima človek. Vas, ki to ve, ceni tudi svoje male zapisovalce: Kambiča, ki je umrl star dvajset let; Matička, ki ni smel v šolo; Dularja, ki je trideset let nosil muzej.\n\nMuzej išče izvod Slave vojvodine Kranjske v dostopu (digitalizirani izvodi obstajajo) in natančen citat o Črnomlju z okolico — vsaka vrstica, ki se nanaša na obkolpski svet, bo citirana v tej zbirki. Valvasor je začel; muzej nadaljuje.",
    storyEn:
      "Before this record there were documents — urbaria, accounts, messages. But in 1689 a book appeared: Die Ehre des Herzogthums Crain, The Glory of the Duchy of Carniola, the work of Janez Vajkard Valvasor, nobleman of Bogenšperk, who described the land as no one before him — by his own walking, drawing and measuring. Four volumes, 3,532 pages, 528 copperplates: the greatest work on the land we know as Carniola, and the first printed source that knows Črnomelj and its surroundings too.\n\nFor the Kolpa corner Valvasor is a milestone because he set the standard: a place is written down when it is written down by name — its waters, castles, churches, people, customs. Everything this museum does — writing the village down with sources — follows Valvasor's method, only with other tools: a digital photograph instead of a copperplate, a server in the cloud instead of a Nuremberg press.\n\nThe price of such an act is instructive too: Valvasor spent his fortune on the book — he had to sell Bogenšperk, died poor, barely fifty. To write a land down whole is an act that demands everything a man has. A village that knows this values its small recorders as well: Kambič, who died at twenty; Matiček, who was not allowed to school; Dular, who carried a museum for thirty years.\n\nThe museum seeks a copy of The Glory of the Duchy of Carniola within reach (digitised copies exist) and the exact passage on Črnomelj and its surroundings — every line touching the Kolpa world will be quoted in this collection. Valvasor began; the museum continues.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/valvasor.jpg",
    imageCredit:
      "Portret: Jurij Šubic · Wikimedia Commons · javna last — Janez Vajkard Valvasor, avtor Slave vojvodine Kranjske (1689)",
    yearFrom: 1689,
    yearTo: 1689,
    featured: false,
    sources: [
      {
        key: "wiki-valvasor",
        nameSi: "Wikipedija: Janez Vajkard Valvasor (Die Ehre des Herzogthums Crain, 1689; Črnomelj z okolico)",
        nameEn: "Wikipedia: Janez Vajkard Valvasor (Die Ehre des Herzogthums Crain, 1689; Črnomelj and surroundings)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Janez_Vajkard_Valvasor",
        noteSi: "Slava vojvodine Kranjske kot primarni zgodovinski vir za Črnomelj z okolico.",
        noteEn: "The Glory of the Duchy of Carniola as a primary historical source for Črnomelj and surroundings.",
      },
      {
        key: "wiki-crnomelj-valvasor",
        nameSi: "Wikipedija: Črnomelj (literatura — Valvasorjeva Slava vojvodine Kranjske, 1689)",
        nameEn: "Wikipedia: Črnomelj (literature — Valvasor's Glory of the Duchy of Carniola, 1689)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Črnomelj",
        noteSi: "Navedba Valvasorja v literaturi članka o Črnomlju.",
        noteEn: "The citation of Valvasor in the Črnomelj article's literature.",
      },
      {
        key: "commons-valvasor",
        nameSi: "Wikimedia Commons: portret Janeza Vajkarda Valvasorja (slikar: Jurij Šubic)",
        nameEn: "Wikimedia Commons: portrait of Janez Vajkard Valvasor (painter: Jurij Šubic)",
        sourceType: "fotografija",
        license: "javna last / public domain (slikar: Jurij Šubic)",
        url: WM("Jurij_Šubic_-_Janez_Vajkard_Valvasor.jpg"),
        noteSi: "Glavna slika zapisa: Valvasor — mož, ki je deželo zapisal v celoto in plačal z vsem.",
        noteEn: "The record's main image: Valvasor — the man who wrote the land down whole and paid for it with everything.",
      },
    ],
  },
  {
    slug: "pecnica-susenje-sadja",
    addedAt: "2026-09-16",
    category: "gospodarstvo",
    titleSi: "Pečnica za sušenje sadja — tovarna jesenskega dima",
    titleEn: "The fruit-drying oven — the factory of autumn smoke",
    periodSi: "tradicija 19.–20. stoletje · fotografija 1928",
    periodEn: "a tradition of the 19th–20th centuries · photographed 1928",
    summarySi:
      "Jeseni so ob Kolpi dišali dim in pečene slive: pečnica za sušenje sadja je kmetiji delala shrambo za zimo. Na fotografiji Franca Vesela iz Adlešičev (1928) dela cela družina.",
    summaryEn:
      "In autumn the Kolpa valley smelled of smoke and baked plums: the fruit-drying oven turned the farm's harvest into a winter larder. In Fran Vesel's photograph from Adlešiči (1928) a whole family works.",
    storySi:
      "Jesen je ob Kolpi imela svojo tovarno: pečnico za sušenje sadja. Iz sadjarjevih vrtov so v njej sušili slive in jabolka — počasi, ob nizkem ognju, dneve in dneve — dokler ni iz košare sadja nastala polica suhih prstov, ki so jih imenovali pečene slive. Suho sadje je bilo zimska valuta: otroški prigrizek, priloga koruzi in fižolu, darilo, ki se je delilo po hlevih in po svatbah.\n\nFotografija, ki drži ta zapis, je dokument Franca Vesela iz leta 1928, posneta v Adlešičih — sosednji vasi ob Kolpi, šest kilometrov od Gribelj. Na njej dela cela družina: ženske pri razdeljevanju sadja, moški pri pečnici, otroci ob ladjah. Enako pečnico je nosila skoraj vsaka vaška domačija Bele krajine — tudi podrebrska sušilnica za sadje ob slavni lipi v Semiški občini je zapisana v isti spomin.\n\nZapis je označen kot tradicija, ne kot dokumentiran gribeljski primer: muzej iskreno priznava, da fotografija iz Gribelj samih še ni našel. Iščemo: zadnjo pečnico za sušenje sadja na Gribljah, ime zadnje sušilke sliv in recept za zimo, ki se je pisal z dimom. Vsak odgovor bo ta zapis pripeljal domov — kakor je ves ta muzej nastajal: en spomin naenkrat.",
    storyEn:
      "Autumn in the Kolpa valley had its own factory: the fruit-drying oven. From the orchards it dried plums and apples — slowly, over a low fire, day after day — until a basket of fruit became a shelf of dried 'fingers' the village called pečene slive, baked plums. Dried fruit was the winter currency: a child's treat, a companion to maize and beans, a gift shared at weddings and around the yards.\n\nThe photograph that holds this record is Fran Vesel's document from 1928, taken in Adlešiči — a neighbouring village on the Kolpa, six kilometres from Griblje. A whole family works in it: women sorting fruit, men at the oven, children by the ladders. Nearly every Bela krajina farmstead kept such an oven — the fruit-drying house by the famous linden at Podreber in the Semič municipality is remembered in the same breath.\n\nThe record is marked as tradition, not as a documented Griblje case: the museum honestly admits that a photograph from Griblje itself has not yet been found. We seek: the last fruit-drying oven at Griblje, the name of the last woman who dried plums, and the recipe for a winter that was written in smoke. Every answer will bring this record home — the way this whole museum has grown: one memory at a time.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/pecnica-susenje.jpg",
    imageCredit:
      "Foto: Fran Vesel, 1928 · Wikimedia Commons / Slovenski etnografski muzej · javna last — pečnica za sušenje sadja v Adlešičih (Bela krajina)",
    yearFrom: 1928,
    yearTo: 1928,
    featured: false,
    sources: [
      {
        key: "commons-pecnica",
        nameSi: "Wikimedia Commons: pečnica za sušenje sadja v Adlešičih (fotograf: Fran Vesel, 1928)",
        nameEn: "Wikimedia Commons: the fruit-drying oven at Adlešiči (photographer: Fran Vesel, 1928)",
        sourceType: "fotografija",
        license: "javna last / public domain (fotograf: Fran Vesel)",
        url: WM("Pečnica_za_sušenje_sadja_v_Adlešičih.jpg"),
        noteSi: "Glavna slika zapisa: avtentična fotografija sušenja sadja v sosednji vasi ob Kolpi — šest kilometrov od Gribelj.",
        noteEn: "The record's main image: an authentic photograph of fruit drying in a neighbouring village on the Kolpa — six kilometres from Griblje.",
      },
      {
        key: "ro-podreber-susilnica",
        nameSi: "Radio Odeon: Semič v starih cajtih — podrebrska lipa in sušilnica za sadje (9. 7. 2026)",
        nameEn: "Radio Odeon: Semič in the old times — the Podreber linden and the fruit-drying house (9 July 2026)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://www.radio-odeon.com/novice/semic-v-starih-cajtih-574/",
        noteSi: "Sušilnica za sadje kot sestavni del vaškega prostora Bele krajine: »Pod lipo je stala sušilnica za sadje.«",
        noteEn: "The fruit-drying house as a standard part of the Bela krajina village space: “Under the linden stood the fruit-drying house.”",
      },
      {
        key: "ro-stavbna-dediscina",
        nameSi: "Radio Odeon: Stavbna dediščina podeželja (16. 1. 2021)",
        nameEn: "Radio Odeon: The building heritage of the countryside (16 January 2021)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://www.radio-odeon.com/novice/stavbna-dediscina-podezelja/",
        noteSi: "Domačije Bele krajine, Pokolpja in Žumberka: poslopja, ki so rasla iz kraškega sveta in njemu prilagojenega kmetovanja.",
        noteEn: "The farmsteads of Bela krajina, Pokolpje and Žumberak: buildings that grew out of the karst world and the farming shaped by it.",
      },
    ],
  },
  {
    slug: "stari-zemljevidi",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Stari zemljevidi — kako je vas prišla na papir",
    titleEn: "Old maps — how the village reached the paper",
    periodSi: "1468–1843",
    periodEn: "1468–1843",
    summarySi:
      "Griblach 1468, Grüble v urbarjih in na najstarejšem zemljevidu, karta vojvodine iz Valvasorjevega gradiva (1714) in Freyerjeva Special-Karte, ki je narisala vsako vas: pet stoletij, v katerih se je Griblje pisalo v svet.",
    summaryEn:
      "Griblach in 1468, Grüble in the urbaria and on the oldest map, a duchy map from Valvasor's material (1714) and Freyer's Special-Karte that drew every village: five centuries in which Griblje wrote itself into the world.",
    storySi:
      "Preden je vas obstajala na papirju, je obstajala v hoji. Leto 1468: na listini, ki jo hrani arhiv, se prvič pojavi ime Griblach; sledita Briglach (1490) in Griblah (1593). V urbarjih — seznamih davkov in dolžnosti — in na najstarejšem zemljevidu se ime piše Grüble. Vsak zapis je bil dejanje oblasti: kar je bilo zapisano, je bilo obdavčeno, obranjeno, branjeno.\n\nSlika, ki drži ta zapis, je iz zlatega obdobja te pismenosti: Tabula Ducatus Carnioliae, Vindorum Marchiae et Histriae — karta vojvodine Kranjske z Belo krajino (Vindorum Marchia, »Dežela vindijska«) in Istro, ki jo je leta 1714 izdelal slavni nugiški kartograf Johann Baptist Homann po gradivu Janeza Vajkarda Valvasorja. Eno list, na katerem je cela dežela: mokrača Cerkniškega jezera, gorovja, mesta — in na jugovzhodu, ob meji, ki jo riše Kolpa, dežela, v kateri leži tudi ta vas.\n\nZemljevidi so se nato drobili vedno globlje: leta 1843 je Henrik Freyer izdal Special-Karto vojvodine Kranjske — kartografski podvig, na katerem je vsaka vas dobila svoje ime in svoj prostor. Danes se isti pogled nadaljuje s satelita: zapis o številkah vasi nosi posnetek z Mednarodne vesoljske postaje. Od urbarja do orbite je isti domislej: kraj, ki ni zapisan, ni zastopan.\n\nMuzej išče: izvleček Special-Karte 1843 z imenom vasi v berljivi velikosti in digitaliziran urbar, v katerem stoji Grüble. Oba bosta pripeljala ta zapis korak bližje papirju, na katerem se je vse začelo.",
    storyEn:
      "Before the village existed on paper, it existed in walking. In 1468 a document kept in the archive first carries the name Griblach; Briglach (1490) and Griblah (1593) follow. In the urbaria — the registers of dues and duties — and on the oldest map the name is written Grüble. Every entry was an act of power: what was written down was taxed, tilled, defended.\n\nThe image that holds this record comes from the golden age of that literacy: the Tabula Ducatus Carnioliae, Vindorum Marchiae et Histriae — a map of the Duchy of Carniola with Bela krajina (the Windic March) and Istria, prepared in 1714 by the famous Nuremberg cartographer Johann Baptist Homann from the material of Janez Vajkard Valvasor. One sheet holding a whole country: the waters of Lake Cerknica, the mountains, the towns — and in the south-east, along the border drawn by the Kolpa, the land in which this village lies.\n\nThe maps then kept sharpening: in 1843 Henrik Freyer published his Special-Karte of the Duchy of Carniola — a cartographic feat on which every village received its name and its place. Today the same gaze continues from orbit: the record about the village in numbers carries a photograph from the International Space Station. From urbarium to orbit runs one idea: a place that is not written down is not represented.\n\nThe museum seeks: an excerpt of the 1843 Special-Karte with the village name in legible size, and a digitised urbarium carrying Grüble. Both will bring this record a step closer to the paper on which it all began.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/stari-zemljevid.jpg",
    imageCredit:
      "Bakrorez: Johann Baptist Homann (1663–1724) po gradivu Janeza Vajkarda Valvasorja · Wikimedia Commons · javna last — Tabula Ducatus Carnioliae, Vindorum Marchiae et Histriae (1714): Kranjska z Belo krajino (Vindorum Marchia) in Istro",
    yearFrom: 1468,
    yearTo: 1843,
    featured: false,
    sources: [
      {
        key: "wiki-griblje-ime",
        nameSi: "Wikipedija: Griblje (ime vasi: Griblach 1468, urbarji in najstarejši zemljevid Grüble)",
        nameEn: "Wikipedia: Griblje (the village name: Griblach 1468, the urbaria and the oldest map Grüble)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Griblje",
        noteSi: "Zgodovina imena vasi: prvi zapis 1468 kot Griblach, v urbarjih in na najstarejšem zemljevidu Grüble.",
        noteEn: "The history of the village name: first recorded in 1468 as Griblach, in the urbaria and on the oldest map as Grüble.",
      },
      {
        key: "commons-homann",
        nameSi: "Wikimedia Commons: Tabula Ducatus Carnioliae, Vindorum Marchiae et Histriae (Homann, 1714)",
        nameEn: "Wikimedia Commons: Tabula Ducatus Carnioliae, Vindorum Marchiae et Histriae (Homann, 1714)",
        sourceType: "zemljevid",
        license: "javna last / public domain (kartograf: Johann Baptist Homann)",
        url: WM("Tabula_Ducatus_Carnioliae,_Vindorum_Marchiae_et_Histriae.jpg"),
        noteSi: "Glavna slika zapisa: karta vojvodine z Belo krajino (Vindorum Marchia), izdelana po Valvasorjevem gradivu.",
        noteEn: "The record's main image: the duchy map with Bela krajina (the Windic March), drawn from Valvasor's material.",
      },
      {
        key: "commons-freyer",
        nameSi: "Wikimedia Commons: Special-Karte des Herzogthums Krain 1843 (Henrik Freyer; Digitalna knjižnica Slovenije)",
        nameEn: "Wikimedia Commons: Special-Karte des Herzogthums Krain 1843 (Henrik Freyer; Digital Library of Slovenia)",
        sourceType: "zemljevid",
        license: "javna last / public domain (kartograf: Henrik Freyer)",
        url: WM("Special-Karte_des_Herzogthums_Krain_1843.jpg"),
        noteSi: "Special-Karta 1843: prva kartografska upodobitev Kranjske, na kateri ima vsaka vas svoje ime.",
        noteEn: "The 1843 Special-Karte: the first cartographic rendering of Carniola on which every village carries its name.",
      },
      {
        key: "simec-ime",
        nameSi: "Jože Šimec: Izvor imena vasi Griblje, Dolenjski list, 11. 1. 2001",
        nameEn: "Jože Šimec: The origin of the village name Griblje, Dolenjski list, 11 January 2001",
        sourceType: "objava",
        license: "navedba vira",
        noteSi: "Članek o izvoru imena vasi (gribljati — brazdati, orati), naveden v virih Wikipedije.",
        noteEn: "The article on the origin of the village name (gribljati — to furrow, to plough), cited in Wikipedia's sources.",
      },
    ],
  },
  {
    slug: "sd-griblje-sport",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "ŠD Griblje — tekaški korak vasi",
    titleEn: "ŠD Griblje — the village's running stride",
    periodSi: "društvo z več kot 40-letno tradicijo",
    periodEn: "a society with more than 40 years of tradition",
    summarySi:
      "Tekači Športnega društva Griblje vsako jesen stopijo na štart ljubljanskega maratona, Peter Križan pa se je pomeril na svetovnem prvenstvu v triatlonu. Društvo nosi šport v vasi — od julijskega športnega srečanja do šolskih pohodov.",
    summaryEn:
      "Every autumn the runners of the Sports Society Griblje step onto the start line of the Ljubljana marathon, and Peter Križan has raced at the triathlon world championship. The society carries sport through the village — from the July sports meeting to school hikes.",
    storySi:
      "Vas, ki je dala maratonca Cirila Totterja, je tek vzela za svojega. Športno društvo Griblje — z več kot štiridesetletno tradicijo — vsako pomlad pripravi športno srečanje, na katerem se vas pomeri v malem nogometu in drugih športih, jeseni pa njegovi tekači stopijo na štart največje tekaške prireditve v državi.\n\nNa 26. ljubljanskem maratonu leta 2022 jih je teklo sedem: štirje na desetih kilometrih, dva na polmaratonu, maratonsko razdaljo pa je pretekel Ciril Totter. Dve leti pozneje, na 28. maratonu, se je med 21.172 tekači znašla spet sedmerica iz Gribelj — šola vzdržljivosti, ki se prenaša kot kmečka delovna navada.\n\nNajdlje je šel Peter Križan: na svetovnem prvenstvu v triatlonu v španskem Torremolinosu (1500 m plavanja, 40 km kolesa, 10 km teka) se je med 76 športniki svoje starostne kategorije uvrstil na 27. mesto — po lanskem desetem. Šola pa tudi ona teče: učenci podružnične šole Griblje so na športnem dnevu po planinski poti stopili na Markovo glavo, 755 metrov visok hrib nad Črmošnjicami.\n\nSlika, ki drži ta zapis, je prizorišče teh štartov: množica tekačev pod startnim lokom ljubljanskega maratona. Muzej išče fotografije gribeljskih tekačev na štartu in na cilju — vsak čas, vsak cilj, ki ga je nosila ta vas, je zapis vreden.",
    storyEn:
      "A village that gave the marathon man Ciril Totter took running for its own. The Sports Society Griblje — with more than forty years of tradition — prepares a sports meeting each July on which the village competes in five-a-side football and other sports, and in autumn its runners step onto the start line of the country's largest running event.\n\nAt the 26th Ljubljana marathon in 2022 seven of them ran: four over ten kilometres, two over the half, and Ciril Totter over the full marathon distance. Two years later, at the 28th marathon, a seven from Griblje stood among 21,172 runners again — a school of endurance passed down like a farming work habit.\n\nPeter Križan went furthest: at the triathlon world championship finals in Torremolinos, Spain (1500 m swim, 40 km bike, 10 km run), he placed 27th among 76 athletes of his age group — after tenth place the year before. And the school runs too: on a sports day the pupils of the Griblje branch school climbed the marked path to Markova glava, a 755-metre hill above Črmošnjice.\n\nThe image that holds this record is the scene of those starts: a crowd of runners under the start arch of the Ljubljana marathon. The museum seeks photographs of Griblje runners at the start and at the finish — every time, every finish this village has carried is worth a record.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/maraton-start.jpg",
    imageCredit:
      "Foto: Petar Milošević · Wikimedia Commons · CC BY-SA 3.0 — štart 17. ljubljanskega maratona (2012): jesensko prizorišče, na katerega vsako leto privihajo tudi gribeljski tekači",
    yearFrom: 1985,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "ro-maraton-2022",
        nameSi: "Radio Odeon: Člani ŠD Griblje na Ljubljanskem maratonu (24. 10. 2022)",
        nameEn: "Radio Odeon: Members of ŠD Griblje at the Ljubljana marathon (24 October 2022)",
        sourceType: "objava",
        license: "navedba vira (vir: ŠD Griblje)",
        url: "https://radio-odeon.com/sport/clani-sd-griblje-na-ljubljanskem-maratonu/",
        noteSi: "Sedem tekačev ŠD Griblje na 26. maratonu; maratonsko razdaljo je pretekel Ciril Totter.",
        noteEn: "Seven runners of ŠD Griblje at the 26th marathon; Ciril Totter ran the full marathon distance.",
      },
      {
        key: "ro-krizan-2024",
        nameSi: "Radio Odeon: Peter Križan na triatlonu v Španiji, sedmerica na maratonu v Ljubljani (23. 10. 2024)",
        nameEn: "Radio Odeon: Peter Križan at the triathlon in Spain, a seven at the Ljubljana marathon (23 October 2024)",
        sourceType: "objava",
        license: "navedba vira (vir: ŠD Griblje)",
        url: "https://radio-odeon.com/sport/peter-krizan-na-tratlonu-v-spaniji-gribeljci-na-maratonu-v-ljubljani/",
        noteSi: "Svetovno prvenstvo v triatlonu Torremolinos: 27. mesto med 76 tekmovalci; 28. maraton s 21.172 udeleženci.",
        noteEn: "World triathlon championship finals in Torremolinos: 27th among 76 competitors; the 28th marathon with 21,172 participants.",
      },
      {
        key: "ro-sportni-dan",
        nameSi: "Radio Odeon: Športni dan — PŠ Griblje (4. 11. 2021)",
        nameEn: "Radio Odeon: Sports day — the Griblje branch school (4 November 2021)",
        sourceType: "objava",
        license: "navedba vira (vir: OŠ Loka, PŠ Griblje)",
        url: "https://radio-odeon.com/sport/sportni-dan-ps-griblje/",
        noteSi: "Pohod učencev na Markovo glavo (755 m) pri Brezovici pri Črmošnjicah.",
        noteEn: "The pupils' hike to Markova glava (755 m) near Brezovica pri Črmošnjicah.",
      },
      {
        key: "commons-maraton",
        nameSi: "Wikimedia Commons: Ljubljanski maraton (fotograf: Petar Milošević, štart 17. maratona 2012)",
        nameEn: "Wikimedia Commons: the Ljubljana marathon (photographer: Petar Milošević, start of the 17th marathon, 2012)",
        sourceType: "fotografija",
        license: "CC BY-SA 3.0 (fotograf: Petar Milošević)",
        url: WM("Ljubljanski_maraton.JPG"),
        noteSi: "Glavna slika zapisa: prizorišče jesenskih štartov gribeljskih tekačev.",
        noteEn: "The record's main image: the scene of the autumn starts of the Griblje runners.",
      },
    ],
  },
  {
    slug: "belokranjska-nosa",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Belokranjska noša — bela ruta, ki nosi pokrajino",
    titleEn: "The Bela krajina costume — the white cloth that carries a region",
    periodSi: "noša 19. stoletje · študija 1928 · živeti še danes",
    periodEn: "the 19th-century dress · the 1928 study · alive today",
    summarySi:
      "Dvodelna ženska obleka iz rokavcev in nagubanega krila, bogato okrašena, z belo pečo na glavi — po kateri se belokranjska noša loči od vseh drugih. Prvo znanstveno študijo o peči je napisal Stanko Vurnik leta 1928.",
    summaryEn:
      "A two-part women's dress of sleeves and pleated skirt, richly decorated, with the white peča on the head — by which the Bela krajina costume stands apart from all others. The first scholarly study of the peča was written by Stanko Vurnik in 1928.",
    storySi:
      "Kadar se je belokranjska žena oblekla praznično, se je pokrajina ogledala v njej. Ženska noša je dvodelna: rokavci — nasičeno okrašen zgornji del — in nagubano krilo; dopolnjujeta jima predpasnik, volnen pas iz oranžnordečih in črnih nitic ter obutev, poleti platnene copate, prevezane z rdečimi, rumenimi in modrimi nitmi. Nakit je bil skromen: poštenost te noše je v tkanini.\n\nNad vsem pa stoji peča — bela ruta iz lanenega blaga z vezenino ali čipkasto obrobo, vezana zadaj; pozimi prekrižana pod brado, praznična pa na čelu tvori rožo, ki se od kraja do kraja razlikuje po zaključku. Prvi, ki je pečo vzresobil v znanost, je bil etnograf Stanko Vurnik: njegova študija iz leta 1928, ki jo hrani Wikimedia Commons, sledi beli ruti od srednjeveških fresk do vaških glav — risba na njej kaže, kako se je vezala. Moška noša je bila preprostejša: široke platnene hlače, srajca brez ovratnika, usnjen pas in klobuk; usnjene opanke so si moški obuli za praznike, poleti pa pogosto hodili bosi.\n\nV Gribljah je noša živela, dokler je ni zamenjalo trgovsko blago; danes stopa iz omare na Jurjevanju v Črnomlju in na dnevih narodnih noš — leta 2025 je bila Bela krajina osrednja gostja kamniških dnevov, Guardian pa je ta festival uvrstil med dvajset najboljših tradicionalnih prireditev Evrope. Muzej išče: fotografijo gribeljske družine v noši in ime zadnje ženske v vasi, ki je pečo znala vezati praznično.",
    storyEn:
      "When a Bela krajina woman dressed for a feast, the region saw itself in her. The women's dress is two-part: the rokavci — a richly decorated bodice — and the pleated skirt; they are joined by an apron, a wool belt of orange-red and black threads, and footwear — in summer canvas shoes tied with red, yellow and blue threads. Jewellery was sparse: the honesty of this costume lives in the cloth.\n\nAbove all stands the peča — a white linen cloth with embroidery or a lace border, tied at the back; in winter crossed under the chin, while the festive one forms a flower on the forehead whose finish differs from place to place. The first to raise the peča into scholarship was the ethnographer Stanko Vurnik: his 1928 study, kept on Wikimedia Commons, follows the white cloth from medieval frescoes to village heads — the drawing in it shows how it was tied. The men's dress was simpler: wide linen trousers, a collarless shirt, a leather belt and a hat; men put their leather opanke on for feasts and often walked barefoot in summer.\n\nIn Griblje the costume lived until shop goods replaced it; today it steps out of the wardrobe at Jurjevanje in Črnomelj and at the days of national costumes — in 2025 Bela krajina was the central guest of the Kamnik festival, and The Guardian has listed it among the twenty best traditional events of Europe. The museum seeks: a photograph of a Griblje family in the costume, and the name of the last woman in the village who could tie the festive peča.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/peca-1928.jpg",
    imageCredit:
      "Risba: Stanko Vurnik, »Peča« (1928) · Wikimedia Commons · javna last — vezava bele peče, značilnega pokrivala belokranjske ženske noše",
    yearFrom: 1928,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "rtv-nosa-2025",
        nameSi: "RTV SLO: Na dnevih narodnih noš v Kamniku osrednja gostja Bela krajina (12. 9. 2025)",
        nameEn: "RTV SLO: At the days of national costumes in Kamnik the central guest is Bela krajina (12 September 2025)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://www.rtvslo.si/zabava-in-slog/popkultura/retro/na-dnevih-narodnih-nos-v-kamniku-osrednja-gostja-bela-krajina/757370",
        noteSi: "Podroben opis noše: dvodelna ženska obleka, peča z rožo na čelu, platnene copate z barvnimi nitmi, volnene pasove, moška obleka.",
        noteEn: "A detailed description of the costume: the two-part women's dress, the peča with its forehead flower, canvas shoes with coloured threads, wool belts, the men's dress.",
      },
      {
        key: "commons-peca-1928",
        nameSi: "Wikimedia Commons: Stanko Vurnik, »Peča« (1928) — prva znanstvena študija o pokrivalu",
        nameEn: "Wikimedia Commons: Stanko Vurnik, »Peča« (1928) — the first scholarly study of the head covering",
        sourceType: "objava",
        license: "javna last / public domain (avtor: Stanko Vurnik)",
        url: WM("Stanko_Vurnik_-_Peča_1928.pdf"),
        noteSi: "Glavna slika zapisa: risba vezave peče iz Vurnikove študije; sledi beli ruti od fresk do vaških glav.",
        noteEn: "The record's main image: the drawing of the peča binding from Vurnik's study; it follows the white cloth from frescoes to village heads.",
      },
      {
        key: "kamra-nosa",
        nameSi: "Kamra / Album Slovenije: Belokranjska narodna noša (27. 11. 2018, objavila Knjižnica Metlika)",
        nameEn: "Kamra / Album of Slovenia: The Bela krajina national costume (27 November 2018, published by the Metlika Library)",
        sourceType: "fotografija",
        license: "navedba vira (fotografijo prispeval Janko Bračika)",
        url: "https://www.kamra.si/album-slovenije/belokranjska-narodna-nosa",
        noteSi: "Fotografija Božidarja Flajšmana in Zvonke Bračika v belokranjski noši na Jurjevanju 1966 — pričevanje, kako je noša stopala na praznike.",
        noteEn: "The photograph of Božidar Flajšman and Zvonka Bračika in the Bela krajina costume at Jurjevanje 1966 — a testimony of how the costume stepped out for feasts.",
      },
      {
        key: "svet24-nosa-2020",
        nameSi: "Svet24: Belokranjska ljudska noša v likovni podibi — spletna razstava Belokranjskega muzeja (15. 4. 2020)",
        nameEn: "Svet24: The Bela krajina folk costume in pictures — the online exhibition of the Bela krajina Museum (15 April 2020)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://svet24.si/novice/kultura/belokranjska-ljudska-nosa-v-likovni-podobi-oglejte-si-jo-236296-1788082",
        noteSi: "Belokranjski muzej Metlika je med zaprtjem razstavo predstavil na spletu — noša tudi v likovni podobi.",
        noteEn: "During the closure the Bela krajina Museum in Metlika presented the exhibition online — the costume in its pictorial form too.",
      },
    ],
  },
  {
    slug: "kanizarica",
    addedAt: "2026-09-16",
    category: "gospodarstvo",
    titleSi: "Rudnik Kanižarica — industrijsko srce vasi, sedem kilometrov stran",
    titleEn: "The Kanižarica mine — the industrial heart of the village, seven kilometres away",
    periodSi: "rudnik 1857–1997 · muzej od 2022",
    periodEn: "the mine 1857–1997 · the museum since 2022",
    summarySi:
      "Sto štirideset let je rjavi premog iz Kanižarice pri Črnomlju gnal gospodarstvo Bele krajine: rudarji iz vse pokrajine, med njimi tudi moški z Gribelj, so se vsak dan spustili pod zemljo. Danes tam stoji muzej — z umetnim rovom in Perkmandeljcem.",
    summaryEn:
      "For one hundred and forty years the brown coal of Kanižarica near Črnomelj drove the economy of Bela krajina: miners from all over the region, men from Griblje among them, went underground every day. Today a museum stands there — with an artificial tunnel and the Perkmandelc.",
    storySi:
      "Najbližja stvar industrijski revoluciji, ki jo je Griblje kdaj videlo, se je prižgala sedem kilometrov stran: rudnik rjavega premoga Kanižarica, odprt leta 1857, je sto štirideset let kasneje predstavljalo največji delčniški rudnik na svetu; deloval je vse do leta 1997. Vozili so tja moški z vse Bele krajine — s kolesom, z avtobusom, peš čez Dobličico — in se spustili v rov, kjer jih je čakal premog, prah in Perkmandeljc, rudniški škrat, ki opozarja na nevarnost in kaznuje nepoštene.\n\nOb rudniku je zrasla kolonija — vrstne hiše rudarskih družin — in z njo cela industrijska pokrajina: opekarna, železnica, delavski soldi, ki so živeli v črnomaljskih trgovinah. Premog iz Kanižarice je kuril šole, cerkve in domače peči; za marsikatero kmečko družino z obkolpskih vasi je bil rudniški dohodek tisto, kar je držalo zimo nad vodo.\n\nLeta 2022 je občina Črnomelj muzejsko zbirko rudnika predala v upravljanje RIC-u Bela krajina: obiskovalec danes vidi prenovljeni izvozni stolp (prenova je stala nekaj manj kot 90.000 evrov), geološko zgodovino pokrajine, tehnološki postopek rudarjenja — in umetni rudniški rov, v katerem prebiva Perkmandeljc. Ta zapis povezuje digitalni muzej vasi s fizičnim muzejem rudnika: dva spomina na isto pokrajino. Muzej išče: imena gribeljskih rudarjev, njihove izmene in fotografije iz jame — vsak čelada, ki je visela v Gribljah, je zapis vreden.",
    storyEn:
      "The nearest thing to an industrial revolution Griblje ever saw lit up seven kilometres away: the brown-coal mine of Kanižarica, opened in 1857, was for stretches the largest shareholder-owned mine in the world, and it worked until 1997. Men drove there from all over Bela krajina — by bicycle, by bus, on foot across the Dobličica — and went down into the tunnel where coal, dust and the Perkmandelc awaited: the mine dwarf who warns of danger and punishes the dishonest.\n\nA colony grew by the mine — rows of houses for miners' families — and with it a whole industrial landscape: a brickworks, a railway, workers' wages that lived in the shops of Črnomelj. Kanižarica coal heated schools, churches and home stoves; for many a farming family of the Kolpa villages the miners' income was what kept the winter above water.\n\nIn 2022 the municipality of Črnomelj handed the mine's museum collection to RIC Bela krajina: today the visitor sees the renewed exit tower (the renovation cost just under 90,000 euros), the geological history of the region, the technological process of mining — and an artificial mine tunnel in which the Perkmandelc dwells. This record joins the village's digital museum to the mine's physical one: two memories of the same landscape. The museum seeks: the names of Griblje miners, their shifts and photographs from the pit — every helmet that hung in Griblje is worth a record.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/kanizarica.jpg",
    imageCredit:
      "Foto: Andrejj · Wikimedia Commons · CC BY-SA 4.0 — ostanki rudnika rjavega premoga Kanižarica: poslopje in izvozni stolp",
    yearFrom: 1857,
    yearTo: 1997,
    featured: false,
    sources: [
      {
        key: "rtv-kanizarica-2022",
        nameSi: "RTV SLO: Muzej rudnika Kanižarica predan v upravljanje RIC-u Bela krajina (22. 2. 2022)",
        nameEn: "RTV SLO: The Kanižarica mine museum handed to RIC Bela krajina (22 February 2022)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://www.rtvslo.si/kultura/dediscina/muzej-rudnika-kanizarica-predan-v-upravljanje-ric-u-bela-krajina/613386",
        noteSi: "Rudnik je deloval 1857–1997; prenovljeni izvozni stolp, umetni rov s Perkmandeljcem, prenova ~90.000 €.",
        noteEn: "The mine worked 1857–1997; the renewed exit tower, the artificial tunnel with the Perkmandelc, the renovation ~€90,000.",
      },
      {
        key: "wiki-kanizarica",
        nameSi: "Wikipedija: Kanižarica (naselje in rudnik rjavega premoga)",
        nameEn: "Wikipedia: Kanižarica (the settlement and the brown-coal mine)",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Kanižarica",
        noteSi: "Naselje ob Dobličici s Staro kolonijo rudarskih hiš; rudnik v postopku zapiranja, danes poslovno-industrijska cona.",
        noteEn: "The settlement on the Dobličica with the Old Colony of miners' houses; the mine in closure, today a business-industrial zone.",
      },
      {
        key: "ro-mestni-muzej-2026",
        nameSi: "Radio Odeon: Mestna muzejska zbirka z novim imenom — Mestni muzej Črnomelj (7. 8. 2026)",
        nameEn: "Radio Odeon: The town museum collection with a new name — the Črnomelj Town Museum (7 August 2026)",
        sourceType: "objava",
        license: "navedba vira (vir: RIC Bela krajina)",
        url: "https://radio-odeon.com/novice/mestna-muzejska-zbirka-z-novim-imenom/",
        noteSi: "Muzej rudnika Kanižarica je od 2022 del sistema RIC Bela krajina — ob mestnem muzeju, Zakladnici in spominski hiši Otona Župančiča.",
        noteEn: "The Kanižarica mine museum has been part of the RIC Bela krajina system since 2022 — beside the town museum, the Treasury and the memorial house of Oton Župančič.",
      },
      {
        key: "commons-kanizarica",
        nameSi: "Wikimedia Commons: Rudnik Kanižarica (fotograf: Andrejj)",
        nameEn: "Wikimedia Commons: the Kanižarica mine (photographer: Andrejj)",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0 (fotograf: Andrejj)",
        url: WM("Rudnik_Kanižarica.jpg"),
        noteSi: "Glavna slika zapisa: ohranjeno poslopje z izvoznim stolpom nekdanjega premogovnika.",
        noteEn: "The record's main image: the preserved building with the exit tower of the former coal mine.",
      },
    ],
  },
  {
    slug: "sturm-1891",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Einzelhof v Gribljah — najstarejša znana slika vasi (1891)",
    titleEn: "A farmstead in Griblje — the oldest known picture of the village (1891)",
    periodSi: "1891 · Dunaj — Griblje",
    periodEn: "1891 · Vienna — Griblje",
    summarySi:
      "Ko je po naročilu prestolonaslednika Rudolfa nastajala velika enciklopedija avstro-ogrske monarhije, je med 24 zvezki za Kranjsko slikar Josef Sturm naslikal tudi kmetijo v Gribljah. Natisnjena leta 1891 je danes najstarejša znana podoba vasi.",
    summaryEn:
      "When the great encyclopedia of the Austro-Hungarian Monarchy was being written on the orders of Crown Prince Rudolf, the painter Josef Sturm painted, among his Carniolan views for volume 8, a farmstead in Griblje. Printed in 1891, it is today the oldest known picture of the village.",
    storySi:
      "Leta 1891 je na Dunaju izšel osmi zvezek enciklopedije Die österreichisch-ungarische Monarchie in Wort und Bild — Kärnten und Krain. Delo, ki ga je naročil prestolonaslednik Rudolf sam, je hotel celotno monarhijo pokazati skozi njene dežele in ljudi; med slovenskimi kmetijami je za tipični primer samotne kmetije Spodnje Kranjske izbral — Griblje.\n\nSliko je prispeval Josef Sturm (1858–1935), dunajski Slovenec, ki je za ta zvezek naslikal deset spomenikov Kranjske: Novo mesto, Otočec, Metliko, Žužemberk, Kočevje, Podstenice, Kamen pri Begunjah, kmetijo v zgornji savski dolini, kmetijo v Gribljah in Vreme. Bakrorez, ki je pred vami, kaže, kar kaže: kmetijo s slamnima strehama, dvorišče s piščanci, dve ženi pri delu, drevesa in nizko nebo Bele krajine.\n\nKnjižni tekst ob sliki je prvi ohranjeni stavki o gribeljski arhitekturi: »Med hišami je zid z obokanim vhodom brez strehe; s kamnitimi ploščami tlakovan ozek dvorišče je odprto samo proti vrtu na zadnji strani. V globini veže je zelo nizko, prostorno ognjišče, ob katerem ljudje pozimi čepijo in raje zmrzujejo z ene strani ter se žgejo z druge, kot da bi kurili v peči.« Tipična kmetija — takšna, da se je pisalo o njej v cesarski enciklopediji.\n\nMuzej hrani to ploščo kot najstarejši predmet svoje zbirke: 135 let star pogled na vas, iz katere je rasel vse, kar danes razstavljamo. Iščemo: ali katera hiša na sliki še stoji — in katera.",
    storyEn:
      "In 1891 the eighth volume of the encyclopedia Die österreichisch-ungarische Monarchie in Wort und Bild — Kärnten und Krain — appeared in Vienna. The work, commissioned by Crown Prince Rudolf himself, meant to show the whole Monarchy through its lands and its people; among the Slovene farmsteads it chose, as the typical example of a single farmstead of Lower Carniola — Griblje.\n\nThe picture was contributed by Josef Sturm (1858–1935), a Viennese Slovene who painted ten monuments of Carniola for this volume: Novo mesto, Otočec, Metlika, Žužemberk, Kočevje, Podstenice, Kamen pri Begunjah, a farm in the upper Sava valley, a farm in Griblje, and Vreme. The engraving before you shows what it shows: a farmstead under two thatched roofs, a yard with chickens, two women at their work, the trees and the low sky of Bela krajina.\n\nThe printed text beside the picture holds the first surviving sentences about Griblje's architecture: 'Between the houses runs a wall with an arched, roofless gateway; the narrow yard, paved with stone slabs, is open only towards the garden behind. In the depth of the entrance hall is a very low, roomy hearth, around whose fire people squat in winter, preferring to freeze on one side and scorch on the other rather than heat a stove.' A typical farmstead — such that an imperial encyclopedia wrote about it.\n\nThe museum keeps this plate as the oldest object of its collection: a 135-year-old look at the village from which everything displayed here has grown. We seek: whether any house in the picture still stands — and which one.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/sturm-1891.jpg",
    imageCredit:
      "Bakrorez po sliki Josefa Sturma: »Ein Einzelhof in Grible«, v: Die österreichisch-ungarische Monarchie in Wort und Bild, zv. 8 (Kärnten und Krain), Dunaj 1891, str. 401 · digitalizat Austria-Forum / Avstrijska nacionalna knjižnica · javna last",
    yearFrom: 1891,
    yearTo: 1891,
    featured: true,
    sources: [
      {
        key: "austria-forum-band8",
        nameSi: "Austria-Forum / ONB: Die österreichisch-ungarische Monarchie in Wort und Bild, zv. 8 — Kärnten und Krain (1891), stran s ploščo",
        nameEn: "Austria-Forum / ONB: Die österreichisch-ungarische Monarchie in Wort und Bild, vol. 8 — Kärnten und Krain (1891), the page with the plate",
        sourceType: "objava",
        license: "javna last / public domain (digitalizat: Austria-Forum / ONB)",
        url: "https://austria-forum.org/web-books/kpwde08de1891onb/ev00419",
        noteSi: "»Ein Einzelhof in Grible«, str. 401; glavna slika zapisa; popoln nemški opis kmetije v besedilu zvezka.",
        noteEn: "'Ein Einzelhof in Grible', p. 401; the record's main image; the complete German description of the farmstead in the volume's text.",
      },
      {
        key: "sbl-sturm",
        nameSi: "Slovenski biografski leksikon: Sturm, Jožef (1858–1935)",
        nameEn: "Slovene Biographical Lexicon: Sturm, Jožef (1858–1935)",
        sourceType: "spletni-vir",
        license: "CC BY-SA (Slovenska biografija SAZU)",
        url: "https://slovenska-biografija.si/oseba/sbi627894/",
        noteSi: "Slovenski slikar na Dunaju; za zvezek o Kranjski naslikal 10 slik, med njimi kmetijo v Gribljah; razstavljal v Künstlerhausu (1890).",
        noteEn: "A Slovene painter in Vienna; for the volume on Carniola he painted ten pictures, among them the farm in Griblje; exhibited at the Künstlerhaus (1890).",
      },
      {
        key: "wiki-kronprinzenwerk",
        nameSi: "Wikipedija: Die österreichisch-ungarische Monarchie in Wort und Bild (Kronprinzenwerk)",
        nameEn: "Wikipedia: Die österreichisch-ungarische Monarchie in Wort und Bild (the Crown Prince's work)",
        sourceType: "spletni-vir",
        license: "CC BY-SA",
        url: "https://de.wikipedia.org/wiki/Die_%C3%B6sterreichisch-ungarische_Monarchie_in_Wort_und_Bild",
        noteSi: "24-zvezčna enciklopedija monarhije (1886–1902), naročil prestolonaslednik Rudolf; 397 sodelavcev, med njimi tudi slovenski avtorji.",
        noteEn: "The 24-volume encyclopedia of the Monarchy (1886–1902), commissioned by Crown Prince Rudolf; 397 contributors, Slovene authors among them.",
      },
    ],
  },
  {
    slug: "gribeljski-zbul",
    addedAt: "2026-09-16",
    category: "gospodarstvo",
    titleSi: "Gribeljski žbul — čebula, ki je nosila vas",
    titleEn: "The Griblje žbul — the onion that carried the village",
    periodSi: "glavni denarni pridelek vasi · vzdevek žbularji živ še danes",
    periodEn: "the village's main cash crop · the nickname žbularji alive today",
    summarySi:
      "Rodovitna obkolpska polja so Gribljam nekoč dajala glavni denarni pridelek: čebulo, ki ji v vasi rečejo žbul. Prodajali so jo onstran Gorjancev in na Hrvaškem — Belokranjci pa Gribljčanom do danes pravijo žbularji.",
    summaryEn:
      "The fertile fields by the Kolpa once gave Griblje its main cash crop: the onion, called žbul in the village. It was sold beyond the Gorjanci hills and in Croatia — and to this day the people of Bela krajina call the people of Griblje žbularji, the onion men.",
    storySi:
      "Pred vinom, pred žitom, pred vsem, kar je šlo s polja na trg, je iz Gribelj potovala čebula. Rodovitno kmetijsko območje ob Kolpi je bilo nekdaj poznano prav po njej: žbul, kot mu rečejo v Gribljah, je bil glavni vir prihodka — prodajali so ga onstran Gorjancev, na Dolenjskem in na Štajerskem, pa tudi na Hrvaškem. Kmetija, ki je imela dobro letino čebule, je imela denar; in ker čebula nikjer drugje takega pomena ni imela, so sosednje vasi Gribljčanom nadeli ime, ki se ga ni več dalo sprati: žbularji. Belokranjci jih tako imenujejo še danes.\n\nLeta 2012 so Gribeljčanke znova izdale žbul v svet: Nada Babič Ivaniš, Marija Mojca Črnič, Ivanka Pezdirc, Anica Totter in Branka Weiss — študijski krožek Gribeljska čebula, ki ga je nosilo Društvo kmečkih žena Griblje (registrirano 1996) — je izdalo knjižico Gribeljski žbul: pridelovanje, spomini in recepti, v katerih je glavna sestavina čebula. Povpraševanje po gribeljskem žbulu je, kot so ugotavljali na pogovornem večeru »Bilo je« v Podzemlju leta 2020, ostalo veliko — čeprav ga danes pridelujejo le še redki.\n\nNajlepši del te zgodbe pa poteka na vrtu pred podružnično šolo: vsako pomlad učenci uredijo gredico in na njo posadijo avtohtono belokranjsko čebulo — gribeljski žbul; pozimi jo okopavajo, cvetoče glave privežejo, avgusta pa jo pravočasno poberejo in spravijo. Tako je sredina vasi še vedno semenarna tega pridelka: šola, ki uči brati in pisati, uči tudi vzgojiti žbul.\n\nŽbul ima v vasi danes tudi svojo tržnico: ob miklavževskih dnevih na podružnični šoli poteka Žbulčkova tržnica, kjer se pridelki in izdelki znajdejo med darili — čebula, ki je bila nekdaj denar, je postala tudi prazniček.\n\nMuzej išče: fotografijo gribeljske čebule na gredi, izvod knjižice Gribeljski žbul za razstavno vitrino in imena zadnjih pridelovalk, ki so žbul nosile na sejem.",
    storyEn:
      "Before the wine, before the grain, before everything else that went from the field to market, the onion travelled out of Griblje. The fertile farmland by the Kolpa was once known for precisely that: the žbul, as the onion is called in Griblje, was the main source of income — sold beyond the Gorjanci hills, in Lower Carniola and Styria, and in Croatia too. A farm with a good onion year had money; and because the onion was nowhere else the crop it was here, the neighbouring villages gave the people of Griblje a name that would not wash off: žbularji, the onion men. The people of Bela krajina still call them that today.\n\nIn 2012 the women of Griblje sent the žbul out into the world again: Nada Babič Ivaniš, Marija Mojca Črnič, Ivanka Pezdirc, Anica Totter and Branka Weiss — the study circle 'Gribeljska čebula', carried by the Society of Farm Women of Griblje (registered 1996) — published the booklet Gribeljski žbul: its cultivation, memories, and recipes in which the onion is the leading ingredient. The demand for the Griblje žbul has stayed great, the talk evening 'Bilo je' in Podzemelj found in 2020 — though today only a few still grow it.\n\nThe most beautiful part of this story, however, takes place in the garden before the branch school: every spring the pupils prepare a bed and plant the autochthonous Bela krajina onion — the Griblje žbul; they hoe it through the summer, tie the flowering heads, and in August lift and store it in good time. So the middle of the village is still the seedbed of this crop: the school that teaches reading and writing also teaches the raising of the žbul.\n\nThe žbul has its own market day now: around St. Nicholas the branch school holds the Žbulček market, where produce and wares find their way among the gifts — the onion that was once money has become a little feast too.\n\nThe museum seeks: a photograph of the Griblje onion on its bed, a copy of the booklet Gribeljski žbul for the display case, and the names of the last growers who carried the žbul to the fair.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/zbul-cebula.jpg",
    imageCredit:
      "Foto: Josef Schlaghecken · Wikimedia Commons · CC BY-SA 4.0 — čebula na gredi tik pred pobiranjem (ilustrativna slika: gribeljski žbul še čaka na svojo fotografijo)",
    yearFrom: 1890,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "dups-stajdohar-2021",
        nameSi: "Zbornik DUPŠ 2021: Jana Štajdohar, »Včeraj – danes – jutri« (POŠ Griblje), str. 64–68",
        nameEn: "DUPŠ 2021 volume: Jana Štajdohar, 'Včeraj – danes – jutri' (the Griblje branch school), pp. 64–68",
        sourceType: "objava",
        license: "navedba vira (Društvo učiteljev podružničnih šol Slovenije)",
        url: "https://www.dups.si/files/2021/12/zbornik_DUPS_2021_dediscina.pdf",
        noteSi: "Avtohtona belokranjska čebula — gribeljski žbul; šolska gredica; študijski krožek in knjižica 2012; »vaščanom Gribelj reče Žbularji«.",
        noteEn: "The autochthonous Bela krajina onion — the Griblje žbul; the school bed; the study circle and the 2012 booklet; 'the people of Griblje are called Žbularji'.",
      },
      {
        key: "vas-kanal-zbul-2012",
        nameSi: "Vaš Kanal: Vse o gribeljskem žbulu (video, ~2012)",
        nameEn: "Vaš Kanal: All about the Griblje žbul (video, ~2012)",
        sourceType: "objava",
        license: "navedba vira (Vaš Kanal)",
        url: "https://youtu.be/9N0Y_GAC1og",
        noteSi: "»Rodovitno kmetijsko območje Gribelj … glavni vir prihodka. Prodajali so jo onstran Gorjancev, pa tudi na Hrvaškem. … žbularji. Tako jih Belokranjci imenujejo še danes.«",
        noteEn: "'The fertile farmland of Griblje … the main source of income. They sold it beyond the Gorjanci and in Croatia too. … žbularji. That is what the people of Bela krajina still call them.'",
      },
      {
        key: "vas-kanal-zbul-2020",
        nameSi: "Vaš Kanal: Gribeljski žbul (video, ~2020)",
        nameEn: "Vaš Kanal: The Griblje žbul (video, ~2020)",
        sourceType: "objava",
        license: "navedba vira (Vaš Kanal)",
        url: "https://youtu.be/_4pM9KSBKBE",
        noteSi: "Pogovorni večer »Bilo je« v Podzemlju: povpraševanje po gribeljskem žbulu je veliko, čeprav ga danes pridelujejo redki.",
        noteEn: "The talk evening 'Bilo je' in Podzemelj: the demand for the Griblje žbul is great, though few grow it today.",
      },
      {
        key: "worldcat-zbul",
        nameSi: "WorldCat: Babič Ivaniš, N. idr., »Gribeljski žbul« (2012, ZIK Črnomelj — Društvo kmečkih žena Griblje)",
        nameEn: "WorldCat: Babič Ivaniš, N. et al., 'Gribeljski žbul' (2012, ZIK Črnomelj — Society of Farm Women of Griblje)",
        sourceType: "objava",
        license: "knjižnični zapis (OCLC 821110335)",
        url: "https://search.worldcat.org/title/gribeljski-zbul/oclc/821110335",
        noteSi: "Knjižica o pridelovanju gribeljske čebule s spomini in recepti; pet avtoric — Gribeljčanke.",
        noteEn: "The booklet on growing the Griblje onion, with memories and recipes; five authors — women of Griblje.",
      },
      {
        key: "s24-podzemelj-2014",
        nameSi: "Svet24: V Podzemlju so bili šolski vrtovi (11. 1. 2014)",
        nameEn: "Svet24: In Podzemelj there were school gardens (11 January 2014)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://svet24.si",
        noteSi: "Cikel pogovornih večerov v Podzemlju: 17. januarja 2014 o žbularjih, nato o česnu in o kolinah.",
        noteEn: "The cycle of talk evenings in Podzemelj: on 17 January 2014 about the žbularji, then about garlic and about kolina.",
      },
      {
        key: "odeon-zbulckova-trznica",
        nameSi: "Radio Odeon — Žbulčkova in Miklavževa tržnica na PŠ Griblje",
        nameEn: "Radio Odeon — The Žbulček and St. Nicholas market at the Griblje branch school",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/miklavzeva-in-zbulckova-trznica/",
        noteSi: "1. decembra, ob govorilnih urah: žbulčkova novoletna tržnica na podružnični šoli.",
        noteEn: "On 1 December, at parents' hour: the žbulček New Year market at the branch school.",
      },
    ],
  },
  {
    slug: "arheolosko-najdigsce-ob-kolpi",
    addedAt: "2026-09-16",
    category: "kraj",
    titleSi: "Arheološko najdišče ob Kolpi — pet tisoč let pod njivami",
    titleEn: "The archaeological site by the Kolpa — five thousand years beneath the fields",
    periodSi: "mlajši neolitik — zgodnja rimska doba (pribl. 4500 pr. n. št.–200 n. št.)",
    periodEn: "Late Neolithic — Early Roman period (c. 4500 BC–AD 200)",
    summarySi:
      "Obkolpska ravnina pri Gribljah je v uradnem registru kulturne dediščine vpisana kot arheološko najdišče: neolitske in bronastodobne naselbine, poznobronastodobno grobišče Požekov vrt, železnodobna gomila in rimske naselbine. Pet tisoč let življenja pod današnjimi njivami.",
    summaryEn:
      "The Kolpa floodplain at Griblje is entered in the official heritage register as an archaeological site: Neolithic and Bronze Age settlements, the Late Bronze Age cemetery of Požekov vrt, an Iron Age burial mound and Roman settlements. Five thousand years of life beneath today's fields.",
    storySi:
      "Ko gribeljski kmet potegne plug čez obkolpsko ravnino, le-ta včasih na plano obrne črno prst, oglje, razbit lonec. To niso naključja: ravnina ob Kolpi pri Gribljah je v Registru nepremične kulturne dediščine vpisana kot arheološko najdišče (EŠD 10094) — in to takšno, ki meri svojo zgodovino v tisočletjih.\n\nRegister na tem območju — med njivami, ki se v starih listinah oglašajo pod imeni Kohane, Požekov vrt in Krasinec–Vrh — našteva neolitske, eneolitske in bronastodobne naselbine: k Kolpi so se ljudje priselili takoj, ko so začeli gojiti zemljo. Poznobronastodobno plano grobišče Požekov vrt priča o mrtvih, ki so jih tu pokopavali v žarah; starejšeželeznodobna gomila — nasip nad enim samim pokopanim — dviga svojo tišino nad ravnino; dve rimski naselbini in tri rimska grobišča pa zapirajo vrsto: ko je po reki tekla meja Rimskega imperija, so tu ob njej živeli in umirali ljudje z rimskim posodom v kuhinji.\n\nO najdišču je poročal strokovni svet: izkopavanja, o katerih so poročali Philip Mason, Maša Sakara Sučević in Ildikó Pintér v Varstvu spomenikov 46 (2010), in nadaljnje arheološke raziskave podjetja ARHAT (2011, 2021) ob gradnjah in vodovodih. Pogled v te poročila je pogled v plast za plastjo: lončina, ki se pri vsakem izkopu poda v kontekst, in s tem v datum.\n\nZa muzej pomeni ta zapis obrat perspektive: Griblje niso začele s cerkvijo leta 1526 ne s šolo leta 1889 — vas stoji v pokrajini, ki je nosila hiše pet tisočletij, in jih bo nosila še naprej. Muzej išče: lonce in črepinje, ki so jih gribeljski njivi kdaj izročili, ter zgodbe o najdbah — vsak razbit lonec je datum, ki ga ni v nobeni knjigi.",
    storyEn:
      "When a Griblje farmer pulls the plough through the Kolpa floodplain, the share sometimes turns up dark earth, charcoal, a broken pot. These are not accidents: the plain by the Kolpa at Griblje is entered in the Register of Immovable Cultural Heritage as an archaeological site (EŠD 10094) — and one that measures its history in millennia.\n\nThe register, over the ground that old documents call Kohane, Požekov vrt and Krasinec–Vrh, lists Neolithic, Eneolithic and Bronze Age settlements: people came down to the Kolpa as soon as they began to work the soil. The Late Bronze Age flat cemetery of Požekov vrt speaks of the dead buried here in urns; an Early Iron Age burial mound — a bank raised above a single interred body — lifts its silence over the plain; and two Roman settlements with three Roman cemeteries close the row: when the border of the Roman Empire ran along the river, people lived and died beside it with Roman pottery in their kitchens.\n\nThe site has a scholarly record: excavations reported by Philip Mason, Maša Sakara Sučević and Ildikó Pintér in Varstvo spomenikov 46 (2010), and further archaeological research by the ARHAT company (2011, 2021) alongside construction and waterworks. To look into those reports is to look layer by layer: pottery that with every cut enters its context, and through it its date.\n\nFor this museum the record turns the perspective around: Griblje did not begin with the church of 1526 or the school of 1889 — the village stands in a landscape that has carried houses for five thousand years, and will carry them on. The museum seeks: pots and sherds that the fields of Griblje have surrendered, and stories of finds — every broken pot is a date no book holds.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/griblje-ravnina.jpg",
    imageCredit:
      "Foto: Eleassar · Wikimedia Commons · CC BY-SA 3.0 — Griblje z obkolpsko ravnino: pokrajina, pod katero leži pet tisočletij naselbin in grobišč",
    yearFrom: -4500,
    yearTo: 200,
    featured: false,
    sources: [
      {
        key: "eid-register",
        nameSi: "Register nepremične kulturne dediščine: Griblje — arheološko najdišče ob Kolpi (EŠD 10094)",
        nameEn: "Register of Immovable Cultural Heritage: Griblje — the archaeological site by the Kolpa (EŠD 10094)",
        sourceType: "spletni-vir",
        license: "uradni register (Ministrstvo za kulturo)",
        url: "https://eid.gov.si/#!/iskalnik",
        noteSi: "Registrirana dediščina; sinonimi Kohane, Požekov vrt, Krasinec–Vrh; datacija od mlajšega neolitika do zgodnje rimske dobe; ZVKD Novo mesto.",
        noteEn: "Registered heritage; synonyms Kohane, Požekov vrt, Krasinec–Vrh; dated from the Late Neolithic to the Early Roman period; ZVKD Novo mesto.",
      },
      {
        key: "vs46-mason",
        nameSi: "Varstvo spomenikov 46 (2010): Griblje — arheološko najdišče ob Kolpi (Mason, Sakara Sučević, Pintér)",
        nameEn: "Varstvo spomenikov 46 (2010): Griblje — the archaeological site by the Kolpa (Mason, Sakara Sučević, Pintér)",
        sourceType: "objava",
        license: "navedba vira (ZVKDS)",
        url: "http://www.eheritage.si",
        noteSi: "Poročilo o arheoloških raziskavah najdišča v reviji Varstvo spomenikov, Poročila.",
        noteEn: "The report on the archaeological research of the site in the journal Varstvo spomenikov, Poročila.",
      },
      {
        key: "cobiss-arhat",
        nameSi: "COBISS: Poročila o arheoloških raziskavah ARHAT (Aleš Tiran) na najdišču EŠD 10094 (2011, 2021)",
        nameEn: "COBISS: Reports on the archaeological research by ARHAT (Aleš Tiran) on site EŠD 10094 (2011, 2021)",
        sourceType: "objava",
        license: "knjižnični zapis (COBISS.SI)",
        url: "https://plus.cobiss.net",
        noteSi: "Reševalna izkopavanja in testni izkopi na območju najdišča (tudi Klepec–Krasinec, parc. št. 2957).",
        noteEn: "Rescue excavations and trial digs within the site's area (including Klepec–Krasinec, parcel no. 2957).",
      },
      {
        key: "arheologija-2023",
        nameSi: "Slovensko arheološko društvo: Arheologija v letu 2023 — dediščina za javnost (zbornik povzetkov)",
        nameEn: "Slovenian Archaeological Society: Archaeology in 2023 — heritage for the public (booklet of abstracts)",
        sourceType: "objava",
        license: "navedba vira",
        url: "https://www.arheologija.si/arheologija-v-letu-2023/",
        noteSi: "Med povzetki raziskav leta 2023 tudi Griblje — arheološko najdišče ob Kolpi.",
        noteEn: "Among the abstracts of the 2023 research is also Griblje — the archaeological site by the Kolpa.",
      },
    ],
  },
  {
    slug: "jurjevo-v-gribljah",
    addedAt: "2026-09-16",
    category: "sege",
    titleSi: "Jurjevo v Gribljah — Zeleni Jurij v košu iz brezja",
    titleEn: "Jurjevo in Griblje — Green George in a basket of birch",
    periodSi: "24. april · šega, ki jo nosi podružnična šola",
    periodEn: "24 April · a custom carried by the branch school",
    summarySi:
      "Dan pred jurjevim gribeljska šola uredi okolico, posadi žbul in splete koš iz zelenih brezovih vej; 24. aprila po vasi kroži Zeleni Jurij — deček v košu — in poje pesem, ki se je ohranila v gribeljskem narečju.",
    summaryEn:
      "On the eve of St. George's day the Griblje school tidies its grounds, plants the žbul and weaves a basket of green birch; on 24 April Green George — a boy inside the basket — walks the village, and the song has survived in the Griblje dialect.",
    storySi:
      "Jurjevo je v Beli krajini nekdaj pomenilo eno samo stvar: prvi izgon živine na pašo. Pastirji so ga šteli za svoj praznik — po njem so se začela pašniška leta, ob njem so proslavili pomlad in se poslovili od zime. V Gribljah je ta spomin prevzela šola in ga nosila naprej na najlepši mogoč način: z živimi koraki.\n\nDan pred jurjevem se na podružnični šoli zbere cela vaška družina odraščanja: učenci, starši, stari starši, bivši in bodoči učenci. Skupaj poberejo odpadke, pograbijo listje, uredijo igrala in vrt — ter na gredico posadijo avtohtoni gribeljski žbul. Nato spletejo koš: zeleni koš iz brezovih vej, v katerega bo naslednji dan »oblečen« deček.\n\nNa dan sv. Jurija, 24. aprila, se sprevod odpravi po vasi, od hiše do hiše, od vrat do vrat. Pred vsako hišo zapojejo jurjevo pesem — in gribeljska različica se je ohranila z vsemi svojimi besedami: »Prošel je prošel pisani vuzem, došel je došel zeleni Jure. Donesel je donesel, pedenj dugu travicu, lakat dugu mladicu. Dajte mu dajte! Jurja darovajte! Dajte mu pogače, da mu noga poskače! Dajte mu vina, da ga ne bu zima! … Dajte mu groš, da vam dojde još!« Vuzem — velikonočna nedelja v belokranjskem narečju — je torej minila, zeleni Jure je prišel; pesem prosi zase vse, od pogač do groša. Če se vrata odpirajo počasi, pride na vrsto še drugi glas: »Haj, haj, haj! Buli skoro kaj?«\n\nOb vsaki hiši zataknejo na vrata ali okno brezovo vejico — naj prinese družini dobro letino in blagostanje — vaščani pa sprevod, kot se spodobi, obdarijo z jajci in sladkarijami. Slika, ki drži ta zapis, je fotografija sprevoda Zelenega Jurija iz leta 1908: ista šega, druga vas, druga doba — v Gribljah pa živi še danes. Muzej išče: posnetek gribeljske jurjevske pesmi in fotografijo Zelenega Jurija na poti po vasi.",
    storyEn:
      "In Bela krajina Jurjevo used to mean one thing only: the first driving of the cattle to pasture. The shepherds counted it their feast — with it the grazing years began, around it spring was welcomed and winter bidden farewell. In Griblje the school took over this memory and carried it on in the most living way possible: with walking feet.\n\nOn the eve of the feast the whole growing family of the village gathers at the branch school: pupils, parents, grandparents, former and future pupils. Together they pick up litter, rake the leaves, mend the playthings and the garden — and plant the autochthonous Griblje žbul on the bed. Then they weave the basket: a green basket of birch branches, into which a boy will be 'dressed' the next day.\n\nOn St. George's day, 24 April, the procession sets out through the village, house to house, door to door. Before every house they sing the jurjevo song — and the Griblje version has survived with all its words: 'Prošel je prošel pisani vuzem, došel je došel zeleni Jure. Donesel je donesel, pedenj dugu travicu, lakat dugu mladicu. Dajte mu dajte! Jurja darovajte! Dajte mu pogače, da mu noga poskače! Dajte mu vina, da ga ne bu zima! … Dajte mu groš, da vam dojde još!' Vuzem — Easter in the Bela krajina dialect — has passed, green George has come; the song asks for everything, from flatbread to small coin. And if a door opens slowly, a second voice follows: 'Haj, haj, haj! Buli skoro kaj?'\n\nAt every house a birch twig is tucked over the door or window — to bring the family a good harvest and well-being — and the villagers, as is right, gift the procession eggs and sweets. The image holding this record is a photograph of a Green George procession from 1908: the same custom, another village, another age — in Griblje it lives on today. The museum seeks: a recording of the Griblje jurjevo song and a photograph of Green George on his way through the village.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/zeleni-jurij-1908.jpg",
    imageCredit:
      "Fotografija: neznani avtor, »Zeleni Jurij« (1908) · Wikimedia Commons · javna last — sprevod Zelenega Jurija: ista šega, ki jo gribeljska šola živi še danes",
    yearFrom: 1908,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "dups-jurjevo",
        nameSi: "Zbornik DUPŠ 2021: Jana Štajdohar, »Jurjevo« (POŠ Griblje), str. 64–65",
        nameEn: "DUPŠ 2021 volume: Jana Štajdohar, 'Jurjevo' (the Griblje branch school), pp. 64–65",
        sourceType: "objava",
        license: "navedba vira (Društvo učiteljev podružničnih šol Slovenije)",
        url: "https://www.dups.si/files/2021/12/zbornik_DUPS_2021_dediscina.pdf",
        noteSi: "Popis šolske šege: koš iz brezovih vej, sprevod po vasi, brezova vejica, darovi; cela jurjevska pesem v gribeljskem narečju.",
        noteEn: "The record of the school custom: the birch basket, the procession through the village, the birch twig, the gifts; the complete jurjevo song in the Griblje dialect.",
      },
      {
        key: "commons-zeleni-jurij",
        nameSi: "Wikimedia Commons: Zeleni Jurij (fotografija, 1908)",
        nameEn: "Wikimedia Commons: Zeleni Jurij (photograph, 1908)",
        sourceType: "fotografija",
        license: "javna last / public domain (neznani avtor)",
        url: WM("Zeleni_Jurij_1908.jpg"),
        noteSi: "Glavna slika zapisa: dokumentarna fotografija sprevoda Zelenega Jurija iz leta 1908.",
        noteEn: "The record's main image: a documentary photograph of a Green George procession from 1908.",
      },
      {
        key: "ro-pastirski-2020",
        nameSi: "Vaš Kanal: Obudili pastirski praznik (video, ~2020)",
        nameEn: "Vaš Kanal: The shepherds' feast revived (video, ~2020)",
        sourceType: "objava",
        license: "navedba vira (Vaš Kanal)",
        url: "https://youtu.be/yr8QsY7jRDA",
        noteSi: "TD Griblje in aktiv kmečkih žena so na kopališču obudili pastirske igre ob vnebohodu (križevi) — nekdaj praznik pastirjev.",
        noteEn: "TD Griblje and the farm-women's group revived shepherds' games at the pool at the Ascension (križevo) — once the shepherds' feast.",
      },
    ],
  },
  {
    slug: "mate-zupanic-svarski",
    addedAt: "2026-09-17",
    category: "vojna",
    titleSi: "Mate Zupanič-Švarski — prostovoljec, ki se ni vrnil",
    titleEn: "Mate Zupanič-Švarski — the volunteer who did not come home",
    periodSi: "1885–1917 · od Gribelj do Solunske fronte",
    periodEn: "1885–1917 · from Griblje to the Salonika front",
    summarySi:
      "Brat etnologa Nika Županiča je leta 1914 kot prostovoljec odšel braniti Srbijo, se z vojsko umaknil skozi Albanijo in po ranitvah in malariji umrl v Nîmesu — vojna je Gribljam vzela enega od sinov, pesnik Janko Lavrin pa mu je posvetil sonete.",
    summaryEn:
      "The brother of the ethnologist Niko Županič went to defend Serbia as a volunteer in 1914, retreated with the army through Albania, and — after wounds and malaria — died at Nîmes. Griblje paid the war one of its sons; the poet Janko Lavrin dedicated sonnets to him.",
    storySi:
      "V hiši Švarskih pod Gribljami je ob koncu devetnajstega stoletja cvetela trgovina z vinom: oče Miko je bil uspešen vinski trgovec, ki je del zaslužka sistematično vlagal v šolanje sinov. Ko je vinogradništvo propadlo, je propadla tudi hiša — in sinova Niko in Mate sta se morala osamosvojiti, vsak po svoje. Niko je šel po poti znanosti; Mate, rojen 17. novembra 1885, po poti računov: gimnazija v Novem mestu in Karlovcu, nato davčna uprava v Črnomlju in Kamniku.\n\nA računi niso bili njegova zadnja beseda. Pod vplivom brata in dunajske revije Jug — ki so jo izdajala prav belokranjska študenta, Niko Županič in zdravnik Franc Derganc — se je navdušil nad jugoslovansko idejo. Ob kronanju kralja Petra I. Karađorđevića se je skupaj z novinarjem Milanom Plutom odpravil v Srbijo; v Beogradu sta izdajala Jugoslovansko korespondenco v srbohrvaščini in francoščini, ki je idejo združitve nosila med Slovane in na Zahod. Po bolezni se je vrnil domov, študiral na trgovski akademiji v Pragi in delal na Moravskem, v Bosni in v Mariboru — leta 1913 pa se je preselil nazaj v Beograd, na ravnateljstvo srbskih železnic.\n\nKo je avstrijska vojska napadla Srbijo, se je Mate pridružil prostovolcem enote Voje Tankosića. Po okupaciji Srbije se je z vojsko umikal skozi Albanijo — tisto zimo, ki so jo vojaki nosili v gorah in obalam; v bolnišnici Rdečega križa v Valoni je obležal, nato na otoku Vidu, kjer so umirali srbski vojaki. Na Krfu se je spet javil kot prostovoljec in odšel na Solunsko fronto. Tam ga je podrla malarija; z ranjenci so ga prepeljali v Francijo, v bolnišnico v Toulousu, nato v Nîmes — kjer je 27. aprila 1917 umrl. Leta 1928 so njegove ostanke prenesli na jugoslovansko vojno pokopališče pri Parizu.\n\nNjegov sovaščan in rojak, profesor Janko Lavrin, ki je tiste leta sam hodil po balkanskih bojiščih, mu je posvetil cikel sonetov Čas v zbirki Balkanski soneti — izšli so konec leta 1917 v Clevelandu, med Slovenci, ki so se iz Amerike ozirali domov. Griblje so v isti vojni poslale še tri brate Dragoše — enega v rusko ujetništvo, enega na srbsko bojišče, enega na Sicilijo. Ta zapis drži spomin na tistega, ki se ni vrnil: sin vinskega trgovca, davčni uradnik, prostovoljec — in naslovnik sonetov.",
    storyEn:
      "In the Švarski house below Griblje the wine trade flowered at the end of the nineteenth century: the father, Miko, was a successful wine merchant who systematically invested part of his earnings in his sons' schooling. When viticulture collapsed, the house collapsed with it — and the sons Niko and Mate had to stand on their own feet, each in his own way. Niko took the road of scholarship; Mate, born 17 November 1885, took the road of ledgers: grammar school in Novo mesto and Karlovac, then the tax administration in Črnomelj and Kamnik.\n\nBut ledgers were not his last word. Under the influence of his brother and of the Viennese magazine Jug — published by two Bela krajina students, Niko Županič and the physician Franc Derganc — he caught fire for the Yugoslav idea. At the coronation of King Peter I Karađorđević he set out for Serbia with the journalist Milan Pluto; in Belgrade the two published the Yugoslav Correspondence in Serbo-Croatian and in French, carrying the idea of union among the South Slavs and to the West. Illness brought him home; he studied at the trade academy in Prague and worked in Moravia, Bosnia and Maribor — and in 1913 moved back to Belgrade, to the directorate of the Serbian railways.\n\nWhen the Austrian army attacked Serbia, Mate joined the volunteers of Voja Tankosić's unit. After the occupation he retreated with the army through Albania — that winter the soldiers carried through the mountains and along the shores; he lay in the Red Cross hospital at Vlorë, then on the island of Vido, where Serbian soldiers were dying. On Corfu he volunteered again and went to the Salonika front. There malaria broke him; with the wounded he was carried to France, to the hospital at Toulouse, then to Nîmes — where he died on 27 April 1917. In 1928 his remains were transferred to the Yugoslav war cemetery near Paris.\n\nHis fellow villager, the professor Janko Lavrin, who walked the Balkan battlefields himself in those years, dedicated to him the sonnet cycle 'Čas' in the collection Balkaniski soneti — published at the end of 1917 in Cleveland, among the Slovenes who looked home across the ocean. In the same war Griblje sent out also the three Dragoš brothers — one to Russian captivity, one to the Serbian front, one to Sicily. This record holds the memory of the one who did not return: a wine merchant's son, a tax clerk, a volunteer — and the addressee of sonnets.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/solunska-fronta.jpg",
    imageCredit:
      "Zemljevid: neznani avtor · Wikimedia Commons · javna last — zemljevid solunske fronte 1916–1918",
    yearFrom: 1885,
    yearTo: 1917,
    featured: false,
    sources: [
      {
        key: "odeon-mate-zupanic",
        nameSi: "Radio Odeon — Ljudje ob Kolpi: Mate Zupanič-Švarski (17. 11. 2025)",
        nameEn: "Radio Odeon — People by the Kolpa: Mate Zupanič-Švarski (17 Nov 2025)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/ljudje-ob-kolpi-mate-zupanic-svarski-1/",
        noteSi: "Izvirni življenjepis: vinski trgovec Miko, Jugoslovanska korespondenca, Praga, Tankosićevi prostovoljci, Albanija, Vido, Solunska fronta, Nîmes, Lavrinovi soneti.",
        noteEn: "The source biography: the wine merchant Miko, the Yugoslav Correspondence, Prague, Tankosić's volunteers, Albania, Vido, the Salonika front, Nîmes, Lavrin's sonnets.",
      },
      {
        key: "commons-salonika-map",
        nameSi: "Wikimedia Commons: zemljevid solunske fronte (1916–1918)",
        nameEn: "Wikimedia Commons: map of the Salonika front (1916–1918)",
        sourceType: "zemljevid",
        license: "javna last / public domain (neznani avtor)",
        url: WM("Salonika_Front_WW1.jpg"),
        noteSi: "Glavna slika zapisa: zgodovinski zemljevid fronte, na katero je padla tudi pot Mateja Zupaniča.",
        noteEn: "The record's main image: a historical map of the front on which Mate Zupanič's road also fell.",
      },
    ],
  },
  {
    slug: "tobacka-leta",
    addedAt: "2026-09-17",
    category: "gospodarstvo",
    titleSi: "Tobačna leta — burley med gribeljskimi njivami",
    titleEn: "The tobacco years — burley among the Griblje fields",
    periodSi: "po 1945 → 1980-ta · polje, ki je dišalo",
    periodEn: "after 1945 → the 1980s · the field that smelled",
    summarySi:
      "Po drugi svetovni vojni so strokovnjaki ugotovili, da je podnebje Bele krajine ustrezno za tobak: v vaseh, kakršne so Griblje, je postal ena vodilnih pridelovalnih poljščin — do 1980-ih ga je gojilo 70 belokranjskih kmetov, sadike pa je prinašala ljubljanska Tobačna tovarna.",
    summaryEn:
      "After the Second World War experts found Bela krajina's climate suited to tobacco: in villages such as Griblje it became one of the leading crops — by the 1980s seventy Bela krajina farmers grew it, the seedlings arriving from Ljubljana's Tobacco Factory.",
    storySi:
      "Žbul je bil denar gribeljske ravnice devetnajstega stoletja; tobak je postal njegov povojni naslednik. Ko so se po drugi svetovni vojni strokovnjaki lotili vprašanja, kaj lahko na suhi, topli obkolpski ravnini pravzaprav uspeva, je odgovor presenetil: tobak. Podnebje Bele krajine se mu je izkazalo za primerno — in v vaseh, kakršne so Griblje, je tobak zrasel v eno od vodilnih pridelovalnih poljščin.\n\nVrsta je imela ime: burley — tobak, ki je veljal za kakovostnega, a zahtevnega. Rastline so na rodovitnih tleh dosegle višino dveh metrov in več; vsak list je moral priti z roko, od trganja do sušenja v senikih in na palicah pa je delo držalo družine od poletja do jeseni. Sadike je prinašala ljubljanska Tobačna tovarna; do osemdesetih let je burley na belokranjskih njivah gojilo sedemdeset kmetov — med njimi tudi domačiji ob Kolpi.\n\nKonec je bil tih, kakor je bil tih začetek. Cenejši tobak z drugih celin, upad kadilcev in konec ljubljanske tovarne so pridelavo umaknili s njiv; polja so se vrnila žitu, koruzi in zelenjavi, v spominu starejših domačinov pa je ostal vonj po sušenju — tisti poletni, težki, sladek dim, ki je visel nad vasjo v letih, ko je tobak štel štipendije in nove strehe.\n\nZa ta zapis muzej išče: fotografijo gribeljskega tobakovega polja, imena pridelovalcev in spomin na trgatve. Slika, ki drži zapis, je ilustrativna — burley na palicah na fotografiji Marion Post Wolcott iz knjižnice FSA; gribeljski tobak čaka na svoj posnetek.",
    storyEn:
      "The žbul onion was the money of the Kolpa plain in the nineteenth century; tobacco became its post-war heir. When experts set about the question of what could actually thrive on the dry, warm plain by the Kolpa, the answer surprised: tobacco. Bela krajina's climate proved suited to it — and in villages such as Griblje tobacco grew into one of the leading crops.\n\nThe variety had a name: burley — a tobacco accounted quality but demanding. On fertile soil the plants rose past two metres; every leaf had to come off by hand, and from picking to curing in the hay-lofts and on sticks the work held families from summer into autumn. The seedlings came from Ljubljana's Tobacco Factory; by the 1980s seventy farmers grew burley on Bela krajina fields — among them households by the Kolpa.\n\nThe end came quietly, as the beginning had. Cheaper tobacco from other continents, the decline of smokers and the closing of the Ljubljana factory withdrew the crop from the fields; the land returned to grain, maize and vegetables, while in the memory of the older villagers there remained the smell of curing — that heavy, sweet summer smoke that hung over the village in the years when tobacco paid for scholarships and new roofs.\n\nFor this record the museum seeks: a photograph of a Griblje tobacco field, the growers' names, memories of the harvests. The image holding the record is illustrative — burley on sticks in a photograph by Marion Post Wolcott from the FSA collection; the Griblje tobacco awaits its own picture.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/tobak-burley.jpg",
    imageCredit:
      "Foto: Marion Post Wolcott (FSA) · Wikimedia Commons · javna last — reza burleyja na palice",
    yearFrom: 1945,
    yearTo: 1989,
    featured: false,
    sources: [
      {
        key: "rtv-tobacco",
        nameSi: "RTV Slovenija — Slovenia Revealed: Slovenia's Tobacco Fields (23. 11. 2018)",
        nameEn: "RTV Slovenija — Slovenia Revealed: Slovenia's Tobacco Fields (23 Nov 2018)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.rtvslo.si/news-in-english/slovenia-revealed/slovenia-s-tobacco-fields/472664",
        noteSi: "Bela krajina kot središče tobačnega kmetijstva; vasi, kot so Griblje; 70 kmetov v 1980-ih; burley; sadike Tobačne tovarne Ljubljana.",
        noteEn: "Bela krajina as the centre of Slovene tobacco farming; villages such as Griblje; seventy farmers by the 1980s; burley; seedlings from the Ljubljana Tobacco Factory.",
      },
      {
        key: "commons-burley",
        nameSi: "Wikimedia Commons: Marion Post Wolcott — reza burleyja (FSA, 1930-ta)",
        nameEn: "Wikimedia Commons: Marion Post Wolcott — cutting burley (FSA, 1930s)",
        sourceType: "fotografija",
        license: "javna last / public domain (FSA)",
        url: WM("Cutting_Burley_tobacco_and_putting_it_on_sticks_to_wilt_1a34370v.jpg"),
        noteSi: "Glavna slika zapisa: ilustrativna fotografija burleyja na palicah — gribeljski tobak še čaka na svojo sliko.",
        noteEn: "The record's main image: an illustrative photograph of burley on sticks — the Griblje tobacco still awaits its own picture.",
      },
    ],
  },
  {
    slug: "krizevo-pastirski-dan",
    addedAt: "2026-09-17",
    category: "sege",
    titleSi: "Križevo — pastirski dan ob Kolpi",
    titleEn: "Križevo — the shepherds' day by the Kolpa",
    periodSi: "40 dni po veliki noči · pastirski praznik",
    periodEn: "Forty days after Easter · the shepherds' feast",
    summarySi:
      "Križevo — vnebohod, ki so ga belokranjski pastirji šteli za svoj praznik — je v Gribljah znova živo: ob Kolpi ga obujata TD Griblje in kmečke žene, leta 2026 pa so pastirski dan z igrami in pečenimi jajci organizirali tudi pri kolesarski sekciji Torpedo.",
    summaryEn:
      "Križevo — the Ascension, which Bela krajina's shepherds counted as their own feast — lives again in Griblje: revived by the tourist society and the farm women, and in 2026 marked with a shepherds' day of games and painted eggs by the Torpedo cycling section.",
    storySi:
      "Ko je jeseni 1890-tih Matija Totter-Jandreč zapisoval belokranjske šege, so ga pri Barletu in Županiču prosili prav za pastirje: kako praznujejo križevo. Zapisal je navade ob vnebohodu — prazniku, ki pade štirideset dni po veliki noči in po ljudskem koledarju odpre poletje: živina je šla na pašnike na vse leto, pastirji pa so ta dan praznovali kot svoj. Nekateri od teh običajev so v pozemeljski fari kmalu zatem ugasnili — ostali so le njegovi zapisi, ki jih hrani ta zbirka.\n\nSto let pozneje se je praznik vrnil na obalo. TD Griblje in aktiv kmečkih žena so na vaškem kopališču obudili pastirske igre ob vnebohodu — s tekanjem, metom in smehom, ki so ga nekdaj poznali pastirji ob Kolpi. In leta 2026, štirideset dni po veliki noči, je Radio Odeon zapisal nov poglavje: pastirski dan ob Kolpi, ki sta ga priredili kolesarska sekcia Torpedo in Dragica Piškurič — s pečenimi jajci, igrami in vsemi generacijami na bregu.\n\nPastirsko leto ima svoj vrstni red, ki ga ta zbirka bere po koledarju: na jurjevo, 24. aprila, živina prvič gre na pašo in po vasi kroži Zeleni Jurij; na križevo pastirji slavijo svoj praznik; ob kresu počasti kres ogenj, ki varuje čredo. Med njimi tečejo reke, iz katerih se napajajo — in po katerih se, poleti, kopa cela vas.\n\nMuzej išče: fotografijo pastirskega dneva 2026, imena pastirjev, ki so nekdaj gnali čredo na obkolpske loke, in zapis Matičkovih beležk o križevem v izvirniku.",
    storyEn:
      "When Matija Totter-Jandreč was writing down Bela krajina customs in the 1890s, Barle and Županič asked him above all about the shepherds: how they kept križevo. He recorded the ways of the Ascension — the feast that falls forty days after Easter and, by the folk calendar, opens the summer: the stock went to the pastures for the whole season, and the shepherds celebrated that day as their own. Some of these customs soon died out in the Podzemelj parish — only his notes remained, held in this collection.\n\nA hundred years later the feast returned to the riverbank. The Griblje tourist society and the farm-women's group revived the shepherds' games at the village bathing place — with running, throwing and the laughter the shepherds once knew on the Kolpa. And in 2026, forty days after Easter, Radio Odeon recorded a new chapter: a shepherds' day by the Kolpa, organised by the Torpedo cycling section and Dragica Piškurič — with painted eggs, games, and every generation on the bank.\n\nThe shepherds' year has an order this collection reads by the calendar: at jurjevo, on 24 April, the stock first goes to graze and Green George walks the village; at križevo the shepherds keep their feast; at kres the fire that guards the flock is honoured. Between them run the rivers the flocks drink from — and in which, in summer, the whole village swims.\n\nThe museum seeks: a photograph of the 2026 shepherds' day, the names of the shepherds who once drove the flocks to the Kolpa meadows, and the original of Matiček's notes on križevo.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/pastirji-ovce.jpg",
    imageCredit:
      "Foto: Zeynel Cebeci · Wikimedia Commons · CC BY-SA 4.0 — čreda na pašniku (ilustrativna slika)",
    yearFrom: 1890,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "odeon-krizevo-2026",
        nameSi: "Radio Odeon — V Gribljah ohranjajo tradicijo (15. 5. 2026)",
        nameEn: "Radio Odeon — In Griblje they keep the tradition (15 May 2026)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/v-gribljah-ohranjajo-tradicijo/",
        noteSi: "Pastirski dan ob Kolpi 2026: sekcia Torpedo in Dragica Piškurič, pečena jajca, igre, vse generacije.",
        noteEn: "The 2026 shepherds' day by the Kolpa: the Torpedo section and Dragica Piškurič, painted eggs, games, all generations.",
      },
      {
        key: "vk-pastirski-2020",
        nameSi: "Vaš Kanal: Obudili pastirski praznik (video, ~2020)",
        nameEn: "Vaš Kanal: The shepherds' feast revived (video, ~2020)",
        sourceType: "objava",
        license: "navedba vira (Vaš Kanal)",
        url: "https://youtu.be/yr8QsY7jRDA",
        noteSi: "TD Griblje in kmečke žene so na kopališču obudili pastirske igre ob vnebohodu.",
        noteEn: "TD Griblje and the farm women revived the shepherds' games at the pool at the Ascension.",
      },
      {
        key: "commons-ovce",
        nameSi: "Wikimedia Commons: Zeynel Cebeci — čreda ovac na pašniku",
        nameEn: "Wikimedia Commons: Zeynel Cebeci — a flock of sheep on the pasture",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0",
        url: WM("Sheep_flock_in_grasland_in_E%C4%9Fribel_02.jpg"),
        noteSi: "Glavna slika zapisa: ilustrativna — čreda s pastirjem; gribeljski pastirji čakajo na svojo sliko.",
        noteEn: "The record's main image: illustrative — a flock with its shepherd; the Griblje shepherds await their own picture.",
      },
    ],
  },
  {
    slug: "razglednica-1903",
    addedAt: "2026-09-17",
    category: "kraj",
    titleSi: "Razglednica iz leta 1903 — vlak, ki je Gribljam obšel",
    titleEn: "A postcard from 1903 — the train that bypassed Griblje",
    periodSi: "22. april 1903 · pošta Metlika → Griblje",
    periodEn: "22 April 1903 · Metlika post → Griblje",
    summarySi:
      "Edini znani predmet, naslovljen na Griblje iz devetnajstega stoletja: razglednica, poslana 22. aprila 1903 iz Metlike gribeljski učiteljici, z duhovitim zavrtkom o železnici, ki se je gradila pol stoletja — in Gribljam obšla za šest kilometrov.",
    summaryEn:
      "The only known item addressed to Griblje from that era: a postcard sent on 22 April 1903 from Metlika to the village schoolmistress, with a witty twist about the railway that took half a century to build — and missed Griblje by six kilometres.",
    storySi:
      "Dvaindvajsetega aprila 1903 je nekdo v Metliki napisal razglednico in jo naslovil v Griblje — po domače natančno: gospodični učiteljici. Pošiljateljica je bila Fani Mežnaršič; besedilo pa je hvalnico pošti in zavrnitev vlaka v enem: poslala je kartico po pošti, ki je delovala, in si v šali izdihnila o belokranjski železnici, ki se je gradila pol stoletja — a je Gribljam obšla za kakšnih šest kilometrov. Razglednico je na seznamu svojih najdb objavil zbiratelj Božidar Flajšman, ki je o progi napisal tudi knjigo.\n\nZa muzej je ta košček papirja troje hkrati. Je najstarejši znani naslovljeni predmet, ki je Griblje doseže po pošti — dokaz, da je naslov deloval že leta 1903, ko je bila poštna številka še nepojmljiva stvar prihodnosti. Je tudi spomin na ljudi, ki so znali brati: kartice niso pisali kmetje, ampak učiteljice, župniki, uradniki — pismenost je v vasi stanovala v šoli. In je nazadnje šala, ki se je izšla: železnica je Gradac dosegla šele leta 1914, šest kilometrov od vasi, in Griblje so ostali cestna vas — njihovi vlaki so hodili peš, z vozom in kasneje z avtobusom.\n\nSlika, ki drži ta zapis, je razglednica Metlike iz istega obdobja — iz zbirke, ki jo je digitaliziral Slovenski etnografski muzej. Gribeljske razglednice iz tega časa muzej ne pozna: če obstajajo, čakajo v predalih zbirateljev. Iskanje ostaja odprto — kakor naslov na kartici, ki ga pošta še vedno zna najti.",
    storyEn:
      "On 22 April 1903 someone in Metlika wrote a postcard and addressed it to Griblje — precisely, in the manner of the time: to the schoolmistress. The sender was Fani Mežnaršič; the text a praise of the post and a refusal of the rail in one: she sent the card by a post that worked, and sighed in jest about the Bela krajina railway, which had been building itself for half a century — and passed Griblje by some six kilometres. The collector Božidar Flajšman published the card among his finds; of the line he has written a book.\n\nFor the museum this scrap of paper is three things at once. It is the oldest known addressed item to reach Griblje by post — proof the address worked already in 1903, when a postal code was an unimaginable thing of the future. It is also a memory of the people who could read: cards were not written by farmers but by schoolmistresses, priests and clerks — literacy lived in the village at the school. And it is, finally, a joke that came true: the railway reached Gradac only in 1914, six kilometres from the village, and Griblje remained a road village — its trains went on foot, by cart and later by bus.\n\nThe image holding this record is a postcard of Metlika from the same era — from a collection digitised by the Slovene Ethnographic Museum. The museum knows of no postcard of Griblje from that time: if any exist, they wait in collectors' drawers. The search remains open — like the address on the card, which the post still knows how to find.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/razglednica-metlika.jpg",
    imageCredit:
      "Razglednica Metlike · Wikimedia Commons · javna last — iz zbirke, digitalizirane v Slovenskem etnografskem muzeju",
    yearFrom: 1903,
    yearTo: 1914,
    featured: false,
    sources: [
      {
        key: "odeon-razglednica-1903",
        nameSi: "Radio Odeon — Stara Metlika (229): razglednica 22. 4. 1903 iz Metlike v Griblje (17. 3. 2023)",
        nameEn: "Radio Odeon — Old Metlika (229): a postcard of 22 April 1903 from Metlika to Griblje (17 Mar 2023)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/stara-metlika-230/",
        noteSi: "Naslovnica na učiteljico v Gribljah; pošiljateljica Fani Mežnaršič; vir: Božidar Flajšman, 100 let belokranjske železniške proge na razglednicah, 2014.",
        noteEn: "A card addressed to the schoolmistress in Griblje; the sender Fani Mežnaršič; source: Božidar Flajšman, 100 let belokranjske železniške proge na razglednicah, 2014.",
      },
      {
        key: "commons-metlika-card",
        nameSi: "Wikimedia Commons: razglednica Metlike (zbirka SEM)",
        nameEn: "Wikimedia Commons: a postcard of Metlika (SEM collection)",
        sourceType: "fotografija",
        license: "javna last / public domain",
        url: WM("Postcard_of_Metlika_(2).jpg"),
        noteSi: "Glavna slika zapisa: razglednica Metlike iz istega obdobja — gribeljska razglednica še čaka na svoj pošiljatelja.",
        noteEn: "The record's main image: a Metlika postcard of the same era — a Griblje postcard still awaits its sender.",
      },
    ],
  },
  {
    slug: "dkz-griblje",
    addedAt: "2026-09-17",
    category: "sege",
    titleSi: "Društvo kmečkih žena Griblje — roke, ki držijo vas",
    titleEn: "The Griblje Farm Women's Society — the hands that hold the village",
    periodSi: "1996 → danes · kruh, pesem in igra",
    periodEn: "1996 → present · bread, song and play",
    summarySi:
      "Društvo kmečkih žena Griblje: soavtorice knjižice o gribeljskem žbulu, peke kruha na Pozdravu pomladi, obudilke pastirskih iger in nevidna infrastruktura vaškega dogajanja — žensko društvo, ki drži koledar vasi.",
    summaryEn:
      "The Griblje Farm Women's Society: co-authors of the booklet on the Griblje žbul onion, bakers of the bread at the Spring Greeting, revivers of the shepherds' games, and the invisible infrastructure of village life — the women's society that holds the village calendar.",
    storySi:
      "Vsaka vas ima dva koledarja. Enega pišejo župani in društva z žigi; drugega ženske, ki speče kruh, naučijo pesem in spravita na oder vso energijo, ki je v vasi ostala po delu. V Gribljah ta drugi koledar nosi ime: Društvo kmečkih žena Griblje.\n\nDruštvo je v zapisih prvič zagrabljivo leta 1996, ko je skupaj z Zavodom za izobraževanje in kulturo Črnomelj izdalo knjižico o gribeljskem žbulu — pet gribeljskih žensk je zapisalo zgodovino pridelave čebule, po kateri je vas nekdaj slovela. Sledila je obnova: o žbulu so z odkrivanjem spomina naredile študijski krožek, iz katerega je leta 2012 zrasla nova knjižica — in gredica pred podružnično šolo, na katero učenci vsako pomlad posadijo pravi gribeljski žbul.\n\nNa Pleteršnikov dan pomladi se društvo pokaže v celoti. Na Pozdravu pomladi v gasilskem domu — prireditvi podružnične šole, krajevne skupnosti in društva — so ženske pripravile folklor, klarinet, pevski zbor in igrano predstavo, goste pa je pozdravil še ženski pevski zbor Viniške cür. Nato je prišel na vrsto kruh: tekmovalna peka domačega kruha, na kateri so razglasili najboljše tri.\n\nIste roke so obudile pastirske igre na vaškem kopališču in so vsako leto ob pasuljadi: Društvo kmečkih žena je na plakatu od prvega lonca. Muzej išče: natančen datum ustanovitve, seznam predsednic in fotografije društva z njegovih začetkov — zgodovina, ki jo pišejo roke, si zasluži tudi svoj arhiv.",
    storyEn:
      "Every village has two calendars. One is written by mayors and stamped societies; the other by the women who bake the bread, teach the song, and bring to the stage all the energy the village has left after work. In Griblje this second calendar has a name: the Griblje Farm Women's Society.\n\nThe society first becomes graspable in the records in 1996, when together with the Črnomelj Institute for Education and Culture it published the booklet on the Griblje žbul — five Griblje women wrote the history of the onion-growing that once made the village famous. A revival followed: out of the memory of the žbul they made a study circle, from which a new booklet grew in 2012 — and the bed before the branch school, on which the pupils plant the true Griblje žbul every spring.\n\nOn the spring greeting day the society shows itself whole. At the Pozdrav pomladi in the fire station — a joint event of the branch school, the local community and the society — the women prepared folklore, a clarinet, a choir and a staged play, and the women's choir Viniške cür greeted the guests. Then came the bread: a competitive baking of home bread, with the best three announced.\n\nThe same hands revived the shepherds' games at the village pool and are present at every pasuljada: the Farm Women's Society has been on the poster from the first pot. The museum seeks: the exact founding date, the list of presidents and photographs of the society's beginnings — a history written by hands deserves its own archive too.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/kmecke-zene-testo.jpg",
    imageCredit:
      "Foto: Mona Hassan Abo-Abda · Wikimedia Commons · CC BY-SA 4.0 — ženske pri testu (ilustrativna slika)",
    yearFrom: 1996,
    yearTo: 2026,
    featured: false,
    sources: [
      {
        key: "odeon-pozdrav-pomladi-2025",
        nameSi: "Radio Odeon — Pozdrav pomladi v Gribljah (9. 4. 2025)",
        nameEn: "Radio Odeon — Spring Greeting in Griblje (9 Apr 2025)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/pozdrav-pomladi-v-gribljah/",
        noteSi: "Prireditev 30. 3. 2025 v gasilskem domu: PŠ + KS + DKŽ Griblje; folklor, klarinet, pevski zbor, igrana predstava, Viniške cür, tekmovalna peka domačega kruha.",
        noteEn: "The event of 30 March 2025 at the fire station: branch school + local community + the Farm Women's Society; folklore, clarinet, choir, a staged play, the Viniške cür, a competitive baking of home bread.",
      },
      {
        key: "worldcat-zbul",
        nameSi: "WorldCat: Gribeljski žbul (ZIK Črnomelj in Društvo kmečkih žena Griblje, 1996/2012)",
        nameEn: "WorldCat: Gribeljski žbul (ZIK Črnomelj and the Griblje Farm Women's Society, 1996/2012)",
        sourceType: "spletni-vir",
        license: "kataložni zapis (WorldCat/OCLC)",
        url: "https://www.worldcat.org/title/821110335",
        noteSi: "Knjižica o gribeljskem žbulu — pet avtoric iz Gribelj; društvo kot soizdajateljica.",
        noteEn: "The booklet on the Griblje žbul — five authors from Griblje; the society as co-publisher.",
      },
    ],
  },
  {
    slug: "anton-brodaric",
    addedAt: "2026-09-17",
    category: "kraj",
    titleSi: "Anton Brodarič — z Gribelj na Himalajo",
    titleEn: "Anton Brodarič — from Griblje to the Himalaya",
    periodSi: "2024 · Mera Peak, 6.467 metrov",
    periodEn: "2024 · Mera Peak, 6,467 metres",
    summarySi:
      "Gribeljčan, ki je na tritedenski azijski ekspediciji stopil na vrh Mera Peaka pri 6.467 metrih — in se vrnil v vas, kjer ga je v Domu krajanov pričakalo sedemdeset ljudi: štirikrat več, kot jih prostor sprejme.",
    summaryEn:
      "A man of Griblje who, on a three-week Asian expedition, stood on the summit of Mera Peak at 6,467 metres — and returned to a village that filled the Dom krajanov with seventy people: four times the room's usual capacity.",
    storySi:
      "Vas na stoterinšestdesetih metrih nadmorske višine ima svoje gorovo razmerje: Kolpa je dolina, Bela krajina je ravnina — a Griblje so tudi vas, ki je na svet poslala smučarja-vaditelja na bolgarski meji, maratonca Cirila Totterja in leta 2024 še alpinista. Anton (Tone) Brodarič se je odpravil na tritedensko ekspedicijo v Azijo in stopil na vrh Mera Peaka — 6.467 metrov, najvišja točka, ki jo je kdaj dosegel človek iz te vasi.\n\nVas mu je vrnila z dvorano. Na sprejemu v Domu krajanov Griblje se ga je udeležilo sedemdeset obiskovalcev — prostor, ki sprejme osemnajst. Brodarič je pripovedoval o poti, višini in mrzlem jutru na vrhu; občina Črnomelj mu je za športne dosežke podelila priznanje, čajanka v Kovačnici sreče pa je zgodbo nosila naprej med zimske mesece.\n\nZa muzej je zapis dokaz o geografiji, ki jo lahko naredi vas: ni pomembno, kako visoka je bila gora — pomembno je, da so bile v sobi tri generacije Gribeljčanov, ki so poslušale. Muzej išče: fotografije z ekspedicije, potek poti in datume; vrh ima svojo knjigo vpisov, vas pa svojo.",
    storyEn:
      "A village a hundred and sixty metres above the sea has its own mountain arithmetic: the Kolpa is a valley, Bela krajina a plain — yet Griblje is also the village that sent the war a ski-instructor on the Bulgarian border, a marathon runner in Ciril Totter, and in 2024 a mountaineer. Anton (Tone) Brodarič set out on a three-week expedition to Asia and stood on the summit of Mera Peak — 6,467 metres, the highest point ever reached by a man of this village.\n\nThe village answered with a hall. At the reception in the Griblje Dom krajanov seventy visitors came — in a room that holds eighteen. Brodarič spoke of the road, the altitude and the cold morning on the summit; the Municipality of Črnomelj awarded him its recognition for sporting achievements, and a tea evening at the Kovačnica sreče carried the story into the winter months.\n\nFor the museum the record is proof of the geography a village can make: what matters is not how high the mountain stood — what matters is that three generations of Griblje people sat in the room and listened. The museum seeks: photographs from the expedition, the route and the dates; the summit has its visitors' book, and the village its own.",
    evidenceStatus: "DOCUMENTED",
    image: "/images/authentic/mera-peak.jpg",
    imageCredit:
      "Foto: Nabin K. Sapkota · Wikimedia Commons · CC BY-SA 4.0 — panoramska slika Mera Peaka (6.471 m)",
    yearFrom: 2024,
    yearTo: 2025,
    featured: false,
    sources: [
      {
        key: "odeon-brodaric-sprejem",
        nameSi: "Radio Odeon — V Gribljah pripravili sprejem za Antona Brodariča",
        nameEn: "Radio Odeon — A reception prepared in Griblje for Anton Brodarič",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/v-gribljah-pripravili-sprejem-za-antona-brodarica/",
        noteSi: "Tritedenska azijska ekspedicija; vrh Mera Peak 6.467 m; sprejem v Domu krajanov; občinsko priznanje za športne dosežke 2024.",
        noteEn: "A three-week Asian expedition; the summit of Mera Peak 6,467 m; the reception at the Dom krajanov; the municipal recognition for sporting achievements, 2024.",
      },
      {
        key: "odeon-brodaric-cajanka",
        nameSi: "Radio Odeon — Anton Brodarič na čajanki v Kovačnici sreče (6. 2. 2025)",
        nameEn: "Radio Odeon — Anton Brodarič at a tea evening at the Kovačnica sreče (6 Feb 2025)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://www.radio-odeon.com/novice/anton-brodaric-na-cajanki-v-kovacnici-srece/",
        noteSi: "Čajanka v Domu krajanov Griblje z 70 obiskovalci (sicer max 18); občinsko priznanje 2024.",
        noteEn: "A tea evening at the Griblje Dom krajanov with 70 visitors (usually max 18); the municipal recognition of 2024.",
      },
      {
        key: "commons-mera",
        nameSi: "Wikimedia Commons: Nabin K. Sapkota — panorama Mera Peaka",
        nameEn: "Wikimedia Commons: Nabin K. Sapkota — Mera Peak panorama",
        sourceType: "fotografija",
        license: "CC BY-SA 4.0",
        url: WM("Mera_Peak_Photowalk_08.jpg"),
        noteSi: "Glavna slika zapisa: gora, ne človek — Brodaričeva fotografija z vrhu čaka v zasebnem arhivu.",
        noteEn: "The record's main image: the mountain, not the man — Brodarič's summit photograph waits in a private archive.",
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
    titleSi: "150 let od rojstva Nika Županiča — muzej odpira spominski zapis",
    titleEn: "150 years since the birth of Niko Županič — the museum opens its memorial record",
    descriptionSi:
      "Ob 150-letnici rojstva gribeljskega etnologa (1. 12. 1876) predstavimo zapis o njem in iščemo rodbinske fotografije ter spomine domačinov.",
    descriptionEn:
      "On the 150th anniversary of the Griblje ethnologist's birth (1 Dec 1876) we present his record and look for family photographs and villagers' memories.",
    startsAt: eventDate("2026-12-01"),
    locationSi: "Griblje — digitalni muzej (na spletu) in spominska plošča v vasi",
    locationEn: "Griblje — the digital museum (online) and the memorial plaque in the village",
    eventType: "PRIREDITEV",
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
  {
    titleSi: "40 let odkritja črnega močerila — naravoslovna ura ob izviru",
    titleEn: "40 years since the black olm's discovery — a nature hour at the spring",
    descriptionSi:
      "Ob 40. obletnici odkritja črne človeške ribice (18. oktobra 1986) se sprehodimo do izvira Jelševniščice v Jelševniku — edinega kraja na svetu, kjer črnega močerila lahko opazujemo v naravi. Vodena ura o podzemlju, ki ga deli z Gribljami.",
    descriptionEn:
      "Marking forty years since the discovery of the black olm (18 October 1986), we walk to the Jelševniščica spring at Jelševnik — the only place on Earth where the black olm can be observed in nature. A guided hour on the underground it shares with Griblje.",
    startsAt: eventDate("2026-10-25"),
    locationSi: "Jelševnik — izvir Jelševniščice",
    locationEn: "Jelševnik — the Jelševniščica spring",
    eventType: "VODENJE",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "Pasuljada — tekmovanje v kuhanju pasulja",
    titleEn: "The Pasuljada — a bean-stew cooking contest",
    descriptionSi:
      "Avgustovska šega TD Griblje z Društvom kmečkih žena in kopališčem: štirinajst ekip po dva člana kuha pasulj na odprtem ognju, komisija pa išče lonec leta. Zapis o Pasuljadi v zbirki muzeja pripoveduje, kako iz šale zraste tradicija.",
    descriptionEn:
      "The August custom of the Griblje Tourist Society with the Farm Women's Society and the bathing place: fourteen two-member teams cook bean stew over open fire while the jury seeks the pot of the year. The museum's record of the Pasuljada tells how a joke grows into a tradition.",
    startsAt: eventDate("2027-08-07"),
    locationSi: "Griblje — ob Kolpi",
    locationEn: "Griblje — by the Kolpa",
    eventType: "PRIREDITEV",
    isExternal: false,
    externalUrl: null,
  },
  {
    titleSi: "Sto let PGD Griblje (1927–2027)",
    titleEn: "One hundred years of the Griblje fire brigade (1927–2027)",
    descriptionSi:
      "Prostovoljno gasilsko društvo Griblje, ustanovljeno 1927, praznuje stoletnico: 140 članov, od tega 18 operativnih gasilcev, gasilski dom s spominsko sobo dr. Franca Brinca in stoletje pomoči vasi. Muzej ob jubileju dopolnjuje zapis o društvu — točen datum bo potrdilo društvo samo.",
    descriptionEn:
      "The Griblje volunteer fire brigade, founded in 1927, celebrates its centenary: 140 members, 18 of them operational firefighters, a fire station with the memorial room of dr. Franc Brinc, and a century of service to the village. For the jubilee the museum is expanding its record of the brigade — the exact date to be confirmed by the society itself.",
    startsAt: eventDate("2027-06-19"),
    locationSi: "Griblje — gasilski dom",
    locationEn: "Griblje — the fire station",
    eventType: "PRIREDITEV",
    isExternal: false,
    externalUrl: null,
  },
];
