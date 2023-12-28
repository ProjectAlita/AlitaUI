import {
  usePublicPromptListQuery,
  usePromptListQuery,
} from '@/api/prompts.js';
import { ViewMode } from '@/common/constants';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuthorIdFromUrl, useProjectId } from '@/pages/hooks';

export const useLoadPrompts = (viewMode, selectedTagIds, sortBy, sortOrder, statuses) => {
  const [page, setPage] = useState(0);
  const { query } = useSelector(state => state.search);
  const authorId = useAuthorIdFromUrl();
  const projectId = useProjectId();  
  const { 
    data: publicPromptData,
    error: publicPromptError,
    isError: isPublicPromptError,
    isLoading: isPublicPromptLoading,
    isFetching: isPublicPromptFetching
  } = usePublicPromptListQuery({
    page,
    params: {
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: statuses.length ? statuses.join(',') : undefined,
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
    isFetching: isPrivatePromptFetching
  } = usePromptListQuery({
    projectId,
    page,
    params: {
      tags: selectedTagIds,
      author_id: viewMode === ViewMode.Public ? authorId : undefined,
      statuses: statuses.length ? statuses.join(',') : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
      query,
    }
  }, {skip: viewMode !== ViewMode.Owner || !projectId});

  const onLoadMorePublicPrompts = useCallback(() => {
    if (!isPublicPromptFetching && !isPrivatePromptFetching) {
      setPage(page + 1);
    }
  }, [isPrivatePromptFetching, isPublicPromptFetching, page]);

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
