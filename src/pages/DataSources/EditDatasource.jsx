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
import { initialDataSourceSettings } from './constants.js';
import { ViewMode } from '@/common/constants.js';
import DatasourceContext from './Components/Datasources/DatasourceContext.jsx';
import { updateObjectByPath } from '@/common/utils.jsx';

const EditDatasource = () => {
  const theme = useTheme();
  const { datasourceId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const [showAdvancedChatSettings, setShowAdvancedChatSettings] = useState(false);
  const [showAdvancedSearchSettings, setShowAdvancedSearchSettings] = useState(false);
  const [context, setContext] = useState('');
  const [dataSourceSettings, setDatasourceSettings] = useState(initialDataSourceSettings)
  const [chatHistory, setChatHistory] = useState([]);

  const onChangeDataSourceSettings = useCallback(
    (field, value) => {
      setDatasourceSettings((prevDataSourceSettings) => updateObjectByPath(prevDataSourceSettings, field, value))
    },
    [],
  )
  const [searchResult, setSearchResult] = useState({})

  const [deduplicateResult, setDeduplicateResult] = useState([]);

  useEffect(() => {
    if (datasourceData?.version_details?.datasource_settings) {
      if (datasourceData?.version_details?.datasource_settings?.chat?.chat_settings_ai) {
        onChangeDataSourceSettings('chat.chat_settings_ai', datasourceData?.version_details?.datasource_settings?.chat?.chat_settings_ai)
      }
      if (datasourceData?.version_details?.datasource_settings?.chat?.chat_settings_embedding) {
        onChangeDataSourceSettings('chat.chat_settings_embedding', datasourceData?.version_details?.datasource_settings?.chat?.chat_settings_embedding)
      }
      if (datasourceData?.version_details?.datasource_settings?.search?.chat_settings_embedding) {
        onChangeDataSourceSettings('search.chat_settings_embedding', datasourceData?.version_details?.datasource_settings?.search?.chat_settings_embedding)
      }
      if (datasourceData?.version_details?.datasource_settings?.deduplicate?.chat_settings_embedding) {
        onChangeDataSourceSettings('deduplicate.chat_settings_embedding', datasourceData?.version_details?.datasource_settings?.deduplicate?.chat_settings_embedding)
      }
      // setDatasourceSettings(datasourceData?.version_details?.datasource_settings)
    }
    if (datasourceData?.version_details?.context) {
      setContext(datasourceData?.version_details?.context);
    }
  }, [datasourceData?.version_details?.datasource_settings, datasourceData?.version_details?.context, onChangeDataSourceSettings])

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
    dataSourceSettings,
  );

  const onEdit = useCallback(() => {
    setIsEditing(true);
  }, [])

  const onClickAdvancedChatSettings = useCallback(
    () => {
      setShowAdvancedChatSettings(prev => !prev);
    },
    [],
  )
  const onCloseAdvancedChatSettings = useCallback(
    () => {
      setShowAdvancedChatSettings(false);
    },
    [],
  )
  const onClickAdvancedSearchSettings = useCallback(
    () => {
      setShowAdvancedSearchSettings(prev => !prev);
    },
    [],
  )
  const onCloseAdvancedSearchSettings = useCallback(
    () => {
      setShowAdvancedSearchSettings(false);
    },
    [],
  )
  const onDiscard = useCallback(
    () => {
      formik.resetForm();
      setDatasourceSettings(datasourceData?.version_details?.datasource_settings || initialDataSourceSettings)
      setContext(datasourceData?.version_details?.context || '');
      setIsEditing(false);
    },
    [
      datasourceData?.version_details?.context,
      datasourceData?.version_details?.datasource_settings,
      formik
    ],
  )

  const leftLgGridColumns = useMemo(
    () => (showAdvancedChatSettings || showAdvancedSearchSettings ? 4.5 : 6),
    [showAdvancedChatSettings, showAdvancedSearchSettings]
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
                  dataSourceSettings={dataSourceSettings}
                  onSuccess={() => setIsEditing(false)}
                  hasChangedTheDataSource={hasChangedTheDataSource}
                  onDiscard={onDiscard}
                  versionStatus={datasourceData?.version_details?.status}
                  datasourceId={datasourceData?.id}
                /> : null,
              rightToolbar: isFetching ? null : <DataSourceDetailToolbar
                name={datasourceData?.name}
                versions={datasourceData?.version_details ? [datasourceData?.version_details] : []}
                id={datasourceData?.id}
                owner_id={datasourceData?.owner_id}
                is_liked={datasourceData?.is_liked}
                likes={datasourceData?.likes || 0}
              />,
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
                            />
                            :
                            <DatasourceEditForm
                              formik={formik}
                            />
                        }
                        <DatasourceContext
                          context={context}
                          onChangeContext={(event) => setContext(event.target.value)}
                        />
                        <DataSets
                          datasetItems={datasourceData?.version_details?.datasets || []}
                          datasourceId={datasourceId}
                          datasourceVersionId={datasourceData?.version_details?.id}
                          scrollToBottom={scrollToBottom}
                          datasourceVersionUUID={datasourceData?.version_details?.uuid}
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
                          dataSourceSettings={dataSourceSettings}
                          onChangeDataSourceSettings={onChangeDataSourceSettings}
                          //Chat settings
                          showAdvancedChatSettings={showAdvancedChatSettings}
                          onClickAdvancedChatSettings={onClickAdvancedChatSettings}
                          onCloseAdvancedChatSettings={onCloseAdvancedChatSettings}
                          chatHistory={chatHistory}
                          setChatHistory={setChatHistory}
                          //Search settings
                          showAdvancedSearchSettings={showAdvancedSearchSettings}
                          onClickAdvancedSearchSettings={onClickAdvancedSearchSettings}
                          onCloseAdvancedSearchSettings={onCloseAdvancedSearchSettings}
                          searchResult={searchResult}
                          setSearchResult={setSearchResult}
                          // deduplicate settings
                          deduplicateResult={deduplicateResult}
                          setDeduplicateResult={setDeduplicateResult}
                          // common settings 
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