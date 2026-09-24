# Deployment runbook (issue #27, točka U)

> Namen: namestitev ne sme priti v stanje, ki pričakuje novo shemo baze, preden
> je ta varno postavljena. Runbook opisuje, kaj je danes avtomatsko in kaj je
> treba preveriti ročno.

## 1. Trenutna arhitektura

| Del | Stanje |
|---|---|
| Gostovanje | Vercel (auto-deploy ob pushu v `main`) |
| Baza | SQLite `db/custom.db` — gre v paket funkcije (`outputFileTracingIncludes`) |
| Migracije | `prisma db push` (razvoj) — **production migration mehanizem še ne obstaja (A1)** |
| CI | GitHub Actions: tipi → lint → enotni testi → dimni testi na živem strežniku (`.github/workflows/ci.yml`) |

## 2. Pred namestitvijo (preflight)

```bash
bun run preflight
```

Preveri: baza obstaja in je berljiva · prisma odjemalec generiran · živo število
zapisov/virov (primerek za dokumentacijo) · okoljske spremenljivke.

| Preverba | Trda napaka (izhod 1) | Opozorilo (izhod 0) |
|---|---|---|
| baza/prisma | baza manjka, prazna, odjemalec ni generiran | — |
| `NEXT_PUBLIC_SITE_URL` | — | manjka (privzeta domena iz `lib/site.ts`) |
| `ZAI_CONFIG` / `ELEVENLABS_API_KEY` | — | manjka (avdio vodnik/AI kustos → 503) |
| provider = sqlite | — | opomnik na prehod A1 |

## 3. Postopek namestitve (danes)

1. `main` je zelen v CI (workflow `ci.yml` — tipi, lint, enotni testi, dimni testi).
2. `bun run preflight` lokalno: brez trdih napak.
3. Push/merge → Vercel auto-deploy → čakaj BUILDING → READY.
4. Dimni testi na produkciji:
   `SMOKE_BASE_URL=https://griblje-museum.vercel.app bun tests/api-smoke.ts`
5. `bun run db:backup` (kopija trenutnega stanja pred označbo sklopa).

## 4. Rollback

1. Vercel → Deployments → zadnji zeleni deploy → **Promote to Production**.
2. Baza: ker gre v paket funkcije, se obnovi skupaj s prejšnjim deployem.
   Za daljše razdobje: `docs/BACKUP-RESTORE.md` (obnovitev iz `backups/`).
3. Preveri: `bun run preflight` + dimni testi na produkciji.

## 5. Prehod na PostgreSQL (A1) — vrata varne namestitve

Dokler to ni izvedeno, je opozorilo v preflightu pričakovano. Prehod mora
izpolnjevati (po #27/IMPLEMENTACIJSKI RED P0):

1. `prisma/schema.prisma` → `provider = "postgresql"` + `prisma migrate dev`
   ustvari osnovno migracijo (mapa `prisma/migrations` gre v git).
2. Vaja migracije: migracija na kopiji SQLite → prenos podatkov → primerjava
   številk s preflightom (zapis/viri/dogodki/zgodbe).
3. Vercel env: `DATABASE_URL` → PostgreSQL connection string (pooling provider).
4. CI: dodatni job z `postgres:16` service kontejnerjem —
   `prisma migrate deploy` na prazni bazi mora uspeti.
5. Šele nato: aplikacija v novi namestitvi ne sme več vsebovati `db/custom.db`
   (`outputFileTracingIncludes` odstranjen) — eden od obeh stanj je vedno res.
6. `docs/BACKUP-RESTORE.md` se dopolni z `pg_dump` postopki (razdelek 5).

## 6. Kaj preverja CI danes (uvod v #27/S)

- tipi (tsc --noEmit) in lint,
- enotni testi: deljenje TTS besedila, normalizacija diakritik, pokritost sprehodov,
- dimni testi: oblika API odgovorov, številke = vir podatkov, CORS, diakritike
  v iskanju, IIIF regresija (AnnotationPage), meja javno/interno opendata,
  poštene napake audio vodnika — brez TTS klicev.
