#!/usr/bin/env python3
"""Val 108 — KOMPOZITNI LISTI za direktno branje (1:1 val 88 make-sheets-v88.py).

Per cilj: izrez 3 vrstic (cilj ±1) iz celotnega kultur+številskega bloka
(x = 620–1005 nativnega skena — kontrola p95/p98/p105/p133: Jaethe+Kläfter
stolpca ležita ~805–860, kultur besedilo od ~783; trak-strip fallback napak
izogibamo z DOVOLJ ŠIROKIM razponom), ×3 lanczos, rdeča črta na zgornji meji
ciljnega slota, modra na spodnji. Kontekst vrstic za orientacijo + QA
poravnave proti p1/p2 (vzorec val 88: "poravnava se med branjem preveri").

Izhodi: raw-web-val108-2026-10/sheets/g{gi}-sheet.png + band-v108/sheets-index-v108.json
(COMMITTED). Regenerabilno, 0 VLM klicev.
"""
import json
import os
from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v108/slots-v108.json'
OUTD = f'{REPO}/research-griblje/raw-web-val108-2026-10/sheets'
IDX = f'{REPO}/research-griblje/ps-n83/band-v108/sheets-index-v108.json'
Z = 3
X0, X1 = 620, 1005
PAD_Y = 8


def main():
    s = json.load(open(SLOTS))
    pages = {p['page']: p for p in s['pages']}
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
        c = Image.new('RGB', (big.width + 96, big.height + 26), 'white')
        c.paste(big, (96, 26))
        d = ImageDraw.Draw(c)
        d.text((6, 4), f"p{pg:03d} r{k:02d} gi{t['global_idx']}", fill=(0, 0, 160))
        # rdeca crta = ZGORNJA meja ciljnega slota; modra = spodnja
        yt = (t['slot']['y0'] - y_up) * Z + 26
        yb = (t['slot']['y1'] - y_up) * Z + 26
        d.line([(96, yt), (c.width, yt)], fill=(255, 0, 0), width=2)
        d.line([(96, yb), (c.width, yb)], fill=(90, 90, 255), width=2)
        d.polygon([(78, yt + 4), (92, yt + 12), (78, yt + 20)], fill=(200, 0, 0))
        fn = f"g{t['global_idx']}-sheet.png"
        c.save(f'{OUTD}/{fn}')
        idx.append({'sheet': fn, 'global_idx': t['global_idx'], 'page': pg, 'page_row': k,
                    'p1': t.get('p1'), 'p2': t.get('p2'), 'tile_diag': t.get('tile_diag')})
    json.dump({'meta': {'val': 108, 'zoom': Z, 'x_range': [X0, X1], 'context': 'cilj ±1 vrstica',
                        'note': 'rdeca crta+puscica = zgornja meja ciljnega slota; modra = spodnja; 1:1 val 88 metodo'},
               'targets': idx}, open(IDX, 'w'), ensure_ascii=False, indent=1)
    print(f'sheets: {len(idx)}')


if __name__ == '__main__':
    main()
