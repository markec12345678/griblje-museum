#!/usr/bin/env python3
"""Val 113 — VGRADNJA vrednostnega re-reada PS p17–p24 (+ kultur pass p11 r0–r8).

Vhodi: band-v113/reading-v113/*.json (agentov vid, 0 VLM, z3 izmerjena pravila)
Pravila (1:1 val 108/110/111/112 vzorec):
  - F-PV-07 premestitve p17/p18/p21/p22/p23: vrednosti iz jaethe -> klafter
  - NOVO F-PV-07-SPLIT (val 113): pisar piše "N Joch | Q Klafter" notacijo —
    val 57 je zlil pare (npr. '1|400' -> '1400'). Vgradnja: jae=Joch, kla=Klafter;
    anmerkung marker '[F-PV-07-SPLIT val 113' za pass3 izključitev (jae = Joch
    števec, NE parcelna številka — analog v88 pravilu)
  - POPRAVEK posameznih števk (val 57 napake) s snimkami
  - odprta razhajanja: anmerkung add-only (NI dvigovanja, §4)
  - p24: vrednosti ze v klafter — cisti popravki + ocistka '.'
  - p11: kultur pass — halucinacija val 57 dokazana (ponovljeni zapisi),
    anmerkung add-only (besedilo val 114)
  - p19/p20: pomik vrstic — BREZ vgradnje, samo page_observations_v113
  - reading_pass := 'v113-ps-reread' (p17, p18, p21, p22, p23, p24)
  - fail-fast: guard 2871 vrstic + 139 v88 + 1755 v86 + changes guard
Izhod: register.json + band-v113/register-v113-changes.json
"""
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
REG = f'{REPO}/research-griblje/ps-n83/register.json'
OUT = f'{REPO}/research-griblje/ps-n83/band-v113/register-v113-changes.json'


