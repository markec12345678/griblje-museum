#!/usr/bin/env python3
"""Val 83 — PS N83 analysis v4: neodvisen re-read p56–143 → sodbe po poštenosti.

REZULTAT RE-READA (celostranski nativni 2. prehod, 88 klicev, 0 napak):
- STRUKTURA neodvisno reproducirana (1798 vs 1797 vrstic; 23 strani ±1 vrstica)
- VISOKO soglasje (≥ 92 %): classe, ertrag_fl/kr, capital_fl/kr (numerična hrbtenica)
- SREDNJE: stand 82 %, wohnort 86 %, jaethe 71,9 % / klafter 68,4 % (numeq)
- NIZKO: name_raw 19,6 % (Kurrent kurziva + ditto ojačanje), kultur 47,3 % EXACT /
  39 % first-token (kategorije zamenjav Wiese↔Hutweide, Acker↔Wald), no_blatt 49 % (F15)
- pass2 še AGRESIVNEJE SKRAJŠA kultur (p98 'Acker, Wiese' → 'Acker') — Reb omembe 14→6
- STOLPČNA DODELITEV Jaethe↔Klafter variira ('524' K ↔ '324' J) — absolutne površine
  na celostranski ravni NE ZANESLJIVE

SODBE (§4): soglasje ≥ 2 po CELICI potrdi classe/ertrag/capital vrednosti; per-parcelne
POVRŠINSKE trditve in imena ostajajo brez 2. prehoda → rešitvena pot = pasovni/zoom
re-read (vzorec val 80/81). Nič tiho popravljeno. §22: KG v1.8 / runtime NESPREMENJENI.
"""
import json, re, collections

REPO = '/home/z/griblje-museum'
OUTD = f'{REPO}/research-griblje/ps-n83'
P2 = f'{REPO}/research-griblje/raw-web-val83-2026-10/ps-vlm'

comp = json.load(open(f'{OUTD}/reread-v83/comparison.json'))
reg = json.load(open(f'{OUTD}/register.json'))
pages = json.load(open(f'{OUTD}/page-records.json'))

assert comp['meta']['val'] == '83'
assert len(reg) == 2871 and len(pages) == 143

g = comp['global']
fa = g['field_agreement']
rb = comp['reb']


def norm(v):
    if v is None:
        return ''
    return re.sub(r'\s+', ' ', str(v).strip())


def has_wald(k):
    return bool(re.search(r'\bwald', k or '', re.IGNORECASE))


# ---------- Wald v pass2 (neodvisno) ----------
wald_p2 = 0
for pg in range(56, 144):
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    for r in d2.get('rows', []):
        if has_wald(r.get('kultur')):
            wald_p2 += 1

no_blatt_gt1000_p2 = 0
for pg in range(56, 144):
    d2 = json.load(open(f'{P2}/p{pg:03d}.json'))
    for r in d2.get('rows', []):
        nb = r.get('no_blatt')
        if isinstance(nb, int) and nb > 1000:
            no_blatt_gt1000_p2 += 1
f15_conflicts = [c for c in comp['conflicts'] if c['field'] == 'no_blatt' and c['page'] in (96, 100)]

# kultur first-token soglasje delež
kultur_first_pct = round(100 * g['kultur_first_agree_rows'] / min(g['rows1_total'], g['rows2_total']), 2)

# najpogostejše kategorije zamenjav kultur (EXACT kolizije, first-token različna)
swap = collections.Counter()
for c in comp['conflicts']:
    if c['field'] == 'kultur':
        t1 = norm(c['pass1']).lower().split()
        t2 = norm(c['pass2']).lower().split()
        k1 = t1[0].rstrip('.,;:') if t1 else ''
        k2 = t2[0].rstrip('.,;:') if t2 else ''
        if k1 and k2 and k1 != k2:
            swap[tuple(sorted((k1, k2)))] += 1
swap_top = [{'pair': f'{a} ↔ {b}', 'count': n} for (a, b), n in swap.most_common(10)]

