/**
 * Val 88 — ISSUE #42 §4/§14 + #43: PS N83 digit-split re-read (139 vrstic, p56–94 + p121).
 *
 * Ozadje: val 86 je 333 korekcij vgradil s snimkami, 139 vrstic pa označil
 * v86-review-pass-digit-split (REVIEW — tile glas = DIAGNOSTIKA, ±1 nestabilna).
 * Val 88 = direktno branje izrezkov (instrument val 61, brez VLM): pass A
 * polstrani ×4 + pass B listi ×8 (5-vrstična okna) + pass C posamezni izrezki ×10,
 * 2+ neodvisna prehoda, vrednostna poravnava proti pass1/pass2 kontekstu.
 *
 * Varovalke:
 *  1. artefakti obstajajo + skripte (trajna dokumentacija; rowcrops regenerabilni → gitignore)
 *  2. targets/adjudication/changes: 139 = 139 = 139 (ista množica global_idx)
 *  3. tally: 25 P1 + 37 P2 + 75 T3 + 2 U; vgradnja v register 1:1 (brez tihega prepisovanja)
 *  4. pravilo vrednosti: '|' = izraziti j|k, sicer klafter:=v88 + jaethe:=''
 *     (page-level F-PV-05: pisar piše Kläfter); snimki pass1 + v88 glasovi ohranjeni
 *  5. UNRESOLVED (2): vrednosti ostajajo pass1 + marker + opomba (p63 r13; p121 r0 = F-PV-03)
 *  6. §4/§22: p1–55 + p143 nedotaknjena (v88 sloj); KG je bil ob valu 88 še na v86 stanju
 *     (sha 6fb6fae8) — projekcija 143/143 jo je nasledila v valu 89 (KG v2.1, parcelni
 *     register 930, KG kaskada v pravilnem vrstnem redu KG→story→timeline→coverage)
 *  7. F11 (val 86b): veriga/monotonost/veznost/aritmetika verdikti NESPREMENJENI ob v88
 *     vrednostih; artefakt regeneriran iz v88 registra (re-run byte-identno)
 */
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const RG = join(process.cwd(), "research-griblje");
const PS = join(RG, "ps-n83");
const B88 = join(PS, "band-v88");
const ATLAS = join(RG, "atlas-1825");
const sha256 = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");

type RegisterRow = Record<string, unknown> & { page: number; jaethe: string; klafter: string };
const register = JSON.parse(readFileSync(join(PS, "register.json"), "utf8")) as RegisterRow[];
const targets = JSON.parse(readFileSync(join(B88, "targets-v88.json"), "utf8")) as {
  meta: { val: number; generated_by: string; method: string };
  targets: { global_idx: number; page: number; page_row: number }[];
};
const adjudication = JSON.parse(readFileSync(join(B88, "adjudication-v88.json"), "utf8")) as {
  meta: { val: number; method: string; statuses: string; missing?: unknown[] };
  adjudications: { global_idx: number; page: number; page_row: number; p1: string; p2: string; tile_diag: string; v88: string | null; status: "P1" | "P2" | "T3" | "U" }[];
  missing: unknown[];
};
const changes = JSON.parse(readFileSync(join(B88, "register-v88-changes.json"), "utf8")) as {
  meta: { val: number; generated_by: string; source: string };
  tally: Record<string, number>;
  changes: { global_idx: number; page: number; row: number; type: string; status?: string; old?: { jaethe: string; klafter: string }; new?: { jaethe: string; klafter: string }; p1: string; p2: string }[];
};

describe("val 88 — artefakti in skripte (trajna dokumentacija)", () => {
  test("band-v88 artefakti comittani (targets, passA, adjudication, changes, slots, indeksi)", () => {
    for (const f of [
      "targets-v88.json",
      "passA-v88.json",
      "adjudication-v88.json",
      "register-v88-changes.json",
      "slots-v88.json",
      "strips-uniform.json",
      "sheets-index.json",
      "sheetsB-index.json",
      "cropsC-index.json",
      "rowcrops-manifest.json",
    ]) {
      expect(existsSync(join(B88, f)), f).toBe(true);
    }
  });

  test("vseh 6 skript val 88 comittanih (deterministični pipeline)", () => {
    for (const f of [
      "build-targets-v88.py",
      "align-slots-v88.py",
      "make-sheets-v88.py",
      "make-sheetsB-v88.py",
      "make-rowcrops-v88.py",
      "build-register-v88.py",
    ]) {
      expect(existsSync(join(PS, f)), f).toBe(true);
    }
  });

  test("rowcrops regenerabilni (gitignore — precedens val 85/86: crops-v85/, crops-v86/)", () => {
    const gi = readFileSync(join(process.cwd(), ".gitignore"), "utf8");
    expect(gi).toContain("research-griblje/raw-web-val88-2026-10/");
  });

  test("meta veriga: targets → adjudication → changes vsi val 88 + sklicujejo se na metodo", () => {
    expect(targets.meta.val).toBe(88);
    expect(adjudication.meta.val).toBe(88);
    expect(changes.meta.val).toBe(88);
    expect(changes.meta.source).toContain("adjudication-v88.json");
    expect(targets.meta.method).toContain("inverzija merge_tiles");
    expect(adjudication.meta.method).toContain("pass A");
    expect((adjudication.meta.missing ?? adjudication.missing) ?? []).toHaveLength(0);
  });
});

