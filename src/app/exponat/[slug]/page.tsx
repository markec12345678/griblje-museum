import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Camera,
  ChevronDown,
  ExternalLink,
  Hourglass,
  Landmark,
  MapPin,
  MessageSquareQuote,
  Network,
  Route,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";

import { seedExhibits } from "@/lib/museum-content";
import { sourceKeyOf, usedByOthers } from "@/lib/source-registry";
import { getBiography, type BiographyStage } from "@/lib/object-biographies";
import { relatedExhibits } from "@/lib/connections";
import { walkStopOf } from "@/lib/walks";
import { SITE_URL } from "@/lib/site";
import { WIKIDATA_SAMEAS } from "@/lib/wikidata";
import { IMAGE_DIMENSIONS } from "@/lib/image-dimensions";
import {
  museumJsonLd,
  collectionJsonLd,
  MUSEUM_ID,
  COLLECTION_ID,
} from "@/lib/site-jsonld";
import type { EvidenceStatus, ExhibitCategory, ExhibitDTO, SourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

/* --- Zbirka v obliki ExhibitDTO ------------------------------------------
 * Pravila sorodnosti (connections.ts) in članstvo v sprehodih (walks.ts)
 * berejo DTO obliko zapisa — isto pravilno gonilnik, kot ga živi muzej
 * (dialog zapisa). Seme je statično, zato pretvorba steče enkrat.
 * sort-order = vrstni red semena (MVG), kot povsod drugje. */
const COLLECTION_DTO: ExhibitDTO[] = seedExhibits.map((ex, index) => ({
  id: ex.slug,
  slug: ex.slug,
  museumNo: ex.museumNo ?? null,
  category: ex.category,
  titleSi: ex.titleSi,
  titleEn: ex.titleEn,
  periodSi: ex.periodSi,
  periodEn: ex.periodEn,
  summarySi: ex.summarySi,
  summaryEn: ex.summaryEn,
  storySi: ex.storySi,
  storyEn: ex.storyEn,
  evidenceStatus: ex.evidenceStatus,
  image: ex.image ?? null,
  imageCredit: ex.imageCredit ?? null,
  model3dUrl: ex.model3dUrl ?? null,
  model3dCredit: ex.model3dCredit ?? null,
  yearFrom: ex.yearFrom ?? null,
  yearTo: ex.yearTo ?? null,
  lat: ex.lat ?? null,
  lng: ex.lng ?? null,
  coordsApprox: ex.coordsApprox ?? false,
  featured: ex.featured ?? false,
  sortOrder: index,
  addedAt: ex.addedAt ?? null,
  sources: ex.sources.map((s) => ({
    id: `${ex.slug}:${s.key}`,
    sourceKey: sourceKeyOf(s.nameSi, s.url ?? null),
    nameSi: s.nameSi,
    nameEn: s.nameEn,
    sourceType: s.sourceType,
    license: s.license,
    url: s.url ?? null,
    noteSi: s.noteSi ?? null,
    noteEn: s.noteEn ?? null,
  })),
}));

/**
 * Muzejski zapis predmeta — /exponat/[slug].
 *
 * Strežniško renderirana stran vsakega zapisa zbirke: trajni naslov, ki ga
 * lahko indeksira iskalnik, citira katalog ali prebere koda QR na fizičnem
 * predmetu. Vzorec objektnih strani vodilnih muzejev (Rijksmuseum
 * Collection Online, DigitaltMuseum): vsebina zapisa, struktura dokazov
 * in povezava nazaj v živi muzej.
 *
 * Struktura sledi muzejski poštenosti projekta (progresivno razkrivanje
 * dokaza: obiskovalec → zainteresirani → raziskovalec):
 *   STATUS DOKAZA (stopnja zanesljivosti) → KAJ VEMO (povzetek)
 *   → KAKO VEMO (zgodba) → ŽIVLJENJE PREDMETA (trditvena plast: vsaka
 *   faza nosi status dokaza in vezani vir) → VIR (register virov).
 *
 * Vsebina živi v src/lib/museum-content.ts (isti vir resnice kot seme
 * baze); jezik strani je slovenščina (primarni), angleščina pa prek
 * /exponat/[slug]?lang=en. Interaktivni zapis (sprehodi, primerjava,
 * spomini, avdio) ostaja v aplikaciji na /?exhibit=[slug].
 */

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/* --- Prevodi strani (slovenščina je primarna) --------------------------- */

const SL = {
  museum: "Muzej vasi Griblje",
  collection: "Zbirka",
  home: "Domov",
  skipToContent: "Preskoči na vsebino",
  museumNoLabel: "Muzejska številka",
  inCollectionSince: "V zbirki od",
  whatWeKnow: "Kaj vemo",
  howWeKnow: "Kako vemo",
  sources: "Viri",
  evidenceStatus: "Status dokaza",
  citeRecord: "Citiraj zapis",
  openInMuseum: "Odpri v muzeju",
  openInMuseumHint:
    "Interaktivni zapis: slike, sprehodi, primerjava, spomini domačinov.",
  previous: "Prejšnji zapis",
  next: "Naslednji zapis",
  photocredit: "Fotografija",
  licenseNote: "Vsebina zapisa: CC BY-SA 4.0",
  openData: "Odprti podatki",
  footerTagline: "Digitalni muzej resnične vasi ob Kolpi",
  languageSwitch: "English",
  languageSwitchHref: "?lang=en",
  languageSwitchLang: "en",
  recordOf: "Zapis",
  viewSource: "oglej si vir",
  alsoCitedBy: "Naveden tudi v zapisih",
  availableAt: "Dostopno na",
  licence: "Licenca",
  relatedTitle: "Sorodni zapisi",
  relatedHint: "Povezave, ki jih nosijo skupna dejstva — isti vir, isto obdobje, bližina.",
  walkSectionTitle: "Zapis na sprehodu",
  stopOf: "Postaja",
  onTheWalk: "na sprehodu",
  walkNoteLabel: "Kuratorska opomba postaje",
  prevStop: "Prejšnja postaja",
  nextStop: "Naslednja postaja",
  takeWalk: "Zaženi sprehod v muzeju",
  takeWalkHint: "Voden ogled: vsaka postaja je zapis z avdiom in sledenjem napredka.",
  biographyTitle: "Življenje predmeta",
  biographyIntro:
    "Pot zapisa skozi čas — po vzoru Art Tracks (Carnegie Museum of Art): vsaka točka nosi vir in stopnjo zanesljivosti. Vrzeli so del zgodbe, ne sramota.",
  biographySourceLabel: "vir",
  biographyStages: {
    nastanek: "nastanek",
    zivljenje: "življenje",
    prica: "pričevanje",
    raziskava: "raziskava",
    digitalizacija: "digitalizacija",
    danes: "danes",
  },
  categories: {
    kraj: "Kraji",
    kolpa: "Kolpa",
    vojna: "Vojna in meja",
    narava: "Narava",
    gospodarstvo: "Delo in obrt",
    sege: "Šege in tradicija",
  },
  evidence: {
    DOCUMENTED: "dokumentirano",
    CORROBORATED: "preverjeno",
    TESTIMONY: "pričevanje",
    TRADITION: "tradicija",
    UNVERIFIED: "nepreverjeno",
    TO_COLLECT: "v zbiranju",
  },
  evidenceDesc: {
    DOCUMENTED: "Trditev sloni na arhivskem ali objavljenem dokumentiranem viru.",
    CORROBORATED: "Trditev potrjujejo vsaj dva neodvisna vira ali preverjena fotografija.",
    TESTIMONY: "Trditev izvira iz ustnega pričevanja priče in še ni arhivsko potrjena.",
    TRADITION: "Vsebina je del žive tradicije ali ljudskega izročila, ne pa arhivskega dejstva.",
    UNVERIFIED: "Podatek zaenkrat ni preverjen — javno objavljen izrecno kot tak.",
    TO_COLLECT: "Vsebina čaka na zbiranje pričevanj domačinov — prirejeno ni nič.",
  },
  sourceTypes: {
    arhiv: "Arhiv",
    fotografija: "Fotografija",
    objava: "Objava",
    "spletni-vir": "Spletni vir",
    pricevanje: "Pričevanje",
    zemljevid: "Zemljevid",
  },
} as const;

const EN = {
  museum: "Griblje Village Museum",
  collection: "Collection",
  home: "Home",
  skipToContent: "Skip to content",
  museumNoLabel: "Museum number",
  inCollectionSince: "In the collection since",
  whatWeKnow: "What we know",
  howWeKnow: "How we know it",
  sources: "Sources",
  evidenceStatus: "Evidence status",
  citeRecord: "Cite this record",
  openInMuseum: "Open in the museum",
  openInMuseumHint:
    "Interactive record: images, guided walks, comparison, villagers' memories.",
  previous: "Previous record",
  next: "Next record",
  photocredit: "Photograph",
  licenseNote: "Record content: CC BY-SA 4.0",
  openData: "Open data",
  footerTagline: "A digital museum of a real village on the Kolpa",
  languageSwitch: "Slovenščina",
  languageSwitchHref: "?lang=sl",
  languageSwitchLang: "sl",
  recordOf: "Record",
  viewSource: "view source",
  alsoCitedBy: "Also cited by",
  availableAt: "Available at",
  licence: "Licence",
  relatedTitle: "Related records",
  relatedHint: "Connections carried by shared facts — same source, same period, proximity.",
  walkSectionTitle: "Record on a guided walk",
  stopOf: "Stop",
  onTheWalk: "on the walk",
  walkNoteLabel: "Curatorial note for this stop",
  prevStop: "Previous stop",
  nextStop: "Next stop",
  takeWalk: "Take this walk in the museum",
  takeWalkHint: "A guided tour: every stop is a record, with audio and progress tracking.",
  biographyTitle: "The life of an object",
  biographyIntro:
    "The record's path through time — after Art Tracks (Carnegie Museum of Art): every station carries a source and an evidence level. Gaps are part of the story, not a shame.",
  biographySourceLabel: "source",
  biographyStages: {
    nastanek: "origin",
    zivljenje: "life",
    prica: "witness",
    raziskava: "research",
    digitalizacija: "digitisation",
    danes: "today",
  },
  categories: {
    kraj: "Places",
    kolpa: "The Kolpa",
    vojna: "War & border",
    narava: "Nature",
    gospodarstvo: "Work & craft",
    sege: "Customs & tradition",
  },
  evidence: {
    DOCUMENTED: "documented",
    CORROBORATED: "corroborated",
    TESTIMONY: "testimony",
    TRADITION: "tradition",
    UNVERIFIED: "unverified",
    TO_COLLECT: "to collect",
  },
  evidenceDesc: {
    DOCUMENTED: "The claim rests on an archival or published documented source.",
    CORROBORATED: "The claim is confirmed by at least two independent sources or a verified photograph.",
    TESTIMONY: "The claim originates from the oral testimony of a witness and is not yet archivally confirmed.",
    TRADITION: "The content is part of living tradition or folklore, not an archival fact.",
    UNVERIFIED: "The data is currently unverified — published explicitly as such.",
    TO_COLLECT: "Content awaits collection of villagers' testimonies — nothing is invented.",
  },
  sourceTypes: {
    arhiv: "Archive",
    fotografija: "Photograph",
    objava: "Publication",
    "spletni-vir": "Web source",
    pricevanje: "Testimony",
    zemljevid: "Map",
  },
} as const;

type Strings = typeof SL | typeof EN;

const isSl = (s: Strings): s is typeof SL => s === SL;

/* --- Vzorec za evidence oznako (enake barvne družine kot aplikacija) --- */

const EVIDENCE_STYLE: Record<EvidenceStatus, string> = {
  DOCUMENTED: "border-primary/30 bg-primary/10 text-primary",
  CORROBORATED: "border-chart-3/30 bg-chart-3/15 text-chart-3",
  TESTIMONY: "border-chart-4/40 bg-chart-4/15 text-chart-5",
  TRADITION: "border-accent/35 bg-accent/12 text-accent",
  UNVERIFIED: "border-border bg-muted text-muted-foreground",
  TO_COLLECT: "border-dashed border-muted-foreground/40 bg-muted text-muted-foreground",
};

const EVIDENCE_ICON: Record<EvidenceStatus, React.ComponentType<{ className?: string }>> = {
  DOCUMENTED: ShieldCheck,
  CORROBORATED: ShieldCheck,
  TESTIMONY: BookOpen,
  TRADITION: Sparkles,
  UNVERIFIED: ShieldQuestion,
  TO_COLLECT: Hourglass,
};

/* --- Življenje predmeta (trditvena plast) ---------------------------------
 * Isti vir podatkov in isti vzorec ikon kot komponenta v živem muzeju
 * (object-biography.tsx): stopnje življenja, črtkana povezava za faze
 * z nižjo zanesljivostjo (vidna negotovost, ne skrita). */

const STAGE_ICONS: Record<BiographyStage, React.ComponentType<{ className?: string }>> = {
  nastanek: Sprout,
  zivljenje: Users,
  prica: MessageSquareQuote,
  raziskava: Archive,
  digitalizacija: Camera,
  danes: Landmark,
};

/** Faze z nižjo stopnjo zanesljivosti dobijo črtkano povezavo (vidna negotovost). */
const UNCERTAIN = new Set<EvidenceStatus>(["TESTIMONY", "TRADITION", "UNVERIFIED", "TO_COLLECT"]);

/** Število faz s slovenščino dvojino/pomanjševalniki (kot v aplikaciji). */
function phaseCountLabel(n: number, s: Strings): string {
  if (isSl(s)) {
    return n === 1
      ? "1 postaja življenja"
      : n === 2
        ? "2 postaji življenja"
        : n <= 4
          ? `${n} postaje življenja`
          : `${n} postaj življenja`;
  }
  return n === 1 ? "1 station of its life" : n === 2 ? "2 stations of its life" : `${n} stations of its life`;
}

/** Datum vključitve v zbirbo (kuratorski podatek, po vzoru registrert). */
function registeredLabel(ex: (typeof seedExhibits)[number], s: Strings) {
  if (!ex.addedAt) return null;
  const d = new Date(ex.addedAt);
  if (Number.isNaN(d.getTime())) return null;
  const fmt = new Intl.DateTimeFormat(isSl(s) ? "sl-SI" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return fmt.format(d);
}

/* --- Metadata ----------------------------------------------------------- */

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;
  const ex = seedExhibits.find((e) => e.slug === slug);
  if (!ex) return {};

  const isEn = langParam === "en";
  const title = isEn ? ex.titleEn : ex.titleSi;
  const description = isEn ? ex.summaryEn : ex.summarySi;
  const image = ex.image ?? "/images/authentic/hero-griblje.jpg";
  const dims = IMAGE_DIMENSIONS[image] ?? { width: 1600, height: 1067 };

  return {
    title,
    description,
    alternates: {
      // Samo-referenčni kanonični naslov TISTE jezikovne različice, ki je
      // odprta: slovenska stran je kanon zapisa, angleška (?lang=en) pa
      // kanon svoje različice — sicer bi hreflang cilj na ne-kanonični URL
      // iskalnik tiho ignoriral (odprta točka Faze 2, §13B).
      canonical: isEn ? `/exponat/${slug}?lang=en` : `/exponat/${slug}`,
      languages: {
        sl: `/exponat/${slug}`,
        en: `/exponat/${slug}?lang=en`,
        "x-default": `/exponat/${slug}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} — ${isEn ? EN.museum : SL.museum}`,
      description,
      type: "article",
      url: `/exponat/${slug}`,
      siteName: isEn ? EN.museum : SL.museum,
      locale: isEn ? "en_US" : "sl_SI",
      images: [
        {
          url: image,
          width: dims.width,
          height: dims.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${isEn ? EN.museum : SL.museum}`,
      description,
      images: [image],
    },
  };
}

/* --- JSON-LD ------------------------------------------------------------- */

function buildJsonLd(slug: string, isEn: boolean) {
  const ex = seedExhibits.find((e) => e.slug === slug);
  if (!ex) return null;
  const s = isEn ? EN : SL;
  const title = isEn ? ex.titleEn : ex.titleSi;
  const summary = isEn ? ex.summaryEn : ex.summarySi;
  const story = isEn ? ex.storyEn : ex.storySi;
  const image = ex.image ?? "/images/authentic/hero-griblje.jpg";
  const canonical = `${SITE_URL}/exponat/${slug}`;
  const sameAs = WIKIDATA_SAMEAS[slug]
    ? [`https://www.wikidata.org/wiki/${WIKIDATA_SAMEAS[slug]}`]
    : undefined;

  const article: Record<string, unknown> = {
    "@type": "Article",
    "@id": `${canonical}#zapis`,
    headline: title,
    description: summary,
    articleBody: story,
    inLanguage: isEn ? "en" : "sl",
    url: canonical,
    mainEntityOfPage: { "@id": canonical },
    image: [`${SITE_URL}${image}`],
    thumbnailUrl: `${SITE_URL}${image}`,
    isPartOf: { "@id": COLLECTION_ID },
    author: { "@id": MUSEUM_ID },
    publisher: { "@id": MUSEUM_ID },
    license: "https://creativecommons.org/licenses/by-sa/4.0/",
    identifier: [
      ...(ex.museumNo
        ? [
            {
              "@type": "PropertyValue",
              name: s.museumNoLabel,
              value: ex.museumNo,
            },
          ]
        : []),
      { "@type": "PropertyValue", name: "slug", value: slug },
    ],
    ...(ex.addedAt ? { datePublished: ex.addedAt } : {}),
    ...(sameAs ? { sameAs } : {}),
    ...(ex.lat != null && ex.lng != null
      ? {
          contentLocation: {
            "@type": "Place",
            name: "Griblje",
            geo: {
              "@type": "GeoCoordinates",
              latitude: ex.lat,
              longitude: ex.lng,
            },
          },
        }
      : {}),
    ...(ex.yearFrom != null ? { temporal: isEn ? ex.periodEn : ex.periodSi } : {}),
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: s.home, item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: s.collection,
        item: `${SITE_URL}/#zbirka`,
      },
      { "@type": "ListItem", position: 3, name: title, item: canonical },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [museumJsonLd(), collectionJsonLd(), article, breadcrumb],
  };
}

/* --- Stran --------------------------------------------------------------- */

export default async function ExhibitRecordPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lang: langParam } = await searchParams;

  const index = seedExhibits.findIndex((e) => e.slug === slug);
  if (index < 0) notFound();

  const ex = seedExhibits[index]!;
  const isEn = langParam === "en";
  const s = isEn ? EN : SL;
  const title = isEn ? ex.titleEn : ex.titleSi;
  const summary = isEn ? ex.summaryEn : ex.summarySi;
  const story = (isEn ? ex.storyEn : ex.storySi).split("\n\n").filter(Boolean);
  const image = ex.image ?? "/images/authentic/hero-griblje.jpg";
  const dims = IMAGE_DIMENSIONS[image] ?? { width: 1600, height: 1067 };
  const EvidenceIcon = EVIDENCE_ICON[ex.evidenceStatus];
  const registered = registeredLabel(ex, s);

  const prev = index > 0 ? seedExhibits[index - 1] : null;
  const next = index < seedExhibits.length - 1 ? seedExhibits[index + 1] : null;

  /* Raziskovanje z zapisa v zapis — enaka pravila kot živi muzej:
   * sorodnost (povezave z razlogom) + članstvo v kuriranem sprehodu.
   * Tudi obiskovalec s kodo QR ali iz iskalnika ima pot naprej —
   * ne samo prejšnji/naslednji po inventarni številki.
   * Limit 5 (ne 3 kot v dialogu): stran nima menijev niti iskanja,
   * test »one object → five more« pa mora zadoščiti iz same strani. */
  const dto = COLLECTION_DTO[index]!;
  const related = relatedExhibits(dto, COLLECTION_DTO, 5);

  /* Trditvena plast (§7 raziskovalcev nivo): Življenje predmeta — isti
   * vir podatkov kot dialog (object-biographies.ts). sourceIndex kaže
   * v register virov TEGA zapisa (ex.sources, enak vrstni red kot
   * sekcija VIRI zgoraj). Strežniško upodobljeno v <details>: vsebina
   * je v HTMLju (indeksabilna, dostopna brez JS), odprta na klik. */
  const bio = getBiography(slug);
  const walkInfo = walkStopOf(slug);
  const walkStop = walkInfo ? walkInfo.walk.stops[walkInfo.index]! : null;
  const prevStopEx =
    walkInfo && walkInfo.index > 0
      ? seedExhibits.find((e) => e.slug === walkInfo.walk.stops[walkInfo.index - 1]!.exhibitSlug) ?? null
      : null;
  const nextStopEx =
    walkInfo && walkInfo.index < walkInfo.walk.stops.length - 1
      ? seedExhibits.find((e) => e.slug === walkInfo.walk.stops[walkInfo.index + 1]!.exhibitSlug) ?? null
      : null;

  const jsonLd = buildJsonLd(slug, isEn);

  return (
    <div className="exponat-print-page flex min-h-screen flex-col bg-background text-foreground">
      {jsonLd && (
        <script
          type="application/ld+json"
          // Zapora </script> v vsebini: < pobegnjen kot \u003c (standardna
          // obramba pri vdelavi JSON-LD v HTML).
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}

      <a
        href="#zapis"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {s.skipToContent}
      </a>

      {/* Glava strani: identiteta muzeja + jezikovno stikalo */}
      <header className="border-b bg-background/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a
            href="/"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold hover:text-primary"
          >
            <Landmark className="h-5 w-5 text-primary" aria-hidden="true" />
            {s.museum}
          </a>
          <a
            href={s.languageSwitchHref}
            hrefLang={s.languageSwitchLang}
            lang={s.languageSwitchLang}
            className="inline-flex min-h-11 items-center rounded-md border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {s.languageSwitch}
          </a>
        </div>
      </header>

      {/* Drobtinasta navigacija */}
      <nav aria-label={s.collection} className="border-b bg-muted/40">
        <ol className="mx-auto flex max-w-3xl flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-muted-foreground sm:px-6">
          <li>
            <a href="/" className="inline-flex min-h-11 items-center hover:text-primary hover:underline">
              {s.home}
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a href="/#zbirka" className="inline-flex min-h-11 items-center hover:text-primary hover:underline">
              {s.collection}
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-foreground">
            {title}
          </li>
        </ol>
      </nav>

      <main id="zapis" className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
          {/* Glava zapisa: trajna identiteta */}
          <header>
            <p className="flex flex-wrap items-center gap-2 text-xs">
              {ex.museumNo && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                  {ex.museumNo}
                </span>
              )}
              <span className="rounded-full border bg-muted px-2.5 py-1 text-muted-foreground">
                {s.categories[ex.category]}
              </span>
              <span className="rounded-full border bg-muted px-2.5 py-1 text-muted-foreground">
                {isEn ? ex.periodEn : ex.periodSi}
              </span>
              {ex.lat != null && ex.lng != null && (
                <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {ex.coordsApprox ? "≈ Griblje" : "Griblje"}
                </span>
              )}
            </p>

            <h1 className="font-display mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              {title}
            </h1>

            {registered && (
              <p className="mt-3 text-sm text-muted-foreground">
                {s.inCollectionSince} {registered}
              </p>
            )}
          </header>

          {/* STATUS DOKAZA — najavljen takoj za identiteto zapisa */}
          <section aria-labelledby="evd" className="mt-8">
            <h2 id="evd" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.evidenceStatus}
            </h2>
            <p className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${EVIDENCE_STYLE[ex.evidenceStatus]}`}
              >
                <EvidenceIcon className="h-4 w-4" aria-hidden="true" />
                {s.evidence[ex.evidenceStatus]}
              </span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {s.evidenceDesc[ex.evidenceStatus]}
            </p>
          </section>

          {/* KAJ VEMO */}
          <section aria-labelledby="kaj" className="mt-10">
            <h2 id="kaj" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.whatWeKnow}
            </h2>
            <p className="mt-3 border-l-4 border-primary/60 pl-4 text-lg leading-relaxed">
              {summary}
            </p>
          </section>

          {/* Fotografija zapisa */}
          <figure className="mt-10">
            <Image
              src={image}
              alt={title}
              width={dims.width}
              height={dims.height}
              priority
              className="h-auto w-full rounded-lg border object-contain"
              sizes="(min-width: 768px) 768px, 100vw"
            />
            {ex.imageCredit && (
              <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {ex.imageCredit}
              </figcaption>
            )}
          </figure>

          {/* KAKO VEMO */}
          <section aria-labelledby="kako" className="mt-10">
            <h2 id="kako" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.howWeKnow}
            </h2>
            <div className="mt-4 space-y-5 text-base leading-relaxed">
              {story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* ŽIVLJENJE PREDMETA — trditvena plast: pot zapisa skozi čas,
              vsaka faza nosi status dokaza in vezani vir. Raziskovalcev
              nivo progresivnega razkrivanja (native <details>: tipkovnica,
              brez JS, vsebina v strežniškem HTMLju). */}
          {bio && (
            <details className="group mt-10 rounded-lg border border-border/70 bg-card">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <span>
                  <h2 id="zivljenje" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.biographyTitle}
                  </h2>
                  <span className="mt-1 block text-sm text-foreground/80">
                    {phaseCountLabel(bio.phases.length, s)}
                  </span>
                </span>
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="border-t border-border/60 p-4">
                <p className="mb-5 text-xs italic leading-relaxed text-muted-foreground">
                  {s.biographyIntro}
                </p>
                <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
                  {bio.phases.map((phase, i) => {
                    const StageIcon = STAGE_ICONS[phase.stage];
                    const source =
                      phase.sourceIndex != null ? ex.sources[phase.sourceIndex] : undefined;
                    const uncertain = UNCERTAIN.has(phase.evidenceStatus);
                    const PhaseEvidenceIcon = EVIDENCE_ICON[phase.evidenceStatus];
                    return (
                      <li key={`${phase.stage}-${i}`} className="relative pl-11">
                        {/* Vozel na črti */}
                        <span
                          className={`absolute left-0 top-0.5 flex size-8 items-center justify-center rounded-full border bg-background ${
                            uncertain
                              ? "border-dashed border-muted-foreground/50 text-muted-foreground"
                              : "border-primary/40 text-primary"
                          }`}
                          aria-hidden="true"
                        >
                          <StageIcon className="h-4 w-4" />
                        </span>

                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-display text-sm font-semibold">
                            {isEn ? phase.yearLabelEn : phase.yearLabelSi}
                          </span>
                          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                            {s.biographyStages[phase.stage]}
                          </span>
                        </div>

                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                          {isEn ? phase.textEn : phase.textSi}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${EVIDENCE_STYLE[phase.evidenceStatus]}`}
                          >
                            <PhaseEvidenceIcon className="h-3.5 w-3.5" aria-hidden="true" />
                            {s.evidence[phase.evidenceStatus]}
                          </span>
                          {source && (
                            <span className="inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground">
                              <span aria-hidden="true">—</span>
                              {source.url ? (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 underline decoration-border underline-offset-2 hover:text-foreground"
                                >
                                  <span className="sr-only">{s.biographySourceLabel}: </span>
                                  {isEn ? source.nameEn : source.nameSi}
                                  <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                                </a>
                              ) : (
                                <span className="italic">
                                  <span className="sr-only">{s.biographySourceLabel}: </span>
                                  {isEn ? source.nameEn : source.nameSi}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </details>
          )}

          {/* VIR — register virov zapisa */}
          <section aria-labelledby="viri" className="mt-10">
            <h2 id="viri" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.sources} ({ex.sources.length})
            </h2>
            <ol className="mt-4 space-y-3">
              {ex.sources.map((source, i) => {
                /* SOURCE → EXHIBITS: drugi zapisi, ki citirajo ISTI vir (isti
                 * dokument po registru virov) — referenčna povezava, ne graf. */
                const alsoCitedBy = usedByOthers(ex.slug, source.nameSi, source.url ?? null);
                return (
                  <li key={source.key} className="rounded-lg border bg-card p-4 text-sm">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {i + 1}. {isEn ? source.nameEn : source.nameSi}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {s.sourceTypes[source.sourceType]}
                      </span>
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {source.license}
                      {source.url && (
                        <>
                          {" · "}
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary underline underline-offset-2"
                          >
                            {s.viewSource}
                          </a>
                        </>
                      )}
                    </p>
                    {alsoCitedBy.length > 0 && (
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3 w-3" aria-hidden="true" />
                          {s.alsoCitedBy}:
                        </span>
                        {alsoCitedBy.map((o, j) => (
                          <span key={o.slug} className="inline-flex items-center gap-1.5">
                            {j > 0 && <span aria-hidden="true">·</span>}
                            <a
                              href={`/exponat/${o.slug}`}
                              className="font-mono font-medium text-primary underline underline-offset-2"
                              title={isEn ? o.titleEn : o.titleSi}
                              aria-label={`${o.museumNo} — ${isEn ? o.titleEn : o.titleSi}`}
                            >
                              {o.museumNo}
                            </a>
                          </span>
                        ))}
                      </p>
                    )}
                    {(isEn ? source.noteEn : source.noteSi) && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {isEn ? source.noteEn : source.noteSi}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Citat zapisa — trajna identiteta v citatu */}
          <section aria-labelledby="citiraj" className="mt-10">
            <h2 id="citiraj" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.citeRecord}
            </h2>
            <p className="mt-3 rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground">
              {s.museum} (2026). „{title}“. {s.recordOf}{" "}
              {ex.museumNo ? `${ex.museumNo} · ${ex.slug}` : ex.slug}. {s.availableAt}:{" "}
              {SITE_URL}/exponat/{ex.slug}. {s.licence} CC BY-SA 4.0.
            </p>
          </section>

          {/* Nazaj v živi muzej */}
          <section aria-labelledby="odpri" className="mt-10 print:hidden">
            <h2 id="odpri" className="sr-only">
              {s.openInMuseum}
            </h2>
            <a
              href={`/?exhibit=${ex.slug}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {s.openInMuseum}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="mt-2 text-xs text-muted-foreground">{s.openInMuseumHint}</p>
          </section>

          {/* ZAPIS NA SPREHODU — kuratorska zgodba, ki nosi ta zapis.
              Vsak zapis je postaja natanko enega od 5 tematskih sprehodov;
              opomba postaje je dodatna plast zgodbe, sosedi po sprehodu
              pa kuratorski vrstni red (ne inventarni). */}
          {walkInfo && walkStop && (
            <section aria-labelledby="sprehod" className="mt-10 print:hidden">
              <h2
                id="sprehod"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {s.walkSectionTitle}
              </h2>
              <div className="mt-4 rounded-lg border bg-card p-4">
                <p className="flex flex-wrap items-center gap-2">
                  <Route className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    {isEn ? walkInfo.walk.titleEn : walkInfo.walk.titleSi}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {s.stopOf} {walkInfo.index + 1}/{walkInfo.walk.stops.length} · {s.onTheWalk}
                  </span>
                </p>
                <p className="mt-3 border-l-4 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="sr-only">{s.walkNoteLabel}: </span>
                  {isEn ? walkStop.noteEn : walkStop.noteSi}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {prevStopEx ? (
                    <a
                      href={`/exponat/${prevStopEx.slug}`}
                      className="group inline-flex min-h-11 items-start gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40"
                    >
                      <ArrowLeft
                        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                          {s.prevStop}
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          {prevStopEx.museumNo ? `${prevStopEx.museumNo} · ` : ""}
                          {isEn ? prevStopEx.titleEn : prevStopEx.titleSi}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {nextStopEx && (
                    <a
                      href={`/exponat/${nextStopEx.slug}`}
                      className="group inline-flex min-h-11 items-start justify-end gap-3 rounded-lg border p-3 text-right transition-colors hover:border-primary/40 sm:col-start-2"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                          {s.nextStop}
                        </span>
                        <span className="mt-1 block text-sm font-medium">
                          {nextStopEx.museumNo ? `${nextStopEx.museumNo} · ` : ""}
                          {isEn ? nextStopEx.titleEn : nextStopEx.titleSi}
                        </span>
                      </span>
                      <ArrowRight
                        className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>
                <a
                  href={`/?walk=${walkInfo.walk.id}&stop=${walkInfo.index + 1}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  {s.takeWalk}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.takeWalkHint}</p>
              </div>
            </section>
          )}

          {/* SORODNI ZAPISI — povezave, ki jih nosijo skupna dejstva
              ( isti vir, isto obdobje, bližina, tema, kuratorska vez).
              Enaka pravila sorodnosti kot v živem muzeju (connections.ts). */}
          {related.length > 0 && (
            <section aria-labelledby="sorodni" className="mt-10 print:hidden">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2
                  id="sorodni"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {s.relatedTitle}
                </h2>
                <span className="text-xs text-muted-foreground">{s.relatedHint}</span>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {related.map((rel) => (
                  <li key={rel.exhibit.slug}>
                    <a
                      href={`/exponat/${rel.exhibit.slug}`}
                      className="group flex h-full min-h-11 flex-col gap-2 rounded-lg border p-4 transition-colors hover:border-primary/40"
                    >
                      <span className="text-xs font-semibold text-primary">
                        {rel.exhibit.museumNo}
                      </span>
                      <span className="text-sm font-semibold leading-snug">
                        {isEn ? rel.exhibit.titleEn : rel.exhibit.titleSi}
                      </span>
                      <span className="mt-auto flex flex-wrap gap-1">
                        {rel.connections.slice(0, 2).map((conn) => (
                          <span
                            key={conn.kind}
                            className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {isEn ? conn.labelEn : conn.labelSi}
                          </span>
                        ))}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Sosednja zapisa — usmerjanje naprej (tudi fizičnemu obiskovalcu) */}
          <nav
            aria-label={s.collection}
            className="mt-12 grid gap-4 border-t pt-8 sm:grid-cols-2 print:hidden"
          >
            {prev ? (
              <a
                href={`/exponat/${prev.slug}`}
                className="group inline-flex min-h-11 items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/40"
              >
                <ArrowLeft
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    {s.previous}
                  </span>
                  <span className="mt-1 block text-sm font-medium">
                    {prev.museumNo ? `${prev.museumNo} · ` : ""}
                    {isEn ? prev.titleEn : prev.titleSi}
                  </span>
                </span>
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
            {next && (
              <a
                href={`/exponat/${next.slug}`}
                className="group inline-flex min-h-11 items-start justify-end gap-3 rounded-lg border p-4 text-right transition-colors hover:border-primary/40 sm:col-start-2"
              >
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    {s.next}
                  </span>
                  <span className="mt-1 block text-sm font-medium">
                    {next.museumNo ? `${next.museumNo} · ` : ""}
                    {isEn ? next.titleEn : next.titleSi}
                  </span>
                </span>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary"
                  aria-hidden="true"
                />
              </a>
            )}
          </nav>
        </article>
      </main>

      {/* Noga: trajna identiteta in odprtost muzeja */}
      <footer className="mt-auto border-t bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 py-8 text-xs leading-relaxed text-muted-foreground sm:px-6">
          <p className="font-semibold text-foreground">{s.museum}</p>
          <p>{s.footerTagline}</p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{s.licenseNote}</span>
            <span aria-hidden="true">·</span>
            <a href="/api/opendata" className="font-medium text-primary underline underline-offset-2">
              {s.openData}
            </a>
            <span aria-hidden="true">·</span>
            <a href="/api/iiif" className="font-medium text-primary underline underline-offset-2">
              IIIF
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
