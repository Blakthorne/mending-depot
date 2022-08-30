/*
  Warnings:

  - A unique constraint covering the columns `[manufacturerName]` on the table `Manufacturer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Manufacturer_manufacturerName_key` ON `Manufacturer`(`manufacturerName`);
