import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentType, SearchParams } from '@/common/constants';
import RouteDefinitions from '@/routes';

const useCardNavigate = ({ hashAnchor = '', viewMode, id, type, name, replace = false }) => {
  const { pathname, search, state } = useLocation();
  const { from = [], previousState } = useMemo(() => (state || {}), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const urlMap = {
      [ContentType.MyLibraryCollections]:
        `${RouteDefinitions.MyLibrary}/collections/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.MyLibraryDatasources]:
        `${RouteDefinitions.MyLibrary}/datasources/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}?${SearchParams.Name}=${name}`,
      [ContentType.MyLibraryPrompts]:
        `${RouteDefinitions.MyLibrary}/prompts/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.CollectionsTop]:
        `${RouteDefinitions.Collections}/top/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.CollectionsLatest]:
        `${RouteDefinitions.Collections}/latest/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.CollectionsMyLiked]:
        `${RouteDefinitions.Collections}/my-liked/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.DatasourcesTop]:
        `${RouteDefinitions.DataSources}/top/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}?${SearchParams.Name}=${name}`,
      [ContentType.DatasourcesLatest]:
        `${RouteDefinitions.DataSources}/latest/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}?${SearchParams.Name}=${name}`,
      [ContentType.DatasourcesMyLiked]:
        `${RouteDefinitions.DataSources}/my-liked/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}?${SearchParams.Name}=${name}`,
      [ContentType.PromptsTop]:
        `${RouteDefinitions.Prompts}/top/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.PromptsLatest]:
        `${RouteDefinitions.Prompts}/latest/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.PromptsMyLiked]:
        `${RouteDefinitions.Prompts}/my-liked/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
    }
    navigate(urlMap[type], {
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
    viewMode,
    navigate,
    hashAnchor,
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
