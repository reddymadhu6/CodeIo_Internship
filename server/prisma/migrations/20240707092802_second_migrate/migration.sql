/*
  Warnings:

  - The primary key for the `course` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `courseId` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `branchId` on the `courseUndertaken` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `courseUndertaken` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `courseUndertaken` table. All the data in the column will be lost.
  - You are about to drop the column `semester` on the `courseUndertaken` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `courseUndertaken` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `studentDetails` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfAdmission` on the `studentDetails` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `teacherDetails` table. All the data in the column will be lost.
  - You are about to drop the column `yearOfJoining` on the `teacherDetails` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[branchName]` on the table `branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[branchCode]` on the table `branch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[courseCode,classId]` on the table `courseUndertaken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchCode` to the `branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCode` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integratedLab` to the `course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classId` to the `courseUndertaken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseCode` to the `courseUndertaken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admissionDate` to the `student` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `admissionDate` to the `studentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSemester` to the `studentDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joiningDate` to the `teacher` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "examenum" AS ENUM ('cie_1', 'cie_2', 'cie_3', 'quiz_1', 'quiz_2', 'aat', 'lab', 'see');

-- DropForeignKey
ALTER TABLE "courseUndertaken" DROP CONSTRAINT "fk_branchid";

-- DropForeignKey
ALTER TABLE "courseUndertaken" DROP CONSTRAINT "fk_courseid";

-- DropForeignKey
ALTER TABLE "courseUndertaken" DROP CONSTRAINT "fk_teacherid";

-- AlterTable
ALTER TABLE "branch" ADD COLUMN     "branchCode" VARCHAR(3) NOT NULL;

-- AlterTable
ALTER TABLE "course" DROP CONSTRAINT "course_pkey",
DROP COLUMN "courseId",
ADD COLUMN     "courseCode" TEXT NOT NULL,
ADD COLUMN     "integratedLab" BOOLEAN NOT NULL,
ADD CONSTRAINT "course_pkey" PRIMARY KEY ("courseCode");

-- AlterTable
ALTER TABLE "courseUndertaken" DROP COLUMN "branchId",
DROP COLUMN "courseId",
DROP COLUMN "section",
DROP COLUMN "semester",
DROP COLUMN "year",
ADD COLUMN     "classId" TEXT NOT NULL,
ADD COLUMN     "courseCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "admissionDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "studentDetails" DROP COLUMN "age",
DROP COLUMN "yearOfAdmission",
ADD COLUMN     "admissionDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "currentSemester" "semesterenum" NOT NULL,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "teacher" ADD COLUMN     "joiningDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "teacherDetails" DROP COLUMN "age",
DROP COLUMN "yearOfJoining",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "joiningDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "adminAddedStudentEmail" (
    "adminEmailId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "usn" TEXT NOT NULL,
    "currentSemester" "semesterenum" NOT NULL,

    CONSTRAINT "adminAddedStudentEmail_pkey" PRIMARY KEY ("adminEmailId")
);

-- CreateTable
CREATE TABLE "adminAddedTeacherEmail" (
    "adminEmailId" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "adminAddedTeacherEmail_pkey" PRIMARY KEY ("adminEmailId")
);

-- CreateTable
CREATE TABLE "class" (
    "classId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "semester" "semesterenum" NOT NULL,
    "section" VARCHAR(1) NOT NULL,
    "yearOfAdmission" INTEGER NOT NULL,

    CONSTRAINT "class_pkey" PRIMARY KEY ("classId")
);

-- CreateTable
CREATE TABLE "classTeacher" (
    "classTeacherId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "classTeacher_pkey" PRIMARY KEY ("classTeacherId")
);

-- CreateTable
CREATE TABLE "admin" (
    "adminId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "genderenum",
    "address" TEXT,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "phNo" VARCHAR(10),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "attendance" (
    "attendanceId" TEXT NOT NULL,
    "courseObjId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classesAttended" INTEGER NOT NULL,
    "classesConducted" INTEGER NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("attendanceId")
);

-- CreateTable
CREATE TABLE "Score" (
    "scoreId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseObjId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cie_1" DOUBLE PRECISION NOT NULL,
    "cie_2" DOUBLE PRECISION NOT NULL,
    "cie_3" DOUBLE PRECISION NOT NULL,
    "quiz_1" DOUBLE PRECISION NOT NULL,
    "quiz_2" DOUBLE PRECISION NOT NULL,
    "aat" DOUBLE PRECISION NOT NULL,
    "lab" DOUBLE PRECISION NOT NULL,
    "see" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("scoreId")
);

-- CreateTable
CREATE TABLE "_ClassToStudent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedStudentEmail_userId_key" ON "adminAddedStudentEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedStudentEmail_email_key" ON "adminAddedStudentEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedStudentEmail_usn_key" ON "adminAddedStudentEmail"("usn");

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedTeacherEmail_userId_key" ON "adminAddedTeacherEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedTeacherEmail_email_key" ON "adminAddedTeacherEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "adminAddedTeacherEmail_employeeId_key" ON "adminAddedTeacherEmail"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "class_branchId_semester_section_yearOfAdmission_key" ON "class"("branchId", "semester", "section", "yearOfAdmission");

-- CreateIndex
CREATE UNIQUE INDEX "classTeacher_classId_key" ON "classTeacher"("classId");

-- CreateIndex
CREATE UNIQUE INDEX "classTeacher_teacherId_classId_key" ON "classTeacher"("teacherId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_employeeId_key" ON "admin"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_courseObjId_studentId_key" ON "attendance"("courseObjId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_studentId_key" ON "Score"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ClassToStudent_AB_unique" ON "_ClassToStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_ClassToStudent_B_index" ON "_ClassToStudent"("B");

-- CreateIndex
CREATE UNIQUE INDEX "branch_branchName_key" ON "branch"("branchName");

-- CreateIndex
CREATE UNIQUE INDEX "branch_branchCode_key" ON "branch"("branchCode");

-- CreateIndex
CREATE UNIQUE INDEX "courseUndertaken_courseCode_classId_key" ON "courseUndertaken"("courseCode", "classId");

-- AddForeignKey
ALTER TABLE "adminAddedStudentEmail" ADD CONSTRAINT "adminAddedStudentEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "student"("studentId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adminAddedTeacherEmail" ADD CONSTRAINT "adminAddedTeacherEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "teacher"("teacherId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("branchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseUndertaken" ADD CONSTRAINT "fk_classid" FOREIGN KEY ("classId") REFERENCES "class"("classId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseUndertaken" ADD CONSTRAINT "fk_courseid" FOREIGN KEY ("courseCode") REFERENCES "course"("courseCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courseUndertaken" ADD CONSTRAINT "fk_teacherid" FOREIGN KEY ("teacherId") REFERENCES "teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classTeacher" ADD CONSTRAINT "classTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teacher"("teacherId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classTeacher" ADD CONSTRAINT "classTeacher_classId_fkey" FOREIGN KEY ("classId") REFERENCES "class"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_courseObjId_fkey" FOREIGN KEY ("courseObjId") REFERENCES "courseUndertaken"("courseObjId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_courseObjId_fkey" FOREIGN KEY ("courseObjId") REFERENCES "courseUndertaken"("courseObjId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "class"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassToStudent" ADD CONSTRAINT "_ClassToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "student"("studentId") ON DELETE CASCADE ON UPDATE CASCADE;
