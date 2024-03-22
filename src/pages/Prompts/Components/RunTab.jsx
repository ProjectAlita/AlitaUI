import { useGetModelsQuery } from '@/api/integrations';
import {
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
  VariableSources,
  ViewMode,
} from '@/common/constants.js';
import BasicAccordion from '@/components/BasicAccordion';
import ChatBox from '@/components/ChatBox/ChatBox';
import StyledInputEnhancer from '@/components/StyledInputEnhancer';
import { actions as promptSliceActions } from '@/slices/prompts';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ContentContainer,
  LeftGridItem,
  RightGridItem,
  StyledGridContainer,
} from './Common';
import AdvancedSettings from './Form/AdvancedSettings';
import FileReaderEnhancer from './Form/FileReaderInput';
import Messages from './Form/Messages';
import ModelSettings from './Form/ModelSettings';
import TagEditor from './Form/TagEditor';
import VariableList from './Form/VariableList';
import { useIsSmallWindow, useProjectId, useSelectedProjectId, useUpdateCurrentPrompt, useUpdateVariableList, useViewMode } from '../../hooks';
import { useTagListQuery } from '@/api/prompts';
import { useTheme } from '@emotion/react';
import ProjectSelect, { ProjectSelectShowMode } from '../../MyLibrary/ProjectSelect';
import NameDescriptionReadOnlyView from '@/components/NameDescriptionReadOnlyView';
import { getIntegrationOptions } from "@/pages/DataSources/utils.js";
import { validateVariableSyntax } from './validatePrompt';

