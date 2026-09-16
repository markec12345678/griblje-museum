"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpenText, LetterText, Search } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { normalize } from "@/lib/normalize";
import {
  glossaryTerms,
  glossaryByLetter,
  GLOSSARY_LETTERS,
  type GlossaryTerm,
} from "@/lib/glossary";
import type { ExhibitDTO } from "@/lib/types";
import { Input } from "@/components/ui/input";

/**
 * Izrazoslovje — slovar pojmov muzeja.
 *
 * Vzorec: rubrika »Art terms« londonske galerije Tate, kjer slovar
 * pojmov stoji ob zbirki in razlaga besede, v katerih zbirka živi.
 * Vsak pojem je vezan na zapise, iz katerih je povzet — klik na povezano
 * pripada odpre zapis v zbirki.
 */
export function GlossaryView({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t, lang } = useLang();
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = React.useState("");

  const isEnglish = lang === "en";

  const matches = React.useCallback(
    (term: GlossaryTerm) => {
      const q = normalize(query);
      if (!q) return true;
      return (
        normalize(term.termSi).includes(q) ||
        normalize(term.termEn).includes(q) ||
        normalize(term.definitionSi).includes(q) ||
        normalize(term.definitionEn).includes(q)
      );
    },
    [query]
  );

  const visibleCount = React.useMemo(
    () => glossaryTerms.filter(matches).length,
    [matches]
  );

  const exhibitBySlug = React.useMemo(
    () => new Map(exhibits.map((ex) => [ex.slug, ex])),
    [exhibits]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Uvod */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.glossary.kicker}
        </p>
        <h1 className="font-display mt-2 flex items-center gap-3 text-4xl font-semibold sm:text-5xl">
          <BookOpenText className="h-8 w-8 text-primary" aria-hidden="true" />
          {t.glossary.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{t.glossary.subtitle}</p>
      </div>

      {/* Iskanje po pojmu */}
      <div className="mt-6 max-w-xl">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.glossary.searchPlaceholder}
            className="pl-9"
            aria-label={t.glossary.searchLabel}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {t.glossary.count(visibleCount)}
        </p>
      </div>

      {/* Abecedni kazalo */}
      <nav
        aria-label={t.glossary.indexLabel}
        className="mt-8 flex flex-wrap items-center gap-1.5"
      >
        {GLOSSARY_LETTERS.map((letter) => {
          const terms = glossaryByLetter.get(letter) ?? [];
          const visible = terms.filter(matches);
          if (terms.length === 0) return null;
          return (
            <a
              key={letter}
              href={`#crka-${letter}`}
              aria-disabled={visible.length === 0}
              className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-2 text-sm font-semibold transition-colors ${
                visible.length === 0
                  ? "pointer-events-none border-border/50 text-muted-foreground/40"
                  : "border-border/70 text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {letter}
            </a>
          );
        })}
      </nav>

      {/* Pojmi po črkah */}
      <div className="mt-8 space-y-10">
        {GLOSSARY_LETTERS.map((letter) => {
          const terms = glossaryByLetter.get(letter) ?? [];
          const visible = terms.filter(matches);
          if (visible.length === 0) return null;
          return (
            <section key={letter} aria-labelledby={`crka-${letter}`}>
              <h2
                id={`crka-${letter}`}
                className="font-display flex items-center gap-3 text-2xl font-semibold"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <LetterText className="h-5 w-5" aria-hidden="true" />
                </span>
                {letter}
              </h2>
              <ul className="mt-4 grid gap-5 md:grid-cols-2">
                {visible.map((term, i) => (
                  <motion.li
                    key={term.slug}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.2) }}
                    className="rounded-xl border border-border/70 bg-card p-5"
                  >
                    <h3 className="font-display text-lg font-semibold">
                      {term.termSi}
                      <span className="ml-2 text-sm font-normal italic text-muted-foreground">
                        {term.termEn}
                      </span>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {isEnglish ? term.definitionEn : term.definitionSi}
                    </p>
                    {/* Povezani zapisi */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {t.glossary.related}:
                      </span>
                      {term.related
                        .map((slug) => exhibitBySlug.get(slug))
                        .filter((ex): ex is ExhibitDTO => Boolean(ex))
                        .map((ex) => (
                          <button
                            key={`${term.slug}-${ex.slug}`}
                            type="button"
                            onClick={() => onOpenExhibit(ex)}
                            className="min-h-11 rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-foreground/90 transition-colors hover:border-primary hover:text-primary"
                          >
                            {isEnglish
                              ? ex.titleEn || ex.titleSi
                              : ex.titleSi}
                          </button>
                        ))}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </section>
          );
        })}
        {visibleCount === 0 && (
          <p className="rounded-xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            {t.glossary.empty}
          </p>
        )}
      </div>
    </div>
  );
}
