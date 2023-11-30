import { useGetModelsQuery } from '@/api/integrations';
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
} from '@/common/constants.js';
import BasicAccordion from '@/components/BasicAccordion';
import ChatBox from '@/components/ChatBox/ChatBox';
import TagEditor from '@/pages/PromptDetail/TagEditor';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdvancedSettings from './AdvancedSettings';
import {
  ContentContainer,
  LeftGridItem,
  RightGridItem,
  StyledGridContainer,
  StyledInputEnhancer
} from './Common';
import FileReaderEnhancer from './FileReaderInput';
import Messages from './Messages';
import Comments from './Comments';
import ModelSettings from './ModelSettings';
import VariableList from './VariableList';

const LeftContent = ({ isCreateMode }) => {
  const validationError = useSelector((state) => state.prompts.validationError);
  return <BasicAccordion items={[
    {
      title: 'General',
      content: (
        <div>
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.name}
            id='prompt-name'
            label='Name'
            error={!!validationError?.name}
            helperText={validationError?.name}
            disabled={!isCreateMode}
          />
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.description}
            showexpandicon='true'
            id='prompt-desc'
            label='Description'
            multiline
            disabled={!isCreateMode}
          />
          <TagEditor id='prompt-tags' label='Tags' />
        </div>
      ),
    },
    {
      title: 'Context',
      content: (
        <div>
          <FileReaderEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.context}
            showexpandicon='true'
            id="prompt-context"
            placeholder='Input the context here'
            label={null}
            multiline
          />
        </div>
      ),
    },
  ]} />
};

const RightContent = ({
  onClickSettings,
  modelOptions,
  showAdvancedSettings,
  onChangeModel,
  onChangeTemperature,
}) => {
  const {
    id,
    prompt = '',
    messages = [],
    variables = [],
    model_name = '',
    temperature = DEFAULT_TEMPERATURE,
    top_p = DEFAULT_TOP_P,
    max_tokens = DEFAULT_MAX_TOKENS,
    integration_uid,
    type = '',
  } = useSelector((state) => state.prompts.currentPrompt);

  return (
    <>
      <BasicAccordion
        items={[
          {
            title: 'Variables',
            content: (
              <div>
                <VariableList
                  payloadkey={PROMPT_PAYLOAD_KEY.variables}
                  showexpandicon='true'
                  multiline
                />
              </div>
            ),
          },
        ]}
      />
      {
        !showAdvancedSettings &&
        <ModelSettings
          onClickSettings={onClickSettings}
          modelOptions={modelOptions}
          showAdvancedSettings={showAdvancedSettings}
          onChangeModel={onChangeModel}
          onChangeTemperature={onChangeTemperature}
        />
      }
      <ChatBox
        prompt_id={id}
        integration_uid={integration_uid}
        model_name={model_name}
        temperature={temperature}
        context={prompt}
        messages={messages}
        max_tokens={max_tokens}
        top_p={top_p}
        variables={variables}
        type={type}
      />
    </>
  );
};

export default function EditPromptDetail({
  isCreateMode,
}) {
  const dispatch = useDispatch();
  const { integration_uid, model_name, max_tokens, temperature, top_p } = useSelector(state => state.prompts.currentPrompt);
  const { personal_project_id: privateProjectId } = useSelector(state => state.user);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.75 : 6),
    [showAdvancedSettings]
  );
  const { isSuccess, data } = useGetModelsQuery(privateProjectId, { skip: !privateProjectId});
  const [integrationModelSettingsMap, setIntegrationModelSettingsMap] =
    useState({});
  const [uidModelSettingsMap, setUidModelSettingsMap] =
    useState({});

  useEffect(() => {
    if (isSuccess && data && data.length) {
      const options = data.map((item) => ({
        label: item.name,
        value: item.uid,
      }));
      const configNameModelMap = data.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.config.name]: item.settings.models?.filter(
            (model) => model.capabilities.chat_completion).map(
              ({ name, id }) => ({
                label: name,
                value: id,
                group: item.uid,
              })),
        };
      }, {});
      setIntegrationModelSettingsMap(configNameModelMap);
      const uidModelMap = data.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.uid]: {
            model_name: item.settings?.model_name,
            max_tokens: item.settings?.max_tokens || DEFAULT_MAX_TOKENS,
            temperature: item.settings?.temperature || DEFAULT_TEMPERATURE,
            top_p: item.settings?.top_p || DEFAULT_TOP_P,
            models: item.settings?.models?.filter(
              (model) => model.capabilities.chat_completion).map(
                ({ id }) => id),
          },
        };
      }, {});
      setUidModelSettingsMap(uidModelMap);
      if (!integration_uid) {
        dispatch(
          promptSliceActions.updateCurrentPromptData({
            key: PROMPT_PAYLOAD_KEY.integrationUid,
            data: options[0].value,
          })
        );
      }
    }
  }, [data, dispatch, integration_uid, isSuccess]);

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

      if (!max_tokens) {
        updateBody[PROMPT_PAYLOAD_KEY.maxTokens] =
          uidModelSettingsMap[integration_uid].max_tokens || DEFAULT_MAX_TOKENS;
      }

      if (!top_p) {
        updateBody[PROMPT_PAYLOAD_KEY.topP] =
          uidModelSettingsMap[integration_uid].top_p || DEFAULT_TOP_P;
      }

      if (Object.keys(updateBody).length) {
        dispatch(
          promptSliceActions.batchUpdateCurrentPromptData(updateBody)
        );
      }
    }
  }, [dispatch, uidModelSettingsMap, integration_uid, model_name, temperature, max_tokens, top_p]);

  const onClickSettings = useCallback(() => {
    setShowAdvancedSettings((prevValue) => !prevValue);
  }, []);

  const onCloseAdvanceSettings = useCallback(() => {
    setShowAdvancedSettings(false);
  }, []);

  const onChange = useCallback(
    (key) => (value) => {
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key,
          data: value,
        })
      );
    },
    [dispatch]
  );

  const onChangeModel = useCallback(
    (integrationUid, model) => {
      dispatch(
        promptSliceActions.batchUpdateCurrentPromptData({
          [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
          [PROMPT_PAYLOAD_KEY.modelName]: model,
        })
      );
    },
    [dispatch]
  );

  return (
    <StyledGridContainer container>
      <LeftGridItem item xs={12} lg={lgGridColumns}>
        <ContentContainer>
          <LeftContent isCreateMode={isCreateMode} />
          <Messages />
          <Comments />
        </ContentContainer>
      </LeftGridItem>
      <RightGridItem item xs={12} lg={lgGridColumns}>
        <ContentContainer>
          <RightContent
            onClickSettings={onClickSettings}
            modelOptions={integrationModelSettingsMap}
            showAdvancedSettings={showAdvancedSettings}
            onChangeModel={onChangeModel}
            onChangeTemperature={onChange(PROMPT_PAYLOAD_KEY.temperature)}
          />
        </ContentContainer>
      </RightGridItem>
      {showAdvancedSettings && (
        <AdvancedSettings
          onCloseAdvanceSettings={onCloseAdvanceSettings}
          modelOptions={integrationModelSettingsMap}
          integration={integration_uid}
        />
      )}
    </StyledGridContainer>
  );
}
