-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "type" "EntryType" NOT NULL DEFAULT 'EXPENSE';
