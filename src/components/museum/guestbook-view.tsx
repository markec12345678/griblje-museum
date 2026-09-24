"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookHeart, CheckCircle2, Clock3, Feather, Globe2, MapPin, PenLine } from "lucide-react";
import { useLang, localeOf } from "@/lib/i18n";
import { useGuestbook, useGuestbookSubmit } from "@/hooks/use-museum";
import { CONTRIBUTION_LIMITS as LIMITS } from "@/lib/contribution-limits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Digitalna spominska knjiga — vzorec vasi: vsaka slovenska vas ima
 * spominsko knjigo, priprto ob praznikih. DigitaltMuseum/Tenement Museum
 * vzorec sodelovanja skupnosti, tokrat v obliki, ki je blizu vaški
 * kulturi. Vpisi prihajajo z /api/guestbook (GET + POST).
 */
export function GuestbookView() {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const query = useGuestbook();
  const submit = useGuestbookSubmit();

  // Obrazec: ime, kraj, sporočilo + honeypot (skrito polje "website").
  const [name, setName] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [message, setMessage] = React.useState("");
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
    name.trim().length >= 2 && message.trim().length >= 10 && !submit.isPending;

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setFeedback(null);
    submit.mutate(
      {
        name: name.trim(),
        place: place.trim() || undefined,
        message: message.trim(),
        lang,
        website,
      },
      {
        onSuccess: (result) => {
          setFeedback(result.status);
          if (result.status === "published") {
            setName("");
            setPlace("");
            setMessage("");
          } else {
            setMessage("");
          }
          setWebsite("");
        },
        onError: () => setFeedback("error"),
      }
    );
  };

  const entries = query.data?.entries ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Uvod */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookHeart className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">
            {t.guestbook.title}
          </h1>
        </div>
        <p className="mt-3 text-muted-foreground">{t.guestbook.subtitle}</p>
      </div>

      {/* Statistika — števci iz API-ja */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md">
        <Stat
          loading={query.isLoading}
          value={query.data?.count}
          icon={<PenLine className="h-4 w-4" aria-hidden="true" />}
          label={t.guestbook.statEntries}
        />
        <Stat
          loading={query.isLoading}
          value={query.data?.places}
          icon={<Globe2 className="h-4 w-4" aria-hidden="true" />}
          label={t.guestbook.statPlaces}
        />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Obrazec */}
        <section aria-labelledby="knjiga-obrazec" className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={onSubmit}
            noValidate
            className="paper-grain rounded-xl border border-border/70 bg-card p-6 sm:p-8"
          >
            <div className="flex items-center gap-2.5">
              <Feather className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 id="knjiga-obrazec" className="font-display text-xl font-semibold">
                {t.guestbook.formTitle}
              </h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.guestbook.formLead}</p>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gb-name">{t.guestbook.nameLabel}</Label>
                  <Input
                    id="gb-name"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, LIMITS.name))}
                    placeholder={t.guestbook.namePlaceholder}
                    maxLength={LIMITS.name}
                    autoComplete="off"
                    required
                    aria-required="true"
                    className="min-h-11 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gb-place">{t.guestbook.placeLabel}</Label>
                  <Input
                    id="gb-place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value.slice(0, LIMITS.place))}
                    placeholder={t.guestbook.placePlaceholder}
                    maxLength={LIMITS.place}
                    autoComplete="off"
                    className="min-h-11 bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gb-message">{t.guestbook.messageLabel}</Label>
                <Textarea
                  id="gb-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, LIMITS.message))}
                  placeholder={t.guestbook.messagePlaceholder}
                  rows={5}
                  maxLength={LIMITS.message}
                  required
                  aria-required="true"
                  aria-describedby="gb-count"
                  className="min-h-28 resize-y bg-background"
                />
                <p id="gb-count" className="text-right text-xs tabular-nums text-muted-foreground">
                  {t.guestbook.messageCount(message.length, LIMITS.message)}
                </p>
              </div>

              {/* Honeypot — skrit pred ljudmi, viden robotom */}
              <div className="hidden" aria-hidden="true">
                <Label htmlFor="gb-website">Website</Label>
                <Input
                  id="gb-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full min-h-11" disabled={!canSubmit}>
                {submit.isPending ? (
                  <>
                    <Clock3 className="mr-2 h-4 w-4 animate-pulse" aria-hidden="true" />
                    {t.guestbook.submitting}
                  </>
                ) : (
                  <>
                    <PenLine className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t.guestbook.submit}
                  </>
                )}
              </Button>

              <p aria-live="polite" className="min-h-5 text-sm">
                {feedback === "published" && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    {t.guestbook.success}
                  </span>
                )}
                {feedback === "pending" && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-accent-foreground/90">
                    <Clock3 className="h-4 w-4" aria-hidden="true" />
                    {t.guestbook.successPending}
                  </span>
                )}
                {feedback === "error" && (
                  <span className="text-destructive">{submit.error?.message ?? t.guestbook.error}</span>
                )}
              </p>
            </div>
          </form>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {t.guestbook.moderationNote}
          </p>
        </section>

        {/* Zid vpisov */}
        <section aria-labelledby="knjiga-vpisi">
          <h2 id="knjiga-vpisi" className="font-display text-2xl font-semibold">
            {t.guestbook.entriesTitle}
          </h2>

          {query.isLoading ? (
            <div className="mt-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="mt-6 rounded-xl border border-border/70 bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">{t.guestbook.error}</p>
              <Button
                variant="outline"
                className="mt-4 min-h-11"
                onClick={() => void query.refetch()}
              >
                {t.guestbook.refresh}
              </Button>
            </div>
          ) : entries.length === 0 ? (
            <div className="paper-grain mt-6 rounded-xl border border-dashed border-border/70 bg-card p-8 text-center">
              <BookHeart className="mx-auto h-8 w-8 text-primary/50" aria-hidden="true" />
              <p className="font-display mt-3 text-lg font-semibold">
                {t.guestbook.emptyTitle}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.guestbook.emptyText}</p>
            </div>
          ) : (
            <ul className="museum-scroll mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              {entries.map((entry, index) => (
                <motion.li
                  key={entry.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                  className="paper-grain relative rounded-xl border border-border/70 bg-card p-5 sm:p-6"
                >
                  {/* Kotiček lističa, kot v pravi knjigi */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 h-0 w-0 border-l-[22px] border-t-[22px] border-l-transparent border-t-primary/15"
                  />
                  <blockquote className="relative">
                    <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                      {entry.message}
                    </p>
                    <footer className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <span className="font-semibold">{entry.name}</span>
                      {entry.place && (
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {entry.place}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        <time dateTime={entry.createdAt}>
                          {dateFmt.format(new Date(entry.createdAt))}
                        </time>
                      </span>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Stat({
  loading,
  value,
  icon,
  label,
}: {
  loading: boolean;
  value: number | undefined;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 text-center">
      {loading ? (
        <Skeleton className="mx-auto h-8 w-16" />
      ) : (
        <p className="font-display flex items-center justify-center gap-2 text-3xl font-semibold text-primary">
          <span className="text-primary/70">{icon}</span>
          {value ?? 0}
        </p>
      )}
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
