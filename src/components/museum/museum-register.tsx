"use client";

import { seedExhibits } from "@/lib/museum-content";
import { useLang, pick } from "@/lib/i18n";
import { Archive } from "lucide-react";

/**
 * Muzejski register — strežniško upodobljen katalog vseh 93 zapisov.
 *
 * Vzorec: katalogi zbirk vodilnih muzejev (Rijksmuseum Collection, DigitaltMuseum)
 * so HTML povezave na strani zapisa — plezalni robot (in obiskovalec brez
 * JavaScripta) pride z domače strani do vsakega predmeta. Glavna aplikacija
 * je enostranska in kartice odpira v pogovornem oknu (gumbi onClick), zato
 * tu stoji register s pravimi <a href="/exponat/[slug]"> povezavami:
 * trajna muzejska številka + naslov + kategorija, ena vrstica na zapis.
 *
 * Podatki prihajajo naravnost iz semena zbirke (museum-content.ts) — enak vir
 * resnice kot objektne strani /exponat/[slug] in seme baze — ne čakajo na
 * odjemalski klic API-ja, zato je register v izhodnem HTML prisoten tudi med
 * nalaganjem (viden iskalnikom in tiskalniku).
 */
export function MuseumRegister() {
  const { t, lang } = useLang();

  return (
    <section
      aria-labelledby="muzejski-register"
      className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl">
        <h2
          id="muzejski-register"
          className="font-display flex items-center gap-2.5 text-2xl font-semibold sm:text-3xl"
        >
          <Archive className="h-6 w-6 text-primary" aria-hidden="true" />
          {t.register.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {t.register.subtitle}
        </p>
      </div>

      <ol className="mt-8 grid gap-x-8 gap-y-0.5 border-t border-border/70 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {seedExhibits.map((ex) => (
          <li key={ex.slug}>
            <a
              href={`/exponat/${ex.slug}`}
              className="group flex min-h-11 items-baseline gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <span className="shrink-0 font-mono text-xs font-semibold text-primary/80 group-hover:text-primary">
                {ex.museumNo ?? "—"}
              </span>
              <span className="min-w-0">
                <span className="font-medium leading-snug group-hover:underline group-hover:decoration-primary/40 group-hover:underline-offset-2">
                  {pick(lang, ex.titleSi, ex.titleEn)}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {t.categories[ex.category]}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
