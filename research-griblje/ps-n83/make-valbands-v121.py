#!/usr/bin/env python3
"""Val 121 — pasovni vrednostni re-read p3–p55: BOTTOM-RULE anchoring.

Nadgradna metoda (F-OCI-05, protokol 143 §6.1): vrednostni pasovi, kjer je
spodnje PISANO pravilo vsake vrstice programske zaznano in vrezano v izrezek
(nič več linearno zaupanje TOP0+STEP). Vrednost pripada pasu NAD svojim
spodnjim pravilom — atribucija je vidna, ne računana.

Grid:
  - znane TOP0 pine (comitane konstante del 2d-x3 / del 2e / val 120) upoštevamo
    kot HINT; ce so na strani zaznana pravila, se grid SNAP-a na njih
    (per-vrstični snap, toleranca 5 px, sicer linearno).
  - neznane strani: TOP0 avtomatsko = najboljše ujemanje linearnega grafa
    (STEP=38.85) z zaznanimi pravili v pasu [140..230]; kvaliteta = povprečna
    oddaljenost + št. ujemajočih; guard: ujemanj >= vrstice-1, sicer NEEDS-CAL.

Izrezki (mode 'bands'): X 150–1150 (parzelle + haus + ime + stand + wohnort +
kultur + jae/kl + classe + ertrag + capital) ×4, 7 vrstic/segment; rdeče
kratke črte = vrstični topi (rK P-parz oznake, kjer je PARZ zaupanja vreden);
rdeče CELIČNE črte čez celo širino = PISANA SPODNJA PRAVILA pasu.

Mode 'zz pg r': celicni zoom ene vrstice (X 150–1150, Y [pravilo r-1 − 12 ..
pravilo r+1 + 12]) ×8 — adjudikacija F-OCI-05 kandidatov.

Uporaba:
  python3 make-valbands-v121.py cal              # poročilo snap-kvalitete
  python3 make-valbands-v121.py cal-vis [outdir] # overviews za vizualno verifikacijo
  python3 make-valbands-v121.py bands [outdir]   # vrednostni pasovi
  python3 make-valbands-v121.py zz 31 0 [outdir] # celicni zoom p31 r0
"""
import os
import sys

from PIL import Image, ImageEnhance, ImageDraw

SRC = '/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages'
REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
STEP = 38.85
X0, X1 = 150, 1150

# --- znane pine (comitane; prejšnji vali) -----------------------------------
PIN_TOP0 = {
    17: 166.5, 19: 162.0, 20: 170.0, 25: 156.2, 26: 162.2, 31: 163.3,
    32: 171.0, 37: 167.0, 38: 168.0, 43: 180.0,
    44: 167.2, 45: 180.2, 46: 167.1, 47: 170.5, 48: 171.2, 49: 202.0,
    50: 166.6, 51: 166.2, 52: 167.2, 53: 169.2, 54: 168.2, 55: 170.2,
}
# PARZ_START zaupljivo samo kjer je sekvenco potrdil prejšnji pass (p17+,
# formula 281+(pg-17)*20 potrjena val 120 na 10 straneh); p3–p16 beremo
# parzelle z izrezkov (iregularne vrstice: p3=21, p6=21, p7=21, p11=23).
PARZ_TRUSTED_FROM = 17


def detect_rules(im):
    """Zaznaj horizontalna tiskana pravila v pasu X 370–600."""
    import numpy as np
    a = np.asarray(im.convert('L'), dtype=np.int16)
    band = a[:, 370:600]
    dark = (band < 140).mean(axis=1)
    rules = []
    y = 100
    while y < a.shape[0] - 30:
        if dark[y] > 0.28:
            y2 = y
            while y2 < a.shape[0] - 1 and dark[y2] > 0.22:
                y2 += 1
            if y2 - y < 6:
                rules.append(y)
            y = y2 + 1
        else:
            y += 1
    return rules


