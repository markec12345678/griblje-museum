# -*- coding: utf-8 -*-
# 57. sklop / val 11: vgradnja DL virov in odstavkov (add-only)
BS = chr(92)
NL2 = BS + 'n' + BS + 'n'
P = 'src/lib/museum-content.ts'
lines = open(P, encoding='utf-8').read().split('\n')

def find(pred, start=0, end=None):
    end = end or len(lines)
    for i in range(start, end):
        if pred(lines[i]):
            return i
    return None

def slug_line(rec):
    i = find(lambda l: ('slug: "' + rec + '"') in l)
    assert i is not None, 'slug ni najden: ' + rec
    return i

def para_insert(line, para, sl_mode):
    pos = line.find('Muzej išče:') if sl_mode else line.find('The museum seeks:')
    if pos >= 0:
        return line[:pos] + para + NL2 + line[pos:]
    idx = line.rstrip().rfind('",')
    return line[:idx] + NL2 + para + line[idx:]

def add_para(rec, para_sl, para_en):
    sl = slug_line(rec)
    si = find(lambda l: l.startswith('    storySi:'), sl, sl + 40)
    ei = find(lambda l: l.startswith('    storyEn:'), sl, sl + 60)
    assert si is not None and ei is not None, 'story ni najdena: ' + rec
    lines[si + 1] = para_insert(lines[si + 1], para_sl, True)
    lines[ei + 1] = para_insert(lines[ei + 1], para_en, False)

def add_source(rec, block):
    sl = slug_line(rec)
    src = find(lambda l: l.strip().startswith('sources: ['), sl, sl + 220)
    assert src is not None, 'sources ni najden: ' + rec
    end = find(lambda l: l.strip() == '],' , src, src + 170)
    assert end is not None, 'konec sources ni najden: ' + rec
    lines[end:end] = block

# ============ MVG-033 audrey-totter ============
add_para(
    'audrey-totter',
    'Dolenjski list je hollywoodsko zgodbo povedal z gribeljske strani: konec 19. stoletja so se trije Jandreči (Tottrovi) fantje iz Gornjih Gribelj odpravili čez lužo. Janez je ostal v močni slovenski skupnosti v Jolietu v Illinoisu, dva brata pa sta pozneje odšla v Texas; poročil se je z Ido Mae, Američanko švedskih korenin, in decembra 1917 se jima je rodila hčerka Audrey. V poznih tridesetih je prišla do radijskih iger v Chicagu in New Yorku (Painted Dreams, Road of Life, Ma Perkins, Bright Horizons), prvo filmsko priložnost pa je dobila leta 1945 v filmu Main Street After Dark; list izpisuje rojstvo 20. decembra 1917 in smrt 12. decembra 2013 v Woodland Hillsu. A lok te zgodbe ima v Gribljih svojo točko nazaj: hiša, ki jo list na fotografijah opisuje kot »Jandreči v Gribljah danes«, še stoji.',
    "The Dolenjski list told the Hollywood story from the Griblje side: at the end of the 19th century three Jandreč (Totter) lads from Gornje Griblje set off across the water. Janez stayed in the strong Slovenian community of Joliet, Illinois, while two brothers later went to Texas; he married Ida Mae, an American of Swedish roots, and in December 1917 their daughter Audrey was born. In the late 1930s she reached the radio dramas of Chicago and New York (Painted Dreams, Road of Life, Ma Perkins, Bright Horizons), and her first film chance came in 1945 with Main Street After Dark; the paper prints her birth on 20 December 1917 and her death on 12 December 2013 in Woodland Hills. And the arc has its Griblje anchor: the house the paper pictures as 'the Jandreč home in Griblje today' still stands.",
)
add_source('audrey-totter', [
    '      {',
    '        key: "dl-audrey-totter-2024",',
    '        nameSi: "Dolenjski list — Ljudje ob Kolpi: Audrey Totter, holivudska igralka (23. 12. 2024; serija 2020/2021/2024)",',
    '        nameEn: "Dolenjski list — People by the Kolpa: Audrey Totter, the Hollywood actress (23 Dec 2024; series 2020/2021/2024)",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/kultura/ljudje-ob-kolpi-audrey-totter-holivudska-igralka-297532-1443126",',
    '        noteSi: "Trije Jandreči iz Gornjih Gribelj; Janez in Ida Mae; rojena 20. 12. 1917 v Jolietu, umrla 12. 12. 2013 v Woodland Hillsu; radijske igre (Painted Dreams, Road of Life, Ma Perkins, Bright Horizons); filmski debi Main Street After Dark 1945; fotografija »Jandreči v Gribljah danes«.",',
    '        noteEn: "Three Jandreč men from Gornje Griblje; Janez and Ida Mae; born 20 Dec 1917 in Joliet, died 12 Dec 2013 in Woodland Hills; radio dramas (Painted Dreams, Road of Life, Ma Perkins, Bright Horizons); film debut Main Street After Dark 1945; the photograph of the Jandreč home today.",',
    '      },',
])

