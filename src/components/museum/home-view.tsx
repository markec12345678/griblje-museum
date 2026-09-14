"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Database, FileSearch, Map as MapIcon, CalendarDays } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { CollectorProgress } from "@/components/museum/collector-progress";
import { MuseumQuiz } from "@/components/museum/museum-quiz";
import { WalksSection } from "@/components/museum/walks-section";
import type { ExhibitDTO, MuseumEventDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

export function HomeView({
  exhibits,
  events,
  onNavigate,
  onOpenExhibit,
  onStartWalk,
}: {
  exhibits: ExhibitDTO[];
  events: MuseumEventDTO[];
  onNavigate: (view: MuseumView) => void;
  onOpenExhibit: (exhibit: ExhibitDTO, focusView?: MuseumView) => void;
  onStartWalk: (walkId: string, stopIndex: number) => void;
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const es = useExhibitStrings();

  const featured = exhibits.filter((ex) => ex.featured).slice(0, 4);
  const nextEvents = events.slice(0, 3);
  const sourceCount = exhibits.reduce((total, ex) => total + ex.sources.length, 0);
  const categoryCount = new Set(exhibits.map((ex) => ex.category)).size;

  const dateFmt = new Intl.DateTimeFormat(lang === "sl" ? "sl-SI" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/authentic/hero-griblje.jpg"
            alt={pick(
              lang,
              "Vas Griblje ob Kolpi s cerkvijo sv. Vida (fotografija)",
              "The village of Griblje on the Kolpa with the church of St. Vitus (photograph)"
            )}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="img-veil absolute inset-0" aria-hidden="true" />
        </div>
        <p className="absolute bottom-3 right-4 z-10 max-w-[70%] text-right text-[11px] leading-snug text-foreground/60">
          {pick(
            lang,
            "Griblje · foto: Eleassar, Wikimedia Commons, CC BY-SA 3.0",
            "Griblje · photo: Eleassar, Wikimedia Commons, CC BY-SA 3.0"
          )}
        </p>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pt-36">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-primary backdrop-blur-sm">
              {t.hero.kicker}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              {t.hero.title1}{" "}
              <span className="italic text-primary">{t.hero.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="min-h-12 px-6" onClick={() => onNavigate("zbirka")}>
                {t.hero.ctaCollection}
                <ArrowRight className="ml-2 h-4.5 w-4.5" aria-hidden="true" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-h-12 border-primary/40 bg-background/70 px-6 backdrop-blur-sm hover:bg-background/90"
                onClick={() => onNavigate("karta")}
              >
                <MapIcon className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
                {t.hero.ctaMap}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATISTIKA */}
      <section aria-label="statistika" className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border sm:grid-cols-4">
          {[
            { value: exhibits.length, label: t.stats.records },
            { value: sourceCount, label: t.stats.sources },
            { value: categoryCount, label: t.stats.categories },
            { value: t.stats.openDataValue, label: t.stats.openData },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center sm:px-6">
              <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* IZPOSTAVLJENO */}
      <section className="paper-grain mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {t.home.featuredTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.home.featuredSub}</p>
          </div>
          <Button variant="ghost" className="min-h-11" onClick={() => onNavigate("zbirka")}>
            {t.home.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {featured.map((exhibit, index) => (
            <motion.button
              key={exhibit.slug}
              type="button"
              onClick={() => onOpenExhibit(exhibit)}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
              className="group relative overflow-hidden rounded-xl text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:shadow-lg"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                  alt={es.title(exhibit)}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/45 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="border-border">
                      {t.categories[exhibit.category]}
                    </Badge>
                    <EvidenceBadge status={exhibit.evidenceStatus} />
                  </div>
                  <h3 className="font-display mt-2.5 text-2xl font-semibold leading-tight">
                    {es.title(exhibit)}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 max-w-lg text-sm text-muted-foreground">
                    {es.summary(exhibit)}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* KURATORSKA OBLJUBA */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {t.home.promiseTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.home.promiseSub}</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: FileSearch,
                title: t.home.promise1Title,
                text: t.home.promise1Text,
              },
              {
                icon: BookOpen,
                title: t.home.promise2Title,
                text: t.home.promise2Text,
              },
              {
                icon: Database,
                title: t.home.promise3Title,
                text: t.home.promise3Text,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full border-border/70">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <item.icon className="h-5.5 w-5.5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ZBIRALEC + MUZEJSKA UGANKA */}
      <section className="paper-grain mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            {t.quiz.sectionTitle}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.quiz.sectionSub}</p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
          <MuseumQuiz exhibits={exhibits} onOpenExhibit={onOpenExhibit} />
          <CollectorProgress total={exhibits.length} />
        </div>
      </section>

      {/* MUZEJSKI SPREHODI */}
      <WalksSection exhibits={exhibits} onStartWalk={onStartWalk} />

      {/* TEASER DOGODKOV */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {t.home.eventsTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.home.eventsSub}</p>
          </div>
          <Button variant="ghost" className="min-h-11" onClick={() => onNavigate("dogodki")}>
            {t.home.viewAll}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {nextEvents.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onNavigate("dogodki")}
                className="flex h-full min-h-11 w-full flex-col items-start gap-2.5 rounded-xl border border-border/70 bg-card p-5 text-left transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-primary">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {dateFmt.format(new Date(event.startsAt))}
                </span>
                <span className="font-display text-lg font-semibold leading-snug">
                  {pick(lang, event.titleSi, event.titleEn)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {pick(lang, event.locationSi, event.locationEn)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
