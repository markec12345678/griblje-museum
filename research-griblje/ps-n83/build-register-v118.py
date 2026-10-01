#!/usr/bin/env python3
"""Val 118 — VGRADNJA imenskega passa PS p17–p19 (pilot za p20–p55 = val 119).

Vhodi: band-v113/reading-v118/pNN.json (agentov vid, 0 VLM) + ps-n83/register.json
Pravila (1:1 val 112 imenski vzorec):
  - names_audit: POPRAVEK v verdictu -> owner_original / haus_no posodobitev;
    fail-fast: stara vrednost v registerju MORA sovpadati z old_name/old_haus
    iz readinga (zaščita pred zamikom indeksov)
  - reading_pass := 'v118-names' na vseh pokritih vrsticah (p17–p19 = 60)
  - page_observations_v118 na prvi vrstici vsake strani
  - anmerkung add-only za trajne dvome/PUA preseke
  - snimke owner_original_pre_v118 / haus_no_pre_v118
  - fail-fast: guard 2875 vrstic + 139 v88 + 1755 v86-colonial-tiles +
    667 v114-ps-reread + changes guard
Izhod: register.json + band-v113/register-v118-changes.json (popoln audit)
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v118'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v118-changes.json'

PAGES = {17: 'p17.json', 18: 'p18.json', 19: 'p19.json'}

# ditto-zastavice, ki jih črnilo ovrže (pisar piše ime izrecno, ne d°/„):
# p17 r3/r5 + p18 r1-r5 — vse nosijo polno ime v imenski celici (zoomi x12-x16)
DITTO_CLEAR = [(17, 3), (17, 5), (18, 1), (18, 2), (18, 3), (18, 4), (18, 5)]

# trajni anmerkung add-only (page, row) -> tekst
ANM = {
    (17, 15): '[ime potrjeno s PUA h.44 "Husitsch Maria Bauersleute zu Grübln" — val 118]',
    (17, 19): '[ime potrjeno s PUA h.44 "Husitsch Maria Bauersleute zu Grübln" — val 118]',
    (18, 9): '[ne-osebni zapis "Hof-Besizungen[?]" = dominikalni posest; v57 "Hoffnung" zgrešeno — val 118]',
    (19, 1): '[v57 "Piberl" = ista črkovna oblika kot "Piber" p17/p18 — enotno Piber — val 118]',
    (19, 5): '[Matho[?] po PUA (samostojen priimek) — ločeno od Malfg po g-spuščanju — val 118]',
    (19, 10): '[haus 41: dvom 4/6; v57 61 — val 118]',
}


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2875, f'guard: register 2875 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1795, f'guard: 1795 v86-colonial-tiles (najdeno {n_v86})'
    n_v114 = sum(1 for r in reg if r.get('reading_pass') == 'v114-ps-reread')
    assert n_v114 == 667, f'guard: 667 v114-ps-reread (najdeno {n_v114})'
    n_ins = sum(1 for r in reg if r.get('reading_pass') == 'v115-insert')
    assert n_ins == 4, f'guard: 4 v115-insert (najdeno {n_ins})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v118-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'owner_fixes': 0, 'haus_fixes': 0, 'anmerkung_adds': 0, 'ditto_clears': 0,
             'pages_covered': [], 'rows_covered': 0}

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
        if f'{field}_pre_v118' not in r:
            r[f'{field}_pre_v118'] = old
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        if 'anmerkung_pre_v118' not in r:
            r['anmerkung_pre_v118'] = old
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

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
            verdict = str(e['verdict'])
            # ime
            if 'ime POPRAVEK' in verdict or verdict.startswith('ime POPRAVEK'):
                new_name = e['seen_name']
                old_name = e['old_name']
                cur = (r.get('owner_original') or '')
                assert cur == old_name, \
                    f'p{pg} r{i}: register owner {cur!r} != reading old_name {old_name!r}'
                if set_field(idx, r, 'owner_original', new_name, 'v118_owner_fix', verdict):
                    stats['owner_fixes'] += 1
                    n_fix_page += 1
            elif 'ime SOGLASJE' in verdict:
                cur = (r.get('owner_original') or '')
                assert cur == e['old_name'], \
                    f'p{pg} r{i}: soglasje, a register owner {cur!r} != old {e["old_name"]!r}'
            # haus
            if 'haus POPRAVEK' in verdict:
                new_h = e['seen_haus']
                old_h = e['old_haus']
                cur = (r.get('haus_no') or '')
                assert cur == old_h, \
                    f'p{pg} r{i}: register haus {cur!r} != reading old_haus {old_h!r}'
                if set_field(idx, r, 'haus_no', new_h, 'v118_haus_fix', verdict):
                    stats['haus_fixes'] += 1
                    n_fix_page += 1
            if (pg, i) in ANM:
                add_anm(idx, r, ANM[(pg, i)])
            if (pg, i) in DITTO_CLEAR:
                assert r.get('owner_was_ditto') is True, \
                    f'p{pg} r{i}: pričakovana ditto-zastavica (vrstica ni bila True)'
                if set_field(idx, r, 'owner_was_ditto', False, 'v118_ditto_clear',
                             'črnilo piše ime izrecno — v57 ditto-zastavica ovržena'):
                    stats['ditto_clears'] += 1
            r['reading_pass'] = 'v118-names'
            stats['rows_covered'] += 1
        # page observations
        obs = rd.get('register_actions_planned') or []
        first = rows[0][1]
        note = f'v118 imenski pass p{pg}: {stats["owner_fixes"] if pg == 19 else n_fix_page} sprememb; ' + \
               (rd['meta'].get('note', '')[:400])
        first['page_observations_v118'] = note
        changes.append({'page': pg, 'type': 'page_observations_v118', 'text': note})
        stats['pages_covered'].append(f'p{pg}')

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': 118, 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 118 VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v118-names')
    print('  reading_pass v118-names:', n_rp)


if __name__ == '__main__':
    main()
