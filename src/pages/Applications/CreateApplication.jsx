import RocketIcon from '@/components/Icons/RocketIcon';
import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import ApplicationCreateForm from "./Components/Applications/ApplicationCreateForm";
import ApplicationRightContent from './Components/Applications/ApplicationRightContent';
import getValidateSchema from './Components/Applications/ApplicationCreationValidateSchema'
import { useCreateApplicationInitialValues } from './useApplicationInitialValues';
import { useState, useMemo } from 'react';
import { Form, Formik } from 'formik';
import CreateApplicationTabBar from './Components/Applications/CreateApplicationTabBar';
import ToolForm from './Components/Tools/ToolForm';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
}))

export default function CreateApplication() {
  const [editToolDetail, setEditToolDetail] = useState(null);
  const {
    modelOptions,
    initialValues,
  } = useCreateApplicationInitialValues();

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const lgGridColumns = useMemo(
    () => (showAdvancedSettings ? 4.5 : 6),
    [showAdvancedSettings]
  );

  return (
    <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={getValidateSchema}
        >
          <StyledTabs
            tabSX={{ paddingX: '24px' }}
            tabs={[{
              label: 'Run',
              icon: <RocketIcon />,
              tabBarItems: <CreateApplicationTabBar />,
              rightToolbar: <div />,
              content:
                <TabContentDiv>
                  <Form>
                    <Grid columnSpacing={'32px'} container sx={{ paddingX: '24px' }}>
                      <Grid item xs={12} lg={lgGridColumns} sx={{
                        overflowY: 'scroll',
                        height: 'calc(100vh - 170px)',
                      }}>
                        {
                          editToolDetail ?
                            <ToolForm
                            editToolDetail={editToolDetail}
                            setEditToolDetail={setEditToolDetail}
                            />
                            :
                            <ApplicationCreateForm setEditToolDetail={setEditToolDetail} />
                        }
                      </Grid>
                      <ApplicationRightContent
                        modelOptions={modelOptions}
                        lgGridColumns={lgGridColumns}
                        showAdvancedSettings={showAdvancedSettings}
                        setShowAdvancedSettings={setShowAdvancedSettings}
                      />
                    </Grid>
                  </Form>
                </TabContentDiv>,
            }]}
          />
        </Formik>
      </Grid>
    </Grid>
  )
}
