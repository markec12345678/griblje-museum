#!/usr/bin/env python3
"""Val 119 del 2c — reading-v119/p38..p43.json generator.
Vhodi: agentov vid glavne seje (0 VLM) — tall prerezi z r-markerji + zz-/gz-zoomi
(x22–x30, per-page dy: p38/p39/p40-dy6, p41-dy6..10, p42-dy-8, p43-dy14) + PUA presek
+ medstranski hišni preseki + glyf-kalibracija na p37 Ring/Bruckler formah.
Izhod: 6 reading JSONov (meta + names_audit, vlm_calls=0).
"""
import json
import os

OUT = '/home/z/griblje-museum/research-griblje/ps-n83/band-v113/reading-v119'
METHOD = ('tall prerezi z r-markerji + zz-/gz-pXX-rNN x22-x30 (per-page dy: p38/p39 +6, '
          'p41 +6..10, p42 -8, p43 +14; pisarjev ritem lokalno stisnjen na p39 r5.5) + '
          'medstranski hišni preseki (h23-h28 Ring, h29 Müllner, h30 Bruckler, h42/40/41 '
          'Pöching, h43 Brulla, h49 Schimetz, h51/52/68/81 Ulrich, h61 Tillach, h62/63/66 '
          'Krischan, h64 Veritschan, h65 Ring Martho/Dorothea/Jakob[?], h67 Puchey/Pöching) '
          '+ PUA presek (h.61 Tillak, h.62 Brinczhan, h.64 Veritscher, h.65 Widhann, '
          'h.68 Urich Mattle, h.69 Christian Brandl) + PT + registarski presek; '
          '2↔3/4↔1/5↔6 glyf-pravila del 2a; 3-glyf brez zastavice (p41-r15 32, p43-r16 63), '
          '4-glyf kot 61/64 (p42-r14 49), 8-glyf dvojna zanka (p41-r14 68)')

PAGES = {}

PAGES[38] = {
    'note': ('p38 = nadaljevanje Ring-grozde + parna struktura (9 parov/trio + 1 nerešljiv '
             'r15): h26 Ring Johann ×2, h28 Ring Michl ×2, h27 Malleschick Johann ×3, h30 '
             'Bruckler Mathl ×2, h67 Puchey Georg ×2, h23 Ring Mathä ×2, h24 Ring Michael '
             '×2, h25 Ring Michl ×2, h29 Müllner Samuel ×2; 2 haus POPRAVEK (25->23 r5, '
             '23->29 r18); r15 = nerešljiva dolga beseda (razhajanje odprto, v57 '
             "'Vilip[?]züanjanky' ohranjeno, haus 29 rjavi ink)"),
    'rows': [
        ('26', 'Ring Johann.', '26', 'König Johann',
         "ime POPRAVEK König Johann -> Ring Johann. (w1 glyf identičen p37-r02 'Ring' "
         "kalibra x30; h26 par z r10; v57 'König' fabriirana — glyf nima K-zastavice)"),
        ('28', 'Ring Michl.[?]', '28', 'König Michl',
         "ime POPRAVEK König Michl -> Ring Michl.[?] (h28 par z r9; glyf = Ring forma)"),
        ('27', 'Malleschick Johann.[?]', '27', 'Mallwoschki Johann',
         "ime POPRAVEK Mallwoschki Johann -> Malleschick Johann.[?] (h27 trio z r11/r19; "
         "ink 'Malleschick/Malteoschick' — cf. p30 'Mattheitsch', p37 'Mallwitsch', PUA h.27 "
         "'Malleßthak[?]'; page-level forma z [?])"),
        ('30', 'Bruckler Mathl.[?]', '30', 'Buttler Michael',
         "ime POPRAVEK Buttler Michael -> Bruckler Mathl.[?] (h30 par z r12; w1 glyf = p37 "
         "'Bruckler' forma, w2 'Mathl.' kot p37 ×5; v57 'Buttler' fabriirana)"),
        ('67', 'Puchey Georg.', '67', 'Pichler Georg',
         "ime POPRAVEK Pichler Georg -> Puchey Georg. (h67 par z r14; glyf = p36-r17 "
         "'Puchey Georg.' forma x26 identična; v57 'Pichler' fabriirana)"),
        ('23', 'Ring Mathä.[?]', '25', 'König Michael',
         "haus POPRAVEK 25->23 (gz x26: 3-glyf jasna, cf. r13 '23'; v57 2↔3 šum) + ime "
         "POPRAVEK König Michael -> Ring Mathä.[?] (h23 par z r13; w2 'Mathe.' = Mathä)"),
        ('24', 'Ring Michael.', '24', 'König Michael',
         "ime POPRAVEK König Michael -> Ring Michael. (h24 par z r17; w2 'Michael.' jasno)"),
        ('25', 'Ring Michl.[?]', '25', 'König Michl',
         "ime POPRAVEK König Michl -> Ring Michl.[?] (h25 par z r16; 5-glyf z zastavico)"),
        ('29', 'Müllner Samuel.', '29', 'Millig Romuald',
         "ime POPRAVEK Millig Romuald -> Müllner Samuel. (h29 par z r18; ink w1 "
         "'Milling[?]' = p37-r1 forma, normalizirano na 'Müllner' po del-2b h29 konvenciji; "
         "PUA h.29 'Milleg Hanu' orient.; v57 'Romuald' fabriirana — črnilo 'Samuel.')"),
        ('28', 'Ring Michl.[?]', '28', 'König Michl',
         "ime POPRAVEK König Michl -> Ring Michl.[?] (h28 par z r1)"),
        ('26', 'Ring Johann.', '26', 'König Johann',
         "ime POPRAVEK König Johann -> Ring Johann. (h26 par z r0)"),
        ('27', 'Malleschick Johann.[?]', '27', 'Mallwoschki Johann',
         "ime POPRAVEK Mallwoschki Johann -> Malleschick Johann.[?] (h27 trio)"),
        ('30', 'Bruckler Mathl.[?]', '30', 'Buttler Michael',
         "ime POPRAVEK Buttler Michael -> Bruckler Mathl.[?] (h30 par z r3)"),
        ('23', 'Ring Mathä.[?]', '23', 'Pongy Mathäus',
         "ime POPRAVEK Pongy Mathäus -> Ring Mathä.[?] (h23 par z r5; v57 'Pongy' "
         "fabriirana — črnilo = Ring glyf + 'Mathe.')"),
        ('67', 'Puchey Georg.', '67', 'Pichler Georg',
         "ime POPRAVEK Pichler Georg -> Puchey Georg. (h67 par z r4)"),
        ('29', 'Vilip[?]züanjanky', '29', 'Vilip[?]züanjanky',
         "razhajanje odprto: črnilo = dolga beseda ~'Ruberstzünjunganky.[?]' (nerešljiva "
         "page-singleton — nobena beseda ne obstaja drugje v 2875 vrsticah; morda ne-osebni "
         "zapis/namig, ne ime), v57 'Vilip[?]züanjanky' ohranjeno; haus '29' rjavi ink "
         "(kasnejši vpis?) — skladen z r8/r18 Müllner-contextom, ohranjeno"),
        ('25', 'Ring Michl.[?]', '25', 'Primz[?] Michl',
         "ime POPRAVEK Primz[?] Michl -> Ring Michl.[?] (h25 par z r7; v57 'Primz[?]' "
         "fabriirana)"),
        ('24', 'Ring Michael.', '24', 'König Michael',
         "ime POPRAVEK König Michael -> Ring Michael. (h24 par z r6)"),
        ('29', 'Müllner Samuel.', '23', 'Millig Romane',
         "haus POPRAVEK 23->29 (gz x26: 9-glyf z zanko jasna; h29 par z r8) + ime POPRAVEK "
         "Millig Romane -> Müllner Samuel. (isti glyf kot r8; v57 'Romane' fabriirana)"),
        ('27', 'Malleschick Johann.[?]', '27', 'Mallwoschki Johann',
         "ime POPRAVEK Mallwoschki Johann -> Malleschick Johann.[?] (h27 trio)"),
    ],
}

