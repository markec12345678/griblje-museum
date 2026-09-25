/**
 * Val 57 — blok 3 tarčna branja: p06-bot (kompaktno), p06 mid-band (opomba B.P. 90 pod no.7).
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const BASE = "/home/z/griblje-museum/research-griblje/raw-web-val57-2026-10";
const OUT = path.join(BASE, "reads");
const LOG = path.join(OUT, "reads.log");

type Target = { id: string; img: string; prompt: string };

const T: Target[] = [
  {
    id: "pua-p06-bot-compact",
    img: path.join(BASE, "reads-pua-p06-bot.jpg"),
    prompt: `Bottom half of page 6 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent).

Keep your answer SHORT. Do NOT transcribe parcel lists — for parcels just write the COUNT of numbers and the section letters.

For EACH visible entry (expected Nro. 8, 9, maybe 10) report:
- Nro.
- Haus Nro. — DIGIT BY DIGIT with one-phrase shape description
- owner name (short, [?] for unclear)
- parcel summary: "I×12 II×6 III×2" style
- ALL annotation lines (these are short — transcribe fully; look for "B.P. 90.", "R.P. 37. 32.", "B. S. M.", "Commenda...")

Return STRICT JSON only:
{"entries": [{"nro": "", "haus_no": "", "owner": "", "parcel_summary": "", "anmerkung": ""}],
 "digit_notes": "", "unclear": [], "observations": ""}`,
  },
  {
    id: "pua-p06-midband",
    img: path.join(BASE, "reads-pua-p06-midband.jpg"),
    prompt: `Horizontal band from the MIDDLE of page 6 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent). This band contains the END of entry Nro. 7 (its last parcel rows and any continuation/annotation line under it) and the START of entry Nro. 8.

Read ALL handwritten text in this band, line by line:
1. Any annotation line directly under entry 7's parcel list — expected candidates: "B.P. 90." or similar. Transcribe exactly and say where it sits (under which entry number, at what vertical position).
2. The start of entry 8: its Nro., Haus Nro. (digit by digit), owner name.
3. Any other numbers/words visible.

Return STRICT JSON only:
{"annotations_under_entry7": ["..."], "entry8_start": {"nro": "", "haus_no": "", "owner": ""},
 "other_text": ["..."], "unclear": [], "observations": ""}`,
  },
];

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
  for (const t of T) {
    const outPath = path.join(OUT, `${t.id}.json`);
    if (fs.existsSync(outPath)) {
      log(`${t.id}: exists, skip`);
      continue;
    }
    const img = fs.readFileSync(t.img).toString("base64");
    for (let tryN = 1; tryN <= 12; tryN++) {
      try {
        const body = {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: t.prompt },
                { type: "image_url", image_url: { url: `data:image/jpeg;base64,${img}` } },
              ],
            },
          ],
          thinking: { type: "disabled" },
        };
        const completion = await withTimeout(
          zai.chat.completions.createVision(body as Parameters<typeof zai.chat.completions.createVision>[0]),
          180_000,
          t.id
        );
        let content = completion.choices[0]?.message?.content ?? "";
        content = content.trim().replace(/^```(json)?\s*/i, "").replace(/\s*```$/, "");
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch {
          const m = content.match(/\{[\s\S]*\}/);
          if (m) parsed = JSON.parse(m[0]);
          else throw new Error("no JSON");
        }
        fs.writeFileSync(outPath, JSON.stringify(parsed, null, 1));
        log(`${t.id}: OK (try ${tryN})`);
        break;
      } catch (e: unknown) {
        const msg = String((e as Error)?.message ?? e);
        const is429 = msg.includes("429");
        log(`${t.id} try ${tryN}: ${is429 ? "429" : msg.slice(0, 120)}`);
        if (!is429 && !msg.includes("TIMEOUT") && tryN >= 3) {
          fs.writeFileSync(outPath, JSON.stringify({ ERROR: msg.slice(0, 300) }, null, 1));
          break;
        }
        await new Promise((r) => setTimeout(r, is429 ? 60_000 : 10_000));
      }
    }
  }
  log("READS3 DONE");
}

main().catch((e) => {
  log(`FATAL: ${e}`);
  process.exit(1);
});
