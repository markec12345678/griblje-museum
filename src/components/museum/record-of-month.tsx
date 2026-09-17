"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { resolveRecordOfMonth } from "@/lib/record-of-month";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Zapis meseca — uredniška rubrika enega zapisa z utemeljitvijo.
 *
 * Vzorec: »Picture of the month« National Gallery London (vojna serija:
 * vsak mesec ena slika in eno besedilo, zakaj je ravno ta na vrsti).
 * Nasprotje »Danes v muzeju«: dnevni zapis je presenečenje, mesečni
 * je odločitev — zato pas nosi invertirano podobo (papir postane
 * tiran, tir papir) in kustosov glas v bloku utemeljitve.
 *
 * Izbor je determinističen po (leto, mesec): vsi obiskovalci istega
 * meseca vidijo isti zapis; 1. v mesecu se zamenja. Besedila živijo v
 * src/lib/record-of-month.ts — skupaj z viri datumov.
 */
export function RecordOfMonth({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  // Datum je vir resnice — izračun šele po priklopu (SSR/časovni pas).
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const pick = resolveRecordOfMonth(now, exhibits);
  if (!pick) return null;
  const { exhibit, entry } = pick;

  const monthFmt = new Intl.DateTimeFormat(
    localeOf(lang),
    { month: "long", year: "numeric" }
  );

  return (
    <section
      aria-labelledby="zapis-meseca"
      className="border-y border-border bg-foreground text-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr] lg:gap-12"
        >
          {/* Besedilo — glas kustosa */}
          <div className="order-2 md:order-1">
            <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-background/80">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t.monthly.kicker}
              <span className="font-normal normal-case tracking-normal text-background/55">
                · {monthFmt.format(now)}
              </span>
            </p>

            <h2
              id="zapis-meseca"
              className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl"
            >
              {es.title(exhibit)}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-background/30 bg-background/10 text-background backdrop-blur-sm">
                {t.categories[exhibit.category]}
              </Badge>
              <span className="text-xs font-medium uppercase tracking-wider text-background/55">
                {es.period(exhibit)}
              </span>
            </div>

            <figure className="mt-6">
              <figcaption className="text-xs font-semibold uppercase tracking-wider text-background/55">
                {t.monthly.whyLabel}
              </figcaption>
              <blockquote
                cite="#zapis-meseca"
                className="mt-2.5 border-l-2 border-primary/70 pl-4 text-lg italic leading-relaxed text-background/90 sm:text-xl"
              >
                {lang === "sl" ? entry.noteSi : entry.noteEn}
              </blockquote>
            </figure>

            <p className="mt-3.5 text-xs text-background/50">
              {t.monthly.curatorSig} · {t.monthly.rotationNote}
            </p>

            <Button
              size="lg"
              className="mt-6 min-h-12 rounded-full px-7"
              onClick={() => onOpenExhibit(exhibit)}
            >
              {t.monthly.open}
            </Button>
          </div>

          {/* Slika — ogledana podlag(a) */}
          <div className="order-1 md:order-2">
            <button
              type="button"
              onClick={() => onOpenExhibit(exhibit)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-background/25 transition-shadow focus-visible:shadow-2xl"
              aria-label={`${t.monthly.open}: ${es.title(exhibit)}`}
            >
              <Image
                src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                alt={es.title(exhibit)}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="eager"
              />
              {exhibit.imageCredit && (
                <p className="absolute bottom-2 right-3 max-w-[75%] truncate text-right text-[10px] leading-tight text-white/80 drop-shadow-sm">
                  {exhibit.imageCredit}
                </p>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
