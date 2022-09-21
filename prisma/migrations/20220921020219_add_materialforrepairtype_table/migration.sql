-- CreateTable
CREATE TABLE `MaterialForRepairType` (
    `repairTypeId` VARCHAR(191) NOT NULL,
    `materialId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`repairTypeId`, `materialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaterialForRepairType` ADD CONSTRAINT `MaterialForRepairType_repairTypeId_fkey` FOREIGN KEY (`repairTypeId`) REFERENCES `RepairType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepairType` ADD CONSTRAINT `MaterialForRepairType_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
