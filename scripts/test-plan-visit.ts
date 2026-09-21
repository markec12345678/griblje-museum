/**
 * TESTI — AI planiranje obiska (63. sklop / vrzel #4).
 * Deterministični preverbi: izbira postaj, pestrost, kronologija,
 * otroška prijaznost, preverba sinteze, fallback, predpomnilnik,
 * omejitev hitrosti. BREZ klicev modela.
 * Zagon: bun run scripts/test-plan-visit.ts
 */
import {
  buildVisitPlan,
  firstSentence,
  planCacheGet,
  planCacheKey,
  planCacheSet,
  planRateLimited,
  scoreExhibits,
  selectStops,
  stopBudget,
  verifySynthesis,
  type PlanInput,
  type PlanMinutes,
  type VisitPlan,
} from "../src/lib/plan-visit";
import { seedExhibits } from "../src/lib/museum-content";
import { WALKS } from "../src/lib/walks";
import type { ExhibitCategory } from "../src/lib/types";

let pass = 0;
let fail = 0;

function ok(cond: boolean, name: string): void {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}`);
  }
}

function input(overrides: Partial<PlanInput> = {}): PlanInput {
  return {
    lang: "sl",
    minutes: 30,
    interests: [],
    withKids: false,
    ...overrides,
  };
}

const catCount = (plan: VisitPlan, cat: ExhibitCategory) =>
  plan.stops.filter((s) => s.category === cat).length;

/* --- T1: časovni proračun ------------------------------------------------- */
console.log("T1: Časovni proračun (STOP_MINUTES=5)");
{
  const cases: [PlanMinutes, number][] = [
    [15, 3],
    [30, 6],
    [60, 12],
    [90, 14],
  ];
  for (const [m, n] of cases) {
    ok(stopBudget(m) === n, `T1.${m} → ${n} postaj`);
  }
}

/* --- T2: izbira postaj — veljavnost in dolžina ---------------------------- */
console.log("T2: Izbira postaj (veljavnost)");
{
  for (const m of [15, 30, 60, 90] as const) {
    const slugs = selectStops(input({ minutes: m }));
    const unique = new Set(slugs).size === slugs.length;
    const known = slugs.every((s) => seedExhibits.some((e) => e.slug === s));
    ok(slugs.length === stopBudget(m) && unique && known, `T2.${m} ${slugs.length} unikatnih znanih slugov`);
  }
}

/* --- T3: interesi vodijo izbor -------------------------------------------- */
console.log("T3: Interesi vodijo izbor");
{
  const slugs = selectStops(input({ minutes: 60, interests: ["vojna"] }));
  const vojna = slugs.filter((s) =>
    seedExhibits.find((e) => e.slug === s)?.category === "vojna",
  ).length;
  ok(vojna >= 9, `T3.1 vojna prevladuje (≥ 9/12): ${vojna}/${slugs.length}`);

  const naravaSlugs = selectStops(input({ minutes: 30, interests: ["narava"] }));
  const narava = naravaSlugs.filter(
    (s) => seedExhibits.find((e) => e.slug === s)?.category === "narava",
  ).length;
  ok(narava >= Math.min(6, 8), `T3.2 narava ≥ ${Math.min(6, 8)} (${narava}/6)`);
}

/* --- T4: otroški profil ----------------------------------------------------- */
console.log("T4: Otroški profil (withKids)");
{
  const kids = buildDetour(input({ minutes: 60, withKids: true }));
  const adults = buildDetour(input({ minutes: 60 }));
  ok(
    catCount(kids, "vojna") <= 3,
    `T4.1 vojna v otroškem načrtu ≤ 3 (${catCount(kids, "vojna")}, odrasli: ${catCount(adults, "vojna")})`,
  );
  const friendly = kids.stops.filter((s) =>
    ["narava", "sege", "kolpa", "gospodarstvo"].includes(s.category),
  ).length;
  ok(friendly > 0, `T4.2 otroku prijaznih postaj > 0 (${friendly})`);
}
/** Sinhrona ovitek za deterministične preverbe izbire (brez sinteze). */
function buildDetour(inp: PlanInput): VisitPlan {
  const slugs = selectStops(inp);
  const bySlug = new Map(seedExhibits.map((e) => [e.slug, e]));
  const layer: "sl" | "en" = inp.lang === "sl" || inp.lang === "hr" ? "sl" : "en";
  return {
    intro: "",
    totalMinutes: slugs.length * 5,
    tip: null,
    synthesized: false,
    stops: slugs.flatMap((slug) => {
      const ex = bySlug.get(slug);
      if (!ex) return [];
      return [
        {
          slug: ex.slug,
          museumNo: ex.museumNo ?? null,
          titleSi: ex.titleSi,
          titleEn: ex.titleEn,
          periodSi: ex.periodSi,
          periodEn: ex.periodEn,
          category: ex.category,
          evidenceStatus: ex.evidenceStatus,
          minutes: 5,
          why: layer === "sl" ? firstSentence(ex.summarySi) : firstSentence(ex.summaryEn),
          walkId: null,
          walkTitleSi: null,
          walkTitleEn: null,
        },
      ];
    }),
  };
}

/* --- T5: pestrost brez interesov ------------------------------------------- */
console.log("T5: Pestrost brez interesov (omejitev na kategorijo)");
{
  const slugs = selectStops(input({ minutes: 60 }));
  const per = new Map<ExhibitCategory, number>();
  for (const s of slugs) {
    const c = seedExhibits.find((e) => e.slug === s)!.category;
    per.set(c, (per.get(c) ?? 0) + 1);
  }
  const maxPer = Math.max(...per.values());
  ok(maxPer <= Math.max(2, Math.ceil(12 / 3)), `T5.1 največ na kategorijo ≤ 4 (${maxPer})`);
  ok(per.size >= 3, `T5.2 vsaj 3 kategorije (${per.size})`);
}

/* --- T6: kronološka pripoved ------------------------------------------------ */
console.log("T6: Kronološka urejenost");
{
  // Prava pot: buildVisitPlan ureja pripoved kronološko (fallback sinteze).
  const plan = await buildVisitPlan(input({ minutes: 60 }), async () => null);
  let lastYear = -Infinity;
  let ordered = true;
  for (const s of plan.stops) {
    const y = seedExhibits.find((e) => e.slug === s.slug)?.yearFrom ?? null;
    if (y !== null) {
      if (y < lastYear) ordered = false;
      lastYear = y;
    }
  }
  ok(ordered, "T6.1 letnice naraščajo (brez letnice na konec)");
}

/* --- T7: firstSentence -------------------------------------------------------- */
console.log("T7: Prvi stavek povzetka");
{
  ok(firstSentence("Prvi stavek. Drugi stavek.") === "Prvi stavek.", "T7.1 izrez prvega stavka");
  ok(
    firstSentence("Vprašanje? Da.") === "Vprašanje?",
    "T7.2 vprašaj kot meja",
  );
  ok(
    firstSentence("a".repeat(250)).length === 198 && firstSentence("a".repeat(250)).endsWith("…"),
    "T7.3 truncation pri 197 + …",
  );
}

/* --- T8: preverba sinteze ----------------------------------------------------- */
console.log("T8: Preverba sinteze (verifySynthesis)");
{
  const good = JSON.stringify({ intro: "Dober dan!", whys: ["a", "b", "c"], tip: "Nasvet." });
  ok(verifySynthesis(good, 3)?.whys.length === 3, "T8.1 veljaven JSON 3/3");

  const fenced = "```json\n" + good + "\n```";
  ok(verifySynthesis(fenced, 3) !== null, "T8.2 ograja ```json");

  const trailing = '{"intro":"x","whys":["a","b",],"tip":null}';
  const v = verifySynthesis(trailing, 2);
  ok(v !== null && v.tip === null, "T8.3 vlečena vejica + null tip");

  ok(verifySynthesis(JSON.stringify({ intro: "x", whys: ["a", "b"] }), 3) === null, "T8.4 premalo whys → null");
  ok(verifySynthesis("sploh ne json", 3) === null, "T8.5 ne-JSON → null");
  ok(
    verifySynthesis(JSON.stringify({ intro: "x", whys: ["a".repeat(401), "b", "c"] }), 3) === null,
    "T8.6 preveč dolg why → null",
  );
  ok(
    verifySynthesis(JSON.stringify({ intro: "x".repeat(601), whys: ["a", "b", "c"] }), 3) === null,
    "T8.7 preveč dolg intro → null",
  );
  ok(
    verifySynthesis(JSON.stringify({ intro: "x", whys: [12, "b", "c"] }), 3) === null,
    "T8.8 ne-niz v whys → null",
  );
}