# ============ MVG-022 anton-filak ============
add_para(
    'anton-filak',
    'Dolenjski list je Filakovo oranje spremljalo kot serijo. Maja 2011 je z Dolenjcev pri Adlešičih na Švedsko odpeljal tovornjak s traktorjema in plugoma: Anton Filak je na 58. svetovnem prvenstvu v švedskem Östergötlandu (Lindevads Säteri) tekmoval že devetič, s plugom krajnikom, spremljevalca pa sta sin Jure in Igor Kostevčič. Septembra istega leta je list zapisal »velik uspeh Filakovih oračev« — in fotografijo sprejema ob prihodu domov v Griblje, kjer so jima vaščani, prijatelji in sorodniki pripravili manjši sprejem. Avgusta 2012 je bilo regijsko tekmovanje v oranju kar na njivi pri Gribljih: trinajst belokranjskih oračev, med katerimi je bil z tekmovalnimi plugi najboljši Jure Filak, Anton pa je nastopil izven konkurence — kot priprave na svetovno prvenstvo.',
    'The Dolenjski list followed Filak\u2019s ploughing as a series. In May 2011 a truck carried two tractors and ploughs from Dolenjci pri Adlešičih to Sweden: Anton Filak competed at the 58th world championship in Östergötland (Lindevads Säteri) for the ninth time, with a short-plough, and his escorts were his son Jure and Igor Kostevčič. That September the paper wrote of a great success for the Filak ploughmen — with a photograph of the welcome when they returned home to Griblje, where villagers, friends and relatives had prepared a small reception. In August 2012 the regional ploughing contest was held on a field right by Griblje: thirteen Bela krajina ploughmen, with Jure Filak best among the competitive ploughs and Anton appearing out of competition — as practice for the world championship.',
)
add_source('anton-filak', [
    '      {',
    '        key: "dl-filak-sp-2011",',
    '        nameSi: "Dolenjski list (6. 5. 2011): Anton Filak in Matej Kostevc na svetovno prvenstvo oračev",',
    '        nameEn: "Dolenjski list (6 May 2011): Anton Filak and Matej Kostevc to the world ploughing championship",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/posavje/sport/anton-filak-in-matej-kostevc-na-svetovno-prvenstvo-oracev-61573-1689137",',
    '        noteSi: "58. SP v Östergötlandu (Lindevads Säteri); Filak že 9. nastop, plug krajnik; ekipa: Kardinar (vodja), Črv (sodnik); spremljevalca Jure Filak in Igor Kostevčič.",',
    '        noteEn: "The 58th championship in Östergötland (Lindevads Säteri); Filak\u2019s ninth appearance, short plough; team: Kardinar (head), Črv (judge); escorts Jure Filak and Igor Kostevčič.",',
    '      },',
    '      {',
    '        key: "dl-filak-uspeh-2011",',
    '        nameSi: "Dolenjski list (12. 9. 2011): Velik uspeh Filakovih oračev; Kostevc drugi, Pate tretji",',
    '        nameEn: "Dolenjski list (12 Sep 2011): A great success for the Filak ploughmen; Kostevc second, Pate third",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/posavje/sport/velik-uspeh-filakovih-oracev-kostevc-drugi-pate-tretji-67138-1687252",',
    '        noteSi: "Sprejem ob prihodu domov v Griblje (foto: družinski arhiv); rezultati svetovnega prvenstva.",',
    '        noteEn: "The welcome on the return home to Griblje (photo: family archive); the championship results.",',
    '      },',
    '      {',
    '        key: "dl-filak-regijsko-2012",',
    '        nameSi: "Dolenjski list (6. 8. 2012): Na državno prvenstvo v oranju gresta Anton in Jure Filak",',
    '        nameEn: "Dolenjski list (6 Aug 2012): Anton and Jure Filak bound for the national ploughing championship",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/sport/na-drzavno-prvenstvo-v-oranju-gresta-anton-in-jure-filak-83375-1681806",',
    '        noteSi: "Regijsko tekmovanje na njivi pri Gribljih: 13 belokranjskih oračev; Jure Filak 1. mesto z tekmovalnimi plugi; Anton izven konkurence kot priprave na SP.",',
    '        noteEn: "The regional contest on a field by Griblje: 13 Bela krajina ploughmen; Jure Filak first with competitive ploughs; Anton out of competition, as world-championship practice.",',
    '      },',
])

