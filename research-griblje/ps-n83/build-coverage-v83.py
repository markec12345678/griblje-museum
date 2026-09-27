#!/usr/bin/env python3
"""Val 83 — source-coverage-1825.json: SRC-PS posodobitev po §22 ("coverage šele ob
re-readu s soglasjem ≥ 2") — vrstični prepis 143/143 (2.871 vrstic), p56–143 neodvisno
prebrano z 2. prehodom (val 83): struktura + numerična hrbtenica potrjeni, imena/kultur/
površine ostajajo PROVISIONAL (F-PV-04, NR-14).

§22 meja: KG v1.8 (20ec8a0a) / story_id / runtime src/data NESPREMENJENI — ta artefakt
je research plast (atlas-1825/), ki je runtime ne bere; KG vozlišče SRC-PS opomba
('PARTIAL 55/143') se posodobi z KG v1.9 rebuildom (ločen val, kaskada story_id).
"""
import json

REPO = '/home/z/griblje-museum'
SC = f'{REPO}/research-griblje/atlas-1825/source-coverage-1825.json'
OUTD = f'{REPO}/research-griblje/ps-n83'

comp = json.load(open(f'{OUTD}/reread-v83/comparison.json'))
g = comp['global']
fa = g['field_agreement']
rb = comp['reb']

cov = json.load(open(SC))

# ---------- GUARDS (fail-fast) ----------
assert cov['val'] == 81, f"guard: source-coverage val={cov['val']}, pričakovano 81"
assert cov['deterministic'] is True
assert len(cov['sources']) == 13
src_ps = next(s for s in cov['sources'] if s['source_id'] == 'SRC-PS')
assert src_ps['uodid'] == 373415 and src_ps['docid'] == 41780

cov['val'] = 83
src_ps['note'] = (
    "vrstični prepis 143/143 (2.871 vrstic: p1–55 val 57/61 + p56–143 val 82); p56–143 "
    "(1.798 vrstic) neodvisno prebrano z 2. prehodom (val 83, 88 klicev, 0 napak) — "
    f"soglasje: struktura 1798≈1797 vrstic; numerična hrbtenica ≥ 92 % (classe/ertrag/capital), "
    f"stand 82 % / wohnort 86 % / jaethe 71,9 % / klafter 68,4 % (numeq); NIZKO: imena 19,6 %, "
    f"kultur 47,3 % (zamenjave Wiese↔Hutweide), no_blatt 49 % (F15); per-parcelne površine in "
    "imena ostajajo PROVISIONAL → pasovni/zoom re-read (F-PV-04, NR-14); kolizije = variant "
    "fields (reread-v83/comparison.json), nič tiho popravljeno"
)
cov['transcription']['PS'] = {
    "pages": 143,
    "rows": 2871,
    "passes": 2,
    "note": ("p1–55: val 57 pass1 + val 61 crop re-read; p56–143: val 82 pass1 (PROVISIONAL) + "
             "val 83 celostranski neodvisen re-read — struktura in numerična hrbtenica (classe/ertrag/"
             f"capital ≥ 92 %, Wald raba 54=54) potrjeni; imena 19,6 % / kultur 47,3 % / no_blatt 49 % "
             "pod pragom → celice s soglasjem ≥ 2 potrjene, ostalo PROVISIONAL; Reb kvantitativa "
             f"neizvedljiva celostransko (pass2 skrajša omembe 14→6; sane vsote p1 pure {rb['qklft_pass1_pure']} "
             f"vs p2 pure {rb['qklft_pass2_pure']} QKlft vs PV {rb['qklft_pv_target']} QKlft)"),
}
cov['next_reads'] = [
    "PS p56–143 pasovni/zoom re-read s kolonskimi sidri (vzorec val 80/81) — imena, kultur kategorije, jaethe/klafter, Fürtrag veriga (F-PV-04/NR-14)",
    "PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)",
    "KG v1.9 rebuild: SRC-PS vozlišče (PARTIAL 55/143 → TRANSCRIBED 143/143) + kaskada story_id (§22) — ločen val",
    "PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)",
    "izven peskovnika: zunanji Rektifikacijski/Komunikacijski protokol (F-PZ-04 Δ 3 J), šolski list / SA Podzemelj / SI AS 749 / Zucchelli",
]

json.dump(cov, open(SC, 'w'), ensure_ascii=False, indent=1)
print(f'updated: {SC}')
print('val:', cov['val'])
print('SRC-PS note:', src_ps['note'][:150], '...')
