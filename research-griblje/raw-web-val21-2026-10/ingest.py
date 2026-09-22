# -*- coding: utf-8 -*-
"""VAL 21 — vgradnja: 3 novi zapisi + 6 add-only virov + 3 popravki datumov.
Programska zamenjava (MultiEdit NI atomaren) z strogimi preverbami.
"""
import sys

F = "/home/z/my-project/src/lib/museum-content.ts"
h = open(F, encoding="utf-8").read()
orig = h

def rep(old, new, label, allow_done=False):
    global h
    n = h.count(old)
    if n == 0 and allow_done and new in h:
        print(f"SKIP [{label}] (že aplicirano)")
        return
    if n != 1:
        print(f"FAIL [{label}]: pojavitev={n} (pričakovano 1)")
        sys.exit(1)
    h = h.replace(old, new)
    print(f"OK   [{label}]")

# ============ 1) TRIJE NOVI ZAPISI (za ]; in seedStories) ============
NEW_RECORDS = r'''  {
    slug: "poljsko-lokostrelstvo",
    museumNo: "MVG-106",
    category: "sege",
    addedAt: "2026-09-22",
    titleSi: "Poljsko lokostrelstvo — državno prvenstvo na gribeljskih poljih",
    titleEn: "Field archery — the national championship on the Griblje fields",
    periodSi: "2013 → 2016 · štiri sezone državnega prvenstva",
    periodEn: "2013 → 2016 · four seasons of the national championship",
    summarySi:
      "Lokostrelsko društvo Krasinec je v sodelovanju z Lokostrelsko zvezo Slovenije štiri sezone zapored prirejalo državno prvenstvo v poljskem lokostrelstvu na gribeljskih poljih — poročilo Vašega kanala o januarskem prvenstvu 2016 zabeleži že četrto zaporedno sezono. Vas ob Kolpi je postala državni oder tihih lokov in poljskih tarč.",
    summaryEn:
      "The Krasinec Archery Society, in cooperation with the Archery Association of Slovenia, held the national field-archery championship on the Griblje fields for four seasons in a row — Vaš kanal's report on the January 2016 championship records the fourth consecutive season. The village on the Kolpa became a national stage of quiet bows and field targets.",
    storySi:
      "Januarsko jutro 2016 je na gribeljskih poljih dišalo po zmrzali in lesu lokov. »V Gribljah so se minulo soboto zbrali uspešni slovenski lokostrelci. Potekalo je namreč državno prvenstvo v poljskem lokostrelstvu, ki ga je v sodelovanju z Lokostrelsko zvezo Slovenije že četrto leto zapored pripravilo Lokostrelsko društvo Krasinec,« je 11. januarja 2016 zapisal Vaš kanal — regionalna televizija, ki je prvenstvo tudi posnel. »Minula sobota« je bila devetega januarja; četrto leto zapored pa šteje od leta 2013: gribeljska polja so bila štiri sezone državni teren poljskega lokostrelstva.\n\nPoljsko lokostrelstvo je lokostrelska disciplina na naravnem terenu — tarče v hribih, med drevesi in po travnikih, kjer ne gre le za natančnost, ampak tudi za poznavanje prostora: vetra, oddaljenosti in svetlobe. Prav to je gribeljska pokrajina ponujala obilno: valovita polja nad Kolpo, ki so poleti travniki in njive, pozimi pa odprti oder z jasnimi pogledi. Organizator iz sosednjega Krasinca je prinesel zvezo in sodnike, vas je dala teren — sodelovanje, ki je vaški koledar vsako zimo za štiri sezone raztegnilo čez državo.\n\nMuzej išče: rezultate prvenstev in imena lokostrelcev, fotografije terena in tarč, poročila Lokostrelske zveze Slovenije; ter odgovor na vprašanje, ali prvenstvo na gribeljskih poljih še živi — in kdo je bil organizator na vaški strani.",
    storyEn:
      "A January morning in 2016 on the Griblje fields smelled of frost and bow wood. 'In Griblje, successful Slovenian archers gathered last Saturday. It was the national field-archery championship, which the Krasinec Archery Society, in cooperation with the Archery Association of Slovenia, had organised for the fourth year in a row,' Vaš kanal wrote on 11 January 2016 — the regional television also filmed the championship. 'Last Saturday' meant 9 January; 'the fourth year in a row' counts back to 2013: for four seasons the Griblje fields were the national terrain of field archery.\n\nField archery is the discipline of natural terrain — targets in hills, among trees and across meadows, where what matters is not only precision but knowing the ground: the wind, the distances, the light. And this is exactly what the Griblje landscape offered in abundance: rolling fields above the Kolpa, in summer meadows and fields, in winter an open stage with clear sightlines. The organiser from neighbouring Krasinec brought the federation and the judges, the village gave the terrain — a cooperation that stretched the village's calendar across the nation for four winters.\n\nThe museum seeks: the championship results and the archers' names, photographs of the course and targets, the reports of the Archery Association of Slovenia; and an answer to the question of whether the championship on the Griblje fields is still alive — and who the organiser on the village side was.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 2013,
    yearTo: 2016,
    featured: false,
    sources: [
      {
        key: "vk-lokostrelstvo-2016",
        nameSi: "Vaš kanal: Pomerili so se v poljskem lokostrelstvu (TV-poročilo 11. 1. 2016)",
        nameEn: "Vaš kanal: They competed in field archery (TV report, 11 Jan 2016)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/23460-pomerili-so-se-v-poljskem-lokostrelstvu.html",
        noteSi:
          "»Državno prvenstvo v poljskem lokostrelstvu, ki ga je v sodelovanju z Lokostrelsko zvezo Slovenije že četrto leto zapored pripravilo Lokostrelsko društvo Krasinec« — poročilo 11. 1. 2016 o prvenstvu »minulo soboto« (9. 1.); video KfMyGn9TI7o. »Četrto leto zapored« izpelje začetke v 2013 (datum arhiva Vašega kanala, delavsko usklajen).",
        noteEn:
          "'The national field-archery championship, which the Krasinec Archery Society, in cooperation with the Archery Association of Slovenia, had organised for the fourth year in a row' — the report of 11 Jan 2016 on the championship held 'last Saturday' (9 Jan); video KfMyGn9TI7o. 'The fourth year in a row' derives the beginnings in 2013 (date from the Vaš kanal archive, weekday-consistent).",
      },
    ],
  },
  {
    slug: "komasacija-agromelioracije",
    museumNo: "MVG-107",
    category: "gospodarstvo",
    addedAt: "2026-09-22",
    titleSi: "Komasacija Griblje–Cerkvišče — skoraj 500 hektarjev za eno polje",
    titleEn: "Land consolidation Griblje–Cerkvišče — almost 500 hectares for one field",
    periodSi: "2013 → 2015 · od državnega denarja do pogodbe za agromelioracije",
    periodEn: "2013 → 2015 · from state funding to the agromelioration contract",
    summarySi:
      "Julija 2013 je občina Črnomelj na razpisu ministrstva za kmetijstvo pridobila dobrih 650.000 evrov za izvedbo komasacij na območjih Griblje–Cerkvišče in Dragatuško polje — skupaj skoraj 500 hektarjev, ki jih je Vaš kanal imenoval belokranjska Panonska nižina. Septembra 2015 je sledil podpis pogodbe za agromelioracije na obeh območjih.",
    summaryEn:
      "In July 2013 the Municipality of Črnomelj secured just over 650,000 euros from a ministry call for land consolidations in the Griblje–Cerkvišče and Dragatuško polje areas — together almost 500 hectares, which Vaš kanal called the Bela krajina Pannonian plain. In September 2015 the contract for agromeliorations on both areas followed.",
    storySi:
      "Petek, 26. julij 2013: Vaš kanal poroča, da je »občina Črnomelj uspela na razpisu ministrstva za kmetijstvo in okolje pridobiti dobrih 650 tisoč evrov za izvedbo komasacij na dragatuškem polju in na območju Griblje-Cerkvišče« — občina se je prijavila tudi na razpis za izvedbo agromelioracije na obeh komasacijskih območjih. Skupaj gre za skoraj 500 hektarjev zemljišč na območjih, ki jim poročevalec prizanaši poimenovanje, ki ga nosi z notranjim ponosom: »območja, ki veljajo za belokranjsko Panonsko nižino«.\n\nKomasacija je zložitev razdrobljenih kmetijskih zemljišč: lastniki zamenjajo številne drobne njive različnih oblik in lastnikov za bolj celovite parcele z urejenim dostopom. Dve leti pozneje, 21. septembra 2015, Vaš kanal poveže napoved z dejanjem: »Občina Črnomelj je že lani pristopila k izvedbi dveh obsežnih komasacij«, zdaj pa je sledil podpis pogodbe za agromelioracije — naslednja stopnja preurejanja, ureditev površin za sodobno kmetovanje. Posnetek poročila hrani video qVK-qmUWfmg.\n\nZa vas, katere polja nad Kolpo so stoletja gojila žbul in hranila mline, je to tiho poglavje kmetijske modernizacije — ne razglašeno, ampak podpisano. Muzej išče: komasacijski načrt z mejami območja Griblje–Cerkvišče, fotografije del, pričevanja kmetov o preurejenih parcelah — katera njiva je bila zdaj prvič en kos.",
    storyEn:
      "Friday, 26 July 2013: Vaš kanal reports that 'the Municipality of Črnomelj succeeded in a call of the Ministry of Agriculture and the Environment in securing just over 650 thousand euros for the execution of land consolidations in the Dragatuško polje and Griblje-Cerkvišče areas' — the municipality also applied for the execution of agromelioration on both consolidation areas. Together this concerns almost 500 hectares of land in areas the reporter names with an inner pride: 'areas regarded as the Bela krajina Pannonian plain'.\n\nLand consolidation is the amalgamation of fragmented agricultural land: owners exchange numerous small fields of varied shapes and owners for more coherent parcels with arranged access. Two years later, on 21 September 2015, Vaš kanal connects the announcement with the deed: 'the Municipality of Črnomelj already last year approached the execution of two extensive land consolidations', and now the signing of the contract for agromeliorations followed — the next stage of reordering, the arrangement of surfaces for modern farming. The report is preserved as video qVK-qmUWfmg.\n\nFor a village whose fields above the Kolpa raised žbul onions for centuries and fed mills, this is a quiet chapter of agricultural modernisation — not proclaimed, but signed. The museum seeks: the consolidation plan with the boundaries of the Griblje–Cerkvišče area, photographs of the works, testimonies of farmers about the reordered parcels — which field was now, for the first time, one piece.",
    evidenceStatus: "DOCUMENTED",
    yearFrom: 2013,
    yearTo: 2015,
    featured: false,
    sources: [
      {
        key: "vk-komasacija-2013",
        nameSi: "Vaš kanal: Dobili denar za komasacijo (TV-poročilo 26. 7. 2013)",
        nameEn: "Vaš kanal: Money secured for land consolidation (TV report, 26 Jul 2013)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/18379-dobili-denar-za-komasacijo.html",
        noteSi:
          "»Občina Črnomelj je uspela na razpisu ministrstva za kmetijstvo in okolje pridobiti dobrih 650 tisoč evrov za izvedbo komasacij na dragatuškem polju in na območju Griblje-Cerkvišče. Prijavila pa se je tudi na razpis za izvedbo agromelioracije na obeh komasacijskih območjih.« (datum arhiva Vašega kanala, delavsko usklajen).",
        noteEn:
          "'The Municipality of Črnomelj succeeded in a call of the Ministry of Agriculture and the Environment in securing just over 650 thousand euros for the execution of land consolidations in the Dragatuško polje and Griblje-Cerkvišče areas. It also applied for the execution of agromelioration on both consolidation areas.' (date from the Vaš kanal archive, weekday-consistent).",
      },
      {
        key: "vk-agromelioracije-2015",
        nameSi: "Vaš kanal: Podpis pogodbe za agromelioracije (TV-poročilo 21. 9. 2015)",
        nameEn: "Vaš kanal: The agromelioration contract signed (TV report, 21 Sep 2015)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/21950-podpis-pogodbe-za-agromelioracije.html",
        noteSi:
          "»Občina Črnomelj je že lani pristopila k izvedbi dveh obsežnih komasacij na območjih Griblje – Cerkvišče in Dragatuško polje. Gre za skupno skoraj 500 hektarjev zemljišč na območjih, ki veljajo za belokranjsko Panonsko nižino.« Video qVK-qmUWfmg.",
        noteEn:
          "'The Municipality of Črnomelj already last year approached the execution of two extensive land consolidations in the Griblje–Cerkvišče and Dragatuško polje areas. Together this concerns almost 500 hectares of land in areas regarded as the Bela krajina Pannonian plain.' Video qVK-qmUWfmg.",
      },
    ],
  },
  {
    slug: "odkupne-cene-covid",
    museumNo: "MVG-108",
    category: "gospodarstvo",
    addedAt: "2026-09-22",
    titleSi: "Kmet iz Gribelj med epidemijo — »Stanje je porazno«",
    titleEn: "A farmer from Griblje during the epidemic — 'The situation is disastrous'",
    periodSi: "februar 2021 · priča o kmečkem letu pod covidom",
    periodEn: "February 2021 · a testimony of the farming year under COVID",
    summarySi:
      "Februarja 2021 je Vaš kanal v prispevku o kmetijskih odkupnih cenah med epidemijo covida-19 posnel tudi kmeta iz Gribelj: odkupne cene so prenizke in v mnogih primerih ne pokrijejo več niti stroškov pridelave. »Stanje je porazno,« je dejal — priča, ki je status zapisa, ne naslova.",
    summaryEn:
      "In February 2021, in its report on agricultural purchase prices during the COVID-19 epidemic, Vaš kanal also filmed a farmer from Griblje: purchase prices are too low and in many cases no longer even cover the costs of production. 'The situation is disastrous,' he said — a testimony, which is this record's status, not its title.",
    storySi:
      "Sreda, 24. februar 2021, drugi val epidemije: Vaš kanal odda prispevek »Kmete skrbijo nizke odkupne cene« — dateline NOVO MESTO, GRIBLJE. »Med epidemijo covida-19 v kmetijskih organizacijah opozarjajo, da so odkupne cene kmetijskih surovin prenizke in v mnogih primerih ne pokrivajo več niti stroškov pridelave, maloprodajne cene pa se zvišujejo. Stanje je porazno, nam je potrdil kmet iz Gribelj v Beli krajini.« Kmet pred kamero pove še svojo oceno: nekaj bo treba narediti, da bodo lahko manjše in srednje velike kmetije preživele.\n\nZapis ima v tej zbirki status TESTIMONY: gre za pričevanje enega človeka pred kamero, vira njegovega imena in kmetije pričevanje ne objavi — muzej ga zato ne ugiba in ne poimenuje. Priča pa je dokaj dokumentirana: prispevek je posnetek, ki hrani glas, obraz in kmetijo v ozadju (video PENuY63B2Bs).\n\nGlas kmeta iz Gribelj vstopi v zbirko tam, kjer je njen dolg primerjati začetke s konci: v naselju, kjer je žbul nekoč nosil denar v vas, in kjer so mline gnale Kolpine mlinčke, je tudi najnovejše kmečko leto imelo svoje trge in svoje cene. Muzej išče: pričevalca — če ga prepoznate ali ste ga, se javite; zapis mu bo posvečen z imenom. In fotografije kmetij vasi med epidemijo: prazne tržnice, mleko brez odkupa, seno brez sejma.",
    storyEn:
      "Wednesday, 24 February 2021, the second wave of the epidemic: Vaš kanal broadcasts the report 'Farmers are worried about low purchase prices' — dateline NOVO MESTO, GRIBLJE. 'During the COVID-19 epidemic, agricultural organisations warn that the purchase prices of agricultural raw materials are too low and in many cases no longer cover even the costs of production, while retail prices are rising. The situation is disastrous, a farmer from Griblje in Bela krajina confirmed to us.' The farmer before the camera adds his own assessment: something will have to be done so that smaller and medium-sized farms can survive.\n\nThis record holds the status TESTIMONY in this collection: it is the testimony of one person before the camera, and the source does not publish his name or farm — the museum therefore neither guesses nor names it. The testimony is, however, well documented: the report is a recording that keeps the voice, the face and the farm in the background (video PENuY63B2Bs).\n\nThe farmer's voice from Griblje enters the collection where its duty is to compare beginnings and ends: in a settlement where žbul onions once carried money into the village and the Kolpa's mills ground the grain, the newest farming year, too, had its markets and its prices. The museum seeks: the testifier — if you recognise him or you are him, come forward; the record will be dedicated to him by name. And photographs of the village's farms during the epidemic: empty markets, milk without a buyer, hay without a fair.",
    evidenceStatus: "TESTIMONY",
    yearFrom: 2021,
    yearTo: 2021,
    featured: false,
    sources: [
      {
        key: "vk-odkupne-cene-2021",
        nameSi: "Vaš kanal: Kmete skrbijo nizke odkupne cene (prispevek 24. 2. 2021)",
        nameEn: "Vaš kanal: Farmers are worried about low purchase prices (report, 24 Feb 2021)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://vaskanal.com/kmete-skrbijo-nizke-odkupne-cene/",
        noteSi:
          "»Med epidemijo covida-19 v kmetijskih organizacijah opozarjajo, da so odkupne cene kmetijskih surovin prenizke in v mnogih primerih ne pokrivajo več niti stroškov pridelave, maloprodajne cene pa se zvišujejo. Stanje je porazno, nam je potrdil kmet iz Gribelj v Beli krajini.« Video PENuY63B2Bs; pričevalec anonimen — status zapisa TESTIMONY.",
        noteEn:
          "'During the COVID-19 epidemic, agricultural organisations warn that the purchase prices of agricultural raw materials are too low and in many cases no longer cover even the costs of production, while retail prices are rising. The situation is disastrous, a farmer from Griblje in Bela krajina confirmed to us.' Video PENuY63B2Bs; the testifier is anonymous — the record's status is TESTIMONY.",
      },
    ],
  },
'''

