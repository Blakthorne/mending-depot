/*
  Warnings:

  - The primary key for the `Book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bookId` on the `Book` table. All the data in the column will be lost.
  - The primary key for the `Material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `materialId` on the `Material` table. All the data in the column will be lost.
  - The primary key for the `Owner` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerId` on the `Owner` table. All the data in the column will be lost.
  - The primary key for the `Repair` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `repairId` on the `Repair` table. All the data in the column will be lost.
  - The required column `id` was added to the `Book` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Material` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Owner` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `Repair` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ReplacementCover` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_ownerId_fkey`;

-- DropForeignKey
ALTER TABLE `MaterialForRepair` DROP FOREIGN KEY `MaterialForRepair_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `MaterialForRepair` DROP FOREIGN KEY `MaterialForRepair_repairId_fkey`;

-- DropForeignKey
ALTER TABLE `Repair` DROP FOREIGN KEY `Repair_bookId_fkey`;

-- DropForeignKey
ALTER TABLE `ReplacementCover` DROP FOREIGN KEY `ReplacementCover_repairId_fkey`;

-- AlterTable
ALTER TABLE `Book` DROP PRIMARY KEY,
    DROP COLUMN `bookId`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Material` DROP PRIMARY KEY,
    DROP COLUMN `materialId`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Owner` DROP PRIMARY KEY,
    DROP COLUMN `ownerId`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Repair` DROP PRIMARY KEY,
    DROP COLUMN `repairId`,
    ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `ReplacementCover` ADD COLUMN `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Owner`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repair` ADD CONSTRAINT `Repair_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReplacementCover` ADD CONSTRAINT `ReplacementCover_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
