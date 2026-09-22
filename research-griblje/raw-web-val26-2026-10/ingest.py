# 26. val — atomarna vgradnja (rep-strict: pisanje šele po zelenih kontrolah)
# +2 vira: commons-cabin-under-sun (MVG-016, zimska podoba ribnika), gis-kd-2122 (MVG-002, uradni opis enote RKD)
# +2 obogatitvi zgodbe: MVG-016 (poletje/zima par), MVG-030 (celotna uradna SURS serija 2008–2026)
# +1 nadgradnja opombe vira: surs-prebivalstvo (celotna serija naselja 017044)
# +konstante: 554→556 virov, 437→439 identitet (5 skript)
import sys, io

ROOT = "/home/z/my-project"
MC  = f"{ROOT}/src/lib/museum-content.ts"
AE  = f"{ROOT}/scripts/audit-entities.ts"
TE  = f"{ROOT}/scripts/test-entities.ts"
TTM = f"{ROOT}/scripts/test-timeline-map.ts"
RT  = f"{ROOT}/scripts/test-curator-red-team.ts"
ATM = f"{ROOT}/scripts/audit-timeline-map.ts"

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def must_count(t, needle, n, label):
    c = t.count(needle)
    if c != n:
        print(f"FAIL {label}: najden {c}x, pričakovano {n}")
        print("  vzorec:", repr(needle[:90]))
        sys.exit(1)

def rep1(t, old, new, label):
    must_count(t, old, 1, label)
    return t.replace(old, new, 1)

# ─────────────────────────── 0) branje + dedup kontrole ───────────────────────────
mc = read(MC)

must_count(mc, 'slug: "ribnik"', 1, "MVG-016 prisoten")
must_count(mc, 'slug: "sveti-vid"', 1, "MVG-002 prisoten")
must_count(mc, 'slug: "griblje-v-stevilkah"', 1, "MVG-030 prisoten")
must_count(mc, 'museumNo: "MVG-111"', 1, "številka MVG-111 (zadnji)")
for needle in ["commons-cabin-winter", "gis-kd-2122"]:
    must_count(mc, f'key: "{needle}"', 0, f"dedup: {needle} še ne obstaja")
must_count(mc, "Cabin_under_the_Sun_(46105681335).jpg", 1, "dedup: URL Cabina obstaja natanko 1x (MVG-069 commons-hisica)")
must_count(mc, "geohub.gov.si/ghapp/giskd", 0, "dedup: geohub URL še ne obstaja")

# ──────────────── 1) MVG-016: +1 vir (zimska fotografija) ────────────────
ANCHOR_016 = r'''        noteSi:
          "25. val — panoramska fotografija ribnika (18.104 × 6.820 pik), posneta 2. 12. 2018: drug pogled poleg julijanskega posnetka (Uroš Novina) in portalnega opisa.",
        noteEn:
          "Wave 25 — a panoramic photograph of the pond (18,104 × 6,820 px), taken 2 Dec 2018: a second view beside the July shot (Uroš Novina) and the portal description.",
      },
    ],
  },
  {
    slug: "belokranjska-hisa",'''

NEW_016 = r'''        noteSi:
          "25. val — panoramska fotografija ribnika (18.104 × 6.820 pik), posneta 2. 12. 2018: drug pogled poleg julijanskega posnetka (Uroš Novina) in portalnega opisa.",
        noteEn:
          "Wave 25 — a panoramic photograph of the pond (18,104 × 6,820 px), taken 2 Dec 2018: a second view beside the July shot (Uroš Novina) and the portal description.",
      },
      {
        key: "commons-cabin-winter",
        nameSi:
          "Wikimedia Commons: Cabin under the Sun — ribnik pod ledom z leseno kočico (fotografija, avtor: Uroš Novina, 26. 1. 2019)",
        nameEn:
          "Wikimedia Commons: Cabin under the Sun — the pond under ice with its wooden cabin (photograph, author: Uroš Novina, 26 Jan 2019)",
        sourceType: "fotografija",
        license: "CC BY 2.0 (avtor: Uroš Novina)",
        url: WM("Cabin_under_the_Sun_(46105681335).jpg"),
        noteSi:
          "26. val — ista datoteka, ki je glavna slika zapisa o Turističnem društvu, tu kot dokument zimskega stanja ribnika: zamrznjena zrcalna gladina, lesena kočica na kolih sredi ledu, debela snežna odeja ob bregovih, trstje v predplanu. Po koordinatah na datoteki (45,576035 N, 15,285286 V) posneta na istem mestu kakor julijanski posnetek Pond at Griblje istega avtorja (razlika koordinat ~7 metrov) — poletje/zima par; vsebina potrjena z računalniško analizo slike.",
        noteEn:
          "Wave 26 — the same file that is the main image of the Tourist Society record, here as a document of the pond's winter state: a frozen mirror surface, the wooden cabin on stilts in the middle of the ice, thick snow along the banks, reeds in the foreground. By the coordinates on the file (45.576035 N, 15.285286 E) taken at the same spot as the same author's July photograph Pond at Griblje (coordinates differ by ~7 metres) — a summer/winter pair; content confirmed by computer image analysis.",
      },
    ],
  },
  {
    slug: "belokranjska-hisa",'''

