import type { ExhibitDTO } from "@/lib/types";

/**
 * Zapis meseca — uredniška rubrika, po vzoru »Picture of the month«
 * National Gallery London (serija iz vojnih let: vsak mesec ena slika,
 * eno besedilo, zakaj je ravno ta na vrsti).
 *
 * Razlikuje se od »Danes v muzeju« (dnevna rotacija) in »Sezonske
 * police« (štiri kratice letnega časa): zapis meseca je EN zapis z
 * uredniško utemeljitvijo, ki jo narekuje koledar vasi — godovi,
 * obletnice in letni časi. Vsak mesec ima svoj nabor kandidatov;
 * izbor znotraj nabora je determinističen (leto + mesec), tako da je
 * vsem obiskovalcem istega meseca prikazan isti zapis, naslednje leto
 * pa nabor zamenja kandidata. Če zapisa ni (več) v zbirki, vzame
 * naslednjega kandidata — rubrika ne pade.
 *
 * Utemeljitve so kurate po javnih, preverjenih datumih zapisov
 * (npr. SNOS 19.–20. februar 1944; zračni most 25.–26. marec 1945;
 * odkritje črnega močerila 18. oktober 1986) — ni izmišljenih koledarskih
 * vezmi.
 */

/** Deterministična razpršitev (Fibonacci hashing) — ista oblika kot ostale rotacijske rubrike. */
function hash32(n: number): number {
  let h = (n ^ 0x9e3779b9) | 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h = (h ^ (h >>> 16)) >>> 0;
  return h;
}

export type MonthlyEntry = {
  slug: string;
  /** Uredniška utemeljitev »zakaj ta zapis ta mesec« — glas kustosa. */
  noteSi: string;
  noteEn: string;
};

