/**
 * Tipi muzejske zbirke — skupni frontendu, API-jem in semenu baze.
 */

export type EvidenceStatus =
  | "DOCUMENTED"
  | "CORROBORATED"
  | "TESTIMONY"
  | "TRADITION"
  | "UNVERIFIED"
  | "TO_COLLECT";

export type ExhibitCategory =
  | "kraj"
  | "kolpa"
  | "vojna"
  | "narava"
  | "gospodarstvo"
  | "sege";

export type SourceType =
  | "arhiv"
  | "fotografija"
  | "objava"
  | "spletni-vir"
  | "pricevanje"
  | "zemljevid";

export type ExhibitDTO = {
  id: string;
  slug: string;
  category: ExhibitCategory;
  titleSi: string;
  titleEn: string;
  periodSi: string;
  periodEn: string;
  summarySi: string;
  summaryEn: string;
  storySi: string;
  storyEn: string;
  evidenceStatus: EvidenceStatus;
  image: string | null;
  imageCredit: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  lat: number | null;
  lng: number | null;
  coordsApprox: boolean;
  featured: boolean;
  sortOrder: number;
  sources: SourceDTO[];
};

export type SourceDTO = {
  id: string;
  nameSi: string;
  nameEn: string;
  sourceType: SourceType;
  license: string;
  url: string | null;
  noteSi: string | null;
  noteEn: string | null;
};

export type MuseumEventDTO = {
  id: string;
  titleSi: string;
  titleEn: string;
  descriptionSi: string;
  descriptionEn: string;
  startsAt: string;
  locationSi: string;
  locationEn: string;
  eventType: "PRIREDITEV" | "DELAVNICA" | "VODENJE";
  isExternal: boolean;
  externalUrl: string | null;
};

export type StoryKind = "ZGODBA" | "NACELO" | "RAZPIS";

export type StoryDTO = {
  id: string;
  kind: StoryKind;
  titleSi: string;
  titleEn: string;
  textSi: string;
  textEn: string;
  attributionSi: string | null;
  attributionEn: string | null;
  evidenceStatus: EvidenceStatus;
  sortOrder: number;
};

export type MuseumSnapshot = {
  exhibits: ExhibitDTO[];
  events: MuseumEventDTO[];
  stories: StoryDTO[];
};

// --- Sodelovanje skupnosti (spominska knjiga, spomini ob predmetu) ---

export type GuestbookEntryDTO = {
  id: string;
  name: string;
  place: string | null;
  message: string;
  lang: string;
  createdAt: string;
};

export type GuestbookDTO = {
  count: number;
  places: number;
  entries: GuestbookEntryDTO[];
};

export type ObjectMemoryDTO = {
  id: string;
  author: string;
  place: string | null;
  memory: string;
  lang: string;
  createdAt: string;
};

export type ObjectMemoriesDTO = {
  count: number;
  memories: ObjectMemoryDTO[];
};

export type ContributionResult = {
  ok: boolean;
  status: "published" | "held";
};
