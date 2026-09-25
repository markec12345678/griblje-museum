#!/usr/bin/env python3
"""Val 57 — PS N83 register builder: ps-vlm/*.json → ps-n83/register.json + page-records.json + QA.

Pravila:
- ditto (~) v imenu = prevzem imena prejšnje vrstice (mehanično, dokumentirano)
- no_blatt kontinuiteta po sheetu (1..N, vrzeli = QA flag)
- hišne številke: kot prebrano, brez popravkov
- vsaka stran: page-records z statusom + QA
"""
import json, os, collections, re

VLM = '/home/z/griblje-museum/research-griblje/raw-web-val57-2026-10/ps-vlm'
OUTD = '/home/z/griblje-museum/research-griblje/ps-n83'
os.makedirs(OUTD, exist_ok=True)
DL = json.load(open('/home/z/griblje-museum/research-griblje/raw-web-val56-2026-10/n083ps-pages/download-log.json'))
DIM = {r['page']: (r['width'], r['height']) for r in DL['results']}

register = []
page_records = []
errors = []
qa_flags = []

for pg in range(1, 144):
    f = f'{VLM}/p{pg:03d}.json'
    if not os.path.exists(f):
        errors.append({'page': pg, 'issue': 'NO READ'})
        page_records.append({'page': pg, 'status': 'NOT_READ', 'px': DIM.get(pg)})
        continue
    d = json.load(open(f))
    if 'ERROR' in d:
        errors.append({'page': pg, 'issue': d['ERROR'][:120]})
        page_records.append({'page': pg, 'status': 'ERROR', 'px': DIM.get(pg), 'error': d['ERROR'][:200]})
        continue
    rows = d.get('rows', [])
    # ditto razrešitev
    resolved = []
    prev_name = ''
    for i, r in enumerate(rows):
        name = (r.get('name') or '').strip()
        row = dict(r)
        if name == '~' or name in (',,', 'de.', 'dito', 'idem'):
            row['name_resolved'] = prev_name
            row['name_was_ditto'] = True
        else:
            prev_name = name
            row['name_resolved'] = name
        resolved.append(row)
    # QA: no_blatt kontinuiteta
    blatts = [r.get('no_blatt') for r in resolved if isinstance(r.get('no_blatt'), int)]
    gaps = []
    if blatts:
        expected = list(range(min(blatts), max(blatts) + 1))
        missing = [n for n in expected if n not in blatts]
        dupes = [n for n, c in collections.Counter(blatts).items() if c > 1]
        if missing: gaps.append(f'missing no_blatt: {missing}')
        if dupes: gaps.append(f'dup no_blatt: {dupes}')
    for g in gaps:
        qa_flags.append({'page': pg, 'flag': g})
    for r in resolved:
        register.append({
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
        })
    page_records.append({
        'page': pg, 'status': 'READ', 'px': DIM.get(pg),
        'sheet_visible': d.get('sheet_visible'), 'rows': len(resolved),
        'unclear_count': len(d.get('unclear', [])),
        'totals': d.get('totals') or [],
    })

json.dump(register, open(f'{OUTD}/register.json', 'w'), ensure_ascii=False, indent=1)
json.dump(page_records, open(f'{OUTD}/page-records.json', 'w'), ensure_ascii=False, indent=1)
json.dump({'errors': errors, 'qa_flags': qa_flags, 'built': len(register)}, open(f'{OUTD}/build-qa.json', 'w'), ensure_ascii=False, indent=1)

print(f'built: {len(register)} rows from {sum(1 for p in page_records if p["status"]=="READ")} pages')
print('errors:', len(errors), [e["page"] for e in errors][:20])
print('qa flags:', len(qa_flags))
for f in qa_flags[:12]: print(' ', f)
# hitra statistika
hn = collections.Counter(r['haus_no'] for r in register if r['haus_no'])
print('rows with haus_no:', sum(hn.values()), 'distinct:', len(hn))
kul = collections.Counter(r['kultur'].split()[0].lower() if r['kultur'] else '?' for r in register)
print('kultur top:', kul.most_common(12))
# B.P./Zoll search
zoll = [r for r in register if re.search(r'z[oi]ll', (r['anmerkung'] or '') + ' ' + (r['owner_original'] or ''), re.IGNORECASE)]
print('ZOLL rows:', len(zoll))
for r in zoll[:10]:
    print(f"  p{r['page']} no{r['no_blatt']} h{r['haus_no']} {r['owner_original'][:35]} | {r['anmerkung'][:60]}")
bp = [r for r in register if re.search(r'B\s*[.\s]*P', r['anmerkung'] or '', re.IGNORECASE)]
print('rows with B.P. in anmerkung:', len(bp))
for r in bp[:10]:
    print(f"  p{r['page']} no{r['no_blatt']} h{r['haus_no']} | {r['anmerkung'][:70]}")
