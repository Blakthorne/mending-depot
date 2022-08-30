/*
  Warnings:

  - A unique constraint covering the columns `[providerName]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Provider_providerName_key` ON `Provider`(`providerName`);
