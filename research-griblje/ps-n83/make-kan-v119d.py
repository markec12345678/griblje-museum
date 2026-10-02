#!/usr/bin/env python3
"""Val 119 del 2d (predanaliza) — parzelle-anchored izrezki (kan-crops).

Za vsako stran: pravila-detekcija (detect-grid-v119d) → rule-anchored segmenti
imenske kolone (X 285–620) + klafter pas (X 615–845) z kN-oznakami in
parzelle-številkami. Za VLM-free agentic branje po metodi 138 §1.

Uporaba: python3 make-kan-v119d.py [outdir]   (priveto /tmp/v119d/crops-v119d)
"""
import json
import os
import subprocess
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
HERE = os.path.dirname(os.path.abspath(__file__))

# parzelle začetek na strani (list 138 §1): p44=821, p45=841, p46=861,
# p47=881, p48=901, p49=921
PARZ_START = {44: 821, 45: 841, 46: 861, 47: 881, 48: 901, 49: 921}
ROWS = {44: 20, 45: 20, 46: 20, 47: 21, 48: 21, 49: 21}
STEP = 38.85


def detect_rules(pg):
    out = subprocess.run(
        [sys.executable, f'{HERE}/detect-grid-v119d.py', str(pg)],
        capture_output=True, text=True, check=True)
    return json.loads(out.stdout)[str(pg)]['rules']


def row_tops(pg):
    rules = detect_rules(pg)
    n = ROWS[pg]
    # obnovi manjkajoče črte po periodičnosti ~STEP: vzami najdaljšo
    #单调no sekvenco z razponom >= n*STEP in jo linearno raztegni
    if len(rules) >= n + 1:
        return [round(rules[0] + (rules[-1] - rules[0]) * k / n, 1)
                for k in range(n + 1)]
    top0 = rules[0] - STEP if rules[0] > 150 else rules[0]
    return [round(top0 + STEP * k, 1) for k in range(n + 1)]


def main():
    outdir = sys.argv[1] if len(sys.argv) > 1 else '/tmp/v119d/crops-v119d'
    os.makedirs(outdir, exist_ok=True)
    for pg in sorted(PARZ_START):
        tops = row_tops(pg)
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        for seg, (r0, r1) in enumerate([(0, 7), (7, 14), (14, ROWS[pg])]):
            if r0 >= ROWS[pg]:
                continue
            ytop, ybot = int(tops[r0]) - 8, int(tops[min(r1, ROWS[pg])]) + 10
            c = im.crop((285, ytop, 620, ybot))
            Z = 5
            c = c.resize((c.width * Z, c.height * Z), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.32)
            c = ImageEnhance.Sharpness(c).enhance(1.65)
            d = ImageDraw.Draw(c)
            for r in range(r0, min(r1, ROWS[pg])):
                ry = (tops[r] - ytop) * Z
                d.line([(0, ry), (70, ry)], fill=(255, 0, 0), width=3)
                d.text((76, ry - 18), f'k{r} p{PARZ_START[pg] + r}',
                       fill=(255, 0, 0))
            c.save(f'{outdir}/kan2-p{pg}-seg{seg}.png')
        print(f'p{pg}: tops={tops[:3]}... → 3 segmenti (kan2-)')


if __name__ == '__main__':
    main()
