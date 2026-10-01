/**
 * Val 116 — PT p7 3. glasovi (VLM ob kvoti): bp 96/97/98 (REVIEW vrstice) + areal/gattung
 * osnova za re-adjudikacijo (izključitev val110-areal-owner).
 *
 * Vhodi: pripravljeni izrezki raw-web-val110-2026-09/pt7-*.png
 * Izhodi: vlm-v116/<cell>.json + .raw (resumable — obstoječi odgovori se ne prepišejo)
 *
 * Uporaba: bun read-pt7-v116.mts   (en prehod čez manjkajoče)
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/griblje-museum/research-griblje/raw-web-val110-2026-09";
const OUT = path.join(DIR, "vlm-v116");

const CELLS: { cell: string; file: string; prompt: string }[] = [
  {
    cell: "p07-bp96-nro-8x",
    file: "pt7-bp96-no-8x.png",
    prompt: `This is an 8x zoom of the "Nro" (Nro. Conscriptionis) column region of a row in "Protocoll der Grund-Parcellen" (PT, 1825, Carniola, Kurrent). Transcribe EXACTLY what is written in the house-number cell(s) visible, digit by digit. If the cell is EMPTY, return "". Red ink: add " [rot]". Crossed out: " [gestrichen]".
Return STRICT JSON only: {"nro_value": "<as written or empty>", "unclear": ["..."], "observations": "<anything odd>"}`,
  },
  {
    cell: "p07-bp97-nro-4x",
    file: "pt7-bp97-no-4x.png",
    prompt: `This is a 4x zoom of the "Nro" (Nro. Conscriptionis) column region of a row in "Protocoll der Grund-Parcellen" (PT, 1825, Carniola, Kurrent). Transcribe EXACTLY what is written in the house-number cell(s) visible, digit by digit. If the cell is EMPTY, return "". Red ink: add " [rot]". Crossed out: " [gestrichen]".
Return STRICT JSON only: {"nro_value": "<as written or empty>", "unclear": ["..."], "observations": "<anything odd>"}`,
  },
  {
    cell: "p07-bp98-nro-4x",
    file: "pt7-bp98-no-4x.png",
    prompt: `This is a 4x zoom of the "Nro" (Nro. Conscriptionis) column region of a row in "Protocoll der Grund-Parcellen" (PT, 1825, Carniola, Kurrent) — the row of the local Zollamt (customs office). Transcribe EXACTLY what is written in the house-number cell(s) visible, digit by digit. If the cell is EMPTY, return "". Red ink: add " [rot]". Crossed out: " [gestrichen]".
Return STRICT JSON only: {"nro_value": "<as written or empty>", "unclear": ["..."], "observations": "<anything odd>"}`,
  },
  {
    cell: "p07-desno-98-100-3x",
    file: "pt7-right98-100-3x.png",
    prompt: `This is a 3x crop of the RIGHT part of the last three rows (98, 99, 100) of "Protocoll der Grund-Parcellen" (PT, 1825, Carniola, Kurrent). Visible columns may include Nro, Kultur-Gattung label, Areal (Joch/Klafter), Anmerkung. Transcribe each row's visible fields exactly. Ditto marks: "~". Empty: "". Red ink " [rot]", crossed " [gestrichen]", unclear best reading + " [?]".
Return STRICT JSON only: {"rows": [{"row_hint": "98|99|100", "nro": "", "gattung": "", "areal": "", "annotation": ""}], "totals": [{"label": "", "value": ""}], "unclear": ["..."], "observations": ""}`,
  },
  {
    cell: "p07-areals-1-5-10x",
    file: "pt7-areals-1-5-10x.png",
    prompt: `This is a 10x zoom of the AREAL column (Nem. Ö. Joch and Dez. Klafter sub-values) for rows 1–5 of PT page 7 (Protocoll der Grund-Parcellen, 1825, Carniola, Kurrent). Transcribe each row's areal EXACTLY digit by digit, keeping Joch and Klafter separate. Format per row: "J | K" (Joch number, Klafter number). Fractions as written (e.g. "1 1/2"). Empty: "". Red " [rot]", crossed " [gestrichen]", unclear + " [?]".
Return STRICT JSON only: {"rows": [{"row_hint": "1..5", "areal": "<J | K>"}], "unclear": ["..."], "observations": ""}`,
  },
  {
    cell: "p07-labels-1-5-12x",
    file: "pt7-labels-1-5-12x.png",
    prompt: `This is a 12x zoom of the Kultur-Gattung LABEL column for rows 1–5 of PT page 7 (Protocoll der Grund-Parcellen, 1825, Carniola, Kurrent). Transcribe each row's land-use label exactly as written (e.g. Acker, Wiese, Hutweide, Wald, Hofraithe, Gartn...). Ditto marks: "~". Empty: "". Unclear: best reading + " [?]".
Return STRICT JSON only: {"rows": [{"row_hint": "1..5", "gattung": ""}], "unclear": ["..."], "observations": ""}`,
  },
];

const COMMON_NOTE = "Handwritten German Kurrent, 1825. Do NOT invent values. Return STRICT JSON only (no markdown fences).";

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const zai = await ZAI.create();
  for (const c of CELLS) {
    const outJson = path.join(OUT, `${c.cell}.json`);
    if (fs.existsSync(outJson)) {
      console.log(`${c.cell}: že obstaja — preskočeno`);
      continue;
    }
    const img = path.join(DIR, c.file);
    if (!fs.existsSync(img)) {
      console.error(`${c.cell}: manjka ${c.file}`);
      continue;
    }
    const b64 = fs.readFileSync(img).toString("base64");
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await zai.chat.completions.createVision({
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: `${c.prompt}\n\n${COMMON_NOTE}` },
                { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        });
        const raw = res.choices[0]?.message?.content ?? "";
        fs.writeFileSync(path.join(OUT, `${c.cell}.raw`), raw);
        const clean = raw.replace(/```json|```/g, "").trim();
        JSON.parse(clean.startsWith("{") ? clean : clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
        fs.writeFileSync(outJson, clean);
        console.log(`${c.cell}: OK (try ${attempt})`);
        ok = true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`${c.cell} try ${attempt}: ${msg.slice(0, 140)}`);
        if (String(msg).includes("429")) {
          console.log("KVOTA 429 — prekinjam (resumable)");
          process.exit(2);
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
    await new Promise((r) => setTimeout(r, 700));
  }
  const n = fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).length;
  console.log(`DONE v116 (glasov: ${n}/${CELLS.length})`);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
