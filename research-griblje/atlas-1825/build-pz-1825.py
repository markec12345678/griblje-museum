#!/usr/bin/env python3
"""
Val 77 — PZ N83 "Katastral-Schätzungs-Elaborat" (Konskripcija), 71 strani
[VAČ uodid 373419 / docid 41784], Land Krain, Kreis Neustadtl,
Schätzungsdistrict XI (N° 83), Gemeinde Grüble.

PASS 2 (val 77): odločilni re-read Endresultata p67 + §8 (p6) z aritmetičnimi
vrati — POPRAVEK val-75 branj na ravni celic (digit-by-digit izrezki 3×,
2 neodvisna prehoda VLM + direktni odtis avtorja te transkripcije):

  KOREKCIJE vs. val 75 (vsaka z dokaznim izrezkom crops/p67-area/*.jpeg):
    Summa p67:        1132 J 495 K  →  1152 J 495 K   (Kurrent 3↔5)
    Bauarea Klf:      1499[?]       →  1199 (nad prečrtanim 1144); §8 potrdi 1|1199
    Größere Gärten:   105 K         →  405 K         (Kurrent '4'; §8 potrdi 405)
    Wiesen (§8):      55|812[?REV]  →  45 J 812 K    (Kurrent '4')
    Wiesen I (p67):   15 J          →  5 J  IZPELJANO z §8 vrati (45−39−1 od 2412 K)
    WmH Klf (p67):    846           →  558 (trenutna NAD prečrtano 846; isti vzorec
                                      kot Aecher II 334/234 in Bauarea 1199/1144;
                                      §8 kaže isto prečrtavo na 846)
  POTRJENO (neodvisno, 2+ branja / prečna vrata):
    Aecher I 80|842 · Aecher II 334|120 (nad prečrtanim 234|1149) · Wiesen II 39|818
    Kleine Gärten 3|615 · Weingärten 7|42 · Hutweiden 118|702 (nad 402[?])

  ARITMETIČNA VRATA (val 77, fail-fast):
    I1 prebivalstvo: 222 M + 219 Ž = 441 Seelen (EXACT) — nespremenjeno.
    I2 površina: |PZ(rdeči) − PV| / PV < 1 % — nespremenjeno.
    I3 Endresultat struktura: 10 vrstic, površine ≥ 0 — nespremenjeno.
    I4 NOVO per-kultura §8: Aecher I+II = 414|962, KG 3|615, GG 405,
       WG 7|42, HW 118|702, Bauarea 1|1199 — vsaka ENAKOST EXACT (fail-fast).
    I5 NOVO Wiesen: I+II = 45|812 (§8 Einzeln) — izpeljava Wiesen I = 5 J
       (45 − 39 − 1 J od 1594+818 = 2412 K) — fail-fast.
    I6 NOVO Total: vrstice 1–8 (1149 J 495 K) + unbenützbar izpeljano
       (71 J 998 K) = 1220 J 1493 K Total Gemeinde (§8/§1, PV-validirano) — EXACT.

  SUMMA KONTROLA (F-PZ-04, val 77): vsota vrstic 1–8 = 1149 J 495 K;
  zapisana Summa = 1152 J 495 K → Δ = 3 Joch = 4.800 QKlft NATANČNO
  (val 75: Δ 43.488 na napačnih branjih). Klf stolpec se zapire (495 = 495);
  Joch stolpec Summe ostaja 3 J nad vsoto vrstic → F-PZ-04 OSTAJA OPEN
  (pisarjevska nekonsistentnost ali neobjavljena korekcija; nič vsiljenega §4).
  → deleži rabe 1830 se IZPELJEJO iz vrat-solidnih vrstic (I4–I6) in so
  objavljeni v tem JSON-u kot strukturni deleži; timeline UI 'pasture_share'
  OSTAJA absent dokler je F-PZ-04 OPEN (pogodba iz val 76 stoji).

  p43–47 (Reinertragstabellen, PREHOD 7 = val 81): celotni vrstični prepis
  IZVEDEN prek band-metode @nativno (F-PZ-12 RESOLVED): 40 pasov (5 strani ×
  8 pasov, shema val 80: h=328, korak=298, 30px preklop) + 14 x3 zoom re-
  readov dvomljivih regij; 54 VLM klicev + direkten odtis avtorja (40 pasov
  prebranih NEODVISNO pred VLM). Rezultat: p43–47 NISO per-parcelne tabele
  (val 75 struktura korigirana!) — to je Kultur-Beschreibung Reinertrag:
  Wirthschafts-Kurse (9-jähriger Wechsel, 3 skupine × 3 kurse), Düngung
  (3 Fuder, 90/120) in Natural-Ertrag-per-Joch tabele (Metzen/Centner) per
  klasa + Wiesen/KG/WG/HW odsek + prečrtan III. classe list + podpisi p47.
  Številčne vrednosti vgrajene samo s soglasjem ≥ 2 neodvisna branja; proza
  ostaja delno REVIEW (Kurrent halucinacije ostajajo — številke ne).

Metoda (issue #42 §1: SOURCES → DOKAZI → PODATKI; nič ugibanja):
  PREHOD 1 (struktura, val 75): 8 kontaktnih plošč → zemljevid 71 strani.
  PREHOD 2 (val 75): ključna branja digit-by-digit.
  PREHOD 3 (val 77): odločilni re-read p67 + p6 — izrezki celic (crops/
  p67-area/, crops/p6-tab-*, crops/p6-zus-*), 2 neodvisna VLM prehoda na
  dvomljive celice + direktni odtis; aritmetična vrata I4–I6 odločijo.
  PREHOD 7 (val 81): band-metoda p43–47 @nativno (raw-web-val81-2026-09/) —
  direkten odtis (Read, neodvisen 1. bralec) + VLM prehod A (40 pasov, norm)
  + prehod R (14 x3 zoom re-readov); kolizije odločene 2:1 ali x3 odtisom;
  struktura 43–47 korigirana vs. val 75 (F-PZ-12 RESOLVED).

Izhod: pz-konskripcija-1830.json (dokumentni agregat; NI per-parcelnih
trditev — raba po parcelah ostaja neznana §4; prebivalstvo 1830 = dokumentni
podatek §20 časovne plasti).
"""
import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "pz-konskripcija-1830.json")

KLFT_PER_JOCH = 1600
M2_PER_QKLFT = 3.59665


def fail(msg: str):
    raise SystemExit(f"I33 FAIL-FAST (build-pz-1825): {msg}")


def qklf(joch, klafter):
    return joch * KLFT_PER_JOCH + klafter


# --- PREHOD 2 branja (val 75, nespremenjena) ---------------------------------

# §3 BEVÖLKERUNG (p2): "Auf den Conscriptioins-Revisions-Resultaten vom Jahre 1830"
BEVOELKERUNG_1830 = {
    "maenner": 222,
    "weiber": 219,
    "zusammen_seelen": 441,
    "haeuser": 70,
    "familien": 102,
    "source_page": 2,
    "source_section": "§3 Bevölkerung",
    "reading_status": "TRANSCRIBED",
    "passes": 2,
    "evidence": "pz-n83/z-bevoelkerung.jpeg",
    "note": "številke jasne v obeh prehodih; kontekstni izraz 'Hofesgesessene' pri 102 Familien delno nejasen (številka jasna)",
}

# §4 VIEHSTAND (p4): števci jasni v obeh prehodih; vrste delno REVIEW
VIEHSTAND_1830 = {
    "rows": [
        {"count": 124, "species_read": "Ochsen", "species_status": "TRANSCRIBED", "sl": "govedi (volovi/krave)"},
        {"count": 20, "species_read": "Kühe | Rosse", "species_status": "REVIEW", "sl": "krave ALI konji (rokopis dvoumen)"},
        {"count": 30, "species_read": "Jungvieh", "species_status": "TRANSCRIBED", "sl": "mlada goved"},
        {"count": 150, "species_read": "Schafe gesamt", "species_status": "TRANSCRIBED", "sl": "ovce skupaj"},
        {"count": 30, "species_read": "Lämmer[?]", "species_status": "REVIEW", "sl": "jagnjeta[?]"},
    ],
    "source_page": 4,
    "source_section": "§4 Viehstand",
    "reading_status": "PARTIAL",
    "passes": 2,
    "evidence": "pz-n83/z-viehstand.jpeg",
    "note": "števci (124/20/30/150/30) jasni; oznake vrst delno REVIEW — nič se ne ugiba (§4)",
}

# §1 (p3) skupna površina: črno (prečrtano) 1235 J 1516 K → rdeči popravek 1220 J 1493 K
AREA_TOTAL = {
    "black_superseded": {"joch": 1235, "klafter": 1516},
    "red_corrected": {"joch": 1220, "klafter": 1493},
    "passes": 2,
    "evidence": "pz-n83/z-area-digits.jpeg",
    "note": "rdeči popravek prek črno prečrtanih števk; obe vrednosti dokumentirani (nič ni brisano §5); val 77: §8 'Total Fläche der Gemeinde' 1220|1493 nad prečrtanim 1217[?]|1444[?] potrjuje",
}

# PV (val 74) primerjava — iz research-griblje/atlas-1825/pv-land-use-1825.json
PV_GRAND = {"joch": 1221, "klafter": 1573}

# §7 Weingärten (p21) — val 77: 7|42 potrjeno še tretjič (p67 + §8 + §7)
WEINGAERTEN = {
    "einzelne_classe": {"joch": 7, "klafter": 42},
    "red_revision": {"joch": 6, "klafter": 1059, "status": "REVIEW"},
    "mustergrund_parcel_no": "2494[?]",
    "mustergrund_area_klafter": 260,
    "source_page": 21,
    "evidence": "pz-n83/z-weingaerten.jpeg",
}

# --- PREHOD 4 (val 78, neodvisni prehod): §8 rdeči stolpec "Zusammen" — strukturiran ---

REVISION_1830_ZUSAMMEN = {
    "title": "§8 (p6) rdeči stolpec 'Zusammen' — post-revizijske površine po kulturah (Rektifikacija 1830)",
    "source_page": 6,
    "evidence": "pz-n83/crops-v78/p6-red-col-8x.png + p6-red-*-10x.png + p6-weiden-subtotal-6x.png + p6-bottom-8x.png",
    "passes": 2,
    "rows": [
        {"kultur": "Aecher", "joch": 419, "klafter": 1382, "reading_status": "REVIEW",
         "note": "crno (val 77 I4) 414 J 962 K; rdece 419 J 1382 K — stevke 1/9 in 3/5 REVIEW (kurrentska dvoumnost)"},
        {"kultur": "Wiesen", "joch": 45, "klafter": 167, "reading_status": "REVIEW",
         "note": "val 78 usklajeno s crno korekcijo val 77 (55->45 J); val 80 nativna re-digitation: 3 glasove berejo '41' (direkten odtis + VLM A×2), VLM Bx3 '44' — ampak aritmetika subtotala 1150 = 419+45+2+0+6+121+557 EXACT za 45 (za 41 bi Aecher moral biti 423) — VARIANCA 41/45 dokumentirana, ni odlocena §4; rdeci klafter 162-167 dvoumen"},
        {"kultur": "Kleine Gaerten", "joch": 2, "klafter": 1166, "reading_status": "REVIEW",
         "note": "crno 3 J 615 K; rdece 2 J 1166 K (ali 1266) — REVIEW"},
        {"kultur": "Groessere Gaerten", "joch": 0, "klafter": 1460, "reading_status": "REVIEW",
         "note": "crno (val 77) - J 405 K; rdece - J 1460 K (ali 1480) — REVIEW"},
        {"kultur": "Weingaerten", "joch": 6, "klafter": 1059, "reading_status": "TRANSCRIBED",
         "note": "krizno potrjeno: §7 p21 rdeca revizija 6 J 1059 K (F-PZ-06) = §8 rdeci stolpec — edina rdeca vrstica z neodvisno potrditvijo"},
        {"kultur": "Huthweiden", "joch": 121, "klafter": 1190, "reading_status": "REVIEW",
         "note": "crno 118 J 702 K; rdece 121 J 1190 K — REVIEW"},
        {"kultur": "Huthweiden mit Holznutzen", "joch": 557, "klafter": 1258, "reading_status": "REVIEW",
         "note": "crno (I4) 558 J 558 K; val 80: joch 557 aritmeticno POTRJEN (subtotal 1150 EXACT: 419+45+2+0+6+121+557; 357 bi dalo 950≠1150) — dvoumnost 3/5 razresena; klafter 1258 potrjen 3× VLM + direkten odtis"},
    ],
    "subtotal_cultivirte": {"joch": 1150, "klafter": 1582, "reading_status": "REVIEW",
         "note": "rdeci subtotal vrstic 1-7 (pod crto); stevke REVIEW (val 77 je subtotal videl kot del WmH vrstice — lokacija v tabeli potrjena val 78)"},
    "unbenutzt_red": {
        "bauarea": {"joch": 1, "klafter": 1199, "reading_status": "TRANSCRIBED",
                    "note": "rdece aktivno nad crno precrtanim 1 J 1181 K; krizno = p67 Posten 8 aktiven 1199 (F-PZ-11)"},
        "unbenutzbar_voda": {"joch": 68, "klafter": 1019, "reading_status": "REVIEW",
                    "note": "= vec-vrednostna celica F-PZ-10 (64[?]/68 J, 998/1019 K) — val 78 prebere aktivno 68 J 1019 K; ostaja REVIEW (skladno z I6 izpeljavo 71 J 998 K znotraj dvoumnosti)"},
    },
    "total_flaeche": {"joch": 1220, "klafter": 1493, "reading_status": "SOLID",
         "note": "Total Flaeche der Gemeinde — EXACT enak §1 rdecemu popravku (1.953.493 QKlft; vrata I2/I6)"},
    "sum_check": {
        "subtotal_plus_unbenutzt_qklft": 1954200,
        "total_written_qklft": 1953493,
        "delta_qklft": 707,
        "delta_pct": 0.0364,
        "closes": False,
        "status": "OPEN-MICRO",
        "note": "rdeca veriga subtotal+Bauarea+voda = 1.954.200 vs Total 1.953.493 (delta 707 QKlft = 0,036 %) — znotraj REVIEW negotovosti rdecih stevk (subtotal K / voda K); crni stolpec (I4-I6) se zapira EXACT — rdeci stolpec NI podlaga za deleze (F-PZ-15)",
    },
}

# --- PREHOD 3 (val 77): §8 p6 — odločilna tabela (Einzeln = črno, Zusammen = rdeča revizija) ---

