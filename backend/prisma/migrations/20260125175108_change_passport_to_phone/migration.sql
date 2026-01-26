/*
  Warnings:

  - You are about to drop the column `clientPassport` on the `contract` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contract" DROP COLUMN "clientPassport",
ADD COLUMN     "clientPhone" TEXT;
