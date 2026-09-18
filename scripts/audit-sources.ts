/**
 * AUDIT VIROV — delovna lista za kustodija (34. sklop / SOURCE AUTHORITY).
 *
 * Deterministično pregleda registracijo virov zbirke (src/lib/source-registry.ts)
 * in izpiše stanje, ki ČAKA na kuratorsko odločitev — nič ne spreminja:
 *
 *   1. REGISTR    — koliko vrstic, koliko unikatnih identitet (razred A)
 *   2. B-KANDIDATI— skoraj-isti vir, a ni dokazano (NE združuj samodejno)
 *   3. C-PARI     — podobni imeni, različna dokumenta (NE združuj)
 *   4. D-CITATI   — neidentificirljivi umbrella-citati (»literatura o …«)
 *   5. LICENCE    — konflikti: isti vir, različni licenci (izberi kustodos)
 *   6. TIPI       — isti vir, različen tip nosilca
 *   7. DUPLIKATI  — isti dokument dvakrat v VIRI enega zapisa
 *   8. BESEDNJAK  — vsi licenčni literali + PREDLOG kanonskega besednjaka
 *   9. PRIMARNOST — dejstva po nosilcih (Matricula, arhiv, časopis …);
 *                    podatki nikjer ne označujejo primarnosti — to je
 *                    kuratorska odločitev, ne samodejna
 *
 * Zagon: bun scripts/audit-sources.ts
 */
import { seedExhibits } from "../src/lib/museum-content";
import { SOURCE_USAGE, sourceKeyOf, canonicalUrl } from "../src/lib/source-registry";

type Row = {
  slug: string;
  mvg: string;
  key: string;
  nameSi: string;
  sourceType: string;
  license: string;
  url: string | null;
  noteSi: string | null;
};

const rows: Row[] = [];
for (const ex of seedExhibits) {
  for (const s of ex.sources) {
    rows.push({
      slug: ex.slug,
      mvg: ex.museumNo ?? "—",
      key: s.key,
      nameSi: s.nameSi,
      sourceType: s.sourceType,
      license: s.license,
      url: s.url ?? null,
      noteSi: s.noteSi ?? null,
    });
  }
}

const line = (t = "") => console.log(t);

/* 1 ─ REGISTR ─────────────────────────────────────────────────────────── */
line("1) REGISTR VIROV");
line(`   vrstic virov: ${rows.length} (zapisov: ${seedExhibits.length})`);
const withUrl = rows.filter((r) => r.url).length;
const urlKeys = new Set(rows.filter((r) => r.url).map((r) => sourceKeyOf(r.nameSi, r.url)));
const nameKeys = new Set(rows.filter((r) => !r.url).map((r) => sourceKeyOf(r.nameSi, null)));
line(`   unikatnih identitet (razred A): ${SOURCE_USAGE.size} = ${urlKeys.size} po URL + ${nameKeys.size} po imenu`);
line(`   virov z URL: ${withUrl}, brez URL: ${rows.length - withUrl}`);
const shared = [...SOURCE_USAGE.values()].filter((u) => u.exhibits.length > 1);
line(`   virov, ki jih citira ≥2 zapisov: ${shared.length} (vrstic v njih: ${shared.reduce((n, u) => n + rows.filter((r) => sourceKeyOf(r.nameSi, r.url) === u.key).length, 0)})`);
line();

