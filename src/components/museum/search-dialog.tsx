"use client";

import * as React from "react";
import Image from "next/image";
import { Calendar, Clock3, Landmark, ScrollText, X } from "lucide-react";
import { useLang, localeOf, type Lang } from "@/lib/i18n";
import type { ExhibitDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Enotno iskanje po muzeju — UI nad /api/search.
 * Vzorc: DigitaltMuseum (digitaltmuseum.no), skupna norveško-švedska
 * muzejska baza, katere jedro je enotno iskanje po vseh vrstah vsebin.
 * Filtriranje izvaja strežnik (shouldFilter = false), cmdk pa prispeva
 * tipkovnično navigacijo po zadetkih.
 */

type Localized = { sl: string; en: string };

type ExhibitHit = {
  type: "exhibit";
  slug: string;
  museumNo: string | null;
  title: Localized;
  period: Localized;
  summary: Localized;
  evidenceStatus: string;
  yearFrom: number | null;
  yearTo: number | null;
  image: string | null;
  url: string;
  matchedIn: string[];
};

type StoryHit = {
  type: "story";
  kind: "ZGODBA" | "NACELO" | "RAZPIS";
  title: Localized;
  evidenceStatus: string;
  url: string;
  matchedIn: string[];
};

type EventHit = {
  type: "event";
  title: Localized;
  startsAt: string;
  location: Localized;
  isExternal: boolean;
  externalUrl: string | null;
  url: string;
  matchedIn: string[];
};

type SearchResponse = {
  query: string;
  counts: { exhibits: number; stories: number; events: number; total: number };
  results: { exhibits: ExhibitHit[]; stories: StoryHit[]; events: EventHit[] };
};

type Status = "idle" | "loading" | "done" | "error";

/** Zadnja iskanja — zgodovina v localStorage (vzorec: Rijksmuseum,
 *  ki na strani zbirke ponudi nazadnje iskane pojme; Tate: »Try
 *  searching for …« za predloge). Brez računa, samo v tem brskalniku. */
const RECENT_KEY = "mvg-recent-searches";
const RECENT_MAX = 6;

function readRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function pushRecent(term: string): void {
  try {
    const q = term.trim();
    if (q.length < 2) return;
    const next = [q, ...readRecent().filter((s) => s !== q)].slice(0, RECENT_MAX);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // localStorage ni na voljo — zgodovina preprosto ni shranjena
  }
}

/** Predlagana iskanja — kurirani pojmi zbirke (Tate: »Try searching for«).
 * MVG-001 je izrecno med njimi: trajna muzejska številka je iskiva in je
 * hkrati najkrajša pot od QR-oznake ali registra do zapisa. */
function suggestedTerms(lang: Lang): string[] {
  if (lang === "en")
    return ["Kolpa", "school", "war", "jurjevo", "tobacco", "postcard", "church", "bell", "MVG-001"];
  if (lang === "hr")
    return ["Kolpa", "škola", "rat", "jurjevo", "duhan", "razglednica", "crkva", "žbul", "MVG-001"];
  if (lang === "de")
    return ["Kolpa", "Schule", "Krieg", "Jurjevo", "Tabak", "Postkarte", "Kirche", "Žbul", "MVG-001"];
  if (lang === "it")
    return ["Kolpa", "scuola", "guerra", "Jurjevo", "tabacco", "cartolina", "chiesa", "Žbul", "MVG-001"];
  return ["Kolpa", "šola", "vojna", "jurjevo", "tobak", "razglednica", "cerkev", "žbul", "MVG-001"];
}

function storyKindLabel(kind: StoryHit["kind"], lang: Lang): string {
  if (kind === "ZGODBA")
    return lang === "sl"
      ? "zgodba"
      : lang === "hr"
        ? "priča"
        : lang === "de"
          ? "Geschichte"
          : lang === "it"
            ? "racconto"
            : "story";
  if (kind === "NACELO")
    return lang === "sl"
      ? "kuratorsko načelo"
      : lang === "hr"
        ? "kuratorsko načelo"
        : lang === "de"
          ? "kuratorisches Prinzip"
          : lang === "it"
            ? "principio curatoriale"
            : "curatorial principle";
  return lang === "sl"
    ? "razpis za pričevanja"
    : lang === "hr"
      ? "natječaj za svjedočanstva"
      : lang === "de"
        ? "Aufruf für Zeugnisse"
        : lang === "it"
          ? "appello alle testimonianze"
          : "call for testimonies";
}

export function SearchDialog({
  open,
  onOpenChange,
  exhibits,
  onOpenExhibit,
  onNavigate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onNavigate: (view: MuseumView) => void;
}) {
  const { t, lang } = useLang();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResponse | null>(null);
  const [status, setStatus] = React.useState<Status>("idle");
  const [recent, setRecent] = React.useState<string[]>([]);

  // Zgodovina iskanja naložena ob vsakem odprtju dialoga.
  React.useEffect(() => {
    if (open) setRecent(readRecent());
  }, [open]);

  const dateFmt = React.useMemo(
    () =>
      new Intl.DateTimeFormat(localeOf(lang), {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [lang]
  );

  // Odbojno iskanje: 280 ms po premoru, prejšnjo zahtevo prekličemo.
  React.useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setStatus("idle");
      setResults(null);
      return;
    }
    setStatus("loading");
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResults((await res.json()) as SearchResponse);
        setStatus("done");
        pushRecent(q);
        setRecent(readRecent());
      } catch (error) {
        if ((error as Error).name !== "AbortError") setStatus("error");
      }
    }, 280);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const total = results?.counts.total ?? 0;
  const hasSome =
    !!results && (results.results.exhibits.length > 0 || results.results.stories.length > 0 || results.results.events.length > 0);

  const closeAnd = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  const statusText =
    status === "loading"
      ? t.search.searching
      : status === "error"
        ? t.search.error
        : status === "done"
          ? t.search.resultsCount(total)
          : query.trim().length === 1
            ? t.search.minChars
            : t.search.hint;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{t.search.title}</DialogTitle>
          <DialogDescription>{t.search.description}</DialogDescription>
        </DialogHeader>

        <Command shouldFilter={false} loop className="[&_[cmdk-group-heading]]:text-muted-foreground">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={t.search.placeholder}
            aria-label={t.search.title}
          />

          {/* Stanje iskanja (živo območje za bralnike zaslona) */}
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-2 text-xs text-muted-foreground"
          >
            <span className="min-w-0 truncate">
              {status === "loading" && (
                <span
                  className="mr-1.5 inline-block size-3 animate-spin rounded-full border-2 border-current border-t-transparent align-[-2px]"
                  aria-hidden="true"
                />
              )}
              {statusText}
            </span>
            <kbd
              aria-hidden="true"
              className="hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline-block"
            >
              Esc
            </kbd>
          </div>

          <CommandList className="museum-scroll max-h-[min(60vh,26rem)]">
            {status === "idle" && (
              <div className="px-4 py-4">
                <p className="text-center text-sm text-muted-foreground">
                  {query.trim().length === 1 ? t.search.minChars : t.search.hint}
                </p>

                {/* Zadnja iskanja (vzorec: Rijksmuseum) */}
                {recent.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t.search.recent}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            window.localStorage.removeItem(RECENT_KEY);
                          } catch {
                            // brez localStorage zgodovina itak ni shranjena
                          }
                          setRecent([]);
                        }}
                        className="inline-flex min-h-9 items-center gap-1 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        {t.search.clearRecent}
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recent.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 text-sm text-foreground/85 transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          <Clock3 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Predlagana iskanja (vzorec: Tate »Try searching for …«) */}
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t.search.suggested}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {suggestedTerms(lang).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="inline-flex min-h-9 items-center rounded-full border border-primary/25 bg-primary/5 px-3.5 text-sm text-primary transition-colors hover:border-primary/50"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {status === "error" && (
              <p className="px-4 py-8 text-center text-sm text-destructive">{t.search.error}</p>
            )}

            {status === "done" && !hasSome && (
              <CommandEmpty>{t.search.noResults}</CommandEmpty>
            )}

            {status === "done" && results && (
              <>
                {results.results.exhibits.length > 0 && (
                  <CommandGroup heading={t.search.groups.exhibits}>
                    {results.results.exhibits.map((hit) => (
                      <CommandItem
                        key={hit.slug}
                        value={`exhibit:${hit.slug}`}
                        onSelect={() =>
                          closeAnd(() => {
                            const ex = exhibits.find((e) => e.slug === hit.slug);
                            if (ex) onOpenExhibit(ex);
                          })
                        }
                        className="min-h-12 items-center gap-3 py-3"
                      >
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md border border-border/60">
                          {hit.image ? (
                            <Image
                              src={hit.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                              <Landmark className="h-4 w-4" aria-hidden="true" />
                            </span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {hit.museumNo && (
                              <span className="mr-1.5 font-mono text-[10px] font-semibold tracking-wide text-primary/80">
                                {hit.museumNo}
                              </span>
                            )}
                            {hit.title[lang === "sl" || lang === "hr" ? "sl" : "en"]}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {hit.period[lang]}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {results.results.stories.length > 0 && (
                  <CommandGroup heading={t.search.groups.stories}>
                    {results.results.stories.map((hit) => (
                      <CommandItem
                        key={`story:${hit.title.sl}`}
                        value={`story:${hit.title.sl}`}
                        onSelect={() => closeAnd(() => onNavigate("zgodbe"))}
                        className="min-h-12 items-center gap-3 py-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <ScrollText className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {hit.title[lang === "sl" || lang === "hr" ? "sl" : "en"]}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {storyKindLabel(hit.kind, lang)}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {results.results.events.length > 0 && (
                  <CommandGroup heading={t.search.groups.events}>
                    {results.results.events.map((hit) => (
                      <CommandItem
                        key={`event:${hit.title.sl}`}
                        value={`event:${hit.title.sl}`}
                        onSelect={() => closeAnd(() => onNavigate("dogodki"))}
                        className="min-h-12 items-center gap-3 py-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {hit.title[lang === "sl" || lang === "hr" ? "sl" : "en"]}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            {dateFmt.format(new Date(hit.startsAt))} · {hit.location[lang]}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
