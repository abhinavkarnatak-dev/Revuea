/*
  Warnings:

  - The values [SCALE] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[shareId]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shareId` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('PARAGRAPH', 'MCQ');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "shareId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Form_shareId_key" ON "Form"("shareId");
