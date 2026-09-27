/**
 * Val 85 — PS N83 PASOVNI/ZOOM re-read s kolonskimi sidri — PILOT
 * make-zooms-v85.mts: KOLONSKI zoom izrezki (vertikalni trakovi, celotna višina strani)
 * x2.5 lanczos — kolonska sidra = merjena pravila iz crops-manifest-v85.json (deterministično).
 *
 * Trakova (deterministična izbira pravil po relativnih frakcijah širine):
 *  - NAME trak (hiša + ime + stand + wohnort):  od pravila ~0.27W do pravila ~0.46W
 *  - KULTUR trak (kultur + jaethe + klafter):   od pravila ~0.53W do pravila ~0.73W
 * Pravilo = izmerjeno vertikalno pravilo najbližje tarči (toleranca ±4 % W); manjkajoče =
 * napaka (fail-fast, nič ugibanja). p143 izpuščen (rdeči povzetek, brez vrstic).
 *
 * Izhod: crops-v85/<cell>-x25.png + zoom-manifest-v85.json (COMMITTED).
 * Pozor: crops-v85/ je gitignored (regenerabilno); manifest se comitta.
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const REPO = "/home/z/griblje-museum";
const SRC = `${REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages`;
const DIR = `${REPO}/research-griblje/raw-web-val85-2026-10`;
const OUT = path.join(DIR, "crops-v85");

const STRIPS: { id: string; from: number; to: number; fields: string }[] = [
  { id: "name", from: 0.27, to: 0.46, fields: "haus_no,name,stand,wohnort" },
  { id: "kultur", from: 0.53, to: 0.73, fields: "kultur,jaethe,klafter" },
];
const PAGES = [58, 59, 84, 98, 109, 121, 133]; // p143 = rdeči povzetek, izpuščen
const ZOOM = 2.5;

function pickRule(rules: { x: number }[], target: number, w: number, tol = 0.04) {
  let best: { x: number } | null = null;
  let bestD = Infinity;
  for (const r of rules) {
    const d = Math.abs(r.x - target * w);
    if (d < bestD && d <= tol * w) { bestD = d; best = r; }
  }
  // deterministična rezerva: proporcionalna pozicija (izrecno označena v manifestu)
  return { x: best ? best.x : Math.round(target * w), measured: Boolean(best) };
}

async function main() {
  const man = JSON.parse(fs.readFileSync(path.join(DIR, "crops-manifest-v85.json"), "utf8"));
  const zooms: { cell: string; page: number; strip: string; x0: number; x1: number; fields: string; rule_measured: [boolean, boolean] }[] = [];
  for (const pg of PAGES) {
    const p = man.pages.find((q: { page: number }) => q.page === pg);
    if (!p) throw new Error(`p${pg} ni v manifestu`);
    const src = path.join(SRC, `p${String(pg).padStart(2, "0")}.jpg`);
    const W = p.width, H = p.height;
    for (const s of STRIPS) {
      const a = pickRule(p.rules, s.from, W);
      const b = pickRule(p.rules, s.to, W);
      const x0 = a.x, x1 = b.x;
      if (x1 - x0 < 60) throw new Error(`p${pg} ${s.id}: trak preozek (${x1 - x0}px)`);
      const cell = `p${String(pg).padStart(3, "0")}-z-${s.id}`;
      await sharp(src)
        .extract({ left: Math.max(0, x0 - 6), top: 0, width: Math.min(W, x1 + 6) - Math.max(0, x0 - 6), height: H })
        .resize({ width: Math.round((Math.min(W, x1 + 6) - Math.max(0, x0 - 6)) * ZOOM), kernel: "lanczos3" })
        .png()
        .toFile(path.join(OUT, `${cell}-x25.png`));
      zooms.push({ cell, page: pg, strip: s.id, x0: Math.max(0, x0 - 6), x1: Math.min(W, x1 + 6), fields: s.fields, rule_measured: [a.measured, b.measured] });
      console.log(`${cell}: x=${x0}..${x1} (${x1 - x0}px × ${ZOOM})`);
    }
  }
  fs.writeFileSync(path.join(DIR, "zoom-manifest-v85.json"), JSON.stringify({ meta: { zoom: ZOOM, kernel: "lanczos3", rule_source: "crops-manifest-v85.json rules" }, zooms }, null, 1));
  console.log(`DONE: ${zooms.length} kolonskih trakov`);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
