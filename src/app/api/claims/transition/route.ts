import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  isEditorialAuthorized,
  editorialForbidden,
} from "@/lib/editorial";
import {
  canTransitionClaim,
  CLAIM_ACTIONS,
  checkEvidenceGate,
  publicClaimDTO,
  type ClaimAction,
  type ClaimWorkflowStatus,
} from "@/lib/claims";

export const dynamic = "force-dynamic";

const ACTIONS: ClaimAction[] = ["approve", "publish", "return-to-draft", "unpublish"];

/**
 * POST /api/claims/transition — uredniški prehod statusa trditve.
 *
 * Telo: { claimId, action, by, note? }
 *   approve         → APPROVED  (iz DRAFT)
 *   publish         → PUBLISHED (iz APPROVED; evidence gate se ponovno
 *                     preveri — neobjavljena/nepreverjena vsebina ne
 *                     more nenamerno postati javna, issue #27/DoD)
 *   return-to-draft → DRAFT     (iz APPROVED)
 *   unpublish       → APPROVED  (iz PUBLISHED — umik iz javnega API-ja)
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
  const claimId = typeof b.claimId === "string" ? b.claimId : "";
  const action = b.action as ClaimAction;
  const by = typeof b.by === "string" ? b.by.trim() : "";

  if (!claimId || !by) {
    return NextResponse.json({ error: "claimId in by sta obvezna" }, { status: 400 });
  }
  if (!ACTIONS.includes(action)) {
    return NextResponse.json(
      { error: `action mora biti eden od: ${ACTIONS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: {
        source: { select: { nameSi: true, nameEn: true, license: true, url: true } },
        archiveRecord: {
          select: { institution: true, fonds: true, signature: true, repositoryUrl: true },
        },
      },
    });
    if (!claim) return NextResponse.json({ error: "Neznana trditev" }, { status: 404 });

    const from = claim.status as ClaimWorkflowStatus;
    const target = CLAIM_ACTIONS[action];
    if (!canTransitionClaim(from, target)) {
      return NextResponse.json(
        { error: `Prehod ${action} (→ ${target}) ni dovoljen iz statusa ${from}.` },
        { status: 409 }
      );
    }

    // publish: evidence gate se ponovno preveri nad trenutnim stanjem
    // (vezave se lahko spremenijo od vpisa do objave).
    if (action === "publish") {
      const gate = checkEvidenceGate({
        evidenceStatus: claim.evidenceStatus,
        status: "APPROVED",
        sourceId: claim.sourceId,
        archiveRecordId: claim.archiveRecordId,
        pageRef: claim.pageRef,
      });
      if (!gate.ok) {
        return NextResponse.json({ error: gate.reason }, { status: 422 });
      }
    }

    const updated = await db.claim.update({
      where: { id: claim.id },
      data: { status: target, updatedBy: by },
      include: {
        source: { select: { nameSi: true, nameEn: true, license: true, url: true } },
        archiveRecord: {
          select: { institution: true, fonds: true, signature: true, repositoryUrl: true },
        },
      },
    });

    return NextResponse.json({
      ok: true,
      action,
      status: updated.status,
      claim: publicClaimDTO({ ...updated }),
    });
  } catch (error) {
    console.error("API /api/claims/transition POST error:", error);
    return NextResponse.json({ error: "Napaka pri prehodu trditve" }, { status: 500 });
  }
}
