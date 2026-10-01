#!/usr/bin/env python3
"""Val 119 del 2b — reading-v119/p32..p37.json generator.
Vhodi: agentov vid glavne seje (0 VLM) — zz-/gz-/diag-zoomi + tall prerezi.
Izhod: 6 reading JSONov (meta + names_audit, vlm_calls=0).
"""
import json
import os

OUT = '/home/z/griblje-museum/research-griblje/ps-n83/band-v113/reading-v119'
METHOD = ('nz-pXX-g0..2 + zz-/gz-pXX-rNN x22-x30 + diag x14 + tall prerezi s '
          'Blatt sidri + medstranski hišni preseki (h39 Schimer, h41/42 Pöching, '
          'h43 Brulla, h45 Strauß, h23-h28 Ring, h47/48 Hladnikhar, h29 Müllner, '
          'h64/67 Puchey, h27 Malwischly) + PUA presek + PT (house-register-1825) '
          'varianti + registarski presek; 2↔3/4↔1/5↔6 glyf-pravila del 2a')

PAGES = {}

PAGES[32] = {
    'note': ('p32 = masovni pattern-fill: v57 "Paulin/Peter/Šimunc/Hladnikh/Gregor greg." '
             'nasproti črnilu Pöching./Schimer/Brulla/Hladnikhar/Strauß; strukturno: pari '
             'h43×2 (Brulla), h42×2 (Pöching Mathel), h41×2 (Pöching Gorgy), h38×2 (Schimer '
             'Georg), h45×2 (Strauß Georgy), h40×3 (Pöching Mathl), h47×3 + h48×2 '
             '(Hladnikhar); 5 haus POPRAVEK (42->43, 12->42 ×2, 40->43, 46->45); r0 '
             "'Nava Marlin[?]' = dvomljivo (razhajanje odprto, v57 'Matjaž Marnel' ohranjeno)"),
    'rows': [
        ('9.', 'Nava Marlin[?]', '9.', 'Matjaž Marnel',
         "razhajanje odprto: črnilo ~'Nava. Marlin.[?]' (w1 = 4-minim N-sweep 'Nava[?]'; "
         "'Matz[?]' alternativa — N/M glyf-dvom tudi pri grayscale x26), v57 'Matjaž Marnel' "
         "ohranjeno (w2 'Marlin' ≈ 'Marnel' skladna); val57-VLM page-singleton — nobena beseda "
         "ne obstaja drugje v 2875 vrsticah"),
        ('39', 'Schimer Mache[?]', '39', 'Valentin Marko',
         "ime POPRAVEK Valentin Marko -> Schimer Mache[?] (x22+x30: 'Schimer' jasno; w2 "
         "'Mache[?]/Mathe[?]' dvom — ch/th nad hrupom; PT H-039 variant 'Schim[?]er Mache[?]' "
         "= meddokumentski presek; v57 obe besedi fabriirani — 'Valentin'/'Marko' ne obstajata "
         'v črnilu te strani)'),
        ('43', 'Brulla Michl[?]', '42', 'Paulin Stelc',
         "haus POPRAVEK 42->43 (x24: 3 z zastavico jasna) + ime POPRAVEK Paulin Stelc -> "
         "Brulla Michl[?] (h43 presek: p25-r15 'Prulla Miko[?]', p26-r15 'Brulla Michl[?]', "
         "PUA konflikt 'Brulla Mäda/Laura'; w2 mehko 'Mic?s' — [?] na obeh besedah)"),
        ('42', 'Pöching. Mathel.[?]', '12', 'Paulin Marko',
         "haus POPRAVEK 12->42 (x24: 4 + 2 z valovito bazo) + ime POPRAVEK Paulin Marko -> "
         "Pöching. Mathel.[?] (PUA h.42 'Pöchinger Malfa' VERIFIED-2x; h42 par z r8; w1 "
         "'ching' — p33-r12 jasno, tu ll/ch-dvom; w2 'Mathel[?]/Malfa[?]' dvom)"),
        ('38', 'Schimer Georg.', '38', 'Šimunc Gregor',
         "ime POPRAVEK Šimunc Gregor -> Schimer Georg. (x14 jasno; h38 par z r10; 'Schimer' = "
         "del-1/2a forma — p22 'Shimerz'->'Schimer' precedens; v57 'Šimunc' = slovenizirana "
         'oblika istega črnila)'),
        ('41', 'Pöching. Gorgy.[?]', '41', 'Peter Gregor',
         "ime POPRAVEK Peter Gregor -> Pöching. Gorgy.[?] (PUA h.41 'Pöchinger Georg' "
         'VERIFIED-2x; h41 par z r9; w1 bledše — Pöching[?]/Pasiner[?] dvom; w2 Gorgy = '
         'del-2a glyf-forma)'),
        ('40', 'Pöching. Mathl.[?]', '40', 'Paulin Marko',
         'ime POPRAVEK Paulin Marko -> Pöching. Mathl.[?] (h40 ×3 z r18/r19; w2 '
         "Mathl[?]/Markl[?] dvom pri x26 — Mathl skladnejše z r18/r19)"),
        ('43', 'Brulla Mich.[?]', '40', 'Paulin Marko',
         'haus POPRAVEK 40->43 (x14: 3 z zastavico jasna) + ime POPRAVEK Paulin Marko -> '
         "Brulla Mich.[?] (h43 par z r2; w1 'Brulla' po hišnem preseku, x14 '~Paull' dvom; "
         "w2 'Mich.' = kratica)"),
        ('42', 'Pöching. Mathel.[?]', '12', 'Peter Marko',
         'haus POPRAVEK 12->42 (x14: 4 + 2 jasna) + ime POPRAVEK Peter Marko -> '
         'Pöching. Mathel.[?] (h42 par z r3; PUA h.42)'),
        ('41', 'Pöching. Gorgy.[?]', '41', 'Peter Gregor',
         'ime POPRAVEK Peter Gregor -> Pöching. Gorgy.[?] (h41 par z r5; PUA h.41)'),
        ('38', 'Schimer Georg.', '38', 'Šimunc Gregor',
         'ime POPRAVEK Šimunc Gregor -> Schimer Georg. (h38 par z r4; x14 jasno)'),
        ('48', 'Hladnikhar[?] Georg.', '48', 'Hladnikh[?] Gregor',
         "ime POPRAVEK Hladnikh[?] Gregor -> Hladnikhar[?] Georg. (črnilo nosi '-ar' končnico "
         'na vseh 5 h47/h48 vrsticah; k/ch + i/u dvom — [?]; w2 Georg. po črnilu, v57 Gregor '
         '= različica)'),
        ('47', 'Hladnikhar[?] Marko', '47', 'Hladnikh[?] Marko',
         "ime POPRAVEK Hladnikh[?] Marko -> Hladnikhar[?] Marko (-ar končnica; [?])"),
        ('45', 'Strauß Georgy.[?]', '46', 'Gregor greg.',
         'haus POPRAVEK 46->45 (x30: 4 + 5 z zastavico; h45 par z r15) + ime POPRAVEK Gregor '
         "greg. -> Strauß Georgy.[?] (H-045 ps 'Strauß Georg' + pt 'Krauß Georg'; del 2a "
         "h15 cross-val 'Strauß Gorgy' precedens; w2 'Georgy[?]/Gorgy[?]' dvom; rdeča anm "
         "'Rupf[?] aufgelassen im 1880' ostaja)"),
        ('47', 'Hladnikhar[?] Marko', '47', 'Hladnikh[?] Marko',
         'ime POPRAVEK Hladnikh[?] Marko -> Hladnikhar[?] Marko (-ar; [?])'),
        ('45', 'Strauß Georgy.[?]', '45', 'Lovrenc Gregor',
         "ime POPRAVEK Lovrenc Gregor -> Strauß Georgy.[?] (h45 par z r13; H-045; v57 "
         "'Lovrenc' fabriirana — ne obstaja v črnilu)"),
        ('47', 'Hladnikhar[?] Marko', '47', 'Hladnikh[?] Marko',
         'ime POPRAVEK Hladnikh[?] Marko -> Hladnikhar[?] Marko (-ar; [?])'),
        ('48', 'Hladnikhar[?] Georg.', '48', 'Hladnikh[?] Gregor',
         'ime POPRAVEK Hladnikh[?] Gregor -> Hladnikhar[?] Georg. (h48 par z r11)'),
        ('40', 'Pöching. Mathl.[?]', '40', 'Paulin Marko',
         "ime POPRAVEK Paulin Marko -> Pöching. Mathl.[?] (x24: 'Pöching' s ch jasno; w2 "
         "'Mathl.' jasno)"),
        ('40', 'Pöching. Mathl.[?]', '40', 'Paulin Marko',
         'ime POPRAVEK Paulin Marko -> Pöching. Mathl.[?] (h40 par z r18)'),
    ],
}

