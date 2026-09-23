# 42. val (TASK 94) — atomarna vgradnja (rep-strict: pisanje šele po zelenih kontrolah)
# MVG-001: +6 virov (franciscejski-kataster-n83-a01/pr/ps/pua/pv/pz)
#         + posodobitev opombe vira n83-vas (popravek lažnega TO_COLLECT — vse enote digitalizirane)
#         + 1 odstavek zgodbe SL/EN
# + konstante 582 → 588 (5 skript) in 463 → 469 (3 skripte)
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

ALREADY_SRC  = all(mc.count(f'franciscejski-kataster-n83-{k}') == 1 for k in ("a01","pr","ps","pua","pv","pz"))
ALREADY_P42  = "zaokrožena do zadnje enote" in mc
ALREADY_CORR = "Raziskava fonda (42. val) je pokazala" in mc

must(mc, 'slug: "griblje-vas"', 1, "MVG-001 prisoten")
must(mc, "Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", 1, "MVG-001 storySi sidro")
must(mc, "The Second World War placed the village inside free Bela krajina:", 1, "MVG-001 storyEn sidro")
must(mc, "await digitisation TO_COLLECT.\",\n      },\n    ],", 1, "MVG-001 konec virov (vir n83-vas zadnji)")
must(mc, "Preostale enote (grafični listi, PUA, PV, PZ) čakajo digitalizacijo TO_COLLECT.", 1, "MVG-001 noteSi n83-vas")
must(mc, "The remaining units (graphical sheets, PUA, PV, PZ) await digitisation TO_COLLECT.", 1, "MVG-001 noteEn n83-vas")

if ALREADY_SRC and ALREADY_P42 and ALREADY_CORR:
    print("museum-content.ts: vse že vgrajeno (idempotenten ponovni zagon) — preskočim vgradnjo")
