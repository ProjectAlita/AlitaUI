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
          url: '/projects/project/' + PROJECT_MODE,
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
