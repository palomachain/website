import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { stringify } from 'qs';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '',
    paramsSerializer(params) {
      return stringify(params, { arrayFormat: 'repeat', indices: false });
    },
  }),
  endpoints: () => ({}),
});
