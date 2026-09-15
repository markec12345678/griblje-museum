"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Eraser,
  Landmark,
  MessageCircleQuestion,
  SendHorizontal,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { ExhibitDTO } from "@/lib/types";
import { GUIDE_LIMITS } from "@/lib/guide-limits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Pogovor z zbirko — uzidani AI vodnik po vzoru vodilnih muzejev
 * (Met Assistant, DMA Angelica, museum-GPT): model odgovarja samo iz
 * kuriranih zapisov; navedki v odgovoru so gumbi, ki odprejo pravi zapis.
 *
 * Zasebnost: pogovor živi v stanju komponente — ne shranjujemo ga nikamor.
 */

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  cites?: { slug: string; titleSi: string; titleEn: string }[];
};

type ApiError =
  | "unavailable"
  | "rate-limited"
  | "quota-exhausted"
  | "failed"
  | null;

const SENDING_MAX_MS = 60_000;

/** Ura ponastavitve kvote v brskalnikovi časovni coni in jeziku; null, če je
 * ponudnik ni povedal ali je niz neveljaven. */
function formatResetTime(
  resetAt: string,
  lang: "sl" | "en",
): string | null {
  const date = new Date(resetAt);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return new Intl.DateTimeFormat(lang === "sl" ? "sl-SI" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return null;
  }
}

