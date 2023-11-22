import { useGetModelsQuery } from '@/api/integrations';
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  LATEST_VERSION_NAME,
  PROMPT_PAYLOAD_KEY,
  SOURCE_PROJECT_ID
} from '@/common/constants.js';
import AlertDialog from '@/components/AlertDialog';
import BasicAccordion from '@/components/BasicAccordion';
import Button from '@/components/Button';
import ChatBox from '@/components/ChatBox/ChatBox';
import TagEditor from '@/pages/PromptDetail/TagEditor';
import { actions as promptSliceActions } from '@/reducers/prompts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import AdvancedSettings from './AdvancedSettings';
import {
  ContentContainer,
  LeftGridItem,
  RightGridItem,
  SaveButton,
  StyledGridContainer,
  StyledInputEnhancer,
  TabBarItems,
} from './Common';
import FileReaderEnhancer from './FileReaderInput';
import InputVersionDialog from './InputVersionDialog';
import Messages from './Messages';
import ModelSettings from './ModelSettings';
import VariableList from './VariableList';
import VersionSelect from './VersionSelect';

const LeftContent = ({ isCreating }) => {
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
            disabled={!isCreating}
          />
          <StyledInputEnhancer
            payloadkey={PROMPT_PAYLOAD_KEY.description}
            showexpandicon='true'
            id='prompt-desc'
            label='Description'
            multiline
            disabled={!isCreating}
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
                  id='prompt-variables'
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

export default function EditPromptDetail({ isCreating, onCreateNewVersion, onSave, currentVersionName = '', versions = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [showInputVersion, setShowInputVersion] = useState(false);
  const { integration_uid, model_name, max_tokens, temperature, top_p } = useSelector(state => state.prompts.currentPrompt);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.75 : 6),
    [showAdvancedSettings]
  );
  const { isSuccess, data } = useGetModelsQuery(SOURCE_PROJECT_ID);
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

  const onCancel = useCallback(() => {
    setOpenAlert(true);
  }, []);

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

  const onCloseAlert = useCallback(
    () => {
      setOpenAlert(false);
    },
    [],
  );

  const onConfirmDelete = useCallback(
    () => {
      onCloseAlert();
      navigate('/');
    },
    [navigate, onCloseAlert],
  );

  const onSaveVersion = useCallback(
    () => {
      setShowInputVersion(true);
    },
    [],
  );

  const onCancelShowInputVersion = useCallback(
    () => {
      setShowInputVersion(false);
    },
    [],
  );

  const onConfirmVersion = useCallback(
    () => {
      setShowInputVersion(false);
      onCreateNewVersion(newVersion);
    },
    [newVersion, onCreateNewVersion],
  );

  const onInputVersion = useCallback((event) => {
    const { target } = event;
    setNewVersion(target?.value);
  }, []);

  return (
    <StyledGridContainer container>
      <LeftGridItem item xs={12} lg={lgGridColumns}>
        <TabBarItems>
          <VersionSelect currentVersionName={currentVersionName} versions={versions} />
          {
            (!currentVersionName || currentVersionName === LATEST_VERSION_NAME)
            &&
            <SaveButton variant="contained" color="secondary" onClick={onSave}>
              Save
            </SaveButton>
          }
          <Button variant='contained' color='secondary' onClick={onCancel}>
            Cancel
          </Button>
          {
            !!versions.length &&
            <Button variant='contained' color='secondary' onClick={onSaveVersion}>
              Save As Version
            </Button>
          }
        </TabBarItems>
        <ContentContainer>
          <LeftContent isCreating={isCreating} />
          <Messages />
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
      <AlertDialog
        title='Warning'
        alertContent="Are you sure to drop the changes?"
        open={openAlert}
        onClose={onCloseAlert}
        onCancel={onCloseAlert}
        onConfirm={onConfirmDelete}
      />
      <InputVersionDialog
        open={showInputVersion}
        onCancel={onCancelShowInputVersion}
        onConfirm={onConfirmVersion}
        onChange={onInputVersion}
      />
    </StyledGridContainer>
  );
}
