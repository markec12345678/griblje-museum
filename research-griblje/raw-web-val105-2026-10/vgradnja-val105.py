# Val 105 — vgradnja v src/lib/museum-content.ts (add-only, dobesedne zamenjave)
# Pouk vala 97: \n\n v story nizih je LITERAL (JS escape) — uporabljam raw stringe.
# Vsako urejanje ima unikaten sidro (preverjeno z count==1 pred izvedbo).
import sys

PATH = "/home/z/griblje-museum/src/lib/museum-content.ts"
src = open(PATH, encoding="utf-8").read()
orig = src

def rep(old, new, label):
    global src
    n = src.count(old)
    if n != 1:
        print(f"ANKAR NI UNIKATEN ({n}): {label}")
        sys.exit(1)
    src = src.replace(old, new)
    print(f"OK: {label}")

# ---------- 1/2: vs-42 (G1/G4) — zvezek najden, sken brez besedilne plasti ----------
rep(
    "; točna bibliografska identiteta (leto zvezka) REVIEW.\"",
    "; točna bibliografska identiteta (leto zvezka) REVIEW. (Doplnilo 105. vala: zvezek najden javno na zvkds.si — datoteka »042_2006_varstvo_spomenikov_porocila«, ime datoteke kot kazalnik letnice zvezka, kolofon še nepreverjen; PDF je čisti sken brez besedilne plasti, 45,8 MB, sha256 404dbb07…, artefakt zabeležen v raw-web-val105-2026-10 — vsebina čaka OCR/VLM branje.)\"",
    "vs-42 noteSi",
)
rep(
    "; the exact bibliographic identity (volume year) REVIEW.\"",
    "; the exact bibliographic identity (volume year) REVIEW. (Wave 105 supplement: the volume found publicly at zvkds.si — file '042_2006_varstvo_spomenikov_porocila', the filename as an indicator of the volume year, the colophon still unverified; the PDF is a pure scan without a text layer, 45.8 MB, sha256 404dbb07…, artefact recorded in raw-web-val105-2026-10 — the content awaits OCR/VLM reading.)\"",
    "vs-42 noteEn",
)

# ---------- 3/4: vs-48 — zvezek prebran v celoti, REVIEW letnica razrešena ----------
rep(
    "Status: VERIFIED (uradna strokovna objava ZVKDS).\"",
    "(Doplnilo 105. vala — zvezek prebran v celoti, javni PDF zvkds.si, sha256 a501f7dc…): bibliografska identiteta RAZREŠENA — Varstvo spomenikov, Poročila 48, izšlo Ljubljana 2013 (ISSN 1580-5166; kolofon »Ljubljana 2013«), zvezek zajema poročila o delih leta 2010 in 2011; muzejska »2011« = leto izkopavanj, »2013« = leto izida — obe letnici združljivi. Članek o izkopavanjih na parceli 15/3 = vnos 30, str. 74–76, podpisala Alja Žorž. Polno branje potrjuje kuratorski zapis in dopolnjuje: sektor 1; tipološka analiza keramike → virovitiška kulturna skupina (bronasta doba), vzhodnoneolitske in vučedolske skupine (eneolitik) — kultura, ki jo poročilo 2023 na parceli 67/3 piše kot »vitovitiška«, zvezek kot »virovitiška«; kamnina — brusi in žrmlje iz peščenjakov/konglomeratov, izstopata večja fino retuširana klina in sveder iz finozrnatih rožencev, malo odpadnega materiala → orodje tu le dodelano/izboljšano, le redko izdelano od začetka; nekateri odlomki lončenine in opeke → ljudje tudi v rimskem obdobju in zgodnjem srednjem veku; koncentracija ostalin osrednje in vzhodno → naselbina se je širila severno in vzhodno od izkopnega polja; etimologija po Snoj 2009, 153 (hrvaška griblja »brazda (na njivi)« ali griva »s travo poraslo območje«); širši prostor: poselitev ~700 m širok pas ob robu prve terase Kolpe (citat Mason 2009); geološka podlaga: pliokvartarni sedimenti Kolpe; fotografija ostalin faz II a/II b (neolitik/eneolitik) na str. 76. Poročilo izrecno poudari poštenost: »z arheološko metodo trajno odstranili in uničili del skupne kulturne dediščine«. Status: VERIFIED (polno branje primarnega vira; doslej kuratorski zapis).\"",
    "vs-48 noteSi",
)
rep(
    "Status: VERIFIED (official IPCHS scholarly publication).\"",
    "(Wave 105 supplement — the volume read in full, public PDF at zvkds.si, sha256 a501f7dc…): bibliographic identity RESOLVED — Varstvo spomenikov, Poročila 48, published Ljubljana 2013 (ISSN 1580-5166; colophon 'Ljubljana 2013'), the volume covers the reports of the works of 2010 and 2011; the museum's '2011' = the year of the excavations, '2013' = the year of publication — the two dates are compatible. The article on the excavations at parcel 15/3 = entry 30, pp. 74–76, signed by Alja Žorž. The full reading confirms the curator's record and adds: sector 1; the typological analysis of the pottery → the Virovitica cultural group (Bronze Age), the eastern-Neolithic and Vučedol groups (Eneolithic) — the culture spelled 'vitovitiška' by the 2023 report at parcel 67/3 and 'virovitiška' by the volume; the stone industry — grinders and querns of sandstone/conglomerate, a larger finely retouched blade and a boring tool of fine-grained chert stand out, little waste material → tools were only finished/improved here, rarely made from scratch; some sherds of pottery and brick → people also in the Roman period and the Early Middle Ages; the concentration of remains central and eastern → the settlement spread north and east beyond the excavation field; etymology after Snoj 2009, 153 (Croatian griblja 'a furrow (in a field)' or griva 'an area overgrown with grass'); the wider area: settlement in a band c. 700 m wide along the edge of the first Kolpa terrace (quoting Mason 2009); the geological base: Pliocene-Quaternary sediments of the Kolpa; a photograph of the remains of phases II a/II b (Neolithic/Eneolithic) on p. 76. The report stresses its own honesty: 'with the archaeological method we permanently removed and destroyed a part of the shared cultural heritage'. Status: VERIFIED (full reading of the primary source; previously the curator's record).\"",
    "vs-48 noteEn",
)

