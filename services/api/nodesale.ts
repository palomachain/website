import { api } from 'services';

const nodesaleApiUrl = 'https://nodesale.palomachain.com/api/v1';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNodeSalePrice: build.query<GetNodeSaleApiResponse, GetNodeSaleApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/price`,
        params: {
          amount: queryArg.amount,
          promo_code: queryArg.promo_code,
        },
      }),
    }),
    getTotalPurchased: build.query<GetNodeSaleApiResponse, {}>({
      query: () => ({
        url: `${nodesaleApiUrl}/purchased`,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GetNodeSaleApiResponse = /** status 200 Success */ PriceResultData;
export type GetNodeSaleApiArg = {
  amount: number;
  promo_code?: string;
};

export type PriceResultData = any;

export const {
  useGetNodeSalePriceQuery,
  useLazyGetNodeSalePriceQuery,
  useGetTotalPurchasedQuery,
  useLazyGetTotalPurchasedQuery,
} = injectedRtkApi;
