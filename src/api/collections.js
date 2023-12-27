import { alitaApi } from "./alitaApi.js";
import { PAGE_SIZE } from '@/common/constants.js';

const apiSlicePath = '/prompt_lib/collections/prompt_lib/';
const detailPath = (projectId, collectionId) => 
  '/prompt_lib/collection/prompt_lib/' + projectId + '/' + collectionId;
const TAG_TYPE_COLLECTION = 'Collection';
export const TAG_TYPE_COLLECTION_LIST = 'CollectionList';
const TAG_TYPE_COLLECTION_DETAIL = 'CollectionDetail';
const headers = {
  "Content-Type": "application/json"
};

const invalidateTagsOnMutation = (result, error) => {
  if (error) return []
  return [({ type: TAG_TYPE_COLLECTION_DETAIL, id: result?.id }), TAG_TYPE_COLLECTION_LIST]
}

export const apis = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_COLLECTION]
}).injectEndpoints({
  endpoints: build => ({
    collectionList: build.query({
      query: ({ projectId, page, params }) => ({
        url: apiSlicePath + projectId,
        params: {
          ...params,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE
        }
      }),
      providesTags: [TAG_TYPE_COLLECTION_LIST],
      transformResponse: (response, meta, args) => {
        return {
          ...response,
          isLoadMore: args.page > 0,
        };
      },
      // Only keep one cacheEntry marked by the query's endpointName
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // merge new page data into existing cache
      merge: (currentCache, newItems) => {
        if (newItems.isLoadMore) {
          currentCache.rows.push(...newItems.rows);
        } else {
          // isLoadMore means whether it's starting to fetch page 0, 
          // clear cache to avoid duplicate records
          currentCache.rows = newItems.rows;
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createCollection: build.mutation({
      query: ({ projectId, ...body }) => {
        return ({
          url: apiSlicePath + projectId,
          method: 'POST',
          headers, 
          body,
        });
      },
      providesTags: (result, error) => {
        if (error) return []
        return [({ type: TAG_TYPE_COLLECTION_DETAIL, id: result?.id })]
      },
      invalidatesTags: [TAG_TYPE_COLLECTION_LIST]
    }),
    getCollection: build.query({
      query: ({ projectId, collectionId }) => ({
        url: detailPath(projectId, collectionId),
        method: 'GET',
        headers,
      }),
      providesTags: (result, error) => {
        if (error) return []
        return [({ type: TAG_TYPE_COLLECTION_DETAIL, id: result?.id })]
      },
    }),
    updateCollection: build.mutation({
      query: ({ projectId, collectionId, ...body }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'PUT',
          headers,
          body,
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
    patchCollection: build.mutation({
      query: ({ projectId, collectionId, body }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'PATCH',
          headers,
          body,
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
    deleteCollection: build.mutation({
      query: ({ projectId, collectionId }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
  })
})

export const {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useCollectionListQuery,
  useGetCollectionQuery,
  useLazyGetCollectionQuery,
  useUpdateCollectionMutation,
  usePatchCollectionMutation,
} = apis;

