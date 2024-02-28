/* eslint react/jsx-no-bind: 0 */
import { Grid } from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import DataSets from "@/pages/DataSources/Components/DataSets.jsx";
import { useDatasourceEditMutation, useLazyDatasourceDetailsQuery } from "@/api/datasources.js";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer } from "@/pages/EditPrompt/Common.jsx";
import DatasourceEditForm from './Components/DatasourceEditForm';
import DataSourceDetailToolbar from './Components/DataSourceDetailToolbar';
import DataSourceView from './Components/DataSourceView';
import { useFormik } from 'formik';
import EditDataSourceTabBar from './Components/EditDataSourceTabBar';
import getValidateSchema from './Components/dataSourceVlidateSchema';
import { DEFAULT_CUT_OFF_SCORE, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE, DEFAULT_TOP_K, DEFAULT_TOP_P } from '@/common/constants';
import DatasourceOperationPanel from './Components/DatasourceOperationPanel';
import { useTheme } from '@emotion/react';
import { useSelectedProjectId } from "@/pages/hooks.jsx";
import useToast from '@/components/useToast';
import { buildErrorMessage } from '@/common/utils';
import { useSelector } from 'react-redux';

const supportEdit = true;

const EditDatasource = () => {
  const theme = useTheme();
  const { datasourceId } = useParams()
  const projectId = useSelectedProjectId()
  const currentProjectId = useSelectedProjectId()
  const { id: author_id } = useSelector((state => state.user));

  const currentVersionName = 'latest';
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const [saveFn, { isError, isSuccess, error, isLoading, reset }] = useDatasourceEditMutation();
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [context, setContext] = useState('');
  const [chatSettings, setChatSettings] = useState({
    chat_model: {
      model_name: '',
      integration_uid: '',
      integration_name: '',
    },
    embedding_model: {
      model_name: '',
      integration_uid: '',
      integration_name: '',
    },
    temperature: DEFAULT_TEMPERATURE,
    top_p: DEFAULT_TOP_P,
    top_k: DEFAULT_TOP_K,
    max_length: DEFAULT_MAX_TOKENS,
  });

  const hasChatSettingChanged = useMemo(() => {
    try {
      return datasourceData?.version_details?.datasource_settings?.chat &&
        JSON.stringify(datasourceData?.version_details?.datasource_settings?.chat) !== JSON.stringify(chatSettings);
    } catch (e) {
      return true;
    }
  }, [chatSettings, datasourceData?.version_details?.datasource_settings?.chat]);

  const onCloseToast = useCallback(
    () => {
      if (isSuccess) {
        fetchFn({ projectId: currentProjectId, datasourceId }, false)
      }
      reset();
    },
    [currentProjectId, datasourceId, fetchFn, isSuccess, reset],
  )

  const { ToastComponent: Toast, toastSuccess, toastError } = useToast(undefined, onCloseToast);

  useEffect(() => {
    if (isError) {
      toastError(buildErrorMessage(error));
    }
  }, [error, isError, toastError])

  useEffect(() => {
    if (isSuccess) {
      toastSuccess('The datasource has been updated');
    }
  }, [isSuccess, toastSuccess])

  const onChangeChatSettings = useCallback(
    (field, value) => {
      setChatSettings({
        ...chatSettings,
        [field]: value,
      })
    },
    [chatSettings],
  )
  const [searchSettings, setSearchSettings] = useState({
    embedding_model: {
      model_name: '',
      integration_uid: '',
      integration_name: '',
    },
    top_k: DEFAULT_TOP_K,
    cut_off_score: DEFAULT_CUT_OFF_SCORE,
  });
  const hasSearchSettingChanged = useMemo(() => {
    try {
      return datasourceData?.version_details?.datasource_settings?.search &&
        JSON.stringify(datasourceData?.version_details?.datasource_settings?.search) !== JSON.stringify(searchSettings);
    } catch (e) {
      return true;
    }
  }, [searchSettings, datasourceData?.version_details?.datasource_settings?.search]);
  const onChangeSearchSettings = useCallback(
    (field, value) => {
      setSearchSettings({
        ...searchSettings,
        [field]: value,
      })
    },
    [searchSettings],
  )

  const [deduplicateSettings, setDeduplicateSettings] = useState({
    embedding_model: {
      model_name: '',
      integration_uid: '',
      integration_name: '',
    },
    cut_off_score: DEFAULT_CUT_OFF_SCORE,
    generate_file: false,
  });
  const hasDeduplicateSettingChanged = useMemo(() => {
    try {
      return datasourceData?.version_details?.datasource_settings?.deduplicate &&
        JSON.stringify(datasourceData?.version_details?.datasource_settings?.deduplicate) !== JSON.stringify(deduplicateSettings);
    } catch (e) {
      return true;
    }
  }, [deduplicateSettings, datasourceData?.version_details?.datasource_settings?.deduplicate]);
  const onChangeDeduplicateSettings = useCallback(
    (field, value) => {
      setDeduplicateSettings({
        ...deduplicateSettings,
        [field]: value,
      })
    },
    [deduplicateSettings],
  )

  useEffect(() => {
    if (datasourceData?.version_details?.datasource_settings?.chat) {
      setChatSettings(datasourceData?.version_details?.datasource_settings?.chat)
    }
    if (datasourceData?.version_details?.datasource_settings?.search) {
      setSearchSettings(datasourceData?.version_details?.datasource_settings?.search)
    }
    if (datasourceData?.version_details?.datasource_settings?.deduplicate) {
      setDeduplicateSettings(datasourceData?.version_details?.datasource_settings?.deduplicate);
    }
    if (datasourceData?.version_details?.context) {
      setContext(datasourceData?.version_details?.context);
    }
  }, [
    datasourceData?.version_details?.datasource_settings?.chat,
    datasourceData?.version_details?.datasource_settings?.search,
    datasourceData?.version_details?.datasource_settings?.deduplicate,
    datasourceData?.version_details?.context,
  ])

  const [isEditing, setIsEditing] = useState(false)
  const formik = useFormik({
    initialValues: datasourceData,
    enableReinitialize: true,
    validationSchema: getValidateSchema,
    onSubmit: () => {

    }
  })

  const hasChangedTheDataSource = useMemo(() => {
    try {
      return datasourceData && JSON.stringify(formik.values) !== JSON.stringify(datasourceData);
    } catch (e) {
      return true;
    }
  }, [datasourceData, formik.values]);

  const hasChanged = useMemo(() =>
    context !== datasourceData?.version_details?.context ||
    hasChangedTheDataSource ||
    hasChatSettingChanged ||
    hasDeduplicateSettingChanged ||
    hasSearchSettingChanged,
    [
      context,
      datasourceData?.version_details?.context,
      hasChangedTheDataSource,
      hasChatSettingChanged,
      hasDeduplicateSettingChanged,
      hasSearchSettingChanged])

  const onEdit = useCallback(() => {
    setIsEditing(true);
  }, [])

  const onClickAdvancedSettings = useCallback(
    () => {
      setShowAdvancedSettings(prev => !prev);
    },
    [],
  )
  const onCloseAdvanceSettings = useCallback(
    () => {
      setShowAdvancedSettings(false);
    },
    [],
  )
  const onSave = useCallback(
    async () => {
      if (!chatSettings.embedding_model.model_name) {
        toastError('The embedding model of Chat is required');
        return;
      } else if (!chatSettings.chat_model.model_name) {
        toastError('The chat model of Chat is required');
        return;
      } else if (!searchSettings.embedding_model.model_name) {
        toastError('The embedding model of Search is required');
        return;
      } else if (!deduplicateSettings.embedding_model.model_name) {
        toastError('The embedding model of Deduplicate is required');
        return;
      }  
      
      await saveFn({
        id: formik.values?.id,
        owner_id: formik.values?.owner_id,
        name: formik.values?.name,
        description: formik.values?.description,
        storage: formik.values?.storage,
        projectId,
        embedding_model: formik.values?.embedding_model,
        embedding_model_settings: formik.values?.embedding_model_settings,
        versions: [
          {
            author_id,
            name: currentVersionName,
            context,
            datasource_settings: {
              chat: {
                embedding_model: chatSettings.embedding_model.model_name ? chatSettings.embedding_model : undefined,
                top_k: chatSettings.top_k,
                top_p: chatSettings.top_p,
                chat_model: chatSettings.chat_model.model_name ? chatSettings.chat_model : undefined,
                temperature: chatSettings.temperature,
                max_length: chatSettings.max_length,
              },
              search: {
                embedding_model: searchSettings.embedding_model.model_name ? searchSettings.embedding_model : undefined,
                top_k: searchSettings.top_k,
                cut_off_score: searchSettings.cut_off_score
              },
              deduplicate: {
                embedding_model: deduplicateSettings.embedding_model.model_name ? deduplicateSettings.embedding_model : undefined,
                cut_off_score: deduplicateSettings.cut_off_score
              }
            }
          }
        ]
      });
    },
    [
      toastError,
      author_id,
      formik.values?.id,
      formik.values?.owner_id,
      formik.values?.name,
      formik.values?.description,
      formik.values?.embedding_model,
      formik.values?.embedding_model_settings,
      formik.values?.storage,
      context,
      chatSettings.embedding_model,
      chatSettings.top_k,
      chatSettings.top_p,
      chatSettings.chat_model,
      chatSettings.temperature,
      chatSettings.max_length,
      searchSettings.embedding_model,
      searchSettings.top_k,
      searchSettings.cut_off_score,
      deduplicateSettings.embedding_model,
      deduplicateSettings.cut_off_score,
      projectId,
      saveFn],
  )
  const onDiscard = useCallback(
    () => {
      formik.resetForm();
      setIsEditing(false);
    },
    [formik],
  )

  const leftLgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.5 : 6),
    [showAdvancedSettings]
  );
  useEffect(() => {
    currentProjectId && datasourceId && fetchFn({ projectId: currentProjectId, datasourceId }, true)
  }, [currentProjectId, datasourceId, fetchFn])

  return (
    <>
      <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
        <Grid item xs={12} >
          <StyledTabs
            tabSX={{ paddingX: '24px' }}
            tabs={[{
              label: 'Run',
              icon: <RocketIcon />,
              tabBarItems: supportEdit ?
                <EditDataSourceTabBar
                  isSaving={isLoading}
                  hasChangedTheDataSource={hasChanged}
                  onSave={onSave}
                  onDiscard={onDiscard}
                /> : null,
              rightToolbar: isFetching ? null : <DataSourceDetailToolbar name={datasourceData?.name} />,
              content:
                isFetching ? <PromptDetailSkeleton /> :
                  <StyledGridContainer container columnSpacing={'32px'}
                    sx={{
                      paddingX: '24px',
                      marginTop: '32px',
                      [theme.breakpoints.down('lg')]: {
                        height: 'calc(100vh - 170px)',
                      }
                    }}>
                    <Grid item xs={12} lg={leftLgGridColumns}>
                      <ContentContainer sx={{
                        [theme.breakpoints.up('lg')]: {
                          height: 'calc(100vh - 170px)',
                        }
                      }}>
                        {
                          !isEditing ?
                            <DataSourceView
                              currentDataSource={datasourceData}
                              canEdit={supportEdit}
                              onEdit={onEdit}
                              context={context}
                              onChangeContext={(event) => setContext(event.target.value)}
                            />
                            :
                            <DatasourceEditForm
                              formik={formik}
                              context={context}
                              onChangeContext={(event) => setContext(event.target.value)}
                            />
                        }
                        <DataSets
                          datasetItems={datasourceData?.version_details?.datasets || []}
                          datasourceId={datasourceId}
                          datasourceVersionId={datasourceData?.version_details?.id}
                        />
                      </ContentContainer>
                    </Grid>
                    <Grid
                      sx={{
                        marginTop: {
                          xs: '32px',
                          lg: '0px'
                        }
                      }} item xs={12} lg={12 - leftLgGridColumns}>
                      <ContentContainer sx={{ width: '100%' }}>
                        <DatasourceOperationPanel
                          chatSettings={chatSettings}
                          onChangeChatSettings={onChangeChatSettings}
                          searchSettings={searchSettings}
                          onChangeSearchSettings={onChangeSearchSettings}
                          deduplicateSettings={deduplicateSettings}
                          onChangeDeduplicateSettings={onChangeDeduplicateSettings}
                          showAdvancedSettings={showAdvancedSettings}
                          onClickAdvancedSettings={onClickAdvancedSettings}
                          onCloseAdvanceSettings={onCloseAdvanceSettings}
                          versionId={datasourceData?.version_details?.id}
                          context={context}
                        />
                      </ContentContainer>
                    </Grid>
                  </StyledGridContainer>,
            }, {
              label: 'Test',
              tabBarItems: null,
              content: <></>,
              display: 'none',
            }]}
          />
        </Grid>
      </Grid>
      <Toast />
    </>
  )
}
export default EditDatasource