# --- Val 79: Rektifikacijski odsek p35–42 (+ p48) — OPISNO-KVALITATEN --------
# PREHOD 5 (val 79): odločilni re-read p35–40 (strukturna hipoteza val 75/77
# 'parcelne korekcije' ovržena) + p41/p42/p48 (1832 protokoli; Einvernehmung).
# Metoda: 2 VLM prehoda (celotne strani @2x + izrezki linij @4x, crops-v79/)
# + direkten odtis avtorja; VLM številke ostajajo nezanesljive (isti vzorec
# kot F-PZ-12) — Muster-citate nosi direkten odtis, VLM prehoda sta neodvisni
# strukturni potrditvi (nobena ne najde per-parcelnih tabel).
#
# PREHOD 6 (val 80): VAČ topološka izčrpnost (F-PZ-17) + NATIVNA re-digitation
# 7 variančnih celic (PR#69 vs val 79, inter-bralčeva varianca 7/7). VAČ II.
# prikaz @300 dpi NE OBSTAJA (pdfPageImage 608px, session raster = ovitek 100px,
# OCR sloj prazen) → maksimum = PDF-native ~150 dpi skeni (1268×2135 portret).
# Metoda val 80: FFT template-matching val-79 izrezkov na nativih (anchors.json)
# → 3 neodvisna branja/celico: (C) direkten odtis avtorja na nativnih x6–x8
# izrezkih + (A) VLM raw+norm + (B) VLM x3 (redigitize-v80.mts; surovi .raw).
# Sistemsko odkritje: pisar piše POMLÁJ (–) za 0 Joch pri površinah < 1 Joch —
# val 79 je sistemsko bral '1 J'. 6/7 celic REŠENIH, inter-bralčeva varianca
# PR#69↔val 79 razrešena; korekcije dolžno dokumentirane spodaj.
REKTIFIKACIJA_BESCHREIBUNG = {
    "title": "Rektifikacija 1830 — Kultur-Beschreibung (p35–40) + 1832 protokoli (p41–42) — opisno-kvalitativen odsek",
    "source_pages": [35, 36, 37, 38, 39, 40, 41, 42],
    "evidence": "pz-n83/crops-v79/p35–p42-full-2x.png + crops-v79/p35-parzelle-h30.png … p40-date2.png (10 izrezkov @4x); val 80: raw-web-val80-2026-10/crops-v80/ (nativni pasovi raw/norm/x3, anchors.json, številčni izrezki x6–x8) + vlm/ (27 JSON+raw)",
    "passes": 3,
    "structure": [
        {"klasse": "I. Aacker", "page": 35, "clases_opisane": ["Erste Classen (p35)", "Zweyte Classen (p36)", "Dritte Classe (p36, rdeča zapis)"],
         "content": "kvaliteta tal per klas (prst, vlaga, položaj; Kameniza prvi klas); brez površin"},
        {"klasse": "II. Wiesen", "page": 37, "clases_opisane": ["Erste Classen", "Zweite Classen"],
         "content": "kvaliteta travnikov (redki, posamezni kosi; boljši kos ob Kolpi); brez površin"},
        {"klasse": "III. Kleine Gärten / IV. Obere Gärten", "page": 38, "clases_opisane": ["III", "IV", "VI. Holzgärten"],
         "content": "kvaliteta vrtov + holzgärten; brez površin"},
        {"klasse": "nadaljevanje (V/VI …)", "page": 39, "clases_opisane": ["Weiden (kontinuiteta)"],
         "content": "meje/lokalitete weiden; brez površin"},
        {"klasse": "zaključni protokol", "page": 40,
         "content": "žirija (Georg Kappas Gemeindevorsteher + 9 članov) + k.k. Schätzungskommission; pečat; 'vierte Nachtag'"},
    ],
    # Muster-parcele: edina numerika v odseku — 'Als Muster dienen die Parzelle
    # № X mit 1 Joch Y [Qft] dem Z zuständig' — vzorčni kos per klas za
    # kakovost, NE korekcije površin (nobena ne površinski popravek).
    "muster_parcel_citations": [
        {"page": 35, "klasse": "Acker — Erste Classen", "parcel_no": 30, "parcel_no_alt": [],
         "joch": 1, "klafter": 1082, "owner": "Moritz Fleuchs[?]", "reading_status": "TRANSCRIBED",
         "pua_1825_match": True, "ps_1825_match": True,
         "note": "val 80 RESOLVED (nativni x6 izrezek p35-no30-digits-x6.png): '1 Joch 1082' — 2. številka čista zaprta '0' (ni '3': sosednja 8 ima jasen vrat); direkten odtis + VLM Bx3 1082; val-79 '1382' OVRŽENO; PR#69 branje 1082 POTRJENO"},
        {"page": 36, "klasse": "Acker — Zweyte Classen", "parcel_no": 594, "parcel_no_alt": [],
         "joch": 1, "klafter": 591, "owner": "Georg Kranjc[?] (Straup/Strauß)", "reading_status": "TRANSCRIBED",
         "pua_1825_match": True, "ps_1825_match": False,
         "note": "val 80 RESOLVED: '1 J 591' — direkten odtis (bowl+rep = 9) + VLM Araw 591; minoritetni '891' (Anorm) in val-79 '531' OVRŽENA; Hö.N. 45"},
        {"page": 36, "klasse": "Acker — Dritte Classe", "parcel_no": 1004, "parcel_no_alt": [],
         "joch": 1, "klafter": 1010, "owner": "Moritz Brincz[?] (Bring)", "reading_status": "TRANSCRIBED",
         "pua_1825_match": "token-hits-only", "ps_1825_match": False,
         "note": "val 80 RESOLVED (nativni anchor _v-p36-no1099.png): 'Nro 1004 mit 1 Juch 1010 Rof' — jasno; val-79 '№1099 = 1 J 700' OVRŽENO na obeh (številka + površina); PR#69 branje №1004 = 1 J 1010 POTRJENO; PUA token-zadetki 4 vrstice (Brincz Maria h.28, Wurzer h.24, Sautter h.21, Pattle h.51) — neodločujoči"},
        {"page": 37, "klasse": "Wiesen — Erste Classen", "parcel_no": 738, "parcel_no_alt": [438],
         "joch": 0, "klafter": 895, "owner": "M. Brincz[?] | Micho Müller[?]", "reading_status": "TRANSCRIBED-STRUCTURE",
         "pua_1825_match": True, "ps_1825_match": True,
         "note": "val 80: STRUKTURA RESOLVED — 'mit – Juf 895' (POMLÁJ = 0 Joch!; val-79 '1 J 896' ovržena na obeh); številke: sredinska 9 (bowl+descender), končnica 5 (flag) → 895 best-read; PR#69 '395' ovržena; parcel_no 738 jasno na nativnem izrezku (val-79 alternativa 438 ostaja možna: 438 v PS, 738 v PUA)"},
        {"page": 37, "klasse": "Wiesen — Zweite Classen", "parcel_no": 2451, "parcel_no_alt": [],
         "joch": 0, "klafter": 1515, "owner": "M. Plaberz[?] (Blaznik)", "reading_status": "TRANSCRIBED",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "val 80 RESOLVED: '№ 2451 mit – Juf 1515' — POMLÁJ (val-79 '1 J' ovržen) + 1515 jasno (PR#69 '1575' ovržena); v 1825 registru NE obstaja → rektifikacijska numeracija"},
        {"page": 38, "klasse": "Obere Gärten", "parcel_no": 2491, "parcel_no_alt": [249],
         "joch": 0, "klafter": 260, "owner": "Moritz Plabutsch[?]", "reading_status": "TRANSCRIBED",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "val 80: '№ 2491 mit – Juf 260' — POMLÁJ potrjen na nativnem izrezku (val-79 '1 J' ovržen), 260 = soglasje vseh bralcev; VLM '249/1' alternativa ostaja dokumentirana"},
        {"page": 39, "klasse": "Weiden (nadaljevanje)", "parcel_no": 1288, "parcel_no_alt": [2875],
         "joch": 1, "klafter": 882, "owner": "Joseph Milavec[?]", "reading_status": "REVIEW",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "val 80: OSTAJA REVIEW — celica poškodovana/popravljena (prečrtani glifi + vstavki + subscript '943[?]'; nativni x6 izrezek p39-no1288-digits-x6.png): direkten odtis '1 J 8??' (številke pod prečrtavo delno nečitljive), VLM kaos (2245/2475/543/743 = halucinacije); kandidati: val-79 882|883 vs PR#69 589/549; Joch=1 strinjajo vsi prehodi"},
    ],
    # val 80: nativna re-digitation — metoda + odločilna miza (adjudication)
    "val80_redigitation": {
        "motivation": "inter-bralčeva varianca PR#69 vs val 79 na 7/7 ključnih celic (Kurrent 0↔3/5↔9/0↔7) + pričakovana rešitvena pot 'VAČ II @300 dpi'",
        "vac_topology": "F-PZ-17: VAČ II. prikaz @300 dpi NE OBSTAJA — pdfPageImage = fiksna 608px predogleda (parametri ignorirani), session IIIF raster = ovitek 100×50 (info.json 404), per-page OCR AnnotationList = prazna, pdf-manifest canvasi = PDF točke; maksimum = PDF-native vgrajeni skeni ~150 dpi (1 rastri/stran, brez mask) — nativi že v pz-n83/native/ od val 75; pretekle @2x–@4x večave = interpolacija",
        "method": "FFT template-matching (numpy NCC) val-79 izrezkov → anchors.json (vizualno verificirani pasovi) → 3 neodvisna branja/celico: C direkten odtis (nativni x6–x8 številčni izrezki), A VLM raw+norm (nativni piksli), B VLM x3 lanczos; surovinski izpisi vlm/*.raw; 27/27 klicev OK",
        "adjudication": "6/7 REŠENIH (≥2 soglasna branja): №30 1082 (vs 1382) · №594 591 (vs 531) · №1004 1010 (vs №1099 700 — tudi številka!) · №738 – J 895 (vs 1 J 896) · №2451 – J 1515 (vs 1 J; 1515 vs 1575) · №2491 – J 260 (vs 1 J; soglasje) · №1288 REVIEW (poškodovana); sistemsko: '– J' = 0 Joch pri površinah < 1 Joch — val 79 sistemsko bral '1 J'",
        "f_pz_04_impact": "NENIČ — Muster-parcele so vzorci kakovosti, ne seštevajo se v Endresultat; Δ 3 J ostaja; korekcije so izključno kvalitetne (pravilna branja citatov)",
        "evidence": "raw-web-val80-2026-10/: crops-v80/ (nativni izrezki) + anchors.json + crops-manifest.json + vlm/ (27 JSON + 27 .raw) + redigitize-v80.mts",
    },
    "renumbering": {
        "finding": "4/7 Muster-parcel (2451, 2491, 1288, 2875) NE obstaja v 1825 PUA/PS registru; 30 (PUA+PS) / 594 (PUA) sovpadajo; 738 v PUA + 438 v PS (val 80: branje 738 jasno na nativnem izrezku); 1004 (val 80 popravek 1099) samo token-zadetki v PUA (4 vrstice — neodločujoči)",
        "interpretation": "Muster-parcele citirajo novo (rektifikacijsko) numeracijo po Rektifikaciji 1830 — 1825 franziscejska numeracija NI podlaga; per-parcelna vezava 1825→1830 ostaja UNKNOWN (zahteva Rektifikacijski protokol ali Habsburgisch-Katastrale Neuvermessung sezname)",
        "status": "REVIEW",
    },
    "protocol_p40": {
        "dates": {"day1": "9. (Kamm. Griblje)", "day2": "29. (k.k. Schätzungskommission)", "month": "April[?] — REVIEW (VLM 1. prehod bral 'avgust'; eye+val 75 kontekst: april)",
                  "year": 1830, "previous_guess_val75": "5./28. april 1830[?] — OVRŽENO (odločilni re-read)"},
        "jury": "Georg Kappas Gemeindevorsteher + Jacob Mulauzich + Georg Kaeiper + Matthias Pfeinersch + Georg Klancz + Mursko Pertlswang + Matr. Schlabbrisch + Ludwig [?] + Margaretha Frankiner[?] (REVIEW — identitetna dela NI izvedena §5)",
        "commission": "Aladar Manrera[?] k.k. Schätzungs-Commission Steuer-Bezirk + pečat (vosk)",
        "addendum": "'vierte Nachtag' — 4. priloga (p40)",
    },
    "post_1830_protocols": {
        "p41": "Nachsetzung (Parzelle № 1980 / № 88; 12. avgust 1832[?]) + Vergleich (4. junij 1832[?]) — 1832 dogodki, brez površin",
        "p42": "Einvernehmungs-Protocoll, Kreis Neustadtl / Schätzungsdistrict XI / Steuerbezirk Krupp, Griblje am 6. Dezember 1832 — Natural-Brutto-Ertrag (popravek val-75 oznake 'EINWANDS-PROTOKOLL' — odločilni re-read: naslov je 'Einvernehmungs-Protocoll')",
        "p48": "Einvernehmungs-Protocoll 5. aprila 1830 (rožnat papir): vzroki poškodb/vrtnin[?] — proza, brez per-parcelnih tabel",
    },
    "conclusion": {
        "f_pz_04_path": "ZAPRETA — Rektifikacijski odsek v PZ [373419] NE vsebuje per-parcelnih površinskih korekcij: p35–40 so opisne klase + Muster-parcele (kakovost, ne količina), p41–42 so 1832 protokoli brez površin",
        "remaining_paths": ["zunanji Rektifikacijski/Komunikacijski protokol (SI AS / ločena arhivska enota) — izven peskovnika", "(VAČ II. prikaz @300 dpi OVRŽEN — ne obstaja, F-PZ-17 val 80)"],
        "f_pz_04_status": "OPEN (ožjan val 77 na Δ 3 J; vse peskovniške rešitvene poti IZČRPANE: val 78 F-PZ-14 + val 79 F-PZ-16 + val 80 F-PZ-17)",
    },
    "reading_honesty": "val 80 nativna re-digitation (3 neodvisna branja na nativnih pikslih) razreši 6/7 Muster-citatov — prejšnje REVIEW oznake val 79 so bile posledica (a) sistemsko napačnega branja pomlaja ('– J' = 0 Joch brano kot '1 J') in (b) interpoliranih @4x večav namesto nativnih pikslov; VLM na nativnih pasovih še vedno variira (halucinacije (891/1070/637/743/2245/743) dokumentirane v vlm/*.raw) — vgrajena so samo soglasja ≥ 2 neodvisna branja; №1288 ostaja REVIEW (poškodovana celica)",
}

PARAGRAF8_P6 = {
    "title": "§8 Cultivirte, unbenützte und unbenützbare Grundstücke (p6)",
    "columns": {"einzeln": "Einzeln (Joch | □Klf) — črno", "zusammen": "Zusammen (Joch | □Klf) — rdeča revizija"},
    "einzeln_rows": [
        {"kultur": "Aecher", "joch": 414, "klafter": 962, "note": "962 nad prečrtanim 964[?]; = p67 Aecher I+II EXACT"},
        {"kultur": "Wiesen", "joch": 45, "klafter": 812, "note": "val 75 je bral '55|812' REVIEW — val 77 korekcija: Kurrent '4' → 45 J 812 K"},
        {"kultur": "Kleine Gärten", "joch": 3, "klafter": 615},
        {"kultur": "Größere Gärten (dtto)", "joch": 0, "klafter": 405, "note": "Kurrent '4' — potrjuje p67 korekcijo 105 → 405"},
        {"kultur": "Weingärten", "joch": 7, "klafter": 42},
        {"kultur": "Huthweiden", "joch": 118, "klafter": 702, "note": "702 nad prečrtanim 402[?] (isto kot p67)"},
        {"kultur": "Huthweiden mit Holznutzen", "joch": 558, "klafter": 846, "note": "846 s prečrtavo — revizija na 558, ki jo p67 zapiše kot '558 nad prečrtano 846' (F-PZ-11)"},
    ],
    "unbenutzt_rows": [
        {"kultur": "Bauarea — 'Zu den Unbenützten zählt ein Bauarea'", "joch": 1, "klafter": 1199,
         "crossed_klafter": ["1144"], "note": "= p67 vrstica 8 EXACT (F-PZ-11 korekcija 1499 → 1199)"},
        {"kultur": "Unbenützbar: Felsen, höchste Leiten, Wege", "joch": None, "klafter": None,
         "status": "REVIEW",
         "note": "več-vrednostna celica: rdeče 64[?] J, črno 68[?] J prečrtano; Klf 998 prečrtano, 1019 prečrtano — končni vpis neodločljiv na 182 dpi skenu; iz Total vrat I6 IZPELJANA vrednost 71 J 998 K (F-PZ-10)"},
    ],
    "total_gemeinde": {"joch": 1220, "klafter": 1493, "crossed": ["1217[?]", "1444[?]"],
                       "note": "= §1 rdeči popravek EXACT; PV Δ 0,086 %"},
    "zusammen_column_semantics": {
        "status": "STRUCTURED-V78",
        "note": "rdeči 'Zusammen' stolpec = post-revizijske površine (Rektifikacija 1830) — strukturiran in prebran v revision_1830_zusammen (val 78, 2 prehoda pri 6x-12x, crops-v78/)",
    },
    "evidence": "pz-n83/crops/p6-tab-*.jpeg + crops/p6-zus-*.jpeg (val 77)",
}

# --- PREHOD 3 (val 77): p67 Specifischer Ausweis — odločilni re-read -------------------------
# Vzorec revizij na p67 (5 neodvisnih primerov): TRENUTNA vrednost zapisana NAD
# prečrtano izvirno. Vsi prečrtani izpisi ohranjeni (nič ni brisano §5).

