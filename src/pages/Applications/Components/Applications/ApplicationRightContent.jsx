import { useGetModelsQuery } from '@/api/integrations';
import {
  ChatBoxMode,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants.js';
import { getIntegrationOptions } from "@/pages/DataSources/utils.js";
import { ContentContainer, RightGridItem } from "@/pages/Prompts/Components/Common.jsx";
import AdvancedSettings from "@/pages/Prompts/Components/Form/AdvancedSettings.jsx";
import { RightContent } from "@/pages/Prompts/Components/RunTab.jsx";
import { useIsSmallWindow, useSelectedProjectId } from "@/pages/hooks.jsx";
import { useFormikContext } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from 'react-redux';


export default function ApplicationRightContent ({
  setInitialValues,
  setShowAdvancedSettings,
  lgGridColumns,
  showAdvancedSettings,
}) {
  const dispatch = useDispatch();
  const { values: formValues, setFieldValue } = useFormikContext();
  const setFormValue = useCallback((key, value) => {
    setFieldValue('version_details.model_settings.' + key, value);
  }, [setFieldValue]);

  const {
    instructions: context = '',
    messages = [],
    variables = [],
    model_settings = {},
    type = ChatBoxMode.Chat,
  } = formValues?.version_details || {};

  const {
    model: modelObject = {},
    max_tokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    top_p = DEFAULT_TOP_P,
    top_k,
  } = model_settings;
  const {
    name: model_name,
    integration_uid,
    integration_name,
  } = modelObject;

  const firstRender = useRef(true);
  const selectedProjectId = useSelectedProjectId();
  const { isSmallWindow } = useIsSmallWindow();

  const { isSuccess, data } = useGetModelsQuery(selectedProjectId, { skip: !selectedProjectId });
  const [integrationModelSettingsMap, setIntegrationModelSettingsMap] =
    useState({});
  const [uidModelSettingsMap, setUidModelSettingsMap] =
    useState({});

  useEffect(() => {
    if (isSuccess && data && data.length) {
      const options = getIntegrationOptions(data, ['chat_completion', 'completion'])
      setIntegrationModelSettingsMap(options);
      const uidModelMap = data.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.uid]: {
            name: item.name,
            model_name: item.settings?.model_name,
            max_tokens: item.settings?.max_tokens || DEFAULT_MAX_TOKENS,
            temperature: item.settings?.temperature || DEFAULT_TEMPERATURE,
            top_p: item.settings?.top_p || DEFAULT_TOP_P,
            models: item.settings?.models?.filter(
              (model) => model.capabilities.chat_completion || model.capabilities.completion).map(
                ({ id }) => id),
          },
        };
      }, {});
      setUidModelSettingsMap(uidModelMap);
      if (!integration_uid) {
        setFormValue(
          PROMPT_PAYLOAD_KEY.integrationUid,
          data[0].uid
        );
        setInitialValues((prev) => ({
          ...prev,
          [PROMPT_PAYLOAD_KEY.integrationUid]: data[0].uid
        }))
      }
    }
  }, [data, dispatch, integration_uid, isSuccess, setFormValue, setInitialValues]);

  useEffect(() => {
    const updateBody = {};

    if (integration_uid && uidModelSettingsMap[integration_uid]) {
      const models = uidModelSettingsMap[integration_uid].models || [];

      if (models.length && !models.find(model => model === model_name)) {
        updateBody[PROMPT_PAYLOAD_KEY.modelName] = models[0];
      }

      if (!temperature) {
        updateBody[PROMPT_PAYLOAD_KEY.temperature] =
          uidModelSettingsMap[integration_uid].temperature || DEFAULT_TEMPERATURE;
      }

      if (!max_tokens && firstRender.current) {
        updateBody[PROMPT_PAYLOAD_KEY.maxTokens] =
          uidModelSettingsMap[integration_uid].max_tokens || DEFAULT_MAX_TOKENS;
      }

      if (top_p === undefined || top_p === null) {
        updateBody[PROMPT_PAYLOAD_KEY.topP] =
          uidModelSettingsMap[integration_uid].top_p || DEFAULT_TOP_P;
      }

      if (!integration_name) {
        updateBody[PROMPT_PAYLOAD_KEY.integrationName] = uidModelSettingsMap[integration_uid].name;
      }

      if (Object.keys(updateBody).length) {
        setInitialValues((prev) => ({
          ...prev,
          ...updateBody
        }))
      }
      firstRender.current = false;
    }
  }, [dispatch, uidModelSettingsMap, integration_uid, model_name, temperature, max_tokens, top_p, integration_name, setInitialValues]);

  const onOpenAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings(true);
  }, [setShowAdvancedSettings]);

  const onCloseAdvanceSettings = useCallback(() => {
    setShowAdvancedSettings(false);
  }, [setShowAdvancedSettings]);

  const onChangeVariable = useCallback((label, newValue) => {
    const updateIndex = Object.keys(variables).find(key => key === label);
    setFieldValue(`version_details.variables[${updateIndex}]`, newValue);
  }, [setFieldValue, variables])

  const onChange = useCallback(
    (key) => (value) => {
      setFormValue(key, value);
    },
    [setFormValue]
  );

  const onChangeModel = useCallback(
    (integrationUid, model, integrationName) => {
      setFormValue('model.' + PROMPT_PAYLOAD_KEY.integrationUid, integrationUid);
      setFormValue('model.' + PROMPT_PAYLOAD_KEY.integrationName, integrationName);
      setFormValue('model.name', model);
    },
    [setFormValue]
  );

  const settings = useMemo(() => ({
    prompt_id: 1,
    chatOnly: true,
    integration_uid,
    model_name,
    temperature,
    context,
    messages,
    max_tokens,
    top_p,
    top_k,
    variables,
    type,
  }), [
    integration_uid,
    model_name,
    temperature,
    context,
    messages,
    max_tokens,
    top_p,
    top_k,
    variables,
    type,
  ]);

  return (
    <>
      <RightGridItem item xs={12} lg={lgGridColumns}>
        <ContentContainer>
          <RightContent
            variables={variables}
            onChangeVariable={onChangeVariable}
            onOpenAdvancedSettings={onOpenAdvancedSettings}
            showAdvancedSettings={showAdvancedSettings}
            isSmallWindow={isSmallWindow}
            //below are props for advanced settings
            onCloseAdvanceSettings={onCloseAdvanceSettings}
            settings={settings}
            onChangeSettings={onChange}
            onChangeModel={onChangeModel}
            modelOptions={integrationModelSettingsMap}
          />
        </ContentContainer>
      </RightGridItem>

      {showAdvancedSettings && !isSmallWindow && (
        <AdvancedSettings
          onCloseAdvanceSettings={onCloseAdvanceSettings}
          settings={settings}
          onChangeSettings={onChange}
          onChangeModel={onChangeModel}
          modelOptions={integrationModelSettingsMap}
        />
      )}
    </>
  )
}