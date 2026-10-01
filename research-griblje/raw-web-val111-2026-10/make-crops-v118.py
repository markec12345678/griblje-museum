#!/usr/bin/env python3
"""
Val 118 — imenski pass PS N83 p17–p55: vrstično sidrani imenski trakovi.
1:1 geometrija z3 vrednostnih skladov (make-crops-v113.py: VY0=158, VSTEP=38.65),
samo X-pas = imenska kolona (280–610). Val 114 je potrdil, da vrstice sede na
tem gridu (pomik ovržen — grid artifakt). FUR (Fürtrag) na Y r20.8, prilepljen
v sklad g2.
Izhod: raw-web-val111-2026-10/crops-v118/nz-p{pg}-g{gi}.png (gitignored, regenerabilno).
"""
import os
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v118"
os.makedirs(OUT, exist_ok=True)

PAGES = list(range(17, 56))  # p17–p55
VX0, VX1 = 280, 610          # imenska kolona (recept val 111/113 REGIONS names)
VY0, VSTEP = 158, 38.65
VOVER = 8                    # prekrivanje navzdol (pisar piše nizko)
VSCALE = 6


def prep_cell(im, scale):
    w, h = im.size
    c = im.resize((w * scale, h * scale), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.25)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    return c


made = 0
for pg in PAGES:
    im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
    H = im.size[1]
    groups = [list(range(0, 7)), list(range(7, 14)), list(range(14, 21))]
    for gi, rows in enumerate(groups):
        cells = []
        for r in rows:
            y0 = VY0 + r * VSTEP
            c = im.crop((VX0, max(int(y0 - 3), 0), VX1, int(y0 + VSTEP + VOVER)))
            cells.append(prep_cell(c, VSCALE))
        if gi == 2:
            fy = VY0 + 20.8 * VSTEP
            c = im.crop((VX0, int(fy), VX1, min(int(fy + 2.6 * VSTEP), H - 2)))
            cells.append(prep_cell(c, VSCALE))
        sep = 12
        W = max(c.size[0] for c in cells)
        Ht = sum(c.size[1] for c in cells) + sep * (len(cells) - 1)
        canvas = Image.new("RGB", (W, Ht), (255, 255, 255))
        y = 0
        for c in cells:
            canvas.paste(c, (0, y))
            y += c.size[1] + sep
        canvas.save(os.path.join(OUT, f"nz-p{pg:02d}-g{gi}.png"))
        made += 1
    print(f"p{pg:02d} ok", flush=True)

print("SKUPAJ skladov:", made)
