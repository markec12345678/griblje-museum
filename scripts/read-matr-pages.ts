/**
 * VLM re-verification of the Podzemelj death register 04894 pages (Oct-Nov 1918).
 * Retries on 429 with backoff. Writes results to /tmp/matr-readings.json
 * Pages: 189,190,191,192,193,195,196,197,198,200,201,202 (p194 known: entries 62-67)
 */
import ZAI from "z-ai-web-dev-sdk";
import * as fs from "fs";

const PAGES = [189, 190, 191, 192, 193, 195, 196, 197, 198, 200, 201, 202];
const OUT = "/tmp/matr-readings.json";
const PROMPT = `This is a scan of one page of a 1918 Slovenian parish death register (mrliška knjiga), handwritten in old script. The leftmost narrow column contains sequential entry numbers; next come date columns, then name, place, age, cause of death.

Read carefully and answer in this exact format:
FIRST_ENTRY: <number> | LAST_ENTRY: <number>
FIRST_DATE: <day.month> | LAST_DATE: <day.month>
ENTRY_LIST: <every entry number you can read, in order, separated by commas>
GRIBLJE: <for every entry whose place is Griblje/Grilje/Grüble: number, name, age, cause — one per line; write NONE if none>
NOTES: <anything odd about the numbering, e.g. repeated or skipped numbers>`;

async function main() {
  const results: Record<string, string> = fs.existsSync(OUT)
    ? JSON.parse(fs.readFileSync(OUT, "utf8"))
    : {};

  const zai = await ZAI.create();
  let attempt = 0;

  for (const pg of PAGES) {
    if (results[String(pg)]) {
      console.log(`p${pg}: already read, skipping`);
      continue;
    }
    const img = fs.readFileSync(`/tmp/matr-p${pg}.jpg`).toString("base64");
    // retry loop per page
    for (let tryN = 1; tryN <= 40; tryN++) {
      attempt++;
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
        const completion = await zai.chat.completions.createVision(
          body as Parameters<typeof zai.chat.completions.createVision>[0]
        );
        const content = completion.choices[0]?.message?.content ?? "(empty)";
        results[String(pg)] = content;
        fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
        console.log(`p${pg}: OK on try ${tryN}`);
        break;
      } catch (e: unknown) {
        const msg = String((e as Error)?.message ?? e);
        const is429 = msg.includes("429");
        console.log(`p${pg} try ${tryN}: ${is429 ? "429 quota, waiting" : msg.slice(0, 120)}`);
        if (!is429 && tryN >= 3) {
          results[String(pg)] = `ERROR: ${msg.slice(0, 200)}`;
          fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
          break;
        }
        await new Promise((r) => setTimeout(r, is429 ? 150_000 : 20_000));
      }
    }
  }
  console.log("DONE. Pages read:", Object.keys(results).length, "of", PAGES.length);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
