#!/usr/bin/env python3
"""Val 116 — P142 ZAKLJUČEK 2. PREHODA (kolonski tile-i, 3. glas) — pravila 1:1 val 86.

Kontekst: p142 je od vala 86 ostala v82-native-pass1, ker je tile p142-t-kultur2 brez
VLM odgovora (429 kvota; fail-fast pravilo nivoja strani: stran z manjkajočim pasom
NI kvalificirana za arbitražo). Val 116 je tile prebral (regen-missing-crop-v99.mts +
tile-read-v98.mts) — vseh 8 pasov (4 name + 4 kultur) zdaj obstaja → stran se
kvalificira in 2. prehod se zaključi po ISTIH pravilih kot p56–p141 (val 86/98/107).

Pravila (kopirana 1:1 iz build-register-v86.py — NIČ nove logike):
  - jaethe↔klafter = STRUKTURNA dodelitev na nivoju STRANI (only_j < 10 %, F-PV-05);
    per-row tile vrednosti = diagnostika (±1 nestabilna), NIKOLI vir vrednosti
  - števke: p1/p2 2-soglasje; razlika tile → digit_mismatch flag (vrednost 2-glasna)
  - kultur: NIKOLI prepis iz 1. glasu → variant field kultur_tile_v86 / owner_tile_v86
  - reading_pass 'v86-colonial-tiles' spremlja prehod, ne resnice
  - snimke jaethe_pass1_v82/klafter_pass1_v82 (hišni stil val 86)
Fail-fast: guard 2875 (val 115 stanje), p142 že-v86 prepovedan, n_v86 == pokritost.
Izhodi: register.json + band-v86/register-v116-p142-changes.json (poln audit).
"""
import json
import os
import re
import collections
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1D = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2D = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v86'
PAGES = [142]  # val 116: SAMO p142 (p56–141 že v86; p143 nespremenjena)
BANDS = 4


def norm(v):
    if v is None:
        return ''
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


def merge_tiles(pg, group):
    # Varovalo 1:1 val 86: stran uporabna SAMO z vsemi BANDS pasovi
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        if not os.path.exists(f):
            return []
        j = json.load(open(f))
        if 'ERROR' in j:
            return []
    rows = []
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        j = json.load(open(f))
        for r in j.get('rows', []):
            row = dict(r)
            row['band'] = b
            rows.append(row)
    merged = []
    for i, r in enumerate(rows):
        if not r.get('row_cut'):
            merged.append(r)
            continue
        nxt = rows[i + 1] if i + 1 < len(rows) else None
        if nxt and nxt['band'] == r['band'] + 1:
            if group == 'kultur':
                same = (first_token(r.get('kultur')) == first_token(nxt.get('kultur'))
                        and first_token(r.get('kultur')) != ''
                        and numeq(r.get('jaethe') or r.get('klafter')) == numeq(nxt.get('jaethe') or nxt.get('klafter')))
            else:
                same = (norm(r.get('name_raw')) == norm(nxt.get('name_raw'))
                        or (norm(r.get('haus_no')) and norm(r.get('haus_no')) == norm(nxt.get('haus_no'))))
            if same:
                continue
        merged.append(r)
    return merged


