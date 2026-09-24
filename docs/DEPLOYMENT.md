# Deployment runbook (issue #27, točki U + A1)

> Namen: namestitev ne sme priti v stanje, ki pričakuje novo shemo baze, preden
> je ta varno postavljena. Runbook opisuje, kaj je avtomatsko in kaj je treba
> preveriti ročno.

## 1. Arhitektura (po prehodu na PostgreSQL — A1 izveden)

| Del | Stanje |
|---|---|
| Gostovanje | Vercel (auto-deploy ob pushu v `main`) |
| Baza | **Neon PostgreSQL 17** (regija `aws-eu-central-1`; projekt `griblje-museum`) |
| Povezave | `DATABASE_URL` = pooled endpoint (aplikacija) · `DIRECT_URL` = direkt endpoint (migracije, shadow DB) |
| Migracije | `prisma/migrations` v gitu; produkcijski zagon: `prisma migrate deploy` |
| CI | GitHub Actions: tipi → lint → enotni testi → dimni testi na živem strežniku z `postgres:17` kontejnerjem (`.github/workflows/ci.yml`) |

Zgodovina prehoda: SQLite `db/custom.db` → shema preklopljena na `postgresql`
(migracija `20260924105426_init`), podatki prenešeni z
`scripts/migrate-data-sqlite-to-postgres.ts` (113 zapisov · 588 virov · 9
dogodkov · 6 zgodb · 6 vpisov · 10 spominov · 132 statističnih dni — števci
preverjeni na obeh straneh). Stara SQLite datoteka ostaja v repozitoriju kot
zgodovinski vir podatkov; aplikacija je ne uporablja več.

## 2. Okoljske spremenljivke (Vercel + lokalno `.env`)

| Spremenljivka | Kje | Namen |
|---|---|---|
| `DATABASE_URL` | Vercel env + `.env` | pooled Neon endpoint (PgBouncer) — aplikacijski runtime |
| `DIRECT_URL` | Vercel env + `.env` | direkt endpoint — izključno `prisma migrate` (shadow DB ne sme skozi pooler) |
| `NEXT_PUBLIC_SITE_URL` | Vercel env | canonical domena sitemap/robots (sicer privzeta iz `lib/site.ts`) |
| `ZAI_CONFIG` ali `ELEVENLABS_API_KEY` | Vercel env | TTS/AI kustos (brez: ti poti vračajo 503, ostalo deluje) |

Oblika niza: `postgresql://<uporabnik>:<geslo>@<host>/<baza>?sslmode=require`.

## 3. Pred namestitvijo (preflight)

```bash
bun run preflight
```

Preveri: `DATABASE_URL` prisoten · prisma odjemalec generiran · živi števci
zapisov/virov/dogodkov/zgodb (primerek za dokumentacijo) · shema = postgresql
· `prisma/migrations` obstaja · okoljske spremenljivke.

| Preverba | Trda napaka (izhod 1) | Opozorilo (izhod 0) |
|---|---|---|
| `DATABASE_URL` | manjka | — |
| prisma odjemalec | ni generiran | — |
| živi števci | povezava pade / zbirka prazna | — |
| shema + migracije | shema ni postgresql | migracije manjkajo |
| `NEXT_PUBLIC_SITE_URL` | — | manjka |
| TTS/AI ključi | — | manjkata (503 poti) |

## 4. Postopek namestitve

1. `main` je zelen v CI (workflow `ci.yml` — vključno z `prisma migrate deploy`
   na svežem `postgres:17` kontejnerju + seed + dimni testi).
2. `bun run preflight` lokalno: brez trdih napak.
3. Push/merge → Vercel auto-deploy → čakaj BUILDING → READY.
4. Če je bila dodana NOVA migracija, je Vercel build nastavljen z
   `prisma migrate deploy` (build command); sicer migracije ni — `migrations/`
   so del repozitorija in se uporabijo eksplicitno.
5. Dimni testi na produkciji:
   `SMOKE_BASE_URL=https://griblje-museum.vercel.app bun tests/api-smoke.ts`
6. `bun run db:backup` (logični odvod trenutnega stanja pred označbo sklopa).

## 5. Rollback

1. **Aplikacija:** Vercel → Deployments → zadnji zeleni deploy → **Promote to
   Production**.
2. **Baza:** Neon ohranja PITR (point-in-time restore) in branch zgodovino;
   za logično obnovo: `docs/BACKUP-RESTORE.md` (snapshot.json → sveža baza →
   `restore-verify.ts`).
3. Preveri: `bun run preflight` + dimni testi na produkciji.

## 6. Kaj preverja CI

- tipi (tsc --noEmit) in lint,
- enotni testi: deljenje TTS besedila, normalizacija diakritik, pokritost sprehodov,
- PostgreSQL pot: `prisma migrate deploy` na praznem `postgres:17` + seed —
  ista oživitvena pot kot v produkciji (#27/A1),
- dimni testi: oblika API odgovorov, številke = vir podatkov, CORS, diakritike
  v iskanju, IIIF regresija (AnnotationPage), meja javno/interno opendata,
  poštene napake audio vodnika — brez TTS klicev,
- preflight na sveži namestitvi.
