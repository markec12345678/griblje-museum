#!/usr/bin/env python3
"""Val 85 — PS N83 PASOVNI/ZOOM re-read — PILOT: KOLONSKI TRAKOVI (faza R) — deterministična
primerjava pass1 (val 82) × pass2 (val 83) × kolonski trak (val 85, x2.5, merska sidra).

Zakaj trakovi in ne pasovi (verdikt pilota, merjeno):
- horizontalni pasovi (faza A): VLM razbija vrstice na reznih robovih → štetje vrstic
  nestabilno (172 zlito vs 144 realnih na vzorcu) → sekvenčna poravnava neuporabna.
- vertikalni kolonski trakovi (faza R): 20–22 vnosov/stran (≈ realnih 19–21), dvostropični
  kultur opisi ohranjeni z \n, **stolpčna dodelitev Jaethe↔Klafter rešena s sidri** (VLM
  vidi omejen stolpci trak → vrednost v pravem stolpcu).

Poravnava: indeksna (zgornja→spodnja), štetja dokumentirana; vnos z row_cut=true na dnu
 trakova = rezni artefakt, če ga pass vrstica ne pokrije → dokumentiran, ni kaznovan.

Izhod: research-griblje/ps-n83/band-v85/compare-strips-v85.json (COMMITTED).
§22: register.json / KG / story_id NESPREMENJENI — pilot meri metodo.
"""
import json, os, re, collections

REPO = '/home/z/griblje-museum'
P1 = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2 = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
BAND_DIR = f'{REPO}/research-griblje/raw-web-val85-2026-10'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v85'
SAMPLE = [58, 59, 84, 98, 109, 121, 133]  # p143 = rdeči povzetek, brez trakov

def norm(v):
    if v is None: return ''
    return re.sub(r'\s+', ' ', str(v).strip()).strip()

def numeq(v):
    s = norm(v)
    s = re.sub(r'\[(col\?|angeschnitten|rot|gestrichen[^\]]*|X)\]', '', s)
    return re.sub(r'\D', '', s)

def first_token(v):
    s = norm(v).replace('\n', ' ').lower()
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
        else:
            prev = name
            row['name_resolved'] = name
        out.append(row)
    return out

# ---------- GUARDS ----------
reg = json.load(open(f'{REPO}/research-griblje/ps-n83/register.json'))
assert len(reg) == 2871, 'guard: register 2871'
for pg in SAMPLE:
    for d, tag in ((P1, 'pass1'), (P2, 'pass2')):
        j = json.load(open(f'{d}/p{pg:03d}.json'))
        assert 'ERROR' not in j, f'guard: {tag} p{pg:03d}'
    for strip in ('name', 'kultur'):
        f = f'{BAND_DIR}/vlm/p{pg:03d}-z-{strip}-R.json'
        assert os.path.exists(f), f'guard: manjka {f}'
        j = json.load(open(f))
        assert 'ERROR' not in j, f'guard: trak p{pg:03d}-{strip} ERROR'

FIELDS_NAME = ['name_raw', 'surname', 'stand', 'wohnort']
FIELDS_KULTUR = ['kultur_first', 'kultur', 'jaethe', 'klafter']

def agree(field, va, vb):
    if field in ('jaethe', 'klafter'):
        return numeq(va) == numeq(vb) and numeq(va) != ''
    if field == 'kultur':
        return norm(va).replace('\n', ' ') == norm(vb).replace('\n', ' ') and norm(va) != ''
    return norm(va) == norm(vb) and norm(va) != ''

stats = {f: {'p1_p2': 0, 'p1_t': 0, 'p2_t': 0, 'three': 0, 'total': 0} for f in FIELDS_NAME + FIELDS_KULTUR}
tie = collections.Counter()
pages_out = []
verdict = []

