// READ-ONLY audit extraction — FAZA 2, točka 3 (audit 93 eksponatov)
// Ne spreminja ničesar; izpiše TSV + statistiko za muzejsko vsebinsko presojo.
import {
  seedExhibits,
  seedEvents,
} from "../src/lib/museum-content";
import { ALL_WALKS, FAMILY_WALK } from "../src/lib/walks";
import { MINUTE_STORIES } from "../src/lib/minute-stories";
import { OBJECT_BIOGRAPHIES } from "../src/lib/object-biographies";
import { relatedExhibits, connectionsBetween } from "../src/lib/connections";

type Row = {
  mvg: string;
  slug: string;
  title: string;
  category: string;
  period: string;
  yf: number | null;
  yt: number | null;
  evidence: string;
  image: boolean;
  lat: boolean;
  storyCharsSl: number;
  storyCharsEn: number;
  paragraphsSl: number;
  paragraphsEn: number;
  summaryCharsSl: number;
  sources: number;
  sourceTypes: string[];
  licenses: string[];
  sourcesWithUrl: number;
  walkStops: string[];
  minute: boolean;
  biography: boolean;
  related: number;
  relatedReasons: string[];
};

const walkMap = new Map<string, string[]>();
for (const w of ALL_WALKS) {
  w.stops.forEach((s, i) => {
    const arr = walkMap.get(s.exhibitSlug) ?? [];
    arr.push(`${w.id.slice(0, 12)}#${i + 1}/${w.stops.length}`);
    walkMap.set(s.exhibitSlug, arr);
  });
}
for (const w of [FAMILY_WALK]) {
  w.stops.forEach((s, i) => {
    const arr = walkMap.get(s.exhibitSlug) ?? [];
    arr.push(`drusinski#${i + 1}/${w.stops.length}`);
    walkMap.set(s.exhibitSlug, arr);
  });
}
const minuteSlugs = new Set(MINUTE_STORIES.map((m) => m.slug));
const bioSlugs = new Set(OBJECT_BIOGRAPHIES.map((b) => b.slug));

const allSources = seedExhibits.flatMap((ex) =>
  (ex.sources ?? []).map((s) => ({ ...s, exhibitSlug: ex.slug })),
);

const rows: Row[] = seedExhibits.map((ex) => {
  const src = allSources.filter((s) => s.exhibitSlug === ex.slug);
  const rel = relatedExhibits(ex as never, seedExhibits as never, 99) as unknown as { exhibit: { slug: string }; reasons?: string[] }[];
  const reasons = new Set<string>();
  for (const r of rel) {
    for (const c of connectionsBetween(ex as never, r.exhibit as never) as unknown as { reason?: string }[]) reasons.add(c.reason ?? "");
  }
  const paras = (t: string) => t.split(/\n\n+/).filter((p) => p.trim()).length;
  return {
    mvg: ex.museumNo ?? "MISSING",
    slug: ex.slug,
    title: ex.titleSi,
    category: ex.category,
    period: ex.periodSi,
    yf: ex.yearFrom ?? null,
    yt: ex.yearTo ?? null,
    evidence: ex.evidenceStatus,
    image: Boolean(ex.image),
    lat: ex.lat != null && ex.lng != null,
    storyCharsSl: ex.storySi.length,
    storyCharsEn: ex.storyEn.length,
    paragraphsSl: paras(ex.storySi),
    paragraphsEn: paras(ex.storyEn),
    summaryCharsSl: ex.summarySi.length,
    sources: src.length,
    sourceTypes: [...new Set(src.map((s) => s.sourceType))],
    licenses: [...new Set(src.map((s) => s.license ?? "NO-LICENSE"))],
    sourcesWithUrl: src.filter((s) => Boolean(s.url)).length,
    walkStops: walkMap.get(ex.slug) ?? [],
    minute: minuteSlugs.has(ex.slug),
    biography: bioSlugs.has(ex.slug),
    related: rel.length,
    relatedReasons: [...reasons],
  };
});

