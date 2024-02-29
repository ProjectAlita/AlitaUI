import { usePublishVersionMutation } from '@/api/prompts';
import { useEffect, useCallback } from 'react';
import { buildErrorMessage } from '@/common/utils';
import { useSelectedProjectId } from '../../hooks';

const usePublishVersion = (setOpenToast, setToastSeverity, setToastMessage) => {
  const selectedProjectId = useSelectedProjectId();

  const [publishVersion, {
    isLoading: isPublishingVersion,
    isSuccess: isPublishVersionSuccess,
    isError: isPublishVersionError,
    error: publishVersionError,
    reset: resetPublishVersion }] = usePublishVersionMutation();

    const doPublish = useCallback(
      async (versionId) => {
        await publishVersion({
          versionId: versionId,
          projectId: selectedProjectId,
        });
      },
      [selectedProjectId, publishVersion],
    );

    useEffect(() => {
      if (isPublishVersionSuccess
        || isPublishVersionError) {
        setOpenToast(true);
      }
      if (isPublishVersionError) {
        setToastSeverity('error');
        setToastMessage(buildErrorMessage(publishVersionError));
      } else if (isPublishVersionSuccess) {
        setToastSeverity('success');
        setToastMessage('Version is sent for moderation');
      }
    }, [
      isPublishVersionError, 
      isPublishVersionSuccess, 
      publishVersionError, 
      setOpenToast, 
      setToastMessage, 
      setToastSeverity]);

  return {
    doPublish,
    resetPublishVersion,
    isPublishingVersion,
    isPublishVersionSuccess,
    isPublishVersionError,
  };
}

export default usePublishVersion;