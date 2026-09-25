#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Val 66 — ISSUE #42 §7 PASS 4b: deterministični izrezki (crops) listov A02–A05
(uodid 227668 / 227670 / 227671 / 227673, k.o. N83 Griblje).
Vir: research-griblje/raw-web-val42-2026-10/n083a-pages/{a227668,a227670,a227671,a227673}.jpg
Izhod: research-griblje/atlas-1825/pass4b/crops/*.png (LANCZOS, kontrast+ostrina).
Regenerabilno; crops gitignored (vzor a01/make-a01-crops.py, val 65).

Protokol 2 neodvisnih prehodov (vzor val 61/65):
  PREHOD A  — sistematična mreža 2x čez cel list (4x2 oziroma 3x2 ploščice)
  PREHOD B  — drugačna razdelitev z odmikom (3x2 oziroma 2x2), ni sidrana na A
  T         — naslovni pas (2 izrezka na list) za identiteto/vintage lista
  R         — ciljani izrezki po prehodih A/B (dodani posebej, glej REC)
  R2        — super-zoom za dvomljive glife (dodano po branju)

Koordinatna konvencija: px v OSNOVNEM rasterju vsakega lista:
  A02 = a227668.jpg 3010x2158  ·  A03 = a227670.jpg 2645x2154
  A04 = a227671.jpg 2645x2158  ·  A05 = a227673.jpg 2634x2165
"""
import os
from PIL import Image, ImageEnhance

SRC = "/home/z/griblje-museum/research-griblje/raw-web-val42-2026-10/n083a-pages"
OUT = "/home/z/griblje-museum/research-griblje/atlas-1825/pass4b/crops"
os.makedirs(OUT, exist_ok=True)

SHEETS = {
    "A02": "a227668.jpg",
    "A03": "a227670.jpg",
    "A04": "a227671.jpg",
    "A05": "a227673.jpg",
}

# (pass, sheet, name, x0, y0, x1, y1, scale)
CROPS = []


def grid(pas, sheet, prefix, W, H, cols, rows, scale, ox=0, oy=0):
    cw = (W - ox) / cols
    ch = (H - oy) / rows
    for r in range(rows):
        for c in range(cols):
            x0 = int(ox + c * cw)
            y0 = int(oy + r * ch)
            x1 = int(ox + (c + 1) * cw) if c < cols - 1 else W
            y1 = int(oy + (r + 1) * ch) if r < rows - 1 else H
            CROPS.append((pas, sheet, f"{prefix}-r{r+1}c{c+1}", x0, y0, x1, y1, scale))


# --- PREHOD A: sistematična mreža 2x čez cel list ---
grid("A", "A02", "v", 3010, 2158, 4, 2, 2.0)
grid("A", "A03", "v", 2645, 2154, 3, 2, 1.9)
grid("A", "A04", "v", 2645, 2158, 3, 2, 1.9)
grid("A", "A05", "v", 2634, 2165, 4, 2, 2.0)

# --- PREHOD B: odmik (250, 260) + 3x2 oziroma 2x2, drugačna razdelitev ---
grid("B", "A02", "b", 3010, 2158, 3, 2, 1.6, ox=250, oy=260)
grid("B", "A03", "b", 2645, 2154, 2, 2, 1.6, ox=260, oy=270)
grid("B", "A04", "b", 2645, 2158, 2, 2, 1.6, ox=260, oy=270)
grid("B", "A05", "b", 2634, 2165, 3, 2, 1.6, ox=250, oy=260)

# --- T: naslovni pas (identiteta/vintage: napis, številka lista OIX24*) ---
for sheet, W, H in [("A02", 3010, 2158), ("A03", 2645, 2154), ("A04", 2645, 2158), ("A05", 2634, 2165)]:
    mid = W // 2
    CROPS.append(("T", sheet, "t-title-l", 0, 20, mid + 200, 150, 2.2))
    CROPS.append(("T", sheet, "t-title-r", mid - 200, 20, W, 150, 2.2))

# --- A01 kontrola: kotni znak sekcije I + naslov (razreši dvom o družini listov) ---
CROPS.append(("T", "A01", "t-a01-corner", 60, 40, 560, 440, 2.5))


def prep(im: Image.Image, scale: float) -> Image.Image:
    w, h = im.size
    im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    im = ImageEnhance.Sharpness(im).enhance(1.4)
    return im


def make(sheet, x0, y0, x1, y1, scale, dst):
    src = SHEETS[sheet] if sheet in SHEETS else "a01.jpg"
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    im = im.crop((x0, y0, x1, y1))
    im = prep(im, scale)
    im.save(dst)


made = []
for pas, sheet, name, x0, y0, x1, y1, scale in CROPS:
    dst = os.path.join(OUT, f"{pas}-{sheet}-{name}.png")
    make(sheet, x0, y0, x1, y1, scale, dst)
    made.append((f"{pas}-{sheet}-{name}", im.size if False else (x1 - x0, y1 - y0), scale))

for n, box, s in made:
    print(f"{n}: box={box} x{s}")
print(f"\n{len(made)} crops -> {OUT}")
