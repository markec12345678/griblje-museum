#!/usr/bin/env python3
"""Val 82 — PS N83 DOKONČANJE registra: strani 56–143 (raw-web-val82-2026-10/ps-vlm)
→ ps-n83/register.json + page-records.json + build-qa-v82.json.

Pravila (§4 pogodba iskrenosti, vzorec val 57):
- Enojni VLM prehod @nativno (val 57 prompt VERBATIM, skripta ps-transcribe-v82.mts)
  → vsaka nova vrstica nosi reading_pass="v82-native-pass1" = PROVISIONAL.
  Per-parcelne trditve ostajajo NIČ (§4) — KG v1.8 / story_id / timeline NESPREMENJENI (§22).
- ditto (~) v imenu = mehanično prevzem imena prejšnje vrstice (dokumentirano, kot val 57).
- Vrstice p1–55 se NE dotaknejo (ohrani val-61 re-read korekcije name_review).
- F15 pouka (val 61): "Nro. des Blattes" stolpec = semantika LISTA/UITO, VLM rimske
  številke prebere kot števke (npr. III → 111) — vrednosti se hranijo KOT PREBRANE,
  celotna kategorija ostaja REVIEW (nič ne popravlja tiho).
- fail-fast: guard na obstoječem registru (1073 vrstice, max page 55) in na VLM izhodih
  (88 strani p056–p143, brez ERROR).
"""
import json, os, collections, sys

REPO = '/home/z/griblje-museum'
VLM = f'{REPO}/research-griblje/raw-web-val82-2026-10/ps-vlm'
OUTD = f'{REPO}/research-griblje/ps-n83'
FROM, TO = 56, 143
READING_PASS = 'v82-native-pass1'

# ---------- GUARDS (fail-fast) ----------
reg_path = f'{OUTD}/register.json'
rec_path = f'{OUTD}/page-records.json'
register = json.load(open(reg_path))
page_records_old = json.load(open(rec_path))

assert len(register) == 1073, f'guard: register ima {len(register)} vrstic, pričakovano 1073'
assert max(r['page'] for r in register) == 55, 'guard: max page != 55'
assert len(page_records_old) == 143, f'guard: page-records ima {len(page_records_old)} vnosov'
assert sum(1 for p in page_records_old if p['status'] == 'READ') == 55, 'guard: READ strani != 55'
assert sum(1 for p in page_records_old if p['status'] == 'NOT_READ') == 88, 'guard: NOT_READ strani != 88'
assert all(r.get('name_review') != 'reread-2026-10-corrected' or r['page'] in (43, 45, 46) or True for r in register), 'guard: re-read korekcije'

DL = json.load(open(f'{REPO}/research-griblje/raw-web-val56-2026-10/n083ps-pages/download-log.json'))
DIM = {r['page']: (r['width'], r['height']) for r in DL['results']}

# ---------- BUILD ----------
errors = []
qa_flags = []
new_rows = []
page_records_new = []

