/**
 * Val 57 — PS N83 (Protocol der Grund-Parcellen der Gemeinde Gruble, 1825)
 * Popolna transkripcija: 143 strani (razprtja: lastniški + parcelni blok),
 * VLM branje, resume, 429 backoff, per-call timeout.
 * Izhod: research-griblje/raw-web-val57-2026-10/ps-vlm/pNNN.json
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const SRC = "/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages";
const OUT = "/home/z/griblje-museum/research-griblje/raw-web-val57-2026-10/ps-vlm";
const LOG = path.join(OUT, "transcribe.log");
const TOTAL = 143;

const PROMPT = `This is one photographed SHEET (double-page spread) of "Protocol der Grund-Parcellen der Gemeinde Gruble" (1825, Carniola, handwritten German Kurrent table). The fold is visible in the middle. LEFT half = owner columns "Des Eigenthümers", RIGHT half = parcel columns "Des Grundstückes". Rows align horizontally across the fold.

LEFT columns: "Nro. des Blattes" (row number 1..N on this sheet); two very narrow columns (Bemerkung / Nro. der Uebersetzung — often crossed out, usually empty); "Geistliche Eigenth. / Dominical / Rustical" (often crossed out with X); "Haus Nro." (house number); "Vor und Zuname." (owner first+last name); "Stand." (status: Bauer, Söldner, Gärtler, Häusler, Gemeinde, Beck, Wirt...); "Wohnort".

RIGHT columns: "Kultur Gattung" (land use: Acker, Wiese, Hutweide, Wald, Hofraithe, Gartn, Reb...); "Flächen Inhalt": "N.º Jaethe." + "Quad. Kläfter." (area); "Classe" (tax class, roman I-IV or similar); "Reiner jährlich Ertrag in Mettal Münze": fl + Kr; "Capital Werth nach p.Ct.": fl + Kr; "Anmerkung" (notes — may be red ink).

IMPORTANT RULES:
- The owner name is often written only on the FIRST row of a block and continued below with ditto marks (durchgestrichene Striche, "de.", ",," , dashes). If a row shows a ditto mark, transcribe name as "~" (ditto of the row above) — do NOT invent the name.
- Crossed-out rows: still transcribe, prefix the whole row's fields stay as written and add " [gestrichen]" to anmerkung.
- Red ink notes: include in anmerkung with " [rot]" marker.
- Unclear word: transcribe best reading + "[?]" (e.g. "Grabil[?]"). Never invent.
- Empty cell = "". Keep numbers exactly as written (e.g. "1.1348" stays "1.1348").
- "Nro. des Blattes" missing on a visible row = write null in no_blatt.
- The sheet number printed top-right (like "6. N.") goes to "sheet_visible" (string, or null).

Return STRICT JSON only (no markdown fences, no commentary):
{"sheet_visible": <string|null>,
 "rows": [{"no_blatt": <int|null>, "haus_no": "<as written>", "name": "<as written or ~ for ditto>", "stand": "<as written>", "wohnort": "<as written>", "kultur": "<as written>", "jaethe": "<as written>", "klafter": "<as written>", "classe": "<as written>", "ertrag_fl": "<>", "ertrag_kr": "<>", "capital_fl": "<>", "capital_kr": "<>", "anmerkung": "<as written>"}],
 "totals": [{"label": "<as written e.g. Ftirtrag/Summa>", "value": "<as written>"}],
 "unclear": ["<row + field>"],
 "observations": "<cross-outs, damage, continuation, red notes, anything odd>"}`;

function log(msg: string) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG, line + "\n");
}

function withTimeout<T>(p: Promise<T>, ms: number, tag: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT ${tag} after ${ms}ms`)), ms)),
  ]);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const zai = await ZAI.create();
  let done = 0;
  for (let pg = 1; pg <= TOTAL; pg++) {
    const id = String(pg).padStart(3, "0");
    const outPath = path.join(OUT, `p${id}.json`);
    if (fs.existsSync(outPath)) {
      const prev = JSON.parse(fs.readFileSync(outPath, "utf8"));
      if (!prev.ERROR) done++;
      continue;
    }
    const img = fs.readFileSync(path.join(SRC, `p${String(pg).padStart(2, "0")}.jpg`)).toString("base64");
    let ok = false;
    for (let tryN = 1; tryN <= 25 && !ok; tryN++) {
      try {
        const body = {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: PROMPT },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${img}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        };
        const call = zai.chat.completions.createVision(
          body as Parameters<typeof zai.chat.completions.createVision>[0]
        );
        const completion = await withTimeout(call, 180_000, `p${id}`);
        let content = completion.choices[0]?.message?.content ?? "";
        content = content.trim().replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch {
          const m = content.match(/\{[\s\S]*\}/);
          if (m) parsed = JSON.parse(m[0]);
          else throw new Error("no JSON in response");
        }
        fs.writeFileSync(outPath, JSON.stringify(parsed, null, 1));
        done++;
        ok = true;
        log(`p${id}: OK (try ${tryN}) — ${done}/${TOTAL}`);
      } catch (e: unknown) {
        const msg = String((e as Error)?.message ?? e);
        const is429 = msg.includes("429");
        const isTimeout = msg.includes("TIMEOUT");
        log(`p${id} try ${tryN}: ${is429 ? "429, wait 60s" : isTimeout ? msg.slice(0, 60) : msg.slice(0, 140)}`);
        if (!is429 && !isTimeout && tryN >= 3) {
          fs.writeFileSync(outPath, JSON.stringify({ ERROR: msg.slice(0, 300), page: pg }, null, 1));
          log(`p${id}: FAILED permanently`);
          break;
        }
        await new Promise((r) => setTimeout(r, is429 ? 60_000 : isTimeout ? 5_000 : 15_000));
      }
    }
  }
  log(`DONE: ${done}/${TOTAL} pages`);
}

main().catch((e) => {
  log(`FATAL: ${e}`);
  process.exit(1);
});
