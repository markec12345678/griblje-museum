/**
 * Bazični bazični preverbi upravljanja na živi bazi (issue #27/S: Database,
 * Provenance, Assets). Izvajajo se na DATABASE_URL (Neon PostgreSQL) —
 * ustvarjajo SAMO označene začasne vnose (TEST-GOV-*) in jih v afterAll
 * obvezno pobrišejo. Brez puščanja: tudi pri napaki afterAll pomete.
 */

import { afterAll, describe, expect, test } from "bun:test";
import { Prisma } from "@prisma/client";
import { canAiPresentAsFact, publicClaimDTO } from "../src/lib/claims";
import { sha256Of } from "../src/lib/fixity";

/* Peskovniška varovalka: če je DATABASE_URL podedovana iz okolja kot file:
 * (lokalni SQLite vzorec), testi uporabijo DIRECT_URL (Neon direktni
 * endpoint — brez PgBouncerja, zato tudi primernejši za transakcije).
 * V CI/produkciji je DATABASE_URL nastavljen pravilno in je varovalka
 * brez učinka. Brez postgres URL-a (npr. quality job brez service) se
 * preverbi eleganto preskočijo — napaka je razvidna, ne tiha. */
if (
  process.env.DATABASE_URL &&
  process.env.DATABASE_URL.startsWith("file:") &&
  process.env.DIRECT_URL
) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}
const HAS_POSTGRES = (process.env.DATABASE_URL ?? "").startsWith("postgres");

/* Dinamični uvoz: db.ts bere DATABASE_URL ob inicializaciji — varovalka
 * zgoraj mora teči PRVÁ. Brez baze modula ne nalagamo (db.ts meče jasno
 * napako ob manjkajočem URL — to NE smemo pokvariti testov, ki baze ne
 * potrebujejo). Testi se v tem primeru preskočijo (dbTest), zato db
 * tudi dejansko ne bo uporabljen. */
type DbModule = typeof import("../src/lib/db");
const db: DbModule["db"] = HAS_POSTGRES
  ? (await import("../src/lib/db")).db
  : (undefined as unknown as DbModule["db"]);

/** Lokalni preskok celotne datoteke, če PostgreSQL ni dosegljiv. */
const dbTest = HAS_POSTGRES ? test : test.skip;

const RUN = `TEST-GOV-${Date.now()}`;
const tempExhibitIds: string[] = [];

if (HAS_POSTGRES) afterAll(async () => {
  // Vrstni red zaradi FK: trditve → viri → verzije → asseti → zapisi → arhivske enote
  await db.claim.deleteMany({ where: { OR: [{ statement: { startsWith: RUN } }, { exhibit: { slug: { startsWith: RUN } } }] } });
  await db.source.deleteMany({ where: { exhibit: { slug: { startsWith: RUN } } } });
  await db.exhibitVersion.deleteMany({ where: { exhibit: { slug: { startsWith: RUN } } } });
  await db.digitalAsset.deleteMany({ where: { OR: [{ storageKey: { startsWith: RUN } }, { exhibit: { slug: { startsWith: RUN } } }] } });
  await db.exhibit.deleteMany({ where: { slug: { startsWith: RUN } } });
  await db.archiveRecord.deleteMany({ where: { institution: { startsWith: "TEST-GOV" } } });
});

/** Minimalen veljaven zapis za testne namene. */
async function tempExhibit(suffix: string) {
  const e = await db.exhibit.create({
    data: {
      slug: `${RUN}-${suffix}`,
      category: "kraj",
      titleSi: `Testni zapis ${suffix}`,
      titleEn: `Test exhibit ${suffix}`,
      periodSi: "testna doba",
      periodEn: "test period",
      summarySi: "Začasni testni zapis (pobrisan v afterAll).",
      summaryEn: "Temporary test exhibit (removed in afterAll).",
      storySi: "Test.",
      storyEn: "Test.",
      evidenceStatus: "UNVERIFIED",
    },
  });
  tempExhibitIds.push(e.id);
  return e;
}

