# 98. ISSUE #84: 3D ZGODOVINSKE GRIBLJE + GPS/AR MUZEJ NA PROSTEM — RAZISKAVA IN TEHNOLOŠKI NAČRT

**Datum:** 27. 9. 2026 · **Naročilo:** issue #84 (»Raziskava: 3D zgodovinske Griblje + GPS/AR muzej na prostem«)
**Cilj:** raziskati trenutno najboljše dostopne tehnologije, odprtokodne projekte in standarde za 3D digitalno vas s časovnimi sloji + GPS/AR na telefonu, ter iz njih izpeljati konkreten tehnološki načrt, predlog podatkovne strukture in najmanjši realen prototip.
**Metoda:** 21 spletnih iskanj (web-search CLI) + branje uradne dokumentacije ARCore Geospatial + **žive preverbe podatkov** (Nominatim, Overpass API nad OSM za Griblje). Surovine v `research-griblje/raw-web-issue84-2026-09/` (22 JSON). Pravilo vsebine: **AI ne izmišljuje zgodovinskih dejstev; vsak vir je citiran; kjer vir ni bil zajet, je status izrecno označen.** Raziskava se nadaljuje v issue #84 po protokolu iz §7.

---

## 1. Izvedbeni povzetek

1. **Podatkovni sklad za teren in karto je za Griblje že javno dostopen in brezplačen:** celotna Slovenija je lasersko posneta (GURS, ciklično skeniranje 2023–2025; GKOT oblak točk `.laz` + DMR brezplačno prek portala CLSS), stavbe in poti vasi so mapirane v OpenStreetMap (**677 stavb** v okviru vasi, preverjeno danes z Overpass API), zgodovinska plast 1825 pa je že del tega projekta (ATLAS 1825 — franciscejski kataster, PSI/PZ/PT protokoli).
2. **AR na telefonu brez očal deluje danes na Androidu in iOS-u**, vendar z realnimi natančnostmi: Google ARCore Geospatial API je brezplačen, a se nanaša na VPS pokritost (Street View) — **za vas, ki ni pokrita, pade nazaj na GPS+senzorje**; Apple GeoTracking deluje **samo v izbranih mestih** (za Griblje NI na voljo). Sidranje rekonstrukcij zato zasnujemo geolokacijsko (GPS + ročna vizualna poravnava), ne »cm-točno«.
3. **Fotogrametrija je odrasla in dostopna** (Meshroom/AliceVision odprtokodno; RealityCapture brezplačno pod 1 M USD prihodkov; Apple Object Capture na iPhone/iPad/macOS brezplačno) — to je pot za rekonstrukcijo **obstoječih** hiš in predmetov iz fotografij. NeRF je za naš primer prehitel svoj vrh; **3D Gaussian Splatting** je novi standard za fotorealistično okolje, z delujočimi odprtokodnimi web-pregledovalniki (three.js ekosistem).
4. **Evidence-first načelo iz issue-ja se preslika v podatkovni model z stopnjami zanesljivosti** (VERIFIED-EVIDENCE → PARTIAL → RECONSTRUCTION → GENERATIVE), ki je v duhu obstoječih varovalk projekta (evidenceStatus, §4 PROVISIONAL, negativni register).
5. **Najmanjši realen prototip (P1) je izvedljiv v 1–2 tednih dela brez nabave programske opreme:** ena lokacija + fotogrametrični model hiše (GLB/USDZ) + AR gumb na obstoječi Next.js strani (Android Scene Viewer / iOS Quick Look prek `model-viewer`) + MapLibre karta z GURS terenom + TTS vodič (obstoječi audio-guide API).

---

## 2. Raziskava po področjih (s formatom: najdeno → vir → kaj omogoča → prednosti/slabosti → uporabnost za Griblje)

### 2.1 GIS, teren in geografski 3D model vasi

