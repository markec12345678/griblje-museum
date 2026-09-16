/**
 * Izdelava vizualnih prstnih odtisov zbirke — "Search visually" lite.
 *
 * Vzorec: »Search visually« v Rijksmuseumu (podobni predmeti po
 * vizualni podobnosti iz ML modela). Naša muzejska različica je majhna,
 * razložljiva in brez strežnika: za vsako sliko zapisa izračunamo
 *   1. povprečni hash 8×8 (zgradba slike — svetlo/temno              )
 *   2. barvni podpis 3×3 (povprečna RGB vrednost devetih polj       )
 * Podobnost = 60 % zgradba + 40 % barve, izračunana v brskalniku.
 *
 * Poganja se z: bun scripts/make-visual-fingerprints.ts
 * Izhod: src/lib/visual-fingerprints.json (~69 zapisov, nekaj kB)
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { seedExhibits } from "../src/lib/museum-content";

type Fingerprint = {
  /** Povprečni hash 8×8 — 64 bitov kot niz '0'/'1'. */
  a: string;
  /** Barvni podpis — 27 vrednosti (3×3 polja × RGB, 0–255). */
  c: number[];
  /** Širina/višina izvorne slike (za razhroščevanje). */
  w: number;
  h: number;
};

async function fingerprintImage(
  file: string
): Promise<Fingerprint | null> {
  try {
    const raw = Buffer.from(await readFile(file));
    const meta = await sharp(raw).metadata();
    if (!meta.width || !meta.height) return null;

    // 1) Povprečni hash 8×8: sivo 8×8, bit = pixel > povprečje.
    const gray = await sharp(raw)
      .resize(8, 8, { fit: "fill" })
      .grayscale()
      .raw()
      .toBuffer();
    const mean = gray.reduce((s, v) => s + v, 0) / gray.length;
    let bits = "";
    for (const v of gray) bits += v > mean ? "1" : "0";

    // 2) Barvni podpis 3×3: povprečje RGB na devet polj.
    const rgb = await sharp(raw)
      .resize(9, 9, { fit: "fill", kernel: "cubic" })
      .removeAlpha()
      .raw()
      .toBuffer();
    const c: number[] = [];
    for (let cell = 0; cell < 9; cell++) {
      // 9×9 sliko razdelimo na 3×3 bloke po 3×3 pikslov.
      const cx = (cell % 3) * 3;
      const cy = Math.floor(cell / 3) * 3;
      for (let ch = 0; ch < 3; ch++) {
        let sum = 0;
        for (let y = 0; y < 3; y++) {
          for (let x = 0; x < 3; x++) {
            const px = cx + x;
            const py = cy + y;
            sum += rgb[(py * 9 + px) * 3 + ch];
          }
        }
        c.push(Math.round(sum / 9));
      }
    }

    return { a: bits, c, w: meta.width, h: meta.height };
  } catch (err) {
    console.error(`  ✗ ${path.basename(file)}: ${(err as Error).message}`);
    return null;
  }
}

async function main() {
  const out: Record<string, Fingerprint> = {};
  let missing = 0;

  for (const ex of seedExhibits) {
    if (!ex.image) {
      missing++;
      continue;
    }
    const file = path.join(process.cwd(), "public", ex.image);
    const fp = await fingerprintImage(file);
    if (fp) {
      out[ex.slug] = fp;
      console.log(`✓ ${ex.slug} (${fp.w}×${fp.h})`);
    } else {
      missing++;
    }
  }

  const dest = path.join(process.cwd(), "src/lib/visual-fingerprints.json");
  await writeFile(dest, JSON.stringify(out), "utf-8");
  const kb = (JSON.stringify(out).length / 1024).toFixed(1);
  console.log(
    `\nZapisanih prstnih odtisov: ${Object.keys(out).length} (brez slike: ${missing}) → ${dest} (${kb} kB)`
  );
}

main();