PAGES[39] = {
    'note': ('p39 = črnilovrstna sekvenca IDENTIČNA p37 (21 vrstic, stisnjeni dvojniki '
             'r5/r5.5): 30 Bru, 29 MüS, 28 RM, 26 RJ, 23 RMa, 25 RMi ×2, 30 Bru ×2, 25 RMi, '
             '28 RM, 24 RMichael ×2, 28 RM ×2, 30 Bru ×2, 27 Mall ×2, 28 RM ×2; 8 haus '
             'POPRAVEK (20->23, 23->25 ×2, 26->25, 26->30 ×2, 29->27 ×2); cross-page: '
             'p37-r6 (merged haus 20) nosi isto "25."-glyfo kot p39 r5/r6 — dvom zabeležen'),
    'rows': [
        ('30', 'Bruckler Mathl.[?]', '30', 'Buchler Mathel',
         "ime POPRAVEK Buchler Mathel -> Bruckler Mathl.[?] (h30; = p37/p38 forma; v57 "
         "'Buchler' fabriirana B/R-glyf)"),
        ('29', 'Müllner Samuel.', '29', 'Mally Samuel',
         "ime POPRAVEK Mally Samuel -> Müllner Samuel. (h29 konvencija del 2b; ink w1 "
         "'Milling[?]'; PUA h.29 'Milleg' orient.)"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28; glyf = Ring forma; v57 'Höring' "
         "fabriirana — masovni vzorec)"),
        ('26', 'Ring Johann.', '26', 'Höring Johann',
         "ime POPRAVEK Höring Johann -> Ring Johann. (h26; glyf = Ring forma)"),
        ('23', 'Ring Mathä.[?]', '20', 'Höring Mathel',
         "haus POPRAVEK 20->23 (gz x26: 3-glyf jasna ob 'Ring Mathe.') + ime POPRAVEK "
         "Höring Mathel -> Ring Mathä.[?] (h23 par z r5-grozdo; v57 2↔3/0 šum)"),
        ('25', 'Ring Michl.[?]', '23', 'Höring Michl',
         "haus POPRAVEK 23->25 (gz x26 dy0: 5-glyf z zastavico '25'') + ime POPRAVEK "
         "Höring Michl -> Ring Michl.[?] (h25 par z r6-stisnjenim dvojnikom)"),
        ('25', 'Ring Michl.[?]', '23', 'Höring Michl',
         "haus POPRAVEK 23->25 (gz x26 dy12: stisnjeni dvojnik r5.5 '25.' jasno — pisarjev "
         "ritem kot p37 r5/r5.5) + ime POPRAVEK Höring Michl -> Ring Michl.[?]"),
        ('30', 'Bruckler Mathl.[?]', '30', 'Buchler Mathel',
         "ime POPRAVEK Buchler Mathel -> Bruckler Mathl.[?] (h30 par z r8)"),
        ('30', 'Bruckler Mathl.[?]', '30', 'Buchler Mathel',
         "ime POPRAVEK Buchler Mathel -> Bruckler Mathl.[?] (h30 par z r7)"),
        ('25', 'Ring Michl.[?]', '26', 'Höring Michl',
         "haus POPRAVEK 26->25 (tall: '25'' jasno; h25 = Ring grozda) + ime POPRAVEK "
         "Höring Michl -> Ring Michl.[?]"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28)"),
        ('24', 'Ring Michael.', '24', 'Höring Johann L',
         "ime POPRAVEK Höring Johann L -> Ring Michael. (gz x26: w2 'Michael.' jasno — "
         "h24 = Ring Michael konvencija del 2a/2b; v57 'Johann L' fabriirana)"),
        ('24', 'Ring Michael.', '24', 'Höring Michael',
         "ime POPRAVEK Höring Michael -> Ring Michael. (h24 par z r11)"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28 par z r14)"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28 par z r13)"),
        ('30', 'Bruckler Mathl.[?]', '26', 'Buchler Mathel',
         "haus POPRAVEK 26->30 (tall: '30' jasno; h30 = Bruckler) + ime POPRAVEK Buchler "
         "Mathel -> Bruckler Mathl.[?]"),
        ('30', 'Bruckler Mathl.[?]', '26', 'Buchler Mathl',
         "haus POPRAVEK 26->30 (tall: '30.' jasno; par z r15) + ime POPRAVEK Buchler Mathl "
         "-> Bruckler Mathl.[?]"),
        ('27', 'Malleschick Johann.[?]', '29', 'Mallerseb[?] Johann',
         "haus POPRAVEK 29->27 (tall: '27.' jasno; h27 = Malleschick/Mallwitsch) + ime "
         "POPRAVEK Mallerseb[?] Johann -> Malleschick Johann.[?] (v57 'Mallerseb[?]' "
         "fabriirana)"),
        ('27', 'Malleschick Johann.[?]', '29', 'Mallerseb[?] Johann',
         "haus POPRAVEK 29->27 (tall: '27.' jasno; par z r17) + ime POPRAVEK Mallerseb[?] "
         "Johann -> Malleschick Johann.[?]"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28 par z r20)"),
        ('28', 'Ring Michl.[?]', '28', 'Höring Michl',
         "ime POPRAVEK Höring Michl -> Ring Michl.[?] (h28 par z r19)"),
    ],
}