mc = rep1(mc, ANCHOR_016, NEW_016, "vstavitvena točka MVG-016 vir")

# ──────────────── 2) MVG-016: zgodba SL + EN (poletje/zima par) ────────────────
SL_016 = r'''je bilo treba.\n\nMuzej vabi domačine:'''
SL_016_NEW = r'''je bilo treba.\n\nLed je ribniku zapustil svoj dokument: fotografija z Wikimedia Commons, posneta 26. januarja 2019, prikazuje ta ribnik zamrznjen v zrcalno gladino, v kateri se ogledujeta zimska nizka sonca in lesena kočica na kolih sredi ledu — ista kočica, ki jo poletni opis pozna ob vodnih lilijah in brvi. Po koordinatah, zapisanih pri fotografiji na Commons (45,5760 N, 15,2853 V), je bila posneta na istem mestu kakor julijanski posnetek istega fotografa dve leti in pol prej: poletje in zima istega ribnika — obe strani vaškega koledarja, zdaj obe dokumentirani.\n\nMuzej vabi domačine:'''
mc = rep1(mc, SL_016, SL_016_NEW, "MVG-016 zgodba SL")

EN_016 = r'''it had to be waited for.\n\nThe museum invites the locals:'''
EN_016_NEW = r'''it had to be waited for.\n\nThe ice left the pond its own document: a Wikimedia Commons photograph taken on 26 January 2019 shows this pond frozen into a mirror surface in which the low winter sun and the wooden cabin on stilts in the middle of the ice are reflected — the same cabin the summer description knows beside the water lilies and the bridge. By the coordinates recorded with the photograph on Commons (45.5760 N, 15.2853 E) it was taken at the same spot as the July shot by the same photographer two and a half years earlier: the summer and the winter of the same pond — both sides of the village's calendar, now both documented.\n\nThe museum invites the locals:'''
mc = rep1(mc, EN_016, EN_016_NEW, "MVG-016 zgodba EN")

# ──────────────── 2b) MVG-069: nadgradnja opombe commons-hisica ────────────────
HISICA = r"""        noteSi:
          "Glavna slika zapisa: hišica ob ribniku v zimskem miru — vas, ki jo društveni koledar vsako leto znova oživi.",
        noteEn:
          "The record's main image: a cabin by the pond in the winter quiet — the village that the society's calendar wakes again every year.","""
HISICA_NEW = r"""        noteSi:
          "Glavna slika zapisa: hišica ob ribniku v zimskem miru — vas, ki jo društveni koledar vsako leto znova oživi. 26. val: vsebina natančno določena — zamrznjen vaški ribnik z leseno kočico na kolih sredi ledu, 26. 1. 2019, po koordinatah (45,576035 N, 15,285286 V) na istem mestu kakor avtorjev julijanski posnetek istega ribnika.",
        noteEn:
          "The record's main image: a cabin by the pond in the winter quiet — the village that the society's calendar wakes again every year. Wave 26: the content now precisely determined — the frozen village pond with its wooden cabin on stilts in the middle of the ice, 26 Jan 2019, at the same coordinates (45.576035 N, 15.285286 E) as the author's July shot of the same pond.","""
mc = rep1(mc, HISICA, HISICA_NEW, "MVG-069 nadgradnja opombe")

# ──────────────── 3) MVG-002: +1 vir (uradni opis enote RKD 2122) ────────────────
ANCHOR_002 = r'''        noteSi: "Lastni članek o cerkvi s povezavo na Wikipodatke.",
        noteEn: "A dedicated article on the church, linked to Wikidata.",
      },
      {
        key: "sn-cerkev-2026",'''

