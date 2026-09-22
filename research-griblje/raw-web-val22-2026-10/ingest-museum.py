#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""22. val — vgradnja MVG-109 (bridke-izkusnje-1898) + add-only viri + popravki.
Zgodbe so ločene spremenljivke; ubežni \n se ustvari programsko.
Atomarna: vse zamenjave se preverijo V POMNILNIKU, pisanje na koncu."""
import re, io

MC = "/home/z/my-project/src/lib/museum-content.ts"
WK = "/home/z/my-project/src/lib/walks.ts"

mc = io.open(MC, encoding="utf-8").read()
wk = io.open(WK, encoding="utf-8").read()

def rep(text, old, new, n=1, tag=""):
    c = text.count(old)
    if c != n:
        raise SystemExit(f"FAIL [{tag}]: najdeno {c}x (pričakovano {n}): {old[:90]!r}")
    return text.replace(old, new)

SRC_BEFORE = len(re.findall(r'key: "', mc))
EXH_BEFORE = len(re.findall(r'museumNo: "MVG-\d{3}"', mc))
if SRC_BEFORE != 537: raise SystemExit(f"FAIL: virov pred={SRC_BEFORE}, pričakovano 537")
if EXH_BEFORE != 108: raise SystemExit(f"FAIL: zapisov pred={EXH_BEFORE}, pričakovano 108")

# ---------- 1) MVG-091 summary popravka (niso več "edina") ----------
mc = rep(mc,
 '"Edina doslej znana književna dogodivščina, postavljena v Griblje: povest Josipa Kostanjevca o gradnji vaške šole, oderuhu Lokvarju, modremu Jekovcu in učitelju Tratarju.',
 '"Prva od doslej znanih dveh književnih dogodivščin, postavljenih v Griblje: povest Josipa Kostanjevca o gradnji vaške šole, oderuhu Lokvarju, modremu Jekovcu in učitelju Tratarju. 22. val je ob njej postavil še drugo — povest »Bridke izkušnje« (Domoljub 1898, zapis bridke-izkusnje-1898).',
 1, "summarySi")

mc = rep(mc,
 '"The only known work of fiction set in Griblje: Josip Kostanjevec\'s tale of the building of the village school, the usurer Lokvar, the wise Jekovec and the teacher Tratar.',
 '"The first of the two known works of fiction set in Griblje: Josip Kostanjevec\'s tale of the building of the village school, the usurer Lokvar, the wise Jekovec and the teacher Tratar. Val 22 raised beside it the second — the tale \\"Bridke izkušnje\\" (Domoljub 1898, record bridke-izkusnje-1898).',
 1, "summaryEn")

# ---------- 2) MVG-091 commons PDF vir: dokaz naslovnice ----------
mc = rep(mc,
 '"Digitaliziran izvod; naslovna stran zapisa je izrez iz tega skena.",',
 '"Digitaliziran izvod; naslovna stran zapisa je izrez iz tega skena. Naslovna stran skena izrecno nosi »68. zvezek. 1914.« (prebrano s skena 22. vala) — potrjuje leto in zvezek zapisa; metapodatki Wikivira (»69. zvezek, 1915«) so zmotni.",',
 1, "noteSi-dlib-1914")

mc = rep(mc,
 '"A digitised copy; the record\'s title page is a crop from this scan.",',
 '"A digitised copy; the record\'s title page is a crop from this scan. The scan\'s title page explicitly reads \\"68. zvezek. 1914.\\" (read from the scan in val 22) — confirming the record\'s year and volume; the Wikisource metadata (\'69. zvezek, 1915\') is erroneous.",',
 1, "noteEn-dlib-1914")

# ---------- 3) MVG-091 + SBL Kostanjevec (dodaten vir) ----------
SBL_K = '''      {
        key: "sbl-kostanjevec",
        nameSi: "Novak, Vilko: Kostanjevec Josip — Slovenski biografski leksikon (ZRC SAZU)",
        nameEn: "Novak, Vilko: Kostanjevec Josip — Slovene Biographical Lexicon (ZRC SAZU)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/oseba/sbi293950/",
        noteSi:
          "SBL (22. val): pisatelj in učitelj, ★ 19. 2. 1864 Vipava, † 20. 5. 1934 Maribor — datumi v zapisu potrjeni s citiranim leksikonom.",
        noteEn:
          "SBL (val 22): writer and teacher, b. 19 Feb 1864 Vipava, d. 20 May 1934 Maribor — the record's dates corroborated by the cited lexicon.",
      },
    ],
  },
  {
    slug: "ilirska-carina-1809",'''
mc = rep(mc, '''    ],
  },
  {
    slug: "ilirska-carina-1809",''', SBL_K, 1, "sbl-kostanjevec-vstavi")

# ---------- 4) sbl-zupanic: natančen URL osebe ----------
mc = rep(mc,
 '''        nameSi: "Novak, Vilko: Županič Niko — Slovenski biografski leksikon (ZRC SAZU)",
        nameEn: "Novak, Vilko: Županič Niko — Slovene Biographical Lexicon (ZRC SAZU)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/",''',
 '''        nameSi: "Novak, Vilko: Županič Niko — Slovenski biografski leksikon (ZRC SAZU)",
        nameEn: "Novak, Vilko: Županič Niko — Slovene Biographical Lexicon (ZRC SAZU)",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/oseba/sbi915246/",''',
 1, "sbl-zupanic-url")

# ---------- 5) MVG-109: nov zapis pred koncem seedExhibits ----------
story_si = (
 "Šestnajst let, preden je Josip Kostanjevec na majhnem griču »čepel« vas Griblje (zapis novo-zivljenje-1914), je gribeljska gostilna že stala v slovenskem tisku. Leta 1898 je ljubljanski poljudni časopis Domoljub — »slovenskemu ljudstvu v poduk in zabavo« — objavil povest Bridke izkušnje, podpisano s psevdonimom Pivčan; izhajala je v zvezkih 14–17 in 19–21 osemindvajsetega letnika, kar pomeni, da je bila dovolj dolga, da je bralec čakal naslednjo številko. In njen potopisni del je napravil nekaj, kar v slovenski literaturi ni storil še nihče pred njo: pripeljal je branilce čez Kočevje in Koprivnik — in jih ponočil v Gribljih.\n\n"
 "Vozniki v pripovedi res pripotujejo: »Dospevši onkraj Postojne zavijejo po občinski cesti na Ribnico, kjer se ustavijo čez poldne. Nato vozijo čez Kočevje, Koprivnik in dospejo proti večeru do vasi Griblje.« In nato en stavek, ki je za muzej kot iz punce rok narejen: »Bili so na meji.« Pot je prava: stare ceste iz Kočevske čez Koprivnik v Belo krajino se spustijo ravno sem — k eni od najbolj mejnih vasi dežele. Gostitelj pa je literaren: »Tu v Gribljah imam prijatelja Grozdiča … Najpremožnejši je v vasi, in gostilna slovi daleč na okoli. Z vinom trguje po vsem Hrvaškem in Slavoniji. V Daruvaru se vedno oglasi pri nas.«\n\n"
 "Tukaj je ta zapis najbolj iskren: Grozdičev priimek muzej ne pozna; v gribeljskih virih ga ni. Ampak njegova gostilna je zgodovinsko zelo verjetna: vaška krčma, ki »slovi daleč na okoli«, in trgovina z vinom proti Zagrebu in Slavoniji — to je vzorec, ki ga dokumentirajo tudi drugi viri zbirke (Jure Županič je v Gribljih držal trgovino in gostilno; vino in črnina — zapis vino-in-crnina — je gribeljska kombinacija za belokranjske mize). Pred veliko lepo hišo »z veho nad vratmi« se torej ne ustavi samo voz, ampak tudi verjetnost: 1898 je v Gribljah gostilna lahko stala; ali je bila pri Grozdiču, ne moremo vedeti.\n\n"
 "Tretja scena pa pripoved postavi na breg reke: ciganka, ki je opazovala voz, »zavije navzdol proti Kolpi. Tu je ob obrežju na zeleni trati sedela okoli ognja tolpa ljudij« — Romi, ki so v 19. stoletju taborili ob kolpskih travnikih, njihova zgodba o Daruvarju in maščevanju pa razpihne nočno pripoved. Muzej to priznanje piše z dvema zvezkama: besedilo iz leta 1898 je pisano s stereotipi svojega časa — in hkrati je to ena od najzgodnejših omemb taborjenja Romov ob Kolpi pri Gribljih v slovenskem leposlovju. Vsaj tisto, kar muzej preveri, mora biti jasno: ognjišče je literarno, breg je pravi.\n\n"
 "Kdo je bil Pivčan, muzej ne ve. Psevdonim v wikipedistični razlagi ni vezan na znano osebo; Domoljub je objavljal anonimne in psevdonimne domoznanske prispevke. To je vrzel, ki jo ta zapis izrecno priznava: knjiga je dokumentirana (celotno besedilo je prebrano po Wikiviru, izvodi pa digitalizirani v dLibu), objava je izpričana, dogajališče je resnično, avtor pa je ime, ki se je umaknilo. Po opombi Wikivira je besedilo pregledalo več urejevalcev in je brez tipkarskih napak — tisto, kar muzej lahko naredi, je, da ga vrne v vaško zgodbo, kjer je nastalo.\n\n"
 "Skupaj z Kostanjevčevo povesto tako gribeljska književnost ne stoji več na enem naslovu: dve deli, šestnajst let narazen, ena vas — ena z gradnjo šole in oderuhom, druga z gostilno, vinom in ognjiščem ob reki. Muzej išče: dejansko identiteto Pivčana in datum prve tiskane gostilne v Gribljih (župnijska in hišna knjiga)."
)
story_en = (
 "Sixteen years before Josip Kostanjevec had the village of Griblje 'sit' on a small hill (record novo-zivljenje-1914), the Griblje inn already stood in the Slovene press. In 1898 the Ljubljana popular paper Domoljub — 'for the instruction and amusement of the Slovene people' — published the tale Bridke izkušnje (Bitter Experiences), signed with the pseudonym Pivčan; it ran across instalments 14–17 and 19–21 of volume twenty-eight, which means it was long enough to make readers wait for the next issue. And its travel section did something no one in Slovene literature had done before: it brought its readers over Kočevje and Koprivnik — and lodged them for the night in Griblje.\n\n"
 "The travellers in the tale really do travel: 'Having passed beyond Postojna they turn onto the district road to Ribnica, where they stop for midday. Then they drive on through Kočevje, Koprivnik and by evening reach the village of Griblje.' And then one sentence made, as it were, for a museum: 'Bili so na meji. They were at the border.' The road is real: the old routes from the Kočevsko region across Koprivnik into Bela krajina descend exactly here — to one of the most border-bound villages of the land. The host, however, is literary: 'Here in Griblje I have a friend, Grozdič … He is the richest man in the village, and the inn is famed far around. He trades wine across all Croatia and Slavonia. He is always to be found among us at Daruvar.'\n\n"
 "Here the record is at its most honest: the museum does not know the name Grozdič; it does not appear in the village's sources. But his inn is historically very plausible: a village tavern 'famed far around', a wine trade towards Zagreb and Slavonia — this is the pattern other sources of the collection also document (Jure Županič kept a shop and an inn in Griblje; wine and darkness — the record vino-in-crnina — is the Griblje pairing for Bela krajina tables). So it is not only a wagon that stops before 'a big fine house with a wreath above the door' — it is also plausibility: in 1898 an inn could well have stood in Griblje; whether it was Grozdič's, we cannot know.\n\n"
 "The third scene sets the tale on the riverbank: a Gypsy woman who watched the wagon 'turns away downhill towards the Kolpa. There on the green grass by the water sat a company of people around a fire' — Roma who in the 19th century camped on the Kolpa meadows, and their tale of Daruvar and revenge sets the night narrative alight. This museum notes it with two notebooks: the 1898 text is written with the stereotypes of its time — and at the same time it is one of the earliest mentions of Roma camping by the Kolpa near Griblje in Slovene fiction. At least what the museum can verify must be clear: the campfire is literary, the riverbank is real.\n\n"
 "Who Pivčan was, the museum does not know. The pseudonym is not tied to any known figure; Domoljub published anonymous and pseudonymous local contributions. That is a gap this record openly admits: the tale is documented (the full text read via Wikisource, the issues digitised in dLib), the publication attested, the setting real — while the author remains a name that withdrew. Per the Wikisource note the text was proofread by several editors and is free of typographical errors — and what the museum can do is return it to the village story where it was born.\n\n"
 "Together with Kostanjevec's tale, Griblje's literature no longer rests on a single title: two works, sixteen years apart, one village — one with the building of the school and a usurer, the other with an inn, wine and a campfire by the river. The museum is looking for: the actual identity of Pivčan, and the date of the first recorded inn in Griblje (parish and house registers)."
)
esc = lambda s: s.replace("\n", "\\n")
story_si_ts = esc(story_si)
story_en_ts = esc(story_en)

MVG109 = (
'''  {
    slug: "bridke-izkusnje-1898",
    museumNo: "MVG-109",
    addedAt: "2026-09-22",
    category: "kraj",
    titleSi: "Bridke izkušnje (1898) — povest, ki prenoči v Gribljih",
    titleEn: "Bridke izkušnje — Bitter Experiences (1898) — a tale that spends the night in Griblje",
    featured: false,
    periodSi: "1898 · Ljubljana: Domoljub, letn. 28, št. 14–17 in 19–21 · pod psevdonimom Pivčan",
    periodEn: "1898 · Ljubljana: Domoljub, vol. 28, nos. 14–17 and 19–21 · under the pseudonym Pivčan",
    summarySi:
      "Druga doslej znana književna dogodivščina z Gribljami: pripoved, objavljena pod psevdonimom Pivčan v ljubljanskem poljudnem časopisu Domoljub leta 1898, ki na vaški trg postavi gostilno, trgovino z vinom po Hrvaškem in ognjišče Romov ob Kolpi.",
    summaryEn:
      "The second known work of fiction to touch Griblje: a tale published under the pseudonym Pivčan in the Ljubljana popular paper Domoljub in 1898, setting the village inn, a wine trade across Croatia and a Roma campfire by the Kolpa onto the village stage.",
    storySi:
      "''' + story_si_ts + '''",
    storyEn:
      "''' + story_en_ts + '''",
    evidenceStatus: "DOCUMENTED",
    lat: 45.5728,
    lng: 15.2926,
    coordsApprox: true,
    yearFrom: 1898,
    yearTo: 1898,
    sources: [
      {
        key: "wikisource-bridke-izkusnje",
        nameSi: "Wikivir: Bridke izkušnje — celotno besedilo",
        nameEn: "Wikisource: Bridke izkušnje — the complete text",
        sourceType: "objava",
        license: "javna last",
        url: "https://sl.wikisource.org/wiki/Bridke_izku%C5%A1nje",
        noteSi:
          "Vsi citati zapisa (»Bili so na meji«, »Najpremožnejši je v vasi…«, »Z vinom trguje po vsem Hrvaškem in Slavoniji«, »zavije navzdol proti Kolpi«) preverjeni po besedilu; metapodatki: Domoljub 1898 (št. 14–17, 19–21), avtor Pivčan (psevdonim), 100 % pregledano.",
        noteEn:
          "All the record's quotations (\\"Bili so na meji\\", \\"The richest man in the village…\\", \\"He trades wine across all Croatia and Slavonia\\", \\"turns away downhill towards the Kolpa\\") verified against the text; metadata: Domoljub 1898 (nos. 14–17, 19–21), author Pivčan (pseudonym), 100% proofread.",
      },
      {
        key: "domoljub-1898-dlib",
        nameSi: "dLib: Domoljub, letn. 28, 1898 (št. 14–17, 19–21) — skeni izvirnika",
        nameEn: "dLib: Domoljub, vol. 28, 1898 (nos. 14–17, 19–21) — scans of the original",
        sourceType: "arhiv",
        license: "javna last",
        url: "http://www.dlib.si/?URN=URN:NBN:SI:DOC-VMHV8D26",
        noteSi:
          "Digitalizirani izvodi revije (7 zvezkov: VMHV8D26, NTBTE8XR, DF9FXOUJ, WFWJGHBH, B9S5HH4Z, E2998DOJ, JYAMM6P5); dLib strežniki za ta zapis peskovniško nedostopni — sken strani z omembo TO_COLLECT.",
        noteEn:
          "Digitised issues of the journal (7 volumes: VMHV8D26, NTBTE8XR, DF9FXOUJ, WFWJGHBH, B9S5HH4Z, E2998DOJ, JYAMM6P5); dLib servers unreachable from the sandbox for this record — page scan with the mention TO_COLLECT.",
      },
      {
        key: "wiki-domoljub-casnik",
        nameSi: "Wikipedija: Domoljub (časnik) — okvir objave",
        nameEn: "Wikipedia: Domoljub (newspaper) — the frame of publication",
        sourceType: "spletni-vir",
        license: "CC BY-SA 4.0",
        url: "https://sl.wikipedia.org/wiki/Domoljub_(%C4%8Dasnik)",
        noteSi:
          "Ljubljana 1888–1944; do 1906 dvakrat mesečno; sprva priloga Slovenca, od 1897 samostojno — revija, ki je gribeljsko zgodbo 1898 razdelila na sedem zvezkov »slovenskemu ljudstvu v poduk in zabavo«.",
        noteEn:
          "Ljubljana 1888–1944; twice monthly until 1906; first a supplement of Slovenec, independent from 1897 — the journal that divided the Griblje tale of 1898 into seven instalments 'for the instruction and amusement of the Slovene people'.",
      },
    ],
  },
];

export const seedStories: Omit<StoryDTO, "id">[] = ['''
)
mc = rep(mc, '''];

export const seedStories: Omit<StoryDTO, "id">[] = [''', MVG109, 1, "mvg109-vstavi")

# ---------- 6) Sprehod "Kruh, platno in vino": postaja po vino-in-crnina ----------
WALK_STOP = '''      {
        exhibitSlug: "bridke-izkusnje-1898",
        noteSi:
          "Šestnajst let pred Kostanjevčevo šolo je gribeljsko gostilno v svet nesel drugo pero — pod psevdonimom Pivčan. »Najpremožnejši je v vasi, in gostilna slovi daleč na okoli. Z vinom trguje po vsem Hrvaškem in Slavoniji.« Vino, ki je po tej pripovedi teklo iz vasi na trg, teče tudi po tej poti.",
        noteEn:
          "Sixteen years before Kostanjevec's school, another pen carried the Griblje inn into the world — under the pseudonym Pivčan. 'The richest man in the village, and the inn famed far around. He trades wine across all Croatia and Slavonia.' The wine that, by that tale, flowed from the village to market flows along this walk too.",
      },'''
wk = rep(wk, '''      {
        exhibitSlug: "vino-in-crnina",''', WALK_STOP + '''\n      {
        exhibitSlug: "vino-in-crnina",''', 1, "sprehod-postaja")

# ---------- verifikacije ----------
SRC_AFTER = len(re.findall(r'key: "', mc))
EXH_AFTER = len(re.findall(r'museumNo: "MVG-\d{3}"', mc))
if SRC_AFTER != SRC_BEFORE + 4: raise SystemExit(f"FAIL: virov po={SRC_AFTER}, pričakovano {SRC_BEFORE+4}")
if EXH_AFTER != EXH_BEFORE + 1: raise SystemExit(f"FAIL: zapisov po={EXH_AFTER}, pričakovano {EXH_BEFORE+1}")
if 'bridke-izkusnje-1898' not in wk: raise SystemExit("FAIL: postaja ni v walks.ts")
if re.search(r'storySi:\n      "[^"]*\n[^"]*"', mc.split("bridke-izkusnje-1898")[1].split("storyEn:")[0]):
    raise SystemExit("FAIL: storySi vsebuje realno novo vrstico")

io.open(MC, "w", encoding="utf-8", newline="").write(mc)
io.open(WK, "w", encoding="utf-8", newline="").write(wk)
print(f"OK: zapisi 108→{EXH_AFTER}, viri 537→{SRC_AFTER}, postaja dodana.")