for pg in SAMPLE:
    d1 = json.load(open(f'{P1}/p{pg:03d}.json'))
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    tn = json.load(open(f'{BAND_DIR}/vlm/p{pg:03d}-z-name-R.json'))
    tk = json.load(open(f'{BAND_DIR}/vlm/p{pg:03d}-z-kultur-R.json'))
    r1, r2 = resolve_dittos(d1.get('rows', [])), resolve_dittos(d2.get('rows', []))
    strip_n = resolve_dittos(tn.get('rows', []))
    strip_k = tk.get('rows', [])
    n1, n2, nn, nk = len(r1), len(r2), len(strip_n), len(strip_k)
    nmin = min(n1, n2, nn)
    kmin = min(n1, n2, nk)
    page = {'page': pg, 'rows1': n1, 'rows2': n2, 'strip_name_n': nn, 'strip_kultur_n': nk,
            'count_delta': {'name': nn - n1, 'kultur': nk - n1}}
    pf = collections.Counter()
    for i in range(nmin):
        a, b, t = r1[i], r2[i], strip_n[i]
        for f in FIELDS_NAME:
            if f == 'name_raw':
                va, vb, vc = a['name_raw'], b['name_raw'], t['name_raw']
            elif f == 'surname':
                va = surname_token(a.get('name_resolved') or a['name_raw'])
                vb = surname_token(b.get('name_resolved') or b['name_raw'])
                vc = surname_token(t.get('name_resolved') or t['name_raw'])
            else:
                va, vb, vc = a.get(f), b.get(f), t.get(f)
            st = stats[f]; st['total'] += 1; pf[f'{f}_total'] += 1
            if agree(f, va, vb): st['p1_p2'] += 1; pf[f'{f}_p1_p2'] += 1
            if agree(f, va, vc): st['p1_t'] += 1; pf[f'{f}_p1_t'] += 1
            if agree(f, vb, vc): st['p2_t'] += 1; pf[f'{f}_p2_t'] += 1
            if agree(f, va, vb) and agree(f, va, vc): st['three'] += 1; pf[f'{f}_three'] += 1
            if not agree(f, va, vb):
                tie['total'] += 1
                if agree(f, va, vc) and agree(f, vb, vc): pass
                elif agree(f, va, vc): tie['track_p1'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_p1', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
                elif agree(f, vb, vc): tie['track_p2'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_p2', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
                elif not norm(vc): tie['track_empty'] += 1
                else: tie['track_third'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_third', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
    for i in range(kmin):
        a, b, t = r1[i], r2[i], strip_k[i]
        for f in FIELDS_KULTUR:
            if f == 'kultur_first':
                va, vb, vc = first_token(a.get('kultur')), first_token(b.get('kultur')), first_token(t.get('kultur'))
            elif f == 'kultur':
                va, vb, vc = a.get('kultur'), b.get('kultur'), t.get('kultur')
            else:
                va, vb, vc = a.get(f), b.get(f), t.get(f)
            st = stats[f]; st['total'] += 1; pf[f'{f}_total'] += 1
            if agree(f, va, vb): st['p1_p2'] += 1; pf[f'{f}_p1_p2'] += 1
            if agree(f, va, vc): st['p1_t'] += 1; pf[f'{f}_p1_t'] += 1
            if agree(f, vb, vc): st['p2_t'] += 1; pf[f'{f}_p2_t'] += 1
            if agree(f, va, vb) and agree(f, va, vc): st['three'] += 1; pf[f'{f}_three'] += 1
            if not agree(f, va, vb) and f in ('jaethe', 'klafter', 'kultur_first'):
                tie['total'] += 1
                if agree(f, va, vc) and agree(f, vb, vc): pass
                elif agree(f, va, vc): tie['track_p1'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_p1', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
                elif agree(f, vb, vc): tie['track_p2'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_p2', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
                elif not norm(vc) and not numeq(vc): tie['track_empty'] += 1
                else: tie['track_third'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'track_third', 'p1': norm(va), 'p2': norm(vb), 'track': norm(vc)})
    # stolpčna dodelitev (kolonsko sidro): trak J/K razporeditev vs pass — koliko vrst ima
    # trak BOTH polja != pas BOTH polja
    jk_track = collections.Counter()
    for i in range(kmin):
        t = strip_k[i]
        if numeq(t.get('jaethe')) and numeq(t.get('klafter')): jk_track['both'] += 1
        elif numeq(t.get('jaethe')): jk_track['only_j'] += 1
        elif numeq(t.get('klafter')): jk_track['only_k'] += 1
        else: jk_track['none'] += 1
    page['fields'] = dict(sorted(pf.items()))
    page['jk_distribution_track'] = dict(jk_track)
    pages_out.append(page)

summary = {
    'sample': SAMPLE,
    'method': 'kolonski trakovi x2.5 (merska sidra, celotna višina) vs celostranski pass1/pass2; indeksna poravnava (zgornja→spodnja)',
    'fields': {f: {k: (round(v / st['total'] * 100, 1) if st['total'] else 0.0) for k, v in st.items() if k != 'total'} | {'total': st['total']} for f, st in stats.items()},
    'tiebreak_3rd_voice': dict(tie),
}
os.makedirs(OUTD, exist_ok=True)
out = {'meta': {'val': 85, 'generated_by': 'build-compare-strips-v85.py'}, 'summary': summary, 'pages': pages_out, 'verdict_rows': verdict}
with open(f'{OUTD}/compare-strips-v85.json', 'w') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)

print('=== VAL 85 — KOLONSKI TRAKOVI (faza R) vs pass1/pass2 ===')
for f, st in stats.items():
    if st['total'] == 0: continue
    pct = lambda k: round(st[k] / st['total'] * 100, 1)
    print(f"  {f:12s} p1×p2={pct('p1_p2'):5.1f}  p1×trak={pct('p1_t'):5.1f}  p2×trak={pct('p2_t'):5.1f}  3-glas={pct('three'):5.1f}  (n={st['total']})")
print('3. glas pri kolizijah:', dict(tie))
