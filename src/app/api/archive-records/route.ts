import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  isEditorialAuthorized,
  editorialForbidden,
} from "@/lib/editorial";

export const dynamic = "force-dynamic";

/**
 * GET /api/archive-records — strukturirani arhivski metapodatki (issue #27/E).
 *
 * Javni API: katalog arhivskih enot, ki jih muzej sledi (fond, serija,
 * signatura, datacija, digitalizacija, dostopnost, raziskovalni status).
 * researchStatus je POŠTEN: NOT_VIEWED pomeni »najdeno v katalogu, ne
 * prebrano« — glej issue #27/M pravilo.
 *
 * Notranja polja se nikoli ne vračajo (issue #27/I): researcherNotes.
 * Filtri: ?institution=, ?research-status=, ?signature=
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const institution = params.get("institution");
  const researchStatus = params.get("research-status");
  const signature = params.get("signature");

  try {
    const records = await db.archiveRecord.findMany({
      where: {
        ...(institution ? { institution: { contains: institution } } : {}),
        ...(researchStatus ? { researchStatus } : {}),
        ...(signature ? { signature: { contains: signature } } : {}),
      },
      orderBy: [{ institution: "asc" }, { signature: "asc" }],
      select: {
        id: true,
        institution: true,
        repository: true,
        fonds: true,
        series: true,
        unit: true,
        signature: true,
        identifier: true,
        dateFrom: true,
        dateTo: true,
        digitized: true,
        accessLevel: true,
        repositoryUrl: true,
        physicalLocation: true,
        pageRef: true,
        researchStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        count: records.length,
        records,
        note: "researchStatus NOT_VIEWED = enota najdena v katalogu, še ne prebrana (pravilo #27/M: take enote ne podpirajo DOCUMENTED trditev).",
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("API /api/archive-records GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju arhivskih zapisov" }, { status: 500 });
  }
}

const upsertSchema = z
  .object({
    institution: z.string().min(2).max(300),
    repository: z.string().max(300).optional(),
    fonds: z.string().min(2).max(500),
    series: z.string().max(500).optional(),
    unit: z.string().max(500).optional(),
    signature: z.string().min(2).max(300),
    identifier: z.string().max(200).optional(),
    dateFrom: z.string().max(100).optional(),
    dateTo: z.string().max(100).optional(),
    digitized: z.boolean().optional(),
    accessLevel: z.enum(["PUBLIC", "READING_ROOM", "RESTRICTED"]).optional(),
    repositoryUrl: z.string().max(1000).optional(),
    physicalLocation: z.string().max(500).optional(),
    pageRef: z.string().max(300).optional(),
    researchStatus: z.enum(["NOT_VIEWED", "VIEWED_PARTIALLY", "VIEWED", "TRANSCRIBED"]).optional(),
    researcherNotes: z.string().max(5000).optional(),
  })
  .strict();

/**
 * POST /api/archive-records — vnos/posodobitev arhivskega zapisa
 * (uredniško, zahteva žeton). Upsert po (institution, signature).
 * ZBelanš raziskovalne opombe so INTERNO (nikoli v javnem API-ju).
 */
export async function POST(request: Request) {
  if (!isEditorialAuthorized(request)) return editorialForbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Neveljavni podatki" },
      { status: 400 }
    );
  }

  try {
    const { institution, signature, ...data } = parsed.data;
    const record = await db.archiveRecord.upsert({
      where: { institution_signature: { institution, signature } },
      create: { institution, signature, ...data },
      update: data,
    });
    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    console.error("API /api/archive-records POST error:", error);
    return NextResponse.json({ error: "Napaka pri shranjevanju arhivskega zapisa" }, { status: 500 });
  }
}
