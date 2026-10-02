#!/usr/bin/env python3
"""Val 119 del 2e — anchored izrezki PS p50–p55 (protokol 140 §6 metoda).

Kot make-kan3-v119d-x2.py: grid iz PRVEGA črnilovratičnega pravila
(parzelle-sidr: prva vrstica = začetek sekvence 942+). Vsak izrez vključuje
kolono "Nro. der Parzelle" (X 150–235) za samonaznanjanje + overview
overlay za kalibracijo TOP0.

Uporaba: python3 make-kan3-v119e.py [outdir]  (priveto /tmp/v119e/crops)
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'

# parzelle začetek (vizualno prebrano z parz-col izrezkov, del 2e):
# p50 = 941..960 + Fürtrag (48 Fürtrag, jae 4 | kl 386); p51 = 961..980;
# p52 = 981..1000; p53 = 1001..1020; p54 = 1021..1040 (+Fürtrag?);
# p55 = 1041..1060. Skupaj 122 pasov = 122 register vrstic.
PARZ_START = {50: 941, 51: 961, 52: 981, 53: 1001, 54: 1021, 55: 1041}
ROWS = {50: 21, 51: 20, 52: 20, 53: 20, 54: 21, 55: 20}
# prvi ink-row TOP (detect-grid-v119e pravila: prvo pravilo pod glavo −
# 38.85; kandidati za vizualno kalibracijo prek overview overlay)
TOP0 = {50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2}
STEP = 38.85
X0, X1 = 150, 620


def tops_of(pg):
    n = ROWS[pg]
    return [round(TOP0[pg] + STEP * k, 1) for k in range(n + 1)]


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
    c.save(f'{outdir}/kan3e-p{pg}-seg{r0 // 7}.png')


def overview(im, tops, pg, outdir):
    """Celoten register z rdečo mrežo (downscale x0.55) za kalibracijo."""
    z = 0.55
    c = im.resize((int(im.width * z), int(im.height * z)), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for r, t in enumerate(tops):
        ry = t * z
        d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=1)
        d.text((4, ry + 1), f'r{r}', fill=(255, 0, 0))
    c.save(f'{outdir}/ovw-p{pg}.png')


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119e/crops'
    os.makedirs(outdir, exist_ok=True)
    for pg in sorted(PARZ_START):
        n = ROWS[pg]
        tops = tops_of(pg)
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        for r0 in range(0, n, 7):
            segcrop(im, tops, r0, min(r0 + 7, n), pg, outdir)
        overview(im, tops, pg, outdir)
        print(f'p{pg}: top0={TOP0[pg]} rows={n} '
              f'-> seg0-seg{(n - 1) // 7} + ovw')
    print('done ->', outdir)


if __name__ == '__main__':
    main()
