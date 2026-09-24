import { describe, expect, test } from "bun:test";
import { withAiFlag, type CuratorClaimView } from "../src/lib/curator-claims";
import type { ClaimDTO } from "../src/lib/claims";

// --- AI veriga dokaza (#27/K) — preslikava trditev → pogled kustosa ---------

function dto(overrides: Partial<ClaimDTO>): ClaimDTO {
  return {
    id: "c-1",
    statement: "Šola v Gribljem ustanovljena 1889",
    lang: "sl",
    evidenceStatus: "DOCUMENTED",
    confidence: "HIGH",
    pageRef: "str. 129",
    version: 1,
    citation: { kind: "source", name: "Krajevni leksikon 1937", url: "https://…", reference: "str. 129" },
    ...overrides,
  };
}

describe("curator claims — aiMayPresentAsFact", () => {
  test("PUBLISHED DOCUMENTED z virom: AI sme kot dejstvo", () => {
    const view: CuratorClaimView = withAiFlag(dto({}));
    expect(view.aiMayPresentAsFact).toBe(true);
  });

  test("CORROBORATED z virom: AI sme kot dejstvo", () => {
    expect(withAiFlag(dto({ evidenceStatus: "CORROBORATED" })).aiMayPresentAsFact).toBe(true);
  });

  test("TESTIMONY/TRADITION/TO_COLLECT: NIKOLI kot dejstvo — status viden", () => {
    for (const status of ["TESTIMONY", "TRADITION", "TO_COLLECT", "UNVERIFIED"] as const) {
      const view = withAiFlag(dto({ evidenceStatus: status }));
      expect(view.aiMayPresentAsFact).toBe(false);
      expect(view.evidenceStatus).toBe(status); // status ostane viden, ne izgubljen
    }
  });

  test("tudi DOCUMENTED brez citacije: AI NE sme kot dejstvo", () => {
    const view = withAiFlag(dto({ citation: { kind: null, name: null, url: null, reference: null } }));
    expect(view.aiMayPresentAsFact).toBe(false);
  });
});
