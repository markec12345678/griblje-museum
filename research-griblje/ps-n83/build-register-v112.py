#!/usr/bin/env python3
"""Val 112 — VGRADNJA polnega re-reada PS p3(imena)–p16 v register.

Vhodi: band-v112/reading-v112/pNN.json (agentov vid, 0 VLM) + ps-n83/register.json
Pravila (1:1 val 108/110/111 vzorec):
  - F-PV-07 premestitve p5/p7/p12: vrednosti iz jaethe -> klafter (vrednosti
    ostanejo, polje se zamenja; F-PV-07: območja piše v DESNI podstolpec
    'Quad. Klafter', N.o Joche prazen — dokazano val 111/112 na p5/p6)
  - p4/p6/p8–p16: vrednostni audit — POPRAVKI zlastih števk + halucinacij val 57
  - p3: imenski pass (owner_original + haus_no fill, vse z [?] po potrebi),
    r19 capital_kr 27->22, r1 wohnort 'Gruble', r16 fantom marker
  - p11 r22 fantomska vrstica (na strani ne obstaja) — anmerkung
  - p8 r19 strukturna opomba (364 + Furtrag revizije)
  - p6 ertrag/capital marginalni zapisi (r11/r15/r19/r20)
  - vsa pokrita stran dobi reading_pass := 'v112-ps-reread' (p3 obdrži v111)
  - snimke <field>_pre_v112 za vsako spremembo; anmerkung add-only '[… — val 112]'
  - fail-fast: guard 2871 vrstic + 139 v88 + 1109 v86-colonial-tiles + changes guard
Izhod: register.json + band-v112/register-v112-changes.json (popoln audit)
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
READDIR = f'{REPO}/research-griblje/ps-n83/band-v112/reading-v112'
OUT = f'{REPO}/research-griblje/ps-n83/band-v112/register-v112-changes.json'


def load_read(name):
    p = f'{READDIR}/{name}'
    return json.load(open(p)) if os.path.exists(p) else None


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1755, f'guard: 1755 v86-colonial-tiles (najdeno {n_v86})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v112-changes.json že obstaja (dvojni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'fpv07_moves': 0, 'value_fixes': 0, 'owner_fills': 0, 'haus_fills': 0,
             'kultur_fills': 0, 'ertrag_capital': 0, 'anmerkung_adds': 0, 'pages_covered': []}

    def set_field(idx, r, field, new, kind, note=''):
        old = r.get(field, '')
        if old == new:
            return False
        rec = {'index': idx, 'page': r['page'], 'row_in_page': next(i for i, (j, _) in enumerate(by_page[r['page']]) if j == idx),
               'type': kind, 'field': field, 'old': old, 'new': new}
        if note:
            rec['note'] = note
        if f'{field}_pre_v112' not in r:
            r[f'{field}_pre_v112'] = old
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        if 'anmerkung_pre_v112' not in r:
            r['anmerkung_pre_v112'] = old
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

    def add_page_obs(r, txt):
        if r is None:
            return
        r['page_observations_v112'] = txt
        changes.append({'page': r['page'], 'type': 'page_observations_v112', 'text': txt})

    # ---------- p3: imenski pass (obdrži v111 reading_pass) ----------
    p3 = by_page.get(3, [])
    read3 = load_read('p03.json')
    assert read3, 'p03.json manjka'
    haus3 = {1: '61', 2: '62', 3: '62', 4: '62', 5: '63', 6: '62', 7: '61', 8: '61', 9: '60', 10: '60',
             11: '60', 12: '66', 13: '65', 14: '31', 15: '29', 17: '26', 18: '23', 19: '0', 20: '50'}
    own3 = {1: 'Krbitschan Mahs[?]', 2: 'Kirschan Georg[?]', 3: 'Kirschan Mihel[?]', 4: 'Kirschan Mihel[?]',
            5: 'Kirschan Georg[?]', 6: 'Kirschan Mäda[?]', 7: 'Fillah Mäda[?]', 8: 'Fillah Mäda[?]',
            9: 'Schello Gay[?]', 10: 'Mhelhadapes[?]', 11: 'Shello Gay[?]/Mhell Gay[?]', 12: 'Kirschan Georg[?]',
            13: 'Bring Mäda[?]', 14: 'Kirichan Mäda[?]', 15: 'Milleg Hans[?]', 17: 'Bring Michael[?]',
            18: 'Bring Mase[?]', 19: 'Gemeinde', 20: 'Fesdian Musfa[?]'}
    for i, (idx, r) in enumerate(p3):
        if i in haus3:
            if set_field(idx, r, 'haus_no', haus3[i], 'v112_haus_fill'):
                stats['haus_fills'] += 1
        if i in own3:
            if set_field(idx, r, 'owner_original', own3[i], 'v112_owner_fill'):
                stats['owner_fills'] += 1
        if i == 1:
            if set_field(idx, r, 'wohnort', 'Gruble', 'v112_wohnort_fill'):
                stats['owner_fills'] += 1
            add_anm(idx, r, '[stand močno prečrtan/neberljiv — val 112]')
        if i == 16:
            add_anm(idx, r, '[fantomski pas: vrstica brez lastnega para; vsebuje 214+1-602 števec 17 — val 112]')
        if i == 19 and r.get('capital_kr') == '27':
            set_field(idx, r, 'capital_kr', '22', 'v112_value_fix', 'kapitalni niz — zadnja števka 2')
            stats['value_fixes'] += 1
    add_page_obs(p3[0][1],
                 'v112 imenski pass: 19 lastnikov + 19 haus_no fill (vse [?] dvomi ohranjeni); r16 fantom; r19 capital_kr 27->22; brez kultur/no_blatt sprememb')
    stats['pages_covered'].append('p3-names')

    # ---------- p5/p7/p12: F-PV-07 premestitve + (p5) vrednostni popravki ----------
    p5_fix = {2: ('682', '683'), 7: ('642', '242'), 8: ('272', '222'), 10: ('858', '458'),
              12: ('771', '171'), 13: ('170', '110'), 17: ('563', '565'), 18: ('461', '464')}
    p5_anm = {0: '[dvojna vrednost 913 + 543[?] — val 112]', 3: '[vrednost prečrtana rdeče (548) — val 112]',
              4: '[vrednost prečrtana rdeče (395) — val 112]', 5: '[vrednost prečrtana rdeče (466) — val 112]',
              6: '[vrednost prečrtana rdeče (354) — val 112]', 9: '[razhajanje 248[?] vs 2245 — odprto, val 112]',
              11: '[vrednost prečrtana rdeče (1253) — val 112]', 15: '[neujemljivo 625[?] vs 1350 — odprto, val 112]',
              16: '[soglasje s prečrtano (1142) — val 112]', 19: '[soglasje s prečrtano (877) — val 112]'}
    for i, (idx, r) in enumerate(by_page.get(5, [])):
        jae = (r.get('jaethe') or '').strip()
        kla = (r.get('klafter') or '').strip()
        if jae and kla == '':
            if set_field(idx, r, 'klafter', jae, 'v112_fpv07_move', 'jaethe->klafter (F-PV-07)'):
                r['jaethe_pre_v112'] = jae
                r['jaethe'] = ''
                stats['fpv07_moves'] += 1
        if i in p5_fix:
            old_j, new_j = p5_fix[i]
            cur = (r.get('klafter') or '').strip()
            assert cur == old_j, f'p5 r{i}: pričakovano {old_j}, dejansko {cur}'
            if set_field(idx, r, 'klafter', new_j, 'v112_value_fix'):
                stats['value_fixes'] += 1
        if i in p5_anm:
            add_anm(idx, r, p5_anm[i])
    add_page_obs(reg[[j for j, _ in by_page[5]][0]],
                 'v112: F-PV-07 20x premestitev jaethe->klafter; 8 vrednostnih popravkov (683/242/222/458/171/110/565/464) s snimkami; Fürtrag 6|1459 prečrtan -> rdeče 3|906; haus/imena fill ZA PODATKOM (odloženo val 113 — reading actions brez row-level vrednosti)')
    stats['pages_covered'].append('p5')

    for i, (idx, r) in enumerate(by_page.get(7, [])):
        jae = (r.get('jaethe') or '').strip()
        kla = (r.get('klafter') or '').strip()
        if jae and kla == '':
            if set_field(idx, r, 'klafter', jae, 'v112_fpv07_move', 'jaethe->klafter (F-PV-07)'):
                r['jaethe_pre_v112'] = jae
                r['jaethe'] = ''
                stats['fpv07_moves'] += 1
        if i == 20:
            if (r.get('owner_original') or '') == 'Strauß Georg':
                set_field(idx, r, 'owner_original', '', 'v112_value_fix', 'fantom-Furtrag vrstica (brez para) — val 112')
                stats['value_fixes'] += 1
            add_anm(idx, r, '[fantomski rep: vrstica brez kultur/vrednosti; Furtrag 2|687 prečrtan -> rdeče 1140 — val 112]')
    add_page_obs(reg[[j for j, _ in by_page[7]][0]],
                 'v112: F-PV-07 20x premestitev jaethe->klafter; r20 fantom-Furtrag počiščen (owner bris); 11 prečrtanih vrednosti + r19 trojna oznaka/svinčev 1147 + kulturni razhajanja r8/r9 — detalji v reading p07.json (row-level oznake odložene)')
    stats['pages_covered'].append('p7')

    for i, (idx, r) in enumerate(by_page.get(12, [])):
        jae = (r.get('jaethe') or '').strip()
        kla = (r.get('klafter') or '').strip()
        if jae and kla in ('', '-'):
            if set_field(idx, r, 'klafter', jae, 'v112_fpv07_move', 'jaethe->klafter (F-PV-07; klafter \'-\' = prazni marker)'):
                r['jaethe_pre_v112'] = jae
                r['jaethe'] = ''
                stats['fpv07_moves'] += 1
    add_page_obs(reg[[j for j, _ in by_page[12]][0]],
                 'v112: F-PV-07 19x premestitev jaethe->klafter (r16 klafter \'-\' nadomeščen); 5 prečrtanih vrednosti + dvomni r4/r8 + rep-strani pomik-dilema r16–r19 — detalji v reading p12.json')
    stats['pages_covered'].append('p12')

    # ---------- p4: vrednosti + imena + haus + kultur (iz p04.json rows) ----------
    read4 = load_read('p04.json')
    p4_fix = {2: ('1224', '1204'), 6: ('525', '825'), 12: ('76', '16'), 17: ('190', '194'),
              18: ('483', '468'), 19: ('410', '412')}
    p4_haus = {2: '66', 6: '51', 8: '18', 9: '59', 10: '65', 11: '36', 14: '63', 15: '64', 16: '64', 17: '66'}
    p4_anm = {8: '[vrednost 944 brez vidnega vira — ostane, val 112]', 9: '[vrednost 293 brez vira — ostane, val 112]',
              10: '[vrednost 194 brez vira — ostane, val 112]', 11: '[vrednost 46 brez vira — ostane, val 112]',
              15: '[vrednost 473 brez vira — ostane, val 112]',
              12: '[haus 35: stran namig 41/44 — negotovo, potreben obisk — val 112]',
              13: '[haus 41: stran namig 44/65 — negotovo, potreben obisk — val 112]',
              17: '[haus v57 6 = napačen par; 1|66 jasno — val 112]'}
    for i, (idx, r) in enumerate(by_page.get(4, [])):
        rinfo = read4['rows'][i] if i < len(read4['rows']) else None
        if i in p4_fix:
            old_j, new_j = p4_fix[i]
            cur = (r.get('klafter') or '').strip()
            assert cur == old_j, f'p4 r{i}: pričakovano {old_j}, dejansko {cur}'
            if set_field(idx, r, 'klafter', new_j, 'v112_value_fix'):
                stats['value_fixes'] += 1
        if i in p4_haus:
            if set_field(idx, r, 'haus_no', p4_haus[i], 'v112_haus_fix'):
                stats['haus_fills'] += 1
        if rinfo and i in (2, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18):
            own = rinfo.get('owner_seen', '')
            if own and not own.startswith('('):
                name = own.split(' (')[0].strip()
                if set_field(idx, r, 'owner_original', name, 'v112_owner_fix'):
                    stats['owner_fills'] += 1
        if rinfo and i in (9, 10, 11, 12, 13, 15, 16, 18):
            kul = rinfo.get('kultur_seen', '').strip()
            if kul and kul != r.get('kultur'):
                if set_field(idx, r, 'kultur', kul, 'v112_kultur_fix'):
                    stats['kultur_fills'] += 1
        if i in p4_anm:
            add_anm(idx, r, p4_anm[i])
    add_page_obs(reg[[j for j, _ in by_page[4]][0]],
                 'v112 poln re-read p4: 6 vrednostnih popravkov (1204/825/16/194/468/412), 10 haus popravkov, 13 imenskih popravkov (vse [?]), 8 kultur Acker->Lhaid[?]; 5 vrednosti brez vira ostanejo; cirkularne halucinacij imen/haus val 57 popravljene')
    stats['pages_covered'].append('p4')

    # ---------- p6, p8–p11, p13–p16: vrednostni audit iz reading JSON ----------
    PAGES = {6: 'p06.json', 8: 'p08.json', 9: 'p09.json', 10: 'p10.json', 11: 'p11.json',
             13: 'p13.json', 14: 'p14.json', 15: 'p15.json', 16: 'p16.json'}
    for pg, fname in PAGES.items():
        rd = load_read(fname)
        assert rd, f'{fname} manjka'
        rows = by_page.get(pg, [])
        va = rd.get('value_audit', {})
        for i, (idx, r) in enumerate(rows):
            e = va.get(f'r{i}')
            if e and (str(e[2]).startswith('POPRAVEK') or str(e[2]).startswith('NORMALIZACIJA')):
                old_j = str(e[1])
                raw_new = str(e[0])
                new_j = '' if raw_new == 'PRAZNO' else raw_new.split(' (')[0].split(' + ')[0].strip()
                cur = (r.get('klafter') or '').strip()
                assert cur == old_j, f'p{pg} r{i}: pričakovano {old_j}, dejansko {cur}'
                if set_field(idx, r, 'klafter', new_j, 'v112_value_fix', str(e[2])):
                    stats['value_fixes'] += 1
            if pg == 6 and i == 0:
                add_anm(idx, r, '[vrednost prečrtana rdeče (28) — val 112]')
        # p6 ertrag/capital
        if pg == 6:
            i11i, i11 = rows[11]; i15i, i15 = rows[15]; i19i, i19 = rows[19]; i20i, i20 = rows[20]
            set_field(i11i, i11, 'ertrag_kr', '', 'v112_value_fix', "crta med '1' in '104' = locilo/minus NEODLOCENO")
            set_field(i11i, i11, 'capital_fl', '104', 'v112_value_fix', '104 pisano v Cap.fl (945-1001 px)')
            stats['ertrag_capital'] += 2
            set_field(i15i, i15, 'ertrag_kr', '', 'v112_value_fix', "'934' pisano v Cap.fl (prva stevka 9)")
            set_field(i15i, i15, 'capital_fl', '934', 'v112_value_fix', '934 pisano v Cap.fl')
            stats['ertrag_capital'] += 2
            set_field(i19i, i19, 'ertrag_fl', '', 'v112_value_fix', 'zapis pripada r20')
            set_field(i19i, i19, 'ertrag_kr', '', 'v112_value_fix', 'zapis pripada r20')
            set_field(i19i, i19, 'capital_fl', '', 'v112_value_fix', 'zapis pripada r20')
            stats['ertrag_capital'] += 3
            set_field(i20i, i20, 'ertrag_fl', '1', 'v112_value_fix', "'1' v E.fl coni")
            set_field(i20i, i20, 'ertrag_kr', '1106', 'v112_value_fix', "'1106' v E.fl coni — kolonka neodlocena")
            set_field(i20i, i20, 'capital_fl', '477', 'v112_value_fix', "'477' v Cap.fl")
            stats['ertrag_capital'] += 3
            add_anm(i20i, i20, "[svincnik?/crnilo zapis '1  1106' + '477' desno od 418; val57 jih je pripisal r19 kot 1|1109|1477 — val 112]")
            add_page_obs(rows[0][1], 'v112: marginalni zapisi Ertrag/Capital premesteni r19->r20 + popravki stevk (1109->1106, 1477->477); Furtrag crno 4|85 (R) -> rdece 2|585')
        if pg == 8:
            add_anm(rows[14][0], rows[14][1], '[celica PRAZNA na strani — val57 vnesel 397 brez vira — val 112]')
            add_anm(rows[19][0], rows[19][1], '[stran: vrstica r19 = normalni vnos (Wald, 364 R precrtan, Klobetisher Gregor) pred "6 Eintrag."; Furtrag 3|1941 (R) -> 1|454 (R) -> 682; vrstica 364 ni v registru — dodajanje odlozeno (kaskada) — val 112]')
            add_page_obs(rows[0][1], 'v112: 11 vrednostnih popravkov + r14 prazna + r19 strukturna opamba; stran masovno rdece precrtana; F-PV-07 potrjena (vrednosti ze v klafter)')
        if pg == 9:
            add_page_obs(rows[0][1], 'v112: 4 vrednostni popravki (668/1439/454/971); Furtrag crno 6|471 (R) -> rdece 6|265; r16 jae 1 legitimen (N.o Joche)')
        if pg == 10:
            add_anm(rows[19][0], rows[19][1], "[svinenik '3|49[?]' (ulomek neberljiv) v E. coni — val 112]")
            add_page_obs(rows[0][1], "v112: 14 vrednostnih popravkov + r0 normalizacija '10.92'->'1092' (mogoce 10|92 J|QK — ni doma); Furtrag crno 4|803 (R) -> rdece 1|408 (R) -> rdece 1|209")
        if pg == 11:
            add_anm(rows[18][0], rows[18][1], '[zadnja stevka 1/4 — nizka locljivost — val 112]')
            add_anm(rows[21][0], rows[21][1], "[svinenik '2|777[?]' ob vrstici — val 112]")
            add_anm(rows[22][0], rows[22][1], "[FANTOMSKA vrstica: na strani ne obstaja (22 vnosnih + Furtrag); Furtrag '9 Furtrag 2|798' (R) + rdeca '81[?]' — val 112]")
            add_page_obs(rows[0][1], 'v112: 7 vrednostnih popravkov + r22 fantom; sistemski kultur dvom r0-r8 (Lehnguart und Obft / Liegend.Baul. / Schindel.Wald) — kultur pass odlozen val 113')
        if pg == 13:
            add_page_obs(rows[0][1], 'v112: 2 vrednostna popravka (273/34) — najcistejsa stran; Furtrag 4|451 brez rdece revizije')
        if pg == 14:
            add_page_obs(rows[0][1], 'v112: 13 vrednostnih popravkov (r17 1000->290!); Furtrag crno 6|1008 (R) -> rdece 6|77')
        if pg == 15:
            add_page_obs(rows[0][1], "v112: 12 vrednostnih popravkov; r12 jae 1 / kla prazno potrjeno; Furtrag '7[?]|1288' (format neujemljiv z vsoto — opomba)")
        if pg == 16:
            add_page_obs(rows[0][1], 'v112: 6 vrednostnih popravkov (r14 1852->482); Furtrag 5|811')
        for i, (idx, r) in enumerate(rows):
            r['reading_pass'] = 'v112-ps-reread'
        stats['pages_covered'].append(f'p{pg}')

    # reading_pass za p4, p5, p7, p12 (vse vrstice)
    for pg in (4, 5, 7, 12):
        for idx, r in by_page[pg]:
            r['reading_pass'] = 'v112-ps-reread'

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': 112, 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 112 VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v112-ps-reread')
    print('  reading_pass v112-ps-reread:', n_rp)


if __name__ == '__main__':
    main()
