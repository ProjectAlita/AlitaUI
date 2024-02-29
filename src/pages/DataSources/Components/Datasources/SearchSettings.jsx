import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box } from '@mui/material';
import Slider from '@/components/Slider';
import { DEFAULT_TOP_K, DEFAULT_CUT_OFF_SCORE } from '@/common/constants';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';

const SearchSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
  top_k,
  onChangeTopK,
  cut_off_score,
  onChangeCutoffScore,
}) => {
  const { embeddingModelOptions } = useModelOptions();

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
      <Box sx={{ width: 'calc(50% - 12px)' }}>
        <Slider
          label='Top K'
          value={+(top_k ?? DEFAULT_TOP_K)}
          step={1}
          range={[1, 40]}
          onChange={onChangeTopK}
        />
      </Box>
      <Box sx={{ width: 'calc(50% - 12px)' }}>
        <Slider
          label='Cut-off score (0 – 1.00)'
          value={cut_off_score ?? DEFAULT_CUT_OFF_SCORE}
          step={0.1}
          range={[0, 1]}
          onChange={onChangeCutoffScore} />
      </Box>
    </Box>
  );
}
export default SearchSettings;