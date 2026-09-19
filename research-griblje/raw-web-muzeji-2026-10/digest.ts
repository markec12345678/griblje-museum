/** Agregacija rezultatov muzejske raziskave: tiskana digesta vseh JSON iskanj. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "/home/z/griblje-museum/research-griblje/raw-web-muzeji-2026-10";

interface Item {
  url: string; name: string; snippet: string; host_name: string; rank: number; date?: string;
}

const files = readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_"));
const lines: string[] = [];
const seen = new Set<string>();

for (const f of files.sort()) {
  try {
    const data = JSON.parse(readFileSync(`${dir}/${f}`, "utf8")) as Item[];
    if (!Array.isArray(data)) continue;
    lines.push(`\n===== ${f} =====`);
    for (const it of data) {
      const key = it.url.split("?")[0];
      const dup = seen.has(key);
      seen.add(key);
      lines.push(
        `[${dup ? "DUP" : it.host_name}] ${it.name}\n    ${it.url}\n    ${(it.snippet || "").replace(/\s+/g, " ").slice(0, 260)}`,
      );
    }
  } catch (e) {
    lines.push(`\n===== ${f} ===== PARSE ERROR ${String(e).slice(0, 80)}`);
  }
}

writeFileSync(`${dir}/_digest.txt`, lines.join("\n"));
console.log(`digest: ${seen.size} unikatnih URL / ${files.length} iskanj`);
