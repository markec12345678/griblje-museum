"use client";

import * as React from "react";
import Image from "next/image";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Check,
  Crop,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  Link2,
  Mail,
  Map as MapIcon,
  MapPin,
  Mic,
  Network,
  Puzzle,
  Quote,
  Route,
  Scale,
  Wind,
  X,
  ZoomIn,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useFavorites } from "@/lib/favorite-tracker";
import { useCompareSelection } from "@/lib/compare-tracker";
import { useMyWalk } from "@/lib/my-walk-tracker";
import { relatedExhibits } from "@/lib/connections";
import { hasMinuteStory } from "@/components/museum/minute-stories";
import { ObjectBiography } from "@/components/museum/object-biography";
import { ObjectMemories } from "@/components/museum/object-memories";
import { Model3DView, Model3DToggle } from "@/components/museum/model-3d-view";
import { trackStat } from "@/lib/stats-client";
import { isPortraitImage, imageDimensions } from "@/lib/image-dimensions";
import type { ExhibitCategory, ExhibitDTO, SourceType } from "@/lib/types";
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
import { DeepZoom } from "@/components/museum/deep-zoom";
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

/**
 * Oder slike z naravnim razmerjem — kakor predstavitve predmetov
 * vodilnih muzejev (Rijksmuseum, Louvre): pokončne fotografije
 * (spomenik, portret, stran knjige) se pokažejo v celoti,
 * ležeče pa zasedejo širino brez izgube gradiva.
 */
