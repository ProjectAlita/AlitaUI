import { PAGE_SIZE } from '@/common/constants';
import { alitaApi } from "./alitaApi.js";

const TAG_TYPE_DATA_SOURCES = 'TAG_TYPE_DATA_SOURCES'
const TAG_TYPE_DATASOURCE_DETAILS = 'TAG_TYPE_DATASOURCE_DETAILS'
const TAG_TYPE_TOTAL_DATASOURCES = 'TAG_TYPE_TOTAL_DATASOURCES'
const apiSlicePath = '/datasources'
const headers = {
  "Content-Type": "application/json"
}

export const apiSlice = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_DATASOURCE_DETAILS]
}).injectEndpoints({
  endpoints: build => ({
    datasourceList: build.query({
      query: ({ projectId, page, params, pageSize = PAGE_SIZE }) => ({
        url: apiSlicePath + '/datasources/prompt_lib/' + projectId,
        params: {
          ...params,
          limit: pageSize,
          offset: page * pageSize
        }
      }),
      providesTags: [TAG_TYPE_DATA_SOURCES],
      transformResponse: (response, meta, args) => {
        return {
          ...response,
          isLoadMore: args.page > 0,
        };
      },
      // Only keep one cacheEntry marked by the query's endpointName
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const sortedObject = {};
        Object.keys(queryArgs)
          .sort()
          .forEach(function (prop) {
            sortedObject[prop] = queryArgs[prop];
          });
        return endpointName + JSON.stringify(sortedObject);
      },
      // merge new page data into existing cache
      merge: (currentCache, newItems) => {
        if (newItems.isLoadMore) {
          currentCache.rows.push(...newItems.rows);
        } else {
          // isLoadMore means whether it's starting to fetch page 0, 
          // clear cache to avoid duplicate records
          currentCache.rows = newItems.rows;
          currentCache.total = newItems.total;
        }
      },
      // Refetch when the page, pageSize ... arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    totalDataSources: build.query({
      query: ({ projectId, params }) => ({
        url: apiSlicePath + '/datasources/prompt_lib/' + projectId,
        params: {
          ...params,
          limit: 1,
          offset: 0
        }
      }),
      providesTags: [TAG_TYPE_TOTAL_DATASOURCES],
    }),
    publicDataSourcesList: build.query({
      query: ({ page, params, pageSize = PAGE_SIZE }) => ({
        url: apiSlicePath + '/public_datasources/prompt_lib/',
        params: {
          ...params,
          limit: pageSize,
          offset: page * pageSize
        }
      }),
      providesTags: [TAG_TYPE_DATA_SOURCES],
      transformResponse: (response, meta, args) => {
        return {
          ...response,
          isLoadMore: args.page > 0,
        };
      },
      // Only keep one cacheEntry marked by the query's endpointName
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const sortedObject = {};
        Object.keys(queryArgs)
          .sort()
          .forEach(function (prop) {
            sortedObject[prop] = queryArgs[prop];
          });
        return endpointName + JSON.stringify(sortedObject);
      },
      // merge new page data into existing cache
      merge: (currentCache, newItems) => {
        if (newItems.isLoadMore) {
          currentCache.rows.push(...newItems.rows);
        } else {
          // isLoadMore means whether it's starting to fetch page 0, 
          // clear cache to avoid duplicate records
          currentCache.rows = newItems.rows;
          currentCache.total = newItems.total;
        }
      },
      // Refetch when the page, pageSize ... arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    datasourceCreate: build.mutation({
      query: ({ projectId, ...body }) => {
        return ({
          url: apiSlicePath + '/datasources/prompt_lib/' + projectId,
          method: 'POST',
          headers,
          body,
        });
      },
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({ type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id })]
      },
    }),

    datasourceDetails: build.query({
      query: ({ projectId, datasourceId, versionName }) => {
        let url = apiSlicePath + '/datasource/prompt_lib/' + projectId + '/' + datasourceId
        if (versionName) {
          url += '/' + versionName ? `/${versionName}` : ''
        }
        return {
          url,
          params: {}
        }
      },
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({ type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id })]
      },
    }),

  })
})

export const {
  useDatasourceListQuery,
  useTotalDataSourcesQuery,
  useDatasourceCreateMutation,
  useLazyDatasourceDetailsQuery,
  usePublicDataSourcesListQuery,
} = apiSlice

