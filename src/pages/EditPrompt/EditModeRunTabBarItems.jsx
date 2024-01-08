import {
  LATEST_VERSION_NAME,
  SAVE,
  PUBLISH,
  CREATE_VERSION,
  CREATE_PUBLIC_VERSION,
  PromptStatus,
  ViewMode
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import React, { useCallback, useState, useMemo } from 'react';
import {
  TabBarItems,
  NormalRoundButton,
} from './Common';
import InputVersionDialog from './Form/InputVersionDialog';
import VersionSelect from './Form/VersionSelect';
import { useDispatch, useSelector } from 'react-redux';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useParams } from 'react-router-dom';
import Toast from '@/components/Toast';
import { useFromMyLibrary, useViewModeFromUrl, useFromPrompts, useProjectId } from '../hooks';
import useSaveLatestVersion from './useSaveLatestVersion';
import useDeleteVersion from './useDeleteVersion';
import usePublishVersion from './usePublishVersion';
import useSaveNewVersion from './useSaveNewVersion';
import useUnpublishVersion from './useUnpublishVersion';

export default function EditModeRunTabBarItems() {
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);
  const projectId = useProjectId();
  const { currentPrompt, currentVersionFromDetail, versions, currentPromptSnapshot } = useSelector((state) => state.prompts);
  const hasCurrentPromptBeenChanged = useMemo(() => {
    try {
      return JSON.stringify(currentPrompt) !== JSON.stringify(currentPromptSnapshot);
    } catch(e) {
      return true;
    }
  }, [currentPrompt, currentPromptSnapshot]);

  const { promptId, version } = useParams();
  const currentVersionName = useMemo(() => version || currentVersionFromDetail, [currentVersionFromDetail, version]);
  const { currentVersionId, currentVersionStatus } = useMemo(() => {
    const foundVersion = versions.find(item => item.name === currentVersionName) || {};
    return {
      currentVersionId: foundVersion.id,
      currentVersionStatus: foundVersion.status
    }
  }, [currentVersionName, versions]);
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const isFromMyLibrary = useFromMyLibrary();
  const isFromPrompts = useFromPrompts();
  const viewMode = useViewModeFromUrl();
  const [versionInputDialogTitle, setVersionInputDialogTitle] = useState(CREATE_VERSION);
  const [versionInputDoButtonTitle, setVersionInputDoButtonTitle] = useState(SAVE);
  const [isDoingPublish, setIsDoingPublish] = useState(false);
  const { onSave, isSaving } = useSaveLatestVersion(
    currentPrompt,
    currentVersionId,
    promptId,
    setOpenToast,
    setToastSeverity,
    setToastMessage);
  const { 
    onCreateNewVersion, 
    isSavingNewVersion, 
    isSavingNewVersionError, 
    isSavingNewVersionSuccess, 
    onFinishSaveNewVersion 
  } =
    useSaveNewVersion(
      currentPrompt,
      promptId,
      isDoingPublish,
      setOpenToast,
      setToastSeverity,
      setToastMessage);

  const {
    doDeleteVersion,
    isDeletingVersion,
    onFinishDeleteVersion,
    isDeleteVersionError,
    isDeleteVersionSuccess } =
    useDeleteVersion(currentVersionId, promptId, setOpenToast, setToastSeverity, setToastMessage);

  const { doPublish, resetPublishVersion, isPublishingVersion, isPublishVersionSuccess, isPublishVersionError } =
    usePublishVersion(setOpenToast, setToastSeverity, setToastMessage);

  const {
    doUnpublish,
    resetUnpublishVersion,
    isUnpublishingVersion,
    isUnpublishVersionSuccess,
    isUnpublishVersionError,
  } = useUnpublishVersion(setOpenToast, setToastSeverity, setToastMessage);

  const onCancel = useCallback(() => {
    setOpenAlert(true);
    setIsCancelling(true);
    setAlertTitle('Warning');
    setAlertContent('Are you sure to drop the changes?');
  }, []);

  const onSaveVersion = useCallback(
    () => {
      if (!showInputVersion) {
        setIsDoingPublish(false);
        setVersionInputDialogTitle(CREATE_VERSION);
        setVersionInputDoButtonTitle(SAVE);
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
          promptSliceActions.useCurrentPromptDataSnapshot()
        )
      } else if (isDeleting) {
        await doDeleteVersion()
      }
    }, [doDeleteVersion, dispatch, isCancelling, isDeleting, onCloseAlert]);

  const onCancelShowInputVersion = useCallback(
    () => {
      setShowInputVersion(false);
    },
    [],
  );

  const showInvalidVersionError = useCallback(
    () => {
      setToastSeverity('error');
      setToastMessage(
        newVersion
          ?
          'The version name has already existed, please choose a new name!'
          :
          'Empty version name is not allowed!');
      setOpenToast(true);
    },
    [newVersion],
  );

  const handleSaveVersion = useCallback(
    () => {
      const foundNameInTheList = versions.find(item => item.name === newVersion);
      if (!foundNameInTheList && newVersion) {
        onCreateNewVersion(newVersion);
      } else {
        showInvalidVersionError();
      }
    },
    [newVersion, onCreateNewVersion, showInvalidVersionError, versions],
  );

  const handlePublishLatestVersion = useCallback(
    async () => {
      const foundNameInTheList = versions.find(item => item.name === newVersion);
      if (!foundNameInTheList && newVersion) {
        const createdVersion = await onCreateNewVersion(newVersion);
        if (createdVersion?.data.id) {
          await doPublish(createdVersion?.data.id);
        }
      } else {
        showInvalidVersionError();
      }
    },
    [doPublish, newVersion, onCreateNewVersion, showInvalidVersionError, versions],
  );

  const onConfirmVersion = useCallback(
    () => {
      setShowInputVersion(false);
      if (!isDoingPublish) {
        handleSaveVersion();
      } else {
        handlePublishLatestVersion();
      }
    },
    [handlePublishLatestVersion, handleSaveVersion, isDoingPublish],
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
    if (isSavingNewVersionError || isSavingNewVersionSuccess) {
      onFinishSaveNewVersion();
    }
    if (isPublishVersionError || isPublishVersionSuccess) {
      resetPublishVersion();
      setIsDoingPublish(false);
    }

    if (isUnpublishVersionError || isUnpublishVersionSuccess) {
      resetUnpublishVersion();
    }

    if (isDeleteVersionError || isDeleteVersionSuccess) {
      onFinishDeleteVersion();
    }

  }, [
    newVersion,
    isSavingNewVersionError,
    isSavingNewVersionSuccess,
    isPublishVersionError,
    isPublishVersionSuccess,
    isUnpublishVersionError,
    isUnpublishVersionSuccess,
    isDeleteVersionError,
    isDeleteVersionSuccess,
    onFinishSaveNewVersion,
    resetPublishVersion,
    resetUnpublishVersion,
    onFinishDeleteVersion]);

  const onPublish = useCallback(
    () => {
      setIsDoingPublish(true);
      if (currentVersionName === LATEST_VERSION_NAME) {
        setVersionInputDialogTitle(CREATE_PUBLIC_VERSION);
        setVersionInputDoButtonTitle(PUBLISH);
        setShowInputVersion(true);
      } else {
        doPublish(currentVersionId);
      }
    },
    [currentVersionId, currentVersionName, doPublish],
  );

  const onUnpublish = useCallback(
    () => {
      doUnpublish(projectId, currentVersionId);
    },
    [currentVersionId, doUnpublish, projectId],
  );

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versions} enableVersionListAvatar={isFromPrompts} />
      {
        isFromMyLibrary &&
        currentVersionStatus !== PromptStatus.OnModeration &&
        currentVersionStatus !== PromptStatus.Published &&
        <NormalRoundButton
          disabled={
            !currentVersionName ||
            currentVersionStatus !== PromptStatus.Draft ||
            showInputVersion}
          variant='contained'
          color='secondary'
          onClick={onPublish}
        >
          Publish
          {(isPublishingVersion || (isDoingPublish && isSavingNewVersion)) && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      {
        isFromMyLibrary &&
        (currentVersionStatus === PromptStatus.OnModeration ||
          currentVersionStatus === PromptStatus.Published) &&
        <NormalRoundButton
          variant='contained'
          color='secondary'
          onClick={onUnpublish}
        >
          Unpublish
          {isUnpublishingVersion && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      {
        currentVersionName === LATEST_VERSION_NAME && isFromMyLibrary &&
        <NormalRoundButton disabled={isSaving || !hasCurrentPromptBeenChanged} variant="contained" color="secondary" onClick={onSave}>
          Save
          {isSaving && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      <NormalRoundButton disabled={!hasCurrentPromptBeenChanged} variant='contained' color='secondary' onClick={onCancel}>
        Discard
      </NormalRoundButton>
      {
        versions.length && isFromMyLibrary && viewMode === ViewMode.Owner ?
          <NormalRoundButton
            disabled={isSavingNewVersion || showInputVersion}
            variant='contained'
            color='secondary'
            onClick={onSaveVersion}
          >
            Save As Version
            {(isSavingNewVersion && !isDoingPublish) && <StyledCircleProgress size={20} />}
          </NormalRoundButton> : null
      }
      {
        currentVersionName !== 'latest' && isFromMyLibrary &&
        <NormalRoundButton
          disabled={isDeletingVersion}
          variant='contained'
          color='secondary'
          onClick={onDeleteVersion}
        >
          Delete Version
          {isDeletingVersion && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
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
      showTips={isDoingPublish}
      disabled={!newVersion}
      title={versionInputDialogTitle}
      doButtonTitle={versionInputDoButtonTitle}
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