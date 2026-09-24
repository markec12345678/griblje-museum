# Zbirka vodstvo — muzejski informacijski model (issue #27/O)

**Cilj (po issue #27/O):** pripraviti model, če bo projekt dolgoročno
služil tudi kot dejanski muzejski informacijski sistem. Standard ni
implementiran slepo — spodaj je zvezava med obstoječimi modeli in
muzejskimi procesi ter izrecno označene vrzeli.

## 1. Preslikava: muzejski koncept ↔ obstoječi model

| muzejski koncept | obstoječi model | stanje |
|---|---|---|
| object (predmet/zapis) | `Exhibit` | ✅ implemented (113 zapisov, trajne številke MVG-###) |
| inventory number | `Exhibit.museumNo` (unique, enkrat dodeljen, se ne spreminja) | ✅ implemented |
| accession/acquisition | `Exhibit.addedAt` (kurirani datum vključitve) + izvor prek `Source`/`ArchiveRecord` | ⚠️ delno — ločen `Accession` zapis (donator, način pridobitve, datum, pogodba) NE obstaja |
| provenance | `Claim` (trditev) → `Source`/`ArchiveRecord` + `pageRef` | ✅ implemented (#27/D) |
| current location | **N/A** (digitalni muzej brez fizičnega skladišča); za fizične vire: `ArchiveRecord.physicalLocation` | ⚠️ za fizične enote v arhivih |
| custody | **N/A** — enote so v varstvu arhivov-hrambovcev (`ArchiveRecord.institution`) | ⚠️ informacijsko |
| condition | `DigitalAsset.preservationStatus` (ACTIVE/MIGRATED/DEGRADED/REPLACED/LOST) + fixity preverba (#27/N) | ✅ za digitalne vsebine |
| conservation | N/A za digitalne vsebine; fizični predmeti: NE obstaja | ❌ vrzel (P2, kadar pride do fizične zbirke) |
| movement | **N/A** (brez fizičnih premikov) | ❌ vrzel (samo ob fizični zbirki) |
| loan | **N/A** (izposoje ni) | ❌ vrzel (samo ob fizični zbirki) |
| digitization | `DigitalAsset` (SHA-256, derivati `derivedFromId`, zamenjave `replacedById`) | ✅ implemented (#27/B) |
| rights | `Source` (creator/copyrightHolder/license/permission*/commercialUse/attribution/restrictions) + `DigitalAsset` (license/attribution) | ✅ implemented (#27/F); UNKNOWN je izrecen status, ne tiha vrzel |
| disposal/deaccession | `ExhibitVersion` workflow: objavljena verzija → ARCHIVED (vsebina ostane rekonstruirana) | ✅ mehki umik; fizični odpis N/A |

## 2. Predlog nadaljnjega modela (ko/če postane potrebno)

```prisma
model Accession {
  id          String   @id @default(uuid())
  number      String   @unique // ACC-2026-001
  source      String   // donator / ustanova / odkup
  method      String   // dar | odkup | depozit | lastna dokumentacija
  receivedAt  DateTime
  agreement   String?  // referenca na pogodbo/dokaz (#27/F permissionEvidence)
  exhibits    Exhibit[]
}

model Location {
  id       String @id @default(uuid())
  name     String // skladišče / vitrina / lokacija posoje
  kind     String // STORAGE | EXHIBITION | LOAN_OUT
  custody  String // odgovorna oseba/organizacija
}

model Movement {
  id        String   @id @default(uuid())
  exhibitId String
  fromId    String?
  toId      String?
  reason    String   // premestitev | posoja | vzdrževanje
  movedAt   DateTime
  movedBy   String
}
```

**Ne implementirati predčasno:** model je pripravljen za trenutek, ko
muzej dobi fizično zbirko ali prave acquisition-e. Digitalni zapis v
zbirki je danes popolnoma pokrit z `Exhibit` + `DigitalAsset` +
`ArchiveRecord` + verzijsko zgodovino.

## 3. Inventarna disciplina (trenutno v veljavi)

1. Nova vsebina → raziskava (research-griblje/) → dokaz (vir/enota).
2. Vpis zapisa z naslednjo prosto MVG-številko (`audit-numbers.ts`).
3. `ArchiveRecord` za arhivske enote z `researchStatus` (#27/E, M).
4. Viri s pravicami; `UNKNOWN` dovoli vnos, ne pa tihe objave (#27/F).
5. Spremembe vsebine IZKLJUČNO prek verzij (#27/C) — brez direktnih
   prepisov v produkciji.
6. Retencija izključno po #27/H; predmetni podatki se ne izbrisujejo.
