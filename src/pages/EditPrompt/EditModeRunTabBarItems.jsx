import {
  CREATE_PUBLIC_VERSION,
  CREATE_VERSION,
  LATEST_VERSION_NAME,
  PUBLISH,
  PromptStatus,
  SAVE,
  ViewMode
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import Toast from '@/components/Toast';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  useFromMyLibrary,
  useFromPrompts,
  useHasPromptChange,
  useNavBlocker,
  useProjectId,
  useViewMode,
} from '../hooks';
import {
  TabBarItems,
} from './Common';
import DiscardButton from './DiscardButton';
import InputVersionDialog from './Form/InputVersionDialog';
import VersionSelect from './Form/VersionSelect';
import useDeleteVersion from './useDeleteVersion';
import usePublishVersion from './usePublishVersion';
import useSaveLatestVersion from './useSaveLatestVersion';
import useSaveNewVersion from './useSaveNewVersion';
import useUnpublishVersion from './useUnpublishVersion';
import NormalRoundButton from '@/components/NormalRoundButton';

export default function EditModeRunTabBarItems() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState('Warning');
  const [alertContent, setAlertContent] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);
  const projectId = useProjectId();
  const { currentPrompt, currentVersionFromDetail, versions } = useSelector((state) => state.prompts);
  const hasCurrentPromptBeenChanged = useHasPromptChange();

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
  const viewMode = useViewMode();
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
      setOpenAlert(true);
      setAlertTitle('Delete version');
      setAlertContent(`Are you sure to delete ${currentVersionName}?`);
    }, [currentVersionName]);

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );

  const onConfirmAlert = useCallback(
    async () => {
      onCloseAlert();
      await doDeleteVersion()
    }, [doDeleteVersion, onCloseAlert]);

  const onCancelShowInputVersion = useCallback(
    () => {
      setShowInputVersion(false);
      setNewVersion('');
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

  const handlePublishVersion = useCallback(
    async () => {
      const foundNameInTheList = versions.find(item => item.name === newVersion);
      if (!foundNameInTheList && newVersion) {
        const createdVersion = await onCreateNewVersion(newVersion);
        if (createdVersion?.data.id) {
          await doPublish(createdVersion?.data.id);
        }
      } else {
        if (currentVersionName !== LATEST_VERSION_NAME) {
          await doPublish(currentVersionId);
        } else {
          showInvalidVersionError();
        }
      }
    },
    [currentVersionId, currentVersionName, doPublish, newVersion, onCreateNewVersion, showInvalidVersionError, versions],
  );

  const onConfirmVersion = useCallback(
    () => {
      setShowInputVersion(false);
      if (!isDoingPublish) {
        handleSaveVersion();
      } else {
        handlePublishVersion();
      }
    },
    [handlePublishVersion, handleSaveVersion, isDoingPublish],
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
      if (currentVersionName !== LATEST_VERSION_NAME) {
        setNewVersion(currentVersionName);
      }
      setVersionInputDialogTitle(CREATE_PUBLIC_VERSION);
      setVersionInputDoButtonTitle(PUBLISH);
      setShowInputVersion(true);
    },
    [currentVersionName],
  );

  const onUnpublish = useCallback(
    () => {
      doUnpublish(projectId, currentVersionId);
    },
    [currentVersionId, doUnpublish, projectId],
  );

  const isOwnerView = useMemo(() => isFromMyLibrary && viewMode === ViewMode.Owner, [isFromMyLibrary, viewMode]);

  const showSaveButton = useMemo(() =>
    currentVersionName === LATEST_VERSION_NAME && isOwnerView,
    [currentVersionName, isOwnerView])
  const showSaveVersionButton = useMemo(() =>
    versions.length && isOwnerView,
    [isOwnerView, versions.length])

  const blockCondition = useMemo(() =>
    hasCurrentPromptBeenChanged && (showSaveButton || showSaveVersionButton),
    [hasCurrentPromptBeenChanged, showSaveButton, showSaveVersionButton]);

  const isPublishingSavedVersion = useMemo(() => {
    return isDoingPublish && currentVersionName !== LATEST_VERSION_NAME;
  }, [currentVersionName, isDoingPublish])

  useNavBlocker({
    blockCondition
  });

  return <>
    <TabBarItems>
      <VersionSelect currentVersionName={currentVersionName} versions={versions} enableVersionListAvatar={isFromPrompts} />
      {
        isOwnerView &&
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
        isOwnerView &&
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
        showSaveButton &&
        <NormalRoundButton disabled={isSaving || !hasCurrentPromptBeenChanged} variant="contained" color="secondary" onClick={onSave}>
          Save
          {isSaving && <StyledCircleProgress size={20} />}
        </NormalRoundButton>
      }
      <DiscardButton />
      {
        showSaveVersionButton ?
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
        currentVersionName !== LATEST_VERSION_NAME && isOwnerView &&
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
      versionName={newVersion}
      disabledInput={isPublishingSavedVersion}
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