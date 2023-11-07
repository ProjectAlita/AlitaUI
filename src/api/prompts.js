import { alitaApi } from "./alitaApi.js";


const apiSlicePath = '/prompts'
const TAG_TYPE_PROMPT = 'Prompt'
const TAG_TYPE_TAG = 'Tag'

export const promptApi = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_PROMPT]
}).injectEndpoints({
    endpoints: build => ({
        promptList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/prompts/' + projectId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return result?.map(i => ({ type: TAG_TYPE_PROMPT, id: i.id }))
            }
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
            query: ({ projectId, ...body }) => {
                return ({
                    url: `/prompts/predict/default/${projectId}`,
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
    usePromptListQuery,
    useTagListQuery,
    useAskAlitaMutation,
} = promptApi

