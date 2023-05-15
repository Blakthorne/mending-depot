/*
  Warnings:

  - You are about to drop the column `units` on the `Material` table. All the data in the column will be lost.
  - Added the required column `unitTypeId` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Material` DROP COLUMN `units`,
    ADD COLUMN `unitTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `UnitType` (
    `id` VARCHAR(191) NOT NULL,
    `unitTypeName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UnitType_unitTypeName_key`(`unitTypeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Material` ADD CONSTRAINT `Material_unitTypeId_fkey` FOREIGN KEY (`unitTypeId`) REFERENCES `UnitType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
