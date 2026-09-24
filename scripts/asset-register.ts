/**
 * REGISTRACIJA DIGITALNE VSEBINE (issue #27/B).
 *
 *   bun scripts/asset-register.ts --file <pot> --kind fotografija \
 *     --license "CC BY-SA 4.0" --copyright-holder "Muzej vasi Griblje" \
 *     [--exhibit <slug>] [--creator "ime"] [--attribution "besedilo"] \
 *     [--origin "izvor"] [--mime image/jpeg] [--width 1600 --height 1200] \
 *     [--access-level PUBLIC|RESTRICTED|INTERNAL] \
 *     [--derived-from <assetId|storageKey>] [--storage-prefix assets/]
 *
 * Skripta izračuna SHA-256 vsebine (identiteta bitov) in vpise zapis v
 * register. Binarna vsebina se NE prenese sem — upravljanje objekta v
 * hranilniku (S3/R2/disk) je ločen operativni korak; vpisani storageKey
 * po dogovoru `assets/<sha256>/<ime datoteke>` (deduplikacija po vsebini).
 *
 * Zamenjava obstoječega asseta (zgodovina ostane, #27/B):
 *   bun scripts/asset-register.ts --file <novi> --replaces <assetId> …
 * → staremu zapisu nastavi preservationStatus=REPLACED + replacedById.
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export {};

const REPO_ROOT = path.resolve(import.meta.dir, "..");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function requireArg(name: string): string {
  const v = arg(name);
  if (!v) {
    console.error(`✗ Manjka obvezen argument --${name}`);
    process.exit(1);
  }
  return v;
}

process.env.DATABASE_URL =
  process.env.DIRECT_URL ??
  (() => {
    const envFile = fs.readFileSync(path.join(REPO_ROOT, ".env"), "utf8");
    return envFile.match(/^DIRECT_URL="?([^"\n]+)"?/m)?.[1] ?? process.env.DATABASE_URL;
  })();

const { db } = await import("../src/lib/db");

/* --- vhod ------------------------------------------------------------------ */

const fileArg = requireArg("file");
const filePath = path.resolve(REPO_ROOT, fileArg);
if (!fs.existsSync(filePath)) {
  console.error(`✗ Datoteka ne obstaja: ${filePath}`);
  process.exit(1);
}
const bytes = fs.statSync(filePath).size;
const sha256 = createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const filename = path.basename(filePath);
const kind = requireArg("kind");
const license = requireArg("license");
const copyrightHolder = requireArg("copyright-holder");
const mime = arg("mime") ?? guessMime(filename);
const accessLevel = arg("access-level") ?? "PUBLIC";
const storagePrefix = arg("storage-prefix") ?? "assets/";
const derivedFrom = arg("derived-from");
const replaces = arg("replaces");
const exhibitSlug = arg("exhibit");
const validKinds = ["fotografija", "sken", "pdf", "audio", "video", "glb", "usdz", "iiif-derivative", "thumbnail"];
if (!validKinds.includes(kind)) {
  console.error(`✗ Neznan --kind (${validKinds.join(", ")})`);
  process.exit(1);
}
if (!["PUBLIC", "RESTRICTED", "INTERNAL"].includes(accessLevel)) {
  console.error("✗ --access-level mora biti PUBLIC | RESTRICTED | INTERNAL");
  process.exit(1);
}

function guessMime(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
    ".webp": "image/webp", ".gif": "image/gif", ".pdf": "application/pdf",
    ".mp3": "audio/mpeg", ".wav": "audio/wav", ".mp4": "video/mp4",
    ".glb": "model/gltf-binary", ".usdz": "model/vnd.usdz+zip",
  };
  return map[ext] ?? "application/octet-stream";
}

/* --- vezave ---------------------------------------------------------------- */

let exhibitId: string | undefined;
if (exhibitSlug) {
  const ex = await db.exhibit.findUnique({ where: { slug: exhibitSlug }, select: { id: true } });
  if (!ex) {
    console.error(`✗ Neznan zapis (slug): ${exhibitSlug}`);
    process.exit(1);
  }
  exhibitId = ex.id;
}

let derivedFromId: string | undefined;
if (derivedFrom) {
  const parent = await db.digitalAsset.findFirst({
    where: { OR: [{ id: derivedFrom }, { storageKey: derivedFrom }] },
    select: { id: true },
  });
  if (!parent) {
    console.error(`✗ Neznan izvorni asset (--derived-from): ${derivedFrom}`);
    process.exit(1);
  }
  derivedFromId = parent.id;
}

/* --- vpis ------------------------------------------------------------------- */

const storageKey = `${storagePrefix}${sha256}/${filename}`;
const created = await db.digitalAsset.create({
  data: {
    storageKey,
    mime,
    originalFilename: filename,
    bytes,
    width: arg("width") ? Number(arg("width")) : null,
    height: arg("height") ? Number(arg("height")) : null,
    sha256,
    creator: arg("creator") ?? null,
    copyrightHolder,
    license,
    licenseUrl: arg("license-url") ?? null,
    attribution: arg("attribution") ?? null,
    origin: arg("origin") ?? null,
    kind,
    accessLevel,
    exhibitId,
    derivedFromId,
  },
});

/* --- zamenjava (zgodovina ostane) ------------------------------------------- */

if (replaces) {
  const old = await db.digitalAsset.findFirst({
    where: { OR: [{ id: replaces }, { storageKey: replaces }] },
    select: { id: true },
  });
  if (!old) {
    console.error(`✗ --replaces: asset ni najden (${replaces}); vpisani je bil nov zapis.`);
  } else {
    await db.digitalAsset.update({
      where: { id: old.id },
      data: { preservationStatus: "REPLACED", replacedById: created.id },
    });
    console.log(`  ↺ prejšnji ${old.id} → REPLACED (zgodovina ohranjena)`);
  }
}

console.log("✓ Asset vpisan v register:");
console.log(`  id:          ${created.id}`);
console.log(`  storageKey:  ${created.storageKey}`);
console.log(`  kind/mime:   ${created.kind} / ${created.mime}`);
console.log(`  bytes:       ${created.bytes} · SHA-256 ${sha256.slice(0, 16)}…`);
console.log(`  access:      ${created.accessLevel} · status ${created.preservationStatus}`);

await db.$disconnect();
