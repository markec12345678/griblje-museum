#!/usr/bin/env python3
"""Val 82 — PS N83 analysis v3: dokončanje transkripcije p56–143 → ocene F-PV-02/F-PV-03,
podaljšanje Fürtrag verige, F15 generalizacija, reading honesty.

Determinističen (bere register.json/page-records.json po vgradnji val 82).
Vire: ps-n83/register.json, ps-n83/page-records.json, build-qa-v82.json.
§4: enojni VLM prehod = PROVISIONAL → nič per-parcelnih trditev; agregati = kvalitativni.
"""
import json, re, collections

REPO = '/home/z/griblje-museum'
OUTD = f'{REPO}/research-griblje/ps-n83'

reg = json.load(open(f'{OUTD}/register.json'))
pages = json.load(open(f'{OUTD}/page-records.json'))
qa = json.load(open(f'{OUTD}/build-qa-v82.json'))

old_rows = [r for r in reg if r['page'] <= 55]
new_rows = [r for r in reg if r['page'] > 55]
assert len(old_rows) == 1073 and len(new_rows) == qa['built_new']


def wk(r):
    """normaliziran prvi token kultur"""
    k = (r['kultur'] or '').strip().lower()
    return k.split()[0].rstrip('.,;:') if k else '?'


def has_wald(r):
    return bool(re.search(r'\bwald', (r['kultur'] or ''), re.IGNORECASE))


def has_reb(r):
    return bool(re.search(r'\breb|\bweing', (r['kultur'] or ''), re.IGNORECASE))


# ---------- kultura agregati ----------
kul_old = collections.Counter(wk(r) for r in old_rows)
kul_new = collections.Counter(wk(r) for r in new_rows)

# ---------- F-PV-02 (Wald napetost) ----------
wald_old = [r for r in old_rows if has_wald(r)]
wald_new = [r for r in new_rows if has_wald(r)]
wald_new_pages = sorted({r['page'] for r in wald_new})

# ---------- F-PV-03 (vinogradi) ----------
reb_new = [r for r in new_rows if has_reb(r)]
reb_old = [r for r in old_rows if has_reb(r)]
reb_rows = [
    {'page': r['page'], 'haus_no': r['haus_no'], 'owner': r['owner_original'][:40],
     'kultur': r['kultur'], 'jaethe': r['jaethe'], 'klafter': r['klafter'],
     'anmerkung': r['anmerkung'][:80]}
    for r in reb_new
]

# ---------- Fürtrag / totals veriga p56–143 ----------
totals_new = []
for p in pages:
    if p['page'] > 55 and p.get('totals'):
        for t in p['totals']:
            totals_new.append({'page': p['page'], 'label': t.get('label', ''), 'value': t.get('value', '')})

# ---------- F15 generalizacija ----------
f15_pages = [fl['page'] for fl in qa['qa_flags'] if 'F15' in fl['flag']]
no_blatt_gt1000 = sum(1 for r in new_rows if isinstance(r.get('no_blatt'), int) and r['no_blatt'] > 1000)

