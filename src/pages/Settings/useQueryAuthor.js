import { useLazyTrendingAuthorsDetailsQuery } from '@/api/trendingAuthor';
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const useQueryAuthor = () => {
  const { id: userId } = useSelector((state) => state.user);
  const [getAuthorDetail, { isFetching }] = useLazyTrendingAuthorsDetailsQuery();

  const refetch = useCallback(
    () => {
      if (userId !== null && userId !== undefined) {
        getAuthorDetail(userId);
      }
    },
    [getAuthorDetail, userId],
  )
  

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    isFetching,
    refetch,
  }
}

export default useQueryAuthor;