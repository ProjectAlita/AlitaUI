import { alitaApi } from "./alitaApi.js";
import { PUBLIC_PROJECT_ID } from '@/common/constants';


const apiSlicePath = '/auth'
const TAG_TYPE_AUTH = 'Auth'

export const apis = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_AUTH]
}).injectEndpoints({
  endpoints: build => ({
    permissionList: build.query({
      query: () => ({
        url: apiSlicePath + '/permissions/prompt_lib/' + PUBLIC_PROJECT_ID,
      }),
      providesTags: (result, error) => {
        if (error) {
          return []
        }
        return ['PERMISSION_LIST']
      }
    })
  })
})

export const {
  usePermissionListQuery,
} = apis

