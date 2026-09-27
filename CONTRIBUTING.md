# Prispevanje k Muzeju vasi Griblje

Hvala za interes! Ta muzej je dokazljivi projekt: vsaka trditev ima vir,
vsak vir ima stran, vsaka sprememba ima preverljivo sled. Ta vodnik pojasnjuje,
kako k prispevanju pripomoči — od razvojne namestitve do raziskovalnega
cevovoda. / *Thank you for your interest! This museum is an evidence-first
project: every claim has a source, every source a page reference, every change
an auditable trail.*

---

## 1. Tehnični sklad

| Sloj | Orodje |
| --- | --- |
| Okvir | Next.js 16 (App Router), React 19, TypeScript 5 (striktno) |
| Paketi | Bun |
| Stil | Tailwind CSS 4 + shadcn/ui (New York), Lucide ikone, framer-motion |
| Baza | Prisma 6 + PostgreSQL (Neon v produkciji) |
| Stanje | TanStack Query (strežnik), Zustand (odjemalec) |
| Testi | Bun test (enotni) + dimni testi API-jev na živem strežniku |

## 2. Razvojna namestitev

```bash
bun install                 # namestitev odvisnosti (+ prisma generate)
# .env pripravite po seznamu spremenljivk v docs/DEPLOYMENT.md
bun run db:push             # shema v lokalno bazo
bun run dev                 # razvojni strežnik (port 3000)
bun test tests/             # enotni testi
bun run test:smoke          # dimni testi (zahteva zagnan dev strežnik + DB)
```

Za lokalni PostgreSQL priporočamo kontejner `postgres:17` — ista različica
kot v CI in produkciji (glej `.github/workflows/ci.yml`).

## 3. Kaj mora prestati vsak PR

CI (`.github/workflows/ci.yml`) na sveže migrirani + sejani bazi zažene:

1. **Tipi** — `bunx tsc --noEmit` (nič napak, nič `any` brez utemeljitve),
2. **Lint** — `bun run lint`,
3. **Migracija sheme** — `prisma migrate deploy` (migracije, ne `db push`),
4. **Enotni testi** — `bun test tests/` (celotna sklopka mora ostati zelena),
5. **Dimni testi API-jev** — `bun run test:smoke` na živem dev strežniku.

Poleg tega veljata dve projektni varovali:

- **i18n invarianta** — ključi vmesnika so vedno popolni v vseh petih
  jezikih: `bun scripts/verify-i18n.ts` mora ostati zeleno (sl/en/hr/de/it).
  Vsebina zbirk je dvojezična (sl/en) prek `pick()`.
- **Preflight / fixity** — `bun scripts/fixity-check.ts` (SHA-256 nad
  arhivskimi vsebinami) in `bun scripts/preflight.ts` pred objavo.

## 4. Slog kode

- TypeScript v vsem projektu, `ES6+` uvoz/izvoz; imena naj nosijo pomen,
  ne konvencijo.
- Uredniški komentarji v slovenščini pojasnjujejo **zakaj**, ne kaj — vzorci:
  `src/app/layout.tsx`, `src/lib/claims.ts`.
- UI gradniki: najprej `src/components/ui` (shadcn), nato lastno. Brez
  novo uvedenih odvisnosti brez razprave (issue najprej).
- Sestavne meje (`src/app/error.tsx`, `not-found.tsx`, `loading.tsx`) so
  namerno samozadostne — ne smejo se zanašati na kontekste, ki so lahko
  vzrok napake.
- Pristopne komponente naj spoštujejo dostopnostno ploščo (mirni gibi,
  berljivost) in WCAG: semantični HTML, `aria-*`, tipkovnica, vidna
  zasnova fokus.

## 5. Vsebina: evidence model ni pogajanje

Vsaka trditev v zbirki sledi lestvici
`DOCUMENTED · CORROBORATED · TESTIMONY · TRADITION · UNVERIFIED · TO_COLLECT`
(popoln opis: [docs/GOVERNANCE.md](./docs/GOVERNANCE.md)):

- `DOCUMENTED` **zahteva** vir ali arhivsko enoto + konkreten `pageRef`;
  evidence gate (`src/lib/claims.ts`) to vsiljuje tudi na API (422).
- Najdena spletna sled sama po sebi **ni** dokaz (železno pravilo iz
  [docs/RESEARCH-PIPELINE.md](./docs/RESEARCH-PIPELINE.md)) — iskalni
  zadetek sme napredovati največ do katalogizacije (`UNVERIFIED`).
- Ustno izročilo je zakonit vir (`TESTIMONY`/`TRADITION`), vendar ga nikoli
  ne prikazujemo kot dokumentirano.
- Transkripcije arhivskih enot: vsak list neodvisno prebran vsaj dvakrat
  (VLM), soglasje po poljih zabeleženo; nesoglasja gredo v register
  kolizij, ne »tihih popravkov«.

Novi raziskovalni sklopi (»valovi«) dokumentirajte v `research-griblje/`
s številčeno datoteko in vnosom v `research-griblje/00-KAZALO.md`.

## 6. Veje, commiti, pull requesti

- Poimenuj veje po vzorcu: `feat/…`, `fix/…`, `chore/…`, `docs/…`,
  raziskovalni valovi `feat/valNN-tema`.
- Commit sporočila v slovenščini, opisna: kaj, zakaj, katera izdaja/val;
  če se dotaknejo vsebine — katera arhivska enota in strani.
- PR naj opisuje namen, tveganja in kako ste preverili; povežite issue
  (`Closes #NN`). PR-jev z mešanimi sklopi (koda + vsebina + infrastruktura)
  se izogibajte — lažji pregled, lažji povratni umik.
- Zgodovino `main` ne prepisujemo. Force-push ni dovoljen.

## 7. Varnost in zasebnost

- **Nikoli** ne vezite v repozitorij žetonov, ključev ali osebnih podatkov
  obiskovalcev. Skenirajte diff pred commitom; zgodovina je javna.
- Ranljivost prijavite zasebno prek GitHub Security Advisories
  (»Report a vulnerability«), ne v javnem issue-ju.
- GDPR: prispevki obiskovalcev (knjiga spominov, gostinska knjiga) sledijo
  pravilom zadrževanja iz [docs/PRIVACY.md](./docs/PRIVACY.md);
  `bun run gdpr:retention`.

## 8. Kje je kaj

| Pot | Vsebina |
| --- | --- |
| `src/app/` | App Router meje (layout, loading, error, not-found, exponat SSR) |
| `src/components/museum/` | enostranska muzejska aplikacija (orkestrator `museum-app.tsx`) |
| `src/lib/` | domenski sloj (vsebina, i18n, evidence, pipeline) |
| `prisma/` | shema, migracije, seme |
| `research-griblje/` | raziskovalni dnevnik, transkripcije, analize (velike binarne datoteke gredo v Git LFS — glej `.gitattributes`) |
| `docs/` | upravljanje, zasebnost, namestitev, API pogodba |
| `tests/` | enotni + dimni testi |

---

Pripombe na ta vodnik so dobrodošle kot PR v `CONTRIBUTING.md` — tudi ta
dokument spremlja ista pravila pregleda.