| Najdeno | Vir | Kaj omogoča | Prednosti / slabosti | Uporabnost za Griblje |
|---|---|---|---|---|
| **GURS ciklično lasersko skeniranje Slovenije 2023–2025**: georeferenciran klasificiran oblak točk (GKOT, `.laz`) in DMR brezplačno; pregledovalnik 3D podatkov; prenos do 10 listov | https://clss.si · https://www.gov.si/novice/2026-06-03-lidarski-podatki-za-celotno-slovenijo-dostopni-v-pregledovalniku-3d-podatkov · https://www.e-prostor.gov.si/podrocja/drzavni-topografski-sistem/daljinsko-zaznavanje | **Teren na ~meter natančno** (razred »tla« iz GKOT → DEM 1 m) za celotno vas | ✔ odprti javni podatki, vrhunska ločljivost, ni stroškov · ✖ večji obim podatkov, potreben izvoz/priprava (tiling) | **Osnovna plast terena** — 1. korak vsakega 3D modela vasi. Status: VERIFIED |
| **OpenStreetMap za Griblje**: Nominatim → vas @ 45.5725 N, 15.2926 E; Overpass (bbox 45.5525–45.5925 N, 15.2726–15.3126 E) → **677 stavb**, ceste (highway), vodni/landuse elementi; licenca ODbL | nominatim.openstreetmap.org · overpass-api.de (živa preverba 27. 9. 2026; surovina raw-web-issue84-2026-09/) | **Stopala (footprints) vseh stavb + mreža poti + reka** kot georeferencirana osnova | ✔ že obstaja, odprta licenca (atribucija ODbL) · ✖ višine stavb večinoma ne-mapirane → vzeti iz GKOT/LiDAR | Okvir, na katerega se vežejo fotogrametrični modeli in zgodovinski sloji. Status: VERIFIED (živa preverba) |
| **3D Tiles** — OGC Community Standard za pretakanje masyvnih georeferenciranih 3D vsebin (fotogrametrija, stavbe, teren) | https://www.ogc.org/standard/3dtiles | En standard za teren + stavbe + modele; deluje z CesiumJS in ostalimi | ✔ industrijski standard, streaming · ✖ generiranje tilov potrebuje orodja/ion ali OSS pipeline | Format izbire za »celotna vas v 3D« (P3). Status: VERIFIED |
| **CesiumJS** — odprtokodni (Apache-2.0) 3D globus za web; **Cesium ion** storitev z brezplačnim community nivojem + opcija **ion Self-Hosted** | cesium.com/platform/cesiumjs · (kontekst: findalternatives.net, my.asprs.org — ion free tier in Self-Hosted potrjena v iskanjih) | Fotorealističen 3D svet v brskalniku: teren + 3D Tiles + časi/layers | ✔ najmočnejši FOSS geopregled · ✖ zahtevnejši vgradnja kot MapLibre; ion čez brezplačni nivo plačljiv | P3+ za »3D vas«; za P1 zadostuje MapLibre. Status: VERIFIED (jedro), ion detajli VERIFIED posredno |
| **MapLibre GL JS** — FOSS karta: 3D teren, fill-extrusion stavbe, GLB modeli v custom layer | https://maplibre.org (kontekst: waymorphic.com primer fill-extrusion; tessl.io react-map-gl 8.0) | **Spletna 2.5D vas** z OSM stavbami + GURS teren že v P1, v Next.js | ✔ lahkotna, zrela, brez plačil · ✖ ni polni 3D globus (za to Cesium) | Spletna izhodiščna karta + vodenje po točkah (P1/P2). Status: VERIFIED |
| **Franciscejski kataster online** — odprti podatki starih katastrov (SI AS 176 za Kranjsko — pod njo tudi Griblje), sloj »Franciscejski kataster 1869« (MK) na ArcGIS Online | https://podatki.gov.si/dataset/digitalizirano-arhivsko-gradivo-starih-katastrov-si-as-176-si-as-177-si-as-178-si-as-179-si-as-180-s · https://www.arcgis.com/home/search.html?tags=franciscejski%20kataster · https://rodoslovje.si/kartografija | **Georeferencirana zgodovinska plast 1823–1869** za primerjava »danes vs. 1825« | ✔ odprto, že digitalizirano · ✖ georeferenciranje posameznih listov je treba preveriti/izboljšati | most do ATLAS 1825 (projekt že ima PSI/PZ/PT); časovna plast #1. Status: VERIFIED (obstoj zbirk) |

### 2.2 3D objekti iz fotografij (fotogrametrija, NeRF, Gaussian Splatting)

