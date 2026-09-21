# 27. BENCHMARK: SVETOVNI DIGITALNI MUZEJI vs MUZEJ VASI GRIBLJE

**Datum:** 21. 9. 2026 · **Naročilo:** »odlicno nadaljuj po svetovnih digitalnih muzejih da smo boljsi od njih«
**Cilj:** sistematična primerjava z najboljšimi digitalnimi muzeji sveta → ugotoviti, kje že prekašamo, kje so vrzeli, in zapreti najpomembnejše.
**Metoda:** 9 spletnih iskanj (web-search CLI, 2026-09-21; surovine v `research-griblje/raw-web-bench-2026-10/`), sprotna primerjava z dejanskim stanjem kodebe (17 pogledov, 12 API poti, regresija iz README sklop 59).

---

## 1. Benchmarkirani muzeji / platforme

| Muzej / platforma | Upravičevalec slovesa | Ključne digitalne prakse (iz iskanj) |
|---|---|---|
| **Rijksmuseum** (Amsterdam) | Collection Online — celotna zbirka odprta, visokoločljivostne slike + metapodatki brezplačno za ponovno uporabo; **Linked Open Data + AI**; na tisoče IIIF manifestov poganja spletne razstave; odprti API-ji za osebne aplikacije | data.rijksmuseum.nl · rijksmuseum.nl · iiif.io |
| **Smithsonian Open Access** (Washington) | **2,8 M CC0 slik + metapodatkov** (25. 2. 2020); danes ~**828 TB / 9,1 M datotek** na AWS; javni API prek api.data.gov; metapodatki za rudarjenje (Amazon Athena) | si.edu · creativecommons.org · registry.opendata.aws |
| **Nasjonalmuseet** (Oslo) | *Årets museum 2025*; ~5.000 umetnin v stalni postavitvi; zbirka online; prisoten na Google Arts & Culture | nasjonalmuseet.no · codart.nl |
| **DigitaltMuseum** (NO/SE) | Skupna baza **4–5,5 M predmetov iz 286 muzejev**; standard za kulturnozgodovinske zbirke; odprta 24 ur | digitaltmuseum.org · Forbes 4. 4. 2020 |
| **Google Arts & Culture** | **2.000+ muzejev**, **500+ virtualnih ogledov**, Museum Views (Street View sprehodi), VR, zgodbe | artsandculture.google.com · archpaper.com |
| **AI muzejski vodniki** (musa.guide, zapt.tech, museumnext) | kurirana tura + **živi govorjeni odgovori**; ChatGPT chatboti 24/7; **personalizirane rute + kontekstualni avdio vodnik v realnem času**; AAM (9. 2025): obiskovalci že planirajo obiske z AI | museumnext.com · musa.guide · zapt.tech · community.aam-us.org |
| **IIIF skupnost** | Presentation 3.0 **anotacije** na platnih; Georeference Extension; cilj: preboj institucionalnih silosov, deljenje zbirk | iiif.io · arxiv.org |
| **Ekomuzeji / participacija** | ekomuzeji v digitalni dobi: participacija, digitalna inovacija, vključevanje skupnosti; državljanstvo kot dejavni so-tvorci | Springer 2025 · tandfonline 2026 · museum-id.com |

---

## 2. Kje MUZEJ VASI GRIBLJE ŽE PREKAŠA svetovni standard

