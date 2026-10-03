#!/usr/bin/env python3
"""Val 124 — F-V123-01 p7 dvojni-anchor strukturni popravek + 6 DISPUTE razrešitev.

STRUKTURA p7 (dokazana v readings-v124.json):
  - knjiga ima 21 podatkovnih vrstic (20 Nro 81–100 + 1 VSTAVLJENA stisnjena
    vrstica Nro 92 med 91 in 93) + EXTRA vrstico brez Nro (110 ud.) + Fürtrag;
  - v57 bralec je PRESKOKIL udarjeno 54 (vrstica 5) => vrednosti od r4 naprej
    zamaknjene za eno vrstico; vstavljena vrstica je svojo 54 dala r10;
  - popravek: 7 vrednostnih popravkov (r4..r10), 1 NOVA vrstica (r11),
    3 re-sidranja z digitcmp popravki (224→321, 945→262, 297→397),
    ertrag '1 -381' r3→r4, identitete r12..r19 presnimljene iz starih r12..r19
    (ime/hiša/kultur sledijo vrsticam), EXTRA vrstica (ditto-Strauß, 110)
    na r20, fantom (Fürtrag) ostane zadnji (r21).
DISPUTE razrešitve: p10 r18 potrjena 1038; p11 r3 79→99; p11 r20/21 potrjeni;
  p12 r17 82→53; p13 r17 112→182; p14 r0 687→187. BONUS: p11 r15 382→582.

GUARD: vsaka sprememba preveri deklarirano-staro vrednost ≟ register
(fail-fast). Idempotentno: drugi tek zazna v124 stanje in ne stori nič.
0 VLM. Ne dotakne se: osebna plast (F-SYNC-04), KG vsebina (builder ne bere
klafter vrednosti); imenske napake v57 = F-V124-01 (ločen val).
"""
import json
import os
import sys

REG_PATH = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
CHANGES_PATH = os.path.join(OUT_DIR, 'changes-v124.json')

EXPECTED_TOTAL = 2875  # pred valom 124

# polja, ki sledijo IDENTITETI (ime/hiša/kultur — leva stran + v57 imenski pass)
IDENTITY_FIELDS = ['owner_original', 'owner_was_ditto', 'wohnort', 'stand',
                   'kultur', 'haus_no', 'reading_pass']
# polja, ki sledijo VREDNOSTNEMU sloju (desna stran) — ostanejo z vrstico
# (anmerkung je hibrid: 'Wiese [rot]' spremembe sledijo pasu, posebne opombe
# so dokumentirane v protokolu 147 §3)


def load():
    with open(REG_PATH) as f:
        return json.load(f)


def save(reg):
    with open(REG_PATH, 'w') as f:
        json.dump(reg, f, ensure_ascii=False, indent=1)
        f.write('\n')


def firsts(reg):
    out = {}
    for i, r in enumerate(reg):
        pg = r['page']
        if pg not in out:
            out[pg] = i
    return out


def note(row, text):
    a = row.get('anmerkung') or ''
    row['anmerkung'] = (a + ' ' if a else '') + text


def guard(row, page, r, field, expected):
    actual = row.get(field)
    if str(actual) != str(expected):
        raise SystemExit(f'GUARD FAIL p{page} r{r} {field}: deklarirano '
                         f'{expected!r}, register {actual!r}')


