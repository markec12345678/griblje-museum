# Val 72 — sodobna geopodlaga za GEOREF PASS v2 (issue #42 §10)

Vir: Overpass API (mirror maps.mail.ru/osm/tools/overpass/api/interpreter), 2026-09-26, bbox (45.565,15.240,45.608,15.321) oz. širši za reko.

| datoteka | vsebina | uporaba |
|---|---|---|
| osm-housenumbers-griblje-bbox.json | 296 elementov z addr:housenumber (99 v jedru vasi ≤900 m od sidra) | poskus vezave hišna št. 1825 ↔ sodobna (NEGATIVEN rezultat — ni konsenza, glej georef-1825.json) |
| osm-buildings-pois-griblje-bbox.json | 800 elementov: stavbe + cerkev sv. Vid (45.5676711, 15.2903638) + ime "Sv. Vid" | validacija poravnave (mediana 17 m za v65 objekte) |
| osm-river-kolpa-lahinja.json | centerline Kupa/Kolpa (way 39699026, 1966 točk) + Lahinja | RAVALO za afina poravnavo (351 sledenih točk na rastro) |
| osm-water-polygons.json | riverbank/pond poligoni (Kolpa severni doseg, Rilac, Muljevac) | kontrolni pregled; v prilagajanju NE uporabljen |

Pravila (#42 §1/§8): sodobni OSM NI zgodovinski dokaz — uporabljen izključno kot sodobna podlaga za poravnavo in validacijo; vsak kontrolni podatek ima mapping_rule + ostankove (residuals) v research-griblje/atlas-1825/georef-1825.json.