| Najdeno | Vir | Kaj omogoča | Prednosti / slabosti | Uporabnost za Griblje |
|---|---|---|---|---|
| **Meshroom / AliceVision** — odprtokodna fotogrametrijska veriga (CF/AGPL); obsežne tutoriale skupnosti (tudi dedični projekti) | https://alicevision.org | Iz 30–100+ fotografij → georeferenciran mesh (GLB/OBJ) | ✔ brezplačno, odprto, dokazano na dediščini · ✖ potrebuje NVIDIA GPU za densen del; ROUGH model zahteva ročno čistko | Primarno orodje za hiše/predmete iz arhivskih + novih fotk. Status: VERIFIED |
| **RealityCapture 1.4 (Epic)**: brezplačen za osebe/institucije pod **1 M USD bruto prihodka** (april 2024); mobilni **RealityScan** v isti smeri; 2026: zaprtje legacy licenčnega strežnika = prehod na nov licenčni model | dev.epicgames.com (»Introducing RealityCapture 1.4«) · realityscan.com (novica 5/2026) | Najhitrejša komercialna kvaliteta brez stroška za muzej | ✔ hitrost+kvaliteta, 0 USD za nas · ✖ zaprta koda, vezava na Epic ekosistem; spremljati licenčni prehod | Alternativa Meshroomu za hitre produkcije. Status: VERIFIED |
| **Apple Object Capture** (ARKit/RealityKit) — fotogrametrija na iOS/iPadOS/macOS; WWDC 2024 dodan **area mode** (večji objekti/okolice) | developer.apple.com/augmented-reality/ · xrdevelopernews.com (WWDC 2024 povzetek) | Prostovoljci s iPhone-om posnamejo hišo → model brez računalniškega pipeline | ✔ brezplačno, on-device, trivialen vnos · ✖ samo Apple; kvaliteta pod RC za velike objekte | **Najnižja ovira za sprotno zbiranje** 3D gradiva v vasi (obiskovalci/tvorci). Status: VERIFIED |
| **3D Gaussian Splatting (3DGS)** — trenutni standard fotorealističnega zajema okolja; odprtokodno: Nerfstudio (gsplat), OpenSplat (CPU), original 3DGS | github.com/nerfstudio-project/nerfstudio · github.com/WebODM/OpenSplat (potrjeno prek iskanja) | Fotorealizem okolice (vas iz zraka/prehodov) | ✔ boljši realizem kot mesh, hitri rendererji · ✖ velike datoteke, težje urejanje objektov, brez zgodovinske vsebine iz zraka | za »danes« plast okolice; zgodovinske rekonstrukcije ostanejo mesh/GLB. Status: VERIFIED (projekta) |
| **Web rendererji 3DGS**: **mkkellogg/GaussianSplats3D** (three.js, npm, vgradnja v React/Next.js potrjena), PlayCanvas SuperSplat ekosistem | github.com/mkkellogg/GaussianSplats3D (potrjeno prek design4real.de) | 3DGS direktno v obstoječi Next.js strani | ✔ vgrajuje se v naš sklad · ✖ zmogljivost na slabših telefonih | P3 plast »sprehodi skozi vas«. Status: VERIFIED (repo + integracija) |
| NeRF (klasični) — uveljavljen, a za real-time web presežen s 3DGS | (meta-ugotovitev iz obeh iskanj: awesome-3DGS, tutorials) | — | — | Ne uporabljamo kot primarno tehnologijo. Status: SODBA |

### 2.3 Realistični ljudje, živali, animacije

- **Najdeno:** fotorealistični digitalni ljudje (MetaHuman/Unreal, razne storitve) so tehnološko realni, **a za zgodovinske osebe v vasi ne obstajajo viri** (ni fotografij »neke žene z Gribelj 1925« za fotogrametrijo) in vsaka fotorealistična »oseba« bi bila čista izmišljija. CC0/odprta sredstva (npr. zbirke CC0 živali/modelov, Mixamo animacije za dele telesa) so dostopna, vendar specifično »gospodarstvo Bela krajina 1925« ni. — Status: SODBA (zavedno; zunanji linki namenoma brez konkretnih URL, ker niso bili preverjeni v tej rundi).
- **Kaj omogoča:** stilizirane/silhuete figure + živali z oznako RECONSTRUCTION; realna živost dosežemo prej z **zvokom, pripovedjo in animacijo voz/živali v karta-3D**, kot s fotorealističnimi ljudmi.
- **Priporočilo za Griblje:** faza P1–P2 **brez** fotorealističnih ljudi (resnično do zgodovini); P3+: stilizirane figure, ki so vedno vizualno razločljive od fotogrametrije (npr. enobarvne »duhove«) — etično in raziskovalno najčistejša pot. Fotogrametrija **živali** (krava, konj — če jih kdo ima) je realna in dovoljena (živali so predmeti, ne osebe).