/* --- Database: omejitve, FK, transakcije, sočasnost (#27/S) ---------------- */

describe("database-governance (#27/S) — omejitve baze", () => {
  dbTest("kršitev tuje ključa (asset na neobstoječ zapis) je zavrnjena (P2003)", async () => {
    // PrismaPromise ni nativen Promise — expect().rejects ne velja; uporabimo
    // eksplicitno usodo: success → null, napaka → napaka.
    const err = await db.digitalAsset
      .create({
        data: {
          storageKey: `${RUN}-fk.jpg`,
          mime: "image/jpeg",
          originalFilename: "fk.jpg",
          bytes: 1,
          sha256: "fk",
          copyrightHolder: "Test",
          license: "CC0",
          kind: "fotografija",
          exhibitId: "neobstojeci-id-zapis",
        },
      })
      .then(() => null, (e) => e);
    expect(err).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
    expect((err as Prisma.PrismaClientKnownRequestError).code).toBe("P2003");
  });

  dbTest("transakcijski rollback: napaka sredi transakcije ne pušča sledi", async () => {
    const before = await db.archiveRecord.count({ where: { institution: { startsWith: "TEST-GOV" } } });
    await db
      .$transaction(async (tx) => {
        await tx.archiveRecord.create({
          data: {
            institution: `${RUN}-rollback`,
            fonds: "Test fond",
            signature: `${RUN}-R1`,
            researchStatus: "NOT_VIEWED",
          },
        });
        throw new Error("namerna napaka — rollback");
      })
      .catch(() => undefined);
    const after = await db.archiveRecord.count({ where: { institution: { startsWith: "TEST-GOV" } } });
    expect(after).toBe(before);
  });

  dbTest("sočasna pisanja: enolična omejitev (institucija+signatura) zavrne duplikat (P2002)", async () => {
    const data = {
      institution: `${RUN}-race`,
      fonds: "Test fond",
      signature: `${RUN}-S1`,
    };
    /* Neonske prehodne napake (ssl/omrežje) ne smejo biti razložek za nestabilen
     * preverb — vsaj en poskus mora pokazati omejitev: točno 1 uspešen vnos.
     * Podvojitev je nemogoča (enolična omejitev je zavez baze, ne aplikacije). */
    let lastResults: PromiseSettledResult<unknown>[] = [];
    let ok = false;
    for (let attempt = 0; attempt < 3 && !ok; attempt++) {
      lastResults = await Promise.allSettled([
        db.archiveRecord.create({ data: { ...data, signature: `${RUN}-S${attempt}` } }),
        db.archiveRecord.create({ data: { ...data, signature: `${RUN}-S${attempt}` } }),
      ]);
      const fulfilled = lastResults.filter((r) => r.status === "fulfilled");
      const rejected = lastResults.filter((r) => r.status === "rejected");
      const hasUnique = rejected.some(
        (r) =>
          (r as PromiseRejectedResult).reason instanceof Prisma.PrismaClientKnownRequestError &&
          ((r as PromiseRejectedResult).reason as Prisma.PrismaClientKnownRequestError).code === "P2002",
      );
      ok = fulfilled.length === 1 && rejected.length === 1 && hasUnique;
    }
    expect(ok).toBe(true);
  });
});

/* --- Provenance: brisanje vira, neobjavljene trditve (#27/S) ---------------- */

