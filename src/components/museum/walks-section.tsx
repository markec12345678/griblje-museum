"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, MapPin } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import {
  WALKS,
  resolveWalkStops,
  walkMinutes,
} from "@/lib/walks";
import { useCompletedWalks } from "@/lib/walk-tracker";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * Muzejski sprehodi — odsek domače strani.
 * Vzorec: vodeni ogledi Norsk Folkemuseum; kartice sprehodov
 * odprejo prvo postajo, posamezne postaje pa se lahko odprejo
 * neposredno (uporabno za učitelje).
 */
export function WalksSection({
  exhibits,
  onStartWalk,
}: {
  exhibits: ExhibitDTO[];
  onStartWalk: (walkId: string, stopIndex: number) => void;
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const es = useExhibitStrings();
  const completed = useCompletedWalks();
  const completedCount = WALKS.filter((walk) => completed.has(walk.id)).length;

  return (
    <section aria-labelledby="muzejski-sprehodi" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="muzejski-sprehodi"
            className="font-display text-3xl font-semibold sm:text-4xl"
          >
            {t.walks.sectionTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.walks.sectionSub}</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {WALKS.map((walk, index) => {
            const stops = resolveWalkStops(walk, exhibits);
            if (stops.length === 0) return null;
            const cover = stops[0].exhibit;
            const isCompleted = completed.has(walk.id);
            return (
              <motion.article
                key={walk.id}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm transition-shadow hover:shadow-lg"
              >
                {/* naslovnica sprehoda */}
                <button
                  type="button"
                  onClick={() => onStartWalk(walk.id, 0)}
                  className="relative min-h-11 w-full text-left"
                  aria-label={`${t.walks.start}: ${pick(lang, walk.titleSi, walk.titleEn)}`}
                >
                  <div className="relative aspect-[16/8]">
                    <Image
                      src={cover.image ?? "/images/authentic/hero-griblje.jpg"}
                      alt={es.title(cover)}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/45 to-transparent"
                      aria-hidden="true"
                    />
                    {isCompleted && (
                      <span className="absolute right-3 top-3">
                        <Badge className="gap-1 border-primary/40 bg-primary/15 text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          {t.walks.completed}
                        </Badge>
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display text-2xl font-semibold leading-tight">
                        {pick(lang, walk.titleSi, walk.titleEn)}
                      </h3>
                    </div>
                  </div>
                </button>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    {pick(lang, walk.descriptionSi, walk.descriptionEn)}
                  </p>

                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {t.walks.stops(stops.length)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      {t.walks.minutes(walkMinutes(stops.length))}
                    </span>
                  </p>

                  {/* postaje — vsaka se lahko odpre neposredno */}
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.walks.stopsList}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {stops.map((stop, stopIndex) => (
                        <li key={stop.exhibit.slug}>
                          <button
                            type="button"
                            onClick={() => onStartWalk(walk.id, stopIndex)}
                            className="min-h-11 rounded-md border border-border/70 bg-card px-2.5 py-1 text-xs text-foreground/85 transition-colors hover:border-primary/40 hover:text-primary"
                            aria-label={`${t.walks.openStop(stopIndex + 1)}: ${es.title(stop.exhibit)}`}
                          >
                            <span className="mr-1 font-semibold text-primary">
                              {stopIndex + 1}
                            </span>
                            {es.title(stop.exhibit)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button
                      className="w-full min-h-11 sm:w-auto"
                      onClick={() => onStartWalk(walk.id, 0)}
                    >
                      {t.walks.start}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* napredek zaključenih sprehodov */}
        <div className="mt-8 rounded-xl border border-border/70 bg-background p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p
              className="text-sm font-medium text-foreground/90"
              aria-live="polite"
            >
              {t.walks.completedProgress(completedCount, WALKS.length)}
            </p>
            <p className="text-xs text-muted-foreground">{t.walks.coverNote}</p>
          </div>
          <Progress
            className="mt-3 h-2"
            value={Math.round((completedCount / WALKS.length) * 100)}
            aria-label={t.walks.completedProgress(completedCount, WALKS.length)}
          />
        </div>
      </div>
    </section>
  );
}
