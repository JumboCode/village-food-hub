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
