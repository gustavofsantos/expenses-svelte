-- CreateTable
CREATE TABLE "CategoryOnEntry" (
    "entryId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryOnEntry_pkey" PRIMARY KEY ("entryId","categoryId")
);

-- AddForeignKey
ALTER TABLE "CategoryOnEntry" ADD CONSTRAINT "CategoryOnEntry_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnEntry" ADD CONSTRAINT "CategoryOnEntry_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
