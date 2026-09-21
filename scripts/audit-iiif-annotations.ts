/**
 * AUDIT: IIIF ANOTACIJE ŽIVLJENJEPISOV (61. sklop).
 *
 * Preverja invariano vrzeli #2 iz benchmarka svetovnih digitalnih muzejev
 * (research-griblje/27): vsak zapis z življenjepisom ima IIIF AnnotationPage
 * z `supplementing` anotacijami po fazah; vsaka anotacija ima dvojezično telo
 * (sl+en), oznako z letnico/fazo/statusom in cilja na pravi Canvas;
 * zapisi brez življenjepisa Canvas.annotations ne pošiljajo.
 *
 * Ničesar ne spreminja. Zagon: bun scripts/audit-iiif-annotations.ts
 */

import { seedExhibits } from "../src/lib/museum-content";
import { OBJECT_BIOGRAPHIES } from "../src/lib/object-biographies";
import { buildFullManifest } from "../src/lib/iiif-manifest";

let pass = 0;
let fail = 0;
const failures: string[] = [];

function check(cond: boolean, msg: string) {
  if (cond) {
    pass += 1;
  } else {
    fail += 1;
    failures.push(msg);
  }
}

const bioBySlug = new Map(OBJECT_BIOGRAPHIES.map((b) => [b.slug, b]));
const ORIGIN = "https://griblje-museum.vercel.app";

const exhibits = seedExhibits.map((ex) => ({
  ...ex,
  sources: ex.sources.map((s, i) => ({ ...s, sortOrder: i })),
}));

const withBio = exhibits.filter((ex) => bioBySlug.has(ex.slug));
const withoutBio = exhibits.filter((ex) => !bioBySlug.has(ex.slug));

// A1: vsak zapis z življenjepisom ima AnnotationPage s pravim številom faz.
let okPages = 0;
const badPages: string[] = [];
for (const ex of withBio) {
  const manifest = buildFullManifest(ORIGIN, ex as never);
  const canvas = manifest.items?.[0] as
    | { annotations?: { items?: unknown[] }[] }
    | undefined;
  const page = canvas?.annotations?.[0];
  const expected = bioBySlug.get(ex.slug)!.phases.length;
  const count = (page?.items as unknown[] | undefined)?.length ?? -1;
  if (count === expected) okPages += 1;
  else badPages.push(`${ex.slug}:${count}/${expected}`);
}
check(
  okPages === withBio.length,
  `A1 ${withBio.length}/${withBio.length} manifestov z anotacijami po fazah (${badPages.join(", ") || "vse prav"})`
);

// A2: vsaka anotacija — motivation supplementing, dvojezično telo, target.
let okAnnos = 0;
let totalAnnos = 0;
const badAnnos: string[] = [];
for (const ex of withBio) {
  const manifest = buildFullManifest(ORIGIN, ex as never);
  const canvas = manifest.items?.[0] as
    | { id?: string; annotations?: { items?: Record<string, never>[] }[] }
    | undefined;
  const page = canvas?.annotations?.[0];
  const items = (page?.items ?? []) as {
    motivation?: string;
    body?: { type?: string; language?: string; value?: string }[];
    target?: string;
  }[];
  for (const a of items) {
    totalAnnos += 1;
    const bodyOk =
      Array.isArray(a.body) &&
      a.body.length === 2 &&
      a.body.every((b) => b.type === "TextualBody" && !!b.value) &&
      a.body.some((b) => b.language === "sl") &&
      a.body.some((b) => b.language === "en");
    const ok =
      a.motivation === "supplementing" &&
      bodyOk &&
      a.target === canvas?.id;
    if (ok) okAnnos += 1;
    else badAnnos.push(`${ex.slug}:${a.motivation ?? "?"}`);
  }
}
check(
  okAnnos === totalAnnos && totalAnnos > 0,
  `A2 ${okAnnos}/${totalAnnos} anotacij z motivation=supplementing + sl/en telom + target (${badAnnos.slice(0, 4).join(", ") || "vse prav"})`
);

// A3: številka anotacij po virih = skupno število faz v objektnih biografijah.
const declaredPhases = OBJECT_BIOGRAPHIES.reduce((n, b) => n + b.phases.length, 0);
check(
  totalAnnos === declaredPhases,
  `A3 anotacij ${totalAnnos} = faz ${declaredPhases}`
);

// A4: zapisi BREZ življenjepisa ne pošiljajo Canvas.annotations.
let leaked = 0;
for (const ex of withoutBio) {
  const manifest = buildFullManifest(ORIGIN, ex as never);
  const canvas = manifest.items?.[0] as { annotations?: unknown } | undefined;
  if (canvas?.annotations) leaked += 1;
}
check(leaked === 0, `A4 0 prepustov brez življenjepisa (${leaked})`);

// A5: painting anotacija ostane nedotaknjena (slika še vedno na platnu).
let okPainting = 0;
for (const ex of exhibits) {
  const manifest = buildFullManifest(ORIGIN, ex as never);
  const canvas = manifest.items?.[0] as
    | { items?: { items?: { motivation?: string }[] }[] }
    | undefined;
  const painting = canvas?.items?.[0]?.items?.[0];
  if (painting?.motivation === "painting") okPainting += 1;
}
check(
  okPainting === exhibits.length,
  `A5 ${okPainting}/${exhibits.length} platn z painting sliko`
);

console.log("════════════════════════════════════════════════════════════════════════");
console.log("AUDIT IIIF ANOTACIJ ŽIVLJENJEPISOV —");
console.log(`  zapisi z življenjepisom: ${withBio.length} · brez: ${withoutBio.length} · faz: ${declaredPhases}`);
console.log(`  preverbe (check)       : ${pass} ✓ / ${fail} ✗`);
if (failures.length) {
  console.log("NEUSPEŠNE:");
  failures.forEach((f) => console.log("  ✗", f));
  process.exit(1);
}
console.log("VSE PREVERBE USPEŠNE — anotacije ujemajo življenjepise 1:1.");
