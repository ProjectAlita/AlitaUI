import { alitaApi } from "./alitaApi.js";


const apiSlicePath = '/api_mock'
const TAG_TYPE_AUTHOR = 'Author'

export const mockApi = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_AUTHOR]
}).injectEndpoints({
    endpoints: build => ({
        trendingAuthorsList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/trending_authors/' + projectId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return result?.map(i => ({type: TAG_TYPE_AUTHOR, id: i.id}))
            }
        }),
        trendingAuthorsDetails: build.query({
            query: ({projectId, userId}) => ({
                url: apiSlicePath + '/trending_authors/' + projectId + '/' + userId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return [{type: TAG_TYPE_AUTHOR, id: result.id}]
            }
        }),
    })
})

export const {
    useTrendingAuthorsListQuery,
    useTrendingAuthorsDetailsQuery,
} = mockApi