describe("val 88 — množice in tally (139 = 139 = 139)", () => {
  test("targets/adjudication/changes: enaka množica global_idx, brez dvojnikov", () => {
    const st = new Set(targets.targets.map((t) => t.global_idx));
    const sa = new Set(adjudication.adjudications.map((a) => a.global_idx));
    const sc = new Set(changes.changes.map((c) => c.global_idx));
    expect(st.size).toBe(139);
    expect(sa.size).toBe(139);
    expect(sc.size).toBe(139);
    expect([...st].sort()).toEqual([...sa].sort());
    expect([...sa].sort()).toEqual([...sc].sort());
  });

  test("strani = 21 (p56–94 + p121), vsaka v območju v86 pokritosti", () => {
    const pages = new Set(targets.targets.map((t) => t.page));
    expect(pages.size).toBe(21);
    for (const p of pages) {
      expect(p >= 56 && p <= 94 || p === 121, `p${p}`).toBe(true);
    }
  });

  test("tally: 25 P1 + 37 P2 + 75 T3 + 2 U = 139", () => {
    const byStatus = new Map<string, number>();
    for (const a of adjudication.adjudications) byStatus.set(a.status, (byStatus.get(a.status) ?? 0) + 1);
    expect(byStatus.get("P1")).toBe(25);
    expect(byStatus.get("P2")).toBe(37);
    expect(byStatus.get("T3")).toBe(75);
    expect(byStatus.get("U")).toBe(2);
    expect(changes.tally["resolved-P1"]).toBe(25);
    expect(changes.tally["resolved-P2"]).toBe(37);
    expect(changes.tally["resolved-T3"]).toBe(75);
    expect(changes.tally["unresolved"]).toBe(2);
  });

  test("vsak P1/P2/T3 nosi v88 vrednost; vsak U ima v88 = null", () => {
    for (const a of adjudication.adjudications) {
      if (a.status === "U") {
        expect(a.v88, `gi${a.global_idx}`).toBeNull();
      } else {
        expect(typeof a.v88 === "string" && (a.v88 ?? "").length > 0, `gi${a.global_idx}`).toBe(true);
      }
    }
  });
});

