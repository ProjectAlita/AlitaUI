import StyledLabel from '@/components/StyledLabel';
import { NAV_BAR_HEIGHT } from "@/constants/constants";
import styled from '@emotion/styled';
import { Dialog, Grid, Slide } from '@mui/material';
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

export default function EditPrompt({isOpen, onClose}) {
  const tabs = [{
    label: 'Run',
    content:  <TabContentDiv>Run</TabContentDiv>
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
