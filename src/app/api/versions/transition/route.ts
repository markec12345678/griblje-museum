import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  isEditorialAuthorized,
  editorialForbidden,
  canAct,
  VERSION_ACTIONS,
  exhibitSnapshotSchema,
  type VersionAction,
  type VersionStatus,
} from "@/lib/editorial";

export const dynamic = "force-dynamic";

const ACTIONS: VersionAction[] = [
  "submit",
  "approve",
  "reject",
  "publish",
  "archive",
  "return-to-draft",
];

/**
 * POST /api/versions/transition — uredniški prehod statusa verzije.
 *
 * Telo:
 *   { type: "exhibit" | "source", versionId, action, by, note? }
 *   action ∈ submit | approve | reject | publish | archive | return-to-draft
 *
 * publish (samo iz APPROVED) v transakciji prepisuje polja Exhibit iz
 * snapshot-a — javni obiskovalec takoj vidi objavljeno verzijo, doslej
 * objavljena verzija pa ostane v zgodovini (označena ARCHIVED z opombo).
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
  const versionId = typeof b.versionId === "string" ? b.versionId : "";
  const action = b.action as VersionAction;
  const by = typeof b.by === "string" ? b.by.trim() : "";
  const note = typeof b.note === "string" ? b.note.trim().slice(0, 500) : null;

  if (!versionId || !by) {
    return NextResponse.json({ error: "versionId in by sta obvezna" }, { status: 400 });
  }
  if (!ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `action mora biti eden od: ${ACTIONS.join(", ")}` },
      { status: 400 }
    );
  }
  if (type !== "exhibit" && type !== "source") {
    return NextResponse.json({ error: 'type mora biti "exhibit" ali "source"' }, { status: 400 });
  }

  try {
    // --- Verzija zapisa --------------------------------------------------
    if (type === "exhibit") {
      const version = await db.exhibitVersion.findUnique({
        where: { id: versionId },
        include: { exhibit: { select: { slug: true } } },
      });
      if (!version) return NextResponse.json({ error: "Neznana verzija" }, { status: 404 });

      const from = version.status as VersionStatus;
      if (!canAct(from, action)) {
        return NextResponse.json(
          {
            error: `Prehod ${action} (→ ${VERSION_ACTIONS[action]}) ni dovoljen iz statusa ${from}.`,
          },
          { status: 409 }
        );
      }

      const target = VERSION_ACTIONS[action];

      // publish: transakcija — snapshot validiramo, prepisemo polja zapisa,
      // doslej objavljeno verzijo arhiviramo (zgodovina ostane).
      if (action === "publish") {
        const parsed = exhibitSnapshotSchema.safeParse(version.snapshot);
        if (!parsed.success) {
          return NextResponse.json(
            { error: "Snapshot verzije ni veljaven — objava zavrnjena." },
            { status: 422 }
          );
        }
        const s = parsed.data;
        const result = await db.$transaction(async (tx) => {
          await tx.exhibit.update({
            where: { id: version.exhibitId },
            data: {
              titleSi: s.titleSi,
              titleEn: s.titleEn,
              periodSi: s.periodSi,
              periodEn: s.periodEn,
              summarySi: s.summarySi,
              summaryEn: s.summaryEn,
              storySi: s.storySi,
              storyEn: s.storyEn,
              evidenceStatus: s.evidenceStatus,
              image: s.image,
              imageCredit: s.imageCredit,
              model3dUrl: s.model3dUrl,
              model3dCredit: s.model3dCredit,
              yearFrom: s.yearFrom,
              yearTo: s.yearTo,
              lat: s.lat,
              lng: s.lng,
              coordsApprox: s.coordsApprox,
              featured: s.featured,
              sortOrder: s.sortOrder,
            },
          });
          await tx.exhibitVersion.updateMany({
            where: { exhibitId: version.exhibitId, status: "PUBLISHED", id: { not: version.id } },
            data: { status: "ARCHIVED" },
          });
          return tx.exhibitVersion.update({
            where: { id: version.id },
            data: {
              status: target,
              reason: note ?? version.reason,
            },
          });
        });
        return NextResponse.json({
          ok: true,
          action,
          status: result.status,
          exhibit: version.exhibit.slug,
        });
      }

      const updated = await db.exhibitVersion.update({
        where: { id: version.id },
        data: { status: target, reason: note ?? version.reason },
      });
      return NextResponse.json({ ok: true, action, status: updated.status });
    }

    // --- Verzija vira -------------------------------------------------------
    const version = await db.sourceVersion.findUnique({ where: { id: versionId } });
    if (!version) return NextResponse.json({ error: "Neznana verzija" }, { status: 404 });

    const from = version.status as VersionStatus;
    if (!canAct(from, action)) {
      return NextResponse.json(
        { error: `Prehod ${action} (→ ${VERSION_ACTIONS[action]}) ni dovoljen iz statusa ${from}.` },
        { status: 409 }
      );
    }

    const target = VERSION_ACTIONS[action];

    // publish pri viru: snapshot je celoten posnetek urejanljivih polj
    // vira (vkljuno pravic) — transakcijsko prepisemo vir.
    if (action === "publish") {
      const s = version.snapshot as Record<string, unknown>;
      await db.$transaction([
        db.source.update({
          where: { id: version.sourceId },
          data: {
            nameSi: String(s.nameSi ?? ""),
            nameEn: String(s.nameEn ?? ""),
            sourceType: String(s.sourceType ?? "objava"),
            license: String(s.license ?? "UNKNOWN"),
            url: (s.url as string | null) ?? null,
            noteSi: (s.noteSi as string | null) ?? null,
            noteEn: (s.noteEn as string | null) ?? null,
            creator: (s.creator as string | null) ?? null,
            copyrightHolder: (s.copyrightHolder as string | null) ?? null,
            licenseUrl: (s.licenseUrl as string | null) ?? null,
            permissionToPublish: (s.permissionToPublish as string | null) ?? "UNKNOWN",
            permissionToModify: (s.permissionToModify as string | null) ?? "UNKNOWN",
            commercialUse: (s.commercialUse as string | null) ?? "UNKNOWN",
            attribution: (s.attribution as string | null) ?? null,
            restrictions: (s.restrictions as string | null) ?? null,
          },
        }),
        db.sourceVersion.updateMany({
          where: { sourceId: version.sourceId, status: "PUBLISHED", id: { not: version.id } },
          data: { status: "ARCHIVED" },
        }),
        db.sourceVersion.update({
          where: { id: version.id },
          data: { status: target, reason: note ?? version.reason },
        }),
      ]);
      return NextResponse.json({ ok: true, action, status: target });
    }

    const updated = await db.sourceVersion.update({
      where: { id: version.id },
      data: { status: target, reason: note ?? version.reason },
    });
    return NextResponse.json({ ok: true, action, status: updated.status });
  } catch (error) {
    console.error("API /api/versions/transition POST error:", error);
    return NextResponse.json({ error: "Napaka pri prehodu verzije" }, { status: 500 });
  }
}
