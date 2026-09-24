import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { isReadOnlyDatabase, readOnlyResponse } from "@/lib/readonly-db";
import { clientIpOf, rateLimited } from "@/lib/rate-limit";
import { REPORT_HIDE_THRESHOLD } from "@/lib/moderation";

export const dynamic = "force-dynamic";

const reportSchema = z
  .object({
    type: z.enum(["guestbook", "memory"]),
    id: z.string().min(1),
    reason: z.string().max(500).optional(),
  })
  .strict();

/**
 * POST /api/moderation/report — javna prijava neprimernega prispevka.
 *
 * Poveča reportCount; ob pragu REPORT_HIDE_THRESHOLD (3) se prispevek
 * samodejno skrije (moderatedBy = "auto-report") — moderator ga po
 * pregledu odobri (approve) ali trajno odstrani.
 * Omejitev: 5 prijav / 10 min na IP (kvota "reports", issue #27/J).
 */
export async function POST(request: Request) {
  try {
    const ip = clientIpOf(request);
    if (rateLimited("reports", ip)) {
      return NextResponse.json(
        { error: "Preveč prijav v kratkem času — poskusite znova kasneje." },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Neveljavno telo zahteve" }, { status: 400 });
    }

    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first ? `${first.path.join(".")}: ${first.message}` : "Neveljavni podatki" },
        { status: 400 }
      );
    }

    const { type, id, reason } = parsed.data;

    // --- Spominska knjiga ----------------------------------------------------
    if (type === "guestbook") {
      const entry = await db.guestbookEntry.findUnique({ where: { id } });
      if (!entry || entry.status === "deleted") {
        // Ne razkrivamo obstoja/neobstoja prispevka.
        return NextResponse.json({ ok: true });
      }
      const autoHide = entry.reportCount + 1 >= REPORT_HIDE_THRESHOLD;
      await db.guestbookEntry.update({
        where: { id },
        data: {
          reportCount: { increment: 1 },
          ...(autoHide && entry.status === "published"
            ? {
                status: "hidden",
                moderatedBy: "auto-report",
                moderatedAt: new Date(),
                moderationNote: `Samodejno skrit po ${entry.reportCount + 1}. prijavi${reason ? `: ${reason}` : ""}`,
                previousStatus: entry.status,
              }
            : {}),
        },
      });
      return NextResponse.json({ ok: true });
    }

    // --- Spomini ob predmetu ---------------------------------------------------
    const entry = await db.objectMemory.findUnique({ where: { id } });
    if (!entry || entry.status === "deleted") {
      return NextResponse.json({ ok: true });
    }
    const autoHide = entry.reportCount + 1 >= REPORT_HIDE_THRESHOLD;
    await db.objectMemory.update({
      where: { id },
      data: {
        reportCount: { increment: 1 },
        ...(autoHide && entry.status === "published"
          ? {
              status: "hidden",
              moderatedBy: "auto-report",
              moderatedAt: new Date(),
              moderationNote: `Samodejno skrit po ${entry.reportCount + 1}. prijavi${reason ? `: ${reason}` : ""}`,
              previousStatus: entry.status,
            }
          : {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("API /api/moderation/report POST error:", error);
    if (isReadOnlyDatabase(error)) {
      const ro = readOnlyResponse();
      return NextResponse.json(ro.body, { status: ro.status });
    }
    return NextResponse.json({ error: "Napaka pri shranjevanju prijave" }, { status: 500 });
  }
}
