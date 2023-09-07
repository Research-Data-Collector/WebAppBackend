/*
  Warnings:

  - Made the column `orgname` on table `organization` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Organization_orgname_key` ON `organization`;

-- AlterTable
ALTER TABLE `organization` MODIFY `orgname` VARCHAR(191) NOT NULL;
