
import { ViewMode } from '@/common/constants';
import { useAuthorIdFromUrl, usePageQuery, useProjectId } from '@/pages/hooks';
import { useCallback, useState } from 'react';
import { getQueryStatuses } from './useLoadPrompts';
import { usePublicDataSourcesListQuery } from '@/api/datasources';
import { useApplicationListQuery } from '@/api/applications';

export const useLoadApplications = (viewMode, selectedTagIds, sortBy, sortOrder, statuses) => {
  const [applicationPage, setApplicationPage] = useState(0);
  const resetApplicationPage = useCallback(
    () => {
      setApplicationPage(0);
    },
    [],
  )
  const { query, pageSize } = usePageQuery(resetApplicationPage);
  const authorId = useAuthorIdFromUrl();
  const projectId = useProjectId();  
  const { 
    data: publicApplicationData,
    error: publicApplicationError,
    isError: isPublicApplicationError,
    isLoading: isPublicApplicationLoading,
    isFetching: isPublicApplicationFetching,
  } = usePublicDataSourcesListQuery({
    page: applicationPage,
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
    data: privateApplicationData,
    error: privateApplicationError,
    isError: isPrivateApplicationError,
    isLoading: isPrivateApplicationLoading,
    isFetching: isPrivateApplicationFetching,
  } = useApplicationListQuery({
    projectId,
    page: applicationPage,
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

  const onLoadMorePublicApplications = useCallback(() => {
    if (!isPublicApplicationFetching && !isPrivateApplicationFetching) {
      setApplicationPage(applicationPage + 1);
    }
  }, [isPrivateApplicationFetching, isPublicApplicationFetching, applicationPage]);

  return {
    onLoadMorePublicApplications,
    data: viewMode === ViewMode.Owner ? privateApplicationData : publicApplicationData,
    isApplicationsError: viewMode === ViewMode.Owner ? isPrivateApplicationError : isPublicApplicationError,
    isApplicationsFetching: viewMode === ViewMode.Owner ? (!!applicationPage && isPrivateApplicationFetching) : (!!applicationPage && isPublicApplicationFetching),
    isApplicationsLoading: viewMode === ViewMode.Owner ? isPrivateApplicationLoading : isPublicApplicationLoading,
    isMoreApplicationsError: viewMode === ViewMode.Owner ? (!!applicationPage && isPrivateApplicationError) : (!!applicationPage && isPublicApplicationError),
    isApplicationsFirstFetching: viewMode === ViewMode.Owner ? (!applicationPage && isPrivateApplicationFetching) : (!applicationPage && isPublicApplicationFetching),
    applicationsError: viewMode === ViewMode.Owner ? privateApplicationError : publicApplicationError,
  };
}
