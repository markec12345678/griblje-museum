#!/usr/bin/env python3
"""Val 127 — ZZ celicni zoomi (osebni re-read p56–p61, NR-14 okvir).

Metoda (val 119 del 2d-x3 dvojni sidr + val 125 celicni zoomi):
  nsheet: stolpec haus+ime+stand+wohnort (X 315–650), zoom ×5, 8 vrstic/sheet,
          rdece oznake rK + P{formula} + register-haus/owner za primerjavo.
  vsheet: stolpec kultur+jae+kl (X 630–880), zoom ×6, 8 vrstic/sheet —
          za re-sidranje vrstic (kl anchor) na straneh s sumom/sifti.
  cell:   ena vrstica, poljuben X-range, zoom ×8 — adjudikacija najtezjih.

Uporaba:
  python3 make-osezz-v127.py nsheet 56 0 [outdir]   # p56, vrstice 0..7
  python3 make-osezz-v127.py vsheet 59 16 [outdir]
  python3 make-osezz-v127.py cell 57 4 380 560 [outdir]
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
STEP = 38.85
PAGES = (56, 57, 58, 59, 60, 61)
PIN_OVERRIDE = {56: 163.5, 57: 163.0, 58: 160.5, 59: 160.0, 60: 161.75, 61: 176.0}


def rows_of_page():
    from collections import Counter
    rows = json.load(open(REG))
    c = Counter(r['page'] for r in rows if r['page'] in PAGES)
    return dict(sorted(c.items()))


def reg_rows(pg):
    rows = json.load(open(REG))
    return [(i, r) for i, r in enumerate(rows) if r['page'] == pg]


def parz_start(pg):
    return 281 + (pg - 17) * 20


def tops_of(pg):
    n = rows_of_page()[pg]
    t0 = PIN_OVERRIDE[pg]
    return [round(t0 + STEP * k, 1) for k in range(n + 1)]


def src_im(pg):
    return Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')


def _stack(pg, r0, nr, x0, x1, z, outdir, tag):
    os.makedirs(outdir, exist_ok=True)
    tops = tops_of(pg)
    n = rows_of_page()[pg]
    im = src_im(pg)
    regs = reg_rows(pg)
    y0 = int(tops[r0]) - 14
    r_hi = min(r0 + nr, n + 1)
    y1 = int(tops[min(r_hi, n)]) + 12
    c = im.crop((x0, y0, x1, y1))
    c = c.resize((c.width * z, c.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r0, r_hi):
        ry = (tops[r] - y0) * z
        d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=2)
        p = parz_start(pg) + r
        lbl = f'r{r} P{p}'
        if r < n:
            _, rr = regs[r]
            lbl += f" | reg: h={rr.get('haus_no')!r} '{rr.get('owner_original')}'"
        d.text((6, ry + 3), lbl, fill=(180, 0, 0))
    fn = f'{outdir}/{tag}-p{pg}-r{r0}.png'
    c.save(fn)
    print(fn, f'(rows {r0}..{r_hi - 1}, X {x0}-{x1}, x{z})')


def main():
    mode = sys.argv[1]
    if mode == 'nsheet':
        pg, r0 = int(sys.argv[2]), int(sys.argv[3])
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v127/zz'
        _stack(pg, r0, 8, 315, 650, 5, outdir, 'ns')
    elif mode == 'vsheet':
        pg, r0 = int(sys.argv[2]), int(sys.argv[3])
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v127/zz'
        _stack(pg, r0, 8, 630, 880, 6, outdir, 'vs')
    elif mode == 'ksheet':
        pg, r0 = int(sys.argv[2]), int(sys.argv[3])
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v127/zz'
        _stack(pg, r0, 8, 870, 1120, 6, outdir, 'ks')
    elif mode == 'kstack':
        pg, r0 = int(sys.argv[2]), int(sys.argv[3])
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v127/zz'
        _stack(pg, r0, 11, 640, 900, 5, outdir, 'kq')
    elif mode == 'cell':
        pg, r0 = int(sys.argv[2]), int(sys.argv[3])
        x0, x1 = int(sys.argv[4]), int(sys.argv[5])
        outdir = sys.argv[6] if len(sys.argv) > 6 else '/tmp/v127/zz'
        _stack(pg, r0, 1, x0, x1, 8, outdir, 'cell')
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
