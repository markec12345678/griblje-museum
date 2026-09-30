# -*- coding: utf-8 -*-
"""
Val 109 — PZ p48–65 2. prehod (protokoli + Verantwortlichung §1–§8 + Zusammenstellung A/B).

Deterministična priprava izrezkov iz pz-n83/native/pNN.jpeg (nativni skeni, metoda val 56).

Izhod: crops-v109/ + manifest-v109.json (celice za read-v109.mts).

Metoda:
- p48/p49 (protokoli): dve polovici strani @2x (x1.3) — Kurrent proza.
- § strani p50, p52–p60: proza (glava + Roh/Aufwand/percent formule), tabela
  "Darstellung des Rein-Ertrages", Begründung (z rdečimi pripisami).
- p51: nadaljevanje Begründung §1 (proza).
- p61: prazna tiskana predloga — BREZ VLM klica (direktni odtis, dokumentirano).
- p63 (Zus B, ležeča): 4 pasovi (glava + 3 skupine vrstic).
- p65 (Zus A, ležeča): 4 pasovi + zoom desnega bloka (Instruction/Rein-Ertrag).

Nativni skeni so ~150 dpi (maksimum portala, F-PZ-17); 2x render + ojačitev kontrasta.
"""
import json
import os
from PIL import Image, ImageEnhance

BASE = os.path.dirname(os.path.abspath(__file__))
NATIVE = "/home/z/griblje-museum/research-griblje/pz-n83/native"
OUT = os.path.join(BASE, "crops-v109")
os.makedirs(OUT, exist_ok=True)

manifest = []


def crop(p, name, x0, y0, x1, y1, scale=2.0, up=1.0, contrast=1.12, sharpen=True):
    """Izrezek iz nativnega skena strani p; koordinate = deleži (0–1)."""
    src = os.path.join(NATIVE, f"p{p}.jpeg")
    im = Image.open(src).convert("RGB")
    w, h = im.size
    box = (int(x0 * w), int(y0 * h), int(x1 * w), int(y1 * h))
    c = im.crop(box)
    cw, ch = c.size
    c = c.resize((int(cw * up), int(ch * up)), Image.LANCZOS)
    if contrast != 1.0:
        c = ImageEnhance.Contrast(c).enhance(contrast)
    if sharpen:
        c = ImageEnhance.Sharpness(c).enhance(1.4)
    fn = f"{name}.png"
    c.save(os.path.join(OUT, fn))
    manifest.append({"cell": name, "page": p, "group": None, "file": fn,
                     "w": c.size[0], "h": c.size[1]})
    return c.size


# --- p48/p49 protokoli: polovici strani @2x x1.3 ------------------------------
crop(48, "p48-half-a", 0.02, 0.03, 0.99, 0.52, up=1.3)
crop(48, "p48-half-b", 0.02, 0.50, 0.99, 0.99, up=1.3)
crop(49, "p49-half-a", 0.02, 0.03, 0.99, 0.52, up=1.3)
crop(49, "p49-half-b", 0.02, 0.50, 0.99, 0.99, up=1.3)

# --- § strani: proza / tabela / begründung ------------------------------------
# p50 ima daljšo glavo (naslovni blok) — enotno okno kljub temu pokrije.
for p in [50, 52, 53, 54, 55, 56, 57, 58, 59, 60]:
    crop(p, f"p{p}-proza", 0.03, 0.03, 0.99, 0.46, up=1.25)
    crop(p, f"p{p}-table", 0.04, 0.42, 0.98, 0.78, up=1.5)
    crop(p, f"p{p}-begr", 0.03, 0.74, 0.99, 0.99, up=1.25)

# p51: nadaljevanje Begründung §1 (proza na zgornji tretjini; ostalo bleed-through)
crop(51, "p51-proza", 0.03, 0.06, 0.99, 0.36, up=1.25)

# --- p63 Zusammenstellung B (ležeča 1336x1080): 4 pasovi -----------------------
crop(63, "p63-band0-glava", 0.02, 0.02, 0.99, 0.24, up=1.0)
crop(63, "p63-band1-vr1-5", 0.02, 0.20, 0.99, 0.44, up=1.0)
crop(63, "p63-band2-vr6-12", 0.02, 0.40, 0.99, 0.74, up=1.0)
crop(63, "p63-band3-vr13-14", 0.02, 0.70, 0.99, 0.95, up=1.0)

# --- p65 Zusammenstellung A (ležeča 1352x1062): 4 pasovi + desni blok ---------
crop(65, "p65-band0-glava", 0.02, 0.02, 0.99, 0.32, up=1.0)
crop(65, "p65-band1-vr1-2", 0.02, 0.28, 0.99, 0.54, up=1.0)
crop(65, "p65-band2-vr3-8", 0.02, 0.48, 0.99, 0.78, up=1.0)
crop(65, "p65-band3-podpis", 0.02, 0.74, 0.99, 0.92, up=1.0)
crop(65, "p65-desni-zoom", 0.76, 0.28, 0.97, 0.78, up=1.5)

# --- p62/p64: tiskani naslovnici — brez VLM (direktni odtis, dokumentirano) ----

# --- p50 glavni naslovni blok (Veranschlagung + §1) — 1 ločen izrezek ---------
crop(50, "p50-naslov", 0.10, 0.04, 0.99, 0.20, up=1.5)

with open(os.path.join(BASE, "manifest-v109.json"), "w") as f:
    json.dump({"crops": manifest, "note": "p61 + p62 + p64 brez VLM (direktni odtis)"}, f, indent=1)

print(f"OK: {len(manifest)} izrezkov -> {OUT}")
