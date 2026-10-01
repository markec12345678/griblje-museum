/**
 * Val 117 — PT p7 re-adjudikacija areal stolpca (ISSUE #42 §4/§14 + #43)
 * [pot do podatka: research-griblje/pt-n83/build-register-v117-pt.py + register-v117-changes.json]
 *
 * KLJUČNA NAJDBA: register areal stolpec p7 = SISTEMSKO +1 ZAMAKNJEN za r6–r18
 * (register bp n = nativno bp n−1) — F2-analog za areale (F2 hišne številke val 110).
 *
 * Metoda: native-p07 (2727×2117) + IZMERJENA horizontalna pravila + agentov vid
 * + 9 VLM glasov (read-pt7-v117.mts). 17 popravkov · 1 kolizija (bp81) ·
 * 2 fantoma potrjena · imena NESPREMENJENA (F1: PUA = avtoriteta).
 */
import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const reg = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/register.json"), "utf8"),
) as {
  built: string;
  register: {
    page: number;
    bp_no: string;
    areal_original: string;
    areal_v117?: { status: string; struck: boolean; voices: Record<string, string> };
    owner_original: string;
    house_no: string;
    review_status: string;
  }[];
  exclusions: Record<string, string>;
};
const rec = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/reconciliation.json"), "utf8"),
) as {
  val117: {
    areal_pomik: { pairs_verified: number; f2_analog: string };
    popravki: number;
    kolizije: number;
    vsotna_areal: Record<string, string>;
    owner_voices_v117: Record<string, string>;
    honesty: string;
  };
  open_for_full_res: string[];
  val110: Record<string, string>;
};
const pages = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/page-records.json"), "utf8"),
) as { page: number; v117_areal?: Record<string, unknown> }[];
const ch = JSON.parse(
  readFileSync(join(root, "research-griblje/pt-n83/register-v117-changes.json"), "utf8"),
) as {
  val: number;
  changes: { bp: string | number; old: string; new: string; method: string }[];
  post_tally: Record<string, number>;
};

const p7 = reg.register.filter((r) => r.page === 7);
const byBp = new Map(p7.map((r) => [r.bp_no, r]));

