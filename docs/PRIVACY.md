# Zasebnost in GDPR (issue #27/H)

**Veljavnost:** ta dokument opisuje dejansko stanje sistema. Ob vsaki
spremembi zbiranja podatkov se posodobi.

## 1. Katere osebne podatke zbiramo

Zbiramo izključno podatke, ki jih obiskovalec sam vnese v prispevke
skupnosti (spominska knjiga `/api/guestbook`, spomini ob predmetu
`/api/memories`):

| podatek | obveznost | namen | hramba |
|---|---|---|---|
| ime ali vzdevek | obvezno | prikaz ob prispevku | dokler uporabnik ne zahteva izbrisa/anonimizacije |
| kraj (odkod piše) | opcijsko | prikaz + statistika krajev | dokler uporabnik ne zahteva izbrisa/anonimizacije |
| besedilo prispevka | obvezno | muzejska vsebina | dokler uporabnik ne zahteva popolnega izbrisa |
| jezik vpisa | samodejno | prikaz | dokler prispevek obstaja |
| čas vpisa | samodejno | vrstni red, moderacija | dokler prispevek obstaja |

**Ne zbiramo:** e-pošte, telefona, piškotkov, IP-jev v bazi,
identifikatorjev naprav, lokacije. IP se uporablja izključno v pomnilniku
strežniškega primerka za omejitev hitrosti (drseče okno 5 prispevkov /
10 minut) in se **nikoli** ne zapiše v bazo ali dnevnik.

## 2. Namenska raba

- prikaz prispevka v spominski knjigi / ob predmetu,
- moderacija (preprečevanje spam-a in neprimernih vsebin),
- zbirna statistika obiska — **brez** osebnih podatkov (šteje se samo
  dan/vrsta/jezik/ključ, glej `StatDay` v shemi).

Podatkov ne delimo z tretjimi osebami in jih ne uporabljamo za
trženje. Pravna podlaga: soglasje osebe z oddajo prispevka in zakoniti
interes muzeja za umirjeno skupnostno vsebino.

## 3. Retencija (samodejno izvršena, `scripts/gdpr-retention.ts`)

| status | pravilo |
|---|---|
| `published` | hranjen do izbrisa/anonimizacije na zahtevo |
| `pending` | do kurotorskega pregleda |
| `rejected` | **fizicni izbris po 30 dneh** |
| `hidden` | 365 dni, nato obvezen moderatorski pregled (poročilo) |
| `deleted` (mehko) | **fizicni izbris po 30 dneh** |

Izvršitev se evidentira v tabeli `Job` (type `retention`,
idempotencyKey `retention-<dan>`) — ponovni zagon istega dne ne podvoji
dela.

## 4. Pravice posameznika

- **Dostop (čl. 15):** prispevek je javno viden — uporabnik vidí točno
  tisto, kar je vneseno. Notranja metapodatka moderacije so
  interni in so na zahtevo dostopni prek moderatorja.
- **Popravek (čl. 16):** moderator popraví ime/kraj/besedilo na zahtevo
  (akcija + zabeležen razlog v meta podatkih moderacije).
- **Izbris (čl. 17):** dve stopnji:
  - *anonimizacija* — ime → »Izbrisan uporabnik«, kraj → odstranjen;
    besedilo ostane kot muzejski vir:
    `bun scripts/gdpr-retention.ts --anonymize-guestbook <id>`
    (oz. `--anonymize-memory <id>`);
  - *popoln izbris* — mehki izbris prek moderacije (`soft-delete`),
    fizicno čiščenje samodejno po 30 dneh.
- **Omejitev obravnave (čl. 18):** akcija `hide` — prispevek ostane,
  ni pa javno viden.

Zahteve: pošta na sedež muzeja ali kontaktna e-pošta lastnika (polje se
dopolni ob obratovanju). Odzivnost: brez odvečnega zamuda, najdlje v 30
dneh.

## 5. Kdo sme podatke videti

| vloga | dostop |
|---|---|
| javni obiskovalec | samo `published` prispevki (ime, kraj, besedilo, jezik, datum) |
| moderator (`MODERATION_TOKEN`) | + vrsta `pending/rejected/hidden`, metapodatki moderacije, akcije |
| urednik (`EDITORIAL_TOKEN`) | verzije, trditve, arhivski zapisi (raziskovalne opombe) |
| upravljavec baze | celotna baza (Neon, dostop po najmanjšem priviligu — glej docs/DEPLOYMENT.md) |

Dnevniki ne vsebujejo osebnih podatkov (issue #27/V: correlation ID +
tehnicne napake, brez imen/vsebin prispevkov).
