/* eslint-disable react/jsx-no-bind */
import {
  ViewMode
} from '@/common/constants.js';
import DirtyDetector from "@/components/Formik/DirtyDetector.jsx";
import RocketIcon from "@/components/Icons/RocketIcon.jsx";
import StyledTabs from "@/components/StyledTabs.jsx";
import { ContentContainer, LeftGridItem, PromptDetailSkeleton, StyledGridContainer } from "@/pages/Prompts/Components/Common.jsx";
import { useViewMode } from "@/pages/hooks.jsx";
import { Grid } from "@mui/material";
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from "react";
import ApplicationContext from './Components/Applications/ApplicationContext.jsx';
import ApplicationDetailToolbar from './Components/Applications/ApplicationDetailToolbar';
import ApplicationEditForm from './Components/Applications/ApplicationEditForm';
import ApplicationRightContent from "./Components/Applications/ApplicationRightContent.jsx";
import ApplicationView from './Components/Applications/ApplicationView';
import ConversationStarters from "./Components/Applications/ConversationStarters.jsx";
import EditApplicationTabBar from './Components/Applications/EditApplicationTabBar';
import getValidateSchema from './Components/Applications/applicationValidateSchema';
import ApplicationTools from './Components/Tools/ApplicationTools.jsx';
import ToolForm from './Components/Tools/ToolForm.jsx';
import useApplicationInitialValues, { useFormikFormRef } from './useApplicationInitialValues';


const EditApplication = () => {
  const viewMode = useViewMode();

  const {
    initialValues,
    isFetching,
    modelOptions,
  } = useApplicationInitialValues();

  const [isEditing, setIsEditing] = useState(false);
  const [editToolDetail, setEditToolDetail] = useState(null);

  useEffect(() => {
    setIsEditing(false);
  }, [
    initialValues
  ])

  const {
    formRef, 
    getFormValues,
    resetFormValues
  } = useFormikFormRef();
  const [dirty, setDirty] = useState(false);

  const onEdit = useCallback(() => {
    setIsEditing(true);
  }, [])

  const onDiscard = useCallback(
    () => {
      resetFormValues();
      setIsEditing(false);
      setEditToolDetail(null);
    },
    [resetFormValues],
  )


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
                  versionStatus={initialValues?.version_details?.status}
                  applicationId={initialValues?.id}
                /> : null,
              rightToolbar: isFetching ? null : <ApplicationDetailToolbar
                name={initialValues?.name}
                versions={initialValues?.version_details ? [initialValues?.version_details] : []}
                id={initialValues?.id}
                is_liked={initialValues?.is_liked}
                likes={initialValues?.likes || 0}
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
                            {editToolDetail ?
                              <ToolForm
                                editToolDetail={editToolDetail}
                                setEditToolDetail={setEditToolDetail} 
                              />
                              :
                              <>
                                {
                                  !isEditing ?
                                    <ApplicationView
                                      currentApplication={initialValues}
                                      canEdit={viewMode === ViewMode.Owner}
                                      onEdit={onEdit}
                                    />
                                    :
                                    <ApplicationEditForm />
                                }
                                <ApplicationContext style={{ marginTop: '16px' }} />
                                <ApplicationTools style={{ marginTop: '16px' }} setEditToolDetail={setEditToolDetail} />
                                <ConversationStarters style={{ marginTop: '16px' }} />
                              </>
                            }
                          </ContentContainer>
                        </LeftGridItem>
                        <ApplicationRightContent
                          modelOptions={modelOptions}
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