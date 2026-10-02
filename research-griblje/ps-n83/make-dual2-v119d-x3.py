#!/usr/bin/env python3
"""Val 119 del 2d-x3, dopolnilo — DUO izrezki p47+p48 + dis zoomi za dvome.

Dopolnitev make-dual-v119d-x3.py (ki je duo delal samo za p49):
  a) duo kontekst (X 150–1130, x3) za VSE vrstice p47 in p48 — parzelle + ime
     + haus + stand + kultur + vrednosti v ENEM izrezku (dvojni sidr)
  b) dis zoomi x14 za števkne dvome: p47 r2 (253/283), p47 r12 (436/438),
     p48 r0/r1 (1534/1904, 219/279)

Uporaba: python3 make-dual2-v119d-x3.py [outdir] (priveto /tmp/v119x3/crops)
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'

PARZ_START = {47: 881, 48: 901}
ROWS = {47: 21, 48: 21}
TOP0 = {47: 170.5, 48: 171.2}
STEP = 38.85
DUO_X = (150, 1130)

DISPUTE2 = {
    47: [(2, 14, 740, 940), (12, 14, 740, 940)],
    48: [(0, 14, 740, 940), (1, 14, 740, 940), (2, 14, 740, 940),
         (3, 14, 740, 940)],
}


def zoom(c, z, contrast=1.32, sharp=1.6):
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(contrast)
    return ImageEnhance.Sharpness(c).enhance(sharp)


def label(d, text, w=600):
    d.rectangle([(0, 0), (w, 34)], fill=(255, 255, 255))
    d.text((8, 6), text, fill=(180, 0, 0))


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119x3/crops'
    os.makedirs(outdir, exist_ok=True)
    for pg in sorted(PARZ_START):
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        n = ROWS[pg]
        for r in range(n):
            y0 = int(TOP0[pg] + STEP * r) - 6
            y1 = int(TOP0[pg] + STEP * (r + 1)) + 8
            parz = PARZ_START[pg] + r
            c = im.crop((DUO_X[0], y0, DUO_X[1], y1))
            c = zoom(c, 3, 1.25, 1.4)
            d = ImageDraw.Draw(c)
            label(d, f'duo p{pg} r{r} P{parz}')
            c.save(f'{outdir}/duo-p{pg}-r{r:02d}.png')
        for r, z, x0, x1 in DISPUTE2.get(pg, []):
            y0 = int(TOP0[pg] + STEP * r) - 8
            y1 = int(TOP0[pg] + STEP * (r + 1)) + 10
            parz = PARZ_START[pg] + r
            c = im.crop((x0, y0, x1, y1))
            c = zoom(c, z, 1.4, 1.7)
            d = ImageDraw.Draw(c)
            label(d, f'dis p{pg} r{r} P{parz} x{z}')
            c.save(f'{outdir}/dis-p{pg}-r{r:02d}-x{z}.png')
        print(f'p{pg}: {n} duo + {len(DISPUTE2.get(pg, []))} dis2')
    print('done ->', outdir)


if __name__ == '__main__':
    main()
