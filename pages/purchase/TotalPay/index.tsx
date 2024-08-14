import BigNumber from "bignumber.js";
import { IToken } from "interfaces/swap";
import React from "react";
import balanceTool from "utils/balance";
import { formatNumber } from "utils/number";

interface TotalPayProps {
  title: string;
  step: number;
  price?: number;
  exchangeRate?: BigNumber;
  fromToken?: IToken;
  className?: string;
}

const TotalPay = ({
  title,
  step,
  price,
  exchangeRate,
  fromToken,
  className,
}: TotalPayProps) => {
  const tokenAmount = parseFloat(
    balanceTool.toFixed(
      BigNumber(price)
        .dividedBy(exchangeRate)
        .decimalPlaces(4, BigNumber.ROUND_CEIL)
        .toString(),
      4
    )
  );

  return (
    <div className="purchase-sale-pay__item flex-row">
      <p>{title}</p>
      {step === 1 ? (
        <p className="pay-value">{formatNumber(price, 0, 0)} USD</p>
      ) : fromToken &&
        fromToken.address !== "" &&
        exchangeRate &&
        exchangeRate.comparedTo(0) > 0 ? (
        <p className="pay-value">
          {formatNumber(tokenAmount, 4, 4)} {fromToken.symbol} (
          {formatNumber(price, 2, 2)} USD)
        </p>
      ) : (
        <p className="pay-value">-</p>
      )}
    </div>
  );
};

export default TotalPay;
