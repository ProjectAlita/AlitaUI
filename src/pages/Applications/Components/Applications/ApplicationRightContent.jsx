import {
  ChatBoxMode,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY
} from '@/common/constants.js';
import { ContentContainer, RightGridItem } from "@/pages/Prompts/Components/Common.jsx";
import AdvancedSettings from "@/pages/Prompts/Components/Form/AdvancedSettings.jsx";
import { RightContent } from "@/pages/Prompts/Components/RunTab.jsx";
import { useIsSmallWindow } from "@/pages/hooks.jsx";
import { useFormikContext } from 'formik';
import { useCallback, useMemo } from "react";


export default function ApplicationRightContent({
  setShowAdvancedSettings,
  lgGridColumns,
  showAdvancedSettings,
  modelOptions
}) {
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
  } = modelObject;

  const { isSmallWindow } = useIsSmallWindow();

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
            modelOptions={modelOptions}
          />
        </ContentContainer>
      </RightGridItem>

      {showAdvancedSettings && !isSmallWindow && (
        <AdvancedSettings
          onCloseAdvanceSettings={onCloseAdvanceSettings}
          settings={settings}
          onChangeSettings={onChange}
          onChangeModel={onChangeModel}
          modelOptions={modelOptions}
        />
      )}
    </>
  )
}