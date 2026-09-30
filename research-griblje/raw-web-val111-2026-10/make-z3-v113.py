#!/usr/bin/env python3
"""
Val 113 — z3 skladovni value zoomi z IZMERJENIMI horizontalnimi pravili.
Problem z2/g-stacks: kalibracija Y0/STEP odmika ±5px + pisar piše nizko →
off-by-one atribucija. Z3: za vsako stran programsko izmeri horizontalna
pravila v pasu x 765–875 (temne vrstice), band rN = [rule_N, rule_N+1],
izreži x 755–885 (obe sub-koloni + rdeči rob) ×7 z OZNAKAMI rN, FUR band
pod zadnjim pravilom. Fallback: kalibrirana mreža (Y0=158, STEP=38.65),
če detekcija najde < 19 pravil.
Izhod: crops-v113/z3-pNN-vals.png
"""
import json
import os
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageDraw

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v113"
os.makedirs(OUT, exist_ok=True)

PAGES = list(range(17, 56))
X0, X1, SCALE = 755, 885, 7
FALLBACK_Y0, FALLBACK_STEP = 158, 38.65


def detect_rules(im: np.ndarray, thr: float = 178.0):
    prof = im[:, 765:876].mean(axis=1)
    ys = [y for y in range(140, 1005) if prof[y] < thr]
    groups = []
    for y in ys:
        if groups and y - groups[-1][-1] <= 3:
            groups[-1].append(y)
        else:
            groups.append([y])
    lines = [int(round(np.mean(g))) for g in groups]
    lines = [L for L in lines if 150 <= L <= 955]
    cleaned = []
    for L in lines:
        if cleaned and L - cleaned[-1] <= 12:
            cleaned[-1] = int(round((cleaned[-1] + L) / 2))
            continue
        cleaned.append(L)
    return cleaned


def detect_best(im: np.ndarray, nrows: int):
    for thr in (178.0, 190.0, 200.0, 210.0):
        r = detect_rules(im, thr)
        if len(r) >= nrows + 1:
            return r, thr
    return detect_rules(im, 178.0), 178.0


def prep(c: Image.Image) -> Image.Image:
    w, h = c.size
    c = c.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.5)
    return c


def build(pg: int):
    im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
    arr = np.array(im.convert("L"), dtype=float)
    base = json.load(open(f"{REPO}/ps-n83/band-v113/baseline-val57.json"))
    nrows = len(base[str(pg)])
    rules, thr_used = detect_best(arr, nrows)
    mode = f"measured-thr{thr_used:g}"
    if len(rules) < nrows + 1:
        rules = [int(FALLBACK_Y0 + i * FALLBACK_STEP) for i in range(nrows + 1)]
        mode = "fallback"
    # truncate/merge od konca, dokler bandov > nrows; najkrajši zadnji band se spusti
    while len(rules) - 1 > nrows:
        tail = rules[-(nrows + 1):]
        k = int(np.argmin(np.diff(tail)))
        del rules[len(rules) - (nrows + 1) + k + 1]
    bands = [(f"r{i}", rules[i], rules[i + 1]) for i in range(nrows)]
    fy0 = rules[-1]
    fy1 = min(int(fy0 + 2.3 * 38.65), im.size[1] - 2)
    bands.append(("FUR", fy0, fy1))
    cells = []
    for lab, y0, y1 in bands:
        lab_img = Image.new("RGB", ((X1 - X0) * SCALE // 2, 30), (225, 225, 225))
        d = ImageDraw.Draw(lab_img)
        d.text((6, 7), f"{lab} y{y0}-{y1} {mode}", fill=(0, 0, 0))
        c = prep(im.crop((X0, y0, X1, min(y1 + 4, im.size[1] - 1))))
        cells.append(lab_img)
        cells.append(c)
    W = max(c.size[0] for c in cells)
    sep = 6
    Ht = sum(c.size[1] for c in cells) + sep * len(cells)
    canvas = Image.new("RGB", (W, Ht), (255, 255, 255))
    y = 0
    for c in cells:
        canvas.paste(c, (0, y))
        y += c.size[1] + sep
    canvas.save(os.path.join(OUT, f"z3-p{pg:02d}-vals.png"))
    return len(rules), mode


if __name__ == "__main__":
    pgs = [int(x) for x in sys.argv[1:]] or PAGES
    for pg in pgs:
        n, mode = build(pg)
        print(f"z3 p{pg:02d}: {n} pravil ({mode})", flush=True)
