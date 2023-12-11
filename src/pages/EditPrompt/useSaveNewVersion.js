import { useSaveNewVersionMutation } from '@/api/prompts';
import { useCallback, useEffect } from 'react';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import { buildErrorMessage } from '@/common/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const useSaveNewVersion = (
  currentPrompt,
  promptId,
  isDoingPublish,
  setOpenToast,
  setToastSeverity,
  setToastMessage,
) => {
  const { personal_project_id: projectId } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { state: locationState } = useLocation();

  const [saveNewVersion, {
    isLoading: isSavingNewVersion,
    isSuccess: isSavingNewVersionSuccess,
    data: newVersionData,
    isError: isSavingNewVersionError,
    error,
    reset }] = useSaveNewVersionMutation();

  const onCreateNewVersion = useCallback(async (newVersionName) => {
    return await saveNewVersion({
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

  useEffect(() => {
    if (isSavingNewVersionError || (isSavingNewVersionSuccess && !isDoingPublish)) {
      setOpenToast(true);
    }
    if (isSavingNewVersionError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(error));
    } else if (isSavingNewVersionSuccess) {
      setToastSeverity('success');
      setToastMessage('Saved new version successfully');
    }
  }, [
    error,
    isSavingNewVersionError,
    isSavingNewVersionSuccess,
    isDoingPublish,
    setOpenToast,
    setToastSeverity,
    setToastMessage]);

  return {
    onCreateNewVersion,
    isSavingNewVersion,
    isSavingNewVersionError,
    reset
  };
}

export default useSaveNewVersion;