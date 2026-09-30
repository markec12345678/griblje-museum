/**
 * Val 109 — PZ p48–65 2. prehod: resumable VLM bralnik (vzorec tile-read-v98.mts).
 *
 * Vhodi: manifest-v109.json (make-crops-v109.py) + crops-v109/*.png
 * Izhodi: vlm-v109/<cell>.json + .raw
 *
 * Skupine promptov (po imenu celice):
 *  - p48-half-*, p49-half-*                          → PROMPT_PROTOCOL (proza protokolov)
 *  - p50-naslov, pNN-proza, pNN-begr, p51-proza      → PROMPT_PROZA (Kurrent proza + številke)
 *  - pNN-table                                       → PROMPT_TABLE (Darstellung des Rein-Ertrages)
 *  - p63-band*                                       → PROMPT_BAND63 (Zusammenstellung B)
 *  - p65-band*, p65-desni-zoom                       → PROMPT_BAND65 (Zusammenstellung A)
 *
 * Uporaba: bun read-v109.mts <sekunde>   (privzeto 480)
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";
import * as path from "path";

const DIR = "/home/z/griblje-museum/research-griblje/raw-web-val109-2026-09";
const OUT = path.join(DIR, "vlm-v109");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(DIR, "manifest-v109.json"), "utf8")) as {
  crops: { cell: string; page: number; group: string | null; file: string; w: number; h: number }[];
};

function promptFor(cell: string): string {
  if (cell.startsWith("p48-") || cell.startsWith("p49-")) return PROMPT_PROTOCOL;
  if (cell.endsWith("-table")) return PROMPT_TABLE;
  if (cell.startsWith("p63-")) return PROMPT_BAND63;
  if (cell.startsWith("p65-")) return PROMPT_BAND65;
  return PROMPT_PROZA;
}

const COMMON = `RULES:
- Handwritten German Kurrent script, 1829–1831 Carniola (Krain), fiscal cadastral document of the village Grüble.
- Transcribe numbers EXACTLY digit by digit as written. Fractions: transcribe like "40 1/2", "18 3/4", "32 3/4". Do NOT convert units.
- fl = Gulden (florin), kr = Kreuzer. A dash "—" means the cell is empty.
- Red ink: add " [rot]" and transcribe the red value too. Crossed-out: transcribe + " [gestrichen]". Unclear: best reading + " [?]".
- Do NOT invent values. If a field is not visible or empty, return "" or "—".
- Return STRICT JSON only (no markdown fences, no commentary).`;

const PROMPT_PROTOCOL = `This is one half of a handwritten protocol page (Einvernehmungs-Protocoll / Communications-Protokoll, 5. April 1830, pink paper). Transcribe the German Kurrent handwriting line by line.

${COMMON}

Return STRICT JSON only:
{"lines": ["<transcribed line 1>", "<line 2>", ...],
 "names": ["<personal names visible, best reading>"],
 "dates": ["<dates visible>"],
 "unclear": ["<words you could not read>"],
 "observations": "<fold damage, ink fade, anything odd>"}`;

const PROMPT_PROZA = `This is a crop of a handwritten page from the "Verantwortlichung" section (Veranschlagung des Cultur-Aufwandes und Darstellung des Rein-Ertrages, § sections per land type). It contains Kurrent prose and inline numeric values (fl/kr). The text block repeats a FIXED formula per class — transcribe it as-is with the exact numbers filled in.

${COMMON}

Return STRICT JSON only:
{"header": "<§ number + land type name if visible, e.g. 'S. 1. Ackerland'>",
 "classe_label": "<margin label e.g. 'Erste Classe', 'Zweite Classe', 'einzige Classe'>",
 "roh_value": "<Roh-Ertrag value in prose, e.g. '28 fl 40 1/2 kr'>",
 "aufwand_value": "<Cultur-Aufwand value in prose>",
 "percent_line": ["<the 'Dies sind NN/100 Percente...' line(s) with exact fractions, red corrections noted with [rot]>"],
 "per_line": ["<the 'Von Beizügigem Kommüssen ... mit NN fl NN kr abge...' line(s) with exact values>"],
 "begr_lines": ["<Begründung prose lines if visible, else empty>"],
 "red_notes": ["<red margin notes, best effort>"],
 "unclear": ["<words/values you could not read>"],
 "observations": "<anything odd>"}`;

const PROMPT_TABLE = `This crop shows the printed table "Darstellung des Rein-Ertrages" from an 1830 cadastral Schätzungselaborat (Krain, Gemeinde Grüble), with ONE handwritten row per Classe. Columns: Classe | Roh-Ertrag pr. n.Ö. Joch (fl | kr) | Summarischer Cultur-Aufwand (fl | kr) | Taxa percent | Ansschlag desselben im Gelde (fl | kr) | Rein-Ertrag (fl | kr). There may also be a Summe/total row.

${COMMON}

Return STRICT JSON only:
{"rows": [{"classe": "<as written, e.g. 'I.to', 'II.te', 'Einzige'>",
           "roh_fl": "<as written>", "roh_kr": "<as written incl. fraction>",
           "aufwand_fl": "<>", "aufwand_kr": "<>",
           "taxa_percent": "<as written>",
           "anschlag_fl": "<>", "anschlag_kr": "<>",
           "rein_fl": "<>", "rein_kr": "<>"}],
 "totals": [{"label": "<>", "fl": "<>", "kr": "<>"}],
 "red_notes": ["<red margin notes beside the table>"],
 "unclear": ["<cell + doubt>"],
 "observations": "<cross-outs, red corrections inside cells, anything odd>"}`;

const PROMPT_BAND63 = `This is a horizontal band of the LANDSCAPE table "Zusammenstellung B" (p63) — yearly Rente and Capitalwerth of Grundstücke per aufgefundenen Pachtverträgen, Gemeinde Grüble. Columns left→right: No | Namen (des Steuerbezirkes / der Gemeinde) | Des Grundstückes: Catastral-Parzellen Nro, Gesetzliche Eigenschaft (dominical/Haus/rustical/Überland), Culturs Gattung, Flächen Inhalt (Joch | Klafter) | Classe | Nach den aufgefundnen Pachtungen: Pachtschilling für die ganze Parzelle in M.M. (fl | kr), Gleichzeitig übernommene Verbindlichkeit im Geldwerthe (fl | kr), Summe des Pacht-Ertrages der ganzen Parzelle in M.M. (fl | kr), Daher auf Ein N.Ö. Joch (fl | kr) | Anmerkungen. Rows separated by horizontal lines; "detto" = same Culturs Gattung as above. A "Summe" row may appear after a group of rows.

${COMMON}

Return STRICT JSON only:
{"rows": [{"no": "<>", "kat_no": "<>", "eigenschaft": "<dominical|rustical|Haus|Überland|>", "culturs": "<Acker|detto|Wiesen|Wiesen mit Weide|...>",
           "joch": "<>", "klafter": "<>", "classe": "<I|II|...>",
           "pacht_fl": "<>", "pacht_kr": "<>", "verb_fl": "<>", "verb_kr": "<>",
           "summe_fl": "<>", "summe_kr": "<>", "per_joch_fl": "<>", "per_joch_kr": "<>",
           "anmerkung": "<>"}],
 "summen": [{"label": "<>", "joch": "<>", "klafter": "<>", "summe_fl": "<>", "summe_kr": "<>", "per_joch_fl": "<>", "per_joch_kr": "<>"}],
 "red_notes": ["<>"],
 "unclear": ["<>"],
 "observations": "<>"}`;

const PROMPT_BAND65 = `This is a horizontal band of the LANDSCAPE table "Zusammenstellung A" (p65): Samen-Cultur-Ernte- und Drescher-, überhaupt sämmtlicher Bau-Aufschaffungen, Gemeinde Grüble. Columns left→right: No | Kultur-Gattung | Veranlagungs Classe | Brutto-Geldertrag per Joch im Ganzen (fl | kr) | Samen (many narrow sub-columns: Weizen, Korn, Gerste, Hafer, Haiden, Mohn, Hanffrohm, Fläs — values in Metzen) | Drescherlohn (Metzen) | Zug Arbeit (mit Ochsen 2/4; eigene/erheürte; Tage) | Hand (Tage) | Bauschaffungen (Klister/Wickelsäcke/Brand — fl | kr) | Dresch-lieferamt nach den ganzigen Strecken | Nach der Instruction kommen jedoch anzuwenden (Pro/cente | fl | kr) | Eslan zeiget sich Rein-Ertrag (fl | kr) | Anmerkung.

${COMMON}

Return STRICT JSON only:
{"rows": [{"no": "<>", "kultur": "<Ackerland|Wiesen|Kl. Gärten|Gröss. Gärten|Weingärten|Hutweiden|Hutweiden mit Holznutzung|Bau-Area|...>",
           "classe_label": "<I | II | III | einz (einzige)>",
           "brutto_fl": "<>", "brutto_kr": "<>",
           "samen": "<transcribe the Metzen digits per sub-column separated by ' / ', keep positions>",
           "drescherlohn": "<>",
           "zug": "<>", "hand": "<>",
           "bauschaffungen": "<>",
           "dresch_strecken": "<>",
           "instr_pro": "<>", "instr_fl": "<>", "instr_kr": "<>",
           "rein_fl": "<>", "rein_kr": "<>",
           "anmerkung": "<>"}],
 "red_notes": ["<>"],
 "unclear": ["<>"],
 "observations": "<>"}`;

function log(msg: string) {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  fs.appendFileSync(path.join(DIR, "read-v109.log"), line + "\n");
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

let deadline = 0;

async function readOne(zai: Awaited<ReturnType<typeof ZAI.create>>, crop: { cell: string; file: string }) {
  const tag = crop.cell;
  const outPath = path.join(OUT, `${tag}.json`);
  if (fs.existsSync(outPath)) return;
  if (Date.now() > deadline) { log(`${tag}: SKIP (časovni okvir)`); return; }
  const imgPath = path.join(DIR, "crops-v109", crop.file);
  if (!fs.existsSync(imgPath)) throw new Error(`manjka izrezek ${imgPath}`);
  const img = fs.readFileSync(imgPath).toString("base64");
  const prompt = promptFor(crop.cell);
  for (let t = 1; t <= 25; t++) {
    if (Date.now() > deadline) { log(`${tag}: prekinjeno na try ${t} (časovni okvir) — ostaja za naslednji kos`); return; }
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
        fs.writeFileSync(outPath, JSON.stringify({ ERROR: msg.slice(0, 300), cell: tag }, null, 1));
        log(`${tag}: FAILED permanently`);
        return;
      }
      await new Promise((r) => setTimeout(r, is429 ? 60_000 : isTimeout ? 5_000 : 15_000));
    }
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const budget = Number(process.argv[2] ?? "480");
  const workers = Number(process.env.V109_WORKERS ?? "2");
  const pace = Number(process.env.V109_PACE_MS ?? "700");
  deadline = Date.now() + budget * 1000;
  const targets = MANIFEST.crops.filter((c) => !fs.existsSync(path.join(OUT, `${c.cell}.json`)));
  log(`START v109 MISSING: ${targets.length} izrezkov, ${workers} delavcev, okvir ${budget}s, pace ${pace}ms`);
  const zai = await ZAI.create();
  const buckets: typeof targets[] = Array.from({ length: workers }, () => []);
  targets.forEach((t, i) => buckets[i % workers].push(t));
  const worker = async (queue: typeof targets, wid: number) => {
    for (const c of queue) {
      await readOne(zai, c);
      if (Date.now() > deadline) break;
      await new Promise((r) => setTimeout(r, pace));
    }
    log(`worker ${wid} DONE`);
  };
  await Promise.all(buckets.map((q, i) => worker(q, i)));
  const left = MANIFEST.crops.filter((c) => !fs.existsSync(path.join(OUT, `${c.cell}.json`))).length;
  log(`DONE v109 chunk (ostalo: ${left})`);
}

main();
