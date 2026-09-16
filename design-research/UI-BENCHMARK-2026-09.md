# UI benchmark: Muzej vasi Griblje vs. najboljši digitalni muzeji sveta (16. 9. 2026)

## Analizirani muzeji (agent-browser: DOM + izračunani CSS + zajem zaslona)
| Muzej | Tekstna pisava | Naglasna pisava | Naslovi | Ozadje | CTA |
|---|---|---|---|---|---|
| Rijksmuseum (Collection Online) | RijksText | RijksText | 18–48 px | topla krem (239,234,231) | besedilne povezave + Filter; masonry z naravnimi razmerji |
| Louvre | Roboto | LouvreSerif 48px/400 | 48 px | ČRNO | pilasta (41 px) turkizna CTA |
| Van Gogh Museum | Gotham Rounded | isto | 65–82 px/500 | krem-rumena (248,242,216) | ostro 0 px, »Find out more« |
| MoMA | MoMA Sans | MoMA Sans 900 | 40–60 px | belo | ostro 0 px |
| Nasjonalmuseet | MuseetSans | isto | 72–120 px/500 | belo | 2 px, črno; uniformne ploščice 3:4 |
| Google Arts & Culture | Google Sans Text | Google Sans 32/400 | 32 px | belo | igriva navigacija (Play, The Lab) |
| **Muzej Griblje (pred)** | **system-ui (napaka!)** | Fraunces 72px/600 | 30–72 px | topla krem ✓ | 6 px, zelena |

## Ugotovljene vrzeli pri nas
1. **KRITIČNO — besedilna pisava se ni uporabljala**: spremenljivki Geist sta bili
   na <body>, Tailwind pa bereta iz <html> → ves tekst v system-ui. Vsi vrhunski
   muzeji imajo prepoznavno tekstovno pisavo.
2. **Dialog je obrezoval slike na 16:9** — pokončne fotografije (spomenik s 13 imeni,
   portreti, strani knjig) bi bile obrezane na vodoravni rez. Rijksmuseum/Louvre
   predstavijo predmet V CELILOTI z naravnim razmerjem.
3. Zgodba v dialogu 15 px — editorjalno branje pri vrhunskih muzejih 16–18 px / 1.7.
4. Hero CTA gumbi 6 px — Louvre (nagrajena stran) uporablja pilaste.

## Izvedene spremembe
1. layout.tsx: Geist spremenljivki na <html> → vsa besedila sedaj Geist
   (par Fraunces + Geist, vzporedno LouvreSerif + Roboto).
2. Nov src/lib/image-dimensions.ts (44 slik, skupno z IIIF) +
   ExhibitImageStage: naravno razmerje slike, pokončne centrirane z zmogljivim
   maxWidth (62vh × razmerje, max 420 px), ležeče čez celo širino; zoom/3D ohranjata
   16:10 oder. IIIF uvozi skupno knjižnico (ena resnica o dimenzijah).
3. Zgodba: 16→17 px, leading 1.75 (dolgočasovno editorialno branje).
4. Hero CTA: 4 gumbi → pilasti (rounded-full), px-7.
5. Ostalo ( že skladno s prakso ): topla krem paleta ✓, sticky header z
   backdrop-blur ✓, eyborw kickers ✓, razgovorni CTA ✓, a11y načini
   (Atkinson, mirni gibi, podčrtane povezave) ✓, footer mt-auto ✓.

## Preverba
- tsc 0 napak; eslint 0 napak (2302 znanih opozoril, nespremenjeno)
- Brskalnik: bodyFont Geist ✓; pokončni odër 228×558 (0.41 = natanko spomenik) ✓;
  ležeči 766×575 (1.33) ✓; mobilni 390 px brez vodoravnega preliva ✓;
  footer prisoten ✓; 0 napak konzole ✓
