/**
 * AUDIT VIROV — delovna lista za kustodija (36. sklop / TASK 38 — KURATORSKA
 * VALIDACIJA SOURCE AUTHORITY; prva različica 34. sklopa / TASK 37).
 *
 * Deterministično pregleda registracijo virov zbirke (src/lib/source-registry.ts)
 * in izpiše stanje, ki ČAKA na kuratorsko odločitev — nič ne spreminja:
 *
 *   1. REGISTR     — vrstice, identitete (razred A), deljeni viri
 *   2. B-KANDIDATI — skoraj-isti vir, ni dokazano (NE združuj samodejno)
 *   3. C-PARI      — podobni imeni, različna dokumenta (NE združuj)
 *   4. D-CITATI    — neidentificirljivi umbrella-citati (»literatura o …«)
 *   5. LICENCE     — konflikti z ločitvijo (TASK 38 §2):
 *                       A = dejanski licenčni konflikt (različni pravni žetoni)
 *                       B = isti licenčni status, različna atribucija/opis
 *                    + PREVERJENA dejstva iz spletnih virov (§0/§3)
 *   6. TIPI        — isti vir, različen tip nosilca + anomalije tipov
 *   7. DUPLIKATI   — isti dokument dvakrat v VIRI enega zapisa
 *   8. BESEDNJAK   — literali licenc + SAFE TO AUTO-MAP (TASK 38 §9)
 *   9. MATRICULA   — 4 signature + obstoječe kuratorske izjave o primarnosti
 *  10. BREZ URL    — razvrstitev 26 vrstic (A/B/C/D, TASK 38 §6)
 *  11. KURATORSKA VRSTA (QUEUE) — P0–P4: pravice, identiteta, bibliografija,
 *                    primarnost, prihodnji strukturirani podatki (TASK 38 §10)
 *
 * Načelo TASK 38: nič ne ugibamo. Kar gre neposredno preveriti na viru, je
 * zapisano kot PREVERJENO (z datumom in metodo); kar preveriti ne gre, ostane
 * UNKNOWN / CURATORIAL REVIEW. Skripta ne izbere licence, ne združi identitet
 * in ne spremeni tipov — pripravi vprašanja, ki jih kustos reši hitro.
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
const mvgsOf = (key: string) =>
  [...new Set(rows.filter((r) => sourceKeyOf(r.nameSi, r.url) === key).map((r) => r.mvg))];

/* ── Pravni žeton vrednosti licenčnega polja (TASK 38 §2) ────────────────
 * Vrnemo žeton, ki ga vrednost IZRECNO zapisuje (CC…, public domain/javna
 * last, avtorsko delo/copyrighted) — ali null, če je vrednost čista opisna
 * oznaka brez pravnega statusa (»navedi vir«, »šolska novica« …).
 * Žeton je izluščen IZ SAME VREDNOSTI — brez razlage, brez zunanjih virov. */
function licTokenOf(l: string): string | null {
  const s = l.toLowerCase();
  const m = s.match(/(cc0 ?1?\.?0?|cc by(?:-sa|-nc)? ?[0-9]*(?:\.[0-9])?)/);
  if (m) return m[1].replace(/\s+/g, " ").trim();
  if (/public domain|javna last/.test(s)) return "public domain";
  if (/avtorsko delo|copyrighted/.test(s)) return "copyright";
  return null;
}

/* ── PREVERJENA DEJSTVA (neposreden dostop 18. 9. 2026; curl/API Commons) ──
 * Zapisano po naročilu TASK 38 §0: »Če je mogoče nekaj potrditi neposredno
 * iz obstoječega vira, to preveri.« Datum in metoda sta del zapisa. */
