import BigNumber from 'bignumber.js';

import { SLIPPAGE_DOMINATOR, SLIPPAGE_PERCENTAGE } from 'configs/constants';

const convertFromWei = (val: BigNumber | number | string, fixed: number = 4, decimals: number = 18): string => {
  const result = new BigNumber(val).dividedBy(10 ** decimals).toFixed(fixed, BigNumber.ROUND_DOWN);
  return result;
};

const convertToWei = (val: number | string, decimals: number = 18): BigNumber => {
  const result = new BigNumber(val).multipliedBy(10 ** decimals).decimalPlaces(0, BigNumber.ROUND_FLOOR);
  return result;
};

const convertBigNumber = (val: any): BigNumber => {
  return new BigNumber(val.toString());
};

const convertToDollar = (balance: string | number, exchangeRate: number | BigNumber, fixed: number = 4): string => {
  let amount = new BigNumber(balance);
  if (amount.isNaN()) amount = new BigNumber(0);

  const result = parseFloat(amount.multipliedBy(exchangeRate).toFixed(fixed, BigNumber.ROUND_CEIL));
  return result.toString();
};

const getSlippageByDenominator = (percent: number) => {
  const res = SLIPPAGE_DOMINATOR - (percent * SLIPPAGE_DOMINATOR) / 100;
  return res;
};

const getExpectAmount = (amount: BigNumber) => {
  return amount
    .multipliedBy(100 - SLIPPAGE_PERCENTAGE)
    .dividedBy(100)
    .toFixed(0);
};

const toFixed = (num: number | string, decimals: number = 2) => {
  const number = parseFloat(Number(num).toFixed(decimals));
  return number.toString();
};

const formatCurrency = ({
  value,
  locale,
  formatOption,
}: {
  value: number | bigint;
  locale?: string;
  formatOption?: Intl.NumberFormatOptions;
}) => {
  if (!locale) {
    locale = 'en-US';
  }

  if (!formatOption) {
    formatOption = { style: 'currency', currency: 'USD', maximumFractionDigits: 2 };
  }

  const currencyString = new Intl.NumberFormat(locale, formatOption);

  return currencyString.format(value);
};

const balanceTool = {
  convertToWei,
  convertFromWei,
  convertToDollar,
  convertBigNumber,
  getSlippageByDenominator,
  getExpectAmount,
  toFixed,
  formatCurrency,
};

export default balanceTool;
