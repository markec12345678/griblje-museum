"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ExternalLink, MapPin, Sparkles } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { MuseumEventDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EventsView({ events }: { events: MuseumEventDTO[] }) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const dateFmt = new Intl.DateTimeFormat(localeOf(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const weekdayFmt = new Intl.DateTimeFormat(localeOf(lang), {
    weekday: "long",
  });

  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold">{t.events.title}</h1>
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          {t.events.noEvents}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.events.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.events.subtitle}</p>
      </div>

      <ol className="relative mt-10 space-y-6 border-l-2 border-border pl-6 sm:pl-8">
        {events.map((event, index) => {
          const date = new Date(event.startsAt);
          return (
            <motion.li
              key={event.id}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.3) }}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[calc(1.5rem+9px)] top-6 h-4 w-4 rounded-full border-2 border-primary bg-background sm:-left-[calc(2rem+9px)]"
              />
              <article className="rounded-xl border border-border/70 bg-card p-6 transition-colors hover:border-primary/40">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={event.startsAt}>{dateFmt.format(date)}</time>
                  </span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {weekdayFmt.format(date)}
                  </span>
                  <Badge variant="secondary">{t.events.types[event.eventType]}</Badge>
                  {event.isExternal ? (
                    <Badge className="border-accent/40 bg-accent/10 text-accent">
                      {t.events.external}
                    </Badge>
                  ) : (
                    <Badge className="border-primary/30 bg-primary/10 text-primary">
                      {t.events.ours}
                    </Badge>
                  )}
                </div>
                <h2 className="font-display mt-3 text-2xl font-semibold leading-snug">
                  {es.eventTitle(event)}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {es.eventDesc(event)}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {es.eventLocation(event)}
                  </span>
                  {event.isExternal && event.externalUrl && (
                    <Button variant="outline" size="sm" className="min-h-11" asChild>
                      <a
                        href={event.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        {lang === "sl" ? "Spletna stran dogodka" : lang === "hr" ? "Web-stranica događaja" : lang === "de" ? "Veranstaltungs-Website" : lang === "it" ? "Sito web dell'evento" : "Event website"}
                      </a>
                    </Button>
                  )}
                  {!event.isExternal && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      {lang === "sl"
                        ? "Vstop prost; zbiramo tudi nove vire."
                        : "Free entry; we also collect new sources."}
                    </span>
                  )}
                </div>
              </article>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
