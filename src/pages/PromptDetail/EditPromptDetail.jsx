/* eslint-disable react-hooks/exhaustive-deps */
import BasicAccordion from '@/components/BasicAccordion';
import Button from '@/components/Button';
import ChatBox from '@/components/ChatBox/ChatBox';
import SingleSelect from '@/components/SingleSelect';
import { PROMPT_PAYLOAD_KEY } from "@/pages/PromptDetail/constants.js"
import { Grid, TextField, Typography } from '@mui/material';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { actions as promptSliceActions } from '@/reducers/prompts';

const StyledGridContainer = styled(Grid)(({theme}) => ({
  padding: `${theme.spacing(3)} ${theme.spacing(0.5)}`,
}));

const RelativeGridItem = styled(Grid)(() => ({
  position: 'relative'
}));

const StyledInput = styled(TextField)(() => ({
  marginBottom: '0.75rem',
  '& .MuiFormLabel-root': {
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    top: '-0.25rem',
  },
  '& .MuiInputBase-root': {
    padding: '1rem 0.75rem',
    marginTop: '0'
  }
}));

const StyledInputEnhancer = (props) => {
  const dispatch = useDispatch();
  const handlers = {
    onBlur: useCallback((event) => {
      const { target } = event;
      const { payloadkey } = props;
      dispatch(promptSliceActions.updateCurrentPromptData({
        key: payloadkey,
        data: target?.value
      }))
    }, [])
  }
  return <StyledInput {...props} {...handlers} />
}

const promptDetailLeft = [{
  title: 'General',
  content: <div>
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.name}  id="prompt-name" label="Name" variant="standard" fullWidth />
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.description} id="prompt-desc" label="Description" multiline variant="standard" fullWidth />
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.tags} id="prompt-tags" label="Tags" multiline variant="standard" fullWidth />
  </div>
}, {
  title: 'Context',
  content: <div>
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.context} id="prompt-context" label="Context (??? hint or label)" multiline variant="standard" fullWidth />
    </div>

}, {
  title: 'Messages',
  content: <div>
    <StyledInputEnhancer id="prompt-messages" label="User messages" multiline variant="standard" fullWidth />
  </div>
}]

const promptDetailRight = [{
  title: 'Variables',
  content: <div>
    <StyledInputEnhancer id="prompt-variables" label="Variables" multiline variant="standard" fullWidth />
  </div>
}]

const TabBarItems = styled('div')(() => ({
  position: 'absolute', top: '-3.7rem', right: '0.5rem'
}));

const SelectLabel = styled(Typography)(() => ({
  display: 'inline-block'
}))

export default function EditPromptDetail () {
  return (
    <StyledGridContainer container>
      <RelativeGridItem item xs={12} lg={6}>
        <TabBarItems>
          <SelectLabel>Version</SelectLabel>
          <SingleSelect label="Version" options={[]}/> 
          <Button variant="contained" color={'secondary'}>Save</Button>
          <Button variant="contained" color={'secondary'}>Cancel</Button>
        </TabBarItems>
        <BasicAccordion items={promptDetailLeft}></BasicAccordion>
      </RelativeGridItem>
      <Grid item xs={12} lg={6}>
        <BasicAccordion items={promptDetailRight}></BasicAccordion>
        <ChatBox/>
      </Grid>
    </StyledGridContainer>
  )
}