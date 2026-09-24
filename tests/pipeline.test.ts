import { describe, expect, test } from "bun:test";
import {
  PIPELINE_STAGES,
  PIPELINE_STAGE_REQUIREMENTS,
  advancePipeline,
  canAdvance,
  reachableStage,
  validatePipeline,
  type PipelineEvidence,
} from "../src/lib/pipeline";

/* --- Pomožni dokazilni vzorci ---------------------------------------------- */

/** Ugotovitev, katere edini izvor je spletna sled (npr. VAČ AJAX zadetek). */
const WEB_TRACE_ONLY: PipelineEvidence = {
  origin: "WEB_TRACE",
  researchStatus: "NOT_VIEWED",
  digitized: false,
};

/** Popolna, poštena pot: katalogizirano, brano, s stranjo in transkripcijo. */
const FULL_PATH: PipelineEvidence = {
  origin: "CATALOGUE",
  institution: "ZAL — Enota za Dolenjsko in Belo krajino Novo mesto",
  fonds: "Okrajno glavarstvo Črnomelj 1861–1943",
  signature: "SI_ZAL_ČRN/0001/001/00012",
  identifier: "4118864",
  pageRef: "priloga: opis kraja, poročilo 1937",
  researchStatus: "TRANSCRIBED",
  digitized: true,
  transcription: "…vas Griblje, šola ustanovljena 1889, dva oddelka…",
  statement: "Državna osnovna šola Griblje je bila ustanovljena leta 1889.",
  evidenceStatus: "DOCUMENTED",
  sourceId: "src-1",
  sourceLicense: "PUBLIC",
  exhibitSlug: "sola-1889",
  museumNo: "MVG-TEST",
  versionStatus: "PUBLISHED",
  changedBy: "kustos",
  reason: "Vir: šolski list 1929–41, priloga opis kraja.",
};

/* --- Vrstni red in prehodi -------------------------------------------------- */

describe("pipeline (#27/L) — vrsta odrov", () => {
  test("cevovod ima 9 odrov v navedenem vrstnem redu", () => {
    expect(PIPELINE_STAGES).toEqual([
      "RESEARCH_FINDING",
      "ARCHIVE_RECORD",
      "PAGE_VERIFICATION",
      "TRANSCRIPTION",
      "CLAIM",
      "SOURCE_LINK",
      "EXHIBIT",
      "EDITORIAL_REVIEW",
      "PUBLISHED",
    ]);
  });

  test("prehodi so samo naprej po en oder", () => {
    expect(canAdvance("RESEARCH_FINDING", "ARCHIVE_RECORD")).toBe(true);
    expect(canAdvance("RESEARCH_FINDING", "CLAIM")).toBe(false);
    expect(canAdvance("CLAIM", "SOURCE_LINK")).toBe(true);
    expect(canAdvance("SOURCE_LINK", "CLAIM")).toBe(false);
    expect(canAdvance("PUBLISHED", "PUBLISHED")).toBe(false);
  });

  test("vsak oder ima preverljive zahteve", () => {
    for (const stage of PIPELINE_STAGES) {
      expect(typeof PIPELINE_STAGE_REQUIREMENTS[stage].check).toBe("function");
      expect(PIPELINE_STAGE_REQUIREMENTS[stage].label.length).toBeGreaterThan(3);
    }
  });
});

/* --- ŽELEZNO PRAVILO: spletna sled ni dokaz --------------------------------- */

describe("pipeline (#27/L) — spletna sled sama po sebi ni dokaz", () => {
  test("WEB_TRACE + NOT_VIEWED ne sme na oder preverbe strani", () => {
    const r = advancePipeline("ARCHIVE_RECORD", {
      ...WEB_TRACE_ONLY,
      institution: "ZAL NM",
      signature: "SI_ZAL_ČRN/0001/001/00012",
    });
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("researchStatus");
    expect(r.reason).toContain("NI bila brana");
  });

  test("WEB_TRACE + digitalizirana enota + brana stran sme naprej", () => {
    const r = advancePipeline("ARCHIVE_RECORD", {
      ...WEB_TRACE_ONLY,
      institution: "ZAL NM",
      signature: "SI_ZAL_ČRN/0001/001/00012",
      pageRef: "str. 3, opis kraja",
      researchStatus: "VIEWED",
      digitized: true,
    });
    expect(r.ok).toBe(true);
  });

  test("DOCUMENTED na enoti, ki ni bila odprta in ni digitalizirana, je zavrnjen", () => {
    const r = advancePipeline("TRANSCRIPTION", {
      origin: "WEB_TRACE",
      researchStatus: "NOT_VIEWED",
      digitized: false,
      statement: "Šola ustanovljena 1889.",
      evidenceStatus: "DOCUMENTED",
      sourceId: "src-9",
      pageRef: "str. 3",
    });
    // Evidence gate po formi USPE (vir + stran obstajata), a cevovod
    // uveljavlja pošten raziskovalni status: NOT_VIEWED + nedigitalizirano
    // = »najdeno, ne prebrano« — DOCUMENTED ni mogoč (issue #27/E+M).
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("researchStatus");
    expect(r.reason).toContain("ni bila odprta");
  });

  test("reachableStage pošteno ustavi pri arhivskem zapisu (samo sled)", () => {
    const reached = reachableStage({
      ...WEB_TRACE_ONLY,
      institution: "ZAL NM",
      signature: "SI_ZAL_ČRN/0001/001/00012",
    });
    expect(reached).toBe("ARCHIVE_RECORD");
  });
});

