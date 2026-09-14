"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Footprints,
  Link2,
  Route,
  Trash2,
  X,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useMyWalk } from "@/lib/my-walk-tracker";
import { walkMinutes } from "@/lib/walks";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";

/**
 * Moj sprehod — urejena pot, ki si jo obiskovalec sestavi sam.
 * Vzorec: obiskovalne poti Louvra (visitor trails) in »Collections«
 * Rijksmuseuma: izbrane zapise razvrsti v lastno pot, ki se nato
 * zažene kot vsak vodeni ogled muzeja.
 */
export function MyWalkSection({
  exhibits,
  onOpenExhibit,
  onNavigate,
  onStartWalk,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: "zbirka") => void;
  onStartWalk: () => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const { slugs, count, remove, move, clear } = useMyWalk();
  const reduceMotion = useReducedMotion();

  const stops = React.useMemo(
    () =>
      slugs
        .map((slug) => exhibits.find((ex) => ex.slug === slug))
        .filter((ex): ex is ExhibitDTO => Boolean(ex)),
    [slugs, exhibits]
  );

  const [shareState, setShareState] = React.useState<"idle" | "ok" | "fail">("idle");
  React.useEffect(() => {
    if (shareState === "idle") return;
    const timer = window.setTimeout(() => setShareState("idle"), 2600);
    return () => window.clearTimeout(timer);
  }, [shareState]);

  const copyWalk = async () => {
    const lines = stops.map(
      (ex) => `- ${es.title(ex)} — ${window.location.origin}/?exhibit=${ex.slug}`
    );
    const header = pick(
      lang,
      `Muzej vasi Griblje — moj sprehod (${count} ${count === 1 ? "postaja" : "postaj"}):`,
      `Griblje Village Museum — my walk (${count} ${count === 1 ? "stop" : "stops"}):`
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

  return (
    <section className="mt-14" aria-labelledby="moj-sprehod">
      <div className="max-w-2xl">
        <h2
          id="moj-sprehod"
          className="font-display flex items-center gap-2.5 text-3xl font-semibold"
        >
          <Route className="h-7 w-7 text-primary" aria-hidden="true" />
          {t.myWalk.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t.myWalk.subtitle}
        </p>
      </div>

      {count === 0 || stops.length === 0 ? (
        <div className="mt-6 mx-auto max-w-lg rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Footprints className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="font-display mt-4 text-xl font-semibold">
            {t.myWalk.emptyTitle}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t.myWalk.emptyText}
          </p>
          <Button className="mt-6 min-h-11" onClick={() => onNavigate("zbirka")}>
            {t.myWalk.emptyCta}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button className="min-h-11" onClick={onStartWalk}>
              <Footprints className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
              {t.myWalk.start}
            </Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              {t.walks.stops(stops.length)} · {t.walks.minutes(walkMinutes(stops.length))}
            </span>
            <Button
              variant="outline"
              className="min-h-11"
              onClick={copyWalk}
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
                  : t.myWalk.share}
            </Button>
            <p className="hidden text-sm text-muted-foreground lg:inline">
              {t.myWalk.shareHint}
            </p>
          </div>

          <ol className="mt-6 space-y-3">
            {stops.map((exhibit, index) => (
              <motion.li
                key={exhibit.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
                layout
              >
                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-card p-3 sm:flex-nowrap">
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenExhibit(exhibit)}
                    className="relative block size-14 shrink-0 overflow-hidden rounded-md"
                    aria-label={`${t.myWalk.stopOf(index + 1)}: ${es.title(exhibit)}`}
                  >
                    <Image
                      src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                      alt={es.title(exhibit)}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenExhibit(exhibit)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="sr-only">{t.myWalk.stopOf(index + 1)}: </span>
                    <span className="block truncate font-medium leading-snug">
                      {es.title(exhibit)}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {es.period(exhibit)}
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11"
                      aria-label={`${t.myWalk.moveUp}: ${es.title(exhibit)}`}
                      title={t.myWalk.moveUp}
                      disabled={index === 0}
                      onClick={() => move(exhibit.slug, -1)}
                    >
                      <ArrowUp className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11"
                      aria-label={`${t.myWalk.moveDown}: ${es.title(exhibit)}`}
                      title={t.myWalk.moveDown}
                      disabled={index === stops.length - 1}
                      onClick={() => move(exhibit.slug, 1)}
                    >
                      <ArrowDown className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-11 text-muted-foreground hover:text-foreground"
                      aria-label={`${t.myWalk.remove}: ${es.title(exhibit)}`}
                      title={t.myWalk.remove}
                      onClick={() => remove(exhibit.slug)}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="min-h-11 text-muted-foreground hover:text-foreground"
              onClick={clear}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.myWalk.clear}
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
