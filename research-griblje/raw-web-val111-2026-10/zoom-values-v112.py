#!/usr/bin/env python3
"""
Val 112 — stacked ultra-zoomi vrednostne kolone (Quad. Klafter) za re-read p4–16.
Vir: raw-web-val56-2026-10/n083ps-pages/pNN.jpg (~1266x1020).
Kalibracija vrst (p07/p12 row_bands_y): r0 160-200, korak ~38.7px, r19 893-931, Fürtrag ~931-975.
Izhod: 3 skladovne slike na stran (r0–r6, r7–r13, r14–r20+Fürtrag), celice x8.
"""
import os, sys
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v112"
os.makedirs(OUT, exist_ok=True)

X0, X1 = 780, 940          # vrednostna sub-kolona + rdečirob
Y0, STEP = 158, 38.65      # r0 zgoraj, korak
SCALE = 8


def band(y0: float, y1: float) -> Image.Image:
    return im.crop((X0, int(y0), X1, int(y1)))


def prep(c: Image.Image) -> Image.Image:
    w, h = c.size
    c = c.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.25)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    return c


pg = int(sys.argv[1])
im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
H = im.size[1]

groups = [list(range(0, 7)), list(range(7, 14)), list(range(14, 21))]
for gi, rows in enumerate(groups):
    cells = []
    labels = []
    for r in rows:
        y0 = Y0 + r * STEP
        cells.append(prep(band(y0, y0 + STEP + 1)))
        labels.append(f"r{r}")
    # Fürtrag v zadnji skupini
    if gi == 2:
        fy = Y0 + 20.8 * STEP
        cells.append(prep(band(fy, min(fy + 2.2 * STEP, H - 2))))
        labels.append("FUR")
    W = max(c.size[0] for c in cells)
    sep = 14
    Htot = sum(c.size[1] for c in cells) + sep * (len(cells) - 1)
    canvas = Image.new("RGB", (W, Htot), (255, 255, 255))
    y = 0
    for c in cells:
        canvas.paste(c, (0, y))
        y += c.size[1] + sep
    canvas.save(os.path.join(OUT, f"z-p{pg:02d}-vals-{gi}.png"))
    print(f"p{pg:02d} g{gi}: rows {labels} -> z-p{pg:02d}-vals-{gi}.png ({W}x{Htot})")