PAGES[33] = {
    'note': ('p33: v57 "Pölling" ×5 = črnilo "Pöching." (ch jasno na r1/r11/r12) — PUA h.41/42 '
             'Pöchinger presek; h48 "Widhalden" = Hladnikhar (presek p32); h34 "Stüblach" = '
             'Stüllach; h20/h7 "Deuwaldsch/Lauhaldsch/Zellhamisch" = Deuwaldich/Lauhaldich/'
             'Zellhamisch z Mathl kraticami; h43 Brulla Maria (r0) + h113 Brulla Maria (r20); '
             '2 ditto ovrženih (r3, r5); brez haus POPRAVEK'),
    'rows': [
        ('43', 'Brulla Maria.', '43', 'Rudolf Maria',
         "ime POPRAVEK Rudolf Maria -> Brulla Maria. (x24 jasno; h43 Brulla presek p32-r2/r7 "
         "+ p25/p26; v57 'Rudolf' fabriirana)"),
        ('42', 'Pöching. Mathl.[?]', '42', 'Pölling Michel',
         "ime POPRAVEK Pölling Michel -> Pöching. Mathl.[?] (x24: 'Pöching' s ch jasno; w2 "
         "'Mathl.' jasno ≠ Michel; PUA h.42)"),
        ('48', 'Hladnikhar[?] Georg.', '48', 'Widhalden Georg',
         'ime POPRAVEK Widhalden Georg -> Hladnikhar[?] Georg. (h48 presek p32-r11/r17; '
         'w1 Hladnikhar-forma, [?])'),
        ('48', 'Hladnikhar[?] Georg.', '48', 'Widhalden Georg',
         'ime POPRAVEK Widhalden Georg -> Hladnikhar[?] Georg. (h48 par z r2) + ditto ovržen: '
         'črnilo piše polno ime, ne d°'),
        ('34', 'Stüllach.[?] Michel.', '34', 'Stüblach Michel',
         "ime POPRAVEK Stüblach Michel -> Stüllach.[?] Michel. (x24: dve 'll' daljši, ne b; "
         'b/ll dvom izrecen — [?]; w2 Michel. ≈ v57)'),
        ('34', 'Stüllach.[?] Michel.', '34', 'Stüblach Michel',
         'ime POPRAVEK Stüblach Michel -> Stüllach.[?] Michel. (h34 par z r4) + ditto ovržen: '
         'črnilo piše polno ime'),
        ('20', 'Deuwaldich Mathl.[?]', '20', 'Dewaltsch Michel',
         "ime POPRAVEK Dewaltsch Michel -> Deuwaldich Mathl.[?] (w2 'Mathl.' jasno ≠ Michel; "
         "w1 'Deuwaldich[?]/Deubaldich[?]' dvom — h20 par z r16)"),
        ('34', 'Stüllach.[?] Mathl.[?]', '34', 'Stüblach Andreas',
         "ime POPRAVEK Stüblach Andreas -> Stüllach.[?] Mathl.[?] (w2 'Mathl.' jasno ≠ "
         'Andreas; h34 tretja vrstica — Michel ×2 + Mathl)'),
        ('39', 'Schimer Mache[?]', '39', 'Schönig Maria',
         "ime POPRAVEK Schönig Maria -> Schimer Mache[?] (x24: 'Schimer' jasno; h39 presek "
         "p32-r1 + PT H-039 'Schim[?]er Mache[?]'; v57 'Schönig' = PUA h.1 'Schinig' zmešnjava)"),
        ('40', 'Pöching. Mathl.[?]', '40', 'Pölling Maria',
         "ime POPRAVEK Pölling Maria -> Pöching. Mathl.[?] (h40 presek p32-r6/r18/r19 — isti "
         "lastnik; w2 'Mathl[?]/Michel[?]' dvom, Mathl skladnejše s h40-paroma)"),
        ('41', 'Pöching. Gorgy.[?]', '41', 'Pölling Georg',
         'ime POPRAVEK Pölling Georg -> Pöching. Gorgy.[?] (h41 presek p32-r5/r9; PUA h.41)'),
        ('42', 'Pöching. Mathl.[?]', '42', 'Pölling Michel',
         'ime POPRAVEK Pölling Michel -> Pöching. Mathl.[?] (h42; x24 ch jasno)'),
        ('41', 'Pöching. Gorgy.[?]', '41', 'Pölling Georg',
         'ime POPRAVEK Pölling Georg -> Pöching. Gorgy.[?] (h41 par z r10)'),
        ('7', 'Deuwaldich Mathl.[?]', '7', 'Deuwaldsch Gabriel',
         "ime POPRAVEK Deuwaldsch Gabriel -> Deuwaldich Mathl.[?] (w2 'Mathl.' jasno ≠ "
         'Gabriel; w1 dvom)'),
        ('47', 'Hladnikhar[?] Marko', '47', 'Widhalden Mathäus',
         'ime POPRAVEK Widhalden Mathäus -> Hladnikhar[?] Marko (h47 presek p32-r12/r14/r16 '
         '×3; v57 fabriirana)'),
        ('31', 'Krischan Mathä.[?]', '31', 'Witschak Mathäus',
         "ime POPRAVEK Witschak Mathäus -> Krischan Mathä.[?] (w1 '?rischar' — K/W iniciální "
         'dvom, Krischan = PUA h.34/36/37 forma; cf. p34-r16/r17, p35-r10; w2 kratica Mathä; '
         "cf. p46 'Witschkan' riziko)"),
        ('20', 'Deuwaldich Mathl.[?]', '20', 'Dewaltsch Michel',
         'ime POPRAVEK Dewaltsch Michel -> Deuwaldich Mathl.[?] (h20 par z r6)'),
        ('7', 'Lauhaldich Mathl.[?]', '7', 'Lauhaldsch Michel',
         "ime POPRAVEK Lauhaldsch Michel -> Lauhaldich Mathl.[?] (w2 'Mathl.' jasno ≠ Michel; "
         "w1 ≈ v57 'Lauhaldsch' — ch/sch dvom)"),
        ('42', 'Pöching. Mathl.[?]', '42', 'Hirzog Mathilde',
         "ime POPRAVEK Hirzog Mathilde -> Pöching. Mathl.[?] (Blatt-619 tall: '42 | Pöching "
         "Mathl.' jasno; h42; v57 'Hirzog' fabriirana — ne obstaja v črnilu)"),
        ('7', 'Zellhamisch Mathl.[?]', '7', 'Zellhamisch Mathäus',
         "ime POPRAVEK Zellhamisch Mathäus -> Zellhamisch Mathl.[?] (Blatt-619 tall; w1 ≈ v57 "
         '— Z/L iniciální dvom; w2 = kratica Mathl, v57 Mathäus = ekspanzija)'),
        ('113', 'Brulla Maria.[?]', '113', 'Prunkl Maria',
         "ime POPRAVEK Prunkl Maria -> Brulla Maria.[?] (Blatt-620 tall: 'Brulla Maria' jasno "
         '— cf. h43 Brulla; h113 samostojna hiša; [?] na w2-akcentu)'),
    ],
}

