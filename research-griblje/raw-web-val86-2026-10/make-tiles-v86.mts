/**
 * Val 86 — PS N83 KOLONSKI TILE-i p56–142 (re-read 2. prehod za F-PV-04/F-PV-05/NR-14)
 * make-tiles-v86.mts v2 — KOMPOZITNI tile-i: pasovna višina (h=328, shema val 80/81/85)
 * × kolonska skupina + GLAVA STOLPCEV (header strip) na vsakem tile-u.
 *
 * ZAKONJË DOMEN.val85 pilot: trakovi (celotna višina, Z glavo) rešijo Jaethe↔Kläfter;
 * tile-i brez glave (samo pasovi 1–3) IZGUBIJO sidro stolpcev → enotne vrednosti v
 * prvi vidni številski koloni = napačno Jaethe (pilot val 86: p121 tile 9× only_j vs
 * trak 0× only_k — odločilno: enotne vrednosti sedijo v Kläther, vidno v x4 zoomu glave
 * + Fürtrag »17|266«). Popravek: vsak tile z y0>0 dobi na vrh prilepljen izrez glave
 * (isti x-razpon, y = [top_rule, top_rule+110], izmerjeno po horizontalnih pravilih;
 * fallback 50..160). Pas 0 (y0=0) glavo že vsebuje — brez podvajanja.
 *
 *   tile (name):   x = pravilo ~0.27W .. ~0.46W   (haus_no, name, stand, wohnort)
 *   tile (kultur): x = pravilo ~0.53W .. ~0.73W   (kultur, jaethe, klafter)
 *   x-sidra = algoritem VERBATIM make-bands-v85.mts (detectRules) + GUARD proti
 *   crops-manifest-v85.json na 8 vzorčnih straneh (dokaz identičnega prenosa).
 *
 * Različici: NATIVNO + X2 (lanczos3 ×2; VLM bere X2 — pod pragom API downscale-a).
 * p143 IZPUŠČEN (rdeči povzetek, precedens val 85 faza R).
 *
 * Izhod: crops-v86/<cell>-nat.png + <cell>-x2.png + tiles-manifest-v86.json (COMMITTED).
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const REPO = "/home/z/griblje-museum";
const SRC = `${REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages`;
const DIR = `${REPO}/research-griblje/raw-web-val86-2026-10`;
const MAN85 = `${REPO}/research-griblje/raw-web-val85-2026-10/crops-manifest-v85.json`;
const OUT = path.join(DIR, "crops-v86");

const H_BAND = 328;
const STEP = 298;
const HEADER_H = 110; // glava = [top_rule, top_rule+110] (p58: 49–159, p84: 61–171)
const PAGES: number[] = [];
for (let p = 56; p <= 142; p++) PAGES.push(p); // p143 izpuščen (precedens val 85)
const V85_SAMPLE = [58, 59, 84, 98, 109, 121, 133, 143];

// ---- algoritm VERBATIM make-bands-v85.mts (detectRules — vertikalna pravila) ----
function detectRules(gray: Buffer, w: number, h: number) {
  const col = new Float64Array(w);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) col[x] += gray[row + x];
  }
  for (let x = 0; x < w; x++) col[x] /= h;
  const sm = new Float64Array(w);
  for (let x = 0; x < w; x++) {
    const a = col[Math.max(0, x - 1)], b = col[x], c = col[Math.min(w - 1, x + 1)];
    sm[x] = (a + b + c) / 3;
  }
  const sorted = Array.from(sm).sort((a, b) => a - b);
  const median = sorted[Math.floor(w / 2)];
  const thr = median * 0.82;
  const runs: { x0: number; x1: number; depth: number }[] = [];
  let x = 0;
  while (x < w) {
    if (sm[x] < thr) {
      const x0 = x;
      let minV = sm[x];
      while (x < w && sm[x] < thr) { minV = Math.min(minV, sm[x]); x++; }
      runs.push({ x0, x1: x - 1, depth: median - minV });
    } else x++;
  }
  const rules = runs
    .filter((r) => r.x1 - r.x0 + 1 <= 14)
    .map((r) => ({ x: Math.round((r.x0 + r.x1) / 2), width: r.x1 - r.x0 + 1, depth: Math.round(r.depth * 10) / 10 }));
  let fold_x: number | null = null;
  let best = 0;
  for (const r of rules) {
    if (r.x >= w * 0.4 && r.x <= w * 0.6 && r.depth > best) { best = r.depth; fold_x = r.x; }
  }
  return { rules, fold_x, thr: Math.round(thr * 10) / 10 };
}

// ---- transponirano: horizontalna pravila → lega glave (top_rule) ----
function detectTopRule(gray: Buffer, w: number, h: number): { top_rule: number; detected: boolean } {
  const rowP = new Float64Array(h);
  for (let y = 0; y < h; y++) {
    const off = y * w;
    let s = 0;
    for (let x = 0; x < w; x++) s += gray[off + x];
    rowP[y] = s / w;
  }
  const sm = new Float64Array(h);
  for (let y = 0; y < h; y++) sm[y] = (rowP[Math.max(0, y - 1)] + rowP[y] + rowP[Math.min(h - 1, y + 1)]) / 3;
  const sorted = Array.from(sm).sort((a, b) => a - b);
  const median = sorted[Math.floor(h / 2)];
  const thr = median * 0.82;
  let y = 0;
  while (y < h) {
    if (sm[y] < thr) {
      const y0 = y;
      while (y < h && sm[y] < thr) y++;
      const cy = Math.round((y0 + y - 1) / 2);
      if (cy >= 30 && cy <= 120 && (y - y0) <= 8) return { top_rule: cy, detected: true };
    } else y++;
  }
  return { top_rule: 50, detected: false }; // fallback (izrecno označen)
}

const GROUPS: { id: string; from: number; to: number; fields: string }[] = [
  { id: "name", from: 0.27, to: 0.46, fields: "haus_no,name,stand,wohnort" },
  { id: "kultur", from: 0.53, to: 0.73, fields: "kultur,jaethe,klafter" },
];

function pickRule(rules: { x: number }[], target: number, w: number, tol = 0.04) {
  let best: { x: number } | null = null;
  let bestD = Infinity;
  for (const r of rules) {
    const d = Math.abs(r.x - target * w);
    if (d < bestD && d <= tol * w) { bestD = d; best = r; }
  }
  return { x: best ? best.x : Math.round(target * w), measured: Boolean(best) };
}

async function main() {
  const man85 = JSON.parse(fs.readFileSync(MAN85, "utf8"));
  fs.mkdirSync(OUT, { recursive: true });
  const tiles: {
    cell: string; page: number; group: string; band: number;
    x0: number; x1: number; y0: number; y1: number; clamped: boolean;
    composite_header: boolean; header_zone: [number, number] | null;
    rule_measured: [boolean, boolean]; fields: string;
  }[] = [];
  const headerZones: Record<string, { top_rule: number; detected: boolean }> = {};
  let unmeasured = 0;
  let guardsOk = 0;
  for (const pg of PAGES) {
    const src = path.join(SRC, `p${String(pg).padStart(2, "0")}.jpg`);
    if (!fs.existsSync(src)) throw new Error(`manjka vir ${src}`);
    const meta = await sharp(src).metadata();
    const W = meta.width!, H = meta.height!;
    const bands: { cell: string; y0: number; y1: number; clamped: boolean }[] = [];
    for (let y0 = 0; y0 < H; y0 += STEP) {
      const y1 = Math.min(H, y0 + H_BAND);
      bands.push({ cell: `p${String(pg).padStart(3, "0")}-band${bands.length}`, y0, y1, clamped: y1 < y0 + H_BAND });
    }
    const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
    const det = detectRules(data, info.width, info.height);
    const hz = detectTopRule(data, info.width, info.height);
    headerZones[String(pg)] = hz;
    const ref = man85.pages.find((q: { page: number }) => q.page === pg);
    if (ref) {
      if (JSON.stringify(ref.bands) !== JSON.stringify(bands)) throw new Error(`GUARD p${pg}: pasovna mreža ≠ val 85`);
      if (JSON.stringify(ref.rules) !== JSON.stringify(det.rules)) throw new Error(`GUARD p${pg}: sidra ≠ val 85`);
      if (ref.fold_x !== det.fold_x || ref.thr !== det.thr) throw new Error(`GUARD p${pg}: zvez/prag ≠ val 85`);
      guardsOk++;
    }
    for (const g of GROUPS) {
      const a = pickRule(det.rules, g.from, W);
      const b = pickRule(det.rules, g.to, W);
      const x0 = Math.max(0, a.x - 6), x1 = Math.min(W, b.x + 6);
      if (x1 - x0 < 60) throw new Error(`p${pg} ${g.id}: tile preozek (${x1 - x0}px)`);
      if (!a.measured || !b.measured) unmeasured++;
      for (let bi = 0; bi < bands.length; bi++) {
        const bd = bands[bi];
        const cell = `p${String(pg).padStart(3, "0")}-t-${g.id}${bi}`;
        const top = bd.y0, hgt = bd.y1 - bd.y0;
        const withHeader = top > 0;
        const hy0 = Math.max(0, hz.top_rule), hy1 = Math.min(H, hz.top_rule + HEADER_H);
        const wTile = x1 - x0;
        const body = sharp(src).extract({ left: x0, top, width: wTile, height: hgt });
        if (withHeader) {
          const header = await sharp(src).extract({ left: x0, top: hy0, width: wTile, height: hy1 - hy0 }).toBuffer();
          const comp = sharp({
            create: { width: wTile, height: (hy1 - hy0) + hgt, channels: 3, background: { r: 255, g: 255, b: 255 } },
          }).composite([
            { input: header, top: 0, left: 0 },
            { input: await body.toBuffer(), top: hy1 - hy0, left: 0 },
          ]);
          await comp.clone().png().toFile(path.join(OUT, `${cell}-nat.png`));
          await comp.clone().resize({ width: wTile * 2, kernel: "lanczos3" }).png().toFile(path.join(OUT, `${cell}-x2.png`));
        } else {
          await body.clone().png().toFile(path.join(OUT, `${cell}-nat.png`));
          await body.clone().resize({ width: wTile * 2, kernel: "lanczos3" }).png().toFile(path.join(OUT, `${cell}-x2.png`));
        }
        tiles.push({ cell, page: pg, group: g.id, band: bi, x0, x1, y0: bd.y0, y1: bd.y1, clamped: bd.clamped, composite_header: withHeader, header_zone: withHeader ? [hy0, hy1] : null, rule_measured: [a.measured, b.measured], fields: g.fields });
      }
    }
  }
  // guard tudi za p143 (izpuščeno stran — algoritem se mora vseeno ujemati z val 85)
  const ref143 = man85.pages.find((q: { page: number }) => q.page === 143);
  if (ref143) {
    const src = path.join(SRC, `p143.jpg`);
    const meta = await sharp(src).metadata();
    const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
    const det = detectRules(data, info.width, info.height);
    const bands: unknown[] = [];
    for (let y0 = 0; y0 < meta.height!; y0 += STEP) {
      const y1 = Math.min(meta.height!, y0 + H_BAND);
      bands.push({ cell: `p143-band${bands.length}`, y0, y1, clamped: y1 < y0 + H_BAND });
    }
    if (JSON.stringify(ref143.rules) !== JSON.stringify(det.rules) || JSON.stringify(ref143.bands) !== JSON.stringify(bands))
      throw new Error(`GUARD p143: sidra/mreža ≠ val 85`);
    guardsOk++;
  }
  const manifest = {
    meta: {
      val: 86,
      method: "kompozitni kolonski tile-i: glava stolpcev ([top_rule, top_rule+110], izmerjeno) + pasovna višina h=328 (shema val 80/81/85); nativno + x2 lanczos3; VLM bere x2. Popravek pilotske napake: brez glave tile-i izgubijo sidro Jaethe↔Kläfter (p121: 9× only_j napačno; resnica v Kläther — trakovi val 85 + x4 zoom + Fürtrag 17|266)",
      anchors: "x = detectRules VERBATIM make-bands-v85.mts; glava = prvo horizontalno pravilo v [30,120] (fallback 50, označeno)",
      source_pages: "raw-web-val56-2026-10/n083ps-pages (nativni skeni)",
      pages: `${PAGES[0]}–${PAGES[PAGES.length - 1]} (${PAGES.length}); p143 izpuščen (rdeči povzetek, precedens val 85 faza R)`,
      guard_v85: `sidra + pasovna mreža ujemajo z crops-manifest-v85.json na ${guardsOk}/8 vzorčnih straneh`,
      header_zones: headerZones,
      unmeasured_rule_groups: unmeasured,
      groups: GROUPS,
    },
    tiles,
  };
  fs.writeFileSync(path.join(DIR, "tiles-manifest-v86.json"), JSON.stringify(manifest, null, 1));
  console.log(`DONE: ${tiles.length} tile-ov (${tiles.length / 2} enot nat+x2) na ${PAGES.length} straneh; GUARD v85: ${guardsOk}/8; glava manjkajoče detektirana: ${Object.values(headerZones).filter((h) => !h.detected).length} strani`);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
