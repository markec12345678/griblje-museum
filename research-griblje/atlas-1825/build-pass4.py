#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 65 — ISSUE #42 §7 PASS 4: A01 BUILDING COVERAGE v1 (a01-building-inventory-1825.json)

Inventar objektov na katastrskem listu A01 (uodid 227666, "Gemeinde GRÜBLE in Illyrien",
izmera 1824, korekcije 1827) po protokolu 2 neodvisnih prehodov (vzor ps-n83 re-read, val 61):
  PREHOD A  — mreza 3x po vasicnem jedru (6 ploščic)
  PREHOD B  — kvadranti 2.5x + zunanji objekti + kontekst (drugačna razdelitev, ne-sidrano)
  R         — ciljani 4x izrezki za nasprotujoča si branja
  R2        — super-zoom 6x za dvomljive glife
Brez VLM klicev (kvota 429); branje = glavni agent direktno preko orodja za slike.

Viri join-a (vsi deterministični):
  - src/data/cadastre-a01.json          (56 stavb, val 52+54+56) → px_prior + house_no povezave
  - atlas-1825/bp-house-reconciliation  (BP 1-100 matrica, val 57)
  - atlas-1825/house-register-1825.json (owners.a01 veze, val 54/56/57)
  - atlas-1825/parcel-register-1825.json (PUA sec I/II parcelne številke → house_refs)

