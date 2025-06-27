/*
  Warnings:

  - A unique constraint covering the columns `[theme]` on the table `Form` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `theme` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "theme" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Form_theme_key" ON "Form"("theme");
