"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Camera, Compass, MapPin, Sparkle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";

/**
 * Zbirka v številkah — igrična miza o tem, kaj muzej hrani.
 *
 * Vzorec: Met/MoMA/Tate vizualizacije zbirke (MW konference "Data and Art");
 * AAM "What Can Data Teach Us About Museum Collections?". Vse številke se
 * izračunajo na odjemalcu iz odprtih podatkov zbirke — brez ročnega
 * vzdrževanja. Barvne vrstice so ročno risan SVG/CSS (brez knjižnic).
 */

const CATEGORY_ORDER: ExhibitCategory[] = [
  "kraj",
  "kolpa",
  "vojna",
  "narava",
  "gospodarstvo",
  "sege",
];

const EVIDENCE_ORDER = [
  "DOCUMENTED",
  "CORROBORATED",
  "TESTIMONY",
  "TRADITION",
  "UNVERIFIED",
  "TO_COLLECT",
] as const;

type EraKey = "earlyModern" | "xix" | "interwar" | "wartime" | "yugoslav" | "modern";

const ERAS: { key: EraKey; from: number; to: number }[] = [
  { key: "earlyModern", from: -Infinity, to: 1800 },
  { key: "xix", from: 1800, to: 1918 },
  { key: "interwar", from: 1918, to: 1941 },
  { key: "wartime", from: 1941, to: 1955 },
  { key: "yugoslav", from: 1955, to: 1991 },
  { key: "modern", from: 1991, to: Infinity },
];

function eraOf(exhibit: ExhibitDTO): EraKey | null {
  const year = exhibit.yearFrom ?? exhibit.yearTo;
  if (year == null) return null;
  return ERAS.find((era) => year >= era.from && year < era.to)?.key ?? null;
}

