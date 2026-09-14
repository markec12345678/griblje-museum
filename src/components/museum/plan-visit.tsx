"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  Footprints,
  GraduationCap,
  MapPin,
  Timer,
  ExternalLink,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { MuseumView } from "@/components/museum/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Načrt obiska — rubrika, kot jo imajo na vidnih mestih vsi veliki muzeji
 * (Louvre »Préparez votre visite«, Met »Plan Your Visit«), prirejeno
 * digitalni-obiski vasi: kdaj, kako in koliko časa.
 */

/** Koordinate vasi (enake kot v /api/opendata manifestu). */
const LAT = 45.57246;
const LNG = 15.29257;
const OSM_URL = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=14/${LAT}/${LNG}`;

export function PlanVisit({
  onNavigate,
  onStartWalk,
}: {
  onNavigate: (view: MuseumView) => void;
  onStartWalk: (walkId: string, stopIndex: number) => void;
}) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();

  const cards = [
    {
      icon: CalendarClock,
      title: t.plan.whenTitle,
      text: t.plan.whenText,
    },
    {
      icon: MapPin,
      title: t.plan.howTitle,
      text: t.plan.howText,
    },
    {
      icon: Timer,
      title: t.plan.timeTitle,
      text: t.plan.timeText,
    },
  ];

  return (
    <section aria-labelledby="nacrt-obiska" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="nacrt-obiska" className="font-display text-3xl font-semibold sm:text-4xl">
            {t.plan.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.plan.sub}</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card className="h-full border-border/70">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <card.icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Časovne različice obiska */}
        <ul className="mt-8 grid gap-4 md:grid-cols-3" aria-label={t.plan.timeTitle}>
          {[
            { minutes: "15 min", label: t.plan.timeShort },
            { minutes: "30 min", label: t.plan.timeMedium },
            { minutes: "60+ min", label: t.plan.timeLong },
          ].map((option) => (
            <li
              key={option.minutes}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-4"
            >
              <span className="font-display shrink-0 text-lg font-semibold text-primary">
                {option.minutes}
              </span>
              <span className="text-sm text-foreground/85">{option.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => onStartWalk("voda-je-zivljenje", 0)}
          >
            <Footprints className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaWalk}
          </Button>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("zbirka")}>
            {t.plan.ctaCollection}
          </Button>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("karta")}>
            <MapPin className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaMap}
          </Button>
          <a
            href={OSM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t.plan.ctaOsm}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <Button variant="ghost" className="min-h-11" onClick={() => onNavigate("oMuzeju")}>
            <GraduationCap className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaSchools}
          </Button>
        </div>
      </div>
    </section>
  );
}
