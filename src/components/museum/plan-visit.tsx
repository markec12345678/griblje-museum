"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarClock,
  Footprints,
  GraduationCap,
  MapPin,
  Timer,
  ExternalLink,
  Sparkles,
  Wand2,
  Loader2,
  ListOrdered,
  Route,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import type { MuseumView } from "@/components/museum/header";
import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";
import type { VisitPlan } from "@/lib/plan-visit";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Načrt obiska — rubrika, kot jo imajo na vidnih mestih vsi veliki muzeji
 * (Louvre »Préparez votre visite«, Met »Plan Your Visit«), prirejeno
 * digitalni-obiski vasi: kdaj, kako in koliko časa.
 *
 * 63. sklop (vrzel #4): AI planiranje obiska — obiskovalec poda čas,
 * interese in spremljevalce; izbor postaj je determinističen nad zbirko,
 * AI personalizira le pripoved (dokazni vzorec AI kustosa).
 */

/** Koordinate vasi (enake kot v /api/opendata manifestu). */
const LAT = 45.57246;
const LNG = 15.29257;
const OSM_URL = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=14/${LAT}/${LNG}`;

const MINUTE_OPTIONS: { value: 15 | 30 | 60 | 90; label: string }[] = [
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
];

const CATEGORY_KEYS: ExhibitCategory[] = [
  "kolpa",
  "kraj",
  "vojna",
  "narava",
  "gospodarstvo",
  "sege",
];

export function PlanVisit({
  onNavigate,
  onStartWalk,
  onOpenExhibit,
  exhibits,
}: {
  onNavigate: (view: MuseumView) => void;
  onStartWalk: (walkId: string, stopIndex: number) => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  exhibits: ExhibitDTO[];
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();

  const [minutes, setMinutes] = React.useState<15 | 30 | 60 | 90>(30);
  const [interests, setInterests] = React.useState<Set<ExhibitCategory>>(new Set());
  const [withKids, setWithKids] = React.useState(false);
  const [plan, setPlan] = React.useState<VisitPlan | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cached, setCached] = React.useState(false);

  const bySlug = React.useMemo(
    () => new Map(exhibits.map((e) => [e.slug, e])),
    [exhibits],
  );

  const toggleInterest = (cat: ExhibitCategory) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: lang,
          minutes,
          interests: [...interests],
          withKids,
        }),
      });
      if (res.status === 429) {
        setError(t.planAi.errorRate);
        return;
      }
      if (!res.ok) {
        setError(t.planAi.error);
        return;
      }
      const data = (await res.json()) as VisitPlan & { cached?: boolean };
      setPlan(data);
      setCached(Boolean(data.cached));
    } catch {
      setError(t.planAi.error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      icon: CalendarClock,
      title: t.plan.whenTitle,
      text: t.plan.whenText,
    },
    {
      icon: MapPin,
      title: t.plan.howTitle,
      text: t.plan.howText,
    },
    {
      icon: Timer,
      title: t.plan.timeTitle,
      text: t.plan.timeText,
    },
  ];

  return (
    <section aria-labelledby="nacrt-obiska" className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="nacrt-obiska" className="font-display text-3xl font-semibold sm:text-4xl">
            {t.plan.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.plan.sub}</p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <Card className="h-full border-border/70">
                <CardContent className="flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <card.icon className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-semibold">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{card.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Časovne različice obiska */}
        <ul className="mt-8 grid gap-4 md:grid-cols-3" aria-label={t.plan.timeTitle}>
          {[
            { minutes: "15 min", label: t.plan.timeShort },
            { minutes: "30 min", label: t.plan.timeMedium },
            { minutes: "60+ min", label: t.plan.timeLong },
          ].map((option) => (
            <li
              key={option.minutes}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-4"
            >
              <span className="font-display shrink-0 text-lg font-semibold text-primary">
                {option.minutes}
              </span>
              <span className="text-sm text-foreground/85">{option.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="min-h-11"
            onClick={() => onStartWalk("voda-je-zivljenje", 0)}
          >
            <Footprints className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaWalk}
          </Button>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("zbirka")}>
            {t.plan.ctaCollection}
          </Button>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("karta")}>
            <MapPin className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaMap}
          </Button>
          <a
            href={OSM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t.plan.ctaOsm}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <Button variant="ghost" className="min-h-11" onClick={() => onNavigate("oMuzeju")}>
            <GraduationCap className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
            {t.plan.ctaSchools}
          </Button>
        </div>

        {/* --- AI planiranje obiska (vrzel #4) --- */}
        <div className="mt-14 rounded-2xl border border-primary/25 bg-background p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wand2 className="h-5.5 w-5.5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-2xl font-semibold">{t.planAi.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.planAi.sub}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
            {/* Čas */}
            <div>
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.planAi.minutesLabel}
              </Label>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label={t.planAi.minutesLabel}
              >
                {MINUTE_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    type="button"
                    size="sm"
                    variant={minutes === opt.value ? "default" : "outline"}
                    className="min-h-11"
                    aria-pressed={minutes === opt.value}
                    onClick={() => setMinutes(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Interesi */}
            <div>
              <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.planAi.interestsLabel}
              </Label>
              <div
                className="mt-2 flex flex-wrap gap-2"
                role="group"
                aria-label={t.planAi.interestsLabel}
              >
                {CATEGORY_KEYS.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    size="sm"
                    variant={interests.has(cat) ? "default" : "outline"}
                    className="min-h-11"
                    aria-pressed={interests.has(cat)}
                    onClick={() => toggleInterest(cat)}
                  >
                    {t.categories[cat]}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Switch
                id="plan-ai-kids"
                checked={withKids}
                onCheckedChange={setWithKids}
                aria-label={t.planAi.withKids}
              />
              <Label htmlFor="plan-ai-kids" className="text-sm leading-snug">
                {t.planAi.withKids}
                <span className="block text-xs font-normal text-muted-foreground">
                  {t.planAi.withKidsHint}
                </span>
              </Label>
            </div>
            <Button className="min-h-11" onClick={generate} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="mr-2 h-4.5 w-4.5" aria-hidden="true" />
              )}
              {loading ? t.planAi.loading : plan ? t.planAi.regenerate : t.planAi.generate}
            </Button>
          </div>

          {/* Napaka */}
          {error && (
            <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          {/* Načrt */}
          {plan && (
            <motion.div
              key={`${plan.intro.slice(0, 24)}-${plan.stops.length}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8"
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <ListOrdered className="h-4 w-4" aria-hidden="true" />
                <span>
                  {pick(
                    lang,
                    `${plan.stops.length} postaj · ≈ ${plan.totalMinutes} min${cached ? ` · ${t.planAi.cached}` : ""}`,
                    `${plan.stops.length} stops · ≈ ${plan.totalMinutes} min${cached ? ` · ${t.planAi.cached}` : ""}`,
                  )}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  {plan.synthesized ? t.planAi.badgeAi : t.planAi.badgeFallback}
                </span>
              </div>

              <p className="mt-3 max-w-3xl font-display text-lg leading-relaxed">
                {plan.intro}
              </p>

              <ol className="mt-6 space-y-3">
                {plan.stops.map((stop, i) => {
                  const exhibit = bySlug.get(stop.slug);
                  const title = pick(lang, stop.titleSi, stop.titleEn);
                  const period = pick(lang, stop.periodSi, stop.periodEn);
                  return (
                    <motion.li
                      key={stop.slug}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                      className="rounded-xl border border-border/70 bg-card p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {i + 1}
                        </span>
                        <h4 className="font-display text-base font-semibold">
                          {exhibit ? (
                            <button
                              type="button"
                              className="text-left underline-offset-4 transition-colors hover:underline"
                              onClick={() => exhibit && onOpenExhibit(exhibit)}
                            >
                              {title}
                            </button>
                          ) : (
                            title
                          )}
                        </h4>
                        {stop.museumNo && (
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                            {stop.museumNo}
                          </span>
                        )}
                        <EvidenceBadge status={stop.evidenceStatus} />
                        <span className="ml-auto text-xs text-muted-foreground">
                          {period} · {stop.minutes} min
                        </span>
                      </div>
                      <p className="mt-2 pl-9 text-sm leading-relaxed text-muted-foreground">
                        {stop.why}
                      </p>
                      {stop.walkId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 min-h-9 pl-9 text-primary"
                          onClick={() => onStartWalk(stop.walkId!, 0)}
                        >
                          <Route className="mr-2 h-4 w-4" aria-hidden="true" />
                          {pick(
                            lang,
                            `Sprehod: ${stop.walkTitleSi ?? ""}`,
                            `Walk: ${stop.walkTitleEn ?? ""}`,
                          )}
                        </Button>
                      )}
                    </motion.li>
                  );
                })}
              </ol>

              {plan.tip && (
                <p className="mt-5 rounded-lg border border-border/70 bg-muted/40 p-4 text-sm leading-relaxed">
                  <Sparkles className="mr-2 inline h-4 w-4 text-primary" aria-hidden="true" />
                  {plan.tip}
                </p>
              )}

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {plan.synthesized ? t.planAi.disclaimer : t.planAi.fallbackNote}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
