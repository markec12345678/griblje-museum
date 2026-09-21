# Val 14 (62. sklop) — SEM 100 % enumeriran + trije videi Vašega kanala

**Datum:** 2026-09-21 · **Naročilo:** »nadaljuj kjer si ostal« (14. val muzejske raziskave po slovenskih muzejih/zbirkah; obvezen dedup proti bazi 101/482/379/94)

## Metoda
- **Spletno iskanje** (z-ai web_search): 13 poizvedb — site:muzej.si Griblje, Europeana, PMM zbirka, RKD, dLib, SEM etnografska zbirka, EŠD register, franciscejski kataster, muzejski vestnik, arhivi, obrazi slovenskih pokrajin, film/RTV arhiv, YouTube zadetki.
- **Direktno pridobivanje:** SEM lokacijska stran `etno-muzej.si/sl/digitalne-zbirke/lokacije/griblje` (curl z brskalnim UA) → **celoten seznam SEM predmetov za Griblje**; trije zapisi preneseni + tri fotografije vizualno preverjene.
- **YouTube:** oEmbed API (oEmbed je deluje brez prijave; watch strani za avtomatizirani dostop preusmerjene na bot-preverbo; innertube ANDROID zahteva prijavo) → potrditev naslovov/kanalov štirih videov; datumi po iskalnih opisih in programski napovedi radio.brezice.eu.
- Surovine: `raw-web-val14-2026-10/` (17 datotek: iskanja, SEM strani, SEM slike, YouTube iskanje, oEmbed odgovori).

## PRELOM 1: SEM fond za Griblje 100 % enumeriran (5/5)
Lokacijska stran SEM digitalnih zbirk za Griblje razlaga **natančno pet predmetov** — in vsi pet je zdaj dokumentiranih v muzeju:

| inv. št. | vsebina | status |
|---|---|---|
| F0000182 | Belokranjska hiša z gospodarskim poslopjem (avtor neznan) | že vir MVG-017 |
| **F0000183** | Hiša, Griblje — kokoši na dvorišču (klasifikacija: hiša / perutninarstvo / vsakdanja noša) | **NOV vir MVG-017** |
| **F0000212** | Enonadstropna hiša na pero — **rojstna hiša dr. Nika Županiča** (klasifikacija: hiša / praznična noša / etnologi) | **NOV vir MVG-010** |
| **F0000838** | Ženska vsakdanja kmečka noša, ~1920 — **avtor verjetno Niko Županič** (klasifikacija: ovčereja / vsakdanja noša; datum SEM 1. 1. 1920) | **NOV vir MVG-079** |
| F0001407 | Hiša, Griblje (Drago Vahtar, 1. 4. 1928) | že vir MVG-017 |

(n0014096.jpg = datoteka slike zapisa F0000838, ni ločen predmet.)

**Pomeni:**
- SEM — muzej, ki ga je ustanovil rojenčko Gribelj Niko Županič — ima za rojstno vas **pet predmetov**, in muzej jih od zdaj prikazuje vse.
- **F0000212 = prva poznana fotografija rojstne hiše** najslavnejšega gribeljskega domakovinca (na posnetku hiša z leseno galerijo, človek na klopci, sveže razžagani hlodi). TO_COLLECT: hišna številka, ali stoji še.
- **F0000838 = fotografija etnologa kot fotografa lastne vasi**: dve ženski v belih vsakdanjih nošah z zavezanimi rutami pred hišo, pri nogah ovce; SEM avtorstvo pripisuje z »verjetno« — atribucija v viru izrecno označena kot nedokončna (iskrenost pred postavitvijo).
- Slikovna pravila zadržana: SEM fotografije imajo avtorske pravice SEM (ZASP, uporaba dokumentarnega gradiva po dogovoru) — zato **viri, ne prikazne slike** (dosledno s prakso vala 1); prikazne slike ostajajo javno-lastne/CC (Vavpotičev portret, Vurnikova peča, adlešičska hiša Vesela).

## PRELOM 2: trije videi Vašega kanala (YouTube) + datum
YouTube iskanje po »mrliška vežica Griblje« je razkrilo štiri gribeljske videe; trije so preverljivi z datumom in vsebino po naslovu/iskalnem opisu/oEmbed:

| video | kanal | datum | vgradnja |
|---|---|---|---|
| »Nova mrliška vežica v Gribljah« (AcXevMiKHZ0) | Vaš Kanal | 18. 2. 2013 | MVG-002 sveti-vid — predaja vežice; cerkev + pokopališče + vežica = zadnji koledar vasi |
| »V Gribljah kuhali pasulj« (28NGiJsNzkk) | Vaš Kanal | 5. 8. 2019 (arhiv.vaskanal.com »ustvarjeno 5. 8. 2019 19:28«) | MVG-041 pasuljada — **16. izvedba**; po datumu najstarejši videodokument pasuljade med viri |
| »V Gribljah so se poklonili Francu Brincu« (mtkw2lEQVrc) | Vaš Kanal | v eter 17. 4. 2026 (radio.brezice.eu) | MVG-042 franc-brinc — 91. rojstni dan; **drugi poročevalec** istega dogodka kot dl-brinc-91 (dedup odločitev: vir vseeno dodan — druga vrsta, video, in citirljiv URL; prekrivanje izrecno v opombi) |
| »Griblje 2019« (HOn5QP_NM14) | DOZIS Dolenjske in Bele krajine | ? | NE vgrajen — vsebina po oEmbed nepotrjenа (watch strani za avtomatizirani dostop blokirane) → TO_COLLECT |

## Dedup (obvezen)
- **muzej.si / Europeana / RKD / muzejski vestnik / arhivi / obrazi:** brez novih gribeljskih vsebin (RKD: 0 zadetkov za site: query; dLib zadetek nerelevanten — Hamer medicinska knjiga, URL = domača stran).
- **Instagram objava Občine Črnomelj »V Gribljah slovesno« (DZ7pevXDEU1):** **že vir** baze (dedup ✓).
- SEM: F0000182/F0001407 že vira; lokacijska stran = nova pot, ne podvojen predmet.
- Kupski manevri 1937, pasuljada 2017, kmečke žene: stanja iz sklopa 61 potrjena, sprememb ni.
- Ponovljene blokade: arhiv.vaskanal.com Cloudflare (kot val 7), YouTube watch/innertube prijavna stena, SIstory, Družina.

## VGRADNJA (add-only, +6 virov: 482→488, identitet 379→385; 101 zapisov / 94 entitet nespremenjeno)
1. MVG-017 +`sem-f0000183` + odstavek 4 zgodbe razširjen (dve → tri fotografije; kokoši = perutninarstvo)
2. MVG-010 +`sem-f0000212` + nov odstavek (rojstna hiša kot fotografiran kraj; SEM fond za Griblje = 5 predmetov, v celoti viden)
3. MVG-079 +`sem-f0000838` + nov odstavek (vsakdanja podoba; etnolog kot fotograf; išče še imena žensk)
4. MVG-002 +`yt-mrliska-veznica-2013` + nov odstavek (vežica 2013; cerkev + pokopališče + vežica)
5. MVG-041 +`vk-pasulj-2019` + nov odstavek (16. pasuljada; najstarejši videodokument)
6. MVG-042 +`vk-brinc-poklon-2026` + nov odstavek (91. rojstni dan; drugi poročevalec — prekrivanje izrecno)

## TO_COLLECT (posodobljeno)
- **katera hiša »na pero« je rojstna hiša Županiča** (hišna številka; ali stoji še) — prvič konkretno
- **imena žensk na SEM F0000838** (vsakdanja noša ~1920)
- videodokument »Griblje 2019« (DOZIS @Tisina1956) — vsebina nepotrjena
- posnetek gribeljske jurjevske pesmi (iz vala 13, ostaja)
- SŠM mapa šole Griblje; arheologija 2012/2023 podrobna poročila; imena kajdarjev (MVG-096)

## Regresija (živi :3000)
tsc 0 · eslint čist · verify-i18n 930×5 · audit-entities ✓ (94, 0 napak) · audit-timeline-map 39 ✓/0 (488) · audit-iiif-annotations 5 ✓/0 (372/372) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · reseeda (izrecni DATABASE_URL) → OpenData **101/488** živo · konstante usklajene (488/385 v 5 skriptah).

**Stanje: 101 zapisov (MVG-001–101), 488 virov, 385 identitet, 54 deljenih, 94 entitet; sitemap 102.**
