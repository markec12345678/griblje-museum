/**
 * ENOTNI + INTEGRACIJSKI TESTI — globalna kvota (rateLimitedGlobal).
 *
 * Pokritje:
 *  1. pomnilniški način (privzeto): enakovreden rateLimited,
 *  2. postgres način z vbrizgano shrambo: drseče okno po tabeli,
 *  3. prag je enak pomnilniškemu pravilu (blokada na kvota+1),
 *  4. padec baze → pomnilniška varovalka, brez metanja napake v ruta,
 *  5. integracija z Prismo (samo ob pravi PostgreSQL povezavi, sicer skip).
 *
 * Zagon: bun test tests/rate-limit-global.test.ts
 */
import { afterAll, describe, expect, test } from "bun:test";
import {
  RATE_RULES,
  rateLimited,
  rateLimitedGlobal,
  type RateLimitDeps,
} from "../src/lib/rate-limit";

/* --- Naključna shramba v pomnilniku (za enotne teste) ---------------------- */

function fakeDeps(): RateLimitDeps & { rows: { scope: string; bucket: string; hitAt: Date }[] } {
  const rows: { scope: string; bucket: string; hitAt: Date }[] = [];
  return {
    rows,
    recordHit: async (scope, bucket, hitAt) => {
      rows.push({ scope, bucket, hitAt });
    },
    countHits: async (scope, bucket, since) =>
      rows.filter((r) => r.scope === scope && r.bucket === bucket && r.hitAt >= since).length,
    deleteStale: async (olderThan) => {
      for (let i = rows.length - 1; i >= 0; i -= 1) {
        if (rows[i]!.hitAt < olderThan) rows.splice(i, 1);
      }
    },
  };
}

describe("rate limit global — pomnilniški način (privzeto)", () => {
  test("brez RATE_LIMIT_STORE je enakovreden rateLimited", async () => {
    const rule = RATE_RULES.tts;
    const ip = "test-global-memory-1";
    for (let i = 0; i < rule.count; i += 1) {
      expect(await rateLimitedGlobal("tts", ip, Date.now(), { store: "memory" })).toBe(false);
    }
    expect(await rateLimitedGlobal("tts", ip, Date.now(), { store: "memory" })).toBe(true);
  });
});

describe("rate limit global — postgres način (vbrizgana shramba)", () => {
  test("drseče okno po tabeli; blokada pri kvota+1", async () => {
    const deps = fakeDeps();
    const rule = RATE_RULES.guide;
    const now = Date.now();
    const ip = "test-global-pg-1";
    for (let i = 0; i < rule.count; i += 1) {
      const blocked = await rateLimitedGlobal("guide", ip, now, { store: "postgres", deps });
      expect(blocked).toBe(false);
    }
    // naslednji zadetek preseže kvoto
    expect(await rateLimitedGlobal("guide", ip, now, { store: "postgres", deps })).toBe(true);
    expect(deps.rows.length).toBe(rule.count + 1);
  });

  test("zadetki pred oknom se ne štejejo", async () => {
    const deps = fakeDeps();
    const rule = RATE_RULES.guide;
    const ip = "test-global-pg-2";
    const past = Date.now() - rule.windowMs - 1000;
    for (let i = 0; i < rule.count; i += 1) {
      await rateLimitedGlobal("guide", ip, past, { store: "postgres", deps });
    }
    expect(await rateLimitedGlobal("guide", ip, Date.now(), { store: "postgres", deps })).toBe(
      false,
    );
  });

  test("vedra so neodvisna po IP", async () => {
    const deps = fakeDeps();
    const rule = RATE_RULES.guide;
    const now = Date.now();
    for (let i = 0; i < rule.count; i += 1) {
      await rateLimitedGlobal("guide", "test-global-pg-a", now, { store: "postgres", deps });
    }
    expect(
      await rateLimitedGlobal("guide", "test-global-pg-b", now, { store: "postgres", deps }),
    ).toBe(false);
  });

  test("padec baze → pomnilniška varovalka, brez napake", async () => {
    const failing: RateLimitDeps = {
      recordHit: async () => {
        throw new Error("db down");
      },
      countHits: async () => {
        throw new Error("db down");
      },
      deleteStale: async () => undefined,
    };
    const rule = RATE_RULES.tts;
    const ip = "test-global-dbdown-1";
    // prvi klic: baza pade → pomnilniško vedro je prazno → dovoljeno
    expect(await rateLimitedGlobal("tts", ip, Date.now(), { store: "postgres", deps: failing })).toBe(
      false,
    );
    // izčrpaj pomnilniško kvoto — varovalka se zapre tudi ob padi baze
    for (let i = 0; i < rule.count; i += 1) {
      await rateLimitedGlobal("tts", ip, Date.now(), { store: "postgres", deps: failing });
    }
    expect(await rateLimitedGlobal("tts", ip, Date.now(), { store: "postgres", deps: failing })).toBe(
      true,
    );
    // in res: običajen pomnilniški limiter je ta zadetki zabeležil
    expect(rateLimited("tts", ip)).toBe(true);
  });
});

/* --- Integracija s Prismo (samo ob pravi PostgreSQL povezavi) -------------- */

/* Peskovniška varovalka (isti vzorec kot tests/database-governance.test.ts):
 * brez prave postgres povezave se integracijski test preskoči. */
const HAS_POSTGRES = (process.env.DATABASE_URL ?? "").startsWith("postgres");

describe.skipIf(!HAS_POSTGRES)("rate limit global — integracija s Prismo", () => {
  const bucket = `test-rate-limit-global-${Date.now()}`;

  afterAll(async () => {
    // testne vrstice počistimo (realna baza, realna tabela)
    const { db } = await import("../src/lib/db");
    await db.rateLimitHit.deleteMany({ where: { bucket } });
  });

  test("zabeleži in prešteje zadetke v pravi tabeli", async () => {
    const rule = RATE_RULES.guide;
    const now = Date.now();
    for (let i = 0; i < 3; i += 1) {
      const blocked = await rateLimitedGlobal("guide", bucket, now, { store: "postgres" });
      expect(blocked).toBe(false);
    }
    // neodvisno preverimo stanje tabele
    const { db } = await import("../src/lib/db");
    const count = await db.rateLimitHit.count({
      where: { scope: "guide", bucket, hitAt: { gte: new Date(now - rule.windowMs) } },
    });
    expect(count).toBe(3);
  });
});
