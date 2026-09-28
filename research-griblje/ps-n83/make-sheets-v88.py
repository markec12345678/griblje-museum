#!/usr/bin/env python3
"""Val 88 — KOMPOZITNI LISTI za branje (Pass A) — 17 samodejnih strani.

Per cilj: izrez 3 slotov (cilj ±1) iz številskega traku, ×7 lanczos, z rdečo
črto pri ciljnem slotu; 3 cilji na list (horizontalno). Kontekstna vrstica zgolj
za orientacijo; poravnava se med branjem preveri proti p1/p2 kontekstu (QA zanka).

Izhodi: rowcrops/sheet-XX.png + sheets-index.json (COMMITTED).
"""
import json, os, math
from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v88/slots-v88.json'
OUTD = f'{REPO}/research-griblje/raw-web-val88-2026-10/rowcrops'
IDX = f'{REPO}/research-griblje/ps-n83/band-v88/sheets-index.json'
Z = 7
PER_SHEET = 3
MANUAL_PAGES = {56, 71, 74, 82}  # ročne strani (neredna mreža / off-by-one — polstranski re-read)


def main():
    s = json.load(open(SLOTS))
    pages = {p['page']: p for p in s['pages']}
    tg = [t for t in s['targets'] if t['page'] not in MANUAL_PAGES and t['slot']]
    tg.sort(key=lambda t: (t['page'], t['page_row']))
    print(f'targets na listih: {len(tg)} (strani {[p for p in sorted(pages) if p not in MANUAL_PAGES]})')
    cache = {}
    sheets, idx = [], []
    for si in range(math.ceil(len(tg) / PER_SHEET)):
        chunk = tg[si * PER_SHEET:(si + 1) * PER_SHEET]
        crops = []
        for t in chunk:
            pg, pr = t['page'], t['page_row']
            p = pages[pg]
            lad, sx0, sx1 = p['ladder'], p['strip_x'][0], p['strip_x'][1]
            if pg not in cache:
                cache[pg] = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
            im = cache[pg]
            a = int(lad[max(0, pr - 1)]) - 5
            b = int(lad[min(len(lad) - 1, pr + 2)]) + 5
            crop = im.crop((sx0, a, sx1, b))
            big = crop.resize((crop.width * Z, crop.height * Z), Image.LANCZOS)
            c = Image.new('RGB', (big.width + 74, big.height + 26), 'white')
            c.paste(big, (74, 26))
            d = ImageDraw.Draw(c)
            d.text((6, 4), f"p{pg:03d} r{pr:02d} (s{pr})", fill=(0, 0, 160))
            # rdeča črta = ZGORNJI rob ciljnega slota; puščica
            yt = (lad[pr] - a) * Z + 26
            yb = (lad[pr + 1] - a) * Z + 26
            d.line([(0, yt), (c.width, yt)], fill=(255, 0, 0), width=2)
            d.line([(0, yb), (c.width, yb)], fill=(120, 120, 255), width=1)
            d.polygon([(8, yt + 4), (22, yt + 12), (8, yt + 20)], fill=(200, 0, 0))
            crops.append(c)
        W = sum(c.width for c in crops) + 12 * (len(crops) + 1)
        H = max(c.height for c in crops) + 16
        sheet = Image.new('RGB', (W, H), (235, 235, 235))
        x = 12
        for c in crops:
            sheet.paste(c, (x, 8))
            x += c.width + 12
        fn = f'sheet-{si:02d}'
        sheet.save(f'{OUTD}/{fn}.png')
        sheets.append(fn)
        for t in chunk:
            idx.append({'sheet': fn, 'global_idx': t['global_idx'], 'page': t['page'], 'page_row': t['page_row']})
    json.dump({'meta': {'val': 88, 'zoom': Z, 'per_sheet': PER_SHEET,
                        'note': 'rdeca crta+puscica = ciljni slot; modra = spodnji rob; kontekst = sosednja vrstica'},
               'sheets': sheets, 'targets': idx}, open(IDX, 'w'), ensure_ascii=False, indent=1)
    print(f'IZHOD: {len(sheets)} listov → {IDX}')


if __name__ == '__main__':
    main()
