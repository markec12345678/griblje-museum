"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, RefreshCw, Snowflake, Sparkles, Sun } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { getSeason, getSeasonalPicks, type SeasonKey } from "@/lib/seasonal-shelf";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Sezonska polica — kurirani izbor zbirke glede na letni čas.
 *
 * Vzorec: »object of the month« rubrike majhnih muzejev (Saffron Walden
 * Museum, Kelsey Museum) in sezonsko kurirstvo Anchorage Museuma.
 * Rotacija je avtomatična (datum obiskovalca je vir resnice) in vidna
 * kot odločitev: oznaka »menjava vsako leto« po prakti Harvard Art
 * Museums.
 */

const SEASON_ICONS: Record<SeasonKey, React.ComponentType<{ className?: string }>> = {
  pomlad: Sparkles,
  poletje: Sun,
  jesen: Leaf,
  zima: Snowflake,
};

export function SeasonalShelf({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  // Datum je vir resnice — izračun šele po priklopu, da se izognemo
  // razlikam med strežniškim in lokalnim časovnim pasom.
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const season = getSeason(now);
  const Icon = SEASON_ICONS[season.key];
  const picks = getSeasonalPicks(season, now)
    .map((index) => exhibits.find((ex) => ex.slug === season.slugs[index]))
    .filter((ex): ex is ExhibitDTO => Boolean(ex));

  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="sezonska-polica" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2
              id="sezonska-polica"
              className="font-display text-2xl font-semibold sm:text-3xl"
            >
              {lang === "sl" ? season.titleSi : season.titleEn}
            </h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              <RefreshCw className="h-3 w-3" aria-hidden="true" />
              {t.season.rotationNote}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {lang === "sl" ? season.whySi : season.whyEn}
          </p>
        </motion.div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((exhibit, index) => (
            <motion.li
              key={exhibit.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <button
                type="button"
                onClick={() => onOpenExhibit(exhibit)}
                className="group block w-full overflow-hidden rounded-xl border border-border/70 bg-background text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:shadow-lg"
                aria-label={`${t.season.open}: ${es.title(exhibit)}`}
              >
                <span className="relative block aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt={es.title(exhibit)}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>
                <span className="block p-4">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {t.categories[exhibit.category]}
                    </Badge>
                    <EvidenceBadge status={exhibit.evidenceStatus} />
                  </span>
                  <span className="font-display mt-2 block text-base font-semibold leading-snug">
                    {es.title(exhibit)}
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
