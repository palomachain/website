import { envParam } from 'configs/constants';
import { api } from 'services';
import { TMap } from 'types';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getApeswapTokenList: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/apeswap-listed`,
      }),
    }),
    getUniswapTokenList: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/uniswap-listed`,
      }),
    }),
    getUniswapTokenListForBase: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/base`,
      }),
    }),
    getUniswapCoinGeckoTokenList: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/uniswap-coingecko-listed`,
      }),
    }),
    getPancakeSwapCoinGeckoTokenList: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/pancake-coingecko-listed`,
      }),
    }),
    getCurveSwapTokenList: build.query<GetListedSwapTokensApiResponse, GetListedSwapTokensApiArg>({
      query: () => ({
        url: `${envParam.palomaNestServiceAPIBaseUrl}/tokens/curveswap-listed`,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GetListedSwapTokensApiResponse = /** status 200 Success */ {
  code?: number;
  data: ListedSwapTokensResultData;
  success?: boolean;
};
export type GetListedSwapTokensApiArg = {};
export type ListedSwapTokensResultData = {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  tags?: TMap;
  logoURI: string;
  keywords: TMap;
  tokens: ListedSwapTokenItemData[];
};
export type ListedSwapTokenItemData = {
  chainId: string;
  address: string;
  name: string;
  symbol: string;
  decimals?: number;
  logoURI?: string;
  extensions?: TMap;
};

export const {
  useGetApeswapTokenListQuery,
  useGetUniswapTokenListQuery,
  useGetUniswapTokenListForBaseQuery,
  useGetUniswapCoinGeckoTokenListQuery,
  useLazyGetUniswapTokenListQuery,
  useLazyGetUniswapCoinGeckoTokenListQuery,
  useGetPancakeSwapCoinGeckoTokenListQuery,
  useGetCurveSwapTokenListQuery,
  useLazyGetCurveSwapTokenListQuery,
} = injectedRtkApi;
