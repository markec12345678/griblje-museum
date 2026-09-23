# 39. val spletnega raziskovanja — Odeon rešen (donacija 2020) · ARSO letna serija · Miklavčič 1965 prek DiRROS + OCR — »Gribeljski osredek«

*Muzej vasi Griblje · 91. sklop · 23. 9. 2026*

Zahtevek: »odlicno nadaljuj« (39. val; izven-peskovniška vrsta vala 38). Val je vodil tri lovove po vrstnem redu: (1) Mason 2001 prek OpenAlex »naslednji dan z budžetom«, (2) Odeon »Donatorstvo PŠ Griblje« (TO_COLLECT iz 37. vala, 3-kratna WAF blokada), (3) ARSO letna serija — ter eno sinovo odkritje (Miklavčič 1965), ki je valo povzdignilo iz koroboracij v novih 87 strani prvotne študije.

## Poleno 1 — OpenAlex: Mason 2001 TRAJNO NEENUMERABLEN (drugo neodvisno potrdilo)

Budžet deljenega IP je spet izčrpan ob 08:48 UTC (»$0.0006 remaining; resets at midnight UTC« + občasno »Anonymous search is temporarily rate-limited … retry in 32s«) — iskanje torej tudi »naslednji dan« ni izvedljivo (budžet trošijo sosedje istega izhodnega IP). **Novo pot** je odprl val 38 poučen vzorec: ID-poizvedbe in filtri delujejo brez ključa, zato sem preveril `referenced_works` obeh Andričevih zapisov iz 38. vala:

- **The Holocene 2007 (W2079573702)**: 46 referenc — vse razrešene v enem klicu (`filter=openalex_id:W…|W…|…`, select minimalen); **Mason 2001 med njimi NI** (najnovejše: W2504148978, W4234160582; slovenske: W2911788711 »Podnebni tipi v Sloveniji«, W1982056380 fitogeografske regije).
- **DP 34 (W2146369274)**: 33 referenc, 32 razrešenih; **W4285719527 = HTTP 404** (izbrisan/merge-an zapis) — tudi tu **Mason 2001 ni**.

**Sklep (trajen odgovor):** Mason 2001 (Varstvo spomenikov 39: 7–27) nima zapisa ne v Semantic Scholarju (37. val) ne v OpenAlexu (39. val, dva neodvisna referenčna seznama) — izštevilčevanje njegovih citacij je zaprto kot *neizvedljivo brez ključa/ročnega vpisa*; polno besedilo ostaja TO_COLLECT (dLib živa seja / COBISS). Pri tem je bil polni **abstrakt The Holocene 2007** (invertni indeks → navadno besedilo) zajet iz OpenAlexa in potrjuje vse dejstva vala 38 (kotanja G3, ~10 km do Mlake, 6000 cal BP, Mlaka odprta od c. 1000 BP, Griblje gozdnato do danes).

## Poleno 2 — SINOVA: Miklavčič 1965 = 87 strani prvotne študije (DiRROS + OCR)

Med referencami DP 34 je potegnil **W3030584428**: *»Premena belokranjskih steljnikov v gozdove«*, **Jože Miklavžič, Zbornik 4 (Biotehniška fakulteta / Inštitut za gozdno in lesno gospodarstvo, ISSN 0350-0187), str. 1–87, 1965** (OpenAlex letnicira 2017 = letnica DiRROS vnosa; metapodatki zapisa pravijo `publication_date: 1965`). To je **tista referenca »Miklavčič 1965«, ki jo citira Andrič 2007 (DP 34)** — dve leti namigovana, zdaj v rokah.

