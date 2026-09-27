/**
 * Val 81 — PZ N83 p43–47 celotni vrstični prepis: band-metoda @nativno
 * 40 pasov (5 strani × 8 pasov; shema val 80: h=328, korak=298, 30px preklop)
 * Prehod A = norm (nativni piksli + autocontrast, berljivost; brez interpolacije)
 * Re-read (drugi prehod, ročno sprožen po A): raw + x3 za dvomljive pasove — isti prompt
 * Surovi izpisi: vlm/<band>-A.json + .raw (+ <band>-R{raw,x3} za re-read)
 * Neodvisnost: direkten odtis avtorja (Read, pred VLM) + VLM prehod A; brez cross-kontaminacije
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/my-project/griblje-museum/research-griblje/raw-web-val81-2026-09";
const OUT = path.join(DIR, "vlm");

// Re-read (prehod R): dvomljive regije iz kolizije direkten odtis ↔ prehod A
// x3 lanczos (berljivost, standard val 80); prompt enak — neodvisen 3. glas
const REREAD: { id: string; variants: string[] }[] = [
  { id: "p43-z-ertrag12", variants: ["x3"] },
  { id: "p43-z-ertrag89", variants: ["x3"] },
  { id: "p43-z-kurse-a", variants: ["x3"] },
  { id: "p43-z-kurse-b", variants: ["x3"] },
  { id: "p43-z-duengung", variants: ["x3"] },
  { id: "p44-z-ertrag1", variants: ["x3"] },
  { id: "p45-z-ertrag1", variants: ["x3"] },
  { id: "p45-z-ertrag67", variants: ["x3"] },
  { id: "p46-z-wiesen1", variants: ["x3"] },
  { id: "p46-z-wiesen2", variants: ["x3"] },
  { id: "p46-z-weing", variants: ["x3"] },
  { id: "p46-z-hutw", variants: ["x3"] },
  { id: "p47-z-head", variants: ["x3"] },
  { id: "p47-z-actum", variants: ["x3"] },
];

const PAGES = [43, 44, 45, 46, 47];
const CELLS: { id: string }[] = [];
for (const p of PAGES) for (let k = 0; k < 8; k++) CELLS.push({ id: `p${p}-band${k}` });

const PROMPT_BAND = `Handwritten German Kurrent manuscript, 1829/30 cadastral valuation elaborat (Catastral-Schätzungs-Elaborat, Gemeinde Grüble, Krain). This image is a horizontal BAND cut from the middle of a full page — lines may be cut off at the top or bottom edge; transcribe what is visible only.

Transcribe EVERY line of German text and every number exactly as written, preserving line order. Distinguish table cells: if a table (vertical rule lines) is visible, transcribe column content per row, e.g. "Kurs 1 | Mais in anderen Feldern".

Rules:
- Crossed-out text (single words or a large X through a whole section): mark with [gestrichen]; large X = [gestrichen X].
- Red ink: [rot]. Unclear: best reading + [?]. Word cut at band edge: [angeschnitten]. Empty band = no lines.
- Kurrent digit rules: 0 closed oval, 3 two right bumps, 5 flag + closed bowl, 8 waist, 9 bowl + descender. Number pairs like "9. 10" are ranges (min–max). Dot leaders (....) before a number = value placeholder.
- NEVER invent. NEVER fill gaps from context knowledge.

Return STRICT JSON only:
{"lines": ["<line 1 as written>", "..."], "numbers": ["<numeric tokens in order>"], "notes": "<crosses, damage, show-through, cut-offs>"}`;

function withTimeout<T>(p: Promise<T>, ms: number, tag: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`TIMEOUT ${tag}`)), ms))]);
}

function b64(p: string): string {
  return fs.readFileSync(p).toString("base64");
}

async function callVision(zai: Awaited<ReturnType<typeof ZAI.create>>, imgPath: string, prompt: string, tag: string): Promise<string> {
  const img = b64(imgPath);
  for (let t = 1; t <= 5; t++) {
    try {
      const body = {
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:image/png;base64,${img}` } },
            ],
          },
        ],
        thinking: { type: "disabled" },
      };
      const comp = await withTimeout(zai.chat.completions.createVision(body as Parameters<typeof zai.chat.completions.createVision>[0]), 180_000, tag);
      return comp.choices[0]?.message?.content ?? "";
    } catch (e) {
      const msg = String((e as Error)?.message ?? e);
      console.log(`${tag} try ${t}: ${msg.slice(0, 100)}`);
      if (t === 5) return `ERROR: ${msg.slice(0, 200)}`;
      await new Promise((r) => setTimeout(r, msg.includes("429") ? 60_000 : 15_000));
    }
  }
  return "ERROR unreachable";
}

async function readOne(zai: Awaited<ReturnType<typeof ZAI.create>>, cellId: string, variant: "norm" | "raw" | "x3", tag: string) {
  const outPath = path.join(OUT, `${tag}.json`);
  if (fs.existsSync(outPath)) {
    console.log(`${tag}: skip (že obstaja)`);
    return;
  }
  const content = await callVision(zai, path.join(DIR, "crops-v81", `${cellId}-${variant}.png`), PROMPT_BAND, tag);
  fs.writeFileSync(path.join(OUT, `${tag}.raw`), content);
  let parsed: unknown = null;
  try {
    const c = content.trim().replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
    parsed = JSON.parse(c);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
  }
  fs.writeFileSync(outPath, JSON.stringify(parsed ?? { RAW: content.slice(0, 2000) }, null, 1));
  console.log(`${tag}: OK`);
  await new Promise((r) => setTimeout(r, 3_000));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const zai = await ZAI.create();
  const only = process.argv[2]; // "A" (privzeto) | "R" (re-read)
  if (only === "R") {
    for (const cell of REREAD) {
      for (const v of cell.variants) {
        const tag = `${cell.id}-R${v}`;
        await readOne(zai, cell.id, v as "raw" | "x3", tag);
      }
    }
  } else {
    for (const cell of CELLS) {
      await readOne(zai, cell.id, "norm", `${cell.id}-A`);
    }
  }
  console.log("DONE");
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
