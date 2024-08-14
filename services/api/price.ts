import { envParam } from "configs/constants";
import { api } from "services";
import { parseIntString } from "utils/string";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTokenPrices: build.query<
      GetTokenPricesApiResponse,
      GetTokenPricesApiArg
    >({
      query: (queryArg) => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/market-data`,
        params: {
          network: parseIntString(queryArg.network.toString()),
          token: queryArg.token,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GetTokenPricesApiResponse =
  /** status 200 Success */ GasTokenPriceResultData;
export type GetTokenPricesApiArg = {
  network: string | number;
  token: string;
};

export type GasTokenPriceResultData = any;

export const { useGetTokenPricesQuery, useLazyGetTokenPricesQuery } =
  injectedRtkApi;
