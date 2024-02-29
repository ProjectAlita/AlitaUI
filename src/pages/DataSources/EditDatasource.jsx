/* eslint react/jsx-no-bind: 0 */
import { Grid } from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import DataSets from "./Components/Datasets/DataSets.jsx";
import { useDatasourceEditMutation, useLazyDatasourceDetailsQuery } from "@/api/datasources.js";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import DatasourceEditForm from './Components/Datasources/DatasourceEditForm';
import DataSourceDetailToolbar from './Components/Datasources/DataSourceDetailToolbar';
import DataSourceView from './Components/Datasources/DataSourceView';
import { useFormik } from 'formik';
import EditDataSourceTabBar from './Components/Datasources/EditDataSourceTabBar';
import getValidateSchema from './Components/Datasources/dataSourceVlidateSchema';
import DatasourceOperationPanel from './Components/Datasources/DatasourceOperationPanel';
import { useTheme } from '@emotion/react';
import { useSelectedProjectId } from "@/pages/hooks.jsx";
import useToast from '@/components/useToast';
import { buildErrorMessage } from '@/common/utils';
import { useSelector } from 'react-redux';
import useHasDataSourceChanged from './useHasDataSourceChanged.js';
import { initialChatSettings, initialDeduplicateSettings, initialSearchSettings } from './constants.js';

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
  const [chatSettings, setChatSettings] = useState(initialChatSettings);

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
  const [searchSettings, setSearchSettings] = useState(initialSearchSettings);
  const onChangeSearchSettings = useCallback(
    (field, value) => {
      setSearchSettings({
        ...searchSettings,
        [field]: value,
      })
    },
    [searchSettings],
  )

  const [deduplicateSettings, setDeduplicateSettings] = useState(initialDeduplicateSettings);
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

  const hasChangedTheDataSource = useHasDataSourceChanged(
    datasourceData,
    formik,
    context,
    searchSettings,
    deduplicateSettings,
    chatSettings,
  );

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
      await saveFn({
        id: formik.values?.id,
        owner_id: formik.values?.owner_id,
        name: formik.values?.name,
        description: formik.values?.description,
        storage: formik.values?.storage,
        projectId,
        embedding_model: formik.values?.embedding_model,
        embedding_model_settings: formik.values?.embedding_model_settings,
        version:
        {
          author_id,
          name: currentVersionName,
          id: datasourceData?.version_details?.id,
          context,
          tags: formik.values?.version_details?.tags || [],
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
      });
    },
    [
      datasourceData?.version_details?.id,
      author_id,
      formik.values?.id,
      formik.values?.owner_id,
      formik.values?.name,
      formik.values?.description,
      formik.values?.embedding_model,
      formik.values?.embedding_model_settings,
      formik.values?.storage,
      context,
      formik.values?.version_details?.tags,
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
                  hasChangedTheDataSource={isEditing && hasChangedTheDataSource}
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