# ---------- 5/6: 23-0168 note — REVIEW letnica razrešena ----------
rep(
    "(VS 48 še ni bil prebran v celoti). Status:",
    "(VS 48 še ni bil prebran v celoti). (Doplnilo 105. vala: RAZREŠENO — zvezek VS 48 je prebran v celoti; izšel Ljubljana 2013, zajema poročila o delih 2010 in 2011: »2011« = leto izkopavanj, »2013« = leto izida — obe letnici združljivi, neskladje razrešeno.) Status:",
    "23-0168 noteSi",
)
rep(
    "(VS 48 has not been read in full). Status:",
    "(VS 48 has not been read in full). (Wave 105 supplement: RESOLVED — the VS 48 volume has been read in full; published in Ljubljana 2013, it covers the reports of the works of 2010 and 2011: '2011' = the year of the excavations, '2013' = the year of publication — the two dates are compatible, the discrepancy resolved.) Status:",
    "23-0168 noteEn",
)

# ---------- 7/8: Žerjal/Pintér/Mason 2010 note — letnica izida VS 48 ----------
rep(
    "(VS 48: Nadbath/Žorž; primarno poročilo: Žerjal/Pintér/Mason).\",",
    "(VS 48: Nadbath/Žorž; primarno poročilo: Žerjal/Pintér/Mason). (Doplnilo 105. vala: objava VS 48 je izšla Ljubljana 2013 in zajema poročila o delih 2010 in 2011 — »2011« zgoraj je leto izkopavanj; primarno poročilo 2010 ostaja ločen zapis.)\",",
    "Žerjal noteSi",
)
rep(
    "(VS 48: Nadbath/Žorž; the primary report: Žerjal/Pintér/Mason).\",",
    "(VS 48: Nadbath/Žorž; the primary report: Žerjal/Pintér/Mason). (Wave 105 supplement: the VS 48 publication appeared in Ljubljana 2013 and covers the reports of the works of 2010 and 2011 — the '2011' above is the year of the excavations; the primary report of 2010 remains a separate record.)\",",
    "Žerjal noteEn",
)

# ---------- 9: storySi — odstavek 105. vala ----------
SI_105 = (
    r"\n\n105. val je prebral zvezek, ki ga je muzej doslej citiral z dvema letnicama: "
    "Varstvo spomenikov, Poročila 48 (ZVKDS, Ljubljana 2013, ISSN 1580-5166) je javno dostopen "
    "na zvkds.si in zajema poročila o delih leta 2010 in 2011 — muzejska »2011« je torej leto "
    "izkopavanj, »2013« leto izida, obe letnici združljivi, REVIEW razrešen. Članek o "
    "izkopavanjih na parceli 15/3 je vnos 30, str. 74–76, podpisala Alja Žorž. Iz polnega "
    "branja prihajajo primarno potrjene podrobnosti, ki jih kuratorski zapis ni poznal: "
    "tipološka analiza keramike naselbino uvršča v virovitiško kulturno skupino (bronasta doba) "
    "ter vzhodnoneolitske in vučedolske skupine (eneolitik) — kulturo, ki jo poročilo 2023 z "
    "parcele 67/3 piše kot »vitovitiško«, zvezek pa kot »virovitiško«; kamnina — brusi in "
    "žrmlje iz peščenjakov in konglomeratov, večja fino retuširana klina in sveder iz "
    "finozrnatih rožencev — z malo odpadnega materiala pove, da je bilo orodje tu le dodelano "
    "in izboljšano, le redko izdelano od začetka; nekateri odlomki lončenine in opeke pričajo "
    "o ljudeh tudi v rimskem obdobju in zgodnjem srednjem veku; koncentracija ostalin v "
    "osrednjem in vzhodnem delu izkopnega polja kaže, da se je naselbina širila severno in "
    "vzhodno od raziskanega območja; etimologija po Snoju (2009, 153): hrvaška griblja »brazda "
    "(na njivi)« ali griva »s travo poraslo območje«. Zvezek pa je prinesel tudi naseljinsko "
    "poštenost: poročalo je izrecno poudarilo, da je bilo z arheološko metodo trajno odstranjen "
    "in uničen del skupne kulturne dediščine — poved, ki jo muzej zapisuje z enako težo kot "
    "najdbe. V istem valu je najden tudi zvezek VS 42 (kanalizacija G1/G4; Mason, Vareško, "
    "Pintér): javno dostopen na zvkds.si, a čisti sken brez besedilne plasti — vsebina čaka "
    "OCR/VLM branje, letnica zvezka ostaja REVIEW. Register raziskav eArheologija je v živo "
    "ponovno preverjen: 26 zapisov, stanje nespremenjeno — 26-0326 brez prenosa, 26-0379 šele "
    "napredita."
)
rep(
    "v enem poročilu: Belokranjski muzej v Metliki.\",",
    "v enem poročilu: Belokranjski muzej v Metliki." + SI_105 + "\",",
    "storySi odstavek 105. vala",
)

