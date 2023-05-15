/*
  Warnings:

  - You are about to drop the column `materialTypeId` on the `Material` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Material` DROP FOREIGN KEY `Material_materialTypeId_fkey`;

-- AlterTable
ALTER TABLE `Material` DROP COLUMN `materialTypeId`;

-- CreateTable
CREATE TABLE `TypesForMaterials` (
    `materialId` VARCHAR(191) NOT NULL,
    `materialTypeId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`materialId`, `materialTypeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TypesForMaterials` ADD CONSTRAINT `TypesForMaterials_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TypesForMaterials` ADD CONSTRAINT `TypesForMaterials_materialTypeId_fkey` FOREIGN KEY (`materialTypeId`) REFERENCES `MaterialType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
