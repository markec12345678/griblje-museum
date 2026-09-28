#!/usr/bin/env python3
"""Val 86 — PS N83 KOLONSKI TILE-i (kompozitni, z glavo) — deterministična primerjava
pass1 (val 82) × pass2 (val 83) × tile-i (val 86, x2 + glava stolpcev).

Vhod:
  research-griblje/raw-web-val82-2026-10/ps-vlm/pNNN.json   (pass1 — celostranski nativni prehod)
  research-griblje/raw-web-val83-2026-10/ps-vlm/pNNN.json   (pass2 — neodvisni re-read)
  research-griblje/raw-web-val86-2026-10/vlm-v86/pNNN-t-{name,kultur}{0..3}-T.json (3. glas)
  research-griblje/ps-n83/register.json (guard: 2.871 vrstic)
Izhod:
  research-griblje/ps-n83/band-v86/compare-tiles-v86.json (COMMITTED)

Zlivanje tile-ov po strani: 4 kompozitni pasovi (h=328, 30 px preklop) → dedupe
vrstic na rezih (row_cut vrstica, ki jo naslednji pas ponovi po enakem kultur+numeq
oz. haus_no+name) — logika VERBATIM build-compare-v85.py merge_bands, prilagojena
kolonskim skupinam (brez no_blatt v kultur tile-u).

Metodološki verdikt val 85 (F-PV-05): enotne vrednosti piše pisar v stolpec Quad.
Kläther — pass1/pass2 ju sistemsko vpisujeta v Jaethe. Val 86 tile-i (z glavo)
 Validirano na pilotu p058/p121: only_j = 0 (prej brez glave: 9/20 napak).

§22: register.json / KG / story_id v TEM skripti NESPREMENJENI — ta skripta meri
in dokumentira; vgradnja je ločena (build-register-v86.py).
"""
import json, os, re, collections

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
P1 = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2 = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
TDIR = f'{REPO}/research-griblje/raw-web-val86-2026-10'
OUTD = f'{REPO}/research-griblje/ps-n83/band-v86'
PAGES = list(range(56, 143))  # p143 izpuščen (rdeči povzetek, precedens val 85 faza R)
BANDS = 4

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

# ---------- tile merge: 4 pasovi → 1 sekvenca (dedupe reznih vrstic) ----------
def merge_tiles(pg, group):
    # stran uporabna SAMO z vsemi BANDS pasovi (delna pokritost = premik indeksov)
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        if not os.path.exists(f): return [], [None] * BANDS, []
        j = json.load(open(f))
        if 'ERROR' in j: return [], [f'ERROR:{j["ERROR"][:60]}'] * BANDS, []
    rows, per_band, skipped = [], [], []
    for b in range(BANDS):
        f = f'{TDIR}/vlm-v86/p{pg:03d}-t-{group}{b}-T.json'
        j = json.load(open(f))
        rr = j.get('rows', [])
        per_band.append(len(rr))
        for r in rr:
            row = dict(r)
            row['band'] = b
            rows.append(row)
    # dedupe: row_cut vrstica na koncu pasu, ki jo naslednji pas ponovi
    merged = []
    for i, r in enumerate(rows):
        if not r.get('row_cut'):
            merged.append(r); continue
        nxt = rows[i + 1] if i + 1 < len(rows) else None
        if nxt and nxt['band'] == r['band'] + 1:
            if group == 'kultur':
                same = (first_token(r.get('kultur')) == first_token(nxt.get('kultur'))
                        and first_token(r.get('kultur')) != ''
                        and numeq(r.get('jaethe') or r.get('klafter')) == numeq(nxt.get('jaethe') or nxt.get('klafter')))
            else:
                same = (norm(r.get('name_raw')) == norm(nxt.get('name_raw'))
                        or (norm(r.get('haus_no')) and norm(r.get('haus_no')) == norm(nxt.get('haus_no'))))
            if same:
                skipped.append({'band': r['band'], 'row_cut': True, 'merged_into_next': True})
                continue
        merged.append(r)
    return merged, per_band, skipped

FIELDS_NAME = ['name_raw', 'surname', 'stand', 'wohnort']
FIELDS_KULTUR = ['kultur_first', 'kultur', 'jaethe', 'klafter']

def agree(field, va, vb):
    if field in ('jaethe', 'klafter'):
        return numeq(va) == numeq(vb) and numeq(va) != ''
    if field == 'kultur':
        return norm(va).replace('\n', ' ') == norm(vb).replace('\n', ' ') and norm(va) != ''
    return norm(va) == norm(vb) and norm(va) != ''

# ---------- GUARDS ----------
reg = json.load(open(f'{REPO}/research-griblje/ps-n83/register.json'))
assert len(reg) == 2871, 'guard: register 2871'
for pg in PAGES:
    for d, tag in ((P1, 'pass1'), (P2, 'pass2')):
        j = json.load(open(f'{d}/p{pg:03d}.json'))
        assert 'ERROR' not in j, f'guard: {tag} p{pg:03d}'

stats = {f: {'p1_p2': 0, 'p1_t': 0, 'p2_t': 0, 'three': 0, 'total': 0} for f in FIELDS_NAME + FIELDS_KULTUR}
tie = collections.Counter()
verdict = []
pages_out = []
fuertrag = []
missing_tiles = collections.Counter()

