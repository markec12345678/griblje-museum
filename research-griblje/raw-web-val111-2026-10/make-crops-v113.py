#!/usr/bin/env python3
"""
Val 113 — deterministični izrezki za poln re-read PS N83 p17–55 (2. del p1–55).
1:1 val 111 recept (make-crops-v111.py) + val 112 skladovni value zoomi
(zoom-values-v112.py), razširjeno na p17–p55.
Vir: raw-web-val56-2026-10/n083ps-pages/pNN.jpg (~1266x1020).
Y-meja polovic: 160 .. 970; top = 160–565, bot = 545–970.
Value zoom: X 780–940, Y0=158, STEP=38.65, SCALE=8, 3 skladov (r0–6, r7–13,
r14–20+Fürtrag).
Izhod: raw-web-val111-2026-10/crops-v113/ (gitignored, regenerabilno).
"""
import os
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v113"
os.makedirs(OUT, exist_ok=True)

PAGES = list(range(17, 56))  # p17–p55 (2. del re-reada p1–55)
Y_TOP0, Y_TOP1 = 160, 565
Y_BOT0, Y_BOT1 = 545, 970

REGIONS = [
    ("nums",    55, 320, 3),
    ("names",  280, 610, 3),
    ("flaeche", 630, 900, 3),
    ("ertrag",  890, 1266, 2),
]

# ---- val 112 value-zoom parametri (razširjeno: obe sub-koloni + rdeči rob) ----
VX0, VX1 = 730, 950
VY0, VSTEP = 158, 38.65
VSCALE = 8
VOVER = 8  # prekrivanje navzdol (pisar piše nizko, prečka mejo)


def prep(im: Image.Image, scale: int) -> Image.Image:
    w, h = im.size
    im = im.resize((w * scale, h * scale), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.3)
    im = ImageEnhance.Sharpness(im).enhance(1.5)
    return im


made = 0
for pg in PAGES:
    src = os.path.join(SRC, f"p{pg:02d}.jpg")
    im = Image.open(src).convert("RGB")
    H = im.size[1]
    top = im.crop((0, Y_TOP0, im.size[0], Y_TOP1))
    bot = im.crop((0, Y_BOT0, im.size[0], min(Y_BOT1, H)))
    for name, part in (("top", top), ("bot", bot)):
        for reg, x0, x1, sc in REGIONS:
            part.crop((x0, 0, x1, part.size[1]))
            c = prep(part.crop((x0, 0, x1, part.size[1])), sc)
            c.save(os.path.join(OUT, f"p{pg:02d}-{reg}-{name}.png"))
            made += 1
    # skladovni value zoomi
    groups = [list(range(0, 7)), list(range(7, 14)), list(range(14, 21))]
    for gi, rows in enumerate(groups):
        cells = []
        for r in rows:
            y0 = VY0 + r * VSTEP
            c = im.crop((VX0, max(int(y0 - 3), 0), VX1, int(y0 + VSTEP + VOVER)))
            w, h = c.size
            c = c.resize((w * VSCALE, h * VSCALE), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.25)
            c = ImageEnhance.Sharpness(c).enhance(1.6)
            cells.append(c)
        if gi == 2:
            fy = VY0 + 20.8 * VSTEP
            c = im.crop((VX0, int(fy), VX1, min(int(fy + 2.6 * VSTEP), H - 2)))
            w, h = c.size
            c = c.resize((w * VSCALE, h * VSCALE), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.25)
            c = ImageEnhance.Sharpness(c).enhance(1.6)
            cells.append(c)
        W = max(c.size[0] for c in cells)
        sep = 14
        Ht = sum(c.size[1] for c in cells) + sep * (len(cells) - 1)
        canvas = Image.new("RGB", (W, Ht), (255, 255, 255))
        y = 0
        for c in cells:
            canvas.paste(c, (0, y))
            y += c.size[1] + sep
        canvas.save(os.path.join(OUT, f"z-p{pg:02d}-vals-{gi}.png"))
        made += 1
    print(f"p{pg:02d} ok")

print("SKUPAJ izrezkov:", made)

# ---- val 113 dodatek: ENA skladovna slika na stran (vse vrstice + FUR) ×6 ----
import sys
if '--all' in sys.argv:
    VS = 6
    for pg in PAGES:
        im = Image.open(os.path.join(SRC, f"p{pg:02d}.jpg")).convert("RGB")
        H = im.size[1]
        cells = []
        for r in range(0, 21):
            y0 = VY0 + r * VSTEP
            c = im.crop((VX0, max(int(y0 - 3), 0), VX1, int(y0 + VSTEP + VOVER)))
            w, h = c.size
            c = c.resize((w * VS, h * VS), Image.LANCZOS)
            c = ImageEnhance.Contrast(c).enhance(1.25)
            c = ImageEnhance.Sharpness(c).enhance(1.6)
            cells.append(c)
        fy = VY0 + 20.8 * VSTEP
        c = im.crop((VX0, int(fy), VX1, min(int(fy + 2.6 * VSTEP), H - 2)))
        w, h = c.size
        c = c.resize((w * VS, h * VS), Image.LANCZOS)
        c = ImageEnhance.Contrast(c).enhance(1.25)
        c = ImageEnhance.Sharpness(c).enhance(1.6)
        cells.append(c)
        W = max(c.size[0] for c in cells)
        sep = 12
        Ht = sum(c.size[1] for c in cells) + sep * (len(cells) - 1)
        canvas = Image.new("RGB", (W, Ht), (255, 255, 255))
        y = 0
        for c in cells:
            canvas.paste(c, (0, y))
            y += c.size[1] + sep
        canvas.save(os.path.join(OUT, f"z2-p{pg:02d}-vals-all.png"))
        print(f"z2 p{pg:02d} ok", flush=True)
    print("z2 SKUPAJ:", len(PAGES))
