import { alitaApi } from "./alitaApi.js";

const apiSlicePath = '/prompt_lib/collections/prompt_lib/';
const detailPath = (projectId, collectionId) => 
  '/prompt_lib/collection/prompt_lib/' + projectId + '/' + collectionId;
const TAG_TYPE_COLLECTION = 'Collection';
const TAG_TYPE_COLLECTION_DETAIL = 'CollectionDetail';
const TAG_TYPE_COLLECTION_LIST = 'CollectionList';
const headers = {
  "Content-Type": "application/json"
};

const PAGE_SIZE = 20;

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
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [...(result?.rows?.map(i => ({ type: TAG_TYPE_COLLECTION, id: i.id })) || []), TAG_TYPE_COLLECTION_LIST]
      }
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
    }),
    getCollection: build.query({
      query: ({ projectId, collectionId }) => ({
        url: detailPath(projectId, collectionId),
        method: 'GET',
        headers,
      }),
      providesTags: [TAG_TYPE_COLLECTION_DETAIL],
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
      invalidatesTags: [TAG_TYPE_COLLECTION_DETAIL]
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
      invalidatesTags: [TAG_TYPE_COLLECTION_DETAIL]
    }),
    deleteCollection: build.mutation({
      query: ({ projectId, collectionId }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_COLLECTION_DETAIL],
    }),
  })
})

export const {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useLazyCollectionListQuery,
  useLazyGetCollectionQuery,
  useUpdateCollectionMutation,
  usePatchCollectionMutation,
} = apis;

