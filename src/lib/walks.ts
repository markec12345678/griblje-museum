import type { ExhibitDTO } from "@/lib/types";

/**
 * Muzejski sprehodi — kurirane tematske poti skozi zbirko.
 * Vzorec: vodeni ogledi Norsk Folkemuseum (odprti muzej na Bygdøyu),
 * preneseni v digitalni prostor: vsaka postaja je zapis iz zbirke,
 * obogaten s kuratorsko opombo, ki povezuje postave v pripoved.
 *
 * Pogoj celovitosti: vseh pet sprehodov skupaj pokrije VSE zapise
 * zbirke (2026: 67 zapisov), vsak zapis natanko enkrat.
 */

export type WalkStop = {
  exhibitSlug: string;
  noteSi: string;
  noteEn: string;
};

export type Walk = {
  id: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  descriptionEn: string;
  stops: WalkStop[];
};

export const WALKS: Walk[] = [
  {
    id: "voda-je-zivljenje",
    titleSi: "Voda je življenje",
    titleEn: "Water is life",
    descriptionSi:
      "Od najtoplejše slovenske reke do vaškega ribnika: kako je voda hranila, mlela in oddajala Griblje.",
    descriptionEn:
      "From Slovenia's warmest river to the village pond: how water fed, milled and divided Griblje.",
    stops: [
      {
        exhibitSlug: "kolpa-reka",
        noteSi:
          "Vsaka zgodba o tej vasi se začne ob reki. Kolpa je tu življenjska žila — poleti topla kot južno morje, od nekdaj pa pot, meja in shranjevalnica spominov.",
        noteEn:
          "Every story of this village begins at the river. The Kolpa is its lifeline — warm as a southern sea in summer, and always a route, a border and a keeper of memories.",
      },
      {
        exhibitSlug: "arheolosko-najdigsce-ob-kolpi",
        noteSi:
          "Preden so bili mlini, pred cerkvijo, pred pismenostjo: ob tej reki so ljudje živeli pet tisoč let. Pod obkolpskimi njivami ležijo naselbine od neolitika do Rimljanov — registrirana dediščina, ki jo obdeluje plug.",
        noteEn:
          "Before the mills, before the church, before writing: people lived by this river for five thousand years. Beneath the fields by the Kolpa lie settlements from the Neolithic to the Romans — registered heritage, tilled by the plough.",
      },
      {
        exhibitSlug: "bronasta-igla-a478",
        noteSi:
          "Iz teh njiv je prišel tudi prvi imenovani predmet: bronasta igla s profilirano glavico (inv. A 478, 19,6 cm), objavljena leta 1979 v Dularjevi študiji o Borštu — pet tisoč let pod plugom ima svoje ime.",
        noteEn:
          "From these fields comes the first named object as well: a bronze pin with a profiled head (inv. A 478, 19.6 cm), published in 1979 in Dular's study of Boršt — five thousand years beneath the plough have their name.",
      },
      {
        exhibitSlug: "mlini-na-kolpi",
        noteSi:
          "Kjer je reka dajala moč, so stali mlini. Urbarji jih omenjajo že v srednjem veku — moko je pridelovala voda, ne roka.",
        noteEn:
          "Where the river gave power, mills stood. The urbarji mention them as early as the Middle Ages — it was water, not hand, that ground the flour.",
      },
      {
        exhibitSlug: "malenca",
        noteSi:
          "Mlinarska vedrina: malenca je bil majhen jez s padcem, ki je zajel vodno moč in jo usmeril v kolo. Beseda, ki jo pozna samo ta konec.",
        noteEn:
          "The millers' ingenuity: the malenca was a small weir with a drop that captured the water's power and fed it to the wheel. A word only this corner of the country knows.",
      },

      {
        exhibitSlug: "madronicev-mlin",
        noteSi:
          "Mlinarska zgodba se nadaljuje v ravnini: Madroničev mlin v Prelesju — nakup 1937, Zbor odposlancev 1943 in makete, ki danes nosijo znanje naprej.",
        noteEn:
          "The milling story continues across the plain: the Madronič mill at Prelesje — bought in 1937, marked by the 1943 Assembly of Delegates, and carried on today by models.",
      },
      {
        exhibitSlug: "ribnik",
        noteSi:
          "Voda, ki so jo prinesli domov — ribnik ob vasi, pojilišče in počivališče v enem.",
        noteEn:
          "Water brought home — the pond by the village, a watering place and a resting place in one.",
      },
      {
        exhibitSlug: "crni-moceril",
        noteSi:
          "Zadnja voda je tista, ki je ne vidimo: pod suhim kotom nad vasjo teče kraški svet, v njem pa črni močeril, ki ga je znanost srečala šele leta 1986. Kar ponikne na eni strani, se izvira na drugi.",
        noteEn:
          "The last water is the water we cannot see: beneath the dry corner above the village runs a karst world, and in it the black olm, which science met only in 1986. What sinks on one side rises on the other.",
      },
      {
        exhibitSlug: "alburnus-sava",
        noteSi:
          "In reka živi tudi na površju: leta 2017 so ihtiologi iz Kolpe opisali novo vrsto za znanost — plevko Alburnus sava, poimenovano po Savi. Dve neznani življenji ob istih bregovih v enem stoletju.",
        noteEn:
          "And the river lives on the surface too: in 2017 ichthyologists described from the Kolpa a species new to science — the bleak Alburnus sava, named after the Sava. Two unknown lives by the same banks within one century.",
      },
      {
        exhibitSlug: "kopalisce-griblje",
        noteSi:
          "Reka, ki se poleti segreje čez petindvajset stopinj, je vasi dala institucijo poletja: kopališče, kjer se zbira vse, kar ima počitnice.",
        noteEn:
          "The river that warms past twenty-five degrees in summer gave the village an institution of summer: the bathing place, where everything on holiday gathers.",
      },
      {
        exhibitSlug: "kolpa-extremi",
        noteSi:
          "Ista reka, ki poleti kliče na kopanje, zna tudi naraščati s skoraj dvema metroma na uro. Na postaji Metlika so v istem koritu zabeležili 4,6 in 1.116 kubičnih metrov na sekundo — voda je življenje, a tudi merilo, ki ga vas pozna že stoletja.",
        noteEn:
          "The same river that calls for swimming in summer can also climb at almost two metres an hour. At the Metlika station the same riverbed has carried 4.6 and 1,116 cubic metres a second — water is life, but also a measure the village has known for centuries.",
      },
      {
        exhibitSlug: "goranja-lokva",
        noteSi:
          "Voda, ki ni iz neba padla: Goranja lokva je nastala iz kopanja gline za opeko — pokrajina, ki si je sama izdolbla svoj spomin.",
        noteEn:
          "Water that did not fall from the sky: Goranja lokva was born of digging clay for brick — a landscape that carved out its own memory.",
      },
    ],
  },
  {
    id: "vojna-in-svoboda",
    titleSi: "Vojna in svoboda",
    titleEn: "War and freedom",
    descriptionSi:
      "Od uskoške meje do samostojne Slovenije: štiri stoletja življenja na robu in pet let, ki so spremenila vse.",
    descriptionEn:
      "From the Uskok frontier to independent Slovenia: four centuries of life on the edge and five years that changed everything.",
    stops: [
      {
        exhibitSlug: "uskoki-in-vojna-krajina",
        noteSi:
          "Ta tla nikoli niso bila mirna. Vojna krajina — vojaška obramba pred Osmanskim cesarstvom — je za stoletja oblikovala, kdo tu živi in kako.",
        noteEn:
          "This ground was never quiet. The Military Frontier — the defensive border against the Ottoman Empire — shaped for centuries who lived here and how.",
      },
      {
        exhibitSlug: "cerkvisce",
        noteSi:
          "Pred vrsto so bile Cerkvišču tri cerkvice; Turki so jih porušili in zažgali — danes jih spominja kapelica iz leta 1994. Vojska ni odnesla samo meja, odnesla je tudi kamne.",
        noteEn:
          "Before the frontier three churches stood at Cerkvišče; the Turks pulled them down and burned them — today a chapel of 1994 keeps their memory. War took not only borders but stones.",
      },
      {
        exhibitSlug: "mate-zupanic-svarski",
        noteSi:
          "Med obema vojnama sprehoda stoti še prva: gribeljski sin, ki je leta 1914 prostovoljno šel braniti Srbijo in se z vojsko umaknil skozi Albanijo. Mate Zupanič-Švarski je umrl v Nîmesu; njegovi sopotniki so bili trije bratje Dragoše — vojna prve svetovne je v te hiše prišla prej kot september 1941.",
        noteEn:
          "Between the two wars of this walk stands a third: the Griblje son who went to defend Serbia as a volunteer in 1914 and retreated with the army through Albania. Mate Zupanič-Švarski died at Nîmes; his fellow travellers were the three Dragoš brothers — the First World War reached these houses before September 1941.",
      },
      {
        exhibitSlug: "kupski-manevri-1937",
        noteSi:
          "September 1937: kupski manevri, največji mirnodopski vojaški dogodek Kraljevine Jugoslavije. Za oskrbo 20.000 vojakov je vojska pri Gribljah uredila postajo za pitno vodo — zadnja vaja pred vojno na isti cesti.",
        noteEn:
          "September 1937: the Kupa manoeuvres, the largest peacetime military event of the Kingdom of Yugoslavia. To supply 20,000 soldiers the army built a drinking-water station at Griblje — the last exercise before the war on the same road.",
      },
      {
        exhibitSlug: "zaseda-1941",
        noteSi:
          "Prva kri te vojne prihaja zgodaj: 6. septembra 1941, prva oborožena akcija belokranjskih partizanov — prav na cesti Črnomelj–Griblje, na vašem pragu.",
        noteEn:
          "This war's first blood comes early: on 6 September 1941, the first armed action of the Bela krajina partisans — right on the Črnomelj–Griblje road, on the village's doorstep.",
      },
      {
        exhibitSlug: "precanje-pri-gribljih",
        noteSi:
          "Medtem ko je straža gledala na cesto, je reka delala svoje: pri ovinku pri Gribljih, kjer stražarji niso imeli pregleda, so kajdarji prikrivajoče prevažali ljudi čez Kolpo — vas ni bila le postojanka, bila je tudi slepo mesto, ki je pustilo skozi življenje.",
        noteEn:
          "While the guard watched the road, the river did its own work: at the bend near Griblje, where the sentries had no view, boatmen secretly ferried people across the Kolpa — the village was not only a garrison post; it was also a blind spot that let a life through.",
      },
      {
        exhibitSlug: "snos-crnomelj-1944",
        noteSi:
          "Februarja 1944 se v Črnomlju, dvanajst kilometrov stran, sestal SNOS — »prvi slovenski parlament«. Vasi, ki jih vidite na karti, so takrat hranile upor.",
        noteEn:
          "In February 1944, twelve kilometres away in Črnomelj, SNOS convened — the “first Slovenian parliament”. The villages you see on the map were feeding the resistance.",
      },
      {
        exhibitSlug: "letalisce-otok-1944",
        noteSi:
          "Najdrznežša logistika odpora: partizansko letališče na Otoku, kamor so zavezniška letala pristajala od septembra 1944 in odnašala ranjence v Italijo.",
        noteEn:
          "The boldest logistics of the resistance: the partisan airfield at Otok, where Allied aircraft landed from September 1944 and carried the wounded to Italy.",
      },
      {
        exhibitSlug: "evakuacija-1945",
        noteSi:
          "Marec 1945 — nebo nad Gribljami. Zavezniška letala evakuirajo ranjence in vojake; nebesa nad vasjo so tri dni letališče.",
        noteEn:
          "March 1945 — the sky above Griblje. Allied aircraft evacuate the wounded and soldiers; for days the heavens over the village were an airfield.",
      },
      {
        exhibitSlug: "spomenik-padlim",
        noteSi:
          "Koliko je ta vojna vzela tej vasi? Trinajst imen, vklesanih v kamen pred šolo. Vsako ime je bilo nekdo, ki je nosil priimek, ki še danes zveni po Gribljah.",
        noteEn:
          "How much did this war take from this village? Thirteen names carved into the stone before the school. Each name was someone who bore a surname that still sounds through Griblje today.",
      },
      {
        exhibitSlug: "meja-1991",
        noteSi:
          "Konec sprehoda je hkrati konec ene zgodbe: žica, ki je dolga ločevala, je leta 1991 postala meja svobodne države.",
        noteEn:
          "The end of the walk is also the end of one story: the fence that long divided became, in 1991, the border of a free country.",
      },
      {
        exhibitSlug: "veselko-fotograf",
        noteSi:
          "Vojna, ki jo je videlo oko: profesor Veselko je marca 1945 fotografiral prav tu — njegovi posnetki so danes glavne slike dveh zapisov te poti.",
        noteEn:
          "The war as an eye saw it: Professor Veselko photographed right here in March 1945 — his shots are today the main images of two records of this walk.",
      },
      {
        exhibitSlug: "zracni-most-krasinec",
        noteSi:
          "Vrh vsega: 48 ur, 2041 ljudi, dakote in spitfiri. Zračni most s Krasinca je največje reševanje zrakom na slovenskih tleh — med evacuiranci je bila tudi Alma Karlin.",
        noteEn:
          "The summit of it all: 48 hours, 2041 people, Dakotas and Spitfires. The Krasinec airlift was the greatest airborne rescue on Slovene soil — Alma Karlin among the evacuees.",
      },
      {
        exhibitSlug: "dakota-otok",
        noteSi:
          "Konec poti pri letalu, ki je ostalo: dakota pri Otoku je edini ohranjeni primerek v Sloveniji — kos neba, ki se ga lahko dotakneš.",
        noteEn:
          "The walk ends at the aircraft that stayed: the Dakota at Otok is the only preserved example in Slovenia — a piece of sky you can touch.",
      },
      {
        exhibitSlug: "loke-in-studenci",
        noteSi:
          "Zadnja voda je pokrajina sama: Kolpa je s poplavljanjem naredila loke, velik dela pa ponika pod tlemi in se vrne kot studenci. Vas ob najbolj darežljivi reki — med najbolj suhimi kraji Bele krajine.",
        noteEn:
          "The last water is the landscape itself: the Kolpa's flooding made the loke meadows, and much of it sinks underground to return as springs. A village beside the most generous river — among the driest places in Bela krajina.",
      },
    ],
  },
  {
    id: "kruh-platno-vino",
    titleSi: "Kruh, platno in vino",
    titleEn: "Bread, linen and wine",
    descriptionSi:
      "Gospodinjstvo v gibanju: od ognjišča in statve do vinograda na hribu — trije viri dohodka ene hiše.",
    descriptionEn:
      "The household in motion: from hearth and loom to the vineyard on the hill — three income streams of one house.",
    stops: [
      {
        exhibitSlug: "belokranjska-hisa",
        noteSi:
          "Hiša je bila tovarna v malem: tu so spali, kuhali, tkali in odločali. Arhitektura govori o podnebju, revščini in redu.",
        noteEn:
          "The house was a small factory: here people slept, cooked, wove and decided. Its architecture speaks of climate, poverty and order.",
      },
      {
        exhibitSlug: "sokcev-dvor",
        noteSi:
          "Najlepše ohranjen primer te arhitekture stoji v Žuničih — lesena lepota, ki jo je skupnost rešila za naslednje rodove.",
        noteEn:
          "The finest surviving example of this architecture stands in Žuniči — a wooden beauty the community saved for the generations to come.",
      },
      {
        exhibitSlug: "belokranjska-kuhinja",
        noteSi:
          "Iz opice so nastajali obroki, ki so zdržali leto. Belokranjska pogača ima danes celo evropsko priznanje.",
        noteEn:
          "From the hearth came meals that had to last the year. The Bela krajina pogača even holds European recognition today.",
      },
      {
        exhibitSlug: "pogaca-vigred-2024",
        noteSi:
          "Pogača iz tega sprehoda pa ni samo preteklost: leta 2024 je bila najboljša belokranjska pogača 44. Vinske vigredi pečena v Gribljih — Darinka Jerčinovič z Kovačnice sreče, 79,38 točk. Recept, ki ga prepozna celotna regija, izhaja iz te pečice.",
        noteEn:
          "And the loaf of this walk is not only the past: in 2024 the best Bela krajina pogača of the 44th Vinska vigred was baked in Griblje — Darinka Jerčinovič of the Kovačnica sreče, 79.38 points. The recipe the whole region recognises came from this oven.",
      },
      {
        exhibitSlug: "pasuljada",
        noteSi:
          "In jedilnik se ne konča s preteklostjo: vsak avgust v Gribljah kuhajo pasulj na tekmovanje — nova šega, ki je postala koledarska.",
        noteEn:
          "And the menu does not end with the past: every August Griblje cooks bean stew for a contest — a new custom that became a calendar date.",
      },

      {
        exhibitSlug: "kavbojski-zur",
        noteSi:
          "Po Pasuljadi pride žur: vsako poletje se vas za en dan preobrne v divji zahod — najmlajša šega v zbirki, zapisana takoj ob rojstvu.",
        noteEn:
          "After the Pasuljada comes the party: every summer the village turns into the Wild West for a day — the collection's youngest custom, recorded at its birth.",
      },
      {
        exhibitSlug: "tkalstvo",
        noteSi:
          "Ko polje počiva, začnejo stati statve. Platno je bilo denar: iz lanu so nastajale rute, prti in doto.",
        noteEn:
          "When the fields rested, the looms began. Linen was money: from flax came headscarves, tablecloths and dowries.",
      },

      {
        exhibitSlug: "katarina-zupanic",
        noteSi:
          "Pred statvami je stala pisalka: Katarina Zupanič je leta 1894/95 z peresom zajela vaško izročilo — Šopek poljskih cvetlic, med prvimi ženskimi zapisi te dežele.",
        noteEn:
          "Before the looms stood a writer: in 1894/95 Katarina Zupanič captured the village tradition with a pen — the Bouquet of Meadow Flowers, among this land's first women's records.",
      },
      {
        exhibitSlug: "gribeljski-zbul",
        noteSi:
          "Pred vinom je bila čebula: gribeljski žbul je bil glavni denarni pridelek vasi — prodajali so ga onstran Gorjancev in na Hrvaškem, Gribljčanom pa še danes pravijo žbularji.",
        noteEn:
          "Before the wine there was the onion: the Griblje žbul was the village's main cash crop — sold beyond the Gorjanci and in Croatia, and the people of Griblje are still called žbularji.",
      },
      {
        exhibitSlug: "tobacka-leta",
        noteSi:
          "Za čebulo je prišel tobak: povojni strokovnjaki so na obkolpski ravnini našli podnebje zanj, burley pa je do osemdesetih držal družine od poletja do jeseni. Polje, ki je dišalo po sušenju — in potihnelo, ko je tobačna doba minila.",
        noteEn:
          "After the onion came tobacco: post-war experts found the climate for it on the Kolpa plain, and burley held the families from summer into autumn until the 1980s. A field that smelled of curing — and fell quiet when the tobacco age passed.",
      },
      {
        exhibitSlug: "vino-in-crnina",
        noteSi:
          "Zadnja postaja diši po kletarski: metliška črnina, prvič ustekleničena 1968, danes zaščitena geografska označba.",
        noteEn:
          "The last stop smells of the cellar: metliška črnina, first bottled in 1968, today a protected geographical indication.",
      },
      {
        exhibitSlug: "strucelj-kmetija",
        noteSi:
          "»S pesmijo je delo lažje steklo, včasih do mraka, a vedno skupaj.« Kmetija, ki je iz ročne košnje zrasla v devetdeset hektarov — hrbtenica vasi.",
        noteEn:
          "»With a song the work flowed easier, sometimes until dusk, but always together.« The farm that grew from hand mowing into ninety hectares — the village's backbone.",
      },
      {
        exhibitSlug: "pecnica-susenje-sadja",
        noteSi:
          "Iz kmetije v shrambo: pečnica za sušenje sadja je jeseni delala zimo — dim in pečene slive, valuta, ki je držala do pomladi.",
        noteEn:
          "From the farm into the larder: the fruit-drying oven worked the winter — smoke and baked plums, the currency that lasted until spring.",
      },
      {
        exhibitSlug: "kuhanje-zganja",
        noteSi:
          "Iz klete ob vinu še kapljica: jeseni je kuharija hodila od domačije do domačije — hruškovec in jabolkovec, zdravilo, darilo in denar v enem.",
        noteEn:
          "From the wine cellar one more drop: in autumn the still went from farm to farm — pear and apple brandy, medicine, gift and coin in one.",
      },
      {
        exhibitSlug: "kanizarica",
        noteSi:
          "In kaj, ko kmetija ni znesla vse? Sedem kilometrov stran je rjavi premog: rudnik Kanižarica (1857–1997) je plačeval zime marsikateri obkolpski družini — danes pa tam stoji muzej.",
        noteEn:
          "And what when the farm could not carry it all? Seven kilometres away lay the brown coal: the Kanižarica mine (1857–1997) paid the winters of many a Kolpa family — today a museum stands there.",
      },
      {
        exhibitSlug: "etimologija-gribljati",
        noteSi:
          "In preden zapremo shrambo: ime vasi je brazda. Gribljati — orati, brazdati: ta zbirka stoji na dejanju, ki se je prvič zgodilo pred šestimi stoletji in se zgodi vsako pomlad znova.",
        noteEn:
          "And before we close the pantry: the village's name is a furrow. Gribljati — to plough, to furrow: this collection stands on an act that first happened six centuries ago and happens again every spring.",
      },
      {
        exhibitSlug: "valvasor-1689",
        noteSi:
          "Zadnja postaja je začetek vsega: Valvasorjeva Slava vojvodine Kranjske (1689), prva tiskana knjiga, ki pozna ta konec. Sprehod, ki se konča pri prvi strani — to je muzejska disciplina.",
        noteEn:
          "The last stop is the beginning of everything: Valvasor's Glory of the Duchy of Carniola (1689), the first printed book that knows this corner. A walk that ends at the first page — that is museum discipline.",
      },
      {
        exhibitSlug: "ilirska-carina-1809",
        noteSi:
          "Kmalu po Valvasorju so se tu sprehodili še Francozi: med Ilirskimi provincami (1809–1813) je bila Griblje carinarnica ob Kolpi. Tudi Napoleonovi imperiji so potrebovali isti prehod.",
        noteEn:
          "Soon after Valvasor the French walked here too: in the Illyrian Provinces (1809–1813) Griblje was a customs post on the Kolpa. Even Napoleon's empires needed the same crossing.",
      },
      {
        exhibitSlug: "stari-zemljevidi",
        noteSi:
          "In pravzaprav še ena, ki se dotika vsega: od Griblacha 1468 do Freyerjeve karte 1843 — pet stoletij, v katerih se je vas pisala na papir. Kar ni zapisano, ni zastopano.",
        noteEn:
          "And in truth one more, touching all the rest: from Griblach in 1468 to Freyer's map of 1843 — five centuries in which the village wrote itself onto paper. What is not written down is not represented.",
      },
      {
        exhibitSlug: "razglednica-1903",
        noteSi:
          "Kjer se zemljevidi končajo, začnejo razglednice: leta 1903 je iz Metlike v Griblje potovala kartica, naslovljena učiteljici — z zavrtkom o vlaku, ki je vasi obšel za šest kilometrov. Papir je dosegel, česar proga ni.",
        noteEn:
          "Where the maps end, the postcards begin: in 1903 a card travelled from Metlika to Griblje, addressed to the schoolmistress — with a twist about the train that missed the village by six kilometres. The paper reached what the rail did not.",
      },
      {
        exhibitSlug: "sturm-1891",
        noteSi:
          "In ker je bila vas končno zapisana, je bila tudi narisana: leta 1891 je dunajski slikar Josef Sturm za cesarsko enciklopedijo upodobil gribeljsko kmetijo — najstarejša znana slika vasi, z bakrorezom in opisom v istem zvezku.",
        noteEn:
          "And once the village was written down, it was drawn too: in 1891 the Viennese painter Josef Sturm depicted a Griblje farmstead for the imperial encyclopedia — the oldest known picture of the village, with an engraving and a description in the same volume.",
      },
    ],
  },
  {
    id: "iz-gribelj-v-svet",
    titleSi: "Iz Gribelj v svet",
    titleEn: "From Griblje into the world",
    descriptionSi:
      "Od šolske tablice do svetovnih prvenstev in čezoceanskih plovb: kako se je vas šolala, branila, proslavila in raztezala čez svet — ter na koncu preštela sebe.",
    descriptionEn:
      "From the school slate to world championships and ocean crossings: how the village educated, defended, distinguished and stretched itself across the world — and in the end counted itself.",
    stops: [
      {
        exhibitSlug: "vaska-sola",
        noteSi:
          "Vse se začne pri tablici: cesarjev šolski zakon je vasi podaril branje in računanje — in šola v Gribljah ni utihnila niti pod okupacijo.",
        noteEn:
          "It all begins at the slate: the imperial school law gifted the village reading and arithmetic — and the school of Griblje did not fall silent even under occupation.",
      },
      {
        exhibitSlug: "pgd-griblje-1927",
        noteSi:
          "Ko zagori, ni časa za pomoč od daleč: leta 1927 si je vas ustvarila lastno brambo, danes najstarejšo še delujočo organizacijo v Gribljah. Gasilski dom je zrasel v drugo dvorano vasi.",
        noteEn:
          "When fire breaks out there is no time for help from afar: in 1927 the village created its own defence, today the oldest organization still working in Griblje. The fire hall grew into the village's second hall.",
      },
      {
        exhibitSlug: "anton-filak",
        noteSi:
          "Vadnica je bila njiva za hišo: Anton Filak je vaški vsakdan — brazdo — odnesel na svetovna prvenstva v oranju in Griblje zastopal kar osmkrat. Kmečko znanje kot svetovni šport.",
        noteEn:
          "His training field was the plot behind the house: Anton Filak carried the village's everyday — the furrow — to the world ploughing championships, representing Griblje eight times. Farming skill as world sport.",
      },
      {
        exhibitSlug: "izseljenstvo",
        noteSi:
          "A niso vsi ostali: vali odhoda v Ameriko, Argentino in Avstralijo so vas raznesli po svetu. Denar, poslan domov, je gradil hiše, ki v Gribljah še stojijo.",
        noteEn:
          "But not everyone stayed: waves of departure for America, Argentina and Australia scattered the village across the world. The money sent home built houses that still stand in Griblje.",
      },
      {
        exhibitSlug: "audrey-totter",
        noteSi:
          "Od izseljenskih ladij do rdeče preproge: bratje Jandreč iz Gornjih Gribelj so zapustili vas konec 19. stoletja — vnukinja veje je postala zvezdnica filma noir pri MGM.",
        noteEn:
          "From the emigrant ships to the red carpet: the Jandreč brothers left Gornje Griblje at the end of the nineteenth century — a granddaughter of the line became a film noir star at MGM.",
      },
      {
        exhibitSlug: "kranjska-sivka",
        noteSi:
          "Najmanjši potnik te vasi ni nikoli rabil ladje: kranjska sivka je zrasla v tej deželi in postala druga najbolj razširjena čebelja pasma sveta — svet pa ji je na slovensko pobudo odprl lastni praznik, svetovni dan čebel 20. maja.",
        noteEn:
          "This village's smallest traveller never needed a ship: the Carniolan grey bee grew in this land and became the world's second most widespread bee breed — and on Slovenia's initiative the world gave her a feast of her own, World Bee Day on 20 May.",
      },

      {
        exhibitSlug: "toni-gasperic",
        noteSi:
          "Nekateri odidejo v svet in se vrnejo z darovi; Gašperič se je vrnil z besedo. Humor z bregov Kolpe — oddaje, knjige in Noč na Kolpi.",
        noteEn:
          "Some leave for the world and return with gifts; Gašperič returned with words. Humour from the banks of the Kolpa — shows, books and the Night on the Kolpa.",
      },
      {
        exhibitSlug: "matice-podzemelj",
        noteSi:
          "In korenine so zapisane: matične knjige župnije Podzemelj (1669–1947) so digitalizirane in proste — vsak Gribeljec po svetu lahko dane prebere, kje se je njegova zgodba začela.",
        noteEn:
          "And the roots are written down: the Podzemelj parish registers (1669–1947) are digitised and free — any Griblje family in the world can today read where their story began.",
      },
      {
        exhibitSlug: "porocna-1669",
        noteSi:
          "Najgloblja korenina sprehoda: najstarejša knjiga župnije je poročna iz leta 1669 — arhiv se je pričel s svatbami, ne s krsti. Stran, po kateri je listal podzemeljski župnik, je danes prost dostop.",
        noteEn:
          "The walk's deepest root: the parish's oldest book is the marriage register of 1669 — the archive began with weddings, not baptisms. The page the Podzemelj priest leafed through is today in free access.",
      },
      {
        exhibitSlug: "spanska-gripa-1918",
        noteSi:
          "In ista knjiga piše tudi konec: jeseni 1918 je župnija v petih tednih pokopala petinpetdeset ljudi, pisar pa ob pljučnici pisal »(španka)«. Med gribeljskimi imeni sta Ana Vegina in Alojzij Orehek — arhiv, ki se je začel s svatbami, je zapisal tudi najžalostnejšo jesen.",
        noteEn:
          "And the same archive writes the end too: in the autumn of 1918 the parish buried fifty-five people in five weeks, the writer adding »(Spanish)« beside pneumonia. Among the names of Griblje stand Ana Vegina and Alojzij Orehek — the archive that began with weddings wrote its saddest autumn as well.",
      },
      {
        exhibitSlug: "kolesa-torpedo",
        noteSi:
          "Tretja pot med odhodom in ostankom: starodobna kolesa, ki vozijo v svet in se vedno vrnejo domov. Petnajst let sekcije Torpedo — in 94-letni Janez Totar, ki še vedno vrti pedala.",
        noteEn:
          "A third way between leaving and staying: vintage bicycles that ride out into the world and always come back home. Fifteen years of the Torpedo section — and 94-year-old Janez Totar, still turning the pedals.",
      },
      {
        exhibitSlug: "griblje-v-stevilkah",
        noteSi:
          "Zadnja postaja je sam popis: Griblach 1468, Briglach 1490, 329 prebivalcev danes. Vsaka številka v tem zapisu je kdo ali kaj — sprehod zaključimo tako, da preštejemo vas.",
        noteEn:
          "The last stop is the census itself: Griblach 1468, Briglach 1490, 329 inhabitants today. Every number in this record is a someone or a something — we close the walk by counting the village.",
      },
      {
        exhibitSlug: "obcina-griblje",
        noteSi:
          "In preden se poslovimo, še en papir z vaškim imenom: osemdeset let je bila ta vas občina — z županom in 435 dušami — preden so jo leta 1933 ukinili in leta 1936 poslali h Gradcu. Števke se menjujejo; ime ostane.",
        noteEn:
          "And before we part, one more paper bearing the village's name: for eighty years this village was a municipality — with a mayor and 435 souls — before it was abolished in 1933 and sent to Gradac in 1936. The numbers change; the name remains.",
      },
      {
        exhibitSlug: "td-griblje",
        noteSi:
          "In pred zadnjim postankom hišnik: Turistično društvo Griblje, ki drži koledar vasi — Pasuljado, žur, rally — in nosi ta muzej. Vas, ki se spominja sama, potrebuje nekoga, ki prinese koledar.",
        noteEn:
          "And before the last stop, the caretaker: the Griblje Tourist Society, which holds the village calendar — the Pasuljada, the party, the rally — and carries this museum. A village that remembers itself needs someone to bring the calendar.",
      },
      {
        exhibitSlug: "gribeljci-po-svetu-2019",
        noteSi:
          "Vse poti te vasi se stekajo nazaj: 2019 so se ob 130-letnici šole vrnili Gribeljci po svetu. Vsak, ki je odšel, je nosil s sabo isto učilnico.",
        noteEn:
          "All this village's roads flow back: in 2019, at the school's 130th anniversary, the world's Griblje people returned. Everyone who left carried the same classroom with them.",
      },
      {
        exhibitSlug: "ciril-totter",
        noteSi:
          "Zadnja postaja je sedanji čas: na Jandrečetovi zemlji ekološko kmetuje maratonc Ciril Totter. Veja, ki se je vrnila k plugu — in dodala tekaške čevlje.",
        noteEn:
          "The last stop is the present day: on Jandreči land the marathon runner Ciril Totter farms ecologically. The branch that came back to the plough — and added running shoes.",
      },
      {
        exhibitSlug: "anton-brodaric",
        noteSi:
          "Iz ravnine, ki nima niti hriba, v najvišjo točko, ki jo je kdaj dosegel vaščan: Anton Brodarič je stopil na Mera Peak, 6.467 metrov. Dvorana ob vrnitvi — sedemdeset ljudi — pove vse o tem, kam vas pošlje in kaj ji pomeni.",
        noteEn:
          "From a plain without a hill to the highest point a villager has ever reached: Anton Brodarič stood on Mera Peak, 6,467 metres. The hall on his return — seventy people — says everything about where a village sends you, and what you mean to it.",
      },
      {
        exhibitSlug: "sd-griblje-sport",
        noteSi:
          "In tek je ostal v vasi: ŠD Griblje vsako jesen pošlje sedmerico na ljubljanski maraton, Peter Križan pa je tekel svetovno prvenstvo v triatlonu. Kar Ciril nosi v nogah, društvo nosi v imenu vasi.",
        noteEn:
          "And running stayed in the village: every autumn ŠD Griblje sends a seven to the Ljubljana marathon, and Peter Križan has raced the triathlon world championship. What Ciril carries in his legs, the society carries in the village's name.",
      },
      {
        exhibitSlug: "matija-totter",
        noteSi:
          "In nazadnje najdaljša pot: Jandreč Matiček, ki je zapisoval šege in končal v Teksasu. Kar je zapustil, ni bogastvo — so zapisi, po katerih belokranjske običaje poznamo.",
        noteEn:
          "And finally the longest road: Jandreč Matiček, who wrote down the customs and ended in Texas. What he left was no fortune — it was the notes by which Bela krajina's customs are known.",
      },
      {
        exhibitSlug: "john-randolph-totter",
        noteSi:
          "Matičkova najmlajša veja: sin teksaške ravnine je odkril kemijo po kompletu za razcvetno analizo, ki mu ga je podaril duhovnik — in končal kot svetovno znan biokemik v Oak Ridgeu. Knjiga je zmagala nad plugom.",
        noteEn:
          "Matiček's youngest branch: a son of the Texas plain discovered chemistry through a blowpipe analysis kit given by a priest — and ended as a world-known biochemist at Oak Ridge. The book beat the plough.",
      },
      {
        exhibitSlug: "dragojila-milek",
        noteSi:
          "Vrnitev iz sveta: Dragojila Milek, hči očeta iz sosednjih Gribelj, je postala Gregorčičeva »planinska roža« — in končala v Podzemlju, župniji gribeljske cerkve, pri ravnatelju Ivanu Barletu iz našega registra.",
        noteEn:
          "A return from the world: Dragojila Milek, daughter of a father from neighbouring Griblje, became Gregorčič's 'mountain flower' — and ended in Podzemelj, the parish of the Griblje church, under the head teacher Ivan Barle from our register.",
      },
      {
        exhibitSlug: "valentina-strucelj",
        noteSi:
          "In pot, ki se še piše: gribeljski sintetizator je zrasel v klarinet, zavrnitev v Ljubljani pa v odliko v Gradcu. Danes iz Gribelj po svetu vodi tudi glasba — do Berna.",
        noteEn:
          "And a path still being written: a Griblje synthesizer grew into a clarinet, and a Ljubljana rejection into a distinction in Graz. Today music, too, leads from Griblje into the world — all the way to Bern.",
      },
    ],
  },
  {
    id: "vas-in-njeni-ljudje",
    titleSi: "Vas in njeni ljudje",
    titleEn: "The village and its people",
    descriptionSi:
      "Od prve omembe 1468 do belih brez: kraj, njegov zvonik, njen najbolj znan sin in ptice, ki se vračajo.",
    descriptionEn:
      "From the first mention in 1468 to the white birches: the place, its steeple, its most famous son and the birds that return.",
    stops: [
      {
        exhibitSlug: "griblje-vas",
        noteSi:
          "Začenjamo, kjer se je pisna zgodba začela: 1468. Osrednja vas in zaselki — Goranja lokva, Rudna peč — ena skupnost ob Kolpi.",
        noteEn:
          "We begin where the written story began: 1468. The main village and its hamlets — Goranja lokva, Rudna peč — one community on the Kolpa.",
      },
      {
        exhibitSlug: "sveti-vid",
        noteSi:
          "Rumena baročna cerkev na hribu je znamenitost, ki jo prepoznajo vsi, ki so kdaj šli skozi. Sveti Vid — zavetnik vasi.",
        noteEn:
          "The yellow Baroque church on the hill is the landmark everyone who ever passed through recognises. St. Vitus — patron of the village.",
      },
      {
        exhibitSlug: "petstoletnica-2026",
        noteSi:
          "Ista cerkev letos praznuje pol tisočletja: prvo pisno omembo so spomnili z obnovo stavbe, dvema publikacijama in novo ureditvijo okolice. Petsto let — ves čas en zvonik nad vasjo.",
        noteEn:
          "The same church marks half a millennium this year: its first written mention was remembered with the building's renewal, two publications and a newly arranged setting. Five hundred years — one steeple above the village all that time.",
      },

      {
        exhibitSlug: "zvon-2008",
        noteSi:
          "Zvonik živi z glasom: leta 2008 so blagoslovili nov zvon, o dogodku pa je nastala spominska knjiga — eden redkih tiskanih virov, nastalih v sami vasi.",
        noteEn:
          "A steeple lives by its voice: in 2008 a new bell was blessed, and a memorial book arose from the event — one of the rare printed sources created in the village itself.",
      },
      {
        exhibitSlug: "javna-razsvetljava-2023",
        noteSi:
          "Zvonik pa danes sije tudi ponoči: leta 2023 je vas dobila javno razsvetljavo — 70.000 evrov občine in 7.000 krajanov, arheološke raziskave ob gradnji pa so pod luč postavile tudi preteklost. Vas, ki si svet uredi sama.",
        noteEn:
          "And today the steeple shines at night as well: in 2023 the village received public lighting — €70,000 from the municipality and €7,000 from the villagers, and the archaeology dug during the construction brought the past into the light, too. A village that arranges its own world.",
      },
      {
        exhibitSlug: "niko-zupanic",
        noteSi:
          "Iz te vasi na Dunaj in nazaj: etnograf, ki je soustanovil Etnografski muzej v Beogradu, in diplomata, ki je pomiral meje.",
        noteEn:
          "From this village to Vienna and back: the ethnographer who co-founded the Ethnographic Museum in Belgrade, and the diplomat who calmed borders.",
      },
      {
        exhibitSlug: "nikolaj-dragos",
        noteSi:
          "Najdalj živeči moški, ki ga je Slovenija kdaj zapisala, je odraščal na Hajdeč gruntovi njivi — 110 let in 216 dni od gribeljske ajde do Pahorjevega obiska.",
        noteEn:
          "The longest-lived man Slovenia has ever recorded grew up on the Hajdeč farm's fields — 110 years and 216 days from Griblje buckwheat to a presidential visit.",
      },
      {
        exhibitSlug: "peter-kambic",
        noteSi:
          "Prvi učitelj gribeljske šole je bil tudi etnograf: njegov zapis o božiču pri Belokranjcih (1889) živi dlje od njegovih dvajsetih let.",
        noteEn:
          "The first teacher of the Griblje school was an ethnographer too: his account of Christmas among the Bela krajina people (1889) has outlived his twenty years.",
      },

      {
        exhibitSlug: "muzejska-ucilnica",
        noteSi:
          "Ista šola, v kateri je poučeval Kambič, ima danes muzejsko učilnico (2022) — fizično sestro tega digitalnega muzeja. Dve učilnici, ena naloga.",
        noteEn:
          "The same school where Kambič taught holds a museum classroom today (2022) — the physical sister of this digital museum. Two classrooms, one task.",
      },
      {
        exhibitSlug: "novo-zivljenje-1914",
        noteSi:
          "In šola, ki je postala knjiga: leta 1914 je pri Mohorjevi družbi izšla povest Novo življenje, dogajajoča se v Gribljah med gradnjo šole. Vas, ki se je dala prebrati.",
        noteEn:
          "And the school that became a book: in 1914 the St. Hermagoras Society published the tale Novo življenje, set in Griblje during the building of the school. A village that could be read.",
      },
      {
        exhibitSlug: "franc-brinc",
        noteSi:
          "In šola ima svojega dobrotnika: dr. Franc Brinc, učenec iz vojnih let, se je vrnil z darovi — gasilski dom, šola in cerkvena okolica so danes njegov spomenik.",
        noteEn:
          "And the school has its benefactor: dr. Franc Brinc, a pupil of the war years, returned with gifts — the fire station, the school and the churchyard are his monument today.",
      },
      {
        exhibitSlug: "jurjevanje",
        noteSi:
          "Pomlad prihaja z Zelenim Jurijem. Jurjevanje v Beli krajini je najstarejši folklorni festival v pokrajini — izročilo, ki še diha.",
        noteEn:
          "Spring arrives with Green George. Jurjevanje in Bela krajina is the oldest folklore festival in the region — a tradition still breathing.",
      },
      {
        exhibitSlug: "jurjevo-v-gribljah",
        noteSi:
          "Preden je festival zrasel v Črnomlju, je jurjevo hodilo od vrat do vrat: v Gribljah šola še danes spleta koš iz brezja in pošlje Zelenega Jurija po vasi — s pesmijo, ki se je ohranila v narečju.",
        noteEn:
          "Before the festival grew up in Črnomelj, jurjevo walked from door to door: in Griblje the school still weaves a basket of birch and sends Green George through the village — with a song preserved in the dialect.",
      },
      {
        exhibitSlug: "krizevo-pastirski-dan",
        noteSi:
          "Štirideset dni po veliki noči pastirji praznujejo svoj: križevo, dan, ko je pošlo poletje in pašniki. V Gribljah so ga obudili z igrami ob Kolpi — koledar vasi se zdaj bere od jurjeva do kresa brez manjkajočega lista.",
        noteEn:
          "Forty days after Easter the shepherds keep their feast: križevo, the day that opened the summer and the pastures. In Griblje it has been revived with games by the Kolpa — the village calendar now reads from jurjevo to kres without a missing page.",
      },
      {
        exhibitSlug: "storklje",
        noteSi:
          "Nad strehami se vsako pomlad prikažejo štorklje. Vračajo se istim gnezdom — tako kot ljudje, ki se vračajo v vas.",
        noteEn:
          "Above the rooftops, storks appear every spring. They return to the same nests — like the people who return to the village.",
      },
      {
        exhibitSlug: "bele-breze",
        noteSi:
          "Zadnja postaja je drevo, ki je pokrajini dalo ime: bela breza. Bela krajina — dežela brez in borovcev, svetlobe in peščenih tal.",
        noteEn:
          "The last stop is the tree that named the region: the white birch. Bela krajina — a land of birches and pines, light and sandy soil.",
      },
      {
        exhibitSlug: "zaselki-griblje",
        noteSi:
          "Vas, ki se razprostne: Dolnje, Srednje, Gornje in Brinsko selo. Preden spoznaš ljudje, spoznaj hiše — vsak zasek ima svoj odnos do reke.",
        noteEn:
          "The village that spreads out: Dolnje, Srednje, Gornje and Brinsko selo. Before you meet the people, meet the houses — each hamlet has its own relation to the river.",
      },
      {
        exhibitSlug: "tamburasi-danica",
        noteSi:
          "Kje se je začelo stoletje? Pri bugariji. Mladi Dragoš je v Ljubljani igral v tamburaški skupini Danica — glasba je bila njegova prva pot v svet.",
        noteEn:
          "Where did the century begin? At the bugarija. Young Dragoš played in Ljubljana's Danica tambura group — music was his first road into the world.",
      },
      {
        exhibitSlug: "dkz-griblje",
        noteSi:
          "Za tamburaši so v gasilskem domu za klavirjem sedežale ženske: Društvo kmečkih žena, ki speče kruh, naučijo pesem in obudijo pastirske igre. Drugi koledar vasi — tisti, ki ga ne pišejo žigi.",
        noteEn:
          "Behind the tambura players, at the piano of the fire station, sat the women: the Farm Women's Society, who bake the bread, teach the song and revive the shepherds' games. The village's second calendar — the one no stamp writes.",
      },
      {
        exhibitSlug: "ko-se-pticki-zenijo",
        noteSi:
          "In pomlad ima svoj praznik: gregorjevo, ki so ga leta 2026 obudili šola in krajevna skupnost — s kruhom vaških pekaric v glavni vlogi.",
        noteEn:
          "And spring has its feast: the Gregorjevo revived in 2026 by the school and the local community — with the village bakers' bread in the leading role.",
      },
      {
        exhibitSlug: "praznik-ks-2024",
        noteSi:
          "In pred zaključkom še dan, ko se je vas spomnila, da zna praznovati: prvi praznik KS po desetletjih — iz spomina na 1941 zrasel praznik dobrote.",
        noteEn:
          "And before the close, the day the village remembered it knows how to celebrate: the local community's first festival in decades — a feast of generosity grown from the memory of 1941.",
      },
      {
        exhibitSlug: "tone-kralj-98",
        noteSi:
          "In ves ta krog je še živ: Tone Kralj, 98 let, še lušči lešnike in karta s pravnuki. Vas, ki se ne samo spominja — še živi.",
        noteEn:
          "And this whole circle is still alive: Tone Kralj, 98, still shells hazelnuts and plays cards with his great-grandchildren. A village that does not only remember — it still lives.",
      },
      {
        exhibitSlug: "ljudje-ob-kolpi",
        noteSi:
          "Kdor je vse te zgodbe prvi povedal na glas? Radijska rubrika Ljudje ob Kolpi — današnji zapisovalec vasi. Muzej ji lahko le vrne posojeno.",
        noteEn:
          "Who first told all these stories aloud? The radio column People by the Kolpa — today's recorder of the village. The museum can only return what it borrowed.",
      },
      {
        exhibitSlug: "janko-barle",
        noteSi:
          "Za planko teh ljudi stoji zapisovalec: Janko Barle, učiteljev sin iz Podzemlja, je vzel vaške šege v svet — iz njegovih zapiskov je zrasla polovica tega, kar o belokranjskih običajih vemo.",
        noteEn:
          "Behind the bench of these people stands a recorder: Janko Barle, a teacher's son from Podzemelj, took the village customs into the world — from his notes grew half of what we know about Bela krajina's customs.",
      },
      {
        exhibitSlug: "konrad-barle",
        noteSi:
          "Jankov mlajši brat Konrad je ostal na tleh: učil je v Metliki in Beli krajini prinesel AŽ-panj — čebele, ki so spremenile vasi. In ko so leta 1949 ustanavljali Belokranjsko muzejsko društvo, je med ustanovnimi člani.",
        noteEn:
          "Janko's younger brother Konrad stayed on the ground: he taught in Metlika and brought the AŽ hive to Bela krajina — bees that changed the villages. And when the Bela krajina Museum Society was founded in 1949, he stood among the founding members.",
      },
      {
        exhibitSlug: "kucar-podzemelj",
        noteSi:
          "In vse, kar je ta učiteljska hiša pisala, je nastalo pod Kučarjem: hrib nad Podzemljem, pod katerim so se zapisovale Griblje — od keltskega zlata na Pezdirčevi njivi do matičnih knjig in prve abecede gribeljskih otrok.",
        noteEn:
          "And everything that teaching house wrote was written beneath Kučar: the hill above Podzemelj, under which Griblje was written down — from the Celtic gold of Pezdirčeva njiva to the parish registers and the village children's first alphabet.",
      },
      {
        exhibitSlug: "joze-dular",
        noteSi:
          "In mož, ki je spomin dodel v hišo: Jože Dular, trideset let Belokranjskega muzeja. Njegova knjižica o Županičevi plošči v Gribljah je dokument, da se je vas spomnila pravično.",
        noteEn:
          "And the man who gave memory a house: Jože Dular, thirty years of the Bela krajina museum. His booklet on Županič's plaque in Griblje is the document that the village remembered rightly.",
      },
      {
        exhibitSlug: "pisanice",
        noteSi:
          "Pomlad se v tej vasi riše na lupini: pisanice, batik, ki ga je leta 1893 znanstveno popisal Barle, leta 2012 pa ga je država vpisala v register žive dediščine.",
        noteEn:
          "Spring in this village is drawn on a shell: the pisanice, a batik that Barle recorded scholarly in 1893 and the state entered in the living heritage register in 2012.",
      },
      {
        exhibitSlug: "panjska-koncnica",
        noteSi:
          "Poleti pa ista roka riše na les: panjska končnica, vaška galerija pod streho čebelnjaka — mož iz gostilne, lisica, ki brije lovca, lovčev pogreb. Šeststo motivov, petdeset tisoč platov, register pa jih je vpisal leta 2018, šest let za pisanicami.",
        noteEn:
          "In summer the same hand draws on wood: the panjska končnica, the village gallery under the apiary roof — the man from the inn, the fox shaving the hunter, the hunter's funeral. Six hundred motifs, fifty thousand fronts; the register entered them in 2018, six years after the pisanice.",
      },
      {
        exhibitSlug: "kresovanje",
        noteSi:
          "Poletje zaključimo z ognjem: kres na večer pred sv. Janezom, s pesmijo, ki jo je rešil gribeljski Matiček. Šega, ki ne pusti predmeta — ostane pesem in spomin.",
        noteEn:
          "We close summer with fire: the bonfire on St. John's eve, with the song Griblje's Matiček saved. A custom that leaves no object — a song and a memory remain.",
      },
      {
        exhibitSlug: "belokranjska-nosa",
        noteSi:
          "In ko se leto zavrti do praznika, se obleče bela ruta: belokranjska noša s pečo, pokrivalom, ki se veže z rožo na čelu. V njej so hodile te šege — in v nji še hodijo.",
        noteEn:
          "And when the year turns to a feast, the white cloth dresses: the Bela krajina costume with the peča, the head covering tied with a flower on the forehead. These customs walked in it — and still do.",
      },
    ],
  },
];