def col_of(ja, kl):
    j, k = bool(numeq(ja)), bool(numeq(kl))
    if j and k:
        return 'both'
    if j:
        return 'j'
    if k:
        return 'k'
    return 'none'


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2875, f'guard: register 2875 (val 115; najdeno {len(reg)})'
    n_before = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_before == 1755, f'guard: 1755 v86 vrstic pred valom 116 (najdeno {n_before})'
    for r in reg:
        if r['page'] == 142 and r.get('reading_pass') == 'v86-colonial-tiles':
            sys.exit('FATAL: p142 že v86 (fail-fast, dvojni tek prepovedan)')

    changes = []
    tally = collections.Counter()
    digit_mismatch = 0
    page_jk_all = {}
    for pg in PAGES:
        d1 = json.load(open(f'{P1D}/p{pg:03d}.json'))
        d2 = json.load(open(f'{P2D}/p{pg:03d}.json'))
        r1 = resolve_dittos(d1.get('rows', []))
        r2 = resolve_dittos(d2.get('rows', []))
        tk = merge_tiles(pg, 'kultur')
        tnames = resolve_dittos(merge_tiles(pg, 'name'))
        reg_rows = [r for r in reg if r['page'] == pg]
        nmin = min(len(reg_rows), len(r1), len(r2), len(tk))
        if not tk:
            tally['page_no_tiles'] += len(reg_rows)
            continue
        nj = sum(1 for x in tk if numeq(x.get('jaethe')) and not numeq(x.get('klafter')))
        nk = sum(1 for x in tk if numeq(x.get('klafter')))
        nb = sum(1 for x in tk if numeq(x.get('jaethe')) and numeq(x.get('klafter')))
        only_j_pct = nj / max(1, nj + nk) * 100
        page_qualifies = only_j_pct < 10.0 and (nk + nb) > 0
        page_jk_all[str(pg)] = {'only_j': nj, 'klafter_vkljeno_both': nk, 'both': nb,
                                'only_j_pct': round(only_j_pct, 1), 'qualifies': page_qualifies,
                                'tile_rows': len(tk)}
        for i in range(len(reg_rows)):
            rr = reg_rows[i]
            rr['reading_pass'] = 'v86-colonial-tiles'
            if i >= nmin:
                tally['tile_missing' if i >= len(tk) else 'alignment_short'] += 1
                continue
            a, b, t = r1[i], r2[i], tk[i]
            ca, cb = col_of(a.get('jaethe'), a.get('klafter')), col_of(b.get('jaethe'), b.get('klafter'))
            old_j, old_k = rr.get('jaethe') or '', rr.get('klafter') or ''
            rule = None
            if page_qualifies:
                if ca == 'j' and cb == 'j':
                    if numeq(a.get('jaethe')) == numeq(b.get('jaethe')) and numeq(a.get('jaethe')):
                        new_j, new_k, rule = '', a.get('jaethe') or '', 'v86-tiles-jk'
                        if numeq(t.get('klafter') or t.get('jaethe')) and numeq(t.get('klafter') or t.get('jaethe')) != numeq(a.get('jaethe')):
                            digit_mismatch += 1
                            changes.append({'page': pg, 'row': i, 'type': 'digit_mismatch', 'field': 'klafter',
                                            'p1': norm(a.get('jaethe')), 'p2': norm(b.get('jaethe')), 'tile': norm(t.get('klafter') or t.get('jaethe'))})
                    else:
                        rule = 'v86-review-pass-digit-split'
                elif ca == 'j' and cb == 'both' and numeq(a.get('jaethe')) == numeq(b.get('klafter')) and numeq(b.get('jaethe')):
                    new_j, new_k, rule = b.get('jaethe') or '', b.get('klafter') or '', 'v86-pass2-split'
                elif cb == 'j' and ca == 'both' and numeq(b.get('jaethe')) == numeq(a.get('klafter')) and numeq(a.get('jaethe')):
                    new_j, new_k, rule = a.get('jaethe') or '', a.get('klafter') or '', 'v86-pass1-split'
                elif ca == 'both' or cb == 'both':
                    rule = 'v86-explicit-jk-kept'
                elif ca == 'none' and cb == 'none':
                    rule = 'v86-no-value'
                elif ca != cb:
                    kside = b if cb == 'k' else a
                    if numeq(kside.get('klafter')):
                        new_j, new_k, rule = '', kside.get('klafter') or '', 'v86-tiles-arbitrated'
                    else:
                        rule = 'v86-review-col-split'
                else:
                    rule = f'v86-kept-{ca}-{cb}'
            else:
                rule = 'v86-page-not-qualified'
            if rule in ('v86-review-pass-digit-split', 'v86-review-col-split', 'v86-explicit-jk-kept', 'v86-pass2-split', 'v86-pass1-split'):
                rr['jk_review'] = rule
            if rule in ('v86-tiles-jk', 'v86-tiles-arbitrated', 'v86-pass2-split', 'v86-pass1-split'):
                if 'jaethe_pass1_v82' not in rr:
                    rr['jaethe_pass1_v82'] = old_j
                    rr['klafter_pass1_v82'] = old_k
                rr['jaethe'], rr['klafter'] = new_j, new_k
                rr['jk_review'] = rule
                changes.append({'page': pg, 'row': i, 'type': 'jk_correction', 'rule': rule,
                                'old': {'jaethe': old_j, 'klafter': old_k}, 'new': {'jaethe': new_j, 'new_klafter': new_k},
                                'voices': {'p1': [norm(a.get('jaethe')), norm(a.get('klafter'))], 'p2': [norm(b.get('jaethe')), norm(b.get('klafter'))], 'tile': [norm(t.get('jaethe')), norm(t.get('klafter'))]}})
            tally[rule] += 1
            tk_k = norm(t.get('kultur') or '')
            p1_k = norm(a.get('kultur') or '')
            if tk_k and tk_k.replace('\n', ' ') != p1_k.replace('\n', ' '):
                rr['kultur_tile_v86'] = t.get('kultur') or ''
                tally['kultur_variant'] += 1
            if i < len(tnames):
                tn = tnames[i]
                tname = norm(tn.get('name_resolved') or tn.get('name_raw') or '')
                p1name = norm(a.get('name_resolved') or a.get('owner_original') or '')
                if tname and tname != '~' and tname != p1name:
                    rr['owner_tile_v86'] = tn.get('name_resolved') or tn.get('name_raw') or ''
                    tally['owner_variant'] += 1

    # ---------- končni guardi ----------
    for r in reg:
        if r['page'] < 56:
            assert r.get('reading_pass', '') != 'v86-colonial-tiles', 'guard: p<56 počisto'
        if r['page'] == 143:
            assert r.get('reading_pass', '') != 'v86-colonial-tiles', 'guard: p143 počisto'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    cov = set()
    for pg in PAGES:
        if all(os.path.exists(f'{TDIR}/vlm-v86/p{pg:03d}-t-kultur{b}-T.json') for b in range(BANDS)):
            cov.add(pg)
    exp = sum(1 for r in reg if r['page'] in cov)
    assert n_v86 == 1755 + exp, f'guard: v86 vrstic {n_v86} != 1755 + pokritost p142 {exp}'
    assert len(reg) == 2875, 'guard: 2875 po vgradnji'

    os.makedirs(OUTD, exist_ok=True)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    json.dump({'meta': {'val': 116, 'generated_by': 'build-register-v116-p142.py',
                        'note': 'p142 zaključek 2. prehoda — tile p142-t-kultur2 prebran ob kvoti; pravila 1:1 val 86',
                        'digit_mismatch': digit_mismatch},
               'tally': dict(sorted(tally.items())), 'page_jk': page_jk_all, 'changes': changes},
              open(f'{OUTD}/register-v116-p142-changes.json', 'w'), ensure_ascii=False, indent=1)
    print(f'VAL 116 p142 VGRADNJA OK: v86 vrstic {n_v86} (1755 + {exp})')
    print('  tally:', dict(sorted(tally.items())))
    print('  page_jk:', json.dumps(page_jk_all, ensure_ascii=False))
    print(f'  changes: {len(changes)}; digit_mismatch: {digit_mismatch}')


if __name__ == '__main__':
    main()
