#!/usr/bin/env python3
"""
Val 65 — deterministični izrezki (crops) katastrskega lista A01 (uodid 227666).
Vir: research-griblje/raw-web-val42-2026-10/n083a-pages/a01.jpg (2826x2273 JPEG).
Izhod: research-griblje/a01/reread-crops/*.png (LANCZOS, kontrast+ostrina).
Regenerabilno; crops so gitignored (vzor ps-n83/make-reread-crops.py, val 61).
Namen: PASS 4 (issue #42 §7) — inventory objektov na A01 po protokolu
2 neodvisnih prehodov (glavni agent bere izrezke direktno, brez VLM klicev).

Koordinatni okvir: celotni raster 2826x2273.
  - vasicno jedro (ob kolesarski cesti, zeleni dvoriščni bloki): x 1700-2450, y 1200-2273
  - hamlet Zohlant: jug vasicnega jedra (~y 1950-2200)
  - severni mejni objekt (ob Lahovišče): ~ (1900-2200, 0-250)
  - zahodni objekt (Maaßle / Zühlhang?, jugozahod): ~ (500-850, 1930-2200)
  - točkovni simbol "Grüllschen"? (Severozahod od vasi): ~ (1580-1810, 530-720)
Prehod A = mreža 3x po vasicnem jedru (zoom 3x).
Prehod B = kvadranti s premikom + zunanji objekti (zoom 2.5x, drugačna razdelitev),
           da prehod B ni sidran na A.
"""
import os
from PIL import Image, ImageEnhance

SRC = "/home/z/griblje-museum/research-griblje/raw-web-val42-2026-10/n083a-pages/a01.jpg"
OUT = "/home/z/griblje-museum/research-griblje/a01/reread-crops"
os.makedirs(OUT, exist_ok=True)

# (pass, name, x0, y0, x1, y1, scale)
CROPS = [
    # --- PREHOD A: mreža 3x po vasicnem jedru (x 1700-2450, y 1200-2273) ---
    ("A", "v-r1c1", 1700, 1200, 2075, 1558, 3),
    ("A", "v-r1c2", 2075, 1200, 2450, 1558, 3),
    ("A", "v-r2c1", 1700, 1558, 2075, 1916, 3),
    ("A", "v-r2c2", 2075, 1558, 2450, 1916, 3),
    ("A", "v-r3c1", 1700, 1916, 2075, 2273, 3),
    ("A", "v-r3c2", 2075, 1916, 2450, 2273, 3),
    # --- PREHOD B: kvadranti s premikom (drugačna razdelitev, 2.5x) ---
    ("B", "b-nw", 1650, 1180, 2090, 1760, 2.5),
    ("B", "b-ne", 2090, 1180, 2530, 1760, 2.5),
    ("B", "b-sw", 1650, 1760, 2090, 2273, 2.5),
    ("B", "b-se", 2090, 1760, 2530, 2273, 2.5),
    # --- zunanji objekti (oba prehoda) ---
    ("B", "x-north", 1830, 0, 2280, 280, 3),
    ("B", "x-west", 480, 1900, 900, 2220, 3),
    ("B", "x-gruell", 1560, 520, 1830, 740, 3),
    # --- kontekst celotne vasi (1.6x, za topologijo) ---
    ("B", "ctx-village", 1650, 1180, 2530, 2273, 1.6),
    # --- naslovni blok (kontrola metapodatkov, 2x) ---
    ("B", "x-title", 240, 60, 1180, 480, 2),
]


def prep(im: Image.Image, scale: float) -> Image.Image:
    w, h = im.size
    im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    im = ImageEnhance.Sharpness(im).enhance(1.4)
    return im


made = []
for pas, name, x0, y0, x1, y1, scale in CROPS:
    im = Image.open(SRC).convert("RGB")
    im = im.crop((x0, y0, x1, y1))
    im = prep(im, scale)
    dst = os.path.join(OUT, f"{pas}-{name}.png")
    im.save(dst)
    made.append((f"{pas}-{name}", im.size, (x0, y0, x1, y1, scale)))

