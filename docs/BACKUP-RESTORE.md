# Backup & Restore — runbook (issue #27, točka T)

> **Stanje:** SQLite (`db/custom.db`) v produkcijskem paketu funkcije (Vercel).
> Ob prehodu na PostgreSQL (issue #27/A1) se ta runbook dopolni z `pg_dump`
> postopki — zapisnik manifestov ostaja enakovreden.

## 1. Varnostna kopija (zdaj, SQLite)

```bash
bun run db:backup
```

Skripta (`scripts/db-backup.ts`):

1. prepiše `db/custom.db` v `backups/backup-<čas>/custom.db`,
2. zapiše `manifest.json` z velikostjo, **SHA-256** povzetkom in git HEAD,
3. preveri, da je kopija popolna (enaka velikost),
4. ohrani zadnjih **10** kopij (stare izloči).

RPO = čas od zadnje kopije do spremembe. Dokler se kopije delajo ročno po
vgradnji nove vsebine (ob vsakem sklopu), je RPO ≈ interval vgradnje.
Spremljajte diskrepance: `ls backups/` naj sledi sklopom v README.

## 2. Obnovitev (SQLite)

1. Ustavi/predelaj promet (Vercel: redploy bo obnovil bazo iz paketa).
2. Postavi kopijo na mesto baze:

   ```bash
   # preveri manifest kopije:
   cat backups/backup-<ČAS>/manifest.json
   shasum -a 256 backups/backup-<ČAS>/custom.db   # se mora ujemati z manifestom
   cp backups/backup-<ČAS>/custom.db db/custom.db
   bun run preflight    # številke zapisov/virov = številke iz kopije
   bun test tests/      # enotni testi zeleni
   SMOKE_BASE_URL=<produkcija> bun tests/api-smoke.ts   # javna pogodba API
   ```

3. Preveri vsebino po seznamu iz issue #27/T: exhibits, sources, guestbook,
   memories, statistics (`/api/stats`), IIIF (`/api/iiif`), opendata
   (`/api/opendata`). Smoke testi pokrijejo oblike odgovorov in številke.

## 3. Restore verifikacijski seznam (po #27/T)

| Podatki | Kje preveriti | Pričakovano |
|---|---|---|
| zapisov | `bun run preflight` | = številka iz README status bloka |
| virov | `bun run preflight` | = številka iz README status bloka |
| viri/licence | `/api/opendata` → sources | vsak vir ima license + sourceKey |
| spominska knjiga | `/api/guestbook` | objavljeni vpisi (status `published`) |
| spomini | objektne strani | spomini ob predmetu vidni |
| statistika | `/api/stats` | števci (napaka pri bralni namestitvi = 503, znano) |
| IIIF | `/api/iiif` + manifest | Canvas.items[0].type = AnnotationPage |
| odprti podatki | `/api/opendata` | counts ustreza preflight |

## 4. Odgovornost (po #27/T — določite in vpišite)

- **Izvajalec kopij:** _(vpišite: oseba/rolja)_
- **Izvajalec obnovitve:** _(vpišite)_
- **RPO/RTO cilja:** _(vpišite; trenutno: ročno ob vgradnji / RTO ≈ 30 min)_
- **Pogostost:** ob vsaki vgradnji vsebine (sklop) + pred večjimi spremembami sheme
- **Hramba:** 10 zadnjih kopij lokalno; *(po potrebi oddaljena kopija — vpišite)*

## 5. Prehod na PostgreSQL (ko se izvede A1)

1. `pg_dump --format=custom` po vsaki migraciji (namesto `db:backup`),
2. manifest = izpis `pg_restore --list` + SHA-256 dump datoteke,
3. vaja obnovitve: dump → sveža baza → `prisma migrate deploy` → preflight → smoke,
4. RPO/RTO določena s pogostostjo dumpov in hrambe pri ponudniku.
