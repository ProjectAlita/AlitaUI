import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { PromptDetailSkeleton } from './Common';
import * as React from 'react';

const TabContentDiv = styled('div')(({ theme }) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export default function EditPromptTabs({ isLoading, runTabContent, runTabBarItems }) {
  return <React.Fragment>
    <Grid container sx={{ padding: '0.5rem 1.5rem', position: 'fixed'  }}>
      <Grid item xs={12}>
        <StyledTabs tabs={[{
          label: 'Run',
          tabBarItems: runTabBarItems,
          content: 
            <TabContentDiv>
              {isLoading ? <PromptDetailSkeleton/> : runTabContent}
            </TabContentDiv>,
        }, {
          label: 'Test',
          tabBarItems: null,
          content: 
            <TabContentDiv>Test</TabContentDiv>
        }]}/>
      </Grid>
    </Grid>
  </React.Fragment>
}
