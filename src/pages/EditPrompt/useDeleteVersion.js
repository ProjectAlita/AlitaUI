import { useDeleteVersionMutation } from '@/api/prompts';
import { useEffect, useCallback } from 'react';
import { buildErrorMessage } from '@/common/utils';
import { useProjectId } from './hooks';

const useDeleteVersion = (currentVersionId, promptId, setOpenToast, setToastSeverity, setToastMessage) => {
  const projectId = useProjectId();
  const [deleteVersion, {
    isLoading: isDeletingVersion,
    isSuccess: isDeleteVersionSuccess,
    isError: isDeleteVersionError,
    error: deleteVersionError,
    reset: resetDeleteVersion }] = useDeleteVersionMutation();

  useEffect(() => {
    if (isDeleteVersionSuccess || isDeleteVersionError) {
      setOpenToast(true);
    }
    if (isDeleteVersionError) {
      setToastSeverity('error');
      setToastMessage(buildErrorMessage(deleteVersionError));
    } else if (isDeleteVersionSuccess) {
      setToastSeverity('success');
      setToastMessage('Deleted the version successfully');
    }
  }, [
    isDeleteVersionSuccess,
    isDeleteVersionError,
    deleteVersionError,
    setOpenToast,
    setToastSeverity,
    setToastMessage]);

  const doDeleteVersion = useCallback(
    async () => {
      await deleteVersion({ promptId, projectId, version: currentVersionId })
    },
    [currentVersionId, deleteVersion, projectId, promptId],
  );

  return {
    doDeleteVersion,
    isDeletingVersion,
    isDeleteVersionSuccess,
    isDeleteVersionError,
    resetDeleteVersion
  };
}

export default useDeleteVersion;