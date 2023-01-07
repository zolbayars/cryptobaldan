/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `merged_trade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entryDate` DATETIME(0) NOT NULL,
    `exitDate` DATETIME(0) NOT NULL,
    `symbol` VARCHAR(255) NOT NULL,
    `direction` ENUM('long', 'short') NOT NULL,
    `entryPrice` DOUBLE NOT NULL,
    `exitPrice` DOUBLE NOT NULL,
    `size` DOUBLE NOT NULL,
    `pnl` DOUBLE NOT NULL,
    `pnlPercentage` DOUBLE NOT NULL,
    `fee` DOUBLE NOT NULL,
    `feeAsset` VARCHAR(255) NOT NULL,
    `entryReason` VARCHAR(255) NULL,
    `exitReason` VARCHAR(255) NULL,
    `mistake` VARCHAR(255) NULL,
    `comment` VARCHAR(255) NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `IDX_f8f1c16f166fa9614147b40efe`(`entryDate`),
    UNIQUE INDEX `IDX_799c957565ecaca9d3b730ba0c`(`entryDate`, `exitDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exchangeTradeId` BIGINT NOT NULL,
    `exchangeOrderId` BIGINT NOT NULL,
    `symbol` VARCHAR(255) NOT NULL,
    `side` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `qty` DOUBLE NOT NULL,
    `quoteQty` DOUBLE NOT NULL,
    `realizedPnl` DOUBLE NOT NULL,
    `marginAsset` VARCHAR(255) NOT NULL,
    `commission` DOUBLE NOT NULL,
    `commissionAsset` VARCHAR(255) NOT NULL,
    `exchangeCreatedAt` DATETIME(0) NOT NULL,
    `positionSide` VARCHAR(255) NOT NULL,
    `isBuyer` TINYINT NOT NULL,
    `isMaker` TINYINT NOT NULL,
    `marketType` ENUM('futures', 'spot') NOT NULL,
    `exchange` ENUM('binance') NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `mergedAsEntryTradeId` INTEGER NULL,
    `mergedAsExitTradeId` INTEGER NULL,

    INDEX `FK_64e5144b9bde99a645cd7007cf6`(`mergedAsExitTradeId`),
    INDEX `FK_85901debf51064ddd473864ae2c`(`mergedAsEntryTradeId`),
    INDEX `IDX_307a39fe2dade72e22083784c9`(`exchangeTradeId`),
    UNIQUE INDEX `IDX_6dcce2d97acd8ebf2b5d3d88b9`(`exchange`, `exchangeTradeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trade` ADD CONSTRAINT `FK_64e5144b9bde99a645cd7007cf6` FOREIGN KEY (`mergedAsExitTradeId`) REFERENCES `merged_trade`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `trade` ADD CONSTRAINT `FK_85901debf51064ddd473864ae2c` FOREIGN KEY (`mergedAsEntryTradeId`) REFERENCES `merged_trade`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
