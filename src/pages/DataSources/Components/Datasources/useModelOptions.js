import { useGetModelsQuery } from '@/api/integrations';
import { useSelectedProjectId } from '@/pages/hooks';
import { useEffect, useState } from 'react';
import {getIntegrationOptions} from "@/pages/DataSources/utils.js";

const useModelOptions = () => {
  const projectId = useSelectedProjectId();

  const { isSuccess, data: integrations } = useGetModelsQuery(projectId, { skip: !projectId });
  const [modelOptions, setModelOptions] = useState({});
  const [embeddingModelOptions, setEmbeddingModelOptions] = useState({})
  useEffect(() => {
    if (isSuccess && integrations && integrations.length) {
      setModelOptions(getIntegrationOptions(integrations, ['chat_completion', 'completion']));
      setEmbeddingModelOptions(getIntegrationOptions(integrations, ['embeddings']));
    }
  }, [integrations, isSuccess]);

  return {
    modelOptions,
    embeddingModelOptions,
  }
}

export default useModelOptions;