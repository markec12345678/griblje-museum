#!/usr/bin/env python3
"""Val 108 — REKONSTRUKCIJA 79 FRESH review ciljev za ročni re-read (instrument val 61/88).

Obseg (roadmap val 105/107/98):
  - 56 × v86-review-pass-digit-split + 14 × v86-review-col-split  (val 107, p110–120 + p122–141)
  -  7 × v86-review-pass-digit-split +  2 × v86-review-col-split  (val 98, p95–109 — doc 113 §9.2)
  Skupaj 79 ciljev na 14 straneh. Markerjev na PART1 (p56–94 + p121) NI več
  (139 promoviranih v val 88) — guard to izrecno preveri.

Vhodi (vsi committed):
  ps-n83/register.json                      — vrstice z jk_review v {digit-split, col-split}
  raw-web-val82-2026-10/ps-vlm/p{pg}.json   — pass1 (1. glas)
  raw-web-val83-2026-10/ps-vlm/p{pg}.json   — pass2 (2. glas)
  raw-web-val86-2026-10/vlm-v86/p{pg}-t-kultur{b}-T.json — 3. glas (diagnostika)
  raw-web-val86-2026-10/tiles-manifest-v86.json         — geometrija (x0/x1/y0/y1)

Metoda: INVERZIJA merge_tiles (build-register-v107.py 1:1 v Python, vključno z
merge-row_cut logiko val 86) → page-local index → (band, flat_idx) + geometrija.
Izhod: ps-n83/band-v108/targets-v108.json (COMMITTED — audit trail za branje).
"""
import json, os, re, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v108/targets-v108.json'
BANDS = 4
MARKERS = ('v86-review-pass-digit-split', 'v86-review-col-split')


def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()


def numeq(v):
    s = norm(v)
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return re.sub(r'\D', '', s)


def col_of(ja, kl):
    j, k = bool(numeq(ja)), bool(numeq(kl))
    if j and k: return 'both'
    if j: return 'j'
    if k: return 'k'
    return 'none'


def first_token(v):
    s = norm(v).replace('\n', ' ').lower()
    m = re.match(r'[a-zäöüß]+', s)
    return m.group(0) if m else ''


def resolve_dittos(rows):
    out, prev = [], None
    for r in rows:
        name = (r.get('name') or '').strip()
        row = dict(r)
        row['name_raw'] = name
        if name == '~' or name in (',,', 'de.', 'dito', 'idem'):
            row['name_resolved'] = prev
        else:
            prev = name
            row['name_resolved'] = name
        out.append(row)
    return out


def load_tile_rows(pg):
    """Vrne flat vrstice vseh 4 pasov (band, idx_in_band, row) — fail-fast če kateri manjka."""
    flat = []
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-kultur{b}-T.json'
        assert os.path.exists(f), f'manjka {f}'
        j = json.load(open(f))
        assert 'ERROR' not in j, f'ERROR v {f}'
        for i, r in enumerate(j.get('rows', [])):
            flat.append({'band': b, 'idx': i, 'row': r})
    return flat


def invert_merge(flat):
    """1:1 replika merge_tiles skip logike; vrne merged seznam s back-referenco na flat."""
    merged = []
    for i, fr in enumerate(flat):
        r = fr['row']
        if not r.get('row_cut'):
            merged.append(fr); continue
        nxt = flat[i + 1] if i + 1 < len(flat) else None
        if nxt and nxt['band'] == fr['band'] + 1:
            same = (first_token(r.get('kultur')) == first_token(nxt['row'].get('kultur'))
                    and first_token(r.get('kultur')) != ''
                    and numeq(r.get('jaethe') or r.get('klafter')) == numeq(nxt['row'].get('jaethe') or nxt['row'].get('klafter')))
            if same: continue
        merged.append(fr)
    return merged


