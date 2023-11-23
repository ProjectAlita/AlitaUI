import {
  LATEST_VERSION_NAME,
  SOURCE_PROJECT_ID
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import Button from '@/components/Button';
import { StyledCircleProgress } from '@/components/ChatBox/StyledComponents';
import * as React from 'react';
import { useCallback, useState } from 'react';
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
  const currentVersionName = React.useMemo(() => version || currentVersionFromDetail, [currentVersionFromDetail, version]);
  const currentVersion = React.useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const openToast = React.useMemo(() => isError || isUpdateError || isSuccess || isUpdateSuccess, [isError, isSuccess, isUpdateError, isUpdateSuccess]);
  const toastSeverity = React.useMemo(() => isError || isUpdateError ? 'error' : 'success', [isError, isUpdateError]);
  const toastMessage = React.useMemo(() => {
    if (isError) {
      return error?.data?.message || error?.data || error;
    } else if (isUpdateError) {
      return updateError?.data?.message || updateError?.data || updateError;
    } else if (isUpdateSuccess) {
      return 'Updated latest version successfully';
    } else {
      return 'Saved new version successfully';
    }
  }, [error, isError, isUpdateError, isUpdateSuccess, updateError])

  const onSave = React.useCallback(async () => {
    await updateLatestVersion({
      ...stateDataToVersion(currentPrompt),
      id: currentVersion,
      projectId,
      promptId,
      prompt_id: promptId,
      status: 'draft',
    })
  }, [updateLatestVersion, currentPrompt, currentVersion, projectId, promptId]);

  const onCreateNewVersion = React.useCallback(async (newVersionName) => {
    await saveNewVersion({
      ...stateDataToVersion(currentPrompt),
      name: newVersionName,
      projectId,
      promptId,
    });
  }, [saveNewVersion, currentPrompt, projectId, promptId]);

  React.useEffect(() => {
    if (newVersionData?.id && newVersionData?.name) {
      navigate(`/prompt/${promptId}/${newVersionData?.name}`, {
        state: locationState
      });
      reset();
    }
  }, [locationState, navigate, newVersionData?.id, newVersionData?.name, promptId, reset]);



  const onCancel = useCallback(() => {
    setOpenAlert(true);
  }, []);

  const onSaveVersion = React.useCallback(
    () => {
      setShowInputVersion(true);
    },
    [],
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
      onCreateNewVersion(newVersion);
    },
    [newVersion, onCreateNewVersion],
  );

  const onInputVersion = useCallback((event) => {
    const { target } = event;
    event.stopPropagation();
    setNewVersion(target?.value);
  }, []);


  return <><TabBarItems>
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
      !!versions.length &&
      <Button disabled={isSavingNewVersion} variant='contained' color='secondary' onClick={onSaveVersion}>
        Save As Version
        {isSavingNewVersion && <StyledCircleProgress />}
      </Button>
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
      onCancel={onCancelShowInputVersion}
      onConfirm={onConfirmVersion}
      onChange={onInputVersion}
    />
    <Toast
      open={openToast}
      severity={toastSeverity}
      message={toastMessage}
    />
  </>
}