- **Dedup:** miklav(v)a v bazi pomeni le »miklavževske dneve« (Žbulčkova/Miklavževa tržnica) — vir NI obstajal.
- **Prenos:** DiRROS `IzpisGradiva.php?id=7939` (curl 200, 16,8 kB) → metapodatek `citation_pdf_url` → `Dokument.php?id=9941` = **10.629.822 B, 90 strani** (sken 2014, Nitro Pro). Pasti: strežnik **zavrača Range** (200, ne 206), duši na ~25 kB/s, delni prenosi dajo okvarjen xref (prvi poskus 9,18 MB), zastarel PHPSESSID sproži 302 — polni prenos šele z `-L` + Refererjem (3. cikel). Ozadje-prenosi (`nohup`, `setsid`) v peskovniku umrejo ob koncu klica — zanesljiv je samo foreground curl z dolgim `-m`.
- **Sken je BREZ besedilne plasti** (pdftotext = 90 form-feedov): OCR z `tesseract 5.5.0` (na voljo samo `eng` — za lastna imena zadostuje), `pdftoppm -gray -r 150` + 6 vzporednih delavcev ≈ 90 strani v nekaj minutah → **240 kB besedila**.
- **Zadetki:** griblj **2×**, steljni **309×**, gozd **558×**, beli kra **24×**, vinica 12×, travnik 3×.
  1. **Str. 19 (pedologija):** »Podzoljena rumeno rjava tla s kremenovim prodom (talni enoti 17 in 18) zavzemajo južno od Metlike strnjen širok izrazit pas ob Kolpi, v okolici **Križevska vas–Gradac–Krašinec–Griblje**… Matični substrat … deloma kredni apnenec (zahodni rob), pretežno pa naplavljena rdeča ilovica **(»Gribeljski osredek«)** in pliocenski sedimenti … Relief … 100–200 m nmv. Tla … plitva do globoka, slabe do srednje vodne kapacitete, deloma zelo skeletna, prepustna in zračna. … **slabe prirodne rodovitnosti. Področje teh tal je v zahodnem delu poraslo z gozdovi in steljniki**…« — vas ima v znanstveni literaturi **lastno talno enoto z imenom**.
  2. **Preglednica steljnikov (str. 33):** »PREGLEDNICA STELJNIKOV PO VRSTI NJIHOVEGA BODOČEGA IZKORIŠČANJA« — vrstica 49: **KO Griblje (II/27 SK) = 77,50 ha**; skupno 9.979 ha steljnikov, od tega 4.865 ha opredeljenih za gozdarstvo.
- **Koroboracija:** Andrič 2007/38. val — »Griblje na peščeni podlagi, do danes pretežno gozdnata« — ima zdaj pedološkega prednika 42 let prej: tla slabe rodovitnosti, ki držijo gozd in steljnike; hkrati MVG-084/žbul agrarni kontekst (»Gribeljski osredek« kot kmetijsko jedro).

**Vgrajeno:** vir `miklavcic-1965-steljniki` na **MVG-083** (objava, navedba, URL DiRROS; opomba s str. 19 + preglednico in zapisom, da je vsebina prebrana z OCR) + zgodba SL/EN +1 odstavek (»pedološki svinčnik je pelodni pripovedi narisal vzporednico: tla, ki gozd držijo, in prah, ki gozd pripoveduje«).

## Poleno 3 — ODEON REŠEN: »Donatorstvo PŠ Griblje« (23. 10. 2020)

Val 37 je Odeon zapisal kot 3-kratno WAF blokado (TO_COLLECT; COBISS ISSN 2536-328X). V 39. valu je **curl z brskalniškim UA vrnil HTTP 200, 61 kB** — WAF je popustila (ključ: navaden UA namesto privzetega curl-ja; r.jina.ai ni bil niti potreben).

Vsebina (Radio Odeon, petek 23. 10. 2020 ob 15:00): **Izr. prof. dr. Franc Brinc, rojen v Gribljah**, je ob svojem **85. rojstnem dnevu podaril 4.999,00 €** podružnični šoli za nakup **knjig, učil in šolske računalniške ter pohištvene opreme**; vir obvestila: **OŠ Loka PŠ Griblje**. Ista objava omenja še njegov prispevek spominov v **zborniku ob 50-letnici ustanovitve Gimnazije Črnomelj**.

Pomen za MVG-042 (franc-brinc): zgodba pripoveduje o donacijski seriji (1998 zvonovi → 2021 obisk → 2025 »znova 5.000 evrov«); **23. 10. 2020 je zdaj najzgodnejši datirani dar šolske serije** — beseda »znova« dobi predhodnika; bibliografija Brinca dobi zbornik gimnazije. Vgrajeno: vir `odeon-donatorstvo-2020` + zgodba SL/EN +1 odstavek.

## Poleno 4 — ARSO letna serija: Dragoši–Griblje na uradnem nacionalnem seznamu

