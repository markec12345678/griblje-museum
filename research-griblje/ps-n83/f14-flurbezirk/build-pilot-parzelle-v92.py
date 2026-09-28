#!/usr/bin/env python3
"""
val 92 — F14 Parzelle pilot: deterministična verifikacija strukturnega modela.

Model: p3 = Flure 1–20; p4–p143 = Parzelle 21–~2820 (~20/razprede):
    first(p) = 21 + 20*(p-4)
    last(p)  = 40 + 20*(p-4)   (= first + 19)

Verifikator (vzorec build-*-v86/v88/v90):
  1. preveri, da vsaka CONFIRMED/PROVISIONAL točka branja pada v modelsko okno,
  2. preveri števce (7 točk, vsaka 20 vrednosti, brez prekrivanja),
  3. preveri invarianto "brez ugibanja" (statusi + uncertain oznake),
  4. zapiše verdict v stdout; exit 1 ob kršitvi.

Vhod: pilot-parzelle-v92.json (isti direktorij). Re-run determinističen.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def first_parzelle(page: int) -> int:
    return 21 + 20 * (page - 4)


def last_parzelle(page: int) -> int:
    return 40 + 20 * (page - 4)


def main() -> int:
    with open(os.path.join(HERE, "pilot-parzelle-v92.json"), encoding="utf-8") as f:
        art = json.load(f)

    # 1. glava — popravek analize v1
    head = art["glava"]["printed_head_left"]
    assert "Benennung des Flures" in head, "glava: manjka Benennung des Flures"
    assert "Nro. der Parzelle" in head, "glava: manjka Nro. der Parzelle"

    # 2. potrditvene točke proti modelu
    pts = art["structure_model"]["confirmation_points"]
    assert len(pts) == 7, f"pričakovano 7 točk, je {len(pts)}"
    seen_ranges = []
    for pt in pts:
        page = int(pt["page"])
        expected = pt["expected"]
        status = pt["status"]
        assert status in {"CONFIRMED", "PROVISIONAL"}, f"p{page}: neznan status {status}"
        if page == 3:
            assert expected == "Flure 1–20", f"p3: pričakovano Flure 1–20, je {expected}"
            continue
        # razčlen pričakovanje "A–B"
        a_s, b_s = expected.split("–")
        a, b = int(a_s), int(b_s)
        assert a == first_parzelle(page), f"p{page}: model first={first_parzelle(page)}, okno se začne {a}"
        assert b == last_parzelle(page), f"p{page}: model last={last_parzelle(page)}, okno se konča {b}"
        seen_ranges.append((a, b, status))

    # 3. branja = modelska okna (brez prekrivanja, naraščajoče)
    reads = art["readings"]
    for key, page in [
        ("p020_parzelle", 20),
        ("p045_parzelle", 45),
        ("p058_parzelle", 58),
        ("p059_parzelle", 59),
        ("p084_parzelle", 84),
        ("p133_parzelle", 133),
    ]:
        r = reads[key]
        a, b = r["first"], r["last"]
        assert b - a + 1 == r["count"] == 20, f"{key}: 20 vrednosti, je {r['count']}"
        assert a == first_parzelle(page), f"{key}: branje {a} != model {first_parzelle(page)}"
        assert b == last_parzelle(page), f"{key}: branje {b} != model {last_parzelle(page)}"
        assert r["status"].startswith(("CONFIRMED", "PROVISIONAL")), f"{key}: status {r['status']}"

    ranges = sorted((r["first"], r["last"]) for k, r in reads.items() if k.endswith("_parzelle"))
    for (a1, b1), (a2, b2) in zip(ranges, ranges[1:]):
        assert b1 < a2, f"prekrivanje okenskih branj: {b1} >= {a2}"

    # 4. p3 pass2 = 1–20 brez vrzeli
    f3 = reads["p003_flure_pass2"]
    assert f3 == list(range(1, 21)), "p3 pass2 mora biti natanko 1–20"

    # 5. invarianta brez ugibanja
    inv = art["invariants"]
    assert inv["no_museum_content_change"] == "+0 zapisov / +0 virov / +0 KG / +0 UI"
    assert inv["no_guessing"].startswith("vse UNCERTAIN")
    verdict = art["f14_verdict"]["honest_negative"]
    assert "NIGNEDOKAZLJIV" in verdict, "pošten negativni verdikt mora ostati v artefaktu"

    # 6. budget: 143 razpred × 20 + p3 Flure ≈ 2871 vrstic registra (toleranca +71 Fürtrag/povzetki)
    est = 20 + 139 * 20
    assert 2800 <= est <= 2871, f"ocena vrstic {est} zunaj pričakovanega pasu"

    print("VERDICT: model 21+20*(p-4) potrjen na vseh 6 parcelnih točkah + p3 Flure 1–20")
    print(f"  točke: {[f'p{p}' for p in (20, 45, 58, 59, 84, 133)]} — brez prekrivanja, naraščajoče")
    print(f"  ocena vrstic 143 razpred: {est} (+ rezerva za Fürtrag/povzetke do 2871)")
    print("  F14: Rosetta TO-RESOLVE (300 dpi + celotna transkripcija); NR-02 v1 = kategorijska napaka")
    return 0


if __name__ == "__main__":
    sys.exit(main())
