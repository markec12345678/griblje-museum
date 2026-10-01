#!/usr/bin/env python3
"""Val 119 del 2c — rowzoom s X-pasom v imenu (ne prepiše diag-).
Uporaba: python3 rowzoom-x-v119c.py PG ROW X0 X1 SCALE DY OUTPREFIX
Izhod: OUTPREFIX-p{pg}-r{row}-x{X0}-{X1}.png
"""
import sys
import os
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"

pg = int(sys.argv[1])
row = int(sys.argv[2])
x0 = int(sys.argv[3])
x1 = int(sys.argv[4])
sc = int(sys.argv[5])
dy = int(sys.argv[6]) if len(sys.argv) > 6 else 6
prefix = sys.argv[7] if len(sys.argv) > 7 else "zz"

VY0, VSTEP = 158, 38.65
im = Image.open(os.path.join(SRC, f"p{pg}.jpg")).convert("RGB")
yc = VY0 + row * VSTEP + VSTEP / 2 + dy
y0, y1 = int(yc - VSTEP * 0.62), int(yc + VSTEP * 0.62)
c = im.crop((x0, y0, x1, y1))
w, h = c.size
c = c.resize((w * sc, h * sc), Image.LANCZOS)
c = ImageEnhance.Contrast(c).enhance(1.3)
c = ImageEnhance.Sharpness(c).enhance(1.5)
out = f"{prefix}-p{pg}-r{row:02d}-x{x0}-{x1}.png"
c.save(out)
print(out, c.size)
