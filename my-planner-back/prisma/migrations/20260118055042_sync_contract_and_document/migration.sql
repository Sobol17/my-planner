/*
  Warnings:

  - You are about to drop the column `dateOfDeath` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `deadmanAge` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `deadmanBirthday` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `deadmanName` on the `contract` table. All the data in the column will be lost.
  - You are about to drop the column `deadmanSize` on the `contract` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contractId]` on the table `document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientFullName` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientPassport` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractDate` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractNumber` to the `contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `contract` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_id_fkey";

-- AlterTable
ALTER TABLE "contract" DROP COLUMN "dateOfDeath",
DROP COLUMN "deadmanAge",
DROP COLUMN "deadmanBirthday",
DROP COLUMN "deadmanName",
DROP COLUMN "deadmanSize",
ADD COLUMN     "clientFullName" TEXT NOT NULL,
ADD COLUMN     "clientPassport" TEXT NOT NULL,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "contractDate" TEXT NOT NULL,
ADD COLUMN     "contractNumber" TEXT NOT NULL,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "document" ADD COLUMN     "contractId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "document_contractId_key" ON "document"("contractId");

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contract"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
