/**
 * Val 110 — PT p7 nativni re-read + PR Grenz-Beschreibung 2. prehod (ISSUE #42 §4/§14 + #43)
 * [pot do podatka: 125-val110]
 *
 * PT p7 (III.P., bp 81–100): nativni sken 2727×2117 (2,1× pripogleda val 41) —
 * F2 (val 54) "pomik vrstic" DOKAZAN in razrešen; 14 REVIEW-CONFLICT → 13 STABLE
 * (val52+val53+v110 odtis) + bp 98 → 70 (REVIEW, trojna korooboracija PUA no. 95
 * h.70 'B.P. 98.' + A01 no. 7 h.70 + nativni odtis); bp 99/100 = FANTOMSKI vnosi
 * (nativno prazni; 'Bruckmühle' ni na PT p7). 14 RC + 1 REVIEW + 5 STABLE →
 * 17 STABLE / 3 REVIEW / 0 RC.
 *
 * PR: rokopis 'Definitive Grenzbeschreibung der Gemeinde Grüble', Neustadtl 8. 4. 1825;
 * Mlinščica potrjena v obeh prehodih; razkol sosedov (odtis vs val 42) dokumentiran.
 *
 * ISKRENOST: 0 VLM klicev — 429 dnevna kvota (izčrpna z val 107/109); vse = direktni
 * odtis + rekonstrukcija glasov iz surovin val 41/52/53; izrezki resumable ob kvoti.
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const reg = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/register.json"), "utf8"),
) as {
  built: string;
  exclusions: Record<string, string>;
  register: {
    page: number;
    bp_no: string;
    house_no: string;
    house_no_votes: string;
    review_status: string;
    owner_original: string;
    gattung_original: string;
    areal_original: string;
    readings: string[];
    v110_native?: { no: string; areal_odtis: string; owner_struck: boolean | null; struck_note: string };
    v110_note?: string;
  }[];
};
const pages = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/page-records.json"), "utf8"),
) as { page: number; v110_native?: Record<string, string> }[];
const rec = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/reconciliation.json"), "utf8"),
) as { val110?: Record<string, unknown>; open_for_full_res: string[] };
const audit = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/register-v110-changes.json"), "utf8"),
) as {
  val: number;
  baseline: Record<string, number>;
  changes: { bp_no: string; pre: Record<string, string>; post: Record<string, string> }[];
  post_tally: { p7: Record<string, number>; house_changed: string[] };
};
const raw = join(root, "research-griblje/raw-web-val110-2026-09");
const mc = readFileSync(join(root, "src/lib/museum-content.ts"), "utf8");

const p7 = reg.register.filter((r) => r.page === 7);
const byBp = new Map(p7.map((r) => [r.bp_no, r]));

describe("val 110 — PT p7 nativni re-read (register)", () => {
  test("meta: built val 110 + izkrcna izključitev areal/lastnik", () => {
    expect(reg.built).toContain("val 110");
    expect(reg.built).toContain("429");
    expect(reg.exclusions["val110-areal-owner"]).toContain("excluded");
    expect(reg.exclusions["val110-areal-owner"]).toContain("ob kvoti");
  });

  test("p7: 17 STABLE / 3 REVIEW / 0 REVIEW-CONFLICT", () => {
    const tally = { STABLE: 0, REVIEW: 0, "REVIEW-CONFLICT": 0 };
    for (const r of p7) tally[r.review_status as keyof typeof tally] += 1;
    expect(tally).toEqual({ STABLE: 17, REVIEW: 3, "REVIEW-CONFLICT": 0 });
  });

  test("nativna sekvenca hišnih števil bp 81-98", () => {
    const seq: Record<string, string> = {
      "81": "45", "82": "45", "83": "45", "84": "45",
      "85": "37", "86": "36", "87": "44", "88": "36", "89": "44",
      "90": "43", "91": "44", "92": "41", "93": "40", "94": "40",
      "95": "39", "96": "38", "97": "39", "98": "70",
    };
    for (const [bp, h] of Object.entries(seq)) {
      expect(byBp.get(bp)!.house_no).toBe(h);
    }
  });

  test("fantoma bp 99/100: hišne številke in vsebinska polja počiščeni", () => {
    for (const bp of ["99", "100"]) {
      const r = byBp.get(bp)!;
      expect(r.house_no).toBe("");
      expect(r.owner_original).toBe("");
      expect(r.gattung_original).toBe("");
      expect(r.areal_original).toBe("");
      expect(r.review_status).toBe("REVIEW");
      expect(r.v110_note).toContain("PRAZNA");
    }
    // snimke ohranijo fantome (Alois Pollandt / h.5 'Futterg')
    const a99 = audit.changes.find((c) => c.bp_no === "99")!;
    const a100 = audit.changes.find((c) => c.bp_no === "100")!;
    expect(a99.pre.owner_original).toContain("Pollandt");
    expect(a100.pre.house_no).toBe("5");
  });

  test("bp 98 Zollamt: 70 + REVIEW + trojna korooboracija v opombi", () => {
    const r = byBp.get("98")!;
    expect(r.house_no).toBe("70");
    expect(r.review_status).toBe("REVIEW");
    expect(r.v110_note).toContain("PUA no. 95");
    expect(r.v110_note).toContain("B.P. 98");
    expect(r.v110_note).toContain("7->2");
  });

  test("STABLE ⇒ glasovi ≥2 in ne-prazna hišna številka (regresija)", () => {
    for (const r of p7) {
      if (r.review_status !== "STABLE") continue;
      const [n] = r.house_no_votes.split("/").map((x) => parseInt(x, 10));
      expect(n).toBeGreaterThanOrEqual(2);
      expect(r.house_no.length).toBeGreaterThan(0);
    }
  });

  test("vsaka p7 vrstica: provenanca v110 + nativni odtis blok", () => {
    for (const r of p7) {
      expect(r.readings).toContain("v110-native-p7");
      expect(r.v110_native).toBeDefined();
      expect(typeof r.v110_native!.owner_struck).toBe(r.bp_no === "99" || r.bp_no === "100" ? "object" : "boolean");
    }
    expect(byBp.get("96")!.v110_native!.no).toBe("38");
    expect(byBp.get("90")!.v110_native!.owner_struck).toBe(true);
    expect(byBp.get("86")!.v110_native!.owner_struck).toBe(false);
  });

  test("regresija: 100 vrstic, vrzel 15-20, p8 izključen, dovoljeni statusi", () => {
    expect(reg.register.length).toBe(100);
    const bps = new Set(reg.register.map((r) => r.bp_no));
    for (const bp of ["15", "16", "17", "18", "19", "20"]) expect(bps.has(bp)).toBe(false);
    expect(reg.register.every((r) => r.page !== 8)).toBe(true);
    const ok = ["STABLE", "REVIEW", "REVIEW-CONFLICT"];
    for (const r of reg.register) expect(ok).toContain(r.review_status);
  });
});

describe("val 110 — revizijski sled (register-v110-changes.json)", () => {
  test("baseline 14 RC / 5 STABLE / 1 REVIEW → 15 spremenjenih hišnih števil", () => {
    expect(audit.val).toBe(110);
    expect(audit.baseline["p7_conflict"]).toBe(14);
    expect(audit.baseline["p7_stable"]).toBe(5);
    expect(audit.baseline["p7_review"]).toBe(1);
    expect(audit.post_tally.p7).toEqual({ STABLE: 17, REVIEW: 3, "REVIEW-CONFLICT": 0 });
    expect(audit.post_tally.house_changed).toEqual([
      "85", "86", "87", "88", "89", "90", "91", "92", "93", "95", "96", "97", "98", "99", "100",
    ]);
  });

  test("snimke: pre/post za pomik primer (bp 85) in bp 90", () => {
    const c85 = audit.changes.find((c) => c.bp_no === "85")!;
    expect(c85.pre.house_no).toBe("45");
    expect(c85.post.house_no).toBe("37");
    const c90 = audit.changes.find((c) => c.bp_no === "90")!;
    expect(c90.pre.house_no).toBe("44");
    expect(c90.post.house_no).toBe("43");
  });
});

describe("val 110 — page-records + reconciliation", () => {
  test("page-records p7 ima nativni blok (sekvenca, fantomi, rdeča revizija)", () => {
    const p7rec = pages.find((p) => p.page === 7)!;
    expect(p7rec.v110_native).toBeDefined();
    expect(p7rec.v110_native!["house_no_sequence"]).toContain("39 70 — —");
    expect(p7rec.v110_native!["phantom_rows"]).toContain("PRAZNI");
    expect(p7rec.v110_native!["red_crossings"]).toContain("12 vrstic");
    expect(p7rec.v110_native!["scan"]).toContain("2727x2117");
  });

  test("reconciliation val110: F2 resolved + Zollamt + fantomi + iskrenost", () => {
    expect(rec.val110).toBeDefined();
    expect(rec.val110!["f2_resolved"]).toContain("RESOLVED-V110");
    expect(rec.val110!["bp98_zollamt"]).toContain("h.70");
    expect(rec.val110!["phantoms"]).toContain("Bruckmühle");
    expect(rec.val110!["pr_second_pass"]).toContain("8ten April 1825");
    expect(rec.val110!["honesty"]).toContain("TRANSCRIBED=0");
  });

  test("open_for_full_res: 'PT p7 rep' prešel v RESOLVED-V110", () => {
    const resolved = rec.open_for_full_res.filter((x) => x.includes("PT p7 rep"));
    expect(resolved.length).toBe(1);
    expect(resolved[0]).toContain("RESOLVED-V110");
  });
});

describe("val 110 — surovine (raw-web-val110-2026-09)", () => {
  test("nativni skeni + direktni odtis + summary + sha256 obstajajo", () => {
    for (const f of [
      "native-p07.jpeg", "native-p07.png",
      "native-pr-p02.jpeg", "native-pr-p03.jpeg", "native-pr-p04.jpeg",
      "direct-reads-v110.md", "summary.json", "sha256.txt",
      "pt7-rows-contact.png", "pt7-col-house.png",
    ]) {
      expect(existsSync(join(raw, f))).toBe(true);
    }
  });

  test("PDF hashi se ujemajo z sha256.txt (ponovljivost prevzema)", () => {
    const sha = readFileSync(join(raw, "sha256.txt"), "utf8");
    expect(sha).toContain("f7b68454fd8fd819");
    expect(sha).toContain("18280dae40af21ec");
    expect(sha).toContain("n083pt.pdf");
    expect(sha).toContain("n083pr.pdf");
  });

  test("summary.json: val 110, 0 VLM klicev, razporeditev rezultatov", () => {
    const s = JSON.parse(readFileSync(join(raw, "summary.json"), "utf8")) as {
      val: number; honesty: string; register: Record<string, unknown>;
    };
    expect(s.val).toBe(110);
    expect(s.honesty).toContain("TRANSCRIBED=0");
    expect(s.register["p7_post"]).toContain("17 STABLE");
    expect(s.register["bp98"]).toContain("70");
  });

  test("direktni odtis: izkazan je kot predbitna branja (iskrenost)", () => {
    const dr = readFileSync(join(raw, "direct-reads-v110.md"), "utf8");
    expect(dr).toContain("predbitno");
    expect(dr).toContain("Neustadtl am 8ten April 1825");
    expect(dr).toContain("Definitive Grenzbeschreibung");
    expect(dr).toContain("NEUSKLADNO z val 42");
  });
});

describe("val 110 — muzejske opombe (museum-content.ts)", () => {
  test("PR vir: definitivni naslov, datum 1825, razkol sosedov, negativen zadetek", () => {
    expect(mc).toContain("Definitive Grenzbeschreibung der Gemeinde „GRÜBLE“«, 8. april 1825");
    expect(mc).toContain("Neustadtl am 8ten April 1825");
    expect(mc).toContain("razkol je dokumentiran in nerešen");
    expect(mc).toContain("re-read in val 110 at the native scan resolution");
  });

  test("PT vir: nativni re-read p7 + Zollamt h.70 + fantomi", () => {
    expect(mc).toContain("V 110. valu je strani 7 (III.P., stan. št. 81–98) ponovno prebrana");
    expect(mc).toContain("2727×2117");
    expect(mc).toContain("Zollamt ↔ stan. parcela 98 ↔ hišna št. 70");
    expect(mc).toContain("odčitki vsotne vrstice");
    expect(mc).toContain("misreadings of the sum row");
  });
});
