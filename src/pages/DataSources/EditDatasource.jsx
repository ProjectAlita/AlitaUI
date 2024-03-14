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
import DatasourceContext from './Components/Datasources/DatasourceContext.jsx';

const EditDatasource = () => {
  const theme = useTheme();
  const { datasourceId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const [showAdvancedChatSettings, setShowAdvancedChatSettings] = useState(false);
  const [showAdvancedSearchSettings, setShowAdvancedSearchSettings] = useState(false);
  const [context, setContext] = useState('');
  const [chatSettings, setChatSettings] = useState(initialChatSettings);
  const [chatHistory, setChatHistory] = useState([]);

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
  const [searchResult, setSearchResult] = useState({})
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
  const [deduplicateResult, setDeduplicateResult] = useState([]);
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
      setChatSettings(datasourceData?.version_details?.datasource_settings?.chat || initialChatSettings)
      setSearchSettings(datasourceData?.version_details?.datasource_settings?.search || initialSearchSettings)
      setDeduplicateSettings(datasourceData?.version_details?.datasource_settings?.deduplicate || initialDeduplicateSettings);
      setContext(datasourceData?.version_details?.context || '');
      setIsEditing(false);
    },
    [datasourceData?.version_details?.context, datasourceData?.version_details?.datasource_settings?.chat, datasourceData?.version_details?.datasource_settings?.deduplicate, datasourceData?.version_details?.datasource_settings?.search, formik],
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
                  chatSettings={chatSettings}
                  searchSettings={searchSettings}
                  deduplicateSettings={deduplicateSettings}
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
                          style={{ marginTop: '16px'}}
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
                          //Chat settings
                          chatSettings={chatSettings}
                          onChangeChatSettings={onChangeChatSettings}
                          showAdvancedChatSettings={showAdvancedChatSettings}
                          onClickAdvancedChatSettings={onClickAdvancedChatSettings}
                          onCloseAdvancedChatSettings={onCloseAdvancedChatSettings}
                          chatHistory={chatHistory}
                          setChatHistory={setChatHistory}
                          //Search settings
                          searchSettings={searchSettings}
                          onChangeSearchSettings={onChangeSearchSettings}
                          showAdvancedSearchSettings={showAdvancedSearchSettings}
                          onClickAdvancedSearchSettings={onClickAdvancedSearchSettings}
                          onCloseAdvancedSearchSettings={onCloseAdvancedSearchSettings}
                          searchResult={searchResult}
                          setSearchResult={setSearchResult}
                          // deduplicate settings
                          deduplicateSettings={deduplicateSettings}
                          onChangeDeduplicateSettings={onChangeDeduplicateSettings}
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