rep("""      },
    ],
  },
];

export const seedStories: Omit<StoryDTO, "id">[] = [""",
"""      },
    ],
  },
""" + NEW_RECORDS + """];

export const seedStories: Omit<StoryDTO, "id">[] = [""",
"3 novi zapisi")

# ============ 2) ADD-ONLY VIRI ============
# MVG-097: kanalizacija 2017 pred dl-cn-2008
rep("""        key: "dl-cn-2008",""",
"""        key: "vk-kanalizacija-2017",
        nameSi: "Vaš kanal: Namenu predali kanalizacijo (TV-poročilo 30. 5. 2017)",
        nameEn: "Vaš kanal: The sewage system handed over for use (TV report, 30 May 2017)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/26203-namenu-predali-kanalizacijo.html",
        noteSi:
          "»Vaščani Gribelj v Beli krajini so zadovoljni. Končno so namreč tudi hiše v Dolnjih Gribljah dobile možnost priključka na fekalno kanalizacijo, ki so jo v njihovem kraju začeli graditi pred več kot desetimi leti.« Video swBrHQ8_Svc; »pred več kot desetimi leti« (2017) se ujame s čistilno napravo 2008.",
        noteEn:
          "'The villagers of Griblje in Bela krajina are satisfied. Finally the houses in Dolnje Griblje, too, have been given the option of connecting to the sewage system, which they began building in their place more than ten years ago.' Video swBrHQ8_Svc; 'more than ten years ago' (2017) matches the 2008 treatment plant.",
        key: "dl-cn-2008",""",
"MVG-097 + kanalizacija-2017")

