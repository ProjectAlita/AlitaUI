import { alitaApi } from "./alitaApi.js";
import { PAGE_SIZE } from '@/common/constants.js';

const apiSlicePath = '/prompt_lib/collections/prompt_lib/';
const detailPath = (projectId, collectionId) =>
  '/prompt_lib/collection/prompt_lib/' + projectId + '/' + collectionId;
const publicDetailPath = (collectionId) =>
  '/prompt_lib/public_collection/prompt_lib/' + collectionId;
const TAG_TYPE_COLLECTION = 'Collection';
export const TAG_TYPE_COLLECTION_LIST = 'CollectionList';
export const TAG_TYPE_TOTAL_COLLECTION = 'TotalCollections';
const TAG_TYPE_COLLECTION_DETAIL = 'CollectionDetail';
const headers = {
  "Content-Type": "application/json"
};

const invalidateTagsOnMutation = (result, error) => {
  if (error) return []
  return [({ type: TAG_TYPE_COLLECTION_DETAIL, id: result?.id }), TAG_TYPE_COLLECTION_LIST, TAG_TYPE_TOTAL_COLLECTION]
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
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    totalCollectionList: build.query({
      query: ({ projectId, params }) => ({
        url: apiSlicePath + projectId,
        params: {
          ...params,
          limit: 1,
          offset: 0
        }
      }),
      providesTags: [TAG_TYPE_TOTAL_COLLECTION],
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
      invalidatesTags: [TAG_TYPE_COLLECTION_LIST, TAG_TYPE_TOTAL_COLLECTION]
    }),
    getCollection: build.query({
      query: ({ projectId, collectionId }) => ({
        url: detailPath(projectId, collectionId),
        method: 'GET',
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
    publishCollection: build.mutation({
      query: ({ projectId, collectionId }) => {
        return ({
          url: '/prompt_lib/publish_collection/prompt_lib/' + projectId + '/' + collectionId,
          method: 'POST',
          headers,
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
    unpublishCollection: build.mutation({
      query: ({ projectId, collectionId }) => {
        return ({
          url: '/prompt_lib/unpublish_collection/prompt_lib/'+ projectId + '/' + collectionId,
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
    deleteCollection: build.mutation({
      query: ({ projectId, collectionId }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'DELETE',
        });
      },
      invalidatesTags: invalidateTagsOnMutation,
    }),
    getPublicCollection: build.query({
      query: ({ collectionId }) => ({
        url: publicDetailPath(collectionId),
        method: 'GET',
      }),
      providesTags: (result, error) => {
        if (error) return []
        return [({ type: TAG_TYPE_COLLECTION_DETAIL, id: result?.id })]
      },
    }),
  })
})

export const {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useCollectionListQuery,
  useGetCollectionQuery,
  useGetPublicCollectionQuery,
  useLazyGetCollectionQuery,
  usePublishCollectionMutation,
  useUnpublishCollectionMutation,
  useUpdateCollectionMutation,
  usePatchCollectionMutation,
  useTotalCollectionListQuery,
} = apis;

