"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Award, RotateCcw, Trophy } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useVisited } from "@/lib/visit-tracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

/**
 * Zbiralec zapisov — kartica napredka odkritih zapisov.
 * Vsak v muzeju odprt zapis (pogovorno okno) se šteje med odkrite;
 * stanje je lokalno (localStorage), brez pošiljanja na strežnik.
 */
export function CollectorProgress({ total }: { total: number }) {
  const { t } = useLang();
  const { visitedCount, clearVisited } = useVisited();
  const reduceMotion = useReducedMotion();

  if (total <= 0) return null;

  const shown = Math.min(visitedCount, total);
  const percent = Math.round((shown / total) * 100);
  const complete = visitedCount >= total;

  return (
    <section
      role="group"
      aria-label={t.collector.title}
      className="rounded-xl border border-border/70 bg-card p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Award className="h-5.5 w-5.5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight">
              {t.collector.title}
            </p>
            <p className="text-sm text-muted-foreground">{t.collector.subtitle}</p>
          </div>
        </div>

        {complete && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge className="gap-1.5 border-primary/30 bg-primary/10 px-3 py-1.5 text-primary">
              <Trophy className="h-4 w-4" aria-hidden="true" />
              {t.collector.complete}
            </Badge>
          </motion.div>
        )}
      </div>

      <div className="mt-4">
        <Progress
          value={percent}
          className="h-2.5"
          aria-label={t.collector.count(shown, total)}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium" aria-live="polite">
            {t.collector.count(shown, total)}
            <span className="ml-2 font-normal text-muted-foreground">
              {t.collector.percent(percent)}
            </span>
          </p>
          {!complete && (
            <p className="text-xs text-muted-foreground">{t.collector.hint}</p>
          )}
        </div>
      </div>

      {complete && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-primary/10 p-4"
        >
          <p className="text-sm font-medium text-primary">{t.collector.completeText}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11 border-primary/40 bg-background/80 hover:bg-background"
            onClick={clearVisited}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.collector.reset}
          </Button>
        </motion.div>
      )}
    </section>
  );
}
