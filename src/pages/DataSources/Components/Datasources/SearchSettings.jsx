import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box } from '@mui/material';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';

const SearchSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
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
    </Box>
  );
}
export default SearchSettings;