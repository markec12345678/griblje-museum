#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
VAL 23 — atomarna vgradnja: identiteta Pivčana (Anton Vadnal, SBL sbi753104),
popravek letnika (28 → 11 po dLib + Wikisource), napoleonski kontekst,
dLib kanonični metapodatki + strani, +1 vir (sbl-anton-vadnal), +1 entiteta
(person:anton-vadnal), konstante skript.

Načelo 22. vala: rep-strict (vsi old_str morajo obstajati natanko 1×),
vse spremembe zbrane v pomnilniku, WRITE ŠELE NA KONCU — če kateri koli
režim ne uspe, se ne zapiše nič (atomarnost).
"""
import sys
from pathlib import Path

ROOT = Path("/home/z/my-project")
MC = ROOT / "src/lib/museum-content.ts"
EN = ROOT / "src/lib/entities.ts"
AE = ROOT / "scripts/audit-entities.ts"
ATM = ROOT / "scripts/audit-timeline-map.ts"
TCR = ROOT / "scripts/test-curator-red-team.ts"
TE = ROOT / "scripts/test-entities.ts"
TTM = ROOT / "scripts/test-timeline-map.ts"

# (pot, old, new, oznaka)
EDITS: list[tuple[Path, str, str, str]] = []

def add(path: Path, old: str, new: str, label: str):
    EDITS.append((path, old, new, label))

# ===========================================================================
# 1) museum-content.ts — MVG-109
# ===========================================================================

# A/B — letnik 28 → 11 (falsifikacija 22. vala; dLib + Wikisource kanon)
add(MC,
    'periodSi: "1898 · Ljubljana: Domoljub, letn. 28, št. 14–17 in 19–21 · pod psevdonimom Pivčan",',
    'periodSi: "1898 · Ljubljana: Domoljub, letn. 11, št. 14–17 in 19–21 · pod psevdonimom Pivčan (Anton Vadnal)",',
    "periodSi letnik")

add(MC,
    'periodEn: "1898 · Ljubljana: Domoljub, vol. 28, nos. 14–17 and 19–21 · under the pseudonym Pivčan",',
    'periodEn: "1898 · Ljubljana: Domoljub, vol. 11, nos. 14–17 and 19–21 · under the pseudonym Pivčan (Anton Vadnal)",',
    "periodEn letnik")

# C — summarySi
add(MC,
    '"Druga doslej znana književna dogodivščina z Gribljami: pripoved, objavljena pod psevdonimom Pivčan v ljubljanskem poljudnem časopisu Domoljub leta 1898, ki na vaški trg postavi gostilno, trgovino z vinom po Hrvaškem in ognjišče Romov ob Kolpi.",',
    '"Druga doslej znana književna dogodivščina z Gribljami: pripoved, objavljena leta 1898 v ljubljanskem poljudnem časopisu Domoljub pod psevdonimom Pivčan — po Slovenskem biografskem leksikonu Anton Vadnal (1876–1935), duhovnik in pisatelj —, ki na vaški trg postavi napoleonsko pot čez Kočevje, gostilno, trgovino z vinom po Hrvaškem in ognjišče Romov ob Kolpi.",',
    "summarySi")

# D — summaryEn
add(MC,
    '"The second known work of fiction to touch Griblje: a tale published under the pseudonym Pivčan in the Ljubljana popular paper Domoljub in 1898, setting the village inn, a wine trade across Croatia and a Roma campfire by the Kolpa onto the village stage.",',
    '"The second known work of fiction to touch Griblje: a tale published in 1898 in the Ljubljana popular paper Domoljub under the pseudonym Pivčan — per the Slovene Biographical Lexicon Anton Vadnal (1876–1935), a priest and writer — setting the Napoleonic road over Kočevje, the village inn, a wine trade across Croatia and a Roma campfire by the Kolpa onto the village stage.",',
    "summaryEn")

# E/F — letnik v prozi
add(MC,
    "izhajala je v zvezkih 14–17 in 19–21 osemindvajsetega letnika",
    "izhajala je v zvezkih 14–17 in 19–21 enajstega letnika",
    "storySi letnik")

add(MC,
    "it ran across instalments 14–17 and 19–21 of volume twenty-eight",
    "it ran across instalments 14–17 and 19–21 of volume eleven",
    "storyEn volume")

# G — napoleonski kontekst (SL, odstavek o poti)
add(MC,
    "stare ceste iz Kočevske čez Koprivnik v Belo krajino se spustijo ravno sem — k eni od najbolj mejnih vasi dežele. Gostitelj pa je literaren:",
    "stare ceste iz Kočevske čez Koprivnik v Belo krajino se spustijo ravno sem — k eni od najbolj mejnih vasi dežele. Zgodba je postavljena v časa napoleonskih vojn: v besedilu odmeva »požunski mir« (1805), strah pred Francozi in počenjanje po rekrutih — »Zakotnik hodi okoli z biričem in lovci. Kdor more le gibati, mora ž njim« —, tako da gribeljska noč na potovalni poti stoji tik ob vojni Evropi. Gostitelj pa je literaren:",
    "storySi napoleonski")

# L — napoleonski kontekst (EN)
add(MC,
    "The road is real: the old routes from the Kočevsko region across Koprivnik into Bela krajina descend exactly here — to one of the most border-bound villages of the land. The host, however, is literary:",
    "The road is real: the old routes from the Kočevsko region across Koprivnik into Bela krajina descend exactly here — to one of the most border-bound villages of the land. The tale is set in the times of the Napoleonic wars: the text echoes the 'Peace of Pressburg' (1805), the fear of the French and the hunting down of recruits — 'The Zakotnik goes around with a constable and hunters. Whoever can still move must go with them' — so the village night on the travel road stands right at the edge of a Europe at war. The host, however, is literary:",
    "storyEn napoleonski")

# H — odstavek o identiteti (SL) — celoten nadomestek
add(MC,
    "Kdo je bil Pivčan, muzej ne ve. Psevdonim v wikipedistični razlagi ni vezan na znano osebo; Domoljub je objavljal anonimne in psevdonimne domoznanske prispevke. To je vrzel, ki jo ta zapis izrecno priznava: knjiga je dokumentirana (celotno besedilo je prebrano po Wikiviru, izvodi pa digitalizirani v dLibu), objava je izpričana, dogajališče je resnično, avtor pa je ime, ki se je umaknilo. Po opombi Wikivira je besedilo pregledalo več urejevalcev in je brez tipkarskih napak — tisto, kar muzej lahko naredi, je, da ga vrne v vaško zgodbo, kjer je nastalo.",
    "Kdo je bil Pivčan, je zdaj znano. Slovenski biografski leksikon (vnos sbi753104, France Koblar) izrecno izpisuje psevdonim Pivčan ob imenu Anton Vadnal (Vadnjal), duhovnika in pisatelja, rojenega 4. aprila 1876 v Borovnici železniškemu sprevodniku, umrlega 10. februarja 1935 v Šentožboltu pri Trojanah — in iskanje po SBL pokaže, da psevdonim ne pripada nikomur drugemu. Leta 1898, ko je gribeljska povest izhajala, je bil dvaindvajsetletni dunajski študent zemljepisa in zgodovine, ljubljanski gimnazijec — sošolec Otona Župančiča — in sin železniškega sprevodnika; ni čudo, da njegova pripoved potuje po cestah in pošilja voza čez pol dežele. Kot kaplan je pozneje služboval v Višnji Gori, Cerkljah na Dolenjskem in na Krki, od 1928 kot župnik v Šentožboltu; po letu 1929 je bil zaradi nastopa proti centralni diktaturi obsojen na zapor, kjer si je nakopal smrtno bolezen. In še literarna čepljica, ki jo muzej piše kot uganko, ne kot trditev: v sami zgodbi nastopata »dva rojaka, Pivčana«, drvarja, ki opozarjata pred zbiranjem vojakov, eno poglavje pa nosi naslov »Na Pivki« — ali si je avtor nadel ime po likih lastne zgodbe, ostaja odprto. Besedilo je še vedno prebrano po Wikiviru (obdelano do nivoja »100 % pregledano«), izvodi pa digitalizirani v dLibu; Wikisource je identiteto predlagal z vprašajem, SBL pa jo potrdi.",
    "storySi identiteta")

# J — odstavek o identiteti (EN)
add(MC,
    "Who Pivčan was, the museum does not know. The pseudonym is not tied to any known figure; Domoljub published anonymous and pseudonymous local contributions. That is a gap this record openly admits: the tale is documented (the full text read via Wikisource, the issues digitised in dLib), the publication attested, the setting real — while the author remains a name that withdrew. Per the Wikisource note the text was proofread by several editors and is free of typographical errors — and what the museum can do is return it to the village story where it was born.",
    "Who Pivčan was is now known. The Slovene Biographical Lexicon (entry sbi753104, France Koblar) lists the pseudonym Pivčan explicitly beside the name of Anton Vadnal (Vadnjal), a priest and writer born on 4 April 1876 in Borovnica to a railway switchman and dead on 10 February 1935 at Šentožbolt near Trojane — and a search across the Lexicon shows the pseudonym belongs to no one else. In 1898, when the Griblje tale appeared, he was a twenty-two-year-old student of geography and history in Vienna; a Ljubljana gymnasium boy — a schoolmate of Oton Župančič — and a railway switchman's son; small wonder his narrative travels the roads and sends wagons across half the land. As a chaplain he later served at Višnja Gora, Cerklje na Dolenjskem and Krka, and from 1928 as parish priest of Šentožbolt; after 1929 he was imprisoned for speaking against the central dictatorship and contracted the illness that killed him. And one literary footnote, written as a riddle rather than a claim: the tale itself contains 'two kinsmen, Pivčani', loggers warning against the mustering of soldiers, and one chapter is titled 'Na Pivki' (At Pivka) — whether the author took his name from characters of his own tale remains open. The text is still read via Wikisource (proofread to the '100% proofread' level), the issues are digitised in dLib; Wikisource proposed the identity with a question mark, the Lexicon confirms it.",
    "storyEn identiteta")

# I/K — zapora "Muzej išče"
add(MC,
    "Muzej išče: dejansko identiteto Pivčana in datum prve tiskane gostilne v Gribljih (župnijska in hišna knjiga).",
    "Muzej išče: datum prve tiskane gostilne v Gribljih (župnijska in hišna knjiga).",
    "storySi išče")

add(MC,
    "The museum is looking for: the actual identity of Pivčan, and the date of the first recorded inn in Griblje (parish and house registers).",
    "The museum is looking for: the date of the first recorded inn in Griblje (parish and house registers).",
    "storyEn išče")

add(MC,
    'nameSi: "dLib: Domoljub, letn. 28, 1898 (št. 14–17, 19–21) — skeni izvirnika",',
    'nameSi: "dLib: Domoljub, letn. 11, 1898 (št. 14–17, 19–21) — skeni izvirnika",',
    "dLib nameSi letnik")

add(MC,
    'nameEn: "dLib: Domoljub, vol. 28, 1898 (nos. 14–17, 19–21) — scans of the original",',
    'nameEn: "dLib: Domoljub, vol. 11, 1898 (nos. 14–17, 19–21) — scans of the original",',
    "dLib nameEn letnik")

# M — dLib vir: kanonični metapodatki + strani (SL/EN)
add(MC,
    "Digitalizirani izvodi revije (7 zvezkov: VMHV8D26, NTBTE8XR, DF9FXOUJ, WFWJGHBH, B9S5HH4Z, E2998DOJ, JYAMM6P5); dLib strežniki za ta zapis peskovniško nedostopni — sken strani z omembo TO_COLLECT.",
    "Digitalizirani izvodi revije (7 zvezkov z natančnimi stranmi: VMHV8D26 s. 165–168, NTBTE8XR s. 177–179, DF9FXOUJ s. 183–185, WFWJGHBH s. 196–198, B9S5HH4Z s. 220–222, E2998DOJ s. 232–234, JYAMM6P5 s. 243–245). Podrobnostna stran VMHV8D26 preverjena v 23. valu: Domoljub (Ljubljana), 21. 7. 1898, letnik 11, številka 14, založba M. Kolar — datumi zvezkov po Wikisourcevem kazalu: 21. 7.; 4. 8.; 17. 8.; 1. 9.; 6. 10.; 20. 10.; 3. 11. 1898. Sken strani z omembo TO_COLLECT.",
    "dLib note SL")

add(MC,
    "Digitised issues of the journal (7 volumes: VMHV8D26, NTBTE8XR, DF9FXOUJ, WFWJGHBH, B9S5HH4Z, E2998DOJ, JYAMM6P5); dLib servers unreachable from the sandbox for this record — page scan with the mention TO_COLLECT.",
    "Digitised issues of the journal (7 instalments with exact pages: VMHV8D26 pp. 165–168, NTBTE8XR pp. 177–179, DF9FXOUJ pp. 183–185, WFWJGHBH pp. 196–198, B9S5HH4Z pp. 220–222, E2998DOJ pp. 232–234, JYAMM6P5 pp. 243–245). The VMHV8D26 detail page verified in val 23: Domoljub (Ljubljana), 21 Jul 1898, volume 11, issue 14, publisher M. Kolar — instalment dates per the Wikisource index: 21 Jul; 4 Aug; 17 Aug; 1 Sep; 6 Oct; 20 Oct; 3 Nov 1898. Page scan with the mention TO_COLLECT.",
    "dLib note EN")

# N — wikisource vir: letn. 11 + identiteta + datum zvezkov (SL/EN)
add(MC,
    "Vsi citati zapisa (»Bili so na meji«, »Najpremožnejši je v vasi…«, »Z vinom trguje po vsem Hrvaškem in Slavoniji«, »zavije navzdol proti Kolpi«) preverjeni po besedilu; metapodatki: Domoljub 1898 (št. 14–17, 19–21), avtor Pivčan (psevdonim), 100 % pregledano.",
    "Vsi citati zapisa (»Bili so na meji«, »Najpremožnejši je v vasi…«, »Z vinom trguje po vsem Hrvaškem in Slavoniji«, »zavije navzdol proti Kolpi«) preverjeni po besedilu; metapodatki: Domoljub 1898 (letn. 11, št. 14–17 in 19–21), avtor Pivčan (psevdonim; SBL: Anton Vadnal), 100 % pregledano. Kazalo Domoljuba na Wikisourcevu je v 23. valu povedalo tudi datume zvezkov (21. 7.–3. 11. 1898) in prvo povezovalno hipotezo »Pivčan [Anton Vadnal?]«.",
    "wikisource note SL")

add(MC,
    'All the record\'s quotations (\\"Bili so na meji\\", \\"The richest man in the village…\\", \\"He trades wine across all Croatia and Slavonia\\", \\"turns away downhill towards the Kolpa\\") verified against the text; metadata: Domoljub 1898 (nos. 14–17, 19–21), author Pivčan (pseudonym), 100% proofread.',
    'All the record\'s quotations (\\"Bili so na meji\\", \\"The richest man in the village…\\", \\"He trades wine across all Croatia and Slavonia\\", \\"turns away downhill towards the Kolpa\\") verified against the text; metadata: Domoljub 1898 (vol. 11, nos. 14–17 and 19–21), author Pivčan (pseudonym; SBL: Anton Vadnal), 100% proofread. The Wikisource index of Domoljub supplied in val 23 both the instalment dates (21 Jul–3 Nov 1898) and the first linking hypothesis \'Pivčan [Anton Vadnal?]\'.',
    "wikisource note EN")

# O — nov vir sbl-anton-vadnal (za wiki-domoljub-casnik blokom)
VIR = '''      {
        key: "sbl-anton-vadnal",
        nameSi: "Slovenski biografski leksikon: Vadnal, Anton (1876–1935) — identiteta psevdonima Pivčan",
        nameEn: "Slovene Biographical Lexicon: Vadnal, Anton (1876–1935) — the identity of the pseudonym Pivčan",
        sourceType: "objava",
        license: "navedi vir / cite the source",
        url: "https://www.slovenska-biografija.si/oseba/sbi753104/",
        noteSi:
          "Vnos Koblar, France: Vadnal, Anton (1876–1935), SBL 13. zv. (1982): ★ 4. 4. 1876 Borovnica (oče železniški sprevodnik), † 10. 2. 1935 Šentožbolt; poklici pisatelj in duhovnik; psevdonimi izrecno izpisani: A. Komar, Pivčan, Fronetov Fran; gimnazija Ljubljana 1888–96 (sošolec O. Župančiča), dunajski študij zemljepisa in zgodovine 1896–1900, poučevanje na kranjski gimnaziji 1900/1, bogoslovje 1903–6, kaplan Višnja Gora 1906–10, Cerklje na Dolenjskem 1910–21, Krka 1921–24, župni upravitelj nato župnik Šentožbolt od 1928; po 1929 obsojen na zapor zaradi nastopa proti centralni diktaturi. Iskanje SBL po »Pivčan«: psevdonim pripada izključno temu vnosu (23. val: identiteta avtorja MVG-109 rešena).",
        noteEn:
          "The entry Koblar, France: Vadnal, Anton (1876–1935), SBL vol. 13 (1982): born 4 Apr 1876 Borovnica (father a railway switchman), died 10 Feb 1935 Šentožbolt; occupations writer and priest; pseudonyms listed explicitly: A. Komar, Pivčan, Fronetov Fran; gymnasium Ljubljana 1888–96 (schoolmate of O. Župančič), geography and history studies in Vienna 1896–1900, teaching at the Kranj gymnasium 1900/1, theology 1903–6, chaplain Višnja Gora 1906–10, Cerklje na Dolenjskem 1910–21, Krka 1921–24, parish administrator then parish priest of Šentožbolt from 1928; after 1929 imprisoned for speaking against the central dictatorship. An SBL search for 'Pivčan': the pseudonym belongs to this entry alone (val 23: the author's identity of MVG-109 resolved).",
      },'''

add(MC,
    """          "Ljubljana 1888–1944; twice monthly until 1906; first a supplement of Slovenec, independent from 1897 — the journal that divided the Griblje tale of 1898 into seven instalments 'for the instruction and amusement of the Slovene people'.",
      },
    ],""",
    """          "Ljubljana 1888–1944; twice monthly until 1906; first a supplement of Slovenec, independent from 1897 — the journal that divided the Griblje tale of 1898 into seven instalments 'for the instruction and amusement of the Slovene people'.",
      },
