"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Footprints,
  Link2,
  Route,
  Sparkles,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useVisited } from "@/lib/visit-tracker";
import { THEME_HUBS, getThemeHub } from "@/lib/theme-hubs";
import { ALL_WALKS, walkMinutes } from "@/lib/walks";
import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Tematska središča — vstopne »node« strani zbirke po vzoru nove
 * zbirke Rijksmuseuma (2024): uvod, zapisi teme, sprehodi, ki se je
 * dotaknejo, in sorodne teme. Rijksmuseum jih gradi iz linked data;
 * pri 30 zapisih jih kuriramo ročno.
 */
export function ThemeHubView({
  category,
  exhibits,
  onOpenExhibit,
  onOpenTheme,
  onNavigate,
  onStartWalk,
}: {
  category: ExhibitCategory | null;
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onOpenTheme: (category: ExhibitCategory | null) => void;
  onNavigate: (view: "zbirka" | "razpolozenje") => void;
  onStartWalk: (walkId: string, stopIndex: number) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();
  const { visited } = useVisited();
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");

  const hub = category ? getThemeHub(category) : undefined;

  const copyThemeLink = async () => {
    if (!category) return;
    const url = `${window.location.origin}/?tema=${category}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    window.setTimeout(() => setCopyState("idle"), 2600);
  };

  /* ----------------------------- Pristajalna stran ----------------------- */
  if (!category || !hub) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-primary">
            {t.themes.kicker}
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
            {t.themes.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{t.themes.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_HUBS.map((item, index) => {
            const inTheme = exhibits.filter((ex) => ex.category === item.category);
            const cover = inTheme[0];
            return (
              <motion.button
                key={item.category}
                type="button"
                onClick={() => onOpenTheme(item.category)}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={cover?.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt={t.categories[item.category]}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-4">
                    <Badge className="border-border/60 bg-background/85 text-foreground backdrop-blur-sm">
                      {t.themes.countLabel(inTheme.length)}
                    </Badge>
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-display text-xl font-semibold">
                    {t.categories[item.category]}
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {pick(lang, item.introSi, item.introEn)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                    {t.themes.explore}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Vstop v vodnik po razpoloženju (Art Explorer vzorec) */}
        <div className="mt-10 rounded-xl border border-primary/25 bg-primary/5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-semibold">
                {t.mood.nav}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.mood.subtitleShort}
              </p>
            </div>
            <Button className="min-h-11" onClick={() => onNavigate("razpolozenje")}>
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.mood.cta}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------- Hub teme --------------------------- */
  const inTheme = exhibits.filter((ex) => ex.category === hub.category);
  // Obiskani zapisi naprej (osebni »most viewed«), nato izpostavljeni, nazadnje kuratorski red.
  const ordered = [...inTheme].sort((a, b) => {
    const av = visited.has(a.slug) ? 0 : 1;
    const bv = visited.has(b.slug) ? 0 : 1;
    if (av !== bv) return av - bv;
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  const themeSlugs = new Set(inTheme.map((ex) => ex.slug));
  const touchingWalks = ALL_WALKS.map((walk) => ({
    walk,
    stops: walk.stops.filter((stop) => themeSlugs.has(stop.exhibitSlug)),
  })).filter((entry) => entry.stops.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Nazaj + deli */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          className="min-h-11"
          onClick={() => onOpenTheme(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.themes.backToThemes}
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={copyThemeLink}
          aria-label={t.themes.share}
        >
          <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
          {copyState === "ok" ? t.themes.shared : t.themes.share}
        </Button>
      </div>

      {/* Glava teme */}
      <div className="mt-6 max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {t.themes.kicker}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
          {t.categories[hub.category]}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {pick(lang, hub.introSi, hub.introEn)}
        </p>
      </div>

      {/* Zapisi teme */}
      <h2 className="font-display mt-12 text-2xl font-semibold sm:text-3xl">
        {t.themes.allInTheme}
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((exhibit, index) => (
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
              {visited.has(exhibit.slug) && (
                <span className="absolute right-3 top-3">
                  <Badge className="gap-1 border-primary/30 bg-background/85 text-primary backdrop-blur-sm">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">{t.collector.visitedSr}</span>
                  </Badge>
                </span>
              )}
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
              <h3 className="font-display text-xl font-semibold leading-snug">
                {es.title(exhibit)}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {es.summary(exhibit)}
              </p>
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

      {/* Sprehodi, ki se dotaknejo teme */}
      {touchingWalks.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {t.themes.walksAbout}
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {touchingWalks.map(({ walk, stops }) => (
              <li key={walk.id}>
                <div className="flex h-full flex-col gap-3 rounded-xl border border-border/70 bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Route className="h-4 w-4" aria-hidden="true" />
                      {pick(lang, walk.titleSi, walk.titleEn)}
                    </span>
                    <Badge variant="secondary">
                      {t.themes.walkStops(stops.length)}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {pick(lang, walk.descriptionSi, walk.descriptionEn)}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-auto min-h-11 self-start"
                    onClick={() => onStartWalk(walk.id, 0)}
                  >
                    <Footprints className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t.walks.start} · {t.walks.minutes(walkMinutes(walk.stops.length))}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Odkrij več — sorodne teme */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {t.themes.discoverMore}
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {hub.related.map((related) => {
            const relatedExhibits = exhibits
              .filter((ex) => ex.category === related.category)
              .slice(0, 3);
            return (
              <button
                key={related.category}
                type="button"
                onClick={() => onOpenTheme(related.category)}
                className="group rounded-xl border border-border/70 bg-card p-5 text-left transition-colors hover:border-primary/40"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t.themes.relatedTheme}
                </p>
                <p className="font-display mt-1.5 text-lg font-semibold">
                  {t.categories[related.category]}{" "}
                  <span aria-hidden="true" className="text-primary transition-transform group-hover:translate-x-0.5 inline-block">
                    →
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pick(lang, related.reasonSi, related.reasonEn)}
                </p>
                <div className="mt-4 flex gap-3">
                  {relatedExhibits.map((ex) => (
                    <span
                      key={ex.slug}
                      className="relative block h-20 w-28 overflow-hidden rounded-lg border border-border/60"
                    >
                      <Image
                        src={ex.image ?? "/images/authentic/hero-griblje.jpg"}
                        alt={es.title(ex)}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