PAGES[40] = {
    'note': ('p40 = nova sekcija (Blatt 1/) z Ring-grozdo na vrhu + Pöching/Brulla/Krischan '
             'preseki + h65 Ring grozd (Dorothea/Martho/Jakob[?]): h23/h25/h24 Ring ×4, h29 '
             'Müllner Samuel, h12 Schaffschick, h43 Brulla ×2, h42/h40/h41 Pöching, h21 '
             'Pöching Michl ×2, h20 Pöching Michael, h22 Müllner Johann, h66 Krischan Georg, '
             'h65 Ring ×3, h64 Veritschan; 1 ditto ovržen (r1); r12 = ne-osebna poteza + '
             'prazen haus (razhajanje, v57 ohranjeno)'),
    'rows': [
        ('1 / 23', 'Ring Mathä.[?]', '1 / 23', 'Wernig Mathäus',
         "ime POPRAVEK Wernig Mathäus -> Ring Mathä.[?] (h23; glyf = Ring forma; v57 "
         "'Wernig' fabriirana — del-2a vzorec)"),
        ('1 / 25', 'Ring Michl.[?]', '1 / 25', 'Wernig Mathäus',
         "ime POPRAVEK Wernig Mathäus -> Ring Michl.[?] (h25; glyf = Ring forma) + DITTO "
         "CLEAR: črnilo piše polno ime 'Ring Michl.' — v57 ditto-zastavica ovržena"),
        ('1 / 24', 'Ring Michael.', '1 / 24', 'Wernig Michael',
         "ime POPRAVEK Wernig Michael -> Ring Michael. (h24; w2 'Michael.' jasno)"),
        ('1 / 29', 'Müllner Samuel.', '1 / 29', 'Willing Johann',
         "ime POPRAVEK Willing Johann -> Müllner Samuel. (h29 konvencija; ink 'Milling "
         "Samuel.'; v57 obe besedi fabriirani)"),
        ('1 / 12', 'Schaffschick Mathl.[?]', '1 / 12', 'Schiffbauer Mathäus',
         "ime POPRAVEK Schiffbauer Mathäus -> Schaffschick Mathl.[?] (w1 'Schaffschick[?]' "
         "— ff jasno; h12 presek p45/p49 'Lukasitsch' alternativa; w2 'Mathl.[?]/Michl.[?]' "
         "dvom; v57 'Schiffbauer' fabriirana)"),
        ('1 / 43', 'Brulla Michl.[?]', '1 / 43', 'Rudolla Nißl',
         "ime POPRAVEK Rudolla Nißl -> Brulla Michl.[?] (h43 = p32 forma 'Brulla Michl[?]' "
         "×2; glyf = p32/p37 Brulla forma; v57 fabriirana)"),
        ('1 / 42', 'Pöching. Mathel.[?]', '1 / 42', 'Pechley Mathäus',
         "ime POPRAVEK Pechley Mathäus -> Pöching. Mathel.[?] (h42 = p32 forma; w1 "
         "'Pöching' ch jasno; v57 'Pechley' fabriirana)"),
        ('1 / 40', 'Pöching Johann.', '1 / 40', 'Pechley Johann',
         "ime POPRAVEK Pechley Johann -> Pöching Johann. (h40; gz x26: w2 'Johann.' jasno "
         "— J-glyf; h40 = Pöching hiša)"),
        ('1 / 41', 'Pöching. Gorgy.[?]', '1 / 41', 'Pechley Georg',
         "ime POPRAVEK Pechley Georg -> Pöching. Gorgy.[?] (h41 = p32 forma 'Pöching. "
         "Gorgy.[?]')"),
        ('1 / 43', 'Brulla Michl.[?]', '1 / 43', 'Wundala nißl',
         "ime POPRAVEK Wundala nißl -> Brulla Michl.[?] (h43 par z r5)"),
        ('1 / 24', 'Ring Michael.', '1 / 24', 'Wernig Michael',
         "ime POPRAVEK Wernig Michael -> Ring Michael. (h24 par z r2)"),
        ('1 / 21', 'Pöching Michl.[?]', '1/21', 'Pechley Nißl',
         "ime POPRAVEK Pechley Nißl -> Pöching Michl.[?] (h21 par z r13; PUA h.21 'Pfarrer "
         "Michael Sautter' orient.)"),
        ('1 / 31', 'Wunderling', '1 / 31', 'Wunderling',
         "razhajanje odprto: črnilo = ne-osebna poteza z dolgim repom (~'Ulrich-Gütl-"
         "zugehörig[?]'-fraza, nerešljiva), haus celica PRAZNA v črnilu (dy 0/6/14); v57 "
         "'Wunderling' + haus 31 ohranjena (p34-r20 precedens: vsebine praznih/vrstično "
         "vpršanih celic ne izpraznimo tiho); vrednostne celice prazne = konsistentno "
         "(v114 anm. že opisuje vrstico kot preklicano/prazno)"),
        ('1 / 21', 'Pöching Michl.[?]', '1 / 21', 'Pechley Mich°',
         "ime POPRAVEK Pechley Mich° -> Pöching Michl.[?] (h21 par z r11; v115 vstavljena "
         "vrstica (tekač 734), rdeče prečrtana — ime v črnilu jasno)"),
        ('1 / 20', 'Pöching Michael', '1 / 20', 'Pechley Michael',
         "ime POPRAVEK Pechley Michael -> Pöching Michael (gz x30: haus '20.' jasno — "
         "0-glyf oval, NI 5; h20; 'tot [rot]' anm. ostaja)"),
        ('1 / 22', 'Müllner Johann', '1 / 22', 'Willing Johann',
         "ime POPRAVEK Willing Johann -> Müllner Johann (h22 = p36-r6/r7/r9 'Müllner "
         "Johann' precedens ×3; ink 'Milling Johann.')"),
        ('1 / 66', 'Krischan Georg.[?]', '1 / 66', 'Weinhandl Georg',
         "ime POPRAVEK Weinhandl Georg -> Krischan Georg.[?] (h66 = p36-r4/r5 forma ×2; "
         "glyf = Krischan-forma)"),
        ('1 / 65', 'Ring Dorothea.[?]', '1 / 65', 'Wernig Dorothea',
         "ime POPRAVEK Wernig Dorothea -> Ring Dorothea.[?] (h65 — NOVA Ring hiša; w1 glyf "
         "= Ring forma; w2 'Dorothea[?]' po črnilu+v57)"),
        ('1 / 65', 'Ring Martho.[?]', '1 / 65', 'Wernig Michael',
         "ime POPRAVEK Wernig Michael -> Ring Martho.[?] (h65; gz x24: w2 'Martha/Martho.' "
         "= p36-r3 'Ring Martho.[?]' forma; v57 w2 fabriirana; rot-anm. 'Joh. Wernig[?] am "
         "7. Jänner 1840' ostaja)"),
        ('1 / 64', 'Veritschan Mathl.[?]', '1/64', 'Weichselbaum Nißl',
         "ime POPRAVEK Weichselbaum Nißl -> Veritschan Mathl.[?] (h64; PUA h.64 "
         "'Veritscher' presek; v57 fabriirana)"),
        ('1 / 65', 'Ring Jakob.[?]', '1/65', 'Wernig Joseph',
         "ime POPRAVEK Wernig Joseph -> Ring Jakob.[?] (h65; w2 'Jakob.[?]/Joseph[?]' "
         "dvom — a-glyf naklonjeno Jakob; ink vrstica sede visoko (dy -14); v57 w1 "
         "fabriirana)"),
    ],
}

