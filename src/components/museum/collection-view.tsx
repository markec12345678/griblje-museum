"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock3, Footprints, Network, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { normalize } from "@/lib/normalize";
import { useVisited } from "@/lib/visit-tracker";
import { isForKids, readingMinutes } from "@/lib/audience";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { CollectorProgress } from "@/components/museum/collector-progress";
import { THEME_HUBS } from "@/lib/theme-hubs";
import type { ExhibitCategory, ExhibitDTO, EvidenceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

const CATEGORY_ORDER: ExhibitCategory[] = [
  "kraj",
  "kolpa",
  "vojna",
  "narava",
  "gospodarstvo",
  "sege",
];

const EVIDENCE_ORDER: EvidenceStatus[] = [
  "DOCUMENTED",
  "CORROBORATED",
  "TRADITION",
  "TESTIMONY",
  "UNVERIFIED",
  "TO_COLLECT",
];

/** Okno oznake »novo v zbirki«: 60 dni od kuriranega datuma vključitve
 *  (po vzoru DigitaltMuseum „New content: 7/30 days“ — prilagojeno ritmu
 *  vaškega muzeja, kjer zapisi prihajajo po raziskovalnih akcijah). */
const NEW_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

function isRecentAddition(exhibit: ExhibitDTO): boolean {
  if (!exhibit.addedAt) return false;
  return Date.now() - new Date(exhibit.addedAt).getTime() < NEW_WINDOW_MS;
}

export function CollectionView({
  exhibits,
  onOpenExhibit,
  onOpenTheme,
  onOpenConnect,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO, focusView?: "karta") => void;
  onOpenTheme: (category: ExhibitCategory | null) => void;
  onOpenConnect: (pair: [string, string] | null) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();
  const { visited } = useVisited();

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<ExhibitCategory | "vse">("vse");
  const [evidence, setEvidence] = React.useState<EvidenceStatus | "vse">("vse");
  const [newOnly, setNewOnly] = React.useState(false);

  const hasNewRecords = React.useMemo(
    () => exhibits.some(isRecentAddition),
    [exhibits]
  );

  const filtered = React.useMemo(() => {
    // Enaka normalizacija kot strežniško iskanje (src/lib/normalize.ts):
    // filter je neobčutljiv na diakritike, da "crnomelj" najde "Črnomelj".
    const needle = normalize(query);
    return exhibits.filter((ex) => {
      const matchesCategory = category === "vse" || ex.category === category;
      const matchesEvidence = evidence === "vse" || ex.evidenceStatus === evidence;
      const matchesNew = !newOnly || isRecentAddition(ex);
      const haystack = normalize(
        [
          ex.titleSi,
          ex.titleEn,
          ex.summarySi,
          ex.summaryEn,
          ex.storySi,
          ex.storyEn,
        ].join(" ")
      );
      const matchesQuery = !needle || haystack.includes(needle);
      return matchesCategory && matchesEvidence && matchesNew && matchesQuery;
    });
  }, [exhibits, query, category, evidence, newOnly]);

  const hasFilters =
    query !== "" || category !== "vse" || evidence !== "vse" || newOnly;

  const reset = () => {
    setQuery("");
    setCategory("vse");
    setEvidence("vse");
    setNewOnly(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.collection.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.collection.subtitle}</p>
      </div>

      {/* Tematska središča — vstopne točke po vzoru Rijksmuseumovih node strani */}
      <section aria-labelledby="tematska-sredisca" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="tematska-sredisca"
            className="font-display inline-flex items-center gap-2 text-xl font-semibold"
          >
            {t.themes.explore}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => onOpenConnect(null)}
          >
            <Network className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.connect.openTool}
          </Button>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {THEME_HUBS.map((hub) => {
            const cover = exhibits.find((ex) => ex.category === hub.category);
            const count = exhibits.filter((ex) => ex.category === hub.category).length;
            return (
              <li key={hub.category}>
                <button
                  type="button"
                  onClick={() => onOpenTheme(hub.category)}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <Image
                    src={cover?.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt={t.categories[hub.category]}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"
                  />
                  <span className="absolute inset-x-2.5 bottom-2 flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-foreground drop-shadow-sm">
                      {t.categories[hub.category]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t.themes.countLabel(count)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Zbiralec zapisov — napredek obiska */}
      <div className="mt-8">
        <CollectorProgress total={exhibits.length} />
      </div>

      {/* Nadzorna vrstica */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.collection.searchPlaceholder}
            aria-label={t.collection.searchPlaceholder}
            className="h-12 pl-10 text-base"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {t.collection.evidenceFilter}:
          </span>
          <Select
            value={evidence}
            onValueChange={(value) => setEvidence(value as EvidenceStatus | "vse")}
          >
            <SelectTrigger
              className="h-12 w-full min-w-44 text-base lg:w-52"
              aria-label={t.collection.evidenceFilter}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vse">{t.collection.allEvidence}</SelectItem>
              {EVIDENCE_ORDER.map((status) => (
                <SelectItem key={status} value={status}>
                  {t.evidence[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kategorije */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.common.category}>
        <button
          type="button"
          onClick={() => setCategory("vse")}
          aria-pressed={category === "vse"}
          className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
            category === "vse"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground/80 hover:border-primary/40"
          }`}
        >
          {t.collection.allCategories}
        </button>
        {CATEGORY_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(category === key ? "vse" : key)}
            aria-pressed={category === key}
            className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
              category === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:border-primary/40"
            }`}
          >
            {t.categories[key]}
          </button>
        ))}
        {hasNewRecords && (
          <button
            type="button"
            onClick={() => setNewOnly((value) => !value)}
            aria-pressed={newOnly}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              newOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-primary/5 text-primary hover:border-primary/60"
            }`}
          >
            <Sparkles className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.collection.newOnly}
          </button>
        )}
      </div>

      {/* Števec + počišči */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t.collection.count(filtered.length)}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="min-h-11" onClick={reset}>
            <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.collection.resetFilters}
          </Button>
        )}
      </div>

      {/* Mreža zapisov */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">{t.collection.empty}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exhibit, index) => (
            <motion.button
              key={exhibit.slug}
              type="button"
              onClick={() => onOpenExhibit(exhibit)}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                  alt={es.title(exhibit)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3">
                  <Badge className="border-border/60 bg-background/85 text-foreground backdrop-blur-sm">
                    {t.categories[exhibit.category]}
                  </Badge>
                </span>
                <span className="absolute right-3 top-3 flex items-center gap-1.5">
                  {isRecentAddition(exhibit) && (
                    <Badge className="gap-1 border-primary/30 bg-primary text-primary-foreground shadow-sm">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{t.collection.newBadgeSr}</span>
                      {t.collection.newBadge}
                    </Badge>
                  )}
                  {visited.has(exhibit.slug) && (
                    <Badge className="gap-1 border-primary/30 bg-background/85 text-primary backdrop-blur-sm">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">{t.collector.visitedSr}</span>
                    </Badge>
                  )}
                </span>
                {exhibit.imageCredit && (
                  <p className="absolute bottom-2 right-3 max-w-[75%] truncate text-right text-[10px] leading-tight text-white/80 drop-shadow-sm">
                    {exhibit.imageCredit}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {es.period(exhibit)}
                  </span>
                  <EvidenceBadge status={exhibit.evidenceStatus} />
                </div>
                <h2 className="font-display text-xl font-semibold leading-snug">
                  {es.title(exhibit)}
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {es.summary(exhibit)}
                </p>
                {/* Oznake občinstva (vzorec MoMA: komu in koliko časa je zapis namenjen) */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                  <span
                    className="inline-flex items-center gap-1"
                    title={t.audience.minutesSr}
                  >
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span className="sr-only">{t.audience.minutesSr}: </span>
                    <span aria-hidden="true">≈ {readingMinutes(exhibit)} min</span>
                  </span>
                  {isForKids(exhibit.slug) && (
                    <span
                      title={t.audience.forKidsTitle}
                      className="inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 font-medium text-accent"
                    >
                      <Footprints className="h-3 w-3" aria-hidden="true" />
                      {t.audience.forKids}
                    </span>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  {t.collection.openRecord}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
