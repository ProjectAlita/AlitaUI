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
import { useProjectId, useSelectedProjectId } from "@/pages/hooks.jsx";
import { useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";


const getModelSettings = (data = [], applicationData) => {
  const { model_settings } = applicationData?.version_details || {};

  const integrationUid = model_settings?.model?.integration_uid || data[0]?.uid;
  const targetData = data.find((item) => item?.uid === integrationUid) || data[0];
  if (targetData) {
    const newModelSettings = {
      max_tokens: model_settings?.max_tokens ?? DEFAULT_MAX_TOKENS,
      top_p: model_settings?.top_p ?? (targetData.settings?.top_p || DEFAULT_TOP_P),
      top_k: model_settings?.top_k ?? (targetData.settings?.top_k || DEFAULT_TOP_K),
      temperature: model_settings?.temperature ?? (targetData.settings?.temperature || DEFAULT_TEMPERATURE),
      model: {
        [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
        [PROMPT_PAYLOAD_KEY.integrationName]: model_settings?.model?.integration_name || targetData.name,
        [PROMPT_PAYLOAD_KEY.modelName]: model_settings?.model?.name,
      }
    }

    const models = targetData?.settings?.models || [];
    if (models.length && !models.find(model => model === model_settings?.model?.name)) {
      const matchedModel = models?.find(model => model.capabilities.chat_completion);
      newModelSettings.model.name = matchedModel?.id
    }
    return newModelSettings
  }
  return {}
}

export const useCreateApplicationInitialValues = () => {
  const selectedProjectId = useSelectedProjectId();
  const { data: modelsData = [] } = useGetModelsQuery(selectedProjectId,
    { skip: !selectedProjectId });
  const modelOptions = useMemo(() => getIntegrationOptions(modelsData, ['chat_completion', 'completion']), [modelsData]);
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
      model_settings: {
        temperature: DEFAULT_TEMPERATURE,
        max_tokens: DEFAULT_MAX_TOKENS,
        top_p: DEFAULT_TOP_P,
        top_k: DEFAULT_TOP_K,
        model: {
          name: '',
          integration_uid: '',
        }
      },
      instructions: '',
      variables: [],
    },
    tools: [],
  }), [])
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