/** Tretji krog: točni URL-ji člankov in pridobivanje citatov. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "g01-derek-pdf", query: '"Kupski manevri" Đerek 2025 "Časopis za suvremenu povijest" Griblje Vinica vodovod' },
  { id: "g02-castite", query: 'academia.edu Janez Weiss "Častite avstrijske hiše" urbar 1500 Bela krajina' },
  { id: "g03-borst-situla", query: '"Žarno grobišče na Borštku" Gabrovec Situla Metlika 1962' },
  { id: "g04-sht", query: '"Slovenska historična topografija" Griblje Griblach 1468 omemba' },
  { id: "g05-retrospektive", query: 'retrospektive SŠM "mapa šole" Griblje dokumentacijska zbirka' },
  { id: "g06-kriznar", query: 'Križnar "Avdiovizualni laboratorij in etnologija" Griblje film SEM' },
  { id: "g07-zupanic-etnolog", query: 'Županič "Gribelj" Etnolog 1936 Bela krajina monografija vasi' },
  { id: "g08-rab-spominska", query: '"Spominska knjiga pregnanov" Rab seznam internirancev Bela krajina Griblje' },
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
console.log("G_QUERIES_DONE");
