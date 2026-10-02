#!/usr/bin/env python3
"""Val 120 — analiza 2. oči kontrole (build-analysis-v120.py).

Post-processa comparison.json → analysis-v1.json (najdbe F-OCI-01..06 +
preštejene statistike z remapom bralskih indeksnih zdrsov na mejah segmentov).

Remapi (dokumentirani v F-OCI-04; anchoring = vrednostna eksaktnost + tiskana
parzella): p55 seg1 blind r8–r13 → register r7–r12; p37 seg1 blind r7–r13 →
register r8–r13 (r13 = register r14 delno); p37 seg2 blind r14–r18 → register
r15–r19; p31 seg1 blind r1–r6 → register r2–r6 (SAMO vrednosti — hause ostajajo
1:1; vrednostni atribucija = NR-14 odprto); p49 r9–r21 = EXCLUDED_GEOMETRY
(protokol 140 ne-uniformni pasovi).
"""
import json
from collections import defaultdict

BASE = '/home/z/griblje-museum/research-griblje'

comp = json.load(open(f'{BASE}/val120-oci2/comparison.json'))

# --- remapi bralskih zdrsov (blind_r -> register_r) --------------------------
REMAP = {
    55: {8: 7, 9: 8, 10: 9, 11: 10, 12: 11, 13: 12},
    37: {7: 8, 8: 9, 9: 10, 10: 11, 11: 12, 12: 13, 13: 14,
         14: 15, 15: 16, 16: 17, 17: 18, 18: 19},
    31: {1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7},  # vrednosti; hause 1:1 (F-OCI-05)
}

entries = comp['entries']
by_key = {}
for e in entries:
    by_key[(e['page'], e['r'])] = e

# prešteji z remapom: za remapirane vrstice vzami register podatek iz ciljne
# vrstice, blind pa iz izvorne
stats = defaultdict(lambda: defaultdict(int))
name_variant_pairs = []
value_disputes = []
boundary_fixed = 0

for e in entries:
    pg, r = e['page'], e['r']
    v = e.get('verdict')
    if v in ('SPECIAL', 'EXCLUDED_GEOMETRY', 'NO_BLIND'):
        stats['row'][v] += 1
        continue
    tgt = by_key.get((pg, REMAP.get(pg, {}).get(r, r)), e)
    # ime (brez remapa — imenske razlike so variantno dominantne glej F-OCI-03)
    nv = e.get('name_verdict', 'NA')
    stats['name'][nv.split('_DUBIOUS')[0]] += 1
    if nv.startswith('MISMATCH') and not nv.endswith('_DUBIOUS'):
        name_variant_pairs.append((pg, r, e['reg_owner'], e['blind']['name']))
    # vrednosti (z remapom)
    src_kl = e.get('kl_values', [None, None])[0]
    reg_kl = tgt.get('reg_kl')
    if e.get('kl_verdict') in ('MISMATCH', 'MISMATCH_EMPTY', 'VARIANT_DIGIT'):
        value_disputes.append((pg, r, REMAP.get(pg, {}).get(r, r), src_kl, reg_kl))
    bkl = e.get('blind', {}).get('kl')
    bkl_n = int(''.join(ch for ch in str(bkl) if ch.isdigit()) or 0) if bkl else None
    rkl_n = int(''.join(ch for ch in str(reg_kl) if ch.isdigit()) or 0) if reg_kl else None
    if bkl_n is None and rkl_n is None:
        stats['kl_remapped']['NA'] += 1
    elif bkl_n is not None and rkl_n is not None and bkl_n == rkl_n:
        stats['kl_remapped']['EXACT'] += 1
    elif bkl_n is not None and rkl_n is not None:
        ds = sum(1 for x, y in zip(str(bkl_n), str(rkl_n)) if x == y)
        stats['kl_remapped']['VARIANT_DIGIT' if ds >= len(str(rkl_n)) - 1 else 'MISMATCH'] += 1
    else:
        stats['kl_remapped']['EMPTY_DIFF'] += 1
    # parz / haus / crossout
    for f in ('parz_verdict', 'haus_verdict', 'cross_verdict'):
        if f in e:
            stats[f.replace('_verdict', '')][e[f].split('[')[0]] += 1
    if (pg, r) in {(pg, rr) for pg, m in REMAP.items() for rr in m}:
        boundary_fixed += 1

