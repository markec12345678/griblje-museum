# 41. val — atomarna vgradnja (rep-strict: pisanje šele po zelenih kontrolah)
# +1 vir na MVG-001 (franciscejski-kataster-n83-vas) + 1 odstavek zgodbe SL/EN
# +1 vir na MVG-109 (franciscejski-kataster-n83-pt) + 1 odstavek zgodbe SL/EN
# + konstante 580 → 582 (5 skript)
import re, sys, io

ROOT = "/home/z/my-project"
MC  = f"{ROOT}/src/lib/museum-content.ts"
AE  = f"{ROOT}/scripts/audit-entities.ts"
ATM = f"{ROOT}/scripts/audit-timeline-map.ts"
TE  = f"{ROOT}/scripts/test-entities.ts"
TTM = f"{ROOT}/scripts/test-timeline-map.ts"
RT  = f"{ROOT}/scripts/test-curator-red-team.ts"

def read(p):
    with io.open(p, encoding="utf-8") as f: return f.read()

def must(t, needle, n, label, path="museum-content.ts"):
    c = t.count(needle)
    if c != n:
        print(f"FAIL {label}: '{needle[:70]}...' najden {c}x, pričakovano {n} ({path})"); sys.exit(1)

# ─────────────────────────── 1) museum-content.ts ───────────────────────────
mc = read(MC)

ALREADY_VAS  = mc.count('franciscejski-kataster-n83-vas') == 1
ALREADY_PT   = mc.count('franciscejski-kataster-n83-pt') == 1
ALREADY_P1   = "prvi moderni popisni mreži dežele" in mc
ALREADY_P109 = "Prvi arhivski korak k vprašanju gostilne" in mc

must(mc, 'slug: "griblje-vas"', 1, "MVG-001 prisoten")
must(mc, "Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", 1, "MVG-001 storySi sidro")
must(mc, "The Second World War placed the village inside free Bela krajina:", 1, "MVG-001 storyEn sidro")
if not ALREADY_VAS: must(mc, "gains a third, earlier date.\",\n      },\n    ],", 1, "MVG-001 konec virov")
must(mc, "Skupaj z Kostanjevčevo povesto tako gribeljska književnost", 1, "MVG-109 storySi sidro")
must(mc, "Together with Kostanjevec's tale, Griblje's literature", 1, "MVG-109 storyEn sidro")
if not ALREADY_PT: must(mc, "MVG-109 resolved).\",", 1, "MVG-109 sidro konec virov")
if ALREADY_VAS and ALREADY_PT and ALREADY_P1 and ALREADY_P109:
    print("museum-content.ts: vse že vgrajeno (idempotenten ponovni zagon) — preskočim vgradnjo")
    with io.open(MC, "w", encoding="utf-8") as f: f.write(mc)
    print("VGRADNJA 41. VALA ZAKLJUČENA (idempotentno).")
    sys.exit(0)

# ── 1a) vir na MVG-001 (pred zaključkom sources array) ──
SRC_VAS = '''      {
        key: "franciscejski-kataster-n83-vas",
        nameSi: "Franciscejski kataster za Kranjsko (SI AS 176), katastrska občina N83 Griblje — Arhiv Republike Slovenije (1823–1869)",
        nameEn: "The Franciscean cadastre for Carniola (SI AS 176), cadastral municipality N83 Griblje — Archives of the Republic of Slovenia (1823–1869)",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=227663",
        noteSi:
          "Virtualna čitalnica ARS (VAČ, vac.sjas.gov.si): fond id 23253 pod tektoniko posebnih upravnih organov do 1945 (071); k.o. N83 Griblje (id 227663) pod Novomeško kresijo vsebuje 12 enot — 5 grafičnih listov (N083A01–A05) in 7 spisovnih serij (N083PG skica, N083PR opis meje, N083PS seznam zemljiških parcel, N083PT stavbne parcele, N083PUA abecedni seznam lastnikov, N083PV izkaz rabe, N083PZ cenilni elaborat). N083PT je digitaliziran (docid 41781; 8 strani, 2,8 MB; xref razbit — 8 strani prenešenih prek IIIF pdfPageImage): naslovnica \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\' — primarna potrditev nemške oblike Grüble (41. val; prvi tak dokument v zbirki). Preostale enote (grafični listi, PUA, PV, PZ) čakajo digitalizacijo TO_COLLECT.",
        noteEn:
          "The ARS virtual reading room (VAC, vac.sjas.gov.si): fond id 23253 under the special administrative authorities to 1945 (071); the c.m. N83 Griblje (id 227663) under the Novo Mesto Kreis contains 12 units — 5 graphical sheets (N083A01–A05) and 7 written series (N083PG sketch, N083PR boundary description, N083PS land-parcel list, N083PT building parcels, N083PUA alphabetical list of owners, N083PV land-use statement, N083PZ valuation elaborat). N083PT is digitised (docid 41781; 8 pages, 2.8 MB; broken xref — all 8 pages downloaded via the IIIF pdfPageImage): the title page \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\' — a primary confirmation of the German form Grüble (val 41; the first such document in the collection). The remaining units (graphical sheets, PUA, PV, PZ) await digitisation TO_COLLECT.",
      },
'''
mc = mc.replace("gains a third, earlier date.\",\n      },\n    ],", "gains a third, earlier date.\",\n      },\n" + SRC_VAS + "    ],", 1)