def main():
    reg = json.load(open(REG))
    man = json.load(open(f'{TDIR}/tiles-manifest-v86.json'))
    geo = {(t['page'], t['group'], t['band']): t for t in man['tiles']}
    targets, bands_needed = [], {}
    per_page = collections.defaultdict(list)
    part1_hits = []
    for gi, rr in enumerate(reg):
        if rr.get('jk_review') not in MARKERS:
            continue
        if 56 <= rr['page'] <= 94 or rr['page'] == 121:
            part1_hits.append((gi, rr['page']))
            continue
        per_page[rr['page']].append((gi, rr))
    n_total = sum(len(v) for v in per_page.values())
    assert n_total == 79, f'guard: 79 ciljev (najdeno {n_total})'
    assert not part1_hits, f'guard: PART1 markerji naj bi bili promovirani v val 88 ({part1_hits[:3]})'

    for pg, items in sorted(per_page.items()):
        d1 = json.load(open(f'{P1D}/p{pg:03d}.json'))
        d2 = json.load(open(f'{P2D}/p{pg:03d}.json'))
        r1 = resolve_dittos(d1.get('rows', []))
        r2 = resolve_dittos(d2.get('rows', []))
        flat = load_tile_rows(pg)
        merged = invert_merge(flat)
        reg_rows = [r for r in reg if r['page'] == pg]
        note = None
        if not (len(reg_rows) == len(r1) == len(r2) == len(merged)):
            note = {'reg': len(reg_rows), 'p1': len(r1), 'p2': len(r2), 'merged': len(merged)}
        for gi, rr in items:
            i = reg_rows.index(rr)  # page-local row (istece kot builder)
            if i >= len(merged):
                targets.append({'global_idx': gi, 'page': pg, 'page_row': i, 'marker': rr.get('jk_review'), 'mapping': None, 'note': 'idx >= merged'})
                continue
            fr = merged[i]
            b, fidx = fr['band'], fr['idx']
            g = geo[(pg, 'kultur', b)]
            t = fr['row']
            a, bb = r1[i], r2[i]
            targets.append({
                'global_idx': gi, 'page': pg, 'page_row': i, 'marker': rr.get('jk_review'),
                'band': b, 'flat_idx': fidx, 'row_cut': bool(fr['row'].get('row_cut')),
                'p1_jaethe': norm(a.get('jaethe')), 'p1_klafter': norm(a.get('klafter')),
                'p2_jaethe': norm(bb.get('jaethe')), 'p2_klafter': norm(bb.get('klafter')),
                'p1_col': col_of(a.get('jaethe'), a.get('klafter')),
                'p2_col': col_of(bb.get('jaethe'), bb.get('klafter')),
                'tile_jaethe': norm(t.get('jaethe')), 'tile_klafter': norm(t.get('klafter')),
                'tile_kultur': norm(t.get('kultur')).replace('\n', ' '),
                'p1_kultur': norm(a.get('kultur')).replace('\n', ' '),
                'reg_kultur': norm(rr.get('kultur')).replace('\n', ' '),
                'tile_raw_number': numeq(t.get('klafter') or t.get('jaethe')),
                'p1_raw': numeq(a.get('jaethe') or a.get('klafter')),
                'p2_raw': numeq(bb.get('jaethe') or bb.get('klafter')),
                'geo': {'x0': g['x0'], 'x1': g['x1'], 'y0': g['y0'], 'y1': g['y1']},
                'mapping_note': note,
            })
            key = f'{pg:03d}-{b}'
            bands_needed.setdefault(key, {'page': pg, 'band': b, 'geo': {'x0': g['x0'], 'x1': g['x1'], 'y0': g['y0'], 'y1': g['y1']}, 'targets': []})
            bands_needed[key]['targets'].append(gi)
    # poročilo
    ncut = sum(1 for t in targets if t.get('row_cut'))
    pages = sorted(set(t['page'] for t in targets))
    mtally = collections.Counter(t['marker'] for t in targets)
    print(f'CILJI: {len(targets)} (row_cut: {ncut}); strani: {pages}')
    print(f'markerji: {dict(sorted(mtally.items()))}')
    print(f'PASOVI za branje: {len(bands_needed)}')
    notes = [t for t in targets if t.get('mapping_note')]
    if notes:
        print('dolžinska odstopanja (reg/p1/p2/merged) po straneh:')
        for t in notes[:6]: print(' ', t['page'], t['mapping_note'])
    out = {'meta': {'val': 108, 'generated_by': 'build-targets-v108.py',
                    'method': 'inverzija merge_tiles (build-register-v107.py 1:1 v Python); tile glas = DIAGNOSTIKA; resnica = direktno branje izrezkov (instrument val 61/88); obseg: 79 FRESH markerjev (56+14 val 107, 7+2 val 98 — doc 113 §9.2)'},
           'targets': targets, 'bands': [bands_needed[k] for k in sorted(bands_needed)]}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print(f'IZHOD: {OUT}')


if __name__ == '__main__':
    main()
