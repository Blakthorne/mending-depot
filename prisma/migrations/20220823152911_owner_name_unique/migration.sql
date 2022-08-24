/*
  Warnings:

  - A unique constraint covering the columns `[ownerName]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Owner_ownerName_key` ON `Owner`(`ownerName`);
