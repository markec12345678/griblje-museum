"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import { Button } from "@/components/ui/button";

/** Središče vasi Griblje (Wikidata/OSM referenca). */
const VILLAGE_CENTER: [number, number] = [45.57246, 15.29257];

type Labels = {
  openRecord: string;
  villageCenter: string;
  mapAria: string;
  recordsHere: string;
  categories: Record<string, string>;
  period: (ex: ExhibitDTO) => string;
};

/** Oblika muzejske pike (skupna z Zemljevidom spomina — enaka ikonika). */
export function markerIcon(color: string, glyph?: string, dashed = false, name?: string) {
  // Dostopno ime pike (title + aria-label): bralnik zaslona piko objavi
  // po imenu zapisa, ne kot anonimni klik (WCAG — zemljevid ima nadomestno
  // besedilno legendo, a pike same morajo nositi ime).
  const a11y = name
    ? ` role="img" aria-label="${name.replaceAll("\"", "")}" title="${name.replaceAll("\"", "")}"`
    : "";
  return L.divIcon({
    className: "",
    html: `
      <span${a11y} style="
        display: flex; align-items: center; justify-content: center;
        width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        background: ${dashed ? "rgba(255,255,255,.92)" : color};
        border: 2px ${dashed ? "dashed" : "solid"} ${dashed ? color : "rgba(255,255,255,.9)"};
        box-shadow: 0 2px 6px rgba(0,0,0,.35);
      "><span style="transform: rotate(45deg); color: ${dashed ? color : "#fff"}; font: 700 11px/1 var(--font-geist-sans, sans-serif);">
        ${glyph ?? ""}
      </span></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

/** Notranja komponenta: premik zemljevida ob zahtevi za fokus. */
function FocusController({
  exhibits,
  focusSlug,
}: {
  exhibits: ExhibitDTO[];
  focusSlug: string | null;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!focusSlug) {
      // Prilagodi izrez vsem točkam zbirke (vas + okolica),
      // da so oddaljeni zapisi (Črnomelj, Otok, Žuniči …) vidni takoj.
      const points = exhibits
        .filter((ex) => ex.lat != null && ex.lng != null)
        .map((ex) => [ex.lat as number, ex.lng as number] as [number, number]);
      if (points.length > 1) {
        map.fitBounds(L.latLngBounds(points).pad(0.25), {
          maxZoom: 14,
          animate: false,
        });
      } else {
        map.setView(VILLAGE_CENTER, 14);
      }
      return;
    }
    const target = exhibits.find((ex) => ex.slug === focusSlug);
    if (target && target.lat != null && target.lng != null) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.1 });
    }
  }, [focusSlug, exhibits, map]);

  return null;
}

export default function LeafletMap({
  exhibits,
  focusSlug,
  onOpenExhibit,
  labels,
}: {
  exhibits: ExhibitDTO[];
  focusSlug: string | null;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  labels: Labels;
}) {
  const es = useExhibitStrings();

  // Ena pika na unikatno koordinato: zapisi, ki si delijo lego (npr. vasišče
  // — vas, osebe, kolo, čebela), se združijo v eno piko, ki v pojavnem oknu
  // našteje VSE zapise na tem mestu. Brez te združitve bi zgornji marker
  // pokril spodnje in bi bili nezasedljivi (leaflet-markercluster bi bil nova
  // odvisnost za isti učinek — ena pika = en kraj je tudi muzejsko poštenejša
  // rešitev: ne premikamo podatka, le upodobitev).
  const groups = React.useMemo(() => {
    const byCoord = new Map<string, ExhibitDTO[]>();
    for (const ex of exhibits) {
      const key = `${(ex.lat as number).toFixed(6)},${(ex.lng as number).toFixed(6)}`;
      const arr = byCoord.get(key);
      if (arr) arr.push(ex);
      else byCoord.set(key, [ex]);
    }
    return [...byCoord.values()];
  }, [exhibits]);

  return (
    <MapContainer
      center={VILLAGE_CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[70vh] w-full"
      attributionControl
      aria-label={labels.mapAria}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <FocusController exhibits={exhibits} focusSlug={focusSlug} />

      {/* Središče vasi */}
      <Marker
        position={VILLAGE_CENTER}
        title={labels.villageCenter}
        alt={labels.villageCenter}
        icon={markerIcon("#7c5c3e", "G", false, labels.villageCenter)}
      >
        <Popup>
          <div className="min-w-44">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {labels.villageCenter}
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Ena pika na unikatno koordinato — pojavno okno našteje vse zapise */}
      {groups.map((group) => {
        const first = group[0];
        const name =
          group.length === 1
            ? es.title(first)
            : `${group.length} ${labels.recordsHere}: ${group
                .map((ex) => es.title(ex))
                .join(", ")}`;
        return (
          <Marker
            key={first.slug}
            position={[first.lat as number, first.lng as number]}
            title={name}
            alt={name}
            icon={markerIcon(
              "#3f5d3c",
              group.length > 1 ? String(group.length) : undefined,
              group.some((ex) => ex.coordsApprox),
              name
            )}
          >
            <Popup>
              <div className="min-w-56 space-y-2.5">
                {group.map((exhibit) => (
                  <div key={exhibit.slug} className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                      {labels.categories[exhibit.category]} · {labels.period(exhibit)}
                      {exhibit.museumNo ? ` · ${exhibit.museumNo}` : ""}
                    </p>
                    <p className="text-sm font-semibold leading-snug">{es.title(exhibit)}</p>
                    <Button
                      size="sm"
                      className="h-11 w-full"
                      onClick={() => onOpenExhibit(exhibit)}
                    >
                      {labels.openRecord}
                    </Button>
                  </div>
                ))}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
