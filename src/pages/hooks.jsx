import { 
  PROMPT_PAYLOAD_KEY, 
  PUBLIC_PROJECT_ID, 
  SearchParams, 
  ViewMode, 
  VariableSources 
} from '@/common/constants.js';
import { contextResolver, listMapper } from '@/common/utils';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import RouteDefinitions from '@/routes';

export const usePageQuery = () => {
  const [page, setPage] = useState(0);
  const { query } = useSelector(state => state.search);
  const [localQuery, setLocalQuery] = useState('');

  useEffect(() => {
    setLocalQuery(query);
    setPage(0);
  }, [query]);

  return { query: localQuery, page, setPage }
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

export const useCollectionFromUrl = () => {
  const [searchParams] = useSearchParams();
  const collection = useMemo(() => searchParams.get(SearchParams.Collection), [searchParams]);
  return collection;
}

export const useStatusesFromUrl = () => {
  const [searchParams] = useSearchParams();
  const statuses = useMemo(() => searchParams.get(SearchParams.Statuses), [searchParams]);
  return statuses;
}

export const useViewMode = () => {
  const [searchParams] = useSearchParams();
  const viewModeFromUrl = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams]);
  const { state } = useLocation();
  const isFromMyLibrary = useFromMyLibrary();
  const { viewMode: viewModeFromState } = state ?? {};
  return viewModeFromUrl || viewModeFromState || (isFromMyLibrary ? ViewMode.Owner : ViewMode.Public);
}

export const useProjectId = () => {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const isFromMyLibrary = useFromMyLibrary();
  const viewMode = useViewMode();
  const projectId = useMemo(() => {
    if (isFromMyLibrary && viewMode === ViewMode.Owner) {
      return privateProjectId;
    } else {
      return PUBLIC_PROJECT_ID;
    }
  }, [isFromMyLibrary, privateProjectId, viewMode]);

  return projectId;
}

export const useCollectionProjectId = () => {
  const viewMode = useViewMode();
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  return viewMode === ViewMode.Owner ? privateProjectId : PUBLIC_PROJECT_ID;
}

export const useFromMyLibrary = () => {
  const { pathname } = useLocation();
  const isFromMyLibrary = useMemo(() => {
    return pathname.startsWith(RouteDefinitions.MyLibrary);
  }, [pathname]);
  return isFromMyLibrary;
}

export const useOnMyLibrary = () => {
  const { pathname } = useLocation();
  const isOnMyLibrary = useMemo(() => pathname.startsWith(RouteDefinitions.MyLibrary), [pathname]);
  return isOnMyLibrary;
}

export const useOnPrompts = () => {
  const { pathname } = useLocation();
  const isOnPrompts = useMemo(() => pathname.startsWith(RouteDefinitions.Prompts), [pathname]);
  return isOnPrompts;
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
    dispatch(
      promptSliceActions.updateCurrentPromptData({
        key: payloadkey,
        data:
          payloadkey === PROMPT_PAYLOAD_KEY.tags
            ? inputValue.split(',')
            : inputValue,
      })
    );
  };

  return [updateCurrentPrompt];
};
