"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Map as MapIcon } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/museum/leaflet-map"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[70vh] items-center justify-center rounded-xl border border-border/70 bg-muted"
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

export function MapView({
  exhibits,
  onOpenExhibit,
}: {
  exhibits: ExhibitDTO[];
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
}) {
  const { t } = useLang();
  const es = useExhibitStrings();
  const [focusSlug, setFocusSlug] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onFocus = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setFocusSlug(custom.detail);
    };
    window.addEventListener("museum:focus-exhibit", onFocus);
    return () => window.removeEventListener("museum:focus-exhibit", onFocus);
  }, []);

  const withCoords = exhibits.filter((ex) => ex.lat != null && ex.lng != null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">{t.map.title}</h1>
        <p className="mt-3 text-muted-foreground">{t.map.subtitle}</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border/70">
        <LeafletMap
          exhibits={withCoords}
          focusSlug={focusSlug}
          onOpenExhibit={onOpenExhibit}
          labels={{
            openRecord: t.map.openRecord,
            villageCenter: t.map.villageCenter,
            categories: t.categories,
            period: (ex: ExhibitDTO) => es.period(ex),
          }}
        />
      </div>

      {/* Besedilna legenda — dostopnost */}
      <section aria-labelledby="karta-legenda" className="mt-8">
        <h2 id="karta-legenda" className="font-display text-lg font-semibold">
          {t.map.legend}
        </h2>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {withCoords.map((exhibit) => (
            <li key={exhibit.slug}>
              <button
                type="button"
                onClick={() => setFocusSlug(exhibit.slug)}
                className="flex min-h-11 w-full items-start gap-2.5 rounded-lg border border-border/70 bg-card p-3.5 text-left text-sm transition-colors hover:border-primary/40"
              >
                <MapIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-medium">{es.title(exhibit)}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {exhibit.lat?.toFixed(4)}, {exhibit.lng?.toFixed(4)}
                    {exhibit.coordsApprox ? ` · ${t.map.approx} · ` : " · "}
                    {t.categories[exhibit.category]}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t.map.osm}</p>
      </section>
    </div>
  );
}
