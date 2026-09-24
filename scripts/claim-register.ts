/**
 * Prijava raziskovalnih dejstev 47. vala (issue #30) — RESEARCH → MUSEUM.
 *
 * Idempotenten uvoz: skripta se sme pognati večkrat (ponovitev NE podvoji
 * vnosov). Prijavi:
 *   1. vir Matricula Podzemelj na zapisu sveti-vid (če še ni),
 *   2. arhivski zapisi N83 PUA (VIEWED_PARTIALLY) + N83 PS (NOT_VIEWED)
 *      v register ArchiveRecord (#27/E+M),
 *   3. dopolni raziskovalno opombo šolskega lista SI_ZAL_ČRN/0001/001/00012
 *      (izvid preizkusa dostopa v 47. valu: VAČ zahteva registrirano izkaznico),
 *   4. PRVE trditve (Claim) zbirke — vse PUBLISHED, z evidence gate
 *      (src/lib/claims.ts): DOCUMENTED vedno nosi vir + stran/enoto.
 *
 * Pravilo cevovoda (src/lib/pipeline.ts, issue #27/L): spletna/kataloška
 * sled sama po sebi ni dokaz — trditve nosijo le branja strani, negotova
 * branja ostajajo UNVERIFIED ali v kuratorski vrsti (entities.ts).
 *
 * Zagon: export DATABASE_URL/DIRECT_URL po .env, nato `bun scripts/claim-register.ts`
 */

import { db } from "../src/lib/db";

const VALED = "47. val (issue #30, 2026-09-24)";

type ClaimSeed = {
  slug: string;
  /** key vira v museum-content.ts (za vezavo sourceId) — ali null. */
  sourceNameContains: string | null;
  statement: string;
  evidenceStatus: "DOCUMENTED" | "CORROBORATED" | "UNVERIFIED";
  confidence: "HIGH" | "MEDIUM" | "LOW" | null;
  pageRef: string | null;
  researcherNote: string | null;
};

