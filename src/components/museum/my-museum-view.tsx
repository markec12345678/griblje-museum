"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Clapperboard, Frame, Heart, Link2, Trash2 } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useFavorites } from "@/lib/favorite-tracker";
import { MyWalkSection } from "@/components/museum/my-walk-section";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Moja zbirka — osebna galerija shranjenih zapisov.
 *
 * Vzorec: Rijksmuseum Rijksstudio (zbiranje del v lastno galerijo),
 * Louvre »Mes favoris« in Nasjonalmuseet »My Collection« — brez računa:
 * zbirka živi v brskalniku obiskovalca in se deli kot seznam z globokimi
 * povezavami.
 */
export function MyMuseumView({
  exhibits,
  onOpenExhibit,
  onNavigate,
  onStartMyWalk,
  onOpenGallery,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: "zbirka") => void;
  onStartMyWalk: () => void;
  onOpenGallery: (mode: "soba" | "film") => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const { favorites, favoritesCount } = useFavorites();
  const reduceMotion = useReducedMotion();

  const saved = React.useMemo(
    () => exhibits.filter((ex) => favorites.has(ex.slug)),
    [exhibits, favorites]
  );

  // Kopiranje zbirke kot deljiv seznam (naslovi + globoke povezave).
  const [shareState, setShareState] = React.useState<"idle" | "ok" | "fail">("idle");
  React.useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2600);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const copyCollection = async () => {
    const lines = saved.map(
      (ex) =>
        `- ${es.title(ex)} — ${window.location.origin}/?exhibit=${ex.slug}`
    );
    const header = pick(
      lang,
      `Muzej vasi Griblje — moja zbirka (${saved.length} ${saved.length === 1 ? "zapis" : "zapisov"}):`,
      `Griblje Village Museum — my collection (${saved.length} ${saved.length === 1 ? "record" : "records"}):`
    );
    const text = [header, ...lines].join("\n");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const area = document.createElement("textarea");
        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setShareState("ok");
    } catch {
      setShareState("fail");
    }
  };

  const percent = exhibits.length > 0 ? Math.round((saved.length / exhibits.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">
          {t.myMuseum.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{t.myMuseum.subtitle}</p>
      </div>

      {/* Napredek zbirke */}
      <div className="mt-8 max-w-xl rounded-xl border border-border/70 bg-card p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-medium">{t.myMuseum.progressLabel}</p>
          <p className="font-display text-2xl font-semibold text-primary" aria-live="polite">
            {saved.length}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {exhibits.length}
            </span>
          </p>
        </div>
        <Progress
          value={percent}
          className="mt-3 h-2"
          aria-label={`${percent}% ${t.myMuseum.progressLabel}`}
        />
      </div>

      {/* Moj sprehod — osebna, urejena pot skozi zbirko */}
      <MyWalkSection
        exhibits={exhibits}
        onOpenExhibit={onOpenExhibit}
        onNavigate={onNavigate}
        onStartWalk={onStartMyWalk}
      />

      {saved.length === 0 ? (
        <div className="mt-12 mx-auto max-w-lg rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="font-display mt-4 text-xl font-semibold">{t.myMuseum.emptyTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t.myMuseum.emptyText}
          </p>
          <Button className="mt-6 min-h-11" onClick={() => onNavigate("zbirka")}>
            {t.myMuseum.emptyCta}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              className="min-h-11"
              onClick={() => onOpenGallery("soba")}
            >
              <Frame className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.gallery.title}
            </Button>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={() => onOpenGallery("film")}
            >
              <Clapperboard className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.gallery.filmMode}
            </Button>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={copyCollection}
              aria-live="polite"
            >
              {shareState === "ok" ? (
                <Check className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
              ) : (
                <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {shareState === "ok"
                ? t.share.copied
                : shareState === "fail"
                  ? t.share.copyFailed
                  : t.myMuseum.share}
            </Button>
          </div>
          <p aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {t.myMuseum.shareHint}
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((exhibit, index) => (
              <motion.li
                key={exhibit.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                layout
              >
                <article className="group h-full overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-lg">
                  <button
                    type="button"
                    onClick={() => onOpenExhibit(exhibit)}
                    className="block w-full text-left"
                    aria-label={`${t.myMuseum.open}: ${es.title(exhibit)}`}
                  >
                    <span className="relative block aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                        alt={es.title(exhibit)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span
                        className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{t.categories[exhibit.category]}</Badge>
                      <EvidenceBadge status={exhibit.evidenceStatus} />
                    </div>
                    <h2 className="font-display mt-2 text-lg font-semibold leading-snug">
                      {es.title(exhibit)}
                    </h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {es.period(exhibit)}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        className="min-h-11"
                        onClick={() => onOpenExhibit(exhibit)}
                      >
                        {t.myMuseum.open}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="min-h-11 px-3 text-muted-foreground hover:text-foreground"
                        aria-label={`${t.myMuseum.remove}: ${es.title(exhibit)}`}
                        title={t.myMuseum.remove}
                        onClick={() => {
                          import("@/lib/favorite-tracker").then((m) =>
                            m.removeFavorite(exhibit.slug)
                          );
                        }}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
