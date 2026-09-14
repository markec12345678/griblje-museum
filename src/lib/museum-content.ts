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
 * register virov. Ilustrativne fotografije (AI-postavitev 2026) so ločene od
 * arhivskih virov, ki se navajajo v registru.
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
      "Griblje ležijo na območju krajevne skupnosti Griblje v občini Črnomelj, na severnem robu doline Kolpe, ki je danes državna meja s Hrvaško. Naselje je v pisnih virih prvič izpričano leta 1526 — v času, ko je bila Bela krajina stoletje že stičišče dveh svetov: habsburške dežele in nevarne osmanske vojne krajine.\n\nGospodarstvo vasi so stoletja nosili poljedelstvo, živinoreja in vinogradništvo ob bližnjih legah; Kolpa pa je bila hkrati ribolovna, mlinarska in mejna reka. Po letu 1991 je postal tok ob reki zunanja meja samostojne Slovenije — vas pa je ostala na robu, ki je vedno znova postal tudi priložnost: danes so Griblje mirno izhodišče za kolesarjenje ob Kolpi in sprehode med belimi brezami, simbolom Bele krajine.",
    storyEn:
      "Griblje lies in the Griblje local community of the Municipality of Črnomelj, on the northern edge of the Kolpa valley, which is today the national border with Croatia. The settlement is first recorded in written sources in 1526 — at a time when Bela krajina had for centuries been a meeting point of three worlds: the Habsburg lands, Hungarian Croatia and the dangerous Ottoman frontier.\n\nThe village economy was carried for centuries by farming, livestock and viticulture on nearby slopes, while the Kolpa was at once a fishing, milling and border river. After 1991 the course of the river became the outer border of independent Slovenia — yet the village stayed on an edge that kept turning into opportunity: today Griblje is a quiet starting point for cycling along the Kolpa and walks among the white birches, the symbol of Bela krajina.",
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
        noteSi: "Avtentična fotografija vasi — glavna slika zapisa.",
        noteEn: "Authentic photograph of the village — the record's main image.",
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
      "Kolpa (hrvaško Kupa) izvira v Gorskem kotarju in po 297 kilometrih doseže Savo pri Sisku; večji del toka je slovensko-hrvaška meja. Ob Gribljah je reka mirna, plitva in poleti topla — zato velja za eno najbolj priljubljenih kopalnih rek v državi; kakovost vode na odseku Dragoši–Griblje redno spremlja državni monitoring kopalnih voda (merilno mesto K05010).\n\nReka je vasi dajala ribe, mlin in žago, s cerkvami na obeh bregovih pa tudi zgodbo o stiku in ločitvi. Danes ob njej vodi kolesarska pot, poleti pa se ob bregovih znova slišita skupni jezik in smeh.",
    storyEn:
      "The Kolpa (Croatian: Kupa) rises in Gorski Kotar and, after 297 kilometres, mostly as the Slovenian–Croatian border, reaches the Sava at Sisak. At Griblje the river is calm, shallow and warm in summer — which makes it one of the country's favourite bathing rivers; water quality on the Dragoši–Griblje section is regularly monitored by the state bathing-water programme (measurement point K05010).\n\nThe river gave the village fish, a mill and a sawmill and, with churches on both banks, also a story of contact and separation. A cycling route runs along it today, and in summer both banks again carry the sounds of a shared language and laughter.",
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
      "Vinska ruta Bele krajine vodi od Metlike proti Semiču, Vinici in Dragatušu; Griblje stoji ob njenem južnem robu. Beline in modra frankinja, laški rizling in gamay — sorte, ki dajejo cviček — lahkotno belokranjsko namizno vino — tukaj uspevajo na rdeči prsti preko apnenca.\n\nKrona regije je metliška črnina PTP, zajamčena tradicionalna oznaka: temnejše vino iz rdečih sort z belimi, katerih zgodovina sega v 19. stoletje. Kadar so vinogradniki jeseni nosili grozdje v zidnice — kamnite vaške kleti — se je v vasi zvrstelo delo, smeh in vonj mošta. Muzej bo to zgodbo dopolnil z imeni gribeljskih domačij-vinogradov, ko jih bodo domačini sami vpisali.",
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
      "Na jurjevo, 24. aprila, ko se »zemlja odpre«, po Beli krajini hodijo jurji — odrasli v zelenju brez in drugih dreves, z rdeče-belimi rutami in zvončki, ki z bučenjem pregnajo zimo. Ob njih pustujejo tudi lame in race, kožuhaste maske z rogovi, ki so v razlagah etnografov ostanki predkrščanske koledarske simbolike.\n\nJurjevanje je danes živ primer nematerialne dediščine: od 1990-ih v Črnomlju poteka festival Jurjevanje v Beli krajini, največji prikaz slovenskega ljudskega ustvarjanja. V Gribljah so jurji hodili iz hiše v hišo — kdaj točno in kdo je bil zadnji jurij, muzej še ne ve: zapišite nam ga.",
    storyEn:
      "On St. George's Day, 24 April, when the earth \"opens\", the jurji walk through Bela krajina — figures dressed in the greenery of birch and other trees, with red-and-white scarves and bells, drumming winter away. Alongside them carnival figures like the lame and race — horned fur masks that ethnographers read as remnants of pre-Christian calendar symbolism.\n\nToday jurjevanje is a living gallery example of intangible heritage: since the 1990s the town of Črnomelj has hosted the Jurjevanje v Beli krajini festival, the largest showcase of Slovene folk creativity. In Griblje the jurji walked from house to house — when exactly, and who was the last jurij, the museum does not yet know: write it down for us.",
    evidenceStatus: "TRADITION",
    image: "/images/authentic/jurjevanje.jpg",
    imageCredit: "Foto: Wikimedia Commons (1908) · javna last",
    featured: true,
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
      "Belokranjska kuhinja je kuhinja kruha in žit: belokranjska pogača — okrogel kruh s kuminovim posipom — je postala zaščitni znak regije, ponedeljkov matevž iz rjavega fižola pa je nosil delovni teden. Ob pustu so doma kuhali salenjake — v listju ali v ponvi —, velikonočna jajca pa barvali z naravnimi barvami suhih rastlin, kot jih pozna pokrajina.\n\nPijača praznikov je bila medlica — hladilna pijača iz medu in vode — ter potica, nadevana z orehmi z lastnega vrta. Muzejska zbirka kuhinje se bo gradila iz receptov vaških gospodinj: prvi je že vpisan v zgodbah, ostale čakajo.",
    storyEn:
      "Bela krajina cuisine is a cuisine of bread and grain: the Bela krajina pogača — a round flatbread with a caraway crust — has become the region's trademark, while Monday's matevž of brown beans carried the working week. At carnival the households baked salenjaki — on leaves or in the oven — and Easter eggs were dyed with the natural colours of dried plants, as the region knows them.\n\nThe sweet of the holidays was medlica — a cooling drink of honey and water — and potica, layered with walnuts from one's own garden. The museum's kitchen collection will be built from village recipes: the first is already entered among the stories, the rest are awaited.",
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
