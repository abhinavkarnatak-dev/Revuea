/*
  Warnings:

  - You are about to drop the column `shareId` on the `Form` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Form_shareId_key";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "shareId";