""" + VIR + """
    ],""",
    "vir sbl-anton-vadnal")

# ===========================================================================
# 2) entities.ts — person:anton-vadnal (za person:anton-znidersic)
# ===========================================================================
ENT = '''  {
    id: "person:anton-vadnal",
    type: "person",
    role: "subjekt-zapisa",
    labelSi: "Anton Vadnal",
    labelEn: "Anton Vadnal",
    aliases: ["Pivčan", "A. Komar", "Anton Komar", "Fronetov Fran", "Anton Vadnjal"],
    time: {
      labelSi: "4. april 1876 – 10. februar 1935",
      labelEn: "4 April 1876 – 10 February 1935",
      sortKey: 1876,
    },
    note: "Avtor povesti »Bridke izkušnje« (Domoljub 1898, MVG-109) pod psevdonimom Pivčan; duhovnik in pisatelj — SBL sbi753104: ★ 4. 4. 1876 Borovnica (oče železniški sprevodnik), † 10. 2. 1935 Šentožbolt; psevdonimi A. Komar, Pivčan, Fronetov Fran (SBL iskanje: izključno ta vnos); gimnazija Ljubljana 1888–96 (sošolec O. Župančiča), dunajski študij zemljepisa in zgodovine 1896–1900, kaplan Višnja Gora/Cerklje na Dolenjskem/Krka, župnik Šentožbolt od 1928; po 1929 zaprt zaradi nastopa proti centralni diktaturi (23. val: identiteta psevdonima razrešena).",
    evidence: [{ slug: "bridke-izkusnje-1898", sourceIndex: 3 }],
  },'''

add(EN,
    """    note: "Oblikovalec AŽ-panja (Alberti-Žnideršičev panj), ki ga je Konrad Barle razširil po Beli krajini.",
    evidence: [{ slug: "kranjska-sivka", sourceIndex: 3 }],
  },""",
    """    note: "Oblikovalec AŽ-panja (Alberti-Žnideršičev panj), ki ga je Konrad Barle razširil po Beli krajini.",
    evidence: [{ slug: "kranjska-sivka", sourceIndex: 3 }],
  },
