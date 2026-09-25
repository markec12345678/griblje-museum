/**
 * Val 57 — tarčna neodvisna branja (audit THREE-CHANNEL + vrzeli register.json)
 * 10 branj: p26/p42 (vpisi 52, 85/86 → dopolnitev registra), p6 (bp 90 blok),
 * p47 (Zollamt), p49 (Zucchelli), PT p5 (Kurrent 46-48/76), PT p7 (bp 90/98).
 * Izhod: research-griblje/raw-web-val57-2026-10/reads/<id>.json
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const BASE = "/home/z/griblje-museum/research-griblje/raw-web-val57-2026-10";
const V56 = "/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10";
const OUT = path.join(BASE, "reads");
const LOG = path.join(OUT, "reads.log");

type Target = { id: string; img: string; prompt: string };

const T: Target[] = [
  {
    id: "pua-p26-native",
    img: path.join(V56, "fullres-extracts/PUA-p26-native.jpeg"),
    prompt: `Page 26 of an 1825 alphabetical register of land owners ("Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble"), German Kurrent handwriting. Each entry has: sequential entry number (Nro.), section (I-V), house number (Haus Nro.), owner name with status, a list of parcel numbers grouped by section, and an annotation.

This page was cut off in older scans but is now complete. READ EVERYTHING visible. Report STRICT JSON:
{"entries_visible": [{"nro": "<as written>", "section": "<>", "haus_no": "<>", "owner": "<as written, [?] for unclear>", "parcels": "<list as written, preserve section prefixes>", "anmerkung": "<>"}],
 "cut_top": "<is the top cut mid-line? what is visible?>",
 "cut_bottom": "<is the bottom cut? what is the last visible line?>",
 "header_or_title": "<any header text>",
 "unclear": ["..."],
 "observations": "<anything odd>"}
The expected entry on this page is around Nro. 52 (previous page ended at Nro. 50). Also report whether Nro. 51 is visible anywhere.`,
  },
  {
    id: "pua-p42-native",
    img: path.join(V56, "fullres-extracts/PUA-p42-native.jpeg"),
    prompt: `Page 42 of an 1825 alphabetical register of land owners ("Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble"), German Kurrent handwriting. Each entry has: sequential entry number (Nro.), section (I-V), house number, owner name with status, parcel list, annotation.

This page was cut off in older scans but is now complete. READ EVERYTHING visible. Report STRICT JSON:
{"entries_visible": [{"nro": "<as written>", "section": "<>", "haus_no": "<>", "owner": "<as written, [?] for unclear>", "parcels": "<list as written>", "anmerkung": "<>"}],
 "cut_top": "<...>", "cut_bottom": "<...>",
 "header_or_title": "<...>",
 "unclear": ["..."], "observations": "<...>"}
Expected: entries Nro. 85 and 86 (page 41 ended at 84, page 43 starts at 87).`,
  },
  {
    id: "pua-p06-top",
    img: path.join(BASE, "reads-pua-p06-top.jpg"),
    prompt: `Top half of page 6 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent). Entries have: Nro., section, Haus Nro., owner name + status, parcel list by section, annotation on a continuation line.

CRITICAL TASK — line alignment: for EACH entry row, read the entry number, house number and owner name THAT ARE ON THE SAME LINE. House numbers are right of the name column edge, small digits. Read each house number DIGIT BY DIGIT (Kurrent digits: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 — 3 and 5 and 0 can look alike).

Expected on this page: entries Nro. 7, 8, 9 (page 5 ended at Nro. 6). For each: report the annotation too (expected "B.P. 90." on one of them).

Report STRICT JSON:
{"entries": [{"nro": "<>", "section": "<>", "haus_no": "<digit-by-digit, then in brackets your confidence>", "owner": "<>", "parcels": "<>", "anmerkung": "<>"}],
 "digit_notes": "<describe the actual digit shapes you saw for each house number>",
 "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pua-p47-top",
    img: path.join(BASE, "reads-pua-p47-top.jpg"),
    prompt: `Top half of page 47 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent).

Find the entry of the "k.k. Zollamt" (customs office). For that entry read: Nro. (expected 95), section, Haus Nro. (DIGIT BY DIGIT), full owner text, parcel list, and ALL annotation lines including any continuation line under the entry (expected something like "B. P. 98.").

Also list any other entries visible. Report STRICT JSON:
{"entries": [{"nro": "<>", "section": "<>", "haus_no": "<>", "owner": "<>", "parcels": "<>", "anmerkung": "<all lines>"}],
 "digit_notes": "<describe the house number digit shapes>",
 "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pua-p47-bot",
    img: path.join(BASE, "reads-pua-p47-bot.jpg"),
    prompt: `Bottom half of page 47 of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent). Report ALL text visible: entry numbers, house numbers, names, annotations — especially any "B. P." annotations with numbers. Report STRICT JSON: {"text": "<everything readable, entry by entry>", "unclear": ["..."]}`,
  },
  {
    id: "pua-p49-native",
    img: path.join(V56, "fullres-extracts/PUA-p49-native.jpeg"),
    prompt: `Page 49 (last page) of the 1825 register "Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde Gruble" (German Kurrent).

TASKS:
1. Find the last entry (expected Nro. 97). Read its owner name LETTER BY LETTER. Expected something like "Philipp De Giammo Zucchelli" or "Philipp de Giovanni Zucchelli" — transcribe exactly what is written, character by character, with [?] for unclear.
2. Read the parcel number(s) listed for it.
3. Read the closing formula line (expected "Ich Amtl... am 10. Jänner/Januar 1825 oder 1826...") — read the YEAR digit by digit.
4. Read the signatures: how many, and transcribe each as best as possible.
5. Any other text (witness lines "geztgen:", titles like "Bürgermeister").

Report STRICT JSON:
{"entry": {"nro": "<>", "haus_no": "<>", "owner_letter_by_letter": "<>", "parcels": "<>", "anmerkung": "<>"},
 "closing_formula": "<>", "year_digits": "<>", "signatures": ["..."], "other_text": ["..."], "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pt-p05-top",
    img: path.join(BASE, "reads-p05-top.jpg"),
    prompt: `Top half of page 5 of "Protocoll der Bau Parcellen der Gemeinde Gruble" (1825, German Kurrent table). Columns: Bau-Parcellen Nro. (BP number), Haus Nro. (house number, small digits), name of owner, Stand, Gattung, Areal, Anmerkung.

This half should contain BP rows ~41 to ~50. For EACH row read the BP number AND the Haus Nro. DIGIT BY DIGIT. Kurrent digits 2, 3, 5, 6 look similar — describe the shapes you see.

CRITICAL: BP 46, 47, 48 — read their Haus Nro. with special care (expected values might be 63, 65, or 62 — look at the exact strokes: 3 has flat top curve, 5 has a sharp angle, 6 has a loop at bottom).

Report STRICT JSON:
{"rows": [{"bp": "<>", "haus_no": "<>", "owner": "<>", "gattung": "<>", "anmerkung": "<>"}],
 "digit_notes": "<per-row description of house number digit shapes>",
 "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pt-p05-bot",
    img: path.join(BASE, "reads-p05-bot.jpg"),
    prompt: `Bottom half of page 5 of "Protocoll der Bau Parcellen der Gemeinde Gruble" (1825, German Kurrent table). Columns: Bau-Parcellen Nro., Haus Nro., owner, Stand, Gattung, Areal, Anmerkung.

This half should contain BP rows ~51 to ~61. For EACH row read BP and Haus Nro. DIGIT BY DIGIT. CRITICAL: BP 76 — if visible, read its Haus Nro. with special care (possible values 51, 68, 28 — look at exact strokes). Also note any "Abtheilung" (division) rows — same BP appearing twice.

Report STRICT JSON:
{"rows": [{"bp": "<>", "haus_no": "<>", "owner": "<>", "gattung": "<>", "anmerkung": "<>"}],
 "digit_notes": "<...>", "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pt-p07-top",
    img: path.join(BASE, "reads-p07-top.jpg"),
    prompt: `Top half of page 7 of "Protocoll der Bau Parcellen der Gemeinde Gruble" (1825, German Kurrent table). Columns: Bau-Parcellen Nro., Haus Nro., owner, Stand, Gattung, Areal, Anmerkung.

This half should contain BP rows ~81 to ~90. CRITICAL ROWS:
- BP 90: read Haus Nro. digit by digit (candidates: 43, 44, 51, 28) and full owner name.
- BP 98: read Haus Nro. digit by digit (candidates: 20, 39, 50) and full owner name (expected "A. Zöllner" or "Zollamt" — read exactly).
Also note "Abtheilung" rows.

Report STRICT JSON:
{"rows": [{"bp": "<>", "haus_no": "<>", "owner": "<>", "gattung": "<>", "anmerkung": "<>"}],
 "digit_notes": "<...>", "unclear": ["..."], "observations": "<...>"}`,
  },
  {
    id: "pt-p07-bot",
    img: path.join(BASE, "reads-p07-bot.jpg"),
    prompt: `Bottom half of page 7 of "Protocoll der Bau Parcellen der Gemeinde Gruble" (1825, German Kurrent table). Columns: Bau-Parcellen Nro., Haus Nro., owner, Stand, Gattung, Areal, Anmerkung.

This half should contain BP rows ~91 to ~100. CRITICAL:
- BP 98: read Haus Nro. digit by digit (candidates: 20, 39, 50) and owner (expected "A. Zöllner"/"Zollamt").
- BP 100: read Haus Nro. digit by digit and owner.
- Note any "Abtheilung" rows (BP appearing multiple times).

Report STRICT JSON:
{"rows": [{"bp": "<>", "haus_no": "<>", "owner": "<>", "gattung": "<>", "anmerkung": "<>"}],
 "digit_notes": "<...>", "unclear": ["..."], "observations": "<...>"}`,
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
  log("READS DONE");
}

main().catch((e) => {
  log(`FATAL: ${e}`);
  process.exit(1);
});