PAGES[34] = {
    'note': ('p34 = format "Priimek, Krstno" (druga pisarska roka); "Piber" ×5 = črnilo '
             "'Ponter[?]' (P-o-n-t-er; brez PT/PUA preseka za h140-143); h68 'Eberl' = "
             "Ulrich Michel.[?] (E/U glyf; cf. del 2a p31-r14 'H?ich Mieö' isti h68 — oblika "
             'odprto vprašanje); Ring-familija potrjena: h28 ×2 Ring Michl + h26 ×2 Ring '
             'Johann (del 2a grozda); h14 haus POPRAVEK 26->28 (par struktura); h27 '
             "'Muhldorfer' = Mulschitsch[?]; h31 'Bruschatz' = Witschan[?] (K/W dvom); r20 "
             '(v115 vstavljena) = imenska celica PRAZNA — razhajanje odprto; 2 ditto ovrženih'),
    'rows': [
        ('142', 'Ponter, Mathl.[?]', '142', 'Piber, Matthel',
         "ime POPRAVEK Piber, Matthel -> Ponter, Mathl.[?] (x30: w1 'Ponter' — P + o + n + t "
         '+ er, 5-6 minimov, ne "Piber"; brez PT/PUA preseka za h140-143 — [?]; w2 kratica '
         'Mathl., v57 Matthel = različica)'),
        ('80', 'Ponter, Mathl.[?]', '80', 'Piber, Matthel',
         'ime POPRAVEK Piber, Matthel -> Ponter, Mathl.[?] (h80 par z r0) + ditto ovržen: '
         'črnilo piše polno ime'),
        ('140', 'Ponter, Mathl.[?]', '140', 'Piber, Matthel',
         'ime POPRAVEK Piber, Matthel -> Ponter, Mathl.[?] (isti w1 kot r0/r1) + ditto ovržen: '
         'črnilo piše polno ime'),
        ('141', 'Ponter, Gorgy.[?]', '141', 'Piber, Georg',
         'ime POPRAVEK Piber, Georg -> Ponter, Gorgy.[?] (isti w1; w2 Gorgy = del-2a forma)'),
        ('142', 'Ponter, Martin.[?]', '142', 'Piber, Martin',
         "ime POPRAVEK Piber, Martin -> Ponter, Martin.[?] (h142 par z r0; rdeči pripis "
         "'Postella[?]' + v114 razhajanje 6/4 ostajata)"),
        ('143', 'Ravella, Michl', '143', 'Ravella, Michl',
         "soglasje (w1 'Ravella[?]' ≈ v57 — P/R glyf-dvom opomba; w2 Michl ✓)"),
        ('18', 'Ulrich Michel.[?]', '18', 'Wurich, Albert',
         "ime POPRAVEK Wurich, Albert -> Ulrich Michel.[?] (w2 'Michel.' jasno ≠ Albert; w1 "
         "'Ulrich[?]/Urich[?]' — U/E, brez W — [?]; haus 18 potrjen x24: 1 + 8)"),
        ('32', 'Ulrich Georg.[?]', '32', 'Wurich, Georg',
         "ime POPRAVEK Wurich, Georg -> Ulrich Georg.[?] (h32 ×3; w2 'Georg.' jasno — "
         "p35-r8/r9 isti h32 'Ulrich Georg' potrjuje; w1 [?])"),
        ('68', 'Ulrich Michel.[?]', '68', 'Eberl, Michl',
         "ime POPRAVEK Eberl, Michl -> Ulrich Michel.[?] (x30: w1 'Elrich/Ulrich' — E/U glyf "
         'dvom; w2 Miehl[?]/Michel[?] dvom; cf. del 2a p31-r14 "68 | H?ich Mieö" -> '
         "'Hoch Mito[?]' — isti h68, oblika odprto vprašanje, dvom izrecen)"),
        ('32', 'Ulrich Georg.[?]', '32', 'Wurich, Georg',
         'ime POPRAVEK Wurich, Georg -> Ulrich Georg.[?] (h32 par z r7)'),
        ('27', 'Mulschitsch Johann.[?]', '27', 'Muhldorfer, Johann',
         "ime POPRAVEK Muhldorfer, Johann -> Mulschitsch Johann.[?] (v57 'Muhldorfer' ne "
         "obstaja v črnilu — page-singleton; w1 'Mulschitsch[?]/Malwischly[?]' dvom — cf. "
         'p35-r12/r13 + p37-r17/r18 isti h27)'),
        ('30', 'Dappler, Mathl.[?]', '30', 'Dappler, Mathä',
         "ime POPRAVEK Dappler, Mathä -> Dappler, Mathl.[?] (w1 soglasna forma — '-len/-er' "
         'dvom opomba; w2 kratica Mathl., v57 Mathä = ekspanzija)'),
        ('28', 'Ring Michl.', '28', 'Wuring, Michl',
         'ime POPRAVEK Wuring, Michl -> Ring Michl. (h28 = Ring hiša — del 2a grozda h23-h28; '
         'R-glyf; v57 "Wuring" = isto črnilo z W-namesto R)'),
        ('26', 'Ring Johann.', '26', 'Wuring, Johann',
         'ime POPRAVEK Wuring, Johann -> Ring Johann. (h26 = Ring Johann — del 2a: p27-r1/r5, '
         'p29, p30)'),
        ('28', 'Ring Michl.', '26', 'Wuring, Albert',
         'haus POPRAVEK 26->28 (x24 jasno; h28 par z r12 — parna struktura) + ime POPRAVEK '
         'Wuring, Albert -> Ring Michl. (isti zapis kot r12)'),
        ('26', 'Ring Johann.', '26', 'Wuring, Johann',
         'ime POPRAVEK Wuring, Johann -> Ring Johann. (h26 par z r13)'),
        ('31', 'Witschan Martin.[?]', '31', 'Bruschatz, Martin',
         "ime POPRAVEK Bruschatz, Martin -> Witschan Martin.[?] (w1 'Witschan[?]/Krischan[?]' "
         '— K/W dvom; cf. p33-r15, p35-r10 isti h31; cf. p46 "Witschkan"; v57 Bruschatz '
         'fabriirana)'),
        ('31', 'Witschan Miche.[?]', '31', 'Bruschatz, Michl',
         'ime POPRAVEK Bruschatz, Michl -> Witschan Miche.[?] (h31 par z r16; w2 '
         "Miche[?]/Michl[?] dvom)"),
        ('32', 'Ulrich Georg.[?]', '32', 'Wurich, Georg',
         'ime POPRAVEK Wurich, Georg -> Ulrich Georg.[?] (h32 ×3 z r7/r9; v114 razhajanje '
         '1038/1088 ostaja)'),
        ('68', 'Ulrich Mich.[?]', '68', 'Eberl, Michl',
         'ime POPRAVEK Eberl, Michl -> Ulrich Mich.[?] (h68 par z r8; w2 krajša forma '
         'Mich.[?]/Miehl[?] dvom)'),
        ('', '(prazno)', '', 'Hurich/Lohingr Mich.[?]',
         "razhajanje odprto: v115 vstavljena vrstica (kla 70, kultur Lubya) — imenska celica "
         'črnila PRAZNA na pričakovani poziciji (med r19 in Fürtragom, x8 autocontrast); '
         "v115 'Hurich/Lohingr Mich.[?]' ni potrjena ne ovržena — v115 vrednost ostaja"),
    ],
}

