/* eslint react/jsx-no-bind: 0 */
import { useLazyApplicationDetailsQuery } from "@/api/applications.js";
import { ViewMode } from '@/common/constants.js';
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import StyledTabs from "@/components/StyledTabs.jsx";
import { ContentContainer, PromptDetailSkeleton, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import { useProjectId, useViewMode } from "@/pages/hooks.jsx";
import { useTheme } from '@emotion/react';
import { Grid } from "@mui/material";
import { useFormik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationContext from './Components/Applications/ApplicationContext.jsx';
import ApplicationDetailToolbar from './Components/Applications/ApplicationDetailToolbar';
import ApplicationEditForm from './Components/Applications/ApplicationEditForm';
import ApplicationOperationPanel from './Components/Applications/ApplicationOperationPanel';
import ApplicationView from './Components/Applications/ApplicationView';
import EditApplicationTabBar from './Components/Applications/EditApplicationTabBar';
import getValidateSchema from './Components/Applications/applicationValidateSchema';
import { initialChatSettings } from './constants.js';
import useHasApplicationChanged from './useHasApplicationChanged.js';

const EditApplication = () => {
  const theme = useTheme();
  const { applicationId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  // const [fetchFn, { data: applicationData, isFetching }] = useLazyApplicationDetailsQuery();
  const [fetchFn, { isFetching }] = useLazyApplicationDetailsQuery();

  const applicationData = useMemo(() => ({
    name: '[Mock] application name',
    description: '[Mock] application description',
    version_details: {
      instructions: '[Mock] instructions'
    }
  }), [])
  const [showAdvancedChatSettings, setShowAdvancedChatSettings] = useState(false);
  const [instructions, setInstructions] = useState('');
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
  const formik = useFormik({
    initialValues: applicationData,
    enableReinitialize: true,
    validationSchema: getValidateSchema,
    onSubmit: () => {

    }
  })

  const hasChangedTheApplication = useHasApplicationChanged(
    applicationData,
    formik,
    instructions,
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

  const onDiscard = useCallback(
    () => {
      formik.resetForm();
      setChatSettings(applicationData?.version_details?.application_settings?.chat || initialChatSettings)
      setInstructions(applicationData?.version_details?.instructions || '');
      setIsEditing(false);
    },
    [applicationData?.version_details?.instructions, applicationData?.version_details?.application_settings?.chat, formik],
  )

  const leftLgGridColumns = useMemo(
    () => (showAdvancedChatSettings ? 4.5 : 6),
    [showAdvancedChatSettings]
  );
  useEffect(() => {
    currentProjectId && applicationId && fetchFn({ projectId: currentProjectId, applicationId }, true)
  }, [currentProjectId, applicationId, fetchFn])

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
                <EditApplicationTabBar
                  formik={formik}
                  instructions={instructions}
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
                            <ApplicationView
                              currentApplication={applicationData}
                              canEdit={viewMode === ViewMode.Owner}
                              onEdit={onEdit}
                            />
                            :
                            <ApplicationEditForm
                              formik={formik}
                            />
                        }
                        <ApplicationContext
                          style={{ marginTop: '16px' }}
                          instructions={instructions}
                          onChangeContext={(event) => setInstructions(event.target.value)}
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
                        <ApplicationOperationPanel
                          chatSettings={chatSettings}
                          onChangeChatSettings={onChangeChatSettings}
                          showAdvancedChatSettings={showAdvancedChatSettings}
                          onClickAdvancedChatSettings={onClickAdvancedChatSettings}
                          onCloseAdvancedChatSettings={onCloseAdvancedChatSettings}
                          chatHistory={chatHistory}
                          setChatHistory={setChatHistory}
                          versionId={applicationData?.version_details?.id}
                          instructions={instructions}
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
export default EditApplication