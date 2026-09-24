# Upravljanje zbirke — evidence model, uredništvo, pravice, moderacija (issue #27)

Ta dokument je vhodna točka za upravljanje vsebine. Podrobna runbooka:
[DEPLOYMENT](./DEPLOYMENT.md) · [BACKUP-RESTORE](./BACKUP-RESTORE.md) ·
[PRIVACY](./PRIVACY.md) · [COLLECTION-MANAGEMENT](./COLLECTION-MANAGEMENT.md) ·
[SPECTRUM-GAP](./SPECTRUM-GAP.md) · javna pogodba: [API](./API.md).

---

## 1. Evidence model (#27/D + K)

**Trditev (Claim)** je najmanjša preverljiva enota vsebine:
`Exhibit → Claim → Source / ArchiveRecord + pageRef`.

Lestvica statusov (isti pomen na zapisu, trditvi in v OpenData):
`DOCUMENTED · CORROBORATED · TESTIMONY · TRADITION · UNVERIFIED · TO_COLLECT`.

**Evidence gate** (`src/lib/claims.ts`, vsiljen tudi v API):
- `DOCUMENTED` zahteva vezavo na vir ALI arhivsko enoto **in** konkretno
  stran/oddelek/enoto (`pageRef`) — brez tega vnos/objava vrne 422;
- `CORROBORATED` zahteva vsaj vezavo na vir;
- `TESTIMONY`/`TRADITION` smejo obstajati brez vira (ustno izročilo je
  zakonit vir) — **nikoli pa ne smejo biti prikazani kot dokumentirano**;
- AI kustos sme trditev predstaviti kot dejstvo samo, če velja
  `PUBLISHED + (DOCUMENTED|CORROBORATED) + citacija`
  (`canAiPresentAsFact`); odgovori kustosa nosijo blok `claims` z
  vidnimi statusi.

## 2. Uredniško delo — verzije (#27/C)

Workflow: `DRAFT → REVIEW → APPROVED → PUBLISHED` (+ `REJECTED`,
`ARCHIVED`). Prehodi so zaprti (`src/lib/editorial.ts`) — preskok
pregleda ni mogoč, objavljene verzije ne urejamo (nova sprememba =
nova verzija).

- Vsaka verzija je **celovit snapshot** urejanljivih polj + kdo/kdaj/
  razlog/prejšnja verzija → popolna rekonstrukcija zgodovine.
- `publish` (samo iz `APPROVED`) **transakcijsko** prepisuje polja
  zapisa iz snapshot-a; starejša `PUBLISHED` verzija gre v `ARCHIVED`.
- Ob objavi se počisti predpomnilnik vodnika (zastarela vsebina ne
  more ostati v obtoku, #27/K).
- Identiteta (slug, museumNo, kategorija) ni urejanljiva skozi
  workflow — sprememba identitete = nov zapis.

## 3. Pravice (#27/F)

Vsi viri in digitalne vsebine nosijo: creator, copyright holder,
licenco + URL, atribucijo, omejitve; viri dodatno
`permissionToPublish/Modify`, `commercialUse`, interno `permissionEvidence`
in `rightsVerifiedAt`.

**Načelo:** neznan status je IZRECEN `UNKNOWN` (vključno z objavo v
javnem API-ju) — sistem ne pretvarja, da so pravice znane. Nov javni
asset brez znanih pravic se označi `UNKNOWN` in uide v pregled
(REVIEW_REQUIRED).

## 4. Moderacija skupnosti (#27/G)

Statusi: `pending → published / rejected / hidden / deleted (soft)`.

- Ob vpisu ostajata honeypot + hevristika + kvota (5 / 10 min);
  čisto besedilo takoj objavimo, vsebina s povezavami gre v `pending`.
- Akcije moderatorja (žeton): approve, reject, hide, restore,
  soft-delete — vsaka z meta podatki (kdo/kdaj/zakaj/prejšnji status).
- Javna prijava (`/api/moderation/report`, 5 / 10 min): 3. prijava
  samodejno skrije prispevek (`auto-report`) do pregleda.
- Retencija po [PRIVACY](./PRIVACY.md): rejected/deleted → fizicni
  izbris po 30 dneh (`scripts/gdpr-retention.ts`, Job evidenca).

## 5. Arhivska raziskava (#27/E + M)

`ArchiveRecord` nosi strukturirane metapodatke (ustanova, fond,
serija, enota, signatura, identifier, datacija, digitalizacija,
dostopnost, physicalLocation) in **pošten `researchStatus`**:
`NOT_VIEWED · VIEWED_PARTIALLY · VIEWED · TRANSCRIBED`.

**Pravilo #27/M:** enota, ki ni pregledana, ostaja `NOT_VIEWED` —
trditve na take enote ne morejo biti `DOCUMENTED`. Prioritetne P1★
enote (šolski list 1929–41, SA Podzemelj 1850–1890, katastrski izpisek
1851–53, volilni spisi 1861–1908) so vpisane v register in javno
vidne prek `/api/archive-records`.

## 6. Meja javno/interno (#27/I)

| javno | interno (žeton oz. baza) |
|---|---|
| objavljena vsebina, javne trditve s citacijami, arhivski katalog brez opomb, pravice (creator/license/attribution/restrictions) | raziskovalne opombe, `permissionEvidence`, metapodatki moderacije, neobjavljene verzije/trditve, Job evidenca |

Regresijske preverbe v `tests/api-smoke.ts` globoko preiskujejo odgovore
javnih poti po 13 notranjih ključih — puščanje = rdeč test.

## 7. Preservacija, opravila, opazovanje (#27/N, W, V)

- **Fixity** (`scripts/fixity-check.ts`): ponovni izračun SHA-256 nad
  `DigitalAsset`; VERIFIED/CORRUPTED/MISSING; `--flag` označi
  DEGRADED; evidenca manjkajočih/poškodovanih NI tiha (izhod 1).
- **Job** (`Job` tabela): type/status/attempts/startedAt/completedAt/
  error/correlationId/idempotencyKey — istodnevni ponovni zagon ne
  podvoji dela (fixity, retencija).
- **Observability** (`/api/health` + `src/lib/obs.ts`): strukturirani
  JSON logi, correlation ID (`x-request-id`), števci napak po razredih;
  v logih ni osebnih podatkov.

## 8. Raziskovalni cevovod (#27/L)

Formalni tok: `Research finding → Archive/source record → page
verification → transcription → Claim → Source link → Exhibit →
Editorial review → Published`.

- **Železno pravilo:** najdena spletna sled sama po sebi NI dokaz za
  `DOCUMENTED` trditev — naprej sme samo do katalogizacije
  (`ArchiveRecord`, `NOT_VIEWED`).
- Mašina stanj: `src/lib/pipeline.ts` (`canAdvance`,
  `reachableStage`, `validatePipeline`) + preverbi v
  `tests/pipeline.test.ts`.
- Poglobljeno: [RESEARCH-PIPELINE](./RESEARCH-PIPELINE.md).