/**
 * Družinski sprehod — kurirana pot za obiskovalce od 6 do 12 let.
 * Vzorec: družinski vodnik Van Goghovega muzeja (6–12 let) in
 * Petite Galerie Louvra: postaje so poštevne, kratke in vsaka nosi
 * eno vprašanje, na katerega odgovarja slika ali zapis. Naslanja se
 * na družinam najbolj dostopne zapise zbirke (lahko se prekriva
 * s tematskimi sprehodi).
 */
export const FAMILY_WALK: Walk = {
  id: "druzinski-sprehod",
  titleSi: "Družinski sprehod",
  titleEn: "Family walk",
  descriptionSi:
    "Šest postaj za mlade raziskovalce: vas, cerkev, reka, ribnik, štorklje in bele breze. Vsaka postaja postavi eno vprašanje — odgovor se skriva v sliki ali zapisu.",
  descriptionEn:
    "Six stops for young explorers: the village, the church, the river, the pond, the storks and the white birches. Every stop asks one question — the answer hides in the picture or the record.",
  stops: [
    {
      exhibitSlug: "griblje-vas",
      noteSi:
        "Vsaka raziskava se začne pri začetku. To je Griblje — razpotegnjena vas ob reki Kolpi. Poišči na sliki cerkev na hribu!",
      noteEn:
        "Every expedition begins at the beginning. This is Griblje — a long village on the Kolpa river. Can you find the church on the hill in the picture?",
    },
    {
      exhibitSlug: "sveti-vid",
      noteSi:
        "Rumena cerkev svetega Vida stoji na hribu nad vasjo in jo prepoznajo vsi, ki so kdaj šli skozi. Zakaj ima cerkev zvon? Pomisli, za kaj so ga nekoč uporabljali.",
      noteEn:
        "The yellow church of St. Vitus stands on the hill above the village — everyone who ever passed through recognises it. Why does a church have a bell? Think about what it was once used for.",
    },
    {
      exhibitSlug: "kolpa-reka",
      noteSi:
        "Kolpa je najtoplejša reka v Sloveniji — poleti se v njej kopajo cele družine, nekoč pa je gnala tudi mline. Preštej, koliko čolnov ali mostov vidiš na sliki!",
      noteEn:
        "The Kolpa is the warmest river in Slovenia — in summer whole families swim in it, and it once powered the mills. Count how many boats or bridges you can spot in the picture!",
    },
    {
      exhibitSlug: "ribnik",
      noteSi:
        "Vaški ribnik je pojilišče in počivališče v enem. Katere živali misliš, da pridejo sem piti? Nekatere so majhne kot žuželke, nekatere večje od psa.",
      noteEn:
        "The village pond is a watering place and a resting place in one. Which animals do you think come here to drink? Some are as small as insects, others bigger than a dog.",
    },
    {
      exhibitSlug: "storklje",
      noteSi:
        "Štorklje vsako pomlad priletijo iz tovrnih dežel in se naselijo na strehah vasi — vedno v isto gnezdo. Zakaj misliš, da se vračajo prav tja?",
      noteEn:
        "Every spring the storks fly back from warm countries and settle on the rooftops — always in the same nest. Why do you think they return to that exact one?",
    },
    {
      exhibitSlug: "bele-breze",
      noteSi:
        "Bela breza je drevo, ki je dalo ime celi pokrajini: Beli krajini. Lubje je res belo in se lušči kot papir. Kaj še vidiš na sliki, kar je belo?",
      noteEn:
        "The white birch is the tree that named the whole region: Bela krajina — White Carniola. Its bark really is white and peels like paper. What else can you see in the picture that is white?",
    },
  ],
};

