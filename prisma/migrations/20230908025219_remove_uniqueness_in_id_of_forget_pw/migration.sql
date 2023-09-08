/*
  Warnings:

  - Made the column `isRequested` on table `forgetpassword` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `forgetpassword` MODIFY `isRequested` BOOLEAN NOT NULL DEFAULT false;