// --- TSV izpis ---
const header = [
  "MVG", "slug", "kategorija", "obdobje", "letoOd", "letoDo", "dokaz",
  "slika", "geo", "znakiSL", "znakiEN", "odstavkiSL", "odstavkiEN",
  "povzetekSL", "viri", "tipiVirov", "licence", "viriURL", "sprehodi",
  "minutka", "biografija", "povezani", "razlogiPovezav",
].join("\t");
console.log(header);
for (const r of rows) {
  console.log([
    r.mvg, r.slug, r.category, r.period, r.yf ?? "", r.yt ?? "", r.evidence,
    r.image ? "da" : "NE", r.lat ? "da" : "ne", r.storyCharsSl, r.storyCharsEn,
    r.paragraphsSl, r.paragraphsEn, r.summaryCharsSl, r.sources,
    r.sourceTypes.join("+"), r.licenses.join("+"), r.sourcesWithUrl,
    r.walkStops.join(" "), r.minute ? "da" : "ne", r.biography ? "da" : "ne",
    r.related, r.relatedReasons.slice(0, 6).join("+"),
  ].join("\t"));
}

// --- Statistika ---
const n = rows.length;
const sum = (f: (r: Row) => number) => rows.reduce((a, r) => a + f(r), 0);
console.error("\n=== STATISTIKA ===");
console.error(`zapisi: ${n}; dogodki: ${seedEvents.length}; viri skupaj: ${allSources.length}`);
console.error(`museumNo manjka: ${rows.filter((r) => r.mvg === "MISSING").length}`);
console.error(`slika manjka: ${rows.filter((r) => !r.image).length}`);
console.error(`geo: ${rows.filter((r) => r.lat).length}/${n}`);
console.error(`povzetek SL < 60 znakov: ${rows.filter((r) => r.summaryCharsSl < 60).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`zgodb SL < 600 znakov: ${rows.filter((r) => r.storyCharsSl < 600).map((r) => `${r.slug}(${r.storyCharsSl})`).join(", ") || "nobena"}`);
console.error(`zgodb EN < 600 znakov: ${rows.filter((r) => r.storyCharsEn < 600).map((r) => `${r.slug}(${r.storyCharsEn})`).join(", ") || "nobena"}`);
console.error(`odstavki SL != EN: ${rows.filter((r) => r.paragraphsSl !== r.paragraphsEn).map((r) => `${r.slug}(${r.paragraphsSl}/${r.paragraphsEn})`).join(", ") || "noben"}`);
console.error(`viri = 0: ${rows.filter((r) => r.sources === 0).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`viri = 1: ${rows.filter((r) => r.sources === 1).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`brez URL vira: ${rows.filter((r) => r.sourcesWithUrl === 0).map((r) => `${r.slug}(${r.sources})`).join(", ") || "noben"}`);
console.error(`licenca manjka pri vsaj enem viru: ${rows.filter((r) => r.licenses.includes("NO-LICENSE")).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`evidence razdelitev: ${JSON.stringify(Object.entries(rows.reduce<Record<string, number>>((a, r) => { a[r.evidence] = (a[r.evidence] ?? 0) + 1; return a; }, {})))}`);
console.error(`kategorije: ${JSON.stringify(Object.entries(rows.reduce<Record<string, number>>((a, r) => { a[r.category] = (a[r.category] ?? 0) + 1; return a; }, {})))}`);
console.error(`sprehod pokritost: ${rows.filter((r) => r.walkStops.length === 0).map((r) => r.slug).join(", ") || "vsi pokriti"}`);
console.error(`minutke: ${rows.filter((r) => r.minute).length}/${n}; biografije: ${rows.filter((r) => r.biography).length}/${n}`);
console.error(`BREZ povezanih zapisov (related=0): ${rows.filter((r) => r.related === 0).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`samo 1 povezan: ${rows.filter((r) => r.related === 1).map((r) => r.slug).join(", ") || "noben"}`);
console.error(`povprečna dolžina zgodbe SL: ${Math.round(sum((r) => r.storyCharsSl) / n)} znakov; EN: ${Math.round(sum((r) => r.storyCharsEn) / n)}`);
console.error(`povprečno virov: ${(sum((r) => r.sources) / n).toFixed(1)}`);
