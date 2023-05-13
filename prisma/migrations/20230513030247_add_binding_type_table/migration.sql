/*
  Warnings:

  - You are about to drop the column `bindingType` on the `Book` table. All the data in the column will be lost.
  - Added the required column `bindingTypeId` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Book` DROP COLUMN `bindingType`,
    ADD COLUMN `bindingTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `BindingType` (
    `id` VARCHAR(191) NOT NULL,
    `bindingTypeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_bindingTypeId_fkey` FOREIGN KEY (`bindingTypeId`) REFERENCES `BindingType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