/* 2 ─ B-KANDIDATI ────────────────────────────────────────────────────── */
line("2) B-KANDIDATI — verjetno isti vir, POTREBUJE kuratorsko odločitev (NE združeno)");
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const tokens = (s: string) => new Set(norm(s).split(" ").filter((w) => w.length > 2));
const noUrl = rows.filter((r) => !r.url);
for (let i = 0; i < noUrl.length; i++) {
  for (let j = i + 1; j < noUrl.length; j++) {
    const A = noUrl[i]!, B = noUrl[j]!;
    const ta = tokens(A.nameSi), tb = tokens(B.nameSi);
    const inter = [...ta].filter((w) => tb.has(w)).length;
    const uni = new Set([...ta, ...tb]).size;
    const jac = uni ? inter / uni : 0;
    const same = sourceKeyOf(A.nameSi, null) === sourceKeyOf(B.nameSi, null);
    // Pogoji kandidata: visoka podobnost imen, a NE bajtno-isto (bajtno-isti
    // citat je že registriran po pravilu A2) — različna ključa.
    if (jac >= 0.75 && !same) {
      line(`   ${A.mvg} ↔ ${B.mvg}  (${jac.toFixed(2)})`);
      line(`      "${A.nameSi.slice(0, 90)}"`);
      line(`      "${B.nameSi.slice(0, 90)}"`);
      if (A.license !== B.license) line(`      licence se razlikujejo: "${A.license}" | "${B.license}"`);
      if (A.sourceType !== B.sourceType) line(`      tipi se razlikujejo: ${A.sourceType} | ${B.sourceType}`);
    }
  }
}
line();

// B-kandidat po identifikatorju: isti OCLC zapis kataloga v dveh URL oblikah
const oclcOf = (u: string): string | null => {
  const m = u.match(/oclc\/(\d+)|title\/(\d+)/i);
  return m ? (m[1] ?? m[2])! : null;
};
const byOclc = new Map<string, Row[]>();
for (const r of rows) {
  if (!r.url) continue;
  const id = oclcOf(r.url);
  if (!id) continue;
  const a = byOclc.get(id) ?? [];
  a.push(r);
  byOclc.set(id, a);
}
for (const [id, a] of byOclc) {
  const canonUrls = new Set(a.map((r) => canonicalUrl(r.url!)));
  if (a.length > 1 && canonUrls.size > 1) {
    line(`   ${a.map((r) => r.mvg).join(" ↔ ")}  (isti OCLC ${id}, ${canonUrls.size} URL oblike)`);
    for (const r of a) line(`      "${r.nameSi.slice(0, 88)}"`);
  }
}

/* 3 ─ C-PARI ──────────────────────────────────────────────────────────── */
line("3) C-PARI — podobni imeni, RAZLIČNA dokumenta (dokaz: različen URL; NE združuj)");
const uniqRows = [...new Map(rows.map((r) => [`${r.mvg}:${r.key}`, r])).values()];
let cPairs = 0;
for (let i = 0; i < uniqRows.length; i++) {
  for (let j = i + 1; j < uniqRows.length; j++) {
    const A = uniqRows[i]!, B = uniqRows[j]!;
    if (!A.url || !B.url) continue;
    // Isti dokument po kanonskem URL-ju → ni C-par (to je razred A);
    // primerjamo kanonske oblike, ne surove nize (www/protokol/kodiranje).
    if (canonicalUrl(A.url) === canonicalUrl(B.url)) continue;
    const ta = tokens(A.nameSi), tb = tokens(B.nameSi);
    const inter = [...ta].filter((w) => tb.has(w)).length;
    const uni = new Set([...ta, ...tb]).size;
    if (uni && inter / uni >= 0.75) {
      cPairs++;
      line(`   ${A.mvg} ↔ ${B.mvg}`);
      line(`      "${A.nameSi.slice(0, 88)}" → ${canonicalUrl(A.url).slice(0, 60)}`);
      line(`      "${B.nameSi.slice(0, 88)}" → ${canonicalUrl(B.url).slice(0, 60)}`);
    }
  }
}
if (cPairs === 0) line("   (ni parov s podobnostjo ≥ 0.75)");
line();

/* 4 ─ D-CITATI ───────────────────────────────────────────────────────── */
line("4) D-CITATI — neidentificirljivi umbrella-citati (brez konkretnega dela)");
for (const r of rows.filter((r) => /literatura o/i.test(r.nameSi))) {
  line(`   ${r.mvg} "${r.nameSi.slice(0, 90)}"`);
}
line();

