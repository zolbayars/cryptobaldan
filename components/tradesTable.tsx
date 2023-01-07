import React from 'react';
import { DateTime } from 'luxon';
import TableCellPnL from './tableCellPnL';
import { NumericValuesInTrade } from '../helpers/types';
import {
  merged_trade,
} from "@prisma/client";


interface TradesTableProps {
  fromId: number | null
}

const formatTimestamp = (dateTime: string) => {
  const date = DateTime.fromISO(dateTime);
  return `${date.toFormat('yyyy-MM-dd HH:mm:ss')}`
}

async function getData() {
  const res = await fetch(`http://localhost:3000/api/trades/latest`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!res.ok) {
    console.log(res.statusText)
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

async function TradesTable(props: TradesTableProps) {
    const result = await getData();
    console.log('result', result);
    const trades = result as merged_trade[];

    const getMaxValue = (propName: NumericValuesInTrade) => {
      let max = -Infinity;
      trades.forEach(trade => {
        max = Math.max(max, trade[propName] as number);
      });
  
      return max;
    }
  
    const getMinValue = (propName: NumericValuesInTrade) => {
      let min = +Infinity;
      trades.forEach(trade => {
        min = Math.min(min, trade[propName] as number);
      });
  
      return min;
    }

    const tradeNumericMetrics = {
      maxPnL: getMaxValue(NumericValuesInTrade.pnl),
      minPnL: getMinValue(NumericValuesInTrade.pnl),
      maxPnLPercentage: getMaxValue(NumericValuesInTrade.pnlPercentage),
      minPnLPercentage: getMinValue(NumericValuesInTrade.pnlPercentage),
    }

  return (
      <table className='bg-white dark:bg-slate-800' aria-label="trades table">
        <thead>
          <tr>
            <th>Entry</th>
            <th>Exit</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Size</th>
            <th>Fee</th>
            <th>PnL</th>
            <th>PnL %</th>
          </tr>
        </thead>
        <tbody>
          {
            trades.map(trade => {
              return (
                <tr key={trade.id} className='hover:bg-sky-700'>
                  <td>{formatTimestamp(trade.entryDate as unknown as string)}</td>
                  <td>{formatTimestamp(trade.exitDate as unknown as string)}</td>
                  <td>{trade.symbol}</td>
                  <td>{trade.direction}</td>
                  <td>{trade.entryPrice}</td>
                  <td>{trade.exitPrice}</td>
                  <td>{trade.size.toPrecision(5)}</td>
                  <td>{trade.fee.toPrecision(5)} {trade.feeAsset}</td>
                  <TableCellPnL numericValue={trade.pnl} numericValueType={NumericValuesInTrade.pnl} tradeNumericMetrics={tradeNumericMetrics}>{trade.pnl.toPrecision(5)}</TableCellPnL>
                  <TableCellPnL numericValue={trade.pnlPercentage} numericValueType={NumericValuesInTrade.pnlPercentage} tradeNumericMetrics={tradeNumericMetrics}>{`${trade.pnlPercentage.toPrecision(2)}%`}</TableCellPnL>
                </tr>
              )
            })
          }
        </tbody>
      </table>
  );
}

export default TradesTable;
