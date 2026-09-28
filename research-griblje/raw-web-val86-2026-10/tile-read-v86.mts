/**
 * Val 86 — PS N83 KOLONSKI TILE-i — VLM branja (x2 različica, primarni 3. glas).
 * tile-read-v86.mts — resumable (skip obstoječih), 2 delavca (deterministična delitev:
 * sodi/lihi indeksi v tiles-manifest-v86.json), 429 backoff 60 s, timeout 180 s.
 *
 * Neodvisnost (vzorec val 80/83/85): prompt vsebuje NIČ iz pass1 (val 82) / pass2 (val 83)
 * / trakov (val 85); shema polj = field-wise podmnožica val 57/82/83/85 + band pravila
 * (row_cut, [angeschnitten], [gestrichen], [rot], [?], ditto = ~) + pravilo glave
 * (naslovi stolpcev se NE transcribirajo kot vrstica).
 *
 * Uporaba:  bun tile-read-v86.mts p058   (ena stran — pilot)
 *           bun tile-read-v86.mts ALL    (vse strani 56–142)
 * Izhod:    vlm-v86/<cell>-T.json + .raw   (T = tile)
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/griblje-museum/research-griblje/raw-web-val86-2026-10";
const OUT = path.join(DIR, "vlm-v86");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(DIR, "tiles-manifest-v86.json"), "utf8")) as {
  tiles: { cell: string; page: number; group: string; band: number; fields: string }[];
};

const COMMON_RULES = `RULES:
- This is a VERTICAL SLICE of a handwritten table (Kurrent script, 1825 Carniola). Only the columns shown are visible. Rows are separated by horizontal lines; a row whose top or bottom is CUT by the image edge: still transcribe the visible fields and set "row_cut": true. A number cut at the edge: transcribe visible digits + "[angeschnitten]".
- Do NOT transcribe the printed/handwritten COLUMN HEADERS as a row. Header text may appear at the top of the first slice — ignore it.
- The owner/parcel name is often written only on the FIRST row of a block and continued below with ditto marks (",,", "de.", dashes). If a row shows a ditto mark, transcribe that field as "~". Do NOT invent values.
- Crossed-out values: transcribe as written and add " [gestrichen]" to the nearest note field. Red ink: add " [rot]". Unclear: best reading + "[?]". Empty cell = "".
- Keep numbers exactly as written (e.g. "1.1348" stays "1.1348").
- Total/Fürtrag/Summa lines: put into "totals" (label + value), NOT into rows.`;

const PROMPT_NAME = `This is a vertical slice of the OWNER half of "Protocol der Grund-Parcellen der Gemeinde Gruble" (1825, handwritten German Kurrent table). The TOP of the image shows the printed column headers; the body starts below them. Visible columns, left to right: "Haus Nro." (house number), "Vor und Zuname." (first+last name), "Stand." (status: Bauer, Söldner, Gärtler, Häusler, Gemeinde...), "Wohnort" (place of residence). Fragments of neighboring columns may be visible at the edges (e.g. crossed-out confessional columns at left, "Kultur Gattung" names at right) — do NOT transcribe them.

${COMMON_RULES}

Return STRICT JSON only (no markdown fences, no commentary):
{"rows": [{"haus_no": "<as written>", "name": "<as written or ~ for ditto>", "stand": "<as written>", "wohnort": "<as written>", "row_cut": <true|false>}],
 "totals": [{"label": "<as written>", "value": "<as written>"}],
 "unclear": ["<row + field>"],
 "observations": "<cross-outs, damage, red notes, anything odd>"}`;

const PROMPT_KULTUR = `This is a vertical slice of the PARCEL half of "Protocol der Grund-Parcellen der Gemeinde Gruble" (1825, handwritten German Kurrent table). The TOP of the image shows the printed column headers — use them to anchor the columns; the body starts below. Visible columns, left to right: "Kultur Gattung" (land use: Acker, Wiese, Hutweide, Wald, Hofraithe, Gartn, Reb...; an entry may span TWO lines — transcribe both lines into one string with "\\n" between them), then the "Flächen Inhalt" block with TWO narrow sub-columns: "N.º Jaethe." (left) and "Quad. Kläfter." (right).

IMPORTANT COLUMN RULES:
- Assign each area number to Jaethe vs Kläfter strictly by which of the two narrow sub-columns it sits in (check the header labels at the top). If it leans between them, put it where it visually leans and append " [col?]".
- A single area value with NOTHING under Jaethe is COMMON in this protocol — the scribe usually writes only Kläfter. Transcribe it exactly where it sits; do not move it to the other column and do not split it.
- Further columns may be visible to the RIGHT of the two sub-columns (Classe, "Reiner jährlich Ertrag", "Capital Werth" — e.g. a value like "7" followed by a dash). NEVER transcribe those values into jaethe/klafter.

${COMMON_RULES}

Return STRICT JSON only (no markdown fences, no commentary):
{"rows": [{"kultur": "<as written, \\n for two-line>", "jaethe": "<as written>", "klafter": "<as written>", "row_cut": <true|false>}],
 "totals": [{"label": "<as written e.g. Ftirtrag/Summa>", "value": "<as written>"}],
 "unclear": ["<row + field>"],
 "observations": "<cross-outs, damage, red notes, anything odd>"}`;

function log(msg: string) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(DIR, "tile-read-v86.log"), line + "\n");
}

function withTimeout<T>(p: Promise<T>, ms: number, tag: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT ${tag} after ${ms}ms`)), ms))]);
}

function parseJSONLoose(content: string): unknown {
  const c = content.trim().replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(c); } catch { /* fallthrough */ }
  const m = content.match(/\{[\s\S]*\}/);
  if (m) return JSON.parse(m[0]);
  throw new Error("no JSON in response");
}

