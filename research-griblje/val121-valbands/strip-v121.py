#!/usr/bin/env python3
"""Val 121 — pasovni re-read celotnega kl stolpca (strani z razhajanji).

Za vsako stran: 5 trakov × 4 vrstice, X 738-878 (ali 688-878 za split),
×12, z narisanimi PISANIMI spodnjimi pravili (fit + snap). Jasne
(nerazpravljene) celice = kalibracijski kontrolorji: morajo brati
register vrednost; razpravljene celice = sodba val 121.

Uporaba:
  python3 strip-v121.py 17            # kl stolpec
  python3 strip-v121.py 18 --split    # jae+kl (X 688-878)
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
OUT = '/home/z/griblje-museum/research-griblje/val121-valbands/crops/strips'
STEP = 38.85


def detect_rules(a, x0, x1, y0=140, y1=1060, thr=0.22):
    band = a[y0:y1, x0:x1]
    dark = (band < 150).mean(axis=1)
    out = []
    y = 0
    while y < len(dark):
        if dark[y] > thr:
            y2 = y
            while y2 < len(dark) and dark[y2] > 0.15:
                y2 += 1
            if y2 - y < 6:
                out.append(y0 + y)
            y = y2 + 1
        else:
            y += 1
    return out


def fit_tops(rules, n, tol=6.5):
    best = None
    slopes = [round(37.0 + 0.05 * i, 2) for i in range(int((40.6 - 37.0) / 0.05) + 1)]
    c0lo, c0hi = rules[0] - 0.4 * STEP, rules[0] + 2.3 * STEP
    for s in slopes:
        c = c0lo
        while c <= c0hi:
            matched, dev = 0, 0.0
            for k in range(n):
                y = c + s * k
                near = [r for r in rules if abs(r - y) <= tol]
                if near:
                    matched += 1
                    dev += min(abs(r - y) for r in near)
            score = matched - 0.02 * dev
            if best is None or score > best[0]:
                best = (score, c, s, matched, dev)
            c += 1.0
    score, c, s, matched, dev = best
    tops = []
    for k in range(n):
        y = c + s * k
        near = [r for r in rules if abs(r - y) <= tol]
        tops.append(float(min(near, key=lambda r: abs(r - y))) if near else y)
    return tops, s, matched / n


def main():
    pg = int(sys.argv[1])
    split = '--split' in sys.argv
    x0, x1 = (688, 878) if split else (738, 878)
    im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
    a = np.asarray(im.convert('L'), dtype=np.int16)
    reg = json.load(open(REG))
    rows = [r for r in reg if r['page'] == pg]
    n = len(rows)
    rules = detect_rules(a, x0, x1)
    tops, slope, frac = fit_tops(rules, n)
    print(f'p{pg}: n={n} slope={slope} matched={frac:.0%}')
    os.makedirs(OUT, exist_ok=True)
    z = 12
    for chunk in range((n + 3) // 4):
        k0 = chunk * 4
        ks = list(range(k0, min(k0 + 4, n)))
        y_top = int(tops[ks[0]] - slope) - 8
        y_bot = int(tops[ks[-1]]) + 8
        c = im.crop((x0, y_top, x1, y_bot))
        c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
        c = ImageEnhance.Contrast(c).enhance(1.28)
        c = ImageEnhance.Sharpness(c).enhance(1.55)
        d = ImageDraw.Draw(c)
        for k in ks:
            ry = (tops[k] - y_top) * z
            if 0 <= ry <= c.height:
                d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=2)
                d.text((4, ry + 4), f'dno r{k}', fill=(200, 0, 0))
            ry2 = (tops[k] - slope - y_top) * z
            if 0 <= ry2 <= c.height:
                d.line([(0, ry2), (c.width, ry2)], fill=(0, 130, 220), width=1)
        out = f'{OUT}/st-p{pg}-{"s" if split else "k"}-{chunk}.png'
        c.save(out)
        print('->', out, c.size, f'(vrstice {ks[0]}..{ks[-1]})')


if __name__ == '__main__':
    main()
