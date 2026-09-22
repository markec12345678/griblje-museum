import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const targets = {
  katarina: 'e3f35c7f-1586-45d5-a858-a0f44115c213',
  nosa: 'f0ba16ec-e65c-49a9-a4d6-9ab9b10d92f2',
  niko: '07c87fda-d11d-4554-a425-79f95d812f3a',
  uskoki: '2b861417-2266-4fc9-a00f-9fc10d8a0f85',
};

async function maxOrder(exId) {
  const m = await db.source.aggregate({ where: { exhibitId: exId }, _max: { sortOrder: true } });
  return (m._max.sortOrder ?? 0);
}

const sources = [
  { ex: targets.katarina, nameSi: "Etnolog 10/11 (1937/1939): Katarina Zupanič, »Šopek poljskih cvetlic iz Gribelj v Beli Krajini«, str. 114–146 — polno besedilo PDF (Slovenski etnografski muzej)",
    nameEn: "Etnolog 10/11 (1937/1939): Katarina Zupanič, 'A bouquet of meadow flowers from Griblje in Bela krajina', pp. 114–146 — full-text PDF (Slovene Ethnographic Museum)",
    type: "objava", license: "Digitalizirani vir Slovenskega etnografskega muzeja",
    url: "https://www.etno-muzej.si/files/etnolog/pdf/etnolog_10_11_1937_1939_sopek.pdf",
    noteSi: "Polno besedilo (33 strani): narodno blago je zbrala in zapisala Katarina Zupanič v letih 1894.–1895. po nagovoru sina Nika; uvod zapiše, da Griblje takrat šteje 110 domov, ter citira listino z leta 1524 o turškem napadu.",
    noteEn: "Full text (33 pages): folk material collected and written down by Katarina Zupanič in 1894–1895 at her son Niko's urging; the introduction notes Griblje then counted 110 homesteads and quotes a document of 1524 about a Turkish raid." },
  { ex: targets.nosa, nameSi: "Slovenski etnografski muzej, Zbirka starih fotografij F0000838 — ženska vsakdanja kmečka noša iz Gribelj (ok. 1920)",
    nameEn: "Slovene Ethnographic Museum, Collection of Old Photographs F0000838 — women's everyday farm dress from Griblje (c. 1920)",
    type: "fotografija", license: "© Slovenski etnografski muzej",
    url: "https://www.etno-muzej.si/sl/digitalne-zbirke/zbirka-starih-fotografij/f0000838",
    noteSi: "Noša, kakršno so nosile v Gribljah in okolici za vsak dan, ob hladnejših dneh še na prehodu v 20. stoletje; v muzejskem zapisu piše, da jo je verjetno fotografiral Niko Županič.",
    noteEn: "The everyday dress worn in Griblje and its surroundings, even on colder days at the turn of the 20th century; the museum record notes it was probably photographed by Niko Županič." },
  { ex: targets.niko, nameSi: "Slovenski etnografski muzej, Zbirka starih fotografij F0000212 — enonadstropna hiša na pero, rojstna hiša dr. Nika Županiča",
    nameEn: "Slovene Ethnographic Museum, Collection of Old Photographs F0000212 — the single-storey house on the pen, birthplace of dr. Niko Županič",
    type: "fotografija", license: "© Slovenski etnografski muzej",
    url: "https://www.etno-muzej.si/sl/digitalne-zbirke/zbirka-starih-fotografij/f0000212",
    noteSi: "Muzejska fotografija rojstne hiše ustanovitelja slovenske etnologije, z lokacijo Griblje in ključnima besedama »Hiša« ter »Etnologi«.",
    noteEn: "A museum photograph of the birth house of the founder of Slovene ethnology, with the location Griblje and the keywords 'House' and 'Ethnologists'." },
  { ex: targets.niko, nameSi: "Slovenski etnografski muzej — Digitalne zbirke, lokacija Griblje (F0000183, F0000212, F0000838, F0001407)",
    nameEn: "Slovene Ethnographic Museum — Digital Collections, location Griblje (F0000183, F0000212, F0000838, F0001407)",
    type: "zbirka", license: "© Slovenski etnografski muzej",
    url: "https://www.etno-muzej.si/sl/digitalne-zbirke/lokacije/griblje",
    noteSi: "SEM hrani štiri stare fotografije z lokacijo Griblje: dve vaški hiši, rojstno hišo dr. Nika Županiča in žensko vsakdanjo kmečko nošo.",
    noteEn: "The SEM holds four old photographs with the location Griblje: two village houses, the birth house of dr. Niko Županič and a women's everyday farm dress." },
  { ex: targets.niko, nameSi: "Slovenski etnografski muzej: »Dr. Niko Zupanič — kozmopolit iz Griblje«, spominska razstava ob 140-letnici rojstva; Etnolog 27 (2017)",
    nameEn: "Slovene Ethnographic Museum: 'Dr. Niko Zupanič — a cosmopolitan from Griblje', memorial exhibition on the 140th anniversary of his birth; Etnolog 27 (2017)",
    type: "razstava", license: "© Slovenski etnografski muzej",
    url: "https://www.etno-muzej.si/en/razstave/niko-zupanic-cosmopolitan-from-griblje",
    noteSi: "SEM je ustanovitelju slovenske etnologije, rojenemu v Gribljah, posvetil spominsko razstavo ob 140-letnici rojstva; spremljajoča objava je v reviji Etnolog 27 (2017).",
    noteEn: "The SEM dedicated a memorial exhibition to the founder of Slovene ethnology, born in Griblje, on the 140th anniversary of his birth; the accompanying article appeared in Etnolog 27 (2017)." },
];

