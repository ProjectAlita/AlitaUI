import { useGetPromptQuery, useSaveNewVersionMutation, useUpdateLatestVersionMutation } from '@/api/prompts';
import { SOURCE_PROJECT_ID } from '@/common/constants';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import Toast from '@/components/Toast';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import EditPromptDetail from './EditPromptDetail';
import EditPromptTabs from './EditPromptTabs';

export default function EditPrompt() {
  const projectId = SOURCE_PROJECT_ID;
  const navigate = useNavigate();
  const { currentPrompt } = useSelector((state) => state.prompts);
  const [updateLatestVersion, { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }] = useUpdateLatestVersionMutation();
  const [saveNewVersion, { isSuccess, data: newVersionData, isError, error, reset }] = useSaveNewVersionMutation();
  const { promptId, version } = useParams();
  const { isLoading, data } = useGetPromptQuery({ projectId, promptId });
  const {
    versions = [], version_details: {
      name: currentVersionName = ''
    }
  } = data || { version_details: { name: '' } };
  const currentVersion = React.useMemo(() => versions.find(item => item.name === currentVersionName)?.id, [currentVersionName, versions]);
  const openToast = React.useMemo(() => isError || isUpdateError || isSuccess || isUpdateSuccess, [isError, isSuccess, isUpdateError, isUpdateSuccess]);
  const toastSeverity = React.useMemo(() => isError || isUpdateError ? 'error' : 'success', [isError, isUpdateError]);
  const toastMessage = React.useMemo(() => {
    if (isError) {
      return error?.data?.message;
    } else if (isUpdateError) {
      return updateError?.data?.message;
    } else if (isUpdateSuccess) {
      return 'Updated latest version successfully';
    } else {
      return 'Saved new version successfully';
    }
  }, [error?.data?.message, isError, isUpdateError, isUpdateSuccess, updateError?.data?.message])

  const onSave = React.useCallback(async () => {
    await updateLatestVersion({
      ...stateDataToVersion(currentPrompt),
      id: currentVersion,
      projectId,
      promptId,
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
      navigate(`/prompt/${promptId}/${newVersionData?.name}`);
      reset();
    }
  }, [navigate, newVersionData?.id, newVersionData?.name, promptId, reset]);


  if (!promptId) {
    return <div>No prompt id</div>;
  }

  return (
    <>
      <EditPromptTabs
        isLoading={isLoading}
        runTabContent={
          <EditPromptDetail
            onSave={onSave}
            onCreateNewVersion={onCreateNewVersion}
            versions={versions}
            currentVersionName={version || currentVersionName}
          />}
      />
      <Toast
        open={openToast}
        severity={toastSeverity}
        message={toastMessage}
      />
    </>
  );
}

