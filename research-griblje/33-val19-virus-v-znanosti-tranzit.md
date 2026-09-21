# 19. val raziskave — vas v znanosti (virus + pajek), tranzit 2025 in popis svetovnih kanalov
*68. sklop · 21. 9. 2026*

## Kontekst

Zahtevek: »raziskuj o Gribljeh povsod, kaj se nimamo.« Val 19 je bil zasnovan kot sistematični pregled **še nikoli popisanih svetovnih kanalov** (Internet Archive, HathiTrust, WorldCat, NCBI/PubMed/PMC, Crossref, Google Books API) + ponovitev izven-peskovniške vrste iz vala 18 (Belokranjec PDF → Vaš kanal → Kropej 2012).

**PESKOVNIŠKA EPIZODA VALA:** med raziskavo je bilo peskovnik razkrivljen (poglavitev; preostal je samo osnovni Next.js predlog). Projekt je bil **popolnoma obnovljen iz GitHub repozitorija** (HEAD e7bbb76 = val 18) — demonstrirana vrednost disciplinarnega pushanja na main. Surovine iskanj so bile rekreirane (NCBI viri so stabilni in reproducibilni); iskalni JSON-i iz prvega teka so izgubljeni, ključne ugotovitve pa dokumentirane spodaj.

## PRELOM 1 — TULV/Griblje/Ma57_01: vas v nomenklaturi virusov (MVG-102)

**Metoda:** iz nagovora »Full text of Emerging Infectious Diseases« (archive.org, via iskalnik) → GenBank dostopna številka **FJ495099** → NCBI E-utilities (esearch/esummary/efetch — **peskovniško dostopni**, HTTP 200!) → celotni GenBank flatfile + PubMed.

- **NCBI nuccore iskanje po besedi »Griblje« = 2 zapisa**: FJ495099 (segment L) + FJ495093 (segment S).
- **GenBank flatfile (efetch):** `Tula virus strain TULV/Griblje/Ma57_01`; isolation_source: pljuča; host: **Microtus arvalis** (poljska voluharica); geo_loc_name: Slovenia; collection_date: **2001**; prijava 1. 12. 2008 — Univerza v Ljubljani, Inštitut za mikrobiologijo in imunologijo (Korva, Duh, Avšič-Županc); reference 1: **Korva, Duh, Puterle, Trilar, Zupanc (2009): First molecular evidence of Tula hantavirus in Microtus voles in Slovenia, Virus Research 144(1–2), 318–322, PMID 19410611**.
- **Neodvisna uporaba:** Zelená, Mrázek, Kuhn (2013), EID 19(11), DOI 10.3201/eid1911.130421 (PMC3837639) — v filogenetskem drevesu našteva »Griblje/Ma57/01 (FJ495099)« ob Hodos, Sred ob Dravi, Sestrze.
- **Kontekst:** Korva et al. (2013), Viruses 5(12), PMID 24335778 — filogeografija slovenskih hantavirusov (istá skupina).
- **Evidence status: CORROBORATED** (primarna objava + primarna baza + neodvisna filogenija).
- **Zanimivost:** sovrasev TULV/Sestrze/Mag98_02 (FJ495100) je nosilec M. agrestis — koda Ma/Mag = vrsta nosilca (muzejska interpretacija, v vire ni zapisana).
- **PubMed esearch po »Griblje« = 0 zadetkov** (beseda je v sekvencnih definicijah, ne v indeksiranih metapodatkih) — kanal je bil odkrit šele prek GenBank `term=Griblje` (nuccore!).

## PRELOM 2 — Cryptachaea riparia: nova vrsta za slovensko favno z ribnika pri Gribljih (MVG-103)

**Metoda:** NCBI **PMC celotnotekstovno iskanje** (`db=pmc&term=Griblje`) = 3 zadetki (ZooKeys 688 Alburnus = dedup, ZooKeys 474 Araneae = NOVO, EID 19(11) = sev).

