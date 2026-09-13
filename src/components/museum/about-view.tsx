"use client";

import * as React from "react";
import {
  Accessibility,
  Archive,
  BookOpen,
  Database,
  ExternalLink,
  FileText,
  Globe,
  HeartHandshake,
  Map as MapIcon,
  Mic,
  Quote,
  Target,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import type { ExhibitDTO, SourceType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

const SOURCE_ICON: Record<SourceType, React.ElementType> = {
  arhiv: Archive,
  fotografija: FileText,
  objava: BookOpen,
  "spletni-vir": Globe,
  pricevanje: Mic,
  zemljevid: MapIcon,
};

const EVIDENCE_ORDER = [
  "DOCUMENTED",
  "CORROBORATED",
  "TESTIMONY",
  "TRADITION",
  "UNVERIFIED",
  "TO_COLLECT",
] as const;

export function AboutView({ exhibits }: { exhibits: ExhibitDTO[] }) {
  const { t, lang } = useLang();

  // Unikatni viri cele zbirke
  const allSources = React.useMemo(
    () =>
      exhibits.flatMap((ex) =>
        ex.sources.map((source) => ({
          ...source,
          exhibitTitle: lang === "sl" ? ex.titleSi : ex.titleEn,
        }))
      ),
    [exhibits, lang]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.about.title}</h1>
      </div>

      {/* MISIJA */}
      <section aria-labelledby="o-misija" className="mt-10">
        <Card className="paper-grain border-border/70">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:gap-6 sm:p-8">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="max-w-3xl">
              <h2 id="o-misija" className="font-display text-2xl font-semibold">
                {t.about.missionTitle}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                {t.about.missionText}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ZAKAJ TAKO */}
      <section aria-labelledby="o-zakaj" className="mt-8">
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
          <h2 id="o-zakaj" className="font-display flex items-center gap-3 text-xl font-semibold">
            <HeartHandshake className="h-5.5 w-5.5 text-accent" aria-hidden="true" />
            {t.about.inspireTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-foreground/85">
            {t.about.inspireText}
          </p>
        </div>
      </section>

      {/* LESTVICA ZANESLJIVOSTI */}
      <section aria-labelledby="o-lestvica" className="mt-14">
        <h2 id="o-lestvica" className="font-display text-2xl font-semibold sm:text-3xl">
          {t.about.scaleTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.about.scaleText}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EVIDENCE_ORDER.map((status) => (
            <li
              key={status}
              className="flex flex-col gap-2.5 rounded-xl border border-border/70 bg-card p-5"
            >
              <EvidenceBadge status={status} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t.evidence.desc[status]}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* DOSTOPNOST */}
      <section aria-labelledby="o-dostopnost" className="mt-14">
        <h2 id="o-dostopnost" className="font-display flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
          <Accessibility className="h-6.5 w-6.5 text-primary" aria-hidden="true" />
          {t.about.accessTitle}
        </h2>
        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6">
              <Badge className="border-primary/30 bg-primary/10 text-primary">
                {t.about.accessStatus}
              </Badge>
              <h3 className="font-display text-lg font-semibold">
                {t.about.accessPointsTitle}
              </h3>
              <ul className="museum-scroll max-h-72 space-y-2 overflow-y-auto pr-2">
                {t.about.accessPoints.map((point) => (
                  <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6">
              <h3 className="font-display text-lg font-semibold">
                {t.about.accessLimitTitle}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/85">
                {t.about.accessLimitText}
              </p>
              <Separator className="!my-2" />
              <p className="text-sm italic text-muted-foreground">
                {t.about.accessFeedback}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ODPRTI PODATKI */}
      <section aria-labelledby="o-podatki" className="mt-14">
        <h2 id="o-podatki" className="font-display flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
          <Database className="h-6.5 w-6.5 text-primary" aria-hidden="true" />
          {t.about.openDataTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.about.openDataText}</p>

        <div className="mt-6 overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t.about.openDataHow}
            </span>
            <a
              href="/api/opendata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              /api/opendata
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
          <pre className="museum-scroll overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-foreground/85">
{`curl -s https://muzej-griblje/api/opendata \\
  | jq '.counts'

# { "exhibits": ${exhibits.length},
#   "sources":  ${allSources.length}, ... }

fetch("/api/exhibits")
  .then(r => r.json())
  .then(({ exhibits }) =>
    exhibits.map(e => e.title.${lang})
  )`}
          </pre>
        </div>
      </section>

      {/* REGISTER VIROV */}
      <section aria-labelledby="o-viri" className="mt-14">
        <h2 id="o-viri" className="font-display text-2xl font-semibold sm:text-3xl">
          {t.about.sourcesTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.about.sourcesText}</p>
        <ul className="museum-scroll mt-6 max-h-96 space-y-2.5 overflow-y-auto pr-2">
          {allSources.map((source) => {
            const Icon = SOURCE_ICON[source.sourceType] ?? Globe;
            return (
              <li
                key={source.id}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-card p-4"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">
                    {lang === "sl" ? source.nameSi : source.nameEn}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Quote className="h-3 w-3" aria-hidden="true" />
                      {source.license}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{source.exhibitTitle}</span>
                    {source.url && (
                      <>
                        <span aria-hidden="true">·</span>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                        >
                          {lang === "sl" ? "odpri" : "open"}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* KOLOFON */}
      <section aria-labelledby="o-kolofon" className="mt-14">
        <h2 id="o-kolofon" className="font-display text-2xl font-semibold sm:text-3xl">
          {t.about.colophonTitle}
        </h2>
        <Card className="mt-4 border-border/70 bg-card">
          <CardContent className="space-y-2.5 p-6">
            {t.about.colophonText.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-muted-foreground">
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Separator() {
  return <hr className="border-t border-border/70" aria-hidden="true" />;
}
