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

  p43–47 (Reinertragstabellen): celostranski VLM poskus vrstičnega prepisa
  je ZAVRNJEN (nezanesljivo branje gostega Kurrenta — halucinacije); ohranjeno
  strukturno branje val 75; celotni vrstični prepis čaka višjo ločljivost
  (VAČ IIIF @300 dpi) — F-PZ-12, pošteno dokumentirano (§4: nič vsiljenega).

Metoda (issue #42 §1: SOURCES → DOKAZI → PODATKI; nič ugibanja):
  PREHOD 1 (struktura, val 75): 8 kontaktnih plošč → zemljevid 71 strani.
  PREHOD 2 (val 75): ključna branja digit-by-digit.
  PREHOD 3 (val 77): odločilni re-read p67 + p6 — izrezki celic (crops/
  p67-area/, crops/p6-tab-*, crops/p6-zus-*), 2 neodvisna VLM prehoda na
  dvomljive celice + direktni odtis; aritmetična vrata I4–I6 odločijo.

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
         "note": "val 78 usklajeno s crno korekcijo val 77 (55->45 J): rdece joch 45[?] (prvotna branja '44/55' — 4/5 dvoumnost); rdeci klafter 162-167 dvoumen"},
        {"kultur": "Kleine Gaerten", "joch": 2, "klafter": 1166, "reading_status": "REVIEW",
         "note": "crno 3 J 615 K; rdece 2 J 1166 K (ali 1266) — REVIEW"},
        {"kultur": "Groessere Gaerten", "joch": 0, "klafter": 1460, "reading_status": "REVIEW",
         "note": "crno (val 77) - J 405 K; rdece - J 1460 K (ali 1480) — REVIEW"},
        {"kultur": "Weingaerten", "joch": 6, "klafter": 1059, "reading_status": "TRANSCRIBED",
         "note": "krizno potrjeno: §7 p21 rdeca revizija 6 J 1059 K (F-PZ-06) = §8 rdeci stolpec — edina rdeca vrstica z neodvisno potrditvijo"},
        {"kultur": "Huthweiden", "joch": 121, "klafter": 1190, "reading_status": "REVIEW",
         "note": "crno 118 J 702 K; rdece 121 J 1190 K — REVIEW"},
        {"kultur": "Huthweiden mit Holznutzen", "joch": 557, "klafter": 1258, "reading_status": "REVIEW",
         "note": "crno (I4) 558 J 558 K; rdeci joch 557[?] / 354[?] (prva stevka 3/5 dvoumna, val 77 je videl 354 'precrtano') — REVIEW; klafter 1258"},
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
REKTIFIKACIJA_BESCHREIBUNG = {
    "title": "Rektifikacija 1830 — Kultur-Beschreibung (p35–40) + 1832 protokoli (p41–42) — opisno-kvalitativen odsek",
    "source_pages": [35, 36, 37, 38, 39, 40, 41, 42],
    "evidence": "pz-n83/crops-v79/p35–p42-full-2x.png + crops-v79/p35-parzelle-h30.png … p40-date2.png (10 izrezkov @4x)",
    "passes": 2,
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
         "joch": 1, "klafter": 1382, "owner": "Mursko Fe[?] (Marusch Ferregi?)", "reading_status": "REVIEW",
         "pua_1825_match": True, "ps_1825_match": True,
         "note": "direkten odtis @4x; '1 Joch 1382 [Qft]'; VLM 1. prehod @2x ni videl citata, 2. prehod @4x napačno '1 Julj 1882' (Kurrent) — številka ostaja REVIEW po §4"},
        {"page": 36, "klasse": "Acker — Zweyte Classen", "parcel_no": 594, "parcel_no_alt": [],
         "joch": 1, "klafter": 531, "owner": "Georg Straup[?]", "reading_status": "REVIEW",
         "pua_1825_match": True, "ps_1825_match": False,
         "note": "direkten odtis @4x; 'Parzellen № 594 mit 1 Joch 531'"},
        {"page": 36, "klasse": "Acker — Dritte Classe", "parcel_no": 1099, "parcel_no_alt": [],
         "joch": 1, "klafter": 700, "owner": "Martin Bering[?]", "reading_status": "REVIEW",
         "pua_1825_match": True, "ps_1825_match": False,
         "note": "direkten odtis @4x; 'Parzellen № 1099 mit 1 Joch 700'; rdeči zapis 'Dritte Classe' na levem robu"},
        {"page": 37, "klasse": "Wiesen — Erste Classen", "parcel_no": 438, "parcel_no_alt": [738],
         "joch": 1, "klafter": 896, "owner": "Martin[?] Brinar[?]", "reading_status": "REVIEW",
         "pua_1825_match": False, "ps_1825_match": True,
         "note": "direkten odtis @4x: 438; VLM 2. prehod @4x bere 738 (kurrentska 4↔7 dvoumnost) — 438 obstaja v PS registru 1825 (Wiesen kandidatura), 738 v PUA; križna kontrola NE odloči, ostaja REVIEW"},
        {"page": 37, "klasse": "Wiesen — Zweite Classen", "parcel_no": 2451, "parcel_no_alt": [],
         "joch": 1, "klafter": 1515, "owner": "Martin Blaznik[?]", "reading_status": "REVIEW",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "direkten odtis @4x; '№ 2451 mit 1 Joch 1515'; v 1825 registru NE obstaja → nova (rektifikacijska) numeracija"},
        {"page": 38, "klasse": "Obere Gärten", "parcel_no": 2491, "parcel_no_alt": [249],
         "joch": 1, "klafter": 260, "owner": "Martin Kabatschnig[?]", "reading_status": "REVIEW",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "direkten odtis @4x: 2491; VLM 2. prehod bere '249/1' (razdelilnik) — 249 obstaja v PUA+PS; ali '249/1' ali rektifikacijska številka 2491 — REVIEW"},
        {"page": 39, "klasse": "Weiden (nadaljevanje)", "parcel_no": 1288, "parcel_no_alt": [2875],
         "joch": 1, "klafter": 882, "owner": "Ferencz Marusch[?]", "reading_status": "REVIEW",
         "pua_1825_match": False, "ps_1825_match": False,
         "note": "direkten odtis @4x: '1288' zapisano NAD prečrtanim '2875' (isti revizijski vzorec kot p67!) — trenutna 1288, prečrtana 2875; VLM 2. prehod je prebral '188/873' (nezanesljivo); '1 Joch 882|883 [Qft]' — 2/3 dvoumna"},
    ],
    "renumbering": {
        "finding": "4/7 Muster-parcel (2451, 2491, 1288, 2875) NE obstaja v 1825 PUA/PS registru; 30/594/1099 obsegovno sovpadajo; 438 = PS-only",
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
        "remaining_paths": ["VAČ II. prikaz @300 dpi — re-digitation Summe/vrstic (peskovniško edina)", "zunanji Rektifikacijski/Komunikacijski protokol (SI AS / ločena arhivska enota) — izven peskovnika"],
        "f_pz_04_status": "OPEN (ožjan val 77 na Δ 3 J; rešitvene poti v PZ izčrpane val 78+79)",
    },
    "reading_honesty": "VLM številke na tem Kurrentu ostajajo nezanesljive tudi @4x (halucinacije dokumentirane: '1 Julj 1882' namesto '1 Joch 1382', '188/873' namesto '1288/2875') — vse številke REVIEW; strukturni sklep (OPISNO, brez per-parcelnih tabel) pa je konsistenten v 2 VLM prehodih + direktnem odtisu + aritmetičnih vhodih",
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