describe("database-governance (#27/S) — provenienca", () => {
  dbTest("brisanje vira: trditev ostane, vezava se počisti (SetNull) → AI ne sme kot dejstvo", async () => {
    const exhibit = await tempExhibit("setnull");
    const source = await db.source.create({
      data: {
        exhibitId: exhibit.id,
        nameSi: "Testni vir",
        nameEn: "Test source",
        sourceType: "arhiv",
        license: "PUBLIC",
        creator: "Test avtor",
      },
    });
    const claim = await db.claim.create({
      data: {
        exhibitId: exhibit.id,
        statement: `${RUN} trditev z virom`,
        evidenceStatus: "DOCUMENTED",
        status: "PUBLISHED",
        sourceId: source.id,
        pageRef: "str. 1",
      },
    });

    // Pred brisanjem: AI sme predstaviti kot dejstvo (veriga obstaja).
    const withSource = await db.claim.findUnique({
      where: { id: claim.id },
      include: { source: { select: { nameSi: true, nameEn: true, license: true, url: true } } },
    });
    expect(withSource?.sourceId).toBe(source.id);
    expect(
      canAiPresentAsFact({
        evidenceStatus: "DOCUMENTED",
        status: "PUBLISHED",
        sourceId: withSource!.sourceId,
        archiveRecordId: null,
        pageRef: withSource!.pageRef,
      }),
    ).toBe(true);
    expect(publicClaimDTO(withSource!).citation.kind).toBe("source");

    // Brisanje vira: onDelete: SetNull — trditev ne izgine, veriga pa se prekine.
    await db.source.delete({ where: { id: source.id } });
    const after = await db.claim.findUnique({ where: { id: claim.id } });
    expect(after).not.toBeNull();
    expect(after!.sourceId).toBeNull();
    expect(
      canAiPresentAsFact({
        evidenceStatus: after!.evidenceStatus as "DOCUMENTED",
        status: after!.status as "PUBLISHED",
        sourceId: after!.sourceId,
        archiveRecordId: after!.archiveRecordId,
        pageRef: after!.pageRef,
      }),
    ).toBe(false);
  });

  dbTest("neobjavljena trditev ni v javnem vzorcu poizvedbe (status PUBLISHED)", async () => {
    const exhibit = await tempExhibit("draft");
    await db.claim.create({
      data: {
        exhibitId: exhibit.id,
        statement: `${RUN} osnutek trditve`,
        evidenceStatus: "TO_COLLECT",
        status: "DRAFT",
      },
    });

    // Javni API servira IZKLJUČNO PUBLISHED (src/app/api/claims/route.ts).
    const publicView = await db.claim.findMany({
      where: { exhibitId: exhibit.id, status: "PUBLISHED" },
    });
    expect(publicView).toHaveLength(0);

    await db.claim.updateMany({
      where: { exhibitId: exhibit.id },
      data: { status: "PUBLISHED" },
    });
    const afterPublish = await db.claim.findMany({
      where: { exhibitId: exhibit.id, status: "PUBLISHED" },
    });
    expect(afterPublish).toHaveLength(1);
  });

  dbTest("notranja polja ne puščajo skozi javni DTO (#27/I)", () => {
    const dto = publicClaimDTO({
      id: "id-1",
      statement: "Trditev",
      lang: "sl",
      evidenceStatus: "TESTIMONY",
      status: "PUBLISHED",
      version: 1,
      pageRef: "str. 2",
      researcherNote: "INTERNA OPOMBA — NIKOLI JAVNO",
      createdBy: "raziskovalec-1",
      updatedBy: "urednik-1",
    });
    expect(JSON.stringify(dto)).not.toContain("INTERNA OPOMBA");
    expect(JSON.stringify(dto)).not.toContain("raziskovalec-1");
    expect(JSON.stringify(dto)).not.toContain("urednik-1");
    expect(Object.keys(dto)).not.toContain("researcherNote");
    expect(Object.keys(dto)).not.toContain("createdBy");
  });
});

/* --- Assets: checksum, derivacija, pravice, vidnost (#27/S) ----------------- */

