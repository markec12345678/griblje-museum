"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock3, Footprints, Heart, Network, Palette, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { normalize } from "@/lib/normalize";
import { useVisited } from "@/lib/visit-tracker";
import { useFavorites } from "@/lib/favorite-tracker";
import { isForKids, readingMinutes } from "@/lib/audience";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import { CollectorProgress } from "@/components/museum/collector-progress";
import { THEME_HUBS } from "@/lib/theme-hubs";
import fingerprints from "@/lib/visual-fingerprints.json";
import type { ExhibitCategory, ExhibitDTO, EvidenceStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EvidenceBadge } from "@/components/museum/evidence-badge";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER: ExhibitCategory[] = [
  "kraj",
  "kolpa",
  "vojna",
  "narava",
  "gospodarstvo",
  "sege",
];

const EVIDENCE_ORDER: EvidenceStatus[] = [
  "DOCUMENTED",
  "CORROBORATED",
  "TRADITION",
  "TESTIMONY",
  "UNVERIFIED",
  "TO_COLLECT",
];

/** Okno oznake »novo v zbirki«: 60 dni od kuriranega datuma vključitve
 *  (po vzoru DigitaltMuseum „New content: 7/30 days“ — prilagojeno ritmu
 *  vaškega muzeja, kjer zapisi prihajajo po raziskovalnih akcijah). */
const NEW_WINDOW_MS = 60 * 24 * 60 * 60 * 1000;

function isRecentAddition(exhibit: ExhibitDTO): boolean {
  if (!exhibit.addedAt) return false;
  return Date.now() - new Date(exhibit.addedAt).getTime() < NEW_WINDOW_MS;
}

/**
 * Barvna polica vasi — brskanje po prevladujoči barvi slike.
 *
 * Vzorec: Google Arts & Culture (»Blue · Green · Orange · Pink«) —
 * barva kot ne-knjižničen vstop v zbirko. Naša različica je iskrena
 * in razložljiva: povprečna barva vsake slike že živi v prstnem
 * odtisu zbirke (visual-fingerprints.json). Vsak zapis se dodeli
 * NATANČNO ENI polici — najbližji po odtenku (HSL) pri čistih barvah,
 * po svetlosti pri snegu in noči; sive dokumentarne fotografije imajo
 * svojo polico. Zapolnjevanje poteka v brskalniku v mikrosekundah.
 */
type ColorShelf = {
  id: string;
  labelSi: string;
  labelEn: string;
  labelHr: string;
  labelDe: string;
  labelIt: string;
  rgb: [number, number, number];
  /** Odtenek (0–360°) za kromatične police. */
  hue?: number;
};

const COLOR_SHELVES: ColorShelf[] = [
  { id: "nebo", labelSi: "Nebo", labelEn: "Sky", labelHr: "Nebo", labelDe: "Himmel", labelIt: "Cielo", rgb: [135, 185, 225], hue: 207 },
  { id: "zelenje", labelSi: "Zelenje", labelEn: "Greenery", labelHr: "Zelenilo", labelDe: "Grün", labelIt: "Verde", rgb: [95, 130, 70], hue: 95 },
  { id: "zemlja", labelSi: "Zemlja", labelEn: "Earth", labelHr: "Zemlja", labelDe: "Erde", labelIt: "Terra", rgb: [130, 100, 70], hue: 30 },
  { id: "sonce", labelSi: "Sonce", labelEn: "Sun", labelHr: "Sunce", labelDe: "Sonne", labelIt: "Sole", rgb: [215, 185, 110], hue: 45 },
  { id: "vino", labelSi: "Vino", labelEn: "Wine", labelHr: "Vino", labelDe: "Wein", labelIt: "Vino", rgb: [120, 45, 55], hue: 352 },
  { id: "sneg", labelSi: "Sneg", labelEn: "Snow", labelHr: "Snijeg", labelDe: "Schnee", labelIt: "Neve", rgb: [225, 224, 220] },
  { id: "cb", labelSi: "Črno-belo", labelEn: "Black & white", labelHr: "Crno-bijelo", labelDe: "Schwarz-weiß", labelIt: "Bianco e nero", rgb: [128, 128, 128] },
  { id: "noc", labelSi: "Noč", labelEn: "Night", labelHr: "Noć", labelDe: "Nacht", labelIt: "Notte", rgb: [48, 46, 44] },
];

const CHROMATIC_SHELVES = COLOR_SHELVES.filter((s) => typeof s.hue === "number");