describe("val 88 — vgradnja v register.json (precedens val 61/86: snimke + oznake)", () => {
  test("register 2.876 vrstic (val 115: +4 vstavljene); točno 139 z v88 polji", () => {
    expect(register).toHaveLength(2876);
    const v88rows = register.filter(
      (r) => r["v88_status"] !== undefined || r["jaethe_v88"] !== undefined || r["klafter_v88"] !== undefined || String(r["jk_review"] ?? "").startsWith("v88")
    );
    expect(v88rows).toHaveLength(139);
  });

  test("vsak resolved: register = new (changes), status ujema, snimki pass1 ohranjeni", () => {
    // val 115: 4 vstavljene vrstice (globalni indeksi 647, 761, 912, 932 — band-v113/register-v115-changes.json)
    // premaknejo vse kasnejše globalne indekse registra; ta preslikava vrne TRENUTNI indeks iz v88-era gi
    const gi115 = (gi: number): number =>
      gi >= 932 ? gi + 4 : gi >= 912 ? gi + 3 : gi >= 761 ? gi + 2 : gi >= 647 ? gi + 1 : gi; // val 115 vstavitve
    const gi124 = (gi: number): number => {
      const g = gi115(gi);
      return g >= 93 ? g + 1 : g; // val 124: +1 vstavljena vrstica pri 93 (p7 Nro 92 — F-V123-01 dvojni anchor)
    };
    for (const c of changes.changes) {
      const r = register[gi124(c.global_idx)];
      if (c.type === "v88_resolution") {
        expect(String(r.jaethe), `gi${c.global_idx} jaethe`).toBe(String(c.new!.jaethe));
        expect(String(r.klafter), `gi${c.global_idx} klafter`).toBe(String(c.new!.klafter));
        expect(String(r.v88_status), `gi${c.global_idx} status`).toBe(c.status!);
        expect(String(r.jaethe_pass1_v82), `gi${c.global_idx} p1 snimka`).toBe(String(c.old!.jaethe));
        expect(String(r.klafter_pass1_v82), `gi${c.global_idx} k snimka`).toBe(String(c.old!.klafter));
        expect(String(r.jk_review)).toBe("v88-digit-split-RESOLVED");
      } else {
        expect(c.type).toBe("v88_unresolved");
        expect(String(r.jk_review)).toBe("v88-digit-split-UNRESOLVED");
      }
    }
  });

  test("pravilo vrednosti: '|' = izraziti j|k; sicer klafter:=v88 + jaethe='' (F-PV-05 page-level)", () => {
    const gi115 = (gi: number): number =>
      gi >= 932 ? gi + 4 : gi >= 912 ? gi + 3 : gi >= 761 ? gi + 2 : gi >= 647 ? gi + 1 : gi; // val 115 vstavitve
    const gi124 = (gi: number): number => {
      const g = gi115(gi);
      return g >= 93 ? g + 1 : g; // val 124: +1 vstavljena vrstica pri 93 (p7 Nro 92 — F-V123-01 dvojni anchor)
    }; // val 115 vstavitve
    for (const a of adjudication.adjudications) {
      if (a.status === "U") continue;
      const r = register[gi124(a.global_idx)];
      if (a.v88!.includes("|")) {
        const [j, k] = a.v88!.split("|");
        expect(String(r.jaethe), `gi${a.global_idx}`).toBe(j);
        expect(String(r.klafter), `gi${a.global_idx}`).toBe(k);
      } else {
        expect(String(r.jaethe), `gi${a.global_idx}`).toBe("");
        expect(String(r.klafter), `gi${a.global_idx}`).toBe(a.v88 as string);
      }
      expect(String(r.jaethe_v88), `gi${a.global_idx} jv88`).toBe(String(r.jaethe));
      expect(String(r.klafter_v88), `gi${a.global_idx} kv88`).toBe(String(r.klafter));
    }
  });

  test("UNRESOLVED (gi 1226 p63 r13, gi 2384 p121 r0): vrednosti = pass1 + opomba, brez v88_status", () => {
    const gi115 = (gi: number): number =>
      gi >= 932 ? gi + 4 : gi >= 912 ? gi + 3 : gi >= 761 ? gi + 2 : gi >= 647 ? gi + 1 : gi; // val 115 vstavitve
    const gi124 = (gi: number): number => {
      const g = gi115(gi);
      return g >= 93 ? g + 1 : g; // val 124: +1 vstavljena vrstica pri 93 (p7 Nro 92 — F-V123-01 dvojni anchor)
    }; // val 115 vstavitve
    const us = adjudication.adjudications.filter((a) => a.status === "U");
    expect(us.map((a) => a.global_idx).sort()).toEqual([1226, 2384]);
    for (const a of us) {
      const r = register[gi124(a.global_idx)];
      expect(String(r.jaethe), `gi${a.global_idx}`).toBe(String(r.jaethe_pass1_v82));
      expect(String(r.klafter), `gi${a.global_idx}`).toBe(String(r.klafter_pass1_v82));
      expect(String(r.v88_note)).toContain("nejasen");
      expect(r["v88_status"]).toBeUndefined();
      expect(r["jaethe_v88"]).toBeUndefined();
    }
  });

  test("števci markerjev: 137 RESOLVED + 2 UNRESOLVED; v86-review-pass-digit-split = 7 (FRESH part-2 markerji val 98 na p95–109, part-1 vsi promovirani)", () => {
    const cnt = new Map<string, number>();
    for (const r of register) {
      const m = String(r.jk_review ?? "");
      if (m.startsWith("v88")) cnt.set(m, (cnt.get(m) ?? 0) + 1);
    }
    expect(cnt.get("v88-digit-split-RESOLVED")).toBe(137);
    expect(cnt.get("v88-digit-split-UNRESOLVED")).toBe(2);
    // val 98 (86b del 2): 7 novih part-2 digit-split markerjev (p95–109, čaka re-read vzorec val 88);
    // vseh 139 part-1 markerjev je še vedno promoviranih
    expect(register.filter((r) => r.jk_review === "v86-review-pass-digit-split" && (r.page as number) <= 94)).toHaveLength(0);
    expect(register.filter((r) => r.jk_review === "v86-review-pass-digit-split")).toHaveLength(0); // val 108 re-read: vseh 63 promoviranih v v108-re-read
  });
});