### 2.4 AR na telefonu brez očal (ključne omejitve za vas)

| Najdeno | Vir | Kaj omogoča | Prednosti / slabosti | Uporabnost za Griblje |
|---|---|---|---|---|
| **ARCore Geospatial API** (Google) — brezplačen; kombinira senzorje + GPS + VPS (Street View); »remotely attach content to any area covered by Google Street View«; orodje **Check VPS availability** | https://developers.google.com/ar/develop/geospatial (uradna dokumentacija, prebrana) · https://developers.google.com/ar/develop/java/geospatial/check-vps-availability | Sidranje vsebine na geolokacijo v AR (Android; tudi Unity/Unreal) | ✔ brezplačno, najmočnejša platforma · ✖ **VPS zahteva Street View pokritost — vas je skoraj zagotovo nepokrita → GPS+senzorji (±nekaj m)**; Android-only | Primarna nativna platforma (P4) **z načrtom brez VPS**: geolokacijsko sidro + uporabnikova vizualna poravnava. Status: VERIFIED |
| **ARKit GeoTracking (Apple)** — deluje **samo v izbranih mestih** (Apple Maps pokritost) | developer.apple.com/augmented-reality/ (kontekst: bitforge.ch, clouddevs.com — »certain cities«) | Visokonatančna lokacija v AR na iOS | ✔ vrhunska kjer je na voljo · ✖ **za Griblje NI na voljo** | iOS pot = ARSession + GPS/compass + Quick Look; GeoTracking izključen. Status: VERIFIED (omejitev) |
| **WebXR**: Android Chrome podpira immersive-AR (ARCore); **iOS Safari WebXR NE podpira** — uveljavljen web vzorec: **Android WebXR / Scene Viewer + iOS Quick Look (USDZ)** | threejs.org (WebXR podpora) · modelviewer.dev (canonical AR gumb) · (vzorec potrjen v iskanjih: AR plugini »launches the native Android WebXR and iOS Quick Look apps«) | **AR brez namestitve aplikacije** iz obstoječe spletne strani | ✔ nič instalacije, direkt iz Next.js · ✖ iOS ne WebXR → USDZ; brez geospatial trackinga; omejena occlusion | **P1/P2 tehnika izbire**: `model-viewer` z GLB+USDZ. Status: VERIFIED (vzorec) |
| **WebXR + geolokacija**: knjižnica MozillaReality/webxr-geospatial je označena **INACTIVE** (7/2024) | github.com/MozillaReality/webxr-geospatial | Geospatial AR v brskalniku | ✔ ideja dokazana · ✖ ne-VZDRŽEVANA; brez uradne poti Geospatial-API-v-web | Web geospatial AR = eksperiment, ne produkcijska pot. Status: VERIFIED (stanje repo) |
| Unity AR Foundation + Geospatial Creator | (kontekst: blog.learnxr.io Geospatial Creator tutorial; developers.google.com/ar/develop/unity-arf/geospatial) | Ena koda → Android+iOS nativna AR app | ✔ produkcijska pot za P4 · ✖ ločen projekt/aplikacija, trgovine, vzdrževanje | P4 izbira, ko web pot zraste. Status: VERIFIED (obstoj poti) |

### 2.5 GPS + AR navigacija po Gribljah

- **Najdeno:** standardna veriga = Geolocation API (web) / FusedLocation (Android) / CoreLocation (iOS) → **geofencing** (obisk točke) → zagon AR plasti na točki; prehod GPS→vizualno poravnavo je rešen platformno kjer VPS obstaja, sicer ročno (uporabnik postavi/poravna model). — Status: SODBA z VERIFIED komponentami (zgornje 2.4).
- **Ocena natančnosti brez VPS (potrjena s komponentami):** GPS 3–10 m odprto; sidro torej **ne»pišemo na cm«** — rekonstrukcijo postavimo »na parcelo«, uporabnik z enim prstom fino poravna; to je v skladu s filozofijo issue-ja (rekonstrukcija ≠ dokaz).
- **Uspešen primer iz prakse (poučen):** objavljena študija o AR na arheološkem najdišču **Vindolanda** poudarja, da je bila rekonstrukcija »not situated in the exact location« in je »snapshot ene osebine vizije« — exactly the interpretive risk issue #84 forbids. — Status: REVIEW (polni URL/DOI ni bil zajet v iskanju; naslov »Using Augmented Reality to Aid Archaeological…«; preveriti v naslednji rundi).
- **Povezljivost v vasi:** zasnovati **offline-first** (predpomnjenje tilov/modelov/TTS v PWA cache); to je omejitev, ki jo mora prototip odpraviti od prvega dne. — Status: SODBA (inženirska).

