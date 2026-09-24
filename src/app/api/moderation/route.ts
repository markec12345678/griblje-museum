import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  isModerationAuthorized,
  moderationForbidden,
  canModerate,
  MODERATION_TARGETS,
  type ModerationAction,
  type ModerationStatus,
} from "@/lib/moderation";

export const dynamic = "force-dynamic";

/**
 * GET /api/moderation?status=pending&type=guestbook — moderacijska vrsta.
 * Interni API (žeton) — vrača tudi meta podatke moderacije (#27/I: samo
 * z žetonom).
 */
export async function GET(request: Request) {
  if (!isModerationAuthorized(request)) return moderationForbidden();

  const params = new URL(request.url).searchParams;
  const status = (params.get("status") ?? "pending") as ModerationStatus;
  const type = params.get("type") ?? "guestbook";

  if (!["pending", "published", "rejected", "hidden", "deleted"].includes(status)) {
    return NextResponse.json({ error: "Neznan status" }, { status: 400 });
  }
  if (!["guestbook", "memory"].includes(type)) {
    return NextResponse.json({ error: 'type mora biti "guestbook" ali "memory"' }, { status: 400 });
  }

  try {
    const common = {
      where: { status },
      orderBy: { createdAt: "desc" as const },
      take: 200,
    };
    if (type === "guestbook") {
      const entries = await db.guestbookEntry.findMany(common);
      return NextResponse.json({
        type,
        status,
        count: entries.length,
        entries: entries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() })),
      });
    }
    const entries = await db.objectMemory.findMany({
      ...common,
      include: { exhibit: { select: { slug: true, museumNo: true } } },
    });
    return NextResponse.json({
      type,
      status,
      count: entries.length,
      entries: entries.map((m) => ({
        id: m.id,
        exhibitSlug: m.exhibit?.slug ?? null,
        museumNo: m.exhibit?.museumNo ?? null,
        author: m.author,
        place: m.place,
        memory: m.memory,
        lang: m.lang,
        status: m.status,
        reportCount: m.reportCount,
        moderatedBy: m.moderatedBy,
        moderatedAt: m.moderatedAt?.toISOString() ?? null,
        moderationNote: m.moderationNote,
        previousStatus: m.previousStatus,
        deletedAt: m.deletedAt?.toISOString() ?? null,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("API /api/moderation GET error:", error);
    return NextResponse.json({ error: "Napaka pri branju vrste" }, { status: 500 });
  }
}

const actionSchema = z
  .object({
    type: z.enum(["guestbook", "memory"]),
    id: z.string().min(1),
    action: z.enum(["approve", "reject", "hide", "restore", "soft-delete"]),
    by: z.string().min(1).max(200),
    note: z.string().max(500).optional(),
  })
  .strict();

/**
 * POST /api/moderation — moderacijska akcija (žeton).
 *
 * { type, id, action: approve|reject|hide|restore|soft-delete, by, note? }
 * Zabeleži kdo/kdaj/zakaj/prejšnji status. Obnova (restore) vrne prispevek
 * v javno vidnost (published) — enakovredno odobritvi po pregledu.
 */
export async function POST(request: Request) {
  if (!isModerationAuthorized(request)) return moderationForbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
  }

  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Neveljavni podatki" },
      { status: 400 }
    );
  }

  const { type, id, action, by, note } = parsed.data;

  try {
    // --- Spominska knjiga -------------------------------------------------
    if (type === "guestbook") {
      const entry = await db.guestbookEntry.findUnique({ where: { id } });
      if (!entry) return NextResponse.json({ error: "Neznan vpis" }, { status: 404 });

      const from = entry.status as ModerationStatus;
      if (!canModerate(from, action)) {
        return NextResponse.json(
          { error: `Akcija ${action} ni dovoljena iz statusa ${from}.` },
          { status: 409 }
        );
      }
      const target = MODERATION_TARGETS[action];
      const updated = await db.guestbookEntry.update({
        where: { id },
        data: {
          status: target,
          moderatedBy: by,
          moderatedAt: new Date(),
          moderationNote: note ?? null,
          previousStatus: from,
          ...(target === "deleted" ? { deletedAt: new Date() } : {}),
        },
      });
      return NextResponse.json({ ok: true, action, status: updated.status });
    }

    // --- Spomini ob predmetu ------------------------------------------------
    const entry = await db.objectMemory.findUnique({ where: { id } });
    if (!entry) return NextResponse.json({ error: "Neznan spomin" }, { status: 404 });

    const from = entry.status as ModerationStatus;
    if (!canModerate(from, action)) {
      return NextResponse.json(
        { error: `Akcija ${action} ni dovoljena iz statusa ${from}.` },
        { status: 409 }
      );
    }
    const target = MODERATION_TARGETS[action];
    const updated = await db.objectMemory.update({
      where: { id },
      data: {
        status: target,
        moderatedBy: by,
        moderatedAt: new Date(),
        moderationNote: note ?? null,
        previousStatus: from,
        ...(target === "deleted" ? { deletedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ ok: true, action, status: updated.status });
  } catch (error) {
    console.error("API /api/moderation POST error:", error);
    return NextResponse.json({ error: "Napaka pri moderaciji" }, { status: 500 });
  }
}
