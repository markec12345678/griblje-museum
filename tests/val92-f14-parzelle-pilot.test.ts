/**
 * Val 92 — ISSUE #43 §1/§10 + #42 §4: PS N83 F14 pilot — Benennung des Flures /
 * Nro. der Parzelle — strukturni model + aritmetika (instrument val 61, 0 VLM).
 *
 * Ozadje: F14 (cross_ref PS↔PUA UNKNOWN na 930 parcelah) in NR-02 (Rosetta)
 * sta odprta od vala 58. Val 92 = pilot direktnega branja številskih stolpcev
 * na 8 vzorčnih razpredah (p2, p3×2, p20, p45, p58×2, p59, p84, p133):
 *   - glava popravljen: »Benennung des Flures« + »Nro. der Parzelle« (leva) /
 *     »N.° Joch | Quad. Klafter« (desna) — ne »Flurbezirk / Jaethe« (analiza v1);
 *   - model: p3 = Flure 1–20; p4–p143 = Parzelle 21–~2820 (~20/razprede),
 *     first(p) = 21 + 20·(p−4) — potrjeno na 6 točkah (p20/p45/p58/p59/p84/p133);
 *   - površinska semantika: jaethe = Joch, klafter = Quad. Klafter, 1 J = 1600 QKl
 *     → C4 prostor vala 90 = LITERALNA površina (vzorec p3 »1-1348«);
 *   - NR-02 v1 = kategorijska napaka (površine ↔ številke); pokritostni test PS↔PUA-I
 *     nima ločevalne moči (lokalna gostota 76–96 %) — pošten negativni verdikt.
 *
 * Varovalke:
 *  1. artefakt + verifikator obstajata; verifikator determinističen (re-run byte-identno)
 *  2. model: 6 parcelnih točk brez prekrivanja + p3 Flure 1–20
 *  3. statusi: CONFIRMED vs PROVISIONAL izrecni; p58 nosi 1x→3x popravek (pouk)
 *  4. pošten negativ: honest_negative v artefaktu + P(20/20)≈0,44 pri naključju
 *  5. +0 zapisov / +0 virov / +0 KG / +0 UI (števec 113 / 605 / 485 nespremenjen)
 *  6. ATLAS artefakti ne citirajo pilotnih datotek (diagnostični sloj)
 */
import { describe, expect, test } from "bun:test";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ART = join(process.cwd(), "research-griblje/ps-n83/f14-flurbezirk/pilot-parzelle-v92.json");
const VER = join(process.cwd(), "research-griblje/ps-n83/f14-flurbezirk/build-pilot-parzelle-v92.py");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type Pilot = {
  meta: { val: number; issue: string; passes: string; resolution_limit: string };
  glava: { printed_head_left: string[]; printed_head_right: string[]; note: string };
  structure_model: {
    page_to_parzelle: string;
    confirmation_points: { page: number; expected: string; read: string; status: string }[];
    implication: string;
  };
  p133_gemeinde_section: { parzelle: string; owner: string; benennung_des_flures: string };
  f14_verdict: { correction_1: string; correction_2: string; rosetta_status: string; honest_negative: string };
  readings: Record<string, Record<string, unknown>>;
  invariants: Record<string, string>;
};
const art = JSON.parse(readFileSync(ART, "utf8")) as Pilot;

function runVerifier(): string {
  return execFileSync("python3", [VER], { encoding: "utf8" });
}

describe("val92 — artefakt in glava", () => {
  test("artefakt obstaja in je val 92 / issue #43+#42", () => {
    expect(art.meta.val).toBe(92);
    expect(art.meta.issue).toContain("#43");
    expect(art.meta.issue).toContain("#42");
  });

  test("glava: Benennung des Flures + Nro. der Parzelle (popravek analize v1)", () => {
    expect(art.glava.printed_head_left).toContain("Benennung des Flures");
    expect(art.glava.printed_head_left).toContain("Nro. der Parzelle");
    expect(art.glava.printed_head_right).toContain("Flächen Inhalt: N.° | Joch | Quad. Klafter");
    expect(art.glava.note).toContain("popravljeno");
  });

  test("omejitev ločljivosti izrecno (predogled ≠ 300 dpi)", () => {
    expect(art.meta.resolution_limit).toContain("PREDOGLEDNA");
    expect(art.meta.resolution_limit).toContain("300 dpi");
  });
});

describe("val92 — strukturni model (21 + 20·(p−4))", () => {
  const pts = art.structure_model.confirmation_points;

  test("7 potrditvenih točk, p3 = Flure 1–20", () => {
    expect(pts.length).toBe(7);
    expect(pts[0].page).toBe(3);
    expect(pts[0].expected).toBe("Flure 1–20");
  });

  test("model velja na vseh 6 parcelnih točkah (izpeljano, ne trdo kodirano)", () => {
    const first = (p: number) => 21 + 20 * (p - 4);
    const last = (p: number) => first(p) + 19;
    for (const pt of pts.filter((x) => x.page !== 3)) {
      const [a, b] = pt.expected.split("–").map(Number);
      expect(a).toBe(first(pt.page));
      expect(b).toBe(last(pt.page));
    }
  });

  test("p58 nosi popravek 1x→3x (pouk dvojnih prehodov)", () => {
    const p58 = pts.find((x) => x.page === 58)!;
    expect(p58.read).toContain("1101–1120");
    expect(p58.read).toContain("101–120 NAPAČNO");
  });

  test("implikacija: ~2800 parcel, 930 = podmnožica", () => {
    expect(art.structure_model.implication).toContain("~2800");
    expect(art.structure_model.implication).toContain("930");
  });
});

describe("val92 — F14 verdikti (poštenost)", () => {
  test("NR-02 v1 = kategorijska napaka (površine ↔ številke)", () => {
    expect(art.f14_verdict.correction_1).toContain("kategorijska napaka");
    expect(art.f14_verdict.correction_1).toContain("Nro. der Parzelle");
  });

  test("C4 prostor J·1600+QKl = literalna površina", () => {
    expect(art.f14_verdict.correction_2).toContain("1 J = 1600 QKl");
    expect(art.f14_verdict.correction_2).toContain("LITERALNA površina");
  });

  test("pošten negativ: pokritostni test brez ločevalne moči", () => {
    expect(art.f14_verdict.honest_negative).toContain("NIGNEDOKAZLJIV");
    expect(art.f14_verdict.rosetta_status).toContain("0,44");
    expect(art.f14_verdict.rosetta_status).toContain("TO-RESOLVE");
  });

  test("p133 Gemeinde sekcija: navpično ime Bezirka TO-READ", () => {
    expect(art.p133_gemeinde_section.owner).toContain("Gemeinde");
    expect(art.p133_gemeinde_section.parzelle).toContain("2601–2620");
    expect(art.p133_gemeinde_section.benennung_des_flures).toContain("TO-READ");
  });
});

describe("val92 — determinizem in pogodbe", () => {
  test("verifikator zelen in re-run determinističen (byte-identno)", () => {
    const out1 = runVerifier();
    const out2 = runVerifier();
    expect(out1).toContain("VERDICT: model 21+20*(p-4) potrjen");
    expect(createHash("sha256").update(out1).digest("hex")).toBe(
      createHash("sha256").update(out2).digest("hex"),
    );
  });

  test("+0 zapisov / +0 virov / +0 KG / +0 UI", () => {
    expect(art.invariants.no_museum_content_change).toBe("+0 zapisov / +0 virov / +0 KG / +0 UI");
    expect(art.invariants.no_guessing).toContain("nič rešeno z ugibanjem");
  });
});