PAGES[41] = {
    'note': ('p41 = nova sekcija (druga roka): Krischan h62/h63/h66, Tillach h61, Baron '
             'h0/h100, Gemeinde h0, Pöching h50/51, Ulrich h51/68/32, Veritschan h64 ×2, '
             'Ring Martho h65; 3 haus POPRAVEK ("1 / 6"->0, "1 / 64"->68, "1 / 52"->32); '
             'rdeči anm. "widrig... zu G: 1850" + "übernommen zu E: 1850"'),
    'rows': [
        ('1/62', 'Krischan Michl.[?]', '1/62', 'Witschak Michl.',
         "ime POPRAVEK Witschak Michl. -> Krischan Michl.[?] (h62 par z r2; glyf = "
         "Krischan-forma (p36/p40 h66 kaliber); PUA h.62 'Brinczhan' orient.)"),
        ('1 / 63', 'Krischan Georg.[?]', '1 / 63', 'Witschak Georg.',
         "ime POPRAVEK Witschak Georg. -> Krischan Georg.[?] (h63 par z r3/r19)"),
        ('1/62', 'Krischan Michl.[?]', '1/62', 'Witschak Michl.',
         "ime POPRAVEK Witschak Michl. -> Krischan Michl.[?] (h62 par z r0)"),
        ('1/63', 'Krischan Georg.[?]', '1/63', 'Witschak Georg.',
         "ime POPRAVEK Witschak Georg. -> Krischan Georg.[?] (h63 par z r1)"),
        ('1/61', 'Tillach Michl.[?]', '1/61', 'Pritschak Andr.',
         "ime POPRAVEK Pritschak Andr. -> Tillach Michl.[?] (h61 ×2 z r18; PUA h.61 "
         "'Tillak Nikla' presek; del-2b p36-r8 'Tillach Peter.[?]' forma; rdeča anm. "
         "'widrig...' prek vrste; w2 'Michl.[?]' dvom)"),
        ('0', 'Baron Gustitsch.[?]', '0', 'Baron Gustedt',
         "ime POPRAVEK Baron Gustedt -> Baron Gustitsch.[?] (gz x30: 'Gustitsch' jasno; "
         "haus 0 jasno; h0 = ne-hišni vpis)"),
        ('1 / 100', 'Baronial Zallant.[?]', '1 / 100', 'Baron v. Zallant',
         "ime POPRAVEK Baron v. Zallant -> Baronial Zallant.[?] (gz x24 dy10: 'Baronial' "
         "jasno — ne-osebni Baronial-zapis; rdeča anm. 'übernommen zu E: 1850' prek haus "
         "celice — haus '100' ni preverljiv pod rdečim, ohranjeno)"),
        ('0', 'Gemeinde', '1 / 6', 'Gyomandl',
         "haus POPRAVEK '1 / 6'->0 (gz x24 dy10: compact-oval 0 = r5 'Baron' 0-forma; "
         "diagonalni tik = ditto-znak) + ime POPRAVEK Gyomandl -> Gemeinde (gz jasno "
         "'Gemeinde' — občina, ne oseba; h0 skladno z r5)"),
        ('1 / 50', 'Pöching. Mathel.[?]', '1 / 50', 'Pechly Mathes.',
         "ime POPRAVEK Pechly Mathes. -> Pöching. Mathel.[?] (h50; glyf = Pöching forma)"),
        ('1 / 51', 'Ulrich Peter.[?]', '1 / 51', 'Weiss Peter',
         "ime POPRAVEK Weiss Peter -> Ulrich Peter.[?] (h51; PUA h.51 'Urich Pattle' + "
         "p43 h51 Ulrich presek; w2 'Peter.' jasno)"),
        ('1 / 61', 'Krischan Georg.[?]', '1 / 61', 'Witschak Georg.',
         "ime POPRAVEK Witschak Georg. -> Krischan Georg.[?] (h66 precedens p36/p40; glyf "
         "= Krischan-forma)"),
        ('1 / 67', 'Pöching. Gorgy.[?]', '1 / 67', 'Pechly Georg.',
         "ime POPRAVEK Pechly Georg. -> Pöching. Gorgy.[?] (h67; w1 'Pöching' ch jasno — "
         "cf. p36/p38 'Puchey' varianta istega h67, page-level forma)"),
        ('1 / 64', 'Veritschan Mathl.[?]', '1 / 64', 'Von Witschak Andr.',
         "ime POPRAVEK Von Witschak Andr. -> Veritschan Mathl.[?] (h64 par z r17; PUA h.64 "
         "'Veritscher'; cf. p40-r19 ista forma)"),
        ('1 / 60', 'Schellko Joseph.', '1 / 60', 'Schellko Jozeph.',
         "ime POPRAVEK Schellko Jozeph. -> Schellko Joseph. (w2 'Joseph' po črnilu, v57 "
         "'Jozeph' = različica; PUA h.60 'Schelko Georg' orient.)"),
        ('1 / 68', 'Ulrich Michl.', '1 / 64', 'Weiss Michl.',
         "haus POPRAVEK '1 / 64'->68 (gz x26: 8-glyf z dvojno zanko jasna — NI 4-glyfa; "
         "h68 = PUA 'Urich Mattle' + p43-r8 'Ulrich Michl' precedens) + ime POPRAVEK "
         "Weiss Michl. -> Ulrich Michl. (h68 precedens)"),
        ('1 / 32', 'Ulrich Georg.[?]', '1 / 52', 'Witschak Georg.',
         "haus POPRAVEK '1 / 52'->32 (gz x30 dy10: 3-glyf brez zastavice jasna — NI "
         "5-glyfe (cf. r8 '50', r9 '51' z zastavico); dvom: p43-r11 h52 'Ulrich Georg' "
         "precedens — alternativo beležimo v verdictu, črnilo = nosilec) + ime POPRAVEK "
         "Witschak Georg. -> Ulrich Georg.[?]"),
        ('1 / 65', 'Ring Martho.[?]', '1 / 65', 'Fleing Mano.',
         "ime POPRAVEK Fleing Mano. -> Ring Martho.[?] (h65 = p36-r3/p40-r18 forma ×2; "
         "glyf = Ring forma + 'Martho.'; v57 obe besedi fabriirani)"),
        ('1 / 64', 'Veritschan Mathl.[?]', '1 / 64', 'Von Witschak Andr.',
         "ime POPRAVEK Von Witschak Andr. -> Veritschan Mathl.[?] (h64 par z r12)"),
        ('1 / 61', 'Tillach Michl.[?]', '1 / 61', 'Pritschak Andr.',
         "ime POPRAVEK Pritschak Andr. -> Tillach Michl.[?] (h61 par z r4)"),
        ('1 / 63', 'Krischan Georg.[?]', '1 / 63', 'Witschak Georg.',
         "ime POPRAVEK Witschak Georg. -> Krischan Georg.[?] (h63 par z r1/r3)"),
    ],
}

