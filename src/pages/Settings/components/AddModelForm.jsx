/* eslint-disable react/jsx-no-bind */
import React, { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import styled from "@emotion/styled";
import { StyledInput } from '../../EditPrompt/Common';
import NormalRoundButton from '@/components/NormalRoundButton';
import MultipleSelect from '@/components/MultipleSelect';
import { useTheme } from '@emotion/react';


const AddModelContainer = styled(Box)(({ theme }) => (`
display: flex;
padding: 16px 24px;
align-items: center;
margin-bottom: 16px;
gap: 24px;
align-self: stretch;
border-radius: 8px;
border: 1px solid ${theme.palette.secondary.main};
background: ${theme.palette.background.secondary};
`));

const capabilityOptions = [
  {
    label: 'Text',
    value: 'completion',
  },
  {
    label: 'Chat',
    value: 'chat_completion',
  },
  {
    label: 'Embeddings',
    value: 'embeddings',
  }
];
const allCapabilities = capabilityOptions.map(item => item.value);


const AddModelForm = ({ isVertexAI, onAddModel, onCancel }) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const [capabilities, setCapabilities] = useState([]);

  const onChangeModelName = useCallback(
    (event) => {
      setName(event.target.value);
    },
    [],
  )

  const onChangeInput = useCallback(
    (event) => {
      setInput(event.target.value);
    },
    [],
  )

  const onChangeOutput = useCallback(
    (event) => {
      setOutput(event.target.value);
    },
    [],
  )

  const onChangeCapabilities = useCallback(
    (value) => {
      setCapabilities(value);
    },
    [],
  )

  const onHandleAddModel = useCallback(
    () => {
      const notSelectedCapabilities = allCapabilities.filter(
        capability => !capabilities.find(selected => selected === capability)
      );
      onAddModel({
        id: name,
        name,
        token_limit: isVertexAI ? { input, output } : input,
        capabilities: notSelectedCapabilities.reduce((sum, capability) => {
          sum[capability] = false;
          return sum;
        }, capabilities.reduce((sum, capability) => {
          sum[capability] = true;
          return sum;
        }, {})),
      })
    },
    [capabilities, input, isVertexAI, name, onAddModel, output],
  )

  return (
    <AddModelContainer >
      <Box sx={{ flex: 1 }}>
        <StyledInput
          value={name}
          sx={{
            '& .MuiFormLabel-root': {
              color: 'text.primary',
            }
          }}
          fullWidth
          variant='standard'
          label='Model name'
          onChange={onChangeModelName}
        />
      </Box>
      <Box sx={{ flex: 1 }}>
        <StyledInput
          value={input}
          sx={{
            '& .MuiFormLabel-root': {
              color: 'text.primary',
            }
          }}
          type='number'
          fullWidth
          variant='standard'
          label='Max input tokens'
          onChange={onChangeInput}
        />
      </Box>
      {
        isVertexAI && <Box sx={{ flex: 1 }}>
          <StyledInput
            value={output}
            sx={{
              '& .MuiFormLabel-root': {
                color: 'text.primary',
              }
            }}
            type='number'
            fullWidth
            variant='standard'
            label='Max output tokens'
            onChange={onChangeOutput}
          />
        </Box>
      }
      <Box sx={{ flex: 1, paddingTop: '10px' }}>
        <MultipleSelect
          label={'Capabilities'}
          onValueChange={onChangeCapabilities}
          value={capabilities}
          options={capabilityOptions}
          customSelectedColor={`${theme.palette.text.primary} !important`}
          customSelectedFontSize={'0.875rem'}
          multiple={true}
          emptyPlaceHolder=''
          customRenderValue={(options) => options.length ? `${options.length} selected` : ''}
          sx={{
            borderBottom: `1px solid ${theme.palette.border.lines}`,
            margin: '0px 0px !important',
            padding: '4px 12px',
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        <NormalRoundButton variant='contained' color='secondary' onClick={onCancel}>
          Cancel
        </NormalRoundButton>
        <NormalRoundButton variant='contained' onClick={onHandleAddModel} disabled={!name || !input || !capabilities.length}>
          Add
        </NormalRoundButton>
      </Box>

    </AddModelContainer>
  );
}

export default AddModelForm;
