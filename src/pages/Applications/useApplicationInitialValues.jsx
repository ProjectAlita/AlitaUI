import { useApplicationDetailsQuery } from "@/api/applications.js";
import { useGetModelsQuery } from '@/api/integrations';
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants.js';
import { getIntegrationOptions } from "@/pages/DataSources/utils.js";
import { useProjectId } from "@/pages/hooks.jsx";
import { useMemo } from "react";
import { useParams } from "react-router-dom";


const getModelSettings = (data = [], applicationData) => {
  const { model_settings } = applicationData?.version_details || {};

  const integrationUid = model_settings?.model?.integration_uid || data[0]?.uid;
  const targetData = data.find((item) => item?.uid === integrationUid);
  if (targetData) {
    const newModelSettings = {
      max_tokens: model_settings?.max_tokens ?? DEFAULT_MAX_TOKENS,
      top_p: model_settings?.top_p ?? (targetData.settings?.top_p || DEFAULT_TOP_P),
      top_k: model_settings?.top_k ?? (targetData.settings?.top_k || DEFAULT_TOP_K),
      temperature: model_settings?.temperature ?? (targetData.settings?.temperature || DEFAULT_TEMPERATURE),
      model: {
        [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
        [PROMPT_PAYLOAD_KEY.integrationName]: model_settings?.model?.integration_name || targetData.name,
      }
    }

    const models = targetData?.settings?.models || [];
    if (models.length && !models.find(model => model === model_settings?.model?.model_name)) {
      const matchedModel = models?.find(model => model.capabilities.chat_completion || model.capabilities.completion);
      newModelSettings.model.name = matchedModel?.id
    }
    return newModelSettings
  }
  return {}
}

const useApplicationInitialValues = () => {
  const currentProjectId = useProjectId()
  const { applicationId } = useParams();
  const { data: applicationData = {}, isFetching } =
    useApplicationDetailsQuery(
      { projectId: currentProjectId, applicationId }, 
      { skip: !currentProjectId || !applicationId});
  const { data: modelsData = [] } = useGetModelsQuery(currentProjectId, 
      { skip: !currentProjectId || !applicationData?.id });
  const modelOptions = useMemo(() => getIntegrationOptions(modelsData, ['chat_completion', 'completion']), [modelsData]);
  const initialValues = useMemo(() => {
    const newModelSettings = getModelSettings(modelsData, applicationData)
    return {
      ...applicationData,
      version_details: {
        ...applicationData?.version_details,
        model_settings: {
          ...applicationData?.version_details?.model_settings,
          ...newModelSettings
        }
      }
    }
  }, [applicationData, modelsData])
  return {
    isFetching,
    modelOptions,
    initialValues,
  }
}

export default useApplicationInitialValues;