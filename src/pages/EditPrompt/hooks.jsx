import { PROMPT_PAYLOAD_KEY, PUBLIC_PROJECT_ID, SearchParams, ViewMode } from '@/common/constants.js';
import { contextResolver, listMapper } from '@/common/utils';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import RouteDefinitions from '@/routes';

export const useViewModeFromUrl = () => {
  const [searchParams] = useSearchParams();
  const viewMode = useMemo(() => searchParams.get(SearchParams.ViewMode), [searchParams]);
  return viewMode;
}

export const useViewMode = () => {
  const viewModeFromUrl = useViewModeFromUrl();
  const { state } = useLocation();
  const { viewMode: viewModeFromState } = state ?? {};
  return viewModeFromUrl || viewModeFromState;
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
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  return privateProjectId;
}

export const useFromMyLibrary = () => {
  const { state, pathname } = useLocation();
  const { from } = state ?? {};
  const isFromMyLibrary = useMemo(() => {
    return !!(from && from[0]?.includes(RouteDefinitions.MyLibrary)) || pathname.includes(RouteDefinitions.MyLibrary);
  }, [from, pathname]);
  return isFromMyLibrary;
}

export const useUpdateVariableList = () => {
  const dispatch = useDispatch();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const previousVariableList = currentPrompt[PROMPT_PAYLOAD_KEY.variables]
  const previousVariableListMap = listMapper(previousVariableList, PROMPT_PAYLOAD_KEY.variables)
  const updateVariableList = (inputValue = '') => {
    const resolvedInputValue = contextResolver(inputValue);
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
