"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpenCheck,
  Eraser,
  ExternalLink,
  Landmark,
  Scale,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { useLang, localeOf, type Lang } from "@/lib/i18n";
import { trackStat } from "@/lib/stats-client";
import type { ExhibitDTO } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * AI KUSTOS — jezikovni vmesnik nad dokaznim korpusom muzeja
 * (41. sklop / TASK 41). Razlikuje se od toplega vodnika: kustos je
 * enovprašanjenski inženir dokaza z obvezno strukturo
 *
 *     Kaj vemo → Kako vemo → Viri → Opomba
 *
 * Vsak [MVG-###] gumb v besedilu odpre pravi zapis; vsak vir vodi na
 * obstoječo vrstico vira zapisa. Muzej ostaja glavni produkt — vmesnik
 * je prav toliko velik, kot ga potrebuje pošteno vprašanje.
 *
 * Zasebnost: vprašanje živi v stanju komponente; strežnik ne shranjuje
 * pogovora (edino anonimni predpomnilnik pogostih vprašanj, 24 h).
 */

type CuratorCite = { slug: string; sourceIndex: number | null };

type CuratorResponse = {
  answerable: boolean;
  reason: string | null;
  queryType: string | null;
  kajVemo: string[];
  kakoVemo: string[];
  viri: {
    slug: string;
    museumNo: string | null;
    titleSi: string;
    titleEn: string;
    sourceIndex: number | null;
    sourceKey: string | null;
    sourceNameSi: string;
    sourceNameEn: string;
    sourceUrl: string | null;
  }[];
  opomba: string | null;
  entities: {
    id: string;
    type: "person" | "place" | "event" | "time";
    labelSi: string;
    labelEn: string;
  }[];
  suggestions: { slug: string; museumNo: string | null; titleSi: string; titleEn: string }[];
  cached: boolean;
};

type ApiError = "unavailable" | "rate-limited" | "quota-exhausted" | "failed" | null;

const SENDING_MAX_MS = 60_000;
const QUESTION_MAX_CHARS = 500;

/** Ena besedilna enota z vgrajenimi navedki [[slug]] → gumbi [MVG-###]. */
function CitedParagraph({
  text,
  exhibitBySlug,
  onOpenExhibit,
  citeTitle,
  lang,
}: {
  text: string;
  exhibitBySlug: Map<string, ExhibitDTO>;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  citeTitle: string;
  lang: Lang;
}) {
  const parts = text.split(/(\[\[[a-z0-9-]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([a-z0-9-]+)\]\]$/);
        if (!m) return <React.Fragment key={i}>{part}</React.Fragment>;
        const slug = m[1];
        const ex = exhibitBySlug.get(slug);
        const label = ex?.museumNo ?? slug;
        return (
          <button
            key={i}
            type="button"
            disabled={!ex}
            title={ex ? (lang === "sl" ? ex.titleSi : ex.titleEn) : undefined}
            aria-label={`${citeTitle}${ex ? `: ${ex.museumNo ?? slug} — ${lang === "sl" ? ex.titleSi : ex.titleEn}` : ""}`}
            onClick={() => ex && onOpenExhibit(ex)}
            className={cn(
              "mx-0.5 inline-flex min-h-6 items-center rounded border px-1.5 py-0 align-baseline font-mono text-[0.78em] font-semibold transition-colors",
              ex
                ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                : "cursor-default border-border/60 bg-muted/40 text-muted-foreground",
            )}
          >
            {label}
          </button>
        );
      })}
    </>
  );
}

