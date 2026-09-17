"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Danes v muzeju — dnevni zapis iz zbirke.
 *
 * Vzorec: klasična muzejska rubrika »object of the day« (British Museum,
 * Met). Izbor je usodnosten (enak za vse obiskovalce določenega dne,
 * ob polnoči se zamenja) — deterministična razpršitev koledarskega dne
 * po celotni zbirki, brez strežnika.
 */

/** Deterministična razpršitev koledarskega dne → indeks zapisa. */
function pickDailyIndex(total: number, now: Date): number {
  if (total <= 0) return -1;
  const dayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000
  );
  // Mešanje (Fibonacci hashing): sosednji dnevi ne pomenijo sosednjih zapisov.
  let h = (dayNumber ^ 0x9e3779b9) | 0;
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  h = (h ^ (h >>> 16)) >>> 0;
  return h % total;
}

export function ObjectOfDay({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  // Izbor se preveri enkrat ob prikazu (za dan ogleda) in se ne spreminja
  // ob vsakem renderu — koledarski dan je vhod.
  const index = React.useMemo(() => pickDailyIndex(exhibits.length, new Date()), [exhibits.length]);
  const exhibit = index >= 0 ? exhibits[index] : null;

  const dateFmt = new Intl.DateTimeFormat(localeOf(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!exhibit) return null;

  return (
    <section aria-labelledby="danes-v-muzeju" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 md:grid-cols-[220px_1fr] md:items-center lg:grid-cols-[280px_1fr]"
        >
          <button
            type="button"
            onClick={() => onOpenExhibit(exhibit)}
            className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl shadow-sm transition-shadow focus-visible:shadow-lg md:aspect-auto md:h-44 lg:h-48"
            aria-label={`${t.daily.open}: ${es.title(exhibit)}`}
          >
            <Image
              src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
              alt={es.title(exhibit)}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>

          <div>
            <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {t.daily.kicker}
              <span className="font-normal normal-case tracking-normal text-muted-foreground">
                · {dateFmt.format(new Date())}
              </span>
            </p>
            <h2 id="danes-v-muzeju" className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
              {es.title(exhibit)}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{t.categories[exhibit.category]}</Badge>
              <EvidenceBadge status={exhibit.evidenceStatus} />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {es.period(exhibit)}
              </span>
            </div>
            <p className="mt-3 max-w-2xl line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {es.summary(exhibit)}
            </p>
            <Button className="mt-4 min-h-11" onClick={() => onOpenExhibit(exhibit)}>
              {t.daily.open}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