describe("val 88 — §4/§22 disciplina (brez tihе kaskade)", () => {
  test("p1–55 + p143 brez v88 polj (območje re-reada striktno p56–94 + p121)", () => {
    for (const r of register) {
      const hasV88 = r["v88_status"] !== undefined || r["jaethe_v88"] !== undefined || r["klafter_v88"] !== undefined;
      if ((r.page as number) <= 55 || (r.page as number) === 143) {
        expect(hasV88, `p${r.page}`).toBe(false);
      }
    }
  });

  test("KG nosi val 112 stanje (kaskada) — j|k vrednosti ostajajo izven KG polj", () => {
    // val 88 je bil KG puščal na v86 stanju (6fb6fae8); val 89 §5 projekcija (b4f5011c); val 98 86b del 2 (2b16acad); val 107 86b del 3 (9f856d28); val 112 F-PV-07 p5/p7/p12 (5ae52bd8)
    expect(sha256(join(ATLAS, "knowledge-graph-1825.json"))).toMatch(/^1e49de43/); // val 119 del 2e (val 2d-x3 je bil 62d8cfea, val 114 376e2b27)
  });

  test("parcelni register nosi projekcija 143/143 + F-PV-05/07 korekcije (val 112: 735 → 676); negative register ostaja 14", () => {
    const pr = JSON.parse(readFileSync(join(ATLAS, "parcel-register-1825.json"), "utf8")) as {
      ps_parcels_total: number;
      val: string;
    };
    expect(pr.ps_parcels_total).toBe(392); // val 108: 735 → … → val 114: 391 → val 115: 392
    expect(pr.val).toBe("108");
    const nr = JSON.parse(readFileSync(join(ATLAS, "negative-result-register-1825.json"), "utf8")) as {
      negatives_total: number;
      negatives: { neg_id: string }[];
    };
    expect(nr.negatives_total).toBe(14);
    expect(nr.negatives.map((n) => n.neg_id)).toContain("NR-14");
  });

  test("audit revizija val 86 (register-v86-changes.json) NI prepisana — tally ostaja 139 review", () => {
    const v86 = JSON.parse(readFileSync(join(PS, "band-v86", "register-v86-changes.json"), "utf8")) as {
      tally: Record<string, number>;
    };
    expect(v86.tally["v86-review-pass-digit-split"]).toBe(139);
    expect(v86.tally["v86-tiles-jk"]).toBe(287);
  });
});

describe("val 88 — F11 (val 86b) ob v88 vrednostih", () => {
  const f11 = JSON.parse(readFileSync(join(PS, "band-v86", "f11-fuertrag-v86.json"), "utf8")) as {
    counter_monotone: string;
    counter_violations: unknown[];
    link_p54_p56: { p54_counter: number; first_strict_page: number; first_strict_counter: number; delta: number; ok: boolean };
    voice_review: { page: number; verdict: string }[];
    arithmetic: { verdict: string }[];
    anchors_v85_check: { any_voice_match: boolean }[];
  };

  test("verdikti verige: 9 kršitev monotonosti (val 98: 5 → val 107: 9 — novi v86 sumniki na p110–141), veznost p54→p58 delta 4 OK", () => {
    expect(f11.counter_violations).toHaveLength(9);
    expect(f11.link_p54_p56.delta).toBe(4);
    expect(f11.link_p54_p56.ok).toBe(true);
    expect(f11.link_p54_p56.p54_counter).toBe(52);
    expect(f11.link_p54_p56.first_strict_counter).toBe(56);
  });

  test("3-glas REVIEW strani + aritmetika + sidra: 52 / 0 OK + 79 REVIEW / 3 od 7 (val 98: 38→41, val 107: 41→52 strani)", () => {
    expect(f11.voice_review.filter((v) => v.verdict === "REVIEW")).toHaveLength(52);
    const ok = f11.arithmetic.filter((a) => a.verdict === "OK").length;
    const review = f11.arithmetic.filter((a) => a.verdict === "REVIEW").length;
    expect(ok).toBe(0);
    expect(review).toBe(79);
    expect(f11.anchors_v85_check.filter((a) => a.any_voice_match)).toHaveLength(3);
  });

  test("F11 re-run byte-identno (determinističen nad v88 registrom)", () => {
    const before = sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"));
    execFileSync("python3", [join(PS, "build-f11-fuertrag-v86.py")], { cwd: process.cwd(), stdio: "ignore" });
    expect(sha256(join(PS, "band-v86", "f11-fuertrag-v86.json"))).toBe(before);
  });
});
