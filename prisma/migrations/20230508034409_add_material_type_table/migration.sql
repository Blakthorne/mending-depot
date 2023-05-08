/*
  Warnings:

  - Added the required column `materialTypeId` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Material` ADD COLUMN `materialTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `MaterialType` (
    `id` VARCHAR(191) NOT NULL,
    `materialTypeName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MaterialType_materialTypeName_key`(`materialTypeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_materialTypeId_fkey` FOREIGN KEY (`materialTypeId`) REFERENCES `MaterialType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