PAGES[42] = {
    'note': ('p42 = nadaljevanje p41 sekcije (vrstice sedejo VISOKO, dy -8): Krischan h62 ×4 '
             '/ h66 ×2 / h63, Veritschan h64 ×3, Tillach h61 ×3, Pöching h11, Ring Martho '
             'h65 (NOVO — v57 "Fleissig Marianne" fabriirana + haus 62 napaka), Luppraz h54, '
             'Schimetz h59?/h18 ×3, Baron h-, Khall h15/h17; 2 haus POPRAVEK (62->65, '
             '"1 / 59"->49); vrstice rdeče prečrtane (revizija) na r6-r12'),
    'rows': [
        ('1/62', 'Krischan Michl.[?]', '1/62', 'Christan Stößl',
         "ime POPRAVEK Christan Stößl -> Krischan Michl.[?] (h62; glyf = Krischan-forma; "
         "v57 'Stößl' fabriirana)"),
        ('1/66', 'Krischan Georg.[?]', '1/66', 'Christan Georg',
         "ime POPRAVEK Christan Georg -> Krischan Georg.[?] (h66 precedens; v57 'Christan' "
         "= skoraj-glyf, normalizirano na del-2b 'Krischan' formo)"),
        ('1/64', 'Veritschan Mathl.[?]', '1/64', 'Veit Blaschke seni[?]',
         "ime POPRAVEK Veit Blaschke seni[?] -> Veritschan Mathl.[?] (h64 par z r4/r9; "
         "PUA h.64 'Veritscher'; v57 'Veit Blaschke' fabriirana)"),
        ('1/66', 'Krischan Georg.[?]', '1/66', 'Christan Georg',
         "ime POPRAVEK Christan Georg -> Krischan Georg.[?] (h66 par z r1)"),
        ('1/64', 'Veritschan Mathl.[?]', '1/64', 'Veit Blaschke senior',
         "ime POPRAVEK Veit Blaschke senior -> Veritschan Mathl.[?] (h64 par z r2)"),
        ('1 / 11', 'Pöching. Georgy.[?]', '1/11', 'Radling Georg',
         "ime POPRAVEK Radling Georg -> Pöching. Georgy.[?] (h11; gz x26: w1 'Pöching' "
         "jasno — v57 'Radling' fabriirana; vrstica rdeče prečrtana + 'aufgepfählt bezügt "
         "1819 [rot]')"),
        ('1/61', 'Tillach Michl.[?]', '1/61', 'Stößl Christl',
         "ime POPRAVEK Stößl Christl -> Tillach Michl.[?] (h61 = p41-r4 forma; vrstica "
         "rdeče prečrtana + 'Stelle [rot]')"),
        ('1/62', 'Krischan Georg.[?]', '1/62', 'Christan Georg',
         "ime POPRAVEK Christan Georg -> Krischan Georg.[?] (h62; vrstica rdeče "
         "prečrtana)"),
        ('1/62', 'Krischan Michl.[?]', '1/62', 'Christan Christl',
         "ime POPRAVEK Christan Christl -> Krischan Michl.[?] (gz x24 dy-8: w2 "
         "'Miche/Michl.' jasno; vrstica rdeče prečrtana)"),
        ('1/64', 'Veritschan Mathl.[?]', '1/64', 'Veit Blaschke seni[?]',
         "ime POPRAVEK Veit Blaschke seni[?] -> Veritschan Mathl.[?] (h64 trio; gz-r08 "
         "dy6 potrjuje 'Veritschan Mathe' v r8/r9 coni; vrstica rdeče prečrtana)"),
        ('1/65', 'Ring Martho.[?]', '1/62', 'Fleissig Marianne',
         "haus POPRAVEK 62->65 (gz x24 dy-8: '65'' jasno) + ime POPRAVEK Fleissig "
         "Marianne -> Ring Martho.[?] (4. instanca h65 Ring Martho: p36-r3, p40-r18, "
         "p41-r16; glyf = Ring forma + 'Martha/Martho.'; v57 'Fleissig Marianne' "
         "fabriirana — take vrstice ni v črnilu)"),
        ('1/62', 'Krischan Maria.[?]', '1/62', 'Hirschman Maria',
         "ime POPRAVEK Hirschman Maria -> Krischan Maria.[?] (h62; gz x24 dy-8: w2 "
         "'Maria[?]' — PUA h.62 'Brinczhan Witwe' orient.; vrstica rdeče prečrtana)"),
        ('1/61', 'Tillach Maria.[?]', '1/61', 'Stößl Maria',
         "ime POPRAVEK Stößl Maria -> Tillach Maria.[?] (h61; vrstica rdeče prečrtana + "
         "'Stelle [rot]')"),
        ('1 / 54', 'Luppraz Maria.[?]', '1/54', 'Lupzina Maria',
         "ime POPRAVEK Lupzina Maria -> Luppraz Maria.[?] (h54; w1 'Luppraz[?]' — pp "
         "jasno; w2 brez ascenderjev -> 'Maria[?]' (cf. r8 'Miche' z ascenderji); v57 "
         "'Lupzina' fabriirana)"),
        ('1/49', 'Schimetz Michael.', '1/59', 'Schimek Michael',
         "haus POPRAVEK '1 / 59'->49 (gz x24 dy-8: 4-glyf jasna — NI 5-zastavice (cf. r13 "
         "'54'); h49 = p42-r14/r43-r3 'Schimetz Michael' presek!) + ime POPRAVEK Schimek "
         "Michael -> Schimetz Michael. (tz jasno; 'aufgepfählt bezügt 1820 [rot]')"),
        ('1 / 18', 'Schimetz Peter.[?]', '1/18', 'Schumig Johann',
         "ime POPRAVEK Schumig Johann -> Schimetz Peter.[?] (h18 par z r16; gz x24 dy-8: "
         "w2 'Peter.' jasno — v57 w2 'Johann' fabriirana; vrstica rdeče prečrtana + "
         "'Stelle [rot]')"),
        ('1 / 18', 'Schimetz Peter.[?]', '1/18', 'Schumig Peter',
         "ime POPRAVEK Schumig Peter -> Schimetz Peter.[?] (h18 par z r15)"),
        ('', 'Baron Gustitsch.[?]', '', 'Baron Gustedter',
         "ime POPRAVEK Baron Gustedter -> Baron Gustitsch.[?] (haus prazen v obojem = "
         "soglasje; Wohnort 'Graz[?]'; glyf = p41-r5 'Baron Gustitsch' forma)"),
        ('1/61', 'Tillach Michl.[?]', '1/61', 'Stößl Christl',
         "ime POPRAVEK Stößl Christl -> Tillach Michl.[?] (h61 par z r6)"),
        ('1 / 15', 'Khall Marie.[?]', '1/15', 'Chorll Maria',
         "ime POPRAVEK Chorll Maria -> Khall Marie.[?] (gz x30 dy-8: w1 'Khall[?]' — "
         "K/X-cap dvom; w2 'Marie[?]'; v57 'Chorll' fabriirana)"),
        ('1 / 17', 'Khall Johanne.[?]', '1/17', 'Khaull Joanne',
         "ime POPRAVEK Khaull Joanne -> Khall Johanne.[?] (gz x30 dy-8: w2 'Johanne.' "
         "jasno (J-swash); w1 'Khall[?]')"),
    ],
}

