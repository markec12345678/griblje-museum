/**
 * Val 85 — PS N83 PASOVNI/ZOOM re-read s kolonskimi sidri — PILOT (vzorec val 80/81)
 * make-bands-v85.mts: pasovi + kolonska sidra (deterministično, nativni piksli).
 *
 * Vzorec strani (determinističen, iz comittanega reread-v83/comparison.json):
 *   kvantili full_agree/rows1 po straneh (0/25/50/75/100) + p98 (F-PV-03 Reb)
 *   + p121 (QKlft anomalija J=1725) + p59 (najslabše ime soglasje pass1↔pass2)
 *   = [58, 59, 84, 98, 109, 121, 133, 143]
 *
 * Pasovna shema = VERBATIM val 80/81: h=328, korak=298 (30 px preklop), nativni piksli.
 * PS strani so pokrajinske (~1274×1024) → 4 pasovi/stran (PZ je imela 8; shema enaka,
 * obseg pasov se izpelje iz višine strani — deterministično).
 * Različici: raw (nativni piksli) + norm (nativni piksli + normalizacija kontrasta, sharp normalise).
 *
 * Kolonska sidra: profi temnosti po stolpcih (greyscale raw) → detekcija vertikalnih
 * pravil (lokalne temne minime) + zvez (prelom) blizu W/2. Sidra = MERJENE pozicije,
 * nič ugibanja; semantična dodelitev stolpcev se dokumentira posebej (poročilo val 85).
 *
 * Izhod: crops-v85/<cell>-{raw,norm}.png + crops-manifest-v85.json (pasovi + sidra).
 * Pasovi so regenerabilni (gitignored, precedens val 56/61); manifest + sidra se comittajo.
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const REPO = "/home/z/griblje-museum";
const SRC = `${REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages`;
const DIR = `${REPO}/research-griblje/raw-web-val85-2026-10`;
const OUT = path.join(DIR, "crops-v85");

const H_BAND = 328; // pasovna shema val 80/81
const STEP = 298; // 30 px preklop
const SAMPLE = [58, 59, 84, 98, 109, 121, 133, 143];

function detectRules(gray: Buffer, w: number, h: number) {
  // profi temnosti po stolpcih (0..255; nižje = temneje)
  const col = new Float64Array(w);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) col[x] += gray[row + x];
  }
  for (let x = 0; x < w; x++) col[x] /= h;
  // zgladitev (okno 3)
  const sm = new Float64Array(w);
  for (let x = 0; x < w; x++) {
    const a = col[Math.max(0, x - 1)], b = col[x], c = col[Math.min(w - 1, x + 1)];
    sm[x] = (a + b + c) / 3;
  }
  // prag: mediana × 0.82 (papir svetel; pravila + gosta rokopis temnejša)
  const sorted = Array.from(sm).sort((a, b) => a - b);
  const median = sorted[Math.floor(w / 2)];
  const thr = median * 0.82;
  // zaporedja temnih stolpcev
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
  // pravila = ozka zaporedja (1..14 px); širša = blok rokopisa (ne pravilo)
  const rules = runs
    .filter((r) => r.x1 - r.x0 + 1 <= 14)
    .map((r) => ({ x: Math.round((r.x0 + r.x1) / 2), width: r.x1 - r.x0 + 1, depth: Math.round(r.depth * 10) / 10 }));
  // zvez: najmočnejše pravilo v pasu W*0.40..W*0.60
  let fold_x: number | null = null;
  let best = 0;
  for (const r of rules) {
    if (r.x >= w * 0.4 && r.x <= w * 0.6 && r.depth > best) { best = r.depth; fold_x = r.x; }
  }
  return { rules, fold_x, thr: Math.round(thr * 10) / 10 };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const manifest: {
    meta: Record<string, unknown>;
    pages: { page: number; src: string; width: number; height: number; bands: { cell: string; y0: number; y1: number; clamped: boolean }[]; rules: { x: number; width: number; depth: number }[]; fold_x: number | null; thr: number }[];
  } = { meta: { schema: "val85-band-pilot", h_band: H_BAND, step: STEP, overlap: H_BAND - STEP, sample_rule: "kvantili full_agree/rows1 (reread-v83/comparison.json) 0/25/50/75/100 + p98 + p121 + p59", sample: SAMPLE }, pages: [] };

  for (const pg of SAMPLE) {
    const src = path.join(SRC, `p${String(pg).padStart(2, "0")}.jpg`);
    if (!fs.existsSync(src)) throw new Error(`manjka ${src}`);
    const meta = await sharp(src).metadata();
    const W = meta.width!, H = meta.height!;
    const bands: { cell: string; y0: number; y1: number; clamped: boolean }[] = [];
    for (let y0 = 0; y0 < H; y0 += STEP) {
      const y1 = Math.min(H, y0 + H_BAND);
      const k = bands.length;
      const cell = `p${String(pg).padStart(3, "0")}-band${k}`;
      bands.push({ cell, y0, y1, clamped: y1 < y0 + H_BAND });
      for (const v of ["raw", "norm"] as const) {
        let img = sharp(src).extract({ left: 0, top: y0, width: W, height: y1 - y0 });
        if (v === "norm") img = img.normalise();
        await img.png().toFile(path.join(OUT, `${cell}-${v}.png`));
      }
    }
    const { data, info } = await sharp(src).greyscale().raw().toBuffer({ resolveWithObject: true });
    const { rules, fold_x, thr } = detectRules(data, info.width, info.height);
    manifest.pages.push({ page: pg, src: `n083ps-pages/p${String(pg).padStart(2, "0")}.jpg`, width: W, height: H, bands, rules, fold_x, thr });
    console.log(`p${pg}: ${W}x${H}, ${bands.length} pasov, ${rules.length} pravil, zvez x=${fold_x}`);
  }
  fs.writeFileSync(path.join(DIR, "crops-manifest-v85.json"), JSON.stringify(manifest, null, 1));
  const total = manifest.pages.reduce((s, p) => s + p.bands.length, 0);
  console.log(`DONE: ${total} pasov × 2 različici (raw+norm)`);
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
