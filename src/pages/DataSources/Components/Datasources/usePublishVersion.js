import { usePublishDatasourceMutation } from '@/api/datasources';
import { useCallback } from 'react';

const usePublishVersion = (projectId, datasourceId) => {
  const [publish, {
    isError: isPublishError,
    isSuccess: isPublishSuccess,
    error: publishError,
    isLoading: isPublishingVersion,
    reset: resetPublish }] = usePublishDatasourceMutation()

  const onPublish = useCallback(
    async () => {
      await publish({ projectId, datasourceId })
    },
    [datasourceId, projectId, publish],
  )
  return { onPublish, isPublishingVersion, isPublishError, isPublishSuccess, publishError, resetPublish }
}

export default usePublishVersion;