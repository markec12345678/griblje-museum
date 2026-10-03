#!/usr/bin/env python3
"""Val 125 — F-V124-01: p7 imenska + hišna plast (NR-14 metoda, celicni zoomi).

Iz istega grafa kot val 121/124 (BOTTOM-RULE anchoring, make-valbands-v121.py):
p7 top0_lin=160.25, n=22 vrstic, mean_off 1.86 (cal OK, brez pina).

Izrezki:
  names outdir   — 22 IME celic (X 250–480) ×8, oznaka r{r} + register vrednost
  houses outdir  — 22 HAUS celic (X 225–270) ×16, oznaka r{r} + register vrednost
  row pg r outdir — celicni zoom ene vrstice (X 60–480) ×8 — adjudikacija
  digit pg r a b outdir — dve HAUS celici drug ob drugem (digitcmp, ×16)
  xref outdir    — vertikalni trak HAUS stolpca (X 225–270, celotna višina) ×6

Uporaba:
  python3 make-zoom-v125.py names outdir
  python3 make-zoom-v125.py houses outdir
  python3 make-zoom-v125.py row 7 11 outdir
  python3 make-zoom-v125.py digit 7 1 0 outdir   # r1 vs r0 hišni celici
  python3 make-zoom-v125.py xref outdir
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

# stolpci (ink-run meritve p7: pravila X 217–221, 246–247, 314–318):
#   "1" (st. his podstolpec) ~X 252–266; Haus Nro stevilke ~X 266–312;
#   Vor- und Zuname ~X 322–462 (Stand pravilo ~X 465)
#   Nro der Parzelle ~X 88–115
X_HAUS = (250, 318)
X_IME = (318, 464)
X_NRO = (88, 118)
PG = 7


def tops_for(pg):
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops, _ = grid_for(pg, n, detect_rules(im))
    return im, tops, n


def cell_crop(im, tops, r, x0, x1, zoom=10, ypad=6):
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
    by_page = [r for r in reg if r['page'] == PG]

    if mode == 'names':
        im, tops, n = tops_for(PG)
        crops, labels = [], []
        for r in range(n):
            # imena so BOTTOM-anchor (pisana nizko, descenderji čez spodnje
            # pravilo — F-V125 geom.: okno [top r + 2 .. top r+1 + 22])
            y0 = int(tops[r]) + 2
            y1 = int(tops[r + 1]) + 22
            c = im.crop((X_IME[0], y0, X_IME[1], y1))
            c = c.resize((c.width * 8, c.height * 8), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.35)
            c = ImageEnhance.Sharpness(c).enhance(1.7)
            crops.append(c)
            labels.append(f"p{PG} r{r} Nro={by_page[r].get('no_blatt')!r} "
                          f"register: {by_page[r].get('owner_original')!r} "
                          f"(ditto={by_page[r].get('owner_was_ditto')})")
        stack(crops, labels, f'{outdir}/names-p{PG}.png')
    elif mode == 'cells':
        # posamezne celice na disk: name-r{r}.png (x12) + haus-r{r}.png (x24)
        im, tops, n = tops_for(PG)
        for r in range(n):
            y0n, y1n = int(tops[r]) + 2, int(tops[r + 1]) + 22
            cn = im.crop((X_IME[0], y0n, X_IME[1], y1n))
            cn = cn.resize((cn.width * 12, cn.height * 12), Image.LANCZOS)
            cn = ImageEnhance.Contrast(cn).enhance(1.35)
            cn = ImageEnhance.Sharpness(cn).enhance(1.7)
            cn.save(f'{outdir}/name-r{r}.png')
            ch = cell_crop(im, tops, r, *X_HAUS, zoom=24, ypad=8)
            ch.save(f'{outdir}/haus-r{r}.png')
        print(f'-> {outdir}/name-r{{0..{n-1}}}.png + haus-r{{0..{n-1}}}.png')
    elif mode == 'houses':
        im, tops, n = tops_for(PG)
        crops, labels = [], []
        for r in range(n):
            c = cell_crop(im, tops, r, *X_HAUS, zoom=16)
            crops.append(c)
            labels.append(f"p{PG} r{r} register haus={by_page[r].get('haus_no')!r} "
                          f"owner={by_page[r].get('owner_original')!r}")
        stack(crops, labels, f'{outdir}/houses-p{PG}.png')
    elif mode == 'row':
        pg, r = int(sys.argv[2]), int(sys.argv[3])
        im, tops, n = tops_for(pg)
        c = cell_crop(im, tops, r, 60, 500, zoom=8)
        c.save(f'{outdir}/row-p{pg}-r{r}.png')
        print('->', f'{outdir}/row-p{pg}-r{r}.png')
    elif mode == 'digit':
        pg, ra, rb = int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
        im, tops, n = tops_for(pg)
        ca = cell_crop(im, tops, ra, *X_HAUS, zoom=16)
        cb = cell_crop(im, tops, rb, *X_HAUS, zoom=16)
        w = max(ca.width, cb.width)
        h = ca.height + cb.height + 30
        out = Image.new('RGB', (w, h), (255, 255, 255))
        d = ImageDraw.Draw(out)
        d.rectangle([0, 0, w, 26], fill=(230, 230, 230))
        d.text((8, 6), f'p{pg} r{ra} (reg {by_page[ra].get("haus_no")!r})', fill=(180, 0, 0))
        out.paste(ca, (0, 30))
        d.rectangle([0, ca.height + 30, w, ca.height + 56], fill=(230, 230, 230))
        d.text((8, ca.height + 36), f'p{pg} r{rb} (reg {by_page[rb].get("haus_no")!r})', fill=(180, 0, 0))
        out.paste(cb, (0, ca.height + 60))
        out.save(f'{outdir}/digit-p{pg}-r{ra}-vs-r{rb}.png')
        print('->', f'{outdir}/digit-p{pg}-r{ra}-vs-r{rb}.png')
    elif mode == 'xref':
        im, tops, n = tops_for(PG)
        y0, y1 = int(tops[0]) - 20, int(tops[n]) + 20
        c = im.crop((X_HAUS[0], y0, X_HAUS[1], y1))
        c = c.resize((c.width * 6, c.height * 6), Image.LANCZOS)
        c = ImageEnhance.Contrast(c).enhance(1.3)
        d = ImageDraw.Draw(c)
        z = 6
        for k, t in enumerate(tops):
            ry = (t - y0) * z
            d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=2)
            d.text((4, ry + 2), f'r{k}', fill=(255, 0, 0))
        c.save(f'{outdir}/xref-haus-p{PG}.png')
        print('->', f'{outdir}/xref-haus-p{PG}.png')
    else:
        raise SystemExit(f'neznani mode {mode}')


if __name__ == '__main__':
    main()
