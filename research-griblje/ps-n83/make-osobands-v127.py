#!/usr/bin/env python3
"""Val 127 — OSEBNI re-read p56–p61 (NR-14 serija val 127+, 1./6 valov).

Metoda (protokol 149 §7.1, vzorec val 119 del 2 + val 120 + val 121):
  - DUO pasovi X 150–1010 (parzelle + haus + ime + stand + wohnort + kultur +
    jae/kl) po linearni mreži TOP0 + STEP*k, zoom ×4, 6 vrstic/segment,
    rdeče vrstične oznake rK + pričakovana tiskana parzella P{formula}.
  - TOP0 brez pinov (p56–61 izven PIN karte del 2d/2e/120): avtomatsko =
    najboljše ujemanje linearnega grafa (STEP=38.85) z zaznanimi tiskanimi
    pravili v iskalnem pasu [146..208] (širši kot val 121 — p49 pouk:
    anomalije do 202); kvaliteta = mean_off, guard < 7.0 sicer NEEDS-CAL.
  - Varnostni pas izreza: [TOP0−8, TOP0_{r+6}+14] (val 120).
  - ZZ: celicni zoom ene vrstice ×8 (X 150–1010, Y [r−1 .. r+2]) —
    adjudikacija Nesoglasij (ime + parzelle + klafter na istem izrezku =
    dvojni sidr po vzorcu val 119 del 2d-x3).

Row anchor: tiskana parzella, formula 281+(pg−17)*20 (p17+; val 120
potrjena na 10 straneh) — p56=1061 … p61=1161. Vsak seg izpisuje P-labels;
bralec primerja natis z registrsko vrstico (NR-14: imenska plast 19,6 %
soglasja — parzelle je edini neodvisni sidr).

Uporaba:
  python3 make-osobands-v127.py cal              # poročilo snap-kvalitete
  python3 make-osobands-v127.py cal-vis [outdir] # overviews za vizualno verifikacijo
  python3 make-osobands-v127.py bands [outdir]   # DUO segmenti ×4
  python3 make-osobands-v127.py zz 56 0 [outdir] # celicni zoom p56 r0
"""
import json
import os
import sys
from collections import Counter

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
STEP = 38.85
X0, X1 = 150, 1010
SEG = 6                      # vrstic na segment (zoom ×4)
PAGES = (56, 57, 58, 59, 60, 61)
# izrecni PINI po vizualni kalibraciji (cal-zoom metoda del 2d-x2) — če obstajajo,
# preglasijo avtomatiko (dict page -> top0)
PIN_OVERRIDE = {}


def rows_of_page():
    rows = json.load(open(REG))
    c = Counter(r['page'] for r in rows if r['page'] in PAGES)
    return dict(sorted(c.items()))


def parz_start(pg):
    """Pričakovana tiskana parzella prve vrstice (formula p17+, val 120)."""
    return 281 + (pg - 17) * 20


def detect_rules(im):
    """Zaznaj horizontalna tiskana pravila v pasu X 370–600 (kot val 121)."""
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
    return rules


def snap_grid(rules, n):
    """Linearni graf (top0, STEP) — brez per-vrstičnega snapa (F-VB nauk
    val 121: top0 = glavno pravilo/dno glave; per-vrstični snap nevaren).
    Iskalni pas [146..208] (širši kot v121: anomalije tipa p49=202)."""
    lo, hi = 146.0, 208.0
    best, best_off = None, None
    t = lo
    while t <= hi:
        offs = []
        for k in range(n + 1):
            y = t + STEP * k
            near = [r for r in rules if abs(r - y) <= 6]
            offs.append(min((abs(r - y) for r in near), default=6.0))
        m = sum(offs) / len(offs)
        if best_off is None or m < best_off:
            best_off, best = m, t
        t += 0.25
    tops = [round(best + STEP * k, 1) for k in range(n + 1)]
    max_off = 0.0
    for y in tops:
        near = [r for r in rules if abs(r - y) <= 6]
        if near:
            max_off = max(max_off, min(abs(r - y) for r in near))
    meta = {'top0_lin': round(best, 2), 'n_lines': n + 1,
            'max_off': round(max_off, 2), 'mean_off': round(best_off, 3)}
    return best, tops, meta


def grid_for(pg, n, rules):
    top0 = PIN_OVERRIDE.get(pg)
    if top0 is not None:
        tops = [round(top0 + STEP * k, 1) for k in range(n + 1)]
        meta = {'top0_lin': top0, 'pin': True}
        return top0, tops, meta
    top0, tops, meta = snap_grid(rules, n)
    meta['pin'] = None
    return top0, tops, meta


def src_im(pg):
    return Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')


def mode_cal():
    rows = rows_of_page()
    bad = []
    for pg in PAGES:
        n = rows[pg]
        im = src_im(pg)
        rules = detect_rules(im)
        _, _, meta = grid_for(pg, n, rules)
        ok = meta['pin'] is True or meta['mean_off'] < 7.0
        flag = 'OK ' if ok else 'NEEDS-CAL'
        if not ok:
            bad.append(pg)
        print(f"p{pg}: n={n} top0_lin={meta['top0_lin']} pin={meta['pin']} "
              f"meanoff={meta['mean_off']} maxoff={meta['max_off']} P{parz_start(pg)} {flag}")
    print('NEEDS-CAL:', bad if bad else 'none')


