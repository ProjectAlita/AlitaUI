import {
  MIN_LARGE_WINDOW_WIDTH,
  PROMPT_PAYLOAD_KEY,
  PUBLIC_PROJECT_ID,
  PromptStatus,
  SearchParams,
  VariableSources,
  ViewMode
} from '@/common/constants.js';
import { contextResolver, listMapper } from '@/common/utils';
import RouteDefinitions from '@/routes';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import { apis as collectionApi } from '@/api/collections';
import { promptApi } from '@/api/prompts';
import { actions as promptSliceActions } from '@/slices/prompts';
import { actions as searchActions } from '@/slices/search';
import { actions as settingsActions } from '@/slices/settings';

export const usePageQuery = (resetPage) => {
  const [page, setPage] = useState(0);
  const pageSize = useSelector(state => state.settings.pageSize);
  const { query } = useSelector(state => state.search);
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
    setPage(0);
    if (resetPage) {
      resetPage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    setPage(0);
    if (resetPage) {
      resetPage();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, setPage]);

  return { query: localQuery, page, setPage, pageSize }
}

export const useAuthorNameFromUrl = () => {
  const [searchParams] = useSearchParams();
  const author = useMemo(() => searchParams.get(SearchParams.AuthorName), [searchParams]);
  return author;
}

export const useAuthorIdFromUrl = () => {
  const [searchParams] = useSearchParams();
  const author = useMemo(() => searchParams.get(SearchParams.AuthorId), [searchParams]);
  return author;
}

export const useIsFromCollections = () => {
  const { pathname } = useLocation();
  const isFromUserPublic = useMemo(() => pathname.startsWith(RouteDefinitions.Collections), [pathname]);
  return isFromUserPublic;
}

export const useIsFromUserPublic = () => {
  const { pathname } = useLocation();
  const isFromUserPublic = useMemo(() => pathname.startsWith(RouteDefinitions.UserPublic), [pathname]);
  return isFromUserPublic;
}

export const useIsFromModeration = () => {
  const { pathname } = useLocation();
  const isFromModeration = useMemo(() => pathname.startsWith(RouteDefinitions.ModerationSpace), [pathname]);
  return isFromModeration;
}

export const useViewModeFromUrl = (isCreating = false) => {
  const [searchParams] = useSearchParams();
  const viewMode = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams]);
  return viewMode || (isCreating ? ViewMode.Owner : ViewMode.Public);
}

export const useNameFromUrl = () => {
  const [searchParams] = useSearchParams();
  const name = useMemo(() => searchParams.get(SearchParams.Name), [searchParams]);
  return name;
}

export const useDeploymentConfigNameFromUrl = () => {
  const [searchParams] = useSearchParams();
  const name = useMemo(() => searchParams.get(SearchParams.DeploymentConfigName), [searchParams]);
  return name;
}

export const useDeploymentNameFromUrl = () => {
  const [searchParams] = useSearchParams();
  const name = useMemo(() => searchParams.get(SearchParams.DeploymentName), [searchParams]);
  return name;
}

export const useCollectionFromUrl = () => {
  const [searchParams] = useSearchParams();
  const collection = useMemo(() => searchParams.get(SearchParams.Collection), [searchParams]);
  return collection;
}

export const useStatusesFromUrl = () => {
  const [searchParams] = useSearchParams();
  const statuses = useMemo(() => {
    const statusesFromUrl = searchParams.get(SearchParams.Statuses) || '';
    if (statusesFromUrl.includes(PromptStatus.All)) {
      return undefined
    }
    return statusesFromUrl.split(',');
  }, [searchParams]);
  return statuses;
}

export const useSelectedProjectName = () => {
  const { personal_project_id } = useSelector(state => state.user);
  const { project } = useSelector(state => state.settings);
  const stateProjectName = useMemo(() => project?.name, [project?.name]);
  const selectedProjectName = useMemo(() => stateProjectName || (personal_project_id ? 'Private' : ''),
    [personal_project_id, stateProjectName]);
  return selectedProjectName
}

export const useSelectedProjectId = () => {
  const { personal_project_id } = useSelector(state => state.user);
  const { project } = useSelector(state => state.settings);
  const stateProjectId = useMemo(() => project?.id, [project?.id]);
  const selectedProjectId = useMemo(() => stateProjectId || personal_project_id,
    [stateProjectId, personal_project_id]);
  return selectedProjectId
}

export const useSelectedProject = () => {
  const { personal_project_id } = useSelector(state => state.user);
  const { project } = useSelector(state => state.settings);
  const selectedProject = useMemo(() => project?.id ? project : {id: personal_project_id, name: 'Private'},
    [project, personal_project_id]);
  return selectedProject
}

export const useViewMode = () => {
  const [searchParams] = useSearchParams();
  const viewModeFromUrl = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams]);
  const { state } = useLocation();
  const isFromMyLibrary = useFromMyLibrary();
  const { viewMode: viewModeFromState } = state ?? {};
  return viewModeFromUrl || viewModeFromState || (isFromMyLibrary ? ViewMode.Owner : ViewMode.Public);
}

export const useDataViewMode = (
  pageViewMode,
  { owner_id: ownerId }
) => {
  const selectedProjectId = useSelectedProjectId();

  const dataViewMode = useMemo(() => {
    if (pageViewMode === ViewMode.Owner) {
      return ownerId === selectedProjectId ? pageViewMode : ViewMode.Public;
    }
    return pageViewMode
  }, [ownerId, pageViewMode, selectedProjectId]);

  return dataViewMode;
}

