import { describe, expect, test } from "bun:test";
import {
  canModerate,
  MODERATION_TARGETS,
  MODERATION_TRANSITIONS,
  isModerationAuthorized,
  REPORT_HIDE_THRESHOLD,
  type ModerationStatus,
} from "../src/lib/moderation";

// --- Moderacijska matrika (#27/G) -------------------------------------------

describe("moderation workflow", () => {
  test("approve: pending/hidden/rejected → published", () => {
    expect(MODERATION_TARGETS.approve).toBe("published");
    for (const from of ["pending", "hidden", "rejected"] as ModerationStatus[]) {
      expect(canModerate(from, "approve")).toBe(true);
    }
    expect(canModerate("deleted", "approve")).toBe(false);
    expect(canModerate("published", "approve")).toBe(false);
  });

  test("hide: samo vidna vsebina se lahko skrije", () => {
    expect(canModerate("published", "hide")).toBe(true);
    expect(canModerate("pending", "hide")).toBe(true);
    expect(canModerate("hidden", "hide")).toBe(false);
    expect(canModerate("rejected", "hide")).toBe(false);
    expect(canModerate("deleted", "hide")).toBe(false);
  });

  test("restore: skrito/zavrnjeno → published", () => {
    expect(MODERATION_TARGETS.restore).toBe("published");
    expect(canModerate("hidden", "restore")).toBe(true);
    expect(canModerate("rejected", "restore")).toBe(true);
    expect(canModerate("pending", "restore")).toBe(false);
    expect(canModerate("published", "restore")).toBe(false);
  });

  test("reject: ni mogoč nad deleted", () => {
    expect(canModerate("deleted", "reject")).toBe(false);
    expect(canModerate("pending", "reject")).toBe(true);
  });

  test("soft-delete: iz vseh vidnih/čakajočih statusov, ne ponovno", () => {
    expect(MODERATION_TARGETS["soft-delete"]).toBe("deleted");
    for (const from of ["pending", "published", "rejected", "hidden"] as ModerationStatus[]) {
      expect(canModerate(from, "soft-delete")).toBe(true);
    }
    expect(canModerate("deleted", "soft-delete")).toBe(false);
  });

  test("vsaka akcija ima definiran prehod (brez luknji v matriki)", () => {
    const actions = Object.keys(MODERATION_TRANSITIONS);
    expect(actions.sort()).toEqual(
      ["approve", "hide", "reject", "restore", "soft-delete"].sort()
    );
  });
});

// --- Avtorizacija ------------------------------------------------------------

describe("moderation authorization", () => {
  test("brez MODERATION_TOKEN ni dostopa", () => {
    const prev = process.env.MODERATION_TOKEN;
    delete process.env.MODERATION_TOKEN;
    try {
      const req = new Request("https://test.local", {
        headers: { "x-moderation-token": "karkoli" },
      });
      expect(isModerationAuthorized(req)).toBe(false);
    } finally {
      if (prev !== undefined) process.env.MODERATION_TOKEN = prev;
    }
  });

  test("pravilen žeton avtorizira", () => {
    const prev = process.env.MODERATION_TOKEN;
    process.env.MODERATION_TOKEN = "mod-token-42";
    try {
      const ok = new Request("https://test.local", {
        headers: { "x-moderation-token": "mod-token-42" },
      });
      const bad = new Request("https://test.local", {
        headers: { "x-moderation-token": "napacen" },
      });
      expect(isModerationAuthorized(ok)).toBe(true);
      expect(isModerationAuthorized(bad)).toBe(false);
    } finally {
      if (prev === undefined) delete process.env.MODERATION_TOKEN;
      else process.env.MODERATION_TOKEN = prev;
    }
  });
});

// --- Prag prijav --------------------------------------------------------------

describe("report threshold", () => {
  test("prag je 3 prijave za samodejno skritje", () => {
    expect(REPORT_HIDE_THRESHOLD).toBe(3);
  });
});