def main():
    reg = json.load(open(REG))
    assert len(reg) == 2871, f'guard: register 2871 (najdeno {len(reg)})'
    n_v88 = sum(1 for r in reg if 'v88_status' in r or r.get('jk_review') == 'v88-digit-split-UNRESOLVED')
    assert n_v88 == 139, f'guard: 139 v88 (najdeno {n_v88})'
    n_v86 = sum(1 for r in reg if r.get('reading_pass') == 'v86-colonial-tiles')
    assert n_v86 == 1755, f'guard: 1755 v86-colonial-tiles (najdeno {n_v86})'
    n_v112 = sum(1 for r in reg if r.get('reading_pass') == 'v112-ps-reread')
    assert n_v112 == 265, f'guard: 265 v112-ps-reread (najdeno {n_v112})'
    if os.path.exists(OUT):
        sys.exit('FATAL: register-v113-changes.json ze obstaja (dvozni tek prepovedan)')

    by_page = {}
    for idx, r in enumerate(reg):
        by_page.setdefault(r['page'], []).append((idx, r))

    changes = []
    stats = {'fpv07_moves': 0, 'split_fixes': 0, 'value_fixes': 0, 'anmerkung_adds': 0,
             'pages_covered': []}

    def set_field(idx, r, field, new, kind, note=''):
        old = r.get(field, '')
        if old == new:
            return False
        rec = {'index': idx, 'page': r['page'], 'type': kind, 'field': field,
               'old': old, 'new': new}
        if note:
            rec['note'] = note
        if f'{field}_pre_v113' not in r:
            r[f'{field}_pre_v113'] = old
        r[field] = new
        changes.append(rec)
        return True

    def add_anm(idx, r, txt):
        old = r.get('anmerkung', '')
        if txt in old:
            return
        if 'anmerkung_pre_v113' not in r:
            r['anmerkung_pre_v113'] = old
        r['anmerkung'] = (old + ('; ' if old else '') + txt)
        changes.append({'index': idx, 'page': r['page'], 'type': 'anmerkung_add', 'text': txt})
        stats['anmerkung_adds'] += 1

    def add_page_obs(r, txt):
        if r is None:
            return
        r['page_observations_v113'] = txt
        changes.append({'page': r['page'], 'type': 'page_observations_v113', 'text': txt})

    SPLIT_MARKER = '[F-PV-07-SPLIT val 113: Joch|Klafter notacija — jae=Joch stavec, ni parcelna stevilka]'

    def do_move(idx, r, new_kla=None):
        jae = (r.get('jaethe') or '').strip()
        kla = (r.get('klafter') or '').strip()
        assert jae and kla == '', f'p{r["page"]} r?: move zahteva jae="{jae}", kla="{kla}"'
        if set_field(idx, r, 'klafter', new_kla if new_kla is not None else jae, 'v113_fpv07_move', 'jaethe->klafter (F-PV-07)'):
            r['jaethe_pre_v113'] = jae
            r['jaethe'] = ''
            stats['fpv07_moves'] += 1

    def do_split(idx, r, new_jae, new_kla=None, kla_note=''):
        old_j = (r.get('jaethe') or '').strip()
        old_k = (r.get('klafter') or '').strip()
        assert old_j, 'split zahteva neprazno jae'
        if set_field(idx, r, 'jaethe', new_jae, 'v113_split_fix', 'F-PV-07-SPLIT razcep zlito'):
            stats['split_fixes'] += 1
        if new_kla is not None:
            set_field(idx, r, 'klafter', new_kla, 'v113_split_fix', kla_note or 'F-PV-07-SPLIT razcep zlito')
        add_anm(idx, r, SPLIT_MARKER)

    def do_kla_fix(idx, r, old_k, new_k, note=''):
        cur = (r.get('klafter') or '').strip()
        assert cur == old_k, f'p{r["page"]}: pricekano kla "{old_k}", dejansko "{cur}"'
        if set_field(idx, r, 'klafter', new_k, 'v113_value_fix', note):
            stats['value_fixes'] += 1

    def set_reading_pass(pg):
        for idx, r in by_page.get(pg, []):
            r['reading_pass'] = 'v113-ps-reread'
        stats['pages_covered'].append(f'p{pg}')

    # ---------------- p17 (jae-filled; F-PV-07 + SPLIT r15 + popravki) ----------------
    p17 = by_page[17]
    for i, (idx, r) in enumerate(p17):
        if i == 15:
            do_split(idx, r, '1', '400', '1|400; v113 zlil v jae 1400')
        elif i == 19:
            do_kla_fix(idx, r, '833', '553', '5 jasna na x10; jae=1 ze split v v57')
            add_anm(idx, r, SPLIT_MARKER)
        else:
            do_move(idx, r)
    # popravki po premestitvi (kla zdaj nosi premaknjeno vrednost)
    for i, old_k, new_k, note in [(2, '650', '690', ''), (8, '189', '129', ''),
                                  (18, '526', '556', '')]:
        do_kla_fix(by_page[17][i][0], by_page[17][i][1], old_k, new_k, note)
    for i, txt in [(1, '[razhajanje 135 vs 155[?] — odprto, val 113]'),
                   (5, '[razhajanje 632 vs 647[?] — odprto, val 113]'),
                   (6, '[razhajanje 74 vs 94[?] — odprto; precrzano rdece, val 113]'),
                   (7, '[vrednost precrzana rdece, val 113]'),
                   (11, '[razhajanje 100 vs 180[?] — odprto; rdeca crta cez vrstico, val 113]'),
                   (12, '[razhajanje 333 vs 585 — odprto, val 113]'),
                   (16, '[razhajanje 121 vs 1|121[?] — odprto, val 113]')]:
        add_anm(by_page[17][i][0], by_page[17][i][1], txt)
    add_page_obs(by_page[17][0][1],
                 'v113: F-PV-07 17x move + SPLIT r15 (1|400, v57 zlil v 1400); POPRAVEK r2 690, r8 129, r18 556, r19 553; 6 odprtih razhajanj; FUR 6|795 (6 v Joch koloni)')
    set_reading_pass(17)

    # ---------------- p18 (jae-filled; 5 SPLIT + popravki) ----------------
    splits18 = {4: ('1', '243'), 11: ('1', '50'), 15: ('1', '28'), 16: ('1', '122'), 17: ('1', '130')}
    fixes18 = {7: ('937', '927'), 8: ('873', '473'), 13: ('529', '539')}
    for i, (idx, r) in enumerate(by_page[18]):
        if i in splits18:
            nj, nk = splits18[i]
            do_split(idx, r, nj, nk, f'{nj}|{nk}; v57 zlil/popravil')
        elif i == 9:
            add_anm(idx, r, '[vrstica brez vrednosti (owner Hoffnung) — val 113]')
        else:
            do_move(idx, r, fixes18[i][1] if i in fixes18 else None)
    # vrednosti r7/r8/r13 ze vgrajene prek do_move(new_kla)
    for i, txt in [(0, '[razhajanje 109 vs 1|89[?] — odprto, val 113]'),
                   (1, '[razhajanje: 220 all-klafter ali split 2|20 — odprto, val 113]'),
                   (2, '[razhajanje 273 vs 283[?] (ali split 2|83) — odprto, val 113]'),
                   (3, '[razhajanje: 257 (=2|57) vs 2|37[?] — odprto, val 113]'),
                   (5, '[razhajanje 1943 (=1|943) vs 1|343[?] — odprto, val 113]'),
                   (6, '[razhajanje 1002 vs 1|1082[?] — odprto, val 113]'),
                   (12, '[razhajanje 1498 (=1|498) vs 1|098[?] — odprto; superscript 8, val 113]'),
                   (14, '[razhajanje 391 vs 931[?] — odprto, val 113]'),
                   (19, '[razhajanje 599 vs 539[?] — odprto, val 113]')]:
        add_anm(by_page[18][i][0], by_page[18][i][1], txt)
    add_page_obs(by_page[18][0][1],
                 'v113: F-PV-07 move 14x + 5 SPLIT (r4 1|243, r11 1|50, r15 1|28, r16 1|122, r17 1|130 — v57 zlil); POPRAVEK r7 927, r8 473, r13 539; 9 odprtih; FUR 10|275')
    set_reading_pass(18)

    # ---------------- p21 (jae-filled; SPLIT r9/r10 + popravki) ----------------
    for i, (idx, r) in enumerate(by_page[21]):
        if i == 9:
            do_split(idx, r, '3', '1248', '3|1248; v57 zlil "3 1268"')
        elif i == 10:
            do_split(idx, r, '1', None)
            add_anm(idx, r, '[razhajanje 837 vs 457[?] — odprto; split jae=1 formaliziran, kla ostaja prazno, val 113]')
        else:
            do_move(idx, r)
    for i, old_k, new_k in [(0, '273', '573'), (2, '464', '484'), (5, '839', '859'),
                            (18, '1306', '1302'), (19, '948', '448')]:
        do_kla_fix(by_page[21][i][0], by_page[21][i][1], old_k, new_k,
                   'dvom [?] ob 1302' if i == 18 else '')
    if True:
        add_anm(by_page[21][18][0], by_page[21][18][1], '[POPRAVEK 1306->1302[?] — dvom 2/6, val 113]')
    add_anm(by_page[21][11][0], by_page[21][11][1], '[razhajanje 1840 vs 1387[?] — odprto, val 113]')
    add_page_obs(by_page[21][0][1],
                 'v113: F-PV-07 move 18x + SPLIT r9 (3|1248) + r10 jae=1; POPRAVEK r0 573, r2 484, r5 859, r18 1302[?], r19 448; 2 odprti; FUR 13|1108')
    set_reading_pass(21)

    # ---------------- p22 (jae-filled; cisti popravki + odprta) ----------------
    for i, (idx, r) in enumerate(by_page[22]):
        if i in {4: '308', 10: '665', 14: '824', 17: '889', 18: '352'}:
            do_move(idx, r, {4: '308', 10: '665', 14: '824', 17: '889', 18: '352'}[i])
        else:
            do_move(idx, r)
    for i, txt in [(2, '[razhajanje 348 vs 244 — odprto, val 113]'),
                   (5, '[razhajanje 1148 vs 443 — odprto, val 113]'),
                   (6, '[razhajanje 448 vs 443[?] — odprto, val 113]'),
                   (8, '[razhajanje 785 vs 165 — odprto, val 113]'),
                   (11, '[razhajanje 782 vs 453 — odprto, val 113]'),
                   (12, '[razhajanje 712 vs 723[?] — odprto, val 113]'),
                   (15, '[razhajanje 276 vs 616 — odprto, val 113]'),
                   (16, '[razhajanje 1162 vs 443 — odprto (3. "443" na strani — sumljivo), val 113]'),
                   (19, '[razhajanje 9116 vs 474 — odprto; v57 9116 sumljivo, val 113]')]:
        add_anm(by_page[22][i][0], by_page[22][i][1], txt)
    add_page_obs(by_page[22][0][1],
                 'v113: F-PV-07 move 20x + POPRAVEK r4 308, r10 665, r14 824, r17 889, r18 352; 9 odprtih razhajanj (zoom val 114); FUR 6|444 + rdeca revizija 320[?]')
    set_reading_pass(22)

    # ---------------- p23 (jae-filled; SPLIT r14 + popravki) ----------------
    for i, (idx, r) in enumerate(by_page[23]):
        if i == 14:
            do_split(idx, r, '1', None)
            add_anm(idx, r, '[razhajanje 1168 vs 1|1048[?] — odprto; precrzano rdece; split jae=1, kla ostaja prazno, val 113]')
        else:
            do_move(idx, r, {1: '521', 3: '317', 4: '1081', 5: '1163', 10: '770', 15: '715'}.get(i))
    add_anm(by_page[23][1][0], by_page[23][1][1], '[POPRAVEK 529->521[?] — dvom 1/9, val 113]')
    for i, txt in [(7, '[razhajanje 1145 vs 1448[?] — odprto, val 113]'),
                   (8, '[razhajanje 1187 vs 1427[?] — odprto, val 113]'),
                   (19, '[razhajanje 1025 vs 182 — odprto, val 113]')]:
        add_anm(by_page[23][i][0], by_page[23][i][1], txt)
    add_page_obs(by_page[23][0][1],
                 'v113: F-PV-07 move 19x + SPLIT r14 jae=1; POPRAVEK r1 521[?], r3 317, r4 1081, r5 1163, r10 770, r15 715; 4 odprti; FUR 10|172 (R) precrto -> rdece 7|1143')
    set_reading_pass(23)

    # ---------------- p24 (kla-filled; cisti popravki, brez move) ----------------
    for i, (idx, r) in enumerate(by_page[24]):
        if i == 0:
            set_field(idx, r, 'jaethe', '', 'v113_ocistka', "pika '.' marka — ocistka")
        if i == 0:
            do_kla_fix(idx, r, '756', '736')
        elif i == 7:
            do_kla_fix(idx, r, '677', '577')
        elif i == 8:
            do_kla_fix(idx, r, '908', '905')
            add_anm(idx, r, SPLIT_MARKER)
        elif i == 9:
            do_kla_fix(idx, r, '680', '630')
        elif i == 11:
            do_kla_fix(idx, r, '546', '544')
        elif i == 18:
            do_kla_fix(idx, r, '488', '428')
        elif i == 19:
            do_kla_fix(idx, r, '243', '343')
    for i, txt in [(3, '[razhajanje 479 vs 1183 — odprto; precrzano rdece, val 113]'),
                   (4, '[razhajanje 570 vs 330 — odprto; precrzano rdece, val 113]'),
                   (5, '[razhajanje 1494 vs 1096 — odprto; precrzano rdece, val 113]'),
                   (6, '[razhajanje 437 vs 480[?] — odprto, val 113]'),
                   (9, '[vrednost precrzana rdece, val 113]'),
                   (12, '[vrednost precrzana rdece, val 113]'),
                   (13, '[vrednost precrzana rdece, val 113]'),
                   (14, '[vrednost precrzana rdece, val 113]'),
                   (16, '[vrednost precrzana rdece, val 113]')]:
        add_anm(by_page[24][i][0], by_page[24][i][1], txt)
    add_page_obs(by_page[24][0][1],
                 'v113: vrednosti ze v klafter (v57 tu pravilen stolpec); 8 POPRAVEK + ocistka jae "."; splits r8/r15 (jae=1) markerirani za pass3 izkljucitev; 8 precrtnih rdece; FUR 8|710 (R) -> rdece 1|919 (R)')
    set_reading_pass(24)

    # ---------------- p11 kultur pass (anmerkung add-only) ----------------
    kul11 = {0: 'Lhugar und Boll[?]', 1: 'ditto r0', 2: 'Rosig[?]/Ruked[?]', 3: 'Lhugar und Boll[?]',
             4: 'Lhugar und Boll[?]', 5: 'Lhugar und Boll[?]', 6: 'ditto r5', 7: 'Rosig[?]/Ruked[?]',
             8: 'Lhugar und Boll[?]'}
    for i, (idx, r) in enumerate(by_page[11]):
        if i in kul11:
            add_anm(idx, r, f"[kultur re-read val 113: '{kul11[i]}' — ponovljen zapis; v57 genericni cleni ne drzijo; koncno besedilo val 114]")
    add_page_obs(by_page[11][0][1],
                 'v113 kultur pass r0-r8: halucinacija val 57 dokazana — dejanski zapisi se ponavljajo (Lhugar und Boll[?] 5x + 2 ditto; Rosig[?]/Ruked[?] 2x), v57 je zapisal 4 razlicne genericne terme; direktna korekcija odlozena (§4 TRANSCRIBED=0), besedilo val 114')
    stats['pages_covered'].append('p11-kultur')

    # ---------------- p19/p20: samo page_observations (pomik vrstic) ----------------
    add_page_obs(by_page[19][0][1],
                 'v113 findings-only: POMIK VRSTIC (F2-analog) — 7 sidrnih ujemanj z +1 zamikom (440=r1, 1|1301=r2, 637=r5, 1|182=r10, 205=r13, 192=r14, 1169=r18); register r0=432 nad detektiranim pravilom; vgradnja odlozena val 114 (strukturni re-read); FUR 10|517')
    add_page_obs(by_page[20][0][1],
                 'v113 findings-only: delni pomik v spodnji polovici + val 57 napake — sidri r0 707/703, r2 336/736, r5 337/237, r6 950/950, r12 444/444; r9-r11 zamik (535=r9); vgradnja odlozena val 114; FUR 6|1183')
    stats['pages_covered'] += ['p19-obs', 'p20-obs']

    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    audit = {'val': 113, 'stats': stats, 'changes': changes}
    json.dump(audit, open(OUT, 'w'), ensure_ascii=False, indent=1)
    print('VAL 113 VGRADNJA OK')
    print('  stats:', json.dumps(stats, ensure_ascii=False))
    print('  changes:', len(changes))
    n_rp = sum(1 for r in reg if r.get('reading_pass') == 'v113-ps-reread')
    print('  reading_pass v113-ps-reread:', n_rp)
    n_split = sum(1 for r in reg if 'F-PV-07-SPLIT val 113' in (r.get('anmerkung') or ''))
    print('  SPLIT marker vrstic:', n_split)


if __name__ == '__main__':
    main()