else:
    # ── 1a) šest novih virov na MVG-001 (po viru n83-vas) ──
    NEW_SOURCES = '''      {
        key: "franciscejski-kataster-n83-a01",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — kritna karta, list A01 (SI AS 176/N/N83/g/A01), izmera 1824, korekcije 1827",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the coloured map, sheet A01 (SI AS 176/N/N83/g/A01), surveyed 1824, corrected 1827",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=227666",
        noteSi:
          "Grafični list A01 fonda N83 — kritna (kolorirana) karta katastrske občine 83; digitaliziran kot IIIF slika (docid 10, 2826×2273 px; v 42. valu prenešen in prebran). Naslovna plošča (preliminarno branje) nosi »Gemeinde GRÜBLE in Illyrien« (Kreis Neustadt; rdeča korekcijska opomba o popravkih meja septembra 1827) — prvi katastrski zemljevid vasi, javno dostopen v virtualni čitalnici ARS. Karta prikazuje gribeljske domačije ob mejni Kolpi (vzhod = državna meja s Hrvaško) z rdečimi parcelnimi številkami; toponimi v predbitnem branju (med njimi Mali Vrh, Sušec, Kamennica). Oznak cerkve, gostilne ali mlina na listu ni. Toponimi čakajo na specializiran prepis.",
        noteEn:
          "Graphical sheet A01 of the fond N83 — the coloured (koloriert) map of cadastral municipality 83; digitised as an IIIF image (docid 10, 2826×2273 px; downloaded and read in val 42). The title block (preliminary reading) bears 'Gemeinde GRÜBLE in Illyrien' (Kreis Neustadt; a red correction note on the boundary corrections of September 1827) — the first cadastral map of the village, publicly accessible in the ARS virtual reading room. The map shows the Griblje homesteads along the border Kolpa (east = the state border with Croatia) with red parcel numbers; toponyms in a preliminary reading (among them Mali Vrh, Sušec, Kamennica). No marks of a church, inn or mill on the sheet. The toponyms await specialised transcription.",
      },
      {
        key: "franciscejski-kataster-n83-pr",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — opis meje (SI AS 176/N/N83/s/PR): »Grenz-Beschreibung der Gemeinde „GRÜBLE“«, 1825/26",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the boundary description (SI AS 176/N/N83/s/PR): 'Grenz-Beschreibung der Gemeinde „GRÜBLE“', 1825/26",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373414",
        noteSi:
          "4 digitalizirane strani (docid 41779; v 42. valu prenešene in prebrane). Tiskana naslovnica z imenom občine v dvojnih navedkah — drugi primarni dokument forme Grüble (po protokolu stavbnih parcel). Rokopisno besedilo (Kurrent, 1825–1826) po mejnih točkah opiše potek meje katastrske občine s sosedami; preliminarno branje omenja potok z »mlinskim« imenom (Mlinščica) in mline kot mejne točke — vse predbitno. Gostilniških izrazov (Wirtshaus, Gasthaus, Taferne, Schenke, Krug) v branju ni — negativen zadetek na vseh štirih straneh. Podroben prepis TO_COLLECT (specializirano branje).",
        noteEn:
          "4 digitised pages (docid 41779; downloaded and read in val 42). A printed title page with the municipality's name in quotation marks — the second primary document of the form Grüble (after the building-parcel protocol). The manuscript text (Kurrent, 1825–1826) describes the course of the cadastral municipality's boundary point by point with its neighbours; the preliminary reading mentions a stream with a 'mill' name (Mlinščica) and mills as boundary points — all preliminary. No inn terms (Wirtshaus, Gasthaus, Taferne, Schenke, Krug) in the reading — a negative result on all four pages. A detailed transcription TO_COLLECT (specialised reading).",
      },
      {
        key: "franciscejski-kataster-n83-ps",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — protokol zemljiških parcel (SI AS 176/N/N83/s/PS): »Protocol der Grund-Parzellen der Gemeinde „GRÜBLE“«, 143 strani",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the land-parcel protocol (SI AS 176/N/N83/s/PS): 'Protocol der Grund-Parzellen der Gemeinde „GRÜBLE“', 143 pages",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373415",
        noteSi:
          "Najobsežnejša serija fonda: 143 digitaliziranih strani, 56,2 MB (docid 41780; v 42. valu prenesena naslovnica in prva podatkovna stran). Kurrent tabela: številka parcele, ime zemljišča, lastnik (ime, stan, prebivališče), vrsta kulture, areal v juterih in kvadratnih kletih, bonitetni razred, čisti dohodek. Naslovnica = tretja primarna potrditev forme Grüble. Preliminarna branja izločajo domačinske priimke (med njimi Piringer, Grilc, Kriechbaum, Malič, Schellander, Brine, Millay, Resig) — vse predbitna. Celoten prepis = obsežen specializiran projekt TO_COLLECT; na vzorčanih straneh gostilniških izrazov ni (negativen zadetek).",
        noteEn:
          "The most extensive series of the fond: 143 digitised pages, 56.2 MB (docid 41780; in val 42 the title page and the first data page were downloaded). A Kurrent table: parcel number, land name, owner (name, status, residence), culture type, area in Joch and square Klafter, quality class, net yield. The title page = the third primary confirmation of the form Grüble. Preliminary readings extract homestead surnames (among them Piringer, Grilc, Kriechbaum, Malič, Schellander, Brine, Millay, Resig) — all preliminary. A complete transcription = an extensive specialised project TO_COLLECT; no inn terms on the sampled pages (a negative result).",
      },
      {
        key: "franciscejski-kataster-n83-pua",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — abecedni seznam lastnikov zemljišč (SI AS 176/N/N83/s/PUA): »Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde „GRÜBLE“«, 49 strani",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the alphabetical list of land owners (SI AS 176/N/N83/s/PUA): 'Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde „GRÜBLE“', 49 pages",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373417",
        noteSi:
          "49 digitaliziranih strani, 6,5 MB (docid 41782; v 42. valu prenešena naslovnica in glava tabele). Tiskan naslov z rokopisnim imenom občine — četrta primarna potrditev forme Grüble. Tabela: hišna številka, ime, stan in prebivališče lastnika, opombe. Prebrana sta naslovni strani; polni seznam imen in morebitnih poklicnih oznak (Wirt, Gastwirt) TO_COLLECT — specializiran prepis vseh 49 strani.",
        noteEn:
          "49 digitised pages, 6.5 MB (docid 41782; in val 42 the title page and the table header were downloaded). A printed title with the handwritten municipality name — the fourth primary confirmation of the form Grüble. The table: house number, name, status and residence of the owner, remarks. Only the title pages have been read; the full list of names and any occupational entries (Wirt, Gastwirt) TO_COLLECT — a specialised transcription of all 49 pages.",
      },
      {
        key: "franciscejski-kataster-n83-pv",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — izkaz rabe zemljišč (SI AS 176/N/N83/s/PV): »AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble«",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the land-use statement (SI AS 176/N/N83/s/PV): 'AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble'",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373418",
        noteSi:
          "Ena digitalizirana stran, 474 kB (docid 41783; v 42. valu prenešena in prebrana). Tiskani formular z rokopisnimi vrednostmi — peta primarna potrditev forme Grüble. Preliminarno branje izloči strukturo tal katastrske občine okoli leta 1826: površina občine 1233 jutrov in 573 kvadratnih kletov (~710 ha), največ gozda (556 J ≈ 320 ha, okoli 45 %) — v skladu z naravoslovnimi ocenami (Andrič 2007: gozdnato do danes); sledijo njive in travniki. Vsa števila so predbitna branja rokopisa. Mlinov in gostiln v izkazu ni (negativen zadetek).",
        noteEn:
          "One digitised page, 474 kB (docid 41783; downloaded and read in val 42). A printed form with handwritten values — the fifth primary confirmation of the form Grüble. A preliminary reading extracts the land structure of the cadastral municipality around 1826: the municipality's area of 1,233 Joch and 573 square Klafter (~710 ha), mostly forest (556 J ≈ 320 ha, about 45 per cent) — in agreement with the natural-science assessments (Andrič 2007: wooded to this day); fields and meadows follow. All figures are preliminary readings of the handwriting. No mills and no inns in the statement (a negative result).",
      },
      {
        key: "franciscejski-kataster-n83-pz",
        nameSi: "Franciscejski kataster, k.o. N83 Griblje — katastrski cenilni elaborat (SI AS 176/N/N83/s/PZ): »Catastral-Schätzungs-Elaborat der Gemeinde Grüble«, 71 strani",
        nameEn: "The Franciscean cadastre, c.m. N83 Griblje — the cadastral valuation elaborat (SI AS 176/N/N83/s/PZ): 'Catastral-Schätzungs-Elaborat der Gemeinde Grüble', 71 pages",
        sourceType: "arhiv",
        license: "arhivsko gradivo / archival material",
        url: "https://vac.sjas.gov.si/vac/search/details?id=373419",
        noteSi:
          "71 digitaliziranih strani, 12,5 MB (docid 41784; v 42. valu prenesena naslovnica in uvodni del). Naslovni napis z deželo Kranjsko in okrajem Neustadtl (Novo mesto) — šesta primarna potrditev forme Grüble. Uvodni del (§2 meje, §3 prebivalstvo) bran v treh neodvisnih prehodih (42. val): konskripcija 1830 — 222 moških + 219 žensk = 441 duš v 70 hišah in 102 družinah (eno branje je dobilo 541 oziroma 72 hiš; številke predbitne do specializiranega prepisa); celotno prebivalstvo govori slovensko; med zaposlitvami 1 tkalec, 9 kajžarjev in kovaška hiša, na koncu pa »mlin brez njiv« (potrjeno v dveh od treh prehodov). Gostilniških izrazov (Wirth, Gasthaus, Taferne) v branju ni — negativen zadetek (ena vrstica ostaja nejasna). Najzgodnejši popisni pregled duš, hiš in družin vasi v zbirki; specializiran prepis TO_COLLECT.",
        noteEn:
          "71 digitised pages, 12.5 MB (docid 41784; in val 42 the title page and the introductory part were downloaded). The title bears the Land of Carniola and the district of Neustadtl (Novo Mesto) — the sixth primary confirmation of the form Grüble. The introductory part (§2 boundaries, §3 population) was read in three independent passes (val 42): the conscription of 1830 — 222 males + 219 females = 441 souls in 70 houses and 102 families (one reading produced 541 or 72 houses; the figures remain preliminary until a specialised transcription); the entire population speaks Slovene; among the occupations 1 weaver, 9 cottagers and a smithy, and at the end a 'mill without arable fields' (confirmed in two of three passes). No inn terms (Wirth, Gasthaus, Taferne) in the reading — a negative result (one line remains unclear). The earliest survey of souls, houses and families of the village in the collection; a specialised transcription TO_COLLECT.",
      },
'''
    mc = mc.replace("await digitisation TO_COLLECT.\",\n      },\n    ],", "await digitisation TO_COLLECT.\",\n      },\n" + NEW_SOURCES + "    ],", 1)

    # ── 1b) popravek opombe vira n83-vas (lažen TO_COLLECT iz 41. vala) ──
    CORR_SI = "Raziskava fonda (42. val) je pokazala, da je digitaliziranih vseh 12 enot: grafični listi kot IIIF slike (docid 10; A01 2826×2273, A02 3010×2158, A03 2645×2154, A04 2645×2158, A05 2634×2165 px), spisovne serije pa kot PDF-ji (PG 41778, PR 41779, PS 41780 — 143 strani, PUA 41782 — 49 strani, PV 41783, PZ 41784 — 71 strani; skupaj 269 strani). Muzej je prenesel vseh 5 listov ter strani PG, PR (vse 4) in PV ter vzorce PS, PUA in PZ — naslovi serij potrjujejo formo Grüble: 'Protocol der Grund-Parzellen der Gemeinde „GRÜBLE“', 'Grenz-Beschreibung der Gemeinde „GRÜBLE“' (tiskana naslovnica), 'Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde „GRÜBLE“', 'AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble', 'Catastral-Schätzungs-Elaborat … der Gemeinde Grüble'."
    mc = mc.replace("Preostale enote (grafični listi, PUA, PV, PZ) čakajo digitalizacijo TO_COLLECT.", CORR_SI, 1)
    CORR_EN = "The fond research (val 42) showed that all 12 units are digitised: the graphical sheets as IIIF images (docid 10; A01 2826×2273, A02 3010×2158, A03 2645×2154, A04 2645×2158, A05 2634×2165 px), the written series as PDFs (PG 41778, PR 41779, PS 41780 — 143 pages, PUA 41782 — 49 pages, PV 41783, PZ 41784 — 71 pages; 269 pages in total). The museum has downloaded all 5 sheets and the pages of PG, PR (all 4) and PV as well as samples of PS, PUA and PZ — the series titles confirm the form Grüble: 'Protocol der Grund-Parzellen der Gemeinde „GRÜBLE“', 'Grenz-Beschreibung der Gemeinde „GRÜBLE“' (a printed title page), 'Alphabetisches Verzeichniß Der Grund-Eigenthümer Der Gemeinde „GRÜBLE“', 'AUSWEIS über die Benützungsart des Bodens der Gemeinde. Grüble', 'Catastral-Schätzungs-Elaborat … der Gemeinde Grüble'."
    mc = mc.replace("The remaining units (graphical sheets, PUA, PV, PZ) await digitisation TO_COLLECT.", CORR_EN, 1)

    # ── 1c) odstavek zgodbe MVG-001 SL ──
    P42_SL = "Raziskava fonda je (42. val) zaokrožena do zadnje enote: digitaliziranih je vseh dvanajst — pet grafičnih listov kot IIIF slike in vseh sedem spisovnih serij kot PDF-ji (skupaj 269 strani), vse javno dostopne v virtualni čitalnici Arhiva Republike Slovenije. Muzej je prenesel in prebral kritno karto lista A01 — »Gemeinde GRÜBLE in Illyrien«, izmera 1824, korekcije 1827: prvi katastrski zemljevid vasi, z domačijami ob mejni Kolpi in rdečimi parcelnimi številkami — ter opis meje s tiskano naslovnico »Grenz-Beschreibung der Gemeinde „GRÜBLE“« (1825/26), protokol zemljiških parcel (143 strani), abecedni seznam lastnikov, izkaz rabe zemljišč in cenilni elaborat, katerega uvodni del po preliminarnem branju rokopisa beleži konskripcijo 1830: 441 duš v 70 hišah in 102 družinah ter mlin brez njiv. Vsi naslovi serij ponavljajo isto formo — Gemeinde Grüble — tako da primarna potrditev nemške oblike imena, ki jo je leta 1825 dal protokol stavbnih parcel, zdaj stoji v šestih dokumentih fonda. Podroben Kurrent prepis ostaja naloga specializiranega branja.\\n\\n"
    mc = mc.replace("Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", P42_SL + "Druga svetovna vojna je vas uvrstila v svobodno Belo krajino:", 1)

    # ── 1d) odstavek zgodbe MVG-001 EN ──
    P42_EN = "The fond research is (val 42) now rounded off to the last unit: all twelve are digitised — five graphical sheets as IIIF images and all seven written series as PDFs (269 pages in total), all publicly accessible in the virtual reading room of the Archives of the Republic of Slovenia. The museum has downloaded and read the coloured map of sheet A01 — 'Gemeinde GRÜBLE in Illyrien', surveyed 1824, corrected 1827: the first cadastral map of the village, with its homesteads along the border Kolpa and red parcel numbers — as well as the boundary description with the printed title page 'Grenz-Beschreibung der Gemeinde „GRÜBLE“' (1825/26), the 143-page land-parcel protocol, the alphabetical list of owners, the land-use statement and the valuation elaborat, whose introductory section — according to a preliminary reading of the handwriting — records the conscription of 1830: 441 souls in 70 houses and 102 families, and a mill without arable fields. All the series titles repeat the same form — Gemeinde Grüble — so the primary confirmation of the German name form, first given by the building-parcel protocol of 1825, now stands in six documents of the fond. A detailed Kurrent transcription remains the task of specialised reading.\\n\\n"
    mc = mc.replace("The Second World War placed the village inside free Bela krajina:", P42_EN + "The Second World War placed the village inside free Bela krajina:", 1)

    with io.open(MC, "w", encoding="utf-8") as f: f.write(mc)
    print("OK museum-content.ts: +6 virov (MVG-001), popravek opombe n83-vas, +1 odstavek zgodbe SL/EN")

