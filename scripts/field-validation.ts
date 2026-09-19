/**
 * FIELD VALIDATION / CURATORIAL QUALITY AUDIT — REAL QUESTION SET.
 *
 * TA SKRIPT NI DEL OBICAJNIH TESTOV — porablja API kvoto (pravi model
 * prek PRODUKCIJSKE verige OpenRouter → HuggingFace → z-ai SDK, enako
 * kot scripts/test-curator-real-model.ts). Zagon SAMO IZRECNO:
 *
 *     bun scripts/field-validation.ts --real [--from=N] [--to=N]
 *
 * Namen faze (naročilo): ugotoviti, kako se obstoječi digitalni muzej
 * obnese pri REALNIH vprašanjih obiskovalca, učenca, domačina in
 * raziskovalca. Vprašanja NISO generirana iz testov — ročno so
 * sestavljena po registru entitet, zapiseh in virih (A obiskovalec,
 * B lokalna zgodovina, C osebe, D kraji, E dogodki in čas, F viri,
 * G česa ne vemo, H napačne predpostavke, I večjezičnost, J izven
 * korpusa). Med njimi so lahka, dvoumna, kratka, dolga, napačno
 * zapisana, sklanjane oblike, vprašanja z letnicami in približnimi
 * datumi, vprašanja z odgovorom v evidenci in brez nje.
 *
 * Vsak primer gre skozi ISTO produkcisko pot (askCurator → retrieval
 * → pravi provider → verifyAnswer) in izpiše audit zapis:
 *
 *   question / language / retrieved_records / retrieved_entities /
 *   retrieved_sources / answer / citations / uncertainty /
 *   expected_evidence / curatorial_judgment / status / notes
 *
 * Status: PASS / REVIEW / FAIL / OUT_OF_CORPUS / INFRASTRUCTURE.
 * Ne uporabljamo numeričnega "AI score" in ne lestvice kakovosti
 * modelov — samo kuratorska presoja dokazljivih lastnosti.
 *
 * INFRASTRUCTURE ločimo od modelskega FAIL-a (429/kvota/omrežje NI
 * napaka modela). Rezultat: scripts/red-team-artifacts/field-validation-<čas>.json
 * (AUDIT ARTEFAKT, ni muzejska vsebina).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { askCurator } from "../src/lib/curator";
import {
  museumAIProvider,
  extractFullDates,
  extractYears,
  attestedYearsOf,
} from "../src/lib/curator-provider";
import { buildContext, contextHasEvidence } from "../src/lib/curator-retrieval";
import type {
  AIContext,
  CuratorLang,
  CuratorResult,
  MuseumAIProvider,
} from "../src/lib/curator-types";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Nadaljevalni argumenti: --from=N / --to=N (oblivanje 429 omejitev). */
const fromArg = process.argv.find((a) => a.startsWith("--from="));
const toArg = process.argv.find((a) => a.startsWith("--to="));
const FROM = fromArg ? Math.max(1, Number(fromArg.slice(7)) || 1) : 1;
const TO = toArg ? Math.max(1, Number(toArg.slice(5)) || 999) : 999;

