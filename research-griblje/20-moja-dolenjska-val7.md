# 20 · 7. raziskovalni val — Moja Dolenjska + Radio Odeon (prava domena) + NP Kolpa + Vinska vigred (2026-10)

**Sklop 53** · Naročilo: »odlično nadaljuj raziskuj« · Dedup add-only nad 96 zapisov / 443 virov / 344 identitet → **98 / 450 / 351**

## Preomi (metodološki preboji)

1. **Radio Odeon = radio-odeon.com, ne .si.** Vsi prejšnji valovi so blokado zapisovali kot »Radio Odeon Cloudflare« — veljala je za domeno `radio-odeon.si`. Prava domena je `radio-odeon.com` (WordPress-like CMS, shema `/novice/<slug>/`). Direkten curl ostaja za Cloudflare izzivom, page_reader pa članke zanesljivo pridobi (ko ne bo rate-limited). To odpira celoten arhiv regionalnega radia, ki Griblje pokriva dnevno.
2. **arhiv.vaskanal.com** — arhiv Vašega kanala obstaja in iskalni indeks že kaže gribeljske zadetke (»Obudili pastirski praznik«, 30. 5. 2017). Direktna pridobitev (curl + page_reader) še blokirana (Cloudflare izziv / 504).
3. **moja-dolenjska.si** — nov medij, ki poroča o Gribljih; curl deluje brez blokad. 4 članki preneseni in prebrani v celoti.
4. **Iskalni API vrača samo domene** — članske URL-je je treba rekonstruirati: iz iskanj sproti, iz živih strani (extract href), iz slug-ugibanj. Vaš kanal in SEM ostajata brez URL — v digesstu.

## Vgrajeno (add-only)

### Novi zapisi (2)

**MVG-097 `javna-razsvetljava-2023`** (kraj, DOCUMENTED)
- Moja Dolenjska (9. 10. 2023): javna razsvetljava zaključena — ~70.000 € občina + ~7.000 € krajani; izvajalec EVI Črnomelj; dela julij–konec avgusta; odprtje ob koncu tedna v začetku oktobra s kulturnim programom (župan Andrej Kavšek, predsednica KS Romana Husič).
- **Najtežji podatek:** arheološke raziskave ob gradnji ~12.500 € — povezava na MVG-083 (najdišče ob Kolpi) in keltsko zlato Pezdirčeve njive; **rezultati raziskav = TO_COLLECT** (muzej jih izrecno išče).
- + Moja Dolenjska (26. 8. 2025): asfalt 190 m javne poti, ~35.000 € (občina asfaltiranje, KS podlaga) — opomba »ne mešati z Brinčevo donacijo PGD 35.000 €«.
- Slika: `razsvetljava-led.jpg` — John Goldsmith, CC BY-SA 2.0 (Commons API + Special:FilePath/prenos, pomanjšano 1600px).
- Postaja v sprehodu »Vas in njeni ljudje« (za zvon-2008).

**MVG-098 `pogaca-vigred-2024`** (sege, DOCUMENTED)
- Vinska vigred (25. 4. 2024): najboljša belokranjska pogača 44. Vinske vigredi **prihaja iz Gribelj** — Darinka Jerčinovič, hiša »Kovačnica sreče«, 79,38 točk.
- Naslov potrjen na živi domači strani festivala (URL izveden iz extract href); podrobnosti (točke, zmagovalka) iz iskalno indeksiranega odlomka — telo članka je bilo nedostopno (anti-bot + 429); to je izrecno zapisano v viru.
- Slika: reuse `pogaca.jpg` (Rude, CC BY-SA 3.0 — isti motivni krog kot zapis Belokranjska kuhinja).
- Postaja v sprehodu »Kruh, platno in vino« (za belokranjska-kuhinja).

### Potrditveni viri (5, add-only)

- **MVG-087 križevo + 2 vira + 2 zgodbeni odstavki (SL/EN):**
  - **NP Kolpa / Naravni parki Slovenije (28. 5. 2017)** — URL: `naravniparkislovenije.si/slo/prireditve/krajinski-park-kolpa/pastirski-praznik-v-gribljah-2017/68` — dokumentirani začetek vrnitve: Kopališče Griblje ob 15.00; pastirske igre, tekmovanje v košnji z ročno koso, pozno kosilo »pohane šnite«; TD Griblje »že nekaj let« ohranja tradicijo; sodelovanje DKZ Griblje in otrok podružnične šole; etnografija (biči/rogovi proti coprnicam od Jurjevega; običaj najdlje ohranjen v **Tribučah**).
  - **Radio Odeon (31. 5. 2019, Boris Grabrijan, vir: KP Kolpa)** — URL: `radio-odeon.com/novice/krizevo-star-pastirski-praznik/` — polna etnografija šeg po Janku Barletu: jajca izpihana in v masti ocvrta pred sončnim vzhodom (coprnice ne molze), ošiljena breza z izpihanimi lupinami na štrcljih (»daleč naokoli videti«), **Šašelj 1906** (revnejše družine kupile pastirju vino in okrak), Viničaki: **»kralj križev« / »lončegloja« / »pepelmera«**, namen — manj **»zapaskov«**, konec paše ob **vseh svetih**, pojedina ohranjena še v 70-ih letih 20. stoletja.
  - Zgodba dopolnjena z dokumentiranim začetkom 2017 + omenjen Vaš kanal (videoarhiv, brez formalnega vira — odlomek).
