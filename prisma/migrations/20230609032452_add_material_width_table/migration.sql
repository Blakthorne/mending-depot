-- CreateTable
CREATE TABLE `MaterialWidth` (
    `materialForRepairId` VARCHAR(191) NOT NULL,
    `measurement` DOUBLE NOT NULL,

    PRIMARY KEY (`materialForRepairId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaterialWidth` ADD CONSTRAINT `MaterialWidth_materialForRepairId_fkey` FOREIGN KEY (`materialForRepairId`) REFERENCES `MaterialForRepair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
