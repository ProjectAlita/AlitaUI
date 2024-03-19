import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box, Typography } from '@mui/material';
import Slider from '@/components/Slider';
import { DEFAULT_TOP_K, DEFAULT_FETCH_K, DEFAULT_PAGE_TOP_K, DEFAULT_CUT_OFF_SCORE } from '@/common/constants';
import CloseIcon from '@/components/Icons/CloseIcon';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react'
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';

const AdvancedSearchSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  fetch_k,
  onChangeFetchK,
  page_top_k,
  onChangePageTopK,
  top_k,
  onChangeTopK,
  cut_off_score,
  onChangeCutoffScore,
  str_content,
  onChangeStrContent,
  onCloseAdvancedSettings
}) => {
  const { embeddingModelOptions } = useModelOptions();
  const searchEmbeddingModelValue = useMemo(() =>
  (
    selectedEmbeddingModel.integration_uid &&
      selectedEmbeddingModel.model_name ?
      genModelSelectValue(selectedEmbeddingModel.integration_uid,
        selectedEmbeddingModel.model_name,
        getIntegrationNameByUid(selectedEmbeddingModel.integration_uid, embeddingModelOptions)) : ''
  ), [embeddingModelOptions, selectedEmbeddingModel.integration_uid, selectedEmbeddingModel.model_name]);
  const theme = useTheme();

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
          value={searchEmbeddingModelValue}
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
          label='Initial Lookup Result (1 – 50)'
          value={+(fetch_k ?? DEFAULT_FETCH_K)}
          step={1}
          range={[1, 50]}
          onChange={onChangeFetchK}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Pages Per Document (1 – 30)'
          value={+(page_top_k ?? DEFAULT_PAGE_TOP_K)}
          step={1}
          range={[1, 30]}
          onChange={onChangePageTopK}
        />
      </Box>
      <Box sx={{ width: '100%', height: '56px' }}>
        <Slider
          label='Expected Search Results (1 – 40)'
          value={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChangeTopK}
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
      <Box sx={{ width: '100%', height: '56px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        <FormControlLabel
          control={
            <Checkbox checked={!!str_content}
              size='medium'
              sx={{
                color: theme.palette.icon.fill.default,
              }}
              onChange={onChangeStrContent}
            />
          }
          label={
            <Typography variant='bodyMedium'>
              String content
            </Typography>}
        />
      </Box>
    </Box>
  );
}
export default AdvancedSearchSettings;