ENDRESULTAT_ROWS = [
    {"no": 1, "kultur": "Aecher", "classe": "I", "joch": 80, "klafter": 842,
     "crossed": {}, "reading_status": "TRANSCRIBED",
     "evidence": "pz-n83/crops/p67-rows/r01-acker1-L.jpeg"},
    {"no": 1, "kultur": "Aecher", "classe": "II", "joch": 334, "klafter": 120,
     "crossed": {"joch": ["234"], "klafter": ["1149[?]"]}, "reading_status": "TRANSCRIBED",
     "note": "334 nad prečrtano 234 — val 77 odločilni izrezek potrdil val-75 branje; vrata I4 (§8 414|962) samodejno",
     "evidence": "pz-n83/crops/p67-area/acker2.jpeg"},
    {"no": 2, "kultur": "Wiesen", "classe": "I", "joch": 5, "klafter": 1594,
     "crossed": {}, "reading_status": "GATED (I5)",
     "note": "Joch izpeljano z §8 vrati I5: 45 − 39 − 1 J (od 2412 K) = 5; direkten odtis na p67 dvoumen ('15'-podobna zapis pod rdečo diagonalno črto, val 75 je bral 15) — vrednost 5 je edina, ki zapre §8 (45|812) IN Total (I6); Klf 1594: 1594+818 = 2412 = 1 J 812 K EXACT",
     "evidence": "pz-n83/crops/p67-area/wiesen1-tall.jpeg"},
    {"no": 2, "kultur": "Wiesen", "classe": "II", "joch": 39, "klafter": 818,
     "crossed": {}, "reading_status": "TRANSCRIBED",
     "evidence": "pz-n83/crops/p67-rows/r04-wiesen2-L.jpeg"},
    {"no": 3, "kultur": "Kleine Gärten", "classe": "C", "joch": 3, "klafter": 615,
     "crossed": {}, "reading_status": "TRANSCRIBED",
     "evidence": "pz-n83/crops/p67-rows/r05-kgaerten-L.jpeg"},
    {"no": 4, "kultur": "Größere Gärten", "classe": "C", "joch": 0, "klafter": 405,
     "crossed": {}, "reading_status": "TRANSCRIBED",
     "note": "val 75 je bral 105 — val 77 korekcija: Kurrent '4' (istna oblika kot §8 GG 405); vrata I4",
     "evidence": "pz-n83/crops/p67-rows/r06-ggaerten-L.jpeg"},
    {"no": 5, "kultur": "Weingärten", "classe": "C", "joch": 7, "klafter": 42,
     "crossed": {}, "reading_status": "TRANSCRIBED",
     "evidence": "pz-n83/crops/p67-rows/r07-weing-L.jpeg"},
    {"no": 6, "kultur": "Hutweiden", "classe": "C", "joch": 118, "klafter": 702,
     "crossed": {"klafter": ["402[?]"]}, "reading_status": "TRANSCRIBED",
     "note": "702 nad prečrtano 402[?]; val 75 je prečrtavo zabeležil v Joch stolpcu ('449[?]') — val 77: prečrtava je v Klf",
     "evidence": "pz-n83/crops/p67-area/hutweiden.jpeg"},
    {"no": 7, "kultur": "Weiden mit Holznutzen", "classe": "C", "joch": 558, "klafter": 558,
     "crossed": {"klafter": ["846"]}, "reading_status": "TRANSCRIBED",
     "note": "Trenutna 558 zapisana NAD prečrtano 846 (isti revizijski vzorec kot Aecher II/Bauarea/HW); §8 kaže isto prečrtavo; val 75 je bral 846 kot trenutno — F-PZ-11; Joch 558 (val 75 je tu zabeležil prečrtano '446[?]' — na izrezku ni prečrtave v Joch, 558 pa je jasno)",
     "evidence": "pz-n83/crops/p67-area/holznutzen.jpeg"},
    {"no": 8, "kultur": "Bauarea", "classe": "–", "joch": 1, "klafter": 1199,
     "crossed": {"klafter": ["1144"]}, "reading_status": "TRANSCRIBED",
     "note": "val 75 je bral 1499 — val 77 korekcija: 1199 nad prečrtano 1144; §8 'Zu den Unbenützten zählt ein Bauarea' 1|1199 EXACT; vrata I4",
     "evidence": "pz-n83/crops/p67-area/bauarea.jpeg"},
]
ENDRESULTAT_SUMMA = {"joch": 1152, "klafter": 495, "crossed": {"klafter": ["474[?]|481[?]"]}, "source_page": 67,
                     "note": "val 75 je bral 1132 — val 77 korekcija: Kurrent 3↔5 → 1152 (odločilni izrezek, 2 prehoda)"}

# --- PREHOD 7 (val 81): p43–47 Reinertrag — band-metoda @nativno -------------
# 40 pasov (5 strani × 8; h=328, korak=298, 30px preklop — shema val 80 testa)
# + 14 x3 zoom re-readov; 54 VLM klicev; direkten odtis avtorja NEODVISNO pred
# VLM (40 pasov prebranih s Read orodjem). Vrednosti = soglasje ≥ 2 neodvisna
# branja (odkopane kolizije: p43 item2 12-vs-72, p45 item1 15-vs-114/19,
# p45 item7 60-vs-6, p45 Kart#1 6-vs-8, p46 Wiesen II lomec 8 3/8). Proza =
# delno REVIEW (Kurrent halucinacije ostajajo na besedilu, ne na številkah).
REINERTRAG_P43_47 = {
    "title": "p43–47 Reinertrag (Kultur-Beschreibung št. 2) — band-transkripcija @nativno (val 81)",
    "source_pages": [43, 44, 45, 46, 47],
    "method": {
        "name": "band-metoda @nativno",
        "bands": "5 strani × 8 pasov (h=328, korak=298, 30px preklop; shema val 80 testa p43)",
        "readers": "3 neodvisni glasovi: direkten odtis avtorja (40 pasov, PRED VLM) + VLM prehod A (norm) + VLM prehod R (14 x3 zoom dvomljivih regij)",
        "calls": "54 VLM klicev (40 A + 14 R); surovinski izpisi vlm/*.json + *.raw (raw-web-val81-2026-09/)",
        "admission_rule": "vgrajeno samo soglasje ≥ 2 neodvisna branja; kolizije odločene 2:1 ali direktnim odtisom na x3/x4 izrezku; dvoumne enote/črke = [?] / REVIEW",
        "resolution": "F-PZ-12 RESOLVED — celostranski VLM prepis (val 75 zavrnjen) zamenjan z band-metodo; VAČ @300 dpi pot ne obstaja (F-PZ-17)",
    },
    "structure_correction_vs_val75": [
        "p43: NE 'I. Classe Reinertragstabelle (parcele)' — je 1te Classe Wirthschafts Kurse + Düngung + Natural Ertrag pro Joch",
        "p44: IIte Classe — isti Kurse kot I. Classe + Düngung = I. + Natural Ertrag z razponi",
        "p45: NE 'IIa. Classe (2 parcele N°96/311)' — je IIIte Classe (Kurse = I. et II.; Natural Ertrag CEL LIST X PREČRTAN + Anmerkung)",
        "p46: NE 'III. Classe + KG/WG/HW Ertrags Classe' — začne se z 'Wiesen mit 2 Classen' (I: zusammen 14; II: 8 3/8) + KG + WG + Hutweiden",
        "p47: NE 'Wald und Ödland? Erste Classe' — je 'Huthweiden mit [supra: ganz=|Holz=] Nutznießung und Niederwald — Einzige Classe' (X prečrtano) + proza + podpisi",
    ],
    "acker_wirthschafts_kurse": {
        "system": "9-jähriger Wechsel (9 kursov); p43 tabela: 3 skupine (Bestellung) × 3 kurse — skupina 1 → kurse 1–3, 2 → 4–6, 3 → 7–9",
        "classen": {
            "I": {"page": 43, "heading": "Ackerland mit [gestrichen, supra 2] Classen — 1te Classe",
                  "kurse": "lastna tabela (1–9)", "duengung": "alle 3 Fuder; 90 [Fuhren?]; 120 [Stück] — številke 3× potrjene, enote delno REVIEW",
                  "natural_ertrag_pro_joch": [
                      {"item": 1, "produkt": "Felder mit Mais", "wert": 26, "enota": "Metzen"},
                      {"item": 2, "produkt": "Hafer[?]", "wert": 12, "enota": "Metzen", "note": "kolizija 12-vs-72 odločena 2:1 (odtis + R vs A)"},
                      {"item": 3, "produkt": "Klee in 2 Maißland[?]", "wert": 50, "enota": "Centner"},
                      {"item": 4, "produkt": "Hafergrund", "wert": 12, "enota": "Metzen"},
                      {"item": 5, "produkt": "Brand", "wert": 12, "enota": "ditto"},
                      {"item": None, "produkt": "Kartoffel-Gärten", "wert": 10, "enota": "ditto", "note": "nenumerirana vstavljenost po item 5"},
                      {"item": 6, "produkt": "Brache", "wert": 15, "enota": "ditto"},
                      {"item": 7, "produkt": "Brandstücke", "wert": 80, "enota": "ditto"},
                      {"item": 8, "produkt": "Brand", "wert": 12, "enota": "ditto"},
                      {"item": None, "produkt": "Kartoffel-Gärten", "wert": 10, "enota": "ditto"},
                      {"item": 9, "produkt": "Brache", "wert": 15, "enota": "ditto"},
                  ]},
            "II": {"page": 44, "heading": "IIte Classe",
                   "kurse": "'Gleiche Kurs als in Iten Acker Classen' (ista tabela 1|1)",
                   "duengung": "'wie in I[te]n Acker Classe[n]'",
                   "natural_ertrag_pro_joch": [
                       {"item": 1, "produkt": "Felder mit Mais", "wert": "18–20", "enota": "Metzen", "note": "razpon; VLM prehod A prazen, odločil direkten odtis + R"},
                       {"item": 2, "produkt": "Hafer", "wert": "9–10", "enota": "ditto"},
                       {"item": 3, "produkt": "Klee[?]", "wert": "30–40", "enota": "Centner"},
                       {"item": 4, "produkt": "Hafergrund", "wert": "9–10", "enota": "Metzen"},
                       {"item": 5, "produkt": "Brand", "wert": "9–10", "enota": "ditto"},
                       {"item": None, "produkt": "Kartoffel-Gärten", "wert": "7–8", "enota": "ditto"},
                       {"item": 6, "produkt": "Brache", "wert": "10–12", "enota": "ditto"},
                       {"item": 7, "produkt": "Brandstücke", "wert": "65–70", "enota": "ditto"},
                       {"item": 8, "produkt": "Brand", "wert": "9–10", "enota": "ditto"},
                       {"item": None, "produkt": "Kartoffel-Gärten", "wert": "7–8", "enota": "ditto"},
                       {"item": 9, "produkt": "Brache", "wert": "10–12", "enota": "ditto"},
                   ]},
            "III": {"page": 45, "heading": "IIIte Classe (val 75: napačno 'IIa' — korigirano)",
                    "kurse": "'Gleich Kurs den I= et II= Ackerclassen' (tabela 1|1); proza 'Man behandelt diesen Acker in 9 jährigen Wechsel, mit folgenden Feldfrüchten' PREČRTANA",
                    "duengung": "'wie in den I= et II= Ackerclas[sen]'",
                    "natural_ertrag_pro_joch": [
                        {"item": 1, "produkt": "Felder mit Mais", "wert": 15, "enota": "Metzen", "note": "kolizija 15-vs-114/19 odločena direktnim odtisom na x3"},
                        {"item": 2, "produkt": "Hafer[?]", "wert": 8, "enota": "ditto"},
                        {"item": 3, "produkt": "Klee[?]", "wert": 30, "enota": "Centner"},
                        {"item": 4, "produkt": "Hafergrund", "wert": 8, "enota": "Metzen"},
                        {"item": 5, "produkt": "Brand", "wert": 8, "enota": "ditto"},
                        {"item": None, "produkt": "Kartoffel-Gärten", "wert": 6, "enota": "ditto", "note": "kolizija 6-vs-8 odločena direktnim odtisom na x4"},
                        {"item": 6, "produkt": "Brache", "wert": 9, "enota": "ditto"},
                        {"item": 7, "produkt": "Brandstücke", "wert": 60, "enota": "ditto", "note": "kolizija 60-vs-6 odločena 2:1 (odtis + R)"},
                        {"item": 8, "produkt": "Brand", "wert": 8, "enota": "ditto"},
                        {"item": None, "produkt": "Kartoffel-Gärten", "wert": 6, "enota": "ditto"},
                        {"item": 9, "produkt": "Brache", "wert": 9, "enota": "ditto"},
                    ],
                    "crossed": "CEL Natural-Ertrag LIST X PREČRTAN (velik X čez vse postavke) — III. classe Ertrag opuščen; list zaključi 'Anmerkung' (proza REVIEW)"},
        },
    },
    "wiesen_kg_wg_hw": {
        "page": 46,
        "wiesen": {
            "heading": "Wiesen mit 2 Classen",
            "classe_I": "proza [REVIEW]: '… mittelmäßig[?] … geben jährlich [2 Schnitte?] … à 3[?]. zusammen 14' — vrednost 14 potrjena 3×, enota 'Fth|fl' REVIEW",
            "classe_II": "'… unmittelbar[?] …, und geben … im Ganzen 8 3/8' — lomec potrjen (A 8 2/5 ovržen, R+odtis x3 8 3/8; števec 3-vs-5 ostaja REVIEW)",
        },
        "kleine_gaerten": {"heading": "Kleine Gärten — Einzige Classe", "note": "+ prečrtan vstavek 'große Gemüse=Gärten'; proza 'Ein … 800 QKlf[?] …' REVIEW"},
        "weingaerten": {"heading": "Weingärten — Einzige Classe",
                        "yield": "'zu M[?]bac[?] … 9 [Eimer?] / Wein … 12' — 12 potrjena 2× (A+R); 9 z [?]; prose REVIEW",
                        "cross_check": "p30 Zusammenstellung (val 77): Weingärten 12 Eimer — SROGLASJE"},
        "hutweiden": {"heading": "Hutweiden — Einzige Classe",
                      "yield": "'… mit Pflügen für so viel … 2 3/8' (Fuder[?]) — A+R soglasje 2 3/8; odtis brez lomca (1. branje) — potrjeno s 2 glasovi"},
    },
    "huthweiden_holznutzung": {
        "page": 47,
        "heading": "Huthweiden mit [supra: ganz=|Holz=] Nutznießung und Niederwald — Einzige Classe — CEL NASLOV + uvodna proza X PREČRTANA",
        "prosa": "[REVIEW]: 'Zusammenstellung[?] aus 5/6[?] …' (prečrtano) + '… ohne Holzcultur … Trinkwasser … Wild …' (meni/reka?)",
        "actum": "'Actum ut supra[?]' + podpisi — datum povezan z val 75 opombo '16. julij 1829[?]'",
        "signatures": "Kappas (Weis[?]/Gemeinde[?]) + 6 prič s + : Georg H[olz]inger[?] (gemainde Richter[?]), Jakob Malešek[?], Georg Adrijan[?], Miha Menart[?], Hieronym[us] Čeglar[?], Kajetan Nermann[?] — vsa imena REVIEW (Kurrent)",
        "cross_impact": "prečrtava NE vpliva na §8/p67 (Weiden mit Holznutzen 557 J obstaja kot kultura) — gre za opuščen osnutek odseka",
    },
    "reading_honesty": "številke = soglasje ≥ 2 neodvisna branja (54 klicev + odtis); proza = delno REVIEW (Kurrent halucinacije dokumentirane v vlm/*.raw); vrednosti NISO per-parcelne trditve — to so klasni Natural-Ertrag koeficienti (metzensko/centnersko na 1 Joch), rabne/površinske posledice NIČ (§4/§22)",
}

