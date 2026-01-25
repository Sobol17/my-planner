/*
  Warnings:

  - You are about to alter the column `defaultPrice` on the `service` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "service" ALTER COLUMN "defaultPrice" SET DATA TYPE INTEGER;
