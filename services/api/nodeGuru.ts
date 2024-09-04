import { api } from 'services';

const nodeGuruApiUrl = 'https://api-1.paloma.nodes.guru/cosmos/bank/v1beta1';

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTotalSupply: build.query<GetTotalSupplyApiResponse, {}>({
      query: () => ({
        url: `${nodeGuruApiUrl}/supply`,
      }),
    }),
  }),
  overrideExisting: false,
});

export { injectedRtkApi as api };
export type GetTotalSupplyApiResponse = /** status 200 Success */ ApiResultData;
export type ApiResultData = any;

export const { useGetTotalSupplyQuery, useLazyGetTotalSupplyQuery } = injectedRtkApi;
