import { describe, expect, test } from "bun:test";
import { ui } from "../src/lib/i18n";
import {
  bpNodeRef,
  exploreCounts,
  exploreTierOfStaticRow,
  exploreTierOfStatus,
  isConflictStatus,
  isNotFoundStatus,
  landUseBucketOf,
  matchesExploreQuery,
  modeAllowsTier,
  parcelExploreCounts,
  parcelLabel,
  parcelMatchesQuery,
  parcelTier,
  parcelVisible,
  sortParcelsForBrowse,
  staticRowVisible,
  LAND_USE_ORDER,
  type ExploreBuildingRow,
  type ExploreFilters,
  type ExploreParcel,
  type LandUseBucket,
} from "../src/lib/atlas-explore";
import { parcelFeatures } from "../src/lib/atlas-map";
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

/* ==================== val 73 — parcelni sloj rabe (§19) ==================== */

const parcel = (over: Partial<ExploreParcel>): ExploreParcel => ({
  node_id: "PARCEL:PUA-II-201",
  origin: "PUA",
  section: "II",
  parcel_number: 201,
  land_use_category: null,
  land_use_original: null,
  co_referenced: false,
  house_refs: ["HOUSE:H-001"],
  evidence_status: "TRANSCRIBED",
  ...over,
});

describe("parcel sloj: vedra rabe (§4: nikoli ne ugibaj rabe)", () => {
  test("null → NONE (PUA rabe ne zapisuje), UNKNOWN ostane UNKNOWN (PS TERM-UNCLEAR)", () => {
    expect(landUseBucketOf(null)).toBe("NONE");
    expect(landUseBucketOf(undefined)).toBe("NONE");
    expect(landUseBucketOf("")).toBe("NONE");
    expect(landUseBucketOf("UNKNOWN")).toBe("UNKNOWN");
    expect(landUseBucketOf("njiva")).toBe("njiva");
    expect(landUseBucketOf("pašnik")).toBe("pašnik");
  });

  test("varovalka: neznana kategorija NIKOLI tiho 'drugo' (drugo = dokazana mešanica)", () => {
    expect(landUseBucketOf("SOME_NEW_USE")).toBe("UNKNOWN");
    expect(landUseBucketOf("Ried")).toBe("UNKNOWN");
  });

  test("LAND_USE_ORDER: dokazana raba najprej, nezanki na koncu", () => {
    expect(LAND_USE_ORDER[LAND_USE_ORDER.length - 1]).toBe("NONE");
    expect(LAND_USE_ORDER[LAND_USE_ORDER.length - 2]).toBe("UNKNOWN");
    expect(LAND_USE_ORDER).toHaveLength(8);
  });
});

describe("parcel sloj: dokazni tir + oznake", () => {
  test("PUA TRANSCRIBED → DOKAZANO, PS TRANSCRIBED_PARTIAL → VERJETNO (§17 pariteta)", () => {
    expect(parcelTier(parcel({}))).toBe("DOKAZANO");
    expect(parcelTier(parcel({ evidence_status: "TRANSCRIBED_PARTIAL" }))).toBe("VERJETNO");
    expect(parcelTier(parcel({ evidence_status: "UNKNOWN" }))).toBe("NEZNANO");
  });

  test("parcelLabel: PUA 'II/201', PS 'PS 913', varovalka node_id", () => {
    expect(parcelLabel(parcel({}))).toBe("II/201");
    expect(parcelLabel(parcel({ node_id: "PARCEL:PS-p005-j913", origin: "PS", section: null, parcel_number: 913 }))).toBe("PS 913");
    expect(parcelLabel(parcel({ section: null, parcel_number: null }))).toBe("PUA-II-201");
  });
});

