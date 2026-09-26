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
import { BookOpen, Search } from "lucide-react";
import { markerIcon } from "@/components/museum/leaflet-map";
import { useLang } from "@/lib/i18n";
import { AtlasStoryDialog, StoryButton } from "@/components/museum/atlas-story";
import {
  bpNodeRef,
  landUseBucketOf,
  matchesExploreQuery,
  modeAllowsTier,
  parcelExploreCounts,
  parcelLabel,
  parcelMatchesQuery,
  parcelVisible,
  sortParcelsForBrowse,
  staticRowVisible,
  exploreTierOfStaticRow,
  exploreTierOfStatus,
  LAND_USE_ORDER,
  type ExploreMode,
  type ExploreParcel,
  type LandUseBucket,
  type LandUseFilter,
} from "@/lib/atlas-explore";
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

/* --- Podatkovni sloji atlasa 1825 (issue #42 §15, PASS 5) — /api/atlas/map --- */
type KgMapObject = {
  node_id: string;
  sheet: string;
  label: string;
  building_type: string;
  bp_glyph: string | null;
  glyph_tier: string;
  px: [number, number] | null;
  lat: number | null;
  lng: number | null;
  georef_status: string;
  evidence_status: string;
  evidence_url: string;
};
type KgHouse = {
  node_id: string;
  house_no_1825: string;
  evidence_status: string;
  bp_refs: { bp: number; final_status: string; map_object: string | null }[];
  located: boolean;
  position: { lat: number; lng: number; px: [number, number]; via_bp: number; map_object: string; georef_status: string } | null;
  evidence_url: string;
};
type KgMapData = {
  ok: boolean;
  counts: {
    map_objects: number;
    map_objects_a01: number;
    map_objects_other_sheets: number;
    houses_located: number;
    toponyms: number;
  };
  layers: { map_objects: KgMapObject[]; houses: KgHouse[] };
};

/** Odgovor /api/atlas/map?layer=parcels (val 73 — register, brez geometrije §9). */
type KgParcelPage = { ok: boolean; count: number; features: ExploreParcel[] };

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

/** Barvni razred značke rabe (zemeljska paleta muzeja; neznanka vedno ločena). */
function luBadgeClass(category: string | null | undefined): string {
  const b = landUseBucketOf(category);
  if (b === "UNKNOWN") return "bg-amber-500/10 text-amber-700";
  if (b === "NONE") return "bg-muted text-muted-foreground";
  return "bg-[#5d6e3f]/10 text-[#5d6e3f]";
}