export function CuratorDialog({
  open,
  onOpenChange,
  exhibits,
  onOpenExhibit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();

  const [question, setQuestion] = React.useState("");
  const [asked, setAsked] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<CuratorResponse | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<ApiError>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    if (!open) abortRef.current?.abort();
    else setError(null);
  }, [open]);

  const exhibitBySlug = React.useMemo(() => {
    const map = new Map<string, ExhibitDTO>();
    for (const ex of exhibits) map.set(ex.slug, ex);
    return map;
  }, [exhibits]);

  const send = React.useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;

      setError(null);
      setQuestion("");
      setAsked(text.slice(0, QUESTION_MAX_CHARS));
      setResult(null);
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort(), SENDING_MAX_MS);

      try {
        const res = await fetch("/api/curator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({ lang, question: text.slice(0, QUESTION_MAX_CHARS) }),
        });

        if (!res.ok) {
          if (res.status === 503) setError("unavailable");
          else if (res.status === 429) {
            const body = (await res.json().catch(() => null)) as { error?: string } | null;
            setError(body?.error === "quota-exhausted" ? "quota-exhausted" : "rate-limited");
          } else setError("failed");
          return;
        }

        const data = (await res.json()) as CuratorResponse;
        setResult(data);
        trackStat("curator", undefined, lang);
      } catch {
        setError("failed");
      } finally {
        clearTimeout(timer);
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, lang],
  );

  const clear = React.useCallback(() => {
    abortRef.current?.abort();
    setAsked(null);
    setResult(null);
    setError(null);
    setQuestion("");
  }, []);

  const errorText =
    error === "unavailable"
      ? t.curator.unavailable
      : error === "rate-limited"
        ? t.curator.rateLimited
        : error === "quota-exhausted"
          ? t.curator.quotaExhausted
          : error
            ? t.curator.failed
            : null;

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.25, delay },
        };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 p-0 sm:w-full">
        <DialogHeader className="border-b border-border/70 px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl leading-tight">
                {t.curator.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm">
                {t.curator.subtitle}
              </DialogDescription>
            </div>
            <Badge className="ml-auto shrink-0 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden="true" />
              {t.curator.aiBadge}
            </Badge>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {t.curator.disclaimer}
          </p>
        </DialogHeader>

        {/* Odgovor kustosa */}
        <div
          role="log"
          aria-live="polite"
          aria-label={t.curator.title}
          className="museum-scroll min-h-[240px] flex-1 overflow-y-auto px-5 py-4"
        >
          {!asked && !busy && (
            <motion.div {...fade(0)} className="py-2">
              <p className="text-sm font-medium text-foreground/90">
                {t.curator.startersTitle}
              </p>
              <div className="mt-3 grid gap-2">
                {t.curator.starters.map((q: string) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="min-h-11 rounded-lg border border-border/70 bg-card px-4 py-2.5 text-left text-sm text-foreground/90 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {busy && (
            <div className="flex items-center gap-3 py-6 text-sm text-muted-foreground" aria-busy="true">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" aria-hidden="true" />
              {t.curator.sending}
            </div>
          )}

          {asked && !busy && (
            <AnimatePresence mode="wait">
              <motion.div key={asked + String(result?.answerable)} {...fade(0)} className="space-y-4">
                {/* Uporabnikovo vprašanje */}
                <div className="flex w-full justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-foreground">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/70">
                      {t.curator.yourQuestion}
                    </span>
                    {asked}
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {errorText}
                  </p>
                )}

                {/* Zavrnitev: dokaza ni dovolj */}
                {result && !result.answerable && (
                  <div className="rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-4 text-sm text-foreground/90">
                    <p className="font-medium text-foreground">
                      {t.curator.insufficientTitle}
                    </p>
                    <p className="mt-1 text-muted-foreground">{t.curator.insufficientText}</p>
                    {result.suggestions.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <Landmark className="h-3 w-3" aria-hidden="true" />
                          {t.curator.closestTitle}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.suggestions.map((s) => {
                            const ex = exhibitBySlug.get(s.slug);
                            const title = lang === "sl" ? s.titleSi : s.titleEn;
                            return (
                              <button
                                key={s.slug}
                                type="button"
                                disabled={!ex}
                                onClick={() => ex && onOpenExhibit(ex)}
                                className={cn(
                                  "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                                  ex
                                    ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                                    : "cursor-default border-border/60 bg-muted/40 text-muted-foreground",
                                )}
                              >
                                {s.museumNo ? `${s.museumNo} · ` : ""}
                                {title}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Odgovor po pogodbi: Kaj vemo → Kako vemo → Viri → Opomba */}
                {result && result.answerable && (
                  <article className="space-y-4 rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-4 text-sm leading-relaxed text-foreground/90">
                    {result.kajVemo.length > 0 && (
                      <section aria-label={t.curator.whatWeKnow}>
                        <h4 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <BookOpenCheck className="h-3 w-3" aria-hidden="true" />
                          {t.curator.whatWeKnow}
                        </h4>
                        <div className="space-y-2">
                          {result.kajVemo.map((p, i) => (
                            <p key={i}>
                              <CitedParagraph
                                text={p}
                                exhibitBySlug={exhibitBySlug}
                                onOpenExhibit={onOpenExhibit}
                                citeTitle={t.curator.citeButtonTitle}
                                lang={lang}
                              />
                            </p>
                          ))}
                        </div>
                      </section>
                    )}

                    {result.kakoVemo.length > 0 && (
                      <section aria-label={t.curator.howWeKnow}>
                        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {t.curator.howWeKnow}
                        </h4>
                        <div className="space-y-2">
                          {result.kakoVemo.map((p, i) => (
                            <p key={i}>
                              <CitedParagraph
                                text={p}
                                exhibitBySlug={exhibitBySlug}
                                onOpenExhibit={onOpenExhibit}
                                citeTitle={t.curator.citeButtonTitle}
                                lang={lang}
                              />
                            </p>
                          ))}
                        </div>
                      </section>
                    )}

                    {result.viri.length > 0 && (
                      <section aria-label={t.curator.sources}>
                        <h4 className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <Landmark className="mr-1.5 h-3 w-3 inline" aria-hidden="true" />
                          {t.curator.sources}
                        </h4>
                        <ul className="space-y-1.5">
                          {result.viri.map((v, i) => {
                            const ex = exhibitBySlug.get(v.slug);
                            const title = lang === "sl" ? v.titleSi : v.titleEn;
                            const sourceName = lang === "sl" ? v.sourceNameSi : v.sourceNameEn;
                            return (
                              <li key={`${v.slug}-${v.sourceIndex}-${i}`} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                <button
                                  type="button"
                                  disabled={!ex}
                                  onClick={() => ex && onOpenExhibit(ex)}
                                  className={cn(
                                    "inline-flex min-h-8 items-center rounded border px-1.5 font-mono text-xs font-semibold transition-colors",
                                    ex
                                      ? "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
                                      : "cursor-default border-border/60 bg-muted/40 text-muted-foreground",
                                  )}
                                  aria-label={`${t.curator.citeButtonTitle}: ${v.museumNo ?? v.slug} — ${title}`}
                                >
                                  {v.museumNo ?? v.slug}
                                </button>
                                <span className="min-w-0 flex-1 text-xs text-muted-foreground">
                                  {sourceName}
                                  {v.sourceIndex !== null && (
                                    <span className="ml-1 font-mono text-[10px] text-muted-foreground/70">
                                      #{v.sourceIndex + 1}
                                    </span>
                                  )}
                                </span>
                                {v.sourceUrl && (
                                  <a
                                    href={v.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-8 items-center gap-1 rounded border border-border/60 px-2 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                                    aria-label={`${t.curator.openSource}: ${sourceName}`}
                                  >
                                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                                    {t.curator.openSource}
                                  </a>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    )}

                    {result.opomba && (
                      <section
                        aria-label={t.curator.note}
                        className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-900 dark:text-amber-200"
                      >
                        <h4 className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide">
                          {t.curator.note}
                        </h4>
                        <p>
                          <CitedParagraph
                            text={result.opomba}
                            exhibitBySlug={exhibitBySlug}
                            onOpenExhibit={onOpenExhibit}
                            citeTitle={t.curator.citeButtonTitle}
                            lang={lang}
                          />
                        </p>
                      </section>
                    )}

                    {/* Sled razrešitve: entitete + vrsta vprašanja */}
                    {(result.entities.length > 0 || result.queryType) && (
                      <footer className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
                        {result.queryType && (
                          <Badge variant="outline" className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {t.curator.queryType[result.queryType as keyof typeof t.curator.queryType] ?? result.queryType}
                          </Badge>
                        )}
                        {result.entities.slice(0, 6).map((e) => (
                          <Badge key={e.id} variant="outline" className="max-w-56 truncate text-[10px] font-medium text-muted-foreground">
                            {t.curator.entityKind[e.type]}: {lang === "sl" ? e.labelSi : e.labelEn}
                          </Badge>
                        ))}
                      </footer>
                    )}
                  </article>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Vprašanje */}
        <form
          className="border-t border-border/70 px-5 py-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(question);
          }}
        >
          <label htmlFor="curator-question" className="sr-only">
            {t.curator.inputLabel}
          </label>
          <div className="flex items-end gap-2">
            <textarea
              id="curator-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, QUESTION_MAX_CHARS))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(question);
                }
              }}
              rows={1}
              placeholder={t.curator.placeholder}
              aria-label={t.curator.inputLabel}
              className="museum-scroll max-h-24 min-h-11 flex-1 resize-none rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <Button type="submit" size="icon" disabled={busy || !question.trim()} className="size-11 shrink-0" aria-label={t.curator.send}>
              <SendHorizontal className="h-4.5 w-4.5" aria-hidden="true" />
            </Button>
            {(asked || result) && !busy && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clear}
                className="size-11 shrink-0"
                aria-label={t.curator.clear}
                title={t.curator.clear}
              >
                <Eraser className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {t.curator.privacy}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
