#!/usr/bin/env python3
"""Val 119 del 2e — dispute zoomi s KOLONSKIMI MEJAMI (zelene črte).

Imena (zz):  X 285–620, x24
Vrednosti (zzv): X 740–1145, x14, z zelenimi kolonskimi mejami strani
Uporaba: python3 make-zoom2-v119e.py <page> <r1> <r2> ...
"""
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
PARZ_START = {50: 941, 51: 961, 52: 981, 53: 1001, 54: 1021, 55: 1041}
TOP0 = {50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2}
STEP = 38.85
# kolonske meje (levo od meje = kolona): [J/K, K/C, C/E, E.fl/kr, E/C, C.fl/kr]
COLS = {
    50: [749, 795, 838, 871, 923, 946, 1002],
    51: [773, 812, 848, 884, 935, 961, 1018],
    52: [778, 817, 852, 888, 935, 964, 1022],
    53: [767, 807, 846, 881, 932, 958, 1016],
    54: [772, 811, 848, 884, 932, 957, 1014],
    55: [775, 816, 851, 887, 938, 962, 1018],
}
OUT = '/tmp/v119e/crops'


def zoomsave(im, pg, r, x0, x1, z, kind, borders=False):
    y0 = int(TOP0[pg] + STEP * r) - 10
    y1 = y0 + int(STEP) + 20
    c = im.crop((x0, y0, x1, y1))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.30)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    if borders:
        d = ImageDraw.Draw(c)
        names = ['J/K', 'K/C', 'C/E', 'Efl/Ekr', 'E/C', 'Cfl/Ckr']
        for bx, nm in zip(COLS[pg][1:], names):
            if x0 < bx < x1:
                bxr = (bx - x0) * z
                d.line([(bxr, 0), (bxr, c.height)], fill=(0, 160, 0), width=3)
                d.text((bxr + 6, 4), nm, fill=(0, 130, 0))
    c.save(f'{OUT}/zz{kind}-p{pg}-r{r:02d}-x{z}.png')


def main():
    pg = int(sys.argv[1])
    rows = [int(x) for x in sys.argv[2:]]
    im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
    for r in rows:
        zoomsave(im, pg, r, 285, 620, 24, '')
        zoomsave(im, pg, r, 740, 1145, 14, 'v', borders=True)
        print(f'p{pg} r{r} P{PARZ_START[pg] + r}')


if __name__ == '__main__':
    main()