def main():
    reg = load()
    total_pre = len(reg)
    print(f'register: {total_pre} vrstic')

    # ---- idempotencia ------------------------------------------------------
    probe = [r for r in reg if r['page'] == 7]
    if any(r.get('klafter_pre_v124') or 'v124' in str(r.get('anmerkung') or '')
           for r in probe):
        print('v124 že vgrajeno — idempotentni izhod')
        return

    if total_pre != EXPECTED_TOTAL:
        raise SystemExit(f'GUARD FAIL: pričakovano {EXPECTED_TOTAL} vrstic, '
                         f'dejansko {total_pre}')

    f7 = firsts(reg)[7]
    old = reg[f7:f7 + 21]
    if len(old) != 21:
        raise SystemExit('GUARD FAIL: p7 nima 21 vrstic')

    # ---- GUARD: deklarirano-staro p7 ---------------------------------------
    expected_p7 = [
        ('Schimeczkhanl', '774'), ('Poiding Hanl', '187'),
        ('Lappary Marbl', '283'), ('Lappary Marbl', '160'),
        ('Lappary Marbl', '241'), ('Schimeczkhanl', '19'),
        ('Lappary Mihel', '31'), ('(R)abitscher Marbl', '169'),
        ('Strauß Georg', '103'), ('Poiding Matthl', '36'),
        ('Schimez Hanl', '54'), ('(K)hanzl Valen', '52'),
        ('Poiding Matthl', '44'), ('Peders Marbl', '224'),
        ('(R)abitscher Georg', '315'), ('Strauß Georg', '945'),
        ('(R)abitscher Marbl', '297'), ('(R)abitscher Marbl', '187'),
        ('(R)abitscher Marbl', '58'), ('Strauß Georg', '110'),
        (None, None),
    ]
    for r, (nm, kl) in enumerate(expected_p7):
        if nm is None:
            if old[r].get('owner_original') not in ('', None):
                raise SystemExit(f'GUARD FAIL p7 r{r}: pričakovano prazno '
                                 f'ime, dejansko '
                                 f'{old[r].get("owner_original")!r}')
            continue
        guard(old[r], 7, r, 'owner_original', nm)
        guard(old[r], 7, r, 'klafter', kl)
    guard(old[3], 7, 3, 'ertrag_kr', '1 -381')

    changes = []

    # ---- 1) vrednostni popravki r0..r10 (ne prestavljajo se) ---------------
    fixes = [(4, '241', '54'), (5, '19', '241'), (6, '31', '49'),
             (7, '169', '31'), (8, '103', '169'), (9, '36', '138'),
             (10, '54', '56')]
    for r, pre, post in fixes:
        guard(old[r], 7, r, 'klafter', pre)
        old[r]['klafter_pre_v124'] = pre
        old[r]['klafter'] = post
        note(old[r], f'[v124: ∅|{pre} -> ∅|{post} dvojni-anchor F-V123-01 — '
                     f'v57 preskok udarjene 54 (vrstica 5, Nro 85), vrednosti '
                     f'eno vrstico nizko; zdaj pravilno sidrano]')
        changes.append({'page': 7, 'r': r, 'field': 'klafter', 'pre': pre,
                        'post': post})

    # ---- 2) ertrag '1 -381' r3 -> r4 ----------------------------------------
    old[4]['ertrag_kr'] = '1 -381'
    old[3]['ertrag_kr'] = ''
    note(old[4], '[v124: ertrag "1 -381" premeščen z r3 — rdeča kapitalna '
                 'opomba stoji ob vrstici 5 (Nro 85)]')
    changes.append({'page': 7, 'r': 4, 'field': 'ertrag_kr', 'pre': '',
                    'post': '1 -381 (premekanje r3→r4)'})

    # ---- 3) identitete starih r11..r20 (za presnitev) ----------------------
    ident = [{f: old[i].get(f) for f in IDENTITY_FIELDS}
             for i in range(11, 21)]
    anms = [old[i].get('anmerkung') for i in range(11, 21)]

    # ---- 4) VSTAVLJENA vrstica (Nro 92) kot novi r11 -----------------------
    src = old[11]
    ins = dict(src)  # kopija identitete (K)hanzl Valen + polj
    ins.update({
        'page': 7,
        'jaethe': '',
        'klafter': '54',
        'classe': '', 'ertrag_fl': '', 'ertrag_kr': '',
        'capital_fl': '', 'capital_kr': '',
        'haus_no': '56',  # 26 → 56 (2↔5 varianta; knjiga: hiša 56)
        'anmerkung': ('[v124 NOVA VRSTICA (F-V123-01): vstavljena vrstica Nro '
                      '92 — stisnjena med 91 in 93 (leva stran brez pravila, '
                      'desna pravilo 585–603); vrednost 54 udarjena; Nro 92 '
                      'rdeče prečrtan (prodaja 1814); ime v57 "(K)hanzl '
                      'Valen" ohranjeno (stisnjena pisava nečitljiva — '
                      'F-V124-01); hiša 56 (prej 26 pri napačni vrstici — '
                      '2↔5 varianta po knjigi)]'),
        'reading_pass': 'v124-dvojni-anchor',
        'page_observations': '',
        'page_observations_v112': '',
        'klafter_pre_v124': None,
    })
    del ins['klafter_pre_v124']
    p7 = old[:11] + [ins] + old[11:]
    changes.append({'page': 7, 'r': 11, 'field': 'NEW_ROW', 'pre': None,
                    'post': 'vstavljena vrstica Nro 92, kl 54 (ud.), hiša 56'})

    # po vstavitvi: p7[12..21] = stari r11..r20

    # ---- 5) identitete r12..r19 := stari r12..r19 ---------------------------
    # (ime/hiša/kultur sledijo vrsticam 13..20; anmerkung OSTANE z vrstico —
    #  sledi vrednostnemu sloju; posebni primeri dokumentirani)
    for k in range(12, 20):
        src_ident = ident[k - 11]  # stari r_k
        for f in IDENTITY_FIELDS:
            p7[k][f] = src_ident[f]

    # ---- 6) re-sidranja z digitcmp (stari r13/r15/r16 => novi 14/16/17) ----
    # (identitete so že presnimljene — GUARD samo na vrednosti)
    reshift = [(14, '224', '321'), (16, '945', '262'), (17, '297', '397')]
    for r, pre, post in reshift:
        guard(p7[r], 7, r, 'klafter', pre)
        p7[r]['klafter_pre_v124'] = pre
        p7[r]['klafter'] = post
        note(p7[r], f'[v124: ∅|{pre} -> ∅|{post} dvojni-anchor F-V123-01 — '
                    f're-sidrano na pravo vrstico; zoom ×18]')

    # ---- 7) r19 = Nro 100 (Strauß Georg) + EXTRA r20 + fantom r21 -----------
    # p7[19] = stari r18 ((R)abitscher Marbl, 58) → identiteta = stari r19
    # (Strauß Georg, 48); vrednost 58 = vrstica 20 ✓ (že pravilna)
    guard(p7[19], 7, 19, 'klafter', '58')
    # p7[20] = stari r19 (Strauß Georg, 110) → postane EXTRA vrstica
    guard(p7[20], 7, 20, 'klafter', '110')
    for f in IDENTITY_FIELDS:
        p7[20][f] = '' if f != 'owner_was_ditto' else True
    p7[20]['owner_original'] = ''
    p7[20]['owner_was_ditto'] = True
    p7[20]['haus_no'] = ''
    p7[20]['kultur'] = ''
    p7[20]['reading_pass'] = 'v124-dvojni-anchor'
    p7[20]['anmerkung'] = ('[v124 NOVA VRSTICA (F-V123-01): EXTRA vrstica '
                           'IZVEN Nro sekvence — ditto-Strauß (brez lastnega '
                           'imena), vrednost 110 udarjena; v112 "r19 trojna '
                           'oznaka" (110 + 7|373 + 1|1147) se nanaša na ta '
                           'pas in Fürtrag; brez berljive hiše — F-V124-01]')
    p7[20]['page_observations'] = ''
    p7[20]['page_observations_v112'] = ''
    changes.append({'page': 7, 'r': 20, 'field': 'NEW_ROW', 'pre': None,
                    'post': 'EXTRA vrstica (ditto-Strauß), kl 110 (ud.)'})

    # p7[21] = stari r20 (fantom) — anmerkung dopolnjena
    guard(p7[21], 7, 21, 'owner_original', '')
    note(p7[21], '[v124: fantom = Fürtrag vrstica (2|687 → rdeče 1140, '
                 'podstolpec 7|373 + 1|1147); EXTRA vrstica (110) je sedaj '
                 'lastna podatkovna vrstica r20]')

    if len(p7) != 22:
        raise SystemExit(f'GUARD FAIL: p7 ima {len(p7)} vrstic po vgradnji, '
                         f'pričakovano 22')

    # ---- 8) page_observations: F-V123-01 rešitev ---------------------------
    po = p7[0].get('page_observations') or ''
    resolution = ('[v124 F-V123-01 REŠEN: dvojni-anchor (ime+vrednost) — '
                  'v57 preskok udarjene 54 (vrstica 5, Nro 85); vstavljena '
                  'vrstica Nro 92 (hiša 56) = nova vrstica z 54 ud.; EXTRA '
                  'vrstica (ditto-Strauß, brez Nro) = 110 ud.; 22 vrstic '
                  '(21 podatkovnih + fantom); 7 popravkov + 3 re-sidranja + '
                  '2 novi vrstici; imenska/hišna plast = F-V124-01]')
    p7[0]['page_observations'] = (po + ' | ' if po else '') + resolution

    reg[f7:f7 + 21] = p7

    # ---- 9) DISPUTE razrešitve (p10/p11/p12/p13/p14) -----------------------
    def row_of(pg, r):
        idx = firsts(reg)[pg] + r
        return reg[idx], idx

    # p10 r18: 1038 potrjena
    row, idx = row_of(10, 18)
    guard(row, 10, 18, 'klafter', '1038')
    note(row, '[v124: disputa val 123 razrešena — tretja številka = 3 (odprt '
              'zgornji lok; cf. r5 1148 zaprti lok 8, digitcmp); 1038 '
              'potrjena]')
    changes.append({'page': 10, 'r': 18, 'field': 'anmerkung', 'pre': '',
                    'post': 'disputa razrešena (1038 potrjena)'})

    # p11 r3: 79 → 99
    row, idx = row_of(11, 3)
    guard(row, 11, 3, 'klafter', '79')
    row['klafter_pre_v124'] = '79'
    row['klafter'] = '99'
    note(row, '[v124: ∅|79 -> ∅|99 dvojni-anchor — prva številka ima zaprto '
              'zanko + rep = 9 (7 brez zanke cf. r17 78; 8 brez repe cf. r8 '
              '280); druga = 9]')
    changes.append({'page': 11, 'r': 3, 'field': 'klafter', 'pre': '79',
                    'post': '99'})

    # p11 r15: 382 → 582 (bonus)
    row, idx = row_of(11, 15)
    guard(row, 11, 15, 'klafter', '382')
    row['klafter_pre_v124'] = '382'
    row['klafter'] = '582'
    note(row, '[v124: ∅|382 -> ∅|582 dvojni-anchor — raven vrh = 5 (v123 "5 '
              '= flat top (ne 3)"); nova najdba zunaj disput]')
    changes.append({'page': 11, 'r': 15, 'field': 'klafter', 'pre': '382',
                    'post': '582'})

    # p11 r20/r21: potrjene (samo anmerkung)
    row, idx = row_of(11, 20)
    guard(row, 11, 20, 'klafter', '211')
    note(row, '[v124: disputa val 123 razrešena — 211 v svojem pasu (top-'
              'anchor pravilo 938); 185 v pasu r21]')
    row, idx = row_of(11, 21)
    guard(row, 11, 21, 'klafter', '185')
    note(row, '[v124: disputa val 123 razrešena — 185 (udarjeno) potrjena v '
              'pasu r21]')

    # p12 r17: 82 → 53
    row, idx = row_of(12, 17)
    guard(row, 12, 17, 'klafter', '82')
    row['klafter_pre_v124'] = '82'
    row['klafter'] = '53'
    note(row, '[v124: ∅|82 -> ∅|53 dvojni-anchor — 5 raven vrh (cf. 650), 3 '
              'dve skodeli; "426" = artefakt detekcije; "— 20" v E. coni = '
              'ločen zapis]')
    changes.append({'page': 12, 'r': 17, 'field': 'klafter', 'pre': '82',
                    'post': '53'})

    # p13 r17: 112 → 182
    row, idx = row_of(13, 17)
    guard(row, 13, 17, 'klafter', '112')
    row['klafter_pre_v124'] = '112'
    row['klafter'] = '182'
    note(row, '[v124: ∅|112 -> ∅|182 dvojni-anchor — srednja = 8 (dvojna '
              'zanka), ne 1]')
    changes.append({'page': 13, 'r': 17, 'field': 'klafter', 'pre': '112',
                    'post': '182'})

    # p14 r0: 687 → 187
    row, idx = row_of(14, 0)
    guard(row, 14, 0, 'klafter', '687')
    row['klafter_pre_v124'] = '687'
    row['klafter'] = '187'
    note(row, '[v124: ∅|687 -> ∅|187 dvojni-anchor — 1 brez spodnje zanke '
              '≠ 6; 8 okrogel vrh ≠ 5 raven vrh; 7]')
    changes.append({'page': 14, 'r': 0, 'field': 'klafter', 'pre': '687',
                    'post': '187'})

    # ---- shrani -------------------------------------------------------------
    save(reg)
    with open(CHANGES_PATH, 'w') as f:
        json.dump({'val': 124, 'total_pre': total_pre,
                   'total_post': len(reg), 'changes': changes},
                  f, ensure_ascii=False, indent=1)
        f.write('\n')

    print(f'vgradnja končana: {total_pre} → {len(reg)} vrstic; '
          f'{len(changes)} sprememb')

    # ---- varovalke ----------------------------------------------------------
    reg2 = load()
    f7b = firsts(reg2)[7]
    p7b = reg2[f7b:f7b + 22]
    assert len(p7b) == 22, 'p7 mora imeti 22 vrstic'
    vals = [r['klafter'] for r in p7b]
    assert vals == ['774', '187', '283', '160', '54', '241', '49', '31',
                    '169', '138', '56', '54', '52', '44', '321', '315',
                    '262', '397', '187', '58', '110', ''], vals
    names = [r['owner_original'] for r in p7b]
    assert names[11] == '(K)hanzl Valen' and p7b[11]['haus_no'] == '56'
    # r12..r19: identitete = stari r12..r19 (sledijo vrsticam 13..20)
    assert names[12] == 'Poiding Matthl' and names[13] == 'Peders Marbl'
    assert names[14] == '(R)abitscher Georg' and names[15] == 'Strauß Georg'
    assert names[16] == '(R)abitscher Marbl' and names[17] == '(R)abitscher Marbl'
    assert names[18] == '(R)abitscher Marbl' and names[19] == 'Strauß Georg'
    assert names[20] == '' and p7b[20]['klafter'] == '110'
    assert names[21] == '' and p7b[21]['klafter'] == ''
    assert p7b[4]['ertrag_kr'] == '1 -381'
    assert 'F-V123-01 REŠEN' in p7b[0]['page_observations']
    assert reg2[firsts(reg2)[11] + 3]['klafter'] == '99'
    assert reg2[firsts(reg2)[11] + 15]['klafter'] == '582'
    assert reg2[firsts(reg2)[12] + 17]['klafter'] == '53'
    assert reg2[firsts(reg2)[13] + 17]['klafter'] == '182'
    assert reg2[firsts(reg2)[14] + 0]['klafter'] == '187'
    assert reg2[firsts(reg2)[10] + 18]['klafter'] == '1038'
    s = sum(int(r['klafter']) for r in p7b[:21])
    print(f'p7 vsota vrstic 1–21 = {s} QK (prej 4289)')
    print('VSE VAROVALKE OK')


if __name__ == '__main__':
    main()
