
import { useDatasourceListQuery, usePublicDataSourcesListQuery } from '@/api/datasources';
import { ViewMode } from '@/common/constants';
import { useAuthorIdFromUrl, usePageQuery, useProjectId } from '@/pages/hooks';
import { useCallback, useState } from 'react';
import { getQueryStatuses } from './useLoadPrompts';

export const useLoadDatasources = (viewMode, selectedTagIds, sortBy, sortOrder, statuses) => {
  const [datasourcePage, setDatasourcePage] = useState(0);
  const resetDatasourcePage = useCallback(
    () => {
      setDatasourcePage(0);
    },
    [],
  )
  const { query, pageSize } = usePageQuery(resetDatasourcePage);
  const authorId = useAuthorIdFromUrl();
  const projectId = useProjectId();  
  const { 
    data: publicDatasourceData,
    error: publicDatasourceError,
    isError: isPublicDatasourceError,
    isLoading: isPublicDatasourceLoading,
    isFetching: isPublicDatasourceFetching,
  } = usePublicDataSourcesListQuery({
    page: datasourcePage,
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
    data: privateDatasourceData,
    error: privateDatasourceError,
    isError: isPrivateDatasourceError,
    isLoading: isPrivateDatasourceLoading,
    isFetching: isPrivateDatasourceFetching,
  } = useDatasourceListQuery({
    projectId,
    page: datasourcePage,
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

  const onLoadMorePublicDatasources = useCallback(() => {
    if (!isPublicDatasourceFetching && !isPrivateDatasourceFetching) {
      setDatasourcePage(datasourcePage + 1);
    }
  }, [isPrivateDatasourceFetching, isPublicDatasourceFetching, datasourcePage]);

  return {
    onLoadMorePublicDatasources,
    data: viewMode === ViewMode.Owner ? privateDatasourceData : publicDatasourceData,
    isDatasourcesError: viewMode === ViewMode.Owner ? isPrivateDatasourceError : isPublicDatasourceError,
    isDatasourcesFetching: viewMode === ViewMode.Owner ? (!!datasourcePage && isPrivateDatasourceFetching) : (!!datasourcePage && isPublicDatasourceFetching),
    isDatasourcesLoading: viewMode === ViewMode.Owner ? isPrivateDatasourceLoading : isPublicDatasourceLoading,
    isMoreDatasourcesError: viewMode === ViewMode.Owner ? (!!datasourcePage && isPrivateDatasourceError) : (!!datasourcePage && isPublicDatasourceError),
    isDatasourcesFirstFetching: viewMode === ViewMode.Owner ? (!datasourcePage && isPrivateDatasourceFetching) : (!datasourcePage && isPublicDatasourceFetching),
    datasourcesError: viewMode === ViewMode.Owner ? privateDatasourceError : publicDatasourceError,
  };
}
