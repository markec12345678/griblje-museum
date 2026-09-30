#!/usr/bin/env python3
"""Val 114 — VGRADNJA vrednostnega re-reada PS p25–p55 (+ strukturni re-read p19/p20 + p34 forenzika).

Vhodi: band-v113/reading-v114/*.json (agentov vid, 0 VLM; p25–p38 prejšnja seja,
p39–p55 + p19/p20 ta seja).
Pravila (1:1 val 112/113 vzorec):
  - F-PV-07 premestitve: strani z vrednostmi v napačnem polju (v57 jae, stran QK)
    — p28/p29/p30/p34/p35/p37 (page-level) + eksplicitni 'move' verdikti p40/p41/p55
  - F-PV-07-SPLIT (marker '[F-PV-07-SPLIT val 114: ...]'): razcep zlitih parov
    (p40 r11 1|599, p41 r16 1|77, p47 r20 1|695[fix], p55 r17 1|329) + markerji
    ze-obstojecih split struktur (p25 r12, p26 r10, p27 r0, p28 r4/r5/r6/r12/r13,
    p31 r0, p32 r13, p33 r16/r20, p36 r0/r19, p47 r0, p49 r0/r2, p51 r9/r10,
    p52 r1, p53 r2/r3/r6, p54 r5/r15) za pass3 izključitev
  - POPRAVEK posameznih števk (v57 napake; vse s snimkami pre_v114)
  - odprta razhajanja + prečrtane vrednosti: anmerkung add-only (§4, TRANSCRIBED=0)
  - strukturna forenzika: p40/p48/p49/p34 — v57 izpustil vrstico (dokazano s sidri);
    BREZ vstavljanja (2871 guard), popravki preko mapiranja + page_observations_v114
  - p19/p20: POMIK iz val 113 OVRŽEN (z3 grid artifakt — 11+5 sidrov na istih indeksih);
    page_observations_v114 + POPRAVEK r2/r5 (p20), r3/r7/r8/r9/r17 (p19)
  - posebni primeri: p39 r0 (tekač 201 + zlitje 1774 = 761+774 + ertrag 1535),
    p50 r20 (fantom FUR Joch 4), p52 r19 (10|7817 -> 245), p29 r0 (ulomek 16½),
    haus popravki p40
  - reading_pass := 'v114-ps-reread' (p19, p20, p25–p55)
  - fail-fast: guard 2871 vrstic + 139 v88 + 1755 v86 + 265 v112 + 120 v113 + changes guard
Izhod: register.json + band-v113/register-v114-changes.json
"""
import json
import os
import re
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
RD = f'{REPO}/research-griblje/ps-n83/band-v113/reading-v114'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v114-changes.json'

SPLIT_MARKER = '[F-PV-07-SPLIT val 114: Joch|Klafter notacija — jae=Joch stavec, ni parcelna stevilka]'

PAGE_LEVEL_MOVE = {28, 29, 30, 34, 35, 37}
COVERED = [19, 20] + list(range(25, 56))

# ze-obstojeci spliti (jae=Joch stavec + kla=Klafter) brez markerja -> pass3 izkljucitev
SPLIT_SWEEP = [(25, 12), (26, 10), (27, 0), (28, 4), (28, 5), (28, 6), (28, 12), (28, 13), (40, 4),
               (31, 0), (32, 13), (33, 16), (33, 20), (36, 0), (36, 19), (47, 0),
               (49, 0), (49, 2), (51, 9), (51, 10), (52, 1), (53, 2), (53, 3), (53, 6),
               (54, 5), (54, 15)]

