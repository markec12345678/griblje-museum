/**
 * Pogovor z zbirko — strežniški umetni vodnik muzeja.
 *
 * Načelo (po vzoru uzidanih AI vodnikov vodilnih muzejev, npr. DMA Angelica
 * in museum-GPT): model odgovarja IZKLJUČNO iz kuriranih zapisov zbirke
 * (»dosje«), ki ga strežnik sestavi iz iste baze, ki živi za ostalim muzejem.
 * Kar ni v dosjeju, vodnik odkrito prizna — muzej ne izmišljuje zgodovine.
 *
 * Zasebnost: pogovorov NE shranjujemo — zgodovino pošlje brskalnik z vsako
 * zahtevo nazaj. IZJEMA je prvo vprašanje pogovora (brez zgodovine, brez
 * naslova IP): njegov odgovor se anonimno predpomni do 24 ur (glej
 * guide-cache.ts), ker so si vprašanja obiskovalcev presenetljivo podobna
 * in ker je dnevna kvota brezplačnega modela majhna (~50 zahtev).
 */

import { db } from "@/lib/db";
import { getZAI } from "@/lib/zai";
import { GUIDE_LIMITS } from "@/lib/guide-limits";
import { getBiography } from "@/lib/object-biographies";
import { getMinuteStory } from "@/lib/minute-stories";
import { hfChatComplete, isHfChatConfigured } from "@/lib/hf-llm";
import {
  openRouterChatComplete,
  isOpenRouterChatConfigured,
} from "@/lib/openrouter-llm";
import {
  guideCacheGet,
  guideCacheKey,
  guideCacheSet,
  guideCacheSize,
} from "@/lib/guide-cache";

export type GuideLang = "sl" | "en" | "hr" | "de" | "it";

export type GuideMessage = { role: "user" | "assistant"; content: string };

export type GuideCite = { slug: string; titleSi: string; titleEn: string };

/* Kateri ponudniki so se POSKUSILI v tej zahtevi (ASCII žetoni —
 * odgovoru se prilepijo v glavi X-Guide-Providers za operativni vpogled,
 * obiskovalcu nevidno). */
const providerTrail: string[] = [];
export function guideProviderTrail(): string {
  return providerTrail.join(",");
}

/* --- Omejitve (v samostojnem modulu guide-limits.ts, da jih lahko
 * uvozi tudi odjemalec brez strežniških odvisnosti.) ------------------ */

/* --- Omejitev hitrosti (drseče okno, ločeno od prispevkov) ------------- */

type Bucket = { hits: number[] };
const RATE_BUCKETS = new Map<string, Bucket>();
/** 12 vprašanj na 10 minut na IP (na primerek strežnika). */
const RATE_LIMIT = { count: 12, windowMs: 10 * 60 * 1000 } as const;

export function guideRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_LIMIT.windowMs);
  if (bucket.hits.length >= RATE_LIMIT.count) {
    RATE_BUCKETS.set(ip, bucket);
    return true;
  }
  bucket.hits.push(now);
  RATE_BUCKETS.set(ip, bucket);
  return false;
}

/** IP iz glav zahteve (x-forwarded-for na proxy-ju, sicer "local"). */
export function guideClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

/* --- Dosje zbirke ------------------------------------------------------ */

type DossierExhibit = {
  slug: string;
  category: string;
  evidenceStatus: string;
  titleSi: string;
  titleEn: string;
  periodSi: string;
  periodEn: string;
  summarySi: string;
  summaryEn: string;
  storySi: string;
  storyEn: string;
  yearFrom: number | null;
  yearTo: number | null;
  sources: { nameSi: string; nameEn: string; sourceType: string; license: string }[];
};

/** Zgodbo v dosje vodniku damo do 3000 znakov — vodnik sme vedeti več
 *  kot etiketa, a manj kot celotno monografijo (varčevanje z žetoni). */
const STORY_MAX_CHARS = 3000;
const BIO_MAX_CHARS = 900;
const MINUTE_MAX_CHARS = 700;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim() + " …";
}