for n, s, box in made:
    print(f"{n}: {s[0]}x{s[1]}  box={box}")
print(f"\n{len(made)} crops -> {OUT}")

# --- Val 65 reconciliation: ciljani 4x izrezki (dodano po prehodih A/B) ---
REC = [
    # moja branja "92-95" vzhodni del (prehod A r1c2 / prehod B b-ne)
    ("R", "t-94-mine",   2080, 1300, 2280, 1500, 4),
    ("R", "t-95-93-mine",2080, 1380, 2280, 1620, 4),
    # obstojece pozicije BP 93/94/95 (val 52-56 izluscek)
    ("R", "t-94-old",    1980, 1280, 2180, 1480, 4),
    ("R", "t-93-old",    1890, 1510, 2070, 1690, 4),
    ("R", "t-95-old",    1950, 1310, 2130, 1490, 4),
    # manjkajoci BP hotspots
    ("R", "t-57-62",     1800, 1850, 2100, 2120, 4),   # okoli BP 56/55/59/61
    ("R", "t-80-84",     1980, 1500, 2200, 1700, 4),   # med 79 in 85
    ("R", "t-87-91",     2020, 1380, 2220, 1580, 4),   # med 86 in 92
    ("R", "t-96-97",     2000, 1330, 2200, 1530, 4),   # med 95 in 98
    # Zohlant: velika zidana stavba + beli del (r3c1/r3c2)
    ("R", "t-zohlant",   1880, 2020, 2260, 2273, 4),
    # vzhodni "beli" objekti 100+ (kontrola 103/105/107/109)
    ("R", "t-east-100s", 2080, 1180, 2320, 1420, 4),
    ("R", "t-east-100b", 2080, 1380, 2320, 1620, 4),
]
for pas, name, x0, y0, x1, y1, scale in REC:
    im = Image.open(SRC).convert("RGB")
    im = im.crop((x0, y0, x1, y1))
    im = prep(im, scale)
    im.save(os.path.join(OUT, f"{pas}-{name}.png"))
    print(f"{pas}-{name}: {im.size[0]}x{im.size[1]} box=({x0},{y0},{x1},{y1},{scale})")

# --- Val 65 R2: super-zoom 6x za dvomljive glife ---
R2 = [
    ("R2", "z-9x-2157-1354", 2117, 1314, 2197, 1394, 6),   # "9?" dark glyph x3 videna
    ("R2", "z-yellow-2187-1342", 2147, 1302, 2227, 1382, 6), # rumena stavba 24|34|94
    ("R2", "z-94c-2175-1404", 2135, 1364, 2215, 1444, 6),  # "94c" bela stavba
    ("R2", "z-93or94-2169-1538", 2129, 1498, 2209, 1578, 6), # 93|94 rumena
    ("R2", "z-159or109-2185-1428", 2145, 1388, 2225, 1468, 6), # 159|109 rdeca
    ("R2", "z-1459-2121-1468", 2081, 1428, 2161, 1508, 6), # "1459." rdeca
    ("R2", "z-91-2171-1499", 2131, 1459, 2211, 1539, 6),   # "91" kandidat
    ("R2", "z-88-2079-1535", 2039, 1495, 2119, 1575, 6),   # "88" kandidat
    ("R2", "z-87-2109-1490", 2069, 1450, 2149, 1530, 6),   # "87" kandidat
    ("R2", "z-58-1905-1902", 1865, 1862, 1945, 1942, 6),   # "58" kandidat
    ("R2", "z-61-1939-1976", 1899, 1936, 1979, 2016, 6),   # "61" kandidat
    ("R2", "z-59-1788-1940", 1748, 1900, 1828, 1980, 6),   # "59" kandidat (b-sw)
]
for pas, name, x0, y0, x1, y1, scale in R2:
    im = Image.open(SRC).convert("RGB")
    im = im.crop((x0, y0, x1, y1))
    im = prep(im, scale)
    im.save(os.path.join(OUT, f"{pas}-{name}.png"))
    print(f"{pas}-{name}: {im.size[0]}x{im.size[1]} box=({x0},{y0},{x1},{y1},{scale})")