def overview(im, tops, pg, outdir):
    z = 0.55
    c = im.resize((int(im.width * z), int(im.height * z)), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for k, t in enumerate(tops):
        ry = t * z
        d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=1)
        d.text((4, ry + 1), f'r{k}', fill=(255, 0, 0))
    c.save(f'{outdir}/ovw-p{pg}.png')


def mode_cal_vis(outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    for pg in PAGES:
        n = rows[pg]
        im = src_im(pg)
        tops = grid_for(pg, n, detect_rules(im))[1]
        overview(im, tops, pg, outdir)
    print('overviews ->', outdir)


def mode_cal_zoom(pg, outdir):
    """Cal-zoom levega dela (X 140–660) prvih 8 vrstic, ×3 — vizualna
    kalibracija TOP0 (metoda val 120/del 2d-x2)."""
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops, meta = grid_for(pg, n, detect_rules(im))
    r_hi = min(8, n)
    y0, y1 = int(tops[0]) - 28, int(tops[r_hi]) + 22
    c = im.crop((140, y0, 660, y1))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r_hi + 1):
        ry = (tops[r] - y0) * 3
        d.line([(0, ry), (110, ry)], fill=(255, 0, 0), width=3)
        d.text((116, ry - 18), f'r{r}', fill=(200, 0, 0))
        if r < r_hi:
            ry2 = (tops[r + 1] - y0) * 3
            d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
            d.text((116, ry2 + 2), f'rule r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/cal-p{pg}.png')
    print(f"p{pg}: top0_lin={meta['top0_lin']} -> {outdir}/cal-p{pg}.png")


def segcrop(im, tops, r0, r1, pg, outdir, nmax):
    p0 = parz_start(pg)
    ytop = int(tops[r0]) - 8
    ybot = int(tops[min(r1, nmax)]) + 14
    c = im.crop((X0, ytop, X1, ybot))
    c = c.resize((c.width * 4, c.height * 4), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r0, min(r1, nmax)):
        ry = (tops[r] - ytop) * 4
        d.line([(0, ry), (110, ry)], fill=(255, 0, 0), width=3)
        lbl = f'r{r} P{p0 + r}'
        d.text((116, ry - 18), lbl, fill=(200, 0, 0))
        ry2 = (tops[min(r + 1, nmax)] - ytop) * 4
        d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
        d.text((116, ry2 + 2), f'rule r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/ob-p{pg}-seg{r0 // SEG}.png')


def mode_bands(outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    for pg in PAGES:
        n = rows[pg]
        im = src_im(pg)
        tops = grid_for(pg, n, detect_rules(im))[1]
        nseg = (n + SEG - 1) // SEG
        for s in range(nseg):
            segcrop(im, tops, s * SEG, (s + 1) * SEG, pg, outdir, n)
        print(f'p{pg}: n={n} -> ob-seg0-seg{nseg - 1}')
    print('done ->', outdir)


def mode_zz(pg, r, outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops = grid_for(pg, n, detect_rules(im))[1]
    y0 = int(tops[r]) - 12
    y1 = int(tops[min(r + 2, n)]) + 12
    c = im.crop((X0, y0, X1, y1))
    c = c.resize((c.width * 8, c.height * 8), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.35)
    c = ImageEnhance.Sharpness(c).enhance(1.7)
    d = ImageDraw.Draw(c)
    for k, rr in enumerate(range(max(0, r - 1), min(r + 2, n))):
        ry = (tops[rr] - y0) * 8
        d.line([(0, ry), (130, ry)], fill=(255, 0, 0), width=3)
        d.text((136, ry - 18), f'r{rr}', fill=(200, 0, 0))
        ry2 = (tops[min(rr + 1, n)] - y0) * 8
        d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
        d.text((136, ry2 + 2), f'rule r{rr}', fill=(200, 0, 0))
    c.save(f'{outdir}/zz-p{pg}-r{r}.png')
    print(f"zz -> {outdir}/zz-p{pg}-r{r}.png (tops r{r}..r{r + 1}: "
          f"{tops[r]}, {tops[r + 1]})")


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'cal'
    if mode == 'cal':
        mode_cal()
    elif mode == 'cal-vis':
        mode_cal_vis(sys.argv[2] if len(sys.argv) > 2 else '/tmp/v127/ovw')
    elif mode == 'cal-zoom':
        outdir = sys.argv[3] if len(sys.argv) > 3 else '/tmp/v127/cal'
        mode_cal_zoom(int(sys.argv[2]), outdir)
    elif mode == 'bands':
        mode_bands(sys.argv[2] if len(sys.argv) > 2 else '/tmp/v127/ob')
    elif mode == 'zz':
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v127/zz'
        mode_zz(int(sys.argv[2]), int(sys.argv[3]), outdir)
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
