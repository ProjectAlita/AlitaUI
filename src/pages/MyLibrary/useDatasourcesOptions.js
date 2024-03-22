
import { useDatasourceListQuery } from '@/api/datasources';
import { PAGE_SIZE, SortFields, SortOrderOptions } from '@/common/constants';
import { useProjectId } from '@/pages/hooks';
import { useCallback, useEffect, useState } from 'react';
import { getQueryStatuses } from './useLoadPrompts';

export const useDatasourcesOptions = (query) => {
  const [datasourcePage, setDatasourcePage] = useState(0);
  const pageSize = PAGE_SIZE;
  const projectId = useProjectId();  

  useEffect(() => {
    setDatasourcePage(0);
  }, [query]);

  const { 
    data,
    error,
    isError,
    isLoading,
    isFetching,
  } = useDatasourceListQuery({
    projectId,
    page: datasourcePage,
    pageSize,
    params: {
      tags: [],
      statuses: getQueryStatuses([]),
      sort_by: SortFields.CreatedAt,
      sort_order: SortOrderOptions.DESC,
      query,
    }
  }, {skip: !projectId});

  const onLoadMore = useCallback(() => {
    if (!isFetching) {
      setDatasourcePage(datasourcePage + 1);
    }
  }, [isFetching, datasourcePage]);

  return {
    onLoadMore,
    data,
    error,
    isError,
    isLoading,
    isFetching,
  };
}
