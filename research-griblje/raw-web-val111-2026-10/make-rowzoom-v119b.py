#!/usr/bin/env python3
"""Val 119 del 2 — rowzoom s prostim Y-odmikom (per-page grid skew).
Uporaba: python3 make-rowzoom-v119b.py PG ROW [x0 x1 scale dy]
Privzeto: X 230–615, ×12, dy=+6 (pisar piše nizko); dy nastavi po strani.
Izhod: crops-v118/diag-p{pg}-r{row}.png (isti kanon imen kot v118)
"""
import sys
import os
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v118"

pg = int(sys.argv[1])
row = int(sys.argv[2])
x0 = int(sys.argv[3]) if len(sys.argv) > 3 else 230
x1 = int(sys.argv[4]) if len(sys.argv) > 4 else 615
sc = int(sys.argv[5]) if len(sys.argv) > 5 else 12
dy = int(sys.argv[6]) if len(sys.argv) > 6 else 6

VY0, VSTEP = 158, 38.65
im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
yc = VY0 + row * VSTEP + VSTEP / 2 + dy
y0, y1 = int(yc - VSTEP * 0.62), int(yc + VSTEP * 0.62)
c = im.crop((x0, y0, x1, y1))
w, h = c.size
c = c.resize((w * sc, h * sc), Image.LANCZOS)
c = ImageEnhance.Contrast(c).enhance(1.3)
c = ImageEnhance.Sharpness(c).enhance(1.5)
out = os.path.join(OUT, f"diag-p{pg}-r{row:02d}.png")
c.save(out)
print(out, c.size)