/** Vsi kurirani sprehodi muzeja (tematski + družinski). */
export const ALL_WALKS: Walk[] = [...WALKS, FAMILY_WALK];

/**
 * Zgradi osebni sprehod obiskovalca iz shranjenih slugov postaj
 * (mvg-my-walk). Vzorec: obiskovalne poti Louvra in »Collections«
 * Rijksmuseuma — pot, ki si jo obiskovalec sestavi sam, se zažene
 * kot vsak drug vodeni ogled. Opombe postaj so namerno splošne:
 * izbira je kuratorsko mnenje obiskovalca, ne muzeja.
 */
export function buildMyWalk(slugs: string[]): Walk | null {
  if (slugs.length === 0) return null;
  return {
    id: "moj-sprehod",
    titleSi: "Moj sprehod",
    titleEn: "My walk",
    descriptionSi:
      "Pot skozi zbirko, ki ste si jo sestavili sami — po vzoru obiskovalnih poti Louvra.",
    descriptionEn:
      "A route through the collection you assembled yourself — after the Louvre's visitor trails.",
    stops: slugs.map((slug) => ({
      exhibitSlug: slug,
      noteSi: "Postaja, ki ste jo izbrali za svojo pot skozi vas.",
      noteEn: "A stop you chose for your own route through the village.",
    })),
  };
}

