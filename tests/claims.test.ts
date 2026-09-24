import { describe, expect, test } from "bun:test";
import {
  checkEvidenceGate,
  canAiPresentAsFact,
  canTransitionClaim,
  publicClaimDTO,
  type ClaimLike,
} from "../src/lib/claims";

// --- Evidence gate (#27/D) -------------------------------------------------

describe("claim evidence gate", () => {
  test("DOCUMENTED brez vezave na vir je zavrnjen", () => {
    const r = checkEvidenceGate({
      evidenceStatus: "DOCUMENTED",
      status: "DRAFT",
      sourceId: null,
      archiveRecordId: null,
      pageRef: "str. 129",
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("vezavo");
  });

  test("DOCUMENTED z virom brez strani/enote je zavrnjen", () => {
    const r = checkEvidenceGate({
      evidenceStatus: "DOCUMENTED",
      status: "DRAFT",
      sourceId: "src-1",
      pageRef: null,
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toContain("pageRef");
  });

  test("DOCUMENTED z arhivsko enoto + signaturo + enoto je dovoljen", () => {
    const r = checkEvidenceGate({
      evidenceStatus: "DOCUMENTED",
      status: "APPROVED",
      archiveRecordId: "ar-1",
      pageRef: "SI_ZAL_ČRN/0001/001/00012, šolsko leto 1929/30",
    });
    expect(r.ok).toBe(true);
  });

  test("CORROBORATED brez vira je zavrnjen", () => {
    const r = checkEvidenceGate({
      evidenceStatus: "CORROBORATED",
      status: "DRAFT",
    });
    expect(r.ok).toBe(false);
  });

  test("TESTIMONY/TRADITION smejo obstajati brez vira — nikoli pa niso dokumentirani", () => {
    expect(
      checkEvidenceGate({ evidenceStatus: "TESTIMONY", status: "DRAFT" }).ok
    ).toBe(true);
    expect(
      checkEvidenceGate({ evidenceStatus: "TRADITION", status: "DRAFT" }).ok
    ).toBe(true);
  });

  test("TO_COLLECT je vedno dovoljen (namen: čaka na dokaz)", () => {
    expect(
      checkEvidenceGate({ evidenceStatus: "TO_COLLECT", status: "DRAFT" }).ok
    ).toBe(true);
  });

  test("neznan evidence status je zavrnjen", () => {
    expect(checkEvidenceGate({ evidenceStatus: "MADE_UP", status: "DRAFT" }).ok).toBe(false);
  });
});

// --- AI evidence gate (#27/K) -----------------------------------------------

describe("AI kustos — evidence veriga", () => {
  const base: ClaimLike = {
    id: "c1",
    statement: "Šola v Gribljem ustanovljena 1889",
    lang: "sl",
    evidenceStatus: "DOCUMENTED",
    status: "PUBLISHED",
    version: 1,
    pageRef: "str. 129",
    source: {
      nameSi: "Krajevni leksikon 1937",
      nameEn: "Local Lexicon 1937",
      license: "Public domain",
      url: "https://dlib.si/…",
    },
  };

  test("PUBLISHED DOCUMENTED z virom: AI sme predstaviti kot dejstvo", () => {
    expect(canAiPresentAsFact({ ...base })).toBe(true);
  });

  test("DRAFT/APPROVED trditev: AI NE SME predstaviti kot dejstvo", () => {
    expect(canAiPresentAsFact({ ...base, status: "DRAFT" })).toBe(false);
    expect(canAiPresentAsFact({ ...base, status: "APPROVED" })).toBe(false);
  });

  test("TESTIMONY/TRADITION/TO_COLLECT: AI NE SME predstaviti kot dejstvo", () => {
    expect(canAiPresentAsFact({ ...base, evidenceStatus: "TESTIMONY" })).toBe(false);
    expect(canAiPresentAsFact({ ...base, evidenceStatus: "TRADITION" })).toBe(false);
    expect(canAiPresentAsFact({ ...base, evidenceStatus: "TO_COLLECT" })).toBe(false);
  });

  test("PUBLISHED DOCUMENTED brez vezave na vir: gate zavrne", () => {
    expect(
      canAiPresentAsFact({ ...base, source: null, archiveRecord: null })
    ).toBe(false);
  });
});

// --- Workflow trditev --------------------------------------------------------

describe("claim workflow", () => {
  test("preskok odobritve (DRAFT → PUBLISHED) ni dovoljen", () => {
    expect(canTransitionClaim("DRAFT", "PUBLISHED")).toBe(false);
    expect(canTransitionClaim("DRAFT", "APPROVED")).toBe(true);
    expect(canTransitionClaim("APPROVED", "PUBLISHED")).toBe(true);
  });

  test("umik objave gre nazaj v APPROVED, ne v DRAFT", () => {
    expect(canTransitionClaim("PUBLISHED", "APPROVED")).toBe(true);
    expect(canTransitionClaim("PUBLISHED", "DRAFT")).toBe(false);
  });
});

// --- Javni DTO: brez puščanja notranjih polj (#27/I) -------------------------

describe("public claim DTO", () => {
  test("raziskovalna opomba in uredniški metapodatki NISO v javnem DTO", () => {
    const claim: ClaimLike = {
      id: "c2",
      statement: "Gostilna omenjena 1937 (Gas.)",
      lang: "sl",
      evidenceStatus: "CORROBORATED",
      confidence: "MEDIUM",
      pageRef: "str. 129–130",
      status: "PUBLISHED",
      version: 2,
      researcherNote: "Interno: preveriti še SI AS 16 volilne spise.",
      createdBy: "raziskovalec-1",
      updatedBy: "kurator-1",
    };
    const dto = publicClaimDTO(claim) as unknown as Record<string, unknown>;
    expect(dto.researcherNote).toBeUndefined();
    expect(dto.createdBy).toBeUndefined();
    expect(dto.updatedBy).toBeUndefined();
    expect(dto.status).toBeUndefined();
    expect(dto.evidenceStatus).toBe("CORROBORATED");
    expect(dto.confidence).toBe("MEDIUM");
    expect((dto.citation as Record<string, unknown>).kind).toBe(null);
  });

  test("citacija arhivske enote vsebuje signaturo + stran", () => {
    const dto = publicClaimDTO({
      id: "c3",
      statement: "Državna osnovna šola Griblje 1929–41",
      lang: "sl",
      evidenceStatus: "TO_COLLECT",
      status: "PUBLISHED",
      version: 1,
      pageRef: "šolsko leto 1929/30",
      archiveRecord: {
        institution: "ZAL Novo mesto",
        fonds: "Okrajno glavarstvo Črnomelj 1861–1943",
        signature: "SI_ZAL_ČRN/0001/001/00012",
        repositoryUrl: "https://…",
      },
    });
    expect(dto.citation.kind).toBe("archive");
    expect(dto.citation.reference).toContain("SI_ZAL_ČRN/0001/001/00012");
    expect(dto.citation.reference).toContain("1929/30");
  });
});
