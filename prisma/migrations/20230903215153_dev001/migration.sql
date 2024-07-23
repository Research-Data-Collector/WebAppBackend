/*
  Warnings:

  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_orgId_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `orgId` INTEGER NULL,
    MODIFY `lname` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `organization`;
