#!/usr/bin/env python3
"""Val 119 del 2e — dispute zoomi (imen x24, vrednosti x14) po vrstici.

Uporaba: python3 make-zoom-v119e.py 50 0 3 4 5 6 9 10 16 19
         (page row1 row2 ...) -> /tmp/v119e/crops/zz{v}-p50-r00-*.png
"""
import sys

from PIL import Image, ImageEnhance

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
PARZ_START = {50: 941, 51: 961, 52: 981, 53: 1001, 54: 1021, 55: 1041}
TOP0 = {50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2}
STEP = 38.85
OUT = '/tmp/v119e/crops'


def zoomsave(im, pg, r, x0, x1, z, kind):
    y0 = int(TOP0[pg] + STEP * r) - 10
    y1 = y0 + int(STEP) + 18
    c = im.crop((x0, y0, x1, y1))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.32)
    c = ImageEnhance.Sharpness(c).enhance(1.65)
    c.save(f'{OUT}/zz{kind}-p{pg}-r{r:02d}-x{z}.png')


def main():
    pg = int(sys.argv[1])
    rows = [int(x) for x in sys.argv[2:]]
    im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
    for r in rows:
        parz = PARZ_START[pg] + r
        zoomsave(im, pg, r, 285, 620, 24, '', )      # ime + haus
        zoomsave(im, pg, r, 740, 990, 14, 'v', )     # joch+klafter+classe+ertrag
        zoomsave(im, pg, r, 940, 1140, 14, 'c', )    # capital
        print(f'p{pg} r{r} P{parz}: zz + zzv + zzc')


if __name__ == '__main__':
    main()
