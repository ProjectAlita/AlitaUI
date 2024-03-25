import { useApplicationDetailsQuery } from "@/api/applications.js";
import { useGetModelsQuery } from '@/api/integrations';
import {
  CapabilityTypes,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_K,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants.js';
import { getIntegrationData, getIntegrationOptions } from "@/pages/DataSources/utils.js";
import { useProjectId, useSelectedProjectId } from "@/pages/hooks.jsx";
import { useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

const applicationCapabilities = [CapabilityTypes.chat_completion.value]

const getModelSettings = (data = [], applicationData) => {
  const matchedData = getIntegrationData(data, applicationCapabilities)
  const { model_settings } = applicationData?.version_details || {};
  let integrationUid = model_settings?.model?.integration_uid;
  let targetData = matchedData.find((item) => item?.uid === integrationUid);

  if (!targetData) {
    targetData = matchedData?.[0]
    integrationUid = matchedData?.[0]?.uid
  }

  if (targetData) {
    const newModelSettings = {
      max_tokens: model_settings?.max_tokens ?? DEFAULT_MAX_TOKENS,
      top_p: model_settings?.top_p ?? (targetData.settings?.top_p || DEFAULT_TOP_P),
      top_k: model_settings?.top_k ?? (targetData.settings?.top_k || DEFAULT_TOP_K),
      temperature: model_settings?.temperature ?? (targetData.settings?.temperature || DEFAULT_TEMPERATURE),
      model: {
        [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
        [PROMPT_PAYLOAD_KEY.modelName]: model_settings?.model?.model_name,
      }
    }

    const models = targetData?.settings?.models || [];
    if (models.length && !models.find(model => model === model_settings?.model?.model_name)) {
      const matchedModel = models?.find(model => model.capabilities.chat_completion);
      newModelSettings.model.model_name = matchedModel?.id
    }
    return newModelSettings
  }
  return {}
}

export const useCreateApplicationInitialValues = () => {
  const selectedProjectId = useSelectedProjectId();
  const { data: modelsData = [] } = useGetModelsQuery(selectedProjectId,
    { skip: !selectedProjectId });
  const modelOptions = useMemo(() => getIntegrationOptions(modelsData, applicationCapabilities), [modelsData]);
  const initialValues = useMemo(() => ({
    name: '', 
    description: '', 
    type: 'interface',
    versions: [
      {
        name: 'latest',
        tags: []
      }
    ],
    version_details: { 
      application_settings: { 
        conversation_starters: []
      },
      model_settings: getModelSettings(modelsData),
      instructions: '',
      variables: [],
    },
    tools: [],
  }), [modelsData])
  return {
    modelOptions,
    initialValues
  }
}

export const useFormikFormRef = () => {
  const formRef = useRef();
  const getFormValues = useCallback(() => formRef?.current?.values || {}, []);
  const resetFormValues = useCallback(() => formRef.current?.resetForm(), []);
  return {
    formRef, 
    getFormValues,
    resetFormValues
  }
}

const useApplicationInitialValues = () => {
  const currentProjectId = useProjectId()
  const { applicationId } = useParams();
  const { data: applicationData = {}, isFetching } =
    useApplicationDetailsQuery(
      { projectId: currentProjectId, applicationId },
      { skip: !currentProjectId || !applicationId });
  const { data: modelsData = [] } = useGetModelsQuery(currentProjectId,
    { skip: !currentProjectId || !applicationData?.id });
  const modelOptions = useMemo(() => getIntegrationOptions(modelsData, applicationCapabilities), [modelsData]);
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