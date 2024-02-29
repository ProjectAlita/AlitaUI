import { useSaveNewVersionMutation } from '@/api/prompts';
import { useCallback, useEffect } from 'react';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import { buildErrorMessage } from '@/common/utils';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useViewModeFromUrl, useNameFromUrl, useSelectedProjectId } from '../../hooks';
import { replaceVersionInPath } from './useDeleteVersion';

const useSaveNewVersion = (
  currentPrompt,
  promptId,
  isDoingPublish,
  setOpenToast,
  setToastSeverity,
  setToastMessage,
) => {
  const selectedProjectId = useSelectedProjectId();
  const navigate = useNavigate();
  const { state: locationState, pathname, search } = useLocation();
  const { version: currentVersionName } = useParams();
  const viewMode = useViewModeFromUrl();
  const name = useNameFromUrl();

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
      projectId: selectedProjectId,
      promptId,
    });
  }, [saveNewVersion, currentPrompt, selectedProjectId, promptId]);

  const onSuccess = useCallback(() => {
    if (newVersionData?.id && newVersionData?.name) {
      const newPath = replaceVersionInPath(newVersionData?.name, pathname, currentVersionName, promptId);
      const routeStack = [...(locationState?.routeStack || [])];
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = {
          ...routeStack[routeStack.length - 1],
          pagePath: `${encodeURI(newPath)}?${search}`,
        }
      } else {
        routeStack.push({
          pagePath: `${encodeURI(newPath)}?${search}`,
          breadCrumb: name,
          viewMode,
        });
      }
      navigate(
        {
          pathname: encodeURI(newPath),
          search
        },
        {
          state: locationState
        });
      reset();
    }
  }, [
    currentVersionName,
    locationState,
    name,
    navigate,
    newVersionData?.id,
    newVersionData?.name,
    pathname,
    promptId,
    reset,
    search,
    viewMode]);

  const onFinishSaveNewVersion = useCallback(() => {
    if (isSavingNewVersionSuccess) {
      onSuccess();
    } else if (isSavingNewVersionError) {
      reset();
    }
  }, [isSavingNewVersionError, isSavingNewVersionSuccess, onSuccess, reset]);

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
    isSavingNewVersionSuccess,
    onFinishSaveNewVersion,
  };
}

export default useSaveNewVersion;