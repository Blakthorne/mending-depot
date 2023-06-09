-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
