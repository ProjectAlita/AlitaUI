import { LATEST_VERSION_NAME } from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  SaveButton,
  TabBarItems,
} from './Common';
import InputVersionDialog from './Form/InputVersionDialog';
import VersionSelect from './Form/VersionSelect';
import { useDispatch, useSelector } from 'react-redux';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSaveNewVersionMutation, useUpdateLatestVersionMutation, useDeleteVersionMutation } from '@/api/prompts';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';
import { useFromMyLibrary, useProjectId } from './hooks';

export default function EditModeRunTabBarItems() {
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const projectId = useProjectId();
  const { currentPrompt, currentVersionFromDetail, versions } = useSelector((state) => state.prompts);
  const [updateLatestVersion, {
    isLoading: isSaving,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError }] = useUpdateLatestVersionMutation();
  const [saveNewVersion, {
    isLoading: isSavingNewVersion,
    isSuccess,
    data: newVersionData,
    isError,
    error,
    reset }] = useSaveNewVersionMutation();
  const [deleteVersion, {
    isLoading: isDeletingVersion,
    isSuccess: isDeleteVersionSuccess,
    isError: isDeleteVersionError,
    error: deleteVersionError,
    reset: resetDeleteVersion }] = useDeleteVersionMutation();
  const { promptId, version } = useParams();
  const currentVersionName = useMemo(() => version || currentVersionFromDetail, [currentVersionFromDetail, version]);
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const canDelete = useFromMyLibrary();

  useEffect(() => {
    if (isError
      || isUpdateError
      || isSuccess
      || isUpdateSuccess
      || isDeleteVersionSuccess
      || isDeleteVersionError) {
      setOpenToast(true);
    }
    if (isError || isUpdateError) {
      setToastSeverity('error');
    } else if (isSuccess || isUpdateSuccess) {
      setToastSeverity('success');
    }
    if (isError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(error));
    } else if (isUpdateError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(updateError));
    } else if (isDeleteVersionError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(deleteVersionError));
    } else if (isUpdateSuccess) {
      setToastSeverity('success');
      setToastMessage('Updated latest version successfully');
    } else if (isSuccess) {
      setToastSeverity('success');
      setToastMessage('Saved new version successfully');
    } else if (isDeleteVersionSuccess) {
      setToastSeverity('success');
      setToastMessage('Deleted the version successfully');
    }
  }, [
    error,
    isError,
    isSuccess,
    isDeleteVersionSuccess,
    isUpdateError,
    isUpdateSuccess,
    isDeleteVersionError,
    deleteVersionError,
    updateError
  ]);

  const onSave = useCallback(async () => {
    await updateLatestVersion({
      ...stateDataToVersion(currentPrompt),
      id: currentVersion,
      projectId,
      promptId,
      prompt_id: promptId,
      status: 'draft',
    })
  }, [updateLatestVersion, currentPrompt, currentVersion, projectId, promptId]);

  const onCreateNewVersion = useCallback(async (newVersionName) => {
    await saveNewVersion({
      ...stateDataToVersion(currentPrompt),
      name: newVersionName,
      projectId,
      promptId,
    });
  }, [saveNewVersion, currentPrompt, projectId, promptId]);

  useEffect(() => {
    if (newVersionData?.id && newVersionData?.name) {
      navigate(`/prompt/${promptId}/${encodeURIComponent(newVersionData?.name)}`, {
        state: locationState
      });
      reset();
    }
  }, [locationState, navigate, newVersionData?.id, newVersionData?.name, promptId, reset]);

  const onCancel = useCallback(() => {
    setOpenAlert(true);
    setIsCancelling(true);
    setAlertTitle('Warning');
    setAlertContent('Are you sure to drop the changes?');
  }, []);

  const onSaveVersion = useCallback(
    () => {
      if (!showInputVersion) {
        setShowInputVersion(true);
      }
    },
    [showInputVersion],
  );

  const onDeleteVersion = useCallback(
    () => {
      setIsDeleting(true);
      setOpenAlert(true);
      setAlertTitle('Delete version');
      setAlertContent(`Are you sure to delete ${currentVersionName}?`);
    }, [currentVersionName]);

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
      if (isCancelling) {
        setIsCancelling(false);
      }
      if (isDeleting) {
        setIsDeleting(false);
      }
    },
    [isCancelling, isDeleting],
  );

  const onConfirmAlert = useCallback(
    async () => {
      onCloseAlert();
      if (isCancelling) {
        dispatch(
          promptSliceActions.useCurrentPromtDataSnapshot()
        )
      } else if (isDeleting) {
        await deleteVersion({ promptId, projectId, version: currentVersion })
      }
    },
    [
      currentVersion,
      deleteVersion,
      dispatch,
      isCancelling,
      isDeleting,
      onCloseAlert,
      projectId,
      promptId]);

  const onCancelShowInputVersion = useCallback(
    () => {
      setShowInputVersion(false);
    },
    [],
  );

  const onConfirmVersion = useCallback(
    () => {
      setShowInputVersion(false);
      const foundNameInTheList = versions.find(item => item.name === newVersion);
      if (!foundNameInTheList && newVersion) {
        onCreateNewVersion(newVersion);
      } else {
        setToastSeverity('error');
        setToastMessage(
          newVersion
            ?
            'The version name has already existed, please choose a new name!'
            :
            'Empty version name is not allowed!');
        setOpenToast(true);
      }
    },
    [newVersion, onCreateNewVersion, versions],
  );

  const onInputVersion = useCallback((event) => {
    const { target } = event;
    event.stopPropagation();
    setNewVersion(target?.value.trim());
  }, []);

  const onCloseToast = useCallback(() => {
    setOpenToast(false);
    if (newVersion) {
      setNewVersion('');
    }
    if (isError) {
      reset();
    }
    if (isDeleteVersionError) {
      resetDeleteVersion();
    } else if (isDeleteVersionSuccess) {
      navigate(-1);
      resetDeleteVersion();
    }
  }, [
    isDeleteVersionError,
    isDeleteVersionSuccess,
    isError,
    navigate,
    newVersion,
    reset,
    resetDeleteVersion]);

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versions} />
      {
        (currentVersionName === LATEST_VERSION_NAME)
        &&
        <SaveButton disabled={isSaving} variant="contained" color="secondary" onClick={onSave}>
          Save
          {isSaving && <StyledCircleProgress />}
        </SaveButton>
      }
      <Button variant='contained' color='secondary' onClick={onCancel}>
        Discard
      </Button>
      {
        versions.length ?
          <Button
            disabled={isSavingNewVersion || showInputVersion}
            variant='contained'
            color='secondary'
            onClick={onSaveVersion}
          >
            Save As Version
            {isSavingNewVersion && <StyledCircleProgress />}
          </Button> : null
      }
      {
        currentVersionName !== 'latest' && canDelete  &&
        <Button
          disabled={isDeletingVersion}
          variant='contained'
          color='secondary'
          onClick={onDeleteVersion}
        >
          Delete Version
          {isDeletingVersion && <StyledCircleProgress />}
        </Button>
      }
    </TabBarItems>
    <AlertDialog
      title={alertTitle}
      alertContent={alertContent}
      open={openAlert}
      onClose={onCloseAlert}
      onCancel={onCloseAlert}
      onConfirm={onConfirmAlert}
    />
    <InputVersionDialog
      open={showInputVersion}
      disabled={!newVersion}
      onCancel={onCancelShowInputVersion}
      onConfirm={onConfirmVersion}
      onChange={onInputVersion}
    />
    <Toast
      open={openToast}
      severity={toastSeverity}
      message={toastMessage}
      onClose={onCloseToast}
    />
  </>
}