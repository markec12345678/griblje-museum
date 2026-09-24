/**
 * Claim-level provenance — evidence gate (issue #27/D + K).
 *
 * Trditev (Claim) je najmanjša preverljiva enota: »šola ustanovljena
 * 1889«, »gostilna omenjena 1937« … Vsaka trditev nosi svoj evidence
 * status in neposredno vezavo na vir (Source ali ArchiveRecord) z
 * konkretno stranjo/oddelkom/arhivsko enoto (pageRef).
 *
 * KRITIČNO PRAVILO (issue #27/D + K):
 *  - AI kustos sme zgodovinsko trditev predstavljati kot dokazano samo,
 *    če obstaja preverljiva veriga: PUBLISHED + (DOCUMENTED|CORROBORATED)
 *    + vezava na vir.
 *  - TESTIMONY / TRADITION / TO_COLLECT ne smejo biti tiho predstavljeni
 *    kot DOCUMENTED — evidence status je viden povsod, kjer je relevanten.
 *  - Če dokaz ni zadosten, odgovor to pove.
 */

export type ClaimEvidenceStatus =
  | "DOCUMENTED"
  | "CORROBORATED"
  | "TESTIMONY"
  | "TRADITION"
  | "UNVERIFIED"
  | "TO_COLLECT";

export type ClaimWorkflowStatus = "DRAFT" | "APPROVED" | "PUBLISHED";

/** Preverljiva enota za evidence gate — polja, ki jih gate bere. */
export type ClaimEvidenceInput = {
  evidenceStatus: string;
  status: string;
  sourceId?: string | null;
  archiveRecordId?: string | null;
  pageRef?: string | null;
  /** Objektne vezave (Prisma include) — prisotnost šteje kot vezava. */
  source?: unknown;
  archiveRecord?: unknown;
};

/** Rezultat evidence gate-a. */
export type EvidenceGateResult = {
  ok: boolean;
  /** Zakaj je (ne)veljavna — človeku razumljivo, za API in dnevnik. */
  reason: string;
};

/**
 * Evidence gate pri vpisu/objavi trditve.
 *
 *  - DOCUMENTED zahteva vezavo na vir ALI arhivsko enoto IN konkretno
 *    stran/section/enoto (pageRef). Brez tega trditev ni dokumentirana.
 *  - CORROBORATED zahteva vsaj vezavo na vir (koroboracija z dvema
 *    neodvisnima virema se rešuje z dvema trditvama, ne z enim poljem).
 *  - TESTIMONY / TRADITION smejo obstajati brez vira (ustno izročilo je
 *    zakonit vir) — nikoli pa ne smejo postati DOCUMENTED brez dokaza.
 *  - TO_COLLECT / UNVERIFIED brez omejitev (to je ravno njihov namen).
 */
export function checkEvidenceGate(claim: ClaimEvidenceInput): EvidenceGateResult {
  const hasLink = Boolean(
    claim.sourceId || claim.archiveRecordId || claim.source || claim.archiveRecord
  );
  const hasPageRef = Boolean(claim.pageRef && claim.pageRef.trim().length > 0);

  switch (claim.evidenceStatus) {
    case "DOCUMENTED":
      if (!hasLink) {
        return {
          ok: false,
          reason:
            "DOCUMENTED zahteva vezavo na vir ali arhivsko enoto (sourceId/archiveRecordId).",
        };
      }
      if (!hasPageRef) {
        return {
          ok: false,
          reason:
            "DOCUMENTED zahteva konkretno stran/oddelek/enoto vira (pageRef).",
        };
      }
      return { ok: true, reason: "DOCUMENTED s preverljivo vezavo na vir." };

    case "CORROBORATED":
      if (!hasLink) {
        return {
          ok: false,
          reason: "CORROBORATED zahteva vsaj eno vezavo na vir (sourceId/archiveRecordId).",
        };
      }
      return { ok: true, reason: "CORROBORATED z vezavo na vir." };

    case "TESTIMONY":
    case "TRADITION":
      return {
        ok: true,
        reason: `${claim.evidenceStatus} — ustni vir je zakonit, ne sme pa biti prikazan kot dokumentiran.`,
      };

    case "TO_COLLECT":
    case "UNVERIFIED":
      return { ok: true, reason: `${claim.evidenceStatus} — trditev čaka na dokaz.` };

    default:
      return { ok: false, reason: `Neznan evidence status: ${claim.evidenceStatus}` };
  }
}

