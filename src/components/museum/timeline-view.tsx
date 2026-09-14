"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarRange, Flag, Home, Info, Plane, ScrollText } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { EvidenceBadge } from "@/components/museum/evidence-badge";
import { cn } from "@/lib/utils";

/**
 * Časovnica — kronološka pripoved zbirke (po muzejski praksi: časovnica
 * kot orodje za pripoved o spremembah). Na črto rišemo samo leta, ki so
 * zapisana v virih; kjer vir poda le stoletje, pokažemo oznako obdobja,
 * nikoli izmišljeno leto. Zapisi brez datacije (verska, naravna, sezonska
 * dediščina) tvorijo razdelek »Neprekinjeni tokovi«.
 */

type EraKey = "s16" | "s19" | "s20" | "s21";

const ERA_ORDER: EraKey[] = ["s16", "s19", "s20", "s21"];

const ERA_ICON: Record<EraKey, React.ElementType> = {
  s16: ScrollText,
  s19: Home,
  s20: Plane,
  s21: Flag,
};

function eraOf(exhibit: ExhibitDTO): EraKey {
  const year = exhibit.yearFrom ?? 0;
  if (year < 1700) return "s16";
  if (year < 1900) return "s19";
  if (year < 1991) return "s20";
  return "s21";
}

/**
 * Oznaka mejnika: izpeljemo jo iz kuriranega niza obdobja — štirimestno
 * leto (npr. »1526 → danes«, »Marec 1945«) pomeni dokumentirano leto,
 * sicer (npr. »19. stoletje«) pokažemo okrajšavo stoletja.
 */
function markerLabel(period: string, centuryShort: string): string {
  const match = period.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
  return match ? match[1] : centuryShort;
}

export function TimelineView({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const dated = React.useMemo(
    () =>
      exhibits
        .filter((ex) => ex.yearFrom != null)
        .sort((a, b) => (a.yearFrom ?? 0) - (b.yearFrom ?? 0)),
    [exhibits]
  );

  const streams = React.useMemo(
    () => exhibits.filter((ex) => ex.yearFrom == null),
    [exhibits]
  );

  const eras = React.useMemo(
    () =>
      ERA_ORDER.map((key) => ({
        key,
        label: t.timeline.eras[key],
        items: dated.filter((ex) => eraOf(ex) === key),
      })).filter((era) => era.items.length > 0),
    [dated, t]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.timeline.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.timeline.subtitle}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="gap-1.5 border-primary/30 py-1.5 pl-2.5 pr-3.5 text-sm text-primary">
          <CalendarRange className="h-4 w-4" aria-hidden="true" />
          {t.timeline.milestones(dated.length)}
        </Badge>
      </div>

      <p className="mt-4 flex max-w-3xl items-start gap-2.5 rounded-lg border border-border/70 bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
        {t.timeline.howTo}
      </p>

      {/* Kronološka časovnica */}
      <section aria-label={t.timeline.title} className="relative mt-12">
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-[15px] top-3 w-0.5 rounded-full bg-border md:left-1/2 md:-translate-x-1/2"
        />
        <ol className="space-y-14">
          {eras.map((era) => {
            const EraIcon = ERA_ICON[era.key];
            return (
              <li key={era.key}>
                {/* glava obdobja — na črti */}
                <div className="relative flex pl-12 md:justify-center md:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-[9px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-primary/15 md:left-1/2 md:-translate-x-1/2"
                  />
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                    <EraIcon className="h-4 w-4" aria-hidden="true" />
                    {era.label}
                  </span>
                </div>

                <ul className="mt-8 space-y-8">
                  {era.items.map((exhibit, index) => {
                    const marker = markerLabel(es.period(exhibit), t.timeline.centuryShort);
                    const sideLeft = index % 2 === 0;
                    return (
                      <li key={exhibit.slug} className="relative md:grid md:grid-cols-2 md:gap-16">
                        <span
                          aria-hidden="true"
                          className="absolute left-[9px] top-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-primary/15 md:left-1/2 md:-translate-x-1/2"
                        />
                        <motion.button
                          type="button"
                          onClick={() => onOpenExhibit(exhibit)}
                          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.24) }}
                          className={cn(
                            "group ml-12 flex w-[calc(100%-3rem)] flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:flex-row md:ml-0 md:w-full md:max-w-xl",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                            sideLeft ? "md:col-start-1" : "md:col-start-2 md:justify-self-end"
                          )}
                        >
                          <div className="relative h-40 w-full shrink-0 overflow-hidden sm:h-auto sm:w-44 sm:self-stretch lg:w-48">
                            <Image
                              src={exhibit.image ?? "/images/authentic/hero-kolpa.jpg"}
                              alt={es.title(exhibit)}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 300px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            <span className="absolute bottom-2 left-2 inline-flex items-center rounded-md bg-background/85 px-2.5 py-1 font-display text-lg font-semibold leading-none text-primary backdrop-blur-sm">
                              {marker}
                            </span>
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
                              {t.timeline.openRecord}
                              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                                →
                              </span>
                            </span>
                            {exhibit.imageCredit && (
                              <p className="truncate text-[10px] leading-tight text-muted-foreground/75">
                                {exhibit.imageCredit}
                              </p>
                            )}
                          </div>
                        </motion.button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Neprekinjeni tokovi — dediščina brez enega datuma */}
      <section aria-labelledby="cas-toki" className="mt-16">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 id="cas-toki" className="font-display text-2xl font-semibold sm:text-3xl">
              {t.timeline.streamsTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.timeline.streamsSub}</p>
          </div>
        </div>
        <p className="mt-4 max-w-3xl rounded-lg border border-dashed border-accent/50 bg-accent/5 p-4 text-sm leading-relaxed text-muted-foreground">
          {t.timeline.streamsNote}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {streams.map((exhibit, index) => (
            <motion.button
              key={exhibit.slug}
              type="button"
              onClick={() => onOpenExhibit(exhibit)}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={exhibit.image ?? "/images/authentic/hero-kolpa.jpg"}
                  alt={es.title(exhibit)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                {exhibit.imageCredit && (
                  <p className="absolute bottom-2 right-3 max-w-[75%] truncate text-right text-[10px] leading-tight text-white/80 drop-shadow-sm">
                    {exhibit.imageCredit}
                  </p>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {es.period(exhibit)}
                </span>
                <h3 className="font-display text-base font-semibold leading-snug">
                  {es.title(exhibit)}
                </h3>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                  {t.timeline.openRecord}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
