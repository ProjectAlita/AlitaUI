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
    const query = `${anchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURI(name)}${authorName ? `&${SearchParams.AuthorName}=${encodeURIComponent(authorName)}` : ''}${authorId ? `&${SearchParams.AuthorId}=${authorId}` : ''}`;
    const urlMap = {
      [ContentType.MyLibraryCollections]:
        `${RouteDefinitions.MyLibrary}/collections/${id}`,
      [ContentType.MyLibraryCollectionsEdit]:
        `${RouteDefinitions.MyLibrary}/collections/edit/${id}`,
      [ContentType.MyLibraryCollectionPrompts]:
        `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${id}`,
      [ContentType.CollectionPrompts]:
        `${RouteDefinitions.Collections}/${tab}/${collectionId}/prompts/${id}`,
      [ContentType.MyLibraryDatasources]:
        `${RouteDefinitions.MyLibrary}/datasources/${id}`,
      [ContentType.MyLibraryPrompts]:
        `${RouteDefinitions.MyLibrary}/prompts/${id}`,
      [ContentType.CollectionsTop]:
        `${RouteDefinitions.Collections}/top/${id}`,
      [ContentType.CollectionsLatest]:
        `${RouteDefinitions.Collections}/latest/${id}`,
      [ContentType.CollectionsMyLiked]:
        `${RouteDefinitions.Collections}/my-liked/${id}`,
      [ContentType.DatasourcesTop]:
        `${RouteDefinitions.DataSources}/top/${id}`,
      [ContentType.DatasourcesLatest]:
        `${RouteDefinitions.DataSources}/latest/${id}`,
      [ContentType.DatasourcesMyLiked]:
        `${RouteDefinitions.DataSources}/my-liked/${id}`,
      [ContentType.PromptsTop]:
        `${RouteDefinitions.Prompts}/top/${id}`,
      [ContentType.PromptsLatest]:
        `${RouteDefinitions.Prompts}/latest/${id}`,
      [ContentType.PromptsMyLiked]:
        `${RouteDefinitions.Prompts}/my-liked/${id}`,
      [ContentType.ModerationSpacePrompt]:
        `${RouteDefinitions.ModerationSpace}/prompts/${id}`,
      [ContentType.UserPublicCollections]:
        `${RouteDefinitions.UserPublic}/collections/${id}`,
      [ContentType.UserPublicCollectionPrompts]:
        `${RouteDefinitions.UserPublic}/collections/${collectionId}/prompts/${id}`,
      [ContentType.UserPublicPrompts]:
        `${RouteDefinitions.UserPublic}/prompts/${id}`,
    }
    const searchMap = {
      [ContentType.MyLibraryCollections]: query,
      [ContentType.MyLibraryCollectionsEdit]: '',
      [ContentType.MyLibraryCollectionPrompts]:
        `${query}&${SearchParams.Collection}=${encodeURIComponent(collectionName)}`,
      [ContentType.CollectionPrompts]:
        `${query}&${SearchParams.Collection}=${encodeURIComponent(collectionName)}`,
      [ContentType.MyLibraryDatasources]: query,
      [ContentType.MyLibraryPrompts]: query,
      [ContentType.CollectionsTop]: query,
      [ContentType.CollectionsLatest]: query,
      [ContentType.CollectionsMyLiked]: query,
      [ContentType.DatasourcesTop]: query,
      [ContentType.DatasourcesLatest]: query,
      [ContentType.DatasourcesMyLiked]: query,
      [ContentType.PromptsTop]: query,
      [ContentType.PromptsLatest]: query,
      [ContentType.PromptsMyLiked]: query,
      [ContentType.ModerationSpacePrompt]: query,
      [ContentType.UserPublicCollections]: query,
      [ContentType.UserPublicCollectionPrompts]:
        `${query}&${SearchParams.Collection}=${encodeURIComponent(collectionName)}`,
      [ContentType.UserPublicPrompts]: query,
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
    navigate(
      {
        pathname: urlMap[type],
        search: searchMap[type]
      }, {
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
              pagePath: userId !== authorId ? `${RouteDefinitions.Prompts}/${PromptsTabs[0]}` : `${RouteDefinitions.MyLibrary}/${MyLibraryTabs[0]}?${SearchParams.ViewMode}=${ViewMode.Owner}`,
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
