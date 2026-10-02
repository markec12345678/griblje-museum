#!/usr/bin/env python3
"""Val 119 del 2d (predanaliza) — detekcija mreže vrstic na PS N83 straneh.

Trije deterministični sidri (0 VLM):
  1. horizontalne črte (imelski pas X 370–600, prag temnosti)
  2. kolona "Nro. der Parzelle" (X 155–235) — cifrne pozicije = vrstice
  3. vertikalne črte (stolpci)
Izhod: JSON z rule-pozicijami + parzelle-cifernimi centroidi na stdout.
Uporaba: python3 detect-grid-v119d.py 44 45 46 47 48 49
"""
import json
import sys

import numpy as np
from PIL import Image

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'


def detect(pg):
    im = Image.open(f'{SRC}/p{pg}.jpg').convert('L')
    a = np.asarray(im, dtype=np.int16)
    H, W = a.shape
    # 1) horizontalne črte v imenskem pasu
    band = a[:, 370:600]
    dark = (band < 140).mean(axis=1)
    rules = []
    y = 100
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
    # 2) parzelle-cifre (centroidi temnih pasov v koloni X 158–232)
    pband = a[:, 158:232]
    pdark = (pband < 120).sum(axis=1)
    sm = np.convolve(pdark, np.ones(5) / 5, mode='same')
    digs = []
    y = 130
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
    # 3) vertikalne črte
    vband = a[180:min(940, H), :]
    vdark = (vband < 140).mean(axis=0)
    vcols = []
    x = 0
    while x < W:
        if vdark[x] > 0.40:
            x2 = x
            while x2 < W - 1 and vdark[x2] > 0.40:
                x2 += 1
            vcols.append(x)
            x = x2 + 1
        else:
            x += 1
    return {'page': pg, 'size': [W, H], 'rules': rules,
            'parzelle_digit_centroids': digs, 'vertical_rules': vcols}


if __name__ == '__main__':
    pages = [int(x) for x in sys.argv[1:]] or list(range(44, 50))
    out = {p: detect(p) for p in pages}
    json.dump(out, sys.stdout, indent=1)