# MVG-022: oraci 2012 pred wiki-griblje-filak
rep("""        key: "wiki-griblje-filak",""",
"""        key: "vk-oraci-2012",
        nameSi: "Vaš kanal: Najboljši belokranjski orači (TV-poročilo 7. 8. 2012)",
        nameEn: "Vaš kanal: The best Bela krajina ploughmen (TV report, 7 Aug 2012)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/16536-najboljsi-belokranjski-oraci.html",
        noteSi:
          "»Štirinajst belokranjskih oračev, med njimi je bila tudi ena ženska, se je sredi nedeljskega vročega dne pomerilo v oranju« — kontekst tekmovalnega oranja na Belokranjskem, iz katerega so rasli gribeljski prvaki; ali je med tekmovalci tudi Anton Filak, poročilo ne zapiše (datum arhiva Vašega kanala, delavsko usklajen).",
        noteEn:
          "'Fourteen Bela krajina ploughmen, among them one woman, competed in ploughing in the middle of a hot Sunday' — the context of competitive ploughing in Bela krajina from which the Griblje champions grew; whether Anton Filak was among the competitors the report does not say (date from the Vaš kanal archive, weekday-consistent).",
        key: "wiki-griblje-filak",""",
"MVG-022 + oraci-2012")

# MVG-015: ograja v vodi pred commons-meja
rep("""        key: "commons-meja",""",
"""        key: "vk-ograja-voda-2016",
        nameSi: "Vaš kanal: Žičnata ograja v vodi (TV-poročilo 9. 8. 2016, video baY6UuBX_dY)",
        nameEn: "Vaš kanal: The wire fence in the water (TV report, 9 Aug 2016, video baY6UuBX_dY)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/24100-zicnata-ograja-v-vodi.html",
        noteSi:
          "Videodokument žičnate ograje ob Kolpi, poletje 2016 — naslov poročila je v sliko zapisal svojo pričo: ograja, postavljena ob reki 2015/2016, jo je voda poletja 2016 poznala po svoje (datum arhiva Vašega kanala, delavsko usklajen).",
        noteEn:
          "A video document of the wire fence on the Kolpa, summer 2016 — the report's title wrote its own testimony into the picture: the fence built by the river in 2015/2016, as the water of the summer of 2016 came to know it (date from the Vaš kanal archive, weekday-consistent).",
        key: "commons-meja",""",
"MVG-015 + ograja-2016")

