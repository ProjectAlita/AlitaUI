import StyledLabel from '@/components/StyledLabel';
import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import * as React from 'react';
import EditPromptDetail from './EditPromptDetail';

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(1.5)
}));

const TabContentDiv = styled('div')(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export default function EditPrompt({title}) {
  return (
    <React.Fragment>
      <Grid container sx={{padding: '0.5rem 1.5rem'}}>
        <Grid item xs={12}>
          <Label>{title}</Label>
        </Grid>
        <Grid item xs={12}>
          <StyledTabs tabs={[{
            label: 'Run',
            content:  <TabContentDiv>
              <EditPromptDetail />
            </TabContentDiv>
          }, {
            label: 'Test',
            content:  <TabContentDiv>Test</TabContentDiv>
          }]} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
