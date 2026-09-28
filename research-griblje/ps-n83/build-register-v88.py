#!/usr/bin/env python3
"""Val 88 — VGRADNJA: 139 digit-split vrstic rešeno z direktnim branjem (instrument val 61).

NAČELA (§4 + §22 + precedens val 61/86):
- vsak popravek ohrani original (jaethe_pass1_v82 / klafter_pass1_v82) + oznako jk_review
- v88 vrednost: če vsebuje '|' → jaethe/klafter izrazito; sicer klafter:=v88, jaethe:=''
  (page-level F-PV-05 pravilo: pisar piše Kläfter — digit-split vrstice so iz j|j enojnih)
- status P1/P2 = obstoječi pas potrjen (vrednost enaka pasu), T3 = tretja vrednost
  (oba VLM pasa napačna), U = unresolved (ostane REVIEW)
- register.json se popravi ENKRAT (fail-fast); p1–55 + p143 NESPREMENJENI (guard)
Izhodi: ps-n83/register.json, ps-n83/band-v88/register-v88-changes.json
"""
import json, os, re, sys, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
ADJ = f'{REPO}/research-griblje/ps-n83/band-v88/adjudication-v88.json'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v88'


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, 'guard: register 2871'
    for r in reg:
        if r.get('jk_review', '').startswith('v88'):
            sys.exit('FATAL: register že v88 (fail-fast)')
    adj = json.load(open(ADJ))['adjudications']
    assert len(adj) == 139, f'guard: 139 adjudikacij ({len(adj)})'
    changes, tally = [], collections.Counter()
    n_row = 0
    for a in adj:
        rr = reg[a['global_idx']]
        # kontekstna kontrola: vrstica res digit-split in na pravi strani
        assert rr.get('jk_review') == 'v86-review-pass-digit-split', f"guard g{a['global_idx']}: {rr.get('jk_review')}"
        assert rr['page'] == a['page'], f"guard g{a['global_idx']}: page"
        old_j, old_k = rr.get('jaethe') or '', rr.get('klafter') or ''
        # snapshot (enkrat)
        if 'jaethe_pass1_v82' not in rr:
            rr['jaethe_pass1_v82'] = old_j
            rr['klafter_pass1_v82'] = old_k
        val, st = a['v88'], a['status']
        if st == 'U' or val is None:
            rr['jk_review'] = 'v88-digit-split-UNRESOLVED'
            rr['v88_note'] = 'direktno branje ni rešilo (popravek v viru nejasen)'
            tally['unresolved'] += 1
            changes.append({'global_idx': a['global_idx'], 'page': a['page'], 'row': a['page_row'],
                            'type': 'v88_unresolved', 'p1': a['p1'], 'p2': a['p2']})
            continue
        if '|' in val:
            j, k = val.split('|', 1)
            j, k = j.strip(), k.strip()
        else:
            j, k = '', val
        rr['jaethe'], rr['klafter'] = j, k
        rr['jaethe_v88'], rr['klafter_v88'] = j, k
        rr['jk_review'] = 'v88-digit-split-RESOLVED'
        rr['v88_status'] = st
        tally[f'resolved-{st}'] += 1
        changes.append({'global_idx': a['global_idx'], 'page': a['page'], 'row': a['page_row'],
                        'type': 'v88_resolution', 'status': st,
                        'old': {'jaethe': old_j, 'klafter': old_k},
                        'new': {'jaethe': j, 'klafter': k},
                        'p1': a['p1'], 'p2': a['p2'], 'tile_diag': a['tile_diag']})
        n_row += 1
    # GUARDS
    n_res = sum(1 for r in reg if r.get('jk_review') == 'v88-digit-split-RESOLVED')
    n_unres = sum(1 for r in reg if r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_res + n_unres == 139, f'guard: 139 v88 vrstic ({n_res}+{n_unres})'
    for r in reg:
        if r['page'] < 56:
            assert not str(r.get('jk_review', '')).startswith('v88'), 'guard: p<56 počisto'
            assert 'jaethe_v88' not in r, 'guard: p<56 v88 polja'
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    json.dump({'meta': {'val': 88, 'generated_by': 'build-register-v88.py',
                        'method': 'direktno branje izrezkov (instrument val 61) — 139 digit-split vrstic',
                        'source': 'band-v88/adjudication-v88.json'},
               'tally': dict(sorted(tally.items())), 'changes': changes},
              open(f'{OUTD}/register-v88-changes.json', 'w'), ensure_ascii=False, indent=1)
    print(f'VGRADNJA: rešenih {n_res}, unresolved {n_unres}; tally:', dict(sorted(tally.items())))


if __name__ == '__main__':
    main()