describe("val 117 — PT p7 areal re-adjudikacija [build-register-v117-pt]", () => {
  test("nativna sekvenca arealov (merjena pravila + vid + glasovi)", () => {
    const expected = [
      "11", "52", "292", "21", "76", "26", "28", "91", "192", "88",
      "168", "239", "12", "181", "91", "90", "8", "102", "", "",
    ];
    expect(p7.map((r) => r.areal_original)).toEqual(expected);
  });

  test("POMIK +1 dokazan: register r6–r18 = nativno r5–r17 (13/13 parov)", () => {
    expect(rec.val117.areal_pomik.pairs_verified).toBe(13);
    expect(rec.val117.areal_pomik.f2_analog).toContain("F2 za hišne številke");
    expect(rec.val117.areal_pomik.f2_analog).toContain("zaključi analog za areale");
    // vzorčni pari (register vrednost pri bp n = stara nativna vrednost pri bp n−1):
    const old = { 86: "76", 90: "192", 93: "239", 97: "90", 98: "8" };
    for (const [bp, val] of Object.entries(old)) {
      const c = ch.changes.find((x) => String(x.bp) === bp)!;
      expect(c.old).toBe(val);
    }
  });

  test("17 popravkov + bp81 kolizija REVIEW + fantomi prazni", () => {
    expect(rec.val117.popravki).toBe(17);
    expect(rec.val117.kolizije).toBe(1);
    // bp81: vrednost ostaja 11, status REVIEW (vid 14[?] / vlm 44 / nizko-loč. 11):
    const b81 = byBp.get("81")!;
    expect(b81.areal_original).toBe("11");
    expect(b81.areal_v117!.status).toContain("REVIEW");
    expect(b81.areal_v117!.status).toContain("14");
    expect(b81.areal_v117!.status).toContain("44");
    expect(b81.areal_v117!.struck).toBe(true);
    // fantoma:
    expect(byBp.get("99")!.areal_original).toBe("");
    expect(byBp.get("100")!.areal_original).toBe("");
    expect(byBp.get("99")!.areal_v117!.status).toContain("fantom potrjen");
  });

  test("bp98 (Zollamt) areal = 102 — črno, ne rdeče (vid); 3 vrednostna vira", () => {
    const b98 = byBp.get("98")!;
    expect(b98.areal_original).toBe("102");
    expect(b98.areal_v117!.struck).toBe(false);
    expect(JSON.stringify(b98.areal_v117!.voices)).toContain("vlm_value_level");
    expect(b98.areal_v117!.voices["vlm_value_level"]).toContain("102");
    expect(b98.areal_v117!.voices["register_lowres_pomik"]).toContain("r99");
  });

  test("rdeča revizija: prečrtani areali bp 81, 82, 85, 90–97 (val 110 red_crossings skladno)", () => {
    const struck = p7.filter((r) => r.areal_v117?.struck).map((r) => r.bp_no);
    expect(struck).toEqual(["81", "82", "85", "90", "91", "92", "93", "94", "95", "96", "97"]);
    // neprečrtani:
    for (const bp of ["83", "84", "86", "87", "88", "89", "98"]) {
      expect(byBp.get(bp)!.areal_v117!.struck).toBe(false);
    }
  });

  test("F1 politika: lastniška imena NESPREMENJENA (VLM glasovi = artefakti)", () => {
    expect(rec.val117.owner_voices_v117["status"]).toContain("ARTEFAKTI — NIČ sprememb imen");
    expect(rec.val117.owner_voices_v117["status"]).toContain("PUA = avtoriteta");
    // vzorec: imena ostajajo iz pre-v117 stanja:
    expect(byBp.get("81")!.owner_original).toBe("Krauß Georg");
    expect(byBp.get("98")!.owner_original).toContain("Schim[?]er");
    // hišne številke iz val 110 nespremenjene:
    expect(byBp.get("98")!.house_no).toBe("70");
    expect(byBp.get("85")!.house_no).toBe("37");
  });

  test("changes audit: val 117, 20 vnosov, post_tally", () => {
    expect(ch.val).toBe(117);
    expect(ch.changes.length).toBe(21); // 20 vrstic (bp81–100) + POMIK
    expect(ch.post_tally["popravki"]).toBe(17);
    const pomik = ch.changes.find((c) => c.bp === "POMIK")!;
    expect(pomik.method).toContain("strukturni dokaz");
    expect(pomik.new).toContain("13/13");
  });

  test("reconciliation: val117 sekcija + open_for_full_res posodobljen + val110 ohranjen", () => {
    expect(rec.val117.popravki).toBe(17);
    expect(rec.val117.vsotna_areal["status"]).toContain("REVIEW");
    expect(rec.val117.vsotna_areal["opomba"]).toContain("1701");
    expect(rec.val117.honesty).toContain("TRANSCRIBED = 'tako je zapisano na p7'");
    expect(rec.val117.honesty).toContain("PUA kaskada NI potrebna");
    const p7entry = rec.open_for_full_res.find((x) => x.includes("PT p7"))!;
    expect(p7entry).toContain("RESOLVED-V110");
    expect(p7entry).toContain("REŠENO-delno-v117");
    expect(rec.val110["honesty"]).toContain("TRANSCRIBED=0");
  });

  test("page-records: p7 v117_areal blok z merjenimi pravili + kolizija bp81", () => {
    const p7rec = pages.find((p) => p.page === 7)!;
    expect(p7rec.v117_areal).toBeDefined();
    const rules = p7rec.v117_areal!["measured_rules"] as string;
    expect(rules).toContain("379");
    expect(rules).toContain("2013");
    const seq = p7rec.v117_areal!["nativna_sekvenca_areal"] as Record<string, string>;
    expect(seq["98"]).toBe("102");
    expect(seq["81"]).toContain("14[?]");
    expect(p7rec.v117_areal!["bp81_kolizija"]).toContain("REVIEW");
    expect(p7rec.v117_areal!["prestrike_areal"]).toEqual([81, 82, 85, 90, 91, 92, 93, 94, 95, 96, 97]);
  });

  test("surovine: 9 VLM glasov (4 areal + vsotna + 4 lastnik) + reader; band izrezki regenerabilni (gitignored)", () => {
    const dir = join(root, "research-griblje/raw-web-val110-2026-09/vlm-v117-pt7");
    const done = readdirSync(dir).filter((f) => f.endsWith(".json"));
    expect(done).toHaveLength(9);
    const base = join(root, "research-griblje/raw-web-val110-2026-09");
    // reader komitiran:
    expect(existsSync(join(base, "read-pt7-v117.mts"))).toBe(true);
    // band izrezki pt7v117-*.png = gitignored (22 MB, regenerabilno iz native-p07.png +
    // merjenih pravil 379–2013 — recept v 132-val117) — lokalno obstajajo, v CI ne smejo biti zahtevani:
    const gitignore = readFileSync(join(root, ".gitignore"), "utf8");
    expect(gitignore).toContain("pt7v117-*.png");
    // vir regeneracije (nativni sken) komitiran/hashiran:
    expect(existsSync(join(base, "native-p07.jpeg"))).toBe(true);
  });

  test("iskrenost: areal TRANSCRIBED = 'tako je zapisano'; brez dvigovanja; izključitev dokumentirana", () => {
    // izključitveni vnos val110-areal-owner ostane v zgodovini (zapolnjen z v117):
    expect(JSON.stringify(reg.exclusions)).toContain("val110");
  });
});
