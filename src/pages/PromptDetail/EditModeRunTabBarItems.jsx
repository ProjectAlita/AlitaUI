import {
  LATEST_VERSION_NAME,
  SOURCE_PROJECT_ID
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  SaveButton,
  TabBarItems,
} from './Common';
import InputVersionDialog from './InputVersionDialog';
import VersionSelect from './VersionSelect';
import { useDispatch, useSelector } from 'react-redux';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetPromptQuery, useSaveNewVersionMutation, useUpdateLatestVersionMutation } from '@/api/prompts';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import Toast from '@/components/Toast';
import { buildErrorMessage } from '@/common/utils';

export default function EditModeRunTabBarItems() {
  const dispatch = useDispatch();
  const [openAlert, setOpenAlert] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);
  const projectId = SOURCE_PROJECT_ID;
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [updateLatestVersion, { isLoading: isSaving, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateLatestVersionMutation();
  const [saveNewVersion, { isLoading: isSavingNewVersion, isSuccess, data: newVersionData, isError, error, reset }] = useSaveNewVersionMutation();
  const { promptId, version } = useParams();
  const { data } = useGetPromptQuery({ projectId, promptId });
  const {
    versions = [], version_details: {
      name: currentVersionFromDetail = ''
    }
  } = data || { version_details: { name: '' } };
  const currentVersionName = useMemo(() => version || currentVersionFromDetail, [currentVersionFromDetail, version]);
  const currentVersion = useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (isError || isUpdateError || isSuccess || isUpdateSuccess) {
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
    } else if (isUpdateSuccess) {
      setToastSeverity('success');
      setToastMessage('Updated latest version successfully');
    } else if (isSuccess) {
      setToastSeverity('success');
      setToastMessage('Saved new version successfully');
    }
  }, [error, isError, isSuccess, isUpdateError, isUpdateSuccess, updateError]);

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
  }, []);

  const onSaveVersion = useCallback(
    () => {
      if (!showInputVersion) {
        setShowInputVersion(true);
      }
    },
    [showInputVersion],
  );

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
        promptSliceActions.useCurrentPromtDataSnapshot()
      )
    },
    [dispatch, onCloseAlert],
  );

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
        setToastMessage(newVersion ? 'The version name has already existed, please choose a new name!' : 'Empty version name is not allowed!');
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
  }, [newVersion]);

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
          <Button disabled={isSavingNewVersion || showInputVersion} variant='contained' color='secondary' onClick={onSaveVersion}>
            Save As Version
            {isSavingNewVersion && <StyledCircleProgress />}
          </Button> : null
      }
    </TabBarItems>
    <AlertDialog
      title='Warning'
      alertContent="Are you sure to drop the changes?"
      open={openAlert}
      onClose={onCloseAlert}
      onCancel={onCloseAlert}
      onConfirm={onConfirmDelete}
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