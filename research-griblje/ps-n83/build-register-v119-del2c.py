#!/usr/bin/env python3
"""Val 119 (del 2c) — VGRADNJA imenskega passa PS p38–p43 (del 2a = p26–p31, del 2b = p32–p37).

Vhodi: band-v113/reading-v119/p{38..43}.json (agentov vid, 0 VLM) + ps-n83/register.json
Pravila (1:1 val 118/119 imenski vzorec):
  - names_audit: 'ime POPRAVEK' -> owner_original; 'haus POPRAVEK' -> haus_no;
    fail-fast: stara vrednost v registerju MORA sovpadati z old_name/old_haus
  - 'razhajanje odprto' -> anmerkung add-only (črnilo zabeleženo, v57 ohranjeno)
  - reading_pass := 'v119-names' na vseh pokritih vrsticah (p38–p43 = 123;
    skupaj v119-names = 362 + 123 = 485)
  - DITTO_CLEAR: p40 r1 (črnilo piše polno ime 'Ring Michl.')
  - CROSS-VAL: p37 r6 haus 20->25 (del 2b jebral '20'; gz dy12 + p39-r5/r6 ista
    črnilovrstna sekvenca bereta '25.'/'25'' — glyf z zastavico, NI 0-ovala)
  - snimke owner_original_pre_v119 / haus_no_pre_v119 / anmerkung_pre_v119
  - fail-fast: guard 2875 vrstic + 139 v88 + 1795 v86 + 366 v114 + 3 v115 +
    60 v118-names + 362 v119-names (del 1+2a+2b) + prepoved dvojnega teka
Izhod: register.json + band-v113/register-v119-del2c-changes.json (popoln audit)
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v119'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v119-del2c-changes.json'

PAGES = {pg: f'p{pg}.json' for pg in range(38, 44)}

# ditto-zastavica, ki jo črnilo ovrže (pisar piše polno ime, ne d°/„):
# p40: r1 (Ring Michl.)
DITTO_CLEAR = [(40, 1)]

# cross-val popravek izven obsega branja (medstranski presek p39 + gz p37 dy12):
# p37 r6: del-2b haus 20 -> 25 (glyf z zastavico '25.', NI 0-ovala; p39-r5/r6 = '25''/'25.')
CROSSVAL_HAUS = [(37, 6, '20', '25')]


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2875, f'guard: register 2875 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1795, f'guard: 1795 v86-colonial-tiles (najdeno {n_v86})'
    n_v114 = sum(1 for r in reg if r.get('reading_pass') == 'v114-ps-reread')
    n_v113 = sum(1 for r in reg if r.get('reading_pass') == 'v113-ps-reread')
    n_v115 = sum(1 for r in reg if r.get('reading_pass') == 'v115-insert')
    n_v118 = sum(1 for r in reg if r.get('reading_pass') == 'v118-names')
    n_v119 = sum(1 for r in reg if r.get('reading_pass') == 'v119-names')
    assert n_v114 == 366, f'guard: 366 v114-ps-reread po del 2b (najdeno {n_v114})'
    assert n_v115 == 3, f'guard: 3 v115-insert (najdeno {n_v115})'
    assert n_v118 == 60, f'guard: 60 v118-names (najdeno {n_v118})'
    assert n_v119 == 362, f'guard: 362 v119-names iz dela 1+2a+2b (najdeno {n_v119})'
    n_ditto = sum(1 for r in reg if r.get('owner_was_ditto'))
    assert n_ditto == 208, f'guard: 208 ditto-zastavic (najdeno {n_ditto})'
    print(f'  guard plasti pred: v113={n_v113} v114={n_v114} v115={n_v115} '
          f'v118={n_v118} v119={n_v119} ditto={n_ditto}')
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v119-del2c-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'owner_fixes': 0, 'haus_fixes': 0, 'anmerkung_adds': 0, 'ditto_clears': 0,
             'open_discrepancies': 0, 'crossval_fixes': 0, 'pages_covered': [],
             'rows_covered': 0}

    def row_no(page, idx):
        return next(i for i, (j, _) in enumerate(by_page[page]) if j == idx)

    def set_field(idx, r, field, new, kind, note=''):
        old = r.get(field, '')
        if old == new:
            return False
        rec = {'index': idx, 'page': r['page'], 'row_in_page': row_no(r['page'], idx),
               'type': kind, 'field': field, 'old': old, 'new': new}
        if note:
            rec['note'] = note
        snap = f'{field}_pre_v119'
        if snap not in r:
            r[snap] = old
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        snap = 'anmerkung_pre_v119'
        if snap not in r:
            r[snap] = old
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

    # --- cross-val: p37 r6 haus 20 -> 25 ---
    for pg, rn, was, now in CROSSVAL_HAUS:
        idx, r = by_page[pg][rn]
        cur = str(r.get('haus_no') or '')
        assert cur == was, f'crossval p{pg} r{rn}: register haus {cur!r} != pričakovano {was!r}'
        assert f(r := r) is not None
        if set_field(idx, r, 'haus_no', now, 'v119_crossval_haus_fix',
                     'medstranski presek: p39-r5/r6 ista črnilovrstna sekvenca bere '
                     "'25.'/'25'' (glyf z zastavico, NI 0-ovala); gz p37-r6 dy12 '25.' jasno — "
                     'del-2b branje 20 je zgrešilo 5-glyfo'):
            stats['crossval_fixes'] += 1

    for pg, fname in PAGES.items():
        rd = json.load(open(f'{READDIR}/{fname}'))
        assert rd['meta']['page'] == pg, f'{fname}: napačna stran'
        assert rd['meta']['vlm_calls'] == 0, f'{fname}: vlm_calls != 0'
        rows = by_page.get(pg, [])
        na = rd['names_audit']
        assert len(rows) == rd['meta']['register_rows'], \
            f'p{pg}: register {len(rows)} vrstic, reading pravi {rd["meta"]["register_rows"]}'
        n_fix_page = 0
        for i, (idx, r) in enumerate(rows):
            e = na.get(f'r{i}')
            assert e, f'p{pg} r{i}: manjka names_audit vnos'
            for k in ('seen_haus', 'seen_name', 'old_haus', 'old_name', 'verdict'):
                assert k in e, f'p{pg} r{i}: manjka polje {k}'
            verdict = str(e['verdict'])
            if 'ime POPRAVEK' in verdict:
                new_name = e['seen_name']
                old_name = e['old_name']
                cur = (r.get('owner_original') or '')
                assert cur == old_name, \
                    f'p{pg} r{i}: register owner {cur!r} != reading old_name {old_name!r}'
                if set_field(idx, r, 'owner_original', new_name, 'v119_owner_fix', verdict):
                    stats['owner_fixes'] += 1
                    n_fix_page += 1
            if 'haus POPRAVEK' in verdict:
                new_h = e['seen_haus']
                old_h = e['old_haus']
                cur = str(r.get('haus_no') or '')
                assert cur == str(old_h), \
                    f'p{pg} r{i}: register haus {cur!r} != reading old_haus {old_h!r}'
                assert '[' not in str(new_h), f'p{pg} r{i}: haus POPRAVEK z dvomom {new_h!r}'
                if set_field(idx, r, 'haus_no', new_h, 'v119_haus_fix', verdict):
                    stats['haus_fixes'] += 1
                    n_fix_page += 1
            if 'razhajanje odprto' in verdict:
                stats['open_discrepancies'] += 1
                seen = e['seen_name']
                add_anm(idx, r, f'[v119 imenski pass: razhajanje odprto — črnilo ~"{seen}", v57 ohranjeno]')
            if (pg, i) in DITTO_CLEAR:
                assert r.get('owner_was_ditto') is True, \
                    f'p{pg} r{i}: pričakovana ditto-zastavica (vrstica ni bila True)'
                if set_field(idx, r, 'owner_was_ditto', False, 'v119_ditto_clear',
                             'črnilo piše polno ime — v57 ditto-zastavica ovržena'):
                    stats['ditto_clears'] += 1
                    n_fix_page += 1
            r['reading_pass'] = 'v119-names'
            stats['rows_covered'] += 1
        first = rows[0][1]
        note = f'v119 imenski pass (del 2c) p{pg}: {n_fix_page} sprememb; ' + \
               (rd['meta'].get('note', '')[:400])
        first['page_observations_v119'] = note
        changes.append({'page': pg, 'type': 'page_observations_v119', 'text': note})
        stats['pages_covered'].append(f'p{pg}')

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': '119-del2c', 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 119 (del 2c: p38–p43) VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v119-names')
    n_ditto2 = sum(1 for r in reg if r.get('owner_was_ditto'))
    print('  reading_pass v119-names skupaj:', n_rp, '| ditto flags:', n_ditto2)


def f(x):
    return x


if __name__ == '__main__':
    main()