PAGES[35] = {
    'note': ('p35: "Witsch" ×6 = fabriirana (črnilo Ulrich/Stüllach/Deuwaldich/Krischan/'
             'Dappler/Ring); h68 ×2 = Ulrich Michel (presek p34); h34 ×2 = Stüllach Mathl '
             '(presek p33); h32 ×2 = Ulrich Georg (rešuje p34 h32 w2 = Georg, ne Grangy); '
             'h20 = Deuwaldich (presek p33); h31 = Krischan Marko; h30 ×3 = Dappler Mathl '
             '(presek p34-r11); h26 ×2 = Ring Johann; h28 ×2 = Ring (Michl/Milo); h27 ×2 '
             'Malwischly soglasje; h1 Wier Grunigman + h"k" Gemein[e] soglasje; brez haus '
             'POPRAVEK, brez ditto'),
    'rows': [
        ('68', 'Ulrich Michel.[?]', '68', 'Witsch Miko',
         'ime POPRAVEK Witsch Miko -> Ulrich Michel.[?] (h68 presek p34-r8/r19; v57 '
         'fabriirana)'),
        ('35', 'Killach Mathl.[?]', '35', 'Pirih Matheu',
         "ime POPRAVEK Pirih Matheu -> Killach Mathl.[?] (x24: w1 'Killach[?]' — K-inicial, "
         'cf. h34 Stüllach druga družina; rdeči pripis na vrstici ostaja; w2 kratica Mathl.)'),
        ('34', 'Stüllach Mathl.[?]', '34', 'Witsch Mathä',
         'ime POPRAVEK Witsch Mathä -> Stüllach Mathl.[?] (h34 presek p33-r4/r5/r7; w1 '
         "St-forma jasna; w2 'Mathl.[?]/Mathe[?]')"),
        ('34', 'Stüllach Mathl.[?]', '34', 'Witsch Mathä',
         'ime POPRAVEK Witsch Mathä -> Stüllach Mathl.[?] (h34 par z r2)'),
        ('1', 'Wier Grunigman', '1', 'Wier Grunigman',
         "soglasje (w1 'Wier[?]' + w2 'Grunigman[?]' ≈ v57 — oblika nejasna pri x24, [?]; "
         'PUA h.1 "Schinig Major" nezadosten presek)'),
        ('20', 'Deuwaldich Mathl.[?]', '20', 'Drucklhofer Matheu',
         'ime POPRAVEK Drucklhofer Matheu -> Deuwaldich Mathl.[?] (h20 presek p33-r6/r16; '
         'v57 fabriirana)'),
        ('k', 'Gemeinde', 'k', 'Gemeinde',
         'soglasje (črnilo "Gemeinde" jasno; haus "k" kot v57)'),
        ('68', 'Ulrich Michel.[?]', '68', 'Witsch Miko',
         'ime POPRAVEK Witsch Miko -> Ulrich Michel.[?] (h68 par z r0)'),
        ('32', 'Ulrich Georg.', '32', 'Witsch Georg',
         'ime POPRAVEK Witsch Georg -> Ulrich Georg. (h32 presek p34-r7/r9/r18; w2 Georg '
         'jasno — popravlja tudi p34 h32 w2 branja)'),
        ('32', 'Ulrich Georg.', '32', 'Witsch Georg',
         'ime POPRAVEK Witsch Georg -> Ulrich Georg. (h32 par z r8)'),
        ('31', 'Krischan Marko.[?]', '31', 'Mikoschich Matheo',
         "ime POPRAVEK Mikoschich Matheo -> Krischan Marko.[?] (h31 presek p33-r15 + "
         "p34-r16/r17; w1 K/W dvom; w2 'Marko[?]/Marto[?]' dvom)"),
        ('30', 'Dappler Mathl.[?]', '30', 'Leupold Matheo',
         'ime POPRAVEK Leupold Matheo -> Dappler Mathl.[?] (h30 presek p34-r11; isti w1)'),
        ('27', 'Malwischly Johann.[?]', '27', 'Malwischly Johann',
         "soglasje (w1 'Malwischly[?]/Malleschily[?]' ≈ v57 Mallwitsch-familija — forma-dvom "
         'opomba; h27 presek p34-r10 Mulschitsch[?] — oblika odprta) '),
        ('27', 'Malwischly Johann.[?]', '27', 'Malwischly Johann',
         'soglasje (h27 par z r12; isti opombi)'),
        ('26', 'Ring Johann.', '26', 'Pirig Johand',
         'ime POPRAVEK Pirig Johand -> Ring Johann. (h26 presek p34-r13/r15 + del 2a; R-glyf '
         'z zanko)'),
        ('26', 'Ring Johann.', '26', 'Pirig Johand',
         'ime POPRAVEK Pirig Johand -> Ring Johann. (h26 par z r14)'),
        ('28', 'Ring Michl.', '28', 'Piring Miko',
         'ime POPRAVEK Piring Miko -> Ring Michl. (h28 presek p34-r12/r14)'),
        ('30', 'Dappler Mathl.[?]', '30', 'Frugel Matheo',
         'ime POPRAVEK Frugel Matheo -> Dappler Mathl.[?] (h30 ×3 z r11/r18)'),
        ('30', 'Dappler Mathl.[?]', '30', 'Leupold Matheo',
         'ime POPRAVEK Leupold Matheo -> Dappler Mathl.[?] (h30 par z r11/r17)'),
        ('28', 'Ring Milo.[?]', '28', 'Piring Miko',
         "ime POPRAVEK Piring Miko -> Ring Milo.[?] (h28 par z r16; w2 'Milo[?]/Michl[?]' "
         'dvom — cf. del 2a "Ring Mito[?]")'),
    ],
}

