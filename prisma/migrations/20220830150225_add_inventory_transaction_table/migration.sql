/*
  Warnings:

  - Added the required column `manufacturer` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Material_materialName_key` ON `Material`;

-- AlterTable
ALTER TABLE `Material` ADD COLUMN `manufacturer` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `InventoryTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `datePurchased` DATE NOT NULL,
    `dateReceived` DATE NULL,
    `unitsPurchased` DOUBLE NOT NULL,
    `transactionCost` DOUBLE NULL,
    `provider` VARCHAR(191) NOT NULL,
    `materialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventoryTransaction` ADD CONSTRAINT `InventoryTransaction_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
