import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import * as React from 'react';
import RocketIcon from '@/components/Icons/RocketIcon';
import BuildTabContent from './Components/BuildTabCotent';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} 0`,
}))

export default function CreateDatasource() {
  return <React.Fragment>
    <Grid container sx={{ padding: '0.5rem 1.5rem', position: 'fixed', marginTop: '0.7rem' }}>
      <Grid item xs={12}>
        <StyledTabs
          tabs={[{
            label: '(Build)',
            icon: <RocketIcon/>,
            tabBarItems: <div/>,
            rightToolbar: <div/>,
            content:
              <TabContentDiv>
                <BuildTabContent />
              </TabContentDiv>,
          }, {
            label: 'Test',
            tabBarItems: null,
            content:
              <TabContentDiv>Test</TabContentDiv>,
            display: 'none',
          }]}
        />
      </Grid>
    </Grid>
  </React.Fragment>
}
