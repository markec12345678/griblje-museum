#!/usr/bin/env python3
"""Val 108 — ANOTIRANI IZREZKI (1:1 val 88 make-rowcrops-v88.py, prilagojene poti).

Geometrija podkolon (iz RULER-p079-b1 kontrole vala 88): za tabelo PS N83 so v kultur
tile-u desno od kulturskega besedila ozki stolpci: [n-3]=levi rob Jaethe, [n-2]=delilnik,
[n-1]=desni rob Kläfter (n = zadnja ozka vertikalna pravila). Številski trak =
[n-3-10, n-1+40] (preliv števil v Kläfter je pogost — pisar piše čez rob).

Rdeča-supresija: rdeče prečrke (F-PZ-09) so pri profilih lažna »pravila« — piksli z
R≫G,B se belijo pred računom profilov (mreža je črna, ostane).

Izhodi na pas: (a) poln kultur tile ×3 (kontekst), (b) trak ×6 z V-oznakami segmentov.
Manifest: band-v108/rowcrops-manifest-v108.json.
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
GEO86 = f'{REPO}/research-griblje/raw-web-val86-2026-10/tiles-manifest-v86.json'
TARGETS = f'{REPO}/research-griblje/ps-n83/band-v108/targets-v108.json'
OUTD = f'{REPO}/research-griblje/raw-web-val108-2026-10/rowcrops'
MANIFEST = f'{REPO}/research-griblje/ps-n83/band-v108/rowcrops-manifest-v108.json'
ZOOM_FULL, ZOOM_STRIP = 3, 6
MARGIN_PX = 56
MAX_RULE_W = 14


def suppress_red(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0].astype(int), rgb[:, :, 1].astype(int), rgb[:, :, 2].astype(int)
    red = (r > 120) & (r - g > 40) & (r - b > 40)
    out = rgb.copy()
    out[red] = [255, 255, 255]
    return out


def runs_below(prof: np.ndarray, thr: float, max_w: int):
    out, y, n = [], 0, len(prof)
    while y < n:
        if prof[y] < thr:
            y0, mn = y, prof[y]
            while y < n and prof[y] < thr:
                mn = min(mn, prof[y]); y += 1
            if y - y0 <= max_w:
                out.append({'c': (y0 + y - 1) / 2, 'w': y - y0, 'depth': round(float(thr - mn), 1)})
        else:
            y += 1
    return out


def smooth(a: np.ndarray) -> np.ndarray:
    return (np.roll(a, 1) + a + np.roll(a, -1)) / 3


def main():
    os.makedirs(OUTD, exist_ok=True)
    tg = json.load(open(TARGETS))
    geo86 = json.load(open(GEO86))
    geo = {(t['page'], t['group'], t['band']): t for t in geo86['tiles']}

    man_bands = []
    for bnd in tg['bands']:
        pg, b = bnd['page'], bnd['band']
        g = geo[(pg, 'kultur', b)]
        x0, x1 = max(0, g['x0'] - 10), g['x1'] + 10
        y0, y1 = g['y0'], g['y1']
        src_im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
        crop = src_im.crop((x0, y0, x1, y1))
        clean = suppress_red(np.asarray(crop))
        gray = np.asarray(Image.fromarray(clean).convert('L'), dtype=np.float64)
        # vertikalna pravila → številski trak (zadnja 3 ozka pravila)
        prof = smooth(gray.mean(axis=0))
        med = float(np.median(prof))
        vrules = runs_below(prof, med * 0.82, MAX_RULE_W)
        narrow = [r for r in vrules if r['c'] > crop.width * 0.25]
        if len(narrow) >= 3:
            sx0, sx1 = max(0, int(narrow[-3]['c']) - 10), min(crop.width, int(narrow[-1]['c']) + 40)
            strip_mode = f'rules n={len(narrow)}'
        else:
            sx0, sx1 = int(crop.width * 0.55), crop.width
            strip_mode = 'fallback'
        sgray = gray[:, sx0:sx1]
        sprof = smooth(sgray.mean(axis=1))
        smed = float(np.median(sprof))
        hruns = runs_below(sprof, smed * 0.88, 12)
        cuts = [0] + [int(r['c']) for r in hruns] + [crop.height]
        segments = [{'segment': i + 1, 'y0_strip': cuts[i], 'y1_strip': cuts[i + 1]} for i in range(len(cuts) - 1)]
        name = f'p{pg:03d}-b{b}'
        # (a) poln tile ×3
        full = crop.resize((crop.width * ZOOM_FULL, crop.height * ZOOM_FULL), Image.LANCZOS)
        canv = Image.new('RGB', (MARGIN_PX + full.width, full.height), 'white')
        canv.paste(full, (MARGIN_PX, 0))
        d = ImageDraw.Draw(canv)
        for seg in segments:
            yz = seg['y0_strip'] * ZOOM_FULL
            d.line([(0, yz), (MARGIN_PX + full.width, yz)], fill=(255, 0, 0), width=1)
            d.text((6, max(2, (seg['y0_strip'] + seg['y1_strip']) // 2 * ZOOM_FULL - 14)), f'V{seg["segment"]}', fill=(200, 0, 0))
        canv.save(f'{OUTD}/{name}.png')
        # (b) trak ×6
        stim = crop.crop((sx0, 0, sx1, crop.height))
        stim = stim.resize((stim.width * ZOOM_STRIP, stim.height * ZOOM_STRIP), Image.LANCZOS)
        sc = Image.new('RGB', (MARGIN_PX + stim.width, stim.height), 'white')
        sc.paste(stim, (MARGIN_PX, 0))
        ds = ImageDraw.Draw(sc)
        for seg in segments:
            yz = seg['y0_strip'] * ZOOM_STRIP
            ds.line([(0, yz), (MARGIN_PX + stim.width, yz)], fill=(255, 0, 0), width=1)
            ds.text((6, max(2, (seg['y0_strip'] + seg['y1_strip']) // 2 * ZOOM_STRIP - 14)), f'V{seg["segment"]}', fill=(200, 0, 0))
        sc.save(f'{OUTD}/{name}-strip.png')
        man_bands.append({'name': name, 'page': pg, 'band': b,
                          'geo': {'x0': x0, 'x1': x1, 'y0': y0, 'y1': y1},
                          'strip': {'x0': x0 + sx0, 'x1': x0 + sx1, 'y0': y0, 'y1': y1, 'mode': strip_mode,
                                    'n_vrules': len(vrules)},
                          'hseg': {'thr': round(smed * 0.88, 1), 'n_rules': len(hruns)},
                          'segments': segments, 'targets': bnd['targets'],
                          'file': f'rowcrops/{name}.png', 'file_strip': f'rowcrops/{name}-strip.png'})
        print(f'{name}: trak x[{x0 + sx0},{x0 + sx1}] ({strip_mode}), h-pravil {len(hruns)}, slotov {len(segments)}')
    json.dump({'meta': {'val': 108, 'zoom_full': ZOOM_FULL, 'zoom_strip': ZOOM_STRIP, 'margin_px': MARGIN_PX,
                        'source': 'raw-web-val56-2026-10/n083ps-pages (nativni skeni)',
                        'anchors': 'x/y = tiles-manifest-v86.json; trak = zadnja 3 ozka vertikalna pravila; rdeča-supresija; sloti = horizontalni profili nad trakom'},
               'bands': man_bands},
              open(MANIFEST, 'w'), ensure_ascii=False, indent=1)
    print(f'MANIFEST: {MANIFEST} ({len(man_bands)} pasov)')


if __name__ == '__main__':
    main()
