#!/usr/bin/env python3
"""Val 83 — PS N83 NEODVISEN RE-READ (2. prehod) p56–143: primerjava pass1 (val 82) vs
pass2 (val 83) — v2 metodologija.

v2 popravki (po 1. meritvi, dokumentirano):
- RAW ime (kot zapisano, vključno z ~) se primerja LOČENO od name_resolved — razrešitev
  dito verig ojača varianco (ena različna celica preklopi celoten blok imen).
- kultur: EXACT + FIRST-TOKEN nivo (val 82 odtis: VLM krajša dvovrstične opise; v2 meri
  tudi kategorije zamenjav Wiese↔Hutweide, Acker↔Wald).
- numerična polja: EXACT + NUMEQ (samo števke) — format artefakti ('+56' vs '+ 56').
- QKlft sane pravilo: jaethe > 2 števk in prazen klafter → številka je KLAFTER (znana
  pass1 anomalija p121 J='1725' brez K — val 82 reading_honesty).
- ROW-LEVEL: full_agree (13 polj EXACT) + QUANT-CONFIRMED = haus_no(numeq) ∧ jaethe(numeq)
  ∧ klafter(numeq) ∧ kultur(first-token) — kvantitativno hrbtenico per-parcelnih površin.

§4: soglasje ≥ 2 neodvisnih prehodov po POLJU/CELICI; kolizije = variant vrednosti
(field_v83), NIČ tiho popravljenih. Register.json/page-records.json BIT-PO-BIT.
"""
import json, os, re, collections

REPO = '/home/z/griblje-museum'
P1 = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
P2 = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'
OUTD = f'{REPO}/research-griblje/ps-n83/reread-v83'
FROM, TO = 56, 143

NUMERIC = {'jaethe', 'klafter', 'ertrag_fl', 'ertrag_kr', 'capital_fl', 'capital_kr'}
CORE = ['no_blatt', 'haus_no', 'name_raw', 'name_resolved', 'stand', 'wohnort', 'kultur',
        'jaethe', 'klafter', 'classe', 'ertrag_fl', 'ertrag_kr', 'capital_fl', 'capital_kr']

# ---------- GUARDS (fail-fast) ----------
reg = json.load(open(f'{REPO}/research-griblje/ps-n83/register.json'))
assert len(reg) == 2871, f'guard: register {len(reg)} != 2871'
new_reg = [r for r in reg if r['page'] > 55]
assert len(new_reg) == 1798, f'guard: p56–143 vrstice {len(new_reg)} != 1798'
assert all(r.get('reading_pass') == 'v82-native-pass1' for r in new_reg), 'guard: reading_pass spremenjen'
for pg in range(FROM, TO + 1):
    for d, tag in ((P1, 'pass1'), (P2, 'pass2')):
        f = f'{d}/p{pg:03d}.json'
        assert os.path.exists(f), f'guard: manjka {tag} p{pg:03d}'
        j = json.load(open(f))
        assert 'ERROR' not in j, f'guard: {tag} p{pg:03d} ima ERROR'


def norm(v):
    if v is None:
        return ''
    return re.sub(r'\s+', ' ', str(v).strip())


def numeq(v):
    """samo števke (format artefakti '+ 56' vs '+56' enakovredna)"""
    return re.sub(r'\D', '', norm(v))


def norm_nb(v):
    return '' if v is None else str(v).strip()


def first_token(v):
    s = norm(v).lower()
    m = re.match(r'[a-zäöüß]+', s)
    return m.group(0) if m else (s.split()[0].rstrip('.,;:') if s else '')


def resolve_dittos(rows):
    out, prev = [], ''
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
        out.append(row)
    return out


