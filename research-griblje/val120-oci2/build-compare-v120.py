#!/usr/bin/env python3
"""Val 120 — primerjava slepih branj 2. oči vs. register.json (protokol 143).

Vhod: research-griblje/val120-oci2/blind/p{pg}-seg{K}.json (42 datotek, 14 strani,
283 vrstic) + ps-n83/register.json (read-only).
Izhod: research-griblje/val120-oci2/comparison.json (per-vrstica) + izpis povzetka.

Primerjana polja: name (normalized exact / sim_surname≥0.7 variant / mismatch),
haus (exact), jae+kl (exact int), parz (tiskano pričakovanje, kjer bralno).
p49: imenska plast samo r0–r8; r9–r21 EXCLUDED_GEOMETRY (ne-uniformna pasova
mreža: polpas 929½ @r9 + Fürtrag @r21 — uniformni grid iz val 120 je od r9
drifted +1; glej protokol 140 §1). Strukturne ujeme (F2, polpas, Fürtrag,
fantomska prazna vrstica) se štejejo posebej.

Metoda imen (konsistentna z F-SYNC metodo B): normalizacija (lower, brez [?]/~/
/.), priimek = prvi token; sim = max LCS med priimkom in vsemi tokeni drugega
imena; EXACT če sta normalizirani imeni enaki, VARIANT sim≥0.7, sicer MISMATCH.
"""
import json
import os
import re
from collections import defaultdict

BASE = '/home/z/griblje-museum/research-griblje'
BLIND = f'{BASE}/val120-oci2/blind'
REG = f'{BASE}/ps-n83/register.json'

PAGES = [17, 19, 20, 25, 26, 31, 32, 37, 38, 43, 44, 49, 50, 55]
# pričakovana prva tiskana parzella per stran (formula p17–p43 = 281+(pg−17)*20;
# p44=821, p49=921, p50=941, p55=1041 — komitane konstante del 2d/2e)
PARZ0 = {pg: 281 + (pg - 17) * 20 for pg in PAGES if pg < 44}
PARZ0.update({44: 821, 49: 921, 50: 941, 55: 1041})

SPECIAL = {
    ('49', 9): 'polpas 929½ (F5) — brez imena/vrednosti v register',
    ('49', 21): 'Fürtrag pas (F6) — jae 7|kl 1073',
}


def norm(s):
    if not s:
        return ''
    s = s.lower()
    s = re.sub(r'[\[\]\?~*]', '', s)
    s = s.replace('ß', 'ss').replace('ä', 'a').replace('ö', 'o').replace('ü', 'u')
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def lcs(a, b):
    if not a or not b:
        return 0
    m = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a)):
        for j in range(len(b)):
            m[i + 1][j + 1] = m[i][j] + 1 if a[i] == b[j] else max(m[i][j + 1], m[i + 1][j])
    return m[len(a)][len(b)]


def sim_surname(n1, n2):
    t1 = norm(n1).split()
    t2 = norm(n2).split()
    if not t1 or not t2:
        return 0.0
    sur = t1[0]
    return max(lcs(sur, t) / max(len(sur), len(t)) for t in t2)


def as_int(v):
    if v is None:
        return None
    s = re.sub(r'[^\d]', '', str(v))
    return int(s) if s else None


