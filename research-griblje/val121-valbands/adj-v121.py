#!/usr/bin/env python3
"""Val 121 — celicna avdikacija odprtih vrednostnih razhajanj (F-OCI-05).

Metoda (protokol 143 §6.1 + F-VB infra-nauk): vrednost pripada pasu NAD
svojim PISANIM spodnjim pravilom. Pravila se zaznajo LOKALNO v stolpcu
kl (X 795-872) in korelirajo z imenskim stolpcem (X 370-600) — skew med
stolpci je ~8-14 px, linearni TOP0+STEP je pri dnu strani zacostno.

Uporaba:
  python3 adj-v121.py bands 17            # diagnoza pravil za p17
  python3 adj-v121.py cells 17 287,291    # izrezki celic za vrstice (rreg)
  python3 adj-v121.py cells 18 306,307,308 --split   # jae+kl skupaj
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
OUT = '/home/z/griblje-museum/research-griblje/val121-valbands/crops/adj'
STEP = 38.85


def detect_rules(a, x0, x1, y0=140, y1=1060, thr=0.42):
    band = a[y0:y1, x0:x1]
    dark = (band < 150).mean(axis=1)
    out = []
    y = 0
    while y < len(dark):
        if dark[y] > thr:
            y2 = y
            while y2 < len(dark) and dark[y2] > 0.28:
                y2 += 1
            if y2 - y < 6:
                out.append(y0 + y)
            y = y2 + 1
        else:
            y += 1
    return out


def fit_tops(rules, n, tol=6.5):
    """Robustno: poišči (c, s) tako, da črta c+s*k (dno vrstice k, k=0..n-1)
    čim večkrat zadane zaznano pravilo (±tol). Snap: dno = pravilo, sicer linearno."""
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


def parz_anchors(a, n):
    """Centroidi parzellnih stevilk (X 175-245) — neodvisno sidro na vrstico."""
    band = a[140:1060, 175:245]
    # odstrani navpicna pravila: stolpci s temnostjo > 0.35 izkljuci
    coldark = (band < 150).mean(axis=0)
    cols = [j for j, f in enumerate(coldark) if f < 0.35]
    band = band[:, cols]
    dark = (band < 120).sum(axis=1)
    clusters = []
    y = 0
    while y < len(dark):
        if dark[y] >= 2:
            y2 = y
            while y2 < len(dark) and dark[y2] >= 1:
                y2 += 1
            if y2 - y >= 8:
                seg = dark[y:y2]
                cen = 140 + (np.arange(y, y2) * seg).sum() / seg.sum()
                clusters.append((round(float(cen), 1), int(seg.sum())))
            y = y2 + 6
        else:
            y += 1
    return clusters


def page_data(pg):
    im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
    a = np.asarray(im.convert('L'), dtype=np.int16)
    reg = json.load(open(REG))
    rows = [r for r in reg if r['page'] == pg]
    n = len(rows)
    name_rules = detect_rules(a, 370, 600, thr=0.28)
    kl_rules = detect_rules(a, 738, 878, thr=0.22)
    # dno zadnje vrstice = zadnje pravilo; fit linearno
    tops_kl, slope_kl, res_kl = fit_tops(kl_rules, n)
    pa = parz_anchors(a, n)
    return im, a, rows, n, name_rules, kl_rules, tops_kl, slope_kl, res_kl, pa


def mode_bands(pg):
    im, a, rows, n, name_rules, kl_rules, tops_kl, slope_kl, res_kl, pa = page_data(pg)
    print(f'p{pg}: n={n}')
    print('  kl rules:  ', kl_rules)
    print(f'  kl fit: slope={slope_kl} matched={res_kl:.0%}')
    print(f'  kl dna r0..r{n-1}: {[round(t,1) for t in tops_kl]}')
    print(f'  parz anchors ({len(pa)}): {pa[:25]}')


def cell_crop(im, ytop, ybot, x0, x1, z=12, label='', rule_at=None):
    c = im.crop((x0, int(ytop), x1, int(ybot)))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    if rule_at is not None:
        ry = (rule_at - ytop) * z
        if 0 <= ry <= c.height:
            d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=2)
            d.text((4, ry + 3), 'rule', fill=(200, 0, 0))
    return label, c


def stack(pads, out):
    w = max(p.width for _, p in pads) + 150
    h = sum(p.height for _, p in pads) + 18 * len(pads)
    canvas = Image.new('RGB', (w, h), (248, 248, 242))
    d = ImageDraw.Draw(canvas)
    y = 0
    for lbl, p in pads:
        d.text((6, y + p.height // 2), lbl, fill=(180, 0, 0))
        canvas.paste(p, (140, y))
        y += p.height + 18
    canvas.save(out)
    print('->', out, canvas.size)


def mode_cells(pg, rregs, split=False):
    os.makedirs(OUT, exist_ok=True)
    im, a, rows, n, name_rules, kl_rules, tops_kl, slope_kl, res_kl, pa = page_data(pg)
    x0, x1 = (688, 878) if split else (738, 878)
    reg_all = json.load(open(REG))
    first = min(i for i, r in enumerate(reg_all) if r['page'] == pg)
    pads = []
    for rr in rregs:
        k = rr - first
        if not (0 <= k < n):
            print(f'! rreg{rr} izven strani p{pg}')
            continue
        ybot = tops_kl[k]
        ytop = ybot - slope_kl
        lbl = f'r{k} rreg{rr} kl={rows[k]["klafter"]!r}'
        pads.append(cell_crop(im, ytop - 6, ybot + 8, x0, x1, 12, lbl, rule_at=ybot))
    out = f'{OUT}/cells-p{pg}-{"s" if split else "k"}-{rregs[0]}.png'
    stack(pads, out)


def main():
    mode = sys.argv[1]
    if mode == 'bands':
        mode_bands(int(sys.argv[2]))
    elif mode == 'cells':
        pg = int(sys.argv[2])
        rregs = [int(x) for x in sys.argv[3].split(',')]
        split = '--split' in sys.argv
        mode_cells(pg, rregs, split)
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
