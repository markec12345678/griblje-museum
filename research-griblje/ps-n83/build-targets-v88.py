#!/usr/bin/env python3
"""Val 88 — REKONSTRUKCIJA 139 digit-split ciljev za ročni re-read (instrument val 61).

Vhodi (vsi committed):
  ps-n83/register.json                      — 139 vrstic z jk_review='v86-review-pass-digit-split'
  raw-web-val82-2026-10/ps-vlm/p{pg}.json   — pass1 (2. glas ni potreben, vrednosti že v register,
                                              ampak pass2 potreben za prikaz nesoglasja)
  raw-web-val83-2026-10/ps-vlm/p{pg}.json   — pass2
  raw-web-val86-2026-10/vlm-v86/p{pg}-t-kultur{b}-T.json — 3. glas (diagnostika, ±1 nestabilna)
  raw-web-val86-2026-10/tiles-manifest-v86.json         — geometrija (x0/x1/y0/y1)

Metoda:
  - INVERZIJA merge_tiles (algoritem build-register-v86.py 1:1 v Python): flat (band, idx) →
    merged index = page-local register row. Skip logika: row_cut + naslednji v naslednjem
    pasu + first_token(kultur) enak + numeq(jk) enak → zgornji del NE izda (nadaljuje se).
  - Vsak cilj dobi: p1/p2/tile vrednosti + (band, flat_idx) + geometrijo pasu.
Izhod: ps-n83/band-v88/targets-v88.json (COMMITTED — audit trail za branje).
"""
import json, os, re, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v88/targets-v88.json'
BANDS = 4


def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()


def numeq(v):
    s = norm(v)
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return re.sub(r'\D', '', s)


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
    for gi, rr in enumerate(reg):
        if rr.get('jk_review') != 'v86-review-pass-digit-split':
            continue
        per_page[rr['page']].append((gi, rr))
    assert sum(len(v) for v in per_page.values()) == 139, 'guard: 139 ciljev'

    for pg, items in sorted(per_page.items()):
        d1 = json.load(open(f'{P1D}/p{pg:03d}.json'))
        d2 = json.load(open(f'{P2D}/p{pg:03d}.json'))
        r1 = resolve_dittos(d1.get('rows', []))
        r2 = resolve_dittos(d2.get('rows', []))
        flat = load_tile_rows(pg)
        merged = invert_merge(flat)
        reg_rows = [r for r in reg if r['page'] == pg]
        # dolžinska kontrola (builder je zip-al po indexu; odstopanja = alignment_short v tally)
        note = None
        if not (len(reg_rows) == len(r1) == len(r2) == len(merged)):
            note = {'reg': len(reg_rows), 'p1': len(r1), 'p2': len(r2), 'merged': len(merged)}
        for gi, rr in items:
            i = reg_rows.index(rr)  # page-local row (isteca kot builder)
            if i >= len(merged):
                targets.append({'global_idx': gi, 'page': pg, 'page_row': i, 'mapping': None, 'note': 'idx >= merged'})
                continue
            fr = merged[i]
            b, fidx = fr['band'], fr['idx']
            g = geo[(pg, 'kultur', b)]
            t = fr['row']
            a, bb = r1[i], r2[i]
            targets.append({
                'global_idx': gi, 'page': pg, 'page_row': i,
                'band': b, 'flat_idx': fidx, 'row_cut': bool(fr['row'].get('row_cut')),
                'p1_jaethe': norm(a.get('jaethe')), 'p1_klafter': norm(a.get('klafter')),
                'p2_jaethe': norm(bb.get('jaethe')), 'p2_klafter': norm(bb.get('klafter')),
                'tile_jaethe': norm(t.get('jaethe')), 'tile_klafter': norm(t.get('klafter')),
                'tile_kultur': norm(t.get('kultur')).replace('\n', ' '),
                'p1_kultur': norm(a.get('kultur')).replace('\n', ' '),
                'tile_raw_number': numeq(t.get('klafter') or t.get('jaethe')),
                'p1_raw': numeq(a.get('jaethe')), 'p2_raw': numeq(bb.get('jaethe')),
                'geo': {'x0': g['x0'], 'x1': g['x1'], 'y0': g['y0'], 'y1': g['y1']},
                'mapping_note': note,
            })
            key = f'{pg:03d}-{b}'
            bands_needed.setdefault(key, {'page': pg, 'band': b, 'geo': {'x0': g['x0'], 'x1': g['x1'], 'y0': g['y0'], 'y1': g['y1']}, 'targets': []})
            bands_needed[key]['targets'].append(gi)
    # poročilo
    unmapped = [t for t in targets if t.get('mapping') is None and t.get('mapping_note') is None and 'band' not in t]
    ncut = sum(1 for t in targets if t.get('row_cut'))
    pages = sorted(set(t['page'] for t in targets))
    print(f'CILJI: {len(targets)} (row_cut: {ncut}); strani: {pages}')
    print(f'PASOVI za branje: {len(bands_needed)}')
    print(f'ne-preslikani: {len(unmapped)}')
    notes = [t for t in targets if t.get('mapping_note')]
    if notes:
        print('dolžinska odstopanja (reg/p1/p2/merged) po straneh:')
        for t in notes[:5]: print(' ', t['page'], t['mapping_note'])
    out = {'meta': {'val': 88, 'generated_by': 'build-targets-v88.py',
                    'method': 'inverzija merge_tiles (build-register-v86.py 1:1 v Python); tile glas = DIAGNOSTIKA (±1 nestabilna, val 86); resnica = direktno branje izrezkov (instrument val 61)'},
           'targets': targets, 'bands': [bands_needed[k] for k in sorted(bands_needed)]}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print(f'IZHOD: {OUT}')


if __name__ == '__main__':
    main()
