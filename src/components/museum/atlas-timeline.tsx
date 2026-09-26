"use client";

import * as React from "react";
import { CalendarClock, ChevronLeft, ChevronRight, ExternalLink, Loader2 } from "lucide-react";
import { useLang } from "@/lib/i18n";
import {
  axisPosition,
  type TimelineDoc,
  type TimelinePoint,
} from "@/lib/atlas-timeline";

/**
 * ATLAS 1825 §20 — TIME SLIDER UI (val 76).
 *
 * Panel NE sestavlja resnice: le prikaže deterministični izhod
 * GET /api/atlas/timeline (podatkovni model časovnih točk — 1825 referenčna,
 * 1830 prvi dokumentiran korak, pričakovane letnice izrecno AWAITING_SOURCE).
 * Nič ne interpolira: vsaka točka stoji samo na svojih virih (§4).
 */

type TimelineResponse = { ok: true } & TimelineDoc;

type FetchState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; doc: TimelineResponse };

/** metric_id → i18n ključ (celoten preslikavni nabor je izpisan — ni ugibanja). */
const METRIC_LABEL_KEY: Record<string, string> = {
  population_total: "mPopulation",
  population_men: "mMen",
  population_women: "mWomen",
  houses: "mHouses",
  families: "mFamilies",
  commune_area: "mArea",
  pasture_share: "mPasture",
  arable_share: "mArable",
  meadow_share: "mMeadow",
  orchard_meadow_share: "mOrchardMeadow",
  vineyard_area: "mVineyard",
  parcels_pua: "mParcelsPua",
  parcels_ps: "mParcelsPs",
  parcels_with_land_use: "mParcelsWithUse",
  livestock_ochsen: "mLivestockOchsen",
  livestock_kuehe_rosse: "mLivestockKuehe",
  livestock_jungvieh: "mLivestockJungvieh",
  livestock_schafe: "mLivestockSchafe",
  livestock_laemmer: "mLivestockLaemmer",
};

const ABSENT_REASON_KEY: Record<string, string> = {
  population_total: "absentPopulation",
  houses: "absentHouses",
  families: "absentFamilies",
  pasture_share: "absentPastureShare",
};

/** Prazna točka (AWAITING_SOURCE) — pošten blok brez metrik (§4). */
function AwaitingCard({ point }: { point: TimelinePoint }) {
  const s = useLang().t.atlasTimeline;
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50/60 p-4 dark:border-stone-600 dark:bg-stone-900/40">
      <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
        {point.label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {s.awaitingNote}
      </p>
      {point.expected_basis ? (
        <p className="mt-2 text-[11px] leading-snug text-stone-500">
          {point.expected_basis}
        </p>
      ) : null}
    </div>
  );
}

