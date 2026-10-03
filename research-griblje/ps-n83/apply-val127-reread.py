#!/usr/bin/env python3
"""Val 127 — p56–61 osebni re-read: popravek register.json (NR-14 okvir).

Metoda (protokol 149 §7.1): trak/celica rez (24 bandov) + kolonski sidri
(nsheet ×5 imena, kstack ×5 kl stolpec z rdečimi vrstičnimi črtami) +
dvojni sidro (kl vrednosti + jaethe/verige h-prek page mej).

Ključna odkritja (glej 150-val127-p56-61-osebni-reread.md):
  * p59: register ima 21 vrstic, fizično 20 (P1121–P1140) + Stiftung vrstica;
    stari reg r20/r21 ('Hudales Matija' 56, 'Pavlič Miha' 1128) = fragmenta
    Stiftung vrstice; vrstica 'Stabler Marlfa' (P1139) je v starem reg manjkala.
  * p61: stari reg r0 ('6/8') + r1 (126) = razdeljena fizična r0 (648 prečrtano
    → zamenjava); fizična r19 (Feßdig Marlfa?, 1354?) manjkala.
  * p58: kl artefakti '−944'/'+56' (in isti razred '−174'/'−1075') = Joche
    stolpec '1' prebran kot znak; vrednosti z Joche 1 v j|k formatu val 88
    ('1|944' = 1 J + 944 K — presledkovna forma bi graditelje c4/f11 razbila).
  * Imenske družine: Feßdig/Fodag, Mainig?, Jattla (h18 veriga p56–58),
    Malfa/Marlfa, Mainfal (≈Mihal hipoteza), Miko? (variante Miido/Miibo),
    Strauß Grogy (≡Georg), Wobathan? Mauds? (h47 veriga p57–58), Stabler
    Marlfa? (h30/p59), Lappany Miko? (h64 veriga p56–57), Unlich, Beiflich?,
    Christian Grogy/Jattla, Brustal? Minalo?, Haustück? Minalo?/Hauptstück?
    Mihal, Gwindler stand (namesto 'Gewürze'/'Gärtler').
"""
import copy
import json

REG = '/home/z/griblje-museum/research-griblje/ps-n83/register.json'
PRE = 'pre_v127'

# ---------------------------------------------------------------------------
# Nove vrstice po straneh. Polja: (idx_stare, haus_no, owner, stand, wohnort,
# kl, anmerkung_dodatek). idx_stare=-1 pomeni: nova vrstica (vstavi).
# ---------------------------------------------------------------------------
G = 'Gruble [?]'  # wohnort normalizacija (cf. p62 potrjeno 'Gruble')


def A(*parts):
    return ' | '.join(p for p in parts if p)


pages = {}

# --- p56 (P1061–P1080, 20 vrstic, h-stolpec = prave hišne številke) --------
pages[56] = [
    (0, '56', 'Mainig? Jattln? [?]', '', '', '944', 'staro \'Schimey Johann\''),
    (1, '14', 'Feßdig Malfa [?]', '', '', '1|1348', 'staro \'Fidrič Wolf\''),
    (2, '14', 'Feßdig Malfa [?]', '', '', '73', 'staro \'Fidrič Wolf\''),
    (3, '14', 'Feßdig Marlfa? [?]', '', '', '155', 'staro \'Fidrič Wolf\''),
    (4, '18', 'Mainig Jattla [?]', '', '', '394', 'staro \'Schimey Peterl\''),
    (5, '18', 'Mainig Jattla [?]', '', '', '1444', 'staro \'Schimey Peterl\''),
    (6, '53', 'Feßdig Jhua(n) [?]', '', '', '818', 'staro \'Fidrič Jura\''),
    (7, '64', 'Lappany Miko? [?]', '', '', '831', 'staro \'Pappaport Mito\''),
    (8, '49', 'Mainig? Mihal? [?]', '', '', '184', 'staro \'Schimey Michael\''),
    (9, '13', 'Mainig Jattla [?]', '', '', '249', 'staro \'Schimey Peterl\''),
    (10, '68', 'Unlich Miko? [?]', '', '', '174', 'staro \'Hunolt Mito\' (h62?)'),
    (11, '63', 'Beiflich? Marlfa? [?]', '', '', '558', 'staro \'Scheffstech Wolf\' (h68?)'),
    (12, '68', 'Unlich Miko? [?]', '', '', '459', 'staro \'Unlich Mito\''),
    (13, '9', 'Scheffstech? Jua(n)? [?]', '', '', '702', 'staro \'Scheffstech Juran\'; ime prečrtano v originalu'),
    (14, '81', 'Unlich Jattla? [?]', '', '', '1491', 'staro \'Unlich Gabriel\''),
    (15, '45', 'Strauß Grogy [?]', '', '', '568', 'staro \'Hunolt Georg\' (h66?)'),
    (16, '63', 'Gemeind', '', '', '94', ''),
    (17, '45', 'Strauß Grogy [?]', '', '', '154', 'staro \'Hunolt Georg\''),
    (18, '45', 'Strauß Grogy [?]', '', '', '842', 'staro \'Hunolt Georg\''),
    (19, '56', 'Mainig? Jattla? [?]', '', '', '554', 'staro \'Schimey Gabriel\''),
]

