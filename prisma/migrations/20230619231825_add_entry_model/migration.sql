-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
