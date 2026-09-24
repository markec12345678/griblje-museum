/**
 * Uredniško delo — verzije in workflow (issue #27/C).
 *
 * Vsaka uredniška sprememba mora omogočati rekonstrukcijo: kdo, kdaj, kaj,
 * prejšnja verzija, nova verzija, razlog, status objave. `updatedAt` sam
 * ni dovolj.
 *
 * Workflow: DRAFT → REVIEW → APPROVED → PUBLISHED, po potrebi REJECTED /
 * ARCHIVED. Javni obiskovalec vidi samo objavljeno stanje zapisa — tabela
 * Exhibit predstavlja »trenutno objavljeno«, verzije pa zgodovino in
 * pripravo. Objava (publish) v transakciji prepisuje polja Exhibit iz
 * snapshot-a, zato je objava atomska (ali celotna verzija, ali nič).
 *
 * Avtorizacija: brez računov uporabljamo deljeni uredniški žeton
 * (`EDITORIAL_TOKEN`), ki ga pošiljamo v glavi `x-editorial-token`.
 * Če žeton ni nastavljen, so uredniški API-ji zaprti (503) — produkcija
 * brez nastavljenega žetona ne more po nesreči objaviti ničesar.
 */

import { z } from "zod";
import { NextResponse } from "next/server";

// --- Statusi in prehodi ------------------------------------------------

export const VERSION_STATUSES = [
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
  "ARCHIVED",
] as const;
export type VersionStatus = (typeof VERSION_STATUSES)[number];

export function isVersionStatus(v: string): v is VersionStatus {
  return (VERSION_STATUSES as readonly string[]).includes(v);
}

/**
 * Dovoljeni prehodi (issue #27/C3):
 *   DRAFT → REVIEW → APPROVED → PUBLISHED
 *   REVIEW/APPROVED → REJECTED (urejevalnik vrne v DRAFT po popravku)
 *   vsak neobjavljen status → ARCHIVED (umik iz dela)
 *   PUBLISHED → ARCHIVED (umik objave; vsebina ostane v zgodovini)
 * Objavljena verzija ni več urejanljiva — nova sprememba = nova verzija.
 */
export const VERSION_TRANSITIONS: Record<VersionStatus, readonly VersionStatus[]> = {
  DRAFT: ["REVIEW", "ARCHIVED"],
  REVIEW: ["APPROVED", "REJECTED", "DRAFT"],
  APPROVED: ["PUBLISHED", "REJECTED", "ARCHIVED"],
  PUBLISHED: ["ARCHIVED"],
  REJECTED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: [],
};

export function canTransition(from: VersionStatus, to: VersionStatus): boolean {
  return VERSION_TRANSITIONS[from].includes(to);
}

/** Uredniška akcija (API) → ciljni status. */
export const VERSION_ACTIONS = {
  submit: "REVIEW",
  approve: "APPROVED",
  reject: "REJECTED",
  publish: "PUBLISHED",
  archive: "ARCHIVED",
  "return-to-draft": "DRAFT",
} as const;
export type VersionAction = keyof typeof VERSION_ACTIONS;

/** Preveri, ali je akcija dovoljena iz trenutnega statusa. */
export function canAct(from: VersionStatus, action: VersionAction): boolean {
  return canTransition(from, VERSION_ACTIONS[action]);
}

// --- Avtorizacija ------------------------------------------------------

