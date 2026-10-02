#!/usr/bin/env python3
"""Val 119 del 2d-x2 — anchored izrezki (protokol 138 §1 parzelle-sidr).

Ključna popravka glede na make-kan-v119d.py: grid NE brali iz raztegnjenih
pravil od vrha strani (markerji so zdrsali +1/+2 vrstic), ampak iz
PRVEGA ČRNILOVRSTIČNEGA pravila (parzelle-sidr: prva vrstica = začetek
sekvence 821/841/861/881/901/921). Vsak izrez vključuje kolono
"Nro. der Parzelle" (X 150–235) za samonaznanjanje.

Uporaba: python3 make-kan3-v119d-x2.py [outdir]  (priveto /tmp/v119d/crops-v119d)
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'

PARZ_START = {44: 821, 45: 841, 46: 861, 47: 881, 48: 901, 49: 921}
ROWS = {44: 20, 45: 20, 46: 20, 47: 21, 48: 21, 49: 21}
# prvi ink-row TOP (iz detect-grid pravil: prvo pravilo pod glavo − 38.85;
# preverjeno z readom kan2-seg0 + protokol 138 §1 (p44 top≈167, p46 ≈167.1,
# p47 ≈164/209, p48 ≈168, p49 ≈170.5))
TOP0 = {44: 167.2, 45: 180.2, 46: 167.1, 47: 170.5, 48: 171.2, 49: 202.0}
STEP = 38.85
X0, X1 = 150, 620

P44_CTRL = [0, 8, 9, 15, 16, 18, 19]
P49_CTRL = list(range(13, 21))


def segcrop(im, tops, r0, r1, pg, outdir, z=4):
    ytop, ybot = int(tops[r0]) - 10, int(tops[min(r1 - 1, ROWS[pg] - 1)]) + 52
    c = im.crop((X0, ytop, X1, ybot))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.32)
    c = ImageEnhance.Sharpness(c).enhance(1.65)
    d = ImageDraw.Draw(c)
    for r in range(r0, min(r1, ROWS[pg])):
        ry = (tops[r] - ytop) * z
        d.line([(0, ry), (100, ry)], fill=(255, 0, 0), width=3)
        d.text((106, ry - 16), f'r{r} p{PARZ_START[pg] + r}', fill=(200, 0, 0))
    c.save(f'{outdir}/kan3-p{pg}-seg{r0 // 7}.png')


def zoomsave(im, tops, r, x0, x1, z, name, outdir, dy=-10, h=None):
    y0 = int(tops[r]) + dy
    y1 = y0 + (h if h else int(STEP) + 16)
    c = im.crop((x0, y0, x1, y1))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.32)
    c = ImageEnhance.Sharpness(c).enhance(1.65)
    c.save(f'{outdir}/{name}')


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119d/crops-v119d'
    os.makedirs(outdir, exist_ok=True)
    tops = {}
    for pg in sorted(PARZ_START):
        n = ROWS[pg]
        tops[pg] = [round(TOP0[pg] + STEP * k, 1) for k in range(n + 1)]
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        for r0 in range(0, n, 7):
            segcrop(im, tops[pg], r0, min(r0 + 7, n), pg, outdir)
        print(f'p{pg}: top0={TOP0[pg]} rows={n} -> seg{0}-seg{(n - 1) // 7}')

    # --- p44 kontrolni zoom (7 vrstic): x30 celica + x40 prva beseda -----
    im44 = Image.open(f'{SRC}/p44.jpg').convert('RGB')
    for r in P44_CTRL:
        zoomsave(im44, tops[44], r, 285, 620, 30, f'zz-p44-r{r:02d}-x30.png', outdir)
        zoomsave(im44, tops[44], r, 285, 465, 40, f'zz-p44-r{r:02d}-x40-w1.png', outdir)
    print(f'p44: kontrola {P44_CTRL} -> x30 + x40-w1')

    # --- p49 r13–r20: x16 širok (140–850, parzelle+ime+haus+klafter) -----
    im49 = Image.open(f'{SRC}/p49.jpg').convert('RGB')
    for r in P49_CTRL:
        zoomsave(im49, tops[49], r, 140, 850, 16, f'zz-p49-r{r:02d}-x16-wide.png', outdir)
        zoomsave(im49, tops[49], r, 285, 620, 24, f'zz-p49-r{r:02d}-x24.png', outdir)
    print(f'p49: kontrola {P49_CTRL} -> x16-wide + x24')


if __name__ == '__main__':
    main()
