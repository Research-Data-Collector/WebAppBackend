/*
  Warnings:

  - You are about to alter the column `isRequested` on the `forgetpassword` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `forgetpassword` MODIFY `isRequested` ENUM('TRUE', 'FALSE', 'COMPLETED') NOT NULL DEFAULT 'FALSE';
