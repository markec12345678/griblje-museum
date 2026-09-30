#!/usr/bin/env python3
"""
Val 111 — deterministični izrezki za poln re-read PS N83 p3–16 (1. del p1–55).
Vir: raw-web-val56-2026-10/n083ps-pages/pNN.jpg (~1266x1017, razpon dveh listov).
Struktura razpona (val 61 kartezija + test p05):
  x ~ 55–320  = Nro. des Blattes + Benennung des Tractes + prečrtani Dominical/Rustical + Haus Nro
  x ~280–610  = Vor und Zuname + Stand + Wohnort (Des Eigenthümers)
  x ~630–900  = Kultur Gattung + Flächen Inhalt (N.o Joche | Quad. Klafter) (Des Grundstückes)
  x ~890–1266 = Classe + Reiner jährlich Ertrag (fl|kr) + Capital Werth (fl|kr) + Anmerkung
Vrste izrezkov (LANCZOS, kontrast/ostrost po val 61 receptu):
  pNN-top.png / pNN-bot.png     — polni razpon ×2 (kontekst, poravnava vrstic)
  pNN-nums-top/bot.png          — x 55–320  ×3 (blatt/haus številke)
  pXX-names-top/bot.png         — x 280–610 ×3 (imena/stand/wohnort)
  pNN-flaeche-top/bot.png       — x 630–900 ×3 (kultur + joche/klafter — glavna kolona)
  pNN-ertrag-top/bot.png        — x 890–1266 ×2 (classe/ertrag/capital/anmerkung)
Y-meja polovic: 170 (konec glave) .. 960 (konec tabela); top = 160–565, bot = 545–965
(1 vrstica prekrivanja za zveznost); vsotni pas Fürtrag (860–970) je v bot.
Izhod: raw-web-val111-2026-10/crops-v111/ (gitignored, regenerabilno).
"""
import os
from PIL import Image, ImageEnhance

REPO = "/home/z/griblje-museum/research-griblje"
SRC = f"{REPO}/raw-web-val56-2026-10/n083ps-pages"
OUT = f"{REPO}/raw-web-val111-2026-10/crops-v111"
os.makedirs(OUT, exist_ok=True)

PAGES = list(range(3, 17))  # p03–p16 (1. del re-reada p1–55)
Y_TOP0, Y_TOP1 = 160, 565
Y_BOT0, Y_BOT1 = 545, 970

REGIONS = [
    ("nums",    55, 320, 3),
    ("names",  280, 610, 3),
    ("flaeche", 630, 900, 3),
    ("ertrag",  890, 1266, 2),
]


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
    W, H = im.size
    for tag, y0, y1 in [("top", Y_TOP0, Y_TOP1), ("bot", Y_BOT0, Y_BOT1)]:
        full = im.crop((0, y0, W, y1))
        prep(full, 2).save(os.path.join(OUT, f"p{pg:02d}-{tag}.png"))
        made += 1
        for name, x0, x1, sc in REGIONS:
            part = im.crop((x0, y0, x1, min(y1, H)))
            prep(part, sc).save(os.path.join(OUT, f"p{pg:02d}-{name}-{tag}.png"))
            made += 1
print(f"{made} izrezkov -> {OUT} ({len(PAGES)} strani p{PAGES[0]:02d}–p{PAGES[-1]:02d})")
