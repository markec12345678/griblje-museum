import { describe, expect, test } from "bun:test";
import {
  canTransition,
  canAct,
  isEditorialAuthorized,
  snapshotOfExhibit,
  snapshotDiff,
  applyPatch,
  exhibitPatchSchema,
  exhibitSnapshotSchema,
  sourcePatchSchema,
  snapshotOfSource,
  VERSION_ACTIONS,
} from "../src/lib/editorial";

// --- Workflow: dovoljeni prehodi (#27/C3) ---------------------------------

describe("editorial workflow transitions", () => {
  test("srečna pot DRAFT → REVIEW → APPROVED → PUBLISHED je dovoljena", () => {
    expect(canTransition("DRAFT", "REVIEW")).toBe(true);
    expect(canTransition("REVIEW", "APPROVED")).toBe(true);
    expect(canTransition("APPROVED", "PUBLISHED")).toBe(true);
    expect(canAct("APPROVED", "publish")).toBe(true);
  });

  test("preskok pregleda (DRAFT → PUBLISHED) ni dovoljen", () => {
    expect(canTransition("DRAFT", "PUBLISHED")).toBe(false);
    expect(canAct("DRAFT", "publish")).toBe(false);
    expect(canAct("REVIEW", "publish")).toBe(false);
  });

  test("objavljena verzija ni več urejanljiva (samo arhiv)", () => {
    expect(canTransition("PUBLISHED", "REVIEW")).toBe(false);
    expect(canTransition("PUBLISHED", "DRAFT")).toBe(false);
    expect(canTransition("PUBLISHED", "REJECTED")).toBe(false);
    expect(canTransition("PUBLISHED", "ARCHIVED")).toBe(true);
  });

  test("zavrnjena verzija se lahko vrne v DRAFT ali gre v arhiv", () => {
    expect(canTransition("REJECTED", "DRAFT")).toBe(true);
    expect(canTransition("REJECTED", "ARCHIVED")).toBe(true);
    expect(canTransition("REJECTED", "PUBLISHED")).toBe(false);
  });

  test("arhiv je terminalni status", () => {
    expect(canTransition("ARCHIVED", "DRAFT")).toBe(false);
    expect(canTransition("ARCHIVED", "REVIEW")).toBe(false);
    expect(canTransition("ARCHIVED", "PUBLISHED")).toBe(false);
  });

  test("akcije se preslikajo v prave ciljne status", () => {
    expect(VERSION_ACTIONS.submit).toBe("REVIEW");
    expect(VERSION_ACTIONS.approve).toBe("APPROVED");
    expect(VERSION_ACTIONS.reject).toBe("REJECTED");
    expect(VERSION_ACTIONS.publish).toBe("PUBLISHED");
    expect(VERSION_ACTIONS.archive).toBe("ARCHIVED");
    expect(VERSION_ACTIONS["return-to-draft"]).toBe("DRAFT");
  });
});

// --- Avtorizacija (deljeni uredniški žeton) --------------------------------

describe("editorial authorization", () => {
  test("brez EDITORIAL_TOKEN ni avtorizacije (API ostane zaprt)", () => {
    const prev = process.env.EDITORIAL_TOKEN;
    delete process.env.EDITORIAL_TOKEN;
    try {
      const req = new Request("https://test.local/api/versions", {
        headers: { "x-editorial-token": "karkoli" },
      });
      expect(isEditorialAuthorized(req)).toBe(false);
    } finally {
      if (prev !== undefined) process.env.EDITORIAL_TOKEN = prev;
    }
  });

  test("pravilen žeton avtorizira, napačen ne", () => {
    const prev = process.env.EDITORIAL_TOKEN;
    process.env.EDITORIAL_TOKEN = "skrivni-zeton-123";
    try {
      const ok = new Request("https://test.local", {
        headers: { "x-editorial-token": "skrivni-zeton-123" },
      });
      const bad = new Request("https://test.local", {
        headers: { "x-editorial-token": "skrivni-zeton-124" },
      });
      const missing = new Request("https://test.local");
      expect(isEditorialAuthorized(ok)).toBe(true);
      expect(isEditorialAuthorized(bad)).toBe(false);
      expect(isEditorialAuthorized(missing)).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.EDITORIAL_TOKEN;
      else process.env.EDITORIAL_TOKEN = prev;
    }
  });
});

