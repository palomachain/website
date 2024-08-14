import BigNumber from "bignumber.js";
import type { GetTokenPricesApiResponse } from "services/api/price";

const selectCurrentUsdPrice = (
  data: GetTokenPricesApiResponse | undefined
): BigNumber => {
  const price = data?.data?.current_price?.usd;
  return new BigNumber(price);
};

export { selectCurrentUsdPrice };
