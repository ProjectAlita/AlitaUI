import { useUnpublishApplicationMutation } from '@/api/applications';
import { useCallback } from 'react';

const useUnpublishVersion = (projectId, applicationId) => {
  const [publish, {
    isError: isUnpublishError,
    isSuccess: isUnpublishSuccess,
    error: publishError,
    isLoading: isUnpublishingVersion,
    reset: resetUnpublish }] = useUnpublishApplicationMutation()

  const onUnpublish = useCallback(
    async () => {
      await publish({ projectId, applicationId })
    },
    [applicationId, projectId, publish],
  )
  return { onUnpublish, isUnpublishingVersion, isUnpublishError, isUnpublishSuccess, publishError, resetUnpublish }
}

export default useUnpublishVersion;