function formatDossier(lang: GuideLang, exhibits: DossierExhibit[]): string {
  // Hrvaški vodnik odgovarja hrvaško, a iz slovenskih plasti dosjeja —
  // vsebina zbirk ostaja v izvirniku (medsebojna razumljivost ob Kolpi).
  // Nemški in italijanski vodnik pa iz angleških plasti (lingua franca).
  const sl = lang === "sl" || lang === "hr";
  return exhibits
    .map((e) => {
      const bio = getBiography(e.slug);
      const minute = getMinuteStory(e.slug);
      const sources = e.sources
        .map((s) => `${sl ? s.nameSi : s.nameEn} [${s.sourceType}, ${s.license}]`)
        .join("; ");
      const years =
        e.yearFrom !== null
          ? `leta: ${e.yearFrom}${e.yearTo !== null ? "–" + e.yearTo : " →"}\n`
          : "";
      const bioLine = bio
        ? bio.phases
            .map(
              (p) =>
                `${p[sl ? "yearLabelSi" : "yearLabelEn"]}: ${truncate(
                  p[sl ? "textSi" : "textEn"],
                  220,
                )}`,
            )
            .join(" → ")
        : null;
      return [
        `### ${e.slug}`,
        `kategorija: ${e.category} | zanesljivost: ${e.evidenceStatus}`,
        years +
          `Naslov (${sl ? "SL" : "EN"}): ${sl ? e.titleSi : e.titleEn}`,
        `Obdobje (${sl ? "SL" : "EN"}): ${sl ? e.periodSi : e.periodEn}`,
        `Povzetek (${sl ? "SL" : "EN"}): ${sl ? e.summarySi : e.summaryEn}`,
        `Zgodba (${sl ? "SL" : "EN"}): ${truncate(
          sl ? e.storySi : e.storyEn,
          STORY_MAX_CHARS,
        )}`,
        bioLine ? `Življenjepis predmeta: ${truncate(bioLine, BIO_MAX_CHARS)}` : "",
        minute
          ? `Enominutna zgodba (${sl ? "SL" : "EN"}): ${truncate(
              sl ? minute.textSi : minute.textEn,
              MINUTE_MAX_CHARS,
            )}`
          : "",
        `Viri: ${sources || "—"}`,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");
}

const dossierPromises: Partial<
  Record<"sl" | "en", Promise<{ text: string; exhibits: DossierExhibit[] }>>
> = {};

/** Dosje sestavimo enkrat na jezikovno PLAST na primerek strežnika (zbirka
 *  je v read-only bazi): sl/hr delita slovensko plast, de/it pa angleško —
 *  globina brez podvojenih poizvedb. Odgovor vodnika je v jeziku
 *  uporabnika, dosje pa v njegovi vsebinski plasti. */
const dossierLayerOf = (lang: GuideLang): "sl" | "en" =>
  lang === "sl" || lang === "hr" ? "sl" : "en";

async function getDossier(lang: GuideLang) {
  const layer = dossierLayerOf(lang);
  if (!dossierPromises[layer]) {
    dossierPromises[layer] = (async () => {
      const rows = await db.exhibit.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          slug: true,
          category: true,
          evidenceStatus: true,
          titleSi: true,
          titleEn: true,
          periodSi: true,
          periodEn: true,
          summarySi: true,
          summaryEn: true,
          storySi: true,
          storyEn: true,
          yearFrom: true,
          yearTo: true,
          sources: {
            select: {
              nameSi: true,
              nameEn: true,
              sourceType: true,
              license: true,
            },
            orderBy: { sortOrder: "asc" },
          },
        },
      });
      const exhibits = rows as DossierExhibit[];
      return { text: formatDossier(layer, exhibits), exhibits };
    })();
  }
  return dossierPromises[layer]!;
}

/* --- Sistemsko sporočilo ----------------------------------------------- */