# ── 1b) odstavek zgodbe MVG-001 SL ──
P1_SL = "Vas ima zdaj svojo stran tudi v prvi moderni popisni mreži dežele: v Franciscejskem katastru za Kranjsko (1823–1869), ki ga hrani Arhiv Republike Slovenije, obstaja katastrska občina N83 Griblje — s petimi grafičnimi listi in sedmimi spisovnimi evidencami, od skice in opisa meje do seznamov zemljiških ter stavbnih parcel, abecednega seznama lastnikov, izkaza rabe zemljišč in cenilnega elaborata. Protokol stavbnih parcel je naslovljen »Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“«: leta 1825 je cesarski kataster vas zapisal z isto nemško obliko, ki jo poznata urbar in najstarejši zemljevid — in to je prvič, da formo Grüble potrdi primarni arhivski dokument, digitaliziran in javno dostopen v virtualni čitalnici Arhiva Republike Slovenije. Muzej je prenesel vseh osem strani protokola: izpis gribeljskih domačij z lastniki iz leta 1825, ko je vas — komaj tri stoletja po velikem vpadu, ki ga beleži Römerjevo pismo — spet polnopravno stala na katastrskem zemljevidu monarhije. Podroben prepis Kurrent rokopisa čaka na specializirano branje.\\n\\n"
mc = mc.replace("Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", P1_SL + "Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", 1)

# ── 1c) odstavek zgodbe MVG-001 EN ──
P1_EN = "The village now has its page in the land's first modern surveying network too: in the Franciscean cadastre for Carniola (1823–1869), kept by the Archives of the Republic of Slovenia, there exists the cadastral municipality N83 Griblje — with five graphical sheets and seven written series, from the sketch and boundary description to the lists of land and building parcels, the alphabetical list of owners, the land-use statement and the valuation elaborat. The building-parcel protocol is titled \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\': in 1825 the imperial cadastre wrote the village with the same German form known from the urbars and the oldest map — and this is the first time the form Grüble has been confirmed by a primary archival document, digitised and publicly accessible in the virtual reading room of the Archives of the Republic of Slovenia. The museum has downloaded all eight pages of the protocol: the register of Griblje homesteads and their owners of 1825, when the village — barely three centuries after the great raid recorded in Römer's letter — again stood, in full right, on the cadastral map of the monarchy. A detailed transcription of the Kurrent handwriting awaits specialised reading.\\n\\n"
mc = mc.replace("The Second World War placed the village inside free Bela krajina:", P1_EN + "The Second World War placed the village inside free Bela krajina:", 1)

# ── 1d) vir na MVG-109 (pred zaključkom sources array) ──
SRC_109 = '''      {
        key: "franciscejski-kataster-n83-pt",
        nameSi: "Franciscejski kataster 1825, k.o. N83 Griblje — protokol stavbnih parcel (SI AS 176/N/N83/s/PT): prvi arhivski vpogled v vprašanje gostilne",
        nameEn: "The 1825 Franciscean cadastre, c.m. N83 Griblje — the building-parcel protocol (SI AS 176/N/N83/s/PT): the first archival look at the inn question",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373416",
        noteSi:
          "Seznam stavbnih parcel (8 digitaliziranih strani; naslovnica \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\'; docid 41781, virtualna čitalnica ARS) izpisuje domačije z lastniki in vrsto stavbe za leto 1825. Preliminarno branje (VLM transkripcija strani 4–8, 41. val; Kurrent rokopis — branje kvalificirano kot predhodno) v stolpcu vrste stavbe (Gattung) ne izloči nobene gostilne: vpisane stavbe so bivalne ali gospodarske (Wohnhaus, Häusl, Scheune). To ni dokaz odsotnosti gostilne — klasifikacija je bila odvisna od pisarja in namena seznama — ampak prvi primarni arhivski korak k vprašanju, ki ga ta zapis postavlja. Preveritev s specializiranim prepisom TO_COLLECT.",
        noteEn:
          "The building-parcel list (8 digitised pages; title page \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\'; docid 41781, the ARS virtual reading room) registers the homesteads with owners and building type for 1825. A preliminary reading (VLM transcription of pages 4–8, val 41; Kurrent handwriting — the reading is qualified as preliminary) finds no inn in the building-type (Gattung) column: the recorded buildings are residential or farm buildings (Wohnhaus, Häusl, Scheune). This is not proof of the inn's absence — the classification depended on the scribe and the purpose of the list — but it is the first primary archival step towards the question this record asks. Verification through specialised transcription TO_COLLECT.",
      },
'''
mc = mc.replace("MVG-109 resolved).\",\n      },\n    ],", "MVG-109 resolved).\",\n      },\n" + SRC_109 + "    ],", 1)

