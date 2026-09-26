import { describe, expect, test } from "bun:test";
import { ui } from "../src/lib/i18n";
import {
  bpNodeRef,
  exploreCounts,
  exploreTierOfStaticRow,
  exploreTierOfStatus,
  isConflictStatus,
  isNotFoundStatus,
  matchesExploreQuery,
  modeAllowsTier,
  staticRowVisible,
  type ExploreBuildingRow,
  type ExploreFilters,
} from "../src/lib/atlas-explore";
import { evidenceTier, generateEntityStory } from "../src/lib/atlas-story-engine";
import kgRaw from "../src/data/knowledge-graph-1825.json";

/**
 * Val 71 — EXPLORE 1825 (issue #42 §19) + zgodba UI (§16/§22).
 * Čista logika (src/lib/atlas-explore.ts) + pariteta tier preslikave
 * z story engine-om (§17) + i18n struktura (atlasStory × 5 jezikov).
 */

const row = (over: Partial<ExploreBuildingRow>): ExploreBuildingRow => ({
  bp: "40",
  ...over,
});

describe("explore: statični sloj — preslikava v dokazni tir", () => {
  test("VERIFIED-2x → DOKAZANO (dvojno branje PT p7)", () => {
    expect(exploreTierOfStaticRow(row({ owner: "X", owner_status: "VERIFIED-2x" }))).toBe("DOKAZANO");
  });

  test("vezan lastnik brez verifikacije → VERJETNO", () => {
    expect(exploreTierOfStaticRow(row({ owner: "X" }))).toBe("VERJETNO");
    expect(exploreTierOfStaticRow(row({ owner: "X", owner_status: "REVIEW" }))).toBe("VERJETNO");
  });

  test("brez lastnika → NEZNANO", () => {
    expect(exploreTierOfStaticRow(row({}))).toBe("NEZNANO");
  });
});

describe("explore: zrcalna preslikava statusov = story engine (§17 pariteta)", () => {
  test("TIER_EXACT natančna tabela se ujema z engine za vse statusne nize iz KG", () => {
    const statuses = new Set<string>();
    const kg = kgRaw as unknown as {
      nodes: { evidence_status?: string }[];
      edges: { evidence_status?: string }[];
      claims: { status?: string }[];
    };
    for (const n of kg.nodes) if (n.evidence_status) statuses.add(n.evidence_status);
    for (const e of kg.edges) if (e.evidence_status) statuses.add(e.evidence_status);
    for (const c of kg.claims) if (c.status) statuses.add(c.status);
    expect(statuses.size).toBeGreaterThan(5);
    for (const s of statuses) {
      expect(exploreTierOfStatus(s)).toBe(evidenceTier(s));
    }
  });

  test("varovalni vzorci: neznani status je NIKOLI tiho DOKAZANO", () => {
    expect(exploreTierOfStatus("SOME_NEW_STATUS")).toBe("VERJETNO");
    expect(exploreTierOfStatus("HOUSE-CONFLICT-A")).toBe("KONFLIKTNO");
    expect(exploreTierOfStatus("BP_NOT_FOUND_X")).toBe("NEZNANO");
    expect(exploreTierOfStatus(undefined)).toBe("NEZNANO");
    expect(exploreTierOfStatus("")).toBe("NEZNANO");
  });

  test("konflikt in NOT_FOUND pomožnika", () => {
    expect(isConflictStatus("REVIEW-CONFLICT")).toBe(true);
    expect(isConflictStatus("VERIFIED-2x")).toBe(false);
    expect(isNotFoundStatus("NOT_FOUND")).toBe(true);
    expect(isNotFoundStatus("FOUND")).toBe(false);
  });
});