- **MVG-093 tone-kralj-98 + 1 vir:** Moja Dolenjska (7. 2. 2026) — neodvisna potrditev: 98. rojstni dan 11. 1. 2026; obisk župana Andreja Kavška, RK prostovoljk Mojce Črnič in Nade Štrucelj, predsednice KS Romane Husič; iz arhiva članki: »kmet, organizator in povezovalec ljudi«.
- **MVG-003 petstoletnica-2026 + 1 vir:** Moja Dolenjska (26. 6. 2026) — neodvisni medijski vir za slovesnost; vsi podatki (Glavan, Miroslavič, Memento, Husič/Weiss/Črnič ml., Brincova donacija, zahvale Križan/Štrucl/Piškurič/Kavšek) se ujemajo z obstoječo zgodbo.

## Zajeto, ne-vgrajeno (nizka muzejska vrednost ali nepopoln URL) → DIGEST

- Radio Odeon »Del Gribelj bo brez elektrike« (1. 12. 2021, ponovitev 25. 4. 2022 po indeksu): TP GOR. GRIBLJE, hišne št. Griblje 3–15 (+A/B) + »Griblje BŠ« — dokaz o dnevnem poročanju; uporabna potrditev naslovnika »Griblje BŠ«.
- arhiv.vaskanal.com »Obudili pastirski praznik« (30. 5. 2017): »Gribeljsko kopališče… v Kolpi namerili že 20 stopinj…« — sekundarna potrditev obuditve 2017 (omenjeno v zgodbi, brez vira).
- Radio Odeon »Pastirski praznik« (vabilo TD + DKZ, kopališče, 15.00; indeks ~2026) — slug ni ustrežljiv, URL TO_COLLECT.
- **Družina (2. 8. 2024)** »Bela krajina 1943, Črnomelj, VOS, Rosalnice, Pavel«: odlomek »…Gribelj, od koder smo jih pričakovali in kjer smo imeli tudi vse naše patrole…« — pričevanje o patruljah v Gribljih 1943; URL TO_COLLECT (kontekst MVG-028).
- **ebooks.uni-lj.si** »Sovražna razmejitev in zaščita meje na območju Gorjancev«: »…od Primostka do Gribelj (izključno), od Gribelj do Preloke (vključno)…« — delitev varovalnega pasu; kontekst/datum dokumenta TO_COLLECT.
- znaci.org »Prisrčno partizansko slavje na Planini«: »…iz Gribelj pri Črnomlju…« — TO_COLLECT.
- SEM / etno-muzej.si: »Griblje — enonadstropna hiša na pero, rojstna hiša dr. Nika Županiča … 1.1.1920« — verjetno pokrito z MVG-017/MVG-010 (SEM fotografije); URL TO_COLLECT za preverbo.
- metlika.si osmrtnice (Anica Husič 90, Janez Pezdirc 52) — ne muzejska vsebina.

## Dedup odločitve (že pokrito, vgrajene samo potrditve)

500-letnica (MVG-003), TD Griblje (MVG-081), kopališče/reka-kolpa.si (vir MVG-044), okraj Črnomelj 1854 (vir MVG-001), Tone Kralj (MVG-093), kavbojski žur (Odeon junij 2025 — citat že v MVG-080), belokranjska pogača kot termin (glosar + vir Naša superhrana), asfaltiranje 600 m² pri vežici (~18.000 €, del MVG-003).

## Blokade vala

- page_reader: 429 (rate-limit) po ~10 pridobitvah; 504 na arhiv.vaskanal.com; Cloudflare ostaja na direktnem curl (Odeon, Vaš kanal).
- web_search 429 občasno; iskalni API ne vrača polnih URL-jev.
- Vinska vigred: anti-bot JS na članskih straneh za curl; page_reader potreben, a rate-limited.

## Regresija (vse zeleno)

tsc 0 · eslint 0 · verify-i18n 930×5 · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · audit-entities ✓ 0 · audit-timeline-map 39 ✓/0 · reseeda z izrecnim `DATABASE_URL=file:/home/z/griblje-museum/db/custom.db` → OpenData **98/450** · sitemap **99** · konstante usklajene (96→98, 443→450, 344→351, 83/31→85/33, 97→99; R0.2/R0.3/R12.2/R16.1/R16.2, T7.1/T7.2/T7.3/T7.8/T7.9/T8.1–T8.4/T8.7, T5.12, T8.2/T8.6/T8.11/T9.1–T9.4/T9.8, audit-entities 260–263, audit-timeline-map 104/198).

## Naprej (naslednji val)

1. Radio Odeon: sistematična enumeracija `/novice/*` o Gribljih (ko se 429 sprosti) — vključno z iskanjem članka »Pastirski praznik« (vabilo TD+DKZ) in »tone-kralj« tipov zapisi.
2. arhiv.vaskanal.com: obvoz ali rob.
3. Družina/ebooks.uni-lj/znaci.org: URL-je in kontekste pridobiti (1943 patrole; mejni pas; partizansko slavje).
4. SEM: potrditi, ali je hiša Nika Županiča nova fotografija poleg F0000182/F0001407.
5. Rezultati arheoloških raziskav razsvetljave 2023 (MVG-097 TO_COLLECT) — ZVKDS CPA.
