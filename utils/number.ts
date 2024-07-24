import BigNumber from "bignumber.js";

const abbreviateNumberFactory =
  (symbols) =>
  (number, minDigits, maxDigits, decimals = 18) => {
    if (number === 0) return number;
    if (number < 1) return new BigNumber(number).dp(maxDigits, 1).toString();

    // determines SI symbol
    const tier = Math.floor(Math.log10(Math.abs(number)) / 3);

    // get suffix and determine scale
    const suffix = symbols[tier] === undefined ? `e${tier * 3}` : symbols[tier];
    const scale = 10 ** (tier * 3);

    // scale the number
    const scaled = number / scale;

    // format number and add suffix
    return (
      scaled.toLocaleString(undefined, {
        minimumFractionDigits: minDigits,
        maximumFractionDigits: maxDigits,
      }) + suffix
    );
  };

const SI_SYMBOLS = ["", "k", "M", "G", "T", "P", "E"];

export const abbreviateNumberSI = abbreviateNumberFactory(SI_SYMBOLS);

export const toFixed = (number, decimals, string = false) => {
  const value = new BigNumber(new BigNumber(number).toFixed(decimals, 1));
  return string ? value : value.toNumber();
};

export const toShow = (num, decimals) => {
  return new BigNumber(num).isGreaterThan(10 ** 9) ? "∞" : toFixed(num, decimals, true).toString();
};

export const getOnlyDigitalValue = (val: number) => {
  return Math.floor(val);
};

export const getOnlyPointsValue = (val: number) => {
  return val - Math.floor(val);
};

export const numberWithCommas = (x) => {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
  return x;
};

export const isNaN = (x) => {
  const bn = new BigNumber(x);
  return bn.isNaN();
};

export const compare = (x, y) => {
  const bnX = new BigNumber(x);
  const bnY = new BigNumber(y);

  return bnX.comparedTo(bnY);
};

export const allowOnlyNumber = (value) => {
  if (value === "") {
    return true;
  }

  const re = /^[0-9\b]+$/;

  return re.test(value);
};

export const intToString = (value) => {
  const suffixes = ["", "K", "M", "B", "T"];

  const suffixNum = Math.floor(("" + value).length / 3);
  let shortValue = parseFloat(
    (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision()
  );

  if (shortValue % 1 != 0) {
    shortValue = Number(shortValue.toFixed(1));
  }

  return shortValue + suffixes[suffixNum];
};

export function formatNumber(value: string | number, minPrecision = 2, maxPrecision = 2) {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  };

  return Number(value).toLocaleString("en-US", options);
}
