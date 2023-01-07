/*
  Warnings:

  - You are about to drop the column `mergedAsEntryTradeId` on the `trade` table. All the data in the column will be lost.
  - You are about to drop the column `mergedAsExitTradeId` on the `trade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entryDate,exitDate,userId]` on the table `merged_trade` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isEntryTrade` to the `trade` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `trade` DROP FOREIGN KEY `FK_64e5144b9bde99a645cd7007cf6`;

-- DropForeignKey
ALTER TABLE `trade` DROP FOREIGN KEY `FK_85901debf51064ddd473864ae2c`;

-- DropIndex
DROP INDEX `IDX_799c957565ecaca9d3b730ba0c` ON `merged_trade`;

-- AlterTable
ALTER TABLE `merged_trade` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `trade` DROP COLUMN `mergedAsEntryTradeId`,
    DROP COLUMN `mergedAsExitTradeId`,
    ADD COLUMN `isEntryTrade` TINYINT NOT NULL,
    ADD COLUMN `merged_tradeId` INTEGER NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `merged_trade_entryDate_exitDate_userId_key` ON `merged_trade`(`entryDate`, `exitDate`, `userId`);

-- AddForeignKey
ALTER TABLE `merged_trade` ADD CONSTRAINT `merged_trade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trade` ADD CONSTRAINT `trade_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trade` ADD CONSTRAINT `trade_merged_tradeId_fkey` FOREIGN KEY (`merged_tradeId`) REFERENCES `merged_trade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `merged_trade` RENAME INDEX `IDX_f8f1c16f166fa9614147b40efe` TO `merged_trade_entryDate_idx`;

-- RenameIndex
ALTER TABLE `trade` RENAME INDEX `IDX_307a39fe2dade72e22083784c9` TO `trade_exchangeTradeId_idx`;

-- RenameIndex
ALTER TABLE `trade` RENAME INDEX `IDX_6dcce2d97acd8ebf2b5d3d88b9` TO `trade_exchange_exchangeTradeId_key`;
