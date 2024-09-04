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
    getPriceTiers: build.query<GetNodeSaleApiResponse, {}>({
      query: () => ({
        url: `${nodesaleApiUrl}/pricetiers`,
      }),
    }),
    postRegister: build.mutation<PostRegisterApiResponse, PostRegisterApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/register`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    getRegisterConfirmation: build.query<GetNodeSaleApiResponse, GetRegisterConfirmationApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/confirmation`,
        params: queryArg,
      }),
    }),
    getIsUsedPalomaAddress: build.query<GetNodeSaleApiResponse, GetIsUsedPalomaAddressApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/isusedaddress`,
        params: queryArg,
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as api };
export type GetNodeSaleApiResponse = /** status 200 Success */ ApiResultData;
export type GetNodeSaleApiArg = {
  amount: number;
  promo_code?: string;
};

export type ApiResultData = any;

export type PostRegisterApiResponse = /** status 200 Success */ {
  code?: number;
  success?: boolean;
  msg?: string;
};
export type PostRegisterApiArg = {
  username: string;
  email: string;
};
export type GetRegisterConfirmationApiArg = {
  token: string;
};
export type GetIsUsedPalomaAddressApiArg = {
  paloma: string;
};

export const {
  useGetNodeSalePriceQuery,
  useLazyGetNodeSalePriceQuery,
  useGetTotalPurchasedQuery,
  useLazyGetTotalPurchasedQuery,
  useLazyGetPriceTiersQuery,
  usePostRegisterMutation,
  useLazyGetRegisterConfirmationQuery,
  useLazyGetIsUsedPalomaAddressQuery,
} = injectedRtkApi;
