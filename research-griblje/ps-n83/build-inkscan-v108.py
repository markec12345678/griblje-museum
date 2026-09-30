#!/usr/bin/env python3
"""Val 108 — PIKSELJSKI SKEN številskega traku (Jaethe+Kläfter) — determinističen glas.

Kontekst odkritja: kontrola p98 (val 108, listi B + piksli) pokaze, da ima P1 (val 82)
od vrstice r5 naprej SISTEMSKI off-by-one: vrednosti so v viru pisane NIZKO v celici
(tik nad spodnjo mejo), P1 pa jih jebral kot pripadajoce vrstici NAD mejo => REG r_j
vsebuje vrednost fizecne vrstice r_(j+1). Val 88 je ta razred napak reseval z direktnim
branjem izrezkov (instrument val 61/88) — ta skripta doda DETERMINISTICEN pikseljski glas:
detekcija komponent crnila v stevilskem traku + dodelitev celicam po srediscu + oznake
AMBIVALENCA (komponenta precka mejo / sredisce blizu meje).

Metoda (1:1 pouk val 88 RULER kontrol):
  - vertikalne crte: dolge (>60% pas), temne kolone; rdeca-supresija (R>>G,B belimo)
  - stevilski trak = 2 ozki koloni (sirina < 55 px) tik desno od prve siroke (kultur)
  - komponente crnila: zaporedje vrstic z >=3 temnimi piksli v jedru traku
  - dodelitev: celica s srediscem komponente; AMBIVALENCA, ce komponenta precka mejo
    ali je sredisce <= 3 px od meje

Izhod: band-v108/ink-v108.json (per page: components, cells, dodelitve) + konzola povzetek.
NI CR VLM klicev; izhod = COMMITTED artefakt (audit trail).
"""
import json
import os
import sys

import numpy as np
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
SLOTS = f'{REPO}/research-griblje/ps-n83/band-v108/slots-v108.json'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v108/ink-v108.json'

PAGES = [95, 98, 105, 107, 113, 114, 120, 128, 129, 130, 133, 135, 136, 137]


def suppress_red(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0].astype(int), rgb[:, :, 1].astype(int), rgb[:, :, 2].astype(int)
    red = (r > g + 40) & (r > b + 40)
    out = rgb.copy()
    out[red] = (245, 245, 235)
    return out


def detect_vlines(gray: np.ndarray, x0: int, x1: int, y0: int, y1: int):
    """Vertikalne crte: kolone x kjer je delez temnih pikslov > 0.55."""
    pas = gray[y0:y1, x0:x1]
    dark = (pas < 120).mean(axis=0)
    cols = [x for i, x in enumerate(range(x0, x1)) if dark[i] > 0.55]
    # grupiraj sosednje
    groups = []
    for c in cols:
        if groups and c - groups[-1][-1] <= 2:
            groups[-1].append(c)
        else:
            groups.append([c])
    return [(g[0], g[-1]) for g in groups]


def main():
    slots = json.load(open(SLOTS))
    pages = {p['page']: p for p in slots['pages']}
    reg = json.load(open(REG))
    out = {'meta': {'val': 108, 'method': 'pikseljski sken crnila (deterministicen glas); nizko pisanje = svoja celica; AMBIGUOUS = preckanje meje / sredisce <=3px od meje'},
           'pages': []}
    for pg in PAGES:
        p = pages[pg]
        lad = p['ladder']
        im = Image.open(f'{SRC}/p{pg}.jpg').convert('RGB')
        a = suppress_red(np.array(im))
        gray = np.array(Image.fromarray(a).convert('L')).astype(float)
        y0, y1 = int(lad[0]) - 2, int(lad[-1]) + 2
        vls = detect_vlines(gray, 640, 1010, y0, y1)
        # sirine kolon
        widths = [(b - a0) for a0, b in vls]
        # prva siroka kolona (kultur) = zaporedje kolon s sirino >= 90 med sosednjima crtama
        wide_i = None
        for i in range(len(vls) - 1):
            if vls[i + 1][0] - vls[i][1] >= 90:
                wide_i = i
                break
        # 2 ozki koloni tik desno od siroke (Jaethe, Klafter) — lahko s 1 crto vmes
        if wide_i is None:
            out['pages'].append({'page': pg, 'error': 'no wide kolona'})
            print(f'p{pg}: NO WIDE kolona', file=sys.stderr)
            continue
        j0 = wide_i + 1
        # poisci 3 crte: j0 = zacetek Jaethe, naslednji = delilnik, nato = konec Klafter
        col_j, col_k = None, None
        k = j0
        while k < len(vls) - 2:
            w1 = vls[k + 1][0] - vls[k][1]
            w2 = vls[k + 2][0] - vls[k + 1][1]
            if w1 < 55 and w2 < 55:
                col_j = (vls[k][1] + 1, vls[k + 1][0] - 1)
                col_k = (vls[k + 1][1] + 1, vls[k + 2][0] - 1)
                break
            k += 1
        if col_j is None:
            out['pages'].append({'page': pg, 'error': 'no 2 ozki koloni'})
            print(f'p{pg}: NO 2 ozki koloni', file=sys.stderr)
            continue
        x0, x1 = col_j[0], col_k[1]
        strip = gray[:, x0:x1]
        core = strip[:, 4:strip.shape[1] - 4]
        dark = (core < 120).sum(axis=1)
        H = a.shape[0]
        ink_rows = [y for y in range(max(0, y0 - 6), min(H, y1 + 6)) if dark[y] >= 3]
        comps = []
        if ink_rows:
            cur = [ink_rows[0]]
            for y in ink_rows[1:]:
                if y - cur[-1] <= 2:
                    cur.append(y)
                else:
                    comps.append(cur)
                    cur = [y]
            comps.append(cur)
        comps = [c for c in comps if (c[-1] - c[0]) >= 4]
        cells = [(lad[j], lad[j + 1]) for j in range(len(lad) - 1)]
        items = []
        for c in comps:
            cy = (c[0] + c[-1]) / 2
            cell = None
            for k2, (a0, b0) in enumerate(cells):
                if a0 <= cy < b0:
                    cell = k2
                    break
            if cell is None:
                cell = min(range(len(cells)), key=lambda k3: min(abs(cells[k3][0] - cy), abs(cells[k3][1] - cy)))
            a0, b0 = cells[cell]
            amb = (c[0] < a0 - 1) or (c[-1] > b0 + 1) or min(cy - a0, b0 - cy) <= 3
            items.append({'y0': c[0], 'y1': c[-1], 'cy': round(cy, 1), 'h': c[-1] - c[0],
                          'cell': cell, 'ambiguous': bool(amb)})
        # prazne celice
        filled = {it['cell'] for it in items}
        empties = [k2 for k2 in range(len(cells)) if k2 not in filled]
        out['pages'].append({'page': pg, 'col_j': col_j, 'col_k': col_k, 'cells': len(cells),
                             'components': items, 'empty_cells': empties})
        print(f"p{pg}: kolone J={col_j} K={col_k} | komponent={len(items)} | prazne={empties}")
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print(f'ink-v108.json: {len(out["pages"])} strani')


if __name__ == '__main__':
    main()
