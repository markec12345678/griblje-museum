#!/usr/bin/env python3
"""Val 121 — vgradnja pasovnega vrednostnega re-reada (F-OCI-05 zaprtje).

Vir: research-griblje/val121-valbands/readings-v121.json (92 FIX vrstic,
23 strani, 0 VLM — branja v glavni seji prek pasovnih trakov x12 in
celicnih zoomov x16-22 z imenskim sidrom).

Metoda (protokol 143 §6.1 + F-VB infra-nauk val 121):
  - vrednost pripada pasu NAD svojim pisanim spodnjim pravilom;
  - pravila se zaznajo LOKALNO v vrednostnem stolpcu (skew med stolpci
    8-14 px; linearni TOP0+STEP zacostno na repu strani — p42/p47 dokaz);
  - sporne celice se sodijo na x16-22; nedvoumne s sosednjimi anchorji;
  - ce je niz znakov v napaku (p42), se pas poveze z IMENOM (imensko sidro).
"""
import json
import re
from collections import Counter

REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
READ = '/home/z/griblje-museum/research-griblje/val121-valbands/readings-v121.json'
OUT_CH = '/home/z/griblje-museum/research-griblje/val121-valbands/changes-v121.json'

EXPECTED_FIX = 91  # vkljucno s 4 dodetimi (p5 h168, p28 h13 r11, p32 h38, p37 h30)
EXPECTED_PAGES = 21  # 91 popravkov na 21 straneh; p36/p47/p53 brez vgradnje vrednosti

reg = json.load(open(REG))
read = json.load(open(READ))
assert len(reg) == 2875, f'register {len(reg)} != 2875'

firsts = {}
for i, r in enumerate(reg):
    firsts.setdefault(r['page'], i)

fixes = []
for pg_entry in read['vals']:
    pg = pg_entry['page']
    for row in pg_entry['rows']:
        if 'FIX' not in row['verdict']:
            continue
        fixes.append({'page': pg, 'r': row['r'], 'jae': row.get('jae', ''),
                      'kl': row.get('kl', ''), 'verdict': row['verdict']})

assert len(fixes) == EXPECTED_FIX, f'FIX {len(fixes)} != {EXPECTED_FIX}'
assert len({f["page"] for f in fixes}) == EXPECTED_PAGES, 'pages mismatch'

changes = []
for f in fixes:
    ridx = firsts[f['page']] + f['r']
    r = reg[ridx]
    assert r['page'] == f['page'], f'row mismatch p{f["page"]} r{f["r"]}'
    old_jae, old_kl = r['jaethe'], r['klafter']
    new_jae, new_kl = f['jae'], f['kl']
    # GUARD: verdict mora deklarirati staro vrednost in ta se MORA ujemati
    m = re.search(r'FIX\s+([^\s]+)->', f['verdict'])
    if m:
        dec_old = m.group(1).rstrip('.,;')
        dec_kl = dec_old if 'jae' not in dec_old else None
        if dec_kl is not None and str(old_kl) != dec_kl and str(old_jae) != dec_kl:
            raise AssertionError(
                f'GUARD p{f["page"]} r{f["r"]}: deklarirano staro {dec_kl!r} '
                f'!= register {old_kl!r}/{old_jae!r} (napacna vrstica?)')
    assert (old_jae, old_kl) != (new_jae, new_kl), f'no-change p{f["page"]} r{f["r"]}: {old_jae}/{old_kl}'
    ch = {'page': f['page'], 'rreg': ridx, 'haus': r['haus_no'],
          'owner': r['owner_original'],
          'jae': [old_jae, new_jae], 'kl': [old_kl, new_kl],
          'verdict': f['verdict']}
    # anmerkung: zapri vrednostne razhajanja
    anm = r.get('anmerkung', '') or ''
    anm2 = re.sub(r'((?:razhajanje|neujemljivo)[^—]{0,90}?)— odprto', r'\1— ZAPRTO val 121', anm)
    note = f"[v121: {old_jae or '∅'}|{old_kl or '∅'} -> {new_jae or '∅'}|{new_kl or '∅'} pasovni re-read]"
    r['anmerkung'] = (anm2 + ' ' + note).strip() if anm2 else note
    if old_jae != new_jae:
        r['jaethe_pre_v121'] = old_jae
    if old_kl != new_kl:
        r['klafter_pre_v121'] = old_kl
    r['jaethe'], r['klafter'] = new_jae, new_kl
    changes.append(ch)

