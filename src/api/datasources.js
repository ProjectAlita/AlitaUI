import { PAGE_SIZE, PUBLIC_PROJECT_ID } from '@/common/constants';
import { alitaApi } from "./alitaApi.js";
import { stringToList } from '@/common/utils.jsx';

const TAG_TYPE_DATA_SOURCES = 'TAG_TYPE_DATA_SOURCES'
const TAG_TYPE_PUBLIC_DATA_SOURCES = 'TAG_TYPE_PUBLIC_DATA_SOURCES'
const TAG_TYPE_DATASOURCE_DETAILS = 'TAG_TYPE_DATASOURCE_DETAILS'
const TAG_TYPE_TOTAL_DATASOURCES = 'TAG_TYPE_TOTAL_DATASOURCES'
const TAG_TYPE_TOTAL_PUBLIC_DATASOURCES = 'TAG_TYPE_TOTAL_PUBLIC_DATASOURCES'

const apiSlicePath = '/datasources'
const apiSlicePathForLike = '/prompt_lib/like/prompt_lib/';
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
      providesTags: [TAG_TYPE_PUBLIC_DATA_SOURCES],
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
    totalPublicDataSources: build.query({
      query: ({ params }) => ({
        url: apiSlicePath + '/public_datasources/prompt_lib',
        params: {
          ...params,
          limit: 1,
          offset: 0
        }
      }),
      providesTags: [TAG_TYPE_TOTAL_PUBLIC_DATASOURCES],
    }),
    likeDataSource: build.mutation({
      query: (datasourceId) => {
        return ({
          url: apiSlicePathForLike + PUBLIC_PROJECT_ID + '/datasource/' + datasourceId,
          method: 'POST',
        });
      },
      invalidatesTags: [TAG_TYPE_TOTAL_PUBLIC_DATASOURCES, TAG_TYPE_DATASOURCE_DETAILS],
    }),
    unlikeDataSource: build.mutation({
      query: (datasourceId) => {
        return ({
          url: apiSlicePathForLike + PUBLIC_PROJECT_ID + '/datasource/' + datasourceId,
          method: 'DELETE',
        });
      },
      invalidatesTags: [TAG_TYPE_TOTAL_PUBLIC_DATASOURCES, TAG_TYPE_DATASOURCE_DETAILS],
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
      invalidatesTags: [TAG_TYPE_TOTAL_DATASOURCES, TAG_TYPE_DATA_SOURCES]
    }),
    datasourceEdit: build.mutation({
      query: ({ projectId, ...body }) => {
        return ({
          url: apiSlicePath + '/datasource/prompt_lib/' + projectId + '/' + body.id,
          method: 'PUT',
          headers,
          body,
        });
      },
      invalidatesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({ type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id })]
      },
    }),
    deleteDatasource: build.mutation({
      query: ({ projectId, datasourceId }) => {
        return ({
          url: apiSlicePath + '/datasource/prompt_lib/' + projectId + '/' + datasourceId,
          method: 'DELETE',
        });
      },
      invalidatesTags: [TAG_TYPE_TOTAL_DATASOURCES, TAG_TYPE_DATA_SOURCES],
    }),
    publishDatasource: build.mutation({
      query: ({ projectId, datasourceId }) => {
        return ({
          url: apiSlicePath + '/publish/prompt_lib/' + projectId + '/' + datasourceId,
          method: 'POST',
        });
      },
      invalidatesTags: (result, error, arg) => [{ type: TAG_TYPE_DATASOURCE_DETAILS, id: arg.id }],
    }),
    unpublishDatasource: build.mutation({
      query: ({ projectId, datasourceId }) => {
        return ({
          url: apiSlicePath + '/unpublish/prompt_lib/' + projectId + '/' + datasourceId,
          method: 'DELETE',
        });
      },
      invalidatesTags: (result, error, arg) => [{ type: TAG_TYPE_DATASOURCE_DETAILS, id: arg.id }],
    }),
    datasourceDetails: build.query({
      query: ({ projectId, datasourceId, versionName }) => {
        let url = apiSlicePath + '/datasource/prompt_lib/' + projectId + '/' + datasourceId
        if (versionName) {
          url += '/' + versionName ? `/${versionName}` : ''
        }
        return {
          url
        }
      },
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({ type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id })]
      },
    }),

    datasetCreate: build.mutation({
      query: ({ projectId, ...body }) => {
        const form = new FormData()

        if (body?.source?.options?.file) {
          form.append('file', body.source.options.file)
          delete body.source.options.file
        }

        if (body.source?.options?.extension_whitelist !== undefined) {
          body.source.options.extension_whitelist = stringToList(body.source?.options?.extension_whitelist)
        }
        if (body.source?.options?.extension_blacklist !== undefined) {
          body.source.options.extension_blacklist = stringToList(body.source?.options?.extension_blacklist)
        } 

        form.append('data', JSON.stringify(body))

        return ({
          url: apiSlicePath + '/datasets/prompt_lib/' + projectId + '?is_form=true',
          method: 'POST',
          body: form,
          formData: true
        });
      },
      invalidatesTags: (result, error) => {
        if (error) return []
        return [TAG_TYPE_DATASOURCE_DETAILS]
      }
    }),
    predict: build.mutation({
      query: ({ projectId, versionId, ...body }) => {
        return ({
          url: apiSlicePath + '/predict/prompt_lib/' + projectId + '/' + versionId,
          method: 'POST',
          headers,
          body,
        });
      }
    }),

    datasetUpdate: build.mutation({
      query: ({ projectId, datasetId, ...body }) => {
        return ({
          url: apiSlicePath + '/dataset/prompt_lib/' + projectId + '/' + datasetId,
          method: 'PUT',
          headers,
          body,
        });
      },
      invalidatesTags: [TAG_TYPE_DATASOURCE_DETAILS],
    }),
    datasetDelete: build.mutation({
      query: ({ projectId, datasetId }) => {
        return ({
          url: apiSlicePath + '/dataset/prompt_lib/' + projectId + '/' + datasetId,
          method: 'DELETE',
        });
      },
      invalidatesTags: [TAG_TYPE_DATASOURCE_DETAILS],
    }),
    datasetStopTask: build.mutation({
      query: ({ projectId, datasetId }) => {
        return ({
          url: apiSlicePath + '/dataset_status/prompt_lib/' + projectId + '/' + datasetId,
          method: 'DELETE',
        });
      },
      invalidatesTags: (result, error) => {
        if (error) return []
        return [TAG_TYPE_DATASOURCE_DETAILS]
      }
    }),
    search: build.mutation({
      query: ({ projectId, versionId, ...body }) => {
        return ({
          url: apiSlicePath + '/search/prompt_lib/' + projectId + '/' + versionId,
          method: 'POST',
          headers,
          body,
        });
      }
    }),
    deduplicate: build.mutation({
      query: ({ projectId, versionId, ...body }) => {
        return ({
          url: apiSlicePath + '/deduplicate/prompt_lib/' + projectId + '/' + versionId,
          method: 'POST',
          headers,
          body,
        });
      }
    }),

  })
})

export const {
  useDatasourceListQuery,
  useTotalDataSourcesQuery,
  useTotalPublicDataSourcesQuery,
  useDatasourceCreateMutation,
  useDatasourceEditMutation,
  useLazyDatasourceDetailsQuery,
  usePublicDataSourcesListQuery,
  useDeleteDatasourceMutation,
  useDatasetCreateMutation,
  usePredictMutation,
  useDatasetUpdateMutation,
  useDatasetDeleteMutation,
  useDatasetStopTaskMutation,
  useSearchMutation,
  useDeduplicateMutation,
  usePublishDatasourceMutation,
  useUnpublishDatasourceMutation,
  useLikeDataSourceMutation,
  useUnlikeDataSourceMutation,
} = apiSlice

