"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useCompareSelection, COMPARE_LIMIT } from "@/lib/compare-tracker";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * Pladenj primerjalnika — lebdeča vrstica na dnu zaslona, ki se pokaže,
 * ko je v izbiri vsaj en zapis. Vzorec: Comparator Rijksmuseuma —
 * izbira ostaja vidna med brskanjem, primerjava pa je en klik stran.
 */
export function CompareTray({
  exhibits,
  onOpenCompare,
}: {
  exhibits: ExhibitDTO[];
  onOpenCompare: () => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const { selection, count, remove, clear } = useCompareSelection();
  const reduceMotion = useReducedMotion();

  const items = selection
    .map((slug) => exhibits.find((ex) => ex.slug === slug))
    .filter((ex): ex is ExhibitDTO => Boolean(ex));

  if (count === 0 || items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 24 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 md:bottom-4"
      >
        <div
          role="group"
          aria-label={t.compare.trayLabel}
          className="pointer-events-auto flex max-w-full items-center gap-3 rounded-xl border border-border bg-card/95 p-2.5 shadow-xl backdrop-blur-md"
        >
          <span
            className="hidden items-center gap-1.5 pl-1 pr-1 text-xs font-medium text-muted-foreground sm:flex"
            aria-live="polite"
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
            {t.compare.trayCount(count)}
          </span>

          {/* Sličice izbranih zapisov */}
          <ul className="flex items-center gap-2">
            {items.map((exhibit) => (
              <li key={exhibit.slug} className="relative">
                <span className="relative block size-12 overflow-hidden rounded-md border border-border">
                  <Image
                    src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt={es.title(exhibit)}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <button
                  type="button"
                  onClick={() => remove(exhibit.slug)}
                  aria-label={`${t.compare.remove}: ${es.title(exhibit)}`}
                  title={t.compare.remove}
                  className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-transform hover:scale-110"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="min-h-11"
              disabled={count < 2}
              title={count < 2 ? t.compare.openDisabled : undefined}
              onClick={onOpenCompare}
            >
              <Scale className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {t.compare.open}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 px-3 text-muted-foreground hover:text-foreground"
              onClick={clear}
            >
              {t.compare.clear}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
