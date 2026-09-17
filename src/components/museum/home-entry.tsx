"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  Footprints,
  Hourglass,
  Map as MapIcon,
  Sparkles,
  Timer,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useVisited } from "@/lib/visit-tracker";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";

/**
 * Hitri vstop v muzej — »Kako želite raziskovati?«
 *
 * Vzorec: Google Arts & Culture (»What do you want to explore?«) —
 * vstopna točka po INTERESU obiskovalca, ne po notranji organizaciji
 * muzeja. Šest kartic pokrije vse značaje obiska: raziskovalca,
 * sanjača, zgodovinarja, geografa, družino in hitečega.
 */
export function ExploreStart({
  onNavigate,
}: {
  onNavigate: (view: MuseumView) => void;
}) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();

  const entries: {
    key: string;
    icon: typeof Sparkles;
    title: string;
    text: string;
    action: () => void;
  }[] = [
    {
      key: "mood",
      icon: Sparkles,
      title: t.home.exploreMoodTitle,
      text: t.home.exploreMoodText,
      action: () => onNavigate("razpolozenje"),
    },
    {
      key: "theme",
      icon: Compass,
      title: t.home.exploreThemeTitle,
      text: t.home.exploreThemeText,
      action: () => onNavigate("zbirka"),
    },
    {
      key: "time",
      icon: Hourglass,
      title: t.home.exploreTimeTitle,
      text: t.home.exploreTimeText,
      action: () => onNavigate("casovnica"),
    },
    {
      key: "map",
      icon: MapIcon,
      title: t.home.exploreMapTitle,
      text: t.home.exploreMapText,
      action: () => onNavigate("karta"),
    },
    {
      key: "kids",
      icon: Footprints,
      title: t.home.exploreKidsTitle,
      text: t.home.exploreKidsText,
      action: () => onNavigate("zaOtroke"),
    },
    {
      key: "minute",
      icon: Timer,
      title: t.home.exploreMinuteTitle,
      text: t.home.exploreMinuteText,
      action: () =>
        document
          .getElementById("muzej-v-minuti")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    },
  ];

  return (
    <section
      aria-labelledby="hitri-vstop"
      className="paper-grain mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.museumName}
        </p>
        <h2
          id="hitri-vstop"
          className="font-display mt-1 text-3xl font-semibold sm:text-4xl"
        >
          {t.home.exploreTitle}
        </h2>
        <p className="mt-2 text-muted-foreground">{t.home.exploreSub}</p>
      </div>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, index) => (
          <motion.li
            key={entry.key}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <button
              type="button"
              onClick={entry.action}
              className="group flex min-h-11 h-full w-full flex-col items-start gap-3 rounded-xl border border-border/70 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <entry.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-semibold leading-snug">
                {entry.title}
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {entry.text}
              </span>
            </button>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Nadaljujte z raziskovanjem — zadnje odkriti zapisi.
 *
 * Vzorec: »Continue exploring / Recently viewed« velikih vsebinskih
 * spletišč (Rijksmuseum si zapomni zadnja iskanja, Google Arts &
 * Culture ponudi nadaljevanje). Pri nas brez računa: sledilnik
 * obiskov (localStorage) hrani vrstni red odkritja — zadnje štiri
 * obrnemo in ponudimo kot vstop nazaj v zbirko.
 */
export function ContinueExploring({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const reduceMotion = useReducedMotion();
  const { visited } = useVisited();
  const es = useExhibitStrings();

  const recent = React.useMemo(() => {
    // Set ohranja vrstni red vstavljanja = vrstni red odkritja.
    const order = Array.from(visited).reverse();
    return order
      .map((slug) => exhibits.find((ex) => ex.slug === slug))
      .filter((ex): ex is ExhibitDTO => !!ex)
      .slice(0, 4);
  }, [visited, exhibits]);

  if (recent.length === 0) return null;

  return (
    <section
      aria-labelledby="nadaljujte"
      className="border-b border-border bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="nadaljujte"
              className="font-display text-xl font-semibold sm:text-2xl"
            >
              {t.home.continueTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.home.continueSub}
            </p>
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {recent.map((exhibit, index) => (
            <motion.li
              key={exhibit.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
            >
              <button
                type="button"
                onClick={() => onOpenExhibit(exhibit)}
                className="group flex min-h-11 w-full items-center gap-3 rounded-xl border border-border/70 bg-background p-2.5 text-left transition-colors hover:border-primary/40"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border/60">
                  <Image
                    src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-snug">
                    {es.title(exhibit)}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {es.period(exhibit)}
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
