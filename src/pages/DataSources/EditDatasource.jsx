/* eslint react/jsx-no-bind: 0 */
import { Grid } from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import DataSets from "./Components/Datasets/DataSets.jsx";
import { useLazyDatasourceDetailsQuery } from "@/api/datasources.js";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import DatasourceEditForm from './Components/Datasources/DatasourceEditForm';
import DataSourceDetailToolbar from './Components/Datasources/DataSourceDetailToolbar';
import DataSourceView from './Components/Datasources/DataSourceView';
import { useFormik } from 'formik';
import EditDataSourceTabBar from './Components/Datasources/EditDataSourceTabBar';
import getValidateSchema from './Components/Datasources/dataSourceVlidateSchema';
import DatasourceOperationPanel from './Components/Datasources/DatasourceOperationPanel';
import { useTheme } from '@emotion/react';
import { useProjectId, useViewMode } from "@/pages/hooks.jsx";
import useHasDataSourceChanged from './useHasDataSourceChanged.js';
import { initialChatSettings, initialDeduplicateSettings, initialSearchSettings } from './constants.js';
import { ViewMode } from '@/common/constants.js';

const EditDatasource = () => {
  const theme = useTheme();
  const { datasourceId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [context, setContext] = useState('');
  const [chatSettings, setChatSettings] = useState(initialChatSettings);

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

  const leftGridRef = useRef(null);
  const scrollToBottom = () => {
    if (leftGridRef.current) {
      leftGridRef.current.scrollTo({
        top: leftGridRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
        <Grid item xs={12} >
          <StyledTabs
            tabSX={{ paddingX: '24px' }}
            tabs={[{
              label: 'Run',
              icon: <RocketIcon />,
              tabBarItems: viewMode === ViewMode.Owner ?
                <EditDataSourceTabBar
                  formik={formik}
                  context={context}
                  chatSettings={chatSettings}
                  searchSettings={searchSettings}
                  deduplicateSettings={deduplicateSettings}
                  fetchFn={fetchFn}
                  onSuccess={() => setIsEditing(false)}
                  hasChangedTheDataSource={isEditing && hasChangedTheDataSource}
                  onDiscard={onDiscard}
                  versionStatus={datasourceData?.version_details?.status}
                  datasourceId={datasourceData?.version_details?.id}
                /> : null,
              rightToolbar: isFetching ? null : <DataSourceDetailToolbar name={datasourceData?.name} />,
              content:
                isFetching ? <PromptDetailSkeleton sx={{ marginTop: '16px' }} /> :
                  <StyledGridContainer container columnSpacing={'32px'}
                    sx={{
                      paddingX: '24px',
                      marginTop: '32px',
                      [theme.breakpoints.down('lg')]: {
                        height: 'calc(100vh - 170px)',
                      }
                    }}>
                    <Grid item xs={12} lg={leftLgGridColumns}>
                      <ContentContainer ref={leftGridRef} sx={{
                        [theme.breakpoints.up('lg')]: {
                          height: 'calc(100vh - 170px)',
                        }
                      }}>
                        {
                          !isEditing ?
                            <DataSourceView
                              currentDataSource={datasourceData}
                              canEdit={viewMode === ViewMode.Owner}
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
                          scrollToBottom={scrollToBottom}
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
    </>
  )
}
export default EditDatasource