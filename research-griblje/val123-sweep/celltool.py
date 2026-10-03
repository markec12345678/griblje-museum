#!/usr/bin/env python3
"""Val 123 — tight celični izrezki za adjudikacijo (p3–p16 vrednostni sweep).

Grid: isti kot make-valbands-v121.py (detect_rules + snap_grid, BOTTOM-RULE
anchoring val 121). Izrezek: poljuben X stolpec, privzeto klafter X 690–800,
×10, ena vrstica pod drugo, z rdečo oznako r{r} + register vrednostjo.

Uporaba:
  python3 celltool.py cells 3 3,4,6,8 outdir            # klafter celice
  python3 celltool.py cell 3 3 690 800 outdir           # ena vrstica
  python3 celltool.py jae 3 0,1,2 outdir                # jaethe stolpec X 640-700
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
SRC, REG, STEP, PIN_TOP0 = _mvb.SRC, _mvb.REG, _mvb.STEP, _mvb.PIN_TOP0
detect_rules, grid_for, rows_of_page, src_im = (
    _mvb.detect_rules, _mvb.grid_for, _mvb.rows_of_page, _mvb.src_im)

from PIL import Image, ImageEnhance, ImageDraw  # noqa: E402


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
    if mode in ('cells', 'jae'):
        pg = int(sys.argv[2])
        rs = [int(x) for x in sys.argv[3].split(',')]
        x0, x1 = (640, 705) if mode == 'jae' else (690, 800)
        im, tops, n = tops_for(pg)
        reg = json.load(open(REG))
        by_page = [r for r in reg if r['page'] == pg]
        crops, labels = [], []
        for r in rs:
            c = cell_crop(im, tops, r, x0, x1)
            regval = by_page[r]['klafter'] if mode != 'jae' else by_page[r]['jaethe']
            crops.append(c)
            labels.append(f'p{pg} r{r}  register={regval!r}')
        stack(crops, labels, f'{outdir}/cells-p{pg}-{mode}.png')
    elif mode == 'cell':
        pg = int(sys.argv[2])
        r = int(sys.argv[3])
        x0, x1 = int(sys.argv[4]), int(sys.argv[5])
        im, tops, n = tops_for(pg)
        c = cell_crop(im, tops, r, x0, x1)
        c.save(f'{outdir}/cell-p{pg}-r{r}-x{x0}-{x1}.png')
        print('->', f'{outdir}/cell-p{pg}-r{r}-x{x0}-{x1}.png')
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