const LeftContent = ({ isCreateMode, onChangePrompt, currentVersionId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const viewMode = useViewMode();
  const validationError = useSelector((state) => state.prompts.validationError);
  const isEditing = useSelector((state) => state.prompts.isEditing);
  const { currentPrompt } = useSelector((state) => state.prompts);
  const projectId = useProjectId();

  const { data: tagList = {} } = useTagListQuery({ projectId }, { skip: !projectId });
  const { tags: stateTags } = currentPrompt;
  const [updateCurrentPrompt] = useUpdateCurrentPrompt();
  const [name, setName] = useState(currentPrompt.name);
  const [description, setDescription] = useState(currentPrompt.description);
  const { error, helperText } = useMemo(() => viewMode !== ViewMode.Public ? validateVariableSyntax(currentPrompt?.prompt || '') : {}, [currentPrompt?.prompt, viewMode]);
  const onBlur = useCallback(
    (keyName) => () => {
      const value = keyName === PROMPT_PAYLOAD_KEY.name ? name : description;
      updateCurrentPrompt(keyName, value);
    },
    [description, name, updateCurrentPrompt],
  );
  const onChange = useCallback(
    (keyName) => (event) => {
      if (keyName === PROMPT_PAYLOAD_KEY.name) {
        setName(event.target.value);
        if (validationError?.name && event.target.value) {
          dispatch(promptSliceActions.setValidationError({}));

        }
      } else if (keyName === PROMPT_PAYLOAD_KEY.description) {
        setDescription(event.target.value);
      }
    },
    [dispatch, validationError?.name],
  );

  const onChangeTags = useCallback(
    (newTags) => {
      dispatch(
        promptSliceActions.updateCurrentPromptData({
          key: PROMPT_PAYLOAD_KEY.tags,
          data: newTags,
        })
      );
    },
    [dispatch],
  );

  const onClickEdit = useCallback(
    () => {
      dispatch(promptSliceActions.setIsEditing(true));
    },
    [dispatch],
  )
  const [updateVariableList] = useUpdateVariableList(VariableSources.Context);

  return <>
    <BasicAccordion
      items={[
        {
          title: 'General',
          content: (
            <div>
              {isCreateMode ?
                <>
                  <ProjectSelect
                    label={'Project'}
                    customSelectedColor={`${theme.palette.text.secondary} !important`}
                    showMode={ProjectSelectShowMode.NormalMode}
                    selectSX={{
                      borderBottom: `1px solid ${theme.palette.border.lines}`,
                      margin: '12px 0 4px 0 !important',
                    }}
                    inputSX={{
                      '& .MuiSelect-select': {
                        paddingLeft: '12px'
                      }
                    }}
                    disabled={!isCreateMode}
                  />
                  <StyledInputEnhancer
                    autoComplete="off"
                    id='prompt-name'
                    label={isCreateMode ? 'Name *' : 'Name'}
                    error={!!validationError?.name}
                    helperText={validationError?.name}
                    disabled={!isCreateMode}
                    onChange={onChange(PROMPT_PAYLOAD_KEY.name)}
                    onBlur={onBlur(PROMPT_PAYLOAD_KEY.name)}
                    value={name}
                  />
                  <StyledInputEnhancer
                    onChange={onChange(PROMPT_PAYLOAD_KEY.description)}
                    onBlur={onBlur(PROMPT_PAYLOAD_KEY.description)}
                    value={description}
                    showexpandicon='true'
                    id='prompt-desc'
                    label={'Description'}
                    multiline
                    disabled={!isCreateMode}
                    maxRows={15}
                  />
                  <TagEditor
                    id='prompt-tags'
                    label='Tags'
                    tagList={tagList}
                    stateTags={stateTags}
                    disabled={viewMode !== ViewMode.Owner}
                    onChangeTags={onChangeTags}
                  />
                </>
                :
                <>
                  <NameDescriptionReadOnlyView
                    name={name}
                    description={description}
                    showProjectSelect={false}
                    sx={{ marginBottom: stateTags?.length ? '8px' : '0' }}
                    tags={isEditing ? undefined : stateTags}
                    canEdit={viewMode === ViewMode.Owner && !isEditing}
                    onClickEdit={onClickEdit}
                    id={currentPrompt.id}
                    idLabel='Prompt ID:'
                    versionId={currentVersionId}
                    versionIdLabel='Version ID:'
                  />
                  {isEditing && <TagEditor
                    id='prompt-tags'
                    label='Tags'
                    tagList={tagList}
                    stateTags={stateTags}
                    disabled={viewMode !== ViewMode.Owner}
                    onChangeTags={onChangeTags}
                  />}
                </>
              }

            </div>
          ),
        }
      ]} />
    <BasicAccordion items={[
      {
        title: 'Context',
        content: (
          <div>
            <FileReaderEnhancer
              showexpandicon='true'
              id="prompt-context"
              placeholder='Input the context here'
              defaultValue={currentPrompt?.prompt}
              onChange={onChangePrompt(PROMPT_PAYLOAD_KEY.context)}
              updateVariableList={updateVariableList}
              label={null}
              multiline
              error={error}
              helperText={helperText}
            />
          </div>
        ),
      },
    ]} />
  </>
};

export const RightContent = ({
  variables,
  integration_uid,
  onChangeVariable,
  showAdvancedSettings,
  onOpenAdvancedSettings,
  onCloseAdvanceSettings,
  modelOptions,
  onChangeModel,
  onChangeSettings,
  isSmallWindow,
  settings,
}) => {

  return (
    <>
      {variables?.length > 0 ? <BasicAccordion
        style={{ marginBottom: '24px' }}
        items={[
          {
            title: 'Variables',
            content: (
              <div>
                <VariableList
                  variables={variables}
                  onChangeVariable={onChangeVariable}
                  showexpandicon='true'
                  multiline
                  collapseContent
                />
              </div>
            ),
          },
        ]}
      /> : null}
      {
        !showAdvancedSettings &&
        <ModelSettings
          settings={settings}
          onOpenAdvancedSettings={onOpenAdvancedSettings}
          modelOptions={modelOptions}
          onChangeModel={onChangeModel}
          onChangeTemperature={onChangeSettings(PROMPT_PAYLOAD_KEY.temperature)}
        />
      }
      {isSmallWindow && showAdvancedSettings && (
        <AdvancedSettings
          onCloseAdvanceSettings={onCloseAdvanceSettings}
          settings={settings}
          onChangeSettings={onChangeSettings}
          onChangeModel={onChangeModel}
          modelOptions={modelOptions}
          integration={integration_uid}
          sx={{ marginTop: '24px', paddingRight: '0px !important' }}
          itemSX={{ paddingRight: '0 !important' }}
        />
      )}
      <ChatBox {...settings} />
    </>
  );
};

const findModel = (uidModelMap, model_name) => {
  const uids = Object.keys(uidModelMap);
  uids.forEach((uid) => {
    const models = uidModelMap[uid].models;
    models.forEach(model => {
      if (model === model_name) {
        return {
          integration_uid: uid,
          integration_name: uidModelMap[uid].name,
          model_name,
        }
      }
    });
  })
  return {
    integration_uid: uids[0],
    integration_name: uidModelMap[uids[0]].name,
    model_name: uidModelMap[uids[0]].models[0],
  }
}

export default function RunTab({
  isCreateMode,
}) {
  const dispatch = useDispatch();
  const viewMode = useViewMode();
  const {
    currentPrompt: {
      integration_uid,
      integration_name,
      model_name,
      max_tokens = DEFAULT_MAX_TOKENS,
      temperature = DEFAULT_TEMPERATURE,
      top_p = DEFAULT_TOP_P,
      id: prompt_id,
      prompt: context = '',
      messages = [],
      variables = [],
      top_k,
      type = '', },
    versions,
    currentVersionFromDetail
  } = useSelector(state => state.prompts);

  const firstRender = useRef(true);
  const selectedProjectId = useSelectedProjectId();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.5 : 6),
    [showAdvancedSettings]
  );
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
        dispatch(
          promptSliceActions.updateCurrentPromptData({
            key: PROMPT_PAYLOAD_KEY.integrationUid,
            data: data[0].uid,
          })
        );
        dispatch(
          promptSliceActions.setCurrentPromptDataSnapshot({
            [PROMPT_PAYLOAD_KEY.integrationUid]: data[0].uid
          })
        );
      }
      if (viewMode === ViewMode.Public && 
        Object.keys(uidModelMap).length && 
        !Object.keys(uidModelMap).includes(integration_uid)) {
        const foundModel = findModel(uidModelMap, model_name)
        dispatch(
          promptSliceActions.batchUpdateCurrentPromptData({
            [PROMPT_PAYLOAD_KEY.integrationUid]: foundModel.integration_uid,
            [PROMPT_PAYLOAD_KEY.integrationName]: foundModel.integration_name,
            [PROMPT_PAYLOAD_KEY.modelName]: foundModel.model_name,
          })
        );
      }
    }
  }, [data, dispatch, integration_uid, isSuccess, model_name, viewMode]);

  useEffect(() => {
    const updateBody = {};

    if (integration_uid && uidModelSettingsMap[integration_uid]) {
      const models = uidModelSettingsMap[integration_uid].models || [];

      if (models.length && !models.find(model => model === model_name)) {
        updateBody[PROMPT_PAYLOAD_KEY.modelName] = models[0];
      }

      if (temperature === null || temperature === undefined) {
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
        dispatch(
          promptSliceActions.batchUpdateCurrentPromptData(updateBody)
        );
        dispatch(
          promptSliceActions.setCurrentPromptDataSnapshot(updateBody)
        );
      }
      firstRender.current = false;
    }
  }, [
    dispatch,
    uidModelSettingsMap,
    integration_uid,
    model_name,
    temperature,
    max_tokens,
    top_p,
    integration_name
  ]);

  const onOpenAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings(true);
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

  const onChangeVariable = useCallback((label, newValue) => {
    dispatch(
      promptSliceActions.updateSpecificVariable({
        key: PROMPT_PAYLOAD_KEY.variables,
        updateKey: label,
        data: newValue,
      })
    );
  }, [dispatch])

  const onChangeModel = useCallback(
    (integrationUid, model, integrationName) => {
      dispatch(
        promptSliceActions.batchUpdateCurrentPromptData({
          [PROMPT_PAYLOAD_KEY.integrationUid]: integrationUid,
          [PROMPT_PAYLOAD_KEY.integrationName]: integrationName,
          [PROMPT_PAYLOAD_KEY.modelName]: model,
        })
      );
    },
    [dispatch]
  );

  const settings = useMemo(() => {
    const currentVersionId = versions?.find(i => i.name === currentVersionFromDetail)?.id
    return {
      prompt_id,
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
      currentVersionId
    }
  }, [
    prompt_id,
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
    versions,
    currentVersionFromDetail
  ]);

  return (
    <StyledGridContainer sx={{ paddingBottom: '10px' }} columnSpacing={'32px'} container>
      <LeftGridItem item xs={12} lg={lgGridColumns}>
        <ContentContainer>
          <LeftContent isCreateMode={isCreateMode} currentVersionId={settings.currentVersionId} onChangePrompt={onChange} />
          <Messages />
        </ContentContainer>
      </LeftGridItem>
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
    </StyledGridContainer>
  );
}