const VERIFIED_FACTS: Record<string, string> = {
  "commons.wikimedia.org/wiki/File:Griblje,_Črnomelj.jpg":
    "PREVERJENO (Commons extmetadata, 18. 9. 2026): licenca CC BY-SA 3.0, avtor Eleassar (lastno delo) — žeton v obeh muzejskih vrednostih je skladen z virom; izbira zapisovanja atribucije (avtor:/fotograf:) je kuratorska",
  "commons.wikimedia.org/wiki/File:Pogovor_angleškega_pilota_s_partizani,_Griblje_pri_Črnomlju,_marec_1945.jpg":
    "PREVERJENO (Commons extmetadata, 18. 9. 2026): licenca Public domain, avtor Franjo Veselko — »domnevno isti avtor« v MVG-014 potrjujejo metapodatki vira (avtor je izrecno naveden); žeton PD je skladen",
  "commons.wikimedia.org/wiki/File:Special-Karte_des_Herzogthums_Krain_1843.jpg":
    "PREVERJENO (Commons extmetadata, 18. 9. 2026): licenca Public domain, avtor (kartograf) Heinrich Freyer — žeton javna last/PD je skladen v obeh vrednostih; vsebina datoteke je ZEMLJEVID (posnetek lista 1843), v MVG-030 zapisan kot fotografija (glej 6)",
  "radio-odeon.com":
    "PREVERJENO (18. 9. 2026): noga vseh strani »© Artist d.o.o. 2026, Vse pravice pridržane.«; izdajatelj Artist d.o.o. (impresum), odgovorni urednik Aleksander Riznič; NOBENA licenca za ponovno uporabo NI objavljena (ni strani s pogoji, ni CC); avtorstvo je navedeno pri posameznih prispevkih (npr. »Avtor: KS Griblje, foto: Jani Pavlin«; »Avtor: Boris Grabrijan«; »Foto: Iva Konda, Vir: Misterion«; »Foto: Nikola Vukmanič«) — »navedi vir« je uredniška navedba muzeja, ne izjava vira; kot dodeljena licenca → UNKNOWN / CURATORIAL REVIEW",
  "svet24.si":
    "PREVERJENO (18. 9. 2026): noga »© 2026 Media partner agencija d.o.o. – Vse pravice pridržane.« + povezava Splošni pogoji; licenca za ponovno uporabo NI objavljena — kot dodeljena licenca → UNKNOWN / CURATORIAL REVIEW",
  "os-loka-crnomelj.si":
    "PREVERJENO (18. 9. 2026, PDF Pravila in pogoji uporabe): vsebine so »informativnega značaja« (podpira »javna informacija«) in so »zaščiteno avtorsko delo … Vse pravice so pridržane« — kopiranje/distribucija/druga uporaba brez pisnega dovoljenja OŠ Loka Črnomelj nista dovoljena; obe muzejski vrednosti sta opisni, licenca vira je izrecna in ostrejša",
  "etno-muzej.si":
    "PREVERJENO (18. 9. 2026): domača stran in stran O muzeju brez omembe avtorskih pravic/licenc; /sl/pogoji-uporabe → 404 — pogojev uporabe NI MOGOČE preveriti → UNKNOWN / CURATORIAL REVIEW",
  "crnomelj.si":
    "PREVERJENO (18. 9. 2026): v vidnem besedilu ni pravic/licenc; le meta <meta name=copyright content=»Copyright Arctur d.o.o. Vse pravice pridržane.«> (Arctur = izdelovalec spletne strani, ne občina) — razlaga meta oznake je kuratorska; pogoji uporabe vsebine NI MOGOČE preveriti → UNKNOWN / CURATORIAL REVIEW",
  "matricula-online.eu":
    "PREVERJENO (18. 9. 2026): vse 4 signature (01733/01723/04795/04894) žive, vrste knjig v naslovih strani se skladajo z zapisom (mrliška/krstna/poročna/mrliška); pogoji uporabe (ICARUS — Nutzungsbedingungen): podatki SAMO za zasebne ali znanstvene namene; pomnoževanje/objava/prenos naprej zahteva soglasje prizadetega arhiva; pri spletnih publikacijah zadostuje navedba povezave + obvestilo Matriculi — »prosti dostop« je opis DOSTOPA, ne licenca",
  "worldcat.org":
    "REŠENO (TASK 38, 18. 9. 2026): obe prejšnji URL-obliki sta nosili isti OCLC 821110335; en zapis »Gribeljski žbul« s petimi avtoricami (Babič Ivaniš, Črnič, Pezdirc, Totter, Weiss) na search.worldcat.org — URL v MVG-089 normaliziran na trenutno obliko, identiteta združena po pravilu A1 (316 → 315 identitet, dokumentirano)",
};
const verifiedFor = (key: string): string | null => {
  const k = key.replace(/^(url|ime):/, "");
  for (const [frag, fact] of Object.entries(VERIFIED_FACTS)) {
    if (k.startsWith(frag) || k.includes(frag)) return fact;
  }
  return null;
};

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
line("   opomba: 315 identitet = 316 (TASK 37) − 1 dokumentirana združitev WorldCat OCLC 821110335");
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
    if (jac >= 0.75 && !same) {
      line(`   ${A.mvg} ↔ ${B.mvg}  (${jac.toFixed(2)})`);
      line(`      "${A.nameSi}"`);
      line(`      "${B.nameSi}"`);
      if (A.license !== B.license) line(`      licence se razlikujejo: "${A.license}" | "${B.license}"`);
      if (A.sourceType !== B.sourceType) line(`      tipi se razlikujejo: ${A.sourceType} | ${B.sourceType}`);
    }
  }
}
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
if (byOclc.get("821110335")?.length) line("   (WorldCat OCLC 821110335: REŠENO v TASK 38 — normalizirano, glej 1)");
// Novejši B-kandidat TASK 38 (podobnost pod pragom, a enak naslov + avtorica):
line("   B-kandidat TASK 38 (ročno odkrit; Jaccard 0.50 < prag — enak naslov dela in avtorica, različna publikacija):");
line("      MVG-010 ↔ MVG-043  »Šopek poljskih cvetlic iz Gribelj v Beli Krajini« — Katarina Zupanič");
line(`         MVG-010: "${rows.find((r) => r.mvg === "MVG-010" && /Zupanič: Šopek/.test(r.nameSi))?.nameSi?.slice(0, 100) ?? "?"}"`);
line(`         MVG-043: "${rows.find((r) => r.mvg === "MVG-043" && /Etnolog/.test(r.nameSi))?.nameSi?.slice(0, 100) ?? "?"}"`);
line("         isto delo v dveh navedbah publikacije (Županičev zbornik 1939 | Etnolog 1937/9)? → KURATORSKA ODLOČITEV");
line();