for pg in PAGES:
    d1 = json.load(open(f'{P1}/p{pg:03d}.json'))
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    r1, r2 = resolve_dittos(d1.get('rows', [])), resolve_dittos(d2.get('rows', []))
    tiles_n = resolve_dittos(merge_tiles(pg, 'name')[0])
    tiles_k, per_k, skip_k = merge_tiles(pg, 'kultur')
    if not tiles_k: missing_tiles['kultur'] += 1
    if not tiles_n: missing_tiles['name'] += 1
    n1, n2, nn, nk = len(r1), len(r2), len(tiles_n), len(tiles_k)
    page = {'page': pg, 'rows1': n1, 'rows2': n2, 'tiles_name_n': nn, 'tiles_kultur_n': nk,
            'per_band_kultur': per_k, 'dedupe_kultur': len(skip_k),
            'count_delta': {'name': nn - n1, 'kultur': nk - n1}}
    pf = collections.Counter()
    # KULTUR skupina (jedro val 86: jaethe/klafter + kultur)
    kmin = min(n1, n2, nk)
    for i in range(kmin):
        a, b, t = r1[i], r2[i], tiles_k[i]
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
                elif agree(f, va, vc): tie['tile_p1'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'tile_p1', 'p1': norm(va), 'p2': norm(vb), 'tile': norm(vc).replace('\n', ' ')})
                elif agree(f, vb, vc): tie['tile_p2'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'tile_p2', 'p1': norm(va), 'p2': norm(vb), 'tile': norm(vc).replace('\n', ' ')})
                elif not norm(vc) and not numeq(vc): tie['tile_empty'] += 1
                else: tie['tile_third'] += 1; verdict.append({'page': pg, 'row': i, 'field': f, 'voice': 'tile_third', 'p1': norm(va), 'p2': norm(vb), 'tile': norm(vc).replace('\n', ' ')})
    # NAME skupina (samo če tile-i obstajajo — faza N je opcijska glede na kvoto)
    if nn:
        nmin = min(n1, n2, nn)
        for i in range(nmin):
            a, b, t = r1[i], r2[i], tiles_n[i]
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
    # J/K razporeditev (kolonsko sidro z glavo) + Fürtrag
    jk = collections.Counter()
    for t in tiles_k:
        if numeq(t.get('jaethe')) and numeq(t.get('klafter')): jk['both'] += 1
        elif numeq(t.get('jaethe')): jk['only_j'] += 1
        elif numeq(t.get('klafter')): jk['only_k'] += 1
        else: jk['none'] += 1
    page['jk_distribution_tiles'] = dict(jk)
    for t in tiles_k:
        for tt in (t.get('totals') or []):
            if norm(tt.get('value')):
                fuertrag.append({'page': pg, 'band': t.get('band'), 'label': norm(tt.get('label')), 'value': norm(tt.get('value')), 'voice': 'tile'})
    # Fürtrag kandidati iz tile vrstic: brez kultur (oz. label beseda) + vsaj ena številka;
    # vrednosti pišarja pogosto združene v enem polju ('6 1169') — F11, REVIEW Raven
    FUR_LABELS = ('', 'furtrag', 'fürtrag', 'ftirtrag', 'ftirtrag.', 'summa', 'vortrag')
    for t in tiles_k:
        kl = norm(t.get('klafter') or '')
        je = norm(t.get('jaethe') or '')
        kul = first_token(t.get('kultur'))
        nums = re.findall(r'\d+', kl + ' ' + je)
        if kul in FUR_LABELS and (nums or (numeq(je) and numeq(kl))):
            fuertrag.append({'page': pg, 'band': t.get('band'), 'label': norm(t.get('kultur')) or '(brez)', 'value': (je + ' ' + kl).strip(), 'voice': 'tile_row'})
    for d, tag in ((d1, 'p1'), (d2, 'p2')):
        for r in d.get('rows', []):
            pass
    for dd, tag in ((d1, 'p1'), (d2, 'p2')):
        for tt in (dd.get('totals') or []):
            if norm(tt.get('value')):
                fuertrag.append({'page': pg, 'label': norm(tt.get('label')), 'value': norm(tt.get('value')), 'voice': tag})
    pages_out.append(page)

summary = {
    'pages': f'{PAGES[0]}-{PAGES[-1]} ({len(PAGES)})',
    'method': 'kompozitni kolonski tile-i (glava + h=328, x2) — 3. glas; zlivanje 4 pasov z dedupe rezov; indeksna poravnava (zgornja→spodnja)',
    'fields': {f: {k: (round(v / st['total'] * 100, 1) if st['total'] else 0.0) for k, v in st.items() if k != 'total'} | {'total': st['total']} for f, st in stats.items()},
    'tiebreak_3rd_voice': dict(tie),
    'missing_tiles': dict(missing_tiles),
}
os.makedirs(OUTD, exist_ok=True)
out = {'meta': {'val': 86, 'generated_by': 'build-compare-tiles-v86.py'}, 'summary': summary, 'pages': pages_out, 'verdict_rows': verdict, 'fuertrag': fuertrag}
with open(f'{OUTD}/compare-tiles-v86.json', 'w') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)

print('=== VAL 86 — KOLONSKI TILE-i (z glavo) vs pass1/pass2 ===')
for f, st in stats.items():
    if st['total'] == 0: continue
    pct = lambda k: round(st[k] / st['total'] * 100, 1)
    print(f"  {f:12s} p1×p2={pct('p1_p2'):5.1f}  p1×tile={pct('p1_t'):5.1f}  p2×tile={pct('p2_t'):5.1f}  3-glas={pct('three'):5.1f}  (n={st['total']})")
print('3. glas pri kolizijah:', dict(tie))
print('Fürtrag vnosov:', len(fuertrag), '| strani brez tile-ov:', dict(missing_tiles))