# MVG-026: muzejska učilnica video + posvet video pred dl-muzejska-ucilnica
rep("""        key: "dl-muzejska-ucilnica",""",
"""        key: "vk-muzejska-ucilnica-2022",
        nameSi: "Vaš kanal: Gribeljska šola ima muzejsko učilnico (TV-poročilo 7. 6. 2022, video iMetbKigZFc)",
        nameEn: "Vaš kanal: The Griblje school has a museum classroom (TV report, 7 Jun 2022, video iMetbKigZFc)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://vaskanal.com/gribeljska-sola-ima-muzejsko-ucilnico/",
        noteSi:
          "Videodokument odprtja muzejske učilnice 2. 6. 2022 — literarni večer »V šoli so spravljene mnoge skrivnosti« kot tretja prireditev v sklopu prireditev ob podpisu pogodbe za gradnjo šole Loka Črnomelj; drugi poročevalec ob Dolenjskem listu.",
        noteEn:
          "A video document of the museum classroom opening of 2 Jun 2022 — the literary evening 'Many secrets are kept in the school' as the third event in the series around the signing of the contract for building the Loka school in Črnomelj; a second reporter alongside Dolenjski list.",
        key: "vk-posvet-dups-2024",
        nameSi: "Vaš kanal: V Gribljah 22. posvet Društva učiteljev podružničnih šol (TV-poročilo 22. 4. 2024, video 3MmQDP1a054)",
        nameEn: "Vaš kanal: In Griblje, the 22nd congress of the Society of Teachers of Branch Schools (TV report, 22 Apr 2024, video 3MmQDP1a054)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://vaskanal.com/v-gribljah-22-posvet-drustva-uciteljev-podruznicnih-sol/",
        noteSi:
          "»Marsikdo se ne zaveda pomena podružničnih šol … V Gribljah je letos potekal že 22. posvet Društva učiteljev podružničnih šol Slovenije.« — državni posvet podružničnih šol v gribeljski šoli, videodokument.",
        noteEn:
          "'Many people are not aware of the significance of branch schools … In Griblje this year the 22nd congress of the Society of Teachers of Branch Schools of Slovenia took place.' — the national congress of branch schools in the Griblje school, a video document.",
        key: "dl-muzejska-ucilnica",""",
"MVG-026 + 2 videa")