# --- p57 (P1081–P1100, 20 vrstic, h = '1 / N') ------------------------------
pages[57] = [
    (0, '1 / 65', 'Mainig? Jhua(n)? [?]', 'Bauern Gwindler [?]', '', '636',
     'staro \'Schinig Johann Lorenz Brüder\' (Lastname = stand celici)'),
    (1, '1 / 49', 'Mainig? Mainfal? [?]', '', '', '1455', 'staro \'Schinig Wolfpaul\''),
    (2, '1 / 18', 'Mainig Jattla [?]', '', '', '394', 'staro \'Schinig Veitl\''),
    (3, '1 / 18', 'Mainig Jattla [?]', '', '', '360', 'staro \'Schinig Veitlen\''),
    (4, '1 / 18', 'Mainig Jattla [?]', '', '', '1048', 'staro \'Schinig Veitla\''),
    (5, '1 / 18', 'Mainig Jattla [?]', '', '', '128', 'staro \'Schinig Veitlin\''),
    (6, '1 / 59', 'Feßdig Jhua(n) [?]', '', '', '225', 'staro \'Pudwig Johann\''),
    (7, '1 / 8', 'Gemeind', '', '', '56', 'staro \'Gemünde\''),
    (8, '1 / 49', 'Mainig? Mainfal? [?]', '', '', '611', 'staro \'Schinig Wolfpaul\''),
    (9, '1 / 64', 'Lappany Miko? [?]', '', '', '220', 'staro \'Pöppang Michl\''),
    (10, '1 / 30', 'Stabler Marlfa? [?]', '', '', '287', 'staro \'Haberl Wolfp.\''),
    (11, '1 / 30', 'Stabler Marlfa? [?]', '', '', '92', 'staro \'Rabius Wolfj.\' — isti lastnik kot r10'),
    (12, '1 / 22', 'Milleo? Johann? [?]', '', '', '90', 'staro \'Wittig Johann\''),
    (13, '1 / 22', 'Milleo? Johann? [?]', '', '', '469', 'staro \'Wittig Johann\''),
    (14, '1 / 18', 'Mainig Jattla [?]', '', '', '1244', 'staro \'Schinig Veitlin\''),
    (15, '1 / 61', 'Feßdig? Mauds? [?]', '', '', '398', 'staro \'Fritsch Michl\''),
    (16, '1 / 61', 'Feßdig? Mauds? [?]', '', '', '28', 'staro \'Fritsch Michl\''),
    (17, '1 / 42', 'Feßdig Marlfa? [?]', '', '', '80', 'staro \'Pudzig Wolfj.\''),
    (18, '1 / 42', 'Feßdig Marlfa? [?]', '', '', '232', 'staro \'Pöppang Wolfje\''),
    (19, '1 / 47', 'Wobathan? Mauds? [?]', '', '', '320', 'staro \'Wolfsgruber Michl\''),
]

