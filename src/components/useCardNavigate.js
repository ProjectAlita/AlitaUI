import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ContentType, SearchParams, MyLibraryTabs, ViewMode, PromptsTabs } from '@/common/constants';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useViewMode, useAuthorNameFromUrl, useAuthorIdFromUrl } from '@/pages/hooks';

const useCardNavigate = ({ viewMode, id, type, name, collectionName, replace = false, anchor = '', }) => {
  const { state } = useLocation();
  const { collectionId } = useParams();
  const authorName = useAuthorNameFromUrl();
  const authorId = useAuthorIdFromUrl();
  const { tab = 'latest' } = useParams();
  const { routeStack = [] } = useMemo(() => (state || { routeStack: [] }), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const query = `${anchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${name}${authorName ? `&${SearchParams.AuthorName}=${authorName}` : ''}${authorName ? `&${SearchParams.AuthorId}=${authorId}` : ''}`;
    const urlMap = {
      [ContentType.MyLibraryCollections]:
        `${RouteDefinitions.MyLibrary}/collections/${id}${query}`,
      [ContentType.MyLibraryCollectionsEdit]:
        `${RouteDefinitions.MyLibrary}/collections/edit/${id}`,
      [ContentType.MyLibraryCollectionPrompts]:
        `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${id}${query}&${SearchParams.Collection}=${collectionName}`,
      [ContentType.CollectionPrompts]:
        `${RouteDefinitions.Collections}/${tab}/${collectionId}/prompts/${id}${query}&${SearchParams.Collection}=${collectionName}`,
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
      [ContentType.UserPublicCollections]:
        `${RouteDefinitions.UserPublic}/collections/${id}${query}`,
      [ContentType.UserPublicCollectionPrompts]:
        `${RouteDefinitions.UserPublic}/collections/${collectionId}/prompts/${id}${query}&${SearchParams.Collection}=${collectionName}`,
      [ContentType.UserPublicPrompts]:
        `${RouteDefinitions.UserPublic}/prompts/${id}${query}`,
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
  }, [
    id,
    anchor,
    tab,
    viewMode,
    name,
    collectionId,
    collectionName,
    routeStack,
    replace,
    navigate,
    type,
    authorName,
    authorId]);
  return doNavigate;
}

export const useNavigateToAuthorPublicPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { tab = -1 } = useParams();
  const viewMode = useViewMode();
  const { id: userId } = useSelector(state => state.user);

  const navigateToAuthorPublicPage = useCallback((authorId, authorName) => () => {
    const searchString = `${SearchParams.ViewMode}=${ViewMode.Public}`;
    const authorString = `&${SearchParams.AuthorId}=${authorId}`;
    const newPath = `${RouteDefinitions.UserPublic}/${MyLibraryTabs.find(item => item === tab) ? tab : MyLibraryTabs[0]}`;
    const pagePath = `${newPath}?${searchString}&statuses=all${authorString}&${SearchParams.AuthorName}=${authorName}`;
    if (pathname !== newPath || viewMode === ViewMode.Owner) {
      navigate(pagePath, {
        state: {
          routeStack: [
            {
              breadCrumb: userId !== authorId ? PathSessionMap[RouteDefinitions.Prompts] : PathSessionMap[RouteDefinitions.MyLibrary],
              pagePath: userId !== authorId ? `${RouteDefinitions.Prompts}/${PromptsTabs[1]}` : `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[0]}?${SearchParams.ViewMode}=${ViewMode.Owner}`,
            },
            {
              breadCrumb: authorName,
              pagePath,
            }]
        }
      });
    }
  }, [navigate, pathname, tab, userId, viewMode]);

  return { navigateToAuthorPublicPage };
}

export default useCardNavigate;
