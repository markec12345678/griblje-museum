"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock3, MapPin, MessageCircleHeart, Send, Users } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { useMemorySubmit, useObjectMemories } from "@/hooks/use-museum";
import { CONTRIBUTION_LIMITS } from "@/lib/contribution-limits";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

/**
 * Spomini ob predmetu — skupnostna znanja pod uradnim besedilom.
 *
 * Vzorec: DigitaltMuseum (Norveška/Švedska) omogoča uporabnikom pripombe
 * in spomine ob predmetih; Tenement Museum "Your Story, Our Story" zbira
 * družinske zgodbe obiskovalcev. Za vaški muzej so pravi strokovnjaki
 * sosedje in potomci — ta odsek jih vabi k pisanju.
 */
export function ObjectMemories({ exhibit }: { exhibit: ExhibitDTO }) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const query = useObjectMemories(exhibit.slug);
  const submit = useMemorySubmit(exhibit.slug);

  const [formOpen, setFormOpen] = React.useState(false);
  const [author, setAuthor] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [memory, setMemory] = React.useState("");
  const [website, setWebsite] = React.useState(""); // honeypot
  const [feedback, setFeedback] = React.useState<"published" | "pending" | "error" | null>(null);

  const dateFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(localeOf(lang), {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang]
  );

  const canSubmit =
    author.trim().length >= 2 && memory.trim().length >= 20 && !submit.isPending;

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setFeedback(null);
    submit.mutate(
      {
        exhibitSlug: exhibit.slug,
        author: author.trim(),
        place: place.trim() || undefined,
        memory: memory.trim(),
        lang,
        website,
      },
      {
        onSuccess: (result) => {
          setFeedback(result.status);
          setAuthor("");
          setPlace("");
          setMemory("");
          setWebsite("");
          setFormOpen(false);
        },
        onError: () => setFeedback("error"),
      }
    );
  };

  const memories = query.data?.memories ?? [];

  return (
    <section aria-labelledby="spomini-predmeta" className="mt-6">
      <Separator className="mb-6" />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3
          id="spomini-predmeta"
          className="font-display inline-flex items-center gap-2 text-lg font-semibold"
        >
          <Users className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
          {t.memories.title}
          {query.data && query.data.count > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {query.data.count}
            </span>
          )}
        </h3>
        {!formOpen && (
          <Button
            variant="outline"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => {
              setFeedback(null);
              setFormOpen(true);
            }}
          >
            <MessageCircleHeart className="h-4 w-4" aria-hidden="true" />
            {t.memories.shareButton}
          </Button>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.memories.lead}</p>

      {/* Povratna informacija po pošiljanju (tudi ko se obrazec zapre) */}
      <p aria-live="polite" className="mt-3 min-h-5 text-sm">
        {feedback === "published" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            {t.memories.success}
          </span>
        )}
        {feedback === "pending" && (
          <span className="inline-flex items-center gap-1.5 font-medium text-accent-foreground/90">
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            {t.memories.successPending}
          </span>
        )}
        {feedback === "error" && (
          <span className="text-destructive">
            {submit.error?.message ?? t.memories.error}
          </span>
        )}
      </p>

      {/* Obrazec */}
      {formOpen && (
        <motion.form
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onSubmit={onSubmit}
          noValidate
          className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5"
        >
          <p className="font-display text-base font-semibold">{t.memories.formTitle}</p>
          <div className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mem-author">{t.memories.authorLabel}</Label>
                <Input
                  id="mem-author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value.slice(0, CONTRIBUTION_LIMITS.name))}
                  placeholder={t.memories.authorPlaceholder}
                  maxLength={CONTRIBUTION_LIMITS.name}
                  autoComplete="off"
                  required
                  aria-required="true"
                  className="min-h-11 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mem-place">{t.memories.placeLabel}</Label>
                <Input
                  id="mem-place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value.slice(0, CONTRIBUTION_LIMITS.place))}
                  placeholder={t.memories.placePlaceholder}
                  maxLength={CONTRIBUTION_LIMITS.place}
                  autoComplete="off"
                  className="min-h-11 bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mem-text">{t.memories.memoryLabel}</Label>
              <Textarea
                id="mem-text"
                value={memory}
                onChange={(e) => setMemory(e.target.value.slice(0, CONTRIBUTION_LIMITS.memory))}
                placeholder={t.memories.memoryPlaceholder}
                rows={4}
                maxLength={CONTRIBUTION_LIMITS.memory}
                required
                aria-required="true"
                aria-describedby="mem-count"
                className="min-h-24 resize-y bg-background"
              />
              <p id="mem-count" className="text-right text-xs tabular-nums text-muted-foreground">
                {t.memories.memoryCount(memory.length, CONTRIBUTION_LIMITS.memory)}
              </p>
            </div>

            {/* Honeypot — skrit pred ljudmi, viden robotom */}
            <div className="hidden" aria-hidden="true">
              <Label htmlFor="mem-website">Website</Label>
              <Input
                id="mem-website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" className="min-h-11" disabled={!canSubmit}>
                <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                {submit.isPending ? t.memories.submitting : t.memories.submit}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
                onClick={() => setFormOpen(false)}
              >
                {t.memories.cancel}
              </Button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Seznam spominov */}
      {query.isLoading ? (
        <div className="mt-4 space-y-2">
          <div className="h-20 animate-pulse rounded-lg bg-muted/60" />
          <div className="h-20 animate-pulse rounded-lg bg-muted/60" />
        </div>
      ) : memories.length > 0 ? (
        <ul className="museum-scroll mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
          {memories.map((item, index) => (
            <motion.li
              key={item.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.25) }}
              className="rounded-lg border border-border/70 bg-card p-4"
            >
              <blockquote>
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                  {item.memory}
                </p>
                <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="text-sm font-semibold text-foreground/80">{item.author}</span>
                  {item.place && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {item.place}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3 w-3" aria-hidden="true" />
                    <time dateTime={item.createdAt}>
                      {dateFmt.format(new Date(item.createdAt))}
                    </time>
                  </span>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </ul>
      ) : (
        !formOpen && (
          <p className="mt-4 rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-sm italic text-muted-foreground">
            {t.memories.emptyText}
          </p>
        )
      )}
    </section>
  );
}
