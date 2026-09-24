"use client";

import * as React from "react";
import L, { CRS } from "leaflet";
import {
  ImageOverlay,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Search } from "lucide-react";
import { markerIcon } from "@/components/museum/leaflet-map";
import { useLang } from "@/lib/i18n";
import cadastre from "@/data/cadastre-a01.json";

/**
 * Zemljevid 1825 — list A01 (Gemeinde GRÜBLE, izmera 1824, korekcije 1827).
 *
 * Dva pogleda:
 *  1. LIST A01 — avtentični list v lastnem koordinatnem prostoru (CRS.Simple).
 *     Pike stojijo na pikselnih legah, izluščenih z VLM iz lista (val 52) —
 *     to je edini EXAKTEN prikaz (brez georeference).
 *  2. DANES — lista položena čez sodobno podlago (OSM) z izračunanimi mejami.
 *     Georeferenca je PROVIZORIČNA (1 sidro + listno merilo, sever = predpostavka)
 *     in je vedno označena kot takšna (železno pravilo: aproksimacija ≠ dejstvo).
 *
 * Rdeče številke na listu so STAVBNE parcele (B.P. — »Nro. in der Mappe« iz
 * PT protokola 1825), ne hišne številke. Veza B.P. ↔ hiša ↔ lastnik izhaja iz
 * PT p7 (dvojno branje val 41 + val 52) in eksplicitnih »B.P.« opomb v PUA
 * registru — vsaka vez nosi svoj vir; kjer veze ni, pika ostane brez lastnika.
 */

type Building = {
  bp: string;
  px: number;
  py: number;
  conf: string;
  source: string;
  lat: number;
  lng: number;
  house_no?: number;
  owner?: string;
  owner_status?: string;
  owner_page?: number;
  link_source?: string;
};

type Toponym = { name: string; px: number; py: number; lat: number; lng: number };

const data = cadastre as unknown as {
  meta: {
    sheet: string;
    title: string;
    survey_year: number;
    correction_year: number;
    source: string;
    scale_note: string;
    georef: {
      method: string;
      accuracy: string;
      anchor_px: number[];
      anchor_geo: [number, number];
      meters_per_px: number;
    };
    building_numbers_note: string;
    missing_bp: string;
  };
  buildings: Building[];
  toponyms: Toponym[];
  overlay: { sw: [number, number]; ne: [number, number]; px_size: [number, number] };
};

/** Sidra muzejske zbirke za pogled »Danes« (vse iz museum-content, znane lege). */
const ANCHORS: { lat: number; lng: number; sl: string; en: string; glyph: string }[] = [
  { lat: 45.5728, lng: 15.2922, sl: "Cerkev sv. Vida", en: "Church of St. Vitus", glyph: "✝" },
  { lat: 45.5735, lng: 15.294, sl: "Vaški ribnik", en: "Village pond", glyph: "R" },
  { lat: 45.5754, lng: 15.2928, sl: "PGD Griblje (1927)", en: "Fire station (1927)", glyph: "G" },
  { lat: 45.57246, lng: 15.29257, sl: "Središče vasi", en: "Village centre", glyph: "V" },
];

/** Pogled na list: meja slike v CRS.Simple (y je zgoraj obrnjen).
 *  Ravnohlavno (lazy): L.latLngBounds na nivoju modula bi v SSR sestrelil
 *  strežnik (leaflet dirka po window) — 500 namesto strani. */
let sheetBoundsCache: L.LatLngBounds | null = null;
function sheetBounds(): L.LatLngBounds {
  if (!sheetBoundsCache) {
    sheetBoundsCache = L.latLngBounds([
      [data.overlay.px_size[1], 0],
      [0, data.overlay.px_size[0]],
    ]);
  }
  return sheetBoundsCache;
}

function FlyToTarget({
  target,
  zoom,
}: {
  target: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();
  React.useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), zoom), { duration: 0.8 });
  }, [target, map, zoom]);
  return null;
}

