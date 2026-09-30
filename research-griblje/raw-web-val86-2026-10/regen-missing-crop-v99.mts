/**
 * V86-fix — regeneracija POSAMEZNEGA izrezka iz manifestnih koordinat.
 * Razlog: crops-v86/ je bil po uspešnem branju počiščen; p142-t-kultur2 je edini
 * tile brez VLM odgovora, zato mu je treba izrezek regenerirati za v98 bralnik.
 * Parametri 1:1 iz tiles-manifest-v86.json (deterministično — isti sharp/lanczos3
 * kot make-tiles-v86.mts, ista koordinata in isti kompozit glave).
 * ZAŠČITA: generira IZKLJUČNO manjkajoči tile, ne pokaže obstoječih VLM odgovorov.
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const REPO = "/home/z/griblje-museum";
const SRC = `${REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages`;
const DIR = `${REPO}/research-griblje/raw-web-val86-2026-10`;
const OUT = path.join(DIR, "crops-v86");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(DIR, "tiles-manifest-v86.json"), "utf8")) as {
  tiles: {
    cell: string; page: number; group: string; band: number;
    x0: number; x1: number; y0: number; y1: number;
    composite_header: boolean; header_zone: [number, number] | null;
  }[];
};

async function main() {
  const missing = MANIFEST.tiles.filter((t) => !fs.existsSync(path.join(DIR, "vlm-v86", `${t.cell}-T.json`)));
  console.log(`manjkajočih tile-ov: ${missing.length}`);
  fs.mkdirSync(OUT, { recursive: true });
  for (const t of missing) {
    const src = path.join(SRC, `p${String(t.page).padStart(2, "0")}.jpg`);
    if (!fs.existsSync(src)) throw new Error(`manjka vir ${src}`);
    const x0 = t.x0, x1 = t.x1, y0 = t.y0, y1 = t.y1;
    const wTile = x1 - x0, hgt = y1 - y0;
    let finalBuf: Buffer;
    if (t.composite_header && t.header_zone) {
      const [hy0, hy1] = t.header_zone;
      const header = await sharp(src).extract({ left: x0, top: hy0, width: wTile, height: hy1 - hy0 }).toBuffer();
      const body = await sharp(src).extract({ left: x0, top: y0, width: wTile, height: hgt }).toBuffer();
      finalBuf = await sharp({
        create: { width: wTile, height: (hy1 - hy0) + hgt, channels: 3, background: { r: 255, g: 255, b: 255 } },
      }).composite([
        { input: header, top: 0, left: 0 },
        { input: body, top: hy1 - hy0, left: 0 },
      ]).png().toBuffer();
    } else {
      finalBuf = await sharp(src).extract({ left: x0, top: y0, width: wTile, height: hgt }).png().toBuffer();
    }
    const nat = path.join(OUT, `${t.cell}-nat.png`);
    const x2 = path.join(OUT, `${t.cell}-x2.png`);
    fs.writeFileSync(nat, finalBuf);
    await sharp(finalBuf).resize({ width: wTile * 2, kernel: "lanczos3" }).png().toFile(x2);
    console.log(`regeneriran: ${t.cell} (nat ${wTile}×${(t.composite_header ? (t.header_zone![1] - t.header_zone![0]) : 0) + hgt}px, x2 ${wTile * 2}px)`);
  }
  const still = MANIFEST.tiles.filter((t) => !fs.existsSync(path.join(DIR, "vlm-v86", `${t.cell}-T.json`)));
  console.log(`ostalo še vedno brez odgovora: ${still.length}`);
}
main().catch((e) => { console.error("FATAL", e); process.exit(1); });
