# 150 — val 127: p56–61 osebni re-read (NR-14 okvir, dvojni sidro)

Datum: 2026-01 (seja web-526c62d3) · Veja: `feat/val127-p56-61-osebni-reread` · Osnova: main @ `1a7ea84` (val 126)

## 1. Namen

Protokol 150; plan po 149 §7.1: osebni re-read strani p56–61 (PS N83) v NR-14 črkovalnem
okviru. Metoda: trak/celica rez (24 bandov `make-osobands-v127.py`), kolonski
sidri (nsheet ×5 imena, kstack ×5 kl stolpec z rdečimi vrstičnimi črtami —
`make-osezz-v127.py`, načina `nsheet`/`kstack`/`cell`/`ksheet`), dvojni sidro
(kl vrednosti + jaethe/hišne-št. verige prek page mej).

## 2. Strukturna odkritja (najtežja plast vala)

1. **p59 fantom + manjkajoča vrstica**: register je imel 21 vrstic; fizično
   stran sestavljajo **20 vrstic (P1121–P1140) + Stiftung vrstica + prazna
   prečrtana vrstica**. Stari reg r20 (`'Hudales Matija'` j583 kl56) in r21
   (`'Pavlič Miha'` j9 kl1128) sta **fragmenta Stiftung vrstice** (rdeče
   9 prečrtano | 1128 prečrtano → rdeče 2|762) — odstranjena iz register,
   vsebina premaknjena v `page_observations_v127`. Vrstica **`Stabler
   Marlfa?` (P1139, 1/30, kl prazna, rdeča opomba "beyfügnung ... d.
   1. Mai?") je v starem register manjkala**.
2. **p61 razdeljena vrstica**: stari reg r0 (`kl='6/8'`=648) + r1 (kl 126) =
   **ena fizična vrstica** (648 prečrtano rdeče → zamenjava nejasna 126?/156?).
   Fizična r19 (`Feßdig Marlfa?`, 1/42, kl 1354?) je v starem register
   manjkala (reg r19 = pomešani r18/r19: jaethe od r19, kl od r18).
3. **Prečrtane kl vrednosti**: na p59/p60 je večina kl vrednosti **prečrtanih
   rdeče** (revizijska plast); stari bralec je prepisoval prečrtane (stare)
   vrednosti. Zamenjava je vidna le p59 r7 (1042→1085). Aktivne vrednosti
   zapisane, prečrtane dokumentirane v anmerkung.
4. **kl artefakti p58**: `'+56'`→`'1|56'`, `'-944'`→`'1|944'` — znak je
   **Joche stolpec '1'** (glavi stolpcev "Joche. | Klafter." na p59/p60!). Isti
   razrod sklepan tudi za `'-174'`→`'1|174'`, `'-1075'`→`'1|1075'` (anmerkung).
   Vrednosti z Joche 1 v **j|k formatu val 88** (`'|'` = izraziti j|k) —
   presledkovna forma (`'1 944'`) bi graditelja c4/f11 razbila (concat števk:
   1944 namesto 1·1600+944 = 2544); f11 p58 QKL 8918→15318 (+4×1600). Enako
   normalizirane tudi p59 `'1 1246'`→`'1|1246'` (pre-obstoječ artefakt starega
   registra), `'1 694'`→`'1|690'`, p56 `'1.1348'`→`'1|1348'`, p60 `'1 44'`/`'1 160'`.
5. **h stolpec '1/N' (p57–61)**: vrednosti 20/21/40/29... se ponavljajo —
   hipoteza: bodisi hišne št. (parcelne skupine) bodisi Jäthe+QK podenota
   (F-PV-07). Ohranjena stara konvencija zapisa (`'1 / N'`), dvom v anmerkung.
   h18 veriga p56 (prave hišne št.) ↔ p57/p58 (`1/18` Jattla vrstice) podpira
   hišno-št. interpretacijo.
6. **wohnort = 'Gruble'**: besedni stolpec pred Joche/Klafter na p59–62 =
   wohnort; p62 ima potrjeno `'Gruble'` (dominantna vrednost celega registera,
   264×) = gospostvo Griblje. p59–61 variabilne forme (Lubna?/Aibea?/Lobnitz?/
   Lchargo?) normalizirane kot `Gruble [?]`.
7. **'Zu M'Fleisch zu Riedl' (p60 r13)** in **'Lovro Gajšek' (p59 r0)** = stari
   bralec je prebral **sosednje celice (wohnort/kultur) kot lastnika**.

## 3. Imenske družine (NR-14 sodba, flag-only)

| Stara (reg) | Nova (trak + nsheet) | Potrditev |
|---|---|---|
| Pavšič Mijoš / Pavlič Miha (p59) | `Fodag Mainfal [?]` / `Fodag Miko? [?]` | nsheet ×5, jaethe 20/21 izmenično |
| Hanzel Gregor (p59 r12) | `Strauß Grogy [?]` | V2 Grogy≡Georg |
| Podobnik Gregor (p59 r13) | `Fodag Grogy? [?]` | nsheet |
| Pachluy/Leinig/Hemey/Krenigl/Pötlar Pötlar/Chlinig Pötg (p60) | `Feßdig Grogy/Jattla`, `Strauß Grogy`, `Fodag Mainfal`, `Christian Marlly?/Jattla`, `Haustück? Minalo?`, `Hauptstück? Mihal`, `Strauß Maude?` | nsheet ×5 jasno |
| Stettner/Mündertal Mändle (p60) | `Haustück? Minalo? [?]` ×2 | kl 1\|160 sidro |
| Sedig/Schinay/Brundloch Mauds/Muds/Mids (p61) | `Feßdig Jattla/Marlfa/Miko?`, `Strauß Maude/Grogy`, `Christian Grogy`, `Brustal? Minalo?`, `Brusthal? Michl?` | nsheet ×5 |
| Sedig Johann Landl / Sedig Johan (p61) | `Feßdig Jattla [?]` | 'Jattln' razdeljeno na 'Johann Landl' |
| Schinig Veitl/Veitlen/Veitla/Veitlin (p57) | `Mainig Jattla [?]` ×4 (1/18) | štirih-forma artefakt rešen |
| Schinig Wolfpaul (p57) | `Mainig? Mainfal? [?]` | h49 ×2 |
| Haberl Wolfp. / Rabius Wolfj. (p57) | `Stabler Marlfa? [?]` ×2 (1/30) | isti lastnik; p59 P1139 |
| Fidrič Wolf/Jura, Schimey Johann/Peterl/Gabriel/Michael (p56) | `Feßdig Malfa/Marlfa/Jhua(n)`, `Mainig? Jattln?/Jattla/Mihal?` | nsheet ×5 |
| Pappaport Mito (p56) / Pöppang Michl (p57) | `Lappany Miko? [?]` | h64 veriga p56↔p57 |
| Hunolt Mito/Georg (p56) | `Unlich Miko? [?]` / `Strauß Grogy [?]` | h45 ×2 + r15 |
| Wolbathar Pöllan/Gregor/Mache (p58) | `Wobathan? Jattla?/Grogy?/Mauds? [?]` | h47 veriga p57↔p58 |
| Hannß Gregor / Ludwig Pöllan / Schinig Pöllan (p58) | `Strauß Grogy`, `Feßdig Jattla`, `Mainig? Jattla?` | stand Gwindler |
| stand 'Gewürze' (p58) / 'Gärtler' (p61) | `Bauern Gwindler [?]` | isti stand forma p57–61 |
| Pudwig Johann / Pudzig Wolfj. (p57) | `Feßdig Jhua(n)`, `Feßdig Marlfa?` | V3 P/F |
| Wittig Johann (p57) | `Milleo? Johann? [?]` | h22 ×2 |

Nove hipoteze (odprte): **'Mainig?'** nova družinska forma (p56–58, 9 vrstic)
— sorodstvo z 'Mainfel/Mainpel ≈ Mihal' hipotezo neodločeno; **'Miko?'
variante** (Miido/Miibo/Maikło/Mildo) — vse pod eno družino z [?];
**'Fodag' ≡ 'Feßdig'** (P/F + slog) neodločeno; **'Mauds/Maude'** veriga
p57 h47 ↔ p58 h47 ×2 ↔ p60 r19 ↔ p61 ×5.

## 4. Klopf stolpec (dvojni sidro)

Točno se ujemajo z aktivnimi vrednostmi: p59 226/311/67/51/35/329/77/748/1450,
p60 42/1|160/444/130/61, p56 1491/568/94/154/842/554, p57 232/320,
p58 577/549, p61 226/311/67/51/35/329/748/1450. Preostanek: prečrtane +
preslikave (reg '234' p59 = fantom; reg '7045' = združitev 1042/1085;
reg '6/8' = 648). Nejasne števke z `[?]` (1258?, 121?, 627?, 1108?, 208?,
249?...). Stare vrednosti v `*_pre_v127`.

Popravek preslikave p59 (2. tek): fizična P1140 = stari r18 (kl 261) → novi
r19 (260, snimki owner/klafter pravilno proti starem r18); Stabler Marlfa?
(P1139) = VSTAVLJENA vrstica (old_i −1 — čist scaffolding brez pre polj in
brez bralskih markerjev, precedens v115 inserts); stari r19/r20 (Stiftung
fragmenta) odstranjeni brez vrstičnih snimk — vsebina v page_observations_v127.

## 5. Spremembe števca

register: 2876 → **2875** vrstic (p59 −1 fantom). Osebna plast KG se bo
prestavila ob naslednjem KG re-buildu (izven vala 127 — smoke pin 3765/982
ostaja, ker se KG artefaktov ne dotikamo).

## 6. Orodja (novi fajli, nestage)

* `make-osobands-v127.py` — 24 bandov (6 strani × 4 segmenti)
* `make-osezz-v127.py` — nsheet/kstack/ksheet/cell povečave (dodan `kstack`)
* `apply-val127-reread.py` — popravek register.json (snapshot `*_pre_v127`)

## 7. Odprto → naslednji vali

* p56–58: kl stolpec brez kstack pass (samo band sidra) — priporočen
  kstack pass v val 128 skupaj s p62–66 (p65 → RG-009/010).
* 'Mainig?' / 'Miko?' / 'Fodag≡Feßdig' / h-'1/N' semantika — NR-14 flag-only.
* kultur re-sidro p7 (F-H122-01), register 26-0326/26-0379 — nespremenjeno.
