import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const homeScreenApi = createApi({
  reducerPath: 'homeScreen',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://yp.uskudar.dev/api/' }),
  endpoints: (builder) => ({
    getContent: builder.query({
      query: () => `content/last/3/?token=1`,
    }),
  }),
});

export const { useGetContentQuery } = homeScreenApi;
