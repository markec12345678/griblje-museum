# Spectrum-style workflow mapping (issue #27/P)

**Cilj (po issue #27/P):** pregled pokritosti postopkov po vzoru
SPECTRUM (Collections Trust) — NE implementacija standarda, ampak
sistematicen gap analysis. Vrste postopkov, ki jih SPECTRUM definira, so
preslikane na trenutni Griblje model s prednostjo (priority).

Legenda: **F** = funkcionalno pokrito (koda + testi), **D** =
dokumentirano (politika/runbook), **⚠** = delno, **—** = N/A ali vrzel.

| # | SPECTRUM postopek | trenutni Griblje model | vrzel | priority |
|---|---|---|---|---|
| 1 | **Object entry** (sprejem nenajavljenega materiala) | ni obstoječega (vse vsebine prihajajo iz lastne raziskave) | postopek za zunanje donacije NE obstaja | P3 (ob prvem donatorju) |
| 2 | **Loans in** | — | N/A (ni posojil) | P3 |
| 3 | **Acquisition** | raziskovalni val → vgradnja (research-griblje/); `addedAt` | ločen accession zapis z donatorjem/pogodbo ni ločen | P2 (ob fizični zbirki) |
| 4 | **Accession** | `museumNo` trajna inventarna številka (MVG-###) | accession register (ACC-čtevilke) | P2 |
| 5 | **Cataloguing** | `Exhibit` (dvobesedni slovenščina/angleščina, evidenceStatus) + `Claim` trditve + `Source` viri | ✅ pokrito; katalogizacija prek `ExhibitVersion` workflow | F |
| 6 | **Inventory** | `museumNo` unique; števci v `preflight.ts` + `/api/health` | inventurne listine (izvozi) — deloma prek /api/opendata | ⚠ P2 |
| 7 | **Location and movement control** | fizične enote: `ArchiveRecord.physicalLocation` (arhiv-hramebosec); digitalne: storageKey | premiki fizičnih enot se NE vodijo | ⚠ P3 |
| 8 | **Condition checking & technical assessment** | digitalne vsebine: fixity preverba (#27/N) + preservationStatus | fizično stanje (kadar bo zbirka) | F (digitalno) |
| 9 | **Conservation** | n/a (digitalna preservacija = #27/N) | fizična konservacija | — |
| 10 | **Reproduction** | `DigitalAsset` derivati (`derivedFromId`), IIIF presentation sloj | ✅ pokrito; derivati rekonstruirabilni | F |
| 11 | **Rights management** | `Source` + `DigitalAsset`: creator/copyright/license/permission*/commercialUse/attribution/restrictions; UNKNOWN izrecen | avtomatsko izsiljevanje pravic iz izvoza (licenca per asset v OpenData) | F |
| 12 | **Use of collections** (razstavljanje, interpretacija) | javni API + OpenData (CC0 metapodatki) + AI kustos z evidence gate (#27/K) | merjenje uporabe = StatDay (brez osebnih podatkov) | F |
| 13 | **Exhibition** | online zbirka; `MuseumEvent` za prireditve; `StoryItem` interpretacija | fizične razstave | — |
| 14 | **Loans out** | — | N/A | P3 |
| 15 | **Exit / disposal** | `ExhibitVersion` → ARCHIVED (umik objave, zgodovina ostane); GDPR retencija za prispevke | fizični odpis/deaccession | ⚠ F (digitalno) |
| 16 | **Retention/documentation** | `docs/BACKUP-RESTORE.md` (RPO/RTO), verzije (#27/C), worklog metodologija | — | F |

## Povzetek pokritosti

- **F (funkcionalno + testi):** cataloguing, reproduction, rights,
  digitalna preservacija, digitalni disposal, dokumentacija — jedro
  digitalnega muzeja je pokrito.
- **⚠ (delno):** inventory izvozi, location/movement za fizične enote
  (informacijsko prek ArchiveRecord), object entry prihodnost.
- **— (N/A danes):** loans, fizična konservacija, fizične razstave —
  projekt je digitalni muzej; te vrzeli so zavedne, ne skrite.

## Načelo uporabe

SPECTRUM preslikavo posodobimo ob vsaki pomembni spremembi modela
(nova tabela v shemi = nov postopek ali nadgradenje vrstice). Prioriteta
P2/P3 vrzeli se aktivira IZKLJUČNO z dejansko potrebjo (fizična zbirka,
donatorji, posojila) — ne predčasno.