# moot / keep rows (vrednost ohranjena, spor zaprt z obrazlozitvijo)
moot = [
    {'page': 36, 'r': 0, 'note': '[v121: 657 ohranjena — zadnja 9/7 neresljiva (flourish); 9-moznost ostaja odprta v anm]'},
    {'page': 47, 'r': 1, 'note': '[v121: 1165 ohranjena — zadnja stevilka pod madezem; v113 1163 ne potrjena ne izkljucena]'},
    {'page': 54, 'r': 18, 'note': '[v121: 908 potrjena — spor 716 vs 74/714 zastarel (v114 zdrs atribucije)}'},
    {'page': 54, 'r': 19, 'note': '[v121: 283 potrjena — spor 425 vs 908: 908 je r18 vrednost (v114 zdrs)}'},
]
for m in moot:
    ridx = firsts[m['page']] + m['r']
    r = reg[ridx]
    anm = r.get('anmerkung', '') or ''
    anm2 = re.sub(r'((?:razhajanje|neujemljivo)[^—]{0,90}?)— odprto', r'\1— ZAPRTO val 121', anm)
    r['anmerkung'] = (anm2 + ' ' + m['note']).strip()
    changes.append({'page': m['page'], 'rreg': ridx, 'haus': r['haus_no'],
                    'owner': r['owner_original'], 'moot': True, 'verdict': m['note']})

# page_observations (Fürtrag bloki)
po = {
    42: 'Furtrag vrstica pod r20: crno precrtano ~7|365, rdeca koncna 1|318 (ni register vrstica; parzelle 781-901)',
    43: 'Furtrag blok ob r19: crno precrtano 1|1977 (r19) in 7|862 (pod r19), rdeca koncna 1|1052; parzelle 820 rdece precrtana',
}
for pg, obs in po.items():
    rows = [r for r in reg if r['page'] == pg]
    r0 = rows[0]
    existing = r0.get('page_observations', '')
    r0['page_observations_v121'] = obs
    _ = existing

# p53 stale disputes: vrednosti ze pravilne (del 2e) — samo anm zaprtje
for rr in (1029, 1030, 1033, 1034, 1035):
    r = reg[rr]
    anm = r.get('anmerkung', '') or ''
    anm2 = re.sub(r'(razhajanje[^—]{0,90}?)— odprto', r'\1— ZAPRTO val 121 (potrjeno)', anm)
    if anm2 != anm:
        r['anmerkung'] = anm2 + ' [v121: pasovni re-read potrjuje vrednost]'
        changes.append({'page': r['page'], 'rreg': rr, 'haus': r['haus_no'],
                        'owner': r['owner_original'], 'confirm': True})

json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=0)
json.dump({'changes': changes, 'count_fix': EXPECTED_FIX, 'count_total': len(changes)},
          open(OUT_CH, 'w'), ensure_ascii=False, indent=1)

kinds = Counter()
for c in changes:
    if c.get('moot'):
        kinds['moot'] += 1
        continue
    if c.get('confirm'):
        kinds['confirm_anm'] += 1
        continue
    if c['jae'][0] != c['jae'][1]:
        kinds['jae_' + ('set' if not c['jae'][0] else 'clear' if not c['jae'][1] else 'chg')] += 1
    if c['kl'][0] != c['kl'][1]:
        kinds['kl'] += 1
print('changes:', len(changes), dict(kinds))
print('plasti check:')
src = Counter(r.get('source', '') for r in reg)
print('  sources:', dict(src))
print('OK')
