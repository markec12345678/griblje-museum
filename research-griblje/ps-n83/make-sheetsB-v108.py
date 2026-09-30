#!/usr/bin/env python3
"""Val 108 — LISTI B: celoširinski izrezki za identifikacijo + branje.

Ugotovitev kontrole: pass1/pass2 sta med sabo off-by-one na nekaterih straneh
(p98 od r8 naprej), DP sloti pa imajo per-page zamike — identifikacija ciljne
fizične vrstice MORA iti prek OWNER kolone (Haus Nro. + ime, pass1 name/hous_no)
in ne samo prek številk. Vzorec val 88 Pass A (polstrani re-read).

Per cilj: cela širina strani (x 60–1010), 3 vrstice (cilj ±1), zoom 2.2,
rdeča/modra črta na meja h ciljnega slota, levo oznaka gi/p/r.
Izhod: raw-web-val108-2026-10/sheetsB/g{gi}-sheetB.png + sheetsB-index-v108.json
"""
import json
import os
from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v108/slots-v108.json'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUTD = f'{REPO}/research-griblje/raw-web-val108-2026-10/sheetsB'
IDX = f'{REPO}/research-griblje/ps-n83/band-v108/sheetsB-index-v108.json'
Z = 2
X0, X1 = 60, 1010
PAD_Y = 8


def main():
    s = json.load(open(SLOTS))
    pages = {p['page']: p for p in s['pages']}
    reg = json.load(open(REG))
    reg_by = {}
    for r in reg:
        reg_by.setdefault(r['page'], []).append(r)
    tg = [t for t in s['targets'] if t.get('slot')]
    tg.sort(key=lambda t: (t['page'], t['page_row']))
    os.makedirs(OUTD, exist_ok=True)
    cache = {}
    idx = []
    for t in tg:
        pg, k = t['page'], t['page_row']
        p = pages[pg]
        lad = p['ladder']
        hb = p.get('header_bottom') or lad[0]
        y_up = lad[k - 1] - PAD_Y if k > 0 else hb - PAD_Y
        y_dn = lad[k + 2] + PAD_Y if k + 2 < len(lad) else lad[-1] + PAD_Y
        if pg not in cache:
            cache[pg] = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        im = cache[pg]
        crop = im.crop((X0, max(0, int(y_up)), X1, min(im.height, int(y_dn))))
        big = crop.resize((crop.width * Z, crop.height * Z), Image.LANCZOS)
        c = Image.new('RGB', (big.width + 120, big.height + 24), 'white')
        c.paste(big, (120, 24))
        d = ImageDraw.Draw(c)
        rows = reg_by.get(pg, [])
        rr = rows[k] if k < len(rows) else {}
        label = f"gi{t['global_idx']} p{pg:03d} r{k:02d} house={rr.get('haus_no', '?')} {rr.get('owner_original', '')}"
        d.text((4, 4), label[:46], fill=(0, 0, 160))
        yt = (t['slot']['y0'] - y_up) * Z + 24
        yb = (t['slot']['y1'] - y_up) * Z + 24
        d.line([(120, yt), (c.width, yt)], fill=(255, 0, 0), width=3)
        d.line([(120, yb), (c.width, yb)], fill=(70, 70, 255), width=3)
        d.polygon([(100, yt + 4), (116, yt + 13), (100, yt + 22)], fill=(200, 0, 0))
        fn = f"g{t['global_idx']}-sheetB.png"
        c.save(f'{OUTD}/{fn}')
        idx.append({'sheetB': fn, 'global_idx': t['global_idx'], 'page': pg, 'page_row': k,
                    'p1': t.get('p1'), 'p2': t.get('p2'), 'tile_diag': t.get('tile_diag'),
                    'reg_haus_no': rr.get('haus_no'), 'reg_owner': rr.get('owner_original')})
    json.dump({'meta': {'val': 108, 'zoom': Z, 'x_range': [X0, X1], 'context': 'cilj ±1 vrstica, cela širina (owner identifikacija)'},
               'targets': idx}, open(IDX, 'w'), ensure_ascii=False, indent=1)
    print(f'sheetsB: {len(idx)}')


if __name__ == '__main__':
    main()
