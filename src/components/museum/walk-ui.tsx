"use client";

import * as React from "react";
import { Check, ChevronLeft, ChevronRight, Compass, Footprints } from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { Walk } from "@/lib/walks";
import { Button } from "@/components/ui/button";

/**
 * Skupni kontekst sprehoda, ki ga dialog zapisa prejme od aplikacije.
 * `stopIndex` je 0-based; komponente same prikažejo uporabniku prijazno
 * številko (postaja i od n).
 */
export type WalkContext = {
  walk: Walk;
  stopIndex: number;
  totalStops: number;
  stopNote: string;
  onPrevStop: () => void;
  onNextStop: () => void;
  onFinish: () => void;
};

/** Zgornja vrstica sprehoda: naslov, števec postaj in napredek. */
export function WalkTopBar({ ctx }: { ctx: WalkContext }) {
  const { t, lang } = useLang();
  const current = ctx.stopIndex + 1;
  const percent = Math.round((current / ctx.totalStops) * 100);
  const walkTitle = lang === "sl" ? ctx.walk.titleSi : ctx.walk.titleEn;

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-foreground/15"
          aria-hidden="true"
        >
          <Footprints className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold sm:text-base">
            {walkTitle}
          </p>
          <p className="text-xs text-primary-foreground/85" aria-live="polite">
            {t.walks.stopOf(current, ctx.totalStops)}
          </p>
        </div>
        <span className="sr-only">{t.walks.progressA11y(current, ctx.totalStops)}</span>
      </div>
      <div className="h-1 w-full bg-primary-foreground/20" aria-hidden="true">
        <div
          className="h-full bg-primary-foreground transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/** Kuratorska opomba postaje — zakaj je ta zapis na tem sprehodu. */
export function WalkStopNote({ ctx }: { ctx: WalkContext }) {
  const { t } = useLang();
  if (!ctx.stopNote) return null;
  return (
    <aside
      className="mt-5 rounded-lg border border-accent/40 bg-accent/10 p-4"
      aria-label={t.walks.curatorNote}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
        <Compass className="h-3.5 w-3.5" aria-hidden="true" />
        {t.walks.curatorNote}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/85">{ctx.stopNote}</p>
    </aside>
  );
}

/** Navigacija po postajah sprehoda na dnu dialoga. */
export function WalkNav({ ctx }: { ctx: WalkContext }) {
  const { t, lang } = useLang();
  const isFirst = ctx.stopIndex === 0;
  const isLast = ctx.stopIndex === ctx.totalStops - 1;
  const current = ctx.stopIndex + 1;

  return (
    <nav
      aria-label={lang === "sl" ? ctx.walk.titleSi : ctx.walk.titleEn}
      className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-primary/25 bg-primary/5 p-3"
    >
      <Button
        type="button"
        variant="outline"
        className="min-h-11"
        disabled={isFirst}
        onClick={ctx.onPrevStop}
        aria-disabled={isFirst}
      >
        <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
        {t.walks.prev}
      </Button>

      <p className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:block">
        {t.walks.stopOf(current, ctx.totalStops)}
      </p>

      {isLast ? (
        <Button type="button" className="min-h-11" onClick={ctx.onFinish}>
          <Check className="mr-1.5 h-4 w-4" aria-hidden="true" />
          {t.walks.finish}
        </Button>
      ) : (
        <Button type="button" className="min-h-11" onClick={ctx.onNextStop}>
          {t.walks.next}
          <ChevronRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </nav>
  );
}