# --- p58 (P1102–P1120, 19 vrstic — znana anomalija) --------------------------
pages[58] = [
    (0, '1/52', 'Feßdig Jattla [?]', 'Bauern Gwindler [?]', '', '338',
     "staro stand 'Gewürze' = Gwindler"),
    (1, '1/16', 'Strauß Grogy [?]', '', '', '384', "staro 'Hannß Gregor'"),
    (2, '1/45', 'Strauß Grogy [?]', '', '', '26', "staro 'Hannß Gregor'"),
    (3, '1/46', 'Wobathan? Jattla? [?]', '', '', '649', "staro 'Wolbathar Pöllan'"),
    (4, '1/53', 'Feßdig Jhua(n)? [?]', '', '', '740', "staro 'Ludwig Jandl'"),
    (5, '1/51', 'Ulrich Jattla? [?]', '', '', '162', "staro 'Ulrich Pöllan'"),
    (6, '1/46', 'Wobathan? Grogy? [?]', '', '', '674', "staro 'Wolbathar Gregor'"),
    (7, '1/51', 'Ulrich Jattla? [?]', '', '', '577', "staro 'Ulrich Pöllan'"),
    (8, '1/55', 'Mainig? Jhua(n)? [?]', '', '', '113', "staro 'Schinig Jandl'"),
    (9, '1/46', 'Wobathan? Grogy? [?]', '', '', '1|56', "kl artefakt '+56' = Joche 1; staro 'Wolbathar Gregor'"),
    (10, '1/56', 'Mainig? Jattla? [?]', '', '', '1038', "staro 'Hannß Pöllan'"),
    (11, '1/18', 'Mainig Jattla [?]', '', '', '1|944', "kl artefakt '-944' = Joche 1; staro 'Schinig Pöllan'"),
    (12, '1/47', 'Wobathan? Mauds? [?]', '', '', '118', "staro 'Wolbathar Mache'"),
    (13, '1/47', 'Wobathan? Mauds? [?]', '', '', '988', "staro 'Pachog Wipfler' — h47 ×2"),
    (14, '20', 'Fodag Mainfal [?]', '', '', '179', "staro 'Schinig Pöllan' (h36?)"),
    (15, '56', 'Mainig? Jattla? [?]', '', '', '1|174', "kl artefakt '-174' = Joche 1 (sklep po isti klasi); staro 'Pachog Wipfler' (h20?)"),
    (16, '20', 'Fodag Mainfal [?]', '', '', '134', "staro 'Pachog Mühlo'"),
    (17, '20', 'Fodag Mainfal [?]', '', '', '1|1075', "kl artefakt '-1075' = Joche 1 (sklep po isti klasi); staro 'Pachog Mühlo'"),
    (18, '21', 'Fodag Miko? [?]', '', '', '549', "staro 'Pachog Mühlo'"),
]

# --- p59 (P1121–P1140, 20 vrstic; stara 21. = fantom + Stiftung fragmenta) ---
_M = 'Fodag Mainfal [?]'
_K = 'Fodag Miko? [?]'
pages[59] = [
    (0, '20', _M, '', G, '469', "prečrtano rdeče; staro drugi lastnik 'Lovro Gajšek' = sosednji celici (wohnort/kultur)"),
    (1, '21', _K, '', G, '982', 'prečrtano rdeče'),
    (2, '20', _M, '', G, '1|1246', 'prečrtano rdeče (Joche 1)'),
    (3, '21', _K, '', G, '1258[?]', 'prečrtano rdeče; staro reg 1007'),
    (4, '21', _K, '', G, '997', 'prečrtano rdeče; staro reg j997/kl71'),
    (5, '20', _M, '', G, '121[?]', 'prečrtano rdeče; staro reg 234'),
    (6, '21', _K, '', G, '627[?]', 'prečrtano rdeče; staro reg 644'),
    (7, '20', _M, '', G, '1085', 'zamenjava: staro 1042 prečrtano rdeče; staro reg 7045 = dvomljiva združitev'),
    (8, '21', _K, '', G, '989', ''),
    (9, '21', _K, '', G, '50', ''),
    (10, '20', _M, '', G, '671', 'staro reg 674'),
    (11, '45', 'Strauß Grogy [?]', '', G, '1108[?]', "črta čez Joche/Klafter; prečrtano rdeče; staro 'Hanzel Gregor'"),
    (12, '41', 'Fodag Grogy? [?]', '', G, '786', "prečrtano rdeče; staro 'Podobnik Gregor'"),
    (13, '21', _K, '', G, '877', 'staro reg 870'),
    (14, '21', _K, '', G, '246', ''),
    (15, '20', _M, '', G, '1|690', 'prečrtano rdeče (Joche 1); staro reg 1 694'),
    (16, '21', _K, '', G, '361', 'rdeča kljukca ob vrstici'),
    (17, '21', _K, '', G, '628[?]', ''),
    (-1, '30', 'Stabler Marlfa? [?]', '', G, '', 'kl prazna; rdeča opomba \'beyfügnung ... d. 1. Mai?\'; v starem reg vrstica manjkala (VSTAVLJENA — čist scaffolding brez pre polj, precedens v115 inserts)'),
    (18, '21', _K, '', G, '260', 'staro reg 261 (fizična P1140 = stari r18)'),
]

