/*
  Warnings:

  - Added the required column `materialCost` to the `MaterialForRepair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MaterialForRepair` ADD COLUMN `materialCost` DOUBLE NOT NULL;