def parse_jk_sane(jaethe, klafter):
    """→ QKlft ali None. Sane: jaethe > 2 števk & brez klafterja → klafter (p121 anomalija)."""
    j, k = norm(jaethe), norm(klafter)
    jv = kv = 0
    if j:
        if '.' in j:
            parts = j.split('.')
            if not parts[0].isdigit() or not re.fullmatch(r'\d+', parts[1] if parts[1] else ''):
                if not re.fullmatch(r'\d+', (parts[1] or '')):
                    return None
            jv = int(parts[0]) if len(parts[0]) <= 2 else 0
            if not k:
                k = parts[1]
            if len(parts[0]) > 2:
                k = j  # celoten zapis = klafter
                jv = 0
        elif re.fullmatch(r'\d+', j):
            if len(j) <= 2:
                jv = int(j)
            elif not k:
                k = j
                jv = 0
            else:
                return None
        else:
            return None
    if k:
        if not re.fullmatch(r'\d+', k):
            return None
        if len(k) > 4:
            return None
        kv = int(k)
    if not j and not k:
        return None
    return jv * 1600 + kv


def has_reb(k):
    return bool(re.search(r'\breb|\bweing', k or '', re.IGNORECASE))


def has_wald(k):
    return bool(re.search(r'\bwald', k or '', re.IGNORECASE))


pages_out = []
conflicts_all = []
field_stats = {f: {'exact': 0, 'numeq': 0, 'total': 0} for f in CORE}
g = collections.Counter()
quant_confirmed = []
kultur_first_agree_rows = 0
reb_pass1_reproduced = []
qklft_p1_all = qklft_p1_pure = qklft_p2_all = qklft_p2_pure = 0
qklft_qc = 0
totals_chain = []

for pg in range(FROM, TO + 1):
    d1 = json.load(open(f'{P1}/p{pg:03d}.json'))
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    r1, r2 = resolve_dittos(d1.get('rows', [])), resolve_dittos(d2.get('rows', []))
    n1, n2 = len(r1), len(r2)
    page = {'page': pg, 'rows1': n1, 'rows2': n2, 'full_agree': 0, 'quant_confirmed': 0,
            'partial': 0, 'conflicts_high': 0, 'rowcount_mismatch': n1 != n2,
            'sheet_agree': norm(d1.get('sheet_visible')) == norm(d2.get('sheet_visible'))}
    g['rows1'] += n1
    g['rows2'] += n2
    if n1 != n2:
        g['rowcount_mismatch_pages'] += 1

    t1, t2 = d1.get('totals') or [], d2.get('totals') or []
    page['totals_p1_n'], page['totals_p2_n'] = len(t1), len(t2)
    for i in range(min(len(t1), len(t2))):
        agree = norm(t1[i].get('label')) == norm(t2[i].get('label')) and norm(t1[i].get('value')) == norm(t2[i].get('value'))
        totals_chain.append({'page': pg, 'idx': i, 'label_p1': t1[i].get('label', ''), 'value_p1': t1[i].get('value', ''),
                             'value_p2': t2[i].get('value', ''), 'agree': agree})
        g['totals_pairs'] += 1
        g['totals_agree' if agree else 'totals_conflicts'] += 1

    for i in range(min(n1, n2)):
        a, b = r1[i], r2[i]
        row_conf = []
        for f in CORE:
            get = norm_nb if f == 'no_blatt' else norm
            va, vb = get(a.get(f)), get(b.get(f))
            field_stats[f]['total'] += 1
            if va == vb:
                field_stats[f]['exact'] += 1
                field_stats[f]['numeq'] += 1
            elif f in NUMERIC and numeq(va) == numeq(vb) and numeq(va) != '':
                field_stats[f]['numeq'] += 1
                row_conf.append({'field': f, 'severity': 'format', 'pass1': va, 'pass2': vb})
                g['conflicts_format'] += 1
                continue
            else:
                sev = 'high' if f in NUMERIC or f == 'no_blatt' else 'medium'
                row_conf.append({'field': f, 'severity': sev, 'pass1': va, 'pass2': vb})
                g['conflicts_' + sev] += 1
        core_conf = [c for c in row_conf if c['field'] != 'name_resolved']
        if not core_conf and not (a['name_resolved'] != b['name_resolved']):
            page['full_agree'] += 1
            g['full_agree'] += 1
        else:
            page['partial'] += 1
            g['partial'] += 1
            if any(c['severity'] == 'high' for c in row_conf):
                page['conflicts_high'] += 1
                g['rows_conflict_high'] += 1
            conflicts_all.extend({'page': pg, 'row_idx': i, **c} for c in row_conf)
        # QUANT-CONFIRMED: identiteta + površina + kultur (numeq)
        if (numeq(a.get('haus_no')) == numeq(b.get('haus_no')) and numeq(a.get('jaethe')) == numeq(b.get('jaethe'))
                and numeq(a.get('klafter')) == numeq(b.get('klafter'))
                and first_token(a.get('kultur')) == first_token(b.get('kultur'))):
            page['quant_confirmed'] += 1
            g['quant_confirmed'] += 1
            ft = first_token(a.get('kultur'))
            q = parse_jk_sane(a.get('jaethe'), a.get('klafter'))
            if q is not None:
                qklft_qc += q
            row_qc = {'page': pg, 'row_idx': i, 'haus_no': numeq(a.get('haus_no')), 'kultur_first': ft,
                      'jaethe': norm(a.get('jaethe')), 'klafter': norm(a.get('klafter')), 'qklft': q}
            quant_confirmed.append(row_qc)
            if has_reb(a.get('kultur')):
                reb_pass1_reproduced.append({**row_qc, 'pass2_kultur': b.get('kultur', ''), 'pass2_reb': has_reb(b.get('kultur')) or 'reb' in first_token(b.get('kultur'))})
        if first_token(a.get('kultur')) == first_token(b.get('kultur')) and first_token(a.get('kultur')):
            g['kultur_first_agree'] += 1
            kultur_first_agree_rows += 1

    if n1 != n2:
        g['extra_rows_1'] += max(0, n1 - n2)
        g['extra_rows_2'] += max(0, n2 - n1)
    pages_out.append(page)

