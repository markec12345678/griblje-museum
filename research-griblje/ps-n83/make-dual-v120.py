#!/usr/bin/env python3
"""Val 120 — anchored izrezki PS vzorca (2. oči kontrola, protokol 143).

Kot make-kan3-v119e.py (del 2e): DUO pasovi X 150–1010 (parzelle + haus +
ime + stand + kultur + vrednosti) po mreži TOP0 + STEP*7-segmentov, zoom ×3,
rdeče vrstične oznake rK. Overviews (×0.55, rdeča mreža) za kalibracijo
TOP0 (metoda del 2d-x2: programski overlay + vizualna kalibracija → PIN).

Uporaba:
  python3 make-dual-v120.py ovw            # samo overviews (kalibracija)
  python3 make-dual-v120.py crops [outdir] # segmenti iz PINOV + overviews
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
STEP = 38.85
DUO_X = (150, 1010)      # parzelle + haus + ime + stand + kultur + vrednosti

# --- PINS: vizualno kalibrirano na cal-zoomih (metoda del 2d-x2, §3) -------
# Kalibracija val 120: rdeča TOP0 linija na cal-p{pg}.png (X 140–620, ×3);
# sidro = tiskana parzelle št. prve vrstice (formula 281 + (pg−17)*20,
# potrjena na p17=281/p19=321/p20=341/p25=441/p26=461/p31=561/p32=581/
# p37=701/p38=721/p43=801); TOP0 = vrhnjek vrstice r0 (besedilo r0 leži
# 15–30 px pod TOP0 — varnostni pas izreza [TOP0−8, TOP0+53]).
# p44/p49/p50/p55 = nespremenjene komitane konstante del 2d-x3 / del 2e.
PIN_TOP0 = {17: 166.5, 19: 162.0, 20: None, 25: 156.2, 26: 162.2, 31: 163.3,
            32: 171.0, 37: 167.0, 38: 168.0, 43: 180.0,
            44: 167.2, 49: 202.0, 50: 166.6, 55: 170.2}
PIN_TOP0[20] = 170.0  # p20: cal-zoom — vrhnjek vrstice 341 ≈ 170 (glava ~156)
SEG = 7                  # vrstic na segment


def tops(pg, top0, n):
    return [round(top0 + STEP * k, 1) for k in range(n)]


def overview(im, ts, pg, outdir, tag='pin'):
    z = 0.55
    c = im.resize((int(im.width * z), int(im.height * z)), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for k, t in enumerate(ts):
        ry = t * z
        d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=1)
        d.text((4, ry + 1), f'r{k}', fill=(255, 0, 0))
    c.save(f'{outdir}/ovw-{tag}-p{pg}.png')


def segcrop(im, ts, r0, r1, pg, outdir, nmax):
    ytop = int(ts[r0]) - 8
    ybot = int(ts[min(r1 - 1, nmax - 1)]) + 14
    c = im.crop((DUO_X[0], ytop, DUO_X[1], ybot))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r0, min(r1, nmax)):
        ry = (ts[r] - ytop) * 3
        d.line([(0, ry), (90, ry)], fill=(255, 0, 0), width=3)
        d.text((96, ry - 18), f'r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/duo-p{pg}-seg{r0 // SEG}.png')


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'ovw'
    outdir = sys.argv[2] if len(sys.argv) > 2 else '/tmp/v120/crops'
    os.makedirs(outdir, exist_ok=True)
    pages = sorted(p for p in PIN_TOP0)
    # ROWS iz register.json (celotni register, read-only)
    import json
    reg = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
    rows = json.load(open(reg))
    from collections import Counter
    ROWS = dict(Counter(r['page'] for r in rows if r['page'] in PIN_TOP0))
    for pg in pages:
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        n = ROWS.get(pg, 20)
        top0 = PIN_TOP0[pg]
        if top0 is None or mode == 'ovw':
            # kandidatna mreža za kalibracijo: iz prvega pravila pod glavo
            import numpy as np
            a = np.asarray(im.convert('L'), dtype=np.int16)
            band = a[:, 370:600]
            dark = (band < 140).mean(axis=1)
            rules = []
            y = 100
            while y < a.shape[0] - 30:
                if dark[y] > 0.28:
                    y2 = y
                    while y2 < a.shape[0] - 1 and dark[y2] > 0.22:
                        y2 += 1
                    if y2 - y < 6:
                        rules.append(y)
                    y = y2 + 1
                else:
                    y += 1
            below = [r for r in rules if r >= 140]
            cand = below[0] if below else 168.0
            if top0 is None:
                overview(im, tops(pg, cand, n), pg, outdir, tag='cand')
                print(f'p{pg}: cand_top0={cand} rows={n}')
                continue
        overview(im, tops(pg, top0, n), pg, outdir, tag='pin')
        if mode == 'crops':
            nseg = (n + SEG - 1) // SEG
            for s in range(nseg):
                segcrop(im, tops(pg, top0, n), s * SEG, (s + 1) * SEG, pg,
                        outdir, n)
            print(f'p{pg}: top0={top0} rows={n} seg0-{nseg - 1}')


if __name__ == '__main__':
    main()
