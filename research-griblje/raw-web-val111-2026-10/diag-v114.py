#!/usr/bin/env python3
"""
Val 114 — diag composite: za stran pNN in vrstice rI,J,... izreže bands
iz IZMERJENIH pravil (ista detekcija kot make-z3-v113.py), stakne ×10
z oznakami "rN old=BASE". Izhod: crops-v114diag/pNN-rI-rJ.png
"""
import json
import os
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageDraw

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v114diag"
os.makedirs(OUT, exist_ok=True)

X0, X1, SCALE = 755, 885, 10
FALLBACK_Y0, FALLBACK_STEP = 158, 38.65


def detect_rules(im, thr=178.0):
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


def detect_best(im, nrows):
    for thr in (178.0, 190.0, 200.0, 210.0):
        r = detect_rules(im, thr)
        if len(r) >= nrows + 1:
            return r, thr
    return detect_rules(im, 178.0), 178.0


def prep(c):
    w, h = c.size
    c = c.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.5)
    return c


def main():
    pg = int(sys.argv[1])
    rows = [int(x) for x in sys.argv[2].split(",")]
    im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
    arr = np.array(im.convert("L"), dtype=float)
    base = json.load(open(f"{REPO}/ps-n83/band-v113/baseline-val57.json"))
    brows = base[str(pg)]
    nrows = len(brows)
    rules, thr_used = detect_best(arr, nrows)
    if len(rules) < nrows + 1:
        rules = [int(FALLBACK_Y0 + i * FALLBACK_STEP) for i in range(nrows + 1)]
    while len(rules) - 1 > nrows:
        tail = rules[-(nrows + 1):]
        k = int(np.argmin(np.diff(tail)))
        del rules[len(rules) - (nrows + 1) + k + 1]
    cells = []
    for i in rows:
        y0, y1 = rules[i], rules[i + 1]
        c = im.crop((X0, y0, X1, y1))
        cells.append(prep(c))
    w = max(c.size[0] for c in cells)
    label_h = 44
    H = sum(c.size[1] + label_h + 8 for c in cells)
    canvas = Image.new("RGB", (w, H), (250, 250, 245))
    d = ImageDraw.Draw(canvas)
    y = 0
    for i, c in zip(rows, cells):
        b = brows[i]
        old = (b["jaethe"] or "") + "|" + (b["klafter"] or "") if b["jaethe"] else b["klafter"]
        d.text((6, y + 10), f"r{i}  base={old}", fill=(0, 0, 0))
        y += label_h
        canvas.paste(c, (0, y))
        y += c.size[1] + 8
    out = f"{OUT}/p{pg:02d}-r{rows[0]}-r{rows[-1]}.png"
    canvas.save(out)
    print(out, canvas.size)


if __name__ == "__main__":
    main()
