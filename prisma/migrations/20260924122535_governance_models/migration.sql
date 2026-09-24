-- AlterTable
ALTER TABLE "GuestbookEntry" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedBy" TEXT,
ADD COLUMN     "moderationNote" TEXT,
ADD COLUMN     "previousStatus" TEXT,
ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ObjectMemory" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedBy" TEXT,
ADD COLUMN     "moderationNote" TEXT,
ADD COLUMN     "previousStatus" TEXT,
ADD COLUMN     "reportCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "archiveRecordId" TEXT,
ADD COLUMN     "attribution" TEXT,
ADD COLUMN     "commercialUse" TEXT DEFAULT 'UNKNOWN',
ADD COLUMN     "copyrightHolder" TEXT,
ADD COLUMN     "creator" TEXT,
ADD COLUMN     "licenseUrl" TEXT,
ADD COLUMN     "permissionEvidence" TEXT,
ADD COLUMN     "permissionToModify" TEXT DEFAULT 'UNKNOWN',
ADD COLUMN     "permissionToPublish" TEXT DEFAULT 'UNKNOWN',
ADD COLUMN     "restrictions" TEXT,
ADD COLUMN     "rightsVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ExhibitVersion" (
    "id" TEXT NOT NULL,
    "exhibitId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "snapshot" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "prevVersion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExhibitVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceVersion" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "snapshot" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "prevVersion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "exhibitId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'sl',
    "evidenceStatus" TEXT NOT NULL,
    "confidence" TEXT,
    "sourceId" TEXT,
    "archiveRecordId" TEXT,
    "pageRef" TEXT,
    "researcherNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchiveRecord" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "repository" TEXT,
    "fonds" TEXT NOT NULL,
    "series" TEXT,
    "unit" TEXT,
    "signature" TEXT NOT NULL,
    "identifier" TEXT,
    "dateFrom" TEXT,
    "dateTo" TEXT,
    "digitized" BOOLEAN NOT NULL DEFAULT false,
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "repositoryUrl" TEXT,
    "physicalLocation" TEXT,
    "pageRef" TEXT,
    "researchStatus" TEXT NOT NULL DEFAULT 'NOT_VIEWED',
    "researcherNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArchiveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "correlationId" TEXT,
    "idempotencyKey" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExhibitVersion_status_idx" ON "ExhibitVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ExhibitVersion_exhibitId_version_key" ON "ExhibitVersion"("exhibitId", "version");

-- CreateIndex
CREATE INDEX "SourceVersion_status_idx" ON "SourceVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SourceVersion_sourceId_version_key" ON "SourceVersion"("sourceId", "version");

-- CreateIndex
CREATE INDEX "Claim_exhibitId_status_idx" ON "Claim"("exhibitId", "status");

-- CreateIndex
CREATE INDEX "Claim_evidenceStatus_idx" ON "Claim"("evidenceStatus");

-- CreateIndex
CREATE INDEX "Claim_sourceId_idx" ON "Claim"("sourceId");

-- CreateIndex
CREATE INDEX "ArchiveRecord_researchStatus_idx" ON "ArchiveRecord"("researchStatus");

-- CreateIndex
CREATE INDEX "ArchiveRecord_fonds_idx" ON "ArchiveRecord"("fonds");

-- CreateIndex
CREATE UNIQUE INDEX "ArchiveRecord_institution_signature_key" ON "ArchiveRecord"("institution", "signature");

-- CreateIndex
CREATE UNIQUE INDEX "Job_idempotencyKey_key" ON "Job"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Job_status_type_idx" ON "Job"("status", "type");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_archiveRecordId_fkey" FOREIGN KEY ("archiveRecordId") REFERENCES "ArchiveRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitVersion" ADD CONSTRAINT "ExhibitVersion_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceVersion" ADD CONSTRAINT "SourceVersion_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_archiveRecordId_fkey" FOREIGN KEY ("archiveRecordId") REFERENCES "ArchiveRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Data migration (#27/G): prejšnji status »held« se preimenuje v »pending«
-- (profesionalen moderation workflow — pomen enak: čaka na kurotorski pregled).
UPDATE "GuestbookEntry" SET "status" = 'pending' WHERE "status" = 'held';
UPDATE "ObjectMemory" SET "status" = 'pending' WHERE "status" = 'held';