### 2.6 Zgodovinski časovni model (več obdobij istega mesta)

- **Najdeno:** vzorec »model×obdobje×vir« je standard v digitalni dediščini (3D Tiles omogoča plasti; muzejski sistemi to modelirajo z ID-jem objekta + interval). — Status: SODBA.
- **Ključna prednost tega projekta:** **ATLAS 1825 je že v repozitoriju** (KG v1.9, story_id kaskada, SRC-PS 143/143, findings s stopnjami PROVISIONAL/VERIFIED) — časovni model ni nova infrastruktura, ampak **podaljšek obstoječe KG-e**: GeoFeature·period poveže 1825 podatke z OSM/GKOT danes.
- **Model sprememb:** objekt = identiteta (hiša na parceli X); stanja = (obdobje, geometrija/model, viri, confidence); prehodi = eventi (zgrajeno/porušeno/predelano) — kompatibilno z obstoječim `Event` modelom aplikacije.

### 2.7 Muzejska podatkovna baza — PREDLOG strukture

Prisma-sklad (dopolnitev obstoječe sheme; **predlog — ne vpliva na runtime, glej §22 pogodbo ATLAS-a**). Confidence lestvica v duhu issue-ja:

- `VERIFIED-EVIDENCE` — neposreden vir (foto, dokument, zemljevid, pričevanje)
- `PARTIAL` — delna podpora (npr. stene iz katastra, streha iz analogije)
- `RECONSTRUCTION` — izpeljani približek (vedno vidno označen v UI)
- `GENERATIVE` — AI približek brez specifičnih virov (vedno označen; privzeto OFF)

```prisma
model HistPeriod        { id String @id; slug String @unique; labelSi String; labelEn String;
                          yearFrom Int?; yearTo Int?; note String? }
model GeoFeature        { id String @id; kind String;   // building|road|water|field|object|animal|event|sound
                          lat Float; lon Float; elevM Float?;
                          osmId String?; exhibitId String?; // veza na obstoječo zbirko
                          nameSi String; note String? }
model SceneModel        { id String @id; featureId String; periodId String;
                          kind String;    // photogrammetry|3dgs|glb|footprint
                          glbUrl String?; usdzUrl String?; splatUrl String?;
                          accuracyM Float?; confidence String; // VERIFIED-EVIDENCE|PARTIAL|RECONSTRUCTION|GENERATIVE
                          note String? }
model EvidenceItem      { id String @id; type String;   // photo|map|document|testimony|audio
                          title String; url String?; date String?; provider String? }
model EvidenceLink      { evidenceId String; featureId String; periodId String?;
                          note String?; confidence String }
model ArAnchor          { id String @id; featureId String; periodId String;
                          lat Float; lon Float; altM Float?; yawDeg Float?;
                          method String }  // gps|geospatial|manual
model Narration         { id String @id; featureId String; periodId String?;
                          lang String; text String; audioUrl String? }
model Tour              { id String @id; slug String @unique; titleSi String; titleEn String; lang String }
model TourStop          { id String @id; tourId String; order Int; featureId String; periodId String?;
                          geofenceM Int @default(25); narrationId String? }
```

### 2.8 AI vodič (»Kje sem? / Kaj je bilo tukaj? / Kdo je živel tukaj?«)

