#!/usr/bin/env python3
"""Val 123 — vgradnja p3–p16 vrednostnega sweepa (jae+kl) v register.

Vir: research-griblje/val123-sweep/readings-v123.json (27 FIX, 7 DISPUTE,
p7 strukturni disput F-V123-01, opazbe kapitalnih nizov — branja v glavni
seji prek pasovnih trakov x6 in celicnih zoomov x10-15, metoda val 121:
bottom-rule anchoring + snap_grid, brez VLM klicev).

Metoda vgradnje (kot val 121):
  - GUARD: FIX mora deklarirati staro vrednost in ta se MORA ujemati s
    register (napacna vrstica => AssertionError);
  - brez tihih popravkov: vsak FIX zapise klafter_pre_v123 + anmerkung note;
  - DISPUTI se NE popravljajo — anmerkung "razhajanje — odprto (v123)";
  - p7 strukturni disput (F-V123-01): samo page_obs, 0 sprememb vrednosti;
  - page_obs: kapitalni nizi + Fürtrag opazbe (add-only).
"""
import json
import re
from collections import Counter

REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
READ = '/home/z/griblje-museum/research-griblje/val123-sweep/readings-v123.json'
OUT_CH = '/home/z/griblje-museum/research-griblje/val123-sweep/changes-v123.json'

EXPECTED_FIX = 27
EXPECTED_DISPUTE = 7
EXPECTED_PAGES_FIX = 10  # p3,p4,p6,p8,p9,p12,p13,p15 = 8 strani... glej check spodaj

reg = json.load(open(REG))
read = json.load(open(READ))
assert len(reg) == 2875, f'register {len(reg)} != 2875'

firsts = {}
for i, r in enumerate(reg):
    firsts.setdefault(r['page'], i)

changes = []

# --- FIX vgradnja -----------------------------------------------------------
fixes = read['fixes']
assert len(fixes) == EXPECTED_FIX, f'FIX {len(fixes)} != {EXPECTED_FIX}'
pages_fix = sorted({f['page'] for f in fixes})
assert pages_fix == [3, 4, 6, 8, 9, 12, 13, 15], f'FIX strani {pages_fix}'

for f in fixes:
    ridx = firsts[f['page']] + f['r']
    r = reg[ridx]
    assert r['page'] == f['page'], f'row mismatch p{f["page"]} r{f["r"]}'
    old = r['klafter']
    # GUARD: deklarirano staro mora biti enako register
    m = re.search(r'FIX\s+([0-9]+)->', f['verdict'])
    assert m, f'brez deklaracije p{f["page"]} r{f["r"]}: {f["verdict"]}'
    dec_old = m.group(1)
    assert str(old) == dec_old, (
        f'GUARD p{f["page"]} r{f["r"]}: deklarirano {dec_old!r} != register {old!r}')
    assert old != f['new'], f'no-change p{f["page"]} r{f["r"]}'
    anm = (r.get('anmerkung') or '').strip()
    note = f"[v123: ∅|{old} -> ∅|{f['new']} sweep p3-p16]"
    r['anmerkung'] = (anm + ' ' + note).strip() if anm else note
    r['klafter_pre_v123'] = old
    r['klafter'] = f['new']
    changes.append({'page': f['page'], 'rreg': ridx, 'kind': 'FIX',
                    'haus': r['haus_no'], 'owner': r['owner_original'][:30],
                    'kl': [old, f['new']], 'verdict': f['verdict']})

# --- DISPUTI (samo anmerkung, brez spremembe vrednosti) ----------------------
for d in read['disputes']:
    ridx = firsts[d['page']] + d['r']
    r = reg[ridx]
    assert r['page'] == d['page']
    assert str(r['klafter']) == d['reg'], (
        f'GUARD-dispute p{d["page"]} r{d["r"]}: {r["klafter"]!r} != {d["reg"]!r}')
    anm = (r.get('anmerkung') or '').strip()
    note = f"[v123 sweep: razhajanje {d['reg']} vs olje {d['seen']} — odprto]"
    if 'odprto (v123' not in anm and note not in anm:
        r['anmerkung'] = (anm + ' ' + note).strip() if anm else note
    changes.append({'page': d['page'], 'rreg': ridx, 'kind': 'DISPUTE',
                    'haus': r['haus_no'], 'owner': r['owner_original'][:30],
                    'kl': [r['klafter'], d['seen']], 'verdict': d['verdict']})

# --- p7 strukturni disput: page_obs add-only ---------------------------------
p7idx = firsts[7]
p7row = reg[p7idx]
po = p7row.get('page_observations') or ''
f7 = read['p7_structural']['finding']
if 'F-V123-01' not in po:
    p7row['page_observations'] = (po + ' | ' if po else '') + '[v123 ' + f7 + ']'
changes.append({'page': 7, 'rreg': p7idx, 'kind': 'PAGE_OBS', 'note': 'F-V123-01'})

# stranske disput vrstice p7 (anmerkung, brez vrednosti)
for dr in read['p7_structural']['disputed_rows']:
    ridx = firsts[7] + dr['r']
    r = reg[ridx]
    anm = (r.get('anmerkung') or '').strip()
    note = f"[v123 sweep: razhajanje {dr['reg']} vs olje {dr['seen']} — odprto, F-V123-01]"
    if note not in anm:
        r['anmerkung'] = (anm + ' ' + note).strip() if anm else note
    changes.append({'page': 7, 'rreg': ridx, 'kind': 'DISPUTE',
                    'haus': r['haus_no'], 'kl': [dr['reg'], dr['seen']],
                    'verdict': 'F-V123-01'})

# --- opazbe (kapitalni nizi + Fürtrag) page_obs add-only ----------------------
for pg_raw, obs in read['observations'].items():
    pg = int(pg_raw)
    row = reg[firsts[pg]]
    po = row.get('page_observations') or ''
    add = '; '.join(obs)
    tag = f'[v123 opazbe: {add}]'
    if add.split(':')[0] not in po:
        row['page_observations'] = (po + ' | ' if po else '') + tag
        changes.append({'page': pg, 'rreg': firsts[pg], 'kind': 'PAGE_OBS',
                        'note': add[:80]})

# --- varovalke ---------------------------------------------------------------
n_fix = sum(1 for c in changes if c['kind'] == 'FIX')
n_dis = sum(1 for c in changes if c['kind'] == 'DISPUTE')
n_obs = sum(1 for c in changes if c['kind'] == 'PAGE_OBS')
assert n_fix == EXPECTED_FIX
assert n_dis == EXPECTED_DISPUTE + 6  # 7 + 6 p7 stranskih
print(f'FIX={n_fix} DISPUTE={n_dis} PAGE_OBS={n_obs}')

out = {'changes': changes, 'count_fix': n_fix, 'count_dispute': n_dis,
       'count_page_obs': n_obs}
with open(OUT_CH, 'w') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)

with open(REG, 'w') as fh:
    json.dump(reg, fh, ensure_ascii=False, indent=1)
print('register shranjen;', OUT_CH)
