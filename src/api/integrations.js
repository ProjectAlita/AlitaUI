import { alitaApi } from "./alitaApi.js";

const projectMode = 'default'

export const integrationsApi = alitaApi.enhanceEndpoints({
    addTagTypes: ['integrations'],
}).injectEndpoints({
    endpoints: build => ({
        getModels: build.query({
            query: (projectId) => ({
              url: `/integrations/integrations/${projectMode}/${projectId}?name=open_ai`,
            }),
        }),
    })
})

export const {
  useGetModelsQuery,
} = integrationsApi