# --- p60 (P1141–P1160, 20 vrstic) --------------------------------------------
pages[60] = [
    (0, '20', _M, '', G, '208[?]', 'druga številka 798? nejasna; staro reg 207'),
    (1, '20', _M, '', G, '249[?]', "staro 'Pachluy Mitterl'"),
    (2, '41', 'Feßdig Grogy [?]', '', G, '389', "prečrtano rdeče; staro 'Pachluy Gröz' (239)"),
    (3, '46', 'Feßdig Jattla [?]', '', G, '116', "prečrtano rdeče; staro 'Leinig Pötlar' (144)"),
    (4, '45', 'Strauß Grogy [?]', '', G, '97', "prečrtano rdeče; staro 'Hemey Gröz' (37)"),
    (5, '46', 'Strauß Grogy [?]', '', G, '42', "prečrtano rdeče; staro 'Krenigl Gröz'"),
    (6, '40', 'Feßdig Jattla [?]', '', G, '60[?]', "prečrtano rdeče; staro 'Pötlar Pötlar' (46)"),
    (7, '41', 'Feßdig Grogy [?]', '', G, '1|44', 'prečrtano rdeče (Joche 1)'),
    (8, '41', 'Feßdig Grogy [?]', '', G, '877[?]', "prečrtano rdeče; staro 'Pechluy Gröz' (273)"),
    (9, '44', 'Haustück? Minalo? [?]', '', G, '1|160', "Joche 1 + 160; staro 'Stettner Mändle' (160)"),
    (10, '44', 'Haustück? Minalo? [?]', '', G, '254[?]', "staro 'Mündertal Mändle' (284)"),
    (11, '46', 'Christian Marlly? [?]', '', G, '161[?]', "staro 'Lindacher Wengi' (181)"),
    (12, '27', 'Christian Jattla [?]', '', G, '338[?]', "staro 'Scheichan Löttre' (128)"),
    (13, '1/13', 'Hauptstück? Mihal [?]', '', G, '444', "staro h '113' = 1/13; staro lastnik \"Zu M'Fleisch zu Riedl\" = sosednje celice"),
    (14, '21', _K, '', G, '262[?]', "staro 'Pachluy Mändle' (282)"),
    (15, '21', _K, '', G, '150[?]', "staro 'Pachluy Mändle' (120)"),
    (16, '20', _M, '', G, '130', "staro 'Pachluy Mitterl'"),
    (17, '38', 'Strauß Grogy [?]', '', G, '61', "staro 'Hemey Gröz'"),
    (18, '38', 'Strauß Grogy? [?]', '', G, '199[?]', "staro 'Chlinig Pötg' (132)"),
    (19, '29', 'Strauß Maude? [?]', '', G, '114[?]', "staro 'Hemey Mändle' (174)"),
]

