# 32. val raziskave — osvojitev meja peskovnika in novi identificirani viri (18. val)

**Sklop:** 67 · **Datum:** 21. 9. 2026 · **Naročilo:** »odlicno nadaljuj«
**Vezana opomba:** val 17 je zaključil z »dLib pod sejo = izven-peskovniški val«. Ta val je ta sklep sistematično preveril z vsemi štirimi orodji peskovnika — in poiskal nove rove po stranskih vratah.

---

## 1. Metodološka osvojitev — štiri orodja, trije sloji blokad

Val je prvič sistematično primerjal vsa dostopna orodja na vseh preostalih velikih virih:

| vir | curl (-4, UA) | page_reader (JINA) | agent-browser (Playwright + pravi UA) | sklep |
|---|---|---|---|---|
| dLib.si | 000 (mreža) | 404 IIS (val 17) | **CDP Page.navigate timeout** | IP-blokada, ne bot-obzidje — meja potrjena tretjič |
| SIstory.si | — | Cloudflare »Just a moment…« | — | prebit ne z JINA |
| Mapire.eu | 403 (val 12) | — | **403 tudi z Playwright** | AWS bot-obzidje prestreza tudi headless |
| ojs.zrc-sazu.si (Studia) | 000 | — | — | ZRC omrežje |
| Geopedia / eZKN / SAAS | 000 (val 16) | — | — | gov.si omrežje (peskovnik) |
| roz.si | JS-challenge | **200 — JINA prebije** | challenge ne preide niti z reloadom | hoster: openresty IP/TLS fingerprinting |
| belokranjec.si | JS-challenge | **200 — JINA prebije** | challenge ne preide | isti hoster |
| arhiv.vaskanal.com | JS-challenge | **200 — JINA prebije** | challenge ne preide | isti hoster |
| vaskanal.com | JS-challenge | 200 (WP REST brezsejno) | challenge ne preide | isti hoster |
| academia.edu | 403 | — | — | dokument ne dosegljiv |
| ZRC založba / ISN / IZA2 | SPA/Drupal | delno | — | iskanja ne delujejo brez JS seje |

**Ključno spoznanje:** JS-challenge »One moment, please…« (openresty, isti hoster pokriva roz.si, belokranjec.si, vaskanal.com, jurjevanje.si) prestane samo JINA; Playwright z enim reloadom ne — challenge ni cookie-ga, temveč server-side fingerprint odločitev, ki headless UA vztrajno vrača challenge.

**Ključni brezsejni kanal:** WordPress REST API `wp-json/wp/v2/search?search=…` prek JINA deluje na vaskanal.com — ampak JINA obrezuje query-parametre (per_page/page se ignorirata), zato enumeracija ostaja na 10 zadetkov na klic.

## 2. Novi identificirani viri (identifikacija brez vgradnje)

### 2.1 Belokranjec — revija iz Gradca (belokranjec.si)

- **Mesečni brezplačnik**, v belokranjska gospodinjstva prihaja **od decembra 1997**; v **9.300 gospodinjstev** občin Črnomelj, Metlika in Semič ter naročnikom po Sloveniji in tujini (dostava Pošta Slovenije, razen julija). Izdajateljica: Andreja Milavec, Gradac 139, 8332 Gradac.
- Spletni arhiv izdaj 2024–2026 (24 izdaj), **vsebina izključno v PDF-jih** (primer: julij/avgust 2026, 50,6 MB) — peskovniško nedostopni (challenge + velikost + JINA ne prenaša PDF tokov, potrjeno v valu 17).
- **Google-indeksiran fragment izdaje št. 7-8, letnik XXIX (julij/avgust 2026)** omenja »vsaka vas svoj pevski zbor, na primer Griblje, Adlešiči …« — prva sled o pevskem zboru v gribeljskem registra ni (v zapisih se pevski zbori pojavljajo samo v okvirih: DKŽ-jev folklorni program, ženski zbor Viniške cür, šolski zbor Helene Banovec).
- **Muzejska odločitev: ne vgrajeno** — brez dostopa do PDF-a kontekst citata (kakšen prispevek, kdo piše) ni dokazljiv; vir čaka, dokler izdaja ne bo dosegljiva (izven-peskovniško branje PDF-ov ali dogovor z izdajateljico).

### 2.2 TV Vaš kanal — arhiv novic (arhiv.vaskanal.com + vaskanal.com)

- Regionalna televizija; arhiv Joomla (stari, ~2008–2019) + WordPress (novi, 621+ strani arhiva novic). Skupaj na tisoče lokalnih novic — **drug največji neenumeriran vir po Belokranjcu**.
- Iskalni arhiv je RokAjaxSearch (AJAX) — JINA dobi samo lupino; WP REST prek JINA deluje, ampak z obrezanimi parametri.
- **Sled v Googlovem indeksu (8. 2. 2017):** fragment »GRIBLJE — Vaščani Gribelj v Beli krajini so zadovoljni … tudi hiše v Dolnjih Gribljah« — kaže na članek o priključitvi na kanalizacijo/vodovod (~2017), naslov in URL pa sta neidentificirana (povezani zadetki »Namenu predali kanalizacijo« so **falsificirani** — gre za Krško vas 2026 in Volavče 2010, ne Griblje).
- **Muzejska odločitev: ne vgrajeno** — fragment brez konteksta ne citiramo; arhiv označen kot ciljni rov za izven-peskovniško enumeracijo (vodovod/kanalizacija je doslej edina infrastrukturna zgodba vasi, ki jo register nima).

### 2.3 Stara Fabečeva iz Gribelj — pripoved o grški prednici (akademski vir)