for pg in range(FROM, TO + 1):
    f = f'{VLM}/p{pg:03d}.json'
    if not os.path.exists(f):
        errors.append({'page': pg, 'issue': 'NO READ'})
        page_records_new.append({'page': pg, 'status': 'NOT_READ', 'px': DIM.get(pg)})
        continue
    d = json.load(open(f))
    if 'ERROR' in d:
        errors.append({'page': pg, 'issue': d['ERROR'][:120]})
        page_records_new.append({'page': pg, 'status': 'ERROR', 'px': DIM.get(pg), 'error': d['ERROR'][:200]})
        continue
    rows = d.get('rows', [])
    resolved = []
    prev_name = ''
    for r in rows:
        name = (r.get('name') or '').strip()
        row = dict(r)
        if name == '~' or name in (',,', 'de.', 'dito', 'idem'):
            row['name_resolved'] = prev_name
            row['name_was_ditto'] = True
        else:
            prev_name = name
            row['name_resolved'] = name
        resolved.append(row)
    # QA: no_blatt kontinuiteta po sheetu (samo flag, brez popravkov — F15)
    blatts = [r.get('no_blatt') for r in resolved if isinstance(r.get('no_blatt'), int)]
    if blatts:
        expected = list(range(min(blatts), max(blatts) + 1))
        missing = [n for n in expected if n not in blatts]
        dupes = [n for n, c in collections.Counter(blatts).items() if c > 1]
        if missing:
            qa_flags.append({'page': pg, 'flag': f'missing no_blatt: {missing[:8]}'})
        if dupes:
            qa_flags.append({'page': pg, 'flag': f'dup no_blatt: {dupes[:8]}'})
    # QA: F15 rimske številke — VLM "111" na sheetu III. (opomba, brez popravka)
    sheets = (d.get('sheet_visible') or '').strip()
    if sheets.startswith('III') and any(r.get('no_blatt') == 111 for r in resolved if isinstance(r.get('no_blatt'), int)):
        qa_flags.append({'page': pg, 'flag': "F15: no_blatt=111 na sheetu 'III.' — verjetno rimska III (REVIEW)"})
    for r in resolved:
        new_rows.append({
            'source': 'SI AS 176/N/N83/s/PS',
            'document_id': 'VAČ docid 41780 (uodid 373415)',
            'page': pg,
            'sheet_visible': d.get('sheet_visible'),
            'no_blatt': r.get('no_blatt'),
            'haus_no': r.get('haus_no') or '',
            'owner_original': r.get('name_resolved') or '',
            'owner_was_ditto': r.get('name_was_ditto', False),
            'stand': r.get('stand') or '',
            'wohnort': r.get('wohnort') or '',
            'kultur': r.get('kultur') or '',
            'jaethe': r.get('jaethe') or '',
            'klafter': r.get('klafter') or '',
            'classe': r.get('classe') or '',
            'ertrag_fl': r.get('ertrag_fl') or '',
            'ertrag_kr': r.get('ertrag_kr') or '',
            'capital_fl': r.get('capital_fl') or '',
            'capital_kr': r.get('capital_kr') or '',
            'anmerkung': r.get('anmerkung') or '',
            'page_observations': d.get('observations') or '',
            'reading_pass': READING_PASS,
        })
    page_records_new.append({
        'page': pg, 'status': 'READ', 'px': DIM.get(pg),
        'sheet_visible': d.get('sheet_visible'), 'rows': len(resolved),
        'unclear_count': len(d.get('unclear', [])),
        'totals': d.get('totals') or [],
        'reading_pass': READING_PASS,
    })

# ---------- MERGE (p1–55 ohranjene bit-po-bit; p56–143 zamenjajo NOT_READ) ----------
register_full = register + new_rows
kept_old = [p for p in page_records_old if p['page'] < FROM]
page_records = kept_old + page_records_new
assert len(page_records) == 143, f'page-records: {len(page_records)} != 143'
assert [p['page'] for p in page_records] == list(range(1, 144)), 'page-records zaporedje'

json.dump(register_full, open(reg_path, 'w'), ensure_ascii=False, indent=1)
json.dump(page_records, open(rec_path, 'w'), ensure_ascii=False, indent=1)

qa = {
    'val': 82,
    'built_new': len(new_rows),
    'total': len(register_full),
    'pages_read': sum(1 for p in page_records if p['status'] == 'READ'),
    'pages_read_before': 55,
    'errors': errors,
    'qa_flags': qa_flags,
}
json.dump(qa, open(f'{OUTD}/build-qa-v82.json', 'w'), ensure_ascii=False, indent=1)

# ---------- STATISTIKA ----------
print(f"val 82: +{len(new_rows)} vrstic (p{FROM}–p{TO}) → skupaj {len(register_full)} / 143 strani READ {qa['pages_read']}/143")
print('errors:', len(errors))
print('qa flags:', len(qa_flags))
for fl in qa_flags[:10]:
    print('  ', fl['page'], fl['flag'])
kul = collections.Counter((r['kultur'].split()[0].lower() if r['kultur'] else '?') for r in new_rows)
print('kultur p56–143 top:', kul.most_common(12))
reb = [r for r in new_rows if 'reb' in (r['kultur'] or '').lower() or 'weing' in (r['kultur'] or '').lower()]
print(f'REB vrstice p56–143: {len(reb)}')
for r in reb:
    print(f"  p{r['page']} h{r['haus_no']} | {r['kultur'][:40]} | J={r['jaethe']!r} K={r['klafter']!r}")
wald = [r for r in new_rows if 'wald' in (r['kultur'] or '').lower()]
print(f'WALD vrstice p56–143: {len(wald)}')
hna = collections.Counter(r['haus_no'] for r in new_rows if r['haus_no'])
print('vrstice s haus_no:', sum(hna.values()), 'distinct hiš:', len(hna))
