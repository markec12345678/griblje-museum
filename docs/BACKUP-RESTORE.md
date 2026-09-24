# Backup & Restore — runbook (issue #27, točki T + A1)

> **Stanje:** Neon PostgreSQL 17 (issue #27/A1 izveden; 113 zapisov · 588 virov).
> Dve enakovredni poti kopij: app-level logični odvod (`db:backup`, brez
> zunanjih orodij) in kanonični `pg_dump` (operater). Manifest z SHA-256 je
> obvezen v obeh.

## 1. Varnostna kopija (app-level logični odvod)

```bash
bun run db:backup
```

Skripta (`scripts/db-backup.ts`):

1. odvede vse tabele v `backups/backup-<čas>/snapshot.json` (JSON, vse vrstice),
2. zapiše `manifest.json` z velikostjo, **SHA-256** odvoda, živimi števci po
   tabelah in git HEAD,
3. ohrani zadnjih **10** kopij (stare izloči).

Zgodovinski potrditveni primer (prvi PostgreSQL odvod, 2026-09-24):
`1347909 bajtov · SHA-256 a2f43584ce8e7917… · števci 113/588/6/9/6/10/132`.

RPO = čas od zadnje kopije do spremembe. Kopije se delajo ročno ob vsaki
vgradnji vsebine (sklop) — RPO ≈ interval vgradnje. Spremljajte diskrepance:
`ls backups/` naj sledi sklopom v README.

## 2. Kanonična kopija (pg_dump, operater — priporočeno za produkcijo)

```bash
pg_dump --format=custom --file backups/pgdump-<ČAS>.dump "$DIRECT_URL"
shasum -a 256 backups/pgdump-<ČAS>.dump          # vpiši v manifest
pg_restore --list backups/pgdump-<ČAS>.dump      # zapis vsebine dumpa
```

Neon hraní tudi PITR (point-in-time restore) na nivoju projekta — glej Neon
konzolo (Backups); `restore window` free plana je ~6 ur, plačljive razine več.

## 3. Obnovitev (dokazan postopek, izveden 2026-09-24 na Neon)

```bash
# 1) novi cilj: prazna baza (Neon API/konzola) + preselitev sheme:
DATABASE_URL=<cilj> DIRECT_URL=<cilj> bunx prisma migrate deploy

# 2) preveri odtis odvoda in vrni podatke + validiraj števce:
RESTORE_URL=<cilj> bun scripts/restore-verify.ts backups/backup-<ČAS>
# (brez argumenta vzame najnovejši kopiji iz backups/)
```

`scripts/restore-verify.ts`:

1. preveri SHA-256 odvoda proti manifestu (okvarjena kopija = takoj izhod 1),
2. vrne vse tabele v cilj (TRUNCATE + vnos v vrstnem redu tujih ključev),
3. primerja števce po tabelah z manifestom,
4. preveri, da `museumNo` nima duplikatov.

Izhod `✓ OBNOVA VALIDIRANA` = obnova dokazano popolna.

Vaja izvedena (dokaz): snapshot `a2f43584…` → sveža Neon baza `restore_test`
→ `migrate deploy` → obnova → vsi števci ✓, brez duplikatov → cilj izbrisan.

## 4. Restore verifikacijski seznam (po #27/T)

| Podatki | Kje preveriti | Pričakovano |
|---|---|---|
| zapisov | `bun run preflight` | = številka iz README status bloka (113) |
| virov | `bun run preflight` | = številka iz README status bloka (588) |
| viri/licence | `/api/opendata` → sources | vsak vir ima license + sourceKey |
| spominska knjiga | `/api/guestbook` | objavljeni vpisi (status `published`) |
| spomini | objektne strani | spomini ob predmetu vidni |
| statistika | `/api/stats` | števci (napaka pri bralni namestitvi = 503, znano) |
| IIIF | `/api/iiif` + manifest | Canvas.items[0].type = AnnotationPage |
| odprti podatki | `/api/opendata` | counts ustreza preflight |

## 5. Odgovornost (po #27/T — določite in vpišite)

- **Izvajalec kopij:** _(vpišite: oseba/rolja)_
- **Izvajalec obnovitve:** _(vpišite)_
- **RPO/RTO cilja:** _(vpišite; trenutno: ročno ob vgradnji / RTO ≈ 30 min)_
- **Pogostost:** ob vsaki vgradnji vsebine (sklop) + pred večjimi spremembami sheme
- **Hramba:** 10 zadnjih kopij lokalno + Neon PITR; *(oddaljena kopija po potrebi — vpišite)*
