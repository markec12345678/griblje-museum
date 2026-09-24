/**
 * Skupna omejitev hitrosti (issue #27, točka J).
 *
 * Eden sam drsečeokenski limiter za vse strežniške poti, ki jih varujejo
 * kvote (prej: 4 kopije istega vzorca raztresene po guide.ts,
 * contributions.ts in audio-guide ruti — vsaka z lastnim Map in lastnim
 * clientIp razčlenjevalnikom):
 *
 *   | pot                    | pravilo      | zakaj                          |
 *   |------------------------|--------------|--------------------------------|
 *   | AI kustos (/api/guide) | 12 / 10 min  | strošek modela                 |
 *   | prispevki (guestbook,  | 5 / 10 min   | spam počasneje, kot piše roka  |
 *   | memories)              |              |                                |
 *   | TTS sinteza (audio-    | 30 / 5 min   | mesečni kredit ponudnika       |
 *   | guide, samo hladni)    |              |                                |
 *
 * Obseg pomnilnika: strežniško-primerek (razvoj, Vercel funkcija). V
 * serverless okolju je kvota razpetih primerkov vsota kvot primerkov —
 * izrecno dokumentirano omejitev; nadaljnja razširitev (skupna baza kvot)
 * bi bila ločen infrastrukturni korak, ne te module.
 *
 * Puščanje pomnilnika: vedra brez zadetkov v oknu se ob vzdrževalnem
 * pragu izločijo (stare implementacije so vedra hranile večno).
 */

/** Pravilo: dovoljeno število zadetkov v drsečem oknu. */
export type RateRule = { readonly count: number; readonly windowMs: number };

/** Imenovana pravila — enoten vir resnice za kode in dokumentacijo. */
export const RATE_RULES = {
  /** AI kustos (src/app/api/guide). */
  guide: { count: 12, windowMs: 10 * 60 * 1000 } as const satisfies RateRule,
  /** Prispevki skupnosti: spominska knjiga + spomini ob predmetih. */
  contributions: { count: 5, windowMs: 10 * 60 * 1000 } as const satisfies RateRule,
  /** Dejavna TTS sinteza (samo hladni klici — ogreto predvajanje ni omejeno). */
  tts: { count: 30, windowMs: 5 * 60 * 1000 } as const satisfies RateRule,
  /** Prijave neprimernih prispevkov (moderation/report). */
  reports: { count: 5, windowMs: 10 * 60 * 1000 } as const satisfies RateRule,
} as const;

export type RateScope = keyof typeof RATE_RULES;

/** Vedra: scope → ip → zadetki (časovni žigi v oknu). */
const buckets = new Map<RateScope, Map<string, number[]>>();

/** Prag vzdrževanja: ko skupno število ključev preseže mejo, izločimo
 * vedra, katerih zadnji zadetek je starejši od okna svojega pravila. */
const MAINTENANCE_THRESHOLD = 2000;

function pruneStale(): void {
  for (const [scope, perIp] of buckets) {
    if (perIp.size < MAINTENANCE_THRESHOLD) continue;
    const { windowMs } = RATE_RULES[scope];
    const now = Date.now();
    for (const [ip, hits] of perIp) {
      const last = hits[hits.length - 1];
      if (last === undefined || now - last >= windowMs) perIp.delete(ip);
    }
  }
}

/**
 * Zabeleži zadetek in vrne true, če je kvota za ta IP že porabljena.
 * (Drseče okno: štejejo se samo zadetki znotraj windowMs pred zdaj.)
 */
export function rateLimited(scope: RateScope, ip: string, now = Date.now()): boolean {
  const rule = RATE_RULES[scope];
  let perIp = buckets.get(scope);
  if (!perIp) {
    perIp = new Map();
    buckets.set(scope, perIp);
  }
  const hits = (perIp.get(ip) ?? []).filter((t) => now - t < rule.windowMs);
  if (hits.length >= rule.count) {
    perIp.set(ip, hits);
    return true;
  }
  hits.push(now);
  perIp.set(ip, hits);
  if (perIp.size >= MAINTENANCE_THRESHOLD) pruneStale();
  return false;
}

/** IP iz glav zahteve (x-forwarded-for na proxy-ju, sicer "local"). */
export function clientIpOf(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}