def main():
    rows = json.load(open(REG))
    by_page = defaultdict(list)
    for r in rows:
        by_page[r['page']].append(r)

    out = []
    stats = defaultdict(lambda: defaultdict(int))
    structural = []

    for pg in PAGES:
        segs = sorted(
            f for f in os.listdir(BLIND) if f.startswith(f'p{pg}-seg'))
        blind = {}
        for f in segs:
            d = json.load(open(f'{BLIND}/{f}'))
            for row in d['rows']:
                blind[row['r']] = row
        regs = by_page[pg]
        for k in range(len(regs)):
            reg = regs[k]
            b = blind.get(k)
            key = (str(pg), k)
            entry = {
                'page': pg, 'r': k,
                'reg_owner': reg.get('owner_original') or '',
                'reg_haus': reg.get('haus_no') or '',
                'reg_jae': reg.get('jaethe') or '',
                'reg_kl': reg.get('klafter') or '',
                'reg_anm': (reg.get('anmerkung') or '')[:90],
            }
            if key in SPECIAL:
                entry['verdict'] = 'SPECIAL'
                entry['note'] = SPECIAL[key]
                out.append(entry)
                continue
            if pg == 49 and k >= 9:
                entry['verdict'] = 'EXCLUDED_GEOMETRY'
                entry['note'] = 'p49 r>=9: ne-uniformna pasova mreza (polpas/Furtrag); uniformni grid drifted'
                out.append(entry)
                continue
            if not b:
                entry['verdict'] = 'NO_BLIND'
                out.append(entry)
                continue
            entry['blind'] = {f: b.get(f) for f in
                              ('parz', 'haus', 'name', 'kultur', 'jae', 'kl',
                               'crossout', 'extra')}
            # --- ime -------------------------------------------------------
            bn = b.get('name') or ''
            dubious = ('~' in bn) or (bn.strip().endswith('[?]') and len(norm(bn)) < 6)
            sim = sim_surname(bn, reg.get('owner_original') or '')
            if norm(bn) == norm(reg.get('owner_original') or '') and norm(bn):
                entry['name_verdict'] = 'EXACT'
            elif sim >= 0.7:
                entry['name_verdict'] = 'VARIANT'
                entry['name_sim'] = round(sim, 3)
            else:
                entry['name_verdict'] = 'MISMATCH'
                entry['name_sim'] = round(sim, 3)
            if dubious and entry['name_verdict'] != 'EXACT':
                entry['name_verdict'] += '_DUBIOUS'
            # --- haus ------------------------------------------------------
            bh = as_int(b.get('haus'))
            rh = as_int(reg.get('haus_no'))
            entry['haus_verdict'] = ('EXACT' if bh is not None and rh is not None and bh == rh
                                     else 'MISMATCH' if bh is not None and rh is not None
                                     else 'NA')
            # --- vrednosti --------------------------------------------------
            bj, bk = as_int(b.get('jae')), as_int(b.get('kl'))
            rj, rk = as_int(reg.get('jaethe')), as_int(reg.get('klafter'))
            if bk is None and rk is None:
                entry['kl_verdict'] = 'NA'
            elif bk is not None and rk is not None and bk == rk:
                entry['kl_verdict'] = 'EXACT'
            elif bk is not None and rk is not None:
                ds = sum(1 for x, y in zip(str(bk), str(rk)) if x == y)
                entry['kl_verdict'] = 'VARIANT_DIGIT' if ds >= len(str(rk)) - 1 else 'MISMATCH'
                entry['kl_values'] = [bk, rk]
            else:
                entry['kl_verdict'] = 'MISMATCH_EMPTY'
                entry['kl_values'] = [bk, rk]
            if bj is not None or rj is not None:
                entry['jae_verdict'] = 'EXACT' if bj == rj else f'DIFF[{bj}|{rj}]'
            # --- parz (samo čista 3–4-mestna branja) -------------------------
            bp = re.sub(r'[^\d]', '', str(b.get('parz') or ''))
            exp = PARZ0[pg] + k
            if pg == 50 and k == 20:
                exp = None  # Fürtrag pas — '48'
            if len(bp) in (3, 4) and exp is not None:
                entry['parz_verdict'] = 'EXACT' if int(bp) == exp else f'MISMATCH[{bp}|{exp}]'
            # --- crossout ----------------------------------------------------
            anm = (reg.get('anmerkung') or '').lower()
            reg_cross = any(w in anm for w in ('prečrtan', 'precrzan', 'preklican'))
            if b.get('crossout') and reg_cross:
                entry['cross_verdict'] = 'AGREE'
            elif b.get('crossout') or reg_cross:
                entry['cross_verdict'] = 'DIFF'
            out.append(entry)

    # statistika
    for e in out:
        v = e.get('verdict')
        if v is None:
            for f in ('name_verdict', 'haus_verdict', 'kl_verdict', 'parz_verdict', 'cross_verdict'):
                if f in e:
                    stats[f][e[f].split('[')[0]] += 1
        else:
            stats['row'][v] += 1

    res = {'sample_pages': PAGES, 'rows_total': len(out), 'entries': out,
           'stats': {k: dict(v) for k, v in stats.items()}}
    with open(f'{BASE}/val120-oci2/comparison.json', 'w') as fh:
        json.dump(res, fh, ensure_ascii=False, indent=1)

    # izpis
    print('rows:', len(out))
    for f in ('name_verdict', 'haus_verdict', 'kl_verdict', 'parz_verdict', 'cross_verdict'):
        print(f, dict(stats[f]))
    print()
    print('--- MISMATCH imena ---')
    for e in out:
        if e.get('name_verdict', '').startswith('MISMATCH'):
            print('p%d r%-2d reg=%-28s blind=%-28s sim=%s' % (
                e['page'], e['r'], e['reg_owner'][:28],
                (e.get('blind', {}).get('name') or '')[:28], e.get('name_sim')))
    print()
    print('--- kl MISMATCH/VARIANT ---')
    for e in out:
        if e.get('kl_verdict') in ('MISMATCH', 'MISMATCH_EMPTY', 'VARIANT_DIGIT'):
            print('p%d r%-2d reg=%-6s blind=%-6s %s' % (
                e['page'], e['r'], e['reg_kl'], e.get('kl_values', [None, None])[0],
                e['kl_verdict']))
    print()
    print('--- haus MISMATCH ---')
    for e in out:
        if e.get('haus_verdict') == 'MISMATCH':
            print('p%d r%-2d reg=%-4s blind=%-4s' % (
                e['page'], e['r'], e['reg_haus'], e.get('blind', {}).get('haus')))


if __name__ == '__main__':
    main()
