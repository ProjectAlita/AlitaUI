import BasicAccordion from '@/components/BasicAccordion';
import ChatBox from '@/components/ChatBox/ChatBox';
import StyledLabel from '@/components/StyledLabel';
import styled from '@emotion/styled';
import { Grid, TextField } from '@mui/material';
import * as React from 'react';
import StyledTabs from '../../components/StyledTabs';

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(1.5)
}));

const TabContentDiv = styled('div')(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

const StyledInput = ({...props}) => (
  <TextField
    variant="standard" 
    fullWidth 
    sx={{ 
      marginBottom: '0.75rem', 
      '& .MuiFormLabel-root': {
        fontSize: '0.875rem',
        lineHeight: '1.375rem',
        top: '-4px',
      },
      '& .MuiInputBase-root': {
        padding: '1rem 0.75rem',
        marginTop: '0'
      }
    }} 
    {...props}
  />
);

const promptDetailLeft = [{
  title: 'General',
  content: <div>
    <StyledInput id="prompt-name" label="Name"/>
    <StyledInput id="prompt-desc" label="Description" multiline/>
    <StyledInput id="prompt-tags" label="Tags" multiline/>
  </div>
}, {
  title: 'Context',
  content: <div>
    <StyledInput id="prompt-context" label="Context (??? hint or label)" multiline/>
    </div>

}, {
  title: 'Messages',
  content: <div>
    <StyledInput id="prompt-messages" label="User messages" multiline/>
  </div>
}]

const promptDetailRight = [{
  title: 'Variables',
  content: <div>
    <StyledInput id="prompt-variables" label="Variables" multiline/>
  </div>
}]
const PromptDetailEdit = styled(() => (
  <Grid container>
    <Grid item xs={12} lg={6}>
      <BasicAccordion items={promptDetailLeft}></BasicAccordion>
    </Grid>
    <Grid item xs={12} lg={6}>
      <BasicAccordion items={promptDetailRight}></BasicAccordion>
      <ChatBox/>
    </Grid>
  </Grid>
))(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))
export default function EditPrompt({title}) {
  const tabs = [{
    label: 'Run',
    content:  <TabContentDiv>
      <PromptDetailEdit />
    </TabContentDiv>
  }, {
    label: 'Test',
    content:  <TabContentDiv>Test</TabContentDiv>
  }]

  return (
    <React.Fragment>
      <Grid container sx={{padding: '0.5rem 1.5rem'}}>
        <Grid item xs={12}>
          <Label>{title}</Label>
        </Grid>
        <Grid item xs={12}>
          <StyledTabs tabs={tabs} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
