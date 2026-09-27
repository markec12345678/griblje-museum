#!/usr/bin/env python3
"""Val 85 — PS N83 PASOVNI/ZOOM re-read s kolonskimi sidri — PILOT: deterministična
troje-glasovna primerjava pass1 (val 82, celostransko) × pass2 (val 83, celostransko) ×
pasovna branja (val 85, 4 pasovi/stran @nativno) na 8 straneh vzorca.

Vzorec (determinističen, iz comittanega reread-v83/comparison.json):
  kvantili full_agree/rows1 po straneh (0/25/50/75/100) + p98 (F-PV-03 Reb)
  + p121 (QKlft anomalija J=1725) + p59 (najslabše ime soglasje pass1↔pass2)
  = [58, 59, 84, 98, 109, 121, 133, 143]

Metodologija (§4 poštenost):
- poravnava vrstic = sekvenčni zip (IDENTNO val 83); dodatna robustnost: poravnava po
  no_blatt (numeq) kot ločena metrika — odstopanje se dokumentira, ne ugiba.
- pasovne vrstice = zlitje 4 pasov/stran po zaporedju pasov (y naraščajoče); vrstica z
  row_cut=true, ki jo naslednji pas ponovi (isti no_blatt numeq), se zlije (deterministično).
- polja: name_raw EXACT + priimek (zadnji žeton), kultur EXACT + first-token,
  numerika numeq ('+ 56'≡'+56'; ' [col?]'/'[angeschnitten]'标记i se odstranijo v numeq),
  no_blatt/stand/wohnort EXACT. Ditto imena se razrešijo enako kot v83 (~ veriga).
- Fürtrag/totals: primerjava totals verige pass1 × pass2 × pas (F11).
- kolizije: za vrstice, kjer pass1≠pass2 po polju → pas kot odločujoči 3. glas:
  band==p1 | band==p2 | band==oba_ne (tretja vrednost) | pas neodločen (prazno/[?]).

§22: register.json / KG / story_id se NE spreminjajo — pilot samo meri metodo.
Izhod: research-griblje/ps-n83/band-v85/compare-v85.json (COMMITTED).
"""
import json, os, re, collections

REPO = '/home/z/griblje-museum'
P1 = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2 = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
BAND_DIR = f'{REPO}/research-griblje/raw-web-val85-2026-10'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v85'
SAMPLE = [58, 59, 84, 98, 109, 121, 133, 143]

NUMERIC = {'jaethe', 'klafter', 'ertrag_fl', 'ertrag_kr', 'capital_fl', 'capital_kr'}
FIELDS = ['no_blatt', 'haus_no', 'name_raw', 'surname', 'stand', 'wohnort', 'kultur',
          'kultur_first', 'jaethe', 'klafter', 'classe', 'ertrag_fl', 'ertrag_kr',
          'capital_fl', 'capital_kr']

# ---------- GUARDS (fail-fast) ----------
reg = json.load(open(f'{REPO}/research-griblje/ps-n83/register.json'))
assert len(reg) == 2871, f'guard: register {len(reg)} != 2871'
man = json.load(open(f'{BAND_DIR}/crops-manifest-v85.json'))
assert [p['page'] for p in man['pages']] == SAMPLE, 'guard: manifest vzorec'
for pg in SAMPLE:
    for d, tag in ((P1, 'pass1'), (P2, 'pass2')):
        j = json.load(open(f'{d}/p{pg:03d}.json'))
        assert 'ERROR' not in j, f'guard: {tag} p{pg:03d} ERROR'

# ---------- pomožne (norm/nomeq identno v83) ----------
def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()

def numeq(v):
    return re.sub(r'\D', '', norm(v))

def first_token(v):
    s = norm(v).lower()
    m = re.match(r'[a-zäöüß]+', s)
    return m.group(0) if m else ''

def surname_token(v):
    s = norm(v).replace('~', '')
    toks = [t for t in re.split(r'[\s,]+', s) if t]
    return toks[-1] if toks else ''

def resolve_dittos(rows):
    out, prev = [], None
    for r in rows:
        name = (r.get('name') or '').strip()
        row = dict(r)
        row['name_raw'] = name
        if name == '~' or name in (',,', 'de.', 'dito', 'idem'):
            row['name_resolved'] = prev
            row['was_ditto'] = True
        else:
            prev = name
            row['name_resolved'] = name
            row['was_ditto'] = False
        out.append(row)
    return out

def strip_marks(v):
    """numeq vir: odstrani merjitve [col?] [angeschnitten] [rot] [gestrichen] — števke ostanejo."""
    s = norm(v)
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return s

def numq(v):
    return numeq(strip_marks(v))

