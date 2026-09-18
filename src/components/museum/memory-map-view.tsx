"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  BookOpen,
  Info,
  MapPin,
  Map as MapIcon,
  User,
  X,
} from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import type { MuseumView } from "@/components/museum/header";
import type { PlaceLocationStatus, PlaceMemoryItem } from "@/lib/timeline-map";
import { objectLayer, placeMemory } from "@/lib/timeline-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MemoryLeafletMap = dynamic(() => import("@/components/museum/memory-leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[60vh] items-center justify-center rounded-xl border border-border/70 bg-muted sm:h-[70vh]"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <MapIcon className="h-10 w-10 animate-pulse" aria-hidden="true" />
        <span className="text-sm">Griblje · Kolpa · 45.57° N, 15.29° E</span>
      </div>
    </div>
  ),
});

/**
 * ZEMLJEVID SPOMINA — prostorsko raziskovanje zbirke (39. sklop / TASK 40).
 *
 * PLAST 1: zapisi s preverjeno lego (obstoječe koordinate).
 * PLAST 2: kraji spomina z dokazano lokacijo (11 od 26 — prek dokaznega
 *          zapisa; nikoli geokodirano).
 * PLAST 3: spomin kraja — povezani zapisi, osebe, dogodki in viri, vse iz
 *          obstoječega entitetnega registra.
 *
 * Dostopnost: karta NI edini vhod — celoten seznam krajev spodaj je
 * tipkovnična pot do istih podatkov.
 */

const STATUS_ORDER = ["resolved", "within-village", "region", "unresolved"] as const;

/** Prevod kuratorskega statusa (vsebuje pomišljaj) → ključ i18n. */
const STATUS_I18N_KEY: Record<PlaceLocationStatus, "resolved" | "withinVillage" | "region" | "unresolved"> = {
  resolved: "resolved",
  "within-village": "withinVillage",
  region: "region",
  unresolved: "unresolved",
};

