import { alitaApi } from "./alitaApi.js";


const apiSlicePath = '/auth'
const TAG_TYPE_USER = 'User'

export const authApi = alitaApi.enhanceEndpoints({
    addTagTypes: [TAG_TYPE_USER]
}).injectEndpoints({
    endpoints: build => ({
        userDetails: build.query({
            query: () => ({
                url: apiSlicePath + '/user/',
            }),
            providesTags: (result, error) => {
                if (error) {
                    return []
                }
                const {id} = result
                // eslint-disable-next-line no-console
                console.log('providesTags result', [
                    {type: TAG_TYPE_USER, id},
                    {type: TAG_TYPE_USER, id: 'DETAILS'}
                ])
                return [{type: TAG_TYPE_USER, id}, {type: TAG_TYPE_USER, id: 'DETAILS'}]
            }
        }),
    })
})

export const {
    useUserDetailsQuery,
    useLazyUserDetailsQuery,
} = authApi

