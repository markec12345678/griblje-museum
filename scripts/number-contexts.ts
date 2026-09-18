/** Print number context for targeted exhibits: every digit/number-word with 6 words around it. */
import { seedExhibits } from "@/lib/museum-content";

const targets = process.argv.slice(2);
const siWords = new Set([
  "ena","dve","tri","štiri","pet","šest","sedem","osem","devet","deset","enajst","dvanajst",
  "trinajst","štirinajst","petnajst","šestnajst","sedemnajst","osemnajst","devetnajst","dvajset",
  "trideset","štirideset","petdeset","šestdeset","sedemdeset","osemdeset","devetdeset","sto","tisoč",
  "dvesto","tristo","štiristo","petsto","šeststo","sedemsto","osemsto","devetsto",
  // compounds
  "enaindvajset","dvaindvajset","triindvajset","štiriindvajset","petindvajset","šestindvajset","sedemindvajset","osemindvajset","devetindvajset",
  "enaintrideset","dvaintrideset","triintrideset","štiriintrideset","petintrideset","šestintriintrideset","šestintrideset","sedemintrideset","osemintrideset","devetintrideset",
  "enainštirideset","dvainštirideset","triinštirideset","štiriinštirideset","petinštirideset","šestinštirideset","sedeminštirideset","oseminštirideset","devetinštirideset",
  "enainpetdeset","dvainpetdeset","triinpetdeset","štiriinpetdeset","petinpetdeset","šestinpetdeset","sedeminpetdeset","oseminpetdeset","devetinpetdeset",
  "enainšestdeset","dvainšestdeset","triinšestdeset","štiriinšestdeset","petinšestdeset","šestinšestdeset","sedeminšestdeset","oseminšestdeset","devetinšestdeset",
  "enainsedemdeset","dvainsedemdeset","triinsedemdeset","štiriinsedemdeset","petinsedemdeset","šestinsedemdeset","sedeminsedemdeset","oseminsedemdeset","devetinsedemdeset",
  "enainosemdeset","dvainosemdeset","triinosemdeset","štiriinosemdeset","petinosemdeset","šestinosemdeset","sedeminosemdeset","oseminosemdeset","devetinosemdeset",
  "enaindevetdeset","dvaindevetdeset","triindevetdeset","štiriindevetdeset","petindevetdeset","šestindevetdeset","sedemindevetdeset","osemindevetdeset","devetindevetdeset",
]);
const enWords = new Set([
  "one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen",
  "fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty","thirty","forty","fifty",
  "sixty","seventy","eighty","ninety","hundred","thousand",
]);

function contexts(text: string, lang: "si" | "en"): string[] {
  const out: string[] = [];
  const toks = text.split(/\s+/);
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i].replace(/[»«"(),.;:!?–—\d]/g, "");
    const isWord = lang === "si" ? siWords.has(raw) : enWords.has(raw.replace(/-(one|two|three|four|five|six|seven|eight|nine)$/, ""));
    const hasDigit = /\d/.test(toks[i]);
    if (isWord || hasDigit) {
      const ctx = toks.slice(Math.max(0, i - 5), i + 6).join(" ");
      out.push(`    ${ctx}`);
    }
  }
  return out;
}

for (const ex of seedExhibits) {
  if (!targets.includes(ex.slug)) continue;
  console.log(`\n=== ${ex.slug} ===`);
  console.log(`-- TITLE SI: ${ex.titleSi}`);
  console.log(`-- TITLE EN: ${ex.titleEn}`);
  console.log(`-- PERIOD SI: ${ex.periodSi} | EN: ${ex.periodEn} | yF:${ex.yearFrom} yT:${ex.yearTo}`);
  console.log("-- SUMMARY SI numbers:");
  contexts(ex.summarySi, "si").forEach((c) => console.log(c));
  console.log("-- SUMMARY EN numbers:");
  contexts(ex.summaryEn, "en").forEach((c) => console.log(c));
  console.log("-- STORY SI numbers:");
  contexts(ex.storySi, "si").forEach((c) => console.log(c));
  console.log("-- STORY EN numbers:");
  contexts(ex.storyEn, "en").forEach((c) => console.log(c));
}
