import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box } from '@mui/material';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import { useMemo } from 'react'
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';

const SearchSettings = ({
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
}) => {
  const { embeddingModelOptions } = useModelOptions();
  const embeddingModelValue = useMemo(() =>
  (
    selectedEmbeddingModel.integration_uid &&
      selectedEmbeddingModel.model_name ?
      genModelSelectValue(selectedEmbeddingModel.integration_uid,
        selectedEmbeddingModel.model_name,
        getIntegrationNameByUid(selectedEmbeddingModel.integration_uid, embeddingModelOptions)) : ''
  ),
    [embeddingModelOptions, selectedEmbeddingModel.integration_uid, selectedEmbeddingModel.model_name]);

  return (
    <Box sx={{ marginTop: '24px', gap: '24px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
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
  );
}
export default SearchSettings;