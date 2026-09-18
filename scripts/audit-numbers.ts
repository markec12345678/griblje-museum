/**
 * NUMERIC AUDIT: cross-check digits in SI vs EN fields of every exhibit,
 * plus title/period vs yearFrom/yearTo consistency.
 * Run: bun /home/z/my-project/scripts/audit-numbers.ts
 */
import { seedExhibits } from "@/lib/museum-content";

const numWords: Record<string, number> = {
  ena: 1, en: 1, dva: 2, dve: 2, tri: 3, štiri: 4, pet: 5, šest: 6, sedem: 7,
  osem: 8, devet: 9, deset: 10, enajst: 11, dvanajst: 12, trinajst: 13,
  štirinajst: 14, petnajst: 15, šestnajst: 16, sedemnajst: 17, osemnajst: 18,
  devetnajst: 19, dvajset: 20, trideset: 30, štirideset: 40, petdeset: 50,
  šestdeset: 60, sedemdeset: 70, osemdeset: 80, devetdeset: 90, sto: 100,
  dvesto: 200, tristo: 300,
};

// Build Slovenian compound number words (21-99)
for (const unit of ["ena", "dva", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"]) {
  for (const decade of ["dvajset", "trideset", "štirideset", "petdeset", "šestdeset", "sedemdeset", "osemdeset", "devetdeset"]) {
    numWords[unit + "in" + decade] = (numWords[decade] ?? 0) + (numWords[unit] ?? 0);
  }
}

// English number words
const enWords: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
};

function extractDigits(text: string): Map<string, number> {
  // normalize: 1.473 → 1473 style thousands handled loosely; collect each numeric token
  const map = new Map<string, number>();
  const tokens = text.match(/\d+([.,]\d+)*/g) ?? [];
  for (const t of tokens) {
    const norm = t.replace(/[.,](?=\d{3}\b)/g, "");
    const key = norm.replace(/[.,]/g, ".");
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function extractSiWords(text: string): number[] {
  const out: number[] = [];
  const lower = text.toLowerCase().replace(/[»«"(),.;:!?–—-]/g, " ");
  for (const w of lower.split(/\s+/)) {
    if (numWords[w] !== undefined) out.push(numWords[w]);
  }
  return out;
}

function extractEnWords(text: string): number[] {
  const out: number[] = [];
  const lower = text.toLowerCase().replace(/[»«"(),.;:!?–—-]/g, " ");
  const tokens = lower.split(/\s+/);
  // compound: "twenty-one", "forty-four"
  for (const t of tokens) {
    const parts = t.split("-");
    if (parts.length === 2 && enWords[parts[0]] !== undefined && enWords[parts[1]] !== undefined) {
      out.push(enWords[parts[0]] + enWords[parts[1]]);
    } else if (enWords[t] !== undefined) {
      out.push(enWords[t]);
    }
  }
  return out;
}

let issues = 0;
const report: string[] = [];

for (const ex of seedExhibits) {
  const si = `${ex.titleSi} ${ex.periodSi} ${ex.summarySi} ${ex.storySi}`;
  const en = `${ex.titleEn} ${ex.periodEn} ${ex.summaryEn} ${ex.storyEn}`;

  // 1) digit-set comparison (as sets, ignoring counts)
  const siDigits = extractDigits(si);
  const enDigits = extractDigits(en);
  const siOnly: string[] = [];
  const enOnly: string[] = [];
  for (const k of siDigits.keys()) if (!enDigits.has(k)) siOnly.push(k);
  for (const k of enDigits.keys()) if (!siDigits.has(k)) enOnly.push(k);

  // 2) SI number-words vs digits present
  const siWordNums = extractSiWords(ex.storySi + " " + ex.summarySi + " " + ex.titleSi);
  const enWordNums = extractEnWords(ex.storyEn + " " + ex.summaryEn + " " + ex.titleEn);
  const allDigitNums = new Set<string>([...siDigits.keys(), ...enDigits.keys()]);
  const siWordUnmatched = siWordNums.filter(
    (n) => n >= 20 && n !== 100 && !allDigitNums.has(String(n)) && !allDigitNums.has(String(n).replace(".", ","))
  );
  const enWordUnmatched = enWordNums.filter(
    (n) => n >= 20 && n !== 100 && !allDigitNums.has(String(n)) && !allDigitNums.has(String(n).replace(".", ","))
  );

  // 3) yearFrom/yearTo vs digits in period
  const periodYears = [...ex.periodSi.matchAll(/\d{4}/g)].map((m) => m[0]);
  const yf = ex.yearFrom !== undefined ? String(ex.yearFrom) : null;
  const yt = ex.yearTo !== undefined ? String(ex.yearTo) : null;

  const problems: string[] = [];
  if (siOnly.length) problems.push(`digits only in SI: ${siOnly.join(", ")}`);
  if (enOnly.length) problems.push(`digits only in EN: ${enOnly.join(", ")}`);
  if (siWordUnmatched.length) problems.push(`SI words w/o digit counterpart: ${[...new Set(siWordUnmatched)].join(", ")}`);
  if (enWordUnmatched.length) problems.push(`EN words w/o digit counterpart: ${[...new Set(enWordUnmatched)].join(", ")}`);
  if (yf && periodYears.length && !periodYears.includes(yf) && !si.includes(`${yf}`)) {
    problems.push(`yearFrom ${yf} not in period/story digits`);
  }

  if (problems.length) {
    issues++;
    report.push(`[${ex.slug}] ${problems.join(" | ")}`);
  }
}

console.log(`Audited ${seedExhibits.length} exhibits. Exhibits flagged: ${issues}\n`);
console.log(report.join("\n"));
