/** Drugi val iskanj — muzejska raziskava Griblje: ustanove/koti, ki jih prva runda ni pokrila. */
import { execSync } from "node:child_process";

interface Q { id: string; query: string; }

const QUERIES: Q[] = [
  { id: "n01-mnzs-rab", query: '"Griblje" ALI "Gribelj" Muzej novejše zgodovine Slovenije interniranci Rab' },
  { id: "n02-solski-kronike", query: '"Griblje" šolska kronika POŠ digitalizirana Slovenski šolski muzej' },
  { id: "n03-dlib-griblach", query: '"Griblach" dLib digitalna knjižnica Bela krajina' },
  { id: "n04-dlib-casopis", query: '"Griblje" "Slovenski narod" ALI "Jutro" časopis 1900 1930' },
  { id: "n05-kamra-obelezja", query: 'kamra.si "Griblje" spominska obeležja padlim Črnomelj' },
  { id: "n06-razglednice", query: '"Griblje" stara razglednica Bela krajina fotografija' },
  { id: "n07-kataster", query: '"Griblje" katastrska občina franciscejski kataster zemljevid 1825' },
  { id: "n08-vahtar", query: '"Drago Vahtar" Narodna galerija umetnina fotografija' },
  { id: "n09-tehniški", query: '"Griblje" Tehniški muzej Slovenije zbirka' },
  { id: "n10-pmc", query: '"Griblje" Pokrajinski muzej Celje zbirka online' },
  { id: "n11-pmpo", query: '"Griblje" Pokrajinski muzej Maribor zbirka katalog' },
  { id: "n12-vojaslki-1937", query: '"Griblje 57" kupski manevri 1937 vojska Kraljevine Jugoslavije' },
  { id: "n13-eheritage", query: 'eheritage.si "Griblje" kulturna dediščina register vpis' },
  { id: "n14-hrcak-znoz", query: 'hrcak "Zbornik za narodno življenje" Griblje ALI "Gribelj" Bela krajina' },
  { id: "n15-valvasor", query: 'Valvasor "Griblach" Crain Bela krajina toposkopija' },
  { id: "n16-sem-gribelj", query: 'etno-muzej.si "Gribelj" ALI "Griblje" zbirka predmet etnografija' },
  { id: "n17-muzejski-portal", query: '"Griblje" muzej.si ALI museu.ms predmet katalog digitalna zbirka' },
  { id: "n18-sistory-2", query: 'sistory.si "Griblje" ALI "Gribelj" zbornik monografija' },
  { id: "n19-rab-imenjski", query: '"Spominska knjiga pregnanov" Rab "Griblje" ALI "Gribelj" interniranci' },
  { id: "n20-zupanic-merjenja", query: 'Niko Županič "Griblje" antropološka merjenja etnografsko raziskovanje' },
  { id: "n21-leksikon-1882", query: '"Leksikon občin kraljestev" 1882 "Griblje" ALI "Griblach"' },
  { id: "n22-obcina-ks", query: 'občina Črnomelj "krajevna skupnost Griblje" kulturna dediščina zbirka' },
  { id: "n23-mason-grahek", query: 'MASON GRAHEK "Griblje" "Varstvo spomenikov" poročila 2006' },
  { id: "n24-muzeji-severna", query: '"Griblje" Gorenjski muzej ALI "Mestni muzej Ljubljana" ALI "Moderna galerija" zbirka' },
];

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function run(q: Q, attempt = 1): Promise<void> {
  const out = `${q.id}.json`;
  try {
    execSync(
      `z-ai function -n web_search -a '${JSON.stringify({ query: q.query, num: 10 })}' -o ${out}`,
      { stdio: "pipe", timeout: 90_000, cwd: __dirname },
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
console.log("ROUND2_QUERIES_DONE");
