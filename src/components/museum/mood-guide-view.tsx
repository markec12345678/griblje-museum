"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Footprints,
  Headphones,
  Heart,
  Link2,
  RotateCcw,
  Scale,
  Sparkles,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { useFavorites } from "@/lib/favorite-tracker";
import { useCompareSelection } from "@/lib/compare-tracker";
import {
  MOOD_QUESTIONS,
  buildMoodSelection,
  getChip,
} from "@/lib/mood-guide";
import type { ExhibitDTO } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Vodnik po razpoloženju — tri vprašanja, en izbor.
 *
 * Vzorec: Art Explorer nove zbirke Rijksmuseuma (2024): »Odgovorite na
 * vprašanje in pustite, da vas zbirka preseneti.« Pri velikih muzejih
 * deluje CLIP-model; tukaj odloča razložljiv slovar — vsak zadetek
 * pove svoj razlog, izbor pa se da deliti z globoko povezavo.
 */

const MOOD_STORAGE_KEY = "mvg-mood";

export function MoodGuideView({
  exhibits,
  initialAnswers,
  onOpenExhibit,
  onNavigate,
  onStartWalk,
}: {
  exhibits: ExhibitDTO[];
  /** Odgovori iz globoke povezave ?mood= — takoj pokaže izbor. */
  initialAnswers?: Record<string, string>;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: "domov") => void;
  onStartWalk: (walkId: string) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSelected, toggleCompare } = useCompareSelection();

  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [step, setStep] = React.useState(0); // 0..2 vprašanja, 3 = izbor
  const [copyState, setCopyState] = React.useState<"idle" | "ok" | "fail">("idle");
  const [lastAnswers, setLastAnswers] = React.useState<Record<string, string> | null>(null);

  // Globova povezava ?mood=a,b,c → takoj izbor. Varna obrnova podatka.
  React.useEffect(() => {
    const parsed: Record<string, string> = {};
    if (initialAnswers) {
      for (const q of MOOD_QUESTIONS) {
        const chipId = initialAnswers[q.id];
        if (chipId && getChip(q.id, chipId)) parsed[q.id] = chipId;
      }
    }
    if (Object.keys(parsed).length === MOOD_QUESTIONS.length) {
      setAnswers(parsed);
      setStep(MOOD_QUESTIONS.length);
    }
  }, [initialAnswers]);

  // Zadnji izbor za »ponovi«.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(MOOD_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        const valid: Record<string, string> = {};
        for (const q of MOOD_QUESTIONS) {
          const chipId = parsed[q.id];
          if (typeof chipId === "string" && getChip(q.id, chipId)) {
            valid[q.id] = chipId;
          }
        }
        if (Object.keys(valid).length === MOOD_QUESTIONS.length) {
          setLastAnswers(valid);
        }
      }
    } catch {
      /* zasebni način ipd. — brez zadnjega izbora */
    }
  }, []);

  const finished = step >= MOOD_QUESTIONS.length;
  const selection = React.useMemo(
    () => (finished ? buildMoodSelection(exhibits, answers) : []),
    [finished, exhibits, answers]
  );

  const answer = (questionId: string, chipId: string) => {
    const next = { ...answers, [questionId]: chipId };
    setAnswers(next);
    setStep((s) => Math.min(s + 1, MOOD_QUESTIONS.length));
    if (Object.keys(next).length === MOOD_QUESTIONS.length) {
      try {
        window.localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* brez pomnjenja — ni usodno */
      }
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const replayLast = () => {
    if (!lastAnswers) return;
    setAnswers(lastAnswers);
    setStep(MOOD_QUESTIONS.length);
  };

  const shareSelection = async () => {
    const chipIds = MOOD_QUESTIONS.map((q) => answers[q.id]).filter(Boolean);
    const url = `${window.location.origin}/?mood=${chipIds.join(",")}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    window.setTimeout(() => setCopyState("idle"), 2600);
  };

  const timeChip = answers["cas"];
  const question = MOOD_QUESTIONS[Math.min(step, MOOD_QUESTIONS.length - 1)];

  /* ------------------------------- Vprašanja ----------------------------- */
  if (!finished) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          {t.mood.kicker}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
          {t.mood.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{t.mood.subtitle}</p>

        {/* Napredek */}
        <ol className="mt-8 flex items-center gap-2" aria-label={t.mood.progress}>
          {MOOD_QUESTIONS.map((q, i) => (
            <li key={q.id} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                  i < step
                    ? "border-primary bg-primary text-primary-foreground"
                    : i === step
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
              </span>
              {i < MOOD_QUESTIONS.length - 1 && (
                <span aria-hidden="true" className="h-px w-6 bg-border sm:w-10" />
              )}
            </li>
          ))}
        </ol>

        <motion.div
          key={question.id}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-10"
        >
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {t.mood.questionOf(step + 1, MOOD_QUESTIONS.length)}
          </p>
          <h2 className="font-display mt-2 text-3xl font-semibold">
            {pick(lang, question.titleSi, question.titleEn)}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {pick(lang, question.subtitleSi, question.subtitleEn)}
          </p>

          <div
            role="group"
            aria-label={pick(lang, question.titleSi, question.titleEn)}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {question.chips.map((chip) => {
              const active = answers[question.id] === chip.id;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => answer(question.id, chip.id)}
                  aria-pressed={active}
                  className={`min-h-16 rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    active
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="font-display text-lg font-semibold leading-snug">
                    {pick(lang, chip.labelSi, chip.labelEn)}
                  </span>
                  {active && (
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      <Check className="h-4 w-4" aria-hidden="true" />
                      {t.mood.chosen}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          {step > 0 && (
            <Button
              variant="ghost"
              className="min-h-11"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.mood.back}
            </Button>
          )}
          {lastAnswers && (
            <Button
              variant="outline"
              className="min-h-11"
              onClick={replayLast}
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.mood.replay}
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* --------------------------------- Izbor -------------------------------- */
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t.mood.kicker}
        </p>
        <h1 className="font-display mt-2 text-4xl font-semibold sm:text-5xl">
          {t.mood.resultsTitle}
        </h1>
        <p className="mt-3 text-muted-foreground" aria-live="polite">
          {t.mood.resultsSub(selection.length)}
        </p>
        {/* Povzetek odgovorov */}
        <ul className="mt-4 flex flex-wrap gap-2">
          {MOOD_QUESTIONS.map((q) => {
            const chip = answers[q.id] ? getChip(q.id, answers[q.id]) : undefined;
            if (!chip) return null;
            return (
              <li key={q.id}>
                <Badge variant="secondary" className="font-normal">
                  {pick(lang, chip.labelSi, chip.labelEn)}
                </Badge>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="outline" className="min-h-11" onClick={restart}>
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          {t.mood.restart}
        </Button>
        <Button variant="outline" className="min-h-11" onClick={shareSelection}>
          <Link2 className="mr-2 h-4 w-4" aria-hidden="true" />
          {copyState === "ok" ? t.mood.shared : t.mood.share}
        </Button>
      </div>

      {/* Mreža izbora */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {selection.map((result, index) => (
          <motion.div
            key={result.exhibit.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
            className="flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
          >
            <button
              type="button"
              onClick={() => onOpenExhibit(result.exhibit)}
              className="group relative aspect-[4/3] overflow-hidden text-left"
              aria-label={`${t.collection.openRecord}: ${es.title(result.exhibit)}`}
            >
              <Image
                src={result.exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                alt={es.title(result.exhibit)}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3">
                <Badge className="border-border/60 bg-background/85 text-foreground backdrop-blur-sm">
                  {t.categories[result.exhibit.category]}
                </Badge>
              </span>
            </button>
            <div className="flex flex-1 flex-col gap-2.5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {es.period(result.exhibit)}
                </span>
                <EvidenceBadge status={result.exhibit.evidenceStatus} />
              </div>
              <h2 className="font-display text-xl font-semibold leading-snug">
                {es.title(result.exhibit)}
              </h2>
              {/* Zakaj je zapis v izboru — razložljiv slovar, ne model */}
              {result.reasons.length > 0 && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t.mood.why}{" "}
                  {result.reasons
                    .slice(0, 2)
                    .map((r) => pick(lang, r.labelSi, r.labelEn))
                    .join("; ")}.
                </p>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Button
                  size="sm"
                  className="min-h-11"
                  onClick={() => onOpenExhibit(result.exhibit)}
                >
                  {t.collection.openRecord}
                </Button>
                <Button
                  size="sm"
                  variant={isFavorite(result.exhibit.slug) ? "secondary" : "outline"}
                  className="min-h-11"
                  onClick={() => toggleFavorite(result.exhibit.slug)}
                  aria-pressed={isFavorite(result.exhibit.slug)}
                  aria-label={
                    isFavorite(result.exhibit.slug)
                      ? t.myMuseum.removeDialog
                      : t.myMuseum.saveDialog
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite(result.exhibit.slug) ? "fill-current" : ""}`}
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  size="sm"
                  variant={isSelected(result.exhibit.slug) ? "secondary" : "outline"}
                  className="min-h-11"
                  onClick={() => toggleCompare(result.exhibit.slug)}
                  aria-pressed={isSelected(result.exhibit.slug)}
                  aria-label={
                    isSelected(result.exhibit.slug)
                      ? t.compare.removeDialog
                      : t.compare.addDialog
                  }
                >
                  <Scale className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Nasvet glede na čas */}
      <div className="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="font-display text-xl font-semibold">
              {timeChip === "min2"
                ? t.mood.timeShortTitle
                : t.mood.timeLongTitle}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {timeChip === "min2" ? t.mood.timeShortText : t.mood.timeLongText}
            </p>
          </div>
          {timeChip === "min2" ? (
            <Button className="min-h-11" onClick={() => onNavigate("domov")}>
              <Headphones className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.mood.ctaMinute}
            </Button>
          ) : (
            <Button className="min-h-11" onClick={() => onStartWalk("voda-je-zivljenje")}>
              <Footprints className="mr-2 h-4 w-4" aria-hidden="true" />
              {t.mood.ctaWalk}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