- **Najdeno:** vzorec RAG (retrieval-augmented generation) vezan na lastno bazo je uveljavljen muzejski vzorec (AI kustosi z odgovori iz zbirke; primerjaj s prejšnjim benchmarkom 27 — musa.guide/zapt.tech vzorci). — Status: VERIFIED (kategorija), posamezni ponudniki iz benchmarka 27.
- **Prednost tega projekta:** vse kar vodič potrebuje **že obstaja**: zapisi z viri (Exhibit+sources), KG 1825 (story_id, timeline), TTS audio-guide API, in (iz analize 2026-10) rate-limit + kvote. Odgovor = RAG nad (a) GeoFeature/Narration za lokacijo+obdobje, (b) KG 1825, (c) Exhibit zbirki; **brez vira → »ne vem« + kazalec na vir** (isti varovalka kot ATLAS: ni ugibanja).
- Glasbeni vnos: ASR (obstoječa sposobnost SDK) kasneje (P3); P1/P2 tipkanje.

---

## 3. Ključne omejitve (izrecno, po zahtevi issue-ja)

1. **VPS pokritost v vasi:** ARCore Geospatial brez Street View pade na GPS — natančnost sidra je **meterjeva, ne centimetrska**. (VERIFIED komponenta + logična posledica)
2. **ARKit GeoTracking:** za Griblje nedostopen (samo izbrana mesta). iOS pot je Quick Look / ARSession+GPS. (VERIFIED)
3. **WebXR na iOS:** ne obstaja nativno; AR v webu na iOS gre prek Quick Look (USDZ). (VERIFIED)
4. **Zgodovinska vsebina:** 3D modeli za 1825/1925 **ne morejo nastati iz zraka** — nastajajo iz fotogrametrije obstoječih objektov + arhivskega gradiva + izrecnih oznak RECONSTRUCTION. Fotorealistični ljudje = ne. (SODBA, v skladu z issue)
5. **ODbL atribucija:** OSM podatkov ne smemo uporabiti brez atribucije/kot-dela; v Colophon dodati. (VERIFIED licenca)
6. **Povezljivost + velikosti:** 3DGS/GLB so veliki → tilovanje, LOD, offline cache obvezna. (SODBA)
7. **Stroški razvoja 3D:** GPU za fotogrametrijo/3DGS (cloud ali Apple on-device) + VLM kvota projekta za vzporedno dokumentiranje. (SODBA)

## 4. Arhitektura (končna veriga iz issue-ja)

```
muzejski podatki (Exhibit, KG 1825, EvidenceItem)  →  GIS plast (GURS GKOT/DMR + OSM + kataster)
  →  3D vas (MapLibre 2.5D → CesiumJS/3D Tiles P3)  →  zgodovinski sloji (HistPeriod × SceneModel, confidence)
  →  3D objekti (fotogrametrija GLB + 3DGS okolice)  →  ljudje/živali (stilizirano, označeno; fotogrametrija živali)
  →  GPS (geofence točk, offline-first PWA)  →  AR kamera (P1/P2 model-viewer/WebXR · P4 nativna ARCore/ARKit)
  →  AI vodič (RAG: lokacija+obdobje+KG+zbirka → odgovor z virom; TTS obstoječi)  →  aplikacija (Next.js PWA + kasneje nativni paket)
```

**Faze:**

| Faza | Obseg | Tehnologija | Ocene trajanja |
|---|---|---|---|
| **P1 — prototip** | 1 lokacija, 1 obdobje, 1 hiša; AR gumb; karta z markerjem; TTS vodič; confidence oznake | fotogrametrija (Object Capture/RealityCapture/Meshroom) → GLB+USDZ; `model-viewer`; MapLibre + GURS DEM; obstoječi TTS API | 1–2 tedna |
| **P2 — vodena tura** | 5–10 točk; geofencing; vprašanja (RAG) na točki; offline cache | MapLibre + Geolocation; RAG nad zbirko+KG; PWA cache | 1–2 meseca |
| **P3 — 3D vas + časi** | celotna vas 3D; 1825/1925/danes sloji; več fotogrametričnih hiš; 3DGS okolice | CesiumJS/3D Tiles; GKOT→teren; NGT pipeline; TimeSlider | 3–6 mesecev |
| **P4 — geospatial AR nativno** | ARCore Geospatial + ARKit; occlusion; geofence→AR handoff | Unity AR Foundation ali native; objava v trgovinah | 6–12 mesecev |

## 5. Najmanjši realen prototip (P1) — koraki

