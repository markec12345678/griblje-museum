#!/usr/bin/env python3
"""Val 111 — VGRADNJA re-reada p3 (1. del polnega re-reada PS p1–55) v register.

Vhod: band-v111/reading-v111/p03.json (agentov vid, 0 VLM) + ps-n83/register.json
Pravila (1:1 val 108 vzorec + F-PV-07):
  - v111 glas (vid) je NOVI primarni glas za območne vrednosti p3
  - p3 register je bil BREZ območij (val 57 qm-shema nikoli vgrajena) → VGRADNJA:
    vrednosti gredo v klafter (vizualno ležijo v podstolpcu 'Quad. Klafter' —
    N.o Joche prazen; F-PV-07). jaethe ostane '' (pravilno po F-PV-05/86 konvenciji).
  - vsa pokrita vrstica dobi reading_pass := 'v111-ps-reread'
  - anmerkung dopolnitve (add-only): prečrtanja/rdeči zapisi z val 111 oznako
  - kultur/imena/stand/no_blatt: NE spreminjamo (imena pass odložen; dvomi
    dokumentirani v reading JSON + page_observations)
  - page_observations p3: Fürtrag rdeča korekcija 2|1495, F-PV-07, odprti Format
    kapitalnih nizov, Uebersetzung števec 1–21
  - fail-fast: guard 2871 vrstic + changes file guard (dvojni tek prepovedan)
Izhod: register.json (posodobljen) + band-v111/register-v111-changes.json (audit)
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READ = f'{REPO}/research-griblje/ps-n83/band-v111/reading-v111/p03.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v111/register-v111-changes.json'
VAL57_RAW = f'{REPO}/research-griblje/raw-web-val57-2026-10/ps-vlm/p003.json'

VAL57_QM_AUDIT = {3: '769', 13: '609', 15: '158', 20: '46'}  # dvomi/razhajanja vs val57 qm (nikoli v register)


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v111-changes.json že obstaja (dvojni tek prepovedan)')

    read = json.load(open(READ))
    v57 = {i: r.get('qm', '') for i, r in enumerate(json.load(open(VAL57_RAW))['rows'])}
    reg_rows = [r for r in reg if r['page'] == 3]
    assert len(reg_rows) == 21, f'guard: p3 ima 21 vrstic (najdeno {len(reg_rows)})'
    for rr in reg_rows:
        assert not rr.get('reading_pass'), f"guard: p3 r{reg_rows.index(rr)} že ima reading_pass ({rr.get('reading_pass')})"

    changes = []
    filled, annotated = [], []
    for i, rr in enumerate(reg_rows):
        rinfo = read['rows'].get(str(i))
        if not rinfo:
            continue
        k_new = rinfo.get('k', '').replace('[?]', '').strip()
        k_marked = rinfo.get('k', '').strip()
        assert rr.get('jaethe', '') in ('', None) and rr.get('klafter', '') in ('', None), f'p3 r{i}: register ni prazen?!'
        rec = {'page': 3, 'row': i, 'type': 'v111_fill_klafter',
               'old': {'jaethe': '', 'klafter': ''},
               'new': {'jaethe': '', 'klafter': k_new},
               'kultur_seen': rinfo.get('kultur_seen', ''),
               'note': rinfo.get('note', '')}
        if i in VAL57_QM_AUDIT:
            rec['val57_qm_never_imported'] = VAL57_QM_AUDIT[i]
            rec['note'] = (rec['note'] + '; val57 qm=' + VAL57_QM_AUDIT[i] + ' (nikoli v register) — v111 glas različen/potrjen').strip('; ')
        rr['klafter'] = k_new
        rr['reading_pass'] = 'v111-ps-reread'
        if k_new:
            filled.append(f'p3 r{i}')
            changes.append(rec)
        else:
            rec['type'] = 'v111_empty_cell'
            changes.append(rec)
        # anmerkung dopolnitve (add-only)
        add = []
        if i == 0:
            add.append('[vrstica prečrtana — val 111]')
        if i == 11:
            add.append('[prej zapisana številka prečrtana, prek nje 99 — val 111]')
        if i == 14:
            add.append('[679 prečrtano rdeče; kultur prečrtan rdeče; rdeča opomba …1844… — val 111]')
        if add:
            am = (rr.get('anmerkung') or '').strip()
            rr['anmerkung'] = (am + ('; ' if am else '') + '; '.join(add)).strip('; ')
            annotated.append(f'p3 r{i}')
            changes.append({'page': 3, 'row': i, 'type': 'v111_anmerkung_addonly',
                            'new_anmerkung': rr['anmerkung']})

    assert len(filled) == 19, f'guard: 19 vgrajenih klafter (najdeno {len(filled)})'  # r0 + r16 prazni

    po = ('val 111 re-read (agentov vid, 0 VLM): Fürtrag "1 Fürtrag." črno 3|574 prečrtano rdeče, '
          'rdeča korekcija 2|1495; F-PV-07: območja piše v Quad. Klafter podstolpec (N.o Joche prazen) — '
          'vgrajeno v klafter; Uebersetzung/Ried števec 1–21; kapitalni nizi "1−1348"/"1−602"/"22" '
          'neražčlenjeni (dekodiranje odloženo); kultur dvomi r5/r6/r16/r18/r19 (glej reading-v111/p03.json); '
          'imena/stand: izrezki z x-odmikom, ločen imenski pass (register ostaja prazen — nič ugibanja); '
          'vsota r1–r20 = 7116 QK vs Fürtrag 4695 (C4-vzorec, neodločeno)')
    reg_rows[0]['page_observations'] = (po + ' | ' + (reg_rows[0].get('page_observations') or '')).strip(' |')

    out = {'meta': {'val': '111', 'source': 'agentov vid (reading-v111/p03.json)',
                    'method': '1:1 val 108; p3 vgradnja območij (val57 qm-shema nikoli vgrajena); '
                              'vrednosti v klafter (F-PV-07); anmerkung add-only; imenski pass odložen',
                    'findings': read['meta']['findings']},
           'tally': {'filled_klafter': len(filled), 'anmerkung_addonly': len(annotated)},
           'changes': changes}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    print(f'v111: vgrajenih klafter {len(filled)}, anmerkung {len(annotated)} — p3 (21 vrstic)')


if __name__ == '__main__':
    main()