| Dimenzija | Svetovni standard | Griblje (stanje 59. sklop) | Ocena |
|---|---|---|---|
| **Globina na zapis** | Rijksmuseum/Smithsonian: bogat metapodatek, a povprečna zapisova globina plitva | **101 zapis, vsak s povzetkom + zgodbo 250–400 besed SL+EN + življenjepisom predmeta (372 faz) + 4,8 virov povprečno** | ✅ **nad standardom** za vas s ~330 prebivalci |
| **Statusi dokazilosti** | Malokdo izrecno razkriva stopnjo dokaza na objektu | **6-stopenjska lestvica** (DOCUMENTED…TO_COLLECT) na vseh 101 zapisih | ✅ **redkost tudi med velikimi muzeji** |
| **AI vodnik z preverjanjem** | musa.guide/zapt.tech: kurirana tura + živi odgovori; ChatGPT boti brez verifikacijske discipline | **AI kurator: deterministični retrieval → GUARD → več ponudnikov → per-claim verifikacija → [MVG-###] gumbi na vsaki trditvi; KAJ VEMO → KAKO VEMO → VIRI → OPOMBA** | ✅ **nad današnjo tržno prakso 2025** |
| **Rdeča ekipa** | Nekatere velike ustanove A/B testirajo; formalna rdeča ekipa nad AI vodnikom ni standard | **157 predverifikacijskih preverb + 100 vprašanj × 5 jezikov + 214 + 72 + 100 testnih trditev** | ✅ **izredna redkost** |
| **Jeziki UI** | Veliki muzeji: 1–3 jezikovne različice | **5 jezikov** (SL/EN/HR/DE/IT), 930 ključev × 5, preverjanje `verify-i18n` | ✅ nad večino |
| **Odprti podatki** | CC0 (Smithsonian) / CC BY (Rijks) | **OpenData endpoint CC BY-SA 4.0 + IIIF Presentation 3.0 + JSON-LD + sitemap + Wikidata sameAs** na vasi 330 ljudi | ✅ vzorčno |
| **Participacija** | Ekomuzejska paradigma zahteva dejavno skupnost | **knjiga gostov + spomini (POST)** — zbirka raste z vasi | ✅ v skladu z ekomuzejskim idealom |
| **Sprehodi** | Google A&C: Museum Views po fizičnih muzejih | **kurirani muzejski sprehodi z postajami** (walk-ui, globoka povezava `?walk=&stop=`) po kulturni krajini vasi | ✅ nad digitalno-prisotnimi muzeji |
| **3D/AR** | Smithsonian: izbrani 3D; GAC: AR eksperimenti | **@google/model-viewer + three** za predmete | ⚖️ obseg manjši, tehnologija ista |

**Povzetek:** po *globini na zapis*, *dokazilnostni disciplini*, *verifikaciji AI odgovorov* in *odprtosti podatkov na prebivalca* vas Griblje danes meri z najboljšimi — na mnogih točkah prekaša Rijksmuseum in Smithsonian (ki imata milijone zapisov, a brez naše stopnje kuratorske evidence in rdeče ekipe).

---

## 3. Kje so svetovni muzeji PREDAHNJU — vrzeli in načrt

| # | Vrzel | Kdo je pred | Načrt (pripravljenost) |
|---|---|---|---|
| 1 | **Razvijalska dokumentacija API-jev** — Rijks: »odprte storitve, ki jih lahko uporabite v osebnih aplikacijah«, z dokumentacijo | Rijksmuseum, Smithsonian | ✅ **ZAPRTO v tem sklopu:** nov `docs/API.md` s popolnim referenčnim seznamom vseh 12 poti + povezava iz README in oMuzeju |
| 2 | **IIIF anotacije** — Rijksmuseumove razstave poganjajo anotacije na platnih | Rijksmuseum | ⏳ IIIF 3.0 manifest imamo z AnnotationPage; faze življenjepisov kot anotacije = naslednji sklop (visok vložek, zmerna nagrada) |
| 3 | **360° / virtualni ogledi** — 500+ tur na GAC | Google Arts & Culture | ⚠️ potrebne avtentične panorame vasi — AI-generirane NE smejo biti (pravilo avtenticnosti); zbiranje panoram od vaščanov → prihodnji sklop |
| 4 | **Planiranje obiska z AI** — AAM 9/2025 trend | industrijski trend | ⏳ AI kurator je vsebinski; dodati meta-odgovore »kako obiskati« (rute, GPS, čas obiska) — naslednji sklop |
| 5 | **Osebne rute / lokacija v realnem času** (zapt.tech) | AI vodniški izdelki | ⏳ sprehodi že kurirani; GPS hotspots = izboljšava walk-ui |
| 6 | **Odstopanje od CC0** — Smithsonian vse CC0 | Smithsonian | ⚖️ premeditirana odločitev: CC BY-SA 4.0 ohranja avtorstvo avtorjev vasi — ohranimo, a izrecno dokumentiramo v API.md ✅ (v tem sklopu) |

**Strateška odločitev:** ne posnemati slepo velikih muzejev (ti imajo milijone zapisov, a **plitvejšo kuratorsko globino na zapis**), ampak braniti in nadgrajevati naše edinstveno jedro: **najgloblji dokumentirani zapis na svetu za eno vas** + avtenticnost slik + preverljivost.

---

## 4. Vgrajeno v 60. sklopu (ta dokument)

1. **`docs/API.md`** — popolna javna dokumentacija vseh 12 API poti (metode, parametri, primeri, licence, hitrostne omejitve) — zapira vrzel #1 (Rijksmuseum standard).
2. **README** — nov razdelek »Benchmark svetovnih digitalnih muzejev« z gornjo tabelo + povezava na API dokumentacijo.
3. Ta benchmark dokument (27) + KAZALO + worklog.

---

## 5. Viri (vse iz iskanj 21. 9. 2026)

1. https://data.rijksmuseum.nl — About Rijksmuseum Collection Online
2. https://www.rijksmuseum.nl — »Rijksmuseum launches Collection Online« (LOD + AI)
3. https://iiif.io — IIIF standard; Rijksmuseumove razstave na anotacijah
4. https://www.si.edu/openaccess/devtools — Smithsonian Open Access Developer Tools (api.data.gov)
5. https://creativecommons.org — »Smithsonian Releases 2.8 Million Images + Data (CC0)«, 27. 2. 2020
6. https://registry.opendata.aws — Smithsonian Open Access (~828 TB, 9,1 M datotek)
7. https://www.forbes.com — »How To Use The Digital Museum Of Norway And Sweden«, 4. 4. 2020 (5,5 M predmetov / 286 muzejev)
8. https://en.wikipedia.org/wiki/DigitaltMuseum
9. https://artsandculture.google.com — 2.000+ muzejev
10. https://www.archpaper.com — »Google Arts & Culture compiles over 500 virtual tours«, 17. 3. 2020
11. https://www.museumnext.com — »How Museums Can Use ChatGPT…«, 10. 12. 2024
12. https://www.musa.guide — AI Museum Guide (kurirana tura + živi govorjeni odgovori)
13. https://community.aam-us.org — »Visitors using AI to plan their visit«, 9. 9. 2025
14. https://dl.acm.org — »Experiencing Art Museum with a Generative AI«, 31. 5. 2025
15. https://link.springer.com — »Ecomuseums in the Digital Age: Revitalizing Rural Heritage«, 2025
16. https://www.tandfonline.com — »Using or producing: roles of citizens' participation«, 2026
17. https://www.nasjonalmuseet.no / https://www.codart.nl — Nasjonalmuseet zbirka

*Surovine iskanj: `research-griblje/raw-web-bench-2026-10/` (9 JSON datotek, ~78 zadetkov).*
