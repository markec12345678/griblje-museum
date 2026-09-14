"use client";

import * as React from "react";
import Image from "next/image";
import {
  Archive,
  BookOpen,
  ExternalLink,
  FileText,
  Globe,
  Map as MapIcon,
  MapPin,
  Mic,
  Quote,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO, SourceType } from "@/lib/types";
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
import { Separator } from "@/components/ui/separator";
import { EvidenceBadge } from "@/components/museum/evidence-badge";
import { AudioGuide } from "@/components/museum/audio-guide";

const SOURCE_ICON: Record<SourceType, React.ElementType> = {
  arhiv: Archive,
  fotografija: FileText,
  objava: BookOpen,
  "spletni-vir": Globe,
  pricevanje: Mic,
  zemljevid: MapIcon,
};

export function ExhibitDialog({
  exhibit,
  onClose,
  onShowOnMap,
}: {
  exhibit: ExhibitDTO | null;
  onClose: () => void;
  onShowOnMap: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const open = exhibit !== null;

  const storyParagraphs = exhibit ? es.story(exhibit).split("\n\n").filter(Boolean) : [];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {exhibit && (
          <ScrollArea className="museum-scroll max-h-[92vh]">
            {/* Slika zapisa */}
            <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
              <Image
                src={exhibit.image ?? "/images/hero.png"}
                alt={es.title(exhibit)}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
                aria-hidden="true"
              />
              <p className="absolute bottom-3 right-4 max-w-[80%] text-right text-[11px] leading-snug text-foreground/70">
                {t.collection.aiNote}
              </p>
            </div>

            <div className="px-6 pb-8 pt-5 sm:px-8">
              <DialogHeader className="items-start space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{t.categories[exhibit.category]}</Badge>
                  <EvidenceBadge status={exhibit.evidenceStatus} />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {es.period(exhibit)}
                  </span>
                </div>
                <DialogTitle asChild>
                  <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
                    {es.title(exhibit)}
                  </h2>
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  {es.summary(exhibit)}
                </DialogDescription>
              </DialogHeader>

              <p className="sr-only">
                {t.evidence.label}: {t.evidence[exhibit.evidenceStatus]} —{" "}
                {t.evidence.desc[exhibit.evidenceStatus]}
              </p>

              {/* Avdio vodnik */}
              <div className="mt-5 rounded-lg border border-border/70 bg-muted/40 p-4">
                <AudioGuide exhibit={exhibit} />
              </div>

              {/* Zgodba */}
              <div className="mt-6 space-y-4">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-[15px] leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Lega */}
              {exhibit.lat != null && exhibit.lng != null && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {exhibit.lat.toFixed(5)}, {exhibit.lng.toFixed(5)}
                    {exhibit.coordsApprox && (
                      <span className="ml-1 italic">({t.map.approx})</span>
                    )}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-11"
                    onClick={() => {
                      onShowOnMap(exhibit);
                      onClose();
                    }}
                  >
                    <MapIcon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    {t.collection.showOnMap}
                  </Button>
                </div>
              )}

              <Separator className="my-6" />

              {/* Viri */}
              <section aria-labelledby="viri-zapisa">
                <h3
                  id="viri-zapisa"
                  className="font-display text-lg font-semibold"
                >
                  {t.collection.sourcesTitle}
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {exhibit.sources.map((source) => {
                    const Icon = SOURCE_ICON[source.sourceType] ?? Globe;
                    return (
                      <li key={source.id}>
                        <div className="flex items-start gap-3 rounded-lg border border-border/70 bg-card p-3.5">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium leading-snug">
                              {es.sourceName(source)}
                            </p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <Quote className="h-3 w-3" aria-hidden="true" />
                                {source.license}
                              </span>
                              {source.url && (
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-0.5 font-medium text-primary underline-offset-2 hover:underline"
                                >
                                  {lang === "sl" ? "odpri vir" : "open source"}
                                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                </a>
                              )}
                            </p>
                            {es.sourceNote(source) && (
                              <p className="mt-1.5 text-xs italic text-muted-foreground">
                                {es.sourceNote(source)}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <Separator className="my-6" />

              {/* Navedba */}
              <section aria-labelledby="navedba-zapisa" className="rounded-lg bg-muted p-4">
                <h3 id="navedba-zapisa" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t.collection.citation}
                </h3>
                <p className="museum-scroll mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-foreground/85">
                  Muzej vasi Griblje (2026). »{es.title(exhibit)}«. Zapis{" "}
                  <span className="text-primary">{exhibit.slug}</span>. CC BY-SA 4.0.{" "}
                  https://muzej-griblje/api/exhibits
                </p>
              </section>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
