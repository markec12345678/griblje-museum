/** Peti krog: Weissov dokument z Griblach, Retrospektive mapa šole, Etnolog 10/11 potrditev. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "i01-weiss-datum", query: 'Janez Weiss "Častite avstrijske hiše" urbar Metlika leto 1520 ALI 1540 ALI 1570 vir' },
  { id: "i02-retro-pdf", query: 'retrospektive revija SŠM "dokumentacijska zbirka" šole "Griblje" letnik' },
  { id: "i03-zupanic-gribelj", query: '"Gribelj v Beli Krajini" Županič Etnolog 1936 ALI 1937 bibliografija' },
  { id: "i04-sem-filmi", query: 'SEM etnografski film Griblje Bela krajina filmoteka posnetek' },
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
console.log("I_QUERIES_DONE");