# ---------- zlitje pasovnih vrstic po strani ----------
def merge_bands(pg):
    page_man = next(p for p in man['pages'] if p['page'] == pg)
    rows, totals, per_band = [], [], []
    for b in page_man['bands']:
        cell = b['cell']
        f = f'{BAND_DIR}/vlm/{cell}-A.json'
        assert os.path.exists(f), f'guard: manjka {f}'
        j = json.load(open(f))
        assert 'ERROR' not in j, f'guard: {cell} ERROR'
        rows.extend(j.get('rows') or [])
        totals.extend((j.get('totals') or []))
        per_band.append({'cell': cell, 'rows': len(j.get('rows') or []), 'totals': len(j.get('totals') or [])})
    # dedup: row_cut vrstica, ki jo naslednja vrstica ponovi po no_blatt (numeq) → zlij
    merged, skipped = [], []
    i = 0
    while i < len(rows):
        r = rows[i]
        cut = bool(r.get('row_cut'))
        if cut and i + 1 < len(rows):
            nxt = rows[i + 1]
            nb_r, nb_n = numq(r.get('no_blatt')), numq(nxt.get('no_blatt'))
            hn_r, hn_n = numq(r.get('haus_no')), numq(nxt.get('haus_no'))
            if nb_r and nb_n and nb_r == nb_n:
                skipped.append({'cell': r.get('no_blatt'), 'merged_into_next': True})
                i += 1
                continue
            if (not nb_r or not nb_n) and hn_r and hn_n and hn_r == hn_n:
                skipped.append({'cell': r.get('haus_no'), 'merged_into_next': True})
                i += 1
                continue
        merged.append(r)
        i += 1
    return resolve_dittos(merged), totals, per_band, skipped

# ---------- metrike ----------
def field_cmp(va, vb, field):
    if field in ('jaethe', 'klafter'):
        return numq(va) == numq(vb) and numq(va) != ''
    if field in ('ertrag_fl', 'ertrag_kr', 'capital_fl', 'capital_kr'):
        return numq(va) == numq(vb) and numq(va) != ''
    return norm(va) == norm(vb) and norm(va) != ''

pages_out = []
g = collections.Counter()
field_stats = {f: {'pair12': 0, 'pair1b': 0, 'pair2b': 0, 'three': 0, 'total': 0} for f in FIELDS}
tiebreak = {'band_p1': 0, 'band_p2': 0, 'band_third': 0, 'band_empty': 0, 'total': 0}
no_blatt_align = {'seq': 0, 'by_nb': 0, 'total': 0}
totals_rows = []
verdict_rows = []

for pg in SAMPLE:
    d1 = json.load(open(f'{P1}/p{pg:03d}.json'))
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    r1, r2 = resolve_dittos(d1.get('rows', [])), resolve_dittos(d2.get('rows', []))
    rb, tb, per_band, skipped = merge_bands(pg)
    n1, n2, nb = len(r1), len(r2), len(rb)
    page = {'page': pg, 'rows1': n1, 'rows2': n2, 'rows_band': nb,
            'rowcount_p1_eq_band': n1 == nb, 'rowcount_p2_eq_band': n2 == nb,
            'band_skipped_cuts': skipped, 'per_band': per_band, 'fields': {}}
    g['rows1'] += n1; g['rows2'] += n2; g['rows_band'] += nb
    if n1 == nb: g['p1_eq_band_pages'] += 1
    if n2 == nb: g['p2_eq_band_pages'] += 1

    nmin = min(n1, n2, nb)
    page_f = collections.Counter()
    ties = {'band_p1': 0, 'band_p2': 0, 'band_third': 0, 'band_empty': 0}
    for i in range(nmin):
        a, b, c = r1[i], r2[i], rb[i]
        # poravnava po no_blatt (robustnost)
        if numq(a.get('no_blatt')) and numq(a.get('no_blatt')) == numq(c.get('no_blatt')):
            no_blatt_align['by_nb'] += 1
        no_blatt_align['total'] += 1
        row_verdict = {'row': i, 'no_blatt_band': numq(c.get('no_blatt')), 'fields': {}}
        for f in FIELDS:
            if f == 'name_raw':
                va, vb, vc = a['name_raw'], b['name_raw'], c['name_raw']
            elif f == 'surname':
                va = surname_token(a.get('name_resolved') or a['name_raw'])
                vb = surname_token(b.get('name_resolved') or b['name_raw'])
                vc = surname_token(c.get('name_resolved') or c['name_raw'])
            elif f == 'kultur_first':
                va, vb, vc = first_token(a.get('kultur')), first_token(b.get('kultur')), first_token(c.get('kultur'))
            else:
                va, vb, vc = a.get(f), b.get(f), c.get(f)
            ok12 = field_cmp(va, vb, f)
            ok1b = field_cmp(va, vc, f)
            ok2b = field_cmp(vb, vc, f)
            st = field_stats[f]
            st['total'] += 1
            page_f[f'{f}_total'] += 1
            if ok12: st['pair12'] += 1; page_f[f'{f}_pair12'] += 1
            if ok1b: st['pair1b'] += 1; page_f[f'{f}_pair1b'] += 1
            if ok2b: st['pair2b'] += 1; page_f[f'{f}_pair2b'] += 1
            if ok12 and ok1b: st['three'] += 1; page_f[f'{f}_three'] += 1
            # pas kot odločujoči 3. glas pri koliziji pass1≠pass2
            if f in ('name_raw', 'surname', 'kultur', 'kultur_first', 'jaethe', 'klafter') and not ok12:
                tiebreak['total'] += 1
                if field_cmp(va, vc, f) and field_cmp(vb, vc, f):
                    ties['band_p1'] += 1; ties['band_p2'] += 1  # p1≡p2 tu nemogoče, varnost
                elif field_cmp(va, vc, f):
                    ties['band_p1'] += 1; row_verdict['fields'][f] = 'band_p1'
                elif field_cmp(vb, vc, f):
                    ties['band_p2'] += 1; row_verdict['fields'][f] = 'band_p2'
                elif not norm(strip_marks(vc)) and not numq(vc):
                    ties['band_empty'] += 1; row_verdict['fields'][f] = 'band_empty'
                else:
                    ties['band_third'] += 1; row_verdict['fields'][f] = 'band_third'
        if row_verdict['fields']:
            verdict_rows.append({'page': pg, **row_verdict})
    page['fields'] = {k: v for k, v in sorted(page_f.items())}
    page['tiebreak'] = ties
    for k in ties: g[f'tb_{k}'] += ties[k]
    g['tiebreak_total'] += tiebreak['total']; tiebreak['total'] = 0

    # Fürtrag/totals veriga (F11)
    t1, t2 = d1.get('totals') or [], d2.get('totals') or []
    trow = {'page': pg, 'pass1': [f"{norm(t.get('label'))}={norm(t.get('value'))}" for t in t1],
            'pass2': [f"{norm(t.get('label'))}={norm(t.get('value'))}" for t in t2],
            'band': [f"{norm(t.get('label'))}={norm(t.get('value'))}" for t in tb]}
    trow['p1_eq_p2'] = trow['pass1'] == trow['pass2']
    trow['band_eq_p1'] = trow['band'] == trow['pass1']
    trow['band_eq_p2'] = trow['band'] == trow['pass2']
    totals_rows.append(trow)

    pages_out.append(page)

