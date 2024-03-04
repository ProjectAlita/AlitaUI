import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box, Typography } from '@mui/material';
import Slider from '@/components/Slider';
import { useCallback } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { DEFAULT_CUT_OFF_SCORE } from '@/common/constants';
import { useTheme } from '@emotion/react';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';

const DeduplicateSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  cut_off_score,
  onChangeCutoffScore,
  generateFile,
  onChangeGenerateFile,
}) => {
  const theme = useTheme();
  const { embeddingModelOptions } = useModelOptions();

  const onCheckedGenerateFile = useCallback(
    (event, checked) => {
      onChangeGenerateFile(checked);
    },
    [onChangeGenerateFile],
  );

  return (
    <Box sx={{ marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
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
      <Box sx={{ flex: 1, marginRight: '24px' }}>
        <Slider
          label='Cut-off score (0 – 1.00)'
          value={cut_off_score ?? DEFAULT_CUT_OFF_SCORE}
          step={0.1}
          range={[0, 1]}
          onChange={onChangeCutoffScore} />
      </Box>
      {/* temporary hiding this checkbox */}
      <Box sx={{ flexDirection: 'row', justifyContent: 'flex-end' }} display={'none'}>
        <FormControlLabel
          control={
            <Checkbox checked={generateFile}
              size='medium'
              sx={{
                color: theme.palette.icon.fill.default,
              }}
              onChange={onCheckedGenerateFile}
            />
          }
          label={
            <Typography variant='bodyMedium'>
              Generate file
            </Typography>}
        />
      </Box>
    </Box>
  );
}
export default DeduplicateSettings;