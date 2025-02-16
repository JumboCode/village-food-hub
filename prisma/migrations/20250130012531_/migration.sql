-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'staff', 'volunteer', 'customer');

-- CreateTable
CREATE TABLE "users" (
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "pronouns" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);
