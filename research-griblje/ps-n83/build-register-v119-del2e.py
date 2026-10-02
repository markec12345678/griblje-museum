#!/usr/bin/env python3
"""Val 119 (del 2e) — VGRADNJA celovitega re-reada PS p50–p55 (dvojni sidr).

OPSEG (protokol 141): p50–p55 = 122 vrstic — ime + haus + VREDNOSTNA PLAST
(jaethe/klafter/ertrag/capital) + anmerkung; reading_pass := 'v119-names' na
vseh; v114 plast 122 -> 0.

Metoda (protokol 140 §6): DVOJNI SIDR — parzelle-stevilka (941-1060) +
vrednostni pas; izrezki kan3e/valseg/zz/zzv (0 VLM). Struktura:
  p50: 941-960 + Fürtrag (r20, jae 4|kl 386)
  p51: 961-980 + Übertrag (kl 1263) + Fürtrag 5|547 (preklican)
  p52: 981-1000 + Fürtrag 6|1217
  p53: 1001-1020 + Fürtrag 9|1027 (preklican)
  p54: 1021-1040 + Fürtrag (r20; 8|1165 prečrtan + rdeče 7|943)
       NOVO F-NA-03: register rep r14-r19 zamaknjen +1 (dup 145, fantoma
       716/425), r20 nosi P1040 (283|1263) — polni rebuild
  p55: 1041-1060 + Fürtrag 7|1067 (prečrtan)

Pravila:
  - 'ime POPRAVEK'/'ime NOVO' -> owner_original := seen_name
  - 'haus POPRAVEK'/'haus NOVO' -> haus_no := seen_haus
  - 'razhajanje' v verdiktu -> anmerkung add-only (v114 ohranjeno)
  - '[?]' v imenu -> anmerkung (dvom izrecen)
  - 'preklicana' -> anmerkung (rdeč prečrt)
  - vrednosti: seen_* -> polja; old_* brez seen-parega -> pociscena
    (snimka *_pre_v119, add-only); dvojni tek prepovedan
  - vrednostni asserti po vseh 122 vrsticah
Izhod: register.json + band-v113/register-v119-del2e-changes.json
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v119e'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v119-del2e-changes.json'

PAGES = {50: 21, 51: 20, 52: 20, 53: 20, 54: 21, 55: 20}
FIELDS = ('jaethe', 'klafter', 'ertrag_fl', 'ertrag_kr',
          'capital_fl', 'capital_kr', 'classe')
SEEN2FIELD = {'seen_jae': 'jaethe', 'seen_kl': 'klafter',
              'seen_capital_fl': 'capital_fl', 'seen_capital_kr': 'capital_kr',
              'seen_classe': 'classe'}


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2875, f'guard: register 2875 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1795, f'guard: 1795 v86 (najdeno {n_v86})'
    layers = {}
    for p in ('v113-ps-reread', 'v114-ps-reread', 'v115-insert', 'v118-names', 'v119-names'):
        layers[p] = sum(1 for r in reg if r.get('reading_pass') == p)
    assert layers['v114-ps-reread'] == 122, f"guard: 122 v114 (najdeno {layers['v114-ps-reread']})"
    assert layers['v115-insert'] == 0, f"guard: 0 v115 (najdeno {layers['v115-insert']})"
    assert layers['v118-names'] == 60, f"guard: 60 v118 (najdeno {layers['v118-names']})"
    assert layers['v119-names'] == 609, f"guard: 609 v119-names (najdeno {layers['v119-names']})"
    n_ditto = sum(1 for r in reg if r.get('owner_was_ditto'))
    assert n_ditto == 207, f'guard: 207 ditto (najdeno {n_ditto})'
    print(f"  guard plasti pred: v113={layers['v113-ps-reread']} v114={layers['v114-ps-reread']} "
          f"v115={layers['v115-insert']} v118={layers['v118-names']} v119={layers['v119-names']} ditto={n_ditto}")
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v119-del2e-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'owner_changes': 0, 'haus_changes': 0, 'value_changes': 0,
             'anmerkung_adds': 0, 'razhajanja': 0,
             'pages_covered': [], 'rows_covered': 0}

    def row_no(page, idx):
        return next(i for i, (j, _) in enumerate(by_page[page]) if j == idx)

    def set_field(idx, r, field, new, kind, note=''):
        old = r.get(field, '')
        if str(old) == str(new):
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
        if field in ('jaethe', 'klafter', 'ertrag_fl', 'ertrag_kr',
                     'capital_fl', 'capital_kr', 'classe'):
            stats['value_changes'] += 1
        elif field == 'owner_original':
            stats['owner_changes'] += 1
        elif field == 'haus_no':
            stats['haus_changes'] += 1
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

    def split_ertrag(s):
        s = str(s)
        if s.startswith('—') or s.startswith('-'):
            return '', s.lstrip('—-').strip()
        if '-' in s:
            a, b = s.split('-', 1)
            return a.strip(), b.strip()
        return s.strip(), ''

    for pg, n_rows in sorted(PAGES.items()):
        rows = by_page[pg]
        assert len(rows) == n_rows, f'p{pg}: {len(rows)} vrstic != {n_rows}'
        rd = json.load(open(f'{READDIR}/p{pg}.json'))
        assert rd['meta']['vlm_calls'] == 0
        na, va = rd['names_audit'], rd['values_audit']
        for i, (idx, r) in enumerate(rows):
            na_r, va_r = na[f'r{i}'], va[f'r{i}']
            verdict = str(na_r.get('verdict', ''))
            cur_owner = r.get('owner_original') or ''
            cur_haus = str(r.get('haus_no') or '')
            # --- imenska plast -------------------------------------------
            if 'ime POPRAVEK' in verdict or 'ime NOVO' in verdict:
                seen_name = str(na_r.get('seen_name') or '')
                if seen_name and seen_name != cur_owner:
                    set_field(idx, r, 'owner_original', seen_name, 'v119_owner_fix', verdict)
            if 'haus POPRAVEK' in verdict or 'haus NOVO' in verdict:
                seen_haus = str(na_r.get('seen_haus') or '')
                if seen_haus and seen_haus != cur_haus:
                    set_field(idx, r, 'haus_no', seen_haus, 'v119_haus_fix', verdict)
            for part in verdict.split(';'):
                part = part.strip()
                if part.startswith('razhajanje'):
                    stats['razhajanja'] += 1
                    add_anm(idx, r, f'[v119 e imenski pass: {part}]')
            if '[?]' in str(na_r.get('seen_name') or '') and 'POPRAVEK' in verdict:
                add_anm(idx, r, f'[v119 e: ime dvom — črnilo ~"{na_r["seen_name"]}", v114 "{cur_owner}" popravljen]')
            if 'preklicana' in verdict:
                add_anm(idx, r, '[v119 e: parzella preklicana (rdeč prečrt v črnilu)')
            # --- vrednostna plast ----------------------------------------
            for seen_key, field in SEEN2FIELD.items():
                if seen_key in va_r:
                    set_field(idx, r, field, str(va_r[seen_key]), 'v119_value_fix', str(va_r.get('verdict', '')))
            if 'seen_ertrag' in va_r:
                efl, ekr = split_ertrag(va_r['seen_ertrag'])
                set_field(idx, r, 'ertrag_fl', efl, 'v119_value_fix', str(va_r.get('verdict', '')))
                set_field(idx, r, 'ertrag_kr', ekr, 'v119_value_fix', str(va_r.get('verdict', '')))
            # počiščenja: old_* brez seen-parega
            covered = {field for key, field in SEEN2FIELD.items() if key in va_r}
            if 'seen_ertrag' in va_r:
                covered |= {'ertrag_fl', 'ertrag_kr'}
            for f in FIELDS:
                if f in covered:
                    continue
                ok = 'old_' + f
                if ok in va_r and str(va_r[ok]) not in ('', 'None'):
                    set_field(idx, r, f, '', 'v119_value_clear',
                              f"pocisceno ({va_r[ok]!r} = brez glyfne podlage / zamaknjena plast)")
            # --- posebne vrstice (Fürtrag / Insgesamt-misread) ------------
            if pg == 50 and i == 20:
                set_field(idx, r, 'owner_original', '', 'v119_e_fuertrag_clear', 'F-FÜRTRAG p50')
                set_field(idx, r, 'haus_no', '', 'v119_e_fuertrag_clear', 'F-FÜRTRAG p50')
                set_field(idx, r, 'kultur', 'Fürtrag', 'v119_e_fuertrag_clear', 'F-FÜRTRAG p50')
                add_anm(idx, r, '[v119 e F-FÜRTRAG: pozicijsko = Fürtrag pas — kultur črnilo "48 Fürtrag", jae 4 + klafter 386 (nesen na naslednji list); v114 "Pavstgl Lorenz" h5 = fantom, snimljen]')
            if pg == 52 and i == 19:
                set_field(idx, r, 'kultur', '', 'v119_value_clear', "v114 'Insgesamt:' = misread vrstice 1000")
            if pg == 54 and i == 20:
                set_field(idx, r, 'owner_original', '', 'v119_e_fuertrag_clear', 'F-FÜRTRAG p54 (F-NA-03 rebuild)')
                set_field(idx, r, 'haus_no', '', 'v119_e_fuertrag_clear', 'F-FÜRTRAG p54 (F-NA-03 rebuild)')
                add_anm(idx, r, '[v119 e F-FÜRTRAG (F-NA-03): pozicijsko = Fürtrag pas — črnilo jae 8 + klafter 1165 prečrtano, rdeče popravek 7|943; v114 "Karl Mioß" h15 + 283|1263 = zamaknjena plast P1040 (re-sidrana na r19), snimljeno]')
            r['reading_pass'] = 'v119-names'
            stats['rows_covered'] += 1
        first = rows[0][1]
        note = rd['meta'].get('values_note', '')[:400]
        first['page_observations_v119'] = note
        changes.append({'page': pg, 'type': 'page_observations_v119', 'text': note})
        obs = rd.get('page_observations')
        if obs:
            first['page_observations_v119'] = (note + ' | ' + obs)[:900]
        stats['pages_covered'].append(f'p{pg}')

    # --- vrednostni asserti ----------------------------------------------
    def row(pg, i):
        return by_page[pg][i][1]

    assert (row(50, 0)['jaethe'], row(50, 1)['ertrag_fl'], row(50, 1)['ertrag_kr']) == ('418', '1', '136')
    assert (row(50, 9)['capital_fl'], row(50, 9)['ertrag_kr']) == ('825', '')
    assert (row(50, 10)['jaethe'], row(50, 12)['capital_fl']) == ('355', '682')
    assert row(50, 18)['capital_fl'] == '1263'
    assert (row(50, 20)['jaethe'], row(50, 20)['klafter'], row(50, 20)['kultur']) == ('4', '386', 'Fürtrag')
    assert (row(51, 0)['klafter'], row(51, 1)['capital_fl'], row(51, 1)['capital_kr']) == ('82', '1442', '')
    assert (row(51, 11)['klafter'], row(51, 13)['klafter']) == ('259', '433')
    assert (row(51, 18)['klafter'], row(51, 19)['ertrag_fl'], row(51, 19)['ertrag_kr']) == ('520', '3', '593')
    assert (row(52, 0)['klafter'], row(52, 1)['klafter'], row(52, 5)['klafter']) == ('4', '152', '379')
    assert (row(52, 9)['capital_fl'], row(52, 16)['klafter']) == ('1097', '1305')
    assert (row(52, 17)['klafter'], row(52, 17)['capital_fl'], row(52, 19)['klafter']) == ('712', '1001', '245')
    assert (row(53, 3)['ertrag_fl'], row(53, 3)['ertrag_kr'], row(53, 3)['classe']) == ('3', '568', '')
    assert (row(53, 4)['klafter'], row(53, 6)['ertrag_fl'], row(53, 7)['ertrag_fl'], row(53, 7)['ertrag_kr']) == ('1191', '', '1', '1377')
    assert (row(53, 13)['klafter'], row(53, 14)['klafter'], row(53, 16)['klafter']) == ('31', '319', '68')
    assert (row(54, 4)['ertrag_fl'], row(54, 4)['ertrag_kr'], row(54, 4)['capital_fl']) == ('10', '66', '')
    assert (row(54, 13)['ertrag_fl'], row(54, 13)['ertrag_kr']) == ('5', '843')
    assert (row(54, 14)['jaethe'], row(54, 14)['klafter'], row(54, 14)['ertrag_fl']) == ('1', '996', '')
    assert (row(54, 15)['klafter'], row(54, 16)['klafter'], row(54, 17)['klafter']) == ('113', '969', '74')
    assert (row(54, 18)['klafter'], row(54, 19)['klafter'], row(54, 19)['capital_fl']) == ('908', '283', '1265')
    assert (row(54, 20)['owner_original'], row(54, 20)['klafter'], row(54, 20)['capital_fl']) == ('', '', '')
    assert (row(55, 0)['klafter'], row(55, 2)['klafter'], row(55, 6)['klafter']) == ('39', '517', '139')
    assert (row(55, 5)['ertrag_fl'], row(55, 5)['ertrag_kr']) == ('1', '600')
    assert (row(55, 7)['ertrag_fl'], row(55, 7)['ertrag_kr'], row(55, 7)['klafter']) == ('', '239', '857')
    assert (row(55, 10)['klafter'], row(55, 10)['ertrag_kr'], row(55, 9)['capital_fl']) == ('831', '463', '')
    assert (row(55, 12)['klafter'], row(55, 14)['klafter'], row(55, 18)['klafter']) == ('703', '961', '48')

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': '119-del2e', 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 119 (del 2e: p50-p55, dvojni sidr) VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v119-names')
    n_v114 = sum(1 for r in reg if r.get('reading_pass') == 'v114-ps-reread')
    print('  plasti po: v119-names:', n_rp, ' v114:', n_v114)


if __name__ == '__main__':
    main()