analysis = {
    "title": "PS N83 analiza v4 — val 83: neodvisen re-read p56–143 (celostranski) — soglasje matrika po poljih; struktura + numerična hrbtenica potrjeni, imena/kultur/površine ostajajo PROVISIONAL",
    "val": "83",
    "date": "2026-09-27",
    "method": {
        "protocol": "2. neodvisen prehod: 88 svežih VLM klicev @nativno (ps-transcribe-v83.mts, prompt VERBATIM val 57/82; 0 napak, 0 retry, 0×429) → build-compare-v83.py v2 (deterministična primerjava RAW obeh prehodov, match po indeksu strani)",
        "independence": "prompt ne vsebuje ničesar iz pass1 (isti generični prompt); svež klic = neodvisen glas (vzorec val 80)",
        "agreement_levels": "EXACT (strip + belina) in NUMEQ (samo števke — format artefakti '+ 56' = '+56'); soglasje ≥ 2 = EXACT ali NUMEQ pri numeričnih poljih",
        "reading_honesty": "kolizije = variant vrednosti pass2 (reread-v83/comparison.json) — NIČ tiho popravljeno; register.json/page-records.json BIT-PO-BIT; runtime src/data NESPREMENJEN",
        "kg_impact": "KG v1.8 (20ec8a0a) / story_id / timeline / deleži NESPREMENJENI; SRC-PS coverage posodobitev v research artefaktu (build-coverage-v83.py); KG vozlišče 'PARTIAL 55/143' opomba čaka KG v1.9 rebuild (kaskada story_id — ločen val)",
        "method_limit": "CELOSTRANSKI nativni re-read: dovolj za strukturo + numerično hrbtenico; NE dovolj za imena (19,6 %), kultur kategorije (47,3 %) in absolutne površine (stolpčna dodelitev variira) → rešitvena pot = pasovni/zoom re-read po vzorcu val 80/81 (kolonsko sidrani izrezki)",
    },
    "inputs": {
        "pages_reread": g['pages_compared'],
        "rows_pass1": g['rows1_total'],
        "rows_pass2": g['rows2_total'],
        "rowcount_mismatch_pages": g['rowcount_mismatch_pages'],
        "extra_rows_pass1": g['extra_rows_pass1'],
        "extra_rows_pass2": g['extra_rows_pass2'],
        "full_agree_rows": g['full_agree_rows'],
        "partial_rows": g['partial_rows'],
        "rows_conflict_high": g['rows_conflict_high'],
        "conflicts_high": g['conflicts_high'],
        "conflicts_medium": g['conflicts_medium'],
        "conflicts_format": g['conflicts_format'],
        "totals_pairs": g['totals_pairs'],
        "totals_agree": g['totals_agree'],
        "field_agreement": fa,
        "kultur_first_token_agree_pct": kultur_first_pct,
        "kultur_swap_top": swap_top,
    },
    "findings": {
        "F-PV-03": {
            "status": "KVALITATIVNO-POTRJENO-V82 (re-read NI dvignil na 2× — pass2 reproducira 6/14 Reb omemb)",
            "reb_rows_pass1": rb['pass1_rows'],
            "reb_pass2_reproduced": rb['pass1_reproduced_by_pass2'],
            "reb_pass2_rows": 6,
            "reb_qklft_pass1_pure": rb['qklft_pass1_pure'],
            "reb_qklft_pass2_pure": rb['qklft_pass2_pure'],
            "reb_qklft_pv_target": rb['qklft_pv_target'],
            "statement": "Pass2 celostransko še AGRESIVNEJE SKRAJŠA kultur stolpec (p98: 'Acker, Wiese, Reb, Hofraithen' → 'Acker') — Reb omembe 14 (pass1) → 6 (pass2), reproduciranih 0/14 v QUANT-CONFIRMED preseku. Kvantitativna uskladitev s PV (7 J 665 K) NI IZVEDLJIVA na celostranski ravni: stolpčna dodelitev Jaethe↔Klafter variira med prehodi (p98: K='524' ↔ J='324') + števk varianca (5↔3, 0↔7). EKISTENCA vinogradnih parcel ostaja potrjena (pass1 + avtorski odtis + napoved val 74), kvantitativa pa čaka PASOVNI/ZOOM re-read s kolonskimi sidri (vzorec val 80/81). Nič tiho razrešeno (§4).",
        },
        "F-PV-02": {
            "status": "OPEN (re-read: Wald obstoj v pass2 reproduciran)",
            "wald_rows_pass1_p56_143": 54,
            "wald_rows_pass2": wald_p2,
            "wald_rows_total_pass1": 142,
            "statement": "Pass2 neodvisno reproducira Wald rabo (%d vrstic vs 54 v pass1) — obstoj Wald rabe v PS 1825 je 2× dokumentiran; napetost proti PV (Wälder = 0) OSTAJA OPEN. Kvantitativna razlaga (Weidewald/Ödungen kontekst) čaka pasovni re-read; nič tiho razrešeno." % wald_p2,
        },
        "F15": {
            "status": "GENERALIZIRANA + RE-READ: vzorec ostaja REVIEW",
            "no_blatt_exact_pct": fa['no_blatt']['exact_pct'],
            "no_blatt_gt1000_pass1": 379,
            "no_blatt_gt1000_pass2": no_blatt_gt1000_p2,
            "f15_page_96_100_conflicts": len(f15_conflicts),
            "statement": "'Nro. des Blattes' soglasje med prehodoma le %.2f %% (rimske III → 111, Uebersetzung zaporedja > 1000; pass2 neodvisno najde %d takih vrstic vs 379 v pass1) — semantika stolpca ostaja NEZANESLJIVA v obeh prehodih; vse vrednosti KOT PREBRANE (REVIEW); p96/p100 kolizije: %d. Nič popravljenih tiho." % (fa['no_blatt']['exact_pct'], no_blatt_gt1000_p2, len(f15_conflicts)),
        },
        "F11": {
            "status": "RE-READ: vsote ŠIBKO reproducirane na celostranski ravni",
            "totals_pairs": g['totals_pairs'],
            "totals_agree": g['totals_agree'],
            "totals_disagree": g['totals_conflicts'],
            "statement": "Summa/Fürtrag vsote p56–143: soglasje label+value le %d/%d vnosov — celostranski nativni prehod NE zadostuje za verifikacijo verige (vzorec val 61 za p1–55 je bil crop-based). Veriga ostaja SUROVA; preverba čaka pasovni re-read." % (g['totals_agree'], g['totals_pairs']),
        },
        "F-PV-04": {
            "id_note": "NOVA NAJDBA (val 83) — metodični meji celostranskega re-reada",
            "status": "DOKUMENTIRANA (negative-result NR-14)",
            "strong_fields": {"classe": fa['classe']['exact_pct'], "ertrag_fl": fa['ertrag_fl']['exact_pct'],
                              "ertrag_kr": fa['ertrag_kr']['exact_pct'], "capital_fl": fa['capital_fl']['exact_pct'],
                              "capital_kr": fa['capital_kr']['exact_pct']},
            "weak_fields": {"name_raw": fa['name_raw']['exact_pct'], "kultur": fa['kultur']['exact_pct'],
                            "kultur_first_token_pct": kultur_first_pct, "no_blatt": fa['no_blatt']['exact_pct'],
                            "jaethe_numeq_pct": fa['jaethe']['numeq_pct'], "klafter_numeq_pct": fa['klafter']['numeq_pct']},
            "statement": "Celostranski nativni VLM re-read (2× pass) ZADOSKAŽE: strukturo (1798≈1797 vrstic, 23 strani ±1) in numerično hrbtenico (classe/ertrag/capital ≥ 92 % soglasja; stand 82 %, wohnort 86 %) — NE pa imen (19,6 %; Kurrent + ditto ojačanje), kultur kategorij (47,3 % EXACT; sistemske zamenjave Wiese↔Hutweide, Acker↔Wald) in absolutnih površin (stolpčna dodelitev variira). Per-parcelne trditve po §4: samo polja/celice s soglasjem ≥ 2; ostalo čaka pasovni/zoom re-read (NR-14 → next_reads).",
        },
    },
    "next_reads": [
        "PS p56–143 PASOVNI/ZOOM re-read s kolonskimi sidri (vzorec val 80/81) — imena, kultur kategorije, jaethe/klafter stolpčna dodelitev, Fürtrag veriga (NR-14)",
        "PZ p48–65 2. prehod (protokoli + Zusammenstellung A/B — p65 REVIEW)",
        "KG v1.9 rebuild: SRC-PS vozlišče (PARTIAL 55/143 → TRANSCRIBED 143/143) + kaskada story_id (§22) — ločen val",
        "PT p7 @300dpi (KG-F01/F04); PR Grenz-Beschreibung (F-PZ-05)",
        "izven peskovnika: zunanji Rektifikacijski protokol (F-PZ-04), šolski list / SA Podzemelj / SI AS 749 / Zucchelli",
    ],
}

out = f'{OUTD}/analysis-v4.json'
json.dump(analysis, open(out, 'w'), ensure_ascii=False, indent=1)
print(f'written: {out}')
i = analysis['inputs']
print(f"full_agree: {i['full_agree_rows']} | kolizije h/m/f: {i['conflicts_high']}/{i['conflicts_medium']}/{i['conflicts_format']}")
print(f"kultur first-token: {kultur_first_pct} % | wald p2: {wald_p2} | no_blatt>1000 p2: {no_blatt_gt1000_p2}")
print('swap top:', swap_top[:5])
print('F-PV-03 status:', analysis['findings']['F-PV-03']['status'])