def snap_grid(rules, top0_hint, n):
    """Linearni graf (top0, STEP) — BREZ per-vrsticnega snapa.

    POMEN (F-VB infra-nauk val 121):
      1) top0 MORA biti glavno pravilo (dno glave) — cona [146, 184] na vseh
         PS straneh (pini 156.2–202, ne-pin pravilne 151.25–170.5). Brez te
         omejitve se iskanje zaklene TOČNO ENO VRSTICO PRENIZKO (top0 =
         spodnje pravilo r0 — p10/p14: 196–205), nevidno v mean-off.
      2) PER-VRSTIČNI SNAP je NEVAREN: textne vrstice v pasu X 370–600 so
         privlačnik (p17 166.5->160, p49 202->211, p4 154.25->149). Pini so
         comitane (val 119/120 branja 1:1 s parzellami) — linearni graf iz
         verificiranega top0 je zato pravilen; tiskana pravila so od linearnih
         pozicij oddaljena <= 5 px (max_off diagostika) — pri x4 nevidno.

    Vrne (top0, tops_linear, meta) — meta: mean_off/max_off proti zaznanim
    pravilom (diagnostika), snapped=0 (snap onemogočen).
    """
    if top0_hint is not None:
        lo, hi = top0_hint, top0_hint
    else:
        lo, hi = 146.0, 184.0
    best, best_off = None, None
    t = lo
    while t <= hi:
        offs = []
        for k in range(n + 1):
            y = t + STEP * k
            near = [r for r in rules if abs(r - y) <= 6]
            offs.append(min((abs(r - y) for r in near), default=6.0))
        m = sum(offs) / len(offs)
        if best_off is None or m < best_off:
            best_off, best = m, t
        t += 0.25
    tops = [round(best + STEP * k, 1) for k in range(n + 1)]
    max_off = 0.0
    for y in tops:
        near = [r for r in rules if abs(r - y) <= 6]
        if near:
            max_off = max(max_off, min(abs(r - y) for r in near))
    meta = {'top0_lin': round(best, 2), 'snapped': 0,
            'n_lines': n + 1, 'max_off': round(max_off, 2),
            'mean_off': round(best_off, 3)}
    return best, tops, meta


def rows_of_page():
    import json
    from collections import Counter
    rows = json.load(open(REG))
    c = Counter(r['page'] for r in rows if 3 <= r['page'] <= 55)
    return dict(sorted(c.items()))


def parz_start(pg, n):
    """Pričakovana tiskana parzella prve vrstice.

    p17+: formula 281+(pg-17)*20 (potrjena val 120 na 10 straneh).
    p3–p16: sekvenca 1+20*(pg-3) — POTRJENA na cal-zoomih p4 (21), p10 (141),
    p11 (161, vodilna enica odrezana), p14 (221), p15 (241), p16 (261);
    dodatne vrstice (Fürtrag/vstave) so IZVEN sekvence in jih bralec označi."""
    if pg >= PARZ_TRUSTED_FROM:
        return 281 + (pg - 17) * 20
    return 1 + 20 * (pg - 3)


def grid_for(pg, n, rules):
    top0_hint = PIN_TOP0.get(pg)
    _, tops, meta = snap_grid(rules, top0_hint, n)
    meta['pin'] = top0_hint
    return tops, meta


def src_im(pg):
    return Image.open(f'{SRC}/p{pg:02d}.jpg').convert('RGB')


def mode_cal():
    rows = rows_of_page()
    bad = []
    for pg in sorted(rows):
        n = rows[pg]
        im = src_im(pg)
        rules = detect_rules(im)
        tops, meta = grid_for(pg, n, rules)
        # pin-strani: comitane kalibracija prejšnjih valov je ZAUPANJA VREDNA
        # (val 119/120 branja 1:1 s tiskanimi parzellami) — linearno; brez
        # pina linearni graf mora lepo mere proti zaznanim pravilom
        if meta['pin'] is not None:
            ok = True
        else:
            ok = meta['mean_off'] < 7.0
        flag = 'OK ' if ok else 'NEEDS-CAL'
        if not ok:
            bad.append(pg)
        ps = parz_start(pg, n)
        print(f'p{pg}: n={n} top0_lin={meta["top0_lin"]} pin={meta["pin"]} '
              f'snap={meta["snapped"]}/{meta["n_lines"]} meanoff={meta["mean_off"]} '
              f'maxoff={meta["max_off"]} P{ps if ps else "?"} {flag}')
    print('NEEDS-CAL:', bad if bad else 'none')