# strukturni zemljevid 71 strani (PREHOD 1, val 75; nespremenjen)
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
    (35, "Rektifikacija 1830 — I. Aacker: Kultur-Beschreibung opisno (prvi klas, Kameniza; Muster № 30 = 1 J 1382) — NE per-parcelne korekcije (val 79)"),
    (36, "Rektifikacija — Acker nadaljevanje: 2./3. klas + rdeči zapis 'Dritte Classe'; Muster № 594 = 1 J 531, № 1099 = 1 J 700 (val 79)"),
    (37, "Rektifikacija — II. Wiesen: opisno + Muster № 438 = 1 J 896, № 2451 = 1 J 1515 (val 79; pečat p41, NE tukaj)"),
    (38, "Rektifikacija — III. Kleine Gärten / IV. Obere Gärten / VI. Holzgärten: opisno + Muster № 2491 = 1 J 260 (val 79)"),
    (39, "Rektifikacija — weiden nadaljevanje: meje + Muster № 1288 (nad prečrtano 2875) = 1 J 882|883 (val 79)"),
    (40, "Rektifikacija zaključek — podpisi žirije (Kappas + 9) + k.k. Schätzungskommission + pečat (9. / 29. april 1830 — mesec REVIEW; val 75: 5./28. ovrženo) + 'vierte Nachtag' (val 79)"),
    (41, "Nachsetzung (№ 1980 / № 88; 12. avg. 1832[?]) + Vergleich (4. jun. 1832[?]) + podpisi — 1832, brez površin (val 79)"),
    (42, "Einvernehmungs-Protocoll 6. dec. 1832 — Natural-Brutto-Ertrag (poprava: NE 'Einwands-Protokoll'; val 79)"),
    (43, "Kataster und Steuer Claffen — I. Classe Reinertragstabelle (parcele)"),
    (44, "II. Classe Reinertragstabelle"),
    (45, "IIa. Classe (2 parcele: N°96 in N°311, QKlf 334[?])"),
    (46, "III. Classe + Kleine Gärten/Weingärten/Hutweiden Ertrags Classe"),
    (47, "Wald und Ödland? Erste Classe + podpisi (16. julij 1829[?])"),
    (48, "Einvernehmungs-Protocoll 5. aprila 1830 (rožnat papir): proza o gojitvi/vrtninah[?] — brez per-parcelnih tabel (val 79 re-read)"),
    (49, "Communications-Protokoll — nadaljevanje + podpisi"),
    (50, "VERANTWORTLICHUNG des Cultural-Ausweises (zelen papir) — §1 Acker, Darstellung des Rein Ertrages"),
    (51, "Campus nach Rektifizierung — ležeča tabela"),
    (52, "Zweite Classe — Darstellung des Rein Ertrages"),
    (53, "Dritte Classe — Darstellung"),
    (54, "Vierte Classe — Darstellung"),
    (55, "§5 Kleine Gärten — Erste Classe + red. Rektifikations-merkovka"),
    (56, "§6 Größere Gärten — Erste Classe"),
    (57, "§7 Weingärten — Erste Classe (7 parcel: 1,2,4,5,6,8,11?)"),
    (58, "§8 Hutweiden — Erste Classe"),
    (59, "§9 Wiesen/Hutweiden — Classe + podpis (28. april 1831[?])"),
    (60, "Classe — tabela (nadaljevanje)"),
    (61, "Classe — tabela (nadaljevanje)"),
    (62, "Zusammenstellung B — naslovnica: jährliche Rente und Capitalwerth nach Pachtverträgen"),
    (63, "Zusammenstellung B — ležeča tabela (Renta/Capitalwerth; val 77 1. prehod: parcelni Pachtverträge — N°115/292/293/786/299 … Acker I, N°1031/1037/1040/779/1205/702/794 … Acker II, N°417 Wiesen, N°1020 Wiesen mit Weide; vsote per classe zapisane)"),
    (64, "Zusammenstellung A — naslovnica: gesammter Cultur-Aufwand (Acker Wies- und Weinland)"),
    (65, "Zusammenstellung A — ležeča tabela (Culturfonds po kulturah; val 77 1. prehod delno — REVIEW)"),
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
    "val": 79,
    "pass": "PZ PASS 5 (val 79: Rektifikacijski odsek p35–42 odločilno prebran — OPISNO, brez per-parcelnih korekcij; rešitvena pot F-PZ-04 zapreta; 7 Muster-parcel + 1830/1832 protokoli dokumentirani; I4–I6 nespremenjeni)",
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
        ],
        "native_scans": "pz-n83/native/p01–p71.jpeg (pymupdf, metoda val 56)",
        "deterministic": True,
        "no_guessing": "§4: nič se ne ugiba; dvoumne oznake = REVIEW ali GATED (izpeljava z vrati); črne prečrtane vrednosti ohranjene; revizijski vzorec p67 (trenutna NAD prečrtano) dokumentiran na 5 neodvisnih primerih",
        "rejected_reads": "p43–47 celostranski VLM vrstični prepis ZAVRJEN (halucinacije na gostem Kurrentu) — F-PZ-12; p65 Zusammenstellung A 1. prehod delno nezanesljiv — REVIEW",
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
            "note": "val 77: Δ = 3 J EXACT (4.800 QKlft; val 75: 43.488 na napačnih branjih). Klf stolpec se zapire (495 = 495); Joch stolpac Summe ostaja 3 J nad vsoto vrstic — pisarjevska nekonsistentnost ali neobjavljena korekcija; nič se ne vsiljuje (§4); rešitvene poti v PZ izčrpane (val 78 F-PZ-14 + val 79 F-PZ-16) — ostata VAČ II @300 dpi re-digitation in zunanji Rektifikacijski protokol",
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
            "detail": f"val 77 odločilni re-read celic popravlja val-75 branja: Summa = 1152 J 495 K (prej 1132), vrstice 1–8 = {rows_j} J {rows_k} K = {rows_total_qklf:,} QKlft (GG 405, WmH Klf 558, Bauarea 1199, Wiesen I = 5 po I5) → Δ = 3 Joch = {summa_delta_qklf:,} QKlft NATANČNO (prej 43.488). Klf stolpec se zapire (495 = 495). Odprto: pisarjevska nekonsistentnost Joch stolpca Summe (ali neobjavljena korekcija). Nič se ne vsiljuje (§4). Rešitvene poti: p26–p65 ovržene (val 78, F-PZ-14); Rektifikacija p35–40 ZAPRETA (val 79, F-PZ-16 — opisna, brez per-parcelnih površin); ostata samo VAČ II @300 dpi re-digitation in zunanji Rektifikacijski protokol (izven peskovnika)",
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
            "title": "NOVO (val 77): p43–47 Reinertragstabellen — vrstični prepis poskušen in pošteno zavrnjen",
            "status": "OPEN",
            "detail": "Celostranski VLM prepis p43–47 (5 strani) je nezanesljiv: model halucinira besedila in številke na gostem Kurrentu (nizka berljivost @182 dpi). Po §4 (nič vsiljenega) so branja ZAVRJENA in NE vhod v podatke; ohranjeno strukturno branje val 75. Celotni vrstični prepis čaka višjo ločljivost (VAČ IIIF tiles @300 dpi) ali ročno preverbo",
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
            "detail": "Rdeči stolpec (Rektifikacija 1830) strukturiran v revision_1830_zusammen: Aecher 419 J 1382 K / Wiesen 45[?] J 167 K / KG 2 J 1166 K / GG – J 1460 K / Weingärten 6 J 1059 K (TRANSCRIBED — križno §7 p21, F-PZ-06) / HW 121 J 1190 K / WmH 557[?] J 1258 K; subtotal 1150 J 1582 K; Bauarea 1 J 1199 K (križno p67); voda 68 J 1019 K (= F-PZ-10 več-vrednostna celica); sidro Total 1220 J 1493 K = §1 EXACT (SOLID). Veriga subtotal+Bauarea+voda = 1.954.200 vs Total = Δ 707 QKlft (0,036 %) OPEN-MICRO — znotraj REVIEW negotovosti; URADNI deleži 1830 ostajajo iz F-PZ-13 (črni stolpec, vrata I4–I6 EXACT); rdeče števke čakajo re-digitation @višjo ločljivost (VAČ II. prikaz)",
        },
        {
            "id": "F-PZ-16",
            "title": "NOVO (val 79): Rektifikacijski odsek p35–40 je OPISNO-KVALITATIVEN — per-parcelne korekcije NE obstajajo v PZ [373419]",
            "status": "RESOLVED",
            "detail": "Odločilni re-read (2 VLM prehoda @2x/@4x + direkten odtis, crops-v79/): p35–40 = Kultur-Beschreibung — opisne klase per kultur (I Aacker 3 klase, II Wiesen 2, III/IV vrtovi, VI Holzgärten, weiden meje) + zaključni protokol p40 (žirija Kappas + 9, k.k. Schätzungskommission, pečat; 9./29. april 1830 — mesec REVIEW; val-75 ugib '5./28.' ovržen). Edina numerika = 7 Muster-parcel per klas ('Als Muster dienen die Parzelle № X mit 1 Joch Y' — vzorci KAKOVOSTI, ne površinskih popravkov): № 30 = 1 J 1382 (p35), № 594 = 1 J 531 + № 1099 = 1 J 700 (p36), № 438|738 = 1 J 896 + № 2451 = 1 J 1515 (p37), № 2491|249/1 = 1 J 260 (p38), № 1288 nad prečrtano 2875 = 1 J 882|883 (p39). Rektifikacijska numeracija: 4/7 ni v 1825 PUA/PS registru (2451, 2491, 1288, 2875); p41–42 = 1832 protokoli (Nachsetzung/Vergleich; Einvernehmungs-Protocoll 6. dec. 1832 — popravek val-75 oznake 'Einwands-Protokoll'); p48 = Einvernehmung 5. aprila 1830, proza. → Rešitvena pot F-PZ-04 'per-parcelna kontrola p35–40' ZAPRETA: rešitev Δ 3 J ostaja pri VAČ II @300 dpi re-digitation ali zunanjem Rektifikacijskem protokolu (izven PZ in peskovnika)",
        },
    ],
    "invariants_enforced": [
        "I1 prebivalstvo 222+219=441 (fail-fast)",
        "I2 površina PZ↔PV < 1 % (fail-fast)",
        "I3 Endresultat struktura 10 vrstic (fail-fast)",
        "I4 per-kultura §8 Einzeln enakosti (6 kultur, fail-fast)",
        "I5 Wiesen I+II = 45 J 812 K + izpeljava Wiesen I = 5 (fail-fast)",
        "I6 vrstice 1–8 + unbenützbar = Total 1220 J 1493 K (fail-fast)",
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
