"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, DoorClosed, DoorOpen, Lock } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import {
  ADVENT_DAYS,
  getAdventIndex,
  isDoorUnlocked,
} from "@/lib/seasonal-shelf";
import type { ExhibitDTO } from "@/lib/types";

/**
 * Adventni koledar muzeja — 24 vrat, odklenjena so današnja in pretekla.
 *
 * Vzorec: spletni adventni koledarji Glencairn Museuma (od 2020 dalje,
 * iz obstoječe razstave) in Ashmolean Museuma (#AshmoleanAdvent):
 * reciklirana zbirka, dnevno odklepanje po lokalnem datumu obiskovalca,
 * deljive globoke povezave (?advent=<dan>).
 */

export function AdventCalendar({
  exhibits,
  onOpenExhibit,
  highlightDay,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  /** Dan, označen z globoke povezave (?advent=). */
  highlightDay?: number | null;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const todayDay = now.getDate();
  const days = Array.from({ length: ADVENT_DAYS }, (_, i) => i + 1);

  return (
    <section
      id="advent"
      aria-labelledby="adventni-koledar"
      className="paper-grain scroll-mt-20 border-y border-border bg-card"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2
              id="adventni-koledar"
              className="font-display text-2xl font-semibold sm:text-3xl"
            >
              {t.advent.title}
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t.advent.subtitle}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{t.advent.note}</p>
        </motion.div>

        <ol className="mt-8 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {days.map((day) => {
            const unlocked = isDoorUnlocked(day, now);
            const index = getAdventIndex(day, now, exhibits.length);
            const exhibit = index >= 0 ? exhibits[index] : undefined;
            const isToday = day === todayDay;
            const isHighlight = highlightDay === day;

            if (unlocked && exhibit) {
              return (
                <li key={day}>
                  <motion.button
                    type="button"
                    initial={false}
                    animate={
                      reduceMotion || !isHighlight
                        ? undefined
                        : { scale: [1, 1.08, 1] }
                    }
                    transition={{ duration: 0.5 }}
                    onClick={() => onOpenExhibit(exhibit)}
                    className={`group relative flex min-h-11 w-full flex-col items-center justify-center overflow-hidden rounded-lg border p-3 text-center shadow-sm transition-all hover:shadow-md focus-visible:shadow-md ${
                      isToday
                        ? "border-primary/60 bg-primary/10"
                        : "border-border bg-background"
                    } ${isHighlight ? "ring-2 ring-primary ring-offset-1 ring-offset-card" : ""}`}
                    aria-label={`${t.advent.openDoor} ${day}: ${es.title(exhibit)}`}
                  >
                    <span
                      className="font-display text-2xl font-semibold text-primary"
                      aria-hidden="true"
                    >
                      {day}
                    </span>
                    {isToday ? (
                      <DoorOpen className="mt-1 h-4 w-4 text-primary" aria-hidden="true" />
                    ) : (
                      <DoorClosed
                        className="mt-1 h-4 w-4 text-muted-foreground/70"
                        aria-hidden="true"
                      />
                    )}
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-foreground px-1.5 py-1 text-[10px] font-medium leading-tight text-background transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {es.title(exhibit)}
                    </span>
                  </motion.button>
                </li>
              );
            }

            const daysLeft = day - todayDay;
            return (
              <li key={day}>
                <div
                  className="flex min-h-11 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/40 p-3 text-center"
                  aria-label={`${t.advent.doorLocked} ${day}`}
                  title={`${t.advent.opensIn.replace("{n}", String(daysLeft))}`}
                >
                  <span
                    className="font-display text-2xl font-semibold text-muted-foreground/50"
                    aria-hidden="true"
                  >
                    {day}
                  </span>
                  <Lock
                    className="mt-1 h-4 w-4 text-muted-foreground/40"
                    aria-hidden="true"
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
