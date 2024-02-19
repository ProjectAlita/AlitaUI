import {PAGE_SIZE} from '@/common/constants';
import {alitaApi} from "./alitaApi.js";

const TAG_TYPE_DATASOURCE_DETAILS = 'TAG_TYPE_DATASOURCE_DETAILS'
const apiSlicePath = '/datasources'
const headers = {
  "Content-Type": "application/json"
}

export const apiSlice = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_DATASOURCE_DETAILS]
}).injectEndpoints({
  endpoints: build => ({
    datasourceList: build.query({
      query: ({projectId, page, params, pageSize = PAGE_SIZE}) => ({
        url: apiSlicePath + '/datasources/prompt_lib/' + projectId,
        params: {
          ...params,
          limit: pageSize,
          offset: page * pageSize
        }
      }),
    }),

    datasourceCreate: build.mutation({
      query: ({projectId, ...body}) => {
        return ({
          url: apiSlicePath + '/datasources/prompt_lib/' + projectId,
          method: 'POST',
          headers,
          body,
        });
      },
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id})]
      },
    }),

    datasourceDetails: build.query({
      query: ({projectId, datasourceId, versionName}) => {
        let url = apiSlicePath + '/datasource/prompt_lib/' + projectId + '/' + datasourceId
        if (versionName) {
          url += '/' + versionName ? `/${versionName}` : ''
        }
        return {
          url ,
          params: {}
        }
      },
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return [TAG_TYPE_DATASOURCE_DETAILS, ({type: TAG_TYPE_DATASOURCE_DETAILS, id: result?.id})]
      },
    }),

  })
})

export const {
  useDatasourceListQuery,
  useDatasourceCreateMutation,
  useLazyDatasourceDetailsQuery,
} = apiSlice

