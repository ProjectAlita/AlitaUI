import {alitaApi} from "./alitaApi.js";


const apiSlicePath = '/social'
const TAG_TYPE_USER = 'User'

export const socialApi = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_USER]
}).injectEndpoints({
  endpoints: build => ({
    authorDetails: build.query({
      query: () => ({
        url: apiSlicePath + '/author/',
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
    authorDescription: build.mutation({
      query: body => {
        return ({
          url: apiSlicePath + '/author/',
          method: 'PUT',
          body,
        })
      },
    })
  })
})

export const {
  useAuthorDetailsQuery,
  useLazyAuthorDetailsQuery,
  useAuthorDescriptionMutation
} = socialApi