NEW_002 = r'''        noteSi: "Lastni članek o cerkvi s povezavo na Wikipodatke.",
        noteEn: "A dedicated article on the church, linked to Wikidata.",
      },
      {
        key: "gis-kd-2122",
        nameSi:
          "GIS kulturne dediščine (MK RS, Geohub): opis enote nepremične kulturne dediščine, evidenčna št. 2122 — cerkev sv. Vida, Griblje",
        nameEn:
          "GIS of Cultural Heritage (Ministry of Culture, Geohub): description of the immovable heritage unit no. 2122 — church of St. Vitus, Griblje",
        sourceType: "spletni-vir",
        license: "javna informacija / public information",
        url: "https://geohub.gov.si/ghapp/giskd/?showLayers=MK_RNPD_3386&query=MK_RNPD_3386_3641%2CESD%2C2122",
        noteSi:
          "26. val — uradni sklic na vpis v Register nepremične kulturne dediščine (EŠD 2122, registrirana dediščina, občina Črnomelj); povezava članka Cerkev sv. Vida, Griblje na sl. Wikipediji na opis enote.",
        noteEn:
          "Wave 26 — the official reference to the entry in the Register of Immovable Cultural Heritage (unit no. 2122, registered heritage, Municipality of Črnomelj); the Slovene Wikipedia article's link to the unit description.",
      },
      {
        key: "sn-cerkev-2026",'''

mc = rep1(mc, ANCHOR_002, NEW_002, "vstavitvena točka MVG-002 vir")

# ──────────────── 4) MVG-030: zgodba SL + EN (celotna uradna serija) ────────────────
SL_030 = r'''leta 2026 jih letna statistika beleži 329. Številke se premikajo kot reka:'''
SL_030_NEW = r'''leta 2026 jih letna statistika beleži 329. Uradna letna serija je zdaj zapisana celo: 361 prebivalcev leta 2008, vrh 363 leta 2012, dno 328 leta 2024, 337 leta 2025 in 329 leta 2026 — v devetnajstih letih za devet odstotkov. Številke se premikajo kot reka:'''
mc = rep1(mc, SL_030, SL_030_NEW, "MVG-030 zgodba SL")

EN_030 = r'''in 2026 the annual statistics record 329. Numbers move like the river:'''
EN_030_NEW = r'''in 2026 the annual statistics record 329. The official annual series is now written whole: 361 inhabitants in 2008, a peak of 363 in 2012, a low of 328 in 2024, 337 in 2025 and 329 in 2026 — a drop of some nine per cent in nineteen years. Numbers move like the river:'''
mc = rep1(mc, EN_030, EN_030_NEW, "MVG-030 zgodba EN")

# ──────────────── 5) MVG-030: nadgradnja opombe vira surs-prebivalstvo ────────────────
NOTE_SURS = r'''        noteSi: "Letni podatki o prebivalstvu naselij — 329 prebivalcev (2026).",
        noteEn: "Annual settlement population data — 329 inhabitants (2026).",'''
NOTE_SURS_NEW = r'''        noteSi:
          "Letni podatki o prebivalstvu naselij (naselje 017044 Griblje) — celotna serija 2008–2026: 361, 352, 347, 356, 363, 354, 351, 350, 344, 348, 340, 337, 334, 350, 340, 334, 328, 337, 329; najvišja 363 (2012), najnižja 328 (2024), 329 prebivalcev (2026).",
        noteEn:
          "Annual settlement population data (settlement 017044 Griblje) — the whole series 2008–2026: 361, 352, 347, 356, 363, 354, 351, 350, 344, 348, 340, 337, 334, 350, 340, 334, 328, 337, 329; the peak 363 (2012), the low 328 (2024), 329 inhabitants (2026).",'''
mc = rep1(mc, NOTE_SURS, NOTE_SURS_NEW, "MVG-030 opomba vira surs")

# ──────────────── 6) konstante v skriptah ────────────────
ae = read(AE)
ae = rep1(ae, 'if (srcN === 554) ok("554 vrstic virov (25. val: +4 — Kolpa 2002 in ribnik panorama iz kategorije Commons Griblje, deljena listina 1468 na malenci, kamra pričevanje Cirila Totterja)"); else err(`vrstic virov: ${srcN}`);',
          'if (srcN === 556) ok("556 vrstic virov (26. val: +2 — zimska fotografija ribnika Cabin under the Sun na MVG-016, uradni opis enote RKD EŠD 2122 na MVG-002)"); else err(`vrstic virov: ${srcN}`);', "AE 554→556")
ae = rep1(ae, 'if (identities === 437) ok("437 identitet virov (25. val: +1 kamra pričevanje Cirila Totterja; kamra-plosca nadgrajena z gole domene na natančen vnos; Commons URL-ja Kolpa_griblje in Pond_Griblje že vira MVG-006 in MVG-050 — identiteta ostaja)"); else err(`identitet: ${identities}`);',
          'if (identities === 438) ok("438 identitet virov (26. val: +1 — nov URL geohub opis enote 2122; Cabin URL je deljena identiteta z MVG-069)"); else err(`identitet: ${identities}`);', "AE 437→439")
ae = rep1(ae, 'if (shared === 64) ok("64 deljenih virov (25. val: +2 — Kolpa_griblje zdaj deljen med MVG-001+MVG-006, Pond_Griblje med MVG-016+MVG-050; weiss-2018-castite deljen med 4 zapise)"); else err(`deljenih: ${shared}`);',
          'if (shared === 65) ok("65 deljenih virov (26. val: +1 — Cabin URL zdaj deljen med MVG-016 in MVG-069)"); else err(`deljenih: ${shared}`);', "AE 64 sporočilo")

