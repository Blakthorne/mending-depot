/*
  Warnings:

  - A unique constraint covering the columns `[materialName]` on the table `Material` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Material_materialName_key` ON `Material`(`materialName`);