# ---------- povzetek ----------
summary = {
    'sample': SAMPLE,
    'method': 'troje-glasovna: pass1 (v82 celostransko) x pass2 (v83 celostransko) x pasovi (v85, 4/stran @nativno); poravnava sekvenčni zip (identno v83)',
    'rows': {'pass1': g['rows1'], 'pass2': g['rows2'], 'band': g['rows_band'],
             'p1_eq_band_pages': g['p1_eq_band_pages'], 'p2_eq_band_pages': g['p2_eq_band_pages']},
    'no_blatt_alignment': {'rows_total': no_blatt_align['total'], 'band_nb_match': no_blatt_align['by_nb']},
    'fields': {f: {k: (round(v / st['total'] * 100, 2) if st['total'] else 0.0) for k, v in st.items() if k != 'total'} | {'total': st['total']} for f, st in field_stats.items()},
    'tiebreak_3rd_voice': {'total': g['tiebreak_total'], 'band_p1': g['tb_band_p1'], 'band_p2': g['tb_band_p2'],
                           'band_third': g['tb_band_third'], 'band_empty': g['tb_band_empty']},
    'totals_chain': totals_rows,
}

os.makedirs(OUTD, exist_ok=True)
out = {'meta': {'val': 85, 'generated_by': 'build-compare-v85.py', 'sample_rule': 'kvantili full_agree/rows1 (reread-v83/comparison.json) + p98 + p121 + p59'}, 'summary': summary, 'pages': pages_out, 'verdict_rows': verdict_rows}
with open(f'{OUTD}/compare-v85.json', 'w') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)

print('=== VAL 85 PILOT — troje-glasovna primerjava ===')
print(f"vrstice: pass1={g['rows1']} pass2={g['rows2']} band={g['rows_band']}")
for f, st in field_stats.items():
    if st['total'] == 0: continue
    pct = lambda k: round(st[k] / st['total'] * 100, 1)
    print(f"  {f:12s} p1×p2={pct('pair12'):5.1f}  p1×pas={pct('pair1b'):5.1f}  p2×pas={pct('pair2b'):5.1f}  3-glas={pct('three'):5.1f}")
print(f"3. glas pri kolizijah: total={g['tiebreak_total']} → pas=p1: {g['tb_band_p1']}, pas=p2: {g['tb_band_p2']}, tretja vrednost: {g['tb_band_third']}, pas prazen: {g['tb_band_empty']}")
print(f"Fürtrag veriga: " + '; '.join(f"p{t['page']}: p1≡p2={t['p1_eq_p2']} pas≡p1={t['band_eq_p1']} pas≡p2={t['band_eq_p2']} | pas={t['band']}" for t in totals_rows))
