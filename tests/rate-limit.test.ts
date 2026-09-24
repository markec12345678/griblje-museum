/**
 * ENOTNI TESTI — skupna omejitev hitrosti (issue #27, točka J).
 *
 * Pokritje:
 *  1. drseče okno: dovoljeni zadetki do kvote, nato zavračanje,
 *  2. neodvisnost scopa (guide ne porabi contributions kvote in obratno),
 *  3. neodvisnost IP (drugi IP ima svojo kvoto),
 *  4. okno poteče: zadetki pred windowMs se štejejo znova kot prosti,
 *  5. izolacija pravil iz RATE_RULES (vrednosti ustrezajo dokumentaciji).
 *
 * Zagon: bun test tests/rate-limit.test.ts
 */
import { describe, expect, test } from "bun:test";
import { clientIpOf, RATE_RULES, rateLimited } from "../src/lib/rate-limit";

/** Naredi zahtevo z x-forwarded-for glavo — kot za proxy. */
function requestFrom(ip: string): Request {
  return new Request("https://griblje-museum.si/api", { headers: { "x-forwarded-for": ip } });
}

describe("rate limit — drseče okno", () => {
  test("dovoli zadetke do kvote, nato zavrača", () => {
    const rule = RATE_RULES.contributions;
    const ip = "test-dovoli-1";
    for (let i = 0; i < rule.count; i += 1) {
      expect(rateLimited("contributions", ip)).toBe(false);
    }
    expect(rateLimited("contributions", ip)).toBe(true);
    expect(rateLimited("contributions", ip)).toBe(true); // še vedno zavrnjeno
  });

  test("scopi so neodvisni (guide ≠ contributions ≠ tts)", () => {
    const ip = "test-scopi-1";
    for (let i = 0; i < RATE_RULES.guide.count; i += 1) {
      rateLimited("guide", ip);
    }
    expect(rateLimited("guide", ip)).toBe(true); // guide črpa
    expect(rateLimited("contributions", ip)).toBe(false); // prispevki še imajo kvoto
    expect(rateLimited("tts", ip)).toBe(false);
  });

  test("IP-ji so neodvisni", () => {
    const a = "test-ip-a";
    const b = "test-ip-b";
    for (let i = 0; i < RATE_RULES.guide.count; i += 1) {
      rateLimited("guide", a);
    }
    expect(rateLimited("guide", a)).toBe(true);
    expect(rateLimited("guide", b)).toBe(false);
  });

  test("zadetki pred oknom ne štejejo (potečeno vedro se znova napolni)", () => {
    const rule = RATE_RULES.tts;
    const ip = "test-okno-1";
    const past = Date.now() - rule.windowMs - 1000;
    for (let i = 0; i < rule.count; i += 1) {
      rateLimited("tts", ip, past);
    }
    // vse stari zadetki so zunaj okna → nov zadetek je prost
    expect(rateLimited("tts", ip)).toBe(false);
  });

  test("delni zadetki v oknu zmanjšajo preostalo kvoto", () => {
    const rule = RATE_RULES.guide;
    const ip = "test-delni-1";
    const recent = Date.now() - 1000; // znotraj okna
    for (let i = 0; i < rule.count - 1; i += 1) {
      rateLimited("guide", ip, recent);
    }
    // prvi klic s trenutnim časom je še prost (zadnji od treh), nato zaprt
    expect(rateLimited("guide", ip)).toBe(false);
    expect(rateLimited("guide", ip)).toBe(true);
  });
});

describe("rate limit — pravila in IP", () => {
  test("RATE_RULES ustrezajo dokumentiranim kvotam (#27/J)", () => {
    expect(RATE_RULES.guide).toEqual({ count: 12, windowMs: 10 * 60 * 1000 });
    expect(RATE_RULES.contributions).toEqual({ count: 5, windowMs: 10 * 60 * 1000 });
    expect(RATE_RULES.tts).toEqual({ count: 30, windowMs: 5 * 60 * 1000 });
  });

  test("clientIpOf: x-forwarded-for prvi skok, x-real-ip, sicer local", () => {
    expect(clientIpOf(requestFrom("203.0.113.7, 10.0.0.1"))).toBe("203.0.113.7");
    expect(
      clientIpOf(new Request("https://x.si", { headers: { "x-real-ip": "198.51.100.9" } }))
    ).toBe("198.51.100.9");
    expect(clientIpOf(new Request("https://x.si"))).toBe("local");
  });
});
