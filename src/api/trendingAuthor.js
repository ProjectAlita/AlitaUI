import { alitaApi } from "./alitaApi.js";


const apiSlicePath = '/prompt_lib';
const TAG_TYPE_AUTHOR = 'Author'
const TAG_TYPE_AUTHOR_DETAIL = 'AuthorDetail'

export const trendingAuthor = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_AUTHOR]
}).injectEndpoints({
    endpoints: build => ({
        trendingAuthorsList: build.query({
            query: (projectId) => ({
                url: apiSlicePath + '/trending_authors/prompt_lib/' + projectId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return result?.map(i => ({type: TAG_TYPE_AUTHOR, id: i.id}))
            }
        }),
        trendingAuthorsDetails: build.query({
            query: (authorId) => ({
                url: apiSlicePath + '/author/prompt_lib/' + authorId,
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                return [{type: TAG_TYPE_AUTHOR_DETAIL, id: result.id}]
            }
        }),
    })
})

export const {
    useTrendingAuthorsListQuery,
    useTrendingAuthorsDetailsQuery,
    useLazyTrendingAuthorsDetailsQuery,
} = trendingAuthor

