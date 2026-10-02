#!/usr/bin/env python3
"""Val 119 del 2e — vrednostni izrezki (segmenti po 7 vrstic) PS p50–p55.

X 700–1145 = kultur + joche/klafter + classe + ertrag + capital. Rdeče
črte = vrstični topi (isti TOP0/STEP kot kan3e), oznake r + parzelle.
Dvojni sidr: parzelle (imenska plast) + vrednostni pas na spodnjem pravilu.

Uporaba: python3 make-valseg-v119e.py [outdir]  (priveto /tmp/v119e/crops)
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'

PARZ_START = {50: 941, 51: 961, 52: 981, 53: 1001, 54: 1021, 55: 1041}
ROWS = {50: 21, 51: 20, 52: 20, 53: 20, 54: 21, 55: 20}
TOP0 = {50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2}
STEP = 38.85
X0, X1 = 700, 1145
Z = 6


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119e/crops'
    os.makedirs(outdir, exist_ok=True)
    for pg in sorted(PARZ_START):
        n = ROWS[pg]
        tops = [round(TOP0[pg] + STEP * k, 1) for k in range(n + 1)]
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        for r0 in range(0, n, 7):
            r1 = min(r0 + 7, n)
            ytop, ybot = int(tops[r0]) - 10, int(tops[r1 - 1]) + 52
            c = im.crop((X0, ytop, X1, ybot))
            c = c.resize((c.width * Z, c.height * Z), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.32)
            c = ImageEnhance.Sharpness(c).enhance(1.65)
            d = ImageDraw.Draw(c)
            for r in range(r0, r1):
                ry = (tops[r] - ytop) * Z
                d.line([(0, ry), (120, ry)], fill=(255, 0, 0), width=3)
                d.text((126, ry - 16), f'r{r} P{PARZ_START[pg] + r}',
                       fill=(200, 0, 0))
            c.save(f'{outdir}/valseg-p{pg}-seg{r0 // 7}.png')
        print(f'p{pg}: {n} vrstic -> valseg seg0-seg{(n - 1) // 7}')
    print('done ->', outdir)


if __name__ == '__main__':
    main()
