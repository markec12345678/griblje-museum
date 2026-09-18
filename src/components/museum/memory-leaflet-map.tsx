"use client";

import * as React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { markerIcon } from "@/components/museum/leaflet-map";
import { useExhibitStrings } from "@/components/museum/exhibit-strings";
import type { ExhibitDTO } from "@/lib/types";
import type { PlaceMemoryItem } from "@/lib/timeline-map";
import { Button } from "@/components/ui/button";

/**
 * ZEMLJEVID SPOMINA — Leaflet plast (39. sklop / TASK 40).
 *
 * Ena pika = ena koordinata (filozofija obstoječe karte, razširjena):
 * kraj spomina in zapisi, ki si delijo lego, se združijo v ENO piko,
 * katere pojavnemu oknu našteje kraje (z vstopom v spomin) in zapise.
 * Rjava pika = kraj spomina; zelena = zapis; črtkano = približna lega.
 * Kraj brez dokazane koordinate NE dobi pike (pravilo: ne geokodiramo).
 */

/** Središče vasi Griblje (enaka referenca kot karta zapisov). */
const VILLAGE_CENTER: [number, number] = [45.57246, 15.29257];

const COLOR_OBJECT = "#3f5d3c"; // zapisi (zelena — kot obstoječa karta)
const COLOR_PLACE = "#7c5c3e"; // kraji spomina (rjava)

type Labels = {
  mapAria: string;
  openRecord: string;
  openMemory: string;
  recordsHere: string;
  approx: string;
  location: string;
  categories: Record<string, string>;
  period: (ex: ExhibitDTO) => string;
};

/** Točka na karti: kraji spomina + zapisi na eni koordinati. */
type MapPoint = {
  key: string;
  lat: number;
  lng: number;
  approx: boolean;
  places: PlaceMemoryItem[];
  objects: ExhibitDTO[];
};

function buildPoints(
  exhibits: ExhibitDTO[],
  places: PlaceMemoryItem[]
): MapPoint[] {
  const byCoord = new Map<string, MapPoint>();
  const pointOf = (lat: number, lng: number): MapPoint => {
    const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
    let p = byCoord.get(key);
    if (!p) {
      p = { key, lat, lng, approx: false, places: [], objects: [] };
      byCoord.set(key, p);
    }
    return p;
  };

  for (const ex of exhibits) {
    if (ex.lat == null || ex.lng == null) continue;
    const p = pointOf(ex.lat, ex.lng);
    p.objects.push(ex);
    if (ex.coordsApprox) p.approx = true;
  }
  for (const place of places) {
    if (!place.location) continue;
    const p = pointOf(place.location.lat, place.location.lng);
    p.places.push(place);
    if (place.location.approx) p.approx = true;
  }
  return [...byCoord.values()];
}

/** Notranja komponenta: izrez vse vidne točke + polet na izbrani kraj. */
function FocusController({
  points,
  selectedPlaceId,
  places,
}: {
  points: MapPoint[];
  selectedPlaceId: string | null;
  places: PlaceMemoryItem[];
}) {
  const map = useMap();

  React.useEffect(() => {
    if (selectedPlaceId) {
      const target = places.find((p) => p.place.id === selectedPlaceId);
      if (target?.location) {
        map.flyTo([target.location.lat, target.location.lng], 15, { duration: 1.1 });
        return;
      }
    }
    if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.25), { maxZoom: 14, animate: false });
    } else if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 14);
    } else {
      map.setView(VILLAGE_CENTER, 14);
    }
  }, [selectedPlaceId, points.length, places, map]);

  return null;
}

export default function MemoryLeafletMap({
  exhibits,
  places,
  selectedPlaceId,
  onSelectPlace,
  onOpenExhibit,
  labels,
}: {
  /** Zapisi s preverjeno lego (PLAST 1). */
  exhibits: ExhibitDTO[];
  /** Kraji spomina z dokazano lokacijo (PLAST 2). */
  places: PlaceMemoryItem[];
  selectedPlaceId: string | null;
  onSelectPlace: (placeId: string) => void;
  onOpenExhibit: (exhibit: ExhibitDTO) => void;
  labels: Labels;
}) {
  const es = useExhibitStrings();

  const points = React.useMemo(() => buildPoints(exhibits, places), [exhibits, places]);

  return (
    <MapContainer
      center={VILLAGE_CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[60vh] w-full sm:h-[70vh]"
      attributionControl
      aria-label={labels.mapAria}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <FocusController points={points} selectedPlaceId={selectedPlaceId} places={places} />

      {points.map((point) => {
        // Ime pike za bralnik zaslona: kraji + zapisi na točki.
        const placeNames = point.places.map((p) => p.place.labelSi);
        const objectNames = point.objects.map((ex) => es.title(ex));
        const name = [...placeNames, ...objectNames].join(", ");
        const isPlace = point.places.length > 0;
        // Ključ vključuje ČLANE pike: react-leaflet ob spremembi plasti ne
        // posodablja ikon/titlov v mestu, zato marker remountamo, ko se
        // sestava točke spremeni (sicer bi bralnik zaslona bral stare naslove).
        const memberKey =
          point.places.map((p) => p.place.id).join("+") +
          "|" +
          point.objects.map((o) => o.slug).join("+");
        const icon = markerIcon(
          isPlace ? COLOR_PLACE : COLOR_OBJECT,
          isPlace ? (point.places.length > 1 ? String(point.places.length) : "◆") : point.objects.length > 1 ? String(point.objects.length) : undefined,
          point.approx,
          name
        );
        return (
          <Marker
            key={`${point.key}::${memberKey}`}
            position={[point.lat, point.lng]}
            title={name}
            alt={name}
            icon={icon}
          >
            <Popup>
              <div className="min-w-60 space-y-3">
                {point.places.map((place) => (
                  <div key={place.place.id} className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                      {labels.location}
                      {place.location?.approx ? ` · ${labels.approx}` : ""}
                    </p>
                    <p className="text-sm font-semibold leading-snug">
                      {es.entityLabel(place.place)}
                    </p>
                    <Button
                      size="sm"
                      className="h-10 w-full"
                      onClick={() => onSelectPlace(place.place.id)}
                    >
                      {labels.openMemory}
                    </Button>
                  </div>
                ))}
                {point.objects.map((exhibit) => (
                  <div key={exhibit.slug} className="space-y-1 border-t border-stone-200 pt-2 first:border-t-0 first:pt-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                      {labels.categories[exhibit.category]} · {labels.period(exhibit)}
                      {exhibit.museumNo ? ` · ${exhibit.museumNo}` : ""}
                    </p>
                    <p className="text-sm font-semibold leading-snug">{es.title(exhibit)}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-10 w-full"
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
