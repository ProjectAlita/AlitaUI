import { useLazyTrendingAuthorsDetailsQuery } from '@/api/trendingAuthor';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAuthorIdFromUrl, useViewModeFromUrl } from '@/pages/hooks';
import { ViewMode } from '@/common/constants';

const useQueryTrendingAuthor = () => {
  const viewMode = useViewModeFromUrl();
  const authorId = useAuthorIdFromUrl();
  const { id: userId } = useSelector((state) => state.user);
  const [getAuthorDetail, { isLoading: isLoadingAuthor }] = useLazyTrendingAuthorsDetailsQuery();

  useEffect(() => {
    if (viewMode === ViewMode.Public) {
      if (authorId !== null && authorId !== undefined) {
        getAuthorDetail(authorId);
      }
    } else {
      if (userId !== null && userId !== undefined) {
        getAuthorDetail(userId);
      }
    }
  }, [authorId, getAuthorDetail, userId, viewMode]);

  return {
    isLoadingAuthor
  }
}

export default useQueryTrendingAuthor;