# --- PREHOD 8 (val 109): p48–65 2. prehod — protokoli + Verantwortlichung §1–§8 + Zus A/B --
# Metoda: karte strani preslikane z direktnim odtisom (full-2x + secnum/row zoomi, 0 VLM)
# PRED VLM; VLM glasovi prek read-v109.mts (manifest-v109.json, 45 izrezkov, resumable
# koščki). DEJANSKO STANJE: val 109 zaključen BREZ VLM glasov — 429 kvota (dnevni značaj,
# izčrpna z val 107/108 branj; 2,5 h kontinuiranih 429 kljub ponovitvam) — glasovi ODLOŽENI
# ob kvoti (vzorec p142-t-kultur2); 45 izrezkov ostane resumable. Aritmetični model I7
# (potrjen EXACT na p57/p59, blizu na p52):
# Anschlag im Gelde = Roh-Ertrag × Taxa%; Rein-Ertrag = Roh − Anschlag.
# Strukturna korekcija p50–61 (F-PZ-18): § številke monotone 1–8 — val 75 oznake
# ('§5 Kleine Gärten', '§6 Größere', '§7 Weingärten', '§8 Hutweiden', '§9 Wiesen/Hutweiden',
# 'Dritte/Vierte Classe', 'Campus nach Rektifizierung', 'nadaljevanje') VSE korigirane.
# p61 = prazna tiskana predloga + p62/p64 tiskani naslovnici — brez VLM (direktni odtis).
PROTOKOLLE_P48_49 = {
    "title": "Einvernehmungs-Protocoll 5. aprila 1830 (p48–49) — proza + podpisi (val 109 prepis)",
    "source_pages": [48, 49],
    "paper": "rožnat papir (val 75 opomba potrjena — p48–49 vizualno drugačni od § strani)",
    "datum": "5. April 1830",
    "naslov": "Einvernehmungs-Protocoll (p48); nadaljevanje brez lastnega naslova (p49) — NE samostojen 'Communications-Protokoll' (val 75 korigirano)",
    "uvod": "[REVIEW proza]: 'Nachstehend über dem Protocoll deren[?] Gemeinde Steuerbezirks Amt eingelaufenen[?] Besitzer der Gemeinde Grüble um den Verhandlungen beizuwohnen' — uvedba na srečanje občanov pred k.k. Steuerbezirksamt",
    "prisotni": {
        "status": "REVIEW (Kurrent imena)",
        "list": "Gemeinde Ausgeschoss[?]: Georg Kappas[?] (Gemeinde Vorsteher[?]), Johann Müller[?] (Gemeinde Richter[?]), Johann Konšlak[?], Miko Krainz[?] — 4 imena s podpisi na p49; +ALA Wais[?] (2. stran, REVIEW)",
        "evidence": "raw-web-val109-2026-09/crops-v109/p48-half-a.png + p49-half-b.png",
    },
    "vsebina": [
        "[REVIEW proza]: Vortrag občanov — pritožba/obrazložitev glede odmerjenega Cultural-Ausweises (obveznosti pri gojenju/vrtninah[?]); omemba Gärten in 8–15 [Klafter robov?]; odgovor komisije; zaključek 'Zu Urkund dessen … Unterschrift gegeben' (p49)",
        "per-parcelnih tabel NI (skladno z val 79 re-read)",
    ],
    "signatures": "p49: 4 × podpis z + (Kappas[?], Müller[?], Konšlak[?], Krainz[?]) + uradnik [REVIEW]",
    "reading_honesty": "struktura/datum = direktni odtis (večkrat); proza + imena = REVIEW; val 109 zaključen BREZ VLM glasov (429 kvota) — read-v109 izrezki p48-half-a/b + p49-half-a/b ostanejo resumable, glasovi jih prilagodijo ob kvoti (2. mikroprehod, vzorec p142-t-kultur2)",
}

VERANTWORTLICHUNG_P50_61 = {
    "title": "Veranschlagung des Cultur-Aufwandes und Darstellung des Rein-Ertrages (p50–61) — §1–§8 per klasa (val 109 2. prehod)",
    "source_pages": [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61],
    "method": {
        "name": "karte + izrezki @nativno (metoda val 80/81) + VLM glasovi",
        "crops": "45 izrezkov (raw-web-val109-2026-09/crops-v109/): 18 full-2x (diagnostika) + 45 manifest celic (proza/table/begr po § strani; p63/p65 pasovi + desni blok; p48/49 polovici; p50 naslov)",
        "readers": "glas #1 = direktni odtis avtorja (full-2x + row-zoom 2x–4x, PRED VLM, direct-reads-v109.md); glas #2/#3 = VLM read-v109.mts; odloča soglasje ≥ 2 ali aritmetični model I7",
        "admission_rule": "vrednosti s soglasjem ≥ 2 → TRANSCRIBED; kolizija 1:1 → REVIEW; model I7 (EXACT) dvigne potrditev; nič se ne ugiba (§4)",
    },
    "structure_correction_vs_val75": [
        "p50: NE 'VERANTWORTLICHUNG' — je 'Veranschlagung des Cultur-Aufwandes und Darstellung des Rein-Ertrages. §. 1. Ackerland' (Erste Classe)",
        "p51: NE 'Campus nach Rektifizierung ležeča tabela' — je nadaljevanje Begründung §1 (proza) + prazna tiskana predloga + bleed-through s p50",
        "p52: NE 'Dritte Classe' — je §1 Ackerland II.te Classe",
        "p53: NE 'Dritte Classe' — je §2 Wiesenland I.te Classe",
        "p54: NE 'Vierte Classe' — je §2 Wiesenland II.te Classe",
        "p55: NE '§5 Kleine Gärten' — je §3 Kleine Gärten (einzige Classe)",
        "p56: NE '§6 Größere Gärten' — je §4 Größere Gärten (einzige Classe)",
        "p57: NE '§7 Weingärten' — je §5 Weingärten (einzige Classe); '7 parcel 1,2,4,5,6,8,11' iz val 75 je p63 vsebina (Zus B), NE p57",
        "p58: NE '§8 Hutweiden' — je §6 Weiden (einzige Classe)",
        "p59: NE '§9 Wiesen/Hutweiden' — je §7 Weiden mit Holznutzung (einzige Classe; 2 vrstici + vsota)",
        "p60: NE 'Classe tabela nadaljevanje' — je §8 Bau-Area + podpis (Neustadtl 18.1.1831[?] Josef Scheram[?]) + rdeče 'revaluiert'",
        "p61: NE 'nadaljevanje' — je prazna tiskana predloga (proza brez vrednosti, prazna tabela, prazna Begründung)",
    ],
    "table_schema": "Classe | Roh-Ertrag pr. n.Ö. Joch (fl|kr) | Summarischer Cultur-Aufwand (fl|kr) | Taxa percent | Ansschlag desselben im Gelde (fl|kr) | Rein-Ertrag (fl|kr)",
    "arithmetic_model": {
        "id": "I7",
        "rule": "Anschlag im Gelde = Roh-Ertrag × Taxa% ; Rein-Ertrag = Roh-Ertrag − Anschlag",
        "status": "POTRJEN EXACT na p57 (24×70%=16|48; 24−16.8=7|12) in p59 (1×25%=—|15; 45 kr; vsota 51=45+6); blizu na p52 (16|50½×55%=9|15¾ vs branje 9|12¾[?])",
        "meaning": "'Taxa percent' = odstotek Roh-Ertraga, dodeljen kot nadomestilo za Culturaufwand (Instrukcija); Rein = Roh − nadomestilo",
    },
    "sections": [
        {"sec": "§1", "name": "Ackerland", "page_i": 50, "page_ii": 52, "begr_page": 51,
         "classes": [
            {"classe": "I.te", "page": 50,
             "roh": {"fl": "23", "kr": "40 1/10[?]", "status": "REVIEW"},
             "aufwand": {"fl": "10", "kr": "18 3/4[?]", "status": "REVIEW"},
             "taxa": {"wert": "45", "note": "proza '43 39/100' + rdeča korekcija [45/100]? — REVIEW", "status": "REVIEW"},
             "anschlag": {"fl": "10", "kr": "40 2/3[?]", "status": "REVIEW"},
             "rein": {"fl": "13", "kr": "3[5?]", "status": "REVIEW"},
             "prosa_roh": "23 fl 44 kr [REVIEW — model pričakuje 23|44; zoom p50-roh-zoom odloča]",
             "prosa_percent": "Dies sind 43 39/100 [rot 45/100?] Percente der Reinnutzung … zusammengenommen 115 Percente … mit 10 fl 40 3/4[?] kr abzüglich [REVIEW]",
             "begr": "[REVIEW proza] Begründung se nadaljuje na p51 (Ackerklassen skupna obravnava, Wiesenklass povezava)",
             },
            {"classe": "II.te", "page": 52,
             "roh": {"fl": "16", "kr": "50 1/2", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "9", "kr": "31", "status": "TRANSCRIBED-odtis"},
             "taxa": {"wert": "55", "note": "rdeča priznamka nad 55 [REVIEW natančnost]", "status": "REVIEW"},
             "anschlag": {"fl": "9", "kr": "15 3/4[12 3/4?]", "status": "REVIEW — model I7: 16.8417×0.55=9|15.8"},
             "rein": {"fl": "7", "kr": "35", "status": "TRANSCRIBED-odtis (model: 7|34.7 ✓)"},
             "prosa_roh": "16 fl 50 1/2 kr",
             "prosa_percent": "Dies sind 56 83/100 [rot 55?/100] … 55 Percente … 9 fl 15 3/4 kr [REVIEW]",
             },
         ]},
        {"sec": "§2", "name": "Wiesenland", "page_i": 53, "page_ii": 54,
         "classes": [
            {"classe": "I.te", "page": 53,
             "roh": {"fl": "9", "kr": "24", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "1", "kr": "37 1/2", "status": "TRANSCRIBED-odtis"},
             "taxa": {"wert": "20", "note": "rdeči pripis [REVIEW]", "status": "REVIEW"},
             "anschlag": {"fl": "1", "kr": "52 4/5[32 3/4?]", "status": "REVIEW — model I7: 9.4×0.20=1|52.8"},
             "rein": {"fl": "7", "kr": "30[31 1/5?]", "status": "REVIEW — model: 7|31.2"},
             "prosa_roh": "9 fl 24 kr",
             "prosa_percent": "Dies sind 20 34/100 [rot] … 20 Percente …",
             "cross_check": "p65 Zus A Wiesen I Rein = 7|30 (1. prehod val 77) — SROGLASJE z 7|30"},
            {"classe": "II.te", "page": 54,
             "roh": {"fl": "14[11?]", "kr": "—", "status": "REVIEW — Kurrent 1+4/1+1"},
             "aufwand": {"fl": "—", "kr": "55[?]", "status": "REVIEW"},
             "taxa": {"wert": "25", "status": "TRANSCRIBED-odtis"},
             "anschlag": {"fl": "1[11?]", "kr": "—", "status": "REVIEW — model I7 NE zapira (14×0.25=3.5≠1; 11×0.25=2.75≠1) — edina § vrstica brez I7 pokritosti; morda poseben režim (Drusch/Nutzen)",
                          "note": "F-PZ-20 dokumentira odprto kolizijo — nič se ne vsiljuje"},
             "rein": {"fl": "3", "kr": "—", "status": "TRANSCRIBED-odtis; p65 Zus A Wiesen II Rein = 3|— SROGLASJE"},
             "prosa_roh": "[REVIEW]",
             },
         ]},
        {"sec": "§3", "name": "Kleine Gärten", "page_einz": 55,
         "classes": [
            {"classe": "Einzige", "page": 55,
             "roh": {"fl": "23", "kr": "44", "status": "TRANSCRIBED-odtis (proza '23 fl 44 kr' + tabela)"},
             "aufwand": {"fl": "10", "kr": "18 3/4", "status": "TRANSCRIBED-odtis"},
             "taxa": {"wert": "45", "status": "TRANSCRIBED-odtis"},
             "anschlag": {"fl": "10", "kr": "40 2/3[4/5?]", "status": "REVIEW — model I7: 23.7333×0.45=10|40.8"},
             "rein": {"fl": "13", "kr": "3[5?]", "status": "REVIEW — model: 13|3.2"},
             }],
        },
        {"sec": "§4", "name": "Größere Gärten", "page_einz": 56,
         "classes": [
            {"classe": "Einzige", "page": 56,
             "roh": {"fl": "23", "kr": "44", "status": "TRANSCRIBED-odtis (identno §3)"},
             "aufwand": {"fl": "10", "kr": "18 3/4", "status": "TRANSCRIBED-odtis"},
             "taxa": {"wert": "45", "status": "TRANSCRIBED-odtis"},
             "anschlag": {"fl": "10", "kr": "40 2/3[4/5?]", "status": "REVIEW — model I7: 10|40.8"},
             "rein": {"fl": "13", "kr": "3[5?]", "status": "REVIEW — model: 13|3.2"},
             }],
        },
        {"sec": "§5", "name": "Weingärten", "page_einz": 57,
         "classes": [
            {"classe": "Einzige", "page": 57,
             "roh": {"fl": "24", "kr": "—", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "16", "kr": "54", "status": "TRANSCRIBED-odtis"},
             "taxa": {"wert": "70", "status": "TRANSCRIBED-odtis (proza '70 46/100' — REVIEW decimalka)"},
             "anschlag": {"fl": "16", "kr": "48", "status": "TRANSCRIBED-odtis — model I7 EXACT (24×0.70=16.8=16|48)"},
             "rein": {"fl": "7", "kr": "10[12?]", "status": "REVIEW — model: 7|12 (EXACT); pisana oblika 7|10[?]",
                      "note": "če piše 7|10: pisarjevska zaokrožitev 7.2 fl; nič se ne vsiljuje"},
             }],
        },
        {"sec": "§6", "name": "Weiden", "page_einz": 58,
         "classes": [
            {"classe": "Einzige", "page": 58,
             "roh": {"fl": "1", "kr": "—", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "—", "kr": "132[?]", "status": "REVIEW — nenavadna oblika (VLM zoom odloča: 13 2/3? 1 32/100?)"},
             "taxa": {"wert": "25", "status": "TRANSCRIBED-odtis (proza '22 21/100' + 25 — REVIEW)"},
             "anschlag": {"fl": "—", "kr": "15", "status": "TRANSCRIBED-odtis — model I7 EXACT (1×0.25=0.25 fl=15 kr)"},
             "rein": {"fl": "—", "kr": "45", "status": "TRANSCRIBED-odtis — model EXACT"},
             }],
        },
        {"sec": "§7", "name": "Weiden mit Holznutzung", "page_einz": 59,
         "classes": [
            {"classe": "Weide", "page": 59,
             "roh": {"fl": "1", "kr": "—", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "—", "kr": "132[?]", "status": "REVIEW (kot §6)"},
             "taxa": {"wert": "25", "status": "TRANSCRIBED-odtis"},
             "anschlag": {"fl": "—", "kr": "15", "status": "TRANSCRIBED-odtis — model EXACT"},
             "rein": {"fl": "—", "kr": "45", "status": "TRANSCRIBED-odtis — model EXACT"}},
            {"classe": "Holznutzung", "page": 59,
             "roh": {"fl": "—", "kr": "6", "status": "TRANSCRIBED-odtis"},
             "rein": {"fl": "—", "kr": "6", "status": "TRANSCRIBED-odtis"},
             "note": "vsi vmesni stolpci prazni — lesna paša brez odmika (skladno F-PZ-08 silvopastoralna raba)"},
            {"classe": "Summa", "page": 59,
             "roh": {"fl": "1", "kr": "6"}, "rein": {"fl": "—", "kr": "51"},
             "note": "45 + 6 = 51 EXACT — aritmetika vsote zaprta (odtis: prej zmotno '57')"},
         ]},
        {"sec": "§8", "name": "Bau-Area", "page_einz": 60,
         "classes": [
            {"classe": "Classe (brez oznake)", "page": 60,
             "roh": {"fl": "16", "kr": "30 1/2", "status": "TRANSCRIBED-odtis"},
             "aufwand": {"fl": "9", "kr": "31[?]", "status": "REVIEW"},
             "taxa": {"wert": "55[?]", "status": "REVIEW"},
             "anschlag": {"fl": "9", "kr": "15[?]", "status": "REVIEW — model: 16.5083×0.55=9|15.8"},
             "rein": {"fl": "7", "kr": "35", "status": "TRANSCRIBED-odtis — model: 7|34.7 ✓"},
             "note": "identno §1 II.te (16|30½→7|35) — Bau-Area cenjena kot Acker II. klase; rdeče 'revaluiert' + podpis"}],
         },
    ],
    "p61_empty_template": {
        "page": 61,
        "content": "tiskana predloga: proza (fl/kr prazna) + prazna Darstellung tabela + prazna Begründung",
        "status": "TRANSCRIBED-direktni odtis (brez VLM — nič za prebrati)",
    },
    "red_notes": "vsaka § stran: levo rdeče 'Bei der [?] gemischte[n] Ackerwirtschaft[?]-Vorstellung[?]' [REVIEW — identna formulacija na p50–60]",
    "cross_check_p65": "p65 Zus A Rein-Ertrag stolpec (val 109 pasovi) križno preverja § vrednosti — glej zusammenstellung_ab_p62_65",
    "reading_honesty": "glas #1 (direkten odtis) vsi številki okviri; § vrstice s 'TRANSCRIBED-odtis' = stabilne na 2x–4x; '[?]' = nestabilne števkе; val 109 zaključen BREZ VLM glasov (429 kvota — dnevni značaj) — vse vrednosti ostajajo glas-1 raven (REVIEW/odtis), VLM glasovi read-v109.mts (45 izrezkov, resumable) jih dvignejo ob kvoti; model I7 NE nastopa kot glas (samo kontrola); per-parcelne trditve NIČ (§4)",
}

