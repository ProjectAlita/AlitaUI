import StyledLabel from '@/components/StyledLabel';
import StyledTabs from '@/components/StyledTabs';
import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import EditPromptDetail from './EditPromptDetail';

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(1.5)
}));

const TabContentDiv = styled('div')(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

export default function EditPromptTabs({onSave}) {
  const { currentPromptData } = useSelector((state) => state.prompts);
  const title = React.useMemo(() => currentPromptData?.name, [currentPromptData]);

  return <React.Fragment>
  <Grid container sx={{padding: '0.5rem 1.5rem'}}>
    <Grid item xs={12}>
      <Label>{title}</Label>
    </Grid>
    <Grid item xs={12}>
      <StyledTabs tabs={[{
        label: 'Run',
        content:  <TabContentDiv>
          <EditPromptDetail onSave={onSave}/>
        </TabContentDiv>
      }, {
        label: 'Test',
        content:  <TabContentDiv>Test</TabContentDiv>
      }]} />
    </Grid>
  </Grid>
</React.Fragment>
}
