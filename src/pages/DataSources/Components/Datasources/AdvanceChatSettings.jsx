import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box, Typography } from '@mui/material';
import Slider from '@/components/Slider';
import { useCallback } from 'react';
import { DEFAULT_TOP_P, DEFAULT_TOP_K, DEFAULT_TEMPERATURE } from '@/common/constants';
import { StyledInput } from '@/pages/Prompts/Components/Common';
import CloseIcon from '@/components/Icons/CloseIcon';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';

const AdvanceChatSettings = ({
  onChangeChatModel,
  selectedChatModel,
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  top_k,
  onChangeTopK,
  temperature,
  onChangeTemperature,
  top_p,
  onChangeTopP,
  max_length,
  onChangeMaxLength,
  onCloseAdvanceSettings
}) => {
  const { modelOptions, embeddingModelOptions } = useModelOptions();

  const onChangeInternalMaxLength = useCallback(
    (event) => {
      onChangeMaxLength(event.target.value);
    },
    [onChangeMaxLength],
  );

  return (
    <Box sx={{ gap: '16px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='subtitle'>
          advanced Settings
        </Typography>
        <CloseIcon sx={{ cursor: 'pointer' }} fontSize='1rem' onClick={onCloseAdvanceSettings} />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <SingleGroupSelect
          label={'Embedding model'}
          value={selectedEmbeddingModel}
          onValueChange={onChangeEmbeddingModel}
          options={embeddingModelOptions}
          extraSelectedContent={isSelectedEmbeddingModelCompatible ? <ModelCompatibleIcon /> : null}
          sx={{
            height: '56px',
            boxSizing: 'border-box',
            paddingTop: '8px',
            '& .MuiInputLabel-shrink': {
              top: '12px !important',
            },
            '& .MuiInputLabel-root': {
              top: '6px',
            },
          }}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <SingleGroupSelect
          label={'Chat model'}
          value={selectedChatModel}
          onValueChange={onChangeChatModel}
          options={modelOptions}
          sx={{
            height: '56px',
            boxSizing: 'border-box',
            paddingTop: '8px',
            '& .MuiInputLabel-shrink': {
              top: '12px !important',
            },
            '& .MuiInputLabel-root': {
              top: '6px',
            },
          }}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Temperature (0.1 - 1.0)'
          value={temperature ?? DEFAULT_TEMPERATURE}
          step={0.1}
          range={[0.1, 1]}
          onChange={onChangeTemperature} />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Top P (0-1)'
          value={+(top_p ?? DEFAULT_TOP_P)}
          range={[0, 1]}
          onChange={onChangeTopP}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Top K'
          value={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChangeTopK}
        />
      </Box>
      <Box sx={{ height: '56px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start'}}>
        <StyledInput
          variant='standard'
          fullWidth
          id='max_length'
          name='max_length'
          label='Maximum length'
          type="number"
          value={max_length}
          onChange={onChangeInternalMaxLength}
          inputProps={{
            style: { textAlign: 'left' },
          }}
        />
      </Box>
    </Box>
  );
}
export default AdvanceChatSettings;