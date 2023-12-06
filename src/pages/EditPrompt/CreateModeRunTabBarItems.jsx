import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  SaveButton,
  TabBarItems,
} from './Common';
import { useDispatch, useSelector } from 'react-redux';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useCreatePromptMutation } from '@/api/prompts';
import { useLocation, useNavigate } from 'react-router-dom';
import { stateDataToPrompt } from '@/common/promptApiUtils.js';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';
import { useProjectId, useViewMode } from './hooks';
import useCardNavigate from '@/components/useCardNavigate';
import { ContentType } from '@/common/constants';

export default function CreateModeRunTabBarItems() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const projectId = useProjectId();
  const viewMode = useViewMode();

  const [createPrompt, { isLoading: isSaving, isSuccess, data, isError, error }] = useCreatePromptMutation();

  const doCreate = React.useCallback(async () => {
    const { name } = currentPrompt;
    if (!name) {
      dispatch(promptSliceActions.setValidationError({
        name: 'Name is required',
      }))
      return
    }
    await createPrompt({
      ...stateDataToPrompt(currentPrompt),
      projectId,
    });

  }, [currentPrompt, createPrompt, projectId, dispatch]);

  const navigateToPromptDetail = useCardNavigate(
    undefined,
    viewMode,
    data?.id,
    ContentType.Prompts,
    data?.name,
    true);

  React.useEffect(() => {
    const promptId = data?.id;
    if (promptId) {
      navigateToPromptDetail();
    }
  }, [data, locationState.from, navigate, navigateToPromptDetail]);
  const [openAlert, setOpenAlert] = useState(false);

  const onCancel = useCallback(() => {
    setOpenAlert(true);
  }, []);

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );

  const onConfirmDelete = useCallback(
    () => {
      onCloseAlert();
      dispatch(
        promptSliceActions.resetCurrentPromptData()
      );
    },
    [dispatch, onCloseAlert],
  );

  return (
    <>
      <TabBarItems>
        <SaveButton disabled={isSaving} variant="contained" color="secondary" onClick={doCreate}>
          Save
          {isSaving && <StyledCircleProgress />}
        </SaveButton>
        <Button variant='contained' color='secondary' onClick={onCancel}>
          Discard
        </Button>
      </TabBarItems>
      <AlertDialog
        title='Warning'
        alertContent="Are you sure to drop the changes?"
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
      <Toast
        open={isError || isSuccess}
        severity={isError ? 'error' : 'success'}
        message={isError ? buildErrorMessage(error) : 'Create prompt success'}
      />
    </>);
}