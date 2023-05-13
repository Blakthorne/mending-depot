/*
  Warnings:

  - You are about to drop the `MaterialForRepairType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `MaterialForRepairType` DROP FOREIGN KEY `MaterialForRepairType_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `MaterialForRepairType` DROP FOREIGN KEY `MaterialForRepairType_repairTypeId_fkey`;

-- DropTable
DROP TABLE `MaterialForRepairType`;