- **Araneae Sloveniae** — Kostanjšek, R., Kuntner, M. (2015), ZooKeys 474, DOI 10.3897/zookeys.474.8474, PMID 25632258, PMC4304008, CC BY.
- Legenda registra: »The new, previously unrecorded species in the list are marked by an asterisk and followed by a description of the collecting site…«
- **Gribeljski zapis (vrstica tabele vrste Cryptachaea riparia \*):** `1♂ — Pond Ribnik NW of village Griblje; 45°34,56′N, 15°17,01′E, 150 m a.s.l.; 29.07.2001; leg. & det. Kostanjšek R.`
- Koordinata 45,576/15,283 = vaški ribnik na zgornjem koncu vasi (Goranja lokva; isti objekt kot MVG-016 — slika zapisov deljena namenoma).
- **Evidence status: DOCUMENTED** (ena publikacija v dveh zrcalih: DOI + PMC).

## PRELOM 3 — Chapman 2018: cereal-type pollen 7. tisočletje pr. n. št.

- Crossref: **Chapman, J. (2018): Climatic and human impact on the environment?: A question of scale, Quaternary International 496, 3–13, DOI 10.1016/j.quaint.2017.08.010** — »An intriguing occurrence at both Griblje and Lake Prespa is the short-lived occurrence of cereal-type pollen in the late 7th millennium BC…«
- Andrič 2011 (Opera 21, »Poznoglacialna vegetacija…«) = ta zapis že imamo — spletni naslov je angleška različica istega poglavja (dedup).
- **Ni vgrajeno** (ScienceDirect telo peskovniško nedostopno; citat iz iskalnega odlomka) → **TO_COLLECT**: vgradnja kot drugi poročevalec polenskega zapisa (MVG-083).

## VGRADNJA — 19. val (sklop 68)

| Kaj | Kje | Viri |
|---|---|---|
| **MVG-102** TULV/Griblje/Ma57_01 (narava) | nov zapis, sprehod »Iz Gribelj v svet« | korva-2009-virus-res, genbank-fj495099, eid-2013-tula, korva-2013-viruses (4) — CORROBORATED |
| **MVG-103** Cryptachaea riparia (narava) | nov zapis, sprehod »Iz Gribelj v svet« | zookeys-474-araneae (1) — DOCUMENTED |
| **MVG-104** Poletje tranzita 2025 (kraj) | nov zapis, sprehod »Vas in njeni ljudje« | dl-tranzit-2025 (1; naslov + og:description citat) — DOCUMENTED |
| MVG-041 pasuljada | + vir | dl-pasuljada-2025 (31. 8. 2025, »…slovo poletju…« — 2. poročevalec) |
| MVG-010 Županič | + vir | odeon-gribeljcan-2019 (12. 9. 2019 »Gribeljčan, srbski minister, slovenski znanstvenik«; **neskladje datumov Odeon vs. SBL — obrnjena letnica rojstva/smrti — dokumentirano v opombi**) |
| slike | +1 | poljska-voluharica.jpg (Dieter TD, CC BY-SA 3.0, Commons; 1360×1123) |

Stanje: **104 zapisov (MVG-001–104), 523 virov, 412 identitet, 60 deljenih, 94 entitet** (entitetna plast nespremenjena — nove vrste ostajajo v kuratorski vrsti P4-E7); sitemap 105; i18n 946×5; 13 API poti.

## ODEON — izčrpnost ponovno potrjena (3. izmer)

Re-enumeracija `/iskanje/?q=gribelj&limit=100` (curl -4 + UA) = **32 unikatnih člankov**; 100 % dedup proti valom 8–15 (vsi slugi že vgrajeni ali testni artefakti). Izjema: `/fsega/muzika/gino-marino-…` — brez gribeljske vsebine (nepreverjeno, ne-vgrajeno). Odeon ostaja **izčrpan kanal**.

## SVETOVNI KANALI — popis dostopnosti (19. val)

| Kanal | Stanje |
|---|---|
| **NCBI E-utilities (esearch/esummary/efetch, db=nuccore/pubmed/pmc)** | ✅ **DELUJE** — nov ključni kanal (eutils zase IP-blokade ne zadevajo); PMC = celotnotekstovno iskanje po odprti znanosti |
| **Crossref API** | ✅ deluje (natančne citacije prek DOI) |
| archive.org advancedsearch | ❌ timeout (omrežno) |
| Google Books API | ❌ 429 (tretjič) |
| HathiTrust / WorldCat | ◻️ brez gribeljskih metapodatkovnih zadetkov (iskalnik); kanal popisan kot mrtvica za ta primer |
| JINA (r.jina.ai) | ❌ **401 bad IP reputation** (nova blokada — izvala 18 je deloval!) |
| belakrajina.si, vinska-vigred.si (openresty) | ❌ brez JINA nedostopni |
| dLib.si (DC/JSON poti iz vala 17) | ◻️ ta val ni potreben — enumeracija po iskalnem indeksu še vedno vrača iste 2 predmeta + 1 novici časopisnega tipa (Slovenski narod 1874 — URN ni bil potrdljiv iz peskovnika → TO_COLLECT) |