function ExhibitImageStage({ exhibit, alt }: { exhibit: ExhibitDTO; alt: string }) {
  const src = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  const { width, height } = imageDimensions(src);
  const portrait = isPortraitImage(src);
  return (
    <div
      className={`relative w-full bg-muted${portrait ? " mx-auto" : ""}`}
      style={
        portrait
          ? {
              aspectRatio: `${width} / ${height}`,
              maxWidth: `min(calc(62vh * ${(width / height).toFixed(4)}), 420px)`,
            }
          : {
              aspectRatio: `${width} / ${height}`,
            }
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-contain"
      />
    </div>
  );
}

export function ExhibitDialog({
  exhibit,
  allExhibits = [],
  onClose,
  onShowOnMap,
  onOpenExhibit,
  onOpenTheme,
  onSlowLooking,
  onPuzzle,
  onPostcard,
  onDetail,
  walkContext = null,
}: {
  exhibit: ExhibitDTO | null;
  /** Cela zbirka — za povezane zapise v tem zapisu. */
  allExhibits?: ExhibitDTO[];
  onClose: () => void;
  onShowOnMap: (exhibit: ExhibitDTO) => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onOpenTheme?: (category: ExhibitCategory) => void;
  /** Počasno gledanje — vodeno razglabljanje tega zapisa. */
  onSlowLooking?: (exhibit: ExhibitDTO) => void;
  /** Sestavi sliko — sestavljanka s sliko tega zapisa. */
  onPuzzle?: (exhibit: ExhibitDTO) => void;
  /** Pošlji razglednico — e-razglednica s sliko tega zapisa. */
  onPostcard?: (exhibit: ExhibitDTO) => void;
  /** Izreži detajl — izrez slike zapisa v Mojo zbirko (Rijksstudio). */
  onDetail?: (exhibit: ExhibitDTO) => void;
  /** Aktivni muzejski sprehod — če je zapis odprt kot postaja sprehoda. */
  walkContext?: WalkContext | null;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const open = exhibit !== null;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSelected, toggleCompare } = useCompareSelection();
  const { isOnWalk, add, remove } = useMyWalk();

  // Približevalni ogled slike (deep zoom) — se preklopi nazaj ob naslednjem zapisu.
  const [zoomOpen, setZoomOpen] = React.useState(false);

  // 3D-ogled zapisa (model-viewer z AR) — samo za zapise z model3dUrl.
  const [modelOpen, setModelOpen] = React.useState(false);

  // Avdio: cel vodnik ali enominutna zgodba (če obstaja).
  const minuteAvailable = exhibit ? hasMinuteStory(exhibit.slug) : false;
  const [audioVariant, setAudioVariant] = React.useState<"full" | "minute">("full");

  // Povezani zapisi — ista tema / obdobje / vir / bližina (x Degrees lite).
  const related = React.useMemo(
    () => (exhibit ? relatedExhibits(exhibit, allExhibits, 3) : []),
    [exhibit, allExhibits]
  );

  // Kopiranje deljive povezave in citata zapisa (globoka povezava ?exhibit=<slug>).
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [citationState, setCitationState] = React.useState<"idle" | "ok" | "fail">("idle");
  React.useEffect(() => {
    setCopyState("idle");
    setCitationState("idle");
    setZoomOpen(false);
    setModelOpen(false);
    setAudioVariant("full");
  }, [exhibit?.slug]);

  // Statistika odprtja zapisa (zbirni anonimni števec — razpisno poročanje,
  // zahteva 1.18 RD MGTŠ; brez piškotkov, glej src/lib/stats-client.ts).
  const openSlug = exhibit?.slug;
  React.useEffect(() => {
    if (openSlug) trackStat("open", openSlug, lang);
  }, [openSlug, lang]);

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

            {/* Slika zapisa, približevalni ogled (deep zoom) ali 3D-ogled */}
            {modelOpen && exhibit?.model3dUrl ? (
              <div className="relative aspect-[16/10] w-full">
                <Model3DView exhibit={exhibit} />
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md border border-border/60 bg-background/85 p-0.5 backdrop-blur-sm">
                  <Model3DToggle active onToggle={() => setModelOpen(false)} />
                </div>
                {exhibit.model3dCredit && (
                  <p className="pointer-events-none absolute bottom-9 right-4 max-w-[80%] text-right text-[11px] leading-snug text-foreground/70">
                    {exhibit.model3dCredit}
                  </p>
                )}
              </div>
            ) : zoomOpen && exhibit ? (
              <div className="relative aspect-[16/10] w-full">
                <DeepZoom
                  src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                  alt={es.title(exhibit)}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3 size-11 bg-background/85 backdrop-blur-sm"
                  aria-label={t.zoom.close}
                  title={t.zoom.close}
                  onClick={() => setZoomOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <div className="relative w-full">
                <ExhibitImageStage
                  exhibit={exhibit}
                  alt={exhibit ? es.title(exhibit) : ""}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3 size-11 bg-background/70 backdrop-blur-sm"
                  aria-label={t.zoom.open}
                  title={t.zoom.open}
                  onClick={() => setZoomOpen(true)}
                >
                  <ZoomIn className="h-5 w-5" aria-hidden="true" />
                </Button>
                {exhibit?.model3dUrl && (
                  <div className="absolute left-3 top-3 rounded-md border border-border/60 bg-background/70 p-0.5 backdrop-blur-sm">
                    <Model3DToggle active={false} onToggle={() => { setZoomOpen(false); setModelOpen(true); }} />
                  </div>
                )}
                <p className="absolute bottom-3 right-4 max-w-[80%] text-right text-[11px] leading-snug text-foreground/70">
                  {exhibit?.imageCredit ?? t.collection.aiNote}
                </p>
              </div>
            )}
            {zoomOpen && exhibit?.imageCredit && (
              <p className="bg-black/5 px-4 py-2 text-right text-[11px] leading-snug text-muted-foreground">
                {exhibit.imageCredit}
              </p>
            )}

            <div className="px-6 pb-8 pt-5 sm:px-8">
              <DialogHeader className="items-start space-y-2 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{t.categories[exhibit.category]}</Badge>
                  <EvidenceBadge status={exhibit.evidenceStatus} />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {es.period(exhibit)}
                  </span>
                  <span className="ml-auto flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      aria-pressed={exhibit ? isSelected(exhibit.slug) : false}
                      aria-label={
                        exhibit && isSelected(exhibit.slug)
                          ? t.compare.removeDialog
                          : t.compare.addDialog
                      }
                      title={
                        exhibit && isSelected(exhibit.slug)
                          ? t.compare.removeDialog
                          : t.compare.addDialog
                      }
                      onClick={() => exhibit && toggleCompare(exhibit.slug)}
                    >
                      <Scale
                        className={
                          exhibit && isSelected(exhibit.slug)
                            ? "h-4 w-4 text-primary"
                            : "h-4 w-4"
                        }
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {exhibit && isSelected(exhibit.slug)
                          ? t.compare.added
                          : t.compare.add}
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      aria-pressed={exhibit ? isOnWalk(exhibit.slug) : false}
                      aria-label={
                        exhibit && isOnWalk(exhibit.slug)
                          ? t.myWalk.removeDialog
                          : t.myWalk.addDialog
                      }
                      title={
                        exhibit && isOnWalk(exhibit.slug)
                          ? t.myWalk.removeDialog
                          : t.myWalk.addDialog
                      }
                      onClick={() => {
                        if (!exhibit) return;
                        if (isOnWalk(exhibit.slug)) remove(exhibit.slug);
                        else add(exhibit.slug);
                      }}
                    >
                      <Route
                        className={
                          exhibit && isOnWalk(exhibit.slug)
                            ? "h-4 w-4 text-primary"
                            : "h-4 w-4"
                        }
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {exhibit && isOnWalk(exhibit.slug)
                          ? t.myWalk.added
                          : t.myWalk.addTo}
                      </span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      aria-pressed={isFavorite(exhibit.slug)}
                      aria-label={
                        isFavorite(exhibit.slug)
                          ? t.myMuseum.removeDialog
                          : t.myMuseum.saveDialog
                      }
                      onClick={() => toggleFavorite(exhibit.slug)}
                    >
                      <Heart
                        className={
                          isFavorite(exhibit.slug)
                            ? "h-4 w-4 fill-primary text-primary"
                            : "h-4 w-4"
                        }
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline">
                        {isFavorite(exhibit.slug)
                          ? t.myMuseum.saved
                          : t.myMuseum.save}
                      </span>
                    </Button>
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

              {/* Izkušnje zapisa — počasno gledanje, sestavljanka, razglednica, detajl */}
              {(onSlowLooking || onPuzzle || onPostcard || onDetail) && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {onSlowLooking && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      onClick={() => onSlowLooking(exhibit)}
                    >
                      <Wind className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{t.slow.open}</span>
                    </Button>
                  )}
                  {onPuzzle && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      onClick={() => onPuzzle(exhibit)}
                    >
                      <Puzzle className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{t.puzzle.open}</span>
                    </Button>
                  )}
                  {onPostcard && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      onClick={() => onPostcard(exhibit)}
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{t.postcard.open}</span>
                    </Button>
                  )}
                  {onDetail && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-9 gap-1.5"
                      onClick={() => onDetail(exhibit)}
                    >
                      <Crop className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{t.detail.open}</span>
                    </Button>
                  )}
                </div>
              )}

              {/* Avdio vodnik — cel ali v eni minuti (One Minute Wonders) */}
              <div className="mt-5 rounded-lg border border-border/70 bg-muted/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <AudioGuide exhibit={exhibit} variant={audioVariant} />
                  {minuteAvailable && (
                    <div
                      role="group"
                      aria-label={t.minute.variantLabel}
                      className="flex items-center rounded-md border border-border bg-card p-0.5"
                    >
                      {(["full", "minute"] as const).map((variant) => (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setAudioVariant(variant)}
                          aria-pressed={audioVariant === variant}
                          className="min-h-9 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors"
                          style={{
                            color:
                              audioVariant === variant
                                ? "var(--primary)"
                                : "var(--muted-foreground)",
                          }}
                        >
                          {variant === "full" ? t.minute.fullGuide : t.minute.minuteGuide}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Zgodba */}
              <div className="mt-6 space-y-4">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index} className="text-[16px] leading-[1.75] text-foreground/90 sm:text-[17px]">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Življenje predmeta — provenance časovnica (vzorec: Art Tracks) */}
              <ObjectBiography exhibit={exhibit} />

              {/* Spomini ob predmetu — skupnostna znanja (DigitaltMuseum/Tenement) */}
              <ObjectMemories exhibit={exhibit} />

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

              {/* Povezani zapisi — sorodnost z razlogom (vzorec: related objects + x Degrees) */}
              {related.length > 0 && (
                <section aria-labelledby="povezani-zapisi" className="mt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      id="povezani-zapisi"
                      className="font-display inline-flex items-center gap-2 text-lg font-semibold"
                    >
                      <Network className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                      {t.connect.relatedTitle}
                    </h3>
                    {onOpenTheme && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-11"
                        onClick={() => {
                          onOpenTheme(exhibit.category);
                          onClose();
                        }}
                      >
                        {t.themes.viewTheme}
                        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                  <ul className="museum-scroll mt-3 flex gap-4 overflow-x-auto pb-2">
                    {related.map((rel) => (
                      <li key={rel.exhibit.slug} className="w-44 shrink-0">
                        <button
                          type="button"
                          onClick={() => onOpenExhibit(rel.exhibit)}
                          className="group flex w-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card text-left shadow-sm transition-colors hover:border-primary/40"
                        >
                          <span className="relative block aspect-[4/3]">
                            <Image
                              src={rel.exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                              alt={es.title(rel.exhibit)}
                              fill
                              sizes="176px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          </span>
                          <span className="flex flex-1 flex-col gap-1.5 p-3">
                            <span className="line-clamp-2 text-sm font-semibold leading-snug">
                              {es.title(rel.exhibit)}
                            </span>
                            <span className="flex flex-wrap gap-1">
                              {rel.connections.slice(0, 2).map((conn) => (
                                <Badge
                                  key={conn.kind}
                                  variant="secondary"
                                  className="px-1.5 text-[10px] font-normal"
                                >
                                  {pick(lang, conn.labelSi, conn.labelEn)}
                                </Badge>
                              ))}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
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
                    {exhibit.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-h-9"
                        title={t.share.downloadImageTitle}
                        onClick={() => {
                          trackStat("download", exhibit.slug);
                          const a = window.document.createElement("a");
                          a.href = exhibit.image as string;
                          a.download = `${exhibit.slug}.jpg`;
                          window.document.body.appendChild(a);
                          a.click();
                          a.remove();
                        }}
                      >
                        <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        {t.share.downloadImage}
                      </Button>
                    )}
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
