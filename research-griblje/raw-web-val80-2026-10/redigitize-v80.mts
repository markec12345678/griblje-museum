/**
 * Val 80 — PZ N83 nativna re-digitation: VLM ansambel na variančnih celicah
 * Prehod A = raw + norm (nativni piksli, brez interpolacije)
 * Prehod B = x3 (norm lanczos, berljivost)
 * Surovi izpisi: vlm/<cell>-<pass>.json + .raw
 * Neodvisnost: prehod A in B sta ločena klica; prompt enak; ni cross-kontaminacije
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/my-project/griblje-museum/research-griblje/raw-web-val80-2026-10";
const OUT = path.join(DIR, "vlm");

const CELLS: { id: string; kind: "entry" | "column" }[] = [
  { id: "p35-no30", kind: "entry" },
  { id: "p36-no594", kind: "entry" },
  { id: "p36-rednote", kind: "entry" },
  { id: "p36-no1004", kind: "entry" },
  { id: "p37-no738", kind: "entry" },
  { id: "p37-no2451", kind: "entry" },
  { id: "p38-no2491", kind: "entry" },
  { id: "p39-no1288", kind: "entry" },
  { id: "p6-zusammen", kind: "column" },
];

const PASSES: { name: string; variants: string[] }[] = [
  { name: "A", variants: ["raw", "norm"] },
  { name: "B", variants: ["x3"] },
];

const PROMPT_ENTRY = `Handwritten German Kurrent manuscript, 1830 cadastral valuation elaborat (Kultur-Beschreibung, Muster-Parzellen). Transcribe the ENTRY exactly.

Rules:
- Transcribe the parcel number "Nro." exactly, the area exactly as "X Joch Y QKlft" — if the Joch position shows a DASH (–), report "0 Joch".
- Digits: distinguish carefully Kurrent 0 (closed oval) vs 3 (two right bumps) vs 5 (flag + closed bowl) vs 8 (waist) vs 9 (bowl + descender). Report digit-by-digit confidence.
- Crossed-out strokes: mark stricken text with [gestrichen]; superscript insertions with [supra: ...].
- Red ink: mark [rot].
- Unclear: best reading + [?]. NEVER invent. Empty = "".

Return STRICT JSON only:
{"nro": "<as written, incl. [gestrichen]/[supra]>", "area_joch": "<digit or ->", "area_qklft": "<digits>", "digit_confidence": "<per-digit notes>", "owner": "<name>", "ort_haus": "<von ... Hö.N.>", "notes": "<strikethroughs, red ink, damage>"}`;

const PROMPT_COLUMN = `Handwritten German Kurrent table, 1830 — RIGHT column pair "Zusammen: Joch | □Klf" of §8 (post-revision totals, red-ink-checked). Transcribe EVERY row exactly in order.

Rows (top to bottom): Aecher, Wiesen, Kleine Gärten, Größere [Gärten], Weingärten, Hutweiden, Hutweiden mit Holznätzen, Subtotal, then below the double line: stricken rows + Bauarea row, unbenützbar rows (multi-value), Total Fläche.

Rules: dash = "0"/"-"; stricken = [gestrichen]; unclear = [?]. Kurrent digit rules: 0 closed oval, 3 two right bumps, 5 flag+bowl, 8 waist, 9 bowl+descender.

Return STRICT JSON only:
{"rows": [{"label": "<as above>", "joch": "<as written>", "qklf": "<as written>", "note": "<stricken/supra/damage>"}]}`;

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

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const zai = await ZAI.create();
  for (const cell of CELLS) {
    for (const pass of PASSES) {
      for (const v of pass.variants) {
        const tag = `${cell.id}-${pass.name}${v === "norm" ? "norm" : v === "raw" ? "raw" : "x3"}`;
        const outPath = path.join(OUT, `${tag}.json`);
        if (fs.existsSync(outPath)) continue;
        const prompt = cell.kind === "entry" ? PROMPT_ENTRY : PROMPT_COLUMN;
        const content = await callVision(zai, path.join(DIR, "crops-v80", `${cell.id}-${v}.png`), prompt, tag);
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
    }
  }
  console.log("DONE");
}

main().catch((e) => { console.error("FATAL", e); process.exit(1); });
