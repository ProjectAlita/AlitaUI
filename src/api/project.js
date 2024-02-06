import { PUBLIC_PROJECT_ID } from "@/common/constants.js";
import { alitaApi } from "./alitaApi.js";

const TAG_TYPE_PROJECT = 'PROJECT';
const PROJECT_MODE = 'default';

export const projectApi = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_PROJECT]
}).injectEndpoints({
  endpoints: build => ({
    projectList: build.query({
      query: () => {
        return {
          url: '/projects/project/' + PROJECT_MODE + '/' + PUBLIC_PROJECT_ID,
          method: 'GET',
        }
      },
      providesTags: [TAG_TYPE_PROJECT],
    }),
  })
})

export const {
  useProjectListQuery,
  useLazyProjectListQuery,
} = projectApi;
