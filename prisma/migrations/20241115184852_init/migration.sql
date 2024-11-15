-- CreateTable
CREATE TABLE "demographics" (
    "phoneNumber" TEXT NOT NULL,
    "takeCount" INTEGER NOT NULL,
    "donateCount" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "householdSize" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "lastVisitDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "demographics_pkey" PRIMARY KEY ("phoneNumber")
);

-- CreateTable
CREATE TABLE "inventory" (
    "itemName" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "units" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("itemName","units")
);
