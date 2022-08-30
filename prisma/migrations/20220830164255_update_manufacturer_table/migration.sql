/*
  Warnings:

  - Added the required column `materialName` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Material` ADD COLUMN `materialName` VARCHAR(191) NOT NULL;
