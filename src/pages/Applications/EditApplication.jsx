/* eslint react/jsx-no-bind: 0 */
import { useLazyApplicationDetailsQuery } from "@/api/applications.js";
import { useGetModelsQuery } from '@/api/integrations';
import {
  ChatBoxMode,
  DEFAULT_MAX_TOKENS,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  PROMPT_PAYLOAD_KEY,
  ViewMode
} from '@/common/constants.js';
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import StyledTabs from "@/components/StyledTabs.jsx";
import { getIntegrationOptions } from "@/pages/DataSources/utils.js";
import { ContentContainer, LeftGridItem, PromptDetailSkeleton, RightGridItem, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import { useIsSmallWindow, useProjectId, useSelectedProjectId, useViewMode } from "@/pages/hooks.jsx";
import { Grid } from "@mui/material";
import { Form, Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";
import AdvancedSettings from "../Prompts/Components/Form/AdvancedSettings.jsx";
import { RightContent } from "../Prompts/Components/RunTab.jsx";
import ApplicationContext from './Components/Applications/ApplicationContext.jsx';
import ApplicationDetailToolbar from './Components/Applications/ApplicationDetailToolbar';
import ApplicationEditForm from './Components/Applications/ApplicationEditForm';
import ApplicationEnvironment from "./Components/Applications/ApplicationEnvironment.jsx";
import ApplicationView from './Components/Applications/ApplicationView';
import EditApplicationTabBar from './Components/Applications/EditApplicationTabBar';
import getValidateSchema from './Components/Applications/applicationValidateSchema';
import { initialChatSettings } from './constants.js';
import useHasApplicationChanged from './useHasApplicationChanged.js';


const RightColumns = ({
  setInitialValues,
  setShowAdvancedSettings,
  lgGridColumns,
  showAdvancedSettings,
}) => {
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
    model: {
      name: model_name,
      integration_uid,
      integration_name,
    },
    max_tokens = DEFAULT_MAX_TOKENS,
    temperature = DEFAULT_TEMPERATURE,
    top_p = DEFAULT_TOP_P,
    top_k,
  } = model_settings;

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


const EditApplication = () => {
  const { applicationId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  // const [fetchFn, { data: applicationData, isFetching }] = useLazyApplicationDetailsQuery();
  const [fetchFn, { isFetching }] = useLazyApplicationDetailsQuery();

  const applicationData = useMemo(() => ({
    id: 1,
    icon: 'https://cdn-icons-png.flaticon.com/512/4330/4330030.png',
    name: '[Mock] application name',
    description: '[Mock] application description',
    version_details: {
      id: 1,
      name: 'latest',
      instructions: '[Mock] instructions {{var1}}',
      tags: [],
      variables: [{
        key: 'var1',
        value: 'value1',
        id: 1
      }],
      environment: [],
      model_settings: {
        temperature: 0.8,
        top_k: 21,
        top_p: 0.6,
        max_tokens: 200,
        stream: false,
        model: {
          name: 'gpt-4',
          integration_uid: '28c69e26-7fb7-43f1-ad25-7fb443a5ffc3',
          integration_name: 'ai_dial'
        },
      },
    }
  }), [])
  const [initialValues, setInitialValues] = useState(applicationData)
  const [instructions, setInstructions] = useState('');
  const [chatSettings, setChatSettings] = useState(initialChatSettings);

  useEffect(() => {
    if (applicationData?.version_details?.application_settings?.chat) {
      setChatSettings(applicationData?.version_details?.application_settings?.chat)
    }
    if (applicationData?.version_details?.instructions) {
      setInstructions(applicationData?.version_details?.instructions);
    }
  }, [
    applicationData?.version_details?.application_settings?.chat,
    applicationData?.version_details?.application_settings?.search,
    applicationData?.version_details?.application_settings?.deduplicate,
    applicationData?.version_details?.instructions,
  ])

  const [isEditing, setIsEditing] = useState(false)

  const formRef = useRef();
  const getFormValues = useCallback(() => formRef?.current?.values || {}, []);

  const hasChangedTheApplication = useHasApplicationChanged(
    applicationData,
    formRef.current?.isDirty,
    instructions,
    chatSettings,
  );

  const onEdit = useCallback(() => {
    setIsEditing(true);
  }, [])

  const onDiscard = useCallback(
    () => {
      formRef.current?.resetForm();
      setChatSettings(applicationData?.version_details?.application_settings?.chat || initialChatSettings)
      setInstructions(applicationData?.version_details?.instructions || '');
      setIsEditing(false);
    },
    [applicationData?.version_details?.instructions, applicationData?.version_details?.application_settings?.chat],
  )

  useEffect(() => {
    currentProjectId && applicationId && fetchFn({ projectId: currentProjectId, applicationId }, true)
  }, [currentProjectId, applicationId, fetchFn])


  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.5 : 6),
    [showAdvancedSettings]
  );
  return (
    <>
      <Grid container sx={{ padding: '0.5rem 1.5rem', position: 'fixed', marginTop: '0.7rem' }}>
        <Grid item xs={12}>
          <StyledTabs
            tabs={[{
              label: 'Run',
              icon: <RocketIcon />,
              tabBarItems: viewMode === ViewMode.Owner ?
                <EditApplicationTabBar
                  getFormValues={getFormValues}
                  chatSettings={chatSettings}
                  onSuccess={() => setIsEditing(false)}
                  hasChangedTheApplication={hasChangedTheApplication}
                  onDiscard={onDiscard}
                  versionStatus={applicationData?.version_details?.status}
                  applicationId={applicationData?.id}
                /> : null,
              rightToolbar: isFetching ? null : <ApplicationDetailToolbar
                name={applicationData?.name}
                versions={applicationData?.version_details ? [applicationData?.version_details] : []}
                id={applicationData?.id}
                is_liked={applicationData?.is_liked}
                likes={applicationData?.likes || 0}
              />,
              content:
                isFetching ? <PromptDetailSkeleton sx={{ marginTop: '16px' }} /> :
                  <Formik
                    enableReinitialize
                    innerRef={formRef}
                    initialValues={initialValues}
                    validationSchema={getValidateSchema}
                    onSubmit={() => { }}
                  >
                    <Form>
                      <StyledGridContainer sx={{ paddingBottom: '10px', marginTop: '16px' }} columnSpacing={'32px'} container>
                        <LeftGridItem item xs={12} lg={lgGridColumns}>
                          <ContentContainer>
                            {
                              !isEditing ?
                                <ApplicationView
                                  currentApplication={applicationData}
                                  canEdit={viewMode === ViewMode.Owner}
                                  onEdit={onEdit}
                                />
                                :
                                <ApplicationEditForm />
                            }
                            <ApplicationContext style={{ marginTop: '16px' }} />
                            <ApplicationEnvironment style={{ marginTop: '16px' }} />
                          </ContentContainer>
                        </LeftGridItem>
                        <RightColumns
                          setInitialValues={setInitialValues}
                          lgGridColumns={lgGridColumns}
                          showAdvancedSettings={showAdvancedSettings}
                          setShowAdvancedSettings={setShowAdvancedSettings}
                        />
                      </StyledGridContainer>
                    </Form>
                  </Formik>,
            }, {
              label: 'Test',
              tabBarItems: null,
              content: <></>,
              display: 'none',
            }]}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default EditApplication