## TO_COLLECT (izven-peskovniška vrsta po valu 19)

1. **Belokranjec PDF** (7-8/2026 »vsaka vas svoj pevski zbor«) — kot v val 18 (JINA zdaj tudi 401).
2. **Vaš kanal arhiv** — članek o kanalizaciji ~2017 (kot v val 18).
3. **Kropej Telban 2012** — Fabečeva pripoved (kot v val 18).
4. **Chapman 2018** — vgradnja v polenski zapis, ko je telo dostopno (DOI znani).
5. **Pogača — dodatni poročevalci**: vinska-vigred.si 25. 4. 2024 (»Najboljša belokranjska pogača prihaja iz Gribelj«), slovenskenovice.delo.si 23. 5. 2024 (»Kdor ne more ploskati…« 79,38 točk), belakrajina.si 22. 4. 2026 (»Najboljša belokranjska pogača se peče v Gribljah«), svet24.si 16. 5. 2026 (»Dež ni utopil Vinske vigredi, kraljica je okronana«) — naslovi + datumi potrjeni prek iskalnika, URL-ji/tela nedostopni → vgradnja ob naslednjem oknu.
6. **Županič — dodatni poročevalci**: delo.si 7. 11. 2017 (»Svetovljan iz Gribelj«), radiokrka.svet24.si (»FOTO: Dr. Niko Županič – svetovljan iz Gribelj!«), SEM zgibanka 2016 (etno-muzej.si katalog: »Dr. Niko Zupanič: svetovljan iz Gribelj: ob 140. obletnici rojstva ustanovitelja SEM«, zbirka Zloženke), Odeon »Spominska razstava Dr. Niko Županič« (URL nedoločen).
7. **Kmetija Štrucelj — mlekomat**: go2farms.si (»Že od leta 2009 sta prva in še vedno edina mlekomata v Beli krajini … v Črnomlju in v Gribljah«) + STA/FB 5. 8. 2026 (Anton Štrucelj o odkupni ceni mleka) + TIS/bizi (Griblje 6, C10.510). Kandidat za nov zapis (gospodarstvo), ko bo telo vira dostopno.
8. **Svet24 starejši članki** (URL potrjen, telo nedostopno): »Spanje v podružnični šoli Griblje« (23. 6. 2011, id 63963/80795), »Zlato in srebro Inu Brežice, srebro pa tudi v Griblje« (23. 8. 2011, id 66264).
9. **dLib Slovenski narod 1874** (letnik 7, št. 140, 23. 6. 1874) — indeksna najdba brez URN; preveriti, ali izdaja vsebuje »Griblach«.

## FALSIFIKACIJE / poučne epizode

- **Peskovniški reset** sredi vala — obnova iz GitHuba brez izgube zgodovine; disciplinarni push = zavarovanje dela. Surovine, ki niso bile pushane, so izgubljene; NCBI viri so reproducibilni.
- **Iskalnik vrača samo domeno** za del člankov — URL lov posameznih objav ostaja večstopenjski; brez točnega URL-ja vir ne gre v register (muzejska disciplina).
- **JINA 401 (bad IP reputation)** — očaket opora vala 18/16 je padla; NCBI E-utilities postaja zanesljivejša nadomestna pot za znanstvene vire.
- Odeon »Gribeljčan…« piše rojstvo 11. 9. 1876 in smrt 1. 12. 1961 — SBL/Wikipedija obratno; **zapiši neskladje, ne utišaj** (drugi primer po dLib avtoriteti Katarine Županič, val 17).

## Surovine

`raw-web-val19-2026-10/` — rekreirane po resetu: n04-genbank-flat.txt (FJ495099/FJ495093/FJ495100), n05-pubmed-esummary.json (19410611/24335778/24209605/25632258), n10-araneae.xml + n10b-araneae-griblje-odlomek.txt. Izgubljene: iskalni JSON-i w*/u*/s* iz prvega teka (ključne vsebine citirane v tem dokumentu).
