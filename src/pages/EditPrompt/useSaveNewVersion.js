import { useSaveNewVersionMutation } from '@/api/prompts';
import { useCallback, useEffect } from 'react';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import { buildErrorMessage } from '@/common/utils';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SearchParams, ViewMode } from '@/common/constants';
import RouteDefinitions from '@/routes';
import { useCollectionFromUrl, useViewModeFromUrl, useNameFromUrl } from '../hooks';

const useSaveNewVersion = (
  currentPrompt,
  promptId,
  isDoingPublish,
  setOpenToast,
  setToastSeverity,
  setToastMessage,
) => {
  const { personal_project_id: projectId } = useSelector(state => state.user);
  const collection = useCollectionFromUrl();
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const { collectionId } = useParams();
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
      projectId,
      promptId,
    });
  }, [saveNewVersion, currentPrompt, projectId, promptId]);

  const onSuccess = useCallback(() => {
    if (newVersionData?.id && newVersionData?.name) {
      const newPath = collectionId
        ?
        `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${promptId}/${encodeURIComponent(newVersionData?.name)}`
        :
        `${RouteDefinitions.MyLibrary}/prompts/${promptId}/${encodeURIComponent(newVersionData?.name)}`;
      const search = collectionId
        ?
        `${SearchParams.ViewMode}=${ViewMode.Owner}&${SearchParams.Name}=${encodeURIComponent(name)}&${SearchParams.Collection}=${encodeURIComponent(collection)}`
        :
        `${SearchParams.ViewMode}=${ViewMode.Owner}&${SearchParams.Name}=${encodeURIComponent(name)}`;
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
    collection,
    collectionId,
    locationState,
    name,
    navigate,
    newVersionData?.id,
    newVersionData?.name,
    promptId,
    reset,
    viewMode
  ]);

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