async function readOne(zai: Awaited<ReturnType<typeof ZAI.create>>, tile: { cell: string; group: string }) {
  const tag = `${tile.cell}-T`;
  const outPath = path.join(OUT, `${tag}.json`);
  if (fs.existsSync(outPath)) {
    const prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
    if (!prev.ERROR) { log(`${tag}: skip (že obstaja)`); return; }
  }
  const imgPath = path.join(DIR, "crops-v86", `${tile.cell}-x2.png`);
  if (!fs.existsSync(imgPath)) throw new Error(`manjka izrezek ${imgPath}`);
  const img = fs.readFileSync(imgPath).toString("base64");
  const prompt = tile.group === "kultur" ? PROMPT_KULTUR : PROMPT_NAME;
  for (let t = 1; t <= 25; t++) {
    try {
      const body = {
        messages: [
          { role: "user", content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:image/png;base64,${img}` } },
          ] },
        ],
        thinking: { type: "disabled" },
      };
      const comp = await withTimeout(zai.chat.completions.createVision(body as Parameters<typeof zai.chat.completions.createVision>[0]), 180_000, tag);
      const content = comp.choices[0]?.message?.content ?? "";
      fs.writeFileSync(path.join(OUT, `${tag}.raw`), content);
      fs.writeFileSync(outPath, JSON.stringify(parseJSONLoose(content), null, 1));
      log(`${tag}: OK (try ${t})`);
      await new Promise((r) => setTimeout(r, 3_000));
      return;
    } catch (e) {
      const msg = String((e as Error)?.message ?? e);
      const is429 = msg.includes("429");
      const isTimeout = msg.includes("TIMEOUT");
      log(`${tag} try ${t}: ${is429 ? "429, wait 60s" : isTimeout ? msg.slice(0, 60) : msg.slice(0, 140)}`);
      if (!is429 && !isTimeout && t >= 3) {
        fs.writeFileSync(outPath, JSON.stringify({ ERROR: msg.slice(0, 300), cell: tile.cell }, null, 1));
        log(`${tag}: FAILED permanently`);
        return;
      }
      await new Promise((r) => setTimeout(r, is429 ? 60_000 : isTimeout ? 5_000 : 15_000));
    }
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const arg = process.argv[2] ?? "ALL";
  const groupFilter = process.argv[3]; // opcijsko: "kultur" | "name" (faza K/N)
  let targets = arg === "ALL"
    ? MANIFEST.tiles
    : MANIFEST.tiles.filter((t) => t.page === Number(arg.replace(/^p0*/, "")));
  if (groupFilter) targets = targets.filter((t) => t.group === groupFilter);
  if (!targets.length) throw new Error(`ni tarč za ${arg}${groupFilter ? "/" + groupFilter : ""}`);
  log(`START ${arg}: ${targets.length} tile-ov, 2 delavca`);
  const zai = await ZAI.create();
  const even = targets.filter((_, i) => i % 2 === 0);
  const odd = targets.filter((_, i) => i % 2 === 1);
  const worker = async (queue: typeof targets, wid: number) => {
    for (const t of queue) {
      await readOne(zai, t);
      await new Promise((r) => setTimeout(r, 1_000));
    }
    log(`worker ${wid} DONE`);
  };
  await Promise.all([worker(even, 0), worker(odd, 1)]);
  log(`DONE ${arg} (${targets.length})`);
}

main().catch((e) => { log(`FATAL: ${e}`); process.exit(1); });