const stories = [
  { ex: targets.katarina, si: "Revija Etnolog 10/11 (1937/1939) je njen Šopek tiskala na straneh 114–146; polno besedilo danes hrani Slovenski etnografski muzej, zapis pa govori o »narodnem blagu, zbranem v letih 1894.–1895. po nagovoru sina«.",
    en: "The journal Etnolog 10/11 (1937/1939) printed her Bouquet on pages 114–146; the full text is preserved by the Slovene Ethnographic Museum, and the record speaks of folk material collected in 1894–1895 at her son's urging." },
  { ex: targets.nosa, si: "Slovenski etnografski muzej hrani fotografijo gribeljske vsakdanje kmečke noše (F0000838), kakršno so v vasi nosile za vsak dan še na prehodu v 20. stoletje — v zapisu piše, da jo je verjetno fotografiral Niko Županič.",
    en: "The Slovene Ethnographic Museum holds a photograph of the everyday farm dress from Griblje (F0000838), worn daily in the village until the turn of the 20th century — the record notes it was probably photographed by Niko Županič." },
  { ex: targets.niko, si: "Slovenski etnografski muzej mu je posvetil spominsko razstavo »Dr. Niko Zupanič, kozmopolit iz Griblje«; v digitalnih zbirkah hrani tudi fotografijo rojstne hiše na pero (F0000212) ter gribeljsko nošo (F0000838), ki jo je po zapisu verjetno fotografiral sam.",
    en: "The Slovene Ethnographic Museum dedicated a memorial exhibition 'Dr. Niko Zupanič, a cosmopolitan from Griblje' to him; its digital collections also hold a photograph of his birth house on the pen (F0000212) and a Griblje dress (F0000838) that, the record notes, he probably took himself." },
  { ex: targets.uskoki, si: "Katarina Zupanič v uvodu Šopka citira listino z leta 1524, ki za Griblje zapiše, da po turškem napadu tistega leta ni ostal niti en plug; graščaki so zato vabili begunce iz Bosne in Hrvaške, da vas znova naselijo.",
    en: "In the introduction to her Bouquet, Katarina Zupanič quotes a document of 1524 stating that after that year's Turkish raid not a single plough was left in Griblje; the manor lords therefore invited refugees from Bosnia and Croatia to resettle the village." },
];

(async () => {
  for (const s of sources) {
    const so = await maxOrder(s.ex);
    await db.source.create({ data: {
      exhibitId: s.ex, nameSi: s.nameSi, nameEn: s.nameEn, sourceType: s.type,
      license: s.license, url: s.url, noteSi: s.noteSi, noteEn: s.noteEn, sortOrder: so + 1,
    }});
    console.log('+source', s.type, s.url.slice(0, 70));
  }
  for (const st of stories) {
    const e = await db.exhibit.findUnique({ where: { id: st.ex }, select: { storySi: true, storyEn: true } });
    await db.exhibit.update({ where: { id: st.ex }, data: {
      storySi: (e.storySi ?? '').trimEnd() + '\n' + st.si,
      storyEn: (e.storyEn ?? '').trimEnd() + '\n' + st.en,
    }});
    console.log('+story', st.ex.slice(0, 8));
  }
  const c = await db.source.count();
  console.log('TOTAL SOURCES:', c);
  await db.$disconnect();
})();
