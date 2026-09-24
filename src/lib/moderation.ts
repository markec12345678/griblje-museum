/**
 * Moderacija skupnostnih prispevkov (issue #27/G).
 *
 * Statusi: pending | published | rejected | hidden | deleted (soft).
 *   - published je edini javno viden status;
 *   - pending je prejšnji »held« (čaka na pregled);
 *   - rejected/hidden ostajata v bazi (vzorec, ne izbris);
 *   - deleted je mehki izbris (deletedAt) — fizicno čiščenje po
 *     retencijskih pravilih (issue #27/H, scripts/gdpr-retention.ts).
 *
 * Meta podatki moderatorja (moderatedBy/At, note, previousStatus) se
 * zapisujejo pri vsaki akciji — kdo/kdaj/zakaj/prejšnji status.
 *
 * Samodejna moderacija ob vpisu (honeypot + hevristika, glej
 * src/lib/contributions.ts) ostane nespremenjena.
 *
 * Avtorizacija: deljeni moderatorski žeton (MODERATION_TOKEN) v glavi
 * `x-moderation-token`. Brez žetona je API zaprt (503) — enaka politika
 * kot uredniški vmesnik (src/lib/editorial.ts).
 */

import { NextResponse } from "next/server";

export type ModerationStatus = "pending" | "published" | "rejected" | "hidden" | "deleted";

export type ModerationAction = "approve" | "reject" | "hide" | "restore" | "soft-delete";

/** Dovoljeni prehodi: akcija → iz katerih statusov. */
export const MODERATION_TRANSITIONS: Record<ModerationAction, readonly ModerationStatus[]> = {
  approve: ["pending", "hidden", "rejected"],
  reject: ["pending", "published", "hidden"],
  hide: ["pending", "published"],
  restore: ["hidden", "rejected"],
  "soft-delete": ["pending", "published", "rejected", "hidden"],
};

/** Ciljni status akcije. */
export const MODERATION_TARGETS: Record<ModerationAction, ModerationStatus> = {
  approve: "published",
  reject: "rejected",
  hide: "hidden",
  restore: "published",
  "soft-delete": "deleted",
};

export function canModerate(from: ModerationStatus, action: ModerationAction): boolean {
  return MODERATION_TRANSITIONS[action].includes(from);
}

/** Prag prijav za samodejno skritje prispevka. */
export const REPORT_HIDE_THRESHOLD = 3;

// --- Avtorizacija ---------------------------------------------------------

export function isModerationAuthorized(request: Request): boolean {
  const expected = process.env.MODERATION_TOKEN;
  if (!expected) return false;
  const provided = request.headers.get("x-moderation-token") ?? "";
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function moderationForbidden(): NextResponse {
  if (!process.env.MODERATION_TOKEN) {
    return NextResponse.json(
      { error: "Moderacijski vmesnik ni nastavljen (MODERATION_TOKEN manjka)." },
      { status: 503 }
    );
  }
  return NextResponse.json({ error: "Manjka veljaven x-moderation-token." }, { status: 401 });
}
