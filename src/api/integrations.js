import { alitaApi } from "./alitaApi.js";

const projectMode = 'default'

const TAG_DEPLOYMENT_DETAILS = 'TAG_DEPLOYMENT_DETAILS';

export const integrationsApi = alitaApi.enhanceEndpoints({
  addTagTypes: ['integrations'],
}).injectEndpoints({
  endpoints: build => ({
    getModels: build.query({
      query: (projectId) => ({
        url: `/integrations/integrations/${projectMode}/${projectId}?section=ai`,
      }),
    }),
    getDeploymentDetail: build.query({
      query: ({projectId, uid}) => ({
        url: `/integrations/integration/${projectMode}/${projectId}/${uid}`,
      }),
      providesTags: [TAG_DEPLOYMENT_DETAILS],
    }),
    deleteDeployment: build.mutation({
      query: ({ projectId, id }) => ({
        method: 'DELETE',
        url: `/integrations/integration/${projectMode}/${projectId}/${id}`,
      }),
    }),
    makeDeploymentDefault: build.mutation({
      query: ({ projectId, id, is_shared }) => ({
        method: 'PATCH',
        url: `/integrations/integration/${projectMode}/${projectId}/${id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          local: !is_shared,
        }
      }),
    }),
    updateDeployment: build.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `/integrations/integration/${projectMode}/${id}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }),
      invalidatesTags: [TAG_DEPLOYMENT_DETAILS]
    }),
    createAIDeployment: build.mutation({
      query: ({ aiType, body }) => ({
        method: 'POST',
        url: `/integrations/integration/${projectMode}/${aiType}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }),
    }),
    loadModels: build.mutation({
      query: ({ aiType, projectId, body }) => ({
        method: 'POST',
        url: `/${aiType}/models/${projectMode}/${projectId}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }),
    }),
    testConnection: build.mutation({
      query: ({ aiType, body }) => ({
        method: 'POST',
        url: `/integrations/check_settings/${projectMode}/${aiType}`,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      }),
    }),
  })
})

export const {
  useGetModelsQuery,
  useLazyGetModelsQuery,
  useGetDeploymentDetailQuery,
  useMakeDeploymentDefaultMutation,
  useDeleteDeploymentMutation,
  useUpdateDeploymentMutation,
  useCreateAIDeploymentMutation,
  useLoadModelsMutation,
  useTestConnectionMutation,
} = integrationsApi