// --- Snapshot zapisa (celovit posnetek, rekonstruiranje #27/C1) ------------

const BASE = {
  slug: "mvg-001",
  museumNo: "MVG-001",
  category: "kraj",
  titleSi: "Vas Griblje",
  titleEn: "Village of Griblje",
  periodSi: "od 14. stoletja",
  periodEn: "since the 14th century",
  summarySi: "Kratek povzetek.",
  summaryEn: "Short summary.",
  storySi: "Dolga zgodba.",
  storyEn: "Long story.",
  evidenceStatus: "DOCUMENTED",
  image: null as string | null,
  imageCredit: null as string | null,
  model3dUrl: null as string | null,
  model3dCredit: null as string | null,
  yearFrom: 1300,
  yearTo: null as number | null,
  lat: 45.5,
  lng: 15.2,
  coordsApprox: false,
  featured: false,
  sortOrder: 0,
};

describe("exhibit snapshot", () => {
  test("snapshot zajame vsa urejanljiva polja, ne pa identitete", () => {
    const snap = snapshotOfExhibit(BASE);
    expect(Object.keys(snap).length).toBe(20);
    expect(snap.titleSi).toBe("Vas Griblje");
    expect((snap as Record<string, unknown>).slug).toBeUndefined();
    expect((snap as Record<string, unknown>).museumNo).toBeUndefined();
    expect((snap as Record<string, unknown>).category).toBeUndefined();
  });

  test("snapshotDiff zazna spremenjena polja", () => {
    const snap = snapshotOfExhibit(BASE);
    const next = applyPatch(snap, { titleSi: "Griblje", yearFrom: 1400 });
    const diff = snapshotDiff(snap, next);
    expect(diff.sort()).toEqual(["titleSi", "yearFrom"]);
  });

  test("patch z neznanim poljem je zavrnjen (strict — brez puščanja)", () => {
    const result = exhibitPatchSchema.safeParse({ slug: "hacker-slug" });
    expect(result.success).toBe(false);
  });

  test("patch z neveljavnim evidenceStatus je zavrnjen", () => {
    const result = exhibitPatchSchema.safeParse({ evidenceStatus: "MADE_UP" });
    expect(result.success).toBe(false);
    const ok = exhibitPatchSchema.safeParse({ evidenceStatus: "TO_COLLECT" });
    expect(ok.success).toBe(true);
  });

  test("celoten snapshot mora preiti validacijo objave", () => {
    const snap = snapshotOfExhibit(BASE);
    const result = exhibitSnapshotSchema.safeParse(snap);
    expect(result.success).toBe(true);
  });

  test("patch brez polj ne spremeni snapshot-a", () => {
    const snap = snapshotOfExhibit(BASE);
    const next = applyPatch(snap, {});
    expect(snapshotDiff(snap, next)).toEqual([]);
  });
});

// --- Snapshot vira (pravice v snapshotu, #27/C2 + F) ------------------------

describe("source snapshot", () => {
  test("snapshot vira zajame tudi pravice", () => {
    const source = {
      nameSi: "Krajevni leksikon 1937",
      nameEn: "Local Lexicon 1937",
      sourceType: "objava",
      license: "Public domain",
      url: "https://dlib.si/…",
      noteSi: null,
      noteEn: null,
      creator: null,
      copyrightHolder: null,
      licenseUrl: null,
      permissionToPublish: "UNKNOWN",
      permissionToModify: "UNKNOWN",
      commercialUse: "UNKNOWN",
      attribution: null,
      restrictions: null,
    };
    const snap = snapshotOfSource(source);
    expect(snap.permissionToPublish).toBe("UNKNOWN");
    expect(snap.commercialUse).toBe("UNKNOWN");

    const next = applyPatch(snap as unknown as Record<string, unknown>, {
      permissionToPublish: "GRANTED",
    });
    const diff = sourcePatchSchema.safeParse({ permissionToPublish: "GRANTED" });
    expect(diff.success).toBe(true);
    expect(next.permissionToPublish).toBe("GRANTED");
  });

  test("neznano polje v patch-u vira je zavrnjeno", () => {
    const result = sourcePatchSchema.safeParse({ permissionEvidence: "internal-doc" });
    expect(result.success).toBe(false);
  });
});
