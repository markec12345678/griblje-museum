#!/usr/bin/env python3
"""Val 108 — PASOVNE SLIKE po straneh (poln re-read 14 strani, instrument val 61/88).

Odkritje vala 108: kontrola p98 pokaze, da P1 (val 82) od r5 naprej SISTEMSKO
off-by-one bere vrednosti (vrednost iz naslednje vrstice) — REG jaethe/klafter
so za 1 vrstico zamaknjene navzgor (dokaz: /tmp kontrole + hišno/no_blatt
identifikacija + direktni vid r10/r11: 1188 = hiša 25, 558 = hiša 26).
=> val 108 razsirjen: POLN re-read vseh vrstic 14 strani (ne samo 79 markerjev).

Izhodi: raw-web-val108-2026-10/pagebands/p{pg}-b{band}.png (4 pasovi x ~5 vrstic,
cela sirina, L-crte + oznake vrstic) + band-v108/pagebands-index-v108.json
(COMMITTED). 0 VLM klicev.
"""
import json
import os

from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v108/slots-v108.json'
OUTD = f'{REPO}/research-griblje/raw-web-val108-2026-10/pagebands'
IDX = f'{REPO}/research-griblje/ps-n83/band-v108/pagebands-index-v108.json'
Z = 2.4
X0, X1 = 60, 1010
PAGES = [95, 98, 105, 107, 113, 114, 120, 128, 129, 130, 133, 135, 136, 137]
BAND = 5


def main():
    slots = json.load(open(SLOTS))
    pages = {p['page']: p for p in slots['pages']}
    os.makedirs(OUTD, exist_ok=True)
    idx = []
    for pg in PAGES:
        p = pages[pg]
        lad = p['ladder']
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        nb = (len(lad) - 1 + BAND - 1) // BAND
        for bi in range(nb):
            r0, r1 = bi * BAND, min((bi + 1) * BAND, len(lad) - 1)
            ya = int(lad[r0]) - 6
            yb = int(lad[r1]) + 6
            crop = im.crop((X0, max(0, ya), X1, min(im.height, yb)))
            big = crop.resize((int(crop.width * Z), int(crop.height * Z)), Image.LANCZOS)
            c = Image.new('RGB', (big.width + 74, big.height + 24), 'white')
            c.paste(big, (74, 24))
            d = ImageDraw.Draw(c)
            d.text((4, 4), f'p{pg:03d} pas {bi} (r{r0:02d}-r{r1 - 1:02d})', fill=(0, 0, 160))
            for r in range(r0, r1 + 1):
                yy = (lad[r] - ya) * Z + 24
                d.line([(74, yy), (c.width, yy)], fill=(255, 60, 60) if r in (r0, r1) else (255, 160, 160), width=2)
                d.text((2, yy - 12), f'r{r:02d}', fill=(160, 0, 0))
            fn = f'p{pg:03d}-b{bi}.png'
            c.save(f'{OUTD}/{fn}')
            idx.append({'page': pg, 'band': bi, 'rows': [r0, r1 - 1], 'file': fn})
    json.dump({'meta': {'val': 108, 'zoom': Z, 'x_range': [X0, X1], 'note': 'poln re-read 14 strani; r-de oznake na crti (zgornja meja vrstice r)'},
               'bands': idx}, open(IDX, 'w'), ensure_ascii=False, indent=1)
    print(f'pagebands: {len(idx)}')


if __name__ == '__main__':
    main()
