import { alitaApi } from "./alitaApi.js";

const apiSlicePath = '/prompt_lib';
const TAG_TYPE_PROMPT = 'Prompt';
const TAG_TYPE_TAG = 'Tag';
const TAG_TYPE_PROMPT_DETAIL = 'PromptDetail'


const loadPromptQuery = ({projectId, params}) => ({
  url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
  params
});

export const promptApi = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_PROMPT]
}).injectEndpoints({
    endpoints: build => ({
        promptList: build.query({
            query: loadPromptQuery,
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return result?.rows?.map(i => ({ type: TAG_TYPE_PROMPT, id: i.id }))
            }
        }),
        loadMorePrompts: build.query({
          query: loadPromptQuery,
        }),
        createPrompt: build.mutation({
            query: ({ projectId, ...body }) => {
                return ({
                    url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body,
                });
            },
        }),
        saveNewVersion: build.mutation({
            query: ({ projectId, promptId,...body }) => {
                return ({
                    url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
            providesTags: [TAG_TYPE_PROMPT_DETAIL],
        }),
        getVersionDetail: build.query({
            query: ({ projectId, promptId, version }) => {
                return ({
                    url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId + '/' + encodeURIComponent(version),
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
        }),
        updatePrompt: build.mutation({
            query: ({ projectId, ...body }) => {
                return ({
                    url: apiSlicePath + '/prompt/prompt_lib/' + projectId + '/' + body.id,
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body,
                });
            },
        }),
        tagList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/tags/prompt_lib/' + projectId + '?top_n=10',
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
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body,
                });
            },
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
    useLazyLoadMorePromptsQuery,
    useLazyPromptListQuery,
    useTagListQuery,
    useAskAlitaMutation,
    useLazyGetVersionDetailQuery,
} = promptApi