/** Poišče sprehod po identifikatorju (tematski, družinski). */
export function getWalk(id: string): Walk | undefined {
  return ALL_WALKS.find((walk) => walk.id === id);
}

/**
 * Postaja kuriranega TEMATSKEGA sprehoda, ki nosi dani zapis.
 * Vseh 93 zapisov je pokritih s 5 tematskimi sprehodi točno enkrat
 * (družinski sprehod je podmnožica — zato iščemo samo po WALKS).
 * Vrača null, če zapis ni (več) na nobenem sprehodu.
 */
export function walkStopOf(slug: string): {
  walk: Walk;
  index: number;
} | null {
  for (const walk of WALKS) {
    const index = walk.stops.findIndex((s) => s.exhibitSlug === slug);
    if (index >= 0) return { walk, index };
  }
  return null;
}

/**
 * Vrne postaje sprehoda, povezane z dejanskimi zapisi iz zbirke.
 * Zapisi, ki ne obstajajo več (preimenovan slug), se tiho izpustijo —
 * sprehod ostane berljiv tudi ob spremembah zbirke.
 */
export function resolveWalkStops(
  walk: Walk,
  exhibits: ExhibitDTO[]
): { exhibit: ExhibitDTO; noteSi: string; noteEn: string }[] {
  return walk.stops
    .map((stop) => {
      const exhibit = exhibits.find((ex) => ex.slug === stop.exhibitSlug);
      return exhibit ? { exhibit, noteSi: stop.noteSi, noteEn: stop.noteEn } : null;
    })
    .filter((s): s is { exhibit: ExhibitDTO; noteSi: string; noteEn: string } =>
      Boolean(s)
    );
}

/** Ocena trajanja sprehoda v minutah (branje + avdio na postaji). */
export function walkMinutes(stopCount: number): number {
  return stopCount * 4;
}
