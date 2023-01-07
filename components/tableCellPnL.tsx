
import React from 'react';
import { TradeNumbericMetrics, NumericValuesInTrade } from '../helpers/types';

const getRelativePercentage = (value: number, absoluteValue: number) => (value / absoluteValue)

interface TableCellPnLProps {
  children: string
  numericValue: number;
  numericValueType: NumericValuesInTrade
  tradeNumericMetrics: TradeNumbericMetrics
}

export default function TableCellPnL(props: TableCellPnLProps) {
  const { numericValue, numericValueType, tradeNumericMetrics, children } = props;

  const { maxPnL, maxPnLPercentage, minPnL, minPnLPercentage } = tradeNumericMetrics

  let positiveOpacity = 1
  let negativeOpacity = 0

  if (numericValueType === NumericValuesInTrade.pnl) {
    positiveOpacity = getRelativePercentage(numericValue, maxPnL)
    negativeOpacity = getRelativePercentage(numericValue, minPnL)
  } else if (numericValueType === NumericValuesInTrade.pnlPercentage) {
    positiveOpacity = getRelativePercentage(numericValue, maxPnLPercentage)
    negativeOpacity = getRelativePercentage(numericValue, minPnLPercentage)
  }

  let bgColor = ``;

  if (numericValue > 0) {
    bgColor = `rgba(52, 168, 83, ${positiveOpacity})`;
  } else {
    bgColor = `rgba(234, 67, 53, ${negativeOpacity})`
  }

  return <td style={{ backgroundColor: bgColor }}>{children}</td>;
}
 