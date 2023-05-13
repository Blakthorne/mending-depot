/*
  Warnings:

  - You are about to drop the `ReplacementCover` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ReplacementCover` DROP FOREIGN KEY `ReplacementCover_repairId_fkey`;

-- DropTable
DROP TABLE `ReplacementCover`;
