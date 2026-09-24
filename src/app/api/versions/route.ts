import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  isEditorialAuthorized,
  editorialForbidden,
  snapshotOfExhibit,
  snapshotOfSource,
  applyPatch,
  exhibitPatchSchema,
  sourcePatchSchema,
  snapshotDiff,
  sourceSnapshotDiff,
} from "@/lib/editorial";

export const dynamic = "force-dynamic";

/**
 * GET /api/versions — zgodovina verzij (uredniško, zahteva žeton).
 *   ?slug=<exhibit-slug>   — verzije zapisa
 *   ?sourceId=<id>         — verzije vira
 *
 * Interni API (issue #27/I) — nikoli javno dostopen.
 */
export async function GET(request: Request) {
  if (!isEditorialAuthorized(request)) return editorialForbidden();

  const params = new URL(request.url).searchParams;
  const slug = params.get("slug");
  const sourceId = params.get("sourceId");

  try {
    if (slug) {
      const exhibit = await db.exhibit.findUnique({
        where: { slug },
        select: { id: true, slug: true, museumNo: true, titleSi: true },
      });
      if (!exhibit) {
        return NextResponse.json({ error: "Neznan zapis" }, { status: 404 });
      }
      const versions = await db.exhibitVersion.findMany({
        where: { exhibitId: exhibit.id },
        orderBy: { version: "desc" },
      });
      return NextResponse.json({
        exhibit: { slug: exhibit.slug, museumNo: exhibit.museumNo, titleSi: exhibit.titleSi },
        count: versions.length,
        versions,
      });
    }

    if (sourceId) {
      const source = await db.source.findUnique({
        where: { id: sourceId },
        select: { id: true, nameSi: true, exhibitId: true },
      });
      if (!source) {
        return NextResponse.json({ error: "Neznan vir" }, { status: 404 });
      }
      const versions = await db.sourceVersion.findMany({
        where: { sourceId: source.id },
        orderBy: { version: "desc" },
      });
      return NextResponse.json({ source, count: versions.length, versions });
    }

    return NextResponse.json(
      { error: "Podati morate ?slug=<zapis> ali ?sourceId=<vir>" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API /api/versions GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju verzij" }, { status: 500 });
  }
}

/**
 * POST /api/versions — nova DRAFT verzija iz trenutnega stanja + patch.
 *
 * Telo:
 *   { type: "exhibit", slug, changedBy, reason?, patch? }
 *   { type: "source",  sourceId, changedBy, reason?, patch? }
 *
 * Snapshot se vedno zgradi iz trenutnega (objavljenega) stanja in na
 * njegov osnovi aplicira patch — verzija je torej vedno celovit posnetek,
 * ne difos. Neznana polja patch-a zavrnjena (strict). Identiteta zapisa
 * (slug, museumNo, category) ni urejanljiva skozi workflow.
 */
export async function POST(request: Request) {
  if (!isEditorialAuthorized(request)) return editorialForbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const type = b.type;
  const changedBy = typeof b.changedBy === "string" ? b.changedBy.trim() : "";
  if (!changedBy) {
    return NextResponse.json({ error: "changedBy (uredniški alias) je obvezen" }, { status: 400 });
  }
  const reason = typeof b.reason === "string" ? b.reason.trim().slice(0, 500) : null;
  const patch = (b.patch ?? {}) as Record<string, unknown>;

  try {
    // --- Verzija zapisa ---------------------------------------------------
    if (type === "exhibit") {
      const slug = typeof b.slug === "string" ? b.slug : "";
      const exhibit = await db.exhibit.findUnique({ where: { slug } });
      if (!exhibit) return NextResponse.json({ error: "Neznan zapis" }, { status: 404 });

      const parsed = exhibitPatchSchema.safeParse(patch);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return NextResponse.json(
          { error: `patch: ${first ? `${first.path.join(".")}: ${first.message}` : "neveljaven"}` },
          { status: 400 }
        );
      }

      const base = snapshotOfExhibit(exhibit as unknown as Record<string, unknown>);
      const snapshot = applyPatch(base, parsed.data);
      const changed = snapshotDiff(base, snapshot);

      const last = await db.exhibitVersion.aggregate({
        where: { exhibitId: exhibit.id },
        _max: { version: true },
      });
      const versionNo = (last._max.version ?? 0) + 1;

      const created = await db.exhibitVersion.create({
        data: {
          exhibitId: exhibit.id,
          version: versionNo,
          status: "DRAFT",
          snapshot: snapshot as unknown as object,
          changedBy,
          reason,
          prevVersion: versionNo > 1 ? versionNo - 1 : null,
        },
      });

      return NextResponse.json(
        { ok: true, version: created, changedFields: changed },
        { status: 201 }
      );
    }

    // --- Verzija vira -------------------------------------------------------
    if (type === "source") {
      const sourceId = typeof b.sourceId === "string" ? b.sourceId : "";
      const source = await db.source.findUnique({ where: { id: sourceId } });
      if (!source) return NextResponse.json({ error: "Neznan vir" }, { status: 404 });

      const parsed = sourcePatchSchema.safeParse(patch);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        return NextResponse.json(
          { error: `patch: ${first ? `${first.path.join(".")}: ${first.message}` : "neveljaven"}` },
          { status: 400 }
        );
      }

      const base = snapshotOfSource(source as unknown as Record<string, unknown>);
      const snapshot = applyPatch(base, parsed.data);
      const changed = sourceSnapshotDiff(base, snapshot);

      const last = await db.sourceVersion.aggregate({
        where: { sourceId: source.id },
        _max: { version: true },
      });
      const versionNo = (last._max.version ?? 0) + 1;

      const created = await db.sourceVersion.create({
        data: {
          sourceId: source.id,
          version: versionNo,
          status: "DRAFT",
          snapshot: snapshot as unknown as object,
          changedBy,
          reason,
          prevVersion: versionNo > 1 ? versionNo - 1 : null,
        },
      });

      return NextResponse.json(
        { ok: true, version: created, changedFields: changed },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'type mora biti "exhibit" ali "source"' },
      { status: 400 }
    );
  } catch (error) {
    console.error("API /api/versions POST error:", error);
    return NextResponse.json({ error: "Napaka pri shranjevanju verzije" }, { status: 500 });
  }
}
