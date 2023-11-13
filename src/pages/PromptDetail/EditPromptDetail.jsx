import { useGetModelsQuery } from "@/api/integrations";
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
  SOURCE_PROJECT_ID
} from "@/common/constants.js";
import BasicAccordion from "@/components/BasicAccordion";
import Button from "@/components/Button";
import ChatBox from "@/components/ChatBox/ChatBox";
import SingleSelect from "@/components/SingleSelect";
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdvancedSettings from './AdvancedSettings';
import {
  LeftGridItem,
  RightGridItem,
  SelectLabel,
  StyledGridContainer,
  StyledInputEnhancer,
  TabBarItems,
  VersionSelectContainer
} from "./Common";
import FileReaderEnhancer from "./FileReaderInput";
import Messages from "./Messages";
import ModelSettings from './ModelSettings';
import VariableList from "./VariableList";

const LeftContent = () => {
  const validationError = useSelector((state) => state.prompts.validationError);
  return <BasicAccordion items={[
    {
      title: "General",
      content: (
        <div>
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.name}
            id="prompt-name"
            label="Name"
            error={!!validationError?.name}
            helperText={validationError?.name}
          />
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.description}
            id="prompt-desc"
            label="Description"
            multiline
          />
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.tags}
            id="prompt-tags"
            label="Tags"
            multiline
          />
        </div>
      ),
    },
    {
      title: "Context",
      content: (
        <div>
          <FileReaderEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.context}
            id="prompt-context"
            label="Context (??? hint or label)"
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
  } = useSelector(state => state.prompts.currentPrompt);

  return (
    <>
      <BasicAccordion
        items={[
          {
            title: "Variables",
            content: (
              <div>
                <VariableList
                  payloadkey={PROMPT_PAYLOAD_KEY.variables}
                  id="prompt-variables"
                  multiline
                />
              </div>
            ),
          },
        ]}
      />
      <ModelSettings
        onClickSettings={onClickSettings}
        modelOptions={modelOptions}
        showAdvancedSettings={showAdvancedSettings}
        onChangeModel={onChangeModel}
        onChangeTemperature={onChangeTemperature}
      />
      <ChatBox
        prompt_id={id}
        integration_uid={integration_uid}
        model_name={model_name}
        temperature={temperature}
        context={prompt}
        chat_history={messages}
        max_tokens={max_tokens}
        top_p={top_p}
        variables={variables}
      />
    </>
  );
};

export default function EditPromptDetail({ onSave }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { integration_uid } = useSelector(state => state.prompts.currentPrompt);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(() => showAdvancedSettings ? 4.75 : 6, [showAdvancedSettings]);
  const { isSuccess, data } = useGetModelsQuery(SOURCE_PROJECT_ID);
  const [modelOptions, setModelOptions] = useState([]);
  const [integrationOptions, setIntegrationOptions] = useState([]);
  const [integrationModelSettingsMap, setIntegrationModelSettingsMap] = useState({});

  useEffect(() => {
    if (isSuccess && data && data.length) {
      const options = data.map(item => ({ label: item.name, value: item.uid }));
      const map = data.reduce((accumulator, item) => {
        return {
          ...accumulator,
          [item.uid]: item.settings.models?.map(({ name, id }) => ({
            label: name,
            value: id
          })),
        };
      }, {});
      setIntegrationModelSettingsMap(map);
      setIntegrationOptions(options);
      dispatch(promptSliceActions.updateCurrentPromptData({
        key: PROMPT_PAYLOAD_KEY.integrationUid,
        data: options[0].value,
      }));
    }
  }, [data, dispatch, isSuccess]);

  useEffect(() => {
    if (integration_uid) {
      const options = integrationModelSettingsMap[integration_uid] || [];
      setModelOptions(options);
      if (options.length) {
        dispatch(promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.modelName,
          data: options[0].value,
        }));
      }
    }
  }, [dispatch, integrationModelSettingsMap, integration_uid]);

  const onCancel = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const onClickSettings = useCallback(
    () => {
      setShowAdvancedSettings((prevValue) => !prevValue);
    },
    [],
  );

  const onCloseAdvanceSettings = useCallback(
    () => {
      setShowAdvancedSettings(false);
    },
    [],
  );

  const onChange = useCallback(
    (key) => (value) => {
      dispatch(promptSliceActions.updateCurrentPromptData({
        key,
        data: value,
      }))
    },
    [dispatch],
  );

  return (
    <StyledGridContainer container>
      <LeftGridItem item xs={12} lg={lgGridColumns}>
        <TabBarItems>
          <SelectLabel variant="body2">Version</SelectLabel>
          <VersionSelectContainer>
            <SingleSelect options={[]} />
          </VersionSelectContainer>
          <Button variant="contained" color="secondary" onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </TabBarItems>
        <LeftContent />
        <Messages />
      </LeftGridItem>
      <RightGridItem item xs={12} lg={lgGridColumns}>
        <RightContent
          onClickSettings={onClickSettings}
          modelOptions={modelOptions}
          showAdvancedSettings={showAdvancedSettings}
          onChangeModel={onChange(PROMPT_PAYLOAD_KEY.modelName)}
          onChangeTemperature={onChange(PROMPT_PAYLOAD_KEY.temperature)}
        />
      </RightGridItem>
      {
        showAdvancedSettings &&
        <AdvancedSettings
          onCloseAdvanceSettings={onCloseAdvanceSettings}
          modelOptions={modelOptions}
          integrationOptions={integrationOptions}
          integration={integration_uid}
        />
      }
    </StyledGridContainer>
  );
}