/** Povprečna barva slike zapisa iz prstnega odtisa (27 vrednosti = 9 polj × RGB). */
function averageColor(slug: string): [number, number, number] | null {
  const fp = (fingerprints as Record<string, { c: number[] }>)[slug];
  if (!fp || fp.c.length < 27) return null;
  const cells = fp.c.length / 3;
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < cells; i++) {
    r += fp.c[i * 3];
    g += fp.c[i * 3 + 1];
    b += fp.c[i * 3 + 2];
  }
  return [Math.round(r / cells), Math.round(g / cells), Math.round(b / cells)];
}

/** RGB → HSL (h 0–360, s 0–1, l 0–1). */
function rgbToHsl(
  rgb: [number, number, number]
): [number, number, number] {
  const [r0, g0, b0] = rgb;
  const r = r0 / 255;
  const g = g0 / 255;
  const b = b0 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;
  return [h, s, l];
}

/** Kotna razdalja med odtenkoma (0–180°). */
function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Evklidska razdalja med barvama (0 … ~441,7). */
function colorDistance(
  a: [number, number, number],
  b: [number, number, number]
): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

/**
 * Dodelitev zapisa barvni polici: natanko ena (ali nobena, če slika
 * nima prstnega odtisa). Snežna in nočna polica gledata svetlost,
 * črno-bela nasičenost, kromatične pa najbližji odtenek.
 */
function shelfOf(rgb: [number, number, number]): string | null {
  const [h, s, l] = rgbToHsl(rgb);
  if (l >= 0.72 && s <= 0.15) return "sneg";
  if (l <= 0.38) return "noc";
  // Prag 0,04 loči vidno barvne slike od sivinskih preiskav —
  // utišane vaške fotografije ostanejo barvne, pravi sivinski
  // dokumentarni posnetki (s ≈ 0) gredo na črno-belo polico.
  if (s < 0.04) return "cb";
  let best: string | null = null;
  let bestD = Infinity;
  for (const shelf of CHROMATIC_SHELVES) {
    const d = hueDistance(h, shelf.hue!);
    if (d < bestD) {
      bestD = d;
      best = shelf.id;
    }
  }
  return best;
}

function shelfLabel(shelf: ColorShelf, lang: string): string {
  if (lang === "sl") return shelf.labelSi;
  if (lang === "hr") return shelf.labelHr;
  if (lang === "de") return shelf.labelDe;
  if (lang === "it") return shelf.labelIt;
  return shelf.labelEn;
}