/* --- Zahteve po odrih -------------------------------------------------------- */

describe("pipeline (#27/L) — zahteve odrov", () => {
  test("ARCHIVE_RECORD zahteva ustanovo + signaturo", () => {
    const r = advancePipeline("RESEARCH_FINDING", WEB_TRACE_ONLY);
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("archive_record");
  });

  test("PAGE_VERIFICATION zahteva pageRef", () => {
    const r = advancePipeline("ARCHIVE_RECORD", {
      ...WEB_TRACE_ONLY,
      researchStatus: "VIEWED",
      digitized: true,
    });
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("pageRef");
  });

  test("TRANSCRIPTION brez strani je zavrnjena; brez transkripcije oder smeš izpustiti", () => {
    const empty = advancePipeline("PAGE_VERIFICATION", {
      ...WEB_TRACE_ONLY,
      pageRef: "str. 3",
      researchStatus: "VIEWED",
      digitized: true,
      transcription: "  ",
    });
    expect(empty.ok).toBe(false);
    expect(empty.unmet).toBe("transcription");

    const skipped = advancePipeline("PAGE_VERIFICATION", {
      ...WEB_TRACE_ONLY,
      pageRef: "str. 3",
      researchStatus: "VIEWED",
      digitized: true,
    });
    expect(skipped.ok).toBe(true);
  });

  test("SOURCE_LINK: vir mora imeti izrecno licenco; brez vira mora nositi arhivsko enoto", () => {
    const noLicense = advancePipeline("CLAIM", { ...FULL_PATH, sourceLicense: null });
    expect(noLicense.ok).toBe(false);
    expect(noLicense.unmet).toBe("license");

    const noSourceNoArchive = advancePipeline("CLAIM", {
      ...FULL_PATH,
      sourceId: null,
      sourceLicense: null,
      archiveRecordId: null,
    });
    expect(noSourceNoArchive.ok).toBe(false);
    expect(noSourceNoArchive.unmet).toBe("source_link");

    const archiveInstead = advancePipeline("CLAIM", {
      ...FULL_PATH,
      sourceId: null,
      sourceLicense: null,
      archiveRecordId: "ar-1",
    });
    expect(archiveInstead.ok).toBe(true);
  });

  test("EXHIBIT zahteva slug in muzejsko številko", () => {
    const r = advancePipeline("SOURCE_LINK", { ...FULL_PATH, museumNo: undefined });
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("exhibit");
  });

  test("EDITORIAL_REVIEW zahteva APPROVED + urednika + razlog", () => {
    const draft = advancePipeline("EXHIBIT", { ...FULL_PATH, versionStatus: "DRAFT" });
    expect(draft.unmet).toBe("versionStatus");

    const noEditor = advancePipeline("EXHIBIT", {
      ...FULL_PATH,
      versionStatus: "APPROVED",
      changedBy: undefined,
    });
    expect(noEditor.unmet).toBe("changedBy");

    const noReason = advancePipeline("EXHIBIT", {
      ...FULL_PATH,
      versionStatus: "APPROVED",
      reason: undefined,
    });
    expect(noReason.unmet).toBe("reason");
  });

  test("PUBLISHED zahteva PUBLISHED verzijo in zapis", () => {
    const r = advancePipeline("EDITORIAL_REVIEW", {
      ...FULL_PATH,
      versionStatus: "APPROVED",
    });
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("versionStatus");
  });
});

/* --- Celotna validacija ------------------------------------------------------- */

describe("pipeline (#27/L) — validacija cele poti", () => {
  test("popolna poštena pot velja do PUBLISHED", () => {
    const r = validatePipeline("PUBLISHED", FULL_PATH);
    expect(r.ok).toBe(true);
  });

  test("pot z NEbrano enoto pade že pri preverbi strani", () => {
    const r = validatePipeline("PUBLISHED", {
      ...FULL_PATH,
      researchStatus: "NOT_VIEWED",
      digitized: false,
    });
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("researchStatus");
    expect(r.reason).toContain("PAGE_VERIFICATION");
  });

  test("neobstoječ oder je zavrnjen (tipovna varnost + zaščita)", () => {
    // @ts-expect-error namenoma neveljaven oder
    const r = advancePipeline("NIKDORE", FULL_PATH);
    expect(r.ok).toBe(false);
    expect(r.unmet).toBe("stage");
  });
});
