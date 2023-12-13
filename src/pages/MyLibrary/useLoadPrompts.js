import { ViewMode } from '@/common/constants';
import { useMemo } from 'react';
import {
  useLazyLoadMorePromptsQuery,
  useLazyPromptListQuery,
  useLazyLoadMorePublicPromptsQuery,
  useLazyPublicPromptListQuery
} from '@/api/prompts.js';

export const useLoadPrompts = (viewMode) => {
  const [loadPrivatePrompts, {
    data: privateData,
    isError: isPrivatePromptError,
    isLoading: isPrivatePromptLoading,
    isFetching: isPrivatePromptFirstFetching }] = useLazyPromptListQuery();

  const [loadPublicPrompts, {
    data: publicData,
    isError: isPublicPromptError,
    isLoading: isPublicPromptLoading,
    isFetching: isPublicPromptFirstFetching }] = useLazyPublicPromptListQuery();

  const [loadPrivateMore, {
    isError: isPrivateMorePromptError,
    isFetching: isPrivatePromptFetching,
    error: privatePromptError
  }] = useLazyLoadMorePromptsQuery();

  const [loadPublicMore, {
    isError: isPublicMorePromptError,
    isFetching: isPublicPromptFetching,
    error: publicPromptError
  }] = useLazyLoadMorePublicPromptsQuery();

  const {
    loadPrompts,
    loadMore,
    data,
    isPromptError,
    isMorePromptError,
    isPromptFirstFetching,
    isPromptFetching,
    isPromptLoading,
    promptError,
  } = useMemo(() => {
    return viewMode === ViewMode.Public ?
      {
        loadPrompts: loadPublicPrompts,
        loadMore: loadPublicMore,
        data: publicData,
        isPromptLoading: isPublicPromptLoading,
        isPromptError: isPublicPromptError,
        isMorePromptError: isPublicMorePromptError,
        isPromptFirstFetching: isPublicPromptFirstFetching,
        isPromptFetching: isPublicPromptFetching,
        promptError: publicPromptError,
      }
      :
      {
        loadPrompts: loadPrivatePrompts,
        loadMore: loadPrivateMore,
        data: privateData,
        isPromptLoading: isPrivatePromptLoading,
        isPromptError: isPrivatePromptError,
        isMorePromptError: isPrivateMorePromptError,
        isPromptFirstFetching: isPrivatePromptFirstFetching,
        isPromptFetching: isPrivatePromptFetching,
        promptError: privatePromptError,
      };
  }, [
    isPrivateMorePromptError,
    isPrivatePromptError,
    isPrivatePromptFetching,
    isPrivatePromptFirstFetching,
    isPrivatePromptLoading,
    isPublicMorePromptError,
    isPublicPromptError,
    isPublicPromptFetching,
    isPublicPromptFirstFetching,
    isPublicPromptLoading,
    loadPrivateMore,
    loadPrivatePrompts,
    loadPublicMore,
    loadPublicPrompts,
    privatePromptError,
    publicData,
    publicPromptError,
    privateData,
    viewMode
  ]);

  return {
    loadPrompts,
    loadMore,
    data,
    isPromptError,
    isMorePromptError,
    isPromptFirstFetching,
    isPromptFetching,
    isPromptLoading,
    promptError,
  };
}