# MVG-041: pasuljada 2018 pred vk-pasulj-2019
rep("""        key: "vk-pasulj-2019",""",
"""        key: "vk-pasuljada-2018",
        nameSi: "Vaš kanal: Pasuljada v Gribljah (TV-poročilo 28. 8. 2018)",
        nameEn: "Vaš kanal: The pasuljada in Griblje (TV report, 28 Aug 2018)",
        sourceType: "objava",
        license: "avtorsko delo / copyrighted (navedba)",
        url: "https://arhiv.vaskanal.com/novice/novice/29004-pasuljada-v-gribljah-.html",
        noteSi:
          "Arhivski zapis tekmovanja leta 2018: »Na kopališču v Gribljah v začetku avgusta že 14 let pripravljajo pasuljado« — usklajeno z okvirom začetka okrog 2004; istega poletja je Vaš kanal poročal tudi o komisiji, ki je izbrala vegetarijanski pasulj (6. 8. 2018).",
        noteEn:
          "An archive record of the 2018 competition: 'At the Griblje bathing ground they have been preparing the pasuljada at the beginning of August for 14 years' — consistent with the framework of a beginning around 2004; the same summer Vaš kanal also reported on the jury that chose the vegetarian pasulj (6 Aug 2018).",
        key: "vk-pasulj-2019",""",
"MVG-041 + pasuljada-2018")

