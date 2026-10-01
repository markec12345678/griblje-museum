#!/usr/bin/env python3
"""Val 119 (del 2a) — VGRADNJA imenskega passa PS p26–p31 (del 1 = p20–p25).

Vhodi: band-v113/reading-v119/p{26..31}.json (agentov vid, 0 VLM) + ps-n83/register.json
Pravila (1:1 val 118/119-del1 imenski vzorec):
  - names_audit: 'ime POPRAVEK' -> owner_original posodobitev; 'haus POPRAVEK' ->
    haus_no posodobitev; fail-fast: stara vrednost v registerju MORA sovpadati z
    old_name/old_haus iz readinga
  - 'razhajanje odprto' -> anmerkung add-only (črnilo zabeleženo, v57 ohranjeno)
  - reading_pass := 'v119-names' na vseh pokritih vrsticah (p26–p31 = 120; skupaj v119-names = 240)
  - DITTO_CLEAR: p31 r2/r3/r5/r7/r9/r11/r13 (črnilo piše polna imena; r3 = fantomska
    v57 ditto — vrstica je dejansko '23 Ring Mathä')
  - CROSS-VAL FIX p23-r4: 'Krause Gorgy' -> 'Strauß Gorgy' (val 119 del 1 je črnilo
    p23-r4 prebral kot 'Krause'; x16 primerjava s p28-r9 pokaže identično
    'Strauffs' črnilo s t-prečko = Strauß; h15 = Strauß hiša)
  - snimke owner_original_pre_v119 / haus_no_pre_v119 / anmerkung_pre_v119
    (p23-r4: owner_original_pre_v119d2 — pre_v119 že obstaja iz dela 1)
  - fail-fast: guard 2875 vrstic + 139 v88 + 1795 v86 + 667 v114 + 4 v115 +
    60 v118-names + 120 v119-names (del 1) + prepoved dvojnega teka
Izhod: register.json + band-v113/register-v119-del2-changes.json (popoln audit)
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v119'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v119-del2-changes.json'

PAGES = {pg: f'p{pg}.json' for pg in range(26, 32)}

# ditto-zastavice, ki jih črnilo ovrže (pisar piše polno ime, ne d°/„):
# p31: r2 (Puchey), r3 (fantomska — vrstica = Ring Mathä), r5 (Müller), r7 (Ring Michael),
# r9 (Ring Mito), r11 (Schelle), r13 (Hoch)
DITTO_CLEAR = [(31, 2), (31, 3), (31, 5), (31, 7), (31, 9), (31, 11), (31, 13)]


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
    assert n_v114 == 607, f'guard: 607 v114-ps-reread (najdeno {n_v114})'
    assert n_v115 == 4, f'guard: 4 v115-insert (najdeno {n_v115})'
    assert n_v118 == 60, f'guard: 60 v118-names (najdeno {n_v118})'
    assert n_v119 == 120, f'guard: 120 v119-names iz dela 1 (najdeno {n_v119})'
    print(f'  guard plasti pred: v113={n_v113} v114={n_v114} v115={n_v115} v118={n_v118} v119={n_v119}')
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v119-del2-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'owner_fixes': 0, 'haus_fixes': 0, 'anmerkung_adds': 0, 'ditto_clears': 0,
             'open_discrepancies': 0, 'cross_val_fixes': 0, 'pages_covered': [],
             'rows_covered': 0}

    def row_no(page, idx):
        return next(i for i, (j, _) in enumerate(by_page[page]) if j == idx)

    def set_field(idx, r, field, new, kind, note='', snap_suffix=''):
        old = r.get(field, '')
        if old == new:
            return False
        rec = {'index': idx, 'page': r['page'], 'row_in_page': row_no(r['page'], idx),
               'type': kind, 'field': field, 'old': old, 'new': new}
        if note:
            rec['note'] = note
        snap = f'{field}_pre_v119{snap_suffix}'
        if snap not in r:
            r[snap] = old
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt, snap_suffix=''):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        snap = f'anmerkung_pre_v119{snap_suffix}'
        if snap not in r:
            r[snap] = old
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

    # ---- CROSS-VAL FIX: p23 r4 (Krause Gorgy -> Strauß Gorgy, h15) ----
    rows23 = by_page.get(23, [])
    idx23, r23 = rows23[4]
    assert str(r23.get('haus_no')) == '15', f'p23 r4: haus {r23.get("haus_no")} != 15'
    assert (r23.get('owner_original') or '') == 'Krause Gorgy', \
        f'p23 r4: owner {r23.get("owner_original")!r} != "Krause Gorgy"'
    note23 = ('val 119 del 2 cross-val fix: x16 primerjava črnila p23-r4 s p28-r9 '
              '(isti h15) pokaže identičen niz "Strauffs" s t-prečko = Strauß; '
              'val 119 del 1 jebral "Krause" (brez t-prečke = h45 Krause na p23-r14, '
              'ki ostaja); h15 = Strauß hiša (p23-r4 + p28-r9)')
    if set_field(idx23, r23, 'owner_original', 'Strauß Gorgy', 'v119d2_owner_cross_val_fix',
                 note23, snap_suffix='d2'):
        stats['cross_val_fixes'] += 1
    add_anm(idx23, r23, '[v119 del 2: popravek lastnika — črnilo = Strauß (x16 p23-r4≡p28-r9, isti h15); "Krause" ostaja za h45 p23-r14/r18]', snap_suffix='d2')

    # ---- glavna vgradnja p26–p31 ----
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
        note = f'v119 imenski pass (del 2) p{pg}: {n_fix_page} sprememb; ' + \
               (rd['meta'].get('note', '')[:400])
        first['page_observations_v119'] = note
        changes.append({'page': pg, 'type': 'page_observations_v119', 'text': note})
        stats['pages_covered'].append(f'p{pg}')

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': '119-del2', 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 119 (del 2a: p26–p31 + cross-val p23-r4) VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v119-names')
    print('  reading_pass v119-names skupaj:', n_rp)


if __name__ == '__main__':
    main()
