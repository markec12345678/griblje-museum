#!/usr/bin/env python3
"""Val 108 — PER-TARGET izrezki za direktno branje (instrument val 61/88).

Dva izrezka na cilj:
  (a) trak super-zoom ×8  — številski stolpci Jaethe+Kläfter (g{gi}-strip.png)
  (b) poln tile ×4        — kultur besedilo + vrstica (g{gi}-tile.png, neodvisna
                            identifikacija vrstice prek kultur konteksta p1_kultur)

Geometrija: slot y iz slots-v108.json (DP lestvica, 1:1 val 88), x iz
rowcrops-manifest-v108.json (trak) / tiles-manifest-v86.json (tile).
Pad nad/pod slotom = 30 % višine slota (soseda za kontekst, ne zamenjava).
Izhod: raw-web-val108-2026-10/rowcrops/ + manifest band-v108/targetcrops-manifest-v108.json
"""
import json, os
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v108/slots-v108.json'
RCMAN = f'{REPO}/research-griblje/ps-n83/band-v108/rowcrops-manifest-v108.json'
GEO86 = f'{REPO}/research-griblje/raw-web-val86-2026-10/tiles-manifest-v86.json'
OUTD = f'{REPO}/research-griblje/raw-web-val108-2026-10/rowcrops'
OUTM = f'{REPO}/research-griblje/ps-n83/band-v108/targetcrops-manifest-v108.json'
ZOOM_STRIP, ZOOM_TILE = 8, 4


def main():
    os.makedirs(OUTD, exist_ok=True)
    sl = json.load(open(SLOTS))
    rc = json.load(open(RCMAN))
    geo86 = json.load(open(GEO86))
    tg = json.load(open(f'{REPO}/research-griblje/ps-n83/band-v108/targets-v108.json'))
    band_of = {t['global_idx']: t.get('band') for t in tg['targets']}
    strip_by_band = {(b['page'], b['band']): b['strip'] for b in rc['bands']}
    tile_by_band = {(t['page'], t['group'], t['band']): t for t in geo86['tiles']}
    page_h = {}
    man = []
    n_ok = n_noslot = 0
    for t in sl['targets']:
        gi, pg, pr = t['global_idx'], t['page'], t['page_row']
        bnd = band_of.get(gi)
        if not t.get('slot') or bnd is None:
            n_noslot += 1
            continue
        y0, y1 = t['slot']['y0'], t['slot']['y1']
        pad = max(6, int((y1 - y0) * 0.30))
        im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
        if pg not in page_h:
            page_h[pg] = im.size[1]
        ya, yb = max(0, int(y0) - pad), min(page_h[pg], int(y1) + pad)
        # (a) trak ×8
        st = strip_by_band[(pg, bnd)]
        crop = im.crop((st['x0'], ya, st['x1'], yb))
        crop = crop.resize((crop.width * ZOOM_STRIP, crop.height * ZOOM_STRIP), Image.LANCZOS)
        f1 = f'g{gi:04d}-p{pg:03d}-r{pr:02d}-strip.png'
        crop.save(f'{OUTD}/{f1}')
        # (b) poln tile ×4
        tb = tile_by_band[(pg, 'kultur', bnd)]
        crop2 = im.crop((tb['x0'], ya, tb['x1'], yb))
        crop2 = crop2.resize((crop2.width * ZOOM_TILE, crop2.height * ZOOM_TILE), Image.LANCZOS)
        f2 = f'g{gi:04d}-p{pg:03d}-r{pr:02d}-tile.png'
        crop2.save(f'{OUTD}/{f2}')
        man.append({'global_idx': gi, 'page': pg, 'page_row': pr, 'band': bnd,
                    'slot_y': [y0, y1], 'pad_y': [ya, yb],
                    'strip_x': [st['x0'], st['x1']], 'tile_x': [tb['x0'], tb['x1']],
                    'file_strip': f'rowcrops/{f1}', 'file_tile': f'rowcrops/{f2}'})
        n_ok += 1
    json.dump({'meta': {'val': 108, 'zoom_strip': ZOOM_STRIP, 'zoom_tile': ZOOM_TILE,
                        'source': 'raw-web-val56-2026-10/n083ps-pages',
                        'method': 'slot y = DP lestvica (align-slots-v108.py); pad 30 %; trak = rowcrops-manifest strip; tile = tiles-manifest-v86'},
               'targets': man}, open(OUTM, 'w'), ensure_ascii=False, indent=1)
    print(f'IZREZKI: {n_ok} ciljev (×2 datoteke), brez slota: {n_noslot}; manifest: {OUTM}')


if __name__ == '__main__':
    main()
