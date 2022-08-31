/*
  Warnings:

  - You are about to drop the column `repairType` on the `Repair` table. All the data in the column will be lost.
  - Added the required column `repairTypeId` to the `Repair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Repair` DROP COLUMN `repairType`,
    ADD COLUMN `repairTypeId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `RepairType` (
    `id` VARCHAR(191) NOT NULL,
    `repairTypeName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RepairType_repairTypeName_key`(`repairTypeName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Repair` ADD CONSTRAINT `Repair_repairTypeId_fkey` FOREIGN KEY (`repairTypeId`) REFERENCES `RepairType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
