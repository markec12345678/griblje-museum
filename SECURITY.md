# Varnostna politika / Security Policy

## Podprte različice

Vzdržujemo samo najnovejšo `main` vejo. Popravke ranljivosti gredo vedno v `main`
in se objavijo z naslednjim delovanjem (Vercel deploy sledi `main`).

We only support the latest `main` branch. Security fixes always land on `main`.

## Kako prijaviti ranljivost / Reporting a vulnerability

**Ne odpiraj javnega issue-ja za varnostne težave.**

Uporabi **GitHub Private Vulnerability Reporting**:

1. Odpri zavihek **Security** repozitorija → **Report a vulnerability**
   (ali neposredno: https://github.com/markec12345678/griblje-museum/security/advisories/new)
2. Opiši težavo, korake za reproduciranje in morebiten predlog popravka.
3. Privlačnost prosim oceni po CVSS, če je mogoče.

Prijava je zasebna; odgovorimo v roku **7 dni** in po potrebi objavimo
koordiniran popravek ter GitHub Security Advisory.

## Obseg / Scope

**V obsegu:**
- spletna aplikacija (Next.js) v `src/`
- CI delovni tokovi (`.github/workflows/`)
- migracijske in raziskovalne skripte, ki se izvajajo

**Izven obsega (prijava pri lastnikih vsebin, ne sem):**
- ugrabi (scrapeane) tretje strani pod `research-griblje/` in `research-grants/` —
  težave v njihovi vsebini prijavi lastnikom izvornih spletišč
- raziskovalne ugotovitve in interpretacije zgodovinskih virov

## Skrivnosti in žetoni / Secrets

- Vsi zgodovinsko zajeti tretjeosebni ključi so v repozitoriju redigirani z
  oznakami `[REDACTED-*]`; če odkriješ delujočo skrivnost, jo prijavi prek
  zasebne prijave zgoraj.
- Za zaznavanje prihodnjih uhajanja uporabljamo **secret scanning** z **push
  protection** — poskus pusha skrivnosti bo zavrnjen.
- Nastavitve (npr. `RATE_LIMIT_STORE`) so opisane v `docs/DEPLOYMENT.md`;
  skrivnosti živijo izključno v strežniških okoljskih spremenljivkah.

## Zahvale / Credits

Zahvaljujemo se vsem odgovornim prijaviteljem; na željo te navedemo v
advisory (prosim navedi, če želiš ostati anonimen).