/** Inicialno okvirjanje lista (cel list takoj viden). */
function FitSheet({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  React.useEffect(() => {
    map.fitBounds(bounds, { animate: false });
  }, [map, bounds]);
  return null;
}

/** List pri montaži pogosto dobi še 0×0 (menjava tabov) — Leaflet si to
 *  zapomni in ne riše ploščic. Vsilimo ponovno merjenje po montaži. */
function InvalidateOnMount() {
  const map = useMap();
  React.useEffect(() => {
    map.invalidateSize({ animate: false });
    const t0 = setTimeout(() => map.invalidateSize({ animate: false }), 150);
    const t1 = setTimeout(() => map.invalidateSize({ animate: false }), 600);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [map]);
  return null;
}

export function CadastreMapView() {
  const { t, lang } = useLang();
  const k = t.kataster;
  const [tab, setTab] = React.useState<"sheet" | "today">("sheet");
  const [query, setQuery] = React.useState("");
  const [opacity, setOpacity] = React.useState(0.55);
  const [target, setTarget] = React.useState<[number, number] | null>(null);

  const labeled = data.buildings.filter((b) => b.owner);
  const plain = data.buildings.filter((b) => !b.owner);

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => {
    if (!q) return data.buildings;
    return data.buildings.filter(
      (b) =>
        b.bp.includes(q) ||
        (b.owner ?? "").toLowerCase().includes(q) ||
        (b.house_no ? String(b.house_no).includes(q) : false)
    );
  }, [q]);

  const badge =
    "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";

  return (
    <section
      className="mx-auto mt-16 max-w-7xl rounded-xl border border-border/70 bg-card"
      aria-labelledby="kataster-title"
    >
      <div className="flex flex-col gap-4 border-b border-border/70 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            {k.eyebrow}
          </p>
          <h2 id="kataster-title" className="font-display mt-1 text-2xl font-semibold sm:text-3xl">
            {k.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{k.subtitle}</p>
        </div>
        <div
          className="flex shrink-0 rounded-lg border border-border/70 bg-background p-1"
          role="tablist"
          aria-label={k.viewLabel}
        >
          {(
            [
              ["sheet", k.tabSheet],
              ["today", k.tabToday],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                setTarget(null);
              }}
              className={`h-11 rounded-md px-4 text-sm font-medium transition-colors ${
                tab === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
        {/* ——— ZEMLJEVID ——— */}
        <div className="relative h-[70vh] min-h-[420px] border-b border-border/70 lg:border-b-0 lg:border-r">
          {tab === "sheet" ? (
            <MapContainer
              key="kataster-sheet"
              crs={CRS.Simple}
              center={[data.overlay.px_size[1] / 2, data.overlay.px_size[0] / 2]}
              zoom={-1}
              minZoom={-2}
              maxZoom={2}
              scrollWheelZoom={false}
              className="h-full w-full bg-[#efe6d2]"
              attributionControl
              aria-label={k.mapAria}
            >
              <ImageOverlay
                url="/kataster/a01-1824.jpg"
                bounds={sheetBounds()}
                alt={k.sheetAlt}
              />
              <FitSheet bounds={sheetBounds()} />
              <InvalidateOnMount />
              <FlyToTarget target={target} zoom={0} />
              {/* Stavbne parcele */}
              {data.buildings.map((b) => {
                const label = b.owner
                  ? `${k.bp} ${b.bp}${b.house_no ? ` · ${k.houseNo} ${b.house_no}` : ""} — ${b.owner}`
                  : `${k.bp} ${b.bp}`;
                return (
                  <Marker
                    key={`bp-${b.bp}-${b.px}`}
                    position={[data.overlay.px_size[1] - b.py, b.px]}
                    title={label}
                    alt={label}
                    icon={markerIcon(
                      b.owner ? "#8b3a2e" : "#a58a5b",
                      b.owner ? String(b.house_no ?? b.bp) : "",
                      false,
                      label
                    )}
                  >
                    <Popup>
                      <div className="min-w-56 space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                          {k.bp} {b.bp} · {b.conf}
                        </p>
                        {b.owner ? (
                          <p className="text-sm font-semibold leading-snug">{b.owner}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">{k.noOwner}</p>
                        )}
                        {b.house_no ? (
                          <p className="text-xs text-stone-600">
                            {k.houseNo}: <strong>{b.house_no}</strong>
                          </p>
                        ) : null}
                        {b.link_source ? (
                          <p className="text-[11px] leading-snug text-stone-500">
                            {k.evidence}: {b.link_source}
                          </p>
                        ) : null}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              {/* Toponimi */}
              {data.toponyms.map((tp) => (
                <Marker
                  key={`tp-${tp.name}-${tp.px}`}
                  position={[data.overlay.px_size[1] - tp.py, tp.px]}
                  title={tp.name}
                  alt={tp.name}
                  icon={L.divIcon({
                    className: "",
                    html: `<span style="white-space:nowrap; font: italic 600 12px/1.2 Georgia, serif; color:#4a4238; text-shadow:0 0 3px #efe6d2, 0 0 3px #efe6d2;">${tp.name}</span>`,
                    iconSize: [0, 0],
                    iconAnchor: [0, 0],
                  })}
                >
                  <Popup>
                    <div className="min-w-40">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                        {k.toponym}
                      </p>
                      <p className="text-sm font-semibold">{tp.name}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <MapContainer
              key="kataster-today"
              center={[45.585, 15.282]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
              attributionControl
              aria-label={k.mapAriaToday}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              <InvalidateOnMount />
              <FlyToTarget target={target} zoom={15} />
              <ImageOverlay
                url="/kataster/a01-1824.jpg"
                bounds={[data.overlay.sw, data.overlay.ne]}
                opacity={opacity}
                alt={k.overlayAlt}
              />
              {/* Sidra zbirke (znane lege) */}
              {ANCHORS.map((a) => (
                <Marker
                  key={a.sl}
                  position={[a.lat, a.lng]}
                  title={lang === "en" ? a.en : a.sl}
                  alt={lang === "en" ? a.en : a.sl}
                  icon={markerIcon("#3f5d3c", a.glyph, false, lang === "en" ? a.en : a.sl)}
                >
                  <Popup>
                    <div className="min-w-40">
                      <p className="text-sm font-semibold">{lang === "en" ? a.en : a.sl}</p>
                      <p className="text-[11px] text-stone-500">{k.anchorNote}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Opozorilo o provizorični georeferenci (samo pogled Danes) */}
          {tab === "today" && (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] rounded-lg border border-amber-300/80 bg-amber-50/95 px-3 py-2 text-[11px] leading-snug text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-950/80 dark:text-amber-100">
              <strong>{k.provisionalTitle}</strong> {k.provisionalNote}
            </div>
          )}
          {tab === "today" && (
            <label className="absolute bottom-3 left-3 z-[500] flex items-center gap-2 rounded-lg border border-border/70 bg-background/95 px-3 py-2 text-xs shadow-sm">
              {k.opacity}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                aria-label={k.opacity}
                className="w-28"
              />
            </label>
          )}
        </div>

        {/* ——— STRANSKI PANEL: register stavb ——— */}
        <div className="flex max-h-[70vh] flex-col">
          <div className="border-b border-border/70 p-4">
            <label className="relative block">
              <span className="sr-only">{k.search}</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={k.search}
                className="h-11 w-full rounded-lg border border-border/70 bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {k.panelCounts
                .replace("{labeled}", String(labeled.length))
                .replace("{buildings}", String(data.buildings.length))}
            </p>
          </div>
          <ul className="min-h-0 flex-1 divide-y divide-border/50 overflow-y-auto" role="list">
            {filtered.map((b) => (
              <li key={`row-${b.bp}-${b.px}`} className="px-4 py-3">
                <button
                  className="w-full text-left"
                  onClick={() =>
                    setTarget(
                      tab === "sheet"
                        ? [data.overlay.px_size[1] - b.py, b.px]
                        : [b.lat, b.lng]
                    )
                  }
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`${badge} ${
                        b.owner
                          ? "bg-[#8b3a2e]/10 text-[#8b3a2e]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {k.bp} {b.bp}
                    </span>
                    {b.house_no ? (
                      <span className={`${badge} bg-[#3f5d3c]/10 text-[#3f5d3c]`}>
                        {k.houseNo} {b.house_no}
                      </span>
                    ) : null}
                    {b.owner_status === "VERIFIED-2x" ? (
                      <span className={`${badge} bg-[#3f5d3c]/10 text-[#3f5d3c]`}>2×</span>
                    ) : b.owner ? (
                      <span className={`${badge} bg-amber-500/10 text-amber-700`}>
                        {k.review}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium">
                    {b.owner ?? k.noOwner}
                  </span>
                  {b.link_source ? (
                    <span className="mt-0.5 block truncate text-[11px] text-stone-500">
                      {b.link_source}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
            {plain.length === filtered.length && filtered.length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">{k.noResults}</li>
            )}
          </ul>
        </div>
      </div>

      {/* ——— SPODNJA OPOMBA: vir, merilo, omejitve ——— */}
      <div className="grid gap-4 border-t border-border/70 p-6 text-[12px] leading-relaxed text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-semibold text-foreground">{k.noteSource}</p>
          <p className="mt-1">{data.meta.source} · {data.meta.title} · {data.meta.survey_year}/{data.meta.correction_year}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{k.noteNumbers}</p>
          <p className="mt-1">{data.meta.building_numbers_note}</p>
        </div>
        <div>
          <p className="font-semibold text-foreground">{k.noteLimits}</p>
          <p className="mt-1">{data.meta.scale_note} · {data.meta.missing_bp}</p>
        </div>
      </div>
    </section>
  );
}
