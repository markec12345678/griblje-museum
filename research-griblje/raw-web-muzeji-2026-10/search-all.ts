/** Sekvenčno spletno iskanje z retry/429 backoff — muzejska raziskava Griblje. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "m01-kamra", query: '"Griblje" kamra digitalizirana kulturna dediščina' },
  { id: "m02-belokranjski-muzej", query: '"Griblje" Belokranjski muzej Metlika' },
  { id: "m05-mdc", query: '"Griblje" Muzejski dokumentacijski center museu.ms' },
  { id: "m07-etnografski", query: '"Griblje" Etnografski muzej Slovenije zbirka' },
  { id: "m09-zvkds", query: '"Griblje" register nepremične kulturne dediščine EŠD' },
  { id: "m10-geopedia", query: '"Griblje" Geopedia dediščina' },
  { id: "m11-cerkve", query: '"Griblje" cerkev sv. Vida župnija zgodovina škofija' },
  { id: "m12-zbornik", query: '"Griblje" Zbornik Bele krajine' },
  { id: "m13-cobiss", query: '"Griblje" monografija knjiga COBISS' },
  { id: "m14-arheologija", query: '"Griblje" arheologija sarkofag najdišče rimska' },
  { id: "m15-folklora", query: '"Griblje" folklora pesem Šopek zbirka etnološka' },
  { id: "m16-sola", query: '"Griblje" osnovna šola kronika zgodovina' },
  { id: "m17-nob", query: '"Griblje" NOB partizani vojna zgodovina' },
  { id: "m18-foto", query: '"Griblje" fotografije zbirka stari' },
  { id: "m19-gazeteer", query: '"Griblje" Krajevni leksikon NRJ 1957' },
  { id: "m20-nadbarci", query: 'Griblje "nadbarci" ALI "bratovščina" ALI "granice" tradicija' },
  { id: "m21-domace", query: '"Griblje" domačija ime hiša knjiga "Gribelj"' },
  { id: "m22-suhadolska", query: 'Griblje "Suhadol" ALI "Velika vrata" ALI "Vukovac" kraška' },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function run(q: Q, attempt = 1): Promise<void> {
  const out = `${q.id}.json`;
  try {
    execSync(
      `z-ai function -n web_search -a '${JSON.stringify({ query: q.query, num: 10 })}' -o ${out}`,
      { stdio: "pipe", timeout: 90_000 },
    );
    console.log(`OK  ${q.id}`);
  } catch (e) {
    if (attempt < 4) {
      const wait = 8_000 * attempt;
      console.log(`429 ${q.id} (poskus ${attempt}) — čakam ${wait / 1000}s`);
      await sleep(wait);
      return run(q, attempt + 1);
    }
    console.log(`FAIL ${q.id}: ${String(e).slice(0, 200)}`);
  }
}

for (const q of QUERIES) {
  await run(q);
  await sleep(3_000);
}
console.log("ALL_QUERIES_DONE");