PAGES[36] = {
    'note': ('p36 = "Wernig" ×6 = črnilo RING (h24 ×3 Michael, h26 Johann, h25 Mito, h23 '
             'Mathä — del 2a grozda h23-h28 v celoti potrjena čez p37); Müllner hiša h29 '
             '(r0/r1/r12 + p37-r1); Krischan h66 ×2; Puchey h64/67; 2 haus POPRAVEK (r8 '
             '36->35 Tillach/Killach hiša, r17 64->67); 3 ditto ovrženih (r1, r5, r7); '
             'vrednostna kolona brez premika (klafter r8=263, r9=184, r10=37 sidro)'),
    'rows': [
        ('29', 'Müllner Samuel.', '29', 'Müllner Samuel',
         "soglasje (w1 'Müllner' jasno; w2 'Samuel[?]/Tramel[?]' dvom pri x24 — v57 ohranjeno)"),
        ('29', 'Müllner Samuel.', '29', 'Müllner Samuel',
         'soglasje + ditto ovržen: črnilo piše polno ime (h29 par z r0)'),
        ('24', 'Ring Michael.', '24', 'Wernig Michael',
         'ime POPRAVEK Wernig Michael -> Ring Michael. (h24 = Ring Michael hiša — del 2a '
         'grozda; v57 "Wernig" ×5 na p28 že dokazano fabriirana)'),
        ('65', 'Ring Martho.[?]', '65', 'Wernig Martin',
         "ime POPRAVEK Wernig Martin -> Ring Martho.[?] (w1 Ring-forma; w2 'Martho[?]/Matho[?]"
         "/Martin[?]' dvom; h65 izven Ring-grozde h23-h28 — dvom izrecen)"),
        ('66', 'Krischan Georg.[?]', '66', 'Puchegger Georg',
         "ime POPRAVEK Puchegger Georg -> Krischan Georg.[?] (w1 '?rischar' — K/W dvom, "
         'Krischan forma; h66 par z r5; v57 fabriirana)'),
        ('66', 'Krischan Georg.[?]', '66', 'Puchegger Georg',
         'ime POPRAVEK Puchegger Georg -> Krischan Georg.[?] (h66 par z r4) + ditto ovržen: '
         'črnilo piše polno ime'),
        ('22', 'Müllner Johann.', '22', 'Müllner Johann',
         'soglasje (w1+w2 jasno; anm Dingfeldsbesitz/Villa/Gütlein ostajajo)'),
        ('22', 'Müllner Johann.', '22', 'Müllner Johann',
         'soglasje + ditto ovržen: črnilo piše polno ime'),
        ('35', 'Tillach Peter.[?]', '36', 'Tischler Peter',
         "haus POPRAVEK 36->35 (x14: 5 z zastavico; h35 = Killach hiša p35-r1) + ime POPRAVEK "
         "Tischler Peter -> Tillach Peter.[?] (w1 'Tillach[?]/Killach[?]' dvom — isti h35 "
         'družinski zapis; v57 "Tischler" = page-singleton; klafter 263 ostaja na vrstici)'),
        ('22', 'Müllner Johann.', '22', 'Müllner Johann',
         'soglasje (h22; črnilo polno ime)'),
        ('24', 'Ring Michael.', '24', 'Wernig Michael',
         'ime POPRAVEK Wernig Michael -> Ring Michael. (h24 ×3 z r2/r14)'),
        ('20', 'Ring Mathä.[?]', '20', 'Wernig Michael',
         "ime POPRAVEK Wernig Michael -> Ring Mathä.[?] (h20; w2 'Mathä[?]/Mathe[?]/Michael[?]"
         "' dvom — krajša forma kot r10)"),
        ('29', 'Müllner Samuel.', '29', 'Müllner Samuel',
         'soglasje (h29 par z r0/r1)'),
        ('26', 'Ring Johann.', '26', 'Wernig Jakob',
         'ime POPRAVEK Wernig Jakob -> Ring Johann. (h26 = Ring Johann hiša — del 2a)'),
        ('24', 'Ring Michael.', '24', 'Wernig Michael',
         'ime POPRAVEK Wernig Michael -> Ring Michael. (h24 par z r10)'),
        ('25', 'Ring Mito.[?]', '25', 'Wernig Milt',
         'ime POPRAVEK Wernig Milt -> Ring Mito.[?] (h25 = Ring Mito hiša — del 2a p31; w2 '
         "Mito[?]/Mich[?] dvom)"),
        ('23', 'Ring Mathä.[?]', '23', 'Krengg Mathäus',
         'ime POPRAVEK Krengg Mathäus -> Ring Mathä.[?] (h23 = Ring Mathä hiša — del 2a '
         'p27-r15, p28-r19, p30, p31)'),
        ('67', 'Puchey Georg.', '64', 'Puchegg Georg',
         'haus POPRAVEK 64->67 (tall2: "67" — 4/7 glyf-dvom izrecen; cf. h64 Puchey p31-r1/r2 '
         '= druga hiša iste družine) + ime POPRAVEK Puchegg Georg -> Puchey Georg. (del 2a '
         'forma — p31 "Puchey Georg" h64)'),
        ('67', 'Puchey Georg.', '67', 'Puchegg Georg',
         'ime POPRAVEK Puchegg Georg -> Puchey Georg. (h67 par z r17; del 2a forma)'),
        ('22', 'Müllner Johann.', '22', 'Müllner Johann',
         "soglasje (w1 'Müllig[?]/Müllner' forma-dvom opomba; kla 1307)"),
    ],
}