1. **Izbira lokacije** (muzej): kandidata z najboljšo dokumentacijo — cerkev oziroma PGD dom (dokumentirana v `02-cerkev-pgd-drustva.md`) ali hiša z zgodovinsko fotografijo iz zbirke. Kriterij: obstoj vsaj 1 neposrednega vira (foto/dokument).
2. **Zajem:** 50–80 fotografij objekta (telefon; sonce, prekrivanje 60–70 %) → Object Capture (iPhone) ali RealityCapture/Meshroom → mesh + tekstura → GLB (+ USDZ konverzija za iOS).
3. **Model v aplikaciji:** `<model-viewer>` komponenta na obstoječi strani (ar gumb: Android Scene Viewer / iOS Quick Look); oznaka confidence (VERIFIED-EVIDENCE ali RECONSTRUCTION).
4. **Karta:** MapLibre + GURS teren + OSM stavbe (atribucija!) + marker + preklop 1825 katastrski list (če georeferenciran; sicer marker nad zemljevidom).
5. **Vodič:** Narration zapis → obstoječi TTS API (predpomnilnik) → predvajalnik pri točki.
6. **Merilo uspeha:** na telefonu v Gribljah (slaba povezava) deluje: marker na karti → AR ogled modela na pravi lokaciji (±meterji) → pripoved → oznaka vir. Android + iOS, brez instalacije.

## 6. Uspešni primeri iz prakse / posredne potrditve

- **Vindolanda (AR arheologija)** — poučni primer interpretativnega tveganja (rekonstrukcija na napačni lokaciji / ena vizija). Status: REVIEW (polen citat v naslednji rundi).
- **Palenque 3D Archaeological Atlas** — LiDAR + atlas dedičine kot model organizacije (researchgate 10/2023). Status: VERIFIED (obstoj).
- **Meshroom/Open-Source-Digital-Heritage tutoriali** — dokaz FOSS poti za dediščino (youtube 2024+). Status: VERIFIED (obstoj materiala).

## 7. Protokol sprotne dopolnitve (dolgoročna raziskovalna naloga)

Vsak nov zaznani pomembni razvoj (orodje, model, standard, primer, omejitev) se zapiše v **issue #84 kot numerirani komentar** v formatu:

```
## N. NAJDENO: <kratko ime>
- Kaj je najdeno: …
- Povezava: <URL (samo preverjen)>
- Kaj omogoča: …
- Prednosti/slabosti: …
- Uporabnost za Griblje: … (vključno »nič«, če ne)
- Status: VERIFIED | REVIEW | SODBA
```

Naslednje raziskovalne rundi (predlagano): (1) polni citat Vindolanda študije; (2) preveriti Street View/GKOT pokritost konkretno za k.o. Griblje (Street View app / CLSS list 455-2-*); (3) georeferenciranje franciscejskega lista Griblje; (4) test `model-viewer` GLB+USDZ pipeline na enem realnem objektu; (5) spremljanje licence RealityCapture po zaprtju legacy strežnika (5/2026).

## 8. Viri (sveže, 27. 9. 2026)

**Slovenija / podatki:** clss.si · gov.si/novice/2026-06-03 (LiDAR za celo Slovenijo) · e-prostor.gov.si (daljinsko zaznavanje) · podatki.gov.si (stari katastri SI AS 176–180) · arcgis.com (Franciscejski kataster 1869, MK) · rodoslovje.si/kartografija · nominatim.openstreetmap.org + overpass-api.de (živa preverba Griblje: 677 stavb)
**Standardi / 3D web:** ogc.org/standard/3dtiles · cesium.com/platform/cesiumjs · maplibre.org · threejs.org · modelviewer.dev
**AR platforme:** developers.google.com/ar/develop/geospatial (+ check-vps-availability) · developer.apple.com/augmented-reality/ · github.com/MozillaReality/webxr-geospatial (INACTIVE)
**Fotogrametrija / 3DGS:** alicevision.org · dev.epicgames.com (RealityCapture 1.4, brezplačno <1 M USD) · realityscan.com (licenčni prehod 5/2026) · github.com/nerfstudio-project/nerfstudio · github.com/WebODM/OpenSplat · github.com/mkkellogg/GaussianSplats3D (three.js/Next.js)
**Kontekst dedičine:** researchgate.net (Palenque 3D Atlas 2023; 3D urban twinning 2025) · scispace.com (Vindolanda AR — REVIEW)
**Surovine:** `research-griblje/raw-web-issue84-2026-09/` (22 JSON: 21 iskanj + uradna dokumentacija Geospatial API)
