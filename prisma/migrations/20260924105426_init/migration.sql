-- CreateTable
CREATE TABLE "Exhibit" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "museumNo" TEXT,
    "category" TEXT NOT NULL,
    "titleSi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "periodSi" TEXT NOT NULL,
    "periodEn" TEXT NOT NULL,
    "summarySi" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "storySi" TEXT NOT NULL,
    "storyEn" TEXT NOT NULL,
    "evidenceStatus" TEXT NOT NULL,
    "image" TEXT,
    "imageCredit" TEXT,
    "model3dUrl" TEXT,
    "model3dCredit" TEXT,
    "yearFrom" INTEGER,
    "yearTo" INTEGER,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "coordsApprox" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "addedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exhibit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "exhibitId" TEXT NOT NULL,
    "nameSi" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "url" TEXT,
    "noteSi" TEXT,
    "noteEn" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryItem" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "titleSi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "textSi" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "attributionSi" TEXT,
    "attributionEn" TEXT,
    "evidenceStatus" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MuseumEvent" (
    "id" TEXT NOT NULL,
    "titleSi" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "descriptionSi" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "locationSi" TEXT NOT NULL,
    "locationEn" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "externalUrl" TEXT,

    CONSTRAINT "MuseumEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestbookEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "place" TEXT,
    "message" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'sl',
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectMemory" (
    "id" TEXT NOT NULL,
    "exhibitId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "place" TEXT,
    "memory" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'sl',
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObjectMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatDay" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exhibit_slug_key" ON "Exhibit"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Exhibit_museumNo_key" ON "Exhibit"("museumNo");

-- CreateIndex
CREATE INDEX "Exhibit_category_idx" ON "Exhibit"("category");

-- CreateIndex
CREATE INDEX "Exhibit_evidenceStatus_idx" ON "Exhibit"("evidenceStatus");

-- CreateIndex
CREATE INDEX "Exhibit_museumNo_idx" ON "Exhibit"("museumNo");

-- CreateIndex
CREATE INDEX "Source_exhibitId_idx" ON "Source"("exhibitId");

-- CreateIndex
CREATE INDEX "StoryItem_kind_idx" ON "StoryItem"("kind");

-- CreateIndex
CREATE INDEX "GuestbookEntry_status_createdAt_idx" ON "GuestbookEntry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ObjectMemory_exhibitId_status_idx" ON "ObjectMemory"("exhibitId", "status");

-- CreateIndex
CREATE INDEX "ObjectMemory_status_createdAt_idx" ON "ObjectMemory"("status", "createdAt");

-- CreateIndex
CREATE INDEX "StatDay_day_kind_idx" ON "StatDay"("day", "kind");

-- CreateIndex
CREATE INDEX "StatDay_kind_key_idx" ON "StatDay"("kind", "key");

-- CreateIndex
CREATE UNIQUE INDEX "StatDay_day_kind_lang_key_key" ON "StatDay"("day", "kind", "lang", "key");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectMemory" ADD CONSTRAINT "ObjectMemory_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