export function CollectionStats({ exhibits }: { exhibits: ExhibitDTO[] }) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();

  const total = exhibits.length;

  const byCategory = React.useMemo(() => {
    const counts = new Map<ExhibitCategory, number>();
    for (const cat of CATEGORY_ORDER) counts.set(cat, 0);
    for (const ex of exhibits) {
      counts.set(ex.category, (counts.get(ex.category) ?? 0) + 1);
    }
    return CATEGORY_ORDER.map((cat) => ({
      key: cat,
      count: counts.get(cat) ?? 0,
      label: t.categories[cat],
    }));
  }, [exhibits, t]);

  const byEvidence = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const ex of exhibits) {
      counts.set(ex.evidenceStatus, (counts.get(ex.evidenceStatus) ?? 0) + 1);
    }
    return EVIDENCE_ORDER.map((status) => ({
      key: status,
      count: counts.get(status) ?? 0,
      label: t.evidence[status],
    }));
  }, [exhibits, t]);

  const byEra = React.useMemo(() => {
    const counts = new Map<EraKey, number>();
    for (const ex of exhibits) {
      const era = eraOf(ex);
      if (era) counts.set(era, (counts.get(era) ?? 0) + 1);
    }
    return ERAS.filter((era) => (counts.get(era.key) ?? 0) > 0).map((era) => ({
      key: era.key,
      count: counts.get(era.key) ?? 0,
      label: t.collectionStats.centuries[era.key],
    }));
  }, [exhibits, t]);

  const facts = React.useMemo(() => {
    const dated = exhibits
      .filter((ex) => ex.yearFrom != null)
      .sort((a, b) => (a.yearFrom ?? 0) - (b.yearFrom ?? 0));
    const oldest = dated[0];
    const newest = dated[dated.length - 1];
    const photographed = exhibits.filter((ex) => ex.image != null).length;
    const geolocated = exhibits.filter((ex) => ex.lat != null && ex.lng != null).length;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
    return { oldest, newest, photographedPct: pct(photographed), geolocatedPct: pct(geolocated) };
  }, [exhibits, total]);

  if (total === 0) return null;

  return (
    <div className="mt-6 space-y-10">
      {/* Vrstice po kategorijah */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="st-kategorije">
          <h3 id="st-kategorije" className="font-display flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.collectionStats.byCategoryTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {byCategory.map((row) => (
              <li key={row.key}>
                <StatBar
                  label={row.label}
                  value={row.count}
                  total={total}
                  entriesLabel={t.collectionStats.entriesLabel}
                  reduceMotion={reduceMotion}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Vrstice po zanesljivosti virov */}
        <section aria-labelledby="st-zanesljivost">
          <h3 id="st-zanesljivost" className="font-display flex items-center gap-2 text-lg font-semibold">
            <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.collectionStats.byEvidenceTitle}
          </h3>
          <ul className="mt-4 space-y-3">
            {byEvidence.map((row) => (
              <li key={row.key}>
                <StatBar
                  label={row.label}
                  value={row.count}
                  total={total}
                  entriesLabel={t.collectionStats.entriesLabel}
                  tone="evidence"
                  reduceMotion={reduceMotion}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Obdobja — vodoravna časovnica */}
      {byEra.length > 0 && (
        <section aria-labelledby="st-obdobja">
          <h3 id="st-obdobja" className="font-display flex items-center gap-2 text-lg font-semibold">
            <Sparkle className="h-5 w-5 text-primary" aria-hidden="true" />
            {t.collectionStats.byEraTitle}
          </h3>
          <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {byEra.map((era, index) => (
              <motion.li
                key={era.key}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="rounded-xl border border-border/70 bg-card p-4 text-center"
              >
                <p className="font-display text-2xl font-semibold text-primary">{era.count}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{era.label}</p>
              </motion.li>
            ))}
          </ol>
        </section>
      )}

      {/* Zanimivosti */}
      <section aria-labelledby="st-zanimivosti">
        <h3 id="st-zanimivosti" className="font-display flex items-center gap-2 text-lg font-semibold">
          <Sparkle className="h-5 w-5 text-primary" aria-hidden="true" />
          {t.collectionStats.factsTitle}
        </h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.oldest && (
            <FactCard
              title={t.collectionStats.oldestFact}
              value={es.title(facts.oldest)}
              detail={es.period(facts.oldest)}
            />
          )}
          {facts.newest && facts.newest !== facts.oldest && (
            <FactCard
              title={t.collectionStats.newestFact}
              value={es.title(facts.newest)}
              detail={es.period(facts.newest)}
            />
          )}
          <FactCard
            title={t.collectionStats.photographedFact}
            value={`${facts.photographedPct} %`}
            icon={<Camera className="h-4 w-4" aria-hidden="true" />}
          />
          <FactCard
            title={t.collectionStats.geolocatedFact}
            value={`${facts.geolocatedPct} %`}
            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
          />
        </ul>
      </section>
    </div>
  );
}

function StatBar({
  label,
  value,
  total,
  entriesLabel,
  tone = "primary",
  reduceMotion,
}: {
  label: string;
  value: number;
  total: number;
  entriesLabel: string;
  tone?: "primary" | "evidence";
  reduceMotion: boolean | null;
}) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value}
          <span className="sr-only"> {entriesLabel}</span>
        </span>
      </div>
      <div
        className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${label}: ${value}`}
      >
        <motion.div
          className={`h-full rounded-full ${
            tone === "primary" ? "bg-primary/80" : "bg-accent-foreground/70"
          }`}
          initial={reduceMotion ? { width: `${pct}%` } : { width: 0 }}
          whileInView={{ width: `${Math.max(pct, value > 0 ? 4 : 0)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function FactCard({
  title,
  value,
  detail,
  icon,
}: {
  title: string;
  value: string;
  detail?: string;
  icon?: React.ReactNode;
}) {
  return (
    <li className="rounded-xl border border-border/70 bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </p>
      <p className="font-display mt-2 line-clamp-2 text-base font-semibold leading-snug">
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
    </li>
  );
}
