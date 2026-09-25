#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 66 — ISSUE #42 §7 PASS 4b: A02–A05 BUILDING COVERAGE v1 (a02-a05-building-inventory-1825.json)

Inventar objektov na listih A02–A05 (uodid 227668/227670/227671/227673, k.o. N83 Griblje)
po protokolu 2 neodvisnih prehodov (vzor val 61/65):
  PREHOD A  — sistematična mreža 2x (oziroma 1.9x) čez cel list
  PREHOD B  — drugačna razdelitev z odmikom (250,260/270), ni sidrana na A
  T         — naslovni pas (identiteta lista: numeral, O.IX.24x koda, napis)
  R         — ciljani izrezki (3x–6x) za nasprotujoča si branja
  R2        — super-zoom 6x za dvomljive glife
Brez VLM klicev; branje = glavni agent direktno preko orodja za slike.

Pravila (issue #42 §7/§8, §12; §5 ne-prepiši-brez-dokaza):
  - "ni identificirano" ≠ "ni obstajalo" → UNIDENTIFIED/UNREADABLE ostanejo
  - ne ustvarjaj podatka iz slabe slike → vrednosti @<5x so VTISKI, ne podatki
  - vas na A02 = ISTA vas kot na A01 (družina listov, KG-F05) → CORROBORATION_ONLY,
    ni dupliranja MAP_OBJECT; samo @6x berljive glife = novi objekti
  - val 42 Traverne/vas-50-60-hiš branja ohranjena KOT alternativna (ne prepisana),
    ob njih val 66 branja z izrecnim statusom
"""

import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

# sheet identity (T-pass + R kontrola + val 42 zapisi)
SHEETS = {
    "A02": {
        "uodid": 227668, "raster": "raw-web-val42-2026-10/n083a-pages/a227668.jpg", "px": [3010, 2158],
        "section_numeral": "II", "series_code": "O.IX.24ci",
        "title_inscription": "Siche die Reambullirungs Beimappe",
        "annotation_2x_val66": "S'.Veith ist keine Ortschaft",
        "annotation_val42": "St.Veith als eine Obrigkeit",
        "annotation_status": "UNRESOLVED (dve branji; glej F-A02-01)",
        "reviser": "Hauptmann Inspector von Hilmayr (R-A04-v-r2c1 analogno tudi A02 b-r2c1)",
        "surveyor": "Wukangigk (val 42)",
        "boundaries": {"W": "KRASSINZ (velike črke; Krasinec)", "E": "KÖNIGREICH CROATIEN + Kolpa (rdeča državna meja)"},
        "content_zone_px": "vas+cerkev NE (~1750–2560, 300–1240); polja s tmp drevesi sicer",
        "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227668",
    },
    "A03": {
        "uodid": 227670, "raster": "raw-web-val42-2026-10/n083a-pages/a227670.jpg", "px": [2645, 2154],
        "section_numeral": "III", "series_code": "O.IX.24dg",
        "title_inscription": "Siche die Reambullirungs Beimappe",
        "reviser": "Hauptmann Inspector von Hilmayr (b-r2c1)",
        "surveyor": "Wullangjish|Wukangigk (variantnebranja)",
        "boundaries": {"W": "TRIBUTSCH(E) (velike črke, smer branja UNRESOLVED)", "S": "WEIDENDORF|WEIDENDORE"},
        "content_zone_px": "ozki vzhodni trak (~1780–2645, 0–2050); leva polovica lista PRAZEN papir",
        "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227670",
    },
    "A04": {
        "uodid": 227671, "raster": "raw-web-val42-2026-10/n083a-pages/a227671.jpg", "px": [2645, 2158],
        "section_numeral": "IV", "series_code": "O.IX.24cg",
        "title_inscription": "Siche die Reambullirungs Beimappe",
        "reviser": "Hauptmann Inspector von Hilmayr (v-r2c1 @1.9x)",
        "surveyor": "Wullangjish (varianta)",
        "boundaries": {"S": "WEIDENDORF (natisnjeno, z F)", "E/SE": "ADLESCHITZ (velike črke)"},
        "content_zone_px": "cel list (~0–2645, 0–2050); gost droben parcelgat; brez stavb (NF-A04-01)",
        "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227671",
    },
    "A05": {
        "uodid": 227673, "raster": "raw-web-val42-2026-10/n083a-pages/a227673.jpg", "px": [2634, 2165],
        "section_numeral": "V", "series_code": "O.IX.24ch",
        "title_inscription": "Siche die Reambullirungs Beimappe",
        "reviser": "Hauptmann Inspector von Chlumetzky (val 42)",
        "surveyor": "Wukangigk (val 42)",
        "boundaries": {"W/S": "WEIDENDORF (črke W-A-I-D-E-N-D-O…; popravek val 42 'WAUENDORF' — F-A05-01)",
                        "E/N": "ADLESCHITTEN (črke L-E-S-C-H-I-T-T-E-N)"},
        "content_zone_px": "zgornji pas (~1000–2290, 60–680); spodnjih 2/3 lista PRAZEN papir",
        "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=227673",
    },
}

# ---------------------------------------------------------------------------
# OBJEKTI (ročno branje; px v osnovnem rasterju vsakega lista)
# tier: CLEAR (struktura simbol/6x) | PROBABLE | CANDIDATE | UNREADABLE | UNRESOLVED
# position_precision: R-precizno ±8–15 px; sicer ±100–150 px (ocena iz ploščic)
# ---------------------------------------------------------------------------
OBS = [
    # --- A02 ---
    ("A02", "MO-A02-001", None, 1975, 570, 15, "CLEAR", "dark", "church",
     "rdeče-rjava stavba s TEMNIM KRIŽEM na strehi, ob cestišču; zeleno okolico (cerkvena parcela)",
     ["A-A02-v-r1c3", "B-A02-b-r1c2", "R-A02-church"],
     "CERKEV sv. Vid (St. Veith) — najdba F-A02-02: na A01 ni (NF-A01-01), ker A01 odreže NW rob; natisnjena labela 'St Veith' + annotacija (F-A02-01); parcela ob nji rdeče ~1639 (neberljivo)"),
    ("A02", "MO-A02-002", "12", 2339, 839, 8, "CLEAR", "dark", "dwelling",
     "temna glifa '12.' s piko na belem stolp isto stavbi v južnem delu vasi",
     ["R-A02-village-s", "R2-A02-glyphs-e1"],
     "BP kandidat 12 (PT range 1–100) — bp_cross REVIEW: A01↔A02 sidro NI vzpostavljeno, merge prepovedan (§5); prva @6x berljiva nizka glifa"),
    ("A02", "MO-A02-003", "20", 2343, 923, 8, "PROBABLE", "dark", "dwelling",
     "temna glifa '20' na stavbi južno od 12",
     ["R-A02-village-s", "R2-A02-glyphs-e1"],
     "BP kandidat 20; ena @6x poteza + 3x vtis '20|24'"),
    ("A02", "MO-A02-004", "22", 2253, 925, 10, "PROBABLE", "dark", "dwelling",
     "temna glifa '22|42' na stavbi v jugozahodnem delu vasi",
     ["R2-A02-glyphs-w2"],
     "BP kandidat 22; @6x delno berljivo"),
    ("A02", "MO-A02-005", None, 2512, 1518, 12, "CLEAR", "outline", "outbuilding",
     "kvadraten ORISAN (ne-polnjen) objekt ~10x10 px v poljih JV od vasi; temna glifa neberljiva ('641|541?')",
     ["R-A02-cottages"],
     "kmetijska stavba/koca; glifa UNREADABLE tudi @4x — 'ni identificirano' ≠ 'ni obstajalo'"),
    ("A02", "MO-A02-006", None, 2515, 1564, 12, "CLEAR", "outline", "outbuilding",
     "drugi kvadratni orisani objekt tik JV od 005; glifa neberljiva ('645|545?')",
     ["R-A02-cottages"],
     "ista skupina kot 005"),
    ("A02", "MO-A02-007", None, 2594, 1589, 12, "CLEAR", "outline", "outbuilding",
     "tretji kvadratni orisani objekt vzhodneje, ob poti; rdeča glifa '1785?' neberljiva",
     ["R-A02-cottages"],
     "rdeča = parcelna plast; objekt sam temen oris"),
    ("A02", "MO-A02-008", None, 2476, 921, 15, "CLEAR", "orange", "farm_building_unclassified",
     "VELIKA oranžno-rdeča stavba (kompleks) v poljih JV od vasi; rdeče številke neberljive",
     ["R-A02-village-s"],
     "največja stavba izven vaškega jedra na A02; funkcija NI rešena (gospodarsko poslopje?)"),
    # --- A05 ---
    ("A05", "MO-A05-001", None, 2160, 450, 60, "REVIEW", "dark", "vineyard_district_group",
     "GOST klaster podolgovatih vinogradniških trakov (oranžni) z ~8–15 drobnimi temnimi kocami/hišicami; glife posameznih koč NEBERLJIVE @2634px",
     ["A-A05-v-r1c3", "A-A05-v-r1c4", "B-A05-b-r1c2", "R-A05-cluster-e"],
     "najdba F-A05-02: val 42 'vas ~50–60 hiš' = napaka — so vinogradniški trakovi s kocami (Weinberghütten); toponim 'Pri Jankovich'; NE posamezne MO koče — grupni zapis"),
    ("A05", "MO-A05-002", None, 2234, 652, 15, "CLEAR", "yellow", "square_parcel_unclassified",
     "velik rumeno-templates kvadraten parcel (~50x48 px) z rdečo glifo '2445|2455?' neberljivo",
     ["R-A05-cluster-e"],
     "funkcija ni rešena (gospodarsko dvorišče/hozha?); brez notranje stavbe @5x"),
]

# ---------------------------------------------------------------------------
# NEGATIVNE KONTROLE (vsaka = R/R2 preverjena ali 2-prehodno pokrita cona)
# ---------------------------------------------------------------------------
NEGATIVE_FINDINGS = [
    {"id": "NF-A03-01", "sheet": "A03",
     "finding": "List III: NIČ stavb (cel list 2-prehodno: A 6 ploščic + B 4 ploščice); vsebina = ozki vzhodni trak parcel 1800–1966 + travniki; na praznem papiru samo križni napis TRIBUTSCH(E) + pripomba 'grüble'",
     "implication": "sekcija III = čista njivska/travniška sekcija brez zgradb @raster ločljivost"},
    {"id": "NF-A04-01", "sheet": "A04",
     "finding": "List IV: NIČ stavb na k.o. strani (8 ploščic 2 prehoda + 7 R/R2 kontrol); potrjen val 42 'brez stavbnih oznak'; kandidata 'Rinn stavba' + 'na Rebar koče' ZAVRJENA @5–6x (parcelni orisi/arteftakti)",
     "implication": "sekcija IV = njive/vinogradi brez zgradb @raster ločljivost; nizke rdeče številke 2230–2650 = parcele"},
    {"id": "NF-A05-01", "sheet": "A05",
     "finding": "List V: NI naselja 50–60 hiš (val 42 napačno) — gost oranžen klaster = podolgovati vinogradniški trakovi; posamezne koče so drobne (5–18 px) in številčno neberljive",
     "implication": "F-A05-02; 'ni identificirano' ≠ 'ni obstajalo' tudi za koče"},
    {"id": "NF-A02-01", "sheet": "A02",
     "finding": "'Trikotnik' ob toponimu Pod Schuatinikom (prehod A/B) = @6x drevesa + rdeče parcele — NI simbol/stavba",
     "implication": "negativna kontrola — preprečen lažen vnos"},
    {"id": "NF-A04-02", "sheet": "A04",
     "finding": "simbol '▣' ob 'Na Bresle' leži IZVEN rdeče meje (stran ADLEŠIČI) — droben kvadrat ~12x9 px = mejni kamen/majhen objekt soseda, NI stavba k.o. Griblje",
     "implication": "izven-k.o. simbol zapisan, ne vključen v MO inventar"},
]

# ---------------------------------------------------------------------------
# MEJNE TOČKE (številčena serija — povezava na PR Grenz-Beschreibung No.1–21)
# ---------------------------------------------------------------------------
BOUNDARY_POINTS = [
    {"point": "N°1", "sheet": "A02", "reading": "Pri Pistami Pelach N°1", "reading_variants": ["Při Pistámi Petsch N°1"],
     "boundary_run": "KRASSINZ (zahod)", "px_estimate": [400, 720], "precision": "±120", "status": "VERIFIED_FORM"},
    {"point": "N:2", "sheet": "A03", "reading": "We…tic Cnt. N:2", "reading_variants": ["Weißic Era N.1 (prehod A)", "Weilte Era N:2"],
     "boundary_run": "TRIBUTSCH(E) (zahod)", "px_estimate": [1830, 110], "precision": "±80", "status": "UNREADABLE-2 (R @6x)"},
    {"point": "N:3", "sheet": "A03", "reading": "Na Lubetschen Berdu N:3", "reading_variants": ["Berdv N.3 (prehod A — krajša oblika)"],
     "boundary_run": "TRIBUTSCH(E) → WEIDENDORF kot", "px_estimate": [1820, 1620], "precision": "±100", "status": "VERIFIED_FORM"},
    {"point": "N:4|N:2", "sheet": "A04", "reading": "N°2 Zerrouz", "reading_variants": ["N°4 Zerrouz (Kurrent 2|4)"],
     "boundary_run": "WEIDENDORF (jug)", "px_estimate": [2190, 637], "precision": "±120", "status": "UNRESOLVED (številka)"},
    {"point": "N:5|N:3", "sheet": "A04", "reading": "N°. Lescheinig bei …", "reading_variants": ["N°3 Lescheinig (prehod A)", "N°5 Lescheinig (prehod B)"],
     "boundary_run": "WEIDENDORF (jug, ob cesti Schumshi Damm)", "px_estimate": [1700, 1900], "precision": "±150", "status": "UNRESOLVED (številka + drugi člen)"},
    {"point": "N:6", "sheet": "A04", "reading": "N°6 Sa Lose.", "reading_variants": ["N°6 Za Loso."],
     "boundary_run": "WEIDENDORF (jug, SZ kot)", "px_estimate": [210, 1753], "precision": "±80", "status": "VERIFIED_FORM"},
    {"point": "N°8", "sheet": "A05", "reading": "Schimshu Dravi N°8", "reading_variants": ["Schumsthl Traverne (val 42, 3× VLM @4x, izrezek odrezan pri x=1145)", "Schimshu Draei v.Ss (prehod A @2x)"],
     "boundary_run": "WEIDENDORF (zahod, A05)", "px_estimate": [1140, 578], "precision": "±30 (R-A05-traverne2 @5x)", "status": "UNRESOLVED — F-A05-04"},
    {"point": "N°9", "sheet": "A05", "reading": "Scetatschli N°9", "reading_variants": ["Scetalschli N.9.", "Vratatschitsch Dg. (val 42)"],
     "boundary_run": "A05 notranjost", "px_estimate": [1690, 555], "precision": "±120", "status": "UNRESOLVED"},
    {"point": "N°3?", "sheet": "A05", "reading": "N°3 Na Scetatschki Schleb.", "reading_variants": ["N:33? — številka dvomljiva"],
     "boundary_run": "WEIDENDORF/ADLESCHITTEN (A05)", "px_estimate": [2180, 625], "precision": "±120", "status": "UNRESOLVED"},
]

# ---------------------------------------------------------------------------
# TOPONIMI (opazovanja na listih — za prihodnji merge v toponym-register)
# ---------------------------------------------------------------------------
TOPONYM_OBSERVATIONS = [
    {"sheet": "A02", "reading": "U Dollyze", "kind": "field_area", "status": "VERIFIED_FORM"},
    {"sheet": "A02", "reading": "Malo Crtich", "variants": ["Malo Grič?"], "kind": "field_area_with_symbol",
     "status": "UNRESOLVED (simbol @6x = drevo/velik kamen, ni stavba)"},
    {"sheet": "A02", "reading": "Boschińskiü", "variants": ["Boškovići? (val 42)"], "kind": "field_area", "status": "VERIFIED_FORM"},
    {"sheet": "A02", "reading": "Rebar", "variants": ["Bobar (val 42 prehodu A)"], "kind": "area", "status": "UNRESOLVED"},
    {"sheet": "A02", "reading": "Gostwülize", "variants": ["Gostilice?"], "kind": "area_near_boundary",
     "status": "UNRESOLVED (brez stavbe — gostilniška semantika NI dokazana)"},
    {"sheet": "A02", "reading": "Pod Schuatinikom", "variants": ["Schuatinikam (prehod A)", "Pod Sematschem (val 42)"],
     "kind": "area", "status": "VERIFIED_FORM-V66 (2 prehoda + R)"},
    {"sheet": "A02", "reading": "Sultania", "variants": ["Vultania?"], "kind": "field_area", "status": "UNRESOLVED"},
    {"sheet": "A02", "reading": "Zeschüza", "kind": "riverbank_corner", "status": "UNRESOLVED (ob Kolpi, mejni kot)"},
    {"sheet": "A03", "reading": "Na Sternicz", "variants": ["Na Stomoz (val 42)"], "kind": "field_area", "status": "UNRESOLVED"},
    {"sheet": "A03", "reading": "na Berdi", "kind": "field_area", "status": "VERIFIED_FORM (2 prehoda)"},
    {"sheet": "A03", "reading": "Lubize", "variants": ["Lubige (val 42)"], "kind": "field_area", "status": "UNRESOLVED"},
    {"sheet": "A03", "reading": "grüble (kurzivna pripomba s simbolom na praznem papirju)", "kind": "cross_reference_note",
     "status": "VERIFIED_FORM (R @6x) — kaže na vas/list z vasjo"},
    {"sheet": "A04", "reading": "Schuahiwiz", "variants": ["Schuhaviez (val 42)"], "kind": "field_area", "status": "UNRESOLVED"},
    {"sheet": "A04", "reading": "Br'esnik + na Bresnik", "variants": ["Bresniki (val 42)"], "kind": "area", "status": "VERIFIED_FORM (natisnjeno + kurzivno)"},
    {"sheet": "A04", "reading": "Schumshi Damm", "variants": ["Schunshi Diani (prehod B)", "Schumski Damm (val 42)"],
     "kind": "road_crossing", "status": "VERIFIED_FORM — koren 'Schums-' = ista kot A05 'Schimshu/Schumsthl' (F-A05-04 kontekst)"},
    {"sheet": "A04", "reading": "na Bresto", "kind": "field_area", "status": "UNRESOLVED"},
    {"sheet": "A04", "reading": "na Bresle", "kind": "area_OUTSIDE_ko (stran Adlešiči)", "status": "VERIFIED_FORM (z ▣ simbolom)"},
    {"sheet": "A04", "reading": "S.V. Gotina", "variants": ["Gotna? (val 42)"], "kind": "area", "status": "UNRESOLVED"},
    {"sheet": "A05", "reading": "Pri Jankovich", "kind": "vineyard_district", "status": "VERIFIED_FORM (2 prehoda)"},
    {"sheet": "A05", "reading": "Stüze Wardianove", "variants": ["Sliize Wardianove (prehod A)", "Stüze Vardianove (val 42)"], "kind": "area", "status": "UNRESOLVED"},
    {"sheet": "A05", "reading": "Na Dragi Žoleg", "variants": ["Na Prago Zdolcg (val 42)"], "kind": "boundary_corner", "status": "UNRESOLVED"},
]

FINDINGS = [
    {"id": "F-A02-01", "status": "UNRESOLVED",
     "finding": "naslovna annotacija A02 ob 'St Veith': val 66 @2x 'S'.Veith ist keine Ortschaft' vs val 42 'St.Veith als eine Obrigkeit' — dve nasprotujoči si branji istega rokopisa",
     "what_would_resolve": "re-read @višji dpi (VAČ original) / paleograf; do takrat obe branji zapisani (§5)"},
    {"id": "F-A02-02", "status": "RESOLVED-V66",
     "finding": "CERKEV sv. Vid (St. Veith) je s cerkvenim križem NASLIKANA na A02 (~1975,570) — cerkvena stavba je s tem MAP_OBJECT; na A01 je ni (NF-A01-01), ker A01 (detajlni list vasi) odreže NW rob z cerkvijo",
     "action": "MO-A02-001 + DEPICTED_ON SRC-A02; muzejski pomen: prva kartografska lokacija cerkve v zbirki"},
    {"id": "F-A02-03", "status": "RESOLVED-V66",
     "finding": "vas na A02 = ISTA vas kot na A01 (družina listov KG-F05; natisnjena labela 'Grüble' ~1980–2200, 822–879); A02 ponuja več temnih glif vasi, od tega sta @6x berljivi '12.' (CLEAR) in '20' (PROBABLE) + '22' (PROBABLE) — prve glife iz range 1–29, ki na A01 ni bil lociran",
     "action": "samo berljive glife = novi MO (002–004) z bp_cross REVIEW; vse ostale A02 glife = corroboration-only (ni dupliranja); merge v BP matrico PREPOVEDAN brez A01↔A02 sidra"},
    {"id": "F-A03-01", "status": "RESOLVED-V66",
     "finding": "sekcija III = brez stavb (NF-A03-01); parcelna numeracija 1800–1966 se NEKAZNOVANO nadaljuje na IV (1967+) — numeracija je k.o.-vezana prek listov III→IV",
     "action": "dokumentirano v sheet identity; podpora KG-F05 hipotezi o numeraciji"},
    {"id": "F-A04-01", "status": "RESOLVED-V66",
     "finding": "sekcija IV = brez stavb na k.o. (potrjen val 42); 2 lažna kandidata zavrhjena z R/R2 (Rinn 'stavba' = artefakt; na Rebar 'koče' = parcelni orisi z drevesi)",
     "action": "NF-A04-01; negativne kontrole dokumentirane"},
    {"id": "F-A05-01", "status": "RESOLVED-V66",
     "finding": "zahodna/južna meja A05 se bere W-A-I-D-E-N-D-O(R) = WEIDENDORF (isti sosed kot A03/A04) — val 42 'WAUENDORF' je bila napačna identifikacija sosedne k.o.",
     "action": "sheet identity A05 popravljen; val 42 branje ohranjeno kot variant"},
    {"id": "F-A05-02", "status": "RESOLVED-V66",
     "finding": "'vas ~50–60 hiš' na A05 (val 42) = NAPAKA — gost oranžen klaster so podolgovati vinogradniški trakovi z drobnimi kocami (Weinberghütten), posamezne koče številčno neberljive @2634px",
     "action": "NF-A05-01 + MO-A05-001 grupni zapis; vrednost za zgodbo MVG: količnik vinogradništva, ne naselja"},
    {"id": "F-A05-03", "status": "OPEN",
     "finding": "mejni zapisi z N°-številkami (N°1 A02, N:2/N:3 A03, N:4|2?/N:5|3?/N:6 A04, N°3?/N°8/N°9 A05) = verjetno točke iz PR Grenz-Beschreibung (No.1–21) — prva kartografska vezava PR↔zemljevid",
     "what_would_resolve": "PR re-read @300dpi (tabela točk No.1–21 s imeni) + primerjava imen; ob kvoti"},
    {"id": "F-A05-04", "status": "UNRESOLVED — dve branji",
     "finding": "napis ob zahodnem kotu A05: val 42 'Schumsthl Traverne' (3× VLM @4x, izrezek odrezan pri x=1145 — rep napisa ni bil viden!) vs val 66 'Schimshu Dravi N°8' (3 prehoda @1.6/2/5x, cel napis; rep = številka mejne točke). Če je pravilno val 66 branje, je 'Traverne' (gostilna) niz napisa za mejno točko in MVG-109 gostilniški signal SE OSLABI",
     "what_would_resolve": "re-read @višji dpi / paleograf; PR p. re-read (ali je 'Schimshu Dravi' med točkami?) — do takrat obe branji, NI vgrajeno v muzejske podatke (§7)"},
]

# ---------------------------------------------------------------------------
# VAS NA A02 — corroboration zapis (ni dupliranja MO!)
# ---------------------------------------------------------------------------
VILLAGE_A02_CORROBORATION = {
    "matched_to": "atlas-1825/a01-building-inventory-1825.json (ista vas, list z večjim merilom)",
    "label_printed": "Grüble (~1980–2200, 822–879)",
    "village_extent_px": [2196, 754, 2515, 1235],
    "scale_note": "A02 merilo ~0.4× A01 (vas ~310 px na A02 vs ~750 px na A01) — točno merilo NI rešeno (KG-F05)",
    "glyph_impressions_3x": ["10|11|12|14|16|20|24|30|31|38|40|41|90|98 — VTISKI prehoda A/B, NISO podatki (§12)"],
    "glyph_readable_6x": [{"value": "12.", "tier": "CLEAR", "object_id": "MO-A02-002"},
                           {"value": "20", "tier": "PROBABLE", "object_id": "MO-A02-003"},
                           {"value": "22", "tier": "PROBABLE", "object_id": "MO-A02-004"}],
    "hamlet_north": "zaselek/vaški sever ob cerkvi (~2046–2250, 453–610) z temnimi glifami (vtisi 94|97|91|22|3|9 — neberljive); verjetno = A01 BP 86–100 cona, povezava ni sidrana",
    "decision": "CORROBORATION_ONLY — A02 vas NI duplirana v MAP_OBJECT; samo 3 @6x berljive glife = novi objekti",
}

CROPS_MANIFEST = {
    "A": {"A02": "4x2 @2x", "A03": "3x2 @1.9x", "A04": "3x2 @1.9x", "A05": "4x2 @2x"},
    "B": {"A02": "3x2 @1.6x offset(250,260)", "A03": "2x2 @1.6x offset(260,270)",
           "A04": "2x2 @1.6x offset(260,270)", "A05": "3x2 @1.6x offset(250,260)"},
    "T": "naslovni pas 2 izrezka/list @2.2x + A01 kot @2.5x",
    "R": "25 ciljnih izrezkov 3x–6x (R-A02-* 8, R-A03-* 3, R-A04-* 7, R-A05-* 6, R-A01-title)",
    "R2": "4 super-zoom 6x na A02 vas glife + R-A05-traverne2/3",
}

def main():
    objects = []
    for sheet, oid, bp, px, py, prec, tier, layer, btype, footprint, crops, notes in OBS:
        sh = SHEETS[sheet]
        obj = {
            "object_id": oid,
            "sheet": sheet,
            "uodid": sh["uodid"],
            "section_numeral": sh["section_numeral"],
            "bp_glyph": bp,
            "bp_cross_status": ("REVIEW — možen BP %s (PT 1–100); A01↔A02 sidro ne obstaja, merge prepovedan (§5)" % bp) if bp else None,
            "glyph_tier": tier,
            "glyph_layer": layer,
            "building_type": btype,
            "footprint_note": footprint,
            "px": [px, py],
            "position_precision_px": prec,
            "lat": None, "lng": None,
            "georef_status": "UNKNOWN (ni sidra za A02–A05; izračun lat/lng bi bil izmišljotina — §12)",
            "source_crops": crops,
            "notes": notes,
        }
        objects.append(obj)

    counts = {
        "objects_v66": len(objects),
        "by_sheet": {"A02": sum(1 for o in objects if o["sheet"] == "A02"),
                      "A03": sum(1 for o in objects if o["sheet"] == "A03"),
                      "A04": sum(1 for o in objects if o["sheet"] == "A04"),
                      "A05": sum(1 for o in objects if o["sheet"] == "A05")},
        "with_bp_glyph": sum(1 for o in objects if o["bp_glyph"]),
        "negative_findings": len(NEGATIVE_FINDINGS),
        "boundary_points": len(BOUNDARY_POINTS),
        "toponym_observations": len(TOPONYM_OBSERVATIONS),
        "buildings_a03_a04": 0,
    }

    out = {
        "val": 66,
        "pass": "4b",
        "issue": "42 §7 (A02–A05 building coverage)",
        "title": "A02–A05 BUILDING INVENTORY v1 — 2-prehodno agentovo branje brez VLM",
        "method": {
            "protocol": "2 neodvisna prehoda (A: mreža 2x/1.9x, B: odmik 1.6x) + T naslovi + R 3x–6x + R2 6x",
            "reader": "glavni agent (orodje za branje slik), brez VLM API klicev",
            "crop_script": "research-griblje/atlas-1825/pass4b/make-a02a05-crops.py (deterministično, regenerabilno; R/R2 dodani posebej)",
            "position_convention": "px v osnovnem rasterju vsakega lista; precision_px izrecno per objekt",
            "no_data_rule": "vtisi @<5x so zapisani kot VTISKI (glyph_impressions), ne kot vrednosti (§12)",
        },
        "sheets": SHEETS,
        "provenance": {
            "rastri": "val 42 (n083a-pages/, IIIF P3, docid 10)",
            "a01_inventory": "atlas-1825/a01-building-inventory-1825.json (val 65 — referenca za corroboration)",
            "val42_readings": "research-griblje/56-val42-kataster-n83-complete-research.md (ohranjene kot alternative)",
            "crops": CROPS_MANIFEST,
        },
        "counts": counts,
        "objects": objects,
        "village_a02_corroboration": VILLAGE_A02_CORROBORATION,
        "negative_findings": NEGATIVE_FINDINGS,
        "boundary_points": BOUNDARY_POINTS,
        "toponym_observations": TOPONYM_OBSERVATIONS,
        "findings": FINDINGS,
        "research_gaps": [
            {"gap_id": "RG-001", "status": "RESOLVED-V66",
             "missing_relation": "MAP_OBJECT inventory (A01–A05 objekti)",
             "current_result": "vseh 5 listov inventariziranih v1: A01 24 objektov + 56 prior-only (val 65); A02 8 objektov (vključno s cerkvijo + 3 BP kandidati 12/20/22); A03 0 (negativna); A04 0 (negativna); A05 2 (klaster + kvadratni parcel)",
             "next_source": "georef sidra za A02–A05; višji dpi re-readi (BP glife vasi A02, koče A05, naslovne annotacije); PR re-read za mejne točke"},
        ],
        "generated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    dst = os.path.join(BASE, "a02-a05-building-inventory-1825.json")
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"OK -> {dst}")
    print(json.dumps(out["counts"], ensure_ascii=False))


if __name__ == "__main__":
    main()
