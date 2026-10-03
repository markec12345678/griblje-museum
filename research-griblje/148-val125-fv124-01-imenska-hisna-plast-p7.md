# 148 — Val 125: F-V124-01 REŠEN — P7 IMENSKA + HIŠNA PLAST (NR-14 celicni zoomi) — 0 VLM

**Datum:** 2026-10-03 · **Issue:** #42 §4/§14 · **Obseg:** F-V124-01 iz protokola 147 §8 — p7 imenska/hišna plast (22 vrstic: 20 podatkovnih Nro 81–100 + EXTRA + fantom Fürtrag) · **Status:** **vgradnja** — 7 strukturnih imenskih popravkov v57 + 9 hišnih popravkov + 1 hišni artefakt (fantom) + hišni zaključek EXTRA vrstice; register **2876 vrstic (nespremenjeno — 0 novih vrstic)**; vrednostni sloj **NIČ sprememb** (v124 zaključen); KG vsebinsko identična (timestamp-only sha prehod **ee3ac862 → ab418c75**); 0 VLM klicev.

---

## 1. Kontekst in metoda

- **Orodja:** `val124-anchor/make-zoom-v125.py` (posamezne celice ×12–24 + označeni traki; grid val 121/124 nespremenjen: **top0_lin=160.25, n=22, mean_off 1.86 — cal OK brez pina**) + `build-register-v125.py` (GUARD deklarirano-staro ≟ register + snimke `owner_original_pre_v125` / `haus_no_pre_v125`) + celicni zoomi na 22 imen in 22 hiš.
- **NOVI GEOMETRIJSKI NAUK (F-V125):** imena/hiše/Nro so **BOTTOM-anchor** — baseline na SPODNJEM pravilu pasu, name opisovalca prečka svoje spodnje pravilo (nasprotje vrednostnemu sloju, ki je TOP-anchor po v124). Lastništvo pasu je potrjeno z **Nro sidri**: Nro + hiša + ime stojijo na ISTEM pravilu, znotraj pasu [top r .. top r+1]. Stisnjena vrstica Nro 92 (r11) je zapisana **VISOKO v pasu** (leva stran brez pravila; desna tiskano pravilo 585–603).
- **digitcmp** oblike števk iz iste strani (metoda val 121/124): 5 = raven vrh z zastavico; 4 = odprt vrh + prečka; 6 = zaprta spodnja zanka; 7 = diagonalna brez zanke; 8 = dvojna zanka; 9 = skleda + rep.
- **0 VLM klicev** — vsa branja agentski vid v glavni seji (sub-agenti pixel-slepi, F-OCI-01).

## 2. KLJUČNE NAJDBE (imenska plast — 7 struktur. popravkov)

| r | Nro | v57 (prej) | rokopis (×12–20) | v125 | razred |
|---|-----|------------|------------------|------|--------|
| r1 | 82 | Poiding Hanl | **Pödigz Hanl** | Pödigz Hanl | misbranje črk (gz≠ng) |
| r5 | 86 | Schimeczkhanl | **Schimecz Mihual** (2 besedi!) | Schimecz Mihual | strukturna |
| r9 | 90 | Poiding Matthl | **Pödigz Maruſa** | Pödigz Marusa | strukturna |
| r11 | 92 | (K)hanzl Valen | **Schimez P…a** (stisnjeno) | Schimez P…a | v57 ovržena; 2. beseda nečitljiva |
| r12 | 93 | Poiding Matthl | **Pödigz Maruſa** | Pödigz Marusa | strukturna |
| r13 | 94 | Peders Marbl | **Rabutschar Grogy** | (R)abitscher Georg | strukturna — NAPAČNA OSEBA |
| r18 | 99 | (R)abitscher Marbl | **Strauß Grogy** | Strauß Georg | strukturna — NAPAČNA OSEBA |

- **r5:** v57 je BRAL SKUPAJ dve besedi — »Schimeczkhanl« je pravilen SAMO na r0; r5 je »Schimecz Mihual« (2. beseda Mi⟨h⟩ual ≈ Michael; descender zanka → h/f sodba NR-14).
- **r9/r12:** isti zapis (ultra ×20: r9-w2 ≈ r12-w2) — »Pödigz Maruſa«; long-s z descender zanko, **BREZ t-prečk → 'Matthl' nemogoče**; Maruša ≈ Marija. Knjiga v124 'Marls' — varianta, sodba NR-14.
- **r13:** rokopis jasno »Rabutschar Grogy« = **ista oseba kot r14** (Nro 94 + 95 = dve parceli istega lastnika). Forma v register po kobildi r14 `(R)abitscher Georg` (person-key stabilnost); surova oblika v readings-v125. Knjiga v124 'Pödigz Marls?/Peders?' — ovržena.
- **r18:** rokopis jasno »Strauß Grogy« (Nro 99; isti lastnik kot r19/Nro 100). Tako v57 kot hitro branje v124 ('Rabatschar Marbl') napačni. Forma po kobildi r15/r19 `Strauß Georg`.
- **r11:** stisnjeno ime — 1. beseda = Schimez-koren (cf. r10 »Schimez Hanl«), 2. beseda P-a-?-?-a nečitljiva tudi pri ×14 → zapis `Schimez P…a`.
- **varianta (KEEP, sodba NR-14):** Rabitscher/Rabutschar (r7/r14/r16/r17), Georg/Grogy (r8/r14/r15/r18/r19) — register forme ostanejo, surove oblike dokumentirane.

