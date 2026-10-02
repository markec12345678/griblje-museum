#!/usr/bin/env python3
"""Val 119 del 2d-x3 — DVOJNI-SIDR izrezki (protokol 139 §2 rešitev).

Za p47–p49: vsaka vrstica dobi vrednostni izrez (kultur + joche/klafter +
classe + ertrag) z programsko oznako vrstice (r + parzelle) — parjenje
ime↔vrednost prek istega kan3 vrstičnega topa (TOP0/STEP iz del 2d-x2,
samonaznano s parzelle-sidrom).

Dodatno:
  a) p49 duo kontekst (X 150–1010, x3) vseh vrstic — ime+vrednost skupaj
  b) dispute zoomi: p49 rep r13–r20 klafter x14; p47 r0/r1/r20; p48 r0/r12
  c) p47 r0 kultur 'Acker und ...' x12

Uporaba: python3 make-dual-v119d-x3.py [outdir] (priveto /tmp/v119x3/crops)
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'

PARZ_START = {47: 881, 48: 901, 49: 921}
ROWS = {47: 21, 48: 21, 49: 21}
TOP0 = {47: 170.5, 48: 171.2, 49: 202.0}
STEP = 38.85
VAL_X = (740, 1130)      # kultur + joche/klafter + classe + ertrag
DUO_X = (150, 1010)      # parzelle + haus + ime + stand + kultur + vrednosti
DIS_X = (830, 980)       # klafter-only dispute zoom

DISPUTE = {
    47: [(0, 12, 740, 940), (1, 12, 740, 940), (20, 12, 740, 1000)],
    48: [(0, 12, 740, 940), (12, 12, 740, 940)],
    49: [(r, 14, 830, 980) for r in range(13, 21)],
}


def zoom(c, z, contrast=1.32, sharp=1.6):
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(contrast)
    return ImageEnhance.Sharpness(c).enhance(sharp)


def label(d, text, w=460):
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
            # --- val izrez (kultur + vrednosti) -------------------------
            c = im.crop((VAL_X[0], y0, VAL_X[1], y1))
            c = zoom(c, 8)
            d = ImageDraw.Draw(c)
            label(d, f'val p{pg} r{r} P{parz}')
            c.save(f'{outdir}/val-p{pg}-r{r:02d}.png')
        # --- duo kontekst (samo p49) ---------------------------------
        if pg == 49:
            for r in range(n):
                y0 = int(TOP0[pg] + STEP * r) - 6
                y1 = int(TOP0[pg] + STEP * (r + 1)) + 8
                parz = PARZ_START[pg] + r
                c = im.crop((DUO_X[0], y0, DUO_X[1], y1))
                c = zoom(c, 3, 1.25, 1.4)
                d = ImageDraw.Draw(c)
                label(d, f'duo p{pg} r{r} P{parz}', w=600)
                c.save(f'{outdir}/duo-p{pg}-r{r:02d}.png')
        # --- dispute zoomi -------------------------------------------
        for r, z, x0, x1 in DISPUTE.get(pg, []):
            y0 = int(TOP0[pg] + STEP * r) - 8
            y1 = int(TOP0[pg] + STEP * (r + 1)) + 10
            parz = PARZ_START[pg] + r
            c = im.crop((x0, y0, x1, y1))
            c = zoom(c, z, 1.4, 1.7)
            d = ImageDraw.Draw(c)
            label(d, f'dis p{pg} r{r} P{parz} x{z}')
            c.save(f'{outdir}/dis-p{pg}-r{r:02d}-x{z}.png')
        print(f'p{pg}: {n} val + {len(DISPUTE.get(pg, []))} dis'
              + (' + duo' if pg == 49 else ''))
    print('done ->', outdir)


if __name__ == '__main__':
    main()
