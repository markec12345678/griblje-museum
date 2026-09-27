/**
 * Val 85 — PS N83 PASOVNI/ZOOM re-read s kolonskimi sidri — PILOT (vzorec val 80/81)
 * bandread-v85.mts — VLM branja pasov (faza A: norm; faza R: kolonski/zoom izrezki po kolizijah).
 *
 * Neodvisnost (vzorec val 80/83): prompt vsebuje NIČ iz pass1 (val 82) / pass2 (val 83);
 * shema polj = VERBATIM val 57/82/83 (field-wise primerljivo) + band pravila val 81
 * (rezane vrstice = row_cut; [angeschnitten]; [gestrichen]; [rot]; [?]; ditto = ~).
 * Kolonska sidra: prompt NE dobi merjenih x-pozicij (nič ugibanja v prompt); sidra iz
 * crops-manifest-v85.json služijo determinističnemu zlitju + dokumentaciji (poročilo §metoda).
 *
 * Uporaba: bun bandread-v85.mts A   (faza A — 32 pasov, različica norm)
 *          bun bandread-v85.mts R   (faza R — izrezki iz zoom-manifest-v85.json)
 * Izhod: vlm/<cell>-A.json + .raw  oz.  vlm/<cell>-R.json + .raw
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/griblje-museum/research-griblje/raw-web-val85-2026-10";
const OUT = path.join(DIR, "vlm");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(DIR, "crops-manifest-v85.json"), "utf8"));

const PROMPT_BAND = `This is a horizontal BAND cut from a photographed SHEET (double-page spread) of "Protocol der Grund-Parcellen der Gemeinde Gruble" (1825, Carniola, handwritten German Kurrent table). The fold is visible near the middle. LEFT half = owner columns "Des Eigenthümers", RIGHT half = parcel columns "Des Grundstückes". Rows align horizontally across the fold. Lines may be cut off at the top or bottom edge of the band — transcribe only what is visible.

LEFT columns: "Nro. des Blattes" (row number 1..N on this sheet); two very narrow columns (Bemerkung / Nro. der Uebersetzung — often crossed out, usually empty); "Geistliche Eigenth. / Dominical / Rustical" (often crossed out with X); "Haus Nro." (house number); "Vor und Zuname." (owner first+last name); "Stand." (status: Bauer, Söldner, Gärtler, Häusler, Gemeinde, Beck, Wirt...); "Wohnort".

RIGHT columns: "Kultur Gattung" (land use: Acker, Wiese, Hutweide, Wald, Hofraithe, Gartn, Reb...; entries may span TWO lines — transcribe both lines into one string with ", "); "Flächen Inhalt": "N.º Jaethe." + "Quad. Kläfter." (area); "Classe" (tax class, roman I-IV or similar); "Reiner jährlich Ertrag in Mettal Münze": fl + Kr; "Capital Werth nach p.Ct.": fl + Kr; "Anmerkung" (notes — may be red ink).

IMPORTANT RULES:
- Assign each value to its column by horizontal position strictly. If a Flächen value's column (Jaethe vs Kläfter) cannot be decided, put it in the column it visually leans to and append " [col?]" to that value.
- A row whose top or bottom is cut by the band edge: still transcribe the visible fields and set "row_cut": true. A number cut at the edge: transcribe visible digits + "[angeschnitten]".
- The owner name is often written only on the FIRST row of a block and continued below with ditto marks (",,", "de.", dashes). If a row shows a ditto mark, transcribe name as "~". Do NOT invent the name.
- Crossed-out rows/values: transcribe as written and add " [gestrichen]" to anmerkung. Red ink notes: add " [rot]". Unclear word: best reading + "[?]". Empty cell = "".
- Keep numbers exactly as written (e.g. "1.1348" stays "1.1348"). "Nro. des Blattes" missing on a visible row = null.
- Total/Fürtrag/Summa lines visible in the band: put into "totals" (label + value), NOT into rows.
- The sheet number printed top-right (like "6. N.") goes to "sheet_visible" (string, or null).

Return STRICT JSON only (no markdown fences, no commentary):
{"sheet_visible": <string|null>,
 "rows": [{"no_blatt": <int|null>, "haus_no": "<as written>", "name": "<as written or ~ for ditto>", "stand": "<as written>", "wohnort": "<as written>", "kultur": "<as written>", "jaethe": "<as written>", "klafter": "<as written>", "classe": "<as written>", "ertrag_fl": "<>", "ertrag_kr": "<>", "capital_fl": "<>", "capital_kr": "<>", "anmerkung": "<as written>", "row_cut": <true|false>}],
 "totals": [{"label": "<as written e.g. Ftirtrag/Summa>", "value": "<as written>"}],
 "unclear": ["<row + field>"],
 "observations": "<cross-outs, damage, continuation, red notes, anything odd>"}`;

function log(msg: string) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(DIR, "bandread-v85.log"), line + "\n");
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

async function readOne(zai: Awaited<ReturnType<typeof ZAI.create>>, cellId: string, tag: string) {
  const outPath = path.join(OUT, `${tag}.json`);
  if (fs.existsSync(outPath)) {
    const prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
    if (!prev.ERROR) { log(`${tag}: skip (že obstaja)`); return; }
  }
  const imgPath = path.join(DIR, "crops-v85", `${cellId}.png`);
  if (!fs.existsSync(imgPath)) throw new Error(`manjka izrezek ${imgPath}`);
  const img = fs.readFileSync(imgPath).toString("base64");
  for (let t = 1; t <= 25; t++) {
    try {
      const body = {
        messages: [
          { role: "user", content: [
            { type: "text", text: PROMPT_BAND },
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
        fs.writeFileSync(outPath, JSON.stringify({ ERROR: msg.slice(0, 300), cell: cellId }, null, 1));
        log(`${tag}: FAILED permanently`);
        return;
      }
      await new Promise((r) => setTimeout(r, is429 ? 60_000 : isTimeout ? 5_000 : 15_000));
    }
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const mode = process.argv[2] ?? "A";
  const zai = await ZAI.create();
  if (mode === "R") {
    const zmPath = path.join(DIR, "zoom-manifest-v85.json");
    if (!fs.existsSync(zmPath)) throw new Error("manjka zoom-manifest-v85.json (najprej zgraditi izrezke)");
    const zm = JSON.parse(fs.readFileSync(zmPath, "utf8"));
    for (const z of zm.zooms) await readOne(zai, `${z.cell}-x25`, `${z.cell}-R`);
    log("DONE R");
  } else {
    const cells: string[] = [];
    for (const p of MANIFEST.pages) for (const b of p.bands) cells.push(`${b.cell}-norm`);
    for (const cell of cells) await readOne(zai, cell.replace(/-norm$/, "-norm"), `${cell.replace(/-norm$/, "")}-A`);
    log("DONE A");
  }
}

main().catch((e) => { log(`FATAL: ${e}`); process.exit(1); });