""" + ENT,
    "entiteta person:anton-vadnal")

# ===========================================================================
# 3) konstante skript
# ===========================================================================

add(AE,
    'if (srcN === 541) ok("541 vrstic virov"); else err(`vrstic virov: ${srcN}`);',
    'if (srcN === 542) ok("542 vrstic virov"); else err(`vrstic virov: ${srcN}`);',
    "audit-entities viri")

add(AE,
    'if (identities === 429) ok("429 identitet virov (22. val: +4 nova virov, -1 koren slovenska-biografija.si: sbl-zupanic prebrisan na natančno osebno stran sbi915246)"); else err(`identitet: ${identities}`);',
    'if (identities === 430) ok("430 identitet virov (23. val: +1 vir SBL sbi753104 — identiteta psevdonima Pivčan rešena; 22. val: +4 nova virov, -1 koren slovenska-biografija.si)"); else err(`identitet: ${identities}`);',
    "audit-entities identitete")

add(ATM,
    'check("94 entitet", ENTITIES.length === 94, `=${ENTITIES.length}`);',
    'check("95 entitet", ENTITIES.length === 95, `=${ENTITIES.length}`);',
    "audit-timeline-map entitete")

add(ATM,
    'check("541 vrstic virov", sources === 541, `=${sources}`);',
    'check("542 vrstic virov", sources === 542, `=${sources}`);',
    "audit-timeline-map viri")

add(TCR,
    'check(sourceRows === 541, "R0.3 zbirka: 541 vrstic virov", String(sourceRows));',
    'check(sourceRows === 542, "R0.3 zbirka: 542 vrstic virov", String(sourceRows));',
    "red-team R0.3")

add(TCR,
    'check(ENTITY_BY_ID.size === 94, "R0.4 registr: 94 entitet", String(ENTITY_BY_ID.size));',
    'check(ENTITY_BY_ID.size === 95, "R0.4 registr: 95 entitet", String(ENTITY_BY_ID.size));',
    "red-team R0.4")

add(TCR,
    'check(sourceRows === 541, "R16.2 541 vrstic virov");',
    'check(sourceRows === 542, "R16.2 542 vrstic virov");',
    "red-team R16.2")

add(TCR,
    'check(ENTITY_BY_ID.size === 94, "R16.3 94 entitet registra");',
    'check(ENTITY_BY_ID.size === 95, "R16.3 95 entitet registra");',
    "red-team R16.3")

add(TE,
    'check(SOURCE_USAGE.size === 429, `T8.6 429 identitet virov (${SOURCE_USAGE.size})`);',
    'check(SOURCE_USAGE.size === 430, `T8.6 430 identitet virov (${SOURCE_USAGE.size})`);',
    "test-entities T8.6")

add(TE,
    'check(srcRows === 541, `T8.11 541 vrstic virov (${srcRows})`);',
    'check(srcRows === 542, `T8.11 542 vrstic virov (${srcRows})`);',
    "test-entities T8.11")

add(TE,
    'check(od.counts?.exhibits === 109 && od.counts?.sources === 541, `T9.3 OpenData: 109 zapisov / 541 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
    'check(od.counts?.exhibits === 109 && od.counts?.sources === 542, `T9.3 OpenData: 109 zapisov / 542 virov (${od.counts?.exhibits}/${od.counts?.sources})`);',
    "test-entities T9.3")

add(TE,
    'check(withKey === 541 && totalRows === 541, `T9.4 OpenData sourceKey 541/541 (${withKey}/${totalRows})`);',
    'check(withKey === 542 && totalRows === 542, `T9.4 OpenData sourceKey 542/542 (${withKey}/${totalRows})`);',
    "test-entities T9.4")

add(TTM,
    'check(SOURCE_USAGE.size === 429, "T7.3 429 identitet virov (22. val: +4 nova virov, -1 koren slovenska-biografija.si — sbl-zupanic na sbi915246)", `=${SOURCE_USAGE.size}`);',
    'check(SOURCE_USAGE.size === 430, "T7.3 430 identitet virov (23. val: +1 vir SBL sbi753104 — identiteta Pivčana rešena; 22. val: -1 koren slovenska-biografija.si)", `=${SOURCE_USAGE.size}`);',
    "test-timeline-map T7.3")

# ===========================================================================
# REP-STRICT validacija, nato atomaren write
# ===========================================================================
bufs: dict[Path, str] = {}
for p, old, new, label in EDITS:
    if p not in bufs:
        bufs[p] = p.read_text(encoding="utf-8")
    n = bufs[p].count(old)
    if n != 1:
        print(f"FAIL [{label}]: old string najden {n}× v {p.name} (pričakovano 1×) — NIČ NI ZAPISANO")
        sys.exit(1)
    bufs[p] = bufs[p].replace(old, new, 1)

# statične kontrole pred zapisom
mc = bufs[MC]
checks = [
    ('sbl-anton-vadnal' in mc, 'vir sbl-anton-vadnal v museum-content'),
    ('letn. 28' not in mc and 'vol. 28' not in mc, 'letnik 28 popolnoma izčiščen'),
    ('osemindvajsetega letnika' not in mc, 'osemindvajsetega letnika izčiščeno'),
    ('volume twenty-eight' not in mc, 'volume twenty-eight izčiščeno'),
    ('letn. 11' in mc and 'vol. 11' in mc, 'letnik 11 prisoten'),
    (mc.count('key: "sbl-anton-vadnal"') == 1, 'natanko 1 nov vir'),
    ('person:anton-vadnal' in bufs[EN], 'entiteta v entities'),
    (bufs[EN].count('id: "person:anton-vadnal"') == 1, 'natanko 1 nova entiteta'),
    ('=== 542' in bufs[TE] and '=== 430' in bufs[TE], 'konstante test-entities'),
    ('=== 95' in bufs[TCR] and '=== 542' in bufs[TCR], 'konstante red-team'),
    ('=== 430' in bufs[TTM], 'konstante test-timeline-map'),
    ('542 vrstic' in bufs[AE] and '430 identitet' in bufs[AE], 'konstante audit-entities'),
]
for ok, label in checks:
    if not ok:
        print(f"FAIL static: {label} — NIČ NI ZAPISANO")
        sys.exit(1)

# števec virov: vrstice virov (key: na 8 presledkih) mora biti 542
n_sources = mc.count('        key: "')
if n_sources != 542:
    print(f"FAIL: vrstice virov = {n_sources}, pričakovano 542 — NIČ NI ZAPISANO")
    sys.exit(1)

# števec entitet: id: "..." v entities.ts mora biti 95
import re
n_ent = len(re.findall(r'\n    id: "(?:person|place|event|time):', bufs[EN]))
if n_ent != 95:
    print(f"FAIL: entitete = {n_ent}, pričakovano 95 — NIČ NI ZAPISANO")
    sys.exit(1)

for p, txt in bufs.items():
    p.write_text(txt, encoding="utf-8")
    print(f"WROTE {p.name}")

print(f"OK: {len(EDITS)} urejanj čez {len(bufs)} datotek; virov 542, entitet 95")
