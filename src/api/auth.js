import {alitaApi} from "./alitaApi.js";
import {PUBLIC_PROJECT_ID} from '@/common/constants';


const apiSlicePath = '/auth'
const TAG_TYPE_AUTH = 'Auth'
const TAG_TYPE_PERMISSIONS = 'PERMISSION_LIST'

export const apis = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_AUTH, TAG_TYPE_PERMISSIONS,]
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
    }),
    
    tokenList: build.query({
      query: () => ({
        url: apiSlicePath + '/token/',
      }),
    }),
    
    tokenCreate: build.mutation({
      query: (body) => {
        return ({
          url: apiSlicePath + '/token/',
          method: 'POST',
          body: body,
        })
      },
    }),

    tokenDelete: build.mutation({
      query: ({uuid}) => {
        return ({
          url: apiSlicePath + '/token/' + uuid,
          method: 'DELETE',
        })
      },
    })
  })
})

export const {
  usePermissionListQuery,
  useLazyPermissionListQuery,
  useTokenListQuery,
  useTokenCreateMutation,
  useTokenDeleteMutation,
} = apis

