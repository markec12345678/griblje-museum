/** Iskanja za točne URL-je strani, ki jih želimo prebrati (s frekvenco z zamiki). */
import { execSync } from "node:child_process";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const QUERIES: Array<[string, string]> = [
  ["u01-sv24-zelezarna", "svet24 140 let od prenehanja obratovanja železarne Gradac"],
  ["u02-sem-griblje", "etno-muzej.si Griblje Zbirka starih fotografij"],
  ["u03-belokranjski", "belokranjski-muzej.si kulturna zgodovina zbirka Napoleon Griblje"],
  ["u04-hrcak-dular", "hrcak.srce.hr Andrej Dular Belokranjski muzej 1986 Barle"],
  ["u05-okupacijske", "okupacijskemeje.si Griblje barbed wire school 1942"],
  ["u06-sage-holocene", "Holocene vegetation development Bela krajina Griblje pollen Andrič"],
  ["u07-zrc-bela", "ZRC SAZU raziskovalna dejavnost Bela krajina Griblje ledena doba refugij"],
  ["u08-presscentar", "Dr Niko Zupanič kosmopolita muzej Griblje"],
];

async function run(id: string, q: string, attempt = 1): Promise<void> {
  try {
    execSync(`z-ai function -n web_search -a '${JSON.stringify({ query: q, num: 5 })}' -o ${id}.json`, { stdio: "pipe", timeout: 90_000 });
    console.log(`OK ${id}`);
  } catch {
    if (attempt < 4) { await sleep(9_000 * attempt); return run(id, q, attempt + 1); }
    console.log(`FAIL ${id}`);
  }
}

for (const [id, q] of QUERIES) { await run(id, q); await sleep(2_500); }
console.log("URL_LOOKUPS_DONE");
