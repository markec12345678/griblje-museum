/** Četrti krog: točne fraze za AV 30 igla, retrospektive, Križnar, dLib Etnolog. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "h01-igla-fraza", query: '"igla s profilirano glavico" Griblje bronasta halštatska' },
  { id: "h02-av30-pdf", query: '"Arheološki vestnik 30" Dular 1979 Boršt Metlika pdf zrc' },
  { id: "h03-retro-journal", query: 'retrospektive-journal.org šolski muzej dokumentacijska zbirka šole seznam' },
  { id: "h04-kriznar-url", query: 'ojs.zrc-sazu.si Križnar 2001 avdiovizualni laboratorij etnologija film' },
  { id: "h05-dlib-etnolog", query: 'dlib.si Etnolog bilten Slovenskega etnografskega muzeja digitaliziran letnik 10' },
  { id: "h06-dular-av30", query: 'Dular "Boršt" urnenfeld 1979 "A 478" ALI igla Griblje primerjava' },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function run(q: Q, attempt = 1): Promise<void> {
  try {
    execSync(`z-ai function -n web_search -a '${JSON.stringify({ query: q.query, num: 8 })}' -o ${q.id}.json`,
      { stdio: "pipe", timeout: 90_000 });
    console.log(`OK  ${q.id}`);
  } catch (e) {
    if (attempt < 3) { await sleep(10_000); return run(q, attempt + 1); }
    console.log(`FAIL ${q.id}`);
  }
}

for (const q of QUERIES) { await run(q); await sleep(4_000); }
console.log("H_QUERIES_DONE");