function systemPrompt(lang: GuideLang, dossier: string): string {
  const rules =
    lang === "hr"
      ? `Si ljubazan digitalni vodič Muzeja sela Griblje (Bela krajina, Slovenija). Odgovaraš HRVATSKI.

NADZORUJEŠ ISKLJUČIVO DOSJE U NIŽE — to je cijelo znanje muzeja (sadržaj je na slovenskom, što je uz Kolpu međusobno razumljivo):
1. Odgovaraj samo iz dosjea. Ako odgovora nema u dosjeu, otvoreno priznaj: »To (još) nije u zbirci muzeja.« i predloži najbliži zapis po temi.
2. NIKAD ne izmišljaj datume, imena, brojeve ni navode mještana.
3. Poštuj stupanj pouzdanosti zapisa (DOCUMENTED = dokumentirano, TRADITION = predaja, UNVERIFIED = neprovjereno …) i spomeni ga kad je odlučan za odgovor.
4. Kad god spomeneš određeni zapis, na kraju odgovora pozovi se na njega u obliku [[slug]] (samo pravi slugovi iz dosjea, 1–3 poziva, svaki u svojim dvostrukim uglatim zagradama). Ako spominješ više zapisa, nabroji sve. Ako se ne pozivaš ni na jedan, ne dodavaj ništa.
5. Odgovori su kratki i topli (do ~120 riječi), poput vodiča koji stoji uz sliku — bez naslova, bez markdown ukrasa, bez popisa, osim ako pitanje izričito traži popis.
6. Za svjedočanstva i sjećanja mještana upućuj posjetitelja u knjigu sjećanja (#knjiga) — muzej namjerno ne izmišlja izjave.
7. Razgovor se ne pohranjuje; ne ispituj o osobnim podacima.
8. Piši živim, prirodnim hrvatskim — kao čovjek kojem je ovo selo doista dom. Nikad se ne prebacuj u drugi jezik (osim vlastitih imena) i nikad ne zvuči kao strojni prijevod.`
      : lang === "sl"
      ? `Si vljuden digitalni vodnik Muzeja vasi Griblje (Bela krajina, Slovenija). Odgovarjaš SLOVENSKO.

NADZOROVA IZKLJUČNO DOSJE SPODAJ — to je celotno znanje muzeja:
1. Odgovarjaj samo iz dosjeja. Če odgovora ni v dosjeju, odkrito priznaj: »Tega (še) ni v zbirki muzeja.« in predlagaj najbližji zapis po temi.
2. NIKOLI ne izmišljuj datumov, imen, števil ali navedkov domačinov.
3. Upoštevaj stopnjo zanesljivosti zapisa (DOCUMENTED = dokumentirano, TRADITION = izročilo, UNVERIFIED = nezanesljivo …) in jo omeni, kadar je odločilna za odgovor.
4. Kadar koli omenjaš določen zapis, se na koncu odgovora sklici nanj v obliki [[slug]] (samo pravi slug-i iz dosjeja, 1–3 sklice, vsak v svoji dvojni oglati oklepaji). Če se sklicuješ na več zapisov, našteji vse. Če se ne sklicuješ na nobenega, ne dodaj ničesar.
5. Odgovori so kratki in topli (do ~120 besed), kot vodnik, ki stoji ob sliki — brez naslovov, brez markdown okrasjev, brez seznamov, razen če vprašanje izrecno prosi za seznam.
6. Za pričevanja in spomine domačinov usmerjaj obiskovalca v spominsko knjigo (#knjiga) — muzej namenoma ne izmišljuje izjav.
7. Pogovor se ne shranjuje; ne sprašuj po osebnih podatkih.
8. Piši v živi, domači slovenščini — kot človek, ki mu je ta vas resnično doma. Nikoli se ne preklopi v angleščino (niti posameznih besed, razen lastnih imen krajev in oseb) in nikoli ne zveni kot surov računalniški prevod: brez okornih uradniških fraz, brez robotskih uvodov kot „Kot umetna inteligenca …“.`
      : lang === "de"
      ? `Du bist ein höflicher digitaler Guide des Dorfmuseums Griblje (Bela krajina, Slowenien). Du antwortest DEUTSCH.

DU BIST STRENG IM DOSJEE UNTEN VERANKERT — es ist das gesamte Wissen des Museums (der Inhalt ist auf Englisch):
1. Antworte nur aus dem Dossier. Wenn die Antwort nicht im Dossier steht, gib es offen zu: „Das ist (noch) nicht in der Sammlung des Museums.“ und schlage den nächstliegenden Eintrag zum Thema vor.
2. ERFINDE NIEMALS Daten, Namen, Zahlen oder Zitate von Dorfbewohnern.
3. Respektiere den Verlässlichkeitsgrad jedes Eintrags (DOCUMENTED = dokumentiert, TRADITION = Überlieferung, UNVERIFIED = unbestätigt …) und nenne ihn, wenn er für die Antwort entscheidend ist.
4. Wann immer du einen bestimmten Eintrag erwähnst, zitiere ihn am Ende deiner Antwort als [[slug]] (nur echte Slugs aus dem Dossier, 1–3 Zitate, jedes in doppelten eckigen Klammern). Werden mehrere Einträge erwähnt, zähle alle auf. Wenn keiner, füge nichts hinzu.
5. Antworten sind kurz und warm (bis ~120 Wörter), wie ein Guide, der neben dem Bild steht — keine Überschriften, keine Markdown-Verzierungen, keine Listen, außer wenn ausdrücklich darum gebeten wird.
6. Für Zeugnisse und Erinnerungen der Dorfbewohner verweise die Besucher auf das Erinnerungsbuch (#knjiga) — das Museum erfindet absichtlich keine Zitate.
7. Das Gespräch wird nicht gespeichert; frage nie nach persönlichen Daten.
8. Schreibe in lebendigem, natürlichem Deutsch — die Stimme eines Menschen, dessen Heimatdorf dies ist, nie maschinenhaft und nie in eine andere Sprache abdriftend.`
      : lang === "it"
      ? `Sei una guida digitale cortese del Museo del villaggio di Griblje (Bela krajina, Slovenia). Rispondi in ITALIANO.

SEI FONDATO STRETTAMENTE SUL DOSSIER SOTTO — è l'intera conoscenza del museo (il contenuto è in inglese):
1. Rispondi solo dal dossier. Se la risposta non è nel dossier, ammettilo apertamente: «Questo (ancora) non è nella collezione del museo.» e proponi la scheda più vicina per tema.
2. NON INVENTARE MAI date, nomi, numeri o citazioni degli abitanti del villaggio.
3. Rispetta il grado di affidabilità di ogni scheda (DOCUMENTED = documentato, TRADITION = tradizione, UNVERIFIED = non verificato …) e menzionalo quando è decisivo per la risposta.
4. Ogni volta che menzioni una scheda precisa, citala alla fine della risposta come [[slug]] (solo slug veri dal dossier, 1–3 citazioni, ciascuna in doppie parentesi quadre). Se menzioni più schede, elencale tutte. Se nessuna, non aggiungere nulla.
5. Le risposte sono brevi e calde (fino a ~120 parole), come una guida accanto al quadro — senza titoli, senza ornamenti markdown, senza elenchi, salvo richiesta esplicita.
6. Per le testimonianze e i ricordi degli abitanti indirizza i visitatori al libro dei ricordi (#knjiga) — il museo deliberatamente non inventa citazioni.
7. La conversazione non si salva; non chiedere mai dati personali.
8. Scrivi in un italiano vivo e naturale — la voce di una persona di cui questo è il paese d'origine, mai macchinale e mai sconfinando in un'altra lingua.`
      : `You are a courteous digital guide of the Griblje Village Museum (Bela krajina, Slovenia). Answer in ENGLISH.

YOU ARE GROUNDED STRICTLY IN THE DOSSIER BELOW — it is the museum's entire knowledge:
1. Answer only from the dossier. If the answer is not in the dossier, admit it plainly: "That is not (yet) in the museum's collection." and suggest the closest record by topic.
2. NEVER invent dates, names, numbers or quotes from villagers.
3. Respect each record's evidence status (DOCUMENTED, TRADITION, UNVERIFIED …) and mention it when it matters for the answer.
4. Whenever you mention a specific record, cite it at the end of your answer as [[slug]] (only real slugs from the dossier, 1–3 citations, each in double square brackets). If several records are mentioned, list them all. If none, add nothing.
5. Answers are short and warm (up to ~120 words), like a guide standing beside the picture — no headings, no markdown ornaments, no lists unless explicitly asked.
6. For testimonies and villagers' memories, direct visitors to the memory book (#knjiga) — the museum deliberately invents no quotes.
7. The conversation is not stored; never ask for personal data.
8. Write in living, natural English — a human voice of someone whose home village this is, never machine-like and never drifting into another language.`;

  // Zaključni spomin na jezik: modeli najmočneje upoštevajo zadnje vrstice
  // (recency bias) — dosje je v slovenščini ali angleščini, zato jezik
  // izrecno ponovimo na koncu.
  const closing =
    lang === "hr"
      ? "PONOVITEV PRAVIL: dosje je na slovenskom, ali tvoj odgovor mora biti napisan HRVATSKI (povijest, ne zgodovina; selo, ne vas; riječi hrvatski, ne slovenske)."
      : lang === "sl"
        ? "PONOVITEV PRAVIL: odgovori nujno v živi slovenščini."
        : lang === "de"
          ? "REGEL-ERINNERUNG: antworte ausschließlich in lebendigem Deutsch."
          : lang === "it"
            ? "PROMEMORIA DELLE REGOLE: rispondi solo in un italiano vivo e naturale."
            : "RULE REMINDER: answer in living English only.";

  return `${rules}

--- DOSJE ZBIRKE (edini vir resnice) ---
${dossier}
--- KONEC DOSJEJA ---
${closing}`;
}

