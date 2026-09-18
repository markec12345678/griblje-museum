"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Building2,
  CalendarRange,
  Flag,
  History,
  Home,
  Info,
  MapPin,
  Plane,
  ScrollText,
  User,
} from "lucide-react";
import { useLang, pick } from "@/lib/i18n";
import { useExhibitStrings, entityTitle } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";
import type { EventKind, EraKey, TimelineItem } from "@/lib/timeline-map";
import { ERA_ORDER, timelineItems } from "@/lib/timeline-map";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * KRONIKA — časovnica dogodkov entitetne plasti (39. sklop / TASK 40).
 *
 * Vsaka kartica je sledljiva do vira:
 *   kartica → EventRef/TimeRef (registr) → evidence[] → zapis → vir.
 * Čas se prikaže KOT JE ZAPISAN: približnosti nosijo ≈, intervali
 * ostanejo intervali. Dogodek z odprtim vprašanjem istovetnosti
 * (P1-E1: MVG-014 ↔ MVG-056) se pokaže po zapisih — dve kartici z
 * vidno oznako, nikoli spojeno.
 */

const ERA_ICON: Record<EraKey, React.ElementType> = {
  zacetki: ScrollText,
  s19: Home,
  vojni: Plane,
  povojni: Building2,
  danes: Flag,
};

type FilterState = {
  era: EraKey | "all";
  kind: EventKind | "all";
  place: string; // placeRef id | "all"
  person: string; // personRef id | "all"
};

const DEFAULT_FILTERS: FilterState = {
  era: "all",
  kind: "all",
  place: "all",
  person: "all",
};

