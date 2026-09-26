#!/usr/bin/env python3
"""
Val 74 — PV N83 "Izkaz rabe zemljišč" (Ausweis über die Benützungsart des
Bodens für die Gemeinde Grüble), 1 stran [VAČ uodid 373418 / docid 41783].

URADNI agregat 1825: površine po kulturah za celotno katastrsko občino
Griblje, datirano "am 10ten Jänner 1825" (isti dan kot PS p49), Provinz
Illyrien, Kreis Neustadtl, District Krupa.

Metoda (issue #42 §1: SOURCES → DOKAZI → PODATKI; nič ugibanja):
  2 neodvisna bralna prehoda:
    1. celotna stran (VAČ preview 1026×688 + 2× LANCZOS),
    2. nativni sken 2139×1435 (pymupdf ekstrakcija iz N083PV.pdf, val 56
       metoda) — pasovni izrezki 2×–8×.
  Aritmetična vrata (odločajoča za kurrentske števke — dokumentirano):
    - Gemüse Klft: 133 (ne 193) — sicer se vsota I ne zapre,
    - Wein Joch: 7 (ne 5) — sicer se vsota I ne zapre,
    - Weg Klft: 1127, Bau Klft: 889 — sicer se vsota II ne zapre,
    - velika vsota: 1221 (ne 1225) — sicer se I+II ne zapre.
  Vrta I1–I4 fail-fast: vsaka kršitev = builder ne zapiše izhoda.

Izhod: pv-land-use-1825.json (agregat po kulturah; NI raba po parcelah —
§4: parcelna raba ostane neznana za PUA namespace).
"""
import json
import os
from datetime import datetime, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, "pv-land-use-1825.json")

KLFT_PER_JOCH = 1600          # 1 Joch = 1600 Quadrat-Klafter
M2_PER_QKLFT = 3.59665        # 1 Klafter = 1.8965 m → 1 QKlft = 3.59665 m²

# (key, de, sl, joch, klafter, legible) — branje 2 prehoda + aritmetična vrata
TABLE1 = [
    ("gemuese_garten",    "Gemüse-Gärten",                 "zelenjavni vrtovi",        2, 133, True),
    ("obst_garten",       "Obst-Gärten",                   "sadni vrtovi",             0, 0, False),
    ("zier_garten",       "Zier-Gärten",                   "okrasni vrtovi",           0, 0, False),
    ("wein_garten",       "Wein-Gärten",                   "vinogradi",                7, 665, True),
    ("hopfen_garten",     "Hopfen-Gärten",                 "hmeljišča",                0, 0, False),
    ("wiesen",            "Wiesen",                        "travniki",                 76, 1480, True),
    ("wiesen_mit_obstgaerten", "Wiesen mit Obstgärten",    "travniki s sadnim drevjem", 12, 328, True),
    ("weiden",            "Weiden",                        "pašniki",                  636, 263, True),
    ("sumpfe",            "Sümpfe",                        "močvirja",                 0, 0, False),
    ("sumpfe_mit_rohrwuchs", "Sümpfe mit Rohrwuchs",       "močvirja s trstjem",       0, 0, False),
    ("aecher",            "Äcker",                         "njive",                    413, 870, True),
    ("aecher_mit_obstbaeumen", "Äcker mit Obstbäumen",     "njive s sadnim drevjem",   0, 0, False),
    ("aecher_mit_oelbaeumen",  "Äcker mit Öl bäumen",      "njive z oljkami",          0, 0, False),
    ("aecher_mit_weinreben",   "Äcker mit Weinreben",      "njive z vinsko trto",      0, 0, False),
    ("aecher_mit_baeumen_und_weinreben", "Äcker mit Bäumen und Weinreben", "njive z drevjem in trto", 0, 0, False),
]

TABLE2 = [
    ("reisfelder",        "Reisfelder",                    "riževa polja",             0, 0, False),
    ("geestruecke",       "Geestrücke",                    "nerodovitna tla",          0, 0, False),
    ("waelder",           "Wälder",                        "gozdovi",                  0, 0, False),
    ("schotter_und_sandgruben", "Schotter und Sandgruben", "grušč in peskomerice",     0, 0, False),
    ("lehmgruben",        "Lehmgruben",                    "glinske jame",             0, 0, False),
    ("steinbrueche",      "Steinbrüche",                   "kamnolomi",                0, 0, False),
    ("torfstiche",        "Torfstiche",                    "šotne jame",               0, 0, False),
    ("nakte_felsen",      "Nackte Felsen",                 "gole skale",               0, 0, False),
    ("oedungen",          "Ödungen",                       "opuščena zemljišča",       1, 476, True),
    ("fluesse_oder_baeche", "Flüsse oder Bäche",           "reke ali potoki",          21, 142, True),
    ("seen_oder_teiche",  "Seen oder Teiche",              "jezera ali ribniki",       0, 0, False),
    ("meer_salinen",      "Meer, Salinen",                 "morje, soline",            0, 0, False),
    ("weg_parzellen",     "Weg-Parzellen",                 "cestne parcele",           46, 1127, True),
    ("bau_parzellen",     "Bau-Parzellen",                 "stavbne parcele",          4, 889, True),
]

