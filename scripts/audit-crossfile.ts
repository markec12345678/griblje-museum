/**
 * CROSS-FILE NUMBER AUDIT: check numbers in minute-stories, record-of-month notes
 * and walk notes against the parent exhibit's SL+EN text.
 * A number that appears in a satellite text but NOWHERE in its parent exhibit
 * (neither as digit nor as SI/EN number-word) is flagged for manual review.
 */
import { seedExhibits } from "@/lib/museum-content";
import { MINUTE_STORIES } from "@/lib/minute-stories";
import { MONTHLY_POOLS } from "@/lib/record-of-month";
import { ALL_WALKS } from "@/lib/walks";

const numWords: Record<string, number> = {
  ena: 1, en: 1, dva: 2, dve: 2, tri: 3, štiri: 4, pet: 5, šest: 6, sedem: 7,
  osem: 8, devet: 9, deset: 10, enajst: 11, dvanajst: 12, trinajst: 13,
  štirinajst: 14, petnajst: 15, šestnajst: 16, sedemnajst: 17, osemnajst: 18,
  devetnajst: 19, dvajset: 20, trideset: 30, štirideset: 40, petdeset: 50,
  šestdeset: 60, sedemdeset: 70, osemdeset: 80, devetdeset: 90, sto: 100, tisoč: 1000,
};
for (const unit of ["ena", "dva", "tri", "štiri", "pet", "šest", "sedem", "osem", "devet"]) {
  for (const dec of ["dvajset", "trideset", "štirideset", "petdeset", "šestdeset", "sedemdeset", "osemdeset", "devetdeset"]) {
    numWords[unit + "in" + dec] = (numWords[dec] ?? 0) + (numWords[unit] ?? 0);
  }
}
const enWords: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000,
};

function allNums(text: string): Set<string> {
  const out = new Set<string>();
  const digits = text.match(/\d+([.,]\d+)*/g) ?? [];
  for (const d of digits) {
    out.add(d.replace(/[.](?=\d{3}\b)/g, "")); // 1.473 → 1473
    out.add(d); // keep original too
  }
  const lower = text.toLowerCase().replace(/[»«"(),.;:!?–—-]/g, " ");
  for (const w of lower.split(/\s+/)) {
    if (numWords[w] !== undefined) out.add(String(numWords[w]));
    const parts = w.split("-");
    if (parts.length === 2 && enWords[parts[0]] !== undefined && enWords[parts[1]] !== undefined) {
      out.add(String(enWords[parts[0]] + enWords[parts[1]]));
    } else if (enWords[w] !== undefined) out.add(String(enWords[w]));
  }
  return out;
}

const byslug = new Map<string, string>();
for (const ex of seedExhibits) {
  byslug.set(ex.slug, `${ex.titleSi} ${ex.titleEn} ${ex.periodSi} ${ex.periodEn} ${ex.summarySi} ${ex.summaryEn} ${ex.storySi} ${ex.storyEn}`);
}

// skip trivially common numbers that appear in dates/sections everywhere
const IGNORE = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "100", "1000", "1669", "1918", "2026", "0"]);

let flags = 0;
function check(origin: string, slug: string, text: string) {
  const parent = byslug.get(slug);
  if (!parent) {
    console.log(`[${origin}] ${slug}: NO PARENT EXHIBIT`);
    return;
  }
  const parentNums = allNums(parent);
  const nums = allNums(text);
  const missing: string[] = [];
  for (const n of nums) {
    if (IGNORE.has(n)) continue;
    if (!parentNums.has(n) && !parentNums.has(n.replace(",", ".")) && !parentNums.has(n.replace(".", ","))) {
      missing.push(n);
    }
  }
  if (missing.length) {
    flags++;
    console.log(`[${origin}] ${slug}: numbers not in parent → ${[...new Set(missing)].join(", ")}`);
  }
}

for (const ms of MINUTE_STORIES) check("minute", ms.slug, ms.textSi);
console.log("--- monthly records ---");
for (const pool of MONTHLY_POOLS) {
  for (const r of pool ?? []) check("record-of-month", r.slug, r.noteSi ?? "");
}
console.log("--- walks ---");
for (const w of ALL_WALKS) {
  for (const s of w.stops ?? []) if (s.exhibitSlug) check(`walk:${w.id}`, s.exhibitSlug, s.noteSi ?? "");
}

console.log(`\nDone. Flagged: ${flags}`);
