import { usePublishApplicationMutation } from '@/api/applications';
import { useCallback } from 'react';

const usePublishVersion = (projectId, applicationId) => {
  const [publish, {
    isError: isPublishError,
    isSuccess: isPublishSuccess,
    error: publishError,
    isLoading: isPublishingVersion,
    reset: resetPublish }] = usePublishApplicationMutation()

  const onPublish = useCallback(
    async () => {
      await publish({ projectId, applicationId })
    },
    [applicationId, projectId, publish],
  )
  return { onPublish, isPublishingVersion, isPublishError, isPublishSuccess, publishError, resetPublish }
}

export default usePublishVersion;