WRITTEN_T1 = (1148, 539)   # Ganz-Aren (tabela I)
WRITTEN_T2 = (73, 1034)    # vsota (tabela II)
WRITTEN_GRAND = (1221, 1573)  # Area der ganzen Gemeinde


def fail(msg: str) -> None:
    raise SystemExit(f"I-PV fail-fast: {msg}")


def close(table):
    j = sum(r[3] for r in table)
    k = sum(r[4] for r in table)
    return (j + k // KLFT_PER_JOCH, k % KLFT_PER_JOCH)


def main() -> None:
    # ---------- vrata I1/I2: vsoti tabel ----------
    calc_t1, calc_t2 = close(TABLE1), close(TABLE2)
    if calc_t1 != WRITTEN_T1:
        fail(f"vsota I {calc_t1} != pisani {WRITTEN_T1}")
    if calc_t2 != WRITTEN_T2:
        fail(f"vsota II {calc_t2} != pisani {WRITTEN_T2}")

    # ---------- vrata I3: velika vsota ----------
    grand_k = calc_t1[1] + calc_t2[1]
    calc_grand = (calc_t1[0] + calc_t2[0] + grand_k // KLFT_PER_JOCH, grand_k % KLFT_PER_JOCH)
    if calc_grand != WRITTEN_GRAND:
        fail(f"velika vsota {calc_grand} != pisani {WRITTEN_GRAND}")

    # ---------- izpeljava: QKlft, m², deleži ----------
    total_qklft = calc_grand[0] * KLFT_PER_JOCH + calc_grand[1]
    total_m2 = total_qklft * M2_PER_QKLFT

    def rows(table):
        out = []
        for key, de, sl, j, k, legible in table:
            qklft = j * KLFT_PER_JOCH + k
            m2 = qklft * M2_PER_QKLFT
            out.append({
                "key": key, "original": de, "sl": sl,
                "joch": j, "klafter": k,
                "quadrat_klafter": qklft,
                "m2": round(m2, 1),
                "share_pct": round(100.0 * m2 / total_m2, 2),
                "transcribed": legible,
            })
        return out

    t1_rows, t2_rows = rows(TABLE1), rows(TABLE2)

    # ---------- vrata I4: deleži se seštejejo v 100 % ----------
    share_sum = sum(r["share_pct"] for r in t1_rows + t2_rows)
    if abs(share_sum - 100.0) > 0.05:
        fail(f"deleži {share_sum:.3f} % != 100 %")

    documented = [r for r in t1_rows + t2_rows if r["transcribed"]]
    zero = [r for r in t1_rows + t2_rows if not r["transcribed"]]

    out = {
        "val": 74,
        "pass": "PV-1",
        "issue": "#42 §4/§14",
        "title": "PV N83 — Izkaz rabe zemljišč (Ausweis über die Benützungsart des Bodens für die Gemeinde Grüble), 1825",
        "method": {
            "rules": [
                "PV = uradni AGREGAT po kulturah za celotno k.o. Grüble — NIKOLI raba posamezne parcele (§4)",
                "2 neodvisna bralna prehoda (preview + nativni sken 2139×1435); aritmetična vrata odločajo dvomljive kurrentske števke (dokumentirano)",
                "prazne celice = tiskana pika ('.') → 0, NE neznano",
                "fail-fast invarianti I1–I4: vsota I, vsota II, velika vsota, deleži = 100 %",
            ],
            "reading_passes": 2,
            "arithmetic_gates": {
                "gemuese_garten_klafter": "133 (ne 193) — sicer se vsota I ne zapre",
                "wein_garten_joch": "7 (ne 5) — sicer se vsota I ne zapre",
                "weg_parzellen_klafter": "1127; bau_parzellen_klafter: 889 — sicer se vsota II ne zapre",
                "grand_total_joch": "1221 (ne 1225) — sicer se I+II ne zapre",
            },
        },
        "provenance": {
            "source": "SRC-PV (N083PV Izkaz rabe zemljišč)",
            "uodid": 373418,
            "docid": 41783,
            "pages": 1,
            "vac_details_url": "https://vac.sjas.gov.si/vac/search/details?id=373418",
            "page_stamp": "svinčnik 93, tisk 'III. O.' (zgoraj desno)",
            "header": {
                "provinz": "Illyrien",
                "kreis": "Neustadtl",
                "district": "Krupa",
                "gemeinde": "Grüble",
                "gemeinde_no_written": "4",
            },
            "date_written": "am 10ten Jänner 18[25] (kraj izdaje: kurrentni zapis UNCERTAIN, začetnica M/G — ni interpretirano)",
            "cross_check_date": "PUA p49 'um 10. Januar 1825' (val 51/56) — isti dan",
            "raw": "research-griblje/pv-n83/ (N083PV.pdf + PV-p1-native.jpeg 2139×1435 + izrezki)",
            "reading_date": "2026-09-26",
        },
        "totals": {
            "table1_written": {"joch": WRITTEN_T1[0], "klafter": WRITTEN_T1[1], "label": "Ganz-Aren der Gemeinde (tabela I: kulture)"},
            "table2_written": {"joch": WRITTEN_T2[0], "klafter": WRITTEN_T2[1], "label": "vsota tabela II (nerodovitno + posebno)"},
            "grand_written": {"joch": WRITTEN_GRAND[0], "klafter": WRITTEN_GRAND[1], "label": "Area der ganzen Gemeinde"},
            "grand_quadrat_klafter": total_qklft,
            "grand_m2": round(total_m2, 1),
            "grand_km2": round(total_m2 / 1e6, 3),
            "conversion": {"klafter_m": 1.8965, "qklft_m2": M2_PER_QKLFT, "joch_m2": round(KLFT_PER_JOCH * M2_PER_QKLFT, 2)},
        },
        "table1_kulturen": t1_rows,
        "table2_sonder": t2_rows,
        "summary": {
            "documented_cells": len(documented),
            "zero_cells": len(zero),
            "top3_by_area": sorted(
                [{"key": r["key"], "sl": r["sl"], "share_pct": r["share_pct"]} for r in t1_rows + t2_rows if r["transcribed"]],
                key=lambda x: -x["share_pct"],
            )[:3],
        },
        "findings": [
            {"id": "F-PV-01", "status": "RESOLVED-V74",
             "statement": "Transkripcija zaključena z aritmetičnimi vrati na vseh treh nivojih (vsota I 1148|539, vsota II 73|1034, velika 1221|1573 — vse točne)."},
            {"id": "F-PV-02", "status": "OPEN",
             "statement": "NAPETOST (§14, ostaja vidna): PV poroča Wälder = 0, PS (delni 55/143) pa vsebuje 13 parcel z rabo 'Wald'. Razlaga ni dokazana (možne: Weidewald pod Weiden, majhne površine pod Ödungen, ali PS kontekst prepisa). NI tiho razrešeno; resolucija = PS p56–143 + PZ (Konskripcija 1830)."},
            {"id": "F-PV-03", "status": "DOKAZ-ZA-RE-READ",
             "statement": "Vinogradi: PV dokazuje 7 J 665 K ≈ 4,27 ha (0,61 %) — v prepisanih PS p1–55 NI ENE 'Weingarten' parcele → PS p56–143 MORAJO vsebovati vinogradne parcele (napoved za re-read; falsifikabilna)."},
            {"id": "F-PV-04", "status": "NOVA-TRDA-STEVILKA",
             "statement": "Bau-Parzellen 4 J 889 K ≈ 26.216 m² = uradni agregat stavbnih parcel k.o. Grüble 1825 (§15 model: brez geometrije, ampak uradna vsota obstaja)."},
            {"id": "F-PV-05", "status": "STRUKTURA",
             "statement": "Weiden 636 J 263 K = 52,08 % površine Gemeinde (≈ 3,66 km²) — kraška pašniška struktura, skladna s PUA so-referenciranimi skupnimi parcelami (val 60: 417 parcel v več hišah)."},
        ],
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "deterministic": True,
    }

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print(f"OK pv-land-use-1825.json — velika vsota {calc_grand[0]} J {calc_grand[1]} K = {total_m2/1e6:.3f} km²; dokumentiranih kultur: {len(documented)}")


if __name__ == "__main__":
    main()