# ============ MVG-034 nikolaj-dragos ============
add_para(
    'nikolaj-dragos',
    'Dolenjski list je Dragoševemu življenjepisu dodal domačo stran. Rodil se je kot deveti od dvanajstih otrok na Hajdečarovem gruntu, kjer so imeli konja in osem govedi ter gojili precej ajde — po domače hajde; osnovno šolo je obiskoval v Gribljih, pouk pa je večkrat prekinjen: najprej zaradi smrti dveh učiteljev, ki jih niso takoj nadomestili, v prvi svetovni vojni pa zaradi mobilizacije treh učiteljev zapovrstjo. Po drugi svetovni vojni je dobil službo kot delavec ljudske milice in v upravi za notranje zadeve deloval do upokojitve; poročil se je pri štiridesetih in imel sina ter hčerko. 110. rojstni dan je praznoval v ljubljanskem Domu upokojencev Center, med čestitkarji pa je bil tudi predsednik republike Borut Pahor.',
    'The Dolenjski list added the home side to Dragoš\u2019s biography. He was born the ninth of twelve children on the Hajdeč farm, which kept a horse and eight head of cattle and grew a good deal of buckwheat — hajda in the local tongue; he attended the primary school in Griblje, his schooling interrupted again and again — first by the deaths of two teachers who were not promptly replaced, then, in the First World War, by the successive mobilisation of three teachers. After the Second World War he took a job as a people\u2019s militia worker and served in the interior administration until retirement; he married at forty and had a son and a daughter. He celebrated his 110th birthday at the Ljubljana retirement home Center, with President Borut Pahor among those bringing greetings.',
)
add_source('nikolaj-dragos', [
    '      {',
    '        key: "dl-dragos-ljudje-2021",',
    '        nameSi: "Dolenjski list — Ljudje ob Kolpi: Nikolaj Dragoš; bil je najstarejši Slovenec (1. 9. 2021)",',
    '        nameEn: "Dolenjski list — People by the Kolpa: Nikolaj Dragoš; he was the oldest Slovene (1 Sep 2021)",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/slovenija/ljudje-ob-kolpi-nikolaj-dragos-bil-je-najstarejsi-slovenec-252448-1607448",',
    '        noteSi: "Deveti od dvanajstih otrok; Hajdečarov grunt — konj in osem govedi, ajda/hajda; šola v Gribljih s prekinitvami (smrti učiteljev, mobilizacija); poročna fotografija.",',
    '        noteEn: "Ninth of twelve children; the Hajdeč farm — a horse and eight cattle, buckwheat/hajda; school in Griblje with interruptions (teacher deaths, mobilisation); a wedding photograph.",',
    '      },',
    '      {',
    '        key: "dl-dragos-umrl-2018",',
    '        nameSi: "Dolenjski list (2. 4. 2018): Umrl najstarejši Slovenec — Nikolaj Dragoš je imel 110 let",',
    '        nameEn: "Dolenjski list (2 Apr 2018): The oldest Slovene has died — Nikolaj Dragoš was 110",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/upokojenci/umrl-najstarejsi-slovenec-nikolaj-dragos-je-imel-110-let-193389-1756576",',
    '        noteSi: "Po vojni ljudska milica in uprava za notranje zadeve do upokojitve; poroka pri 40 letih; sin in hčerka; 110. rojstni dan v Domu upokojencev Center s čestitko predsednika Pahorja.",',
    '        noteEn: "After the war the people\u2019s militia and the interior administration until retirement; married at forty; a son and a daughter; the 110th birthday at the Center retirement home with President Pahor\u2019s greeting.",',
    '      },',
])

