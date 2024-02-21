import { useGetModelsQuery } from '@/api/integrations';
import { useSelectedProjectId } from '@/pages/hooks';
import { useEffect, useState } from 'react';

const useModelOptions = () => {
  const projectId = useSelectedProjectId();

  const { isSuccess, data: integrations } = useGetModelsQuery(projectId, { skip: !projectId });
  const [modelOptions, setModelOptions] = useState({});
  const [embeddingModelOptions, setEmbeddingModelOptions] = useState({})
  useEffect(() => {
    if (isSuccess && integrations && integrations.length) {
      // todo: remove mock
      const mockedIntegration = {
        "id": 0,
        "project_id": integrations[0].project_id,
        "name": "Hugging Face",
        "section": {
          "name": "ai",
          "integration_description": "Manage ai integrations",
          "test_planner_description": ""
        },
        "settings": {
          "models": [
            {
              "id": "sentence-transformers/all-mpnet-base-v2",
              "name": "sentence-transformers/all-mpnet-base-v2",
              "capabilities": {
                "completion": false,
                "chat_completion": false,
                "embeddings": true
              },
              "token_limit": 0
            },
          ],
        },
        "config": {
          "name": "Hugging Face Shared",
          "is_shared": true
        },
        "uid": "00000000-0000-0000-0000-000000000000"
      }

      const configNameModelMap = [...integrations, mockedIntegration].reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.config.name]: item.settings.models?.map(
            ({ name: modelName, id }) => ({
              label: modelName,
              value: id,
              group: item.uid,
              group_name: item.name,
              config_name: item.config.name,
            })),
        };
      }, {});
      setModelOptions(configNameModelMap);

      const filteredConfigNameModelMap = integrations.reduce((accumulator, item) => {
        const leftModels = item.settings.models?.filter((modelItem) => {
          return modelItem.capabilities.embeddings
        }).map(
          ({ name: embeddingModelName, id }) => ({
            label: embeddingModelName,
            value: id,
            group: item.uid,
            group_name: item.name,
            config_name: item.config.name,
          }));
        return leftModels.length ? {
          ...accumulator,
          [item.config.name]: leftModels,
        } : accumulator;
      }, {});
      setEmbeddingModelOptions(filteredConfigNameModelMap);
    }
  }, [integrations, isSuccess]);

  return {
    modelOptions,
    embeddingModelOptions,
  }
}

export default useModelOptions;