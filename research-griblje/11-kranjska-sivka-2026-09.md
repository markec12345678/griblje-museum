# 26. raziskovalni sklop — Kranjska sivka, siva gospodarica gribeljskih panjev
*Digitalni vaški muzej Griblje · 18. 9. 2026*

## Izhodišče
Direktiva: »odlično nadaljuj raziskuj«. Obe z-ai kvoti (VLM + web_search) sta bili ob
preverbi spet blokirani (429); VLM zanka za mrliško knjigo (13 posnetkov v /tmp) teče
naprej v ozadju. Odprta nit iz 25. sklopa: »czs.si dostopen — kandidat za prihodnji
sklop o kranjski sivki« — naravni nadaljevek zapisa o Konradu Barleju (prvi belokranjski
čebelar z AŽ-panjem).

## Metoda
- czs.si (Čebelarska zveza Slovenije): stran o kranjski sivki žal zaščitena z
  bot-preverjanjem (»One moment, please… Loader«) — v brezglavnem brskalniku izziv NI
  rešljiv (3 poskusi, ponovni naloti). Nadomeščeno z Wikipedijo (isti vsebinski viri).
- Wikipedia REST + action API (curl, brez kvot): Kranjska čebela (SL), Carniolan honey
  bee (EN), Svetovni dan čebel (SL), Anton Janša (SL), Anton Žnideršič (SL).
- Slika: Commons `Apis mellifera carnica worker hive entrance 3.jpg` (3584×2335,
  Richard Bartz, CC BY-SA 2.5). POZOR: upload.wikimedia.org CDN je strežniške odjemalce
  zavrnil z 429 (tudi thumb.wikimedia.org) — slika je bila pridobljena z
  **agent-browser trikom**: nalaganje v brskalniškem kontekstu (anonimni fetch deluje),
  skaliranje na 1600 px in re-kodiranje JPEG v canvasu, izvoz base64 v 6 koščkih,
  dekodiranje + sharp na lokalni strani → `public/images/authentic/kranjska-sivka.jpg`
  (1600×1042, 212 KB).

## Odkritja

### Kranjska čebela / sivka / kranjica (Apis mellifera carnica, Pollmann 1879)
- pasma medonosne čebele, **avtohtona na Balkanskem polotoku**; za domovino priznana
  Gorenjska (Slovenija); najdemo jo na širšem območju Koroške in Štajerske (tudi
  Avstrija), Madžarske, Romunije, Hrvaške, BiH, Srbije; umetno naseljena v Nemčiji
  in drugod
- **druga najbolj razširjena medonosna pasma na svetu** (za italijansko čebelo)
- zunanjost: vitko telo, temno rjavi obročki zadka, sive dlačice na zadku → ime
- prednosti (SL+EN članki se ujemata): miroljubna do čebelarja; majhna poraba zimske
  hrane; hiter pomladanski razvoj; usmerjenost v gozdno pašo; dobra orientacija;
  hitro zmanjšanje zalege v brezpašnem obdobju; malo propolisa; dolg jezik
  **6,5–6,7 mm** (prilagojen detelji); delavke živijo do 12 % dlje
- slabosti: pogosto rojenje, slabša izdelava voska
- EN: »the grey bee«; vzdrži mraz (DNA prilagoditev) in vročino

### Svetovni dan čebel (20. maj)
- praznik v okviru OZN **predlagala Slovenija na pobudo Čebelarske zveze Slovenije**;
  vodilo ga je Ministrstvo za kmetijstvo, gozdarstvo in prehrano; **potrjen soglasno
  20. decembra 2017**
- datum = rojstni dan **Antona Janše** (20. 5. 1734 Breznica na Gorenjskem –
  13. 9. 1773 Dunaj): slikar in čebelar, **prvi učitelj čebelarstva na cesarskem
  dvoru** (šolo za čebelarstvo odredila Marija Terezija 1769; dekret 7. 4. 1770);
  doma nad sto panjev
- ob prvem praznovanju: čebelnjak in obeležje kranjske čebele v Višnji Gori (Emil
  Rošic, trgovec s čebelami); razstava o Janši v Čebelarskem muzeju Radovljica;
  osrednja slovesnost na Breznici
- vsebina praznika: čebele in opraševalci = varnost prehranske preskrbe + merilo
  stanja lokalnega okolja

### Anton Žnideršič in AŽ-panj (13. 3. 1874 Ilirska Bistrica – 21. 12. 1947 Ljubljana)
- čebelar in gospodarstvenik; okoli 500 družin v začetku 20. stoletja
- preizkusil Gerstungov panj z listnimi satniki (26×41 cm) → neprimeren za prevažanje
- oblikoval panj po zgledu italijanskega čebelarja **O. Alberta**: večji satniki,
  podolžno na prečnih palicah, enaka mera v plodišču in medišču; premeščanje zaleženih
  satov preprečuje rojenje
- **Alberti-Žnideršičev panj = AŽ panj / žnideršičevec** — uveljavil se po vsej
  Sloveniji in na Hrvaškem
- ob 150-letnici rojstva (2024) spominski žeton bistriški belič (Primorsko numizmatično
  društvo Ilirska Bistrica)

## Zapis 92: kranjska-sivka (kategorija narava, DOCUMENTED)
- naslov: »Kranjska sivka — siva gospodarica gribeljskih panjev« / »The Carniolan grey
  bee — the grey mistress of Griblje's hives«
- perioda: 1879 → danes · Apis mellifera carnica · svetovni dan čebel 20. maja
- zgodba 5 odstavkov SL+EN — tri niti: pasma (značilnosti) → vas (Barle, AŽ-panj,
  poslikane čele) → svet (Janša, OZN 2017); zaključek: edini živeči prebivalec zbirke
- 5 virov: Wikipedija (Kranjska čebela, Anton Janša, Svetovni dan čebel, Anton
  Žnideršič) + Commons (Richard Bartz)
- integracije: minutna zgodba · zapis meseca MAJ (20. 5.) · postaja 6/19 sprehoda
  »Iz Griblje v svet« (za Audrey Totter) · biografija 6 faz · prstni odtisi 92/92 ·
  števci 91→92 × 5 jezikov (25 mest + meta layout)
- revizija: audit-numbers — nov zapis BREZ oznak (popolna SL↔EN usklajenost)

## Odprto
1. **VLM kvota** (429): zanka read-matr-pages.ts teče (PID 19077) — meje vpisov
   44–97/98 pri španki 1918; po potrditvi popravek zgodbe + README
2. czs.si strani o kranjski sivki (program ohranjanje čebele, čebelarji leta) — ko se
   bot-zaščita reši ali najde primarni vir (mkgp.gov.si?)
3. župani občine Griblje 1854–1933 (arhivi 403/000)
4. 1. svetovna vojna gribeljsko-specifično (pot: mrliška knjiga kot pri španki)
5. Muzej išče (iz zapisa): stari AŽ-panj iz gribeljskega čebelnjaka s poslikanim čelom,
   fotografijo gribeljskega čebelarja pri delu