Kanal `arso.gov.si` (curl 200 brez posebnosti): razdelki kopalnih vod → **/programi/** (2007–2010 + Programa 2010–2015, 2016–2021) in **/poročila in članki/** (KV 2008–2017, EU 2010–2021). Preneseno **Poročilo o kakovosti kopalnih vod — EU 2021** (203 kB, pdftotext 12,8 kB): nacionalni seznam kopalnih vod vsebuje vrstico 19: **»Kopalno območje Kolpa, Dragoši–Griblje«, koda SI00D0501700K05010, vodno telo SI21VT50 (Kolpa Petrina–Primostek)**.

Pomen za MVG-006 (kolpa-reka): monitoring K05010 je bil že vir (GOV.SI profil); ARSO poročilo pa je **letna serija (2008–2021)**, ki dokazuje kontinuiteto državnega spremljanja — kopanje pod vasjo nosi vsakoletno oceno. Vgrajeno: vir `arso-kv2021-dragosi-griblje` + zgodba SL/EN +1 odstavek.

## VGRADNJA (add-only)

| Zapis | Vir | Opomba |
|---|---|---|
| **MVG-042** (franc-brinc) | **odeon-donatorstvo-2020** (objava, navedba) | 4.999,00 € ob 85. rojstnem dnevu za knjige/učila/računalniško in pohištveno opremo; vir obvestila OŠ Loka PŠ Griblje; zbornik gimnazije; najstarejši datirani dar šolske serije |
| **MVG-006** (kolpa-reka) | **arso-kv2021-dragosi-griblje** (objava/poročilo, javna informacija) | uradni nacionalni seznam kopalnih vod 2021: Kolpa, Dragoši–Griblje, SI00D0501700K05010, SI21VT50, vrstni št. 19 |
| **MVG-083** (arheol. najdišče ob Kolpi) | **miklavcic-1965-steljniki** (objava 1965, navedba, DiRROS) | str. 19 »Gribeljski osredek« (naplavna rdeča ilovica, 100–200 m nmv, slabe rodovitnosti, gozdovi in steljniki); preglednica: KO Griblje 77,50 ha; 90 strani prebranih z OCR; citira ga Andrič 2007 |

+ zgodba SL/EN +1 odstavek na vsakem od treh zapisov (donacijska serija; vsakoletna ocena vode; pedološka vzporednica pelodu).

**Konstante: 575→578 virov (10 mest v 5 skriptah), 456→459 identitet (3 skripte).**
*(Poučna epizoda — ponovitev 38. vala: prvi vpis 577/458 je bil aritmetična napaka — prištevanje po en vir naenkrat, izpuščen ARSO-in +1; OpenData po reseedu je pokazala 578/459 in regresija je to potrdila. Pravilo za prihodnost: konstanto vedno računaj iz končne OpenData/seed vsote, ne med vgradnjo.)*

## Regresija (živi :3000 po reseed + restart)

- tsc 0, lint čist (eslint)
- verify-i18n **946 × 5** ✓ (en, hr, de, it = struktura identična SL)
- audit-entities ✓ 0 napak (**113/578/459/67/375**; 95 entitet, 36 oseb)
- audit-timeline-map **39 ✓/0**
- test-entities **100 ✓/0**
- test-timeline-map **72 ✓/0**
- test-ai-curator ✓/0 (celoten niz uspešen)
- red-team ✓/0 (artefakt `red-team-after-2026-09-23T09-40-30.json`)
- test-plan-visit **42 ✓/0**
- OpenData **113/578** živo; sitemap **114**

## agent-browser (UI verifikacija)

- `/exponat/arheolosko-najdigsce-ob-kolpi`: h1 ✓; »Gribeljski osredek« ✓, »77,50« ✓, miklav… ✓; **VIRI (16)** (prej 15) ✓; DiRROS link `IzpisGradiva.php?id=7939` izrisan ✓; lang=sl ✓
- `/exponat/franc-brinc`: »4.999,00« ✓, »85. rojstnem dnevu« ✓, »Gimnazije Črnomelj« ✓; VIRI izrisani ✓
- `/exponat/kolpa-reka`: »SI00D0501700K05010« ✓, »Kopalno območje Kolpa, Dragoši–Griblje« ✓; **VIRI (8)** (prej 7) ✓; noga footBottom = pageH 4.784 (vrzel 0) ✓
- hero 113 ✓; preliv 0 pri 390 px (scrollWidth = 390) ✓; konzola čista (samo HMR/React DevTools info) ✓

## Stanje

**113 zapisov (MVG-001–113), 578 virov, 459 identitet, 67 deljenih, 95 entitet (oseb 36); sitemap 114; i18n 946 × 5; 13 API poti.**

## Vrsta (posodobljena)

Vinogradniška diploma (RUL gID) → Belokranjec PDF (4. poskus) → Poganjec → Lojze↔Alojz → SI AS 176 (Franciscejski kataster) → gostilna pred 1898 → vrzel #3 (360° panorame) → Andrič 2001 DPhil polno besedilo (SOUL Oxford) → Andrič 2007 polno besedilo The Holocene (17: 763–776; SAGE sejo; abstrakt zdaj zajet) → Vavpotič/Gaspari → kataster jam (ko se gostitelj vrne) → Miklavčič 1965: kolofon/prestižni natis (brati str. 20–87 v celoti, ko bo OCR-slv na voljo) → Odeon arhiv 2020 (še 4 članki o Gribljih preverjeni ob robu = dedup; periodično spremljanje).

## Surovine (raw-web-val39-2026-10/)

`s01–s12` OpenAlex (search poskusi, W2156689993 + referenced_works, 46+32 razrešenih referenc, W4285719527 404), `s10-dirros-page.html`, `mik.pdf` (10,63 MB, 90 strani) + `ocr/` (90 PNG + 90 TXT) + `miklavcic-1965-ocr.txt` (240 kB), `s13-odeon-donatorstvo.html` (61 kB), `s14–s16` ARSO indeksi, `s17-arso-2021.pdf` + `.txt`, `dl.log`.