describe("database-governance (#27/S) — asseti", () => {
  dbTest("derivacijska veriga + checksum vsebine (SHA-256)", async () => {
    const exhibit = await tempExhibit("asset");
    const content = Buffer.from(`vsebina-masterja-${RUN}`);
    const master = await db.digitalAsset.create({
      data: {
        storageKey: `${RUN}-master.bin`,
        mime: "application/octet-stream",
        originalFilename: "master.bin",
        bytes: content.length,
        sha256: sha256Of(content),
        copyrightHolder: "Test nosilec",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
        kind: "sken",
        accessLevel: "PUBLIC",
        exhibitId: exhibit.id,
      },
    });
    const derivative = await db.digitalAsset.create({
      data: {
        storageKey: `${RUN}-derivat.jpg`,
        mime: "image/jpeg",
        originalFilename: "derivat.jpg",
        bytes: 42,
        sha256: sha256Of(Buffer.from(`derivat-${RUN}`)),
        copyrightHolder: "Test nosilec",
        license: "CC BY 4.0",
        kind: "thumbnail",
        derivedFromId: master.id,
        exhibitId: exhibit.id,
      },
    });
    expect(derivative.derivedFromId).toBe(master.id);
    expect(sha256Of(content)).toMatch(/^[a-f0-9]{64}$/);

    // Izbrisi masterja → derivat ostane, vezava se počisti (SetNull).
    await db.digitalAsset.delete({ where: { id: master.id } });
    const orphan = await db.digitalAsset.findUnique({ where: { id: derivative.id } });
    expect(orphan).not.toBeNull();
    expect(orphan!.derivedFromId).toBeNull();
  });

  dbTest("javni vzorec poizvedbe servira izključno PUBLIC (#27/I)", async () => {
    const exhibit = await tempExhibit("access");
    const shared = {
      mime: "image/jpeg",
      originalFilename: "a.jpg",
      bytes: 1,
      sha256: "access-test",
      copyrightHolder: "Test",
      license: "CC0",
      kind: "fotografija" as const,
      exhibitId: exhibit.id,
    };
    await db.digitalAsset.create({
      data: { ...shared, storageKey: `${RUN}-A-public.jpg`, accessLevel: "PUBLIC" },
    });
    await db.digitalAsset.create({
      data: { ...shared, storageKey: `${RUN}-A-restricted.jpg`, accessLevel: "RESTRICTED" },
    });
    await db.digitalAsset.create({
      data: { ...shared, storageKey: `${RUN}-A-internal.jpg`, accessLevel: "INTERNAL" },
    });

    // Kot v src/app/api/assets/route.ts: samo PUBLIC. Strogo podpredmet
    // `-A-`, ker drugi testi istega RUN ustvarjajo svoje PUBLIC assete.
    const publicAssets = await db.digitalAsset.findMany({
      where: { accessLevel: "PUBLIC", storageKey: { startsWith: `${RUN}-A-` } },
    });
    expect(publicAssets).toHaveLength(1);
    expect(publicAssets[0].storageKey).toBe(`${RUN}-A-public.jpg`);
  });

  dbTest("pravice so izrecne: nosilec + licenca obvezna, privzeto UNKNOWN ni skrit", async () => {
    const exhibit = await tempExhibit("rights");
    const asset = await db.digitalAsset.create({
      data: {
        storageKey: `${RUN}-rights.jpg`,
        mime: "image/jpeg",
        originalFilename: "rights.jpg",
        bytes: 1,
        sha256: "rights",
        copyrightHolder: "Muzej Griblje",
        license: "CC BY-NC 4.0",
        kind: "fotografija",
        exhibitId: exhibit.id,
      },
    });
    expect(asset.copyrightHolder).toBe("Muzej Griblje");
    expect(asset.license).toBe("CC BY-NC 4.0");
    expect(asset.preservationStatus).toBe("ACTIVE");

    // Vir brez znanih pravic nosi izrecen UNKNOWN, ne tihe privzete (#27/F).
    const source = await db.source.create({
      data: {
        exhibitId: exhibit.id,
        nameSi: "Vir neznanih pravic",
        nameEn: "Unknown-rights source",
        sourceType: "fotografija",
        license: "UNKNOWN",
      },
    });
    expect(source.permissionToPublish).toBe("UNKNOWN");
    expect(source.commercialUse).toBe("UNKNOWN");
  });
});