export function CadastreMapView() {
  const { t, lang } = useLang();
  const k = t.kataster;
  const s = t.atlasStory;
  const [tab, setTab] = React.useState<"sheet" | "today" | "explore">("sheet");
  const [query, setQuery] = React.useState("");
  const [opacity, setOpacity] = React.useState(0.55);
  const [target, setTarget] = React.useState<[number, number] | null>(null);

  /* --- EXPLORE 1825 (§19): zgodba iz dokazov + filtri + dialog --- */
  const [storyRef, setStoryRef] = React.useState<string | null>(null);
  const [exploreFilterMode, setExploreFilterMode] = React.useState<ExploreMode>("all");
  const [exploreQuery, setExploreQuery] = React.useState("");
  const exploreActive = tab === "explore";

  /* --- parcelni sloj rabe (§19, val 73): lenar naložen šele ob izbiri Parcele --- */
  const [listView, setListView] = React.useState<"entities" | "parcels">("entities");
  const [parcels, setParcels] = React.useState<ExploreParcel[] | null>(null);
  const [parcelState, setParcelState] = React.useState<"idle" | "loading" | "ready" | "error">("idle");
  const [landUse, setLandUse] = React.useState<LandUseFilter>("all");
  const parcelsRequested = React.useRef(false);
  React.useEffect(() => {
    if (!exploreActive || listView !== "parcels" || parcelsRequested.current) return;
    parcelsRequested.current = true;
    setParcelState("loading");
    fetch("/api/atlas/map?layer=parcels")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: KgParcelPage) => {
        setParcels(Array.isArray(d.features) ? d.features : []);
        setParcelState("ready");
      })
      .catch(() => setParcelState("error"));
  }, [exploreActive, listView]);

  /** Klik na toponim: razreši TOPONYM node prek evidence iskanja, nato zgodba. */
  const openToponymStory = React.useCallback((name: string) => {
    fetch(`/api/atlas/evidence?q=${encodeURIComponent(name)}&type=TOPONYM`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { results?: { node_id?: string }[] }) => {
        setStoryRef(d.results?.[0]?.node_id ?? `toponym:${name}`);
      })
      .catch(() => setStoryRef(`toponym:${name}`));
  }, []);

  /* --- podatkovni sloji KG (PASS 5): naloži enkrat, prikaži z stikali --- */
  const [kgData, setKgData] = React.useState<KgMapData | null>(null);
  const [kgState, setKgState] = React.useState<"loading" | "ready" | "error">("loading");
  const [showKgObjects, setShowKgObjects] = React.useState(true);
  const [showKgHouses, setShowKgHouses] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    fetch("/api/atlas/map")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: KgMapData) => {
        if (!alive) return;
        setKgData(d);
        setKgState("ready");
      })
      .catch(() => {
        if (alive) setKgState("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  const kgObjectsA01 = React.useMemo(
    () => (kgData?.layers.map_objects ?? []).filter((m) => m.sheet === "A01"),
    [kgData]
  );
  const kgHousesLocated = React.useMemo(
    () => (kgData?.layers.houses ?? []).filter((h) => h.located && h.position),
    [kgData]
  );

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

  /* --- vidnost slojev v EXPLORE načinu (§19: samo dokazano / konflikti / neznano) --- */
  const visibleBuildings = React.useMemo(() => {
    if (!exploreActive) return data.buildings;
    return data.buildings.filter(
      (b) =>
        staticRowVisible(b, exploreFilterMode) &&
        matchesExploreQuery(exploreQuery, [b.bp, b.house_no, b.owner])
    );
  }, [exploreActive, data.buildings, exploreFilterMode, exploreQuery]);

  const visibleKgObjects = React.useMemo(() => {
    if (!exploreActive) return kgObjectsA01;
    return kgObjectsA01.filter(
      (m) =>
        modeAllowsTier(exploreTierOfStatus(m.evidence_status), exploreFilterMode) &&
        matchesExploreQuery(exploreQuery, [m.label, m.bp_glyph, m.node_id])
    );
  }, [exploreActive, kgObjectsA01, exploreFilterMode, exploreQuery]);

  const visibleKgHouses = React.useMemo(() => {
    if (!exploreActive) return kgHousesLocated;
    return kgHousesLocated.filter(
      (h) =>
        modeAllowsTier(exploreTierOfStatus(h.evidence_status), exploreFilterMode) &&
        matchesExploreQuery(exploreQuery, [h.house_no_1825, h.node_id])
    );
  }, [exploreActive, kgHousesLocated, exploreFilterMode, exploreQuery]);

  const exploreCounts = React.useMemo(() => {
    if (!exploreActive || listView !== "entities") return null;
    const tiered = {
      DOKAZANO: 0,
      VERJETNO: 0,
      KONFLIKTNO: 0,
      NEZNANO: 0,
    } as Record<string, number>;
    for (const b of data.buildings) tiered[exploreTierOfStaticRow(b)] += 1;
    for (const m of kgObjectsA01) tiered[exploreTierOfStatus(m.evidence_status)] += 1;
    for (const h of kgHousesLocated) tiered[exploreTierOfStatus(h.evidence_status)] += 1;
    return {
      tiers: tiered,
      visible:
        visibleBuildings.length + visibleKgObjects.length + visibleKgHouses.length,
      total: data.buildings.length + kgObjectsA01.length + kgHousesLocated.length,
    };
  }, [
    exploreActive,
    listView,
    data.buildings,
    kgObjectsA01,
    kgHousesLocated,
    visibleBuildings.length,
    visibleKgObjects.length,
    visibleKgHouses.length,
  ]);

  /* --- parcelni sloj (§19, val 73): filtri + deterministični vrstni red --- */
  const visibleParcels = React.useMemo(() => {
    if (!parcels) return [];
    return sortParcelsForBrowse(
      parcels.filter(
        (p) =>
          parcelVisible(p, exploreFilterMode, landUse) &&
          parcelMatchesQuery(exploreQuery, p)
      )
    );
  }, [parcels, exploreFilterMode, landUse, exploreQuery]);
  const parcelCounts = React.useMemo(
    () => (parcels ? parcelExploreCounts(parcels, exploreFilterMode, landUse, exploreQuery) : null),
    [parcels, exploreFilterMode, landUse, exploreQuery]
  );
  const luLabel = React.useCallback(
    (b: LandUseBucket) => {
      switch (b) {
        case "njiva": return s.luNjiva;
        case "travnik": return s.luTravnik;
        case "gozd": return s.luGozd;
        case "vrt": return s.luVrt;
        case "pašnik": return s.luPastnik;
        case "drugo": return s.luDrugo;
        case "UNKNOWN": return s.luUnknown;
        case "NONE": return s.luNone;
      }
    },
    [s]
  );
  const rowsAreParcels = exploreActive && listView === "parcels";

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
              ["explore", s.tabExplore],
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
        {exploreActive ? (
          <button
            onClick={() => setStoryRef("village")}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-[#2f6f4f]/40 bg-[#2f6f4f]/10 px-4 py-2.5 text-sm font-semibold text-[#2f6f4f] transition-colors hover:bg-[#2f6f4f]/20"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {s.villageStory}
          </button>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[1fr_340px]">
        {/* ——— ZEMLJEVID ——— */}
        <div className="relative h-[70vh] min-h-[420px] min-w-0 border-b border-border/70 lg:border-b-0 lg:border-r">
          {tab !== "today" ? (
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
              {visibleBuildings.map((b) => {
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
                        <div>
                          <StoryButton
                            compact
                            label={s.storyOfHouse}
                            onClick={() => setStoryRef(bpNodeRef(b.bp))}
                          />
                        </div>
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
                      <div className="mt-1.5">
                        <StoryButton
                          compact
                          label={s.storyOfToponym}
                          onClick={() => openToponymStory(tp.name)}
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {/* KG sloj: kartografski objekti atlasa 1825 (val 65/66, §15) */}
              {kgState === "ready" && showKgObjects
                ? visibleKgObjects.map((m) => {
                    if (!m.px) return null;
                    const label = `${m.label}${m.bp_glyph ? ` · BP ${m.bp_glyph}` : ""}`;
                    return (
                      <Marker
                        key={`kg-${m.node_id}`}
                        position={[data.overlay.px_size[1] - m.px[1], m.px[0]]}
                        title={label}
                        alt={label}
                        icon={markerIcon("#2f6f4f", m.bp_glyph ?? "•", true, label)}
                      >
                        <Popup>
                          <div className="min-w-56 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                              {m.node_id} · {m.glyph_tier}
                            </p>
                            <p className="text-sm font-semibold leading-snug">{m.label}</p>
                            <p className="text-xs text-stone-600">
                              {m.building_type}
                              {m.bp_glyph ? ` · BP ${m.bp_glyph}` : ""}
                            </p>
                            <p className="text-[11px] text-amber-700">{m.georef_status}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <StoryButton
                                compact
                                label={s.storyOfEntity}
                                onClick={() => setStoryRef(m.node_id)}
                              />
                              <a
                                className="inline-block text-xs font-semibold text-[#2f6f4f] underline underline-offset-2"
                                href={m.evidence_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {k.kgEvidence} ↗
                              </a>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })
                : null}
              {/* KG sloj: hiše locirane prek dokazane verige BP → objekt */}
              {kgState === "ready" && showKgHouses
                ? visibleKgHouses.map((h) => {
                    if (!h.position) return null;
                    const label = `${k.houseNo} ${h.house_no_1825} · ${k.kgViaBp.replace("{bp}", String(h.position.via_bp))}`;
                    return (
                      <Marker
                        key={`kgh-${h.node_id}`}
                        position={[data.overlay.px_size[1] - h.position.px[1], h.position.px[0]]}
                        title={label}
                        alt={label}
                        icon={markerIcon("#5d6e3f", h.house_no_1825.slice(0, 3), false, label)}
                      >
                        <Popup>
                          <div className="min-w-56 space-y-1.5">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                              {h.node_id} · {h.evidence_status}
                            </p>
                            <p className="text-sm font-semibold leading-snug">
                              {k.houseNo} {h.house_no_1825}
                            </p>
                            <p className="text-xs text-stone-600">
                              {k.kgViaBp.replace("{bp}", String(h.position.via_bp))} →{" "}
                              {h.position.map_object}
                            </p>
                            {h.bp_refs.length > 0 ? (
                              <p className="text-[11px] leading-snug text-stone-500">
                                BP: {h.bp_refs.map((r) => `${r.bp} (${r.final_status})`).join(" · ")}
                              </p>
                            ) : null}
                            <div className="flex flex-wrap items-center gap-2">
                              <StoryButton
                                compact
                                label={s.storyOfHouse}
                                onClick={() => setStoryRef(h.node_id)}
                              />
                              <a
                                className="inline-block text-xs font-semibold text-[#2f6f4f] underline underline-offset-2"
                                href={h.evidence_url}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {k.kgEvidence} ↗
                              </a>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })
                : null}
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
        <div className="flex max-h-[70vh] min-w-0 flex-col">
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
              {rowsAreParcels
                ? null
                : k.panelCounts
                    .replace("{labeled}", String(labeled.length))
                    .replace("{buildings}", String(data.buildings.length))}
            </p>
            {kgState === "ready" && kgData ? (
              <div className="mt-3 rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                  {k.kgLayers}
                </p>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {k.kgPanelNote
                    .replace("{objects}", String(kgData.counts.map_objects))
                    .replace("{houses}", String(kgData.counts.houses_located))
                    .replace("{toponyms}", String(kgData.counts.toponyms))}
                </p>
                {kgData.counts.map_objects_other_sheets > 0 ? (
                  <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                    {k.kgOtherSheets.replace(
                      "{other}",
                      String(kgData.counts.map_objects_other_sheets)
                    )}
                  </p>
                ) : null}
                <div className="mt-2 flex flex-col gap-1.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={showKgObjects}
                      onChange={(e) => setShowKgObjects(e.target.checked)}
                      className="h-4 w-4 accent-[#2f6f4f]"
                      aria-label={k.kgToggleObjects}
                    />
                    {k.kgToggleObjects} ({kgData.counts.map_objects_a01})
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={showKgHouses}
                      onChange={(e) => setShowKgHouses(e.target.checked)}
                      className="h-4 w-4 accent-[#5d6e3f]"
                      aria-label={k.kgToggleHouses}
                    />
                    {k.kgToggleHouses} ({kgData.counts.houses_located})
                  </label>
                </div>
              </div>
            ) : kgState === "loading" ? (
              <p className="mt-3 text-[11px] text-muted-foreground" role="status">
                {k.kgLoading}
              </p>
            ) : (
              <p className="mt-3 text-[11px] text-muted-foreground">{k.kgError}</p>
            )}
            {exploreActive ? (
              <div className="mt-3 rounded-lg border border-[#2f6f4f]/30 bg-[#2f6f4f]/5 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-500">
                  {s.filters}
                </p>
                {/* seznam: hiše & objekti | parcele (§19, val 73) */}
                <div
                  className="mt-2 flex rounded-lg border border-border/70 bg-background p-1"
                  role="tablist"
                  aria-label={s.listParcels}
                >
                  {(
                    [
                      ["entities", s.listEntities],
                      ["parcels", s.listParcels],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={listView === id}
                      onClick={() => setListView(id)}
                      className={`h-9 flex-1 rounded-md px-2 text-xs font-semibold transition-colors ${
                        listView === id
                          ? "bg-[#2f6f4f] text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {/* query filter (lastnik / BP / hiša / št. parcele / raba) */}
                <input
                  type="search"
                  value={exploreQuery}
                  onChange={(e) => setExploreQuery(e.target.value)}
                  placeholder={s.searchPlaceholder}
                  className="mt-2 h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  aria-label={s.searchPlaceholder}
                />
                {/* dokazni načini (§19): vse / samo dokazano / konflikti / neznano */}
                <div
                  className="mt-2 flex flex-wrap gap-1.5"
                  role="group"
                  aria-label={s.filters}
                >
                  {(
                    [
                      ["all", s.modeAll],
                      ["evidenced", s.modeEvidenced],
                      ["conflicts", s.modeConflicts],
                      ["unknown", s.modeUnknown],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      onClick={() => setExploreFilterMode(id)}
                      aria-pressed={exploreFilterMode === id}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        exploreFilterMode === id
                          ? "border-[#2f6f4f] bg-[#2f6f4f] text-white"
                          : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {exploreCounts ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {s.exploreCounts
                      .replace("{visible}", String(exploreCounts.visible))
                      .replace("{total}", String(exploreCounts.total))}
                  </p>
                ) : null}
                {/* parcelni sloj rabe (§19, val 73): filtri rabe + poštenost */}
                {rowsAreParcels ? (
                  <div className="mt-3 border-t border-[#2f6f4f]/20 pt-2">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      {s.filterUse}
                    </p>
                    {parcelState === "loading" ? (
                      <p className="mt-1 text-[11px] text-muted-foreground" role="status">
                        {s.parcelLoading}
                      </p>
                    ) : null}
                    {parcelState === "error" ? (
                      <p className="mt-1 text-[11px] text-muted-foreground">{s.parcelError}</p>
                    ) : null}
                    {parcelCounts ? (
                      <div
                        className="mt-1.5 flex flex-wrap gap-1.5"
                        role="group"
                        aria-label={s.filterUse}
                      >
                        <button
                          onClick={() => setLandUse("all")}
                          aria-pressed={landUse === "all"}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            landUse === "all"
                              ? "border-[#2f6f4f] bg-[#2f6f4f] text-white"
                              : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s.luAll} ({parcelCounts.total})
                        </button>
                        {LAND_USE_ORDER.map((b) => {
                          const n = parcelCounts.buckets[b];
                          if (n === 0) return null;
                          return (
                            <button
                              key={b}
                              onClick={() => setLandUse(b)}
                              aria-pressed={landUse === b}
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                                landUse === b
                                  ? "border-[#2f6f4f] bg-[#2f6f4f] text-white"
                                  : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {luLabel(b)} ({n})
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                    {parcelCounts ? (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {s.parcelCounts
                          .replace("{visible}", String(parcelCounts.visible))
                          .replace("{total}", String(parcelCounts.total))}
                      </p>
                    ) : null}
                    <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
                      {s.parcelGeometryNote}
                    </p>
                    <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                      {s.filterUseNote}
                    </p>
                  </div>
                ) : null}
                <p className="mt-2 text-[11px] leading-snug text-muted-foreground">{s.exploreNote}</p>
              </div>
            ) : null}
          </div>
          <ul className="min-h-0 min-w-0 flex-1 divide-y divide-border/50 overflow-x-hidden overflow-y-auto" role="list">
            {rowsAreParcels
              ? visibleParcels.map((p, idx) => {
                  const use = landUseBucketOf(p.land_use_category);
                  return (
                    <li
                      /* KLJUČ z indeksom: isti PS parcel_id se lahko pojavi v
                       * več vrsticah registra (različna lastniška vezava —
                       * PS-p005-j484: Breugl Georg h.18 / Urich Peter h.21).
                       * node_id sam NI unikaten ključ → podvojeni ključi bi
                       * pokvarili reconciliacijo seznama. */
                      key={`${p.node_id}-${idx}`}
                      className="px-4 py-3"
                    >
                      <button
                        className="w-full text-left"
                        onClick={() => setStoryRef(p.node_id)}
                        aria-label={`${s.storyOfParcel}: ${parcelLabel(p)}`}
                      >
                        <span className="flex flex-wrap items-center gap-1.5">
                          <span className={`${badge} bg-muted text-muted-foreground`}>
                            {parcelLabel(p)}
                          </span>
                          <span className={`${badge} ${luBadgeClass(p.land_use_category)}`}>
                            {luLabel(use)}
                          </span>
                          {p.co_referenced ? (
                            <span className={`${badge} bg-[#8b3a2e]/10 text-[#8b3a2e]`}>
                              {s.parcelCoRef}
                            </span>
                          ) : null}
                        </span>
                        {p.land_use_category === "UNKNOWN" && p.land_use_original ? (
                          <span className="mt-1 block truncate text-xs text-muted-foreground">
                            „{p.land_use_original}“
                          </span>
                        ) : null}
                        {p.house_refs.length > 0 ? (
                          <span className="mt-0.5 block truncate text-[11px] text-stone-500">
                            {s.parcelHousesLabel}: {p.house_refs.join(" · ")}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })
              : (exploreActive ? visibleBuildings : filtered).map((b) => (
                  <li key={`row-${b.bp}-${b.px}`} className="px-4 py-3">
                    <button
                      className="w-full text-left"
                      onClick={() => {
                        setTarget(
                          tab === "today"
                            ? [b.lat, b.lng]
                            : [data.overlay.px_size[1] - b.py, b.px]
                        );
                        if (exploreActive) setStoryRef(bpNodeRef(b.bp));
                      }}
                      aria-label={
                        exploreActive
                          ? `${s.storyOfHouse}: ${b.owner ?? `${k.bp} ${b.bp}`}`
                          : undefined
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
            {(rowsAreParcels ? visibleParcels : exploreActive ? visibleBuildings : filtered)
              .length === 0 && (
              <li className="px-4 py-6 text-sm text-muted-foreground">
                {parcelState === "loading" && rowsAreParcels ? s.parcelLoading : k.noResults}
              </li>
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

      {/* ——— ZGODBA (§16/§19): dialog iz dokazov ——— */}
      <AtlasStoryDialog entity={storyRef} onClose={() => setStoryRef(null)} />
    </section>
  );
}