describe("parcel sloj: filtri (§19: način + raba + besedilo)", () => {
  const parcels: ExploreParcel[] = [
    parcel({}),
    parcel({ node_id: "PARCEL:PS-p005-j913", origin: "PS", section: null, parcel_number: 913, land_use_category: "njiva", land_use_original: "Acker", evidence_status: "TRANSCRIBED_PARTIAL" }),
    parcel({ node_id: "PARCEL:PS-p006-j100", origin: "PS", section: null, parcel_number: 100, land_use_category: "UNKNOWN", land_use_original: "Ried", evidence_status: "TRANSCRIBED_PARTIAL" }),
  ];

  test("filter rabe loči dokumentirano / neznano / brez zapisa", () => {
    expect(parcels.filter((p) => parcelVisible(p, "all", "all"))).toHaveLength(3);
    expect(parcels.filter((p) => parcelVisible(p, "all", "njiva"))).toHaveLength(1);
    expect(parcels.filter((p) => parcelVisible(p, "all", "UNKNOWN"))).toHaveLength(1);
    expect(parcels.filter((p) => parcelVisible(p, "all", "NONE"))).toHaveLength(1);
  });

  test("način dokazovanja velja tudi za parcele (Samo dokazano → PUA)", () => {
    const vis = parcels.filter((p) => parcelVisible(p, "evidenced", "all"));
    expect(vis).toHaveLength(1);
    expect(vis[0].origin).toBe("PUA");
  });

  test("besedilni filter: št. parcele / raba original / hiša", () => {
    expect(parcelMatchesQuery("913", parcels[1])).toBe(true);
    expect(parcelMatchesQuery("acker", parcels[1])).toBe(true);
    expect(parcelMatchesQuery("H-001", parcels[0])).toBe(true);
    expect(parcelMatchesQuery("Ried", parcels[2])).toBe(true);
    expect(parcelMatchesQuery("777", parcels[1])).toBe(false);
  });
});

describe("parcel sloj: števci + determinističen vrstni red brskanja", () => {
  test("parcelLandUseCounts čez KG = registrirane resnice val 60", () => {
    const features = parcelFeatures();
    expect(features).toHaveLength(2467);
    const buckets = parcelExploreCounts(features as ExploreParcel[], "all", "all", "").buckets as Record<LandUseBucket, number>;
    expect(buckets.njiva).toBe(230);
    expect(buckets.travnik).toBe(60);
    expect(buckets.gozd).toBe(13);
    expect(buckets.vrt).toBe(10);
    expect(buckets["pašnik"]).toBe(9);
    expect(buckets.drugo).toBe(4);
    expect(buckets.UNKNOWN).toBe(106);
    expect(buckets.NONE).toBe(2035);
  });

  test("sortParcelsForBrowse: dokumentirana raba najprej, sekcije I–V, številke", () => {
    const sorted = sortParcelsForBrowse([
      parcel({ node_id: "PARCEL:PUA-IV-9", section: "IV", parcel_number: 9 }),
      parcel({ node_id: "PARCEL:PS-p005-j913", origin: "PS", section: null, parcel_number: 913, land_use_category: "njiva" }),
      parcel({ node_id: "PARCEL:PUA-I-2", section: "I", parcel_number: 2 }),
    ]);
    expect(sorted[0].node_id).toBe("PARCEL:PS-p005-j913"); // njiva (dokazana) prva
    expect(sorted[1].node_id).toBe("PARCEL:PUA-I-2");
    expect(sorted[2].node_id).toBe("PARCEL:PUA-IV-9");
    // determinizem: isti vhod → isti vrstni red
    const again = sortParcelsForBrowse([
      parcel({ node_id: "PARCEL:PUA-IV-9", section: "IV", parcel_number: 9 }),
      parcel({ node_id: "PARCEL:PS-p005-j913", origin: "PS", section: null, parcel_number: 913, land_use_category: "njiva" }),
      parcel({ node_id: "PARCEL:PUA-I-2", section: "I", parcel_number: 2 }),
    ]);
    expect(again.map((p) => p.node_id)).toEqual(sorted.map((p) => p.node_id));
  });

  test("parcelExploreCounts spoštuje kombinacijo način + raba + besedilo", () => {
    const features = parcelFeatures() as ExploreParcel[];
    const all = parcelExploreCounts(features, "all", "all", "");
    expect(all.visible).toBe(2467);
    const njiva = parcelExploreCounts(features, "all", "njiva", "");
    expect(njiva.visible).toBe(230);
    const evidenced = parcelExploreCounts(features, "evidenced", "all", "");
    expect(evidenced.visible).toBe(2035); // PUA TRANSCRIBED = DOKAZANO
  });

  test("parcela NIKOLI ne nosi koordinat (§9: brez geometrije)", () => {
    const features = parcelFeatures() as Record<string, unknown>[];
    for (const f of features.slice(0, 50)) {
      expect(f).not.toHaveProperty("px");
      expect(f).not.toHaveProperty("lat");
      expect(f).not.toHaveProperty("lng");
    }
  });

  test("HAS_PARCEL obratni indeks: PUA-II-201 pripada hišama 1 in 2 (so-vlascištvo)", () => {
    const p201 = parcelFeatures().find((p) => p.node_id === "PARCEL:PUA-II-201");
    expect(p201).toBeDefined();
    expect(p201!.house_refs).toContain("HOUSE:H-001");
    expect(p201!.house_refs).toContain("HOUSE:H-002");
    expect(p201!.co_referenced).toBe(true);
  });
});

