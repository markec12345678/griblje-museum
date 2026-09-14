import type { ExhibitDTO } from "@/lib/types";

/**
 * Muzejski sprehodi — kurirane tematske poti skozi zbirko.
 * Vzorec: vodeni ogledi Norsk Folkemuseum (odprti muzej na Bygdøyu),
 * preneseni v digitalni prostor: vsaka postaja je zapis iz zbirke,
 * obogaten s kuratorsko opombo, ki povezuje postave v pripoved.
 *
 * Pogoj celovitosti: vsi štirje sprehodi skupaj pokrijejo VSE zapise
 * zbirke (2026: 20 zapisov), vsak zapis natanko enkrat.
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
          "Zadnja postaja vodnega sprehoda je vode, ki so jo prinesli domov — ribnik ob vasi, pojilišče in počivališče v enem.",
        noteEn:
          "The last stop of the water walk is water brought home — the pond by the village, a watering place and a resting place in one.",
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
    id: "vas-in-njeni-ljudje",
    titleSi: "Vas in njeni ljudje",
    titleEn: "The village and its people",
    descriptionSi:
      "Od prve omembe 1526 do belih brez: kraj, njegov zvonik, njen najbolj znan sin in ptice, ki se vračajo.",
    descriptionEn:
      "From the first mention in 1526 to the white birches: the place, its steeple, its most famous son and the birds that return.",
    stops: [
      {
        exhibitSlug: "griblje-vas",
        noteSi:
          "Začenjamo, kjer se je pisna zgodba začela: 1526. Osrednja vas in zaselki — Goranja lokva, Rudna peč — ena skupnost ob Kolpi.",
        noteEn:
          "We begin where the written story began: 1526. The main village and its hamlets — Goranja lokva, Rudna peč — one community on the Kolpa.",
      },
      {
        exhibitSlug: "sveti-vid",
        noteSi:
          "Rumena baročna cerkev na hribu je znamenitost, ki jo prepoznajo vsi, ki so kdaj šli skozi. Sveti Vid — zavetnik vasi.",
        noteEn:
          "The yellow Baroque church on the hill is the landmark everyone who ever passed through recognises. St. Vitus — patron of the village.",
      },
      {
        exhibitSlug: "niko-zupanic",
        noteSi:
          "Iz te vasi na Dunaj in nazaj: etnograf, ki je soustanovil Etnografski muzej v Beogradu, in diplomata, ki je pomiral meje.",
        noteEn:
          "From this village to Vienna and back: the ethnographer who co-founded the Ethnographic Museum in Belgrade, and the diplomat who calmed borders.",
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

/** Poišče sprehod po identifikatorju. */
export function getWalk(id: string): Walk | undefined {
  return WALKS.find((walk) => walk.id === id);
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