export function ChronicleView({
  exhibits,
  onOpenExhibit,
  onNavigate,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: MuseumView) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const items = React.useMemo(() => timelineItems(exhibits), [exhibits]);
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);

  /** Možnosti filtrov krajev/oseb — samo tiste s ≥1 kartico. */
  const { placeOptions, personOptions } = React.useMemo(() => {
    const places = new Map<string, string>(); // id → label
    const persons = new Map<string, string>();
    for (const item of items) {
      for (const p of item.places) places.set(p.id, entityTitle(lang, p));
      for (const p of item.persons) persons.set(p.id, entityTitle(lang, p));
    }
    const byLabel = (a: [string, string], b: [string, string]) => a[1].localeCompare(b[1], lang);
    return {
      placeOptions: [...places.entries()].sort(byLabel),
      personOptions: [...persons.entries()].sort(byLabel),
    };
  }, [items, lang]);

  const filtered = React.useMemo(
    () =>
      items.filter((item) => {
        if (filters.era !== "all" && item.era !== filters.era) return false;
        // Časovna sidra nimajo vrste: vidna so le brez filtra vrste.
        if (filters.kind !== "all") {
          if (item.isAnchor || item.kind !== filters.kind) return false;
        }
        if (filters.place !== "all" && !item.places.some((p) => p.id === filters.place))
          return false;
        if (filters.person !== "all" && !item.persons.some((p) => p.id === filters.person))
          return false;
        return true;
      }),
    [items, filters]
  );

  const hasFilters =
    filters.era !== "all" ||
    filters.kind !== "all" ||
    filters.place !== "all" ||
    filters.person !== "all";

  const eras = React.useMemo(
    () =>
      ERA_ORDER.map((key) => ({
        key,
        label: t.chronicle.eras[key],
        items: filtered.filter((i) => i.era === key),
      })).filter((era) => era.items.length > 0),
    [filtered, t]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.chronicle.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.chronicle.subtitle}</p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="gap-1.5 border-primary/30 py-1.5 pl-2.5 pr-3.5 text-sm text-primary">
          <CalendarRange className="h-4 w-4" aria-hidden="true" />
          {t.chronicle.counts(filtered.length)}
        </Badge>
      </div>

      <p className="mt-4 flex max-w-3xl items-start gap-2.5 rounded-lg border border-border/70 bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
        {t.chronicle.howTo}
      </p>

      {/* Filtri — namenoma minimalni: obdobje, vrsta, kraj, oseba */}
      <section aria-label={t.chronicle.filters.era} className="mt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Select
            value={filters.era}
            onValueChange={(v) => setFilters((f) => ({ ...f, era: v as FilterState["era"] }))}
          >
            <SelectTrigger className="h-12 w-full text-base" aria-label={t.chronicle.filters.era}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.chronicle.filters.all} · {t.chronicle.filters.era}</SelectItem>
              {ERA_ORDER.map((key) => (
                <SelectItem key={key} value={key}>
                  {t.chronicle.eras[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.kind}
            onValueChange={(v) => setFilters((f) => ({ ...f, kind: v as FilterState["kind"] }))}
          >
            <SelectTrigger className="h-12 w-full text-base" aria-label={t.chronicle.filters.kind}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.chronicle.filters.all} · {t.chronicle.filters.kind}</SelectItem>
              {(Object.keys(t.chronicle.kinds) as EventKind[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {t.chronicle.kinds[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.place}
            onValueChange={(v) => setFilters((f) => ({ ...f, place: v }))}
          >
            <SelectTrigger className="h-12 w-full text-base" aria-label={t.chronicle.filters.place}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.chronicle.filters.all} · {t.chronicle.filters.place}</SelectItem>
              {placeOptions.map(([id, label]) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.person}
            onValueChange={(v) => setFilters((f) => ({ ...f, person: v }))}
          >
            <SelectTrigger className="h-12 w-full text-base" aria-label={t.chronicle.filters.person}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.chronicle.filters.all} · {t.chronicle.filters.person}</SelectItem>
              {personOptions.map(([id, label]) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 min-h-9"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            {t.chronicle.filters.clear}
          </Button>
        )}
      </section>

      {/* Kronološka nit */}
      {eras.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-border bg-muted/40 p-6 text-center text-muted-foreground">
          {t.chronicle.noResults}
        </p>
      ) : (
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute bottom-3 left-[15px] top-3 w-0.5 rounded-full bg-border md:left-1/2 md:-translate-x-1/2"
          />
          {eras.map((era) => {
            const EraIcon = ERA_ICON[era.key];
            return (
              <section key={era.key} aria-labelledby={`kronika-${era.key}`} className="mt-14 first:mt-0">
                <div className="relative flex pl-12 md:justify-center md:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-[9px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-primary/15 md:left-1/2 md:-translate-x-1/2"
                  />
                  <h2
                    id={`kronika-${era.key}`}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-sm"
                  >
                    <EraIcon className="h-4 w-4" aria-hidden="true" />
                    {era.label}
                  </h2>
                </div>

                <ol className="mt-8 space-y-8">
                  {era.items.map((item, index) => (
                    <li key={item.key} className="relative md:grid md:grid-cols-2 md:gap-16">
                      <span
                        aria-hidden="true"
                        className="absolute left-[9px] top-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-4 ring-primary/15 md:left-1/2 md:-translate-x-1/2"
                      />
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
                        className={cn(
                          "ml-12 md:ml-0 md:w-full md:max-w-xl",
                          index % 2 === 0 ? "md:col-start-1" : "md:col-start-2 md:justify-self-end"
                        )}
                      >
                        {item.isAnchor ? (
                          <AnchorCard item={item} onOpenExhibit={onOpenExhibit} />
                        ) : (
                          <EventCard
                            item={item}
                            onOpenExhibit={onOpenExhibit}
                            onFilterPerson={(id) => setFilters((f) => ({ ...f, person: id }))}
                            onFilterPlace={(id) => setFilters((f) => ({ ...f, place: id }))}
                          />
                        )}
                      </motion.div>
                    </li>
                  ))}
                </ol>
              </section>
            );
          })}
        </div>
      )}

      {/* Križna vez na časovnico zapisov */}
      <section className="mt-16 rounded-xl border border-border/70 bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.chronicle.toObjectTimeline}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.chronicle.toObjectTimelineHint}</p>
          </div>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("casovnica")}>
            {t.nav.casovnica}
          </Button>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kartica časovnega sidra (TimeRef) — pas, ne dogodek
// ---------------------------------------------------------------------------

function AnchorCard({
  item,
  onOpenExhibit,
}: {
  item: TimelineItem;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const time = item.entity.type === "time" ? item.entity.time : undefined;
  const label = time ? pick(lang, time.labelSi, time.labelEn) : "";

  return (
    <article className="rounded-xl border border-dashed border-accent-foreground/25 bg-accent/5 p-4">
      <div className="flex items-center gap-2">
        <History className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t.chronicle.anchor}
        </span>
      </div>
      <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">
        {es.entityLabel(item.entity)}
      </h3>
      {time && <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>}
      {item.exhibits.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {item.exhibits.map((ex) => (
            <li key={ex.slug} className="min-w-0 max-w-full">
              <button
                type="button"
                onClick={() => onOpenExhibit(ex)}
                className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <span className="shrink-0 text-muted-foreground">{ex.museumNo}</span>
                <span className="min-w-0 truncate">{es.title(ex)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Kartica dogodka — čas KOT JE ZAPISAN, vir na vezi
// ---------------------------------------------------------------------------

function EventCard({
  item,
  onOpenExhibit,
  onFilterPerson,
  onFilterPlace,
}: {
  item: TimelineItem;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onFilterPerson: (id: string) => void;
  onFilterPlace: (id: string) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const time = item.entity.type === "event" ? item.entity.time : undefined;
  const timeLabel = time ? pick(lang, time.labelSi, time.labelEn) : "";
  const isApprox = item.precision === "approximate";

  // Razcep P1-E1: kartica predstavlja ZAPIS — naslov in obdobje zapisa.
  const record = item.splitRecord;
  const title = record ? es.title(record) : es.entityLabel(item.entity);
  const shownTime = record ? es.period(record) : isApprox ? `≈ ${timeLabel}` : timeLabel;

  // Drugi zapis razcepa (za opombo o možni istovetnosti) — iz SKUPINE
  // razcepa (SPLIT_EVENTS → ENTITY_QUEUE P1-E1), ne iz poljubnega evidence
  // zapisa: opomba mora imenovati prav par vprašanja.
  const siblingSlug = record && item.splitGroup
    ? item.splitGroup.slugs.find((s) => s !== record.slug)
    : undefined;
  const siblingExhibit = siblingSlug
    ? item.exhibits.find((ex) => ex.slug === siblingSlug)
    : undefined;
  const siblingTitle = siblingExhibit ? es.title(siblingExhibit) : undefined;

  /** Vir dokazne vezi zapisa (sourceIndex iz registra), sicer zapis sam. */
  const evidenceLine = (ex: ExhibitDTO): { source?: string; note: string } => {
    const binding = item.entity.evidence.find((ev) => ev.slug === ex.slug);
    const idx = binding?.sourceIndex;
    const source = idx != null ? ex.sources[idx] : undefined;
    return {
      source: source ? es.sourceName(source) : undefined,
      note: `${t.chronicle.evidenceIn} ${ex.museumNo ?? ""}`.trim(),
    };
  };

  return (
    <article className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 bg-muted/40 px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p
            className={cn(
              "font-display text-lg font-semibold leading-none",
              isApprox && !record ? "text-primary" : "text-primary"
            )}
          >
            {shownTime}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {item.kind ? t.chronicle.kinds[item.kind] : ""}
          </span>
        </div>
        {isApprox && !record && (
          <p className="mt-1 text-[11px] text-muted-foreground">≈ {t.chronicle.approximate}</p>
        )}
      </div>

      <div className="space-y-4 p-5">
        <h3 className="font-display text-xl font-semibold leading-snug">{title}</h3>

        {/* P1-E1: možna istovetnost — vidno, nikoli spojeno */}
        {record && siblingTitle && (
          <p className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
            {t.chronicle.possibleIdentity(es.title(record), siblingTitle)}
          </p>
        )}

        {/* Povezani zapisi z dokazno/dokumentarno vezo */}
        {!record && item.exhibits.length > 0 && (
          <ul className="space-y-2">
            {item.exhibits.map((ex) => {
              const ev = evidenceLine(ex);
              return (
                <li key={ex.slug}>
                  <button
                    type="button"
                    onClick={() => onOpenExhibit(ex)}
                    className="group flex w-full min-h-11 items-start gap-2.5 rounded-lg border border-border/70 bg-background p-3 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                      {ex.museumNo?.replace("MVG-", "") ?? "·"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug group-hover:text-primary">
                        {es.title(ex)}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {ev.source ? (
                          <>
                            {t.chronicle.source}: <span className="italic">{ev.source}</span>
                          </>
                        ) : (
                          ev.note
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Razcep P1-E1: primarni zapis kartice */}
        {record && (
          <button
            type="button"
            onClick={() => onOpenExhibit(record)}
            className="group flex w-full min-h-11 items-start gap-2.5 rounded-lg border border-border/70 bg-background p-3 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
              {record.museumNo?.replace("MVG-", "") ?? "·"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug group-hover:text-primary">
                {t.chronicle.openRecord} · {es.title(record)}
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {evidenceLine(record).note}
              </span>
            </span>
          </button>
        )}

        {/* Osebe in kraji — obstoječe vezi registra; klik = filter */}
        {(item.persons.length > 0 || item.places.length > 0) && (
          <div className="flex flex-col gap-2 border-t border-border/60 pt-3">
            {item.persons.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <User className="h-3 w-3" aria-hidden="true" />
                  {t.chronicle.personsTitle}
                </span>
                {item.persons.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onFilterPerson(p.id)}
                    className="inline-flex min-h-9 items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {es.entityLabel(p)}
                  </button>
                ))}
              </div>
            )}
            {item.places.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {t.chronicle.placesTitle}
                </span>
                {item.places.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onFilterPlace(p.id)}
                    className="inline-flex min-h-9 items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-xs transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {es.entityLabel(p)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