/* 5 ─ LICENČNI KONFLIKTI ─────────────────────────────────────────────── */
line("5) LICENČNI KONFLIKTI — isti vir (isti sourceKey), različne licence → KURATORSKA ODLOČITEV");
let licN = 0;
for (const u of SOURCE_USAGE.values()) {
  if (u.licenses.length < 2) continue;
  licN++;
  const perLic = u.licenses.map((l) => ({
    lic: l,
    mvgs: rows.filter((r) => sourceKeyOf(r.nameSi, r.url) === u.key && r.license === l).map((r) => r.mvg),
  }));
  line(`   ${licN}. ${u.key.replace(/^(url|ime):/, "").slice(0, 70)}`);
  for (const p of perLic) line(`        • "${p.lic}" (${p.mvgs.join(", ")})`);
  // Dejstvo, ne razsodba: če sta obe vrednosti isti licenčni žeton (npr. obe
  // CC BY-SA 3.0) in se razlikujeta le v navedbi avtorstva, se to zapiše.
  const licTokens = u.licenses.map((l) => (l.match(/CC[0-9A-Z .\-]*|javna last \/ public domain|Public domain|javna last/i) ?? [""])[0]!.trim());
  if (new Set(licTokens).size === 1 && licTokens[0] !== "") {
    line(`        ⟶ dejstvo: obe vrednosti nosita isti licenčni žeton "${licTokens[0]}"; razlikujeta se le v navedbi avtorstva`);
  }
}
line(`   SKUPAJ: ${licN}`);
line();

/* 6 ─ TIP-VI KONFLIKTI ────────────────────────────────────────────────── */
line("6) TIP-VI KONFLIKTI — isti vir, različen tip nosilca (fotografija/spletni-vir/objava …)");
let typN = 0;
for (const u of SOURCE_USAGE.values()) {
  if (u.sourceTypes.length < 2) continue;
  typN++;
  const perType = u.sourceTypes.map((t) => ({
    t,
    mvgs: rows.filter((r) => sourceKeyOf(r.nameSi, r.url) === u.key && r.sourceType === t).map((r) => r.mvg),
  }));
  line(`   ${typN}. ${u.key.replace(/^(url|ime):/, "").slice(0, 70)}`);
  for (const p of perType) line(`        • ${p.t} (${p.mvgs.join(", ")})`);
}
line(`   SKUPAJ: ${typN}`);
line();

