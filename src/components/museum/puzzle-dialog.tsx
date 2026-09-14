"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Lightbulb, Link2, RotateCcw, Trophy } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PUZZLE_SIZES,
  freshSeed,
  getBestTime,
  isSolved,
  loadImageAspect,
  puzzleShareUrl,
  saveBestTime,
  shuffledTiles,
  type PuzzleSize,
} from "@/lib/puzzle";
import type { ExhibitDTO } from "@/lib/types";

function fmtClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Sestavi sliko — muzejska sestavljanka (vzorec: ZMA Puzzler, dnevne
 * muzejske igre). Ploščice se izmenjujejo s klikom/dotikom, zato je igra
 * dosegljiva z miško, dotikom in tipkovnico; vsaka zamenjava je dovoljena,
 * zato je vsako mešanje rešljivo.
 */
export function PuzzleDialog({
  exhibit,
  initialSize = 3,
  onClose,
}: {
  exhibit: ExhibitDTO | null;
  /** Začetna velikost (globoke povezave ?puzzle=…&kocke=…). */
  initialSize?: PuzzleSize;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const open = exhibit !== null;

  const [size, setSize] = React.useState<PuzzleSize>(3);
  const [tiles, setTiles] = React.useState<number[]>([]);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [moves, setMoves] = React.useState(0);
  const [startedAt, setStartedAt] = React.useState<number | null>(null);
  const [elapsed, setElapsed] = React.useState(0);
  const [hint, setHint] = React.useState(false);
  const [aspect, setAspect] = React.useState<number | null>(null);
  const [best, setBest] = React.useState<{ seconds: number; moves: number } | null>(null);
  const [newRecord, setNewRecord] = React.useState(false);
  const [shareState, setShareState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [announce, setAnnounce] = React.useState("");

  const slug = exhibit?.slug ?? null;
  const solved = React.useMemo(() => tiles.length > 0 && isSolved(tiles), [tiles]);
  const title = exhibit ? pick(lang, exhibit.titleSi, exhibit.titleEn) : "";
  const image = exhibit?.image ?? "/images/authentic/hero-griblje.jpg";

  // Nova igra ob novem zapisu ali velikosti.
  React.useEffect(() => {
    if (!slug) return;
    setSize(initialSize);
    setHint(false);
    setNewRecord(false);
    setShareState("idle");
    setBest(getBestTime(slug, initialSize));
    setStartedAt(null);
    setElapsed(0);
    setMoves(0);
    setSelected(null);
    setTiles(shuffledTiles(initialSize, freshSeed(slug)));
    setAnnounce("");
    let cancelled = false;
    loadImageAspect(exhibit!).then((ratio) => {
      if (!cancelled) setAspect(ratio);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const restart = React.useCallback(
    (nextSize: PuzzleSize) => {
      if (!slug) return;
      setSize(nextSize);
      setTiles(shuffledTiles(nextSize, freshSeed(slug)));
      setSelected(null);
      setMoves(0);
      setStartedAt(null);
      setElapsed(0);
      setNewRecord(false);
      setBest(getBestTime(slug, nextSize));
      setAnnounce(t.puzzle.reshuffled);
    },
    [slug, t]
  );

  // Ura teče od prve poteze do rešitve.
  React.useEffect(() => {
    if (startedAt === null || solved) return;
    const tick = window.setInterval(() => {
      if (!document.hidden) setElapsed(Date.now() - startedAt);
    }, 500);
    return () => window.clearInterval(tick);
  }, [startedAt, solved]);

  const onTileClick = (index: number) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    const next = [...tiles];
    [next[selected], next[index]] = [next[index], next[selected]];
    setTiles(next);
    setMoves((prev) => prev + 1);
    setSelected(null);
    if (startedAt === null) setStartedAt(Date.now());
    if (isSolved(next) && slug) {
      const seconds = Math.round((Date.now() - (startedAt ?? Date.now())) / 1000);
      const record = saveBestTime(slug, size, seconds, moves + 1);
      setNewRecord(record);
      setBest(getBestTime(slug, size));
      setAnnounce(t.puzzle.solvedTitle);
    }
  };

  const shareInvitation = async () => {
    if (!exhibit) return;
    const url = puzzleShareUrl(exhibit.slug, size);
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
      else {
        const area = document.createElement("textarea");
        area.value = url;
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }
      setShareState("ok");
    } catch {
      setShareState("fail");
    }
    window.setTimeout(() => setShareState("idle"), 2600);
  };

  if (!exhibit) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="gap-0 sm:max-w-xl">
        <DialogTitle className="font-display text-xl font-semibold sm:text-2xl">
          {t.puzzle.title}
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          {t.puzzle.subtitle(title)}
        </DialogDescription>

        <p aria-live="polite" className="sr-only">{announce}</p>

        {/* Igralna plošča */}
        <div className="mt-4">
          <div
            role="grid"
            aria-label={t.puzzle.boardLabel}
            className="relative mx-auto w-full select-none overflow-hidden rounded-lg border border-border bg-muted"
            style={{ aspectRatio: aspect ? String(aspect) : "2 / 1", maxWidth: 560 }}
          >
            <div
              className="grid h-full w-full"
              style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
              {tiles.map((tile, index) => {
                const col = tile % size;
                const row = Math.floor(tile / size);
                const isSelected = selected === index;
                const isCorrect = tile === index;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={solved}
                    onClick={() => onTileClick(index)}
                    aria-label={
                      `${t.puzzle.tileLabel(Math.floor(index / size) + 1, (index % size) + 1)}` +
                      (isCorrect ? `, ${t.puzzle.tileCorrect}` : "") +
                      (isSelected ? `, ${t.puzzle.tileSelected}` : "")
                    }
                    aria-pressed={isSelected}
                    className={cn(
                      "group relative min-w-0 bg-cover bg-no-repeat transition-[filter,outline-color] outline-2 outline-transparent focus-visible:outline-ring",
                      !solved && "cursor-pointer hover:brightness-105",
                      isSelected && "outline-primary z-10 brightness-110",
                      isCorrect && !solved && "opacity-90"
                    )}
                    style={{
                      backgroundImage: `url(${image})`,
                      backgroundSize: `${size * 100}% ${size * 100}%`,
                      backgroundPosition:
                        size > 1
                          ? `${(col / (size - 1)) * 100}% ${(row / (size - 1)) * 100}%`
                          : "center",
                      boxShadow: "inset 0 0 0 1px var(--background)",
                    }}
                  >
                    {hint && !solved && (
                      <span className="absolute bottom-0.5 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/85 text-[10px] font-bold text-foreground tabular-nums">
                        {tile + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rešitev */}
          {solved && (
            <div
              className="mt-3 rounded-lg border border-primary/40 bg-primary/5 p-4 text-center"
              role="status"
            >
              <p className="font-display text-lg font-semibold text-primary">
                {t.puzzle.solvedTitle}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.puzzle.solvedBody(title)} · {fmtClock(elapsed)} ·{" "}
                {t.puzzle.moves(moves)}
              </p>
              {newRecord && (
                <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                  <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                  {t.puzzle.newRecord}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-10 gap-1.5"
                  onClick={shareInvitation}
                >
                  {shareState === "ok" ? (
                    <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  ) : (
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                  )}
                  {shareState === "ok"
                    ? t.share.copied
                    : shareState === "fail"
                      ? t.share.copyFailed
                      : t.puzzle.share}
                </Button>
                <Button
                  size="sm"
                  className="min-h-10 gap-1.5"
                  onClick={() => restart(size)}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {t.puzzle.newGame}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Upravljanje */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div
            role="group"
            aria-label={t.puzzle.sizeLabel}
            className="flex items-center rounded-md border border-border bg-card p-0.5"
          >
            {PUZZLE_SIZES.map((option) => (
              <button
                key={option.size}
                type="button"
                onClick={() => restart(option.size)}
                aria-pressed={size === option.size}
                className={cn(
                  "min-h-9 rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
                  size === option.size
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pick(lang, option.labelSi, option.labelEn)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono tabular-nums" role="timer" aria-label={t.puzzle.timeLabel}>
              {fmtClock(elapsed)}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="tabular-nums">{t.puzzle.moves(moves)}</span>
            {best && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                <Trophy className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                {t.puzzle.bestValue(fmtClock(best.seconds * 1000), best.moves)}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="min-h-9 gap-1.5"
              onClick={() => setHint((prev) => !prev)}
              aria-pressed={hint}
              aria-label={t.puzzle.hintLabel}
            >
              <Lightbulb
                className={cn("h-4 w-4", hint && "text-primary")}
                aria-hidden="true"
              />
              <span className="hidden sm:inline">{t.puzzle.hint}</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => restart(size)}
              aria-label={t.puzzle.reshuffleLabel}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Predloga + navodilo */}
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-border/70 bg-muted/40 p-3">
          <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-md border border-border">
            <Image src={image} alt={t.puzzle.preview} fill sizes="96px" className="object-cover" />
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.puzzle.howTo} {t.puzzle.previewNote}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
