import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import * as React from 'react';


const TabContentDiv = styled('div')(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export default function EditPromptTabs({runTabContent}) {
  return <React.Fragment>
  <Grid container sx={{padding: '0.5rem 1.5rem'}}>
    <Grid item xs={12}>
      <StyledTabs tabs={[{
        label: 'Run',
        content:  <TabContentDiv>
          {runTabContent}
        </TabContentDiv>
      }, {
        label: 'Test',
        content:  <TabContentDiv>Test</TabContentDiv>
      }]} />
    </Grid>
  </Grid>
</React.Fragment>
}