export function GuideDialog({
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

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<ApiError>(null);
  const [quotaResetAt, setQuotaResetAt] = React.useState<string | null>(null);
  const transcriptRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  // Samodejno drsaj na dno ob novem sporočilu.
  React.useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  // Prekini nedokončan klic ob zaprtju dialoga; ob ponovnem odprtju
  // počisti zastarelo napako (pogovor sam ostane).
  React.useEffect(() => {
    if (!open) abortRef.current?.abort();
    else {
      setError(null);
      setQuotaResetAt(null);
    }
  }, [open]);

  const send = React.useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;

      setError(null);
      setQuotaResetAt(null);
      setInput("");

      const history: ChatMessage[] = [
        ...messages,
        { role: "user", content: text.slice(0, GUIDE_LIMITS.message) },
      ];
      setMessages(history);
      setBusy(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const timer = setTimeout(() => controller.abort(), SENDING_MAX_MS);

      try {
        const res = await fetch("/api/guide", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            lang,
            // Strežniku pošljemo le zadnjih GUIDE_LIMITS.history sporočil.
            messages: history
              .slice(-GUIDE_LIMITS.history)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) {
          if (res.status === 503) setError("unavailable");
          else if (res.status === 429) {
            // Razlikuj dnevno kvoto od kratkoročne hitrostne meje;
            // pri dnevni priložimo turo ponastavitve, če jo strežnik ve.
            const body = (await res.json().catch(() => null)) as {
              error?: string;
              resetAt?: string | null;
            } | null;
            if (body?.error === "quota-exhausted") {
              setError("quota-exhausted");
              if (typeof body.resetAt === "string" && body.resetAt) {
                setQuotaResetAt(body.resetAt);
              }
            } else {
              setError("rate-limited");
            }
          } else setError("failed");
          setMessages(history); // uporabnikovo vprašanje ostane, lahko ponovi
          return;
        }

        const data = (await res.json()) as {
          answer: string;
          cites: { slug: string; titleSi: string; titleEn: string }[];
        };
        setMessages([
          ...history,
          { role: "assistant", content: data.answer, cites: data.cites },
        ]);
      } catch (err) {
        if ((err as Error)?.name === "AbortError") {
          setError("failed");
        } else {
          setError("failed");
        }
        setMessages(history);
      } finally {
        clearTimeout(timer);
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, lang, messages]
  );

  const clearConversation = React.useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setQuotaResetAt(null);
    setInput("");
  }, []);

  const errorText =
    error === "unavailable"
      ? t.guide.unavailable
      : error === "rate-limited"
        ? t.guide.rateLimited
        : error === "quota-exhausted"
          ? t.guide.quotaExhausted
          : error
            ? t.guide.failed
          : null;

  // Točna ura ponastavitve kvote (v coni obiskovalca), če jo strežnik povedal.
  const quotaResetText =
    error === "quota-exhausted" && quotaResetAt
      ? (() => {
          const time = formatResetTime(quotaResetAt, lang);
          return time ? t.guide.quotaReset.replace("{time}", time) : null;
        })()
      : null;

  const exhibitBySlug = React.useMemo(() => {
    const map = new Map<string, ExhibitDTO>();
    for (const ex of exhibits) map.set(ex.slug, ex);
    return map;
  }, [exhibits]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 p-0 sm:w-full">
        <DialogHeader className="border-b border-border/70 px-5 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="font-display text-xl leading-tight">
                {t.guide.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-sm">
                {t.guide.subtitle}
              </DialogDescription>
            </div>
            <Badge className="ml-auto shrink-0 border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3 w-3" aria-hidden="true" />
              {t.guide.aiBadge}
            </Badge>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {t.guide.disclaimer}
          </p>
        </DialogHeader>

        {/* Prepis pogovora */}
        <div
          ref={transcriptRef}
          role="log"
          aria-live="polite"
          aria-label={t.guide.title}
          className="museum-scroll min-h-[240px] flex-1 overflow-y-auto px-5 py-4"
        >
          {messages.length === 0 && !busy && (
            <div className="py-2">
              <p className="text-sm font-medium text-foreground/90">
                {t.guide.startersTitle}
              </p>
              <div className="mt-3 grid gap-2">
                {t.guide.starters.map((q: string) => (
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
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex w-full",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "user"
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border border-border/70 bg-card text-foreground/90"
                  )}
                >
                  <span
                    className={cn(
                      "mb-1 block text-[11px] font-semibold uppercase tracking-wide",
                      m.role === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {m.role === "user" ? t.guide.you : t.guide.guideName}
                  </span>
                  {m.content}
                  {m.role === "assistant" && m.cites && m.cites.length > 0 && (
                    <div className="mt-3 border-t border-border/60 pt-3">
                      <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <Landmark className="h-3 w-3" aria-hidden="true" />
                        {t.guide.cites}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {m.cites.map((c) => {
                          const ex = exhibitBySlug.get(c.slug);
                          const title = lang === "sl" ? c.titleSi : c.titleEn;
                          return (
                            <button
                              key={c.slug}
                              type="button"
                              disabled={!ex}
                              onClick={() => ex && onOpenExhibit(ex)}
                              className={cn(
                                "inline-flex min-h-9 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors",
                                ex
                                  ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
                                  : "cursor-default border-border/60 bg-muted/40 text-muted-foreground"
                              )}
                            >
                              {title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start" aria-hidden={false}>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border/70 bg-card px-4 py-3">
                  <span className="sr-only">{t.guide.sending}</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        initial={false}
                        animate={
                          reduceMotion
                            ? { opacity: 1 }
                            : { opacity: [0.25, 1, 0.25] }
                        }
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 1.1, repeat: Infinity, delay: dot * 0.18 }
                        }
                        className="size-1.5 rounded-full bg-muted-foreground"
                      />
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.guide.sending}
                  </span>
                </div>
              </div>
            )}

            {errorText && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {errorText}
                {quotaResetText && (
                  <span className="block">{quotaResetText}</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Vnos in noga */}
        <div className="border-t border-border/70 px-5 py-4">
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">{t.guide.inputLabel}</span>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, GUIDE_LIMITS.message))}
                onKeyDown={(e) => {
                  // Enter pošlje; Shift+Enter prelomi vrstico.
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={GUIDE_LIMITS.message}
                placeholder={t.guide.placeholder}
                aria-label={t.guide.inputLabel}
                className="museum-scroll max-h-28 min-h-11 w-full resize-none rounded-md border border-input bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>
            <Button
              type="submit"
              size="icon"
              className="size-11 shrink-0"
              disabled={busy || !input.trim()}
              aria-label={t.guide.send}
            >
              <SendHorizontal className="h-4.5 w-4.5" aria-hidden="true" />
            </Button>
            {messages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-11 shrink-0"
                onClick={clearConversation}
                aria-label={t.guide.clear}
                title={t.guide.clear}
              >
                <Eraser className="h-4.5 w-4.5" aria-hidden="true" />
              </Button>
            )}
          </form>
          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
            {t.guide.privacy}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Odsek na domači strani — vabilo v pogovor (skrit na majhnih zaslonih). */
export function GuideTeaser({ onOpen }: { onOpen: () => void }) {
  const { t } = useLang();
  return (
    <AnimatePresence>
      <motion.button
        type="button"
        onClick={onOpen}
        initial={false}
        whileHover={{ y: -2 }}
        className="group flex w-full items-center gap-4 rounded-xl border border-border/70 bg-card p-5 text-left transition-colors hover:border-primary/40"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <MessageCircleQuestion className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-semibold leading-tight">
            {t.guide.title}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {t.guide.subtitle}
          </span>
        </span>
        <Sparkles
          className="h-4.5 w-4.5 shrink-0 text-primary/60 transition-transform group-hover:scale-110"
          aria-hidden="true"
        />
      </motion.button>
    </AnimatePresence>
  );
}