# --- p61 (P1161–P1180, 20 vrstic; stari r0/r1 = razdeljena fizična r0) -------
pages[61] = [
    (0, '1 / 40', 'Feßdig Jattla [?]', 'Bauern Gwindler [?]', G, '156[?]',
     "prečrtano 648, zamenjava nejasna (126?/156?); stari reg r0 ('6/8') + r1 (126) = razdeljena fizična vrstica; staro 'Sedig Johann Landl' = 'Jattln' razdeljeno"),
    (1, '1 / 29', 'Strauß Maude [?]', '', G, '226', "staro 'Schinay Mauds'"),
    (2, '1 / 29', 'Strauß Maude [?]', '', G, '356[?]', "staro reg 256"),
    (3, '1 / 16', 'Christian Grogy [?]', '', G, '311', "staro 'Schinay Mauds'; h: najbrž 16, možno 66"),
    (4, '1 / 21', 'Feßdig Miko? [?]', '', G, '67', "staro 'Rudolf Georg'"),
    (5, '1 / 24', 'Foding? Mainfal? [?]', '', G, '51', "staro 'Sedig Mauds'"),
    (6, '1 / 43', 'Brusthal? Michl? [?]', '', G, '43[?]', "staro 'Brundloch Muds' (kl 43/45?)"),
    (7, '1 / 29', 'Strauß Maude [?]', '', G, '190[?]', "staro 'Schinay Mauds' (490)"),
    (8, '1 / 29', 'Strauß Maude [?]', '', G, '28[?]', "staro 'Schinay Mauds' (78)"),
    (9, '1 / 08', 'Strauß Grogy [?]', '', G, '35', "staro 'Schinay Georg'"),
    (10, '1 / 48', 'Strauß Grogy [?]', '', G, '329', "staro 'Schinay Georg'"),
    (11, '1 / 42', 'Feßdig Marlfa? [?]', '', G, '42[?]', "staro 'Sedig Michl'"),
    (12, '1 / 49', 'Brustal? Minalo? [?]', '', G, '44', "staro 'Brundla Mauds' (42)"),
    (13, '1 / 44', 'Feßdig Grogy [?]', '', G, '77', "staro 'Sedig Georg' (46)"),
    (14, '1 / 44', 'Feßdig Grogy [?]', '', G, '709[?]', "staro 'Sedig Georg'; jaz: 701?/791?"),
    (15, '1 / 39', 'Strauß Maude [?]', '', G, '675[?]', "staro 'Schinay Mauds' (623)"),
    (16, '1 / 40', 'Feßdig Jattla [?]', '', G, '665[?]', "staro 'Sedig Johan' (663) — isti Jattla↔Johan napačni branji"),
    (17, '1 / 08', 'Strauß Grogy [?]', '', G, '748', "staro 'Schinay Georg'"),
    (18, '1 / 49', 'Brustal? Minalo? [?]', '', G, '1450', "staro 'Brundloch Mids'"),
    (19, '1 / 42', 'Feßdig Marlfa? [?]', '', G, '1354[?]', "v starem reg vrstica manjkala (reg r19 = pomešani r18/r19)"),
]

PAGE_OBS = {
    56: 'v127 osebni re-read (24 bandov + nsheet ×5): imenske družine Feßdig Malfa/Marlfa, '
        'Mainig? Jattla (h18 veriga → p57/p58), Mainig? Mihal?, Lappany Miko? (h64 → p57), '
        'Unlich Miko?, Beiflich?, Strauß Grogy (h45 ×2 + r15), Scheffstech? Jua(n)? prečrtano. '
        'h-neskladja reg (r10 62?, r15 66?) zapisana v anmerkung.',
    57: 'v127 osebni re-read: Veitl štirih-forma artefakt rešen = Mainig Jattla ×4 (1/18); '
        'h18 veriga p56–58; Wolfpaul → Mainig? Mainfal?; Haberl/Rabius → Stabler Marlfa? ×2 (1/30); '
        'Wittig → Milleo? Johann?; Fritsch Michl → Feßdig? Mauds?; Wolfsgruber → Wobathan? Mauds? '
        '(h47 → p58); stand \'Bauern Gwindler?\' pri r0.',
    58: 'v127 osebni re-read: stand \'Gewürze\' = Bauern Gwindler?; Hannß Gregor → Strauß Grogy ×2; '
        'kl artefakti: \'+56\'→\'1 56\', \'-944\'→\'1 944\' (Joche stolpec \'1\' kot znak), '
        'isti razrod \'-174\'→\'1 174\', \'-1075\'→\'1 1075\' (sklep); h47 ×2 = Wobathan? Mauds? '
        '(veriga s p57 r19); h20 ×2 = Fodag Mainfal (≈Feßdig Mainfel?); n=19 potrjeno '
        '(P1102–P1120, zadnja vrstica = p59 r0).',
    59: 'v127 osebni re-read + kstack: FIZIČNO 20 vrstic (P1121–P1140) + Stiftung vrstica + '
        'prazna prečrtana (P1141 pozicija). Stari reg r20 (\'Hudales Matija\' j583 kl56) in r21 '
        '(\'Pavlič Miha\' j9 kl1128) = fragmenti Stiftung vrstice — vrstici odstranjeni iz register, '
        'vsebina tu. Stiftung: rdeče 9 (prečrtano) | 1128 (prečrtano) → rdeče 2|762. Vrstica '
        'Stabler Marlfa? (P1139, 1/30, kl prazna, rdeča opomba \'beyfügnung ... d. 1. Mai?\') je '
        'v starem reg manjkala. Kl stolpec: večina vrednosti prečrtanih rdeče (stari bralec je '
        'prepisoval prečrtane); zamenjava vidna le r7 (1042→1085). Off-by-one/off-by-two premiki '
        'starega reg razrešeni s kstack rdečimi črtami. Lastniki: Fodag Mainfal/Miko izmenično '
        '(20/21), Strauß Grogy (45), Fodag Grogy (41), Stabler Marlfa (30).',
    60: 'v127 osebni re-read: lastniške družine Fodag Mainfal, Feßdig Grogy/Jattla, Strauß '
        'Grogy/Maude, Christian Marlly?/Jattla, Haustück? Minalo?, Hauptstück? Mihal. Artefakti '
        'rešeni: \'Pötlar Pötlar\' = Feßdig Jattla; \'Mündertal Mändle\' = Haustück? Minalo?; '
        'h \'113\' = 1/13; \'Zu M\'Fleisch zu Riedl\' = wohnort/kultur celice. Kl: mnogo prečrtanih '
        'rdeče, 1|160 (Joche 1). Fürtrag vrstica: folio št. 58, rdeče 9 (prečrtano) | 1142 (prečrtano).',
    61: 'v127 osebni re-read: stari reg r0 (\'6/8\'=648) + r1 (126) = razdeljena fizična r0 '
        '(648 prečrtano → zamenjava 126?/156?); fizična r19 (Feßdig Marlfa?, 1354?) je v starem '
        'reg manjkala (reg r19 = pomešani r18/r19: \'Sedig Michl\' 1/42 + 1450). Jattla↔Johan '
        'napačni branji (\'Sedig Johann Landl\', \'Sedig Johan\'). Družine: Feßdig Jattla/Marlfa/'
        'Miko?, Strauß Maude/Grogy, Christian Grogy, Brustal? Minalo?, Brusthal? Michl?. '
        'Fürtrag: rdeče 5|195.',
}