ZUS_AB_P62_65 = {
    "title": "Zusammenstellung A + B (p62–65) — 2. prehod (val 109)",
    "source_pages": [62, 63, 64, 65],
    "p62_naslovnica": {"status": "TRANSCRIBED-direktni odtis",
                       "text": "B. Zusammenstellung über die jährliche Rente und den Capitalwerth der Grundstücke in der Gemeinde Grüble nach den aufgefundenen Pachtverträgen — Land Krain, Kreis Neustadtl, XI ter Schätzungsbezirk (tiskano)"},
    "p64_naslovnica": {"status": "TRANSCRIBED-direktni odtis",
                       "text": "A. Zusammenstellung des gesammten Cultur-Aufwandes beim Acker, Wies- und Weinlande in der obigen Gemeinde Grüble — Steuerbezirk Krupp, Gemeinde Grüble, XI ter Schätzungsbezirk (tiskano)"},
    "p63_zusammenstellung_b": {
        "schema": "No | Namen (Steuerbezirk Krupp / Gemeinde Grüble) | Des Grundstückes (Catastral-Parzellen Nro | Gesetzliche Eigenschaft dominical/Haus/rustical/Überland | Culturs Gattung | Flächen Inhalt Joch|Klafter) | Classe | Pachtungen (Pachtschilling fl|kr | Verbindlichkeit fl|kr | Summe fl|kr | Daher auf Ein N.Ö. Joch fl|kr) | Anmerkungen",
        "pasovi": "4 pasovi (glava / vrstice 1–5 + Summe / 6–12 + Summe / 13–14) — read-v109 p63-band*",
        "glas_val77": "vlm/p63-pass1.raw (1. prehod, celostranski) — strukturirano v raw-web-val109-2026-09/p63-v77-structured.json (16 zapisov; PROVISIONAL)",
        "rows": "[ODLOŽENO OB KVOTI — band re-read + VLM glasovi odločajo; val 77 glas = kolizija vir, sam po sebi NE zadosten za vrstice (delno nezanesljiv 1. prehod)]",
        "status": "ODLOŽENO-VLM (429 dnevna kvota izčrpna; p63-band* izrezki resumable — vrstice ob kvoti, vzorec p142-t-kultur2)",
    },
    "p65_zusammenstellung_a": {
        "schema": "No | Kultur-Gattung | Veranlagungs Classe | Brutto-Geldertrag per Joch im Ganzen fl|kr | Samen (8 podstolpcev, Metzen) | Drescherlohn | Zug/Arbeit (Ochsen 2/4, eigene/erheürte, Tage) | Hand | Bauschaffungen | Dresch-lieferamt | Nach der Instruction (Procente | fl | kr) | Es zeigt sich Rein-Ertrag fl|kr | Anmerkung",
        "pasovi": "4 pasovi + desni blok zoom (read-v109 p65-band* + p65-desni-zoom)",
        "rows_direct": [
            {"no": 1, "kultur": "Ackerland", "brutto_i": "22|463[?] — vs §1 23|44 (F-PZ-20 kolizija)", "rein_i": "13|30[?] vs §1 13|3/5", "status": "REVIEW"},
            {"no": 2, "kultur": "Wiesen", "rein_ii": "3|—", "status": "soglasje s §2 II.te"},
            {"no": 8, "kultur": "Bau-Area", "brutto": "16|30 1/2", "rein": "7|35", "status": "soglasje s §8"},
        ],
        "status": "DELNO REŠENO (val 109: struktura + 3 direktne vrstice + I7 križni pregled; polne vrstice čakajo VLM glasove — 429 dnevna kvota; F-PZ-19 PARTIAL)",
    },
    "datum_podpis_p65": "Neustadtl am 6ten July 1831[?] + podpis [REVIEW] — mlajši od § strani (1830/31)",
}

# --- strukturni zemljevid 71 strani (PREHOD 1, val 75; 43–47 korigirano val 81) ---
STRUCTURE = [
    (1, "Naslovna: CATASTRAL-SCHÄTZUNGS-ELABORAT der Gemeinde Grüble, Land Krain, Kreis Neustadtl, Steuerbezirk Krupp, Schätzung District N°83"),
    (2, "§2 Gränzen (meje) + §3 Bevölkerung (prebivalstvo 1830: 441/222/219, 70 hiš, 102 družin)"),
    (3, "§1 Einleitung/Topographie + skupna površina (črno 1235 J 1516 K → rdeče 1220 J 1493 K)"),
    (4, "§4 Viehstand (živina 1830: 124/20/30/150/30) + opombe o reji"),
    (5, "§5/§6 Feld-Culturen; začetek §7 Wege"),
    (6, "§8 Cultivirte/unbenützte/unbenützbare Grundstücke — tabela Einzeln/Zusammen (val 77: odločilna za korekcije)"),
    (7, "§9 Cultur-Veränderungen"),
    (8, "§10 Anteil des Bodens (razredobodenje)"),
    (9, "§11 Bruttoertrag + §12 Reinertrag"),
    (10, "§13 Heuer/Jagd? + §14 — kratka poročila"),
    (11, "SCHÄTZUNG des Landesortes — Gefälle tabela po kulturah"),
    (12, "Ackerland Erste Classe — parcelne številke"),
    (13, "Natural-Ertrag tabele (produkti, 1. klasa)"),
    (14, "Ackerland Zweite Classe — 132 parcel"),
    (15, "Natural-Ertrag tabele (2. klasa)"),
    (16, "Natural-Verhältnis (polja/travniki razmerja)"),
    (17, "Wiesen Erste Classe"),
    (18, "Wiesen Zweite Classe + Heu tabela"),
    (19, "§5 Kleine Gärten"),
    (20, "§6 Größere gemüse Gärten"),
    (21, "§7 Weingärten — Einzige Classe (7 J 42 K; Mustergrund N°24xx)"),
    (22, "Naturbenutzung — opomba"),
    (23, "§8/9 Hutweiden"),
    (24, "§10 Weide und Waldnutzen"),
    (25, "Kulturdienstreibung-Elaborat — naslovna + formular"),
    (26, "Kulturdienstreibung — nadaljevanje (Flächenraum opis)"),
    (27, "Flächenraum der Culturarten tabela + podpisi (val 77: p27 vsebuje ozko merilno prilogo 'niederösterreichisches Grundmaaß' — vsebina REVIEW)"),
    (28, "§12 Beweidbare Grundoberflächen + podpis (april 1830[?])"),
    (29, "Zusammenstellung — naslovnica (Sand/Stein?)"),
    (30, "Zusammenstellung — velika ležeča tabela: NATURALNI PRIDELEK per classe (Metze/Centner/Eimer; val 77 1. prehod: Acker I Weizen 12/Korn 12/Gerste 26/Hafer 15/Mais 10; Acker II 9/9/18/10/7; Wiesen I Heu 14+6; Wiesen II 8; Weingärten 12 Eimer — 2. prehod čaka)"),
    (31, "PROTOCOL — komisijska seja, člani žirije (imena)"),
    (32, "Protocol — nadaljevanje: opis mejnih točk (Andern[?], Elend G'schaid[?], Lutzgrübl[?] …) + podpisi (9. marec 1830[?]) — F-PZ-05 material"),
    (33, "Adjunkt/pismo — nadaljevanje"),
    (34, "Protocol (2. seja) — ista žirija"),
    (35, "Rektifikacija 1830 — I. Aacker: Kultur-Beschreibung opisno (prvi klas, Kameniza; Muster № 30 = 1 J 1082 val 80) — NE per-parcelne korekcije (val 79/80)"),
    (36, "Rektifikacija — Acker nadaljevanje: 2./3. klas + rdeči zapis 'Dritte Classe'; Muster № 594 = 1 J 591, № 1004 = 1 J 1010 (val 80 popravek: 1099/700 ovrženo)"),
    (37, "Rektifikacija — II. Wiesen: opisno + Muster № 738 = – J 895 (pomlaj!), № 2451 = – J 1515 (val 80 nativno; pečat p41, NE tukaj)"),
    (38, "Rektifikacija — III. Kleine Gärten / IV. Obere Gärten / VI. Holzgärten: opisno + Muster № 2491 = – J 260 (val 80: pomlaj)"),
    (39, "Rektifikacija — weiden nadaljevanje: meje + Muster № 1288 (nad prečrtano 2875) = 1 J 882|883 REVIEW (val 80: poškodovana celica, 589/549 alternativa)"),
    (40, "Rektifikacija zaključek — podpisi žirije (Kappas + 9) + k.k. Schätzungskommission + pečat (9. / 29. april 1830 — mesec REVIEW; val 75: 5./28. ovrženo) + 'vierte Nachtag' (val 79)"),
    (41, "Nachsetzung (№ 1980 / № 88; 12. avg. 1832[?]) + Vergleich (4. jun. 1832[?]) + podpisi — 1832, brez površin (val 79)"),
    (42, "Einvernehmungs-Protocoll 6. dec. 1832 — Natural-Brutto-Ertrag (poprava: NE 'Einwands-Protokoll'; val 79)"),
    (43, "Ackerland mit 2 Classen — 1te Classe: Wirthschafts Kurse (9-jähriger Wechsel; skupine 1–3 × kurse 1–9) + Düngung auf 1 Joch (3 Fuder; 90/120) + Natural Ertrag pro Joch (1–9: 26/12/50/12/12/[10]/15/80/12/[10]/15 M|Ctl) — val 81 prepis (korekcija val 75: NE per-parcelna tabela)"),
    (44, "IIte Classe: Wirthschafts Kurse = I. Classe ('Gleiche Kurs als in Iten Acker Classen') + Düngung = I. + Natural Ertrag pro Joch z RAZPONI (18–20/9–10/30–40/9–10/9–10/[7–8]/10–12/65–70/9–10/[7–8]/10–12) — val 81 prepis"),
    (45, "IIIte Classe: Wirthschafts Kurse ('Gleich Kurs den I= et II= Ackerclassen') + Düngung = I. et II. + Natural Ertrag pro Joch (15/8/30/8/8/[6]/9/60/8/[6]/9) — CEL LIST X PREČRTAN + Anmerkung — val 81 prepis (korekcija val 75: NE 'IIa + parcele 96/311')"),
    (46, "Wiesen mit 2 Classen (I: zusammen 14 [Fth|fl REVIEW]; II: im Ganzen 8 3/8) + Kleine Gärten Einzige Classe (+ prečrtano 'große Gemüse=Gärten') + Weingärten Einzige Classe (zu M[?]… 9 [?] / Wein 12) + Hutweiden Einzige Classe (2 3/8) — val 81 prepis"),
    (47, "Huthweiden mit [supra: ganz=|Holz=] Nutznießung und Niederwald — Einzige Classe (CEL NASLOV X PREČRTAN) + proza (Holz/Ödland, Trinkwasser) + Actum ut supra (16. julij 1829[?]) + podpisi: Kappas + 6 prič (imena REVIEW) — val 81 prepis"),
    (48, "Einvernehmungs-Protocoll 5. aprila 1830 (rožnat papir) — proza: uvedba + Gemeinde Ausgeschoss + Vortrag (vsebina = val 109 prepis, REVIEW proza)"),
    (49, "Protokoll — nadaljevanje (proza o obveznostih, vsebina = val 109 prepis) + podpisi (imena = val 109 prepis) — val 109 korekcija (NE samostojen 'Communications-Protokoll')"),
    (50, "VERANSCHLAGUNG des Cultur-Aufwandes und Darstellung des Rein-Ertrages — §1 Ackerland, I.te Classe (proza + tabela 1 vrstica + Begründung začetek) — val 109 prepis + korekcija (NE 'VERANTWORTLICHUNG')"),
    (51, "§1 Ackerland — nadaljevanje Begründung (proza na zgornji tretjini; preostanek prazna predloga + bleed-through s p50) — val 109 korekcija (val 75 'Campus nach Rektifizierung ležeča tabela' OVRŽENO)"),
    (52, "§1 Ackerland — II.te Classe (tabela II.to + Begründung + rdeči pripis) — val 109 korekcija (NE 'Dritte Classe')"),
    (53, "§2 Wiesenland — I.te Classe (tabela I.to: 9|24 → 7|30) — val 109 korekcija (NE 'Dritte/Vierte')"),
    (54, "§2 Wiesenland — II.te Classe (tabela II.to) — val 109 korekcija (NE 'Vierte')"),
    (55, "§3 Kleine Gärten — einzige Classe — val 109 korekcija (NE '§5 Erste Classe')"),
    (56, "§4 Größere Gärten — einzige Classe — val 109 korekcija (NE '§6')"),
    (57, "§5 Weingärten — einzige Classe — val 109 korekcija (NE '§7'; NE '7 parcel 1,2,4,5,6,8,11' — to je p63 vsebina)"),
    (58, "§6 Weiden — einzige Classe — val 109 korekcija (NE '§8 Hutweiden')"),
    (59, "§7 Weiden mit Holznutzung — einzige Classe (2 vrstici: Weide + Holznutzung + vsota) — val 109 korekcija (NE '§9 Wiesen/Hutweiden')"),
    (60, "§8 Bau-Area — Classe + podpis (Neustadtl am 18. Jenner 1831[?], Josef Scheram k.k. Schätz-Bezirks-Kommissär + rdeči revaluiert pripis) — val 109 korekcija"),
    (61, "prazna tiskana predloga (proza brez vrednosti + prazna tabela Darstellung + prazna Begründung) — val 109 korekcija (NE 'nadaljevanje'); BREZ VLM (direktni odtis)"),
    (62, "Zusammenstellung B — naslovnica: jährliche Rente und Capitalwerth nach Pachtverträgen"),
    (63, "Zusammenstellung B — ležeča tabela (Renta/Capitalwerth; val 77 1. prehod: parcelni Pachtverträge — N°115/292/293/786/299 … Acker I, N°1031/1037/1040/779/1205/702/794 … Acker II, N°417 Wiesen, N°1020 Wiesen mit Weide; vsote per classe zapisane)"),
    (64, "Zusammenstellung A — naslovnica: gesammter Cultur-Aufwand (Acker Wies- und Weinland)"),
    (65, "Zusammenstellung A — ležeča tabela (Samen-Cultur-Ernte- und Drescher- überhaupt sämmtlicher Bau-Aufschaffungen; val 109 2. prehod: pasovi + desni blok — F-PZ-19)"),
    (66, "SPECIFISCHER AUSWEIS — naslovnica: Endresultate nach der Catastral Ertragserhebung"),
    (67, "Specifischer Ausweis — ležeča glavna tabela (val 77: odločilni re-read celic; Summa 1152 J 495 K)"),
    (68, "Protokoll (šedenj?) — 16. april 1829[?]"),
    (69, "Nachlauf — nadaljevanje + podpis"),
    (70, "NACHTRAG zu dem Katastral-Schätzungselaborate — 5. März 1829[?] (Kulturveränderungen)"),
    (71, "Nachtrag — nadaljevanje + 27. März 1829[?]"),
]

