/**
 * Val 117 — PT p7 re-adjudikacija areal/lastnik (VLM glasovi ob kvoti):
 * - areal stolpec, 4 bande po 5 vrstic z IZMERJENIMI horizontalnimi pravili (val 117 detekcija)
 * - vsotna vrstica areal
 * - lastnik stolpec (3. glasovi imen), 4 bande po 5 vrstic
 *
 * Vhodi: pt7v117-areal-band1..4.png, pt7v117-areal-vsotna.png, pt7v117-owner-band1..4.png
 * Izhodi: vlm-v117-pt7/<cell>.json + .raw (resumable — obstoječi se ne prepišejo)
 *
 * Uporaba: bun read-pt7-v117.mts
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/griblje-museum/research-griblje/raw-web-val110-2026-09";
const OUT = path.join(DIR, "vlm-v117-pt7");

const AREAL_PROMPT = (from: number, to: number) => `This is a 10x zoom of the AREAL column ("Areal Anzahl des Bodens", two sub-columns: "N n. Ö. Joch" left, "Dez. Klafter" right) for the rows of houses (Haus-Nro) ${from}–${to} in "Protocoll der Bau-Parcellen" (PT, 1825, Carniola, Kurrent). Horizontal table rules are VISIBLE — attribute each value STRICTLY to the row between the rules. Transcribe each row's areal EXACTLY digit by digit; if BOTH sub-columns are empty return ""; if a value is crossed out add " [gestrichen]"; red ink " [rot]"; unclear best reading + " [?]". Note which sub-column (Joch/Klafter) each value is written in.
Return STRICT JSON only: {"rows": [{"row_hint": "${from}..${to}", "areal": "<as written>", "subcol": "joch|klafter"}], "unclear": ["..."], "observations": ""}`;

const OWNER_PROMPT = (from: number, to: number) => `This is a 3x zoom of the OWNER column ("Vor- und Zuname") for the rows of houses (Haus-Nro) ${from}–${to} in "Protocoll der Bau-Parcellen" (PT, 1825, Carniola, Kurrent). Horizontal table rules are VISIBLE — attribute each name STRICTLY to the row between the rules. Transcribe each owner name EXACTLY as written (surname+given name). Ditto marks (") mean same as previous row — transcribe as "\\"". Crossed out: " [gestrichen]". Unclear: best reading + " [?]".
Return STRICT JSON only: {"rows": [{"row_hint": "${from}..${to}", "owner": "<as written>"}], "unclear": ["..."], "observations": ""}`;

const CELLS: { cell: string; file: string; prompt: string }[] = [
  { cell: "p07v117-areal-bp81-85", file: "pt7v117-areal-band1.png", prompt: AREAL_PROMPT(81, 85) },
  { cell: "p07v117-areal-bp86-90", file: "pt7v117-areal-band2.png", prompt: AREAL_PROMPT(86, 90) },
  { cell: "p07v117-areal-bp91-95", file: "pt7v117-areal-band3.png", prompt: AREAL_PROMPT(91, 95) },
  { cell: "p07v117-areal-bp96-100", file: "pt7v117-areal-band4.png", prompt: AREAL_PROMPT(96, 100) },
  {
    cell: "p07v117-areal-vsotna",
    file: "pt7v117-areal-vsotna.png",
    prompt: `This is an 8x zoom of the AREAL column of the SUMMARY row (bottom "vsotna" row, labeled "Fussnot"/"Eintrags.") of "Protocoll der Bau-Parcellen" (PT, 1825, Kurrent). Transcribe the areal value(s) EXACTLY, or "" if empty.
Return STRICT JSON only: {"areal": "<as written or empty>", "unclear": ["..."], "observations": ""}`,
  },
  { cell: "p07v117-owner-bp81-85", file: "pt7v117-owner-band1.png", prompt: OWNER_PROMPT(81, 85) },
  { cell: "p07v117-owner-bp86-90", file: "pt7v117-owner-band2.png", prompt: OWNER_PROMPT(86, 90) },
  { cell: "p07v117-owner-bp91-95", file: "pt7v117-owner-band3.png", prompt: OWNER_PROMPT(91, 95) },
  { cell: "p07v117-owner-bp96-100", file: "pt7v117-owner-band4.png", prompt: OWNER_PROMPT(96, 100) },
];

const COMMON_NOTE =
  "Handwritten German Kurrent, 1825. Do NOT invent values. Rows are separated by visible table rules. Return STRICT JSON only (no markdown fences).";

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
  console.log(`DONE v117-pt7 (glasov: ${n}/${CELLS.length})`);
}

main().catch((e) => {
  console.error("FATAL", e);
  process.exit(1);
});
