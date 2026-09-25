/**
 * Val 57 — blok 2 tarčna branja: p6-bot (vpisa 8/9), p6 annotation pas (B.P. 90 lega),
 * PT p7 bp 89-91 pas (hišne številke), p49 zaključna formula (leto 1825 vs 1826).
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
    id: "pua-p06-bot",
    img: path.join(BASE, "reads-pua-p06-bot.jpg"),
    prompt: `Bottom half of page 6 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent). Entries have: Nro., section, Haus Nro., owner name + status, parcel list by section, and annotation on a continuation line.

Expected: entries Nro. 8 and 9 (and possibly the start of Nro. 10). For EACH entry read: Nro., Haus Nro. (DIGIT BY DIGIT, describe shapes), owner, parcels, and ALL annotation lines (look especially for any "B. P." or "R. P." annotations with numbers — e.g. "B.P. 90." or "R.P. 37. 32.").

Report STRICT JSON:
{"entries": [{"nro": "<>", "section": "<>", "haus_no": "<>", "owner": "<>", "parcels": "<>", "anmerkung": "<all lines>"}],
 "digit_notes": "<...>", "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pua-p06-annot-strip",
    img: path.join(BASE, "reads-pua-p06-annot.jpg"),
    prompt: `This is the RIGHT strip (annotation column region) of the top half of page 6 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble". The entries Nro. 7 (and possibly 8) have annotations on continuation lines.

Read ALL handwritten text in this strip, top to bottom, entry by entry. Look for annotations like "B.P. 90.", "R.P. 37. 32.", "B. S. M." or similar letter-number combinations. For each annotation say WHICH entry row (count visible entry boundaries) it belongs to and transcribe EXACTLY.

Report STRICT JSON:
{"annotations": [{"position_row": "<1st entry visible / 2nd / ...>", "text": "<as written>"}],
 "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pt-p07-bp8991",
    img: path.join(BASE, "reads-pt-p07-bp8991.jpg"),
    prompt: `Band from page 7 of "Protocoll der Bau Parcellen der Gemeinde Gruble" (1825, German Kurrent table). This band should contain the first rows of the lower block: BP 89, 90, 91 (and maybe 92). Columns: Bau-Parcellen Nro., Haus Nro. (small digits), owner name, Stand, Gattung, Areal, Anmerkung.

CRITICAL: read the Haus Nro. for BP 89, 90, 91 DIGIT BY DIGIT and describe each digit's shape (Kurrent: 0 oval, 1 stroke with flag, 2 wavy top, 3 flat top curve, 4 open top, 5 sharp angle, 6 bottom loop, 7 cross-stroke, 8 double loop, 9 top loop). Candidates for BP 90: 43, 44, 51, 28 — look very carefully.

Report STRICT JSON:
{"rows": [{"bp": "<>", "haus_no": "<>", "owner": "<>", "gattung": "<>", "anmerkung": "<>"}],
 "digit_notes": "<per-row digit shapes>",
 "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pua-p49-closing",
    img: path.join(BASE, "reads-pua-p49-closing.jpg"),
    prompt: `Bottom portion of the LAST page (49) of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent), shown at 2× zoom.

This area contains the closing of the register: possibly the end of entry Nro. 97, a closing formula line like "Ich Amtl[...]" with a date "am 10. Jänner 1825 oder 1826", and signatures with a witness line ("Zeugen:").

TASKS:
1. Transcribe the closing formula EXACTLY.
2. The DATE: read the year DIGIT BY DIGIT. Is the last digit 5 or 6? Describe the shape (5 = sharp angle top + open bowl; 6 = closed bottom loop). Also read the day and month.
3. Transcribe each signature and the witness line.
4. Any title/office under a signature (e.g. "Bürgermeister", "Amtsschreiber", "Mumppen").

Report STRICT JSON:
{"closing_formula": "<>", "date": {"day": "<>", "month": "<>", "year": "<>", "last_digit_shape": "<describe>"},
 "signatures": ["..."], "titles": ["..."], "unclear": ["..."], "observations": "<...>"}`,
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
  log("READS2 DONE");
}

main().catch((e) => {
  log(`FATAL: ${e}`);
  process.exit(1);
});