# --- Fail-fast invariants (I1–I6) --------------------------------------------

# I1: prebivalstvo
if BEVOELKERUNG_1830["maenner"] + BEVOELKERUNG_1830["weiber"] != BEVOELKERUNG_1830["zusammen_seelen"]:
    fail(f"I1 prebivalstvo: {BEVOELKERUNG_1830['maenner']} + {BEVOELKERUNG_1830['weiber']} != {BEVOELKERUNG_1830['zusammen_seelen']}")

# I2: površina PZ(rdeči) vs PV < 1 %
pz_red = qklf(**AREA_TOTAL["red_corrected"])
pv = qklf(**PV_GRAND)
delta_qklf = pv - pz_red
delta_pct = abs(delta_qklf) / pv * 100
if delta_pct >= 1.0:
    fail(f"I2 površina: |PZ rdeči {pz_red} − PV {pv}| = {delta_pct:.3f} % ≥ 1 % → napačno branje števk")

# I3: Endresultat struktura
if len(ENDRESULTAT_ROWS) != 10:
    fail(f"I3 Endresultat: pričakovane 10 vrstic, prebranih {len(ENDRESULTAT_ROWS)}")
valid_classes = {"I", "II", "C", "–"}
for r in ENDRESULTAT_ROWS:
    if r["joch"] < 0 or r["klafter"] < 0:
        fail(f"I3 Endresultat: negativna površina v vrstici {r['no']} {r['kultur']}")
    if r["classe"] not in valid_classes:
        fail(f"I3 Endresultat: neveljaven classe {r['classe']!r} v vrstici {r['no']}")

# I4 (NOVO val 77): per-kultura §8 Einzeln vrata — vsaka enakost EXACT, fail-fast
r67 = {(r["no"], r["classe"]): (r["joch"], r["klafter"]) for r in ENDRESULTAT_ROWS}
a1, a2 = r67[(1, "I")], r67[(1, "II")]
acker_j, acker_k = a1[0] + a2[0], a1[1] + a2[1]
P8 = {row["kultur"]: row for row in PARAGRAF8_P6["einzeln_rows"]}
GATES_I4 = [
    ("Aecher I+II", (acker_j, acker_k), (P8["Aecher"]["joch"], P8["Aecher"]["klafter"])),
    ("Kleine Gärten", r67[(3, "C")], (P8["Kleine Gärten"]["joch"], P8["Kleine Gärten"]["klafter"])),
    ("Größere Gärten", r67[(4, "C")], (P8["Größere Gärten (dtto)"]["joch"], P8["Größere Gärten (dtto)"]["klafter"])),
    ("Weingärten", r67[(5, "C")], (P8["Weingärten"]["joch"], P8["Weingärten"]["klafter"])),
    ("Hutweiden", r67[(6, "C")], (P8["Huthweiden"]["joch"], P8["Huthweiden"]["klafter"])),
    ("Bauarea", r67[(8, "–")], (PARAGRAF8_P6["unbenutzt_rows"][0]["joch"], PARAGRAF8_P6["unbenutzt_rows"][0]["klafter"])),
]
for name, got, want in GATES_I4:
    if tuple(got) != tuple(want):
        fail(f"I4 §8 vrata {name}: p67 {got} != §8 Einzeln {want}")

# I5 (NOVO val 77): Wiesen vrata — I+II = 45 J 812 K (§8 Einzeln), fail-fast
w1, w2 = r67[(2, "I")], r67[(2, "II")]
wiesen_j, wiesen_k = w1[0] + w2[0], w1[1] + w2[1]
if wiesen_j * KLFT_PER_JOCH + wiesen_k != qklf(P8["Wiesen"]["joch"], P8["Wiesen"]["klafter"]):
    fail(f"I5 Wiesen vrata: p67 I+II = {wiesen_j} J {wiesen_k} K != §8 45 J 812 K")
# izpeljava Wiesen I joch = 5 mora biti edina rešitev: 45 = 5 + 39 + 1 (2412 K)
if w1[0] != 5:
    fail(f"I5 Wiesen I izpeljava: joch {w1[0]} != 5 (45 − 39 − 1 J od Klf prenosa)")

# I6 (NOVO val 77): Total vrata — vrstice 1–8 + unbenützbar = Total Gemeinde 1220 J 1493 K
rows_j = sum(r["joch"] for r in ENDRESULTAT_ROWS)
rows_k = sum(r["klafter"] for r in ENDRESULTAT_ROWS)
rows_total_qklf = qklf(rows_j, rows_k)
TOTAL = PARAGRAF8_P6["total_gemeinde"]
total_qklf = qklf(**{k: TOTAL[k] for k in ("joch", "klafter")})
unbenutzt_implied_qklf = total_qklf - rows_total_qklf
unbenutzt_implied = {"joch": unbenutzt_implied_qklf // KLFT_PER_JOCH,
                     "klafter": unbenutzt_implied_qklf % KLFT_PER_JOCH}
if rows_total_qklf > total_qklf:
    fail(f"I6 Total vrata: vrstice 1–8 ({rows_total_qklf}) > Total ({total_qklf}) — nemogoče")
if unbenutzt_implied != {"joch": 71, "klafter": 998}:
    fail(f"I6 Total vrata: izpeljan unbenützbar {unbenutzt_implied} != 71 J 998 K (pričakovano iz F-PZ-10)")

# I7 (NOVO val 109): Veranschlagung §1–§8 — strukturna vrata + aritmetični model
# (Anschlag im Gelde = Roh-Ertrag × Taxa%; Rein-Ertrag = Roh − Anschlag).
# Fail-fast le na STRUKTURI (8 sekcij, 12 vrstic p50–61); aritmetika = kontrola
# po vrstici (rezultat gre v i7_checks, vrstice brez pokritosti ostajajo REVIEW — §4).
def _flkr(s):
    """'23' | '40 1/2' | '—' | '.' | '3[5?]' -> (float, nestabilno?) ali None (manjka).
    '—' / '.' / '' = prazna celica = 0.0; '[?]' = nestabilna števka (ne blokira računa, označi status)."""
    import re as _re
    s = str(s)
    unstable = "[?]" in s
    s = _re.sub(r"\[[^\]]*\]", "", s).strip()
    if s in ("", "—", "."):
        return (0.0, unstable) if s else None
    total = 0.0
    for part in s.split():
        if "/" in part:
            a, b = part.split("/")
            total += float(a) / float(b)
        else:
            total += float(part)
    return (total, unstable)

if len(VERANTWORTLICHUNG_P50_61["sections"]) != 8:
    fail(f"I7 Veranschlagung: pričakovanih 8 sekcij §1–§8, prebranih {len(VERANTWORTLICHUNG_P50_61['sections'])}")
_i7_rows = [c_ for s_ in VERANTWORTLICHUNG_P50_61["sections"] for c_ in s_["classes"] if c_["classe"] != "Summa"]
if len(_i7_rows) != 11:
    fail(f"I7 Veranschlagung: pričakovanih 11 vrstic (12 p50–61 − p61 prazna; p59 ima 2), prebranih {len(_i7_rows)}")

i7_checks = []
for s_ in VERANTWORTLICHUNG_P50_61["sections"]:
    for c_ in s_["classes"]:
        if c_["classe"] == "Summa":
            continue
        if "taxa" not in c_:
            i7_checks.append({"sec": s_["sec"], "classe": c_["classe"], "status": "BREZ-MODELA",
                              "note": "posebna vrstica brez Taxa/odmika (Holznutzung: Roh 6 = Rein 6) — direktni odtis"})
            continue
        roh = _flkr(c_['roh']['fl']), _flkr(c_['roh']['kr'])
        taxa = _flkr(c_["taxa"]["wert"])
        anschlag = _flkr(c_["anschlag"]["fl"]), _flkr(c_["anschlag"]["kr"])
        rein = _flkr(c_["rein"]["fl"]), _flkr(c_["rein"]["kr"])
        if None in roh or taxa is None:
            i7_checks.append({"sec": s_["sec"], "classe": c_["classe"], "status": "NEPOTRJENO-branje", "note": "Roh/Taxa nestabilna števka ([?]) — model ne naslavlja"})
            continue
        roh_unstable = bool(roh[0][1] if roh[0] else False) or bool(roh[1][1] if roh[1] else False) or bool(taxa[1]) \
            or bool(anschlag[0][1] if anschlag[0] else False) or bool(anschlag[1][1] if anschlag[1] else False) \
            or bool(rein[0][1] if rein[0] else False) or bool(rein[1][1] if rein[1] else False)
        roh_fl = roh[0][0] + roh[1][0] / 60.0
        taxa_val = taxa[0]
        ansl_exp = roh_fl * taxa_val / 100.0
        rein_exp = roh_fl - ansl_exp
        row = {"sec": s_["sec"], "classe": c_["classe"], "roh_fl": round(roh_fl, 4),
               "taxa_pct": taxa_val, "anschlag_exp_fl": round(ansl_exp, 4),
               "rein_exp_fl": round(rein_exp, 4), "unstable_digits": roh_unstable}
        ansl_fl = (anschlag[0][0] if anschlag[0] else 0) + (anschlag[1][0] if anschlag[1] else 0) / 60.0 if (anschlag[0] or anschlag[1]) else None
        rein_fl = (rein[0][0] if rein[0] else 0) + (rein[1][0] if rein[1] else 0) / 60.0 if (rein[0] or rein[1]) else None
        if ansl_fl is not None:
            row["anschlag_written_fl"] = round(ansl_fl, 4)
            row["anschlag_closes"] = abs(ansl_fl - ansl_exp) <= 0.05
        if rein_fl is not None:
            row["rein_written_fl"] = round(rein_fl, 4)
            row["rein_closes"] = abs(rein_fl - rein_exp) <= 0.05
        if roh_unstable:
            row["status"] = "REVIEW (branje [?])" if (row.get("anschlag_closes") and row.get("rein_closes")) else "REVIEW"
        else:
            row["status"] = "I7-EXACT" if (row.get("anschlag_closes") and row.get("rein_closes")) else "REVIEW (model ne zapira)"
        i7_checks.append(row)
VERANTWORTLICHUNG_P50_61["i7_checks"] = i7_checks

# Summa kontrola (NI invarianta — F-PZ-04 pošteno OPEN)
summa_qklf = qklf(ENDRESULTAT_SUMMA["joch"], ENDRESULTAT_SUMMA["klafter"])
summa_delta_qklf = rows_total_qklf - summa_qklf  # pričakovano +4.800 (3 Joch)
summa_delta_joch = summa_delta_qklf // KLFT_PER_JOCH
summa_delta_klafter = summa_delta_qklf % KLFT_PER_JOCH

# Deleži rabe 1830 (izpeljani iz vrat-solidnih vrstic I4–I6; F-PZ-04 ostaja OPEN
# za zapisano Summo — deleži v UI ostanejo absent, glej build-timeline)
share_names = [
    ("Aecher I+II", acker_j, acker_k),
    ("Wiesen", wiesen_j, wiesen_k),
    ("Kleine Gärten", *r67[(3, "C")]),
    ("Größere Gärten", *r67[(4, "C")]),
    ("Weingärten", *r67[(5, "C")]),
    ("Hutweiden", *r67[(6, "C")]),
    ("Weiden mit Holznutzen", *r67[(7, "C")]),
    ("Bauarea (unbenützt)", *r67[(8, "–")]),
    ("Unbenützbar (Felsen/Leiten/Wege, izpeljano I6)", unbenutzt_implied["joch"], unbenutzt_implied["klafter"]),
]
shares = []
for name, j, k in share_names:
    q = qklf(j, k)
    shares.append({
        "kultur": name,
        "joch": j, "klafter": k,
        "qklft": q,
        "pct_of_total": round(q / total_qklf * 100, 2),
        "basis": "vrata I4–I6 (§8 + p67 + Total)",
    })
shares_sum = sum(s["qklft"] for s in shares)
if shares_sum != total_qklf:
    fail(f"deleži: vsota {shares_sum} != Total {total_qklf}")

# IZRAČUN izpeljanih
area_red_m2 = round(pz_red * M2_PER_QKLFT)
area_pv_m2 = round(pv * M2_PER_QKLFT)

