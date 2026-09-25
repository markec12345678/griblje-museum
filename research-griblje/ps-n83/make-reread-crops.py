#!/usr/bin/env python3
"""
Val 61 — deterministični izrezi (crops) za re-read izbranih strani PS N83.
Vir: research-griblje/raw-web-val56-2026-10/n083ps-pages/pNN.jpg (1266x1017 preview).
Izhod: research-griblje/ps-n83/reread-crops/*.png (LANCZOS 3x, kontrast).
Regenerabilno; crops so gitignored. Za VLM ali direktno agentovo branje.
Struktura strani (izbranega listu dvostranskega razprtja):
  leva polovica = lastniški blok (Des Eigenthümers), desna = parcelni blok (Des Grundstückes).
"""
import os
from PIL import Image, ImageEnhance

SRC = "/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages"
OUT = "/home/z/griblje-museum/research-griblje/ps-n83/reread-crops"
os.makedirs(OUT, exist_ok=True)

SCALE = 3

# (page, name, x0, y0, x1, y1) — koordinate na 1266x1017 sliki
CROPS = [
    # --- p11/p12: imenski stolpec (lastniški blok), dve vertikalni polovici ---
    (11, "p11-names-top",  285, 140, 530, 560),
    (11, "p11-names-bot",  285, 540, 530, 960),
    (12, "p12-names-top",  285, 140, 530, 560),
    (12, "p12-names-bot",  285, 540, 530, 960),
    # --- p11/p12: številski stolpci (blatt + uebersetzung) ---
    (11, "p11-nums",        85, 140, 310, 960),
    (12, "p12-nums",        85, 140, 310, 960),
    # --- p12: vsotni pas (Fürtrag) ---
    (12, "p12-totals",     640, 860, 1120, 970),
    # --- p14: glava (tiskani stolpci) + vsotni pas ---
    (14, "p14-header",     640,  35, 1266, 170),
    (14, "p14-header-left", 85,  35,  660, 170),
    (14, "p14-totals",     640, 860, 1120, 970),
    # --- p36/p42: vsotni pas (Fürtrag veriga kršitve) ---
    (36, "p36-totals",     640, 860, 1120, 970),
    (42, "p42-totals",     640, 840, 1120, 970),
    # --- p44/45/48/51: številski stolpci (no_blatt kontinuiteta) ---
    (44, "p44-nums",        85, 140, 310, 960),
    (45, "p45-nums",        85, 140, 310, 960),
    (48, "p48-nums",        85, 140, 310, 960),
    (51, "p51-nums",        85, 140, 310, 960),
]

def prep(im: Image.Image) -> Image.Image:
    w, h = im.size
    im = im.resize((w * SCALE, h * SCALE), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.35)
    im = ImageEnhance.Sharpness(im).enhance(1.6)
    return im

made = []
for page, name, x0, y0, x1, y1 in CROPS:
    src = os.path.join(SRC, f"p{page:02d}.jpg")
    im = Image.open(src).convert("RGB")
    im = im.crop((x0, y0, x1, y1))
    im = prep(im)
    dst = os.path.join(OUT, f"{name}.png")
    im.save(dst)
    made.append((name, im.size))

for n, s in made:
    print(f"{n}: {s[0]}x{s[1]}")
print(f"\n{len(made)} crops -> {OUT}")
