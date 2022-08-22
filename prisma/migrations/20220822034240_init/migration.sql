-- CreateTable
CREATE TABLE `Owner` (
    `ownerId` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ownerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `bookId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `publisher` VARCHAR(191) NULL,
    `yearPublished` INTEGER NULL,
    `numberOfPages` INTEGER NULL,
    `bindingType` ENUM('SEWN', 'PERFECT') NOT NULL,
    `received` DATETIME(3) NOT NULL,
    `returned` DATETIME(3) NULL,
    `bookMaterialsCost` DOUBLE NULL,
    `amountCharged` DOUBLE NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`bookId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repair` (
    `repairId` VARCHAR(191) NOT NULL,
    `repairType` ENUM('BASEHINGE', 'TIPIN', 'PAPER', 'FLYSHEET', 'SPINEREPLACEMENT', 'COVERREPLACEMENT', 'RESEWING') NOT NULL,
    `repairMaterialsCost` DOUBLE NULL,
    `bookId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`repairId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReplacementCover` (
    `repairId` VARCHAR(191) NOT NULL,
    `coverType` ENUM('FULL', 'QUARTER', 'THREEQUARTER') NULL,
    `spineMaterial` ENUM('BUCKRAM', 'BOOKCLOTH', 'LEATHER') NULL,
    `sideMaterial` ENUM('BUCKRAM', 'BOOKCLOTH', 'LEATHER') NULL,

    UNIQUE INDEX `ReplacementCover_repairId_key`(`repairId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Material` (
    `materialId` VARCHAR(191) NOT NULL,
    `materialName` VARCHAR(191) NOT NULL,
    `units` ENUM('INCHES', 'INCHESSQUARED') NOT NULL,
    `unitCost` DOUBLE NOT NULL,

    PRIMARY KEY (`materialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaterialForRepair` (
    `repairId` VARCHAR(191) NOT NULL,
    `materialId` VARCHAR(191) NOT NULL,
    `amountUsed` DOUBLE NOT NULL,

    PRIMARY KEY (`repairId`, `materialId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Owner`(`ownerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repair` ADD CONSTRAINT `Repair_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`bookId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReplacementCover` ADD CONSTRAINT `ReplacementCover_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`repairId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_repairId_fkey` FOREIGN KEY (`repairId`) REFERENCES `Repair`(`repairId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialForRepair` ADD CONSTRAINT `MaterialForRepair_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`materialId`) ON DELETE RESTRICT ON UPDATE CASCADE;
