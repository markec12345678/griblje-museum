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
  categories: Record<string, string>;
  period: (ex: ExhibitDTO) => string;
};

function markerIcon(color: string, glyph?: string, dashed = false) {
  return L.divIcon({
    className: "",
    html: `
      <span style="
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
      map.setView(VILLAGE_CENTER, 14);
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

  return (
    <MapContainer
      center={VILLAGE_CENTER}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[70vh] w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <FocusController exhibits={exhibits} focusSlug={focusSlug} />

      {/* Središče vasi */}
      <Marker position={VILLAGE_CENTER} icon={markerIcon("#7c5c3e", "G")}>
        <Popup>
          <div className="min-w-44">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {labels.villageCenter}
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Zapisi z verified koordinatami */}
      {exhibits.map((exhibit) => (
        <Marker
          key={exhibit.slug}
          position={[exhibit.lat as number, exhibit.lng as number]}
          icon={markerIcon("#3f5d3c", undefined, exhibit.coordsApprox)}
        >
          <Popup>
            <div className="min-w-52 space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                {labels.categories[exhibit.category]} · {labels.period(exhibit)}
              </p>
              <p className="text-sm font-semibold leading-snug">{es.title(exhibit)}</p>
              <Button
                size="sm"
                className="mt-1 h-9 w-full"
                onClick={() => onOpenExhibit(exhibit)}
              >
                {labels.openRecord}
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
