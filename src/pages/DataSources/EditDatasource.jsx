/* eslint react/jsx-no-bind: 0 */
import { Grid } from "@mui/material";
import StyledTabs from "@/components/StyledTabs.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import ChatForm from "@/pages/DataSources/Components/ChatForm.jsx";
import DataSets from "@/pages/DataSources/Components/DataSets.jsx";
import { useLazyDatasourceDetailsQuery } from "@/api/datasources.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState, useCallback } from "react";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer } from "@/pages/EditPrompt/Common.jsx";
import DatasourceEditForm from './Components/DatasourceEditForm';
import DataSourceDetailToolbar from './Components/DataSourceDetailToolbar';
import DataSourceView from './Components/DataSourceView';
import { useFormik } from 'formik';
import EditDataSourceTabBar from './Components/EditDataSourceTabBar';
import getValidateSchema from './Components/dataSourceVlidateSchema';
import { DEFAULT_CUT_OFF_SCORE, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE, DEFAULT_TOP_K, DEFAULT_TOP_P } from '@/common/constants';

const EditDatasource = () => {
  const { datasourceId } = useParams()
  const { personal_project_id: privateProjectId } = useSelector(state => state.user)
  const [fetchFn, { data: datasourceData, isFetching }] = useLazyDatasourceDetailsQuery()
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [chatSettings, setChatSettings] = useState({
    context: '',
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
    max_tokens: DEFAULT_MAX_TOKENS,
  });
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
    cutoff_score: DEFAULT_CUT_OFF_SCORE,
  });
  const onChangeSearchSettings = useCallback(
    (field, value) => {
      setSearchSettings({
        ...searchSettings,
        [field]: value,
      })
    },
    [searchSettings],
  )

  const [duplicateSettings, setDuplicateSettings] = useState({
    embedding_model: {
      model_name: '',
      integration_uid: '',
      integration_name: '',
    },
    cutoff_score: DEFAULT_CUT_OFF_SCORE,
    generate_file: false,
  });
  const onChangeDuplicateSettings = useCallback(
    (field, value) => {
      setDuplicateSettings({
        ...duplicateSettings,
        [field]: value,
      })
    },
    [duplicateSettings],
  )

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
    () => {
      //
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
    privateProjectId && datasourceId && fetchFn({ projectId: privateProjectId, datasourceId }, true)
  }, [privateProjectId, datasourceId, fetchFn])

  return (
    <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12} >
        <StyledTabs
          tabSX={{ paddingX: '24px' }}
          tabs={[{
            label: 'Run',
            icon: <RocketIcon />,
            tabBarItems: <EditDataSourceTabBar hasChangedTheDataSource={hasChangedTheDataSource} onSave={onSave} onDiscard={onDiscard} />,
            rightToolbar: isFetching ? null : <DataSourceDetailToolbar name={datasourceData?.name} />,
            content:
              isFetching ? <PromptDetailSkeleton /> :
                <StyledGridContainer container spacing={'32px'} sx={{ paddingTop: '24px', paddingX: '24px' }}>
                  <Grid item xs={12} lg={leftLgGridColumns}>
                    <ContentContainer>
                      {
                        !isEditing ?
                          <DataSourceView
                            currentDataSource={datasourceData}
                            canEdit={true}
                            onEdit={onEdit}
                            chatContext={chatSettings.context}
                            onChangeChatContext={(event) => onChangeChatSettings('context', event.target.value)}
                          />
                          :
                          <DatasourceEditForm formik={formik} />
                      }
                      <DataSets
                        datasetItems={datasourceData?.version_details?.datasets || []}
                        datasourceId={datasourceId}
                        versionId={datasourceData?.version_details?.id}
                      />
                    </ContentContainer>
                  </Grid>
                  <Grid item xs={12} lg={12 - leftLgGridColumns}>
                    <ContentContainer>
                      <ChatForm
                        chatSettings={chatSettings}
                        onChangeChatSettings={onChangeChatSettings}
                        searchSettings={searchSettings}
                        onChangeSearchSettings={onChangeSearchSettings}
                        duplicateSettings={duplicateSettings}
                        onChangeDuplicateSettings={onChangeDuplicateSettings}
                        showAdvancedSettings={showAdvancedSettings}
                        onClickAdvancedSettings={onClickAdvancedSettings}
                        onCloseAdvanceSettings={onCloseAdvanceSettings}
                        versionId={datasourceData?.version_details?.id}
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
  )
}
export default EditDatasource