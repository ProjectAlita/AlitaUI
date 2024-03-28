import {alitaApi} from "./alitaApi.js";

const apiSlicePath = '/secrets'
const TAG_TYPE_SECRETS = 'SECRETS'

export const apis = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_SECRETS,]
}).injectEndpoints({
  endpoints: build => ({
    secretsList: build.query({
      query: (projectId) => ({
        url: apiSlicePath + '/secrets/default/' + projectId,
      }),
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_SECRETS]
      }
    }),
    
  })
})

export const { useSecretsListQuery } = apis

