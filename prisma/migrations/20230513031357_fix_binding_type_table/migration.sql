/*
  Warnings:

  - You are about to drop the column `bindingTypeId` on the `BindingType` table. All the data in the column will be lost.
  - Added the required column `bindingTypeName` to the `BindingType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `BindingType` DROP COLUMN `bindingTypeId`,
    ADD COLUMN `bindingTypeName` VARCHAR(191) NOT NULL;
