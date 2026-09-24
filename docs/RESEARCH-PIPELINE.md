# Raziskovalni cevovod — od ugotovitve do objave (issue #27/L)

Formalni tok dela raziskave v zbirko:

```
Research finding
→ Archive/source record
→ document/page verification
→ transcription
→ Claim
→ Source link
→ Exhibit
→ Editorial review
→ Published
```

**Železno pravilo (iz issue #27/L):** najdena spletna sled sama po sebi
**ni** dokaz za `DOCUMENTED` trditev. Iskalni zadetek, AJAX odgovor
kataloga ali API izpis smejo napredovati samo do katalogizacije — dokler
enota ni dejansko odprta/brana (ali digitalizirana z dostopno stranjo),
sme trditev nositi samo `UNVERIFIED` / `TO_COLLECT`.

Mašina stanj je uveljavljena tudi v kodi: `src/lib/pipeline.ts`
(preverjeno v `tests/pipeline.test.ts`). Evidence gate
(`src/lib/claims.ts`) ostane zadnja vrata pred objavo.

---

## 1. Odri in zahteve

| # | Oder | Zahteva za vstop | Nosilec v shemi |
|---|------|------------------|-----------------|
| 1 | **Research finding** | vhod — izvor izrecen (`WEB_TRACE`, `CATALOGUE`, `DIGITIZED_UNIT`, `READING_ROOM`, `FIELD`, `ORAL`) | raziskovalni dnevnik (`research-griblje/`), worklog |
| 2 | **Archive/source record** | ustanova + signatura (fonds/serija priporočeno) | `ArchiveRecord` (unique `institution+signature`), `researchStatus` |
| 3 | **Document/page verification** | enota **brana** (`VIEWED_PARTIALLY`+) + konkretna `pageRef`; spletna sled brez digitalizacije/branja ne gre naprej | `ArchiveRecord.researchStatus` + `pageRef` |
| 4 | **Transcription** | neobvezen oder; če obstaja, mora nositi `pageRef` (prazen izpisek ni transkripcija) | raziskovalni dokument, `Claim.pageRef` |
| 5 | **Claim** | izjavljena trditev; `DOCUMENTED`/`CORROBORATED` pade skozi evidence gate **in** zahteva pošten `researchStatus` (enota, ki ni bila odprta in ni digitalizirana, ne nosi `DOCUMENTED`) | `Claim` |
| 6 | **Source link** | vir z **izrecno** licenco (tudi `UNKNOWN` je izrecen); brez vira mora trditev nositi arhivsko enoto | `Source` / `Claim.sourceId` |
| 7 | **Exhibit** | slug + muzejska številka (`MVG-…`) | `Exhibit` |
| 8 | **Editorial review** | verzija `APPROVED` + uredniški alias + razlog | `ExhibitVersion` |
| 9 | **Published** | transakcijska objava iz `APPROVED`, čiščenje predpomnilnika vodnika | `ExhibitVersion → PUBLISHED` |

Prehodi so **samo naprej po en oder** (`canAdvance`); `reachableStage`
pošteno pove, dokler kje enota dejansko je; `validatePipeline` preveri
celotno pot naenkrat (uporabno pri uvozu raziskovalnega vala).

## 2. Pravilo spletne sledi v praksi

Primer iz raziskave (46. val): VAČ kataloški zadetek »Šolski list s
prilogami 1929–41« je **kataloška sled** — naprej sme samo do odra 2
(`ArchiveRecord`, `researchStatus = NOT_VIEWED`). Trditev »šola
ustanovljena 1889« sme biti `DOCUMENTED` šele, ko je priloga »opis
kraja« dejansko brana (odra 3–4) — takrat ima trditev `pageRef`, vir in
arhivsko enoto hkrati.

Negativne ugotovitve (»fond ne obstaja«, »pot je v javnem katalogu
zapreta«) se dokumentirajo z izrecnim ločevanjem »zapreto ≠ ne
obstaja« — take ugotovitve ne potrebujejo odra 5, ampak svoj zapis v
raziskovalnem dnevniku.

## 3. Vloge in odgovornosti

- **Raziskovalec** — odri 1–4: katalogizacija, branje, transkripcija;
  pošten `researchStatus` (`NOT_VIEWED` = najdeno, ne prebrano).
- **Kurator** — odri 5–7: trditve, vezave, vključitev v zbirko;
  ocena `confidence`.
- **Urednik** — odri 8–9: pregled verzije, odobritev z razlogom,
  transakcijska objava (`EDITORIAL_TOKEN` — brez žetona poti vrnejo
  503, napačen 401, glej [GOVERNANCE](./GOVERNANCE.md)).

## 4. Kaj cevovod zavrne

- `DOCUMENTED` trditev na enoti z `researchStatus = NOT_VIEWED`,
  ki ni digitalizirana (»najdeno ≠ prebrano«, #27/E+M);
- spletna sled brez digitalizacije in brez branja na odru 3;
- transkripcija brez navedbe strani;
- vir brez izrecne licence;
- odobritev brez urednika ali brez razloga.

Vsi zavrnitvi so mašinski (`unmet` koda + slovenski razlog) —
primerni za dnevnik in za regresijske preverbe.
