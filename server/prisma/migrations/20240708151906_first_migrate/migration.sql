/*
  Warnings:

  - Added the required column `semester` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "semester" "semesterenum" NOT NULL;