/** Metrika: oznaka + vrednost iz vira + sledljivost (REVIEW ostaja viden). */
function MetricRow({ point }: { point: TimelinePoint }) {
  const { t } = useLang();
  const s = t.atlasTimeline;
  return (
    <ul className="grid gap-2.5" role="list">
      {point.metrics.map((m) => {
        const labelKey = METRIC_LABEL_KEY[m.metric_id];
        const label = labelKey
          ? (s as unknown as Record<string, string>)[labelKey] ?? m.metric_id
          : m.metric_id;
        return (
          <li
            key={m.metric_id}
            className="rounded-lg border border-border/60 bg-background/70 p-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-sm font-semibold">{label}</span>
              <span className="flex flex-wrap items-center gap-1.5">
                {m.reading_status === "REVIEW" ? (
                  <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                    {s.reviewBadge}
                  </span>
                ) : null}
                <span className="text-sm font-bold text-[#2f6f4f]">{m.display}</span>
              </span>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-stone-500">
              <a
                href={`/api/atlas/evidence?node=${encodeURIComponent(m.source_id)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 underline decoration-dotted underline-offset-2 hover:text-foreground"
              >
                {m.source_id}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
              <span aria-hidden="true">·</span>
              <span>{s.evidence}: {m.evidence}</span>
            </p>
            {m.note ? (
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{m.note}</p>
            ) : null}
          </li>
        );
      })}
      {point.absent_metrics.length > 0 ? (
        <li className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            {s.absentTitle}
          </p>
          <ul className="mt-1.5 grid gap-1.5" role="list">
            {point.absent_metrics.map((a) => {
              const key = ABSENT_REASON_KEY[a.metric_id];
              const reason =
                key
                  ? (s as unknown as Record<string, string>)[key] ?? a.reason
                  : a.reason;
              return (
                <li key={a.metric_id} className="text-[12px] leading-snug text-muted-foreground">
                  {reason}
                </li>
              );
            })}
          </ul>
        </li>
      ) : null}
    </ul>
  );
}

export function AtlasTimelinePanel() {
  const { t } = useLang();
  const s = t.atlasTimeline;
  const [state, setState] = React.useState<FetchState>({ kind: "loading" });
  const [selected, setSelected] = React.useState<number | null>(null);

  React.useEffect(() => {
    let alive = true;
    fetch("/api/atlas/timeline")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((doc: TimelineResponse) => {
        if (!alive) return;
        setState({ kind: "ready", doc });
        setSelected((cur) =>
          cur !== null && doc.points.some((p) => p.year === cur)
            ? cur
            : doc.points[0]?.year ?? null
        );
      })
      .catch(() => {
        if (alive) setState({ kind: "error" });
      });
    return () => {
      alive = false;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="flex h-full items-center justify-center p-6" role="status">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {s.loading}
        </p>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">{s.error}</p>
      </div>
    );
  }

  const { doc } = state;
  const years = doc.summary.years;
  const minYear = years[0] ?? 1825;
  const maxYear = years[years.length - 1] ?? 1910;
  const point =
    doc.points.find((p) => p.year === selected) ?? doc.points[0] ?? null;
  const selIdx = point ? years.indexOf(point.year) : -1;

  return (
    <div
      className="flex h-full min-h-0 flex-col gap-5 overflow-y-auto p-5 sm:p-6"
      aria-label={s.title}
    >
      {/* ——— Glava ——— */}
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-stone-500">
          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
          {s.eyebrow}
        </p>
        <h3 className="font-display mt-1 text-xl font-semibold sm:text-2xl">{s.title}</h3>
        <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">{s.note}</p>
      </div>

      {/* ——— Os (drsnik): pike proporcionalno po letnici, oznake izmenično ——— */}
      <div
        className="rounded-xl border border-border/70 bg-background/60 p-4 pt-8"
        role="group"
        aria-label={s.axisLabel}
      >
        <div className="relative h-16">
          {/* tirnica */}
          <div
            className="absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 bg-border"
            aria-hidden="true"
          />
          {doc.points.map((p) => {
            const left = axisPosition(p.year, minYear, maxYear);
            const isSel = point?.year === p.year;
            const documented = p.status === "DOCUMENTED";
            return (
              <button
                key={p.year}
                onClick={() => setSelected(p.year)}
                aria-pressed={isSel}
                aria-label={`${p.year} — ${documented ? s.statusDocumented : s.statusAwaiting}`}
                title={`${p.year} — ${documented ? s.statusDocumented : s.statusAwaiting}`}
                className={`group absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full p-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isSel ? "scale-110" : "hover:scale-105"
                }`}
                style={{ left: `${left}%` }}
              >
                <span
                  aria-hidden="true"
                  className={
                    documented
                      ? `block h-4 w-4 rounded-full border-2 border-[#2f6f4f] transition-colors ${
                          isSel ? "bg-[#2f6f4f]" : "bg-[#2f6f4f]/30"
                        }`
                      : `block h-3.5 w-3.5 rounded-full border-2 border-dashed border-stone-400 bg-transparent ${
                          isSel ? "bg-stone-200 dark:bg-stone-700" : ""
                        }`
                  }
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 w-12 -translate-x-1/2 whitespace-nowrap text-center text-[10px] font-semibold ${
                    documented
                      ? "top-6 text-[#2f6f4f]" // dokumentirane pod piko
                      : "-top-6 text-stone-500" // pričakovane nad piko
                  } ${isSel ? "underline decoration-2 underline-offset-2" : ""}`}
                >
                  {p.year}
                </span>
              </button>
            );
          })}
        </div>
        {/* legenda + navigacija */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="block h-3 w-3 rounded-full border-2 border-[#2f6f4f] bg-[#2f6f4f]" />
              {s.legendDocumented}
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="block h-3 w-3 rounded-full border-2 border-dashed border-stone-400" />
              {s.legendAwaiting}
            </span>
          </p>
          <div className="flex items-center gap-1" role="navigation" aria-label={s.axisLabel}>
            <button
              onClick={() =>
                selIdx > 0 && setSelected(years[selIdx - 1])
              }
              disabled={selIdx <= 0}
              aria-label={s.prevYear}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() =>
                selIdx >= 0 && selIdx < years.length - 1 && setSelected(years[selIdx + 1])
              }
              disabled={selIdx < 0 || selIdx >= years.length - 1}
              aria-label={s.nextYear}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* ——— Izbrana točka ——— */}
      {point ? (
        <div className="min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-lg font-semibold">
              {point.year}{" "}
              <span
                className={`ml-1 inline-block rounded-full px-2 py-0.5 align-middle text-[10px] font-semibold uppercase tracking-wide ${
                  point.status === "DOCUMENTED"
                    ? "bg-[#2f6f4f]/10 text-[#2f6f4f]"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {point.status === "DOCUMENTED" ? s.statusDocumented : s.statusAwaiting}
              </span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              {s.pointsCount
                .replace("{documented}", String(doc.summary.documented))
                .replace("{awaiting}", String(doc.summary.awaiting_source))}
            </p>
          </div>
          <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{point.label}</p>
          {point.note ? (
            <p className="mt-1 text-[11px] leading-snug text-stone-500">{point.note}</p>
          ) : null}

          <div className="mt-3">
            {point.status === "DOCUMENTED" ? (
              <MetricRow point={point} />
            ) : (
              <AwaitingCard point={point} />
            )}
          </div>

          {/* Viri točke — sledljivost do KG SOURCE vozlišč */}
          {point.source_ids.length > 0 ? (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                {s.sourcesTitle}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {point.source_ids.map((sid) => (
                  <a
                    key={sid}
                    href={`/api/atlas/evidence?node=${encodeURIComponent(sid)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {sid}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
