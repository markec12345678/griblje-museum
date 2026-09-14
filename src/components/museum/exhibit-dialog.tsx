"use client";

import * as React from "react";
import Image from "next/image";
import {
  Archive,
  BookOpen,
  Check,
  ExternalLink,
  FileText,
  Globe,
  Link2,
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
import {
  WalkNav,
  WalkStopNote,
  WalkTopBar,
  type WalkContext,
} from "@/components/museum/walk-ui";

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
  walkContext = null,
}: {
  exhibit: ExhibitDTO | null;
  onClose: () => void;
  onShowOnMap: (exhibit: ExhibitDTO) => void;
  /** Aktivni muzejski sprehod — če je zapis odprt kot postaja sprehoda. */
  walkContext?: WalkContext | null;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const open = exhibit !== null;

  // Kopiranje deljive povezave in citata zapisa (globoka povezava ?exhibit=<slug>).
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [citationState, setCitationState] = React.useState<"idle" | "ok" | "fail">("idle");
  React.useEffect(() => {
    setCopyState("idle");
    setCitationState("idle");
  }, [exhibit?.slug]);

  const copyText = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Zasnova za starejše brskalnike brez Async Clipboard API-ja.
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      return true;
    } catch {
      return false;
    }
  };

  const copyLink = async () => {
    if (!exhibit) return;
    const url = `${window.location.origin}/?exhibit=${exhibit.slug}`;
    const ok = await copyText(url);
    setCopyState(ok ? "ok" : "fail");
    window.setTimeout(() => setCopyState("idle"), 2600);
  };

  const copyCitation = async () => {
    if (!exhibit) return;
    const ok = await copyText(buildCitation(exhibit));
    setCitationState(ok ? "ok" : "fail");
    window.setTimeout(() => setCitationState("idle"), 2600);
  };

  /** DigitaltMuseum-vzorc: oblikovan citat zapisa z datumom dostopa. */
  const buildCitation = (ex: ExhibitDTO): string => {
    const accessDate = new Intl.DateTimeFormat(lang === "sl" ? "sl-SI" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());
    const url = `${window.location.origin}/?exhibit=${ex.slug}`;
    if (lang === "sl") {
      return `Muzej vasi Griblje (2026). »${es.title(ex)}«. Zapis ${ex.slug}. Dostopno na: ${url} (${t.share.accessed}: ${accessDate}). Licenca CC BY-SA 4.0.`;
    }
    return `Griblje Village Museum (2026). “${es.title(ex)}”. Record ${ex.slug}. Available at: ${url} (${t.share.accessed}: ${accessDate}). Licence CC BY-SA 4.0.`;
  };

  const storyParagraphs = exhibit ? es.story(exhibit).split("\n\n").filter(Boolean) : [];

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-hidden p-0 sm:max-w-3xl">
        {exhibit && (
          <ScrollArea className="museum-scroll max-h-[92vh]">
            {/* Vrstica sprehoda — le ko je zapis odprt kot postaja sprehoda */}
            {walkContext && <WalkTopBar ctx={walkContext} />}

            {/* Slika zapisa */}
            <div className="relative aspect-[16/9] w-full sm:aspect-[2/1]">
              <Image
                src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
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
                {exhibit.imageCredit ?? t.collection.aiNote}
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

              {/* Kuratorska opomba postaje sprehoda */}
              {walkContext && <WalkStopNote ctx={walkContext} />}

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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 id="navedba-zapisa" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.collection.citation}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9"
                      onClick={copyCitation}
                      aria-live="polite"
                    >
                      {citationState === "ok" ? (
                        <Check className="mr-1.5 h-4 w-4 text-primary" aria-hidden="true" />
                      ) : (
                        <Quote className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      )}
                      {citationState === "ok"
                        ? t.share.citationCopied
                        : citationState === "fail"
                          ? t.share.copyFailed
                          : t.share.copyCitation}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9"
                      onClick={copyLink}
                      aria-live="polite"
                    >
                      {copyState === "ok" ? (
                        <Check className="mr-1.5 h-4 w-4 text-primary" aria-hidden="true" />
                      ) : (
                        <Link2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      )}
                      {copyState === "ok"
                        ? t.share.copied
                        : copyState === "fail"
                          ? t.share.copyFailed
                          : t.share.copyLink}
                    </Button>
                  </div>
                </div>
                <p className="museum-scroll mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-foreground/85">
                  {buildCitation(exhibit)}
                </p>
              </section>

              {/* Navigacija sprehoda — le ko je zapis odprt kot postaja sprehoda */}
              {walkContext && <WalkNav ctx={walkContext} />}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
