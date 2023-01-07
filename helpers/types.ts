import { merged_trade_direction } from "@prisma/client";

export interface BinanceTrade {
  symbol: string;
  id: number;
  orderId: number;
  side: string;
  price: string;
  qty: string;
  realizedPnl: string;
  marginAsset: string;
  quoteQty: string;
  commission: string;
  commissionAsset: string;
  time: number;
  positionSide: string;
  buyer: boolean;
  maker: boolean;
}

export interface Trade {
  entryDate: number;
  exitDate: number;
  symbol: string;
  direction: merged_trade_direction;
  entryPrice: number;
  exitPrice: number;
  size: number;
  fee: number;
  feeAsset: string;
  pnl: number;
  pnlPercentage: number;
  exitTradeIds: number[];
  entryTradeIds: number[];
}

export interface StringMap {
  [key: string]: string;
}

export interface PnLMetrics {
  winners: number;
  losers: number;
  breakevens: number;
  winnersSum: number;
  losersSum: number;
  winrate: number;
  profitFactor: number;
  pnl: number;
}

export interface PnLMetricsByMonths {
  from: Date;
  to: Date;
  metrics: PnLMetrics;
}

export interface APIReturnType {
  errorMsg: string;
  [key: string]: any;
}

export enum NumericValuesInTrade {
  pnl = "pnl",
  pnlPercentage = "pnlPercentage",
}

export interface TradeNumbericMetrics {
  maxPnL: number;
  maxPnLPercentage: number;
  minPnL: number;
  minPnLPercentage: number;
}