export function CollectionView({
  exhibits,
  onOpenExhibit,
  onOpenTheme,
  onOpenConnect,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO, focusView?: "karta") => void;
  onOpenTheme: (category: ExhibitCategory | null) => void;
  onOpenConnect: (pair: [string, string] | null) => void;
}) {
  const { t, lang } = useLang();
  const es = useExhibitStrings();
  const reduceMotion = useReducedMotion();
  const { visited } = useVisited();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<ExhibitCategory | "vse">("vse");
  const [evidence, setEvidence] = React.useState<EvidenceStatus | "vse">("vse");
  const [newOnly, setNewOnly] = React.useState(false);
  const [colorId, setColorId] = React.useState<string | null>(null);

  const hasNewRecords = React.useMemo(
    () => exhibits.some(isRecentAddition),
    [exhibits]
  );

  // Povprečne barve + dodelitev polic izračunamo enkrat (85 prstnih
  // odtisov, ~0 ms). Vsak zapis dobi natanko eno polico.
  const shelfAssignment = React.useMemo(() => {
    const colors = new Map<string, [number, number, number]>();
    const assignment = new Map<string, string>();
    for (const ex of exhibits) {
      const avg = averageColor(ex.slug);
      if (!avg) continue;
      colors.set(ex.slug, avg);
      const shelf = shelfOf(avg);
      if (shelf) assignment.set(ex.slug, shelf);
    }
    return { colors, assignment };
  }, [exhibits]);

  // Dejavna polica: zapisi te police, razvrščeni od najbližje barve.
  const colorMatches = React.useMemo(() => {
    if (!colorId) return null;
    const shelf = COLOR_SHELVES.find((s) => s.id === colorId);
    if (!shelf) return null;
    const matches = [...shelfAssignment.assignment.entries()]
      .filter(([, id]) => id === colorId)
      .map(([slug]) => ({
        slug,
        distance: colorDistance(shelfAssignment.colors.get(slug)!, shelf.rgb),
      }))
      .sort((a, b) => a.distance - b.distance);
    return new Map(matches.map((m) => [m.slug, m.distance]));
  }, [colorId, shelfAssignment]);

  const filtered = React.useMemo(() => {
    // Enaka normalizacija kot strežniško iskanje (src/lib/normalize.ts):
    // filter je neobčutljiv na diakritike, da "crnomelj" najde "Črnomelj".
    const needle = normalize(query);
    const result = exhibits.filter((ex) => {
      const matchesCategory = category === "vse" || ex.category === category;
      const matchesEvidence = evidence === "vse" || ex.evidenceStatus === evidence;
      const matchesNew = !newOnly || isRecentAddition(ex);
      const matchesColor = !colorMatches || colorMatches.has(ex.slug);
      const haystack = normalize(
        [
          ex.titleSi,
          ex.titleEn,
          ex.summarySi,
          ex.summaryEn,
          ex.storySi,
          ex.storyEn,
        ].join(" ")
      );
      const matchesQuery = !needle || haystack.includes(needle);
      return matchesCategory && matchesEvidence && matchesNew && matchesColor && matchesQuery;
    });
    if (colorMatches) {
      // Pri dejavni barvi razvrstimo po bližini barve.
      result.sort(
        (a, b) =>
          (colorMatches.get(a.slug) ?? Infinity) -
          (colorMatches.get(b.slug) ?? Infinity)
      );
    }
    return result;
  }, [exhibits, query, category, evidence, newOnly, colorMatches]);

  const hasFilters =
    query !== "" || category !== "vse" || evidence !== "vse" || newOnly || colorId !== null;

  const reset = () => {
    setQuery("");
    setCategory("vse");
    setEvidence("vse");
    setNewOnly(false);
    setColorId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.collection.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.collection.subtitle}</p>
      </div>

      {/* Tematska središča — vstopne točke po vzoru Rijksmuseumovih node strani */}
      <section aria-labelledby="tematska-sredisca" className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2
            id="tematska-sredisca"
            className="font-display inline-flex items-center gap-2 text-xl font-semibold"
          >
            {t.themes.explore}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => onOpenConnect(null)}
          >
            <Network className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.connect.openTool}
          </Button>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {THEME_HUBS.map((hub) => {
            const cover = exhibits.find((ex) => ex.category === hub.category);
            const count = exhibits.filter((ex) => ex.category === hub.category).length;
            return (
              <li key={hub.category}>
                <button
                  type="button"
                  onClick={() => onOpenTheme(hub.category)}
                  className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <Image
                    src={cover?.image ?? "/images/authentic/hero-griblje.jpg"}
                    alt={t.categories[hub.category]}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"
                  />
                  <span className="absolute inset-x-2.5 bottom-2 flex flex-col items-start leading-tight">
                    <span className="text-sm font-semibold text-foreground drop-shadow-sm">
                      {t.categories[hub.category]}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {t.themes.countLabel(count)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Zbiralec zapisov — napredek obiska */}
      <div className="mt-8">
        <CollectorProgress total={exhibits.length} />
      </div>

      {/* Nadzorna vrstica */}
      <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.collection.searchPlaceholder}
            aria-label={t.collection.searchPlaceholder}
            className="h-12 pl-10 text-base"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-sm text-muted-foreground lg:flex">
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {t.collection.evidenceFilter}:
          </span>
          <Select
            value={evidence}
            onValueChange={(value) => setEvidence(value as EvidenceStatus | "vse")}
          >
            <SelectTrigger
              className="h-12 w-full min-w-44 text-base lg:w-52"
              aria-label={t.collection.evidenceFilter}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vse">{t.collection.allEvidence}</SelectItem>
              {EVIDENCE_ORDER.map((status) => (
                <SelectItem key={status} value={status}>
                  {t.evidence[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Kategorije */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.common.category}>
        <button
          type="button"
          onClick={() => setCategory("vse")}
          aria-pressed={category === "vse"}
          className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
            category === "vse"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground/80 hover:border-primary/40"
          }`}
        >
          {t.collection.allCategories}
        </button>
        {CATEGORY_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(category === key ? "vse" : key)}
            aria-pressed={category === key}
            className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
              category === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:border-primary/40"
            }`}
          >
            {t.categories[key]}
          </button>
        ))}
        {hasNewRecords && (
          <button
            type="button"
            onClick={() => setNewOnly((value) => !value)}
            aria-pressed={newOnly}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              newOnly
                ? "border-primary bg-primary text-primary-foreground"
                : "border-primary/40 bg-primary/5 text-primary hover:border-primary/60"
            }`}
          >
            <Sparkles className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.collection.newOnly}
          </button>
        )}
      </div>

      {/* Barvna polica vasi — brskanje po barvi (vzorec: Google Arts & Culture) */}
      <div className="mt-4">
        <div
          role="group"
          aria-label={t.collection.colorLabel}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground">
            <Palette className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">{t.collection.colorSr}: </span>
            {t.collection.colorLabel}:
          </span>
          {COLOR_SHELVES.map((shelf) => {
            const active = colorId === shelf.id;
            const count = [...shelfAssignment.assignment.values()].filter(
              (id) => id === shelf.id
            ).length;
            return (
              <button
                key={shelf.id}
                type="button"
                onClick={() => setColorId(active ? null : shelf.id)}
                aria-pressed={active}
                title={`${shelfLabel(shelf, lang)} — ${t.collection.count(count)}`}
                className={`flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm font-medium transition-all ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-foreground/80 hover:border-primary/40"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-5 rounded-full border border-black/10 shadow-inner"
                  style={{ backgroundColor: `rgb(${shelf.rgb.join(",")})` }}
                />
                <span className={cn(active ? "inline" : "hidden sm:inline")}>
                  {shelfLabel(shelf, lang)}
                </span>
                <span className="text-xs text-muted-foreground" aria-hidden="true">
                  {count}
                </span>
                {active && <span className="sr-only"> — {t.collection.colorActiveSr}</span>}
              </button>
            );
          })}
          {colorId && (
            <button
              type="button"
              onClick={() => setColorId(null)}
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">{t.collection.colorClear}</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>

      {/* Števec + počišči */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {t.collection.count(filtered.length)}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" className="min-h-11" onClick={reset}>
            <X className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {t.collection.resetFilters}
          </Button>
        )}
      </div>

      {/* Mreža zapisov */}
      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">{t.collection.empty}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exhibit, index) => {
            const favorited = isFavorite(exhibit.slug);
            return (
              <motion.div
                key={exhibit.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                {/* Glavni gumb kartice — odpre zapis */}
                <button
                  type="button"
                  onClick={() => onOpenExhibit(exhibit)}
                  className="flex min-h-11 flex-1 flex-col text-left focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={exhibit.image ?? "/images/authentic/hero-griblje.jpg"}
                      alt={es.title(exhibit)}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3">
                      <Badge className="border-border/60 bg-background/85 text-foreground backdrop-blur-sm">
                        {t.categories[exhibit.category]}
                      </Badge>
                    </span>
                    <span className="absolute right-14 top-3 flex items-center gap-1.5">
                      {isRecentAddition(exhibit) && (
                        <Badge className="gap-1 border-primary/30 bg-primary text-primary-foreground shadow-sm">
                          <Sparkles className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">{t.collection.newBadgeSr}</span>
                          {t.collection.newBadge}
                        </Badge>
                      )}
                      {visited.has(exhibit.slug) && (
                        <Badge className="gap-1 border-primary/30 bg-background/85 text-primary backdrop-blur-sm">
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">{t.collector.visitedSr}</span>
                        </Badge>
                      )}
                    </span>
                    {exhibit.imageCredit && (
                      <p className="absolute bottom-2 right-3 max-w-[75%] truncate text-right text-[10px] leading-tight text-white/80 drop-shadow-sm">
                        {exhibit.imageCredit}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {es.period(exhibit)}
                      </span>
                      <EvidenceBadge status={exhibit.evidenceStatus} />
                    </div>
                    <h2 className="font-display text-xl font-semibold leading-snug">
                      {es.title(exhibit)}
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {es.summary(exhibit)}
                    </p>
                    {/* Oznake občinstva (vzorec MoMA: komu in koliko časa je zapis namenjen) */}
                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                      <span
                        className="inline-flex items-center gap-1"
                        title={t.audience.minutesSr}
                      >
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">{t.audience.minutesSr}: </span>
                        <span aria-hidden="true">≈ {readingMinutes(exhibit)} min</span>
                      </span>
                      {isForKids(exhibit.slug) && (
                        <span
                          title={t.audience.forKidsTitle}
                          className="inline-flex items-center gap-1 rounded-full border border-accent/35 bg-accent/10 px-2 py-0.5 font-medium text-accent"
                        >
                          <Footprints className="h-3 w-3" aria-hidden="true" />
                          {t.audience.forKids}
                        </span>
                      )}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-primary">
                      {t.collection.openRecord}
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </button>

                {/* Hitro shranjevanje — srček na kartici (vzorec: Rijksstudio).
                    Gumb je pobratim glavnega gumba, ne njegov otrok. */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(exhibit.slug)}
                  aria-pressed={favorited}
                  aria-label={
                    favorited
                      ? `${t.collection.savedQuickSr} — ${es.title(exhibit)}`
                      : `${t.collection.saveQuickSr} — ${es.title(exhibit)}`
                  }
                  className={cn(
                    "absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all",
                    favorited
                      ? "border-primary/40 bg-primary text-primary-foreground shadow-sm"
                      : "border-border/60 bg-background/85 text-foreground/80 hover:border-primary/40 hover:text-primary"
                  )}
                >
                  <Heart
                    className={cn("h-4.5 w-4.5", favorited && "fill-current")}
                    aria-hidden="true"
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
