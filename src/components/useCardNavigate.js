import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ContentType, SearchParams } from '@/common/constants';
import RouteDefinitions from '@/routes';

const useCardNavigate = ({ hashAnchor = '', viewMode, id, type, name, collectionName, replace = false }) => {
  const { state } = useLocation();
  const { collectionId } = useParams();
  const { routeStack = [] } = useMemo(() => (state || { routeStack: [] }), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const urlMap = {
      [ContentType.MyLibraryCollections]:
        `${RouteDefinitions.MyLibrary}/collections/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`,
      [ContentType.MyLibraryCollectionPrompts]:
        `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${id}${hashAnchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}&${SearchParams.Collection}=${collectionName}`,
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
    const newRouteStack = [...routeStack];
    if (replace) {
      newRouteStack.splice(routeStack.length - 1, 1, {
        breadCrumb: name,
        viewMode,
        pagePath: urlMap[type],
      })
    } else {
      newRouteStack.push({
        breadCrumb: name,
        viewMode,
        pagePath: urlMap[type],     
      })
    }
    navigate(urlMap[type], {
      replace,
      state: {
        routeStack: newRouteStack,
      },
    });
  }, [id, hashAnchor, viewMode, name, collectionId, collectionName, routeStack, replace, navigate, type]);
  return doNavigate;
}

export default useCardNavigate;