/* --- T9: buildVisitPlan — fallback in sinteza (brez modela) ------------------- */
console.log("T9: buildVisitPlan (fallback + vbrizgana sinteza)");
{
  const fallback = await buildVisitPlan(input({ minutes: 15 }), async () => null);
  ok(fallback.stops.length === 3, "T9.1 fallback: 3 postaje");
  ok(fallback.synthesized === false, "T9.2 fallback: synthesized=false");
  ok(fallback.stops.every((s) => s.why.length > 0), "T9.3 vsaka postaja ima razlog");
  ok(fallback.intro.length > 10, "T9.4 fallback uvod obstaja");

  const slugsRef = selectStops(input({ minutes: 15 }));
  const injected = await buildVisitPlan(input({ minutes: 15 }), async (_i, slugs) => {
    ok(slugs.length === slugsRef.length, "T9.5 sinteza prejme enak izbor");
    return { intro: "Testni uvod.", whys: slugs.map((_, i) => `Razlog ${i + 1}`), tip: "Testni nasvet." };
  });
  ok(injected.synthesized === true, "T9.6 synthesized=true");
  ok(injected.intro === "Testni uvod.", "T9.7 uvod iz sinteze");
  ok(injected.stops[0]!.why === "Razlog 1", "T9.8 why po indeksu");
  ok(injected.tip === "Testni nasvet.", "T9.9 tip iz sinteze");
  ok(
    injected.stops.every((s) => seedExhibits.some((e) => e.slug === s.slug)),
    "T9.10 sinteza ne more vnesti tujih postaj",
  );
}

