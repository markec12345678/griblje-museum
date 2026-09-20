# 23. Val 10 — Odeon: elektrika 2021 + polno besedilo učilnice (2026-10)

**Naročilo:** »odlicno nadaljuj« (po pushu + Vercel preverbi 55. sklopa). Val 10 = nadaljevanje Odeon-enumeracije z brskalnim UA (metoda iz vala 9) + lotinska pridobitev vseh preostalih znanih slugov.

## Surovine

`research-griblje/raw-web-val10-2026-10/` — 8 pridobitev Radio Odeon (curl z brskalnim UA; `novice/<slug>/`).

## Pridobitve (8 slugs → 2 × HTTP 200, 6 × 404)

| slug | status | opomba |
|---|---|---|
| `del-gribelj-bo-brez-elektrike` | **200** | TO_COLLECT iz vala 7 — rešen |
| `v-soli-so-spravljene-mnoge-skrivnosti` | **200** | polno besedilo — URL je ŽE VIR MVG-026 (`odeon-v-soli-skrivnosti`) |
| `obudili-pastirski-praznik-v-gribljah` | 404 | iskalni duh (index fragment brez žive strani) |
| `pastirski-praznik-v-gribljah-2019` | 404 | iskalni duh |
| `pastirski-praznik` | 404 | iskalni duh |
| `praznovanje-130-let-sole-v-gribljah` | 404 | iskalni duh (130 let = 1889 že potrjeno val 6) |
| `solski-praznik-v-gribljah` | 404 | iskalni duh |
| `krajani-gribelj-svetujemo` | 404 | iskalni duh |

**Sklep o t-* slugih:** »Cloudflare-blokada« Odeon t-* naslovov iz valov 8–9 se je izkazala za neobstoječe strani — to so iskalno-indeksni ostanki (http404 preusmeritve), ne skrite vsebine. Odeon-arhiv o Gribljih je s tem enumeracijsko **izčrpan** do nivoja iskalnih indeksov.

## Prelomi

1. **Radio Odeon »Del Gribelj bo brez elektrike« (1. 12. 2021, vir: Elektro Ljubljana)** — polno besedilo. Obvestilo DE Novo mesto, nadzorništvo Metlika: izklop **TP GOR. GRIBLJE** med 10. in 12. uro zaradi del na distribucijskem omrežju; **20 naslovov** — hišne št. 3–15 z razdelki (3, 4, 5, 6, 6 A, 7, 8, 9, 9 A, 9 B, 10, 10 A, 11, 11 A, 12, 13, 13 A, 14, 15) in »GRIBLJE BŠ«; v primeru slabega vremena prestavitev. Redka dokumentirana mikro-geografija vaškega elektro-omrežja (katera okna si delijo isti kabel).
2. **Radio Odeon »V šoli so spravljene mnoge skrivnosti« (3. 6. 2022)** — polno besedilo. **Dedup:** URL že vir `odeon-v-soli-skrivnosti` (MVG-026); polno besedilo pa odkriva **nove podrobnosti, ki jih korpus še ni imel**: himna PŠ Griblje **»Naša šola Gribeljska« — besedilo Majda Lozar, uglasbila Maja Kunič**; pesmi nekdanjih učencev zbrali **Maja Kunič in Maja Špringer**; recitali učiteljev **Anton Jakša, Helena Banovec, Sonja Malnarič**; prizor iz starih šolskih klopi pod vodstvom knjižničarke **Urše Prus**; skulptura recikliranja **»Smetkota«**; učenka Ana (saksofon), Nuša Butala (kitara). Datum dogodka »drugi dan rožnika« = **2. 6. 2022** (objava 3. 6.) — potrjuje korekcijo iz vala 6.

## Vgrajeno (add-only; +1 vir: 458 → 459; identitet 355 → 356)

- **MVG-097 javna-razsvetljava-2023 +1 vir + 1 zgodbi odstavek (SL/EN):** `odeon-elektrika-2021` — mikro-geografija omrežja: izklop TP GOR. GRIBLJE 1. 12. 2021, 20 naslovov (3–15 + razdelki, »BŠ«) — »pove, katera okna si delijo isti kabel«.
- **MVG-026 vaska-sola + razširjen zgodbeni odstavek (SL/EN, brez novega vira — vir že obstaja):** himna PŠ Griblje »Naša šola Gribeljska« (Lozar/Kunič), zbirateljici pesmi (Kunič, Špringer), recitirajoči učitelji (Jakša, Banovec, Malnarič), knjižničarka Urša Prus, Smetkota; opombe vira `odeon-v-soli-skrivnosti` razširjene s polnim besedilom.

## Dedup (namenoma ni vgrajeno)

- Odeon učilnica kot NOV vir = **duplikat** (isti URL že `odeon-v-soli-skrivnosti`).
- Weiss citat »Podružnice niso drage, so pa dragocene« — že v zgodbi MVG-046.
- Zbor Banovec, program učilnice (Štajdohar/Špela Brinc/Vraničar/Toni Brinc, kronika 1949/50) — že v MVG-026/MVG-046.
- 6 × 404 slugs — neobstoječe strani, nič za vgraditi.

## Regresija (živi :3100)

tsc 0, eslint čist, verify-i18n **930 × 5**, test-entities **100 ✓/0**, test-timeline-map **72 ✓/0**, test-ai-curator **214 ✓/0**, red-team **157 ✓/0** (GAP 24), audit-entities ✓ 0, audit-timeline-map **39 ✓/0**; reseeda z izrecnim DATABASE_URL → OpenData **98/459** živo, sitemap 99; konstante usklajene (458→459, 355→356, deljeni 54 ostaja).

**Stanje: 98 zapisov (MVG-001–098), 459 virov, 356 identitet.**

## Ostaja TO_COLLECT

- arhiv.vaskanal.com (direktna pridobitev še blokirana), Družina 2. 8. 2024 »vse naše patrole« 1943, ebooks.uni-lj.si »od Gribelj do Preloke«, znaci.org »iz Gribelj pri Črnomlju«, SEM rojstna hiša Nika Županiča, Weiss monografija točna stran (BSB/GB), MD požar 31. 3. 2025 (vir NE imenuje PGD — dokaz najprej), MD odpadki 2019 (FB-vir), rezultati arheologije razsvetljave 2021/2023 (STIK/EVI — poročila niso javna).
