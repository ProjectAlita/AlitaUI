import { alitaApi } from "./alitaApi.js";

const apiSlicePath = '/prompt_lib';
const TAG_TYPE_PROMPT = 'Prompt';
const TAG_TYPE_TAG = 'Tag';
const TAG_TYPE_PROMPT_DETAIL = 'PromptDetail';
const TAG_TYPE_PROMPT_LIST = 'PromptList';

const loadPromptQuery = ({ projectId, params }) => ({
    url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
    params
});

const loadPublicPromptQuery = ({ params }) => ({
    url: apiSlicePath + '/public_prompts/prompt_lib',
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
                return [...(result?.rows?.map(i => ({ type: TAG_TYPE_PROMPT, id: i.id })) || []), TAG_TYPE_PROMPT_LIST]
            }
        }),
        loadMorePrompts: build.query({
            query: loadPromptQuery,
        }),
        publicPromptList: build.query({
            query: loadPublicPromptQuery,
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return [...(result?.rows?.map(i => ({ type: TAG_TYPE_PROMPT, id: i.id })) || []), TAG_TYPE_PROMPT_LIST]
            }
        }),
        loadMorePublicPrompts: build.query({
            query: loadPublicPromptQuery,
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
            query: ({ projectId, promptId, ...body }) => {
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
        getPublicPrompt: build.query({
            query: ({ promptId }) => {
                return ({
                    url: apiSlicePath + '/public_prompt/prompt_lib/' + promptId,
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
            providesTags: [TAG_TYPE_PROMPT_DETAIL],
        }),
        deleteVersion: build.mutation({
            query: ({ projectId, promptId, version }) => {
                return ({
                    url: apiSlicePath + '/version/prompt_lib/' + projectId + '/' + promptId + '/' + encodeURIComponent(version),
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
            invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
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
        publishVersion: build.mutation({
            query: ({ projectId, versionId }) => {
                return ({
                    url: apiSlicePath + '/publish/prompt_lib/' + projectId + '/' + versionId,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
            invalidatesTags: [TAG_TYPE_PROMPT_DETAIL],
        }),
        deletePrompt: build.mutation({
            query: ({ projectId, promptId }) => {
                return ({
                    url: apiSlicePath + '/prompt/prompt_lib/' + projectId + '/' + promptId,
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
            },
            invalidatesTags: [TAG_TYPE_PROMPT_LIST],
        }),
        tagList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/tags/prompt_lib/' + projectId + '?top_n=100',
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
    usePromptListQuery,
    useTagListQuery,
    useLazyTagListQuery,
    useAskAlitaMutation,
    useLazyGetVersionDetailQuery,
    useDeletePromptMutation,
    useDeleteVersionMutation,
    usePublishVersionMutation,
    useLazyLoadMorePublicPromptsQuery,
    useLazyPublicPromptListQuery,
    useGetPublicPromptQuery,
} = promptApi