data = {
    "val": 109,
    "pass": "PZ PASS 8 (val 109: 2. prehod p48–65 — protokoli + Verantwortlichung §1–§8 + Zus A/B; strukturna korekcija § števk F-PZ-18 — monotono §1–§8; aritmetični model I7 (Anschlag = Roh × Taxa %, Rein = Roh − Anschlag) potrjen EXACT na p57/p59; p65 Zus A band re-read — F-PZ-19 PARTIAL; p61 = prazna predloga; BREZ VLM glasov — 429 dnevna kvota, 45 izrezkov resumable ob kvoti; I1–I6 nespremenjeni; val 81 PASS 7: band-transkripcija p43–47 — F-PZ-12 RESOLVED; val 80 PASS 6: VAČ topološka izčrpnost F-PZ-17 + nativna re-digitation 6/7 Muster celic)",
    "issue": 42,
    "deterministic": True,
    "title": "PZ N83 — Katastral-Schätzungs-Elaborat (Konskripcija) 1828/30 [373419]",
    "method": {
        "source_download": "VAČ vac.sjas.gov.si tifyPdfDownload uodid=373419 docid=41784 (13.154.552 B, 71 strani; TLS veriga nepopolna → python urllib unverified ctx; curl blokiran)",
        "passes": [
            "PREHOD 1 (val 75): struktura — 8 kontaktnih plošč (sheets/) × 9 strani",
            "PREHOD 2 (val 75): ključna branja digit-by-digit 2,6×–5× (crops/ + z-*.jpeg dokazni izrezki)",
            "PREHOD 3 (val 77): odločilni re-read p67 + p6 — izrezki celic (crops/p67-area/, crops/p6-tab-*, crops/p6-zus-*), 2 neodvisna VLM prehoda na dvomljive celice + direktni odtis avtorja transkripcije; aritmetična vrata I4–I6 odločijo vsako dvomljivo števko",
            "PREHOD 4 (val 78, neodvisni prehod): §8 rdeči stolpec 'Zusammen' strukturiran (2 prehoda pri 6×–12×, crops-v78/, 33 izrezkov) + verifikacija rešitvenih poti p26/p27/p30/p32/p63/p65 — nobena ne vsebuje površin",
            "PREHOD 5 (val 79): odločilni re-read Rektifikacijskega odseka p35–42 (+ p48) — celotne strani @2x + 10 izrezkov linij @4x (crops-v79/), 2 VLM prehoda + direkten odtis; struktura OPISNO-KVALITATIVNA (Kultur-Beschreibung + Muster-parcele), per-parcelne korekcije NE obstajajo → rešitvena pot F-PZ-04 zapreta",
        "PREHOD 6 (val 80): VAČ topološka izčrpnost (II. prikaz @300 dpi NE obstaja: pdfPageImage 608px fiksna, session raster = ovitek, OCR prazen; maksimum = PDF-native ~150 dpi) + nativna re-digitation 7 variančnih celic — FFT template-matching anchors + 3 neodvisna branja/celico (direkten odtis + VLM raw/norm + VLM x3); 6/7 REŠENIH, sistemski pomlaj odkrit; inter-bralčeva varianca PR#69↔val 79 razrešena (PR#69 pravilna na 30/594/1004; val 79 pravilna na 2451; struktura – J na 738/2451/2491)",
            "PREHOD 7 (val 81): band-transkripcija p43–47 @nativno — 5 strani × 8 pasov (h=328, korak=298, 30px preklop; shema val 80 testa) + 14 x3 zoom re-readov; 54 VLM klicev + direkten odtis avtorja (40 pasov NEODVISNO pred VLM); vrednosti = soglasje ≥ 2 neodvisna branja, kolizije 2:1 ali x3 odtisom; struktura 43–47 korigirana vs val 75 — F-PZ-12 RESOLVED (reinertrag_p43_47)",
            "PREHOD 8 (val 109): 2. prehod p48–65 — protokoli (p48/49) + Veranschlagung/Darstellung §1–§8 (p50–61) + Zusammenstellung A/B (p62–65); karte + 45 izrezkov @nativno (crops-v109) z direktnim odtisom PRED VLM; VLM glasovi read-v109.mts NE IZVEDENI (429 dnevna kvota izčrpna z val 107/108 — 2,5 h kontinuiranih 429) — zaključeno z glasom #1 (direktni odtis) + modelom I7, vse REVIEW/odtis, izrezki resumable ob kvoti (vzorec p142-t-kultur2); struktura p50–61 KORIGIRANA (F-PZ-18: monotono §1–§8, 12 strani); aritmetični model I7 potrjen EXACT (p57/p59); p65 Zus A band re-read delno (F-PZ-19 PARTIAL); p61 prazna predloga + p62/p64 naslovnici brez VLM",
        ],
        "native_scans": "pz-n83/native/p01–p71.jpeg (pymupdf, metoda val 56)",
        "deterministic": True,
        "no_guessing": "§4: nič se ne ugiba; dvoumne oznake = REVIEW ali GATED (izpeljava z vrati); črne prečrtane vrednosti ohranjene; revizijski vzorec p67 (trenutna NAD prečrtano) dokumentiran na 5 neodvisnih primerih",
        "rejected_reads": "p43–47 celostranski VLM vrstični prepis ZAVRJEN (halucinacije na gostem Kurrentu) — nadomeščeno z band-metodo val 81 (PREHOD 7, F-PZ-12 RESOLVED: 40 pasov + 14 zoomov + 54 VLM klicev + direkten odtis; številke s soglasjem ≥ 2, proza delno REVIEW); p65 Zusammenstellung A 1. prehod celostranski delno nezanesljiv — ZAVRJEN kot vir resnice, val 109 pasovi + desni blok (PREHOD 8, F-PZ-19); p63 celostranski 1. prehod (val 77) ohranjen kot glas, NE kot vir resnice — val 109 band re-read odloča",
    },
    "provenance": {
        "uodid": 373419,
        "docid": 41784,
        "pages": 71,
        "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373419",
        "title_page": "CATASTRAL-SCHÄTZUNGS-ELABORAT der Gemeinde Grüble — Land Krain, Kreis Neustadtl, Steuerbezirk Krupp (Krupa), Schätzung District N°83",
        "dating": {
            "population_reference": 1830,
            "population_reference_source": "§3: 'Auf den Conscriptioins-Revisions-Resultaten vom Jahre 1830' (p2)",
            "nachtrag": "5. marec 1829[?] / 27. marec 1829[?] (p70–71)",
            "protocols": "9. marec 1830[?] / 5. april 1830[?] / 28. april 1830[?] (p32/40/41); komuniciranje 1830 (p48)",
            "label": "Konskripcija 1830 (delovno po val 42/74); dokument obsega 1828/29–1830",
        },
    },
    "bevoelkerung_1830": BEVOELKERUNG_1830,
    "viehstand_1830": VIEHSTAND_1830,
    "area_total": {
        **AREA_TOTAL,
        "red_corrected_qklft": pz_red,
        "red_corrected_m2": area_red_m2,
        "red_corrected_km2": round(area_red_m2 / 1e6, 3),
        "pv_comparison": {
            **PV_GRAND,
            "qklft": pv,
            "m2": area_pv_m2,
            "source": "pv-land-use-1825.json (val 74)",
        },
        "delta_qklft": delta_qklf,
        "delta_pct": round(delta_pct, 4),
    },
    "paragraf8_p6": PARAGRAF8_P6,
    "revision_1830_zusammen": REVISION_1830_ZUSAMMEN,
    "rektifikacija_beschreibung": REKTIFIKACIJA_BESCHREIBUNG,
    "reinertrag_p43_47": REINERTRAG_P43_47,
    "protokolle_p48_49": PROTOKOLLE_P48_49,
    "verantwortlichung_p50_61": VERANTWORTLICHUNG_P50_61,
    "zusammenstellung_ab_p62_65": ZUS_AB_P62_65,
    "endresultat_p67": {
        "title": "Specifischer Ausweis der nach der Catastral Ertragserhebung entfallenden Endresultate (p66–67)",
        "columns": ["Posten N°", "CultursGattungen", "Classe", "Flächen Maas (Joch | □Klafter)", "Bruto Ertrag (vom J° Joch | im Ganzen)", "Abzug zur Compensation des Culturs-Aufwandes per XI.O.Joch"],
        "revision_pattern": "trenutna vrednost zapisana NAD prečrtano izvirno (5 neodvisnih primerov: Aecher II 334/234, HW Klf 702/402, WmH Klf 558/846, Bauarea 1199/1144, Summa Klf 495/474[?])",
        "rows": ENDRESULTAT_ROWS,
        "summa": ENDRESULTAT_SUMMA,
        "sum_check": {
            "rows_computed_joch": rows_j,
            "rows_computed_klafter": rows_k,
            "rows_computed_total_qklft": rows_total_qklf,
            "summa_written_qklft": summa_qklf,
            "delta_qklft": summa_delta_qklf,
            "delta_display": f"{summa_delta_joch} J {summa_delta_klafter} K",
            "closes": summa_delta_qklf == 0,
            "klafter_column_closes": rows_k % KLFT_PER_JOCH == ENDRESULTAT_SUMMA["klafter"],
            "status": "OPEN" if summa_delta_qklf != 0 else "CLOSES",
            "note": "val 77: Δ = 3 J EXACT (4.800 QKlft; val 75: 43.488 na napačnih branjih). Klf stolpec se zapire (495 = 495); Joch stolpac Summe ostaja 3 J nad vsoto vrstic — pisarjevska nekonsistentnost ali neobjavljena korekcija; nič se ne vsiljuje (§4); rešitvene poti v PZ izčrpane (val 78 F-PZ-14 + val 79 F-PZ-16 + val 80 F-PZ-17: VAČ II @300 dpi ne obstaja) — ostaja samo zunanji Rektifikacijski protokol",
        },
        "evidence": "pz-n83/z-endresultat.jpeg + crops/p67-area/*.jpeg + crops/p67-rows/*.jpeg (val 77)",
    },
    "shares_1830": {
        "title": "Strukturni deleži rabe 1830 (izpeljani iz vrat I4–I6; Total = 1220 J 1493 K)",
        "shares": shares,
        "sum_qklft": shares_sum,
        "total_qklft": total_qklf,
        "sum_closes": shares_sum == total_qklf,
        "honesty": "F-PZ-04 (zapisana Summa p67) ostaja OPEN → 'pasture_share' metrika v §20 timeline UI OSTAJA absent (pogodba val 76); deleži tu so vrstična struktura, ne potrjena pisarna Summa",
        "note": "1825 PV primerjava (val 74): pašniki 52,06 % / njive 33,84 % / travniki 7,3 % / vinogradi 0,61 %; 1830 PZ: pašniške kategorije (Hutweiden + Weiden mit Holznutzen) 55,43 % / njive 33,96 % / travniki 3,73 % / vinogradi 0,58 %",
    },
    "weingaerten": WEINGAERTEN,
    "structure_map": [{"page": p, "content": c} for p, c in STRUCTURE],
    "findings": [
        {
            "id": "F-PZ-01",
            "title": "Skupna površina: dva vira se ujemata na <0,1 %",
            "status": "RESOLVED",
            "detail": f"PZ §1: črno 1235 J 1516 K (prečrtano) → rdeči popravek 1220 J 1493 K = {pz_red:,} QKlft ≈ {area_red_m2/1e6:.3f} km²; PV (val 74): 1221 J 1573 K = {pv:,} QKlft; Δ = {delta_qklf:,} QKlft = {delta_pct:.3f} % — dva neodvisna dokumenta potrdita površino občine; val 77: §8 Total 1220|1493 (nad prečrtanim 1217[?]|1444[?]) potrjuje tretjič; vzrok rezidualnega Δ ostaja UNKNOWN (zaokroževanje vs. ponovna meritev)",
        },
        {
            "id": "F-PZ-02",
            "title": "Prebivalstvo 1830 — prvi časovni korak §20",
            "status": "RESOLVED",
            "detail": "PZ §3 (p2): 222 moških + 219 žensk = 441 duš (aritmetična vrata I1 EXACT), v 70 hišah, 102 družin (Hofesgesessene) po Conscription-Revisions-Resultaten 1830 — §20 time slider ŽIV od val 76",
        },
        {
            "id": "F-PZ-03",
            "title": "Živina 1830 (kraška rejska struktura)",
            "status": "PARTIAL",
            "detail": "PZ §4 (p4): 124 Ochsen + 20 [Kühe|Rosse REVIEW] + 30 Jungvieh + 150 Schafe gesamt + 30 [Lämmer REVIEW] — števci jasni (2 prehoda), oznake vrst delno dvoumne; dopolnitev F-PV-05 (kraška pašniška struktura)",
        },
        {
            "id": "F-PZ-04",
            "title": "Endresultat p67: Summa se ne sešije z vrsticami 1–8 (val 77: Δ ožjan na 3 Joch)",
            "status": "OPEN",
            "detail": f"val 77 odločilni re-read celic popravlja val-75 branja: Summa = 1152 J 495 K (prej 1132), vrstice 1–8 = {rows_j} J {rows_k} K = {rows_total_qklf:,} QKlft (GG 405, WmH Klf 558, Bauarea 1199, Wiesen I = 5 po I5) → Δ = 3 Joch = {summa_delta_qklf:,} QKlft NATANČNO (prej 43.488). Klf stolpec se zapire (495 = 495). Odprto: pisarjevska nekonsistentnost Joch stolpca Summe (ali neobjavljena korekcija). Nič se ne vsiljuje (§4). Rešitvene poti: p26–p65 ovržene (val 78, F-PZ-14); Rektifikacija p35–40 ZAPRETA (val 79, F-PZ-16 — opisna, brez per-parcelnih površin); VAČ II @300 dpi OVRŽENA (val 80, F-PZ-17 — višja ločljivost na VAČ ne obstaja, maksimum = PDF-native ~150 dpi); val 80 nativna re-digitation Muster-citatov NE vpliva na Δ (vzorci kakovosti, ne seštevek); ostaja SAMO zunanji Rektifikacijski protokol (izven peskovnika)",
        },
        {
            "id": "F-PZ-05",
            "title": "Meje občine (§2 Gränzen)",
            "status": "REVIEW",
            "detail": "PZ §2 (p2): severno Kreising[?], vzhodno Kolpa + Adelschitz[?], južno Weidendorf[?], zahodno Tröbusche[?] + Kreising[?] — p32 nosi opis z mejnimi točkami (Andern[?], Elend G'schaid[?], Lutzgrübl[?] … 1. VLM prehod 1830[?]); topokonimi ostajajo REVIEW (razrešitev: PR Opis meje re-read); 'Weidendorf' kryža F-A05-01 (val 66)",
        },
        {
            "id": "F-PZ-06",
            "title": "Weingärten 1828/30: 7 J 42 K, rdeča revizija 6 J 1059 K",
            "status": "RESOLVED",
            "detail": "PZ §7 (p21): 'Einzige Classe — Flächenraum von 7 Joch 42 Klafter', Mustergrund parcela N°2494[?] (260 Klf[?]); val 77: 7|42 potrjeno tretjič (p67 + §8 + §7) in nosilka vrata I4; rdeča revizija 6 J 1059 K kaže zmanjšanje (~583 QKlft) — datum revizije UNKNOWN",
        },
        {
            "id": "F-PZ-07",
            "title": "Rektifikacijski protokoli 1830 + žirija (imena)",
            "status": "TO_VERIFY",
            "detail": "p31–41: komisijski protokoli s podpisi (Georg Juritschnik[?], Georg Madronitsch[?], Georg Brodnik[?], Georg Pintar[?], Georg Puschner[?] …) + pečati; datumi 9.3./5.4./28.4. 1830[?] — osebna identitetna dela NI izvedena (nič KG PERSON vozlišč brez identitetne preverbe §5)",
        },
        {
            "id": "F-PZ-08",
            "title": "Gozd: kategorija 'Weiden mit Holznutzen' (F-PV-02 razrešena na ravni kategorij)",
            "status": "RESOLVED",
            "detail": "PZ Endresultat: 'Weiden mit Holznutzen' 558 J 558 K = 893.358 QKlft ≈ 3,213 km² (val 77: Klf 558 po reviziji, prej 846; val 75 je poročal 896.646) kot lastna kategorija; ločenih 'Waldungen' v Endresultatu NI. PV (1825): 'Wälder' = 0 kot formalna kategorija. → napetost PV(0) vs PS(13 Wald parcel) dobi razlago: gozdno-pašniška (silvopastoralna) raba — lesna paša, ne zaprt gozd. Per-parcelni 'Wald' izrazi iz PS ostajajo dokumentirani, ne preimenovani (§5); celotna preverba čaka PS p56–143",
        },
        {
            "id": "F-PZ-09",
            "title": "Revizija pokritosti PS: vrstice pokrivajo SAMO p3–55",
            "status": "RESOLVED",
            "detail": "ps-n83/register.json: 1073 vrstic = p3–55 (53 listov); p56–143 (88 listov) NISO prepisani v vrstice — opomba '143/143 strani' v coverage se nanaša na strukturni re-read (val 61), ne na vrstični prepis. F-PV-03 (vinogradi v PS p56–143) ostaja OPEN in ne-preverljiv brez VAČ; korekcija besedila v source-coverage (val 75)",
        },
        {
            "id": "F-PZ-10",
            "title": "NOVO (val 77): Unbenützbar (Felsen/Leiten/Wege) — več-vrednostna celica, vrednost izpeljana iz Total vrat",
            "status": "REVIEW",
            "detail": "§8 p6 vrstica 'Unbenützbar … Felsen, höchste Leiten, Wege': rdeče 64[?] J, črno 68[?] J prečrtano; Klf 998 prečrtano, 1019 prečrtano — končni vpis neodločljiv na 182 dpi. Iz Total vrat I6 IZPELJANO: 71 J 998 K = 114.598 QKlft (Total 1.953.493 − vrstice 1–8 1.838.895). Izbirni vpis na strani še čaka potrditev (@300 dpi)",
        },
        {
            "id": "F-PZ-11",
            "title": "NOVO (val 77): revizijski vzorec p67 — 4 korekcije val-75 branj odločene z izrezki + vrati",
            "status": "RESOLVED",
            "detail": "Vzorec 'trenutna NAD prečrtano' dokumentiran na 5 neodvisnih celicah. Korekcije vs. val 75: Summa 1132 → 1152; Bauarea Klf 1499 → 1199 (nad 1144; §8 EXACT); GG Klf 105 → 405 (§8 EXACT); WmH Klf 846 → 558 (nad 846; §8 kaže isto prečrtavo); Wiesen §8 55 → 45 J 812 K. Potrjene: Aecher I/II 80|842 + 334|120 (nad 234|1149), Wiesen II 39|818, KG 3|615, WG 7|42, HW 118|702 (nad 402[?]) — 6/6 kultur zapa I4 EXACT",
        },
        {
            "id": "F-PZ-12",
            "title": "RESOLVED (val 81): p43–47 Reinertrag — celotni vrstični prepis izveden prek band-metode @nativno (40 pasov + 14 zoomov + 54 VLM klicev + direkten odtis)",
            "status": "RESOLVED",
            "detail": "val 75: celostranski VLM prepis ZAVRJEN (halucinacije @182 dpi). val 80: pot 'VAČ @300 dpi' OVRŽENA (F-PZ-17); 8-pasovni test p43 pokazal, da je band-metoda @nativno čitljiva. val 81: PREHOD 7 izveden — 5 strani × 8 pasov (h=328, korak=298, shema val 80) + 14 x3 zoom re-readov dvomljivih regij; 3 neodvisni glasovi (direkten odtis avtorja PRED VLM + VLM prehod A norm + VLM prehod R x3); 54 VLM klicev, surovine raw-web-val81-2026-09/ (crops-v81/ 40 pasov raw/norm + 15 zoom izrezkov, vlm/ 54 JSON+raw, bandread-v81.mts). REZULTATI: (a) struktura 43–47 KORIGIRANA vs val 75 — p43 = 1te Classe Wirthschafts Kurse + Düngung (3 Fuder; 90/120) + Natural Ertrag pro Joch (1–9: 26/12/50/12/12/[10]/15/80/12/[10]/15); p44 = IIte Classe (isti Kurse; Ertrag z razponi 18–20/9–10/30–40/…/65–70); p45 = IIIte Classe (NE 'IIa 2 parcele'!) — Ertrag list 15/8/30/8/8/[6]/9/60/8/[6]/9 CEL X PREČRTAN + Anmerkung; p46 = Wiesen 2 Classen (I: zusammen 14 [enota REVIEW]; II: 8 3/8) + KG + WG (9[?]/12 — sroglasje s p30 'Weingärten 12 Eimer') + Hutweiden 2 3/8; p47 = Huthweiden mit [Holz=|ganz=] Nutznießung und Niederwald (X prečrtano) + podpisi Kappas + 6 prič; (b) NISU per-parcelne tabele — p43–47 so klasni Natural-Ertrag koeficienti; per-parcelne trditve ostajajo NIČ (§4); (c) kolizije odločene 2:1 ali x3 odtisom: p43 item2 12 (ne 72), p45 item1 15 (ne 114/19), p45 item7 60 (ne 6), p45 Kart#1 6 (ne 8), p43 Kart#2 10 (ne 20); (d) proza ostaja delno REVIEW (Kurrent halucinacije na besedilu — številke ne). Vpliv na I1–I6/KG/deleže: NIČ (§22)",
        },
        {
            "id": "F-PZ-13",
            "title": "NOVO (val 77): strukturni deleži rabe 1830 izpeljani (vrata I4–I6)",
            "status": "RESOLVED",
            "detail": "Deleži iz vrat-solidnih vrstic nad Total 1220 J 1493 K: njive (Aecher) 33,96 % · pašniške kategorije (Hutweiden 9,70 % + Weiden mit Holznutzen 45,73 %) 55,43 % · travniki (Wiesen) 3,73 % · vinogradi 0,58 % · vrtovi 0,30 % · Bauarea 0,14 % · unbenützbar 5,87 % (izpeljano I6) — vsota 1.953.493 QKlft EXACT. Objavljeno v pz-konskripcija-1830.json; timeline UI 'pasture_share' ostaja absent dokler je F-PZ-04 OPEN (pogodba val 76)",
        },
        {
            "id": "F-PZ-14",
            "title": "NOVO (val 78): rešitvene poti F-PZ-04 iz val 75 preverjene — nobena ne vsebuje površin",
            "status": "RESOLVED",
            "detail": "Neodvisni prehod (2. seja) je prebral p26 (Verhältnisbestimmung, proza), p27 (Holznutzen razmerje), p30 (Resultate der benützten Behelfe — naravni pridelki: Metzen/Centner/Eimer po klasah), p32 (protokol: seštevek 7 kultur BREZ Bauarea + podpisi, 9. aprila 1830), p63 (Zusammenstellung B — Renta/Capitalwerth po Pachtverträgnih, dominikalne parcele), p65 (Zusammenstellung A — Culturfonds + Pro-cento odstotki Rein-Ertraga): nobena tabela NE vsebuje površin po kulturah — hipoteza val 75 ('možne rešitve: p30/p63/p65') dokončno ovržena; rešitev F-PZ-04 ostaja pri vrati I4–I6 (val 77) + pisarjevska nekonsistentnost Joch stolpca Summe",
        },
        {
            "id": "F-PZ-15",
            "title": "NOVO (val 78): §8 rdeči stolpec 'Zusammen' = post-revizijske površine — strukturiran (REVIEW, ni podlaga za deleže)",
            "status": "REVIEW",
            "detail": "Rdeči stolpec (Rektifikacija 1830) strukturiran v revision_1830_zusammen: Aecher 419 J 1382 K / Wiesen 45[?] J 167 K (val 80: varianca 41 vs 45 — 3 glasova 41, aritmetika subtotala 1150 EXACT za 45; ni odločeno §4) / KG 2 J 1166 K / GG – J 1460 K / Weingärten 6 J 1059 K (TRANSCRIBED — križno §7 p21, F-PZ-06) / HW 121 J 1190 K / WmH 557 J 1258 K (val 80: 557 aritmetično POTRJEN; 1258 potrjen 3×); subtotal 1150 J 1582 K; Bauarea 1 J 1199 K (križno p67); voda 68 J 1019 K (= F-PZ-10 več-vrednostna celica); sidro Total 1220 J 1493 K = §1 EXACT (SOLID). Veriga subtotal+Bauarea+voda = 1.954.200 vs Total = Δ 707 QKlft (0,036 %) OPEN-MICRO — znotraj REVIEW negotovosti; URADNI deleži 1830 ostajajo iz F-PZ-13 (črni stolpec, vrata I4–I6 EXACT); val 80 re-digitation rdečega stolpca (nativni pasovi): Total 1220|1493 potrjen 3×, WmH 557 aritmetično, KG/GG/WG/HW soglasno; ostata varianca Wiesen 41/45 + subtotal-K/veriga Δ 707 OPEN-MICRO",
        },
        {
            "id": "F-PZ-16",
            "title": "NOVO (val 79): Rektifikacijski odsek p35–40 je OPISNO-KVALITATIVEN — per-parcelne korekcije NE obstajajo v PZ [373419]",
            "status": "RESOLVED",
            "detail": "Odločilni re-read (2 VLM prehoda @2x/@4x + direkten odtis, crops-v79/): p35–40 = Kultur-Beschreibung — opisne klase per kultur (I Aacker 3 klase, II Wiesen 2, III/IV vrtovi, VI Holzgärten, weiden meje) + zaključni protokol p40 (žirija Kappas + 9, k.k. Schätzungskommission, pečat; 9./29. april 1830 — mesec REVIEW; val-75 ugib '5./28.' ovržen). Edina numerika = 7 Muster-parcel per klas ('Als Muster dienen die Parzelle № X mit 1 Joch Y' — vzorci KAKOVOSTI, ne površinskih popravkov): № 30 = 1 J 1082 (p35; val 80 popravek 1382→1082), № 594 = 1 J 591 (val 80: 531→591) + № 1004 = 1 J 1010 (val 80 popravek: NE 1099/700) (p36), № 738 = – J 895 (pomlaj; val 80) + № 2451 = – J 1515 (pomlaj) (p37), № 2491|249/1 = – J 260 (pomlaj) (p38), № 1288 nad prečrtano 2875 = 1 J 882|883 REVIEW (p39). Rektifikacijska numeracija: 4/7 ni v 1825 PUA/PS registru (2451, 2491, 1288, 2875); p41–42 = 1832 protokoli (Nachsetzung/Vergleich; Einvernehmungs-Protocoll 6. dec. 1832 — popravek val-75 oznake 'Einwands-Protokoll'); p48 = Einvernehmung 5. aprila 1830, proza. → Rešitvena pot F-PZ-04 'per-parcelna kontrola p35–40' ZAPRETA: rešitev Δ 3 J ostaja pri VAČ II @300 dpi re-digitation ali zunanjem Rektifikacijskem protokolu (izven PZ in peskovnika; val 80: VAč pot ovržena, F-PZ-17)",
        },
        {
            "id": "F-PZ-17",
            "title": "NOVO (val 80): VAČ II. prikaz @300 dpi NE OBSTAJA — PDF-native ~150 dpi je maksimum portala za PZ [373419]; zadnja peskovniška rešitvena pot F-PZ-04 ovržena",
            "status": "RESOLVED",
            "detail": "Sistemska topološka preverba vseh VAČ (vac.sjas.gov.si) dostopnih poti za PZ docid 41784: (1) pdfPageImage = FIKSNA 608px predogleda — parametri size/width/zoom/dpi/scale ignorirani (200, isti odgovor); (2) session-vezani IIIF raster (Presentation 3 manifest, /vac/iiif/manifest?uodid&docid&seq — metoda grafičnih listov val 42) obstaja TUDI za PZ, ampak vsebuje SAMO ovitek 100×50 (seq-agnostičen; info.json 404); (3) per-page OCR AnnotationList (pdf-text) = prazna resources (enako pdf-raw-text, val 56); (4) pdf-manifest canvasi = PDF točke (608×1024 pt), ne piksli; (5) PDF vsebuje NATIVNO 1 rastri/stran brez mask (1268×2135 portret / ~2850×2380 ležeče; LuraDocument v2.16, 2006) — učinkovito ~150 dpi. Sklep: maksimum = PDF-native skeni (že v pz-n83/native/ od val 75); pretekle @2x–@4x 'večave' = interpolacija brez novih informacij. Vpliv: (a) F-PZ-04 — vse peskovniške rešitvene poti IZČRPANE (F-PZ-14/16/17), ostaja zunanji Rektifikacijski protokol; (b) F-PZ-12 — band-metoda @nativno izvedljiva (8-pasovni test p43 čitljiv); (c) metodološki standard za prihodnje valove: NATIVNI piksli + večav SAMO za VLM berljivost, nikoli kot vir detajlov",
        },
        {
            "id": "F-PZ-18",
            "title": "NOVO (val 109): strukturna korekcija p50–61 — Veranschlagung des Cultur-Aufwandes in Darstellung des Rein-Ertrages, monotono §1–§8 (12 strani)",
            "status": "RESOLVED",
            "detail": "Val 75 struktura p50–61 je bila sistemsko zmotna (oznake brez branja § števk): p50 = §1 Ackerland I.te Classe (NE 'VERANTWORTLICHUNG'), p51 = nadaljevanje Begrüning §1 + prazna predloga (NE 'Campus nach Rektifizierung ležeča tabela'), p52 = §1 II.te (NE 'Dritte'), p53 = §2 Wiesenland I.te, p54 = §2 II.te (NE 'Dritte/Vierte'), p55 = §3 Kleine Gärten (NE '§5'), p56 = §4 Größere Gärten (NE '§6'), p57 = §5 Weingärten (NE '§7'; val-75 opomba '7 parcel 1,2,4,5,6,8,11' je p63 Zus B vsebina), p58 = §6 Weiden (NE '§8 Hutweiden'), p59 = §7 Weiden mit Holznutzung (NE '§9'), p60 = §8 Bau-Area + podpis (NE 'nadaljevanje'), p61 = prazna tiskana predloga (NE 'nadaljevanje'). Dokaz: secnum zoomi p55–p60 (Kurrent § številke, direkten odtis 2×) + naslovni blok p50 + mreža §/Classe/verstic — drevesna struktura §1 (2 klasi + Begrüning nadaljevanje), §2 (2 klasi), §3–§8 (einzige; §7 = Weide + Holznutzung + vsota). Vpliv: izboljša navigacijo/lastnosti, NIČ na I1–I6/p67 (§22)",
        },
        {
            "id": "F-PZ-19",
            "title": "NOVO (val 109): Zusammenstellung A (p65) — band re-read z desnim blokom (Nach der Instruction / Rein-Ertrag)",
            "status": "PARTIAL",
            "detail": "1. prehod (val 77, celostranski) je bil delno nezanesljiv (REVIEW). Val 109: 4 pasovi + desni blok zoom @nativno (read-v109 p65-band* + p65-desni-zoom) + direkten odtis; struktura tabele potrjena (8 postenk: Ackerland I/II/III, Wiesen I/II, Kl.G, Gr.G, Weing, Weiden, W.m.Holzn. + Summa, Bau-Area; desni blok 'Nach der Instruction kommen jedoch anzuwenden' + 'Es zeigt sich Rein-Ertrag'); križni pregled z §1–§8 (I7): Wiesen II Rein 3|— SROGLASJE, Bau-Area 16|30½→7|35 SROGLASJE; Ackerland I Brutto '22|463[?]' vs §1 '23|44' ostaja KOLIZIJA (F-PZ-20) — nič se ne vsiljuje; podpis 'Neustadtl am 6ten July 1831[?]'. RAVEN: PARTIAL — polne vrstice p65 + p63 čakajo VLM glasove (read-v109 p63-band*/p65-band* + p65-desni-zoom, 45 izrezkov resumable); val 109 zaključen brez VLM (429 dnevna kvota) — glasovi ob kvoti (vzorec p142-t-kultur2)",
        },
        {
            "id": "F-PZ-20",
            "title": "NOVO (val 109): aritmetični model I7 — Anschlag = Roh × Taxa %, Rein = Roh − Anschlag (EXACT na p57/p59) + odprte kolizije",
            "status": "PARTIAL",
            "detail": "Model potrjen EXACT: p57 Weingärten 24 fl × 70 % = 16 fl 48 kr = Anschlag (EXACT), Rein 24 − 16.8 = 7|12 (pisano 7|10[?]); p59 Weide 1 × 25 % = —|15 (EXACT), Rein —|45 (EXACT), vsota 51 = 45+6 (EXACT); p52 blizu (16.8417×0.55 = 9|15.8 vs pisano 9|12¾[?]; Rein 7|35 ✓); p53/p55/p56 v rangu modela ob alternativnih branjih [?]. ODPRTE kolizije (nič se ne vsiljuje — §4): (a) p54 Wiesen II — Anschlag 1|— in Rein 3|— se NE ujemata z modelom (14×0.25 = 3.5; 11×0.25 = 2.75) — morda poseben režim (Drusch/Nutzen po Instrukciji), reši p65 Zus A desni blok; (b) p65 Zus A Acker I Brutto '22|463[?]' vs §1 '23|44' — Kurrent 22/23 + decimalka; (c) '132[?]' v Aufwand kr Weiden (§6/§7) — nenavadna oblika. i7_checks po vrstici v verantwortlichung_p50_61 — raven: kontrola, NE vrata. RAVEN: PARTIAL — odprte kolizije (a)–(c) ter nerešene dileme 1/2/7 iz direct-reads-v109.md čakajo VLM glasove (read-v109.mts, 45 izrezkov resumable — val 109 zaključen brez VLM, 429 dnevna kvota; glasovi ob kvoti)",
        },
    ],
    "invariants_enforced": [
        "I1 prebivalstvo 222+219=441 (fail-fast)",
        "I2 površina PZ↔PV < 1 % (fail-fast)",
        "I3 Endresultat struktura 10 vrstic (fail-fast)",
        "I4 per-kultura §8 Einzeln enakosti (6 kultur, fail-fast)",
        "I5 Wiesen I+II = 45 J 812 K + izpeljava Wiesen I = 5 (fail-fast)",
        "I6 vrstice 1–8 + unbenützbar = Total 1220 J 1493 K (fail-fast)",
        "I7 Veranschlagung §1–§8: 8 sekcij / 11 vrstic p50–61 (fail-fast); aritmetični model (Anschlag = Roh × Taxa %, Rein = Roh − Anschlag) = kontrola po vrstici i7_checks — NE vrata (F-PZ-20)",
    ],
    "invariant_violations": [],
    "generated_at": datetime.now(timezone.utc).isoformat(),
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"OK → {OUT}")
print(f"  I1 prebivalstvo: 222+219=441 ✓")
print(f"  I2 površina: PZ rdeči {pz_red:,} vs PV {pv:,} QKlft (Δ {delta_pct:.3f} %) ✓")
print(f"  I3 Endresultat: 10 vrstic ✓")
print(f"  I4 §8 vrata: {len(GATES_I4)} kultur EXACT ✓")
print(f"  I5 Wiesen: 45 J 812 K (I = 5 J izpeljano) ✓")
print(f"  I6 Total: {rows_j} J {rows_k} K + 71 J 998 K = 1220 J 1493 K ✓")
print(f"  Summa check: OPEN (Δ {summa_delta_joch} J {summa_delta_klafter} K = {summa_delta_qklf:,} QKlft — F-PZ-04)")
print(f"  deleži: njive {shares[0]['pct_of_total']} % · pašniške {shares[5]['pct_of_total']+shares[6]['pct_of_total']:.2f} % · travniki {shares[1]['pct_of_total']} % · vinogradi {shares[4]['pct_of_total']} %")
print(f"  najdbe: {len(data['findings'])} (RESOLVED {sum(1 for x in data['findings'] if x['status']=='RESOLVED')}, PARTIAL {sum(1 for x in data['findings'] if x['status']=='PARTIAL')}, REVIEW {sum(1 for x in data['findings'] if x['status']=='REVIEW')}, OPEN {sum(1 for x in data['findings'] if x['status']=='OPEN')}, TO_VERIFY {sum(1 for x in data['findings'] if x['status']=='TO_VERIFY')})")
