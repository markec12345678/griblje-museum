/**
 * Dejanske dimenzije avtentičnih fotografij v /public/images/authentic.
 *
 * Uporabljajo jih IIIF manifesti (točne Canvas dimenzije) in pogovorno
 * okno zapisa (naravno razmerje slike namesto obreznega okvira), da se
 * pokončne fotografije — npr. spomenik s trinajstimi imeni — pokažejo
 * v celoti, kakor to počnejo predstavitve predmetov vodilnih muzejev.
 *
 * Vir: IIIF revizija 2026-09 (slika mora ustrezati napisu pod njo).
 */
export const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  // revizija 2026-09 (2. krog): hero = izrez panorame na pas vasi; glavna slika vasi = Andrejj
  "/images/authentic/hero-griblje.jpg": { width: 2000, height: 573 },
  "/images/authentic/solunska-fronta.jpg": { width: 800, height: 541 },
  "/images/authentic/tobak-burley.jpg": { width: 946, height: 645 },
  "/images/authentic/pastirji-ovce.jpg": { width: 1920, height: 1280 },
  "/images/authentic/mera-peak.jpg": { width: 1920, height: 897 },
  "/images/authentic/razglednica-metlika.jpg": { width: 1093, height: 671 },
  "/images/authentic/kmecke-zene-testo.jpg": { width: 1920, height: 1283 },

  // revizija 2026-09 (3. krog): 16. sklop — povest 1914, Ilirske province, Tone Kralj
  "/images/authentic/novo-zivljenje-1914.jpg": { width: 960, height: 1594 },
  "/images/authentic/ilirske-province-1812.jpg": { width: 1920, height: 1946 },
  "/images/authentic/lesniki.jpg": { width: 1280, height: 960 },

  // 20. sklop: španska gripa 1918 — mrliška knjiga Podzemelj 04894 (stran z vpisi 1.–4. 11. 1918)
  "/images/authentic/spanska-gripa-1918.jpg": { width: 2659, height: 2000 },

  // 21. sklop: reka ekstremov — Kolpa pri vodomerni postaji Metlika, 17. 9. 2022 (iz poročila ARSO)
  "/images/authentic/kolpa-poplava-metlika-2022.jpg": { width: 686, height: 515 },

  // 23. sklop: občina Griblje — izrez tabele Okraj Črnomelj iz priročnika Županske zveze (1937, javna last)
  "/images/authentic/obcina-griblje-1937.jpg": { width: 1473, height: 1050 },

  // 20. sklop, revizija 2026-10: izrez Freyerjeve karte z Gribljami — pravi položaj vasi ob Kolpi
  // (posnetek NUK prek GA&C; prejšnji izrez je prikazoval napačen del lista)
  // 22. sklop: nadgradnja iz master posnetka Wikimedia Commons (dLib, 25.952 × 20.000) — obe imeni: Griblje + (Grüble)
  "/images/authentic/freyer-griblje-izrez.jpg": { width: 1400, height: 1345 },

  "/images/authentic/griblje-vas.jpg": { width: 800, height: 574 },
  "/images/authentic/zaselki-griblje.jpg": { width: 1920, height: 1286 },
  "/images/authentic/dakota.jpg": { width: 1600, height: 1200 },
  "/images/authentic/griblje-iz-orbite.jpg": { width: 1600, height: 1067 },
  "/images/authentic/sveti-vid.jpg": { width: 1048, height: 1600 },
  "/images/authentic/bojanci-1908.jpg": { width: 729, height: 426 },
  "/images/authentic/sokcev-dvor.jpg": { width: 1600, height: 1200 },
  "/images/authentic/kolpa.jpg": { width: 1600, height: 1200 },
  "/images/authentic/malenca.jpg": { width: 1600, height: 1200 },
  "/images/authentic/mlin-pobrezje.jpg": { width: 1600, height: 1075 },
  "/images/authentic/niko-zupanic.jpg": { width: 426, height: 612 },
  "/images/authentic/snos-crnomelj.jpg": { width: 1600, height: 1200 },
  "/images/authentic/otok-letalisce.jpg": { width: 1600, height: 1054 },
  "/images/authentic/evakuacija.jpg": { width: 1600, height: 1072 },
  "/images/authentic/meja.jpg": { width: 1600, height: 1063 },
  "/images/authentic/ribnik.jpg": { width: 1600, height: 1067 },
  "/images/authentic/stara-hisa.jpg": { width: 1600, height: 1520 },
  "/images/authentic/ravnace.jpg": { width: 1600, height: 1200 },
  "/images/authentic/jurjevanje.jpg": { width: 1236, height: 903 },
  "/images/authentic/pogaca.jpg": { width: 1600, height: 1063 },
  "/images/authentic/predenje.jpg": { width: 682, height: 1070 },
  "/images/authentic/storklja.jpg": { width: 1600, height: 1067 },
  "/images/authentic/breze.jpg": { width: 1600, height: 997 },
  // zamenjane slikovne poti (revizija 2026-09: slike morajo ustrezati napisom)
  "/images/authentic/zaseda-spomenik.jpg": { width: 342, height: 332 },
  "/images/authentic/spomenik-griblje.jpg": { width: 221, height: 540 },
  "/images/authentic/glasbena-crnomelj.jpg": { width: 1920, height: 1440 },
  "/images/authentic/izseljenci-ladja.jpg": { width: 1509, height: 964 },
  "/images/authentic/vino-presa.jpg": { width: 618, height: 1010 },
  "/images/authentic/hisa-adlesici.jpg": { width: 1000, height: 619 },
  // nove slike zapisov, ki so prej padle na hero-fallback
  "/images/authentic/pgd-crpalka-1924.jpg": { width: 1200, height: 1600 },
  "/images/authentic/dragos-kolpa-1920.jpg": { width: 1076, height: 681 },
  "/images/authentic/kambic-bozic.jpg": { width: 620, height: 1032 },
  "/images/authentic/matica-podzemelj-1669.jpg": { width: 2548, height: 1652 },
  "/images/authentic/porocna-1669-zacekni-vpisi.jpg": { width: 1130, height: 1540 },
  "/images/authentic/porocna-1669-razprostrt.jpg": { width: 2502, height: 1654 },
  "/images/authentic/freyer-special-karta-1843.jpg": { width: 3840, height: 2959 },
  "/images/authentic/cerkvisce-kapelica.jpg": { width: 1400, height: 1875 },
  "/images/authentic/pasuljada.jpg": { width: 1600, height: 1200 },
  "/images/authentic/katarina-herbarij.jpg": { width: 2069, height: 2920 },
  "/images/authentic/gasperic-kolpa.jpg": { width: 1600, height: 1067 },
  "/images/authentic/madronicev-mlin.jpg": { width: 962, height: 617 },
  "/images/authentic/ucilnica-muzej.jpg": { width: 1600, height: 1067 },
  "/images/authentic/zvon.jpg": { width: 1400, height: 1400 },
  "/images/authentic/brinc-krovska.jpg": { width: 684, height: 1083 },
  "/images/authentic/kavboji-oprava.jpg": { width: 900, height: 759 },
  // 10. sklop: Zapisovalci vasi in njeno leto (2026-09-16)
  "/images/authentic/pisanice.jpg": { width: 1600, height: 1200 },
  "/images/authentic/kres.jpg": { width: 1600, height: 1200 },
  "/images/authentic/zganje.jpg": { width: 751, height: 744 },
  "/images/authentic/kolpa-dolina.jpg": { width: 2000, height: 1075 },
  // revizija 2026-10: portreta zapisovalcev (Barle 1932, Dular) namesto ilustrativnih podob (orgle, lapidarij)
  "/images/authentic/janko-barle-1932.jpg": { width: 500, height: 721 },
  "/images/authentic/joze-dular-portret.jpg": { width: 500, height: 607 },
  "/images/authentic/oranje-voli.jpg": { width: 861, height: 645 },
  "/images/authentic/balmorhea.jpg": { width: 1400, height: 859 },
  // 11. sklop: Vasi, ki se spominja same sebe (2026-09-16)
  "/images/authentic/td-kopališka-hisica.jpg": { width: 2000, height: 1149 },
  "/images/authentic/gribeljci-2019.jpg": { width: 1078, height: 691 },
  "/images/authentic/lastovka.jpg": { width: 1600, height: 1188 },
  "/images/authentic/maraton.jpg": { width: 2000, height: 1333 },
  "/images/authentic/valvasor.jpg": { width: 1100, height: 1287 },
  "/images/authentic/radio-kosmaj.jpg": { width: 1600, height: 1032 },
  "/images/authentic/noša-1942.jpg": { width: 470, height: 668 },
  // 12. sklop: stari zemljevidi (Homann 1714) + pečnica za sušenje sadja (Vesel 1928)
  "/images/authentic/stari-zemljevid.jpg": { width: 2000, height: 1671 },
  "/images/authentic/pecnica-susenje.jpg": { width: 960, height: 583 },
  // 13. sklop: šport (štart maratona 2012), noša (Vurnikova risba 1928), rudnik Kanižarica
  "/images/authentic/maraton-start.jpg": { width: 1280, height: 662 },
  "/images/authentic/peca-1928.jpg": { width: 1100, height: 1697 },
  "/images/authentic/kanizarica.jpg": { width: 900, height: 599 },
  "/images/authentic/sturm-1891.jpg": { width: 1680, height: 1291 },
  "/images/authentic/zbul-cebula.jpg": { width: 1280, height: 960 },
  "/images/authentic/griblje-ravnina.jpg": { width: 1280, height: 857 },
  "/images/authentic/zeleni-jurij-1908.jpg": { width: 1280, height: 620 },

  // 25. sklop: Konrad Barle — čebelnjak na Vrhu pri Komatarju (Boris Orel, SEM, 1952, javna last)
  "/images/authentic/cebnjak-orel-1952.jpg": { width: 1033, height: 1054 },
};

export const FALLBACK_DIMENSIONS = { width: 1600, height: 1067 };

export function imageDimensions(image: string) {
  return IMAGE_DIMENSIONS[image] ?? FALLBACK_DIMENSIONS;
}

/** Ali je slika pokončna (razmerje < 0.9) — takšne v dialogu pokažemo v celoti. */
export function isPortraitImage(image: string) {
  const { width, height } = imageDimensions(image);
  return height / width >= 0.9;
}