/**
 * SME AI to trditev predstaviti kot zgodovinsko dejstvo?
 * Samo PUBLISHED + (DOCUMENTED | CORROBORATED) + vezava na vir.
 */
export function canAiPresentAsFact(claim: ClaimEvidenceInput): boolean {
  if (claim.status !== "PUBLISHED") return false;
  if (!(claim.evidenceStatus === "DOCUMENTED" || claim.evidenceStatus === "CORROBORATED")) {
    return false;
  }
  const gate = checkEvidenceGate(claim);
  return gate.ok;
}

/** Dovoljeni prehodi workflow-a trditev. */
export const CLAIM_TRANSITIONS: Record<ClaimWorkflowStatus, readonly ClaimWorkflowStatus[]> = {
  DRAFT: ["APPROVED"],
  APPROVED: ["PUBLISHED", "DRAFT"],
  PUBLISHED: ["APPROVED"],
};

export function canTransitionClaim(from: ClaimWorkflowStatus, to: ClaimWorkflowStatus): boolean {
  return CLAIM_TRANSITIONS[from].includes(to);
}

/** Uredniška akcija → ciljni status. */
export const CLAIM_ACTIONS = {
  approve: "APPROVED",
  publish: "PUBLISHED",
  "return-to-draft": "DRAFT",
  unpublish: "APPROVED",
} as const;
export type ClaimAction = keyof typeof CLAIM_ACTIONS;

// --- Javni DTO (issue #27/I — brez puščanja notranjih polj) --------------

export type ClaimLike = {
  id: string;
  statement: string;
  lang: string;
  evidenceStatus: string;
  confidence?: string | null;
  pageRef?: string | null;
  status: string;
  version: number;
  sourceId?: string | null;
  archiveRecordId?: string | null;
  source?: {
    nameSi: string;
    nameEn: string;
    license: string;
    url: string | null;
  } | null;
  archiveRecord?: {
    institution: string;
    fonds: string;
    signature: string;
    repositoryUrl?: string | null;
  } | null;
  researcherNote?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
};

export type ClaimDTO = {
  id: string;
  statement: string;
  lang: string;
  evidenceStatus: ClaimEvidenceStatus;
  confidence: string | null;
  pageRef: string | null;
  version: number;
  citation: {
    kind: "source" | "archive" | null;
    name: string | null;
    url: string | null;
    /** Npr. »Okrajno glavarstvo Črnomelj, SI_ZAL_ČRN/0001/001/00012«. */
    reference: string | null;
  };
};

/**
 * Javni DTO trditve — odstrani vsa notranja polja:
 *   researcherNote, createdBy, updatedBy, status (workflow je interni),
 *   surove ID-je vezav. Citacija je javna (ime vira, URL, referenca).
 */
export function publicClaimDTO(claim: ClaimLike): ClaimDTO {
  let citation: ClaimDTO["citation"] = { kind: null, name: null, url: null, reference: null };
  if (claim.source) {
    citation = {
      kind: "source",
      name: claim.source.nameSi,
      url: claim.source.url,
      reference: claim.pageRef ?? null,
    };
  } else if (claim.archiveRecord) {
    citation = {
      kind: "archive",
      name: `${claim.archiveRecord.institution} — ${claim.archiveRecord.fonds}`,
      url: claim.archiveRecord.repositoryUrl ?? null,
      reference: [claim.archiveRecord.signature, claim.pageRef].filter(Boolean).join(", ") || null,
    };
  }

  return {
    id: claim.id,
    statement: claim.statement,
    lang: claim.lang,
    evidenceStatus: claim.evidenceStatus as ClaimEvidenceStatus,
    confidence: claim.confidence ?? null,
    pageRef: claim.pageRef ?? null,
    version: claim.version,
    citation,
  };
}
