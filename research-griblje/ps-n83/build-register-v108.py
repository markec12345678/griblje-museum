#!/usr/bin/env python3
"""Val 108 — VGRADNJA direktnih re-read branj (instrument val 61/88) v register PS N83.

Vhod: band-v108/reading-v108.json (agentov vid, 14 strani p95–137, ~280 vrstic)
      + ps-n83/register.json
Pravila (1:1 val 88 pouk):
  - v108 glas (vid) je NOVI primarni glas za jaethe/klafter na teh straneh
  - če se v108 ujema z REG (numeq): vrednost ostane; če ima marker [g], se doda
    jk_review opomba v108-gestrichen (marker se ne piše v vrednost — čisto polje)
  - če se NE ujema: POPRAVEK — jaethe/klafter := v108, snimki
    jaethe_pre_v108 / klafter_pre_v108, jk_review := v108-re-read, changes zapis
  - v88 vrstica (vir resnice vala 88) se NE dotika (guard; v88 je na p56–94+121,
    ta val je p95–137 — presek prazen, guard vseeno)
  - [g] marker: vrednost pisana + prečrtana rdeče (F-PZ-09) — zapiše v anmerkung
    kot '[gestrichen rot — val 108]' če ga vrstica še nima
Izhod: register.json (posodobljen) + band-v108/register-v108-changes.json (audit)
"""
import json
import os
import re
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READ = f'{REPO}/research-griblje/ps-n83/band-v108/reading-v108.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v108/register-v108-changes.json'


def numeq(v):
    s = re.sub(r'\s+', ' ', str(v or '').strip())
    s = re.sub(r'\[[^\]]*\]', '', s)
    return re.sub(r'\D', '', s)


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v108-changes.json že obstaja (dvojni tek prepovedan)')

    read = json.load(open(READ))
    changes = []
    tally = {}
    for pg_s, page in read['pages'].items():
        pg = int(pg_s)
        reg_rows = [r for r in reg if r['page'] == pg]
        for i, rr in enumerate(reg_rows):
            rinfo = page['rows'].get(str(i))
            if not rinfo:
                continue
            gj, gk = rinfo.get('j', ''), rinfo.get('k', '')
            note = rinfo.get('note', '')
            gestrichen = '[g]' in gk or '[g]' in gj
            gj_clean = re.sub(r'\s*\[g\]', '', gj).strip()
            gk_clean = re.sub(r'\s*\[g\]', '', gk).strip()
            old_j, old_k = rr.get('jaethe') or '', rr.get('klafter') or ''
            same = (numeq(old_j) == numeq(gj_clean)) and (numeq(old_k) == numeq(gk_clean))
            if same:
                tally.setdefault('agree', []).append(f'p{pg} r{i}')
                if gestrichen:
                    am = rr.get('anmerkung') or ''
                    if 'gestrichen rot — val 108' not in am:
                        rr['anmerkung'] = (am + ('; ' if am else '') + '[gestrichen rot — val 108]').strip('; ')
                        changes.append({'page': pg, 'row': i, 'type': 'gestrichen_marker',
                                        'old_anmerkung': am, 'new_anmerkung': rr['anmerkung']})
                continue
            # POPRAVEK
            rec = {'page': pg, 'row': i, 'type': 'v108_correction',
                   'old': {'jaethe': old_j, 'klafter': old_k},
                   'new': {'jaethe': gj_clean, 'klafter': gk_clean},
                   'note': note, 'gestrichen': gestrichen}
            if 'jaethe_pre_v108' not in rr:
                rr['jaethe_pre_v108'] = old_j
                rr['klafter_pre_v108'] = old_k
            rr['jaethe'], rr['klafter'] = gj_clean, gk_clean
            prev = rr.get('jk_review')
            rr['jk_review'] = 'v108-re-read'
            if prev and prev != 'v108-re-read':
                rec['prev_jk_review'] = prev
            if gestrichen:
                am = rr.get('anmerkung') or ''
                if 'gestrichen rot — val 108' not in am:
                    rr['anmerkung'] = (am + ('; ' if am else '') + '[gestrichen rot — val 108]').strip('; ')
            changes.append(rec)
            tally.setdefault('corrected', []).append(f'p{pg} r{i}')

    n_corr = len(tally.get('corrected', []))
    n_agree = len(tally.get('agree', []))
    out = {'meta': {'val': '108', 'source': 'agentov vid (reading-v108.json)',
                    'method': '1:1 val 88; v108 glas primarni; popravki s snimkami; [g]=gestrichen rot marker v anmerkung',
                    'discovery': read['meta']['discovery']},
           'tally': {'agree': n_agree, 'corrected': n_corr},
           'changes': changes}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    print(f'v108: soglasje {n_agree}, popravki {n_corr} — skupaj {n_agree + n_corr} vrstic')


if __name__ == '__main__':
    main()