/* --- T10: sprehodi -------------------------------------------------------------- */
console.log("T10: Veza na sprehode");
{
  const walkIds = new Set(WALKS.map((w) => w.id));
  let withWalk = 0;
  let validWalk = 0;
  for (const ex of seedExhibits) {
    const w = WALKS.find((walk) => walk.stops.some((s) => s.exhibitSlug === ex.slug));
    if (w) {
      withWalk++;
      if (walkIds.has(w.id)) validWalk++;
    }
  }
  ok(withWalk > 50 && validWalk === withWalk, `T10.1 ${withWalk} zapisov v sprehodih, vsi ID-ji veljavni`);
}

/* --- T11: predpomnilnik ------------------------------------------------------------ */
console.log("T11: Predpomnilnik");
{
  const a = input({ minutes: 30, interests: ["kolpa"] });
  const b = input({ minutes: 30, interests: ["kolpa", "sege"] });
  ok(planCacheKey(a) !== planCacheKey(b), "T11.1 različna ključa");
  ok(planCacheGet(planCacheKey(a)) === null, "T11.2 prazen predpomnilnik");
  const plan = buildDetour(a);
  planCacheSet(planCacheKey(a), plan);
  ok(planCacheGet(planCacheKey(a)) === plan, "T11.3 okrožni sprehod get/set");
}

/* --- T12: omejitev hitrosti --------------------------------------------------------- */
console.log("T12: Omejitev hitrosti");
{
  const ip = `test-ip-${Math.random()}`;
  let limited = false;
  for (let i = 0; i < 12; i++) limited = planRateLimited(ip) || limited;
  ok(!limited, "T12.1 prvih 12 dovoljenih");
  ok(planRateLimited(ip), "T12.2 13. zahteva zavrnjena");
}

/* --- Povzetek ------------------------------------------------------------------------ */
console.log(`\nREZULTAT: ${pass} ✓ / ${fail} ✗`);
process.exit(fail ? 1 : 0);
