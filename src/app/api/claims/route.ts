import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  isEditorialAuthorized,
  editorialForbidden,
} from "@/lib/editorial";
import {
  checkEvidenceGate,
  publicClaimDTO,
} from "@/lib/claims";

export const dynamic = "force-dynamic";

/**
 * GET /api/claims?slug=<zapis> — OBJAVLJENE trditve zapisa s citacijami.
 *
 * Javni API (brez žetona): servira samo status PUBLISHED. Notranja polja
 * (researcherNote, createdBy/updatedBy, workflow status) se nikoli ne
 * vračajo (issue #27/I). Evidence status je viden — obiskovalec vidi,
 * kaj je dokumentirano in kaj izročilo.
 */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Podati morate ?slug=<zapis>" }, { status: 400 });
  }

  try {
    const exhibit = await db.exhibit.findUnique({
      where: { slug },
      select: { id: true, slug: true, museumNo: true },
    });
    if (!exhibit) {
      return NextResponse.json({ error: "Neznan zapis" }, { status: 404 });
    }

    const claims = await db.claim.findMany({
      where: { exhibitId: exhibit.id, status: "PUBLISHED" },
      orderBy: [{ evidenceStatus: "asc" }, { createdAt: "desc" }],
      include: {
        source: {
          select: { nameSi: true, nameEn: true, license: true, url: true },
        },
        archiveRecord: {
          select: {
            institution: true,
            fonds: true,
            signature: true,
            repositoryUrl: true,
            researchStatus: true,
          },
        },
      },
    });

    // Arhivske enote, ki še NISO prebrane (NOT_VIEWED), se v javni
    // prikaz vključijo z odkritim statusom — trditve na take enote
    // ne morejo biti DOCUMENTED (gate to zagotavlja pri vpisu).
    return NextResponse.json(
      {
        exhibit: { slug: exhibit.slug, museumNo: exhibit.museumNo },
        count: claims.length,
        claims: claims.map((c) =>
          publicClaimDTO({
            ...c,
            source: c.source ?? null,
            archiveRecord: c.archiveRecord ?? null,
          })
        ),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/claims GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju trditev" }, { status: 500 });
  }
}

const createClaimSchema = z
  .object({
    slug: z.string().min(1).max(200),
    statement: z.string().min(5).max(2000),
    lang: z.enum(["sl", "en", "hr", "de", "it"]).default("sl"),
    evidenceStatus: z.enum([
      "DOCUMENTED",
      "CORROBORATED",
      "TESTIMONY",
      "TRADITION",
      "UNVERIFIED",
      "TO_COLLECT",
    ]),
    confidence: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
    sourceId: z.string().optional(),
    archiveRecordId: z.string().optional(),
    pageRef: z.string().max(300).optional(),
    researcherNote: z.string().max(3000).optional(),
    createdBy: z.string().min(1).max(200),
  })
  .strict();

/**
 * POST /api/claims — nova trditev (uredniško, zahteva žeton).
 *
 * Evidence gate: DOCUMENTED brez (vir|arhivska enota) + pageRef je
 * zavrnjen (422) — trditev brez dokaza ne more obstajati kot dokumentirana.
 * Status ob vpisu: DRAFT (objava gre skozi /api/claims/transition).
 */
export async function POST(request: Request) {
  if (!isEditorialAuthorized(request)) return editorialForbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
  }

  const parsed = createClaimSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Neveljavni podatki" },
      { status: 400 }
    );
  }

  const d = parsed.data;

  const gate = checkEvidenceGate({
    evidenceStatus: d.evidenceStatus,
    status: "DRAFT",
    sourceId: d.sourceId ?? null,
    archiveRecordId: d.archiveRecordId ?? null,
    pageRef: d.pageRef ?? null,
  });
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason }, { status: 422 });
  }

  try {
    const exhibit = await db.exhibit.findUnique({
      where: { slug: d.slug },
      select: { id: true },
    });
    if (!exhibit) return NextResponse.json({ error: "Neznan zapis" }, { status: 404 });

    if (d.sourceId) {
      const source = await db.source.findUnique({ where: { id: d.sourceId }, select: { id: true } });
      if (!source) return NextResponse.json({ error: "Neznan vir (sourceId)" }, { status: 404 });
    }
    if (d.archiveRecordId) {
      const rec = await db.archiveRecord.findUnique({
        where: { id: d.archiveRecordId },
        select: { id: true },
      });
      if (!rec) return NextResponse.json({ error: "Neznan arhivski zapis (archiveRecordId)" }, { status: 404 });
    }

    const claim = await db.claim.create({
      data: {
        exhibitId: exhibit.id,
        statement: d.statement.trim(),
        lang: d.lang,
        evidenceStatus: d.evidenceStatus,
        confidence: d.confidence ?? null,
        sourceId: d.sourceId ?? null,
        archiveRecordId: d.archiveRecordId ?? null,
        pageRef: d.pageRef?.trim() || null,
        researcherNote: d.researcherNote?.trim() || null,
        status: "DRAFT",
        createdBy: d.createdBy,
        updatedBy: d.createdBy,
      },
    });

    return NextResponse.json(
      { ok: true, claim: publicClaimDTO({ ...claim }), gate: gate.reason },
      { status: 201 }
    );
  } catch (error) {
    console.error("API /api/claims POST error:", error);
    return NextResponse.json({ error: "Napaka pri shranjevanju trditve" }, { status: 500 });
  }
}
