import type { ExhibitCategory, ExhibitDTO } from "@/lib/types";
import { THEME_HUBS } from "@/lib/theme-hubs";

/**
 * Povezave med zapisi — grafski pogled na zbirko.
 *
 * Vzorec: »x Degrees of Separation« (Google Arts & Culture / Mario
 * Klingemann) — najdi pot med dvema predmetoma. Naša različica je
 * majhna in razložljiva: povezavo vedno utemeljimo s skupnim dejstvom
 * (ista tema, prekrivajoče obdobje, isti vir, bližina na karti),
 * kar pri velikih muzejih ostaja skrito v modelu.
 *
 * Sorodni vzorec: »related objects« v zbirkah British Museuma in
 * Rijksmuseuma; pri 20 zapisih namesto modela uporabimo pravila.
 */

export type ConnectionKind = "category" | "period" | "source" | "place" | "curated";

export type Connection = {
  kind: ConnectionKind;
  /** Utemeljitev povezave v jeziku vmesnika. */
  labelSi: string;
  labelEn: string;
  /** Moč povezave za razvrščanje (višje = močnejša). */
  weight: number;
};

/** Kuratorsko razglašene sorodnosti tem (iz tematskih središč) — obojestransko. */
const CURATED_THEME_PAIRS: Set<string> = (() => {
  const pairs = new Set<string>();
  for (const hub of THEME_HUBS) {
    for (const related of hub.related) {
      pairs.add(`${hub.category}|${related.category}`);
      pairs.add(`${related.category}|${hub.category}`);
    }
  }
  return pairs;
})();

/** Haversinova razdalja v kilometrih. */
function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Ali se obdobji dveh zapisov prekrivata (oba morata imeti letnice). */
function periodsOverlap(a: ExhibitDTO, b: ExhibitDTO): boolean {
  if (a.yearFrom == null || b.yearFrom == null) return false;
  const aFrom = a.yearFrom;
  const aTo = a.yearTo ?? a.yearFrom;
  const bFrom = b.yearFrom;
  const bTo = b.yearTo ?? b.yearFrom;
  return aFrom <= bTo && bFrom <= aTo;
}

/** Presek imen virov (isti arhiv, knjiga, fotograf …). */
function sharedSourceNames(a: ExhibitDTO, b: ExhibitDTO): string[] {
  const names = new Set(a.sources.map((s) => s.nameSi));
  return b.sources.map((s) => s.nameSi).filter((n) => names.has(n));
}

/** Vse razložljive povezave med dvema zapisoma. */
export function connectionsBetween(a: ExhibitDTO, b: ExhibitDTO): Connection[] {
  const out: Connection[] = [];

  if (a.category === b.category) {
    out.push({
      kind: "category",
      labelSi: "ista tema",
      labelEn: "same theme",
      weight: 3,
    });
  }

  if (periodsOverlap(a, b)) {
    out.push({
      kind: "period",
      labelSi: "prekrivajoče obdobje",
      labelEn: "overlapping period",
      weight: 2,
    });
  }

  const shared = sharedSourceNames(a, b);
  if (shared.length > 0) {
    out.push({
      kind: "source",
      labelSi: shared.length === 1 ? "isti vir" : "ista vira",
      labelEn: shared.length === 1 ? "same source" : "same sources",
      weight: 3,
    });
  }

  if (a.lat != null && a.lng != null && b.lat != null && b.lng != null) {
    const km = distanceKm(a.lat, a.lng, b.lat, b.lng);
    if (km <= 3) {
      out.push({
        kind: "place",
        labelSi: "blizu drug drugega",
        labelEn: "close to each other",
        weight: 2,
      });
    }
  }

  // Kuratorska vez: sorodnost tem je razglasil kurator v tematskih središčih —
  // ne izhaja iz skupnega vira, zato je tudi najšibkejša povezava (utež 1).
  if (CURATED_THEME_PAIRS.has(`${a.category}|${b.category}`)) {
    out.push({
      kind: "curated",
      labelSi: "kuratorska vez tem",
      labelEn: "curatorial link of themes",
      weight: 1,
    });
  }

  return out;
}

