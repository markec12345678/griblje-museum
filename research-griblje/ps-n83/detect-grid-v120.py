#!/usr/bin/env python3
"""Val 120 — detekcija vrstične mreže za 2. oči vzorec (deterministično, 0 VLM).

Metoda (črnilno-pravilni sidr, protokol 138 §2 + val 120 izboljšava):
  1. horizontalne črnilne črte v imenskem pasu (X 370–600) = vrstični vrhovi
     (kontrolirano na p44/p50: pravilo se ujema z TOP0 + STEP*k na ±1 px);
  2. glasovanje: hipoteza TOP0 = rule − STEP*k; zmagovalec = max pravil
     znotraj ±2.5 px od mreže (manjkajoče črte ne lomijo mreže, tujki ne
     štejejo);
  3. LSQ refineman (TOP0, STEP_local ∈ [37.5, 40.0]) čez matched pravila
     — pageno-specifičen korak absorbira skenirni razteg (na p44 je čisti
     STEP 38.85 zaostal za pravili za ~0.5 px/vrstico);
  4. parzelle-cifre (X 158–232) = sekundarni pokazatelj pokritosti slotov.

Izhod: JSON per stran {page, size, n_rules, matched_slots, rule_hits, top0,
step_local, ...}. Mreža je SAMODOKAZUJOČA — slotov ne skrčimo na pričakovano
št. vrstic; odstopanja (Fürtrag pas, izpuščene vrstice) so najdbe.

Uporaba: python3 detect-grid-v120.py 17 19 20 ... (brez arg = vzorec val 120)
"""
import json
import sys

import numpy as np
from PIL import Image

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
STEP = 38.85
NAME_X = (370, 600)
PARZ_X = (158, 232)

SAMPLE_V120 = [17, 19, 20, 25, 26, 31, 32, 37, 38, 43, 44, 49, 50, 55]


def rule_candidates(a):
    """Horizontalne črnilne črte v imenskem pasu."""
    band = a[:, NAME_X[0]:NAME_X[1]]
    dark = (band < 140).mean(axis=1)
    rules = []
    y = 100
    H = a.shape[0]
    while y < H - 30:
        if dark[y] > 0.28:
            y2 = y
            while y2 < H - 1 and dark[y2] > 0.22:
                y2 += 1
            if y2 - y < 6:
                rules.append(y)
            y = y2 + 1
        else:
            y += 1
    return rules


def digit_candidates(a):
    """Temni pasovi (cifre) v parzelle koloni."""
    pband = a[:, PARZ_X[0]:PARZ_X[1]]
    pdark = (pband < 120).sum(axis=1)
    sm = np.convolve(pdark, np.ones(5) / 5, mode='same')
    digs = []
    y = 130
    H = a.shape[0]
    while y < H - 20:
        if sm[y] > 12:
            y2 = y
            while y2 < H - 1 and sm[y2] > 8:
                y2 += 1
            yy = np.arange(y, y2)
            w = sm[y:y2].copy()
            w[w < 8] = 0
            cen = float((yy * w).sum() / w.sum()) if w.sum() else (y + y2) / 2
            digs.append(round(cen, 1))
            y = y2 + 8
        else:
            y += 1
    return digs


def fit_grid(rules, max_slots=24):
    """Glasovanje (TOP0) + LSQ refineman (TOP0, STEP_local)."""
    TOL_S = 2.5
    best = None  # ((-hits, h0), h0, hits)
    for r in rules:
        for k in range(max_slots):
            h0 = r - STEP * k
            if h0 < 60:
                continue
            hits = 0
            for q in rules:
                kk = round((q - h0) / STEP)
                if 0 <= kk < max_slots and abs(q - (h0 + STEP * kk)) <= TOL_S:
                    hits += 1
            key = (-hits, round(h0, 1))
            if best is None or key < best[0]:
                best = (key, h0, hits)
    top0 = best[1]
    pts = []
    for q in rules:
        k = round((q - top0) / STEP)
        if 0 <= k < max_slots and abs(q - (top0 + STEP * k)) <= TOL_S:
            pts.append((k, q))
    step_local = STEP
    if len(pts) >= 4:
        ks = np.array([p[0] for p in pts], dtype=float)
        ys = np.array([p[1] for p in pts], dtype=float)
        b, a0 = np.polyfit(ks, ys, 1)
        if 37.5 <= b <= 40.0:
            step_local = round(float(b), 2)
            top0 = round(float(a0), 1)
    return {'top0': top0, 'step_local': step_local, 'rule_hits': len(pts),
            'matched_slots': sorted(k for k, _ in pts)}


def vertical_rules(a):
    vband = a[180:min(940, a.shape[0]), :]
    vdark = (vband < 140).mean(axis=0)
    vcols = []
    x = 0
    W = a.shape[1]
    while x < W:
        if vdark[x] > 0.40:
            x2 = x
            while x2 < W - 1 and vdark[x2] > 0.40:
                x2 += 1
            vcols.append(x)
            x = x2 + 1
        else:
            x += 1
    return vcols


def detect(pg):
    im = Image.open(f'{SRC}/p{pg}.jpg').convert('L')
    a = np.asarray(im, dtype=np.int16)
    rules = rule_candidates(a)
    digs = digit_candidates(a)
    fit = fit_grid(rules)
    # pokritost slotov s ciframi (parzelle) glede na končno mrežo
    top0, sl = fit['top0'], fit['step_local']
    dig_slots = sorted({round((d - STEP / 2 - top0) / sl) for d in digs
                        if 0 <= round((d - STEP / 2 - top0) / sl) < 24
                        and abs(d - (top0 + STEP / 2 + sl * round((d - STEP / 2 - top0) / sl))) <= 4.0})
    return {'page': pg, 'size': [a.shape[1], a.shape[0]],
            'n_rules': len(rules), 'rules': rules,
            'rule_hits': fit['rule_hits'], 'matched_slots': fit['matched_slots'],
            'n_dig_candidates': len(digs), 'dig_slots': dig_slots,
            'top0': fit['top0'], 'step_local': fit['step_local'],
            'vertical_rules': vertical_rules(a)}


if __name__ == '__main__':
    pages = [int(x) for x in sys.argv[1:]] or SAMPLE_V120
    out = {p: detect(p) for p in pages}
    json.dump(out, sys.stdout, indent=1)
