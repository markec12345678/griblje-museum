import { describe, expect, test, spyOn } from "bun:test";
import {
  logEvent,
  correlationIdOf,
  recordError,
  errorSnapshot,
  type ErrorKind,
} from "../src/lib/obs";

// --- Strukturirano beleženje (#27/V) ------------------------------------------

describe("obs: structured logging", () => {
  test("logEvent izpiše ENO vrstico veljavnega JSON z ts/scope/level/msg", () => {
    const lines: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0]));
    });
    try {
      logEvent("test-scope", "info", "dogodek se je zgodil", { key: "vrednost" });
    } finally {
      spy.mockRestore();
    }
    expect(lines.length).toBe(1);
    const parsed = JSON.parse(lines[0]) as Record<string, unknown>;
    expect(parsed.scope).toBe("test-scope");
    expect(parsed.level).toBe("info");
    expect(parsed.msg).toBe("dogodek se je zgodil");
    expect(typeof parsed.ts).toBe("string");
    expect((parsed.meta as Record<string, unknown>).key).toBe("vrednost");
  });

  test("error nivo gre na console.error (zbirni kanal)", () => {
    const lines: string[] = [];
    const spy = spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0]));
    });
    try {
      logEvent("s", "error", "napaka brez osebnih podatkov");
    } finally {
      spy.mockRestore();
    }
    expect(lines.length).toBe(1);
    expect(JSON.parse(lines[0]).level).toBe("error");
  });

  test("meta ni obvezen (brez undefined v JSON-u)", () => {
    const lines: string[] = [];
    const spy = spyOn(console, "log").mockImplementation((...args: unknown[]) => {
      lines.push(String(args[0]));
    });
    try {
      logEvent("s", "warn", "samo sporočilo");
    } finally {
      spy.mockRestore();
    }
    expect((JSON.parse(lines[0]) as Record<string, unknown>).meta).toBeUndefined();
  });
});

// --- Correlation ID -------------------------------------------------------------

describe("obs: correlation ID", () => {
  test("uporabi veljaven x-request-id iz glave", () => {
    const req = new Request("https://test.local", {
      headers: { "x-request-id": "trace-abc-123" },
    });
    expect(correlationIdOf(req)).toBe("trace-abc-123");
  });

  test("brez glave ustvari UUID; preko dolga/čudna glava se zavrne", () => {
    const fresh = correlationIdOf(new Request("https://test.local"));
    expect(fresh).toMatch(/^[0-9a-f-]{36}$/);
    const evil = correlationIdOf(
      new Request("https://test.local", { headers: { "x-request-id": "x".repeat(300) } })
    );
    expect(evil).toMatch(/^[0-9a-f-]{36}$/);
  });
});

// --- Števci napak ----------------------------------------------------------------

describe("obs: error counters", () => {
  test("recordError poveča števec in snapshot ga odraža", () => {
    const kind: ErrorKind = "tts";
    const before = errorSnapshot()[kind];
    recordError(kind);
    recordError(kind);
    const after = errorSnapshot()[kind];
    expect(after).toBe(before + 2);
    // snapshot je kopija — mutiranje števcev ne spreminja starega posnetka
    const snap = errorSnapshot();
    recordError(kind);
    expect(snap[kind]).toBe(after);
  });
});
