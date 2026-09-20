# 17. Muzejska raziskava 3 — tretji val po slovenskih virih (sklop 49)

Datum: 2026-09-20 · Metoda: dedup add-only nad 95 zapisov / 92 entitetami / 429 virov (stanje po 48. sklopu)

## 1. Namen

Tretji val raziskave po uporabnikovem naročilu (»isci griblje po slovenskih online muzejih ... osredotočen bodi samo v griblje«, nato »pushaj sinhroniziraj readme kode github in nadaljuj«). Poudarek: neizkoriščene sledi iz digestov prejšnjih valov + poskus rešitve odprtih TO_COLLECT postavk.

## 2. Potek raziskave

- Dedup-pregled digestov 46/47/48: okupacijskemeje.si (Google navedba o šoli 1942), ARHEOLOGIJA 2012/2023 (zbornika), Attemsova vizitacija 1771 (Grible), cox.si (Andrič — sum na duplikat), svobodnabeseda.si (Stariha), GeisKD (cerkev EŠD), iza2.zrc-sazu.si (bibliografija ARHAT 2021).
- Pridobivanje strani: okupacijskemeje.si (celotna razstava SL+EN, 71+8 strani; poglavji exh04-ch02 in exh04-ch05 z Griblji; CIP/kolofon), OJS ZRC SAZU (Volčjak 2019, DOI 10.3986/ahas.v24i1.7586; PDF 5,5 MB + pdftotext; stran 148, opomba 265), arheologija.si/arnes (nosilni strani zbornikov), Commons API (iskanja + metapodatki slike Slap in malenca na Kolpi pri Gribljah).
- Iskanja: z-ai web_search (10+ poizvedb: Attems, Volčjak/OJS, Križnar film, Weiss Griblach, monografija Neumarkt–Möttling–Metlika, razglednice, krajevni leksikon, Valvasor) — surovine v k49/*.json.
- Blokirano/neoverljeno: upload.wikimedia.org (429 CDN blokada IP — slika malence ni prenesena), dLib.si (timeout — znano iz 48. sklopa), Google Books API (429 kvota), academia.edu (challenge), researchgate.net (temporarily unavailable), DDG/Bing (anomaly/blokada).

## 3. Vgrajeno (add-only, 1 zapis + 5 virov + 1 postaja sprehodov)

### MVG-096 precanje-pri-gribljih — Kolpa se zavije pri Gribljih (TESTIMONY)
- Vir: intervju Jožef Klepec iz Krasinca, razstava Okupacijske meje 1941–1945 (INZ), poglavje »Življenje ob meji« (okupacijskemeje.si/exh04-ch05.html; SL+EN).
- Vsebina: »Gor in dol od nas kak kilometer je Kolpa ravna, pri Gribljah pa malo zavije, tam Italijani niso imeli pregleda«; hrvaški kajdarji so pri ovinku prevažali čez reko begunce in Žide; rop kajdarjev (»bejžmo, bejžmo«, čoln poln robe nazaj); zlatniki/cekini, kupovanje »za zobarje«, »cela dolina si je s temi cekini zobe delala«.
- Status TESTIMONY (objavljeno pričevanje, brez imen kajdarjev — TO_COLLECT). Slika: ponovno uporaba kolpa-dolina.jpg (Uroš Novina, CC BY 2.0; precedent sveti-vid.jpg ×2; lasten posnetek ovinka TO_COLLECT).
- Postaja v sprehodu »Vojna in svoboda« (za zasedo-1941).

### MVG-028 zaseda-1941 — zapolnjena izrecno priznana vrzel (»usoda postojanke še čakajo«)
- Vir + poved SL/EN: 8. 4. 1942 fašisti zasedli šolo, financarji civilno hišo; bodičasta žica; 5 betonskih bunkerjev + 3 vkopani; kamnito-betonsko zid; povezovalni jarki; partizanska skica postojanke (konec 1942/1. pol. 1943, Arhiv RS). Vir: razstava INZ, exh04-ch02.html (SL+EN preverjena).

### MVG-068 sveti-vid — zapolnjena vrzel »vizitacijski zapisi še čakajo«
- Volčjak, J. (2019): Cerkve goriške nadškofije na Kranjskem v času nadškofa Karla Mihaela grofa Attemsa, 1. del — Acta historiae artis Slovenica 24(1), DOI 10.3986/ahas.v24i1.7586 (OJS ZRC SAZU, open access; PDF preverjen).
- Podatek: »Griblje (Grible, 1771), p. c. sv. Vida, om. 1753, 1771« — podružnica župnije Podzemelj, omenjena v vizitacijah 1753 in 1771; opomba 265: IT ASDG, ACAG, Visite pastorali, Attems; str. 148 (katalog patrocinijev Sv. Vid: Griblje, Jugorje pri Metliki, Lučine …).

### MVG-083 najdišce-ob-kolpi — +2 raziskavi v zgodbo (2012, 2023) + 2 vira
- ARHAT (Aleš Tiran s. p., 2012): »Griblje – Ob Kolpi dokumentiranje ob gradnji« — zbornik Arheologija v letu 2012, vpis 109 (arheologija.splet.arnes.si).
- ZVKDS Center za preventivno arheologijo (2023): Griblje – najdišče ob Kolpi, EŠD 10094, arheološke raziskave ob gradnji, projekt 23-0070 — zbornik Arheologija v letu 2023, str. 108 (www.arheologija.si).
- Zgodba: »ARHAT (2011, 2021)« → »ARHAT (2011, 2012, 2021) ... leta 2023 pa še preventivne raziskave Centra za preventivno arheologijo ZVKDS (projekt 23-0070)«.

## 4. Zavrnjeno / TO_COLLECT

- **Andrič cox.si** — »Lateglacial vegetation at Lake Bled and Griblje marsh« = že citiran Andrič 2011 (Opera IAS 21) — DUPlikat.
- **Weiss »das dorff Griblach«** — identifikacija napredovala: monografija Kosi/Golec/Kos/Preinfalk/Weiss, Neumarkt–Möttling–Metlika (Belokranjski muzej, Metlika 2018, 367 str., ISBN 978-961-6652-19-3); poglavje Janeza Weissa »Častite avstrijske hiše zvesti podložniki« (~str. 284–285, marker strani v RG navedbi); besedilo ni dostopno (academia/BSB/GB blokirani) — TO_COLLECT točna stran + citat.
- **ZC 42(4) 1988** (nagrobnik učitelja Kambia) — ni dostopno (dLib blokiran) — TO_COLLECT.
- **Križnar 2001 film** — nedoločen (iskanja: Naško/Tomo Križnar, dokfilm Bela krajina — Muhič 2011 teza kot možna sled) — TO_COLLECT.
- **svobodnabeseda.si Stariha** — »posadka na cesti Griblje–Črnomelj; 6. 9. 1941, v kateri Stariha ni sodeloval« — oseba izven zasede, ni Griblje-tema; nizka kuratorska vrednost (neoverljena PDF pot) — zavrnjeno.
- **razglednice/Valvasor/krajevni leksikon 1955** — brez novih dokazanih podatkov o Gribljih.
- **slika malence (Commons, švabo, CC BY 3.0)** — CDN 429 blokada; zapisi zadrži kolpa-dolina.jpg; posnetek TO_COLLECT.

## 5. Regresija (živi strežnik :3100, BASE_URL)

- test-entities 100 ✓ / 0 ✗; test-timeline-map ✓ (vsi); test-ai-curator 214 ✓ / 0 ✗; red-team 157 ✓ / 0 ✗ (GAP 24)
- audit-entities ✓ 0 napak; audit-timeline-map 39 ✓ / 0 ✗; verify-i18n 930 × 5; tsc 0; eslint 0
- audit-numbers: brez oznak za nov zapis; audit-crossfile: 19 opomb (isto kot baseline)
- db:push + db:seed (idempotentno) → OpenData 96/434; sitemap 97; spot-check živo: precanje-pri-gribljih 200 (izrisano), zaseda-1941 200 (nova poved izrisana), sveti-vid 200 (vizitacije izrisane), opendata 200

## 6. Stanje zbirke po sklopu 49

**96 zapisov (MVG-001…096) · 434 vrstic virov · 335 identitet · 18 unikatnih koordinat · 83 objektov s časom · 31 s lego · 97 sitemap URL**

## 7. Surovine

- k49/ (ta raziskava): a01–a06 (okupacijskemeje SL/EN/images/CIP/toc), b01–b10 (arheologija/cox), c01–c03 (cox/svobodna), d01–d06 (dlib/RG/hrcak), e01–e05 (z-ai + OJS članek + PDF + txt), f01–f08 (z-ai + MDZ + academia), g1–g3 (z-ai), h01–h03 (Commons), try1.jpg, slap-*.jpg (429), malenca-retry.sh, ddg.py, exh*.html (razstava)