# ============ 3) POPRAVKI DATUMOV (idempotentni) ============
rep('nameSi: "Vaš Kanal: Vse o gribeljskem žbulu (video, ~2012)",\n        nameEn: "Vaš Kanal: All about the Griblje žbul (video, ~2012)",',
    'nameSi: "Vaš Kanal: Vse o gribeljskem žbulu (TV-poročilo 8. 8. 2012; video 9N0Y_GAC1og)",\n        nameEn: "Vaš Kanal: All about the Griblje žbul (TV report, 8 Aug 2012; video 9N0Y_GAC1og)",',
    "zbul datum", allow_done=True)
rep('key: "ro-pastirski-2020",\n        nameSi: "Vaš Kanal: Obudili pastirski praznik (video, ~2020)",\n        nameEn: "Vaš Kanal: The shepherds\' feast revived (video, ~2020)",',
    'key: "ro-pastirski-2020",\n        nameSi: "Vaš Kanal: Obudili pastirski praznik (TV-poročilo 11. 7. 2017; video yr8QsY7jRDA)",\n        nameEn: "Vaš Kanal: The shepherds\' feast revived (TV report, 11 Jul 2017; video yr8QsY7jRDA)",',
    "pastirski ro-", allow_done=True)
rep('key: "vk-pastirski-2020",\n        nameSi: "Vaš Kanal: Obudili pastirski praznik (video, ~2020)",\n        nameEn: "Vaš Kanal: The shepherds\' feast revived (video, ~2020)",',
    'key: "vk-pastirski-2020",\n        nameSi: "Vaš Kanal: Obudili pastirski praznik (TV-poročilo 11. 7. 2017; video yr8QsY7jRDA)",\n        nameEn: "Vaš Kanal: The shepherds\' feast revived (TV report, 11 Jul 2017; video yr8QsY7jRDA)",',
    "pastirski vk-", allow_done=True)
rep('nameSi: "Arhiv Vaš kanal (11. julij 2017): srečanje ljubiteljev starodobnih koles na kopališču v Gribljah",\n        nameEn: "The Vaš kanal archive (11 July 2017): a gathering of vintage-bicycle lovers at the Griblje bathing ground",',
    'nameSi: "Arhiv Vaš kanal (8. avgust 2017): srečanje ljubiteljev starodobnih koles na kopališču v Gribljah",\n        nameEn: "The Vaš kanal archive (8 August 2017): a gathering of vintage-bicycle lovers at the Griblje bathing ground",',
    "kolesa datum", allow_done=True)
rep('url: "https://www.arhiv.vaskanal.com/",',
    'url: "https://arhiv.vaskanal.com/novice/novice/27019-ljubitelji-starih-koles-v-gribljah.html",',
    "kolesa URL", allow_done=True)

open(F, "w", encoding="utf-8").write(h)
print(f"\nDONE. Velikost: {len(orig)} -> {len(h)} (+{len(h)-len(orig)} bajtov)")
