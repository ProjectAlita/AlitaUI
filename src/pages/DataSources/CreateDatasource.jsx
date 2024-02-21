import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import * as React from 'react';
import RocketIcon from '@/components/Icons/RocketIcon';
import DatasourceCreateForm from "@/pages/DataSources/Components/DatasourceCreateForm.jsx";

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
}))

export default function CreateDatasource() {
  return <React.Fragment>
    <Grid container sx={{ padding: '0.5rem 0rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12}>
        <StyledTabs
          tabSX={{ paddingX: '24px'}}
          tabs={[{
            label: 'Build',
            icon: <RocketIcon />,
            tabBarItems: <div />,
            rightToolbar: <div />,
            content:
              <TabContentDiv>
                <Grid container sx={{ paddingX: '24px' }}>
                  <Grid item xs={12} lg={6}>
                    <DatasourceCreateForm />
                  </Grid>
                </Grid>
              </TabContentDiv>,
          }]}
        />
      </Grid>
    </Grid>
  </React.Fragment>
}