PAGES[43] = {
    'note': ('p43 = zaključek imenskega passa p38–p43 (vrstice sedejo NIZKO, dy +14): '
             'Schimetz h16/55/56/49/65 ×5, Ulrich h51/81/51/52/81 + Parbna[?] w2 ×4, '
             'Pöching h50, Strohschneid h14, Tillach h61 ×2, Krischan h62/h63, Schaffschick '
             'h13/h8 ×3; 3 haus POPRAVEK (149->49 Blatt-artefakt, 69->62, 62->63); '
             'medstranski presek h49 Schimetz Michael ×3 (p42-r14 + p43-r3)'),
    'rows': [
        ('16', 'Schimetz Michel.[?]', '16', 'Schönnig Michael',
         "ime POPRAVEK Schönnig Michael -> Schimetz Michel.[?] (glyf = p42 'Schimetz' "
         "forma; v57 'Schönnig' fabriirana — Noben 'Schönnig' ni v črnilu)"),
        ('55', 'Schimetz Leon.[?]', '55', 'Schönnig Leon',
         "ime POPRAVEK Schönnig Leon -> Schimetz Leon.[?] (w2 'Leon.' jasno)"),
        ('56', 'Schimetz Peter.[?]', '56', 'Schönnig Peter',
         "ime POPRAVEK Schönnig Peter -> Schimetz Peter.[?] (w2 'Peter.' jasno)"),
        ('49', 'Schimetz Michael.', '149', 'Schönnig Michael',
         "haus POPRAVEK 149->49 (tall: '1|49' = Blatt '1' + haus '49' — v57 je zlil Blatt+"
         "haus; h49 = p42-r14 'Schimetz Michael' + r16-r1 'Thomas Hampel'-convergence) + "
         "ime POPRAVEK Schönnig Michael -> Schimetz Michael. (medstranski presek h49 "
         "Schimetz Michael ×3)"),
        ('51', 'Ulrich Parbna.[?]', '51', 'Ulrich Jakob',
         "ime POPRAVEK Ulrich Jakob -> Ulrich Parbna.[?] (w1 'Ulrich' soglasen; w2 "
         "'Parbna[?]/Parna[?]' — gz x30: P-glyf z descenderjem (NI J-glyf 'Jakob'); "
         "'Barbara[?]' alternativa (B/P dvom); v57 w2 fabriirana)"),
        ('50', 'Pöching. Mathel.[?]', '50', 'Pauling Wenzel',
         "ime POPRAVEK Pauling Wenzel -> Pöching. Mathel.[?] (h50 = p41-r8 forma ×2; glyf "
         "= Pöching forma; v57 'Pauling Wenzel' fabriirana)"),
        ('65', 'Schimetz Leon.[?]', '65', 'Schönnig Leon',
         "ime POPRAVEK Schönnig Leon -> Schimetz Leon.[?] (h65; par z r1)"),
        ('14', 'M. Paul. Strohschneid', '14', 'M. Paul. Strohschneid',
         "soglasje (v57 blizu črnilu; ink '~M. Paul Strohschmid[?]' — w2 končnica "
         "schneid/schmid dvom ostaja; nič ne spreminjamo)"),
        ('68', 'Ulrich Michl', '68', 'Ulrich Michl',
         "soglasje (h68 = PUA 'Urich Mattle' + p41-r14 'Ulrich Michl.' precedens; v57 "
         "soglasna)"),
        ('81', 'Ulrich Parbna.[?]', '81', 'Ulrich Jakob',
         "ime POPRAVEK Ulrich Jakob -> Ulrich Parbna.[?] (gz x30: w2 'Parna/Parbna[?]' — "
         "isti glyf kot r4; v57 w2 fabriirana)"),
        ('51', 'Ulrich Parbna.[?]', '51', 'Ulrich Jakob',
         "ime POPRAVEK Ulrich Jakob -> Ulrich Parbna.[?] (par z r4 h51)"),
        ('52', 'Ulrich Georg', '52', 'Ulrich Georg',
         "soglasje (h52 precedens; v57 soglasna)"),
        ('81', 'Ulrich Parbna.[?]', '81', 'Ulrich Jakob',
         "ime POPRAVEK Ulrich Jakob -> Ulrich Parbna.[?] (h81 par z r9)"),
        ('61', 'Tillach Michl.[?]', '61', 'Wittlich Martin',
         "ime POPRAVEK Wittlich Martin -> Tillach Michl.[?] (h61 = p41/p42 forma ×5; gz "
         "x24 dy14; v57 'Wittlich' fabriirana)"),
        ('61', 'Tillach Michl.[?]', '61', 'Fittkau Martin',
         "ime POPRAVEK Fittkau Martin -> Tillach Michl.[?] (h61 par z r13; v57 'Fittkau' "
         "fabriirana)"),
        ('62', 'Krischan Michl.[?]', '69', 'Horechan Michl',
         "haus POPRAVEK 69->62 (gz x24 dy14: '62' jasno; v57 6↔9?) + ime POPRAVEK "
         "Horechan Michl -> Krischan Michl.[?] (glyf = Krischan-forma; PUA h.69 'Christian "
         "Brandl' orient. — del-2a odprto vprašanje p47 ostaja)"),
        ('63', 'Krischan Georg.[?]', '62', 'Witschak Georg',
         "haus POPRAVEK 62->63 (gz x24 dy14: 3-glyf brez zastavice jasna) + ime POPRAVEK "
         "Witschak Georg -> Krischan Georg.[?] (h63 par z r15-grozdo 62/63 kot p41-r0/r1)"),
        ('13', 'Schaffschick Mathä.[?]', '13', 'Vohfseheidler Mathäus',
         "ime POPRAVEK Vohfseheidler Mathäus -> Schaffschick Mathä.[?] (h13; w1 = p40-r4 "
         "'Schaffschick' forma; w2 'Mathä.[?]' po črnilu+v57; v57 w1 fabriirana)"),
        ('8', 'Schaffschick Mathä.[?]', '8', 'Stahlfeldt Mathäus',
         "ime POPRAVEK Stahlfeldt Mathäus -> Schaffschick Mathä.[?] (h8 par z r19; v57 "
         "'Stahlfeldt' fabriirana; vrstica rdeče prečrtana)"),
        ('8', 'Schaffschick Mathä.[?]', '8', 'Stahlfeldt Mathäus',
         "ime POPRAVEK Stahlfeldt Mathäus -> Schaffschick Mathä.[?] (h8 par z r18)"),
    ],
}


