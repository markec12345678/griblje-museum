/**
 * IZRAZOSLOVJE — slovar pojmov muzeja vasi Griblje.
 *
 * Vzorec: »Art terms« londonske galerije Tate — muzej ne razlaga samo
 * predmetov, ampak tudi besede, v katerih predmeti živijo. Vsak pojem
 * je vezan na zapise zbirke, iz katerih je povzet, in ostaja dvojezičen.
 */

export type GlossaryTerm = {
  slug: string;
  /** Iztočnica za slovensko abecedo (Č, Š, Ž za ustrezno mesto). */
  sortKey: string;
  termSi: string;
  termEn: string;
  definitionSi: string;
  definitionEn: string;
  /** Povezani zapisi zbirke. */
  related: string[];
};

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "crni-moceril",
    sortKey: "črni močeril",
    termSi: "črni močeril",
    termEn: "black olm",
    definitionSi:
      "Temna podvrsta človeške ribice (Proteus anguinus parkelj), ki živi v podzemnih vodah Bele krajine — odkrita je bila leta 1986 ob črpalnem preizkusu izvira Dobličica v Jelševniku, tri kilometre od Gribelj. Za razliko od bele sorodnice ima oči in temno kožo; ogroža jo onesnaževanje podzemlja.",
    definitionEn:
      "The dark subspecies of the olm (Proteus anguinus parkelj) living in the underground waters of Bela krajina — discovered in 1986 during a pumping test at the Dobličica spring in Jelševnik, three kilometres from Griblje. Unlike its white relative it has eyes and dark skin; groundwater pollution threatens it.",
    related: ["crni-moceril", "loke-in-studenci"],
  },
  {
    slug: "crnina",
    sortKey: "crnina",
    termSi: "crnina",
    termEn: "crnina (black wine)",
    definitionSi:
      "Belokranjsko vino iz belega grozdja, ki se grozdje pred stiskanjem pusti obarvati s pokožico — nastane temno, močno vino, po katerem je pokrajina dobila ime »dežela črnine«. V Gribljah so ga pridelovali na vaških parcelah v dolini proti Kolpi.",
    definitionEn:
      "The Bela krajina wine made from white grapes left to macerate on their skins before pressing — the result is a dark, strong wine that gave the region the name »the land of crnina«. In Griblje it was made on village plots in the valley towards the Kolpa.",
    related: ["vino-in-crnina"],
  },
  {
    slug: "jurjevanje",
    sortKey: "jurjevanje",
    termSi: "jurjevanje",
    termEn: "St George's Day customs",
    definitionSi:
      "Pomladni običaj na god sv. Jurija (24. april): zeleni Jurij obišče vas, blagoslovi polja in odpelje prvo pomlad. Iz običaja je zrasel Jurjevanje v Črnomlju — največji folklorni festival Bela krajine in med najstarejšimi v Sloveniji, kjer belokranjska noša še danes stopa iz omare.",
    definitionEn:
      "Spring custom on St George's Day (24 April): the green George visits the village, blesses the fields and leads in the first spring. From the custom grew the Jurjevanje festival in Črnomelj — the largest folklore festival of Bela krajina and among the oldest in Slovenia, where the Bela krajina costume still steps out of the wardrobe.",
    related: ["jurjevanje", "belokranjska-nosa"],
  },
  {
    slug: "kolonija",
    sortKey: "kolonija",
    termSi: "kolonija",
    termEn: "mining colony",
    definitionSi:
      "Rudarsko naselje ob premogovniku: vrstne hiše za rudarje in njihove družine, zgrajene ob jami. V Kanižarici pri Črnomlju je »Stara kolonija« še danes del vasi — spomin na čas, ko so se ob rudniku naselile družine z vse Bele krajine.",
    definitionEn:
      "A mining settlement by the coal mine: rows of houses for the miners and their families, built next to the pit. In Kanižarica near Črnomelj the »Old Colony« is still part of the village — a memory of the time when families from all over Bela krajina settled around the mine.",
    related: ["kanizarica"],
  },
  {
    slug: "kres",
    sortKey: "kres",
    termSi: "kres",
    termEn: "bonfire",
    definitionSi:
      "Kresovanje: ogenj na predpustno soboto, ki pomladi preganja zimo in zlo. Mladina je kres pripravljala tedne — les, ježove odeje, vžig ob mraku, krog plesa okrog plamenov. V Gribljah je kres gorel na griču nad vasjo.",
    definitionEn:
      "The bonfire night: fire on the Saturday before Lent that drives out winter and evil. The young prepared it for weeks — wood, thorn blankets, the lighting at dusk, a ring of dance around the flames. In Griblje the bonfire burned on the hill above the village.",
    related: ["kresovanje"],
  },
  {
    slug: "lokva",
    sortKey: "lokva",
    termSi: "lokva",
    termEn: "karst pond",
    definitionSi:
      "Kraška lokva: plitva kotanja brez odtoka, ki se napolni z deževnico in spomladi cveti, poleti presahne. Na zgornjem koncu Gribelj stoji Goranja lokva — kraj, kjer so vaščani kopali glino za poslikavo in pomivali perilo, dokler ni prišla voda v pipe.",
    definitionEn:
      "A karst pond: a shallow basin without outflow that fills with rainwater, blooms in spring and dries in summer. At the upper end of Griblje stands Goranja lokva — the place where villagers dug clay for painting and washed laundry until water reached the taps.",
    related: ["goranja-lokva", "loke-in-studenci"],
  },
  {
    slug: "malenca",
    sortKey: "malenca",
    termSi: "malenca",
    termEn: "malenca (washing paddle)",
    definitionSi:
      "Lesena loparica z izdolbeno notranjostjo, s katero so ob reki prali in »klofali« perilo — udarec po mokri tkanini je iztisnil umazanijo. Ob Kolpi je bil zvok malence del jutranje rutine, pranje v skupinskih »copavkah« pa tudi vaški klepet.",
    definitionEn:
      "A wooden paddle with a hollowed face used to wash and »slap« laundry by the river — the stroke on wet cloth squeezed out the dirt. By the Kolpa the sound of the malenca was part of the morning routine, and washing in the shared shallows was also the village's talk.",
    related: ["malenca", "kolpa-reka"],
  },
  {
    slug: "opanke",
    sortKey: "opanke",
    termSi: "opanke",
    termEn: "opanke (leather sandals)",
    definitionSi:
      "Usnjene copate s prepletenimi trakovi, obutev moške belokranjske noše. Nosile so jih tudi ženske ob delu; poleti so moški pogosto hodili bosi in so si opanke obuli le za praznike in v cerkev.",
    definitionEn:
      "Leather sandals with interwoven straps, the footwear of the men's Bela krajina costume. Women wore them at work too; in summer men often walked barefoot and put their opanke on only for feasts and church.",
    related: ["belokranjska-nosa"],
  },
  {
    slug: "peca",
    sortKey: "peča",
    termSi: "peča",
    termEn: "peča (white headcloth)",
    definitionSi:
      "Bela ruta iz lanenega blaga z vezenino ali čipkasto obrobo — glavno pokrivalo belokranjske ženske noše, vezano zadaj; pozimi prekrižano pod brado, praznična pa na čelu tvori rožo, ki se razlikuje od kraja do kraja. Prvo znanstveno študijo o peči je leta 1928 napisal etnograf Stanko Vurnik.",
    definitionEn:
      "A white linen cloth with embroidery or a lace border — the principal head covering of the Bela krajina women's costume, tied at the back; in winter crossed under the chin, while the festive one forms a flower on the forehead that differs from place to place. The first scholarly study of the peča was written by the ethnographer Stanko Vurnik in 1928.",
    related: ["belokranjska-nosa", "jurjevanje"],
  },
  {
    slug: "pecene-slive",
    sortKey: "pečene slive",
    termSi: "pečene slive",
    termEn: "baked plums (dried fruit)",
    definitionSi:
      "Sušene slive iz pečnice za sušenje sadja: košara sadja se je ob nizkem ognju, dan za dnem, spremenila v polico temnih prstov — zimsko valuto vasi. Otroški prigrizek, priloga koruzi in fižolu, darilo po hlevih in svatbah.",
    definitionEn:
      "Dried plums from the fruit-drying oven: a basket of fruit, over a low fire day after day, became a shelf of dark fingers — the winter currency of the village. A child's treat, a companion to maize and beans, a gift shared around the yards and at weddings.",
    related: ["pecnica-susenje-sadja", "belokranjska-kuhinja"],
  },
  {
    slug: "perkmandeljc",
    sortKey: "perkmandeljc",
    termSi: "Perkmandeljc",
    termEn: "Perkmandelc (mine dwarf)",
    definitionSi:
      "Rudniški škrat iz ljudskega izročila rudarjev na Kanižarici: kali v jašku, opozarja na nevarnost — in ukanja tiste, ki se v rovu ne vedejo pošteno. V muzeju rudnika Kanižarica ga lahko obiskovalec danes sreča v umetnem rudniškem rovu.",
    definitionEn:
      "The mine dwarf of the Kanižarica miners' folklore: he lives in the shaft, warns of danger — and plays tricks on those who do not behave honestly underground. In the Kanižarica mine museum visitors can meet him today in the artificial mine tunnel.",
    related: ["kanizarica"],
  },
  {
    slug: "pisanice",
    sortKey: "pisanice",
    termSi: "pisanice",
    termEn: "pisanice (painted eggs)",
    definitionSi:
      "Belokranjske pirhi: jajca, pisana z voskom in barvami v geometrijske vzorce — trikotniki, cik-cak, rožice. Pomlad so vnesla v vsako hišo; pisanica je bila tudi ljubezenski dar, ki je znal povedati več kot beseda.",
    definitionEn:
      "The Bela krajina Easter eggs: eggs painted with wax and dyes in geometric patterns — triangles, zigzags, little roses. They carried spring into every house; a pisanica was also a gift of love that could say more than a word.",
    related: ["pisanice"],
  },
  {
    slug: "tambura",
    sortKey: "tambura",
    termSi: "tambura",
    termEn: "tambura",
    definitionSi:
      "Godalo z vratom in metalnimi strunami, ki je v Belo krajino prišla z uskoškim in panonskim valom in postala glas vasi. Tamburaši so igrali po svatbah, sejmih in veselicah — v Gribljah deluje tamburaška skupina Danica.",
    definitionEn:
      "A stringed instrument with a neck and metal strings that reached Bela krajina with the Uskok and Pannonian wave and became the voice of the village. Tambura players performed at weddings, fairs and village dances — in Griblje the tambura group Danica keeps the tradition.",
    related: ["tamburasi-danica"],
  },
  {
    slug: "urbar",
    sortKey: "urbar",
    termSi: "urbar",
    termEn: "urbarium",
    definitionSi:
      "Srednjeveški register, v katerem je gospod zapisal, kaj mu kmet dolguje: dajatve v žitu, denarju, delu. V urbarjih stoji tudi najstarejša imena vasi — Griblach (1468), Briglach (1490), Griblah (1593) — kar pomeni, da je vas na papir prišla kot davčni dogodek.",
    definitionEn:
      "The medieval register in which the lord wrote down what the peasant owed him: dues in grain, money, labour. The oldest names of the village stand in the urbaria — Griblach (1468), Briglach (1490), Griblah (1593) — meaning the village reached paper as a taxable event.",
    related: ["stari-zemljevidi", "valvasor-1689"],
  },
  {
    slug: "uskoki",
    sortKey: "uskoki",
    termSi: "Uskoki",
    termEn: "Uskoks",
    definitionSi:
      "Begunci pred osmanskimi vpadi, večinoma pravoslavni Vlasi in Srbi, ki jih je Habsburška monarhija v 16. stoletju naselila ob turški meji — v Beli krajini so dobili zemljo v zameno za vojaško službo v Vojni krajini. Njihovi potomci so del današnjih Srbov belokranjskih vasi.",
    definitionEn:
      "Refugees from the Ottoman incursions, mostly Orthodox Vlachs and Serbs, whom the Habsburg monarchy settled along the Turkish border in the 16th century — in Bela krajina they received land in exchange for military service in the Military Frontier. Their descendants are part of today's Serbs of the Bela krajina villages.",
    related: ["uskoki-in-vojna-krajina", "ljudje-ob-kolpi"],
  },
  {
    slug: "vojna-krajina",
    sortKey: "vojna krajina",
    termSi: "Vojna krajina",
    termEn: "Military Frontier",
    definitionSi:
      "Vojaško-mejni pas habsburške države ob Osmanskem cesarstvu, v katerem vojščaki-kmetje niso plačevali davkov, ampak so državi dolgovali stražo in boj. Bele krajine je bila del Vojne krajine od 16. do 18. stoletja — iz tega časa izhaja vaška podoba Pokolpja.",
    definitionEn:
      "The military border belt of the Habsburg state along the Ottoman Empire, in which soldier-farmers paid no taxes but owed the state watch and battle. Bela krajina was part of the Military Frontier from the 16th to the 18th century — the village image of the Kolpa valley grows out of that time.",
    related: ["uskoki-in-vojna-krajina"],
  },
  {
    slug: "vindijska-krajina",
    sortKey: "vindijska krajina",
    termSi: "Vindijska krajina",
    termEn: "Windic March",
    definitionSi:
      "Srednjeveško-latinsko ime za Belo krajino (Marchia Windorum, »dežela Vindov, Slovanov«), ki ga nosijo stari listine in zemljevidi — vključno z Homannovo karto vojvodine Kranjske iz leta 1714, izdelano po Valvasorjevem gradivu, na kateri je narisana tudi ta dežela ob Kolpi.",
    definitionEn:
      "The medieval Latin name for Bela krajina (Marchia Windorum, »the land of the Wends, the Slavs«) carried by old charters and maps — including Homann's 1714 map of the Duchy of Carniola, made from Valvasor's material, on which this land by the Kolpa is drawn.",
    related: ["stari-zemljevidi", "valvasor-1689"],
  },
  {
    slug: "zracni-most",
    sortKey: "zračni most",
    termSi: "zračni most",
    termEn: "air bridge",
    definitionSi:
      "Operacija zaveznikov leta 1944: s partizanskih letališč v Beli krajini — najpomembnejšega na Otoku pri Vinici — so evakuirali sestreljene zavezniške pilote in ranjence. Z letališča Picadilly Hope na Otoku je odletelo čez 800 letal; poimenovana je bila po prvem letalu, ki je vzletelo s poljane.",
    definitionEn:
      "The Allies' operation of 1944: from partisan airfields in Bela krajina — the most important at Otok near Vinica — downed Allied airmen and the wounded were evacuated. Over 800 aircraft took off from the Picadilly Hope airfield at Otok; it was named after the first plane to leave the field.",
    related: ["zracni-most-krasinec", "letalisce-otok-1944"],
  },
];

/** Slovenska abecedna razvrstitev (Č, Š, Ž za ustreznimi črkami). */
export const GLOSSARY_LETTERS = ["C", "Č", "J", "K", "L", "M", "O", "P", "S", "Š", "T", "U", "V", "Z", "Ž"];

export function letterOf(term: GlossaryTerm): string {
  const key = term.sortKey.toUpperCase();
  for (const letter of GLOSSARY_LETTERS) {
    if (key.startsWith(letter)) return letter;
  }
  return key[0] ?? "?";
}

export const glossaryByLetter = glossaryTerms
  .slice()
  .sort((a, b) => a.sortKey.localeCompare(b.sortKey, "sl"))
  .reduce<Map<string, GlossaryTerm[]>>((map, term) => {
    const letter = letterOf(term);
    const list = map.get(letter) ?? [];
    list.push(term);
    map.set(letter, list);
    return map;
  }, new Map());