export type RelatedExhibit = {
  exhibit: ExhibitDTO;
  connections: Connection[];
  score: number;
};

/**
 * Sorodni zapisi za dani zapis — urejeni po skupni moči povezav.
 * Določena zaledja ne potrebuje: pravila tečejo nad že naloženo zbirko.
 */
export function relatedExhibits(
  exhibit: ExhibitDTO,
  exhibits: ExhibitDTO[],
  limit = 3
): RelatedExhibit[] {
  return exhibits
    .filter((ex) => ex.slug !== exhibit.slug)
    .map((ex) => {
      const connections = connectionsBetween(exhibit, ex);
      return {
        exhibit: ex,
        connections,
        score: connections.reduce((sum, c) => sum + c.weight, 0),
      };
    })
    .filter((rel) => rel.connections.length > 0)
    .sort(
      (x, y) =>
        y.score - x.score || x.exhibit.sortOrder - y.exhibit.sortOrder
    )
    .slice(0, limit);
}

export type ConnectionPath = {
  /** Veriga zapisov od A do B (vključno z obema). */
  chain: ExhibitDTO[];
  /** Utemeljitve posameznih skokov (hops[i] povezuje chain[i] in chain[i+1]). */
  hops: Connection[][];
};

/**
 * Pot med dvema zapisoma — najkrajša pot v grafu povezav, pri
 * enako dolgih prednost močnejšim povezavam (Dijkstra s cenjo
 * 1/utež). Graf ima 20 vozlišč, izračun je trenutek.
 */
export function findConnectionPath(
  aSlug: string,
  bSlug: string,
  exhibits: ExhibitDTO[]
): ConnectionPath | null {
  const start = exhibits.find((ex) => ex.slug === aSlug);
  const goal = exhibits.find((ex) => ex.slug === bSlug);
  if (!start || !goal || start.slug === goal.slug) return null;

  // Sosednost: vsak par z vsaj eno povezavo. Teža = seštevek uteži.
  const nodes = exhibits;
  const dist = new Map<string, number>();
  const prev = new Map<string, { slug: string; connections: Connection[] }>();
  const visited = new Set<string>();

  const edgeWeight = (x: ExhibitDTO, y: ExhibitDTO): number | null => {
    const c = connectionsBetween(x, y);
    if (c.length === 0) return null;
    return c.reduce((sum, conn) => sum + conn.weight, 0);
  };

  for (const n of nodes) dist.set(n.slug, Infinity);
  dist.set(start.slug, 0);

  while (true) {
    // Najbližje neobiskano vozlišče.
    let current: string | null = null;
    let best = Infinity;
    for (const n of nodes) {
      if (visited.has(n.slug)) continue;
      const d = dist.get(n.slug) ?? Infinity;
      if (d < best) {
        best = d;
        current = n.slug;
      }
    }
    if (current === null || current === goal.slug) break;
    visited.add(current);

    const currentNode = nodes.find((n) => n.slug === current)!;
    for (const neighbor of nodes) {
      if (neighbor.slug === current) continue;
      const w = edgeWeight(currentNode, neighbor);
      if (w == null) continue;
      // Cena = obratna vrednost teže → močne povezave so »cenejše«.
      const cost = 1 / w;
      const next = (dist.get(current) ?? Infinity) + cost;
      if (next < (dist.get(neighbor.slug) ?? Infinity)) {
        dist.set(neighbor.slug, next);
        prev.set(neighbor.slug, {
          slug: current,
          connections: connectionsBetween(currentNode, neighbor),
        });
      }
    }
  }

  if (!dist.has(goal.slug) || (dist.get(goal.slug) ?? Infinity) === Infinity) {
    return null;
  }

  // Rekonstrukcija poti od B nazaj do A.
  const chain: ExhibitDTO[] = [goal];
  const hops: Connection[][] = [];
  let cursor = goal.slug;
  while (cursor !== start.slug) {
    const step = prev.get(cursor);
    if (!step) return null;
    const node = nodes.find((n) => n.slug === step.slug);
    if (!node) return null;
    chain.unshift(node);
    hops.unshift(step.connections);
    cursor = step.slug;
  }

  return { chain, hops };
}
