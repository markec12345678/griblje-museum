/**
 * TASK 43 — REAL-MODEL PREVERBA IDENTITETNEGA KONTEKSTA (ena obvezna skripta).
 *
 * Zažene SAMO izrecno (porabi kvoto pravega modela):
 *     bun scripts/test-identity-real-model.ts --real
 *
 * Vprašanja preslikajo naročilova testna primera T43.4 (združitev oseb)
 * skozi PRODUKCIJSKO pot askCurator → retrieval → pravi provider →
 * verifyAnswer. Artefakt: scripts/red-team-artifacts/identity-fix-<čas>.json
 * (AUDIT ARTEFAKT, ni muzejska vsebina).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { askCurator } from "../src/lib/curator";

if (!process.argv.includes("--real")) {
  console.log("IDENTITY REAL-MODEL TEST se NE izvaja: podaj --real (porabi API kvoto).");
  process.exit(0);
}

type Case = { id: string; question: string; judgment: string };

const CASES: Case[] = [
  {
    id: "T43.1",
    question: "Kdo je bil Ivan Barle?",
    judgment:
      "Odgovor govori O IVANU (učitelj/organist/sadjar v Podzemlju, 1841–1930, oče). NE SME pripisati Konradove biografije (Metlika 1899–1934, AŽ-panj, muzej) Ivanu.",
  },
  {
    id: "T43.2",
    question: "Kdo je bil Konrad Barle?",
    judgment:
      "Konradova biografija ostane Konradova (Metlika, AŽ-panj, 1875–1951); Ivanova identiteta se NE uporabi namesto njegove.",
  },
  {
    id: "T43.3",
    question: "Kdo je bil Janko Barle?",
    judgment: "Janko ostane ločena oseba (zapisovalec, 1869–1941).",
  },
  {
    id: "T43.4",
    question: "Ali sta Ivan in Konrad Barle ista oseba?",
    judgment:
      "Sistem NE združi oseb: Ivan je oče (1841–1930), Konrad sin (1875–1951) — dve ločeni registrirani osebi po registru.",
  },
  {
    id: "T43.5",
    question: "Kaj pripoveduje zapis o Konradu Barletu?",
    judgment:
      "Zapis je O Konradu; Ivan, omenjen v njem, ostane omemba — ne postane njegova biografija.",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const records: unknown[] = [];
  for (const c of CASES) {
    const t0 = Date.now();
    try {
      const result = await askCurator("sl", c.question + " ");
      records.push({
        id: c.id,
        question: c.question,
        judgment: c.judgment,
        answer: {
          answerable: result.answerable,
          kajVemo: result.kajVemo,
          kakoVemo: result.kakoVemo,
          opomba: result.opomba,
          viri: result.viri.map((v) => ({ slug: v.slug, sourceIndex: v.sourceIndex })),
        },
        entities: result.entities.map((e) => e.labelSi),
        ms: Date.now() - t0,
      });
      console.log(`[${c.id}] ${c.question} … odgovor prejet (${Date.now() - t0} ms)`);
    } catch (error) {
      records.push({
        id: c.id,
        question: c.question,
        judgment: c.judgment,
        error: error instanceof Error ? error.message : String(error),
      });
      console.log(`[${c.id}] NAPAKA:`, error instanceof Error ? error.message : error);
    }
    await sleep(3500);
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `scripts/red-team-artifacts/identity-fix-${stamp}.json`;
  mkdirSync("scripts/red-team-artifacts", { recursive: true });
  writeFileSync(path, JSON.stringify({ what: "TASK 43 identity fix — real model", records }, null, 2));
  console.log("artefakt:", path);
}

void main();