/* 3 ─ C-PARI ──────────────────────────────────────────────────────────── */
line("3) C-PARI — podobni imeni, RAZLIČNA dokumenta (dokaz: različen URL; NE združuj)");
const uniqRows = [...new Map(rows.map((r) => [`${r.mvg}:${r.key}`, r])).values()];
let cPairs = 0;
for (let i = 0; i < uniqRows.length; i++) {
  for (let j = i + 1; j < uniqRows.length; j++) {
    const A = uniqRows[i]!, B = uniqRows[j]!;
    if (!A.url || !B.url) continue;
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
line("   status (TASK 38 §5): KONKRETNO DELO NI ZNANO → CURATORIAL DATA NEEDED");
line();

/* 5 ─ LICENČNI KONFLIKTI (z ločitvijo A/B, TASK 38 §1+§2) ────────────── */
line("5) LICENČNI KONFLIKTI — isti vir (isti sourceKey), različni licenčni zapis");
line("   LOČITEV (TASK 38 §2):  A = dejanski licenčni konflikt (različna pravna žetona");
line("   ali žeton proti opisni vrednosti)  |  B = isti licenčni status, različna");
line("   atribucija/opis (isti žeton, ali obe vrednosti brez žetona)");
let licN = 0, kindA = 0, kindB = 0;
for (const u of SOURCE_USAGE.values()) {
  if (u.licenses.length < 2) continue;
  licN++;
  const toks = u.licenses.map(licTokenOf);
  const sameTok = toks[0] !== null && toks[0] === toks[1];
  const noneTok = toks.every((t) => t === null);
  const kind = sameTok || noneTok ? "B" : "A";
  if (kind === "A") kindA++; else kindB++;
  const sub = sameTok ? "isti žeton, različna navedba avtorstva" : noneTok ? "obe vrednosti opisni — nobena ne zapisuje pravice" : "različna žetona";
  const perLic = u.licenses.map((l) => ({
    lic: l,
    mvgs: rows.filter((r) => sourceKeyOf(r.nameSi, r.url) === u.key && r.license === l).map((r) => r.mvg),
  }));
  line(`   ${licN}. [${kind}] ${u.key.replace(/^(url|ime):/, "").slice(0, 66)}`);
  for (const p of perLic) line(`        • "${p.lic}" (${p.mvgs.join(", ")})`);
  line(`        razred ${kind}: ${sub}`);
  const fact = verifiedFor(u.key);
  if (fact) line(`        ${fact}`);
  else line(`        preverjanje vira: ni bilo mogoče (ni znanega dejstva) → UNKNOWN / CURATORIAL REVIEW`);
}
line(`   SKUPAJ: ${licN} (A: ${kindA} dejanskih konfliktov, B: ${kindB} atribucijskih/opisnih razlik)`);
line();

/* 6 ─ TIP-VI KONFLIKTI + ANOMALIJE ───────────────────────────────────── */
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
line("   Anomalije tipa (TASK 38 §8 — kandidati za kuratorski pregled, NIČ spremenjeno):");
for (const r of rows.filter((r) => !r.url && /spletni/i.test(r.sourceType))) {
  line(`   • ${r.mvg} tip=${r.sourceType} BREZ URL — "${r.nameSi.slice(0, 80)}"`);
}
line("   • MVG-030 Special-Karte 1843 tip=fotografija — vsebina je ZEMLJEVID (dokaz: Commons); MVG-077 isti vir tip=zemljevid");
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

/* 8 ─ BESEDNJAK LICENC (s SAFE TO AUTO-MAP, TASK 38 §9) ───────────────── */
line("8) BESEDNJAK LICENC — literal | št. vrstic | predlog kategorije | varna preslikava?");
line("   PRAVILO: SAFE TO AUTO-MAP LE, če je semantika popolnoma jasna iz same vrednosti");
line("   (natančen licenčni žeton). »navedi vir« NIKOLI ne postane ATTRIBUTION_REQUIRED.");
const licMap = new Map<string, number>();
for (const r of rows) licMap.set(r.license, (licMap.get(r.license) ?? 0) + 1);
const categoryOf = (l: string): string => {
  const s = l.toLowerCase();
  if (/cc0/.test(s)) return "CC0";
  if (/cc by-sa/.test(s)) return "CC_BY_SA";
  if (/cc by-nc/.test(s)) return "CC_BY_NC";
  if (/cc by/.test(s)) return "CC_BY";
  if (/gfdl/.test(s)) return "CC_BY (mešano GFDL)";
  if (/public domain|javna last/.test(s)) return "PUBLIC_DOMAIN";
  if (/avtorsko delo|copyrighted/.test(s)) return "COPYRIGHT";
  if (/navedi vir|navedba vira/.test(s)) return "(ni licenca) opis atribucije";
  if (/javna informacija|javni informacijski|javni rezultati|občinska spletna|stran društva/.test(s)) return "(ni licenca) informativni opis";
  if (/prosti dostop|open access/.test(s)) return "(ni licenca) opis dostopa";
  if (/bibliografski citat|knjižnični zapis|kataložni zapis|uradni register|novičarski članek|šolska novica|pisni vir|objavljeni koledar|knjižna izdaja|citirano po/.test(s)) return "(ni licenca) opis nosilca";
  if (/različne licence/.test(s)) return "UNKNOWN (različne)";
  return "UNKNOWN";
};
const safeOf = (l: string): { safe: boolean; reason: string } => {
  const s = l.toLowerCase();
  if (/različne licence/.test(s)) return { safe: true, reason: "vrednost sama izjavlja nedoločenost → UNKNOWN" };
  const tok = licTokenOf(l);
  if (tok && /cc|public domain|javna last/.test(tok) && !/gfdl/.test(s)) {
    return { safe: true, reason: `žeton »${tok}« je iz vrednosti samé; atribucija v oklepaju se ohrani ločeno` };
  }
  if (tok === "copyright") {
    return { safe: true, reason: "vrednost izrecno uveljavlja avtorske pravice (zapis trditve, ne njena preverba)" };
  }
  if (/gfdl/.test(s)) return { safe: false, reason: "dvojna licenca (CC BY x / GFDL) — izbira zahteva kuratorsko odločitev" };
  return { safe: false, reason: "opisna vrednost brez pravnega žetona — ne preslikamo (npr. v ATTRIBUTION_REQUIRED)" };
};
let safeRows = 0, unsafeRows = 0;
const sortedLic = [...licMap.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
for (const [l, c] of sortedLic) {
  const { safe, reason } = safeOf(l);
  if (safe) safeRows += c; else unsafeRows += c;
  line(`   ${String(c).padStart(3)}× ${safe ? "DA " : "NE "} ${categoryOf(l).padEnd(28)} "${l.slice(0, 72)}"`);
}
line(`   SKUPAJ: ${licMap.size} literalov — SAFE ${safeRows} vrstic / NE ${unsafeRows} vrstic (od ${rows.length})`);
line();

/* 9 ─ MATRICULA (TASK 38 §7) ──────────────────────────────────────────── */
line("9) MATRICULA — 4 signature + obstoječe kuratorske izjave (NIČ dodano, NIČ označeno samodejno)");
for (const r of rows.filter((r) => r.url && /matricula/i.test(r.url))) {
  const sig = r.url!.match(/\/(\d{4,5})\/?$/)?.[1] ?? "—";
  const primarni = /primarni vir/i.test(r.noteSi ?? "");
  line(`   ${r.mvg}  signatura ${sig}  [${r.sourceType}]  lic="${r.license}"`);
  line(`        ime: ${r.nameSi.slice(0, 96)}`);
  line(`        ${primarni ? "obstoječa kuratorska izjava v opombi: »Primarni vir …«" : "opomba ne izjavlja primarnosti"}`);
}
line(`   ${VERIFIED_FACTS["matricula-online.eu"]}`);
line();

/* 9b ─ druge obstoječe izjave o primarnosti v opombah virov ───────────── */
line("   Obstoječe izjave o primarnosti v opombah (dejstvo iz podatkov, ne AI presoja):");
for (const r of rows.filter((r) => /primarni (vir|objavljeni|tiskani)/i.test(r.noteSi ?? ""))) {
  if (r.url && /matricula/i.test(r.url)) continue;
  const m = (r.noteSi ?? "").match(/[^.]*[Pp]rimarn[^.]*\./);
  line(`   • ${r.mvg} — ${m ? m[0].trim().slice(0, 110) : "opomba vsebuje izjavo o primarnosti"}`);
}
line();

/* 10 ─ VIRI BREZ URL (TASK 38 §6) ─────────────────────────────────────── */
line("10) VIRI BREZ URL — razvrstitev 26 vrstic (A/B/C/D)");
line("    A = tisk, dovolj identificiran | B = tisk, manjka bibliografski podatek");
line("    C = umbrella citat | D = nejasen vir");
line("    (popravek štetja TASK 37: 26 = 21 ne-umbrella + 5 umbrella; ne »23 tisk + 5«)");
const NO_URL_CLASS: Record<string, string> = {
  "MVG-001|Jože Šimec: Izvor imena vasi Griblje, Dolenjski list, 11. januarja 2001": "A: avtor+naslov+publikacija+datum (stran je v obliki MVG-068: str. 17)",
  "MVG-001|Marko Snoj": "A: avtor+naslov+založba+kraj+leto+stran (bajtno-isti dvojnik MVG-030 — A2)",
  "MVG-002|Sv. Vid Griblje": "B: naslov+leto; manjka izdajatelj/hranilec (identiteta → P1-2)",
  "MVG-009|Strokovna literatura": "C: umbrella — konkretno delo ni znano",
  "MVG-010|Katarina Zupanič": "A: avtorica+naslov+zbornik+kraj+leto (identiteta → P1-3)",
  "MVG-017|Slovenska etnografska literatura o kmečki hiši": "C: umbrella",
  "MVG-020|Slovenska etnografska in kulinarična literatura": "C: umbrella",
  "MVG-021|Slovenska etnografska literatura o predenju": "C: umbrella",
  "MVG-022|Kmečki glas": "B: naslov+publikacija+leto; manjka datum/št./stran; tip spletni-vir brez URL (→ P2-4)",
  "MVG-022|Slovenska etnografska literatura o oranju": "C: umbrella",
  "MVG-030|Marko Snoj": "A: (A2 dvojnik MVG-001)",
  "MVG-034|Nikolaj Dragoš: Mojih sto let": "B: avtor+naslov; manjka leto/izdajatelj (muzej išče izvod → P2-2)",
  "MVG-035|Pirc Krasinski": "A: psevdonim+avtor+naslov+publikacija+datum",
  "MVG-043|Etnolog": "B: naslov+avtorica+revija+leto; manjka letnik/strani (identiteta → P1-3, P2-3)",
  "MVG-044|Bibliografija Tonija Gašperiča": "C: sklic na opus (več del), ne na eno delo; dela so določljiva v katalogih (opomba)",
  "MVG-048|SV. VID GRIBLJE": "B: naslov+leto; manjka hranilec (identiteta → P1-2)",
  "MVG-058|Bibliografija: Janko Barle": "A: popoln citat (revija, letnik, strani; A2 dvojnik MVG-064)",
  "MVG-059|Bibliografija: Zvonko Rus": "A: popoln citat (zbornik, leto, strani)",
  "MVG-060|Bibliografija: Janez Dular, Slavko Ciglenečki": "A: popoln citat monografije (serija, kraj, leto)",
  "MVG-060|Bibliografija: Janez Dular, »Podzemelj«": "A: avtor+naslov+serija/št.+leto",
  "MVG-063|Bibliografija: Jože Dular, »Dr. Niko Županič": "B: avtor+naslov; manjka leto/izdajatelj (→ P2-1)",
  "MVG-064|Bibliografija: Janko Barle": "A: (A2 dvojnik MVG-058)",
  "MVG-068|Bibliografija: Jože Šimec": "A: popoln citat z »str. 17« (Wikipedia seznam potrjuje: stran 17)",
  "MVG-077|Jože Šimec: Izvor imena vasi Griblje, Dolenjski list, 11. 1. 2001": "A: avtor+naslov+publikacija+datum",
  "MVG-092|Pivec Stele": "D: opis del (»študiji«) brez naslovov; citirano po Wikipediji (→ P2-5)",
  "MVG-092|Gašperič, P., Orožen Adamič, M.": "A: avtorji+naslov+leto+založba; v opombi URN:NBN dlib (→ P2-6)",
};
const clsCount = { A: 0, B: 0, C: 0, D: 0 };
for (const r of noUrl) {
  const k = Object.keys(NO_URL_CLASS).find(
    (kk) => kk.startsWith(`${r.mvg}|`) && r.nameSi.startsWith(kk.split("|")[1]!.trim()),
  );
  const cls = k ? NO_URL_CLASS[k]!.slice(0, 1) : "?";
  if (cls !== "?") clsCount[cls as keyof typeof clsCount]++;
  line(`    [${cls}] ${r.mvg} "${r.nameSi.slice(0, 78)}"`);
  if (k) line(`         ${NO_URL_CLASS[k]}`);
}
line(`    SKUPAJ: ${noUrl.length} = A ${clsCount.A} + B ${clsCount.B} + C ${clsCount.C} + D ${clsCount.D}`);
line();

/* 11 ─ KURATORSKA VRSTA (TASK 38 §10) ────────────────────────────────── */
line("11) KURATORSKA VRSTA — P0 pravice | P1 identiteta | P2 bibliografija |");
line("    P3 primarnost | P4 prihodnji strukturirani podatki");
line("    Vsaka vrstica: ID | MVG | VIR | VPRAŠANJE | OBSTOJEČ DOKAZ | POTREBNA ODLOČITEV");
type Q = { id: string; mvg: string; source: string; question: string; evidence: string; decision: string };
const queue: Q[] = [];
// P0 — A-konflikti (11) + B-konflikti (6): generirano iz dejstev zgoraj
for (const u of SOURCE_USAGE.values()) {
  if (u.licenses.length < 2) continue;
  const toks = u.licenses.map(licTokenOf);
  const sameTok = toks[0] !== null && toks[0] === toks[1];
  const noneTok = toks.every((t) => t === null);
  const kind = sameTok || noneTok ? "B" : "A";
  const mvgs = mvgsOf(u.key).join(", ");
  const src = u.key.replace(/^(url|ime):/, "").slice(0, 56);
  const vals = u.licenses.map((l) => `"${l}"`).join("  |  ");
  const fact = verifiedFor(u.key) ?? "ni preverjenega dejstva o viru";
  queue.push(kind === "A"
    ? {
        id: `P0-${String(queue.filter((q) => q.id.startsWith("P0-")).length + 1).padStart(2, "0")}`,
        mvg: mvgs,
        source: src,
        question: "Kateri licenčni zapis naj velja za ta vir?",
        evidence: `A (dejanski konflikt): ${vals}. ${fact}`,
        decision: "izbira pravic (kustos); NIČ ne sklepamo sami",
      }
    : {
        id: `P0-${String(queue.filter((q) => q.id.startsWith("P0-")).length + 1).padStart(2, "0")}`,
        mvg: mvgs,
        source: src,
        question: "Uskladitev zapisa: isti žeton / obe vrednosti opisni — katera oblika?",
        evidence: `B (isti status, različna atribucija/opis): ${vals}. ${fact}`,
        decision: "uskladitev navedbe (kustos); licenčni žeton je že usklajen",
      });
}
// (ločena push klica: ID se izračuna ob vsakem vstavljanju, brez dvojnikov)
queue.push({
  id: `P0-${String(queue.filter((q) => q.id.startsWith("P0-")).length + 1).padStart(2, "0")}`,
  mvg: "vsa zbirka",
  source: "89 licenčnih literalov",
  question: "Sprejem kontroliranega besednjaka licenc (glej 8)",
  evidence: "59 literalov (242 vrstic) ima jasen žeton iz vrednosti samé → mehanska preslikava možna; 30 literalov (170 vrstic) je opisnih ali dvojičnih → vsak posebej ali izrecno UNKNOWN",
  decision: "sprejem besednjaka + odločitev za NE-skupino",
});
queue.push({
  id: `P0-${String(queue.filter((q) => q.id.startsWith("P0-")).length + 1).padStart(2, "0")}`,
  mvg: "MVG-037, 038, 039",
  source: "Matricula (6 vrstic)",
  question: "Kateri licenčni zapis naj velja namesto opisa dostopa »prosti dostop«?",
  evidence: "PREVERJENI pogoji ICARUS: samo zasebna/znanstvena uporaba; objava zahteva soglasje arhiva; pri spletnih objavah navedba povezave + obvestilo",
  decision: "formulacija licenčnega zapisa (kustos)",
});
// P1 — identiteta vira
queue.push(
  {
    id: "P1-1",
    mvg: "MVG-001, 068, 077",
    source: "Jože Šimec 2001 — 3 citatne oblike",
    question: "Ali gre za isto delo (en članek) → ena identiteta vira?",
    evidence: "vse tri oblike: isti avtor + naslov + Dolenjski list + 11. 1. 2001; Wikipedia seznam (živ prevzem 18. 9. 2026): »…11. januar 2001, stran 17« — en članek, stran 17",
    decision: "potrditev združitve treh oblik v en vir",
  },
  {
    id: "P1-2",
    mvg: "MVG-002, 048",
    source: "Sv. Vid Griblje 2008 — objava | arhiv",
    question: "En fizični vir v dveh predstavitvah, ali dva vira?",
    evidence: "obe obliki se skladno ujemata z enim vpisom Wikipedia seznama: »SV. VID GRIBLJE, Blagoslovitev in posvetitev zvona, Spominska knjiga, Griblje 2008«; tip se razlikuje (objava | arhiv)",
    decision: "združitev + izbira tipa nosilca",
  },
  {
    id: "P1-3",
    mvg: "MVG-010, 043",
    source: "Katarina Zupanič 1939 — Županičev zbornik | Etnolog",
    question: "Isti članek v dveh navedbah publikacije?",
    evidence: "enak naslov »Šopek poljskih cvetlic iz Gribelj v Beli Krajini« + ista avtorica; MVG-010: Županičev zbornik Ljubljana 1939; MVG-043: Etnolog 1937/9 — publikacija se razlikuje, dela niso primerjana z izvodi",
    decision: "primerjava izvodov (kustos) — NIČ ne sklepamo",
  },
);
// P2 — bibliografija
queue.push(
  { id: "P2-1", mvg: "MVG-063", source: "Dular, »Dr. Niko Županič« (knjižica)", question: "Manjka leto in izdajatelj — dopolnitev?", evidence: "obstoječi citat: avtor + naslov; ni leta/izdajatelja v podatkih", decision: "bibliografski podatek (kustos)" },
  { id: "P2-2", mvg: "MVG-034", source: "Dragoš, »Mojih sto let«", question: "Manjka leto in izdajatelj — dopolnitev?", evidence: "avtor + naslov; opomba: muzej išče fizični izvod", decision: "bibliografski podatek (kustos)" },
  { id: "P2-3", mvg: "MVG-043", source: "Etnolog — Zupaničeva (1937/9)", question: "Manjka letnik/številka/strani — dopolnitev?", evidence: "naslov + avtorica + revija + leto; opomba: muzej išče izvod zvezka", decision: "bibliografski podatek (kustos)" },
  { id: "P2-4", mvg: "MVG-022", source: "Kmečki glas (65. tekmovanje 2022)", question: "Manjka datum/številka/stran; tip »spletni-vir« brez URL — popravek?", evidence: "naslov + publikacija + leto; tip spletni-vir, URL ni zapisan", decision: "bibliografski podatek + tip (kustos)" },
  { id: "P2-5", mvg: "MVG-092", source: "Pivec Stele (1930) — študiji", question: "Določitev del (naslovi, publikacija)?", evidence: "opis brez naslovov; licenca »citirano po Wikipediji« — posredni citat", decision: "določitev del (kustos); brez tega ostaja D" },
  { id: "P2-6", mvg: "MVG-092", source: "Zemljevid Ilirskih provinc 1812 (ZRC SAZU 2012)", question: "Zapisati URN:NBN:SI:doc-F4NO0ZFV iz opombe kot url?", evidence: "popoln citat (avtorji/leto/založba) + URN v opombi (dlib.si)", decision: "prenos URN v url (kustos)" },
);
// P3 — primarnost
queue.push(
  {
    id: "P3-1",
    mvg: "MVG-037, 038, 039",
    source: "Matricula (matične knjige, 4 signature)",
    question: "Oznaka primarnosti za 6 vrstic Matricula?",
    evidence: "polje primarnosti NE obstaja; MVG-039 opomba izrecno izjavlja »Primarni vir: vpisi 44–97 …« (obstoječa kuratorska izjava); pogoji ICARUS preverjeni (glej vrstico o Matriculi v P0)",
    decision: "uvod polja/oznake + potrditev (kustos) — NE označujemo samodejno",
  },
  {
    id: "P3-2",
    mvg: "MVG-034, 035, 043, 048, 074",
    source: "opombe z izjavami o primarnosti",
    question: "Prenos obstoječih izjav v strukturirano polje?",
    evidence: "5 opomb izrecno izjavlja primarnost (npr. »Primarni objavljeni vir«, »primarni vir številnih zapisov te zbirke«) — obstoječe kuratorske izjave, zapisane v prozi",
    decision: "oblika strukturiranega zapisa (kustos)",
  },
);
// P4 — prihodnji strukturirani podatki
queue.push(
  { id: "P4-1", mvg: "vsa zbirka", source: "tiskani viri (26 brez URL)", question: "Strukturirana polja avtor/leto/publikacija/stran?", evidence: "podatki živijo v prozi imen (TASK 37 §10); primer Šimec: enako jedro v 3 oblikah pokaže vrednost strukturiranosti", decision: "oblika polj (kustos); ekstrakcija ostaja kuratorsko delo" },
  { id: "P4-2", mvg: "B-konflikti 1, 5, 8", source: "atribucije (avtor:/fotograf:/kartograf:)", question: "Atribucija kot strukturirano polje z vlogo?", evidence: "isti vir, različne vloge atribucije (Eleassar, Veselko, Freyer) — Commons metapodatki potrjujejo avtorje", decision: "oblika polja (kustos)" },
  { id: "P4-3", mvg: "MVG-037, 038, 039", source: "signature 01733/01723/04795/04894", question: "Signatura kot strukturirano polje vira?", evidence: "izpričana v imenu + v poti URL (PREDLOG TASK 37 §10); vsi URL-ji živi in vrste knjig se skladajo", decision: "oblika polja (kustos)" },
  { id: "P4-4", mvg: "MVG-009, 017, 020, 021, 022, 044", source: "umbrella citati (5 + 1 opusni)", question: "Konkretizacija del?", evidence: "KONKRETNO DELO NI ZNANO → CURATORIAL DATA NEEDED; pri Gašperiču so dela določljiva v katalogih (opomba)", decision: "navedba del (kustos)" },
);
for (const q of queue) {
  line(`    ${q.id} | ${q.mvg} | ${q.source}`);
  line(`        VPRAŠANJE: ${q.question}`);
  line(`        DOKAZ:     ${q.evidence.slice(0, 180)}`);
  line(`        ODLOČITEV: ${q.decision}`);
}
line(`    SKUPAJ vrstic: ${queue.length} (P0 ${queue.filter((q) => q.id.startsWith("P0")).length}, P1 ${queue.filter((q) => q.id.startsWith("P1")).length}, P2 ${queue.filter((q) => q.id.startsWith("P2")).length}, P3 ${queue.filter((q) => q.id.startsWith("P3")).length}, P4 ${queue.filter((q) => q.id.startsWith("P4")).length})`);
line();
line("    REŠENO V TASK 38 (ni več v vrsti): WorldCat OCLC 821110335 — normalizacija URL");
line("    (dokaz: isti OCLC v obeh URL-jih + en zapis na search.worldcat.org).");