# ─────────────────────────── 2) konstante 582 → 588, 463 → 469 ───────────────────────────
EXP582 = {AE: 2, ATM: 2, TE: 8, TTM: 8, RT: 4}
for path, expected in EXP582.items():
    t = read(path)
    c = len(re.findall(r"\b582\b", t))
    c88 = len(re.findall(r"\b588\b", t))
    if c != expected and not (c == 0 and c88 >= expected):
        print(f"FAIL konstanta {path}: '582' {c}x, '588' {c88}x, pričakovano {expected}"); sys.exit(1)
    t2 = re.sub(r"\b582\b", "588", t)
    with io.open(path, "w", encoding="utf-8") as f: f.write(t2)
    print(f"OK {path.split('/')[-1]}: 582 → 588 ({expected} mest)")

EXP463 = {AE: 2, TE: 2, TTM: 2}
for path, expected in EXP463.items():
    t = read(path)
    c = len(re.findall(r"\b463\b", t))
    c69 = len(re.findall(r"\b469\b", t))
    if c != expected and not (c == 0 and c69 >= expected):
        print(f"FAIL konstanta {path}: '463' {c}x, '469' {c69}x, pričakovano {expected}"); sys.exit(1)
    t2 = re.sub(r"\b463\b", "469", t)
    with io.open(path, "w", encoding="utf-8") as f: f.write(t2)
    print(f"OK {path.split('/')[-1]}: 463 → 469 ({expected} mest)")

# ── 2b) audit-entities sporočili ──
ae = read(AE)
old = 'ok("582 vrstic virov (41. val: +2 — franciscejski-kataster-n83-vas, franciscejski-kataster-n83-pt)")'
# po globalni zamenjavi je številka že 588
old = old.replace("582", "588")
must(ae, old, 1, "audit-entities sporočilo viri (po zamenjavi)")
ae = ae.replace(old, 'ok("588 vrstic virov (42. val: +6 — franciscejski-kataster-n83-a01/pr/ps/pua/pv/pz)")', 1)
old_id = 'ok("469 identitet virov (40. val: +2)")'
must(ae, old_id, 1, "audit-entities sporočilo identitete (po zamenjavi)")
ae = ae.replace(old_id, 'ok("469 identitet virov (42. val: +6)")', 1)
with io.open(AE, "w", encoding="utf-8") as f: f.write(ae)
print("OK audit-entities.ts: sporočili posodobljeni na 42. val")

print("VGRADNJA 42. VALA ZAKLJUČENA.")
