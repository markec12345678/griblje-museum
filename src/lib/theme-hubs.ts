import type { ExhibitCategory } from "@/lib/types";

/**
 * Tematska središča — »node« strani zbirke po vzoru Collection Online
 * Rijksmuseuma: vsaka tema je majhna, kurirana vstopna točka v zbirko
 * (uvod, najbolj obiskani zapisi, zgodbe, sorodne teme).
 *
 * Za razliko od Rijksmuseuma, ki jih generira iz linked-open-data grafa
 * z milijoni predmetov, so tukaj ročno kurirane — pri 30 zapisih je
 * pozornost dragocena dobrina.
 */

export type RelatedTheme = {
  category: ExhibitCategory;
  reasonSi: string;
  reasonEn: string;
};

export type ThemeHub = {
  category: ExhibitCategory;
  /** Kuratorski uvod (2–3 stavka, SLO/EN). */
  introSi: string;
  introEn: string;
  /** Zapis, s katerim tema najbolj naravno začne (hero teme). */
  startSlug: string;
  related: RelatedTheme[];
};

export const THEME_HUBS: ThemeHub[] = [
  {
    category: "kraj",
    startSlug: "griblje-vas",
    introSi:
      "Griblje so razpotegnjena vas v občini Črnomelj, prvič izpričana leta 1468. Vsaka stavba, pot in priimek tu nosi sled stoletij — od cerkvenega hriba, ki drži vas skupaj, do domačij, ki so dale ime pokrajini.",
    introEn:
      "Griblje is a stretched-out village in the Črnomelj municipality, first recorded in 1468. Every building, path and family name carries a trace of centuries — from the church hill that holds the village together to the farmsteads that gave the region its name.",
    related: [
      {
        category: "kolpa",
        reasonSi: "vas in reka sta od nekdaj ena zgodba",
        reasonEn: "the village and the river have always been one story",
      },
      {
        category: "vojna",
        reasonSi: "kdo sme tu živeti, so stoletja odločale meje",
        reasonEn: "for centuries, borders decided who may live here",
      },
    ],
  },
  {
    category: "kolpa",
    startSlug: "kolpa-reka",
    introSi:
      "Kolpa velja za eno najtoplejših rek Slovenije — in za Griblje je bila vedno vse naenkrat: državna meja, poletno kopališče, mlinarica in shranjevalnica spominov. Ob njej so nastajali mlini, malence in poletja brez konca.",
    introEn:
      "The Kolpa is counted among Slovenia's warmest rivers — and for Griblje it has always been everything at once: a state border, a summer bathing spot, a miller's power source and a keeper of memories. Along it grew mills, weirs and summers without end.",
    related: [
      {
        category: "gospodarstvo",
        reasonSi: "mlini so ob reki poganjali kmečko gospodarstvo",
        reasonEn: "the river's mills powered the farm economy",
      },
      {
        category: "narava",
        reasonSi: "reka je hranila tudi ribnike in življenje ob njih",
        reasonEn: "the river also fed the ponds and the life around them",
      },
    ],
  },
  {
    category: "vojna",
    startSlug: "uskoki-in-vojna-krajina",
    introSi:
      "Ti kraji nikoli niso bili daleč od velike zgodovine: od uskoške Vojne krajine v 16. stoletju, čez zasedanje SNOS-a leta 1944 in partizansko letališče Otok, do mejnih kamnov samostojne Slovenije. Vojna tu ni datum — je krajevna geografija.",
    introEn:
      "These lands were never far from great history: from the Uskok Military Frontier of the 16th century, through the SNOS assembly of 1944 and the partisan airfield at Otok, to the boundary stones of independent Slovenia. Here, war is not a date — it is local geography.",
    related: [
      {
        category: "kraj",
        reasonSi: "meje so oblikovale, kdo tu živi in kako",
        reasonEn: "borders shaped who lives here and how",
      },
      {
        category: "kolpa",
        reasonSi: "reka je bila stoletja ravno toliko meja kot voda",
        reasonEn: "for centuries the river was as much border as water",
      },
    ],
  },
  {
    category: "narava",
    startSlug: "bele-breze",
    introSi:
      "Bela krajina je dežela belih brez, štorkelj in mirnih ribnikov — pokrajina, ki je svoje ime dobila po drevesu. Narava tu ni kulisa: je soimenjakinja dežele, gnezdišče nad dimniki in zrcalo na vaškem ribniku.",
    introEn:
      "Bela krajina is a land of white birches, storks and quiet ponds — a region named after a tree. Nature here is not a backdrop: it is the region's namesake, a nest above the chimneys and a mirror on the village pond.",
    related: [
      {
        category: "kolpa",
        reasonSi: "reka in njeni mrtvici so življenjska žila te narave",
        reasonEn: "the river and its backwaters are this nature's lifeline",
      },
      {
        category: "sege",
        reasonSi: "zelena jurjeva mladina je narava v praznični vlogi",
        reasonEn: "the green St. George's boughs are nature in its festive role",
      },
    ],
  },
  {
    category: "gospodarstvo",
    startSlug: "vino-in-crnina",
    introSi:
      "Iz apnenčaste zemlje je treba življenje iztisniti z roko: vinogradi metliške črnine, platno na leseni statvi, belokranjska hiša, »postavljena s revščino«. Gospodarstvo Bele krajine je zgodovina iznajdljivosti, ne obilja.",
    introEn:
      "Life had to be wrung from limestone soil by hand: the vineyards of Metliška črnina, linen on the wooden loom, the white farmhouse »built by poverty«. The economy of Bela krajina is a history of ingenuity, not abundance.",
    related: [
      {
        category: "kolpa",
        reasonSi: "mlini ob Kolpi so mleli, kar so njive dale",
        reasonEn: "the mills on the Kolpa ground what the fields gave",
      },
      {
        category: "sege",
        reasonSi: "iz revščine je zrasla tudi kultura okusa",
        reasonEn: "a culture of taste grew out of the same poverty",
      },
    ],
  },
  {
    category: "sege",
    startSlug: "jurjevanje",
    introSi:
      "Jurjevanje, pustne maske, pogača in matevž: šege so koledar vasi, ki se vsako leto znova ponovi. V Beli krajini so ljudsko izročilo ohranjali dolgo, preden je postalo muzejska vrednota — jurjevanje v Preložah velja za najstarejšo prireditev te vrste.",
    introEn:
      "St. George's processions, carnival masks, pogača bread and matevž: customs are the village calendar, repeating itself every year. Bela krajina preserved its folk traditions long before they became museum values — the jurjevanje at Prelože counts among the oldest events of its kind.",
    related: [
      {
        category: "narava",
        reasonSi: "jurjeva zelena mladina pomladi iz gozda",
        reasonEn: "the green boughs of St. George come from the spring woods",
      },
      {
        category: "gospodarstvo",
        reasonSi: "vsak praznik ima tudi svojo mizo",
        reasonEn: "every celebration has its table too",
      },
    ],
  },
];

export function getThemeHub(category: ExhibitCategory): ThemeHub | undefined {
  return THEME_HUBS.find((hub) => hub.category === category);
}
