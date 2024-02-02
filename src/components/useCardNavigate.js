import { ContentType, MyLibraryTabs, PromptsTabs, SearchParams, ViewMode } from '@/common/constants';
import { useAuthorIdFromUrl, useAuthorNameFromUrl, useViewMode } from '@/pages/hooks';
import RouteDefinitions, { PathSessionMap } from '@/routes';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useSearchBar from './useSearchBar';

const buildReplaceNavOptions = (pagePath, locationState) => {
  const { routeStack } = locationState || {};
  const newRouteStack = [...(routeStack || [])];
  const stackLength = newRouteStack.length;
  newRouteStack.splice(stackLength - 1, 1, {
    ...newRouteStack[stackLength - 1],
    pagePath,
  });

  return {
    replace: true,
    state: {
      ...locationState,
      routeStack: newRouteStack
    },
  };
};

export const useSetUrlSearchParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const setUrlSearchParams = useCallback((params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    const newPagePath = location.pathname + '?' + newSearchParams.toString();
    setSearchParams(newSearchParams, buildReplaceNavOptions(newPagePath, location.state));
  }, [location.pathname, location.state, searchParams, setSearchParams])
  return setUrlSearchParams;
};
const useCardNavigate = ({ viewMode, id, type, name, collectionName, replace = false, anchor = '', }) => {
  const { state } = useLocation();
  const { collectionId } = useParams();
  const authorName = useAuthorNameFromUrl();
  const authorId = useAuthorIdFromUrl();
  const { tab = 'latest' } = useParams();
  const { routeStack = [] } = useMemo(() => (state || { routeStack: [] }), [state]);
  const navigate = useNavigate();
  const doNavigate = useCallback(() => {
    const query = `${anchor}?${SearchParams.ViewMode}=${viewMode}&${SearchParams.Name}=${encodeURIComponent(name)}${authorName ? `&${SearchParams.AuthorName}=${encodeURIComponent(authorName)}` : ''}${authorId ? `&${SearchParams.AuthorId}=${authorId}` : ''}`;
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
      [ContentType.ModerationSpaceCollection]:
        `${RouteDefinitions.ModerationSpace}/collections/${id}`,
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
      [ContentType.ModerationSpaceCollection]: query,
      [ContentType.UserPublicCollections]: query,
      [ContentType.UserPublicCollectionPrompts]:
        `${query}&${SearchParams.Collection}=${encodeURIComponent(collectionName)}`,
      [ContentType.UserPublicPrompts]: query,
    }
    const newRouteStack = [...routeStack];
    const pagePath = `${urlMap[type]}?${searchMap[type]}`
    if (replace) {
      newRouteStack.splice(routeStack.length - 1, 1, {
        breadCrumb: name,
        viewMode,
        pagePath: pagePath,
      })
    } else {
      newRouteStack.push({
        breadCrumb: name,
        viewMode,
        pagePath: pagePath,
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

const buildQueryParams = (params) => {
  let result = ''
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      const paramString = (result ? '&' : '') + `${key}=${value}`
      result += paramString;
    }
  }
  return result
};

export const useSearchPromptNavigate = () => {
  const { state } = useLocation();
  const { routeStack = [] } = useMemo(() => (state || { routeStack: [] }), [state]);

  const authorName = useAuthorNameFromUrl();
  const authorId = useAuthorIdFromUrl();
  const navigate = useNavigate();

  const {
    isPublicPromptPage,
    isPublicCollectionsPage,
    isMyLibraryPage,
    isUserPublicPage
  } = useSearchBar();
  const getPromptPath = useCallback(() => {
    const defaultPath = {
      basePathname: RouteDefinitions.Prompts + '/latest/',
      viewMode: ViewMode.Public
    };

    if (isPublicPromptPage || isPublicCollectionsPage) return defaultPath;

    if (isMyLibraryPage) return {
      basePathname: RouteDefinitions.MyLibrary + '/prompts/',
      viewMode: ViewMode.Owner
    }

    if (isUserPublicPage) return {
      basePathname: RouteDefinitions.UserPublic + '/prompts/',
      viewMode: ViewMode.Public
    }

    return defaultPath;
  }, [
    isPublicPromptPage,
    isPublicCollectionsPage,
    isMyLibraryPage,
    isUserPublicPage
  ]);
  const getCollectionPath = useCallback(() => {
    const defaultPath = {
      basePathname: RouteDefinitions.Collections + '/latest/',
      viewMode: ViewMode.Public
    };

    if (isPublicPromptPage || isPublicCollectionsPage) return defaultPath;

    if (isMyLibraryPage) return {
      basePathname: RouteDefinitions.MyLibrary + '/collections/',
      viewMode: ViewMode.Owner
    }

    if (isUserPublicPage) return {
      basePathname: RouteDefinitions.UserPublic + '/collections/',
      viewMode: ViewMode.Public
    }

    return defaultPath;
  }, [
    isPublicPromptPage,
    isPublicCollectionsPage,
    isMyLibraryPage,
    isUserPublicPage
  ]);

  const doNavigate = useCallback(({ viewMode, pathname, name, anchor = '' }) => {
    const params = {
      [SearchParams.ViewMode]: viewMode,
      [SearchParams.Name]: encodeURIComponent(name),
      [SearchParams.AuthorName]: authorName ? encodeURIComponent(authorName) : undefined,
      [SearchParams.AuthorId]: authorId
    }
    const search = buildQueryParams(params)
    const query = anchor + '?' + search;
    const pagePath = pathname + query
    const newRouteStack = [...routeStack, {
      breadCrumb: name,
      viewMode,
      pagePath: pagePath,
    }];

    navigate(
      {
        pathname,
        search,
      }, {
      replace: false,
      state: {
        routeStack: newRouteStack,
      },
    });
  }, [authorName, authorId, routeStack, navigate]);

  const doNavigatePrompt = useCallback(({ id, name, anchor }) => {
    const { basePathname, viewMode } = getPromptPath();
    const pathname = basePathname + id;
    doNavigate({
      viewMode,
      pathname,
      name,
      anchor
    });
  }, [getPromptPath, doNavigate]);


  const doNavigateCollection = useCallback(({ id, name, anchor = '' }) => {
    const { basePathname, viewMode } = getCollectionPath();
    const pathname = basePathname + id;
    doNavigate({
      viewMode,
      pathname,
      name,
      anchor
    });
  }, [getCollectionPath, doNavigate]);
  return {
    doNavigatePrompt,
    doNavigateCollection,
  };
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
