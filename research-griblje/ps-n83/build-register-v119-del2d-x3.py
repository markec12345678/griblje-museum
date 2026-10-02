#!/usr/bin/env python3
"""Val 119 (del 2d-x3) — VGRADNJA celovitega re-reada PS p47–p49 (dvojni sidr).

OPSEG (protokol 140): p47–p49 = 64 vrstic — ime + haus + VREDNOSTNA PLAST
(jaethe/klafter/ertrag) + anmerkung; reading_pass := 'v119-names' na vseh.

Metoda (x3, protokol 139 §2 rešitev): DVOJNI SIDR — parzelle-stevilka (ime)
+ vrednostni pas (klafter, sedi na spodnjem pravilu pasu). Programsko
detektirana pravila; pasovi izrezki; x14/x20 zoomi za števke.

Ključne ugotovitve x3 (reading-v119d/p{47,48,49}.json):
  p47: vrednostna plast 1:1 ✓; stevkni popravki r2 (283→253), r12 (438→436);
       imenska plast po x2 auditu (F-NA-01 swap/shift od r5 — sidr popravke)
  p48: NOVO F-NA-02: vrednostna plast zamaknjena +1 IN v napačni koloni
       (v114 'jaethe' = pravzaprav klafter). Rebuild: jae→'', klafter←pas.
       901: visoko '1534' = opuščen poskus (anm), klafter←219. 921: stray
       5|58 brez imena (anm), polja prazna (921 = p49-r0).
  p49: F-NA-01 REŠEN: 22 pasov — b0..b8=921..929, b9=polpas 929½ (prečrtan,
       kl 97, brez imena — NOVO F5), b10..b20=930..940, b21=Fürtrag pas
       (jae 7|kl 1073 — NOVO F6). Register r_k = b_k pozicijsko:
       r9=929½, r10..r20=930..940, r21=Fürtrag. v114 vrednosti od r10 = +1
       zamik (r_k = pas k-1) + misreada 381/376. Imena: x2 audit seen
       (rN = 921+N za N≤19; r20=Fürtrag; r21 fantom — supersediran).
       names_audit old_haus/old_name r11..r13 = register r13..r15 (+2
       lokalna napaka indeksiranja v x2) — zato old-based fail-fast SAMO
       za vrednosti (čiste) in za r0..r8 imena; za r10..r20 imena se
       aplicira seen z anmerkung dokumentacijo.

Pravila:
  - 'ime POPRAVEK' -> owner_original := seen_name; 'haus POPRAVEK' -> haus_no
  - 'razhajanje odprto' (poravnane vrstice) -> anmerkung add-only, v114
    ohranjeno; pri ZAMAKNJENIH vrsticah (p49 r10..r20) pa staro vsebino
    zamenja sidrani zapis (staro = pomaknjeno smetje), anmerkung dokumentira
  - F5 (929½): polja → '' + anmerkung (klafter 97 prečrtan, brez imena)
  - F6 (Fürtrag pas = register r21): polja → '' + anmerkung (jae 7|kl 1073)
  - snimke *_pre_v119 (add-only); changes audit JSON
  - fail-fast guardi: 2875 vrstic; v114=184; v115=2; v118=60; v119=545;
    ditto=207; prepoved dvojnega teka; vrednostni asserti po vseh 64 vrsticah
Izhod: register.json + band-v113/register-v119-del2d-x3-changes.json
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v119d'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v119-del2d-x3-changes.json'


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
    assert layers['v114-ps-reread'] == 184, f"guard: 184 v114 (najdeno {layers['v114-ps-reread']})"
    assert layers['v115-insert'] == 2, f"guard: 2 v115 (najdeno {layers['v115-insert']})"
    assert layers['v118-names'] == 60, f"guard: 60 v118 (najdeno {layers['v118-names']})"
    assert layers['v119-names'] == 545, f"guard: 545 v119-names (najdeno {layers['v119-names']})"
    n_ditto = sum(1 for r in reg if r.get('owner_was_ditto'))
    assert n_ditto == 207, f'guard: 207 ditto (najdeno {n_ditto})'
    print(f"  guard plasti pred: v113={layers['v113-ps-reread']} v114={layers['v114-ps-reread']} "
          f"v115={layers['v115-insert']} v118={layers['v118-names']} v119={layers['v119-names']} ditto={n_ditto}")
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v119-del2d-x3-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'owner_changes': 0, 'haus_changes': 0, 'value_changes': 0,
             'anmerkung_adds': 0, 'open_discrepancies': 0,
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
        snap = f'{field}_pre_v119'
        if snap not in r:
            r[snap] = old
        r[field] = new
        changes.append(rec)
        stats['value_changes' if field in ('jaethe', 'klafter', 'ertrag_fl', 'ertrag_kr')
              else ('owner_changes' if field == 'owner_original' else 'haus_changes')] += 1
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

    def is_clean_haus(v):
        return str(v).isdigit() and str(v) != ''

    # ------------------------------------------------------------------ p47
    rows47 = by_page[47]
    assert len(rows47) == 21
    rd = json.load(open(f'{READDIR}/p47.json'))
    assert rd['meta']['vlm_calls'] == 0
    for i, (idx, r) in enumerate(rows47):
        na = rd['names_audit'][f'r{i}']
        va = rd['values_audit'][f'r{i}']
        cur_owner = r.get('owner_original') or ''
        cur_haus = str(r.get('haus_no') or '')
        assert cur_owner == na['old_name'], f'p47 r{i}: owner {cur_owner!r} != {na["old_name"]!r}'
        assert cur_haus == str(na['old_haus']), f'p47 r{i}: haus {cur_haus!r} != {na["old_haus"]!r}'
        verdict = str(na['verdict'])
        if 'ime POPRAVEK' in verdict:
            set_field(idx, r, 'owner_original', na['seen_name'], 'v119_owner_fix', verdict)
        if 'haus POPRAVEK' in verdict:
            assert '[' not in str(na['seen_haus'])
            set_field(idx, r, 'haus_no', str(na['seen_haus']), 'v119_haus_fix', verdict)
        if 'razhajanje odprto' in verdict:
            stats['open_discrepancies'] += 1
            add_anm(idx, r, f'[v119 x3 imenski pass: razhajanje odprto — črnilo ~"{na["seen_name"]}", v114 ohranjeno]')
        # vrednosti
        cur_kl = str(r.get('klafter') or '')
        assert cur_kl == str(va['old_kl']), f'p47 r{i}: klafter {cur_kl!r} != {va["old_kl"]!r}'
        if 'POPRAVEK' in str(va['verdict']):
            set_field(idx, r, 'klafter', str(va['seen_kl']), 'v119_value_fix', str(va['verdict']))
        r['reading_pass'] = 'v119-names'
        stats['rows_covered'] += 1
    first = rows47[0][1]
    note = ('v119 celoviti pass x3 (dvojni sidr) p47: vrednostna plast 1:1 ✓; '
            'stevkni popravki r2 283->253, r12 438->436; imenske popravke po x2 auditu. '
            + rd['meta'].get('values_note', '')[:350])
    first['page_observations_v119'] = note
    changes.append({'page': 47, 'type': 'page_observations_v119', 'text': note})
    stats['pages_covered'].append('p47')

    # ------------------------------------------------------------------ p48
    rows48 = by_page[48]
    assert len(rows48) == 21
    rd = json.load(open(f'{READDIR}/p48.json'))
    assert rd['meta']['vlm_calls'] == 0
    for i, (idx, r) in enumerate(rows48):
        na = rd['names_audit'][f'r{i}']
        va = rd['values_audit'][f'r{i}']
        cur_owner = r.get('owner_original') or ''
        cur_haus = str(r.get('haus_no') or '')
        # x2 knjigovodski zdrsi (old != register) so dokumentirani, ne fatal:
        # izmerjeno p48: samo r1 haus (register 2, x2 staro 3, črnilo 3)
        if cur_owner != na['old_name']:
            changes.append({'page': 48, 'row_in_page': i, 'type': 'x2_bookkeeping_note',
                            'note': f'owner old {na["old_name"]!r} != register {cur_owner!r}'})
        haus_glitch = cur_haus != str(na['old_haus'])
        if haus_glitch:
            changes.append({'page': 48, 'row_in_page': i, 'type': 'x2_bookkeeping_note',
                            'note': f'haus old {na["old_haus"]!r} != register {cur_haus!r}'})
        verdict = str(na['verdict'])
        if 'ime POPRAVEK' in verdict:
            set_field(idx, r, 'owner_original', na['seen_name'], 'v119_owner_fix', verdict)
        if 'haus POPRAVEK' in verdict:
            assert '[' not in str(na['seen_haus'])
            set_field(idx, r, 'haus_no', str(na['seen_haus']), 'v119_haus_fix', verdict)
        elif haus_glitch and 'razhajanje odprto' not in verdict and is_clean_haus(na['seen_haus']):
            set_field(idx, r, 'haus_no', str(na['seen_haus']), 'v119_haus_fix',
                      verdict + ' [x3: x2 staro {o!r} = knjigovodski zdrs, register je imel {c!r}; črnilo {s!r} ✓]'.format(o=na['old_haus'], c=cur_haus, s=na['seen_haus']))
        if 'razhajanje odprto' in verdict:
            stats['open_discrepancies'] += 1
            add_anm(idx, r, f'[v119 x3 imenski pass: razhajanje odprto — črnilo ~"{na["seen_name"]}", v114 ohranjeno]')
        # vrednosti — F-NA-02 rebuild (zamik +1 + napačna kolona)
        cur_jae = str(r.get('jaethe') or '')
        cur_kl = str(r.get('klafter') or '')
        assert cur_jae == str(va['old_jae']), f'p48 r{i}: jae {cur_jae!r} != {va["old_jae"]!r}'
        assert cur_kl == str(va['old_kl']), f'p48 r{i}: klafter {cur_kl!r} != {va["old_kl"]!r}'
        vnote = str(va['verdict'])
        if cur_jae != '':
            set_field(idx, r, 'jaethe', '', 'v119_value_fix', vnote)
        if str(va['seen_kl']) != cur_kl:
            set_field(idx, r, 'klafter', str(va['seen_kl']), 'v119_value_fix', vnote)
        if 'seen_ertrag' in va:
            kr = str(va['seen_ertrag']).split('-', 1)[1] if '-' in str(va['seen_ertrag']) else ''
            set_field(idx, r, 'ertrag_fl', '2', 'v119_value_fix', vnote)
            set_field(idx, r, 'ertrag_kr', kr, 'v119_value_fix', vnote)
            add_anm(idx, r, f'[v119 x3: ertrag "{va["seen_ertrag"]}" (dvom zadnje števke; v114 je imel vrednost za en pas nižje)]')
        if 'old_ertrag' in va and str(va['old_ertrag']) not in ('', 'None'):
            set_field(idx, r, 'ertrag_fl', '', 'v119_value_fix', vnote)
            set_field(idx, r, 'ertrag_kr', '', 'v119_value_fix', vnote)
        if 'extra_high' in va:
            add_anm(idx, r, f'[v119 x3: visoko zapisana "{va["extra_high"]}" v isti klafter-celici = opuščen prvi poskus (brez polpasnega pravila); v114 jae 1904 = njegov misread]')
        if 'stray' in va:
            add_anm(idx, r, f'[v119 x3: {va["stray"]} v pasu 921 brez imena = opuščen poskus (prava 921 = p49-r0); polja ostanejo prazna]')
        r['reading_pass'] = 'v119-names'
        stats['rows_covered'] += 1
    first = rows48[0][1]
    note = ('v119 celoviti pass x3 (dvojni sidr) p48: NOVO F-NA-02 — vrednostna plast zamaknjena +1 '
            'in v napačni koloni (v114 jae = klafter); polni rebuild 21 vrstic; stevkni popravki '
            '1490->1492, 185->155, 189->159, 2.26->2-296, 2.14->2-714; 901 visoko 1534 = opuščen poskus. '
            + rd['meta'].get('values_note', '')[:350])
    first['page_observations_v119'] = note
    changes.append({'page': 48, 'type': 'page_observations_v119', 'text': note})
    stats['pages_covered'].append('p48')

    # ------------------------------------------------------------------ p49
    rows49 = by_page[49]
    assert len(rows49) == 22
    rd = json.load(open(f'{READDIR}/p49.json'))
    assert rd['meta']['vlm_calls'] == 0
    va = rd['values_audit']

    def aud(i):
        return rd['names_audit'][f'r{i}']

    # --- poravnana cona r0..r8 (921..929): old-based fail-fast ✓ -----------
    for i in range(0, 9):
        idx, r = rows49[i]
        na = aud(i)
        cur_owner = r.get('owner_original') or ''
        cur_haus = str(r.get('haus_no') or '')
        assert cur_owner == na['old_name'], f'p49 r{i}: owner {cur_owner!r} != {na["old_name"]!r}'
        assert cur_haus == str(na['old_haus']), f'p49 r{i}: haus {cur_haus!r} != {na["old_haus"]!r}'
        verdict = str(na['verdict'])
        if 'ime POPRAVEK' in verdict:
            set_field(idx, r, 'owner_original', na['seen_name'], 'v119_owner_fix', verdict)
        if 'haus POPRAVEK' in verdict:
            assert '[' not in str(na['seen_haus'])
            set_field(idx, r, 'haus_no', str(na['seen_haus']), 'v119_haus_fix', verdict)
        if 'razhajanje odprto' in verdict:
            stats['open_discrepancies'] += 1
            add_anm(idx, r, f'[v119 x3 imenski pass: razhajanje odprto — črnilo ~"{na["seen_name"]}", v114 ohranjeno]')
        v = va[f'r{i}']
        cur_kl = str(r.get('klafter') or '')
        assert cur_kl == str(v['old_kl']), f'p49 r{i}: klafter {cur_kl!r} != {v["old_kl"]!r}'
        if 'POPRAVEK' in str(v['verdict']):
            set_field(idx, r, 'klafter', str(v['seen_kl']), 'v119_value_fix', str(v['verdict']))
        r['reading_pass'] = 'v119-names'
        stats['rows_covered'] += 1

    # --- r9 = polpas 929½ (F5) --------------------------------------------
    idx, r = rows49[9]
    assert (r.get('owner_original') or '') == 'Pessing Georg', 'p49 r9: pričakovano Pessing Georg (zamaknjeno)'
    # register r9 = polpas 929½; njegova trenutna vrednost 281 = zamaknjena
    # (misread 929-ove 241) — snima se v *_pre_v119, polja grejo na ''
    assert str(r.get('klafter') or '') == '281', \
        f"p49 r9: pričakovano klafter 281 (najdeno {r.get('klafter')!r})"
    set_field(idx, r, 'owner_original', '', 'v119_x3_halfrow_clear',
              'F5: polpas 929½ prečrtan, brez imena')
    set_field(idx, r, 'haus_no', '', 'v119_x3_halfrow_clear', 'F5')
    set_field(idx, r, 'klafter', '', 'v119_x3_halfrow_clear', 'F5')
    add_anm(idx, r, '[v119 x3 F5: pozicijsko = polpas 929½ (pravili 516/535) — parzella "929½" prečrtana + rdeči znaki, klafter 97 prečrtan, brez imena (930-ovo ime zapisano čez oba polpasna prostora); v114 vsebina (Pessing Georg h11, kl 281) = zamaknjena, snimljena v *_pre_v119]')
    r['reading_pass'] = 'v119-names'
    stats['rows_covered'] += 1

    # --- r10..r20 = 930..940 (zamaknjena cona: seen aplicira, stare vrednosti
    #     so čisto +1 zamaknjene -> vrednostni asserti ✓, imenskih old ni) ----
    for i in range(9, 20):
        idx, r = rows49[i + 1]  # audit rN -> register r(N+1)
        na = aud(i)
        v = va[f'r{i}']
        verdict = str(na['verdict'])
        cur_kl = str(r.get('klafter') or '')
        old_kl_key = next(k for k in v if k.startswith('old_kl'))
        assert cur_kl == str(v[old_kl_key]), \
            f'p49 reg r{i+1}: klafter {cur_kl!r} != {v[old_kl_key]!r}'
        # ime: 'ime POPRAVEK' ali razhajanje-z-zamikom (940) -> sidrani zapis
        if 'ime POPRAVEK' in verdict or 'razhajanje odprto' in verdict:
            cur_owner = r.get('owner_original') or ''
            if cur_owner != na['seen_name']:
                set_field(idx, r, 'owner_original', na['seen_name'], 'v119_owner_fix',
                          verdict + ' [x3: stara vsebina = zamaknjena plast]')
            if 'razhajanje odprto' in verdict:
                stats['open_discrepancies'] += 1
        # haus:seen je vedno glavna resnica v zamaknjeni coni (staro = smetje)
        sh = str(na['seen_haus'])
        if is_clean_haus(sh):
            set_field(idx, r, 'haus_no', sh, 'v119_haus_fix', verdict + ' [x3 re-sidrano]')
        else:
            if (r.get('haus_no') or '') != '':
                set_field(idx, r, 'haus_no', '', 'v119_haus_fix',
                          f'dvom {sh!r} -> prazno [x3 re-sidrano]')
            add_anm(idx, r, f'[v119 x3: haus črnilo ~{sh!r} (dvom) — razhajanje odprto]')
        if 'razhajanje odprto' in verdict:
            add_anm(idx, r, f'[v119 x3: črnilo ~"{na["seen_name"]}" / haus ~{na["seen_haus"]!r} — razhajanje odprto]')
        # vrednost
        if 'POPRAVEK' in str(v['verdict']):
            set_field(idx, r, 'klafter', str(v['seen_kl']), 'v119_value_fix', str(v['verdict']))
        r['reading_pass'] = 'v119-names'
        stats['rows_covered'] += 1

    # --- r21 = Fürtrag pas (F6) -------------------------------------------
    idx, r = rows49[21]
    assert (r.get('owner_original') or '') == 'Ploner Franzigen', 'p49 r21: pričakovano Ploner Franzigen (fantom)'
    set_field(idx, r, 'owner_original', '', 'v119_x3_fuertrag_clear', 'F6')
    set_field(idx, r, 'haus_no', '', 'v119_x3_fuertrag_clear', 'F6')
    add_anm(idx, r, '[v119 x3 F6: pozicijsko = Fürtrag pas (pravili 932/970) — "Fürtrag" v kultur koloni + jae 7 + klafter 1073 (nesen na naslednji list); brez parcele in imena; v114 "Ploner Franzigen" h14 = brez glyfne podlage, snimljeno]')
    r['reading_pass'] = 'v119-names'
    stats['rows_covered'] += 1

    # --- ertrag plast p49 (x3): 922 ✓ poravnano; 926=1-1367; 927 prazno;
    #     936=1-853; 937 prazno (v114 1.264/1.883 = brez podlage / misread+zamik)
    ea = rd['ertrag_audit']
    i1, rr1 = rows49[1]
    assert (str(rr1.get('ertrag_fl') or ''), str(rr1.get('ertrag_kr') or '')) == ('3', '364'), \
        'p49 r1: ertrag 3/364 pričakovano (poravnano)'
    i5, rr5 = rows49[5]
    assert (str(rr5.get('ertrag_fl') or ''), str(rr5.get('ertrag_kr') or '')) == ('', ''), \
        'p49 r5: ertrag prazen pričakovano'
    set_field(i5, rr5, 'ertrag_fl', '1', 'v119_value_fix', ea['926']['verdict'])
    set_field(i5, rr5, 'ertrag_kr', '1367', 'v119_value_fix', ea['926']['verdict'])
    add_anm(i5, rr5, '[v119 x3 ertrag: "1-1367" (3/5 dvom); v114 1.264 @927 = brez glyfne podlage, snimljen]')
    i6, rr6 = rows49[6]
    assert (str(rr6.get('ertrag_fl') or ''), str(rr6.get('ertrag_kr') or '')) == ('1', '264'), \
        'p49 r6: ertrag 1/264 pričakovano (za čiščenje)'
    set_field(i6, rr6, 'ertrag_fl', '', 'v119_value_fix', ea['927']['verdict'])
    set_field(i6, rr6, 'ertrag_kr', '', 'v119_value_fix', ea['927']['verdict'])
    i16, rr16 = rows49[16]
    assert (str(rr16.get('ertrag_fl') or ''), str(rr16.get('ertrag_kr') or '')) == ('', ''), \
        'p49 r16: ertrag prazen pričakovano'
    set_field(i16, rr16, 'ertrag_fl', '1', 'v119_value_fix', ea['936']['verdict'])
    set_field(i16, rr16, 'ertrag_kr', '853', 'v119_value_fix', ea['936']['verdict'])
    add_anm(i16, rr16, '[v119 x3 ertrag: "1-853" (x9); v114 1.883 = misread 5/8, za en pas nižje]')
    i17, rr17 = rows49[17]
    assert (str(rr17.get('ertrag_fl') or ''), str(rr17.get('ertrag_kr') or '')) == ('1', '883'), \
        'p49 r17: ertrag 1/883 pričakovano (za čiščenje)'
    set_field(i17, rr17, 'ertrag_fl', '', 'v119_value_fix', ea['937']['verdict'])
    set_field(i17, rr17, 'ertrag_kr', '', 'v119_value_fix', ea['937']['verdict'])

    first = rows49[0][1]
    note = ('v119 celoviti pass x3 (dvojni sidr) p49: F-NA-01 REŠEN — 22 pasov (programsko pravila): '
            '921-929, polpas 929½ prečrtan (F5, kl 97), 930-940, Fürtrag pas (F6, jae 7|kl 1073); '
            'v114 vrednosti od r10 = +1 zamik + misreada 381/376 — polni rebuild; '
            '938=658, 939=398 (x20; x2 633/345 = misread); register r9=929½, r21=Fürtrag. '
            + rd['meta'].get('values_note', '')[:350])
    first['page_observations_v119'] = note
    changes.append({'page': 49, 'type': 'page_observations_v119', 'text': note})
    stats['pages_covered'].append('p49')

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': '119-del2d-x3', 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 119 (del 2d-x3: p47-p49, dvojni sidr) VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v119-names')
    n_v114 = sum(1 for r in reg if r.get('reading_pass') == 'v114-ps-reread')
    n_v115 = sum(1 for r in reg if r.get('reading_pass') == 'v115-insert')
    print('  plasti po: v119-names:', n_rp, ' v114:', n_v114, ' v115:', n_v115)


if __name__ == '__main__':
    main()