def main():
    os.makedirs(OUT, exist_ok=True)
    for pg, data in PAGES.items():
        doc = {
            'meta': {
                'val': 119,
                'del': '2c',
                'page': pg,
                'scope': 'imenski pass (owner_original + haus_no) — agentov vid, 0 VLM klicev',
                'method': METHOD,
                'register_rows': len(data['rows']),
                'vlm_calls': 0,
                'diag_generated': [
                    f'tall-p{pg}-names (x3, r-markerji)',
                    f'zz-p{pg}-r00..r{len(data["rows"])-1:02d} (x22, dy po strani)',
                    'gz x24-x30 izbrani (dvomljive vrstice)',
                ],
                'note': data['note'],
            },
            'names_audit': {
                f'r{i}': {
                    'seen_haus': seen_h, 'seen_name': seen_n,
                    'old_haus': old_h, 'old_name': old_n, 'verdict': verdict,
                }
                for i, (seen_h, seen_n, old_h, old_n, verdict) in enumerate(data['rows'])
            },
        }
        path = f'{OUT}/p{pg}.json'
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(doc, f, ensure_ascii=False, indent=1)
        n_ime = sum(1 for (_, _, _, _, v) in data['rows'] if 'ime POPRAVEK' in v)
        n_haus = sum(1 for (_, _, _, _, v) in data['rows'] if 'haus POPRAVEK' in v)
        n_raz = sum(1 for (_, _, _, _, v) in data['rows'] if 'razhajanje odprto' in v)
        n_sog = sum(1 for (_, _, _, _, v) in data['rows'] if v.startswith('soglasje'))
        print(f'p{pg}: {len(data["rows"])} vrstic | ime {n_ime} | haus {n_haus} | '
              f'razhajanja {n_raz} | soglasja {n_sog}')


if __name__ == '__main__':
    main()
