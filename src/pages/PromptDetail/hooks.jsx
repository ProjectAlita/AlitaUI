import { PROMPT_PAYLOAD_KEY, SOURCE_PROJECT_ID, ViewMode } from '@/common/constants.js';
import { contextResolver, listMapper } from '@/common/utils';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import RouteDefinitions from '@/routes';

export const useProjectId = () => {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);
  const { state: { from, viewMode } } = useLocation();
  const projectId = useMemo(() => {
    if (viewMode) {
      return from === RouteDefinitions.MyLibrary && viewMode === ViewMode.Owner ?
      privateProjectId : SOURCE_PROJECT_ID;
    } else {
      return from === RouteDefinitions.MyLibrary ? privateProjectId : SOURCE_PROJECT_ID;
    }
  }, [from, privateProjectId, viewMode]);

  return projectId;
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
