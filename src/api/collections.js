import { alitaApi } from "./alitaApi.js";

const apiSlicePath = '/prompt_lib/collections/prompt_lib/';
const detailPath = (projectId, collectionId) => 
  '/prompt_lib/collection/prompt_lib/' + projectId + '/' + collectionId;
const TAG_TYPE_COLLECTION = 'Collection';
const TAG_TYPE_COLLECTION_DETAIL = 'CollectionDetail';
const TAG_TYPE_COLLECTION_LIST = 'CollectionList';

export const apis = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_COLLECTION]
}).injectEndpoints({
  endpoints: build => ({
    collectionList: build.query({
      query: ({ projectId, params }) => ({
        url: apiSlicePath + projectId,
        params
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
          headers: {
            "Content-Type": "application/json"
          },
          body,
        });
      },
    }),
    getCollection: build.query({
      query: ({ projectId, collectionId }) => ({
        url: detailPath(projectId, collectionId),
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
      }),
      providesTags: [TAG_TYPE_COLLECTION_DETAIL],
    }),
    updateCollection: build.mutation({
      query: ({ projectId, collectionId, ...body }) => {
        return ({
          url: detailPath(projectId, collectionId),
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
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
          headers: {
            "Content-Type": "application/json"
          },
        });
      },
      invalidatesTags: [TAG_TYPE_COLLECTION_DETAIL],
    }),
  })
})

export const {
  useLazyCollectionListQuery,
  useLazyGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation
} = apis;

