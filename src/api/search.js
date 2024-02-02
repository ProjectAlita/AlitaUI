import { PAGE_SIZE, AutoSuggestionTypes } from "@/common/constants.js";
import { alitaApi } from "./alitaApi.js";

const TAG_TYPE_SEARCH = 'Search'
const TAG_TYPE_SEARCH_OPTIONS = 'SearchOptions'

const processArrayParams = (params) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;

    const prefix = acc ? '&' : '?';
    if (Array.isArray(value)) {
      value.forEach(v => {
        acc += (prefix + key + '=' + v)
      })
    } else {
      acc += (prefix + key + '=' + value)
    }

    return acc
  }, '')
}

export const searchApi = alitaApi.enhanceEndpoints({
  addTagTypes: [TAG_TYPE_SEARCH]
}).injectEndpoints({
  endpoints: build => ({
    topSearch: build.query({
      query: ({ projectId, params }) => {
        return {
          url: '/prompt_lib/search_requests/prompt_lib/' + projectId,
          params,
        }
      },
      providesTags: [TAG_TYPE_SEARCH],
    }),
    autoSuggest: build.query({
      query: ({ projectId, page, pageSize = PAGE_SIZE, params }) => {
        const offset = page * pageSize
        const limit = pageSize;
        return {
          url: '/prompt_lib/search_options/prompt_lib/' +
            projectId + processArrayParams({
              ...params,
              prompt_limit: limit,
              prompt_offset: offset,
              tag_limit: limit,
              tag_offset: offset,
              col_limit: limit,
              col_offset: offset,
            }),
        }
      },
      providesTags: [TAG_TYPE_SEARCH_OPTIONS],
      transformResponse: (response, meta, args) => {
        return {
          ...response,
          isLoadMore: args.page > 0,
        };
      },
      // Only keep one cacheEntry marked by the query's endpointName
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const sortedObject = {};
        Object.keys(queryArgs)
          .filter(prop => prop !== 'page')
          .sort()
          .forEach(function (prop) {
            sortedObject[prop] = queryArgs[prop];
          });
        return endpointName + JSON.stringify(sortedObject);
      },
      // merge new page data into existing cache
      merge: (currentCache, newItems) => {
        if (newItems.isLoadMore) {
          AutoSuggestionTypes.forEach(type => {
            currentCache[type].rows.push(...newItems[type].rows);
          })
        } else {
          // isLoadMore means whether it's starting to fetch page 0, 
          // clear cache to avoid duplicate records
          AutoSuggestionTypes.forEach(type => {
            currentCache[type] = newItems[type]
          })
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  })
})

export const {
  useTopSearchQuery,
  useLazyTopSearchQuery,
  useAutoSuggestQuery,
  useLazyAutoSuggestQuery,
} = searchApi;

