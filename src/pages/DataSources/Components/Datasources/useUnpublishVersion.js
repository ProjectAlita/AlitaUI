import { useUnpublishDatasourceMutation } from '@/api/datasources';
import { useCallback } from 'react';

const useUnpublishVersion = (projectId, datasourceId) => {
  const [publish, {
    isError: isUnpublishError,
    isSuccess: isUnpublishSuccess,
    error: publishError,
    isLoading: isUnpublishingVersion,
    reset: resetUnpublish }] = useUnpublishDatasourceMutation()

  const onUnpublish = useCallback(
    async () => {
      await publish({ projectId, datasourceId })
    },
    [datasourceId, projectId, publish],
  )
  return { onUnpublish, isUnpublishingVersion, isUnpublishError, isUnpublishSuccess, publishError, resetUnpublish }
}

export default useUnpublishVersion;