te = read(TE)
te = rep1(te, "111/111 IIIF, OpenData 554,", "111/111 IIIF, OpenData 556,", "TE komentar 22")
te = rep1(te, 'check(SOURCE_USAGE.size === 437, `T8.6 437 identitet virov (${SOURCE_USAGE.size})`);',
          'check(SOURCE_USAGE.size === 438, `T8.6 438 identitet virov (${SOURCE_USAGE.size})`);', "TE T8.6")
te = rep1(te, 'check(srcRows === 554, `T8.11 554 vrstic virov (${srcRows})`);',
          'check(srcRows === 556, `T8.11 556 vrstic virov (${srcRows})`);', "TE T8.11")
te = rep1(te, 'check(od.counts?.exhibits === 111 && od.counts?.sources === 554, `T9.3 OpenData: 111 zapisov / 554 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
          'check(od.counts?.exhibits === 111 && od.counts?.sources === 556, `T9.3 OpenData: 111 zapisov / 556 virov (${od.counts?.exhibits}/${od.counts?.sources})`);', "TE T9.3")
te = rep1(te, 'check(withKey === 554 && totalRows === 554, `T9.4 OpenData sourceKey 554/554 (${withKey}/${totalRows})`);',
          'check(withKey === 556 && totalRows === 556, `T9.4 OpenData sourceKey 556/556 (${withKey}/${totalRows})`);', "TE T9.4")

ttm = read(TTM)
ttm = rep1(ttm, 'check(rows === 554, "T7.2 554 vrstic virov", `=${rows}`);',
           'check(rows === 556, "T7.2 556 vrstic virov", `=${rows}`);', "TTM T7.2")
ttm = rep1(ttm, 'check(SOURCE_USAGE.size === 437, "T7.3 437 identitet virov (25. val: +1 kamra pričevanje; kamra-plosca nadgrajena; Kolpa_griblje/Pond_Griblje že vira — deljena)", `=${SOURCE_USAGE.size}`);',
           'check(SOURCE_USAGE.size === 438, "T7.3 438 identitet virov (26. val: +1 geohub 2122; Cabin URL deljena z MVG-069)", `=${SOURCE_USAGE.size}`);', "TTM T7.3")
ttm = rep1(ttm, 'check(shared === 64, "T7.4 64 deljenih virov (≥2 zapisa; 25. val: + Kolpa_griblje med MVG-001/006 in Pond_Griblje med MVG-016/050; weiss-2018-castite med 4 zapisi)", `=${shared}`);',
           'check(shared === 65, "T7.4 65 deljenih virov (≥2 zapisa; 26. val: +1 — Cabin URL med MVG-016/069)", `=${shared}`);', "TTM T7.4")
ttm = rep1(ttm, 'od.counts?.exhibits === 111 && od.counts?.sources === 554,',
           'od.counts?.exhibits === 111 && od.counts?.sources === 556,', "TTM T8.3")
ttm = rep1(ttm, '"T8.3 OpenData: 111 zapisov / 554 virov",', '"T8.3 OpenData: 111 zapisov / 556 virov",', "TTM T8.3 napis")
ttm = rep1(ttm, 'check(withKey === 554 && totalRows === 554, "T8.4 OpenData sourceKey 554/554", `${withKey}/${totalRows}`);',
           'check(withKey === 556 && totalRows === 556, "T8.4 OpenData sourceKey 556/556", `${withKey}/${totalRows}`);', "TTM T8.4")

rt = read(RT)
rt = rep1(rt, 'check(sourceRows === 554, "R0.3 zbirka: 554 vrstic virov", String(sourceRows));',
          'check(sourceRows === 556, "R0.3 zbirka: 556 vrstic virov", String(sourceRows));', "RT R0.3")

atm = read(ATM)
atm = rep1(atm, 'check("554 vrstic virov", sources === 554, `=${sources}`);',
           'check("556 vrstic virov", sources === 556, `=${sources}`);', "ATM 554→556")

# ─────────────────────────── 7) pisanje (šele po vseh zelenih kontrolah) ───────────────────────────
for p, t in [(MC, mc), (AE, ae), (TE, te), (TTM, ttm), (RT, rt), (ATM, atm)]:
    with io.open(p, "w", encoding="utf-8") as f:
        f.write(t)
    print("ZAPISANO", p)
print("OK: 26. val vgrajen — +2 vrstici virov (556), +1 identiteta (438), +1 deljena (65); zgodbe MVG-016/MVG-030; opomba surs; nadgradnja MVG-069; konstante")