/* --- Razčlenjevanje navedkov ------------------------------------------ */

const CITE_RE = /\[\[([a-z0-9-]+)\]\]/g;

export function parseCites(
  raw: string,
  exhibits: DossierExhibit[]
): { answer: string; cites: GuideCite[] } {
  const bySlug = new Map(exhibits.map((e) => [e.slug, e]));
  const cites: GuideCite[] = [];
  let answer = raw;

  for (const match of raw.matchAll(CITE_RE)) {
    const slug = match[1];
    const ex = bySlug.get(slug);
    if (ex && !cites.some((c) => c.slug === slug)) {
      cites.push({ slug, titleSi: ex.titleSi, titleEn: ex.titleEn });
    }
  }
  // Odstrani vse označbe (tudi neveljavne slug-e) iz prikazanega besedila.
  answer = answer.replace(CITE_RE, "").replace(/[ \t]+\n/g, "\n").trimEnd();

  return { answer, cites };
}

/* --- Klic modela ------------------------------------------------------- */

export type GuideAnswer = {
  answer: string;
  cites: GuideCite[];
  /** true, če je odgovor prišel iz predpomnilnika (ni šel h modelu). */
  cached: boolean;
};

export async function askGuide(
  lang: GuideLang,
  history: GuideMessage[]
): Promise<GuideAnswer> {
  providerTrail.length = 0;

  // Hitra pot: prvo vprašanje pogovora (brez zgodovine) ima morda že
  // predpomnjen odgovor — ne meče sredstev niti na bazo niti na kvoto.
  const firstQuestion =
    history.length === 1 && history[0].role === "user"
      ? history[0].content
      : null;
  const cacheKey = firstQuestion ? guideCacheKey(lang, firstQuestion) : null;
  if (cacheKey) {
    const cached = guideCacheGet(cacheKey);
    if (cached) {
      providerTrail.push("cache");
      return { answer: cached.answer, cites: cached.cites, cached: true };
    }
  }

  const { text, exhibits } = await getDossier(lang);

  // Zgodovino skrajšamo na zadnjih GUIDE_LIMITS.history sporočil —
  // starejša vprašanja ne nosijo več konteksta, dosje pa vedno ostane.
  const trimmed = history.slice(-GUIDE_LIMITS.history);
  const system = systemPrompt(lang, text);

  const raw = await askProviders(system, trimmed);
  const parsed = parseCites(raw, exhibits);
  // Prvo vprašanje in njegov odgovor shranimo za naslednjega obiskovalca.
  if (cacheKey) guideCacheSet(cacheKey, parsed.answer, parsed.cites);
  return { ...parsed, cached: false };
}