PAGES[37] = {
    'note': ('p37 = "Piringer uibio" ×8 + "Bruckner" ×5 = fabriirani; črnilo: Ring (h28 ×4? '
             'h26 ×1, h23, h25, h24 ×2, h20) + Müllner h29 + Bruckler h30 ×4 + Malwischly '
             'h27 ×2; 11 haus POPRAVEK (r4 25->23, r5 23->25 — v57 swap, r8 26->30, r9 '
             '28->25, r10 24->28, r12 28->24, r14 26->28, r15 28->30, r16 29->30, r18 28->27, '
             'r19 26->28) — parna struktura črnila (30×2, 24×2, 27×2, 28×3) dokazuje v57 '
             'haos; Ring-grozda h23-h28 s popolno pokritostjo'),
    'rows': [
        ('30', 'Bruckler Mathl.[?]', '30', 'Bruckner Mathl.',
         "ime POPRAVEK Bruckner Mathl. -> Bruckler Mathl.[?] (w1 'Bruckler[?]' — ck-l proti "
         "v57 ck-n, n/l glyf-dvom — [?]; w2 kratica Mathl.)"),
        ('29', 'Müllner Samuel.', '29', 'Piringer Samuel',
         'ime POPRAVEK Piringer Samuel -> Müllner Samuel. (h29 = Müllner hiša — p36-r0/r1/r12 '
         '×3; v57 fabriirana)'),
        ('28', 'Ring Michl.[?]', '28', 'Piringer uibio',
         'ime POPRAVEK Piringer uibio -> Ring Michl.[?] (h28 = Ring hiša; w2 '
         "Michl[?]/Müchö[?]/Mülo[?] dvom)"),
        ('26', 'Ring Johann.', '26', 'Piringer Johann',
         'ime POPRAVEK Piringer Johann -> Ring Johann. (h26 = Ring Johann hiša)'),
        ('23', 'Ring Mathä.[?]', '25', 'Piringer Mathl.',
         'haus POPRAVEK 25->23 (x14: 3 z zastavico; h23 = Ring Mathä hiša) + ime POPRAVEK '
         'Piringer Mathl. -> Ring Mathä.[?] (v57 swap r4/r5: črnilo 23, register 25)'),
        ('25', 'Ring Mito.[?]', '23', 'Piringer uibio',
         'haus POPRAVEK 23->25 (h25 = Ring Mito hiša — del 2a; v57 swap) + ime POPRAVEK '
         'Piringer uibio -> Ring Mito.[?] (w2 Mito[?]/Mülo[?] dvom)'),
        ('20', 'Ring Michl.[?]', '20', 'Piringer uibio',
         'ime POPRAVEK Piringer uibio -> Ring Michl.[?] (haus 20/26 glyf-dvom — v57 20 '
         'ohranjeno; w2 dvom)'),
        ('30', 'Bruckler Mathl.[?]', '30', 'Bruckner Mathl.',
         'ime POPRAVEK Bruckner Mathl. -> Bruckler Mathl.[?] (h30 par z r0)'),
        ('30', 'Bruckler Mathl.[?]', '26', 'Bruckner Mathl.',
         'haus POPRAVEK 26->30 (tall1: "30" jasno; h30 par z r7 — parna struktura) + ime '
         'POPRAVEK Bruckner Mathl. -> Bruckler Mathl.[?]'),
        ('25', 'Ring Michl.[?]', '28', 'Piringer uibio',
         'haus POPRAVEK 28->25 (x14: 5 z zastavico — 5/8 dvom izrecen) + ime POPRAVEK '
         'Piringer uibio -> Ring Michl.[?] (w2 dvom)'),
        ('28', 'Ring Michl.[?]', '24', 'Piringer uibio',
         'haus POPRAVEK 24->28 (x14: 8 z zankami jasna; h28 par z r13) + ime POPRAVEK '
         'Piringer uibio -> Ring Michl.[?]'),
        ('24', 'Ring Michael.', '24', 'Piringer Michael[?]',
         'ime POPRAVEK Piringer Michael[?] -> Ring Michael. (h24 = Ring Michael hiša — '
         'del 2a; v57 [?] za Michael izpolnjen s Ring-formo)'),
        ('24', 'Ring Michael.', '28', 'Piringer uibio',
         'haus POPRAVEK 28->24 (h24 par z r11) + ime POPRAVEK Piringer uibio -> Ring Michael.'),
        ('28', 'Ring Michl.[?]', '28', 'Piringer uibio',
         'ime POPRAVEK Piringer uibio -> Ring Michl.[?] (h28; anm "9 [rot] 1209" ostaja)'),
        ('28', 'Ring Michl.[?]', '26', 'Bruckner Mathl.',
         'haus POPRAVEK 26->28 (h28 par z r13) + ime POPRAVEK Bruckner Mathl. -> Ring '
         'Michl.[?]'),
        ('30', 'Bruckler Mathl.[?]', '28', 'Bruckner Mathl.',
         'haus POPRAVEK 28->30 (tall2 jasno; h30 par z r16) + ime POPRAVEK Bruckner Mathl. -> '
         'Bruckler Mathl.[?]'),
        ('30', 'Bruckler Mathl.[?]', '29', 'Mallwitsch Johann',
         'haus POPRAVEK 29->30 (h30 par z r15) + ime POPRAVEK Mallwitsch Johann -> Bruckler '
         'Mathl.[?] (v57 Mallwitsch = h27 družina, tu h30 Bruckler)'),
        ('27', 'Malwischly Johann.[?]', '27', 'Mallwitsch Johann',
         "soglasje (w1 'Malleschily[?]/Malwischly[?]' ≈ v57 Mallwitsch — forma-dvom; h27 par "
         'z r18)'),
        ('27', 'Malwischly Johann.[?]', '28', 'Piringer uibio',
         'haus POPRAVEK 28->27 (h27 par z r17; anm "790 [rot]" ostaja) + ime POPRAVEK '
         'Piringer uibio -> Malwischly Johann.[?]'),
        ('28', 'Ring Michl.[?]', '26', 'Piringer uiru',
         'haus POPRAVEK 26->28 (tall2: "28" z rdečo zastavico; h28) + ime POPRAVEK Piringer '
         'uiru -> Ring Michl.[?]'),
    ],
}


