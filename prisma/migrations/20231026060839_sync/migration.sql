/*
  Warnings:

  - Added the required column `formId` to the `TeamMembers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `forms` ADD COLUMN `description` TEXT NOT NULL DEFAULT 'No Description';

-- AlterTable
ALTER TABLE `formsubmissions` MODIFY `data` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `teammembers` ADD COLUMN `formId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `TestFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeamMembers` ADD CONSTRAINT `TeamMembers_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `Forms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
