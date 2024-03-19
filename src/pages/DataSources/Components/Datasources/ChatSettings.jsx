import SingleGroupSelect from '@/components/SingleGroupSelect';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import useModelOptions from './useModelOptions';
import ModelCompatibleIcon from './ModelCompatibleIcon';
import { genModelSelectValue, getIntegrationNameByUid } from '@/common/promptApiUtils';

const ChatSettings = ({
  onChangeChatModel,
  selectedChatModel,
  onChangeEmbeddingModel,
  selectedEmbeddingModel,
  isSelectedEmbeddingModelCompatible,
}) => {
  const { modelOptions, embeddingModelOptions } = useModelOptions();
  const chatModelValue = useMemo(() =>
  (
    selectedChatModel.integration_uid &&
      selectedChatModel.model_name ?
      genModelSelectValue(selectedChatModel.integration_uid,
        selectedChatModel.model_name,
        getIntegrationNameByUid(selectedChatModel.integration_uid, modelOptions)) : ''
  ), [modelOptions, selectedChatModel.integration_uid, selectedChatModel.model_name]);

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
    <Box sx={{ marginTop: '24px', gap: '16px 24px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <Box sx={{ width: 'calc(50% - 12px)', height: '56px' }}>
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
      <Box sx={{ width: 'calc(50% - 12px)', height: '56px' }}>
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
    </Box>
  );
}
export default ChatSettings;