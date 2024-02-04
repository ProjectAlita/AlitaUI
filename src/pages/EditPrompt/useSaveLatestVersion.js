import { useUpdateLatestVersionMutation } from '@/api/prompts';
import { useCallback, useEffect } from 'react';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import { buildErrorMessage } from '@/common/utils';
import { useSelectedProjectId } from '../hooks';

const useSaveLatestVersion = (
  currentPrompt,
  currentVersionId,
  promptId,
  setOpenToast,
  setToastSeverity,
  setToastMessage,
) => {  
  const selectedProjectId = useSelectedProjectId();
  const [updateLatestVersion, {
    isLoading: isSaving,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError }] = useUpdateLatestVersionMutation();

  const onSave = useCallback(async () => {
    await updateLatestVersion({
      ...stateDataToVersion(currentPrompt),
      id: currentVersionId,
      projectId: selectedProjectId,
      promptId,
      prompt_id: promptId,
      status: 'draft',
    })
  }, [updateLatestVersion, currentPrompt, currentVersionId, selectedProjectId, promptId]);

  useEffect(() => {
    if (isUpdateError || isUpdateSuccess) {
      setOpenToast(true);
    }
    if (isUpdateError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(updateError));
    } else if (isUpdateSuccess) {
      setToastSeverity('success');
      setToastMessage('The version has been updated');
    }
  }, [
    isUpdateError,
    isUpdateSuccess,
    updateError,
    setOpenToast,
    setToastSeverity,
    setToastMessage
  ]);

  return {
    onSave,
    isSaving,
  }
}

export default useSaveLatestVersion;