POP_RE = re.compile(r'(\d+(?:½|¼)?)\s*->\s*(\d+(?:½|¼)?)')
PLACEHOLDER_RE = re.compile(r'^r\d+$')


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1755, f'guard: 1755 v86-colonial-tiles (najdeno {n_v86})'
    n_v112 = sum(1 for r in reg if r.get('reading_pass') == 'v112-ps-reread')
    assert n_v112 == 265, f'guard: 265 v112-ps-reread (najdeno {n_v112})'
    n_v113 = sum(1 for r in reg if r.get('reading_pass') == 'v113-ps-reread')
    assert n_v113 == 120, f'guard: 120 v113-ps-reread (najdeno {n_v113})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v114-changes.json ze obstaja (dvozni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'moves': 0, 'split_markers': 0, 'value_fixes': 0, 'anmerkung_adds': 0,
             'haus_fixes': 0, 'clears': 0, 'pages_covered': []}

    def snap(r, field):
        if f'{field}_pre_v114' not in r:
            r[f'{field}_pre_v114'] = r.get(field, '')

    def set_field(idx, r, field, new, kind, note=''):
        old = r.get(field, '')
        if old == new:
            return False
        snap(r, field)
        rec = {'index': idx, 'page': r['page'], 'type': kind, 'field': field,
               'old': old, 'new': new}
        if note:
            rec['note'] = note
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        snap(r, 'anmerkung')
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

    def add_page_obs(r, txt):
        r['page_observations_v114'] = txt
        changes.append({'page': r['page'], 'type': 'page_observations_v114', 'text': txt})

    def do_move(idx, r, new_kla=None, note=''):
        jae = (r.get('jaethe') or '').strip()
        kla = (r.get('klafter') or '').strip()
        assert kla == '', f'p{r["page"]}: move zahteva prazno kla, ima "{kla}"'
        assert jae != '', f'p{r["page"]}: move zahteva neprazno jae'
        if set_field(idx, r, 'klafter', new_kla if new_kla is not None else jae, 'v114_fpv07_move', note or 'jaethe->klafter (F-PV-07)'):
            r['jaethe_pre_v114'] = jae
            r['jaethe'] = ''
            stats['moves'] += 1

    def cur(r, field):
        return (r.get(field) or '').strip()

    # ------------ posebni posegi (izrecno utemeljeni v reading JSON) ------------
    def special(idx, r, page, i):
        if (page, i) == (39, 0):
            assert (r.get('jaethe'), r.get('klafter')) == ('201', '1774'), f'p39 r0 nepriakovano {r}'
            set_field(idx, r, 'jaethe', '', 'v114_ocistka', 'tekač levega stolpca (201), ni Joche')
            set_field(idx, r, 'klafter', '774', 'v114_value_fix', 'celica: 761+774 zloženo; v57 zbral "1774"')
            set_field(idx, r, 'ertrag_fl', '1535', 'v114_ertrag_add', 'jasen črnilo; 1535 = 761+774')
            add_anm(idx, r, '[v114: dve vrednosti v celici 761+774; ertrag 1535 = vsota; v57 "1774" zlitje]')
            return True
        if (page, i) == (40, 11):
            assert r.get('jaethe') == '599' and not r.get('klafter'), f'p40 r11 {r}'
            set_field(idx, r, 'jaethe', '1', 'v114_split_fix', 'SPLIT 1|599; v57 599 v jae')
            set_field(idx, r, 'klafter', '599', 'v114_split_fix', 'SPLIT 1|599')
            set_field(idx, r, 'haus_no', '1/21', 'v114_haus_fix', 'Nro jasno 21, ne 31')
            stats['haus_fixes'] += 1
            add_anm(idx, r, SPLIT_MARKER)
            stats['split_markers'] += 1
            return True
        if (page, i) == (40, 12):
            assert r.get('jaethe') == '4 - 65', f'p40 r12 {r}'
            set_field(idx, r, 'jaethe', '', 'v114_ocistka', 'celica na strani PRAZNA; "4 - 65" = zlitje s preklicano p13')
            add_anm(idx, r, '[v114: v57 "4 - 65" = preklicana vrstica p13 (1|65 rdeče prečrtana) — p12 (Wunderling) je prazna]')
            return True
        if (page, i) == (40, 13):
            assert r.get('jaethe') == '4 - 660', f'p40 r13 {r}'
            set_field(idx, r, 'jaethe', '4', 'v114_split_fix', 'SPLIT 4|860')
            set_field(idx, r, 'klafter', '860', 'v114_split_fix', '8 za 6 (v57 660)')
            add_anm(idx, r, '[v114: preklicana vrstica p13 — tekač 734 + vrednost rdeče prečrtana; v57 je vrstico izpustil in zlil z r12]')
            add_anm(idx, r, SPLIT_MARKER)
            stats['split_markers'] += 1
            return True
        if (page, i) == (40, 14):
            assert r.get('jaethe') == '589' and not r.get('klafter'), f'p40 r14 {r}'
            set_field(idx, r, 'klafter', '529', 'v114_value_fix', 'preko mapiranja r14=p15: 589->529 (srednja 2 z zanko) + move')
            r['jaethe_pre_v114'] = r.get('jaethe', '')
            r['jaethe'] = ''
            stats['moves'] += 1
            stats['value_fixes'] += 1
            add_anm(idx, r, '[v114: precrzano rdece (tekač 735)]')
            return True
        if (page, i) == (40, 16):
            assert r.get('jaethe') == '989' and not r.get('klafter'), f'p40 r16 {r}'
            set_field(idx, r, 'klafter', '849', 'v114_value_fix', 'preko mapiranja r16=p17: 989->849 [? dvom prva; srednja ZAGOTOVO 4] + move')
            r['jaethe_pre_v114'] = r.get('jaethe', '')
            r['jaethe'] = ''
            stats['moves'] += 1
            stats['value_fixes'] += 1
            return True
        if (page, i) in ((40, 18), (40, 19)):
            do_move(idx, r)
            set_field(idx, r, 'haus_no', '1/64' if (page, i) == (40, 18) else '1/65', 'v114_haus_fix', 'Nro 64, ne 69' if (page, i) == (40, 18) else 'Nro 65, ne 68')
            stats['haus_fixes'] += 1
            return True
        if (page, i) == (41, 16):
            assert r.get('jaethe') == '1 / 77' and not r.get('klafter'), f'p41 r16 {r}'
            set_field(idx, r, 'jaethe', '1', 'v114_split_fix', 'SPLIT formalizacija 1|77')
            set_field(idx, r, 'klafter', '77', 'v114_split_fix', 'SPLIT formalizacija 1|77')
            add_anm(idx, r, SPLIT_MARKER)
            stats['split_markers'] += 1
            return True
        if (page, i) == (19, 9):
            # v57 notacija "1 659" (presledni split) ze v klafter polju — samo popavek stevilke
            assert r.get('klafter') == '1 659', f'p19 r9 {r}'
            set_field(idx, r, 'klafter', '1 639', 'v114_value_fix', 'srednja 3 (dva skodelca), ni 5 — split "1|639"')
            return True
        if (page, i) == (29, 0):
            assert r.get('jaethe') == '16' and not r.get('klafter'), f'p29 r0 {r}'
            set_field(idx, r, 'klafter', '16½', 'v114_value_fix', 'val 57 izpustil ulomek — dvignjeni glif ½')
            r['jaethe_pre_v114'] = r.get('jaethe', '')
            r['jaethe'] = ''
            stats['moves'] += 1
            add_anm(idx, r, '[v114: videno 16½ (dvignjeni glif); v57 "16"]')
            return True
        if (page, i) == (47, 20):
            assert r.get('jaethe') == '1' and r.get('klafter') == '692', f'p47 r20 {r}'
            set_field(idx, r, 'klafter', '695', 'v114_value_fix', 'zadnja 5 z zastavico, ni 2')
            add_anm(idx, r, SPLIT_MARKER)
            stats['split_markers'] += 1
            return True
        if (page, i) == (50, 20):
            assert r.get('jaethe') == '4' and not r.get('klafter'), f'p50 r20 {r}'
            set_field(idx, r, 'jaethe', '', 'v114_ocistka', 'fantom: v57 je FUR Joch 4 vpisal kot vrstico')
            add_anm(idx, r, '[v114: r20 fantom — FUR "48 Fürtrag: 4|386"; v57 Joch 4 kot vrstica]')
            return True
        if (page, i) == (52, 19):
            assert r.get('jaethe') == '10' and r.get('klafter') == '7817', f'p52 r19 {r}'
            set_field(idx, r, 'jaethe', '', 'v114_value_fix', 'stran nima Joch')
            set_field(idx, r, 'klafter', '245', 'v114_value_fix', 'stran jasno 245; v57 "10|7817" nepojasnjena napaka')
            add_anm(idx, r, '[v114: v57 "10|7817" = nepojasnjena napaka; stran jasno 245]')
            return True
        if (page, i) == (55, 17):
            assert r.get('jaethe') == '329' and not r.get('klafter'), f'p55 r17 {r}'
            set_field(idx, r, 'jaethe', '1', 'v114_split_fix', 'SPLIT 1|329')
            set_field(idx, r, 'klafter', '329', 'v114_split_fix', 'SPLIT 1|329')
            add_anm(idx, r, SPLIT_MARKER)
            stats['split_markers'] += 1
            return True
        if (page, i) == (37, 0):
            add_anm(idx, r, '[v114: pas vsebuje 761 (visoko) IN 774 (nizko); register jae="701" kla="774" — neujemljivo; POPRAVEK kandidat ali Übertrag — odprto]')
            return True
        return False

    # ---------------- p34: POMIK ovržen, r15–r19 override ----------------
    def p34_override(i, v):
        if i == 18:
            return 'soglasje + move', '[v114: razhajanje 1038 vs 1088[?] — odprto; pomik ovržen]'
        if i in (15, 16, 17, 19):
            return 'soglasje + move', '[v114: pomik val 113 ovržen — vrstica 1:1, vrednost vidna]'
        return None

    # ---------------- glavna zanka ----------------
    for page in COVERED:
        rows = by_page.get(page)
        assert rows, f'page {page} manjka v registerju'
        rd = json.load(open(f'{RD}/p{page}.json'))
        va = rd['value_audit']
        for i, (idx, r) in enumerate(rows):
            if special(idx, r, page, i):
                r['reading_pass'] = 'v114-ps-reread'
                continue
            v = va.get(f'r{i}')
            override = p34_override(i, v) if page == 34 else None
            if override:
                verdict, extra_anm = override
                v = dict(v)
                v['verdict'] = verdict
            else:
                if not cur(r, 'jaethe') and not cur(r, 'klafter'):
                    # register vrstica ze prazna (npr. p49 r20 FUR oznaka) — brez vgrajnje
                    r['reading_pass'] = 'v114-ps-reread'
                    continue
                assert v is not None, f'p{page} r{i}: manjka value_audit'
                extra_anm = None
            verdict = v['verdict']
            j, k = (v.get('j') or '').strip(), (v.get('k') or '').strip()
            oj, ok_ = (v.get('old_j') or '').strip(), (v.get('old_k') or '').strip()
            j_real = j and not PLACEHOLDER_RE.match(j)

            if page == 34 and extra_anm:
                add_anm(idx, r, extra_anm)

            m = POP_RE.search(verdict)
            pop_old, pop_new = (m.group(1), m.group(2)) if m else (None, None)

            if verdict.startswith('PRAZNO'):
                if ok_ and cur(r, 'klafter') == ok_:
                    set_field(idx, r, 'klafter', '', 'v114_ocistka', verdict[:60])
                    stats['clears'] += 1
                if oj and cur(r, 'jaethe') == oj:
                    set_field(idx, r, 'jaethe', '', 'v114_ocistka', verdict[:60])
                    stats['clears'] += 1
                add_anm(idx, r, f'[v114: {verdict[:110]}]')
            elif verdict.startswith('move'):
                # premestitev jae->klf; vir = dejanska register vrednost
                if pop_new is not None:
                    src = cur(r, 'jaethe') or cur(r, 'klafter')
                    assert src == pop_old or ok_ == pop_old or oj == pop_old, \
                        f'p{page} r{i}: move+POPRAVEK src "{src}" != {pop_old}'
                    do_move(idx, r, pop_new, f'POPRAVEK {pop_old}->{pop_new} ob premestitvi')
                    stats['value_fixes'] += 1
                else:
                    expect = j if j_real else (oj or ok_ or j)
                    assert cur(r, 'jaethe') == expect or ok_ == expect or oj == expect or j == expect, \
                        f'p{page} r{i}: move vir "{cur(r, "jaethe")}" ne ustreza branju "{expect}"'
                    do_move(idx, r)
                if 'precrz' in verdict:
                    frag = verdict.split(';', 1)[-1].strip()
                    if 'precrz' in frag:
                        add_anm(idx, r, f'[v114: {frag[:100]}]')
            elif verdict.startswith('POPRAVEK'):
                if page in PAGE_LEVEL_MOVE and cur(r, 'jaethe') and not cur(r, 'klafter'):
                    do_move(idx, r)
                assert pop_new is not None, f'p{page} r{i}: POPRAVEK brez A->B'
                if cur(r, 'klafter') == pop_old or ok_ == pop_old:
                    set_field(idx, r, 'klafter', pop_new, 'v114_value_fix')
                    stats['value_fixes'] += 1
                elif cur(r, 'jaethe') == pop_old or oj == pop_old:
                    set_field(idx, r, 'jaethe', pop_new, 'v114_value_fix')
                    stats['value_fixes'] += 1
                else:
                    raise AssertionError(f'p{page} r{i}: POPRAVEK {pop_old}->{pop_new} brez ujemanja (jae="{cur(r, "jaethe")}", kla="{cur(r, "klafter")}")')
                if 'precrz' in verdict:
                    frag = verdict.split(';', 1)[-1].strip()
                    if 'precrz' in frag:
                        add_anm(idx, r, f'[v114: {frag[:100]}]')
            elif verdict.startswith('razhajanje'):
                if page in PAGE_LEVEL_MOVE and cur(r, 'jaethe') and not cur(r, 'klafter'):
                    do_move(idx, r)
                add_anm(idx, r, f'[v114: {verdict[:130]}]')
            else:
                # soglasje / REVIZIJA / celica / stack / struktura / preko(mapiranje)
                if page in PAGE_LEVEL_MOVE and cur(r, 'jaethe') and not cur(r, 'klafter'):
                    do_move(idx, r)
                if pop_new is not None:
                    if cur(r, 'klafter') == pop_old or ok_ == pop_old:
                        set_field(idx, r, 'klafter', pop_new, 'v114_value_fix')
                        stats['value_fixes'] += 1
                    elif cur(r, 'jaethe') == pop_old or oj == pop_old:
                        set_field(idx, r, 'jaethe', pop_new, 'v114_value_fix')
                        stats['value_fixes'] += 1
                    else:
                        raise AssertionError(f'p{page} r{i}: POPRAVEK {pop_old}->{pop_new} brez ujemanja')
                if 'precrz' in verdict:
                    frag = verdict.split(';', 1)[-1].strip()
                    if 'precrz' in frag:
                        add_anm(idx, r, f'[v114: {frag[:100]}]')
                elif verdict.startswith(('razhaj', 'stack', 'celica', 'struktura')) or 'mozno split' in verdict or verdict.startswith('REVIZIJA'):
                    add_anm(idx, r, f'[v114: {verdict[:120]}]')
            r['reading_pass'] = 'v114-ps-reread'
        stats['pages_covered'].append(f'p{page}')

    # ---------------- SPLIT marker sweep (ze-obstojeci spliti) ----------------
    for page, i in SPLIT_SWEEP:
        idx, r = by_page[page][i]
        if 'F-PV-07-SPLIT val 114' in (r.get('anmerkung') or ''):
            continue
        add_anm(idx, r, SPLIT_MARKER)
        stats['split_markers'] += 1

    # ---------------- p19/p20: page_obs korekcija val 113 pomika ----------------
    add_page_obs(by_page[19][0][1],
                 'v114: POMIK iz v113 OVRŽEN — z3 grid artifakt ("bandi se začnejo pri r1" = mreza zamaknjena); imensko-vrednostni trak: 11 sidrov na ISTIH indeksih (432=r0, 440=r1, 1|1301=r2, 808=r4, 637=r5, 1|182=r10, 716=r11, 205=r13, 192=r14, 776=r15, 1169=r18); FUR 10|517 soglasje; POPRAVEK r3 582, r7 196[?], r8 318, r9 1 639, r17 234; odprta: r6 (316 vs 585), r12 (1164 vs 744, prečrtano), r16 (1329 vs 779), r19 (832 vs 802)')
    add_page_obs(by_page[20][0][1],
                 'v114: "delni pomik" iz v113 OVRŽEN — 5 sidrov 1:1 (703=r0, 950=r6, 535=r9, 444=r11, FUR 6|1183); POPRAVEK r2 736->336, r5 237->337 (potrditev v113 sidrov); odprta: r1 (648 vs 568[?]), r8 (687 vs 631[?]); r10–r19 nagnjen tisk ±20px — ponovni pregled ob višji ločljivosti odprt')
    stats['pages_covered'] += ['p19-struktura', 'p20-struktura']

    # ---------------- strukturna forenzika: izpuščene vrstice (BREZ vstavljanja) ----------------
    add_page_obs(by_page[40][0][1],
                 'v114 STRUKTURA: stran 21 vrstic (tekač 721–740 + 739½), v57 20 — v57 izpustil PRAZNO vrstico p12 (Wunderling) in zlil preklicano p13 (1|65, tekač 734 rdeče) v r12; v57 r13–r19 = p14–p20 (dokaz: Nro 20/22/66/65/65 + vrednosti 768/976/38/1280 natanko); rdeče prečrtani p13/p14/p15 (tekača 734/735/736); FUR crno 6|255 prečrtano + rdeča revizija 4|1030; VSTAVLJANJE IZPUŠČENE VRSTICE = odprta strukturna odločitev')
    add_page_obs(by_page[48][0][1],
                 'v114 STRUKTURA: stran 21 vrstic, v57 20 — v57 izpustil p2 (vrednost "12", lastno ime ~"Schmipa[?]", ni prazna!) in zamaknil r2+ za +1; dokaz: 10 natanko ujemanj pod mapiranjem (439, 533, 16, 941, 621, 565, 1490, 153, 163, 280); popravki preko mapiranja vgrajeni; FUR 5|58[?]; VSTAVLJANJE = odprta odločitev (skupaj s p40)')
    add_page_obs(by_page[49][0][1],
                 'v114 STRUKTURA: stran 21 vrednostnih vrstic + FUR 7|1075; v57 20 (r20 prazna) — izpustil PREČRTANO vrstico p2 ("2|973", kultur Acker) in zamaknil r2+ za +1; dokaz: 14 natanko ujemanj (1415, 381, 281, 97, 92, 821, 56, 295, 975, 556, 376, 606, 658, 398); p5 1415 + p6 1553 rožnato prečrtani; VSTAVLJANJE = odprta odločitev')
    add_page_obs(by_page[34][0][1],
                 'v114 STRUKTURA: pomik iz v113 (r15–r19) OVRŽEN — vrednosti 185/397/87/1038/273 vidne na svojih indeksih (imensko-vrednostni trak); stran ima 21. vrstico pred Fürtragom (~"70", ime ~"Hurich/Lohingr Mich.[?]") — v57 je ne ima; FUR 4|1447[?]; r18 razhajanje 1038 vs 1088[?] odprto; VSTAVLJANJE = odprta odločitev')
    stats['pages_covered'] += ['p40-struktura', 'p48-struktura', 'p49-struktura', 'p34-struktura']

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': 114, 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 114 VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v114-ps-reread')
    print('  reading_pass v114-ps-reread:', n_rp)
    n_split = sum(1 for r in reg if 'F-PV-07-SPLIT val 114' in (r.get('anmerkung') or ''))
    print('  SPLIT marker vrstic (v114):', n_split)


if __name__ == '__main__':
    main()
