#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""22. val — i18n števci 108→109 (25 nizov × 5 jezikov) + test konstante.
Atomarna: vse zamenjave z natančnim števcem ponovitev, pisanje na koncu."""
import io

FILES = {
 "/home/z/my-project/src/lib/i18n.tsx": None,
 "/home/z/my-project/scripts/audit-entities.ts": None,
 "/home/z/my-project/scripts/test-entities.ts": None,
 "/home/z/my-project/scripts/test-timeline-map.ts": None,
 "/home/z/my-project/scripts/test-ai-curator.ts": None,
 "/home/z/my-project/scripts/test-curator-red-team.ts": None,
 "/home/z/my-project/scripts/audit-timeline-map.ts": None,
}
for k in FILES: FILES[k] = io.open(k, encoding="utf-8").read()

def rep(idx, old, new, n=1, tag=""):
    t = FILES[idx]; c = t.count(old)
    if c != n: raise SystemExit(f"FAIL [{tag}] v {idx.split('/')[-1]}: {c}x (pričakovano {n})")
    FILES[idx] = t.replace(old, new)

I = "/home/z/my-project/src/lib/i18n.tsx"

# ---------- SL (5) ----------
rep(I, "Zbirka 108 zapisov", "Zbirka 109 zapisov", 1, "sl-hero")
rep(I, "odgovori slonijo na 108 kuriranih zapisih", "odgovori slonijo na 109 kuriranih zapisih", 1, "sl-vodic")
rep(I, "Sprehodi skupaj pokrivajo vseh 108 zapisov zbirke", "Sprehodi skupaj pokrivajo vseh 109 zapisov zbirke", 1, "sl-sprehodi")
rep(I, "ki pri 108 zapisih ne potrebuje umetne inteligence", "ki pri 109 zapisih ne potrebuje umetne inteligence", 1, "sl-vizualno")
rep(I, "v zbirki jih je 108", "v zbirki jih je 109", 1, "sl-koledar")

# ---------- EN (5) ----------
rep(I, "One hundred and eight records", "One hundred and nine records", 1, "en-hero")
rep(I, "grounded in 108 curated records", "grounded in 109 curated records", 1, "en-guide")
rep(I, "Together the walks cover all 108 records of the collection", "Together the walks cover all 109 records of the collection", 1, "en-walks")
rep(I, "at one hundred and eight records", "at one hundred and nine records", 1, "en-visual")
rep(I, "the collection has 108 pieces", "the collection has 109 pieces", 1, "en-calendar")

# ---------- HR (5) ----------
rep(I, "Sto osam zapisa", "Sto devet zapisa", 1, "hr-hero")
rep(I, "odgovori se temelje na 108 kuriranom zapisu", "odgovori se temelje na 109 kuriranom zapisu", 1, "hr-vodic")
rep(I, "Šetnje zajedno pokrivaju svih 108 zapis zbirke", "Šetnje zajedno pokrivaju svih 109 zapis zbirke", 1, "hr-sprehodi")
rep(I, "koja pri 108 zapisu ne treba umjetnu inteligenciju", "koja pri 109 zapisu ne treba umjetnu inteligenciju", 1, "hr-vizualno")
rep(I, "u zbirci ih je 108", "u zbirci ih je 109", 1, "hr-koledar")

# ---------- DE (5) ----------
rep(I, "Hundertacht Einträge", "Hundertneun Einträge", 1, "de-hero")
rep(I, "die Antworten ruhen auf 108 kuratierten Einträgen", "die Antworten ruhen auf 109 kuratierten Einträgen", 1, "de-guide")
rep(I, "Die Rundgänge decken gemeinsam alle 108 Einträge der Sammlung", "Die Rundgänge decken gemeinsam alle 109 Einträge der Sammlung", 1, "de-walks")
rep(I, "das bei 108 Einträgen keine künstliche Intelligenz braucht", "das bei 109 Einträgen keine künstliche Intelligenz braucht", 1, "de-visual")
rep(I, "es gibt 108 in der Sammlung", "es gibt 109 in der Sammlung", 1, "de-koledar")

# ---------- IT (5) ----------
rep(I, "Cento otto schede", "Cento nove schede", 1, "it-hero")
rep(I, "le risposte poggiano su 108 schede curate", "le risposte poggiano su 109 schede curate", 1, "it-guide")
rep(I, "I percorsi insieme coprono tutte le 108 schede della collezione", "I percorsi insieme coprono tutte le 109 schede della collezione", 1, "it-walks")
rep(I, "che con 108 schede non ha bisogno di intelligenza artificiale", "che con 109 schede non ha bisogno di intelligenza artificiale", 1, "it-visual")
rep(I, "nella collezione ce ne sono 108", "nella collezione ce ne sono 109", 1, "it-koledar")

# ---------- audit-entities ----------
A = "/home/z/my-project/scripts/audit-entities.ts"
rep(A, 'if (exN === 108) ok("108/108 zapisov")', 'if (exN === 109) ok("109/109 zapisov")', 1, "audit-exN")
rep(A, 'if (mvgN === 108) ok("108/108 muzejskih številk")', 'if (mvgN === 109) ok("109/109 muzejskih številk")', 1, "audit-mvgN")
rep(A, 'if (srcN === 537) ok("537 vrstic virov")', 'if (srcN === 541) ok("541 vrstic virov")', 1, "audit-srcN")
rep(A, 'if (identities === 426) ok("426 identitet virov (21. val: +10 — Vaš kanal: 3 novi zapisi (lokostrelstvo, komasacija, odkupne cene) + 6 add-only virov + 1 WP)")',
       'if (identities === 430) ok("430 identitet virov (22. val: +4 — MVG-109 (3 vira) + SBL Kostanjevec; sbl-zupanic URL prebrisan)")', 1, "audit-ident")

# ---------- test-entities ----------
T = "/home/z/my-project/scripts/test-entities.ts"
rep(T, ' *   T9  HTTP regresija             — 108/108 strani, 108/108 IIIF, OpenData 537,',
       ' *   T9  HTTP regresija             — 109/109 strani, 109/109 IIIF, OpenData 541,', 1, "t-head")
rep(T, 'check(bySlug.size === 108, "T7.5 zapisa MVG-014 in MVG-056 ostajata LOČENA zapisa (108/108)");',
       'check(bySlug.size === 109, "T7.5 zapisa MVG-014 in MVG-056 ostajata LOČENA zapisa (109/109)");', 1, "t75")
rep(T, 'check(seedExhibits.length === 108, `T8.1 108/108 zapisov (${seedExhibits.length})`);',
       'check(seedExhibits.length === 109, `T8.1 109/109 zapisov (${seedExhibits.length})`);', 1, "t81")
rep(T, 'check(seedExhibits.filter((e) => /^MVG-\\d{3}$/.test(e.museumNo ?? "")).length === 108, "T8.2 108/108 muzejskih številk MVG");',
       'check(seedExhibits.filter((e) => /^MVG-\\d{3}$/.test(e.museumNo ?? "")).length === 109, "T8.2 109/109 muzejskih številk MVG");', 1, "t82")
rep(T, 'check(SOURCE_USAGE.size === 426, `T8.6 426 identitet virov (${SOURCE_USAGE.size})`);',
       'check(SOURCE_USAGE.size === 430, `T8.6 430 identitet virov (${SOURCE_USAGE.size})`);', 1, "t86")
rep(T, 'check(srcRows === 537, `T8.11 537 vrstic virov (${srcRows})`);',
       'check(srcRows === 541, `T8.11 541 vrstic virov (${srcRows})`);', 1, "t811")
rep(T, 'check(okPages === 108, `T9.1 108/108 objektnih strani (${okPages}; ${badPages.join(",") || "vse 200"})`);',
       'check(okPages === 109, `T9.1 109/109 objektnih strani (${okPages}; ${badPages.join(",") || "vse 200"})`);', 1, "t91")
rep(T, 'check(okManifests === 108 && withSources === 108, `T9.2 108/108 IIIF manifestov z viri (${okManifests} manifestov, ${withSources} z ≥1 virom)`);',
       'check(okManifests === 109 && withSources === 109, `T9.2 109/109 IIIF manifestov z viri (${okManifests} manifestov, ${withSources} z ≥1 virom)`);', 1, "t92")
rep(T, 'check(od.counts?.exhibits === 108 && od.counts?.sources === 537, `T9.3 OpenData: 108 zapisov / 537 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
       'check(od.counts?.exhibits === 109 && od.counts?.sources === 541, `T9.3 OpenData: 109 zapisov / 541 virov (${od.counts?.exhibits}/${od.counts?.sources})`);', 1, "t93")
rep(T, 'check(withKey === 537 && totalRows === 537, `T9.4 OpenData sourceKey 537/537 (${withKey}/${totalRows})`);',
       'check(withKey === 541 && totalRows === 541, `T9.4 OpenData sourceKey 541/541 (${withKey}/${totalRows})`);', 1, "t94")

# ---------- test-timeline-map ----------
M = "/home/z/my-project/scripts/test-timeline-map.ts"
rep(M, 'check(withTime === 95 && withCoords === 33, "T7.9 objektov s časom (yearFrom) = 95; s koordinato = 33", `=${withTime}/${withCoords}`);',
       'check(withTime === 96 && withCoords === 34, "T7.9 objektov s časom (yearFrom) = 96; s koordinato = 34", `=${withTime}/${withCoords}`);', 1, "t79")
rep(M, 'check(locs === 109, "T8.7 sitemap: 109 URL", `=${locs}`);',
       'check(locs === 110, "T8.7 sitemap: 110 URL", `=${locs}`);', 1, "t87")
rep(M, '"T7.8 walkStopOf pokriva vseh 108 zapisov',
       '"T7.8 walkStopOf pokriva vseh 109 zapisov', 1, "t78msg")
rep(M, 'check(walkCover === 108 && ALL_WALKS.length >= 5', 'check(walkCover === 109 && ALL_WALKS.length >= 5', 1, "t78")

# ---------- test-ai-curator ----------
C = "/home/z/my-project/scripts/test-ai-curator.ts"
rep(C, '(od.counts?.exhibits ?? od.data?.exhibits?.length ?? 0) === 108,',
       '(od.counts?.exhibits ?? od.data?.exhibits?.length ?? 0) === 109,', 1, "curator-109")

# ---------- red-team ----------
R = "/home/z/my-project/scripts/test-curator-red-team.ts"
rep(R, 'check(seedExhibits.length === 108, "R0.2 zbirka: 108 zapisov", String(seedExhibits.length));',
       'check(seedExhibits.length === 109, "R0.2 zbirka: 109 zapisov", String(seedExhibits.length));', 1, "r02")
rep(R, 'check(context.collection?.exhibitCount === 108, "R12.2 pregled nosi dejanske števce (108)");',
       'check(context.collection?.exhibitCount === 109, "R12.2 pregled nosi dejanske števce (109)");', 1, "r122")
rep(R, 'check(seedExhibits.length === 108, "R16.1 108 zapisov");',
       'check(seedExhibits.length === 109, "R16.1 109 zapisov");', 1, "r161")

# ---------- audit-timeline-map ----------
AT = "/home/z/my-project/scripts/audit-timeline-map.ts"
rep(AT, 'check("537 vrstic virov", sources === 537, `=${sources}`);',
       'check("541 vrstic virov", sources === 541, `=${sources}`);', 1, "at-541")

for k, v in FILES.items():
    io.open(k, "w", encoding="utf-8", newline="").write(v)
print("OK: i18n 25 nizov × 108→109 + konstante v 7 skriptah posodobljene.")
