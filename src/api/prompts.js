import { alitaApi } from "./alitaApi.js";
import { PAGE_SIZE } from '@/common/constants';

const apiSlicePath = '/prompt_lib';
const TAG_TYPE_PROMPT = 'Prompt';
const TAG_TYPE_TAG = 'Tag';
const TAG_TYPE_PROMPT_DETAIL = 'PromptDetail';
export const TAG_TYPE_PROMPT_LIST = 'PromptList';
const headers = {
  "Content-Type": "application/json"
};

const exportPromptQuery = ({ projectId, promptId, isDial }) => ({
  url: `${apiSlicePath}/export_import/prompt_lib/${projectId}/${promptId}?as_file=1${isDial ? '&to_dial=1' : ''}`,
  method: 'GET',
  headers
});

const importPromptQuery = ({ projectId, body }) => ({
  url: `${apiSlicePath}/export_import/prompt_lib/${projectId}`,
  method: 'POST',
  headers,
  body
});

export const promptApi = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_PROMPT]
}).injectEndpoints({
  endpoints: build => ({
    promptList: build.query({
      query: ({ projectId, page, params }) => ({
        url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
        params: {
          ...params,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE
        }
      }),
      providesTags: [TAG_TYPE_PROMPT_LIST],
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
          currentCache.total = newItems.total;
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    publicPromptList: build.query({
      query: ({ page, params }) => ({
        url: apiSlicePath + '/public_prompts/prompt_lib',
        params: {
          ...params,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE
        }
      }),
      providesTags: [TAG_TYPE_PROMPT_LIST],
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
          currentCache.total = newItems.total;
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createPrompt: build.mutation({
      query: ({ projectId, ...body }) => {
        return ({
          url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
          method: 'POST',
          headers,
          body,
        });
      },
    }),
    saveNewVersion: build.mutation({
      query: ({ projectId, promptId, ...body }) => {
        return ({
          url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId,
          method: 'POST',
          headers,
          body,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL]
    }),
    updateLatestVersion: build.mutation({
      query: ({ projectId, promptId, ...body }) => {
        return ({
          url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId,
          method: 'PUT',
          headers,
          body,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL]
    }),
    getPrompt: build.query({
      query: ({ projectId, promptId }) => {
        return ({
          url: apiSlicePath + '/prompt/prompt_lib/' + projectId + '/' + promptId,
          method: 'GET',
          headers,
        });
      },
      providesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    getVersionDetail: build.query({
      query: ({ projectId, promptId, version }) => {
        return ({
          url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId + '/' + encodeURIComponent(version),
          method: 'GET',
          headers,
        });
      },
    }),
    getPublicPrompt: build.query({
      query: ({ promptId }) => {
        return ({
          url: apiSlicePath + '/public_prompt/prompt_lib/' + promptId,
          method: 'GET',
          headers,
        });
      },
      providesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    deleteVersion: build.mutation({
      query: ({ projectId, promptId, version }) => {
        return ({
          url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId + '/' + encodeURIComponent(version),
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    updatePrompt: build.mutation({
      query: ({ projectId, ...body }) => {
        return ({
          url: apiSlicePath + '/prompt/prompt_lib/' + projectId + '/' + body.id,
          method: 'PUT',
          headers,
          body,
        });
      },
    }),
    publishVersion: build.mutation({
      query: ({ projectId, versionId }) => {
        return ({
          url: apiSlicePath + '/publish/prompt_lib/' + projectId + '/' + versionId,
          method: 'POST',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    unpublishVersion: build.mutation({
      query: ({ versionId, projectId }) => {
        return ({
          url: apiSlicePath + '/unpublish/prompt_lib/' + projectId + '/' + versionId,
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    approveVersion: build.mutation({
      query: ({ versionId }) => {
        return ({
          url: apiSlicePath + '/approve/prompt_lib/' + versionId,
          method: 'POST',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    rejectVersion: build.mutation({
      query: ({ versionId }) => {
        return ({
          url: apiSlicePath + '/reject/prompt_lib/' + versionId,
          method: 'POST',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
    }),
    deletePrompt: build.mutation({
      query: ({ projectId, promptId }) => {
        return ({
          url: apiSlicePath + '/prompt/prompt_lib/' + projectId + '/' + promptId,
          method: 'DELETE',
          headers,
        });
      },
      invalidatesTags: [TAG_TYPE_PROMPT_LIST],
    }),
    tagList: build.query({
      query: ({projectId, offset = 0, limit = 100, statuses, authorId, query}) => ({
        url: apiSlicePath + '/tags/prompt_lib/' + projectId + '?top_n=100' + '&limit=' + limit + '&offset=' + offset + `${(statuses && statuses !== 'all')? '&statuses=' + statuses: ''}` + `${authorId? '&author_id=' + authorId: ''}` + `${query? '&query=' + query: ''}`,
      }),
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return result?.map(i => ({ type: TAG_TYPE_TAG, id: i.id }))
      }
    }),
    askAlita: build.mutation({
      query: ({ projectId, prompt_id, ...body }) => {
        return ({
          url: prompt_id ? apiSlicePath + `/predict/prompt_lib/${projectId}/${prompt_id}` : apiSlicePath + `/predict/prompt_lib/${projectId}`,
          method: 'POST',
          headers,
          body,
        });
      },
    }),
    exportPrompt: build.mutation({
      query: exportPromptQuery,
    }),
    importPrompt: build.mutation({
      query: importPromptQuery,
    }),
  })
})

export const {
  useCreatePromptMutation,
  useUpdatePromptMutation,
  useUpdateLatestVersionMutation,
  useSaveNewVersionMutation,
  useGetPromptQuery,
  useLazyGetPromptQuery,
  useLazyPromptListQuery,
  usePromptListQuery,
  useTagListQuery,
  useLazyTagListQuery,
  useAskAlitaMutation,
  useLazyGetVersionDetailQuery,
  useDeletePromptMutation,
  useDeleteVersionMutation,
  useApproveVersionMutation,
  useRejectVersionMutation,
  usePublishVersionMutation,
  useUnpublishVersionMutation,
  usePublicPromptListQuery,
  useGetPublicPromptQuery,
  useExportPromptMutation,
  useImportPromptMutation
} = promptApi