# ============ MVG-082 gribeljski-zbul ============
add_para(
    'gribeljski-zbul',
    'Kako je žbul potoval, se je leta 2013 spomnila Ana Jakofčič (rojena Filak): s konjem in vozom so žbul prodajali »v žbularijo« vse do Kočevja, spali pa na skednjih in pod milim nebom — enkrat jim je med spanjem pes pojedel malico. Ana in Matija Jakofčič iz Gribelj 67 sta se poročila 26. novembra 1946; po vojni je Matija lahko dobil službo v Ljubljani, a se za selitev ni odločil — domov ga je vlekla domačija, ki je potrebovala gospodarja. Žbul je bil denar, a tudi vez: pot do Kočevja je bila pot, ki je vas povezovala s svetom onkraj Gorjancev.',
    'Ana Jakofčič (née Filak) remembered in 2013 how the žbul travelled: with a horse and cart they sold it in the onion country all the way to Kočevje, sleeping in barns and under the open sky — once, as they slept, a dog ate their lunch. Ana and Matija Jakofčič of Griblje 67 married on 26 November 1946; after the war Matija could have taken a job in Ljubljana, but chose not to move — home pulled him back to the farm that needed its master. The žbul was money, and a bond too: the road to Kočevje was the road that joined the village to the world beyond the Gorjance hills.',
)
add_source('gribeljski-zbul', [
    '      {',
    '        key: "dl-jakofcic-2013",',
    '        nameSi: "Dolenjski list (27. 11. 2013): 67 let poroke Ane in Matije Jakofčič",',
    '        nameEn: "Dolenjski list (27 Nov 2013): 67 years of marriage for Ana and Matija Jakofčič",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/kronika/67-let-poroke-ane-in-matije-jakofcic-106834-1521880",',
    '        noteSi: "Poroka 26. 11. 1946 (Ana Filak, 19; Matija Jakofčič, 24, Gribelj 67); prodaja žbula »v žbularijo« do Kočevja s konjem in vozom; spanje na skednjih; štirje otroci.",',
    '        noteEn: "Marriage on 26 Nov 1946 (Ana Filak, 19; Matija Jakofčič, 24, Griblje 67); selling žbul onions as far as Kočevje by horse and cart; sleeping in barns; four children.",',
    '      },',
])

# ============ MVG-032 kolesa-torpedo ============
add_para(
    'kolesa-torpedo',
    'Dolenjski list je četrti reli sekcijske zgodovine zapisal takole: Sekcija Torpedo — ljubitelji starodobnih koles, ki deluje v okviru Turističnega društva Griblje — je reli pripravila poleti 2016; začel se je na kopališču v Gribljah, udeleženci pa so na okrog dvajset kilometrov dolgi poti prevozili del Bele krajine ob Kolpi in odpravili se je tudi na Hrvaško, v Metliki pa si ogledali Belokranjski muzej. Mnogi kolesarji so bili oblečeni v oblačila iz časov, ko so njihova kolesa zagledala luč sveta — in na tej poti zbujali precejšnjo pozornost.',
    'The Dolenjski list recorded the fourth rally of the section\u2019s history like this: the Torpedo section — lovers of veteran bicycles working within the Griblje Tourist Society — staged the rally in the summer of 2016; it began at the Griblje bathing spot, and on a route of some twenty kilometres the riders crossed part of Bela krajina along the Kolpa and made their way to Croatia, taking in the Bela krajina Museum in Metlika. Many of the riders wore clothes from the age when their bicycles first saw the light of day — and drew plenty of attention on the road.',
)
add_source('kolesa-torpedo', [
    '      {',
    '        key: "dl-torpedo-reli-2016",',
    '        nameSi: "Dolenjski list (9. 7. 2016): S starodobnimi kolesi ob Kolpi po slovenski in hrvaški strani",',
    '        nameEn: "Dolenjski list (9 Jul 2016): Veteran bicycles by the Kolpa on both the Slovenian and Croatian sides",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/sport/kolesarstvo/s-starodobnimi-kolesi-ob-kolpi-po-slovenski-in-hrvaski-strani-158911-1709141",',
    '        noteSi: "4. reli Sekcije Torpedo (TD Griblje): začetek na kopališču Griblje, okrog 20 km, Belokranjski muzej v Metliki, oblačila obdobja; foto arhiv Dolenjskega lista.",',
    '        noteEn: "The 4th rally of the Torpedo section (TD Griblje): start at the Griblje bathing spot, about 20 km, the Bela krajina Museum in Metlika, period dress; photo archive of the Dolenjski list.",',
    '      },',
])