/* 7 ─ ZNOTRAJ-ZAPISNI DUPLIKATI ───────────────────────────────────────── */
line("7) ZNOTRAJ-ZAPISNI DUPLIKATI — isti dokument citiran dvakrat v VIRI enega zapisa");
for (const ex of seedExhibits) {
  const seen = new Map<string, number>();
  for (const s of ex.sources) {
    const k = sourceKeyOf(s.nameSi, s.url ?? null);
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  for (const [k, n] of seen) {
    if (n > 1) line(`   ${ex.museumNo ?? ex.slug} (${ex.slug}): ×${n} → ${k.replace(/^(url|ime):/, "").slice(0, 70)}`);
  }
}
line();

/* 8 ─ BESEDNJAK LICENC ────────────────────────────────────────────────── */
line("8) BESEDNJAK LICENC — vsi literali + PREDLOG kanonskega besednjaka (NI apliciran)");
line("   PREDLOG kategorij (dokumentiran v poročilu 34. sklopa; pretvorba LE s kuratorskim dokazom):");
line("   CC_BY_* · CC_BY_SA_* · CC0 · PUBLIC_DOMAIN · ATTRIBUTION_REQUIRED · COPYRIGHT ·");
line("   INFORMATIONAL (opis javnosti, ni licenca) · CARRIER_NOTE (opis nosilca/oblike) · ACCESS_NOTE (dostop) · UNKNOWN");
const licMap = new Map<string, number>();
for (const r of rows) licMap.set(r.license, (licMap.get(r.license) ?? 0) + 1);
line(`   unikatnih literalov: ${licMap.size}`);
const categoryOf = (l: string): string => {
  const s = l.toLowerCase();
  if (/cc0/.test(s)) return "CC0";
  if (/cc by-sa/.test(s)) return "CC_BY_SA";
  if (/cc by/.test(s)) return "CC_BY";
  if (/gfdl/.test(s)) return "CC_BY (mešano GFDL)";
  if (/public domain|javna last/.test(s)) return "PUBLIC_DOMAIN";
  if (/avtorsko delo|copyrighted/.test(s)) return "COPYRIGHT";
  if (/navedi vir|navedba vira/.test(s)) return "ATTRIBUTION_REQUIRED";
  if (/javna informacija|javni informacijski|javni rezultati|občinska spletna|stran društva/.test(s)) return "INFORMATIONAL";
  if (/prosti dostop|open access/.test(s)) return "ACCESS_NOTE";
  if (/bibliografski citat|knjižnični zapis|kataložni zapis|uradni register|novičarski članek|šolska novica|pisni vir|objavljeni koledar|knjižna izdaja|citirano po/.test(s)) return "CARRIER_NOTE";
  if (/različne licence/.test(s)) return "UNKNOWN (različne)";
  return "UNKNOWN";
};
const catCounts = new Map<string, number>();
for (const [l, c] of licMap) {
  const cat = categoryOf(l);
  catCounts.set(cat, (catCounts.get(cat) ?? 0) + c);
}
line("   pokritost po predlaganih kategorijah (vrstice):");
for (const [cat, c] of [...catCounts.entries()].sort((a, b) => b[1] - a[1])) {
  line(`        ${String(c).padStart(3)} × ${cat}`);
}
line();

/* 9 ─ PRIMARNOST (DEJSTVA) ────────────────────────────────────────────── */
line("9) PRIMARNOST — DEJSTVA po nosilcih (podatki nikjer ne označujejo primarnosti)");
const domain = (u: string | null): string => {
  if (!u) return "brez URL (tisk)";
  try {
    const h = new URL(u).hostname.replace(/^www\./, "");
    if (/matricula-online\.eu$/.test(h)) return "Matricula (matične knjige)";
    if (/commons\.wikimedia\.org$/.test(h)) return "Wikimedia Commons";
    if (/wikipedia\.org$/.test(h)) return "Wikipedija";
    if (/radio-odeon\.com$/.test(h)) return "Radio Odeon (lokalni)";
    if (/rtvslo\.si$/.test(h)) return "RTV Slovenija";
    if (/svet24\.si$|delo\.si$|moja-dolenjska\.si$/.test(h)) return "časopisi (Svet24/Delo/MD)";
    if (/kamra\.si$/.test(h)) return "Kamra (digitalne zbirke knjižnic)";
    if (/crnomelj\.si$|kp-kolpa\.si$|os-loka.*\.si$|dups\.si$|vaskanal\.com$/.test(h)) return "lokalne/krajevne strani";
    if (/gov\.si$|zvkds\.si$|arso\.gov\.si$/.test(h)) return "državni organi/registri";
    return "ostalo";
  } catch {
    return "(neveljaven URL)";
  }
};
const domCounts = new Map<string, number>();
for (const r of rows) {
  const d = domain(r.url);
  domCounts.set(d, (domCounts.get(d) ?? 0) + 1);
}
for (const [d, c] of [...domCounts.entries()].sort((a, b) => b[1] - a[1])) {
  line(`        ${String(c).padStart(3)} × ${d}`);
}
line();
line("   Dejstvo: noben vir nima oznake primarnosti/sekundarnosti — polje ne obstaja.");
line("   Matricula (matične knjige z signaturami) in arhivski tipi so kandidati za");
line("   kuratorsko oznako; opomba MVG-039 sama izjavlja »Primarni vir« (vpisi 44–97).");
