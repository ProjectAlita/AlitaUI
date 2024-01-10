import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DEV, VITE_DEV_TOKEN, VITE_SERVER_URL } from "../common/constants.js";


// https://redux-toolkit.js.org/rtk-query/api/createApi
export const alitaApi = createApi({
  reducerPath: 'alitaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_SERVER_URL,
    // mode: "cors",
    fetchFn: async (...args) => {
      const response = await fetch(...args);
      if (response.redirected) {
        const redirectUrl = new URL(response.url);
        redirectUrl.searchParams.delete('target_to');
        const modifiedUrlString = redirectUrl.toString();
        window.location.href = modifiedUrlString;
        return { modifiedUrlString };
      }
      return response;
    },
    prepareHeaders: (headers) => {
      if (DEV) {
        VITE_DEV_TOKEN && headers.set('Authorization', `Bearer ${VITE_DEV_TOKEN}`)
        headers.set('Cache-Control', 'no-cache')
      }
      return headers
    },
  }),
  tagTypes: [], // Here we specify tags for caching and invalidation
  endpoints: () => ({})
})

export const {
  middleware,
  reducer,
  reducerPath,
} = alitaApi