/** Indeks meseca 0–11 (januar → december). */
export const MONTHLY_POOLS: MonthlyEntry[][] = [
  /* ------------------------------ JANUAR ------------------------------ */
  [
    {
      slug: "griblje-v-stevilkah",
      noteSi:
        "Novo leto je praznik številk — ta zapis pa jih vasi, prvič izpričani leta 1468, prešteje vse: od hiš do prebivalcev. Dober mesec za računanje.",
      noteEn:
        "A new year is a festival of numbers — and this record counts them all for a village first recorded in 1468: from houses to inhabitants. A good month for arithmetic.",
    },
    {
      slug: "vaska-sola",
      noteSi:
        "Januar je središče šolskega leta: zvezki, tablice in mrak, ki pade čez igrišče. Zapis o šoli, ki je Gribljam leta 1869 odprla pot v svet.",
      noteEn:
        "January is the middle of the school year: exercise books, blackboards and dusk falling over the playground. The record of the school that opened the world to Griblje in 1869.",
    },
    {
      slug: "tkalstvo",
      noteSi:
        "Zimski večeri so nekoč pripadali statvam — predenje, tkanje in klepet ob eni sveči. Ko zunaj piha, si oglejmo platno, ki je obleklo vas.",
      noteEn:
        "Winter evenings once belonged to the looms — spinning, weaving and talk by a single candle. While the wind blows outside, look at the cloth that dressed a village.",
    },
    {
      slug: "belokranjska-hisa",
      noteSi:
        "Januar se zadržuje v hiši: ob peči, pod odprtim ognjiščem, kjer je dim po stropu risal svoje zemljevide.",
      noteEn:
        "January keeps to the house: by the stove, under the open hearth where smoke drew its own maps across the ceiling.",
    },
    {
      slug: "tone-kralj-98",
      noteSi:
        "Januarja 2026 je Tone Kralj praznoval 98. rojstni dan — z lešniki, peteršiljem in kartami s pravnuki. Mesec rojstnodnevnih miz.",
      noteEn:
        "In January 2026 Tone Kralj celebrated his 98th birthday — with hazelnuts, parsley and cards with the great-grandchildren. The month of birthday tables.",
    },
  ],
  /* ------------------------------ FEBRUAR ----------------------------- */
  [
    {
      slug: "anton-brodaric",
      noteSi:
        "Februarja 2025 je Kovačnica sreče dišala po čaju in Himalaji: Anton Brodarič je vasi pripovedoval o Mera Peaku. Mesec zimskih zgodb — in gora, ki jo je plezal gribeljski sin.",
      noteEn:
        "In February 2025 the Kovačnica sreče smelled of tea and the Himalaya: Anton Brodarič told the village of Mera Peak. A month of winter tales — and a mountain climbed by a son of Griblje.",
    },
    {
      slug: "snos-crnomelj-1944",
      noteSi:
        "19. in 20. februarja 1944 se je v Črnomlju, devet kilometrov od Gribelj, sestal prvi slovenski parlament. Februar je njegov mesec.",
      noteEn:
        "On 19–20 February 1944, nine kilometres from Griblje, Črnomelj hosted the first Slovenian parliament. February is its month.",
    },
    {
      slug: "jurjevanje",
      noteSi:
        "Pust pripada poznozimskemu koledarju: maske, šale in zima, potolčena pred postom. Zapis razgrinja tudi njegovo belokranjsko podobo.",
      noteEn:
        "Carnival belongs to the late-winter calendar: masks, jokes and a winter well and truly worn down before Lent. This record unfolds its Bela krajina face, too.",
    },
    {
      slug: "matice-podzemelj",
      noteSi:
        "Dolgi februarski večeri so čas rodoslovja: matične knjige župnije Podzemelj, 1669–1947, so arhiv, v katerem se vsako gribeljsko ime najde.",
      noteEn:
        "The long evenings of February are genealogy season: the parish registers of Podzemelj, 1669–1947, are the archive where every Griblje name can be found.",
    },
    {
      slug: "konrad-barle",
      noteSi:
        "19. februarja 1875 se je v Podzemlju rodil Konrad Barle — čebelar, ki je Beli krajini prinesel AŽ-panj, in mož, ki je postavil prve temelje Belokranjskega muzeja. Februarska obletnica učiteljske hiše, iz katere je zrasel tudi ta muzej.",
      noteEn:
        "On 19 February 1875 Konrad Barle was born at Podzemelj — the beekeeper who brought the AŽ hive to Bela krajina, and the man who laid the first foundations of the Bela krajina museum. A February anniversary of the teaching house from which this museum too grew.",
    },
  ],
  /* ------------------------------- MAREC ------------------------------ */
  [
    {
      slug: "dkz-griblje",
      noteSi:
        "Pozdrav pomladi, ki ga konec marca pripravijo šola, skupnost in kmečke žene, je najlepši dokaz, da pomlad ne pride sama — jo speče. Mesec društva, ki drži drugi koledar vasi.",
      noteEn:
        "The Spring Greeting, prepared at the end of March by the school, the community and the farm women, is the finest proof that spring does not come on its own — it is baked. The month of the society that holds the village's second calendar.",
    },
    {
      slug: "ko-se-pticki-zenijo",
      noteSi:
        "Ob gregorjevem se ptički ženijo — in leta 2026 so to šego v Gribljah znova oživili v gasilskem domu. Marec se v vasi ni mogel začeti bolj pesniško.",
      noteEn:
        "Around St. Gregory's day the birds marry — and in 2026 the village revived the custom at the fire station. March could not begin more poetically.",
    },
    {
      slug: "zracni-most-krasinec",
      noteSi:
        "25. in 26. marca 1945 je zračni most Krasinec v 48 urah prepeljal 2041 ljudi — največja reševalna akcija na teh tleh. Marec je njen obletnica.",
      noteEn:
        "On 25–26 March 1945 the Krasinec air bridge carried 2,041 people out in 48 hours — the largest rescue operation on this soil. March is its anniversary.",
    },
    {
      slug: "evakuacija-1945",
      noteSi:
        "Marec 1945: zavezniška letala ponoči nad Gribljami, ranjenci na nosilih, travniki, označeni z lučmi. Vojna se je tukaj končevala pod zvezdami.",
      noteEn:
        "March 1945: Allied planes over Griblje by night, the wounded on stretchers, meadows marked with lights. Here the war was ending beneath the stars.",
    },
  ],
  /* ------------------------------- APRIL ------------------------------ */
  [
    {
      slug: "razglednica-1903",
      noteSi:
        "Dvaindvajsetega aprila 1903 je iz Metlike potovala v Griblje razglednica — dan, ki ga ta zapis praznuje vsako leto. April je mesec pošte, ki je vedno našla vas.",
      noteEn:
        "On 22 April 1903 a postcard travelled from Metlika to Griblje — a day this record keeps every year. April is the month of a post that always found the village.",
    },
    {
      slug: "jurjevanje",
      noteSi:
        "Zeleni Jurij ob koncu aprila odpre pomlad — šega, ki je Beli krajini dala tudi njej najbolj znan praznik. Najbolj aprilska stran zbirke.",
      noteEn:
        "The Green George at the end of April opens the spring — the custom that also gave Bela krajina its best-known festival. The most April-like page of the collection.",
    },
    {
      slug: "jurjevo-v-gribljah",
      noteSi:
        "24. april: v Gribljah Zeleni Jurij v košu iz brezja obide vas od hiše do hiše — s pesmijo, ki se je ohranila v narečju. Šega, ki jo živi šola.",
      noteEn:
        "24 April: in Griblje Green George in his birch basket walks the village door to door — with a song preserved in the dialect. A custom kept alive by the school.",
    },
    {
      slug: "pisanice",
      noteSi:
        "Velika noč prinese pisanice: pomlad, ki jo Belokranjci narišemo sami. Šega je v zbirki dokumentirana od leta 1893.",
      noteEn:
        "Easter brings pisanice: the spring that the people of Bela krajina draw for themselves. The custom is documented in the collection from 1893.",
    },
    {
      slug: "storklje",
      noteSi:
        "Aprila se štorklje vračajo iz Afrike in zasedejo stara gnezda nad vasmi — ptica, ki tukaj velja za pomladni koledar.",
      noteEn:
        "In April the storks return from Africa and reclaim the old nests above the villages — the bird that serves here as the calendar of spring.",
    },
  ],
  /* -------------------------------- MAJ ------------------------------- */
  [
    {
      slug: "krizevo-pastirski-dan",
      noteSi:
        "Štirideset dni po veliki noči, pogosto ravno v maju, pastirji praznujejo križevo. Letos je sprehod mimo kopališča, kjer so igre spet žive — mesec, ki odpira poletje.",
      noteEn:
        "Forty days after Easter — most often in May — the shepherds keep križevo. This year the walk passes the pool where the games live again — the month that opens the summer.",
    },
    {
      slug: "storklje",
      noteSi:
        "Maj je mesec mladičev na gnezdih: štorkljevske družine nad vasmi se povečajo, mladiči pa postanejo glasni.",
      noteEn:
        "May is the month of chicks on the nests: stork families above the villages grow, and the fledglings turn loud.",
    },
    {
      slug: "katarina-zupanic",
      noteSi:
        "Maj diši po poljskih cvetlicah — med njimi je tudi šopek, ki ga je Katarina Zupanič iz Gribelj leta 1894 poslala med besede.",
      noteEn:
        "May smells of wildflowers — among them the bouquet that Katarina Zupanič of Griblje sent into words in 1894.",
    },
    {
      slug: "kolpa-reka",
      noteSi:
        "Ko se voda ogreje, se vas znova preseli na breg — dober mesec za zapis o reki, ki je narisala obliko vasi.",
      noteEn:
        "As the water warms, the village moves back to the riverbank — a good month for the record of the river that drew the village's shape.",
    },
  ],
  /* ------------------------------- JUNIJ ------------------------------ */
  [
    {
      slug: "sveti-vid",
      noteSi:
        "15. junij je dan sv. Vida, zavetnika vaške cerkve — god, ob katerem je leta 2026 zbirka slavila še petstoletnico cerkve.",
      noteEn:
        "15 June is the day of St. Vitus, patron of the village church — the feast around which, in 2026, the collection also celebrated the church's 500th anniversary.",
    },
    {
      slug: "kresovanje",
      noteSi:
        "Pred dnem sv. Janeza Krstnika se prižgejo kresovi: najkrajša noč v letu ima v Beli krajini svoj ogenj in svojo pesem.",
      noteEn:
        "Bonfires are lit on the eve of St. John the Baptist's day: the shortest night of the year has its own fire and its own song in Bela krajina.",
    },
    {
      slug: "gribeljci-po-svetu-2019",
      noteSi:
        "19. junija 2019 so se Gribeljci z vsega sveta vrnili v vas ob 130-letnici šole. Junij je mesec vračanj.",
      noteEn:
        "On 19 June 2019, Griblje people from around the world came home for the school's 130th anniversary. June is the month of returns.",
    },
    {
      slug: "porocna-1669",
      noteSi:
        "Junij je mesec svatb — in najstarejša knjiga župnije Podzemelj je prav poročna: začela se je leta 1669 s svatbenimi vpisi. Ženin, nevesta in priče: začetek vseh gribeljskih rodovnikov.",
      noteEn:
        "June is the month of weddings — and the Podzemelj parish's oldest book is precisely a marriage register: it began in 1669 with wedding entries. Groom, bride and witnesses: the beginning of every Griblje family tree.",
    },
  ],
  /* ------------------------------- JULIJ ------------------------------ */
  [
    {
      slug: "tobacka-leta",
      noteSi:
        "Julij je bil nekdaj mesec tobaka: trgatve z roko, sušenje na palicah, vonj nad njivami. Tega praznika koledar ne piše več — muzej pa ga hrani.",
      noteEn:
        "July was once the month of tobacco: hand-picking, curing on sticks, the smell over the fields. No calendar writes this feast any more — the museum keeps it.",
    },
    {
      slug: "kopalisce-griblje",
      noteSi:
        "Julij ima svoj naslov: kopališče Griblje. Poletje, ki se ga spomnijo vsi, ki so ob Kolpi odraščali.",
      noteEn:
        "July has its own address: the Griblje bathing spot. The summer remembered by everyone who grew up on the Kolpa.",
    },
    {
      slug: "kolpa-reka",
      noteSi:
        "Julij je mesec, ko Kolpa doseže dvaindvajset stopinj in postane javni dom vasi — reka kot dnevna soba.",
      noteEn:
        "July is when the Kolpa reaches twenty-two degrees and becomes the village's public living room — a river as a common room.",
    },
    {
      slug: "mlini-na-kolpi",
      noteSi:
        "Poletni sprehodi ob reki vodijo mimo mlinov: zapis o mlinarjih, ki so bili ob Kolpi doma, ko je voda še meljala.",
      noteEn:
        "Summer walks along the river lead past the mills: a record of the millers who were at home on the Kolpa when the water still ground.",
    },
  ],
  /* ------------------------------ AVGUST ------------------------------ */
  [
    {
      slug: "strucelj-kmetija",
      noteSi:
        "Avgust je čas senažeti — in kmetija, ki je »s pesmijo do mraka« spravila svoje njive, je njen najboljši pripovedovalec.",
      noteEn:
        "August is haymaking time — and the farm that brought in its fields »with a song until dusk« is its best storyteller.",
    },
    {
      slug: "kopalisce-griblje",
      noteSi:
        "Vrh poletja še vedno pripada vodi: zadnji skoki v Kolpo, preden se sezona nagne proti jeseni.",
      noteEn:
        "The height of summer still belongs to the water: the last dives into the Kolpa before the season tips toward autumn.",
    },
    {
      slug: "madronicev-mlin",
      noteSi:
        "Mlin in žaga ob Kolpi na Prelesjem: avgustovska popoldneva so nekoč znala pot do mlina, ki še danes nosi ime družine.",
      noteEn:
        "The mill and saw on the Kolpa at Prelesje: August afternoons once knew the way to the mill that still carries the family's name.",
    },
  ],
  /* ----------------------------- SEPTEMBER ---------------------------- */
  [
    {
      slug: "kolpa-extremi",
      noteSi:
        "September je mesec velike vode: 17. septembra 2022 je Kolpa pri Metliki dosegla 1.009 m³/s — največjo vrednost, kar jih je postaja kdaj neposredno izmerila. Septembra 2025 je dodala še rekordno hitrost naraslanja.",
      noteEn:
        "September is the month of high water: on 17 September 2022 the Kolpa at Metlika reached 1,009 m³/s — the largest value the station has ever directly gauged. In September 2025 it added a record rate of rise.",
    },
    {
      slug: "praznik-ks-2024",
      noteSi:
        "15. septembra 2024 se je v gasilskem domu po desetletjih znova zasvetil praznik krajevne skupnosti — september je njegov mesec.",
      noteEn:
        "On 15 September 2024 the community festival shone again in the fire station after decades — September is its month.",
    },
    {
      slug: "vino-in-crnina",
      noteSi:
        "Trgatev na apnenčastih legah pride na vrsto: metliška črnina se rojeva v septembrskih goricah.",
      noteEn:
        "The harvest on the limestone slopes takes its turn: metliška črnina is born in the September vineyards.",
    },
    {
      slug: "vaska-sola",
      noteSi:
        "Prvi šolski dan: septembra se vaška šola, stara od leta 1869, znova napolni z glasovi.",
      noteEn:
        "The first day of school: in September the village school, dating from 1869, fills with voices again.",
    },
    {
      slug: "muzejska-ucilnica",
      noteSi:
        "Novo šolsko leto se začne tudi v muzejski učilnici — fizični sestri tega muzeja, ki je zrasla iz istih šolskih klopi.",
      noteEn:
        "A new school year begins in the museum classroom, too — the physical sister of this museum, grown from the same school benches.",
    },
    {
      slug: "obcina-griblje",
      noteSi:
        "September je mesec papirjev, ki so prenesli vas: 11. 9. 1933 komasacija razpusti občino Griblje, 21. 9. 1936 pa jo s Dragoši pošlje h Gradcu. Stoletje županovanja — mesec uprave.",
      noteEn:
        "September is the month of the papers that carried the village: on 11 Sept. 1933 the amalgamation dissolves the Municipality of Griblje; on 21 Sept. 1936 it sends it, with Dragoši, to Gradac. A century of self-rule — the month of administration.",
    },
  ],
  /* ------------------------------ OKTOBER ----------------------------- */
  [
    {
      slug: "spanska-gripa-1918",
      noteSi:
        "Oktobra 1918 je bil mesec z najvišjo smrtnostjo cele pandemije — podzemeljska mrliška knjiga je pisala »pljučnica (španka)«. Oktobra se muzej spominja jeseni, ko je strani zmanjkalo.",
      noteEn:
        "October 1918 was the whole pandemic's deadliest month — the Podzemelj death register wrote »pneumonia (Spanish)«. In October the museum remembers the autumn the pages ran out.",
    },
    {
      slug: "crni-moceril",
      noteSi:
        "18. oktobra 1986 je znanost v podzemlju Bele krajije spoznala črnega močerila. Oktobra ima zbirka rojstni dan.",
      noteEn:
        "On 18 October 1986 science met the black olm in the underground of Bela krajina. In October, the collection has a birthday.",
    },
    {
      slug: "kuhanje-zganja",
      noteSi:
        "Jesenski kmečki koledar diši po žganju: oktober je mesec kapljice, ki je vaške večere grela, preden so imele vasi elektriko.",
      noteEn:
        "The autumn farm calendar smells of brandy: October is the month of the drop that warmed village evenings before the villages had electricity.",
    },
    {
      slug: "pecnica-susenje-sadja",
      noteSi:
        "Pečnica za sušenje sadja je tovarna jesenskega dima — oktober zadiši po hruškah, ki so nekoč držale vas do pomladi.",
      noteEn:
        "The fruit-drying oven is a factory of autumn smoke — October smells of the pears that once carried a village through to spring.",
    },
    {
      slug: "ilirska-carina-1809",
      noteSi:
        "Oktobra 1809 je Dunajski mir dežele predal Francozom — in Griblje so dobile carinarnico ob Kolpi. Kratek imperij na jesen dežele.",
      noteEn:
        "In October 1809 the Peace of Schönbrunn handed these lands to the French — and Griblje received a customs post on the Kolpa. A short empire in the autumn of the land.",
    },
  ],
  /* ----------------------------- NOVEMBER ----------------------------- */
  [
    {
      slug: "mate-zupanic-svarski",
      noteSi:
        "Novembra 1885 se je v Gribljah rodil Mate Zupanič-Švarski; novembra 2025 mu je Radio Odeon vrnil ime. Mesec mrtvih je ravno pravi za prostovoljca, ki se ni vrnil.",
      noteEn:
        "In November 1885 Mate Zupanič-Švarski was born in Griblje; in November 2025 Radio Odeon gave him back his name. The month of the dead suits a volunteer who did not come home.",
    },
    {
      slug: "spomenik-padlim",
      noteSi:
        "November je mesec spomina: trinajst imen na spomeniku padlim vaščanom je najtišji zapis zbirke — in njen najglasnejši.",
      noteEn:
        "November is the month of remembrance: the thirteen names on the memorial to the village's fallen are the collection's quietest record — and its loudest.",
    },
    {
      slug: "vino-in-crnina",
      noteSi:
        "Od trgatev do Martinovega: november je mesec, ko mlado vino dobi krst in klet svoj pravi vonj.",
      noteEn:
        "From harvest to St. Martin's: November is the month when the new wine is christened and the cellar finds its true smell.",
    },
    {
      slug: "matice-podzemelj",
      noteSi:
        "Ob dnevu mrtvih vas začnejo zanimati imena s kamnov: matične knjige 1669–1947 so arhiv, kjer se vsako ime še enkrat zapiše.",
      noteEn:
        "Around the day of the dead, the names on the stones start asking questions: the parish registers of 1669–1947 are the archive where every name is written one more time.",
    },
    {
      slug: "novo-zivljenje-1914",
      noteSi:
        "5. novembra 1889 so blagoslovili gribeljsko šolo — predmet, okoli katerega je leta 1914 zrasla edina znana povest, ki se dogaja v vasi. November je mesec šolskih obletnic.",
      noteEn:
        "On 5 November 1889 the Griblje school was blessed — the subject around which, in 1914, grew the only known tale set in the village. November is the month of school anniversaries.",
    },
  ],
  /* ----------------------------- DECEMBER ----------------------------- */
  [
    {
      slug: "peter-kambic",
      noteSi:
        "December beremo po Kambiču: prvi učitelj gribeljske šole je zapisal božič Belokranjcev — najbolj notranji božični zapis zbirke.",
      noteEn:
        "In December we read by Kambič: the first teacher of the Griblje school wrote down the Christmas of the Bela krajina people — the collection's most inward Christmas record.",
    },
    {
      slug: "zvon-2008",
      noteSi:
        "Božična polnočnica se začne z zvonom — ta se je v cerkev sv. Vida vrnil leta 2008 in od takrat napoveduje praznike.",
      noteEn:
        "Midnight mass begins with a bell — this one returned to the church of St. Vitus in 2008 and has announced the feasts ever since.",
    },
    {
      slug: "sveti-vid",
      noteSi:
        "Polnočnica v cerkvi na hribu: decembra je vaška cerkev najbolj obljudena in najtoplejša hkrati.",
      noteEn:
        "Midnight mass in the church on the hill: in December the village church is at once the most crowded and the warmest place there is.",
    },
  ],
];

export type MonthlyPick = {
  exhibit: ExhibitDTO;
  entry: MonthlyEntry;
};

/**
 * Izbor zapisa meseca: nabor trenutnega meseca, izbor po (leto, mesec),
 * s padcem na naslednjega kandidata, če zapisa ni v podani zbirki.
 * Vrnjen objekt je enak za vse obiskovalce istega meseca.
 */
export function resolveRecordOfMonth(
  now: Date,
  exhibits: ExhibitDTO[]
): MonthlyPick | null {
  const month = now.getMonth();
  const entries = MONTHLY_POOLS[month] ?? [];
  if (entries.length === 0 || exhibits.length === 0) return null;

  const seed = hash32(now.getFullYear() * 100 + month + 1);
  const start = seed % entries.length;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[(start + i) % entries.length];
    const exhibit = exhibits.find((ex) => ex.slug === entry.slug);
    if (exhibit) return { exhibit, entry };
  }
  return null;
}
