import { useUpdateLatestVersionMutation } from '@/api/prompts';
import { useCallback, useEffect } from 'react';
import { stateDataToVersion } from '@/common/promptApiUtils.js';
import { useProjectId } from './hooks';
import { buildErrorMessage } from '@/common/utils';

const useSaveLatestVersion = (
  currentPrompt,
  currentVersionId,
  promptId,
  setOpenToast,
  setToastSeverity,
  setToastMessage,
) => {
  const projectId = useProjectId();
  const [updateLatestVersion, {
    isLoading: isSaving,
    isSuccess: isUpdateSuccess,
    isError: isUpdateError,
    error: updateError }] = useUpdateLatestVersionMutation();

  const onSave = useCallback(async () => {
    await updateLatestVersion({
      ...stateDataToVersion(currentPrompt),
      id: currentVersionId,
      projectId,
      promptId,
      prompt_id: promptId,
      status: 'draft',
    })
  }, [updateLatestVersion, currentPrompt, currentVersionId, projectId, promptId]);

  useEffect(() => {
    if (isUpdateError || isUpdateSuccess) {
      setOpenToast(true);
    }
    if (isUpdateError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(updateError));
    } else if (isUpdateSuccess) {
      setToastSeverity('success');
      setToastMessage('Updated latest version successfully');
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