def overview(im, tops, pg, outdir):
    z = 0.55
    c = im.resize((int(im.width * z), int(im.height * z)), Image.LANCZOS)
    d = ImageDraw.Draw(c)
    for k, t in enumerate(tops):
        ry = t * z
        d.line([(0, ry), (c.width, ry)], fill=(255, 0, 0), width=1)
        d.text((4, ry + 1), f'r{k}', fill=(255, 0, 0))
    c.save(f'{outdir}/ovw-p{pg}.png')


def mode_cal_vis(outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    for pg in sorted(rows):
        n = rows[pg]
        im = src_im(pg)
        tops, _ = grid_for(pg, n, detect_rules(im))
        overview(im, tops, pg, outdir)
    print('overviews ->', outdir)


def mode_cal_zoom(pg, outdir):
    """Cal-zoom levega dela (X 140–660) prvih 8 vrstic, ×3 — vizualna
    kalibracija TOP0 za NEEDS-CAL strani (metoda val 120)."""
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops, meta = grid_for(pg, n, detect_rules(im))
    r_hi = min(8, n)
    y0, y1 = int(tops[0]) - 28, int(tops[r_hi]) + 22
    c = im.crop((140, y0, 660, y1))
    c = c.resize((c.width * 3, c.height * 3), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r_hi + 1):
        ry = (tops[r] - y0) * 3
        d.line([(0, ry), (110, ry)], fill=(255, 0, 0), width=3)
        d.text((116, ry - 18), f'r{r}', fill=(200, 0, 0))
        if r < r_hi:
            ry2 = (tops[r + 1] - y0) * 3
            d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
            d.text((116, ry2 + 2), f'rule r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/cal-p{pg}.png')
    print(f'p{pg}: top0_lin={meta["top0_lin"]} -> {outdir}/cal-p{pg}.png')


def segcrop(im, tops, r0, r1, pg, outdir, nmax):
    ytop = int(tops[r0]) - 10
    ybot = int(tops[min(r1, nmax)]) + 14
    c = im.crop((X0, ytop, X1, ybot))
    c = c.resize((c.width * 4, c.height * 4), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.3)
    c = ImageEnhance.Sharpness(c).enhance(1.6)
    d = ImageDraw.Draw(c)
    for r in range(r0, min(r1, nmax)):
        ry = (tops[r] - ytop) * 4
        d.line([(0, ry), (110, ry)], fill=(255, 0, 0), width=3)
        d.text((116, ry - 18), f'r{r}', fill=(200, 0, 0))
        # PISANO SPODNJE PRAVILO te vrstice = tops[r+1] — cela širina
        ry2 = (tops[r + 1] - ytop) * 4
        d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
        d.text((116, ry2 + 2), f'rule r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/vb-p{pg}-seg{r0 // 7}.png')


def mode_bands(outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    for pg in sorted(rows):
        n = rows[pg]
        im = src_im(pg)
        tops, _ = grid_for(pg, n, detect_rules(im))
        nseg = (n + 6) // 7
        for s in range(nseg):
            segcrop(im, tops, s * 7, (s + 1) * 7, pg, outdir, n)
        print(f'p{pg}: n={n} -> vb-seg0-seg{nseg - 1}')
    print('done ->', outdir)


def vseg(im, tops, r0, r1, pg, outdir, nmax, parz0):
    """Vrednostni trak X 690–1150 x6 (kultur + jae/kl + classe + ertrag +
    capital) — oznake rK + P{parz} (kjer parz0 zaupljiv). Kot valseg-v119e."""
    ytop = int(tops[r0]) - 10
    ybot = int(tops[min(r1, nmax)]) + 14
    c = im.crop((690, ytop, 1150, ybot))
    c = c.resize((c.width * 6, c.height * 6), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.32)
    c = ImageEnhance.Sharpness(c).enhance(1.65)
    d = ImageDraw.Draw(c)
    for r in range(r0, min(r1, nmax)):
        ry = (tops[r] - ytop) * 6
        d.line([(0, ry), (150, ry)], fill=(255, 0, 0), width=3)
        lbl = f'r{r}' + (f' P{parz0 + r}' if parz0 is not None else '')
        d.text((156, ry - 18), lbl, fill=(200, 0, 0))
        ry2 = (tops[r + 1] - ytop) * 6
        d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
        d.text((156, ry2 + 2), f'rule r{r}', fill=(200, 0, 0))
    c.save(f'{outdir}/vs-p{pg}-seg{r0 // 7}.png')


def mode_vseg(pages, outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    for pg in sorted(pages):
        n = rows[pg]
        im = src_im(pg)
        tops, _ = grid_for(pg, n, detect_rules(im))
        parz0 = parz_start(pg, n)
        nseg = (n + 6) // 7
        for s in range(nseg):
            vseg(im, tops, s * 7, (s + 1) * 7, pg, outdir, n, parz0)
        print(f'p{pg}: n={n} parz0={parz0} -> vs-seg0-seg{nseg - 1}')
    print('done ->', outdir)


def mode_zz(pg, r, outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = rows_of_page()
    n = rows[pg]
    im = src_im(pg)
    tops, _ = grid_for(pg, n, detect_rules(im))
    y0 = int(tops[r]) - 12
    y1 = int(tops[min(r + 2, n)]) + 12
    c = im.crop((X0, y0, X1, y1))
    c = c.resize((c.width * 8, c.height * 8), Image.LANCZOS)
    c = ImageEnhance.Contrast(c).enhance(1.35)
    c = ImageEnhance.Sharpness(c).enhance(1.7)
    d = ImageDraw.Draw(c)
    for k, rr in enumerate(range(max(0, r - 1), min(r + 2, n))):
        ry = (tops[rr] - y0) * 8
        d.line([(0, ry), (130, ry)], fill=(255, 0, 0), width=3)
        d.text((136, ry - 18), f'r{rr}', fill=(200, 0, 0))
        ry2 = (tops[rr + 1] - y0) * 8
        d.line([(0, ry2), (c.width, ry2)], fill=(255, 0, 0), width=2)
        d.text((136, ry2 + 2), f'rule r{rr}', fill=(200, 0, 0))
    c.save(f'{outdir}/zz-p{pg}-r{r}.png')
    print(f'zz -> {outdir}/zz-p{pg}-r{r}.png (tops r{r}..r{r + 1}: '
          f'{tops[r]}, {tops[r + 1]})')


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'cal'
    if mode == 'cal':
        mode_cal()
    elif mode == 'cal-vis':
        mode_cal_vis(sys.argv[2] if len(sys.argv) > 2 else '/tmp/v121/ovw')
    elif mode == 'bands':
        mode_bands(sys.argv[2] if len(sys.argv) > 2 else '/tmp/v121/vb')
    elif mode == 'cal-zoom':
        outdir = sys.argv[3] if len(sys.argv) > 3 else '/tmp/v121/cal'
        mode_cal_zoom(int(sys.argv[2]), outdir)
    elif mode == 'vseg':
        pages = [int(x) for x in sys.argv[2].split(',')]
        outdir = sys.argv[3] if len(sys.argv) > 3 else '/tmp/v121/vals'
        mode_vseg(pages, outdir)
    elif mode == 'zz':
        outdir = sys.argv[4] if len(sys.argv) > 4 else '/tmp/v121/zz'
        mode_zz(int(sys.argv[2]), int(sys.argv[3]), outdir)
    else:
        raise SystemExit(f'neznan mode {mode}')


if __name__ == '__main__':
    main()
