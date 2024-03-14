/* eslint-disable react/jsx-no-bind */
import { useLazyApplicationDetailsQuery } from "@/api/applications.js";
import {
  ViewMode
} from '@/common/constants.js';
import DirtyDetector from "@/components/Formik/DirtyDetector.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import StyledTabs from "@/components/StyledTabs.jsx";
import { ContentContainer, LeftGridItem, PromptDetailSkeleton, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import { useProjectId, useViewMode } from "@/pages/hooks.jsx";
import { Grid } from "@mui/material";
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationContext from './Components/Applications/ApplicationContext.jsx';
import ApplicationDetailToolbar from './Components/Applications/ApplicationDetailToolbar';
import ApplicationEditForm from './Components/Applications/ApplicationEditForm';
import ApplicationEnvironment from "./Components/Applications/ApplicationEnvironment.jsx";
import ApplicationRightContent from "./Components/Applications/ApplicationRightContent.jsx";
import ApplicationView from './Components/Applications/ApplicationView';
import ConversationStarters from "./Components/Applications/ConversationStarters.jsx";
import EditApplicationTabBar from './Components/Applications/EditApplicationTabBar';
import getValidateSchema from './Components/Applications/applicationValidateSchema';

const EditApplication = () => {
  const { applicationId } = useParams()
  const viewMode = useViewMode();
  const currentProjectId = useProjectId()
  const [fetchFn, { data: applicationData = {}, isFetching }] = useLazyApplicationDetailsQuery();

  const [initialValues, setInitialValues] = useState(applicationData)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setInitialValues(applicationData);
    setIsEditing(false);
  }, [
    applicationData
  ])


  const formRef = useRef();
  const getFormValues = useCallback(() => formRef?.current?.values || {}, []);
  const [dirty, setDirty] = useState(false);

  const onEdit = useCallback(() => {
    setIsEditing(true);
  }, [])

  const onDiscard = useCallback(
    () => {
      formRef.current?.resetForm();
      setIsEditing(false);
    },
    [],
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
              tabBarItems: !isFetching && viewMode === ViewMode.Owner ?
                <EditApplicationTabBar
                  getFormValues={getFormValues}
                  isFormDirty={dirty}
                  onSuccess={() => setIsEditing(false)}
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
                      <DirtyDetector setDirty={setDirty} />
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
                            <ConversationStarters style={{ marginTop: '16px' }} />
                          </ContentContainer>
                        </LeftGridItem>
                        <ApplicationRightContent
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