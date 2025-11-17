/*
  Warnings:

  - Added the required column `chosen` to the `QuizAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuizAnswer" ADD COLUMN     "chosen" TEXT NOT NULL;
