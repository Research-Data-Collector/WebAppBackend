/*
  Warnings:

  - You are about to drop the column `ordId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_ordId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `ordId`,
    ADD COLUMN `orgId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_orgId_fkey` FOREIGN KEY (`orgId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
