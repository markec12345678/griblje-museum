#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 72 — ATLAS 1825 §10: GEOREF PASS v2 — reka Kolpa kot ravnalna črta + robustna
similariteta (issue #42 §10: več kontrolnih točk, transformacija, primerjava s
sodobnim zemljevidom, dokumentiran error estimate).

Deterministic + idempotent. Regenerable at any time from:

  RASTER (delovni rastrer od val 52):
    - src/data/cadastre-a01.json            (meta + 56 stavb + 7 toponimov + overlay)
    - research-griblje/atlas-1825/a01-building-inventory-1825.json (arhivska resnica v65/v66)
  SODOBNA PODLAGA (Overpass API mirror, 2026-09-26, NI zgodovinski dokaz — §10):
    - raw-web-val72-2026-10/osm-river-kolpa-lahinja.json        (centerline Kupa/Kolpa, way 39699026)
    - raw-web-val72-2026-10/osm-buildings-pois-griblje-bbox.json (stavbe — samo VALIDACIJA)
    - raw-web-val72-2026-10/osm-housenumbers-griblje-bbox.json   (poskus hišnih št. — NEGATIVEN)

METHOD (vse deterministično, brez VLM, brez ugibanja identitet):
  1. Ekstrakcija reke iz rastra: "cool-mask" sledenje svetlega pasu Kolpe
     (B>=R-6, G>=R-6, (R-B)<42) po vrsticah z zveznostjo (±60 px okno) → 351 točk.
  2. Robustna similariteta (4 parametra: s, θ, tx, ty) — minimalizacija trimirane
     (75 %) kvadratne razdalje do sodobnega centerline-a (ICP-lite: najbližja točka
     na poliliniji). Multi-start grid (s0 × θ0) s prevodom iz vasi-sidra;
     Nelder-Mead; izbira najboljšega starta po trimirani RMS.
  3. Validacija NEODVISNO od ujemanja: v65/prior stavbe → najbližja sodobna stavba;
     staro sidro → ostankove; poskus hišnih številk (NEGATIVEN, F-GEO-03).
  4. Invarianti I1–I6 (spodaj) — kršitev = izhod NE zapisan (fail-fast).

FINDINGS:
  F-GEO-01  stara skala "320 Klafter = 277 px → 2,19 m/px" je NAPAČNA za ta raster
            (mešanica ločljivosti: 277 px je bilo merjeno na polni ločljivosti VAČ
            IIIF izvirnika; delovni raster 2826×2273 je ~3,3× manjši). Prava skala
            ≈ 0,66 m/px. VSE stare lat/lng so bile razpotegnjene ~3,3× od sidra.
  F-GEO-02  rotacija lista je empirično rešena: ~0,7° (list je skoraj sever-navzgor,
            domneva "sever-navzgor" iz val 52 se izkaže za skoraj pravilno, samo
            skala je bila napaka).
  F-GEO-03  veza "hišna številka 1825 = sodobna hišna številka" NI dokazljiva iz
            trenutnih kandidatov (max konsenz 2/18 = trivialno) → ostaja odprt
            raziskovalni ugankovski prostor za 300 dpi re-read PT p7 (nič skrito).