def main():
    for pg, data in PAGES.items():
        doc = {
            'meta': {
                'val': 119,
                'del': '2b',
                'page': pg,
                'scope': 'imenski pass (owner_original + haus_no) — agentov vid, 0 VLM klicev',
                'method': METHOD,
                'register_rows': len(data['rows']),
                'vlm_calls': 0,
                'diag_generated': [
                    f'zz-p{pg}-r00..r{len(data["rows"])-1:02d} (x24)',
                    f'gz-p{pg}-* (x26-x30 izbrani)',
                    f'tall prerezi p{pg} (x3.4, Blatt sidra)',
                ],
                'note': data['note'],
            },
            'names_audit': {
                f'r{i:02d}' if False else f'r{i}': {
                    'seen_haus': sh, 'seen_name': sn, 'old_haus': oh, 'old_name': on,
                    'verdict': v,
                } for i, (sh, sn, oh, on, v) in enumerate(data['rows'])
            },
        }
        path = os.path.join(OUT, f'p{pg}.json')
        with open(path, 'w') as f:
            json.dump(doc, f, ensure_ascii=False, indent=1)
        n_ime = sum(1 for _, _, _, _, v in data['rows'] if 'ime POPRAVEK' in v)
        n_haus = sum(1 for sh, _, oh, _, v in data['rows']
                     if 'haus POPRAVEK' in v)
        n_ditto = sum(1 for _, _, _, _, v in data['rows'] if 'ditto ovržen' in v)
        n_raz = sum(1 for _, _, _, _, v in data['rows'] if 'razhajanje odprto' in v)
        n_sog = sum(1 for _, _, _, _, v in data['rows'] if v.startswith('soglasje'))
        print(f'p{pg}: {len(data["rows"])} vrstic | ime {n_ime} | haus {n_haus} | '
              f'ditto {n_ditto} | razhajanja {n_raz} | soglasje {n_sog}')


if __name__ == '__main__':
    main()