/** Je zahteva avtorizirana za uredniške API-je? (deljeni žeton) */
export function isEditorialAuthorized(request: Request): boolean {
  const expected = process.env.EDITORIAL_TOKEN;
  if (!expected) return false; // brez žetona = uredniški API zaprt
  const provided = request.headers.get("x-editorial-token") ?? "";
  // Primerjava v konstantnem času (ne razkriva žetona prek časovnih stranskih kanalov)
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** Enoten odgovor za neavtorizirane/nekonfigurirane uredniške klice. */
export function editorialForbidden(): NextResponse {
  if (!process.env.EDITORIAL_TOKEN) {
    return NextResponse.json(
      { error: "Uredniški vmesnik ni nastavljen (EDITORIAL_TOKEN manjka)." },
      { status: 503 }
    );
  }
  return NextResponse.json({ error: "Manjka veljaven x-editorial-token." }, { status: 401 });
}

// --- Snapshot zapisa (Exhibit) -----------------------------------------

/** Urejanljiva polja zapisa — identiteta (slug, museumNo, category) NI
 *  urejanljiva skozi workflow; sprememba identitete = nov zapis. */
export const EXHIBIT_EDITABLE_FIELDS = [
  "titleSi",
  "titleEn",
  "periodSi",
  "periodEn",
  "summarySi",
  "summaryEn",
  "storySi",
  "storyEn",
  "evidenceStatus",
  "image",
  "imageCredit",
  "model3dUrl",
  "model3dCredit",
  "yearFrom",
  "yearTo",
  "lat",
  "lng",
  "coordsApprox",
  "featured",
  "sortOrder",
] as const;
export type ExhibitEditableField = (typeof EXHIBIT_EDITABLE_FIELDS)[number];

export type ExhibitSnapshot = Record<ExhibitEditableField, unknown>;

const evidenceEnum = z.enum([
  "DOCUMENTED",
  "CORROBORATED",
  "TESTIMONY",
  "TRADITION",
  "UNVERIFIED",
  "TO_COLLECT",
]);

/** Zod shema snapshot-a — vsako polje posebej tipizirano (brez `any`). */
export const exhibitSnapshotSchema = z.object({
  titleSi: z.string().min(1).max(300),
  titleEn: z.string().min(1).max(300),
  periodSi: z.string().min(1).max(300),
  periodEn: z.string().min(1).max(300),
  summarySi: z.string().min(1).max(2000),
  summaryEn: z.string().min(1).max(2000),
  storySi: z.string().min(1),
  storyEn: z.string().min(1),
  evidenceStatus: evidenceEnum,
  image: z.string().nullable(),
  imageCredit: z.string().nullable(),
  model3dUrl: z.string().nullable(),
  model3dCredit: z.string().nullable(),
  yearFrom: z.number().int().nullable(),
  yearTo: z.number().int().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  coordsApprox: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.number().int(),
});

/** Zgradi snapshot iz trenutnega stanja zapisa (vrstica iz baze). */
export function snapshotOfExhibit(exhibit: Record<string, unknown>): ExhibitSnapshot {
  const snap = {} as ExhibitSnapshot;
  for (const field of EXHIBIT_EDITABLE_FIELDS) {
    snap[field] = exhibit[field] ?? null;
  }
  return snap;
}

/** Patch — delna sprememba snapshot-a. Neznana polja zavrnjena (strict). */
export const exhibitPatchSchema = exhibitSnapshotSchema.partial().strict();
export type ExhibitPatch = z.infer<typeof exhibitPatchSchema>;

/** Združi trenutni snapshot s patch-om (vrne nov snapshot, ne mutira). */
export function applyPatch<T extends object>(
  base: T,
  patch: Partial<T> | Record<string, unknown>
): T {
  return { ...base, ...(patch as Partial<T>) };
}

/** Seznam polj, ki se razlikujejo med dvema snapshot-oma (za dnevnik). */
export function snapshotDiff(a: ExhibitSnapshot, b: ExhibitSnapshot): string[] {
  const changed: string[] = [];
  for (const field of EXHIBIT_EDITABLE_FIELDS) {
    if (JSON.stringify(a[field]) !== JSON.stringify(b[field])) changed.push(field);
  }
  return changed;
}

// --- Snapshot vira (Source) ---------------------------------------------

export const SOURCE_EDITABLE_FIELDS = [
  "nameSi",
  "nameEn",
  "sourceType",
  "license",
  "url",
  "noteSi",
  "noteEn",
  "creator",
  "copyrightHolder",
  "licenseUrl",
  "permissionToPublish",
  "permissionToModify",
  "commercialUse",
  "attribution",
  "restrictions",
] as const;
export type SourceEditableField = (typeof SOURCE_EDITABLE_FIELDS)[number];
export type SourceSnapshot = Record<SourceEditableField, unknown>;

export const sourceSnapshotSchema = z.object({
  nameSi: z.string().min(1).max(500),
  nameEn: z.string().min(1).max(500),
  sourceType: z.enum([
    "arhiv",
    "fotografija",
    "objava",
    "spletni-vir",
    "pricevanje",
    "zemljevid",
  ]),
  license: z.string().min(1).max(200),
  url: z.string().nullable(),
  noteSi: z.string().nullable(),
  noteEn: z.string().nullable(),
  creator: z.string().nullable(),
  copyrightHolder: z.string().nullable(),
  licenseUrl: z.string().nullable(),
  permissionToPublish: z.enum(["GRANTED", "DENIED", "UNKNOWN", "NOT_REQUIRED"]).nullable(),
  permissionToModify: z.enum(["GRANTED", "DENIED", "UNKNOWN", "NOT_REQUIRED"]).nullable(),
  commercialUse: z.enum(["YES", "NO", "UNKNOWN"]).nullable(),
  attribution: z.string().nullable(),
  restrictions: z.string().nullable(),
});

export const sourcePatchSchema = sourceSnapshotSchema.partial().strict();
export type SourcePatch = z.infer<typeof sourcePatchSchema>;

export function snapshotOfSource(source: Record<string, unknown>): SourceSnapshot {
  const snap = {} as SourceSnapshot;
  for (const field of SOURCE_EDITABLE_FIELDS) {
    snap[field] = source[field] ?? null;
  }
  return snap;
}

export function sourceSnapshotDiff(a: SourceSnapshot, b: SourceSnapshot): string[] {
  const changed: string[] = [];
  for (const field of SOURCE_EDITABLE_FIELDS) {
    if (JSON.stringify(a[field]) !== JSON.stringify(b[field])) changed.push(field);
  }
  return changed;
}
