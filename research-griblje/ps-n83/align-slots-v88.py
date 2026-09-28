#!/usr/bin/env python3
"""Val 88 — CELOSTRANSKA PORAVNAVA VRSTIC (mreža) za 139 digit-split ciljev.

Metoda v3 (po poglobljeni analizi p079: tabela ima UNIFORMNO mrežo vrstic; pod
podatkovnimi vrsticami sledita 1–2 Summa/Fürtrag vrstici z enakim razmakom):
  1. številski trak (x = narrow[-3]-10 .. narrow[-1]+40 znotraj kultur tile range,
     rdeča-supresija — F-PZ-09 prečrke ne smejo biti »pravila«),
  2. detekcija horizontalnih pravil (prag 0.88, sirina ≤ 12),
  3. glava: header_zone iz tiles-manifest-v86.json (top_rule+110); prvo pravilo f
     = prvo detektirano pravilo POD glavo,
  4. mreža: korak g = mediana zaporednih razmakov DP-lestvice v [24,58]; pravila
     f + g·k do H-8 (SYNTHETIC mreža); validacija: vsako detektirano pravilo
     najmanj ±6 px od mrežne pozicije (sicer flag),
  5. slot k = pass vrstica k za k < n_pass; preostali sloti = Summa/Fürtrag
     (zahteva: 0 ≤ totals_slots ≤ 3, sicer flag — NI tihega sklepanja).
Izhod: band-v88/slots-v88.json (COMMITTED — audit trail za branje in super-zoom).
"""
import json, os, statistics
import numpy as np
from PIL import Image

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages'
GEO86 = f'{REPO}/research-griblje/raw-web-val86-2026-10/tiles-manifest-v86.json'
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
TARGETS = f'{REPO}/research-griblje/ps-n83/band-v88/targets-v88.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v88/slots-v88.json'


