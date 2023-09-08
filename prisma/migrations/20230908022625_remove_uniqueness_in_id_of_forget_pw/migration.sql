-- AlterTable
ALTER TABLE `forgetpassword` MODIFY `isRequested` ENUM('TRUE', 'FALSE', 'COMPLETED') NULL DEFAULT 'FALSE';
