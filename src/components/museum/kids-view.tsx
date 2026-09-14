"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Footprints,
  Gamepad2,
  GraduationCap,
  Printer,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { FAMILY_WALK, resolveWalkStops, walkMinutes } from "@/lib/walks";
import { printWorksheet } from "@/lib/worksheet";
import { CollectorProgress } from "@/components/museum/collector-progress";
import type { ExhibitDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";
import { Button } from "@/components/ui/button";

/**
 * Mali raziskovalci — vstopna točka muzeja za otroke in družine.
 * Vzorec: družinski vodnik Van Goghovega muzeja (različica 6–12 let,
 * igriva pot z nalogami) in Petite Galerie Louvra (otroški vpogled v
 * odraslo zbirko): ena kurirana pot, ena uganka, en list za tisk —
 * brez posebne vsebine, ki bi si izmišljevala dejstva.
 */
export function KidsView({
  exhibits,
  onNavigate,
  onStartWalk,
}: {
  exhibits: ExhibitDTO[];
  onNavigate: (view: MuseumView) => void;
  onStartWalk: (walkId: string, stopIndex: number) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const stops = React.useMemo(
    () => resolveWalkStops(FAMILY_WALK, exhibits),
    [exhibits]
  );

  const goQuiz = () => {
    onNavigate("domov");
    // Domača stran se prikaže asinhrono (AnimatePresence) — dogodek
    // odpošljemo večkrat, dokler ga HomeView ne more ujeti; druge
    // ponovitve so neškodljive (scrollIntoView je idempotenten).
    [120, 350, 700].forEach((delay) =>
      window.setTimeout(
        () => window.dispatchEvent(new CustomEvent("museum:scroll-to-quiz")),
        delay
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Uvod */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.kids.kicker}
        </p>
        <h1 className="font-display mt-2 flex items-center gap-3 text-4xl font-semibold sm:text-5xl">
          {t.kids.title}
          <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
        </h1>
        <p className="mt-3 text-muted-foreground">{t.kids.subtitle}</p>
      </div>

      <div className="mt-6 rounded-xl border border-border/70 bg-card p-5">
        <h2 className="font-display text-lg font-semibold">{t.kids.introTitle}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
          {t.kids.introText}
        </p>
      </div>

      {/* Družinski sprehod */}
      <section className="mt-8" aria-labelledby="druzinski-sprehod">
        <div className="rounded-xl border border-border/70 bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2
                id="druzinski-sprehod"
                className="font-display flex items-center gap-2.5 text-2xl font-semibold"
              >
                <Footprints className="h-6 w-6 text-primary" aria-hidden="true" />
                {t.kids.walkTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.kids.walkText}
              </p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                {t.walks.stops(stops.length)} · {t.walks.minutes(walkMinutes(stops.length))}
              </p>
            </div>
            <Button
              className="min-h-11"
              onClick={() => onStartWalk(FAMILY_WALK.id, 0)}
              disabled={stops.length === 0}
            >
              <Footprints className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
              {t.kids.walkCta}
            </Button>
          </div>

          {/* Predogled postaj */}
          {stops.length > 0 && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.kids.walkStops}
              </h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stops.map((stop, index) => (
                  <motion.li
                    key={stop.exhibit.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <button
                      type="button"
                      onClick={() => onStartWalk(FAMILY_WALK.id, index)}
                      className="group flex w-full items-center gap-3 rounded-lg border border-border/60 bg-background p-2.5 text-left transition-colors hover:border-primary/50"
                      aria-label={`${t.walks.openStop(index + 1)}: ${es.title(stop.exhibit)}`}
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="relative block size-14 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={
                            stop.exhibit.image ?? "/images/authentic/hero-griblje.jpg"
                          }
                          alt={es.title(stop.exhibit)}
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium leading-snug">
                          {es.title(stop.exhibit)}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {(lang === "sl" ? stop.noteSi : stop.noteEn).split(/[.!?]/)[0]}.
                        </span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Uganka, delovni list, zbiralec */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <Gamepad2 className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.kids.quizTitle}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {t.kids.quizText}
          </p>
          <Button variant="outline" className="mt-4 min-h-11" onClick={goQuiz}>
            {t.kids.quizCta}
          </Button>
        </div>

        <div className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
          <h2 className="font-display flex items-center gap-2 text-lg font-semibold">
            <Printer className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.kids.worksheetTitle}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {t.kids.worksheetText}
          </p>
          <Button
            variant="outline"
            className="mt-4 min-h-11"
            onClick={() => printWorksheet(t, lang)}
          >
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            {t.kids.worksheetCta}
          </Button>
        </div>

        <div className="flex flex-col rounded-xl border border-border/70 bg-card p-5">
          <h2 className="font-display text-lg font-semibold">
            {t.kids.collectorTitle}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {t.kids.collectorText}
          </p>
          <div className="mt-4">
            <CollectorProgress total={exhibits.length} />
          </div>
        </div>
      </div>

      <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t.kids.forParents}
      </p>
    </div>
  );
}
