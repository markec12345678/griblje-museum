#!/usr/bin/env python3
"""Val 88 — PASS B listi (×7) z odmiki iz Pass A.

Per cilj: izrez 3 fizičnih vrstic (cilj ±1) iz številskega traku, ×7 lanczos.
Položaj = ladder[page_row + offset_strani] (odmik iz passA-v88.json: p57 +1,
p58 +1, p83 +2, ostale 0). 3 cilje na list.
"""
import json, os, math
from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v88/slots-v88.json'
PASSA = f'{REPO}/research-griblje/ps-n83/band-v88/passA-v88.json'
OUTD = f'{REPO}/research-griblje/raw-web-val88-2026-10/rowcrops'
IDX = f'{REPO}/research-griblje/ps-n83/band-v88/sheetsB-index.json'
Z = 7
PER_SHEET = 3


def main():
    s = json.load(open(SLOTS))
    pa = json.load(open(PASSA))
    STRIPS = {int(k): tuple(v) for k, v in json.load(open(f'{REPO}/research-griblje/ps-n83/band-v88/strips-uniform.json')).items()}
    pages = {p['page']: p for p in s['pages']}
    offs = {int(k): v.get('offset', 0) for k, v in pa['pages'].items()}
    # samo pravi cilji (ključi so numerični global_idx)
    tg = []
    for k, t in pa['targets'].items():
        if not k.isdigit():
            continue
        tg.append({'global_idx': int(k), **t})
    tg.sort(key=lambda t: (t['page'], t['row']))
    print(f'PASS B cilji: {len(tg)}')
    cache, sheets, idx = {}, [], []
    for si in range(math.ceil(len(tg) / PER_SHEET)):
        chunk = tg[si * PER_SHEET:(si + 1) * PER_SHEET]
        crops = []
        for t in chunk:
            pg, pr = t['page'], t['row']
            p = pages[pg]
            lad = p['ladder']
            sx0, sx1 = STRIPS[pg]
            off = offs.get(pg, 0)
            li = pr + off
            if li + 1 >= len(lad):
                li = len(lad) - 2
            if pr + off >= len(lad) - 1:
                # robni primer: vrstica za zadnjim pravilom (Summa cona) — sintetiziran rob
                import statistics as _st
                gaps = [lad[i + 1] - lad[i] for i in range(len(lad) - 1)]
                g = _st.median(gaps)
                lad = lad + [lad[-1] + g, lad[-1] + 2 * g]
                li = pr + off
            a = int(lad[max(0, li - 1)]) - 6
            b = int(lad[min(len(lad) - 1, li + 2)]) + 6
            if pg not in cache:
                cache[pg] = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
            crop = cache[pg].crop((sx0, a, sx1, b))
            big = crop.resize((crop.width * Z, crop.height * Z), Image.LANCZOS)
            c = Image.new('RGB', (big.width + 96, big.height + 26), 'white')
            c.paste(big, (96, 26))
            d = ImageDraw.Draw(c)
            d.text((6, 4), f"p{pg:03d} r{pr:02d} (lad{li})", fill=(0, 0, 160))
            yt = (lad[li] - a) * Z + 26
            yb = (lad[li + 1] - a) * Z + 26
            d.line([(0, yt), (c.width, yt)], fill=(255, 0, 0), width=2)
            d.line([(0, yb), (c.width, yb)], fill=(120, 120, 255), width=1)
            d.polygon([(10, yt + 4), (24, yt + 12), (10, yt + 20)], fill=(200, 0, 0))
            crops.append(c)
        W = sum(c.width for c in crops) + 12 * (len(crops) + 1)
        H = max(c.height for c in crops) + 16
        sheet = Image.new('RGB', (W, H), (235, 235, 235))
        x = 12
        for c in crops:
            sheet.paste(c, (x, 8))
            x += c.width + 12
        fn = f'B-{si:02d}'
        sheet.save(f'{OUTD}/{fn}.png')
        sheets.append(fn)
        for t in chunk:
            idx.append({'sheet': fn, 'global_idx': t['global_idx'], 'page': t['page'], 'page_row': t['row']})
    json.dump({'meta': {'val': 88, 'pass': 'B', 'zoom': Z, 'offsets': offs},
               'sheets': sheets, 'targets': idx}, open(IDX, 'w'), ensure_ascii=False, indent=1)
    print(f'IZHOD: {len(sheets)} PASS B listov')


if __name__ == '__main__':
    main()
