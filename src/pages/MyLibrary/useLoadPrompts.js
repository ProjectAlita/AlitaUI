import {
  useLazyLoadMorePromptsQuery,
  useLazyPromptListQuery} from '@/api/prompts.js';

export const useLoadPrompts = () => {
  const [loadPrompts, {
    data,
    error: promptFirstError,
    isError: isPromptError,
    isLoading: isPromptLoading,
    isFetching: isPromptFirstFetching }] = useLazyPromptListQuery();

  const [loadMore, {
    error: promptMoreError,
    isError: isMorePromptError,
    isFetching: isPromptFetching,
  }] = useLazyLoadMorePromptsQuery();

  return {
    loadPrompts,
    loadMore,
    data,
    isPromptError,
    isMorePromptError,
    isPromptFirstFetching,
    isPromptFetching,
    isPromptLoading,
    promptError: promptFirstError || promptMoreError,
  };
}
