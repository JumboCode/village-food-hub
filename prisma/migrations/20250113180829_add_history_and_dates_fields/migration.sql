-- AlterTable
ALTER TABLE "demographics" ADD COLUMN     "previousVisitDates" TIMESTAMP(3)[];

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "history" JSONB;

-- CreateTable
CREATE TABLE "categories" (
    "itemName" TEXT NOT NULL,
    "units" TEXT[],
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("itemName","name")
);
