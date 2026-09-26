#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ATLAS 1825 §20 — TIME SLIDER (val 76): časovne točke vasi Griblje.

Podatkovni model časovne osi (issue #42 §20):
  - 1825 = REFERENČNA točka (katastrski operati: PT/PS/PUA + PV izkaz rabe +
    list A01) — lastninska resnica, BREZ prebivalstva (kataster ne popisuje
    ljudi);
  - 1830 = prvi DOKUMENTIRAN korak čez čas (PZ Konskripcija [373419] §3/§4/§1/§7:
    441 duš = 222 M + 219 Ž, 70 hiš, 102 družin, živina, površina);
  - pričakovane popisne letnice (1857/1869/1880/1890/1900/1910 — cislajtanski
    popisi) = izrecno AWAITING_SOURCE: brez vpisanega vira NIMAJO metrik.

Železna pravila (§4/§14/§22):
  - točka brez vpisanega vira = AWAITING_SOURCE in NE nosi metrik;
  - metriki se NIKOLI ne interpolirajo med točkami — vsaka točka stoji samo
    na svojih virih (nič "gladkih krivulj" med 1825 in 1830);
  - metrika, ki je vir za dokumentirano leto NE zapisuje, gre v izrecen
    absent_metrics blok (ni tihih presledkov);
  - REVIEW branja ostanejo označena (nikoli tiho dokazana).

Determinističen, fail-fast, idempotenten (ročno urejanje izhoda prepovedano).
Izhod: timeline-1825-1830.json (arhiv) + runtime kopija src/data/.
"""

import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ATLAS = ROOT / "research-griblje" / "atlas-1825"
SRC_DATA = ROOT / "src" / "data"

VAL = 76
PASS = "§20 PASS 1 (časovna os: 1825 referenčna + 1830 prvi dokumentiran korak)"


def fail(msg: str) -> None:
    print(f"I-KRŠITEV: {msg}", file=sys.stderr)
    sys.exit(1)


def load(path: Path):
    if not path.exists():
        fail(f"manjka vhodna datoteka: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


pz = load(ATLAS / "pz-konskripcija-1830.json")
pv = load(ATLAS / "pv-land-use-1825.json")
kg = load(ATLAS / "knowledge-graph-1825.json")

# ------------------------------------------------------------------
# KG resnica (fail-fast: zatiči morajo biti, številčne pričakovane
# vrednosti so pribite na val 73/74/75 — zaščita pred zdrsom KG)
# ------------------------------------------------------------------
kg_sources = {
    n["node_id"]: n
    for n in kg["nodes"]
    if n.get("node_type") == "SOURCE"
}
for sid in ("SRC-PT", "SRC-PS", "SRC-PUA", "SRC-PV", "SRC-PZ"):
    if sid not in kg_sources:
        fail(f"KG manjka SOURCE vozlišče {sid}")

parcels = [n for n in kg["nodes"] if n.get("node_type") == "PARCEL"]
pua_count = sum(1 for n in parcels if n.get("origin") == "PUA")
ps_count = sum(1 for n in parcels if n.get("origin") == "PS")
ps_with_use = sum(
    1
    for n in parcels
    if n.get("origin") == "PS"
    and n.get("land_use_category") not in (None, "UNKNOWN")
)
ps_unknown_use = sum(
    1
    for n in parcels
    if n.get("origin") == "PS" and n.get("land_use_category") == "UNKNOWN"
)
if (pua_count, ps_count) != (2035, 432):
    fail(f"parcelni zatiči zamaknjeni: PUA {pua_count} (pričakovano 2035), PS {ps_count} (432)")
if (ps_with_use, ps_unknown_use) != (326, 106):
    fail(
        f"raba PS zamaknjena: z rabo {ps_with_use} (326), neznana {ps_unknown_use} (106)"
    )


def kg_sha256_of(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


KG_SHA = kg_sha256_of(ATLAS / "knowledge-graph-1825.json")

# ------------------------------------------------------------------
# Vrati I1 — prebivalstvo 1830 (aritmetika IZ SUROVEGA PZ, ne zaupaj vhodu)
# ------------------------------------------------------------------
bez = pz["bevoelkerung_1830"]
if bez["maenner"] + bez["weiber"] != bez["zusammen_seelen"]:
    fail(f"I1: {bez['maenner']} + {bez['weiber']} != {bez['zusammen_seelen']}")
if bez["zusammen_seelen"] != 441:
    fail(f"I1: pričakovano 441 duš, PZ pove {bez['zusammen_seelen']}")

# Vrati I2 — prečna validacija površine PZ ↔ PV (val 74/75)
area = pz["area_total"]
pv_grand = pv["totals"]["grand_quadrat_klafter"]
pz_red = area["red_corrected_qklft"]
delta_pct = abs(pz_red - pv_grand) / pv_grand * 100.0
if delta_pct > 1.0:
    fail(f"I2: površinski odmik {delta_pct:.3f} % > 1 %")

if delta_pct < 0.05 or abs(delta_pct - 0.086) > 0.01:
    fail(f"I2: Δ {delta_pct:.3f} % ne ustreza dokumentiranim 0,086 % (val 75)")

# ------------------------------------------------------------------
# Metrike — vsaka s source_id + evidence + reading_status (I3)
# ------------------------------------------------------------------


def metric(
    metric_id, value, unit, display, source_id, evidence, reading_status="TRANSCRIBED", note=None
):
    if source_id not in kg_sources:
        fail(f"I3: metrika {metric_id} kaže na neobstoječ vir {source_id}")
    if reading_status not in ("TRANSCRIBED", "REVIEW"):
        fail(f"I3: metrika {metric_id} ima neznan reading_status {reading_status}")
    if not evidence:
        fail(f"I3: metrika {metric_id} brez evidence")
    m = {
        "metric_id": metric_id,
        "value": value,
        "unit": unit,
        "display": display,
        "source_id": source_id,
        "evidence": evidence,
        "reading_status": reading_status,
    }
    if note:
        m["note"] = note
    return m


def vac_of(sid: str):
    src = kg_sources.get(sid, {})
    return src.get("vac_details_url")


t1 = {r["key"]: r for r in pv["table1_kulturen"]}
wein = t1["wein_garten"]
weiden = t1["weiden"]
aecher = t1["aecher"]
wiesen = t1["wiesen"]
wiesen_obst = t1["wiesen_mit_obstgaerten"]

# Pretvorba (uradna konstanta PV): 1 Joch = 1600 QKlft (5754,64 / 3,59665 m²)
JOCH_QKLFT = 1600
if abs(pv["totals"]["grand_quadrat_klafter"] - (pv["totals"]["grand_written"]["joch"] * JOCH_QKLFT + pv["totals"]["grand_written"]["klafter"])) > 1:
    fail("pretvorba Joch↔QKlft ne ustreza PV veliki vsoti (konstanta 1600)")
wz = pz["weingaerten"]["einzelne_classe"]
wein_1830_qklft = wz["joch"] * JOCH_QKLFT + wz["klafter"]

points = [
    {
        "year": 1825,
        "status": "DOCUMENTED",
        "label": "Kataster 1825 — izmera 1824, operati 1825, korekcije 1827",
        "kind": "kataster_lastninska_resnica",
        "source_ids": ["SRC-PT", "SRC-PS", "SRC-PUA", "SRC-PV"],
        "metrics": [
            metric(
                "commune_area",
                pv["totals"]["grand_quadrat_klafter"],
                "QKlft",
                "1221 J 1573 K (1.955.173 QKlft ≈ 7,032 km²)",
                "SRC-PV",
                "pv-n83/ (tabela I + II, aritmetična vrata val 74)",
                note="Area der ganzen Gemeinde; vrata na 3 nivojih (vsota I, vsota II, velika).",
            ),
            metric(
                "pasture_share",
                weiden["share_pct"],
                "pct",
                f"{str(weiden['share_pct']).replace('.', ',')} % površine ({weiden['joch']} J {weiden['klafter']} K)",
                "SRC-PV",
                "pv-n83/ (Weiden)",
                note="kraška pašniška struktura (F-PV-05); gozd = kategorija 'Weiden mit Holznutzen' v PZ (F-PV-02 razrešena na ravni kategorij, val 75).",
            ),
            metric(
                "arable_share",
                aecher["share_pct"],
                "pct",
                f"{str(aecher['share_pct']).replace('.', ',')} % površine ({aecher['joch']} J {aecher['klafter']} K)",
                "SRC-PV",
                "pv-n83/ (Äcker)",
            ),
            metric(
                "meadow_share",
                wiesen["share_pct"],
                "pct",
                f"{str(wiesen['share_pct']).replace('.', ',')} % površine ({wiesen['joch']} J {wiesen['klafter']} K)",
                "SRC-PV",
                "pv-n83/ (Wiesen)",
            ),
            metric(
                "orchard_meadow_share",
                wiesen_obst["share_pct"],
                "pct",
                f"{str(wiesen_obst['share_pct']).replace('.', ',')} % površine ({wiesen_obst['joch']} J {wiesen_obst['klafter']} K)",
                "SRC-PV",
                "pv-n83/ (Wiesen mit Obstgärten)",
            ),
            metric(
                "vineyard_area",
                wein["quadrat_klafter"],
                "QKlft",
                f"{wein['joch']} J {wein['klafter']} K (≈ 4,27 ha)",
                "SRC-PV",
                "pv-n83/ (Wein-Gärten)",
                note="F-PV-03: v prepisanem delu PS p1–55 ni nobene Weingarten parcele — nasadi se omenjajo šele v PZ §7 (1830).",
            ),
            metric(
                "parcels_pua",
                pua_count,
                "count",
                f"{pua_count} parcel",
                "SRC-PUA",
                "knowledge-graph-1825.json (PARCEL origin=PUA)",
                note="urbarialne akcije; vir rabe ne zapisuje (val 63 KG).",
            ),
            metric(
                "parcels_ps",
                ps_count,
                "count",
                f"{ps_count} parcel",
                "SRC-PS",
                "ps-n83/register.json (p3–55)",
                note="prepis pokriva SAMO p3–55 od 143 strani (F-PZ-09); 412 unikatnih parcel, 20 so-referenciranih vrstic.",
            ),
            metric(
                "parcels_with_land_use",
                ps_with_use,
                "count",
                f"{ps_with_use} parcel z leksikalno dokazano rabo ({ps_unknown_use} neznanka)",
                "SRC-PS",
                "ps-n83/register.json (njiva 230, travnik 60, gozd 13, pašnik 9, vrt 10, drugo 4)",
                note="raba samo EXACT termini; neznanka = termin ni nedvoumen (original ohranjen, val 73).",
            ),
        ],
        "absent_metrics": [
            {
                "metric_id": "population_total",
                "reason": "Katastrski operati popisujejo lastninska stanja, ne ljudi. Konskripcija prebivalstva za 1825 ni med 13 vpisanimi viri (ATLAS 1825).",
            },
            {
                "metric_id": "houses",
                "reason": "Številka hiš kot konskripcija (vzorec PZ §3) za 1825 ni v vpisanih virih; PT vodi stavbne parcele (BP = davčne enote), ne konskripcije hiš.",
            },
            {
                "metric_id": "families",
                "reason": "Družinska konskripcija za 1825 ni v vpisanih virih.",
            },
        ],
        "note": "PS p3–55 omenja 167 hišnih entitet (delna pokritost p56–143 brez vrstic, F-PZ-09) — NI primerljivo s konskripcijo 70 hiš (1830) brez re-reada; zato tu ni metrike 'hiše'.",
    },
    {
        "year": 1830,
        "status": "DOCUMENTED",
        "label": "Konskripcija 1830 — PZ Katastral-Schätzungs-Elaborat [373419] §3/§4/§1/§7",
        "kind": "konskripcija_prebivalstva",
        "source_ids": ["SRC-PZ"],
        "metrics": [
            metric(
                "population_total",
                bez["zusammen_seelen"],
                "count",
                "441 duš",
                "SRC-PZ",
                "pz-n83/z-bevoelkerung.jpeg (p2, §3)",
                note="vrata I1 EXACT: 222 M + 219 Ž = 441; referenca 'Conscriptionis-Revisions-Resultaten vom Jahre 1830'.",
            ),
            metric("population_men", bez["maenner"], "count", "222 moških", "SRC-PZ", "pz-n83/z-bevoelkerung.jpeg"),
            metric("population_women", bez["weiber"], "count", "219 žensk", "SRC-PZ", "pz-n83/z-bevoelkerung.jpeg"),
            metric("houses", bez["haeuser"], "count", "70 hiš", "SRC-PZ", "pz-n83/z-bevoelkerung.jpeg"),
            metric(
                "families",
                bez["familien"],
                "count",
                "102 družin",
                "SRC-PZ",
                "pz-n83/z-bevoelkerung.jpeg",
                note="kontekstni izraz 'Hofesgesessene' delno nejasen; številka jasna v obeh prehodih.",
            ),
            metric("livestock_ochsen", 124, "count", "124 Ochsen", "SRC-PZ", "pz-n83/ (§4 Viehstand, 2 prehoda)"),
            metric(
                "livestock_kuehe_rosse",
                20,
                "count",
                "20 Kühe | Rosse",
                "SRC-PZ",
                "pz-n83/ (§4)",
                reading_status="REVIEW",
                note="rokopis dvoumen: krave ALI konji — ostaja odprto (F-PZ-03).",
            ),
            metric("livestock_jungvieh", 30, "count", "30 Jungvieh", "SRC-PZ", "pz-n83/ (§4)"),
            metric("livestock_schafe", 150, "count", "150 Schafe", "SRC-PZ", "pz-n83/ (§4)"),
            metric(
                "livestock_laemmer",
                30,
                "count",
                "30 Lämmer",
                "SRC-PZ",
                "pz-n83/ (§4)",
                reading_status="REVIEW",
                note="dvom v branje vrste (F-PZ-03).",
            ),
            metric(
                "commune_area",
                pz_red,
                "QKlft",
                "1220 J 1493 K (1.953.493 QKlft ≈ 7,026 km²)",
                "SRC-PZ",
                "pz-n83/z-area-digits.jpeg (p1, §1)",
                note=f"rdeči popravek prek prečrtanih 1235 J 1516 K; Δ 1680 QKlft = {str(round(delta_pct, 3)).replace('.', ',')} % vs PV (vrata I2 < 1 %) = prečna validacija dveh virov.",
            ),
            metric(
                "vineyard_area",
                wein_1830_qklft,
                "QKlft",
                "7 J 42 K (§7, Einzige Classe)",
                "SRC-PZ",
                "pz-n83/z-weingaerten.jpeg (p21)",
                note="Joch ujemanje s PV (7 J); Klafter različen (42 vs 665) — rdeča revizija 6 J 1059 K REVIEW; nič izenačeno brez virov.",
            ),
        ],
        "absent_metrics": [
            {
                "metric_id": "pasture_share",
                "reason": "PZ Endresultat (p67) poroča 'Weiden mit Holznutzen' 558 J 846 K, ampak Summa p67 se ne zapira (F-PZ-04 OPEN, Δ 43.488 QKl) — deleži se ne objavljajo, dokler se vsota ne razreši (§14: nič vsiljenega).",
            },
        ],
        "note": "Dokument obsega 1828/29–1830 (Nachtrag 1829, protokoli 1830); prebivalstvo nosi referenco 1830. Živina: 2 vrsti REVIEW.",
    },
]

# ------------------------------------------------------------------
# Pričakovane popisne letnice — IZRECNO AWAITING_SOURCE (brez metrik, I4)
# ------------------------------------------------------------------
CENSUS_YEARS = [1857, 1869, 1880, 1890, 1900, 1910]
for y in CENSUS_YEARS:
    points.append(
        {
            "year": y,
            "status": "AWAITING_SOURCE",
            "label": f"Popisna letnica {y} (cislajtanski popisi) — vir še ni vpisan",
            "kind": "pričakovana_letnica",
            "source_ids": [],
            "metrics": [],
            "absent_metrics": [],
            "expected_basis": "Uradne popisne letnice cislajtanskih popisov (1857/1869/1880/1890/1900/1910). Ali (in kako) popis pokriva Griblje, ugotovimo ŠELE z virom — točka nosi nič trditev.",
            "note": None,
        }
    )

# ------------------------------------------------------------------
# Invarianti I4/I5 — schema + vrstni red
# ------------------------------------------------------------------
years = [p["year"] for p in points]
if years != sorted(years) or len(set(years)) != len(years):
    fail(f"I5: letnice niso strogo naraščajoče/unikatne: {years}")
for p in points:
    if p["status"] not in ("DOCUMENTED", "AWAITING_SOURCE"):
        fail(f"I4: neznan status {p['status']} za {p['year']}")
    if p["status"] == "DOCUMENTED" and not p["metrics"]:
        fail(f"I4: dokumentirana točka {p['year']} brez metrik")
    if p["status"] == "AWAITING_SOURCE" and (p["metrics"] or p["source_ids"]):
        fail(f"I4: AWAITING_SOURCE točka {p['year']} nosi metrike/vire")

doc_points = [p for p in points if p["status"] == "DOCUMENTED"]
awaiting_points = [p for p in points if p["status"] == "AWAITING_SOURCE"]

# ------------------------------------------------------------------
# Izhod
# ------------------------------------------------------------------
out = {
    "val": VAL,
    "pass": PASS,
    "issue": 42,
    "deterministic": True,
    "title": "ATLAS 1825 §20 — časovni drsnik: časovne točke vasi Griblje (1825 referenčna + 1830 prvi dokumentiran korak)",
    "spec": "issue #42 §20: podatkovni model časovnih točk + API + UI; pošteno: točke brez virov = izrecno AWAITING_SOURCE, brez interpolacij (§4)",
    "method": {
        "built_from": [
            "pz-konskripcija-1830.json (val 75)",
            "pv-land-use-1825.json (val 74)",
            "knowledge-graph-1825.json (v1.7)",
        ],
        "deterministic": True,
        "no_guessing": "§4: metrika brez vira ne obstaja; manjkajoča metrika v dokumentirani točki = izrecen absent_metrics blok; AWAITING_SOURCE točke so prazne po pogodbi",
    },
    "contract": {
        "statuses": {
            "DOCUMENTED": "vsaj ena metrika z vpisanim virom (source_id + evidence)",
            "AWAITING_SOURCE": "brez vpisanega vira → brez metrik in brez virov (nič trditev)",
        },
        "rules": [
            "točka brez vpisanega vira = AWAITING_SOURCE in NE nosi metrik (§4: nič ne ugibamo)",
            "metriki se NIKOLI ne interpolirajo med točkami — vsaka točka stoji samo na svojih virih",
            "manjkajoča metrika v dokumentirani točki = izrecen absent_metrics blok (ni tihih presledkov)",
            "REVIEW branja ostanejo označena (nikoli tiho dokazana)",
            "vsak metric.source_id MORA obstajati kot SOURCE vozlišče v KG (I3)",
        ],
        "issue_22": "sprememba vhodnih podatkov (KG/PV/PZ) spremeni izhod in z njim UI resnico; nič se ne piše ročno",
    },
    "provenance": {
        "built_from": [
            "research-griblje/atlas-1825/pz-konskripcija-1830.json",
            "research-griblje/atlas-1825/pv-land-use-1825.json",
            "research-griblje/atlas-1825/knowledge-graph-1825.json",
        ],
        "kg_sha256": KG_SHA,
        "runtime_copy": "src/data/timeline-1825-1830.json",
        "vac": {
            "SRC-PV": vac_of("SRC-PV"),
            "SRC-PZ": vac_of("SRC-PZ"),
        },
    },
    "invariants_enforced": [
        "I1: prebivalstvo 1830 = aritmetika iz surovega PZ (222 M + 219 Ž = 441, EXACT)",
        "I2: površina PZ ↔ PV prečno validirana (Δ < 1 %; dokumentirano 0,086 %)",
        "I3: vsaka metrika DOCUMENTED točke ima source_id (KG SOURCE) + evidence + reading_status",
        "I4: AWAITING_SOURCE točke imamo 0 metrik in 0 virov",
        "I5: letnice strogo naraščajoče in unikatne; statusi samo DOCUMENTED | AWAITING_SOURCE",
        "I6: KG zatiči pribiti (PUA 2035 / PS 432 / raba 326+106) — zaščita pred zdrsom grafa",
    ],
    "invariant_violations": [],
    "summary": {
        "points_total": len(points),
        "documented": len(doc_points),
        "awaiting_source": len(awaiting_points),
        "years": years,
        "expected_census_years": CENSUS_YEARS,
        "note": "1825 = lastninska resnica (kataster, brez prebivalstva) · 1830 = prvi prebivalstveni korak (PZ) · 1857–1910 = pričakovane letnice brez virov",
    },
    "points": points,
    "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}

ARCHIVE = ATLAS / "timeline-1825-1830.json"
RUNTIME = SRC_DATA / "timeline-1825-1830.json"
ARCHIVE.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
RUNTIME.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"OK: timeline-1825-1830.json (val {VAL}) — {len(points)} točk "
      f"({len(doc_points)} DOCUMENTED, {len(awaiting_points)} AWAITING_SOURCE); kg_sha256={KG_SHA[:8]}…")
print(f"    I1 prebivalstvo 441 ✓ · I2 Δ {delta_pct:.3f} % ✓ · I6 PUA {pua_count}/PS {ps_count}/raba {ps_with_use}+{ps_unknown_use} ✓")