// --- zavorna varovalka: brez --real se skript ne približa kvoti -----------
if (!process.argv.includes("--real")) {
  console.log("FIELD VALIDATION se NE izvaja: podaj --real (porabi API kvoto).");
  console.log("  zagon: bun scripts/field-validation.ts --real");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Nabor vprašanj (100 primerov, kategorije A–J, 5 jezikov)
// ---------------------------------------------------------------------------

type FieldCategory = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

type Expect = {
  /** Čisto izven-korpusno vprašanje — pričakovana 0 klicev modela. */
  zeroCalls?: boolean;
  /** Zapisi, ki BI MORALI biti razrešljivi iz registra (kuratorska pričakovanja). */
  anyOfSlugs?: string[];
  /** Poštena zavrnitev je sprejemljiv (ali pričakovan) izid. */
  refusalLikely?: boolean;
  /** Trditve, ki jih odgovor NE SME podati kot dejstvo (napačne predpostavke). */
  mustNotState?: { re: string; why: string }[];
  /** Negotovost, ki mora preživeti (približni datum/interval/letnica). */
  keepApprox?: { re: string; why: string };
  /** §9A: dokaz podpira A, trditev B — namerni test arhitekturne meje. */
  entailmentProbe?: boolean;
  /** §9B: identiteta/odnos — ne sme se sklepati, če ni eksplicitno dokazan. */
  identityProbe?: string;
};

type FieldCase = {
  id: number;
  category: FieldCategory;
  lang: CuratorLang;
  question: string;
  /** Kuratorska presoja: kakšen je DOBER muzejski odgovor na to vprašanje. */
  judgment: string;
  expect: Expect;
};

const CASES: FieldCase[] = [
  // --- A — OBISKOVALEC (10) ------------------------------------------------
  { id: 1, category: "A", lang: "sl", question: "Kaj je vaška šola in čemu je služila?",
    judgment: "Zapis MVG-026: vaška šola 1889, pot iz tablic v svet; razumljiv odgovor s citatom.",
    expect: { anyOfSlugs: ["vaska-sola"] } },
  { id: 2, category: "A", lang: "sl", question: "Čemu je služil Madroničev mlin?",
    judgment: "MVG-045: mlin in žaga ob Kolpi — mletje žita, žaganje; viri zapisa.",
    expect: { anyOfSlugs: ["madronicev-mlin"] } },
  { id: 3, category: "A", lang: "sl", question: "Kje so uporabljali pečnico za sušenje sadja?",
    judgment: "MVG-076/017: sušenje sadja v belokranjski hiši; tovarna jesenskega dima.",
    expect: { anyOfSlugs: ["pecnica-susenje-sadja", "belokranjska-hisa"] } },
  { id: 4, category: "A", lang: "sl", question: "Kako star je zvon iz leta 2008?",
    judgment: "MVG-048: blagoslov 2008; starost izračunana iz dokazane letnice 2008.",
    expect: { anyOfSlugs: ["zvon-2008"] } },
  { id: 5, category: "A", lang: "sl", question: "Zakaj je pomemben zapis o zračnem mostu?",
    judgment: "MVG-056: 2041 ljudi v 48 urah konec marca 1945; eden ključnih vojnih zapisov.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 6, category: "A", lang: "sl", question: "Kaj je zanimivega pri pasuljadi?",
    judgment: "MVG-041: dan, ko ob Kolpi zadiši po pasulju (~2004); skupnostni dogodek.",
    expect: { anyOfSlugs: ["pasuljada"] } },
  { id: 7, category: "A", lang: "sl", question: "S čim je povezano Jurjevanje?",
    judgment: "MVG-019/084: pomladni običaji, Zeleni Jurij; povezava z belokranjsko tradicijo.",
    expect: { anyOfSlugs: ["jurjevanje", "jurjevo-v-gribljah"] } },
  { id: 8, category: "A", lang: "sl", question: "Kaj je bila panjska končnica?",
    judgment: "MVG-062: galerija pod streho čebelnjaka; pobarbana čela panjev.",
    expect: { anyOfSlugs: ["panjska-koncnica"] } },
  { id: 9, category: "A", lang: "en", question: "What is the village school exhibit about?",
    judgment: "EN odgovor (jezik vprašanja): the village school record, 1889, from slates to the world.",
    expect: { anyOfSlugs: ["vaska-sola"] } },
  { id: 10, category: "A", lang: "de", question: "Was war die Luftbrücke von Krasinec?",
    judgment: "DE odgovor: Ende März 1945, 2041 Menschen in 48 Stunden; približnost dneva ohranjena.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], keepApprox: { re: "Ende März|konec marca|48", why: "dan zračnega mostu ni zapisan točno — konec marca" } } },

  // --- B — LOKALNA ZGODOVINA (10) ------------------------------------------
  { id: 11, category: "B", lang: "sl", question: "Kaj se je dogajalo v Gribljah med drugo svetovno vojno?",
    judgment: "Zaseda 1941, letališče Otok 1944, evakuacija marec 1945 — po zapisih s citati.",
    expect: { anyOfSlugs: ["zaseda-1941", "evakuacija-1945", "letalisce-otok-1944"] } },
  { id: 12, category: "B", lang: "sl", question: "Kaj vemo o Kolpi?",
    judgment: "MVG-006/007/008: reka, življenje ob njej, ekstremi (suša in poplave).",
    expect: { anyOfSlugs: ["kolpa-reka", "kolpa-extremi", "malenca"] } },
  { id: 13, category: "B", lang: "sl", question: "Kako se je vas razvijala skozi zgodovino?",
    judgment: "Široko vprašanje — pošten delni odgovor (prva omemba, občina 1854–1933) ali zavrnitev s predlogi; brez izmišljanja.",
    expect: { anyOfSlugs: ["griblje-vas", "obcina-griblje"], refusalLikely: true } },
  { id: 14, category: "B", lang: "sl", question: "Katere pomembne osebe so povezane z Gribljami?",
    judgment: "Seznam oseb iz evidence (Županič, Barleti, Totterji …) s citati; sme biti delni.",
    expect: { refusalLikely: true } },
  { id: 15, category: "B", lang: "sl", question: "Kateri dogodki so povezani s Krasincem?",
    judgment: "Zračni most Krasinec (konec marca 1945); pošteno po zapisih.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 16, category: "B", lang: "sl", question: "Kaj se je zgodilo leta 1945?",
    judgment: "Marec 1945: evakuacija, zračni most; konec marca ostane konec marca.",
    expect: { anyOfSlugs: ["evakuacija-1945", "zracni-most-krasinec"], keepApprox: { re: "konec marca|48|25", why: "zapis MVG-056 nosi 25.–26. marca, MVG-014 konec marca — ohrani kot je zapisano" } } },
  { id: 17, category: "B", lang: "en", question: "What happened in Griblje during the war?",
    judgment: "EN odgovor: ambush 1941, airfield, evacuation March 1945 — po zapisih.",
    expect: { anyOfSlugs: ["zaseda-1941", "evakuacija-1945"] } },
  { id: 18, category: "B", lang: "hr", question: "Što znamo o Kolpi?",
    judgment: "HR odgovor nad slovensko vsebinsko plastjo: rijeka Kolpa, život uz nju.",
    expect: { anyOfSlugs: ["kolpa-reka", "kolpa-extremi"] } },
  { id: 19, category: "B", lang: "sl", question: "Kaj pomeni ime Griblje?",
    judgment: "MVG-068: Gribljati — ime vasi je brazda; etimologija po zapisu.",
    expect: { anyOfSlugs: ["etimologija-gribljati"] } },
  { id: 20, category: "B", lang: "sl", question: "Kakšna je bila meja ob Kolpi leta 1991?",
    judgment: "MVG-015: meja 1991, osamosvojitev; državna meja ob Kolpi.",
    expect: { anyOfSlugs: ["meja-1991"] } },

  // --- C — OSEBE (10) -------------------------------------------------------
  { id: 21, category: "C", lang: "sl", question: "Kdo je bil Konrad Barle?",
    judgment: "MVG-059: učitelj v Metliki, AŽ-panj, rojen 19. 2. 1875; lastna entiteta, ločeno od Janka/Šivana.",
    expect: { anyOfSlugs: ["konrad-barle"] } },
  { id: 22, category: "C", lang: "sl", question: "Kdo je bil Janko Barle?",
    judgment: "MVG-058: zapisovalec Bele krajine (šege, pesmi); lastna entiteta 1869–1941.",
    expect: { anyOfSlugs: ["janko-barle"] } },
  { id: 23, category: "C", lang: "sl", question: "Kdo je bil Ivan Barle?",
    judgment: "Entiteta person:ivan-barle (1841–1930): podzemeljski učitelj; TRIJE Barleti se ne smejo spojiti.",
    expect: { anyOfSlugs: ["konrad-barle", "kucar-podzemelj", "kranjska-sivka"], identityProbe: "Ivan Barle je lasten vnos — ne sme se spojiti s Konradom/Jankom." } },
  { id: 24, category: "C", lang: "sl", question: "Kaj vemo o Audrey Totter?",
    judgment: "MVG-033: hollywoodska igralka iz veje Gornjih Gribelj (Joliet, Illinois); 20. 12. 1917.",
    expect: { anyOfSlugs: ["audrey-totter"] } },
  { id: 25, category: "C", lang: "sl", question: "Kaj vemo o Petru Madroniču?",
    judgment: "DVE osebi (P0-E1): mlinar (r. 1901) in pravnuk-pričevalec poplav; NIKOLI spojena, opomba o odprtosti.",
    expect: { anyOfSlugs: ["madronicev-mlin", "kolpa-extremi"], identityProbe: "Dva Petra Madroniča (P0-E1) — odprto, po zapisih." } },
  { id: 26, category: "C", lang: "en", question: "Who was Niko Županič?",
    judgment: "EN odgovor: MVG-010, cosmopolitan from Griblje; 1. 12. 1876–1961.",
    expect: { anyOfSlugs: ["niko-zupanic"] } },
  { id: 27, category: "C", lang: "sl", question: "Kdo je bil Janez Vajkard Valvasor in kaj ima z Gribljami?",
    judgment: "MVG-075: Slava vojvodine Kranjske 1689, vključno s Griblach/Gribljami.",
    expect: { anyOfSlugs: ["valvasor-1689"] } },
  { id: 28, category: "C", lang: "sl", question: "Kaj vemo o Mate Zupanič-Švarskem?",
    judgment: "MVG-085: prostovolec, ki se ni vrnil (1885–1917); ločen od Nikota/Katarine.",
    expect: { anyOfSlugs: ["mate-zupanic-svarski"], identityProbe: "TRIJE Zupaniči — ne sme se spojiti." } },
  { id: 29, category: "C", lang: "sl", question: "Kdo je bil Jože Dular?",
    judgment: "MVG-063: trideset let Belokranjskega muzeja (1915–2000); ločen od Janeza Dularja.",
    expect: { anyOfSlugs: ["joze-dular"], identityProbe: "Jože ≠ Janez Dular." } },
  { id: 30, category: "C", lang: "sl", question: "Kaj vemo o Toni Gašperiču?",
    judgment: "MVG-044: humor z bregov Kolpe.",
    expect: { anyOfSlugs: ["toni-gasperic"] } },

  // --- D — KRAJI (10) -------------------------------------------------------
  { id: 31, category: "D", lang: "sl", question: "Kaj vemo o Gribljah?",
    judgment: "MVG-001: vas ob Kolpi; osnovni zapis zbirke.",
    expect: { anyOfSlugs: ["griblje-vas"] } },
  { id: 32, category: "D", lang: "sl", question: "Kaj je Kolpa?",
    judgment: "MVG-006: reka, življenje ob reki.",
    expect: { anyOfSlugs: ["kolpa-reka"] } },
  { id: 33, category: "D", lang: "sl", question: "Kaj vemo o Krasincu?",
    judgment: "Zračni most Krasinec (konec marca 1945); kraj prek zapisa MVG-056.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 34, category: "D", lang: "sl", question: "Kaj vemo o Otoku?",
    judgment: "Partizansko letališče Otok (MVG-013) in Dakota (MVG-054); Otok ≠ Krasinec.",
    expect: { anyOfSlugs: ["letalisce-otok-1944", "dakota-otok"] } },
  { id: 35, category: "D", lang: "sl", question: "Kaj vemo o Dragoših?",
    judgment: "Kraj Dragoši (zaselki) in Nikolaj Dragoš (oseba, MVG-034) — KRAJ ≠ OSEBA, ne sme se zamenjati.",
    expect: { anyOfSlugs: ["nikolaj-dragos"], identityProbe: "Dragoši (kraj) ≠ Nikolaj Dragoš (oseba)." } },
  { id: 36, category: "D", lang: "sl", question: "Kaj je Šokčev dvor?",
    judgment: "MVG-005: Šokčev dvor v Žuničih.",
    expect: { anyOfSlugs: ["sokcev-dvor"] } },
  { id: 37, category: "D", lang: "sl", question: "Kaj vemo o Podzemlju?",
    judgment: "Matične knjige Podzemelj (MVG-037) in Kučar (MVG-060); župrija, v kateri so se pisale Griblje.",
    expect: { anyOfSlugs: ["matice-podzemelj", "kucar-podzemelj"] } },
  { id: 38, category: "D", lang: "en", question: "What do we know about Črnomelj?",
    judgment: "EN odgovor: SNOS February 1944 (MVG-012) — first Slovenian parliament.",
    expect: { anyOfSlugs: ["snos-crnomelj-1944"] } },
  { id: 39, category: "D", lang: "it", question: "Cosa sappiamo sul fiume Kolpa?",
    judgment: "IT odgovor: il fiume Kolpa, la vita lungo il fiume (MVG-006).",
    expect: { anyOfSlugs: ["kolpa-reka"] } },
  { id: 40, category: "D", lang: "sl", question: "Kaj je Malenca?",
    judgment: "MVG-007: Malenca na Kolpi.",
    expect: { anyOfSlugs: ["malenca"] } },

  // --- E — DOGODKI IN ČAS (10) ----------------------------------------------
  { id: 41, category: "E", lang: "sl", question: "Kdaj natančno se je zgodila zaseda na cesti Črnomelj–Griblje?",
    judgment: "TOČEN datum: 6. september 1941 (MVG-028) — tukaj natančnost JE dokumentirana.",
    expect: { anyOfSlugs: ["zaseda-1941"] } },
  { id: 42, category: "E", lang: "sl", question: "Kdaj je bil zračni most?",
    judgment: "KONEC MARCA 1945 (48 ur) — približnost dneva mora preživeti; ne sme postati 25. 3. kot edina resnica (25.–26. 3. ima MVG-056 lastno poročilo).",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], keepApprox: { re: "konec marca|48|25", why: "konec marca 1945 (48 ur) ostane kot je zapisano" } } },
  { id: 43, category: "E", lang: "sl", question: "Kdaj je nastalo Cerkvišče?",
    judgment: "OKROG LETA 1408 (~1408) — približna letnica mora nositi oznako približnosti.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "okrog|približno|okoli|~|≈|ne moremo|ni zapisan", why: "~1408 je približna letnica" } } },
  { id: 44, category: "E", lang: "sl", question: "Kdaj je bil rojen Tone Kralj?",
    judgment: "Rojstno leto NI zapisano (~1928, 98 let januarja 2026) — približnost ali poštena zavrnitev.",
    expect: { anyOfSlugs: ["tone-kralj-98"], keepApprox: { re: "približno|okoli|~|≈|ni zapisan|ni dokumentiran", why: "rojstno leto ni zapisano" }, refusalLikely: true } },
  { id: 45, category: "E", lang: "sl", question: "Kdaj se je začel izseljenski val v Ameriko?",
    judgment: "INTERVAL 1880 → 1914 (MVG-011) — interval ne sme biti stisnjen v eno letnino.",
    expect: { anyOfSlugs: ["izseljenstvo"], keepApprox: { re: "1880|1914", why: "interval 1880–1914, ne ena letnica" } } },
  { id: 46, category: "E", lang: "sl", question: "Kdaj so vrnili glavni zvon?",
    judgment: "Vrnitev glavnega zvona 1998 (dogodek registra); 2008 je blagoslov NOVEGA zvona — ločiti.",
    expect: { anyOfSlugs: ["zvon-2008"] } },
  { id: 47, category: "E", lang: "de", question: "Was geschah am 6. September 1941?",
    judgment: "DE odgovor: Überfall/der Hinterhalt 6. 9. 1941 — točen datum je dokumentiran.",
    expect: { anyOfSlugs: ["zaseda-1941"] } },
  { id: 48, category: "E", lang: "it", question: "Cosa è successo intorno al 1408?",
    judgment: "IT čisto letnično vprašanje BREZ muzejske besede — letno sidro (TASK 42.1) pošteno zavrne (varneje zavrniti kot pokazati navidezno relevanten zapis); SL različica deluje. Dokumentiraj kot vedenje sistema.",
    expect: { anyOfSlugs: ["cerkvisce"], refusalLikely: true } },
  { id: 49, category: "E", lang: "sl", question: "Kdaj je bila ustanovljena občina Griblje in kdaj je bila ukinjena?",
    judgment: "Ustanovitev 1854; ukitev 1933 (komasacija; 1936 priključitev Gradcu) — MVG-031.",
    expect: { anyOfSlugs: ["obcina-griblje"] } },
  { id: 50, category: "E", lang: "en", question: "When did the Allied airlift over Krasinec take place?",
    judgment: "EN odgovor: late March 1945, 48 hours — približnost dneva v EN.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], keepApprox: { re: "late March|48|25", why: "late March 1945 (48 hours)" } } },

  // --- F — VIRI / KAKO VEMO (10) --------------------------------------------
  { id: 51, category: "F", lang: "sl", question: "Kako vemo, da se je zaseda res zgodila 6. septembra 1941?",
    judgment: "Viri MVG-028: Kamra (spominsko obeležje), Wikipedija; struktura KAKO VEMO z viri.",
    expect: { anyOfSlugs: ["zaseda-1941"] } },
  { id: 52, category: "F", lang: "sl", question: "Kateri viri potrjujejo zapis o zračnem mostu?",
    judgment: "Viri MVG-056: RTV Slo, Wikimedia Commons (Veselko), Wikipedija (Alma Karlin).",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 53, category: "F", lang: "sl", question: "Od kod izhaja podatek o 2041 ljudeh?",
    judgment: "Število 2041 iz zapisa MVG-056 in njegovih virov — odgovor pošteno navede vir.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 54, category: "F", lang: "sl", question: "Kaj je primarni vir za zgodovino cerkve sv. Vida?",
    judgment: "MVG-002/003: viri o cerkvi; spominska knjiga SV. VID GRIBLJE je redki tiskani vir iz vasi.",
    expect: { anyOfSlugs: ["sveti-vid", "petstoletnica-2026"] } },
  { id: 55, category: "F", lang: "sl", question: "Katere muzejske evidence imamo o španski gripi?",
    judgment: "MVG-039: podzemeljska matična knjiga (oktober–december 1918).",
    expect: { anyOfSlugs: ["spanska-gripa-1918"] } },
  { id: 56, category: "F", lang: "en", question: "Which sources support the exhibit about the 1941 ambush?",
    judgment: "EN odgovor: Kamra digital collections, Wikipedia — viri MVG-028.",
    expect: { anyOfSlugs: ["zaseda-1941"] } },
  { id: 57, category: "F", lang: "sl", question: "Kaj pravi Kamra o Gribljah?",
    judgment: "Kamra je registriran vir (zaseda, spominska obeležja); odgovor sme navesti LE registrirane vrstice.",
    expect: { refusalLikely: true } },
  { id: 58, category: "F", lang: "sl", question: "Kdo je prispeval fotografije reševanja ob Kolpi?",
    judgment: "MVG-055: Franjo Veselko — oko, ki je videlo reševanje (1905–1977).",
    expect: { anyOfSlugs: ["veselko-fotograf"] } },
  { id: 59, category: "F", lang: "sl", question: "Kaj je v matičnih knjigah Podzemelj?",
    judgment: "MVG-037/038: rodbine Gribelj 1669–1947; poročna knjiga 1669.",
    expect: { anyOfSlugs: ["matice-podzemelj", "porocna-1669"] } },
  { id: 60, category: "F", lang: "sl", question: "Kako vemo, koliko let ima cerkev sv. Vida?",
    judgment: "MVG-003: petsto let 2026 — jubilej iz zapisa; viri.",
    expect: { anyOfSlugs: ["petstoletnica-2026", "sveti-vid"] } },

  // --- G — ČESA NE VEMO (10) --------------------------------------------------
  { id: 61, category: "G", lang: "sl", question: "Ali vemo, kdo je izdelal zvon iz leta 2008?",
    judgment: "Izdelovalec zvona ni v povzetku evidence — poštena zavrnitev ali delni odgovor BREZ imena izdelovalca.",
    expect: { anyOfSlugs: ["zvon-2008"], refusalLikely: true } },
  { id: 62, category: "G", lang: "sl", question: "Ali vemo točen datum ustanovitve vasi Griblje?",
    judgment: "Ustanovitev NI dokumentirana (prva omemba 1468, če je v kontekstu) — zavrnitev/delni, brez izmišljenega datuma.",
    expect: { refusalLikely: true } },
  { id: 63, category: "G", lang: "sl", question: "Ali vemo, kdo je bil lastnik Šokčevega dvora?",
    judgment: "Lastnik ni v povzetku — pošteno; ne sme se izmisliti imena.",
    expect: { anyOfSlugs: ["sokcev-dvor"], refusalLikely: true } },
  { id: 64, category: "G", lang: "sl", question: "Ali vemo, kdo je na fotografijah v zapisu o kavbojskem žuru?",
    judgment: "Osebe s fotografij — po evidenci; če ni, poštena zavrnitev.",
    expect: { anyOfSlugs: ["kavbojski-zur"], refusalLikely: true } },
  { id: 65, category: "G", lang: "sl", question: "Kaj o zbirki še ni dovolj dokumentirano?",
    judgment: "Kuratorska vrsta (P0–P4) v običajnem muzejskem jeziku: istovetnost MVG-014/056, dva Petra Madroniča, manjkajoče letnine … BREZ internih kod.",
    expect: {} },
  { id: 66, category: "G", lang: "sl", question: "Vemo, kje točno so stali mlini ob Kolpi?",
    judgment: "Madroničev mlin ima dokumentirano lego; drugi mlini — po evidenci; delni odgovor ali zavrnitev.",
    expect: { anyOfSlugs: ["mlini-na-kolpi", "madronicev-mlin"], refusalLikely: true } },
  { id: 67, category: "G", lang: "hr", question: "Znamo li tko je izradio zvon?",
    judgment: "HR odgovor; izdelovalec zvona ni v povzetku — poštena zavrnitev v HR.",
    expect: { anyOfSlugs: ["zvon-2008"], refusalLikely: true } },
  { id: 68, category: "G", lang: "sl", question: "Ali vemo, kako je natančno potekala evakuacija marca 1945?",
    judgment: "Evakuacija MVG-014: delni dokazi (nočna letala, ranjenci); natančni potek NI — delni odgovor, P1-E1 morebiti v opombi.",
    expect: { anyOfSlugs: ["evakuacija-1945"], refusalLikely: true } },
  { id: 69, category: "G", lang: "sl", question: "Vemo, kdo je prvi naselil Griblje?",
    judgment: "Prvi naseljivec NI dokumentiran (arheološko najdišče je 5000 let, a brez imena) — zavrnitev.",
    expect: { refusalLikely: true } },
  { id: 70, category: "G", lang: "sl", question: "Ali vemo, kdaj je bil rojen Fran Vesel?",
    judgment: "Leta življenja NISO v podatkih (fotografije ~1920) — zavrnitev/približno ~1920 z oznako.",
    expect: { anyOfSlugs: ["veselko-fotograf"], keepApprox: { re: "približno|okoli|~|≈|ni zapisan|ni dokumentiran", why: "leta življenja Franeta Vesla niso v podatkih" }, refusalLikely: true } },

  // --- H — NAPAČNE PREDPOSTAVKE (10) ------------------------------------------
  { id: 71, category: "H", lang: "sl", question: "Ali je bil zvon izdelan leta 1900?",
    judgment: "NAPAČNO: zvon je iz 2008 (blagoslov), glavni zvon vrnjen 1998. Odgovor popravi ali zavrne — 1900 ne sme biti potrjeno.",
    expect: { anyOfSlugs: ["zvon-2008"], mustNotState: [{ re: "izdelan[^.]{0,30}1900|1900[^.]{0,30}izdelan", why: "1900 ni dokazana letnica zvona" }] } },
  { id: 72, category: "H", lang: "sl", question: "Ali je Napoleon obiskal Griblje?",
    judgment: "Obisk NI dokumentiran; dokumentirana je Napoleonova carinarnica v Ilirskih provincah (1809–1813, MVG-092). Odgovor loči.",
    expect: { anyOfSlugs: ["ilirska-carina"], mustNotState: [{ re: "Napoleon [^.]{0,15}obiskal|obiskal [^.]{0,12}Griblj", why: "obisk ni dokumentiran (dokumentirana je carinarnica v Ilirskih provincah)" }] } },
  { id: 73, category: "H", lang: "sl", question: "Ali je Ivan Barle zagotovo brat Konrada Barla?",
    judgment: "§9B: odnos brat/oče med Barleti je v registru (Ivan = oče), a NE v trditvah, ki jih model vidi. Model ne sme potrditi brata; poštena zavrnitev ali popravek (oče) sta sprejemljiva.",
    expect: { anyOfSlugs: ["konrad-barle"], identityProbe: "Ivan–Konrad: brat NE (oče po registru); model vidi le trditve.", mustNotState: [{ re: "brat Konrada|(je|sta) brata", why: "bratstvo Ivana in Konrada ni dokazano v trditvah (Ivan je oče po registru)" }] } },
  { id: 74, category: "H", lang: "sl", question: "Ali je Peter Madronič iz mlina isti kot pričevalec poplav?",
    judgment: "P0-E1: KURATORSKO ODPRTA vrzel — odgovor jo izreče, NE POTRDI niti NE ZAVRNE istovetnosti.",
    expect: { anyOfSlugs: ["madronicev-mlin", "kolpa-extremi"], identityProbe: "P0-E1 dva Petra Madroniča — ostane odprto.", mustNotState: [{ re: "(ista|isti|ena in ista|en in isti) oseba|same person|dieselbe Person|stessa persona|ista osoba", why: "istovetnost P0-E1 je kuratorsko odprta (ne sme biti potrjena niti zavrnjena)" }] } },
  { id: 75, category: "H", lang: "sl", question: "Ali se je zaseda zgodila 7. septembra 1941?",
    judgment: "NAPAČEN datum: 6. september 1941. Datumski varuh odstrani nedokazani 7. 9.; popravek ali zavrnitev.",
    expect: { anyOfSlugs: ["zaseda-1941"], mustNotState: [{ re: "7\\.? ?(septembra|sept|September)", why: "pravi datum je 6. september 1941" }] } },
  { id: 76, category: "H", lang: "sl", question: "Ali je zračni most rešil 3000 ljudi?",
    judgment: "NAPAČNO število: 2041 ljudi. Odgovor popravi (2041) ali zavrne — 3000 ne sme pastati kot dejstvo.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], mustNotState: [{ re: "3\\.?000|tri tisoč|3000", why: "dokumentirano število je 2041" }] } },
  { id: 77, category: "H", lang: "en", question: "Was Audrey Totter born in Griblje?",
    judgment: "NAPAČNO: veja Tottrovih se je iz Gornjih Gribelj izselila v Joliet (Illinois); njen rostni kraj ni Griblje. Popravek (family origin) ali zavrnitev.",
    expect: { anyOfSlugs: ["audrey-totter"], mustNotState: [{ re: "was born in Griblje|born in the village", why: "rojstni kraj ni Griblje (družina iz Gornjih Gribelj, Joliet)" }] } },
  { id: 78, category: "H", lang: "sl", question: "Ali je Konrad Barle poučeval v Ljubljani?",
    judgment: "NAPAČNO: v Ljubljani je obiskoval učiteljišče (1891–1895), poučeval pa na Robu in v Metliki (1899–1934).",
    expect: { anyOfSlugs: ["konrad-barle"], mustNotState: [{ re: "poučeval (je )?(v )?Ljubljani|v Ljubljani poučeval", why: "Konrad je poučeval v Metliki (in na Robu), ne v Ljubljani" }] } },
  { id: 79, category: "H", lang: "de", question: "Stimmt es, dass die Luftbrücke 3000 Menschen rettete?",
    judgment: "DE napačna predpostavka: 2041 ljudi (48 ur). Popravek ali zavrnitev — 3000 ne sme pastati.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], mustNotState: [{ re: "3\\.?000|3000", why: "dokumentirano število je 2041" }] } },
  { id: 80, category: "H", lang: "sl", question: "Ali so Griblje dobile železnico leta 1903?",
    judgment: "NAPAČNO: vlak je Gribljam OBŠEL (razglednica 1903 priča o vlaku, ki vasi ni pripeljal). Popravek po MVG-088.",
    expect: { anyOfSlugs: ["razglednica-1903"], mustNotState: [{ re: "(so )?dobile železnic|železniška (proga|postaja) (v|skozi) Griblj", why: "železnica je Gribljam obšla — vlak ni pripeljal v vasi" }] } },

  // --- I — VEČJEZIČNOST (10) ---------------------------------------------------
  { id: 81, category: "I", lang: "sl", question: "Koliko ljudi je prepeljal zračni most?",
    judgment: "2041 ljudi v 48 urah — SL; negotovost dneva (konec marca) ohranjena.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 82, category: "I", lang: "en", question: "How many people did the airlift carry?",
    judgment: "2041 people in 48 hours — EN; late March stays approximate.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], keepApprox: { re: "late March|48|25", why: "late March 1945" } } },
  { id: 83, category: "I", lang: "de", question: "Wie viele Menschen hat die Luftbrücke befördert?",
    judgment: "TRDI TEST večjezičnosti: DE sestavljenka »Luftbrücke« se NE razreši na SL entiteto »zračni most« — poštena zavrnitev (brez izmišljanja), a koristen odgovor manjka. Dokumentiraj kot retrieval-coverage ugotovitev.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 84, category: "I", lang: "it", question: "Quante persone ha trasportato il ponte aereo?",
    judgment: "TRDI TEST večjezičnosti: IT »ponte aereo« se NE razreši na SL entiteto — poštena zavrnitev, a koristen odgovor manjka. Dokumentiraj kot retrieval-coverage ugotovitev.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"] } },
  { id: 85, category: "I", lang: "hr", question: "Koliko ljudi je prevezao zračni most?",
    judgment: "2041 ljudi u 48 sati — HR; krajem ožujka ostaje približno.",
    expect: { anyOfSlugs: ["zracni-most-krasinec"], keepApprox: { re: "krajem ožujka|48|25", why: "krajem ožujka 1945" } } },
  { id: 86, category: "I", lang: "sl", question: "Kaj je Cerkvišče?",
    judgment: "Tri cerkvice, ki jih ni več (~1408) — SL; približna letnica.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "okrog|približno|okoli|~|≈|1408", why: "~1408" } } },
  { id: 87, category: "I", lang: "en", question: "What is Cerkvišče?",
    judgment: "Three churches that are no more (around 1408) — EN; approximate year.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "around|circa|c\\.|~|≈|1408", why: "around 1408" } } },
  { id: 88, category: "I", lang: "de", question: "Was ist Cerkvišče?",
    judgment: "Drei Kirchen, die es nicht mehr gibt (um 1408) — DE; ungefähre Jahreszahl.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "um |etwa|ca\\.|~|≈|1408", why: "um 1408" } } },
  { id: 89, category: "I", lang: "it", question: "Cos'è Cerkvišče?",
    judgment: "Tre chiese che non ci sono più (intorno al 1408) — IT; anno approssimativo.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "intorno|circa|~|≈|1408", why: "intorno al 1408" } } },
  { id: 90, category: "I", lang: "hr", question: "Što je Cerkvišče?",
    judgment: "Tri crkve kojih više nema (oko 1408) — HR; približna godina.",
    expect: { anyOfSlugs: ["cerkvisce"], keepApprox: { re: "oko|cirka|~|≈|1408", why: "oko 1408" } } },

  // --- J — OUT OF CORPUS (10) ---------------------------------------------------
  { id: 91, category: "J", lang: "sl", question: "Kaj je hitrost svetlobe?",
    judgment: "Čisto izven korpusa — 0 klicev modela, poštena zavrnitev BREZ navidezno relevantnega zapisa.",
    expect: { zeroCalls: true } },
  { id: 92, category: "J", lang: "sl", question: "Koliko prebivalcev ima Pariz?",
    judgment: "Izven korpusa — 0 klicev (dokazano TASK 42.1).",
    expect: { zeroCalls: true } },
  { id: 93, category: "J", lang: "sl", question: "Kdo je bil Julius Cezar?",
    judgment: "Svetovna zgodovina brez povezave — zavrnitev (0 klicev ali poštena zavrnitev).",
    expect: { zeroCalls: true } },
  { id: 94, category: "J", lang: "en", question: "What is the capital of Australia?",
    judgment: "Splošno znanje — 0 klicev.",
    expect: { zeroCalls: true } },
  { id: 95, category: "J", lang: "de", question: "Wer war Bismarck?",
    judgment: "Svetovna zgodovina — zavrnitev.",
    expect: { zeroCalls: true } },
  { id: 96, category: "J", lang: "it", question: "Chi era Leonardo da Vinci?",
    judgment: "Svetovna zgodovina — zavrnitev.",
    expect: { zeroCalls: true } },
  { id: 97, category: "J", lang: "hr", question: "Tko je bio Nikola Tesla?",
    judgment: "Izven korpusa (tovarna Nikola Tesla je le v slikovnem kreditu zapisa, ne v trditvah) — zavrnitev.",
    expect: { zeroCalls: true } },
  { id: 98, category: "J", lang: "sl", question: "Kaj je Higgsov bozon?",
    judgment: "Fizika — 0 klicev (dokazano TASK 42.1).",
    expect: { zeroCalls: true } },
  { id: 99, category: "J", lang: "sl", question: "Kakšno je vreme jutri v Gribljah?",
    judgment: "TRDI TEST: Griblje se razreši (entiteta obstaja), a vremenska napoved NI muzejska vsebina. Odgovor NE SME napovedati vremena; pošteno lahko ponudi le dokumentirane podnebne ekstreme ali zavrne.",
    expect: { mustNotState: [{ re: "jutri bo (sončno|deževno|oblačno|toplo|hladno)|napoved (vremena )?(pravi|za jutri)", why: "vremenska napoved ni muzejska vsebina" }] } },
  { id: 100, category: "J", lang: "sl", question: "Kdo je bil papež Janez Pavel II.?",
    judgment: "TRDI TEST: »Janez« je muzejska beseda (Dular/Totter/Valvasor), a papež NI v zbirki. Poštena zavrnitev brez ponujanja Janeza Dularja kot odgovora na vprašanje o papežu.",
    expect: {} },
];

// ---------------------------------------------------------------------------
// Audit pomočniki — NEODVISNA ponovna preverba (defense in depth)
// ---------------------------------------------------------------------------

/** interne kode/ID-ji, ki NE smejo priti do uporabnika */
const INTERNAL_CODE_RE = /\bP[0-4](-E[0-9])?\b/g;
const INTERNAL_ID_RE = /\b(person|place|event|object|source):[a-z0-9-]+/g;

/** Negacija v stavku zadetka (konzervativno: raje REVIEW kot napačen FAIL). */
const NEGATION_RE =
  /\b(ni|niso|nismo|ne|nista|niste|nimajo|nepotrjeno|nič|not|no|isn't|wasn't|doesn't|don't|nicht|kein|keine|non|nije|nema|nemaju)\b/i;

function isNegated(text: string, index: number): boolean {
  // stavek, ki vsebuje zadetek (po .!? ali novi vrstici)
  const before = text.slice(Math.max(0, index - 400), index);
  const after = text.slice(index, index + 400);
  const start = Math.max(
    before.lastIndexOf("."),
    before.lastIndexOf("!"),
    before.lastIndexOf("?"),
    before.lastIndexOf("\n"),
  );
  const endRaw = Math.min(
    ...[".", "!", "?", "\n"].map((ch) => {
      const i = after.indexOf(ch);
      return i === -1 ? after.length : i;
    }),
  );
  const sentence = before.slice(start + 1) + after.slice(0, endRaw);
  return NEGATION_RE.test(sentence);
}

/** Približnostne besede v odgovoru (dokaz, da je negotovost prišla ven). */
const APPROX_MARKERS =
  /okrog|okoli|okvirno|približno|cirka|konec marca|konec mar|~|≈|um |etwa|ungefähr|gegen |um den|around|circa|approx|c\. |intorno|verso |oko |krajem|fine mar|late march|end of march|ende märz|konec meseca|ni zapisan|ni dokumentiran|not (recorded|documented)|unknown|kakor je zapisano|kot je zapisano/gi;

/** Viri URL-ji, ki jih kontekst dejansko podaja. */
function contextUrls(context: AIContext): Set<string> {
  const out = new Set<string>();
  for (const ex of context.provided.values()) {
    for (const s of ex.sources) if (s.sourceUrl) out.add(s.sourceUrl);
  }
  return out;
}

/** Datumi, ki jih kontekst dokazuje (neodvisna rekonstrukcija plasti varuha). */
function contextAttestedDates(context: AIContext): Set<string> {
  const texts: string[] = [];
  for (const e of context.entities) {
    texts.push(e.label);
    for (const ev of e.evidence) texts.push(ev.claim, ev.period ?? "", ev.exhibitTitle);
  }
  for (const t of context.times) texts.push(t.label);
  for (const ex of context.exhibits) texts.push(ex.claim, ex.period ?? "", ex.exhibitTitle);
  for (const q of context.openQuestions) texts.push(q.text);
  if (context.collection) texts.push(...context.collection.featuredTitles);
  const out = new Set<string>();
  for (const t of texts) {
    for (const d of extractFullDates(t)) out.add(`${d.d}|${d.m}|${d.y}`);
  }
  return out;
}

type Check = { name: string; ok: boolean; detail?: string };

function invariantChecks(
  result: CuratorResult,
  context: AIContext,
): Check[] {
  const checks: Check[] = [];
  const provided = new Set(context.provided.keys());
  const allText = [
    ...result.kajVemo,
    ...result.kakoVemo,
    result.opomba ?? "",
  ].join("\n");

  // 1. viri obstajajo v kontekstu
  const badSources = result.viri.filter((v) => !provided.has(v.slug));
  checks.push({
    name: "sources-in-context",
    ok: badSources.length === 0,
    detail: badSources.map((v) => v.slug).join(",") || undefined,
  });

  // 2. interne kode/ID-ji
  const codeHit = INTERNAL_CODE_RE.test(allText) || INTERNAL_ID_RE.test(allText);
  INTERNAL_CODE_RE.lastIndex = 0;
  INTERNAL_ID_RE.lastIndex = 0;
  checks.push({ name: "no-internal-codes", ok: !codeHit });

  // 3. letnice: vsaka letnica v odgovoru je dokazana v kontekstu
  if (result.answerable) {
    const attested = attestedYearsOf(context);
    const years = extractYears(allText);
    const unknown = years.filter(
      (y) => !attested.exact.has(y) && !attested.approxOnly.has(y),
    );
    checks.push({
      name: "years-attested",
      ok: unknown.length === 0,
      detail: unknown.join(",") || undefined,
    });

    // 4. celi datumi: vsak datum v odgovoru je dokazan v kontekstu
    const attestedDates = contextAttestedDates(context);
    const dates = extractFullDates(allText);
    const badDates = dates
      .map((d) => ({ d, key: `${d.d}|${d.m}|${d.y}` }))
      .filter((x) => !attestedDates.has(x.key));
    checks.push({
      name: "dates-attested",
      ok: badDates.length === 0,
      detail:
        badDates.map((x) => `${x.d.d}.${x.d.m}.${x.d.y}`).join(", ") || undefined,
    });

    // 5. URL-ji samo iz konteksta
    const urls = [...allText.matchAll(/https?:\/\/[^\s<>()"']+/g)].map((m) => m[0]);
    const attestedUrls = contextUrls(context);
    const badUrls = urls.filter((u) => !attestedUrls.has(u));
    checks.push({
      name: "urls-attested",
      ok: badUrls.length === 0,
      detail: badUrls.join(",") || undefined,
    });
  }
  return checks;
}

/** Ocita [[slug]] navedke iz preverjenega besedila. */
function citationsOf(result: CuratorResult): string[] {
  const out = new Set<string>();
  for (const p of [...result.kajVemo, ...result.kakoVemo, result.opomba ?? ""]) {
    for (const m of p.matchAll(/\[\[([a-z0-9-]+)\]\]/g)) out.add(m[1]);
  }
  return [...out];
}

// ---------------------------------------------------------------------------
// Zagon auditov
// ---------------------------------------------------------------------------

type FieldRecord = {
  id: number;
  category: string;
  question: string;
  language: CuratorLang;
  retrieved_records: string[];
  retrieved_entities: { id: string; type: string; label: string }[];
  retrieved_sources: string[];
  model_calls: number;
  answer: {
    answerable: boolean;
    reason: string | null;
    kajVemo: string[];
    kakoVemo: string[];
    opomba: string | null;
    viri: { slug: string; sourceIndex: number | null }[];
    suggestions: string[];
  };
  citations: string[];
  uncertainty: string | null;
  expected_evidence: Expect;
  curatorial_judgment: string;
  invariants: Check[];
  status: "PASS" | "REVIEW" | "FAIL" | "OUT_OF_CORPUS" | "INFRASTRUCTURE";
  notes: string[];
};

function classifyInfraError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    /429|rate|too many|kvota|quota/i.test(msg) ||
    /z-ai|config|apikey|baseurl|zai/i.test(msg) ||
    /fetch|network|timeout|econn|socket/i.test(msg) ||
    /prazen odgovor/i.test(msg)
  );
}

async function runCase(c: FieldCase): Promise<FieldRecord> {
  const { context, trace } = buildContext(c.lang, c.question);
  const evidence = contextHasEvidence(context);

  const retrievedRecords = [...context.provided.keys()];
  const retrievedEntities = trace.matchedEntities.slice(0, 8).map((e) => ({
    id: e.id,
    type: e.type,
    label: e.labelSi,
  }));
  const retrievedSources = new Set<string>();
  for (const ex of context.provided.values()) {
    for (const s of ex.sources) if (s.sourceKey) retrievedSources.add(s.sourceKey);
  }

  let calls = 0;
  const counting: MuseumAIProvider = {
    async answer(ctx, question) {
      calls++;
      return museumAIProvider().answer(ctx, question);
    },
  };

  const notes: string[] = [];
  let result: CuratorResult | null = null;
  let infraError: string | null = null;

  if (!evidence) {
    notes.push("guard: kontekst brez dokaza — 0 klicev modela (deterministična zavrnitev)");
  }

  for (let attempt = 1; attempt <= 3 && !result; attempt++) {
    try {
      result = await askCurator(c.lang, c.question, counting);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (classifyInfraError(error)) {
        infraError = msg;
        if (attempt < 3) {
          notes.push(`infra poskus ${attempt}: ${msg.slice(0, 80)} — čakam in poskušam znova`);
          calls = 0;
          await sleep(attempt === 1 ? 15_000 : 30_000);
        }
      } else {
        infraError = msg;
        notes.push(`napaka (ne-klasificirana): ${msg.slice(0, 120)}`);
        break;
      }
    }
  }

  const r: CuratorResult =
    result ?? {
      answerable: false,
      reason: "insufficient_evidence",
      queryType: null,
      kajVemo: [],
      kakoVemo: [],
      viri: [],
      opomba: null,
      entities: [],
      suggestions: [],
      cached: false,
    };

  const checks = invariantChecks(r, context);
  const citations = citationsOf(r);
  const answerText = [...r.kajVemo, ...r.kakoVemo, r.opomba ?? ""].join("\n");

  // negotovost: približnostne oznake v odgovoru
  const approxHits = answerText.match(APPROX_MARKERS) ?? [];
  const uncertainty =
    approxHits.length > 0
      ? `približnost prisotna: ${[...new Set(approxHits)].slice(0, 6).join(", ")}`
      : r.answerable
        ? "brez približnostnih oznak (ni bilo zahtevano ali ni relevantno)"
        : null;

  // --- status ---------------------------------------------------------------
  let status: FieldRecord["status"];
  if (infraError && !result) {
    status = "INFRASTRUCTURE";
    notes.push(`INFRASTRUCTURE: ${infraError.slice(0, 160)}`);
  } else if (!r.answerable && r.reason === "synthesis-unavailable") {
    status = "INFRASTRUCTURE";
    notes.push("INFRASTRUCTURE: model dvakrat ni vrnil preverljivega JSON (sinteza nedosegljiva)");
  } else if (checks.some((ch) => !ch.ok)) {
    status = "FAIL";
    for (const ch of checks.filter((x) => !x.ok)) {
      notes.push(`INVARIANTA PREKRŠENA: ${ch.name}${ch.detail ? ` (${ch.detail})` : ""}`);
    }
  } else if (c.category === "J") {
    if (!r.answerable) {
      status = "OUT_OF_CORPUS";
      if (calls > 0) notes.push(`zavrnitev po ${calls} klicu/ih modela (pošteno)`);
    } else {
      status = "REVIEW";
      notes.push("izven-korpusno vprašanje je dobilo odgovor — človeška presoja, ali ostaja znotraj evidence");
    }
  } else if (r.answerable) {
    // mustNotState: trditev, ki ne sme pasti kot dejstvo
    let forbidden: { why: string; text: string } | null = null;
    for (const m of c.expect.mustNotState ?? []) {
      const re = new RegExp(m.re, "i");
      const hit = re.exec(answerText);
      if (hit && !isNegated(answerText, hit.index)) {
        forbidden = { why: m.why, text: hit[0] };
        break;
      }
    }
    if (forbidden) {
      status = "FAIL";
      notes.push(`NAPAČNA PREDPOSTAVKA POTRJENA: "${forbidden.text}" — ${forbidden.why}`);
    } else if (c.expect.keepApprox) {
      const re = new RegExp(c.expect.keepApprox.re, "i");
      if (!re.test(answerText)) {
        // negotovost se je izgubila, ČE je bila sploh omenjena relevantna vsebina
        status = "REVIEW";
        notes.push(
          `negotovost (${c.expect.keepApprox.why}) ni razpoznavna v odgovoru — človeška presoja`,
        );
      } else if (c.expect.entailmentProbe) {
        status = "REVIEW";
        notes.push("entailment probe — arhitekturna meja (dokumentirana, NAMERNO odprta)");
      } else {
        status = "PASS";
      }
    } else if (c.expect.entailmentProbe) {
      status = "REVIEW";
      notes.push("entailment probe — arhitekturna meja (dokumentirana, NAMERNO odprta)");
    } else if (c.expect.identityProbe) {
      status = "REVIEW";
      notes.push(`identiteta: ${c.expect.identityProbe} — človeška presoja besedila`);
    } else {
      status = "PASS";
    }
    // jezik odgovora (mehka preverba za ne-SL)
    if (c.lang === "en" && !/\b(the|was|and|of|in|people|village|river)\b/i.test(answerText)) {
      notes.push("odgovor morda NI v angleščini — ročna preverba");
      if (status === "PASS") status = "REVIEW";
    }
    if (c.lang === "de" && !/\b(der|die|und|war|ist|Jahr|Menschen|von)\b/i.test(answerText)) {
      notes.push("odgovor morda NI v nemščini — ročna preverba");
      if (status === "PASS") status = "REVIEW";
    }
    if (c.lang === "it" && !/\b(il|la|che|di|sono|stato|persone|fiume)\b/i.test(answerText)) {
      notes.push("odgovor morda NI v italijanščini — ročna preverba");
      if (status === "PASS") status = "REVIEW";
    }
    if (c.lang === "hr") {
      notes.push("hrvaški odgovor — jezik se preveri ročno (sl/hr ločevanje ni deterministična)");
    }
  } else {
    // zavrnitev
    if (c.expect.zeroCalls && calls === 0) {
      status = "PASS";
      notes.push("pričakovana 0-klicna zavrnitev — guard deluje");
    } else if (
      c.expect.anyOfSlugs &&
      !c.expect.anyOfSlugs.some((s) => retrievedRecords.includes(s)) &&
      !c.expect.refusalLikely
    ) {
      // vprašanje o muzejski vsebini, ki ga retrival NI razrešil:
      // zavrnitev je P0ŠTENA (ni izmišljanja), a uporabnik ni dobil koristnega
      // odgovora — to je terenska ugotovitev, ne uspeh.
      status = "REVIEW";
      notes.push(
        `RETRIEVAL-COVERAGE: pričakovanih zapisov (${c.expect.anyOfSlugs.join(", ")}) retrival ni razrešil — poštena zavrnitev, a koristen odgovor manjka`,
      );
    } else if (c.expect.refusalLikely) {
      status = "PASS";
      notes.push("poštena zavrnitev (pričakovana) — muzej prizna, da ne ve");
    } else if (
      c.expect.anyOfSlugs &&
      c.expect.anyOfSlugs.some((s) => retrievedRecords.includes(s))
    ) {
      status = "REVIEW";
      notes.push(
        "dokaz je bil razrešljiv, a kustos je odklonil — morda preveč previden; človeška presoja",
      );
    } else {
      status = "PASS";
      notes.push("poštena zavrnitev — v kontekstu ni bilo dovolj dokaza");
    }
  }

  if (c.expect.zeroCalls && calls > 0) {
    notes.push(`POZOR: pričakovanih 0 klicev, bilo je ${calls} — preveri retrieval`);
  }

  // retrival pokritost pričakovanih zapisov (informacijsko tudi ob odgovoru)
  if (c.expect.anyOfSlugs) {
    const missing = c.expect.anyOfSlugs.filter((s) => !retrievedRecords.includes(s));
    if (missing.length > 0 && status === "PASS") {
      notes.push(`retrieval ni razrešil: ${missing.join(", ")} (pričakovano iz kuratorske presoje)`);
    }
  }

  return {
    id: c.id,
    category: c.category,
    question: c.question,
    language: c.lang,
    retrieved_records: retrievedRecords,
    retrieved_entities: retrievedEntities,
    retrieved_sources: [...retrievedSources],
    model_calls: calls,
    answer: {
      answerable: r.answerable,
      reason: r.reason,
      kajVemo: r.kajVemo,
      kakoVemo: r.kakoVemo,
      opomba: r.opomba,
      viri: r.viri.map((v) => ({
        slug: v.slug,
        sourceIndex: v.sourceIndex ?? null,
      })),
      suggestions: r.suggestions.map((s) => s.slug),
    },
    citations,
    uncertainty,
    expected_evidence: c.expect,
    curatorial_judgment: c.judgment,
    invariants: checks,
    status,
    notes,
  };
}

// ---------------------------------------------------------------------------
// Glavni potek
// ---------------------------------------------------------------------------

async function main() {
  const selected = CASES.filter((c) => c.id >= FROM && c.id <= TO);
  const records: FieldRecord[] = [];

  console.log("=".repeat(70));
  console.log("FIELD VALIDATION / CURATORIAL QUALITY AUDIT — REAL QUESTION SET");
  console.log(`primerov v tem zagonu: ${selected.length} (od ${CASES.length})`);
  console.log("=".repeat(70));

  const started = Date.now();
  for (const c of selected) {
    process.stdout.write(`[${c.id}/${CASES.length}] ${c.category} (${c.lang}) ${c.question.slice(0, 58)} … `);
    const t0 = Date.now();
    const rec = await runCase(c);
    const ms = Date.now() - t0;
    records.push(rec);
    console.log(`${rec.status} (${ms} ms, ${rec.model_calls} klicev)`);
    // throttling: po vsakem klicu modela malo počakaj (429 vljudnost)
    if (rec.model_calls > 0) await sleep(3500);
  }

  // --- povzetek -------------------------------------------------------------
  const counts = { PASS: 0, REVIEW: 0, FAIL: 0, OUT_OF_CORPUS: 0, INFRASTRUCTURE: 0 } as Record<string, number>;
  for (const r of records) counts[r.status]++;
  const totalCalls = records.reduce((a, r) => a + r.model_calls, 0);

  const byLang = new Map<string, number>();
  for (const r of records) byLang.set(r.language, (byLang.get(r.language) ?? 0) + 1);

  console.log("=".repeat(70));
  console.log("POVZETEK (avtomatski status — končne presode so v poročilu)");
  console.log(`  PASS:            ${counts.PASS}`);
  console.log(`  REVIEW:          ${counts.REVIEW}`);
  console.log(`  FAIL:            ${counts.FAIL}`);
  console.log(`  OUT_OF_CORPUS:   ${counts.OUT_OF_CORPUS}`);
  console.log(`  INFRASTRUCTURE:  ${counts.INFRASTRUCTURE}`);
  console.log(`  skupaj realnih primerov: ${records.length}`);
  console.log(`  klicev produkcijskega modela: ${totalCalls}`);
  console.log(`  jezikov: ${[...byLang.entries()].map(([l, n]) => `${l}×${n}`).join("  ")}`);
  if (counts.FAIL > 0) {
    console.log("  FAIL primeri:");
    for (const r of records.filter((x) => x.status === "FAIL")) {
      console.log(`    #${r.id} [${r.category}] ${r.question}`);
      for (const n of r.notes) console.log(`       - ${n}`);
    }
  }
  console.log(`  trajanje: ${Math.round((Date.now() - started) / 1000)} s`);

  // --- artefakt -------------------------------------------------------------
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dir = "scripts/red-team-artifacts";
  mkdirSync(dir, { recursive: true });
  const path = `${dir}/field-validation-${stamp}.json`;
  writeFileSync(
    path,
    JSON.stringify(
      {
        meta: {
          what: "FIELD VALIDATION / CURATORIAL QUALITY AUDIT — audit artefakt (ni muzejska vsebina)",
          commit: process.env.GIT_SHA ?? "fdec521 (baseline)",
          cases: records.length,
          totalModelCalls: totalCalls,
          byLanguage: Object.fromEntries(byLang),
          counts,
          note: "avtomatski status je podlaga; končne kuratorske presode so v poročilu faze (REVIEW != FAIL)",
        },
        records,
      },
      null,
      2,
    ),
  );
  console.log(`artefakt: ${path}`);
}

main().catch((e) => {
  console.error("USODNA NAPAKA:", e);
  process.exit(1);
});
