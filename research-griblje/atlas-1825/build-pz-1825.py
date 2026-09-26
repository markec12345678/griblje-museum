#!/usr/bin/env python3
"""
Val 75 — PZ N83 "Katastral-Schätzungs-Elaborat" (Konskripcija), 71 strani
[VAČ uodid 373419 / docid 41784], Land Krain, Kreis Neustadtl,
Schätzungsdistrict XI (N° 83), Gemeinde Grüble.

Prvi podatkovni korak za §20 (TIME SLIDER): Conscription-Revisions-Resultate
1830 = prebivalstvo + živina; §1 = skupna površina (rdeči popravek);
p67 = Specifischer Ausweis (Endresultate); §7 = Weingärten; §8 = tabela
"Cultivirte, unbenützte und unbenützbare Grundstücke".

Metoda (issue #42 §1: SOURCES → DOKAZI → PODATKI; nič ugibanja):
  PREHOD 1 (struktura): 8 kontaktnih plošč (9 strani/pl.) → strukturni
  zemljevid 71 strani.
  PREHOD 2 (ključna branja): 2 neodvisna prehoda po ključnih odstavkih in
  tabelah (digit-by-digit pri 2,6×–5×; dokazni izrezki v pz-n83/z-*.jpeg).
  Aritmetična vrata:
    I1 prebivalstvo: 222 M + 219 Ž = 441 Seelen (EXACT) — fail-fast.
    I2 površina: |PZ(rdeči) − PV| / PV < 1 % — fail-fast (večja odstopanja
       pomenijo napačno branje števk).
    I3 Endresultat: 10 vrstic, površine ≥ 0, classe ∈ {I, II, C, –} — fail-fast.
  Summa kontrola (p67): vrstice 1–8 vsota = 1160 J 183 K vs zapisana Summa
  1132 J 495 K — NE se zapre (Δ 44.488 QKl) → F-PZ-04 OPEN (ni invarianta;
  pošteno dokumentirano, brez vsiljevanja rešitve).

Izhod: pz-konskripcija-1830.json (dokumentni agregat; NI per-parcelnih
trditev — raba po parcelah ostaja neznana §4; prebivalstvo 1830 = dokumentni
podatek za prihodnjo §20 časovno plast, še BREZ UI/API sloja).
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


# --- PREHOD 2 branja (2 neodvisna prehoda; dokazni izrezki pz-n83/z-*.jpeg) ---

# §3 BEVÖLKERUNG (p2): "Auf den Conscriptioins-Revisions-Resultaten vom Jahre 1830"
# branje: 222 M / 219 Ž / 441 Seelen / 70 Häusern / 102 Familien (obe prehoda)
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
    "note": "rdeči popravek prek črno prečrtanih števk; obe vrednosti dokumentirani (nič ni brisano §5)",
}

# PV (val 74) primerjava — iz research-griblje/atlas-1825/pv-land-use-1825.json
PV_GRAND = {"joch": 1221, "klafter": 1573}

# p67 Specifischer Ausweis (Endresultate) — branje 2 prehoda
ENDRESULTAT_ROWS = [
    {"no": 1, "kultur": "Aecher", "classe": "I", "joch": 80, "klafter": 842, "crossed": ["1447[?]"]},
    {"no": 1, "kultur": "Aecher", "classe": "II", "joch": 334, "klafter": 120, "crossed": ["234[?]", "1149[?]"]},
    {"no": 2, "kultur": "Wiesen", "classe": "I", "joch": 15, "klafter": 1594, "crossed": []},
    {"no": 2, "kultur": "Wiesen", "classe": "II", "joch": 39, "klafter": 818, "crossed": []},
    {"no": 3, "kultur": "Kleine Gärten", "classe": "C", "joch": 3, "klafter": 615, "crossed": []},
    {"no": 4, "kultur": "Größere Gärten", "classe": "C", "joch": 0, "klafter": 105, "crossed": []},
    {"no": 5, "kultur": "Weingärten", "classe": "C", "joch": 7, "klafter": 42, "crossed": []},
    {"no": 6, "kultur": "Hutweiden", "classe": "C", "joch": 118, "klafter": 702, "crossed": ["449[?]"]},
    {"no": 7, "kultur": "Weiden mit Holznutzen", "classe": "C", "joch": 558, "klafter": 846, "crossed": ["446[?]"]},
    {"no": 8, "kultur": "Baucarea[?]", "classe": "–", "joch": 1, "klafter": 1499, "crossed": ["1144[?]"],
     "label_note": "oznaka dvoumna: možno 'Bracarea' (Brach-land); nič se ne ugiba"},
]
ENDRESULTAT_SUMMA = {"joch": 1132, "klafter": 495, "crossed": ["444[?]"], "source_page": 67}

# §7 Weingärten (p21): "In diese Classe fällt ein Flächenraum von 7 Joch 42 Klafter"
WEINGAERTEN = {
    "einzelne_classe": {"joch": 7, "klafter": 42},
    "red_revision": {"joch": 6, "klafter": 1059, "status": "REVIEW"},
    "mustergrund_parcel_no": "2494[?]",
    "mustergrund_area_klafter": 260,
    "source_page": 21,
    "evidence": "pz-n83/z-weingaerten.jpeg",
}

# strukturni zemljevid 71 strani (PREHOD 1; '–' = splošni besedilni/kont. list)
STRUCTURE = [
    (1, "Naslovna: CATASTRAL-SCHÄTZUNGS-ELABORAT der Gemeinde Grüble, Land Krain, Kreis Neustadtl, Steuerbezirk Krupp, Schätzung District N°83"),
    (2, "§2 Gränzen (meje) + §3 Bevölkerung (prebivalstvo 1830: 441/222/219, 70 hiš, 102 družin)"),
    (3, "§1 Einleitung/Topographie + skupna površina (črno 1235 J 1516 K → rdeče 1220 J 1493 K)"),
    (4, "§4 Viehstand (živina 1830: 124/20/30/150/30) + opombe o reji"),
    (5, "§5/§6 Feld-Culturen; začetek §7 Wege"),
    (6, "§8 Cultivirte/unbenützte/unbenützbare Grundstücke — tabela Einzeln/Zusammen (črne vrednosti = Endresultat, rdeče = revizija)"),
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
    (27, "Flächenraum der Culturarten tabela + podpisi (Holznutzung delež)"),
    (28, "§12 Beweidbare Grundoberflächen + podpis (april 1830[?])"),
    (29, "Zusammenstellung — naslovnica (Sand/Stein?)"),
    (30, "Zusammenstellung — velika ležeča tabela (klase × kulture)"),
    (31, "PROTOCOL — komisijska seja, člani žirije (imena)"),
    (32, "Protocol — nadaljevanje: seštevek kultur + podpisi (9. marec 1830[?])"),
    (33, "Adjunkt/pismo — nadaljevanje"),
    (34, "Protocol (2. seja) — ista žirija"),
    (35, "Rektifikation 1830 — I. Acker (parcelne korekcije)"),
    (36, "Rektifikation — Acker nadaljevanje"),
    (37, "Rektifikation — II. Wiesen (+ Geory Brisko[?] podpis, pečat)"),
    (38, "Rektifikation — III. Brach? Gärten / IV. Untere Gärten"),
    (39, "Rektifikation — nadaljevanje (V/IX/XIV? sklici)"),
    (40, "Rektifikacija zaključek — podpisi + pečat (5./28. april 1830[?])"),
    (41, "Podpisi (nadaljevanje) + datum"),
    (42, "EINWANDS-PROTOKOLL (ugovori) — pečat"),
    (43, "Kataster und Steuer Claffen — I. Classe Reinertragstabelle (parcele)"),
    (44, "II. Classe Reinertragstabelle"),
    (45, "IIa. Classe (2 parcele: N°96 in N°311, QKlf 334[?])"),
    (46, "III. Classe + Kleine Gärten/Weingärten/Hutweiden Ertrags Classe"),
    (47, "Wald und Ödland? Erste Classe + podpisi (16. julij 1829[?])"),
    (48, "COMMUNICATIONS-PROTOKOLL (rožnat papir) — 1830"),
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
    (63, "Zusammenstellung B — ležeča tabela (Renta/Capitalwerth)"),
    (64, "Zusammenstellung A — naslovnica: gesammter Cultur-Aufwand (Acker Wies- und Weinland)"),
    (65, "Zusammenstellung A — ležeča tabela (Culturfonds po kulturah)"),
    (66, "SPECIFISCHER AUSWEIS — naslovnica: Endresultate nach der Catastral Ertragserhebung"),
    (67, "Specifischer Ausweis — ležeča glavna tabela (Flächen/Bruto/Abzug; Summa 1132 J 495 K)"),
    (68, "Protokoll (šedenj?) — 16. april 1829[?]"),
    (69, "Nachlauf — nadaljevanje + podpis"),
    (70, "NACHTRAG zu dem Katastral-Schätzungselaborate — 5. März 1829[?] (Kulturveränderungen)"),
    (71, "Nachtrag — nadaljevanje + 27. März 1829[?]"),
]

# --- Fail-fast invariants (I1–I3) --------------------------------------------

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

# Summa kontrola (NI invarianta — pošteno OPEN najdba F-PZ-04)
rows_j = sum(r["joch"] for r in ENDRESULTAT_ROWS)
rows_k = sum(r["klafter"] for r in ENDRESULTAT_ROWS)
rows_total_qklf = qklf(rows_j, rows_k)
summa_qklf = qklf(**{k: ENDRESULTAT_SUMMA[k] for k in ("joch", "klafter")})
summa_delta_qklf = rows_total_qklf - summa_qklf

# IZRAČUN izpeljanih
area_red_m2 = round(pz_red * M2_PER_QKLFT)
area_pv_m2 = round(pv * M2_PER_QKLFT)

data = {
    "val": 75,
    "pass": "PZ PASS 1 (struktura + ključna branja)",
    "issue": 42,
    "deterministic": True,
    "title": "PZ N83 — Katastral-Schätzungs-Elaborat (Konskripcija) 1828/30 [373419]",
    "method": {
        "source_download": "VAČ vac.sjas.gov.si tifyPdfDownload uodid=373419 docid=41784 (13.154.552 B, 71 strani; TLS veriga nepopolna → python urllib unverified ctx; curl blokiran)",
        "passes": [
            "PREHOD 1: struktura — 8 kontaktnih plošč (sheets/) × 9 strani",
            "PREHOD 2: ključna branja digit-by-digit 2,6×–5× (crops/ + z-*.jpeg dokazni izrezki)",
        ],
        "native_scans": "pz-n83/native/p01–p71.jpeg (pymupdf, metoda val 56)",
        "deterministic": True,
        "no_guessing": "§4: nič se ne ugiba; dvoumne oznake = REVIEW; črne prečrtane vrednosti ohranjene",
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
    "endresultat_p67": {
        "title": "Specifischer Ausweis der nach der Catastral Ertragserhebung entfallenden Endresultate (p66–67)",
        "columns": ["Posten N°", "CultursGattungen", "Classe", "Flächen Maas (Joch | □Klafter)", "Bruto Ertrag (vom J° Joch | im Ganzen)", "Abzug zur Compensation des Culturs-Aufwandes per XI.O.Joch"],
        "rows": ENDRESULTAT_ROWS,
        "summa": ENDRESULTAT_SUMMA,
        "sum_check": {
            "rows_computed_joch": rows_j,
            "rows_computed_klafter": rows_k,
            "rows_computed_total_qklft": rows_total_qklf,
            "summa_written_qklft": summa_qklf,
            "delta_qklft": summa_delta_qklf,
            "closes": summa_delta_qklf == 0,
            "status": "OPEN" if summa_delta_qklf != 0 else "CLOSES",
            "note": "vsota vrstic 1–8 NE enaka zapisani Summi — glej F-PZ-04; možne rešitve: p30 Zusammenstellung / p63/p65 ležeče tabele",
        },
        "evidence": "pz-n83/z-endresultat.jpeg",
    },
    "paragraph8_table_p6": {
        "title": "§8 Cultivirte, unbenützte und unbenützbare Grundstücke (p6)",
        "columns": ["Einzeln (Joch | Klf)", "Zusammen (Joch | Klf)"],
        "observation": "črne 'Einzeln' vrednosti se ujemajo s končnim Endresultatom (p67) pri 7/8 primerljivih vrsticah (Aecher 414 J 962 K prek I+II; Kleine Gärten 3/615; Größere –/105; Weingärten 7/42; Hutweiden 118/702; Weiden mit Holznutzen 558/846) — Wiesen branje '115/872' verjetno '55/812' (REVIEW); rdeče 'Zusammen' = revizijske vrednosti (npr. Weingärten 6 J 1059 K)",
        "evidence": "pz-n83/z-paragraf8-tabela.jpeg",
    },
    "weingaerten": WEINGAERTEN,
    "structure_map": [{"page": p, "content": c} for p, c in STRUCTURE],
    "findings": [
        {
            "id": "F-PZ-01",
            "title": "Skupna površina: dva vira se ujemata na <0,1 %",
            "status": "RESOLVED",
            "detail": f"PZ §1: črno 1235 J 1516 K (prečrtano) → rdeči popravek 1220 J 1493 K = {pz_red:,} QKlft ≈ {area_red_m2/1e6:.3f} km²; PV (val 74): 1221 J 1573 K = {pv:,} QKlft; Δ = {delta_qklf:,} QKlft = {delta_pct:.3f} % — dva neodvisna dokumenta potrdita površino občine; vzrok rezidualnega Δ ostaja UNKNOWN (zaokroževanje vs. ponovna meritev)",
        },
        {
            "id": "F-PZ-02",
            "title": "Prebivalstvo 1830 — prvi časovni korak §20",
            "status": "RESOLVED",
            "detail": "PZ §3 (p2): 222 moških + 219 žensk = 441 duš (aritmetična vrata I1 EXACT), v 70 hišah, 102 družin (Hofesgesessene) po Conscription-Revisions-Resultaten 1830 — podatkovni temelj za prihodnjo §20 arhitekturo (1825 → 1830 → …); še BREZ UI/API sloja",
        },
        {
            "id": "F-PZ-03",
            "title": "Živina 1830 (kraška rejska struktura)",
            "status": "PARTIAL",
            "detail": "PZ §4 (p4): 124 Ochsen + 20 [Kühe|Rosse REVIEW] + 30 Jungvieh + 150 Schafe gesamt + 30 [Lämmer REVIEW] — števci jasni (2 prehoda), oznake vrst delno dvoumne; dopolnitev F-PV-05 (kraška pašniška struktura)",
        },
        {
            "id": "F-PZ-04",
            "title": "Endresultat p67: Summa se ne sešije z vrsticami 1–8",
            "status": "OPEN",
            "detail": f"vsota vrstic 1–8 = {rows_j} J {rows_k} K = {rows_total_qklf:,} QKlft; zapisana Summa = 1132 J 495 K = {summa_qklf:,} QKlft; Δ = {summa_delta_qklf:,} QKlft (~27,8 Joch). Nič se ne vsiljuje (§4); rešitvene poti: p30 Zusammenstellung, p63/p65 ležeče tabele, ponovni 3. prehod Summe",
        },
        {
            "id": "F-PZ-05",
            "title": "Meje občine (§2 Gränzen)",
            "status": "REVIEW",
            "detail": "PZ §2 (p2): severno Kreising[?], vzhodno Kolpa + Adelschitz[?], južno Weidendorf[?], zahodno Tröbusche[?] + Kreising[?] — berljivost zmerljiva; topokonimi ostajajo REVIEW (razrešitev: PR Opis meje re-read); 'Weidendorf' kryža F-A05-01 (val 66)",
        },
        {
            "id": "F-PZ-06",
            "title": "Weingärten 1828/30: 7 J 42 K, rdeča revizija 6 J 1059 K",
            "status": "RESOLVED",
            "detail": "PZ §7 (p21): 'Einzige Classe — Flächenraum von 7 Joch 42 Klafter', Mustergrund parcela N°2494[?] (260 Klf[?]); Joch števec 7 = PV Wein-Gärten 7 J (val 74) → potrditev; rdeča revizija 6 J 1059 K kaže zmanjšanje (~583 QKlft) — datum revizije UNKNOWN",
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
            "detail": "PZ Endresultat: 'Weiden mit Holznutzen' 558 J 846 K = 896.646 QKlft ≈ 3,224 km² kot lastna kategorija; ločenih 'Waldungen' v Endresultatu NI. PV (1825): 'Wälder' = 0 kot formalna kategorija. → napetost PV(0) vs PS(13 Wald parcel) dobi razlago: gozdno-pašniška (silvopastoralna) raba — lesna paša, ne zaprt gozd. Per-parcelni 'Wald' izrazi iz PS ostajajo dokumentirani, ne preimenovani (§5); celotna preverba čaka PS p56–143",
        },
        {
            "id": "F-PZ-09",
            "title": "Revizija pokritosti PS: vrstice pokrivajo SAMO p3–55",
            "status": "RESOLVED",
            "detail": "ps-n83/register.json: 1073 vrstic = p3–55 (53 listov); p56–143 (88 listov) NISO prepisani v vrstice — opomba '143/143 strani' v coverage se nanaša na strukturni re-read (val 61), ne na vrstični prepis. F-PV-03 (vinogradi v PS p56–143) ostaja OPEN in ne-preverljiv brez VAČ; korekcija besedila v source-coverage (ta val)",
        },
    ],
    "invariants_enforced": ["I1 prebivalstvo 222+219=441 (fail-fast)", "I2 površina PZ↔PV < 1 % (fail-fast)", "I3 Endresultat struktura 10 vrstic (fail-fast)"],
    "invariant_violations": [],
    "generated_at": datetime.now(timezone.utc).isoformat(),
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"OK → {OUT}")
print(f"  I1 prebivalstvo: 222+219=441 ✓")
print(f"  I2 površina: PZ rdeči {pz_red:,} vs PV {pv:,} QKlft (Δ {delta_pct:.3f} %) ✓")
print(f"  I3 Endresultat: 10 vrstic ✓ | Summa check: OPEN (Δ {summa_delta_qklf:,} QKlft — F-PZ-04)")
print(f"  najdbe: {len(data['findings'])} (RESOLVED {sum(1 for x in data['findings'] if x['status']=='RESOLVED')}, PARTIAL {sum(1 for x in data['findings'] if x['status']=='PARTIAL')}, REVIEW {sum(1 for x in data['findings'] if x['status']=='REVIEW')}, OPEN {sum(1 for x in data['findings'] if x['status']=='OPEN')}, TO_VERIFY {sum(1 for x in data['findings'] if x['status']=='TO_VERIFY')})")
