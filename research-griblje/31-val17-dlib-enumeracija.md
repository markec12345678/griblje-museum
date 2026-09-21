# 31. val raziskave — dLib.si enumeracija (17. val)

**Sklop:** 66 · **Datum:** 21. 9. 2026 · **Naročilo:** »odlicno nadaljuj raziskuj« (po sklopih 61–65)
**Vezana opomba:** dLib polnotekstovna enumeracija je bila v valu 16 označena kot »največja nepopisana površina — lasten val« (results 404/timeout).

---

## 1. Metodološki preboj — kako prišteti dLib

Neposredna pot na dLib.si iz peskovnika je mrtva v obeh smerih:

| pot | rezultat |
|---|---|
| curl (IPv4 + brskalni UA) | 000 / timeout — DNS reši prav (193.2.8.28, ARNES), a povezava ne gre skozi peskovniško omrežje |
| page_reader (JINA) na `/results/?query=` ali `/results/?EuAPI=on&fts=off&q=…` | 404 IIS »File or directory not found« — rezultati zahtevajo sejo/POST |
| page_reader na OAI-PMH `/oai-pmh/?verb=Identify` | »Malicious request« — WAF blokira parametre |
| page_reader na `/stream/…/PDF` in `/stream/…/TEXT` | preusmeritev na details (JINA ne prenese surovih tokov) |

**Rešitev = hibridna enumeracija:**
1. **web_search z »dlib.si« kot pojmom** (operator site: se ne upošteva zanesljivo, a pojmovna poizvedba vrača indeksirane predmetne strani) → najdi URN-je;
2. **page_reader na `/details/URN:NBN:SI:doc-XXXX`** — ta format deluje brez seje in vrne polno strani (97 kB);
3. **page_reader na `/URN:NBN:SI:doc-XXXX/DC/JSON`** — *ključni izkupiček*: dLib javno vrača Dublin Core metapodatke kot JSON/XML tudi prek JINA (kreator, datiranje, ISSN, COBISS ID, URN, založnik, pravice, vse predmetnice). To je dejanski brezsejni API dLiba, doslej nepopisan.

Enumerirane poizvedbe (surovine `raw-web-val17-2026-10/`): `site:dlib.si griblje`, `site:dlib.si gribelj`, `dlib.si "Griblje" Bela krajina Metlika`, `dlib.si "gribeljski|gribeljska|iz Gribelj"`, `site:dlib.si Podzemelj|Adlešiči|Krasinec`, `"www.dlib.si" griblje OR gribelj`, CONOR/COBISS identifikacija avtoritete.

**Sklep enumeracije:** Googlov indeks dLiba za Griblje je izčrpan — dva predmeta, oba zgrajena v ta val. Iskalnik ne indeksira celotnega fonda; naslednja stopnja bi zahtevala registrirano sejo ali izven-peskovniško omrežje (dokumentirano kot meja, ne kot nič).

---

## 2. Predmet 1 — Šopek poljskih cvetlic iz Gribelj (URN:NBN:SI:doc-NR7PHRCK)

Članek, ki ga muzej vsebinsko že nosi (MVG-043), zdaj **prvič ima URL in kanonsko citacijo**:

- **Avtorica (podpis):** Katarina Zupanič · **Objava:** Etnolog (Ljubljana), knj. 10/11 (1937–1939), str. 114–146 · ISSN 0353-4855 · založil Etnografski muzej · COBISS.SS-ID 239469568 · URN:NBN:SI:doc-NR7PHRCK
- **Predmetnice (dLib):** biografije · etnologija · **Griblje ob Kolpi** · ljudsko slovstvo (oral literature) · slovensko ljudsko slovstvo · Zupanič, Katarina, 1894–1985 · **Zupanič, Milko, 1841–1911**
- **Pravice:** InC (In Copyright) — prost dostop do PDF-ja od 14. 10. 2013 (doslednost z muzejsko prakso: vir in citiranje, ne prikazne slike)

### Identitetno neskladje — odprto vprašanje, dokumentirano
Muzej (po SBL, Vilko Novak — »Mati Katarina, v Gribljah r. nov. 1855 kmetu Juriju Pezdircu (po dom. pri Grizinu) in Katarini r. Starašinič ter u. 23. jul. 1923, je 1894–5 … na njegovo željo zbrala in zapisala …: Šopek poljskih cvetlic iz Gribelj v Bela Krajini (Et 1937/9; oc. B. Orel, S 1937, št. 122)«) pripisuje zapis materi Katarini r. Pezdirc (1855–1923), objavljenemu posmrtno. dLibova avtoriteta pa nosi **»Zupanič, Katarina, 1894–1985«** — letnici, ki se z SBL ne ujemata in ena drugo izključujeta (zapisovalka je delovala 1894/95, oseba r. 1894 bi bila tedaj dojenček; oseba u. 1923 ne more podpisati izdaj 1937/9). Zunanjepeskovniški viri (CONOR/COBISS, MyHeritage rodoslovje) razrešitve ne ponujajo. **Muzejska odločitev:** zgodba ostane na SBL kot najavtoritetnejšem viru; neskladje avtoritet se izrecno zapiše v opombo vira in se rešuje nadalje (primeren vir: rokopisna zapuščina, Etnologova uredniška okoliščina zvezka 10/11, morda SEM-ov arhiv).

