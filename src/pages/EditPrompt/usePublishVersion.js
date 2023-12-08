import { usePublishVersionMutation } from '@/api/prompts';
import { useEffect, useCallback } from 'react';
import { buildErrorMessage } from '@/common/utils';
import { useSelector } from 'react-redux';

const usePublishVersion = (setOpenToast, setToastSeverity, setToastMessage) => {
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);

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
          projectId: privateProjectId,
        });
      },
      [privateProjectId, publishVersion],
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
        setToastMessage('Published the version successfully');
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