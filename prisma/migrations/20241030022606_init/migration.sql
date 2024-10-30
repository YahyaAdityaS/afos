/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `updatedAt`,
    ADD COLUMN `idMenu` INTEGER NULL,
    ADD COLUMN `menuId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_idMenu_fkey` FOREIGN KEY (`idMenu`) REFERENCES `menu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
