/**
 * Formalni raziskovalni cevovod — Research → Museum (issue #27/L).
 *
 * Cevovod: Research finding → Archive/source record → document/page
 * verification → transcription → Claim → Source link → Exhibit →
 * Editorial review → Published.
 *
 * ŽELEZNO PRAVILO (iz issue #27/L):
 *   »Najdena spletna sled sama po sebi ni dokaz za DOCUMENTED claim.«
 *
 * To pomeni: ugotovitev, katere edini izvor je spletna sled (iskalni
 * zadetek, AJAX odgovor kataloga, API izpis), sme napredovati samo do
 * KATALOGIZACIJE (ArchiveRecord z raziskovalnim statusom). Dokler ni
 * enota dejansko odprta/brana (VIEWED/TRANSCRIBED) ali dokler ni na
 * voljo digitaliziran primerek z preverjeno stranjo, sme trditev nositi
 * samo UNVERIFIED / TO_COLLECT — nikoli DOCUMENTED.
 *
 * Modul je čista mašina stanj (brez baze) — ista pravila, ki jih
 * uveljavlja evidence gate (src/lib/claims.ts), preverjamo tudi tu,
 * na ravni cevovoda: vsak prehod ima izrecne zahteve dokazov.
 */

import { checkEvidenceGate, type ClaimEvidenceStatus } from "./claims";

/* --- Odri cevovoda ------------------------------------------------------- */

