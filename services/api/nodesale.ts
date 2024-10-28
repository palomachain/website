import { api } from 'services';

const nodesaleApiUrl = 'https://nodesale.palomachain.com/api/v2';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNodePrice: build.query<GetNodeSaleApiResponse, GetNodePriceApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/price`,
        params: {
          amount: queryArg.amount,
          promo_code: queryArg.promo_code,
        },
      }),
    }),
    getEstimateNodePrice: build.query<GetNodeSaleApiResponse, GetNodePriceApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/estimateprice`,
        params: {
          estimate: queryArg.amount,
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
    getRegisterConfirmation: build.query<GetNodeSaleApiResponse, GetConfirmationApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/confirmation`,
        params: queryArg,
      }),
    }),
    getLoginConfirmation: build.query<GetNodeSaleApiResponse, GetConfirmationApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/loginconfirmation`,
        params: queryArg,
      }),
    }),
    getIsUsedPalomaAddress: build.query<GetNodeSaleApiResponse, GetIsUsedPalomaAddressApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/isusedaddress`,
        params: queryArg,
      }),
    }),
    getWallet: build.query<GetNodeSaleApiResponse, GetConfirmationApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/wallet`,
        params: queryArg,
      }),
    }),
    getPromocodeStatus: build.query<GetNodeSaleApiResponse, GetApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/promocodestatus`,
        params: queryArg,
      }),
    }),
    getPromocodeStatusByWallet: build.query<GetNodeSaleApiResponse, GetEVMApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/promocodestatusbywallet`,
        params: queryArg,
      }),
    }),
    getStatus: build.query<GetNodeSaleApiResponse, GetEVMApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/status`,
        params: queryArg,
      }),
    }),
    getStatusByUser: build.query<GetNodeSaleApiResponse, GetApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/statusbyuser`,
        params: queryArg,
      }),
    }),
    getBalances: build.query<GetNodeSaleApiResponse, GetBalances>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/balances`,
        params: queryArg,
      }),
    }),
    postRegister: build.mutation<PostApiResponse, PostRegisterApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/register`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postLogin: build.mutation<PostApiResponse, PostLoginApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/login`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postCreateBot: build.mutation<PostApiResponse, PostCreateBotApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/createbot`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postActiveWallet: build.mutation<PostApiResponse, PostActiveWalletApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/activatewallet`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postPayForToken: build.mutation<PostApiResponse, PostPayForTokenApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/payfortoken`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postAddAddr: build.mutation<PostApiResponse, PostAddAddrApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/addaddr`,
        method: 'POST',
        body: queryArg,
      }),
    }),
    postCreatePromocode: build.mutation<PostApiResponse, PostCreatePromocodeApiArg>({
      query: (queryArg) => ({
        url: `${nodesaleApiUrl}/createpromocode`,
        method: 'POST',
        body: queryArg,
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as api };
export type GetNodeSaleApiResponse = /** status 200 Success */ ApiResultData;
export type GetNodePriceApiArg = {
  amount: number;
  promo_code?: string;
};

export type ApiResultData = any;

export type PostApiResponse = /** status 200 Success */ {
  code?: number;
  success?: boolean;
  msg?: string;
};
export type PostRegisterApiArg = {
  username: string;
  email: string;
  redirect: string;
};
export type PostLoginApiArg = {
  email: string;
  redirect: string;
};
export type PostCreateBotApiArg = {
  token: string;
};
export type PostActiveWalletApiArg = {
  token: string;
  paloma: string;
};
export type PostPayForTokenApiArg = {
  token: string;
  token_in: string;
  amount_in: string;
  node_count: string | number;
  total_cost: string;
  promocode: string;
  path: string;
  enhanced: boolean;
  subscription_month: number;
};
export type PostAddAddrApiArg = {
  addr: string;
  token: string;
};
export type PostCreatePromocodeApiArg = {
  promocode: string;
  token: string;
};
export type GetConfirmationApiArg = {
  token: string;
};
export type GetIsUsedPalomaAddressApiArg = {
  paloma: string;
};
export type GetApiArg = {
  token?: string;
};
export type GetEVMApiArg = {
  buyer: string; // EVM address
};
export type GetBalances = {
  addresses: string;
};

export const {
  useGetNodePriceQuery,
  useLazyGetNodePriceQuery,
  useLazyGetEstimateNodePriceQuery,
  useGetTotalPurchasedQuery,
  useLazyGetTotalPurchasedQuery,
  useLazyGetPriceTiersQuery,
  useLazyGetRegisterConfirmationQuery,
  useLazyGetIsUsedPalomaAddressQuery,
  useLazyGetLoginConfirmationQuery,
  useLazyGetWalletQuery,
  useLazyGetPromocodeStatusQuery,
  useLazyGetPromocodeStatusByWalletQuery,
  useLazyGetStatusQuery,
  useLazyGetStatusByUserQuery,
  useLazyGetBalancesQuery,
  usePostRegisterMutation,
  usePostLoginMutation,
  usePostActiveWalletMutation,
  usePostCreateBotMutation,
  usePostPayForTokenMutation,
  usePostAddAddrMutation,
  usePostCreatePromocodeMutation,
} = injectedRtkApi;