# ============ MVG-087 krizevo-pastirski-dan ============
add_para(
    'krizevo-pastirski-dan',
    'Vrnitev iz leta 2017 ima dva poročevalca istega vikenda: dan po koledarskem zapisu Krajinskega parka je Dolenjski list (29. 5. 2017) opisal, kako se v Gribljah trudijo ohraniti tradicijo pastirskega praznika — med dvema ognjema in z nebesičenjem, z ročno košnjo, z izdelavo rogov iz lubja in lesenih piščali ter s pastirsko malico, pri kateri ni manjkalo cvrtje. Dva neodvisna zapisa istega vikenda so dala obuditvi krož: tradicija ni bila samo obnovljena — je bila opazovana.',
    'The 2017 revival has two reporters for the same weekend: a day after the National Park\u2019s calendar entry, the Dolenjski list (29 May 2017) described how Griblje strives to keep the shepherds\u2019 festival tradition alive — between two fires with ceremonial games, hand-mowing, the making of bark horns and wooden flutes, and a shepherd\u2019s meal where fried food did not lack. Two independent accounts of one weekend closed the circle of the revival: the tradition was not only renewed — it was observed.',
)
add_source('krizevo-pastirski-dan', [
    '      {',
    '        key: "dl-pastirski-2017",',
    '        nameSi: "Dolenjski list (29. 5. 2017): V Gribljah se trudijo ohraniti tradicijo pastirskega praznika",',
    '        nameEn: "Dolenjski list (29 May 2017): Griblje strives to keep the shepherds\u2019 festival tradition alive",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/slovenija/v-gribljah-se-trudijo-ohraniti-tradicijo-pastirskega-praznika-176582-1704880",',
    '        noteSi: "Praznik v Gribljih 2017: med dvema ognjema, nebesičenje, košnja, rogovi iz lubja in lesene piščali, pastirska malica s cvrtjem; drugi poročevalec vikenda ob NP Kolpa (28. 5. 2017).",',
    '        noteEn: "The 2017 festival in Griblje: between two fires, ceremonial games, mowing, bark horns and wooden flutes, a shepherd\u2019s meal with fried food; the second reporter of the weekend beside the Kolpa Park (28 May 2017).",',
    '      },',
])

# ============ MVG-097 javna-razsvetljava-2023 ============
add_para(
    'javna-razsvetljava-2023',
    'Infrastrukturni koledar vasi ima starejšo stran: 5. septembra 2008 je Dolenjski list zapisal »Iz Gribelj nič več v Kolpo« — odprtje čistilne naprave ob Kolpi in nove kanalizacije za 200–300 populacijskih enot, naložbe iz dobrega milijona evrov, za katero je evropski protokol zahteval predstavitev prav v gasilskem domu; 70 % sredstev je prispelo iz EU, župan Andrej Fabjan pa je projekt pozdravil kot prispevek k čistejši Kolpi. Čistilna naprava 2008, javna razsvetljava 2023, asfalt 2025 — enak vzorec tri generacije zapored: vas, ki srečo gradi po koščkih.',
    'The village\u2019s infrastructure calendar has an older page: on 5 September 2008 the Dolenjski list wrote \u2018From Griblje nothing more into the Kolpa\u2019 — the opening of a treatment plant by the Kolpa and a new sewerage system for 200–300 population equivalents, an investment of over a million euros whose European protocol required a presentation in the fire station itself; seventy per cent of the funds came from the EU, and mayor Andrej Fabjan hailed the project as a contribution to a cleaner Kolpa. Treatment plant 2008, public lighting 2023, asphalt 2025 — the same pattern three generations running: a village building its fortune piece by piece.',
)
add_source('javna-razsvetljava-2023', [
    '      {',
    '        key: "dl-cn-2008",',
    '        nameSi: "Dolenjski list (5. 9. 2008): Iz Gribelj nič več v Kolpo",',
    '        nameEn: "Dolenjski list (5 Sep 2008): From Griblje nothing more into the Kolpa",',
    '        sourceType: "spletni-vir",',
    '        license: "avtorsko delo / copyrighted (navedba)",',
    '        url: "https://dolenjskilist.svet24.si/novice/gospodarstvo/iz-gribelj-nic-vec-v-kolpo-47366-1478112",',
    '        noteSi: "Odprtje ČN ob Kolpi in kanalizacije (200–300 PE); naložba ~1 milijon €, 70 % EU; predstavitev v gasilskem domu; župan Andrej Fabjan (vir Lokalno.si).",',
    '        noteEn: "Opening of the treatment plant by the Kolpa and the sewerage (200–300 PE); an investment of about one million euros, 70% EU; presentation in the fire station; mayor Andrej Fabjan (source Lokalno.si).",',
    '      },',
])

open(P, 'w', encoding='utf-8').write('\n'.join(lines))
print('VGRADNJA 6/6 ZAPISOV + 9 VIROV: SHRAMBA OK')