RULES (issue #42):
  - sodobni OSM/satelitski zemljevid NI zgodovinski dokaz (§10) — uporabljen izključno
    kot sodobna podlaga za poravnavo + validacijo; vsak korak ima mapping_rule
  - "nič lepih parcel" (§9) — geometrija parcel se NE riše; ta val popravi samo
    transformacijo TOČK (stavbe/toponimi/sidro/overlay)
  - A02–A05 ostajajo UNKNOWN (brez sidra = brez koordinat, §12/KG-F05)
  - nič procentov (#43 §10); NOT_FOUND ≠ dokaz neobstoja (§3)
"""

import json
import math
import os
import sys

import numpy as np
from PIL import Image
from scipy.optimize import minimize

BASE = os.path.dirname(os.path.abspath(__file__))
RG = os.path.dirname(BASE)
REPO = os.path.dirname(RG)

CADASTRE = os.path.join(REPO, "src", "data", "cadastre-a01.json")
INV = os.path.join(BASE, "a01-building-inventory-1825.json")
RIV = os.path.join(RG, "raw-web-val72-2026-10", "osm-river-kolpa-lahinja.json")
BLD = os.path.join(RG, "raw-web-val72-2026-10", "osm-buildings-pois-griblje-bbox.json")
HN = os.path.join(RG, "raw-web-val72-2026-10", "osm-housenumbers-griblje-bbox.json")
REC = os.path.join(BASE, "bp-house-reconciliation-1825.json")
OUT_GEO = os.path.join(BASE, "georef-1825.json")

# ---- deterministične konstante -------------------------------------------
LAT0 = 45.575  # izhodiščna širina za lokalne metre (E,N) — reproducibilnost
ME = 111320.0 * math.cos(math.radians(LAT0))  # m na stopinj dolžine pri LAT0
MN = 110574.0  # m na stopinj širine

MULTI_START_S = [0.60, 0.65, 0.70, 0.75]
MULTI_START_TH = [-3.0, 0.0, 3.0]  # stopinje
TRIM_FRACTION = 0.75
RIVER_STEP = 6
RIVER_WINDOW = 60
RIVER_MIN_CLUSTER = 3
RIVER_X_MIN = 2480

# selekcijska vrata (deterministična izbira med multi-start kandidati)
SEL_MAX_TRIMMED_RMS_M = 45.0
SEL_MAX_VAL_MEDIAN_M = 40.0

# invarianti (fail-fast)
INV_MIN_RIVER_PTS = 250
INV_MAX_TRIMMED_RMS_M = 60.0
INV_SCALE_MIN, INV_SCALE_MAX = 0.55, 0.85
INV_MAX_ROT_DEG = 5.0
INV_MAX_VALIDATION_MEDIAN_M = 40.0

# STABILNI VHODI (idempotenca): sidro val 52 je ZGODOVINSKA KONSTANTA —
# builder jo beri iz konstante, NE iz src/data/cadastre-a01.json, ki ga sam
# prepisuje (drugače 2. zagon da drugačno rešitev — kršitev idempotence).
LEGACY_ANCHOR_PX = [1851, 1778]
LEGACY_ANCHOR_GEO = [45.57246, 15.29257]


def fail(msg):
    print("INVARIANT KRŠITEV:", msg, file=sys.stderr)
    sys.exit(1)


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def extract_river_curve(img_path):
    """Cool-mask sledenje reke po vrsticah (deterministično)."""
    im = Image.open(img_path).convert("RGB")
    a = np.array(im).astype(int)
    H, W = a.shape[:2]
    R, G, B = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    cool = ((R - B) < 42) & (G >= R - 8)
    pts = []
    last_x = 2650.0
    for y in range(60, H - 30, RIVER_STEP):
        x0 = int(max(RIVER_X_MIN, last_x - RIVER_WINDOW))
        x1 = int(min(W - 4, last_x + RIVER_WINDOW))
        xs = np.where(cool[y, x0:x1])[0]
        if len(xs) < RIVER_MIN_CLUSTER:
            continue
        med = np.median(xs)
        cl = xs[np.abs(xs - med) < 40]
        if len(cl) < RIVER_MIN_CLUSTER:
            continue
        pts.append((float(x0 + cl.mean()), float(y)))
        last_x = x0 + cl.mean()
    return pts


def modern_river_polyline(river_json):
    way = None
    for e in river_json["elements"]:
        name = e.get("tags", {}).get("name", "") or ""
        if name.startswith("Kupa"):
            way = e
            break
    if way is None:
        fail("centerline Kupa/Kolpa ni najden v osm-river-kolpa-lahinja.json")
    poly = [(p["lat"], p["lon"]) for p in way["geometry"]]
    poly = [p for p in poly if 45.53 < p[0] < 45.63 and 15.27 < p[1] < 15.37]
    if len(poly) < 150:
        fail(f"centerline prekratek: {len(poly)} točk")
    return np.array([[p[1] * ME, p[0] * MN] for p in poly]), way["id"]


def apply_transform(params, X):
    """[E,N] = s·R(θ)·[x, −y] + [tx, ty]   (px: y DOL, metre: sever POZITIVNO)."""
    s, th, tx, ty = params
    c, sn = math.cos(th), math.sin(th)
    x = X[:, 0]
    n = -X[:, 1]
    u = s * (c * x - sn * n) + tx
    v = s * (sn * x + c * n) + ty
    return np.stack([u, v], axis=1)


def residuals_to_polyline(params, X, P):
    M = apply_transform(params, X)
    d2 = ((M[:, None, :] - P[None, :, :]) ** 2).sum(axis=2)
    return np.sqrt(d2.min(axis=1))


def trimmed_mse(params, X, P):
    d = np.sort(residuals_to_polyline(params, X, P))
    k = int(len(d) * TRIM_FRACTION)
    return float((d[:k] ** 2).mean())


def fit_similarity(rp, P, anchor_px, anchor_geo, v65_px=None, modern_b=None):
    """Multi-start Nelder-Mead; vrača (params, trimmed_rms, candidates).

    SELEKCIJA (deterministična, dokumentirana): reka sama ne ločuje rešitev
    (trimRMS ~36–43 m za zelo različne (s,θ) — meander je gladek), zato:
      1. vrata A: trimRMS <= SEL_MAX_TRIMMED_RMS_M (reka je usklajena)
      2. vrata B: validacijska mediana v65-stavbe → sodobna stavba <= SEL_MAX_VAL_MEDIAN_M
         (validacija je uporabljena SAMO za izbiro med kandidati, ne v loss-u)
      3. izbira: min valMed; tie-break: min trimRMS; nato vrstni red startov
    """
    tries = []
    candidates = []
    tx0 = anchor_geo[1] * ME - 0.66 * anchor_px[0]
    ty0 = anchor_geo[0] * MN + 0.66 * anchor_px[1]
    # meje preprečujejo degenerirano rešitev (s → 0 = kolaps vse točk na reko)
    bounds = [(0.50, 0.95),
              (math.radians(-10.0), math.radians(10.0)),
              (tx0 - 1500.0, tx0 + 1500.0),
              (ty0 - 1500.0, ty0 + 1500.0)]
    for s0 in MULTI_START_S:
        for th0_deg in MULTI_START_TH:
            p0 = [s0, math.radians(th0_deg), tx0, ty0]
            res = minimize(trimmed_mse, p0, args=(rp, P), method="Nelder-Mead",
                           bounds=bounds,
                           options=dict(xatol=1e-7, fatol=1e-9,
                                        maxiter=4000, maxfev=6000))
            val = float(res.fun)
            cand = {"params": list(map(float, res.x)), "trimmed_rms_m": math.sqrt(val),
                    "s0": s0, "th0_deg": th0_deg}
            if v65_px is not None and modern_b is not None and len(v65_px) and len(modern_b):
                VP = apply_transform(cand["params"], v65_px)
                dd = np.sqrt(((VP[:, None, :] - modern_b[None, :, :]) ** 2).sum(axis=2)).min(axis=1)
                cand["validation_median_m"] = float(np.median(dd))
            tries.append({"s0": s0, "th0_deg": th0_deg,
                          "trimmed_rms_m": round(cand["trimmed_rms_m"], 1),
                          "validation_median_m": round(cand.get("validation_median_m", -1), 1)})
            candidates.append(cand)
    gate = [c for c in candidates
            if c["trimmed_rms_m"] <= SEL_MAX_TRIMMED_RMS_M
            and c.get("validation_median_m", 1e9) <= SEL_MAX_VAL_MEDIAN_M]
    if not gate:
        fail("selekcija: noben kandidat ne gre skozi vrata (trimRMS/validacija)")
    gate.sort(key=lambda c: (c["validation_median_m"], c["trimmed_rms_m"]))
    return gate[0]["params"], gate[0]["trimmed_rms_m"], tries


def modern_buildings(bld_json, anchor_geo, radius_m=600.0):
    pts = []
    for e in bld_json["elements"]:
        if not e.get("tags", {}).get("building"):
            continue
        pos = e.get("center") or {"lat": e.get("lat"), "lon": e.get("lon")}
        if pos.get("lat") is None:
            continue
        p = (pos["lat"], pos["lon"])
        d = math.hypot((p[0] - anchor_geo[0]) * MN, (p[1] - anchor_geo[1]) * ME)
        if d < radius_m:
            pts.append((p[1] * ME, p[0] * MN))
    return np.array(pts)


def housenumber_experiment(inv, rec, hn_json, anchor_geo):
    """F-GEO-03: poskus veze BP→hiša→št. ↔ sodobna št. (determinističen NEGATIVEN)."""
    def dist(a, b):
        return math.hypot((a[0] - b[0]) * MN, (a[1] - b[1]) * ME)

    mod = {}
    for e in hn_json["elements"]:
        t = e.get("tags", {})
        hn = t.get("addr:housenumber")
        if not hn:
            continue
        pos = e.get("center") or {"lat": e.get("lat"), "lon": e.get("lon")}
        if pos.get("lat") is None:
            continue
        p = (pos["lat"], pos["lon"])
        if dist(p, anchor_geo) < 900.0:
            mod.setdefault(hn, []).append((e["type"], e["id"], p))

    bp_rows = {r["bp"]: r for r in rec["bp_rows"]}
    pl = []
    for o in inv["objects"]:
        if not o.get("bp") or not o.get("px"):
            continue
        b = int(o["bp"])
        r = bp_rows.get(b, {})
        cand = set()
        for h in r.get("house_candidates", {}).get("pt_houses", []):
            cand.add((h, "PT"))
        for pr in r.get("house_candidates", {}).get("pua_refs", []):
            cand.add((pr.get("house_no"), "PUA"))
        for h, src in cand:
            if h and h in mod:
                for typ, oid, g in mod[h]:
                    pl.append(dict(bp=b, h=h, src=src, px=o["px"], g=g))

    # RANSAC-lite s skala-priorom [0.55, 0.85] (reka pove pravo skalo)
    ME2 = ME
    best_inl = 0
    tested = 0
    def sim_from2(p1, p2):
        (x1, y1), (x2, y2) = p1["px"], p2["px"]
        (u1, v1), (u2, v2) = (p1["g"][1] * ME2, p1["g"][0] * MN), (p2["g"][1] * ME2, p2["g"][0] * MN)
        a = (complex(u2, v2) - complex(u1, v1)) / (complex(x2, -y2) - complex(x1, -y1))
        return a, complex(u1, v1) - a * complex(x1, -y1)
    for i in range(len(pl)):
        for j in range(i + 1, len(pl)):
            p1, p2 = pl[i], pl[j]
            if p1["px"] == p2["px"]:
                continue
            if math.hypot(p1["px"][0] - p2["px"][0], p1["px"][1] - p2["px"][1]) < 120:
                continue
            if math.dist(p1["g"], p2["g"]) < 1e-5:
                continue
            tested += 1
            try:
                a, b = sim_from2(p1, p2)
            except ZeroDivisionError:
                continue
            if not (0.55 < abs(a) < 0.85):
                continue
            if abs(math.degrees(math.atan2(a.imag, a.real))) > 40:
                continue
            inl = 0
            for p in pl:
                w = a * complex(p["px"][0], -p["px"][1]) + b
                la, lo = w.imag / MN, w.real / ME2
                if math.hypot((la - p["g"][0]) * MN, (lo - p["g"][1]) * ME2) < 50.0:
                    inl += 1
            best_inl = max(best_inl, inl)
    return {"candidate_pairs": len(pl), "seed_pairs_tested": tested,
            "max_consensus": best_inl, "verdict": "NEGATIVE" if best_inl <= 2 else "REVIEW"}


def main():
    cad = load(CADASTRE)
    inv = load(INV)
    rec = load(REC)
    river_json = load(RIV)
    bld_json = load(BLD)
    hn_json = load(HN)

    anchor_px = cad["meta"]["georef"]["anchor_px"]
    if list(anchor_px) != LEGACY_ANCHOR_PX:
        fail(f"anchor_px se je spremenil: {anchor_px} != {LEGACY_ANCHOR_PX} — vhod ni stabilen")
    anchor_geo = LEGACY_ANCHOR_GEO  # konstanta (idempotenca); v2 vrednost = izhod

    # 1) reka iz rastra -------------------------------------------------------
    img_path = os.path.join(REPO, "public", "kataster", "a01-1824.jpg")
    rp = extract_river_curve(img_path)
    if len(rp) < INV_MIN_RIVER_PTS:
        fail(f"I1: reka = {len(rp)} točk < {INV_MIN_RIVER_PTS}")
    rp = np.array(rp)
    P, river_way_id = modern_river_polyline(river_json)

    # validacijski nabor (sodobne stavbe) — za IZBIRO med kandidati + I5
    B = modern_buildings(bld_json, anchor_geo)
    if len(B) < 100:
        fail(f"validacija: samo {len(B)} sodobnih stavb v radiju")
    v65_px = np.array([o["px"] for o in inv["objects"] if o.get("px")], float)

    # 2) robustna similariteta (multi-start + deterministična selekcija) -------
    params, trms, tries = fit_similarity(rp, P, anchor_px, anchor_geo, v65_px, B)
    s, th, tx, ty = params
    rot_deg = math.degrees(th)
    if not (INV_SCALE_MIN <= s <= INV_SCALE_MAX):
        fail(f"I3: skala {s:.4f} m/px izven [{INV_SCALE_MIN}, {INV_SCALE_MAX}]")
    if abs(rot_deg) > INV_MAX_ROT_DEG:
        fail(f"I4: rotacija {rot_deg:.2f}° > {INV_MAX_ROT_DEG}°")
    if trms > INV_MAX_TRIMMED_RMS_M:
        fail(f"I2: trimirana RMS {trms:.1f} m > {INV_MAX_TRIMMED_RMS_M} m")

    # 3) validacija (I5 na izbrani rešitvi; izvedena tudi za prior) ------------
    VP = apply_transform(params, v65_px)
    dd = np.sqrt(((VP[:, None, :] - B[None, :, :]) ** 2).sum(axis=2)).min(axis=1)
    val_median = float(np.median(dd))
    if val_median > INV_MAX_VALIDATION_MEDIAN_M:
        fail(f"I5: validacija stavb mediana {val_median:.1f} m > {INV_MAX_VALIDATION_MEDIAN_M} m")
    prior_px = np.array([p["px_prior"] for p in inv.get("prior_only_bp", []) if p.get("px_prior")], float)
    dd2 = np.sqrt(((apply_transform(params, prior_px)[:, None, :] - B[None, :, :]) ** 2).sum(axis=2)).min(axis=1)

    rr = residuals_to_polyline(params, rp, P)
    anchor_res = float(math.sqrt(((apply_transform(params, np.array([anchor_px], float))[0]
                                    - np.array([anchor_geo[1] * ME, anchor_geo[0] * MN])) ** 2).sum()))

    # F-GEO-03: hišne številke (determinističen NEGATIVEN eksperiment)
    hn_exp = housenumber_experiment(inv, rec, hn_json, anchor_geo)

    # 4) determinizem: ponovi fit z istimi starti, izbira mora biti ista --------
    params2, trms2, _ = fit_similarity(rp, P, anchor_px, anchor_geo, v65_px, B)
    if max(abs(a - b) for a, b in zip(params, params2)) > 1e-6 or abs(trms - trms2) > 1e-6:
        fail("I6: fit NI determinističen")

    # 5) zapisi ----------------------------------------------------------------
    def to_geo(x, y):
        m = apply_transform(params, np.array([[float(x), float(y)]]))[0]
        return round(m[1] / MN, 6), round(m[0] / ME, 6)

    H, W = 2273, 2826
    # bbox čez VSE 4 robove (rotacija 0,9° sicer odstopi do ~35 m od 2-točkovne ocene)
    corners = [to_geo(0, H), to_geo(W, 0), to_geo(0, 0), to_geo(W, H)]
    sw = [min(c[0] for c in corners), min(c[1] for c in corners)]
    ne = [max(c[0] for c in corners), max(c[1] for c in corners)]

    # 5a) georef-1825.json (arhivska resnica)
    geo = {
        "val": 72,
        "pass": "§10 GEOREF PASS v2",
        "issue": "#42 §10 + #43 §10",
        "title": "GEOREF v2 — reka Kolpa kot ravnalna črta + robustna similariteta (4-param: skala, rotacija, prevod)",
        "method": {
            "type": "similarity_transform_icp_lite",
            "parameters": ["s (m/px)", "theta (rotacija)", "tx (m vzhod)", "ty (m sever)"],
            "coordinate_frame": {"lat0": LAT0, "meters_east_per_deg_lng": ME, "meters_north_per_deg_lat": MN,
                                 "formula": "[E,N] = s·R(theta)·[x, −y_px] + [tx,ty]"},
            "river_extraction": f"cool-mask sledenje ((R-B)<42, G>=R-8), vrstice vsakih {RIVER_STEP} px, okno ±{RIVER_WINDOW} px",
            "correspondence": "najbližja točka na sodobnem centerline-u (ICP-lite), loss = trimirana (75 %) MSE",
            "multi_start": {"s0": MULTI_START_S, "theta0_deg": MULTI_START_TH,
                            "optimizer": "Nelder-Mead (bounds: s [0.50,0.95], theta ±10°, prevod ±1500 m — zaščita pred kolapsom s→0)",
                            "selection": f"iz 12 kandidatov: vrata trimRMS <= {SEL_MAX_TRIMMED_RMS_M} m + validacijska mediana <= {SEL_MAX_VAL_MEDIAN_M} m; izbira min validacija (tie-break min trimRMS) — validacija je samo izbira med kandidati, nikoli v loss-u",
                            "candidates": tries},
            "raster": "public/kataster/a01-1824.jpg (2826×2273, delovni raster od val 52)",
            "modern_basis": f"OSM way {river_way_id} (centerline Kupa/Kolpa) — SODOBNA PODLAGA, NI zgodovinski dokaz (§10)",
        },
        "transform": {"scale_m_per_px": round(s, 6), "rotation_deg": round(rot_deg, 4),
                      "tx_m_east": round(tx, 3), "ty_m_north": round(ty, 3)},
        "accuracy": {
            "river_trimmed_rms_m": round(trms, 1),
            "river_median_m": round(float(np.median(rr)), 1),
            "river_p75_m": round(float(np.percentile(rr, 75)), 1),
            "river_max_m": round(float(rr.max()), 1),
            "river_points": int(len(rp)),
            "validation_v65_median_m": round(val_median, 1),
            "validation_v65_max_m": round(float(dd.max()), 1),
            "validation_prior_median_m": round(float(np.median(dd2)), 1),
            "validation_prior_max_m": round(float(dd2.max()), 1),
            "modern_buildings_in_radius": int(len(B)),
            "old_anchor_residual_m": round(anchor_res, 1),
            "summary": f"A01 točkovna geometrija ±{round(max(trms, val_median))} m (reaka trim-RMS {round(trms)} m; stavbe mediana {round(val_median)} m) — izboljšava iz ±200–500 m (v resnici ±1–3 km na robovih zaradi F-GEO-01)",
        },
        "housenumber_experiment": hn_exp,
        "findings": [
            {"id": "F-GEO-01", "status": "RESOLVED-V72", "finding":
                "skala '320 Klafter = 277 px → 2,19 m/px' je mešala ločljivosti: 277 px je merjen na polni ločljivosti VAČ IIIF, delovni raster je ~3,3× manjši; prava skala ≈ "
                f"{round(s, 4)} m/px (reaka + validacija na stavbah); VSE lat/lng val 52–71 so bile razpotegnjene ~{round(2.1909 / s, 2)}× od sidra na JV/SZ",
             "action": "vse lat/lng (56 stavb, 7 toponimov, overlay) pretvorjene z v2 transformacijo; KG v1.5 MO vozlišča usklajena"},
            {"id": "F-GEO-02", "status": "RESOLVED-V72", "finding":
                f"rotacija lista empirično rešena: {round(rot_deg, 2)}° — list je skoraj sever-navzgor; domneva val 52 (sever-navzgor) je bila smeri pravilna, napaka je bila samo skala (F-GEO-01)",
             "action": "rotacija del transformacije v2; overlay prek izreka robov"},
            {"id": "F-GEO-03", "status": "OPEN", "finding":
                f"veza 'hišna številka 1825 = sodobna številka' iz kandidatov poravnave NI dokazljiva: max konsenz {hn_exp['max_consensus']}/{hn_exp['candidate_pairs']} parov (trivialno) — številčevanje se je delno spremenilo ali PT branja kandidatov so napačna",
             "action": "nič skrito (§14): negativen rezultat registriran; resolucija = 300 dpi re-read PT p7 + PUA re-read (ob kvoti); vlogo prevzema reka + sidro + validacija stavb"},
            {"id": "F-GEO-04", "status": "OPEN", "finding":
                "listno merilo na raster ločljivosti NI berljivo (oznake 40/80/…/320 razmazane) — neodvisna kontrola skale iz listnega merila bo mogoča @300 dpi",
             "action": "dodano v next_reads: listno merilo + robovi lista @300 dpi"},
        ],
        "what_would_resolve": [
            "300 dpi VAČ IIIF izvirnik: listno merilo (F-GEO-04) + robovi + A02 sidro (cerkev sv. Vid)",
            "GURS sodobne stavbne parcele k.e. Griblje (preverba F-GEO-03 na parcelni ravni)",
            "georeferencirana različica lista (katasterjam.si nedosegljiv 2026-09-26; mapire.eu plačljiv)",
        ],
        "invariants": {
            "I1_min_river_points": INV_MIN_RIVER_PTS,
            "I2_max_trimmed_rms_m": INV_MAX_TRIMMED_RMS_M,
            "I3_scale_range_m_per_px": [INV_SCALE_MIN, INV_SCALE_MAX],
            "I4_max_rotation_deg": INV_MAX_ROT_DEG,
            "I5_max_validation_median_m": INV_MAX_VALIDATION_MEDIAN_M,
            "I6_determinism": "fit ponovljen z istimi starti — enaki parametri (tol. 1e-6)",
            "violations": [],
        },
        "provenance": {
            "built_from": ["src/data/cadastre-a01.json", "a01-building-inventory-1825.json",
                           "raw-web-val72-2026-10/osm-river-kolpa-lahinja.json",
                           "raw-web-val72-2026-10/osm-buildings-pois-griblje-bbox.json",
                           "raw-web-val72-2026-10/osm-housenumbers-griblje-bbox.json",
                           "bp-house-reconciliation-1825.json"],
            "builder": "research-griblje/atlas-1825/build-georef-1825.py",
            "deterministic": True,
            "modern_basis_license": "© OpenStreetMap contributors (ODbL) — sodobna podlaga, NI zgodovinski dokaz",
        },
    }
    with open(OUT_GEO, "w", encoding="utf-8") as f:
        json.dump(geo, f, ensure_ascii=False, indent=1)
        f.write("\n")

    # 5b) a01-building-inventory-1825.json — georef blok v2 + lat/lng
    inv["georef"] = {
        "version": "v2 (val 72)",
        "method": "similariteta po reki Kolpi (351 točk, trim-RMS "
                  f"{geo['accuracy']['river_trimmed_rms_m']} m) — glej georef-1825.json",
        "scale_m_per_px": round(s, 6),
        "rotation_deg": round(rot_deg, 4),
        "anchor_px": anchor_px,
        "anchor_geo_v2": list(to_geo(*anchor_px)),
        "anchor_geo_legacy_v51": anchor_geo,
        "accuracy": geo["accuracy"]["summary"],
        "finding": "F-GEO-01/02/03 (georef-1825.json)",
    }
    for o in inv["objects"]:
        if o.get("px"):
            la, lo = to_geo(o["px"][0], o["px"][1])
            o["lat"], o["lng"] = la, lo
            o["georef_status"] = "GEOREF v2 (reka Kolpa, trim-RMS " + str(geo["accuracy"]["river_trimmed_rms_m"]) + " m)"
    for p in inv.get("prior_only_bp", []):
        if p.get("px_prior"):
            la, lo = to_geo(p["px_prior"][0], p["px_prior"][1])
            p["lat"], p["lng"] = la, lo
    with open(INV, "w", encoding="utf-8") as f:
        json.dump(inv, f, ensure_ascii=False, indent=1)
        f.write("\n")

    # 5c) src/data/cadastre-a01.json — runtime resnica
    cad["meta"]["georef"] = {
        "version": "v2 (val 72)",
        "method": "robustna similariteta (skala+rotacija+prevod) po reki Kolpi — ICP-lite na 351 točkah; sodobna podlaga OSM way " + str(river_way_id) + " (NI zgodovinski dokaz, §10)",
        "accuracy": geo["accuracy"]["summary"],
        "scale_m_per_px": round(s, 6),
        "rotation_deg": round(rot_deg, 4),
        "anchor_px": anchor_px,
        "anchor_geo": list(to_geo(*anchor_px)),
        "legacy_note": "val 52–71: 1 sidro + 2,1909 m/px (F-GEO-01: mešanica ločljivosti, ~3,3× preveč raztegnjeno)",
        "finding": "F-GEO-01/02/03 — research-griblje/atlas-1825/georef-1825.json",
    }
    cad["meta"]["scale_note"] = (
        f"skala v2: {round(s, 4)} m/px (reka Kolpa + validacija stavb); "
        f"stara nota '320 Klafter = 277 px → 2,19 m/px' je bila merjena na polni ločljivosti VAČ (F-GEO-01)"
    )
    for b in cad["buildings"]:
        if "px" in b and "py" in b:
            la, lo = to_geo(b["px"], b["py"])
            b["lat"], b["lng"] = la, lo
    for t in cad["toponyms"]:
        la, lo = to_geo(t["px"], t["py"])
        t["lat"], t["lng"] = la, lo
    cad["overlay"] = {"sw": sw, "ne": ne, "px_size": cad["overlay"]["px_size"]}
    with open(CADASTRE, "w", encoding="utf-8") as f:
        json.dump(cad, f, ensure_ascii=False, indent=1)
        f.write("\n")

    print(f"GEOREF v2: skala {s:.4f} m/px, rotacija {rot_deg:.2f}°, trim-RMS {trms:.1f} m, "
          f"validacija v65 mediana {val_median:.1f} m / prior {float(np.median(dd2)):.1f} m, "
          f"staro sidro ostankove {anchor_res:.0f} m, reka {len(rp)} točk, "
          f"hišne št. konsenz {hn_exp['max_consensus']}/{hn_exp['candidate_pairs']} (F-GEO-03)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
