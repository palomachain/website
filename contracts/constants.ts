export const DEFAULT_sqrtPriceLimitX96 = 0;
export const FEE_500 = 500;
export const FEE_DENOMINATOR = 10000;

export const MAX_AMOUNT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * estimation = estimation + estimation / GAS_MULTIPLIER (x1.3)
 */
export const GAS_MULTIPLIER = 3;

export const estimatedGasAmount = {
  wallchainRouter: 1000000,
  uniswapV2Router: 175344,
  curveExchangeRouter: 1000000,
};

export const TRANSACTION_DATA_DELIMITER = '0123456789abcdef';

/**
 * PalomaSwap
 */
export const cashbackDenominator = 10;
