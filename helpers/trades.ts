import { DateTime } from "luxon";
import prisma from "@/lib/prisma";
import { BinanceTrade, Trade } from "./types";
import { mergeTrades, binanceGet } from "../helpers/exchanges/binance";
import { formatExchangeNumber } from "./utils";
import {
  merged_trade,
  trade_marketType,
  trade_exchange,
  Prisma,
} from "@prisma/client";

const getIndividualTrades = async (
  startTime: DateTime,
  endTime: DateTime
): Promise<BinanceTrade[]> => {
  const paramsObj = {
    startTime: startTime.toMillis().toString(),
    endTime: endTime.toMillis().toString(),
  };

  const result = await binanceGet("fapi/v1/userTrades", paramsObj);
  return result;
};

const mapBinanceTrade = (trade: BinanceTrade): Prisma.tradeCreateInput =>
  ({
    exchangeTradeId: trade.id,
    exchangeOrderId: trade.orderId,
    symbol: trade.symbol,
    side: trade.side,
    price: formatExchangeNumber(trade.price),
    qty: formatExchangeNumber(trade.qty),
    quoteQty: formatExchangeNumber(trade.quoteQty),
    realizedPnl: formatExchangeNumber(trade.realizedPnl),
    marginAsset: trade.marginAsset,
    commission: formatExchangeNumber(trade.commission),
    commissionAsset: trade.commissionAsset,
    exchangeCreatedAt: new Date(trade.time),
    positionSide: trade.positionSide,
    isBuyer: trade.buyer ? 1 : 0,
    isMaker: trade.maker ? 1 : 0,
    marketType: trade_marketType.futures,
    exchange: trade_exchange.binance,
  } as Prisma.tradeCreateInput);

const saveMergedTrades = async (
  mergedTrades: Trade[],
  binanceTrades: BinanceTrade[]
): Promise<void> => {
  for (const trade of mergedTrades) {
    const relatedTrades = binanceTrades
      .filter(
        (binanceTrade) =>
          trade.exitTradeIds.includes(binanceTrade.id) ||
          trade.entryTradeIds.includes(binanceTrade.id)
      )
      .map((binanceTrade) => {
        const mappedTrade = mapBinanceTrade(binanceTrade);
        mappedTrade.isEntryTrade = trade.entryTradeIds.includes(binanceTrade.id)
          ? 1
          : 0;
        return mappedTrade;
      });

    await prisma.merged_trade.create({
      data: {
        entryDate: new Date(trade.entryDate),
        exitDate: new Date(trade.exitDate),
        symbol: trade.symbol,
        direction: trade.direction,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        size: trade.size,
        pnl: trade.pnl,
        pnlPercentage: trade.pnlPercentage,
        fee: trade.fee,
        feeAsset: trade.feeAsset,
        trades: {
          create: relatedTrades,
        },
      } as Prisma.merged_tradeCreateInput,
    });
  }

  console.info("created merged_trades", mergedTrades.length);
};

export const getTrades = async (
  startTime: DateTime,
  endTime: DateTime
): Promise<merged_trade[]> => {
  const latestTrade = await prisma.trade.findFirst({
    orderBy: { exchangeCreatedAt: "desc" },
  });

  console.log("The latest trade was made at: ", latestTrade?.exchangeCreatedAt);

  const fromDate = !!latestTrade?.exchangeCreatedAt
    ? DateTime.fromJSDate(latestTrade?.exchangeCreatedAt)
    : startTime;

  // Addition of 1s (1000 millis) is necessary here to prevent re-fetching the last trade
  await syncTrades(fromDate.toMillis() + 1000);

  const mergedTrades = await prisma.merged_trade.findMany({
    orderBy: { exitDate: "desc" },
  });

  console.log(`Fetched ${mergedTrades.length} trades from db`);

  return mergedTrades;
};

export const syncTrades = async (
  sinceXMilliseconds: number,
  tillXMilliseconds?: number
): Promise<void> => {
  const allTrades: BinanceTrade[] = [];

  const fromDate = DateTime.fromMillis(sinceXMilliseconds);

  let startDate = fromDate;

  const tillDate = tillXMilliseconds
    ? DateTime.fromMillis(tillXMilliseconds)
    : DateTime.now();

  console.log(`Syncing the trades from ${fromDate} till ${tillDate}`);

  const dateDiff = tillDate.diff(startDate, ["weeks"]);

  // Binance restricts the filter by 1 week
  if (dateDiff.weeks < 1) {
    const trades = await getIndividualTrades(startDate, tillDate);
    allTrades.push(...trades);
  } else {
    while (startDate < tillDate) {
      let endDate = startDate.plus({ weeks: 1 });

      if (endDate > DateTime.now()) {
        endDate = DateTime.now();
      }

      const trades = await getIndividualTrades(startDate, endDate);
      allTrades.push(...trades);

      startDate = startDate.plus({ weeks: 1 });
    }
  }

  if (!allTrades.length) {
    console.log(`No new trades to sync`);
    return;
  }

  console.log(`Saving ${allTrades.length} trades`);
  console.log(allTrades);

  // await saveTrades(allTrades);

  const draftMergedTrades = mergeTrades(allTrades);
  const onlyClosedTrades = draftMergedTrades.filter(
    (trade) => !!trade.exitTradeIds.length
  );

  console.log(
    `There are ${draftMergedTrades.length} merged trades. ${onlyClosedTrades.length} of them were closed`
  );

  await saveMergedTrades(onlyClosedTrades, allTrades);

  console.log(`Sync is completed`);
};
