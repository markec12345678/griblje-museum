-- CreateTable
CREATE TABLE "DigitalAsset" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sha256" TEXT NOT NULL,
    "creator" TEXT,
    "copyrightHolder" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "licenseUrl" TEXT,
    "attribution" TEXT,
    "origin" TEXT,
    "kind" TEXT NOT NULL,
    "preservationStatus" TEXT NOT NULL DEFAULT 'ACTIVE',
    "accessLevel" TEXT NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exhibitId" TEXT,
    "derivedFromId" TEXT,
    "replacedById" TEXT,

    CONSTRAINT "DigitalAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DigitalAsset_storageKey_key" ON "DigitalAsset"("storageKey");

-- CreateIndex
CREATE INDEX "DigitalAsset_exhibitId_idx" ON "DigitalAsset"("exhibitId");

-- CreateIndex
CREATE INDEX "DigitalAsset_kind_idx" ON "DigitalAsset"("kind");

-- CreateIndex
CREATE INDEX "DigitalAsset_accessLevel_idx" ON "DigitalAsset"("accessLevel");

-- CreateIndex
CREATE INDEX "DigitalAsset_sha256_idx" ON "DigitalAsset"("sha256");

-- CreateIndex
CREATE INDEX "DigitalAsset_preservationStatus_idx" ON "DigitalAsset"("preservationStatus");

-- AddForeignKey
ALTER TABLE "DigitalAsset" ADD CONSTRAINT "DigitalAsset_exhibitId_fkey" FOREIGN KEY ("exhibitId") REFERENCES "Exhibit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalAsset" ADD CONSTRAINT "DigitalAsset_derivedFromId_fkey" FOREIGN KEY ("derivedFromId") REFERENCES "DigitalAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalAsset" ADD CONSTRAINT "DigitalAsset_replacedById_fkey" FOREIGN KEY ("replacedById") REFERENCES "DigitalAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