# ---------- Reb QKlft vsote (sane) per pass (neodvisno) ----------
for r in new_reg:
    if has_reb(r.get('kultur')):
        q = parse_jk_sane(r.get('jaethe'), r.get('klafter'))
        if q is not None:
            qklft_p1_all += q
            if norm(r.get('kultur')).strip().lower().rstrip(',') in ('reb', 'reben'):
                qklft_p1_pure += q
for pg in range(FROM, TO + 1):
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    for r in d2.get('rows', []):
        if has_reb(r.get('kultur')):
            q = parse_jk_sane(r.get('jaethe'), r.get('klafter'))
            if q is not None:
                qklft_p2_all += q
                if norm(r.get('kultur')).strip().lower().rstrip(',') in ('reb', 'reben'):
                    qklft_p2_pure += q

fa = {}
for f in CORE:
    st = field_stats[f]
    fa[f] = {'exact_pct': round(100 * st['exact'] / st['total'], 2) if st['total'] else None,
             'numeq_pct': round(100 * st['numeq'] / st['total'], 2) if st['total'] else None,
             'total': st['total']}

comparison = {
    'meta': {
        'title': 'PS N83 neodvisen re-read (2. prehod) p56–143 — primerjava pass1 (val 82) vs pass2 (val 83), v2 metodologija',
        'val': '83',
        'date': '2026-09-27',
        'pass1': 'raw-web-val82-2026-10/ps-vlm (v82-native-pass1, PROVISIONAL)',
        'pass2': 'raw-web-val83-2026-10/ps-vlm (v83-native-pass2, prompt VERBATIM val 57/82, 88 klicev, 0 napak, 0 retry)',
        'independence': 'prompt ne vsebuje ničesar iz pass1; svež klic = neodvisen glas (vzorec val 80)',
        'methodology_v2': [
            'name_raw (kot zapisano) ločeno od name_resolved — ditto razrešitev ojača varianco blokov',
            'kultur EXACT + first-token (val 82 odtis: dvovrstični opisi skrajšani)',
            'numerična polja EXACT + NUMEQ (format artefakti "+ 56" = "+56")',
            'QKlft sane: jaethe > 2 števk brez klafterja → klafter (znana pass1 anomalija p121)',
            'QUANT-CONFIRMED = haus_no ∧ jaethe ∧ klafter (numeq) ∧ kultur (first-token)',
        ],
        'matching': 'po indeksu znotraj strani; rowcount_mismatch flag; primerjava RAW obeh prehodov',
        'normalization': 'strip + zbijanje beline; numeq = samo števke',
        'honesty': 'kolizije = variant pass2 vrednosti (samo tukaj); NIČ tiho popravljenih; register/page-records bit-po-bit',
    },
    'global': {
        'pages_compared': TO - FROM + 1,
        'rows1_total': g['rows1'],
        'rows2_total': g['rows2'],
        'rowcount_mismatch_pages': g['rowcount_mismatch_pages'],
        'extra_rows_pass1': g['extra_rows_1'],
        'extra_rows_pass2': g['extra_rows_2'],
        'full_agree_rows': g['full_agree'],
        'partial_rows': g['partial'],
        'rows_conflict_high': g['rows_conflict_high'],
        'quant_confirmed_rows': g['quant_confirmed'],
        'quant_confirmed_qklft': qklft_qc,
        'conflicts_high': g['conflicts_high'],
        'conflicts_medium': g['conflicts_medium'],
        'conflicts_format': g['conflicts_format'],
        'kultur_first_agree_rows': g['kultur_first_agree'],
        'field_agreement': fa,
        'totals_pairs': g['totals_pairs'],
        'totals_agree': g['totals_agree'],
        'totals_conflicts': g['totals_conflicts'],
    },
    'reb': {
        'pass1_rows': sum(1 for r in new_reg if has_reb(r.get('kultur'))),
        'pass1_reproduced_by_pass2': sum(1 for x in reb_pass1_reproduced if x['pass2_reb']),
        'pass1_reproduced_detail': reb_pass1_reproduced,
        'qklft_pass1_all': qklft_p1_all,
        'qklft_pass1_pure': qklft_p1_pure,
        'qklft_pass2_all': qklft_p2_all,
        'qklft_pass2_pure': qklft_p2_pure,
        'qklft_pv_target': 7 * 1600 + 665,
        'note': 'vsote = sane parsanje (p121 "1725" = klafter); sestavljeni kultur bloki nosijo površino CELE parcele — "all" = zgornja meja, "pure" = samo Reb/Reben kultura',
    },
    'pages': pages_out,
    'conflicts': conflicts_all,
    'totals_chain': totals_chain,
    'quant_confirmed': quant_confirmed,
}