analysis = {
    "title": "PS N83 analiza v3 — val 82: transkripcija DOKONČANA (143/143), F-PV-03 kvalitativno potrjena, F-PV-02 razširjena, F15 generalizirana",
    "val": "82",
    "date": "2026-09-27",
    "method": {
        "transcription": "val 57 prompt VERBATIM (ps-transcribe-v82.mts), enojni VLM prehod @nativno (~1200×1020), resumable",
        "previous_state": "val 57: p1–55 (1073 vrstic); p56–143 blokirana kvota (val 58/61)",
        "val_82": "p56–143: 48 novih strani (+40 iz parallelne seje) = 88 strani, 0 trajnih napak, 1 retry (p121)",
        "reading_honesty": "enojni VLM prehod → vse vrstice p56–143 = PROVISIONAL (reading_pass=v82-native-pass1); §4: per-parcelne trditve ostajajo NIČ; KG v1.8 / story_id / timeline NESPREMENJENI (§22)",
        "independent_spot_check": "avtorski odtis na p100 (nativni JPG): imena se skladata (Brünig klastер 15+ vrstic); KULTUR stolpec = dvovrstični opisi, VLM SKRAJŠA (npr. 'Ackerland und Wieswachs...' → 'Ackerland'); no_blatt '111' = rimska III (F15); številke @nativno neodločljive — kvantitativna uskladitev čaka re-read",
    },
    "inputs": {
        "ps_rows_total": len(reg),
        "ps_rows_p1_55": len(old_rows),
        "ps_rows_p56_143": len(new_rows),
        "pages_read": sum(1 for p in pages if p['status'] == 'READ'),
        "pages_read_before": 55,
        "qa_flags": len(qa['qa_flags']),
        "errors": len(qa['errors']),
    },
    "kultur_aggregates": {
        "p1_55_top": kul_old.most_common(12),
        "p56_143_top": kul_new.most_common(12),
        "note": "agregati = kvalitativni (enojni prehod, dvovrstični kultur opisi skrajšani — deleži NE primerljivi s PV brez re-reada)",
    },
    "findings": {
        "F-PV-02": {
            "status": "OPEN (razširjena evidencia)",
            "wald_rows_p1_55": len(wald_old),
            "wald_rows_p56_143": len(wald_new),
            "wald_rows_total": len(wald_old) + len(wald_new),
            "wald_pages_p56_143": wald_new_pages[:20],
            "statement": "PV Wälder = 0; PS (sedaj 143/143) vsebuje Wald rabo na številnih parcelah v obeh delih protokola. Napetost dokument-vs-dokument OSTAJA — kvantitativna razlaga (Weidewald/Ödungen kontekst) čaka re-read; nič tiho razrešeno.",
        },
        "F-PV-03": {
            "status": "KVALITATIVNO-POTRJENO-V82",
            "reb_rows_old": len(reb_old),
            "reb_rows_new": len(reb_rows),
            "reb_rows": reb_rows,
            "statement": "FALZIFIKABILNA NAPOVED val 74 POTRJENA: vinogradne parcele obstajajo v PS p56–143 (Reb/Reben: p98 ×8 v sestavljenih kulturnih blokih 'Acker, Wiese, Reb, Hofraithen', p101 ×2 'Reben', p111, p121 'Reben Laumen' [rot: 'alte'], p124 ×2). KVANTITATIVNA uskladitev s PV (7 J 665 K) NI izvedljiva iz enojnega prehoda (jaethe/klafter razporeditve nezanesljive, npr. p121 J='1725' brez K) → čaka neodvisen re-read; per-parcelne trditve ostajajo NIČ (§4).",
        },
        "F15": {
            "status": "GENERALIZIRANA (vzorec potrjen na novih straneh)",
            "f15_pages_new": f15_pages,
            "no_blatt_gt1000_rows": no_blatt_gt1000,
            "statement": "'Nro. des Blattes' semantika ostaja nezanesljiva čez celoten PS: rimske številke → števke (III → 111 na p96/p100), Uebersetzung zaporedja (971–999, 2007+) → no_blatt. Vse vrednosti hranjene KOT PREBRANE (REVIEW); nič popravljenih tiho.",
        },
        "F11": {
            "status": "VERIGA PODALJŠANA (surova, neverificirana)",
            "totals_p56_143_count": len(totals_new),
            "totals_sample": totals_new[:20],
            "statement": "Summa/Fürtrag vsote iz p56–143 izluščene kot surov material (npr. p100 '28 curig 16|49' + rdeča '13|673'); monotona veriga NISO preverjene (enojni prehod) — aritmetična kontrola proti 13-točkovni verigi val 61 čaka re-read.",
        },
    },
    "next_reads": [
        "PS p56–143 neodvisen re-read (2. prehod) — prioriteta za kvantitativne agregate (Reb vsote, Wald, Fürtrag veriga)",
        "PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B)",
        "PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)",
        "izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04)",
    ],
}

out = f'{OUTD}/analysis-v3.json'
json.dump(analysis, open(out, 'w'), ensure_ascii=False, indent=1)
print(f'written: {out}')
print('F-PV-02 wald:', len(wald_old), '+', len(wald_new), '=', len(wald_old) + len(wald_new))
print('F-PV-03 reb rows new:', len(reb_rows), '| old:', len(reb_old))
print('F15 pages:', f15_pages, '| no_blatt>1000:', no_blatt_gt1000)
print('totals p56-143:', len(totals_new))
