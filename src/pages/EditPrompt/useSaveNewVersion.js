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

  useEffect(() => {
    if (newVersionData?.id && newVersionData?.name) {
      const newPath = collectionId
        ?
        `${RouteDefinitions.MyLibrary}/collections/${collectionId}/prompts/${promptId}/${encodeURIComponent(newVersionData?.name)}?${SearchParams.ViewMode}=${ViewMode.Owner}&${SearchParams.Name}=${name}&${SearchParams.Collection}=${collection}`
        :
        `${RouteDefinitions.MyLibrary}/prompts/${promptId}/${encodeURIComponent(newVersionData?.name)}?${SearchParams.ViewMode}=${ViewMode.Owner}&${SearchParams.Name}=${name}`;
      const routeStack = [...(locationState?.routeStack || [])];
      if (routeStack.length) {
        routeStack[routeStack.length - 1] = {
          ...routeStack[routeStack.length - 1],
          pagePath: newPath,
        }
      } else {
        routeStack.push({
          pagePath: newPath,
          breadCrumb: name,
          viewMode,
        });
      }
      navigate(newPath, {
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