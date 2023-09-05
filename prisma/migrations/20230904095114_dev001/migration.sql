/*
  Warnings:

  - You are about to drop the column `name` on the `organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orgname]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orgname` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Organization_name_key` ON `organization`;

-- AlterTable
ALTER TABLE `organization` DROP COLUMN `name`,
    ADD COLUMN `orgname` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UserWithOrganization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fname` VARCHAR(191) NOT NULL,
    `lname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `orgname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Organization_orgname_key` ON `Organization`(`orgname`);