describe("explore: filtri vidnosti (§19: samo dokazano / konflikti / neznano)", () => {
  const buildings: ExploreBuildingRow[] = [
    row({ bp: "24", owner: "A", owner_status: "VERIFIED-2x" }),
    row({ bp: "52", owner: "B" }),
    row({ bp: "99" }),
  ];

  test("mode all pokaže vse", () => {
    expect(buildings.filter((b) => staticRowVisible(b, "all")).length).toBe(3);
  });

  test("mode evidenced pokaže samo DOKAZANO", () => {
    const vis = buildings.filter((b) => staticRowVisible(b, "evidenced"));
    expect(vis).toHaveLength(1);
    expect(vis[0].bp).toBe("24");
  });

  test("mode conflicts pokaže samo konfliktne (statični sloj: brez → prazno)", () => {
    expect(buildings.filter((b) => staticRowVisible(b, "conflicts"))).toHaveLength(0);
    expect(staticRowVisible(row({ owner: "C", owner_status: "REVIEW-CONFLICT" }), "conflicts")).toBe(true);
  });

  test("mode unknown pokaže samo brez lastnika", () => {
    const vis = buildings.filter((b) => staticRowVisible(b, "unknown"));
    expect(vis).toHaveLength(1);
    expect(vis[0].bp).toBe("99");
  });

  test("modeAllowsTier sledi istim pravilom za KG sloje", () => {
    expect(modeAllowsTier("DOKAZANO", "evidenced")).toBe(true);
    expect(modeAllowsTier("VERJETNO", "evidenced")).toBe(false);
    expect(modeAllowsTier("KONFLIKTNO", "conflicts")).toBe(true);
    expect(modeAllowsTier("DOKAZANO", "conflicts")).toBe(false);
    expect(modeAllowsTier("NEZNANO", "unknown")).toBe(true);
    expect(modeAllowsTier(exploreTierOfStatus("UNKNOWN_SEMANTICS"), "unknown")).toBe(false); // engine: UNKNOWN_SEMANTICS = VERJETNO
  });

  test("besedilni filter: BP / hišna številka / lastnik", () => {
    expect(matchesExploreQuery("40", ["40", 40, "Sautter"])).toBe(true);
    expect(matchesExploreQuery("saut", ["Sautter"])).toBe(true);
    expect(matchesExploreQuery("999", ["40"])).toBe(false);
    expect(matchesExploreQuery("", [""])).toBe(true);
  });

  test("exploreCounts šteje vidne po slojih", () => {
    const filters: ExploreFilters = { mode: "evidenced", query: "" };
    const c = exploreCounts(
      buildings,
      [{ node_id: "HOUSE:H-040", house_no_1825: "40", evidence_status: "CONFLICT", located: true }],
      [{ node_id: "MO:MO-A01-002", label: "hiša 94", bp_glyph: "94", evidence_status: "REVIEW", sheet: "A01" }],
      filters,
      exploreTierOfStatus
    );
    expect(c.visibleBuildings).toBe(1);
    expect(c.visibleHouses).toBe(0); // CONFLICT v evidenced načinu ni viden
    expect(c.visibleObjects).toBe(0); // REVIEW v evidenced načinu ni viden
  });
});

describe("explore: reference entitet za story engine", () => {
  test("bpNodeRef podaja na 3 mesta (vzorec BP:0xx)", () => {
    expect(bpNodeRef("40")).toBe("BP:040");
    expect(bpNodeRef("7")).toBe("BP:007");
    expect(bpNodeRef(94)).toBe("BP:094");
    expect(bpNodeRef("100")).toBe("BP:100");
  });

  test("BP:040 se razreši v zgodbo (klik na BP marker) — EVIDENCED, ni NOT_PUBLISHED", () => {
    const story = generateEntityStory("BP:040");
    expect(story).not.toBeNull();
    expect(story!.focus.node_id).toBe("BP:040");
    expect(story!.contract.story_status).toBe("EVIDENCED");
    // domenska resnica (val 54): BP številka ≠ hišna številka — BP:040 vodi k
    // hiši, ki jo dokazuje KG (H-029), ne k hiši 40. UI ne ugiba: verigo
    // razreši story engine iz grafa.
    const entities = story!.sections.flatMap((s) => s.items.flatMap((i) => i.entity_ids ?? []));
    expect(entities.filter((e) => e.startsWith("HOUSE:")).length).toBeGreaterThan(0);
    expect(entities).not.toContain("HOUSE:H-040"); // ugibanje prepovedano
  });
});

describe("explore: i18n struktura atlasStory × 5 jezikov", () => {
  const langs = ["sl", "en", "hr", "de", "it"] as const;

  test("vsak jezik ima identičen nabor atlasStory ključev", () => {
    const slKeys = Object.keys(ui.sl.atlasStory).sort();
    for (const l of langs) {
      expect(Object.keys(ui[l].atlasStory).sort()).toEqual(slKeys);
    }
    expect(slKeys.length).toBeGreaterThanOrEqual(30);
  });

  test("kritični nizi: noben jezik nima praznih vrednosti; {n}/{visible}/{total} ostanejo", () => {
    for (const l of langs) {
      const s = ui[l].atlasStory;
      for (const [k, v] of Object.entries(s)) {
        expect(typeof v).toBe("string");
        expect((v as string).length).toBeGreaterThan(0);
      }
      expect(s.usedClaims).toContain("{n}");
      expect(s.usedSources).toContain("{n}");
      expect(s.exploreCounts).toContain("{visible}");
      expect(s.exploreCounts).toContain("{total}");
    }
  });

  test("vsi stavki načinov so različni znotraj jezika (UI ločljivost)", () => {
    for (const l of langs) {
      const s = ui[l].atlasStory;
      const modes = new Set([s.modeAll, s.modeEvidenced, s.modeConflicts, s.modeUnknown]);
      expect(modes.size).toBe(4);
    }
  });
});