Pravila (issue #42 §7/§8, §12):
  - "ni identificirano" ≠ "ni obstajalo" → UNIDENTIFIED objekti + NOT_LOCATED BP ostanejo
  - ne ustvarjaj podatka iz slabe slike → CLEAR / PROBABLE / CANDIDATE / UNREADABLE / UNRESOLVED
  - vsaka opazovana številka = glyoh zapis s pozicijo + virom (izrezek) + PUA preverkom
  - px_prior ohranjen (nikoli prepišan); razglasimo DISAGREE z delta, ne utiho
"""

import json
import math
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

RASTER = {"file": "raw-web-val42-2026-10/n083a-pages/a01.jpg", "px": [2826, 2273]}
GEO = {  # iz src/data/cadastre-a01.json meta.georef (PROVIZORIČNO — 1 sidro, sever-navzgor)
    "anchor_px": [1851, 1778],
    "anchor_geo": [45.57246, 15.29257],
    "meters_per_px": 2.1909,
    "accuracy": "PROVIZORIČNO: ±200–500 m na robovih (rotacija lista ni rešena)",
}

# ---------------------------------------------------------------------------
# OPAZOVANJA (ročno branje, 2 prehoda + R/R2 kontrola; px = glifa/stavba na 2826x2273)
# tier: CLEAR (6x/2-prehoda) | PROBABLE (en prehod jasen) | CANDIDATE (delna glifa)
#       UNREADABLE (glifa prisotna, vrednost neberljiva) | UNRESOLVED (več nasprotujočih branj)
# ---------------------------------------------------------------------------
OBS = [
    # bp, px, py, tier, layer, btype, footprint, crops, notes
    ("24", 2189, 1341, "CLEAR", "dark", "dwelling",
     "rumena stavba z dvokapno streho v dvorišču BP 94; zraven rdeča glifa 103 (vrtna parcela)",
     ["A-v-r1c2", "B-b-ne", "R-t-94-mine", "R-t-east-100s", "R2-z-yellow-2187-1342"],
     "NOV BP: 1–29 prej vsi neizluščeni (val 52–56: 'drobne gospodarske stavbe'); 6x branje '24' jasno"),
    ("94", 2176, 1402, "CLEAR", "dark", "dwelling",
     "bela (zidana?) dvokapna stavba, 2 trakt; prizidek z rdečo glifo 169 (PUA parcela 169 sec I)",
     ["A-v-r1c2", "B-b-ne", "R-t-94-mine", "R2-z-94c-2175-1404", "R2-z-159or109-2185-1428"],
     "glifa '94' jasna @6x; h.40 veza VERIFIED-2x (PT p7 + PUA no.38 p29)"),
    ("91", 2164, 1498, "CLEAR", "dark", "dwelling",
     "rumeno-bela stavba v kompleksu z 93/89; dvokapna",
     ["A-v-r1c2", "B-b-ne", "R-t-87-91", "R2-z-91-2171-1499"],
     "NOV BP (prej med 90–91 'niso izluščeni'); @6x jasno '91'; h.40 CONFLICT (PT p7 91→h.40)"),
    ("98", 2132, 1435, "CLEAR", "dark", "building_unclassified",
     "stavba ob zahodnem robu vzhodne ulice; brez vidnejših tlorisnih posebnosti @4x",
     ["R-t-94-mine", "R-t-94-old", "R2-z-1459-2121-1468"],
     "glifa '98' jasna v 3 izrezkih; PUA p47 no.95 (h.70 Zollamt) opomba 'B.P. 98.' VERIFIED-2x (val 56)"),
    ("89", 2134, 1560, "CLEAR", "dark", "dwelling",
     "bela stavba s prečno dvokapno streho na koncu vzhodne ulice",
     ["B-b-ne", "R-t-87-91", "R2-z-93or94-2169-1538"],
     "glifa '89' jasna; h.44 veza (PT p7 dvojno branje)"),
    ("86", 2088,  1501, "CLEAR", "dark", "outbuilding",
     "manjša stavba ob cestišču zahodno od 88-dvorišča",
     ["R-t-87-91", "R2-z-88-2079-1535", "R2-z-87-2109-1490"],
     "glifa '86' jasna; h.36 konflikt (PUA 'b. P. 56. 38.' p18 ne pokriva 86)"),
    ("82", 2124, 1594, "CLEAR", "dark", "dwelling",
     "bela stavba z rumenim prizidkom, južno od 86",
     ["A-v-r1c2", "R-t-80-84"],
     "glifa '82' jasna @4x; h.45 veza (PT p7 dvojno branje)"),
    ("71", 1986, 1702, "CLEAR", "dark", "dwelling",
     "rumena dvotraktna stavba na zahodnem vhodu v vas",
     ["A-v-r2c1", "B-b-nw"],
     "2 neodvisna prehoda konsistentna (1986,1702)/(1987,1701)"),
    ("56", 1873, 1879, "CLEAR", "dark", "dwelling",
     "bela dvokapna stavba, glifa '56.' s piko",
     ["A-v-r3c1", "B-b-sw", "R-t-57-62", "R2-z-58-1905-1902"],
     "glifa jasna v 2 izrezkih; PUA parcela 56 sec I → house_refs [68]"),
    ("93", 2167, 1538, "PROBABLE", "dark", "dwelling",
     "rumena dvokapna stavba pod 91",
     ["A-v-r1c2", "R-t-80-84", "R2-z-93or94-2169-1538"],
     "druga številka dvomljiva 3|8 @6x; '98' že jasno pri (2132,1435) → 93 verjetneje; h.40 REVIEW"),
    ("100", 2112, 1616, "PROBABLE", "dark", "building_unclassified",
     "glifa '100.' na dvoriščnem prostoru med 82 in vzhodnim robom; vezava na stavbo NEJASNA",
     ["A-v-r2c2", "R-t-80-84"],
     "prior (2081,1392) 224 px stran — možno dve različni '100' (parcela vs BP); glej glyph_catalog"),
    ("79", 1917, 1740, "PROBABLE", "dark", "outbuilding",
     "manjša stavba na zahodnem robu srednjega dela vasi",
     ["A-v-r2c1"],
     "en prehod; vrednost 79|76|78 — zapisano kot PROBABLE 79"),
    ("87", 2109, 1492, "CANDIDATE", "dark", "outbuilding",
     "manjša stavba ob cestišču med 86 in 98; glifa '8' + majhen znak",
     ["R-t-94-mine", "R2-z-87-2109-1490"],
     "NOV kandidat (prej 87–88 'niso izluščeni'); druga številka ni rešena @6x"),
    ("88", 2079, 1535, "CANDIDATE", "dark", "dwelling",
     "bela stavba z rumenim prizidkom v dvorišču zahodno od 89",
     ["R-t-87-91", "R-t-80-84", "R2-z-88-2079-1535"],
     "NOV kandidat; dvojni ovoj bran kot '88' @4x, @6x drugi znak nejasen"),
    (None, 1936, 1980, "UNRESOLVED", "dark", "dwelling",
     "rumeno-bela stavba v južnem delu vasi; glifa dvomljiva",
     ["A-v-r3c1", "B-b-sw", "R-t-57-62", "R2-z-61-1939-1976"],
     "branja med prehodi: 34|61|51|81 — vrednost NI rešena; glej bp_coverage NOT_LOCATED"),
    ("42", 1829, 1930, "CANDIDATE", "dark", "dwelling",
     "rumena stavba v južnem grozdu",
     ["A-v-r3c1", "B-b-sw", "R-t-57-62"],
     "kandidat '42'; vzporedno branje '42' tudi pri (1746,1946) — vsaj eno od obeh je druga številka"),
    ("42", 1746, 1946, "CANDIDATE", "dark", "dwelling",
     "bela-rumena stavba v jugozahodnem grozdu",
     ["B-b-sw"],
     "drugi kandidat '42' (isti pass); 42a/42b — vsaj ena je napačna identifikacija"),
    ("52", 1852, 1970, "PROBABLE", "dark", "dwelling",
     "stavba z dvokapno streho v južnem delu",
     ["A-v-r3c1", "B-b-sw"],
     "PROBABLE '52' (5x?), en prehod"),
    ("55", 1902, 1906, "PROBABLE", "dark", "outbuilding",
     "manjša stavba med 56 in 61-kandidatom",
     ["A-v-r3c1", "B-b-sw"],
     "PROBABLE '55'"),
    (None, 1905, 1902, "UNREADABLE", "dark", "outbuilding",
     "stavba s poševno hatch; glifa prekrižana (hatch čez zapis)",
     ["A-v-r3c1", "R-t-57-62", "R2-z-58-1905-1902"],
     "vrednost neberljiva (58|53 domneva iz 2.5x — NE potrjeno); 'ni identificirano' ≠ 'ni obstajalo'"),
    (None, 2126, 1864, "UNRESOLVED", "dark", "dwelling",
     "stavba na JV robu vasi",
     ["A-v-r2c2", "B-b-se"],
     "branja: 72|73|78|79 — vrednost NI rešena; prior ima 72–79 v bližini (razpršene pozicije)"),
    (None, 1861, 2020, "CANDIDATE", "dark", "outbuilding",
     "manjša stavba na jugu vasi",
     ["B-b-sw", "R-t-57-62"],
     "kandidat '27|21' — nizka številka (obseg Žolant?) v vasi — semantika nejasna, glej F-A01-06"),
    (None, 1995, 2144, "UNIDENTIFIED", "none", "complex_unidentified",
     "VELIKA zidana dvotraktna stavba (temno rdečkano-rjava) + zeleni bazen/vrt; brez glife @4x",
     ["A-v-r3c1", "B-b-sw", "R-t-zohlant"],
     "Žolant: največja stavba na listu, NEoznačena — 'ni identificirano' ≠ 'ni obstajalo' (§7)"),
    (None, 1697,  625, "UNIDENTIFIED", "none", "landmark_unresolved",
     "majhen črno-bel kvadratni simbol ob kurzivnem 'Pod Grüblani' — kapelica/deszkak/vodnjak?",
     ["B-x-gruell"],
     "tip NI rešljiv iz rasterja; brez napisa; toponim 'Pod Griblani' že v toponym-register (val 62)"),
]

# rdeča plast: parcelne glife na/zraven stavb (PUA sec I/II preverek v builderju)
RED_GLYPHS = [
    ("103", 2187, 1325, "garden_parcel", ["A-v-r1c2", "R-t-east-100s"], "rdeča na zelenem; PUA sec I: houses 29,44"),
    ("107", 2177, 1581, "garden_parcel", ["A-v-r2c2", "R-t-80-84"], "rdeča na zelenem; PUA sec I+II"),
    ("159", 2192, 1428, "outbuilding_parcel", ["R2-z-159or109-2185-1428"], "rdeča NA prizidku 94; @6x '169|159' — glej tudi 169"),
    ("169", 2192, 1426, "outbuilding_parcel", ["R2-z-94c-2175-1404", "R2-z-159or109-2185-1428"], "@6x jasnejše '169'; PUA sec I: houses 24,28,32,42"),
    ("165", 2200, 1502, "garden_parcel", ["R2-z-91-2171-1499"], "rdeča na zelenem"),
    ("1459", 2123, 1468, "road_parcel", ["R-t-94-mine", "R-t-94-old", "R2-z-87-2109-1490", "R2-z-1459-2121-1468"], "rdeča '1459.' na cestišču; PUA sec II: houses 28,66 — CESTA = parcela"),
    ("926", 2212, 1334, "field_parcel", ["R2-z-yellow-2187-1342"], "rdeča na njivi vzhodno od vasi; '926|826' — UNRESOLVED"),
    ("65", 2093, 1453, "road_garden_parcel", ["R-t-94-old", "R2-z-1459-2121-1468"], "rdeča ob cesti"),
]

CROPS_MANIFEST = {
    "A": ["v-r1c1", "v-r1c2", "v-r2c1", "v-r2c2", "v-r3c1", "v-r3c2"],
    "B": ["b-nw", "b-ne", "b-sw", "b-se", "x-north", "x-west", "x-gruell", "ctx-village", "x-title"],
    "R": ["t-94-mine", "t-95-93-mine", "t-94-old", "t-93-old", "t-95-old", "t-57-62",
          "t-80-84", "t-87-91", "t-96-97", "t-zohlant", "t-east-100s", "t-east-100b"],
    "R2": ["z-9x-2157-1354", "z-yellow-2187-1342", "z-94c-2175-1404", "z-93or94-2169-1538",
           "z-159or109-2185-1428", "z-1459-2121-1468", "z-91-2171-1499", "z-88-2079-1535",
           "z-87-2109-1490", "z-58-1905-1902", "z-61-1939-1976", "z-59-1788-1940"],
}

NEGATIVE_FINDINGS = [
    {"id": "NF-A01-01", "finding": "Na A01 ni simbolov/napisov za cerkev, kapelico, gostilno ali križ (2 prehoda + val 42 VLM soglasje)",
     "implication": "cerkev Griblje se na izmerjenem listu NE označuje; cerkvena parcela ostaja dokumentirana samo prek PUA/PS"},
    {"id": "NF-A01-02", "finding": "'Stavba' na severnem robu (pregled val 65 celotnega predogleda) = rob lista + trikotnik njive ob zeleni meji; NI stavbe",
     "implication": "negativna kontrola — preprečen lažen BP vnos na severu"},
    {"id": "NF-A01-03", "finding": "'Grozd stavb' na jugozahodu (pregled val 65) = skupina dreves + rdeče številke njiv; NI stavb",
     "implication": "negativna kontrola jugozahoda"},
    {"id": "NF-A01-04", "finding": "Žolant: poleg velike zidane stavbe ni prepoznavnih dodatnih stavb z glifami @4x",
     "implication": "nizke rdeče številke 20–60 v Žolantu so NJIVE/vrtovi, ne stavbne glife"},
]


def to_geo(px, py):
    lat = GEO["anchor_geo"][0] - (py - GEO["anchor_px"][1]) * GEO["meters_per_px"] / 111320.0
    lng = GEO["anchor_geo"][1] + (px - GEO["anchor_px"][0]) * GEO["meters_per_px"] / (111320.0 * math.cos(math.radians(45.57246)))
    return [round(lat, 6), round(lng, 6)]


def main():
    prior = json.load(open(os.path.join(REPO, "src/data/cadastre-a01.json")))
    prior_by_bp = {b["bp"]: b for b in prior["buildings"]}
    bp_rows = json.load(open(os.path.join(BASE, "bp-house-reconciliation-1825.json")))["bp_rows"]
    bprow_by_bp = {r["bp"]: r for r in bp_rows}
    houses = json.load(open(os.path.join(BASE, "house-register-1825.json")))["houses"]
    # bp → veze iz hišnega registra (owners.a01, val 54/56/57)
    bp2houses = {}
    for h in houses:
        for a in (h.get("owners", {}).get("a01") or []):
            bp2houses.setdefault(str(a["bp"]), []).append(
                {"house_id": h["house_id"], "house_no": h["house_no_1825"],
                 "status": a.get("owner_status"), "link_source": a.get("link_source")})
    parcels = json.load(open(os.path.join(BASE, "parcel-register-1825.json")))["pua_parcels"]
    pua_by_num = {}
    for p in parcels:
        pua_by_num.setdefault(p["parcel_number"], []).append(
            {"section": p.get("section_original"), "houses": p.get("house_refs"), "page": p.get("page")})

    objects = []
    seq = 0
    for bp, px, py, tier, layer, btype, footprint, crops, notes in OBS:
        seq += 1
        oid = f"MO-A01-{seq:03d}"
        lat, lng = to_geo(px, py)
        pr = prior_by_bp.get(bp) if bp else None
        verdict = None
        px_prior = None
        delta = None
        if bp and pr:
            px_prior = [pr["px"], pr["py"]]
            delta = [px - pr["px"], py - pr["py"]]
            verdict = "POSITION_DISAGREE" if math.hypot(*delta) > 25 else "POSITION_AGREE"
        elif bp:
            verdict = "NEW"
        row = bprow_by_bp.get(int(bp)) if bp else None
        pua_hits = pua_by_num.get(int(bp), []) if bp else []
        obj = {
            "object_id": oid,
            "bp": bp,
            "glyph_tier": tier,
            "glyph_layer": layer,
            "building_type": btype,
            "footprint_note": footprint,
            "px": [px, py],
            "lat": lat, "lng": lng,
            "georef_status": "PROVIZORIČNO (1 sidro, sever-navzgor)",
            "related_houses": bp2houses.get(bp, []) if bp else [],
            "val57_matrix": ({"status": row["val57_status"],
                              "pt_houses": row["house_candidates"].get("pt_houses", [])} if row else None),
            "pua_parcel_cross": pua_hits,
            "verdict_vs_prior": verdict,
            "px_prior": px_prior,
            "px_prior_delta": delta,
            "source_crops": crops,
            "notes": notes,
        }
        objects.append(obj)

    # prior-only BP: v izlušku val 52–56, v prehodih A/B/R/R2 NI ponovno najden
    re_found = {o["bp"] for o in objects if o["bp"]}
    prior_only = []
    for bp, pr in sorted(prior_by_bp.items(), key=lambda kv: int(kv[0])):
        if bp in re_found:
            continue
        lat, lng = to_geo(pr["px"], pr["py"])
        row = bprow_by_bp.get(int(bp))
        prior_only.append({
            "bp": bp, "px_prior": [pr["px"], pr["py"]], "lat": lat, "lng": lng,
            "conf_prior": pr.get("conf"), "house_no_prior": pr.get("house_no"),
            "link_source_prior": pr.get("link_source"),
            "val57_matrix": ({"status": row["val57_status"],
                              "pt_houses": row["house_candidates"].get("pt_houses", [])} if row else None),
            "status": "LOCATED_PRIOR_NOT_RECONFIRMED_V65",
            "note": "pozicija iz val 52–56 ni bila ponovno najdena kot glifa v prehodih A/B/R/R2 — NI izpodbita, samo nepotrjena (§7: ne-identificirano ≠ ni-obstajalo)",
        })

    glyph_catalog = []
    for val, px, py, kind, crops, notes in RED_GLYPHS:
        pua_hits = pua_by_num.get(int(val), [])
        glyph_catalog.append({
            "glyph": val, "layer": "red", "kind": kind, "px": [px, py],
            "geo": to_geo(px, py), "source_crops": crops,
            "pua_parcel_cross": pua_hits, "notes": notes,
        })

    located_v65 = sorted([o["bp"] for o in objects if o["bp"]], key=int)
    prior_only_bps = sorted([p["bp"] for p in prior_only], key=int)
    all_known = set(located_v65) | set(prior_only_bps)
    missing = sorted((str(i) for i in range(1, 101) if str(i) not in all_known), key=int)

    out = {
        "val": 65,
        "pass": 4,
        "issue": "42 §7 (A01 building coverage)",
        "title": "A01 BUILDING INVENTORY v1 — 2-prehodno agentovo branje brez VLM",
        "method": {
            "protocol": "2 neodvisna prehoda (A: mreza 3x, B: kvadranti 2.5x + zunanji) + R 4x + R2 6x kontrola",
            "reader": "glavni agent (orodje za branje slik), brez VLM API klicev (kvota 429)",
            "crop_script": "research-griblje/a01/make-a01-crops.py (deterministično, regenerabilno)",
            "position_convention": "px = pozicija ŠTEVILČNE GLIFE (ali središče stavbe pri UNIDENTIFIED) na rasterju 2826x2273",
        },
        "raster": RASTER,
        "georef": GEO,
        "provenance": {
            "prior_extraction": "src/data/cadastre-a01.json (56 stavb, val 52+54+56, q1/q3/qcore-3x)",
            "bp_matrix": "atlas-1825/bp-house-reconciliation-1825.json (val 57)",
            "house_register": "atlas-1825/house-register-1825.json (owners.a01 veze, val 54/56/57)",
            "pua_parcels": "atlas-1825/parcel-register-1825.json (2035 parcel, val 60)",
            "crops": CROPS_MANIFEST,
        },
        "counts": {
            "objects_v65": len(objects),
            "objects_with_bp": len([o for o in objects if o["bp"]]),
            "located_v65": len(located_v65),
            "located_prior_only": len(prior_only_bps),
            "not_located_1_100": len(missing),
            "red_glyphs": len(glyph_catalog),
        },
        "objects": objects,
        "glyph_catalog_red_layer": glyph_catalog,
        "prior_only_bp": prior_only,
        "bp_coverage": {
            "LOCATED_V65": located_v65,
            "LOCATED_PRIOR_ONLY": prior_only_bps,
            "NOT_LOCATED": missing,
            "not_located_meaning": "BP ni bil lociran na A01 @raster 2826x2273 (gre za drobne gospodarske stavbe ali glife pod ločljivostjo) — NI dokaz, da objekt ni obstajal (§7/§8)",
        },
        "negative_findings": NEGATIVE_FINDINGS,
        "findings": [
            {"id": "F-A01-01", "status": "RESOLVED-V65",
             "finding": "px pozicije izluška val 52–56 so sistematično odmaknjene od glif (delta 28–224 px = 60–490 m @2,19 m/px, smer SZ–JV mešana); niso bile berljive kot številke @4–6x",
             "action": "v65 glifne pozicije = nova referenčna plast; px_prior ohranjen vsak objekt (nikoli prepisan); zemljevidna plast rabi kuratorski pregled (P2)"},
            {"id": "F-A01-02", "status": "OPEN",
             "finding": "PUA preverek: vse temne glife na stavbah obstajajo TUDI kot parcelne številke PUA sec I/II z house_refs (npr. 94→[47], 56→[68], 1459→[28,66]) — 'Nro. in der Mappe' (BP, PT 'Protocoll der Bau Parcellen') in PUA parcelna številka sta ista številka na stavbni parceli, ampak house_refs (PUA holding) ≠ hišna številka (PT p7) — dva različna ključna prostora",
             "what_would_resolve": "re-read PT p7 @300dpi (ob kvoti) + kontrola 2–3 vezav h.NN ↔ PUA holding; do takrat ostajajo obe interpretaciji ločeno (§5: ne prepiši ene z drugo)"},
            {"id": "F-A01-03", "status": "RESOLVED-V65",
             "finding": "novi BP glifi: 24 CLEAR (edini iz 1–29), 91 CLEAR, 87 + 88 CANDIDATE — izlušek 56 → 60 pozicij (56 prior + 4 nova, od tega 2 kandidatski)",
             "action": "vključeno v bp_coverage.LOCATED_V65"},
            {"id": "F-A01-04", "status": "OPEN",
             "finding": "Žolant: največja zidana stavba na celem listu (~1995,2144) je NEoznačena (brez glife @4x); nizke rdeče številke 20–60 so njive/vrtovi",
             "what_would_resolve": "re-read @višji dpi (VAČ original) ali PZ konskripcija 1830 (Žolant hiše) — ob kvoti"},
            {"id": "F-A01-05", "status": "RESOLVED-V65",
             "finding": "rdeče 4-mestne glife na cestišču = parcelne številke cest (1459 potrjeno v PUA sec II, houses 28/66) — ceste/voda so tudi parcele",
             "action": "glyph_catalog_red_layer.kind=road_parcel"},
            {"id": "F-A01-06", "status": "OPEN",
             "finding": "kandidat '27|21' (1861,2020) je nizka številka v vasi — bodisi glifa pod ločljivostjo bodisi oštevilčenje, ki prečka vaško/Žolant semantiko",
             "what_would_resolve": "re-read @višji dpi; PUA parcela 27/21 sec I kontrola"},
        ],
        "research_gaps": [
            {"gap_id": "RG-001", "status": "PARTIAL",
             "missing_relation": "MAP_OBJECT inventory (A01–A05 objekti)",
             "current_result": "A01 v1: 24 objektov v65 (9 s BP, 15 brez/dvomljivi) + 56 prior-only + 8 rdečih glif; A02–A05 ŠE NI inventariziranih",
             "next_source": "A02–A05 isti protokol; PT p7 re-read @300dpi za BP→hiše; VAČ original @višji dpi za 87/88/58/61/93 glife"},
        ],
        "generated_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }

    dst = os.path.join(BASE, "a01-building-inventory-1825.json")
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"OK -> {dst}")
    print(json.dumps(out["counts"], ensure_ascii=False))
    print("LOCATED_V65:", ", ".join(located_v65))
    print("NOT_LOCATED:", ", ".join(missing))


if __name__ == "__main__":
    main()