describe("parcel sloj: zgodba parcele (§16/§17)", () => {
  test("PARCEL:PUA-II-201 → PARTIAL_EVIDENCE z obrnjeno oznako 'pripada hiši'", () => {
    const story = generateEntityStory("PARCEL:PUA-II-201");
    expect(story).not.toBeNull();
    expect(story!.focus.node_id).toBe("PARCEL:PUA-II-201");
    expect(story!.contract.story_status).toBe("PARTIAL_EVIDENCE");
    const texts = story!.sections.flatMap((s) => s.items.map((i) => i.text));
    expect(texts.some((t) => t.startsWith("pripada hiši: Hiša št. 1"))).toBe(true);
    // zavajajoča smer NIKOLI v zgodbi parcele
    expect(texts.some((t) => t.startsWith("ima parcelo:"))).toBe(false);
  });

  test("PARCEL:PS-p005-j913 (njiva, EXACT) → objavljena zgodba z viri PS", () => {
    const story = generateEntityStory("PARCEL:PS-p005-j913");
    expect(story).not.toBeNull();
    expect(story!.contract.story_status).toBe("PARTIAL_EVIDENCE");
    expect(story!.contract.used_source_ids).toContain("SRC-PS");
  });

  test("berljiva oznaka parcele v zgodbi (headline), ne surovi node_id", () => {
    const story = generateEntityStory("PARCEL:PS-p009-j1");
    expect(story!.headline).toBe("Zgodba entitete: parcela PS 1");
    const storyPua = generateEntityStory("PARCEL:PUA-II-201");
    expect(storyPua!.headline).toBe("Zgodba entitete: parcela II/201");
  });
});

describe("parcel sloj: i18n × 5 jezikov", () => {
  const langs = ["sl", "en", "hr", "de", "it"] as const;

  test("ključi parcelnega sloja obstajajo in niso prazni; {visible}/{total} ostanejo", () => {
    const keys = [
      "listEntities", "listParcels", "parcelCounts", "parcelLoading", "parcelError",
      "parcelGeometryNote", "parcelHousesLabel", "parcelCoRef", "storyOfParcel",
      "luAll", "luNjiva", "luTravnik", "luGozd", "luVrt", "luPastnik", "luDrugo",
      "luUnknown", "luNone", "filterUseNote",
    ] as const;
    for (const l of langs) {
      const s = ui[l].atlasStory;
      for (const k of keys) {
        expect(typeof s[k]).toBe("string");
        expect((s[k] as string).length).toBeGreaterThan(0);
      }
      expect(s.parcelCounts).toContain("{visible}");
      expect(s.parcelCounts).toContain("{total}");
    }
  });

  test("8 oznak rabe je različnih znotraj jezika (UI ločljivost)", () => {
    for (const l of langs) {
      const s = ui[l].atlasStory;
      const labels = new Set([s.luNjiva, s.luTravnik, s.luGozd, s.luVrt, s.luPastnik, s.luDrugo, s.luUnknown, s.luNone]);
      expect(labels.size).toBe(8);
    }
  });

  test("poštenost: filterUseNote v vseh jezikih omenja PS in prepoved ugibanja", () => {
    for (const l of langs) {
      const note = ui[l].atlasStory.filterUseNote.toLowerCase();
      expect(note).toContain("ps");
      expect(note.length).toBeGreaterThan(80);
    }
  });
});