# ── 1e) odstavek zgodbe MVG-109 SL ──
P109_SL = "Prvi arhivski korak k vprašanju gostilne je zdaj na voljo tudi iz katastra: protokol stavbnih parcel katastrske občine N83 Griblje iz franciscejskega katastra 1825 — naslovljen »Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“« — izpisuje gribeljske domačije s parcelami, lastniki in vrsto stavbe. Preliminarno branje digitaliziranih strani (virtualna čitalnica ARS; rokopis v Kurrentu čaka na specializiran prepis) v stolpcu vrste stavbe ne izloči nobene gostilne — vpisane stavbe so bivalne ali gospodarske (Wohnhaus, Häusl, Scheune). To ne dokaže, da gostilna leta 1825 ni stala: klasifikacija je bila odvisna od pisarja in namena seznama — ampak prvič ima muzej za vprašanje »gostilna pred 1898« primarno arhivsko stran, ne le literarno omembo.\\n\\n"
mc = mc.replace("Skupaj z Kostanjevčevo povesto tako gribeljska književnost", P109_SL + "Skupaj z Kostanjevčevo povesto tako gribeljska književnost", 1)

# ── 1f) odstavek zgodbe MVG-109 EN ──
P109_EN = "The first archival step towards the inn question is now available from the cadastre too: the building-parcel protocol of the cadastral municipality N83 Griblje from the 1825 Franciscean cadastre — titled \\'Protocoll der Bau Parcellen der Gemeinde „GRÜBLE“\\' — lists the Griblje homesteads with parcels, owners and building type. A preliminary reading of the digitised pages (the ARS virtual reading room; the Kurrent handwriting awaits specialised transcription) finds no inn in the building-type column — the recorded buildings are residential or farm buildings (Wohnhaus, Häusl, Scheune). This does not prove that no inn stood in 1825: the classification depended on the scribe and the purpose of the list — but for the first time the museum has a primary archival page, not only a literary mention, for the question of \\'the inn before 1898\\'.\\n\\n"
mc = mc.replace("Together with Kostanjevec's tale, Griblje's literature", P109_EN + "Together with Kostanjevec's tale, Griblje's literature", 1)

with io.open(MC, "w", encoding="utf-8") as f: f.write(mc)
print("OK museum-content.ts: +2 vira (MVG-001, MVG-109), +2 odstavka zgodbe SL/EN")

# ─────────────────────────── 2) konstante 580 → 582 ───────────────────────────
EXP = {AE: 2, ATM: 2, TE: 8, TTM: 8, RT: 4}
for path, expected in EXP.items():
    t = read(path)
    c = len(re.findall(r"\b580\b", t))
    c82 = len(re.findall(r"\b582\b", t))
    if c != expected and not (c == 0 and c82 >= expected):
        print(f"FAIL konstanta {path}: '580' {c}x, '582' {c82}x, pričakovano {expected}"); sys.exit(1)
    t2 = re.sub(r"\b580\b", "582", t)
    if "franciscejski" in path: pass
    with io.open(path, "w", encoding="utf-8") as f: f.write(t2)
    print(f"OK {path.split('/')[-1]}: 580 → 582 ({expected} mest)")

# ── 2b) audit-entities sporočilo ──
ae = read(AE)
old = 'ok("582 vrstic virov (40. val: +2 — laj-2024-rul-diploma, belokranjec-2026-veselic-zborovodkinja)")'
must(ae, old, 1, "audit-entities sporočilo (po zamenjavi)")
new = 'ok("582 vrstic virov (41. val: +2 — franciscejski-kataster-n83-vas, franciscejski-kataster-n83-pt)")'
ae = ae.replace(old, new, 1)
with io.open(AE, "w", encoding="utf-8") as f: f.write(ae)
print("OK audit-entities.ts: sporočilo posodobljeno na 41. val")

print("VGRADNJA 41. VALA ZAKLJUČENA.")
