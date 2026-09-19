/** Surovi URL-ji iz ključnih JSON iskanj. */
import { readFileSync } from "node:fs";

const dir = "/home/z/griblje-museum/research-griblje/raw-web-muzeji-2026-10";
for (const f of ["m02-belokranjski-muzej.json", "m07-etnografski.json", "m04-sistory.json", "m01-kamra.json", "m12-zbornik.json", "m03-dlib.json", "m13-cobiss.json", "m17-nob.json", "m18-foto.json"]) {
  try {
    const d = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as Array<{ url: string; name: string }>;
    console.log(`=== ${f}`);
    for (const it of d) console.log(`  ${it.url}\n     | ${it.name.slice(0, 75)}`);
  } catch (e) { console.log(`=== ${f} ERR ${String(e).slice(0, 50)}`); }
}