def suppress_red(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[:, :, 0].astype(int), rgb[:, :, 1].astype(int), rgb[:, :, 2].astype(int)
    red = (r > 120) & (r - g > 40) & (r - b > 40)
    out = rgb.copy()
    out[red] = [255, 255, 255]
    return out


def rules_1d(prof: np.ndarray, thr, max_w):
    out, y, n = [], 0, len(prof)
    while y < n:
        if prof[y] < thr:
            y0 = y
            while y < n and prof[y] < thr:
                y += 1
            if y - y0 <= max_w:
                out.append((y0 + y - 1) / 2)
        else:
            y += 1
    return out


def best_ladder(rules: list, start_idx: int, length: int, gmin=18, gmax=62):
    """Najbolj gladko podzaporedje `rules` dolžine `length`, ki se začne pri start_idx.
    Stane: vsota kvadratov drugih diferenc razmakov (uniformna tabela ≈ 0). DP."""
    n = len(rules)
    if start_idx >= n or length < 3 or n - start_idx < length:
        return None, None
    BIG = float('inf')
    # dp[(j, l)] = (cost, parent_i) — podzaporedje dolžine l, ki se konča pri j
    dp = {}
    for j in range(start_idx + 1, n):
        gap = rules[j] - rules[start_idx]
        if gmin <= gap <= gmax:
            dp[(j, 2)] = (0.0, start_idx)
    best_end, best_cost = None, BIG
    for l in range(2, length):
        for (j, ll), (cost, _) in list(dp.items()):
            if ll != l:
                continue
            for k in range(j + 1, n):
                gap = rules[k] - rules[j]
                if not (gmin <= gap <= gmax):
                    continue
                prev_gap = None
                # potrebujemo prejšnji razmak za drugo diferenco — iz parent
                pi = dp[(j, ll)][1]
                prev_gap = rules[j] - rules[pi]
                c2 = cost + (gap - prev_gap) ** 2
                key = (k, l + 1)
                if key not in dp or c2 < dp[key][0]:
                    dp[key] = (c2, j)
    for (j, ll), (cost, _) in dp.items():
        if ll == length and cost < best_cost:
            best_cost, best_end = cost, j
    if best_end is None:
        return None, None
    seq, cur = [], (best_end, length)
    while cur in dp:
        seq.append(rules[cur[0]])
        cur = (dp[cur][1], cur[1] - 1)
        if cur[1] == 1:
            seq.append(rules[cur[0]])
            break
    # cur je lahko (start_idx, 1) — ni v dp
    if seq[-1] != rules[start_idx]:
        seq.append(rules[start_idx])
    seq.reverse()
    if len(seq) != length:
        return None, None
    gaps = [seq[i + 1] - seq[i] for i in range(length - 1)]
    return seq, round(sum((gaps[i + 1] - gaps[i]) ** 2 for i in range(len(gaps) - 1)), 1)


def main():
    tg = json.load(open(TARGETS))
    geo88 = json.load(open(GEO86))
    hz = {int(k): v['top_rule'] for k, v in geo88['meta']['header_zones'].items()}
    # trak x IZ VERIFICIRANEGA rowcrops-manifest (vizualna kontrola p079-b1: [737,899]);
    # per stran: mediana po pasovih (x sidra so page-level, detekcija ima ±3 px jitter)
    rc = json.load(open(f'{REPO}/research-griblje/ps-n83/band-v88/rowcrops-manifest.json'))
    strip_by_page = {}
    for b in rc['bands']:
        strip_by_page.setdefault(b['page'], []).append((b['strip']['x0'], b['strip']['x1']))
    strip_x = {pg: (int(statistics.median([a for a, _ in v])), int(statistics.median([b for _, b in v])))
               for pg, v in strip_by_page.items()}
    # ROČNI trakovi (vizualna verifikacija prek RULER-p056/071/074.png — tiskana mreža
    # teh strani je prešibka za vertikalno detekcijo; stolpca N:º Jäche + Quad. Kläfter
    # prebrana iz glave: p56 [810,880], p71 [753,829], p74 [805,875] + marže)
    strip_x.update({56: (800, 925), 71: (743, 869), 74: (797, 915)})
    pages = sorted(set(t['page'] for t in tg['targets']))
    out_pages, out_targets, problems = [], [], []
    for pg in pages:
        sx0, sx1 = strip_x[pg]
        im = Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')
        W, H = im.size
        crop = im.crop((sx0, 0, sx1, H))
        clean = suppress_red(np.asarray(crop))
        gray = np.asarray(Image.fromarray(clean).convert('L'), dtype=np.float64)
        prof_y = (np.roll(gray.mean(axis=1), 1) + gray.mean(axis=1) + np.roll(gray.mean(axis=1), -1)) / 3
        med_y = float(np.median(prof_y))
        n_pass = len(json.load(open(f'{P1D}/p{pg:03d}.json')).get('rows', []))
        hb = hz.get(pg, None)
        header_bottom = (hb + 110 + 6) if hb is not None else int(0.13 * H)
        # prilagodljivi prag + DP podzaporedje (točno n_pass+1 pravil, gladkost)
        cands = []
        hrules_last = []
        for thr_k, mw in ((0.88, 12), (0.91, 12), (0.94, 12), (0.85, 12), (0.97, 16), (1.0, 16), (1.03, 18), (0.8, 16), (1.1, 20), (1.18, 22), (0.75, 20), (1.25, 24)):
            hrules = rules_1d(prof_y, med_y * thr_k, mw)
            hrules_last = hrules
            below = [r for r in hrules if r > 0.08 * H]
            if len(below) < n_pass + 1:
                continue
            for si in range(min(4, len(below) - n_pass)):
                seq, cost = best_ladder(below, si, n_pass + 1, gmin=15, gmax=70)
                if seq:
                    cands.append((seq, thr_k, cost))
            if cands and min(c[2] for c in cands) <= 40:
                break
        if not cands:
            best = None
        else:
            # (1) sanitarna kontrola ZAČETKA: prvi razmak mora biti blizu mediane
            #     (veriga, ki začne v glavi, ima prvi razmak 1.3-1.5x mediane — p056/p082 dokaz);
            #     ZADNJI razmak sme biti krajši (pisar stisne zadnjo vrstico pred Summo — p079: 27/38.5)
            def start_ok(seq):
                gaps = [seq[i + 1] - seq[i] for i in range(len(seq) - 1)]
                gm = statistics.median(gaps)
                return 0.72 * gm <= gaps[0] <= 1.28 * gm
            strict = [c for c in cands if start_ok(c[0])]
            pool0 = strict if strict else cands
            # (2) med kandidati z doslednostjo <= 4x min cene izberi tistega, ki sega
            #     NAJNIŽE (pravi podatkovni lestvici sledi Summa cona — p079 dokaz)
            min_cost = min(c[2] for c in pool0)
            pool = [c for c in pool0 if c[2] <= max(4 * min_cost, min_cost + 120)]
            b = max(pool, key=lambda c: c[0][-1])
            best = (b[0], b[1], b[2], hrules_last)
        if not best:
            problems.append({'page': pg, 'issue': 'brez gladkega podzaporedja', 'pass_rows': n_pass})
            lad, used_thr, cost, hrules = [], None, None, []
        else:
            lad, used_thr, cost, hrules = best[0], best[1], best[2], best[3]
        n_slots = len(lad) - 1 if lad else 0
        totals_slots = 0
        if lad:
            end = lad[-1]
            nxt = [r for r in hrules if r > end + 20 and r <= end + 70]
            while nxt and totals_slots < 3:
                totals_slots += 1
                end = nxt[0]
                nxt = [r for r in hrules if r > end + 20 and r <= end + 70]
        ok = bool(lad)
        out_pages.append({'page': pg, 'strip_x': [sx0, sx1], 'header_bottom': header_bottom,
                          'ladder': lad, 'n_slots': n_slots, 'n_pass_rows': n_pass,
                          'totals_slots': totals_slots, 'dp_cost': cost, 'thr': used_thr, 'aligned': ok,
                          'slots': [{'slot': k, 'y0': lad[k], 'y1': lad[k + 1]} for k in range(n_slots)]})
        for t in tg['targets']:
            if t['page'] != pg:
                continue
            pr = t['page_row']
            sl = {'y0': lad[pr], 'y1': lad[pr + 1]} if pr < n_slots else None
            if sl is None:
                problems.append({'page': pg, 'target_page_row': pr, 'issue': 'page_row >= slots'})
            out_targets.append({'global_idx': t['global_idx'], 'page': pg, 'page_row': pr,
                                'slot': sl, 'p1': t['p1_jaethe'], 'p2': t['p2_jaethe'],
                                'tile_diag': t['tile_raw_number'], 'p1_kultur': t['p1_kultur']})
        print(f'p{pg:03d}: trak x[{sx0},{sx1}], prag {used_thr}, lestvica {n_slots} slotov vs pass {n_pass}, dp_cost={cost}, totals≈{totals_slots} {"OK" if ok else "!! PROBLEM"}')
    json.dump({'meta': {'val': 88, 'method': 'DP podzaporedje detektiranih pravil (točno n_pass+1, gladkost drugih diferenc, rdeča-supresija); slot k = pass vrstica k; za koncem lestvice Summa/Fürtrag'},
               'pages': out_pages, 'targets': out_targets, 'problems': problems},
              open(OUT, 'w'), ensure_ascii=False, indent=1)
    print(f'\nIZHOD: {OUT}; strani {len(pages)}, problematične: {len(problems)}')


if __name__ == '__main__':
    main()
