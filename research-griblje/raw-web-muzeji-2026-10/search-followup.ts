/** Ciljana iskanja za točne URL-je ključnih virov drugega vala. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "f01-kamra-spomenik", query: 'site:kamra.si spomenik padlim partizanom Griblje 1961' },
  { id: "f02-hrcak-derek", query: 'hrcak Đerek "Kupski manevri vojske Kraljevine Jugoslavije 1937" godine' },
  { id: "f03-zc1988", query: 'sistory "Zgodovinski časopis" 1988 Bela krajina spomeniki Mitrej Kambič varstvo' },
  { id: "f04-borst", query: 'academia "Žarno grobišče na Borštku" Metlika urnenfeld' },
  { id: "f05-griblach-dok", query: '"Častite avstrijske hiše" Griblach dorff Metlika dokument' },
  { id: "f06-paleonimi", query: 'topografija.zrc-sazu.si Griblje historično krajevno ime' },
  { id: "f07-cobiss-plosca", query: 'COBISS "ob odkritju njegove spominske plošče" Županič Dular' },
  { id: "f08-kamra-ucitelj", query: 'kamra "rojstna hiša učitelja" pesnika Črnomelj' },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function run(q: Q, attempt = 1): Promise<void> {
  const out = `${q.id}.json`;
  try {
    execSync(
      `z-ai function -n web_search -a '${JSON.stringify({ query: q.query, num: 6 })}' -o ${out}`,
      { stdio: "pipe", timeout: 90_000 },
    );
    console.log(`OK  ${q.id}`);
  } catch (e) {
    if (attempt < 3) { await sleep(10_000); return run(q, attempt + 1); }
    console.log(`FAIL ${q.id}: ${String(e).slice(0, 120)}`);
  }
}

for (const q of QUERIES) { await run(q); await sleep(4_000); }
console.log("F_QUERIES_DONE");
