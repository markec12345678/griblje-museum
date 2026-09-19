/** Izvleče točne URL-je ključnih zadetkov iz JSON iskanj. */
import { readdirSync, readFileSync } from "node:fs";

const dir = "/home/z/griblje-museum/research-griblje/raw-web-muzeji-2026-10";
const files = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));

const ALL = files.flatMap(f => {
  try {
    return (JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as { url: string; name: string; snippet: string }[])
      .map(it => ({ ...it, file: f }));
  } catch { return []; }
});

const INTERESTING = [
  /etno-muzej\.si/, // SEM zbirkе
  /belokranjski-muzej\.si/,
  /hrcak\.srce\.hr/,
  /okupacijskemeje\.si/,
  /rtvslo\.si/,
  /svet24\.si/,
  /arheologija\.si|arheologija\.splet/,
  /sagepub|semanticscholar|researchgate.*pollen|pollen|holocene/i,
  /muzejsporta\.si/,
  /presscentar/,
  /zrc-sazu\.si/,
  /multikultural/i,
  /zvonovi/i,
];

for (const it of ALL) {
  if (INTERESTING.some(re => re.test(it.url) || re.test(it.name))) {
    console.log(`--- [${it.file}] ${it.name}\n    ${it.url}\n    ${it.snippet.replace(/\s+/g, " ").slice(0, 200)}`);
  }
}
