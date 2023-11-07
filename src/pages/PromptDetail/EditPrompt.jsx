import BasicAccordion from '@/components/BasicAccordion';
import ChatBox from '@/components/ChatBox/ChatBox';
import StyledLabel from '@/components/StyledLabel';
import { NAV_BAR_HEIGHT } from "@/constants/constants";
import styled from '@emotion/styled';
import { Dialog, Grid, Slide, TextField } from '@mui/material';
import * as React from 'react';
import StyledTabs from '../../components/StyledTabs';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Label = styled(StyledLabel)(({theme}) => ({
  marginBottom: theme.spacing(1.5)
}));

const TabContentDiv = styled('div')(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}))

const StyledInput = ({...props}) => (
  <TextField
    variant="standard" 
    sx={{marginBottom: '0.75rem'}} 
    fullWidth 
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
export default function EditPrompt({isOpen, onClose}) {
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
      <Dialog
        fullScreen
        open={isOpen}
        onClose={onClose}
        TransitionComponent={Transition}
        sx={{top: NAV_BAR_HEIGHT}}
      >
        <Grid container sx={{padding: '0.5rem 1.5rem'}}>
          <Grid item xs={12}>
            <Label>Edit Prompt</Label>
          </Grid>
          <Grid item xs={12}>
            <StyledTabs tabs={tabs} />
          </Grid>
        </Grid>
      </Dialog>
    </React.Fragment>
  );
}