export const PIPELINE_STAGES = [
  "RESEARCH_FINDING",
  "ARCHIVE_RECORD",
  "PAGE_VERIFICATION",
  "TRANSCRIPTION",
  "CLAIM",
  "SOURCE_LINK",
  "EXHIBIT",
  "EDITORIAL_REVIEW",
  "PUBLISHED",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** Vrstni red odra (indeks) — prehode naprej primerjamo po njem. */
const STAGE_INDEX: Record<PipelineStage, number> = PIPELINE_STAGES.reduce(
  (acc, stage, i) => ({ ...acc, [stage]: i }),
  {} as Record<PipelineStage, number>,
);

/* --- Izvor ugotovitve ----------------------------------------------------- */

/** Od kod ugotovitev prihaja — pomembno za pravilo spletne sledi. */
export type FindingOrigin =
  | "WEB_TRACE" // iskalni zadetek / AJAX odgovor / API izpis — samo sled
  | "CATALOGUE" // kataloški popis v ustanovi (VAČ, tektonika, NŠAL …)
  | "DIGITIZED_UNIT" // digitalizirana enota, dostopna za branje
  | "READING_ROOM" // enota odprta v čitalnici
  | "FIELD" // terensko opažanje / fotografija na lokaciji
  | "ORAL"; // ustno pričevanje

/** Raziskovalni status arhivske enote (enaka lestvica kot ArchiveRecord). */
export type ResearchStatus =
  | "NOT_VIEWED"
  | "VIEWED_PARTIALLY"
  | "VIEWED"
  | "TRANSCRIBED";

/* --- Dokazila, ki jih nosi enota cevovoda -------------------------------- */

export type PipelineEvidence = {
  /** Izvor začetne ugotovitve. */
  origin: FindingOrigin;
  /** Kataloška enota: ustanova + fond + signatura (#27/E). */
  institution?: string;
  fonds?: string;
  signature?: string;
  /** Identifikator v repozitoriju arhiva (npr. VAČ hub id). */
  identifier?: string;
  /** Stran / oddelek / enota znotraj vira — obvezen prenos skozi celoten
   *  cevovod (issue #27/S: »source page/reference preserved«). */
  pageRef?: string;
  /** Raziskovalni status enote — pošteno, sinhronizirano z dejanskim branjem. */
  researchStatus: ResearchStatus;
  /** Enota je digitalizirana in dostopna (potrjen dostop do vsebine). */
  digitized: boolean;
  /** Transkripcija / izpisek z brane strani (če je bila brana). */
  transcription?: string;
  /** Trditev, ki jo cevovod nosi (od odra CLAIM naprej). */
  statement?: string;
  evidenceStatus?: ClaimEvidenceStatus;
  /** Vezava trditve: vir / arhivska enota. */
  sourceId?: string | null;
  archiveRecordId?: string | null;
  /** Vir: id + licenca (odra SOURCE_LINK naprej). */
  sourceLicense?: string | null;
  /** Uredniška verzija: status + urednik + razlog. */
  versionStatus?: "DRAFT" | "REVIEW" | "APPROVED" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
  changedBy?: string;
  reason?: string;
  /** Zapis, ki nosi vsebino (od odra EXHIBIT naprej). */
  exhibitSlug?: string;
  museumNo?: string;
};

/* --- Rezultat prehoda ------------------------------------------------------ */

export type PipelineStepResult = {
  ok: boolean;
  /** Razlog zavračanja (slovensko, primerno za dnevnik/uredništvo). */
  reason?: string;
  /** Katera zahteva odra ni izpolnjena (koda, primerno za testiranje). */
  unmet?: string;
};

/* --- Zahteve odrov --------------------------------------------------------- */

type StageRequirement = {
  /** Človeku berljiv opis odra. */
  label: string;
  /** Preverjanje: ali enota sme vstopiti na ta oder? */
  check: (e: PipelineEvidence) => PipelineStepResult;
};

const okStep: PipelineStepResult = { ok: true };

function fail(unmet: string, reason: string): PipelineStepResult {
  return { ok: false, unmet, reason };
}

/**
 * Zahteve za VSTOP na oder. Predznak: oder X zahteva, da je vse z
 * odra X-1 zaključeno in dokumentirano.
 */
export const PIPELINE_STAGE_REQUIREMENTS: Record<PipelineStage, StageRequirement> = {
  RESEARCH_FINDING: {
    label: "Raziskovalna ugotovitev (vhod v cevovod)",
    check: () => okStep,
  },
  ARCHIVE_RECORD: {
    label: "Kataloški arhivski zapis (ArchiveRecord)",
    check: (e) => {
      if (!e.institution || !e.signature) {
        return fail(
          "archive_record",
          "Enota mora imeti ustanovo in signaturo (fonds/serija priporočeno).",
        );
      }
      if (e.researchStatus !== "NOT_VIEWED" && !e.pageRef) {
        // branje brez navedbe enote/strani se ne sme zgoditi
        return fail(
          "pageRef",
          "Branje (VIEWED+) brez navedbe strani/enote ni dovoljeno.",
        );
      }
      return okStep;
    },
  },
  PAGE_VERIFICATION: {
    label: "Preverba strani/enote (dokument dejansko viden)",
    check: (e) => {
      const read =
        e.researchStatus === "VIEWED_PARTIALLY" ||
        e.researchStatus === "VIEWED" ||
        e.researchStatus === "TRANSCRIBED";
      if (!read) {
        return fail(
          "researchStatus",
          "Stran/enota NI bila brana (NOT_VIEWED) — naprej ni mogoče.",
        );
      }
      if (!e.pageRef) {
        return fail("pageRef", "Preverba strani brez pageRef ni dovoljena.");
      }
      if (e.origin === "WEB_TRACE" && !e.digitized && e.researchStatus !== "TRANSCRIBED") {
        return fail(
          "web_trace",
          "Spletna sled sama po sebi ni dokaz — potrebna digitalizirana enota ali branje v čitalnici.",
        );
      }
      return okStep;
    },
  },
  TRANSCRIPTION: {
    label: "Transkripcija / izpisek (neobvezen, vezan na brano stran)",
    check: (e) => {
      if (e.transcription === undefined) return okStep; // oder je lahko izpuščen
      if (e.transcription.trim() === "") {
        return fail("transcription", "Prazen izpisek ni transkripcija.");
      }
      if (!e.pageRef) {
        return fail("pageRef", "Transkripcija brez navedbe strani ni dovoljena.");
      }
      return okStep;
    },
  },
  CLAIM: {
    label: "Trditev (Claim) z evidence statusom",
    check: (e) => {
      if (!e.statement || e.statement.trim() === "") {
        return fail("statement", "Trditev mora imeti izjavljeno vsebino.");
      }
      // DOCUMENTED pade skozi isti vrata kot javni API (evidence gate).
      if (e.evidenceStatus === "DOCUMENTED" || e.evidenceStatus === "CORROBORATED") {
        const gate = checkEvidenceGate({
          evidenceStatus: e.evidenceStatus,
          status: "DRAFT",
          sourceId: e.sourceId ?? null,
          archiveRecordId: e.archiveRecordId ?? null,
          pageRef: e.pageRef ?? null,
        });
        if (!gate.ok) {
          return fail("evidence_gate", gate.reason ?? "Evidence gate zavrnjen.");
        }
        // Cevovod poleg tega zahteva pošten raziskovalni status enote:
        // NOT_VIEWED enota ne sme nositi DOCUMENTED trditve, tudi če je
        // gate po formi zadovoljen (issue #27/E+M: »najdeno ≠ prebrano«).
        if (e.researchStatus === "NOT_VIEWED" && !e.digitized) {
          return fail(
            "researchStatus",
            "DOCUMENTED na enoti, ki ni bila odprta in ni digitalizirana, ni dovoljeno.",
          );
        }
      }
      return okStep;
    },
  },
  SOURCE_LINK: {
    label: "Vezava na vir (Source + licenca)",
    check: (e) => {
      if (e.sourceId === undefined || e.sourceId === null) {
        // brez vira je dovoljeno NAPREJ samo, če nosimo arhivsko enoto
        if (!e.archiveRecordId) {
          return fail("source_link", "Trditev brez vira mora nositi arhivsko enoto.");
        }
        return okStep;
      }
      if (!e.sourceLicense) {
        return fail("license", "Vir mora imeti izrecno licenco (UNKNOWN je izrecen dovolj).");
      }
      return okStep;
    },
  },
  EXHIBIT: {
    label: "Vključitev v zapis (Exhibit z muzejsko številko)",
    check: (e) => {
      if (!e.exhibitSlug || !e.museumNo) {
        return fail("exhibit", "Zapis mora imeti slug in muzejsko številko (MVG-…).");
      }
      return okStep;
    },
  },
  EDITORIAL_REVIEW: {
    label: "Uredniški pregled (verzija + urednik + razlog)",
    check: (e) => {
      // PUBLISHED tudi velja: objava si deli verzijo z odobritvijo —
      // če je zapis že objavljen, je bil pregled zato po definiciji opravljen.
      if (e.versionStatus !== "APPROVED" && e.versionStatus !== "PUBLISHED") {
        return fail("versionStatus", "Uredniški pregled zahteva APPROVED (ali že PUBLISHED) verzijo.");
      }
      if (!e.changedBy) {
        return fail("changedBy", "Odobritev mora nositi uredniški alias (brez računov).");
      }
      if (!e.reason || e.reason.trim() === "") {
        return fail("reason", "Odobritev mora navesti razlog.");
      }
      return okStep;
    },
  },
  PUBLISHED: {
    label: "Objava (transakcijska, s čiščenjem predpomnilnika)",
    check: (e) => {
      if (e.versionStatus !== "PUBLISHED") {
        return fail("versionStatus", "Objava zahteva PUBLISHED verzijo (transakcija).");
      }
      if (!e.exhibitSlug) {
        return fail("exhibit", "Objava brez zapisa ni mogoča.");
      }
      return okStep;
    },
  },
};

/* --- Prehodi ---------------------------------------------------------------- */

/** Ali je prehod iz odra A v oder B dovoljen (samo naprej, po vrsti). */
export function canAdvance(from: PipelineStage, to: PipelineStage): boolean {
  return STAGE_INDEX[to] === STAGE_INDEX[from] + 1;
}

/** Najzgodnejši oder, ki ga enota pošteno doseže glede na dokazila. */
export function reachableStage(e: PipelineEvidence): PipelineStage {
  let reached: PipelineStage = "RESEARCH_FINDING";
  for (const stage of PIPELINE_STAGES) {
    if (!PIPELINE_STAGE_REQUIREMENTS[stage].check(e).ok) break;
    reached = stage;
  }
  return reached;
}

/**
 * Poskus prehoda na naslednji oder. Vrne ok/reason; ne meče napak —
 * klicatelj (raziskovalni vmesnik, skripti) javlja razlog svojemu klicu.
 */
export function advancePipeline(
  from: PipelineStage,
  evidence: PipelineEvidence,
): PipelineStepResult {
  if (!PIPELINE_STAGES.includes(from)) {
    return fail("stage", `Neznan oder: ${from}`);
  }
  const next = PIPELINE_STAGES[STAGE_INDEX[from] + 1];
  if (!next) return fail("stage", "Cevovod je že na zadnjem odru (PUBLISHED).");
  const req = PIPELINE_STAGE_REQUIREMENTS[next];
  const result = req.check(evidence);
  if (!result.ok) return result;
  return { ok: true, reason: `${from} → ${next}: ${req.label}` };
}

/**
 * Preveri celoten cevovod naenkrat (od vhoda do želenega odra).
 * Uporabno za uvoz raziskovalnega vala: ali je dokumentirana pot
 * od ugotovitve do objave zaključena in sledljiva?
 */
export function validatePipeline(
  target: PipelineStage,
  evidence: PipelineEvidence,
): PipelineStepResult {
  const targetIndex = STAGE_INDEX[target];
  for (let i = 0; i <= targetIndex; i++) {
    const stage = PIPELINE_STAGES[i];
    const result = PIPELINE_STAGE_REQUIREMENTS[stage].check(evidence);
    if (!result.ok) {
      return {
        ok: false,
        unmet: result.unmet,
        reason: `Oder ${stage}: ${result.reason}`,
      };
    }
  }
  return { ok: true, reason: `Cevovod veljaven do ${target}.` };
}
