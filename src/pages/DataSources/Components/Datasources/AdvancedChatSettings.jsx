import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box, Typography } from '@mui/material';
import Slider from '@/components/Slider';
import { useCallback, useMemo } from 'react';
import { DEFAULT_TOP_P, DEFAULT_TOP_K, DEFAULT_TEMPERATURE, DEFAULT_FETCH_K, DEFAULT_PAGE_TOP_K, DEFAULT_CUT_OFF_SCORE } from '@/common/constants';
import { StyledInput } from '@/pages/Prompts/Components/Common';
import CloseIcon from '@/components/Icons/CloseIcon';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';

const AdvancedChatSettings = ({
  onChangeChatModel,
  selectedChatModel,
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  fetch_k,
  onChangeFetchK,
  page_top_k,
  onChangePageTopK,
  cut_off_score,
  onChangeCutoffScore,
  top_k,
  onChangeTopK,
  temperature,
  onChangeTemperature,
  top_p,
  onChangeTopP,
  maximum_length,
  onChangeMaxLength,
  onCloseAdvancedSettings
}) => {
  const { modelOptions, embeddingModelOptions } = useModelOptions();

  const chatModelValue = useMemo(() =>
  (
    selectedChatModel.integration_uid &&
      selectedChatModel.model_name ?
      genModelSelectValue(selectedChatModel.integration_uid,
        selectedChatModel.model_name,
        getIntegrationNameByUid(selectedChatModel.integration_uid, modelOptions))
      : ''),
    [modelOptions, selectedChatModel.integration_uid, selectedChatModel.model_name]);

  const embeddingModelValue = useMemo(() =>
  (
    selectedEmbeddingModel.integration_uid &&
      selectedEmbeddingModel.model_name ?
      genModelSelectValue(selectedEmbeddingModel.integration_uid,
        selectedEmbeddingModel.model_name,
        getIntegrationNameByUid(selectedEmbeddingModel.integration_uid, modelOptions)) : ''
  ),
    [modelOptions, selectedEmbeddingModel.integration_uid, selectedEmbeddingModel.model_name]);

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
        <CloseIcon sx={{ cursor: 'pointer' }} fontSize='1rem' onClick={onCloseAdvancedSettings} />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <SingleGroupSelect
          label={'Embedding model'}
          value={embeddingModelValue}
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
        <Slider
          label='Fetch K (1 – 50)'
          value={+(fetch_k ?? DEFAULT_FETCH_K)}
          step={1}
          range={[1, 50]}
          onChange={onChangeFetchK}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Page Top K (1 – 30)'
          value={+(page_top_k ?? DEFAULT_PAGE_TOP_K)}
          step={1}
          range={[1, 30]}
          onChange={onChangePageTopK}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Cut-off score (0 – 1)'
          value={cut_off_score ?? DEFAULT_CUT_OFF_SCORE}
          step={0.1}
          range={[0, 1]}
          onChange={onChangeCutoffScore} />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Top K (1 – 40)'
          value={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChangeTopK}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <SingleGroupSelect
          label={'Chat model'}
          value={chatModelValue}
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
          label='Temperature (0.1 – 1.0)'
          value={temperature ?? DEFAULT_TEMPERATURE}
          step={0.1}
          range={[0.1, 1]}
          onChange={onChangeTemperature} />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Top P (0 – 1)'
          value={+(top_p ?? DEFAULT_TOP_P)}
          range={[0, 1]}
          onChange={onChangeTopP}
        />
      </Box>
      <Box sx={{ height: '56px', width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        <StyledInput
          variant='standard'
          fullWidth
          id='maximum_length'
          name='maximum_length'
          label='Maximum length'
          type="number"
          value={maximum_length}
          onChange={onChangeInternalMaxLength}
          inputProps={{
            style: { textAlign: 'left' },
          }}
        />
      </Box>
    </Box>
  );
}
export default AdvancedChatSettings;