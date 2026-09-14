"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Check, Link2, Pause, Play, Plus, SkipForward, Wind, X } from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useA11y } from "@/lib/a11y";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  SLOW_PHASES,
  SLOW_PRESETS,
  getSlowPreset,
  getSlowNote,
  phaseDuration,
  saveSlowNote,
  slowPhasePrompt,
  slowPhaseTitle,
  slowShareUrl,
  totalDuration,
  type SlowPresetId,
} from "@/lib/slow-looking";
import type { ExhibitDTO } from "@/lib/types";

function fmtClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

type Stage = "intro" | "faza" | "zakljucek";

/**
 * Počasno gledanje — celozaslonsko vodeno razglabljanje enega zapisa
 * (vzorec: MoMA Slow Looking, Tate, Slow Art Day). Faze so časovno
 * raztegljive (+30 s), pavza in preskok sta vedno na voljo (WCAG 2.2.1),
 * ura se ustavi tudi samodejno, ko zavihek ni viden.
 */
export function SlowLooking({
  exhibit,
  onClose,
}: {
  exhibit: ExhibitDTO | null;
  onClose: () => void;
}) {
  const { t, lang } = useLang();
  const { settings } = useA11y();
  const reduceMotion = useReducedMotion();
  const calm = settings.calmMotion || reduceMotion === true;

  const [stage, setStage] = React.useState<Stage>("intro");
  const [preset, setPreset] = React.useState<SlowPresetId>("mirni");
  const [phaseIndex, setPhaseIndex] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0); // ms v trenutni fazi
  const [extra, setExtra] = React.useState(0); // podaljšanje trenutne faze
  const [spent, setSpent] = React.useState(0); // skupaj aktivnega časa
  const [paused, setPaused] = React.useState(false);
  const [announce, setAnnounce] = React.useState("");
  const [note, setNote] = React.useState("");
  const [noteSaved, setNoteSaved] = React.useState(false);
  const [shareState, setShareState] = React.useState<"idle" | "ok" | "fail">("idle");

  const open = exhibit !== null;

  // Ponastavitev ob novem zapisu.
  React.useEffect(() => {
    if (!exhibit) return;
    setStage("intro");
    setPreset("mirni");
    setPhaseIndex(0);
    setElapsed(0);
    setExtra(0);
    setSpent(0);
    setPaused(false);
    setNote(getSlowNote(exhibit.slug));
    setNoteSaved(false);
    setShareState("idle");
    setAnnounce("");
  }, [exhibit?.slug]);

  const phase = SLOW_PHASES[phaseIndex];
  const phaseMs = phaseDuration(phase, preset) + extra;

  // Ura — teče iz razlik Date.now(), ne šteje pavz in zamrznjenih zavihkov.
  React.useEffect(() => {
    if (stage !== "faza" || paused) return;
    let last = Date.now();
    const tick = window.setInterval(() => {
      const now = Date.now();
      const delta = now - last;
      last = now;
      if (document.hidden) return;
      setElapsed((prev) => prev + delta);
      setSpent((prev) => prev + delta);
    }, 250);
    return () => window.clearInterval(tick);
  }, [stage, paused, phaseIndex]);

  // Skrit zavihek → samodejna pavza (vsak časovni pritisk je prijazen).
  React.useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Prehod v naslednjo fazo ob izteku časa.
  React.useEffect(() => {
    if (stage !== "faza") return;
    if (elapsed < phaseMs) return;
    if (phaseIndex < SLOW_PHASES.length - 1) {
      const next = SLOW_PHASES[phaseIndex + 1];
      setPhaseIndex(phaseIndex + 1);
      setElapsed(0);
      setExtra(0);
      setAnnounce(t.slow.phaseDone(pick(lang, next.titleSi, next.titleEn)));
    } else {
      setStage("zakljucek");
      setAnnounce(t.slow.doneTitle);
    }
  }, [elapsed, phaseMs, phaseIndex, stage, lang, t]);

  const extendPhase = () => {
    setExtra((prev) => prev + 30_000);
    setAnnounce(t.slow.extendDone);
  };

  const skipPhase = () => {
    if (phaseIndex < SLOW_PHASES.length - 1) {
      const next = SLOW_PHASES[phaseIndex + 1];
      setPhaseIndex(phaseIndex + 1);
      setElapsed(0);
      setExtra(0);
      setAnnounce(t.slow.phaseDone(pick(lang, next.titleSi, next.titleEn)));
    } else {
      setStage("zakljucek");
    }
  };

  const saveNoteNow = (value: string) => {
    setNote(value);
    if (!exhibit) return;
    saveSlowNote(exhibit.slug, value);
    setNoteSaved(value.trim().length > 0);
  };

  const shareInvitation = async () => {
    if (!exhibit) return;
    const text = `${t.slow.shareText(pick(lang, exhibit.titleSi, exhibit.titleEn))} ${slowShareUrl(exhibit.slug)}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text;
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

  const image = exhibit.image ?? "/images/authentic/hero-griblje.jpg";
  const title = pick(lang, exhibit.titleSi, exhibit.titleEn);
  const remaining = Math.max(0, phaseMs - elapsed);
  const ringFraction = phaseMs > 0 ? remaining / phaseMs : 0;
  const RING_C = 2 * Math.PI * 52;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="h-[100dvh] w-full max-w-none gap-0 overflow-hidden border-0 bg-background p-0 sm:max-w-none sm:rounded-none sm:border-0"
      >
        <DialogTitle className="sr-only">{`${t.slow.ariaLabel}: ${title}`}</DialogTitle>
        <DialogDescription className="sr-only">{t.slow.ariaDesc}</DialogDescription>

        {/* Slikovna plast z zelo počasnim približevanjem (mirni način jo
            izklopi — tako kot sistemska nastavitev prefers-reduced-motion). */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className={cn("object-cover opacity-45 dark:opacity-35", !calm && "slow-zoom")}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background/85" />
        </div>

        <p aria-live="polite" className="sr-only">{announce}</p>

        {stage === "intro" && (
          <div className="relative z-10 flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wind className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="font-display mt-4 text-2xl font-semibold sm:text-3xl">
              {t.slow.introTitle}
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              {t.slow.introLead(title)}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t.slow.introBody}
            </p>

            <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.slow.chooseLength}
            </p>
            <div
              role="radiogroup"
              aria-label={t.slow.chooseLength}
              className="mt-3 grid w-full max-w-2xl gap-3 sm:grid-cols-3"
            >
              {SLOW_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={preset === p.id}
                  onClick={() => setPreset(p.id)}
                  className={cn(
                    "flex min-h-11 flex-col items-center gap-1 rounded-xl border p-4 transition-colors",
                    preset === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card/80 text-foreground hover:border-primary/50"
                  )}
                >
                  <span className="font-display text-base font-semibold">
                    {pick(lang, p.labelSi, p.labelEn)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {pick(lang, p.hintSi, p.hintEn)} · {fmtClock(totalDuration(p.id))}
                  </span>
                </button>
              ))}
            </div>

            <Button
              size="lg"
              className="mt-8 min-h-12 px-8 text-base"
              onClick={() => {
                setStage("faza");
                setElapsed(0);
                setExtra(0);
                setSpent(0);
                setAnnounce(t.slow.phaseDone(slowPhaseTitle(SLOW_PHASES[0], lang)));
              }}
            >
              {t.slow.start}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 min-h-11"
              onClick={onClose}
            >
              <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
              {t.common.close}
            </Button>
            <p className="mt-4 max-w-md text-xs italic text-muted-foreground">
              {t.slow.hint}
            </p>
          </div>
        )}

        {stage === "faza" && (
          <div className="relative z-10 flex h-full flex-col">
            {/* Zgornja vrstica: izhod + potek faz */}
            <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
              <Button
                variant="secondary"
                size="sm"
                className="min-h-9 gap-1.5 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {t.slow.exitLabel}
              </Button>
              <div className="flex items-center gap-2" aria-hidden="true">
                {SLOW_PHASES.map((p, i) => (
                  <span
                    key={p.id}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i < phaseIndex
                        ? "w-6 bg-primary/60"
                        : i === phaseIndex
                          ? "w-10 bg-primary"
                          : "w-6 bg-primary/20"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Sredina: vprašanje faze */}
            <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {t.slow.phaseOf(phaseIndex + 1, SLOW_PHASES.length)} ·{" "}
                {slowPhaseTitle(phase, lang)}
              </p>
              <p className="font-display max-w-2xl text-balance text-xl font-medium leading-relaxed sm:text-2xl">
                {slowPhasePrompt(phase, exhibit, lang)}
              </p>

              {/* Ura — krožni odštevalnik trenutne faze */}
              <div className="relative mt-2" role="timer" aria-label={t.slow.timeLeft(fmtClock(remaining))}>
                <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary/15" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    className="text-primary"
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C * (1 - ringFraction)}
                    transform="rotate(-90 60 60)"
                    style={{ transition: "stroke-dashoffset 0.3s linear" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xl font-semibold tabular-nums">
                  {fmtClock(remaining)}
                </span>
              </div>
              {paused && (
                <p className="text-sm font-medium text-accent">{t.slow.paused}</p>
              )}
            </div>

            {/* Spodnja vrstica: pavza, podaljšaj, preskoči */}
            <div className="flex items-center justify-center gap-3 px-6 pb-8">
              <Button
                variant="outline"
                size="icon"
                className="size-12 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => setPaused((prev) => !prev)}
                aria-label={paused ? t.slow.resumeLabel : t.slow.pauseLabel}
              >
                {paused ? (
                  <Play className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
              <Button
                variant="outline"
                className="min-h-12 gap-1.5 rounded-full bg-background/80 px-5 backdrop-blur-sm"
                onClick={extendPhase}
                aria-label={t.slow.extendLabel}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t.slow.extend}
              </Button>
              <Button
                variant="outline"
                className="min-h-12 gap-1.5 rounded-full bg-background/80 px-5 backdrop-blur-sm"
                onClick={skipPhase}
                aria-label={t.slow.skipLabel}
              >
                <SkipForward className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.slow.skipLabel}</span>
              </Button>
            </div>
          </div>
        )}

        {stage === "zakljucek" && (
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 overflow-y-auto px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              {t.slow.doneTitle}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {t.slow.doneBody}
            </p>
            <p className="rounded-full bg-muted px-4 py-1.5 font-mono text-sm font-semibold tabular-nums">
              {t.slow.totalLabel(fmtClock(spent))}
            </p>

            {/* Zasebni zapisek — shrani se izključno v brskalnik. */}
            <div className="mt-2 w-full max-w-xl text-left">
              <label htmlFor="slow-note" className="text-sm font-semibold">
                {t.slow.noteLabel}
              </label>
              <p className="mt-0.5 text-xs text-muted-foreground">{t.slow.noteHint}</p>
              <Textarea
                id="slow-note"
                value={note}
                maxLength={280}
                rows={3}
                placeholder={t.slow.notePlaceholder}
                className="mt-2 bg-background/90"
                onChange={(event) => saveNoteNow(event.target.value)}
              />
              <p aria-live="polite" className="mt-1 h-4 text-xs text-primary">
                {noteSaved ? t.slow.noteSaved : ""}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="outline"
                className="min-h-11 gap-1.5"
                onClick={shareInvitation}
                aria-label={t.slow.shareLabel}
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
                    : t.slow.share}
              </Button>
              <Button className="min-h-11" onClick={onClose}>
                {t.slow.close}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
