"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Archive,
  Camera,
  ChevronDown,
  Clock,
  ExternalLink,
  Landmark,
  MessageSquareQuote,
  Sprout,
  Users,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { getBiography, type BiographyStage } from "@/lib/object-biographies";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { EvidenceBadge } from "@/components/museum/evidence-badge";

/**
 * Življenje predmeta — časovnica poti zapisa skozi faze, vire in
 * stopnje zanesljivosti.
 *
 * Vzorec: Carnegie Museum of Art »Art Tracks« (provenance kot živa
 * pripoved) in praksa St. Louis Art Museuma: negotovost se pokaže,
 * ne skrije — vrzeli so legitimna vsebina. Vsaka točka nosi vir
 * (kjer obstaja) in EvidenceBadge.
 */

const STAGE_ICONS: Record<BiographyStage, React.ComponentType<{ className?: string }>> = {
  nastanek: Sprout,
  zivljenje: Users,
  prica: MessageSquareQuote,
  raziskava: Archive,
  digitalizacija: Camera,
  danes: Landmark,
};

const STAGE_LABEL_KEYS: Record<BiographyStage, "nastanek" | "zivljenje" | "prica" | "raziskava" | "digitalizacija" | "danes"> = {
  nastanek: "nastanek",
  zivljenje: "zivljenje",
  prica: "prica",
  raziskava: "raziskava",
  digitalizacija: "digitalizacija",
  danes: "danes",
};

/** Faze z nižjo stopnjo zanesljivosti dobijo črtkano povezavo (vidna negotovost). */
const UNCERTAIN = new Set(["TESTIMONY", "TRADITION", "UNVERIFIED", "TO_COLLECT"]);

export function ObjectBiography({ exhibit }: { exhibit: ExhibitDTO }) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);

  const bio = getBiography(exhibit.slug);
  if (!bio) return null;

  const phaseCount = bio.phases.length;

  return (
    <section aria-labelledby="zivljenje-predmeta" className="mt-6 rounded-lg border border-border/70 bg-card p-4">
      <Button
        type="button"
        variant="ghost"
        className="flex w-full items-center justify-between gap-2 px-2 py-2 text-left"
        aria-expanded={open}
        aria-controls="zivljenje-predmeta-vsebina"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Clock className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span id="zivljenje-predmeta" className="font-display block text-base font-semibold">
              {t.biography.title}
            </span>
            <span className="block text-xs text-muted-foreground">
              {t.biography.phaseCount(phaseCount)}
            </span>
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </Button>

      {open && (
        <div id="zivljenje-predmeta-vsebina" className="mt-4">
          <p className="mb-5 text-xs italic leading-relaxed text-muted-foreground">
            {t.biography.intro}
          </p>

          <ol className="relative space-y-6 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-border">
            {bio.phases.map((phase, index) => {
              const Icon = STAGE_ICONS[phase.stage];
              const source =
                phase.sourceIndex != null
                  ? exhibit.sources[phase.sourceIndex]
                  : undefined;
              const uncertain = UNCERTAIN.has(phase.evidenceStatus);

              return (
                <motion.li
                  key={`${phase.stage}-${phase.yearLabelSi}-${index}`}
                  initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.07, 0.5) }}
                  className="relative pl-11"
                >
                  {/* Vozel na črti */}
                  <span
                    className={`absolute left-0 top-0.5 flex size-8 items-center justify-center rounded-full border bg-background ${
                      uncertain ? "border-dashed border-muted-foreground/50" : "border-primary/40"
                    } ${uncertain ? "text-muted-foreground" : "text-primary"}`}
                    aria-hidden="true"
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-sm font-semibold">
                      {lang === "sl" ? phase.yearLabelSi : phase.yearLabelEn}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {t.biography.stages[STAGE_LABEL_KEYS[phase.stage]]}
                    </span>
                  </div>

                  <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                    {lang === "sl" ? phase.textSi : phase.textEn}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <EvidenceBadge status={phase.evidenceStatus} />
                    {source && (
                      <span className="inline-flex max-w-full items-center gap-1.5 text-xs text-muted-foreground">
                        <span aria-hidden="true">—</span>
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 underline decoration-border underline-offset-2 hover:text-foreground"
                          >
                            <span className="sr-only">{t.biography.sourceLabel}: </span>
                            {lang === "sl" ? source.nameSi : source.nameEn}
                            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="italic">
                            <span className="sr-only">{t.biography.sourceLabel}: </span>
                            {lang === "sl" ? source.nameSi : source.nameEn}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
