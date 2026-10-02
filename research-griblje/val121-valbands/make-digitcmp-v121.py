#!/usr/bin/env python3
"""Val 121 — mikro-zoom primerjave števk (Kurrent eksari) za adjudikacijo
F-OCI-05 kandidatov: strip istega stolpca, več vrstic drug ob drugem.

Uporaba:
  python3 make-digitcmp-v121.py 37 1,2,17,12 690 800 /tmp/v121/cmp 8
  -> celice vrstic 1,2,17,12 strani 37, stolpec X 690–800, ×8, ena pod drugo
"""
import sys

from PIL import Image, ImageEnhance

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
STEP = 38.85
PIN_TOP0 = {
    17: 166.5, 19: 162.0, 20: 170.0, 25: 156.2, 26: 162.2, 31: 163.3,
    32: 171.0, 37: 167.0, 38: 168.0, 43: 180.0,
    44: 167.2, 45: 180.2, 46: 167.1, 47: 170.5, 48: 171.2, 49: 202.0,
    50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2,
}


def main():
    pg = int(sys.argv[1])
    rows = [int(x) for x in sys.argv[2].split(',')]
    x0, x1 = int(sys.argv[3]), int(sys.argv[4])
    outdir = sys.argv[5]
    zoom = int(sys.argv[6]) if len(sys.argv) > 6 else 8
    import json
    from collections import defaultdict
    reg = json.load(open(REG))
    by_page = defaultdict(list)
    for r in reg:
        by_page[r['page']].append(r)
    n = len(by_page[pg])
    top0 = PIN_TOP0[pg]
    tops = [top0 + STEP * k for k in range(n + 1)]
    im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
    pads = []
    labels = []
    for r in rows:
        y0 = int(tops[r]) + 4
        y1 = int(tops[r + 1]) - 2
        c = im.crop((x0, y0, x1, y1))
        c = c.resize((c.width * zoom, c.height * zoom), Image.LANCZOS)
        c = ImageEnhance.Contrast(c).enhance(1.35)
        c = ImageEnhance.Sharpness(c).enhance(1.7)
        pads.append(c)
        labels.append(f'r{r}')
    w = max(p.width for p in pads) + 160
    h = sum(p.height for p in pads) + 30 * len(pads)
    from PIL import ImageDraw
    canvas = Image.new('RGB', (w, h), (250, 250, 245))
    d = ImageDraw.Draw(canvas)
    y = 0
    for lbl, p in zip(labels, pads):
        d.text((8, y + p.height // 2 - 10), lbl, fill=(180, 0, 0))
        d.text((8, y + p.height // 2 + 12), f'p{pg}', fill=(120, 120, 120))
        canvas.paste(p, (150, y))
        y += p.height + 30
    out = f'{outdir}/cmp-p{pg}-r{rows[0]}-{rows[-1]}.png'
    canvas.save(out)
    print('->', out)


if __name__ == '__main__':
    main()
