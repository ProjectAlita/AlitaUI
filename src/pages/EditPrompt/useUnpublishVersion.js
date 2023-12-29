import { useUnpublishVersionMutation } from '@/api/prompts';
import { useEffect, useCallback } from 'react';
import { buildErrorMessage } from '@/common/utils';

const useUnpublishVersion = (setOpenToast, setToastSeverity, setToastMessage) => {

  const [unpublishVersion, {
    isLoading: isUnpublishingVersion,
    isSuccess: isUnpublishVersionSuccess,
    isError: isUnpublishVersionError,
    error: publishVersionError,
    reset: resetUnpublishVersion }] = useUnpublishVersionMutation();

    const doUnpublish = useCallback(
      async (projectId, versionId) => {
        await unpublishVersion({
          projectId,
          versionId,
        });
      },
      [unpublishVersion],
    );

    useEffect(() => {
      if (isUnpublishVersionSuccess
        || isUnpublishVersionError) {
        setOpenToast(true);
      }
      if (isUnpublishVersionError) {
        setToastSeverity('error');
        setToastMessage(buildErrorMessage(publishVersionError));
      } else if (isUnpublishVersionSuccess) {
        setToastSeverity('info');
        setToastMessage('The version has been unpublished');
      }
    }, [
      isUnpublishVersionError, 
      isUnpublishVersionSuccess, 
      publishVersionError, 
      setOpenToast, 
      setToastMessage, 
      setToastSeverity]);

  return {
    doUnpublish,
    resetUnpublishVersion,
    isUnpublishingVersion,
    isUnpublishVersionSuccess,
    isUnpublishVersionError,
  };
}

export default useUnpublishVersion;