os.makedirs(OUTD, exist_ok=True)
out = f'{OUTD}/comparison.json'
json.dump(comparison, open(out, 'w'), ensure_ascii=False, indent=1)
print(f'written: {out}')
gl = comparison['global']
print(f"rows1={gl['rows1_total']} rows2={gl['rows2_total']} mismatch_pages={gl['rowcount_mismatch_pages']}")
print(f"full_agree: {gl['full_agree_rows']} | QUANT-CONFIRMED: {gl['quant_confirmed_rows']} ({gl['quant_confirmed_qklft']} QKlft)")
print(f"kolizije: high={gl['conflicts_high']} medium={gl['conflicts_medium']} format={gl['conflicts_format']}")
print('EXACT soglasje %:', {f: fa[f]['exact_pct'] for f in CORE})
print('NUMEQ soglasje %:', {f: fa[f]['numeq_pct'] for f in NUMERIC})
print(f"kultur first-token agree: {gl['kultur_first_agree_rows']}")
rb = comparison['reb']
print(f"REB: pass1 {rb['pass1_rows']} vrstic, pass2 reproducira {rb['pass1_reproduced_by_pass2']}; QKlft p1 all={rb['qklft_pass1_all']} pure={rb['qklft_pass1_pure']} | p2 all={rb['qklft_pass2_all']} pure={rb['qklft_pass2_pure']} | PV={rb['qklft_pv_target']}")
print(f"totals: {gl['totals_agree']}/{gl['totals_pairs']} agree")
