#!/usr/bin/env python3
"""Val 124 — p7 dvojni anchor (ime+vrednost) re-read orodje (F-V123-01).

Grid: isti kot make-valbands-v121.py (BOTTOM-RULE anchoring, snap_grid).

Izrezki:
  anchor 7 outdir   — 21 pasov, vsak pas = IME (levo) + VREDNOST (desno)
                      eden pod drugim z r{r} oznako => sodba 'to ime <-> ta vrednost'
  oil 7 outdir      — celoten oljni stolpec X 780–920 po pasih z r{r} oznakami
  cell 7 R X0 X1 outdir — ena celica ×16
  full 7 outdir     — cela stran na 1.4× za orientacijo
"""
import os
import sys
import json

sys.path.insert(0, '/home/z/griblje-museum/research-griblje/ps-n83')
import importlib.util as _ilu  # noqa: E402

_spec = _ilu.spec_from_file_location(
    'mvb', '/home/z/griblje-museum/research-griblje/ps-n83/make-valbands-v121.py')
_mvb = _ilu.module_from_spec(_spec)
_spec.loader.exec_module(_mvb)
REG, STEP = _mvb.REG, _mvb.STEP
detect_rules, grid_for, rows_of_page, src_im = (
    _mvb.detect_rules, _mvb.grid_for, _mvb.rows_of_page, _mvb.src_im)

from PIL import Image, ImageEnhance, ImageDraw  # noqa: E402

# stolpci (p7 layout enak register stranem: ime ~X 60–360, kultur ~360–640,
# jae ~640–705, klafter ~690–800; oljna detekcija v123: X 800–905)
X_IME = (60, 370)
X_VAL = (640, 920)
X_OIL = (780, 920)


def tops_for(pg):
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops, _ = grid_for(pg, n, detect_rules(im))
    return im, tops, n


def cell_crop(im, tops, r, x0, x1, zoom=10, ypad=8):
    y0 = int(tops[r]) - ypad
    y1 = int(tops[r + 1]) + ypad
    c = im.crop((x0, max(0, y0), x1, y1))
    c = c.resize((c.width * zoom, c.height * zoom), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.35)
    c = ImageEnhance.Sharpness(c).enhance(1.7)
    return c


def stack(crops, labels, outpath):
    w = max(c.width for c in crops)
    h = sum(c.height for c in crops) + 30 * len(crops)
    out = Image.new('RGB', (w, h), (255, 255, 255))
    d = ImageDraw.Draw(out)
    y = 0
    for c, lab in zip(crops, labels):
        d.rectangle([0, y, w, y + 26], fill=(230, 230, 230))
        d.text((8, y + 6), lab, fill=(180, 0, 0))
        out.paste(c, (0, y + 30))
        y += c.height + 30
    out.save(outpath)
    print('->', outpath)


def main():
    mode = sys.argv[1]
    outdir = sys.argv[-1]
    os.makedirs(outdir, exist_ok=True)
    reg = json.load(open(REG))
    if mode == 'anchor':
        pg = 7
        im, tops, n = tops_for(pg)
        by_page = [r for r in reg if r['page'] == pg]
        crops, labels = [], []
        for r in range(n):
            ime = cell_crop(im, tops, r, *X_IME, zoom=4)
            val = cell_crop(im, tops, r, *X_VAL, zoom=10)
            w = ime.width + val.width + 40
            combo = Image.new('RGB', (w, max(ime.height, val.height)), (255, 255, 255))
            combo.paste(ime, (0, 0))
            combo.paste(val, (ime.width + 40, 0))
            crops.append(combo)
            labels.append(
                f"p{pg} r{r}  register: {by_page[r].get('owner_original')!r} = {by_page[r].get('klafter')!r}")
        stack(crops, labels, f'{outdir}/anchor-p{pg}.png')
    elif mode == 'oil':
        pg = 7
        im, tops, n = tops_for(pg)
        crops, labels = [], []
        for r in range(n):
            c = cell_crop(im, tops, r, *X_OIL, zoom=8)
            crops.append(c)
            labels.append(f'p{pg} r{r} pas {int(tops[r])}-{int(tops[r+1])}')
        stack(crops, labels, f'{outdir}/oil-p{pg}.png')
    elif mode == 'cell':
        pg = int(sys.argv[2])
        r = int(sys.argv[3])
        x0, x1 = int(sys.argv[4]), int(sys.argv[5])
        im, tops, n = tops_for(pg)
        c = cell_crop(im, tops, r, x0, x1, zoom=16)
        c.save(f'{outdir}/cell-p{pg}-r{r}-x{x0}-{x1}.png')
        print('->', f'{outdir}/cell-p{pg}-r{r}-x{x0}-{x1}.png')
    elif mode == 'full':
        pg = int(sys.argv[2])
        im = src_im(pg)
        c = im.resize((int(im.width * 1.4), int(im.height * 1.4)), Image.LANCZOS)
        c.save(f'{outdir}/full-p{pg}.png')
        print('->', f'{outdir}/full-p{pg}.png')
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