/**
 * Ponudniška veriga (prvi z veljavnim ključem zmore): OpenRouter
 * (brezplačni katalog, ključ sk-or-v1-…) → HuggingFace (hf_…) → z-ai SDK.
 * OpenAI-kompatibilni ponudniki (OpenRouter, HF) uporabljajo standardne
 * vloge („system“), z-ai pa sprejema sistemski poziv kot prvo sporočilo
 * vloge „assistant“.
 * OPOMBA: z-ai odjemalec se inicializira LENOBNO (globoko v rezervni
 * veji) — zgolj na Vercelu .z-ai-config ne obstaja, njegova napaka pa
 * ne sme ovirati zgornjih postaj verige.
 */
async function askProviders(
  system: string,
  trimmed: GuideMessage[]
): Promise<string> {
  let openRouterQuotaError: Error | null = null;
  if (isOpenRouterChatConfigured()) {
    providerTrail.push("openrouter");
    try {
      // 800 žetonov: odgovor ~120 besed + navedki [[slug]] na koncu —
      // pri 500 se je zgodbno bogati odgovor rezal sredi stavka.
      return await openRouterChatComplete(
        [
          { role: "system", content: system },
          ...trimmed,
        ],
        { maxTokens: 800 },
      );
    } catch (error) {
      // Dnevna meja brezplačne veje (~50 zahtev) ali zaseden ponudnik —
      // pademo na naslednjo postajo verige in razlog zabeležimo.
      const msg = error instanceof Error ? error.message : String(error);
      if (/dnevna kvota presežena/.test(msg)) {
        openRouterQuotaError = error instanceof Error ? error : new Error(msg);
      }
      console.warn(
        "Vodnik: OpenRouter ni uspel, nadaljevanje po verigi:",
        msg,
      );
    }
  }

  if (isHfChatConfigured()) {
    providerTrail.push("hf");
    try {
      return await hfChatComplete([
        { role: "system", content: system },
        ...trimmed,
      ]);
    } catch (error) {
      // HF kredit lahko občasno zmanjka ali je žeton napačen — takrat
      // pademo na obstoječi z-ai kanal in razlog zabeležimo v dnevnik.
      console.warn(
        "Vodnik: HuggingFace ni uspel, preklop na z-ai:",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const messages: { role: "assistant" | "user"; content: string }[] = [
    { role: "assistant", content: system },
    ...trimmed.map((m) => ({ role: m.role, content: m.content })),
  ];

  // z-ai odjemalec se ustvari šele TU (lenobno): na strežniških platformah
  // brez .z-ai-config njegova konstrukcija vrže napako — zgornji ponudniki
  // (OpenRouter/HF) je ne smejo čutiti.
  providerTrail.push("zai");
  try {
    const zai = await getZAI();

    // Ena ponovitev za prehodno omejitev zgornjega API-ja (429) —
    // kratka pavza, da val zahtev na isti račun mine.
    let lastError: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      try {
        const completion = await zai.chat.completions.create({
          messages,
          thinking: { type: "disabled" },
        });

        const raw = completion.choices[0]?.message?.content;
        if (!raw || !raw.trim()) {
          throw new Error("Model je vrnil prazen odgovor");
        }

        return raw;
      } catch (error) {
        lastError = error;
        const msg = error instanceof Error ? error.message : String(error);
        // Prehodna omejitev — poskusi še enkrat; vse ostalo takoj navzgor.
        if (!/429|rate|too many/i.test(msg)) throw error;
      }
    }
    throw lastError;
  } catch (error) {
    // Če je OpenRouter padel na dnevni kvoti in tudi z-ai ne zmore,
    // je za obiskovalca pomembnejše sporočilo o KVI (poskusite jutri)
    // kot tehnična napaka zadnje postaje.
    if (openRouterQuotaError) throw openRouterQuotaError;
    throw error;
  }
}
