/**
 * Observability (issue #27/V) — strukturirano beleženje + števci napak.
 *
 * Načela:
 *  - ENA vrstica = EN JSON dogodek (razčlenljivo za zbiranje logov);
 *  - correlation ID iz `x-request-id` (oz. nov UUID) — poveže API klic,
 *    log in Job (issue #27/W);
 *  - brez osebnih podatkov: v log NE gredo imena, vsebine prispevkov,
 *    IP-ji ali povezovalni nizi — samo identifikatorje in števce.
 *
 * Števci napak so in-pomnilniški na primerek (dobrodošel minimum za
 * demonstracijo; produkcija lahko zgolj priključi izvoz — vmesnik je
 * enoten prek /api/health).
 */

const ERROR_KINDS = ["db", "storage", "ai", "tts", "api", "moderation", "job"] as const;
export type ErrorKind = (typeof ERROR_KINDS)[number];

const errorCounters: Record<ErrorKind, number> = ERROR_KINDS.reduce(
  (acc, kind) => ({ ...acc, [kind]: 0 }),
  {} as Record<ErrorKind, number>
);

/** Poveča števec napak danega razreda. */
export function recordError(kind: ErrorKind): void {
  errorCounters[kind] += 1;
}

/** Trenutni posnetek števcev napak (za /api/health). */
export function errorSnapshot(): Record<ErrorKind, number> {
  return { ...errorCounters };
}

/** Correlation ID iz glave `x-request-id`, sicer nov UUID. */
export function correlationIdOf(request: Request): string {
  const fromHeader = request.headers.get("x-request-id");
  if (fromHeader && /^[A-Za-z0-9_.-]{1,128}$/.test(fromHeader)) return fromHeader;
  return crypto.randomUUID();
}

export type LogLevel = "info" | "warn" | "error";

/** Strukturiran dogodek — ena vrstica JSON na stderr/stdout. */
export function logEvent(
  scope: string,
  level: LogLevel,
  msg: string,
  meta?: Record<string, unknown>
): void {
  const event = {
    ts: new Date().toISOString(),
    scope,
    level,
    msg,
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(event);
  if (level === "error") console.error(line);
  else console.log(line);
}

/** Pripravljen meta objekt za API napake (brez osebnih podatkov). */
export function apiErrorMeta(correlationId: string, route: string, status: number) {
  return { correlationId, route, status };
}
