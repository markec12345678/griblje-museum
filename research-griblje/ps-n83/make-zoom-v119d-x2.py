#!/usr/bin/env python3
"""Val 119 del 2d-x2 — kontrolni zoom-izrezki (0 VLM, agentov vid).

  a) p44 x30 celoten imenski celici + x40 prva beseda (7 nizka-zavest vrstic:
     r0, r8, r9, r15, r16, r18, r19) — protokol 138 §6.3
  b) p49 r13–r20: širok x16 (X 140–850: parzelle+ime+haus+klafter+red) za
     5-smerno poravnavo (protokol 138 §2.3/§6.2) + ime-celica x24

Grid: detect-grid-v119d pravila (istega izvora kot make-kan-v119d).
Uporaba: python3 make-zoom-v119d-x2.py [outdir]   (priveto /tmp/v119d/crops-v119d)
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
HERE = os.path.dirname(os.path.abspath(__file__))

P44_ROWS = [0, 8, 9, 15, 16, 18, 19]
P49_ROWS = list(range(13, 21))
NAME_X = (285, 620)
WIDE_X = (140, 850)


def detect_rules(pg):
    out = subprocess.run(
        [sys.executable, f'{HERE}/detect-grid-v119d.py', str(pg)],
        capture_output=True, text=True, check=True)
    return json.loads(out.stdout)[str(pg)]['rules']


def row_tops(pg, n):
    rules = detect_rules(pg)
    if len(rules) >= n + 1:
        return [round(rules[0] + (rules[-1] - rules[0]) * k / n, 1)
                for k in range(n + 1)]
    return [round(rules[0] + 38.85 * k, 1) for k in range(n + 1)]


def zoom(im, z, contrast=1.32, sharp=1.65):
    c = im.resize((im.width * z, im.height * z), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(contrast)
    return ImageEnhance.Sharpness(c).enhance(sharp)


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119d/crops-v119d'
    os.makedirs(outdir, exist_ok=True)

    # --- p44: x30 celica + x40 w1 (prva beseda) -------------------------
    tops44 = row_tops(44, 20)
    im44 = Image.open(f'{SRC}/p44.jpg').convert('RGB')
    for r in P44_ROWS:
        y0, y1 = int(tops44[r]) - 6, int(tops44[r + 1]) + 6
        cell = im44.crop((NAME_X[0], y0, NAME_X[1], y1))
        c = zoom(cell, 30)
        d = ImageDraw.Draw(c)
        d.line([(0, 18), (90, 18)], fill=(255, 0, 0), width=3)
        c.save(f'{outdir}/zz-p44-r{r:02d}-x30.png')
        w1 = im44.crop((NAME_X[0], y0, 460, y1))
        zoom(w1, 40).save(f'{outdir}/zz-p44-r{r:02d}-x40-w1.png')
    print(f'p44: {len(P44_ROWS)} vrstic -> x30 + x40-w1')

    # --- p49: r13–r20 širok x16 + ime-celica x24 ------------------------
    tops49 = row_tops(49, 21)
    im49 = Image.open(f'{SRC}/p49.jpg').convert('RGB')
    for r in P49_ROWS:
        y0, y1 = int(tops49[r]) - 6, int(tops49[r + 1]) + 6
        wide = im49.crop((WIDE_X[0], y0, WIDE_X[1], y1))
        c = zoom(wide, 16)
        d = ImageDraw.Draw(c)
        d.line([(0, 8), (60, 8)], fill=(255, 0, 0), width=2)
        c.save(f'{outdir}/zz-p49-r{r:02d}-x16-wide.png')
        cell = im49.crop((NAME_X[0], y0, NAME_X[1], y1))
        zoom(cell, 24).save(f'{outdir}/zz-p49-r{r:02d}-x24.png')
    print(f'p49: {len(P49_ROWS)} vrstic -> x16-wide + x24')
    print(f'p44 tops[0..2]={tops44[:3]} p49 tops[13..15]={tops49[13:16]}')


if __name__ == '__main__':
    main()
