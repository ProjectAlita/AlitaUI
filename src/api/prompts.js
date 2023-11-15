import { alitaApi } from "./alitaApi.js";

const apiSlicePath = '/prompt_lib'
const TAG_TYPE_PROMPT = 'Prompt'
const TAG_TYPE_TAG = 'Tag'

export const promptApi = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_PROMPT]
}).injectEndpoints({
    endpoints: build => ({
        promptList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/prompts/prompt_lib/' + projectId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return result?.map(i => ({ type: TAG_TYPE_PROMPT, id: i.id }))
            }
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
        getPrompt: build.query({
            query: ({ projectId, promptId }) => {
                return ({
                    url: apiSlicePath + '/prompt/prompt_lib' + projectId + '/' + promptId,
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
                    url: apiSlicePath + '/prompt/default/' + projectId,
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
                url: apiSlicePath + '/tags/default/' + projectId,
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
    useGetPromptQuery,
    usePromptListQuery,
    useTagListQuery,
    useAskAlitaMutation,
} = promptApi

