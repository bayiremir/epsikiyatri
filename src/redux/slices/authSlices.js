import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://yp.uskudar.dev/api/' }),
  endpoints: (builder) => ({
    getMostRead: builder.query({
      query: () => 'contents/3/yazi/tr?token=1&page=1&limit=15&tag_id=144',
    }),
  }),
});

export const { useGetMostReadQuery } = authApi;
