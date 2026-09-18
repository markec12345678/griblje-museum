# 27. raziskovalni sklop — Panjska končnica, galerija pod streho čebelnjaka
*Digitalni vaški muzej Griblje · 18. 9. 2026*

## Izhodišče
Direktiva: »odlično nadaljuj raziskuj«. Po zaključku čebelarske niti (kranjska sivka,
92. zapis) je naravni nadaljevek njen »predmetni« dvojnik: poslikana deščica, ki je
zapirala kranjič — panjska končnica, edinstvena slovenska ljudska umetnost. Veže
konrad-barle (AŽ-panj, poslikane čele), kranjska-sivka (čebela) in pisanice (ljudsko
slikarstvo, register 2012).

## Metoda
- Wikipedia action API (curl, brez kvot): **Panjska končnica** (SL) — glavni vedenjski
  vir; **Micka Pavlič** (EN!) — biografija slikarke naše slike (članek obstaja le
  v angleščini)
- Commons API: kandidati za sliko (Lovčev pogreb 1891 / Job na gnoju 1891 / Svatba
  1891 — vsi javna last ~3300×1600); izbran **Lovčev pogreb**: slavni motiv, izbrana
  slika slovenske Wikipedije, slikarka znana po imenu (kategorija Commons:
  »Beehive panel paintings by Micka Pavlič«), hrani SEM (inv. 630lju0017086)
- **CDN omejitev**: upload.wikimedia.org/thumb.wikimedia.org sta po vrsti 429 vprašanj
  blokirala strojni IP (~1 h+); API končne točke (action API) delujejo normalno.
  Prenos slike se izvaja v ozadju (zanka /tmp/fetch-panel.sh, poskus na 3 minute).

## Odkritja

### Panjska končnica (Wikipedija SL)
- poslikana deščica, ki zapira čebelji panj **kranjič** (Žnideršičev članek: »najbolj
  razširjeni panj« pred AŽ)
- nastala na Gorenjskem in slovenskem Koroškem; razširjena po vsej Sloveniji
- najstarejše: **sredina 18. stoletja**; slikanje se v veliki meri konča **po 1. sv.
  vojni**
- **več kot 600 motivov** (približno polovica nabožnih); **več kot 50.000 končnic**
  v približno 150 letih
- namen: ločevanje panjev med seboj in od tujih; svetniški motivi naj bi varovali
  čebele
- **zlata doba 1820–1880**: posvetni motivi — zgodovinski/vojni dogodki, kmečki
  vsakdan, praznovanja, živali, obrt; humor, ki na igriv način zasmehuje moške in
  ženske
- znani motivi: Hudič babi brusi jezik · Mož se vrača pijan iz gostilne · Mlinar in
  njegova žena · Obiranje roja · Praznovanje · Babji mlin · Lisica, ki brije lovca ·
  Lovčev pogreb · Kmečka tožba · Žena, ki vleče moža iz gostilne · Mož, ki nosi ženo
  na križu
- **2018: poslikavanje panjskih končnic v Registru nesnovne kulturne dediščine**
  (zvrst uprizoritve in predstavitve, podzvrst likovni izrazi)
- danes: simboličen pomen, reprodukcije kot darilo/turistični spominek;
  »etnografska zakladnica Slovenije«

### Micka Pavlič (Wikipedija EN)
- *30. 3. 1821 Selca – †12. 9. 1891 Selca*; tudi Marija Pavlič, Podnartovčeva/Blažičeva
  Micka
- oče: ljudski slikar Andrej Pavlič (1790–1873) — učitelj; Micka ga je prekosila v
  poznih najstnajstih letih, odprla lastno delavnico v Selcah
- specializacije: končnice, slike na steklo (domači oltarčki), rezbarije (bridke
  mantre)
- tehnika: **šablone, prepuncane z drobnimi luknjicami** + prahaste barve (tresenje
  zameljčka) → ostre, žive barve, ki so ostale nedotaknjene desetletja
- **katalog: vsaj 141 motivov — 71 nabožnih, 70 posvetnih** (tudi kmetje, ki se
  prepirajo za živino = kmečka tožba; bojni prizori; Turk s pipco)
- učila vnuka sestre **Petra Žmitka** (kasneje znan slovenski slikar)
- neporočena, brez otrok; živela sama z dvema kozama; slikala do smrti
- dela hranita **SEM** in **Loški muzej Škofja Loka**
- **umrla 12. 9. 1891 — v letu naše slike** (Lovčev pogreb, 1891)

### Slika: Lovčev pogreb (Commons, javna last)
- 3286×1609, les, 1891; slikarka: Micka Pavlič; SEM, inv. panjske-koncnice/630lju0017086
- kategorije: Featured pictures on Wikipedia, Slovenian · Beehive panel paintings by
  Micka Pavlič · Beehive panel paintings in SEM · PD-Art (PD-old-100)
- dostopna tudi prek SEM spletišča? — digitalna zbirka »panji« obstaja
  (etno-muzej.si/sl/digitalne-zbirke/panji), a predmeta 630lju0017086 med prvimi
  stranmi ni (ispanje: ~280 predmetov prvih 8 strani, brez zadetka)

## Zapis 93: panjska-koncnica (kategorija sege, DOCUMENTED)
- naslov: »Panjska končnica — galerija pod streho čebelnjaka« / »The panjska končnica —
  the gallery under the apiary roof«
- perioda: sredina 18. st. → danes · zlata doba 1820–1880 · nesnovna dediščina 2018
- zgodba 5 odstavkov SL+EN: kranjič → namen (ločevanje panjev, svetniki varujejo) →
  zlata doba in humor → Micka Pavlič (141 motivov, umrla v letu slike) → Bela krajina
  (Barle, poslikana čela) + register 2018 + sestra pisanic (2012 : 2018)
- 3 viri: Wikipedija SL (Panjska končnica), Wikipedija EN (Micka Pavlič), Commons
  (Lovčev pogreb, PD-Art)
- integracije: minutna zgodba · zapis meseca JULIJ (obiranje roja — motiv!) · postaja
  sprehoda »Vas in njeni ljudje« (za pisanicami — sestri umetnosti) · biografija 6 faz ·
  števci 92→93 × 5 jezikov
- revizija: audit-numbers — vse oznake so znani razred beseda↔števka (šeststo/six
  hundred, petdeset tisoč/fifty thousand, sto enainštirideset/a hundred and forty-one,
  enainsedemdeset/seventy-one, sedemdeset/seventy) — ročno preverjeno, popolna
  usklajenost SL↔EN
- kuratorska strogoost: umaknjeni neviri trditvi (etimologija kranjiča po Kranjski —
  ni v virih; sv. Florijan kot primer svetniškega motiva — zamenjan z Jezusovim
  krstom, ki je dokumentiran motiv)

## Odprto
1. **Prenos slike** (CDN 429): zanka /tmp/fetch-panel.sh vsakih 3 min; ko uspe →
   sharp optimizacija → visual-fingerprints (93/93) → image-dimensions → reseed →
   verifikacija → commit
2. VLM kvota (44–97/98 španka — zanka PID 19077 teče naprej)
3. SEM digitalna zbirka panji — iskanje predmeta 17086 (morda na kasnejših straneh)
4. Muzej išče (iz zapisa): panjsko končnico z belokranjskega čebelnjaka