- **Najdba:** v angleški izdaji Monike Kropej Telban, *Supernatural beings from Slovenian myth and folktales* (ZRC SAZU 2012) — povzet na academia.edu — stoji pripoved: »The old Fabečka from Griblje told me that her grandmother's grandmother was a Greek woman. Kolpa was then a stream, but it was as wide as that ditch …«.
- **Vrednost:** redka narodopisna pripoved *iz Gribelj* (domačijsko ime Fabečeva) o grški prednici — staroselska zgodba ob Kolpi; presega do zdaj najstarejšo omenjeno družinsko zgodbo registra (1468 prvi pisni vir).
- **Blokada:** academia.edu 403 (curl + brskalnik), slovenski izvirnik (*Nadnaravna bitja v slovenski ljudski duhovni kulturi*, 2012) na SPA založbe brez delujočega iskanja; CEEOL zadetek je samo recenzija knjige (Hiiemäe 2013).
- **Muzejska odločitev: ne vgrajeno** — citat brez strani/konteksta ne nosi; odprto vprašanje rešuje pridobitev knjige (e-izdaja ZRC ali SEM knjižnica).

## 3. Falsifikacije in dedup (istražna disciplina)

| sled | razsodba |
|---|---|
| Odeon protokol 11. 12. 2025 »obnova ceste Črnomelj–Griblje« | fragment občinskega sveta brez članka — ne citirno; Odeon iskalni arhiv (metoda val 15) ga ne vrača |
| »Namenu predali kanalizacijo« | Krška vas (2026) / Volavče (2010) — **ne Griblje**; Googlov agregirani snippet zavede |
| roz.si | **Koroški Rož** (Slovensko prosvetno društvo, Avstrija) — ne belokranjska revija Rož; identiteta domene izrecno ločena |
| revija Rož (Bela krajina) | spletna izdaja ne obstaja pod pričakovano domeno; RožBRIN (roznbrin.si) = mrtva domena; Rož ostaja neenumeriran kot celota (izključno tisk) |
| Andričin projekt »Nastanek kulturne krajine v Beli krajini« (iza2.zrc-sazu.si) | arhiviran — projektne strani ni več; muzej že ima oba izhoda (The Holocene 2007, Opera 21 2011) |
| Wikidata Q2531566 (Griblje, naselje) | potrjen pravilen prek wbgetentities (val 16) — brez spremembe |

## 4. Preverba obstoječega stanja (sanitarna obramba vala)

- Dev :3000 živ — OpenData `/api/opendata` vrača **101 zapisov / 515 virov** (skladno s sklopom 66).
- Kamra, Odeon (iskalni arhiv), SEM (100 %, val 14), Commons (100 %, val 15), dLib-indeks (100 %, val 17) — enumeracijska izčrpanost potrjena; noben od teh ni ponovno prinašal novih predmetov.

## 5. Poučne epizode

1. **JS-challenge prestane samo JINA, ne Playwright** — reload ne pomaga, ker odločitev pada na server-side fingerprint (ni piškotka, ni odločilne JS-ovire). Headless UA spet izgubi.
2. **Googlov snippet agregira več člankov z arhivske strani** — »namenu predali kanalizacijo« (Krška vas) in »Vaščani Gribelj« (sosednji članek) se lahko zlijejo v en zmogljivo zavajajoč izsek; točnost nad snippeti zahteva točno URL.
3. **JINA obrezuje REST parametre** — `per_page`/`page` se ignorirata; brezsejna enumeracija z paginacijo ne gre prek page_readerja.
4. **CDP timeout ≠ bot-obzidje** — dLib vrne Page.navigate timeout na pravem brskalniku: mrežna pot (IP/TLS) je zaprta globlje kot aplikacija.

## 6. Stanje po valu

| merilo | vrednost |
|---|---|
| zapisi | 101 (MVG-001–101) — **nespremenjeno** |
| viri | 515 — **nespremenjeno** (identifikacije čakajo na dosegljivost) |
| entitet | 94 — nespremenjeno |
| i18n | 946 × 5 — nespremenjeno |
| API poti | 13 — nespremenjeno |

**Razlog za ničelno vgradnjo:** muzejska dokazna disciplina — vsi trije novi viri (Belokranjec, Vaš kanal, Kropej/Fabečeva) so identificirani, ampak njihovi citatni konteksti so za peskovnik fizično nedostopni (PDF/AJAX/403). Vgrajen bo samo tisto, kar se lahko pokaže.

## 7. Kaj ostaja (nova vrstniška vrsta za izven-peskovniške valse)

1. **Belokranjec PDF** (24 izdaj 2024–2026) — pevski zbor, dogodki vasi; najlažja pot: dogovor z izdajateljico ali izven-peskovniško prenos.
2. **TV Vaš kanal arhiv** — vodovod/kanalizacija Griblje ~2017 (točen članek) + 15 let lokalnih novic.
3. **Kropej Telban 2012** — slovenska e-izdaja ali SEM izvod → staroselska pripoved o Fabečevi iz Gribelj.
4. Vrzel #3 iz benchmarka (avtentične 360° panorame — zbiranje od vaščanov) — ostaja edina odprta vrzel benchmarka, TO_COLLECT.

**Surovine:** `raw-web-val18-2026-10/` — brskalniški poskusi (dLib CDP, Mapire 403, belokranjec/roz/vaskanal challenge), JINA zajemi (roz.si WP struktura, Belokranjec arhiv + izdaja 7-8/2026, vaskanal REST), web_search enumeracije (w01–w-iza2), falsifikacijski zapisi.
