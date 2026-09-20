# 6. raziskovalni val — Dolenjski list, Facebook, Odeon (2026-10)

Naročilo: »imaš na facebooku, imaš dolenjski list, slike, odeon, povsod išči, raziskuj«.

## Metoda
- 13 spletnih iskanj (z-ai web_search) + 10 pridobitev strani (curl/page_reader) — surovine v `research-griblje/raw-web-val6-2026-10/`
- **PRELOM**: iskanje na dolenjskilist.svet24.si (`/iskanje?q=`) je direktno dostopno prek curl in vrača SSR HTML → sistematična enumeracija 19 člankov o Gribljah (do zdja je bila Media24-izdaja nedostopna prek iskalnikov, ki vračajo le domene)
- Facebook: prijava-zaklenjen; Radio Odeon: Cloudflare (»Just a moment«); dLib.si: JS-renderirani rezultati (shell se naloži, zadetki ne); Vaš kanal: Cloudflare; Wayback Machine: timeout iz peskovnika

## Vgrajeno (add-only, dedup-preverjeno nad 96 zapisi / 435 virov / 336 identitet)

### Viri +8 (435 → 443)
| ključ | zapis | vsebina |
|---|---|---|
| os-loka-130-let | MVG-026 | 130-letnica 16. 6. 2019, srečanje Gribeljcev, Zabukovškovi sliki, Torpedo, muzejska učilnica na podstrešju, Vaš kanal 17. 6. |
| dl-muzejska-ucilnica | MVG-026 | literarni večer 2. 6. 2022: Štajdohar, Špela Brinc, Vraničar, Toni Brinc, kronika 1949/50 (¼ kg pečk, 215 kg zelišč, Gumb za AFŽ), zbor Helene Banovec |
| dl-vas-s-svojo-solo | MVG-026 | 17 učencev/5 oddelkov RaP (2025/26), podružničarke (+ Špehar, Željko), Žunič od 1992, samostojna do 1963/64 → OŠ Mirana Jarca → OŠ Loka 1989, kriza 2002 (6→4), 140-letnica 2029, edina vas s podružnico, Niko Dragoš 111 let |
| odeon-v-soli-skrivnosti | MVG-026 | regionalni zapis odprtja (3. 6. 2022, foto Tomanič/Pavlakovič) |
| dl-brinc-91 | MVG-042 | 91. rojstni dan + plošča; razčlenitev: šola 30.000, ŠD 30.000, PGD 35.000, KS 100.000; zvonovi 1998 (tolarji); Marija 65 let |
| dl-pgd-stoletnica | — (že vir MVG-027) | potrditev; v zgodbo dodan kombi + kviz mladine + 35.000 |
| dl-pasuljada-21 | MVG-041 (pasuljada) | 21. tekmovanje (2026), predzadnja avgustovska sobota, 13 ekip, domačini zmagali |
| dl-strucelj-80 | strucelj-kmetija | izvirni DL intervju (Odeon = povzetek): kmetovanje ročno, šest krav, pesem pri delu |
| dl-pet-stoletij-vere | sveti-vid | tiskana potrditev 500-letnice + obnove obeh cerkva (1526) |

### Korekcije (evidenčne)
1. **Otvoritev muzejske učilnice: 26. 6. 2022 → 2. 6. 2022** (MVG-046 + entiteta) — 26. 6. je bila objava svet24; DL »na drugi dan rožnika« + povabilo OŠ Loka »v četrtek, 2. 6.«
2. **Gribeljci po svetu: 19. 6. → 16. 6. 2019** (MVG-070 + entiteta + timeline komentar + test T2.5) — 19. 6. je objava poročila OŠ Loka
3. **Elektrifikacija zvonov: 1988 → 1998 (verjetneje)** (MVG-042) — »18.900 evrov leta 1988« je nemogoče (evro ne obstaja); DL: »letа 1998, takrat še v tolarjih« — obe različici dokumentirani
4. **PGD: 30.000 → 35.000 €** (od tega 30.000 v štirih letih) (MVG-027 + MVG-042)
5. **Šola: 17 učencev v petih oddelkih RaP** (2025/26; DL) — dopolnitev 2023/24 (21 v dveh)

### Resene TO_COLLECT
- »Odeon 130 let šole Griblje — katera obletnica?« → **130-letnica = 16. 6. 2019 (ustanovitev/blagoslov 1889)** — potrjeno z OŠ Loka + osloka.splet.arnes.si (120 let 2009) + DL
- »Odeon KS Griblje praznik — kateri praznik?« → že rešeno v 50. sklopu (napad 1941, spominska soba dr. Brinca)

## Zavrnjeno / ne-vgrajeno (dedup)
- `griblje-tranzit-zaprt-most` (DL: tranzit čez vas zaradi rekonstrukcije mostu čez Lahinjo v Gradcu, 19. 5.) — topična kronika, ni dediščina; arhivirano tu
- `spanje-v-podruznicni-soli` (DL kronika, ~2015) — telo članka za plačilo; brez vsebine ni vgradnje
- FB strani (Radio Odeon @radioodeon) — login-wall, ni javnega API
- Radio Odeon »Franc Brinc bo ponovno daroval« (24. 12. 2025, 40.000 € za april 2026) — Cloudflare-blokiran; skupni znesek DL (200.000+) že pokriva; ne-vgradnja iz navedenega povzetka

## Regresija (zelena)
tsc 0 · eslint 0 · test-timeline-map 72 ✓/0 · test-entities 100 ✓/0 · red-team 157 ✓/0 (GAP 24) · audit-entities ✓ · audit-timeline-map 39 ✓/0 · verify-i18n 930×5 · db reseeda (izrecen DATABASE_URL) → **96/443**, konstante usklajene (443 vrstic, 344 identitet, T2.5 16. 6., T7.3 344, T8.6 344)
