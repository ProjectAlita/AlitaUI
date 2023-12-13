import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentType, SearchParams } from '@/common/constants';
import { useFromMyLibrary } from '@/pages/hooks';

const useCardNavigate = ({ url, viewMode, id, type, name, replace = false }) => {
  const { pathname, search, state } = useLocation();
  const { from = [], previousState } = useMemo(() => (state || {}), [state]);
  const isFromMyLibrary = useFromMyLibrary();
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const urlMap = {
      [ContentType.Collections]: isFromMyLibrary ? `/my-library/collections/${id}?${SearchParams.ViewMode}=${viewMode}` :  `/collections/${id}`,
      [ContentType.Datasources]: `/datasource/${id}?${SearchParams.ViewMode}=${viewMode}`,
      [ContentType.Prompts]: isFromMyLibrary ? `/my-library/prompts/${id}?${SearchParams.ViewMode}=${viewMode}` : `/prompts/${id}`,
    }
    navigate(url || urlMap[type], {
      replace,
      state: {
        from: replace ? from : [...from, pathname + search],
        breadCrumb: name,
        viewMode,
        previousState: replace ? previousState : state,
      },
    });
  }, [
    id, 
    isFromMyLibrary, 
    viewMode, 
    navigate, 
    url, 
    type, 
    replace, 
    from, 
    pathname, 
    search, 
    name, 
    previousState, 
    state]);
  return doNavigate;
}

export default useCardNavigate;