### Vgrajeno
- **MVG-043** — vir `etnolog-sopek` nadgrajen: + URL `https://www.dlib.si/?URN=URN:NBN:SI:doc-NR7PHRCK`, naslov dopolnjen z dLib citacijo (knj. 10/11, str. 114–146), opomba razširjena (ISSN, založnik, InC, datum prostega dostopa, neskladje avtoritet). Brez novega vira-ključa (isti vir, bogatejša dokumentacija).
- **MVG-010** — vir `zupanic-sopek` (navedba Županičevega zbornika po Wikipediji) dobi vezavo: kanonska dLib citacija kaže na isti tisk (Etnolog 10/11, 1937–1939) z izrecnim sklicem na polni zapis MVG-043 — notranja konsistentnost registra.

---

## 3. Predmet 2 — Dr. Niko Zupanič, svetovljan iz Gribelj (URN:NBN:SI:doc-1K9KVK42) — NOV VIR

- **Avtorica:** Račič, Mojca · **Objava:** Etnolog. Nova vrsta (Ljubljana), letn. 27 = 78 (2017), str. 195–198 · ISSN 0354-0316 · založil Slovenski etnografski muzej · predmetnice: biografije · slovenski etnologi · **Županič, Niko, 1876–1961**
- **Pomembnost:** biografska skica v SEM-ovi seriji o slovenskih etnologihih — muzej, ki ga je Županič ustanovil, ga v svoji reviji naslavlja z naslovom, ki ponavlja domačo formulo (Dolenjski list 2016: »svetovljan iz Gribelj!«). Znanstveno naslavljanje s podnaslovom vasi.
- **Vgrajeno (add-only, +1 vir: 514→515, identitet 404→405, deljenih 60):**
  - **MVG-010** — nov vir `racic-etnolog-2017` (objava, »avtorsko delo (navedba)«, URL dLib, polna citacija + opomba o izvoru najdbe v 17. valu) + nov zgodbeni odstavek SL/EN (znanstvena hiša mu vrača ime; biografski krog: rojen v vasi, naslovljen z vaso, ohranjen v muzeju, ki ga je dal slovenski etnologiji).

**Dedup:** Mojca Račič (avtorica vira) ne dobi entitete (enkratni citat — praksa lijaka); Račič ≠ Božo Račič (38. sklop, druga oseba); MVG-010 vir Promitzer 1990s ostaja (druga razprava); Odeon članek o žbulu (21. 9. 2026) = **že vir** (dodan v valu 15, URL identičen — dedup potrjen ob svežem objavljenem nadaljevanju LU Črnomelj vsebine).

---

## 4. Poučne epizode

1. **dLib avtoriteta v DC/JSON se lahko razlikuje od biografskih leksikonov** — ko ga citiraš, zapiši neskladje, ne utišaj.
2. **JINA-reader je page_readerov motor** (napaka 422 razkriva izvajalca) — zanj so objektne strani dosegljive, iskalni rezultati (seja) in surovi tokovi ne.
3. **Ubežani narekovaji `\"` v EN odstavkih** — ponovitev vala 14/15 pasti; tsc + grep ubežnih mest kot varovalka.
4. **`site:` operator ni zanesljiv** — pojmovne poizvedbe z »dlib.si« v narekovajih dajo več.

---

## 5. Stanje po valu

| merilo | vrednost |
|---|---|
| zapisi | 101 (MVG-001–101) |
| viri | **515** (512→514→515) |
| identitet virov | **405** |
| deljenih virov | 60 |
| entitet | 94 |
| sitemap | 102 |
| i18n | 946 × 5 |
| API poti | 13 |

**Regresija (živi :3000):** tsc 0 · eslint čist · verify-i18n 946×5 · audit-entities ✓ (515/405/60/372) · audit-timeline-map 39 ✓/0 · audit-iiif-annotations 5 ✓/0 (372/372) · test-entities 100 ✓/0 · test-timeline-map 72 ✓/0 · test-ai-curator 214 ✓/0 · red-team 157 ✓/0 (GAP 24) · test-plan-visit 42 ✓/0 · reseeda (izrecni DATABASE_URL) → OpenData **101/515** živo.

**Brskalniška/API preverba:** `/exponat/niko-zupanic` prikazuje Račičev odstavek + vir `doc-1K9KVK42`; `/exponat/katarina-zupanic` prikazuje dLib URL + neskladje avtoritet (1894–1985); 0 napak.

---

## 6. Kaj ostaja

- **Neskladje avtoritet Katarine Zupanič** (SBL 1855–1923 ↔ dLib 1894–1985) — odprto vprašanje, zapisano v opombi vira; smiselna pot rešitve: SEM arhiv / uredniška zapisa zvezka 10/11.
- **dLib pod sejo** — celoten fond (stari tiski, matice, časopisni arhiv) ostaja nedostopen iz peskovnika brez registracije; izven-peskovniški val.
- **Vrzel #3 iz benchmarka** (avtentične 360° panorame — zbiranje od vaščanov) — edina preostala iz benchmarka, TO_COLLECT.

**Surovine:** `raw-web-val17-2026-10/` — d01–d15 (dLib poskusi + DC zapisi + SBL + SEM avtorska stran + Odeon dedup), w01–w10 (web_search enumeracija).
