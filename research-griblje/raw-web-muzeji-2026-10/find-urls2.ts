/** Iskanja točnih SEM/Hrčak/Kamra URLjev (id-fokusirana). */
import { execSync } from "node:child_process";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const QUERIES: Array<[string, string]> = [
  ["u09-sem-f182", '"F0000182" Griblje'],
  ["u10-sem-f1407", '"F0001407" Griblje Hiša'],
  ["u11-sem-bela", 'etno-muzej.si "Bela krajina" regionalna zbirka Griblje Kučar Podzemelj'],
  ["u12-hrcak-1986", '"Etnološka tribina" 1986 Dular "Bela krajina" hrcak'],
  ["u13-kamra-obelezja", 'kamra "Spominska obeležja v občini Črnomelj"'],
  ["u14-kamra-plosca", 'kamra "spominska plošča" Zupanič Griblje'],
  ["u15-svet24-fulurl", 'svet24 "železarne Gradac" 1882 Griblje Barle'],
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
console.log("ROUND2_DONE");
