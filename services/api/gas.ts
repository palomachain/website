import { api } from "services";

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getGasPrices: build.query<GetGasPricesApiResponse, GetGasPricesApiArg>({
      query: (queryArg) => ({
        url: `https://ethgasstation.info/json/ethgasAPI.json`,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GetGasPricesApiResponse =
  /** status 200 Success */ GasPricesResultData;
export type GetGasPricesApiArg = {};
export type GasPricesResultData = {
  fastest: number;
  hight: number;
  medium: number;
  low: number;
};

export const { useGetGasPricesQuery, useLazyGetGasPricesQuery } =
  injectedRtkApi;