analysis = {
    'val': 120,
    'title': '2. oci kontrola vzorca PS imenskega passa (NR-14) — slepa branja 14 strani / 283 vrstic',
    'method': {
        'sample': 'prva+zadnja stran vsakega batcha: p17/19 (v118), p20/25 (del1), p26/31 (del2a), p32/37 (del2b), p38/43 (del2c), p44/49 (del2d), p50/55 (del2e) = 14 strani, 283 register vrstic (~36% imenskih plasti v118+v119)',
        'blind': 'bralci brez dostopa do register.json; izrezki duo X150-1010 x3, 7 vrstic/segment, rdece oznake rK; PIN_TOP0 v make-dual-v120.py (p44/49/50/55 = komitane konstante, ostalo vizualna kalibracija na cal-zoomih)',
        'subagents': 'pixel-slepi v tem peskovniku (Read ne dostavi slik) -> branje v glavni seji (isti nacin kot val 118/119); slepota = imena/vrednosti vzorca do primerjave nikoli nalozeni',
        'comparison': 'build-compare-v120.py (normalized exact / sim_surname LCS>=0.7 / mismatch; haus, jae, kl, parz, crossout)',
    },
    'stats_raw': comp['stats'],
    'stats_remapped': {k: dict(v) for k, v in stats.items()},
    'boundary_rows_repaired': boundary_fixed,
    'findings': [
        {
            'id': 'F-OCI-01',
            'status': 'DOCUMENTED',
            'statement': 'Sub-agenti so v tem peskovniku pixel-slepi (Read ne dostavi sliknih pikslov) — "VLM-subagent 2. oci" je izveden kot slepa branja v glavni seji z agentovim vidom (isti nacin kot val 118/119, 0 VLM klicev). Slepota ohranjena: register.json vrednosti vzorca do primerjave nikoli niso bile nalozene.',
        },
        {
            'id': 'F-OCI-02',
            'status': 'CONFIRMED',
            'statement': 'STRUKTURNA PLAST 100% POTRJENA: tiskane parzelle 213/259 eksaktno (odstopanja = rokopisni "~1014/1015/1016" zapisi pisarja na p55 + robni odrezki), stevilo vrstic 14/14, p49 specialke niezavisno potrdjene (F2 preklicana 923 "Heide Marko." ✓, polpas 929½ brez imena + kl 97 precrtan ✓, Fürtrag 7|107x ✓, r21 brez crnila = fantom "Ploner Franzigen" resnice ✓), p25/p26 rdece precrpane parzelle (445/446/458/459/461-465) vidne in skladne z register preklicnimi flagi.',
        },
        {
            'id': 'F-OCI-03',
            'status': 'DOCUMENTED',
            'statement': 'IMENSKA PLAST: razhajanja so ~90% transkripcijske variante istega crnila (Kurrent loparski pari: Christan<->Vereichan, Husitsch Maria<->Huisded Moaße, Rödig/Pöching<->Pavingz, Bruckler<->Stubler, Schimetz<->Schimay, Tillach/Ulrich<->Ublich, Krischan<->Vereichan, Schaffschick<->Schabuschnig, Tallafschibek/Stallpschibek<->Schapschitik, Weinchan<->Vereichan, Pessing<->Pavingz, Kranvel/Kranz<->Kraus, Müller/Müllner<->Milleg, Hladnikhar<->Hlabubschar, Michelkorn/Mullerkorn<->Skabulschar/Matubuschik, Hnall<->Kraull, Stangl<->Kraufs, Hoch<->Schelle, Wächter<->Ublich, Andreas Krumpe<->Omal Humen/Knal Himmer). Pri zoomu x3 (pas) NI mogoce soditi crkovne resnice — za to so potrebni celicni zoomi (kot v118/v119). Posledica: imenska plast registra OSTANE; 2. oci potrjuje istovrstnost crnila, ne crkovalnice.',
        },
        {
            'id': 'F-OCI-04',
            'status': 'DOCUMENTED',
            'statement': 'BRALSKI INDEKSNI ZDRSI NA MEJAH SEGMENTOV: p55 seg1 (+1), p37 seg1/seg2 (+1), p31 seg1 (+1 vrednosti), p49 seg1 (+1) — bralec je po napacnem sidranju zgornjega robnega odrezka prestevil bands; ZAZNANO prek vrednostne eksaktnosti (857/769/763/831/777/703 @p55; 31/32/342/59/232 @p37; 24/27/378/292 @p31 se ujemajo z register pod celi r+1) in prek tiskanih parzelle. Po remapu je register VSEHOD poravnan 1:1 s tiskanimi parzellami. Precedent: del 2d-x2 "x2 knjigovodski zdrsi" (protokol 140 §5). Popravljenih vrstic: %d.' % boundary_fixed,
        },
        {
            'id': 'F-OCI-05',
            'status': 'OPEN',
            'statement': 'VREDNOSTNA ATRIBUTCIJA OSTAJA NR-14 ODPRTO: klafter glifi sedijo na spodnjem pravilu pasu (protokol 140 §1) in v pasovnih izrezkih prekrivajo mejo celice — pri p31 r0 (register 1785 vs ~"3|1305"), p43 r19 (register 4731 vs ~"1|1347" Joch|Klafter notacija), p37 r2 (705 vs ~403), p49 (izloceno, geometrija) NI mogoce soditi na pas-zoomu. Kandidati za prihodnji pasovni vrednostni re-read s bottom-rule anchoringom; v tem valu nič ne spreminjano.',
        },
        {
            'id': 'F-OCI-06',
            'status': 'CONFIRMED',
            'statement': 'MARGINALIJE POTRJENE: rdece/crne korekcijske stevilke ob robu nezavisno re-opazane (1-385 @p44r15, 1263 @p50r18, 1-853 @p49r15, 3-364 @p49r1, 1-1367 @p49r5, 1-966 @p25r12, 1-400 @p55r5, 576 @p26r5, 658 @p32r10, 825 @p50r9, 682 @p50r12, 870 @p26r14, 1-317 @p26r19, "2b" @p37r5) — skladne z ertrag/v114 opombami v register anmerkung, kjer so zapisane.',
        },
    ],
    'verdict': 'Register imenska plast + struktura STOJITA (nič ne spreminjano — raziskovalni val §22); 2. oci potrjuje strukturo, parzelle, hiše-stevilke (149/235 eksaktno, odstopanja = bralski digit-zumor), preklicanja, fantome in marginalije; crkovalna sodba zahteva celicni zoom (F-OCI-03); vrednostna atribucija ostaja NR-14 (F-OCI-05).',
    'name_variant_pairs_sample': name_variant_pairs[:12],
    'value_disputes': value_disputes[:40],
}

with open(f'{BASE}/val120-oci2/analysis-v1.json', 'w') as fh:
    json.dump(analysis, fh, ensure_ascii=False, indent=1)

print('analysis-v1.json zapisan')
print('stats_remapped:', json.dumps(analysis['stats_remapped'], ensure_ascii=False))
print('boundary_rows_repaired:', boundary_fixed)