# ---------- 10: storyEn — Wave 105 odstavek ----------
EN_105 = (
    r"\n\nWave 105 has read the volume the museum had so far cited with two different years: "
    "Varstvo spomenikov, Poročila 48 (IPCHS, Ljubljana 2013, ISSN 1580-5166) is publicly "
    "accessible at zvkds.si and covers the reports of the works of 2010 and 2011 — the "
    "museum's '2011' is thus the year of the excavations, '2013' the year of publication; the "
    "two dates are compatible and the REVIEW is resolved. The article on the excavations at "
    "parcel 15/3 is entry 30, pp. 74–76, signed by Alja Žorž. The full reading adds "
    "primary-source details the curator's record did not know: the typological analysis of the "
    "pottery places the settlement in the Virovitica cultural group (Bronze Age) and the "
    "eastern-Neolithic and Vučedol groups (Eneolithic) — the culture spelled 'vitovitiška' by "
    "the 2023 report at parcel 67/3 and 'virovitiška' by the volume; the stone industry — "
    "grinders and querns of sandstone and conglomerate, a larger finely retouched blade and a "
    "boring tool of fine-grained chert — with little waste material says that tools were only "
    "finished and improved here, rarely made from scratch; some sherds of pottery and brick "
    "testify to people also in the Roman period and the Early Middle Ages; the concentration "
    "of remains in the central and eastern part of the excavation field shows the settlement "
    "spreading north and east beyond the excavated area; the etymology after Snoj (2009, 153): "
    "the Croatian griblja 'a furrow (in a field)' or griva 'an area overgrown with grass'. The "
    "volume also brought the report's own honesty: it explicitly stressed that the "
    "archaeological method permanently removed and destroyed a part of the shared cultural "
    "heritage — a statement the museum records with the same weight as the finds. In the same "
    "wave the volume VS 42 (the G1/G4 sewer route; Mason, Vareško, Pintér) was also found: "
    "publicly accessible at zvkds.si, but a pure scan without a text layer — the content "
    "awaits OCR/VLM reading, the volume year remains REVIEW. The eArheologija register was "
    "re-verified live: 26 records, the state unchanged — 26-0326 without a download, 26-0379 "
    "still a merely advanced research."
)
rep(
    "Metlika.\",\n    evidenceStatus:",
    "Metlika." + EN_105 + "\",\n    evidenceStatus:",
    "storyEn odstavek Wave 105",
)

# ---------- 11/12: Muzej išče doplnilo ----------
rep(
    "in 26-0379, napredita raziskava), originalni zapis DOZA",
    "in 26-0379, napredita raziskava) (Doplnilo 105. vala: zvezek Varstvo spomenikov, Poročila "
    "48 — po katerem muzej doslej citiral le povzetek izkopavanj 2011 — je prebran v celoti, "
    "bibliografska identiteta razrešena), originalni zapis DOZA",
    "Muzej išče SI doplnilo",
)
rep(
    "26-0379, a merely advanced research, remain without a download), the original DOZA",
    "26-0379, a merely advanced research, remain without a download) (Wave 105 supplement: the "
    "volume Varstvo spomenikov, Poročila 48 — of which the museum had so far cited only the "
    "summary of the 2011 excavations — has been read in full, the bibliographic identity "
    "resolved), the original DOZA",
    "Muzej išče EN doplnilo",
)

open(PATH, "w", encoding="utf-8").write(src)
print("VGRADNJA KONČANA:", len(orig), "->", len(src), "znakov (+", len(src) - len(orig), ")")
