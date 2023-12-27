import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ContentType, PUBLIC_PROJECT_ID, SearchParams, ViewMode } from '@/common/constants';
import RouteDefinitions from '@/routes';

const useCardNavigate = ({ viewMode, id, ownerId, type, name, collectionName, replace = false, anchor = '',  }) => {
  const { state } = useLocation();
  const { collectionId } = useParams();
  const { routeStack = [] } = useMemo(() => (state || { routeStack: [] }), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const query = `${anchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}`;
    const collectionPromptPath = (String(ownerId) === String(PUBLIC_PROJECT_ID)) ? 
      `${RouteDefinitions.Prompts}/latest/${id}${anchor}?${SearchParams.Name}=${name}&${SearchParams.ViewMode}=${ViewMode.Public}` : 
      `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${id}${query}&${SearchParams.Collection}=${collectionName}`;

    const urlMap = {
      [ContentType.MyLibraryCollections]:
        `${RouteDefinitions.MyLibrary}/collections/${id}${query}`,
      [ContentType.MyLibraryCollectionsEdit]:
        `${RouteDefinitions.MyLibrary}/collections/edit/${id}`,
      [ContentType.MyLibraryCollectionPrompts]:
        collectionPromptPath,
      [ContentType.MyLibraryDatasources]:
        `${RouteDefinitions.MyLibrary}/datasources/${id}${query}`,
      [ContentType.MyLibraryPrompts]: 
        `${RouteDefinitions.MyLibrary}/prompts/${id}${query}`,
      [ContentType.CollectionsTop]:
        `${RouteDefinitions.Collections}/top/${id}${query}`,
      [ContentType.CollectionsLatest]:
        `${RouteDefinitions.Collections}/latest/${id}${query}`,
      [ContentType.CollectionsMyLiked]:
        `${RouteDefinitions.Collections}/my-liked/${id}${query}`,
      [ContentType.DatasourcesTop]:
        `${RouteDefinitions.DataSources}/top/${id}${query}`,
      [ContentType.DatasourcesLatest]:
        `${RouteDefinitions.DataSources}/latest/${id}${query}`,
      [ContentType.DatasourcesMyLiked]:
        `${RouteDefinitions.DataSources}/my-liked/${id}${query}`,
      [ContentType.PromptsTop]:
        `${RouteDefinitions.Prompts}/top/${id}${query}`,
      [ContentType.PromptsLatest]: 
        `${RouteDefinitions.Prompts}/latest/${id}${query}`,
      [ContentType.PromptsMyLiked]:
        `${RouteDefinitions.Prompts}/my-liked/${id}${query}`,
      [ContentType.ModerationSpacePrompt]:
        `${RouteDefinitions.ModerationSpace}/prompts/${id}${query}`,
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
  }, [id, anchor, viewMode, name, ownerId, collectionId, collectionName, routeStack, replace, navigate, type]);
  return doNavigate;
}

export default useCardNavigate;
