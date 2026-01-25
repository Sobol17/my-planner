/*
  Warnings:

  - Added the required column `deadmanAddress` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadmanAge` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadmanBirthday` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadmanDeathDay` to the `contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contract" ADD COLUMN     "deadmanAddress" TEXT NOT NULL,
ADD COLUMN     "deadmanAge" INTEGER NOT NULL,
ADD COLUMN     "deadmanBirthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "deadmanDeathDay" TIMESTAMP(3) NOT NULL;
