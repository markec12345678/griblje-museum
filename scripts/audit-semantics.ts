/** Semantična revizija: starosti, obletnice, trajanja — aritmetične preverbe. */
import { seedExhibits } from "./src/lib/museum-content";

const reBirthDeath = /(\d{4})\s*[–—-]\s*(\d{4})/g;
const reBirthday = /(\d{1,3})\.\s*(rojstn\w*)/gi;
const reAnniv = /(\d{2,4})\.\s*(obletnic\w*|stoletnic\w*|petstoletnic\w*|tisocletnic\w*)/gi;
const reSprings = /(\d{1,3})\s*(pomlad\w*|zim\w*|jesen\w*|polet\w*)/gi;
const reAgeYears = /(\d{1,3})\s*let\s*(star\w*|dela|dela pri)|star\w*\s*(\d{1,3})\s*let/gi;
const reYearsOf = /(\d{1,3})[- ]letn\w*\s*(trad\w*|zgodovin\w*|dela|obdobj)/gi;

for (const e of seedExhibits) {
  const issues: string[] = [];
  const txt = `${e.summarySi}\n${e.storySi}`;
  const txtEn = `${e.summaryEn}\n${e.storyEn}`;

  // rojstvo-smrt vs starost
  const bd: Array<[number, number]> = [];
  let m: RegExpExecArray | null;
  while ((m = reBirthDeath.exec(txt))) {
    const a = +m[1], b = +m[2];
    if (b > a && b - a < 120 && a > 1500 && b < 2100) bd.push([a, b]);
  }
  for (const [a, b] of bd) {
    // starostne trditve v istem zapisu
    while ((m = reBirthday.exec(txt))) {
      const n = +m[1];
      if (n !== b - a && Math.abs(n - (b - a)) <= 3 && n > 20) {
        issues.push(`rojstvo-smrt ${a}–${b} (=${b - a} let) vs "${m[0]}" (${n}) — MISMATCH`);
      }
    }
    while ((m = reSprings.exec(txt))) {
      const n = +m[1];
      if (n > 20 && n !== b - a && Math.abs(n - (b - a)) <= 4) {
        issues.push(`rojstvo-smrt ${a}–${b} (=${b - a}) vs "${m[0]}" (${n}) — preveri`);
      }
    }
    reBirthday.lastIndex = 0; reSprings.lastIndex = 0;
  }

  // obletnice: ustanovitev + N. obletnica v letu Y → Y - N mora biti ustanovitveno leto
  while ((m = reAnniv.exec(txt))) {
    const n = +m[1];
    const years = (txt.match(/\b(1[5-9]\d\d|20[0-2]\d)\b/g) ?? []).map(Number);
    // poišči letnici okoli
    for (const y of years) {
      const founding = y - n;
      if (founding > 1400 && founding < 2030 && !txt.includes(String(founding)) && years.includes(y)) {
        // ustanovitveno leto ni v besedilu — sumljivo samo, če je razred 100/500
        if (n % 100 === 0) {
          issues.push(`"${m[0]}" ob letu ${y} → temeljno leto ${founding} ni omenjeno v besedilu — preveri`);
        }
      }
    }
  }

  // ustanovitev iz yearFrom + "N-letna tradicija"
  while ((m = reYearsOf.exec(txt))) {
    const n = +m[1];
    if (e.yearFrom && e.yearFrom > 1800) {
      const impliedNow = e.yearFrom + n;
      if (impliedNow < 2024 || impliedNow > 2030) {
        issues.push(`"${m[0]}" (${n}) + yearFrom=${e.yearFrom} → ${impliedNow}, ne v 2024–2030 — preveri`);
      }
    }
  }

  // EN/SLO letnice rojstva-smrti oseb
  const bdEn: string[] = [];
  while ((m = reBirthDeath.exec(txtEn))) bdEn.push(`${m[1]}–${m[2]}`);
  const bdSi = bd.map(([a, b]) => `${a}–${b}`);
  for (const x of bdEn) if (!bdSi.includes(x)) issues.push(`EN rojstvo-smrt ${x} ni v SLO besedilu (${bdSi.join(", ")})`);

  if (issues.length) {
    console.log(`\n=== ${e.slug} — "${e.titleSi}"`);
    for (const i of issues) console.log(`   ! ${i}`);
  }
}
console.log("\n--- konec semantične revizije ---");