## 3. Hišna plast (9 popravkov + 1 artefakt + EXTRA zaključek)

| r | prej (v57) | v125 | dokaz (×24, digitcmp) |
|---|-----------|------|------------------------|
| r1 | 63 | **53** | raven vrh + zastavica = 5; dve skodeli = 3 |
| r2 | 20 | **54** | 5 + 4; '20' ni na rokopisu (preskok-epoha) |
| r5 | 65 | **49** | 4 (odprt vrh) + 9 (skleda + rep) |
| r10 | 35 | **55** | 5 + 5 (isti digitcmp kot klafter pas) |
| r13 | 80 | **48** | 4 + 8 (dvojna zanka) — '80' ovrženo |
| r14 | 48 | **45** | 4 + 5 |
| r15 | 45 | **47** | 7 brez spodnje zanke (cf. r16/r17) |
| r18 | 47 | **46** | 6 z zaprto spodnjo zanko |
| r19 | 46 | **45** | 4 + 5 |
| r21 | '48' | **''** | fantom Fürtrag vrstica NIMA hiše — celica PRAZNA; '48' = v112 artefakt |

- **r20 EXTRA:** hišna celica **PRAZNA (ni zapisana, ne neberljiva)** — anmerkung zaključek hišnega dela F-V124-01; v124 »neberljiva« korigirano.
- **Vse hišne vrednosti p7** (22 vrstic): 65, 53, 54, 54, 54, 49, 54, 47, 45, 50, 55, 56, 50, 48, 45, 47, 47, 47, 46, 45, —, —.

## 4. Kaskada (izrecna)

register (17 poljskih sprememb: 7 owner + 10 haus; 2876 vrstic) → **c4 v90**: K9 p1–55 **56/960/84** + klafter_plain_le99 178 — vse NESPREMENJENO (0 vrednostnih popravkov; meta nosi nov register vhod-sha) → **KG vsebinsko IDENTIČNA** (3764 vozlišč / 3473 vezi / PERSON 981 / PARCEL 2427 / HAS_PARCEL 2775; builder ne bere owner_original iz register.json za PERSON/OWNER_OF — osebna plast = **person-owner-register + house-register owners.ps, val 59 snapshot**; sha **ee3ac862 → ab418c75**, timestamp-only) → story (3764/3473/4) → timeline (8 točk; I1/I2/I6 ✓) → coverage (PASS 8; §24 14/14) → source-coverage PS rows 2876 → **analysis-v5/v6 byte-identna re-runa** → runtime src/data sinhronizirana. **Osebna plast NESPREMENJENA** (F-SYNC-04 prek snapshot arhitekture).

## 5. Odpri flagi (iskrenost — nič siljeno)

- **F-V125-01 (NOV):** person-owner-register + house-register owners.ps = val 59 snapshot (PARTIAL 55/143 epoha) — **ne odražajo v125 imenskih/hišnih popravkov** (npr. H-035 'Schimez Hanl' pages vključuje p7 po stari hiši 35; zdaj r10 = hiša 55). Uskladitev = **pass2 re-run šele PO NR-14 črkovalni sodbi** (en prehod, ne dva — NR-14 bo spremenila še več imen).
- **NR-14:** črkovalne variante p7 za izenačitev: Rabitscher/Rabutschar, Georg/Grogy, Maruſa/Marusa/Marls, Mihual/Michual, Schimez P…a 2. beseda, Pödigz-Poiding koren (rešeno v v125).
- **kultur_p7:** dvovrstični 'Lehngut Hfl.' nizi čez pravila — ostaja ločen prehod (v124 flag, nespremenjen).
- **r11 2. beseda** ostaja nečitljiva (…); **262 prva številka** (v124) ostaja odprta; hišne celice na meji ločljivosti JPEG (~10 px) — sodbe z digitcmp iz iste strani.

## 6. Iskrenost (§4)

- **0 VLM klicev**; vsa branja agentski vid na programsko generiranih izrezkih (crops-v125/ regenerabilni, .gitignore).
- **Vse spremembe z GUARD-om** (deklarirano staro ≟ register, fail-fast) + snimke `owner_original_pre_v125` / `haus_no_pre_v125`; anmerkung add-only `[v125: …]`; stare v123/v124 opombe ostanejo (zgodovinski vir).
- **Idempotenten builder** (drugi tek = nič); dopolnilni tek popravil r20 anmerkung zaključek (edina add-only vrstica brez poljske spremembe).
- Testi: **+25 varovalk (tests/val125-fv124-01-imenska-hisna-plast-p7)** + izrecen prehod pinov: KG sha ee3ac862→ab418c75 (20 datotek), v112-ps-reread 264→252 (val112/114/115), jaethe_pre_v112 snimke 58→47, v124-dvojni-anchor 2→1 (r11 → v125), val123 F-V123-01 r11 rp; **1383 testov: 1372 pass / 11 skip / 0 fail**; lint + tsc čisti.
- Docs: protokol 148 + KAZALO 148 + README 185. sklop.

## 7. Naslednje

1. **NR-14 črkovalna sodba + p56–143 osebni re-read** (reši RG-009/010/011 in PROVISIONAL lastnike h72/74/76; vključno s p7 variantami iz §2) → **pass2 re-run** (F-V125-01 uskladitev osebne/hišne plasti);
2. kultur re-sidro p7 (dvovrstični nizi) — majhen ločen prehod;
3. register 26-0326/26-0379 ob javnih poročilih eArheologija;
4. F-H122-01: deterministična disambiguacija 13 podvojenih H-1-* ID-jev.
