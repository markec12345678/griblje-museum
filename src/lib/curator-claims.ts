/**
 * Klastri trditev za AI kustosa (issue #27/K) — veriga dokaza.
 *
 * Kustos sme v odgovoru navedti samo OBJAVLJENE trditve (PUBLISHED) in
 * sme vsako trditev predstaviti kot zgodovinsko dejstvo SAMO, če
 * obstaja preverljiva veriga: (DOCUMENTED|CORROBORATED) + vezava na
 * vir + konkretna stran/enota (canAiPresentAsFact, src/lib/claims.ts).
 * TESTIMONY / TRADITION / TO_COLLECT so v odgovoru VEDNO vidno
 * označeni po svojem statusu — nikoli tiho predstavljeni kot dokumentirano.
 */

import { db } from "@/lib/db";
import {
  canAiPresentAsFact,
  publicClaimDTO,
  type ClaimDTO,
} from "@/lib/claims";

export type CuratorClaimView = ClaimDTO & {
  /** SME AI trditev predstaviti kot dejstvo (preverljiva veriga)? */
  aiMayPresentAsFact: boolean;
};

/** Čisto preslikava (testabilno brez baze). */
export function withAiFlag(claim: ClaimDTO): CuratorClaimView {
  return {
    ...claim,
    aiMayPresentAsFact:
      (claim.evidenceStatus === "DOCUMENTED" || claim.evidenceStatus === "CORROBORATED") &&
      claim.citation.kind !== null,
  };
}

/**
 * Objavljene trditve za podane zapise (slug-i iz odgovora kustosa).
 * Napake baze se tiho degradirajo v prazen seznam — trditve so
 * nadgradnja odgovora, ne pogoj njegove veljavnosti.
 */
export async function claimsForSlugs(slugs: string[]): Promise<CuratorClaimView[]> {
  const unique = [...new Set(slugs)].filter(Boolean).slice(0, 20);
  if (unique.length === 0) return [];

  try {
    const exhibits = await db.exhibit.findMany({
      where: { slug: { in: unique } },
      select: { id: true },
    });
    if (exhibits.length === 0) return [];

    const claims = await db.claim.findMany({
      where: { exhibitId: { in: exhibits.map((e) => e.id) }, status: "PUBLISHED" },
      include: {
        source: { select: { nameSi: true, nameEn: true, license: true, url: true } },
        archiveRecord: {
          select: { institution: true, fonds: true, signature: true, repositoryUrl: true },
        },
      },
      orderBy: [{ evidenceStatus: "asc" }, { createdAt: "desc" }],
      take: 50,
    });

    return claims.map((c) => withAiFlag(publicClaimDTO({ ...c, source: c.source ?? null, archiveRecord: c.archiveRecord ?? null })));
  } catch {
    return [];
  }
}
