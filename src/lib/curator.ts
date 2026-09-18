/**
 * AI KUSTOS — orkestrator dokaznega poteka.
 * (41. sklop / TASK 41)
 *
 *     vprašanje → razrešitev (BREZ modela) → [guard: dovolj dokaza?]
 *       NE  → deterministična zavrnitev insufficient_evidence + najbližji zapisi
 *       DA  → MuseumAIProvider.answer (LLM sinteza, ZADNJA plast)
 *           → preverba navedkov (verifyAnswer) → obogaten CuratorResult
 *
 * Zasebnost: pogovorov NE shranjujemo. Enolična izjema je predpomnilnik
 * vprašanj (anonimno, 24 h, max 120) — enako načelo kot pri vodniku,
 * ker si obiskovalji zastavljajo presenetljivo podobna vprašanja.
 */

import { seedExhibits } from "@/lib/museum-content";
import { museumAIProvider } from "@/lib/curator-provider";
import {
  buildContext,
  contextHasEvidence,
  normalizeQuestion,
  type RetrievalTrace,
} from "@/lib/curator-retrieval";
import type {
  AIAnswer,
  AIContext,
  CuratorLang,
  CuratorResult,
  CuratorSourceView,
  MuseumAIProvider,
} from "@/lib/curator-types";

/* --- Omejitev hitrosti (drseče okno, ločeno od vodnika) ----------------- */

type Bucket = { hits: number[] };
const RATE_BUCKETS = new Map<string, Bucket>();
/** 12 vprašanj na 10 minut na IP (na primerek strežnika). */
const RATE_LIMIT = { count: 12, windowMs: 10 * 60 * 1000 } as const;

export function curatorRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = RATE_BUCKETS.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < RATE_LIMIT.windowMs);
  if (bucket.hits.length >= RATE_LIMIT.count) {
    RATE_BUCKETS.set(ip, bucket);
    return true;
  }
  bucket.hits.push(now);
  RATE_BUCKETS.set(ip, bucket);
  return false;
}

/** IP iz glav zahteve (x-forwarded-for na proxy-ju, sicer »local«). */
export function curatorClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

/* --- Predpomnilnik (anonimno, 24 h, max 120) ----------------------------- */

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_MAX = 120;
const KEY_MAX_CHARS = 200;

type CacheEntry = { at: number; result: CuratorResult };

const store = new Map<string, CacheEntry>();

function cacheKey(lang: CuratorLang, question: string): string | null {
  const normalized = normalizeQuestion(question);
  if (normalized.length < 4) return null;
  return `${lang}:${normalized.slice(0, KEY_MAX_CHARS)}`;
}

function cacheGet(key: string): CuratorResult | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    store.delete(key);
    return null;
  }
  store.delete(key);
  store.set(key, hit);
  return hit.result;
}

function cacheSet(key: string, result: CuratorResult): void {
  if (store.size >= CACHE_MAX) {
    const oldest = store.keys().next().value;
    if (oldest !== undefined) store.delete(oldest);
  }
  store.set(key, { at: Date.now(), result });
}

/* --- Obogatitev odgovora za prikaz ---------------------------------------- */

function sourceViewsOf(
  answer: AIAnswer,
  context: AIContext,
): CuratorSourceView[] {
  const views: CuratorSourceView[] = [];
  const seen = new Set<string>();
  for (const v of answer.viri) {
    const exhibit = seedExhibits.find((e) => e.slug === v.slug);
    if (!exhibit) continue;
    const idx = v.sourceIndex ?? 0;
    const row = exhibit.sources[idx] ?? exhibit.sources[0];
    if (!row) continue;
    const key = `${v.slug}#${idx}`;
    if (seen.has(key)) continue;
    seen.add(key);
    views.push({
      slug: exhibit.slug,
      museumNo: exhibit.museumNo ?? null,
      titleSi: exhibit.titleSi,
      titleEn: exhibit.titleEn,
      sourceIndex: v.sourceIndex ?? null,
      sourceKey: context.provided.get(v.slug)?.sources[idx]?.sourceKey ?? null,
      sourceNameSi: row.nameSi,
      sourceNameEn: row.nameEn,
      sourceUrl: row.url ?? null,
    });
  }
  return views;
}

function suggestionsOf(trace: RetrievalTrace): CuratorResult["suggestions"] {
  const out: CuratorResult["suggestions"] = [];
  for (const near of trace.nearest) {
    const exhibit = seedExhibits.find((e) => e.slug === near.slug);
    if (!exhibit) continue;
    out.push({
      slug: exhibit.slug,
      museumNo: exhibit.museumNo ?? null,
      titleSi: exhibit.titleSi,
      titleEn: exhibit.titleEn,
    });
  }
  return out;
}

/* --- GLAVNA FUNKCIJA -------------------------------------------------------- */

export async function askCurator(
  lang: CuratorLang,
  question: string,
  provider: MuseumAIProvider = museumAIProvider(),
): Promise<CuratorResult> {
  const key = cacheKey(lang, question);
  if (key) {
    const cached = cacheGet(key);
    if (cached) return { ...cached, cached: true };
  }

  const { context, trace } = buildContext(lang, question);

  // HALLUCINATION GUARD, pred klicem modela: brez dokaza ni sinteze.
  if (!contextHasEvidence(context)) {
    const result: CuratorResult = {
      answerable: false,
      reason: "insufficient_evidence",
      queryType: trace.queryType,
      kajVemo: [],
      kakoVemo: [],
      viri: [],
      opomba: null,
      entities: trace.matchedEntities.map((e) => ({
        id: e.id,
        type: e.type,
        labelSi: e.labelSi,
        labelEn: e.labelEn,
      })),
      suggestions: suggestionsOf(trace),
      cached: false,
    };
    if (key) cacheSet(key, result);
    return result;
  }

  let answer: AIAnswer;
  try {
    answer = await provider.answer(context, question);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    // Model je odgovarjal, a dvakrat ni zmogel preverljivega JSON —
    // odkrito povej, da sinteza ni na voljo (ne izmišljuj).
    if (/dvakrat ni vrnil preverljivega JSON/.test(msg)) {
      const result: CuratorResult = {
        answerable: false,
        reason: "synthesis-unavailable",
        queryType: trace.queryType,
        kajVemo: [],
        kakoVemo: [],
        viri: [],
        opomba: null,
        entities: trace.matchedEntities.map((e) => ({
          id: e.id,
          type: e.type,
          labelSi: e.labelSi,
          labelEn: e.labelEn,
        })),
        suggestions: suggestionsOf(trace),
        cached: false,
      };
      return result;
    }
    throw error;
  }

  const result: CuratorResult = {
    answerable: answer.answerable,
    reason: answer.reason,
    queryType: trace.queryType,
    kajVemo: answer.kajVemo,
    kakoVemo: answer.kakoVemo,
    viri: sourceViewsOf(answer, context),
    opomba: answer.opomba,
    entities: trace.matchedEntities.map((e) => ({
      id: e.id,
      type: e.type,
      labelSi: e.labelSi,
      labelEn: e.labelEn,
    })),
    suggestions: answer.answerable ? [] : suggestionsOf(trace),
    cached: false,
  };

  if (key) cacheSet(key, result);
  return result;
}