const CLAIMS: ClaimSeed[] = [
  {
    slug: "griblje-vas",
    sourceNameContains: "abecedni seznam lastnikov",
    statement:
      "Abecedni seznam lastnikov zemljišč franciscejskega katastra k.o. Griblje (N083PUA, »Alphabetisches Verzeichniß der Gemeinde GRÜBLE«, 1825) je digitaliziran (49 strani, docid 41782) in javno dostopen prek VAČ; tabela nosi hišno številko, ime, stan in prebivališče lastnika.",
    evidenceStatus: "DOCUMENTED",
    confidence: "HIGH",
    pageRef: "fol. 2 (naslovna stran), fol. 3–6 in 20 (47. val)",
    researcherNote:
      "Prenos vseh 49 strani prek /vac/util/pdfPageImage (uodid=373417, docid=41782). Preliminarno branje Kurrenta; specializiran prepis vseh strani še čaka (glej kuratorsko vrsto entities.ts P2-E8/P2-E9/P3-E3/P3-E4).",
  },
  {
    slug: "griblje-vas",
    sourceNameContains: "abecedni seznam lastnikov",
    statement:
      "Po abecednem seznamu lastnikov zemljišč (N083PUA, 1825) je bila v Gribljih gospodovala veja rodbine Brinc: hiša št. 23 (Brinc Matija), 24 (Brinc Mihael), 26 (Brinc Janez), 28 (Brinc Miha) in 65 (Brinc Marko) — skladno z zaselkom Brinsko selo.",
    evidenceStatus: "CORROBORATED",
    confidence: "MEDIUM",
    pageRef: "fol. 3–6",
    researcherNote:
      "Kurrent branje imen in hišnih številk stabilno čez več pregledov; priimek »Brincz/Princz« bere kot Brinc (P/B v Kurrentu) — potrditev skozi naselbinsko strukturo (Brinsko selo) in pogostost priimka v vasi. CORROBORATED, ne DOCUMENTED: potrditev s posebnim prepisom fol. 3–6 še ni opravljena.",
  },
  {
    slug: "griblje-vas",
    sourceNameContains: "abecedni seznam lastnikov",
    statement:
      "Abecedni seznam lastnikov (N083PUA, 1825) vpisuje tudi institucionalnega lastnika »Commenda« z obsežnim sklopom parcel — vpis čaka potrditev, katera institucija (Malteška komenda) je šlo.",
    evidenceStatus: "UNVERIFIED",
    confidence: "LOW",
    pageRef: "fol. 6",
    researcherNote:
      "Vidno branje »Commenda« stabilno; identiteta ustanove pa ni potrjena. Malteški (vitezovski) red je v Beli krajini imel posesti do konca 18. stoletja — vez čaka zgodovinsko kontrolo (kuratorska vrsta P2-E9).",
  },
  {
    slug: "sveti-vid",
    sourceNameContains: "Matricula Online",
    statement:
      "Cerkev sv. Vida v Gribljih je po registru matrik Nadškofijskega arhiva Ljubljana 3. podružnica župnije Podzemelj (sv. Martin) — izrecno: »3. Sv. Vid, Griblje« — in vas Griblje je del zgodovinskega matičnega območja župnije.",
    evidenceStatus: "DOCUMENTED",
    confidence: "HIGH",
    pageRef: "katalog župnije Podzemelj na Matriculi (posnetek september 2026)",
    researcherNote:
      "Primarni katalog fonda NŠAL 268 bandomov; potruje župnijsko vez, ki jo zapis doslej citiral po sekundarnih virih (Wikipedia, Volčjak 2019).",
  },
  {
    slug: "sveti-vid",
    sourceNameContains: "Matricula Online",
    statement:
      "Matrike župnije Podzemelj so javno dostopne online (Matricula Online): 22 digitaliziranih bandomov, leta 1669–1947 — krstne 1675–1919 (volumeni 01723–01731, 04104, 04105), mrliške 1725–1924 (01732–01735, 04106, 04894), poročne 1669–1922 (04795, 01736–01738, 04455).",
    evidenceStatus: "DOCUMENTED",
    confidence: "HIGH",
    pageRef: "popis matrik župnije Podzemelj (Matricula)",
    researcherNote:
      "Matično gradivo Gribelj je torej branljivo brez obiska čitalnice — za vse raziskave rodovnikov, hiš in gostilne pred 1898 ključen kanal.",
  },
  {
    slug: "sveti-vid",
    sourceNameContains: "Matricula Online",
    statement:
      "Krstna knjiga župnije Podzemelj 1886–1919 (vol. 04105) vpisuje rojstva v Gribljih s hišnimi številkami — na skenu 20 (leto 1887) hiša št. 61: krščena Katarina, na skenu 100 (leto 1897, str. 49) hiša št. 61: krščen Anton; oče v obeh vpisih Miha P.— (priimek v Kurrentu negotovo: P—žar/P—žt).",
    evidenceStatus: "DOCUMENTED",
    confidence: "MEDIUM",
    pageRef: "vol. 04105, sken 20 (1887) in sken 100 = str. 49 (1897)",
    researcherNote:
      "Naselbina »Griblje« + hišna številka + ime krščenca so stabilna branja; imena staršev in natančni dnevi čakajo specializiran prepis (rokov Kurrenta). Preizkus kanala: viewer + skena URL prek performance API, brez prijave.",
  },
];

