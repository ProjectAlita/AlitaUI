import BasicAccordion from '@/components/BasicAccordion';
import Button from '@/components/Button';
import ChatBox from '@/components/ChatBox/ChatBox';
import SettingIcon from '@/components/Icons/SettingIcon';
import SingleSelect from '@/components/SingleSelect';
import Slider from '@/components/Slider';
import { PROMPT_PAYLOAD_KEY } from "@/constants/constants.js";
import { actions as promptSliceActions } from '@/reducers/prompts';
import { Avatar, Grid, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Messages from './Messages';

const StyledGridContainer = styled(Grid)(() => ({
  padding: 0,
}));

const LeftGridItem = styled(Grid)(() => ({
  position: 'relative',
  padding: '0 0.75rem'
}));

const RrightGridItem = styled(Grid)(() => ({
  padding: '0 0.75rem'
}));

const StyledInput = styled(TextField)(() => ({
  marginBottom: '0.75rem',
  '& .MuiFormLabel-root': {
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
    top: '-0.25rem',
    left: '0.75rem'
  },
  '& .MuiInputBase-root': {
    padding: '1rem 0.75rem',
    marginTop: '0'
  }
}));

const StyledInputEnhancer = (props) => {
  const { payloadkey } = props;
  const { currentPrompt } = useSelector((state) => state.prompts);
  const theValue = currentPrompt && currentPrompt[payloadkey];
  const [value, setValue] = useState(payloadkey === PROMPT_PAYLOAD_KEY.tags ? theValue?.join(',') : theValue);
  const dispatch = useDispatch();
  const handlers = {
    onBlur: useCallback((event) => {
      const { target } = event;
      dispatch(promptSliceActions.updateCurrentPromptData({
        key: payloadkey,
        data: payloadkey === PROMPT_PAYLOAD_KEY.tags ? target?.value?.split(',') : target?.value
      }))
    }, [dispatch, payloadkey]),

    onChange: useCallback((event) => {
      const { target } = event;
      setValue(target?.value)
    }, [])
  }
  return <StyledInput {...props} {...handlers} value={value} />
}

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: '1.75rem',
  height: '1.75rem',
  display: 'flex',
  flex: '0 0 1.75rem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.secondary.main
}));

const TabBarItems = styled('div')(() => ({
  position: 'absolute', top: '-3.7rem', right: '0.5rem'
}));

const SelectLabel = styled(Typography)(() => ({
  display: 'inline-block'
}));

const promptDetailLeft = [{
  title: 'General',
  content: <div>
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.name} id="prompt-name" label="Name" variant="standard" fullWidth />
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.description} id="prompt-desc" label="Description" multiline variant="standard" fullWidth />
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.tags} id="prompt-tags" label="Tags" multiline variant="standard" fullWidth />
  </div>
}, {
  title: 'Context',
  content: <div>
    <StyledInputEnhancer payloadkey={PROMPT_PAYLOAD_KEY.context} id="prompt-context" label="Context (??? hint or label)" multiline variant="standard" fullWidth />
  </div>
}];

const promptDetailRight = [{
  title: 'Variables',
  content: <div>
    <StyledInputEnhancer id="prompt-variables" label="Variables" multiline variant="standard" fullWidth />
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <div style={{ flex: 8, paddingRight: '1rem' }}>
        <SingleSelect
          label={'Model'}
          options={[{
            label: 'gpt-3.5-turbo',
            value: 'gpt-3.5-turbo',
          }, {
            label: 'gpt-4',
            value: 'gpt-4',
          }]} />
      </div>
      <div style={{ flex: 6 }}><Slider label="Temperature" defaultValue={0.7} range={[0, 1]} /></div>
      <StyledAvatar><SettingIcon fontSize="1rem" /></StyledAvatar>
    </div>
  </div>
}];

export default function EditPromptDetail({ onSave }) {
  const navigate = useNavigate();
  const {
    id,
    context = '',
    messages = [],
    variables = {},
    model_name = 'gpt-3.5-turbo',
    temperature = 1,
    top_p = 0.5,
    max_tokens = 117,
  } = useSelector(state => state.prompts.currentPrompt);

  const onCancel = useCallback(() => {
    navigate('/');
  }, [navigate])

  return (
    <StyledGridContainer container>
      <LeftGridItem item xs={12} lg={6}>
        <TabBarItems>
          <SelectLabel variant="body2">Version</SelectLabel>
          <div style={{ display: 'inline-block', marginRight: '2rem', width: '4rem' }}><SingleSelect options={[]} /> </div>
          <Button variant="contained" color="secondary" onClick={onSave}>Save</Button>
          <Button variant="contained" color="secondary" onClick={onCancel}>Cancel</Button>
        </TabBarItems>
        <BasicAccordion items={promptDetailLeft}></BasicAccordion>
        <Messages />
      </LeftGridItem>
      <RrightGridItem item xs={12} lg={6}>
        <BasicAccordion items={promptDetailRight}></BasicAccordion>
        <ChatBox
          prompt_id={id}
          integration_uid='133f1010-fe15-46a5-ad5b-907332a0635e'
          model_name={model_name}
          temperature={temperature}
          context={context}
          chat_history={messages}
          max_tokens={max_tokens}
          top_p={top_p}
          variables={variables}
        />
      </RrightGridItem>
    </StyledGridContainer>
  )
}