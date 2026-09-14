"use client";

import * as React from "react";
import Image from "next/image";
import { Scale, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useCompareSelection } from "@/lib/compare-tracker";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Primerjalnik — do tri zapise postavljene drug ob drugega.
 * Vzorec: Comparator iz nove zbirke Rijksmuseuma (Collection Online,
 * 2024): naslovni vrstici, obdobje, zanesljivost in virovod zapisa
 * so zloženi v enake vrstice, da razlike skočijo v oči.
 */
export function CompareDialog({
  open,
  exhibits,
  onClose,
  onOpenExhibit,
}: {
  open: boolean;
  exhibits: ExhibitDTO[];
  onClose: () => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const { selection, remove } = useCompareSelection();

  const items = selection
    .map((slug) => exhibits.find((ex) => ex.slug === slug))
    .filter((ex): ex is ExhibitDTO => Boolean(ex));

  const gridClass =
    items.length >= 3
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : items.length === 2
        ? "grid gap-4 sm:grid-cols-2"
        : "grid gap-4";

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <ScrollArea className="museum-scroll max-h-[92vh]">
          <div className="px-6 pb-8 pt-6 sm:px-8">
            <DialogHeader className="items-start space-y-2 text-left">
              <DialogTitle asChild>
                <h2 className="font-display flex items-center gap-2.5 text-2xl font-semibold sm:text-3xl">
                  <span className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Scale className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {t.compare.title}
                </h2>
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                {t.compare.subtitle}
              </DialogDescription>
            </DialogHeader>

            {items.length < 2 && (
              <p
                aria-live="polite"
                className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground"
              >
                {t.compare.emptyHint}
              </p>
            )}

            <div className={`mt-6 ${gridClass}`}>
              {items.map((exhibit) => (
                <article
                  key={exhibit.slug}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
                >
                  <div className="relative">
                    <button
                      type="button"
                      className="block w-full"
                      aria-label={`${t.compare.openRecord}: ${es.title(exhibit)}`}
                      onClick={() => {
                        onClose();
                        onOpenExhibit(exhibit);
                      }}
                    >
                      <span className="relative block aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                          alt={es.title(exhibit)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(exhibit.slug)}
                      aria-label={`${t.compare.remove}: ${es.title(exhibit)}`}
                      title={t.compare.remove}
                      className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-md bg-background/85 shadow-sm backdrop-blur-sm transition-colors hover:bg-background"
                    >
                      <X className="h-4.5 w-4.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {t.categories[exhibit.category]}
                      </Badge>
                      <EvidenceBadge status={exhibit.evidenceStatus} />
                    </div>
                    <h3 className="font-display mt-2 text-lg font-semibold leading-snug">
                      {es.title(exhibit)}
                    </h3>

                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex items-baseline justify-between gap-3 border-t border-border/60 pt-2">
                        <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t.common.period}
                        </dt>
                        <dd className="text-right font-medium">{es.period(exhibit)}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t.evidence.label}
                        </dt>
                        <dd className="text-right">
                          {t.evidence[exhibit.evidenceStatus]}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t.collection.sourcesTitle}
                        </dt>
                        <dd className="text-right">
                          {t.compare.sourcesCount(exhibit.sources.length)}
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                      {es.summary(exhibit)}
                    </p>

                    <div className="mt-auto pt-4">
                      <Button
                        size="sm"
                        className="min-h-11 w-full"
                        onClick={() => {
                          onClose();
                          onOpenExhibit(exhibit);
                        }}
                      >
                        {t.compare.openRecord}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
