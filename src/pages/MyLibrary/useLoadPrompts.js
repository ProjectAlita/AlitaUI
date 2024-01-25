import {
  usePromptListQuery,
  usePublicPromptListQuery,
} from '@/api/prompts.js';
import { PromptStatus, ViewMode } from '@/common/constants';
import { useAuthorIdFromUrl, usePageQuery, useProjectId } from '@/pages/hooks';
import { useCallback } from 'react';

export const getQueryStatuses = (statuses) => statuses?.length && !statuses?.includes(PromptStatus.All) ? statuses.join(',') : undefined;

export const useLoadPrompts = (viewMode, selectedTagIds, sortBy, sortOrder, statuses) => {
  const { query, page, setPage, pageSize } = usePageQuery();
  const authorId = useAuthorIdFromUrl();
  const projectId = useProjectId();  
  const { 
    data: publicPromptData,
    error: publicPromptError,
    isError: isPublicPromptError,
    isLoading: isPublicPromptLoading,
    isFetching: isPublicPromptFetching,
  } = usePublicPromptListQuery({
    page,
    pageSize,
    params: {
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: getQueryStatuses(statuses),
      sort_by: sortBy,
      sort_order: sortOrder,
      query,
    }
  }, {skip: viewMode !== ViewMode.Public});

  const { 
    data: privatePromptData,
    error: privatePromptError,
    isError: isPrivatePromptError,
    isLoading: isPrivatePromptLoading,
    isFetching: isPrivatePromptFetching,
  } = usePromptListQuery({
    projectId,
    page,
    pageSize,
    params: {
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: getQueryStatuses(statuses),
      sort_by: sortBy,
      sort_order: sortOrder,
      query,
    }
  }, {skip: viewMode !== ViewMode.Owner || !projectId});

  const onLoadMorePublicPrompts = useCallback(() => {
    if (!isPublicPromptFetching && !isPrivatePromptFetching) {
      setPage(page + 1);
    }
  }, [isPrivatePromptFetching, isPublicPromptFetching, page, setPage]);

  return {
    loadMore: onLoadMorePublicPrompts,
    data: viewMode === ViewMode.Owner ? privatePromptData : publicPromptData,
    isPromptError: viewMode === ViewMode.Owner ? isPrivatePromptError : isPublicPromptError,
    isMorePromptError: viewMode === ViewMode.Owner ? (!!page && isPrivatePromptError) : (!!page && isPublicPromptError),
    isPromptFirstFetching: viewMode === ViewMode.Owner ? (!page && isPrivatePromptFetching) : (!page && isPublicPromptFetching),
    isPromptFetching: viewMode === ViewMode.Owner ? (!!page && isPrivatePromptFetching) : (!!page && isPublicPromptFetching),
    isPromptLoading: viewMode === ViewMode.Owner ? isPrivatePromptLoading : isPublicPromptLoading,
    promptError: viewMode === ViewMode.Owner ? privatePromptError : publicPromptError,
  };
}