export function MemoryMapView({
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

  const places = React.useMemo(() => placeMemory(exhibits), [exhibits]);
  const objects = React.useMemo(() => objectLayer(exhibits), [exhibits]);
  const [showObjects, setShowObjects] = React.useState(true);
  const [showPlaces, setShowPlaces] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selected = React.useMemo(
    () => places.find((p) => p.place.id === selectedId) ?? null,
    [places, selectedId]
  );

  const panelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (selectedId && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedId]);

  const visibleObjects = showObjects ? objects : [];
  const visiblePlaces = showPlaces ? places.filter((p) => p.location) : [];

  const sortedPlaces = React.useMemo(
    () =>
      [...places].sort((a, b) => {
        const sa = STATUS_ORDER.indexOf(a.status);
        const sb = STATUS_ORDER.indexOf(b.status);
        return sa - sb || es.entityLabel(a.place).localeCompare(es.entityLabel(b.place), lang);
      }),
    [places, es, lang]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.memory.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.memory.subtitle}</p>
      </div>

      <p className="mt-4 flex max-w-3xl items-start gap-2.5 rounded-lg border border-border/70 bg-card p-4 text-sm leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
        {t.memory.howTo}
      </p>

      {/* Plasti — PLAST 1 zapisi, PLAST 2 kraji */}
      <section aria-label={t.memory.layersLabel} className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={showObjects ? "default" : "outline"}
          size="sm"
          className="min-h-11 gap-2"
          aria-pressed={showObjects}
          onClick={() => setShowObjects((v) => !v)}
        >
          <MapIcon className="h-4 w-4" aria-hidden="true" />
          {t.memory.layerObjects} ({objects.length})
        </Button>
        <Button
          type="button"
          variant={showPlaces ? "default" : "outline"}
          size="sm"
          className="min-h-11 gap-2"
          aria-pressed={showPlaces}
          onClick={() => setShowPlaces((v) => !v)}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {t.memory.layerPlaces} ({places.filter((p) => p.location).length}/{places.length})
        </Button>
      </section>

      {/* Karta */}
      <div className="mt-6 overflow-hidden rounded-xl border border-border/70">
        <MemoryLeafletMap
          exhibits={visibleObjects}
          places={visiblePlaces}
          selectedPlaceId={selectedId}
          onSelectPlace={setSelectedId}
          onOpenExhibit={onOpenExhibit}
          labels={{
            mapAria: t.memory.mapAria,
            openRecord: t.memory.openRecord,
            openMemory: t.memory.openMemory,
            recordsHere: t.map.recordsHere,
            approx: t.memory.approx,
            location: t.memory.location,
            categories: t.categories,
            period: (ex: ExhibitDTO) => es.period(ex),
          }}
        />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{t.memory.osm}</p>

      {/* PLAST 3 — spomin izbranega kraja */}
      <div ref={panelRef} className="scroll-mt-24">
        {selected ? (
          <MemoryPanel item={selected} onOpenExhibit={onOpenExhibit} onClose={() => setSelectedId(null)} />
        ) : (
          <p className="mt-8 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {t.memory.empty}
          </p>
        )}
      </div>

      {/* Dostopen seznam krajev — tipkovnična pot (karta ni edini vhod) */}
      <section aria-labelledby="spomin-seznam" className="mt-12">
        <h2 id="spomin-seznam" className="font-display text-2xl font-semibold sm:text-3xl">
          {t.memory.listTitle}
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{t.memory.listSubtitle}</p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedPlaces.map((place) => (
            <li key={place.place.id}>
              <button
                type="button"
                aria-current={place.place.id === selectedId ? "true" : undefined}
                onClick={() => setSelectedId(place.place.id)}
                className={cn(
                  "flex min-h-11 w-full flex-col gap-1.5 rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  place.place.id === selectedId ? "border-primary/60 ring-1 ring-primary/30" : "border-border/70"
                )}
              >
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{es.entityLabel(place.place)}</span>
                  <span className="text-xs text-muted-foreground">
                    {t.memory.placeKinds[place.place.placeKind]}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      place.status === "resolved" && "text-primary",
                      place.status === "unresolved" && "text-amber-600 dark:text-amber-400"
                    )}
                  >
                    {place.status === "unresolved" ? (
                      <AlertCircle className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                    )}
                    {t.memory.status[STATUS_I18N_KEY[place.status]]}
                  </span>
                  <span>{t.memory.recordsCount(place.exhibits.length)}</span>
                </span>
                {place.location && (
                  <span className="text-xs text-muted-foreground">
                    {place.location.lat.toFixed(4)}, {place.location.lng.toFixed(4)}
                    {place.location.approx ? ` · ${t.memory.approx}` : ""}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Križna vez na karto zapisov */}
      <section className="mt-12 rounded-xl border border-border/70 bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
              {t.memory.toObjectMap}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t.memory.toObjectMapHint}</p>
          </div>
          <Button variant="outline" className="min-h-11" onClick={() => onNavigate("karta")}>
            {t.nav.karta}
          </Button>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PLAST 3 — spomin kraja: zapisi → osebe/dogodki → viri
// ---------------------------------------------------------------------------

function MemoryPanel({
  item,
  onOpenExhibit,
  onClose,
}: {
  item: PlaceMemoryItem;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();

  /** Vir dokazne vezi zapisa (sourceIndex iz registra kraja). */
  const evidenceLine = (ex: ExhibitDTO) => {
    const binding = item.place.evidence.find((ev) => ev.slug === ex.slug);
    const idx = binding?.sourceIndex;
    const source = idx != null ? ex.sources[idx] : undefined;
    return source ? `${t.chronicle.source}: ${es.sourceName(source)}` : null;
  };

  return (
    <section
      aria-labelledby="spomin-kraja-naslov"
      className="mt-8 rounded-xl border border-primary/30 bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t.memory.memoryTitle}
          </p>
          <h2 id="spomin-kraja-naslov" className="mt-1 font-display text-2xl font-semibold leading-snug">
            {es.entityLabel(item.place)}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {t.memory.placeKinds[item.place.placeKind]}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t.memory.status[STATUS_I18N_KEY[item.status]]}
            </Badge>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="min-h-11 gap-1.5"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t.memory.close}
        </Button>
      </div>

      {/* Lega — dokazano, s povpraševalno vejo */}
      {item.location && item.locationVia && (
        <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 p-3.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t.memory.location}
          </p>
          <p className="mt-1 text-sm">
            {item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}
            {item.location.approx ? ` · ${t.memory.approx}` : ""}
          </p>
          <button
            type="button"
            onClick={() => onOpenExhibit(item.locationVia as ExhibitDTO)}
            className="mt-1.5 inline-flex min-h-9 items-center gap-1 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            {t.memory.locationVia(es.title(item.locationVia))}
          </button>
        </div>
      )}

      {/* Povezani zapisi z dokazi */}
      {item.exhibits.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.memory.objectsTitle}
          </h3>
          <ul className="mt-2.5 space-y-2">
            {item.exhibits.map((ex) => {
              const source = evidenceLine(ex);
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
                        {es.period(ex)}
                        {source ? ` — ${source}` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Povezane osebe */}
      {item.persons.length > 0 && (
        <div className="mt-5">
          <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {t.memory.personsTitle}
          </h3>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {item.persons.map((p) => (
              <li
                key={p.id}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs"
              >
                <span className="font-medium">{es.entityLabel(p)}</span>
                {p.time && (
                  <span className="text-muted-foreground">{es.entityTime(p.time)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Povezani dogodki */}
      {item.events.length > 0 && (
        <div className="mt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t.memory.eventsTitle}
          </h3>
          <ul className="mt-2.5 space-y-2">
            {item.events.map((ev) => (
              <li
                key={ev.id}
                className="flex min-h-9 flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg border border-border/70 bg-background px-3 py-2 text-xs"
              >
                <span className="font-medium">{es.entityLabel(ev)}</span>
                {ev.time && (
                  <span className="text-muted-foreground">{es.entityTime(ev.time)}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