export const useProjectId = () => {
  const isFromMyLibrary = useFromMyLibrary();
  const isFromSettings = useIsFromSettings();
  const viewMode = useViewMode();
  const selectedProjectId = useSelectedProjectId();
  const projectId = useMemo(() => {
    if (isFromMyLibrary && viewMode === ViewMode.Owner) {
      return selectedProjectId;
    } else if (isFromSettings) {
      return selectedProjectId;
    } else {
      return PUBLIC_PROJECT_ID;
    }
  }, [isFromMyLibrary, isFromSettings, selectedProjectId, viewMode]);

  return projectId;
}

export const useIsFromSettings = () => {
  const { pathname } = useLocation();
  const isFromSettings = useMemo(() => {
    return pathname.startsWith(RouteDefinitions.Settings);
  }, [pathname]);
  return isFromSettings;
}

export const useFromMyLibrary = () => {
  const { pathname } = useLocation();
  const isFromMyLibrary = useMemo(() => {
    return pathname.startsWith(RouteDefinitions.MyLibrary);
  }, [pathname]);
  return isFromMyLibrary;
}

export const useFromPrompts = () => {
  const { state, pathname } = useLocation();
  const { routeStack = [] } = state ?? {};
  const isFromPrompts = useMemo(() => {
    return !!(routeStack.length && `/${routeStack[0]['breadCrumb']}`.toLowerCase() === RouteDefinitions.Prompts) ||
      pathname.startsWith(RouteDefinitions.Prompts) ||
      pathname.startsWith(RouteDefinitions.UserPublic);
  }, [pathname, routeStack]);
  return isFromPrompts;
}

export const useGetAllMessageContent = (currentPrompt) => {
  const messages = useMemo(() => currentPrompt?.messages || [], [currentPrompt?.messages]);
  const messageContent = useMemo(() => messages.reduce((accumulator, item) => {
    return accumulator + item.content;
  }, ''), [messages]);
  return messageContent;
}

export const useUpdateVariableList = (source) => {
  const dispatch = useDispatch();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const messageContent = useGetAllMessageContent(currentPrompt);
  const context = useSelector(state => state.prompts.currentPrompt?.prompt || '');
  const previousVariableList = currentPrompt[PROMPT_PAYLOAD_KEY.variables]
  const previousVariableListMap = listMapper(previousVariableList, PROMPT_PAYLOAD_KEY.variables)
  const updateVariableList = (inputValue = '') => {
    const allContent = source === VariableSources.Context ?
      inputValue + messageContent :
      context + inputValue;
    const resolvedInputValue = contextResolver(allContent);
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.variables,
        data: resolvedInputValue.map((variable) => {
          return {
            key: variable,
            value: previousVariableListMap[variable]?.value || '',
            id: previousVariableListMap[variable]?.id || undefined,
          };
        }),
      })
    );
  };

  return [updateVariableList];
};

export const useUpdateCurrentPrompt = () => {
  const dispatch = useDispatch();
  const updateCurrentPrompt = (payloadkey, inputValue = '') => {
    let data
    switch (payloadkey) {
      case PROMPT_PAYLOAD_KEY.tags:
        data = inputValue.split(',');
        break;
      case PROMPT_PAYLOAD_KEY.maxTokens: {
        try {
          data = parseInt(inputValue);
        } catch (err) {
          data = inputValue;
        }
        break;
      }
      default:
        data = inputValue;
    }
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: payloadkey,
        data,
      })
    );
  };

  return [updateCurrentPrompt];
};

export const useNavBlocker = (options) => {
  const dispatch = useDispatch();
  const {
    isBlockNav,
    isResetApiState,
  } = useSelector(state => state.settings.navBlocker);

  const resetApiState = useCallback(() => {
    dispatch(collectionApi.util.resetApiState());
    dispatch(promptApi.util.resetApiState());
    dispatch(searchActions.resetQuery())
  }, [dispatch]);

  const setBlockNav = useCallback((value) => {
    dispatch(settingsActions.setBlockNav(value));
  }, [dispatch]);
  const setIsResetApiState = useCallback((value) => {
    dispatch(settingsActions.setIsResetApiState(value));
  }, [dispatch]);

  useEffect(() => {
    if (options) {
      setBlockNav(options?.blockCondition);
    }
  }, [options, setBlockNav]);

  useEffect(() => {
    return () => {
      setBlockNav(false);
    }
  }, [setBlockNav]);

  return {
    isBlockNav,
    isResetApiState,
    setBlockNav,
    setIsResetApiState,
    resetApiState,
  };
}

export const useHasPromptChange = () => {
  const { currentPrompt, currentPromptSnapshot } = useSelector((state) => state.prompts);
  const hasCurrentPromptBeenChanged = useMemo(() => {
    try {
      return JSON.stringify(currentPrompt) !== JSON.stringify(currentPromptSnapshot);
    } catch (e) {
      return true;
    }
  }, [currentPrompt, currentPromptSnapshot]);

  return hasCurrentPromptBeenChanged;
}

export const useIsSmallWindow = () => {
  const [isSmallWindow, setIsSmallWindow] = useState(false);

  const onSize = useCallback(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth < MIN_LARGE_WINDOW_WIDTH) {
      setIsSmallWindow(true);
    } else {
      setIsSmallWindow(false);
    }
  }, []);

  useEffect(() => {
    onSize();
    window.addEventListener("resize", onSize);
    return () => {
      window.removeEventListener("resize", onSize);
    };
  }, [onSize]);

  return { isSmallWindow };
}