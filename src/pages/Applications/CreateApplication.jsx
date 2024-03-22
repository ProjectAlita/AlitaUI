import RocketIcon from '@/components/Icons/RocketIcon';
import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import ApplicationCreateForm from "./Components/Applications/ApplicationCreateForm";
import ApplicationRightContent from './Components/Applications/ApplicationRightContent';
import getValidateSchema from './Components/Applications/ApplicationCreationValidateSchema'
import { useCreateApplicationInitialValues, useFormikFormRef } from './useApplicationInitialValues';
import { useState, useMemo } from 'react';
import { Form, Formik } from 'formik';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
}))

export default function CreateApplication() {
  const {
    modelOptions,
    initialValues,
  } = useCreateApplicationInitialValues();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.5 : 6),
    [showAdvancedSettings]
  );

  const {
    formRef, 
  } = useFormikFormRef();

  return (
    <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12}>
        <StyledTabs
          tabSX={{ paddingX: '24px' }}
          tabs={[{
            label: 'Run',
            icon: <RocketIcon />,
            tabBarItems: <div />,
            rightToolbar: <div />,
            content:
              <TabContentDiv>
                <Formik
                  enableReinitialize
                  innerRef={formRef}
                  initialValues={initialValues}
                  validationSchema={getValidateSchema}
                  // eslint-disable-next-line react/jsx-no-bind
                  onSubmit={() => { }}
                >
                  <Form>
                    <Grid columnSpacing={'32px'} container sx={{ paddingX: '24px' }}>
                      <Grid item xs={12} lg={lgGridColumns} sx={{
                        overflowY: 'scroll',
                        height: 'calc(100vh - 170px)',
                      }}>
                        <ApplicationCreateForm />
                      </Grid>
                      <ApplicationRightContent
                        modelOptions={modelOptions}
                        lgGridColumns={lgGridColumns}
                        showAdvancedSettings={showAdvancedSettings}
                        setShowAdvancedSettings={setShowAdvancedSettings}
                      />
                    </Grid>
                  </Form>
                </Formik>
              </TabContentDiv>,
          }]}
        />
      </Grid>
    </Grid>
  )
}
