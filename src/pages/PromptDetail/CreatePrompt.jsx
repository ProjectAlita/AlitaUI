import { useCreatePromptMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { stateDataToPrompt } from '@/common/promptApiUtils.js';
import Toast from '@/components/Toast';
import { actions } from '@/reducers/prompts';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import EditPromptDetail from './EditPromptDetail';
import EditPromptTabs from './EditPromptTabs';

export default function CreatePrompt() {
  const projectId = SOURCE_PROJECT_ID;
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { currentPrompt } = useSelector((state) => state.prompts);

  const [createPrompt, { isLoading: isSaving, isSuccess, data, isError, error }] = useCreatePromptMutation();

  const dispatch = useDispatch();
  const doCreate = React.useCallback(async () => {
    const { name } = currentPrompt;
    if (!name) {
      dispatch(actions.setValidationError({
        name: 'Name is required',
      }))
      return
    }
    await createPrompt({
      ...stateDataToPrompt(currentPrompt),
      projectId,
    });

  }, [currentPrompt, createPrompt, projectId, dispatch]);

  React.useEffect(() => {
    const promptId = data?.id;
    if (promptId) {
      navigate('/prompt/' + promptId, {
        state: {
          from: locationState?.from || 'Discover',
          breadCrumb: data.name,
        }
      });
    }
  }, [data, locationState?.from, navigate]);

  React.useEffect(() => {
    dispatch(actions.setValidationError({}));
    dispatch(actions.resetCurrentPromptData());
    return () => {
      dispatch(actions.setValidationError({}));
    }
  }, [dispatch]);

  return <>
    <EditPromptTabs runTabContent={<EditPromptDetail isSaving={isSaving} isCreateMode onSave={doCreate} />} />
    <Toast
      open={isError || isSuccess}
      severity={isError ? 'error' : 'success'}
      message={isError ? error?.data?.message : 'Create prompt success'}
    />
  </>;
}
