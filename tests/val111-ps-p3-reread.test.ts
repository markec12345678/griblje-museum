/**
 * Val 111 — poln re-read PS p1–55, 1. del: p3 (ISSUE #42 §4/§14)
 * [pot do podatka: 126-val111]
 *
 * p3 = EDINA stran val 57 z 'qm' shemo — njena območja NIKOLI vstopila v register.
 * Ta val jih vgradi z agentovim direktnim vi-om (0 VLM): 19 vrednosti v klafter
 * (F-PV-07: scribere piše v Quad. Klafter podstolpec, N.o Joche prazen), r0/r16
 * prazni. Števkovna razhajanja vs val57 qm (nikoli v register, audit): r13 609→409,
 * r15 158→184, r20 46→96; r3 = 769[?] (zadnja števka 9/2 neodločena).
 *
 * Fürtrag p3: črno 3|574 prečrtano rdeče → rdeča korekcija 2|1495.
 * Imenski pass p3 = ODLOŽEN (izrezki z x-odmikom; register ostaja prazen — nič ugibanja).
 * Kaskada: PS parcele 735 (nespremenjeno — p3 brez lastniške identitete), KG vsebina
 * nespremenjena (samo generated_at), pokritost pt_rows osvežena na val 110 stanje
 * (52 STABLE / 11 REVIEW / 37 REVIEW-CONFLICT — v HEAD je bila zastarela).
 *
 * ISKRENOST: 0 VLM klicev; instrument val 61/88/108 (agentov vid + ultra zoomi ×7–12);
 * kultur dvomi r5/r6/r16/r18/r19 dokumentirani, NI korekcij kultur (nič ugibanja).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const reg = JSON.parse(
  readFileSync(join(root, "research-griblje/ps-n83/register.json"), "utf8"),
) as {
  page: number;
  jaethe: string;
  klafter: string;
  reading_pass?: string;
  anmerkung: string;
  owner_original?: string;
  page_observations: string;
}[];
const reading = JSON.parse(
  readFileSync(join(root, "research-griblje/ps-n83/band-v111/reading-v111/p03.json"), "utf8"),
) as {
  meta: { val: string; method: string; findings: string[]; zoom_log: string[]; sum_control: { rows_r1_r20_sum_QK: number; delta: number } };
  rows: Record<string, { j: string; k: string; kultur_seen?: string; name_seen?: string; note?: string }>;
  fuertrag: { label: string; black_crossed: string; red: string };
};
const changes = JSON.parse(
  readFileSync(join(root, "research-griblje/ps-n83/band-v111/register-v111-changes.json"), "utf8"),
) as { meta: { val: string; method: string }; tally: { filled_klafter: number; anmerkung_addonly: number }; changes: unknown[] };

const p3 = reg.filter((r) => r.page === 3);

describe("val 111 — p3 vgradnja območij (F-PV-07)", () => {
  test("register: 2875 vrstic (val 115: +4 vstavljene), 139 v88 guard nedotaknjen", () => {
    expect(reg.length).toBe(2875);
    const v88 = reg.filter(
      (r) => (r as { v88_status?: string }).v88_status !== undefined ||
             (r as { jk_review?: string }).jk_review === "v88-digit-split-UNRESOLVED",
    ).length;
    expect(v88).toBe(139);
  });

  test("p3: 21 vrstic, vse z reading_pass v111-ps-reread", () => {
    expect(p3.length).toBe(21);
    for (const r of p3) expect(r.reading_pass).toBe("v111-ps-reread");
  });

  test("F-PV-07: vrednosti v klafter, jaethe prazen na vseh p3 vrsticah", () => {
    for (const r of p3) expect(r.jaethe).toBe("");
  });

  test("19 vgrajenih vrednosti; r0 (prečrtana) in r16 (prazna celica) brez območja", () => {
    expect(p3.filter((r) => (r.klafter ?? "").trim() !== "").length).toBe(19);
    expect(p3[0].klafter).toBe("");
    expect(p3[16].klafter).toBe("");
  });

  test("vrednosti 1:1 z reading JSON (v111 glas = vir)", () => {
    for (const [i, rinfo] of Object.entries(reading.rows)) {
      const expectK = rinfo.k.replace("[?]", "").trim();
      expect(p3[Number(i)].klafter).toBe(expectK);
    }
  });

  test("števkovne razhajanja vs val57 qm (audit): 409 / 184 / 96", () => {
    expect(p3[13].klafter).toBe("409"); // val57 qm 609
    expect(p3[15].klafter).toBe("184"); // val57 qm 158
    expect(p3[20].klafter).toBe("96"); // val57 qm 46
  });

  test("r3 = 769 (zadnja števka 9/2 neodločena — ni izmisljive korekcije)", () => {
    expect(p3[3].klafter).toBe("769");
    expect(reading.rows["3"].k).toBe("769[?]");
  });

  test("anmerkung add-only: r0 prečrtana, r11 prej zapis prečrtan, r14 rdeče prečrtanja", () => {
    expect(p3[0].anmerkung).toContain("[vrstica prečrtana — val 111]");
    expect(p3[11].anmerkung).toContain("[prej zapisana številka prečrtana, prek nje 99 — val 111]");
    expect(p3[14].anmerkung).toContain("[679 prečrtano rdeče; kultur prečrtan rdeče");
  });

  test("Fürtrag: črno 3|574 prečrtano, rdeča korekcija 2|1495 dokumentirana", () => {
    expect(reading.fuertrag.label).toContain("Fürtrag");
    expect(reading.fuertrag.black_crossed).toBe("3|574");
    expect(reading.fuertrag.red).toBe("2|1495");
    expect(p3[0].page_observations).toContain("2|1495");
  });

  test("F-PV-07 najdba dokumentirana v reading meta + page_observations", () => {
    const fpv07 = reading.meta.findings.find((f) => f.startsWith("F-PV-07"));
    expect(fpv07).toBeDefined();
    expect(p3[0].page_observations).toContain("F-PV-07");
  });

  test("vsotna kontrola: vsota r1–r20 = 6916 QK (C4-vzorec, neodločena hipoteza)", () => {
    const sum = p3.slice(1).reduce((a, r) => a + Number(r.klafter || 0), 0);
    expect(sum).toBe(6916);
    expect(reading.meta.sum_control.delta).toBe(2221);
  });
});

describe("val 111 — iskrenost + audit trail", () => {
  test("0 VLM klicev (metoda agentovegavida)", () => {
    expect(reading.meta.method).toContain("0 VLM klicev");
  });

  test("changes artefakt: 19 fills + 3 anmerkung + empty cells", () => {
    expect(changes.meta.val).toBe("111");
    expect(changes.tally.filled_klafter).toBe(19);
    expect(changes.tally.anmerkung_addonly).toBe(3);
    const empty = changes.changes.filter((c) => (c as { type: string }).type === "v111_empty_cell");
    expect(empty.length).toBe(2);
  });

  test("zoom log dokazuje ultra povečave ×7–12 za odločanje o števkah", () => {
    expect(reading.meta.zoom_log.some((z) => z.includes("×7") || z.includes("x7"))).toBe(true);
    expect(reading.meta.zoom_log.join(" ")).toMatch(/x10|x12|×10|×12/);
  });

  test("imenski pass opravljen v val 112: p3 lastniki zapolnjeni z [?] dvomi (nič ugibanja brez oznake, §4)", () => {
    // val 111 je imenski pass odložil (lastniki prazni); val 112 ga je opravil —
    // vse imena nosijo eksplicitni [?] dvom, r19 = Gemeinde, r0/r16 brez imena
    const filled = p3.filter((r) => (r.owner_original ?? "").length > 0);
    expect(filled.length).toBe(19); // 21 vrstic − r0 (prečrtana) − r16 (fantom)
    for (const r of filled) {
      if ((r.owner_original ?? "") !== "Gemeinde") {
        expect(r.owner_original).toMatch(/\[\?\]/); // vsak dvom ekspliciten
      }
    }
  });

  test("p142-t-kultur2 regeneracijsko orodje obstaja (resumable ob kvoti)", () => {
    expect(existsSync(join(root, "research-griblje/raw-web-val86-2026-10/regen-missing-crop-v99.mts"))).toBe(true);
  });
});
