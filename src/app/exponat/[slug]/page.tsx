import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Hourglass,
  Landmark,
  MapPin,
  ShieldCheck,
  ShieldQuestion,
  Sparkles,
} from "lucide-react";

import { seedExhibits } from "@/lib/museum-content";
import { SITE_URL } from "@/lib/site";
import { WIKIDATA_SAMEAS } from "@/lib/wikidata";
import { IMAGE_DIMENSIONS } from "@/lib/image-dimensions";
import {
  museumJsonLd,
  collectionJsonLd,
  MUSEUM_ID,
  COLLECTION_ID,
} from "@/lib/site-jsonld";
import type { EvidenceStatus, ExhibitCategory, SourceType } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Muzejski zapis predmeta — /exponat/[slug].
 *
 * Strežniško renderirana stran vsakega zapisa zbirke: trajni naslov, ki ga
 * lahko indeksira iskalnik, citira katalog ali prebere koda QR na fizičnem
 * predmetu. Vzorec objektnih strani vodilnih muzejev (Rijksmuseum
 * Collection Online, DigitaltMuseum): vsebina zapisa, struktura dokazov
 * in povezava nazaj v živi muzej.
 *
 * Struktura sledi muzejski poštenosti projekta:
 *   KAJ VEMO (povzetek) → KAKO VEMO (zgodba) → VIR (register virov)
 *   → STATUS DOKAZA (stopnja zanesljivosti).
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
  availableAt: "Dostopno na",
  licence: "Licenca",
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
  availableAt: "Available at",
  licence: "Licence",
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
      canonical: `/exponat/${slug}`,
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

          {/* VIR — register virov zapisa */}
          <section aria-labelledby="viri" className="mt-10">
            <h2 id="viri" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {s.sources} ({ex.sources.length})
            </h2>
            <ol className="mt-4 space-y-3">
              {ex.sources.map((source, i) => (
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
                  {(isEn ? source.noteEn : source.noteSi) && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {isEn ? source.noteEn : source.noteSi}
                    </p>
                  )}
                </li>
              ))}
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
