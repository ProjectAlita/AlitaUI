import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentType } from '@/common/constants';

const useCardNavigate = ({ url, viewMode, id, type, name, replace = false }) => {
  const { pathname, search, state } = useLocation();
  const { from = [], previousState } = useMemo(() => (state || {}), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const urlMap = {
      [ContentType.Collections]: `/collection/${id}`,
      [ContentType.Datasources]: `/datasource/${id}`,
      [ContentType.Prompts]: `/prompt/${id}`,
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
  }, [id, replace, from, pathname, search, name, viewMode, state, navigate, url, type, previousState]);
  return doNavigate;
}

export default useCardNavigate;
