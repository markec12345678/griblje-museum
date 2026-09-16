import type { ExhibitDTO } from "@/lib/types";

/**
 * Muzejski sprehodi — kurirane tematske poti skozi zbirko.
 * Vzorec: vodeni ogledi Norsk Folkemuseum (odprti muzej na Bygdøyu),
 * preneseni v digitalni prostor: vsaka postaja je zapis iz zbirke,
 * obogaten s kuratorsko opombo, ki povezuje postave v pripoved.
 *
 * Pogoj celovitosti: vseh pet sprehodov skupaj pokrije VSE zapise
 * zbirke (2026: 30 zapisov), vsak zapis natanko enkrat.
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
        exhibitSlug: "zaseda-1941",
        noteSi:
          "Prva kri te vojne prihaja zgodaj: 6. septembra 1941, prva oborožena akcija belokranjskih partizanov — prav na cesti Črnomelj–Griblje, na vašem pragu.",
        noteEn:
          "This war's first blood comes early: on 6 September 1941, the first armed action of the Bela krajina partisans — right on the Črnomelj–Griblje road, on the village's doorstep.",
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
        exhibitSlug: "pasuljada",
        noteSi:
          "In jedilnik se ne konča s preteklostjo: vsak avgust v Gribljah kuhajo pasulj na tekmovanje — nova šega, ki je postala koledarska.",
        noteEn:
          "And the menu does not end with the past: every August Griblje cooks bean stew for a contest — a new custom that became a calendar date.",
      },
      {
        exhibitSlug: "tkalstvo",
        noteSi:
          "Ko polje počiva, začnejo stati statve. Platno je bilo denar: iz lanu so nastajale rute, prti in doto.",
        noteEn:
          "When the fields rested, the looms began. Linen was money: from flax came headscarves, tablecloths and dowries.",
      },
      {
        exhibitSlug: "vino-in-crnina",
        noteSi:
          "Zadnja postaja diši po kletarski: metliška črnina, prvič ustekleničena 1968, danes zaščitena geografska označba.",
        noteEn:
          "The last stop smells of the cellar: metliška črnina, first bottled in 1968, today a protected geographical indication.",
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
        exhibitSlug: "matice-podzemelj",
        noteSi:
          "In korenine so zapisane: matične knjige župnije Podzemelj (1669–1947) so digitalizirane in proste — vsak Gribeljec po svetu lahko dane prebere, kje se je njegova zgodba začela.",
        noteEn:
          "And the roots are written down: the Podzemelj parish registers (1669–1947) are digitised and free — any Griblje family in the world can today read where their story began.",
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
        exhibitSlug: "jurjevanje",
        noteSi:
          "Pomlad prihaja z Zelenim Jurijem. Jurjevanje v Beli krajini je najstarejši folklorni festival v pokrajini — izročilo, ki še diha.",
        noteEn:
          "Spring arrives with Green George. Jurjevanje in Bela krajina is the oldest folklore festival in the region — a tradition still breathing.",
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
