/*
  Warnings:

  - Made the column `expiresAt` on table `QuizQuestion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QuizQuestion" ALTER COLUMN "expiresAt" SET NOT NULL;