def main():
    reg = json.load(open(REG))
    out = []
    for pg, newrows in sorted(pages.items()):
        idxs = [i for i, r in enumerate(reg) if r['page'] == pg]
        rebuilt = []
        for pos, (old_i, h, own, st, wo, kl, anm) in enumerate(newrows):
            abs_i = idxs[0] + old_i if 0 <= old_i < len(idxs) else None
            if abs_i is not None:
                base = copy.deepcopy(reg[abs_i])
            else:
                base = copy.deepcopy(reg[idxs[0]])
                for k in list(base.keys()):
                    if k not in ('source', 'document_id', 'page', 'sheet_visible',
                                 'no_blatt', 'owner_was_ditto', 'reading_pass'):
                        base[k] = ''
            # p59: stari reg r19/r20 (0-based) = Stiftung fragmenta — odstranjeni
            # (vsebina v page_observations_v127); fizična P1140 = stari r18 → novi r19
            # (normalna pot: newvals snimke pravilno proti starem r18); novi r18
            # (Stabler, P1139) = VSTAVLJENA (old_i=-1 — čist scaffolding, precedens v115)
            newvals = {'haus_no': h, 'owner_original': own, 'stand': st,
                       'wohnort': wo, 'klafter': kl}
            for f, nv in newvals.items():
                ov = base.get(f, '')
                if ov != nv:
                    base[f + '_' + PRE] = ov
                base[f] = nv
            base['jaethe'] = base.get('jaethe', '')
            if anm:
                prev = base.get('anmerkung', '')
                base['anmerkung'] = A(prev, 'v127: ' + anm) if prev else 'v127: ' + anm
            base['reading_pass'] = 'v127-ps-reread'
            base['page_observations_v127'] = PAGE_OBS[pg]
            rebuilt.append(base)
        # splice
        out_start = idxs[0]
        out_end = idxs[-1] + 1
        reg = reg[:out_start] + rebuilt + reg[out_end:]
        print(f'p{pg}: {len(idxs)} -> {len(rebuilt)} vrstic (span {out_start}..{out_end - 1})')
    json.dump(reg, open(REG, 'w'), ensure_ascii=False, indent=1)
    print('register.json shranjen,', len(reg), 'vrstic')


if __name__ == '__main__':
    main()
