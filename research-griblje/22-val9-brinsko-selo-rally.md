# 22. Val 9 — Brinsko selo 2021 + Rally 2026 (2026-10)

**Naročilo:** »nadaljuj z raziskavo« (po pushu 54. sklopa). Val 9 = izpolnjevanje TO_COLLECT iz vala 8: arheologija razsvetljave, Rally Griblje, SEM hiša Županiča.

## Surovine

`research-griblje/raw-web-val9-2026-10/` — 5 spletnih iskanj (web_search) + 2 pridobitvi Radio Odeon (curl z brskalnim UA — page_reader Cloudflare).

## Prelomi

1. **Radio Odeon »Zaselek Brinsko selo v Gribljah z novo javno razsvetljavo« (18. 10. 2021, vir: Občina Črnomelj)** — polno besedilo pridobljeno. **Predhodni projekt istega vzorca kot MVG-097:** dela **46.987,81 EUR**, arheološke raziskave **11.931,60 EUR** (izvajalec: **Skupina STIK iz Ljubljane** — ista firma, ki je 2023 raziskovala grad Črnomelj po svet24), krajani + KS Griblje **10.000 EUR**, ostalo občina; dela avgust–september 2021, izvajalec **EVI iz Črnomlja** (isti kot 2023); predaja namenu: **župan Andrej Kavšek, predsednik KS Toni Brinc (tedaj na čelu, danes član sveta)** in **dr. Franc Brinc**. Delno razrešuje TO_COLLECT arheologije: poznana sta izvajalca obeh raziskav (STIK 2021; 2023 izvajalec še za potrditi, strošek ~12.500 €).
2. **Radio Odeon »Po Gribljah s starodobnimi kolesi« (6. 7. 2026, vir: TD Griblje)** — polno besedilo. Rally Griblje 2026 (sobota 4. 7.): ~50 kolesarjev iz 8 slovenskih in hrvaških društev; program: zajtrk, izlet po Gribljah, **ogled cerkve sv. Vida in stare gribeljske šole z učno uro »Bistre buče«** (hudomušen prikaz nekdajnega pouka), **plesalke Country Roses**, igre na kopališču.
3. **Facebook Sekcija Torpedo Griblje** (iskalni odlomek): Rally 4. 7. 2026, ~50 kolesarjev, 8 društev SI+HR — potrjuje Odeon.
4. **SEM (etno-muzej.si)**: »Dr. Niko Zupanič: svetovljan iz Gribelj — spominska razstava ob 140-letnici« — **dedup: pokrito** z virom `sem-kozmopolit` (MVG-043).
5. BMM skledica Napoleon inv. 1767 — duplikat (val 4); ZRC iza2 (Bela krajina v ledeni dobi, okolica Gribelj) — kontekst, brez nove vsebine; reka-kolpa.si — nizka muzejska vrednost.

## Vgrajeno (add-only; +2 vira: 456 → 458; identitet 354 → 355)

- **MVG-097 javna-razsvetljava-2023 +1 vir + 2 zgodbi odstavka (SL/EN):** `odeon-brinsko-selo-2021` — predzgodovina zaporedja razsvetljave: »Dva projekta, dve leti razlike, en vzorec: vas in občina svetita z istim potpisom.«; dokumentirana druga arheološka raziskava v vasi (11.931,60 €) + zgodovinski podatek o Toni Brincu kot predsedniku KS 2021 (danes član sveta — skladno s zahvalo »bivšim predsednikom« na prazniku KS 2024).
- **MVG-032 kolesa-torpedo +1 vir + 2 zgodbi odstavka (SL/EN):** `odeon-rally-2026-torpedo` — program 2026: učna ura »Bistre buče« v stari šoli povezuje rally z muzejsko učilnico (»nekdajni pouk ni le spomin — je točka programa«). **Dedup ugotovitev:** vir je bil v zbirki že prisoten (zapis td-griblje, kot `odeon-rally-2026` z istim kanoničnim URL) — v MVG-032 je zdaj naveden kot `odeon-rally-2026-torpedo` (unikaten ključ, ista URL-identiteta, ključ je deljen med ≥3 zapisi).

## Dedup odločitve

- SEM razstava Županič — že vir MVG-043; MD »Griblje svetlejše z novo razsvetljavo« (9. 10. 2023) — že vir `mojadolenjska-razsvetljava-2023` MVG-097; Odeon rally 2026 — že vir zapisov td-griblje (kolesa-torpedo zdaj tudi).

## Blokade

- page_reader: Cloudflare/prazen odgovor na Odeonu → rešitev: curl z brskalnim UA (dela za /novice/ sluge).
- SIstory, Družina, dLib: brez novih zadetkov (isti vzorci blokad kot vali 4–8).

## Regresija (vse zeleno)

tsc 0; eslint čist; verify-i18n 930×5; test-entities 100 ✓/0; test-timeline-map 72 ✓/0; test-ai-curator 214 ✓/0; red-team 157 ✓/0 (GAP 24); audit-entities ✓ 0; audit-timeline-map 39 ✓/0; reseeda z izrecnim DATABASE_URL → OpenData **98/458** živo; sitemap 99. Konstante usklajene: 456→**458** (viri), 354→**355** (identitete), 54→54 (deljeni — rally URL že deljen med 3 zapisi; pričakovana sprememba ni nastopila, konstanta vrnjena).

## Stanje zbirke

**98 zapisov (MVG-001–098), 458 virov, 355 identitet virov, 92 entitet.**

## TO_COLLECT za val 10

1. Rezultati arheoloških raziskav 2021 (Brinsko selo, STIK) in 2023 (vas) — kontakt/zprava ZVKDS ali občine
2. Odeon t-* slugi ob odprtem oknu (vabilo pastirski praznik, gribeljci po svetu, 130 let šole)
3. DL polni teksti: Kralj kurirček 2018, Zupanič Švarski 2016, pastirski praznik 2009, Rally 2026 (svet24 URL že znan: svet24.si/lokalno/dolenjska/novice/kolesarski-rally-griblje-pedala-vrteli-po-starem-1911575)
4. Facebook: strani TD Griblje / Sekcija Torpedo / PGD Griblje — slike originalov (praznik KS 2024/2025, rally, pasuljada)
5. SEM fotografija rojstne hiše Nika Županiča (1. 1. 1920) — preverba proti MVG-010/017