async function main() {
  console.log("📚 Prijava dejstev 47. vala (issue #30) — RESEARCH → MUSEUM\n");

  /* 1) Vir Matricula na sveti-vid (idempotentno po imenu vira). */
  const svetiVid = await db.exhibit.findUnique({
    where: { slug: "sveti-vid" },
    select: { id: true, slug: true },
  });
  if (!svetiVid) throw new Error("Zapis sveti-vid ne obstaja — zberi bazo (bun run db:seed).");

  const matName = CLAIMS.find((c) => c.sourceNameContains === "Matricula Online")!;
  const existingMat = await db.source.findFirst({
    where: { exhibitId: svetiVid.id, nameSi: { contains: "Matricula Online" } },
    select: { id: true },
  });
  if (!existingMat) {
    await db.source.create({
      data: {
        exhibitId: svetiVid.id,
        nameSi:
          "Matricula Online: župnija Podzemelj (Nadškofijski arhiv Ljubljana) — matrike 1669–1947, Griblje izrecno kot 3. podružnica in del zgodovinskega matičnega območja",
        nameEn:
          "Matricula Online: the Parish of Podzemelj (Archdiocesan Archives of Ljubljana) — registers 1669–1947, Griblje explicitly listed as the third filial church and part of the historical register area",
        sourceType: "arhiv",
        license: "arhivsko gradivo (Matricula Online; © Nadškofijski arhiv Ljubljana)",
        url: "https://data.matricula-online.eu/en/slovenia/ljubljana/podzemelj/",
        noteSi:
          "Primarna potrditev župnijske veze (posnetek kataloga, september 2026): podružnice izrecno številčene — 3. Sv. Vid, Griblje; »Historično matično območje« izrecno vključuje Griblje. 22 digitaliziranih matrik 1669–1947. Krstna knjiga 1886–1919 (vol. 04105) vpisuje rojstva »v Gribljih« s hišnimi številkami (skena 20 in 100 prebrana v 47. valu).",
        noteEn:
          "Primary confirmation of the parish bond (catalogue screenshot, September 2026): filial churches explicitly numbered — 3. St. Vitus, Griblje; the 'historical register area' explicitly includes Griblje. 22 digitised registers 1669–1947. The baptism register 1886–1919 (vol. 04105) records births 'at Griblje' with house numbers (scans 20 and 100 read in val 47).",
        creator: "Nadškofijski arhiv Ljubljana / Matricula Online",
        copyrightHolder: "Nadškofijski arhiv Ljubljana",
        permissionToPublish: "GRANTED",
        permissionEvidence: "javno dostopni katalog + viewer (Matricula Online), dostop 2026-09-24",
        attribution: "Matrike, Nadškofijski arhiv Ljubljana, prek Matricula Online",
      },
    });
    console.log("  + vir: Matricula Podzemelj (nov)");
  } else {
    console.log("  = vir: Matricula Podzemelj (že obstaja)");
  }

  /* 2) Arhivski zapisi N83 PUA + PS (idempotentno po unique institucija+signatura). */
  const ars = "Arhiv Republike Slovenije";
  const fonds = "SI AS 176 — Franciscejski kataster za Kranjsko (1823–1869)";
  const series = "Katastrska občina N83 Griblje — spisovne serije";

  const puaExisting = await db.archiveRecord.findUnique({
    where: { institution_signature: { institution: ars, signature: "SI AS 176/N/N83/s/PUA" } },
    select: { id: true, researchStatus: true },
  });
  if (!puaExisting) {
    await db.archiveRecord.create({
      data: {
        institution: ars,
        fonds,
        series,
        unit: "N083PUA — Abecedni seznam lastnikov zemljišč (»Alphabetisches Verzeichniß der Gemeinde GRÜBLE«)",
        signature: "SI AS 176/N/N83/s/PUA",
        identifier: "VAČ id 373417 (docid 41782)",
        dateFrom: "1825",
        dateTo: "1825",
        digitized: true,
        accessLevel: "PUBLIC",
        repositoryUrl: "https://vac.sjas.gov.si/vac/search/details?id=373417",
        pageRef: "fol. 3–6, 20 preliminarno prebrani (47. val)",
        researchStatus: "VIEWED_PARTIALLY",
        researcherNotes: `Vseh 49 strani prenešenih prek /vac/util/pdfPageImage. Preliminarno branje Kurrenta: Brinc h. 23 (Matija), 24 (Mihael), 26 (Janez), 28 (Miha), 65 (Marko); Commenda fol. 6; opomba Apfaltrer? fol. 3. ${VALED}.`,
      },
    });
    console.log("  + ArchiveRecord: PUA (VIEWED_PARTIALLY)");
  } else {
    console.log("  = ArchiveRecord: PUA (že obstaja)");
  }

  const psExisting = await db.archiveRecord.findUnique({
    where: { institution_signature: { institution: ars, signature: "SI AS 176/N/N83/s/PS" } },
    select: { id: true },
  });
  if (!psExisting) {
    await db.archiveRecord.create({
      data: {
        institution: ars,
        fonds,
        series,
        unit: "N083PS — Seznam zemljiških parcel k.o. Griblje",
        signature: "SI AS 176/N/N83/s/PS",
        identifier: "VAČ id 373415 (docid 41780)",
        dateFrom: "1825",
        dateTo: "1825",
        digitized: true,
        accessLevel: "PUBLIC",
        repositoryUrl: "https://vac.sjas.gov.si/vac/search/details?id=373415",
        researchStatus: "NOT_VIEWED",
        researcherNotes: `143 digitaliziranih strani; branje NI še začeto (najdeno ≠ prebrano). Prioriteta: parcele okoli jedra vasi + povezava na PT (stavbne parcele). ${VALED}.`,
      },
    });
    console.log("  + ArchiveRecord: PS (NOT_VIEWED, digitaliziran)");
  } else {
    console.log("  = ArchiveRecord: PS (že obstaja)");
  }

  /* 3) Opomba šolskemu listu: izvid preizkusa dostopa 47. vala. */
  const schoolUnit = await db.archiveRecord.findUnique({
    where: { institution_signature: { institution: "ZAL — Enota za Dolenjsko in Belo krajino Novo mesto", signature: "SI_ZAL_ČRN/0001/001/00012" } },
    select: { id: true, researcherNotes: true },
  });
  const probeNote =
    "47. val (issue #30): preizkus dostopa — VAČ detail page (details?id=4118864) potrjuje »Kopije: digitalizirano«, NE izpostavlja pa IIIF datotek (brez uodid/docid, za razliko od ARS enot); pregledovalnik kopije zahteva registrirano uporabniško izkaznico VAČ ali obisk čitalnice ZAL NM. Enota ostaja P1★ za content extraction ob dostopu.";
  if (schoolUnit) {
    const already = (schoolUnit.researcherNotes ?? "").includes("preizkus dostopa");
    if (!already) {
      await db.archiveRecord.update({
        where: { id: schoolUnit.id },
        data: { researcherNotes: [schoolUnit.researcherNotes, probeNote].filter(Boolean).join("\n\n") },
      });
      console.log("  ~ ArchiveRecord šolskega lista: opomba o preizkusu dostopa dodana");
    } else {
      console.log("  = ArchiveRecord šolskega lista: opomba že prisotna");
    }
  }

  /* 4) Trditve (Claim) — idempotentno po (exhibitId, statement). */
  let created = 0;
  let skipped = 0;
  for (const c of CLAIMS) {
    const exhibit = await db.exhibit.findUnique({ where: { slug: c.slug }, select: { id: true } });
    if (!exhibit) throw new Error(`Zapis ${c.slug} ne obstaja.`);

    const dup = await db.claim.findFirst({
      where: { exhibitId: exhibit.id, statement: c.statement },
      select: { id: true },
    });
    if (dup) {
      skipped++;
      continue;
    }

    let sourceId: string | null = null;
    if (c.sourceNameContains) {
      const src = await db.source.findFirst({
        where: { exhibitId: exhibit.id, nameSi: { contains: c.sourceNameContains } },
        select: { id: true },
      });
      if (!src) throw new Error(`Vir »${c.sourceNameContains}« na ${c.slug} ne obstaja.`);
      sourceId = src.id;
    }

    // Evidence gate še pred vpisom — DOCUMENTED brez vira+strani = napaka skripte.
    const { checkEvidenceGate } = await import("../src/lib/claims");
    const gate = checkEvidenceGate({
      evidenceStatus: c.evidenceStatus,
      status: "DRAFT",
      sourceId,
      archiveRecordId: null,
      pageRef: c.pageRef,
    });
    if (!gate.ok) throw new Error(`Evidence gate zavrnjen za trditev: ${gate.reason}`);

    await db.claim.create({
      data: {
        exhibitId: exhibit.id,
        statement: c.statement,
        lang: "sl",
        evidenceStatus: c.evidenceStatus,
        confidence: c.confidence,
        sourceId,
        pageRef: c.pageRef,
        researcherNote: c.researcherNote,
        status: "PUBLISHED",
        createdBy: VALED,
        updatedBy: VALED,
      },
    });
    created++;
    console.log(`  + trditev [${c.evidenceStatus}] → ${c.slug}: ${c.statement.slice(0, 60)}…`);
  }

  console.log(`\nZaključek: ${created} novih trditev, ${skroppedSafe(skipped)}.`);
}

function skroppedSafe(n: number) {
  return `${n} že obstoječih (preskočenih)`;
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Napaka pri prijavi dejstev:", e);
    process.exit(1);
  });
